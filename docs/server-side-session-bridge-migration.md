# Server-side session bridge migration

## Mục tiêu và phạm vi

Tài liệu này mô tả lộ trình chuyển Whisper từ Supabase JavaScript SDK trực tiếp trong browser sang mô hình **server-side session bridge**. Sau migration, browser không giữ access token/refresh token trong `localStorage`, `sessionStorage`, JavaScript global hoặc cookie mà JavaScript đọc được. Session được giữ trong cookie `HttpOnly`, `Secure` và `SameSite=Lax` cho các flow redirect thông thường.

> Đây là migration kiến trúc, không phải chỉ đổi một flag trong `createClient`. Vì Whisper hiện dùng Supabase SDK trực tiếp cho database, storage và realtime, cần chuyển toàn bộ các thao tác authenticated đó qua server routes trước khi tắt browser session persistence.

## Trạng thái hiện tại cần xử lý

| Khu vực | Hiện trạng | Đích sau migration |
| --- | --- | --- |
| Auth session | Supabase browser client có thể persist session phía browser | Server đọc session từ HttpOnly cookie; browser không đọc token |
| Database | Một số thao tác đi qua `entities`/Supabase SDK trong browser | Server routes xác thực session rồi thực thi query với user context |
| Realtime | Browser subscribe Supabase channels trực tiếp | Server-managed SSE/WebSocket hoặc polling có kiểm tra session |
| OAuth callback | Provider redirect về app để browser SDK xử lý URL | Callback server đổi code lấy session và set cookie |
| Account linking | `linkIdentity` gọi từ browser | Endpoint server tạo link sau khi xác thực user hiện tại |
| Authorization | RLS hỗ trợ bảo vệ database | Kết hợp server session, role, ownership và RLS; không tin field từ client |
| Translation API | Đã có bearer guard cho `/api/translate*` | Chuyển sang cookie session, vẫn giữ 401/403/rate limit |

## Kiến trúc đích

```text
Browser
  │  HTTPS + credentials: include, không có token trong JS
  ▼
Express session bridge
  ├─ GET /auth/callback       đổi OAuth code, set HttpOnly cookies
  ├─ POST /api/auth/link      yêu cầu session, bắt đầu link provider
  ├─ POST /api/auth/logout    revoke session, clear cookies
  ├─ GET /api/me              user đã verify từ session
  ├─ /api/*                   requireSession + role/ownership checks
  └─ SSE/WebSocket gateway    user context từ cookie, không nhận role/userId tin cậy
  ▼
Supabase server client (@supabase/ssr)
  ├─ auth.getUser()
  ├─ auth.exchangeCodeForSession(code)
  └─ database/storage queries với user context
```

Cookie nên được đặt với `HttpOnly`, `Secure` ở staging/production, `SameSite=Lax`, `Path=/` và thời hạn ngắn hợp lý. Với các flow cross-site đặc biệt, chỉ cân nhắc `SameSite=None` khi thật sự cần và luôn đi cùng `Secure`.

## Giai đoạn 0 — Chuẩn bị và đóng băng hành vi

Trước khi đổi auth, tạo branch riêng và chụp baseline:

```bash
git checkout -b migration/server-session-bridge
pnpm lint
pnpm build
pnpm test:e2e
```

Bật logging audit dạng structured nhưng **không ghi URL có query token, Authorization header, cookie value, password hoặc secret**. Lưu các metric không nhạy cảm: endpoint, status, provider, request ID, user hash một chiều nếu cần điều tra và thời gian xử lý.

Tạo các secret server-side riêng trong Vercel/staging, không đưa vào `.env.example` dạng giá trị thật:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<server-runtime-anon-key>
SESSION_COOKIE_NAME=whisper_session
SESSION_COOKIE_SAMESITE=lax
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_DOMAIN=staging.your-domain.com
```

Không dùng `SUPABASE_SERVICE_ROLE_KEY` để thay thế authorization. Nếu một tác vụ thật sự cần service role, tách endpoint, allowlist thao tác, xác thực user trước và không bao giờ đưa key ra browser.

## Giai đoạn 1 — Tạo server Supabase client dùng cookies

Cài dependency trực tiếp:

```bash
pnpm add @supabase/ssr cookie
pnpm add -D @types/cookie
```

Tạo `server/auth/serverSupabase.js` với các nguyên tắc:

1. Đọc tất cả cookie từ `req.headers.cookie`.
2. Tạo `createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, { cookies: { getAll, setAll } })`.
3. Khi Supabase yêu cầu set cookie, serialize mọi cookie chunk với `HttpOnly`, `Secure` theo môi trường, `SameSite=Lax`, `Path=/` và các thuộc tính expiry do Supabase cung cấp.
4. Gắn `Set-Cookie` bằng `res.append('Set-Cookie', serializedCookie)`; không trả cookie trong JSON.
5. Không expose client server này qua module được import vào Vite/browser bundle.

Pseudo-code:

```js
import { createServerClient } from '@supabase/ssr';
import { parse, serialize } from 'cookie';

export function createRequestSupabase(req, res) {
  const requestCookies = parse(req.headers.cookie || '');
  const isProduction = process.env.NODE_ENV === 'production';

  return createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return Object.entries(requestCookies).map(([name, value]) => ({ name, value }));
      },
      setAll(cookies) {
        for (const { name, value, options } of cookies) {
          res.append('Set-Cookie', serialize(name, value, {
            ...options,
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            path: '/',
          }));
        }
      },
    },
  });
}
```

Tên và cách chunk cookie phải để `@supabase/ssr` quản lý; không tự tạo một JWT cookie format riêng.

## Giai đoạn 2 — Server callback cho password/OAuth

Tạo `GET /auth/callback`:

1. Nhận `code` từ Supabase OAuth callback.
2. Xác thực `state`/PKCE theo cơ chế của Supabase SSR.
3. Gọi `supabase.auth.exchangeCodeForSession(code)` trên server client.
4. Nếu thành công, gọi `auth.getUser()` và `ensureProfile` server-side.
5. Xóa query `code`, `error`, `error_description` khỏi URL redirect.
6. Redirect chỉ tới path nội bộ đã allowlist; từ chối absolute URL, `//host`, backslash và URL chứa token.
7. Nếu thất bại, redirect tới `/login?auth_error=oauth_callback_failed` với mã lỗi không nhạy cảm, không đính kèm provider response raw.

Tại Supabase **Authentication → URL Configuration**, redirect URL của provider vẫn là:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

App redirect được allowlist riêng, ví dụ:

```text
https://staging.your-domain.com/auth/callback
https://staging.your-domain.com/login
```

Chuyển `signInWithOAuth` sang một endpoint server `GET /api/auth/start/:provider` hoặc giữ provider authorization URL do Supabase tạo, nhưng callback cuối cùng phải đi qua server bridge. Không đặt access token hoặc refresh token trong query string.

## Giai đoạn 3 — Auth middleware và authorization policy

Tạo middleware theo các lớp độc lập:

```js
export async function requireSession(req, res, next) {
  const supabase = createRequestSupabase(req, res);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return res.status(401).json({ error: 'Authentication required.' });
  req.auth = { user: data.user, supabase };
  return next();
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.auth?.profile?.role;
    if (!allowedRoles.includes(role)) return res.status(403).json({ error: 'Forbidden.' });
    return next();
  };
}

export function requireOwnership(getOwnerId) {
  return async (req, res, next) => {
    const ownerId = await getOwnerId(req);
    if (!ownerId || ownerId !== req.auth.user.id) return res.status(403).json({ error: 'Forbidden.' });
    return next();
  };
}
```

Không lấy `role`, `permission`, `ownerId`, `userId` hoặc `isAdmin` từ request body để authorize. Nếu client gửi giá trị giả mạo, server bỏ qua và trả HTTP 401 khi thiếu session hoặc 403 khi session hợp lệ nhưng không đủ quyền.

Tất cả endpoint nhạy cảm phải được lập inventory và gắn middleware trước khi cutover:

| Nhóm endpoint | Guard bắt buộc |
| --- | --- |
| Profile read/update | `requireSession` + `user.id === profile.id` |
| Posts/comments/likes | `requireSession` + ownership/RLS |
| Chat room/message | `requireSession` + participant membership |
| Media upload | `requireSession` + bucket policy + ownership |
| Account linking | `requireSession` + current user verification |
| Admin/moderation | `requireSession` + server-loaded role + `requireRole` |
| Translation | `requireSession` + rate limit + input length limit |
| Developer/MCP consent | `requireSession` + opaque handle validation + single-use grant |

## Giai đoạn 4 — Di chuyển account linking

Account linking phải bắt đầu từ Settings khi user đã đăng nhập bằng password hoặc provider hiện tại.

Flow chuẩn:

1. `POST /api/auth/link/:provider` nhận provider allowlist (`google`, `apple`, `azure`).
2. Server gọi `auth.getUser()` từ cookie session; nếu thiếu, trả 401.
3. Server kiểm tra identity hiện tại và chống CSRF bằng cookie/state do server quản lý.
4. Server khởi tạo OAuth link redirect với callback `/auth/callback?mode=link`.
5. Callback đổi code trên server, kiểm tra identity provider trả về có thuộc current user không.
6. Nếu email/identity đã thuộc user khác, trả lỗi `identity_already_exists`, không merge và không đổi tài khoản nào.
7. Nếu thành công, ghi audit event `identity_linked` không chứa email/token/secret raw và redirect về `/settings?linked=google`.
8. `POST /api/auth/unlink/:provider` chỉ cho phép khi user còn ít nhất một phương thức đăng nhập khác và yêu cầu re-authentication gần đây.

Không cho phép endpoint nhận `targetUserId` từ client để quyết định tài khoản đích. Tài khoản đích luôn là `req.auth.user.id` từ session đã verify.

## Giai đoạn 5 — Chuyển data layer khỏi Supabase browser SDK

Đây là phần lớn nhất của migration. Tạo server route cho từng nhóm thao tác và thay client calls theo thứ tự:

1. `GET/POST/PATCH /api/profile`.
2. `GET/POST/PATCH/DELETE /api/posts`, comments, likes và saved posts.
3. `GET/POST/PATCH /api/chat/rooms`, participants và messages.
4. `POST /api/storage/upload` với signed upload hoặc server proxy.
5. `GET /api/realtime/ticket` hoặc server SSE/WebSocket gateway cho chat.
6. Chuyển hooks và `entities` từ Supabase client calls sang `fetch('/api/...', { credentials: 'include' })`.
7. Xóa direct browser `createClient` khỏi các module authenticated.

Mỗi route phải có:

- `requireSession` trước business logic.
- Input schema validation, giới hạn kích thước và enum allowlist.
- Server-derived user ID/role/ownership.
- Query có predicate ownership ngay cả khi RLS đang bật.
- Error response generic, không trả raw Supabase error chứa credential/context nhạy cảm.
- Audit event cho thay đổi role, permission, ownership, provider link và failed auth.

## Giai đoạn 6 — Tắt token persistence phía browser

Chỉ sau khi data/realtime migration hoàn tất:

1. Xóa `persistSession: true` khỏi browser client hoặc xóa hẳn browser auth client authenticated.
2. Đặt `detectSessionInUrl: false` trên mọi client không chịu trách nhiệm callback server.
3. Xóa các custom auth token/localStorage keys cũ, gồm `whisper_b44_auth_token` và mọi helper `setToken`.
4. Xóa code đọc access/refresh token từ query/hash/localStorage/sessionStorage.
5. `getUser()` ở browser gọi `/api/me`, không gọi Supabase Auth trực tiếp.
6. Logout gọi `POST /api/auth/logout`, server revoke/clear cookie rồi trả status generic.
7. Đảm bảo JS không thể đọc session cookie bằng `document.cookie`; kiểm tra cookie có `HttpOnly`.

Không giữ một “shadow session” trong localStorage để làm fallback production. Local preview nên dùng mock adapter riêng và phải bị tách khỏi staging/production bằng build flag.

## Giai đoạn 7 — Rate limiting, CSRF và audit

Áp dụng rate limit khác nhau cho auth-sensitive endpoint:

| Endpoint | Gợi ý giới hạn |
| --- | --- |
| OAuth start/callback | 20 request/phút/IP |
| Login/password | 10 request/phút/IP + account key |
| Account linking | 10 request/10 phút/user |
| Translation | 60 request/phút/user/IP |
| Password reset | 5 request/15 phút/email hash |

Với cookie-authenticated state-changing requests, bật CSRF protection bằng SameSite cookie kết hợp CSRF token/double-submit hoặc Origin/Referer allowlist. Không dùng CORS `*` với credentials.

Audit log tối thiểu gồm `event`, `requestId`, `provider`, `route`, `status`, `ip hash`, `user id hash` và timestamp. Không ghi `Authorization`, cookie header, access token, refresh token, OAuth code, password, Client Secret hoặc raw provider error.

## Giai đoạn 8 — Playwright acceptance tests

Bổ sung các test bắt buộc:

```js
test('session cookie is HttpOnly and Secure on staging', async ({ request }) => {
  const response = await request.post('/api/auth/test-session', { data: {} });
  const cookies = response.headers()['set-cookie'] || '';
  expect(cookies).toMatch(/HttpOnly/i);
  expect(cookies).toMatch(/Secure/i);
  expect(cookies).toMatch(/SameSite=Lax/i);
});

test('direct API call without session returns 401', async ({ request }) => {
  const response = await request.patch('/api/profile', { data: { role: 'admin', ownerId: 'other-user' } });
  expect(response.status()).toBe(401);
});

test('client cannot change role or ownership', async ({ page }) => {
  await page.goto('/settings');
  const result = await page.evaluate(async () => {
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin', ownerId: 'other-user' }),
    });
    return { status: response.status(), body: await response.text() };
  });
  expect([401, 403]).toContain(result.status);
  expect(result.body).not.toMatch(/access_token|refresh_token|secret|password/i);
});
```

Không test bằng cách in cookie/token ra console. Test provider flows bằng dedicated staging accounts, GitHub Secrets và bật riêng qua `E2E_RUN_PROVIDER_AUTH=1`. Khi chạy authenticated flow, tắt video/trace hoặc scrub input sensitive trước khi upload artifacts.

## Giai đoạn 9 — Dual-run và cutover

Chạy hai mode trong staging:

- **Shadow mode:** server bridge xác thực và log kết quả, nhưng browser SDK vẫn phục vụ data layer.
- **Canary mode:** một nhóm test user dùng server routes; đo 401/403, latency, realtime disconnect và OAuth callback success.
- **Full staging:** tất cả traffic staging dùng server routes trong ít nhất một chu kỳ test đầy đủ.
- **Production cutover:** bật feature flag theo environment, giữ rollback flag trong 24–48 giờ.

Acceptance criteria:

| Tiêu chí | Điều kiện đạt |
| --- | --- |
| Token exposure | Không có access/refresh token trong localStorage, sessionStorage, window globals, URL hoặc JSON API response. |
| Cookie | Auth cookie có HttpOnly + Secure + SameSite đúng environment; JS không đọc được. |
| OAuth | Google, Apple, Microsoft login và account linking callback thành công trên staging. |
| Duplicate identity | Trả lỗi an toàn, không merge nhầm hoặc đổi owner. |
| Authorization | Client sửa role/owner/permission giả bị bỏ qua hoặc nhận 401/403. |
| Direct API | Console/API call không session không bypass được auth. |
| Logging | Không có secret/token/cookie/password trong logs và artifacts. |
| Recovery | Logout, refresh, expired session, revoked session và callback error đều có hành vi rõ ràng. |

## Rollback plan

Nếu tỷ lệ callback failure hoặc 401 tăng vượt ngưỡng:

1. Tắt feature flag server bridge ở staging/production.
2. Không xóa cookie cũ cho tới khi xác định phiên nào còn hợp lệ; revoke session nghi ngờ từ server.
3. Giữ endpoint callback cũ read-only trong thời gian rollback, không phát token mới qua URL.
4. Điều tra audit event bằng request ID, không yêu cầu người dùng gửi token/cookie.
5. Sau khi sửa, chạy lại canary trước khi full cutover.
6. Xóa browser persistence cũ chỉ sau khi server bridge đã ổn định và có migration window thông báo người dùng.

## Definition of Done

Migration chỉ được coi là hoàn tất khi toàn bộ authenticated data/realtime operations đi qua server bridge, browser không còn Supabase session persistence, cookie auth được kiểm tra bằng Playwright trên staging, và các API nhạy cảm đều có server-side session + role + ownership verification. Việc chỉ thêm `HttpOnly` cookie cho callback nhưng vẫn để browser SDK đọc session không đạt chuẩn cookie-only.

## Tham khảo chính thức

[1]: https://supabase.com/docs/guides/auth/server-side "Supabase Server-Side Auth"
[2]: https://supabase.com/docs/guides/auth/server-side/creating-a-client "Creating a Supabase client for SSR"
[3]: https://supabase.com/docs/guides/auth/sessions/pkce-flow "Supabase PKCE flow"
[4]: https://supabase.com/docs/reference/javascript/auth-exchangecodeforsession "Supabase exchangeCodeForSession"
[5]: https://docs.github.com/actions/security-guides/using-secrets-in-github-actions "GitHub Actions secrets"

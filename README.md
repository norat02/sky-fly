# Whisper — Real-Time Sketchbook Social & Chat Platform

Whisper is an Instagram-style social media and real-time messaging application with a distinctive hand-drawn sketchbook aesthetic. It features rich messaging, voice notes, live AI translation, 24-hour disappearing stories, social feeds, and is fully connected to a production-ready **Supabase** backend (Authentication, PostgreSQL Database with Row Level Security, Realtime subscriptions, and Storage).

---

## 🏗 Architecture Overview

```
                        ┌────────────────────────┐
                        │      GitHub Repo       │
                        └───────────┬────────────┘
                                    │ (CI/CD)
                                    ▼
                        ┌────────────────────────┐
                        │    Vercel Hosting      │
                        │     (React + Vite)     │
                        └───────────┬────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│    Supabase Auth    │  │ Supabase PostgreSQL │  │  Supabase Storage   │
│ (Sign up, Log in,   │  │  (Profiles, Posts,  │  │  (Avatars, Posts,   │
│  Password Recovery, │  │   Likes, Comments,  │  │   Stories, Media,   │
│  Google / Apple /   │  │  Stories, Messages) │  │   Voice recordings) │
│  Microsoft OAuth)   │  │                     │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## ✨ Features

- **Supabase Authentication**:
  - Email & Password sign-up and login with automatic user profile provisioning.
  - One-click Google, Apple, and Microsoft OAuth login and registration.
  - Password reset flow with secure email recovery links.
  - Session persistence across browser reloads.
  - Protected routes and authenticated redirects.
- **Supabase PostgreSQL & Row Level Security (RLS)**:
  - Strongly typed relational tables with foreign keys and cascading deletes.
  - Granular RLS policies protecting users' private data and enforcing ownership.
  - Indexes on query columns (`user_id`, `created_at`, `room_id`, `post_id`).
  - Auto-updating `updated_at` triggers and automated profile generator triggers.
- **Supabase Realtime Subscriptions**:
  - Live broadcast of messages, reactions, typing indicators, and room activity via PostgreSQL changes.
- **Supabase Storage**:
  - Storage bucket integration for `avatars`, `posts`, `stories`, and `chat_media`.
- **Hand-Drawn Sketchbook UI / UX**:
  - Signature inky pen & paper aesthetic (`Kalam` & `Patrick Hand` typography, custom doodle borders, warm paper light mode, and dark inky mode).
- **Fast Live Translation**:
  - Per-user inline translation across 38 supported languages, with local cache, SLM, OpenRouter, Gemini, DeepSeek, and OpenAI fallbacks.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, Framer Motion
- **Backend & Database**: Supabase (PostgreSQL 15+, Auth, Realtime, Storage)
- **Icons & UI**: Lucide React, Sonner
- **Deployment**: Vercel (Production SPA configuration via `vercel.json`)
- **Version Control**: Git & GitHub

---

## 🚀 Supabase Setup Guide

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **"New Project"**, choose your organization, enter a project name (e.g. `whisper-chat`), and set a secure database password.
3. Select the region closest to your users.

### 2. Apply Database Schema & Migrations
1. In your Supabase Dashboard, navigate to the **SQL Editor** tab on the left sidebar.
2. Click **"New query"**.
3. Copy the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and paste it into the editor.
4. Click **"Run"**.
   - This creates the `profiles`, `posts`, `likes`, `comments`, `follows`, `stories`, `saved_posts`, `notifications`, `chat_rooms`, `room_participants`, and `chat_messages` tables.
   - It configures all indexes, triggers, and Row Level Security (RLS) policies.
   - It adds the tables to the `supabase_realtime` publication.
   - It provisions the `avatars`, `posts`, `stories`, and `chat_media` storage buckets.

### 3. Configure Supabase Authentication
1. Go to **Authentication** -> **URL Configuration**.
2. Set **Site URL** to your production URL (for example, `https://your-whisper-app.vercel.app`) and add the local URL during development.
3. Under **Redirect URLs**, add the exact app origins/paths you use, such as:
   - `http://localhost:3000/**`
   - `https://your-whisper-app.vercel.app/**`
4. Configure the social providers under **Authentication** -> **Providers**:
   - **Google**: create a Web OAuth client in [Google Auth Platform](https://console.cloud.google.com/auth/clients), add `https://staging.your-domain.com` as an Authorized JavaScript origin, add `https://<project-ref>.supabase.co/auth/v1/callback` as an Authorized redirect URI, then paste its Client ID and Client Secret into Supabase. Supabase's Google setup is documented [here](https://supabase.com/docs/guides/auth/social-login/auth-google).
   - **Apple**: create a Sign in with Apple Services ID, add `staging.your-domain.com` as the domain and `https://<project-ref>.supabase.co/auth/v1/callback` as the Return URL, then add the Team ID, Key ID and `.p8` private key in Supabase. Review the [Apple provider guide](https://supabase.com/docs/guides/auth/social-login/auth-apple); Apple web client secrets must be rotated periodically.
   - **Azure (Microsoft)**: register a Web app in Microsoft Entra ID with `https://<project-ref>.supabase.co/auth/v1/callback` as the redirect URI, create a client secret, and configure the Client ID and secret in Supabase Azure. Whisper uses provider key `azure`; see the [Azure provider guide](https://supabase.com/docs/guides/auth/social-login/auth-azure).
5. In each provider console, register the Supabase callback URL shown by the Supabase provider page. For the hosted Supabase project it normally has this shape:

   ```text
   https://<project-ref>.supabase.co/auth/v1/callback
   ```

   Keep Whisper's app redirect URL in Supabase **URL Configuration** so the session returns to the app after authentication. In the client code, the provider keys are `google`, `apple`, and `azure` for Microsoft.

> OAuth client secrets belong in Supabase's provider settings, not in `.env.local` or the browser bundle. The Whisper frontend only needs the Supabase URL and anon key.

### 4. Copy API Keys
1. Go to **Project Settings** -> **API**.
2. Copy the **Project URL** (`https://xyzcompany.supabase.co`).
3. Copy the **anon / public** key (`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`).

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/norat02/whisper-chat.git
   cd whisper-chat
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a local file from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Required for the real Supabase-backed app:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
   ```
   Recommended for server-side translation:
   ```env
   GEMINI_API_KEY=your-server-side-gemini-key
   ```
   The optional `VITE_*` translation keys are browser-visible after bundling. Never place a Supabase service-role key, OAuth client secret, or other high-privilege secret in a `VITE_*` variable. See [`.env.example`](.env.example) for the complete reference.

4. **Start the development server**:
   ```bash
   pnpm dev
   ```
   Open `http://localhost:3000` in your browser.

### OAuth E2E tests on staging

The repository includes Playwright tests in [`tests/e2e/oauth.spec.js`](tests/e2e/oauth.spec.js). The default suite checks that Login and Register render all three provider buttons and simulates callback errors for canceled consent and duplicate email. Real provider redirects and authenticated flows are opt-in because they require external accounts, consent screens, MFA handling, and provider secrets.

Install the Playwright browser once, then run the safe staging smoke suite:

```bash
pnpm exec playwright install chromium
E2E_BASE_URL=https://staging.your-domain.com pnpm test:e2e
```

To exercise provider redirects, use:

```bash
E2E_BASE_URL=https://staging.your-domain.com \\
E2E_TEST_OAUTH_REDIRECTS=1 \\
pnpm test:e2e
```

For full authenticated flows, create dedicated non-production accounts and inject their credentials only through a secure CI secret store or an untracked local `.env.local` file:

```bash
E2E_BASE_URL=https://staging.your-domain.com \\
E2E_RUN_PROVIDER_AUTH=1 \\
E2E_GOOGLE_EMAIL=... E2E_GOOGLE_PASSWORD=... \\
E2E_APPLE_EMAIL=... E2E_APPLE_PASSWORD=... \\
E2E_MICROSOFT_EMAIL=... E2E_MICROSOFT_PASSWORD=... \\
pnpm test:e2e
```

The full provider tests may require manual MFA or consent changes and should never use production accounts. Review the generated HTML report with `pnpm test:e2e:report` after a run.

---

## 🚢 Deploying to Vercel

The repository includes a ready-to-use `vercel.json` configured for Vite SPA routing:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: migrate to Supabase backend & prepare for Vercel deployment"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** -> **"Project"**.
   - Select your GitHub repository and click **Import**.

3. **Configure Environment Variables in Vercel**:
   Add the following variables in the Vercel project deployment settings. OAuth client IDs/secrets are configured in Supabase **Authentication -> Providers**, not as Vercel frontend variables:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://xyz.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
   - `GEMINI_API_KEY`: *(Recommended for server-side translation)* Gemini API key
   - `VITE_OPENROUTER_API_KEY`: *(Optional, browser-visible)* OpenRouter fallback key
   - `VITE_GEMINI_API_KEY`: *(Optional, browser-visible)* Gemini fallback key
   - `VITE_DEEPSEEK_API_KEY`: *(Optional, browser-visible)* DeepSeek fallback key
   - `VITE_OPENAI_API_KEY`: *(Optional, browser-visible)* OpenAI fallback key
   - `VITE_BASE44_APP_ID`, `VITE_BASE44_FUNCTIONS_VERSION`, `VITE_BASE44_APP_BASE_URL`: *(Optional)* Base44 compatibility values

4. **Deploy**:
   - Click **Deploy**. Vercel will automatically run `pnpm build` and launch the live site. After deployment, add the production URL to Supabase **Authentication -> URL Configuration -> Redirect URLs**, then confirm the same callback settings in Google Cloud, Apple Developer, and Microsoft Entra.

---

## 🗄 Database Schema Reference

| Table | Description | Primary Key / Relations |
| :--- | :--- | :--- |
| `profiles` | User profiles extending Supabase `auth.users` | `id` (FK to `auth.users`), `username` (UNIQUE), `avatar_url`, `bio` |
| `posts` | Feed posts | `id`, `user_id` (FK to `profiles`), `media_url`, `caption` |
| `likes` | Post likes | `id`, `post_id` (FK to `posts`), `user_id` (FK to `profiles`) |
| `comments` | Post comments | `id`, `post_id` (FK to `posts`), `user_id` (FK to `profiles`), `content` |
| `follows` | Social follow relationships | `id`, `follower_id` (FK to `profiles`), `followee_id` (FK to `profiles`) |
| `stories` | 24-hour disappearing stories | `id`, `user_id` (FK to `profiles`), `media_url`, `expires_at` |
| `saved_posts` | Bookmarked posts | `id`, `user_id` (FK to `profiles`), `post_id` (FK to `posts`) |
| `notifications` | User notifications | `id`, `recipient_id`, `actor_id`, `type`, `read` |
| `chat_rooms` | Instant & group chat rooms | `id`, `room_id` (UNIQUE), `room_name`, `status`, `expires_in` |
| `room_participants`| Chat room participant state | `id`, `room_id` (FK to `chat_rooms`), `nickname`, `online`, `is_typing` |
| `chat_messages` | Live chat messages & media | `id`, `room_id` (FK to `chat_rooms`), `sender_id`, `content`, `reactions` |

---

## 🔒 Security Best Practices

1. **Client-Side Keys**: Only the Supabase `anon` public key is used by the frontend. The `service_role` key, OAuth client secrets and AI provider secrets must never be bundled or exposed.
2. **Account Linking**: A signed-in user can link Google, Apple or Microsoft from **Settings → Linked sign-in methods**. The app verifies the current Supabase user before calling `linkIdentity`; linking never merges two separate Whisper accounts, and a provider identity already attached to another account is rejected without changing either account.
3. **Server API Authentication**: `/api/translate` and `/api/translate/batch` require a valid Supabase bearer token verified server-side through `auth.getUser()`. Direct unauthenticated calls receive HTTP 401, and requests are rate-limited with credential-free audit events.
4. **Security Headers**: The server sends `X-Content-Type-Options`, `X-Frame-Options`, strict referrer policy, permissions policy and HSTS in production.
5. **Authorization Boundary**: Client-supplied role, permission, owner ID and authentication state are not trusted by the server API. Database writes must continue to be enforced by Supabase RLS policies and ownership predicates.
6. **Error and Log Hygiene**: Auth/API errors are minimized and provider/credential values are redacted before server logging. Access tokens, refresh tokens and secrets are not returned from the custom auth adapter.
7. **Rate Limiting and Audit**: API requests use a bounded per-IP rate limit. Missing, invalid or excessive-authentication requests create audit events without token, cookie or secret values.
8. **Environment Isolation**: Secret keys are maintained in `.env` (ignored by `.gitignore`) and injected at deployment via Vercel or GitHub Actions secret storage.

### Important session architecture note

The current browser data layer still uses the Supabase JavaScript SDK for realtime and database access. Supabase's browser SDK manages its own session persistence for that client. The custom Whisper adapter no longer writes access tokens or refresh tokens to its own localStorage key, and the server-side translation APIs are protected independently. A complete **HttpOnly + Secure + SameSite cookie-only session** migration requires moving all authenticated database/realtime operations behind server routes or a server-side Supabase session bridge; it should be completed before making a strict cookie-only security claim for production.

### GitHub Actions staging E2E

The workflow [`.github/workflows/e2e-staging.yml`](.github/workflows/e2e-staging.yml) runs on every push to `staging` and can also be started manually. Configure the following GitHub Actions secrets:

| Secret | Purpose |
| --- | --- |
| `STAGING_URL` | HTTPS base URL of the staging deployment. |
| `E2E_TEST_OAUTH_REDIRECTS` | Set to `1` to exercise real provider redirects. Leave empty for UI-only smoke tests. |
| `E2E_RUN_PROVIDER_AUTH` | Set to `1` only when dedicated non-production provider accounts are available. |
| `E2E_GOOGLE_EMAIL` / `E2E_GOOGLE_PASSWORD` | Dedicated Google E2E account. |
| `E2E_APPLE_EMAIL` / `E2E_APPLE_PASSWORD` | Dedicated Apple E2E account. |
| `E2E_MICROSOFT_EMAIL` / `E2E_MICROSOFT_PASSWORD` | Dedicated Microsoft E2E account. |

The workflow never prints these values. Do not use production accounts, and do not enable full provider authentication unless the staging provider consoles, MFA strategy and callback URLs are ready.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Runs the local app/server development server |
| `pnpm build` | Builds the frontend and bundled server to `dist/` |
| `pnpm preview` | Serves the production frontend locally for verification |
| `pnpm lint` | Runs ESLint on project files |
| `pnpm typecheck` | Runs the configured TypeScript check |
| `pnpm test:e2e` | Runs Playwright staging E2E tests |
| `pnpm test:e2e:ui` | Opens Playwright in UI mode |
| `pnpm test:e2e:report` | Opens the last Playwright HTML report |

For the complete environment variable list, required/optional status, OAuth notes, and secret-handling rules, see [`.env.example`](.env.example).

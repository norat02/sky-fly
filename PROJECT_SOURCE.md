# Whisper — Project Architecture & AI Coding Agent Handbook

This handbook provides an end-to-end technical overview and developer guide for **Whisper**, an anonymous real-time messaging and sketchbook social application. Future AI agents and engineers should consult this document before modifying the codebase.

---

## 1. Project Purpose & Overview

Whisper provides instant, frictionless, anonymous communication combined with a distinctive sketchbook / hand-drawn aesthetic. Users can create ephemeral or permanent rooms, chat in real-time, record voice clips, exchange files, post 24-hour stories, translate messages dynamically using OpenRouter / Gemini models, customize their profile sketch avatars, and interact across desktop and mobile devices.

---

## 2. Complete Feature List

1. **Anonymous & Authenticated Chat**:
   - Create 1:1 or group rooms instantly without requiring registration.
   - Join existing rooms via link or room code.
   - Optional guest session or full account registration with email/password and OTP code verification.
2. **Rich Real-Time Messaging**:
   - Text messages with auto-linkification and formatting.
   - Voice note recording with live waveform and inline audio player.
   - Media file upload (images, GIFs, documents, audio).
   - Message replies with preview banner.
   - Emoji reactions picker and counter.
   - Starred messages list and pinned messages drawer.
   - Live typing indicators.
3. **AI Live Translation**:
   - One-click translation of incoming and outgoing messages into English, Vietnamese, Hindi, and Hinglish.
   - Client-side and environment-variable OpenRouter API key management.
   - Translation caching and deduplication to minimize network overhead.
4. **24-Hour Stories**:
   - Visual stories with auto-expiration after 24 hours.
   - Fullscreen story viewer with progress bar, author attribution, and reaction replies.
   - Story creation with caption, image upload, and color theming.
5. **Social Graph & Notifications**:
   - User profile with customizable username, bio, and hand-drawn avatar colors.
   - Follow / Unfollow system with follower and following counts.
   - Activity center tracking new followers, room invites, message mentions, and story interactions.
6. **Hand-Drawn Sketchbook Aesthetic**:
   - Organic imperfect border radii (`sketch-border`, `sketch-fill`, `glass-card`).
   - Kalam and Patrick Hand Google typography.
   - Light and dark paper themes with smooth color transitions.
   - Ambient floating background orbs.

---

## 3. All Pages & Routes

Routing is configured in `src/App.jsx` using `react-router-dom`:

| Route | Component | Description | Protected |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Landing screen, quick room generator, join input, and saved rooms list | No |
| `/chat/:roomId` | `Chat.jsx` | Active chat room with message feed, input tray, search, and settings | Yes |
| `/messages` | `Messages.jsx` | Direct messages overview and active conversation list | Yes |
| `/profile` | `Profile.jsx` | Current user profile view with stories and activity | Yes |
| `/profile/:username`| `Profile.jsx` | Public profile view for any user | Yes |
| `/profile/edit` | `ProfileEdit.jsx`| Profile settings (username, avatar color, bio, status) | Yes |
| `/search` | `Search.jsx` | Global search for messages, rooms, and users | Yes |
| `/activity` | `Activity.jsx` | Activity & notification feed | Yes |
| `/settings` | `Settings.jsx` | App preferences, dark/light theme, OpenRouter API key | Yes |
| `/login` | `Login.jsx` | Email/password login and OAuth login options | No |
| `/register` | `Register.jsx` | Account registration with OTP step | No |
| `/forgot-password` | `ForgotPassword.jsx` | Password reset request | No |
| `/reset-password` | `ResetPassword.jsx` | Password reset confirmation | No |
| `/oauth-consent` | `OAuthConsent.jsx` | OAuth permissions consent screen | No |
| `*` | `PageNotFound.jsx` | 404 error page with navigation back home | No |

---

## 4. Components & Responsibilities

### Root & Navigation Components
- `src/App.jsx`: Main routing container wrapped with `AuthProvider`, `QueryClientProvider`, and `BrowserRouter`.
- `src/components/TabLayout.jsx`: Layout wrapper rendering `BottomNav` for tabbed views.
- `src/components/BottomNav.jsx`: Persistent bottom navigation bar on mobile / tab views (Home, Messages, Search, Activity, Profile).
- `src/components/ScrollToTop.jsx`: Resets scroll window on route changes.
- `src/components/ProtectedRoute.jsx`: Authentication gate guarding user routes.
- `src/components/ThemeToggle.jsx`: Switch button toggling dark and light mode.
- `src/components/BackgroundOrbs.jsx`: Animated floating background ambient bubbles.
- `src/components/Avatar.jsx`: Sketchbook doodle avatar with customizable background color and initials.
- `src/components/SavedRooms.jsx`: Quick carousel / list of bookmarked and recent rooms.

### Chat Components (`src/components/chat/`)
- `ChatInput.jsx`: Message input toolbar with text input, attachment upload button, voice recorder toggle, and emoji button.
- `MessageBubble.jsx`: Message item with status ticks, timestamp, reactions, reply button, and translation trigger.
- `MessageContent.jsx`: Message body renderer handling plain text, links, markdown, media images, and audio notes.
- `VoiceRecorder.jsx`: Microphone stream recorder with live timer, audio blob generation, and waveform preview.
- `EmojiPicker.jsx`: Hand-drawn popup emoji keyboard.
- `ReactionPicker.jsx`: Quick emoji reaction floating toolbar.
- `ReplyPreview.jsx`: Banner displaying the message currently being replied to.
- `DateSeparator.jsx`: Visual sticky divider for message dates (e.g. "Today", "Yesterday").
- `TypingIndicator.jsx`: Animated bouncing pencil / dots showing active room typers.
- `TranslatedText.jsx`: Inline translation display using the `useTranslation` hook.
- `MessageSearch.jsx`: In-room keyword search drawer.
- `PinnedMessages.jsx`: Drawer showing pinned messages in the active room.
- `StarredMessages.jsx`: Drawer showing current user's starred messages.
- `RoomInfo.jsx`: Room settings modal (room title, participant count, privacy toggle).
- `SettingsPanel.jsx`: Chat preferences drawer.
- `EmptyChatState.jsx`: Placeholder graphic displayed when a room has no messages yet.

### Stories Components (`src/components/stories/`)
- `StoriesTray.jsx`: Horizontal scroll tray showing friends' active 24h stories and "Post Story" button.
- `StoryViewer.jsx`: Fullscreen interactive story viewer with automatic progress countdown.
- `PostStory.jsx`: Story creator modal for uploading media or entering text cards.

### Messages Components (`src/components/messages/`)
- `ConversationItem.jsx`: Single conversation row in the Messages list showing last message, unread badge, and avatar.
- `NewChatModal.jsx`: Modal for starting a new direct chat by typing a username or room ID.

### UI Primitives (`src/components/ui/`)
- `button.jsx`: Styled button with variants (`default`, `outline`, `ghost`, `sketch`).
- `input.jsx`: Styled text input with sketchbook borders.
- `input-otp.jsx`: 6-digit OTP verification input component.
- `label.jsx`: Form field label primitive.
- `image.jsx`: Responsive image component with lazy loading and error fallbacks.
- `toast.jsx`, `toaster.jsx`, `use-toast.jsx`: Toast notification engine.

---

## 5. Tech Stack & Dependencies

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` / `react-dom` | `^18.2.0` | UI component library |
| `react-router-dom` | `^6.26.0` | Client-side routing |
| `vite` | `^6.1.0` | Development server and production bundler |
| `@vitejs/plugin-react` | `^4.3.4` | Vite React fast-refresh plugin |
| `@base44/vite-plugin` | `^1.0.30` | Base44 ecosystem Vite integration |
| `tailwindcss` | `^3.4.17` | Utility-first CSS framework |
| `tailwindcss-animate` | `^1.0.7` | Keyframe animation utilities for Tailwind |
| `framer-motion` | `^11.16.4` | Physics-based UI animations and transitions |
| `lucide-react` | `^0.475.0` | Consistent icon set |
| `sonner` | `^2.0.1` | Toast alerts for notifications and actions |
| `@tanstack/react-query` | `^5.84.1` | Asynchronous state management |
| `date-fns` | `^3.6.0` | Date formatting and manipulation |
| `clsx` / `tailwind-merge` | `^2.1.1` / `^3.0.2` | Conditional class joining and collision resolution |
| `class-variance-authority` | `^0.7.1` | Component variant style definitions |
| `input-otp` | `^1.4.2` | Accessible OTP input control |

---

## 6. Data Flow & Reactive Storage Engine

The application data layer is structured in `src/api/base44Client.js`:

```
┌────────────────────────────────────────────────────────┐
│                   React Components                     │
└───────────┬────────────────────────────────▲───────────┘
            │                                │
      async CRUD Calls                 Subscription Events
  (filter, create, update, delete)     (create, update, delete)
            │                                │
┌───────────▼────────────────────────────────┴───────────┐
│                 src/api/base44Client.js                │
│   - Entities (ChatRoom, ChatMessage, Profile, Story)   │
│   - Auth (isAuthenticated, me, login, register, otp)   │
│   - Integrations (Core.UploadFile -> DataURL / Blob)   │
└───────────┬────────────────────────────────▲───────────┘
            │                                │
    localStorage Cache             BroadcastChannel Sync
 (whisper_b44_entity_*)           (whisper_b44_channel)
            │                                │
┌───────────▼────────────────────────────────┴───────────┐
│              Browser LocalStorage / Cross-Tab          │
└────────────────────────────────────────────────────────┘
```

### Entities
- `ChatRoom`: `id`, `name`, `code`, `max_participants`, `allow_file_sharing`, `typing_preview`, `created_date`
- `ChatMessage`: `id`, `room_id`, `sender_id`, `sender_name`, `text`, `media_url`, `voice_url`, `reply_to_id`, `reactions`, `is_starred`, `is_pinned`, `created_date`
- `RoomParticipant`: `id`, `room_id`, `profile_id`, `nickname`, `avatar_color`, `is_typing`, `last_seen`
- `Profile`: `id`, `username`, `bio`, `avatar_color`, `created_date`
- `Follow`: `id`, `follower_id`, `following_id`, `created_date`
- `Story`: `id`, `profile_id`, `media_url`, `caption`, `created_date`
- `Notification`: `id`, `recipient_id`, `actor_id`, `type`, `message`, `read`, `created_date`

---

## 7. Authentication Flow

- Default state: Creates an initial anonymous user profile (`whisper_user@sketchbook.local`) so visitors can immediately test and chat with zero friction.
- Registered users:
  1. `Register.jsx` calls `db.auth.register({ email, password })`, generating a verification OTP.
  2. User enters the 6-digit OTP code in `Register.jsx`, which calls `db.auth.verifyOtp({ email, otpCode })`.
  3. On success, `AuthContext` stores the user record and updates `isAuthenticated = true`.
  4. Session state persists in `localStorage` (`whisper_b44_auth_user` and `whisper_b44_auth_token`).

---

## 8. Translation & AI Integration (Ultra-Fast Multi-Tier Engine)

- **High-Speed Translation Engine**: Located in `src/lib/openrouter.js` and `src/hooks/useTranslation.js`.
- **Multi-Tier Caching & Speed Optimizations**:
  - **Tier 1 (0ms Instant Matrix)**: Built-in instant dictionary for common conversational greetings and chat phrases.
  - **Tier 2 (0ms Memory & LocalStorage Cache)**: Dual-layer L1/L2 LRU cache with synchronous state initialization on first render.
  - **Tier 3 (Ultra-Fast OpenRouter Model)**: Queries `google/gemini-2.0-flash-001` with optimized token constraints (`max_tokens: 32-256`, `temperature: 0`) and fallback to `gemini-2.0-flash-lite`.
  - **Tier 4 (Zero-Key Web Fallback)**: Instant web translation fallback for zero-configuration translation.
  - **Proactive Prefetching**: Background prefetching warms the translation cache for incoming chat messages the millisecond they arrive.
- **Key Resolution**: Checks `localStorage.getItem('openrouter_api_key')` first, falling back to `import.meta.env.VITE_OPENROUTER_API_KEY`.
- **Target Languages**: `en` (English), `vi` (Vietnamese), `hi` (Hindi), `hinglish` (Hinglish), `es` (Spanish), `fr` (French).

---

## 9. Environment Variables

| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_OPENROUTER_API_KEY` | No | Optional global default OpenRouter API key for message translations |

---

## 10. Styling & Design System (Theme Directive: ALWAYS Follow Website Theme)

> **CRITICAL DIRECTIVE**: **ALWAYS do everything in the website theme.** All current and future pages, components, dialogs, form controls, and states must strictly follow the hand-drawn inky sketchbook aesthetic.

- **Fonts**: `@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Patrick+Hand&display=swap')`
- **Theme Variables**: Defined in `src/index.css` under `:root` and `.dark`.
- **Sketch Classes & Design Tokens**:
  - `.sketch-border`: Hand-drawn style multi-radii border (`rounded-[255px_15px_225px_15px/15px_225px_15px_255px]`).
  - `.sketch-fill`: Solid ink background button with offset hard drop-shadow (`box-shadow: 3px 3px 0px currentColor`).
  - `.glass-card`: Translucent paper container with ink outline and organic radius.
  - `.paper-texture`: Background paper grain pattern and warm parchment tones.
  - Custom avatars (`Avatar.jsx`) with colored ink borders and doodle vibes.
  - Playful animated pencils, bouncing dots, and ink-splatter accents.

---

## 11. Deployment Setup (Vercel & GitHub)

- **Vercel**: `vercel.json` configures Vite preset with `rewrites: [{ source: "/((?!.*\\.).*)", destination: "/index.html" }]` so client-side routes don't 404 on hard refresh.
- **Build**: `npm run build` runs `vite build`, outputting production assets to `dist/`.
- **GitHub**: `.gitignore` excludes `node_modules`, `dist`, `.env*` (except `.env.example`), logs, and system cache.

---

## 12. Verification & Development Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run ESLint checks
npm run lint

# 4. Fix ESLint issues automatically
npm run lint:fix

# 5. Run production build
npm run build

# 6. Preview production build
npm run preview
```

---

## 13. Instructions for Future AI Coding Agents

1. **ALWAYS DO EVERYTHING IN THE WEBSITE THEME**: This is a non-negotiable design mandate. Every new feature, UI component, page, form, modal, button, notification, and state MUST strictly preserve and extend Whisper's **hand-drawn sketchbook / doodle aesthetic**:
   - Apply hand-drawn CSS borders and classes (`.sketch-border`, `.sketch-fill`, `.glass-card`, `.paper-texture`).
   - Use Google Fonts `Kalam` (`font-display`) and `Patrick Hand` (`font-hand`).
   - Use custom avatar components (`Avatar.jsx`), ink-style offsets, hand-drawn badges, and cohesive light/dark paper tones.
   - Never render plain generic flat corporate UI elements.
2. **Preserve Reactive Storage**: Do not bypass `db.entities.*` methods with ad-hoc storage keys. The `base44Client.js` provider handles cross-tab reactive broadcasting automatically.
3. **No Unsolicited Dependencies**: Avoid adding heavy external libraries unless explicitly requested. Keep the bundle light and fast.
4. **Always Test Build & Lint**: Before concluding any turn, run `npm run lint` and `npm run build` to ensure zero compilation or syntax regressions.

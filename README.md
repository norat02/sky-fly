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
│  OAuth / Google)    │  │  Stories, Messages) │  │   Voice recordings) │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## ✨ Features

- **Supabase Authentication**:
  - Email & Password sign-up and login with automatic user profile provisioning.
  - One-click Google OAuth login.
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
  - Ultra-fast inline translation across English, Vietnamese, Hindi, Hinglish powered by OpenRouter / Gemini.

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
2. Set **Site URL** to your production URL (e.g., `https://your-whisper-app.vercel.app` or `http://localhost:3000` for local dev).
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/**`
   - `https://your-whisper-app.vercel.app/**`
4. (Optional Google Login): Go to **Authentication** -> **Providers** -> **Google**, enable Google, and paste your Google Client ID & Client Secret from Google Cloud Console.

### 4. Copy API Keys
1. Go to **Project Settings** -> **API**.
2. Copy the **Project URL** (`https://xyzcompany.supabase.co`).
3. Copy the **anon / public** key (`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`).

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/whisper-chat.git
   cd whisper-chat
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` or `.env.local` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase project credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
   VITE_OPENROUTER_API_KEY=optional-openrouter-key
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

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
   Add the following variables in the Vercel project deployment settings:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://xyz.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
   - `VITE_OPENROUTER_API_KEY`: *(Optional)* Your OpenRouter API key

4. **Deploy**:
   - Click **Deploy**. Vercel will automatically run `npm run build` and launch the live site.

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

1. **Client-Side Keys**: Only the `anon` public key is ever used on the frontend. The `service_role` key is **never** included or exposed.
2. **Row Level Security (RLS)**: Enforces write restrictions on the database layer so users can only modify their own profiles, posts, likes, comments, and stories.
3. **Storage Policies**: Avatars and post media are publicly viewable, but only authenticated users can upload new files.
4. **Environment Isolation**: Secret keys are maintained in `.env` (ignored by `.gitignore`) and injected at deployment via Vercel's secure environment variable manager.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the local Vite development server |
| `npm run build` | Builds the production bundle to `dist/` |
| `npm run preview` | Serves the production build locally for verification |
| `npm run lint` | Runs ESLint on project files |
| `npm run typecheck` | Type-checks code |

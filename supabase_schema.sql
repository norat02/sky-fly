-- ==============================================================================
-- Whisper Messenger: Complete Supabase PostgreSQL Schema & Realtime Setup
-- ==============================================================================
-- Run this script in your Supabase SQL Editor to set up the entire database.

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_color TEXT DEFAULT '#f59e0b',
  avatar_url TEXT,
  bio TEXT DEFAULT 'Sketchbook explorer and whisperer',
  status TEXT DEFAULT 'online',
  language TEXT DEFAULT 'en',
  auto_translate BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Chat Rooms Table
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id TEXT PRIMARY KEY,
  room_name TEXT,
  type TEXT DEFAULT 'direct', -- 'direct', 'group', 'channel'
  created_by TEXT,
  status TEXT DEFAULT 'active',
  vanish_mode BOOLEAN DEFAULT false,
  vanish_duration INTEGER DEFAULT 0,
  typing_preview_visible BOOLEAN DEFAULT false,
  wallpaper TEXT DEFAULT 'parchment',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Room Participants Table
CREATE TABLE IF NOT EXISTS public.room_participants (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  participant_id TEXT,
  name TEXT NOT NULL,
  avatar_color TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'member',
  is_owner BOOLEAN DEFAULT false,
  online BOOLEAN DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  typing BOOLEAN DEFAULT false,
  typing_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT,
  sender_avatar_color TEXT,
  sender_avatar_url TEXT,
  content TEXT,
  message_type TEXT DEFAULT 'text', -- 'text', 'image', 'audio', 'poll', 'system'
  media_url TEXT,
  media_meta JSONB,
  reply_to JSONB,
  pinned BOOLEAN DEFAULT false,
  starred BOOLEAN DEFAULT false,
  reactions JSONB DEFAULT '{}'::jsonb,
  vanishes_at TIMESTAMPTZ,
  read_by JSONB DEFAULT '[]'::jsonb,
  translations JSONB DEFAULT '{}'::jsonb,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Posts (Community Feed) Table
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  author_name TEXT,
  author_avatar TEXT,
  author_handle TEXT,
  content TEXT,
  media_urls JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Stories Table
CREATE TABLE IF NOT EXISTS public.stories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  author_name TEXT,
  author_avatar TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'text',
  background_gradient TEXT,
  caption TEXT,
  views_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  author_name TEXT,
  author_avatar TEXT,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Likes Table
CREATE TABLE IF NOT EXISTS public.likes (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 9. Follows Table
CREATE TABLE IF NOT EXISTS public.follows (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  actor_id TEXT,
  actor_name TEXT,
  actor_avatar TEXT,
  type TEXT,
  message TEXT,
  entity_id TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES for Ultra-Fast Queries
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON public.chat_messages(room_id, created_at);
CREATE INDEX IF NOT EXISTS idx_room_participants_room ON public.room_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_room_participants_user ON public.room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_expires ON public.stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow read & write access for authenticated & anonymous sketch clients
DO $$
BEGIN
  -- Profiles
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
  CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Users can insert/update their profile" ON public.profiles;
  CREATE POLICY "Users can insert/update their profile" ON public.profiles FOR ALL USING (true);

  -- Chat Rooms
  DROP POLICY IF EXISTS "Chat rooms viewable by everyone" ON public.chat_rooms;
  CREATE POLICY "Chat rooms viewable by everyone" ON public.chat_rooms FOR ALL USING (true);

  -- Room Participants
  DROP POLICY IF EXISTS "Room participants access" ON public.room_participants;
  CREATE POLICY "Room participants access" ON public.room_participants FOR ALL USING (true);

  -- Chat Messages
  DROP POLICY IF EXISTS "Chat messages access" ON public.chat_messages;
  CREATE POLICY "Chat messages access" ON public.chat_messages FOR ALL USING (true);

  -- Posts
  DROP POLICY IF EXISTS "Posts access" ON public.posts;
  CREATE POLICY "Posts access" ON public.posts FOR ALL USING (true);

  -- Stories
  DROP POLICY IF EXISTS "Stories access" ON public.stories;
  CREATE POLICY "Stories access" ON public.stories FOR ALL USING (true);

  -- Comments & Likes & Notifications
  DROP POLICY IF EXISTS "Comments access" ON public.comments;
  CREATE POLICY "Comments access" ON public.comments FOR ALL USING (true);

  DROP POLICY IF EXISTS "Likes access" ON public.likes;
  CREATE POLICY "Likes access" ON public.likes FOR ALL USING (true);

  DROP POLICY IF EXISTS "Follows access" ON public.follows;
  CREATE POLICY "Follows access" ON public.follows FOR ALL USING (true);

  DROP POLICY IF EXISTS "Notifications access" ON public.notifications;
  CREATE POLICY "Notifications access" ON public.notifications FOR ALL USING (true);
END $$;

-- ==============================================================================
-- ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.room_participants;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.stories;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

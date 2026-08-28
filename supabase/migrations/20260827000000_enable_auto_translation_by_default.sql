-- Whisper language preference defaults
-- New profiles translate received messages by default; existing explicit choices are preserved.

ALTER TABLE public.profiles
  ALTER COLUMN language SET DEFAULT 'en',
  ALTER COLUMN auto_translate SET DEFAULT true;

-- Profiles created before this policy with a missing preference are opted in.
UPDATE public.profiles
SET language = 'en'
WHERE language IS NULL;

UPDATE public.profiles
SET auto_translate = true
WHERE auto_translate IS NULL;

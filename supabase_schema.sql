-- Enterprise CX Platform — Supabase SQL Schema for User History & Profiles
-- Run this script in your Supabase SQL Editor to initialize the tables.

-- 1. Create a table for general User Profiles (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    loyalty_tier TEXT DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create a table for User Claims History (Resolutions, Disputes, Interactions)
CREATE TABLE IF NOT EXISTS public.user_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    claim_id TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    description TEXT,
    ai_score NUMERIC,
    status TEXT DEFAULT 'open',
    resolution_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2b. Immutable, user-owned audit trail for detection and policy negotiation.
-- The payload contains only complaint workflow metadata; do not store raw evidence
-- or OpenRouter credentials in this table.
CREATE TABLE IF NOT EXISTS public.complaint_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    claim_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS complaint_logs_user_claim_created_idx
ON public.complaint_logs (user_id, claim_id, created_at DESC);

-- Makes repeated client-side saves of the same complaint idempotent.
CREATE UNIQUE INDEX IF NOT EXISTS user_history_user_claim_key
ON public.user_history (user_id, claim_id);

-- 3. Set up Row Level Security (RLS) policies

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'Users can view their own profile') THEN
    CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'Users can update their own profile') THEN
    CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
END $$;

-- Enable RLS on user_history
ALTER TABLE public.user_history ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_history' AND policyname = 'Users can view their own history') THEN
    CREATE POLICY "Users can view their own history" ON public.user_history FOR SELECT USING (auth.uid() = user_id);
  END IF;

-- ALLOW ADMINS TO VIEW ALL HISTORY
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_history' AND policyname = 'Admins can view all history') THEN
    CREATE POLICY "Admins can view all history" ON public.user_history FOR SELECT USING (
      EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid()
      AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%cxplatform.io%' OR auth.users.email = 'aruneshownsty1@gmail.com'))
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_history' AND policyname = 'Users can insert their own history') THEN
    CREATE POLICY "Users can insert their own history" ON public.user_history FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_history' AND policyname = 'Users can update their own history') THEN
    CREATE POLICY "Users can update their own history" ON public.user_history FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

ALTER TABLE public.complaint_logs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'complaint_logs' AND policyname = 'Users can view their own complaint logs') THEN
    CREATE POLICY "Users can view their own complaint logs" ON public.complaint_logs FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'complaint_logs' AND policyname = 'Users can insert their own complaint logs') THEN
    CREATE POLICY "Users can insert their own complaint logs" ON public.complaint_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'complaint_logs' AND policyname = 'Admins can view all complaint logs') THEN
    CREATE POLICY "Admins can view all complaint logs" ON public.complaint_logs FOR SELECT USING (
      EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid()
      AND (auth.users.email LIKE '%admin%' OR auth.users.email LIKE '%cxplatform.io%' OR auth.users.email = 'aruneshownsty1@gmail.com'))
    );
  END IF;
END $$;

-- 4. Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- EMERGENCY FIX: BACKFILL MISSING PROFILES
-- ==========================================
-- If you created users BEFORE running this schema, they won't have a profile.
-- This causes saving to user_history to fail silently due to foreign key constraints.
-- Running this block will fix that issue for all existing users:
INSERT INTO public.user_profiles (id, email)
SELECT id, email FROM auth.users
WHERE id NOT IN (SELECT id FROM public.user_profiles);

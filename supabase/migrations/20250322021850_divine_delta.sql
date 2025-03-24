/*
  # Create courses and subscriptions tables

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `thumbnail_url` (text)
      - `video_id` (text)
      - `is_premium` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `is_premium` (boolean)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for course access
    - Add policies for subscription management
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  video_id text NOT NULL,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Anyone can view free courses"
  ON courses
  FOR SELECT
  USING (is_premium = false);

CREATE POLICY "Premium users can view all courses"
  ON courses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE user_id = auth.uid()
      AND is_premium = true
      AND (expires_at IS NULL OR expires_at > now())
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

-- Function to check if a user has premium access
CREATE OR REPLACE FUNCTION public.has_premium_access(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM subscriptions
    WHERE user_id = user_uuid
    AND is_premium = true
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
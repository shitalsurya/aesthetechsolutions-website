
CREATE TABLE public.intervu_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  stream text,
  hr_question text,
  hr_answer text,
  hr_score int DEFAULT 0,
  hr_feedback jsonb,
  aptitude_score int DEFAULT 0,
  aptitude_total int DEFAULT 0,
  logic_score int DEFAULT 0,
  logic_total int DEFAULT 0,
  total_score int NOT NULL DEFAULT 0,
  strengths text[],
  weaknesses text[],
  tips text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX intervu_attempts_score_idx ON public.intervu_attempts (total_score DESC, created_at DESC);
CREATE INDEX intervu_attempts_email_idx ON public.intervu_attempts (email);

ALTER TABLE public.intervu_attempts ENABLE ROW LEVEL SECURITY;

-- Anyone can insert an attempt (public challenge, no auth)
CREATE POLICY "Anyone can submit attempts"
ON public.intervu_attempts FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anyone can read leaderboard data (we'll select limited columns client-side)
CREATE POLICY "Anyone can view attempts"
ON public.intervu_attempts FOR SELECT
TO anon, authenticated
USING (true);

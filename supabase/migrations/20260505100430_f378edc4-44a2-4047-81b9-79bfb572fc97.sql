CREATE TABLE public.feedback_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  score INTEGER,
  feedback TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert feedback logs"
ON public.feedback_logs FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view feedback logs"
ON public.feedback_logs FOR SELECT
TO anon, authenticated
USING (true);
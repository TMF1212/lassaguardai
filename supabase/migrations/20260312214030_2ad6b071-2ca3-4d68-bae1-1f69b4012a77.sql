
-- Table to store all risk assessment results (anonymized, no auth required)
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  score INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (guest users can submit assessments)
CREATE POLICY "Anyone can insert risk assessments"
  ON public.risk_assessments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow reading for aggregate/analytics (no personal data stored)
CREATE POLICY "Anyone can read risk assessments"
  ON public.risk_assessments
  FOR SELECT
  TO anon, authenticated
  USING (true);

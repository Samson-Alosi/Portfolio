CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  interest text,
  message text,
  source text DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts"
  ON public.inquiries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reads"
  ON public.inquiries
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx
  ON public.inquiries (created_at DESC);

CREATE TABLE IF NOT EXISTS public.post_views (
  post_slug text PRIMARY KEY,
  view_count bigint NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  updated_at timestamptz NOT NULL DEFAULT pg_catalog.now(),
  CONSTRAINT post_views_slug_format CHECK (
    post_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  )
);

ALTER TABLE public.post_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read post views" ON public.post_views;
CREATE POLICY "Public can read post views"
  ON public.post_views
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.post_views TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.post_views FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.increment_post_view(p_post_slug text)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  updated_count bigint;
BEGIN
  IF p_post_slug IS NULL
    OR pg_catalog.char_length(p_post_slug) > 120
    OR p_post_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' THEN
    RAISE EXCEPTION 'Invalid post slug.' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.post_views AS views (post_slug, view_count)
  VALUES (p_post_slug, 1)
  ON CONFLICT (post_slug) DO UPDATE
    SET view_count = views.view_count + 1,
        updated_at = pg_catalog.now()
  RETURNING view_count INTO updated_count;

  RETURN updated_count;
END;
$function$;

REVOKE ALL ON FUNCTION public.increment_post_view(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_post_view(text) TO anon, authenticated;
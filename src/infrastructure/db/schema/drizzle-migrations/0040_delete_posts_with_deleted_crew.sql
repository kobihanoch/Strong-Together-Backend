-- Delete a crew-only post only when the deleted crew is its sole placement.
-- Public posts and posts placed in another crew remain available.
CREATE FUNCTION "social"."delete_exclusive_crew_posts" () RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET
  search_path = pg_catalog,
  social AS $$
BEGIN
  DELETE FROM social.post p
  WHERE
    p.visibility = 'crews_only'
    AND EXISTS (
      SELECT 1
      FROM social.crew_shared_post csp
      WHERE
        csp.post_id = p.id
        AND csp.crew_id = OLD.id
    )
    AND NOT EXISTS (
      SELECT 1
      FROM social.crew_shared_post other_csp
      WHERE
        other_csp.post_id = p.id
        AND other_csp.crew_id <> OLD.id
    );

  RETURN OLD;
END;
$$;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."delete_exclusive_crew_posts" ()
FROM
  PUBLIC,
  "authenticated";

--> statement-breakpoint
CREATE TRIGGER "delete_exclusive_crew_posts_before_crew_delete" BEFORE DELETE ON "social"."crew" FOR EACH ROW
EXECUTE FUNCTION "social"."delete_exclusive_crew_posts" ();

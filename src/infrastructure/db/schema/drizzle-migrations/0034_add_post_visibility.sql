CREATE TYPE "social"."Post Visibility" AS ENUM('crews_only', 'public');

--> statement-breakpoint
ALTER TABLE "social"."crew_shared_post"
DROP CONSTRAINT "crew_shared_post_post_id_unique";

--> statement-breakpoint
ALTER TABLE "social"."post"
ADD COLUMN "visibility" "social"."Post Visibility";

--> statement-breakpoint
-- Preserve the previous visibility behavior for existing posts. Posts without
-- a crew placement were public, while placed posts were limited to their crews.
UPDATE "social"."post" p
SET
  "visibility" = CASE
    WHEN EXISTS (
      SELECT
        1
      FROM
        "social"."crew_shared_post" csp
      WHERE
        csp."post_id" = p."id"
    ) THEN 'crews_only'::"social"."Post Visibility"
    ELSE 'public'::"social"."Post Visibility"
  END;

--> statement-breakpoint
ALTER TABLE "social"."post"
ALTER COLUMN "visibility"
SET NOT NULL;

--> statement-breakpoint
-- These narrow helpers prevent recursive RLS checks between posts and their
-- crew placements. They expose only authorization booleans, never row data.
CREATE OR REPLACE FUNCTION "social"."is_public_post" (requested_post_id UUID) RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER
SET
  search_path = pg_catalog,
  social
SET
  row_security = off AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.post p
    WHERE p.id = requested_post_id
      AND p.visibility = 'public'
  );
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION "social"."is_post_author" (requested_post_id UUID) RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER
SET
  search_path = pg_catalog,
  social,
  identity
SET
  row_security = off AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.post p
    WHERE p.id = requested_post_id
      AND p.author_user_id = identity.current_user_id()
  );
$function$;

--> statement-breakpoint
ALTER TABLE "social"."crew_shared_post"
ADD CONSTRAINT "crew_shared_post_post_id_crew_id_unique" UNIQUE ("post_id", "crew_id");

--> statement-breakpoint
ALTER POLICY "Allow users to read global or accessible crew posts" ON "social"."post"
RENAME TO "Allow users to read public or accessible crew posts";

--> statement-breakpoint
-- Public visibility is independent from crew placement. A crew-only post is
-- visible to its author or through any crew where the caller actively belongs.
ALTER POLICY "Allow users to read public or accessible crew posts" ON "social"."post" USING (
  "author_user_id" = "identity"."current_user_id" ()
  OR "visibility" = 'public'
  OR EXISTS (
    SELECT
      1
    FROM
      "social"."crew_shared_post" csp
    WHERE
      csp."post_id" = "social"."post"."id"
      AND (
        "social"."is_crew_leader" (csp."crew_id")
        OR "social"."is_active_crew_member" (csp."crew_id")
      )
  )
);

--> statement-breakpoint
-- The application role needs enum usage to insert visibility values.
GRANT USAGE ON TYPE "social"."Post Visibility" TO "authenticated";

--> statement-breakpoint
GRANT
EXECUTE ON FUNCTION "social"."is_public_post" (UUID),
"social"."is_post_author" (UUID) TO "authenticated";

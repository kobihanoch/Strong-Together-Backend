CREATE OR REPLACE FUNCTION social.is_crew_public (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE
SET
  search_path TO 'pg_catalog' AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.crew c
    WHERE c.id = crew_id_in
      AND c.privacy = 'public'
  )
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.is_crew_leader (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog'
SET
  row_security TO 'off' AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.crew c
    JOIN social.crew_membership cm
      ON cm.crew_id = c.id
      AND cm.user_id = c.leader_id
      AND cm.status = 'active'
    WHERE c.id = crew_id_in
      AND c.leader_id = identity.current_user_id()
  )
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.is_active_crew_member (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog' AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.crew_membership cm
    WHERE cm.crew_id = crew_id_in
      AND cm.user_id = identity.current_user_id()
      AND cm.status = 'active'
  )
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.is_public_post (requested_post_id UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog',
  'social'
SET
  row_security TO 'off' AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.post p
    WHERE p.id = requested_post_id
      AND p.visibility = 'public'
  );
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.is_post_author (requested_post_id UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog',
  'social',
  'identity'
SET
  row_security TO 'off' AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.post p
    WHERE p.id = requested_post_id
      AND p.author_user_id = identity.current_user_id()
  );
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.is_crew_admin (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog'
SET
  row_security TO 'off' AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.crew_membership cm
    WHERE cm.crew_id = crew_id_in
      AND cm.user_id = identity.current_user_id()
      AND cm.status = 'active'
      AND cm.role = 'admin'
  )
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.has_accepted_crew_participation_request (crew_id_in UUID, user_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path = pg_catalog,
  social,
  identity
SET
  row_security = off AS $function$
  SELECT EXISTS (
    SELECT 1 FROM social.crew_participation_request request
    WHERE request.crew_id = crew_id_in
      AND request.participant_user_id = user_id_in
      AND user_id_in = identity.current_user_id()
      AND request.status = 'accepted'
  );
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.delete_exclusive_crew_posts () RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET
  search_path TO 'pg_catalog',
  'social' AS $function$
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
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.get_active_crew_participant_count (crew_id_in UUID) RETURNS INTEGER LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog'
SET
  row_security TO 'off' AS $function$
  SELECT COUNT(*)::INTEGER
  FROM social.crew_membership cm
  WHERE cm.crew_id = crew_id_in
    AND cm.status = 'active'
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.list_discoverable_crews (
  limit_in INTEGER,
  cursor_created_at_in TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  cursor_id_in UUID DEFAULT NULL,
  search_in TEXT DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  name TEXT,
  "leaderId" UUID,
  privacy social."Crew Privacy",
  "createdAt" TIMESTAMP WITH TIME ZONE,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "participantCount" INTEGER,
  "top5Participants" JSONB
) LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog' AS $function$
  SELECT
    c.id,
    c.name,
    c.leader_id AS "leaderId",
    c.privacy,
    c.created_at AS "createdAt",
    c.updated_at AS "updatedAt",
    social.get_active_crew_participant_count(c.id) AS "participantCount",
    COALESCE(participants.items, '[]'::JSONB) AS "top5Participants"
  FROM social.crew c
  LEFT JOIN LATERAL (
    SELECT JSONB_AGG(
      JSONB_BUILD_OBJECT(
        'username', ranked.username,
        'fullName', ranked.full_name,
        'profilePicPath', ranked.profile_pic_path
      ) ORDER BY ranked.rank_order
    ) AS items
    FROM (
      SELECT
        u.username,
        u.name AS full_name,
        u.profile_pic_path,
        ROW_NUMBER() OVER (
          ORDER BY
            (cm.user_id = identity.current_user_id()) DESC,
            CASE cm.role WHEN 'leader' THEN 1 WHEN 'admin' THEN 2 ELSE 3 END,
            cm.joined_at,
            cm.id
        ) AS rank_order
      FROM social.crew_membership cm
      JOIN identity."user" u ON u.id = cm.user_id
      WHERE cm.crew_id = c.id
        AND cm.status = 'active'
        AND (c.privacy = 'public' OR social.is_active_crew_member(c.id))
      ORDER BY rank_order
      LIMIT 5
    ) ranked
  ) participants ON TRUE
  WHERE identity.current_user_id() IS NOT NULL
    AND (search_in IS NULL OR STRPOS(LOWER(c.name), LOWER(search_in)) > 0)
    AND (
      cursor_created_at_in IS NULL
      OR (DATE_TRUNC('milliseconds', c.created_at), c.id) < (cursor_created_at_in, cursor_id_in)
    )
  ORDER BY DATE_TRUNC('milliseconds', c.created_at) DESC, c.id DESC
  LIMIT LEAST(GREATEST(COALESCE(limit_in, 20), 1), 101)
$function$;

--> statement-breakpoint
CREATE FUNCTION identity.search_user_profiles (
  search_in TEXT,
  limit_in INTEGER,
  cursor_created_at_in TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  cursor_id_in UUID DEFAULT NULL
) RETURNS TABLE (
  "userId" UUID,
  username TEXT,
  "fullName" TEXT,
  "profilePicPath" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE
) LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog' AS $function$
  SELECT
    u.id AS "userId",
    u.username,
    u.name AS "fullName",
    u.profile_pic_path AS "profilePicPath",
    u.created_at AS "createdAt"
  FROM identity."user" u
  WHERE identity.current_user_id() IS NOT NULL
    AND (
      STRPOS(LOWER(u.username), LOWER(search_in)) > 0
      OR STRPOS(LOWER(u.name), LOWER(search_in)) > 0
    )
    AND (
      cursor_created_at_in IS NULL
      OR (DATE_TRUNC('milliseconds', u.created_at), u.id) < (cursor_created_at_in, cursor_id_in)
    )
  ORDER BY DATE_TRUNC('milliseconds', u.created_at) DESC, u.id DESC
  LIMIT LEAST(GREATEST(COALESCE(limit_in, 20), 1), 101)
$function$;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."is_crew_public" (UUID),
"social"."is_crew_leader" (UUID),
"social"."is_active_crew_member" (UUID),
"social"."is_public_post" (UUID),
"social"."is_post_author" (UUID),
"social"."is_crew_admin" (UUID),
"social"."has_accepted_crew_participation_request" (UUID, UUID),
"social"."get_active_crew_participant_count" (UUID),
"social"."list_discoverable_crews" (INTEGER, TIMESTAMP WITH TIME ZONE, UUID, TEXT),
"identity"."search_user_profiles" (TEXT, INTEGER, TIMESTAMP WITH TIME ZONE, UUID)
FROM
  PUBLIC;

--> statement-breakpoint
GRANT
EXECUTE ON FUNCTION "social"."is_crew_public" (UUID),
"social"."is_crew_leader" (UUID),
"social"."is_active_crew_member" (UUID),
"social"."is_public_post" (UUID),
"social"."is_post_author" (UUID),
"social"."is_crew_admin" (UUID),
"social"."has_accepted_crew_participation_request" (UUID, UUID),
"social"."get_active_crew_participant_count" (UUID),
"social"."list_discoverable_crews" (INTEGER, TIMESTAMP WITH TIME ZONE, UUID, TEXT),
"identity"."search_user_profiles" (TEXT, INTEGER, TIMESTAMP WITH TIME ZONE, UUID) TO "authenticated";

--> statement-breakpoint
CREATE TRIGGER "delete_exclusive_crew_posts_before_crew_delete"
BEFORE DELETE ON "social"."crew" FOR EACH ROW
EXECUTE FUNCTION "social"."delete_exclusive_crew_posts" ();

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
CREATE OR REPLACE FUNCTION social.is_crew_leader (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE
SET
  search_path TO 'pg_catalog' AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.crew c
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
CREATE OR REPLACE FUNCTION social.can_access_crew (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE
SET
  search_path TO 'pg_catalog' AS $function$
  SELECT social.is_active_crew_member(crew_id_in)
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.can_manage_crew (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog'
SET
  row_security TO 'off' AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.crew c
    JOIN social.crew_membership cm
      ON cm.crew_id = c.id
     AND cm.user_id = identity.current_user_id()
     AND cm.status = 'active'
    WHERE c.id = crew_id_in
      AND c.leader_id = identity.current_user_id()
  )
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.can_view_crew_participants (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog'
SET
  row_security TO 'off' AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.crew c
    WHERE c.id = crew_id_in
      AND (
        c.privacy = 'public'
        OR EXISTS (
          SELECT 1
          FROM social.crew_membership cm
          WHERE cm.crew_id = c.id
            AND cm.user_id = identity.current_user_id()
            AND cm.status = 'active'
        )
      )
  )
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.can_publish_to_crew (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE
SET
  search_path TO 'pg_catalog' AS $function$
  SELECT social.can_access_crew(crew_id_in)
$function$;

--> statement-breakpoint
CREATE OR REPLACE FUNCTION social.can_view_post (post_id_in UUID) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog'
SET
  row_security TO 'off' AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM social.post p
    WHERE p.id = post_id_in
      AND (
        p.author_user_id = identity.current_user_id()
        OR p.visibility = 'public'
        OR EXISTS (
          SELECT 1
          FROM social.crew_shared_post csp
          JOIN social.crew_membership cm
            ON cm.crew_id = csp.crew_id
           AND cm.user_id = identity.current_user_id()
           AND cm.status = 'active'
          WHERE csp.post_id = p.id
        )
      )
  )
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
CREATE OR REPLACE FUNCTION social.list_discoverable_crews (
  limit_in INTEGER,
  cursor_created_at_in TIMESTAMP WITH TIME ZONE DEFAULT NULL::TIMESTAMP WITH TIME ZONE,
  cursor_id_in UUID DEFAULT NULL::UUID
) RETURNS TABLE (
  id UUID,
  "leaderId" UUID,
  privacy social."Crew Privacy",
  "createdAt" TIMESTAMP WITH TIME ZONE,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "top5Participants" JSONB
) LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog' AS $function$
  SELECT
    c.id,
    c.leader_id AS "leaderId",
    c.privacy,
    c.created_at AS "createdAt",
    c.updated_at AS "updatedAt",
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
      WHERE cm.crew_id = c.id AND cm.status = 'active'
      ORDER BY rank_order
      LIMIT 5
    ) ranked
  ) participants ON TRUE
  WHERE
    identity.current_user_id() IS NOT NULL
    AND (
      cursor_created_at_in IS NULL
      OR (DATE_TRUNC('milliseconds', c.created_at), c.id) < (cursor_created_at_in, cursor_id_in)
    )
  ORDER BY DATE_TRUNC('milliseconds', c.created_at) DESC, c.id DESC
  LIMIT LEAST(GREATEST(COALESCE(limit_in, 20), 1), 101)
$function$;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."is_crew_public" (UUID),
"social"."is_crew_leader" (UUID),
"social"."is_active_crew_member" (UUID),
"social"."is_public_post" (UUID),
"social"."is_post_author" (UUID),
"social"."is_crew_admin" (UUID),
"social"."can_access_crew" (UUID),
"social"."can_manage_crew" (UUID),
"social"."can_view_crew_participants" (UUID),
"social"."can_publish_to_crew" (UUID),
"social"."can_view_post" (UUID),
"social"."list_discoverable_crews" (INTEGER, TIMESTAMP WITH TIME ZONE, UUID)
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
"social"."can_access_crew" (UUID),
"social"."can_manage_crew" (UUID),
"social"."can_view_crew_participants" (UUID),
"social"."can_publish_to_crew" (UUID),
"social"."can_view_post" (UUID),
"social"."list_discoverable_crews" (INTEGER, TIMESTAMP WITH TIME ZONE, UUID) TO "authenticated";

--> statement-breakpoint
CREATE TRIGGER "delete_exclusive_crew_posts_before_crew_delete"
BEFORE DELETE ON "social"."crew" FOR EACH ROW
EXECUTE FUNCTION "social"."delete_exclusive_crew_posts" ();

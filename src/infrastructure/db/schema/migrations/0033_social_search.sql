DROP FUNCTION social.list_discoverable_crews (INTEGER, TIMESTAMP WITH TIME ZONE, UUID);

--> statement-breakpoint
CREATE FUNCTION social.list_discoverable_crews (
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
        -- Private participant previews are visible only to active members.
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
REVOKE ALL ON FUNCTION social.list_discoverable_crews (INTEGER, TIMESTAMP WITH TIME ZONE, UUID, TEXT),
identity.search_user_profiles (TEXT, INTEGER, TIMESTAMP WITH TIME ZONE, UUID)
FROM
  PUBLIC;

--> statement-breakpoint
GRANT
EXECUTE ON FUNCTION social.list_discoverable_crews (INTEGER, TIMESTAMP WITH TIME ZONE, UUID, TEXT),
identity.search_user_profiles (TEXT, INTEGER, TIMESTAMP WITH TIME ZONE, UUID) TO authenticated;

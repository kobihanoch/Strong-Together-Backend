-- Replace offset pagination with a stable creation-time and UUID cursor.
CREATE FUNCTION "social"."list_discoverable_crews" (
  "limit_in" INTEGER,
  "cursor_created_at_in" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  "cursor_id_in" UUID DEFAULT NULL
) RETURNS TABLE (
  "id" UUID,
  "leaderId" UUID,
  "privacy" "social"."Crew Privacy",
  "createdAt" TIMESTAMP WITH TIME ZONE,
  "updatedAt" TIMESTAMP WITH TIME ZONE,
  "top5Participants" JSONB
) LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path = pg_catalog AS $function$
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
REVOKE ALL ON FUNCTION "social"."list_discoverable_crews" (INTEGER, TIMESTAMP WITH TIME ZONE, UUID)
FROM
  PUBLIC;

--> statement-breakpoint
GRANT
EXECUTE ON FUNCTION "social"."list_discoverable_crews" (INTEGER, TIMESTAMP WITH TIME ZONE, UUID) TO "authenticated";

--> statement-breakpoint
DROP FUNCTION "social"."list_discoverable_crews" (INTEGER, INTEGER);

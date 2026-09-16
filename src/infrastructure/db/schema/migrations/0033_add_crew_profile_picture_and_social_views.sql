ALTER TABLE "social"."crew"
ADD COLUMN "profile_pic_path" TEXT;

--> statement-breakpoint
CREATE FUNCTION "social"."get_top_crew_participants" ("crew_id_in" UUID) RETURNS JSONB LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path TO 'pg_catalog'
SET
  row_security TO 'off' AS $function$
  SELECT
    COALESCE(
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'username',
          ranked.username,
          'fullName',
          ranked.full_name,
          'profilePicPath',
          ranked.profile_pic_path
        )
        ORDER BY
          ranked.rank_order
      ),
      '[]'::JSONB
    )
  FROM
    (
      SELECT
        u.username,
        u.name AS full_name,
        u.profile_pic_path,
        ROW_NUMBER() OVER (
          ORDER BY
            (member.user_id = identity.current_user_id ()) DESC,
            CASE member.role
              WHEN 'leader' THEN 1
              WHEN 'admin' THEN 2
              ELSE 3
            END,
            member.joined_at,
            member.id
        ) AS rank_order
      FROM
        social.crew_membership member
        JOIN identity."user" u ON u.id = member.user_id
      WHERE
        member.crew_id = crew_id_in
        AND member.status = 'active'
      ORDER BY
        rank_order
      LIMIT
        5
    ) ranked
$function$;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."get_top_crew_participants" (UUID)
FROM
  PUBLIC;

--> statement-breakpoint
GRANT
EXECUTE ON FUNCTION "social"."get_top_crew_participants" (UUID) TO "authenticated";

--> statement-breakpoint
CREATE VIEW "social"."v_crew_expanded"
WITH
  (security_invoker = TRUE) AS (
    SELECT
      c.id,
      c.name,
      c.leader_id,
      c.privacy,
      c.created_at,
      c.updated_at,
      social.get_active_crew_participant_count (c.id) AS participant_count,
      social.get_top_crew_participants (c.id) AS top_5_participants
    FROM
      social.crew c
  );

--> statement-breakpoint
CREATE VIEW "social"."v_post_expanded"
WITH
  (security_invoker = TRUE) AS (
    SELECT
      p.id,
      p.author_user_id,
      p.content,
      p.visibility,
      p.published_at,
      p.updated_at,
      author.username,
      author.name AS full_name,
      author."profilePicPath" AS profile_pic_path,
      JSONB_BUILD_OBJECT(
        'reactionsCount',
        reactions_data.reactions,
        'commentsCount',
        comments_data.comments_count
      ) AS interactions
    FROM
      social.post p
      CROSS JOIN LATERAL identity.get_user_profile (p.author_user_id) author
      CROSS JOIN LATERAL (
        SELECT
          JSONB_BUILD_OBJECT(
            'likesCount',
            COUNT(*) FILTER (
              WHERE
                reaction.type = 'like'
            ),
            'fireUpCount',
            COUNT(*) FILTER (
              WHERE
                reaction.type = 'fire up'
            ),
            'muscleCount',
            COUNT(*) FILTER (
              WHERE
                reaction.type = 'muscle'
            )
          ) AS reactions
        FROM
          social.reaction reaction
        WHERE
          reaction.post_id = p.id
      ) reactions_data
      CROSS JOIN LATERAL (
        SELECT
          COUNT(*) AS comments_count
        FROM
          social.comment post_comment
        WHERE
          post_comment.post_id = p.id
      ) comments_data
  );

--> statement-breakpoint
GRANT
SELECT
  ON TABLE "social"."v_crew_expanded",
  "social"."v_post_expanded" TO "authenticated";

--> statement-breakpoint
DROP FUNCTION "social"."list_discoverable_crews" (INTEGER, TIMESTAMP WITH TIME ZONE, UUID, TEXT);

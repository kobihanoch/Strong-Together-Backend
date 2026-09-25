CREATE OR REPLACE FUNCTION identity.get_user_profile (user_id_in UUID) RETURNS TABLE (
  "userId" UUID,
  "username" TEXT,
  "name" TEXT,
  "profilePicPath" TEXT
) LANGUAGE sql STABLE SECURITY DEFINER
SET
  search_path = pg_catalog,
  identity,
  pg_temp AS $function$
  SELECT 
    u.id AS "userId", 
    u.username AS "username", 
    u.name AS "name", 
    u.profile_pic_path AS "profilePicPath"
  FROM identity."user" u
  WHERE u.id = user_id_in
  LIMIT 1;
$function$;

REVOKE ALL ON FUNCTION identity.get_user_profile (UUID)
FROM
  PUBLIC;

GRANT
EXECUTE ON FUNCTION identity.get_user_profile (UUID) TO authenticated;

--> statement-breakpoint
CREATE VIEW "social"."v_crew_expanded"
WITH
  (security_invoker = TRUE) AS (
    SELECT
      c.id,
      c.name,
      c.created_by,
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
      p.workout_summary_id,
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
            COUNT(*) FILTER (WHERE reaction.type = 'like'),
            'fireUpCount',
            COUNT(*) FILTER (WHERE reaction.type = 'fire up'),
            'muscleCount',
            COUNT(*) FILTER (WHERE reaction.type = 'muscle')
          ) AS reactions
        FROM social.reaction reaction
        WHERE reaction.post_id = p.id
      ) reactions_data
      CROSS JOIN LATERAL (
        SELECT COUNT(*) AS comments_count
        FROM social.comment post_comment
        WHERE post_comment.post_id = p.id
      ) comments_data
  );

--> statement-breakpoint
GRANT
SELECT
  ON TABLE "social"."v_crew_expanded",
  "social"."v_post_expanded" TO "authenticated";

ALTER TABLE "social"."crew" ADD COLUMN "profile_pic_path" text;--> statement-breakpoint
CREATE VIEW "social"."v_post_expanded" WITH (security_invoker = true) AS (
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

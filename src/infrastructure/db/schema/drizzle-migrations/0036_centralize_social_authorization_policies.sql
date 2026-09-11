-- Active administrator membership is a reusable fact for future administration behavior.
CREATE FUNCTION "social"."is_crew_admin" (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER
SET
  search_path = pg_catalog
SET
  row_security = off AS $function$
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
-- Ordinary crew access depends only on an active membership, including for leaders.
CREATE FUNCTION "social"."can_access_crew" (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY INVOKER
SET
  search_path = pg_catalog AS $function$
  SELECT social.is_active_crew_member(crew_id_in)
$function$;

--> statement-breakpoint
-- Management currently requires both the crew leader identity and an active membership.
CREATE FUNCTION "social"."can_manage_crew" (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER
SET
  search_path = pg_catalog
SET
  row_security = off AS $function$
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
-- Public crews expose participants; private crews require active membership.
CREATE FUNCTION "social"."can_view_crew_participants" (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER
SET
  search_path = pg_catalog
SET
  row_security = off AS $function$
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
-- Publishing to a crew follows the same active-membership rule as crew access.
CREATE FUNCTION "social"."can_publish_to_crew" (crew_id_in UUID) RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY INVOKER
SET
  search_path = pg_catalog AS $function$
  SELECT social.can_access_crew(crew_id_in)
$function$;

--> statement-breakpoint
-- Post visibility is independent from placement: authors and the public can
-- read directly, while crew-only access requires any active placed membership.
CREATE FUNCTION "social"."can_view_post" (post_id_in UUID) RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER
SET
  search_path = pg_catalog
SET
  row_security = off AS $function$
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
REVOKE ALL ON FUNCTION "social"."is_crew_admin" (UUID)
FROM
  PUBLIC;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."can_access_crew" (UUID)
FROM
  PUBLIC;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."can_manage_crew" (UUID)
FROM
  PUBLIC;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."can_view_crew_participants" (UUID)
FROM
  PUBLIC;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."can_publish_to_crew" (UUID)
FROM
  PUBLIC;

--> statement-breakpoint
REVOKE ALL ON FUNCTION "social"."can_view_post" (UUID)
FROM
  PUBLIC;

--> statement-breakpoint
GRANT
EXECUTE ON FUNCTION "social"."is_crew_admin" (UUID),
"social"."can_access_crew" (UUID),
"social"."can_manage_crew" (UUID),
"social"."can_view_crew_participants" (UUID),
"social"."can_publish_to_crew" (UUID),
"social"."can_view_post" (UUID) TO "authenticated";

--> statement-breakpoint
ALTER POLICY "Allow crew leaders to create memberships" ON "social"."crew_membership"
RENAME TO "Allow active crew leaders to create memberships";

--> statement-breakpoint
ALTER POLICY "Allow crew leaders to update memberships" ON "social"."crew_membership"
RENAME TO "Allow active crew leaders to update memberships";

--> statement-breakpoint
ALTER POLICY "Allow members and crew leaders to delete memberships" ON "social"."crew_membership"
RENAME TO "Allow members and active crew leaders to delete memberships";

--> statement-breakpoint
ALTER POLICY "Allow crew leaders to update their crews" ON "social"."crew"
RENAME TO "Allow active crew leaders to update their crews";

--> statement-breakpoint
ALTER POLICY "Allow crew leaders to delete their crews" ON "social"."crew"
RENAME TO "Allow active crew leaders to delete their crews";

--> statement-breakpoint
ALTER POLICY "Allow active crew leaders to create memberships" ON "social"."crew_membership" TO authenticated
WITH
  CHECK (
    "social"."can_manage_crew" ("social"."crew_membership"."crew_id")
  );

--> statement-breakpoint
ALTER POLICY "Allow active crew leaders to update memberships" ON "social"."crew_membership" TO authenticated USING (
  "social"."can_manage_crew" ("social"."crew_membership"."crew_id")
)
WITH
  CHECK (
    "social"."can_manage_crew" ("social"."crew_membership"."crew_id")
  );

--> statement-breakpoint
ALTER POLICY "Allow members and active crew leaders to delete memberships" ON "social"."crew_membership" TO authenticated USING (
  "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
  OR "social"."can_manage_crew" ("social"."crew_membership"."crew_id")
);

--> statement-breakpoint
ALTER POLICY "Allow active crew leaders to update their crews" ON "social"."crew" TO authenticated USING ("social"."can_manage_crew" ("social"."crew"."id"))
WITH
  CHECK ("social"."can_manage_crew" ("social"."crew"."id"));

--> statement-breakpoint
ALTER POLICY "Allow active crew leaders to delete their crews" ON "social"."crew" TO authenticated USING ("social"."can_manage_crew" ("social"."crew"."id"));

--> statement-breakpoint
ALTER POLICY "Allow users to read comments on visible posts" ON "social"."comment" TO authenticated USING ("social"."can_view_post" ("social"."comment"."post_id"));

--> statement-breakpoint
ALTER POLICY "Allow users to create their own comments on visible posts" ON "social"."comment" TO authenticated
WITH
  CHECK (
    "social"."comment"."user_id" = "identity"."current_user_id" ()
    AND "social"."can_view_post" ("social"."comment"."post_id")
  );

--> statement-breakpoint
ALTER POLICY "Allow authors to update their comments on visible posts" ON "social"."comment" TO authenticated USING (
  "social"."comment"."user_id" = "identity"."current_user_id" ()
)
WITH
  CHECK (
    "social"."comment"."user_id" = "identity"."current_user_id" ()
    AND "social"."can_view_post" ("social"."comment"."post_id")
  );

--> statement-breakpoint
ALTER POLICY "Allow authorized users to read crew participants" ON "social"."crew_membership" TO authenticated USING (
  "social"."can_view_crew_participants" ("social"."crew_membership"."crew_id")
);

--> statement-breakpoint
ALTER POLICY "Allow involved users and leaders to read crew requests" ON "social"."crew_participation_request" TO authenticated USING (
  "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
  OR "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
  OR "social"."can_manage_crew" ("social"."crew_participation_request"."crew_id")
);

--> statement-breakpoint
ALTER POLICY "Allow users to request crews and leaders to invite users" ON "social"."crew_participation_request" TO authenticated
WITH
  CHECK (
    "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
    AND (
      (
        "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
        AND (
          (
            (
              "social"."is_crew_public" ("social"."crew_participation_request"."crew_id")
            )
            AND "social"."crew_participation_request"."status" = 'accepted'
          )
          OR (
            (
              NOT (
                "social"."is_crew_public" ("social"."crew_participation_request"."crew_id")
              )
            )
            AND "social"."crew_participation_request"."status" = 'pending'
          )
        )
      )
      OR (
        "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
        AND "social"."can_manage_crew" ("social"."crew_participation_request"."crew_id")
        AND "social"."crew_participation_request"."status" = 'pending'
      )
    )
  );

--> statement-breakpoint
ALTER POLICY "Allow authorized users to resolve pending crew requests" ON "social"."crew_participation_request" TO authenticated USING (
  (
    ("social"."crew_participation_request"."status" = 'pending')
    AND (
      (
        (
          (
            (
              (
                "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
              )
            )
            AND (
              "social"."can_manage_crew" ("social"."crew_participation_request"."crew_id")
            )
          )
          OR (
            (
              (
                "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
              )
            )
            AND (
              "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
            )
          )
        )
      )
      OR (
        (
          "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
        )
      )
    )
  )
)
WITH
  CHECK (
    (
      (
        (
          (
            (
              "social"."crew_participation_request"."status" = 'cancelled'
            )
            AND (
              (
                "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
              )
            )
          )
          OR (
            (
              "social"."crew_participation_request"."status" IN ('accepted', 'declined')
            )
            AND (
              (
                (
                  (
                    (
                      "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
                    )
                  )
                  AND (
                    "social"."can_manage_crew" ("social"."crew_participation_request"."crew_id")
                  )
                )
                OR (
                  (
                    (
                      "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
                    )
                  )
                  AND (
                    "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
                  )
                )
              )
            )
          )
        )
      )
      AND (
        "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
        OR EXISTS (
          SELECT
            1
          FROM
            "social"."crew" c
          WHERE
            c."id" = "social"."crew_participation_request"."crew_id"
            AND c."leader_id" = "social"."crew_participation_request"."initiator_user_id"
        )
      )
    )
  );

--> statement-breakpoint
ALTER POLICY "Allow users to read visible crew post placements" ON "social"."crew_shared_post" TO authenticated USING (
  "social"."can_view_post" ("social"."crew_shared_post"."post_id")
);

--> statement-breakpoint
ALTER POLICY "Allow member authors to share posts with crews" ON "social"."crew_shared_post" TO authenticated
WITH
  CHECK (
    (
      "social"."can_publish_to_crew" ("social"."crew_shared_post"."crew_id")
    )
    AND (
      "social"."is_post_author" ("social"."crew_shared_post"."post_id")
    )
  );

--> statement-breakpoint
ALTER POLICY "Allow member authors to remove posts from crews" ON "social"."crew_shared_post" TO authenticated USING (
  (
    "social"."can_publish_to_crew" ("social"."crew_shared_post"."crew_id")
  )
  AND (
    "social"."is_post_author" ("social"."crew_shared_post"."post_id")
  )
);

--> statement-breakpoint
ALTER POLICY "Allow users to read public or accessible crew posts" ON "social"."post" TO authenticated USING ("social"."can_view_post" ("social"."post"."id"));

--> statement-breakpoint
ALTER POLICY "Allow users to read reactions on visible posts" ON "social"."reaction" TO authenticated USING ("social"."can_view_post" ("social"."reaction"."post_id"));

--> statement-breakpoint
ALTER POLICY "Allow users to create their own reactions on visible posts" ON "social"."reaction" TO authenticated
WITH
  CHECK (
    "social"."reaction"."user_id" = "identity"."current_user_id" ()
    AND "social"."can_view_post" ("social"."reaction"."post_id")
  );

--> statement-breakpoint
ALTER POLICY "Allow users to update their reactions on visible posts" ON "social"."reaction" TO authenticated USING (
  "social"."reaction"."user_id" = "identity"."current_user_id" ()
)
WITH
  CHECK (
    "social"."reaction"."user_id" = "identity"."current_user_id" ()
    AND "social"."can_view_post" ("social"."reaction"."post_id")
  );

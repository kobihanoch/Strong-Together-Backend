CREATE POLICY "Allow users to read comments on visible posts" ON "social"."comment" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING ("social"."can_view_post" ("social"."comment"."post_id"));

--> statement-breakpoint
CREATE POLICY "Allow users to create their own comments on visible posts" ON "social"."comment" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "social"."comment"."user_id" = "identity"."current_user_id" ()
    AND "social"."can_view_post" ("social"."comment"."post_id")
  );

--> statement-breakpoint
CREATE POLICY "Allow authors to update their comments on visible posts" ON "social"."comment" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    "social"."comment"."user_id" = "identity"."current_user_id" ()
  )
WITH
  CHECK (
    "social"."comment"."user_id" = "identity"."current_user_id" ()
    AND "social"."can_view_post" ("social"."comment"."post_id")
  );

--> statement-breakpoint
CREATE POLICY "Allow authors to delete their comments" ON "social"."comment" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."comment"."user_id" = "identity"."current_user_id" ()
);

--> statement-breakpoint
CREATE POLICY "Allow authorized users to read crew participants" ON "social"."crew_membership" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (
    "social"."can_view_crew_participants" ("social"."crew_membership"."crew_id")
  );

--> statement-breakpoint
CREATE POLICY "Allow managers and new crew leaders to create memberships" ON "social"."crew_membership" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "social"."can_manage_crew" ("social"."crew_membership"."crew_id")
    OR (
      "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
      AND "social"."is_crew_leader" ("social"."crew_membership"."crew_id")
      AND "social"."crew_membership"."role" = 'leader'
      AND "social"."crew_membership"."status" = 'active'
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow active crew leaders to update memberships" ON "social"."crew_membership" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    "social"."can_manage_crew" ("social"."crew_membership"."crew_id")
  )
WITH
  CHECK (
    "social"."can_manage_crew" ("social"."crew_membership"."crew_id")
  );

--> statement-breakpoint
CREATE POLICY "Allow active members to leave crews" ON "social"."crew_membership" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
    AND "social"."crew_membership"."status" = 'active'
  )
WITH
  CHECK (
    "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
    AND "social"."crew_membership"."status" = 'left'
  );

--> statement-breakpoint
CREATE POLICY "Allow members and active crew leaders to delete memberships" ON "social"."crew_membership" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
  OR "social"."can_manage_crew" ("social"."crew_membership"."crew_id")
);

--> statement-breakpoint
CREATE POLICY "Allow involved users and leaders to read crew requests" ON "social"."crew_participation_request" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (
    "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
    OR "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
    OR "social"."can_manage_crew" ("social"."crew_participation_request"."crew_id")
  );

--> statement-breakpoint
CREATE POLICY "Allow users to request crews and leaders to invite users" ON "social"."crew_participation_request" AS PERMISSIVE FOR INSERT TO "authenticated"
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
CREATE POLICY "Allow authorized users to resolve pending crew requests" ON "social"."crew_participation_request" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
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
CREATE POLICY "Allow initiators to delete participation requests" ON "social"."crew_participation_request" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
);

--> statement-breakpoint
CREATE POLICY "Allow users to read visible crew post placements" ON "social"."crew_shared_post" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (
    "social"."can_access_crew" ("social"."crew_shared_post"."crew_id")
  );

--> statement-breakpoint
CREATE POLICY "Allow member authors to share posts with crews" ON "social"."crew_shared_post" AS PERMISSIVE FOR INSERT TO "authenticated"
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
CREATE POLICY "Allow member authors to remove posts from crews" ON "social"."crew_shared_post" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  (
    "social"."can_publish_to_crew" ("social"."crew_shared_post"."crew_id")
  )
  AND (
    "social"."is_post_author" ("social"."crew_shared_post"."post_id")
  )
);

--> statement-breakpoint
CREATE POLICY "Allow authenticated users to read crews" ON "social"."crew" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (TRUE);

--> statement-breakpoint
CREATE POLICY "Allow users to create crews they lead" ON "social"."crew" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "social"."crew"."leader_id" = "identity"."current_user_id" ()
  );

--> statement-breakpoint
CREATE POLICY "Allow active crew leaders to update their crews" ON "social"."crew" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING ("social"."can_manage_crew" ("social"."crew"."id"))
WITH
  CHECK ("social"."can_access_crew" ("social"."crew"."id"));

--> statement-breakpoint
CREATE POLICY "Allow active crew leaders to delete their crews" ON "social"."crew" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("social"."can_manage_crew" ("social"."crew"."id"));

--> statement-breakpoint
CREATE POLICY "Allow users to read public or accessible crew posts" ON "social"."post" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
    OR "social"."can_view_post" ("social"."post"."id")
  );

--> statement-breakpoint
CREATE POLICY "Allow users to create their own posts" ON "social"."post" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
  );

--> statement-breakpoint
CREATE POLICY "Allow authors to update their posts" ON "social"."post" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
  )
WITH
  CHECK (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
  );

--> statement-breakpoint
CREATE POLICY "Allow authors to delete their posts" ON "social"."post" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."post"."author_user_id" = "identity"."current_user_id" ()
);

--> statement-breakpoint
CREATE POLICY "Allow users to read reactions on visible posts" ON "social"."reaction" AS PERMISSIVE FOR
SELECT
  TO "authenticated" USING ("social"."can_view_post" ("social"."reaction"."post_id"));

--> statement-breakpoint
CREATE POLICY "Allow users to create their own reactions on visible posts" ON "social"."reaction" AS PERMISSIVE FOR INSERT TO "authenticated"
WITH
  CHECK (
    "social"."reaction"."user_id" = "identity"."current_user_id" ()
    AND "social"."can_view_post" ("social"."reaction"."post_id")
  );

--> statement-breakpoint
CREATE POLICY "Allow users to update their reactions on visible posts" ON "social"."reaction" AS PERMISSIVE
FOR UPDATE
  TO "authenticated" USING (
    "social"."reaction"."user_id" = "identity"."current_user_id" ()
  )
WITH
  CHECK (
    "social"."reaction"."user_id" = "identity"."current_user_id" ()
    AND "social"."can_view_post" ("social"."reaction"."post_id")
  );

--> statement-breakpoint
CREATE POLICY "Allow users to delete their own reactions" ON "social"."reaction" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
  "social"."reaction"."user_id" = "identity"."current_user_id" ()
);

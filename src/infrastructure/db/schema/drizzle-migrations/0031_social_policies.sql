CREATE POLICY "Allow users to read comments on visible posts" ON "social"."comment" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
    EXISTS (
      SELECT 1
      FROM "social"."post" p
      WHERE p."id" = "social"."comment"."post_id"
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to create their own comments on visible posts" ON "social"."comment" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
    "social"."comment"."user_id" = "identity"."current_user_id" ()
    AND (
    EXISTS (
      SELECT 1
      FROM "social"."post" p
      WHERE p."id" = "social"."comment"."post_id"
    )
  )
  );

--> statement-breakpoint
CREATE POLICY "Allow authors to update their comments on visible posts" ON "social"."comment" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("social"."comment"."user_id" = "identity"."current_user_id" ()) WITH CHECK (
    "social"."comment"."user_id" = "identity"."current_user_id" ()
    AND (
    EXISTS (
      SELECT 1
      FROM "social"."post" p
      WHERE p."id" = "social"."comment"."post_id"
    )
  )
  );

--> statement-breakpoint
CREATE POLICY "Allow authors to delete their comments" ON "social"."comment" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("social"."comment"."user_id" = "identity"."current_user_id" ());

--> statement-breakpoint
CREATE POLICY "Allow authorized users to read crew participants" ON "social"."crew_membership" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
        "social"."is_crew_public" ("social"."crew_membership"."crew_id")
        OR "social"."is_active_crew_member" ("social"."crew_membership"."crew_id")
      );

--> statement-breakpoint
CREATE POLICY "Allow leaders and accepted participant to create memberships" ON "social"."crew_membership" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
    "social"."is_crew_leader" ("social"."crew_membership"."crew_id")
    OR (
    "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
    AND EXISTS (
      SELECT
        1
      FROM
        "social"."crew" c
      WHERE
        c."id" = "social"."crew_membership"."crew_id"
        AND c."leader_id" = "identity"."current_user_id" ()
    )
    AND "social"."crew_membership"."role" = 'leader'
    AND "social"."crew_membership"."status" = 'active'
  )
    OR (
    "social"."crew_membership"."role" = 'member'
    AND "social"."crew_membership"."status" = 'active'
    AND
  "social"."has_accepted_crew_participation_request" (
    "social"."crew_membership"."crew_id",
    "social"."crew_membership"."user_id"
  )

  )
  );

--> statement-breakpoint
CREATE POLICY "Allow active crew leaders to update memberships" ON "social"."crew_membership" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("social"."is_crew_leader" ("social"."crew_membership"."crew_id")) WITH CHECK ("social"."is_crew_leader" ("social"."crew_membership"."crew_id"));

--> statement-breakpoint
CREATE POLICY "Allow active members to leave crews" ON "social"."crew_membership" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
    "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
    AND "social"."crew_membership"."status" = 'active'
  ) WITH CHECK (
    "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
    AND "social"."crew_membership"."status" = 'left'
  );

--> statement-breakpoint
CREATE POLICY "Allow members and active crew leaders to delete memberships" ON "social"."crew_membership" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
    "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
    OR "social"."is_crew_leader" ("social"."crew_membership"."crew_id")
  );

--> statement-breakpoint
CREATE POLICY "Allow involved users and leaders to read crew requests" ON "social"."crew_participation_request" AS PERMISSIVE FOR SELECT TO "authenticated" USING (

    "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
    OR "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()

    OR "social"."is_crew_leader" ("social"."crew_participation_request"."crew_id")
  );

--> statement-breakpoint
CREATE POLICY "Allow users to request to join crews" ON "social"."crew_participation_request" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
        "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
        AND "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
        AND (
          (
            "social"."is_crew_public" ("social"."crew_participation_request"."crew_id")
            AND "social"."crew_participation_request"."status" = 'accepted'
          )
          OR (
            NOT "social"."is_crew_public" ("social"."crew_participation_request"."crew_id")
            AND "social"."crew_participation_request"."status" = 'pending'
          )
        )
      );

--> statement-breakpoint
CREATE POLICY "Allow active crew leaders to invite users" ON "social"."crew_participation_request" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
        "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
        AND "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
        AND "social"."is_crew_leader" ("social"."crew_participation_request"."crew_id")
        AND "social"."crew_participation_request"."status" = 'pending'
      );

--> statement-breakpoint
CREATE POLICY "Allow authorized users to update pending crew requests" ON "social"."crew_participation_request" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (
        "social"."crew_participation_request"."status" = 'pending'
        AND (
    (
      "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
      AND "social"."is_crew_leader" ("social"."crew_participation_request"."crew_id")
    )
    OR (
      "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
      AND "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
    )
  )
      ) WITH CHECK (
        (
          "social"."crew_participation_request"."status" = 'accepted'
          AND (
    (
      "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
      AND "social"."is_crew_leader" ("social"."crew_participation_request"."crew_id")
    )
    OR (
      "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
      AND "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
    )
  )
        )
        OR (
          "social"."crew_participation_request"."status" = 'declined'
          AND (
    (
      "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
      AND "social"."is_crew_leader" ("social"."crew_participation_request"."crew_id")
    )
    OR (
      "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
      AND "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
    )
  )
        )
      );

--> statement-breakpoint
CREATE POLICY "Allow active crew members to read crew post placements" ON "social"."crew_shared_post" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("social"."is_active_crew_member" ("social"."crew_shared_post"."crew_id"));

--> statement-breakpoint
CREATE POLICY "Allow member authors to share posts with crews" ON "social"."crew_shared_post" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
    ("social"."is_active_crew_member" ("social"."crew_shared_post"."crew_id"))
    AND ("social"."is_post_author" ("social"."crew_shared_post"."post_id"))
  );

--> statement-breakpoint
CREATE POLICY "Allow member authors to remove posts from crews" ON "social"."crew_shared_post" AS PERMISSIVE FOR DELETE TO "authenticated" USING (
    ("social"."is_active_crew_member" ("social"."crew_shared_post"."crew_id"))
    AND ("social"."is_post_author" ("social"."crew_shared_post"."post_id"))
  );

--> statement-breakpoint
CREATE POLICY "Allow authenticated users to read crews" ON "social"."crew" AS PERMISSIVE FOR SELECT TO "authenticated" USING (TRUE);

--> statement-breakpoint
CREATE POLICY "Allow users to create crews they lead" ON "social"."crew" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("social"."crew"."leader_id" = "identity"."current_user_id" ());

--> statement-breakpoint
CREATE POLICY "Allow active crew leaders to update their crews" ON "social"."crew" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("social"."crew"."leader_id" = "identity"."current_user_id" () AND "social"."is_active_crew_member" ("social"."crew"."id")) WITH CHECK ("social"."is_active_crew_member" ("social"."crew"."id"));

--> statement-breakpoint
CREATE POLICY "Allow active crew leaders to delete their crews" ON "social"."crew" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("social"."crew"."leader_id" = "identity"."current_user_id" () AND "social"."is_active_crew_member" ("social"."crew"."id"));

--> statement-breakpoint
CREATE POLICY "Allow users to read public or accessible crew posts" ON "social"."post" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
    OR "social"."is_public_post" ("social"."post"."id")
    OR "social"."is_post_author" ("social"."post"."id")
    OR EXISTS (
      SELECT 1
      FROM "social"."crew_shared_post" csp
      WHERE csp."post_id" = "social"."post"."id"
        AND "social"."is_active_crew_member" (csp."crew_id")
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to create their own posts" ON "social"."post" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("social"."post"."author_user_id" = "identity"."current_user_id" ());

--> statement-breakpoint
CREATE POLICY "Allow authors to update their posts" ON "social"."post" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("social"."post"."author_user_id" = "identity"."current_user_id" ()) WITH CHECK ("social"."post"."author_user_id" = "identity"."current_user_id" ());

--> statement-breakpoint
CREATE POLICY "Allow authors to delete their posts" ON "social"."post" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("social"."post"."author_user_id" = "identity"."current_user_id" ());

--> statement-breakpoint
CREATE POLICY "Allow users to read reactions on visible posts" ON "social"."reaction" AS PERMISSIVE FOR SELECT TO "authenticated" USING (
    EXISTS (
      SELECT 1
      FROM "social"."post" p
      WHERE p."id" = "social"."reaction"."post_id"
    )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to create their own reactions on visible posts" ON "social"."reaction" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (
    "social"."reaction"."user_id" = "identity"."current_user_id" ()
    AND (
    EXISTS (
      SELECT 1
      FROM "social"."post" p
      WHERE p."id" = "social"."reaction"."post_id"
    )
  )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to update their reactions on visible posts" ON "social"."reaction" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("social"."reaction"."user_id" = "identity"."current_user_id" ()) WITH CHECK (
    "social"."reaction"."user_id" = "identity"."current_user_id" ()
    AND (
    EXISTS (
      SELECT 1
      FROM "social"."post" p
      WHERE p."id" = "social"."reaction"."post_id"
    )
  )
  );

--> statement-breakpoint
CREATE POLICY "Allow users to delete their own reactions" ON "social"."reaction" AS PERMISSIVE FOR DELETE TO "authenticated" USING ("social"."reaction"."user_id" = "identity"."current_user_id" ());

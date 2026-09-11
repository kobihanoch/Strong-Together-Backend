ALTER POLICY "Allow members and crew leaders to read memberships"
ON "social"."crew_membership"
RENAME TO "Allow authorized users to read crew participants";

--> statement-breakpoint
ALTER POLICY "Allow authorized users to read crew participants" ON "social"."crew_membership" TO authenticated USING (
    "social"."is_crew_public" ("social"."crew_membership"."crew_id")
    OR "social"."is_crew_leader" ("social"."crew_membership"."crew_id")
    OR "social"."is_active_crew_member" ("social"."crew_membership"."crew_id")
  );--> statement-breakpoint
ALTER POLICY "Allow crew leaders to create memberships" ON "social"."crew_membership" TO authenticated WITH CHECK ("social"."is_crew_leader" ("social"."crew_membership"."crew_id"));--> statement-breakpoint
ALTER POLICY "Allow crew leaders to update memberships" ON "social"."crew_membership" TO authenticated USING ("social"."is_crew_leader" ("social"."crew_membership"."crew_id")) WITH CHECK ("social"."is_crew_leader" ("social"."crew_membership"."crew_id"));--> statement-breakpoint
ALTER POLICY "Allow members and crew leaders to delete memberships" ON "social"."crew_membership" TO authenticated USING (
    "social"."crew_membership"."user_id" = "identity"."current_user_id" ()
    OR "social"."is_crew_leader" ("social"."crew_membership"."crew_id")
  );--> statement-breakpoint
ALTER POLICY "Allow involved users and leaders to read crew requests" ON "social"."crew_participation_request" TO authenticated USING (
    
    "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
    OR "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
  
    OR "social"."is_crew_leader" ("social"."crew_participation_request"."crew_id")
  );--> statement-breakpoint
ALTER POLICY "Allow users to request public crews and leaders to invite users" ON "social"."crew_participation_request" TO authenticated WITH CHECK (
    "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
    AND "social"."crew_participation_request"."status" = 'pending'
    AND (
      (
        "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
        AND "social"."is_crew_public" ("social"."crew_participation_request"."crew_id")
      )
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
  );--> statement-breakpoint
ALTER POLICY "Allow authorized users to resolve pending crew requests" ON "social"."crew_participation_request" TO authenticated USING ((
    ("social"."crew_participation_request"."status" = 'pending')
    AND (((
    ((("social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id")) AND ("social"."is_crew_leader" ("social"."crew_participation_request"."crew_id")))
    OR ((("social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id")) AND ("social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()))
  )) OR (("social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ())))
  )) WITH CHECK (
        (
          ((
    (("social"."crew_participation_request"."status" = 'cancelled') AND (("social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ())))
    OR (("social"."crew_participation_request"."status" IN ('accepted', 'declined')) AND ((
    ((("social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id")) AND ("social"."is_crew_leader" ("social"."crew_participation_request"."crew_id")))
    OR ((("social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id")) AND ("social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()))
  )))
  ))
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
      );--> statement-breakpoint
ALTER POLICY "Allow member authors to share posts with crews" ON "social"."crew_shared_post" TO authenticated WITH CHECK (
    (
    "social"."is_crew_leader" ("social"."crew_shared_post"."crew_id")
    OR "social"."is_active_crew_member" ("social"."crew_shared_post"."crew_id")
  )
    AND (
    EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = "social"."crew_shared_post"."post_id"
        AND p."author_user_id" = "identity"."current_user_id" ()
    )
  )
  );--> statement-breakpoint
ALTER POLICY "Allow member authors to remove posts from crews" ON "social"."crew_shared_post" TO authenticated USING (
    (
    "social"."is_crew_leader" ("social"."crew_shared_post"."crew_id")
    OR "social"."is_active_crew_member" ("social"."crew_shared_post"."crew_id")
  )
    AND (
    EXISTS (
      SELECT
        1
      FROM
        "social"."post" p
      WHERE
        p."id" = "social"."crew_shared_post"."post_id"
        AND p."author_user_id" = "identity"."current_user_id" ()
    )
  )
  );--> statement-breakpoint
ALTER POLICY "Allow users to read global or accessible crew posts" ON "social"."post" TO authenticated USING (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
    OR 
    NOT EXISTS (
      SELECT
        1
      FROM
        "social"."crew_shared_post" csp
      WHERE
        csp."post_id" = "social"."post"."id"
    )
  
    OR EXISTS (
      SELECT
        1
      FROM
        "social"."crew_shared_post" csp
      WHERE
        csp."post_id" = "social"."post"."id"
        AND (
          "social"."is_crew_leader" (csp."crew_id")
          OR "social"."is_active_crew_member" (csp."crew_id")
        )
    )
  );

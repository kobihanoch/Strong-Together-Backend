DROP POLICY "Allow users to request to join crews" ON "social"."crew_participation_request";
--> statement-breakpoint
CREATE POLICY "Allow users to request to join crews" ON "social"."crew_participation_request"
AS PERMISSIVE FOR INSERT TO "authenticated"
WITH CHECK (
  "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
  AND "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
  AND "social"."crew_participation_request"."status" = 'pending'
);
--> statement-breakpoint
DROP POLICY "Allow authorized users to update pending crew requests" ON "social"."crew_participation_request";
--> statement-breakpoint
CREATE POLICY "Allow authorized users to update pending crew requests" ON "social"."crew_participation_request"
AS PERMISSIVE FOR UPDATE TO "authenticated"
USING (
  "social"."crew_participation_request"."status" = 'pending'
  AND (
    (
      "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
      AND (
        "social"."is_crew_leader" ("social"."crew_participation_request"."crew_id")
        OR (
          "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
          AND "social"."is_crew_public" ("social"."crew_participation_request"."crew_id")
        )
      )
    )
    OR (
      "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
      AND "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
    )
  )
)
WITH CHECK (
  "social"."crew_participation_request"."status" IN ('accepted', 'declined')
  AND (
    (
      "social"."crew_participation_request"."initiator_user_id" = "social"."crew_participation_request"."participant_user_id"
      AND (
        "social"."is_crew_leader" ("social"."crew_participation_request"."crew_id")
        OR (
          "social"."crew_participation_request"."initiator_user_id" = "identity"."current_user_id" ()
          AND "social"."is_crew_public" ("social"."crew_participation_request"."crew_id")
        )
      )
    )
    OR (
      "social"."crew_participation_request"."initiator_user_id" <> "social"."crew_participation_request"."participant_user_id"
      AND "social"."crew_participation_request"."participant_user_id" = "identity"."current_user_id" ()
    )
  )
);

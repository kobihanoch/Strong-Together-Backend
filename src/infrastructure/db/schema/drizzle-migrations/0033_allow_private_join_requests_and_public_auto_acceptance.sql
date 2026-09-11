ALTER POLICY "Allow users to request public crews and leaders to invite users" ON "social"."crew_participation_request" RENAME TO "Allow users to request crews and leaders to invite users";

--> statement-breakpoint
ALTER POLICY "Allow users to request crews and leaders to invite users"
ON "social"."crew_participation_request"
WITH CHECK (
  "initiator_user_id" = "identity"."current_user_id"()
  AND (
    (
      "initiator_user_id" = "participant_user_id"
      AND (
        (
          "social"."is_crew_public"("crew_id")
          AND "status" = 'accepted'
        )
        OR (
          NOT "social"."is_crew_public"("crew_id")
          AND "status" = 'pending'
        )
      )
    )
    OR (
      "initiator_user_id" <> "participant_user_id"
      AND "social"."is_crew_leader"("crew_id")
      AND "status" = 'pending'
    )
  )
);

ALTER POLICY "Allow active crew leaders to create memberships" ON "social"."crew_membership"
RENAME TO "Allow managers and new crew leaders to create memberships";

--> statement-breakpoint
ALTER POLICY "Allow managers and new crew leaders to create memberships" ON "social"."crew_membership" TO authenticated
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

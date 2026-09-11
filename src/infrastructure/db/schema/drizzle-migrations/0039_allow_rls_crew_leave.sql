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
ALTER POLICY "Allow active crew leaders to update their crews" ON "social"."crew" TO authenticated USING ("social"."can_manage_crew" ("social"."crew"."id"))
WITH
  CHECK ("social"."can_access_crew" ("social"."crew"."id"));

--> statement-breakpoint
-- The update policy limits this column to the current active leader and keeps
-- the caller active until the leadership transfer is complete.
GRANT
UPDATE ("leader_id") ON TABLE "social"."crew" TO "authenticated";

ALTER POLICY "Allow users to read visible crew post placements" ON "social"."crew_shared_post" TO authenticated USING (
  "social"."can_access_crew" ("social"."crew_shared_post"."crew_id")
);

ALTER POLICY "Allow authenticated users to read crew post placements" ON "social"."crew_shared_post"
RENAME TO "Allow users to read visible crew post placements";

--> statement-breakpoint
ALTER POLICY "Allow users to read visible crew post placements" ON "social"."crew_shared_post" TO authenticated USING (
  "social"."is_post_author" ("social"."crew_shared_post"."post_id")
  OR "social"."is_crew_leader" ("social"."crew_shared_post"."crew_id")
  OR "social"."is_active_crew_member" ("social"."crew_shared_post"."crew_id")
  OR "social"."is_public_post" ("social"."crew_shared_post"."post_id")
);

--> statement-breakpoint
ALTER POLICY "Allow member authors to share posts with crews" ON "social"."crew_shared_post" TO authenticated
WITH
  CHECK (
    (
      "social"."is_crew_leader" ("social"."crew_shared_post"."crew_id")
      OR "social"."is_active_crew_member" ("social"."crew_shared_post"."crew_id")
    )
    AND (
      "social"."is_post_author" ("social"."crew_shared_post"."post_id")
    )
  );

--> statement-breakpoint
ALTER POLICY "Allow member authors to remove posts from crews" ON "social"."crew_shared_post" TO authenticated USING (
  (
    "social"."is_crew_leader" ("social"."crew_shared_post"."crew_id")
    OR "social"."is_active_crew_member" ("social"."crew_shared_post"."crew_id")
  )
  AND (
    "social"."is_post_author" ("social"."crew_shared_post"."post_id")
  )
);

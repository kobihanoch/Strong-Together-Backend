ALTER POLICY "Allow users to read public or accessible crew posts" ON "social"."post" TO authenticated USING (
    "social"."post"."author_user_id" = "identity"."current_user_id" ()
    OR "social"."can_view_post" ("social"."post"."id")
  );
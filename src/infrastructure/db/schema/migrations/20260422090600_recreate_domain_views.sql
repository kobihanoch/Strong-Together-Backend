CREATE OR REPLACE VIEW "workout"."v_exercisetoworkoutsplit_expanded" WITH ("security_invoker"='on') AS
 SELECT "ews"."id",
    "ews"."workoutsplit_id",
    "ws"."workout_id",
    "ews"."exercise_id",
    "ex"."name" AS "exercise",
    "ws"."name" AS "workoutsplit",
    "ews"."sets",
    "ews"."order_index",
    "ews"."created_at",
    "ews"."is_active"
   FROM (("workout"."exercisetoworkoutsplit" "ews"
     JOIN "workout"."workoutsplits" "ws" ON (("ws"."id" = "ews"."workoutsplit_id")))
     JOIN "workout"."exercises" "ex" ON (("ex"."id" = "ews"."exercise_id")));

CREATE OR REPLACE VIEW "analytics"."v_exercisetracking_expanded" WITH ("security_invoker"='on') AS
 SELECT "et"."id",
    "et"."exercisetosplit_id",
    "et"."weight",
    "et"."reps",
    "ews"."exercise_id",
    "wsumm"."workoutsplit_id",
    "ws"."name" AS "splitname",
    "ex"."name" AS "exercise",
    "et"."notes",
    "et"."workout_summary_id",
    "wsumm"."workout_start_utc",
    "wsumm"."workout_end_utc"
   FROM (((("tracking"."exercisetracking" "et"
     LEFT JOIN "tracking"."workout_summary" "wsumm" ON (("wsumm"."id" = "et"."workout_summary_id")))
     LEFT JOIN "workout"."exercisetoworkoutsplit" "ews" ON (("ews"."id" = "et"."exercisetosplit_id")))
     LEFT JOIN "workout"."workoutsplits" "ws" ON (("ws"."id" = "wsumm"."workoutsplit_id")))
     LEFT JOIN "workout"."exercises" "ex" ON (("ex"."id" = "ews"."exercise_id")));

CREATE OR REPLACE VIEW "analytics"."v_exercisetracking_set_simple" WITH ("security_invoker"='on') AS
 SELECT "et"."id",
    "et"."exercisetosplit_id",
    "et"."exercise_id",
    "et"."exercise",
    "s"."weight",
    "s"."reps",
    "et"."workout_summary_id",
    "et"."workout_start_utc",
    "et"."workout_end_utc"
   FROM ("analytics"."v_exercisetracking_expanded" "et"
     CROSS JOIN LATERAL UNNEST("et"."weight", "et"."reps") "s"("weight", "reps"));

CREATE OR REPLACE VIEW "analytics"."v_prs" WITH ("security_invoker"='on') AS
 SELECT DISTINCT ON ("s"."exercise_id") "s"."id",
    "s"."exercisetosplit_id",
    "s"."exercise_id",
    "s"."exercise",
    "s"."weight",
    "s"."reps",
    "s"."workout_summary_id",
    "s"."workout_start_utc",
    "s"."workout_end_utc"
   FROM "analytics"."v_exercisetracking_set_simple" "s"
  WHERE (("s"."weight" IS NOT NULL) AND ("s"."reps" IS NOT NULL))
  ORDER BY "s"."exercise_id", "s"."weight" DESC, "s"."reps" DESC, "s"."workout_start_utc" DESC, "s"."id" DESC;

COMMENT ON SCHEMA "analytics" IS 'Reporting and analytics views';


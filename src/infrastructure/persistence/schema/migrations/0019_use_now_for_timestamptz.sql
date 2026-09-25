-- Store current instants directly as timestamptz without a session-timezone-dependent round trip.
ALTER TABLE "identity"."oauth_account" ALTER COLUMN "linked_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "identity"."user" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "identity"."user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "messages"."message" ALTER COLUMN "sent_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "reminders"."user_reminder_setting" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "reminders"."user_split_information" ALTER COLUMN "last_computed_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "tracking"."aerobic_tracking" ALTER COLUMN "workout_time_utc" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "workout"."exercise_to_workout_split" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "workout"."workout_plan" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "workout"."workout_split" ALTER COLUMN "created_at" SET DEFAULT now();
--> statement-breakpoint
CREATE OR REPLACE FUNCTION "reminders"."refresh_user_split_information"()
RETURNS void
LANGUAGE sql
AS $$
WITH recent_workouts AS (
  SELECT ws.user_id, ws.workout_split_id, ws.workout_end_utc, ws.workout_start_utc
  FROM tracking.exercise_tracking et
  JOIN tracking.workout_summary ws ON ws.id = et.workout_summary_id
  WHERE ws.workout_start_utc >= now() - INTERVAL '21 days'
    AND ws.workout_split_id IS NOT NULL
), weekday_counts AS (
  SELECT rw.user_id, rw.workout_split_id,
    EXTRACT(DOW FROM rw.workout_start_utc at time zone urs.timezone) AS weekday,
    COUNT(*) AS cnt,
    ROW_NUMBER() OVER (PARTITION BY rw.user_id, rw.workout_split_id ORDER BY COUNT(*) DESC) AS rn
  FROM recent_workouts rw
  JOIN reminders.user_reminder_setting urs ON urs.user_id = rw.user_id
  GROUP BY rw.user_id, rw.workout_split_id, EXTRACT(DOW FROM rw.workout_start_utc at time zone urs.timezone)
), filtered AS (
  SELECT rw.user_id, rw.workout_split_id, rw.workout_start_utc AS adjusted_time_utc,
    EXTRACT(DOW FROM rw.workout_start_utc) AS weekday
  FROM recent_workouts rw
  JOIN weekday_counts wc ON wc.user_id = rw.user_id AND wc.workout_split_id = rw.workout_split_id
    AND wc.weekday = EXTRACT(DOW FROM rw.workout_start_utc) AND wc.rn = 1
), aggregated AS (
  SELECT f.user_id, f.workout_split_id, wc.weekday AS preferred_weekday, COUNT(*) AS total_cnt,
    FLOOR(AVG((EXTRACT(EPOCH FROM f.adjusted_time_utc)) % 86400))::int AS avg_seconds_in_day
  FROM filtered f
  JOIN weekday_counts wc ON wc.user_id = f.user_id AND wc.workout_split_id = f.workout_split_id
    AND wc.weekday = f.weekday AND wc.rn = 1
  GROUP BY f.user_id, f.workout_split_id, wc.weekday
), finalized AS (
  SELECT a.user_id, a.workout_split_id,
    DATE_TRUNC('day', now()) + make_interval(secs => a.avg_seconds_in_day) AS estimated_time_utc,
    a.preferred_weekday, a.total_cnt
  FROM aggregated a
)
INSERT INTO reminders.user_split_information
  (user_id, workout_split_id, estimated_time_utc, confidence, last_computed_at, preferred_weekday)
SELECT f.user_id, f.workout_split_id, f.estimated_time_utc,
  CASE WHEN f.total_cnt >= 3 THEN 1.00 WHEN f.total_cnt = 2 THEN 0.60 ELSE 0.30 END,
  now(), f.preferred_weekday
FROM finalized f
ON CONFLICT (user_id, workout_split_id) DO UPDATE
SET estimated_time_utc = EXCLUDED.estimated_time_utc,
  confidence = EXCLUDED.confidence,
  last_computed_at = EXCLUDED.last_computed_at,
  preferred_weekday = EXCLUDED.preferred_weekday;
$$;

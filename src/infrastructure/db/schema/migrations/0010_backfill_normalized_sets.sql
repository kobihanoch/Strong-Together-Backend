-- Validate all legacy values before writing anything. The migration deliberately
-- fails on ambiguous or unrepresentable data so production is never partially
-- or silently backfilled.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM workout.exercise_to_workout_split ews
    CROSS JOIN LATERAL unnest(ews.sets) AS legacy_set(reps)
    WHERE legacy_set.reps IS NULL
       OR legacy_set.reps < -2147483648
       OR legacy_set.reps > 2147483647
  ) THEN
    RAISE EXCEPTION 'Cannot backfill workout_set: legacy sets contains NULL or a value outside the integer range';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM tracking.exercise_tracking et
    WHERE cardinality(et.weight) <> cardinality(et.reps)
  ) THEN
    RAISE EXCEPTION 'Cannot backfill tracking_set: legacy weight and reps arrays have different lengths';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM tracking.exercise_tracking et
    CROSS JOIN LATERAL unnest(et.weight, et.reps) AS legacy_set(weight, reps)
    WHERE legacy_set.weight IS NULL
       OR legacy_set.reps IS NULL
       OR legacy_set.reps < -2147483648
       OR legacy_set.reps > 2147483647
  ) THEN
    RAISE EXCEPTION 'Cannot backfill tracking_set: legacy arrays contain NULL or reps outside the integer range';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM workout.exercise_to_workout_split ews
    CROSS JOIN LATERAL unnest(ews.sets) WITH ORDINALITY AS legacy_set(reps, ordinality)
    JOIN workout.workout_set workout_set
      ON workout_set.exercise_to_split_id = ews.id
     AND workout_set.order_index = legacy_set.ordinality - 1
    WHERE workout_set.reps <> legacy_set.reps
  ) THEN
    RAISE EXCEPTION 'Cannot backfill workout_set: an existing normalized set conflicts with legacy data';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM tracking.exercise_tracking et
    CROSS JOIN LATERAL unnest(et.weight, et.reps) WITH ORDINALITY AS legacy_set(weight, reps, ordinality)
    JOIN tracking.tracking_set tracking_set
      ON tracking_set.exercise_tracking_id = et.id
     AND tracking_set.set_index = legacy_set.ordinality - 1
    WHERE tracking_set.weight IS DISTINCT FROM legacy_set.weight
       OR tracking_set.reps <> legacy_set.reps
  ) THEN
    RAISE EXCEPTION 'Cannot backfill tracking_set: an existing normalized set conflicts with legacy data';
  END IF;
END $$;--> statement-breakpoint

INSERT INTO workout.workout_set (exercise_to_split_id, order_index, reps)
SELECT
  ews.id,
  (legacy_set.ordinality - 1)::integer,
  legacy_set.reps::integer
FROM workout.exercise_to_workout_split ews
CROSS JOIN LATERAL unnest(ews.sets) WITH ORDINALITY AS legacy_set(reps, ordinality)
ON CONFLICT (exercise_to_split_id, order_index) DO NOTHING;--> statement-breakpoint

INSERT INTO tracking.tracking_set (exercise_tracking_id, set_index, reps, weight)
SELECT
  et.id,
  (legacy_set.ordinality - 1)::integer,
  legacy_set.reps::integer,
  legacy_set.weight::real
FROM tracking.exercise_tracking et
CROSS JOIN LATERAL unnest(et.weight, et.reps) WITH ORDINALITY AS legacy_set(weight, reps, ordinality)
ON CONFLICT (exercise_tracking_id, set_index) DO NOTHING;--> statement-breakpoint

-- Verify that every legacy set now has an identical normalized row. Raising here
-- rolls the migration back and leaves all legacy columns untouched.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM workout.exercise_to_workout_split ews
    CROSS JOIN LATERAL unnest(ews.sets) WITH ORDINALITY AS legacy_set(reps, ordinality)
    LEFT JOIN workout.workout_set workout_set
      ON workout_set.exercise_to_split_id = ews.id
     AND workout_set.order_index = legacy_set.ordinality - 1
     AND workout_set.reps = legacy_set.reps
    WHERE workout_set.id IS NULL
  ) THEN
    RAISE EXCEPTION 'workout_set backfill verification failed';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM tracking.exercise_tracking et
    CROSS JOIN LATERAL unnest(et.weight, et.reps) WITH ORDINALITY AS legacy_set(weight, reps, ordinality)
    LEFT JOIN tracking.tracking_set tracking_set
      ON tracking_set.exercise_tracking_id = et.id
     AND tracking_set.set_index = legacy_set.ordinality - 1
     AND tracking_set.weight IS NOT DISTINCT FROM legacy_set.weight
     AND tracking_set.reps = legacy_set.reps
    WHERE tracking_set.id IS NULL
  ) THEN
    RAISE EXCEPTION 'tracking_set backfill verification failed';
  END IF;
END $$;

DO $$
DECLARE
  no_plan_user_id uuid := 'f1eec8b0-06cf-4cda-b3e9-1df82c8a0a7d';
  plan_only_user_id uuid := '9b31d67c-0a5a-4f56-a0fd-7db2a50d8a01';
  plan_tracking_user_id uuid := '83d44360-8d7d-4a26-8457-7f3e4f8414b1';
  full_seed_user_id uuid := 'ec554122-8ed7-4655-b646-7eadb76fa9e4';
  plan_only_plan_id bigint;
  plan_tracking_plan_id bigint;
  full_seed_plan_id bigint;
  plan_only_split_id bigint;
  plan_tracking_split_id bigint;
  full_seed_split_id bigint;
  plan_tracking_ets_id bigint;
  full_seed_ets_id bigint;
  plan_tracking_summary_id uuid;
  full_seed_summary_id uuid;
  plan_tracking_tracking_id bigint;
  full_seed_tracking_id bigint;
  yesterday_start timestamptz := (date_trunc('day', now() AT TIME ZONE 'UTC') - interval '1 day' + interval '10 hours') AT TIME ZONE 'UTC';
  password_hash text := '$2b$10$10eqahqgpjjezkzEwrVmp..o/JP9BcOfivPrTHCASX9v/rkXUz4Qu';
BEGIN
  INSERT INTO identity.user (
    id,
    username,
    email,
    name,
    gender,
    password,
    role,
    is_first_login,
    token_version,
    is_verified,
    auth_provider,
    profile_image_path,
    push_token,
    created_at
  ) VALUES
    (
      no_plan_user_id,
      'u0',
      'u0@example.com',
      'Seed No Plan No Tracking',
      'Other',
      password_hash,
      'User',
      false,
      0,
      true,
      'app',
      NULL,
      NULL,
      now()
    ),
    (
      plan_only_user_id,
      'u1',
      'u1@example.com',
      'Seed Plan No Tracking',
      'Other',
      password_hash,
      'User',
      false,
      0,
      true,
      'app',
      NULL,
      NULL,
      now()
    ),
    (
      plan_tracking_user_id,
      'u2',
      'u2@example.com',
      'Seed Plan Tracking No Aerobics',
      'Other',
      password_hash,
      'User',
      false,
      0,
      true,
      'app',
      NULL,
      NULL,
      now()
    ),
    (
      full_seed_user_id,
      'u3',
      'u3@example.com',
      'Seed Plan Tracking Aerobics',
      'Other',
      password_hash,
      'User',
      false,
      0,
      true,
      'app',
      NULL,
      NULL,
      now()
    );

  INSERT INTO workout.workout_plan (user_id, trainer_id, is_active, updated_at)
  VALUES (plan_only_user_id, plan_only_user_id, TRUE, now())
  RETURNING id INTO plan_only_plan_id;

  INSERT INTO workout.workout_split (workout_id, name, is_active)
  VALUES (plan_only_plan_id, 'A', TRUE)
  RETURNING id INTO plan_only_split_id;

  INSERT INTO workout.exercise_to_workout_split (workout_split_id, exercise_id, order_index, is_active)
  VALUES
    (plan_only_split_id, 20, 0, TRUE),
    (plan_only_split_id, 12, 1, TRUE);

  INSERT INTO workout.workout_set (exercise_to_split_id, order_index, reps)
  SELECT ets.id, planned_set.order_index, planned_set.reps
  FROM workout.exercise_to_workout_split ets
  CROSS JOIN (VALUES (0, 8), (1, 8), (2, 8)) AS planned_set(order_index, reps)
  WHERE ets.workout_split_id = plan_only_split_id AND ets.exercise_id = 20
  UNION ALL
  SELECT ets.id, planned_set.order_index, planned_set.reps
  FROM workout.exercise_to_workout_split ets
  CROSS JOIN (VALUES (0, 10), (1, 10), (2, 10)) AS planned_set(order_index, reps)
  WHERE ets.workout_split_id = plan_only_split_id AND ets.exercise_id = 12;

  INSERT INTO workout.workout_plan (user_id, trainer_id, is_active, updated_at)
  VALUES (plan_tracking_user_id, plan_tracking_user_id, TRUE, now())
  RETURNING id INTO plan_tracking_plan_id;

  INSERT INTO workout.workout_split (workout_id, name, is_active)
  VALUES (plan_tracking_plan_id, 'A', TRUE)
  RETURNING id INTO plan_tracking_split_id;

  INSERT INTO workout.exercise_to_workout_split (workout_split_id, exercise_id, order_index, is_active)
  VALUES (plan_tracking_split_id, 20, 0, TRUE)
  RETURNING id INTO plan_tracking_ets_id;

  INSERT INTO workout.exercise_to_workout_split (workout_split_id, exercise_id, order_index, is_active)
  VALUES (plan_tracking_split_id, 12, 1, TRUE);

  INSERT INTO workout.workout_set (exercise_to_split_id, order_index, reps)
  SELECT ets.id, planned_set.order_index, planned_set.reps
  FROM workout.exercise_to_workout_split ets
  CROSS JOIN (VALUES (0, 8), (1, 8), (2, 8)) AS planned_set(order_index, reps)
  WHERE ets.workout_split_id = plan_tracking_split_id AND ets.exercise_id = 20
  UNION ALL
  SELECT ets.id, planned_set.order_index, planned_set.reps
  FROM workout.exercise_to_workout_split ets
  CROSS JOIN (VALUES (0, 10), (1, 10), (2, 10)) AS planned_set(order_index, reps)
  WHERE ets.workout_split_id = plan_tracking_split_id AND ets.exercise_id = 12;

  INSERT INTO tracking.workout_summary (user_id, workout_start_utc, workout_end_utc, workout_split_id)
  VALUES (plan_tracking_user_id, yesterday_start, yesterday_start + interval '45 minutes', plan_tracking_split_id)
  RETURNING id INTO plan_tracking_summary_id;

  INSERT INTO tracking.exercise_tracking (exercise_to_split_id, notes, workout_summary_id)
  VALUES (plan_tracking_ets_id, 'Seed workout from yesterday', plan_tracking_summary_id)
  RETURNING id INTO plan_tracking_tracking_id;

  INSERT INTO tracking.tracking_set (exercise_tracking_id, set_index, weight, reps)
  VALUES (plan_tracking_tracking_id, 0, 60, 8), (plan_tracking_tracking_id, 1, 65, 8),
    (plan_tracking_tracking_id, 2, 70, 6);

  INSERT INTO workout.workout_plan (user_id, trainer_id, is_active, updated_at)
  VALUES (full_seed_user_id, full_seed_user_id, TRUE, now())
  RETURNING id INTO full_seed_plan_id;

  INSERT INTO workout.workout_split (workout_id, name, is_active)
  VALUES (full_seed_plan_id, 'A', TRUE)
  RETURNING id INTO full_seed_split_id;

  INSERT INTO workout.exercise_to_workout_split (workout_split_id, exercise_id, order_index, is_active)
  VALUES (full_seed_split_id, 20, 0, TRUE)
  RETURNING id INTO full_seed_ets_id;

  INSERT INTO workout.exercise_to_workout_split (workout_split_id, exercise_id, order_index, is_active)
  VALUES (full_seed_split_id, 12, 1, TRUE);

  INSERT INTO workout.workout_set (exercise_to_split_id, order_index, reps)
  SELECT ets.id, planned_set.order_index, planned_set.reps
  FROM workout.exercise_to_workout_split ets
  CROSS JOIN (VALUES (0, 8), (1, 8), (2, 8)) AS planned_set(order_index, reps)
  WHERE ets.workout_split_id = full_seed_split_id AND ets.exercise_id = 20
  UNION ALL
  SELECT ets.id, planned_set.order_index, planned_set.reps
  FROM workout.exercise_to_workout_split ets
  CROSS JOIN (VALUES (0, 10), (1, 10), (2, 10)) AS planned_set(order_index, reps)
  WHERE ets.workout_split_id = full_seed_split_id AND ets.exercise_id = 12;

  INSERT INTO tracking.workout_summary (user_id, workout_start_utc, workout_end_utc, workout_split_id)
  VALUES (full_seed_user_id, yesterday_start, yesterday_start + interval '50 minutes', full_seed_split_id)
  RETURNING id INTO full_seed_summary_id;

  INSERT INTO tracking.exercise_tracking (exercise_to_split_id, notes, workout_summary_id)
  VALUES (full_seed_ets_id, 'Seed workout from yesterday', full_seed_summary_id)
  RETURNING id INTO full_seed_tracking_id;

  INSERT INTO tracking.tracking_set (exercise_tracking_id, set_index, weight, reps)
  VALUES (full_seed_tracking_id, 0, 62.5, 8), (full_seed_tracking_id, 1, 67.5, 8),
    (full_seed_tracking_id, 2, 72.5, 5);

  INSERT INTO tracking.aerobic_tracking (user_id, type, duration_mins, duration_sec, workout_time_utc)
  VALUES (full_seed_user_id, 'Walk', 30, 0, yesterday_start + interval '2 hours');
END $$;

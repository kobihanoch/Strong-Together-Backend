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
  yesterday_start timestamptz := (date_trunc('day', now() AT TIME ZONE 'UTC') - interval '1 day' + interval '10 hours') AT TIME ZONE 'UTC';
  password_hash text := '$2b$10$10eqahqgpjjezkzEwrVmp..o/JP9BcOfivPrTHCASX9v/rkXUz4Qu';
BEGIN
  INSERT INTO identity.users (
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
    profile_image_url,
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

  INSERT INTO workout.workoutplans (user_id, trainer_id, numberofsplits, is_active, updated_at)
  VALUES (plan_only_user_id, plan_only_user_id, 1, TRUE, now())
  RETURNING id INTO plan_only_plan_id;

  INSERT INTO workout.workoutsplits (workout_id, name, is_active)
  VALUES (plan_only_plan_id, 'A', TRUE)
  RETURNING id INTO plan_only_split_id;

  INSERT INTO workout.exercisetoworkoutsplit (workoutsplit_id, exercise_id, sets, order_index, is_active)
  VALUES
    (plan_only_split_id, 20, ARRAY[8, 8, 8]::bigint[], 0, TRUE),
    (plan_only_split_id, 12, ARRAY[10, 10, 10]::bigint[], 1, TRUE);

  INSERT INTO workout.workoutplans (user_id, trainer_id, numberofsplits, is_active, updated_at)
  VALUES (plan_tracking_user_id, plan_tracking_user_id, 1, TRUE, now())
  RETURNING id INTO plan_tracking_plan_id;

  INSERT INTO workout.workoutsplits (workout_id, name, is_active)
  VALUES (plan_tracking_plan_id, 'A', TRUE)
  RETURNING id INTO plan_tracking_split_id;

  INSERT INTO workout.exercisetoworkoutsplit (workoutsplit_id, exercise_id, sets, order_index, is_active)
  VALUES (plan_tracking_split_id, 20, ARRAY[8, 8, 8]::bigint[], 0, TRUE)
  RETURNING id INTO plan_tracking_ets_id;

  INSERT INTO workout.exercisetoworkoutsplit (workoutsplit_id, exercise_id, sets, order_index, is_active)
  VALUES (plan_tracking_split_id, 12, ARRAY[10, 10, 10]::bigint[], 1, TRUE);

  INSERT INTO tracking.workout_summary (user_id, workout_start_utc, workout_end_utc, workoutsplit_id)
  VALUES (plan_tracking_user_id, yesterday_start, yesterday_start + interval '45 minutes', plan_tracking_split_id)
  RETURNING id INTO plan_tracking_summary_id;

  INSERT INTO tracking.exercisetracking (exercisetosplit_id, weight, reps, notes, workout_summary_id)
  VALUES (plan_tracking_ets_id, ARRAY[60, 65, 70]::real[], ARRAY[8, 8, 6]::bigint[], 'Seed workout from yesterday', plan_tracking_summary_id);

  INSERT INTO workout.workoutplans (user_id, trainer_id, numberofsplits, is_active, updated_at)
  VALUES (full_seed_user_id, full_seed_user_id, 1, TRUE, now())
  RETURNING id INTO full_seed_plan_id;

  INSERT INTO workout.workoutsplits (workout_id, name, is_active)
  VALUES (full_seed_plan_id, 'A', TRUE)
  RETURNING id INTO full_seed_split_id;

  INSERT INTO workout.exercisetoworkoutsplit (workoutsplit_id, exercise_id, sets, order_index, is_active)
  VALUES (full_seed_split_id, 20, ARRAY[8, 8, 8]::bigint[], 0, TRUE)
  RETURNING id INTO full_seed_ets_id;

  INSERT INTO workout.exercisetoworkoutsplit (workoutsplit_id, exercise_id, sets, order_index, is_active)
  VALUES (full_seed_split_id, 12, ARRAY[10, 10, 10]::bigint[], 1, TRUE);

  INSERT INTO tracking.workout_summary (user_id, workout_start_utc, workout_end_utc, workoutsplit_id)
  VALUES (full_seed_user_id, yesterday_start, yesterday_start + interval '50 minutes', full_seed_split_id)
  RETURNING id INTO full_seed_summary_id;

  INSERT INTO tracking.exercisetracking (exercisetosplit_id, weight, reps, notes, workout_summary_id)
  VALUES (full_seed_ets_id, ARRAY[62.5, 67.5, 72.5]::real[], ARRAY[8, 8, 5]::bigint[], 'Seed workout from yesterday', full_seed_summary_id);

  INSERT INTO tracking.aerobictracking (user_id, type, duration_mins, duration_sec, workout_time_utc)
  VALUES (full_seed_user_id, 'Walk', 30, 0, yesterday_start + interval '2 hours');
END $$;

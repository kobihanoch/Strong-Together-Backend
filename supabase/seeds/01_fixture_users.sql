INSERT INTO public.users (
  username,
  email,
  name,
  gender,
  password,
  role,
  is_first_login,
  token_version,
  is_verified,
  auth_provider
)
VALUES
  ('auth_test_user', 'auth_test_user@example.com', 'Auth Test User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('users_test_user', 'users_test_user@example.com', 'Users Test User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('workouts_test_user', 'workouts_test_user@example.com', 'Workouts Test User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('bootstrap_test_user', 'bootstrap_test_user@example.com', 'Bootstrap Test User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('bootstrap_flow_user', 'bootstrap_flow_user@example.com', 'Bootstrap Flow User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('bootstrap_aerobics_user', 'bootstrap_aerobics_user@example.com', 'Bootstrap Aerobics User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('messages_test_user', 'messages_test_user@example.com', 'Messages Test User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('aerobics_test_user', 'aerobics_test_user@example.com', 'Aerobics Test User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('aerobics_aggregate_user', 'aerobics_aggregate_user@example.com', 'Aerobics Aggregate User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('aerobics_get_user', 'aerobics_get_user@example.com', 'Aerobics Get User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('aerobics_default_tz_user', 'aerobics_default_tz_user@example.com', 'Aerobics Default TZ User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('analytics_test_user', 'analytics_test_user@example.com', 'Analytics Test User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('analytics_empty_user', 'analytics_empty_user@example.com', 'Analytics Empty User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('oauth_complete_user', 'oauth_complete_user@example.com', 'OAuth Complete User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('oauth_incomplete_user', 'oauth_incomplete_user@example.com', 'OAuth Incomplete User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app'),
  ('conflict_user', 'conflict_user@example.com', 'Conflict User', 'Male', '$2b$10$ZpjAscThaAj5E5T5bkhktudfz1BfRNW0yIvYaKcYWpMMqWRR33TCi', 'User', false, 0, true, 'app');

INSERT INTO public.user_reminder_settings (user_id)
SELECT id
FROM public.users
WHERE username IN (
  'auth_test_user',
  'users_test_user',
  'workouts_test_user',
  'bootstrap_test_user',
  'bootstrap_flow_user',
  'bootstrap_aerobics_user',
  'messages_test_user',
  'aerobics_test_user',
  'aerobics_aggregate_user',
  'aerobics_get_user',
  'aerobics_default_tz_user',
  'analytics_test_user',
  'analytics_empty_user',
  'oauth_complete_user',
  'oauth_incomplete_user',
  'conflict_user'
);

INSERT INTO public.oauth_accounts (user_id, provider, provider_user_id, provider_email, missing_fields)
SELECT id, 'google', 'google-oauth-complete-sub', email, NULL
FROM public.users
WHERE username = 'oauth_complete_user';

INSERT INTO public.oauth_accounts (user_id, provider, provider_user_id, provider_email, missing_fields)
SELECT id, 'google', 'google-oauth-incomplete-sub', email, 'name,email'
FROM public.users
WHERE username = 'oauth_incomplete_user';

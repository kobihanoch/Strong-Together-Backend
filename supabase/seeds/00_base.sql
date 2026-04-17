INSERT INTO public.users (
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
) VALUES (
  '8dedd0e0-8c25-4c84-a05b-4ae5f5c48f3a',
  'system_bot',
  'system.bot@example.com',
  'System Bot',
  'Other',
  '$2b$10$sDZRfXOYan6z1IL69pGLjeHa1UpfKPiyUQw45mMZJduNfrge6/Xmq',
  'User',
  false,
  30,
  true,
  'app',
  'profile_pics/system-bot/avatar.jpg',
  NULL,
  '2025-04-11 11:36:08.686+00'
);

INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (1, 'Squat', 'Barbell/Dumbbell', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (2, 'Leg Extensions', 'Machine', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (3, 'RDL', 'Barbell/Dumbbell', 'Legs', 'Hamstrings');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (4, 'Calf Raises', 'Machine', 'Legs', 'Calves');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (5, 'Leg Curl', 'Machine', 'Legs', 'Hamstrings');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (6, 'Walking Lunges', 'Bodyweight/Barbell', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (7, 'Leg Press', 'Machine', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (8, 'Standing Calf Raise', 'Machine', 'Legs', 'Calves');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (9, 'Bulgarian Split Squat', 'Dumbbell', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (10, 'Hack Squat', 'Machine', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (11, 'Glute Ham Raise', 'Machine', 'Legs', 'Hamstrings');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (12, 'Lat Pulldown', 'Pulley', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (13, 'Pullover', 'Pulley', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (14, 'Bent Over Row', 'Barbell', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (15, 'Dumbbell Rows', 'Dumbbell', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (16, 'Seated Cable Row', 'Cable', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (17, 'Deadlift', 'Barbell', 'Back', 'Lower');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (18, 'T-Bar Row', 'Barbell', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (19, 'Pull-Up', 'Bodyweight', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (20, 'Bench Press', 'Barbell/Dumbbell', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (21, 'Incline Bench Press', 'Barbell/Dumbbell', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (22, 'Chest Fly', 'Dumbbell', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (23, 'Pec Deck', 'Machine', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (24, 'Cable Crossover', 'Cable', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (25, 'Decline Bench Press', 'Barbell/Dumbbell', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (26, 'Shoulder Press', 'Barbell/Dumbbell', 'Shoulders', 'Delts');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (27, 'Front Raises', 'Barbell/Dumbbell', 'Shoulders', 'Front');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (28, 'Reverse Flies', 'Any', 'Shoulders', 'Rear');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (29, 'Lateral Raises', 'Dumbbell', 'Shoulders', 'Delts');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (30, 'Dumbbell Shoulder Press', 'Dumbbell', 'Shoulders', 'Delts');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (31, 'Upright Row', 'Barbell', 'Shoulders', 'Rear');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (32, 'Arnold Press', 'Dumbbell', 'Shoulders', 'Delts');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (33, 'Face Pull', 'Cable', 'Shoulders', 'Rear');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (34, 'Low Triceps Extensions', 'Pulley', 'Triceps', 'Lateral');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (35, 'High Triceps Extensions', 'Pulley', 'Triceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (36, 'Close Grip Dips', 'Bodyweight', 'Triceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (37, 'Skull Crushers', 'Barbell', 'Triceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (38, 'Overhead Tricep Ext.', 'Dumbbell', 'Triceps', 'Lateral');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (39, 'Rope Pushdown', 'Cable', 'Triceps', 'Lateral');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (40, 'Close Biceps Curls', 'Barbell/Dumbbell', 'Biceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (41, 'Wide Biceps Curls', 'Barbell/Dumbbell', 'Biceps', 'Short');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (42, 'Hammer Curls', 'Any', 'Biceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (43, 'Barbell Curl', 'Barbell', 'Biceps', 'Short');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (44, 'Preacher Curl', 'Barbell/Dumbbell', 'Biceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (45, 'Cable Kickback', 'Cable', 'Glutes', 'Gluteus Maximus');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (46, 'Glute Bridge', 'Barbell', 'Glutes', 'Gluteus Maximus');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (47, 'Crunch', 'Bodyweight', 'Abs', 'Rectus Abdominis');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (48, 'Russian Twist', 'Bodyweight/Dumbbell', 'Abs', 'Abs');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (49, 'Hanging Leg Raise', 'Bodyweight', 'Abs', 'Lower Abs');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (50, 'Bicycle Crunch', 'Bodyweight', 'Abs', 'Abs');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (51, 'Plank', 'Bodyweight', 'Abs', 'Ab');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (52, 'Front Squat', 'Barbell', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (53, 'Goblet Squat', 'Dumbbell', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (54, 'Smith Machine Squat', 'Smith Machine', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (55, 'Pendulum Squat', 'Machine', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (56, 'V-Squat', 'Machine', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (57, 'Sissy Squat', 'Machine/Bodyweight', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (58, 'Split Squat', 'Dumbbell', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (59, 'Step-Up', 'Dumbbell', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (60, 'Box Squat', 'Barbell', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (61, 'Heels-Elevated Squat', 'Barbell/Dumbbell', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (62, 'Single-Leg Leg Extension', 'Machine', 'Legs', 'Quads');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (63, 'Seated Leg Curl', 'Machine', 'Legs', 'Hamstrings');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (64, 'Lying Leg Curl', 'Machine', 'Legs', 'Hamstrings');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (65, 'Nordic Hamstring Curl', 'Bodyweight', 'Legs', 'Hamstrings');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (66, 'Good Morning', 'Barbell', 'Legs', 'Hamstrings');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (67, 'Staggered-Stance RDL', 'Barbell/Dumbbell', 'Legs', 'Hamstrings');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (68, 'Cable Leg Curl', 'Cable', 'Legs', 'Hamstrings');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (69, 'Hip Adductor', 'Machine', 'Legs', 'Adductors');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (70, 'Cable Hip Adduction', 'Cable', 'Legs', 'Adductors');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (71, 'Standing Band Adduction', 'Bands', 'Legs', 'Adductors');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (72, 'Hip Abductor', 'Machine', 'Legs', 'Abductors');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (73, 'Cable Hip Abduction', 'Cable', 'Legs', 'Abductors');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (74, 'Side-Lying Leg Raise', 'Bodyweight', 'Legs', 'Abductors');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (75, 'Monster Walk', 'Bands', 'Legs', 'Abductors');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (76, 'Seated Calf Raise', 'Machine', 'Legs', 'Calves');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (77, 'Donkey Calf Raise', 'Machine', 'Legs', 'Calves');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (78, 'Leg Press Calf Raise', 'Machine', 'Legs', 'Calves');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (79, 'Smith Calf Raise', 'Smith Machine', 'Legs', 'Calves');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (80, 'One-Arm Dumbbell Row', 'Dumbbell', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (81, 'Chest-Supported Row', 'Machine', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (82, 'Landmine Row', 'Barbell', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (83, 'Meadows Row', 'Barbell', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (84, 'Seal Row', 'Barbell', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (85, 'Wide-Grip Lat Pulldown', 'Pulley', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (86, 'Close-Grip Lat Pulldown', 'Pulley', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (87, 'Neutral-Grip Pulldown', 'Pulley', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (88, 'Straight-Arm Pulldown', 'Cable', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (89, 'Machine High Row', 'Machine', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (90, 'Machine Low Row', 'Machine', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (91, 'Assisted Pull-Up', 'Machine', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (92, 'Inverted Row', 'Bodyweight', 'Back', 'Lats');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (93, 'Rack Pull', 'Barbell', 'Back', 'Lower');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (94, 'Machine Chest Press', 'Machine', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (95, 'Dumbbell Bench Press', 'Dumbbell', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (96, 'Incline Dumbbell Press', 'Dumbbell', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (97, 'Decline Dumbbell Press', 'Dumbbell', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (98, 'Smith Machine Bench Press', 'Smith Machine', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (99, 'Push-Up', 'Bodyweight', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (100, 'Cable Fly (High to Low)', 'Cable', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (101, 'Cable Fly (Low to High)', 'Cable', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (102, 'Incline Dumbbell Fly', 'Dumbbell', 'Chest', 'Major');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (103, 'Machine Shoulder Press', 'Machine', 'Shoulders', 'Delts');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (104, 'Smith Machine Shoulder Press', 'Smith Machine', 'Shoulders', 'Delts');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (105, 'Seated Dumbbell Lateral Raise', 'Dumbbell', 'Shoulders', 'Delts');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (106, 'Cable Lateral Raise', 'Cable', 'Shoulders', 'Delts');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (107, 'Rear Delt Fly (Machine)', 'Machine', 'Shoulders', 'Rear');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (108, 'Reverse Pec Deck', 'Machine', 'Shoulders', 'Rear');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (109, 'Dumbbell Rear Delt Row', 'Dumbbell', 'Shoulders', 'Rear');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (110, 'Front Plate Raise', 'Plate', 'Shoulders', 'Front');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (111, 'Lean-Away Lateral Raise', 'Cable', 'Shoulders', 'Delts');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (112, 'Close-Grip Bench Press', 'Barbell', 'Triceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (113, 'Bench Dips', 'Bodyweight', 'Triceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (114, 'Dumbbell Triceps Kickback', 'Dumbbell', 'Triceps', 'Lateral');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (115, 'Single-Arm Cable Pushdown', 'Cable', 'Triceps', 'Lateral');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (116, 'Overhead Cable Triceps Extension', 'Cable', 'Triceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (117, 'Triceps Press (Machine)', 'Machine', 'Triceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (118, 'EZ-Bar Skull Crusher', 'Barbell', 'Triceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (119, 'Concentration Curl', 'Dumbbell', 'Biceps', 'Short');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (120, 'Incline Dumbbell Curl', 'Dumbbell', 'Biceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (121, 'EZ-Bar Curl', 'Barbell', 'Biceps', 'Short');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (122, 'Cable Curl', 'Cable', 'Biceps', 'Short');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (123, 'Preacher Curl (Machine)', 'Machine', 'Biceps', 'Short');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (124, 'Spider Curl', 'Barbell/Dumbbell', 'Biceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (125, 'Alternating Dumbbell Curl', 'Dumbbell', 'Biceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (126, 'Bayesian Curl', 'Cable', 'Biceps', 'Long');
INSERT INTO public.exercises (id, name, description, targetmuscle, specifictargetmuscle) VALUES (127, 'Back Extensions', 'Bench', 'Back', 'Lower');

SELECT pg_catalog.setval('public.exercises_id_seq', 127, true);

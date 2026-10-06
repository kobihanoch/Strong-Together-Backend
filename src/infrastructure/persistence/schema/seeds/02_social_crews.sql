DO $$
DECLARE
  u4_user_id uuid := '4d4489b6-7057-4a47-b506-06cdf4e23a44';
  john_doe_user_id uuid := 'ec554122-8ed7-4655-b646-7eadb76fa9e4';
  u0_user_id uuid := 'f1eec8b0-06cf-4cda-b3e9-1df82c8a0a7d';
  u1_user_id uuid := '9b31d67c-0a5a-4f56-a0fd-7db2a50d8a01';
  u2_user_id uuid := '83d44360-8d7d-4a26-8457-7f3e4f8414b1';
  u5_user_id uuid := '55a1d718-482b-4c17-8f45-246af142e505';
BEGIN
  INSERT INTO social.crew (id, name, created_by, privacy, profile_pic_path)
  VALUES
    (
      'a0000000-0000-4000-8000-000000000001',
      'Sunrise Striders',
      u4_user_id,
      'public',
      'profile-pics/a0000000-0000-4000-8000-000000000001/avatar.png'
    ),
    (
      'a0000000-0000-4000-8000-000000000002',
      'Iron Circle',
      u4_user_id,
      'private',
      'profile-pics/a0000000-0000-4000-8000-000000000002/avatar.png'
    ),
    (
      'a0000000-0000-4000-8000-000000000003',
      'Trail Blazers',
      u4_user_id,
      'public',
      'profile-pics/a0000000-0000-4000-8000-000000000003/avatar.png'
    ),
    (
      'a0000000-0000-4000-8000-000000000004',
      'Core Collective',
      u4_user_id,
      'private',
      'profile-pics/a0000000-0000-4000-8000-000000000004/avatar.png'
    ),
    (
      'a0000000-0000-4000-8000-000000000005',
      'Weekend Warriors',
      u4_user_id,
      'private',
      'profile-pics/a0000000-0000-4000-8000-000000000005/avatar.png'
    );

  INSERT INTO social.crew_membership (crew_id, user_id, role, status, joined_at)
  VALUES
    ('a0000000-0000-4000-8000-000000000001', u4_user_id, 'leader', 'active', now()),
    ('a0000000-0000-4000-8000-000000000002', u4_user_id, 'leader', 'active', now()),
    ('a0000000-0000-4000-8000-000000000003', u4_user_id, 'leader', 'active', now()),
    ('a0000000-0000-4000-8000-000000000004', u4_user_id, 'leader', 'active', now()),
    ('a0000000-0000-4000-8000-000000000005', u4_user_id, 'leader', 'active', now()),
    ('a0000000-0000-4000-8000-000000000001', john_doe_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000004', john_doe_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000001', u0_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000001', u1_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000002', u1_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000002', u2_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000002', u5_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000003', u0_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000003', u2_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000003', u5_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000004', u2_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000004', u5_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000005', u0_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000005', u1_user_id, 'member', 'active', now()),
    ('a0000000-0000-4000-8000-000000000005', u5_user_id, 'member', 'active', now());
END $$;

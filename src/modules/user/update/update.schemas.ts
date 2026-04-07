import { z } from 'zod';

export const updateUserRequest = z.object({
  body: z
    .object({
      username: z
        .string()
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(15, 'Username must be at most 15 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username may contain letters, numbers, and underscore only'),

      fullName: z
        .string()
        .trim()
        .min(1, 'Full name is required')
        .max(20, 'Full name is too long')
        .regex(/^[a-zA-Z\s]+$/, 'Full name may contain letters and spaces only'),

      email: z.string().trim().toLowerCase().email('Invalid email format'),
    })
    .partial(),
});

export const deleteProfilePicRequest = z.object({
  body: z.object({
    path: z.string(),
  }),
});

export const userDataSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  name: z.string(),
  gender: z.string(),
  created_at: z.string(),
  profile_image_url: z.string().nullable(),
  push_token: z.string().nullable(),
  role: z.string(),
  is_first_login: z.boolean(),
  token_version: z.number(),
  is_verified: z.boolean(),
  auth_provider: z.string(),
});

export const userDataResponseSchema = z.object({
  user_data: userDataSchema,
});

export const getAuthenticatedUserByIdResponseSchema = userDataSchema;

export const updateAuthenticatedUserResponseSchema = z.object({
  message: z.string(),
  emailChanged: z.boolean(),
  user: userDataSchema,
});

export const setProfilePicAndUpdateDBResponseSchema = z.object({
  path: z.string(),
  url: z.string(),
  message: z.string(),
});

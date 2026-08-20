import { z } from 'zod/v4';
import { userDbSchema } from '../../../database';
import { serializedDateSchema } from '../../../common';

const usernameSchema = userDbSchema.shape.username
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(15, 'Username must be at most 15 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username may contain letters, numbers, and underscore only');

const fullNameSchema = userDbSchema.shape.name
  .trim()
  .max(20, 'Full name is too long')
  .regex(/^[a-zA-Z\s]+$/, 'Full name may contain letters and spaces only');

export const createUserRequest = z.object({
  body: z.object({
    username: usernameSchema,

    fullName: z.preprocess(
      // Map "", null, undefined -> "User"
      (val) => {
        if (val == null) return 'User';
        if (typeof val === 'string' && val.trim() === '') return 'User';
        return val;
      },
      fullNameSchema,
    ),

    email: userDbSchema.shape.email.trim().toLowerCase().email('Invalid email format'),

    password: z.string().min(8, 'Password must be at least 8 characters long'),

    gender: z.preprocess(
      (val) => (val === '' || val == null ? 'Unknown' : val),
      z.enum(['Male', 'Female', 'Other', 'Unknown']),
    ),
  }),
});

export const createUserUserSchema = z.object({
  id: userDbSchema.shape.id,
  username: userDbSchema.shape.username,
  name: userDbSchema.shape.name,
  email: userDbSchema.shape.email,
  gender: userDbSchema.shape.gender,
  role: userDbSchema.shape.role,
  createdAt: serializedDateSchema,
});

export const createUserResponseSchema = z.object({
  message: z.string(),
  user: createUserUserSchema,
});

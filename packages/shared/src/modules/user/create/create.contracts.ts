import { z } from 'zod/v4';
import type { BodyOf, Contract, ResponseOf } from '../../../common';
import { userDbSchema } from '../../../database';
import { createdUserQueryDtoSchema } from './create.dtos';

// Create user

const usernameSchema = userDbSchema.shape.username
  .trim()
  .min(3, 'Username must be at least 3 characters')
  .max(15, 'Username must be at most 15 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username may contain letters, numbers, and underscore only');
const fullNameSchema = userDbSchema.shape.name
  .trim()
  .max(20, 'Full name is too long')
  .regex(/^[a-zA-Z\s]+$/, 'Full name may contain letters and spaces only');
export const createUserRequestSchema = z.object({
  body: z.object({
    username: usernameSchema,
    fullName: z.preprocess(
      (value) => (value == null || (typeof value === 'string' && value.trim() === '') ? 'User' : value),
      fullNameSchema,
    ),
    email: userDbSchema.shape.email.trim().toLowerCase().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    gender: z.preprocess(
      (value) => (value === '' || value == null ? 'Unknown' : value),
      z.enum(['Male', 'Female', 'Other', 'Unknown']),
    ),
  }),
});
export const createUserUserSchema = createdUserQueryDtoSchema;
export const createUserResponseSchema = z.object({ message: z.string(), user: createdUserQueryDtoSchema });

export const createUserContract = {
  request: createUserRequestSchema,
  response: createUserResponseSchema,
} satisfies Contract;

export type CreateUserBody = BodyOf<typeof createUserContract>;
export type CreateUserResponse = ResponseOf<typeof createUserContract>;

import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf } from '../../../common';
import { userDbSchema } from '../../../database';

// Verify user account

export const verifyEmailRequestSchema = z.object({ query: z.object({ token: z.string().optional() }) });

export const verifyEmailContract = { request: verifyEmailRequestSchema } satisfies Contract;

// Send verification email

export const createVerificationEmailRequestSchema = z.object({
  body: z.object({ email: userDbSchema.shape.email.trim().email('Invalid email') }),
});
export const createVerificationEmailContract = { request: createVerificationEmailRequestSchema } satisfies Contract;

// Change email and verify

export const updateUnverifiedAccountEmailRequestSchema = z.object({
  body: z.object({
    username: userDbSchema.shape.username,
    password: z.string(),
    newEmail: userDbSchema.shape.email.trim().email('Invalid email'),
  }),
});
export const updateUnverifiedAccountEmailContract = {
  request: updateUnverifiedAccountEmailRequestSchema,
} satisfies Contract;

// Check verification status

export const getVerificationStatusRequestSchema = z.object({
  query: z.object({ username: userDbSchema.shape.username }),
});
export const getVerificationStatusContract = { request: getVerificationStatusRequestSchema } satisfies Contract;

export type VerifyEmailQuery = QueryOf<typeof verifyEmailContract>;
export type CreateVerificationEmailBody = BodyOf<typeof createVerificationEmailContract>;
export type UpdateUnverifiedAccountEmailBody = BodyOf<typeof updateUnverifiedAccountEmailContract>;
export type GetVerificationStatusQuery = QueryOf<typeof getVerificationStatusContract>;

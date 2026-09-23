import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf } from '../../../common';

const usernameSchema = z.string();
const emailSchema = z.string().trim().email('Invalid email');

// Verify user account

export const verifyEmailRequestSchema = z.object({ query: z.object({ token: z.string().optional() }) });

export const verifyEmailContract = { request: verifyEmailRequestSchema } satisfies Contract;

// Send verification email

export const createVerificationEmailRequestSchema = z.object({
  body: z.object({ email: emailSchema }),
});
export const createVerificationEmailContract = { request: createVerificationEmailRequestSchema } satisfies Contract;

// Change email and verify

export const updateUnverifiedAccountEmailRequestSchema = z.object({
  body: z.object({
    username: usernameSchema,
    password: z.string(),
    newEmail: emailSchema,
  }),
});
export const updateUnverifiedAccountEmailContract = {
  request: updateUnverifiedAccountEmailRequestSchema,
} satisfies Contract;

// Check verification status

export const getVerificationStatusRequestSchema = z.object({
  query: z.object({ username: usernameSchema }),
});
export const getVerificationStatusContract = { request: getVerificationStatusRequestSchema } satisfies Contract;

/** Represents the verify email query value. */
export type VerifyEmailQuery = QueryOf<typeof verifyEmailContract>;
/** Represents the create verification email body value. */
export type CreateVerificationEmailBody = BodyOf<typeof createVerificationEmailContract>;
/** Represents the update unverified account email body value. */
export type UpdateUnverifiedAccountEmailBody = BodyOf<typeof updateUnverifiedAccountEmailContract>;
/** Represents the get verification status query value. */
export type GetVerificationStatusQuery = QueryOf<typeof getVerificationStatusContract>;

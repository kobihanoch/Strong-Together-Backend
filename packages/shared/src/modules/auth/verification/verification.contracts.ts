import { z } from 'zod/v4';
import type { BodyOf, Contract, QueryOf } from '../../../common';
import { userDbSchema } from '../../../database';

// Verify user account

export const verifyAccountRequestSchema = z.object({ query: z.object({ token: z.string().optional() }) });

export const verifyUserAccountContract = { request: verifyAccountRequestSchema } satisfies Contract;

// Send verification email

export const sendVerificationMailRequestSchema = z.object({
  body: z.object({ email: userDbSchema.shape.email.trim().email('Invalid email') }),
});
export const sendVerificationMailContract = { request: sendVerificationMailRequestSchema } satisfies Contract;

// Change email and verify

export const changeEmailAndVerifyRequestSchema = z.object({
  body: z.object({
    username: userDbSchema.shape.username,
    password: z.string(),
    newEmail: userDbSchema.shape.email.trim().email('Invalid email'),
  }),
});
export const changeEmailAndVerifyContract = { request: changeEmailAndVerifyRequestSchema } satisfies Contract;

// Check verification status

export const checkUserVerifyRequestSchema = z.object({
  query: z.object({ username: userDbSchema.shape.username }),
});
export const checkUserVerifyContract = { request: checkUserVerifyRequestSchema } satisfies Contract;

export type VerifyUserAccountQuery = QueryOf<typeof verifyUserAccountContract>;
export type SendVerificationMailBody = BodyOf<typeof sendVerificationMailContract>;
export type ChangeEmailAndVerifyBody = BodyOf<typeof changeEmailAndVerifyContract>;
export type CheckUserVerifyQuery = QueryOf<typeof checkUserVerifyContract>;

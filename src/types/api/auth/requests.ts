import z from 'zod';
import { loginRequest } from '../../../features/auth/loginRequest.schema.ts';
import { verifyAccountRequest } from '../../../features/auth/verifyUserAccountRequest.schema.ts';
import { sendVerificationMailRequest } from '../../../features/auth/sendVerificationMailRequest.schema.ts';
import { changeEmailAndVerifyRequest } from '../../../features/auth/changeEmailAndVerifyRequest.schema.ts';
import { checkUserVerifyRequest } from '../../../features/auth/checkUserVerifyRequest.schema.ts';
import { sendChangePassEmailRequest } from '../../../features/auth/sendChangePassEmailRequest.schema.ts';
import { resetPasswordRequest } from '../../../features/auth/resetPasswordRequest.schema.ts';

export type LoginRequestBody = z.infer<typeof loginRequest.shape.body>;
export type VerifyUserAccountQuery = z.infer<typeof verifyAccountRequest.shape.query>;
export type SendVerifcationMailBody = z.infer<typeof sendVerificationMailRequest.shape.body>;
export type ChangeEmailAndVerifyBody = z.infer<typeof changeEmailAndVerifyRequest.shape.body>;
export type CheckUserVerifyQuery = z.infer<typeof checkUserVerifyRequest.shape.query>;
export type SendChangePassEmailBody = z.infer<typeof sendChangePassEmailRequest.shape.body>;
export type ResetPasswordBody = z.infer<typeof resetPasswordRequest.shape.body>;
export type ResetPasswordQuery = z.infer<typeof resetPasswordRequest.shape.query>;

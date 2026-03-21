import z from 'zod';
import { loginRequest } from '../../../validators/auth/loginRequest.schema.ts';
import { verifyAccountRequest } from '../../../validators/auth/verifyUserAccountRequest.schema.ts';
import { sendVerificationMailRequest } from '../../../validators/auth/sendVerificationMailRequest.schema.ts';
import { changeEmailAndVerifyRequest } from '../../../validators/auth/changeEmailAndVerifyRequest.schema.ts';
import { checkUserVerifyRequest } from '../../../validators/auth/checkUserVerifyRequest.schema.ts';
import { sendChangePassEmailRequest } from '../../../validators/auth/sendChangePassEmailRequest.schema.ts';
import { resetPasswordRequest } from '../../../validators/auth/resetPasswordRequest.schema.ts';

export type LoginRequestBody = z.infer<typeof loginRequest.shape.body>;
export type VerifyUserAccountQuery = z.infer<typeof verifyAccountRequest.shape.query>;
export type SendVerifcationMailBody = z.infer<typeof sendVerificationMailRequest.shape.body>;
export type ChangeEmailAndVerifyBody = z.infer<typeof changeEmailAndVerifyRequest.shape.body>;
export type CheckUserVerifyQuery = z.infer<typeof checkUserVerifyRequest.shape.query>;
export type SendChangePassEmailBody = z.infer<typeof sendChangePassEmailRequest.shape.body>;
export type ResetPasswordBody = z.infer<typeof resetPasswordRequest.shape.body>;
export type ResetPasswordQuery = z.infer<typeof resetPasswordRequest.shape.query>;

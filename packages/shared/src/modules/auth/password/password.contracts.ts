import z from 'zod/v4';
import { resetPasswordRequest, resetPasswordResponseSchema, sendChangePassEmailRequest } from './password.schemas';

export type SendChangePassEmailBody = z.infer<typeof sendChangePassEmailRequest.shape.body>;
export type ResetPasswordBody = z.infer<typeof resetPasswordRequest.shape.body>;
export type ResetPasswordQuery = z.infer<typeof resetPasswordRequest.shape.query>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>;

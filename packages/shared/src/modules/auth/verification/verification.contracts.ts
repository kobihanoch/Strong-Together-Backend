import z from 'zod/v4';
import {
  changeEmailAndVerifyRequest,
  checkUserVerifyRequest,
  sendVerificationMailRequest,
  verifyAccountRequest,
} from './verification.schemas';

export type VerifyUserAccountQuery = z.infer<typeof verifyAccountRequest.shape.query>;
export type SendVerifcationMailBody = z.infer<typeof sendVerificationMailRequest.shape.body>;
export type ChangeEmailAndVerifyBody = z.infer<typeof changeEmailAndVerifyRequest.shape.body>;
export type CheckUserVerifyQuery = z.infer<typeof checkUserVerifyRequest.shape.query>;

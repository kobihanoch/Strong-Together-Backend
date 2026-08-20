import z from 'zod/v4';
import { createUserRequest, createUserResponseSchema } from './create.schemas';

export type CreateUserBody = z.infer<typeof createUserRequest.shape.body>;
export type CreateUserResponse = z.infer<typeof createUserResponseSchema>;

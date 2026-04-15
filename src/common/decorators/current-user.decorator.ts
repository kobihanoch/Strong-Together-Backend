import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../../shared/types/express.js';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
  const req = ctx.switchToHttp().getRequest<Request>();
  return req.user!;
});

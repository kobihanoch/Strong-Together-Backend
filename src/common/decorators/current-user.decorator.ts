import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AppRequest, AuthenticatedUser } from '../types/express';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
  const req = ctx.switchToHttp().getRequest<AppRequest>();
  return req.user!;
});

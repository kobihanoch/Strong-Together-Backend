import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AppRequest } from '../types/express.ts';

export const CurrentRequestId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest<AppRequest>();
    return req.requestId;
  },
);

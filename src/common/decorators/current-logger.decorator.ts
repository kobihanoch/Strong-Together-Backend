import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { createLogger } from '../../infrastructure/logger.ts';
import type { AppRequest } from '../types/express.ts';

const fallbackLogger = createLogger('request');

export const CurrentLogger = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<AppRequest>();
  return req.logger || fallbackLogger;
});

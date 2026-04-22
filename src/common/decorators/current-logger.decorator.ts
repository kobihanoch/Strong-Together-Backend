import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { createLogger } from '../../infrastructure/logger';
import type { AppRequest } from '../types/express';

const fallbackLogger = createLogger('request');

export const CurrentLogger = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<AppRequest>();
  return req.logger || fallbackLogger;
});

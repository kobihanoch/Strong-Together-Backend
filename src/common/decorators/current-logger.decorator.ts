import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { createLogger } from '../../infrastructure/logger.ts';

const fallbackLogger = createLogger('request');

export const CurrentLogger = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request>();
  return req.logger || fallbackLogger;
});

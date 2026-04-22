import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { appConfig } from '../../config/app.config';
import { generalRateLimit } from '../guards/rate-limit.guard';

type Bucket = {
  count: number;
  resetAt: number;
};

@Injectable()
export class GeneralRateLimitMiddleware implements NestMiddleware {
  private readonly store = new Map<string, Bucket>();

  use(req: Request, _res: Response, next: NextFunction): void {
    if (appConfig.isTest) {
      next();
      return;
    }

    const key = this.getRateLimitKey(req);
    const now = Date.now();
    const routeKey = `${req.method}:${req.path}:${key}`;
    const current = this.store.get(routeKey);

    if (!current || current.resetAt <= now) {
      this.store.set(routeKey, {
        count: 1,
        resetAt: now + generalRateLimit.windowMs,
      });
      next();
      return;
    }

    if (current.count >= generalRateLimit.max) {
      throw new HttpException(generalRateLimit.message, HttpStatus.TOO_MANY_REQUESTS);
    }

    current.count += 1;
    this.store.set(routeKey, current);
    next();
  }

  private getRateLimitKey(req: Request): string {
    const clientId = req.headers['x-client-id'];
    if (typeof clientId === 'string' && clientId) {
      return `client:${clientId}`;
    }

    return `ip:${req.ip}`;
  }
}

import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { appConfig } from '../../config/app.config.ts';

type RateLimitOptions = {
  windowMs: number;
  max: number;
  message: string;
  bodyKey?: string;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_KEY = 'rate_limit';

export const RateLimit = (options: RateLimitOptions) => SetMetadata(RATE_LIMIT_KEY, options);

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly store = new Map<string, Bucket>();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Disable rate limiting in tests to avoid flaky integration tests
    if (appConfig.isTest) {
      return true;
    }

    const options = this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route has no rate-limit metadata, allow it
    if (!options) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const key = this.getRateLimitKey(req, options.bodyKey);
    const now = Date.now();

    // Scope by route + resolved identity key so each route has isolated buckets
    const routeKey = `${context.getClass().name}:${context.getHandler().name}:${key}`;
    const current = this.store.get(routeKey);

    // Create a fresh bucket when missing or expired
    if (!current || current.resetAt <= now) {
      this.store.set(routeKey, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      return true;
    }

    // Reject when the bucket is already full
    if (current.count >= options.max) {
      throw new HttpException(options.message, HttpStatus.TOO_MANY_REQUESTS);
    }

    // Otherwise increment and allow
    current.count += 1;
    this.store.set(routeKey, current);

    return true;
  }

  private getRateLimitKey(req: Request, bodyKey?: string): string {
    // 1. If user is authenticated, prefer user id
    if (req.user?.id) {
      return `user:${req.user.id}`;
    }

    // 2. If a specific body field was requested (identifier / username / email)
    if (bodyKey) {
      const val = req.body?.[bodyKey];
      if (val && typeof val === 'string') {
        return `body:${bodyKey}:${val}`;
      }
    }

    // 3. If client sent a stable device id header (Not implemented for now)
    const clientId = req.headers['x-client-id'];
    if (typeof clientId === 'string' && clientId) {
      return `client:${clientId}`;
    }

    // 4. Fallback to IP (might be NAT / CGNAT)
    return `ip:${req.ip}`;
  }
}

// 50 per minute (IP behind reverse proxy)
// Limits: Can block multiple users on same NAT or CGNAT
export const generalRateLimit: RateLimitOptions = {
  windowMs: 60 * 1000, // 1 minute
  max: 50,
  message: 'Too many requests.',
};

// 1 per 45 secs per username (burst)
export const changeVerificationEmailRateLimit: RateLimitOptions = {
  windowMs: 45 * 1000,
  max: 1,
  bodyKey: 'username',
  message: "You've reached the maximum amount of requests per minute.",
};

// 3 per 24h per username
export const changeVerificationEmailRateLimitDaily: RateLimitOptions = {
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  bodyKey: 'username',
  message: "You've reached the maximum amount of requests per day.",
};

// 3 per 24h per identifier
export const resetPasswordEmailRateLimitDaily: RateLimitOptions = {
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  bodyKey: 'identifier',
  message: "You've reached the maximum amount of requests per day.",
};

// 2 per 45 secs per identifier (burst)
export const resetPasswordEmailRateLimit: RateLimitOptions = {
  windowMs: 45 * 1000,
  max: 2,
  bodyKey: 'identifier',
  message: "You've reached the maximum amount of requests per minute.",
};

// 3 per 24h per email
export const updateUserRateLimitDaily: RateLimitOptions = {
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  bodyKey: 'email',
  message: "You've reached the maximum amount of requests per day.",
};

// 2 per 45 secs per email (burst)
export const updateUserRateLimit: RateLimitOptions = {
  windowMs: 45 * 1000,
  max: 2,
  bodyKey: 'email',
  message: "You've reached the maximum amount of requests per minute.",
};

// 5 per 15 mins per identifier
export const loginRateLimit: RateLimitOptions = {
  windowMs: 15 * 60 * 1000,
  max: 5,
  bodyKey: 'identifier',
  message: "You've reached the maximum amount of login attempts per 15 minutes.",
};

// 30 per 15 minutes per IP
export const loginIpRateLimit: RateLimitOptions = {
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many requests.',
};

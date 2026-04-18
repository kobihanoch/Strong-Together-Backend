import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { appConfig } from '../../config/app.config';

// Public endpoints that should bypass the version gate (extend as needed)
const EXEMPT_PREFIXES = [
  '/health',
  '/api/auth/verify',
  '/api/auth/resetpassword',
  '/api/auth/forgotpassemail',
  '/api/push/daily',
  '/api/push/hourlyreminder',
  '/api/users/changeemail',
];

// Parse "v4.2.1", "4.2", or "4" into [major, minor, patch] (numbers)
function toParts(v: string): [number, number, number] {
  const parts = String(v || '')
    .replace(/^v/i, '')
    .split(/[^\d]+/)
    .filter(Boolean)
    .map((n) => parseInt(n, 10));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

// Compare a vs b as semantic versions: returns -1, 0, or 1
function compareVersions(a: string, b: string): number {
  const A = toParts(a);
  const B = toParts(b);
  if (A[0] !== B[0]) return A[0] < B[0] ? -1 : 1;
  if (A[1] !== B[1]) return A[1] < B[1] ? -1 : 1;
  if (A[2] !== B[2]) return A[2] < B[2] ? -1 : 1;
  return 0;
}

@Injectable()
export class CheckAppVersionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Skip exempt paths (prefix-based)
    if (EXEMPT_PREFIXES.some((p) => req.path.startsWith(p))) return next();

    // Read current version and minimum allowed
    const current = req.headers['x-app-version'] as string; // case-insensitive
    const min = appConfig.minAppVersion;

    // If header missing
    if (!current) {
      //res.setHeader('x-min-version', min);
      throw new HttpException(`Please update the app on AppStore`, 426);
    }

    // Compare semver-like (major -> minor -> patch)
    if (compareVersions(current, min) < 0) {
      //res.setHeader('x-min-Version', min);
      throw new HttpException(`Please update the app on AppStore`, 426);
    }
    next();
  }
}

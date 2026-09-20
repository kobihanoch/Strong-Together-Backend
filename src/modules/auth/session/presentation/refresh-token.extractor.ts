import type { Request } from 'express';
import { extractBearerToken, extractDpopToken } from '../../../../common/authentication/authentication.utils';

/** Extracts a refresh token from the `x-refresh-token` header. */
export function getRefreshToken(request: Request): string | null {
  const header = request.headers['x-refresh-token'] as string | undefined;
  return extractDpopToken(header) || extractBearerToken(header);
}

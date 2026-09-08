import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';
import type postgres from 'postgres';
import { appConfig } from '../../config/app.config';

export const DEFAULT_OAUTH_NAME = 'New User';

/**
 * Builds a safe display name from optional OAuth identity name components.
 *
 * Empty, null, undefined, and whitespace-only components are ignored. When a
 * provider supplies no usable name, the non-null database-safe default is
 * returned.
 *
 * @param parts - Provider-supplied full-name or individual name components.
 * @returns A normalized display name or the default OAuth name.
 */
export function buildOAuthDisplayName(...parts: (string | null | undefined)[]): string {
  const displayName = parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(' ');

  return displayName || DEFAULT_OAUTH_NAME;
}

export async function ensureUniqueUsername(trx: postgres.TransactionSql, candidate: string | null): Promise<string> {
  // If no candidate (no email or full name) => random fallback
  if (!candidate) return `user_${Math.random().toString(36).slice(2, 8)}`;

  // Start with the base name (e.g., "kobi")
  let username = candidate.toLowerCase();
  let i = 0;

  // Keep checking until we find a username that does not exist
  while (true) {
    const exists = await trx`SELECT 1 FROM identity.user WHERE username = ${username} LIMIT 1`;

    if (exists.length === 0) {
      // Found a free username
      return username;
    }

    // Append a number (e.g., kobi1, kobi2, ...)
    i += 1;
    username = `${candidate}${i}`;
  }
}

export const validateJkt = (req: Request): string => {
  const jkt = req.headers['dpop-key-binding'] as string | undefined;
  if (appConfig.dpopEnabled) {
    if (!jkt) {
      throw new BadRequestException('DPoP-Key-Binding header is missing.');
    }
  }

  return jkt as string;
};

export const buildCnfClaim = (jkt: string) => {
  return {
    cnf: {
      jkt: jkt.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''),
    },
  };
};

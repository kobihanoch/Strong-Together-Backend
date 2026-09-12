import { BadRequestException } from '@nestjs/common';
import { z } from 'zod/v4';

const cursorSchema = z.object({ timestamp: z.iso.datetime(), id: z.uuid(), rank: z.number().int().optional() });

export type SocialCursor = z.infer<typeof cursorSchema>;

/** Encodes stable sort values as an opaque URL-safe cursor. */
export function encodeSocialCursor(cursor: SocialCursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString('base64url');
}

/** Decodes and validates an opaque social pagination cursor. */
export function decodeSocialCursor(cursor?: string): SocialCursor | undefined {
  if (!cursor) return undefined;

  try {
    return cursorSchema.parse(JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')));
  } catch {
    throw new BadRequestException('Invalid pagination cursor');
  }
}

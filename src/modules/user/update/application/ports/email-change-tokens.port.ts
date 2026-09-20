import type { EmailChangeClaims } from '../models/update-user.models';
/** Validates and consumes one-time email-change tokens. */
export abstract class EmailChangeTokens {
  abstract verify(token: string): EmailChangeClaims | null;
  abstract consume(jti: string, expiresAt: number): Promise<boolean>;
}

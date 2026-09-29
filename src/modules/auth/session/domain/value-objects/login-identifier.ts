/** Email address or username accepted for local authentication. */
export class LoginIdentifier {
  public readonly value: string;
  public constructor(value: string) {
    const normalized = value.trim();
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
    const username = /^[a-zA-Z0-9_]{3,20}$/.test(normalized);
    if (normalized.length < 3 || normalized.length > 254 || (!email && !username)) throw new InvalidLoginIdentifierError();
    this.value = normalized;
  }
}
import { InvalidLoginIdentifierError } from '../errors/session.errors';

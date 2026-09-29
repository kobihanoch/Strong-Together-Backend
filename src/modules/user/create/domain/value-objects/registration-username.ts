/** Username accepted for local account registration. */
export class RegistrationUsername {
  public readonly value: string;
  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length < 3) throw new RegistrationUsernameTooShortError();
    if (normalized.length > 15) throw new RegistrationUsernameTooLongError();
    if (!/^[a-zA-Z0-9_]+$/.test(normalized)) throw new InvalidRegistrationUsernameError();
    this.value = normalized;
  }
}
import { InvalidRegistrationUsernameError, RegistrationUsernameTooLongError, RegistrationUsernameTooShortError } from '../errors/user-registration.errors';

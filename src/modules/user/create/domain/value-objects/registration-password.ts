/** Plaintext password validated before one-way hashing. */
export class RegistrationPassword {
  public readonly value: string;
  public constructor(value: string) {
    if (value.length < 8) throw new RegistrationPasswordTooShortError();
    if (value.length > 128) throw new RegistrationPasswordTooLongError();
    this.value = value;
  }
}
import { RegistrationPasswordTooLongError, RegistrationPasswordTooShortError } from '../errors/user-registration.errors';

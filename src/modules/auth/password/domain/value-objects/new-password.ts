/** Plaintext replacement password validated before hashing. */
export class NewPassword {
  public readonly value: string;
  public constructor(value: string) {
    if (value.length < 8) throw new NewPasswordTooShortError();
    if (value.length > 128) throw new NewPasswordTooLongError();
    this.value = value;
  }
}
import { NewPasswordTooLongError, NewPasswordTooShortError } from '../errors/password.errors';

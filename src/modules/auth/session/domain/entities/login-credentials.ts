import { LoginIdentifier } from '../value-objects/login-identifier';
import { InvalidLoginPasswordError } from '../errors/session.errors';

/** Validated local credentials submitted for authentication. */
export class LoginCredentials {
  public readonly identifier: LoginIdentifier;
  public readonly password: string;
  private constructor(identifier: string, password: string) {
    if (password.length === 0 || password.length > 128) throw new InvalidLoginPasswordError();
    this.identifier = new LoginIdentifier(identifier);
    this.password = password;
  }

  static create(identifier: string, password: string): LoginCredentials {
    return new LoginCredentials(identifier, password);
  }
}

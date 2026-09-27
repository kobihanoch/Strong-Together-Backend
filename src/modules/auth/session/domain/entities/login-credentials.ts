import { LoginIdentifier } from '../value-objects/login-identifier';

/** Validated local credentials submitted for authentication. */
export class LoginCredentials {
  public readonly identifier: LoginIdentifier;
  public readonly password: string;
  public constructor(identifier: string, password: string) {
    if (password.length === 0 || password.length > 128) throw new Error('Username and password are required');
    this.identifier = new LoginIdentifier(identifier);
    this.password = password;
  }
}

import { RegistrationEmail } from '../value-objects/registration-email';
import { RegistrationPassword } from '../value-objects/registration-password';
import { RegistrationUsername } from '../value-objects/registration-username';
import {
  InvalidRegistrationFullNameError,
  InvalidRegistrationGenderError,
  RegistrationFullNameTooLongError,
} from '../errors/user-registration.errors';

/** Primitive values submitted for local account registration. */
export interface UserRegistrationValues {
  username: string;
  fullName: string;
  email: string;
  password: string;
  gender: string;
}

/** Validated local user registration. */
export class UserRegistration {
  public readonly id: string | undefined;
  public readonly username: RegistrationUsername;
  public readonly fullName: string;
  public readonly email: RegistrationEmail;
  public readonly password: RegistrationPassword;
  public readonly gender: 'Male' | 'Female' | 'Other' | 'Unknown';

  private constructor(id: string | undefined, values: UserRegistrationValues) {
    this.id = id;
    const fullName = values.fullName.trim();
    if (fullName.length > 20) throw new RegistrationFullNameTooLongError();
    if (!/^[a-zA-Z\s]+$/.test(fullName)) throw new InvalidRegistrationFullNameError();
    if (!['Male', 'Female', 'Other', 'Unknown'].includes(values.gender)) throw new InvalidRegistrationGenderError();
    this.username = new RegistrationUsername(values.username);
    this.fullName = fullName;
    this.email = new RegistrationEmail(values.email);
    this.password = new RegistrationPassword(values.password);
    this.gender = values.gender as UserRegistration['gender'];
  }

  public static create(values: UserRegistrationValues): UserRegistration {
    return new UserRegistration(undefined, values);
  }

  public static restore(id: string, values: UserRegistrationValues): UserRegistration {
    return new UserRegistration(id, values);
  }
}

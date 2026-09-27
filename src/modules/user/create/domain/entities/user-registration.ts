import { RegistrationEmail } from '../value-objects/registration-email';
import { RegistrationPassword } from '../value-objects/registration-password';
import { RegistrationUsername } from '../value-objects/registration-username';

/** Primitive values submitted for local account registration. */
export interface UserRegistrationValues { username: string; fullName: string; email: string; password: string; gender: string }

/** Validated local user registration. */
export class UserRegistration {
  public readonly username: RegistrationUsername;
  public readonly fullName: string;
  public readonly email: RegistrationEmail;
  public readonly password: RegistrationPassword;
  public readonly gender: 'Male' | 'Female' | 'Other' | 'Unknown';

  public constructor(values: UserRegistrationValues) {
    const fullName = values.fullName.trim();
    if (fullName.length > 20) throw new Error('Full name is too long');
    if (!/^[a-zA-Z\s]+$/.test(fullName)) throw new Error('Full name may contain letters and spaces only');
    if (!['Male', 'Female', 'Other', 'Unknown'].includes(values.gender)) throw new Error('Gender is not supported');
    this.username = new RegistrationUsername(values.username);
    this.fullName = fullName;
    this.email = new RegistrationEmail(values.email);
    this.password = new RegistrationPassword(values.password);
    this.gender = values.gender as UserRegistration['gender'];
  }
}

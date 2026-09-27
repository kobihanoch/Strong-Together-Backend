import type { CreatedUser } from '../models/create-user.models';
import type { UserRegistration } from '../../domain/entities/user-registration';
/** Provides persistence operations required during registration. */
export abstract class CreateUserRepository {
  abstract exists(registration: UserRegistration): Promise<boolean>;
  abstract create(registration: UserRegistration, passwordHash: string): Promise<CreatedUser>;
}

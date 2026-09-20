import type { CreatedUser } from '../models/create-user.models';
/** Provides persistence operations required during registration. */
export abstract class CreateUserRepository {
  abstract exists(username: string, email: string): Promise<boolean>;
  abstract create(username: string, fullName: string, email: string, gender: string, passwordHash: string): Promise<CreatedUser>;
}

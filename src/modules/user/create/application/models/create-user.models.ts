/** Values required to register a local user. */
export interface CreateUserInput {
  username: string;
  fullName: string;
  email: string;
  password: string;
  gender: string;
}

/** Persisted user data needed after registration. */
export interface CreatedUser {
  id: string;
  username: string;
  name: string;
  email: string;
  gender: string;
  role: string;
  createdAt: string;
}

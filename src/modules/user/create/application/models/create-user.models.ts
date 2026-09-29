/** Values required to register a local user. */
export interface CreateUserInput {
  username: string;
  fullName: string;
  email: string;
  password: string;
  gender: string;
}

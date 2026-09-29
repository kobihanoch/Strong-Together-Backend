/** Event name emitted after a local user registration commits. */
export const USER_REGISTERED_EVENT = 'user.registered';

/** Data required by consumers reacting to a newly registered user. */
export class UserRegisteredEvent {
  constructor(
    readonly userId: string,
    readonly email: string,
    readonly fullName: string,
    readonly requestId?: string | undefined,
  ) {}
}

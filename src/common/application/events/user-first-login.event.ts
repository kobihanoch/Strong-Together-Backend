/** Event name emitted after a user authenticates for the first time. */
export const USER_FIRST_LOGIN_EVENT = 'user.first-login';

/** Data required to create a user's first-login welcome message. */
export class UserFirstLoginEvent {
  constructor(
    readonly userId: string,
    readonly userName: string,
  ) {}
}

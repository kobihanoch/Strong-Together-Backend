/** Shared single-use token storage for verification and password-reset flows. */
export abstract class OneTimeTokenStore {
  abstract claim(namespace: string, tokenId: string, ttlSeconds: number): Promise<boolean>;
}

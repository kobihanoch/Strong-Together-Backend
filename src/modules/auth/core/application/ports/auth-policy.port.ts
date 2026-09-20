/** Shared runtime authentication policy. */
export abstract class AuthPolicy {
  abstract readonly dpopEnabled: boolean;
}

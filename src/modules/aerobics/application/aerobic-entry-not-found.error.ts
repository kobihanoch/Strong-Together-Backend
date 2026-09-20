/** Raised when an owned aerobic entry cannot be found for mutation. */
export class AerobicEntryNotFoundError extends Error {
  constructor() {
    super('Aerobic entry not found');
    this.name = 'AerobicEntryNotFoundError';
  }
}

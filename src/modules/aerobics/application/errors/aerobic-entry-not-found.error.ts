/** Application error raised when an owned aerobic entry cannot be found for mutation. */
export class AerobicEntryNotFoundError extends Error {
  readonly statusCode = 404;

  constructor() {
    super('Aerobic entry not found');
    this.name = 'AerobicEntryNotFoundError';
  }
}

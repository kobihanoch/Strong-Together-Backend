/** Raised when a submitted split does not belong to the active plan. */
export class InvalidWorkoutSplitError extends Error {
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = 'InvalidWorkoutSplitError';
  }
}

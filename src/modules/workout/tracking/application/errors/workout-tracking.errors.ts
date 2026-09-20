/** Raised when a completed workout contains no exercise entries. */
export class InvalidCompletedWorkoutError extends Error {
  readonly statusCode = 400;
  constructor() {
    super('Not a valid workout');
    this.name = 'InvalidCompletedWorkoutError';
  }
}

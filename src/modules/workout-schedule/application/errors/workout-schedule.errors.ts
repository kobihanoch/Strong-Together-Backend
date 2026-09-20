/** Raised when a submitted split is not active in the user's active workout plan. */
export class InvalidWorkoutScheduleSplitError extends Error {
  public readonly statusCode = 400;

  public constructor() {
    super('Every scheduled workout split must be active and belong to the active plan');
    this.name = InvalidWorkoutScheduleSplitError.name;
  }
}

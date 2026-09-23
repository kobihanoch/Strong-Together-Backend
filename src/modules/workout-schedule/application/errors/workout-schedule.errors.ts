import { ApplicationValidationError } from '../../../../common/application/errors/application.errors';

/** Raised when a submitted split is not active in the user's active workout plan. */
export class InvalidWorkoutScheduleSplitError extends ApplicationValidationError {
  public constructor() {
    super('Every scheduled workout split must be active and belong to the active plan');
  }
}

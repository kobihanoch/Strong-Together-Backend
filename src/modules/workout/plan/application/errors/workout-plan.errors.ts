import { ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

/** Raised when a submitted split does not belong to the active plan. */
export class InvalidWorkoutSplitError extends ApplicationValidationError {
  constructor(splitId: number) {
    super(`Workout split ${splitId} does not belong to the active workout plan`);
  }
}

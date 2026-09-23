import { ApplicationValidationError } from '../../../../../common/application/errors/application.errors';

/** Raised when a completed workout contains no exercise entries. */
export class InvalidCompletedWorkoutError extends ApplicationValidationError {
  constructor() {
    super('Not a valid workout');
  }
}

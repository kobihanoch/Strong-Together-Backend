import { DomainValidationError } from '../../../../common/domain/errors/domain.errors';

export class TooManyScheduledWorkoutsError extends DomainValidationError {
  public constructor() {
    super('A weekly schedule cannot contain more than 140 entries');
  }
}

export class DuplicateScheduledWorkoutError extends DomainValidationError {
  public constructor() {
    super('A workout split can only be scheduled once per weekday');
  }
}

export class InvalidWorkoutScheduleStartTimeError extends DomainValidationError {
  public constructor() {
    super('Start time must use 24-hour HH:mm format');
  }
}

export class InvalidWorkoutScheduleWeekdayError extends DomainValidationError {
  public constructor() {
    super('Day of week must be an integer between 0 and 6');
  }
}

export class InvalidWorkoutScheduleSplitIdError extends DomainValidationError {
  public constructor() {
    super('Workout split ID must be a positive integer');
  }
}

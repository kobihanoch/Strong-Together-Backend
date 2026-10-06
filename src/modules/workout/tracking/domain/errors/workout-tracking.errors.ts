import { DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class WorkoutSessionRequiresExerciseError extends DomainValidationError {
  constructor() { super('Workout must include at least one exercise'); }
}

export class TooManyTrackedExercisesError extends DomainValidationError {
  constructor() { super('Workout cannot include more than 200 exercises'); }
}

export class TrackedExerciseRequiresSetError extends DomainValidationError {
  constructor() { super('Each exercise must include at least one tracked set'); }
}

export class TooManyTrackedSetsError extends DomainValidationError {
  constructor() { super('An exercise cannot include more than 100 tracked sets'); }
}

export class DuplicateTrackedSetIndexError extends DomainValidationError {
  constructor() { super('Set indexes must be unique'); }
}

export class TrackingNotesTooLongError extends DomainValidationError {
  constructor() { super('Notes must be at most 2000 characters'); }
}

export class InvalidExerciseAssignmentIdError extends DomainValidationError {
  constructor() { super('Exercise-to-split ID must be a positive integer'); }
}

export class InvalidTrackedExerciseIdError extends DomainValidationError {
  constructor() { super('Exercise ID must be a positive integer'); }
}

export class InvalidTrackedRepetitionsError extends DomainValidationError {
  constructor() { super('Reps must be an integer between 1 and 10000'); }
}

export class InvalidTrackedWeightError extends DomainValidationError {
  constructor() { super('Weight must be between 0 and 100000'); }
}

export class InvalidTrackedSetIndexError extends DomainValidationError {
  constructor() { super('Set index must be a non-negative integer'); }
}

export class InvalidWorkoutStartError extends DomainValidationError {
  constructor() { super('Workout start must be a valid ISO datetime'); }
}

export class InvalidWorkoutEndError extends DomainValidationError {
  constructor() { super('Workout end must be a valid ISO datetime'); }
}

export class WorkoutEndBeforeStartError extends DomainValidationError {
  constructor() { super('Workout end must not be earlier than workout start'); }
}

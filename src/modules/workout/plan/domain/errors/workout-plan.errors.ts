import { DomainValidationError } from '../../../../../common/domain/errors/domain.errors';

export class WorkoutPlanRequiresSplitError extends DomainValidationError {
  constructor() { super('Workout must include at least one split'); }
}

export class TooManyWorkoutSplitsError extends DomainValidationError {
  constructor() { super('A workout cannot include more than 20 splits'); }
}

export class DuplicateWorkoutSplitIdError extends DomainValidationError {
  constructor() { super('Workout split IDs must be unique'); }
}

export class DuplicateWorkoutSplitOrderError extends DomainValidationError {
  constructor() { super('Workout split order indexes must be unique'); }
}

export class WorkoutSplitNotInPlanError extends DomainValidationError {
  constructor(public readonly splitId: number) { super('Workout split does not belong to the active workout plan'); }
}

export class InvalidWorkoutSplitIdError extends DomainValidationError {
  constructor() { super('Workout split ID must be a positive integer'); }
}

export class WorkoutSplitRequiresExerciseError extends DomainValidationError {
  constructor() { super('Each split must include at least one exercise'); }
}

export class TooManyWorkoutExercisesError extends DomainValidationError {
  constructor() { super('A split cannot include more than 100 exercises'); }
}

export class DuplicateWorkoutExerciseError extends DomainValidationError {
  constructor() { super('Exercise IDs must be unique within a split'); }
}

export class DuplicateWorkoutExerciseOrderError extends DomainValidationError {
  constructor() { super('Exercise order indexes must be unique within a split'); }
}

export class InvalidWorkoutExerciseIdError extends DomainValidationError {
  constructor() { super('Exercise ID must be a positive integer'); }
}

export class WorkoutExerciseRequiresSetError extends DomainValidationError {
  constructor() { super('Each exercise must include at least one set'); }
}

export class TooManyWorkoutSetsError extends DomainValidationError {
  constructor() { super('An exercise cannot include more than 100 sets'); }
}

export class InvalidSplitNameError extends DomainValidationError {
  constructor() { super('Split name is required'); }
}

export class SplitNameTooLongError extends DomainValidationError {
  constructor() { super('Split name must be at most 100 characters'); }
}

export class InvalidWorkoutOrderError extends DomainValidationError {
  constructor() { super('Order index must be a non-negative integer'); }
}

export class InvalidRepetitionsError extends DomainValidationError {
  constructor() { super('Repetitions must be an integer between 1 and 10000'); }
}

import { OrderIndex } from '../value-objects/order-index';
import { SplitName } from '../value-objects/split-name';
import { PlannedExercise, type PlannedExerciseValues } from './planned-exercise';
import {
  DuplicateWorkoutExerciseError,
  DuplicateWorkoutExerciseOrderError,
  InvalidWorkoutSplitIdError,
  TooManyWorkoutExercisesError,
  WorkoutSplitRequiresExerciseError,
} from '../errors/workout-plan.errors';

/** Primitive values used to construct a workout split. */
export interface WorkoutSplitValues {
  id?: number | undefined;
  name: string;
  orderIndex: number;
  exercises: PlannedExerciseValues[];
}

/** Named, ordered group of exercises within a workout plan. */
export class WorkoutSplit {
  public readonly id: number | undefined;
  public readonly name: SplitName;
  public readonly orderIndex: OrderIndex;
  public readonly exercises: PlannedExercise[];
  public readonly isActive: boolean;
  public readonly hasChanges: boolean;

  private constructor(values: WorkoutSplitValues, isActive: boolean, hasChanges: boolean) {
    this.id = values.id;
    this.name = SplitName.create(values.name);
    this.orderIndex = OrderIndex.create(values.orderIndex);
    this.exercises = values.exercises.map(PlannedExercise.create);
    this.isActive = isActive;
    this.hasChanges = hasChanges;
  }

  /** Creates a split while enforcing exercise and ordering invariants. */
  public static create(values: WorkoutSplitValues): WorkoutSplit {
    WorkoutSplit.validate(values);
    return new WorkoutSplit(values, true, true);
  }

  public static restore(values: WorkoutSplitValues, isActive: boolean): WorkoutSplit {
    WorkoutSplit.validate(values);
    return new WorkoutSplit(values, isActive, false);
  }

  /** Replaces this split with its submitted state and records whether anything changed. */
  public replaceWith(submittedState: WorkoutSplitValues): WorkoutSplit {
    // Step 1: validate the complete submitted split before comparing or replacing anything.
    WorkoutSplit.validate(submittedState);

    // Step 2: build the next active state. Construction normalizes values such as the split name.
    const nextSplitState = new WorkoutSplit(submittedState, true, false);

    // Step 3: compare the persisted state with the normalized next state.
    const splitHasChanged = !this.hasSameStateAs(nextSplitState);

    // Step 4: return the next state and expose whether persistence should update its timestamp.
    return new WorkoutSplit(submittedState, true, splitHasChanged);
  }

  public deactivate(): WorkoutSplit {
    // Only an active split is considered changed when it becomes inactive.
    // Calling this again for an already inactive split must not refresh its timestamp.
    return new WorkoutSplit(this.toValues(), false, this.isActive);
  }

  private static validate(values: WorkoutSplitValues): void {
    if (values.id !== undefined && (!Number.isInteger(values.id) || values.id <= 0)) throw new InvalidWorkoutSplitIdError();
    if (values.exercises.length === 0) throw new WorkoutSplitRequiresExerciseError();
    if (values.exercises.length > 100) throw new TooManyWorkoutExercisesError();

    const exerciseIds = new Set<number>();
    const orderIndexes = new Set<number>();
    for (const exercise of values.exercises) {
      if (exerciseIds.has(exercise.exerciseId)) throw new DuplicateWorkoutExerciseError();
      if (orderIndexes.has(exercise.orderIndex)) throw new DuplicateWorkoutExerciseOrderError();
      exerciseIds.add(exercise.exerciseId);
      orderIndexes.add(exercise.orderIndex);
    }
  }

  private hasSameStateAs(other: WorkoutSplit): boolean {
    const hasSameActiveStatus = this.isActive === other.isActive;
    const hasSameName = this.name.value === other.name.value;
    const hasSameOrder = this.orderIndex.value === other.orderIndex.value;
    const hasSameExercises = this.hasSameExercisesAs(other);

    return hasSameActiveStatus && hasSameName && hasSameOrder && hasSameExercises;
  }

  private hasSameExercisesAs(other: WorkoutSplit): boolean {
    if (this.exercises.length !== other.exercises.length) return false;

    // Request array position has no meaning; orderIndex defines exercise order.
    // Compare by exercise identity so an equivalent differently ordered payload is unchanged.
    const otherExercisesById = new Map(other.exercises.map((exercise) => [exercise.exerciseId, exercise]));
    return this.exercises.every((exercise) => exercise.equals(otherExercisesById.get(exercise.exerciseId)));
  }

  private toValues(): WorkoutSplitValues {
    return {
      id: this.id,
      name: this.name.value,
      orderIndex: this.orderIndex.value,
      exercises: this.exercises.map((exercise) => exercise.toValues()),
    };
  }
}

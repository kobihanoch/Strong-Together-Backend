import { InvalidWorkoutExerciseIdError, TooManyWorkoutSetsError, WorkoutExerciseRequiresSetError } from '../errors/workout-plan.errors';
import { OrderIndex } from '../value-objects/order-index';
import { Repetitions } from '../value-objects/repetitions';

export interface PlannedExerciseValues {
  exerciseId: number;
  sets: number[];
  orderIndex: number;
}

/** Exercise prescribed within one workout split. */
export class PlannedExercise {
  public readonly exerciseId: number;
  public readonly sets: Repetitions[];
  public readonly orderIndex: OrderIndex;

  private constructor(values: PlannedExerciseValues) {
    this.exerciseId = values.exerciseId;
    this.sets = values.sets.map(Repetitions.create);
    this.orderIndex = OrderIndex.create(values.orderIndex);
  }

  public static create(values: PlannedExerciseValues): PlannedExercise {
    if (!Number.isInteger(values.exerciseId) || values.exerciseId <= 0) throw new InvalidWorkoutExerciseIdError();
    if (values.sets.length === 0) throw new WorkoutExerciseRequiresSetError();
    if (values.sets.length > 100) throw new TooManyWorkoutSetsError();
    return new PlannedExercise(values);
  }

  public equals(other: PlannedExercise | undefined): boolean {
    return other !== undefined
      && this.exerciseId === other.exerciseId
      && this.orderIndex.value === other.orderIndex.value
      && this.sets.length === other.sets.length
      && this.sets.every((set, index) => set.value === other.sets[index]?.value);
  }

  public toValues(): PlannedExerciseValues {
    return { exerciseId: this.exerciseId, orderIndex: this.orderIndex.value, sets: this.sets.map((set) => set.value) };
  }
}

import { OrderIndex } from '../value-objects/order-index';
import { Repetitions } from '../value-objects/repetitions';

/** Primitive values used to construct a planned exercise. */
export interface WorkoutExerciseValues {
  exerciseId: number;
  sets: number[];
  orderIndex: number;
}

/** Exercise assignment in a workout-plan replacement. */
export class WorkoutExercise {
  public readonly exerciseId: number;
  public readonly sets: Repetitions[];
  public readonly orderIndex: OrderIndex;

  private constructor(values: WorkoutExerciseValues) {
    this.exerciseId = values.exerciseId;
    this.sets = values.sets.map(Repetitions.create);
    this.orderIndex = OrderIndex.create(values.orderIndex);
  }

  /** Creates an exercise assignment and enforces its identity and set limits. */
  public static create(values: WorkoutExerciseValues): WorkoutExercise {
    if (!Number.isInteger(values.exerciseId) || values.exerciseId <= 0) throw new Error('Exercise ID must be a positive integer');
    if (values.sets.length === 0) throw new Error('Each exercise must include at least one set');
    if (values.sets.length > 100) throw new Error('An exercise cannot include more than 100 sets');
    return new WorkoutExercise(values);
  }
}

import { OrderIndex } from '../value-objects/order-index';
import { SplitName } from '../value-objects/split-name';
import { WorkoutExercise, type WorkoutExerciseValues } from './workout-exercise';

/** Primitive values used to construct a workout split. */
export interface WorkoutSplitValues {
  id?: number | undefined;
  name: string;
  orderIndex: number;
  exercises: WorkoutExerciseValues[];
}

/** Named, ordered group of exercises within a workout plan. */
export class WorkoutSplit {
  public readonly id: number | undefined;
  public readonly name: SplitName;
  public readonly orderIndex: OrderIndex;
  public readonly exercises: WorkoutExercise[];

  private constructor(values: WorkoutSplitValues) {
    this.id = values.id;
    this.name = SplitName.create(values.name);
    this.orderIndex = OrderIndex.create(values.orderIndex);
    this.exercises = values.exercises.map(WorkoutExercise.create);
  }

  /** Creates a split while enforcing exercise and ordering invariants. */
  public static create(values: WorkoutSplitValues): WorkoutSplit {
    if (values.id !== undefined && (!Number.isInteger(values.id) || values.id <= 0)) throw new Error('Workout split ID must be a positive integer');
    if (values.exercises.length === 0) throw new Error('Each split must include at least one exercise');
    if (values.exercises.length > 100) throw new Error('A split cannot include more than 100 exercises');

    const exerciseIds = new Set<number>();
    const orderIndexes = new Set<number>();
    for (const exercise of values.exercises) {
      if (exerciseIds.has(exercise.exerciseId)) throw new Error('Exercise IDs must be unique within a split');
      if (orderIndexes.has(exercise.orderIndex)) throw new Error('Exercise order indexes must be unique within a split');
      exerciseIds.add(exercise.exerciseId);
      orderIndexes.add(exercise.orderIndex);
    }
    return new WorkoutSplit(values);
  }
}

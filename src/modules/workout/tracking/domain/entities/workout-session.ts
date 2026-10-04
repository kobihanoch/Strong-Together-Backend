import { TooManyTrackedExercisesError, WorkoutSessionRequiresExerciseError } from '../errors/workout-tracking.errors';
import { WorkoutPeriod } from '../value-objects/workout-period';
import { TrackedExercise, type TrackedExerciseValues } from './tracked-exercise';

export interface WorkoutSessionValues {
  workout: TrackedExerciseValues[];
  workoutStartUtc: string;
  workoutEndUtc?: string | null | undefined;
}

/** Completed workout and all exercise performances recorded within it. */
export class WorkoutSession {
  public readonly exercises: TrackedExercise[];
  public readonly period: WorkoutPeriod;

  private constructor(
    public readonly id: string | undefined,
    values: WorkoutSessionValues,
  ) {
    this.exercises = values.workout.map(TrackedExercise.create);
    this.period = WorkoutPeriod.create(values.workoutStartUtc, values.workoutEndUtc);
  }

  public static create(values: WorkoutSessionValues): WorkoutSession {
    if (values.workout.length === 0) throw new WorkoutSessionRequiresExerciseError();
    if (values.workout.length > 200) throw new TooManyTrackedExercisesError();
    return new WorkoutSession(undefined, values);
  }

  public static restore(id: string, values: WorkoutSessionValues): WorkoutSession {
    return new WorkoutSession(id, values);
  }

  /** First planned assignment identifies the workout split summarized by persistence. */
  public get firstAssignedExerciseId(): number | undefined {
    return this.exercises.find((exercise) => exercise.reference.isExerciseAssignedToSplit)?.reference.exerciseToSplitId ?? undefined;
  }
}

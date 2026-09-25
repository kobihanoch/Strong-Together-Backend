import { WorkoutPeriod } from '../value-objects/workout-period';
import { TrackedExercise, type TrackedExerciseValues } from './tracked-exercise';

/** Complete workout-session values accepted by the domain. */
export interface CompletedWorkoutSessionValues {
  workout: TrackedExerciseValues[];
  workoutStartUtc: string;
  workoutEndUtc?: string | null | undefined;
}

/** Completed workout aggregate persisted as one transactional session. */
export class CompletedWorkoutSession {
  public readonly exercises: TrackedExercise[];
  public readonly period: WorkoutPeriod;

  public constructor(values: CompletedWorkoutSessionValues) {
    if (values.workout.length === 0) throw new Error('Workout must include at least one exercise');
    if (values.workout.length > 200) throw new Error('Workout cannot include more than 200 exercises');

    this.exercises = values.workout.map((exercise) => new TrackedExercise(exercise));
    this.period = new WorkoutPeriod(values.workoutStartUtc, values.workoutEndUtc);
  }
}

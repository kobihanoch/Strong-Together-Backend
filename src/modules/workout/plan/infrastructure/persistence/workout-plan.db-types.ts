import { exercise } from '../../../../../infrastructure/persistence/schema/drizzle/workout/exercises/table';
import { exerciseToWorkoutSplit } from '../../../../../infrastructure/persistence/schema/drizzle/workout/exercisetoworkoutsplit/table';
import { workoutPlan } from '../../../../../infrastructure/persistence/schema/drizzle/workout/workout_plan/table';
import { workoutSet } from '../../../../../infrastructure/persistence/schema/drizzle/workout/workout_set/table';
import { workoutSplit } from '../../../../../infrastructure/persistence/schema/drizzle/workout/workout_split/table';

/** Represents the plan db row value. */
type PlanDbRow = typeof workoutPlan.$inferSelect;
/** Represents the split db row value. */
type SplitDbRow = typeof workoutSplit.$inferSelect;
/** Represents the assignment db row value. */
type AssignmentDbRow = typeof exerciseToWorkoutSplit.$inferSelect;
/** Represents the exercise db row value. */
type ExerciseDbRow = typeof exercise.$inferSelect;
/** Represents the set db row value. */
type SetDbRow = typeof workoutSet.$inferSelect;

/** Exercise input accepted by workout-plan persistence. */
export interface WorkoutExerciseSqlInput {
  exerciseId: ExerciseDbRow['id'];
  sets: SetDbRow['reps'][];
  orderIndex: AssignmentDbRow['orderIndex'];
}

/** Split input accepted by workout-plan persistence. */
export interface WorkoutSplitSqlInput {
  id?: SplitDbRow['id'] | undefined;
  name: SplitDbRow['name'];
  orderIndex: SplitDbRow['orderIndex'];
  exercises: WorkoutExerciseSqlInput[];
  isActive: boolean;
  hasChanges: boolean;
}

/** Active split with the database identity required by exercise persistence. */
export type PersistedWorkoutSplitSqlInput = WorkoutSplitSqlInput & { id: SplitDbRow['id'] };

export interface WorkoutPlanStateSqlRow {
  planId: PlanDbRow['id'];
  splitId: SplitDbRow['id'] | null;
  name: SplitDbRow['name'] | null;
  splitOrderIndex: SplitDbRow['orderIndex'] | null;
  splitIsActive: SplitDbRow['isActive'] | null;
  exerciseId: ExerciseDbRow['id'] | null;
  exerciseOrderIndex: AssignmentDbRow['orderIndex'] | null;
  exerciseIsActive: AssignmentDbRow['isActive'] | null;
  sets: SetDbRow['reps'][];
}

export interface SavedWorkoutSplitSqlRow {
  id: SplitDbRow['id'];
  orderIndex: SplitDbRow['orderIndex'];
}

export interface SavedExerciseSqlRow {
  id: AssignmentDbRow['id'];
  splitId: SplitDbRow['id'];
  exerciseId: ExerciseDbRow['id'];
}


/** Describes the workout plan exercise sql row shape. */
export interface WorkoutPlanExerciseSqlRow {
  exerciseToSplitId: AssignmentDbRow['id'];
  exerciseId: ExerciseDbRow['id'];
  name: ExerciseDbRow['name'];
  sets: Array<{ orderIndex: SetDbRow['orderIndex']; reps: SetDbRow['reps'] }>;
  orderIndex: AssignmentDbRow['orderIndex'];
  isActive: AssignmentDbRow['isActive'];
  targetMuscle: ExerciseDbRow['targetMuscle'];
  specificTargetMuscle: ExerciseDbRow['specificTargetMuscle'];
}
/** Describes the workout plan split sql row shape. */
export interface WorkoutPlanSplitSqlRow {
  id: SplitDbRow['id'];
  workoutId: SplitDbRow['workoutId'];
  name: SplitDbRow['name'];
  orderIndex: SplitDbRow['orderIndex'];
  createdAt: string;
  muscleGroup: string | null;
  estimatedDurationMinutes: number | null;
  isActive: SplitDbRow['isActive'];
  exercises: WorkoutPlanExerciseSqlRow[];
}
/** Describes the workout plan sql row shape. */
export interface WorkoutPlanSqlRow {
  id: PlanDbRow['id'];
  numberOfSplits: number;
  createdAt: string;
  userId: PlanDbRow['userId'];
  isActive: PlanDbRow['isActive'];
  updatedAt: string;
  workoutSplits: WorkoutPlanSplitSqlRow[] | null;
}

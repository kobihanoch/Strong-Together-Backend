import { exercise } from '../../../../infrastructure/db/schema/drizzle/workout/exercises/table';
import { exerciseToWorkoutSplit } from '../../../../infrastructure/db/schema/drizzle/workout/exercisetoworkoutsplit/table';
import { workoutPlan } from '../../../../infrastructure/db/schema/drizzle/workout/workout_plan/table';
import { workoutSet } from '../../../../infrastructure/db/schema/drizzle/workout/workout_set/table';
import { workoutSplit } from '../../../../infrastructure/db/schema/drizzle/workout/workout_split/table';

type PlanDbRow = typeof workoutPlan.$inferSelect;
type SplitDbRow = typeof workoutSplit.$inferSelect;
type AssignmentDbRow = typeof exerciseToWorkoutSplit.$inferSelect;
type ExerciseDbRow = typeof exercise.$inferSelect;
type SetDbRow = typeof workoutSet.$inferSelect;

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
export interface WorkoutPlanSqlRow {
  id: PlanDbRow['id'];
  numberOfSplits: number;
  createdAt: string;
  userId: PlanDbRow['userId'];
  isActive: PlanDbRow['isActive'];
  updatedAt: string;
  workoutSplits: WorkoutPlanSplitSqlRow[] | null;
}
export type WorkoutPlanIdSqlRow = Pick<PlanDbRow, 'id'>;
export type WorkoutSplitIdSqlRow = Pick<SplitDbRow, 'id'>;
export type ExerciseAssignmentIdSqlRow = Pick<AssignmentDbRow, 'id'>;
export interface ExistingExercisesSqlRow {
  exercises: Array<{ exerciseId: ExerciseDbRow['id']; orderIndex: AssignmentDbRow['orderIndex']; sets: SetDbRow['reps'][] }>;
}

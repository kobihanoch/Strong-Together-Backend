import type { FinishedWorkoutEntry } from "../../dto/exerciseTracking.dto.ts";
import type { AddWorkoutSplitPayload } from "../../dto/workoutPlans.dto.ts";

export interface FinishUserWorkoutRequestBody {
  workout: FinishedWorkoutEntry[];
  tz?: string;
  workout_start_utc?: string | null;
  workout_end_utc?: string | null;
}

export interface AddWorkoutRequestBody {
  workoutData: AddWorkoutSplitPayload;
  workoutName?: string;
  tz: string;
}

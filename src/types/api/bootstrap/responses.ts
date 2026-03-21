import { ExerciseTrackingAndStats } from "../../dto/exerciseTracking.dto.ts";
import { UserAerobicsResponse } from "../aerobics/responses.ts";
import { GetAllUserMessagesResponse } from "../messages/responses.ts";
import { UserDataResponse } from "../user/responses.ts";
import { GetWholeUserWorkoutPlanResponse } from "../workouts/responses.ts";

export type BootstrapResponse = {
  user: UserDataResponse["user_data"];
  workout: GetWholeUserWorkoutPlanResponse;
  tracking: ExerciseTrackingAndStats;
  messages: GetAllUserMessagesResponse;
  aerobics: UserAerobicsResponse;
};

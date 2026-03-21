import {
  GoalAdherenceResponse,
  WorkoutRMsResponse,
} from "../../dto/analytics.dto.ts";

export type GetAnalyticsResponse = {
  _1RM: WorkoutRMsResponse;
  goals: GoalAdherenceResponse;
};

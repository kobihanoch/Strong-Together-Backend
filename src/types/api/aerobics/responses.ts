import type {
  AerobicsDailyRecord,
  WeeklyData,
} from "../../dto/aerobics.dto.ts";

export interface UserAerobicsResponse {
  daily: Record<string, AerobicsDailyRecord[]>;
  weekly: Record<string, WeeklyData>;
}

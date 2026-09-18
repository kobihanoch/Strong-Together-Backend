import { Injectable } from '@nestjs/common';
import type {
  ExerciseHistoryQueryDto,
  ExerciseTrackingMapsQueryDto,
  ExerciseTrackingStatsQueryDto,
  FinishedWorkoutEntryQueryDto,
  PersonalRecordsQueryDto,
} from '@strong-together/shared';
import { WorkoutTrackingQueries } from './tracking.queries';
import { WorkoutTrackingRepository } from './tracking.repository';

@Injectable()
export class PostgresWorkoutTrackingRepository implements WorkoutTrackingRepository {
  constructor(private readonly queries: WorkoutTrackingQueries) {}

  findWorkoutHistoryByUser(userId: string, days: number, timezone: string): Promise<ExerciseTrackingMapsQueryDto> {
    return this.queries.queryGetExerciseTrackingMaps(userId, days, timezone);
  }

  findExerciseHistoryByUser(userId: string, days: number, timezone: string): Promise<ExerciseHistoryQueryDto> {
    return this.queries.queryGetExerciseHistory(userId, days, timezone);
  }

  findWorkoutStatisticsByUser(userId: string, days: number, timezone: string): Promise<ExerciseTrackingStatsQueryDto> {
    return this.queries.queryGetExerciseTrackingStats(userId, days, timezone);
  }

  findPersonalRecordsByUser(userId: string, timezone: string): Promise<PersonalRecordsQueryDto> {
    return this.queries.queryGetAllPersonalRecords(userId, timezone);
  }

  async saveCompletedWorkoutForUser(
    userId: string,
    workout: FinishedWorkoutEntryQueryDto[],
    workoutStartUtc: string | null,
    workoutEndUtc: string | null,
  ): Promise<void> {
    await this.queries.queryInsertUserFinishedWorkout(userId, workout, workoutStartUtc, workoutEndUtc);
  }
}

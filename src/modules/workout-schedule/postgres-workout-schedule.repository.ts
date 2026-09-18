import { Injectable } from '@nestjs/common';
import type { WorkoutScheduleInputDto, WorkoutScheduleQueryDto } from '@strong-together/shared';
import { WorkoutScheduleQueries } from './workout-schedule.queries';
import { WorkoutScheduleRepository } from './workout-schedule.repository';

@Injectable()
export class PostgresWorkoutScheduleRepository implements WorkoutScheduleRepository {
  constructor(private readonly queries: WorkoutScheduleQueries) {}

  findSchedulesByUser(userId: string): Promise<WorkoutScheduleQueryDto[]> {
    return this.queries.queryWorkoutSchedules(userId);
  }

  replaceSchedulesForUser(userId: string, schedules: WorkoutScheduleInputDto[]): Promise<void> {
    return this.queries.queryReplaceWorkoutSchedules(userId, schedules);
  }
}

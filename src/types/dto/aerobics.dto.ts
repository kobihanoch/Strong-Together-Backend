import { AddUserAerobicsBody } from './../api/aerobics/requests.ts';
import { AerobicEntity } from '../entities/aerobic.entity.ts';

export type AddAerobicInput = AddUserAerobicsBody['record'];

export type AerobicsDailyRecord = Pick<AerobicEntity, 'type' | 'duration_sec' | 'duration_mins'>;

export interface AerobicsWeeklyRecord extends AerobicsDailyRecord {
  workout_time_utc: AerobicEntity['workout_time_utc'];
}

export interface WeeklyData {
  records: AerobicsWeeklyRecord[];
  total_duration_sec: number;
  total_duration_mins: number;
}

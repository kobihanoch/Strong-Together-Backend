import { Injectable } from '@nestjs/common';
import { DBService } from '../../../../../../infrastructure/connections/postgres/db.service';
import type { PersonalRecordsSqlRow } from '../workout-tracking.db-types';

@Injectable()
export class FindPersonalRecordsSql {
  constructor(private readonly dbService: DBService) {}
  /**
   * Retrieves all current personal records for a user.
   *
   * A personal record is the strongest tracked set selected by
   * `tracking.v_prs` for an exercise. Each result is stored under its
   * exercise identifier.
   *
   * @param userId - The authenticated user's identifier.
   * @param tz - The IANA time-zone name used for local workout timestamps.
   * @returns All personal records keyed by exercise identifier.
   */
  async findPersonalRecords(userId: string, tz: string) {
    const [{ data }] = await this.dbService.sql<PersonalRecordsSqlRow[]>`
      SELECT
        JSONB_BUILD_OBJECT(
          'prs',
          COALESCE(
            JSONB_OBJECT_AGG(
              p.exercise_id::INT,
              JSONB_BUILD_OBJECT(
                'exerciseToSplitId',
                p.exercise_to_split_id::INT,
                'exerciseName',
                p.exercise,
                'prWeight',
                p.weight,
                'prReps',
                p.reps::INT,
                'prSetIndex',
                p.set_index,
                'estimatedOneRepMax',
                CASE
                  WHEN p.reps = 1 THEN p.weight::NUMERIC
                  WHEN p.reps BETWEEN 2 AND 5  THEN (p.weight * (1 + 0.0333 * p.reps))::NUMERIC
                  WHEN p.reps BETWEEN 6 AND 10  THEN (p.weight * 36.0 / (37.0 - p.reps))::NUMERIC
                  WHEN p.reps BETWEEN 11 AND 12  THEN (p.weight * (1 + 0.025 * p.reps))::NUMERIC
                  ELSE NULL
                END,
                'workoutStartLocal',
                TO_CHAR(
                  p.workout_start_utc AT TIME ZONE ${tz},
                  'YYYY-MM-DD"T"HH24:MI:SS.MS'
                )
              )
              ORDER BY
                p.workout_start_utc DESC,
                p.weight DESC,
                p.id DESC
            ),
            '{}'::JSONB
          )
        ) AS data
      FROM
        tracking.v_prs p
        JOIN tracking.workout_summary wsum ON wsum.id = p.workout_summary_id
      WHERE
        wsum.user_id = ${userId}::UUID
        AND p.exercise_id IS NOT NULL
    `;

    return data;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import type { AddAerobicInputQueryDto, AerobicMutationRowQueryDto, UserAerobicsQueryDto, UserAerobicsRowQueryDto } from '@strong-together/shared';
import type postgres from 'postgres';
import { SQL } from '../../infrastructure/db/db.tokens';

export class AerobicsQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  /**
   * Retrieves user aerobics for ndays.
   * @param userId - The user identifier.
   * @param days - The days.
   * @param tz - The IANA time-zone name.
   * @returns The user aerobics for ndays result.
   */
  async queryGetUserAerobicsForNDays(userId: string, days: number, tz: string = 'Asia/Jerusalem'): Promise<UserAerobicsQueryDto> {
    const [obj] = await this.sql<UserAerobicsRowQueryDto[]>`
      /* Normalize parameters (default tz to UTC if empty) */
      WITH
        params AS (
          SELECT
            ${userId}::UUID AS user_id,
            ${days}::INT AS days,
            COALESCE(NULLIF(${tz}, ''), 'UTC') AS tz
        ),
        /* Convert local calendar-day boundaries back to instants. This remains correct across DST offset changes. */
        bounds AS (
          SELECT
            (
              (NOW() AT TIME ZONE p.tz)::date - GREATEST(p.days - 1, 0) * INTERVAL '1 day'
            ) AT TIME ZONE p.tz AS lower_bound_utc,
            ((NOW() AT TIME ZONE p.tz)::date + INTERVAL '1 day') AT TIME ZONE p.tz AS upper_bound_utc
          FROM
            params p
        ),
        /* Base contains the requested local calendar days and their local wall-clock timestamps. */
        base AS (
          SELECT
            at.id,
            (at.duration_sec / 60) AS dm,
            (at.duration_sec % 60) AS ds,
            /* Convert timestamptz to local time in tz (timestamp without time zone) */
            (
              at.workout_time_utc AT TIME ZONE(
                SELECT
                  tz
                FROM
                  params
              )
            ) AS local_ts,
            /* Local date derived from the local timestamp */
            (
              at.workout_time_utc AT TIME ZONE(
                SELECT
                  tz
                FROM
                  params
              )
            )::date AS local_date,
            JSONB_BUILD_OBJECT(
              'id',
              at.id,
              'type',
              at.type,
              'durationMins',
              at.duration_sec / 60,
              'durationSec',
              at.duration_sec % 60
            ) AS ROW
          FROM
            tracking.aerobic_tracking at
            CROSS JOIN params p
            CROSS JOIN bounds b
          WHERE
            at.user_id = p.user_id
            AND at.workout_time_utc >= b.lower_bound_utc
            AND at.workout_time_utc < b.upper_bound_utc
        ),
        /* Norm is gathering relevant information for later (week starts on Sunday, like your original DOW logic) */
        norm AS (
          SELECT
            b.row,
            b.dm,
            b.ds,
            b.id,
            b.local_ts,
            b.local_date,
            /* PostgreSQL weeks start Monday; shifting one day preserves the API's Sunday week start. */
            (
              DATE_TRUNC('week', b.local_date::TIMESTAMP + INTERVAL '1 day') - INTERVAL '1 day'
            )::date AS week_start
          FROM
            base b
        ),
        /* Daily map: key is local_date (text), value is array of rows */
        daily AS (
          SELECT
            n.local_date::TEXT AS d,
            JSONB_AGG(
              n.row
              ORDER BY
                n.id ASC
            ) AS records
          FROM
            norm n
          GROUP BY
            n.local_date
        ),
        /* Weekly map:
        - totals are per week (same as before)
        - records contain the local wall-clock timestamp in the requested timezone */
        weekly AS (
          SELECT
            n.week_start::TEXT AS ws,
            JSONB_BUILD_OBJECT(
              'totalDurationMins',
              SUM(n.dm),
              'totalDurationSec',
              SUM(n.ds),
              'records',
              JSONB_AGG(
                TO_JSONB(n.row) || JSONB_BUILD_OBJECT('workoutTimeLocal', n.local_ts::TEXT)
                ORDER BY
                  n.id ASC
              )
            ) AS records
          FROM
            norm n
          GROUP BY
            n.week_start
        )
        /* Final result: identical structure to your current response */
      SELECT
        JSONB_BUILD_OBJECT(
          'daily',
          COALESCE(
            (
              SELECT
                JSONB_OBJECT_AGG(d.d, d.records)
              FROM
                daily d
            ),
            '{}'::JSONB
          ),
          'weekly',
          COALESCE(
            (
              SELECT
                JSONB_OBJECT_AGG(w.ws, w.records)
              FROM
                weekly w
            ),
            '{}'::JSONB
          )
        ) AS data
    `;

    return obj.data;
  }

  // Add a new aerobic record
  /**
   * Adds aerobic tracking.
   * @param userId - The user identifier.
   * @param record - The aerobic tracking record.
   */
  async queryAddAerobicTracking(userId: string, record: AddAerobicInputQueryDto): Promise<void> {
    const { durationMins, durationSec, type } = record;
    await this.sql`
      INSERT INTO
        tracking.aerobic_tracking (user_id, type, duration_sec)
      VALUES
        (
          ${userId}::UUID,
          ${type},
          ${durationMins * 60 + durationSec}
        )
    `;
  }

  /**
   * Updates an aerobic entry owned by the authenticated user.
   *
   * @param userId - The authenticated user's identifier.
   * @param id - The aerobic entry identifier.
   * @param record - The replacement aerobic entry values.
   * @returns The updated entry identifier, or `null` when it was not found.
   */
  async queryUpdateAerobicTracking(userId: string, id: number, record: AddAerobicInputQueryDto): Promise<number | null> {
    const { durationMins, durationSec, type } = record;
    const [row] = await this.sql<AerobicMutationRowQueryDto[]>`
      UPDATE tracking.aerobic_tracking
      SET
        type = ${type},
        duration_sec = ${durationMins * 60 + durationSec}
      WHERE
        id = ${id}::BIGINT
        AND user_id = ${userId}::UUID
      RETURNING
        id
    `;
    return row?.id ?? null;
  }

  /**
   * Deletes an aerobic entry owned by the authenticated user.
   *
   * @param userId - The authenticated user's identifier.
   * @param id - The aerobic entry identifier.
   * @returns The deleted entry identifier, or `null` when it was not found.
   */
  async queryDeleteAerobicTracking(userId: string, id: number): Promise<number | null> {
    const [row] = await this.sql<AerobicMutationRowQueryDto[]>`
      DELETE FROM tracking.aerobic_tracking
      WHERE
        id = ${id}::BIGINT
        AND user_id = ${userId}::UUID
      RETURNING
        id
    `;
    return row?.id ?? null;
  }
}

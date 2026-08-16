import { Inject, Injectable } from '@nestjs/common';
import type postgres from 'postgres';
import type { ExerciseTrackingAndStats, FinishedWorkoutEntry } from '@strong-together/shared';
import { SQL } from '../../../infrastructure/db/db.tokens';

@Injectable()
export class WorkoutTrackingQueries {
  constructor(@Inject(SQL) private readonly sql: postgres.Sql) {}

  async queryGetExerciseTrackingAndStats(
    userId: string,
    days: number = 45,
    tz: string = 'Asia/Jerusalem',
  ): Promise<ExerciseTrackingAndStats> {
    // Load the user's tracking history, statistics, PRs, and response maps in one query.
    const [{ data }] = await this.sql<[{ data: ExerciseTrackingAndStats }]>`
  with 
  bounds as (
    select 
    (now() + interval '1 day') as upper_bound_utc, 
    (now() - ${days} * interval '1 day') as lower_bound_utc
  ),
  
  all_workout_summaries as(
    select wsum.id as id, ws.name as split_name, ((wsum.workout_start_utc at time zone ${tz})) as workout_time_local, 
    wsum.workout_start_utc, wsum.workout_end_utc
    from tracking.workout_summary wsum
    join workout.workout_split ws on ws.id = wsum.workout_split_id
    where wsum.user_id=${userId}::uuid
  ),

  bounded_workout_summaries as (
    select aws.id, aws.split_name, aws.workout_time_local
    from all_workout_summaries aws 
    where aws.workout_start_utc >= (select lower_bound_utc from bounds limit 1)
      and aws.workout_start_utc <  (select upper_bound_utc from bounds limit 1)
  ),

  unique_days as (
    select count(aws.id) as workout_count
    from all_workout_summaries aws
  ),

  split_performs as (
    select aws.split_name as name, count(aws.id) as count
    from all_workout_summaries aws
    group by aws.split_name
  ),

  most_frequent_split as (
    select sp.name, sp.count
    from split_performs sp
    order by sp.count desc
    limit 1
  ),
 
  last_workout_date as (
    select aws.workout_time_local::date as last_date
    from all_workout_summaries aws
    order by aws.workout_time_local desc
    limit 1
  ),

  all_prs as (
    select p.exercise_to_split_id as etsid, p.exercise_id, p.exercise, p.weight, p.reps, ((p.workout_start_utc at time zone ${tz})::date) as workout_date_utc
    from analytics.v_prs p
    join all_workout_summaries aws on p.workout_summary_id = aws.id
  ),

  pr_max as (
    select ap.exercise, ap.weight, ap.reps, ap.workout_date_utc as workout_time_utc
    from all_prs ap
    order by weight desc, reps desc, workout_time_utc desc
    limit 1
  ),

  all_exercise_trackings as (
    select et.id, et.exercise_to_split_id as exercisetosplit_id, et.weight, et.reps, et.exercise_id, et.workout_split_id as workoutsplit_id, et.split_name as splitname, et.exercise, et.notes, to_char((et.workout_start_utc at time zone ${tz})::date, 'YYYY-MM-DD') as workoutdate, ets.order_index,
    jsonb_build_object(
        'sets', ets.sets,
        'exercises', jsonb_build_object(
          'targetmuscle', ex.target_muscle,
          'specifictargetmuscle', ex.specific_target_muscle
        )
      ) as exercisetoworkoutsplit
    from analytics.v_exercise_tracking_expanded et
    join workout.v_exercise_to_workout_split_expanded ets on ets.id = et.exercise_to_split_id
    join workout.exercise ex on ex.id = ets.exercise_id
    join bounded_workout_summaries bws on et.workout_summary_id = bws.id
  ),

  by_date as (
    select jsonb_object_agg(workout_date_local_string, items) as map
    from (
      select aet.workoutdate as workout_date_local_string, jsonb_agg(to_jsonb(aet) - 'workoutdate' order by aet.order_index asc) as items
      from all_exercise_trackings aet
      group by aet.workoutdate
    ) t
  ),

  by_etsid as (
    select jsonb_object_agg(exercisetosplit_id, items) as map
    from (
      select aet.exercisetosplit_id, jsonb_agg(to_jsonb(aet) order by aet.workoutdate desc) as items
      from all_exercise_trackings aet
      group by aet.exercisetosplit_id
    ) t
  ),

  by_split_name as (
    select jsonb_object_agg(splitname, items) as map
    from (
      select aet.splitname, jsonb_agg(to_jsonb(aet) - 'splitname' order by aet.workoutdate desc) as items
      from all_exercise_trackings aet
      group by aet.splitname
    ) t
  )

  select jsonb_build_object(
    'exerciseTrackingAnalysis', jsonb_build_object(
      'unique_days', (select workout_count from unique_days),
      'most_frequent_split', (select name from most_frequent_split),
      'most_frequent_split_days', (select count from most_frequent_split),
      'lastWorkoutDate', to_char((select last_date from last_workout_date), 'YYYY-MM-DD'),
      'splitDaysByName', (coalesce((select jsonb_object_agg(sp.name, sp.count) from split_performs sp), '{}'::jsonb)),
      'prs', (jsonb_build_object(
        'pr_max', (coalesce((select to_jsonb(prm) from pr_max prm), null))
      ))
    ),
    'exerciseTrackingMaps', jsonb_build_object(
      'byDate', coalesce((select bdm.map from by_date bdm),'{}'::jsonb),
      'byETSId', coalesce((select betsid.map from by_etsid betsid), '{}'::jsonb),
      'bySplitName', coalesce((select bsn.map from by_split_name bsn), '{}'::jsonb)
    )) as data
  `;

    return data;
  }

  async queryInsertUserFinishedWorkout(
    userId: string,
    workoutArray: FinishedWorkoutEntry[],
    workoutStartUtc: string | null,
    workoutEndUtc: string | null,
  ): Promise<string> {
    // Resolve the workout split that owns the exercises in the finished workout.
    const [{ workoutsplit_id }] = await this.sql<[{ workoutsplit_id: number }]>`
      select workout_split_id as workoutsplit_id
      from workout.exercise_to_workout_split
      where id = ${workoutArray[0].exercisetosplit_id}
      limit 1;
    `;

    // Create the parent summary for the completed workout.
    const [{ id: workoutSummaryId }] = await this.sql<[{ id: string }]>`
      insert into tracking.workout_summary (
        user_id,
        workout_start_utc,
        workout_end_utc,
        workout_split_id
      )
      values (
        ${userId}::uuid,
        ${workoutStartUtc}::timestamptz,
        ${workoutEndUtc}::timestamptz,
        ${workoutsplit_id}::int8
      )
      returning id;
    `;

    for (const exercise of workoutArray) {
      if (exercise.weight.length !== exercise.reps.length) {
        throw new Error('Weight and reps arrays must have the same length');
      }

      // Create one tracking record for this exercise; its sets are inserted next.
      const [{ id: exerciseTrackingId }] = await this.sql<[{ id: number }]>`
        insert into tracking.exercise_tracking
          (exercise_to_split_id, notes, workout_summary_id)
        values (
          ${exercise.exercisetosplit_id},
          ${exercise.notes ?? ''},
          ${workoutSummaryId}::uuid
        )
        returning id;
      `;

      for (let setIndex = 0; setIndex < exercise.reps.length; setIndex += 1) {
        // Store the reps and weight for one performed set at its zero-based index.
        await this.sql`
          insert into tracking.tracking_set (exercise_tracking_id, set_index, reps, weight)
          values (
            ${exerciseTrackingId},
            ${setIndex},
            ${exercise.reps[setIndex]},
            ${exercise.weight[setIndex]}
          );
        `;
      }
    }

    return workoutSummaryId;
  }
}

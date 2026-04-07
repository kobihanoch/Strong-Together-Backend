import type postgres from 'postgres';
import sql from '../../../infrastructure/db.client.ts';
import { ExerciseTrackingAndStats, FinishedWorkoutEntry } from '../../../shared/types/dto/exercise-tracking.dto.ts';

export const queryGetExerciseTrackingAndStats = async (
  userId: string,
  days: number = 45,
  tz: string = 'Asia/Jerusalem',
): Promise<ExerciseTrackingAndStats> => {
  const [{ data }] = await sql<[{ data: ExerciseTrackingAndStats }]>`
  with 
  bounds as (
    select 
    (now() + interval '1 day') as upper_bound_utc, 
    (now() - ${days} * interval '1 day') as lower_bound_utc
  ),
  
  all_workout_summaries as(
    select wsum.id as id, ws.name as split_name, ((wsum.workout_start_utc at time zone ${tz})) as workout_time_local, 
    wsum.workout_start_utc, wsum.workout_end_utc
    from public.workout_summary wsum
    join public.workoutsplits ws on ws.id = wsum.workoutsplit_id
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
    select p.exercisetosplit_id as etsid, p.exercise_id, p.exercise, p.weight, p.reps, ((p.workout_start_utc at time zone ${tz})::date) as workout_date_utc
    from public.v_prs p
    join all_workout_summaries aws on p.workout_summary_id = aws.id
  ),

  pr_max as (
    select ap.exercise, ap.weight, ap.reps, ap.workout_date_utc as workout_time_utc
    from all_prs ap
    order by weight desc, reps desc, workout_time_utc desc
    limit 1
  ),

  all_exercise_trackings as (
    select et.id, et.exercisetosplit_id, et.weight, et.reps, et.exercise_id, et.workoutsplit_id, et.splitname, et.exercise, et.notes, to_char((et.workout_start_utc at time zone ${tz})::date, 'YYYY-MM-DD') as workoutdate, ets.order_index,
    jsonb_build_object(
        'sets', ets.sets,
        'exercises', jsonb_build_object(
          'targetmuscle', ex.targetmuscle,
          'specifictargetmuscle', ex.specifictargetmuscle
        )
      ) as exercisetoworkoutsplit
    from public.v_exercisetracking_expanded et
    join public.exercisetoworkoutsplit ets on ets.id = et.exercisetosplit_id
    join public.exercises ex on ex.id = ets.exercise_id
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
};

export const queryInsertUserFinishedWorkout = async (
  userId: string,
  workoutArray: FinishedWorkoutEntry[],
  workoutStartUtc: string | null,
  workoutEndUtc: string | null,
): Promise<string> => {
  const workoutArrayJson = workoutArray as unknown as postgres.ParameterOrFragment<never>;

  const [{ workoutsplit_id }] = await sql<[{ workoutsplit_id: number }]>`
    select distinct ews.workoutsplit_id
    from jsonb_to_recordset(${workoutArrayJson}::jsonb) as t(exercisetosplit_id int8)
    join public.exercisetoworkoutsplit ews
      on ews.id = t.exercisetosplit_id
    limit 1;
  `;

  const [{ id: workoutSummaryId }] = await sql<[{ id: string }]>`
    insert into public.workout_summary (
      user_id,
      workout_start_utc,
      workout_end_utc,
      workoutsplit_id
    )
    values (
      ${userId}::uuid,
      ${workoutStartUtc}::timestamptz,
      ${workoutEndUtc}::timestamptz,
      ${workoutsplit_id}::int8
    )
    returning id;
  `;

  await sql`
    insert into public.exercisetracking
      (exercisetosplit_id, weight, reps, notes, workout_summary_id)
    select
      t.exercisetosplit_id::int8,
      t.weight::float4[],
      t.reps::int8[],
      coalesce(t.notes, '')::text,
      ${workoutSummaryId}::uuid as workout_summary_id
    from jsonb_to_recordset(${workoutArrayJson}::jsonb) as t(
      exercisetosplit_id int8,
      weight float4[],
      reps int8[],
      notes text
    );
  `;

  return workoutSummaryId;
};

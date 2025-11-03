import sql from "../config/db.js";

/**
 * {
 *        [ex_id]: {
 *                exercise (name),
 *                pr_weight,
 *                pr_reps
 *                max_1rm
 *        } , .....
 * }
 */
export const queryGetWorkoutRMs = async (userId) => {
  const [{ result }] = await sql`
    with
    -- All workouts for this user (authoritative source)
    all_workout_summaries as (
      select id
      from public.workout_summary
      where user_id = ${userId}::uuid
    ),

    -- All performed sets (only from this user's workouts)
    per_set as (
      select
        s.exercise_id,
        s.exercise,
        s.id,
        s.weight,
        s.reps,
        case
          when s.reps = 1 then s.weight::numeric
          when s.reps between 2 and 5  then (s.weight * (1 + 0.0333 * s.reps))::numeric    -- Epley
          when s.reps between 6 and 10 then (s.weight * 36.0 / (37.0 - s.reps))::numeric   -- Brzycki
          when s.reps between 11 and 12 then (s.weight * (1 + 0.025 * s.reps))::numeric    -- O'Connor
          else null
        end as est_1rm
      from public.v_exercisetracking_set_simple s
      where s.workout_summary_id in (select id from all_workout_summaries)
        and s.weight > 0
        and s.reps between 1 and 12
    ),

    -- All PR rows for this user's workouts (not by user_id, but by summary chain)
    all_prs as (
      select
        p.exercise_id,
        p.exercise,
        p.weight,
        p.reps,
        p.workout_summary_id
      from public.v_prs p
      where p.workout_summary_id in (select id from all_workout_summaries)
    ),

    -- One PR row per exercise (heaviest, then most reps, then latest)
    pr_per_exercise as (
      select distinct on (ap.exercise_id)
        ap.exercise_id,
        ap.exercise,
        ap.weight,
        ap.reps
      from all_prs ap
      order by
        ap.exercise_id,
        ap.weight desc,
        ap.reps desc,
        ap.workout_summary_id desc
    ),

    -- Choose best 1RM per exercise, and attach PR if exists
    best as (
      select distinct on (ps.exercise_id)
        ps.exercise_id,
        ps.exercise,
        ppe.weight as pr_weight,
        ppe.reps   as pr_reps,
        ps.est_1rm
      from per_set ps
      left join pr_per_exercise ppe
        on ppe.exercise_id = ps.exercise_id
      where ps.est_1rm is not null
      order by
        ps.exercise_id,
        ps.est_1rm desc,
        ppe.weight desc nulls last,
        ppe.reps desc nulls last,
        ps.id desc
    )

    select coalesce(
      jsonb_object_agg(
        exercise_id,
        jsonb_build_object(
          'exercise',  exercise,
          'pr_weight', pr_weight,
          'pr_reps',   pr_reps,
          'max_1rm',   round(est_1rm, 1)
        )
      ),
      '{}'::jsonb
    ) as result
    from best;
  `;

  return result ?? {};
};

/**
 * {
 *      [splitname]: { [exercise]: { planned, actual } }
 * }
 */

export const queryGoalAdherence = async (userId) => {
  const [{ result }] = await sql`
    with
    -- Planned volume per split+exercise from the user's active plans
    planned as (
      select
        ws.id   as split_id,
        ws.name as splitname,
        ews.exercise_id,
        ews.exercise,
        (
          select coalesce(sum(v), 0)
          from unnest(ews.sets) as v
        ) as planned
      from public.workoutplans w
      join public.workoutsplits ws
        on ws.workout_id = w.id
      join public.v_exercisetoworkoutsplit_expanded ews
        on ews.workoutsplit_id = ws.id
      where w.user_id = ${userId}::uuid
        and w.is_active = true
    ),

    -- All workouts actually performed by this user
    all_workout_summaries as (
      select
        ws.id,
        ws.workoutsplit_id
      from public.workout_summary ws
      where ws.user_id = ${userId}::uuid
        and ws.workoutsplit_id is not null
    ),

    -- Raw performed reps per workout+exercise
    actual_raw as (
      select
        aws.workoutsplit_id        as split_id,
        wspl.name                  as splitname,
        et.exercise_id,
        et.exercise,
        (
          select sum(x) from unnest(et.reps) as x
        ) as reps_sum_per_row
      from public.v_exercisetracking_expanded et
      join all_workout_summaries aws
        on aws.id = et.workout_summary_id
      left join public.workoutsplits wspl
        on wspl.id = aws.workoutsplit_id
      where aws.workoutsplit_id is not null
    ),

    -- Aggregate actual per split+exercise
    actual as (
      select
        split_id,
        splitname,
        exercise_id,
        exercise,
        avg(reps_sum_per_row) as actual
      from actual_raw
      group by split_id, splitname, exercise_id, exercise
    ),

    -- Join planned with actual
    joined as (
      select
        p.splitname,
        p.exercise,
        p.planned,
        a.actual
      from planned p
      join actual a
        on a.split_id    = p.split_id
       and a.exercise_id = p.exercise_id
    )

    select coalesce(
      jsonb_object_agg(
        splitname,
        per_split
      ),
      '{}'::jsonb
    ) as result
    from (
      select
        splitname,
        jsonb_object_agg(
          exercise,
          jsonb_build_object(
            'planned',       planned,
            'actual',        actual,
            'adherence_pct', case when planned > 0 then 100.0 * actual / planned else null end
          )
          order by exercise
        ) as per_split
      from joined
      group by splitname
    ) t;
  `;

  return result ?? {};
};

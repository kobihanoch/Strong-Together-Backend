import sql from "../config/db.js";

export async function queryWholeUserWorkoutPlan(userId) {
  return sql`
    SELECT
      workoutplans.*,
      (
        SELECT json_agg(
                 to_jsonb(workoutsplits.*)
                 || jsonb_build_object(
                   'exercisetoworkoutsplit',
                   (
                     SELECT json_agg(
                              to_jsonb(ews.*)
                              || jsonb_build_object(
                                   'targetmuscle', ex.targetmuscle,
                                   'specifictargetmuscle', ex.specifictargetmuscle
                                 )
                              ORDER BY ews.id
                            )
                     FROM exercisetoworkoutsplit ews
                     LEFT JOIN exercises ex ON ex.id = ews.exercise_id
                     WHERE ews.workoutsplit_id = workoutsplits.id
                   )
                 )
                 ORDER BY workoutsplits.id
               )
        FROM workoutsplits
        WHERE workoutsplits.workout_id = workoutplans.id
      ) AS workoutsplits
    FROM workoutplans
    WHERE workoutplans.user_id = ${userId}
    LIMIT 1;
  `;
}

export async function queryExerciseTracking(userId) {
  return sql`
  SELECT
    et.id,
    et.user_id,
    et.exercise,
    et.exercise_id,
    et.exercisetosplit_id,
    et.splitname,
    et.workoutsplit_id,
    et.weight,
    et.reps,
    to_char(et.workoutdate::date, 'YYYY-MM-DD') AS workoutdate,
    (
      SELECT
        to_jsonb(ews.*)
        || jsonb_build_object(
            'exercises',
            json_build_object(
              'targetmuscle', ex.targetmuscle,
              'specifictargetmuscle', ex.specifictargetmuscle
            )
          )
      FROM exercisetoworkoutsplit AS ews
      LEFT JOIN exercises AS ex
        ON ex.id = ews.exercise_id
      WHERE ews.id = et.exercisetosplit_id
    ) AS exercisetoworkoutsplit
  FROM exercisetracking AS et
  WHERE et.user_id = ${userId}
    AND et.workoutdate >= CURRENT_DATE - INTERVAL '45 days'
  ORDER BY et.workoutdate::date DESC, et.id DESC;
  `;
}

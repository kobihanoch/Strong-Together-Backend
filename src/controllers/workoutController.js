import createError from "http-errors";
import jwt from "jsonwebtoken";
import sql from "../config/db.js";

// @desc    Get authenticated user workout (plan, splits, and exercises)
// @route   GET /api/workouts/getworkout
// @access  Private
export const getWholeUserWorkoutPlan = async (req, res) => {
  const userId = req.user.id;

  const [plan] = await sql`
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

  if (!plan) {
    return res.status(200).json(null);
  }

  return res.status(200).json(plan);
};

// @desc    Get authenticated user exercise tracking
// @route   GET /api/workouts/gettracking
// @access  Private
export const getExerciseTracking = async (req, res) => {
  const userId = req.user.id;

  const rows = await sql`
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
  ORDER BY et.workoutdate::date DESC, et.id DESC;
  `;

  return res.status(200).json(rows ?? []);
};

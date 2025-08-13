import {
  queryInsertUserFinishedWorkout,
  queryWholeUserWorkoutPlan,
  queryWorkoutStatsTopSplitPRAndRecent,
} from "../queries/workoutQueries.js";

// @desc    Get authenticated user workout (plan, splits, and exercises)
// @route   GET /api/workouts/getworkout
// @access  Private
export const getWholeUserWorkoutPlan = async (req, res) => {
  const userId = req.user.id;

  const rows = await queryWholeUserWorkoutPlan(userId);
  const [plan] = rows;

  if (!plan) {
    return res.status(200).json(null);
  }

  return res.status(200).json(plan);
};

// @desc    Get authenticated user exercise tracking (Past 45 days only)
// @route   GET /api/workouts/gettracking
// @access  Private
export const getExerciseTracking = async (req, res) => {
  const userId = req.user.id;
  const rows = await queryWorkoutStatsTopSplitPRAndRecent(userId, 45);
  return res.status(200).json(rows[0]);
};

// @desc    Finish user workout
// @route   POST /api/workouts/finishworkout
// @access  Private
export const finishUserWorkout = async (req, res) => {
  const userId = req.user.id;
  const returnedEt = await queryInsertUserFinishedWorkout(
    userId,
    req.body.workout
  );
  return res.status(200).json(returnedEt);
};

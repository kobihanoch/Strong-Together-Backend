import {
  queryAddWorkout,
  queryDeleteUserWorkout,
  queryGetWorkoutSplitsObj,
  queryInsertUserFinishedWorkout,
  queryWholeUserWorkoutPlan,
  queryWorkoutStatsTopSplitPRAndRecent,
} from "../queries/workoutQueries.js";
import { sendSystemMessageToUserWorkoutDone } from "../services/messagesService.js";

// @desc    Get authenticated user workout (plan, splits, and exercises)
// @route   GET /api/workouts/getworkout
// @access  Private
export const getWholeUserWorkoutPlan = async (req, res) => {
  const userId = req.user.id;

  const rows = await queryWholeUserWorkoutPlan(userId);

  const [plan] = rows;

  if (!plan) {
    return res.status(200).json({ workoutPlan: null });
  }

  const { splits } = await queryGetWorkoutSplitsObj(rows[0].id);

  return res
    .status(200)
    .json({ workoutPlan: plan, workoutPlanForEditWorkout: splits });
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
  await queryInsertUserFinishedWorkout(userId, req.body.workout);
  const et = await queryWorkoutStatsTopSplitPRAndRecent(userId, 45);
  sendSystemMessageToUserWorkoutDone(userId);
  return res.status(200).json(et[0]);
};

// @desc    Delete user's workout
// @route   DELETE /api/workouts/delete
// @access  Private
export const deleteUserWorkout = async (req, res) => {
  const userId = req.user.id;
  await queryDeleteUserWorkout(userId);
  return res.status(204).end();
};

// @desc    Add workout
// @route   POST /api/workouts/add
// @access  Private
export const addWorkout = async (req, res) => {
  const userId = req.user.id;
  const { workoutData, workoutName } = req.body;

  await queryAddWorkout(userId, workoutData, workoutName);
  const [plan] = await queryWholeUserWorkoutPlan(userId);
  const { splits } = await queryGetWorkoutSplitsObj(plan.id);

  return res.status(200).json({
    message: "Workout created successfully!",
    workoutPlan: plan,
    workoutPlanForEditWorkout: splits,
  });
};

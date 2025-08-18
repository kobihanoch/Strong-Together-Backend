import {
  queryAddWorkout,
  queryDeleteUserWorkout,
  queryGetWorkoutSplitsObj,
  queryInsertUserFinishedWorkout,
  queryWholeUserWorkoutPlan,
  queryWorkoutStatsTopSplitPRAndRecent,
} from "../queries/workoutQueries.js";
import { sendSystemMessageToUserWorkoutDone } from "../services/messagesService.js";
import {
  getUserVersion,
  bumpUserVersion,
  buildTrackingKey,
  buildPlanKey,
  cacheGetJSON,
  cacheSetJSON,
  TTL_TRACKING,
  TTL_PLAN,
} from "../utils/cache.js";

// @desc    Get authenticated user workout (plan, splits, and exercises)
// @route   GET /api/workouts/getworkout
// @access  Private
export const getWholeUserWorkoutPlan = async (req, res) => {
  const userId = req.user.id;

  // Try to get data from cache first
  const ver = await getUserVersion(userId);
  const planKey = buildPlanKey(userId, ver);
  const cached = await cacheGetJSON(planKey);
  if (cached) {
    res.set("X-Cache", "HIT");
    return res.status(200).json(cached);
  }

  // Fetch from DB if not in cache and set in cache
  const rows = await queryWholeUserWorkoutPlan(userId);
  const [plan] = rows;
  if (!plan) {
    const empty = { workoutPlan: null };
    await cacheSetJSON(planKey, empty, TTL_PLAN);
    res.set("X-Cache", "MISS");
    return res.status(200).json(empty);
  }

  const { splits } = await queryGetWorkoutSplitsObj(rows[0].id);
  const payload = { workoutPlan: plan, workoutPlanForEditWorkout: splits };

  await cacheSetJSON(planKey, payload, TTL_PLAN);

  res.set("X-Cache", "MISS");
  return res.status(200).json(payload);
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

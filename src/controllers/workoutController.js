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
  buildTrackingKeyStable,
  buildPlanKeyStable,
  cacheGetJSON,
  cacheSetJSON,
  cacheDeleteKey,
  TTL_TRACKING,
  TTL_PLAN,
} from "../utils/cache.js";

// @desc    Get authenticated user workout (plan, splits, and exercises)
// @route   GET /api/workouts/getworkout
// @access  Private
export const getWholeUserWorkoutPlan = async (req, res) => {
  const userId = req.user.id;

  // Try to get data from cache first
  const planKey = buildPlanKeyStable(userId);
  const cached = await cacheGetJSON(planKey);
  if (cached) {
    console.log("Workout Plan is cached!");
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
  const days = 45;

  const key = buildTrackingKeyStable(userId, days);

  const cached = await cacheGetJSON(key);
  if (cached) {
    console.log("Exercise tracking and analysis is cached!");
    res.set("X-Cache", "HIT");
    return res.status(200).json(cached);
  }

  const rows = await queryWorkoutStatsTopSplitPRAndRecent(userId, days);
  const payload = rows[0];

  await cacheSetJSON(key, payload, TTL_TRACKING);

  res.set("X-Cache", "MISS");
  return res.status(200).json(payload);
};

// @desc    Finish user workout
// @route   POST /api/workouts/finishworkout
// @access  Private
export const finishUserWorkout = async (req, res) => {
  const userId = req.user.id;
  await queryInsertUserFinishedWorkout(userId, req.body.workout);

  // Delete current tracking key
  const trackingKey = buildTrackingKeyStable(userId, 45);
  await cacheDeleteKey(trackingKey);

  // Warm new cache (fetch fresh data, set in cache)
  const rows = await queryWorkoutStatsTopSplitPRAndRecent(userId, 45);
  await cacheSetJSON(buildTrackingKeyStable(userId, 45), rows[0], TTL_TRACKING);

  sendSystemMessageToUserWorkoutDone(userId);
  return res.status(200).json(rows[0]);
};

// @desc    Delete user's workout
// @route   DELETE /api/workouts/delete
// @access  Private
export const deleteUserWorkout = async (req, res) => {
  const userId = req.user.id;

  // Remove workout from DB
  await queryDeleteUserWorkout(userId);

  // Delete current plan cache key
  const planKey = buildPlanKeyStable(userId);
  await cacheDeleteKey(planKey);

  // Respond with no content
  return res.status(204).end();
};

// @desc    Add workout
// @route   POST /api/workouts/add
// @access  Private
export const addWorkout = async (req, res) => {
  const userId = req.user.id;
  const { workoutData, workoutName } = req.body;

  // Insert new workout into DB
  await queryAddWorkout(userId, workoutData, workoutName);

  // Delete current plan cache key
  const planKey = buildPlanKeyStable(userId);
  await cacheDeleteKey(planKey);

  // Fetch fresh data from DB
  const [plan] = await queryWholeUserWorkoutPlan(userId);
  const { splits } = await queryGetWorkoutSplitsObj(plan.id);

  const payload = {
    message: "Workout created successfully!",
    workoutPlan: plan,
    workoutPlanForEditWorkout: splits,
  };

  // Warm up new cache under the bumped version
  const newPlanKey = buildPlanKeyStable(userId);
  await cacheSetJSON(
    newPlanKey,
    {
      workoutPlan: plan,
      workoutPlanForEditWorkout: splits,
    },
    TTL_PLAN
  );

  // Respond
  return res.status(200).json(payload);
};

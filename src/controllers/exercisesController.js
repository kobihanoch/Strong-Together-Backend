import sql from "../config/db.js";
import { queryGetExerciseMapByMuscle } from "../queries/exercisesQueries.js";

// @desc    Get all exercises
// @route   GET /api/exercises/getall
// @access  Private
export const getAllExercises = async (req, res) => {
  const data = await queryGetExerciseMapByMuscle();
  return res.status(200).json(data);
};

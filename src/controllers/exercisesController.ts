import { Request, Response } from "express";
import { queryGetExerciseMapByMuscle } from "../queries/exercisesQueries.js";
import { GetAllExercisesResponse } from "../types/api/exercises/responses.ts";

// @desc    Get all exercises
// @route   GET /api/exercises/getall
// @access  Private
export const getAllExercises = async (
  req: Request<{}, GetAllExercisesResponse>,
  res: Response<GetAllExercisesResponse>,
): Promise<Response<GetAllExercisesResponse>> => {
  const data = await queryGetExerciseMapByMuscle();
  return res.status(200).json(data);
};

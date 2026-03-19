import { Request, Response } from "express";
import { queryGetExerciseMapByMuscle } from "../queries/exercisesQueries.js";
import {
  ExercisesMapByMuscle,
  GetAllExercsesResponse,
} from "../types/exercisesTypes.ts";

// @desc    Get all exercises
// @route   GET /api/exercises/getall
// @access  Private
export const getAllExercises = async (
  req: Request<{}, GetAllExercsesResponse>,
  res: Response<GetAllExercsesResponse>,
): Promise<Response<GetAllExercsesResponse>> => {
  const data = (await queryGetExerciseMapByMuscle()) as ExercisesMapByMuscle;
  return res.status(200).json(data);
};

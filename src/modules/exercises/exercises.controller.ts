import { Request, Response } from 'express';
import { getAllExercisesData } from './exercises.service.ts';
import { GetAllExercisesResponse } from '../../shared/types/api/exercises/responses.ts';

/**
 * Get the exercise catalog grouped for workout-building flows.
 *
 * Returns the full exercise map used by the client when composing or editing
 * workout plans.
 *
 * Route: GET /api/exercises/getall
 * Access: User
 */
export const getAllExercises = async (
  req: Request<{}, GetAllExercisesResponse>,
  res: Response<GetAllExercisesResponse>,
): Promise<Response<GetAllExercisesResponse>> => {
  const data = await getAllExercisesData();
  return res.status(200).json(data);
};

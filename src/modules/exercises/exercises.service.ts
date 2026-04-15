import { Injectable } from '@nestjs/common';
import { queryGetExerciseMapByMuscle } from './exercises.queries.ts';
import type { GetAllExercisesResponse } from '@strong-together/shared';

@Injectable()
export class ExercisesService {
  async getAllExercisesData(): Promise<GetAllExercisesResponse> {
    return queryGetExerciseMapByMuscle();
  }
}

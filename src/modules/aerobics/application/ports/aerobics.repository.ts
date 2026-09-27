import type { AerobicActivity } from '../../domain/entities/aerobic-activity';

/** Persistence operations required by aerobics use cases. */
export abstract class AerobicsRepository {
  abstract create(userId: string, activity: AerobicActivity): Promise<AerobicActivity>;
  abstract findByIdForUpdate(userId: string, id: number): Promise<AerobicActivity | undefined>;
  abstract save(userId: string, activity: AerobicActivity): Promise<boolean>;
  abstract delete(userId: string, id: number): Promise<boolean>;
}

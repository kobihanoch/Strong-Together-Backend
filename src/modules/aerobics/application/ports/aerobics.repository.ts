import type { AerobicActivity } from '../../domain/entities/aerobic-activity';

/** Persistence operations required by aerobics use cases. */
export abstract class AerobicsRepository {
  abstract create(activity: AerobicActivity): Promise<AerobicActivity>;
  abstract findByIdForUpdate(id: number): Promise<AerobicActivity | undefined>;
  abstract save(activity: AerobicActivity): Promise<boolean>;
  abstract delete(id: number): Promise<boolean>;
}

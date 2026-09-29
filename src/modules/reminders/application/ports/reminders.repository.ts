import type { ReminderSettings } from '../../domain/entities/reminder-settings';

/** Persistence operations required by reminder-settings use cases. */
export abstract class RemindersRepository {
  abstract findByUserForUpdate(userId: string): Promise<ReminderSettings | undefined>;
  abstract save(settings: ReminderSettings): Promise<void>;
}

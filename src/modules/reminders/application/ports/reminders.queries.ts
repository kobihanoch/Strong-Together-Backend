import type { ReminderSettings } from '../models/reminders.models';

/** Read operations required by application queries. */
export abstract class RemindersQueries {
  abstract findByUser(userId: string): Promise<ReminderSettings | null>;
}

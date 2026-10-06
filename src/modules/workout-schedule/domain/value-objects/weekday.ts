/** Day in a Sunday-through-Saturday weekly schedule. */
export class Weekday {
  private constructor(public readonly value: number) {}

  /** Creates a weekday represented by an integer from zero through six. */
  public static create(value: number): Weekday {
    if (!Number.isInteger(value) || value < 0 || value > 6) throw new InvalidWorkoutScheduleWeekdayError();
    return new Weekday(value);
  }
}
import { InvalidWorkoutScheduleWeekdayError } from '../errors/workout-schedule.errors';

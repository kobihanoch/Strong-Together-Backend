/** Zero-based position used to order workout-plan items. */
export class OrderIndex {
  private constructor(public readonly value: number) {}

  /** Creates an order index when the supplied value is a non-negative integer. */
  public static create(value: number): OrderIndex {
    if (!Number.isInteger(value) || value < 0) throw new InvalidWorkoutOrderError();
    return new OrderIndex(value);
  }
}
import { InvalidWorkoutOrderError } from '../errors/workout-plan.errors';

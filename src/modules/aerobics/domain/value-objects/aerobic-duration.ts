/** Positive aerobic duration represented as minutes and remaining seconds. */
export class AerobicDuration {
  public readonly minutes: number;
  public readonly seconds: number;

  public constructor(minutes: number, seconds: number) {
    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 10_080) {
      throw new InvalidAerobicDurationMinutesError();
    }
    if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
      throw new InvalidAerobicDurationSecondsError();
    }
    if (minutes === 0 && seconds === 0) throw new AerobicDurationRequiredError();

    this.minutes = minutes;
    this.seconds = seconds;
  }
}
import { AerobicDurationRequiredError, InvalidAerobicDurationMinutesError, InvalidAerobicDurationSecondsError } from '../errors/aerobics.errors';

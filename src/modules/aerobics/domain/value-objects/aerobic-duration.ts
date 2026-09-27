/** Positive aerobic duration represented as minutes and remaining seconds. */
export class AerobicDuration {
  public readonly minutes: number;
  public readonly seconds: number;

  public constructor(minutes: number, seconds: number) {
    if (!Number.isInteger(minutes) || minutes < 0 || minutes > 10_080) {
      throw new Error('Aerobic duration minutes must be an integer between 0 and 10080');
    }
    if (!Number.isInteger(seconds) || seconds < 0 || seconds > 59) {
      throw new Error('Aerobic duration seconds must be an integer between 0 and 59');
    }
    if (minutes === 0 && seconds === 0) throw new Error('Aerobic duration must be greater than zero');

    this.minutes = minutes;
    this.seconds = seconds;
  }
}

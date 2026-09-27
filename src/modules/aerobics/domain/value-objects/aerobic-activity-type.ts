/** Normalized name of an aerobic activity. */
export class AerobicActivityType {
  public readonly value: string;

  public constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) throw new AerobicActivityTypeRequiredError();
    if (normalized.length > 50) throw new AerobicActivityTypeTooLongError();
    this.value = normalized;
  }
}
import { AerobicActivityTypeRequiredError, AerobicActivityTypeTooLongError } from '../errors/aerobics.errors';

import { AerobicActivityType } from '../value-objects/aerobic-activity-type';
import { AerobicDuration } from '../value-objects/aerobic-duration';

/** Primitive values used to construct an aerobic entry. */
export interface AerobicEntryValues {
  durationMins: number;
  durationSec: number;
  type: string;
}

/** Aerobic activity recorded with a validated type and positive duration. */
export class AerobicEntry {
  public readonly duration: AerobicDuration;
  public readonly type: AerobicActivityType;

  public constructor(values: AerobicEntryValues) {
    this.duration = new AerobicDuration(values.durationMins, values.durationSec);
    this.type = new AerobicActivityType(values.type);
  }
}

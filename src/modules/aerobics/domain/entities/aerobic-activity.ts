import { AerobicActivityType } from '../value-objects/aerobic-activity-type';
import { AerobicDuration } from '../value-objects/aerobic-duration';

/** Primitive values used to construct an aerobic entry. */
export interface AerobicActivityValues {
  durationMins: number;
  durationSec: number;
  type: string;
}

/** Aerobic activity recorded with a validated type and positive duration. */
export class AerobicActivity {
  public readonly id: number | undefined;
  private currentDuration: AerobicDuration;
  private currentType: AerobicActivityType;

  private constructor(id: number | undefined, values: AerobicActivityValues) {
    this.id = id;
    this.currentDuration = new AerobicDuration(values.durationMins, values.durationSec);
    this.currentType = new AerobicActivityType(values.type);
  }

  public static create(values: AerobicActivityValues): AerobicActivity {
    return new AerobicActivity(undefined, values);
  }

  public static restore(values: AerobicActivityValues & { id: number }): AerobicActivity {
    return new AerobicActivity(values.id, values);
  }

  public get duration(): AerobicDuration {
    return this.currentDuration;
  }

  public get type(): AerobicActivityType {
    return this.currentType;
  }

  public update(values: AerobicActivityValues): void {
    this.currentDuration = new AerobicDuration(values.durationMins, values.durationSec);
    this.currentType = new AerobicActivityType(values.type);
  }
}

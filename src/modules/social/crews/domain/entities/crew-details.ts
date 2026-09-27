import { CrewName } from '../value-objects/crew-name';
import { CrewPrivacy } from '../value-objects/crew-privacy';

/** Primitive values used to define a crew. */
export interface CrewDetailsValues {
  name: string;
  privacy: 'public' | 'private';
}

/** Validated crew properties used for creation and replacement. */
export class CrewDetails {
  public readonly name: CrewName;
  public readonly privacy: CrewPrivacy;

  public constructor(values: CrewDetailsValues) {
    this.name = new CrewName(values.name);
    this.privacy = new CrewPrivacy(values.privacy);
  }
}

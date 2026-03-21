import type { AddAerobicInput } from "../../dto/aerobics.dto.ts";

export interface AddUserAerobicsRequestBody {
  record: AddAerobicInput;
  tz: string;
}

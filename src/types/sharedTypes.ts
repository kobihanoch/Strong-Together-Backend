import type { Request } from "express";
import { AuthenticatedUser } from "./authTypes.ts";

export type AuthenticatedRequest<
  Body = {},
  Params = {},
  Query = {},
  Res = {},
> = Request<Params, Res, Body, Query> & {
  user: AuthenticatedUser;
};

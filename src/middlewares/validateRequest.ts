import type { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import type { ZodType } from 'zod';

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw createError(400, result.error.issues[0]?.message || 'Invalid Input');
    }

    req.body = result.data;
    return next();
  };

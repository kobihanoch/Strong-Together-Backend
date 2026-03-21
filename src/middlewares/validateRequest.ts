import type { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import type { ZodType } from 'zod';

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      throw createError(400, result.error.issues[0]?.message || 'Invalid Input');
    }

    const data = result.data as {
      body?: any;
      query?: any;
      params?: any;
    };

    if (data.body) req.body = data.body;
    if (data.query) req.query = data.query;
    if (data.params) req.params = data.params;
    return next();
  };

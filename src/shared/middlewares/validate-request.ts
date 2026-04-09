import type { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

type ParseSuccess = {
  success: true;
  data: {
    body?: unknown;
    query?: unknown;
    params?: unknown;
  };
};

type ParseFailure = {
  success: false;
  error: {
    issues?: Array<{ message?: string }>;
  };
};

type CompatibleSchema = {
  safeParse(input: unknown): ParseSuccess | ParseFailure;
};

export const validate =
  (schema: CompatibleSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      throw createError(400, result.error.issues?.[0]?.message || 'Invalid Input');
    }

    const data = result.data as {
      body?: any;
      query?: any;
      params?: any;
    };

    if (data.body) req.body = data.body;
    if (data.query) {
      Object.assign(req.query, data.query);
    }
    if (data.params) req.params = data.params;
    return next();
  };

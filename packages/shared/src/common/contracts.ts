import type { z } from 'zod/v4';

export type RequestSchema = z.ZodObject<{
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}>;

export type Contract = {
  request: RequestSchema;
  response: z.ZodTypeAny;
};

export type RequestOf<TContract extends Contract> = z.infer<TContract['request']>;

export type BodyOf<TContract extends Contract> = RequestOf<TContract> extends { body: infer TBody } ? TBody : never;

export type QueryOf<TContract extends Contract> = RequestOf<TContract> extends { query: infer TQuery } ? TQuery : never;

export type ParamsOf<TContract extends Contract> =
  RequestOf<TContract> extends { params: infer TParams } ? TParams : never;

export type ResponseOf<TContract extends Contract> = z.infer<TContract['response']>;

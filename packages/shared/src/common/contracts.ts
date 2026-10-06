import type { z } from 'zod/v4';

/** Represents the request schema value. */
export type RequestSchema = z.ZodObject<{
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}>;

/** Represents the contract value. */
export type Contract = { request: RequestSchema; response?: z.ZodTypeAny } | { request?: RequestSchema; response: z.ZodTypeAny };

/** Represents the request of value. */
export type RequestOf<TContract extends Contract> = TContract extends { request: infer TRequest extends RequestSchema } ? z.infer<TRequest> : never;

/** Represents the body of value. */
export type BodyOf<TContract extends Contract> = RequestOf<TContract> extends { body: infer TBody } ? TBody : never;

/** Represents the query of value. */
export type QueryOf<TContract extends Contract> = RequestOf<TContract> extends { query: infer TQuery } ? TQuery : never;

/** Represents the params of value. */
export type ParamsOf<TContract extends Contract> = RequestOf<TContract> extends { params: infer TParams } ? TParams : never;

/** Represents the response of value. */
export type ResponseOf<TContract extends Contract> = TContract extends {
  response: infer TResponse extends z.ZodTypeAny;
}
  ? z.infer<TResponse>
  : never;

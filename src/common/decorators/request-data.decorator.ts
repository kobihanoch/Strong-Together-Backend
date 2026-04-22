import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestData = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  return {
    body: req.body,
    query: req.query,
    params: req.params,
  };
});

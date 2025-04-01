import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// property decorator
export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request: { user: { id: number } } = context
      .switchToHttp()
      .getRequest();
    const user = request['user'];
    return user;
  },
);

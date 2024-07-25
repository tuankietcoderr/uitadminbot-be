import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities';

export const getCurrentUserByContext = (context: ExecutionContext): User => {
  switch (context.getType()) {
    case 'http':
      return context.switchToHttp().getRequest().user;
    case 'rpc':
      return context.switchToRpc().getData().user;
    case 'ws':
      return context.switchToWs().getData().user;
    default:
      return context.switchToHttp().getRequest().user;
  }
};

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  getCurrentUserByContext(context)
);

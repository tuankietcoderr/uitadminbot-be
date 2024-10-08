import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { ERole } from '../enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }

    if (user.isBanned) {
      return false;
    }

    if (user.role === ERole.SUPER_ADMIN) {
      return true;
    }
    return matchRoles(roles, user.role);
  }
}

function matchRoles(roles: string[], userRole: string): boolean {
  return roles.includes(userRole);
}

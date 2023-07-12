import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Role } from '../enum/role.enum';

/**
 * Roles Guard
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Entry point of Roles Guard
   */
  constructor(private reflector: Reflector) {}

  /**
   * Check Role of the login user and authorize it
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => {
      return (user?.user_type as string).toLowerCase() === role;
    });
  }
}

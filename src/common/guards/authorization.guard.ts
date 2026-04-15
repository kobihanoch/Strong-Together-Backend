import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AppRequest } from '../types/express.ts';

type Role = 'user' | 'admin';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest<AppRequest>();
    const userRole = req.user?.role?.toLowerCase();

    if (!userRole) {
      throw new UnauthorizedException('Unauthenticated');
    }

    if (!allowedRoles?.length) {
      return true;
    }

    if (!allowedRoles.includes(userRole as Role)) {
      throw new ForbiddenException('Unauthorized');
    }

    return true;
  }
}

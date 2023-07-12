import { SetMetadata, UseGuards } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { Role } from '../enum/role.enum';
import { RolesGuard } from 'src/gaurds/roles.guard';

/**
 * Name of key of roles
 */
export const ROLES_KEY = 'roles';

/**
 * Roles decorator to check authentication and authorization
 */
export const Roles = (...roles: Role[]) => {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(JwtAuthGuard, RolesGuard)
    );
}
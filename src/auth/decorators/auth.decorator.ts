import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { ValidRoles } from '../interfaces/valid-roles';

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard(), RolesGuard),
    );
}

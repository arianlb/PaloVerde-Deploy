import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
    if (!validRoles || validRoles.length === 0) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;
    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }
    return false;
  }
}

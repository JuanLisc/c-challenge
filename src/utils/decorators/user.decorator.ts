import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { USER_ROLES } from '../enums/roles';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export interface IAuthUser {
  email: string;
  sub: number;
  role: USER_ROLES;
  iat: number;
  exp: number;
}

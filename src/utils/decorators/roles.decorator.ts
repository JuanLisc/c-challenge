import { SetMetadata } from '@nestjs/common';
import { USER_ROLES } from '../enums/roles';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: USER_ROLES[]) => SetMetadata(ROLES_KEY, roles);

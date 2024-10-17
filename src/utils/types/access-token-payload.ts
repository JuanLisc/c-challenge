import { USER_ROLES } from '../enums/roles';

export type AccessTokenPayload = {
  userId: number;
  email: string;
  role: USER_ROLES;
};

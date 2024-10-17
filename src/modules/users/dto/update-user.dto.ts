import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Match } from 'src/utils/decorators/match.decorator';
import { USER_ROLES } from 'src/utils/enums/roles';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEmail()
  @Match('email')
  confirmEmail: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(USER_ROLES, { message: 'Role must be ADMIN or USER' })
  role: USER_ROLES;
}

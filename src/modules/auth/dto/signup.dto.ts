import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Match } from 'src/utils/decorators/match.decorator';
import { USER_ROLES } from 'src/utils/enums/roles';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
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
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @Match('password')
  confirmPassword: string;

  @IsNotEmpty()
  @IsEnum(USER_ROLES, { message: 'Role must be ADMIN or USER' })
  role: USER_ROLES;
}

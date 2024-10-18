import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';
import { Match } from 'src/utils/decorators/match.decorator';
import { USER_ROLES } from 'src/utils/enums/roles';

export class SignUpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @Match('email')
  confirmEmail: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name can only contain letters and spaces for compound names',
  })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name can only contain letters and spaces for compound names',
  })
  lastName: string;

  @ApiProperty({ example: 'Abcd1234.' })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ example: 'Abcd1234.' })
  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;

  @ApiProperty({
    enum: USER_ROLES,
    example: USER_ROLES.USER,
  })
  @IsNotEmpty()
  @IsEnum(USER_ROLES, { message: 'Role must be ADMIN or USER' })
  role: USER_ROLES;
}

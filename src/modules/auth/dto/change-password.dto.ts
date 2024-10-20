import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { Match } from '../../../utils/decorators/match.decorator';

export class ChangePassDto {
  @ApiProperty({ example: 'Abcd1234.' })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'Dcba5678.' })
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;

  @ApiProperty({ example: 'Dcba5678.' })
  @IsNotEmpty()
  @Match('newPassword')
  confirmPassword: string;
}

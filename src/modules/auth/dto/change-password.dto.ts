import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { Match } from 'src/utils/decorators/match.decorator';

export class ChangePassDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;

  @IsNotEmpty()
  @Match('newPassword')
  confirmPassword: string;
}

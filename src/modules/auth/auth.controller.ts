import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/utils/decorators/public.decorator';
import { SignUpDto } from './dto/signup.dto';
import { ChangePassDto } from './dto/change-password.dto';
import { AccessToken } from 'src/utils/types/access-token';
import { AuthUser, IAuthUser } from 'src/utils/decorators/user.decorator';
import { User } from 'src/models/user.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@AuthUser() user: User): Promise<AccessToken> {
    return this.authService.signIn(user);
  }

  @Public()
  @Post('register')
  async register(@Body() signUp: SignUpDto) {
    return await this.authService.signUp(signUp);
  }

  @Patch('change-password')
  async changePassword(
    @AuthUser() user: IAuthUser,
    @Body() changePassDto: ChangePassDto,
  ): Promise<{ message: string }> {
    const { sub } = user;

    return this.authService.changePassword(+sub, changePassDto);
  }
}

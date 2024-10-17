import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/utils/decorators/public.decorator';
import { SignUpDto } from './dto/signup.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('LOGIN: ', req.user);
    return this.authService.signIn(req.user);
  }

  @Post('register')
  async register(@Body() signUp: SignUpDto) {
    console.log('SIGN UP: ', signUp);
    return await this.authService.signUp(signUp);
  }
}

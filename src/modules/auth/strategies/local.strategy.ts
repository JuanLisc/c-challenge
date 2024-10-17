import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from 'src/models/user.model';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(credentials: LoginDto): Promise<User> {
    console.log('VALIDATE LOCAL STRATEGY: ', credentials);
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

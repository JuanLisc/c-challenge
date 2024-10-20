import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../models/user.model';
import * as bcrypt from 'bcrypt';
import { AccessToken } from '../../utils/types/access-token';
import { SignUpDto } from './dto/signup.dto';
import { ChangePassDto } from './dto/change-password.dto';
import { ResponseMessage } from '../../utils/types/response-message';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    this.logger.debug('StartValidatingUser', { data: { email, pass } });
    const user = await this.usersService.getByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const isPassCorrect: boolean = bcrypt.compareSync(pass, user.password);
    if (!isPassCorrect) throw new UnauthorizedException('Invalid Credentials');

    return user;
  }

  async signIn(user: User): Promise<any> {
    this.logger.debug('StartSigningInUser', { data: { user } });
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(user: SignUpDto): Promise<AccessToken> {
    this.logger.debug('StartSigningUpUser', { data: { user } });
    try {
      const existingUser = await this.usersService.getByEmail(user.email);
      if (existingUser) {
        this.logger.error('EmailAlreadyInUse', {
          data: { emailInUse: user.email },
        });
        throw new BadRequestException('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const { confirmEmail, confirmPassword, ...newUserData } = user;

      const newUser = await this.usersService.create({
        ...newUserData,
        password: hashedPassword,
      });

      return this.signIn(newUser);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Error during sign-up process for email: ${user.email}`,
        { data: JSON.stringify(error) },
      );

      throw new InternalServerErrorException(
        'An error occurred while signing up',
      );
    }
  }

  async changePassword(
    userId: number,
    changePassDto: ChangePassDto,
  ): Promise<ResponseMessage> {
    this.logger.debug('StartChangingPassword', {
      data: { userId, changePassDto },
    });
    try {
      const { currentPassword, newPassword } = changePassDto;
      const loggedUser = await this.usersService.getById(userId);

      const isPassCorrect: boolean = bcrypt.compareSync(
        currentPassword,
        loggedUser.password,
      );
      if (!isPassCorrect)
        throw new BadRequestException('Invalid current password');

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersService.updateOne(userId, { password: hashedPassword });

      return { message: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(`Error during change-password process`, {
        data: JSON.stringify(error),
      });

      throw new InternalServerErrorException(
        'An error occurred while changing password',
      );
    }
  }
}

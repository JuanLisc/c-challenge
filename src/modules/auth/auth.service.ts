import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';
import { AccessToken } from 'src/utils/types/access-token';
import { SignUpDto } from './dto/signup.dto';
import { ChangePassDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.getByEmail(email);
    if (!user) throw new BadRequestException('Invalid Credentials');

    const isPassCorrect: boolean = bcrypt.compareSync(pass, user.password);
    if (!isPassCorrect) throw new BadRequestException('Invalid Credentials');

    return user;
  }

  async signIn(user: User): Promise<any> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(user: SignUpDto): Promise<AccessToken> {
    try {
      const existingUser = await this.usersService.getByEmail(user.email);
      if (existingUser) throw new BadRequestException('Email already in use');

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
        error,
      );

      throw new InternalServerErrorException(
        'An error occurred while signing up',
      );
    }
  }

  async changePassword(
    userId: number,
    changePassDto: ChangePassDto,
  ): Promise<{ message: string }> {
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

      this.logger.error(`Error during change-password process`, error);

      throw new InternalServerErrorException(
        'An error occurred while changing password',
      );
    }
  }
}

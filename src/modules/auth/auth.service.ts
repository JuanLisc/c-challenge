import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user.model';
import * as bcrypt from 'bcrypt';
import { AccessToken } from 'src/utils/types/access-token';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
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
    const existingUser = await this.usersService.getByEmail(user.email);
    if (existingUser) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const { confirmEmail, confirmPassword, ...newUserData } = user;

    const newUser = await this.usersService.create({
      ...newUserData,
      password: hashedPassword,
    });

    return this.signIn(newUser);
  }
}

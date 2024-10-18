import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/utils/decorators/public.decorator';
import { SignUpDto } from './dto/signup.dto';
import { ChangePassDto } from './dto/change-password.dto';
import { AccessToken } from 'src/utils/types/access-token';
import { AuthUser, IAuthUser } from 'src/utils/decorators/user.decorator';
import { User } from 'src/models/user.model';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'src/utils/types/response-message';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'Abcd1234.' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzI5Mjc0Mzk4LCJleHAiOjE3MjkyNzc5OTh9.zYqc8loao4a5sPobSR_qR5NkYrxQ44DcV0t8bhqfE1M',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Credentials',
  })
  async login(@AuthUser() user: User): Promise<AccessToken> {
    return this.authService.signIn(user);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: SignUpDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzI5Mjc0Mzk4LCJleHAiOjE3MjkyNzc5OTh9.zYqc8loao4a5sPobSR_qR5NkYrxQ44DcV0t8bhqfE1M',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed, check input parameters or Email already in use',
    schema: {
      oneOf: [
        {
          example: {
            statusCode: 400,
            message: [
              'email must be an email',
              'password is not strong enough',
            ],
            error: 'Bad Request',
          },
        },
        {
          example: {
            statusCode: 400,
            message: 'Email already in use',
            error: 'Bad Request',
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 500, description: 'Server error' })
  async register(@Body() signUp: SignUpDto): Promise<AccessToken> {
    return this.authService.signUp(signUp);
  }

  @Patch('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePassDto })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      example: {
        message: 'Password changed successfully',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed, check input parameters or Invalid current password',
    schema: {
      oneOf: [
        {
          example: {
            statusCode: 400,
            message: [
              'password is not strong enough',
              "password and confirmPassword don't match",
            ],
            error: 'Bad Request',
          },
        },
        {
          example: {
            statusCode: 400,
            message: 'Invalid current password',
            error: 'Bad Request',
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 500, description: 'Server error' })
  async changePassword(
    @AuthUser() user: IAuthUser,
    @Body() changePassDto: ChangePassDto,
  ): Promise<ResponseMessage> {
    const { sub } = user;

    return this.authService.changePassword(+sub, changePassDto);
  }
}

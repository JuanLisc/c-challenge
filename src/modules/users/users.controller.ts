import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { USER_ROLES } from '../../utils/enums/roles';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../models/user.model';

@UseGuards(RolesGuard)
@Roles(USER_ROLES.ADMIN)
@ApiTags('users')
@ApiBearerAuth()
@ApiResponse({ status: 500, description: 'Server error' })
@ApiResponse({ status: 403, description: 'Forbidden, only ADMIN' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
    schema: { example: { message: 'User with ID X deleted successfully' } },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

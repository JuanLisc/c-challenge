import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { User } from 'src/models/user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userData: CreateUserDto): Promise<User> {
    try {
      return this.usersRepository.create(userData);
    } catch (error) {
      throw new InternalServerErrorException(`Error creating user: ${error}`);
    }
  }

  async getAll(): Promise<User[]> {
    try {
      return this.usersRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException(`Error getting users: ${error}`);
    }
  }

  async getById(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findById(id);

      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error getting user: ${error}`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const userToUpdate = await this.getById(id);

      return userToUpdate.update(updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException(`Error updating user: ${error}`);
    }
  }

  async remove(id: number) {
    try {
      await this.getById(id);

      await this.usersRepository.delete(id);

      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting user: ${error}`);
    }
  }
}

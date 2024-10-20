import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../../models/user.model';
import { ResponseMessage } from '../../utils/types/response-message';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userData: Partial<User>): Promise<User> {
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
    let user: User | null = null;
    try {
      user = await this.usersRepository.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(`Error getting user: ${error}`);
    }

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async getByEmail(email: string): Promise<User> {
    try {
      return this.usersRepository.findOneByQuery({ email });
    } catch (error) {
      throw new InternalServerErrorException(`Error getting user: ${error}`);
    }
  }

  async updateOne(id: number, updateData: Partial<User>): Promise<User> {
    try {
      const [length, affectedRows] = await this.usersRepository.update(
        { id },
        updateData,
      );

      if (length === 0)
        throw new NotFoundException(`User with ID ${id} not found`);

      return affectedRows[0];
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error updating user: ${error}`);
    }
  }

  async remove(id: number): Promise<ResponseMessage> {
    try {
      const result = await this.usersRepository.delete(id);

      if (result === 0)
        throw new NotFoundException(`User with ID ${id} not found`);

      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Error deleting user: ${error}`);
    }
  }
}

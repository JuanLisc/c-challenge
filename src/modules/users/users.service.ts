import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from 'src/models/user.model';

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

      return affectedRows[0];
    } catch (error) {
      throw new InternalServerErrorException(`Error updating user: ${error}`);
    }
  }

  async remove(id: number) {
    await this.getById(id);
    try {
      // Uso el repository en este caso, pero podria hacerlo de la misma manera que en el update
      await this.usersRepository.delete(id);
      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting user: ${error}`);
    }
  }
}

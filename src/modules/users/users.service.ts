import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
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
    return await this.usersRepository.findOneByQuery({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const userToUpdate = await this.getById(id);

      // En este caso hago uso directamente del user obtenido a partir del getById, sin necesidad de usar el repository
      return userToUpdate.update(updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException(`Error updating user: ${error}`);
    }
  }

  async remove(id: number) {
    try {
      await this.getById(id);

      // Uso el repository en este caso, pero podria hacerlo de la misma manera que en el update
      const userDeleted = await this.usersRepository.delete(id);
      console.log(userDeleted);
      return { message: `User with ID ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting user: ${error}`);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/user-repository.interface';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async create(user: Partial<User>): Promise<User> {
    return this.userModel.create({ ...user });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }

  async update(id: number, user: Partial<User>): Promise<[number, User[]]> {
    return this.userModel.update(user, { where: { id }, returning: true });
  }

  async delete(id: number): Promise<number> {
    return this.userModel.destroy({ where: { id } });
  }
}

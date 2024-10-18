import { WhereOptions } from 'sequelize';
import { User } from 'src/models/user.model';

export interface IUserRepository {
  create(userToCreate: Partial<User>): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  findOneByQuery(whereOptions: WhereOptions<User>): Promise<User>;
  update(
    whereOptions: WhereOptions<User>,
    userToUpdate: Partial<User>,
  ): Promise<[number, User[]]>;
  delete(id: number): Promise<number>;
}

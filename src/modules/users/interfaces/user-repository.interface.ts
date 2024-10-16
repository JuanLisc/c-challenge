import { User } from 'src/models/user.model';

export interface IUserRepository {
  create(userToCreate: Partial<User>): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  findByEmail(id: string): Promise<User>;
  update(id: number, userToUpdate: Partial<User>): Promise<[number, User[]]>;
  delete(id: number): Promise<number>;
}

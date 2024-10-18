import { WhereOptions } from 'sequelize';
import { Film } from 'src/models/film.model';

export interface IFilmRepository {
  create(filmToCreate: Partial<Film>): Promise<Film>;
  bulkCreate(films: Partial<Film>[]): Promise<Film[]>;
  findAll(): Promise<Film[]>;
  findById(id: number): Promise<Film>;
  findOneByQuery(whereOptions: WhereOptions<Film>): Promise<Film>;
  update(id: number, filmToUpdate: Partial<Film>): Promise<[number, Film[]]>;
  delete(id: number): Promise<number>;
}

export interface IBaseRepository<T> {
  create(instanceToCreate: Partial<T>): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T>;
  findOneByQuery(whereOptions: WhereOptions<T>): Promise<T>;
  update(id: number, instanceToUpdate: Partial<T>): Promise<[number, T[]]>;
  delete(id: number): Promise<number>;
}

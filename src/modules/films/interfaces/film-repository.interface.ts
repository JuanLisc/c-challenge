import {
  DestroyOptions,
  FindOptions,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { Film } from '../../../models/film.model';

export interface IFilmRepository {
  create(filmToCreate: Partial<Film>): Promise<Film>;
  bulkCreate(
    films: Partial<Film>[],
    transaction?: Transaction,
  ): Promise<Film[]>;
  findAll(options?: FindOptions<Film>): Promise<Film[]>;
  findById(id: number): Promise<Film>;
  findOneByQuery(whereOptions: WhereOptions<Film>): Promise<Film>;
  update(
    whereOptions: WhereOptions<Film>,
    filmToUpdate: Partial<Film>,
  ): Promise<[number, Film[]]>;
  delete(
    whereOptions: WhereOptions<Film>,
    destroyOptions?: DestroyOptions<Film>,
  ): Promise<number>;
}

export interface IBaseRepository<T> {
  create(instanceToCreate: Partial<T>): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T>;
  findOneByQuery(whereOptions: WhereOptions<T>): Promise<T>;
  update(id: number, instanceToUpdate: Partial<T>): Promise<[number, T[]]>;
  delete(id: number): Promise<number>;
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  DestroyOptions,
  FindOptions,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { IFilmRepository } from './interfaces/film-repository.interface';
import { Film } from '../../models/film.model';

@Injectable()
export class FilmsRepository implements IFilmRepository {
  constructor(@InjectModel(Film) private readonly filmModel: typeof Film) {}

  async create(film: Partial<Film>): Promise<Film> {
    return this.filmModel.create({ ...film });
  }

  async bulkCreate(
    films: Partial<Film>[],
    transaction?: Transaction,
  ): Promise<Film[]> {
    return this.filmModel.bulkCreate(films, {
      ignoreDuplicates: true,
      transaction,
    });
  }

  async findAll(options?: FindOptions<Film>): Promise<Film[]> {
    return this.filmModel.findAll(options);
  }

  async findOneByQuery(whereOptions: WhereOptions<Film>): Promise<Film> {
    return this.filmModel.findOne({ where: whereOptions });
  }

  async findById(id: number): Promise<Film> {
    return this.filmModel.findByPk(id);
  }

  async update(
    whereOptions: WhereOptions<Film>,
    film: Partial<Film>,
  ): Promise<[number, Film[]]> {
    return this.filmModel.update(film, {
      where: whereOptions,
      returning: true,
    });
  }

  async delete(
    whereOptions: WhereOptions<Film>,
    destroyOptions?: DestroyOptions<Film>,
  ): Promise<number> {
    return this.filmModel.destroy({ where: whereOptions, ...destroyOptions });
  }
}

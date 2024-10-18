import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';
import { IFilmRepository } from './interfaces/film-repository.interface';
import { Film } from 'src/models/film.model';

@Injectable()
export class FilmsRepository implements IFilmRepository {
  constructor(@InjectModel(Film) private readonly filmModel: typeof Film) {}

  async create(film: Partial<Film>): Promise<Film> {
    return this.filmModel.create({ ...film });
  }

  async bulkCreate(films: Partial<Film>[]): Promise<Film[]> {
    return this.filmModel.bulkCreate(films, { ignoreDuplicates: true });
  }

  async findAll(): Promise<Film[]> {
    return this.filmModel.findAll();
  }

  async findOneByQuery(whereOptions: WhereOptions<Film>): Promise<Film> {
    return this.filmModel.findOne({ where: whereOptions });
  }

  async findById(id: number): Promise<Film> {
    return this.filmModel.findByPk(id);
  }

  async update(id: number, film: Partial<Film>): Promise<[number, Film[]]> {
    return this.filmModel.update(film, { where: { id }, returning: true });
  }

  async delete(id: number): Promise<number> {
    return this.filmModel.destroy({ where: { id } });
  }
}

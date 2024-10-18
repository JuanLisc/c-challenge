import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsRepository } from './films.repository';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Film } from 'src/models/film.model';
import { camelCase, mapKeys } from 'lodash';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class FilmsService {
  private starWarsFilmsUrl: string;

  constructor(
    private readonly filmsRepository: FilmsRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.starWarsFilmsUrl = this.configService.get<string>(
      'STAR_WARS_FILMS_URL',
    );
  }

  async syncFilms(): Promise<void> {
    try {
      const { data } = await this.httpService.axiosRef.get(
        this.starWarsFilmsUrl,
      );
      const transformedFilms = data.results.map((film) =>
        mapKeys(film, (value, key) => camelCase(key)),
      );

      await this.filmsRepository.bulkCreate(transformedFilms);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error Synchronizing films: ${error}`,
      );
    }
  }

  async create(createFilmDto: CreateFilmDto): Promise<Film> {
    const whereOptions = {
      [Op.or]: [
        { title: createFilmDto.title },
        { episodeId: createFilmDto.episodeId },
      ],
    };
    const filmExists = await this.getOne(whereOptions);
    if (filmExists) throw new BadRequestException('This film already exists');

    try {
      return this.filmsRepository.create(createFilmDto);
    } catch (error) {
      throw new InternalServerErrorException(`Error creating film: ${error}`);
    }
  }

  async getAll(): Promise<Film[]> {
    try {
      return this.filmsRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException(`Error getting films: ${error}`);
    }
  }

  async getById(id: number): Promise<Film> {
    let film: Film | null = null;
    try {
      film = await this.filmsRepository.findById(id);
    } catch (error) {
      throw new InternalServerErrorException(`Error getting film: ${error}`);
    }

    if (!film) throw new NotFoundException(`Film with ID ${id} not found`);
    return film;
  }

  async getOne(whereOptions: WhereOptions<Film>): Promise<Film> {
    try {
      return this.filmsRepository.findOneByQuery(whereOptions);
    } catch (error) {
      throw new InternalServerErrorException(`Error getting film: ${error}`);
    }
  }

  async update(id: number, updateFilmDto: UpdateFilmDto): Promise<Film> {
    const filmToUpdate = await this.getById(id);

    try {
      return filmToUpdate.update(updateFilmDto);
    } catch (error) {
      throw new InternalServerErrorException(`Error updating film: ${error}`);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.getById(id);

    try {
      await this.filmsRepository.delete(id);

      return { message: `Film with ID ${id} deleted successfully` };
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting film: ${error}`);
    }
  }
}

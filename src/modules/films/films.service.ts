import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsRepository } from './films.repository';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Film } from '../../models/film.model';
import { camelCase, mapKeys } from 'lodash';
import { WhereOptions } from 'sequelize';
import { ResponseMessage } from '../../utils/types/response-message';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);
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

  async syncFilms(): Promise<ResponseMessage> {
    this.logger.debug('StartSynchronizingFilms');
    try {
      this.logger.debug('AboutToFindAllFilmsInDb');
      const filmsInDb = await this.filmsRepository.findAll({ paranoid: false });

      const filmsMap = new Map<number, Film>(
        filmsInDb.map((film) => [film.episodeId, film]),
      );

      this.logger.debug('AboutToGetAllFilmsInStarWarsAPI', {
        filmsURL: this.starWarsFilmsUrl,
      });
      const { data } = await this.httpService.axiosRef.get(
        this.starWarsFilmsUrl,
      );

      const transformedFilms = data.results.map((film) =>
        mapKeys(film, (value, key) => camelCase(key)),
      );

      const newFilms = transformedFilms.filter(
        (film: Film) => !filmsMap.has(film.episodeId),
      );

      if (newFilms.length === 0) {
        return { message: 'No new films to synchronize' };
      }

      this.logger.debug('AboutToCreateNewFilmsInDb');
      await this.filmsRepository.bulkCreate(newFilms);

      return { message: 'Films successfully synchronized' };
    } catch (error) {
      this.logger.error('ErrorSynchronizingFilms', {
        data: JSON.stringify(error),
      });
      throw new InternalServerErrorException(
        `Error Synchronizing films: ${error}`,
      );
    }
  }

  async create(createFilmDto: CreateFilmDto): Promise<Film> {
    this.logger.debug('StartCreatingFilm', { data: { createFilmDto } });
    const filmExists = await this.getByQuery({
      episodeId: createFilmDto.episodeId,
    });

    if (filmExists) throw new BadRequestException('This film already exists');

    try {
      return this.filmsRepository.create(createFilmDto);
    } catch (error) {
      this.logger.error('ErrorCreatingFilm', {
        data: JSON.stringify(error),
      });
      throw new InternalServerErrorException(`Error creating film: ${error}`);
    }
  }

  async getAll(): Promise<Film[]> {
    this.logger.debug('StartFindingAllFilms');
    try {
      return this.filmsRepository.findAll();
    } catch (error) {
      this.logger.error('ErrorFindingAllFilms', {
        data: JSON.stringify(error),
      });
      throw new InternalServerErrorException(`Error getting films: ${error}`);
    }
  }

  async getById(id: number): Promise<Film> {
    this.logger.debug('StartFindingFilmById', { data: { id } });
    let film: Film | null = null;
    try {
      film = await this.filmsRepository.findById(id);
    } catch (error) {
      this.logger.error('ErrorFindingFilmById', {
        data: JSON.stringify(error),
      });
      throw new InternalServerErrorException(`Error getting film: ${error}`);
    }

    if (!film) throw new NotFoundException(`Film with ID ${id} not found`);
    return film;
  }

  async getByQuery(whereOptions: WhereOptions<Film>): Promise<Film> {
    this.logger.debug('StartFindingFilmByQuery', { data: { whereOptions } });
    try {
      return this.filmsRepository.findOneByQuery(whereOptions);
    } catch (error) {
      this.logger.error('ErrorFindingFilmByQuery', {
        data: JSON.stringify(error),
      });
      throw new InternalServerErrorException(`Error getting film: ${error}`);
    }
  }

  async updateOne(id: number, updateFilmDto: UpdateFilmDto): Promise<Film> {
    this.logger.debug('StartUpdatingFilm', { data: { id, updateFilmDto } });
    try {
      const [length, affectedRows] = await this.filmsRepository.update(
        { id },
        updateFilmDto,
      );

      if (length === 0) {
        this.logger.error('FilmNotFound', {
          data: { id },
        });
        throw new NotFoundException(`Film with ID ${id} not found`);
      }

      return affectedRows[0];
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error('ErrorUpdatingFilm', {
        data: JSON.stringify(error),
      });
      throw new InternalServerErrorException(`Error updating film: ${error}`);
    }
  }

  async remove(id: number): Promise<ResponseMessage> {
    this.logger.debug('StarDeletingFilm', { data: { id } });
    try {
      const result = await this.filmsRepository.delete({ id });

      if (result === 0) {
        this.logger.error('FilmNotFound', {
          data: { id },
        });
        throw new NotFoundException(`Film with ID ${id} not found`);
      }

      return { message: `Film with ID ${id} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.error('ErrorDeletingFilm', {
        data: JSON.stringify(error),
      });
      throw new InternalServerErrorException(`Error deleting film: ${error}`);
    }
  }
}

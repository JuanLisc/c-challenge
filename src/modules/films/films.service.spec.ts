import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from './films.repository';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Film } from '../../models/film.model';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { ResponseMessage } from 'src/utils/types/response-message';

describe('FilmsService', () => {
  let service: FilmsService;
  let filmsRepository: FilmsRepository;
  let httpService: HttpService;
  let filmAttributes: Partial<Film>;

  const mockFilmsRepository = {
    create: jest.fn(),
    bulkCreate: jest.fn(),
    findAll: jest.fn(),
    findOneByQuery: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockHttpService = {
    axiosRef: {
      get: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('http://mock-swapi-url.com'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        { provide: FilmsRepository, useValue: mockFilmsRepository },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    filmsRepository = module.get<FilmsRepository>(FilmsRepository);
    httpService = module.get<HttpService>(HttpService);
  });

  beforeAll(async () => {
    filmAttributes = {
      title: 'A New Hope',
      episodeId: 4,
      openingCrawl:
        'It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.',
      director: 'George Lucas',
      producer: 'Gary Kurtz, Rick McCallum',
      releaseDate: new Date('1977-05-25'),
    };
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncFilms', () => {
    it('should synchronize new films successfully', async () => {
      const mockFilmsInDb: Film[] = [
        { episodeId: 1, title: 'A New Hope' },
      ] as Film[];
      const mockApiResponse = {
        data: {
          results: [
            { episode_id: 1, title: 'A New Hope' },
            { episode_id: 2, title: 'The Empire Strikes Back' },
            { episode_id: 3, title: 'Return of the Jedi' },
          ],
        },
      };
      const transformedFilms = [
        { episodeId: 1, title: 'A New Hope' },
        { episodeId: 2, title: 'The Empire Strikes Back' },
        { episodeId: 3, title: 'Return of the Jedi' },
      ];
      const newFilms = [
        { episodeId: 2, title: 'The Empire Strikes Back' },
        { episodeId: 3, title: 'Return of the Jedi' },
      ];

      mockFilmsRepository.findAll.mockResolvedValue(mockFilmsInDb);
      mockHttpService.axiosRef.get.mockResolvedValue(mockApiResponse);

      const result = await service.syncFilms();

      expect(filmsRepository.findAll).toHaveBeenCalledWith({ paranoid: false });
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'http://mock-swapi-url.com',
      );
      expect(filmsRepository.bulkCreate).toHaveBeenCalledWith(newFilms);
      expect(result).toEqual({ message: 'Films successfully synchronized' });
    });

    it('should return "No new films to synchronize" if there are no new films', async () => {
      const mockFilmsInDb: Film[] = [
        { episodeId: 1, title: 'A New Hope' },
        { episodeId: 2, title: 'The Empire Strikes Back' },
      ] as Film[];
      const mockApiResponse = {
        data: {
          results: [
            { episode_id: 1, title: 'A New Hope' },
            { episode_id: 2, title: 'The Empire Strikes Back' },
          ],
        },
      };

      mockFilmsRepository.findAll.mockResolvedValue(mockFilmsInDb);
      mockHttpService.axiosRef.get.mockResolvedValue(mockApiResponse);

      const result = await service.syncFilms();

      expect(filmsRepository.findAll).toHaveBeenCalledWith({ paranoid: false });
      expect(httpService.axiosRef.get).toHaveBeenCalledWith(
        'http://mock-swapi-url.com',
      );
      expect(filmsRepository.bulkCreate).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'No new films to synchronize' });
    });

    // This case could occur in any of the methods
    it('should throw an InternalServerErrorException on error', async () => {
      mockFilmsRepository.findAll.mockRejectedValue(
        new Error('Database error'),
      );

      try {
        await service.syncFilms();
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual(
          'Error Synchronizing films: Error: Database error',
        );
      }
    });
  });

  describe('Create', () => {
    it('should create a new film successfully', async () => {
      const createdFilm: Film = {
        id: 1,
        ...filmAttributes,
      } as Film;

      mockFilmsRepository.findOneByQuery.mockResolvedValue(null);

      mockFilmsRepository.create.mockResolvedValue(createdFilm);

      const result = await service.create(filmAttributes as CreateFilmDto);

      expect(mockFilmsRepository.create).toHaveBeenCalledWith(filmAttributes);
      expect(result.title).toBe(createdFilm.title);
    });

    it('should throw BadRequestException if the film already exists', async () => {
      const existingFilm: Film = {
        id: 1,
        ...filmAttributes,
      } as Film;

      mockFilmsRepository.findOneByQuery.mockResolvedValue(existingFilm);

      try {
        await service.create(filmAttributes as CreateFilmDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('This film already exists');
      }
    });
  });

  describe('GetAll', () => {
    it('should return all films successfully', async () => {
      const films: Film[] = [
        {
          id: 1,
          ...filmAttributes,
          episodeId: 5,
        } as Film,
        {
          id: 2,
          ...filmAttributes,
          episodeId: 6,
        } as Film,
      ];

      mockFilmsRepository.findAll.mockResolvedValue(films);

      const result = await service.getAll();

      expect(result).toEqual(films);
      expect(mockFilmsRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GetById', () => {
    it('should return the film when found by ID', async () => {
      const film: Film = {
        id: 1,
        ...filmAttributes,
      } as Film;

      mockFilmsRepository.findById.mockResolvedValue(film);

      const result = await service.getById(1);

      expect(mockFilmsRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(film);
    });

    it('should throw NotFoundException when film is not found', async () => {
      mockFilmsRepository.findById.mockResolvedValue(null);

      try {
        await service.getById(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Film with ID 1 not found');
      }
    });
  });

  describe('GetByQuery', () => {
    it('should return the film when found by Query', async () => {
      const film: Film = {
        id: 1,
        ...filmAttributes,
      } as Film;

      mockFilmsRepository.findById.mockResolvedValue(film);

      const result = await service.getById(film.episodeId);

      expect(mockFilmsRepository.findById).toHaveBeenCalledWith(film.episodeId);
      expect(result).toEqual(film);
    });
  });

  describe('UpdateOne', () => {
    it('should update and return the film when the update is successful', async () => {
      const updateFilmDto: UpdateFilmDto = {
        ...filmAttributes,
        title: 'Updated Title',
        director: 'Updated Director',
      } as UpdateFilmDto;

      const updatedFilm: Film = {
        id: 1,
        ...filmAttributes,
        title: 'Updated Title',
        director: 'Updated Director',
      } as Film;

      mockFilmsRepository.update.mockResolvedValue([1, [updatedFilm]]);

      const result = await service.updateOne(1, updateFilmDto);

      expect(mockFilmsRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        updateFilmDto,
      );
      expect(result).toEqual(updatedFilm);
    });

    it('should throw NotFoundException when no films are updated', async () => {
      mockFilmsRepository.update.mockResolvedValue([0, []]);

      try {
        await service.updateOne(999, filmAttributes as UpdateFilmDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('Film with ID 999 not found');
      }
    });
  });

  describe('Remove', () => {
    it('should delete the film and return a success message when deletion is successful', async () => {
      mockFilmsRepository.delete.mockResolvedValue(1);

      const result: ResponseMessage = await service.remove(1);

      expect(mockFilmsRepository.delete).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual({
        message: 'Film with ID 1 deleted successfully',
      });
    });
  });
});

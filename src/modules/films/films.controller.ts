import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Film } from '../../models/film.model';
import { Public } from '../../utils/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../utils/decorators/roles.decorator';
import { USER_ROLES } from '../../utils/enums/roles';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from '../../utils/types/response-message';

@UseGuards(RolesGuard)
@ApiTags('films')
@ApiResponse({ status: 500, description: 'Server error' })
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Roles(USER_ROLES.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new film' })
  @ApiBody({ type: CreateFilmDto })
  @ApiResponse({
    status: 201,
    description: 'Film created successfully',
    type: Film,
  })
  @ApiResponse({
    status: 400,
    description:
      'Film already exists or Validation failed, check input parameters',
    schema: {
      oneOf: [
        {
          example: {
            statusCode: 400,
            message: [
              'episodeId must be a number conforming to the specified constraints',
            ],
            error: 'Bad Request',
          },
        },
        {
          example: {
            statusCode: 400,
            message: 'Film already exists',
            error: 'Bad Request',
          },
        },
      ],
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden, only ADMIN' })
  create(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
    return this.filmsService.create(createFilmDto);
  }

  @Roles(USER_ROLES.ADMIN)
  @Post('sync')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Synchronize films from an external API' })
  @ApiResponse({
    status: 200,
    description: 'Films synchronized successfully',
    schema: {
      example: {
        message: 'Films synchronized successfully',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden, only ADMIN' })
  syncFilms(): Promise<ResponseMessage> {
    return this.filmsService.syncFilms();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get a list of all films' })
  @ApiResponse({ status: 200, description: 'List of films', type: [Film] })
  findAll(): Promise<Film[]> {
    return this.filmsService.getAll();
  }

  // CHallenge says that only regular users should have access to this endpoint,
  // I think admins should have it too
  @Roles(USER_ROLES.USER)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a film by ID' })
  @ApiParam({ name: 'id', description: 'ID of the film' })
  @ApiResponse({ status: 200, description: 'Film details', type: Film })
  @ApiResponse({ status: 403, description: 'Forbidden, only USER' })
  @ApiResponse({ status: 404, description: 'Film not found' })
  findOne(@Param('id') id: string): Promise<Film> {
    return this.filmsService.getById(+id);
  }

  @Roles(USER_ROLES.ADMIN)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a film by ID' })
  @ApiParam({ name: 'id', description: 'ID of the film' })
  @ApiBody({ type: UpdateFilmDto })
  @ApiResponse({
    status: 200,
    description: 'Film updated successfully',
    type: Film,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed. Check input parameters.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'episodeId must be a number conforming to the specified constraints',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden, only ADMIN' })
  @ApiResponse({ status: 404, description: 'Film not found' })
  update(
    @Param('id') id: string,
    @Body() updateFilmDto: UpdateFilmDto,
  ): Promise<Film> {
    return this.filmsService.updateOne(+id, updateFilmDto);
  }

  @Roles(USER_ROLES.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a film by ID' })
  @ApiParam({ name: 'id', description: 'ID of the film' })
  @ApiResponse({
    status: 200,
    description: 'Film deleted successfully',
    schema: { example: { message: 'Film with ID X deleted successfully' } },
  })
  @ApiResponse({ status: 403, description: 'Forbidden, only ADMIN' })
  @ApiResponse({ status: 404, description: 'Film not found' })
  remove(@Param('id') id: string): Promise<ResponseMessage> {
    return this.filmsService.remove(+id);
  }
}

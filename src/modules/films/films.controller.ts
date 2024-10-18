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
import { Film } from 'src/models/film.model';
import { Public } from 'src/utils/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { USER_ROLES } from 'src/utils/enums/roles';

@UseGuards(RolesGuard)
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Roles(USER_ROLES.ADMIN)
  @Post()
  create(@Body() createFilmDto: CreateFilmDto): Promise<Film> {
    return this.filmsService.create(createFilmDto);
  }

  @Roles(USER_ROLES.ADMIN)
  @Get('sync')
  syncFilms(): Promise<void> {
    return this.filmsService.syncFilms();
  }

  @Public()
  @Get()
  findAll(): Promise<Film[]> {
    return this.filmsService.getAll();
  }

  // El challenge dice que solo los Usuarios regulares deberian tener acceso a este endpoint,
  // pienso que los administradores tambien deberian
  @Roles(USER_ROLES.USER)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Film> {
    return this.filmsService.getById(+id);
  }

  @Roles(USER_ROLES.ADMIN)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFilmDto: UpdateFilmDto,
  ): Promise<Film> {
    return this.filmsService.update(+id, updateFilmDto);
  }

  @Roles(USER_ROLES.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.filmsService.remove(+id);
  }
}

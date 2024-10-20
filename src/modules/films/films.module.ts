import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from '../../models/film.model';
import { FilmsRepository } from './films.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [SequelizeModule.forFeature([Film]), HttpModule],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
})
export class FilmsModule {}

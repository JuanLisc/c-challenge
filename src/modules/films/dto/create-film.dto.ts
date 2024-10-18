import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFilmDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  episodeId: number;

  @IsNotEmpty()
  @IsString()
  openingCrawl: string;

  @IsNotEmpty()
  @IsString()
  director: string;

  @IsNotEmpty()
  @IsString()
  producer: string;

  @IsNotEmpty()
  @IsISO8601()
  releaseDate: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characters?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  planets?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  starships?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vehicles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  species?: string[];

  @IsOptional()
  @IsString()
  url?: string;
}

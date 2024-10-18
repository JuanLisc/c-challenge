import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFilmDto {
  @ApiProperty({ example: 'The Force Awakens' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 7 })
  @IsNotEmpty()
  @IsNumber()
  episodeId: number;

  @ApiProperty({
    example:
      'Luke Skywalker has vanished.In his absence, the sinister FIRST ORDER has risen from the ashes of the Empire...',
  })
  @IsNotEmpty()
  @IsString()
  openingCrawl: string;

  @ApiProperty({ example: 'Jeffrey Jacob Abrams' })
  @IsNotEmpty()
  @IsString()
  director: string;

  @ApiProperty({ example: 'Kathleen Kennedy' })
  @IsNotEmpty()
  @IsString()
  producer: string;

  @ApiProperty({ example: '2015-12-18' })
  @IsNotEmpty()
  @IsISO8601()
  releaseDate: Date;

  @ApiPropertyOptional({
    type: [String],
    example: ['Kylo Ren', 'Rey'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characters?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Jakku', 'Takodana'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  planets?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Millennium Falcon'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  starships?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Sand Crawler'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  vehicles?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Human', 'Wookie'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  species?: string[];

  @IsOptional()
  @IsString()
  url?: string;
}

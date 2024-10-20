import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table, Unique } from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'films',
  underscored: true,
})
export class Film extends Model {
  @ApiProperty({ example: 'A New Hope' })
  @Column({ type: DataType.STRING, allowNull: false })
  public title: string;

  @ApiProperty({ example: 4 })
  @Unique(true)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public episodeId: number;

  @ApiProperty({
    example:
      'It is a period of civil war. Rebel spaceships, striking from a hidden base...',
  })
  @Column({ type: DataType.TEXT, allowNull: false })
  public openingCrawl: string;

  @ApiProperty({ example: 'George Lucas' })
  @Column({ type: DataType.STRING, allowNull: false })
  public director: string;

  @ApiProperty({ example: 'Gary Kurtz, Rick McCallum' })
  @Column({ type: DataType.STRING, allowNull: false })
  public producer: string;

  @ApiProperty({ example: '1977-05-24' })
  @Column({ type: DataType.DATE, allowNull: false })
  public releaseDate: Date;

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.dev/api/people/1/',
      'https://swapi.dev/api/people/2/',
    ],
  })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  public characters: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.dev/api/planets/1/',
      'https://swapi.dev/api/planets/2/',
    ],
  })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  public planets: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.dev/api/starships/2/',
      'https://swapi.dev/api/starships/3/',
    ],
  })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  public starships: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.dev/api/vehicles/4/',
      'https://swapi.dev/api/vehicles/6/',
    ],
  })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  public vehicles: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.dev/api/species/1/',
      'https://swapi.dev/api/species/2/',
    ],
  })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  public species: string[];

  @ApiProperty({ example: 'https://swapi.dev/api/films/1/' })
  @Column({ type: DataType.STRING })
  public url: string;
}

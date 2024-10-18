import { Column, DataType, Model, Table, Unique } from 'sequelize-typescript';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'films',
  underscored: true,
})
export class Film extends Model {
  @Unique(true)
  @Column({ type: DataType.STRING, allowNull: false })
  public title: string;

  @Unique(true)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public episodeId: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  public openingCrawl: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public director: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public producer: string;

  @Column({ type: DataType.DATE, allowNull: false })
  public releaseDate: Date;

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  public characters: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  public planets: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  public starships: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  public vehicles: string[];

  @Column({ type: DataType.ARRAY(DataType.STRING) })
  public species: string[];

  @Column({ type: DataType.STRING })
  public url: string;
}

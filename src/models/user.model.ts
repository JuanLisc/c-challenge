import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Role } from './role.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'users',
  underscored: true,
})
export class User extends Model {
  @Unique(true)
  @Column({ type: DataType.STRING, allowNull: false })
  public email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public lastName: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
  public roleId: number;
}

import { Table, Column, DataType, Model, HasMany } from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'roles',
  underscored: true,
})
export class Role extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

  @HasMany(() => User)
  public users?: User[];
}

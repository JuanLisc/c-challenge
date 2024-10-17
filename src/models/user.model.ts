import { Column, DataType, Model, Table, Unique } from 'sequelize-typescript';
import { USER_ROLES } from 'src/utils/enums/roles';

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

  @Column({
    type: DataType.ENUM(...Object.values(USER_ROLES)),
    allowNull: false,
    defaultValue: USER_ROLES.USER,
  })
  public role: USER_ROLES;
}

import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table, Unique } from 'sequelize-typescript';
import { USER_ROLES } from 'src/utils/enums/roles';

@Table({
  timestamps: true,
  paranoid: true,
  tableName: 'users',
  underscored: true,
})
export class User extends Model {
  @ApiProperty({ example: 'user@example.com' })
  @Unique(true)
  @Column({ type: DataType.STRING, allowNull: false })
  public email: string;

  @ApiProperty({
    example: '$2b$10$QpIp7d1JNMVCVc960ONFk.0b1rzpSY16FzpOIDOkBRd3cMByalnOu',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  public password: string;

  @ApiProperty({ example: 'John' })
  @Column({ type: DataType.STRING, allowNull: false })
  public firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Column({ type: DataType.STRING, allowNull: false })
  public lastName: string;

  @ApiProperty({
    example: 'USER',
    enum: USER_ROLES,
    description: 'User role can be either ADMIN or USER',
  })
  @Column({
    type: DataType.ENUM(...Object.values(USER_ROLES)),
    allowNull: false,
    defaultValue: USER_ROLES.USER,
  })
  public role: USER_ROLES;
}

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import Category from './Category';

interface UserPreferenceAttributes {
  id?: number;
  userId: number;
  categoryId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserPreferenceCreationAttributes extends UserPreferenceAttributes {}

class UserPreference extends Model<UserPreferenceAttributes, UserPreferenceCreationAttributes> implements UserPreferenceAttributes {
  public id!: number;
  public userId!: number;
  public categoryId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserPreference.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'user_preferences',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'categoryId'],
      },
    ],
  }
);

// Relaciones
UserPreference.belongsTo(User, { foreignKey: 'userId' });
UserPreference.belongsTo(Category, { foreignKey: 'categoryId' });
User.belongsToMany(Category, { through: UserPreference, foreignKey: 'userId' });
Category.belongsToMany(User, { through: UserPreference, foreignKey: 'categoryId' });

export default UserPreference; 
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Category from './Category';
import User from './User';

interface NewsAttributes {
  id?: number;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  publishedAt: Date;
  categoryId: number;
  userId?: number;
  isSaved?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NewsCreationAttributes extends NewsAttributes {}

class News extends Model<NewsAttributes, NewsCreationAttributes> implements NewsAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public content!: string;
  public imageUrl!: string;
  public sourceUrl!: string;
  public sourceName!: string;
  public publishedAt!: Date;
  public categoryId!: number;
  public userId!: number;
  public isSaved!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

News.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sourceUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sourceName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    isSaved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'news',
  }
);

// Relaciones
News.belongsTo(Category, { foreignKey: 'categoryId' });
News.belongsTo(User, { foreignKey: 'userId' });

export default News; 
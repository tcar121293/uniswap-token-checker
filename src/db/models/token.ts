import { BuildOptions, DataTypes, Model, Sequelize } from 'sequelize'

export interface TokenAttributes {
    id?: number;
    name: string;
    timestamp: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface TokenModel extends Model<TokenAttributes>, TokenAttributes {}
export class Token extends Model<TokenModel, TokenAttributes> {}

export type TokenStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): TokenModel;
};

export function TokenFactory (sequelize: Sequelize): TokenStatic {
  return <TokenStatic>sequelize.define('tokens', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    timestamp: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })
}

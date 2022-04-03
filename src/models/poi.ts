import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface PoiAttributes {
  id: number;
  nome: string;
  raio: number;
  latitude: number;
  longitude: number;
  deletado: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type PoiPk = "id";
export type PoiId = Poi[PoiPk];
export type PoiOptionalAttributes = "id" | "deleted_at";
export type PoiCreationAttributes = Optional<PoiAttributes, PoiOptionalAttributes>;

export class Poi extends Model<PoiAttributes, PoiCreationAttributes> implements PoiAttributes {
  id!: number;
  nome!: string;
  raio!: number;
  latitude!: number;
  longitude!: number;
  deletado!: boolean;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof Poi {
    Poi.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    raio: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    deletado: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'poi',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "poi_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return Poi;
  }
}

import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface PosicaoVeiculoAttributes {
  id: number;
  placa: string;
  data_posicao: Date;
  velocidade?: number;
  longitude?: number;
  latitude: number;
  ignicao: boolean;
  deletado: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export type PosicaoVeiculoPk = "id";
export type PosicaoVeiculoId = PosicaoVeiculo[PosicaoVeiculoPk];
export type PosicaoVeiculoOptionalAttributes = "id" | "velocidade" | "longitude" | "deleted_at";
export type PosicaoVeiculoCreationAttributes = Optional<PosicaoVeiculoAttributes, PosicaoVeiculoOptionalAttributes>;

export class PosicaoVeiculo extends Model<PosicaoVeiculoAttributes, PosicaoVeiculoCreationAttributes> implements PosicaoVeiculoAttributes {
  id!: number;
  placa!: string;
  data_posicao!: Date;
  velocidade?: number;
  longitude?: number;
  latitude!: number;
  ignicao!: boolean;
  deletado!: boolean;
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof PosicaoVeiculo {
    PosicaoVeiculo.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    placa: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "posicao_veiculo_placa_key"
    },
    data_posicao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    velocidade: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    ignicao: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'posicao_veiculo',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "posicao_veiculo_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "posicao_veiculo_placa_key",
        unique: true,
        fields: [
          { name: "placa" },
        ]
      },
    ]
  });
  return PosicaoVeiculo;
  }
}

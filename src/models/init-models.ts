import type { Sequelize } from "sequelize";
import { SequelizeMeta } from "./SequelizeMeta";
import type { SequelizeMetaAttributes, SequelizeMetaCreationAttributes } from "./SequelizeMeta";
import { Poi } from "./poi";
import type { PoiAttributes, PoiCreationAttributes } from "./poi";
import { PosicaoVeiculo } from "./posicao_veiculo";
import type { PosicaoVeiculoAttributes, PosicaoVeiculoCreationAttributes } from "./posicao_veiculo";

export {
  SequelizeMeta,
  Poi,
  PosicaoVeiculo,
};

export type {
  SequelizeMetaAttributes,
  SequelizeMetaCreationAttributes,
  PoiAttributes,
  PoiCreationAttributes,
  PosicaoVeiculoAttributes,
  PosicaoVeiculoCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  SequelizeMeta.initModel(sequelize);
  Poi.initModel(sequelize);
  PosicaoVeiculo.initModel(sequelize);


  return {
    SequelizeMeta: SequelizeMeta,
    Poi: Poi,
    PosicaoVeiculo: PosicaoVeiculo,
  };
}

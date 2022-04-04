import {
  initModels,
  Poi,
  PosicaoVeiculo,
} from "../models/init-models";
import debug from "debug";
const Sequelize = require('sequelize');

const log = debug('desafio:service:PoiService');

export default class PoiService {

  _iniciaSequelize() {
    const sequelize = new Sequelize(
      process.env.DATABASE_DATABASE,
      process.env.DATABASE_USERNAME,
      process.env.DATABASE_PASSWORD, {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      logging: false,
      dialect: 'postgres',
    },
    );
    initModels(sequelize);
    return sequelize;
  }


  async buscaListaPontoInteresse({ limit, offset }: { limit: number, offset: number }) {
    this._iniciaSequelize();
    return await Poi.findAll({
      where: {
        deletado: false,
      },
      attributes: ['id', 'nome', 'latitude', 'longitude', 'raio'],
      limit: limit,
      offset: offset,
      order: [
        ['id', 'DESC']
      ]
    });
  }

  async buscaListaVeiculos({ placa, data, limit, offset }: { placa: string, data: string, limit: number, offset: number }) {
    this._iniciaSequelize();
    let where: any = {
      ignicao: true,
      deletado: false,
      [Sequelize.Op.or]: [
        { placa: { [Sequelize.Op.like]: `%${placa}%` } },
      ]
    };

    if (data != '') {
      let dataInicio = new Date(`${data}`);
      dataInicio.setHours(dataInicio.getHours() + 24);
      dataInicio.setHours(0);
      let dataFim = new Date(`${data}`);
      dataFim.setHours(dataFim.getHours() + 26);
      where = {
        ...where,
        data_posicao: {
          [Sequelize.Op.between]: [dataInicio, dataFim]
        },
      }
    }

    return await PosicaoVeiculo.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [
        ['id', 'DESC']
      ]
    });
  }



};


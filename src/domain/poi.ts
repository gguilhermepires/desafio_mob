//@ts-nocheck
import {
  ApiFuncao,
  ApiMaoDeObra,
  CbAtivo,
  CbEmpresa,
  CbEmpresaUsuario,
  CbFerramenta,
  CbInstrumentoInspecao,
  initModels,
  OsRdoTipoInterferenciaOperacional,
  PtFabricanteTinta,
  PtMaterialConsumo,
  PtTinta,
  PtTintaPlanejamento,
  PtUnidade,
  OsStatus,
  OsServico,
  OsRdo,
  OsRdoStatus,
  CbAtivoHierarquia,
  OsRip,
  Inspecao,
  InsTipoCorrosao,
  InsNivelCorrosao,
  Poi,
  PosicaoVeiculo
} from "../models/init-models";

import { RespostaServidor } from '../models/resposta_servidor';
import ConversaoData from '../infrastructure/conversaoData';
import { arquivo } from '../infrastructure/arquivo';
import EmpresaService from '../services/empresaService';
// import * as moment from 'moment'
import moment from 'moment';
import { ParamsDictionary } from 'express-serve-static-core';

import debug from "debug";
import { ParsedQs } from "qs";
//@ts-ignore
const log = debug('desafio:domain:os:rdo');
const Sequelize = require('sequelize');

export class PoiDomain {
  
  logData(linha,data){
    log(`linha ${linha} data: ${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}  ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`);
  }

  async buscaTabelaTempoPois(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { placa, limit, offset, data } = requestQuery;
    if (placa == undefined || placa == null)
      placa = '';
    
    if (data == undefined || data == null){
      data = '';
    }

    if (limit == undefined && limit == null)
      limit = 30;
    if (offset == undefined && offset == null)
      offset = 0;

    limit = Number(limit);
    offset = Number(offset);

    let pois = await Poi.findAll({
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
    // let startDate =  '2000-04-03T16:20:28.683Z';
    // let endDate =  '2024-05-03T16:20:28.683Z';
    //"2022-04-03T18:20:28.683Z",
    //"2022-04-03T16:20:28.683Z"

    let where = {
      ignicao: true,
      deletado: false,
      [Sequelize.Op.or]: [
        { placa: { [Sequelize.Op.like]: `%${placa}%` } },
      ]
    };

    if(data != ''){
      log(`linha 92`)
      let dataInicio = new Date(`${data}`);
      dataInicio.setHours(dataInicio.getHours()+24);
      dataInicio.setHours(0);
      let dataFim = new Date(`${data}`);
      dataFim.setHours(dataFim.getHours()+26);
      where = {
        ...where,
        data_posicao: {
             [Sequelize.Op.between]: [dataInicio,dataFim]
         },
      }
    }

    let posVeiculos = await PosicaoVeiculo.findAll({
      where: where,
      // attributes: ['id', 'placa', 'latitude', 'longitude'],
      limit: limit,
      offset: offset,
      order: [
        ['id', 'DESC']
      ]
    });

    let resposta = this.buscaVeiculosDentroPonto(pois, posVeiculos);

    let tempo = {};
    for (let i = 0; i < resposta.length; i++) {
      for (let j = 0; j < resposta[i]?.veiculos.length; j++) {
        if (tempo[resposta[i]?.veiculos[j].veiculo.placa] == undefined ||
          tempo[resposta[i]?.veiculos[j].veiculo.placa] == null
        ) {
          tempo[resposta[i]?.veiculos[j].veiculo.placa] = {
            placa: resposta[i]?.veiculos[j].veiculo.placa,
            ultima_data: resposta[i]?.veiculos[j].veiculo.data_posicao,
            datas: [resposta[i]?.veiculos[j].veiculo.data_posicao],
            tempo: {
              dia: 0,
              hora: 0,
              minuto: 0,
              segundo: 0
            }
          };
        }//fim if
        else {
          var date1 = moment(tempo[resposta[i]?.veiculos[j].veiculo.placa].ultima_data);
          var date2 = moment(resposta[i]?.veiculos[j].veiculo.data_posicao);
          const diferenca = moment.duration(date1.diff(date2));
          let dia = tempo[resposta[i]?.veiculos[j].veiculo.placa].tempo.dia;
          let hora = tempo[resposta[i]?.veiculos[j].veiculo.placa].tempo.hora;
          let minuto = tempo[resposta[i]?.veiculos[j].veiculo.placa].tempo.minuto;
          let segundo = tempo[resposta[i]?.veiculos[j].veiculo.placa].tempo.segundo;
          let datas = tempo[resposta[i]?.veiculos[j].veiculo.placa].datas;
          datas.push(resposta[i]?.veiculos[j].veiculo.data_posicao);
          tempo[resposta[i]?.veiculos[j].veiculo.placa] = {
            placa: resposta[i]?.veiculos[j].veiculo.placa,
            ultima_data: resposta[i]?.veiculos[j].veiculo.data_posicao,
            datas: datas,
            tempo: {
              dia: dia + diferenca.asDays(),
              hora: hora + diferenca.asHours(),
              minuto: minuto + diferenca.asMinutes(),
              segundo: segundo + diferenca.asSeconds()
            }
          };
        }//fim else
      }//j
      resposta[i] = {
        ponto: resposta[i].ponto,
        tempoVeiculos: tempo
      };
    }//i

    return RespostaServidor.criar(200, '', resposta);
  }

  buscaVeiculosDentroPonto(pois, posVeiculos) {
    let response = [];
    let item;
    for (let i = 0; i < pois.length; i++) {
      item = { ponto: pois[i], veiculos: [] }
      for (let j = 0; j < posVeiculos.length; j++) {
        let distancia = this.getDistanceFromLatLonInKm(
          {
            latitude: pois[i].latitude,
            longitude: pois[i].longitude,
          },
          {
            latitude: posVeiculos[j].latitude,
            longitude: posVeiculos[j].longitude,
          },
        );
        if (distancia <= pois[i].raio) {
          item.veiculos.push(
            {
              veiculo: posVeiculos[j],
              distancia: distancia
            });
        }
      }//fim for
      response.push(item);
    }
    return response;
  }
  getDistanceFromLatLonInKm(position1, position2) {
    "use strict";
    var deg2rad = function (deg) { return deg * (Math.PI / 180); },
      R = 6371,
      dLat = deg2rad(position2.latitude - position1.latitude),
      dLng = deg2rad(position2.longitude - position1.longitude),
      a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(deg2rad(position1.latitude))
        * Math.cos(deg2rad(position1.latitude))
        * Math.sin(dLng / 2) * Math.sin(dLng / 2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c * 1000).toFixed());
  }



  async buscaPois(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { q, limit, offset } = requestQuery;

    if (q == undefined)
      q = '';
    if (q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 30;
    if (offset == undefined && offset == null)
      offset = 0;

    limit = Number(limit);
    offset = Number(offset);

    let tabela = await Poi.findAll({
      where: {
        deletado: false,
        [Sequelize.Op.or]: [
          { nome: { [Sequelize.Op.like]: `%${q}%` } },
        ]
      },
      attributes: ['id', 'nome', 'latitude', 'longitude'],
      limit: limit,
      offset: offset,
      order: [
        ['id', 'DESC']
      ]
    });
    tabela = {
      ...tabela,
      //@ts-ignore
      limit, offset
    }
    return RespostaServidor.criar(200, '', tabela);
  }

  _iniciaSequelize() {
    const sequelize = new Sequelize(
      process.env.DATABASE_DATABASE,
      process.env.DATABASE_USERNAME,
      process.env.DATABASE_PASSWORD, {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      logging: false,

      dialect: 'postgres',
      // dialectOptions: {
      //     useUTC: false, //for reading from database
      //     dateStrings: true,
      //     typeCast: function (field, next) { // for reading from database
      //         if (field.type === 'DATETIME') {
      //             return field.string()
      //         }
      //         return next()
      //     },
      // },
      // timezone: '-03:00'
    },
    );
    initModels(sequelize);
    return sequelize;
  }
}










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
  InsNivelCorrosao
} from "../models/init-models";

import { RespostaServidor } from '../models/resposta_servidor';
import ConversaoData from '../infrastructure/conversaoData';
import { arquivo } from '../infrastructure/arquivo';
import EmpresaService from '../services/empresaService';

import { ParamsDictionary } from 'express-serve-static-core';

import debug from "debug";
//@ts-ignore
const log = debug('desafio:domain:os:rdo');
const Sequelize = require('sequelize');

export class EmpresaDomain {

  async buscaEmpresa(requestParams): any {
    const { empresaId } = requestParams;
    if (empresaId == undefined)
      return RespostaServidor.criar(400, 'O id da empresa não pode ser vazio');

    this._iniciaSequelize();

    let empresa = await CbEmpresa.findOne({
      where: {
        id: empresaId,
        deletado: false,
      },
      attributes: [
        "id",
        "nome",
        "nome_fantasia",
        "telefone",
        "cnpj",
        "email",
        "endereco_rua",
        "endereco_numero",
        "endereco_bairro",
        "cidade",
        "estado",
        "cep",
        "medicaoAlvoEps",
        "medicaoAlvoEpu",
        "medicaoAlvoTracao",
        "medicaoAlvoAderenciaX",
      ]
    });

    return RespostaServidor.criar(200, '', empresa);
  }

  readCsv(path: string) {
    var myMap: any = [];
    return new Promise((resolve, _reject) => {
      const csv = require('csv-parser')
      const fs = require('fs')
      fs.createReadStream(path)
        .pipe(csv())
        .on('data', (row: any) => {
          return myMap.push(row);
        })
        .on('end', () => {
          console.log('Done.');
          resolve(myMap);
        });
    });
  }

  async importarCadastroBasicoComponente(request: any): Promise<RespostaServidor> {
    if (request.file?.path == null)
      return RespostaServidor.criar(400, 'Não foi possível realizar o upload');
    this._iniciaSequelize();

    const results: any = await this.readCsv(request.file?.path);
    for (let i = 0; i < results.length; i++) {
      let row: any = results[i];

      let componenteBanco = await CbAtivo.findOne({
        where: {
          nome: row.nome
        }
      });

      if (componenteBanco == null) {
        await CbAtivo.create({
          empresa_id: 1,
          ativo_hierarquia_id: 8,
          nome: row.nome,
          area: row.area,
          created_at: ConversaoData.buscaDataAgora(),
          updated_at: ConversaoData.buscaDataAgora(),
        });
      }
    }
    await arquivo.removerArquivoSync(request.file?.path);
    return RespostaServidor.criar(200, 'importado');
  }

  async buscaTabelaComponente(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { q, limit, offset } = requestQuery;

    if (q == undefined && q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);

    let _id = this._extrairId(q);

    let tabela = await CbAtivo.findAndCountAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        [Sequelize.Op.or]: [
          { nome: { [Sequelize.Op.like]: `%${q}%` } },
          { id: _id },
        ]
      },
      attributes: ['id', 'nome', 'area', 'empresa_id'],
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
  async buscaTabelaOs(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { q, limit, offset } = requestQuery;

    if (q == undefined)
      q = '';
    if (q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);

    let tabela = await OsServico.findAndCountAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        [Sequelize.Op.or]: [
          { numero: { [Sequelize.Op.like]: `%${q}%` } },
          { '$status.nome$': { [Sequelize.Op.like]: `%${q}%` } }
        ]
      },
      include: [
        {
          //@ts-ignore
          model: OsStatus, as: 'status',
          attributes: ['id', 'nome']
        },

      ],
      attributes: ['id', 'numero', 'status_id', 'data_emissao'],
      limit: limit,
      offset: offset,
      order: [
        ['id', 'DESC']
      ]
    });
    tabela = {
      rows: tabela.rows,
      count: tabela.count,
      //@ts-ignore
      limit, offset
    }
    return RespostaServidor.criar(200, '', tabela);
  }
  async buscaTabelaRdo(requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();

    let { q, limit, offset, servicoId } = requestQuery;

    if (q == undefined)
      q = '';
    if (q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);
    let _id = this._extrairId(q);

    let rdos = await OsRdo.findAndCountAll({
      where: {
        servico_id: servicoId,
        deletado: false,
        [Sequelize.Op.or]: [
          { id: _id },
          { '$status.nome$': { [Sequelize.Op.like]: `%${q}%` } }
        ]
      },
      include: [
        {
          //@ts-ignore
          model: OsRdoStatus, as: 'status',
          attributes: ['id', 'nome']
        },

      ],
      limit: limit,
      offset: offset,
      order: [
        ['id', 'DESC']
      ]
    });
    let rip;
    let tabela = [];

    for (let i = 0; i < rdos.rows.length; i++) {
      rip = await OsRip.findOne({
        where: {
          //@ts-ignore
          rdo_id: rdos.rows[i].id
        }
      });
      tabela.push({
        //@ts-ignore
        id: rdos.rows[i].id,
        //@ts-ignore
        servico_id: rdos.rows[i].servico_id,
        //@ts-ignore
        status: rdos.rows[i].status,
        //@ts-ignore
        data_rdo: rdos.rows[i].data_rdo,
        rip: {
          id: rip?.id,
          status_id: rip?.status_id
        },
        //@ts-ignore
        selecionado: false
      });
    }

    return RespostaServidor.criar(200, '', {
      count: rdos.count,
      rows: tabela,
      limit,
      offset
    });
  }
  async buscaTabelaTinta(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { q, limit, offset } = requestQuery;

    if (q == undefined && q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);

    let _id = this._extrairId(q);

    let tabela = await PtTinta.findAndCountAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        [Sequelize.Op.or]: [
          { nome: { [Sequelize.Op.like]: `%${q}%` } },
          { id: _id },
        ]
      },
      include: [
        {
          //@ts-ignore
          model: PtFabricanteTinta, as: 'fabricante',
          attributes: ['id', 'nome']
        }
      ],
      attributes: ['id', 'empresa_id', 'tinta_tipo_id', 'nome', 'espessura_eps_max', 'espessura_eps_min', 'custo', 'estoque'],
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
  async buscaTabelaEquipamentoInspecao(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { q, limit, offset } = requestQuery;

    if (q == undefined && q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);

    let _id = this._extrairId(q);

    let tabela = await CbInstrumentoInspecao.findAndCountAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        [Sequelize.Op.or]: [
          { nome: { [Sequelize.Op.like]: `%${q}%` } },
          { id: _id },
        ]
      },
      attributes: ['id', 'nome'],
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
  async buscaTabelaMaterialConsumo(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { q, limit, offset } = requestQuery;

    if (q == undefined && q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);

    let _id = this._extrairId(q);

    let tabela = await PtMaterialConsumo.findAndCountAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        [Sequelize.Op.or]: [
          { nome: { [Sequelize.Op.like]: `%${q}%` } },
          { id: _id },
        ]
      },
      attributes: ['id', 'nome', 'fabricante', 'custo', 'estoque'],
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
  async buscaTabelaInterferenciaOperacional(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { q, limit, offset } = requestQuery;

    if (q == undefined && q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);

    let _id = this._extrairId(q);

    let tabela = await OsRdoTipoInterferenciaOperacional.findAndCountAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        [Sequelize.Op.or]: [
          { nome: { [Sequelize.Op.like]: `%${q}%` } },
          { id: _id },
        ]
      },
      attributes: ['id', 'nome'],
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
  async buscaTabelaMaquinaEquipamento(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { q, limit, offset } = requestQuery;

    if (q == undefined && q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);

    let _id = this._extrairId(q);

    let tabela = await CbFerramenta.findAndCountAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        [Sequelize.Op.or]: [
          { nome: { [Sequelize.Op.like]: `%${q}%` } },
          { id: _id },
        ]
      },
      attributes: ['id', 'nome'],
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
  
  _extrairId(text: string): Number {
    let _id = -1;
    try {
      _id = Number(text);
      if (isNaN(_id))
        return -1;
    } catch (e) {
      return -1;
    }
    return _id;
  }

  async buscaTabelaUnidade(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { q, limit, offset } = requestQuery;

    if (q == undefined && q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);

    let _id = this._extrairId(q);

    let tabela = await PtUnidade.findAndCountAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        [Sequelize.Op.or]: [
          { nome: { [Sequelize.Op.like]: `%${q}%` } },
          { id: _id },
        ]
      },
      attributes: ['id', 'nome'],
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

  async buscaTabelaMaoDeObra(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { q, limit, offset } = requestQuery;

    if (q == undefined && q == null)
      q = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);
    let _id = -1;
    try {
      _id = Number(q);
      if (isNaN(_id))
        _id = -1;
    } catch (e) {
      _id = -1;
    }

    let tabela = await ApiMaoDeObra.findAndCountAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        [Sequelize.Op.or]: [
          { id: _id },
          { nome: { [Sequelize.Op.like]: `%${q}%` } },
          { '$funcao.nome$': { [Sequelize.Op.like]: `%${q}%` } }
        ]
      },
      include: [
        {
          //@ts-ignore
          model: ApiFuncao, as: 'funcao',
          attributes: ['id', 'nome'],
        }],
      attributes: ["id", "empresa_id", "nome"],
      limit: limit,
      offset: offset,
      order: [
        ['id', 'DESC'],
      ]
    });
    tabela = {
      ...tabela,
      //@ts-ignore
      limit, offset
    }
    return RespostaServidor.criar(200, '', tabela);
  }

  async buscaAreaCorrocao( {sequelize, endpointTabela, empresaId, plantaId, areaId, subAreaId, linhaId, equipamentoId, conjuntoId, componenteId }: { sequelize:any, endpointTabela:any,empresaId:any, plantaId:any, areaId:any,subAreaId:any, linhaId:any, equipamentoId:any, conjuntoId:any, componenteId:any }){
    let sql;
    const { QueryTypes } = require('sequelize');

    switch (endpointTabela) {
      case 'planta':
         sql = `
         select sum(area_corrosao) as area_corrosao from (
         select sum(area_corrosao) as area_corrosao from inspecao where 
         empresa_id = ${empresaId} and 
         planta_id = ${plantaId} and
         status_id = 1 and
          deletado = false
          GROUP BY id) as t;`
        break;
        case 'area':
          sql = `
          select sum(area_corrosao) as area_corrosao from (
          select sum(area_corrosao) as area_corrosao from inspecao where 
          empresa_id = ${empresaId} and 
          planta_id = ${plantaId} and
          area_id = ${areaId} and
          status_id = 1 and
           deletado = false
           GROUP BY id) as t;`
         break;
         case 'subarea':
          sql = `
          select sum(area_corrosao) as area_corrosao from (
          select sum(area_corrosao) as area_corrosao from inspecao where 
          empresa_id = ${empresaId} and 
          planta_id = ${plantaId} and
           area_id = ${areaId} and
           sub_area_id = ${subAreaId} and
           status_id = 1 and
           deletado = false
           GROUP BY id) as t;`
         break;
         case 'linha':
          sql = `
          select sum(area_corrosao) as area_corrosao from (
          select sum(area_corrosao) as area_corrosao from inspecao where 
          empresa_id = ${empresaId} and 
          planta_id = ${plantaId} and
           area_id = ${areaId} and
           sub_area_id = ${subAreaId} and 
           linha_id = ${linhaId}  and
           status_id = 1 and
           deletado = false
           GROUP BY id) as t;`
         break;
         case 'equipamento':
          sql = `
          select sum(area_corrosao) as area_corrosao from (
          select sum(area_corrosao) as area_corrosao from inspecao where 
          empresa_id = ${empresaId} and  
          planta_id = ${plantaId} and
           area_id = ${areaId} and
           sub_area_id = ${subAreaId} and 
           linha_id = ${linhaId} and 
           equipamento_id = ${equipamentoId} and 
           status_id = 1 and
           deletado = false
           GROUP BY id) as t;`
         break;
         case 'conjunto':
          sql = `
          select sum(area_corrosao) as area_corrosao from (
          select sum(area_corrosao) as area_corrosao from inspecao where 
          empresa_id = ${empresaId} and  
          planta_id = ${plantaId} and
           area_id = ${areaId} and
           sub_area_id = ${subAreaId} and 
           linha_id = ${linhaId} and 
           equipamento_id = ${equipamentoId} and 
           conjunto_id = ${conjuntoId} and 
           status_id = 1 and
           deletado = false
           GROUP BY id) as t;`
          
         break;
         case 'componente':
          sql = `
          select sum(area_corrosao) as area_corrosao from (
          select sum(area_corrosao) as area_corrosao from inspecao where 
          empresa_id = ${empresaId} and  
          planta_id = ${plantaId} and
           area_id = ${areaId} and
           sub_area_id = ${subAreaId} and 
           linha_id = ${linhaId} and 
           equipamento_id = ${equipamentoId} and 
           conjunto_id = ${conjuntoId} and 
           componente_id = ${componenteId} and 
           status_id = 1 and
           deletado = false
           GROUP BY id) as t;`
         break;
      default:
        return 0;
        break;
    }
    let resultado = await sequelize.query(sql,{ type: QueryTypes.SELECT });
    if (resultado.length == 0)
      return 0;
    return resultado[0]['area_corrosao']; 
    
  }

   _classificaCorrocao(porcentagem:number, norma){
    let numero=0;
    if (norma == 'd160') {
      if (porcentagem <= 0.01) 
      numero = 10;
      else if (porcentagem > 0.01 && porcentagem <= 0.03)
        numero = 9;
      else if (porcentagem > 0.03 && porcentagem <= 0.1)
        numero = 8;
      else if (porcentagem > 0.1 && porcentagem <= 0.3)
        numero = 7;
      else if (porcentagem > 0.3 && porcentagem <= 1)
        numero = 6;
      else if (porcentagem > 1 && porcentagem <= 3)
        numero = 5;
      else if (porcentagem > 3 && porcentagem <= 10)
        numero = 4;
      else if (porcentagem > 10 && porcentagem <= 16)
        numero = 3;
      else if (porcentagem > 16 && porcentagem <= 33)
        numero = 2;
      else if (porcentagem > 33 && porcentagem <= 50)
        numero = 1;
      else if (porcentagem > 50)
       numero = 0;
    }
      return numero;
  }

   _buscaCorClassificacao(numero:number, norma){
    let cor = 'branco';
    if (norma == 'd160') {
    switch (numero) {
      case 0:
        return 'branco';
      case 1:
        return 'vermelho';
      case 2:
        return 'preto';
      case 3:
        return 'cinza';
      case 4:
        return 'roxo';
      case 5:
        return 'rosa';
      case 6:
        return 'marrom';
      case 7:
        return 'laranja';
      case 8:
        return 'amarelo';
      case 9:
        return 'verde';
      case 10:
        return 'branco';
      default:
        return 'branco';
    }
  }

  }

   toFixed(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
  }

  async buscaTabelaInspecao(requestParams, requestQuery: any): Promise<RespostaServidor> {
    const sequelize = this._iniciaSequelize();
    const { empresaId } = requestParams;
    let { textoBusca, limit, offset, endpointTabela,
       parentId,
      plantaId,
      areaId,
      subAreaId,
      linhaId,
      equipamentoId,
      conjuntoId,
      componenteId
      } = requestQuery;

    if (textoBusca == undefined)
      textoBusca = '';
    if (textoBusca == null)
      textoBusca = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);
    let _id = this._extrairId(textoBusca);
    let areaBusca = 0;
    try{
      areaBusca = Number(textoBusca)
    }catch(e){
      areaBusca = 0;
    }
    let tabela = [];
    if (endpointTabela == 'planta') {
      tabela = await CbAtivo.findAndCountAll({
        where: {
          empresa_id: empresaId,
          deletado: false,
          [Sequelize.Op.or]: [
            { nome: { [Sequelize.Op.like]: `%${textoBusca}%` } },
            { area: areaBusca},
          ]
        },
        include: [
          {
            //@ts-ignore
            model: CbAtivoHierarquia, as: 'ativo_hierarquium',
            attributes: [],
            where: {
              slug: endpointTabela,
            }
          },
        ],
        limit: limit,
        offset: offset,
        order: [
          ['id', 'DESC']
        ]
      });
    } else {
      tabela = await CbAtivo.findAndCountAll({
        where: {
          empresa_id: empresaId,
          deletado: false,
          parent_id: parentId,
          [Sequelize.Op.or]: [
            { nome: { [Sequelize.Op.like]: `%${textoBusca}%` } },
            { area: areaBusca },
          ]
        },
        include: [
          {
            //@ts-ignore
            model: CbAtivoHierarquia, as: 'ativo_hierarquium',
            attributes: [],
            where: {
              slug: endpointTabela
            }
          },

        ],
        limit: limit,
        offset: offset,
        order: [
          ['id', 'DESC']
        ]
      });
    }

    let areaCorrosao:number = 0, porcentagemCorrosao=0, classificacaoCorrosao=0, cor='';
    switch (endpointTabela) {
      case 'planta':
        tabela.rows = await Promise.all(tabela.rows.map(async (item): Promise<any> => {
          areaCorrosao = await this.buscaAreaCorrocao({
            empresaId:empresaId,
            sequelize:sequelize, 
            endpointTabela:endpointTabela,  
            plantaId:item.id,
            areaId:0,
            subAreaId:0,
            linhaId:0,
            equipamentoId:0,
            conjuntoId:0,
            componenteId:0
          });
          porcentagemCorrosao = parseFloat(new Number(this.toFixed((areaCorrosao * 100 )/item.area)).toFixed(4));
          classificacaoCorrosao = this._classificaCorrocao(porcentagemCorrosao, 'd160');
          cor = this._buscaCorClassificacao(classificacaoCorrosao, 'd160');
          return {
            id: item.id,
            nome: item.nome,
            area: item.area,
            porcentagem_corrosao:porcentagemCorrosao,
            area_corrosao: areaCorrosao,
            classificacao_corrosao: classificacaoCorrosao,
            cor_corrosao: cor,
          };
        }));
        break;
      case 'area':
        tabela.rows = await Promise.all(tabela.rows.map(async (item): Promise<any> => {
          areaCorrosao = await this.buscaAreaCorrocao({
            sequelize:sequelize, 
            endpointTabela:endpointTabela,  
            empresaId:empresaId,
            plantaId:plantaId,
            areaId:item.id,
            subAreaId:0,
            linhaId:0,
            equipamentoId:0,
            conjuntoId:0,
            componenteId:0
          });
          log(`linha 890 endpointTabela=${endpointTabela}, plantaId=${plantaId}, areaId:${item.id} `)
          log(` linha 891 = ${areaCorrosao}`)
          porcentagemCorrosao = parseFloat(new Number(this.toFixed((areaCorrosao * 100 )/item.area)).toFixed(2));
          classificacaoCorrosao = this._classificaCorrocao(porcentagemCorrosao, 'd160');
          cor = this._buscaCorClassificacao(classificacaoCorrosao, 'd160');
          return {
            id: item.id,
            nome: item.nome,
            area: item.area,
            porcentagem_corrosao: porcentagemCorrosao,
            area_corrosao: areaCorrosao,
            classificacao_corrosao: classificacaoCorrosao,
            cor_corrosao: cor,
          };
        }));
        break;
        case 'subarea':
          tabela.rows = await Promise.all(tabela.rows.map(async (item): Promise<any> => {
            areaCorrosao = await this.buscaAreaCorrocao({
              sequelize:sequelize, 
              endpointTabela:endpointTabela,  
              empresaId:empresaId,
              plantaId:plantaId,
              areaId:areaId,
              subAreaId:item.id,
              linhaId:0,
              equipamentoId:0,
              conjuntoId:0,
              componenteId:0
            });
            porcentagemCorrosao = parseFloat(new Number(this.toFixed((areaCorrosao * 100 )/item.area)).toFixed(2));
            classificacaoCorrosao = this._classificaCorrocao(porcentagemCorrosao, 'd160');
            cor = this._buscaCorClassificacao(classificacaoCorrosao, 'd160');
            return {
              id: item.id,
              nome: item.nome,
              area: item.area,
              porcentagem_corrosao: porcentagemCorrosao,
              area_corrosao: areaCorrosao,
              classificacao_corrosao: classificacaoCorrosao,
              cor_corrosao: cor,
            };
          }));
          break;
        case 'linha':
          tabela.rows = await Promise.all(tabela.rows.map(async (item): Promise<any> => {
            areaCorrosao = await this.buscaAreaCorrocao({
              sequelize:sequelize, 
              endpointTabela:endpointTabela,  
              empresaId:empresaId,
              plantaId:plantaId,
              areaId:areaId,
              subAreaId:subAreaId,
              linhaId:item.id,
              equipamentoId:0,
              conjuntoId:0,
              componenteId:0
            });
            porcentagemCorrosao = parseFloat(new Number(this.toFixed((areaCorrosao * 100 )/item.area)).toFixed(2));
            classificacaoCorrosao = this._classificaCorrocao(porcentagemCorrosao, 'd160');
            cor = this._buscaCorClassificacao(classificacaoCorrosao, 'd160');
            return {
              id: item.id,
              nome: item.nome,
              area: item.area,
              porcentagem_corrosao: porcentagemCorrosao,
              area_corrosao: areaCorrosao,
              classificacao_corrosao: classificacaoCorrosao,
              cor_corrosao: cor,
            };
          }));
          break;
        case 'equipamento':
        tabela.rows = await Promise.all(tabela.rows.map(async (item): Promise<any> => {
        areaCorrosao = await this.buscaAreaCorrocao({
          sequelize:sequelize, 
          endpointTabela:endpointTabela,  
          empresaId:empresaId,
          plantaId:plantaId,
          areaId:areaId,
          subAreaId:subAreaId,
          linhaId:linhaId,
          equipamentoId:item.id,
          conjuntoId:0,
          componenteId:0
        });
        porcentagemCorrosao = parseFloat(new Number(this.toFixed((areaCorrosao * 100 )/item.area)).toFixed(2));
        classificacaoCorrosao = this._classificaCorrocao(porcentagemCorrosao, 'd160');
        cor = this._buscaCorClassificacao(classificacaoCorrosao, 'd160');
        return {
          id: item.id,
          nome: item.nome,
          area: item.area,
          porcentagem_corrosao: porcentagemCorrosao,
          area_corrosao: areaCorrosao,
          classificacao_corrosao: classificacaoCorrosao,
          cor_corrosao: cor,
        };
        }));
        break;
        case 'conjunto':
        tabela.rows = await Promise.all(tabela.rows.map(async (item): Promise<any> => {
          areaCorrosao = await this.buscaAreaCorrocao({
            sequelize:sequelize, 
            endpointTabela:endpointTabela,  
            empresaId:empresaId,
            plantaId:plantaId,
            areaId:areaId,
            subAreaId:subAreaId,
            linhaId:linhaId,
            equipamentoId:equipamentoId,
            conjuntoId:item.id,
            componenteId:0
          });
          porcentagemCorrosao = parseFloat(new Number(this.toFixed((areaCorrosao * 100 )/item.area)).toFixed(2));
         classificacaoCorrosao = this._classificaCorrocao(porcentagemCorrosao, 'd160');
          cor = this._buscaCorClassificacao(classificacaoCorrosao, 'd160');
          return {
            id: item.id,
            nome: item.nome,
            area: item.area,
            porcentagem_corrosao: porcentagemCorrosao,
            area_corrosao: areaCorrosao,
            classificacao_corrosao: classificacaoCorrosao,
            cor_corrosao: cor,
          };
        }));
        break;
        case 'componente':
                  tabela.rows = await Promise.all(tabela.rows.map(async (item): Promise<any> => {
                    areaCorrosao = await this.buscaAreaCorrocao({
                      sequelize:sequelize, 
                      endpointTabela:endpointTabela,  
                      empresaId:empresaId,
                      plantaId:plantaId,
                      areaId:areaId,
                      subAreaId:subAreaId,
                      linhaId:linhaId,
                      equipamentoId:equipamentoId,
                      conjuntoId:conjuntoId,
                      componenteId:item.id
                    });
                    porcentagemCorrosao = parseFloat(new Number(this.toFixed((areaCorrosao * 100 )/item.area)).toFixed(2));
          classificacaoCorrosao = this._classificaCorrocao(porcentagemCorrosao, 'd160');
                    cor = this._buscaCorClassificacao(classificacaoCorrosao, 'd160');
                    return {
                      id: item.id,
                      nome: item.nome,
                      area: item.area,
                      porcentagem_corrosao: porcentagemCorrosao,
                      area_corrosao: areaCorrosao,
                      classificacao_corrosao: classificacaoCorrosao,
                      cor_corrosao: cor,
                    };
                  }));
                  break;
          default:
          tabela.rows = await Promise.all(tabela.rows.map(async (item): Promise<any> => {
            return {
              id: item.id,
              nome: item.nome,
              area: item.area,
              porcentagem_corrosao: 0,
              area_corrosao: 0,
              area_corrosao: 0,
              classificacao_corrosao: 0,
              cor_corrosao: 'azul',
            };
          }));
          break;
    }

    return RespostaServidor.criar(200, '', {
      count: tabela.rows.length,
      rows: tabela.rows,
      limit,
      offset,
    });
  }
  async buscaTabelaInspecaoComponenteConjunto(requestParams, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    
    const { empresaId } = requestParams;
    let {
      textoBusca,
      limit,
      offset, 
      endpointTabela, 
      plantaId,
      areaId,
      subAreaId,
      linhaId,
      equipamentoId,
      conjuntoId,
      componenteId } = requestQuery;

    if (textoBusca == undefined)
      textoBusca = '';
    if (textoBusca == null)
      textoBusca = '';
    if (limit == undefined && limit == null)
      limit = 0;
    if (offset == undefined && offset == null)
      limit = 0;

    limit = Number(limit);
    offset = Number(offset);
    let _id = this._extrairId(textoBusca);
    let tabela = [];
    let where;
    switch(endpointTabela){
      case 'componente':
        where = {
          planta_id: plantaId,
          area_id: areaId,
          sub_area_id: subAreaId,
          linha_id: linhaId,
          equipamento_id: equipamentoId,
          conjunto_id: conjuntoId,
          componente_id: componenteId,
          empresa_id: empresaId,
          deletado: false,
        }
        break;
        case 'conjunto':
          where = {
            planta_id: plantaId,
            area_id: areaId,
            sub_area_id: subAreaId,
            linha_id: linhaId,
            equipamento_id: equipamentoId,
            conjunto_id: conjuntoId,
            empresa_id: empresaId,
            deletado: false,
          }
          break;
          default:
            throw new Error("endpointTabela inválido");
          break;
    }


    tabela = await Inspecao.findAndCountAll({
      where: where,
      include: [
        {
          //@ts-ignore
          model: InsTipoCorrosao, as: 'tipo_corrosao',
          attributes: ["id", "nome"],
        },
        {
          //@ts-ignore
          model: InsNivelCorrosao, as: 'nivel_corrosao',
          attributes: ["id", "nome"],

        },

      ],
      attributes: ["id", "porcentagem_corrosao",
      "area_corrosao", "data" ],
      limit: limit,
      offset: offset,
      order: [
        ['id', 'DESC']
      ]
    });

 

    return RespostaServidor.criar(200, '', {
      count: tabela.rows.length,
      rows: tabela.rows,
      limit,
      offset,
    });
  }
  async atualizaComponentePorId(requestParams: any, requestBody: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    const { dados } = requestBody;

    if (dados == null)
      throw new Error(`Não é possível atualizar sem dados`);

    let objetoBanco = await CbAtivo.findOne({ where: { id: id } });

    if (objetoBanco == null)
      throw new Error(`Não foi possível encontrar a tinta para o id: ${id}`);

    objetoBanco.setDataValue('nome', dados.nome);
    objetoBanco.setDataValue('area', dados.area);
    objetoBanco.setDataValue('updated_at', ConversaoData.buscaDataAgora());

    objetoBanco.save();

    return RespostaServidor.criar(200, 'Salvo com sucesso');
  }

  async atualizaTintaPorId(requestParams: any, requestBody: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    const { dados } = requestBody;

    if (dados == null)
      throw new Error(`Não é possível atualizar sem dados`);

    let objetoBanco = await PtTinta.findOne({ where: { id: id } });

    if (objetoBanco == null)
      throw new Error(`Não foi possível encontrar a tinta para o id: ${id}`);

    objetoBanco.setDataValue('nome', dados.nome);
    objetoBanco.setDataValue('espessura_eps_max', dados.espessuraEpsMax);
    objetoBanco.setDataValue('espessura_eps_min', dados.espessuraEpsMin);
    objetoBanco.setDataValue('custo', dados.custo);
    objetoBanco.setDataValue('estoque', dados.estoque);
    objetoBanco.setDataValue('updated_at', ConversaoData.buscaDataAgora());

    if (dados.fabricanteTinta != null)
      objetoBanco.setDataValue('fabricante_id', dados.fabricanteTinta.id);

    objetoBanco.save();

    return RespostaServidor.criar(200, 'Salvo com sucesso',);
  }

  async atualizaMaoDeObraPorId(requestParams: any, requestBody: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    const { dados } = requestBody;

    if (dados == null)
      throw new Error(`Não é possível atualizar sem dados`);

    let objetoBanco = await ApiMaoDeObra.findOne({ where: { id: id } });
    if (objetoBanco == null)
      throw new Error(`Não foi possível encontrar a tinta para o id: ${id}`);
    objetoBanco.setDataValue('nome', dados.nome);
    objetoBanco.setDataValue('funcao_id', dados.funcao_id);
    objetoBanco.setDataValue('data_admissao', ConversaoData.formataDataTelaParaDataBanco(dados.data_admissao));
    objetoBanco.setDataValue('rg', dados.rg);
    objetoBanco.setDataValue('ativo', dados.ativo);
    objetoBanco.setDataValue('cpf', dados.cpf);
    objetoBanco.setDataValue('telefone', dados.telefone);
    objetoBanco.setDataValue('email', dados.email);
    objetoBanco.setDataValue('endereco_rua', dados.endereco_rua);
    objetoBanco.setDataValue('endereco_numero', dados.endereco_numero);
    objetoBanco.setDataValue('endereco_bairro', dados.endereco_bairro);
    objetoBanco.setDataValue('cidade', dados.cidade);
    objetoBanco.setDataValue('estado', dados.estado);
    objetoBanco.setDataValue('cep', dados.cep);
    objetoBanco.setDataValue('updated_at', ConversaoData.buscaDataAgora());
    objetoBanco.save();

    return RespostaServidor.criar(200, 'Salvo com sucesso', objetoBanco);
  }

  async atualizaUnidadePorId(requestParams: any, requestBody: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    const { dados } = requestBody;

    if (dados == null)
      throw new Error(`Não é possível atualizar sem dados`);

    let objetoBanco = await PtUnidade.findOne({ where: { id: id } });

    if (objetoBanco == null)
      throw new Error(`Não foi possível encontrar a tinta para o id: ${id}`);

    objetoBanco.setDataValue('nome', dados.nome);
    objetoBanco.setDataValue('updated_at', ConversaoData.buscaDataAgora());

    objetoBanco.save();

    return RespostaServidor.criar(200, 'Salvo com sucesso',);
  }

  async atualizaMaquinaEquipamentoPorId(requestParams: any, requestBody: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    const { dados } = requestBody;

    if (dados == null)
      throw new Error(`Não é possível atualizar sem dados`);

    let objetoBanco = await CbFerramenta.findOne({ where: { id: id } });

    if (objetoBanco == null)
      throw new Error(`Não foi possível encontrar a tinta para o id: ${id}`);

    objetoBanco.setDataValue('nome', dados.nome);
    objetoBanco.setDataValue('updated_at', ConversaoData.buscaDataAgora());

    objetoBanco.save();

    return RespostaServidor.criar(200, 'Salvo com sucesso',);
  }

  async atualizaInterferenciaOperacionalPorId(requestParams: any, requestBody: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    const { dados } = requestBody;

    if (dados == null)
      throw new Error(`Não é possível atualizar sem dados`);

    let objetoBanco = await OsRdoTipoInterferenciaOperacional.findOne({ where: { id: id } });

    if (objetoBanco == null)
      throw new Error(`Não foi possível encontrar a tinta para o id: ${id}`);

    objetoBanco.setDataValue('nome', dados.nome);
    objetoBanco.setDataValue('updated_at', ConversaoData.buscaDataAgora());

    objetoBanco.save();

    return RespostaServidor.criar(200, 'Salvo com sucesso',);
  }

  async atualizaMaterialConsumoPorId(requestParams: any, requestBody: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    const { dados } = requestBody;

    if (dados == null)
      throw new Error(`Não é possível atualizar sem dados`);

    let objetoBanco = await PtMaterialConsumo.findOne({ where: { id: id } });

    if (objetoBanco == null)
      throw new Error(`Não foi possível encontrar a tinta para o id: ${id}`);

    objetoBanco.setDataValue('nome', dados.nome);
    objetoBanco.setDataValue('fabricante', dados.fabricante);
    objetoBanco.setDataValue('custo', dados.custo);
    objetoBanco.setDataValue('estoque', dados.estoque);
    objetoBanco.setDataValue('updated_at', ConversaoData.buscaDataAgora());

    objetoBanco.save();

    return RespostaServidor.criar(200, 'Salvo com sucesso',);
  }

  async atualizaEquipamentoInspecaoPorId(requestParams: any, requestBody: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    const { dados } = requestBody;

    if (dados == null)
      throw new Error(`Não é possível atualizar sem dados`);

    let objetoBanco = await CbInstrumentoInspecao.findOne({ where: { id: id } });

    if (objetoBanco == null)
      throw new Error(`Não foi possível encontrar a tinta para o id: ${id}`);

    objetoBanco.setDataValue('nome', dados.nome);
    objetoBanco.setDataValue('updated_at', ConversaoData.buscaDataAgora());

    objetoBanco.save();

    return RespostaServidor.criar(200, 'Salvo com sucesso',);
  }

  async buscaMaoDeObraPorId(requestParams: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    return RespostaServidor.criar(200, '', await ApiMaoDeObra.findOne({
      where: { id: id },
      include: [
        {
          //@ts-ignore
          model: ApiFuncao, as: 'funcao',
          attributes: ['id', 'nome', 'empresa_id']
        }
      ]
    }));
  }

  async buscaUnidadePorId(requestParams: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    return RespostaServidor.criar(200, '', await PtUnidade.findOne({
      where: { id: id, },
    }));
  }

  async buscaMaquinaEquipamentoPorId(requestParams: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    return RespostaServidor.criar(200, '', await CbFerramenta.findOne({
      where: { id: id },
    }));
  }

  async buscaInterferenciaOperacionalPorId(requestParams: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    return RespostaServidor.criar(200, '', await OsRdoTipoInterferenciaOperacional.findOne({
      where: { id: id },
    }));
  }

  async buscaMaterialConsumoPorId(requestParams: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    return RespostaServidor.criar(200, '', await PtMaterialConsumo.findOne({
      where: { id: id },
    }));
  }

  async buscaEquipamentoInspecaoPorId(requestParams: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    return RespostaServidor.criar(200, '', await CbInstrumentoInspecao.findOne({
      where: { id: id },
    }));
  }

  async buscaTintaPorId(requestParams: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    return RespostaServidor.criar(200, '', await PtTinta.findOne({
      where: { id: id },
      include: [
        //@ts-ignore
        { model: PtFabricanteTinta, as: 'fabricante' }
      ]
    }));
  }

  async buscaComponentePorId(requestParams: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { id } = requestParams;
    return RespostaServidor.criar(200, '', await CbAtivo.findOne({
      where: { id: id },
    }));
  }

  async cadastroComponente(requestParams: any, requestBody: any): Promise<RespostaServidor> {
    const { empresaId, paiId } = requestParams;
    const { dados } = requestBody;
    this._iniciaSequelize();

    return RespostaServidor.criar(200, 'Salvo com sucesso', await CbAtivo.create({
      empresa_id: parseFloat(empresaId),
      ativo_hierarquia_id: 8,// 8 para componente
      componente_tipo_id: dados.tipoComponente != null ? dados.tipoComponente.id : null,
      nome: dados.nome,
      descricao: dados.descricao,
      area: parseFloat(dados.area),
      deletado: false,
      created_at: new Date(),
      updated_at: new Date(),
    }));
  }

  async buscaAtivoPorAtivoId(requestParams: any): Promise<RespostaServidor> {
    const { ativoId, empresaId } = requestParams;
    this._iniciaSequelize();
    return RespostaServidor.criar(200, 'Ativo', await CbAtivo.findOne({
      where: {
        id: ativoId,
        empresa_id: empresaId,
      },
    }));
  }

  async buscaAtivoPorPaiId(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    const { empresaId, paiId } = requestParams;
    const { limit, offset } = requestQuery;
    this._iniciaSequelize();
    let rows = await CbAtivo.findAll({
      where: {
        parent_id: paiId,
        empresa_id: empresaId,
      },
    });



    return RespostaServidor.criar(200, 'Ativos filhos', {
      rows: rows,
      limit,
      offset,
      count: rows.length
    });
  }

  async buscaTodosAtivos(requestParams: any, requestQuery: any): Promise<RespostaServidor> {
    const { empresaId } = requestParams;
    const { ativoHierarquiaId, offset, limit, q } = requestQuery;
    if (ativoHierarquiaId == undefined)
      throw new Error("ativoHierarquiaId não pode ser vazio");

    this._iniciaSequelize();
    const osAtivos = await CbAtivo.findAll({
      where: {
        empresa_id: empresaId,
        ativo_hierarquia_id: ativoHierarquiaId,
        deletado: false
      }
    });
    return RespostaServidor.criar(200, 'Todos ativos', {
      limit: limit,
      offset: offset,
      q: q,
      rows: osAtivos,
      count: osAtivos.length
    });
  }

  async cadastroAtivo(requestParam: any, requestbody: any): Promise<RespostaServidor> {
    const { empresaId, paiId } = requestParam;
    const { dados } = requestbody;
    this._iniciaSequelize();

    return RespostaServidor.criar(200, 'Salvo com sucesso', await CbAtivo.create({
      parent_id: dados.componentePai != null ? dados.componentePai.id : null,
      empresa_id: parseFloat(empresaId),
      ativo_hierarquia_id: dados.ativoHierarquia.id,
      componente_tipo_id: dados.tipoComponente != null ? dados.tipoComponente.id : null,
      filhos_id: dados.componenteFilho != null ? dados.componenteFilho.id : null,
      nome: dados.nome,
      descricao: dados.descricao,
      area: parseFloat(dados.area),
      deletado: false,
      created_at: new Date(),
      updated_at: new Date(),
    }));
  }

  async buscaEmpresas(usuario: any, requestQuery: any): Promise<RespostaServidor> {
    const { reduzido } = requestQuery;
    this._iniciaSequelize()
    //guilherme
    if (usuario == undefined)
      throw new Error('Usuário não pode ser vazio');
    let listaEmpresasUsuario = await EmpresaService.buscaEmpresasUsuarioId(
      { usuarioId: usuario.userAccount.id });

    let empresas = await EmpresaService.buscaEmpresas(
      { listaEmpresasUsuario: listaEmpresasUsuario, reduzido: reduzido });

    return RespostaServidor.criar(200, '', empresas);
  }

  async removerComponente(requestPayload: any): Promise<RespostaServidor> {
    const { lista } = requestPayload;
    this._iniciaSequelize();
    for (let i = 0; i < lista.length; i++) {
      await CbAtivo.update({
        deletado: true,
        updated_at: ConversaoData.buscaDataAgora(),
        deleted_at: ConversaoData.buscaDataAgora()
      }, {
        where: {
          id: lista[i].id
        }
      });
    }
    return RespostaServidor.criar(200, 'Removido com sucesso');
  }

  async removerTinta(requestPayload: any): Promise<RespostaServidor> {
    const { lista } = requestPayload;
    this._iniciaSequelize();
    for (let i = 0; i < lista.length; i++) {
      await PtTinta.update({
        deletado: true,
        updated_at: ConversaoData.buscaDataAgora(),
        deleted_at: ConversaoData.buscaDataAgora()
      }, {
        where: {
          id: lista[i].id
        }
      });
    }
    return RespostaServidor.criar(200, 'Removido com sucesso');
  }

  async removerEquipamentoInspecao(requestPayload: any): Promise<RespostaServidor> {
    const { lista } = requestPayload;
    this._iniciaSequelize();
    for (let i = 0; i < lista.length; i++) {
      await CbInstrumentoInspecao.update({
        deletado: true,
        updated_at: ConversaoData.buscaDataAgora(),
        deleted_at: ConversaoData.buscaDataAgora()
      }, {
        where: {
          id: lista[i].id
        }
      });
    }
    return RespostaServidor.criar(200, 'Removido com sucesso');
  }

  async removerMaterialConsumo(requestPayload: any): Promise<RespostaServidor> {
    const { lista } = requestPayload;
    this._iniciaSequelize();
    for (let i = 0; i < lista.length; i++) {
      await PtMaterialConsumo.update({
        deletado: true,
        updated_at: ConversaoData.buscaDataAgora(),
        deleted_at: ConversaoData.buscaDataAgora()
      }, {
        where: {
          id: lista[i].id
        }
      });
    }
    return RespostaServidor.criar(200, 'Removido com sucesso');
  }

  async removerInterferenciaOperacional(requestPayload: any): Promise<RespostaServidor> {
    const { lista } = requestPayload;
    this._iniciaSequelize();
    for (let i = 0; i < lista.length; i++) {
      await OsRdoTipoInterferenciaOperacional.update({
        deletado: true,
        updated_at: ConversaoData.buscaDataAgora(),
        deleted_at: ConversaoData.buscaDataAgora()
      }, {
        where: {
          id: lista[i].id
        }
      });
    }
    return RespostaServidor.criar(200, 'Removido com sucesso');
  }

  async removerMaquinaEquipamento(requestPayload: any): Promise<RespostaServidor> {
    const { lista } = requestPayload;
    this._iniciaSequelize();
    for (let i = 0; i < lista.length; i++) {
      await CbFerramenta.update({
        deletado: true,
        updated_at: ConversaoData.buscaDataAgora(),
        deleted_at: ConversaoData.buscaDataAgora()
      }, {
        where: {
          id: lista[i].id
        }
      });
    }
    return RespostaServidor.criar(200, 'Removido com sucesso');
  }

  async removerUnidade(requestParams: ParamsDictionary, requestPayload: any): Promise<RespostaServidor> {
    const { lista } = requestPayload;
    this._iniciaSequelize();
    for (let i = 0; i < lista.length; i++) {
      await PtUnidade.update({
        deletado: true,
        updated_at: ConversaoData.buscaDataAgora(),
        deleted_at: ConversaoData.buscaDataAgora()
      }, {
        where: {
          id: lista[i].id
        }
      });
    }
    return RespostaServidor.criar(200, 'Removido com sucesso');
  }

  async removerMaoDeObra(requestPayload: any): Promise<RespostaServidor> {
    const { lista } = requestPayload;
    this._iniciaSequelize();
    for (let i = 0; i < lista.length; i++) {
      await ApiMaoDeObra.update({
        deletado: true,
        updated_at: ConversaoData.buscaDataAgora(),
        deleted_at: ConversaoData.buscaDataAgora()
      }, {
        where: {
          id: lista[i].id
        }
      });
    }
    return RespostaServidor.criar(200, 'Removido com sucesso');
  }

  async buscaComponente(requestParams: ParamsDictionary, requestQuery: any):
    Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q } = requestQuery;
    return RespostaServidor.criar(200, '', await CbAtivo.findAll({
      where: {
        empresa_id: empresaId,
        ativo_hierarquia_id: 8,
        deletado: false,
        nome: { [Sequelize.Op.like]: `%${q}%` },
      },
      attributes: ["id", "empresa_id", "nome"],
      limit: 30
    }));
  }

  async buscaInterferenciaOperacional(requestParams: ParamsDictionary,
    requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q } = requestQuery;
    return RespostaServidor.criar(200, '', await OsRdoTipoInterferenciaOperacional.findAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        nome: { [Sequelize.Op.like]: `%${q}%` },
      },
      attributes: ["id", "empresa_id", "nome"],
      limit: 30
    }));
  }

  async cadastroTinta(requestParams: ParamsDictionary, requestPayload: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { dados } = requestPayload;

    let tinta = await PtTinta.create({
      nome: dados.nome,
      //@ts-ignore
      empresa_id: empresaId,
      espessura_eps_max: dados.espessuraEpsMax,
      espessura_eps_min: dados.espessuraEpsMin,
      espessura_epu_max: 0,
      espessura_epu_min: 0,
      custo: dados.custo,
      estoque: dados.estoque,
      fabricante_id: dados.fabricanteTinta.id,
      deletado: false,
      created_at: ConversaoData.buscaDataAgora(),
      updated_at: ConversaoData.buscaDataAgora(),
    });

    return RespostaServidor.criar(200, 'Tinta cadastrada com sucesso', { tintaId: tinta.id });
  }

  async cadastroMaoDeObra(requestParams: ParamsDictionary, requestPayload: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { dados } = requestPayload;

    let maoDeObra = await ApiMaoDeObra.create({
      //@ts-ignore
      empresa_id: empresaId,
      nome: dados.nome,
      funcao_id: dados.funcao_id,
      //@ts-ignore
      data_admissao: ConversaoData.formataData(dados.data_admissao, true),
      ativo: dados.ativo,
      rg: dados.rg,
      cpf: dados.cpf,
      telefone: dados.telefone,
      email: dados.email,
      endereco_rua: dados.endereco_rua,
      endereco_numero: dados.endereco_numero,
      endereco_bairro: dados.endereco_bairro,
      cidade: dados.cidade,
      estado: dados.estado,
      cep: dados.cep,
      deletado: false,
      created_at: ConversaoData.buscaDataAgora(),
      updated_at: ConversaoData.buscaDataAgora(),
    });
    return RespostaServidor.criar(200, 'Mão de obra cadastrada com sucesso', { maoDeObraId: maoDeObra.id });
  }

  async cadastroMaterialConsumo(requestParams: ParamsDictionary, requestPayload: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { dados } = requestPayload;

    let materialConsumo = await PtMaterialConsumo.create({
      //@ts-ignore
      empresa_id: empresaId,
      nome: dados.nome,
      fabricante: dados.fabricante,
      custo: dados.custo,
      estoque: dados.estoque,
      deletado: false,
      created_at: ConversaoData.buscaDataAgora(),
      updated_at: ConversaoData.buscaDataAgora(),
    });
    return RespostaServidor.criar(200,
      'Material de consumo cadastrado com sucesso',
      { materialConsumoId: materialConsumo.id });
  }

  async cadastroUnidade(requestParams: ParamsDictionary, requestPayload: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { dados } = requestPayload;

    let unidade = await PtUnidade.create({
      //@ts-ignore
      empresa_id: empresaId,
      nome: dados.nome,
      deletado: false,
      created_at: ConversaoData.buscaDataAgora(),
      updated_at: ConversaoData.buscaDataAgora(),
    });
    return RespostaServidor.criar(200,
      'Unidade cadastrada com sucesso',
      { unidaeId: unidade.id });
  }

  async cadastroMaquinaEquipamento(requestParams: ParamsDictionary, requestPayload: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { dados } = requestPayload;

    let ferramento = await CbFerramenta.create({
      //@ts-ignore
      empresa_id: empresaId,
      nome: dados.nome,
      deletado: false,
      created_at: ConversaoData.buscaDataAgora(),
      updated_at: ConversaoData.buscaDataAgora(),
    });
    return RespostaServidor.criar(200,
      'Equipamento cadastrado com sucesso',
      { maquinaEquipamentoId: ferramento.id });
  }

  async cadastroInterferenciaOperacional(requestParams: ParamsDictionary, requestPayload: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { dados } = requestPayload;

    let interferencia = await OsRdoTipoInterferenciaOperacional.create({
      //@ts-ignore
      empresa_id: empresaId,
      nome: dados.nome,
      deletado: false,
      created_at: ConversaoData.buscaDataAgora(),
      updated_at: ConversaoData.buscaDataAgora(),
    });
    return RespostaServidor.criar(200,
      'Interferência operacional cadastrada com sucesso',
      { interferenciaOperacionalId: interferencia.id });
  }

  async cadastroEquipamentoInspecao(requestParams: ParamsDictionary, requestPayload: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { dados } = requestPayload;

    let equipamento = await CbInstrumentoInspecao.create({
      //@ts-ignore
      empresa_id: empresaId,
      nome: dados.nome,
      deletado: false,
      created_at: ConversaoData.buscaDataAgora(),
      updated_at: ConversaoData.buscaDataAgora(),
    });
    return RespostaServidor.criar(200,
      'Equipamento de inspeção cadastrado com sucesso',
      { equipamentoInspecaoId: equipamento.id });
  }

  async buscaFabricante(requestParams: ParamsDictionary, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q } = requestQuery;
    return RespostaServidor.criar(200, '', await PtFabricanteTinta.findAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        nome: { [Sequelize.Op.like]: `%${q}%` },
      },
      attributes: ["id", "empresa_id", "nome"],
      limit: 30
    }));
  }

  async buscaMaoDeObra(requestParams: ParamsDictionary, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q } = requestQuery;
    return RespostaServidor.criar(200, '', await ApiMaoDeObra.findAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        nome: { [Sequelize.Op.like]: `%${q}%` },
      },
      include: [
        {
          //@ts-ignore
          model: ApiFuncao, as: 'funcao',
          attributes: ['id', 'nome']
        }],
      attributes: ["id", "empresa_id", "nome"],
      limit: 30
    }));
  }

  async buscaMaoDeObraFuncao(requestParams: ParamsDictionary, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q } = requestQuery;
    return RespostaServidor.criar(200, '', await ApiFuncao.findAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        nome: { [Sequelize.Op.like]: `%${q}%` },
      },
      attributes: ["id", "empresa_id", "nome"],
      limit: 30
    }));
  }

  async buscaMaquinaEquipamento(requestParams: ParamsDictionary, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q } = requestQuery;
    return RespostaServidor.criar(200, '', await CbFerramenta.findAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        nome: { [Sequelize.Op.like]: `%${q}%` },
      },
      attributes: ["id", "empresa_id", "nome"],
      limit: 30
    }));
  }

  async buscaEquipamentoInspecao(requestParams: ParamsDictionary, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q } = requestQuery;
    return RespostaServidor.criar(200, '', await CbInstrumentoInspecao.findAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        nome: { [Sequelize.Op.like]: `%${q}%` },
      },
      attributes: ["id", "empresa_id", "nome"],
      limit: 30
    }));
  }

  async buscaTintaPlanejamento(requestParams: ParamsDictionary, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q } = requestQuery;
    let tintas;
    const Op = Sequelize.Op;

    if (q != undefined || q != null) {
      tintas = await PtTintaPlanejamento.findAll({
        where: {
          empresa_id: empresaId,
          nome: { [Op.like]: `%${q}%` },
        },
        limit: 30
      });
    } else {
      tintas = await PtTintaPlanejamento.findAll({
        where: {
          empresa_id: empresaId,
        },
        limit: 30
      });
    }

    return RespostaServidor.criar(200, '', tintas);
  }

  async buscaTinta(requestParams: ParamsDictionary, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q, tipoAplicacaoId } = requestQuery;
    return RespostaServidor.criar(200, '', await PtTinta.findAll({
      where: {
        empresa_id: empresaId,
        nome: { [Sequelize.Op.like]: `%${q}%` },
      },
      limit: 30,
      order: [
        ['nome', 'ASC'],
        ['espessura_eps_min', 'ASC'],
      ]
    }));
  }

  async buscaUnidade(requestParams: ParamsDictionary, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q } = requestQuery;
    return RespostaServidor.criar(200, '', await PtUnidade.findAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        nome: { [Sequelize.Op.like]: `%${q}%` },
      },
      limit: 30
    }));
  }

  async buscaMaterialConsumo(requestParams: ParamsDictionary, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();
    const { empresaId } = requestParams;
    const { q } = requestQuery;
    return RespostaServidor.criar(200, '', await PtMaterialConsumo.findAll({
      where: {
        empresa_id: empresaId,
        deletado: false,
        nome: { [Sequelize.Op.like]: `%${q}%` },
      },
      attributes: ["id", "empresa_id", "nome"],
      limit: 30
    }));
  }


  async buscaAtivos(requestParams: ParamsDictionary, requestQuery: any): Promise<RespostaServidor> {
    this._iniciaSequelize();

    const { empresaId } = requestParams;
    const { q, ativoHierarquiaId } = requestQuery;

    let ativos;

    if (q != undefined || q != null) {
      const Op = Sequelize.Op;
      ativos = await CbAtivo.findAll({
        where: {
          empresa_id: empresaId,
          nome: { [Op.like]: `%${q}%` },
          ativo_hierarquia_id: ativoHierarquiaId
        },
        limit: 30
      });
    } else
      ativos = await CbAtivo.findAll({
        where: {
          empresa_id: empresaId,
        },
      });
    return RespostaServidor.criar(200, '', ativos);
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










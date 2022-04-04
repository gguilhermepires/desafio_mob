import { RespostaServidor } from '../models/resposta_servidor';
import ConversaoData from '../infrastructure/conversaoData';
import ConversaoDadoGeografico from '../infrastructure/conversaoDadoGeografico';
import PoiService from '../services/poiService';
import debug from "debug";
const log = debug('desafio:domain:PoiDomain');
export class PoiDomain {

  async buscaTabelaTempoPois(requestQuery: any): Promise<RespostaServidor> {
    log('buscaTabelaTempoPois');

    let { placa, limit, offset, data } = requestQuery;
    

    if (placa == undefined || placa == null)
      placa = '';

    if (limit == undefined && limit == null)
      limit = 30;
    if (offset == undefined && offset == null)
      offset = 0;

    limit = Number(limit);
    offset = Number(offset);
    
    let poiService = new PoiService();

    let listaPoi = await poiService.buscaListaPontoInteresse({
      limit: limit,
      offset: offset
    });

    let listaVeiculos = await poiService.buscaListaVeiculos({
      placa: placa,
      data: ConversaoData.converteDataParaDataBanco(data),
      limit: limit,
      offset: offset
    });

    let listaVeiculosDentroPois = this._buscaVeiculosDentroPonto(listaPoi, listaVeiculos);

    let resposta = this._calculaTempoVeiculosDentroPonto(listaVeiculosDentroPois);

    return RespostaServidor.criar(200, `Lista processada com sucesso`, resposta);
  }

  _calculaTempoVeiculosDentroPonto(listaVeiculosDentroPois: any) {
    let dicionarioTempo: any = {};
    let veiculos: any,
      placa: any;

    for (let i = 0; i < listaVeiculosDentroPois.length; i++) {

      veiculos = listaVeiculosDentroPois[i]?.veiculos;

      for (let j = 0; j < veiculos.length; j++) {

        placa = veiculos[j].veiculo.placa;

        if (this._veiculoEstaForaDoDicionario(dicionarioTempo, placa)) {

          dicionarioTempo = this._adicionaVeiculoNovo({
            dicionario: dicionarioTempo,
            placa: placa,
            ultimaData: veiculos[j].veiculo.data_posicao
          });

        } else {
          dicionarioTempo = this._adicionaTempoNoVeiculo({
            dicionario: dicionarioTempo,
            placa: veiculos[j].veiculo.placa,
            ultimaData: veiculos[j].veiculo.data_posicao
          });
        }

      }//j
      listaVeiculosDentroPois[i] = {
        ponto: listaVeiculosDentroPois[i].ponto,
        tempoVeiculos: dicionarioTempo
      };
    }//i

    return listaVeiculosDentroPois;
  }

  _adicionaTempoNoVeiculo({
    dicionario,
    placa,
    ultimaData
  }: { dicionario: any, placa: any, ultimaData: any }) {

    const diferenca = ConversaoData.diferencaEntreDatas(
      ConversaoData.converteDataBancoParaDataMoment(dicionario[placa].ultima_data),
      ConversaoData.converteDataBancoParaDataMoment(ultimaData)
    );

    let { dia, hora, minuto, segundo } = dicionario[placa].tempo;

    let datas = dicionario[placa].datas;
    datas.push(ultimaData);

    dicionario[placa] = {
      placa: placa,
      ultima_data: ultimaData,
      datas: datas,
      tempo: {
        dia: dia + diferenca.asDays(),
        hora: hora + diferenca.asHours(),
        minuto: minuto + diferenca.asMinutes(),
        segundo: segundo + diferenca.asSeconds()
      }
    };

    return dicionario;
  }

  _adicionaVeiculoNovo({ dicionario, placa, ultimaData }: { dicionario: any; placa: any; ultimaData: any; }): any {
    dicionario[placa] = {
      placa: placa,
      ultima_data: ultimaData,
      datas: [ultimaData],
      tempo: {
        dia: 0,
        hora: 0,
        minuto: 0,
        segundo: 0
      }
    };
    return dicionario;
  }

  _veiculoEstaForaDoDicionario(dicionario: any, chave: any) {
    return dicionario[chave] == undefined || dicionario[chave] == null;
  }

  _buscaVeiculosDentroPonto(pois: any, posVeiculos: any) {
    let response = [];
    let item: any;
    for (let i = 0; i < pois.length; i++) {
      item = { ponto: pois[i], veiculos: [] }
      for (let j = 0; j < posVeiculos.length; j++) {
        let distancia = ConversaoDadoGeografico.getDistanceFromLatLonInKm(
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
      }//j
      response.push(item);
    }//i
    return response;
  }
}










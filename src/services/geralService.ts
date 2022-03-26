import Geral from "../models/os/geral";
// @ts-ignore
import { isJwtExpired } from 'jwt-check-expiration';
import debug from "debug";
import { Transaction } from 'sequelize';
import TipoOs from "../models/os/tipoOs";
import StatusOs from "src/models/os/statusOs";
import AbaGeral from "src/models/os/abaGeral";
const log = debug('desafio:service:user');


class GeralService {
   
  static refreshToken(): string | null {
    throw new Error('Method not implemented.');
  }

  static async criaGeral(dataEmissao: string, tipo:TipoOs, 
    nOs: string, status:StatusOs, horaPrevInicio: string,
    horaPrevFim:string,horaRealInicio:string,horaRealFim:string, prodHist:number, 
    prodMedPrev:number, prodMedReal:number, justificativa:string, 
    comentario:string//, fotos:any, componentes:any, projetos: any
    ): Promise<any> {
    
      let geralObj: AbaGeral = new AbaGeral();
     // geralObj.data = data;
      geralObj.dataEmissao = dataEmissao;
      geralObj.tipoDeOs = tipo;
      geralObj.numeroOs = nOs;
      geralObj.status = status;
      geralObj.horaPrevistaInicio = horaPrevInicio;
      geralObj.horaPrevistaFim = horaPrevFim;
      geralObj.horaRealFim = horaRealFim;
      geralObj.horaRealInicio = horaRealInicio;
      geralObj.produtividadeHistorica = prodHist;
      geralObj.comentario = comentario;
      geralObj.produtividadeMediaPrevista = prodMedPrev;
      geralObj.produtividadeMediaReal = prodMedReal;
      geralObj.justificativa = justificativa;
     /* geralObj.fotos = fotos;
      geralObj.projetos = projetos;
      geralObj.componentes = componentes;
*/
      return geralObj;      
  }

  static async saveGeral(geral: any) {
    await geral.save();
  }

}

export default GeralService;


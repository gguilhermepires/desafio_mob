// @ts-ignore
import { isJwtExpired } from 'jwt-check-expiration';
import debug from "debug";
import { Transaction } from 'sequelize';
import Preparo from "../models/os/Preparo";
import { List } from "lodash";
import Tinta from "../models/os/Tinta";
import AplicacaoTintaTipo from "../models/os/AplicacaoTintaTipo";
import AplicacaoTinta from "../models/os/AplicaTinta";
import PreparoSuperficie from "../models/os/PreparoSuperficie";
import Pintura from '../models/os/pintura';
const log = debug('desafio:service:user');


class PinturaService {
   
  static refreshToken(): string | null {
    throw new Error('Method not implemented.');
  }
  

  static async criaPintura(listaPreparoSuperficie:List <PreparoSuperficie>, listaAplicacao:List <AplicacaoTinta>
  
    ): Promise<any> {
    
      let pintura: Pintura = new Pintura();
      pintura.cria({ listaPreparoSuperficie, listaAplicacao});
      
      return pintura;      
  }

  static async savePintura(pintura: any) {
    await pintura.save();
  }

}

export default PinturaService;


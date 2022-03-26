import Geral from "../models/os/geral";
// @ts-ignore
import { isJwtExpired } from 'jwt-check-expiration';
import debug from "debug";
const log = debug('desafio:service:user');


class OsService {
   
  static buscaOsPorId(): string | null {
    throw new Error('Method not implemented.');
  }
  static buscaRdo(): string | null {
    throw new Error('Method not implemented.');
  }
}

export default OsService;


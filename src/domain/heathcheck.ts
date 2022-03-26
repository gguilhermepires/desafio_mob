//import database from '../models/index';
// import debug from "debug";
// const log = debug('desafio:domain:healthcheck');

export class HealthcheckDomain {
  static async checkDatabase() {
    return false;
 //   await database.getInstance().authenticate();
  }
}

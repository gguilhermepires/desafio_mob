import { BCRYPT_SALT } from '../infrastructure/constants';
import bcrypt from 'bcryptjs';
import debug from "debug";
// @ts-ignore 
const log = debug('desafio:service:crypto');

class CryptoService {
    static async compare(senha:string, passwordHash:string): Promise<Boolean> {
      let comp1 = await bcrypt.compareSync(senha, passwordHash);
      return comp1;
    }
    static encrypt(text:string){
      return bcrypt.hashSync(text, BCRYPT_SALT);
    }
}

export default CryptoService;


import { BCRYPT_SALT } from '../infrastructure/constants';
import bcrypt from 'bcryptjs';
// import debug from "debug";
// const log = debug('desafio:service:user');

class TokenService {
    static async compare(password1:string, password2:string): Promise<Boolean> {
      return await bcrypt.compare(password1, password2);
    }
    static encrypt(text:string){
      return bcrypt.hashSync(text, BCRYPT_SALT);
    }
}

export default TokenService;


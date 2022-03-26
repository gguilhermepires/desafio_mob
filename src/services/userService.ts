import * as CustomTypes from "../infrastructure/customTypes";
import CacheServer from "../infrastructure/cacheServer";
import UserAccount from "../models/user/account";
import AclUserRole from "../models/acl/user_role";
import Grant from "../models/acl/grant";
import jwt from "jsonwebtoken";
// @ts-ignore
import { isJwtExpired } from 'jwt-check-expiration';
import cuid from "cuid";
import EmailAPI from "../infrastructure/EmailAPI";
import debug from "debug";
import CryptoService from "./cryptoService";
import fs from "fs";
import { Transaction } from 'sequelize';
// @ts-ignore 
const log = debug('desafio:service:user');

const privateKey = fs.readFileSync(
  __dirname + '/../infrastructure/keys/private.key',
  'utf8',
);

class UserService {
   
  static async attachDefaultRoleOnUser(user: UserAccount, t:Transaction) {
    let deafultRole:string = 'default';
    return this.attachRoleOnUser(user, deafultRole, t);
  }

  static async attachRoleOnUser(user: UserAccount,role:string, t:Transaction) {
    let acRole = undefined;
    if(user.id == null)
      throw new Error('Não é possível atachar default role em um usuário com id nulo')
    let userId:number = user.id;
    acRole = await AclUserRole.findOne({where: {user_id: userId,role}});
    if(acRole == undefined){
      // @ts-ignore
        if(t!= null)
          acRole = await AclUserRole.createUserRole({user_id: userId,role},t);
        else
          acRole = await AclUserRole.createUserRole({user_id: userId,role});
      
        if(acRole == undefined)
          throw Error(`Não foi possível criar uma role para o usuario ${userId}`)
    }
    return [acRole.role]
  }

  static refreshToken(): string | null {
    throw new Error('Method not implemented.');
  }

  static generateToken(userAccount: UserAccount): string | null {
    return jwt.sign({userId: userAccount.id, email: userAccount.email,}, privateKey, {
      issuer: 'PhotoCoat',
      audience: 'https://www.google.com.br',
      expiresIn: '365d',
      algorithm: 'RS256',
    });
  }

  static async passwordTheSame(userAccount: UserAccount, senha: string): Promise<Boolean> {
    return await CryptoService.compare(senha, userAccount.password);
  }

  static async updateUserOnCacheServer(userCacheServer: CustomTypes.userCacheServer){
    const key = `user_${userCacheServer.email}`;
    await CacheServer.set(key, userCacheServer, undefined);
  }

  static async getUserFromCacheServer(email: string | null): Promise<CustomTypes.userCacheServer | null> {
    //limpar email para não dar problema
    const key = `user_${email}`;
    var cachedUser:CustomTypes.userCacheServer = await CacheServer.get(key)
    return cachedUser;
  }

  static async createUserAccount(email: string, password:string, t:Transaction|null=null): Promise<any> {
    if(t != null){
      return await await UserAccount.create({
        email:email,
        password:CryptoService.encrypt(password),
        emailConfirmationToken: UserService.generateCuid(),
      },{transaction: t});
    }

    return await await UserAccount.create({
      email:email,
      password:CryptoService.encrypt(password),
      emailConfirmationToken: UserService.generateCuid(),
    });
  }

  static async getRoles(userAccountId: number): Promise<any> {
    return await AclUserRole.userRoles(userAccountId);
  }

  static async createDefaultRole(userAccountId: number ) {
    let role:string = 'guest';

    let acRole = undefined;
    acRole = await AclUserRole.findOne({where: {user_id: userAccountId,role}});

    if( acRole == undefined){
      // @ts-ignore
        acRole = await AclUserRole.createUserRole({user_id: userAccountId,role: role});
        if(acRole == undefined)
          throw Error(`Não foi possível criar uma role para o usuario ${userAccountId}`)
    }
    return [acRole.role]
  }

  static async getGrantsAttributes(roles: any) {
    let response = [];
    for ( let i =0; i< roles.length ; i++ ){
      let grants = await Grant.getGrantByRole(roles[i]);
      response.push({
        role:roles[i],
        resources: grants.map( g => {
          return {
            name:g.resource,
            attributes: g.attributes }
        })
      });
    }
    return response;
  }

  static async getUserAccountByEmail(email: string): Promise<UserAccount | null> {
    return await UserAccount.scope('signIn').findOne({ where :{ email: email }});
  }
 
  static async openToken(token: string) {
    return jwt.decode(token);
  }

  static async isJwtExpired(token: string) {
    return isJwtExpired(token)
  }

  static generateCuid() {
    return cuid();
  }

  static async saveUserAccount(user: any) {
    await user.save();
  }

  static generateResetLinkPassword(resetPasswordToken: string): string{
    if(!process.env.HOST_FORGET_PASSWORD)
        throw new Error('HOST_FORGET_PASSWORD não pode ser vazio');
    return `${process.env.HOST_FORGET_PASSWORD}/resetpassword?token=${resetPasswordToken}`
  }

  static async sendEmailForgetPassword(email:string, resetPasswordToken:string) {
    return await EmailAPI.sendEmailResetPassword(email, this.generateResetLinkPassword(resetPasswordToken))
  }

  static async getUserAccountByResetPasswordToken(token: any) {
    return await UserAccount.findOne({ where :{ reset_password_token: token }})
  }
}

export default UserService;


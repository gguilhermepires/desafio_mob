import { NextFunction, Request, Response } from 'express';
import {UserDomain} from "../domain/user";
import * as CustomTypes from "../infrastructure/customTypes";
import debug from "debug";
const log = debug('desafio:auth:server');

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response<unknown>> => {
  try{
      const authHeader: any = req.headers.authorization;
      log(authHeader);
      
      const userDomain = new UserDomain();
      const userCacheServer: CustomTypes.userCacheServer = await userDomain.authenticateRequest(authHeader);
      res.locals.user = userCacheServer;
   
      
      return next();
      
  }catch (e) {
    log('erro ao autenticar', e);
    return res.status(401).send(e);
  }
};

export default auth;

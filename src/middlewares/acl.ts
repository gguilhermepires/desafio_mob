import AclGrant, { Actions } from '../models/acl/grant';
import { NextFunction, Request, Response } from 'express';

import { AccessControl } from 'accesscontrol';
import logger from '../infrastructure/logger';

export default function acl(
  action: Actions,
  resource: string,
  attribute: string
): (_req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async function (_req: Request, res: Response, next: NextFunction) {
    try {

      const grants = await AclGrant.allGrants();
      if (grants.length == 0) {
        return res.status(403).end();
      }

      const ac = new AccessControl(grants);
      logger.debug(
        'ACL Middleware - Action: %s - Resource: %s - Roles: %s',
        action,
        resource,
        res.locals.user.roles,
      );

      if(res.locals.user.roles === undefined){
        logger.debug(' ***************** Permissao negada ACL linha 29 ********************');
        return res.status(403).end();
      }

      const permission = ac.can(res.locals.user.roles)[action](resource);
       if (!permission.granted) {
        logger.debug(' ***************** Permissao negada ACL  linha 35 ********************');
        return res.status(403).end();
      }

       let find = permission.attributes.find( att =>{
        logger.debug(`${att}  - ${attribute}`);
         if(att.includes(attribute) || att === '*')
           return true;
         return false;
       })
      if (find == undefined){
        logger.debug(' ***************** Permissao negada ACL linha 45 ********************');
        return res.status(403).end();
      }


      res.locals.permission = permission;
      res.locals.grants = grants;
      return next();
    } catch (error) {
      logger.debug(' ***************** Permissao negada ACL ********************');
      return next(error);
    }
  };
}

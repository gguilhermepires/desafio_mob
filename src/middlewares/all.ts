import { NextFunction, Request, Response } from 'express';

export default function (
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  res.locals.ip = ip;

  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );

  return next();
}

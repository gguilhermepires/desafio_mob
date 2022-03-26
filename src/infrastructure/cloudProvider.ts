import { Request, Response } from "express";
import * as AWS from 'aws-sdk';
import { arquivo } from '../infrastructure/arquivo';

import debug from "debug";
//@ts-ignore
const log = debug('desafio:os:avatar');

class CloudProvider {

  async removerImagem(imagemKey:string) {
    try {
      const s3: AWS.S3 = new AWS.S3({apiVersion: '2006-03-01'});
      const bucket_name: string = 'stag-desafio-os-geral-fotos';
      var resp = await s3.deleteObject({
        Bucket: bucket_name,
        Key: imagemKey,
      }).promise();
      return resp
    } catch (error) {
      return false;
    }
  }
  //@ts-ignore
  public async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        try {
          const s3: AWS.S3 = new AWS.S3({apiVersion: '2006-03-01'});
          const bucket_name: string = 'stag-desafio-os-geral-fotos';
          const key = `${req.body.caminhoServidor}/${req.file.filename}`;
          var resp = await s3.putObject({
            Bucket: bucket_name,
            Key: key,
            Body: await arquivo.abrirArquivoSync(req.file.path) 
          }).promise();
  
          res.locals.file = req.file;
          res.locals.fileKey = key;
          res.locals.respostaCloud = resp;
          arquivo.removerArquivoSync(req.file.path);
          next();
        } catch (error) {
          arquivo.removerArquivoSync(req.file.path);
        }
      }else{
        res.status(409);
        return res.json({
          response: `Não é um tipo de arquivo válido`,
        });
      }
    } catch (error) {
      if (req.file) {
        arquivo.removerArquivoSync(req.file.path);
      }
      res.status(500);
      return res.json({
        response: `Erro no provedor cloud`,
      });
    }
  }
}

export const cloudProvider = new CloudProvider();
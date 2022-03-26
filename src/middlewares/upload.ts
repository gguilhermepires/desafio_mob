//@ts-nocheck
import multer from "multer"; 
import path from "path"; 
import { Request } from "express";
import { arquivo } from '../infrastructure/arquivo';

import debug from "debug";
const log = debug('desafio:os:upload');

class UploadImagem {
  private URL: string = path.basename('upload'); 

  constructor() {}

  private storage(): multer.StorageEngine {
    return multer.diskStorage({
      //Criar o destino do arquivo
      destination: (req, file, cb) => {
        if (!arquivo.diretorioExisteSync(this.URL)) {
          arquivo.criarDiretorioSync(this.URL)
        }
        cb(null, this.URL);
      },
      filename: (req, file, cb) => {
        const type = this.extrairTipoArquivo(file.mimetype);
        cb(null, `${new Date().getTime()}.${type}`);
      },
    });
  }

  private extrairTipoArquivo(mimetype:String){
      if(mimetype == "")
        return ""
      let vetor = mimetype.split('/');
      if(vetor.length > 1)
        return vetor[vetor.length-1];
      return vetor[0];
  }

  private fileFilter() {
    return (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      const conditions = ["png", "jpg", "jpeg"];
      if (conditions.includes(`${this.extrairTipoArquivo(file.mimetype)}`)) {
        cb(null, true);
      }
      cb(null, false);
    };
  }

  get getConfig(): multer.Options {
    return {
      storage: this.storage(), //Storage serve para compor a config do multer destination e filename
      fileFilter: this.fileFilter(),     //FileFilter serve para validar o filtro de arquivos
    };
  }
}

export const uploadImagem = new UploadImagem();
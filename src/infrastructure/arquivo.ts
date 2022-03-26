import * as fs from 'fs';

class Arquivo {
    
    diretorioExisteSync(path: string) {
        try {
          return fs.existsSync(path);
        } catch (error) {
            return false;
        }
    }

    async removerArquivoSync(path: string) {
        try {
            fs.rmSync(path);
            return true;
        } catch (error) {
            return false;
        }
    }
    async abrirArquivoSync(path: string) {
        try {
            return fs.readFileSync(path)
        } catch (error) {
            return undefined;
        }
    }

    async criarDiretorioSync(path: string) {
        try {
            fs.mkdirSync(path);
            return true;
        } catch (error) {
            return false;
        }
    }
}

export const arquivo = new Arquivo();
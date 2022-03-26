import { Router } from 'express';
import { HealthcheckDomain } from '../domain/heathcheck';

const router = Router();

router.get('/',  async (_, res) => {
  try {
    let databaseStatus:boolean =false;
    let databaseErrorMessage:string = ''; 
    try {
      await HealthcheckDomain.checkDatabase();
      databaseStatus = true;
    } catch (error:any) {
      databaseErrorMessage = error.message;
    }
    res.json({
      message: 'Bem vindo a API de Autenticação !',
      timestamp: Date.now(),
      databaseStatus:databaseStatus,
      databaseMessage:databaseErrorMessage,
    });
  } catch (error:any) {
    let message = error.message ? error.message: 'Erro ao processar requisição';
    res.status(500).json(message);
  }
});

router.get('/database',  async (_, res) => {
  try {
      await HealthcheckDomain.checkDatabase();
      res.json({
        message: 'Banco de dados está funcionando',
        timestamp: Date.now()
      });
    } catch (error: any) {
      res.status(500).json(`Não foi possível conectar no banco de dados. Exceção: ${error.message}`);
    }
});

export default router;

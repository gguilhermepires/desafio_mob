import { Router } from 'express';
import debug from "debug";
// @ts-ignore 
const log = debug('desafio:rotas:geral');
// import debug from "debug";
// const log = debug('desafio:rotas:healthcheck');

const router = Router();

router.post('/:placa/posicao', async (req, res) => {
  try {
    res.json({ok:'ok'});
   // res.json(await new EmpresaDomain().cadastroAtivo(req.params, req.body));
  } catch (error: any) {
    res.status(500).json(error.message ? error.message : '');
  }
});

router.get('/', async (req, res) => {
  try {
    res.json({ok:'ok'});
  //  res.json(await new EmpresaDomain().buscaEmpresas(res.locals.user, req.query));
  } catch (error: any) {
    res.status(500).json(error.message ? error.message : '');
  }
});

router.delete('/', async (req, res) => {
  try {
    res.json({ok:'ok'});

    //res.json(await new EmpresaDomain().removerTinta(req.body));
  } catch (error: any) {
    res.status(500).json(error.message ? error.message : '');
  }
});
router.put('/', async (req, res) => {
  try {
    res.json({ok:'ok'});

    //res.json(await new EmpresaDomain().atualizaTintaPorId(req.params, req.body));
  } catch (error: any) {
    res.status(500).json(error.message ? error.message : '');
  }
});



export default router;

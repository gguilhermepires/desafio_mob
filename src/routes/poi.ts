import { Router } from 'express';
import debug from "debug";
import 'dotenv/config'
import { PoiDomain} from '../domain/poi';
// @ts-ignore 
const log = debug('desafio:rotas:empresa');

const router = Router();

router.post('/', async (req, res) => {
  try {
    res.json({ok:'ok'});
   // res.json(awai postt new EmpresaDomain().cadastroAtivo(req.params, req.body));
  } catch (error: any) {
    res.status(500).json(error.message ? error.message : '');
  }
});

router.get('/', async (req, res) => {
  try {
    res.json(await new PoiDomain().buscaPois(req.params, req.query));
  } catch (error: any) {
    res.status(500).json(error.message ? error.message : '');
  }
});
router.get('/tabela', async (req, res) => {
  try {
    res.json(await new PoiDomain().buscaTabelaTempoPois(req.params, req.query));
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

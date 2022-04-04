import { Router } from 'express';
import 'dotenv/config'
import { PoiDomain} from '../domain/poi';

const router = Router();

router.get('/tabela', async (req, res) => {
  try {
    res.json(await new PoiDomain().buscaTabelaTempoPois(req.query));
  } catch (error: any) {
    res.status(500).json(error.message ? error.message : '');
  }
});

export default router;

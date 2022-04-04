import express from 'express';
import poi from './poi';

const versao = 'v1';

const app = express();
const router = express.Router();

router.get('/', function (_req, res) {
  res.json({ message: 'Bem vindo a API', timestamp: Date.now() });
});

router.post('/', function (_req, res) {
  res.json({ message: 'Bem vindo a API', timestamp: Date.now() });
});

app.use(`/api/${versao}`, router);
app.use(`/api/${versao}/poi`, poi);

export default app;

import express from 'express';
import cors from 'cors';
import expressPino from 'express-pino-logger';
import logger from './infrastructure/logger';
import polyfills from './infrastructure/polyfills';

polyfills.init();

const app = express();
app.use(expressPino({ logger }));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const routes = require('./routes').default; //TODO: Separar a conexão com o banco das rotas
app.use(routes);

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

export { app };

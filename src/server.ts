require('dotenv').config();

import debug from 'debug';
import { app } from './app';

const log = debug('desafio:server');
const logError = debug('desafio:server:error');

process.on('unhandledRejection', (reason, promise) => {
  logError(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`,
  );
  // lets throw the error and let the uncaughtException handle below handle it
  throw reason;
});

process.on('uncaughtException', (error) => {
  logError(
    `App exiting due to an uncaught exception: ${error}`,
    error,
    error.stack,
  );
  //process.exit(ExitStatus.Failure);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  log(`Server http started on port ${port} at ${new Date()}`);
});


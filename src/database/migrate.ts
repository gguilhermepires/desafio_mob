import { Options, spawn } from 'child-process-promise';

import { SpawnOptions } from 'child_process';
import debug from 'debug';

const log = debug('desafio:db:migrate');

const spawnOptions: Readonly<Options & SpawnOptions> = { stdio: 'inherit' };
(async () => {
  try {
    // Migrate the DB
    await spawn(
      './node_modules/.bin/sequelize',
      ['db:migrate', '--env', process.env.NODE_ENV || 'development'],
      spawnOptions,
    );
    log('*************************');
    log('Migration successful');
  } catch (err:any) {
    // Oh no!
    log('*************************');
    log('Migration failed. Error:', err.message);
    process.exit(1);
  }
  process.exit(0);
})();

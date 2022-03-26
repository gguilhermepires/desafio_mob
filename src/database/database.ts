import config from './config';

type Environment = keyof typeof config;
const environment: Environment = (process.env.NODE_ENV ||
  'development') as Environment;

const options: unknown = config[environment];
export default options;

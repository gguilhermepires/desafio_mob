import pino from 'pino';

export default pino({
  name: process.env.APP_ID,
  enabled: Boolean(process.env.LOGGER_ENABLED || true),
  level: process.env.LOGGER_LEVEL || 'info',
});

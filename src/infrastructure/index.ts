import { AxiosError } from 'axios';
import { ValidationError } from 'joi';
import debug from 'debug';

const log = debug('desafio:helpers');

export function handleError(
  error: Error & ValidationError & AxiosError,
): { status: number; data: unknown } {
  const status = error.isJoi
    ? 400
    : error.response
    ? error.response.status
    : 500;
  const data = error.response
    ? error.response.data
    : error.request
    ? error.request
    : error;

  log({ status, data });

  return { status, data };
}

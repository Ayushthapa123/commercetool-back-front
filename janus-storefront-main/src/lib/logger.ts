import { isAxiosError } from "axios";
import pino from "pino";
import pretty from "pino-pretty";

const stream = pretty({
  colorize: true,
});

export const logger = pino({ base: undefined }, stream);

/** Log AxiosError if it is from Axios, otherwise log regular error */
export function logError(error: unknown, message: string): void {
  const logObject = isAxiosError(error) ? error.response?.data : error;
  logger.error(logObject, message);
}

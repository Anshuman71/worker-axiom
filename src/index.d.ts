export type AxiomClientConfig = {
  apiToken: string;
  orgId: string;
  datasetName: string;
};

export type LoggerData = { [key: string]: any };

/**
 * Create an Axiom client that returns a logger function.
 *
 * ```js
 * import { createAxiomClient } from 'worker-axiom'
 * const createLogger = createAxiomClient({ orgId: 'orgId', datasetName: 'dataset', apiToken: env.AXIOM_API_TOKEN });
 * ```
 *
 * @param AxiomClientConfig Axiom client config.
 * @returns A logger creator function.
 */
export function createAxiomClient(config: AxiomClientConfig): (
  data?: LoggerData
) => {
  /**
   * Log a message and store it to batch send to Axiom.
   *
   * @param message The message to log.
   * @param data Any metadata to log with the message.
   */
  log: (message: string, data?: LoggerData) => void;
  /**
   * Send the logs to Axiom
   *
   * @param logDuration Log the time lapsed between first and last log. Default false.
   * @returns Promise.
   */
  sendLogs: (logDuration?: boolean) => Promise<any>;
  /**
   * Update the logger data to be sent with each log.
   *
   * @param data New metadata to merge with current loggerData.
   */
  updateLoggerData: (data: LoggerData) => void;
};

/**
 * Get request metadata.
 *
 * @param request Incomming Cloudflare request object.
 * @returns Request metadata.
 *
 * ```js
 * const { getRequestMetadata } = require('worker-axiom')
 * getRequestMetadata(request)
 * ```
 */
export function getRequestMetadata(request: Request): {
  requestID: string;
  method: string;
  url: string;
  headers: string;
  userIP: string;
  country: string;
  serverEndpoint: string;
  referer: string;
  origin: string;
  apiEndpoint: string;
};

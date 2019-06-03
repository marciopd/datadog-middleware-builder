import * as ConnectDatadog from 'connect-datadog';
import * as StatsD from 'node-statsd';
import { JsonLogger, LoggerFactory } from 'json-logger-service';

const GLOBAL_STATSD_CLIENT = true;
const MOCK_CLIENT = false;
const METRICS_PREFIX = '';
const METRICS_SUFFIX = '';

export class DatadogMiddlewareBuilder {
  public static build(agentHost: string, agentPort: number,
                      serviceName: string,
                      cacheDns: boolean, globalTags: string[]): any {
    const statsdClient = new StatsD(
      agentHost,
      agentPort,
      METRICS_PREFIX,
      METRICS_SUFFIX,
      GLOBAL_STATSD_CLIENT,
      cacheDns,
      MOCK_CLIENT,
      globalTags,
    );

    statsdClient.socket.on('error', (error: any) => {
      return this.LOGGER.error(error, 'Error sending metrics to Datadog.');
    });

    return ConnectDatadog({
      dogstatsd: statsdClient,
      stat: serviceName,
      path: false,
      response_code: true,
    });
  }

  private static readonly LOGGER: JsonLogger = LoggerFactory.createLogger(DatadogMiddlewareBuilder.name);
}

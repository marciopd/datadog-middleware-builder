import * as StatsD from 'node-statsd';
import {JsonLogger, LoggerFactory} from 'json-logger-service';

const GLOBAL_STATSD_CLIENT = false;
const MOCK_CLIENT = false;
const METRICS_PREFIX = '';
const METRICS_SUFFIX = '';

export class StatsdSingletonFactory {
    public static setupFactory(agentHost: string, agentPort: number,
                               cacheDns: boolean, globalTags: string[]): void {
        if (this.FACTORY) {
            throw new Error('Factory already created');
        }
        this.FACTORY = new StatsdSingletonFactory(agentHost, agentPort, cacheDns, globalTags);
    }

    public static getStatsdClient(): StatsD {
        return this.FACTORY.getClient();
    }

    private static FACTORY: StatsdSingletonFactory;

    private readonly LOGGER: JsonLogger = LoggerFactory.createLogger(StatsdSingletonFactory.name);
    private client: StatsD;

    private constructor(private readonly agentHost: string,
                        private readonly agentPort: number,
                        private readonly cacheDns: boolean,
                        private readonly globalTags: string[]) {
    }

    private getClient(): StatsD {
        if (!this.client) {
            this.buildClient();
        }
        return this.client;
    }

    private buildClient(): StatsD {
        this.client = new StatsD(
            this.agentHost,
            this.agentPort,
            METRICS_PREFIX,
            METRICS_SUFFIX,
            GLOBAL_STATSD_CLIENT,
            this.cacheDns,
            MOCK_CLIENT,
            this.globalTags,
        );

        this.client.socket.on('error', (error: any) => {
            return this.LOGGER.error(error, 'Error sending metrics to Datadog.');
        });
    }
}

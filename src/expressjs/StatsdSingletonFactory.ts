import {StatsD} from 'hot-shots';
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

    private buildClient(): void {
        const agentHost = this.agentHost;
        const agentPort = this.agentPort;
        const cacheDns = this.cacheDns;
        const globalTags  = this.globalTags;
        this.client = new StatsD({
                host: agentHost,
                port: agentPort,
                prefix: METRICS_PREFIX,
                suffix: METRICS_SUFFIX,
                globalize: GLOBAL_STATSD_CLIENT,
                cacheDns: cacheDns,
                mock: MOCK_CLIENT,
                globalTags: globalTags,
            },
        );

        this.client.socket.on('error', (error: any) => {
            return this.LOGGER.error(error, 'Error sending metrics to Datadog.');
        });
    }
}

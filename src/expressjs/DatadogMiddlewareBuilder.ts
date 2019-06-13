import * as ConnectDatadog from 'connect-datadog';
import * as StatsD from 'node-statsd';

export class DatadogMiddlewareBuilder {
    public static build(statsdClient: StatsD,
                        serviceName: string): any {
        return ConnectDatadog({
            dogstatsd: statsdClient,
            stat: serviceName,
            path: false,
            method: true,
            response_code: true,
        });
    }
}

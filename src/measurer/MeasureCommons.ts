import {StatsdSingletonFactory} from '../expressjs/StatsdSingletonFactory';

let statsdClient = undefined;

const SUCCESS_CODE = 200;
const ALL_RESPONSES_CODE = 'all';

const STUB_CLIENT = {
    histogram: (metricName: string, responseTime: number, rate: number) => {
        return undefined;
    },
    increment: (metricName: string, incrementCount: number) => {
        return undefined;
    },
};

const getStatsdClient = () => {
    if (!statsdClient) {
        try {
            statsdClient = StatsdSingletonFactory.getStatsdClient();
        } catch (error) {
            console.warn('No statsd client available.');
            statsdClient = STUB_CLIENT;
        }
    }
    return statsdClient;
};

const sendResponseTimeMetric = (metricName: string, start: number) => {
    getStatsdClient().histogram(`${metricName}.response_time`, Date.now() - start, 1);
};

const sendResponseCodeMetric = (metricName: string, responseCode: number | string) => {
    getStatsdClient().increment(`${metricName}.response_code.${responseCode}`, 1);
};

const sendResponseMetrics = (metricName: string, startTime: number, responseCode: number | string): void => {
    sendResponseTimeMetric(metricName, startTime);
    sendResponseCodeMetric(metricName, responseCode);
    sendResponseCodeMetric(metricName, ALL_RESPONSES_CODE);
};

const getErrorCode = (error: any): number => {
    return error && error.statusCode || error && error.response && error.response.status || 500;
};

export const sendErrorResponseMetrics = (metricName: string, startTime: number, error: any): void => {
    const errorCode = getErrorCode(error);
    sendResponseMetrics(metricName, startTime, errorCode);
};

export const sendOkResponseMetrics = (metricName: string, startTime: number): void => {
    sendResponseMetrics(metricName, startTime, SUCCESS_CODE);
};

import {StatsdSingletonFactory} from '../expressjs/StatsdSingletonFactory';

let statsdClient = undefined;

const SUCCESS_CODE = 200;

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

const sendResponseCodeMetric = (metricName: string, errorCode: number) => {
    getStatsdClient().increment(`${metricName}.response_code.${errorCode}`, 1);
};

export const measureTime = (metricName: string, fn: () => Promise<any>): Promise<any> => {
    const onPromiseDone = (result) => {
        sendResponseTimeMetric(metricName, start);
        sendResponseCodeMetric(metricName, SUCCESS_CODE);
        return result;
    };
    const onPromiseError = (error) => {
        sendResponseTimeMetric(metricName, start);
        const errorCode = error && error.statusCode || error && error.response && error.response.status || 500;
        sendResponseCodeMetric(metricName, errorCode);
        return Promise.reject(error);
    };
    const start: number = Date.now();
    return fn().then(onPromiseDone, onPromiseError);
};

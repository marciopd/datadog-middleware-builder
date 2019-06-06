import {sendErrorResponseMetrics, sendOkResponseMetrics} from './MeasureCommons';

export const measurePromise = <T>(metricName: string, fn: () => Promise<T>): Promise<T> => {
    const onPromiseDone = (result) => {
        sendOkResponseMetrics(metricName, startTime);
        return result;
    };
    const onPromiseError = (error) => {
        sendErrorResponseMetrics(metricName, startTime, error);
        return Promise.reject(error);
    };
    const startTime: number = Date.now();
    return fn().then(onPromiseDone, onPromiseError);
};

import {sendErrorResponseMetrics, sendOkResponseMetrics} from './MeasureCommons';

export const measurePromise = <T>(metricName: string, fn: () => Promise<T>): Promise<T> => {
    const onPromiseDone = (result) => {
        sendOkResponseMetrics(metricName, Date.now() - startTime);
        return result;
    };
    const onPromiseError = (error) => {
        sendErrorResponseMetrics(metricName, Date.now() - startTime, error);
        return Promise.reject(error);
    };
    const startTime: number = Date.now();
    return fn().then(onPromiseDone, onPromiseError);
};

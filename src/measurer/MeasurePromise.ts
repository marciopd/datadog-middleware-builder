import {sendErrorResponseMetrics, sendOkResponseMetrics} from './MeasureCommons';

export const measurePromise = (metricName: string, fn: () => Promise<any>): Promise<any> => {
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

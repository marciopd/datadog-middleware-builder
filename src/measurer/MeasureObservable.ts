import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {sendErrorResponseMetrics, sendOkResponseMetrics} from './MeasureCommons';

export const measureObservable = <T>(metricName: string, obs: Observable<T>): Observable<T> => {
    const startTime = Date.now();
    obs.pipe(
        tap(() => sendOkResponseMetrics(metricName, Date.now() - startTime),
            (error) => sendErrorResponseMetrics(metricName, Date.now() - startTime, error),
        ),
    );
    return obs;
};

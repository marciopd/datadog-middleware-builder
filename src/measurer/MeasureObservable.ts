import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {sendErrorResponseMetrics, sendOkResponseMetrics} from './MeasureCommons';

export const measureObservable = (metricName: string, obs: Observable<any>): Observable<any> => {
    const startTime = Date.now();
    return obs.pipe(
        tap(() => sendOkResponseMetrics(metricName, Date.now() - startTime),
            (error) => sendErrorResponseMetrics(metricName, Date.now() - startTime, error),
        ),
    );
};

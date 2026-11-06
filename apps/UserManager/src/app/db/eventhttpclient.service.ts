import { logConsole } from '../console-log';

import {throwError as observableThrowError, Subject} from 'rxjs';
import { timeout, catchError, takeUntil } from 'rxjs/operators';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/catch';
import { ExternalHttpClient } from './httpclient.service';

@Injectable()
export class HttpClientAPI {

  headers;

  constructor(private http: ExternalHttpClient) {
    this.headers = new Headers();
  }

  setHeader(header, value) {
    this.headers.append(header, value);
  }

  private catchAuthError(self: HttpClientAPI) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {

      return observableThrowError(res);
    };
  }

  get(url, params?) {
    // // logConsole('HEADERS', this.headers);
    return this.http.get(url, {
      search: params,
      headers: this.headers
    }).catch(this.catchAuthError(this));
  }

  post(url, data) {
    const postHeaders = new Headers(this.headers);
    postHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    const destroy$ = new Subject<void>();

    return this.http.post(url, body, {headers: postHeaders})
      .pipe(takeUntil(destroy$))    
      .catch(this.catchAuthError(this));
  }

  /* put(url, data) {
    const putHeaders = new Headers(this.headers);
    putHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.put(null, url, body, {headers: putHeaders})
      .catch(this.catchAuthError(this));
  } */

  delete(url, data) {
    const postHeaders = new Headers(this.headers);
    postHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.delete(null, url, {headers: postHeaders, body: body})
      .catch(this.catchAuthError(this));
  }
}

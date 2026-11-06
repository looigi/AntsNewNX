
import {throwError as observableThrowError, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
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
    // this.Utils.scriveLog('HEADERS', this.headers);
    return this.http.get(url, {
      search: params,
      headers: this.headers
    }).catch(this.catchAuthError(this));
  }

  post(url, data) {
    const postHeaders = new Headers(this.headers);
    postHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.post(url, body, {headers: postHeaders})
      .catch(this.catchAuthError(this));
  }

  /* put(url, data) {
    const putHeaders = new Headers(this.headers);
    putHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.put(url, body, {headers: putHeaders})
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

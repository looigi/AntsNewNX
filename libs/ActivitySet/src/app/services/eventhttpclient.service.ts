import { logConsole } from '../console-log';

import {throwError as observableThrowError, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import { ExternalHttpClient } from './httpclient.service';

@Injectable()
export class HttpClientAPI {

  headers;

  constructor(
    private http: ExternalHttpClient,
    private _router: Router
  ) {
    this.headers = new Headers();
  }

  setHeader(header, value) {
    this.headers.append(header, value);
  }

  private catchAuthError(Utils, self: HttpClientAPI) {
    // logConsole('Errore: ', self);
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      // logConsole('ERRORE Http: ', res);
      if (res.status === 401 || res.status === 403) {
        const currentUrl = this._router.url;
        // if not authenticated
        if (currentUrl === '/login') {
          // todo: aggiungere un messaggio di errore
          // logConsole('Login failed');
        } else {
          if (localStorage) {
            localStorage.clear();
          }

          if (Utils.userRedirect === 'default') {
            const doveURL = Utils.urlRoot + 'login/';
            // alert(doveURL);
            // const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
            // logConsole(url2);
            // const ww = window.open(doveURL, '_blank');
            location.assign(doveURL);
          } else {
            location.assign(Utils.userRedirect);
          }
        }
      }
      return observableThrowError(res);
    };
  }

  get(Utils, url, params?) {
    // logConsole('HEADERS', this.headers);
    return this.http.get(url, {
      search: params,
      headers: this.headers
    }).catch(this.catchAuthError(Utils, this));
  }

  post(Utils, url, data) {
    const postHeaders = new Headers(this.headers);
    postHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.post(url, body, {headers: postHeaders})
      .catch(this.catchAuthError(Utils, this));
  }

  /* put(Utils, url, data) {
    const putHeaders = new Headers(this.headers);
    putHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.put(url, body, {headers: putHeaders})
      .catch(this.catchAuthError(Utils, this));
  }

  delete(Utils, url, data) {
    const postHeaders = new Headers(this.headers);
    postHeaders.append('Content-Type', 'application/json');
    const body = JSON.stringify(data);
    return this.http.delete(url, {headers: postHeaders, body: body})
      .catch(this.catchAuthError(Utils, this));
  } */
}

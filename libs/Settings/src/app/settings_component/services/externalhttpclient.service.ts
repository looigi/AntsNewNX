import { logConsole } from '../../console-log';
import { of, Subject, throwError } from 'rxjs';
import {Injectable} from '@angular/core';
// import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { timeout, catchError, takeUntil } from 'rxjs/operators';
import { map } from "rxjs/operators";

@Injectable()
export class ExternalHttpClient {
  headers;

  constructor(
    private http: HttpClient,
    // private _router: Router
  ) {
    this.headers = new Headers();
  }

  setHeader(header, value) {
    this.headers.append(header, value);
  }

  private catchAuthError(self: ExternalHttpClient) {
    // // logConsole('Errore: ', self);
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      // logConsole('ERRORE Http: ', res);
      if (res.status === 401 || res.status === 403) {
        /* const currentUrl = this._router.url;
        // if not authenticated
        if (currentUrl === '/login') {
          // todo: aggiungere un messaggio di errore
          // logConsole('Login failed');
        } else {
          if (localStorage) {
            localStorage.clear();
          }
          // this._router.navigate(['login']);
        } */
      }
      return res; // observableThrowError(res);
    };
  }

  downloadFile(url) {
    return this.http.get(url);
  }

  async downloadFile2(url) {
    const r = await this.http.get(url, this.headers).toPromise();
    // // logConsole(r);
    return r;
  }

  get(Utils, url, params?) {
    // // logConsole('HEADERS', this.headers);
    return this.http.get(url, {
      params: params,
      headers: this.headers
    }) // .catch(this.catchAuthError(this));
  }

  /* post(url, data) {
    const postHeaders = { 'content-type': 'application/json'} ;
    // const body = data; // JSON.stringify(data);

    // // logConsole('Url:', url);
    // // logConsole('Body:', data);

    const ritorno = this.http.post(url, data, {headers: postHeaders})
    //    .catch(this.catchAuthError(this));
    // // logConsole('Ritorno da post:', ritorno);
    return ritorno;
  } */

  post(Utils, url, datiPassati) {
    const postHeaders = new Headers(this.headers);
    postHeaders.append('Content-Type', 'application/json');

    /* postHeaders.append("Cache-Control", "no-cache");
    postHeaders.append("Access-Control-Allow-Origin", "*");
    postHeaders.append("Access-Control-Allow-Credentials", "true");
    postHeaders.append("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS");
    postHeaders.append("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept"); */

    const HTTPOptions: Object = {
      headers: postHeaders,
      responseType: 'json'
    }

    // const body = JSON.stringify(data);
    // return this.http.post(url, body, {headers: postHeaders})

    let parametri = datiPassati;
    // // logConsole('POST URL: ', url);
    // // logConsole('TIPO POST DATA: ', typeof(parametri));
    // // logConsole('POST DATA: ', parametri);
    if (typeof(parametri) === 'string') {
      try {
        parametri = JSON.parse(parametri);
      } catch(e) {
        console.error('ERRORE Nel parse dei parametri', e, url, parametri)
      }
    }

    const destroy$ = new Subject<void>();

    return this.http.post<any>(url, parametri, HTTPOptions)
      .pipe(takeUntil(destroy$))
      .pipe(map(data => {
        // t.utility.scriveDebug(t, 'Ritorno funzione WEB: ' + url);
        // t.utility.scriveDebug(t, data);
        // // logConsole(data);
        if (JSON.stringify(data) ===  '[]') {
          data = undefined;
        }

        return data;
      }))

      // timeout(UtilityComponent.TimeOutConnessione),
      .pipe(catchError(e => {
        // console.error('POST ERROR: ', e, e.error.message);
        // let messaggio = e.error.message;
        // do something on a timeout
        return throwError(e); //  of(null);
        // return e;
      }))
    ;
      // .catch(this.catchAuthError(this));
  }

  put(url, data) {
    const putHeaders = {'Content-Type': 'application/json'};
    const body = JSON.stringify(data);
    return this.http.put(url, body, {headers: putHeaders})
    //   .catch(this.catchAuthError(this));
  }

  delete(Utils, url, data) {
    const postHeaders = {'Content-Type': 'application/json'};
    // const body = JSON.stringify(data);
    // // logConsole('pppp', data);
    const ritorno = this.http.delete(url, {headers: postHeaders, body: data})
    //   .catch(this.catchAuthError(this));
    return ritorno;
  }

  /* async downloadFile(url) {
    return await this.http.get(url, this.headers); // .toPromise();
    // // logConsole(r);
    // return r;
  } */

  async downloadBlob(url) {
    return this.http.get(url, this.headers); // /.toPromise();
    // // logConsole(r);
    // return r;
  }
}

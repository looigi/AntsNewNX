import { of, Subject, throwError } from 'rxjs';
import {Injectable} from '@angular/core';
// import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Router} from '@angular/router';
// import 'rxjs/add/operator/catch';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { timeout, catchError, map, takeUntil } from 'rxjs/operators';
// import { map } from "rxjs/operators";

@Injectable()
export class ExternalHttpClient {
  headers;

  constructor(
    private http: HttpClient,
    private _router: Router
  ) {
    this.headers = new Headers();
  }

  setHeader(header, value) {
    this.headers.append(header, value);
  }

  private catchAuthError(self: ExternalHttpClient) {
    // console.log('Errore: ', self);
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      // console.log('ERRORE Http: ', res);
      if (res.status === 401 || res.status === 403) {
        const currentUrl = this._router.url;
        // if not authenticated
        if (currentUrl === '/login') {
          // todo: aggiungere un messaggio di errore
          // console.log('Login failed');
        } else {
          if (localStorage) {
            localStorage.clear();
          }
          // this._router.navigate(['login']);
        }
      }
      // return observableThrowError(res);
    };
  }

  get(Utils, url, params?) {
    // console.log('HEADERS', this.headers);
    return this.http.get(url, {
      params: params,
      headers: this.headers
    }) // .catch(this.catchAuthError(this));
  }

  /* post(url, data) {
    const postHeaders = { 'content-type': 'application/json'} ;
    // const body = data; // JSON.stringify(data);

    // console.log('Url:', url);
    // console.log('Body:', data);

    const ritorno = this.http.post(url, data, {headers: postHeaders})
    //    .catch(this.catchAuthError(this));
    // console.log('Ritorno da post:', ritorno);
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
    // console.log('POST URL: ', url);
    // console.log('TIPO POST DATA: ', typeof(parametri));
    // console.log('POST DATA: ', parametri);
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
        // console.log(data);
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

  post2(Utils, url, datiPassati) {
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
    // console.log('POST URL: ', url);
    // console.log('TIPO POST DATA: ', typeof(parametri));
    // console.log('POST DATA: ', parametri);
    if (typeof(parametri) === 'string') {
      try {
        parametri = JSON.parse(parametri);
      } catch(e) {
        console.error('ERRORE Nel parse dei parametri', e, url, parametri)
      }
    }

    return this.http.post<any>(url, parametri, HTTPOptions)
      .pipe(map(data => {
        // t.utility.scriveDebug(t, 'Ritorno funzione WEB: ' + url);
        // t.utility.scriveDebug(t, data);
        // console.log(data);
        if (JSON.stringify(data) ===  '[]') {
          data = undefined;
        }

        return data;
      }))

      // timeout(UtilityComponent.TimeOutConnessione),
      .pipe(catchError(e => {
        // do something on a timeout
        return of(null);
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
    // console.log('pppp', data);
    const ritorno = this.http.delete(url, {headers: postHeaders, body: data})
    //   .catch(this.catchAuthError(this));
    return ritorno;
  }

  async downloadFile(url) {
    const r = await this.http.get(url, this.headers).toPromise();
    // console.log(r);
    return r;
  }

  async downloadBlob(url) {
    const r = await this.http.get(url, this.headers).toPromise();
    // console.log(r);
    return r;
  }
}

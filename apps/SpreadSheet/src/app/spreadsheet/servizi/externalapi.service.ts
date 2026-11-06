import { logConsole } from '../../console-log';
import { Injectable } from '@angular/core';
// import Utils from '../Utilities.component';
import { ExternalHttpClient } from './externalhttpclient.service';
// import { SessionService } from './session.service';
import {throwError as observableThrowError, Observable, Subject} from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { takeUntil, catchError } from 'rxjs/operators';
import { ExternalSessionService } from './externalsession.service';
import { environment } from '../../environments/environment';

@Injectable()
export class ExternalApiService {
  private urlBase = environment.urlBase;
  // private urlRoot = environment.urlRoot;

  constructor(
    private httpclient: ExternalHttpClient,
    private sessionService: ExternalSessionService
  ) {
  }

  private catchAuthError() {
    // // logConsole('Errore: ', self);
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      /* // logConsole('ERRORE Http: ', res);
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
            // // logConsole(url2);
            // const ww = window.open(doveURL, '_blank');
            location.assign(doveURL);
          } else {
            location.assign(Utils.userRedirect);
          }
        }
      } */

      return observableThrowError(res);
    };
  }

  chiamataGet(funzione, jsonString) {
    // // logConsole(Utils.serverPostRest + '/' + funzione, jsonString);
    return this.httpclient.get(funzione, jsonString).pipe(catchError(this.catchAuthError()));
  }

  chiamataPost(funzione, jsonString) {
    // // logConsole(Utils.serverPostRest + '/' + funzione, jsonString);
    const destroy$ = new Subject<void>();

    return this.httpclient.post(funzione, jsonString)
      .pipe(takeUntil(destroy$), catchError(this.catchAuthError()));
  }
}


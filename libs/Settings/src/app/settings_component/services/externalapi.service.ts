import { logConsole } from '../../console-log';
import { Injectable } from '@angular/core';
// import Utils from '../Utilities.component';
import { ExternalHttpClient } from './externalhttpclient.service';
import { ExternalSessionService } from './externalsession.service';
// import { SessionService } from './session.service';
import {throwError as observableThrowError, Observable, Subject} from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { environment } from "../../../environments/environment";

@Injectable()
export class ExternalApiService {
  private urlBase = environment.urlBase;
  // private urlRoot = environment.urlRoot;

  constructor(
    private httpclient: ExternalHttpClient,
    private sessionService: ExternalSessionService
  ) {
  }

  login(Utils, params) {
    return this.httpclient.post(Utils, Utils.indirizzoServer + this.urlBase + '/Login', params);
  }

  logout(Utils, params = null) {
    return this.httpclient.get(Utils, Utils.indirizzoServer + this.urlBase + '/logout?sessionID=' + this.sessionService.getToken(), params);
  }

  getViewData(t, viewId, filter) {
    const sess = this.sessionService.getToken();
    // // logConsole('Vista', viewId);
    // // logConsole('Sessione', sess);
    return this.httpclient.get(t.Utils, t.Utils.indirizzoServer + this.urlBase + '/view?viewId=' + viewId + '&sessionID=' +
      sess + '&filter=' + filter);
  }

  getDashboard(t, id) {
    const sess = this.sessionService.getToken();
    // // logConsole('Vista', viewId);
    // // logConsole(t.Utils.indirizzoServer + this.urlBase + '/GetDashboard?DshId=' + id + '&sessionID=' + sess);
    return this.httpclient.get(t.Utils, t.Utils.indirizzoServer + this.urlBase + '/GetDashboard?DshId=' + id + '&sessionID=' + sess);
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

  ChiamaFunzioneHTTPPost(t, funzione, jsonString) {
    const sess = this.sessionService.getToken();
    const jsonOut = jsonString.replace('***SESSION_ID***', sess);
    // logConsole(jsonOut, JSON.parse(jsonOut));
    return this.httpclient.post(t.Utils, t.Utils.indirizzoServer + this.urlBase + '/' + funzione, jsonOut);
  }

  ChiamaFunzioneHTTPDelete(t, funzione, jsonString) {
    const sess = this.sessionService.getToken();
    const jsonOut = jsonString.replace('***SESSION_ID***', sess);
    // logConsole(jsonOut, JSON.parse(jsonOut));
    return this.httpclient.delete(t.Utils, t.Utils.indirizzoServer + this.urlBase + '/' + funzione, jsonOut);
  }

  ChiamaFunzioneHTTPPostgrest(Utils, funzione, jsonString) {
    // logConsole(jsonString, JSON.parse(jsonString));
    return this.httpclient.post(Utils, Utils.serverPostRest + '/' + funzione, jsonString);
  }

  chiamataGet(Utils, funzione, jsonString) {
    // // logConsole(Utils.serverPostRest + '/' + funzione, jsonString);
    // return this.httpclient.get(Utils, funzione, jsonString).catch(this.catchAuthError());
    const destroy$ = new Subject<void>();

    return this.httpclient.post(
        Utils,
        funzione,
        jsonString
      )
      .pipe(
        takeUntil(destroy$),
        catchError(this.catchAuthError())
      );      
  }

  chiamataPost(Utils, funzione, jsonString) {
    // // logConsole(Utils.serverPostRest + '/' + funzione, jsonString);
    const destroy$ = new Subject<void>();

    let altro = '';

    if (!Utils.serverPostRest.toLowerCase().endsWith('/rpc')) {
      altro = 'rpc/';
    }

    // return this.httpclient.post(Utils, Utils.serverPostRest + '/' + altro + funzione, jsonString)
    //   .pipe(takeUntil(destroy$))
    //   .catch(this.catchAuthError());

    return this.httpclient.post(
        Utils,
        Utils.serverPostRest + '/' + altro + funzione,
        jsonString
      )
      .pipe(
        takeUntil(destroy$),
        catchError(this.catchAuthError())
      );      
  }

  chiamataPostEventi(Utils, funzione, jsonString) {
    const destroy$ = new Subject<void>();

    // // logConsole(Utils.serverPostRest + '/' + funzione, jsonString);
    // return this.httpclient.post(Utils, Utils.serverPostRest + '/' + funzione, jsonString)
    //   .pipe(takeUntil(destroy$))
    //   .catch(this.catchAuthError());

    return this.httpclient.post(
        Utils,
        Utils.serverPostRest + '/' + funzione,
        jsonString
      )
      .pipe(
        takeUntil(destroy$),
        catchError(this.catchAuthError())
      );      
  }

  downloadFile(url) {
    return this.httpclient.downloadFile(url);
  }

  downloadFile2(url) {
    return this.httpclient.downloadFile2(url);
  }
}


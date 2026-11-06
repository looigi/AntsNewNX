import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { SessionService } from './session.service';
import { HttpHeaders } from '@angular/common/http';
import Utils from '../Utilities.component';
import {throwError as observableThrowError, Observable, Subject} from 'rxjs';
import { ExternalHttpClient } from './httpclient.service';
import { catchError, takeUntil } from 'rxjs/operators';

@Injectable()

export class ApiService {
  private urlBase = environment.urlBase;
  // private urlRoot = environment.urlRoot;

  constructor(private httpclient: ExternalHttpClient, private sessionService: SessionService) {
  }

  login(params) {
    return this.httpclient.post(null, Utils.indirizzoServer + this.urlBase + '/Login', params);
  }

  logout(params = null) {
    return this.httpclient.get(Utils.indirizzoServer + this.urlBase + '/logout?sessionID=' + this.sessionService.getToken(), params);
  }

  getViewData(viewId, filter) {
    const sess = this.sessionService.getToken();
    // this.Utils.scriveLog('Vista', viewId);
    // this.Utils.scriveLog('Sessione', sess);
    return this.httpclient.get(null, Utils.indirizzoServer + this.urlBase + '/view?viewId=' + viewId + '&sessionID=' +
      sess + '&filter=' + filter);
  }

  getDashboard(id) {
    const sess = this.sessionService.getToken();
    // this.Utils.scriveLog('Vista', viewId);
    // this.Utils.scriveLog(Utils.indirizzoServer + this.urlBase + '/GetDashboard?DshId=' + id + '&sessionID=' + sess);
    return this.httpclient.get(null, Utils.indirizzoServer + this.urlBase + '/GetDashboard?DshId=' + id + '&sessionID=' + sess);
  }

  ChiamaFunzioneHTTPPost(funzione, jsonString) {
    const sess = this.sessionService.getToken();
    const jsonOut = jsonString.replace('***SESSION_ID***', sess);
    // // logConsole(jsonOut, JSON.parse(jsonOut));
    return this.httpclient.post(null, Utils.indirizzoServer + this.urlBase + '/' + funzione, jsonOut);
  }

  ChiamaFunzioneHTTPDelete(funzione, jsonString) {
    const sess = this.sessionService.getToken();
    const jsonOut = jsonString.replace('***SESSION_ID***', sess);
    // // logConsole(jsonOut, JSON.parse(jsonOut));
    return this.httpclient.delete(null, Utils.indirizzoServer + this.urlBase + '/' + funzione, jsonOut);
  }

  ChiamaFunzioneHTTPPostgrest(funzione, jsonString) {
    // // logConsole(jsonString, JSON.parse(jsonString));
    return this.httpclient.post(null, Utils.serverPostRest + '/' + funzione, jsonString);
  }

  private catchAuthError() {
    // this.Utils.scriveLog('Errore: ', self);
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      /* this.Utils.scriveLog('ERRORE Http: ', res);
      if (res.status === 401 || res.status === 403) {
        const currentUrl = this._router.url;
        // if not authenticated
        if (currentUrl === '/login') {
          // todo: aggiungere un messaggio di errore
          this.Utils.scriveLog('Login failed');
        } else {
          if (localStorage) {
            localStorage.clear();
          }

          if (Utils.userRedirect === 'default') {
            const doveURL = Utils.urlRoot + 'login/';
            // alert(doveURL);
            // const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
            // this.Utils.scriveLog(url2);
            // const ww = window.open(doveURL, '_blank');
            location.assign(doveURL);
          } else {
            location.assign(Utils.userRedirect);
          }
        }
      } */
      console.error(res);

      return observableThrowError(res);
    };
  }

  chiamataPost(funzione, jsonString) {
    // this.Utils.scriveLog(environment.serverPostRest + '/' + funzione, jsonString);
    const destroy$ = new Subject<void>();

    let altro = '';

    if (!Utils.serverPostRest.toLowerCase().endsWith('/rpc')) {
      altro = 'rpc/';
    }
    
    return this.httpclient.post(
        null,
        Utils.serverPostRest + '/' + altro + funzione,
        jsonString
      )
      .pipe(
        takeUntil(destroy$),
        catchError(this.catchAuthError())
      );       
  }

  chiamataPostEventi(funzione, jsonString) {
    // this.Utils.scriveLog(environment.serverPostRest + '/' + funzione, jsonString);
    const destroy$ = new Subject<void>();

    return this.httpclient.post(
        null,
        Utils.serverPostRest + '/' + funzione,
        jsonString
      )
      .pipe(
        takeUntil(destroy$),
        catchError(this.catchAuthError())
      );        
  }
}

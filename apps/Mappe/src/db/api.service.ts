import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ExternalHttpClient } from './httpclient.service';
import { SessionService } from './session.service';
import { HttpHeaders } from '@angular/common/http';
import ExternalUtilities from '../app/components/ExternalUtilities.component';
// import Utils from '../app/components/Utilities.component';
import {throwError as observableThrowError, Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable()

export class ApiService {
  private urlBase = environment.urlBase;
  // private urlRoot = environment.urlRoot;

  constructor(
    private httpclient: ExternalHttpClient,
    private sessionService: SessionService
  ) {
  }

  login(Utils, Utils1, params) {
    return this.httpclient.post(Utils, Utils1.indirizzoServer + this.urlBase + '/Login', params);
  }

  logout(Utils1, params = null) {
    return this.httpclient.get(Utils1, Utils1.indirizzoServer + this.urlBase + '/logout?sessionID=' + ExternalUtilities.sessione, params);
  }

  getViewData(Utils1, viewId, filter) {
    const sess = ExternalUtilities.sessione;
    // console.log('Vista', viewId);
    // console.log('Sessione', sess);
    return this.httpclient.get(Utils1, Utils1.indirizzoServer + this.urlBase + '/view?viewId=' + viewId + '&sessionID=' +
      sess + '&filter=' + filter);
  }

  getDashboard(Utils1, id) {
    const sess = ExternalUtilities.sessione;
    // console.log('Vista', viewId);
    // console.log(Utils.indirizzoServer + this.urlBase + '/GetDashboard?DshId=' + id + '&sessionID=' + sess);
    return this.httpclient.get(Utils1, Utils1.indirizzoServer + this.urlBase + '/GetDashboard?DshId=' + id + '&sessionID=' + sess);
  }

  ChiamaFunzioneHTTPPost(Utils1, funzione, jsonString) {
    const sess = ExternalUtilities.sessione;
    const jsonOut = jsonString.replace('***SESSION_ID***', sess);
    // console.log(jsonOut, JSON.parse(jsonOut));
    return this.httpclient.post(Utils1, Utils1.indirizzoServer + this.urlBase + '/' + funzione, jsonOut);
  }

  ChiamaFunzioneHTTPDelete(Utils1, funzione, jsonString) {
    const sess = ExternalUtilities.sessione;
    const jsonOut = jsonString.replace('***SESSION_ID***', sess);
    // console.log(jsonOut, JSON.parse(jsonOut));
    return this.httpclient.delete(Utils1, Utils1.indirizzoServer + this.urlBase + '/' + funzione, jsonOut);
  }

  ChiamaFunzioneHTTPPostgrest(Utils1, funzione, jsonString) {
    // console.log(jsonString, JSON.parse(jsonString));
    return this.httpclient.post(Utils1, Utils1.serverPostRest + '/' + funzione, jsonString);
  }

  private catchAuthError() {
    // console.log('Errore: ', self);
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      /* console.log('ERRORE Http: ', res);
      if (res.status === 401 || res.status === 403) {
        const currentUrl = this._router.url;
        // if not authenticated
        if (currentUrl === '/login') {
          // todo: aggiungere un messaggio di errore
          console.log('Login failed');
        } else {
          if (localStorage) {
            localStorage.clear();
          }

          if (Utils.userRedirect === 'default') {
            const doveURL = Utils.urlRoot + 'login/';
            // alert(doveURL);
            // const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
            // console.log(url2);
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

  chiamataPost(Utils1, funzione, jsonString) {
    // console.log('Indirizzo Chiamata', Utils1.serverPostRest + '/' + funzione, jsonString);
    const destroy$ = new Subject<void>();

    let altro = '';

    if (!Utils1.serverPostRest.toLowerCase().endsWith('/rpc')) {
      altro = 'rpc/';
    }
    // console.log('Indirizzo Chiamata', Utils1.serverPostRest, altro, funzione, jsonString);
    
    return this.httpclient.post(Utils1, Utils1.serverPostRest + '/' + altro + funzione, jsonString)
      .pipe(
        takeUntil(destroy$),
        catchError(this.catchAuthError()
      )
    );
  }

  chiamataPostEventi(Utils1, funzione, jsonString) {
    // console.log(environment.serverPostRest + '/' + funzione, jsonString);
    const destroy$ = new Subject<void>();

    return this.httpclient.post(Utils1, Utils1.serverPostRest + '/' + funzione, jsonString)
      .pipe(
        takeUntil(destroy$),
        catchError(this.catchAuthError()
      )
    );
  }
}

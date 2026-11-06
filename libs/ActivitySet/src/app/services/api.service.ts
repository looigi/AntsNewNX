import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';
import { ExternalHttpClient } from './httpclient.service';
import { SessionService } from './session.service';
import {throwError as observableThrowError, Observable} from 'rxjs';
import { environment } from '../environments/environment';
import ExternalUtilities from '../actSetComponent/ExternalUtilities.component';
import { catchError } from 'rxjs/operators'; // Importa catchError da rxjs/operators
import { of } from 'rxjs'; // of è utilizzato per restituire un Observable alternativo

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
    return this.httpclient.post(Utils1.indirizzoServer + this.urlBase + '/Login', params);
  }

  logout(Utils1, params = null) {
    return this.httpclient.get(Utils1, Utils1.indirizzoServer + this.urlBase + '/logout?sessionID=' + ExternalUtilities.sessione, params);
  }

  getViewData(Utils1, viewId, filter) {
    const sess = ExternalUtilities.sessione;
    // logConsole('Vista', viewId);
    // logConsole('Sessione', sess);
    return this.httpclient.get(Utils1, Utils1.indirizzoServer + this.urlBase + '/view?viewId=' + viewId + '&sessionID=' +
      sess + '&filter=' + filter);
  }

  getDashboard(Utils1, id) {
    const sess = ExternalUtilities.sessione;
    // logConsole('Vista', viewId);
    // logConsole(Utils.indirizzoServer + this.urlBase + '/GetDashboard?DshId=' + id + '&sessionID=' + sess);
    return this.httpclient.get(Utils1, Utils1.indirizzoServer + this.urlBase + '/GetDashboard?DshId=' + id + '&sessionID=' + sess);
  }

  ChiamaFunzioneHTTPPost(Utils1, funzione, jsonString) {
    const sess = ExternalUtilities.sessione;
    const jsonOut = jsonString.replace('***SESSION_ID***', sess);
    // logConsole(jsonOut, JSON.parse(jsonOut));
    return this.httpclient.post(Utils1.indirizzoServer + this.urlBase + '/' + funzione, jsonOut);
  }

  ChiamaFunzioneHTTPDelete(Utils1, funzione, jsonString) {
    const sess = ExternalUtilities.sessione;
    const jsonOut = jsonString.replace('***SESSION_ID***', sess);
    // logConsole(jsonOut, JSON.parse(jsonOut));
    return this.httpclient.delete(Utils1, Utils1.indirizzoServer + this.urlBase + '/' + funzione, jsonOut);
  }

  ChiamaFunzioneHTTPPostgrest(Utils1, funzione, jsonString) {
    // logConsole(jsonString, JSON.parse(jsonString));
    return this.httpclient.post(funzione, jsonString);
  }

  private catchAuthError() {
    // logConsole('Errore: ', self);
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      /* logConsole('ERRORE Http: ', res);
      if (res.status === 401 || res.status === 403) {
        const currentUrl = this._router.url;
        // if not authenticated
        if (currentUrl === '/login') {
          // todo: aggiungere un messaggio di errore
          logConsole('Login failed');
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
      } */

      return observableThrowError(res);
    };
  }

  chiamataPost(indirizzo, funzione, jsonString) {
    // logConsole(environment.serverPostRest + '/' + funzione, jsonString);
    let altro = '';

    if (indirizzo && !indirizzo.toLowerCase().endsWith('/rpc')) {
      altro = 'rpc/';
    }

    return this.httpclient.post(indirizzo + '/' + altro + funzione, jsonString).pipe(catchError(this.catchAuthError()));
  }

  chiamataPostEventi(funzione, jsonString) {
    // logConsole(environment.serverPostRest + '/' + funzione, jsonString);
    return this.httpclient.post(funzione, jsonString);
  }
}

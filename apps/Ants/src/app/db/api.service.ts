import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ExternalHttpClient } from './httpclient.service';
// import Utils from '../app/components/Utilities.component';
import {throwError as observableThrowError, Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Utils } from '../Utilities.component';
import { catchError } from 'rxjs/operators';

@Injectable()

export class ApiService {
  private urlBase = environment.urlBase;
  // private urlRoot = environment.urlRoot;

  constructor(
    private httpclient: ExternalHttpClient,
  ) {
  }

  getViewData(Utils1: any, viewId: string, filter: string) {
    const sess = Utils.sessione;
    // logConsole('Vista', viewId);
    // logConsole('Sessione', sess);
    return this.httpclient.get(Utils1, Utils1.indirizzoServer + this.urlBase + '/view?viewId=' + viewId + '&sessionID=' +
      sess + '&filter=' + filter);
  }

  getDashboard(Utils1: any, id: string) {
    const sess = Utils.sessione;
    // logConsole('Vista', viewId);
    // logConsole(Utils.indirizzoServer + this.urlBase + '/GetDashboard?DshId=' + id + '&sessionID=' + sess);
    return this.httpclient.get(Utils1, Utils1.indirizzoServer + this.urlBase + '/GetDashboard?DshId=' + id + '&sessionID=' + sess);
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

  chiamataPost(funzione: string, jsonString: any, oracle: boolean) {
    // logConsole(environment.serverPostRest + '/' + funzione, jsonString);
    const destroy$ = new Subject<void>();

    let indirizzo = '';
    if (oracle) {
      indirizzo = Utils.serverPostRestOracle;
    } else {
      indirizzo = Utils.serverPostRest;
    }
    // alert(indirizzo);
    
    let altro = '';

    if (!indirizzo.toLowerCase().endsWith('/rpc')) {
      altro = 'rpc/';
    }
    // logConsole('Chiamata POST a: ', indirizzo , funzione, jsonString);

    return this.httpclient.post(indirizzo + '/' + altro + funzione, jsonString)
      .pipe(
        takeUntil(destroy$),
        catchError(this.catchAuthError())
      );
  }
}

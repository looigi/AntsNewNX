import { ExternalHttpClient } from './httpclient.service';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { SessionService } from './session.service';
import Utils from '../app/modules/general/Utilities.component';

@Injectable()

export class ApiService {
  private urlBase = environment.urlBase;
  // private urlRoot = environment.urlRoot;

  constructor(private httpclient: ExternalHttpClient, private sessionService: SessionService) {
  }

  login(params) {
    return this.httpclient.post(null, this.urlBase + '/Login', params);
  }

  logout(params = null) {
    return this.httpclient.get(this.urlBase + '/logout?sessionID=' + this.sessionService.getToken(), params);
  }

  getViewData(viewId, filter) {
    const sess = this.sessionService.getToken();
    // console.log('Sessione', sess);
    return this.httpclient.get(null, this.urlBase + '/view?viewId=' + viewId + '&sessionID=' +
      this.sessionService.getToken() + '&filter=' + filter);
  }

  chiamataPost(funzione, jsonString, rfiClone) {
    // console.log(environment.serverPostRest + '/' + funzione, jsonString);
    if (Utils.indirizzoServer.indexOf('.7.71') > -1) {
      if (funzione.indexOf('_login') > -1) {
        return this.httpclient.post(null, Utils.indirizzoServer + ':3000/' + funzione, jsonString);
      } else {
        return this.httpclient.post(null, Utils.indirizzoServer + ':3002/' + funzione, jsonString);
      }
    } else {
      let altro = '';

      if (!Utils.indirizzoServer.toLowerCase().endsWith('/rpc')) {
        altro = 'rpc/';
      }

      if (rfiClone) {
        Utils.indirizzoServer = 'http://10.100.7.71:3002/';
        altro = '';
      }

      return this.httpclient.post(null, Utils.indirizzoServer + altro + funzione, jsonString);
    }
  }
}


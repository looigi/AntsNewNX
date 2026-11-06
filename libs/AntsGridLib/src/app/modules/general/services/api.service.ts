import { logConsole } from '../console-log';
import { GeneralModule } from './../general.module';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SessionService } from './session.service';
import { AntsGridLibraryComponent } from '../general.component';
import { ExternalHttpClient } from './httpclient.service';

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

  getUserData(params = null) {
    return this.httpclient.get(this.urlBase + '/Operator/getOperator?operatorID=' +
    this.sessionService.getUser().username + '&sessionID=' + this.sessionService.getToken(), params);
  }

  getTestScenarios(filter = '', params = null) {
    // const wa_measure = ' (measr_name=\'Result\' or measr_name is null)';
    // filter = filter ? filter + ' AND' + wa_measure : wa_measure;
    return this.httpclient.get(this.urlBase + '/view?viewId=VIEW_TD_SCHED_TRAILIS&sessionID=' +
    this.sessionService.getToken() + '&filter=' + filter , params);
  }

  setRequestParameters(t, ss) {
    return this.httpclient.post(null, this.urlBase + '/TcRun/TcRunReqSetParameter?TcRunId=' + t + '&sessionID=' +
      this.sessionService.getToken(), ss);
  }

  getCommitData(viewId, datas) {
    let s = '';
    let d = JSON.stringify(datas);
    while (d.indexOf('\\') > -1) {
      d = d.replace('\\', '');
    }
    d = d.substring(0, d.length - 1);
    d = d.substring(1, d.length);
    while (d.indexOf('"') > -1) {
      d = d.replace('"', '\'');
    }
    s += '{';
    s += '  "viewId": "' + viewId + '",';
    s += '  "sessionID": "' + this.sessionService.getToken() + '", ';
    s += '  "datasetEdit": "' + d + '"';
    s += '}';
    const ss = JSON.parse(s);

    // logConsole(s);

    return this.httpclient.post(null, this.urlBase + '/CommitData', ss );
  }

  chiamataPost(funzione, jsonString) {
    // logConsole(environment.serverPostRest + '/' + funzione, jsonString);
    let barra = '/';
    if (AntsGridLibraryComponent.serverPostRest.endsWith('/')) {
      barra = '';
    }
    
    let altro = '';

    if (!AntsGridLibraryComponent.serverPostRest.toLowerCase().endsWith('/rpc')) {
      altro = 'rpc/';
    }

    let indirizzo = AntsGridLibraryComponent.serverPostRest + barra + altro + funzione;
    indirizzo = indirizzo.replace('/rpc/rpc/rpc/', '/rpc/rpc/');
    
    return this.httpclient.post(null, indirizzo, jsonString);
  }
}


import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ExternalHttpClient } from './httpclient.service';

@Injectable()
export class ApiService {
  private urlBase; // = Utils.facadeServerAddress + 'api/v1';
  // private urlRoot = environment.urlRoot;

  constructor(
    private httpclient: ExternalHttpClient,
    private sessionService: SessionService) {
  }

  setUrl(url) {
    this.urlBase = url + 'api/v1';
    // logConsole(this.urlBase);
  }

  login(params) {
    return this.httpclient.post(null, this.urlBase + '/Login', params);
  }

  logout(params = null) {
    return this.httpclient.get(null, this.urlBase + '/logout?sessionID=' + this.sessionService.getToken(), params);
  }

  getUserData(params = null) {
    return this.httpclient.get(null, this.urlBase + '/Operator/getOperator?operatorID=' +
    this.sessionService.getUser() + '&sessionID=' + this.sessionService.getToken(), params);
  }

  getTestScenarios(filter = '', params = null) {
    // const wa_measure = ' (measr_name=\'Result\' or measr_name is null)';
    // filter = filter ? filter + ' AND' + wa_measure : wa_measure;
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_TD_SCHED_TRAILIS&sessionID=' +
    this.sessionService.getToken() + '&filter=' + filter , params);
  }

  getTSRun(filter = '', params = null) {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_TS_RUN&sessionID=' +
    this.sessionService.getToken() + '&filter=' + filter, params);
  }

  getTCRun(filter = '', params = null) {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_TC_RUN&sessionID=' +
    this.sessionService.getToken() + '&filter=' + filter, params);
  }

  getTSTree() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_TD_TREE&sessionID=' + this.sessionService.getToken());
  }

  getTSTreeAdHoc() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_TD_ADHOC_TREE&sessionID=' + this.sessionService.getToken());
  }

  getTSTree2() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_TD_TREE_2&sessionID=' + this.sessionService.getToken());
  }

  getReportTree() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_OLAP_TREE&sessionID=' + this.sessionService.getToken());
  }

  getReportResults(params = null) {
    return this.httpclient.get(null, this.urlBase + '/Olap/Aggr?sessionID=' + this.sessionService.getToken(), params);
  }

  getSiteList() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_SITE&sessionID=' + this.sessionService.getToken());
  }

  getPlmnTech() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_SITE_PLMN_TECH&sessionID=' + this.sessionService.getToken());
  }

  getSIMCategories() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_SIM_CATEGORY&sessionID=' + this.sessionService.getToken());
  }

  getTestScenarioObject(params = null) {
    return this.httpclient.get(null, this.urlBase + '/ts/tsWebGet?sessionID=' + this.sessionService.getToken(), params);
  }

  updateTestScenarioObject(testScenario) {
    // // logConsole(this.urlBase + '/ts/tsWebUpdate');
    return this.httpclient.post(null, this.urlBase + '/ts/tsWebUpdate?sessionID=' + this.sessionService.getToken(), testScenario);
  }

  createTestScenarioObject(testScenario) {
    // // logConsole('createTestScenarioObject: ' + JSON.stringify(testScenario));
    return this.httpclient.post(null, this.urlBase + '/ts/tsWebCreate?sessionID=' + this.sessionService.getToken() + '&tsId=""', testScenario);
  }

  deleteTestScenarioObject(testScenario) {
    return this.httpclient.delete(null, this.urlBase + '/ts/tsWebDelete?sessionID=' + this.sessionService.getToken(), testScenario);
  }

  getLookUpDomainOptions(filter) {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_PRM_DOMAIN&FILTER=' + filter + '&sessionID=' +
    this.sessionService.getToken());
  }

  getViewData(viewId, filter) {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=' + viewId + '&sessionID=' +
      this.sessionService.getToken() + '&filter=' + filter);
  }

  getViewReport() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_TC_RUN_REQ&sessionID=' +
      this.sessionService.getToken());
  }

  getViewPolling() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_POLLING&sessionID=' +
      this.sessionService.getToken());
  }

  getViewReportWithFilter(f) {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_TC_RUN_REQ&filter=Tc_Run_Id=' + f + '&sessionID=' +
      this.sessionService.getToken());
  }

  // LOOIGI 14/05/2018
  getEventLogTree() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_HIST_LOG_TREE&sessionID=' + this.sessionService.getToken());
  }
  // LOOIGI 14/05/2018

  // LOOIGI 17/05/2018
  getSimTree() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_SIM_TREE&sessionID=' + this.sessionService.getToken());
  }
  // LOOIGI 17/05/2018

  getPortTree() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_PORT_TREE&sessionID=' + this.sessionService.getToken());
  }

  getLineTree() {
    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_LINE_TREE&sessionID=' + this.sessionService.getToken());
  }

  operatorSetPassword(params) {
    // logConsole(this.urlBase + '/Operator/setpassword');
    return this.httpclient.post(null, this.urlBase + '/Operator/setpassword', params);
  }

  getSqlSelect(sqlString) {
    return this.httpclient.get(null, this.urlBase + '/SqlSelect?sqlString=' + sqlString + '&sessionID=' + this.sessionService.getToken() );
  }

  getHeaderInfo() {
    let filter: string;
    let sessionID: string;

    filter = this.sessionService.user.value.username ;
    sessionID = this.sessionService.getToken() ;

    return this.httpclient.get(null, this.urlBase + '/view?viewId=VIEW_HEADER_INFO&sessionID=' + sessionID + '&filter=' + filter);
  }

  postRunScenario(tsId, sessionId) {
    return this.httpclient.post(null, this.urlBase + '/ts/run/create/' + tsId + '/' +  sessionId, null);
    // return this.httpclient.post(null, this.urlBase + '/ts/run/create', params);
  }

  TcRunStartFromWaitingUser(tsId, sessionId) {
    let s = '';
    s += '{';
    s += '  "tcRunId": "' + tsId + '",';
    s += '  "sessionID": "' + sessionId + '"';
    s += '}';
    const ss = JSON.parse(s);
    return this.httpclient.post(null, this.urlBase + '/Tc/startFromWaitingUser', ss);
  }

  TcRunRestartSrv(tsId, sessionId) {
    let s = '';
    s += '{';
    s += '  "tcRunId": "' + tsId + '",';
    s += '  "sessionID": "' + sessionId + '"';
    s += '}';
    const ss = JSON.parse(s);
    return this.httpclient.post(null, this.urlBase + '/TcRun/TcRunRestartSrv', ss);
  }

  postStopTcRun(tcId, sessionId) {
    let s = '';
    s += '{';
    s += '  "tcRunId": "' + tcId + '",';
    s += '  "sessionID": "' + sessionId + '"';
    s += '}';
    const ss = JSON.parse(s);
    return this.httpclient.post(null, this.urlBase + '/Tc/stop', ss);
  }

  postDeleteTS(tsId, sessionId) {
    // let s = '';
    // s += '{';
    // s += '  "tsIdList": "' + tsId + '",';
    // s += '  "sessionID": "' + sessionId + '"';
    // s += '}';
    // const ss = JSON.parse(s);
    // return this.httpclient.post(null, this.urlBase + '/ts/tsWebDelete/' + tsId + '/' +  sessionId, null);
    // return this.httpclient.delete(null, this.urlBase + '/ts/tsWebDelete', ss);
    return this.httpclient.delete(null, this.urlBase + '/ts/tsWebDelete?tsIdList=' + tsId + '&sessionId=' + sessionId, null);
  }

  postPauseScenario(tsId, pause, sessionId) {
    return this.httpclient.post(null, this.urlBase + '/ts/pause/' + tsId + '/' +  pause + '/' + sessionId, null);
    // return this.httpclient.post(null, this.urlBase + '/ts/run/create', params);
  }

  getTcRunTraceTreeGet(tcRunId) {
    return this.httpclient.get(null, this.urlBase + '/tc/TcRunTraceTreeGet?TcRunId=' + tcRunId + '&sessionID=' +
      this.sessionService.getToken());
  }

  getTcRunTraceL3Get(tcRunId) {
    return this.httpclient.get(null, this.urlBase + '/tc/TcRunTraceL3Get?TcRunId=' + tcRunId + '&sessionID=' +
      this.sessionService.getToken());
  }

  getTsFiles(ts) {
    return this.httpclient.get(null, this.urlBase + '/ts/run/TsRunFileListGet?TsRunId=' + ts + '&sessionID=' +
      this.sessionService.getToken());
  }

  getReport(s) {
    return this.httpclient.get(null, this.urlBase + '/Olap/Aggr?sessionID=' +
      this.sessionService.getToken() + s);
  }

  getOlapTsRunList(s) {
    s = JSON.parse(s);
    return this.httpclient.post(null, this.urlBase + '/Olap/TcRun', s);
  }

  getRequestParameters(s) {
    return this.httpclient.get(null, this.urlBase + '/TcRun/TcRunReqGetParameter?' + s + '&sessionID=' +
      this.sessionService.getToken());
  }

  setRequestParameters(t, ss) {
    return this.httpclient.post(null, this.urlBase + '/TcRun/TcRunReqSetParameter?TcRunId=' + t + '&sessionID=' +
      this.sessionService.getToken(), ss);

    // return this.httpclient.get(null, this.urlRoot + 'TcRun/TcRunReqSetParameter?' + s + '&sessionID=' +
    //   this.sessionService.getToken());
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

    // // logConsole(s);

    return this.httpclient.post(null, this.urlBase + '/CommitData', ss );
  }

  chiamataPost(funzione, jsonString, serverPostRest) {
    let altro = '';

    if (!serverPostRest.toLowerCase().endsWith('/rpc')) {
      altro = 'rpc/';
    }

    // // logConsole(Utils.serverPostRest + '/' + funzione, jsonString);
    return this.httpclient.post(null, serverPostRest + '/' + altro + funzione, jsonString);
  }

  chiamataPost2(serverPostRest, funzione, jsonString) {
    let altro = '';

    if (!serverPostRest.toLowerCase().endsWith('/rpc')) {
      altro = 'rpc/';
    }

    // // logConsole(Utils.serverPostRest + '/' + funzione, jsonString);
    return this.httpclient.post(null, serverPostRest + '/' + altro + funzione, jsonString);
  }

  chiamataPostEsterna(funzione, jsonString) {
    // // logConsole(Utils.serverPostRest + '/' + funzione, jsonString);
    return this.httpclient.post(null, funzione, jsonString);
  }

  chiamataGet(funzione, jsonString) {
    // // logConsole(Utils.serverPostRest + '/' + funzione, jsonString);
    return this.httpclient.get(funzione, jsonString);
  }
}


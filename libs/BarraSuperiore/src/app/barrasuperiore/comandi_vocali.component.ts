import { logConsole } from '../console-log';
import { Injectable } from "@angular/core";
import Utilities from "./Utilities.component";

@Injectable()
export class ComandiVocaliComponent {
  constructor(
  ) {

  }

  esegueComandoVocale(t, cmd) {
    if (!cmd || cmd === '') {
      return;
    }

    if (t.debug === true) {
      // logConsole('ComandiVocali. Comando da eseguire:', cmd);
    }

    const comando = cmd.v_cmd;
    const parametro = cmd.v_parameter;

    switch (comando) {
      case 'navigation':
        this.changePage(t, parametro);
        break;
      default:
        break;
    }
  }

  changePage(t, url) {
    let dove = '';
    let form = '';

    switch (url) {
      case 'home_page':
        dove = 'HomePage';
        form = '';
        break;
      case 'geo_analysis':
        dove = 'Mappe';
        form = '';
        break;
      case 'fleet_manager':
        dove = 'FleetManager';
        form = 'TC';
        break;
      case 'data_dictionaries':
        dove = 'DataDictionaries';
        form = 'Antenna';
        break;
      case 'user_manager':
        dove = 'UserManager';
        form = 'Users';
        break;
      case 'test_campaigns':
        dove = 'FleetManager';
        form = 'TC';
        break;
      case 'test_design':
        dove = 'FleetManager';
        form = 'TDL';
        break;
      case 'agent_profile':
        dove = 'FleetManager';
        form = 'AGD';
        break;
      case 'query_package':
        dove = 'FleetManager';
        form = 'QPL';
        break;
      case 'cluster':
        dove = 'DataDictionaries';
        form = 'Cluster';
        break;
      case 'plmn':
        dove = 'DataDictionaries';
        form = 'PLMN';
        break;
      case 'users':
        dove = 'UserManager';
        form = 'Users';
        break;
      case 'user_groups':
        dove = 'UserManager';
        form = 'Groups';
        break;
      case 'user_profiles':
        dove = 'UserManager';
        form = 'UP';
        break;
      case 'system_configuration':
        dove = 'System';
        form = 'SC';
        break;
      case 'event_viewer':
        dove = 'System';
        form = 'EV';
        break;
      case 'service_monitor':
        dove = 'System';
        form = 'SM';
        break;
      case 'session_monitor':
        dove = 'System';
        form = 'SESS';
        break;
      case 'etl_monitor':
        dove = 'System';
        form = 'ETLM';
        break;
      case 'db_objects':
        dove = 'System';
        form = 'DBO';
        break;
    }
    if (dove === '') {
      if (t.debug === true) {
        // logConsole('ComandiVocali. comando non valido: ', url);
      }
      return;
    }

    const passaggio = '{ ' +
      '"sess": "' + t.sess2 + '", ' +
      '"gname": "' + t.groupName + '", ' +
      '"uname": "' + t.userName + '", ' +
      '"form": "' + form + '", ' +
      '"FS": "' + t.fullScreen.toString() + '"' +
      '}';
    const pass = Utilities.cripta(passaggio);
    // // logConsole(passaggio);
    // // logConsole(pass);
    // // logConsole(UtilsInterna.decripta(pass));

    let addr = t.urlRoot;
    if (!addr.endsWith('/')) {
      addr += '/';
    }
    if (addr.indexOf('geoantsweb/') === -1) {
      addr += 'geoantsweb/';
    }
    // logConsole(addr + dove + '/?par=' + pass); // sess=' + this.sessionID2 +
                                                        // '&gname=' + this.operatorGroupName +
                                                        // '&uname=' + this.userName +
                                                        // '&form=' + campiOrig[1] +
                                                        // '&FS=' + this.fullScreen);
    const doveURL = addr + dove + '/?par=' + pass; // + '/?sess=' + this.sessionID2 +
                                      //                   '&gname=' + this.operatorGroupName +
                                      //                   '&uname=' + this.userName +
                                      //                   '&form=' + campiOrig[1] +
                                      //                   '&FS=' + this.fullScreen;
    // logConsole(doveURL);
    // window.location.href = doveURL;
    // const ww = window.open(doveURL, '_blank');
    location.assign(doveURL);
  }
}

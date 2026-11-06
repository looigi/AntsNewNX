import { logConsole } from './console-log';
import { Injectable } from '@angular/core';
// import { hide } from '@popperjs/core'; // non usato, pacchetto non installato

@Injectable()
export default class Utils {
  static errMsg: string;
  // static facadeServerAddress;
  static linkIcone;
  static serverPostRest;
  static sessionID = '';

  static visibilita = {
    hideScheduler: 'false',
    hideReport: 'false',
    hideAdhoc: 'false',
    hideSiteCoverage: 'false',
    hideEventLog: 'false',
    hideSimManager: 'false',
    hidePortManager: 'false',
    hideLineManager: 'false',
    hideAnalytics: 'false',
    hideUserManager: 'false',
    hideMaps: 'false',
    hideFleetManager: 'false',
    hideSystem: 'false',
    hideSpreadSheet: 'false',
    hideDataDictionaries: 'false',
    hideAI: 'false',
    hideAnts1: 'false'
  };

  static permessoFrameEditor: string;
  static sPlatformName: string;
  // static sOpenWindow: string;
  static sUserName: string;
  // static sDateNow: Date = null;
  static userRedirect = '';
  static sDateNowH: string;
  static sUserData: any = null;
  static sPassword: string;
  static sSymb_TimeStamp: string;
  static sMail: string;
  static groupName: string;
  static finestreMapsAperte = new Array();
  static urlRoot: string;
  static urlAnalytics: string;
  static operatorGroupName: string;
  static operatorProfileName: string;
  static operatorProfileDesc: string;

  static cripta(s) {
    const x = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    // // logConsole('Stringa:', s);
    // // logConsole('Codice random:', x);
    let rit = x + ';';
    // // logConsole('Rit 1:', rit);
    for (let i = 0; i < s.length; i++) {
      let a = s.charCodeAt(i);
      a += (x + i);
      rit += a +';';
      // // logConsole('Rit ' + i + ':', rit);
    }
    for (let i = 0; i <= 5; i++) {
      const x = Math.floor(Math.random() * (255 - 1 + 1)) + 1;
      rit += x +';';
      // // logConsole('Rit ' + (i + 100) + ':', rit);
    }
    rit += s.length + ';';

    return rit;
  }

  static decripta(s) {
    let rit = '';
    if (s && s !== '') {
      const c = s.split(';');
      // // logConsole(c, +c[c.length - 2], c.length - 2);
      const differenza = +c[0];
      const lunghezza = +c[c.length - 2];
      // // logConsole('Differenza: ', differenza);
      // // logConsole('Lunghezza: ', lunghezza);

      for (let i = 1; i < lunghezza + 1; i ++) {
        // // logConsole('Carattere ' + i + ': ', c[i]);
        let v = +c[i] - (i - 1);
        // // logConsole('Valore Carattere ' + i + ': ', v);
        v -= differenza;
        // // logConsole('Carattere ' + i + '. Differenza: ', v);
        const car = String.fromCharCode(v);
        // // logConsole('Carattere ' + i + ': ', car);
        rit += car;
      }
    }

    return rit;
  }
}

import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';

@Injectable()
export default class UtilsInterna {
  //  modalitaLettura = 'POSTGREST';
  static modalitaDebug = false;
  static userRedirect = '';
  static sessionID = '';

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
  
  static scriveLog(Cosa, P1?, P2?, P3?, P4?, P5?) {
    if (this.modalitaDebug === true) {
      if (P1 && P2 && P3 && P4 && P5) {
        // console.log('MENU: ' + Cosa, P1, P2, P3, P4, P5);
      } else {
        if (P1 && P2 && P3 && P4 && !P5) {
          // console.log('MENU: ' + Cosa, P1, P2, P3, P4);
        } else {
          if (P1 && P2 && P3 && !P4 && !P5) {
            // console.log('MENU: ' + Cosa, P1, P2, P3);
          } else {
            if (P1 && P2 && !P3 && !P4 && !P5) {
              // console.log('MENU: ' + Cosa, P1, P2,);
            } else {
              if (P1 && !P2 && !P3 && !P4 && !P5) {
                // console.log('MENU: ' + Cosa, P1);
              } else {
                // console.log('MENU: ' + Cosa);
              }  
            }
          }
        }
      }
    }
  }
}

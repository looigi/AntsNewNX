import { logConsole } from './console-log';
// import Swal from 'sweetalert2/dist/sweetalert2.js';

import Swal from "sweetalert2";

export default class Utils {
  static indirizzoServer;
  static linkIcone;
  static serverPostRest;
  static facadeServerAddress;
  static serverGEOServer;
  static urlRoot;
  static limitPerVirtual;
  static permessoFrameEditor = 'false';
  static userRedirect = '';
  static modalitaDebug = false;
  
  static edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  static scriveLog(Cosa, P1?, P2?, P3?, P4?, P5?) {
    if (Utils.modalitaDebug === true) {
      if (P1 && P2 && P3 && P4 && P5) {
        // console.log(Cosa, P1, P2, P3, P4, P5);
      } else {
        if (P1 && P2 && P3 && P4 && !P5) {
          // console.log(Cosa, P1, P2, P3, P4);
        } else {
          if (P1 && P2 && P3 && !P4 && !P5) {
            // console.log(Cosa, P1, P2, P3);
          } else {
            if (P1 && P2 && !P3 && !P4 && !P5) {
              // console.log(Cosa, P1, P2,);
            } else {
              if (P1 && !P2 && !P3 && !P4 && !P5) {
                // console.log(Cosa, P1);
              } else {
                // console.log(Cosa);
              }  
            }
          }
        }
      }
    }
  }

  static checkRitornoChiamata(t, d) {
    if (d) {
      if (d.err_code) {
        if (d.err_code === 1) {
          if (d.failure_reason) {
            if (d.failure_reason === 'cntx invalid') {
              // Torna al login
              if (Utils.userRedirect === 'default') {
                localStorage.setItem('ERROR', 'CNTX_INVALID');
                window.location.href = Utils.urlRoot + 'login/?err=cntx_invalid';
              } else {
                location.assign(Utils.userRedirect);
              }
            } else {
              // alert (d.failure_reason);
              t.mostraPopup('Error: ' + d.failure_reason, false, '');
            }
          }
        }
      }
      if (d.v_err_code && d.v_err_code === 2) {
        if (d.v_failure_reason) {
          // alert(d.v_failure_reason);
          t.mostraPopup('Error: ' + d.v_failure_reason, false, '');
        } else {
          // alert('V_ERR_CODE = 2 without failure reason');
          t.mostraPopup('V_ERR_CODE = 2 without failure reason', false, '');
        }
      }
      if (d[0] && d[0].v_err_code && d[0].v_err_code === 2) {
        if (d[0].v_failure_reason) {
          // alert(d[0].v_failure_reason);
          t.mostraPopup('Error: ' + d[0].v_failure_reason, false, '');
        } else {
          // alert('V_ERR_CODE = 2 without failure reason');
          t.mostraPopup('V_ERR_CODE = 2 without failure reason', false, '');
        }
      }
    }
  }

  static ritornaCampoCSVSistemato(e) {
    if (e) {
      let ee = JSON.parse(JSON.stringify(e));
      ee = ee.replace(/[\r\n]+/gm, '');

      return ee;
    } else {
      return undefined;
    }
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

  static messaggioDiErrore(griglia, mess) {
    // t.messaggioDiErrore.emit(mess);
    if (!griglia || griglia === null || typeof(griglia) !== 'string' || (typeof(griglia) === 'string' && griglia !== 'null')) {
      griglia = 'ERROR: ' + JSON.stringify(JSON.parse(mess._body).message);
    } else {
      console.error('ERROR:', mess);
    }
  }

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

  static visualizzaAlert(messaggio) {
    Swal.fire({
      title: 'Confirm',
      text: messaggio,
      icon: 'question',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    });
  }

  static scriveDimensioniColonne(tabella, dimensioniColonne) {
    logConsole('Scrittura dimensioni colonna', tabella, dimensioniColonne);
  }

  static converteStringaInJSON(val) {
    let ee;
    if (typeof(val) === 'string') {
      const vv = val.substring(0, 3);
      // logConsole('Prefisso:', vv);
      if (val !== undefined && val !== '' && val !== 'empty' && val !== 'empty grid' && vv !== '***') {
        // logConsole('Valore da parsare:', val);
        ee  = JSON.parse(val);
        if (typeof(ee) === 'string' && ee !== 'empty grid') {
          if (ee !== '') {
            // logConsole('->' + ee + '<-');
            ee = JSON.parse(ee);
          }
        }
      } else {
        if (vv === '***') {
          ee = val.replace(vv, '');
        } else {
          ee = '';
        }
      }
    } else {
      ee = val;
    }

    return ee;
  }

  static isNumeric(value: unknown): boolean {
  	return typeof value === 'number' && !Number.isNaN(value);
  }

  static PrendeNomeMisuraDaCodice(codice, misure) {
    let display_name = '';
    if (!codice || codice === null || codice === '') {
      return '';
    }

    if (misure !== undefined && misure !== null && codice !== null && codice !== undefined) {
      // logConsole(codice);
      misure.forEach(element2 => {
        // logConsole(element2.CODE, codice);
        if (display_name === '' && element2) {
          if (this.isNumeric(codice)) {
            if (+element2.CODE === codice) {
              display_name = element2.DISPLAY_NAME;
            }
          } else {
            if (element2.CODE && element2.CODE !== null && codice && codice !== null) {
              if (typeof(codice) === 'string') {
                try {
                  if (element2.CODE.toLowerCase().trim() === codice.toLowerCase().trim()) {
                    display_name = element2.DISPLAY_NAME;
                  }
                } catch (e) {
                  console.error('Prende nome misura da codice 3: ', e, codice);
                }
              } else {
                if (typeof(codice) === 'object') {
                  if (codice && codice.DISPLAY_NAME) {
                    display_name = codice.DISPLAY_NAME;
                  }
                }
              }
            }
          }
        }
      });
    }

    return display_name;
  }
}

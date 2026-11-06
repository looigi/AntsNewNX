import { logConsole } from './console-log';
import {transformExtent} from 'ol/proj';
import { FrameUtils } from './framemappa/Utilities.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export default class Utils {
  static modalitaDebug = false;
  static indirizzoServer;
  static linkIcone;
  static serverPostRest;
  // static facadeServerAddress;
  static serverGEOServer;
  static indirizzoGEOServer;
  static limitPerVirtual;
  static urlRoot;
  static permessoFrameEditor = 'false';
  static userRedirect = '';

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

  static prendeBBOX(map1) {
    if (map1) {
      let rit = '';
      const bbox = map1.getView().calculateExtent(map1.getSize());
      const bboxFin = transformExtent(bbox, 'EPSG:3857', 'EPSG:4326');
      // // logConsole('BBox:', bboxFin);
      rit = 'geoants_bbox_min_x:' + bboxFin[0] + ';geoants_bbox_min_y:' + bboxFin[1] + ';';
      rit += 'geoants_bbox_max_x:' + bboxFin[2] + ';geoants_bbox_max_y:' + bboxFin[3];

      return rit;
    } else {
      return '';
    }
  }

  static messaggioDiErrore(griglia, mess) {
    // t.messaggioDiErrore.emit(mess);
    if (!griglia || griglia === null || typeof(griglia) !== 'string' || (typeof(griglia) === 'string' && griglia !== 'null')) {
      griglia = 'ERROR: ' + JSON.stringify(JSON.parse(mess._body).message);
    } else {
      console.error('ERROR:', mess);
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

  static converteStringaInJSON(val) {
    let ee;
    if (typeof(val) === 'string') {
      const vv = val.substring(0, 3);
      // // logConsole('Prefisso:', vv);
      if (val !== undefined && val !== '' && val !== 'empty' && val !== 'empty grid' && vv !== '***') {
        // // logConsole('Valore da parsare:', val);
        ee  = JSON.parse(val);
        if (typeof(ee) === 'string' && ee !== 'empty grid') {
          if (ee !== '') {
            // // logConsole('->' + ee + '<-');
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

  static scriveLog(Cosa, P1?, P2?, P3?, P4?, P5?) {
    if (this.modalitaDebug === true) {
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
}

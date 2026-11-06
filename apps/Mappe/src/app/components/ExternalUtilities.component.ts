import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';
// import {isNumeric} from 'rxjs/util/isNumeric'
// import { Utils } from './Utilities.component';
import OlView from 'ol/View';
import { fromLonLat } from 'ol/proj';
// import Swal from 'sweetalert2/dist/sweetalert2.js';
import download from 'downloadjs';  // Importa downloadjs
import Swal from 'sweetalert2';

@Injectable()
export default class ExternalUtilities {
  static sessione: string = '';
  static listaEventiSE = new Array();
  static clickFrameListaEventi;
  static frameZoomSpostato = -1;
  static mappeZoomSpostate = [false, false, false, false, false, false, false, false, false, false, false];
  static bboxImpostataNelFrame = undefined;
  static zoomImpostatoNelFrame = undefined;
  static misureGlobali = ['', '', '', ''];
  // static misureGlobaliMappa = ['', '', '', ''];
  // static ultimaBBoxImpostata;
  static staMassimizzando = [false, false, false, false, false, false, false, false, false, false, false];

  static edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  static isNumeric(value: unknown): boolean {
  	return typeof value === 'number' && !Number.isNaN(value);
  }

  static checkRitornoChiamata(Utils, d) {
    if (d) {
      if (d.err_code) {
        if (d.err_code === 1) {
          if (d.failure_reason) {
            // return;
            if (d.failure_reason === 'cntx invalid') {
              // Torna al login
              if (Utils.userRedirect === 'default') {
                localStorage.setItem('ERROR', 'CNTX_INVALID');
                window.location.href = Utils.urlRoot + 'login/?err=cntx_invalid';
              } else {
                location.assign(Utils.userRedirect);
              }
            } else {
              ExternalUtilities.visualizzaAlert (d.failure_reason);
            }
          }
        }
      }
      if (d.v_err_code && d.v_err_code === 2) {
        if (d.v_failure_reason) {
          ExternalUtilities.visualizzaAlert(d.v_failure_reason);
        } else {
          ExternalUtilities.visualizzaAlert('V_ERR_CODE = 2 without failure reason');
        }
      }
      if (d[0] && d[0].v_err_code && d[0].v_err_code === 2) {
        if (d[0].v_failure_reason) {
          ExternalUtilities.visualizzaAlert(d[0].v_failure_reason);
        } else {
          ExternalUtilities.visualizzaAlert('V_ERR_CODE = 2 without failure reason');
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

  static sistemaJSONPerSalvarloSuDB(j) {
    const jj = JSON.stringify(j);
    const a = new Array();

    for (let i = 0; i < jj.length; i ++) {
      const s = jj.substring(i, i + 1);
      a.push(s.charCodeAt(0));
      // logConsole(s);
    }
    return a.toString();
  }

  static sistemaStringaLettaDaDB(j) {
    const jj = j.trim();
    const a = jj.split(',');
    let s = '';

    if (!this.isNumeric(a[0])) {
      // logConsole('Esco per stringa brutta');
      return '{}';
    }

    a.forEach(element => {
      // logConsole(element, String.fromCharCode(element))
      s += String.fromCharCode(element);
    });

    return s;
  }

  static VECCHIOsistemaJSONPerSalvarloSuDB(j) {
    if (j !== null) {
      let impost = JSON.stringify(j);

      while (impost.indexOf('"') > -1) {
        impost = impost.replace('"', '*2V*');
      }
      while (impost.indexOf(',') > -1) {
        impost = impost.replace(',', '*V*');
      }
      while (impost.indexOf(':') > -1) {
        impost = impost.replace(':', '*2P*');
      }
      while (impost.indexOf('{') > -1) {
        impost = impost.replace('{', '*GA*');
      }
      while (impost.indexOf('}') > -1) {
        impost = impost.replace('}', '*GC*');
      }
      while (impost.indexOf('\\') > -1) {
        impost = impost.replace('\\', '*B*');
      }

      return impost;
    } else {
      return '';
    }
  }

  static VECCHIOsistemaStringaLettaDaDB(j) {
    if (j !== null) {
      let jj = j;

      while (jj.indexOf('*2V*') > -1) {
        jj = jj.replace('*2V*', '"');
      }
      while (jj.indexOf('*V*') > -1) {
        jj = jj.replace('*V*', ',');
      }
      while (jj.indexOf('*2P*') > -1) {
        jj = jj.replace('*2P*', ':');
      }
      while (jj.indexOf('*GA*') > -1) {
        jj = jj.replace('*GA*', '{');
      }
      while (jj.indexOf('*GC*') > -1) {
        jj = jj.replace('*GC*', '}');
      }
      while (jj.indexOf('*B*') > -1) {
        jj = jj.replace('*B*', '\\');
      }

      return jj;
    } else {
      return '';
    }
  }

  static ritornaRigaTotaleDaDescrizioneCombo(desc, dati, campoTesto) {
    let ee = desc;
    if (typeof(ee) === 'object') {
      ee = ee[campoTesto];
    }
    // logConsole(ee);
    if (ee && ee.substring(0, 1) === '"' && ee.substr(ee.length - 1) === '"') {
      ee = ee.substring(1, ee.length);
      ee = ee.substring(0, ee.length - 1);
    }
    // logConsole('Cambiato valore combo:', ee);
    let ritorno: any;
    ritorno = null;
    if (dati) {
      dati.forEach(element => {
        if (ee === element[campoTesto]) {
          ritorno = element;
        }
      });
    }

    return ritorno;
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

  static prendeActivitySceltaPerEvents(t, Utils) {
    let act_id = '';
    let conta2 = 0;
    // logConsole(t.NumeroFrame, t.Activity2);
    if (t.Activity2 === 0) { // LATEST SELECTION
      // logConsole(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_id = t.activitySceltaDaSet[conta2];
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
        // logConsole(this.sceltaActivityDaSet);
        Utils.sceltaActivityDaSet.forEach(element => {
          if (element) {
            element.forEach(element2 => {
              // logConsole(element2.ID);
              if (element2.ID && element.ID !== null && element2.ID.toString().trim() !== '') {
                act_id += element2.ID + ',';
              }
            });
          }
        });
        if (act_id !== '') {
          act_id = act_id.substring(0, act_id.length - 1);
        }
      } else {
        //  logConsole(this.datiTipiActivity, t.Activity2, t.activitySceltaDaSet, t.listaActivityName2, this.sceltaActivityDaSet);
        // conta2 = 1;
        // let act = '';
        // this.datiTipiActivity.forEach(element => {
        //   if (t.Activity2 === element.id) {
        //     act = t.activitySceltaDaSet[conta2];
        //   }
        //   conta2++;
        // });
        const act = t.activitySceltaDaSet[t.Activity2];
        // logConsole(act);
        if (Utils.sceltaActivityDaSet[t.Activity2]) {
          Utils.sceltaActivityDaSet[t.Activity2].forEach(element => {
            if (act === element.NAME) {
              if (element.ID && element.ID !== null && element.ID.toString().trim() !== '') {
                act_id = element.ID;
              }
            }
          });
        }
      }
    }
    act_id = this.toglieVirgoleInutili(act_id);
    // logConsole('Activity Set', act_id);
    return act_id;
  }

  static prendeTuttiIdActSet(t, conSlash, Utils) {
    let act_id = '';
    let altro = ',';
    if (conSlash === true) {
      altro = '\\,';
    }

    if (t.Activity2 === 0) { // LATEST SELECTION
      let conta = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            Utils.sceltaActivityDaSet[conta].forEach(element2 => {
              act_id += element2.ID + ',';
            });
          }
        }
        conta++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
        Utils.sceltaActivityDaSet.forEach(element => {
          element.forEach(element2 => {
            act_id += element2.ID + altro;
          });
        });
      } else {
        if (Utils.sceltaActivityDaSet[t.Activity2]) {
          Utils.sceltaActivityDaSet[t.Activity2].forEach(element => {
            act_id += element.ID + altro;
          });
        } else {
          act_id = '';
        }
      }
    }

    if (act_id !== '') {
      if (conSlash === false) {
        act_id = this.toglieVirgoleInutili(act_id);
      } else {
        if (act_id.substring(act_id.length - 1, act_id.length) === ',') {
          act_id = act_id.substring(0, act_id.length - 2);
        }
      }
    }

    return act_id;
  }

  static toglieVirgoleInutili(act_id) {
    act_id = act_id.toString().trim();
    // logConsole(act_id.substring(0, 1));
    if (act_id.substring(0, 1) === ',') {
      act_id = act_id.substring(1, act_id.length);
    }
    // logConsole(act_id.substring(act_id.length - 1, act_id.length));
    if (act_id.substring(act_id.length - 1, act_id.length) === ',') {
      act_id = act_id.substring(0, act_id.length - 1);
    }
    // logConsole(act_id);
    return act_id;
  }

  static prendeActivitySceltaPerPointCM(t, Utils) {
    let act_set = '';
    let conta2 = 0;
    // logConsole(t.NumeroFrame, t.Activity2);
    if (t.Activity2 === 0) { // LATEST SELECTION
      // logConsole(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_set = t.activitySceltaDaSet[conta2];
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
        // logConsole(this.sceltaActivityDaSet);
        Utils.sceltaActivityDaSet.forEach(element => {
          if (element) {
            element.forEach(element2 => {
              act_set += element2.ID + ',';
            });
          }
        });
        if (act_set !== '') {
          act_set = act_set.substring(0, act_set.length - 1);
        }
      } else {
        // logConsole(this.datiTipiActivity, t.Activity2, t.activitySceltaDaSet, this.sceltaActivityDaSet);
        conta2 = 1;
        let ac = '';
        Utils.datiTipiActivity.forEach(element => {
          if (t.Activity2 === element.id) {
            ac = t.activitySceltaDaSet[conta2];
          }
          conta2++;
        });
        if (ac !== '' && Utils.sceltaActivityDaSet) {
          // logConsole(ac, this.sceltaActivityDaSet);
          Utils.sceltaActivityDaSet[t.Activity2].forEach(element => {
            if (element) {
              if (ac === element.NAME) {
                act_set = element.ID;
              }
            }
          });
        }
      }
    }
    // logConsole('Activity Set', act_set);
    act_set = this.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static prendeActivitySceltaCellMeasures(t, Utils) {
    let act_set = '';
    let conta2 = 0;

    // logConsole(t.NumeroFrame, t.Activity2);
    if (t.Activity2 === 0) { // LATEST SELECTION
      // logConsole(t.NumeroFrame, this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_set = element.ID;
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
        // logConsole(t.NumeroFrame, act_set, this.sceltaActivityDaSet);
        Utils.sceltaActivityDaSet.forEach(element => {
          if (element) {
            element.forEach(element2 => {
              // console.log ('Presa ', element);
              act_set += element2.SET_ID + ',';
            });
          }
        });
        if (act_set !== '') {
          act_set = act_set.substring(0, act_set.length - 1);
        }
      } else {
        // logConsole(t.NumeroFrame, t.listaActivityName2[t.Activity2]);
        conta2 = 1;
        // this.datiTipiActivity.forEach(element => {
        //   if (t.Activity2 === element.id) {
        //     act_set = element.id;
        //   }
        //   conta2++;
        // });
        if (t.listaActivityName2[t.Activity2]) {
          act_set = t.listaActivityName2[t.Activity2].ID;
        }
      }
    }
    // logConsole('Activity Set', t.NumeroFrame, act_set);
    act_set = this.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static prendeActivityScelta(t, Utils) {
    let act_set = '';
    let conta2 = 0;

    if (t.Activity2 === 0) { // LATEST SELECTION
      // logConsole(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_set = t.activitySceltaDaSet[conta2];
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
      } else {
        // logConsole(t.NumeroFrame, this.datiTipiActivity, t.Activity2, t.activitySceltaDaSet, t.listaActivityName2);
        conta2 = 1;
        Utils.datiTipiActivity.forEach(element => {
          if (t.Activity2 === element.id) {
            act_set = t.activitySceltaDaSet[conta2];
          }
          conta2++;
        });
      }
    }
    // logConsole('Activity Set', act_set);
    act_set = this.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static prendeActivitySceltaGrafici(t, Utils) {
    let act_set = '';
    let conta2 = 0;

    if (t.Activity2 === 0) { // LATEST SELECTION
      // this.scriveLog(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element && element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_set = t.stringaAGNoACT;
          }
        }
        conta2++;
      });
      if (!act_set) {
        logConsole('ERRORE: activity selezionata non impostata', t.listaActivityName2, Utils.act_setDelPuntoClickatoSullaMappa);
      }
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
      } else {
        // this.scriveLog(t.NumeroFrame, this.datiTipiActivity, t.Activity2, t.stringaAGNoACT, t.listaActivityName2);
        /* conta2 = 1;
        this.datiTipiActivity.forEach(element => {
          if (t.Activity2 === element.id) {
            act_set = t.stringaAGNoACT[conta2];
          }
          conta2++;
        }); */
        if (t.listaActivityName2[t.Activity2] && t.listaActivityName2[t.Activity2].NAME) {
          act_set = t.listaActivityName2[t.Activity2].NAME;
        } else {
          logConsole('ERRORE: activity selezionata senza il campo NAME', t.listaActivityName2, t.Activity2, 
            t.listaActivityName2[t.Activity2], Utils.act_setDelPuntoClickatoSullaMappa);
        }
      }
    }
    // this.scriveLog('Activity Set', act_set);
    if (act_set) {
      act_set = this.toglieVirgoleInutili(act_set);
    }
    return act_set;
  }

  static ritornaStringPerActivitySet(t, Utils) {
    const modalitaActivitySet = t.Activity2;
    let act_set = '';

    switch (modalitaActivitySet) {
      case -1:
        let conta = 1;
        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME !== 'empty') {
            act_set += ('geo_act_set_name_' + conta + ':' + element.NAME + ';');
            conta++;
          }
        });
        if (act_set !== '') {
          act_set = act_set.substring(0, act_set.length - 1);
        }
        break;
      case 0:
        act_set = 'geo_act_set_name_1:' + Utils.act_setDelPuntoClickatoSullaMappa;
        break;
      default:
        act_set = 'geo_act_set_name_1:' + t.act_set;
        break;
    }
    // logConsole('Act set ritornata:', act_set);

    return act_set;
  }

  static ritornaStringPerActivitySetAPoint(t, act_set_p) {
    if (t.activity2) {
      // logConsole(t.activity2)
      const modalitaActivitySet = t.Activity2;
      let act_set = '';

      switch (modalitaActivitySet) {
        case 0:
          act_set = act_set_p;
          break;
        default:
          act_set = t.act_set;
          break;
      }
      // logConsole('Act set ritornata:', act_set);

      return act_set;
    } else {
      return act_set_p;
    }
  }

  static ritornaStringPerActivitySetAGrafici(t, Utils) {
    const modalitaActivitySet = t.Activity2;
    let act_set = '';

    // logConsole(modalitaActivitySet);
    switch (modalitaActivitySet) {
      case -1:
        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME !== 'empty') {
            act_set += ('geo_act_set_name = \'' + element.NAME + '\' or ');
          }
        });
        if (act_set !== '') {
          act_set = '(' + act_set.substring(0, act_set.length - 4) + ')';
        }
        break;
      case 0:
        act_set = Utils.act_setDelPuntoClickatoSullaMappa;
        break;
      default:
        act_set = t.act_set;
        break;
    }
    // logConsole('Act set ritornata:', act_set);

    return act_set;
  }

  static ritornaStringPerActivitySetEventSummary(t, Utils) {
    const modalitaActivitySet = t.Activity2;
    let act_set = '';

    // logConsole(t.listaActivityName2);
    switch (modalitaActivitySet) {
      case -1:
        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME !== 'empty') {
            act_set += (element.ID + ',');
          }
        });
        if (act_set !== '') {
          act_set = act_set.substring(0, act_set.length - 1);
        }
        // logConsole('-1', act_set);
        break;
      case 0:
        act_set = Utils.act_setDelPuntoClickatoSullaMappa;

        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME === act_set) {
            act_set = element.ID;
          }
        });
        // logConsole('0', act_set);
        break;
      default:
        // act_set = t.act_set;

        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME === t.act_set) {
            act_set = element.ID;
          }
        });
        // logConsole('>0', act_set);
        break;
    }
    // logConsole('Act set ritornata:', act_set);

    act_set = this.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static calcolaTimeSpan(Utils) {
    const diff = (new Date(Utils.tmsFine).getTime() - new Date(Utils.tmsInizio).getTime()) / 1000;
    return +diff;
  }

  static creaRangeSelezionato(daDove, tms, Utils, modalitaRT, range2?) {
    let range;
    if (range2) {
      range = range2 * 1000;
    } else {
      range = this.calcolaTimeSpan(Utils);
      if (range) {
        range *= 1000;
      } else {
        range = 1000;
      }
    }
    /* if (Utils.range === undefined) {
      if (Utils.rangeDiSecondiPerMille !== undefined) {
        Utils.range = Utils.rangeDiSecondiPerMille;
        // logConsole('RANGE definito', this.range);
      } else {
        Utils.range = 1000;
        logConsole('RANGE non definito. Imposto 1000 come default', q);
      }
    } else {
      // logConsole('RANGE già definito', this.range);
    } */
    // logConsole('Tms:', tms, new Date(tms), this.range);
    if (tms) {
      let dInizio = -1;
      let sInizio = -1;
      let dFine;
      let sFine;

      if (modalitaRT) {
        dInizio = ((new Date(tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) - range);
        sInizio = Utils.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        dFine = ((new Date(tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()));
        sFine = Utils.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss', 'UTC');
      } else {
        dInizio = ((new Date(tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) - (range / 2));
        sInizio = Utils.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        dFine = ((new Date(tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) + (range / 2));
        sFine = Utils.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss', 'UTC');
      }

      // logConsole('RANGE Selezionato: ', q, sInizio, sFine);
      // logConsole(this.tmsSelezionato, typeof(this.tmsSelezionato));
      // alert('Cambio tms start/end: ' + sInizio + ' - ' + sFine);
      
      // logConsole('TMS INIZIO 11', sInizio, daDove);
      // logConsole('TMS FINE 11', sFine, daDove);
      Utils.tmsInizio = sInizio;
      Utils.tmsFine = sFine;

      Utils.rangeSelezionatoStampa = sInizio + '<br />' + sFine;
      // logConsole('Range:', q, sInizio + ';' + sFine);
    }
  }

  static ultimoTMS;

  static aggiornaTmsStringa(t, Utils, daDove) {
    if (t && t !== null) {
      if (Utils.tmsSelezionato === this.ultimoTMS) {
        return;
      }
      this.ultimoTMS = Utils.tmsSelezionato;

      if (t.debug2) {
        // logConsole('Aggiorna TMS 1', t, daDove);
      }
      if (typeof(t) === 'string') {
        Utils.tmsSelezionato = t.replace('Z', ' ').replace('T', ' ');
      } else {
        Utils.tmsSelezionato = (Utils.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss', 'UTC')).replace('Z', ' ').replace('T', ' ');
      }
      if (this.isNumeric(t)) {
        Utils.tmsSelezionato = (Utils.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss', 'UTC')).replace('Z', ' ').replace('T', ' ');
      }
      if (Utils.tmsSelezionato.indexOf('.') > -1) {
        Utils.tmsSelezionato = Utils.tmsSelezionato.substring(0, Utils.tmsSelezionato.indexOf('.'));
      }
      /* const tm = setTimeout(() => {
        Utils.tmsSelezionato = Utils.tmsSelezionatoStringa;
        if (t.debug2) {
          logConsole('Aggiorna TMS 2', t, daDove);
        }
      }, 100); */
    }
  }

  /* ricalcolaRange(t, tms) {
    const dInizio = ((new Date(tms).getTime()) - (this.range));
    const sInizio = this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    const dFine = ((new Date(tms).getTime()) + (this.range));
    const sFine = this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss', 'UTC');

    this.rangeSelezionato[t.frameAttivo][t.NumeroFrame] = sInizio + ';' + sFine + ';';
    // logConsole('Range modificato:', this.rangeSelezionato);
    if (sInizio !== null && sFine !== null) {
      this.rangeSelezionatoStampa = sInizio + '<br />' + sFine;
    } else {
      this.rangeSelezionatoStampa = '';
    }
  } */

  static contaErrori(csv) {
    if (csv === undefined) {
      return -1;
    } else {
      if (csv.length === 0 || csv.trim === '') {
        return -2;
      } else {
        // logConsole(csv.length);
        let errori = 0;
        let err = '';
        csv.forEach(element => {
          // logConsole(element[0]);
          if (element[0].indexOf('<ServiceException') > -1) {
            errori++;
            // if (element[0].indexOf('Detail:') > -1) {
            //   logConsole('ERRORE: ' + element);
            // }
          }
          if (errori > 0) {
            if (errori === 1) {
              err += 'ERRORE: ';
            }
            let ee = JSON.stringify(element);
            ee = ee.replace('[', '');
            ee = ee.replace(']', '');
            ee = ee.trim() + ' ';
            err += ee;
          }
        });
        if (err !== '') {
          ExternalUtilities.visualizzaAlert('ATTENZIONE!!! Errore nella query. Visualizzare la console');
          logConsole(err);
        }

        return errori;
      }
    }
  }

  static tornaSla(t) {
    let sla = '';

    // logConsole('Sla attuale:', t.NumeroFrame, t.slaValue2);
    if (t.slaValue2 || t.slaValue2 === 0) {
      // if (typeof(t.slaValue2) === 'object') {
        // logConsole('Converto sla globale', t.NumeroFrame, t.slaValue2);
        // if (t.slaValue2.NAME === environment.stringaGlobalSettingSLA || t.slaValue2.NAME === '<Global Template>') {
          // logConsole(t.datiSlaDT);
          if (t.datiSlaDT && t.datiSlaDT !== null && t.datiSlaDT !== 'empty grid') {
            t.datiSlaDT.forEach(element => {
              if (element.ID === t.slaValueGlobale2) {
                sla = element.NAME;
              }
            });
          }
        // } else {
        //   if (t.slaValue2.NAME === environment.stringaGlobalSettingSLA || t.slaValue2.NAME === '<Global Template>') {
        //    if (t.datiSlaDT && t.datiSlaDT !== null && t.datiSlaDT !== 'empty grid') {
        //       t.datiSlaDT.forEach(element => {
        //         if (element.ID === t.slaValueGlobale2) {
        //           sla = element.NAME;
        //         }
        //       });
        //     }
            // logConsole('Ritorno SLA normale convertito da globale ',t.NumeroFrame, sla);
        //   } else {
        //     sla = t.slaValue2.NAME;
            // logConsole('Ritorno SLA normale ', t.NumeroFrame, sla);
        //   }
        // }
      // } else {
      //   sla = this.tornaSla2(t);
        // logConsole('Ritorno SLA2 ', t.NumeroFrame, sla);
      // }
    }

    return sla;
  }

  static tornaIDSla(t) {
    let sla = '';

    // logConsole('Sla attuale:', t.NumeroFrame, t.slaValue2);
    if (t.slaValue2 || t.slaValue2 === 0) {
      // if (typeof(t.slaValue2) === 'object') {
        // logConsole('Converto sla globale', t.NumeroFrame, t.slaValue2);
        // if (t.slaValue2.NAME === environment.stringaGlobalSettingSLA || t.slaValue2.NAME === '<Global Template>') {
          // logConsole(t.datiSlaDT);
          if (t.datiSlaDT && t.datiSlaDT !== null && t.datiSlaDT !== 'empty grid') {
            t.datiSlaDT.forEach(element => {
              if (element.ID === t.slaValueGlobale2) {
                sla = element.ID;
              }
            });
          }
        // } else {
        //   if (t.slaValue2.NAME === environment.stringaGlobalSettingSLA || t.slaValue2.NAME === '<Global Template>') {
        //     if (t.datiSlaDT && t.datiSlaDT !== null && t.datiSlaDT !== 'empty grid') {
        //       t.datiSlaDT.forEach(element => {
        //         if (element.ID === t.slaValueGlobale2) {
        //           sla = element.ID;
        //         }
        //       });
        //     }
            // logConsole('Ritorno SLA normale convertito da globale ',t.NumeroFrame, sla);
        //   } else {
        //     sla = t.slaValue2.ID;
            // logConsole('Ritorno SLA normale ', t.NumeroFrame, sla);
        //   }
        // }
      // } else {
      //   sla = this.tornaSla2ID(t);
        // logConsole('Ritorno SLA2 ', t.NumeroFrame, sla);
      // }
    }

    return sla;
  }

  static tornaSla2(t) {
    let sla = '';
    // logConsole('Sla impostato in locale:', t.NumeroFrame, t.slaValue2, t.slaName2);
    // if (t.slaValue2 === -1) {
    //   if (t.datiSla) {
    //     t.datiSla.forEach(element => {
    //       if (element.ID === t.slaValueGlobale2) {
    //         sla = element.NAME;
    //       }
    //     });
    //   }
      // logConsole('Sla impostato come globale per il frame ' + t.NumeroFrame, sla);
    // } else {
      if (t.datiSlaDT) {
        t.datiSlaDT.forEach(element => {
          if (element.ID === t.slaValue2) {
            sla = element.NAME;
          }
        });
      }
      // logConsole('Sla impostato come locale per il frame ' + t.NumeroFrame, sla);
    // }

    return sla;
  }

  static tornaSla2ID(t) {
    let sla = '';
    // logConsole('Sla impostato in locale:', t.NumeroFrame, t.slaValue2, t.slaName2);
    // if (t.slaValue2 === -1) {
    //   if (t.datiSla) {
    //     t.datiSla.forEach(element => {
    //       if (element.ID === t.slaValueGlobale2) {
    //         sla = element.ID;
    //       }
    //     });
    //   }
      // logConsole('Sla impostato come globale per il frame ' + t.NumeroFrame, sla);
    // } else {
      if (t.datiSlaDT) {
        t.datiSlaDT.forEach(element => {
          if (element.ID === t.slaValue2) {
            sla = element.ID;
          }
        });
      }
      // logConsole('Sla impostato come locale per il frame ' + t.NumeroFrame, sla);
    // }

    return sla;
  }

  static tornaGlobale(t) {
    // logConsole('Valore mapType', t.NumeroFrame, t.mapType);
    if (t.mapType2 === -1) {
      return true;
    } else {
      return false;
    }
  }

  static creaMatriceView(x, y) {
    const m = new Array();
    for (let i = 0; i <= x; i++) {
      m.push(new Array());
      for (let j = 0; j <= y; j++) {
        const coord = [ 12.4963655, 41.9027835 ];

        const view = new OlView({
          center: fromLonLat(coord),
          zoom: 10
        });

        m[i].push(view);
      }
    }
    // logConsole(m);
    return m;
  }

  static creaMatrice(x, y, valore) {
    const m = new Array();
    for (let i = 0; i <= x; i++) {
      m.push(new Array());
      for (let j = 0; j <= y; j++) {
        if (valore && valore !== true && valore !== false && !this.isNumeric(valore) && valore !== null && !this.isArray(valore)) {
          const v = valore.replace('***CONT***', i);
          m[i].push(v);
        } else {
          m[i].push(valore);
        }
      }
    }
    // logConsole(m);
    return m;
  }

  static creaVettore(x, valore) {
    const m = new Array();
    for (let j = 0; j <= x; j++) {
      if (valore && valore !== true && valore !== false && !this.isNumeric(valore) && valore !== null && !this.isArray(valore)) {
        const v = valore.replace('***CONT***', j);
        m.push(v);
      } else {
        m.push(valore);
      }
    }
    // logConsole(m);
    return m;
  }

  static isArray(obj: any ) {
    return Array.isArray(obj)
  }

  static creaMatriceMisure(x, y, z) {
    const m = new Array();
    for (let i = 0; i <= x; i++) {
      m.push(new Array());
      for (let j = 0; j <= y; j++) {
        m[i].push(new Array());
        for (let k = 0; k <= z; k++) {
          m[i][j].push('');
        }
      }
    }
    // logConsole(m);
    return m;
  }

  static salvaCSV(righeJson, nomeFile) {
    let s = '';
    let i = '';
    let riga = 0;
    // logConsole(righeJson);
    righeJson.forEach(element => {
      let r = JSON.stringify(element); //  JSON.stringify(element.properties);
      if (r && r !== '') {
        r = r.replace('{', '');
        r = r.replace('}', '');
        const r2 = r.split(';');
        // logConsole(r2);
        r2.forEach(element2 => {
          const r3 = element2.split(',');
          r3.forEach(element3 => {
            const r4 = element3.split(':');
            if (riga === 0) {
              let rr4 = r4[0];
              while (rr4.indexOf('"') > -1) {
                rr4 = rr4.replace('"', '');
              }
              i += rr4 + ';';
            }
            let rr3 = r4[1];
            while (rr3.indexOf('"') > -1) {
              rr3 = rr3.replace('"', '');
            }
            s += rr3 + ';';
          });
        });
        if (riga === 0) {
          s = i + '\n' + s;
        }
        s += '\n';
        riga++;
      }
    });
    // logConsole(s);
    // const FileSaver = require('file-saver');
    const blob = new Blob([s], {type: 'text/plain;charset=utf-8'});
    // FileSaver.saveAs(blob, nomeFile);
    download(blob, nomeFile, 'text/plain;charset=utf-8');
  }

  static sistemaNomeFrame(t, cosa) {
    let nf = cosa;
    const caratteriDaEliminare = ' <>+:=?*|/\\&%"#.,';
    for (let i = 0; i < caratteriDaEliminare.length; i++) {
      const carattere = caratteriDaEliminare.substring(i, i + 1);
      // logConsole(carattere);
      while (nf.indexOf(carattere) > -1) {
        nf = nf.replace(carattere, '_');
      }
    }
    return nf;
  }

  static messaggioDiErrore(griglia, mess) {
    // t.messaggioDiErrore.emit(mess);
    // logConsole(typeof(griglia), mess);
    if (!griglia || griglia === null || typeof(griglia) !== 'string' || (typeof(griglia) === 'string' && griglia !== 'null')) {
      griglia = 'ERROR: ' + JSON.stringify(JSON.parse(mess._body).message);
    } else {
      console.error('ERROR:', mess);
    }
  }

  static messaggioDiErroreEsterno(t, mess) {
    // logConsole('ERROR:', mess);
    t.messaggioDiErrore = true;
  }

  static decripta(s) {
    let rit = '';
    if (s && s !== '') {
      const c = s.split(';');
      // logConsole(c, +c[c.length - 2], c.length - 2);
      const differenza = +c[0];
      const lunghezza = +c[c.length - 2];
      // logConsole('Differenza: ', differenza);
      // logConsole('Lunghezza: ', lunghezza);

      for (let i = 1; i < lunghezza + 1; i ++) {
        // logConsole('Carattere ' + i + ': ', c[i]);
        let v = +c[i] - (i - 1);
        // logConsole('Valore Carattere ' + i + ': ', v);
        v -= differenza;
        // logConsole('Carattere ' + i + '. Differenza: ', v);
        const car = String.fromCharCode(v);
        // logConsole('Carattere ' + i + ': ', car);
        rit += car;
      }
    }

    return rit;
  }

  static visualizzaAlert(messaggio) {
    Swal.fire({
      title: '',
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

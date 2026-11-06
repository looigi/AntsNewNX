import { logConsole } from './console-log';
import { Injectable } from '@angular/core';
// import {isNumeric} from 'rxjs/util/isNumeric';
// import {transformExtent} from 'ol/proj';
import {transform} from 'ol/proj';
import OlView from 'ol/View';
import { fromLonLat } from 'ol/proj';
// import { DecimalPipe } from '@angular/common';
// import Swal from 'sweetalert2/dist/sweetalert2.js';
// import { isNumeric } from 'rxjs/internal-compatibility';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

@Injectable()
export default class ExternalUtilities {
  static ultimiParametriCaricati = '';
  static datiIA = undefined;
  // Parametri con cui sono arrivati i dati in datiIA: la cache si riusa solo se coincidono
  static parametriDatiIA = '';
  // static bboxOverview = undefined;
  // static bboxImpostataNelFrame = undefined;
  // static zoomImpostatoNelFrame = undefined;
  static squareMetersGlobaleOverView = 200;
  // static bboxZoom = undefined;
  static bboxMaschera = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  static spostaCentroAttuale = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  static squareMetersGlobaleZoom = 200;
  static bboxSelected = {};
  static boxDisegnatoSuMappa = '';
  static clusterSetName = '';
  static stringaAGNoACT = '';
  static csvLetto = '';
  // static actIdCDR = '';
  // static posDaImpostare = '';
  // static impostataMascheraProgettoEsterno = false;
  static valoreRiduzione = 1000;
  // static bboxAttuale = new Array();
  static bboxStringa = '';
  static bboxExport = '';
  static bboxAttualeFisso = new Array();
  static bboxStringaFisso = '';
  static bboxExportFisso = '';
  static eseguitoBounds = false;
  // static centroImpostato = undefined;
  // static layersRilevati = new Array();
  static frameZoomSpostato = -1;
  static mappeZoomSpostate = [false, false, false, false, false, false, false, false, false, false, false];
  static lastLoadCsv = '';
  static listaEventiSE = new Array();
  static misureGlobali = ['', '', '', '', '', ''];
  // static misureGlobaliMappa = ['', '', '', ''];
  static frameCheHaClickatoSullaMappa;
  
  static datiPointMeasures;
  static titoloPointMeasures = '';
  static vecchiaChiamataDPM = '';

  static staMassimizzando = [false, false, false, false, false, false, false, false, false, false, false];
  // static ultimaBBoxImpostata;

  static edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  static modalitaDebug = false;

  constructor(
    ) {

  }

  static ritornaBboxGiusta(t, daDove) {
    let qualeBbox;
    const debug = false;

    if (t.MappaOGrafico2 === 'M') {
      if (t.bboxImpostataNelFrame) {
        qualeBbox = t.bboxImpostataNelFrame;
        qualeBbox = this.sistemaBBox(t, qualeBbox, daDove, '1');
        if (debug) { logConsole('Ritorna bbox 1', qualeBbox); }
      } else {
        if (!ExternalUtilities.bboxMaschera[t.NumeroFrame2]) {
          // alert('BBOX frame ' + t.NumeroFrame2 + ' vuota');
          if (t.overviewZoom2 === false) {
            qualeBbox = t.bboxOverview;
            qualeBbox = this.sistemaBBox(t, qualeBbox, daDove, '2');
            t.bboxOverview = qualeBbox;
            if (debug) { logConsole('Ritorna bbox 2', qualeBbox); }
          } else {
            // if (+t.comboSelArea2 === 1) {
              qualeBbox = t.bboxZoom;
              qualeBbox = this.sistemaBBox(t, qualeBbox, daDove, '3');
              t.bboxZoom = qualeBbox;
              /* } else {
              if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG[0] && ExternalUtilities.rigaSelezionataMG[0].SQUARE_SNAP) {
                qualeBbox = ExternalUtilities.rigaSelezionataMG[0].SQUARE_SNAP;
              } else {
                qualeBbox = '';
              }
            } */
            if (debug) { logConsole('Ritorna bbox 3', qualeBbox); }
          }
          if (qualeBbox) {
            ExternalUtilities.bboxMaschera[t.NumeroFrame2] = qualeBbox;
          }
        } else {
          qualeBbox = ExternalUtilities.bboxMaschera[t.NumeroFrame2];
          qualeBbox = this.sistemaBBox(t, qualeBbox, daDove, '4');
          ExternalUtilities.bboxMaschera[t.NumeroFrame2] = qualeBbox;
          if (debug) { logConsole('Ritorna bbox 4', qualeBbox); }
        }
      }
    } else {
      if (+t.geoFilter2 === 1 || t.geoFilter2 === 1) {
        qualeBbox = t.bboxOverview;
        qualeBbox = this.sistemaBBox(t, qualeBbox, daDove, '5');
        t.bboxOverview = qualeBbox;
        if (debug) { logConsole('Ritorna bbox 5', qualeBbox); }
      } else {
        if (+t.geoFilter2 === 2 || t.geoFilter2 === 2) {
          // if (+t.comboSelArea === 1) {
            qualeBbox = t.bboxZoom;
            qualeBbox = this.sistemaBBox(t, qualeBbox, daDove, '6');
            t.bboxZoom = qualeBbox;
            /* } else {
            if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG[0] && ExternalUtilities.rigaSelezionataMG[0].SQUARE_SNAP) {
              qualeBbox = ExternalUtilities.rigaSelezionataMG[0].SQUARE_SNAP;
            } else {
              qualeBbox = '';
            }
          } */
          if (debug) { logConsole('Ritorna bbox 6', qualeBbox); }
        } else {
          qualeBbox = [ -90, -180, 90, 180 ];
          if (debug) { logConsole('Ritorna bbox 7', qualeBbox); }
        }
      }
    }

    return qualeBbox;
  }

  static converteBBoxDentroChiamataWMS(t, noCacheUrl) {
    let bboxFine = '';
    let modalita = '';
    let inizio = -1;

    if (noCacheUrl.indexOf('v_bbox%3A\'BOX') > -1) {
      modalita = 'v_bbox';
      inizio = noCacheUrl.indexOf('v_bbox%3A\'BOX');
      // v_bbox:'BOX(12.217513303320313|41.752677851557905|12.600661496679688|41.89186011516787)'
      // logConsole('No Cache Url con v_bbox', noCacheUrl);

      // return noCacheUrl;
    } else {
      if (noCacheUrl.indexOf('geoants_bbox_m') === -1) {
        return noCacheUrl;
      } else {
        modalita = 'bbox_m';
        // logConsole('URL Layer prima', noCacheUrl);

        inizio = noCacheUrl.indexOf('geoants_bbox_min_x');
      }
    }
    const bbox = noCacheUrl.substring(inizio, noCacheUrl.length);
    const fine = bbox.indexOf('&WIDTH');
    bboxFine = bbox.substring(0, fine);

    const inizioBBoxReale = noCacheUrl.indexOf('&BBOX=');
    if (inizioBBoxReale > -1) {
      let bboxReale = noCacheUrl.substring(inizioBBoxReale + 6, noCacheUrl.length);
      const bboxPassataOriginale = bboxReale;
      if (bboxReale.indexOf('&') > -1) {
        bboxReale = bboxReale.substring(0, bboxReale.indexOf('&'));
      }

      while (bboxReale.indexOf('%2C') > -1) {
        bboxReale = bboxReale.replace('%2C', ';');
      }

      let bboxMappa;
      if (bboxReale.indexOf(';') > -1) {
        bboxMappa = bboxReale.split(';');
      } else {
        if (bboxReale.indexOf(',') > -1) {
          bboxMappa = bboxReale.split(',');
        } else {
          logConsole('Nessun carattere di split per la bbox passata', bboxReale);
        }
      }
      let bboxMappa2 = t.sistemaCoordinate(bboxMappa, '4326');
      if (bboxMappa2[0].toString().indexOf('Infinity') > -1 || bboxMappa2[1].toString().indexOf('Infinity') > -1 ||
        bboxMappa2[2].toString().indexOf('Infinity') > -1 || bboxMappa2[3].toString().indexOf('Infinity') > -1) {
          logConsole('BBox infinity', bboxMappa);
      } else {
        if (+bboxMappa2[0] > +bboxMappa2[1]) {
          // Tentativo goffo di sistemare le coordinate se arrivano invertite
          const appo = [bboxMappa2[1], bboxMappa2[0], bboxMappa2[3], bboxMappa2[2]];
          bboxMappa2 = appo;
        }

        let bboxDaImpostare = '';

        if (modalita === 'bbox_m') {
          bboxDaImpostare = 'geoants_bbox_min_x:' + bboxMappa2[0] + ';geoants_bbox_min_y:' + bboxMappa2[1] + ';' +
            'geoants_bbox_max_x:' + bboxMappa2[2] + ';geoants_bbox_max_y:' + bboxMappa2[3];
        } else {
          bboxDaImpostare = 'v_bbox%3A\'BOX(' + bboxMappa2[0] + '%7C' + bboxMappa2[1] + '%7C' + bboxMappa2[2] + '%7C' + bboxMappa2[3]+ ')\'';
        }
        // const bbox2 = bboxMappa2[0] + '%2C' + bboxMappa2[1] + '%2C' + bboxMappa2[2] + '%2C' + bboxMappa2[3];
        // noCacheUrl = noCacheUrl.replace(bboxPassataOriginale, bbox2);
        if (noCacheUrl.indexOf('nocache=') === -1) {
          const timestamp = new Date().getTime();
          noCacheUrl = noCacheUrl + '&nocache=' + timestamp;
        }

        noCacheUrl = noCacheUrl.replace(bboxFine, bboxDaImpostare);
        // logConsole('BBOX convertita', bboxFine, bboxDaImpostare);
        // if (modalita === 'v_bbox') {
        //   logConsole('URL Layer', noCacheUrl.substring(10, noCacheUrl.length), bboxMappa2);
        // }
      }
    } else {
      logConsole('Non esiste la scritta &BBOX= nella cache url', noCacheUrl.toString());
    }

    return noCacheUrl;
  }
  
  static sistemaBBox(t, qualeBbox, daDove, qualeControllo) {
    if (qualeBbox) {
      let b1 = [qualeBbox[0], qualeBbox[1]];
      let b2 = [qualeBbox[2], qualeBbox[3]];
      if (qualeBbox[0] > 180) {
        b1 = transform(b1, 'EPSG:3857', 'EPSG:4326');
      }
      if (qualeBbox[2] > 180) {
        b2 = transform(b2, 'EPSG:3857', 'EPSG:4326');
      }
      qualeBbox = [b1[0], b1[1], b2[0], b2[1]];
      if (t.debug2 === true) {
        console.log ('Ritorna bbox giusta: Richiamata da ' + daDove + ' (' + qualeControllo + ')', t.NumeroFrame2, qualeBbox);
      }
    } else {
      qualeBbox = '';
      if (t.debug2 === true) {
        console.log ('Ritorna bbox giusta: Richiamata da ' + daDove + ' (' + qualeControllo + ')', t.NumeroFrame2, qualeBbox);
      }
    }

    return qualeBbox;
  }

  static checkRitornoChiamata(t, Utils, d) {
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
              // ExternalUtilities.messaggioDiErrore(t,  (d.failure_reason);
              this.scriveLog(d.failure_reason);
            }
          }
        }
      }
      if (d.v_err_code && d.v_err_code === 2) {
        if (d.v_failure_reason) {
          if (t === null) {
            alert(d.v_failure_reason);
          } else {
            t.mostraPopup('Error: ' + d.v_failure_reason, false, '');
          }
        } else {
          if (t === null) {
            alert('V_ERR_CODE = 2 without failure reason');
          } else {
            t.mostraPopup('V_ERR_CODE = 2 without failure reason', false, '');
          }
        }
      }
      if (d[0] && d[0].v_err_code && d[0].v_err_code === 2) {
        if (d[0].v_failure_reason) {
          if (t === null) {
            alert(d[0].v_failure_reason);
          } else {
            t.mostraPopup('Error: ' + d[0].v_failure_reason, false, '');
          }
        } else {
          if (t === null) {
            alert('V_ERR_CODE = 2 without failure reason');
          } else {
            t.mostraPopup('V_ERR_CODE = 2 without failure reason', false, '');
          }
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
      // this.scriveLog('Prefisso:', vv);
      if (val !== undefined && val !== '' && val !== 'empty' && val !== 'empty grid' && vv !== '***') {
        // this.scriveLog('Valore da parsare:', val);
        ee  = JSON.parse(val);
        if (typeof(ee) === 'string' && ee !== 'empty grid') {
          if (ee !== '') {
            // this.scriveLog('->' + ee + '<-');
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
      // this.scriveLog(s);
    }
    return a.toString();
  }

  static sistemaStringaLettaDaDB(j) {
    const jj = j.trim();
    const a = jj.split(',');
    let s = '';

    if (!this.isNumeric(a[0])) {
      return '{}';
    }

    a.forEach(element => {
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
    // this.scriveLog(ee);
    if (ee && ee.substring(0, 1) === '"' && ee.substr(ee.length - 1) === '"') {
      ee = ee.substring(1, ee.length);
      ee = ee.substring(0, ee.length - 1);
    }
    // this.scriveLog('Cambiato valore combo:', ee);
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

  static PrendeNomeMisuraDaCodice(codice, misure, daDove) {
    let display_name = '';
    let ok = false;

    if (misure !== undefined && misure !== null && codice !== null && codice !== undefined && typeof(misure) !== 'string') {
      // this.scriveLog(codice);
      misure.forEach(element2 => {
        // this.scriveLog(element2.CODE, codice);
        if (!ok) {
          if (display_name === '' && element2 && element2.CODE) {
            if (this.isNumeric(codice)) {
              if (element2 && element2.CODE && +element2.CODE === codice) {
                display_name = element2.DISPLAY_NAME;
                ok = true;
              }
            } else {
              if (element2 && element2.CODE && element2.CODE !== null && codice && codice !== null) {
                if (typeof(codice) === 'string') {
                  try {
                    if (element2 && element2.CODE && element2.CODE.toLowerCase().trim() === codice.toLowerCase().trim()) {
                      display_name = element2.DISPLAY_NAME;
                      ok = true;
                    }
                  } catch (e) {
                    console.error('Prende nome misura da codice 1: ', e, codice);
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
        }
      });

      if (!ok) {
        // logConsole('Prende Nome Misura da codice. Display name vuoto: ', codice, misure, daDove);
        display_name = codice + ' (NOT FOUND)';
      }
    }

    return display_name;
  }

  static prendeActivitySceltaPerEvents(t, Utils) {
    let act_id = '';
    let conta2 = 0;
    // this.scriveLog(t.NumeroFrame, t.Activity2);
    if (t.Activity2 === 0) { // LATEST SELECTION
      // this.scriveLog(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_id = t.stringaAGNoACT;
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
        // this.scriveLog(this.sceltaActivityDaSet);
        Utils.sceltaActivityDaSet.forEach(element => {
          if (element) {
            element.forEach(element2 => {
              // this.scriveLog(element2.ID);
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
        //  this.scriveLog(this.datiTipiActivity, t.Activity2, t.stringaAGNoACT, t.listaActivityName2, this.sceltaActivityDaSet);
        // conta2 = 1;
        // let act = '';
        // this.datiTipiActivity.forEach(element => {
        //   if (t.Activity2 === element.id) {
        //     act = t.stringaAGNoACT[conta2];
        //   }
        //   conta2++;
        // });
        if (t.stringaAGNoACT) {
          const act = t.stringaAGNoACT;
          // this.scriveLog(act);
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
    }
    act_id = this.toglieVirgoleInutili(act_id);
    // this.scriveLog('Activity Set', act_id);
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
    if (act_id) {
      act_id = act_id.toString().trim();
      // this.scriveLog(act_id.substring(0, 1));
      if (act_id.substring(0, 1) === ',') {
        act_id = act_id.substring(1, act_id.length);
      }
      // this.scriveLog(act_id.substring(act_id.length - 1, act_id.length));
      if (act_id.substring(act_id.length - 1, act_id.length) === ',') {
        act_id = act_id.substring(0, act_id.length - 1);
      }
      // this.scriveLog(act_id);
    }

    return act_id;
  }

  static prendeActivitySceltaPerPointCM(t, Utils) {
    let act_set = '';
    let conta2 = 0;
    // this.scriveLog(t.NumeroFrame, t.Activity2);
    if (t.Activity2 === 0) { // LATEST SELECTION
      // this.scriveLog(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_set = t.stringaAGNoACT;
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
        // this.scriveLog(this.sceltaActivityDaSet);
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
        // this.scriveLog(this.datiTipiActivity, t.Activity2, t.stringaAGNoACT, this.sceltaActivityDaSet);
        conta2 = 1;
        let ac = '';
        Utils.datiTipiActivity.forEach(element => {
          if (t.Activity2 === element.id) {
            ac = t.stringaAGNoACT;
          }
          conta2++;
        });
        if (ac !== '' && Utils.sceltaActivityDaSet) {
          // this.scriveLog(ac, this.sceltaActivityDaSet);
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
    // this.scriveLog('Activity Set', act_set);
    act_set = this.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static prendeActivitySceltaCellMeasures(t, Utils) {
    let act_set = '';
    let conta2 = 0;

    // this.scriveLog(t.NumeroFrame, t.Activity2);
    if (t.Activity2 === 0) { // LATEST SELECTION
      // this.scriveLog(t.NumeroFrame, this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
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
        // this.scriveLog(t.NumeroFrame, act_set, this.sceltaActivityDaSet);
        Utils.sceltaActivityDaSet.forEach(element => {
          if (element) {
            element.forEach(element2 => {
              // console.log ('Presa ', element);
              if (act_set.indexOf(element2.SET_ID + ',') === -1) {
                act_set += element2.SET_ID + ',';
              }
            });
          }
        });
        if (act_set !== '') {
          act_set = act_set.substring(0, act_set.length - 1);
        }
      } else {
        // this.scriveLog(t.NumeroFrame, t.listaActivityName2[t.Activity2]);
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
    // this.scriveLog('Activity Set', t.NumeroFrame, act_set);
    act_set = this.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static prendeActivityScelta(t, Utils) {
    let act_set = '';
    let conta2 = 0;

    if (t.Activity2 === 0) { // LATEST SELECTION
      // this.scriveLog(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_set = t.stringaAGNoACT;
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
      } else {
        // this.scriveLog(t.NumeroFrame, this.datiTipiActivity, t.Activity2, t.stringaAGNoACT, t.listaActivityName2);
        conta2 = 1;
        Utils.datiTipiActivity.forEach(element => {
          if (t.Activity2 === element.id) {
            act_set = t.stringaAGNoACT;
          }
          conta2++;
        });
      }
    }
    // this.scriveLog('Activity Set', act_set);
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
        // // logConsole('Act set ritornata 1:', t.Activity2, act_set, t.listaActivityName2);
        break;
      case 0:
        act_set = 'geo_act_set_name_1:' + Utils.act_setDelPuntoClickatoSullaMappa;
        // // logConsole('Act set ritornata 2:', act_set);
        break;
      default:
        act_set = 'geo_act_set_name_1:' + t.act_set;
        // // logConsole('Act set ritornata 3:', act_set);
        break;
    }

    return act_set;
  }

  static ritornaStringPerActivitySetAPoint(t, act_set_p) {
    if (t.activity2) {
      // this.scriveLog(t.activity2)
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
      // this.scriveLog('Act set ritornata:', act_set);

      return act_set;
    } else {
      return act_set_p;
    }
  }

  static ritornaStringPerActivitySetAGrafici(t, Utils) {
    const modalitaActivitySet = t.Activity2;
    let act_set = '';

    // this.scriveLog(modalitaActivitySet);
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
    // this.scriveLog('Act set ritornata:', act_set);

    return act_set;
  }

  static ritornaStringPerActivitySetEventSummary(t, Utils) {
    const modalitaActivitySet = t.Activity2;
    let act_set = '';

    // this.scriveLog(t.Activity2, t.listaActivityName2);
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
        // this.scriveLog('-1', act_set);
        break;
      case 0:
        act_set = Utils.act_setDelPuntoClickatoSullaMappa;

        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME === act_set) {
            act_set = element.ID;
          }
        });
        // this.scriveLog('0', act_set);
        break;
      default:
        // act_set = t.act_set;

        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME === t.act_set) {
            act_set = element.ID;
          }
        });
        // this.scriveLog('>0', act_set);
        break;
    }
    // this.scriveLog('Act set ritornata:', act_set);

    act_set = this.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static creaRangeSelezionato(q, tms, Utils) {
    if (Utils.range === undefined) {
      if (Utils.rangeDiSecondiPerMille !== undefined) {
        Utils.range = Utils.rangeDiSecondiPerMille;
        // this.scriveLog('RANGE definito', this.range);
      } else {
        Utils.range = 1000;
        this.scriveLog('RANGE non definito. Imposto 1000 come default');
      }
    } else {
      // this.scriveLog('RANGE già definito', this.range);
    }
    this.scriveLog('Tms:', tms, new Date(tms), Utils.range);
    if (tms) {
      const dInizio = ((new Date(tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) - (Utils.range / 2));
      const sInizio = Utils.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
      const dFine = ((new Date(tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) + (Utils.range / 2));
      const sFine = Utils.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

      this.scriveLog('Range impostato', sInizio, sFine);

      Utils.tmsInizio = sInizio;
      Utils.tmsFine = sFine;

      Utils.rangeSelezionatoStampa = sInizio + '<br />' + sFine;
      // this.scriveLog('Range:', q, sInizio + ';' + sFine);
    }
  }

  static aggiornaTmsStringa(t, Utils) {
    if (t && t !== null) {
      // this.scriveLog('Aggiorna TMS', t);
      if (typeof(t) === 'string') {
        Utils.tmsSelezionatoStringa = t.replace('Z', ' ').replace('T', ' ');
      } else {
        Utils.tmsSelezionatoStringa = (Utils.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC')).replace('Z', ' ').replace('T', ' ');
      }
      if (this.isNumeric(t)) {
        Utils.tmsSelezionatoStringa = (Utils.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC')).replace('Z', ' ').replace('T', ' ');
      }
      if (Utils.tmsSelezionatoStringa.indexOf('.') > -1) {
        Utils.tmsSelezionatoStringa = Utils.tmsSelezionatoStringa.substring(0, Utils.tmsSelezionatoStringa.indexOf('.'));
      }
      const tm = setTimeout(() => {
          clearTimeout(tm);
        Utils.tmsSelezionato = Utils.tmsSelezionatoStringa;
      }, 100);
    }
  }

  /* ricalcolaRange(t, tms) {
    const dInizio = ((new Date(tms).getTime()) - (this.range));
    const sInizio = this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    const dFine = ((new Date(tms).getTime()) + (this.range));
    const sFine = this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    this.rangeSelezionato[t.frameAttivo][t.NumeroFrame] = sInizio + ';' + sFine + ';';
    // this.scriveLog('Range modificato:', this.rangeSelezionato);
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
        // this.scriveLog(csv.length);
        let errori = 0;
        let err = '';
        csv.forEach(element => {
          // this.scriveLog(element[0]);
          if (element[0].indexOf('<ServiceException') > -1) {
            errori++;
            // if (element[0].indexOf('Detail:') > -1) {
            //   this.scriveLog('ERRORE: ' + element);
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
          this.scriveLog(err);
        }

        return errori;
      }
    }
  }

  static tornaSla(t) {
    let sla = '';

    // this.scriveLog('Sla attuale:', t.NumeroFrame, t.slaValue2, t.datiSlaDT, t.slaValueGlobale2);
    // logConsole('Controllo SLA', t.slaValue2);

    // if (t.slaValue2 || t.slaValue2 === 0) {
      // if (typeof(t.slaValue2) === 'object') {
        // this.scriveLog('Converto sla globale', t.NumeroFrame, t.slaValue2);
        // if (t.slaValue2.NAME === environment.stringaGlobalSettingSLA || t.slaValue2.NAME === '<Global Template>') {
          // this.scriveLog(t.datiSlaDT);
          if (t.datiSlaDT && t.datiSlaDT !== null && t.datiSlaDT !== 'empty grid') {
            t.datiSlaDT.forEach(element => {
              if (+element.ID === +t.slaValueGlobale2) {
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
            // this.scriveLog('Ritorno SLA normale convertito da globale ',t.NumeroFrame, sla);
        //   } else {
        //     sla = t.slaValue2.NAME;
            // this.scriveLog('Ritorno SLA normale ', t.NumeroFrame, sla);
        //   }
        // }
      // } else {
      //   sla = this.tornaSla2(t);
        // this.scriveLog('Ritorno SLA2 ', t.NumeroFrame, sla);
      // }
    // }

    return sla;
  }

  static tornaIDSla(t) {
    let sla = '';

    // this.scriveLog('Sla attuale:', t.NumeroFrame, t.slaValue2);
    if (t.slaValue2 || t.slaValue2 === 0) {
      // if (typeof(t.slaValue2) === 'object') {
        // this.scriveLog('Converto sla globale', t.NumeroFrame, t.slaValue2);
        // if (t.slaValue2.NAME === environment.stringaGlobalSettingSLA || t.slaValue2.NAME === '<Global Template>') {
          // this.scriveLog(t.datiSlaDT);
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
            // this.scriveLog('Ritorno SLA normale convertito da globale ',t.NumeroFrame, sla);
        //   } else {
        //     sla = t.slaValue2.ID;
            // this.scriveLog('Ritorno SLA normale ', t.NumeroFrame, sla);
        //   }
        // }
      // } else {
      //   sla = this.tornaSla2ID(t);
        // this.scriveLog('Ritorno SLA2 ', t.NumeroFrame, sla);
      // }
    }

    return sla;
  }

  static tornaSla2(t) {
    let sla = '';
    // this.scriveLog('Sla impostato in locale:', t.NumeroFrame, t.slaValue2, t.slaName2);
    // if (t.slaValue2 === -1) {
    //   if (t.datiSla) {
    //     t.datiSla.forEach(element => {
    //       if (element.ID === t.slaValueGlobale2) {
    //         sla = element.NAME;
    //       }
    //     });
    //   }
      // this.scriveLog('Sla impostato come globale per il frame ' + t.NumeroFrame, sla);
    // } else {
    if (t.datiSlaDT) {
      t.datiSlaDT.forEach(element => {
        if (element.ID === t.slaValue2) {
          sla = element.NAME;
        }
      });
    }
      // this.scriveLog('Sla impostato come locale per il frame ' + t.NumeroFrame, sla);
    // }

    return sla;
  }

  static tornaSla2ID(t) {
    let sla = '';
    // this.scriveLog('Sla impostato in locale:', t.NumeroFrame, t.slaValue2, t.slaName2);
    // if (t.slaValue2 === -1) {
    //   if (t.datiSla) {
    //     t.datiSla.forEach(element => {
    //       if (element.ID === t.slaValueGlobale2) {
    //         sla = element.ID;
    //       }
    //     });
    //   }
      // this.scriveLog('Sla impostato come globale per il frame ' + t.NumeroFrame, sla);
    // } else {
    if (t.datiSlaDT) {
      t.datiSlaDT.forEach(element => {
        if (element.ID === t.slaValue2) {
          sla = element.ID;
        }
      });
    }
      // this.scriveLog('Sla impostato come locale per il frame ' + t.NumeroFrame, sla);
    // }

    return sla;
  }

  static tornaGlobale(t) {
    // this.scriveLog('Valore mapType', t.NumeroFrame, t.mapType);
    if (t.mapType2 === -1) {
      return true;
    } else {
      return false;
    }
  }

  static creaMatriceView(x, y, centroImpostato) {
    const m = new Array();
    for (let i = 0; i <= x; i++) {
      m.push(new Array());
      for (let j = 0; j <= y; j++) {
        if (!centroImpostato) {
          // const coord = [ 12.4963655, 41.9027835 ];
          const coord = [ 0, 0 ];
          centroImpostato = transform(coord, 'EPSG:4326', 'EPSG:3857');
        }
        const view = new OlView({
          center: fromLonLat(centroImpostato),
          zoom: 10
        });

        m[i].push(view);
      }
    }
    // this.scriveLog(m);
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
    // this.scriveLog(m);
    return m;
  }

  // Distrugge i grafici CanvasJS di un elenco prima che l'elenco venga sostituito.
  // Ogni grafico registra un listener 'resize' sulla finestra che solo destroy() rimuove:
  // senza destroy() il grafico (canvas e dati) non viene mai liberato.
  static distruggiGrafici(lista) {
    if (!lista || !Array.isArray(lista)) {
      return;
    }
    lista.forEach(grafico => {
      if (grafico && typeof grafico.destroy === 'function') {
        try {
          grafico.destroy();
        } catch (e) {
          // grafico già distrutto o contenitore non più presente
        }
      }
    });
  }

  static creaVettore(x, valore) {
    const m = new Array();
    for (let j = 0; j <= x; j++) {
      // // logConsole(valore);
      if (valore && valore !== true && valore !== false && !this.isNumeric(valore) && valore !== null && !this.isArray(valore)) {
        const v = valore.replace('***CONT***', j);
        m.push(v);
      } else {
        m.push(valore);
      }
    }
    // this.scriveLog(m);
    return m;
  }

  static isArray(obj: any ) {
    return Array.isArray(obj);
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
    // this.scriveLog(m);
    return m;
  }

  static salvaCSV(righeJson, nomeFile, t) {
    let s = '';
    let i = '';
    let riga = 0;
    // this.scriveLog(righeJson);
    righeJson.forEach(element => {
      let r = JSON.stringify(element); //  JSON.stringify(element.properties);
      if (r && r !== '') {
        r = r.replace('{', '');
        r = r.replace('}', '');
        const r2 = r.split(';');
        // this.scriveLog(r2);
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
              if (rr3) {
              while (rr3.indexOf('"') > -1) {
                rr3 = rr3.replace('"', '');
              }
              s += rr3 + ';';
            } else {
              s += ';';
            }
          });
        });
        if (riga === 0) {
          s = i + '\n' + s;
        }
        s += '\n';
        riga++;
      }
    });
    // this.scriveLog(s);
    // const FileSaver = require('file-saver');
    const blob = new Blob([s], {type: 'text/plain;charset=utf-8'});
    t.fileSaver.save(blob, nomeFile);
    // FileSaver.saveAs(blob, nomeFile);
  }

  static sistemaNomeFrame(t, cosa) {
    let nf = cosa;
    const caratteriDaEliminare = ' <>+:=?*|/\\&%"#.,';
    for (let i = 0; i < caratteriDaEliminare.length; i++) {
      const carattere = caratteriDaEliminare.substring(i, i + 1);
      // this.scriveLog(carattere);
      while (nf.indexOf(carattere) > -1) {
        nf = nf.replace(carattere, '_');
      }
    }
    return nf;
  }

  /* static prendeBBOX(map1) {
    if (map1) {
      let rit = '';
      const bbox = map1.getView().calculateExtent(map1.getSize());
      const bboxFin = transformExtent(bbox, 'EPSG:3857', 'EPSG:4326');
      // this.scriveLog('BBox:', bboxFin);

      const perc1 = Math.abs(bboxFin[2] - bboxFin[0]) / 2;
      const perc2 = Math.abs(bboxFin[3] - bboxFin[1]) / 2;
      bboxFin[0] -= perc1;
      bboxFin[1] -= perc1;
      bboxFin[2] += perc2;
      bboxFin[3] += perc2;

      bboxFin[0] = Math.floor(bboxFin[0] * this.valoreRiduzione) / this.valoreRiduzione;
      bboxFin[1] = Math.floor(bboxFin[1] * this.valoreRiduzione) / this.valoreRiduzione;
      bboxFin[2] = Math.ceil(bboxFin[2] * this.valoreRiduzione) / this.valoreRiduzione;
      bboxFin[3] = Math.ceil(bboxFin[3] * this.valoreRiduzione) / this.valoreRiduzione;

      this.scriveLog('VALORI BBOX STRINGA', bboxFin);

      rit = 'geoants_bbox_min_x:' + bboxFin[0] + ';geoants_bbox_min_y:' + bboxFin[1] + ';';
      rit += 'geoants_bbox_max_x:' + bboxFin[2] + ';geoants_bbox_max_y:' + bboxFin[3];

      return rit;
    } else {
      return '';
    }
  }

  static prendeBBOXSoloValori(map1) {
    if (map1) {
      const bbox = map1.getView().calculateExtent(map1.getSize());
      const bboxFin = transformExtent(bbox, 'EPSG:3857', 'EPSG:4326');
      // this.scriveLog('BBox:', bboxFin);

      const perc1 = Math.abs(bboxFin[2] - bboxFin[0]) / 2;
      const perc2 = Math.abs(bboxFin[3] - bboxFin[1]) / 2;
      bboxFin[0] -= perc1;
      bboxFin[1] -= perc1;
      bboxFin[2] += perc2;
      bboxFin[3] += perc2;

      bboxFin[0] = Math.floor(bboxFin[0] * this.valoreRiduzione) / this.valoreRiduzione;
      bboxFin[1] = Math.floor(bboxFin[1] * this.valoreRiduzione) / this.valoreRiduzione;
      bboxFin[2] = Math.ceil(bboxFin[2] * this.valoreRiduzione) / this.valoreRiduzione;
      bboxFin[3] = Math.ceil(bboxFin[3] * this.valoreRiduzione) / this.valoreRiduzione;

      this.scriveLog('VALORI BBOX VALORI', bboxFin);

      const rit = [ bboxFin[0] , bboxFin[1] , bboxFin[2] , bboxFin[3] ];

      return rit;
    } else {
      return '';
    }
  }

  static prendeBBOXExport(map1) {
    if (map1) {
      const bboxFin2 = new Array();
      bboxFin2[0] = -180;
      bboxFin2[1] = -90;
      bboxFin2[2] = 180;
      bboxFin2[3] = 90;

      const rit2 = 'CRS=EPSG%3A4326&WIDTH=1024&HEIGHT=768&BBOX=' + bboxFin2[0] + ',' + bboxFin2[1] + ',' + bboxFin2[2] + ',' + bboxFin2[3];

      return rit2;

      let rit = '';
      const bbox = map1.getView().calculateExtent(map1.getSize());
      const bboxFin = transformExtent(bbox, 'EPSG:3857', 'EPSG:4326');
      // this.scriveLog('BBox:', bboxFin);

      const perc1 = Math.abs(bboxFin[2] - bboxFin[0]) / 2;
      const perc2 = Math.abs(bboxFin[3] - bboxFin[1]) / 2;
      bboxFin[0] -= perc1;
      bboxFin[1] -= perc1;
      bboxFin[2] += perc2;
      bboxFin[3] += perc2;

      bboxFin[0] = Math.floor(bboxFin[0] * this.valoreRiduzione) / this.valoreRiduzione;
      bboxFin[1] = Math.floor(bboxFin[1] * this.valoreRiduzione) / this.valoreRiduzione;
      bboxFin[2] = Math.ceil(bboxFin[2] * this.valoreRiduzione) / this.valoreRiduzione;
      bboxFin[3] = Math.ceil(bboxFin[3] * this.valoreRiduzione) / this.valoreRiduzione;

      rit = 'CRS=EPSG%3A4326&WIDTH=1024&HEIGHT=768&BBOX=' + bboxFin[0] + ',' + bboxFin[1] + ',' + bboxFin[2] + ',' + bboxFin[3];

      return rit;
    } else {
      return '';
    }
  } */

  static effettuaReplace(str, find, replace) {
    if (str && str !== null) {
      const escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
      const esc = new RegExp(escapedFind, 'g');
      // // logConsole('REPLACE', esc, typeof(esc));
      if (esc && esc !== null && typeof(esc) === 'string') {
        return str.replace(esc, replace);
      } else {
        return str;
      }
    } else {
      return str;
    }
  }

  static ritornaGeoFilter(t, e) {
    const debugInterno = false;

    if (debugInterno) {
      this.scriveLog('Valore GEO FILTER:', t.NumeroFrame2, e, t.comboSelArea2);
    }

    let cosa = '';

    switch (+e) {
      case 0:
        cosa = '(ALL)';
        break;
      case 1:
        if (t.bboxOverview) {
          cosa = 'BOX(' + t.bboxOverview + ')';
        } else {
          cosa = '(NONE)';
        }
        break;
      /* case 2:
        if (t.comboSelArea === 1) {
          if (ExternalUtilities.bboxZoom) {
            cosa = 'BOX(' + ExternalUtilities.bboxZoom + ')';
          } else {
            cosa = '(NONE)';
          }
        } else {
          if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG[0] && ExternalUtilities.rigaSelezionataMG[0].SQUARE_SNAP) {
            cosa = ExternalUtilities.rigaSelezionataMG[0].SQUARE_SNAP;
          } else {
            cosa = '(NONE)';
          }
        }
        break; */
      case 3:
        if (t.comboSelArea2 === 1) {
          if (t.bboxZoom) {
            if (debugInterno) {
              logConsole('Ritorna geo filter 1', t.NumeroFrame2, t.bboxZoom);
            }
            cosa = 'BOX(' + t.bboxZoom + ')';
          } else {
            if (debugInterno) {
              logConsole('Ritorna geo filter 2', t.NumeroFrame2);
            }
            cosa = '(NONE)';
          }
        } else {
          /* if (t.comboSelArea2 === 3) {
            // Layer disegnato su mappa
            if (t.boxDisegnatoSuMappa) {
              if (debugInterno) {
                logConsole('Ritorna geo filter 3', t.NumeroFrame2, t.boxDisegnatoSuMappa);
              }
              cosa = t.boxDisegnatoSuMappa;
            } else {
              if (debugInterno) {
                logConsole('Ritorna geo filter 4', t.NumeroFrame2, t.boxDisegnatoSuMappa);
              }
              cosa = '(NONE)';
            }
          } else { */
            // Mosaic/Cluster
            if (typeof(this.bboxSelected) === 'string') {
              this.bboxSelected = JSON.parse(this.bboxSelected);
            }
            if (this.bboxSelected && this.bboxSelected[0] && this.bboxSelected[0].SQUARE_SNAP) {
              if (debugInterno) {
                logConsole('Ritorna geo filter 5', t.NumeroFrame2, this.bboxSelected);
              }
              cosa = this.bboxSelected[0].SQUARE_SNAP;
            } else {
              if (debugInterno) {
                logConsole('Ritorna geo filter 6', t.NumeroFrame2);
              }
              cosa = '(NONE)';
            }
          // }
        }
        break;
      default:
        if (debugInterno) {
          logConsole('Ritorna geo filter 7', t.NumeroFrame2);
        }
        cosa = '(NONE)';
    }

    // logConsole('Valore GEO FILTER:', t.NumeroFrame2, cosa);

    return cosa;
  }

  static messaggioDiErrore(griglia, mess) {
    // t.messaggioDiErrore.emit(mess);
    this.scriveLog(griglia, typeof(griglia), mess);
    try {
      if (!griglia || griglia === null || typeof(griglia) !== 'string' || (typeof(griglia) === 'string' && griglia !== 'null')) {
        griglia = 'ERROR: ' + JSON.stringify(JSON.parse(mess._body).message);
      } else {
        console.error('ERROR:', mess);
      }
    } catch (e) {

    }
  }

  static scriveLog(Cosa, P1?, P2?, P3?, P4?, P5?) {
    if (ExternalUtilities.modalitaDebug === true) {
      if (P1 && P2 && P3 && P4 && P5) {
        // logConsole(Cosa, P1, P2, P3, P4, P5);
      } else {
        if (P1 && P2 && P3 && P4 && !P5) {
          // logConsole(Cosa, P1, P2, P3, P4);
        } else {
          if (P1 && P2 && P3 && !P4 && !P5) {
            // logConsole(Cosa, P1, P2, P3);
          } else {
            if (P1 && P2 && !P3 && !P4 && !P5) {
              // logConsole(Cosa, P1, P2,);
            } else {
              if (P1 && !P2 && !P3 && !P4 && !P5) {
                // logConsole(Cosa, P1);
              } else {
                // logConsole(Cosa);
              }  
            }
          }
        }
      }
    }
  }

  static datiEventiDaMettere2;
  static vecchiaChiamataEventi = '';

  static LeggeEventi(t) {
    if (t.Debug2 === true) {
      // logConsole('Chiamata EVENT_DFN. Frame: ', t.NumeroFrame);
    }
    // const ora = new Date().getTime();
    if (this.vecchiaChiamataEventi !== '') {
      let q = 0;
      const t1 = setInterval(() => {
        if (this.datiEventiDaMettere2 && this.datiEventiDaMettere2.DataTable) { // } || params === this.vecchiaChiamataEventi) {
          clearInterval(t1);
          if (t.Debug2 === true) {
            // logConsole('Chiamata EVENT_DFN. Dati già esistenti. Riprendo quelli caricati con timer', t.NumeroFrame, this.datiEventiDaMettere2);
          }
    
          // t.Utils.strutturaGrigliaDiBase = this.datiEventiDaMettere2;
          t.datiEventiDaMettere2 = this.datiEventiDaMettere2;
  
          t.gestisceSelezioneGriglia();
        } else {
          q++;
          if (q > 10) {
            clearInterval(t1);
            // logConsole('Chiamata EVENT_DFN. Impossibile accedere ai dati già caricati', t.NumeroFrame);
          }
        }
      }, 1000);
      return;
    }
    this.vecchiaChiamataEventi = t.NumeroFrame2;

    let eventi = '';
    if (t.datiModificati.datiEventiDaPassareM.DataTable &&
      t.datiModificati.datiEventiDaPassareM.DataTable !== null &&
      t.datiModificati.datiEventiDaPassareM.DataTable !== 'empty grid') {
      // this.scriveLog(this.datiModificati.datiEventiDaPassareM.DataTable);
      t.datiModificati.datiEventiDaPassareM.DataTable.forEach(element => {
        eventi += element.EVENT_TYPE + ',';
      });
      if (eventi !== '') {
        eventi = eventi.substring(0, eventi.length - 1);
      }
    }

    const params = '{' +
      '"cntx_id": "' + t.sessionID2 + '",' +
      '"v_filter_folder": "",' +
      '"v_event_type_list_not": "' + eventi + '"' +
    '}';

    /* if (this.datiEventiDaMettere2 && this.datiEventiDaMettere2.DataTable) { // } || params === this.vecchiaChiamataEventi) {
      // if (t.Debug2 === true) {
        // logConsole('Chiamata EVENT_DFN. Dati già esistenti. Riprendo quelli caricati', this.datiEventiDaMettere2);
      // }

      // t.Utils.strutturaGrigliaDiBase = this.datiEventiDaMettere2;
      t.datiEventiDaMettere2 = this.datiEventiDaMettere2;
    } else { */
      if (t.Debug2 === true) {
        // logConsole('Chiamata EVENT_DFN. Dati NON esistenti. Carico i dati');
      }

      this.vecchiaChiamataEventi = params;

      const destroy$ = new Subject<void>();

      t.apiService.chiamataPost(t.Utils, 'geo_event_dfn__grid', params)
      // .map(response => response)
       .pipe(takeUntil(destroy$))
       .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(this, t.Utils, data2);
  
        // this.scriveLog('Lista eventi da mettere:', data2);
        if (data2 && data2 !== null) {
          const data = data2; // [0].geo_event_dfn__grid);
          if (t.Debug2 === true) {
            // logConsole('EVENT_DFN data:', data.DataTable);
          }
            /* data.DataTable.forEach(element => {
              if (element.EVENT_TYPE === 'CADF') {
                this.scriveLog('CADF trovato:', element);
              }
            }); */
          // }
          this.datiEventiDaMettere2 = data;
          t.datiEventiDaMettere2 = data;
  
          // this.scriveLog(this.NumeroFrame, 'Struttura di base', JSON.stringify(data));
          t.Utils.strutturaGrigliaDiBase = data;
  
          // this.EventiDaMettereVisibile = true;
        } else {
          if (t.Debug2 === true) {
            // logConsole('EVENT_DFN data: Pulisco griglia');
          }
          this.datiEventiDaMettere2 = 'empty grid';
          t.datiEventiDaMettere2 = 'empty grid';
        }
  
        t.gestisceSelezioneGriglia();
      }, error => {
        ExternalUtilities.messaggioDiErrore(this, error);
      });
  
      /* const params = '{' +
        '"cntx_id": "' + this.sessionService.getToken() + '",' +
        '"v_filter_folder": ""' +
      '}';
      this.apiService.chiamataPost('geo_event_dfn__grid', params)
      // .map(response => response())
      .subscribe((data2: any) => {
        this.scriveLog('Lista eventi da mettere:', data2);
        if (data2 && data2 !== null) {
          // // const data = JSON.parse(data2); // [0].geo_act_set__grid);
          // this.scriveLog('Measures data:', data.DataTable);
          this.datiEventiDaMettere = data;
          // this.scriveLog('Struttura di base', data);
          this.Utils.strutturaGrigliaDiBase = data;
       } else {
          this.datiEventiDaMettere = 'empty grid';
        }
  
        this.gestisceSelezioneGriglia();
      }, error => {
        ExternalUtilities.messaggioDiErrore(t, error);
      }); */
    // }
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

  static visualizzaInfo(titolo, messaggio, chiude) {
    Swal.fire({
      title: titolo,
      text: messaggio,
      icon: 'info',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    });
    if (chiude) {
      const tm = setTimeout(() => {
          clearTimeout(tm);
        Swal.close();
      }, 1500);
    }
  }

  static ritornaMisura(t, misura, misuraGlobale, misuraGlobaleArfcn, misureGlobali, daDove) {
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorna Misura Frame ' + t.NumeroFrame2 + '. Chiamata: ', misura, misuraGlobale, misureGlobali, daDove);
    if (!misura || misura === null || misura === 'null' || misura === 'undefined' || misura === '---') {
      return '';
    }
    if (typeof(misura) !== 'string') {
      // logConsole('Misura passata non valida', typeof(misura), misura, daDove);
      return '';
    }

    if (misura.indexOf('<GLOBAL MEASURE>') > -1 || 
      (misura.indexOf('global_measure') > -1 && misura.indexOf('global_measure_') === -1 && misura.indexOf('<GLOBAL CHECKED MEASURE_') === -1)) {

      if (misuraGlobale) {
        // const ritorno = misura.replace('<GLOBAL MEASURE>', misuraGlobale.DISPLAY_NAME).replace('global_measure', misuraGlobale.DISPLAY_NAME);
        const ritorno = misura.replace('<GLOBAL MEASURE>', misuraGlobale.MEASR_CODE).replace('global_measure', misuraGlobale.MEASR_CODE);

        // logConsole('Ritorna misura 1', ritorno, misura, misuraGlobale);

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorna Misura 1 Frame ' + t.NumeroFrame2 + '', ritorno);

        return ritorno
      } else {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorna Misura 2 Frame ' + t.NumeroFrame2 + '. Misura globale: ', misuraGlobale);

        // logConsole('Ritorna misura 2', misura);

        return '';
      }
    } else {
      if (misura.indexOf('<GLOBAL CHECKED MEASURE_') > -1 || misura.indexOf('global_measure_') > -1) {
        let indice;
        
        if (misura.indexOf('<GLOBAL CHECKED MEASURE_') > -1) {
          const m = misura.replace('<GLOBAL CHECKED MEASURE_', '').substring(0, 1);
          indice = +m;
        } else {
          indice = +(misura.replace('global_measure_', '').substring(0, 1));
        }
        // logConsole('qui 1', indice, misureGlobali, daDove);

        if (indice && indice > 0) {
          if (misureGlobali && misureGlobali[indice - 1]) {
            let cosa = '';

            if (misureGlobali[indice - 1]['MEASR_CODE']) {
              cosa = misureGlobali[indice - 1]['MEASR_CODE'];
            } else {
              cosa = misureGlobali[indice - 1];
            }
            // logConsole('qui 2', this.misureGlobali[indice - 1], indice, cosa, daDove);

            let ok = false;
            let cosa2 = '';
            t.measureData2.forEach(element3 => {
              if (!ok && element3.CODE === cosa) {
                cosa2 = element3.CODE;
                // logConsole('qui 3', cosa, daDove);
                ok = true;
              }
            });

            if (cosa2) {
              const ritorno = misura.replace('global_measure_' + indice, cosa).replace('<GLOBAL CHECKED MEASURE_' + indice + '>', cosa2);
              // logConsole('qui 4', ritorno, daDove);

              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorna Misura 3 Frame ' + t.NumeroFrame2 + '', ritorno);

              return ritorno;
            } else {
              return '';
            }
          } else {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorna Misura 4 Frame ' + t.NumeroFrame2 + '. Misure globali: ', misureGlobali, indice);
            // logConsole('qui 5');

            return '';
          }
        } else {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorna Misura 5 Frame ' + t.NumeroFrame2 + '. Misure globali: ', misureGlobali, indice);
          // logConsole('qui 6');

          return '';
        }
      } else {
        if (misura.indexOf('<GLOBAL ARFCN>') > -1 || misura.indexOf('global_arfcn') > -1) {
          if (misuraGlobaleArfcn) {
            const ritorno = misura.replace('<GLOBAL ARFCN>', misuraGlobaleArfcn.MEASR_CODE).replace('global_arfcn', misuraGlobaleArfcn.MEASR_CODE);
    
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorna Misura 6 Frame ' + t.NumeroFrame2 + '', ritorno);
    
            return ritorno
          } else {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorna Misura 7 Frame ' + t.NumeroFrame2 + '. Misura globale ARFCN non valida', misuraGlobaleArfcn);
    
            return '';
          }
        } else {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorna Misura 8 Frame ' + t.NumeroFrame2 + '. Ritorno misura normale', misura);

          return misura;
        }
      }
    }
  }

  static scriveDimensioniColonne(tabella, dimensioniColonne) {
    logConsole('Scrittura dimensioni colonna', tabella, dimensioniColonne);
  }

  static prendeFiltri(t, metteApici, daDove) {
    const stringaConfronto = '<GLOBAL PARTITION LABEL>';
    // logConsole('Prende filtri: ', t.NumeroFrame2);

    let cm1 = t.clusterMeasure12;
    let cm2 = t.clusterMeasure22;

    let tf1 = t.textFilter12;
    if (cm1 === 'struct_partition_label') {
      const inizio = tf1.toUpperCase().trim().indexOf(stringaConfronto);
      if (inizio > -1) {
        const rimpiazzo = tf1.substring(inizio, inizio + stringaConfronto.length);
        if (t.partitionLabel2) {
          tf1 = tf1.replace(rimpiazzo, t.partitionLabel2);
        } else {
          tf1 = tf1.replace(rimpiazzo, 'null');
        }
      }
    }

    let tf2 = t.textFilter22;
    if (cm2 === 'struct_partition_label') {
      const inizio = tf2.toUpperCase().trim().indexOf(stringaConfronto);
      if (inizio > -1) {
        const rimpiazzo = tf2.substring(inizio, inizio + stringaConfronto.length);
        if (t.partitionLabel2) {
          tf2 = tf2.replace(rimpiazzo, t.partitionLabel2);
        } else {
          tf2 = tf2.replace(rimpiazzo, 'null');
        }
      }
    }

    if ((typeof(cm1) === 'object' && cm1 && cm1 !== null && cm1.length === 0)) {
      cm1 = '';
    } else {
      if (typeof(cm1) === 'object') {
        cm1 = JSON.stringify(cm1);
      }
    }

    if (!cm1 || cm1 === null || cm1 === '') { 
      cm1 = 'null'; 
    } else { 
      while (cm1.indexOf('\'') > -1) {
        cm1 = cm1.replace('\'', '');
      }
      if (metteApici) {
        cm1 = '\'' + cm1 + '\''; 
      }
    }

    if ((typeof(cm2) === 'object' && cm2 && cm2 !== null && cm2.length === 0)) {
      cm2 = '';
    } else {
      if (typeof(cm2) === 'object') {
        cm2 = JSON.stringify(cm2);
      }
    }

    if (!cm2 || cm2 === null || cm2 === '' || (typeof(cm2) === 'object' && cm2 && cm2 !== null && cm2.length === 0)) { 
      cm2 = 'null'; 
    } else { 
      while (cm2.indexOf('\'') > -1) {
        cm2 = cm2.replace('\'', '');
      }
      if (metteApici) {
        cm2 = '\'' + cm2 + '\''; 
      }
    }

    if ((typeof(tf1) === 'object' && tf1 && tf1 !== null && tf1.length === 0)) {
      tf1 = '';
    } else {
      if (typeof(tf1) === 'object') {
        tf1 = JSON.stringify(tf1);
      }
    }

    if (!tf1 || tf1 === null || tf1 === '' || (typeof(tf1) === 'object' && tf1 && tf1 !== null && tf1.length === 0)) { 
      tf1 = 'null'; 
    } else {
      while (tf1.indexOf('\'') > -1) {
        tf1 = tf1.replace('\'', '');
      }
      if (metteApici) {
        tf1 = '\'' + tf1 + '\''; 
      }
    }

    if ((typeof(tf2) === 'object' && tf2 && tf2 !== null && tf2.length === 0)) {
      tf2 = '';
    } else {
      if (typeof(tf2) === 'object') {
        tf2 = JSON.stringify(tf2);
      }
    }

    if (!tf2 || tf2 === null || tf2 === '' || (typeof(tf2) === 'object' && tf2 && tf2 !== null && tf2.length === 0)) { 
      tf2 = 'null'; 
    } else { 
      while (tf2.indexOf('\'') > -1) {
        tf2 = tf2.replace('\'', '');
      }
      if (metteApici) {
        tf2 = '\'' + tf2 + '\''; 
      }
    }

    // if (pipeInveceDellaVirgola) {
      while (tf1.indexOf(',') > -1) {
        tf1 = tf1.replace(',', '|');
      }

      while (tf2.indexOf(',') > -1) {
        tf2 = tf2.replace(',', '|');
      }
    // }

    const ritorno = {
      cm1: cm1,
      cm2: cm2,
      tf1: tf1,
      tf2: tf2
    }

    // logConsole('Prende filtri 2: ', t.NumeroFrame2, ritorno, 'Da: ' + daDove);

    return ritorno;
  }

  static criptaPerSpreadSheet(s) {
    return btoa(encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, 
        (_, p1) => String.fromCharCode(parseInt(p1, 16))
    ));
  }

  static isNumeric(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
  }
}

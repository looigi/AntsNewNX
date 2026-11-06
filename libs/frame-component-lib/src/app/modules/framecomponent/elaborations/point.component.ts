import { logConsole } from '../console-log';
import { ExternalApiService } from './../services/externalapi.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import ExternalUtilities from '../ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';
// import Utils from '../Utilities.component';

@Injectable()
export class PointComponent {
  destroy$ = new FineRichieste();

  // lastCallPI = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // vecchioJsonData;

  staElaborandoPM = false;
  // lastCall1 = ['', '', '', '', '', '', '', '', '', '',  ''];
  // lastCall2 = ['', '', '', '', '', '', '', '', '', '',  ''];
  // js1old = ['', '', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '', '', '', ''];
  // js2old = ['', '', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '', '', '', ''];
  // ultimaVoltaTMS = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  constructor(
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.lastCallPI[t.NumeroFrame2] = '';
    t.datiPointMeasures = 'empty grid';
    // this.vecchioJsonData = undefined;

    const nome = 'gridPointMeasures_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  prendePointMeasures(t, tms, daTcRun, daDove) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'PM') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Point Measures', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prende Point measures', t.NumeroFrame, tms);
    if (daTcRun === false) {
      /* if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'PM' || t.frameVisible2 === false) {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: Esco per frame diverso oppure non visibile');
        }
        return;
      } */

      if (t.MappaOGrafico2 !== 'PM') {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: Esco per frame di tipo diverso', t.MappaOGrafico2);
        }
        return;
      }
    }

    /* if (this.staElaborandoPM === true) {
      let q = 0;
      const t1 = setInterval(() => {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: Attendo per elaborazione in corso', q);
        }
        if (this.staElaborandoPM === false) {
          clearInterval(t1);

          this.prosegue(t, tms, daTcRun);
        } else {
          q++;
          if (q = 50) {
            clearInterval(t1);
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: Esco per elaborazione in corso');
            }
          }
        }
      }, 100)
      return;
    } */

    this.prosegue(t, tms, daTcRun, daDove);
  }
    /* const act_set = t.Utils.ActivitySetDelPuntoClickato;
    if (act_set === environment.stringaAll || act_set === environment.stringaLatestSelection) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ATTENZIONE!!! ACTIVITY SET del click impostata a ', act_set);
    } */
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lettura point measures', daTcRun, act_set);

  prosegue(t, tms, daTcRun, daDove) {
    let sla = ExternalUtilities.tornaSla(t); //  t.Utils.SlaDelPuntoClickato;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, sla);
    if (sla === environment.stringaGlobalSettingSLA || sla === '<Global Template>') {
      if (t.datiSlaDT && t.datiSlaDT !== 'empty grid') {
        t.datiSlaDT.forEach(element => {
          if (element.ID === t.slaValueGlobale2) {
            sla = element.NAME;
          }
        });
      }
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, sla);
    }

    if (tms === undefined) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: Esco per tms vuoto');
      }
      return;
    }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS[t.NumeroFrame2] < t.ritardoPerFunzioni && this.ultimaVoltaTMS[t.NumeroFrame2] !== -1) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: Esco per troppo veloce');
      }
      return;
    }
    this.ultimaVoltaTMS[t.NumeroFrame2] = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lettura point measures 2', tms);

    /* let sla1 = '';
    if (sla && sla !== '') {
      sla1 = ' and geo_sla_name = \'' + sla + '\' and tms = \'' + tms.trim() + '\'';
    } else {
      sla1 = 'tms =\'' + tms.trim() + '\'';
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Filtro per numerici frame ' + t.NumeroFrame + ':', sla, sla1);
    if (!sla || !sla1) {
      // return;
    } */

    // let act_set1 = act_set;
    // if (act_set1 === undefined) {
    //   act_set1 = '';
    // }
    // const act_set1 = ExternalUtilities.ritornaStringPerActivitySetAPoint(t, act_set);
    // const act_set1 = ExternalUtilities.ritornaStringPerActivitySetEventSummary(t, t.Utils);
    // const propertyName1 = 'propertyName=tms,measr_code,value_org,severity,color';

    // let act_set2 = act_set;
    // if (act_set2 === undefined) {
    //   act_set2 = '';
    // }
    // const act_set2 = ExternalUtilities.ritornaStringPerActivitySetAPoint(t, act_set);
    // const propertyName2 =  'propertyName=measr_code,value,color';

    // if (tms === '') {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '*' + t.Utils.tmsSelezionato + '-' + t.Utils.tmsFine + '*');
      }
      // if (t.Utils.tmsSelezionato === t.Utils.tmsFine) {
      if (t.Utils.tmsSelezionato > t.Utils.tmsFine) {
        const d1 = (new Date(t.Utils.tmsInizio + ' UTC+00').getTime()) + 1000; // +1
        const t1 = t.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

        tms = t1;
        t.Utils.tmsSelezionato = t1;
        t.cambioTmsSelezionato.emit(t1 + ';pointInfo');
      }
      tms = t.Utils.tmsSelezionato;
    // }
    // const sla2 = 'tms = \'' + tms.trim() + '\'';

    /* if (!act_set1 || act_set1 === 'undefined' || !tms || tms === 'undefined' ) {
      return;
    }
    if (act_set1 === '<All>') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'All nei point measures', daTcRun, act_set1, tms);
      // return;
    } */
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lettura point measures 3', act_set1);
    let agnact = '';

    // if (t.Activity2 === -1) {
    //   t.Activity2 = 1; // IMPOSTATO PERCHE' IN QUESTA MASCHERA ERA SEMPRE -1... RICONTROLLARE IN FUTURO
    // }

    if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = 'null';
    } else {
      agnact = ExternalUtilities.stringaAGNoACT;
    }
    if (!agnact) { agnact = 'null'; }

    if (agnact.indexOf('[') === -1 && agnact.indexOf(']') === -1) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: Esco per agnact non valido', t.NumeroFrame2, agnact);
      }
      return;
    }

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: AGN ACT Point Info: ', t.NumeroFrame2, t.Activity2, agnact, ExternalUtilities.stringaAGNoACT, daDove);
    }

    let array2 = '';
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure point info: ', t.Measure);
    t.Measure.forEach(element => {
      if (element && element !== '') {
        const misura = ExternalUtilities.ritornaMisura(t, element, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Point Info');

        array2 += misura + ',';
      }
    });
    if (array2.length > 0) {
      array2 = array2.substring(0, array2.length - 1);
      if (t.raggruppamentoPM) {
        t.datiPointMeasures = undefined; // 'empty grid'; // null;
      }
      t.raggruppamentoPM = false;
    } else {
      array2 = null;
      if (!t.raggruppamentoPM) {
        t.datiPointMeasures = undefined; // 'empty grid'; // null;
      }
      t.raggruppamentoPM = true;
    }

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';' + array2 + ";";
    const actualCall1 = 'POINT1;' + tms + ';' + agnact + ';' + sla + ';' + valoriDiBase + ';' + daTcRun;
    // const actualCall2 = 'POINT2;' + act_set2 + ';' + sla2 + ';' + propertyName2 + ';' + valoriDiBase + ';' + daTcRun;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PRE Last call 1', PointComponent.lastCallPI[t.NumeroFrame]);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PRE Last call 2', PointComponent.lastCallStr);

    if (t.datiPointMeasures && typeof(t.datiPointMeasures) === 'string') {
      if (t.datiPointMeasures.indexOf('ERROR: ') > -1) {
        t.datiPointMeasures = undefined;
        t.lastCallPI[t.NumeroFrame2] = undefined;
      }
    }
    
    if (t.lastCallPI[t.NumeroFrame2] !== actualCall1) {
      // return;

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ricarico point info', t.frameAttivo, t.NumeroFrame);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'POST actual call 1', actualCall1);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'POST actual call 2', actualCall2);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'POST Last call 1', actualCall1);

      t.caricamentoDatiInCorsoPointMeasures[t.NumeroFrame2] = true;

      t.lastCallPI[t.NumeroFrame2] = actualCall1;

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno point frame numerico ', t.NumeroFrame, t.frameVisibile, actualCall1, act_set1);

      /* let js1 = '';
      if (act_set1 !== '') {
        const layer1 = environment.layerPerGraficoNumerico;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Filtro per numeriche:', act_set1);
        const j1 = await t.downloadFile.downloadCSV(t.Utils, layer1, act_set1, '', '', sla1, propertyName1,
          'csv', '', 'EXECUTE', false, 'Point 1');
        js1 = t.downloadFile.converteCSVToJSON(j1);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure stringa:', js1, j1);
      } */

      this.staElaborandoPM = true;

      const params = {
        cntx_id: t.sessionID2,
        v_act_set_name_list: agnact,
        v_tms: tms,
        v_geo_sla_name: sla,
        v_measr_code_list: array2
      };
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno point info', params);

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point Info', t.NumeroFrame, params);
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'geo_point_info__grid';

      t.lastCallPM2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_point_info__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        this.staElaborandoPM = false;
        t.caricamentoDatiInCorsoPointMeasures[t.NumeroFrame2] = false;

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningPM = data2.v_grid_msg;
        } else {
          t.messaggioWarningPM = '';
        }

        if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
          t.titoloPointMeasures = data2.GridProperty[0].GridName;
          // const data = data2; // [0].geo_measure_dfn__grid);
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info:', t.datiPointMeasures, data2);
          // // logConsole('Point Info: Valori vecchi', t.datiPointMeasures);
          if (t.datiPointMeasures && t.datiPointMeasures.DataTable && data2.DataTable && data2.DataTable.length > 0) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: Aggiorno valori', data2.DataTable);

            t.datiPointMeasures.DataTable = data2.DataTable;
            // t.effettuaAutoFitPM = !t.effettuaAutoFitPM;
          } else {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: Riscrivo valori', data2.DataTable);

            // t.datiPointMeasures = undefined;
            // const tm = setTimeout(() => {
          // clearTimeout(tm);
              t.datiPointMeasures = undefined;
              const tm = setTimeout(() => {
                clearTimeout(tm);

                t.datiPointMeasures = data2;
                const tm1 = setTimeout(() => {
                  clearTimeout(tm1);
                  
                  t.effettuaAutoFitPM = !t.effettuaAutoFitPM;
                }, 1000);
              }, 1000);
            // }, 100);
            // this.vecchioJsonData = data2;
          }
        } else {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: Pulisco tutti valori');

          t.datiPointMeasures = undefined; // 'empty grid'; // null;
        }
      }, error => {
        this.staElaborandoPM = false;
        t.caricamentoDatiInCorsoPointMeasures[t.NumeroFrame2] = false;
        t.lastCallPI[t.NumeroFrame2] = '';
        // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
        t.datiPointMeasures = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        // // logConsole('Point Info: Valori vecchi su errore', t.datiPointMeasures);
      });

      /* this.js1old[t.NumeroFrame] = js1;

      let js2 = '';
      if (act_set2 !== '') {
        const layer2 = environment.layerPerGraficoStringa;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Filtro per stringhe:', act_set2);
        const j2 = await t.downloadFile.downloadCSV(t.Utils, layer2, act_set2, '', '', sla2,
          propertyName2, 'csv', '', 'EXECUTE', false, 'Point 2');
        js2 = t.downloadFile.converteCSVToJSON(j2);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure numeriche:', js2, j2);
      }
      this.js2old[t.NumeroFrame] = js2;

      if (daTcRun === false) {
        t.aggiornaPointMeasure(act_set1 + '§' + tms + '§' + js1.toString() + '§' + js2.toString());
        t.caricamentoDatiInCorsoPointMeasures = false;
      } else {
        t.datiPoint = js2;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure stringa per tc-run:', t.datiPoint);
      } */

    } else {
      this.staElaborandoPM = false;
      // if (daTcRun === false) {
      //   t.aggiornaPointMeasure(act_set1 + '§' + tms + '§' + this.js1old[t.NumeroFrame] + '§' + this.js2old[t.NumeroFrame]);
      // } else {
      //   t.datiPoint = this.js2old[t.NumeroFrame];
      // }
      /* t.datiPointMeasures = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiPointMeasures = this.vecchioJsonData;
      }, 100); */
    }
  }

  /*
  public elaboraPointmeasure(t2, j, misure) {
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Variato DatiPointMeasures:', j);
    let j1 = null;
    let j2 = null;

    if (j[2] && j[2].toUpperCase().indexOf('ERROR:') === - 1) {
      while (j[2].indexOf('""') > -1) {
        j[2] = j[2].replace('""', '"');
      }
      try {
        j1 = JSON.parse(j[2]);
      } catch (e) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nel parse', j[2]);
        return;
      }
    }
    if (j[3] && j[3].toUpperCase().indexOf('ERROR:') === - 1) {
      while (j[3].indexOf('""') > -1) {
        j[3] = j[3].replace('""', '"');
      }
      try {
        j2 = JSON.parse(j[3]);
      } catch (e) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nel parse', j[3]);
        return;
      }
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, j1, j2);
    let tot = '';
    let c = 1;
    const campi = new Array();
    let ok = false;
    if (j1 !== null) {
      let p;
      let tot2 = '';
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, j1, j2);
      j1.forEach(element => {
        if (element.value_org !== undefined && element.value_org !== 'undefined' &&
          element.value_org !== 'NoValue') {
          p = JSON.stringify(element);
          p = p.replace('{', '');
          p = p.replace('}', '');
          p = p.replace('value_org', 'value');
          if (!ok) {
            const cc = p.split(',');
            cc.forEach(element2 => {
              const ccc = element2.split(':');
              const campo = ccc[0].replace('"', '').replace('"', '');
              campi.push(campo);
            });
            // campi.push('colorato');
            ok = true;
          }
          // p += ',"colorato":"&aa0000;colorato"';
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, p);
          p = '{"ROW_ID": ' + c + ', ' + p + '}';
          c++;
          tot2 += p + ',';
        }
      });
      if (tot2 && tot2.length > 0) {
        const tot22 = '[' + tot2.substring(0, tot2.length - 1) + ']';
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tot22);
        const pp = JSON.parse(tot22);
        pp.forEach(element => {
          element.measr_code = ExternalUtilities.PrendeNomeMisuraDaCodice(element.measr_code, misure);
          // element.measr_code = '***color: ' + element.color + '***' + element.measr_code;
          element.value = '***background-color: ' + element.color + ', color: black, text-align: right***' + element.value;
          // element.severity = '***color: ' + element.color + '***' + element.severity;
        });
        let t = JSON.stringify(pp);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t);
        t = t.substring(1, t.length);
        t = t.substring(0, t.length - 1);
        if (t.length > 0) {
          t += ',';
        }
        tot += t;
      }
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tot);
    if (j2 !== null) {
      let p;
      let tot2 = '';
      j2.forEach(element => {
        if (element.value !== undefined && element.value !== 'undefined' &&
          element.value !== 'NoValue') {
          p = JSON.stringify(element);
          p = p.replace('{', '');
          p = p.replace('}', '');
          p += ',"severity":""';
          p = '{"ROW_ID": ' + c + ', ' + p + '}';
          c++;
          tot2 += p + ',';
        }
      });
      if (tot2 && tot2.length > 0) {
        const tot22 = '[' + tot2.substring(0, tot2.length - 1) + ']';
        const pp = JSON.parse(tot22);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, pp);
        pp.forEach(element => {
          element.measr_code = ExternalUtilities.PrendeNomeMisuraDaCodice(element.measr_code, misure);
          // element.measr_code = '***background-color: ' + element.color + '***' + element.measr_code;
          element.value = '***background-color: ' + element.color + ', color: white***' + element.value;
          // element.severity = '***background-color: ' + element.color + '***' + element.severity;
        });
        let t = JSON.stringify(pp);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t);
        t = t.substring(1, t.length);
        t = t.substring(0, t.length - 1);
        if (t.length > 0) {
          t += ',';
        }
        tot += t;
      }
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tot);
    if (tot.length > 0) {
      tot = tot.substring(0, tot.length - 1);
      tot = '[' + tot + ']';

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, campi);

      let col = '';
      c = 0;
      campi.forEach(element => {
        col += '{';
        col += '"IsEmpty": "false",';
        col += '"dataType": "string",';
        col += '"headerText": "' + element + '",';
        if (element === 'tms' || element === 'color') {
          col += '"hide": "true",';
        } else {
          col += '"hide": "false",';
        }
        col += '"key": "' + element + '",';
        col += '"locked": "true",';
        col += '"place": "' + c + '"';
        col += '},';
        c++;
      });
      if (col.length > 0) {
        col = col.substring(0, col.length - 1);
        col = '[' + col + ']';

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, col);
        const colonne = JSON.parse(col);
        const proprieta = [{
          GridName: 'Point Info',
          IsFilterDisplayed: 'N',
          ItemsPerPage: '100',
          ShowColumnSelector: 'true',
          pageable: 'false',
          reportType: 'Rep',
        }];
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, colonne);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati point measures:', tot);
        const dati = JSON.parse(tot);

        // Imposta dimensione massima del campo value
        dati.forEach(element => {
          let valore = element['value'];
          if (valore.indexOf('***') > - 1) {
            valore = valore.substring(0, valore + 3) + 'max-width: 130px, ' + valore.substring(valore + 4, valore.length);
          }
          element['value'] = valore;
        });
        // Imposta dimensione massima del campo value
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati point measures:', dati);

        const strutt = {
          ColumnProperty: colonne,
          DataTable: dati,
          GridProperty: proprieta
        };

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Point Measures variati:', dati);

        return strutt;
      } else {
        return 'empty grid';
      }
    } else {
      return 'empty grid';
    }
  }
  */

  public async prendePointMeasuresPerInfo(t, act_set, sla, tms, misure) {
    let sla1 = '';
    if (sla && sla !== '') {
      sla1 = 'geo_sla_name = \'' + sla + '\' and tms = \'' + tms + '\'';
    } else {
      sla1 = 'tms =\'' + tms + '\'';
    }
    let m = '';
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, misure);
    misure.forEach(element => {
      if (element !== '') {
        m += '\'' + element + '\',';
      }
    });
    if (m.length > 0) {
      m = m.substring(0, m.length - 1);
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, m);
    if (m !== '') {
      sla1 += ' and measr_code in (' + m + ')';
    } else {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Nessun measr_code impostato');
      return '';
    }

    const act_set1 = ExternalUtilities.ritornaStringPerActivitySetAPoint(t, act_set);
    const propertyName1 = 'propertyName=tms,measr_code,value_org,severity,color';

    const act_set2 = ExternalUtilities.ritornaStringPerActivitySetAPoint(t, act_set);
    const propertyName2 =  'propertyName=measr_code,value,color';

    let sla2 = 'tms = \'' + tms + '\'';
    sla2 += ' and measr_code in (' + m + ')';

    let ritorno = '<table width="100%" cellpading="2"><tr><th>Measure</th><th>Value</th><th>Severity</th></tr>';
    let js1 = '';
    if (act_set1 !== '') {
      const layer1 = environment.layerPerGraficoNumerico;
      const j1 = await t.downloadFile.downloadCSV(layer1, act_set1, '', '', sla1, propertyName1,
        'csv', '', 'EXECUTE', false, 'Point 3');
      js1 = t.downloadFile.converteCSVToJSON(j1);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, js1);
      for (let i = 1; i < j1.length ; i++) {
        const nm = ExternalUtilities.PrendeNomeMisuraDaCodice(j1[i][1], t.measureData2, 'PMI 1. Frame ' + t.NumeroFrame2);
        ritorno += ('<tr><td>' + nm + '</td><td style="color: black; background-color: ' + j1[i][5] + '">' +
                j1[i][3] + '</td><td>' + j1[i][4] + '</td></tr>');
      }
    }

    let js2 = '';
    if (act_set2 !== '') {
      const layer2 = environment.layerPerGraficoStringa;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Filtro per stringhe:', sla);
      const j2 = await t.downloadFile.downloadCSV(layer2, act_set2, '', '', sla2, propertyName2, 'csv', '', 'EXECUTE', false, 'Point 4');
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure stringa:', j2);
      js2 = t.downloadFile.converteCSVToJSON(j2);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, js2);
      for (let i = 1; i < j2.length ; i++) {
        const nm = ExternalUtilities.PrendeNomeMisuraDaCodice(j2[i][1], t.measureData2, 'PMI 2. Frame ' + t.NumeroFrame2);
        ritorno += ('<tr><td>' + nm + '</td><td style="color: white; background-color: ' + j2[i][3] + '">' +
                j2[i][2] + '</td><td></td></tr>');
      }
    }
    ritorno += '</table>';
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, ritorno);

    return ritorno;
  }
}

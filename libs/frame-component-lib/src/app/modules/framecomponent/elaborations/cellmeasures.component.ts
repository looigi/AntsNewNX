import { logConsole } from '../console-log';
import { ExternalApiService } from '../../framecomponent/services/externalapi.service';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { environment } from '../../../../environments/environment.prod';

// import { SessionService } from '../../../../db/session.service';
// import Utils from '../Utilities.component';

@Injectable()
export class CellMeasuresComponent {
  // lastCallCM = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  // staDisegnandoCellMeasures = [false, false, false, false, false, false, false, false, false, false, false]; // ,
  //     false, false, false, false, false, false, false, false, false, false, false];

  destroy$ = new FineRichieste();

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.erroreCellM[t.NumeroFrame2] = '';
    t.lastCallCM[t.NumeroFrame2] = '';
    t.datiCellMeasure = undefined; // 'empty grid';
    t.vecchiDatiCellMeasure = undefined;
    // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;

    const nome = 'gridCellMeasure_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  // lastCM;

  caricaCellMeasure(t, daDove) {
    /* const ora = new Date().getTime();
    if (ora - this.lastCM < 5000) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CM. Esco per troppo veloce');

      return;
    }
    this.lastCM = ora; */
    // logConsole('Cell measure 1');

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico !== 'CM') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Cell Measure', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    // logConsole('Cell measure 2');
    // // logConsole('Cell measure chiamato da ', daDove);

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /* let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM: Prende cell measure', t.NumeroFrame, t.timeFilter, t.Utils.tmsSelezionato);
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'CM' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM: Cell measures ESCO 1');
      }
      return;
    }

    if (t.MappaOGrafico2 !== 'CM' || this.staDisegnandoCellMeasures[t.NumeroFrame2] === true) {
      // t.datiCellMeasure = 'empty grid';
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM: Cell measures ESCO 4');
      }
      return;
    } */

    const act_id = t.act_id2; // ExternalUtilities.prendeActivitySceltaCellMeasures(t, t.Utils);
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM: Cell measures 1 ', t.NumeroFrame, act_id);
    }

    if (act_id === '') {
      // t.datiCellMeasure = 'empty grid';
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM: Cell measures ESCO 3');
      }
      
      return;
    }

    // logConsole('Cell measure 3');

    // const tms = t.Utils.tmsSelezionato;

    let sInizio = '';
    let sFine = '';
    let filtro = '';

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.tmsSelezionato, t.Utils.rangeDiSecondiPerMille);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.timeFilter, t.timeFilter2);
    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      if (t.Utils.tmsInizio && t.Utils.tmsFine) {
        sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
        sFine = t.Utils.tmsFine; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
        filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time Range', sInizio, sFine);
      } else {
        // t.datiCellMeasure = 'empty grid';
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM: Cell measures ESCO 2');
        }
        t.lastCallCM[t.NumeroFrame2] = '';
        return;
      }
    } else {
      if (t.timeFilter === 3 || t.timeFilter2 === 'Fixed Seconds') {
        if (t.Utils.tmsSelezionato) {
          const vecchioRange = t.Utils.lastRangeCells[t.frameAttivo][t.NumeroFrame];
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.Utils.tmsSelezionato, vecchioRange);
          if (vecchioRange !== null && new Date(t.Utils.tmsSelezionato).getTime() >= vecchioRange.min &&
            new Date(t.Utils.tmsSelezionato).getTime() <= vecchioRange.max) {
            sInizio = t.datePipe.transform(vecchioRange.min, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            sFine = t.datePipe.transform(vecchioRange.max, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;
            // onsole.log('Interno al vecchio range');
          } else {
            const fs = t.fixedSeconds2 * 1000;
            const dInizio = ((new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime()) - fs);
            sInizio = t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            const dFine = ((new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime()) + fs);
            sFine = t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esterno al vecchio range');

            const a = { min: dInizio, max: dFine};
            t.Utils.lastRangeCells[t.frameAttivo][t.NumeroFrame] = a;
          }
        } else {
          // t.datiCellMeasure = 'empty grid';
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM: Cell measures ESCO 1');
          }
          t.lastCallCM[t.NumeroFrame2] = '';
          return;
        }
      } else {
        filtro = '';
        // sInizio = '1970-01-01 00:00:00';
        // sFine = '3999-12-31 23:59:59';
        sInizio = t.timeRangeDSFStart2;
        sFine = t.timeRangeDSFStop2;
      }
    }

    // logConsole('Cell measure 4', sInizio, sFine);
    // this.staDisegnandoCellMeasures[t.NumeroFrame2] = true;

    let eventi = '';

    /* let lista = null;
    let lep = null;
    if (t.tipoEvento2 === 'L') {
      lista = t.listaEventiDaPassare2;
      lep = t.Utils.converteStringaInJSON(lista);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi globale');
    } else {
      lista = t.eventiSceltiES;
      lep = lista;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi globale');
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lista, lep);
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per eventi:', listaEventiDaPassare2, lep);
    if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep.length > 0) {
      lep.forEach(element => {
        eventi += element.EVENT_TYPE + ',';
      });
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Folders / eventi:', folders, eventi);
    if (eventi.length > 0) {
      eventi = eventi.substring(0, eventi.length - 1);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, eventi);
    } else {
      if (t.tipoEvento2 === 'G') {
        eventi = 'event_type = \'NONE\'';
      }
    }

    if (!t.act_set) {
      let tt = 0;
      const t1 = setInterval(() => {
        if (t.act_set) {
          clearInterval(t1);
          
          this.cellMeasure2(t, sInizio, sFine, filtro, eventi);
        } else {
          tt++;
          if (tt > 10) {
            clearInterval(t1);
          }
        }
      }, 1000);
      // return;
    } else {
      this.cellMeasure2(t, sInizio, sFine, filtro, eventi);
    }
  }

  timerChiamata;

  cellMeasure2(t, sInizio, sFine, filtro, eventi) { */
    // FILTER
    const filtri = ExternalUtilities.prendeFiltri(t, true, 'CellMeasure');
    const cm1 = filtri.cm1;
    const cm2 = filtri.cm2;
    const tf1 = filtri.tf1;
    const tf2 = filtri.tf2;
    // FILTER

    if (!sInizio || !sFine) {
      return;
    }
    
    const params = {
      cntx_id: t.sessionID2,
      v_filter_act_set_id_list: t.act_set,
      // v_event_type_list: eventi,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_filter_measr_code_1: cm1,
      v_filter_measr_value_1: tf1,
      v_filter_measr_code_2: cm2,
      v_filter_measr_value_2: tf2
    };

    // logConsole('Cell measure 5', params);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
    const propertyName = '';

    const actualCall = JSON.stringify(params) + ';' + filtro + ';' + eventi + ';' + t.columnsSettings + ';' +
      propertyName;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM: Cell measures 2 ', t.NumeroFrame, actualCall);
    }

    if (t.datiCellMeasure && typeof(t.datiCellMeasure) === 'string') {
      if (t.datiCellMeasure.indexOf('ERROR: ') > -1) {
        t.datiCellMeasure = undefined;
        t.lastCallCM[t.NumeroFrame2] = undefined;
      }
    }

    // logConsole('Cell measure 6', actualCall);
    // logConsole('Cell measure 6 Accendo rotella');
    t.caricamentoCellMeasuresInCorso[t.NumeroFrame2] = true;
    if (actualCall !== t.lastCallCM[t.NumeroFrame2]) {
      t.lastCallCM[t.NumeroFrame2] = actualCall;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM: Cell Measr Grid', t.NumeroFrame, params);
      }

      t.effettuaAutoFitCME = false;

      // logConsole('Chiamata CM', daDove, params);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
      t.erroreCellM[t.NumeroFrame2] = '';
      
      t.chiSonoCM[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params['v_caller_tag'] = t.chiSonoCM[t.NumeroFrame2];
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'geo_cell_measr__grid';

      // logConsole('Cell measure 7');
      t.lastCallCM2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_cell_measr__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))      
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (!t.controllaRitornoChiamata(t, data2, 'CellMeasures')) {
          t.caricamentoCellMeasuresInCorso[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 1');
          return;
        }

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningCM = data2.v_grid_msg;
        } else {
          t.messaggioWarningCM = '';
        }

        /* if (data && data !== null && data.GridProperty && data.GridProperty[0]) {
          t.frameName = data.GridProperty[0].GridName;
        }

        let dcm = null;
        try {
          dcm = data;
        } catch (e) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore parse', data);
        } */
        if (data2.message || data2.failure_reason) {
          if (data2.message) {
            t.erroreCellM[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          } else {
            t.erroreCellM[t.NumeroFrame2] = 'ERROR: ' + data2.err_code + '-' + data2.failure_reason;
          }

          t.datiCellMeasure = undefined;
          t.lastCallCM[t.NumeroFrame2] = '';

          t.caricamentoCellMeasuresInCorso[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 2');

          // logConsole('Cell measure 8');
          return;
        } else {
          const dcm = data2;
          /* dcm = JSON.stringify(dcm);
          dcm = ExternalUtilities.effettuaReplace(dcm, 'row id', 'ROW_ID');
          dcm = JSON.parse(dcm); */

          if (t.vecchiDatiCellMeasure) {
            if (JSON.stringify(t.vecchiDatiCellMeasure.ColumnProperty) !== JSON.stringify(dcm.ColumnProperty)) {
              // logConsole('Pulisco dati CM');
              t.datiCellMeasure = undefined;
            }
          }

          if (t.datiCellMeasure !== undefined && t.datiCellMeasure !== null && t.datiCellMeasure.DataTable &&
            t.datiCellMeasure.DataTable.length > 0 && t.datiCellMeasure !== 'empty grid' && dcm.DataTable) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM da aggiornare', dcm);
              }

              t.datiCellMeasure.DataTable = dcm.DataTable;
              // t.impostaPaginaCME = 0;
              // logConsole('Aggiorno dati CM');
              // logConsole('Cell measure 9');
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM da impostare', dcm);
            }

            // t.datiCellMeasure = undefined;
            t.datiCellMeasure = undefined;
            const tm = setTimeout(() => {
              clearTimeout(tm);

              t.datiCellMeasure = dcm;
              t.effettuaAutoFitCME = !t.effettuaAutoFitCME; // !t.effettuaAutoFitCME;
              t.impostaPaginaCME = 0;

              // logConsole('Cell measure 10');
              // logConsole('Creo dati CM');
            }, 500);
          }

          t.vecchiDatiCellMeasure = dcm;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati letti CM', t.datiCellMeasure);
          }

          t.caricamentoCellMeasuresInCorso[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 3');
          // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiCellMeasure, error);
        t.datiCellMeasure = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);

        t.lastCallCM[t.NumeroFrame2] = '';
        
        t.caricamentoCellMeasuresInCorso[t.NumeroFrame2] = false;
        // logConsole('Cell measure 6 Spengo rotella 4');
        // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        // logConsole('Cell measure 11');
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati vecchi CM', t.vecchiDatiCellMeasure);
      }
      // logConsole('Cell measure 12');

      /* t.datiCellMeasure = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // logConsole('Cell measure 12');
        t.datiCellMeasure = t.vecchiDatiCellMeasure;
      }, 100); */
      // t.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
      t.caricamentoCellMeasuresInCorso[t.NumeroFrame2] = false;
      // logConsole('Cell measure 6 Spengo rotella 5');
    }
  }
}

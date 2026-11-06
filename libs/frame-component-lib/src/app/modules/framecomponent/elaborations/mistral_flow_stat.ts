import { logConsole } from '../console-log';
import { ExternalApiService } from '../../framecomponent/services/externalapi.service';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { environment } from '../../../../environments/environment.prod';erroreMistralFStat  

// import { SessionService } from '../../../../db/session.service';
// import Utils from '../Utilities.component';

@Injectable()
export class MistralFlowStatComponent {
  // lastCallMFStat = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

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

    t.erroreMistralFStat[t.NumeroFrame2] = '';
    t.lastCallMFStat[t.NumeroFrame2] = '';
    t.datiMistralFStat = undefined; // 'empty grid';
    t.vecchidatiMistralFStat = undefined;
    // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;

    t.erroreMistralFStat2[t.NumeroFrame2] = '';
    t.datiMistralFStat2 = undefined;
    t.lastCallMFStat2[t.NumeroFrame2] = undefined;
    t.vecchidatiMistralFStat2 = undefined;

    const nome = 'gridMistralFStat_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }

    const nome2 = 'gridMistralFStat2_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento2 = document.getElementById(nome2) as HTMLElement;
    if (elemento2) {
      elemento2.outerHTML = '';
      elemento2.innerHTML = '';
      elemento2.remove();
    }
  }

  caricaMFStat1(t, daDove) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico !== 'MS') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON caricamentoMStat tipo flow_stat', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }

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
        // t.datiMistralCDR = 'empty grid';
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MStat: Mistral Flow Stat ESCO 2');
        }
        t.lastCallMFStat[t.NumeroFrame2] = '';
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
          // t.datiMistralCDR = 'empty grid';
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MStat: Mistral Flow Stat ESCO 1');
          }
          t.lastCallMFStat[t.NumeroFrame2] = '';
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

    const params = {
      v_cntx_id: t.sessionID2,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_flow_type: t.flowTypeMS2 ? t.flowTypeMS2 : null,
      v_mode: t.viewModeMS2 ? t.viewModeMS2 : null, // 'mistral_flow_stat'
    };

    // logConsole('Cell measure 5', params);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
    const propertyName = '';

    const actualCall = JSON.stringify(params) + ';' + t.columnsSettings + ';' +
      propertyName;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF: Mistral Flow Stat 2 ', t.NumeroFrame, actualCall);
    }

    if (t.datiMistralFStat && typeof(t.datiMistralFStat) === 'string') {
      if (t.datiMistralFStat.indexOf('ERROR: ') > -1) {
        t.datiMistralFStat = undefined;
        t.lastCallMFStat[t.NumeroFrame2] = undefined;
      }
    }

    // logConsole('Cell measure 6', actualCall);
    // logConsole('Cell measure 6 Accendo rotella');
    t.caricamentoMStat[t.NumeroFrame2] = true;
    if (actualCall !== t.lastCallMFStat[t.NumeroFrame2]) {
      t.lastCallMFStat[t.NumeroFrame2] = actualCall;

      t.datiMistralFStat2 = undefined;
      t.lastCallMFStat2[t.NumeroFrame2] = undefined;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF: Mistral Flow Stat', t.NumeroFrame, params);
      }

      t.effettuaAutoFitMStat = false;

      // logConsole('Chiamata CM', daDove, params);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
      t.erroreMistralFStat[t.NumeroFrame2] = '';
      
      t.chiSonoMFStat[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      // params['v_caller_tag'] = t.chiSonoMFStat[t.NumeroFrame2];

      // logConsole('Cell measure 7');
      t.lastCallMFStat22[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'mistral_flow_stat__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))      
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningFSTAT = data2.v_grid_msg;
        } else {
          t.messaggioWarningFSTAT = '';
        }

        // logConsole('Dati Mistral Flow Stat', data2);

        if (data2.message || data2.failure_reason) {
          if (data2.message) {
            t.erroreMistralFStat[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          } else {
            t.erroreMistralFStat[t.NumeroFrame2] = 'ERROR: ' + data2.err_code + '-' + data2.failure_reason;
          }

          t.datiMistralFStat = undefined;
          t.lastCallMFStat[t.NumeroFrame2] = '';

          t.caricamentoMStat[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 2');

          // logConsole('Cell measure 8');
          return;
        } else {
          const dcm = data2;
          /* dcm = JSON.stringify(dcm);
          dcm = ExternalUtilities.effettuaReplace(dcm, 'row id', 'ROW_ID');
          dcm = JSON.parse(dcm); */

          if (t.vecchidatiMistralFStat) {
            if (JSON.stringify(t.vecchidatiMistralFStat.ColumnProperty) !== JSON.stringify(dcm.ColumnProperty)) {
              // logConsole('Pulisco Dati MF');
              t.datiMistralFStat = undefined;
            }
          }

          // logConsole('Dati Mistral Flow Stat', dcm);

          if (t.datiMistralFStat !== undefined && t.datiMistralFStat !== null && t.datiMistralFStat.DataTable &&
            t.datiMistralFStat.DataTable.length > 0 && t.datiMistralFStat !== 'empty grid' && dcm.DataTable) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MFStat da aggiornare', dcm);
              }

              // logConsole('Aggiorno Dati Mistral Flow Stat', dcm.DataTable);

              t.datiMistralFStat.DataTable = dcm.DataTable;
              // logConsole('Aggiorno Dati MF');
              // logConsole('Cell measure 9');
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MFStat da impostare', dcm);
            }

            // t.datiMistralFStat = undefined;
            // logConsole('Creo Dati Mistral Flow Stat', dcm);

            t.datiMistralFStat = undefined;
            const tm = setTimeout(() => {
              clearTimeout(tm);

              t.datiMistralFStat = dcm;
              t.effettuaAutoFitMStat = !t.effettuaAutoFitMStat; // !t.effettuaAutoFitMStat;

              // logConsole('Cell measure 10');
              // logConsole('Creo Dati MF');
            }, 500);
          }

          t.vecchidatiMistralFStat = dcm;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati letti MStat', t.datiMistralFStat);
          }

          t.caricamentoMStat[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 3');
          // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiMistralFStat, error);
        t.datiMistralFStat = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);

        t.lastCallMFStat[t.NumeroFrame2] = '';
        
        t.caricamentoMStat[t.NumeroFrame2] = false;
        // logConsole('Cell measure 6 Spengo rotella 4');
        // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        // logConsole('Cell measure 11');
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati vecchi MStat', t.vecchidatiMistralFStat);
      }
      // logConsole('Cell measure 12');

      /* t.datiMistralFStat = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // logConsole('Cell measure 12');
        t.datiMistralFStat = t.vecchidatiMistralFStat;
      }, 100); */
      // t.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
      t.caricamentoMStat[t.NumeroFrame2] = false;
      // logConsole('Cell measure 6 Spengo rotella 5');
    }
  }

  caricaMFStat2(t, daDove) {
    // if (!t.frameVisible2) {
    //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

    //   return;
    // }
    // logConsole('MfStat2da', daDove, t.MappaOGrafico);

    if (t.MappaOGrafico !== 'MS') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON caricamentoMStat tipo flow_stat 2', t.NumeroFrame2, t.MappaOGrafico2);
      // logConsole('MfStat2esco 1');

      return;
    }

    let sInizio = '';
    let sFine = '';
    let filtro = '';

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.tmsSelezionato, t.Utils.rangeDiSecondiPerMille);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.timeFilter, t.timeFilter2);
    // logConsole('MfStat2da', t.timeFilter);

    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      if (t.Utils.tmsInizio && t.Utils.tmsFine) {
        sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
        sFine = t.Utils.tmsFine; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
        filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time Range', sInizio, sFine);
      } else {
        // t.datiMistralCDR = 'empty grid';
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MStat: Mistral Flow Stat 2 ESCO 2');
        }
        t.lastCallMFStat2[t.NumeroFrame2] = '';
        // logConsole('MfStat2esco 2');
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
          // t.datiMistralCDR = 'empty grid';
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MStat: Mistral Flow Stat 2 ESCO 1');
          }
          t.lastCallMFStat2[t.NumeroFrame2] = '';
          // logConsole('MfStat2esco 3');
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

    // logConsole('MfStat2tms', sInizio, sFine);

    const params = {
      v_cntx_id: t.sessionID2,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_flow_type: t.flowType ? t.flowType : null, // t.viewModeMS2 ? t.viewModeMS2 : null,
      v_mode: 'mistral_flow_stat_by_hour'
    };

    // logConsole('MfStat2params', params);

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
    const propertyName = '';

    const actualCall = JSON.stringify(params) + ';' + t.columnsSettings + ';' +
      propertyName;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF: Mistral Flow Stat 2 1', t.NumeroFrame, actualCall);
    }

    if (t.datiMistralFStat2 && typeof(t.datiMistralFStat2) === 'string') {
      if (t.datiMistralFStat2.indexOf('ERROR: ') > -1) {
        t.datiMistralFStat2 = undefined;
        t.lastCallMFStat2[t.NumeroFrame2] = undefined;
      }
    }

    // logConsole('Cell measure 6', actualCall);
    // logConsole('Cell measure 6 Accendo rotella');
    t.caricamentoMStat2[t.NumeroFrame2] = true;

    // logConsole('MfStat2controllo', actualCall, t.lastCallMFStat2[t.NumeroFrame2], actualCall !== t.lastCallMFStat2[t.NumeroFrame2]);

    if (actualCall !== t.lastCallMFStat2[t.NumeroFrame2]) {
      t.lastCallMFStat2[t.NumeroFrame2] = actualCall;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF: Mistral Flow Stat 2 2', t.NumeroFrame, params);
      }

      // logConsole('MfStat2vado');

      t.effettuaAutoFitMStat2 = false;

      // logConsole('Chiamata CM', daDove, params);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
      t.erroreMistralFStat2[t.NumeroFrame2] = '';
      
      t.chiSonoMFStat2[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      // params['v_caller_tag'] = t.chiSonoMFStat2[t.NumeroFrame2];
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'mistral_flow_stat__grid';

      // logConsole('Cell measure 7');
      this.apiService.chiamataPost(t.Utils, 'mistral_flow_stat__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))      
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        /* if (!t.controllaRitornoChiamata(t, data2, 'MistralFlow')) {
          t.caricamentoMStat2[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 1');
          return;
        }

        if (data && data !== null && data.GridProperty && data.GridProperty[0]) {
          t.frameName = data.GridProperty[0].GridName;
        }

        let dcm = null;
        try {
          dcm = data;
        } catch (e) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore parse', data);
        } */

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningFSTAT2 = data2.v_grid_msg;
        } else {
          t.messaggioWarningFSTAT2 = '';
        }

        if (data2.message || data2.failure_reason) {
          if (data2.message) {
            t.erroreMistralFStat2[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          } else {
            t.erroreMistralFStat2[t.NumeroFrame2] = 'ERROR: ' + data2.err_code + '-' + data2.failure_reason;
          }

          t.datiMistralFStat2 = undefined;
          t.lastCallMFStat2[t.NumeroFrame2] = '';

          t.caricamentoMStat2[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 2');

          // logConsole('Cell measure 8');
          return;
        } else {
          const dcm = data2;
          /* dcm = JSON.stringify(dcm);
          dcm = ExternalUtilities.effettuaReplace(dcm, 'row id', 'ROW_ID');
          dcm = JSON.parse(dcm); */

          if (t.vecchidatiMistralFStat2) {
            if (JSON.stringify(t.vecchidatiMistralFStat2.ColumnProperty) !== JSON.stringify(dcm.ColumnProperty)) {
              // logConsole('Pulisco Dati MF');
              t.datiMistralFStat2 = undefined;
            }
          }

          if (t.datiMistralFStat2 !== undefined && t.datiMistralFStat2 !== null && t.datiMistralFStat2.DataTable &&
            t.datiMistralFStat2.DataTable.length > 0 && t.datiMistralFStat2 !== 'empty grid' && dcm.DataTable) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MFStat2 da aggiornare', dcm);
              }

              t.datiMistralFStat2.DataTable = dcm.DataTable;
              // logConsole('Aggiorno Dati MF');
              // logConsole('Cell measure 9');
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MFStat2 da impostare', dcm);
            }

            // t.datiMistralFStat2 = undefined;
            t.datiMistralFStat2 = undefined;
            const tm = setTimeout(() => {
              clearTimeout(tm);

              t.datiMistralFStat2 = dcm;
              t.effettuaAutoFitMStat2 = !t.effettuaAutoFitMStat2; // !t.effettuaAutoFitMStat2;

              // logConsole('Cell measure 10');
              // logConsole('Creo Dati MF');
            }, 500);
          }

          t.vecchidatiMistralFStat2 = dcm;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati letti MFStat2', t.datiMistralFStat2);
          }

          t.caricamentoMStat2[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 3');
          // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiMistralFStat2, error);
        t.datiMistralFStat2 = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);

        t.lastCallMFStat2[t.NumeroFrame2] = '';
        
        t.caricamentoMStat2[t.NumeroFrame2] = false;
        // logConsole('Cell measure 6 Spengo rotella 4');
        // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        // logConsole('Cell measure 11');
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati vecchi MFStat2', t.vecchidatiMistralFStat2);
      }
      // logConsole('Cell measure 12');

      /* t.datiMistralFStat2 = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // logConsole('Cell measure 12');
        t.datiMistralFStat2 = t.vecchidatiMistralFStat2;
      }, 100); */
      // t.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
      t.caricamentoMStat2[t.NumeroFrame2] = false;
      // logConsole('Cell measure 6 Spengo rotella 5');
    }
  }
}

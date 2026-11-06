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
export class MistralFlowQueueComponent {
  // lastCallMQ = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

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

    t.erroreMistralFQ[t.NumeroFrame2] = '';
    t.lastCallMQ[t.NumeroFrame2] = '';
    t.datiMistralFQ = undefined; // 'empty grid';
    t.vecchidatiMistralFQ = undefined;
    // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;

    const nome = 'gridMistralFQ_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  caricaMQ(t, daDove) {
    // if (!t.frameVisible2) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      // return;
    // }

    if (t.MappaOGrafico !== 'MQ') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo flow queue', t.NumeroFrame2, t.MappaOGrafico2);

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
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MStat: Mistral Flow Queue ESCO 2');
        }
        t.lastCallMQ[t.NumeroFrame2] = '';
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
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MStat: Mistral Flow Queue ESCO 1');
          }
          t.lastCallMQ[t.NumeroFrame2] = '';
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
      v_flow_type: null,
      v_mode: 'mistral_flow_queue'
    };

    // logConsole('Cell measure 5', params);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
    const propertyName = '';

    const actualCall = JSON.stringify(params) + ';' + t.columnsSettings + ';' +
      propertyName;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF: Mistral Flow 2 ', t.NumeroFrame, actualCall);
    }

    if (t.datiMistralFQ && typeof(t.datiMistralFQ) === 'string') {
      if (t.datiMistralFQ.indexOf('ERROR: ') > -1) {
        t.datiMistralFQ = undefined;
        t.lastCallMQ[t.NumeroFrame2] = undefined;
      }
    }

    // logConsole('Cell measure 6', actualCall);
    // logConsole('Cell measure 6 Accendo rotella');
    t.caricamentoMQ[t.NumeroFrame2] = true;
    if (actualCall !== t.lastCallMQ[t.NumeroFrame2]) {
      t.lastCallMQ[t.NumeroFrame2] = actualCall;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF: Mistral Flow Queue', t.NumeroFrame, params);
      }

      t.effettuaAutoFitMQ = false;

      // logConsole('Chiamata CM', daDove, params);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
      t.erroreMistralFQ[t.NumeroFrame2] = '';
      
      t.chiSonoMF[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      // params['v_caller_tag'] = t.chiSonoMF[t.NumeroFrame2];
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'mistral_flow_stat__grid';

      // logConsole('Cell measure 7');
      t.lastCallMQ2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'mistral_flow_stat__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))      
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        /* if (!t.controllaRitornoChiamata(t, data2, 'MistralFlow')) {
          t.caricamentoMQ[t.NumeroFrame2] = false;
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
          t.messaggioWarningFQ = data2.v_grid_msg;
        } else {
          t.messaggioWarningFQ = '';
        }

        if (data2.message || data2.failure_reason) {
          if (data2.message) {
            t.erroreMistralFQ[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          } else {
            t.erroreMistralFQ[t.NumeroFrame2] = 'ERROR: ' + data2.err_code + '-' + data2.failure_reason;
          }

          t.datiMistralFQ = undefined;
          t.lastCallMQ[t.NumeroFrame2] = '';

          t.caricamentoMQ[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 2');

          // logConsole('Cell measure 8');
          return;
        } else {
          const dcm = data2;
          /* dcm = JSON.stringify(dcm);
          dcm = ExternalUtilities.effettuaReplace(dcm, 'row id', 'ROW_ID');
          dcm = JSON.parse(dcm); */

          if (t.vecchidatiMistralFQ) {
            if (JSON.stringify(t.vecchidatiMistralFQ.ColumnProperty) !== JSON.stringify(dcm.ColumnProperty)) {
              // logConsole('Pulisco Dati MF');
              t.datiMistralFQ = undefined;
            }
          }

          if (t.datiMistralFQ !== undefined && t.datiMistralFQ !== null && t.datiMistralFQ.DataTable &&
            t.datiMistralFQ.DataTable.length > 0 && t.datiMistralFQ !== 'empty grid' && dcm.DataTable) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF da aggiornare', dcm);
              }

              t.datiMistralFQ.DataTable = dcm.DataTable;
              // t.impostaPaginaCME = 0;
              // logConsole('Aggiorno Dati MF');
              // logConsole('Cell measure 9');
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF da impostare', dcm);
            }

            // t.datiMistralFQ = undefined;
            t.datiMistralFQ = undefined;
            const tm = setTimeout(() => {
              clearTimeout(tm);

              t.datiMistralFQ = dcm;
              t.effettuaAutoFitMQ = !t.effettuaAutoFitMQ; // !t.effettuaAutoFitMQ;
              t.impostaPaginaCME = 0;

              // logConsole('Cell measure 10');
              // logConsole('Creo Dati MF');
            }, 500);
          }

          t.vecchidatiMistralFQ = dcm;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati letti CM', t.datiMistralFQ);
          }

          t.caricamentoMQ[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 3');
          // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiMistralFQ, error);
        t.datiMistralFQ = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        t.erroreMistralFQ[t.NumeroFrame2] = t.datiMistralFQ;  
        
        t.lastCallMQ[t.NumeroFrame2] = '';
        
        t.caricamentoMQ[t.NumeroFrame2] = false;
        // logConsole('Cell measure 6 Spengo rotella 4');
        // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        // logConsole('Cell measure 11');
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati vecchi CM', t.vecchidatiMistralFQ);
      }
      // logConsole('Cell measure 12');

      /* t.datiMistralFQ = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // logConsole('Cell measure 12');
        t.datiMistralFQ = t.vecchidatiMistralFQ;
      }, 100); */
      // t.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
      t.caricamentoMQ[t.NumeroFrame2] = false;
      // logConsole('Cell measure 6 Spengo rotella 5');
    }
  }
}

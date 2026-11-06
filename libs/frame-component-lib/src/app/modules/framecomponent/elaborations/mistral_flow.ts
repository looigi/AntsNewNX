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
export class MistralFlowComponent {
  // lastCallMF = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

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

    t.erroreMistralFS[t.NumeroFrame2] = '';
    t.lastCallMF[t.NumeroFrame2] = '';
    t.datiMistralFS = undefined; // 'empty grid';
    t.vecchiDatiMistralFS = undefined;
    // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;

    const nome = 'gridMistralFS_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  caricaMF(t, daDove) {
    // if (!t.frameVisible2) {
    //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      // return;
    // }
    // logConsole('Mistral Flow Segment daDove', daDove);

    if (t.MappaOGrafico !== 'MF') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Cell Measure', t.NumeroFrame2, t.MappaOGrafico2);
      logConsole('Mistral Flow Segment esco 1');

      return;
    }
    
    /* if (!t.imsiSelezionato) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per imsi non valido', t.NumeroFrame2, t.MappaOGrafico2);
      logConsole('Mistral Flow Segment esco 2');

      return;
    }

    if (!t.uniqueID) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per uniqueID non valido', t.NumeroFrame2, t.MappaOGrafico2);
      logConsole('Mistral Flow Segment esco 3');

      return;
    } */

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
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR: Mistral Rbc-Ixl ESCO 2');
        }
        t.lastCallMR[t.NumeroFrame2] = '';
        // logConsole('Mistral Flow Segment esco 3');
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
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR: Mistral Rbc-Ixl ESCO 1');
          }
          t.lastCallMR[t.NumeroFrame2] = '';
          logConsole('Mistral Flow Segment esco 4');
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

    let filtroMQ = t.filterSelectedMQ ? t.filterSelectedMQ : null;
    if (filtroMQ !== null) {
      if (this.isJson(filtroMQ)) {
        // filtroMQ = this.toBase64(filtroMQ);
      }
    }

    let filtroDaPassare = null;
    if (!t.isStandAloneMR2) {
      filtroDaPassare = filtroMQ
    } else {
      if (!t.parametriR12[t.NumeroFrame2]) {
        t.parametriR12[t.NumeroFrame2] = JSON.parse(JSON.stringify(t.parametriR22));
      }
      filtroDaPassare = {
        route: t.parametriR12[t.NumeroFrame2].v_filter_route, 
        line: this.splittaStringa(t.parametriR12[t.NumeroFrame2].v_filter_line),
        from: this.splittaStringa(t.parametriR12[t.NumeroFrame2].v_filter_from), 
        to: this.splittaStringa(t.parametriR12[t.NumeroFrame2].v_filter_to), 
        uniqueid: this.splittaStringa(t.parametriR12[t.NumeroFrame2].v_unique_id), 
        cdn_status: this.splittaStringa(t.parametriR12[t.NumeroFrame2].v_filter_cdn_status),
        cdn_info: this.splittaStringa(t.parametriR12[t.NumeroFrame2].v_filter_cdn_info), 
        id: this.splittaStringa(t.parametriR12[t.NumeroFrame2].v_filter_id),
        flow_type: this.splittaStringa(t.parametriR12[t.NumeroFrame2].v_filter_flow_type),
        from_tms: sInizio,
        to_tms: sFine
      }
      filtroDaPassare = JSON.stringify(filtroDaPassare);
    }

    const params = {
      v_cntx_id: t.sessionID2,
      v_filter: filtroDaPassare,
      v_stand_alone: t.isStandAloneMR2 === true ? 'Y' : 'N',
      v_limit: t.parametriR12[t.NumeroFrame2].v_max_rows ? t.parametriR12[t.NumeroFrame2].v_max_rows : 5000
    };

    // logConsole('Mistral Flow Segment', params);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
    const propertyName = '';

    logConsole('Mistral Flow Segment params', params);

    const actualCall = JSON.stringify(params) + ';' + t.columnsSettings + ';' +
      propertyName;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF: Mistral Flow 2 ', t.NumeroFrame, actualCall);
    }

    if (t.datiMistralFS && typeof(t.datiMistralFS) === 'string') {
      if (t.datiMistralFS.indexOf('ERROR: ') > -1) {
        t.datiMistralFS = undefined;
        t.lastCallMF[t.NumeroFrame2] = undefined;
      }
    }

    // logConsole('Cell measure 6', actualCall);
    // logConsole('Cell measure 6 Accendo rotella');
    t.caricamentoMF[t.NumeroFrame2] = true;
    // logConsole("Actual call", actualCall, t.lastCallMF[t.NumeroFrame2]);
    if (actualCall !== t.lastCallMF[t.NumeroFrame2]) {
      t.lastCallMF[t.NumeroFrame2] = actualCall;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF: Mistral Flow Grid', t.NumeroFrame, params);
      }

      t.effettuaAutoFitMF = false;

      // logConsole('Chiamata CM', daDove, params);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
      t.erroreMistralFS[t.NumeroFrame2] = '';
      
      t.chiSonoMF[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params['v_caller_tag'] = t.chiSonoMF[t.NumeroFrame2];
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'mistral_flow_segment_to_dispatch__grid';

      // logConsole('Cell measure 7');
      t.lastCallMF2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'mistral_flow_segment_to_dispatch__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))      
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (!t.controllaRitornoChiamata(t, data2, 'MistralFlow')) {
          // t.caricamentoMF[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 1');
          return;
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

        t.caricamentoMF[t.NumeroFrame2] = false;

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningFS = data2.v_grid_msg;
        } else {
          t.messaggioWarningFS = '';
        }

        t.lookUpTable2 = data2.lookup_table;

        if (data2.message || data2.failure_reason) {
          if (data2.message) {
            t.erroreMistralFS[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          } else {
            t.erroreMistralFS[t.NumeroFrame2] = 'ERROR: ' + data2.err_code + '-' + data2.failure_reason;
          }

          t.datiMistralFS = undefined;
          t.lastCallMF[t.NumeroFrame2] = '';
          // logConsole('Cell measure 6 Spengo rotella 2');

          // logConsole('Cell measure 8');
          return;
        } else {
          const dcm = data2;
          /* dcm = JSON.stringify(dcm);
          dcm = ExternalUtilities.effettuaReplace(dcm, 'row id', 'ROW_ID');
          dcm = JSON.parse(dcm); */

          if (t.vecchidatiMistralFS) {
            if (JSON.stringify(t.vecchidatiMistralFS.ColumnProperty) !== JSON.stringify(dcm.ColumnProperty)) {
              // logConsole('Pulisco Dati MF');
              t.datiMistralFS = undefined;
            }
          }

          if (t.datiMistralFS !== undefined && t.datiMistralFS !== null && t.datiMistralFS.DataTable &&
            t.datiMistralFS.DataTable.length > 0 && t.datiMistralFS !== 'empty grid' && dcm.DataTable) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF da aggiornare', dcm);
              }

              t.datiMistralFS.DataTable = dcm.DataTable;
              // t.impostaPaginaCME = 0;
              // logConsole('Aggiorno Dati MF');
              // logConsole('Cell measure 9');
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MF da impostare', dcm);
            }

            // t.datiMistralFS = undefined;
            t.datiMistralFS = undefined;
            const tm = setTimeout(() => {
              clearTimeout(tm);

              t.datiMistralFS = dcm;
              t.effettuaAutoFitMF = !t.effettuaAutoFitMF; // !t.effettuaAutoFitMF;
              t.impostaPaginaCME = 0;

              // logConsole('Cell measure 10');
              // logConsole('Creo Dati MF');
            }, 500);
          }

          t.vecchidatiMistralFS = dcm;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati letti CM', t.datiMistralFS);
          }
          // logConsole('Cell measure 6 Spengo rotella 3');
          // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiMistralFS, error);
        t.datiMistralFS = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);

        t.lastCallMF[t.NumeroFrame2] = '';
        
        t.caricamentoMF[t.NumeroFrame2] = false;
        // logConsole('Cell measure 6 Spengo rotella 4');
        // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        // logConsole('Cell measure 11');
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati vecchi CM', t.vecchidatiMistralFS);
      }
      // logConsole('Cell measure 12'); */

      /* t.datiMistralFS = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // logConsole('Cell measure 12');
        t.datiMistralFS = t.vecchidatiMistralFS;
      }, 100); */
      // t.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
    //   t.caricamentoMF[t.NumeroFrame2] = false;
      // logConsole('Cell measure 6 Spengo rotella 5');
      t.caricamentoMF[t.NumeroFrame2] = false;
    }
  }

  isJson(str: string): boolean {
    if (!str || typeof str !== 'string') {
      return false;
    }

    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  splittaStringa(e) {
    if (e) {
      if (e.indexOf(',') > -1) {
        const ee = e.split(',');
        let rit = '';
        ee.forEach(element => {
          rit = rit + '"' + element.trim() + '",';
        });
        const rit2 = '[' + rit.substring(0, rit.length - 1) + ']';
        // logConsole('Splitta stringa', e, rit2);
        return JSON.parse(rit2);
      } else {
        const rit = '[ "' + e + '" ]';
        return JSON.parse(rit);
      }
    } else {
      const rit = '[]';
      return JSON.parse(rit);
    }
  }
}

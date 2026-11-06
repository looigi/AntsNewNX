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
export class MistralGridComponent {
  // lastCallMC = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

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

    t.erroreMistralCDR[t.NumeroFrame2] = '';
    t.lastCallMC[t.NumeroFrame2] = '';
    t.datiMistralCDR = undefined; // 'empty grid';
    t.vecchiDatiMistralCDR = undefined;
    // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;

    const nome = 'gridMistralGrid_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  caricaMC(t, daDove) {
    /* const ora = new Date().getTime();
    if (ora - this.lastCM < 5000) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CM. Esco per troppo veloce');

      return;
    }
    this.lastCM = ora; */
    // logConsole('Cell measure 1');

    // if (!t.frameVisible2) {
    //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

    //   return;
    // }

    if (t.MappaOGrafico !== 'M2') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Cell Measure', t.NumeroFrame2, t.MappaOGrafico2);

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
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MC2: Mistral Grid ESCO 2');
        }
        t.lastCallMC[t.NumeroFrame2] = '';
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
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MC2: Mistral Grid ESCO 1');
          }
          t.lastCallMC[t.NumeroFrame2] = '';
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

    if (!sInizio || !sFine) {
      return;
    }
    
    const params = {
      v_cntx_id: t.sessionID2,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_mode: t.viewModeMS2 ? t.viewModeMS2 : null,
    };

    // logConsole('Cell measure 5', params);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
    const propertyName = '';

    const actualCall = JSON.stringify(params) + ';' + filtro + ';' +
      propertyName;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MC2: Mistral Grid 2 ', t.NumeroFrame, actualCall);
    }

    if (t.datiMistralCDR && typeof(t.datiMistralCDR) === 'string') {
      if (t.datiMistralCDR.indexOf('ERROR: ') > -1) {
        t.datiMistralCDR = undefined;
        t.lastCallMC[t.NumeroFrame2] = undefined;
      }
    }

    // logConsole('Cell measure 6', actualCall);
    // logConsole('Cell measure 6 Accendo rotella');
    t.caricamentoMC[t.NumeroFrame2] = true;
    if (actualCall !== t.lastCallMC[t.NumeroFrame2]) {
      t.lastCallMC[t.NumeroFrame2] = actualCall;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MC2: Mistral Grid', t.NumeroFrame, params);
      }

      t.effettuaAutoFitMC = false;

      // logConsole('Chiamata CM', daDove, params);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
      t.erroreMistralCDR[t.NumeroFrame2] = '';
      
      t.chiSonoMC[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      // params['v_caller_tag'] = t.chiSonoMC[t.NumeroFrame2];
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'mistral_cdr__grid';

      // logConsole('Cell measure 7');
      this.apiService.chiamataPost(t.Utils, 'mistral_cdr__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))      
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        /* if (!t.controllaRitornoChiamata(t, data2, 'MistralGrid')) {
          t.caricamentoMC[t.NumeroFrame2] = false;
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
          t.messaggioWarningM2 = data2.v_grid_msg;
        } else {
          t.messaggioWarningM2 = '';
        }

        if (data2.message || data2.failure_reason) {
          if (data2.message) {
            t.erroreMistralCDR[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          } else {
            t.erroreMistralCDR[t.NumeroFrame2] = 'ERROR: ' + data2.err_code + '-' + data2.failure_reason;
          }

          t.datiMistralCDR = undefined;
          t.lastCallMC[t.NumeroFrame2] = '';

          t.caricamentoMC[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 2');

          // logConsole('Cell measure 8');
          return;
        } else {
          const dcm = data2;
          /* dcm = JSON.stringify(dcm);
          dcm = ExternalUtilities.effettuaReplace(dcm, 'row id', 'ROW_ID');
          dcm = JSON.parse(dcm); */

          if (t.vecchidatiMistralCDR) {
            if (JSON.stringify(t.vecchidatiMistralCDR.ColumnProperty) !== JSON.stringify(dcm.ColumnProperty)) {
              // logConsole('Pulisco Dati MC2');
              t.datiMistralCDR = undefined;
            }
          }

          if (t.datiMistralCDR !== undefined && t.datiMistralCDR !== null && t.datiMistralCDR.DataTable &&
            t.datiMistralCDR.DataTable.length > 0 && t.datiMistralCDR !== 'empty grid' && dcm.DataTable) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MC2 da aggiornare', dcm);
              }

              t.datiMistralCDR.DataTable = dcm.DataTable;
              // t.impostaPaginaCME = 0;
              // logConsole('Aggiorno Dati MC2');
              // logConsole('Cell measure 9');
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MC2 da impostare', dcm);
            }

            // t.datiMistralCDR = undefined;
            t.datiMistralCDR = undefined;
            const tm = setTimeout(() => {
              clearTimeout(tm);

              t.datiMistralCDR = dcm;
              t.effettuaAutoFitMC = !t.effettuaAutoFitMC; // !t.effettuaAutoFitMC;
              t.impostaPaginaCME = 0;

              // logConsole('Cell measure 10');
              // logConsole('Creo Dati MC2');
            }, 500);
          }

          t.vecchidatiMistralCDR = dcm;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati letti CM', t.datiMistralCDR);
          }

          t.caricamentoMC[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 3');
          // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiMistralCDR, error);
        t.datiMistralCDR = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);

        t.lastCallMC[t.NumeroFrame2] = '';
        
        t.caricamentoMC[t.NumeroFrame2] = false;
        // logConsole('Cell measure 6 Spengo rotella 4');
        // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        // logConsole('Cell measure 11');
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati vecchi CM', t.vecchidatiMistralCDR);
      }
      // logConsole('Cell measure 12');

      /* t.datiMistralCDR = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // logConsole('Cell measure 12');
        t.datiMistralCDR = t.vecchidatiMistralCDR;
      }, 100); */
      // t.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
      t.caricamentoMC[t.NumeroFrame2] = false;
      // logConsole('Cell measure 6 Spengo rotella 5');
    }
  }
}

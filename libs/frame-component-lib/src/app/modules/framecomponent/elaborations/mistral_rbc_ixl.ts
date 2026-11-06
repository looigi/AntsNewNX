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
export class MistralRbcIxlComponent {
  // lastCallMQ = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  // staDisegnandoCellMeasures = [false, false, false, false, false, false, false, false, false, false, false]; // ,
  //     false, false, false, false, false, false, false, false, false, false, false];

  destroy$ = new FineRichieste();

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
  ) {
  }

  staEseguendoQuery = false;
  ultimaVoltaTMS = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    this.staEseguendoQuery = false;
    this.ultimaVoltaTMS[t.NumeroFrame2] = -1;
    t.erroreMistralMR[t.NumeroFrame2] = '';
    t.lastCallMR[t.NumeroFrame2] = '';
    t.datiMistralR = undefined; // 'empty grid';
    t.vecchidatiMistralR = undefined;
    // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;

    const nome = 'gridMistralMR_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  caricaMR(t, daDove) {
    // // logConsole('Dati MR: Carica MR', daDove);

    // if (!t.frameVisible2) {
    //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      // return;
    // }

    if (t.MappaOGrafico !== 'MR') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo rbc ixl', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS[t.NumeroFrame2] < t.ritardoPerFunzioni && this.ultimaVoltaTMS[t.NumeroFrame2] !== -1) {
      logConsole('Dati MR: Esco per query troppo veloce', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    this.ultimaVoltaTMS[t.NumeroFrame2] = ora;
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    /* if (this.staEseguendoQuery === true) {
      logConsole('Dati MR: Esco per query in corso', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    } */
    // // logConsole('Dati MR: Carica MR 2');

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

    // // logConsole('Dati MR: Carica MR 3');

    let agnact = '';

    if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = 'null';
    } else {
      if (ExternalUtilities.stringaAGNoACT !== undefined && ExternalUtilities.stringaAGNoACT !== null) {
        if (ExternalUtilities.stringaAGNoACT.indexOf('\'') === -1 && ExternalUtilities.stringaAGNoACT.indexOf('"') === -1) {
          agnact = '"' + ExternalUtilities.stringaAGNoACT + '"';
        } else {
          if (ExternalUtilities.stringaAGNoACT.indexOf('\'') > -1) {
            agnact = ExternalUtilities.stringaAGNoACT.replace('\'', '"').replace('\'', '"');
          } else {
            agnact = ExternalUtilities.stringaAGNoACT;
          }
        }
      } else {
        agnact = 'null';
      }
    }
    if (ExternalUtilities.stringaAGNoACT === undefined) {
      // t.datiPointActivityEvents = 'empty grid';
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR: Uscito da events 4', t.NumeroFrame);

      return;
    }

    // // logConsole('Dati MR: Carica MR 4', agnact);

    if (agnact === undefined || agnact === 'undefined') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR: Esco da events per agnact vuoto', agnact);

      return;
    }

    let valoreRicerca = agnact; //  ExternalUtilities.effettuaReplace(agnact, '\'', '');
    while (valoreRicerca.indexOf('\'') > -1) {
      valoreRicerca = valoreRicerca.replace('\'', '');
    }
    // valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '"', '');
    while (valoreRicerca.indexOf('"') > -1) {
      valoreRicerca = valoreRicerca.replace('"', '');
    }
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR: Valore agnact, ricerca', agnact, valoreRicerca);
  // }

    // // logConsole('Dati MR: Carica MR 5', valoreRicerca);
  // // logConsole('AGNACT', t.NumeroFrame2, valoreRicerca);

    if (!valoreRicerca || valoreRicerca === '') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR: Esco da events per valore ricerca vuoto');

      return;
    }

    let delta = null;
    // if (timeRangeAll !== true) {
    delta = t.Utils.tmsDelta;
    if (!delta || delta === undefined || delta === 'undefined' || delta === '"undefined"') {
      delta = null;
    }
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR: delta', delta);

    // if (delta !== null) {
    //   delta = '"' + delta + '"';
    // }

    // // logConsole('Dati MR: Carica MR 6', delta, t.parametriR);

    /* if (filtroMQ !== null) {
      if (this.isJson(filtroMQ)) {
        filtroMQ = JSON.stringify(filtroMQ);
      }
      // // logConsole('Dati MR: Filtro MQ', filtroMQ, typeof(filtroMQ));
    } */

    let filtroMQ = t.filterSelectedMQ ? t.filterSelectedMQ : null;
    if (filtroMQ !== null) {
      if (this.isJson(filtroMQ)) {
        // filtroMQ = this.toBase64(filtroMQ);
      }
    }
    // // logConsole('Dati MR: Filtro MQ', filtroMQ, typeof(filtroMQ));

    let filtroDaPassare = null;
    if (!t.isStandAloneMR2) {
      filtroDaPassare = filtroMQ
    } else {
      if (!t.parametriR1[t.NumeroFrame2]) {
        t.parametriR1[t.NumeroFrame2] = JSON.parse(JSON.stringify(t.parametriR2));
      }
      filtroDaPassare = {
        route: t.parametriR1[t.NumeroFrame2].v_filter_route, 
        line: this.splittaStringa(t.parametriR1[t.NumeroFrame2].v_filter_line),
        from: this.splittaStringa(t.parametriR1[t.NumeroFrame2].v_filter_from), 
        to: this.splittaStringa(t.parametriR1[t.NumeroFrame2].v_filter_to), 
        desc: this.splittaStringa(t.parametriR1[t.NumeroFrame2].v_filter_desc), 
        param: this.splittaStringa(t.parametriR1[t.NumeroFrame2].v_filter_param),
        value: this.splittaStringa(t.parametriR1[t.NumeroFrame2].v_filter_value), 
        idname: this.splittaStringa(t.parametriR1[t.NumeroFrame2].v_filter_idname),
        // flow_type: this.splittaStringa(t.flowTypeMS),
        from_tms: sInizio,
        to_tms: sFine
      }
      filtroDaPassare = JSON.stringify(filtroDaPassare);
    }

    const params = {
      v_cntx_id: t.sessionID2,
      v_act_set_name_list: valoreRicerca, 
      // v_tms_min: sInizio, 
      // v_tms_max: sFine, 
      v_tms_zero: delta,
      v_text_filter: null,
      v_tms_current: null,
      v_filter: filtroDaPassare,
      v_stand_alone: t.isStandAloneMR2 === true ? 'Y' : 'N',
      v_limit: t.parametriR1[t.NumeroFrame2].v_max_rows ? t.parametriR1[t.NumeroFrame2].v_max_rows : 5000
    };

    // // logConsole('Dati MR: Filtro MQ', params);

    // // logConsole('Dati MR: Parametri', params);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
    const propertyName = '';

    const actualCall = JSON.stringify(params) + ';' + t.columnsSettings + ';' +
      propertyName;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR: Mistral Rbc-Ixl 2 ', t.NumeroFrame, actualCall);
    }

    if (t.datiMistralR && typeof(t.datiMistralR) === 'string') {
      if (t.datiMistralR.indexOf('ERROR: ') > -1) {
        t.datiMistralR = undefined;
        t.lastCallMR[t.NumeroFrame2] = undefined;
      }
    }

    // logConsole('Cell measure 6', actualCall);
    // logConsole('RBCIXL Accendo rotella');
    // logConsole('Dati MR: Accendo rondella');
    if (actualCall !== t.lastCallMR[t.NumeroFrame2]) {
      this.staEseguendoQuery = true;
      t.caricamentoMR[t.NumeroFrame2] = true;
      t.lastCallMR[t.NumeroFrame2] = actualCall;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR: Mistral Rbc-Ixl', t.NumeroFrame, params);
      }

      t.effettuaAutoFitMR = false;

      // logConsole('Chiamata CM', daDove, params);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
      t.erroreMistralMR[t.NumeroFrame2] = '';
      
      t.chiSonoMR[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params['v_caller_tag'] = t.chiSonoMR[t.NumeroFrame2];

      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'mistral_rbcixl_message__grid';

      // logConsole('Cell measure 7');
      t.lastCallMR2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'mistral_rbcixl_message__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))      
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (!t.controllaRitornoChiamata(t, data2, 'MistralRBCIXL')) {
          t.caricamentoMR[t.NumeroFrame2] = false;
          // logConsole('Cell measure 6 Spengo rotella 1');
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR: Uscita per controllo ritorno chiamata');
          return;
        }

        if (data2 === null) {
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
        if (data2.message || data2.failure_reason) {
          if (data2.message) {
            t.erroreMistralMR[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          } else {
            t.erroreMistralMR[t.NumeroFrame2] = 'ERROR: ' + data2.err_code + '-' + data2.failure_reason;
          }

          t.datiMistralR = undefined;
          t.lastCallMR[t.NumeroFrame2] = '';

          logConsole('RBCIXL Spengo rotella 1');
          this.staEseguendoQuery = false;
          t.caricamentoMR[t.NumeroFrame2] = false;
          // logConsole('Dati MR: spengo rondella 4');
          // logConsole('Cell measure 6 Spengo rotella 2');

          // logConsole('Cell measure 8');
          t.messaggioWarningR = '';
          return;
        } else {
          const dcm = data2;
          /* dcm = JSON.stringify(dcm);
          dcm = ExternalUtilities.effettuaReplace(dcm, 'row id', 'ROW_ID');
          dcm = JSON.parse(dcm); */

          if (dcm.v_grid_msg !== undefined) {
            t.messaggioWarningR = dcm.v_grid_msg;
          } else {
            t.messaggioWarningR = '';
          }

          if (t.vecchidatiMistralR) {
            if (JSON.stringify(t.vecchidatiMistralR.ColumnProperty) !== JSON.stringify(dcm.ColumnProperty)) {
              // logConsole('Pulisco Dati MF');
              t.datiMistralR = undefined;
            }
          }

          t.lookUpTable1 = dcm.lookup_table;

          if (t.datiMistralR !== undefined && t.datiMistralR !== null && t.datiMistralR.DataTable &&
            t.datiMistralR.DataTable.length > 0 && t.datiMistralR !== 'empty grid' && dcm.DataTable) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR da aggiornare', t.datiMistralR, dcm);
              }

              t.datiMistralR.DataTable = dcm.DataTable;
              // t.impostaPaginaCME = 0;
              // logConsole('Aggiorno Dati MF');
              // logConsole('Cell measure 9');
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati MR da impostare', dcm);
            }

            // t.datiMistralR = undefined;
            t.datiMistralR = undefined;
            const tm = setTimeout(() => {
              clearTimeout(tm);

              t.datiMistralR = dcm;
              t.effettuaAutoFitMR = !t.effettuaAutoFitMR; // !t.effettuaAutoFitMR;
              t.impostaPaginaCME = 0;

              // logConsole('Cell measure 10');
              // logConsole('Creo Dati MF');
            }, 500);
          }

          t.vecchidatiMistralR = dcm;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati letti MR', t.datiMistralR);
          }

          logConsole('RBCIXL Spengo rotella 2');
          this.staEseguendoQuery = false;
          t.caricamentoMR[t.NumeroFrame2] = false;
          // logConsole('Dati MR: spengo rondella 3');
          // logConsole('Cell measure 6 Spengo rotella 3');
          // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiMistralR, error);
        t.datiMistralR = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        t.erroreMistralMR[t.NumeroFrame2] = t.datiMistralR;  
        
        t.lastCallMR[t.NumeroFrame2] = '';
        
        logConsole('RBCIXL Spengo rotella 3');
        this.staEseguendoQuery = false;
        t.caricamentoMR[t.NumeroFrame2] = false;
        // logConsole('Dati MR: spengo rondella 1');
        // logConsole('Cell measure 6 Spengo rotella 4');
        // this.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
        // logConsole('Cell measure 11');
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati vecchi MR', t.vecchidatiMistralR);
      }
      // logConsole('Cell measure 12');
      logConsole('RBCIXL Spengo rotella 4');
      this.staEseguendoQuery = false;
      // t.caricamentoMR[t.NumeroFrame2] = false;

      /* t.datiMistralR = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // logConsole('Cell measure 12');
        t.datiMistralR = t.vecchidatiMistralR;
      }, 100); */
      // t.staDisegnandoCellMeasures[t.NumeroFrame2] = false;
      // t.caricamentoMR[t.NumeroFrame2] = false;
      // logConsole('Dati MR: spengo rondella 2');
      // logConsole('Cell measure 6 Spengo rotella 5');
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

  toBase64(text: string): string {
    return btoa(
      new TextEncoder()
        .encode(text)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
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

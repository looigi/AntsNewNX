import { ExternalApiService } from './../services/externalapi.service';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';
// import { environment } from '../../../../environments/environment.prod';

// import { SessionService } from '../../../../db/session.service';
// import Utils from '../Utilities.component';

@Injectable()
export class CDRVoiceComponent {
  // lastCallCDVoice = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']

  destroy$ = new FineRichieste();

  staDisegnandoCDRVoice = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false, false, false];

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.erroreCDV[t.NumeroFrame2] = '';
    t.lastCallCDVoice[t.NumeroFrame2] = '';
    t.datiCdrSummary = 'empty grid';
    t.datiCdrVoice = 'empty grid';
    t.vecchiDatiCDV = undefined;
    this.staDisegnandoCDRVoice[t.NumeroFrame2] = false;

    const nome = 'gridCdrSummary_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }

    const nome2 = 'gridCdrSummaryV_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento2 = document.getElementById(nome2) as HTMLElement;
    if (elemento2) {
      elemento2.outerHTML = '';
      elemento2.innerHTML = '';
      elemento2.remove();
    }
  }

  caricaCDRVoice(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'CV') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo CDR Voice', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prende CDR Voice', t.NumeroFrame, t.timeFilter, t.Utils.tmsSelezionato);

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /* let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'CV' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco 0 da cdr voice', t.MappaOGrafico2);
      }
      return;
    } */

    /* if (t.MappaOGrafico2 !== 'CV' || this.staDisegnandoCellMeasures[t.NumeroFrame2] === true) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco 0 da cdr voice', t.MappaOGrafico2, this.staDisegnandoCellMeasures[t.NumeroFrame2]);
      }
      // t.datiCellMeasure = 'empty grid';
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'esco 1');
      return;
    } */

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.datiTipiActivity);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.sceltaActivityDaSet);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.listaActivityName2);

    /* let act_id = '';
    if (t.Activity2 === 0) { // LATEST SELECTION
      let conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (t.Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            t.Utils.sceltaActivityDaSet[conta2].forEach(element2 => {
              act_id += element2.ID + ',';
            });
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL
        let q = 0;
        t.listaActivityName2.forEach(element => {
          if (element && element !== null && t.Utils.sceltaActivityDaSet[q]) {
            t.Utils.sceltaActivityDaSet[q].forEach(element2 => {
              act_id += element2.ID + ',';
            });
          }
          q++;
        });
      } else {
        const n = t.Activity2;

        if (t.Utils && t.Utils !== null && t.Utils.sceltaActivityDaSet[n]) {
          t.Utils.sceltaActivityDaSet[n].forEach(element => {
            act_id += element.ID + ',';
          });
        }
      }
    }
    if (act_id.length > 1) {
      act_id = act_id.substring(0, act_id.length - 1);
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_id);

    // const act_id = t.Utils.prendeActivitySceltaCellMeasures(t);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, act_set);
    */

    // if (t.Activity2 === -1) {
    //   t.Activity2 = 1; // IMPOSTATO PERCHE' IN QUESTA MASCHERA ERA SEMPRE -1... RICONTROLLARE IN FUTURO
    // }

    let agnact = '';
    if (t.tipoDataset2 === 1) {
      if (!t.act_set || t.act_set === '') {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR Data. ACT SET Vuoto. Esco', t.NumeroFrame2);
        }
        t.datiCellMeasure = 'empty grid';
        return;
      }
    } else {
      if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
        agnact = 'null';
      } else {
        if (ExternalUtilities.stringaAGNoACT === undefined) {
          t.datiCellMeasure = 'empty grid';
          return;
        }
        if (ExternalUtilities.stringaAGNoACT.indexOf('\'') === -1) {
          agnact = '\'' + ExternalUtilities.stringaAGNoACT + '\'';
        } else {
          agnact = ExternalUtilities.stringaAGNoACT;
        }
      }
    }

    // const tms = t.Utils.tmsSelezionato;

    let sInizio = '';
    let sFine = '';
    let filtro = '';

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.tmsSelezionato, t.Utils.rangeDiSecondiPerMille);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.timeFilter, t.timeFilter2);
    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      if (t.Utils.tmsInizioCDR && t.Utils.tmsFineCDR) {
        sInizio = t.Utils.tmsInizioCDR; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
        sFine = t.Utils.tmsFineCDR; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
        filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time Range', sInizio, sFine);
      } else {
        // t.datiCellMeasure = 'empty grid';
        return;
      }
    } else {
      if (t.timeFilter === 3 || t.timeFilter2 === 'Fixed Seconds') {
        if (t.Utils.tmsSelezionato) {
          const vecchioRange = t.Utils.lastRangeCDRVoice[t.frameAttivo][t.NumeroFrame];
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
            t.Utils.lastRangeCDRVoice[t.frameAttivo][t.NumeroFrame] = a;
          }
        } else {
          // t.datiCellMeasure = 'empty grid';
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

    if (sInizio === undefined) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR Voice. tms Inizio Vuoto. Esco', t.NumeroFrame2);
      }
      t.datiCdrVoice = 'empty grid';
      return;
    }
    if (sFine === undefined) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR Voice. tms Fine Vuoto. Esco', t.NumeroFrame2);
      }
      t.datiCdrVoice = 'empty grid';
      return;
    }

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
    } */

    const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

    let as = ExternalUtilities.effettuaReplace(t.act_set, '"', '');
    as = ExternalUtilities.effettuaReplace(as, '\'', '');
    let valoreRicerca = as;
    if (t.tipoDataset === 2) {
      as = ExternalUtilities.effettuaReplace(agnact, '"', '');
      as = ExternalUtilities.effettuaReplace(as, '\'', '');
      valoreRicerca = as;
    }

    const params = {
      cntx_id: t.sessionID2,
      v_act_set_name_list: valoreRicerca,
      // v_event_type_list: eventi,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_filter_group_by: t.filterGroupByCDR,
      v_bbox: geoFilter
    };

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
    const propertyName = '';
    const actualCall = valoreRicerca + ';' + JSON.stringify(params) + ';' + filtro + ';' + eventi + ';' + t.columnsSettings + ';' +
      propertyName;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR VOICE:', params);

    if (t.datiCdrSummary && typeof(t.datiCdrSummary) === 'string') {
      if (t.datiCdrSummary.indexOf('ERROR: ') > -1) {
        t.datiCdrSummary = undefined;
        t.datiCdrVoice = undefined;
        t.lastCallCDVoice[t.NumeroFrame2] = undefined;
      }
    }

    if (actualCall !== t.lastCallCDVoice[t.NumeroFrame2]) {
      t.lastCallCDVoice[t.NumeroFrame2] = actualCall;

      this.staDisegnandoCDRVoice[t.NumeroFrame2] = true;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR Voice', t.NumeroFrame, params);
      }

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Leggo cdr voice');
      t.caricamentoCdrVoiceInCorso[t.NumeroFrame2] = true;
      t.erroreCDV[t.NumeroFrame2] = '';
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'geo_cdr_voice__grid';

      t.lastCallCDVoice2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_cdr_voice__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningCdrV = data2.v_grid_msg;
        } else {
          t.messaggioWarningCdrV = '';
        }

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningCdrS = data2.v_grid_msg;
        } else {
          t.messaggioWarningCdrS = '';
        }

        if (data2.message) {
          t.erroreCDV[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;

          t.datiCdrSummary = undefined;
          t.datiCdrVoice = undefined;

          t.caricamentoCdrVoiceInCorso[t.NumeroFrame2] = false;
          this.staDisegnandoCDRVoice[t.NumeroFrame2] = false;
        } else {
          if (data2 && data2 !== null && data2[1] && data2[1].GridProperty && data2[1].GridProperty[0]) {
            t.gridTitleCdrV = data2[1].cdr.GridProperty[0].GridName;
          }

          let dCD = undefined;
          let dCS = undefined;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data[0].summary.DataTable);
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data[1].cdr.DataTable);
          // try {
          dCS = data2[0].summary;
          dCD = data2[1].cdr;

          t.vecchiDatiCDV = data2;

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, dCD);
          // } catch (e) {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore parse', data);
          // }

          if (t.datiCdrSummary && t.datiCdrSummary !== 'empty grid' && t.datiCdrSummary.DataTable
            && dCS.DataTable) {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiorna CDV');
            t.datiCdrSummary.DataTable = dCS.DataTable;

            // t.caricamentoCdrVoiceInCorso = false;
            // this.staDisegnandoCellMeasures = false;
          } else {
            t.datiCdrSummary = undefined;
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Creo CDV');
            const tm = setTimeout(() => {
          clearTimeout(tm);
              t.datiCdrSummary = dCS;
              t.effettuaAutoFitCS = !t.effettuaAutoFitCS;
              t.impostaPaginaCDRS = 0;

              // t.caricamentoCdrVoiceInCorso = false;
              // this.staDisegnandoCellMeasures = false;
            }, 1000);
          }

          if (t.datiCdrVoice && t.datiCdrVoice !== 'empty grid' && t.datiCdrVoice.DataTable) {
            t.datiCdrVoice.DataTable = dCD.DataTable;

            t.caricamentoCdrVoiceInCorso[t.NumeroFrame2] = false;
            this.staDisegnandoCDRVoice[t.NumeroFrame2] = false;
          } else {
            t.datiCdrVoice = undefined;
            const tm = setTimeout(() => {
          clearTimeout(tm);
              t.datiCdrVoice = dCD;
              t.effettuaAutoFitCV = !t.effettuaAutoFitCV;
              t.impostaPaginaCV = 0;

              t.caricamentoCdrVoiceInCorso[t.NumeroFrame2] = false;
              this.staDisegnandoCDRVoice[t.NumeroFrame2] = false;
            }, 1000);
          }
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiCdrSummary, error);
        // ExternalUtilities.messaggioDiErrore(t.datiCdrVoice, error);
        t.datiCdrSummary = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        t.datiCdrVoice = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);

        t.lastCallCDVoice[t.NumeroFrame2] = '';
        
        t.caricamentoCdrVoiceInCorso[t.NumeroFrame2] = false;
        this.staDisegnandoCDRVoice[t.NumeroFrame2] = false;
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR Voice ridisegno vecchi dati', t.NumeroFrame, t.vecchiDatiCDV);
      }

      const dCS = t.vecchiDatiCDV[0].summary;
      const dCD = t.vecchiDatiCDV[1].cdr;

      t.datiCdrSummary = undefined;
      t.datiCdrVoice = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiCdrSummary = dCS;
        t.datiCdrVoice = dCD;
      }, 1000);

      t.caricamentoCdrVoiceInCorso[t.NumeroFrame2] = false;
      this.staDisegnandoCDRVoice[t.NumeroFrame2] = false;
    }
  }
}

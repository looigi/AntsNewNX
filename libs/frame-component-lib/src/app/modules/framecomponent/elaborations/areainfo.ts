import { logConsole } from '../console-log';
import { environment } from './../../../../environments/environment';
import { ExternalApiService } from './../services/externalapi.service';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';
// import Utils from '../Utilities.component';

@Injectable()
export class AreaInfoComponent {
  // lastCallAreaInfo = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCall1 = ['', '', '', '', '', '', '', '', '', '',  ''];
  // lastCall2 = ['', '', '', '', '', '', '', '', '', '',  ''];

  destroy$ = new FineRichieste();

  staElaborandoAI = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false];
  vecchieColumnProperty;

  constructor(
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.lastCallAreaInfo[t.NumeroFrame2] = '';
    t.datiAreaInfo = 'empty grid';
    t.vecchiDatiAreaInfo = undefined;
    t.erroreAreaInfo[t.NumeroFrame2] = '';
    this.vecchieColumnProperty = '';
    this.staElaborandoAI[t.NumeroFrame2] = false;

    const nome = 'gridAreaInfo_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  disegnaAreaInfo(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'AI') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Area Info', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Entro in area info', t.NumeroFrame2);
    }

    /* if (this.staElaborandoAI[t.NumeroFrame2] === true) {
      return;
    } */

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

    // const agnact = '[AGN GROUP] Aubay';
    // if (t.Activity2 === -1) {
    //   t.Activity2 = 1; // IMPOSTATO PERCHE' IN QUESTA MASCHERA ERA SEMPRE -1... RICONTROLLARE IN FUTURO
    // }

    let agnact = '';
    if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = 'null';
    } else {
      if (ExternalUtilities.stringaAGNoACT.indexOf('\'') === -1) {
        agnact = '\'' + ExternalUtilities.stringaAGNoACT + '\'';
      } else {
        agnact = ExternalUtilities.stringaAGNoACT;
      }
    }
    let valoreRicerca = t.act_set;
    // if (t.tipoDataset2 === 2) {
    //   valoreRicerca = agnact;
    // }
    let q = 0;
    const f = setInterval(() => {
      if (t.act_set && t.act_set !== '' ) {
        clearInterval(f);
        valoreRicerca = t.act_set;
        this.continuaDisegnaInfoGrid(t, agnact, valoreRicerca, sla);
      } else {
        q++;
        if (q > 10) {
          clearInterval(f);
        }
      }
    }, 1000);
  }

  continuaDisegnaInfoGrid(t, agnact, valoreRicerca, sla) {
    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Act set area', t.act_set, agnact, t.ActivityName2);
    // }

    if (!valoreRicerca || valoreRicerca === 'undefined' || valoreRicerca === '\'undefined\'') {
      this.staElaborandoAI[t.NumeroFrame2] = false;
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Area info. Esco per act set vuoto');
      // }
      return;
    }

    let sInizio = '';
    let sFine = '';

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time range Area info', t.timeFilter, t.timeFilter2);
    // }

    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      // if (!t.Utils.tmsSelezionato || t.Utils.tmsSelezionato === null || t.Utils.tmsSelezionato === '') {
      //   return;
      // }

      sInizio = t.Utils.tmsInizio;
      sFine = t.Utils.tmsFine;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time range Area info 2: ', sInizio, sFine);
    } else {
      sInizio = t.timeRangeDSFStart2;
      sFine = t.timeRangeDSFStop2;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time range Area info Altro: ', sInizio, sFine);
    }
    if (!sInizio || sInizio === '' || sInizio === null || sInizio === '"undefined"') {
      this.staElaborandoAI[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Area info esco per tms inizio vuoto');

      return;
    }
    if (!sFine || sFine === '' || sFine === null || sFine === '"undefined"') {
      this.staElaborandoAI[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Area info esco per tms fine vuoto');
      return;
    }

    const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

    // FILTER
    const filtri = ExternalUtilities.prendeFiltri(t, true, 'AreaInfo');
    const cm1 = filtri.cm1;
    const cm2 = filtri.cm2;
    const tf1 = filtri.tf1;
    const tf2 = filtri.tf2;
    // FILTER
    
    const event = t.correlation2;
    let event2 = '';

    const misura = ExternalUtilities.ritornaMisura(t, event, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Area Info');
    event2 = misura;

    /* if (event && (event.indexOf('<GLOBAL MEASURE>') > -1 || (event.indexOf('global_measure') > -1 && event.indexOf('global_measure_') === -1))) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ricerca misura globale', t.Utils.globalMeasure, t.Utils.globalMeasure.MEASR_CODE);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.measureData2);
      t.measureData2.forEach(element2 => {
        if (t.Utils.globalMeasure && element2.CODE === t.Utils.globalMeasure.MEASR_CODE) {
          const m = element2.CODE.replace('"', '').replace('"', '');
          event2 = event.replace('<GLOBAL MEASURE>', m).replace('global_measure', m);
        }
      });
    } else {
      if (event && (event.indexOf('<GLOBAL CHECKED MEASURE ') > -1 || event.indexOf('global_measure_') > -1)) {
        let indice;
        if (event.indexOf('<GLOBAL CHECKED MEASURE ') > -1) {
          indice = +(event.replace('<GLOBAL CHECKED MEASURE ', '').replace('>', ''));
        } else {
          indice = +(event.replace('global_measure_', ''));
        }

        if (indice && indice > 0 && ExternalUtilities.misureGlobali) {
          if (ExternalUtilities.misureGlobali[indice - 1]) { // !== '') {
            let cosa;
            if (ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE']) {
              cosa = ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE'];
            } else {
              cosa = ExternalUtilities.misureGlobali[indice - 1];
            }
            // Modifica 25/02/2025
            // event2 = cosa;
            event2 = event.replace('global_measure_' + indice, cosa).replace('<GLOBAL CHECKED MEASURE ' + indice + '>', cosa);
          } else {
            event2 = '';
          }
        } else {
          event2 = '';
        }
      } else {
        event2 = event;
      }
    } */
    // logConsole('Correlation on change', event, event2);
    if (!event2) {
      this.staElaborandoAI[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Area info esco per correlation vuoto');
      return;
    }

    let misureDaPassare = '';

    t.Measure.forEach(element => {
      const misura = ExternalUtilities.ritornaMisura(t, element, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Gestione Grafici 1');
      if (misura) {
        misureDaPassare += misura + ',';
      }
    });
    if (misureDaPassare.length > 0) {
      misureDaPassare = misureDaPassare.substring(0, misureDaPassare.length - 1);
    } else {
      misureDaPassare = 'ALL';
    }

    const params = {
      cntx_id: t.sessionID2,
      // v_caller_tag: t.chiSonoAreaInfo[t.NumeroFrame2],
      v_act_set_name_list: valoreRicerca,
      v_measr_code_list: misureDaPassare,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_geo_sla_name: sla,
      v_bbox: geoFilter,
      v_filter_measr_code_1: cm1,
      v_filter_measr_code_2: cm2,
      v_filter_measr_value_1: tf1,
      v_filter_measr_value_2: tf2,
      v_corr_measr_code_1: event2
    };
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno point info', params);

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const actualCall1 = 'AREAINFO;' + JSON.stringify(params) + ';' + valoriDiBase + ';';

    if (t.datiAreaInfo && typeof(t.datiAreaInfo) === 'string') {
      if (t.datiAreaInfo.indexOf('ERROR: ') > -1) {
        t.datiAreaInfo = undefined;
        t.lastCallAreaInfo[t.NumeroFrame2] = undefined;
      }
    }

    if (t.lastCallAreaInfo[t.NumeroFrame2] !== actualCall1) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Area Info', t.NumeroFrame, actualCall1);
      }
      t.lastCallAreaInfo[t.NumeroFrame2] = actualCall1;
      this.staElaborandoAI[t.NumeroFrame2] = true;
      t.caricamentoAreaInfo[t.NumeroFrame2] = true;

      t.chiSonoAreaInfo[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params['v_caller_tag'] = t.chiSonoAreaInfo[t.NumeroFrame2];
      t.erroreAreaInfo[t.NumeroFrame2] = '';
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'geo_area_info__grid';

      t.lastCallAreaInfo2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_area_info__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (!t.controllaRitornoChiamata(t, data2, 'Area Info')) {
          t.caricamentoAreaInfo[t.NumeroFrame2] = false;
          return;
        }

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningAI = data2.v_grid_msg;
        } else {
          t.messaggioWarningAI = '';
        }

        if (data2.message) {
          t.erroreAreaInfo[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          this.staElaborandoAI[t.NumeroFrame2] = false;
          t.caricamentoAreaInfo[t.NumeroFrame2] = false;
          t.datiAreaInfo = undefined;
        } else {
          if (data2.v_req_tms) {
            const ritorno = new Date(data2.v_req_tms);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno: ', ritorno);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia: ', t.timeStampChiamataTCRUN);
            if (t.timeStampChiamataAreaInfo && ritorno.getTime() < t.timeStampChiamataAreaInfo.getTime()) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AREAINFO: esco per query vecchia', ritorno, t.timeStampChiamataAreaInfo);
              }

              t.caricamentoAreaInfo[t.NumeroFrame2] = false;
              return;
            } else {
              t.timeStampChiamataAreaInfo = ritorno;
            }
          }

          if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
            t.gridTitle2AI = data2.GridProperty[0].GridName; // t.frameName = 
          }

          t.vecchiDatiAreaInfo = data2;

          this.staElaborandoAI[t.NumeroFrame2] = false;
          if (data2 && data2 !== null) {
            if (t.datiAreaInfo && t.datiAreaInfo.DataTable && data2.DataTable && JSON.stringify(data2.ColumnProperty) === this.vecchieColumnProperty) {
              t.datiAreaInfo.DataTable = data2.DataTable;
            } else {
              this.vecchieColumnProperty = JSON.stringify(data2.ColumnProperty);
              // t.datiAreaInfo = undefined;
              t.datiAreaInfo = undefined;
              const tm = setTimeout(() => {
                clearTimeout(tm);

                t.effettuaAutoFitAreaInfo = !t.effettuaAutoFitAreaInfo;
                t.datiAreaInfo = data2;
              }, 500);
            }
          }
            /*   t.effettuaAutoFitAI = !t.effettuaAutoFitAI;
            }
          } else {
            t.datiAreaInfo = undefined;
          } */
        }
        t.caricamentoAreaInfo[t.NumeroFrame2] = false;
      }, error => {
        this.staElaborandoAI[t.NumeroFrame2] = false;
        t.caricamentoAreaInfo[t.NumeroFrame2] = false;
        this.vecchieColumnProperty = '';
        t.lastCallAreaInfo[t.NumeroFrame2] = '';
        // ExternalUtilities.messaggioDiErrore(t.datiAreaInfo, error);
        t.datiAreaInfo = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AREAINFO: disegno vecchi dati', t.NumeroFrame2, t.vecchiDatiAreaInfo);
      }

      /* t.datiAreaInfo = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiAreaInfo = t.vecchiDatiAreaInfo;
      }, 500); */
      t.caricamentoAreaInfo[t.NumeroFrame2] = false;
      this.staElaborandoAI[t.NumeroFrame2] = false;
    }
  }
}

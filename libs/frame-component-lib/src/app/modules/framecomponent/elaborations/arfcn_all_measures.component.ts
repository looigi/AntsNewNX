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
export class ArfcnComponentAllMeasures {
  // lastCallArfcnAM = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCall1 = ['', '', '', '', '', '', '', '', '', '',  ''];
  // lastCall2 = ['', '', '', '', '', '', '', '', '', '',  ''];

  destroy$ = new FineRichieste();

  staElaborandoAM = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false];
  vecchieColumnProperty;

  constructor(
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.lastCallArfcnAM[t.NumeroFrame2] = '';
    t.datiArfcnAM = 'empty grid';
    t.vecchiDatiArfcnAM = undefined;
    t.erroreArfcnAM[t.NumeroFrame2] = '';
    this.vecchieColumnProperty = '';
    this.staElaborandoAM[t.NumeroFrame2] = false;

    const nome = 'gridArfcnAM_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  disegnaArfcn(t) {
    logConsole('arfcn AM grid 1', t.NumeroFrame2);
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'AA') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Arfcn AM', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Entro in Arfcn AM', t.NumeroFrame2);
    }

    /* if (this.staElaborandoAR[t.NumeroFrame2] === true) {
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

    logConsole('arfcn AM grid 2', t.NumeroFrame2);

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
        this.continuaDisegnaAM(t, agnact, valoreRicerca, sla);
      } else {
        q++;
        if (q > 10) {
          clearInterval(f);
        }
      }
    }, 1000);
  }

  continuaDisegnaAM(t, agnact, valoreRicerca, sla) {
    logConsole('arfcn AM grid 3', t.NumeroFrame2);

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Act set area', t.act_set, agnact, t.ActivityName2);
    // }

    if (!valoreRicerca || valoreRicerca === 'undefined' || valoreRicerca === '\'undefined\'') {
      this.staElaborandoAM[t.NumeroFrame2] = false;
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn AM. Esco per act set vuoto');
      // }

      logConsole('arfcn AM grid 3.1 ESCO', t.NumeroFrame2);
      return;
    }

    let sInizio = '';
    let sFine = '';

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time range Arfcn AM', t.timeFilter, t.timeFilter2);
    // }

    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      // if (!t.Utils.tmsSelezionato || t.Utils.tmsSelezionato === null || t.Utils.tmsSelezionato === '') {
      //   return;
      // }

      sInizio = t.Utils.tmsInizio;
      sFine = t.Utils.tmsFine;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time range Arfcn AM 2: ', sInizio, sFine);
      }
    } else {
      sInizio = t.timeRangeDSFStart2;
      sFine = t.timeRangeDSFStop2;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time range Arfcn AM Altro: ', sInizio, sFine);
      }
    }
    if (!sInizio || sInizio === '' || sInizio === null || sInizio === '"undefined"') {
      this.staElaborandoAM[t.NumeroFrame2] = false;
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn AM esco per tms inizio vuoto');
      }
      logConsole('arfcn AM grid 3.2 ESCO', t.NumeroFrame2);
      return;
    }
    if (!sFine || sFine === '' || sFine === null || sFine === '"undefined"') {
      this.staElaborandoAM[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn AM esco per tms fine vuoto');
      logConsole('arfcn AM grid 3.3 ESCO', t.NumeroFrame2);
      return;
    }

    logConsole('arfcn AM grid 4', t.NumeroFrame2, sInizio, sFine);

    const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

    // FILTER
    const filtri = ExternalUtilities.prendeFiltri(t, true, 'ArfcnAM');
    const cm1 = filtri.cm1;
    const cm2 = filtri.cm2;
    const tf1 = filtri.tf1;
    const tf2 = filtri.tf2;
    // FILTER
    
    /* const event = t.correlation2;
    let event2 = '';

    const misura = ExternalUtilities.ritornaMisura(t, event, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'ArfcnAM');
    event2 = misura;

    logConsole('arfcn AM grid 5', t.NumeroFrame2, misura);

    if (!event2) {
      this.staElaborandoAM[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn AM esco per correlation vuoto');
      // return;
    } */

    t.nessunClusterGrid = false;
    t.nessunClusterGridMisura = false;
    let qualeCluster = t.overlayCluster2;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn AM Grid: Quale cluster', qualeCluster);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno overlay Frame', t.NumeroFrame, qualeCluster, element2.CODE);
    if (qualeCluster === environment.stringaClusterGlobale) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn AM Grid: Cluster globale');

      if (t.clusterGlobale2 && t.clusterGlobale2.NAME !== '') {
        qualeCluster = t.clusterGlobale2.CODE;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prendo overlay globale', t.NumeroFrame, qualeCluster);
      } else {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn AM Grid: Esco per nessun cluster globale definito', t.clusterGlobale2);

        t.nessunClusterGrid = true;

        logConsole('arfcn AM grid 5.1 ESCO', t.NumeroFrame2);
        return;
      }
    }
    
    const params = {
      cntx_id: t.sessionID2,
      // v_caller_tag: t.chiSonoArfcn[t.NumeroFrame2],
      v_act_set_name_list: valoreRicerca,
      v_measr_code_list: 'ALL',
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_geo_sla_name: sla,
      v_bbox: geoFilter,
      v_filter_measr_code_1: cm1,
      v_filter_measr_code_2: cm2,
      v_filter_measr_value_1: tf1,
      v_filter_measr_value_2: tf2,
      v_cluster_set_name: qualeCluster,
      v_corr_measr_code_1: null // event2
    };
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno point info', params);

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const actualCall1 = 'ArfcnAM;' + JSON.stringify(params) + ';' + valoriDiBase + ';';

    if (t.datiArfcnAM && typeof(t.datiArfcnAM) === 'string') {
      if (t.datiArfcnAM.indexOf('ERROR: ') > -1) {
        t.datiArfcnAM = undefined;
        t.lastCallArfcnAM[t.NumeroFrame2] = undefined;
      }
    }

    logConsole('arfcn AM grid 6', t.NumeroFrame2, params);

    if (t.lastCallArfcnAM[t.NumeroFrame2] !== actualCall1) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ArfcnAM', t.NumeroFrame, actualCall1);
      }
      t.caricamentoArfcnAM[t.NumeroFrame2] = true;
      t.lastCallArfcnAM[t.NumeroFrame2] = actualCall1;
      this.staElaborandoAM[t.NumeroFrame2] = true;

      logConsole('arfcn AM grid 7', t.NumeroFrame2);

      t.chiSonoArfcnAM[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params['v_caller_tag'] = t.chiSonoArfcnAM[t.NumeroFrame2];
      t.erroreArfcnAM[t.NumeroFrame2] = '';
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'geo_arfcn_all_measures__grid';

      t.lastCallArfcnAM2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_arfcn_all_measures__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (!t.controllaRitornoChiamata(t, data2, 'ArfcnAM')) {
          // logConsole('Azzeramento flag arfcn 1', t.NumeroFrame2)
          t.caricamentoArfcnAM[t.NumeroFrame2] = false;
          return;
        }

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningARFCNAM = data2.v_grid_msg;
        } else {
          t.messaggioWarningARFCNAM = '';
        }

        if (data2.message) {
          t.erroreArfcnAM[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          this.staElaborandoAM[t.NumeroFrame2] = false;
          // logConsole('Azzeramento flag arfcn 2', t.NumeroFrame2)
          t.caricamentoArfcnAM[t.NumeroFrame2] = false;
          t.datiArfcnAM = undefined;
        } else {
          if (data2.v_req_tms) {
            const ritorno = new Date(data2.v_req_tms);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno: ', ritorno);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia: ', t.timeStampChiamataTCRUN);
            if (t.timeStampChiamataArfcnAM && ritorno.getTime() < t.timeStampChiamataArfcnAM.getTime()) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn AM: esco per query vecchia', ritorno, t.timeStampChiamataArfcnAM);
              }

              // logConsole('Azzeramento flag arfcn 3', t.NumeroFrame2)
              t.caricamentoArfcnAM[t.NumeroFrame2] = false;
              return;
            } else {
              t.timeStampChiamataArfcnAM = ritorno;
            }
          }

          if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
            t.gridTitle2AM = data2.GridProperty[0].GridName; // t.frameName = 
          }

          t.vecchiDatiArfcnAM = data2;

          this.staElaborandoAM[t.NumeroFrame2] = false;
          if (data2 && data2 !== null) {
            if (t.datiArfcnAM && t.datiArfcnAM.DataTable && data2.DataTable && JSON.stringify(data2.ColumnProperty) === this.vecchieColumnProperty) {
              t.datiArfcnAM.DataTable = data2.DataTable;

              // logConsole('Azzeramento flag arfcn 4', t.NumeroFrame2)
              t.caricamentoArfcnAM[t.NumeroFrame2] = false;
            } else {
              this.vecchieColumnProperty = JSON.stringify(data2.ColumnProperty);
              // t.datiArfcnAM = undefined;
              t.datiArfcnAM = undefined;
              const tm = setTimeout(() => {
                clearTimeout(tm);

                t.effettuaAutoFitArfcn = !t.effettuaAutoFitArfcn;
                t.datiArfcnAM = data2;

                // logConsole('Azzeramento flag arfcn 5', t.NumeroFrame2)
                t.caricamentoArfcnAM[t.NumeroFrame2] = false;
              }, 50);
              // const tm = setTimeout(() => {
              // t.datiArfcnAM = data2;
              // }, 500);
            }
          }

          logConsole('arfcn AM grid 8', t.NumeroFrame2, t.datiArfcnAM, t.nessunClusterGrid, t.erroreArfcnAM[t.NumeroFrame2]);
            /*   t.effettuaAutoFitAI = !t.effettuaAutoFitAI;
            }
          } else {
            t.datiArfcnAM = undefined;
          } */
        }
      }, error => {
        this.staElaborandoAM[t.NumeroFrame2] = false;
        // logConsole('Azzeramento flag arfcn 6', t.NumeroFrame2)
        t.caricamentoArfcnAM[t.NumeroFrame2] = false;
        this.vecchieColumnProperty = '';
        t.lastCallArfcnAM[t.NumeroFrame2] = '';
        // ExternalUtilities.messaggioDiErrore(t.datiArfcnAM, error);
        t.datiArfcnAM = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn AM: disegno vecchi dati', t.NumeroFrame2, t.vecchiDatiArfcnAM);
      }

      logConsole('arfcn AM grid 8', t.NumeroFrame2);
      /* t.datiArfcnAM = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiArfcnAM = t.vecchiDatiArfcnAM;
      }, 500); */
      // logConsole('Azzeramento flag arfcn 7', t.NumeroFrame2)
      // t.caricamentoArfcnAM[t.NumeroFrame2] = false;
      this.staElaborandoAM[t.NumeroFrame2] = false;
    }
  }
}

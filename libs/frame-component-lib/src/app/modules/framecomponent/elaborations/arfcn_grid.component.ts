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
export class ArfcnComponent {
  // lastCallArfcn = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCall1 = ['', '', '', '', '', '', '', '', '', '',  ''];
  // lastCall2 = ['', '', '', '', '', '', '', '', '', '',  ''];

  destroy$ = new FineRichieste();

  staElaborandoAR = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false];
  vecchieColumnProperty;

  constructor(
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.lastCallArfcn[t.NumeroFrame2] = '';
    t.datiArfcn = 'empty grid';
    t.vecchiDatiArfcn = undefined;
    t.erroreArfcn[t.NumeroFrame2] = '';
    this.vecchieColumnProperty = '';
    this.staElaborandoAR[t.NumeroFrame2] = false;

    const nome = 'gridArfcn_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  disegnaArfcn(t) {
    // logConsole('arfcn grid 1', t.NumeroFrame2);
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'AR') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Arfcn', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Entro in Arfcn', t.NumeroFrame2);
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

    // logConsole('arfcn grid 2', t.NumeroFrame2);

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
        this.continuaDisegnaAR(t, agnact, valoreRicerca, sla);
      } else {
        q++;
        if (q > 10) {
          clearInterval(f);
        }
      }
    }, 1000);
  }

  continuaDisegnaAR(t, agnact, valoreRicerca, sla) {
    // logConsole('arfcn grid 3', t.NumeroFrame2);

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Act set area', t.act_set, agnact, t.ActivityName2);
    // }

    if (!valoreRicerca || valoreRicerca === 'undefined' || valoreRicerca === '\'undefined\'') {
      this.staElaborandoAR[t.NumeroFrame2] = false;
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn. Esco per act set vuoto');
      // }

      // logConsole('arfcn grid 3.1 ESCO', t.NumeroFrame2);
      return;
    }

    let sInizio = '';
    let sFine = '';

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time range Arfcn', t.timeFilter, t.timeFilter2);
    // }

    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      // if (!t.Utils.tmsSelezionato || t.Utils.tmsSelezionato === null || t.Utils.tmsSelezionato === '') {
      //   return;
      // }

      sInizio = t.Utils.tmsInizio;
      sFine = t.Utils.tmsFine;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time range Arfcn 2: ', sInizio, sFine);
      }
    } else {
      sInizio = t.timeRangeDSFStart2;
      sFine = t.timeRangeDSFStop2;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time range Arfcn Altro: ', sInizio, sFine);
      }
    }
    if (!sInizio || sInizio === '' || sInizio === null || sInizio === '"undefined"') {
      this.staElaborandoAR[t.NumeroFrame2] = false;
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn esco per tms inizio vuoto');
      }
      // logConsole('arfcn grid 3.2 ESCO', t.NumeroFrame2);
      return;
    }
    if (!sFine || sFine === '' || sFine === null || sFine === '"undefined"') {
      this.staElaborandoAR[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn esco per tms fine vuoto');
      // logConsole('arfcn grid 3.3 ESCO', t.NumeroFrame2);
      return;
    }

    // logConsole('arfcn grid 4', t.NumeroFrame2, sInizio, sFine);

    const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

    // FILTER
    const filtri = ExternalUtilities.prendeFiltri(t, true, 'ARFCN');
    const cm1 = filtri.cm1;
    const cm2 = filtri.cm2;
    const tf1 = filtri.tf1;
    const tf2 = filtri.tf2;
    // FILTER

    
    const event = t.correlation2;
    let event2 = '';

    const misura = ExternalUtilities.ritornaMisura(t, event, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Arfcn');
    event2 = misura;

    // logConsole('arfcn grid 5', t.NumeroFrame2, misura);

    if (!event2) {
      this.staElaborandoAR[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn esco per correlation vuoto');
      // return;
    }

    t.nessunClusterGrid = false;
    t.nessunClusterGridMisura = false;
    let qualeCluster = t.overlayCluster2;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn Grid: Quale cluster', qualeCluster);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno overlay Frame', t.NumeroFrame, qualeCluster, element2.CODE);
    if (qualeCluster === environment.stringaClusterGlobale) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn Grid: Cluster globale');

      if (t.clusterGlobale2 && t.clusterGlobale2.NAME !== '') {
        qualeCluster = t.clusterGlobale2.CODE;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prendo overlay globale', t.NumeroFrame, qualeCluster);
      } else {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn Grid: Esco per nessun cluster globale definito', t.clusterGlobale2);

        t.nessunClusterGrid = true;

        // logConsole('arfcn grid 5.1 ESCO', t.NumeroFrame2);
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
      v_corr_measr_code_1: event2
    };
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno point info', params);

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const actualCall1 = 'Arfcn;' + JSON.stringify(params) + ';' + valoriDiBase + ';';

    if (t.datiArfcn && typeof(t.datiArfcn) === 'string') {
      if (t.datiArfcn.indexOf('ERROR: ') > -1) {
        t.datiArfcn = undefined;
        t.lastCallArfcn[t.NumeroFrame2] = undefined;
      }
    }

    // logConsole('arfcn grid 6', t.NumeroFrame2, params);

    if (t.lastCallArfcn[t.NumeroFrame2] !== actualCall1) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn', t.NumeroFrame, actualCall1);
      }
      t.caricamentoArfcn[t.NumeroFrame2] = true;
      t.lastCallArfcn[t.NumeroFrame2] = actualCall1;
      this.staElaborandoAR[t.NumeroFrame2] = true;

      // logConsole('arfcn grid 7', t.NumeroFrame2);

      t.chiSonoArfcn[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params['v_caller_tag'] = t.chiSonoArfcn[t.NumeroFrame2];
      t.erroreArfcn[t.NumeroFrame2] = '';
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'geo_arfcn__grid';

      t.lastCallArfcn2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_arfcn__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (!t.controllaRitornoChiamata(t, data2, 'Arfcn')) {
          // logConsole('Azzeramento flag arfcn 1', t.NumeroFrame2)
          t.caricamentoArfcn[t.NumeroFrame2] = false;
          return;
        }

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningARFCN = data2.v_grid_msg;
        } else {
          t.messaggioWarningARFCN = '';
        }

        if (data2.message) {
          t.erroreArfcn[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          this.staElaborandoAR[t.NumeroFrame2] = false;
          // logConsole('Azzeramento flag arfcn 2', t.NumeroFrame2)
          t.caricamentoArfcn[t.NumeroFrame2] = false;
          t.datiArfcn = undefined;
        } else {
          if (data2.v_req_tms) {
            const ritorno = new Date(data2.v_req_tms);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno: ', ritorno);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia: ', t.timeStampChiamataTCRUN);
            if (t.timeStampChiamataArfcn && ritorno.getTime() < t.timeStampChiamataArfcn.getTime()) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn: esco per query vecchia', ritorno, t.timeStampChiamataArfcn);
              }

              // logConsole('Azzeramento flag arfcn 3', t.NumeroFrame2)
              t.caricamentoArfcn[t.NumeroFrame2] = false;
              return;
            } else {
              t.timeStampChiamataArfcn = ritorno;
            }
          }

          if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
            t.gridTitle2AR = data2.GridProperty[0].GridName; // t.frameName = 
          }

          t.vecchiDatiArfcn = data2;

          this.staElaborandoAR[t.NumeroFrame2] = false;
          if (data2 && data2 !== null) {
            if (t.datiArfcn && t.datiArfcn.DataTable && data2.DataTable && JSON.stringify(data2.ColumnProperty) === this.vecchieColumnProperty) {
              t.datiArfcn.DataTable = data2.DataTable;

              // logConsole('Azzeramento flag arfcn 4', t.NumeroFrame2)
              t.caricamentoArfcn[t.NumeroFrame2] = false;
            } else {
              this.vecchieColumnProperty = JSON.stringify(data2.ColumnProperty);
              // t.datiArfcn = undefined;
              t.datiArfcn = undefined;
              const tm = setTimeout(() => {
                clearTimeout(tm);

                t.effettuaAutoFitArfcn = !t.effettuaAutoFitArfcn;
                t.datiArfcn = data2;

                // logConsole('Azzeramento flag arfcn 5', t.NumeroFrame2)
                t.caricamentoArfcn[t.NumeroFrame2] = false;
              }, 50);
              // const tm = setTimeout(() => {
              // t.datiArfcn = data2;
              // }, 500);
            }
          }
            /*   t.effettuaAutoFitAI = !t.effettuaAutoFitAI;
            }
          } else {
            t.datiArfcn = undefined;
          } */
        }
      }, error => {
        this.staElaborandoAR[t.NumeroFrame2] = false;
        // logConsole('Azzeramento flag arfcn 6', t.NumeroFrame2)
        t.caricamentoArfcn[t.NumeroFrame2] = false;
        this.vecchieColumnProperty = '';
        t.lastCallArfcn[t.NumeroFrame2] = '';
        // ExternalUtilities.messaggioDiErrore(t.datiArfcn, error);
        t.datiArfcn = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Arfcn: disegno vecchi dati', t.NumeroFrame2, t.vecchiDatiArfcn);
      }

      // logConsole('arfcn grid 8', t.NumeroFrame2);
      /* t.datiArfcn = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiArfcn = t.vecchiDatiArfcn;
      }, 500); */
      // logConsole('Azzeramento flag arfcn 7', t.NumeroFrame2)
      // t.caricamentoArfcn[t.NumeroFrame2] = false;
      this.staElaborandoAR[t.NumeroFrame2] = false;
    }
  }
}

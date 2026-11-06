import { logConsole } from '../console-log';
import { environment } from './../../../../environments/environment.prod';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { ExternalApiService } from '../services/externalapi.service';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import {transform} from 'ol/proj';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';

@Injectable()
export class ClusterGridComponent {
  // lastCallClusterGrid = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallLayerGeometry = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  destroy$ = new FineRichieste();

  staElaborandoCG = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false];;
  vecchioActual = '';
  GestisceLayerConSetSource = true;
  layerAttivo = ExternalUtilities.creaVettore(environment.quantePagine, false);

  constructor(
    private apiService: ExternalApiService,
    // private gestGrafici: GestioneGrafici
    // private sessionService: SessionService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    this.layerAttivo[t.NumeroFrame2] = false;
    if (t.pathLayerGeometry[t.NumeroFrame2]) {
      t.removeLayerFromMap('Path layer BBOX', t.pathLayerGeometry[t.NumeroFrame2]);
      t.pathLayerGeometry[t.NumeroFrame2] = undefined;
    }

    t.erroreCluster[t.NumeroFrame2] = '';
    t.lastCallClusterGrid[t.NumeroFrame2] = '';
    t.lastCallLayerGeometry[t.NumeroFrame2] = '';
    t.datiClusterGrid = 'empty grid';
    t.vecchiDatiClusterGrid = undefined;

    const nome = 'gridClusterGrid_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  disegnaClusterGrid(t) {
    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /* let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'CG' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster Grid: Cell measures ESCO 0');
      }
      return;
    } */

    if (this.staElaborandoCG[t.NumeroFrame2] === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster Grid: Cell measures ESCO 1');

      return;
    }

    t.nessunClusterGrid = false;
    t.nessunClusterGridMisura = false;
    let qualeCluster = t.overlayCluster2;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster Grid: Quale cluster', qualeCluster);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno overlay Frame', t.NumeroFrame, qualeCluster, element2.CODE);
    if (qualeCluster === environment.stringaClusterGlobale) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster Grid: Cluster globale');

      if (t.clusterGlobale2 && t.clusterGlobale2.NAME !== '') {
        qualeCluster = t.clusterGlobale2.CODE;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prendo overlay globale', t.NumeroFrame, qualeCluster);
      } else {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster Grid: Esco per nessun cluster globale definito', t.clusterGlobale2);

        t.nessunClusterGrid = true;
        return;
      }
    }

    let qBbox = ExternalUtilities.ritornaBboxGiusta(t, 'disegnaClusterGrid');
    let qualeBbox;

    if (+t.geoFilter2 === 1 || t.geoFilter2 === 1) {
      qualeBbox = qBbox;
    } else {
      qualeBbox = [qBbox[1], qBbox[0],qBbox[3],qBbox[2]];
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Cluster grid. Acquisizione bbox', t.geoFilter2, qualeBbox);

    if (!qualeBbox || qualeBbox === '') {
      t.datiClusterGrid = 'empty grid';
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster Grid: Cell measures ESCO 2');

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito da cluster grid 4', t.NumeroFrame, t.bboxOZ2);
      return;
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Cluster grid. Cluster name ', t.overlayCluster2, qualeCluster, t.clusterGlobale2, qualeBbox);

    let sInizio = '';
    let sFine = '';

    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      if (t.Utils.tmsInizio && t.Utils.tmsFine) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.tmsInizio, t.Utils.tmsFine);
        sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
        sFine = t.Utils.tmsFine; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
      } else {
        t.datiClusterGrid = 'empty grid';
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster Grid: Cell measures ESCO 2.5');
        }
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito da cluster grid 3', t.NumeroFrame);
        return;
      }
    } else {
      sInizio = t.timeRangeDSFStart2;
      sFine = t.timeRangeDSFStop2;
    }
    if (!sInizio || !sFine) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster Grid: Cell measures ESCO 3');
      }
      return;
    }

    const sla = ExternalUtilities.tornaSla(t);

    let nomeMisura = '';

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Cluster grid', t.overlay2);
    // }

    const misura = ExternalUtilities.ritornaMisura(t, t.overlay2, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Cluster Grid');
    nomeMisura = misura;

    /* if (t.overlay2 && (t.overlay2.indexOf('<GLOBAL MEASURE>') > -1 || (t.overlay2.indexOf('global_measure') > -1 && t.overlay2.indexOf('global_measure_') === -1))) {
        t.measureData2.forEach(element2 => {
        if (element2.CODE === t.Utils.globalMeasure.MEASR_CODE) {
          const m = element2.CODE.replace('"', '').replace('"', '');
          nomeMisura = t.overlay2.replace('<GLOBAL MEASURE>', m).replace('global_measure', m);
        }
      });
    } else {
      if (t.overlay2 && (t.overlay2.indexOf('<GLOBAL CHECKED MEASURE ') > -1 || t.overlay2.indexOf('global_measure_') > -1)) {
        let indice;
        if (t.overlay2.indexOf('<GLOBAL CHECKED MEASURE ') > -1) {
          indice = +(t.overlay2.replace('<GLOBAL CHECKED MEASURE ', '').replace('>', ''));
        } else {
          indice = +(t.overlay2.replace('global_measure_', ''));
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
            nomeMisura = t.overlay2.replace('global_measure_' + indice, cosa).replace('<GLOBAL CHECKED MEASURE ' + indice + '>', cosa) + '\\, ';
          } else {
            nomeMisura = '';
          }
        }
      } else {
        t.measureData2.forEach(element2 => {
          if (element2.CODE === t.overlay2) {
            nomeMisura = element2.CODE.replace('"', '').replace('"', '');
          }
        });
      }
    } */

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster Grid: Nome misura', nomeMisura);
    // }
    if (!nomeMisura || nomeMisura === null || nomeMisura === '') {
    // if (nomeMisura === '' || !qualeCluster || qualeCluster === '') {
      t.nessunClusterGridMisura = true;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster Grid: Cell measures ESCO 4');

      return;
    }

    let act_set = ExternalUtilities.ritornaStringPerActivitySet(t, t.Utils);
    act_set = act_set.replace('geo_act_set_name_1:', '');

    // qualeBbox = [ -90, -180, 90, 180 ];

    const showCoverage = t.showCoverageMeasures2 === true ? 'Y' : 'N';
    const showVoice = t.showVoiceCallMeasures2 === true ? 'Y' : 'N';
    const showData = t.showDataMeasures2 === true ? 'Y' : 'N';

    const actual = showCoverage + showVoice + showData;
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Controllo cookie griglia per cambio checks', this.vecchioActual, actual);
    if (this.vecchioActual !== actual) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulisco cookie griglia per cambio checks');

      t.pulisceCookieCG = new Date();
    }
    this.vecchioActual = actual;

    const params = {
      cntx_id: t.sessionID2,
      // v_caller_tag: t.chiSonoClusterGrid[t.NumeroFrame2],
      v_act_set_name_list: act_set,
      v_geo_sla_name: sla,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_measr_code: nomeMisura,
      v_cluster_set_name: qualeCluster,
      geoants_bbox_min_x: qualeBbox[0],
      geoants_bbox_min_y: qualeBbox[1],
      geoants_bbox_max_x: qualeBbox[2],
      geoants_bbox_max_y: qualeBbox[3],
      v_show_coverage: showCoverage,
      v_show_voice: showVoice,
      v_show_data: showData
    };

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri Cluster Grid', t.NumeroFrame, params);

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' + t.NumeroFrame + ';' +
      t.frameAttivo + ';';
    const actualCall1 = 'ClusterGRID;' + valoriDiBase + ';' + JSON.stringify(params);

    if (t.datiClusterGrid && typeof(t.datiClusterGrid) === 'string') {
      if (t.datiClusterGrid.indexOf('ERROR: ') > -1) {
        t.datiClusterGrid = undefined;
        t.lastCallClusterGrid[t.NumeroFrame2] = undefined;
      }
    }

    if (t.lastCallClusterGrid[t.NumeroFrame2] !== actualCall1) {
      t.caricamentoClusterGrid[t.NumeroFrame2] = true;

      t.lastCallClusterGrid[t.NumeroFrame2] = actualCall1;

      this.staElaborandoCG[t.NumeroFrame2] = true;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Cluster Grid', t.NumeroFrame, params);

      t.chiSonoClusterGrid[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params['v_caller_tag'] = t.chiSonoClusterGrid[t.NumeroFrame2];
      t.erroreCluster[t.NumeroFrame2] = '';
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'cluster_rec__grid';

      t.lastCallClusterGrid2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'cluster_rec__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))    
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (!t.controllaRitornoChiamata(t, data2, 'Cluster Rec')) {
          t.caricamentoClusterGrid[t.NumeroFrame2] = false;
          return;
        }

        if (data2.v_grid_msg !== undefined) {
          t.messaggioWarningCG = data2.v_grid_msg;
        } else {
          t.messaggioWarningCG = '';
        }

        if (data2.message) {
          t.erroreCluster[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          t.datiClusterGrid = 'empty grid';
          this.staElaborandoCG[t.NumeroFrame2] = false;
          t.caricamentoClusterGrid[t.NumeroFrame2] = false;
        } else {
          if (data2.v_req_tms) {
            const ritorno = new Date(data2.v_req_tms);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno: ', ritorno);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia: ', t.timeStampChiamataTCRUN);
            if (t.timeStampChiamataCluster && ritorno.getTime() < t.timeStampChiamataCluster.getTime()) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Cluster Grid: esco per query vecchia', ritorno, t.timeStampChiamataCluster);

              t.caricamentoClusterGrid[t.NumeroFrame2] = false;
              return;
            } else {
              t.timeStampChiamataCluster = ritorno;
            }
          }

          if (data2 && data2 !== null) {
            /* if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
              t.frameName = data2.GridProperty[0].GridName;
            } */

            // const data = data2;
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster grid:', t.datiClusterGrid, data2);
            }
            /* if (t.datiClusterGrid && data.DataTable && t.datiClusterGrid !== null && t.datiClusterGrid !== 'empty grid') {
              t.datiClusterGrid.DataTable = data.DataTable;
            } else { */

            t.vecchiDatiClusterGrid = data2;

            if (t.datiClusterGrid && t.datiClusterGrid !== 'empty grid' && t.datiClusterGrid.DataTable && data2.DataTable) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiorno dati cluster grid');
              /* if (data2.DataTable.length === 0) {
                t.datiClusterGrid = 'empty grid';
              } else { */
                t.datiClusterGrid.DataTable = data2.DataTable;
              // }
            } else {
              // t.datiClusterGrid = undefined;
              // const tm = setTimeout(() => {
          // clearTimeout(tm);
                /* if (!data2 || (data2 && !data2.DataTable) || (data2 && data2.DataTable && data2.DataTable.length === 0)) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Creo dati vuoti cluster grid', data2);
                  t.datiClusterGrid = 'empty grid';
                } else { */
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Creo dati cluster grid', data2);
              
                  t.datiClusterGrid = data2;
                // }

                const tm = setTimeout(() => {
                  clearTimeout(tm);

                  t.effettuaAutoFitClusterGrid = !t.effettuaAutoFitClusterGrid;
                }, 100);
              // }, 100);
            }

            // const tm = setTimeout(() => {
          // clearTimeout(tm);
              /* const nomiColonneCG = new Array();
              data.ColumnProperty.forEach(element => {
                nomiColonneCG.push(element.headerText);
              });
              t.nomiColonneCG = JSON.parse(JSON.stringify(nomiColonneCG));
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Nomi colonne Cluster Grid', t.nomiColonneCG);
              }

              if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG[0] &&
                ExternalUtilities.rigaSelezionataMG[0].NAME) {
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ricerca vecchia selezione', ExternalUtilities.rigaSelezionataMG[0]);
                }
                if (t.datiMosaicGrid) {
                  t.datiMosaicGrid.DataTable.forEach(element => {
                    if (ExternalUtilities.rigaSelezionataMG[0].NAME === element.NAME &&
                      ExternalUtilities.rigaSelezionataMG[0].SQUARE_SNAP === element.SQUARE_SNAP) {
                      if (t.debug2 === true) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Trovata riga vecchia selezione', element.ROW_ID);
                      }
                      t.impostaSelezioneMosaicGrid = element.ROW_ID;
                    }
                  });
                }
              } */
            // }, 1000);

            this.staElaborandoCG[t.NumeroFrame2] = false;
            t.caricamentoClusterGrid[t.NumeroFrame2] = false;
          } else {
            // t.datiClusterGrid = null;
            t.datiClusterGrid = 'empty grid';
            this.staElaborandoCG[t.NumeroFrame2] = false;
            t.caricamentoClusterGrid[t.NumeroFrame2] = false;
          }
        }
      }, error => {
        this.staElaborandoCG[t.NumeroFrame2] = false;
        t.caricamentoClusterGrid[t.NumeroFrame2] = false;
        t.lastCallClusterGrid[t.NumeroFrame2] = '';
        // ExternalUtilities.messaggioDiErrore(t.datiMosaicGrid, error);
        t.datiClusterGrid = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      });
    } else {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Cluster grid vecchi:', t.datiClusterGrid, t.vecchiDatiClusterGrid, t.nessunClusterGrid);
      
      /*  t.datiClusterGrid = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiClusterGrid = t.vecchiDatiClusterGrid;
      }, 100); */

      t.caricamentoClusterGrid[t.NumeroFrame2] = false;
    }
  }

  caricamentoLayerGeometry(t) {
    // logConsole('CLG 1');
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      // logConsole('Esco da caricamentoLayerGeometry 1');
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    // logConsole('CLG 2');
    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo mappa', t.NumeroFrame2, t.MappaOGrafico2);
      // logConsole('Esco da caricamentoLayerGeometry 2');
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }
    
    // logConsole('CLG 3');
    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    } */
    if (t.MappaOGraficoTutti2 && t.MappaOGraficoTutti2[t.frameAttivo2] !== 'M' || // || aperto === false ||
      !ExternalUtilities.bboxSelected || !ExternalUtilities.bboxSelected[0]) {
        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno layer geometry. Esco 1', ExternalUtilities.bboxSelected);
        // }
        t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;
        // logConsole('Esco da caricamentoLayerGeometry 3');
        this.layerAttivo[t.NumeroFrame2] = false;

        return;
    }

    // logConsole('CLG 4');
    let NAME = '';
    if (ExternalUtilities.bboxSelected[0].NAME) {
      NAME = ExternalUtilities.bboxSelected[0].NAME;
    } else {
      if (ExternalUtilities.bboxSelected[0].CLUSTER_REC_NAME) {
        NAME = ExternalUtilities.bboxSelected[0].CLUSTER_REC_NAME;
      }
    }

    // logConsole('CLG 5', NAME);
    if (!ExternalUtilities.bboxSelected[0].SQUARE_SNAP ||
      !ExternalUtilities.bboxSelected[0].COLOR ||
      !NAME) {
        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno layer geometry. Esco 2', ExternalUtilities.bboxSelected);
        // }
        t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;
        // logConsole('Esco da caricamentoLayerGeometry 4', ExternalUtilities.bboxSelected);
        this.layerAttivo[t.NumeroFrame2] = false;

        return;
    }

    // logConsole('CLG 6');
    if (t.ConnessioneStabilita === 'OK') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno layer geometry', t.frameVisible2);

      t.staDisegnandoLayerGeometry[t.NumeroFrame2] = true;

      let ss = ExternalUtilities.bboxSelected[0].SQUARE_SNAP;
      ss = ExternalUtilities.effettuaReplace(ss, ',', '\\,');
      ss = ExternalUtilities.effettuaReplace(ss, '#', '%23');
      while (ss.indexOf(',') > -1) {
        ss = ss.replace(',', '|');
      }
      while (ss.indexOf('\\,') > -1) {
        ss = ss.replace('\\,', '|');
      }
      while (ss.indexOf('%23') > -1) {
        ss = ss.replace('%23', '');
      }

      let c = ExternalUtilities.bboxSelected[0].COLOR;
      c = ExternalUtilities.effettuaReplace(c, ',', '\\,');
      c = ExternalUtilities.effettuaReplace(c, '#', '%23');
      while (c.indexOf('#') > -1) {
        c = c.replace('#', '');
      }
      while (c.indexOf('%23') > -1) {
        c = c.replace('%23', '');
      }

      let n = ''; 
      if (ExternalUtilities.bboxSelected[0].NAME) {
        n = ExternalUtilities.bboxSelected[0].NAME;
      } else {
        if (ExternalUtilities.bboxSelected[0].CLUSTER_REC_NAME) {
          n = ExternalUtilities.bboxSelected[0].CLUSTER_REC_NAME;
        }
      }
      if (n) {
        n = ExternalUtilities.effettuaReplace(n, ',', '\\,');
        n = ExternalUtilities.effettuaReplace(n, '#', '%23');
      }

      let tipologia = '';
      if (+t.comboSelArea2 === 1) {
        tipologia = 'zoomed_map';
      } else {
        tipologia = 'selected_area';
      }

      // alert('GEOMETRY SU CLUSTER');

      const nomeLayer = 'Geo_ANTS:l_geometry';
      const parametri = 'cntx_id:\'' + t.sessionID2 + '\';' +
        'v_geo_label:\'' + n + '\';' +
        'v_geo_type:\'' + tipologia + '\';' +
        'v_geo_geometry:\'' + ss + '\';' +
        'v_geo_color:\'' + c + '\';'; //  +
        // 'v_chi_mi_chiama:\'cluster\';';

      const parameters = {
        LAYERS: nomeLayer,
        TILED: false,
        STYLES: 's_geometry',
        VIEWPARAMS: parametri
        // 'CQL_FILTER': act_set + tmsFilter + ' and act_id in (' + act_id + ')'
      };
      // logConsole('CLG 7', parameters);

      // logConsole('Esco da caricamentoLayerGeometry 5', parameters);
        
      const valoriDiBase = ';' + t.dashboardAttiva2 + ';' + t.NumeroFrame + ';' +
        t.frameAttivo + ';' + t.comboSelArea2 + ';';

      const actualCall = 'LAYERCLUSTER;' + JSON.stringify(parameters) + valoriDiBase;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri Layer Geometry Cluster', actualCall);

      if (t.lastCallLayerGeometry[t.NumeroFrame2] !== actualCall) {
        t.lastCallLayerGeometry[t.NumeroFrame2] = actualCall;

        // logConsole('CLG 8');
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Layer Geometry', t.NumeroFrame, parameters, t.comboSelArea2);

        /* if (t.pathLayerGeometry[t.NumeroFrame2]) {
          t.removeLayerFromMap('Layer geometry', t.pathLayerGeometry[t.NumeroFrame2]);
          t.pathLayerGeometry[t.NumeroFrame2] = undefined;
        } */

        if (+t.comboSelArea2 === 1) {
          // t.creaLayerBBOX(true);

          this.layerAttivo[t.NumeroFrame2] = false;
          if (t.pathLayerBBOX[t.NumeroFrame2]) {
            t.removeLayerFromMap('Path layer BBOX', t.pathLayerBBOX[t.NumeroFrame2]);
            t.pathLayerBBOX[t.NumeroFrame2] = undefined;
            t.lastCallLayerGeometry[t.NumeroFrame2] = '';
            t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;
          }
          return;
        } else {
          // logConsole('CLG 9');
          /* let q = 0;
          const tt = setInterval(() => {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'wms', wms);
            if (wms.loading === true) {
              q++;
              if (q > 30) {
                t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;

                clearInterval(tt);
              }
            } else {
              clearInterval(tt); */


              if (t.pathLayerGeometry[t.NumeroFrame2] && t.pathLayerGeometry[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource) {
                let nuoviParametri = {         
                  LAYERS: nomeLayer,
                  VIEWPARAMS: parametri
                };

                this.layerAttivo[t.NumeroFrame2] = true;
                t.pathLayerGeometry[t.NumeroFrame2].getSource().updateParams(nuoviParametri); // .setSource(wms);
              } else {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ADD Layer Geometry to map', t.NumeroFrame);

                if (t.pathLayerGeometry[t.NumeroFrame2]) {
                  t.removeLayerFromMap('Path layer BBOX', t.pathLayerGeometry[t.NumeroFrame2]);
                  t.pathLayerGeometry[t.NumeroFrame2] = undefined;
                }

                const wms = new ImageWMS({
                  ratio: 1, // immagine grande quanto la mappa (default 1.5 = 2,25x i pixel)
                  url: t.Utils.indirizzoGEOServer + t.urlWms,
                  projection: 'EPSG:4326',
                  // renderer: 'antialias: true;',
                  params: parameters,
                  serverType: 'geoserver',

                  // Sovrascrivere l'URL per evitare la cache
                  imageLoadFunction: (image, src) => {
                    if (!this.layerAttivo[t.NumeroFrame2]) { return; }

                    const timestamp = new Date().getTime();
                    const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                    const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                    image.getImage()['src'] = noCacheUrl2;
                  }
                });

                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, wms);
                const newWms = new ImageLayer({
                  source: wms
                });
                
                t.addLayerToMap(newWms, 16, 'GeometryCluster');
                t.pathLayerGeometry[t.NumeroFrame2] = newWms;
                this.layerAttivo[t.NumeroFrame2] = true;
              }

              t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;
            /* }
          }, 1000); */
        }
      } else {
        t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;
      }
    }
  }
}

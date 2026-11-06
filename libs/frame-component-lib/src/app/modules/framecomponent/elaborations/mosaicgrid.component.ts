import { logConsole } from '../console-log';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { ExternalApiService } from './../services/externalapi.service';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import {transform} from 'ol/proj';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TraceRun2Component } from '../tcrun2/tracerun2.component';
import { environment } from '../../../../environments/environment';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';
// import { environment } from '../../../../environments/environment.prod';


@Injectable()
export class MosaicGridComponent {
  destroy$ = new FineRichieste();

  // lastCallMosaicGrid = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallLayerGeometry = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  staElaborandoMG = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false, false, false];
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
    if (t.pathLayerBBOX[t.NumeroFrame2]) {
      t.removeLayerFromMap('Path layer BBOX', t.pathLayerBBOX[t.NumeroFrame2]);
      t.pathLayerBBOX[t.NumeroFrame2] = undefined;
    }

    t.erroreMosaic[t.NumeroFrame2] = '';
    t.lastCallLayerGeometryMosaic[t.NumeroFrame2] = '';
    t.lastCallMosaicGrid[t.NumeroFrame2] = '';
    t.datiMosaicGrid = 'empty grid';
    t.vecchiDatiMosaicGrid = undefined;
    this.staElaborandoMG[t.NumeroFrame2] = false;

    const nome = 'gridMosaicGrid_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  disegnaMosaicGrid(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }
    
    if (t.MappaOGrafico2 !== 'MG') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Mosaic Grid', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /* let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'MG' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco 0 da mosaic grid', t.MappaOGrafico2, t.NumeroFrame2);
      }
      return;
    } */

    if (this.staElaborandoMG[t.NumeroFrame2] === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco 1 da mosaic grid', t.NumeroFrame2);

      return;
    }

    let qualeBbox;
    let qualeSM;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid. Lettura BBox: ', t.geoFilter2, t.bboxOZ2);

    let squareMeters = t.squareMeters2;
    if (squareMeters === '<GLOBAL SQUARE SIDE>') {
      squareMeters = t.squareMetersGlobale2;
    }
    // logConsole('Square meters in MOSAIC 1', t.squareMeters, squareMeters, t.squareMetersGlobale2);

    if (+t.geoFilter2 === 1) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid. Impostazione Overview ', t.bboxOverview, ExternalUtilities.squareMetersGlobaleOverView);

      qualeBbox = t.bboxOverview;
      qualeSM = squareMeters; // ExternalUtilities.squareMetersGlobaleOverView;
    } else {
      if (+t.geoFilter2 === 0) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid. Impostazione ALL ');

        qualeBbox = [ -90, -180, 90, 180 ];
        qualeSM = squareMeters; // ExternalUtilities.squareMetersGlobaleZoom;
      } else {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid. Impostazione Zoom ', t.bboxZoom, ExternalUtilities.squareMetersGlobaleZoom);

        if (t.comboSelArea2 === 1) {
          qualeBbox = t.bboxZoom;
        } else {
          if (ExternalUtilities.bboxSelected && ExternalUtilities.bboxSelected[0] && ExternalUtilities.bboxSelected[0].SQUARE_SNAP) {
            qualeBbox = ExternalUtilities.bboxSelected[0].SQUARE_SNAP;
          } else {
            qualeBbox = '';
          }
        }

        qualeSM = squareMeters; // ExternalUtilities.squareMetersGlobaleZoom;
      }
    }
    // alert('Square meters: ' + t.geoFilter2 + ' - ' + t.squareMeters2);
    if (!qualeBbox) {
      return;
    }
    if (qualeBbox[0] > 90) {
      let b1 = [qualeBbox[0], qualeBbox[1]];
      let b2 = [qualeBbox[2], qualeBbox[3]];
      b1 = transform(b1, 'EPSG:3857', 'EPSG:4326');
      b2 = transform(b2, 'EPSG:3857', 'EPSG:4326');
      qualeBbox = [b1[0], b1[1], b2[0], b2[1]];
    }

    let sInizio = '';
    let sFine = '';

    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      if (t.Utils.tmsInizio && t.Utils.tmsFine) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.tmsInizio, t.Utils.tmsFine);
        sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
        sFine = t.Utils.tmsFine; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
      } else {
        t.datiMosaicGrid = 'empty grid';
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito da events 3', t.NumeroFrame);
        return;
      }
    } else {
      sInizio = t.timeRangeDSFStart2;
      sFine = t.timeRangeDSFStop2;
    }
    const sla = ExternalUtilities.tornaSla(t);

    let nomeMisura = '';

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid', t.overlay2);
    // }

    const misura = ExternalUtilities.ritornaMisura(t, t.overlay2, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Mosaic Grid');
    nomeMisura = misura;
   
    if (nomeMisura === '') {
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid. Esco per nome misura nulla');
      // }
      return;
    }

    let act_set = ExternalUtilities.ritornaStringPerActivitySet(t, t.Utils);
    act_set = act_set.replace('geo_act_set_name_1:', '');

    if (act_set === null || act_set === undefined || act_set === '') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid. Esco per nome act set nullo');

      return;
    }

    if (sInizio === undefined || sFine === undefined || sInizio === null || sFine === null) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid. Esco per date nulle');

      return;
    }

    const params = {
      cntx_id: t.sessionID2,
      v_act_set_name_list: act_set,
      v_geo_sla_name: sla,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_measr_code: nomeMisura,
      v_square_meters: qualeSM,
      geoants_bbox_min_x: qualeBbox[0],
      geoants_bbox_min_y: qualeBbox[1],
      geoants_bbox_max_x: qualeBbox[2],
      geoants_bbox_max_y: qualeBbox[3],
    };

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid: Parametri', t.NumeroFrame, params);

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' + t.NumeroFrame + ';' +
      t.frameAttivo + ';';
    const actualCall1 = 'MOSAICGRID;' + valoriDiBase + ';' + JSON.stringify(params);

    if (t.datiMosaicGrid && typeof(t.datiMosaicGrid) === 'string') {
      if (t.datiMosaicGrid.indexOf('ERROR: ') > -1) {
        t.datiMosaicGrid = undefined;
        t.lastCallMosaicGrid[t.NumeroFrame2] = undefined;
      }
    }
    
    if (t.lastCallMosaicGrid[t.NumeroFrame2] !== actualCall1) {
      t.caricamentoMosaicGrid[t.NumeroFrame2] = true;

      t.lastCallMosaicGrid[t.NumeroFrame2] = actualCall1;

      this.staElaborandoMG[t.NumeroFrame2] = true;
      t.erroreMosaic[t.NumeroFrame2] = '';

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic Grid: ', t.NumeroFrame, params);
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'mosaic__grid';

      t.lastCallMosaicGrid2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'mosaic__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (data2 && data2 !== null) {
          if (data2.v_grid_msg !== undefined) {
            t.messaggioWarningMG = data2.v_grid_msg;
          } else {
            t.messaggioWarningMG = '';
          }

          if (data2.message) {
            t.erroreMosaic[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
            // t.datiMosaicGrid = null;
            this.staElaborandoMG[t.NumeroFrame2] = false;
            t.caricamentoMosaicGrid[t.NumeroFrame2] = false;
          } else {
            if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
              t.gridTitleMosaic = data2.GridProperty[0].GridName;
            }

            const data = data2;
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid: Dati Mosaic grid:', t.datiMosaicGrid, data);

            t.vecchiDatiMosaicGrid = data2;

            if (t.datiMosaicGrid && data.DataTable && t.datiMosaicGrid !== null && t.datiMosaicGrid !== 'empty grid') {
              t.datiMosaicGrid.DataTable = data.DataTable;
            } else {
              t.datiMosaicGrid = undefined;
              const tm1 = setTimeout(() => {
                clearTimeout(tm1);

                t.datiMosaicGrid = data;
                const tm = setTimeout(() => {
                  clearTimeout(tm);

                  t.effettuaAutoFitMosaicGrid = !t.effettuaAutoFitMosaicGrid;
                }, 500);
              }, 500);
            }
            // alert('Mosaic caricato');

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia riga selezionata', t.impostaSelezioneClusterGrid);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Contenuto riga selezionata', ExternalUtilities.rigaSelezionataMG);

            const tm = setTimeout(() => {
              clearTimeout(tm);
              
              const nomiColonneMG = new Array();
              if (data.ColumnProperty) {
                data.ColumnProperty.forEach(element => {
                  nomiColonneMG.push(element.headerText);
                });
              }
              t.nomiColonneMG = JSON.parse(JSON.stringify(nomiColonneMG));
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid: Nomi colonne Mosaic Grid', t.nomiColonneMG);

              if (ExternalUtilities.bboxSelected && ExternalUtilities.bboxSelected[0] &&
                ExternalUtilities.bboxSelected[0].NAME) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid: Ricerca vecchia selezione', ExternalUtilities.bboxSelected[0]);

                if (t.datiMosaicGrid) {
                  t.datiMosaicGrid.DataTable.forEach(element => {
                    if (ExternalUtilities.bboxSelected[0].NAME === element.NAME &&
                      ExternalUtilities.bboxSelected[0].SQUARE_SNAP === element.SQUARE_SNAP) {
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid: Trovata riga vecchia selezione', element.ROW_ID);

                      t.impostaSelezioneMosaicGrid = element.ROW_ID;
                    }
                  });
                }
              }
            }, 1000);

            this.staElaborandoMG[t.NumeroFrame2] = false;
            t.caricamentoMosaicGrid[t.NumeroFrame2] = false;
          }
        } else {
          // t.datiMosaicGrid = null;
          this.staElaborandoMG[t.NumeroFrame2] = false;
          t.caricamentoMosaicGrid[t.NumeroFrame2] = false;
        }
      }, error => {
        this.staElaborandoMG[t.NumeroFrame2] = false;
        t.caricamentoMosaicGrid[t.NumeroFrame2] = false;
        t.lastCallMosaicGrid[t.NumeroFrame2] = '';
        // ExternalUtilities.messaggioDiErrore(t.datiMosaicGrid, error);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, error);
        t.datiMosaicGrid = 'ERROR: ' + error?.message; // 'ERROR: ' + error._body; // JSON.stringify(JSON.parse(error._body).message);
      });
    } else {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mosaic grid: Ridisegno vecchi dati', t.NumeroFrame2, t.vecchiDatiMosaicGrid);
    
      // t.datiMosaicGrid = undefined;
      // const tm = setTimeout(() => {
      //   clearTimeout(tm);

        t.datiMosaicGrid = t.vecchiDatiMosaicGrid;
      // }, 500); 
    }
  }

  vecchioParameters = '';

  caricamentoLayerGeometry(t) {
    // logConsole('Mosaic 1');
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }
    
    // logConsole('Mosaic 2');
    // alert('1');
    // // logConsole('Mosaico selezionato da mappa: CLG1 ', t.NumeroFrame2, ExternalUtilities.rigaSelezionataMG);
    if (t.MappaOGraficoTutti2 && t.MappaOGraficoTutti2[t.frameAttivo2] !== 'M' || t.frameVisible2 === false ||
      !ExternalUtilities.bboxSelected || !ExternalUtilities.bboxSelected[0]) {
      t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;
      // return;
    }
    // alert('2');

    // // logConsole('Mosaico selezionato da mappa: CLG2 ', ExternalUtilities.rigaSelezionataMG[0]);

    // logConsole('ExternalUtilities.rigaSelezionataMG', ExternalUtilities.rigaSelezionataMG);

    // logConsole('ExternalUtilities.rigaSelezionataMG', ExternalUtilities.rigaSelezionataMG);
    if (!ExternalUtilities.bboxSelected || !ExternalUtilities.bboxSelected[0] || 
      !ExternalUtilities.bboxSelected[0].SQUARE_SNAP ||
      !ExternalUtilities.bboxSelected[0].COLOR ||
      !ExternalUtilities.bboxSelected[0].NAME) {
      
      t.lastCallLayerGeometryMosaic[t.NumeroFrame2] = '';
      // logConsole('Mosaic 2 Esco', ExternalUtilities.bboxSelected);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }
    // alert('3');

    if (+t.comboSelArea2 === 1) {
      // t.creaLayerBBOX(true);

      if (t.pathLayerBBOX[t.NumeroFrame2]) {
        t.removeLayerFromMap('Path layer BBOX', t.pathLayerBBOX[t.NumeroFrame2]);
        t.pathLayerBBOX[t.NumeroFrame2] = undefined;
      }
      t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;
      t.lastCallLayerGeometryMosaic[t.NumeroFrame2] = '';

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Layer Geometry. Esco per comboSelArea2 = 1', t.NumeroFrame, t.comboSelArea2);
      this.layerAttivo[t.NumeroFrame2] = false;

      // logConsole('Mosaic 6 esco');
      return;
    }

    // logConsole('Mosaic 3');
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

      let n = ExternalUtilities.bboxSelected[0].NAME;
      n = ExternalUtilities.effettuaReplace(n, ',', '\\,');
      n = ExternalUtilities.effettuaReplace(n, '#', '%23');
      while (n.indexOf('#') > -1) {
        n = n.replace('#', '');
      }
      while (n.indexOf('%23') > -1) {
        n = n.replace('%23', '');
      }

      let tipologia = '';
      if (+t.comboSelArea2 === 1) {
        tipologia = 'zoomed_map';
      } else {
        tipologia = 'selected_area';
      }

      // alert('GEOMETRY SU MOSAIC');

      const nomeLayer = 'Geo_ANTS:l_geometry';
      const parametri = 'cntx_id:\'' + t.sessionID2 + '\';' +
        'v_geo_label:\'' + '\';' +
        'v_geo_type:\'' + tipologia + '\';' +
        'v_geo_geometry:\'' + ss + '\';' +
        'v_geo_color:\'' + c + '\';'; // +
        // 'v_chi_mi_chiama:\'mosaic\';';

      const parameters = {
        LAYERS: nomeLayer,
        TILED: false,
        STYLES: 's_geometry',
        VIEWPARAMS: parametri
        // 'CQL_FILTER': act_set + tmsFilter + ' and act_id in (' + act_id + ')'
      };
      // alert('4');

      // logConsole('Mosaic 4', parameters);
      // alert('Carico');
      /* // logConsole('MOSAICO:', parameters, parametri);
      // logConsole('MOSAICO:', ss);
      // logConsole('MOSAICO:', c); */

      const valoriDiBase = ';' + t.dashboardAttiva2 + ';' + t.NumeroFrame + ';' +
        t.frameAttivo + ';';

      let actualCall = 'LAYERMOSAIC;' + JSON.stringify(parameters) + valoriDiBase;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri Layer Geometry Mosaic', actualCall);

      if (t.lastCallLayerGeometryMosaic[t.NumeroFrame2] !== actualCall) {
        t.lastCallLayerGeometryMosaic[t.NumeroFrame2] = actualCall;

        // logConsole('Mosaic 5');
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Layer Geometry', t.NumeroFrame, parameters);

        /* if (t.pathLayerGeometry[t.NumeroFrame2]) {
          t.removeLayerFromMap('Layer path geometry', t.pathLayerGeometry[t.NumeroFrame2]);
          t.pathLayerGeometry[t.NumeroFrame2] = undefined;
        } */

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Layer Geometry. Combo sel area: ', t.NumeroFrame, t.comboSelArea2);

        // logConsole('Disegno layer geometry', t.NumeroFrame2, +t.comboSelArea2);

        /* if (t.MappaOGrafico2 !== 'M' && +t.comboSelArea2 === 1) {
          // t.creaLayerBBOX(true);

          if (t.pathLayerBBOX[t.NumeroFrame2]) {
            t.removeLayerFromMap('Path layer BBOX', t.pathLayerBBOX[t.NumeroFrame2]);
            t.pathLayerBBOX[t.NumeroFrame2] = undefined;
          }
          t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;
          t.lastCallLayerGeometryMosaic[t.NumeroFrame2] = '';

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Layer Geometry. Esco per comboSelArea2 = 1', t.NumeroFrame, t.comboSelArea2);
          this.layerAttivo[t.NumeroFrame2] = false;

          // logConsole('Mosaic 6 esco');
          return;
        } else { */
          /* let q = 0;
          const tt = setInterval(() => {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'wms', wms);
            if (wms.loading === true) {
              q++;
              if (q > 30) {
                // t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;

                clearInterval(tt);
              }
            } else {
              clearInterval(tt); */

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, wms);

              /* if (t.map1[t.NumeroFrame2] && t.vectorMDP) {
                t.map1[t.NumeroFrame2].removeLayer(t.vectorMDP);
              } */
      
              if (t.pathLayerGeometry[t.NumeroFrame2] && t.pathLayerGeometry[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource) {
                const parameters = {
                  LAYERS: nomeLayer,
                  TILED: false,
                  STYLES: 's_geometry',
                  VIEWPARAMS: parametri
                };

                // logConsole('Mosaico finale. Seconda chiamata : ', t.NumeroFrame2, parametri);
                this.layerAttivo[t.NumeroFrame2] = true;

                t.pathLayerGeometry[t.NumeroFrame2].getSource().updateParams(parameters); // .setSource(wms);
                // logConsole('Mosaic 7', parameters);
              } else {
                if (t.pathLayerGeometry[t.NumeroFrame2]) {
                  t.removeLayerFromMap('MosaicGrid', t.pathLayerGeometry[t.NumeroFrame2]);
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
                    // logConsole('Mosaic 1', noCacheUrl);
                    const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                    image.getImage()['src'] = noCacheUrl2;
                  }
                });

                // logConsole('Mosaico finale, prima chiamata: ', t.NumeroFrame2, parameters);

                const newWms = new ImageLayer({
                  source: wms
                });

                /*
                // Gestione errori di caricamento immagine
                wms.on('imageloaderror', (event) => {
                  console.error('Errore durante il caricamento del layer WMS:', event);
                });
                // Evento di inizio caricamento (opzionale, per mostrare un loader ad esempio)
                wms.on('imageloadstart', () => {
                  logConsole('Inizio caricamento WMS...');
                  // ad esempio: mostra un loader/spinner
                });

                // Evento di fine caricamento con successo
                wms.on('imageloadend', () => { */
                  // logConsole('Caricamento WMS completato con successo.');

                  t.addLayerToMap(newWms, 21, 'MosaicGrid');
                  t.pathLayerGeometry[t.NumeroFrame2] = newWms;
                  // nascondi loader, aggiorna UI, ecc.
                // });
                  this.layerAttivo[t.NumeroFrame2] = true;

                // logConsole('Mosaico finale, dopo la chiamata: ', parameters);                
                // logConsole('Mosaic 9', parameters);
              }

              t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;
            /* }
          }, 1000); */
        // }
      /* } else {
        t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri Layer Geometry Mosaic. Esco per query uguale'); */
      }
    }
  }
}

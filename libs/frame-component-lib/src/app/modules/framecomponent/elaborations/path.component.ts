import { logConsole } from '../console-log';
// import { ExternalApiService } from './../services/externalapi.service';
import { transform } from 'ol/proj';
// import { SessionService } from './../../../../db/session.service';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { Injectable } from '@angular/core';
import { METERS_PER_UNIT } from 'ol/proj';
import { environment } from '../../../../environments/environment';

// import GeoJSON from 'ol/format/GeoJSON';
// import VectorTileLayer from 'ol/layer/VectorTile';
// import VectorSource from 'ol/source/Vector';
// import OlMap from 'ol/Map';
// import {Fill, Stroke, Style, Text} from 'ol/style';
import ExternalUtilities from '../ExternalUtilities.component';
// import Utils from '../Utilities.component';

@Injectable()
export class PathComponent {
  // lastCallPath = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallPath2 = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallPath3 = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallPath4 = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallPathSC = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallSartPosition = undefined; // = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallSchedSel = undefined; // = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  /* lastCall = ['', '', '', '', '', '', '', '', '', '',  ''];
  lastCall2 = ['', '', '', '', '', '', '', '', '', '',  ''];
  lastCall3 = ['', '', '', '', '', '', '', '', '', '',  ''];
  lastCall4 = ['', '', '', '', '', '', '', '', '', '',  '']; */

  // agentPosition = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // disegnato = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  // lastCheck = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

  /* ultimaVoltaTMS = -1;
  ultimaVoltaTMS2 = -1;
  ultimaVoltaTMS3 = -1;
  ultimaVoltaTMS4 = -1;
  ultimaVoltaTMS5 = -1;
  ultimaVoltaTMS6 = -1;
  ultimaVoltaTMS7 = -1; */

  GestisceLayerConSetSource1 = true;
  GestisceLayerConSetSource2 = true;
  GestisceLayerConSetSource3 = true;
  GestisceLayerConSetSource4 = true;
  GestisceLayerConSetSource5 = true;
  GestisceLayerConSetSource6 = true;
  GestisceLayerConSetSource7 = true;
  GestisceLayerConSetSource8 = true;
  vecchioOverlay = -1;
  vecchioParameters = '';
  layerAttivo1 = ExternalUtilities.creaVettore(environment.quantePagine, false);
  layerAttivo2 = ExternalUtilities.creaVettore(environment.quantePagine, false);
  layerAttivo3 = ExternalUtilities.creaVettore(environment.quantePagine, false);
  layerAttivo4 = ExternalUtilities.creaVettore(environment.quantePagine, false);
  layerAttivo5 = ExternalUtilities.creaVettore(environment.quantePagine, false);
  layerAttivo6 = ExternalUtilities.creaVettore(environment.quantePagine, false);
  layerAttivo7 = ExternalUtilities.creaVettore(environment.quantePagine, false);
  layerAttivo8 = ExternalUtilities.creaVettore(environment.quantePagine, false);

  constructor(
    // private gestGrafici: GestioneGrafici
    // private sessionService: SessionService,
  ) {
  }

  pulisceAppoggi(t) {
    t.lastCallPath[t.NumeroFrame2] = ''; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    t.lastCallPath2[t.NumeroFrame2] = ''; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    t.lastCallPath3[t.NumeroFrame2] = ''; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    t.lastCallPath4[t.NumeroFrame2] = ''; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    t.lastCallPathSC[t.NumeroFrame2] = ''; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    t.lastCallSartPosition[t.NumeroFrame2] = ''; // = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    t.lastCallSchedSel[t.NumeroFrame2] = ''; // = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    t.agentPosition[t.NumeroFrame2] = -1;
    this.vecchioOverlay = -1;
    this.vecchioParameters = '';

    this.layerAttivo1[t.NumeroFrame2] = false;
    if (t.pathLayerClickato[t.NumeroFrame2]) {
      t.removeLayerFromMap('Path Layer click', t.pathLayerClickato[t.NumeroFrame2]);
      t.pathLayerClickato[t.NumeroFrame2] = undefined;
      // return;
    }
    this.layerAttivo2[t.NumeroFrame2] = false;
    if (t.pathShowRays[t.NumeroFrame2]) {
      t.removeLayerFromMap('Path show rays 2', t.pathShowRays[t.NumeroFrame2]);
      t.pathShowRays[t.NumeroFrame2] = undefined;
    }
    this.layerAttivo3[t.NumeroFrame2] = false;
    if (t.pathServingCell[t.NumeroFrame2]) {
      t.removeLayerFromMap('Path serving cell 2', t.pathServingCell[t.NumeroFrame2]);
      t.pathServingCell[t.NumeroFrame2] = undefined;
    }
    this.layerAttivo4[t.NumeroFrame2] = false;
    if (t.overlayLayer[t.NumeroFrame2]) {
      t.removeLayerFromMap('Overlay layer 2-6', t.overlayLayer[t.NumeroFrame2]);
      t.overlayLayer[t.NumeroFrame2] = undefined;
      // t.staDisegnandoOverlay = false;

      // return;
    }
    this.layerAttivo5[t.NumeroFrame2] = false;
    if (t.overlayLayerGlobal[t.NumeroFrame2]) {
      // logConsole('Elimino layer cluster 4');
      t.removeLayerFromMap('Overlay layer global 2', t.overlayLayerGlobal[t.NumeroFrame2]);
      t.overlayLayerGlobal[t.NumeroFrame2] = undefined;
    }
    this.layerAttivo6[t.NumeroFrame2] = false;
    if (t.pathSartPosition[t.NumeroFrame2]) {
      t.removeLayerFromMap('Path sart position 2', t.pathSartPosition[t.NumeroFrame2]);
      t.pathSartPosition[t.NumeroFrame2] = undefined;
    }
    this.layerAttivo7[t.NumeroFrame2] = false;
    if (t.pathSchedSel[t.NumeroFrame2]) {
      t.removeLayerFromMap('Path sched sel', t.pathSchedSel[t.NumeroFrame2]);
      t.pathSchedSel[t.NumeroFrame2] = undefined;
    }
    this.layerAttivo8[t.NumeroFrame2] = false;
    if (t.pathLayer[t.NumeroFrame2]) {
      t.removeLayerFromMap('PathPoint', t.pathLayer[t.NumeroFrame2]);
      // t.wms[t.NumeroFrame2][0] = undefined;
      t.pathLayer[t.NumeroFrame2] = undefined;
    }
  }

  disegnaPath(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      // logConsole('Esco da disegna path 1');
      this.layerAttivo8[t.NumeroFrame2] = false;
      return;
    }

    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo mappa', t.NumeroFrame2, t.MappaOGrafico2);
      // logConsole('Esco da disegna path 2');
      this.layerAttivo8[t.NumeroFrame2] = false;

      return;
    }
    
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna path: ', t.NumeroFrame2);

    if (t.eseguitoInProgetto2 === true && t.progettoEsterno2.indexOf('DD') > -1) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco perché mi trovo in Data Dictionaries', t.NumeroFrame2);
      // logConsole('Esco da disegna path 3');
      this.layerAttivo8[t.NumeroFrame2] = false;

      return;
    }

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGrafico2 && t.MappaOGrafico2 !== 'M' || aperto === false) {
      t.staDisegnandoPath[t.NumeroFrame2] = false;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: Esco 0', t.NumeroFrame2);
      }
      return;
    } */
   
    if (t.eseguitoInProgetto2 === true) {
      if (t.map1[t.NumeroFrame2]) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: Attivo click su mappa progetto', t.NumeroFrame2);
        /* if (t.map1[t.NumeroFrame2]) {
          // alert('Attivo click 2');
          t.map1[t.NumeroFrame2].un('singleclick', this.clickOnMap);
          t.map1[t.NumeroFrame2].on('singleclick', this.clickOnMap.bind(null, t));
        } */
      }

      /* if (t.permessoFleetManagerAM2 === undefined || t.permessoFleetManagerAM2 === false) {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath. Esco 5');
        }
      } */

      t.staDisegnandoPath[t.NumeroFrame2] = false;
      // logConsole('Esco da disegna path 4');
      this.layerAttivo8[t.NumeroFrame2] = false;

      return;
    }

    if (t.MappaOGrafico2 !== 'M' || t.map1[t.NumeroFrame2]=== undefined || t.frameVisible2 === false) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: Esco perché già sto disegnando', t.NumeroFrame2);
      t.staDisegnandoPath[t.NumeroFrame2] = false;
      // logConsole('Esco da disegna path 5');
      this.layerAttivo8[t.NumeroFrame2] = false;

      return;
    }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS < t.ritardoPerFunzioni && this.ultimaVoltaTMS !== -1) {
      t.staDisegnandoPath = false;
      return;
    }
    this.ultimaVoltaTMS = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: frame ' + t.NumeroFrame + ': ', t.isCheckedShowPaths2);

    if (t.isCheckedShowPaths2 === undefined || t.isCheckedShowPaths2 === null) {
      t.isCheckedShowPaths2 = false;
    }

   /*
    if (t.pathLayer[t.NumeroFrame2]) {
      t.removeLayerFromMap('disegnaPath: Path layer', t.pathLayer[t.NumeroFrame2]);
      t.pathLayer[t.NumeroFrame2] = undefined;
    }
    if (t.wms[t.NumeroFrame2][0]) {
      t.wms[t.NumeroFrame2][0] = undefined;
    }    */

    // alert('Attivo click 1');
    /* t.map1[t.NumeroFrame2].un('singleclick', this.clickOnMap);
    t.map1[t.NumeroFrame2].on('singleclick', this.clickOnMap.bind(null, t)); */
    // this.disegnaPathComeFeature(t);
    // return;

    if (t.ConnessioneStabilita === 'OK') {
      // let act_set = '';
      // let ok = false;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno path:', t.NumeroFrame, t.act_set);
      // if (t.act_set && t.act_set !== '') {
      //   act_set += ' geo_act_set_name = \'' + t.act_set + '\'';

        // const act_id = ExternalUtilities.prendeTuttiIdActSet(t, false, t.Utils);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ACT_ID:', act_id);
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
        let valoreRicerca = '\'' + t.act_set + '\'';
        if (t.tipoDataset2 === 2) {
          valoreRicerca = agnact;
        }
        if (valoreRicerca === undefined || valoreRicerca === null || valoreRicerca === '' || valoreRicerca === '\'undefined\'' || valoreRicerca === '"undefined"') {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: Esco dal l_act_path_point per act set vuoto');
          t.staDisegnandoPath[t.NumeroFrame2] = false;
          // t.staDisegnandoServingCell[t.NumeroFrame2]  = false;
          // logConsole('Esco da disegna path 5', valoreRicerca);
          this.layerAttivo8[t.NumeroFrame2] = false;
    
          return;
        }

        // const sInizio = t.timeRangeDSFStart2;
        // const sFine = t.timeRangeDSFStop2;
        let sInizio = '';
        let sFine = '';
        if (t.timeRangeDSFStart2 && t.timeRangeDSFStop2) {
          // const dInizio = ((new Date(tms).getTime()) - (t.Utils.rangeDiSecondiPerMille)) + (new Date().getTimezoneOffset() * 60000);
          sInizio = t.timeRangeDSFStart2; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
          // const dFine = ((new Date(tms).getTime()) + (t.Utils.rangeDiSecondiPerMille)) + (new Date().getTimezoneOffset() * 60000);
          sFine = t.timeRangeDSFStop2; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
        } else {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.Utils.tmsSelezionato);
          if (t.Utils.tmsSelezionato) {

          }
        }

        if (t.eseguitoInProgetto2 === true) {
          if (t.agnGroup2 === undefined || t.agnGroup2 === 'undefined') {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: Esco dal l_act_path_point per agn vuoto');
            t.staDisegnandoPath[t.NumeroFrame2] = false;
            // t.staDisegnandoServingCell[t.NumeroFrame2]  = false
            // logConsole('Esco da disegna path 6');
            this.layerAttivo8[t.NumeroFrame2] = false;
      
            return;
          }
          valoreRicerca = '\'' + t.agnGroup2 + '\'';
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: AGN Passato', t.agnGroup2);
          }

          if (t.tmsPassatiDaProgettoTcRun2 === undefined || t.tmsPassatiDaProgettoTcRun2 === 'undefined') {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: Esco dal l_act_path_point per tms vuoti');
            }
            t.staDisegnandoPath[t.NumeroFrame2] = false;
            // t.staDisegnandoServingCell[t.NumeroFrame2]  = false;
            // logConsole('Esco da disegna path 7');
            this.layerAttivo8[t.NumeroFrame2] = false;
      
            return;
          }

          const tt = t.tmsPassatiDaProgettoTcRun2.split(';');
          sInizio = tt[0];
          sFine = tt[1];

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: Impostato tmsPassato per chiamata l_act_path_point', t.NumeroFrame2, sInizio, sFine, t.tmsPassatiDaProgettoTcRun2);
        }

        if (!valoreRicerca || valoreRicerca === '' || valoreRicerca === 'undefined') {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: Esco dal l_act_path_point per act set vuoto');
          // logConsole('Esco da disegna path 8', valoreRicerca);
          t.staDisegnandoPath[t.NumeroFrame2] = false;
          // t.staDisegnandoServingCell[t.NumeroFrame2]  = false;
          this.layerAttivo8[t.NumeroFrame2] = false;
    
          return;
        }

        const nomeLayer = 'Geo_ANTS:l_act_path_point';

        // FILTER
        const filtri = ExternalUtilities.prendeFiltri(t, true, 'DisegnaPath');
        const cm1 = filtri.cm1;
        const cm2 = filtri.cm2;
        const tf1 = filtri.tf1;
        const tf2 = filtri.tf2;
        // FILTER

        if (!valoreRicerca || valoreRicerca === '\'undefined\'' || valoreRicerca === 'undefined' || valoreRicerca === 'null' || valoreRicerca === null || valoreRicerca === '' || valoreRicerca === '\'\'') {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Path: Esco per valore ricerca nullo:', valoreRicerca);
          t.staDisegnandoPath[t.NumeroFrame2] = false;
          this.layerAttivo8[t.NumeroFrame2] = false;

          return;
        }
    
        let vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
          'v_act_set_name_list:' + valoreRicerca + ';' +
          'v_tms_min: \'' + sInizio + '\';' +
          'v_tms_max: \'' + sFine + '\';' +
          'v_filter_measr_code_1: ' + cm1 + ';' +
          'v_filter_measr_value_1: ' + tf1 + ';' +
          'v_filter_measr_code_2: ' + cm2 + ';' +
          'v_filter_measr_value_2: ' + tf2 + ';';

        // let bbox = JSON.stringify(ExternalUtilities.prendeBBOXSoloValori(t.map1[t.NumeroFrame2]));
        // let bbox = JSON.stringify(ExternalUtilities.bboxAttualeFisso);
        // bbox = ExternalUtilities.effettuaReplace(bbox, ',', '\\,');

        // const bbox = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
        // vParams += bbox;

        const bbox = ExternalUtilities.ritornaBboxGiusta(t, 'Measures'); // ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
        if (bbox.indexOf('NaN') > -1 || bbox.indexOf('undefined') > -1) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per bbox non valida: ', t.NumeroFrame2, bbox);
          // return;
        }

        // MAIL 22/05/2023 10:18
        // let bb = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';';
        // bb += 'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];
        let bb = 'geoants_bbox_min_x: -180;geoants_bbox_min_y: -90;';
        bb += 'geoants_bbox_max_x: 180;geoants_bbox_max_y: 90;';
        // MAIL 22/05/2023 10:18
        vParams += ';' + bb;
    
        /* if (!bbox || (bbox && bbox.indexOf('-90') > -1 && bbox.indexOf('-180') > - 1)) {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco dal l_act_path_point per bbox immensa');
          }
          t.staDisegnandoPath[t.NumeroFrame2] = false;
          return;
        } */

        // vParams += ';v_bbox:\'' + bbox.replace('[', 'BOX(').replace(']', ')') + '\'';

        const parameters = {
          LAYERS: nomeLayer,
          TILED: false,
          STYLES: 's_act_path_point',
          // CQL_FILTER: act_set + ' and act_id in (' + act_id + ')',
          NUMEROFRAME: t.NumeroFrame2,
          // BBOX: '14.713221,15.393568,14.779739,15.423938',
          VIEWPARAMS: vParams,
          UPDATER: t.cambioDataPerShowPath
        };
        // logConsole('Chiamata path', t.NumeroFrame2, parameters);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PATH', sInizio, sFine);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno path 1', t.NumeroFrame, t.isCheckedShowPaths2);
        // if (t.isCheckedShowPaths2 === true) {
        //   if (t.pathLayer[t.NumeroFrame2]) {
        //     t.removeLayerFromMap(t.pathLayer[t.NumeroFrame2]);
        //    t.pathLayer[t.NumeroFrame2] = undefined;
        //  }
        //    PathComponent.lastCallPath4 = '';
        // } else {
        // const bbox = JSON.stringify(ExternalUtilities.bboxAttualeFisso);

        const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
          t.frameAttivo + ';' + t.isCheckedShowPaths2;
        const actualCall = 'PATH;' + JSON.stringify(parameters) + valoriDiBase;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: frame ' + t.NumeroFrame);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: actual call: ', actualCall);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: last call: ', t.lastCallPath4[t.NumeroFrame2]);

        if (t.isCheckedShowPaths2 === false) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: Esco per check falso');
    
          if (t.pathLayer[t.NumeroFrame2]) {
            t.removeLayerFromMap('disegnaPath: Path layer', t.pathLayer[t.NumeroFrame2]);
            t.lastCallPath4[t.NumeroFrame2] = '';
            t.pathLayer[t.NumeroFrame2] = undefined;
          }
          /* if (t.wms[t.NumeroFrame2][0]) {
            t.wms[t.NumeroFrame2][0] = undefined;
          } */
    
          t.staDisegnandoPath[t.NumeroFrame2] = false;
          // // logConsole('Esco da disegna path 9');
          this.layerAttivo8[t.NumeroFrame2] = false;

          return;
        }
    
        if (t.lastCallPath4[t.NumeroFrame2] !== actualCall) {
          t.lastCallPath4[t.NumeroFrame2] = actualCall;

          /* if (t.pathLayer[t.NumeroFrame2]) {
            t.removeLayerFromMap('Path layer 2', t.pathLayer[t.NumeroFrame2]);
            t.pathLayer[t.NumeroFrame2] = undefined;
          } */

          /* let q = 0;
          const tt = setInterval(() => {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'WMS', wms);
            if (wms.loading === true) {
              q++;
              if (q > 30) {
                t.staDisegnandoPath[t.NumeroFrame2] = false;

                clearInterval(tt);
              }
            } else { */
            
            if (t.pathLayer[t.NumeroFrame2] && t.pathLayer[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource8) {
              // if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: aggiorno path frame ' + t.NumeroFrame + ': ', t.pathLayer[t.NumeroFrame2]);
              // }

              this.layerAttivo8[t.NumeroFrame2] = true;
              t.pathLayer[t.NumeroFrame2].getSource().updateParams(parameters);
            } else {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'disegnaPath: creo path frame ' + t.NumeroFrame);

              if (t.pathLayer[t.NumeroFrame2]) {
                t.removeLayerFromMap('PathPoint', t.pathLayer[t.NumeroFrame2]);
                // t.wms[t.NumeroFrame2][0] = undefined;
                t.pathLayer[t.NumeroFrame2] = undefined;
              }

              // t.wms[t.NumeroFrame2][0] = new ImageWMS({
              const wms = new ImageWMS({
                ratio: 1, // immagine grande quanto la mappa (default 1.5 = 2,25x i pixel)
                url: t.Utils.indirizzoGEOServer + t.urlWms,
                projection: 'EPSG:4326',
                // renderer: 'antialias: true;',
                params: parameters,
                serverType: 'geoserver',
                /* tileLoadFunction: function (image, src) {
                  const img = image.getImage();
                  const query = src.replace(t.url + '?', '');
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, src);
                  img.src = src;
                } */

                // Sovrascrivere l'URL per evitare la cache
                imageLoadFunction: (image, src) => {
                  if (!this.layerAttivo8[t.NumeroFrame2]) { return; }

                  const timestamp = new Date().getTime();
                  const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                  const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                  image.getImage()['src'] = noCacheUrl2;
                }
              });

              const newWms = new ImageLayer({
                source: wms // t.wms[t.NumeroFrame2][0]
              });

              t.addLayerToMap(newWms, 7, 'PathPoint');
              t.pathLayer[t.NumeroFrame2] = newWms;
              this.layerAttivo8[t.NumeroFrame2] = true;
            }

            t.staDisegnandoPath[t.NumeroFrame2] = false;

              /* clearInterval(tt);
            }
          }, 1000); */

          /* const ritornoWMS = wms.getSource();
          ritornoWMS.on('imageloadend', function(event) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'imageloadend event',event);
          });
          ritornoWMS.on('imageloaderror', function(event) {
          }); */


          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_set);
          /* t.Utils.layerPath[t.frameAttivo][t.NumeroFrame] = new VectorLayer({
            source: new VectorSource({
              url: t.Utils.indirizzoGEOServer + 'Geo_ANTS/ows?service=WFS&version=
                1.0.0&request=GetFeature&typeName=Geo_ANTS:l_act_path_point&outputFormat=application/json&CQL_FILTER=' + act_set,
              format: new GeoJSON()
            })
          }); */

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.layerPath[t.frameAttivo][t.NumeroFrame]);

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Hide path', t.NumeroFrame, t.isCheckedShowPaths2);
          // if (!t.isCheckedShowPaths2 || t.isCheckedShowPaths2 === false) {

          // } else {
          //   if (t.pathLayer[t.NumeroFrame2]) {
          //     t.removeLayerFromMap(t.pathLayer[t.NumeroFrame2]);
          //     t.pathLayer[t.NumeroFrame2] = undefined;
          //   }
          // }

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Path', t.NumeroFrame, wms);
          // ok = true;

          // if (ok === true && t.map1[t.NumeroFrame2]) {

            // t.map1[t.NumeroFrame2].un('pointermove', this.pointerMove);
            // t.map1[t.NumeroFrame2].on('pointermove', this.pointerMove.bind(null, t));
            // }
        // }

        // } else {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco senza disegnare il path. Stesso filtro', t.NumeroFrame);
        //   t.staDisegnandoPath[t.NumeroFrame2] = false;
        // }
      // } else {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Act set vuoto', t.NumeroFrame);
      //  if (t.pathLayer[t.NumeroFrame2]) {
      //    t.removeLayerFromMap(t.pathLayer[t.NumeroFrame2]);
      //    t.pathLayer[t.NumeroFrame2] = undefined;
      //  }
      //  t.staDisegnandoPath = false;
      // }

      /* t.map1[t.NumeroFrame2].on('pointermove', (evt) => {
        if (evt.dragging) {
          return;
        }
        const pixel = t.map1[t.NumeroFrame2].getEventPixel(evt.originalEvent);
        const hit = t.map1[t.NumeroFrame2].forEachLayerAtPixel(pixel, function(e) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e.values_.source);
          return true;
        });
        t.map1[t.NumeroFrame2].getTargetElement().style.cursor = hit ? 'pointer' : '';
        }); */
      } else {
        t.staDisegnandoPath[t.NumeroFrame2] = false;
      }
    } else {
      t.staDisegnandoPath[t.NumeroFrame2] = false;
    }
  }

  disegnaPathClickato(t, tms) {
    // logConsole('Path clickato 1', t.NumeroFrame2);

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo1[t.NumeroFrame2] = false;

      return;
    }

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    } */
    // logConsole('Path clickato 2', t.NumeroFrame2);
    
    if (t.MappaOGrafico2 && t.MappaOGrafico2 !== 'M' // || aperto === false
      || t.eseguitoInProgetto2 === true) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Path clickato Esco 1', t.NumeroFrame2);
      t.staDisegnandoPathClickato[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna path clickato: frame ' + t.NumeroFrame + '. Esco 1');
      this.layerAttivo1[t.NumeroFrame2] = false;

      return;
    }

    // logConsole('Path clickato 3', t.NumeroFrame2);
    
    if (!tms || t.eseguitoInProgetto2 === true) {
      t.staDisegnandoPathClickato[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna path clickato: frame ' + t.NumeroFrame + '. Esco 1-5');
      this.layerAttivo1[t.NumeroFrame2] = false;

      return;
    }

    // logConsole('Path clickato 4', t.NumeroFrame2);
    
    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      if (t.pathLayerClickato[t.NumeroFrame2]) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Rimuovo', t.NumeroFrame);
        t.removeLayerFromMap('Path layer clickato', t.pathLayerClickato[t.NumeroFrame2]);
        // t.pathLayerClickato[t.NumeroFrame2] = undefined;
      }
      t.staDisegnandoPathClickato[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna path clickato: frame ' + t.NumeroFrame + '. Esco 2');
      this.layerAttivo1[t.NumeroFrame2] = false;

      return;
    }

    // logConsole('Path clickato 5', t.NumeroFrame2);
    
    if (!tms) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna path clickato: frame ' + t.NumeroFrame + '. Esco per tms nullo');

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Path clickato Esco 2', t.NumeroFrame2);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, tms);
      t.staDisegnandoPathClickato[t.NumeroFrame2] = false;
      this.layerAttivo1[t.NumeroFrame2] = false;

      return;
    }
    // if (!this.fattoClickSuMappa) {
    //   return;
    // }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS2 < t.ritardoPerFunzioni && this.ultimaVoltaTMS2 !== -1) {
      t.staDisegnandoPathClickato = false;
      return;
    }
    this.ultimaVoltaTMS2 = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    // logConsole('Path clickato 6', t.isCheckedShowSelectedPaths2);
    
    if (!t.isCheckedShowSelectedPaths2) {
      t.lastCallPath[t.NumeroFrame2] = '';
      if (t.pathLayerClickato[t.NumeroFrame2]) {
        t.removeLayerFromMap('Path Layer click', t.pathLayerClickato[t.NumeroFrame2]);
        t.pathLayerClickato[t.NumeroFrame2] = undefined;
      }
      t.staDisegnandoPathClickato[t.NumeroFrame2] = false;
      this.layerAttivo1[t.NumeroFrame2] = false;

      return;
    }

    if (t.ConnessioneStabilita === 'OK') {
      // let act_set = '';
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.act_set);
      // if (t.act_set) {
        // act_set += ' geo_act_set_name = \'' + t.act_set + '\'';

      // if (t.strutturaClick) {
        if (tms) {
          const nomeLayer = 'Geo_ANTS:l_act_path_point';

          let sla = '';
          
          if (t.strutturaClick) {
            sla = t.strutturaClick.geo_sla_name;
          }
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Path clickato Sla Name:', sla);
          if (sla !== '') {
            sla = ' and geo_sla_name = \'' + sla + '\' ';
          }

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.strutturaClick);
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TMS: ', new Date(tms).getTime());

          let sInizio = '';
          let sFine = '';


          // Modifica 10/07/2025
          /* if (+t.timeFilter === 1 || t.timeFilter2 === 'All') {
            sInizio = t.timeRangeDSFStart2;
            sFine = t.timeRangeDSFStop2;
          } else {
            sInizio = t.Utils.tmsInizio;
            sFine = t.Utils.tmsFine;
          } */

          if (t.Utils.tmsInizio && t.Utils.tmsFine) {
            // const dInizio = ((new Date(tms).getTime()) - (t.Utils.rangeDiSecondiPerMille)) + (new Date().getTimezoneOffset() * 60000);
            sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
            // const dFine = ((new Date(tms).getTime()) + (t.Utils.rangeDiSecondiPerMille)) + (new Date().getTimezoneOffset() * 60000);
            sFine = t.Utils.tmsFine; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
          } else {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.Utils.tmsSelezionato);
            if (t.Utils.tmsSelezionato) {

            }
          }
          // Modifica 10/07/2025

          // const sInizio = t.timeRangeDSFStart2;
          // const sFine = t.timeRangeDSFStop2;

          // const tmsFilter = ' and tms between \'' + sInizio + '\' and \'' + sFine + '\'';

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
          let valoreRicerca = '\'' + t.act_set + '\'';
          if (t.tipoDataset2 === 2) {
            valoreRicerca = agnact;
          }

          if (t.debug2) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna path clickato frame ' + t.NumeroFrame, valoreRicerca, tms, sInizio, sFine);
          }

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, tmsFilter);

          // FILTER
          const filtri = ExternalUtilities.prendeFiltri(t, true, 'DisegnaServingCell2');
          const cm1 = filtri.cm1;
          const cm2 = filtri.cm2;
          const tf1 = filtri.tf1;
          const tf2 = filtri.tf2;
          // FILTER

          let vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
            'v_act_set_name_list:' + valoreRicerca + ';' +
            'v_tms_min: \'' + sInizio + '\';' +
            'v_tms_max: \'' + sFine + '\';' +
            'v_filter_measr_code_1: ' + cm1 + ';' +
            'v_filter_measr_value_1: ' + tf1 + ';' +
            'v_filter_measr_code_2: ' + cm2 + ';' +
            'v_filter_measr_value_2: ' + tf2 + ';';

          /* let vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
            'v_act_set_name_list:' + valoreRicerca + ';' +
            'v_tms_min:\'' + sInizio + '\';' +
            'v_tms_max:\'' + sFine + '\''; */

          // let bbox = JSON.stringify(ExternalUtilities.prendeBBOXSoloValori(t.map1[t.NumeroFrame2]));
          /* let bbox = JSON.stringify(ExternalUtilities.bboxAttualeFisso);
          bbox = ExternalUtilities.effettuaReplace(bbox, ',', '\\,');
          const bb = bbox.replace('[', 'BOX(').replace(']', ')'); */

          /* const bb = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);

          if (bb === '""' || bb === '' || bb === 'BOX()' || bb.indexOf('NaN') > -1) {
            t.staDisegnandoPathClickato[t.NumeroFrame2] = false;
            return;
          } */

          const bbox = ExternalUtilities.ritornaBboxGiusta(t, 'Measures'); // ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
          if (bbox.indexOf('NaN') > -1 || bbox.indexOf('undefined') > -1) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per bbox non valida: ', t.NumeroFrame2, bbox);
            // return;
          }

          // MAIL 22/05/2023 10:18
          // let bb = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';';
          // bb += 'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];
          let bb = 'geoants_bbox_min_x: -180;geoants_bbox_min_y: -90;';
          bb += 'geoants_bbox_max_x: 180;geoants_bbox_max_y: 90;';
          // MAIL 22/05/2023 10:18
          vParams += ';' + bb;
      
          // vParams += bb;
          // vParams += ';v_bbox:\'' + bb + '\'';

          while(vParams.indexOf(';;') > -1) {
            vParams = vParams.replace(';;', ';');
          }
      
          const parameters = {
            LAYERS: nomeLayer,
            TILED: false,
            STYLES: 's_act_path_selected',
            // CQL_FILTER: act_set + sla + tmsFilter
            NUMEROFRAME: t.NumeroFrame2,
            VIEWPARAMS: vParams
          };

          // if (t.isCheckedShowPaths2 === true) {
          //   if (t.pathLayerClickato[t.NumeroFrame2]) {
          //     t.removeLayerFromMap(t.pathLayerClickato[t.NumeroFrame2]);
              // t.pathLayerClickato[t.NumeroFrame2] = undefined;
          //  }
          //   PathComponent.lastCallPath = '';
          // } else {
          const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
            t.frameAttivo + ';' + t.act_set + ';';

          const actualCall = 'PATH_CLICKATO;' + JSON.stringify(parameters) + valoriDiBase;

          // logConsole('Path clickato 7', parameters);

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna path clickato: frame ' + t.NumeroFrame + '. Parametri: ', actualCall);

          if (t.lastCallPath[t.NumeroFrame2] !== actualCall) {
            t.lastCallPath[t.NumeroFrame2] = actualCall;

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno path clickato. Frame', t.NumeroFrame, parameters);

            // if (t.pathLayerClickato[t.NumeroFrame2]) {
            //   t.removeLayerFromMap(t.pathLayerClickato[t.NumeroFrame2]);
              // t.pathLayerClickato[t.NumeroFrame2] = undefined;
            // }
            /* if (t.pathLayerClickato[t.NumeroFrame2]) {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Rimuovo', t.NumeroFrame);
              t.removeLayerFromMap('Path layer clickato 2', t.pathLayerClickato[t.NumeroFrame2]);
              // t.pathLayerClickato[t.NumeroFrame2] = undefined;
            } */

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Hide path clickato', t.NumeroFrame, t.isCheckedShowPaths2);

            /* let q = 0;
            const tt = setInterval(() => {
              if (wms.loading === true) {
                q++;
                if (q > 30) {
                  t.staDisegnandoPathClickato[t.NumeroFrame2] = false;

                  clearInterval(tt);
                }
              } else {
                clearInterval(tt); */

                // logConsole('Path clickato 8');

                if (t.pathLayerClickato[t.NumeroFrame2] && this.GestisceLayerConSetSource1) {
                  const parameters = {
                    LAYERS: nomeLayer,
                    TILED: false,
                    STYLES: 's_act_path_selected',
                    NUMEROFRAME: t.NumeroFrame2,
                    VIEWPARAMS: vParams
                  };

                  this.layerAttivo1[t.NumeroFrame2] = true;
                  // logConsole('Aggiornamento path clickato', parameters);
                  t.pathLayerClickato[t.NumeroFrame2].getSource().updateParams(parameters); // .setSource(wms);
                } else {
                  // if (!this.GestisceLayerConSetSource1) {
                  //   if (t.isCheckedShowPaths2 && t.isCheckedShowPaths2 === true) {
                  //   } else {
                      // t.lastCallPath[t.NumeroFrame2] = '';
                      // t.staDisegnandoPathClickato[t.NumeroFrame2] = false;
                      if (t.pathLayerClickato[t.NumeroFrame2]) {
                        t.removeLayerFromMap('Path Layer click', t.pathLayerClickato[t.NumeroFrame2]);
                        t.pathLayerClickato[t.NumeroFrame2] = undefined;
                        // return;
                      }
                  //   }
                  // }

                  const wms = new ImageWMS({
                    ratio: 1, // immagine grande quanto la mappa (default 1.5 = 2,25x i pixel)
                    url: t.Utils.indirizzoGEOServer + t.urlWms,
                    projection: 'EPSG:4326',
                    // renderer: 'antialias: true;',
                    params: parameters,
                    serverType: 'geoserver',
                    /* tileLoadFunction: function (image, src) {
                      const img = image.getImage();
                      const query = src.replace(this.url + '?', '');
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, src);
                      img.src = src;
                    } */

                    // Sovrascrivere l'URL per evitare la cache
                    imageLoadFunction: (image, src) => {
                      if (!this.layerAttivo1[t.NumeroFrame2]) { return; }

                      const timestamp = new Date().getTime();
                      const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                      const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                      image.getImage()['src'] = noCacheUrl2;
                    }
                  });
                  const newWms = new ImageLayer({
                    source: wms
                  });
                  t.pathWmsClickato = wms;

                  t.addLayerToMap(newWms, 18, 'PathClickato');
                  t.pathLayerClickato[t.NumeroFrame2] = newWms;
                  this.layerAttivo1[t.NumeroFrame2] = true;

                  // logConsole('Creazione path clickato', parameters);
                }

                t.staDisegnandoPathClickato[t.NumeroFrame2] = false;

              /* }
            }, 1000); */
          } else {
            t.staDisegnandoPathClickato[t.NumeroFrame2] = false;
          }
        // }
      //   } else {
      //    t.staDisegnandoPathClickato = false;
      //  }
        // }
      } else {
        // if (t.pathLayerClickato[t.NumeroFrame2]) {
        //   t.removeLayerFromMap(t.pathLayerClickato[t.NumeroFrame2]);
        //   // t.pathLayerClickato[t.NumeroFrame2] = undefined;
        // }
        t.staDisegnandoPathClickato[t.NumeroFrame2] = false;
      }
    }
  }

  disegnaShowRays(t, tms) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo2[t.NumeroFrame2] = false;

      return;
    }

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    } */
    if (t.MappaOGrafico2 && t.MappaOGrafico2 !== 'M') { // || aperto === false) {
      t.staDisegnandoShowRays[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna show rays: Esco 0', t.MappaOGrafico2);
      this.layerAttivo2[t.NumeroFrame2] = false;

      return;
    }

    if (!tms || t.eseguitoInProgetto2 === true) {
      t.staDisegnandoShowRays[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna show rays: frame ' + t.NumeroFrame + '. Esco 1');
      this.layerAttivo2[t.NumeroFrame2] = false;

      return;
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna show rays 1', t.MappaOGrafico2, t.frameVisible2);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna show rays 2', t.NumeroFrame, t.showRays2);

    if (t.showRays2 === undefined || t.showRays2 === null) {
      t.showRays2 = false;
    }

    /* if (t.pathShowRays) {
      t.removeLayerFromMap('Elimino Path show rays', t.pathShowRays);
      t.pathShowRays = undefined;
    } */

    if (t.showRays2 === false) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito da show rays perché flag non impostato', t.NumeroFrame2, t.showRays2);

      t.lastCallPathSC[t.NumeroFrame2] = '';
      t.staDisegnandoShowRays[t.NumeroFrame2] = false;
      this.layerAttivo2[t.NumeroFrame2] = false;

      return;
    }
    // }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS3 < t.ritardoPerFunzioni && this.ultimaVoltaTMS3 !== -1) {
      t.staDisegnandoShowRays = false;
      return;
    }
    this.ultimaVoltaTMS3 = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    if (t.ConnessioneStabilita === 'OK') {
      const act = ExternalUtilities.prendeActivitySceltaCellMeasures(t, t.Utils);

      // let act_set = '';
      // if (t.act_set) {
      //   act_set += ' geo_act_set_id= ' + act + '';

      // if (tms) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Sto eseguendo show rays');

        const nomeLayer = 'Geo_ANTS:l_act_path_cell_point';

        // const act_id = ExternalUtilities.prendeTuttiIdActSet(t, true, t.Utils);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_id);

        const tm3 = tms.toString().replace('T', ' ').replace('Z', ' ');
        const tms2 = t.datePipe.transform(tm3.replace('T', ' ').replace('Z', ' ') + ' UTC +00', 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

        const tmsFilter = ' and tms <= \'' + tms2 + '\' and \'' + tms2 + '\' < tms_next';

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
        let valoreRicerca = '\'' + t.act_set + '\'';
        if (t.tipoDataset2 === 2) {
          valoreRicerca = agnact;
        }

        const parametri = 'cntx_id:\'' + t.sessionID2 + '\';' +
          'v_act_id_list:' + valoreRicerca + ';' +
          'v_tms: \'' + tms2 + '\'';

        const parameters = {
          LAYERS: nomeLayer,
          TILED: false,
          VIEWPARAMS: parametri
          // 'CQL_FILTER': act_set + tmsFilter + ' and act_id in (' + act_id + ')'
        };
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, parametri);

        const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
          t.frameAttivo + ';' + t.showRays2;

        const actualCall = 'SHOWRAYS;' + JSON.stringify(parameters) + valoriDiBase;
        if (t.lastCallPathSC[t.NumeroFrame2] !== actualCall) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno show rays cell. Frame', t.NumeroFrame, PathComponent.lastCallPathSC, actualCall);
          t.lastCallPathSC[t.NumeroFrame2] = actualCall;

          /* let q = 0;
          const tt = setInterval(() => {
            if (wms.loading === true) {
              q++;
              if (q > 30) {
                t.staDisegnandoShowRays[t.NumeroFrame2] = false;

                clearInterval(tt);
              }
            } else { */

              if (t.pathShowRays[t.NumeroFrame2] && t.pathShowRays[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource2) {
                const parameters = {
                  LAYERS: nomeLayer,
                  TILED: false,
                  VIEWPARAMS: parametri
                  // 'CQL_FILTER': act_set + tmsFilter + ' and act_id in (' + act_id + ')'
                };

                this.layerAttivo2[t.NumeroFrame2] = true;
                t.pathShowRays[t.NumeroFrame2].getSource().updateParams(parameters); // .setSource(wms);

                // logConsole('Aggiorno Act_path cell point', parametri);
              } else {
                // if (!this.GestisceLayerConSetSource2) {
                  if (t.pathShowRays[t.NumeroFrame2]) {
                    t.removeLayerFromMap('Path show rays 2', t.pathShowRays[t.NumeroFrame2]);
                    t.pathShowRays[t.NumeroFrame2] = undefined;
                  }
                // }
  
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show rays path', t.NumeroFrame2, parameters);
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
                    if (!this.layerAttivo2[t.NumeroFrame2]) { return; }

                    const timestamp = new Date().getTime();
                    const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                    const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                    image.getImage()['src'] = noCacheUrl2;
                  }
                });
  
                const newWms = new ImageLayer({
                  source: wms
                });

                t.addLayerToMap(newWms, 16, 'ShowRays');
                t.pathShowRays[t.NumeroFrame2] = newWms;
                this.layerAttivo2[t.NumeroFrame2] = true;

                // logConsole('Creo Act_path cell point', parametri);
              }

              t.staDisegnandoShowRays[t.NumeroFrame2] = false;

              /* clearInterval(tt);
            }
          }, 1000); */

        } else {
          // t.addLayerToMap(t.pathShowRays, 16, 'ShowRays');
          t.staDisegnandoShowRays[t.NumeroFrame2] = false;
        }
      // } else {
      //   t.staDisegnandoShowRays[t.NumeroFrame2] = false;
      // }
      // } else {
      //   t.staDisegnandoShowRays = false;
      // }
    }
  }

  disegnaServingCell(t, tms) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Serving cell: Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo3[t.NumeroFrame2] = false;

      return;
    }

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    } */
    if (t.MappaOGrafico2 && t.MappaOGrafico2 !== 'M') { // || aperto === false) {
      t.staDisegnandoServingCell[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Serving cell: esco 0', t.NumeroFrame2);
      this.layerAttivo3[t.NumeroFrame2] = false;

      return;
    }

    if (!tms || t.eseguitoInProgetto2 === true) {
      t.staDisegnandoServingCell[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Serving cell: frame ' + t.NumeroFrame + '. Esco 1');
      this.layerAttivo3[t.NumeroFrame2] = false;

      return;
    }

    if (!t.isCheckedServingCell2 || t.isCheckedServingCell2 === false || t.isCheckedServingCell2 === null) {
      t.isCheckedServingCell2 = false;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna serving cell', t.NumeroFrame, t.isCheckedServingCell2, t.pathServingCell);
    /*
    if (t.pathServingCell) {
      t.removeLayerFromMap('Path serving cell', t.pathServingCell);
      t.pathServingCell = undefined;
    }
    PathComponent.lastCallPath2[t.NumeroFrame] = '';
    t.staDisegnandoServingCell[t.NumeroFrame2] = false;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Rimosso serving cell', t.NumeroFrame);
    */

    if (!t.isCheckedServingCell2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Serving cell: esco per check non valido', t.isCheckedServingCell2);

      // if (this.disegnato[t.NumeroFrame2] === true) {
      //   this.disegnato[t.NumeroFrame2] = false;

      if (t.pathServingCell[t.NumeroFrame2]) {
        t.removeLayerFromMap('Path serving cell', t.pathServingCell[t.NumeroFrame2]);
        t.pathServingCell[t.NumeroFrame2] = undefined;
      }

      t.lastCallPath2[t.NumeroFrame2] = '';
      t.staDisegnandoServingCell[t.NumeroFrame2] = false;
      this.layerAttivo3[t.NumeroFrame2] = false;

      return;
    }
    // this.lastCheck[t.NumeroFrame] = true;

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS4 < t.ritardoPerFunzioni && this.ultimaVoltaTMS4 !== -1) {
      t.staDisegnandoServingCell = false;
      return;
    }
    this.ultimaVoltaTMS4 = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna serving cell frame ' + this.NumeroFrame);
    // if (!this.fattoClickSuMappa) {
    //   return;
    // }

    if (t.ConnessioneStabilita === 'OK') {
      const act = ExternalUtilities.prendeActivitySceltaCellMeasures(t, t.Utils);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Click:', act);

      // let act_set = '';
      // if (t.act_set) {
      const act_set = ' geo_act_set_id= \'' + act + '\'';

        // if (t.strutturaClick) {
      if (tms) {
        const nomeLayer = 'Geo_ANTS:l_act_path_cell';

        // let sla = t.strutturaClick.geo_sla_name;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Path clickato Sla Name:', sla);
        // if (sla !== '') {
        //   sla = ' and geo_sla_name = \'' + sla + '\'';
        // }

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.strutturaClick);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TMS: ', new Date(tms).getTime());
        // const dInizio = ((new Date(tms).getTime()) - (t.Utils.rangeDiSecondiPerMille)) + (new Date().getTimezoneOffset() * 60000);
        // const sInizio = t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        // const dFine = ((new Date(tms).getTime()) + (t.Utils.rangeDiSecondiPerMille)) + (new Date().getTimezoneOffset() * 60000);
        // const sFine = t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        // const tmsFilter = ' and tms between \'' + t.Utils.tmsInizio + '\' and \'' + t.Utils.tmsFine + '\'';
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tmsFilter);

        let cell_type = '';
        if (t.cellType2) {
          /* const ct = t.cellType2.split(',');
          ct.forEach(element => {
            t.datiLookUp2.DataTable.forEach(element2 => {
              if (+element === +element2.CODE) {
                cell_type += '\'' + element2.VALUE_STR + '\',';
              }
            });
          }); */
          const ct = JSON.parse(t.cellType2);
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, ct);
          ct.forEach(element => {
            cell_type += element.VALUE_STR + '\\,';
          });
          if (cell_type.length > 0) {
            cell_type = cell_type.substring(0, cell_type.length - 2);
          }
          // cell_type = ' and cell_type in (' + cell_type + ')';
        } else {
          // cell_type = ' and cell_type = \'NONE\'';
          cell_type = 'NONE';
        }

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.cellType2, cell_type);
        // if (t.Activity2 === -1) {
        //   t.Activity2 = 1; // IMPOSTATO PERCHE' IN QUESTA MASCHERA ERA SEMPRE -1... RICONTROLLARE IN FUTURO
        // }

        /* let agnact = '';
        if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
          agnact = 'null';
        } else {
          agnact = '' + ExternalUtilities.stringaAGNoACT + '\'';
        }
        let valoreRicerca = '\'' + t.act_set + '\'';
        if (t.tipoDataset2 === 2) {
          valoreRicerca = agnact;
        } */

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

        let valoreRicerca = '';
        if (t.act_set) {
          if (t.act_set.indexOf('\'') === -1) {
            valoreRicerca = '\'' + t.act_set + '\'';
          } else {
            valoreRicerca = t.act_set;
          }
        }

        if (t.tipoDataset2 === 2) {
          valoreRicerca = agnact;
        }

        let misura = '';
        // logConsole('Serving cell', t.measureRCM2, typeof(t.measureRCM2));
        if (typeof(t.measureRCM2) === 'number') {
          misura = '\'' + t.measureRCM2.toString() + '\'';
        } else {
          if (typeof(t.measureRCM2) === 'string') {
            if (t.measureRCM2.indexOf('\'') === -1) {
              misura = '\'' + t.measureRCM2 + '\'';
            } else {
              misura = t.measureRCM2;
            }
          } else {
            // logConsole('t.measureRCM2 NON VALIDO', t.measureRCM2);
            misura = null;
          }
        }

        if (!misura || misura === '\'-1\'') { misura = null; }

        if (misura === '\'global_measure\'') {
          misura = null;
          t.measureData2.forEach(element2 => {
            if (t.Utils.globalMeasure) {
              if (element2.CODE === t.Utils.globalMeasure.MEASR_CODE) {
                misura = '\'' + element2.CODE.replace('"', '').replace('"', '') + '\'';
              }
            }
          });
        }
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura act_path_cell', misura)

        // FILTER
        const filtri = ExternalUtilities.prendeFiltri(t, true, 'DisegnaServingCell');
        const cm1 = filtri.cm1;
        const cm2 = filtri.cm2;
        const tf1 = filtri.tf1;
        const tf2 = filtri.tf2;
        // FILTER

        let tempo = '';
        if (+t.timeFilter === 1 || t.timeFilter2 === 'All') {
          tempo = 'v_tms_min:\'' + t.timeRangeDSFStart2 + '\';';
          tempo += 'v_tms_max:\'' + t.timeRangeDSFStop2 + '\';';
        } else {
          tempo = 'v_tms_min:\'' + t.Utils.tmsInizio + '\';';
          tempo += 'v_tms_max:\'' + t.Utils.tmsFine + '\';';
        }

        let parametri = 'cntx_id:\'' + t.sessionID2 + '\';' +
          'v_act_set_name_list:' + valoreRicerca + ';' +
          tempo +
          'v_cell_type_list: \'' + cell_type + '\';' +
          'v_filter_measr_code_1: ' + cm1 + ';' +
          'v_filter_measr_code_2: ' + cm2 + ';' +
          'v_filter_measr_value_1: ' + tf1 + ';' +
          'v_filter_measr_value_2: ' + tf2 + ';' +    
          'v_measr_code: ' + misura;

        if (ExternalUtilities.bboxStringa=== '' || (ExternalUtilities.bboxStringa.indexOf(':-90') > -1 && (ExternalUtilities.bboxStringa.indexOf(':-180') > -1))) {
          t.staDisegnandoServingCell[t.NumeroFrame2] = false;
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Serving cell: Esco per bbox non valida', ExternalUtilities.bboxStringa);
          this.layerAttivo3[t.NumeroFrame2] = false;

          return;
        }

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Serving cell: BBOX act path cell', ExternalUtilities.bboxStringa);

        const bbox = ExternalUtilities.bboxStringa; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
        parametri += ';' + bbox;

        const parameters = {
          LAYERS: nomeLayer,
          TILED: false,
          VIEWPARAMS: parametri
          // 'CQL_FILTER': act_set + sla + tmsFilter
          // CQL_FILTER: act_set + tmsFilter + cell_type
        };

        // return;

        const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
          t.frameAttivo + ';';

        const actualCall = 'CELL;' + JSON.stringify(parameters) + valoriDiBase;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Serving cell: Act path cell', actualCall);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Serving cell: Last call', t.lastCallPath2[t.NumeroFrame2]);

        if (t.lastCallPath2[t.NumeroFrame2] !== actualCall) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno serving cell. Frame', t.NumeroFrame, PathComponent.lastCallPath2[t.NumeroFrame], actualCall);
          t.lastCallPath2[t.NumeroFrame2] = actualCall;

          /* if (t.pathServingCell) {
            t.removeLayerFromMap('Path serving cell 2', t.pathServingCell);
            t.pathServingCell = undefined;
          }
          if (t.pathServingCell) {
            t.removeLayerFromMap('Path serving cell', t.pathServingCell);
            t.pathServingCell = undefined;
          } */

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Serving cell: Carico', t.NumeroFrame2, parameters);

          /* let q = 0;
          const tt = setInterval(() => {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'wms', wms);
            if (wms.loading === true) {
              q++;
              if (q > 30) {
                t.staDisegnandoServingCell[t.NumeroFrame2] = false;

                clearInterval(tt);
              }
            } else {
              clearInterval(tt); */

              // t.pathServingCell = wms;

              // logConsole('Controllo Act_path cell', t.pathServingCell, this.GestisceLayerConSetSource3);
              if (t.pathServingCell[t.NumeroFrame2] && this.GestisceLayerConSetSource3) {
                const parameters = {
                  LAYERS: nomeLayer,
                  TILED: false,
                  VIEWPARAMS: parametri
                  // 'CQL_FILTER': act_set + sla + tmsFilter
                  // CQL_FILTER: act_set + tmsFilter + cell_type
                };
        
                this.layerAttivo3[t.NumeroFrame2] = true;
                t.pathServingCell[t.NumeroFrame2].getSource().updateParams(parameters); // .setSource(wms);
                // logConsole('Aggiorno Act_path cell', parametri);
              } else {
                if (t.pathServingCell[t.NumeroFrame2]) {
                  t.removeLayerFromMap('Path serving cell 2', t.pathServingCell[t.NumeroFrame2]);
                  t.pathServingCell[t.NumeroFrame2] = undefined;
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
                    if (!this.layerAttivo3[t.NumeroFrame2]) { return; }

                    const timestamp = new Date().getTime();
                    const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                    const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                    image.getImage()['src'] = noCacheUrl2;
                  }
                });

                const newWms = new ImageLayer({
                  source: wms
                });

                t.addLayerToMap(newWms, 6, 'ServingCell');
                t.pathServingCell[t.NumeroFrame2] = newWms;
                this.layerAttivo3[t.NumeroFrame2] = true;

                // logConsole('Creo Act_path cell', parametri);
              }
              // this.disegnato[t.NumeroFrame2] = true;

              t.staDisegnandoServingCell[t.NumeroFrame2] = false;
            /* }
          }, 1000); */

        } else {
          t.staDisegnandoServingCell[t.NumeroFrame2] = false;
        }
      } else {
        t.staDisegnandoServingCell[t.NumeroFrame2] = false;
      }
      // } else {
      //   t.staDisegnandoServingCell = false;
      // }
      // } else {
      //   if (t.pathServingCell) {
      //     t.removeLayerFromMap(t.pathServingCell);
      //     t.pathServingCell = undefined;
      //   }
      // }
    }
  }

  mapScale(t, dpi) {
    const unit = t.map1[t.NumeroFrame2].getView().getProjection().getUnits();
    const resolution = t.map1[t.NumeroFrame2].getView().getResolution();
    const inchesPerMetre = 39.37;

    return resolution * METERS_PER_UNIT[unit] * inchesPerMetre * dpi;
  }

  disegnaOverlay(t) {
    // logConsole('Overlay 1', t.NumeroFrame2);

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo4[t.NumeroFrame2] = false;
  
      return;
    }

    // logConsole('Overlay 2', t.NumeroFrame2);

    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo mappa', t.NumeroFrame2, t.MappaOGrafico2);
      this.layerAttivo4[t.NumeroFrame2] = false;

      return;
    }
    
    // logConsole('Overlay 3', t.NumeroFrame2);

    // Come chiesto da Federico il 16/06/2022. Non visualizzare il mosaico su Fleet Manager
    if (t.eseguitoInProgetto2 === true) { // } && t.progettoEsterno2 === 'FleetManager') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per progetto esterno = fleet manager', t.NumeroFrame2, t.eseguitoInProgetto2, t.progettoEsterno2);
      t.staDisegnandoOverlay[t.NumeroFrame2] = false;
      this.layerAttivo4[t.NumeroFrame2] = false;

      return;
    }

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGrafico2 && t.MappaOGrafico2 !== 'M' || t.map1[t.NumeroFrame2]=== undefined || aperto === false) {
      t.staDisegnandoOverlay[t.NumeroFrame2] = false;
      return;
    } */

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS5 < t.ritardoPerFunzioni && this.ultimaVoltaTMS5 !== -1) {
      t.staDisegnandoOverlay = false;
      return;
    }
    this.ultimaVoltaTMS5 = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    const flagLocaleOverlay = +t.viewAs2[t.NumeroFrame2];
    
    // logConsole('Overlay 4', t.NumeroFrame2, flagLocaleOverlay,t.showMeasuresS2);

    t.erroreClusterNonPresente = false;
    t.erroreMisuraClusterNonPresente = false;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Option overlay frame', t.NumeroFrame, t.viewAs2);
    if (flagLocaleOverlay === 1) {
      t.removeLayerFromMap('Overlay layer', t.overlayLayer[t.NumeroFrame2]);
      t.overlayLayer[t.NumeroFrame2] = undefined;

      // logConsole('Elimino layer cluster 0');
      t.removeLayerFromMap('Overlay layer global', t.overlayLayerGlobal[t.NumeroFrame2]);
      t.overlayLayerGlobal[t.NumeroFrame2] = undefined;

      t.lastCallPath3[t.NumeroFrame2] = '';
      t.staDisegnandoOverlay[t.NumeroFrame2] = false;

      /* if (t.map1[t.NumeroFrame2]) {
        t.map1[t.NumeroFrame2].updateSize();
      } */

      this.layerAttivo4[t.NumeroFrame2] = false;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per flag locale overlay = 1', t.NumeroFrame2, flagLocaleOverlay, t.viewAs2[t.NumeroFrame2]);

      // logConsole('Overlay 4 - Esco', t.NumeroFrame2);
      return;
    }

    // logConsole('Overlay 5-0: Overlay ', t.NumeroFrame2, t.overlay2);
    // logConsole('Overlay 5-0: Misura globale', t.NumeroFrame2, t.Utils.globalMeasure);
    // logConsole('Overlay 5-0: Misure globali', t.NumeroFrame2, ExternalUtilities.misureGlobali);

    // this.disegnaPathComeFeature(t);
    // return;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna overlay');
    /* if (t.squareMeters2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per square meters', t.NumeroFrame2, t.squareMeters2);

      t.staDisegnandoOverlay[t.NumeroFrame2] = false;
      return;
    } */

    // let misura = t.overlay2;
    let tipologiaMisura;

    let misura = ExternalUtilities.ritornaMisura(t, t.overlay2, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Mosaic Grid');
    // nomeMisura = misura;
    // logConsole('Overlay 5-1: Misura convertita mosaic', t.NumeroFrame2, t.overlay2, misura);

    if (t.measureData2) {
      // logConsole('Misura da controllare per cluster', misura);

      // logConsole('Overlay 5-5', t.NumeroFrame2, misura);

      t.measureData2.forEach(element2 => {
        if (element2.CODE === misura || element2.DISPLAY_NAME === misura) {
          tipologiaMisura = element2.TYPE;
          // logConsole('Tipo Misura controllata per cluster 1', element2);
        }
      });

      // logConsole('Tipo Misura controllata per cluster', tipologiaMisura);
    }
    // logConsole('misura overlay', misura, tipologiaMisura);

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Misura', t.NumeroFrame2, misura);
    // }

    // logConsole('Overlay 6', t.NumeroFrame2, tipologiaMisura);

    if (t.ConnessioneStabilita === 'OK') {
      // let act_set = '';
      // let ok = false;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'act_set:', t.act_set);
      // if (t.act_set && t.act_set !== '') {
        // act_set += ' geo_act_set_name = \'' + t.act_set + '\'';

        // geo_act_set_name='TIM Coverage BO Highway.20191218.124349' and measr_code='act_coverage_net_tech'

        let sla = ExternalUtilities.tornaSla(t);
        if (sla !== undefined && sla !== '') {
          // sla = ' and geo_sla_name = \'' + sla + '\'';
        } else {
          sla = '';
        }

        let nomeLayer = '';
        // let cluster = '';
        let zindex;
        let tipo = '';
        let vParams = '';
        let qualeCluster = '';

        // if (t.squareMeters === true) { t.squareMeters = 10; }

        let tempo = '';
        if (+t.timeFilter === 1 || t.timeFilter2 === 'All') {
          tempo = 'v_tms_min:\'' + t.timeRangeDSFStart2 + '\';';
          tempo += 'v_tms_max:\'' + t.timeRangeDSFStop2 + '\';';
        } else {
          tempo = 'v_tms_min:\'' + t.Utils.tmsInizio + '\';';
          tempo += 'v_tms_max:\'' + t.Utils.tmsFine + '\';';
        }

        if (t.eseguitoInProgetto2 === true && t.tmsPassatiDaProgetto2) {
          /* const t1 = new Date().getTime() - (t.lastDays2 * 24 * 60 * 60 * 1000);
          const sInizio = t.datePipe.transform(t1, 'yyyy-MM-dd HH:mm:00', 'UTC');
          const t2 = new Date().getTime() + (24 * 60 * 60 * 1000);
          const sFine = t.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:00', 'UTC'); */

          const tt = t.tmsPassatiDaProgetto2.split(';');
          const sInizio = tt[0];
          const sFine = tt[1];

          tempo = 'v_tms_min:\'' + sInizio  + '\';';
          tempo += 'v_tms_max:\'' + sFine + '\';';

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Impostato lastdays per chiamata l_geo_measr_num_mosaic', t.NumeroFrame2, sInizio, sFine, tempo, t.tmsPassatiDaProgetto2);
        }

        // Mail 26/02/2021 09:42 su overlay ci deve essere solo ALL (Dataset)

        /* if (t.Activity2 === -1) {
          t.Activity2 = 1; // IMPOSTATO PERCHE' IN QUESTA MASCHERA ERA SEMPRE -1... RICONTROLLARE IN FUTURO
        }

        let agnact = '';
        if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
          agnact = 'null';
        } else {
          agnact = '\'' + ExternalUtilities.stringaAGNoACT + '\'';
        } */

        if (t.eseguitoInProgetto2 === false && (t.act_set === undefined || t.act_set === 'undefined')) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco dal mosaic per act_set vuoto');
          t.staDisegnandoOverlay[t.NumeroFrame2] = false;
          this.layerAttivo4[t.NumeroFrame2] = false;

          return;
        }

        // logConsole('Overlay 7', t.NumeroFrame2);

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Impostazione tipo dataset', t.tipoDataset2);

        let valoreRicerca;
        // if (t.eseguitoInProgetto2 === true) {
        if (t.tipoDataset2 === 2) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Valore AGN', ExternalUtilities.stringaAGNoACT);
          if (ExternalUtilities.stringaAGNoACT === undefined || ExternalUtilities.stringaAGNoACT === 'undefined') {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco dal mosaic per agn vuoto');
            t.staDisegnandoOverlay[t.NumeroFrame2] = false;
            this.layerAttivo4[t.NumeroFrame2] = false;

            return;
          }
          valoreRicerca = '\'' + ExternalUtilities.stringaAGNoACT + '\'';
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: AGN Passato', ExternalUtilities.stringaAGNoACT);
        // } else {
        //   valoreRicerca = '\'' + t.actSetNameFM + '\'';
        // }
      // } else {

        } else {
          valoreRicerca = '\'' + t.act_set + '\'';
        }

        /* if (t.tipoDataset2 === 2) {
          valoreRicerca = agnact;
        } */

        // Mail 26/02/2021 09:42 su overlay ci deve essere solo ALL (Dataset)

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Misure per overlay', t.measureData2);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Misura impostata globale', t.clusterGlobale2);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Nome Cluster DD', t.nomeClusterDD2);

        // CONTROLLO CLUSTER
        let ok = false;
        const viewAs = t.viewAs2[t.NumeroFrame2];
        let nome = '';

        // if (t.debug2 === true) {
          // logConsole('Overlay: View AS', viewAs);
          // logConsole('Overlay: overlay scelto', t.overlayCluster2);
          // logConsole('Overlay: cluster globale impostato', t.clusterGlobale2);          
          // logConsole('Overlay: stringa globale', environment.stringaClusterGlobale);
        // }

        if (viewAs === 2) {
          if (t.overlayCluster2 && t.overlayCluster2 !== null) {
            if (t.overlayCluster2 === environment.stringaClusterGlobale) {
              if (t.clusterGlobale2 && t.clusterGlobale2.CODE) {
                ok = true;
              }
            } else {
              ok = true;
            }
          }
        } else {
          ok = true;
        }
        
        t.erroreClusterNonPresente = false;
        if (!ok) {
          if (!t.eseguitoInProgetto2) {
            t.erroreClusterNonPresente = true;
          }
          t.staDisegnandoOverlay[t.NumeroFrame2] = false;
          t.lastCallPath3[t.NumeroFrame2] = '';

          if (t.overlayLayer[t.NumeroFrame2]) {
            // logConsole('Elimino layer cluster 1');
            t.removeLayerFromMap('Overlay layer 1', t.overlayLayer[t.NumeroFrame2]);
            t.overlayLayer[t.NumeroFrame2] = undefined;
            // t.staDisegnandoOverlay = false;

            // return;
          }
          this.layerAttivo4[t.NumeroFrame2] = false;

          return;
        }
        // CONTROLLO CLUSTER

        // logConsole('Overlay 8', t.NumeroFrame2);
        
        t.erroreMisuraClusterNonPresente = false;
        if (tipologiaMisura === undefined) {
          t.erroreMisuraClusterNonPresente = true;

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco dal mosaic per tipologia misura non definita');
          t.staDisegnandoOverlay[t.NumeroFrame2] = false;

          if (t.overlayLayerGlobal[t.NumeroFrame2]) {
            // logConsole('Elimino layer cluster 1');
            t.removeLayerFromMap('Overlay layer 2-1', t.overlayLayerGlobal[t.NumeroFrame2]);
            t.overlayLayerGlobal[t.NumeroFrame2] = undefined;
            // t.staDisegnandoOverlay = false;

            // return;
          }
          if (t.overlayLayer[t.NumeroFrame2]) {
            // logConsole('Elimino layer cluster 1');
            t.removeLayerFromMap('Overlay layer 1', t.overlayLayer[t.NumeroFrame2]);
            t.overlayLayer[t.NumeroFrame2] = undefined;
            // t.staDisegnandoOverlay = false;

            // return;
          }

          // logConsole('Esco da mosaic/Cluster 5');
          t.lastCallPath3[t.NumeroFrame2] = '';
          this.layerAttivo4[t.NumeroFrame2] = false;

          return;
        }

        // logConsole('Overlay 9', t.NumeroFrame2);

        // CONTROLLO MISURA CLUSTER
        ok = false;
        if (viewAs === 2) {
          // if (t.debug2 === true) {
            // logConsole('Overlay: Misura cluster', misura, tipologiaMisura);
          // }
          if (misura && misura !== null) {
            if (+tipologiaMisura === 1) {
              ok = true;
            }
          }
        } else {
          ok = true;
        }

        if (!ok) {
          // if (t.debug2 === true) {
            // logConsole('Overlay: Esco per misura cluster non impostata', misura);
          // }

          // if (t.eseguitoInProgetto2 === false) {
            t.erroreMisuraClusterNonPresente = true;
          // }
          t.staDisegnandoOverlay[t.NumeroFrame2] = false;

          if (t.overlayLayerGlobal[t.NumeroFrame2]) {
            // logConsole('Elimino layer cluster 1');
            t.removeLayerFromMap('Overlay layer 2-1', t.overlayLayerGlobal[t.NumeroFrame2]);
            t.overlayLayerGlobal[t.NumeroFrame2] = undefined;
            // t.staDisegnandoOverlay = false;

            // return;
          }
          if (t.overlayLayer[t.NumeroFrame2]) {
            // logConsole('Elimino layer cluster 1');
            t.removeLayerFromMap('Overlay layer 1', t.overlayLayer[t.NumeroFrame2]);
            t.overlayLayer[t.NumeroFrame2] = undefined;
            // t.staDisegnandoOverlay = false;

            // return;
          }
          // logConsole('Esco da mosaic/Cluster 5');
          t.lastCallPath3[t.NumeroFrame2] = '';
          this.layerAttivo4[t.NumeroFrame2] = false;

          return;
        }
        // CONTROLLO MISURA CLUSTER

        // logConsole('Overlay 10', t.NumeroFrame2, misura);

        // t.scrittaOverlayTipo = '';
        // t.scrittaOverlay =  '';

        if (t.measureData2) {
          let ok2 = false;

          t.measureData2.forEach(element2 => {
            if (nomeLayer === '') {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2.CODE, misura);
              if (element2.CODE === misura || element2.DISPLAY_NAME === misura) {
                // logConsole('Overlay 10-1 Trovata misura', t.NumeroFrame2, misura, element2);

                if (element2.DISPLAY_NAME === misura) {
                  misura = element2.CODE;
                }

                qualeCluster = t.overlayCluster2;
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno overlay Frame', t.NumeroFrame, qualeCluster, element2.CODE);
                if (qualeCluster === environment.stringaClusterGlobale) {
                  if (t.clusterGlobale2) {
                    if (t.clusterGlobale2.NAME !== '') {
                      qualeCluster = t.clusterGlobale2.CODE;
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prendo overlay globale', t.NumeroFrame, qualeCluster);
                    }
                  /* } else {
                    if (t.debug2 === true) {
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per misura globale non impostata', t.clusterGlobale2);
                    }

                    if (t.eseguitoInProgetto2 === false) {
                      t.erroreClusterNonPresente = true;
                    }
                    t.staDisegnandoOverlay[t.NumeroFrame2] = false;
                    return; */
                  } 
                }

                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Misura rilevata per overlay', qualeCluster, misura, element2, element2.TYPE, flagLocaleOverlay);

                let measrcode = misura; // element2.CODE;
                while (measrcode.indexOf(',') > -1) {
                  measrcode = measrcode.replace(',', '%2C')
                }
                
                // logConsole('Overlay 10-1-0', t.NumeroFrame2, +element2.TYPE);

                if (+element2.TYPE === 1) {
                  // logConsole('Overlay 10-1-1 Numerica', flagLocaleOverlay);

                  if (flagLocaleOverlay === 2) {
                    tipo = 'CLUSTER';
                    zindex = 4;
                    nomeLayer = 'Geo_ANTS:l_geo_measr_num_cluster';
                    // sla = ' and geo_sla_name = \'' + t.slaName2 + '\'';
                    // cluster = ' and cluster_set_name = \'' + qualeCluster + '\'';
                    vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
                      'v_act_set_name_list:' + valoreRicerca + ';' +
                      'v_geo_sla_name:\'' + sla + '\';' +
                      tempo +
                      'v_measr_code:\'' + measrcode + '\';' +
                      'v_cluster_set_name:\'' + qualeCluster + '\'';

                    // FILTER
                    const filtri = ExternalUtilities.prendeFiltri(t, true, 'DisegnaOverlay2');
                    const cm1 = filtri.cm1;
                    const cm2 = filtri.cm2;
                    const tf1 = filtri.tf1;
                    const tf2 = filtri.tf2;
                    // FILTER

                    vParams += ';v_filter_measr_code_1:' + cm1 + ';v_filter_measr_value_1:' + tf1 + '';
                    vParams += ';v_filter_measr_code_2:' + cm2 + ';v_filter_measr_value_2:' + tf2 + '';

                    // t.scrittaOverlayTipo = 'Cluster';
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scritta Overlay 1: ', qualeCluster, element2.CODE);

                    let nomeCluster = '';
                    t.clusterGroup2.forEach(element9 => {
                      if (element9.CODE === qualeCluster) {
                        nomeCluster = element9.DISPLAY_NAME;
                      }
                    });
                    /* const misuraConvertita = ExternalUtilities.PrendeNomeMisuraDaCodice(misura, t.measureData2, 'Overlay 1. Frame ' + t.NumeroFrame2);
                    if (misuraConvertita.indexOf('(NOT FOUND)') === -1) {
                      ok2 = true;                      
                      t.scrittaOverlay = t.sanitizer.bypassSecurityTrustHtml(nomeCluster + ' ' + misuraConvertita);
                    } else {
                      t.scrittaOverlay = t.sanitizer.bypassSecurityTrustHtml(nomeCluster + ' ' + misuraConvertita + ' <span style="color: red;">[NOT EXISTS]</span>');
                    } */
                    ok2 = true;
                  } else {
                    if (flagLocaleOverlay === 3) {
                      tipo = 'MOSAIC';
                      zindex = 5;
                      nomeLayer = 'Geo_ANTS:l_geo_measr_num_mosaic';

                      // sla = ' and geo_sla_name = \'' + t.slaName2 + '\'';
                      let squareMeters = t.squareMeters2;
                      if (squareMeters === '<GLOBAL SQUARE SIDE>') {
                        squareMeters = t.squareMetersGlobale2;
                      }
                      vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
                        'v_act_set_name_list:' + valoreRicerca + ';' +
                        'v_geo_sla_name:\'' + sla + '\';' +
                        tempo +
                        'v_measr_code:\'' + measrcode + '\';' +
                        'v_square_meters:' + squareMeters + '';

                      // FILTER
                      const filtri = ExternalUtilities.prendeFiltri(t, true, 'DisegnaOverlay');
                      const cm1 = filtri.cm1;
                      const cm2 = filtri.cm2;
                      let tf1 = filtri.tf1;
                      let tf2 = filtri.tf2;
                      // FILTER

                      vParams += ';v_filter_measr_code_1:' + cm1 + ';v_filter_measr_value_1:' + tf1 + '';
                      vParams += ';v_filter_measr_code_2:' + cm2 + ';v_filter_measr_value_2:' + tf2 + '';

                      // t.scrittaOverlayTipo = 'Mosaic';

                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scritta Overlay 2: ', element2)

                      // logConsole('Misura mosaic 1:', t.NumeroFrame2, element2.CODE);

                      // t.scrittaOverlay = ExternalUtilities.PrendeNomeMisuraDaCodice(element2.CODE, t.measureData2, 'Overlay 2. Frame ' + t.NumeroFrame2);
                      /* const misuraConvertita = ExternalUtilities.PrendeNomeMisuraDaCodice(misura, t.measureData2, 'Overlay 2. Frame ' + t.NumeroFrame2);
                      if (misuraConvertita.indexOf('(NOT FOUND)') === -1) {
                        ok2 = true;
                        // logConsole('Acqusizione misura 1', nomeLayer, misura, misuraConvertita);
                        t.scrittaOverlay =  misuraConvertita;
                      } else {
                        t.scrittaOverlay = t.sanitizer.bypassSecurityTrustHtml(misuraConvertita + ' <span style="color: red;">[NOT EXISTS]</span>');
                      } */
                      ok2 = true;
                    }
                  }
                } else {
                  // logConsole('Overlay 10-1-2 Stringa', flagLocaleOverlay);

                  if (flagLocaleOverlay === 2) {
                    tipo = 'CLUSTER';
                    zindex = 4;
                    nomeLayer = 'Geo_ANTS:geo_measr_str_cluster';
                    sla = '';
                    // cluster = ' and cluster_set_name = \'' + qualeCluster + '\'';
                    vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
                      'v_act_set_name_list:' + valoreRicerca + ';' +
                      tempo +
                      'v_measr_code:\'' + measrcode + '\';' +
                      'v_cluster_set_name:\'' + qualeCluster + '\'';

                    // FILTER
                    const filtri = ExternalUtilities.prendeFiltri(t, true, 'DisegnaOverlay3');
                    const cm1 = filtri.cm1;
                    const cm2 = filtri.cm2;
                    const tf1 = filtri.tf1;
                    const tf2 = filtri.tf2;
                    // FILTER
                    
                    vParams += ';v_filter_measr_code_1:' + cm1 + ';v_filter_measr_value_1:' + tf1 + '';
                    vParams += ';v_filter_measr_code_2:' + cm2 + ';v_filter_measr_value_2:' + tf2 + '';

                    // t.scrittaOverlayTipo = 'Cluster';
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scritta Overlay 3: ', element2.CODE)

                    let nomeCluster = '';
                    t.clusterGroup2.forEach(element9 => {
                      if (element9.CODE === qualeCluster) {
                        nomeCluster = element9.DISPLAY_NAME;
                      }
                    });
                    // t.scrittaOverlay = nomeCluster + ' ' + ExternalUtilities.PrendeNomeMisuraDaCodice(element2.CODE, t.measureData2, 'Overlay 3. Frame ' + t.NumeroFrame2);

                    /* const misuraConvertita =ExternalUtilities.PrendeNomeMisuraDaCodice(misura, t.measureData2, 'Overlay 3. Frame ' + t.NumeroFrame2);
                    if (misuraConvertita.indexOf('(NOT FOUND)') === -1) {
                      ok2 = true;
                      t.scrittaOverlay = nomeCluster + ' ' + misuraConvertita;
                    } else {
                      t.scrittaOverlay = t.sanitizer.bypassSecurityTrustHtml(nomeCluster + ' ' + misuraConvertita + ' <span style="color: red;">[NOT EXISTS]</span>');
                    } */

                    ok2 = true;
                  } else {
                    if (flagLocaleOverlay === 3) {
                      // COME DA MAIL 05/05/2022 09:29 Richiamo i coriandoli in caso di mosaic stringa
                      // Rimessa come da mail 02/12/2024 15:25

                      sla = ExternalUtilities.tornaSla(t);

                      let squareMeters = t.squareMeters2;
                      if (squareMeters === '<GLOBAL SQUARE SIDE>') {
                        squareMeters = t.squareMetersGlobale2;
                      }

                      tipo = 'MOSAIC';
                      zindex = 5;
                      nomeLayer = 'Geo_ANTS:l_geo_measr_str_mosaic';
                      vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
                        'v_act_set_name_list:' + valoreRicerca + ';' +
                        'v_geo_sla_name:\'' + sla + '\';' +
                        tempo +
                        'v_measr_code:\'' + measrcode + '\';' +
                        'v_square_meters:' + squareMeters + '';

                      // FILTER
                      const filtri = ExternalUtilities.prendeFiltri(t, true, 'DisegnaOverlay3');
                      const cm1 = filtri.cm1;
                      const cm2 = filtri.cm2;
                      const tf1 = filtri.tf1;
                      const tf2 = filtri.tf2;
                      // FILTER
                      
                      vParams += ';v_filter_measr_code_1:' + cm1 + ';v_filter_measr_value_1:' + tf1 + '';
                      vParams += ';v_filter_measr_code_2:' + cm2 + ';v_filter_measr_value_2:' + tf2 + '';

                      // t.scrittaOverlayTipo = 'Mosaic';

                      // logConsole('Misura mosaic 2: ', t.NumeroFrame2, element2.CODE);

                      // t.scrittaOverlay = ExternalUtilities.PrendeNomeMisuraDaCodice(element2.CODE, t.measureData2, 'Overlay 2. Frame ' + t.NumeroFrame2);
                      /* const misuraConvertita = ExternalUtilities.PrendeNomeMisuraDaCodice(misura, t.measureData2, 'Overlay 2. Frame ' + t.NumeroFrame2);
                      if (misuraConvertita.indexOf('(NOT FOUND)') === -1) {
                        ok2 = true;
                        // logConsole('Acqusizione misura 2', nomeLayer);
                        t.scrittaOverlay =  misuraConvertita;
                      } else {
                        t.scrittaOverlay = t.sanitizer.bypassSecurityTrustHtml(misuraConvertita + ' <span style="color: red;">[NOT EXISTS]</span>');
                      } */
                      ok2 = true;

                      // t.scrittaOverlay = element2.CODE;

                      // if (t.debug2 === true) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Arrivata misura stringa su mosaic, disegno coriandoli');
                      // }
                      // t.measuresComponent.disegnaMeasureSample(this, true);
                      // t.erroreClusterNonPresente = true;
                      t.staDisegnandoOverlay[t.NumeroFrame2] = false;

                      // return;
                      // Rimessa come da mail 02/12/2024 15:26
                      // COME DA MAIL 05/05/2022 09:29 Richiamo i coriandoli in caso di mosaic stringa
                    }
                  }
                }
              }
            }
          });

          if (!ok2) {
            // logConsole('Azzero nome layer', t.NumeroFrame2);
            nomeLayer = '';
            // logConsole('Overlay 10 Esco', t.NumeroFrame2);
          }
        }

        // logConsole('Overlay 11', t.NumeroFrame2);

        if (t.eseguitoInProgetto2 === true && t.nomeClusterDD2) {
          qualeCluster = t.nomeClusterDD2;
          tempo = 'v_tms_min:null;';
          tempo += 'v_tms_max:null;';
          t.erroreClusterNonPresente = false;
        } else {
          if (t.eseguitoInProgetto2 === true && (!t.nomeClusterDD2 || t.nomeClusterDD2 === '')) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per eseguito in progetto ma non c\'è il nome cluster', t.NumeroFrame2);
            t.staDisegnandoOverlay[t.NumeroFrame2] = false;
            this.layerAttivo4[t.NumeroFrame2] = false;

            return;
          }
        }

        if (t.erroreClusterNonPresente) {
          logConsole('Scrivo errore per Tipo misura non num', t.erroreClusterNonPresente);

          if (t.overlayLayerGlobal[t.NumeroFrame2]) {
            // logConsole('Elimino layer cluster 2');
            t.removeLayerFromMap('Overlay layer 2-2', t.overlayLayerGlobal[t.NumeroFrame2]);
            t.overlayLayerGlobal[t.NumeroFrame2] = undefined;
            // t.staDisegnandoOverlay = false;

            // return;
          }
          if (t.overlayLayer[t.NumeroFrame2]) {
            // logConsole('Elimino layer cluster 1');
            t.removeLayerFromMap('Overlay layer 1', t.overlayLayer[t.NumeroFrame2]);
            t.overlayLayer[t.NumeroFrame2] = undefined;
            // t.staDisegnandoOverlay = false;

            // return;
          }
          t.staDisegnandoOverlay[t.NumeroFrame2] = false;
          t.lastCallPath3[t.NumeroFrame2] = '';
          this.layerAttivo4[t.NumeroFrame2] = false;

          // logConsole('Esco da mosaic/Cluster 1');
          return;
        }

        // logConsole('Overlay 12', t.NumeroFrame2);

        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Frame', t.NumeroFrame2);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Progetto', t.eseguitoInProgetto2, t.progettoEsterno2)
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Pagina', t.frameAttivo2);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: ViewAs', t.viewAs2[t.NumeroFrame2]);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Quale cluster', qualeCluster);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Overlay cluster', t.overlayCluster2);
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Index', t.overlayCluster2.toUpperCase().indexOf('GLOBAL'))
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Overlay', t.overlay2);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Nome Layer', nomeLayer);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Tempo', tempo);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Flag locale overlay', flagLocaleOverlay);
        // }

        // t.erroreClusterNonPresente = false;
        if (flagLocaleOverlay === 2) {
          if ((!qualeCluster || qualeCluster === undefined || qualeCluster === 'undefined' || qualeCluster === '') &&
            (t.overlayCluster2 && t.overlayCluster2.toUpperCase().indexOf('GLOBAL') !== -1)) {
              // if (t.viewAs2[t.NumeroFrame2] === 2) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per layer non presente', t.NumeroFrame2, qualeCluster);
                // t.erroreClusterNonPresente = true;
                t.staDisegnandoOverlay[t.NumeroFrame2] = false;

                if (t.overlayLayerGlobal[t.NumeroFrame2]) {
                  // logConsole('Elimino layer cluster 3');
                  t.removeLayerFromMap('Overlay layer 2-3', t.overlayLayerGlobal[t.NumeroFrame2]);
                  t.overlayLayerGlobal[t.NumeroFrame2] = undefined;
                  // t.staDisegnandoOverlay = false;
    
                  // return;
                }
                if (t.overlayLayer[t.NumeroFrame2]) {
                  // logConsole('Elimino layer cluster 1');
                  t.removeLayerFromMap('Overlay layer 1', t.overlayLayer[t.NumeroFrame2]);
                  t.overlayLayer[t.NumeroFrame2] = undefined;
                  // t.staDisegnandoOverlay = false;

                  // return;
                }
                t.lastCallPath3[t.NumeroFrame2] = '';
                this.layerAttivo4[t.NumeroFrame2] = false;

                // logConsole('Overlay 12 Esco', t.NumeroFrame2);
                // logConsole('Esco da mosaic/Cluster 2');
                return;
              // }
          }
        }

        if (!nomeLayer || nomeLayer === null) {
          if (t.eseguitoInProgetto2 === false) {
            t.staDisegnandoOverlay[t.NumeroFrame2] = false;
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per nome layer non valido', t.NumeroFrame2, nomeLayer);

            if (t.overlayLayerGlobal[t.NumeroFrame2]) {
              // logConsole('Elimino layer cluster 3');
              t.removeLayerFromMap('Overlay layer 2-3', t.overlayLayerGlobal[t.NumeroFrame2]);
              t.overlayLayerGlobal[t.NumeroFrame2] = undefined;
              // t.staDisegnandoOverlay = false;

              // return;
            }
            if (t.overlayLayer[t.NumeroFrame2]) {
              t.removeLayerFromMap('Overlay layer 2-4', t.overlayLayer[t.NumeroFrame2]);
              t.overlayLayer[t.NumeroFrame2] = undefined;
              // t.staDisegnandoOverlay = false;

              // return;
            }
            t.lastCallPath3[t.NumeroFrame2] = '';
            this.layerAttivo4[t.NumeroFrame2] = false;

            // logConsole('Overlay 12-2 Esco', t.NumeroFrame2);

            // logConsole('Esco da mosaic/Cluster 3', t.NumeroFrame2, nomeLayer);
            return;
          }
        }

        // logConsole('Overlay 13', t.NumeroFrame2);

        // const zoom = this.mapScale(t, t.currZoom);
        const zoom = Math.round(t.currScale * 5 / 1000); //  Math.round(100000 / (t.currZoom * t.currZoom));
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'dime ', zoom);

        let parameters;

        // let bbox = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
        // vParams += ';' + bbox;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ppp', ExternalUtilities.bboxAttualeFisso);
        // return;

        // let bbox = JSON.stringify(ExternalUtilities.bboxAttualeFisso); // JSON.stringify(ExternalUtilities.prendeBBOXSoloValori(t.map1[t.NumeroFrame2]));
        // bbox = ExternalUtilities.effettuaReplace(bbox, ',', '\\,');
        // const b = ExternalUtilities.bboxAttualeFisso;

        // const bb = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
        // vParams += ';' + bb;

        const bbox = ExternalUtilities.ritornaBboxGiusta(t, 'Measures'); 
        // ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
        // // logConsole('BBOX per mosaico: ', bbox);

        // t.creaLayerBBOX();

        ////////////////////////////// 
        /*
        const tipologia = 'selected_area'
        const nomeLayer2 = 'Geo_ANTS:l_geometry';
        const parametri2 = 'cntx_id:\'' + t.sessionID2 + '\';' +
          'v_geo_label:\'BBoxLayer\';' +
          'v_geo_type:\'' + tipologia + '\';' +
          'v_geo_geometry:\'' + ss + '\';' +
          'v_geo_color:\'' + c + '\';'; // +
          // 'v_chi_mi_chiama:\'frame\';';
  
  
        const parameters = {
          LAYERS: nomeLayer,
          TILED: false,
          STYLES: 's_geometry',
          VIEWPARAMS: parametri
          // 'CQL_FILTER': act_set + tmsFilter + ' and act_id in (' + act_id + ')'
        };
        */ //////////////////////////////
  
        if (bbox.indexOf('NaN') > -1 || bbox.indexOf('undefined') > -1) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per bbox non valida: ', t.NumeroFrame2, bbox);
          // return;
        }
        let bb = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';';
        bb += 'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];
        vParams += ';' + bb;
    
        // vParams += ';geoants_bbox_min_x:\'' + [0] + '\';geoants_bbox_max_x:\'' + [2] + '\';geoants_bbox_min_y:\'' + [1] + '\';geoants_bbox_max_y:\'' + [3] + '\'';

        // logConsole('Flag overlay', t.NumeroFrame2, flagLocaleOverlay);

        if (flagLocaleOverlay === 3) {
          // MOSAIC
          parameters = {
            LAYERS: nomeLayer,
            TILED: false,
            STYLES: t.mosaicStyle,
            VIEWPARAMS: vParams
            // 'CQL_FILTER': act_set + ' and measr_code=\'' + t.overlay + '\'' + sla + cluster,
          };
          // logConsole('PARAMETRI PER MOSAICO', t.NumeroFrame2, parameters);
        } else {
          if (flagLocaleOverlay === 2) {
            // CLUSTER
            parameters = {
              LAYERS: nomeLayer,
              TILED: false,
              VIEWPARAMS: vParams,
              STYLES: ''
              // 'CQL_FILTER': act_set + ' and measr_code=\'' + t.overlay + '\'' + sla + cluster,
            };
            // logConsole('PARAMETRI PER CLUSTER', t.NumeroFrame2, parameters);
          }
        }
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Cluster parameters', parameters);

        /* parameters = {
          'LAYERS': nomeLayer,
          'TILED': false,
          'VIEWPARAMS': 'square_meters:' + zoom,
          'CQL_FILTER': act_set + ' and measr_code=\'' + t.overlay + '\'' + sla + cluster,
        } */
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri overlay frame', t.NumeroFrame, parameters);

        const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
          t.frameAttivo + ';' + t.act_set + ';' + t.opacity2 + ';';
        const actualCall = 'MOSAICCLUSTER;' + JSON.stringify(parameters) + ';' + valoriDiBase + ';' + qualeCluster;

        // logConsole('Overlay 14', t.NumeroFrame2, parameters);

        if (t.lastCallPath3[t.NumeroFrame2] !== actualCall || (t.eseguitoInProgetto2 === true)) { //  && t.progettoEsterno2 === 'FleetManager')) {
          t.lastCallPath3[t.NumeroFrame2] = actualCall;

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Disegna overlay frame ' + t.NumeroFrame + ': ', nomeLayer, t.MappaOGrafico2, t.frameVisible2, parameters);

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.indirizzoGEOServer + t.urlWms);

          // logConsole('Overlay 15', t.NumeroFrame2);

          if (!t.eseguitoInProgetto2) {
            // }

            /* let q = 0;
            const tt = setInterval(() => {
              if (wms.loading === true) {
                q++;
                if (q > 30) {
                  // t.staDisegnandoOverlay[t.NumeroFrame2] = false;

                  clearInterval(tt);
                }
              } else {
                clearInterval(tt); */

                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Url overlay frame', t.NumeroFrame, wms);

                // logConsole('Overlay 16', t.NumeroFrame2, this.vecchioOverlay, flagLocaleOverlay, nomeLayer);
                if (this.vecchioOverlay !== flagLocaleOverlay || this.vecchioParameters !== JSON.stringify(parameters)) {
                  if (t.overlayLayer[t.NumeroFrame2]) {
                    t.removeLayerFromMap('Overlay layer 2-5', t.overlayLayer[t.NumeroFrame2]);
                    t.overlayLayer[t.NumeroFrame2] = undefined;
                    // logConsole('Overlay 16-2 Pulito');
                  }
                }
                this.vecchioOverlay = flagLocaleOverlay;
                this.vecchioParameters = JSON.stringify(parameters);

                if (t.overlayLayer[t.NumeroFrame2] && t.overlayLayer[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource4) {
                  let nuoviParametri;
                  if (flagLocaleOverlay === 3) {
                    nuoviParametri = { LAYERS: nomeLayer, STYLES: t.mosaicStyle, VIEWPARAMS: vParams };
                  } else {
                    nuoviParametri = { LAYERS: nomeLayer, VIEWPARAMS: vParams };
                  }

                  this.layerAttivo4[t.NumeroFrame2] = true;
                  t.overlayLayer[t.NumeroFrame2].getSource().updateParams(nuoviParametri); // .setSource(wms);
                  // logConsole('Overlay 17 update source', t.NumeroFrame2, nuoviParametri);
                } else {
                  if (t.overlayLayer[t.NumeroFrame2]) {
                    t.removeLayerFromMap('Overlay layer 2-6', t.overlayLayer[t.NumeroFrame2]);
                    t.overlayLayer[t.NumeroFrame2] = undefined;
                    // t.staDisegnandoOverlay = false;

                    // return;
                    // logConsole('Overlay 18 Pulito');
                  }

                  const wms = new ImageWMS({
                    ratio: 1, // immagine grande quanto la mappa (default 1.5 = 2,25x i pixel)
                    url: t.Utils.indirizzoGEOServer + t.urlWms,
                    projection: 'EPSG:4326',
                    // renderer: 'antialias: true;',
                    params: parameters,
                    serverType: 'geoserver',
                    /* tileLoadFunction: function (image, src) {
                      const img = image.getImage();
                      const query = src.replace(t.url + '?', '');
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, src);
                      img.src = src;
                    } */

                    // Sovrascrivere l'URL per evitare la cache
                    imageLoadFunction: (image, src) => {
                      if (!this.layerAttivo4[t.NumeroFrame2]) { return; }

                      const timestamp = new Date().getTime();
                      const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                      const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                      image.getImage()['src'] = noCacheUrl2;
                    }
                  });

                  // if (flagLocaleOverlay === 1) {
                  // if (!this.GestisceLayerConSetSource4) {
                  
                  /* if (t.overlayLayer) {
                      t.removeLayerFromMap('Overlay layer 2', t.overlayLayer);
                      t.overlayLayer = undefined;
                      // t.staDisegnandoOverlay = false;

                      // return;
                    } */
                  // }

                  const newWms = new ImageLayer({
                    source: wms,
                    opacity: t.opacity2 / 100
                  });
                  // t.wms[t.NumeroFrame2][t.Utils.quanteMisure + 1] = wms;

                  t.addLayerToMap(newWms, zindex, 'Overlay');
                  t.overlayLayer[t.NumeroFrame2] = newWms;
                  this.layerAttivo4[t.NumeroFrame2] = true;
                }
              /* }
            }, 1000); */

          }

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Tipologia', t.NumeroFrame, tipo);

          if (tipo === 'CLUSTER' || t.eseguitoInProgetto2 === true) {
            // if (!this.GestisceLayerConSetSource5) {
              if (t.overlayLayerGlobal[t.NumeroFrame2]) {
                // logConsole('Elimino layer cluster 4');
                t.removeLayerFromMap('Overlay layer global 2', t.overlayLayerGlobal[t.NumeroFrame2]);
                t.overlayLayerGlobal[t.NumeroFrame2] = undefined;
                this.layerAttivo5[t.NumeroFrame2] = false;
              }
            // }

            // AGGIUNGE CLUSTER GLOBALE
            nomeLayer = 'Geo_ANTS:l_cluster_rec';

            let vParamsC = 'cntx_id:\'' + t.sessionID2 + '\';' +
              'v_cluster_set_code_list:\'' + qualeCluster + '\';' +
              tempo +
              'v_view_mode:null';
            // vParamsC += ';geoants_bbox_min_x:\'' + [0] + '\';geoants_bbox_max_x:\'' + [2] + '\';geoants_bbox_min_y:\'' + [1] + '\';geoants_bbox_max_y:\'' + [3] + '\'';

            const parametersG = {
              LAYERS: nomeLayer,
              TILED: false,
              // CQL_FILTER: cluster.replace(' and ', ''),
              VIEWPARAMS: vParamsC
            };

            if (t.eseguitoInProgetto2 === true) {
              parametersG['STYLES'] = 's_cluster_rec_color';
            }

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Cluster', t.NumeroFrame, parametersG);

            /* let q = 0;
            const tt = setInterval(() => {
              if (wmsG.loading === true) {
                q++;
                if (q > 30) {
                  t.staDisegnandoOverlay[t.NumeroFrame2] = false;

                  clearInterval(tt);
                }
              } else {
                clearInterval(tt); */

                if (t.overlayLayerGlobal[t.NumeroFrame2] && t.overlayLayerGlobal[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource5) {
                  const parametersG = {
                    LAYERS: nomeLayer,
                    TILED: false,
                    // CQL_FILTER: cluster.replace(' and ', ''),
                    VIEWPARAMS: vParamsC
                  };

                  this.layerAttivo5[t.NumeroFrame2] = true;
                  t.overlayLayerGlobal[t.NumeroFrame2].getSource().updateParams(parametersG); // .setSource(wms);
                } else {
                  const wmsG = new ImageWMS({
                    ratio: 1, // immagine grande quanto la mappa (default 1.5 = 2,25x i pixel)
                    url: t.Utils.indirizzoGEOServer + t.urlWms,
                    projection: 'EPSG:4326',
                    params: parametersG,
                    serverType: 'geoserver',

                    // Sovrascrivere l'URL per evitare la cache
                    imageLoadFunction: (image, src) => {
                      if (!this.layerAttivo5[t.NumeroFrame2]) { return; }

                      const timestamp = new Date().getTime();
                      const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                      const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                      image.getImage()['src'] = noCacheUrl2;
                    }
                  });

                  const newWms = new ImageLayer({
                    source: wmsG,
                    opacity: t.opacity2 / 100
                  });
                  // t.wms[t.NumeroFrame2][t.Utils.quanteMisure + 2] = wmsG;

                  t.addLayerToMap(newWms, 5, 'Overlay2');
                  t.overlayLayerGlobal[t.NumeroFrame2] = newWms;
                  this.layerAttivo5[t.NumeroFrame2] = true;
                }

                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per aver finito di leggere e disegnare', t.NumeroFrame, t.overlayLayerGlobal[t.NumeroFrame2]);

                t.staDisegnandoOverlay[t.NumeroFrame2] = false;
              /* }
            }, 1000); */

            /* const wmsLayer =  new ImageLayer({
              source: new ImageWMS({
                url: t.Utils.indirizzoGEOServer + t.urlWms,
                projection: 'EPSG:4326',
                params: parametersG,
                serverType: 'geoserver',
              })
            });

            if (t.map1[t.NumeroFrame2]) {
              // alert('Attivo click 3');
              t.map1[t.NumeroFrame2].un('singleclick', this.clickOnMap);
              t.map1[t.NumeroFrame2].on('singleclick', this.clickOnMap.bind(null, t));
            } */

            /* const ritornoWMS = wmsG.getSource();
            ritornoWMS.on('imageloadend', function(event) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'imageloadend event',event);
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per aver finito di leggere e disegnare', t.NumeroFrame);
              }
              t.staDisegnandoOverlay[t.NumeroFrame2] = false;
            });
            ritornoWMS.on('imageloaderror', function(event) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'imageloaderror event',event);
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per errore durante il leggere e disegnare', t.NumeroFrame);
              }
              t.staDisegnandoOverlay[t.NumeroFrame2] = false;
            });

            let q = 0;
            const rt = setInterval(() => {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: attesa arrivo riempimento variabile', t.NumeroFrame, t.overlayLayerGlobal);
              }
              if (t.overlayLayerGlobal) {
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per aver finito di leggere e disegnare', t.NumeroFrame, t.overlayLayerGlobal);
                }
                t.staDisegnandoOverlay[t.NumeroFrame2] = false;
                clearInterval(rt);
              } else {
                q++;
                if (q > 20) {
                  if (t.debug2 === true) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per non aver finito di disegnare', t.NumeroFrame);
                  }
                  t.staDisegnandoOverlay[t.NumeroFrame2] = false;
                  clearInterval(rt);
                }
              }
            }, 500); */
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per tipo NON Cluster', t.NumeroFrame);
            }
            t.staDisegnandoOverlay[t.NumeroFrame2] = false;
          }
        } else {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Overlay: Esco per chiamata uguale', t.NumeroFrame);
          }
          t.staDisegnandoOverlay[t.NumeroFrame2] = false;
        }
      // } else {
      //   t.staDisegnandoOverlay = false;
      // }

      /* t.map1[t.NumeroFrame2].on('pointermove', (evt) => {
        if (evt.dragging) {
          return;
        }
        const pixel = t.map1[t.NumeroFrame2].getEventPixel(evt.originalEvent);
        const hit = t.map1[t.NumeroFrame2].forEachLayerAtPixel(pixel, function(e) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e.values_.source);
          return true;
        });
        t.map1[t.NumeroFrame2].getTargetElement().style.cursor = hit ? 'pointer' : '';
      }); */
    } else {
      t.staDisegnandoOverlay[t.NumeroFrame2] = false;
    }
  }

  disegnaAgentPosition(t, agnGroup2) {
    // logConsole('L_agn 1');

    const ora = new Date().getTime();
    if ((ora - t.agentPosition[t.NumeroFrame2]) < 1000) {
      t.staDisegnandoSartPosition[t.NumeroFrame2] = false;
      return;
    }
    t.agentPosition[t.NumeroFrame2] = ora;

    // logConsole('L_agn 2');

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo6[t.NumeroFrame2] = false;
      // logConsole('L_agn 2 Esco');

      return;
    }

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGrafico2 && t.MappaOGrafico2 !== 'M' || aperto === false) {
      t.staDisegnandoSartPosition[t.NumeroFrame2] = false;
      return;
    } */

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno agent position', t.NumeroFrame2, t.sartPosition2, t.MappaOGrafico2);

    if (t.ConnessioneStabilita === 'OK') {
      // logConsole('L_agn 3');
  
      if (!t.sartPosition2 || t.sartPosition2 === false) { // } || !t.act_set || t.act_set === null || t.act_set === '') {
        t.removeLayerFromMap('Path sart position', t.pathSartPosition[t.NumeroFrame2]);
        t.pathSartPosition[t.NumeroFrame2] = undefined;
        t.lastCallSartPosition[t.NumeroFrame2] = '';

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da SART Position', t.sartPosition2, t.act_set);

        t.staDisegnandoSartPosition[t.NumeroFrame2] = false;
        this.layerAttivo6[t.NumeroFrame2] = false;
        // logConsole('L_agn 3 Esco');

        return;
      }

      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
      /* const ora2 = new Date().getTime();
      if (ora2 - this.ultimaVoltaTMS6 < t.ritardoPerFunzioni && this.ultimaVoltaTMS6 !== -1) {
        t.staDisegnandoSartPosition = false;
        return;
      }
      this.ultimaVoltaTMS6 = ora2; */
      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

      /* if (t.Activity2 === -1) {
        t.Activity2 = 1; // IMPOSTATO PERCHE' IN QUESTA MASCHERA ERA SEMPRE -1... RICONTROLLARE IN FUTURO
      }

      let agnact = '';
      if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
        agnact = 'null';
      } else {
        agnact = '\'' + ExternalUtilities.stringaAGNoACT + '\'';
      }

      if (t.tipoDataset2 === 2) {
        valoreRicerca = agnact;
      } */
      // logConsole('L_agn 4');
      if (t.eseguitoInProgetto2 === false && (t.act_set === undefined || t.act_set === 'undefined')) {
        t.staDisegnandoSartPosition[t.NumeroFrame2] = false;
        this.layerAttivo6[t.NumeroFrame2] = false;
        // logConsole('L_agn 4 Esco');
        return;
      }

      // logConsole('L_agn 5');
      let valoreRicerca;
      if (t.eseguitoInProgetto2 === true) {
        // if (t.tipoDataset2 === 1) {
          if (t.listaActSet2) {
            valoreRicerca = '\'' + t.listaActSet2 + '\'';
          } else {
            if (agnGroup2 === undefined || agnGroup2 === 'undefined') {
              t.staDisegnandoSartPosition[t.NumeroFrame2] = false;
              this.layerAttivo6[t.NumeroFrame2] = false;
              return;
            }

            valoreRicerca = '\'' + agnGroup2 + '\'';
          }

        // } else {
        //   valoreRicerca = '\'' + t.actSetNameFM + '\'';
        // }
      } else {
        valoreRicerca = '\'' + t.act_set + '\'';
      }

      // logConsole('L_agn 6');
      const nomeLayer = 'Geo_ANTS:l_agn';
      let parametri = 'cntx_id:\'' + t.sessionID2 + '\';' +
        'v_act_set_name_list:' + valoreRicerca;

      // const bbox = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
      // parametri += ';' + bbox;
      
      const bbox = ExternalUtilities.ritornaBboxGiusta(t, 'Measures'); // ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
      if (bbox.indexOf('NaN') > -1 || bbox.indexOf('undefined') > -1) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per bbox non valida: ', t.NumeroFrame2, bbox);
        // return;
      }
      let bb = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';';
      bb += 'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];
      parametri += ';' + bb;

      const parameters = {
        LAYERS: nomeLayer,
        TILED: false,
        VIEWPARAMS: parametri
        // 'CQL_FILTER': act_set + tmsFilter + ' and act_id in (' + act_id + ')'
      };

      const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
        t.frameAttivo + ';' + t.act_set + ';';

      const actualCall = 'SARTPOSITION;' + JSON.stringify(parameters) + valoriDiBase;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri SART Position', actualCall, t.eseguitoInProgetto2, t.progettoEsterno2);

      // logConsole('L_agn 7');
      // if (t.lastCallSartPosition[t.NumeroFrame2] !== actualCall || (t.eseguitoInProgetto2 === true && t.progettoEsterno2 === 'FleetManager')) {
      //   t.lastCallSartPosition[t.NumeroFrame2] = actualCall;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Sart Position', t.NumeroFrame, parameters);

        // logConsole('L_agn 8');
        /* let q = 0;
        const tt = setInterval(() => {
          if (wms.loading === true) {
            q++;
            if (q > 30) {
              t.staDisegnandoSartPosition[t.NumeroFrame2] = false;

              clearInterval(tt);
            }
          } else {
            clearInterval(tt); */

            if (t.pathSartPosition[t.NumeroFrame2] && t.pathSartPosition[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource6) {
              const parameters = {
                LAYERS: nomeLayer,
                TILED: false,
                VIEWPARAMS: parametri
                // 'CQL_FILTER': act_set + tmsFilter + ' and act_id in (' + act_id + ')'
              };

              this.layerAttivo6[t.NumeroFrame2] = true;
              t.pathSartPosition[t.NumeroFrame2].getSource().updateParams(parameters); // .setSource(wms);
            } else {
              if (t.pathSartPosition[t.NumeroFrame2]) {
                t.removeLayerFromMap('Path sart position 2', t.pathSartPosition[t.NumeroFrame2]);
                t.pathSartPosition[t.NumeroFrame2] = undefined;
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
                  if (!this.layerAttivo6[t.NumeroFrame2]) { return; }

                  const timestamp = new Date().getTime();
                  const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                  const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                  image.getImage()['src'] = noCacheUrl2;
                }
              });

              const newWms = new ImageLayer({
                source: wms
              });

              t.addLayerToMap(newWms, 50, 'AgentPosition');
              t.pathSartPosition[t.NumeroFrame2] = newWms;
              this.layerAttivo6[t.NumeroFrame2] = true;
            }

            t.staDisegnandoSartPosition[t.NumeroFrame2] = false;
          /* }
        }, 1000); */
      // } else {
      //   t.staDisegnandoSartPosition[t.NumeroFrame2] = false;
      // }
    } else {
      t.staDisegnandoSartPosition[t.NumeroFrame2] = false;
    }
  }

  disegnaSchedSel(t, agnGroup) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo7[t.NumeroFrame2] = false;

      return;
    }

    if (t.eseguitoInProgetto2 === false || !t.map1[t.NumeroFrame2]) {
      this.layerAttivo7[t.NumeroFrame2] = false;
      return;
    }

    if (t.ConnessioneStabilita === 'OK') {

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*       let aperto = true;
      if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
        aperto = false;
      }
      if (t.MappaOGrafico2 && t.MappaOGrafico2 !== 'M' || aperto === false) {
        t.staDisegnandoSchedSel[t.NumeroFrame2] = false;
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno sched sel: Esco 0', t.NumeroFrame2);
        }
          return;
      } */
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno sched sel', t.frameVisible2);

      /* if (t.pathSchedSel) {
        t.removeLayerFromMap(t.pathSchedSel);
        t.pathSchedSel = undefined;
      } */

      if (t.eseguitoInProgetto2 === false && (t.act_set === undefined || t.act_set === 'undefined')) {
        this.layerAttivo7[t.NumeroFrame2] = false;
        return;
      }

      let valoreRicerca = '\'' + t.act_set + '\'';
      // if (t.tipoDataset2 === 2) {
      //  valoreRicerca = agnGroupId;
      // }
      if (t.eseguitoInProgetto2 === true) {
        if (t.tipoDataset2 === 1) {
          if (agnGroup === undefined || agnGroup === 'undefined') {
            this.layerAttivo7[t.NumeroFrame2] = false;
            return;
          }

          if (t.listaActSet2) {
            valoreRicerca = '\'' + t.listaActSet2 + '\'';
          } else {
            valoreRicerca = '\'' + agnGroup + '\'';
          }
        } else {
          if (t.actSetNameFM === undefined || t.actSetNameFM === 'undefined') {
            this.layerAttivo7[t.NumeroFrame2] = false;
            return;
          }

          valoreRicerca = '\'' + t.actSetNameFM + '\'';
        }
      }

      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
      /* const ora = new Date().getTime();
      if (ora - this.ultimaVoltaTMS7 < t.ritardoPerFunzioni && this.ultimaVoltaTMS7 !== -1) {
        t.staDisegnandoSchedSel = false;
        return;
      }
      this.ultimaVoltaTMS7 = ora; */
      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

      const nomeLayer = 'Geo_ANTS:l_ts_sched';
      let parametri = 'cntx_id:\'' + t.sessionID2 + '\';' +
        'v_act_set_name_list:' + valoreRicerca;
      
      // const bbox = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
      // parametri += ';' + bbox;

      const bbox = ExternalUtilities.ritornaBboxGiusta(t, 'Measures'); // ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
      if (bbox.indexOf('NaN') > -1 || bbox.indexOf('undefined') > -1) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per bbox non valida: ', t.NumeroFrame2, bbox);
        // return;
      }
      let bb = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';';
      bb += 'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];
      parametri += ';' + bb;
  
      const parameters = {
        LAYERS: nomeLayer,
        TILED: false,
        VIEWPARAMS: parametri
        // 'CQL_FILTER': act_set + tmsFilter + ' and act_id in (' + act_id + ')'
      };

      const valoriDiBase = ';' + t.dashboardAttiva2 + ';' + t.NumeroFrame + ';' +
        t.frameAttivo + ';' + t.act_set + ';';

      t.staDisegnandoSchedSel[t.NumeroFrame2] = true;
      const actualCall = 'SCHEDSEL;' + JSON.stringify(parameters) + valoriDiBase;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri Sched Sel', t.lastCallSchedSel[t.NumeroFrame2], actualCall);

      if (t.lastCallSchedSel[t.NumeroFrame2] !== actualCall || (t.eseguitoInProgetto2 === true && t.progettoEsterno2 === 'FleetManager')) {
        t.lastCallSchedSel[t.NumeroFrame2] = actualCall;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Sched Sel', t.NumeroFrame, parameters);

        /* let q = 0;
        const tt = setInterval(() => {
          if (wms.loading === true) {
            q++;
            if (q > 30) {
              t.staDisegnandoSchedSel[t.NumeroFrame2] = false;

              clearInterval(tt);
            }
          } else {
            clearInterval(tt); */

            // if (t.debug === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Layer l_ts_sched:', t.pathSchedSel[t.NumeroFrame2]);
            // }

            if (t.pathSchedSel[t.NumeroFrame2] && t.pathSchedSel[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource7) {
              this.layerAttivo7[t.NumeroFrame2] = true;
              t.pathSchedSel[t.NumeroFrame2].getSource().updateParams(parameters); // .setSource(wms);
            } else {
              // if (!this.GestisceLayerConSetSource7) {
                if (t.pathSchedSel[t.NumeroFrame2]) {
                  t.removeLayerFromMap('Path sched sel', t.pathSchedSel[t.NumeroFrame2]);
                  t.pathSchedSel[t.NumeroFrame2] = undefined;
                }
              // }

              const wms = new ImageWMS({
                ratio: 1, // immagine grande quanto la mappa (default 1.5 = 2,25x i pixel)
                url: t.Utils.indirizzoGEOServer + t.urlWms,
                projection: 'EPSG:4326',
                // renderer: 'antialias: true;',
                params: parameters,

                // Sovrascrivere l'URL per evitare la cache
                imageLoadFunction: (image, src) => {
                  if (!this.layerAttivo7[t.NumeroFrame2]) { return; }

                  const timestamp = new Date().getTime();
                  const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                  const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                  image.getImage()['src'] = noCacheUrl2;
                }
              });

              const newWms = new ImageLayer({
                source: wms,
              });

              t.addLayerToMap(newWms, 16, 'SchedSel');
              t.pathSchedSel[t.NumeroFrame2] = newWms;
              this.layerAttivo7[t.NumeroFrame2] = true;
            }

            t.staDisegnandoSchedSel[t.NumeroFrame2] = false;
          /* }
        }, 1000); */
      } else {
        t.staDisegnandoSchedSel[t.NumeroFrame2] = false;
      }
    }
  }
}

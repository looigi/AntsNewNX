import { logConsole } from '../console-log';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import { environment } from '../../../../environments/environment';
// import Utils from '../Utilities.component';

@Injectable()
export class PuntoSelezionatoComponent {
  // lastCall = ['', '', '', '', '', '', '', '', '', '',  ''];
  // ultimaVoltaTMS = -1;
  GestisceLayerConSetSource = true;
  layerAttivo = ExternalUtilities.creaVettore(environment.quantePagine, false);
  
  disegnaPuntoSelezionato(t, tms) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      // logConsole('Esco da path point 8');
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Mappa', t.NumeroFrame2, t.MappaOGrafico2);
      // logConsole('Esco da path point 7');
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno punto selezionato', t.NumeroFrame2);

    if (!tms || t.eseguitoInProgetto2 === true) {
      t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna punto selezionato: frame ' + t.NumeroFrame + '. Esco 1');
      // logConsole('Esco da path point 6');
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGrafico2 !== 'M' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco dal punto selezionato 1', t.MappaOGrafico2, t.frameVisible2, t.eseguitoInProgetto2);
      }
      t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
      return;
    } */

    if (t.MappaOGrafico2 !== 'M' || t.map1[t.NumeroFrame2]=== undefined) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco dal punto selezionato 2', t.MappaOGrafico2, t.frameVisible2, t.eseguitoInProgetto2);
      t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
      // logConsole('Esco da path point 5');
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    if (t.eseguitoInProgetto2 === true) { // && (t.permessoFleetManagerAM2 === undefined || t.permessoFleetManagerAM2 === false)) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco dal punto selezionato 5');
      t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
      // logConsole('Esco da path point 4');
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS < t.ritardoPerFunzioni && this.ultimaVoltaTMS !== -1) {
      t.staDisegnandoPuntoSelezionato = false;
      return;
    }
    this.ultimaVoltaTMS = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tms);
    if (t.eseguitoInProgetto2 === true) {
      tms = '';
    }
    const tm3 = tms.toString().replace('T', ' ').replace('Z', ' ');
    let tms2 = t.datePipe.transform(tm3.replace('T', ' ').replace('Z', ' ') + ' UTC +00', 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    let tms1 = tms2;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tms2);
    // if (typeof(tms) === 'number') {
    //   tms2 = t.datePipe.transform(tms, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    // }

    // if (tms2 === undefined) {
    //   return;
    // }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tms2);
    // if (tms2.indexOf('.') > -1) {
    //   tms2 = tms2.substring(0, tms2.indexOf('.'));
    // }

    // const act_set = ' geo_act_set_name = \'' + t.act_set + '\'';

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
    // logConsole('Valore ricerca path point', t.NumeroFrame2, valoreRicerca, t.act_set, agnact);
    if (!valoreRicerca || valoreRicerca === 'undefined') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco dal punto selezionato per act_set/agnact vuoto');

      t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
      t.staDisegnandoServingCell[t.NumeroFrame2]  = false
      // logConsole('Esco da path point 3');
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    // let qualeBbox = ExternalUtilities.ritornaBboxGiusta(t, 'PuntoSelezionato');

    if (t.eseguitoInProgetto2 === true) {
      if (t.agnGroup2 === undefined || t.agnGroup2 === 'undefined') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco dal punto selezionato per agn vuoto');

        t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
        t.staDisegnandoServingCell[t.NumeroFrame2]  = false
        // logConsole('Esco da path point 2');
        this.layerAttivo[t.NumeroFrame2] = false;

        return;
      }

      valoreRicerca = '\'' + t.agnGroup2 + '\'';
      // logConsole('Valore ricerca path point', t.NumeroFrame2, valoreRicerca);

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AGN Passato', t.agnGroup2);
      }

      if (t.tmsPassatiDaProgettoTcRun2 === undefined || t.tmsPassatiDaProgettoTcRun2 === 'undefined') {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco dal punto selezionato per tms vuoti');
        }
        t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
        t.staDisegnandoServingCell[t.NumeroFrame2]  = false
        // logConsole('Esco da path point 1');
        this.layerAttivo[t.NumeroFrame2] = false;

        return;
      }
      const tt = t.tmsPassatiDaProgettoTcRun2.split(';');
      tms1 = tt[0];
      tms2 = tt[0] + 1000;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Impostato tmsPassato per chiamata punto selezionato', t.NumeroFrame2, tms1, tms2, t.tmsPassatiDaProgettoTcRun2);
    }

    let vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
      'v_act_set_name_list:' + valoreRicerca + ';' +
      'v_tms_min:\'' + tms1 + '\';' +
      'v_tms_max:\'' + tms2 + '\';';

    // let bbox = JSON.stringify(qualeBbox); // JSON.stringify(ExternalUtilities.prendeBBOXSoloValori(t.map1[t.NumeroFrame2]));
    // bbox = ExternalUtilities.effettuaReplace(bbox, ',', '\\,');
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'BBOX:', bbox);
    /* if (!bbox || (bbox && bbox.indexOf('-90') > -1 && bbox.indexOf('-180') > - 1)) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco dal l_act_path_point per bbox immensa');
      }
      t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
      return;
    } */

    // vParams += ';v_bbox:\'' + bbox.replace('[', 'BOX(').replace(']', ')') + '\'';

    // const bb = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
    // vParams += bb + ';';
    
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
    vParams += bb + ';';

    // FILTER
    const filtri = ExternalUtilities.prendeFiltri(t, true, 'PuntoSelezionato');
    const cm1 = filtri.cm1;
    const cm2 = filtri.cm2;
    const tf1 = filtri.tf1;
    const tf2 = filtri.tf2;
    // FILTER

    vParams +=
      'v_filter_measr_code_1: ' + cm1 + ';';
      'v_filter_measr_value_1: ' + tf1 + ';';
      'v_filter_measr_code_2: ' + cm2 + ';';
      'v_filter_measr_value_2: ' + tf2 + ';';

    while(vParams.indexOf(';;') > -1) {
      vParams = vParams.replace(';;', ';');
    }
    
    const parameters = {
      LAYERS: 'Geo_ANTS:l_act_path_point',
      TILED: false,
      STYLES: 's_act_path_point_time_cursor',
      // CQL_FILTER: act_set + ' and tms = \'' + tms2 + '\''
      NUMEROFRAME: t.NumeroFrame2,
      VIEWPARAMS: vParams,
      CHIAMATA: 'Manuale'
    };
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, parameters);

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri Punto Selezionato', t.NumeroFrame, parameters);

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const actualCall = 'PATH;' + JSON.stringify(parameters) + valoriDiBase ;

    /* if (!t.Utils.puntoSelezionato) {
      t.Utils.puntoSelezionato = new Array();
    } */

    if (t.puntoSelezionato[t.NumeroFrame2] !== actualCall) {
      t.puntoSelezionato[t.NumeroFrame2] = actualCall;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Punto Selezionato', t.NumeroFrame, parameters);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Punto selezionato frame ', t.NumeroFrame, parameters);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, wms);

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
          clearInterval(tt);

          if (wms) { */

            if (t.puntoSelezionatoLayer[t.NumeroFrame2] && t.puntoSelezionatoLayer[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource) {
              // try {
                const parameters = {
                  LAYERS: 'Geo_ANTS:l_act_path_point',
                  TILED: false,
                  STYLES: 's_act_path_point_time_cursor',
                  // CQL_FILTER: act_set + ' and tms = \'' + tms2 + '\''
                  NUMEROFRAME: t.NumeroFrame2,
                  VIEWPARAMS: vParams,
                  CHIAMATA: 'Automatica'
                };
                // logConsole('Aggiornamento layer', parameters);
                this.layerAttivo[t.NumeroFrame2] = true;

                t.puntoSelezionatoLayer[t.NumeroFrame2].getSource().updateParams(parameters); // .setSource(wms);
              // } catch (e) {
              //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nell\'update del layer punto selezionato ', e['message']);
              // }
            } else {
              if (t.puntoSelezionatoLayer[t.NumeroFrame2]) {
                // const tm = setTimeout(() => {
                // clearTimeout(tm);
                  t.removeLayerFromMap('Selected point', t.puntoSelezionatoLayer[t.NumeroFrame2]);
                  t.puntoSelezionatoLayer[t.NumeroFrame2] = undefined;
                // }, 1000);
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
                  if (!this.layerAttivo[t.NumeroFrame2]) { return; }

                  const timestamp = new Date().getTime();
                  const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                  const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                  image.getImage()['src'] = noCacheUrl2;
                }
              });
        
              const newWms = new ImageLayer({
                source: wms
              });
              // t.wmsPuntoSelezionato[t.NumeroFrame2] = wms;
  
              t.addLayerToMap(newWms, 20, 'PuntoSelezionato');
              this.layerAttivo[t.NumeroFrame2] = true;
              t.puntoSelezionatoLayer[t.NumeroFrame2] = newWms;
            }

            t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
            /* } else {
            t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
          }
        }
      }, 1000); */

    } else {
      t.staDisegnandoPuntoSelezionato[t.NumeroFrame2] = false;
    }
  }
}

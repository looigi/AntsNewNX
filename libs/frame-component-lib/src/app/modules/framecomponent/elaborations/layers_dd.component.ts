import { logConsole } from '../console-log';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
// import TileWMS from 'ol/source/TileWMS.js';
// import Tile from 'ol/layer/Tile.js';
import { Injectable } from '@angular/core';
// import Utils from '../Utilities.component';
// import {transform} from 'ol/proj';
import ExternalUtilities from '../ExternalUtilities.component';
// import { environment } from '../../../../environments/environment.prod';
import {transform} from 'ol/proj';
import { environment } from '../../../../environments/environment';

@Injectable()
export class LayersDDComponent {
  // lastCallAntenneDD = undefined;
  // lastCallCluster = undefined;
  // ultimaVoltaTMS = -1;
  // ultimaVoltaTMS2 = -1;
  
  GestisceLayerConSetSource = true;
  layerAttivo1 = ExternalUtilities.creaVettore(environment.quantePagine, false);
  layerAttivo2 = ExternalUtilities.creaVettore(environment.quantePagine, false);

  constructor(
  ) {
  }

  pulisceAppoggi(t) {
    this.layerAttivo1[t.NumeroFrame2] = false;
    if (t.antennaLayerDD[t.NumeroFrame2]) {
      t.removeLayerFromMap('Antenna layer DD', t.antennaLayerDD[t.NumeroFrame2]);
      t.antennaLayerDD[t.NumeroFrame2] = undefined;
    }
    this.layerAttivo2[t.NumeroFrame2] = false;
    if (t.clusterLayerDD[t.NumeroFrame2]) {
      t.removeLayerFromMap('Cluster DD', t.clusterLayerDD[t.NumeroFrame2]);
      t.clusterLayerDD[t.NumeroFrame2] = undefined;
    }

    t.lastCallAntenneDD[t.NumeroFrame2] = '';
    t.lastCallCluster[t.NumeroFrame2] = '';
  }

  ultimaVoltaAntenne = -1;

  disegnaAntenne(t, nomeAntenna, parametriAntenne, daDove) {
    // logConsole('Disegna antenne 1', nomeAntenna, t.MappaOGrafico2, daDove);

    if (t.MappaOGrafico2 !== 'M' || t.map1[t.NumeroFrame2]=== undefined) {
      if (!t.eseguitoInProgetto2) {
        // logConsole('Disegna antenne 1. Esco', t.NumeroFrame2, daDove);
        this.layerAttivo1[t.NumeroFrame2] = false;
        this.layerAttivo2[t.NumeroFrame2] = false;

        return;
      }
    }

    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaAntenne < 500) {
      // logConsole('Disegna antenne 2. Esco', t.NumeroFrame2, daDove);
      return;
    }
    this.ultimaVoltaAntenne = ora;

    // logConsole('Disegna antenne 2', t.isCheckedAntenne2, t.eseguitoInProgetto2, t.progettoEsterno2);
    if (t.eseguitoInProgetto2 === true && t.progettoEsterno2 !== 'DD;Cluster') {
      t.isCheckedAntenne2 = 1;
    }
    // logConsole('Disegna antenne 2.5', t.NumeroFrame2, t.isCheckedAntenne2, daDove);

    if (t.isCheckedAntenne2 === true || t.isCheckedAntenne2 === false || t.isCheckedAntenne2 === undefined) {
      t.isCheckedAntenne2 = 0;
    }

    if (t.isCheckedAntenne2 === 0) {
      // logConsole('Antenne Pulisco');

      this.layerAttivo1[t.NumeroFrame2] = false;
      if (t.antennaLayerDD[t.NumeroFrame2]) {
        t.removeLayerFromMap('Antenna layer DD', t.antennaLayerDD[t.NumeroFrame2]);
        t.antennaLayerDD[t.NumeroFrame2] = undefined;
        t.lastCallAntenneDD[t.NumeroFrame2] = '';
      }
    } else {
      let nomeStyle = '';
      let nomeLayer = '';
      t.Utils.antenne.forEach(element => {
        if (t.isCheckedAntenne2 === element.id) {
          nomeStyle = element.style;
          nomeLayer = element.layer;
        }
      });

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne con stile', t.isCheckedAntenne2, nomeLayer, nomeStyle, '->' + nomeAntenna + '<-');

      // logConsole('Disegna antenne 2.75', t.NumeroFrame2, nomeAntenna, daDove);

      if (nomeAntenna === undefined || nomeAntenna === null || nomeAntenna === 'null' || nomeAntenna === '\'null\'' || nomeAntenna === '"null"'
        || nomeAntenna === '' || nomeAntenna === 'undefined') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne. Esco per nome antenna nullo', nomeAntenna);
        this.layerAttivo1[t.NumeroFrame2] = false;

        return;
      }

      // logConsole('Disegna antenne 3', t.NumeroFrame2, daDove);

      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
      /* const ora = new Date().getTime();
      if (ora - this.ultimaVoltaTMS < t.ritardoPerFunzioni && this.ultimaVoltaTMS !== -1) {
        return;
      }
      this.ultimaVoltaTMS = ora; */
      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

      let netTech = 'null';
      let bandList = 'null';
      let tmsMin = 'null';
      let tmsMax = 'null';
      let viewMode = 'null';
      let codeLike = 'null';
      let ch = 'null';
      let bsic = 'null';
      let scr = 'null';
      let pci = 'null';
      let territory = 'null';
      let freeText = 'null';

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne. Eseguito in progetto ', t.eseguitoInProgetto2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne. Time Filter ', t.timeFilter2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne. tmsInizio ', t.Utils.tmsInizio);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne. tmsFine ', t.Utils.tmsFine);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne. Range start ', t.timeRangeDSFStart2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne. Range stop ', t.timeRangeDSFStop2);

      // logConsole('Disegna antenne 4', daDove);

      if (t.eseguitoInProgetto2 === true && t.progettoEsterno2 !== 'DD;Cluster' && parametriAntenne && parametriAntenne.indexOf("§") > -1) {
        const p = parametriAntenne.split('§');
        if (p.length > 2) {
          netTech = p[0]; if (netTech === '') { netTech = 'null'; }
          bandList = p[1]; if (bandList === '') { bandList = 'null'; }
          tmsMin = p[2]; if (tmsMin === '') { tmsMin = 'null'; }
          tmsMax = p[3]; if (tmsMax === '') { tmsMax = 'null'; }
          viewMode = p[4]; if (viewMode === '') { viewMode = 'null'; }
          codeLike = p[10]; if (codeLike === '') { codeLike = 'null'; }
          ch = p[9]; if (ch === '') { ch = 'null'; }
          bsic = p[8]; if (bsic === '') { bsic = 'null'; }
          scr = p[7]; if (scr === '') { scr = 'null'; }
          pci = p[6]; if (pci === '') { pci = 'null'; }
          territory = p[5];
          if (territory === '') {
            territory = 'null';
          } else {
            if (territory.indexOf('\'') === -1 && territory !== 'null') {
              territory = '\'' + territory + '\'';
            }
          }
          freeText = p[11];
          if (freeText === '') {
            freeText = 'null';
          } else {
            if (freeText.indexOf('\'') === -1 && freeText !== 'null') {
              freeText = '\'' + freeText + '\'';
            }
          }
        } else {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne. Esco per parametri non validi: ', p);
          this.layerAttivo1[t.NumeroFrame2] = false;

          return;
        }
      } else {
        if (t.timeFilter === 2) {
          if (t.Utils.tmsInizio && t.Utils.tmsFine) {
            tmsMin = t.Utils.tmsInizio;
            tmsMax = t.Utils.tmsFine;
            if (tmsMin.indexOf('\'') === -1) {
              tmsMin = '\'' + tmsMin + '\'';
            }
            tmsMin = tmsMin.replace('\'\'', '\'');
            if (tmsMax.indexOf('\'') === -1) {
              tmsMax = '\'' + tmsMax + '\'';
            }
          }
        } else {
          if (t.timeRangeDSFStart2 && t.timeRangeDSFStop2) {
            tmsMin = t.timeRangeDSFStart2;
            tmsMax = t.timeRangeDSFStop2;
            if (tmsMin.indexOf('\'') === -1) {
              tmsMin = '\'' + tmsMin + '\'';
            }
            if (tmsMax.indexOf('\'') === -1) {
              tmsMax = '\'' + tmsMax + '\'';
            }
          } else {
            tmsMin = 'null';
            tmsMax = 'null';
          }
        }
      }
      if (!tmsMin) { tmsMin = 'null'; }
      if (!tmsMax) { tmsMax = 'null'; }

      // logConsole('Disegna antenne 5', t.NumeroFrame2, tmsMin, tmsMax, daDove);

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne. tmsMin ', tmsMin);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno antenne. tmsMax ', tmsMax);

      let q = 0;
      if (this.tt) {
        clearInterval(this.tt);
        this.tt = undefined;
      }

      this.tt = setInterval(() => {
        if (ExternalUtilities.bboxMaschera[t.NumeroFrame2]) {
          clearInterval(this.tt);
          
          this.prosegui(t, nomeAntenna, netTech, bandList, tmsMin, tmsMax, viewMode, ch, bsic, scr, pci, territory, freeText, daDove, nomeLayer, nomeStyle);
        } else {
          q++;
          logConsole('Attesa bbox', q);
          if (q > 10) {
            clearInterval(this.tt);
            this.layerAttivo1[t.NumeroFrame2] = false;
            logConsole('Timeout bbox su disegno path');
          }
        }
      }, 500);
    }
  }

  tt;

  prosegui(t, nomeAntenna, netTech, bandList, tmsMin, tmsMax, viewMode, ch, bsic, scr, pci, territory, freeText, daDove, nomeLayer, nomeStyle) {
    let vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
      'v_antenna_set_name_list:\'' + nomeAntenna + '\';' +
      'v_xcgi_list:null;' +
      'v_net_tech_list:' + netTech + ';' +
      'v_band_list:' + bandList + ';' +
      'v_tms_min:' + tmsMin + ';' +
      'v_tms_max:' + tmsMax + ';' +
      'v_view_mode:' + viewMode + ';' +
      'v_ch:' +  (!ch || ch === 'null' ? null : ch) + ';' +
      'v_bsic:' + (!bsic || bsic === 'null' ? null : bsic) + ';' +
      'v_scr:' + (!scr || scr === 'null' ? null : scr) + ';' +
      'v_pci:' + (!pci || pci === 'null' ? null : pci) + ';' +
      'v_territory:' + (territory === '\'null\'' ? null : territory) + ';' +
      'v_free_text:' + (freeText === '\'null\'' ? null : freeText) + ';' +
      'v_chiamante: \'Frame per layer DD\'';

    /* const bbox = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'BBOX ', bbox);
    }
    vParams += ';' + bbox; */
    /* if (bbox.indexOf('bbox_min_x:-180') > -1 && bbox.indexOf('bbox_min_y:-90') > -1 &&
      bbox.indexOf('bbox_max_x:180') > -1 && bbox.indexOf('bbox_max_y:90') > -1) {
        return;
    } */

    let bbox2;

    // if (!t.eseguitoInProgetto2) {
      bbox2 = ExternalUtilities.ritornaBboxGiusta(t, 'AntenneDD'); // ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
    /* } else {
      // bbox2 = t.bboxProgetto;
      if (t.map1[t.NumeroFrame2] && t.map1[t.NumeroFrame2].getView()) {
        const bbox = t.map1[t.NumeroFrame2].getView().calculateExtent(t.map1[t.NumeroFrame2].getSize());
        /* if (t.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Extent in precompose: ', bbox);
        } * /
        bbox2 = transform(bbox, 'EPSG:3857', 'EPSG:4326');        
      }
    } */        
    // logConsole('Disegna antenne 6. BBOX: ', bbox2, daDove);
    // // logConsole('Disegna antenne 6.1: 1->', ExternalUtilities.bboxMaschera[t.NumeroFrame2]);
    // // logConsole('Disegna antenne 6.1: 2->', t.bboxOverview);
    // // logConsole('Disegna antenne 6.1: 3->', t.bboxZoom);

    if (!bbox2 || bbox2.indexOf('NaN') > -1 || bbox2.indexOf('undefined') > -1 || !bbox2[0] || bbox2[0] === 'undefined') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per bbox non valida: ', t.NumeroFrame2, bbox2);
      this.layerAttivo1[t.NumeroFrame2] = false;

      return;
    }

    // logConsole('BBOX antenne prima', bbox);
    const bbox = t.sistemaCoordinate(bbox2, '4326');
    // logConsole('BBOX antenne dopo', bbox);
    const bb = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';' +
      'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];
    vParams += ';' + bb;

    // logConsole('Chiamata antenna 2', t.NumeroFrame2, vParams);

    t.pendings += 'Antenne<br />';

    // vParams += ';geoants_bbox_min_x:-180;geoants_bbox_min_y:-90;geoants_bbox_max_x:180;geoants_bbox_max_y:90';

    const par = {
      LAYERS: 'Geo_ANTS:' + nomeLayer,
      TILED: false,
      STYLES: nomeStyle,
      // CQL_FILTER: 'antenna_set_name=\'' + nomeAntenna + '\'',
      VIEWPARAMS: vParams
    };

    // logConsole('Disegna antenne 7', par);

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';' + t.act_set + ';';
    const actualCall1 = 'ANTENNEDD;' + JSON.stringify(par) + ';' + valoriDiBase + ';';

    // logConsole('Antenne: ', par);

    if (t.lastCallAntenneDD[t.NumeroFrame2] !== actualCall1) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne params', t.NumeroFrame, actualCall1);

      t.lastCallAntenneDD[t.NumeroFrame2] = actualCall1;

      // logConsole('Disegna antenne 8', daDove);

      // logConsole('Antenne: ', vParams);
      /* let q = 0;
      const tt = setInterval(() => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'wms', wms);
        if (wmsSource1.loading === true) {
          q++;
          if (q > 30) {
            // t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;

            clearInterval(tt);

            t.pendings.replace('Antenne<br />', '');
          }
        } else {
          clearInterval(tt); */

          if (t.antennaLayerDD[t.NumeroFrame2] && t.antennaLayerDD[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource) {
            const nuoviParametri = { 
              LAYERS: 'Geo_ANTS:' + nomeLayer, 
              STYLES: nomeStyle, 
              VIEWPARAMS: vParams ,
              projection: 'EPSG:4326'
            };
            // logConsole('Nuovi parametri 1', nuoviParametri);
            this.layerAttivo1[t.NumeroFrame2] = true;

            t.antennaLayerDD[t.NumeroFrame2].getSource().updateParams(nuoviParametri); // .setSource(wms);
          } else {
            // if (!this.GestisceLayerConSetSource) {
              if (t.antennaLayerDD[t.NumeroFrame2]) {
                t.removeLayerFromMap('Antenna layer DD', t.antennaLayerDD[t.NumeroFrame2]);
                t.antennaLayerDD[t.NumeroFrame2] = undefined;
              }
            // }

            const wmsSource1 = new ImageWMS({
              ratio: 1, // immagine grande quanto la mappa (default 1.5 = 2,25x i pixel)
              projection: 'EPSG:4326',
              url: t.Utils.indirizzoGEOServer + t.urlWms,
              params: par,
              serverType: 'geoserver',
              /* tileLoadFunction: function (image, src) {
                const img = image.getImage();
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
              source: wmsSource1
            });

            t.addLayerToMap(newWms, 15, 'AntenneDD');
            t.antennaLayerDD[t.NumeroFrame2] = newWms;
            this.layerAttivo1[t.NumeroFrame2] = true;
          }

          t.pendings.replace('Antenne<br />', '');
        /* }
      }, 1000); */
    }
  }
  // }

  ultimaVoltaCluster = -1;

  disegnaCluster(t, nomeCluster) {
    if (t.MappaOGrafico2 !== 'M' || t.map1[t.NumeroFrame2]=== undefined) {
      this.layerAttivo2[t.NumeroFrame2] = false;

      return;
    }

    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaCluster < 1000) {
      return;
    }
    this.ultimaVoltaCluster = ora;

    const nomeStyle = 's_cluster_rec_color';
    const nomeLayer = 'l_cluster_rec';

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno cluster con stile', nomeLayer, nomeStyle);
    
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS2 < t.ritardoPerFunzioni && this.ultimaVoltaTMS2 !== -1) {
      return;
    }
    this.ultimaVoltaTMS2 = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    t.pendings += 'Cluster<br />';

    // const bbox = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);

    const bbox2 = ExternalUtilities.ritornaBboxGiusta(t, 'Cluster'); // ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
    if (bbox2.indexOf('NaN') > -1 || bbox2.indexOf('undefined') > -1) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per bbox non valida: ', t.NumeroFrame2, bbox2);

      // return;
    }

    const bbox = t.sistemaCoordinate(bbox2, '4326');

    let bb = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';';
    bb += 'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];

    let vParamsC = 'cntx_id:\'' + t.sessionID2 + '\';' +
      'v_cluster_set_code_list:\'' + nomeCluster + '\';' +
      'v_tms_min:null;' +
      'v_tms_max:null;' +
      'v_view_mode:null'
      ;
    // vParamsC += ';' + bbox;
    vParamsC += ';' + bb;
    // vParamsC += ';geoants_bbox_min_x:-180;geoants_bbox_min_y:-90;geoants_bbox_max_x:180;geoants_bbox_max_y:90';

    const par = {
      LAYERS: 'Geo_ANTS:' + nomeLayer,
      TILED: false,
      // VERSION: '1.1.1',
      STYLES: nomeStyle,
      // CQL_FILTER: 'cluster_set_name = \'' + nomeCluster + '\''
      VIEWPARAMS: vParamsC
    };

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';' + t.act_set + ';';
    const actualCall1 = 'CLUSTERDD;' + JSON.stringify(par) + ';' + valoriDiBase + ';';

    if (t.lastCallCluster[t.NumeroFrame2] !== actualCall1) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Cluster params', t.NumeroFrame, actualCall1);

      t.lastCallCluster[t.NumeroFrame2] = actualCall1;

      if (t.clusterLayerDD[t.NumeroFrame2] && t.clusterLayerDD[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource) {
        const nuoviParametri = { 
          LAYERS: 'Geo_ANTS:' + nomeLayer,
          STYLES: nomeStyle,
          VIEWPARAMS: vParamsC
        }
        this.layerAttivo2[t.NumeroFrame2] = true;

        t.clusterLayerDD[t.NumeroFrame2].getSource().updateParams(nuoviParametri); // .setSource(wms);
      } else {
        // if (!this.GestisceLayerConSetSource) {
          if (t.clusterLayerDD[t.NumeroFrame2]) {
            t.removeLayerFromMap('Cluster DD', t.clusterLayerDD[t.NumeroFrame2]);
            t.clusterLayerDD[t.NumeroFrame2] = undefined;
          }
        // }

        const wmsSource1 = new ImageWMS({
          ratio: 1, // immagine grande quanto la mappa (default 1.5 = 2,25x i pixel)
          projection: 'EPSG:4326',
          url: t.Utils.indirizzoGEOServer + t.urlWms,
          params: par,
          serverType: 'geoserver',
          /* tileLoadFunction: function (image, src) {
            const img = image.getImage();
            img.src = src;
          } */

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
          source: wmsSource1
        });

        t.addLayerToMap(newWms, 15, 'ClusterDD');
        t.clusterLayerDD[t.NumeroFrame2] = newWms;
        this.layerAttivo2[t.NumeroFrame2] = true;
      }

      t.pendings.replace('Cluster<br />', '');
    } else {
      t.pendings.replace('Cluster<br />', '');
    }
  }
}

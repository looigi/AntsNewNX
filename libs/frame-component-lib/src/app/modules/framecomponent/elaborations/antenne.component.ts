import { logConsole } from '../console-log';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

// import TileWMS from 'ol/source/TileWMS.js';
// import Tile from 'ol/layer/Tile.js';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import { environment } from '../../../../environments/environment';
// import { environment } from '../../../../environments/environment.prod';

// import Utils from '../Utilities.component';

@Injectable()
export class AntenneComponent {
  // lastCallAntenne = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCall1 = ['', '', '', '', '', '', '', '', '', '',  ''];
  // lastCall2 = ['', '', '', '', '', '', '', '', '', '',  ''];
  // ultimaVoltaTMS = -1;

  constructor(

  ) {
  }
  
  GestisceLayerConSetSource = true;
  layerAttivo = ExternalUtilities.creaVettore(environment.quantePagine, false);

  pulisceAppoggi(t) {
    this.layerAttivo[t.NumeroFrame2] = false;
    if (t.antennaLayer1[t.NumeroFrame2]) {
      t.removeLayerFromMap('Antenna layer 1', t.antennaLayer1);
      t.antennaLayer1[t.NumeroFrame2] = undefined;
    }
    t.lastCallAntenne[t.NumeroFrame2] = '';

    t.staDisegnandoServingCell[t.NumeroFrame2]  = false;
    t.lastCallAntenne[t.NumeroFrame2] = '';
  }

  ultimaVoltaAntenne = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  disegnaAntenne1e2(t, daDove) {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaAntenne[t.NumeroFrame2] < 1000) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per troppo veloce', t.NumeroFrame2, ora);
      this.layerAttivo[t.NumeroFrame2] = false;
  
      return;
    }
    this.ultimaVoltaAntenne[t.NumeroFrame2] = ora;
    // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Inizio', daDove);

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo[t.NumeroFrame2] = false;
      // logConsole('Antenne Esco 1');
      // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Esco 1', daDove);

      return;
    }

    if (t.eseguitoInProgetto2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per tipo progetto', t.NumeroFrame2, t.MappaOGrafico2);
      // logConsole('Antenne Esco 2');
      // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Esco 2', daDove);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo mappa', t.NumeroFrame2, t.MappaOGrafico2);
      // logConsole('Antenne Esco 2');
      // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Esco 3', daDove);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }
    
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Entro in disegna antenne', t.NumeroFrame2, t.isCheckedAntenne2);

    if (t.isCheckedAntenne2 === true || t.isCheckedAntenne2 === false || t.isCheckedAntenne2 === undefined) {
      t.isCheckedAntenne2 = -1;
    }

    // logConsole('Checked antenne: ', t.NumeroFrame2, t.isCheckedAntenne2);

    // t.eseguitoInProgetto2 === true || t.frameAttivo2 === 0) {
    if (t.MappaOGrafico2 !== 'M' || t.map1[t.NumeroFrame2] === undefined || t.isCheckedAntenne2 === -1 || 
      (t.eseguitoInProgetto2 === true && t.progettoEsterno2.indexOf('DD;') === -1) || 
      (t.frameAttivo2 === 0 && t.progettoEsterno2.indexOf('DD;') === -1)) {
      
      // logConsole('Pulisco antenne', t.NumeroFrame2, t.isCheckedAntenne2, t.eseguitoInProgetto2, t.progettoEsterno2, t.frameAttivo2);
      
      if (t.antennaLayer1[t.NumeroFrame2]) {
        t.removeLayerFromMap('Antenna layer 1', t.antennaLayer1[t.NumeroFrame2]);
        t.antennaLayer1[t.NumeroFrame2] = undefined;
      }
      /* if (t.antennaLayer2) {
        t.removeLayerFromMap('Antenna layer 2', t.antennaLayer2);
      } */
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.lastCallAntenne);
      t.lastCallAntenne[t.NumeroFrame2] = '';
      this.layerAttivo[t.NumeroFrame2] = false;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Esco da disegna antenne 1: ', t.NumeroFrame2, t.MappaOGrafico2, t.isCheckedAntenne2);

      t.staDisegnandoServingCell[t.NumeroFrame2]  = false;
      
      t.pendings.replace('Antenne<br />', '');

      // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Esco 4', daDove);

      return;
    }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS < t.ritardoPerFunzioni && this.ultimaVoltaTMS !== -1) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da disegna antenne 2: ', t.NumeroFrame2);
      }
      return;
    }
    this.ultimaVoltaTMS = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Check antenne layer', t.Utils.antenne, t.isCheckedAntenne2);

    let nomeStyle = '';
    let nomeLayer = '';
    t.Utils.antenne.forEach(element => {
      if (t.isCheckedAntenne2 === element.id) {
        nomeStyle = element.style;
        nomeLayer = element.layer;
      }
    });

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Nome layer e stile antenne', nomeLayer, nomeStyle);

    if (!nomeLayer || nomeLayer === null || nomeLayer.trim() === '') {
      // Caso antenne = <NONE>
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Esco da disegna antenne 3: ', t.NumeroFrame2, nomeLayer);

      t.staDisegnandoServingCell[t.NumeroFrame2]  = false;
      // logConsole('Antenne Esco 4');
      
      // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Esco 5', daDove);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Disegno antenne con stile', t.isCheckedAntenne2, nomeLayer, nomeStyle);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Disegno antenne. Time Filter ', t.timeFilter2);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Disegno antenne. tmsInizio ', t.Utils.tmsInizio);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Disegno antenne. tmsFine ', t.Utils.tmsFine);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Disegno antenne. Range start ', t.timeRangeDSFStart2);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Disegno antenne. Range stop ', t.timeRangeDSFStop2);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Disegno antenne. Cell Set ', t.cellSet2);

    if (!t.cellSet2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Esco da disegna antenne 4: ', t.NumeroFrame2, t.cellSet2);

      t.staDisegnandoServingCell[t.NumeroFrame2]  = false;
      // logConsole('Antenne Esco 5');

      // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Esco 6', daDove);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;    
    }

    t.pendings += 'Antenne<br />';

    let tmsMin = '';
    let tmsMax = '';

    if (t.timeFilter === 2) {
      if (t.Utils.tmsInizio && t.Utils.tmsFine) {
        tmsMin = t.Utils.tmsInizio;
        tmsMax = t.Utils.tmsFine;

        /* if (tmsMin.indexOf('.') === -1) {
          tmsMin += '.000';
        }
        if (tmsMax.indexOf('.') === -1) {
          tmsMax += '.000';
        } */

        if (tmsMin.indexOf('\'') === -1) {
          tmsMin = '\'' + tmsMin + '\'';
        }
        if (tmsMax.indexOf('\'') === -1) {
          tmsMax = '\'' + tmsMax + '\'';
        }
      }
    } else {
      if (t.timeRangeDSFStart2 && t.timeRangeDSFStop2) {
        tmsMin = t.timeRangeDSFStart2;
        tmsMax = t.timeRangeDSFStop2;

        /* if (tmsMin.indexOf('.') === -1) {
          tmsMin += '.000';
        }
        if (tmsMax.indexOf('.') === -1) {
          tmsMax += '.000';
        } */

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
    if (!tmsMin) { tmsMin = 'null'; }
    if (!tmsMax) { tmsMax = 'null'; }

    // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Tms min/max', tmsMin, tmsMax, daDove);

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Disegno antenne. tmsMin ', tmsMin);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Disegno antenne. tmsMax ', tmsMax);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Aggiorno antenne. Frame e parametriDD ', t.NumeroFrame, t.parametriDD2);

    let nt = 'null';
    let bl = 'null';
    let ch = 'null';
    let bsic = 'null';
    let scr = 'null';
    let pci = 'null';
    let vm = 'null';
    let territory = 'null';
    let freeText = 'null';

    let p;
    if (t.parametriDD2 && t.parametriDD2 !== null && t.parametriDD2 !== '') {
      p = t.parametriDD2.split('§');
    } else {
      p = '';
    }
    if (p.length > 2) {
      nt = p[0]; if (nt === '') { nt = 'null'; }
      bl = p[1]; if (bl === '') { bl = 'null'; }
      ch = p[9]; if (ch === '') { ch = 'null'; }
      bsic = p[8]; if (bsic === '') { bsic = 'null'; }
      scr = p[7]; if (scr === '') { scr = 'null'; }
      pci = p[6]; if (pci === '') { pci = 'null'; }
      territory = p[5];
      if (t.eseguitoInProgetto2) {
        vm = p[4]; if (vm === '') { vm = 'null'; }
      }
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
    }

    let vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
      'v_antenna_set_name_list:\'' + t.cellSet2 + '\';' +
      'v_xcgi_list:null;' +
      'v_net_tech_list:' + nt + ';' +
      'v_band_list:' + bl + ';' +
      'v_tms_min: ' + tmsMin + ';' +
      'v_tms_max: ' + tmsMax + ';' +
      'v_view_mode:' + vm + ';' +
      'v_ch:' + ch + ';' +
      'v_bsic:' + bsic + ';' +
      'v_scr:' + scr + ';' +
      'v_pci:' + pci + ';' +
      'v_territory:' + (territory === '\'null\'' ? null : territory) + ';' +
      'v_free_text:' + (freeText === '\'null\'' ? null : freeText) + ';' + 
      'v_chiamante: \'Frame ' + t.NumeroFrame2 + '\'';

    // const bbox = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
    // vParams += ';' + bbox;

    const bbox2 = ExternalUtilities.ritornaBboxGiusta(t, 'Antenne');
    /* if (t.overviewZoom2 === true) {
      bbox = ExternalUtilities.bboxOverview; // ExternalUtilities.ritornaBboxGiusta(t, 'Measures'); // 
    } else {
      bbox = ExternalUtilities.bboxStringaFisso; // ExternalUtilities.ritornaBboxGiusta(t, 'Measures'); // 
    } */
    if (bbox2.indexOf('NaN') > -1 || bbox2.indexOf('undefined') > -1 || !bbox2[0] || bbox2[0] === 'undefined') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Esco per bbox non valida: ', t.NumeroFrame2, bbox2);

      // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. BBox ', bbox2, daDove);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }
    const bbox = t.sistemaCoordinate(bbox2, '4326');
    let bb = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';';
    bb += 'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];
    vParams += ';' + bb;

    const par = {
      LAYERS: 'Geo_ANTS:' + nomeLayer,
      TILED: false,
      STYLES: nomeStyle,
      // 'CQL_FILTER': filtro + altro
      NUMEROFRAME: t.NumeroFrame2,
      // CHECKEDANTENNE: t.isCheckedAntenne2,
      VIEWPARAMS: vParams
    };

    /* const par2 = {
      'LAYERS': 'Geo_ANTS:l_cluster',
      'TILED': false,
      // 'CQL_FILTER': filtro + altro
    }; */
    
    // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Chiamata ', par, daDove);

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';' + nomeLayer + ';' + nomeStyle + ';' + t.act_set + ';' + t.isCheckedAntenne2 + ';';

    const actualCall = 'CELL;' + JSON.stringify(par) + valoriDiBase;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Aggiorno antenne. Parametri ', valoriDiBase);

    /* const actualCall1 = JSON.stringify(par);
    const actualCall2 = JSON.stringify(par2); */
    // logConsole('Antenne Esco 6', vParams);

    if (t.lastCallAntenne[t.NumeroFrame2] !== actualCall) {
      t.lastCallAntenne[t.NumeroFrame2] = actualCall;
      // this.lastCall2[t.NumeroFrame] = actualCall2;
    
      // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Entrato', daDove, t.lastCallAntenne[t.NumeroFrame2]);

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne. Aggiorno antenne. Frame ', t.NumeroFrame, par);

      /* if (!this.GestisceLayerConSetSource) {
        if (t.antennaLayer1) {
          t.removeLayerFromMap('Antenna layer 1', t.antennaLayer1);
          t.antennaLayer1 = undefined;
        }
      } */
      /* if (t.antennaLayer2) {
        t.removeLayerFromMap('Antenna layer 2', t.antennaLayer2);
      } */

      // const a = new Date().getTime();
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne inizio:', a);

      /* let q = 0;
      const tt = setInterval(() => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'wms', wms);
        if (wmsSource1.loading === true) {
          q++;
          if (q > 30) {
            // t.staDisegnandoServingCell[t.NumeroFrame2] = false;

            clearInterval(tt);
          }
        } else {
          clearInterval(tt); */

          // const c = new Date().getTime();
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne fine riempimento variabile:', c - b)

          // t.antennaLayer1.setZIndex(3);

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Layer antenne. BBOX: ', vParams);

          if (t.antennaLayer1[t.NumeroFrame2] && t.antennaLayer1[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource) {
            let nuoviParametri = { 
              // LAYERS: 'Geo_ANTS:' + nomeLayer, 
              // STYLES: nomeStyle,
              NUMEROFRAME: t.NumeroFrame2,
              VIEWPARAMS: vParams 
            };
            // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Nuovi parametri 1', nuoviParametri);
            this.layerAttivo[t.NumeroFrame2] = true;

            t.antennaLayer1[t.NumeroFrame2].getSource().updateParams(nuoviParametri); // .setSource(wms);
    
            // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Aggiorno chiamata', nuoviParametri);
          } else {
            // if (!this.GestisceLayerConSetSource) {
              if (t.antennaLayer1[t.NumeroFrame2]) {
                t.removeLayerFromMap('Antenna layer 1', t.antennaLayer1[t.NumeroFrame2]);
                t.antennaLayer1[t.NumeroFrame2] = undefined;
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
                if (!this.layerAttivo[t.NumeroFrame2]) { return; }

                const timestamp = new Date().getTime();
                const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                image.getImage()['src'] = noCacheUrl2;
              }
            });

            const newWms = new ImageLayer({
              source: wmsSource1
            });
            // t.wms[t.NumeroFrame2].push(wmsSource1);

            t.addLayerToMap(newWms, 15, 'Antenna1');
            t.antennaLayer1[t.NumeroFrame2] = newWms;
            this.layerAttivo[t.NumeroFrame2] = true;
    
            // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Creo Chiamata');
          }

          t.pendings.replace('Antenne<br />', '');

        /* }
      }, 1000); */
      // const b = new Date().getTime();
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne fine lettura:', b - a)

      // const d = new Date().getTime();
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne fine aggiunta su mappa:', d - c)

      /* const wmsSource2 = new TileWMS({
        projection: 'EPSG:4326',
        url: t.Utils.indirizzoGEOServer + t.urlWms,
        params: par2,
        serverType: 'geoserver',
      });
      t.antennaLayer2 = new Tile({
        source: wmsSource2
      });
      t.wms[t.NumeroFrame2].push(wmsSource2); */

      // t.addLayerToMap(t.antennaLayer2, 3);
    } else {
      t.pendings.replace('Antenne<br />', '');
    
      // logConsole('Chiamata antenne frame ' + t.NumeroFrame2 + '. Uscito per chiamata uguale');
    }
  }
}

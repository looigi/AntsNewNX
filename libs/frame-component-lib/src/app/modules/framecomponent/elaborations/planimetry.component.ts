import { logConsole } from '../console-log';
import { ExternalApiService } from './../services/externalapi.service';
// import { SessionService } from './../../../../db/session.service';
import { Injectable } from '@angular/core';
// import { environment } from '../../../../environments/environment';
// import Utils from '../Utilities.component';

import ImageLayer from 'ol/layer/Image';
import Projection from 'ol/proj/Projection';
import Static from 'ol/source/ImageStatic';
import Raster from 'ol/source/Raster'
import GeoJSON from 'ol/format/GeoJSON';
// import MultiPoint from 'ol/geom/MultiPoint';
import VectorSource from 'ol/source/Vector';
import {Fill, Stroke, Style, RegularShape, Text, Icon} from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import {transform} from 'ol/proj';
/* import {defaults as defaultInteractions, Select, Translate} from 'ol/interaction';
import {Draw, Modify, Snap} from 'ol/interaction';
import Collection from 'ol/Collection'; */

import Transform from 'ol-ext/interaction/Transform';
// import {Feature} from 'ol';
// import {Polygon, Point} from 'ol/geom';
import {shiftKeyOnly} from 'ol/events/condition'
// import Photo from 'ol-ext/style/Photo';
import ExternalUtilities from '../ExternalUtilities.component';
// import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FineRichieste } from './fine-richieste';
@Injectable()
export class PlanimetryComponent {
  destroy$ = new FineRichieste();

  static lastCallImmagine = ['', '', '', '', '', '', '', '', '', '', ''];
  static ultimo = ['', '', '', '', '', '', '', '', '', '', ''];

  // private destroy$ = new Subject<void>();

  // GestisceLayerConSetSource = true;
  disegnaImmagine = true;
  disegnaBoxImmagine = false;
  effettuaScale = true;
  effettuaRotazione = true;

  diffLng;
  diffLat;
  coordinate;
  blobImm;
  blobImmagine;
  appoBlobImmagine;
  interaction;
  extentImmagine;
  extentBox;
  rotazione = 0;
  lastRotazione = -1;
  // act_id;
  boxImmagine;
  boxImmagine2;
  alpha;
  contrast;

  center;
  rotation;
  scale_x;
  scale_y;
  dime_x;
  dime_y;
  dime_x_orig;
  dime_y_orig;

  iconcina;

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
  ) {

  }
  /* buttami(t, valRotazione) {
    if (!t.latLng || !t.latLng[0]) {
      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'buttami 1');

    const iconFeature = new Feature({
      geometry: new Point(transform([t.latLng[0][0] + (this.diffLng / 2) - .0005, t.latLng[0][1] + (this.diffLat / 2)],
        'EPSG:4326', 'EPSG:3857'))
    });

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.currZoom, this.diffLng, this.diffLat);

    const sourceImage = new Image();
    sourceImage.src = this.blobImmagine; // 'https://www.aubay.it/aubay/wp-content/uploads/2017/05/innovdigit2.png';
    const width = 48;
    const height = 48;

    const tt = this;

    sourceImage.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(sourceImage, 0, 0, width, height);

      const resizedImageURL = canvas.toDataURL(); // this can be changed to a callback to prevent execution blocking

      tt.iconcina = resizedImageURL; // store the resized URL in the cache

      const iconStyle = new Style({
        image: new Icon({
          // anchor: [0.5, 46],
          // anchorXUnits: 'meters',
          // anchorYUnits: 'meters',
          rotation: valRotazione,
          // size: [25, 250],
          src: tt.iconcina
        })
      });

      iconFeature.setStyle(iconStyle);

      const vectorSource = new VectorSource({
        features: [iconFeature]
      });

      const layer = new VectorLayer({
        source: vectorSource
      });

      t.addLayerToMap(layer, 5);
    }

  } */

  disegnaBoxVerde(t, extentBox) {
    let lat1;
    let lat2;
    let lng1;
    let lng2;

    lng1 = extentBox[0];
    lat1 = extentBox[1];
    lng2 = extentBox[2];
    lat2 = extentBox[3]; 

    const coordinate = [
      [lng1, lat1],
      [lng2, lat1],
      [lng2, lat2],
      [lng1, lat2],
      [lng1, lat1],
    ];

    // if (this.disegnaBoxImmagine) {
      if (this.boxImmagine2) {
        t.removeLayerFromMap('PlanimetryBox2', this.boxImmagine2);
        t.boxImmagine2 = undefined;
      }

      if (t.debug2) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Box verde', coordinate);
      }

      this.boxImmagine2 = new VectorLayer({
          source: new VectorSource({
          // format: GeoJSON,
          features: (new GeoJSON()).readFeatures({
            'type': 'FeatureCollection',
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:3857'
              }
            },
            'features': [{
              'type': 'Feature',
              'geometry': {
                'type': 'Polygon',
                'coordinates': [ coordinate ]
              },
            }]
          }, 
          { featureProjection: 'EPSG:3857' }),
          // wrapX: false
        }),
        style: [
          new Style({
            stroke: new Stroke({
              color: 'green',
              width: 2
            }),
          })
        ]
      });            
      t.addLayerToMap(this.boxImmagine2, 7, 'PlanimetryBox2');
    // }
  }
  
  /* pulisceInteraction(t) {
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Rimuovo interazione');

    if (this.interaction) {
      t.map1[t.NumeroFrame2].removeInteraction(this.interaction);
      this.interaction = undefined;
    }
  } */

  vecchiaOra3 = -1;

  caricaPiantina(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da caricaPiantina per NON tipo mappa', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    // // logConsole('Caricamento piantina', t.showPlanimetry2);
    // this.act_id = act_id2;
    /* const ora = new Date().getTime();
    if (ora - this.vecchiaOra3 < 500) {
      if (t.debug2) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per troppo veloce');
      }        

      return;
    }
    this.vecchiaOra3 = ora; */

    // t.blobImmagine = undefined;
    // t.showPlanimetry2 = true;
    
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Disegno piantina? ', t.showPlanimetry2);

    if (t.showPlanimetry2 === undefined || t.showPlanimetry2 === false) {
      if (t.layerImmagine) {
        t.removeLayerFromMap('Planimetry', t.layerImmagine);
        t.layerImmagine = undefined;
      }
      
      if (this.interaction) {
        t.map1[t.NumeroFrame2].removeInteraction(this.interaction);
        // this.interaction = undefined;
      }

      if (t.layerModify) {
        t.removeLayerFromMap('Planimetry Feature', t.layerModify);
        t.layerModify = undefined;
      }
      this.creataFeature = false;

      t.staCaricandoPiantina = false;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per parametro non vero');

      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Carica piantina');

    // let blobImm;

    t.staCaricandoPiantina = false;
    // return;

    // this.act_id = ExternalUtilities.prendeActivitySceltaPerEvents(t, t.Utils);

    /* if (t.debug2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: act_id', this.act_id);
    }

    if (!this.act_id || this.act_id === null || this.act_id === '') {
      if (t.debug2) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per act_id null');
      }

      return;
    } */

    let agnact = t.act_set;
    /* if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = '"null"';
    } else {
      agnact = '"' + ExternalUtilities.stringaAGNoACT + '"';
    }
    if (ExternalUtilities.stringaAGNoACT === undefined) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per agnact undefined 1');
      }
      return;
    }*/

    if (t.eseguitoInProgetto2) {
      agnact = ExternalUtilities.stringaAGNoACT[1];
    }
    // // logConsole('Caricamento piantina 2', agnact);

    if (agnact === undefined || agnact === 'undefined') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per agnact undefined 2');

      return;
    } 

    let valoreRicerca = agnact;
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Agn Act', valoreRicerca, agnact);

    if (valoreRicerca && typeof(valoreRicerca) === 'string') {
      while (valoreRicerca.indexOf('\'') > -1) {
        valoreRicerca = valoreRicerca.replace('\'', '');
      }
      while (valoreRicerca.indexOf('"') > -1) {
        valoreRicerca = valoreRicerca.replace('"', '');
      }

      if (!valoreRicerca || valoreRicerca === '') {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per agnact undefined 3', valoreRicerca);
        }
        return;
      }
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per agnact undefined 4', valoreRicerca);
      }
      return;
    }

    // // logConsole('Caricamento piantina 3', t.timeRangeDSFStart);

    if (!t.timeRangeDSFStart) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per tms non valido', t.timeRangeDSFStart);

      return;
    }

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const params = {
      cntx_id: t.sessionID2,
      v_act_set_name_list: valoreRicerca.indexOf('[') > -1 && valoreRicerca.indexOf(']') > -1 ? valoreRicerca : '[ACT] ' + valoreRicerca, 
      v_tms: t.timeRangeDSFStart
    };
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Parametri query', t.NumeroFrame, params);

    const indirizzo = 'PLANIMETRY;' + JSON.stringify(params) + ';' + valoriDiBase + ';' + JSON.stringify(t.datiPlanimetria) + ';' + PlanimetryComponent.ultimo[t.NumeroFrame2];

    if (indirizzo !== PlanimetryComponent.lastCallImmagine[t.NumeroFrame]) {
      PlanimetryComponent.lastCallImmagine[t.NumeroFrame] = indirizzo;

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, logConsole('Caricamento piantina', t.NumeroFrame2, indirizzo));

      t.caricamentoMappaInCorso = true;

      this.apiService.chiamataPost(t.Utils, 'geo_act_planimetry__get', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$.per(t)))
        .subscribe((data2: any) => {
          // const data2 = JSON.parse(data);
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data2);
          if (data2 && data2 !== null) {
            ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

            const immagine = data2.v_planimetry;
            this.center = [data2.v_planimetry_move_x, data2.v_planimetry_move_y];
            this.rotation = data2.v_planimetry_rotation;
            this.scale_x = data2.v_planimetry_scale_x; // > 1 ? 1 : data2.v_scale_x;
            this.scale_y = data2.v_planimetry_scale_y;
            this.dime_x = data2.v_planimetry_dime_x;
            this.dime_y = data2.v_planimetry_dime_y;
            this.dime_x_orig = data2.v_planimetry_dime_x_orig;
            this.dime_y_orig = data2.v_planimetry_dime_y_orig;
            
            this.alpha = data2.v_planimetry_alpha;
            this.contrast = data2.v_planimetry_contrast;
            if (!this.alpha) { this.alpha = .65; }
            if (!this.contrast) { this.contrast = .9; }

            /* const dime = 1000;
            this.extentImmagine = [
              (data2.v_move_x - ((dime * this.scale_x) / 2)),
              (data2.v_move_y - ((dime * this.scale_x) / 2)),
              (data2.v_move_x + ((dime * this.scale_x) / 2)),
              (data2.v_move_y + ((dime * this.scale_x) / 2)),
            ]; */

            const d = [this.dime_x, this.dime_y]; // transform([this.dime_x, this.dime_y], 'EPSG:3857', 'EPSG:4326');
            this.extentImmagine = [
              (data2.v_planimetry_move_x - ((d[0] / 2) * this.scale_x)),
              (data2.v_planimetry_move_y - ((d[1] / 2) * this.scale_x)),
              (data2.v_planimetry_move_x + ((d[0] / 2) * this.scale_x)),
              (data2.v_planimetry_move_y + ((d[1] / 2) * this.scale_x)),
            ];
            // this.disegnaBoxVerde(t, this.extentImmagine);
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Extent', this.extentImmagine);
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Differenze ', this.extentImmagine[2] - this.extentImmagine[0], this.extentImmagine[3] - this.extentImmagine[1]);

            /* this.extentBox = [
              (data2.v_move_x - ((dime * this.scale_x) / 2)),
              (data2.v_move_y - ((dime * this.scale_y) / 2)),
              (data2.v_move_x + ((dime * this.scale_x) / 2)),
              (data2.v_move_y + ((dime * this.scale_y) / 2)),
            ]; */
            
            const d2 = [this.dime_x_orig, this.dime_y_orig]; // transform([this.dime_x, this.dime_y], 'EPSG:3857', 'EPSG:4326');
            this.extentBox = [
              (data2.v_planimetry_move_x - ((d2[0] / 2) * this.scale_x)),
              (data2.v_planimetry_move_y - ((d2[1] / 2) * this.scale_x)),
              (data2.v_planimetry_move_x + ((d2[0] / 2) * this.scale_x)),
              (data2.v_planimetry_move_y + ((d2[1] / 2) * this.scale_x)),
            ];
            // this.extentBox = this.extentImmagine;

            const m = [data2.v_planimetry_move_x, data2.v_planimetry_move_y];
            const mm = transform(m, 'EPSG:3857', 'EPSG:4326');
            const angolo = data2.v_planimetry_rotation;
            const degrees = Math.round(angolo * (180 / Math.PI));
            const alpha = (Math.round(this.alpha * 100)) / 100;
            const contrast = (Math.round(this.contrast * 100)) / 100;

            t.datiPlanimetria = {
              move_x: mm[0],
              move_y: mm[1],
              scale_x: data2.v_planimetry_scale_x,
              scale_y: data2.v_planimetry_scale_y,
              rotation: degrees,
              alpha: alpha,
              contrast: contrast,
              // Ultimo: PlanimetryComponent.ultimo[t.NumeroFrame2], // new Date().toString(),
              dime_x_orig: data2.v_planimetry_dime_x_orig,
              dime_y_orig: data2.v_planimetry_dime_y_orig
            }
            // // logConsole('Planimetria carica piantina', t.NumeroFrame2, t.datiPlanimetria.Ultimo, PlanimetryComponent.ultimo[t.NumeroFrame2]);

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Dati planimetria', t.datiPlanimetria);

            /* const boxSizeX = Math.abs(lng2 - lng1);
            const boxSizeY = Math.abs(lat2 - lat1);
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Dimensioni box', boxSizeX, boxSizeY); */

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Move ', data2.v_move_x, data2.v_move_y);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Scale', this.scale_x, this.scale_y);
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Dimensioni ', this.dime_x, this.dime_y);
            //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Extent', this.extentImmagine, this.extentBox);
          
            /* if (this.scale_x < 0.2 || this.scale_y < 0.2) {
              this.effettuaRotazione = false;
              this.effettuaScale = false;
            } else {
              this.effettuaRotazione = true;
              this.effettuaScale = true;
            } */

            // // this.creaInterazione(t);
      
            // const blobImmagine = null;
            if (immagine && immagine !== null) {
              const hexStr = immagine.slice(2);
              const buf = new ArrayBuffer(hexStr.length / 2);
              const byteBuf = new Uint8Array(buf);
              for (let i = 0; i < hexStr.length; i += 2) {
                byteBuf[i / 2] = parseInt(hexStr.slice(i, i + 2), 16);
              }
              this.blobImm = new Blob([byteBuf], {type: 'application/octet-stream'});

              /*  let lat1;
              let lng1;
              let lat2;
              let lng2;

            if (cc[0].planimetry_tr_lat && cc[0].planimetry_tr_lat !== null) {
                lat1 = cc[0].planimetry_tr_lat;
              }
              if (cc[0].planimetry_bl_lat && cc[0].planimetry_bl_lat !== null) {
                lat2 = cc[0].planimetry_bl_lat;
              }
              if (cc[0].planimetry_tr_lng && cc[0].planimetry_tr_lng !== null) {
                lng1 = cc[0].planimetry_tr_lng;
              }
              if (cc[0].planimetry_bl_lng && cc[0].planimetry_bl_lng !== null) {
                lng2 = cc[0].planimetry_bl_lng;
              }

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lat1, lat2, lng1, lng2);
              if (lat1 === -1 || lat2 === -1 || lng1 === -1 || lng2 === -1) {
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito 1');
                t.staCaricandoPiantina = false;

                return;
              }

              if (lat1 > lat2) {
                const a = lat1;
                lat1 = lat2;
                lat2 = a;
              }
              if (lng1 > lng2) {
                const a = lng1;
                lng1 = lng2;
                lng2 = a;
              } */

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lng1, lat1, lng2, lat2);

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Cancellazione punti');

              /* /*
              t.latLng = new Array();
              t.latLng.push([lng1, lat1]);
              t.latLng.push([lng2, lat1]);
              t.latLng.push([lng2, lat2]);
              t.latLng.push([lng1, lat2]);
              t.latLng.push([lng1, lat1]);
              t.latLng = new Array();
              t.latLng.push([-1, -1]);
              t.latLng.push([1, -1]);
              t.latLng.push([1, 1]);
              t.latLng.push([-1, 1]);
              t.latLng.push([-1, -1]);
              */
              
              // this.extent = [12,41,13,42];
                // this.diffLng = this.extent[2] - this.extent[0];
              // this.diffLat = this.extent[3] - this.extent[1];
              // this.spostamento = undefined;
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dimensione extent: ', this.diffLat, this.diffLng);

              // if (eliminaInterazione) {
              this.creaFeature(t);
              // }

              this.disegnaLayer2(t, this.blobImm);

              // const FileSaver = require('file-saver');
              // FileSaver.saveAs(this.blobImm, 'bbb.png');

              // const blob1 = new Blob([new Uint8Array(blobImmagine)]);
              // const imageUrl = URL.createObjectURL(blobImmagine);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, imageUrl);
              // t.blobImmagine = t.sanitizer.bypassSecurityTrustHtml(imageUrl);
              // t.blobImmagine2 = t.sanitizer.bypassSecurityTrustHtml(URL.createObjectURL(blobImm));
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.blobImmagine2);

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Immagine in caricamento');

              /* const reader = new FileReader();
              reader.readAsDataURL(this.blobImm);
              reader.onloadend = (function(tt, ttt) {
                return function(e) {
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Immagine caricata');
                  ttt.blobImmagine = reader.result;
                  ttt.appoBlobImmagine = reader.result;
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Caricata immagine');

                  // // ttt.disegnaImmagineSuMappaFinale(tt, lng1, lat1, lng2, lat2, ttt);
                  ttt.disegnaImmagineSuMappaFinale(tt, -1, -1, 1, 1, ttt);

                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.latLng);
                  // ttt.buttami(t, 0);

                  t.staCaricandoPiantina = false;
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Caricamento eseguito');
                };
              }) (t, this); */
            } else {
              t.staCaricandoPiantina = false;
              if (t.debug2) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina nulla', immagine)
              }
            }
          } else {
            t.staCaricandoPiantina = false;
            if (t.debug2) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Data nulla', data2)
            }
          }

          t.caricamentoMappaInCorso = false;
        }, error => {
          // ExternalUtilities.messaggioDiErrore('null', error);
          t.staCaricandoPiantina = false;
          console.error('Errore nel caricamento della piantina', error);
        });
      // }

      /* const indirizzo = Utils.serverPostRest +
        '/v_geo_act?name=eq.' + t.act_set;
      // if (!t.act_set) {t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ACTSET UNDEFINED'); }
      if (t.act_set && indirizzo !== PlanimetryComponent.lastCallImmagine) {
        PlanimetryComponent.lastCallImmagine = indirizzo;
        const c = await t.downloadFile.downloadJSON(indirizzo);
        const cc = JSON.parse(c['_body']);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, cc[0]);
        if (cc[0]) {
          const immagine = cc[0].planimetry_image;
          // const blobImmagine = null;
          if (immagine !== null) {
            const hexStr = immagine.slice(2);
            const buf = new ArrayBuffer(hexStr.length / 2);
            const byteBuf = new Uint8Array(buf);
            for (let i = 0; i < hexStr.length; i += 2) {
              byteBuf[i / 2] = parseInt(hexStr.slice(i, i + 2), 16);
            }
            this.blobImm = new Blob([byteBuf], {type: 'application/octet-stream'});

            let lat1;
            let lng1;
            let lat2;
            let lng2;

            if (cc[0].planimetry_tr_lat && cc[0].planimetry_tr_lat !== null) {
              lat1 = cc[0].planimetry_tr_lat;
            }
            if (cc[0].planimetry_bl_lat && cc[0].planimetry_bl_lat !== null) {
              lat2 = cc[0].planimetry_bl_lat;
            }
            if (cc[0].planimetry_tr_lng && cc[0].planimetry_tr_lng !== null) {
              lng1 = cc[0].planimetry_tr_lng;
            }
            if (cc[0].planimetry_bl_lng && cc[0].planimetry_bl_lng !== null) {
              lng2 = cc[0].planimetry_bl_lng;
            }

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lat1, lat2, lng1, lng2);
            if (lat1 === -1 || lat2 === -1 || lng1 === -1 || lng2 === -1) {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito 1');
              return;
            }

            if (lat1 > lat2) {
              const a = lat1;
              lat1 = lat2;
              lat2 = a;
            }
            if (lng1 > lng2) {
              const a = lng1;
              lng1 = lng2;
              lng2 = a;
            }

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lng1, lat1, lng2, lat2);

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Cancellazione punti');

            t.latLng = new Array();
            t.latLng.push([lng1, lat1]);
            t.latLng.push([lng2, lat1]);
            t.latLng.push([lng2, lat2]);
            t.latLng.push([lng1, lat2]);
            t.latLng.push([lng1, lat1]);

            // this.creaFeature(t);

            // const FileSaver = require('file-saver');
            // FileSaver.saveAs(blobImmagine, 'bbb.jpg');

            // const blob1 = new Blob([new Uint8Array(blobImmagine)]);
            // const imageUrl = URL.createObjectURL(blobImmagine);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, imageUrl);
            // t.blobImmagine = t.sanitizer.bypassSecurityTrustHtml(imageUrl);
            // t.blobImmagine2 = t.sanitizer.bypassSecurityTrustHtml(URL.createObjectURL(blobImm));
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.blobImmagine2);

            const reader = new FileReader();
            reader.readAsDataURL(this.blobImm);
            reader.onloadend = (function(tt, ttt) {
              return function(e) {
                ttt.blobImmagine = reader.result;
                ttt.appoBlobImmagine = reader.result;
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Caricata immagine');

                ttt.disegnaImmagineSuMappaFinale(tt, lng1, lat1, lng2, lat2, ttt);

                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.latLng);
                // ttt.buttami(t, 0);

                t.staCaricandoPiantina = false;
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Caricamento eseguito');
              };
            }) (t, this);
          } else {
            t.staCaricandoPiantina = false;
          }
        } else {
          t.staCaricandoPiantina = false;
        } */
    } else {
      t.staCaricandoPiantina = false;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per ultima chiamata uguale', indirizzo);
    }
  }

  /* disegnaImmagineSuMappaFinale(t, lng1, lat1, lng2, lat2, tt) {
    if (t.layerImmagine && t.map1[t.NumeroFrame2]) {
      t.map1[t.NumeroFrame2].removeLayer(t.layerImmagine);
    }

    tt.diffLng = +lng2 - +lng1;
    tt.diffLat = +lat2 - +lat1;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.diffLng, this.diffLat);

    t.coordinatePiantina = lng1 + ';' + lat1 + ';' + lng2 + ';' + lat2 + ';';

    tt.extent = [lng1, lat1, lng2, lat2];

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'extent', extent);
    /* tt.lastRotazione = -1;
    tt.rotazione = 0;
    tt.ruotaImmagine(t, tt); // /

    tt.creaFeature(t);
  }

  ruotaImmagine(t, tt) {
    const questa = this;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, questa.rotazione, questa.lastRotazione);
    if (questa.rotazione !== questa.lastRotazione) {
      questa.lastRotazione = questa.rotazione;
      const sourceImage = new Image();
      sourceImage.src = questa.appoBlobImmagine; // 'https://www.aubay.it/aubay/wp-content/uploads/2017/05/innovdigit2.png';

      sourceImage.onload = function() {
        const diagonal = Math.sqrt((sourceImage.width * sourceImage.width) + (sourceImage.height * sourceImage.height));

        const width = sourceImage.width; // diagonal;
        const height = sourceImage.height; // diagonal;

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, diagonal);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Effettuo modifica rotante', questa.rotazione);

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = diagonal;
        canvas.height = diagonal;

        context.save();

        // Move registration point to the center of the canvas
        // context.save();
        // context.translate(width / 2, height / 2);
        // context.rotate(questa.rotazione);
        // context.drawImage(sourceImage, 0, 0, sourceImage.width, sourceImage.height,
        //     0, 0, canvas.width, canvas.height); // -(canvas.width / 2), -(canvas.height / 4) , diagonal, diagonal);

        // translate to center-canvas
        // the origin [0,0] is now center-canvas
        context.translate(canvas.width / 2, canvas.height / 2);
        // roate the canvas by +90% (==Math.PI/2)
        context.rotate(questa.rotazione);
        // draw the signature
        // since images draw from top-left offset the draw by 1/2 width & height
        context.drawImage(sourceImage, -(width / 2), -(height / 2));

        // context.restore();

        const resizedImageURL = canvas.toDataURL();

        questa.blobImmagine = resizedImageURL;

        questa.disegnaLayer(t, tt, questa);
      };
    } else {
      questa.disegnaLayer(t, tt, questa);
    }
  } */

  vecchiaAttiva = undefined;

  attivaDisattivaQuadrati(t) {
    if (t.MappaOGrafico2 !== 'M' || t.showPlanimetry2 === undefined || t.showPlanimetry2 === false || !this.blobImm) {
      return;
    }
    
    const bbox = t.prendeBBOXSoloValori('attivaDisattivaQuadrati');
    const dimBboxX = bbox[2] - bbox[0];
    const dimBboxY = bbox[3] - bbox[1];

    const dimPiantinaX = this.scale_x; // this.extentImmagine[2] - this.extentImmagine[0];
    const dimPiantinaY = this.scale_y; // this.extentImmagine[3] - this.extentImmagine[1];

    const percX = Math.ceil((dimPiantinaX / dimBboxX));
    const percY = Math.ceil((dimPiantinaY / dimBboxY));

    let attiva = true;

    if (t.debug2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: dimensione bbox x', dimBboxX);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: dimensione bbox y', dimBboxY);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: dimensione box piantina x', dimPiantinaX);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: dimensione box piantina y', dimPiantinaY);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: percentuale x', percX);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: percentuale y', percY);
    }

    if (percX >= 7 && percY >= 7) {
      attiva = true;
    } else {
      attiva = false;
    }

    if (attiva !== this.vecchiaAttiva) {
      this.vecchiaAttiva = attiva;

      this.effettuaRotazione = attiva;
      this.effettuaScale = attiva;

      this.creaFeature(t);

      this.disegnaLayer2(t, this.blobImm);
    }
  }

  vecchiaOra2 = -1;

  disegnaLayer2(t, blobbone) {
    if (this.disegnaImmagine) {
      /* const ora = new Date().getTime();
      if (ora - this.vecchiaOra2 < 1000) {
        return;
      }
      this.vecchiaOra2 = ora; */
      
      // alert('disegno piantina 1');

      if (t.debug2) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: rimozione layer immagine');
      }

      if (t.layerImmagine) {
        t.removeLayerFromMap('Planimetry', t.layerImmagine);
        t.layerImmagine = undefined;
      }
          
      const projection = new Projection({
        code: 'EPSG:3857',
        units: 'pixels',
        extent: this.extentImmagine
      });

      if (blobbone) {
        const dataurl = URL.createObjectURL(blobbone);
        // alert('disegno piantina 2 ' + dataurl);

        // RASTER
        // this.contrast = .8;
        const c = this.contrast;

        const raster = new Raster({
          sources: [new Static({
            url: dataurl, // 'data:image/png;base64,' + btoa(unescape(encodeURIComponent(blobbone))), // 'https://www.aubay.it/aubay/wp-content/uploads/2017/05/innovdigit2.png', // 
            projection: projection,
            imageExtent: this.extentImmagine
            // resolution: 1,        // important for 100% image size!
            // maxResolution: 2,     // must be >= 1
          })],
          operation: (pixels, data) => {
            /* const pixel = pixels[0];
            // const lightness = (pixel[0] * c + pixel[1] * c + pixel[2] * c);
            const lightness = (pixel[0] * .9 + pixel[1] * .9 + pixel[2] * .9);
            if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0) {
              pixel[3] = 0;
            } */
            return pixels[0]; // [lightness, lightness, lightness, pixel[3]];
          }, /* 
          lib: {
            c: this.contrast
          } */
        });       
        // RASTER
        
        const newWms = new ImageLayer({
          opacity: this.alpha,
          source: raster
        });
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, newWms);


        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: disegno layer immagine', this.extentImmagine);
        
        t.addLayerToMap(newWms, 4, 'Planimetry');
        t.layerImmagine = newWms;

        /* const source = t.layerImmagine.getSource();
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Source', source);
        const features = source.getFeatures()[0];
        const style = features.getStyle();
        const geometry = features.getGeometry();
        const centroY = lat1 + ((lat2 - lat1) / 2);
        const centroX = lng1 + ((lng2 - lng1) / 2);
        let angoloRad = this.rotation; // * 180 / Math.PI;
        geometry.rotate(angoloRad, [centroX, centroY]);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Angolo di disegno immagine: ', angoloRad); */
  
        if (this.disegnaBoxImmagine) {
          if (this.boxImmagine) {
            t.removeLayerFromMap('PlanimetryBox', this.boxImmagine);
            t.boxImmagine = undefined;
          }

          const lng1 = this.extentImmagine[0];
          const lat1 = this.extentImmagine[1];
          const lng2 = this.extentImmagine[2];
          const lat2 = this.extentImmagine[3]; 
  
          const coordinate = [
            [lng1, lat1],
            [lng2, lat1],
            [lng2, lat2],
            [lng1, lat2],
            [lng1, lat1],
          ];
   
          this.boxImmagine = new VectorLayer({
              source: new VectorSource({
              // format: GeoJSON,
              features: (new GeoJSON()).readFeatures({
                'type': 'FeatureCollection',
                'crs': {
                  'type': 'name',
                  'properties': {
                    'name': 'EPSG:3857'
                  }
                },
                'features': [{
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Polygon',
                    'coordinates': [ coordinate ]
                  },
                }]
              }, 
              { featureProjection: 'EPSG:3857' }),
              // wrapX: false
            }),
            style: [
              new Style({
                stroke: new Stroke({
                  color: 'red',
                  width: 1
                }),
              })
            ]
          });            
          t.addLayerToMap(this.boxImmagine, 6, 'PlanimetryBox');
          /* const source = this.boxImmagine.getSource();
          const features = source.getFeatures()[0];
          const style = features.getStyle();
          const geometry = features.getGeometry();
          const centroY = lat1 + ((lat2 - lat1) / 2);
          const centroX = lng1 + ((lng2 - lng1) / 2);
          let angoloRad = this.rotation; // * 180 / Math.PI;
          geometry.rotate(angoloRad, [centroX, centroY]);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Angolo di disegno: ', angoloRad); */
        }
      }
    }
  }

  /*
  disegnaLayer(t, tt, questa) {
    const projection = new Projection({
      code: 'EPSG:4326',
      // units: 'meters',
      extent: tt.extent
    });

    if (!this.GestisceLayerConSetSource) {
      if (t.map1[t.NumeroFrame2]) {
        t.map1[t.NumeroFrame2].removeLayer(t.layerImmagine);
      }
    }

    const newWms = new ImageLayer({
      opacity: .85,
      source: new Static({
        url: questa.blobImmagine, //  'https://www.aubay.it/aubay/wp-content/uploads/2017/05/innovdigit2.png',
        projection: projection,
        imageExtent: tt.extent,
        // resolution: 1,        // important for 100% image size!
        // maxResolution: 2,     // must be >= 1
      })
    });

    if (t.layerImmagine && this.GestisceLayerConSetSource) {
      try {
        t.layerImmagine.setSource(newWms);
      } catch (e) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nell\'update del layer immagine', newWms, e['message']);
      }
    } else {
      t.addLayerToMap(t.layerImmagine, 4, 'Planimetry');
      t.layerImmagine = newWms;
    }
  }
  */

  creaInterazione(t) {
    /* if (!t.layerModify) { // } || this.interaction) {
      return;
    } */

    if (this.interaction) {
      if (t.map1[t.NumeroFrame2]) {
        t.map1[t.NumeroFrame2].removeInteraction(this.interaction);
        this.interaction = undefined;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Interazioni', t.map1[t.NumeroFrame2].interactions);
      }
    }
    
    this.interaction = new Transform ({
      enableRotatedTransform: false,
      /* Limit interaction inside bbox * /
      condition: function(e, features) {
        return ol.extent.containsXY([-465960, 5536486, 1001630, 6514880], e.coordinate[0], e.coordinate[1]);
      },
      /* */
      addCondition: shiftKeyOnly,
      // filter: function(f,l) { return f.getGeometry().getType()==='Polygon'; },
      layers: [t.layerModify],
      hitTolerance: 5,
      translateFeature: false,
      scale: true,
      rotate: true,
      keepAspectRatio: false,
      translate: true,
      stretch: false
    });

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Aggiungo interazione a mappa', t.map1[t.NumeroFrame2]);

    if (t.map1[t.NumeroFrame2]) {
      t.map1[t.NumeroFrame2].addInteraction(this.interaction);

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Aggiunta interazione a mappa');

      function setHandleStyle(t) {
        // return;

        // t.interaction.set('translate', t.interaction.get('translate'));
        // t.interaction.set('rotate', t.interaction.get('rotate'));
        // return;
        // if ($("#style").prop('checked')) {
          // Style the rotate handle
          const circle = new RegularShape({
            fill: new Fill({color: [255, 255, 255, 0.01]}),
            stroke: new Stroke({width: 2, color: [0, 0, 0, 0.01]}),
            radius: 8,
            points: 10
          });
          t.interaction.setStyle('rotate',
            t.effettuaRotazione ?
              new Style({
                text: new Text ({
                  text: '\uf0e2',
                  font: '16px Fontawesome',
                  textAlign: 'left',
                  fill: new Fill({color: [255, 0, 0, 1]}),
                  stroke: new Stroke({ width: 2, color: [255, 255, 255, 0] })
                }),
                image: circle
              }) 
              :
              new Style({
                text: new Text ({
                  text: '\uf0e2',
                  font: '16px Fontawesome',
                  textAlign: 'left',
                  fill: new Fill({color: [0, 0, 0, 0]}),
                  stroke: new Stroke({ width: 0, color: [0, 0, 0, 0] })
                }),
                image: circle
              }) 
            );
          // Center of rotation
          t.interaction.setStyle('rotate0',
              t.effettuaRotazione ?
                new Style({
                  text: new Text ({
                    text: '\uf0e2',
                    font: '20px Fontawesome',
                    fill: new Fill({ color: [255, 0, 0, 1] }),
                    stroke: new Stroke({ width: 2, color: 'red' })
                  }),
                  image: circle
                })
              :
              new Style({
                text: new Text ({
                  text: '\uf0e2',
                  font: '20px Fontawesome',
                  fill: new Fill({ color: [0, 0, 0, 0] }),
                  stroke: new Stroke({ width: 0, color: [0, 0, 0, 0] })
                }),
                image: circle
              })
            );
          // Style the move handle
          t.interaction.setStyle('translate',
            new Style({
              text: new Text ({
                text: '\uf047',
                font: '20px Fontawesome',
                fill: new Fill({ color: [255, 255, 255, 0.8] }),
                stroke: new Stroke({ width: 2, color: 'red' })
              })
            }));

          /* uncomment to style */
          t.interaction.setStyle ('scale',
            t.effettuaScale ?
              new Style({
                text: new Text ({
                  text:'\uf07d',
                  font:"bold 20px Fontawesome",
                  fill: new Fill({ color:[255,0,0,1] }),
                  stroke: new Stroke({ width:2, color:'red' })
                })
              })
              :
              new Style({
                text: new Text ({
                  text:'\uf07d',
                  font:"bold 20px Fontawesome",
                  fill: new Fill({ color:[0,0,0,0] }),
                  stroke: new Stroke({ width:2, color:[0,0,0,0] })
                })
              })
          );
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Inter', t.interaction.style);
          t.interaction.style.scale1 = t.interaction.style.scale;
          t.interaction.style.scale2 = t.interaction.style.scale;
          t.interaction.style.scale3 = t.interaction.style.scale;
          t.interaction.style.scaleh1 = t.interaction.style.scale;
          t.interaction.style.scaleh3 = t.interaction.style.scale;
          t.interaction.style.scalev = t.interaction.style.scale;
          t.interaction.style.scalev2 = t.interaction.style.scale;
          /**/
        // } else {
        //   interaction.setDefaultStyle ();
        // }
        // Refresh
        t.interaction.set('translate', t.interaction.get('translate'));
        // t.interaction.set('angle', t.rotation);
  
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Creazione stili');
      };
      setHandleStyle(this);
  
      let startangle = this.rotation;
      let d; //  = [0, 0];
      const tt = this;
      let scala;
      let angolo; //  = startangle;
      // alert('Angolo iniziale: ' + startangle);
  
      // Handle rotate on first point
      const firstPoint = false;
      /* this.interaction.on (['select'], (e) => {
        if (firstPoint && e.features && e.features.length) {
          this.interaction.setCenter(e.features[0].getGeometry().getFirstCoordinate());
        }
      });
      this.interaction.on(['rotatestart', 'translatestart'], function(e) {
      }); */
      this.interaction.on('rotating', function (e) {
        angolo = e.angle; // *180/Math.PI; // startangle - (e.angle*180/Math.PI); //  startangle - e.angle;
  
        e.feature.set('angle', angolo);
      });
      this.interaction.on('translating', function (e) {
        d = e.coordinate; // transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
      });
      this.interaction.on('scaling', function (e) {
        scala = e.scale; // [e.scale[0], e.scale[1]];
      });

      // rotating/translating/scaling restano fuori dalla zona Angular (aggiornano solo variabili locali);
      // gli eventi di fine operazione scrivono su DB e rientrano nella zona
      this.interaction.on('rotateend', t.inZonaAngular(function (e) {
        tt.rotation = startangle + angolo; // Math.floor(angolo*180/Math.PI); // angolo;
        startangle = tt.rotation;
  
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Angolo finale: ', tt.rotation, tt.rotation*180/Math.PI);
  
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tt.rotation);
        tt.scriveValoriSuDb(t, 'N');
      }));

      this.interaction.on('scaleend', t.inZonaAngular(function (e) {
        tt.scale_x *= scala[0];
        tt.scale_y *= scala[1];
  
        /* const source = t.layerModify.getSource();
        const features = source.getFeatures()[0];
        const geometry = features.getGeometry();
        const extent = geometry.getExtent();
        tt.dime_x = Math.abs(extent[0] - extent[2]);
        tt.dime_y = Math.abs(extent[1] - extent[3]);

        if (t.debug2) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Valori scala', scala, extent, tt.dime_x, tt.dime_y);
        } */

        tt.scriveValoriSuDb(t, 'N');
      }));

      /* this.interaction.on('select', function (e) {
        t.visibileMascheraPL = true;
        t.fattoClickSuPlanimetria = true;
      }); */

      this.interaction.on('translateend', t.inZonaAngular(function (e) {
        tt.center = d;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Spostamento', d);

        tt.scriveValoriSuDb(t, 'N');
      }));
    }
  }

  spostaAlCentro(t) {
    if (t.map1[t.NumeroFrame2]) {
      if (t.debug2) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Centro mappa', t.map1[t.NumeroFrame2].getView().getCenter());
      }
      const mm = t.map1[t.NumeroFrame2].getView().getCenter();
      this.center[0] = mm[0];
      this.center[1] = mm[1];

      this.creataFeature = false;

      this.scriveValoriSuDb(t, 'N');
    }
  }

  aggiornaDati(t) {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      const m = [t.datiPlanimetria.move_x, t.datiPlanimetria.move_y];
      const mm = transform(m, 'EPSG:4326', 'EPSG:3857');
  
      this.center[0] = mm[0];
      this.center[1] = mm[1];
      let radians = t.datiPlanimetria.rotation;
      radians = radians * (Math.PI / 180);
  
      this.rotation = radians;
      this.scale_x = t.datiPlanimetria.scale_x;
      this.scale_y = t.datiPlanimetria.scale_y;
      if (this.scale_x < 0) { 
        this.scale_x = 0;
        t.datiPlanimetria.scale_x = 0;
      }
      if (this.scale_y < 0) { 
        this.scale_y = 0;
        t.datiPlanimetria.scale_y = 0;
      }
      this.dime_x = t.datiPlanimetria.dime_x;
      this.dime_y = t.datiPlanimetria.dime_y;
  
      this.creataFeature = false;
  
      this.alpha = t.datiPlanimetria.alpha;
      this.contrast = t.datiPlanimetria.contrast;
  
      /* const u = ['', '', '', '', '', '', '', '', '', '', '', ''];
      for (let i = 0; i <= u.length; i++) {
        u[i] = new Date().toString();
      };
      PlanimetryComponent.ultimo = u; */
      // t.datiPlanimetria.Ultimo = PlanimetryComponent.ultimo[t.NumeroFrame2]; // new Date().toString();
      // // logConsole('Planimetria aggiorna dati', t.NumeroFrame2, t.datiPlanimetria.Ultimo);

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Aggiorna dati: ', t.datiPlanimetria);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Scale: ', this.scale_x, this.scale_y);
      this.scriveValoriSuDb(t, 'N');        
    }, 1000);
  }

  creataFeature = false;

  creaFeature(t) {
    /* const ora = new Date().getTime();
    if (ora - this.vecchiaOra < 1000) {
      return;
    }
    this.vecchiaOra = ora;
    if (this.creataFeature) {
      return;
    }
    this.creataFeature = true */
    // alert('Creo feature');

    if (t.debug2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: creazione feature');
    }

    /* if (t.interaction) {
      t.map1[t.NumeroFrame2].removeInteraction(t.interaction);
      t.interaction = undefined;
    } */
    if (t.layerModify) {
      t.removeLayerFromMap('Planimetry Feature', t.layerModify);
      t.layerModify = undefined;
    }
        
    /* */
    let lat1;
    let lat2;
    let lng1;
    let lng2;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.extent);
    lng1 = this.extentBox[0];
    lat1 = this.extentBox[1];
    lng2 = this.extentBox[2];
    lat2 = this.extentBox[3]; 

    /* const geojsonObjectPerModify = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:4326'
        }
      },
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[
            // this.coordinate
            transform([lng1, lat1], 'EPSG:4326', 'EPSG:3857'),
            transform([lng2, lat1], 'EPSG:4326', 'EPSG:3857'),
            transform([lng2, lat2], 'EPSG:4326', 'EPSG:3857'),
            transform([lng1, lat2], 'EPSG:4326', 'EPSG:3857'),
            transform([lng1, lat1], 'EPSG:4326', 'EPSG:3857'),
          ]]
        },
      }]
    };

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno feature', this.extent, t.latLng, geojsonObjectPerModify);
    const sourceModify = new VectorSource({
      // format: GeoJSON,
      features: (new GeoJSON()).readFeatures(geojsonObjectPerModify, {
        featureProjection: 'EPSG:4326'}),
      // wrapX: false
    });
    const stylePerModify = [
      new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 3
        }),
      })
    ]; */

    if (t.debug2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Creazione vector layer ');
    }

    const coordinate = [
      [lng1, lat1],
      [lng2, lat1],
      [lng2, lat2],
      [lng1, lat2],
      [lng1, lat1],
    ];
    
    // if (!t.layerModify) {
      t.layerModify = new VectorLayer({
        source: new VectorSource({
          // format: GeoJSON,
          features: (new GeoJSON()).readFeatures({
            'type': 'FeatureCollection',
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:3857'
              }
            },
            'features': [{
              'type': 'Feature',
              'geometry': {
                'type': 'Polygon',
                'coordinates': [ coordinate ]
              },
            }]
          }, 
          { featureProjection: 'EPSG:3857' }),
          // wrapX: false
        }),
        style: [
          new Style({
            stroke: new Stroke({
              color: 'blue',
              width: 3
            }),
          })
        ]
      });
      
      if (!t.layerModify.getSource()) {
        return;
      }

      const source = t.layerModify.getSource();
      const features = source.getFeatures()[0];
      const style = features.getStyle();
      const geometry = features.getGeometry();
      const centroY = lat1 + ((lat2 - lat1) / 2);
      const centroX = lng1 + ((lng2 - lng1) / 2);
      let angoloRad = this.rotation; // * 180 / Math.PI;
      geometry.rotate(angoloRad, [centroX, centroY]);

      /* this.disegnaBoxVerde(t, geometry.getExtent());

      const geoExtent = geometry.getExtent();
  
      const lng12 = geoExtent[0];
      const lat12 = geoExtent[1];
      const lng22 = geoExtent[2];
      const lat22 = geoExtent[3]; 
  
      // this.extentImmagine = geoExtent; [ QUI
        [lng12, lat12],
        [lng22, lat12],
        [lng22, lat22],
        [lng12, lat22],
        [lng12, lat12],
      ];
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Geometria: ', geoExtent, lng12, lat12, lng22, lat22, this.extentImmagine); */

      // if (t.debug2) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Angolo di disegno: ', angoloRad);
      // }

      /* const t2 = setInterval(() => {
        geometry.rotate(angoloRad * (Math.PI / 180.0), [centroX, centroY]);
        angoloRad++;
      }, 1000) */

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, source, features, style, geometry, centroX, centroY, this.rotation, angoloRad, geometry.getExtent(), coordinate);

      /* const tm = setTimeout(() => {
          clearTimeout(tm);
        const source = t.layerModify.getSource();
        const features = source.getFeatures()[0];
        // const style = features.getStyle();
        // const geometry = features.getGeometry();
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, source, features.get('angle'));
        // geometry.rotate(45);
      }, 1000); */

      t.addLayerToMap(t.layerModify, 5, 'CreaFeature');
      // t.layerModify['Name'] = 'LayerBoxPlanimetria';
      // t.wms[t.NumeroFrame2].push(t.layerModify);
    // } else {
    //   t.layerModify.setSource(sourceModify);
      // return;
    // }

    // if (!this.interaction) {

    this.creaInterazione(t);

    // } else {
    //   return;
    // }


    return;

    /* let lat1;
    let lat2;
    let lng1;
    let lng2;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.extent);
    lng1 = this.extent[0];
    lat1 = this.extent[1];
    lng2 = this.extent[2];
    lat2 = this.extent[3];

    const overlayStyle = (function() {
      const styles = {};
      styles['Polygon'] = [
        new Style({
          fill: new Fill({
            color: [255, 255, 255, 0.5]
          })
        }),
        new Style({
          stroke: new Stroke({
            color: [255, 255, 255, 1],
            width: 5
          })
        }),
        new Style({
          stroke: new Stroke({
            color: [0, 153, 255, 1],
            width: 3
          })
        })
      ];

      return function(feature) {
        return styles[feature.getGeometry().getType()];
      };
    })();

    const select = new Select({
      // wrapX: false,
      style: overlayStyle
    });

    const geojsonObjectPerTranslate = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:4326'
        }
      },
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[
            transform([lng1 + (this.diffLng / 2), lat1 + (this.diffLat / 2)], 'EPSG:4326', 'EPSG:3857'),
          ]]
        },
      }]
    };

    const stylePerTrans = [
      new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 3
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: 'rgba(0, 0, 255, 0.3)'
          })
        }),
        geometry: function(feature) {
          // return the coordinates of the first ring of the polygon
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        }
      })
    ];

    const sourceTrans = new VectorSource({
      format: GeoJSON,
      features: (new GeoJSON()).readFeatures(geojsonObjectPerTranslate, {
        featureProjection: 'EPSG:4326'}),
      wrapX: false
    });
    if (t.layerTrans) {
      t.map1[t.NumeroFrame2].removeLayer(t.layerTrans);
    }
    t.layerTrans = new VectorLayer({
      source: sourceTrans,
      style: stylePerTrans
    });
    t.addLayerToMap(t.layerTrans, 5);

    const translate = new Translate({
      // features: select.getFeatures(),
      source: sourceTrans
    });

    translate.un('translateend', this.functTransEnd);
    translate.on('translateend', this.functTransEnd.bind(null, t, this));

    t.map1[t.NumeroFrame2].removeInteraction(translate);
    t.map1[t.NumeroFrame2].addInteraction(translate);

    // feature di modifica
    const geojsonObjectPerModify = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:4326'
        }
      },
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[
            // this.coordinate
            transform([lng1, lat1], 'EPSG:4326', 'EPSG:3857'),
            transform([lng2, lat1], 'EPSG:4326', 'EPSG:3857'),
            transform([lng2, lat2], 'EPSG:4326', 'EPSG:3857'),
            transform([lng1, lat2], 'EPSG:4326', 'EPSG:3857'),
            transform([lng1, lat1], 'EPSG:4326', 'EPSG:3857'),
          ]]
        },
      }]
    };

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno feature', t.latLng);

    const stylePerModify = [
      new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 3
        }),
      }),
    ];
    const sourceModify = new VectorSource({
      format: GeoJSON,
      features: (new GeoJSON()).readFeatures(geojsonObjectPerModify, {
        featureProjection: 'EPSG:4326'}),
      wrapX: false
    });
    t.map1[t.NumeroFrame2].removeLayer(t.layerModify);
    t.layerModify = new VectorLayer({
      source: sourceModify,
      style: stylePerModify
    });
    t.addLayerToMap(t.layerModify, 5);

    const modify = new Modify({
      // features: select.getFeatures(),
      source: sourceModify,
      insertVertexCondition: function() {
        // prevent new vertices to be added to the polygons
        return !select.getFeatures().getArray().every(function(feature) {
          return feature.getGeometry().getType().match(/Polygon/);
        });
      }
    });

    t.map1[t.NumeroFrame2].removeInteraction(select);
    t.map1[t.NumeroFrame2].removeInteraction(modify);
    t.map1[t.NumeroFrame2].addInteraction(select);
    t.map1[t.NumeroFrame2].addInteraction(modify);

    modify.un('modifyend', this.functModifyEnd);
    modify.on('modifyend', this.functModifyEnd.bind(null, t, this));

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Create features'); */
  }

  reprocessing(t) {
    this.scriveValoriSuDb(t, 'Y');
  }

  vecchiaOra = -1;

  scriveValoriSuDb(t, reprocessing) {
    /* const ora = new Date().getTime();
    if (ora - this.vecchiaOra < 1000) {
      return;
    }
    this.vecchiaOra = ora; */

    t.riprocessingInCorso = true;

    let agnact = t.act_set;
    /* if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = '"null"';
    } else {
      agnact = '"' + ExternalUtilities.stringaAGNoACT + '"';
    }
    if (ExternalUtilities.stringaAGNoACT === undefined) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per agnact undefined 1');
      }
      return;
    } */

    if (agnact === undefined || agnact === 'undefined') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per agnact undefined 2');

      return;
    }

    let valoreRicerca = agnact;
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Agn Act', valoreRicerca, agnact);
    }
    while (valoreRicerca.indexOf('\'') > -1) {
      valoreRicerca = valoreRicerca.replace('\'', '');
    }
    while (valoreRicerca.indexOf('"') > -1) {
      valoreRicerca = valoreRicerca.replace('"', '');
    }

    if (!valoreRicerca || valoreRicerca === '') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Esco per agnact undefined 3', valoreRicerca);

      return;
    }

    const params = {
      cntx_id: t.sessionID2,
      v_act_set_name_list: valoreRicerca.indexOf('[') > -1 && valoreRicerca.indexOf(']') > -1 ? valoreRicerca : '[ACT] ' + valoreRicerca, 
      v_planimetry_move_x: this.center[0],
      v_planimetry_move_y: this.center[1],
      v_planimetry_rotation: this.rotation, // *180/Math.PI),
      v_planimetry_scale_x: this.scale_x,
      v_planimetry_scale_y: this.scale_y,
      v_act_reproc: reprocessing,
      v_planimetry_alpha: this.alpha,
      v_planimetry_contrast: this.contrast
    }
    
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Scrittura parametri', params);

    this.apiService.chiamataPost(t.Utils, 'geo_act_planimetry__set', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$.per(t)))
    .subscribe((data2: any) => {
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (data2.err_code === 0) {
          if (reprocessing === 'Y') {
            this.AttendePerTogliereRondella(t);
          } else {
            t.riprocessingInCorso = false;
          }

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Scrittura ok');
    
          // alert('ricarico');
          // const tm = setTimeout(() => {
          // clearTimeout(tm);
            if (reprocessing !== 'Y') {
              this.refreshPiantinaDopoSalvataggio(t);
            }
          // }, 5000);
        } else {
          t.riprocessingInCorso = false;
          t.caricamentoMappaInCorso = false;
          console.error(data2.failure_reason);
        }
      } else {
        t.riprocessingInCorso = false;
        t.caricamentoMappaInCorso = false;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Scrittura KO. Ritorno nullo');
      }
    });
  }

  AttendePerTogliereRondella(t) {
    let as = ExternalUtilities.effettuaReplace(t.act_set, '"', '');
    as = ExternalUtilities.effettuaReplace(as, '\'', '');
    const valoreRicerca = as;

    const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

    const params = {
      cntx_id: t.sessionID2,
      // v_caller_tag: t.chiSonoActvities[t.NumeroFrame2],
      v_act_set_name_list: valoreRicerca,
      // v_event_type_list: eventi,
      v_tms_min: t.timeRangeDSFStart2,
      v_tms_max: t.timeRangeDSFStop2,
      // v_filter_group_by: t.filterGroupByCDD,
      v_bbox: geoFilter
    };

    this.apiService.chiamataPost(t.Utils, 'geo_act__grid2', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$.per(t)))
    .subscribe((data2: any) => {
      ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

      if (data2 && data2 !== null) {
        const dati = data2.DataTable;
        
        let ok = false;
        
        dati.forEach(element => {
          const stato = element.STATUS;
          // // logConsole('Stato Act grid', element.ACT_CODE, stato);
          if (!ok && (stato === 'Ok' || stato === 'Failed')) {
            ok = true;
          }
        });

        if (!ok) {
          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.AttendePerTogliereRondella(t);
          }, 1000);
        } else {
          t.riprocessingInCorso = false;

          this.refreshPiantinaDopoSalvataggio(t);
        }
      }
    });
  }

  refreshPiantinaDopoSalvataggio(t) {
    const u = ['', '', '', '', '', '', '', '', '', '', '', ''];

    for (let i = 0; i < u.length; i++) {
      u[i] = new Date().toString();
    };
    PlanimetryComponent.ultimo = u;
    // t.datiPlanimetria.Ultimo = PlanimetryComponent.ultimo[t.NumeroFrame2]; // new Date().toString();
    // // logConsole('Planimetria set', t.NumeroFrame2, PlanimetryComponent.ultimo);
    
    this.caricaPiantina(t);

    t.refreshPlanimetriaEmit.emit(new Date().toString());
  }

  /* functModifyEnd = function(t, tt, evt) {
    if (!evt.target.dragSegments_ || !evt.target.dragSegments_[0]) {
      return;
    }
    const coords = evt.target.dragSegments_[0][0].geometry.flatCoordinates;
    let x = 0;
    let lng = 0;
    let lat = 0;
    const punti = new Array();
    coords.forEach(element => {
      if (x === 0) {
        lng = element;
      } else {
        lat = element;
        punti.push(transform([lng, lat], 'EPSG:3857', 'EPSG:4326'));
      }
      x++;
      if (x === 2) { x = 0; }
    });

    t.latLng = punti;

    console.log ('Nuovi punti', t.latLng);

    if (t.latLng) {
      tt.disegnaImmagineSuMappaFinale(t, t.latLng[0][0], t.latLng[0][1], t.latLng[2][0], t.latLng[2][1], tt);
      // tt.creaFeature(t);
    }
  }

  functTransEnd = function(t, tt, evt) {
    if (!evt.coordinate) {
      return;
    }

    const newCoord = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, newCoord, tt.diffLng, tt.diffLat);
    const punti1 = newCoord[0] - (tt.diffLng / 2);
    const punti2 = newCoord[0] + (tt.diffLng / 2);
    const punti3 = newCoord[1] - (tt.diffLat / 2);
    const punti4 = newCoord[1] + (tt.diffLat / 2);

    t.latLng = new Array();
    t.latLng.push([punti1, punti3]);
    t.latLng.push([punti2, punti3]);
    t.latLng.push([punti2, punti4]);
    t.latLng.push([punti1, punti4]);
    t.latLng.push([punti1, punti3]);

    // t.planimetry.caricaPiantina(t);
    // t.planimetry.creaFeature(t);

    if (t.latLng) {
      tt.disegnaImmagineSuMappaFinale(t, t.latLng[0][0], t.latLng[0][1], t.latLng[2][0], t.latLng[2][1], tt);
      // tt.creaFeature(t);
    }
  }; */
}

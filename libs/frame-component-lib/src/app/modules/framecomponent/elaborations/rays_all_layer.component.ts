import { logConsole } from '../console-log';
import { Injectable } from "@angular/core";
import { ExternalApiService } from "../services/externalapi.service";
import {transform} from 'ol/proj';
// import ExternalUtilities from "../ExternalUtilities.component";
import ImageWMS from 'ol/source/ImageWMS';
import ImageLayer from 'ol/layer/Image';
import { environment } from '../../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import ExternalUtilities from "../ExternalUtilities.component";

import { FineRichieste } from './fine-richieste';
@Injectable()
export class ShowRaysAllLayerComponent {
  destroy$ = new FineRichieste();

  // lastCallSRAL1 = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallSRAL = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // static coordinate = [0, 0];
  
  GestisceLayerConSetSource = true;

  // staElaborandoPLI = [false, false, false, false, false, false, false, false, false, false, false];;
  ultimaVoltaTMS = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // staLeggendo = [false, false, false, false, false, false, false, false, false, false, false];
  // stringaRitorno = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // resp;
  // lastUrl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // esci = [false, false, false, false, false, false, false, false, false, false, false];
  // checkFalso = [false, false, false, false, false, false, false, false, false, false, false];
  stringaRitornoPerProgetto = '';
  layerAttivo = ExternalUtilities.creaVettore(environment.quantePagine, false);

  constructor(
    private http: HttpClient,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    this.layerAttivo[t.NumeroFrame2] = false;
    if (t.raysAllLayer[t.NumeroFrame2]) {
      t.removeLayerFromMap('Rays All Layer', t.raysAllLayer[t.NumeroFrame2]);
      t.raysAllLayer[t.NumeroFrame2] = undefined;
    }

    t.lastCallSRAL[t.NumeroFrame2] = '';
    t.lastCallSRAL1[t.NumeroFrame2] = '';
    t.stringaRitorno[t.NumeroFrame2] = '';
    t.lastUrl[t.NumeroFrame2] = '';
    t.staLeggendo[t.NumeroFrame2] = false;
    t.esci[t.NumeroFrame2] = false;
    t.checkFalso[t.NumeroFrame2] = false;
  }

  disegnaAllLayers(t, coordinate, forza, daDove) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Mappa', t.NumeroFrame2, t.MappaOGrafico2);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna Show Rays All Layer', t.NumeroFrame);

    /* if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna Show Rays All Layer. Eseguito in progetto: ' + t.eseguitoInProgetto2 + '. Nome progetto: ' + t.progettoEsterno2);
    }

    let nonFareNulla = false;
    if (t.eseguitoInProgetto2 === true && t.progettoEsterno2.indexOf('DD;') > -1) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna Show Rays All Layer. Imposto il flag di non fare nulla in quanto fa già tutto il progetto esterno di Data Dictionaries');
      }
      nonFareNulla = true;
      // return;
    } */


    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prende Point measures', t.NumeroFrame, tms);
    /* if (this.staElaborandoPLI === true) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Già sta elaborando');
      }
      return;
    } */

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    // if (nonFareNulla === false) {
      const ora = new Date().getTime();
      if (forza == false) {
        if (ora - this.ultimaVoltaTMS[t.NumeroFrame2] < 500 && this.ultimaVoltaTMS[t.NumeroFrame2] !== -1) {
          if (t.showRaysAllLayer2 && t.checkFalso[t.NumeroFrame2] === true) {
            t.checkFalso[t.NumeroFrame2] = false;
            t.lastCallSRAL[t.NumeroFrame2] = '';

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Troppo poco tempo ma passo lo stesso per check falso cambiato in vero');
          } else {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Troppo poco tempo');
            this.layerAttivo[t.NumeroFrame2] = false;

            return;
          }
        }
      } else {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Forzo il ridisegno');
      }
      this.ultimaVoltaTMS[t.NumeroFrame2] = ora;
      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Controllo check attuale e ultimo stato');
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. check attuale', t.showRaysAllLayer2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. ultimo stato', t.checkFalso[t.NumeroFrame2]);

      if (t.showRaysAllLayer2 && t.checkFalso[t.NumeroFrame2] === true) {
        t.checkFalso[t.NumeroFrame2] = false;
        t.lastCallSRAL[t.NumeroFrame2] = '';

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Check falso cambiato in vero');
      }
    // }

  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, ExternalUtilities.layersRilevati);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, ShowRaysAllLayerComponent.coordinate);
    // let lista = '';
    if (!coordinate || coordinate.length < 1) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. coordinate non valide', coordinate);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    t.pendings += 'Rays<br />';

    let coord2 = [+coordinate[0], +coordinate[1]];
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All: Coordinate ', coord2);

    if (coord2[0] > 200) {
      coord2 = transform(coord2, 'EPSG:3857', 'EPSG:4326');
    }
    t.coordinateSREL = coord2;
    t.drawShowRaysAllLayerEmit.emit(coord2);

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const actualCall1 = 'POINTRAL;' + coord2[0] + ';' + coord2[1] + ';' + t.showRaysAllLayer2 + ';'; // + tms + ';' + agnact + ';' + sla + ';' + valoriDiBase + ';' + daTcRun;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Chiamata', t.NumeroFrame, actualCall1, t.lastCallSRAL1[t.NumeroFrame2]);

    /* if (!this.GestisceLayerConSetSource) {
      if (t.raysAllLayer) {
        t.removeLayerFromMap('Rays All Layer', t.raysAllLayer);
        t.raysAllLayer = undefined;
      }
    } */

    if (t.lastCallSRAL1[t.NumeroFrame2] !== actualCall1 || forza) {
      t.lastCallSRAL1[t.NumeroFrame2] = actualCall1;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Check ', t.NumeroFrame2, t.showRaysAllLayer2);

      if (!t.showRaysAllLayer2) {
        // alert('pulisco');
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Uscita per check falso', t.NumeroFrame2);

        if (t.raysAllLayer[t.NumeroFrame2]) {
          t.removeLayerFromMap('Rays All Layer', t.raysAllLayer[t.NumeroFrame2]);
          t.raysAllLayer[t.NumeroFrame2] = undefined;
        }

        t.checkFalso[t.NumeroFrame2] = true;
        t.lastCallSRAL1[t.NumeroFrame2] = '';

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show rays all layers. Pulisco layer per check falso');

        const tm = setTimeout(() => {
          clearTimeout(tm);

          t.rimuoviAnimazione();
        }, 1000);

        // this.staElaborandoPLI[t.NumeroFrame2] = false;
        t.pendings.replace('Rays<br />', '');
        this.layerAttivo[t.NumeroFrame2] = false;

        return;
      }
      t.checkFalso[t.NumeroFrame2] = t.showRaysAllLayer2;

      // this.staElaborandoPLI[t.NumeroFrame2] = true;
      t.effettuaAnimazione(coord2[0], coord2[1]);

      t.stringaRitorno[t.NumeroFrame2] = '';
      t.staLeggendo[t.NumeroFrame2] = true;
      t.esci[t.frameAttivo] = false;

      // if (nonFareNulla === false) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Passato. Eseguo legge layers');

        this.leggeLayers(t, coord2);

        let q = 0;
        let lunghezzaStringa = 0;

        const intr = setInterval(() => {
          // logConsole('Finito di leggere. Lunghezza: ' + t.stringaRitorno[t.NumeroFrame2].length + '/' + lunghezzaStringa);
          
          if (t.staLeggendo[t.NumeroFrame2] === false && 
            t.stringaRitorno[t.NumeroFrame2].length > 0 && t.stringaRitorno[t.NumeroFrame2].length === lunghezzaStringa
          ) {
            clearInterval(intr);

            if (t.stringaRitorno[t.NumeroFrame2].indexOf('[') === -1) {
              t.stringaRitorno[t.NumeroFrame2] = '[' + 
                t.stringaRitorno[t.NumeroFrame2].substring(0, t.stringaRitorno[t.NumeroFrame2].length - 2) + 
                ']';
            }
            // logConsole('SPP: ', this.stringaRitornoPerProgetto);
            if (this.stringaRitornoPerProgetto) {
              if (this.stringaRitornoPerProgetto.indexOf('[') === -1) {
                this.stringaRitornoPerProgetto = '[' + 
                  this.stringaRitornoPerProgetto.substring(0, this.stringaRitornoPerProgetto.length - 2) + 
                  ']';
              }
              t.stringaRitornoEmit.emit(this.stringaRitornoPerProgetto);
              const tm = setTimeout(() => {
                clearTimeout(tm);

                this.stringaRitornoPerProgetto = '';
              }, 1000);
            }

            let tms = t.Utils.tmsFine;
            if (t.eseguitoInProgetto2 === true) {
              tms = t.timeRangeDSFStop2;
            }

            // t.timeRangeDSFStop2;
            // const tms = t.timeRangeDSFStop2;
            const punto = 'POINT(' + coord2[0] + ' ' + coord2[1] + ')';

            const params =
              'cntx_id:\'' + t.sessionID2 + '\';' +
              'v_point_layer_features_list:\'' + t.stringaRitorno[t.NumeroFrame2] + '\';' +
              'v_tms:\'' + tms + '\';' +
              'v_point_on_map:\'' + punto + '\';'

            const parameters = {
              LAYERS: 'Geo_ANTS:l_geo_point_layer_list',
              TILED: false,
              VIEWPARAMS: params
              // 'CQL_FILTER': act_set + ' and measr_code=\'' + t.overlay + '\'' + sla + cluster,
            };

            // logConsole('Parametri layers', params);

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Chiamata Layers show rays all layers: ', params);

            const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
              t.frameAttivo + ';' + t.isCheckedShowPaths2 ;
            let actualCall = 'SRAL;' + JSON.stringify(parameters) + valoriDiBase ;

            if (t.lastCallSRAL[t.NumeroFrame2] !== actualCall) {
              t.lastCallSRAL[t.NumeroFrame2] = actualCall;

              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Chiamata Layers show rays all layers. Eseguo chiamata');

              // if (flagLocaleOverlay === 1) {
              // }

              /* let q = 0;
              const tt = setInterval(() => {
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'wms', wms);
                if (wms.loading === true) {
                  q++;
                  if (q > 30) {
                    // t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;

                    clearInterval(tt);
                    t.pendings.replace('Rays<br />', '');
                  }
                } else {
                  clearInterval(tt); */

                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Url overlay frame', t.NumeroFrame, wms);

                  if (t.raysAllLayer[t.NumeroFrame2] && t.raysAllLayer[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource) {
                    this.layerAttivo[t.NumeroFrame2] = true;
                    t.raysAllLayer[t.NumeroFrame2].getSource().updateParams({ 'VIEWPARAMS': params }); // .setSource(wms);                        
                  } else {
                    // if (!this.GestisceLayerConSetSource) {
                      if (t.raysAllLayer[t.NumeroFrame2]) {
                        t.removeLayerFromMap('Rays All Layer', t.raysAllLayer[t.NumeroFrame2]);
                        t.raysAllLayer[t.NumeroFrame2] = undefined;
                      }
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
                    // t.wms[t.NumeroFrame2][t.Utils.quanteMisure + 1] = wms;

                    t.addLayerToMap(newWms, 15, 'ShowRaysAllLayer');
                    this.layerAttivo[t.NumeroFrame2] = true;
                    t.raysAllLayer[t.NumeroFrame2] = newWms;
                  }

                  const tm = setTimeout(() => {
                    clearTimeout(tm);

                    t.rimuoviAnimazione();
                  }, 1000);

                  // this.staElaborandoPLI[t.NumeroFrame2] = false;
                  t.pendings.replace('Rays<br />', '');
                /* }
              }, 1000); */

            } else {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Chiamata Layers show rays all layers. Skippo per chiamata uguale');

              const tm = setTimeout(() => {
                clearTimeout(tm);

                t.rimuoviAnimazione();
              }, 1000);
            }
          } else {
            lunghezzaStringa = t.stringaRitorno[t.NumeroFrame2].length;

            q++;
            if (q > 15) {
              clearInterval(intr);

              const tm = setTimeout(() => {
                clearTimeout(tm);

                t.rimuoviAnimazione();
              }, 1000);

              // this.staElaborandoPLI[t.NumeroFrame2] = false;
              t.pendings.replace('Rays<br />', '');
            }
          }
        }, 1500);
        /*
        this.apiService.chiamataPost(t.Utils, 'geo_point_layer_list__grid', params)
        // .map(response => response())
        .subscribe((data2: any) => {
          ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

          this.staElaborandoPLI = false;
          t.caricamentoDatiInCorsoPointMeasures = false;
          if (data2 && data2 !== null) {
            // const data = data2; // [0].geo_measure_dfn__grid);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info:', t.datiPointMeasures, data2);
            if (t.datiPointMeasures && t.datiPointMeasures.DataTable && data2.DataTable) {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiorno valori');
              t.datiPointMeasures.DataTable = data2.DataTable;
              // t.effettuaAutoFitPM = !t.effettuaAutoFitPM;
            } else {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Riscrivo valori');
              t.datiPointMeasures = data2;
              t.effettuaAutoFitPM = !t.effettuaAutoFitPM;
            }
          } else {
            t.datiPointMeasures = null;
          }
        }, error => {
          this.staElaborandoPLI = false;
          t.caricamentoDatiInCorsoPointMeasures = false;
          ExternalUtilities.messaggioDiErrore(t, 'Read point info grid:' + error);
        }); */
    }
  }

  leggeLayers(t, coord2) {
    let url = '';
    let lat1 = +coord2[0] - .01;
    let lat2 = +coord2[0] + .01;
    let lng1 = +coord2[1] - .01;
    let lng2 = +coord2[1] + .01;
    let indirizzo = t.Utils.indirizzoGEOServer;
    let nomeLayer = '';
    let nomiLayers = new Array();
    let daIncludere = t.lastSelectedLayer2;
    if (daIncludere && daIncludere.LAYER_NAME && daIncludere.LAYER_NAME.indexOf('_') > -1) {
      const d = daIncludere.LAYER_NAME.split('_');
      daIncludere = d[0] + '_' + d[1] + '_' + d[2] + '_' + d[3];
    } else {
      if (daIncludere) {
        if (daIncludere.LAYER_NAME === 'ALL') {
          daIncludere = '***TUTTI***';
        } else {
          if (daIncludere.LAYER_NAME === 'NONE') {
            daIncludere = '***NESSUNO***';
          }
        }
      } else {
        daIncludere = '***TUTTI***';
      }
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Layers da includere:', daIncludere);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Leggo layers 1:', t.datiAddLayers2);

    if (t.datiAddLayers2) {
      t.datiAddLayers2.DataTable.forEach(async element => {
        let nomeLayer2 = element.CODE_STR;
        if (nomeLayer2.toUpperCase().indexOf('GLOBAL LAYER') === -1 && nomeLayer2.toUpperCase().indexOf('HTTP') === -1 && nomeLayer2.length > 5) {
          if (nomeLayer2.toUpperCase().indexOf('CELL_ENH') > -1) {
          // if (nomeLayer2.toUpperCase().indexOf('LAYERS=') > -1 && nomeLayer2.toUpperCase().indexOf('GEO_ANTS') > -1 && nomeLayer2.toUpperCase().indexOf('CELL_ENH') > -1) {
            // nomeLayer2 = nomeLayer2.substring(nomeLayer2.toUpperCase().indexOf('LAYERS=') + 7, nomeLayer2.length);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element.CODE_STR);
            const indirizzo2 = nomeLayer2.replace('?', '&');
            nomeLayer += indirizzo2 + ',';
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, indirizzo2);
            nomiLayers.push(indirizzo2);
          }
        }
      });
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Leggo layers 2: ', nomeLayer);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Leggo layers 2: ', nomiLayers);

    if (nomeLayer.length > 0) {
      nomeLayer = nomeLayer.substring(0, nomeLayer.length - 1);
      let tms = t.Utils.tmsFine + 'Z'; // t.timeRangeDSFStop2 + 'Z';
      if (t.eseguitoInProgetto2 === true) {
        tms = t.timeRangeDSFStop2 + 'Z';
      }
      tms = tms.replace(' ', 'T');

      url = indirizzo + environment.urlBaseGS +  '/wms?' +
        'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fjpeg&TRANSPARENT=true&' +
        'QUERY_LAYERS=' + nomeLayer + '&STYLES&exceptions=application%2Fvnd.ogc.se_inimage&time=' + tms + '&' +
        'VIEWPARAMS=cntx_id:\'' + t.sessionID2 + '\'&' +
        'TRANSPARENT=true&LAYERS=' + nomeLayer + '&INFO_FORMAT=text/plain&FEATURE_COUNT=50&TILED=false&' +
        '&SRS=EPSG%3A4326&WIDTH=2&HEIGHT=2&X=1&Y=1&&BBOX=' + lat1 + ',' + lng1 + ',' + lat2 + ',' + lng2 + '&TipoChiamata=2';

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Show Rays All Layer. Leggo layers. URL: ', url);

          /* if (this.lastUrl === url) {
        this.esci = true;
        this.staLeggendo = false;

        return;
      } */
      t.lastUrl[t.NumeroFrame2] = url;

      // const c = await t.downloadFile.downloadJSON(url);

      this.http.get(
        url,
        { responseType: 'blob' as 'json', observe: 'response' }
        )
        .pipe(takeUntil(this.destroy$.per(t)))
        .subscribe((data: any) => {
        if (data) {
          this.continua(t, data, tms, daIncludere);
        }

        t.staLeggendo[t.NumeroFrame2] = false;
      });

      /* t.apiService.downloadFile(url)
      // .map(response => response)
      .subscribe((data2: any) => {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno download', data2);
        if (data2) {
          this.continua(t, data2, tms, daIncludere);
        }

        t.staLeggendo[t.NumeroFrame2] = false;
      }); */
    }
  }

  async continua(t, c, tms, daIncludere) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Header:', c);

      const hh = c.headers.get('warning');
      let warnings = new Array();
      if (hh) {
        const w = hh.split(',');
        w.forEach(element => {
          if (element.indexOf('No nearest value') === -1) {
            const e = element.split('(');
            const r = e[0].split(':');
            const t = r[1].replace('time=', '').trim() + ':' + r[2] + ':' + r[3];
            const tt = t.split(' ');
            const s = {
              layer: e[1].replace(')', '').replace('Geo_ANTS:', '').toUpperCase().trim(),
              time: tt[0]
            }
            warnings.push(s);
          }
        });
      }
      const cc = await new Response(c.body).text()
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, cc);

      if (cc.indexOf('ServiceException') !== -1) {
        /* if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, url);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nella chiamata', cc);
        } */
      } else {
        const cc2 = cc.split('\n');
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, cc2);
        let nomeLayer = '';
        let idx = 0;
        let idx2 = 0;
        cc2.forEach(element => {
          let ok = true;

          // if (idx2 <= 15) {
            if (element.toUpperCase().indexOf('RESULTS FOR FEATURETYPE') > -1) {
              nomeLayer = element;
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeLayer);
              nomeLayer = nomeLayer.substring(nomeLayer.indexOf('GeoAnts:') + 8, nomeLayer.length - 2);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeLayer);
              // idx = 0;
              ok = false;
            }
            if (element.toUpperCase().indexOf('-----------') > -1) {
              ok = false;
            }

            if (ok) {
              const val = element.split('=');
              if (element.trim() !== '') {
                const name = val[0];
                const value = val[1];
                let tu = tms;
                let ok = false;

                warnings.forEach(element => {
                  if (element.layer === nomeLayer.toUpperCase().trim()) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Trovato layer tms:', element.layer, element.time);

                    tu = element.time;
                    ok = true;
                  }
                });
                /* if (!ok) {
                  if (t.debug2 === true) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NON Trovato layer tms:', warnings, nomeLayer.toUpperCase().trim());
                  }
                } */
                // tu = '2021-09-22';
                // this.stringaRitorno += '{"layer_name":"' + nomeLayer + '"\\,"feature_idx":' +
                //   idx + '\\,"property_name":"' + name + '"\\,"value":' + value +
                //   '\\,"time_used":"' + tu + '"}\\,';

                let ok2 = true;
                if (daIncludere === '***NESSUNO***') {
                  ok2 = false;
                } else {
                  if (daIncludere === '***TUTTI***') {
                    ok2 = true;
                  } else {
                    if (nomeLayer.indexOf(daIncludere) === -1) {
                      ok2 = false;
                    }
                  }
                }
                if (ok2) {
                  /* t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'name' , name);
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'value' , value);
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'nomeLayer' , nomeLayer); */

                  if (name.indexOf('GRAY_INDEX') > -1) {
                    if (value !== '4.29495587E8') {
                      // if (nomeLayer.indexOf('campo') === -1) {
                        t.stringaRitorno[t.NumeroFrame2] += '{"l":"' + nomeLayer + '"\\,"f":' +
                          idx + '\\,"v":' + (value ? value.trim() : '') +
                          '}\\,';
                        this.stringaRitornoPerProgetto += '{ "layer_name": "' + nomeLayer + '", "feature_idx": ' +
                          idx + ', "property_name": "' + name + '", "value": ' + value +
                          ', "time_used": "' + tu + '" }, ';                          
                      // }
                    }
                  }
                }

                // idx2++;
                // if (idx2 > 14) {
                  // this.staLeggendo = false;
                // }
              }
            }
          // }
        });

        /* const cc2 = JSON.parse(cc);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, cc2);
        const feat = cc2.features;
        let indice = 0;
        let rottura = 0;
        feat.forEach(element2 => {
          let idx = 0;
          let prop = JSON.stringify(element2.properties);
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, prop);
          prop = prop.replace('{', '');
          prop = prop.replace('}', '');
          prop = prop.trim();
          const prop2 = prop.split(',');
          prop2.forEach(element4 => {
            const v = element4.split(':');
            const name = v[0];
            const value = v[1];
            const layerName = nomiLayers[indice];

            this.stringaRitorno += '{ "layer_name": "' + layerName + '", "feature_idx": ' + idx + ', "property_name": ' + name + ', "value": ' + value + '}, ';
            idx++;

            rottura++;
            if (rottura === 2) {
              rottura = 0;
              indice++;
            }
          });
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2.properties, prop, stringaRitorno);
          // layer_name text, feature_idx int, property_name text, value text);
        }); */
      }
  }

}

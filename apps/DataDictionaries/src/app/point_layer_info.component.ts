import { logConsole } from './console-log';
import { Injectable } from '@angular/core';
import {transform} from 'ol/proj';
import Utils from './Utilities.component';
import { environment } from '../environments/environment.prod';
import { ApiService } from './db/api.service';
import { HttpClient } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';
// import Utils from '../Utilities.component';

@Injectable()
export class PointLayerInfoComponent {
  static lastCallPLI = ['', '', '', '', '', '', '', '', '', '', ''];

  staElaborandoPLI = false;
  ultimaVoltaTMS = -1;
  staLeggendo = false;
  stringaRitorno = '';
  stringaAppoggio = '';
  resp;
  lastUrl = '';
  esci = false;
  headers;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
  ) {
    this.headers = new Headers();
  }

  public async prendePointLayerInfo(t, coordinate) {
    // t.debug2 = true;

    // // logConsole('Prende Point measures', t.NumeroFrame, tms);
    /* if (this.staElaborandoPLI === true) {
      if (t.debug2 === true) {
        // logConsole('Point Layer Info interno. Già sta elaborando');
      }
      return;
    } */

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS < t.ritardoPerFunzioni && this.ultimaVoltaTMS !== -1) {
      if (t.debug2 === true) {
        // logConsole('Point Layer Info interno. Troppo poco tempo');
      }
      return;
    }
    this.ultimaVoltaTMS = ora;
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    // // logConsole(ExternalUtilities.layersRilevati);

    // let lista = '';
    let coord2 = [+coordinate[0], +coordinate[1]];
    if (coord2[0] > 200) {
      coord2 = transform(coord2, 'EPSG:3857', 'EPSG:4326');
    }

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const actualCall1 = 'POINTLI;' + coord2[0] + ';' + coord2[1]; // + tms + ';' + agnact + ';' + sla + ';' + valoriDiBase + ';' + daTcRun;

    if (t.debug2 === true) {
      // logConsole('Point Layer Info interno. Chiamata', t.NumeroFrame, actualCall1);
    }

    if (PointLayerInfoComponent.lastCallPLI[t.NumeroFrame] !== actualCall1) {
      PointLayerInfoComponent.lastCallPLI[t.NumeroFrame] = actualCall1;

      if (t.debug2 === true) {
        // logConsole('Point Layer Info interno. Eseguo lettura', t.NumeroFrame, actualCall1);
      }

      t.caricamentoDatiInCorsoPointLayerInfo = true;

      this.staElaborandoPLI = true;

      this.stringaRitorno = '';
      this.stringaAppoggio = '';
      this.staLeggendo = true;
      t.caricamentoPLI = true;
      this.esci = false;

      this.leggeLayers(t, coord2);

      if (t.debug2 === true) {
        // logConsole('Point Layer Info interno. Ritornato da legge layers');
      }

      let c = 0;

      const intr = setInterval(() => {
        if (t.debug2 === true) {
          // logConsole('Point Layer Info interno. Attesa per termine lettura', this.staLeggendo);
        }
        if (this.staLeggendo === false) {
          clearInterval(intr);

          if (this.stringaAppoggio.length > 0 && this.esci === false) {
            this.stringaRitorno = '[' + this.stringaAppoggio.substring(0, this.stringaAppoggio.length - 2) + ']';
            // logConsole(this.stringaRitorno);            

            const tms = t.datePipe.transform(t.dateTo, 'yyyy-MM-dd HH:mm:ss'); // .Utils.tmsFine; // t.timeRangeDSFStop2;

            const params = '{' +
              '"cntx_id": "' + t.sessionService.getToken() + '",' +
              '"v_point_layer_features_list": ' + this.stringaRitorno + ','  +
              '"v_tms": "' + tms + '"' +
            '}'
            if (t.debug2 === true) {
              // logConsole('Ritorno letture Layers: ', params);
            }
            // logConsole('Ritorno letture Layers: ', params);
            this.apiService.chiamataPost('geo_point_layer_list__grid', JSON.parse(params))
            // .map(response => response)
            .subscribe(data2 => {
              if (data2 && data2.headers) {
                const head = data2.headers.get('server');
                // // logConsole(data, head);
              }
              try {
                // const data2 = data.json();
                Utils.checkRitornoChiamata(t, data2);
                if (data2 && data2 !== null) {
                 t.frameName2 = data2.GridProperty[0].GridName;

                  // const data = data2; // [0].geo_measure_dfn__grid);
                  // // logConsole('Point info:', t.datiPointMeasures, data2);
                  if (t.datiPointLayerInfo && t.datiPointLayerInfo.DataTable && data2.DataTable) {
                    // // logConsole('Aggiorno valori');
                    t.datiPointLayerInfo.DataTable = data2.DataTable;
                    // t.effettuaAutoFitPM = !t.effettuaAutoFitPM;
                  } else {
                    // // logConsole('Riscrivo valori');
                    t.datiPointLayerInfo = data2;
                    t.effettuaAutoFitPLI = !t.effettuaAutoFitPLI;
                  }
                }
              } catch (e) {

              }

              t.caricamentoPLI = false;
              this.staElaborandoPLI = false;
            });
          } else {
            this.staElaborandoPLI = false;
            t.caricamentoPLI = false;
          }
        } else {
          c++;
          if (c > 15) {
            t.caricamentoDatiInCorsoPointLayerInfo = false;
            this.staElaborandoPLI = false;
            t.caricamentoPLI = false;

            clearInterval(intr)

            if (t.debug2 === true) {
              // logConsole('Uscita attesa');
            }
          }
        }
      }, 1000);
      /*
      this.apiService.chiamataPost(t.Utils, 'geo_point_layer_list__grid', params)
      // .map(response => response.json())
      .subscribe(data2 => {
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        this.staElaborandoPLI = false;
        t.caricamentoDatiInCorsoPointMeasures = false;
        if (data2 && data2 !== null) {
          // const data = data2; // [0].geo_measure_dfn__grid);
          // // logConsole('Point info:', t.datiPointMeasures, data2);
          if (t.datiPointMeasures && t.datiPointMeasures.DataTable && data2.DataTable) {
            // // logConsole('Aggiorno valori');
            t.datiPointMeasures.DataTable = JSON.parse(JSON.stringify(data2.DataTable));
            // t.effettuaAutoFitPM = !t.effettuaAutoFitPM;
          } else {
            // // logConsole('Riscrivo valori');
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
    } else {
      this.staElaborandoPLI = false;
    }
  }

  private async leggeLayers(t, coord2) {
    let url = '';
    let lat1 = +coord2[0] - .01;
    let lat2 = +coord2[0] + .01;
    let lng1 = +coord2[1] - .01;
    let lng2 = +coord2[1] + .01;
    let indirizzo = t.Utils.indirizzoGEOServer;
    let nomeLayer = '';
    let nomiLayers = new Array();

    if (t.debug2 === true) {
      // logConsole('Point Layer Info interno. Legge layers: ', coord2, indirizzo, t.datiAddLayers);
    }

    if (t.datiAddLayers) {
      t.datiAddLayers.forEach(async element => {
        let nomeLayer2 = element.CODE_STR;
        if (nomeLayer2.toUpperCase().indexOf('GLOBAL LAYER') === -1 && nomeLayer2.toUpperCase().indexOf('HTTP') === -1 && nomeLayer2.length > 5) {
          if (nomeLayer2.toUpperCase().indexOf('CELL_ENH') > -1) {
          // if (nomeLayer2.toUpperCase().indexOf('LAYERS=') > -1 && nomeLayer2.toUpperCase().indexOf('GEO_ANTS') > -1 && nomeLayer2.toUpperCase().indexOf('CELL_ENH') > -1) {
            // nomeLayer2 = nomeLayer2.substring(nomeLayer2.toUpperCase().indexOf('LAYERS=') + 7, nomeLayer2.length);
            // // logConsole(element.CODE_STR);
            const indirizzo2 = nomeLayer2.replace('?', '&');
            nomeLayer += indirizzo2 + ',';
            // // logConsole(indirizzo2);
            nomiLayers.push(indirizzo2);
          }
        }
      });
    }

    if (t.debug2 === true) {
      // logConsole('Point Layer Info interno. Nome layer:', nomeLayer, t.dateTo);
    }

    if (nomeLayer.length > 0) {
      nomeLayer = nomeLayer.substring(0, nomeLayer.length - 1);
      let tms = t.datePipe.transform(t.dateTo, 'yyyy-MM-dd HH:mm:ss'); // .Utils.tmsFine + 'Z'; // t.timeRangeDSFStop2 + 'Z';
      tms = tms.replace(' ', 'T');
      if (tms.indexOf('Z') === -1 ) { tms += 'Z'; }

      url = indirizzo + environment.urlBaseGS +  '/wms?' +
        'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fjpeg&TRANSPARENT=true&' +
        'QUERY_LAYERS=' + nomeLayer + '&STYLES&exceptions=application%2Fvnd.ogc.se_inimage&time=' + tms + '&' +
        'VIEWPARAMS=cntx_id:\'' + t.sessionService.getToken() + '\'&' +
        'TRANSPARENT=true&LAYERS=' + nomeLayer + '&INFO_FORMAT=text/plain&FEATURE_COUNT=50&TILED=false&' +
        '&SRS=EPSG%3A4326&WIDTH=2&HEIGHT=2&X=1&Y=1&&BBOX=' + lat1 + ',' + lng1 + ',' + lat2 + ',' + lng2 + '&TipoChiamata=Interna';
      if (this.lastUrl === url) {
        this.esci = true;
        this.staLeggendo = false;

        t.caricamentoDatiInCorsoPointLayerInfo = false;
        return;
      }
      this.lastUrl = url;
      // const c = await this.downloadJSON(url);

      t.clickPerAnimazione = coord2[0] + ';' + coord2[1];

      this.http.get(
        url,
        { responseType: 'blob' as 'json', observe: 'response' }
        ).subscribe(data => {
        if (data) {
          this.continua(t, data, tms);
        } else {
          t.caricamentoDatiInCorsoPointLayerInfo = false;
        }
      });
    } else {
      if (t.debug2 === true) {
        // logConsole('Point Layer Info interno. Uscita da lettura layer per mancanza di layers: ' + nomeLayer);
      }

      this.esci = true;
      this.staLeggendo = false;

      t.caricamentoDatiInCorsoPointLayerInfo = false;
    }
  }

  async continua(t, c, tms) {
      const hh = c['headers'].get('warning');
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
      // const cc = c['_body'];
      const cc = await new Response(c.body).text()

      // // logConsole(warnings);

      if (cc.indexOf('ServiceException') !== -1) {
        /* if (t.debug2 === true) {
          // logConsole(element);
          // logConsole(url);
          // logConsole('Errore nella chiamata', cc);
        } */
        t.rimuoviAnimazione = new Date();
      } else {
        const cc2 = cc.split('\n');
        // // logConsole(cc2);
        let nomeLayer = '';
        let idx = 0;
        cc2.forEach(element => {
          let ok = true;

          if (element.toUpperCase().indexOf('RESULTS FOR FEATURETYPE') > -1) {
            nomeLayer = element;
            // // logConsole(nomeLayer);
            nomeLayer = nomeLayer.substring(nomeLayer.indexOf('GeoAnts:') + 8, nomeLayer.length - 2);
            // // logConsole(nomeLayer);
            idx = 0;
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
                  if (t.debug2 === true) {
                    // logConsole('Trovato layer tms:', element.layer, element.time);
                  }
                  tu = element.time;
                  ok = true;
                }
              });
              /* if (!ok) {
                if (t.debug2 === true) {
                  // logConsole('NON Trovato layer tms:', warnings, nomeLayer.toUpperCase().trim());
                }
              } */

              if (name.indexOf('GRAY_INDEX') > -1) {
                if (value !== '4.29495587E8') {
                  // if (nomeLayer.indexOf('campo') === -1) {
                    this.stringaAppoggio += '{ "layer_name": "' + nomeLayer + '", "feature_idx": ' +
                      idx + ', "property_name": "' + name + '", "value": ' + value +
                      ', "time_used": "' + tu + '" }, ';
                  // }
                }
              }

              idx++;
            }
          }
        });

        this.staLeggendo = false;

        if (t.debug2 === true) {
          // logConsole('Point Layer Info interno. Termine lettura', this.staLeggendo);
        }

        t.rimuoviAnimazione = new Date();

        /* const cc2 = JSON.parse(cc);
        // // logConsole(cc2);
        const feat = cc2.features;
        let indice = 0;
        let rottura = 0;
        feat.forEach(element2 => {
          let idx = 0;
          let prop = JSON.stringify(element2.properties);
          // // logConsole(prop);
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
          // // logConsole(element2.properties, prop, stringaRitorno);
          // layer_name text, feature_idx int, property_name text, value text);
        }); */
      }
  }

  private downloadJSON(url) {
    return this.downloadBlob(url);
  }

  async downloadBlob(url) {
    const r = await this.http.get(url, this.headers).toPromise();
    // // logConsole(r);
    return r;
  }

}

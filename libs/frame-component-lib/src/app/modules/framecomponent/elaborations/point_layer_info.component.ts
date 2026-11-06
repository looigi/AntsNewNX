import { logConsole } from '../console-log';
import { HttpClient } from '@angular/common/http';
import { ExternalApiService } from './../services/externalapi.service';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {transform} from 'ol/proj';
import ExternalUtilities from '../ExternalUtilities.component';
// import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FineRichieste } from './fine-richieste';
// import { splitAtColon } from '@angular/compiler/src/util';
// import Utils from '../Utilities.component';

@Injectable()
export class PointLayerInfoComponent {
  destroy$ = new FineRichieste();

  // lastCallPLI = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  // private destroy$ = new Subject<void>();

  staElaborandoPLI = [false, false, false, false, false, false, false, false, false, false, false];
  // ultimaVoltaTMS = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  staLeggendo = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  stringaAppoggio = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  stringaRitorno = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // resp = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  lastUrl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  esci = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

  constructor(
    private http: HttpClient,
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.errorePLI[t.NumeroFrame2] = '';
    t.lastCallPLI[t.NumeroFrame2] = '';
    // t.ultimaVoltaTMSPLI[t.frameAttivo2] = -1;
    t.datiPointLayerInfo = 'empty grid';
    t.vecchiDatiPLI = undefined;
    this.staElaborandoPLI[t.NumeroFrame2] = false;

    const nome = 'gridPointLayerInfo_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  prendePointLayerInfo(t, coordinate) {
    logConsole('PLI 1', coordinate);

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    logConsole('PLI 2', t.MappaOGrafico2);
    
    if (t.MappaOGrafico2 !== 'PL') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Point Layer Info', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prende Point measures', t.NumeroFrame, tms);
    /* if (this.staElaborandoPLI[t.NumeroFrame2] === true) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point Layer Info. Già sta elaborando');
      }
      return;
    } */

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - t.PLI[t.frameAttivo2] < t.ritardoPerFunzioni && t.ultimaVoltaTMSPLI[t.frameAttivo2] !== -1) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point Layer Info. Troppo poco tempo');
      }
      return;
    }
    t.ultimaVoltaTMSPLI[t.frameAttivo2] = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, ExternalUtilities.layersRilevati);

    // let lista = '';
    let coord2 = [+coordinate[0], +coordinate[1]];
    if (coord2[0] > 200) {
      coord2 = transform(coord2, 'EPSG:3857', 'EPSG:4326');
    }

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const actualCall1 = 'POINTLI;' + coord2[0] + ';' + coord2[1]; // + tms + ';' + agnact + ';' + sla + ';' + valoriDiBase + ';' + daTcRun;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point Layer Info. Chiamata', t.NumeroFrame, actualCall1);
    }

    if (t.datiPointLayerInfo && typeof(t.datiPointLayerInfo) === 'string') {
      if (t.datiPointLayerInfo.indexOf('ERROR: ') > -1) {
        t.datiPointLayerInfo = undefined;
        t.lastCallPLI[t.NumeroFrame2] = undefined;
      }
    }
    
    logConsole('PLI 3', actualCall1);
    
    if (t.lastCallPLI[t.NumeroFrame2] !== actualCall1) {
      t.lastCallPLI[t.NumeroFrame2] = actualCall1;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point Layer Info. Eseguo lettura', t.NumeroFrame, actualCall1);
      }

      t.caricamentoDatiInCorsoPointLayerInfo[t.NumeroFrame2] = true;

      this.staElaborandoPLI[t.NumeroFrame2] = true;

      this.stringaRitorno[t.NumeroFrame2] = '';
      this.stringaAppoggio[t.NumeroFrame2] = '';
      this.staLeggendo[t.NumeroFrame2] = true;
      t.caricamentoPLI[t.NumeroFrame2] = true;
      this.esci[t.NumeroFrame2] = false;
      t.errorePLI[t.NumeroFrame2] = '';

      this.leggeLayers(t, coord2);

      const intr = setInterval(() => {
        if (this.staLeggendo[t.NumeroFrame2] === false) {
          clearInterval(intr);

          if (this.stringaAppoggio[t.NumeroFrame2].length > 0 && this.esci[t.NumeroFrame2] === false) {
            this.stringaRitorno[t.NumeroFrame2] = '[' + this.stringaAppoggio[t.NumeroFrame2].substring(0, this.stringaRitorno[t.NumeroFrame2].length - 2) + ']';

            const tms = t.Utils.tmsFine; // t.timeRangeDSFStop2;

            const params = '{' +
              '"cntx_id": "' + t.sessionID2 + '",' +
              '"v_point_layer_features_list": ' + this.stringaRitorno[t.NumeroFrame2] + ','  +
              '"v_tms": "' + tms + '"' +
            '}'
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno letture Layers: ', params);
            }
            // logConsole('Lettura layers', params);
            
            t.paramsPerSS[t.NumeroFrame2] = params;
            t.queryPerSS[t.NumeroFrame2] = 'geo_point_layer_list__grid';

            t.lastCallPLI2[t.NumeroFrame2] = JSON.parse(params);
            this.apiService.chiamataPost(t.Utils, 'geo_point_layer_list__grid', JSON.parse(params))
            // .map(response => response)
            .pipe(takeUntil(this.destroy$.per(t)))
            .subscribe((data2: any) => {
              if (data2.v_grid_msg !== undefined) {
                t.messaggioWarningPLI = data2.v_grid_msg;
              } else {
                t.messaggioWarningPLI = '';
              }

              if (data2.message) {
                t.errorePLI[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
                t.caricamentoPLI[t.NumeroFrame2] = false;
                this.staElaborandoPLI[t.NumeroFrame2] = false;
                t.datiPointLayerInfo = undefined;
              } else {
                if (data2 && data2.headers) {
                  const head = data2.headers.get('server');
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data, head);
                }
                try {
                  // const data2 = data.json();
                  if (t.debug2 === true) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Letture layers: ', data2);
                  }
                  ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);
                  if (data2 && data2 !== null) {
                    if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
                      t.gridTitlePL = data2.GridProperty[0].GridName;
                    }

                    // const data = data2; // [0].geo_measure_dfn__grid);
                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info:', t.datiPointMeasures, data2);
                    t.vecchiDatiPLI = data2;

                    if (t.datiPointLayerInfo && t.datiPointLayerInfo.DataTable && data2.DataTable) {
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiorno valori');
                      t.datiPointLayerInfo.DataTable = data2.DataTable;
                      // t.effettuaAutoFitPM = !t.effettuaAutoFitPM;
                    } else {
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Riscrivo valori');
                      t.datiPointLayerInfo = undefined;
                      const tm = setTimeout(() => {
                        clearTimeout(tm);
                        t.datiPointLayerInfo = data2;
                        const tm1 = setTimeout(() => {
                          clearTimeout(tm1);
                          t.effettuaAutoFitPLI = !t.effettuaAutoFitPLI;
                        }, 500);
                      }, 500);
                    }
                  }
                } catch (e) {

                }
              }

              t.caricamentoPLI[t.NumeroFrame2] = false;
              this.staElaborandoPLI[t.NumeroFrame2] = false;
            }, error => {
              this.staElaborandoPLI[t.NumeroFrame2] = false;
              t.caricamentoPLI[t.NumeroFrame2] = false;
              t.lastCallPLI[t.NumeroFrame2] = '';
              // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
              t.datiPointLayerInfo = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
            });
          } else {
            this.staElaborandoPLI[t.NumeroFrame2] = false;
            t.datiPointLayerInfo = undefined;
            const tm = setTimeout(() => {
              clearTimeout(tm);

              t.datiPointLayerInfo = t.vecchiDatiPLI;
            }, 500);

            t.caricamentoPLI[t.NumeroFrame2] = false;
          }
        }
      }, 1000);
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
    } else {
      this.staElaborandoPLI[t.NumeroFrame2] = false;
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
    /* let daIncludere = t.lastSelectedLayer2;
    if (daIncludere && daIncludere.LAYER_NAME && daIncludere.LAYER_NAME.indexOf('_') > -1) {
      const d = daIncludere.LAYER_NAME.split('_');
      daIncludere = d[0] + '_' + d[1] + '_' + d[2] + '_' + d[3];
    } else {
      daIncludere = '';
    }
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Layers da includere:', daIncludere);
    } */

    if (t.datiAddLayers2) {
      t.datiAddLayers2.DataTable.forEach(async element => {
        let nomeLayer2 = element.CODE_STR;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeLayer2);
        if (nomeLayer2.toUpperCase().indexOf('GLOBAL LAYER') === -1 &&
          nomeLayer2.toUpperCase().indexOf('HTTP') === -1 &&
          nomeLayer2.length > 5) {
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

    if (nomeLayer.length > 0) {
      nomeLayer = nomeLayer.substring(0, nomeLayer.length - 1);
      let tms = t.Utils.tmsFine + 'Z'; // t.timeRangeDSFStop2 + 'Z';
      tms = tms.replace(' ', 'T');

      url = indirizzo + environment.urlBaseGS +  '/wms?' +
        'SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fjpeg&TRANSPARENT=true&' +
        'QUERY_LAYERS=' + nomeLayer + '&STYLES&exceptions=application%2Fvnd.ogc.se_inimage&time=' + tms + '&' +
        'VIEWPARAMS=cntx_id:\'' + t.sessionID2 + '\'&' +
        'TRANSPARENT=true&LAYERS=' + nomeLayer + '&INFO_FORMAT=text/plain&FEATURE_COUNT=50&TILED=false&' +
        '&SRS=EPSG%3A4326&WIDTH=2&HEIGHT=2&X=1&Y=1&&BBOX=' + lat1 + ',' + lng1 + ',' + lat2 + ',' + lng2 + '&TipoChiamata=1';
      if (this.lastUrl[t.NumeroFrame2] === url) {
        this.esci[t.NumeroFrame2] = true;
        this.staLeggendo[t.NumeroFrame2] = false;

        return;
      }
      this.lastUrl[t.NumeroFrame2] = url;
      // const c = await this.downloadJSON(url);

      this.http.get(
        url,
        { responseType: 'blob' as 'json', observe: 'response' }
        )
        .pipe(takeUntil(this.destroy$.per(t)))
        .subscribe((data: any) => {
        if (data) {
          this.continua(t, data, tms);
          this.staLeggendo[t.NumeroFrame2] = false;
        }
      });
    }
  }

  async continua(t, c, tms) {
      const hh = c['headers'].get('warning');
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Header:', hh);
      }
      let warnings = new Array();
      // if (c && c.headers) {
        // const hh = c.headers.get('warning');
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

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, warnings);

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
          cc2.forEach(element => {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
            let ok = true;

            if (element.toUpperCase().indexOf('RESULTS FOR FEATURETYPE') > -1) {
              nomeLayer = element;
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeLayer);
              nomeLayer = nomeLayer.substring(nomeLayer.indexOf('GeoAnts:') + 8, nomeLayer.length - 2);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeLayer);
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
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Trovato layer tms:', element.layer, element.time);
                    }
                    tu = element.time;
                    ok = true;
                  }
                });
                /* if (!ok) {
                  if (t.debug2 === true) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NON Trovato layer tms:', warnings, nomeLayer.toUpperCase().trim());
                  }
                } */

                let ok2 = true;
                /* if (daIncludere !== '') {
                  if (nomeLayer.indexOf(daIncludere) === -1) {
                    ok2 = false;
                  }
                } */
                if (ok2) {
                  /* t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'name' , name);
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'value' , value);
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'nomeLayer' , nomeLayer); */

                  if (name.indexOf('GRAY_INDEX') > -1) {
                    if (value !== '4.29495587E8') {
                      // if (nomeLayer.indexOf('campo') === -1) {
                        this.stringaAppoggio[t.NumeroFrame2] += '{ "layer_name": "' + nomeLayer + '", "feature_idx": ' +
                          idx + ', "property_name": "' + name + '", "value": ' + value +
                          ', "time_used": "' + tu + '" }, ';

                        idx++;
                      // }
                    }
                  }
                }
              }
            }
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
      // }
    }
}

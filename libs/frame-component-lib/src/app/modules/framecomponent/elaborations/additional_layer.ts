import { logConsole } from '../console-log';
// import { environment } from './../../../../environments/environment';
import { ExternalApiService } from './../services/externalapi.service';
// import ImageLayer from 'ol/layer/Image';
// import ImageWMS from 'ol/source/ImageWMS';

import TileWms from 'ol/source/TileWMS';
import {Tile as TileLayer} from 'ol/layer.js';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import {ImageArcGISRest, OSM} from 'ol/source';
// import { STRING_TYPE } from '@angular/compiler';

@Injectable()
export class AdditionalLayerComponent {
  // lastCallAL = undefined; // ['', '', '', '', '', '', '', '', '', '', '']
  // lastCallAL2 = undefined; // ['', '', '', '', '', '', '', '', '', '', '']
  // timer = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  destroy$ = new FineRichieste();

  staAttendendo = false;

  constructor(
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.lastCallAL[t.NumeroFrame2] = '';
    t.lastCallAL2[t.NumeroFrame2] = '';
    t.timer[t.NumeroFrame2] = undefined;
  }

  disegnaAddLayers(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da disegnaAddLayers per NON tipo mappa', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Inizio');

    if (t.eseguitoInProgetto2 === false && t.MappaOGrafico2 !== 'M' && !t.map1[t.NumeroFrame2]) {
      if (t.MappaOGrafico2 !== undefined && t.MappaOGrafico2 !== 'undefined') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Esco per tipo mappa o mappa non presente', t.MappaOGrafico2, t.map1[t.NumeroFrame2]);

        return;
      } else {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Frame di tipo non valido', t.NumeroFrame2, t.MappaOGrafico2, t.map1[t.NumeroFrame2]);
        // return;
      }
    }

    // logConsole('Add layer', t.showAdditonalLayers2);

    if (t.showAdditionalLayers2 === false) {
      t.lastCallAL[t.NumeroFrame2] = '';
      // AdditionalLayerComponent.lastCallAL2[t.NumeroFrame2] = '';

      let qq = 0;
      t.layersAgg.forEach(element2 => {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Rimuovo layer 1 ' + qq, element2);

        t.removeLayerFromMap('Additional Layer ' + qq + ' per check', element2);
        element2 = undefined;
        qq++;
      });
    } else {
      this.disegnaAddLayers2(t);
    }
  }

  disegnaAddLayersDiretto(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (!t.map1[t.NumeroFrame2]) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per mappa non esistente', t.NumeroFrame2);

      return;
    }

    if (!t.additionalLayerMisura || t.additionalLayerMisura === '' || t.additionalLayerMisura === null || t.additionalLayerMisura === 'null'
        || t.additionalLayerMisura === undefined || t.additionalLayerMisura === 'undefined') {
      this.disegnaAddLayersDiretto2(t, '');
    } else {
      const sla = ExternalUtilities.tornaSla(t);
      const params = {
        cntx_id: t.sessionID2,
        v_geo_sla_name: sla,
        v_geo_measure_dfn_code: t.additionalLayerMisura
      };
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'geo_sla_thr__sel';

      this.apiService.chiamataPost(t.Utils, 'geo_sla_thr__sel', params)
      // .map(response => { t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, response); return response; })
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, data2);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);
        const csv = data2;
        if (csv?.length > 0) {
          let env = '';
          env += 'thr_value_1:' + csv[0].thr_value_1 + ';';
          env += 'thr_value_2:' + csv[0].thr_value_2 + ';';
          env += 'thr_value_3:' + csv[0].thr_value_3 + ';';
          env += 'thr_value_4:' + csv[0].thr_value_4 + ';';

          this.disegnaAddLayersDiretto2(t, env);
        }
      });
    }
  }

  disegnaAddLayersDiretto2(t, env) {
    const indirizzo = t.additionalLayerDiretto2;

    let tms = t.additionaLayerTmsMax2; // t.Utils.tmsFine;
    if (tms.indexOf('Z') === -1) {
      tms += 'Z';
    }
    tms = tms.replace(' ', 'T');

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno additional layer diretto', indirizzo, tms);
    }

    if (t.layersAggDir[t.NumeroFrame2]) {
      t.removeLayerFromMap('Additonal layer diretto', t.layersAggDir[t.NumeroFrame2]);
      t.layersAggDir[t.NumeroFrame2] = undefined;
    }

    if (t.additionalLayerDiretto2 === 'NONE') {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno additional layer diretto. Esco per valore NONE');
      }
      return;
    }

    // if (indirizzo.toUpperCase().indexOf('HTTP') === -1) {

      let indirizzo2 = '';
      if (indirizzo.toUpperCase().indexOf('HTTP') === -1) {
        indirizzo2 = t.Utils.indirizzoGEOServer + 'Geo_ANTS/wms?service=WMS&version=1.1.0&request=GetMap&layers=' + indirizzo.replace('?', '&');
      } else {
        indirizzo2 = indirizzo;
      }

      let par = undefined;

      if (env !== '') {
        par = {
          TILED: true,
          TIME: tms,
          ENV: env,
          VIEWPARAMS: 'cntx_id:\'' + t.sessionID2 + '\';'
        };
      } else {
        par = {
          TILED: true,
          TIME: tms,
          VIEWPARAMS: 'cntx_id:\'' + t.sessionID2 + '\';'
        };
      }

      const wms = new TileWms({
        url: indirizzo2,
        projection: 'EPSG:4326',
        // preload: Infinity,
        // renderer: 'antialias: true;',
        params: par,
        serverType: 'geoserver'
      });
      t.layersAggDir[t.NumeroFrame2] = new TileLayer({
        source: wms,
        opacity: t.opacity2 / 100
      });
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Caricato wms');
    /* } else {
      t.layersAggDir =
        new TileLayer({
          // preload: Infinity,
          source: new ImageArcGISRest({
            ratio: 1,
            params: {
              TILED: true,
              TIME: tms
            },
            url: indirizzo,
          }),
          opacity: t.opacity2 / 100
      });
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Caricato ArcGIS');
    } */

    // t.map1[t.NumeroFrame2].addLayer(t.layersAgg[q]);
    t.addLayerToMap(t.layersAggDir[t.NumeroFrame2], 3, 'LayerAggiuntivo Diretto:' + indirizzo);
  }

  disegnaAddLayers2(t) {
    t.pendings += 'Additional Layers<br />';
    /* const diff = new Date().getTime() - t.ultimoDisegnoAddLayer;
    if (diff < 1000) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Esco, troppo rapido');
      }
      return;
    }
    t.ultimoDisegnoAddLayer = new Date().getTime(); */
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno layers addizionali', t.NumeroFrame, t.addLayers2);
    if (t.addLayers2 && t.addLayers2 !== '' && typeof(t.addLayers2) === 'string') {
      try {
        t.addLayers2 = JSON.parse(t.addLayers2);
      } catch (e) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nel parse', t.addLayers2);
      }
    }

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Layers aggiuntivi', t.addLayers2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Layer aggiuntivo drawer', t.additionalLayer2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Check layer drawer', t.addGlobalLayer2);
    }

    // const layersAggInterni = [ undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    //   undefined, undefined, undefined, undefined, undefined ];
    let q = 0;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Layers additional generali prima', t.addLayers2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Layer globale', t.additionalLayer2);
    }

    if (t.eseguitoInProgetto2 === true) {
      // t.addLayers2 = new Array();
      let ok = false;
      if (t.addLayers2) {
        t.addLayers2.forEach(element => {
          if (element.VALUE_STR.toUpperCase() === '<GLOBAL LAYER>') {
            ok = true;
          }
        });
      } else {
        t.addLayers2 = new Array();
      }
      if (!ok) {
        const e = { VALUE_STR: '<GLOBAL LAYER>', CODE: 10 };
        t.addLayers2.push(e);
      }
    }

    if (t.addLayers2) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.addLayers2);
      const addLayers3 = new Array();

      t.addLayers2.forEach(element => {
        if (element) {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers. Layer selezionato:', element);
          }
          if (element.VALUE_STR === '<GLOBAL LAYER>') {
            if (t.additionalLayer2) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers. Layer selezionato globale:', t.additionalLayer2);
              }
              if (t.additionalLayer2.VALUE_STR.toUpperCase() === '<SELECTED LAYER>') {
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Rilevato selected layer. Tento di impostare l\'ultimo selezionato', t.lastSelectedLayer2);
                }
                if (t.lastSelectedLayer2) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati per ricerca', t.datiAddLayers2)
                  t.datiAddLayers2.DataTable.forEach(element => {
                    if (element.CODE_STR === t.lastSelectedLayer2.LAYER_NAME) {
                      addLayers3.push(element);
                      if (t.debug2 === true) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Rilevato selected layer e layer', element);
                      }
                    }
                  });
                }
              } else {
                addLayers3.push(t.additionalLayer2);
              }
            }
          } else {
            if (element.VALUE_STR.toUpperCase() === '<SELECTED LAYER>') {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Rilevato selected layer. Tento di impostare l\'ultimo selezionato', t.lastSelectedLayer2);
              }
              if (t.lastSelectedLayer2) {
                if (t.lastSelectedLayer2.LAYER_NAME !== 'NONE') {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati per ricerca', t.datiAddLayers2)
                  t.datiAddLayers2.DataTable.forEach(element => {
                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ricerca: ', element.CODE_STR, t.lastSelectedLayer2.LAYER_NAME);
                    if (element.CODE_STR === t.lastSelectedLayer2.LAYER_NAME) {
                      addLayers3.push(element);
                      if (t.debug2 === true) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Rilevato selected layer e layer', element);
                      }
                    }
                  });
                }
              }
            } else {
              addLayers3.push(element);
            }
          }
        }
      });

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Layers additional generali', addLayers3, addLayers3.length);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Tms ', t.timeRangeDSFStop2);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Riga selezionata ', t.cellaSelezionata2);
      }

      if (!t.timeRangeDSFStop2) {
        const d = new Date();
        d.setDate(d.getDate() - 1);

        let d1 = t.datePipe.transform(d, 'yyyy-MM-dd');
        d1 += ' 00:00:00';
        let d2 = t.datePipe.transform(new Date(), 'yyyy-MM-dd', 'UTC');
        d2 += ' 23:59:59';

        const dd1 = new Date(d1);
        const dd2 = new Date(d2);

        t.timeRangeDSFStart2 = t.datePipe.transform(dd1, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        t.timeRangeDSFStop2 = t.datePipe.transform(dd2, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
      }

      t.listaLayersDaVisualizzare = '';

      /* if (AdditionalLayerComponent.lastCallAL[t.NumeroFrame2] === '') {
        t.layersAgg.forEach(element => {
          if (element && element !== undefined && t.map1[t.NumeroFrame2]) {
            t.map1[t.NumeroFrame2].removeLayer(element);
            element = undefined;
          }
        });
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: pulisco vecchi layers');
        }
      // } */

      if (!t.map1[t.NumeroFrame2]) {
        t.pendings.replace('Additional Layers<br />', '');
        return;
      }

      let str = JSON.stringify(t.cellaSelezionata2);
      addLayers3.forEach(element => {
        str += element.CODE_STR + ';';
      });
      str += t.opacity2 + ';';
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Stringa di confronto', str);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Vecchia Stringa di confronto', t.lastCallAL[t.NumeroFrame2]);
        /* if (JSON.stringify(t.addLayers2).indexOf('<GLOBAL LAYER>') > -1) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Passo lo stesso perché è un global layer');
        } */
        // return;
      }

      if (t.lastCallAL[t.NumeroFrame2] === str && JSON.stringify(t.addLayers2).indexOf('<GLOBAL LAYER>') === -1) {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Esco per stringa uguale', str);
        }
        t.pendings.replace('Additional Layers<br />', '');
        return;
      }
      t.lastCallAL[t.NumeroFrame2] = str;

      q = 0;
      let measure = '';

      if (t.lastSelectedLayer2 && t.lastSelectedLayer2.LAYER_NAME === 'NONE') {
        let qq = 0;
        t.layersAgg.forEach(element2 => {
          if (element2) {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayer. Rimuovo layer 2 ' + qq + '/' + (t.layersAgg.length - 1), element2);
            }
            t.removeLayerFromMap('Additional Layer ' + qq, element2);
            element2 = undefined;
          }
          qq++;
        });
        return;
      }

      addLayers3.forEach(element => {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Layer da caricare:', element);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Cella selezionata:', t.cellaSelezionata2);
        }

        if (element !== undefined && element.CODE_STR !== undefined && element.CODE_STR !== '#') {
          let indirizzo = element.CODE_STR;
          let indirizzo2 = element.VALUE_STR;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Indirizzo:', indirizzo2);
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Indirizzo <:', indirizzo2.indexOf('<'));
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers: Indirizzo >:', indirizzo2.indexOf('>'));
          }

          if (indirizzo2.indexOf('<') > -1 && indirizzo2.indexOf('>') > -1) {
            if (t.cellaSelezionata2) {
              let band = t.cellaSelezionata2.BAND;
              let tech = t.cellaSelezionata2.CELL_TECH;
              if (!band || band === null) { band = ''; }
              if (!tech || tech === null) { tech = ''; }

              indirizzo2 = indirizzo2.replace('<Cell Tech>', tech);
              indirizzo2 = indirizzo2.replace('<Band>', band);

              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Layer da ricercare: ', indirizzo2);
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Lista dei layers: ', t.datiAddLayers2);
              }

              let indirizzoRit = '';
              let ok = false;

              if (t.datiAddLayers2) {
                t.datiAddLayers2.DataTable.forEach(element2 => {
                  if (!ok) {
                    if (element2.VALUE_STR.trim().toUpperCase() === indirizzo2.trim().toUpperCase()) {
                      indirizzoRit = element2.CODE_STR;
                      indirizzo2 = element2.VALUE_STR;
                      measure = element2.MEASURE_CODE;

                      ok = true;
                    }
                  }
                });
              }
              if (!ok) { indirizzo2 = ''; } else { indirizzo = indirizzoRit; }

              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Layer rilevato: ', indirizzo2);
              }

            } else {
              indirizzo2 = '';
            }
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Layer da ricercare: ', indirizzo2);
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Lista dei layers: ', t.datiAddLayers2);
            }
            if (t.datiAddLayers2) {
              let ok = false;
              t.datiAddLayers2.DataTable.forEach(element2 => {
                if (!ok) {
                  if (element2.VALUE_STR.trim().toUpperCase() === indirizzo2.trim().toUpperCase()) {
                    measure = element2.MEASURE_CODE;

                    ok = true;
                  }
                }
              });
            }
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Misura rilevata: ', measure);
            }
          }

          if (indirizzo2 !== '') {
            t.listaLayersDaVisualizzare += indirizzo2 + ', ';

            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers lista da visualizzare', t.listaLayersDaVisualizzare);
            }

           /* if (t.listaLayersDaVisualizzare === AdditionalLayerComponent.lastCallAL2[t.NumeroFrame2]) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers. Esco per lista vecchia uguale');
              }
              // return;
            } else {
              AdditionalLayerComponent.lastCallAL2[t.NumeroFrame2] = t.listaLayersDaVisualizzare; */

              let tms; // t.timeRangeDSFStop2;
              if (t.eseguitoInProgetto2 === true) {
                tms = t.timeRangeDSFStop2;
              } else {
                tms = t.Utils.tmsFine;
              }
              if (tms) {
                if (tms.indexOf('Z') === -1) {
                  tms += 'Z';
                }
                tms = tms.replace(' ', 'T');
              }
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers. TMS: ', t.eseguitoInProgetto2, tms, t.Utils.tmsFine, t.timeRangeDSFStop2);
              }

              if (!t.opacity2 || t.opacity2 === null) {
                t.opacity2 = 30;
              }

             /* if (t.layersAgg[q] && t.layersAgg[q] !== undefined && t.map1[t.NumeroFrame2]) {
                t.map1[t.NumeroFrame2].removeLayer(t.layersAgg[q]);
                t.layersAgg[q] = undefined;
              } */

              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers. Disegno layer:', indirizzo);
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers. Opacità:', t.opacity2);
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers. TMS:', tms);
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Misura: ', measure);
              }

              const sla = ExternalUtilities.tornaSla(t);
              const params = {
                cntx_id: t.sessionID2,
                v_geo_sla_name: sla,
                v_geo_measure_dfn_code: measure
              };

              /* if (t.lastCallAL2[t.NumeroFrame2] === JSON.stringify(params) && t.eseguitoInProgetto2 === false) {
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers. Esco per ultima chiamata 2 uguale');
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers. Vecchia chiamata', t.lastCallAL2[t.NumeroFrame2]);
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers. Nuova chiamata', JSON.stringify(params));
                }
                return;
              } */
              t.lastCallAL2[t.NumeroFrame2] = JSON.stringify(params);

              if (q === 0) {
                let qq = 0;
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayer. Layer da rimuovere:', t.layersAgg);
                }
                t.layersAgg.forEach(element2 => {
                  if (element2) {
                    if (t.debug2 === true) {
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayer. Rimuovo layer 3 ' + qq + '/' + (t.layersAgg.length - 1), element2);
                    }
                    t.removeLayerFromMap('Additional Layer ' + qq, element2);
                    element2 = undefined;
                  }
                  qq++;
                });
              }

              this.apiService.chiamataPost(t.Utils, 'geo_sla_thr__sel', params)
              // .map(response => { return response; })
              .pipe(takeUntil(this.destroy$.per(t)))
              .subscribe((data2: any) => {
                // const data2 = JSON.parse(data);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, data2);
                ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

                if (t.layersAgg[q]) {
                  t.removeLayerFromMap('Layer Aggiuntivo: ' + indirizzo, t.layersAgg[q]);
                }

                const csv = data2;
                if (csv?.length > 0) {
                  let env = '';
                  env += 'thr_value_1:' + csv[0].thr_value_1 + ';';
                  env += 'thr_value_2:' + csv[0].thr_value_2 + ';';
                  env += 'thr_value_3:' + csv[0].thr_value_3 + ';';
                  env += 'thr_value_4:' + csv[0].thr_value_4 + ';';
                  env += 'thr_value_5:' + csv[0].thr_value_5 + ';';
                  t.valoriEnv = env;
                  t.passaggioValoriPerLegenda.emit(t.valoriEnv + '§' + new Date().getTime());

                  const tm = setTimeout(() => {
                    clearTimeout(tm);

                    const array = t.prendeMisurePerLegenda();
                    t.legendaComponent.disegnaLegenda(t, t.Measure, true);
                  }, 100);

                  if (t.debug2 === true) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Geo SLA Thr Sel: ', csv);
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: ENV: ', env);
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Indirizzo: ', indirizzo);
                  }

                  let indirizzo2 = '';
                  if (indirizzo.toUpperCase().indexOf('HTTP') === -1) {
                    indirizzo2 = t.Utils.indirizzoGEOServer + 'Geo_ANTS/wms?service=WMS&version=1.1.0&request=GetMap&layers=' + indirizzo.replace('?', '&');
                  } else {
                    indirizzo2 = indirizzo;
                  }

                    let wms = undefined;
                    try {
                      wms = new TileWms({
                        url: indirizzo2,
                        projection: 'EPSG:4326',
                        // preload: Infinity,
                        // renderer: 'antialias: true;',
                        params: {
                          TILED: true,
                          TIME: tms,
                          ENV: env,
                          VIEWPARAMS: 'cntx_id:\'' + t.sessionID2 + '\';'
                        },
                        serverType: 'geoserver'
                      });

                      if (wms) {
                        t.layersAgg[q] = new TileLayer({
                          source: wms,
                          opacity: t.opacity2 / 100
                        });
                      }
                      if (t.debug2 === true) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Layer aggiunto alla lista', q, indirizzo2);
                      }
                    } catch (e) {
                      if (t.debug2 === true) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Errore nel caricamento del layer', indirizzo2);
                      }
                    }
                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Caricato wms');
                  // } else {
                  /*   try {
                      t.layersAgg[q] =
                        new TileWms({
                          // preload: Infinity,
                          source: new ImageArcGISRest({
                            ratio: 1,
                            params: {
                              TILED: true,
                              TIME: tms,
                              // ENV: env
                            },
                            url: indirizzo,
                          }),
                          opacity: t.opacity2 / 100
                      });
                    } catch (e) {
                      if (t.debug2 === true) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers: Errore nell\'impostazione del layer 2', indirizzo);
                      }
                    }
                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Caricato ArcGIS');
                  } */

                  if (t.debug2 === true) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers. Quale Layer:', t.layersAgg[q]);
                  }

                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'LAYER CARICATO:', indirizzo, indirizzo2);

                  // t.map1[t.NumeroFrame2].addLayer(t.layersAgg[q]);
                  if (t.layersAgg[q]) {
                    t.addLayerToMap(t.layersAgg[q], 3, 'LayerAggiuntivo: ' + indirizzo);
                    q++;
                  }
                }
              }, error => {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AddLayers. Errore');
              });
            // }
          }
        } else {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Addlayers. Pulisco layers', element, t.layersAgg);
          }
          let qq = 0;
          t.layersAgg.forEach(element2 => {
            if (element2) {
              t.removeLayerFromMap('Additional layer ' + qq + ' pulizia', element2);
              element2 = undefined;
            }
            qq++;
          });
        }
      });
    } else {
      if (t.layersAgg) {
        let qq = 0;
        t.layersAgg.forEach(element2 => {
          t.removeLayerFromMap('Additional Layer ' + qq, element2);
          element2 = undefined;
          qq++;
        });
      }
    }
    // t.layersAgg = layersAggInterni;

    if (t.listaLayersDaVisualizzare.length > 0) {
      t.listaLayersDaVisualizzare = t.listaLayersDaVisualizzare.substring(0, t.listaLayersDaVisualizzare.length - 2) + ' ';
    }
    t.pendings.replace('Additional Layers<br />', '');
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.layersAgg);
  }
}

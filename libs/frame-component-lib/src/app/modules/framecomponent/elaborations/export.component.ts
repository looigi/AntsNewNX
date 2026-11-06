import { logConsole } from '../console-log';
import { ExternalApiService } from './../services/externalapi.service';
import { ExternalHttpClient } from './../services/externalhttpclient.service';
// import { SessionService } from './../../../../db/session.service';
import { Injectable } from '@angular/core';
// import Utils from '../Utilities.component';
import { environment } from '../../../../environments/environment';
// import { saveAs } from 'file-saver';
import ExternalUtilities from '../ExternalUtilities.component';
// import { HistogramComponent } from './histogram.component';
// import { FileSaverService } from 'ngx-filesaver';
import download from 'downloadjs';  // Importa downloadjs
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';

@Injectable()
export class ExportComponent {
  destroy$ = new FineRichieste();

  constructor(
    // private fileSaver: FileSaverService,
    // private sessionService: SessionService,
    private httpclient: ExternalHttpClient,
    private apiService: ExternalApiService,
  ) {
  }

  async exportDati(t, formato, listaEventi, tipoEvento, listaMisure) {
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione dati formato ', t.NumeroFrame, t.MappaOGrafico2);
    }
    switch (t.MappaOGrafico2) {
      case 'M':
        // Mappe
        this.estraiDatiMappa(t, formato, listaEventi, tipoEvento, listaMisure);
        break;
      case 'AH':
        // Istogrammi
        // t.histogramComponent.disegnaHistogram(t, true, true, true);
        // t.visualizzaIstogrammiGrafici = false;
        t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
        // this.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;

        // t.exportGridComponent.creaGriglia(t, t.histogramComponent.vecchioJson, 'Histogram Data', false);
        t.exportGridComponent.creaGriglia(t, t.vecchioJson[t.NumeroFrame2], 'Histogram Data', false);

        break;
      case 'PC':
        // Pareto
        t.paretoComponent.disegnaPareto(t, true);
        break;
      case 'MC':
        // Time Chart
        t.graficiComponent.disegnaGrafici(t, true);
        break;
      case 'PS':
        // Scatter
        t.scatterComponent.disegnaScatter(t, true);
        break;
    }
  }

  estraiDatiMappa(t, formato, listaEventi, tipoEvento, listaMisure) {
    let q = 0;

    // Export Misure
    /*
    if (t.exportMeasuresKML === true) {
      if (t.Measure && t.Measure !== '') {
        t.Measure.forEach(element => {
          if (element && element !== '') {
            q++;
          }
        });

        const array = new Array();

        if (q > 0) {
          t.Measure.forEach(element => {
            if (element && element !== '') {
              array.push(element);
            } else {
              array.push('---');
            }
          });

          let index = 0;
          let nomeStyle = '';

          // let sla = '';
          // if (t.slaName2 && t.slaName2 !== '') {
          //   sla = 'geo_sla_name = \'' + t.slaName2 + '\'';
          // }
          let sla = ExternalUtilities.tornaSla(t);
          if (sla !== undefined && sla !== '') {
            sla = 'v_geo_sla_name:\'' + sla + '\';';
          } else {
            sla = '';
          }

          let act_set = '';
          // if (t.act_set) {
            // act_set += t.act_set;
          let act_set_per_titolo = '';
          act_set = ExternalUtilities.ritornaStringPerActivitySetAGrafici(t, t.Utils);
          act_set_per_titolo = JSON.parse(JSON.stringify(act_set));
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_set_per_titolo);
          act_set = 'v_act_set_name_list:\'' + act_set + '\';';
          // if (act_set.indexOf('geo_act_set_name') === -1) {
          // }

          if ((t.timeFilter === 2 || t.timeFilter2 === 'Time Range') && !t.Utils.tmsSelezionato) {
          } else {
            array.forEach(async element => {
              if (element !== '---') {
                let nomeLayer = '';
                // let filtro = '';
                let viewParams = '';
                viewParams += 'cntx_id:\'' + t.sessionID2 + '\';';

                let propName = '';
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.measureData2);
                let nomeMisura = '';
                t.measureData2.forEach(element2 => {
                  if (nomeLayer === '') {
                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2.NAME, element);
                    if (element2.CODE === element) {
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2);
                      nomeMisura = element2.CODE; // .NAME;
                      if (+element2.TYPE === 1) {
                        nomeLayer = environment.layerNumerico;
                        nomeStyle = 's_geo_measr_num_line_google_earth';
                        if (sla !== '') {
                          viewParams += sla;
                        }
                        propName = 'PROPERTYNAME=geo_act_set_name,geo_act_name,measr_code,tms_min,tms_max&';
                      } else {
                        if (+element2.TYPE === 5) {
                          nomeLayer = 'Geo_ANTS:l_' + element2.CODE;
                          viewParams += '';
                        } else {
                          if (+element2.TYPE === 6) {
                            nomeLayer = 'Geo_ANTS:l_' + element2.CODE;
                            viewParams += '';
                          } else {
                            nomeLayer = environment.layerStringa;
                            nomeStyle = 's_geo_measr_str_line_google_earth';
                            propName = 'PROPERTYNAME=geo_act_set_name,geo_act_name,measr_code,tms_min,tms_max,value&';
                            viewParams += '';
                          }
                        }
                      }
                    }
                  }
                });

                const altro = 'v_measr_code:\'' + element + '\';';
                // if (viewParams !== '') {
                //   altro = ' and ' + altro;
                // }
                viewParams += altro;
                viewParams += act_set;

                let stSize = -1;
                if (t.styleSize2 === -1) {
                  // GLOBAL STYLE SIZE
                  stSize = t.styleSizeGlobale2;
                } else {
                  stSize = t.styleSize2;
                }

                let sInizio = '';
                let sFine = '';
                let tmsFilter = '';
                if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
                  if (t.Utils.tmsInizio && t.Utils.tmsFine) {
                    sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
                    sFine = t.Utils.tmsFine; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
                  } else {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.Utils.tmsSelezionato);
                    if (t.Utils.tmsSelezionato) {
                    }
                  }
                  if (sInizio !== '' && sFine !== '') {
                    tmsFilter = ' and \'' + sInizio + '\' < tms_max and \'' + sFine + '\' > tms_min';
                  }
                } else {
                  sInizio = t.timeRangeDSFStart2;
                  sFine = t.timeRangeDSFStop2;
                }

                if (sInizio !== '' && sFine !== '') {
                  viewParams += 'v_tms_min:\'' + sInizio + '\';';
                  viewParams += 'v_tms_max:\'' + sFine + '\';';
                }

                const bbox = ExternalUtilities.bboxExport; // ExternalUtilities.prendeBBOXExport(t.map1[t.NumeroFrame2]);
                viewParams += '&' + bbox;

                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeLayer, act_set, viewParams, sInizio, sFine);

                let url = '';
                if (nomeLayer && nomeLayer !== null && nomeLayer.trim() !== '') {
                  if (formato === 'kml') {
                    url = t.Utils.indirizzoGEOServer + environment.urlBaseGS +  '/wms?' +
                      'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=application/vnd.google-earth.kml+xml&' +
                      'TRANSPARENT=true&LAYERS=' + nomeLayer + '&TILED=false&' +
                      'STYLES=' + nomeStyle + '&ENV=measr_num:' + index + ';style_size:' + stSize + '&' +
                      propName +
                      'VIEWPARAMS=' + viewParams; // + '&' +
                      // 'CQL_FILTER=CRS=EPSG%3A4326&WIDTH=1024&HEIGHT=768'; // filtro + tmsFilter +
                      // '&CRS=EPSG%3A4326&WIDTH=1024&HEIGHT=768&BBOX=46.04117299156534,14.190784381074742,
                      // 46.1963585846484,14.628038869782134';
                      // BBOX=36.381849,8.5544938,47.864238,14.183044   ITALIA, Sopra SLOVENIA
                  } else {
                    url = t.Utils.indirizzoGEOServer + environment.urlBaseGS + '/ows?' +
                      'SERVICE=WFS&version=1.0.0&REQUEST=GetFeature&typeName=' + nomeLayer + '&outputFormat=csv&' +
                      propName +
                      'ENV=measr_num:' + index + '&STYLES=' + nomeStyle + '&VIEWPARAMS=' + viewParams;
                      // CQL_FILTER=' + filtro + tmsFilter;
                  }
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mappa', url);
                  while (url.indexOf(' ') > -1) {
                    url = url.replace(' ', '%20');
                  }
                  // window.open(url, '_blank');
                  let actSet = act_set_per_titolo;
                  if (actSet === environment.stringaLatestSelection) {
                    actSet = 'Latest';
                  }
                  if (actSet === environment.stringaAll) {
                    actSet = 'All';
                  }
                  let valoreRicerca = '\'' + act_set + '\'';
                  // if (t.tipoDataset2 === 2) {
                  //  valoreRicerca = agnGroupId;
                  // }
                  if (t.eseguitoInProgetto2 === true) {
                    // if (t.tipoDataset2 === 1) {
                      valoreRicerca = '\'' + t.agnGroup + '\'';
                    // } else {
                    //   valoreRicerca = '\'' + t.actSetNameFM + '\'';
                    // }
                  }

                  const nomeFile = ExternalUtilities.sistemaNomeFrame(t, 'GeoAnts_' + valoreRicerca + '_' + t.frameName +
                    '_' + nomeMisura) + '.' + formato;
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeFile);

                  const FileSaver = require('file-saver');
                  FileSaver.saveAs(url, nomeFile);
                } else {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura ' + element + ' non trovata. Estrazione skippata');
                }
              }
              index++;
            });
          }
            // return;
          // }
        }
      }
    } */

    // if (t.exportPathAntenneKML === true || t.eseguitoInProgetto2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Chiamo antenne', new Date());
      this.exportPathAntenne(t, formato, 'Serving Cell', listaEventi, tipoEvento, listaMisure); // DA FARE
    // }

    /*
    // if (t.exportPlanimetryKML === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Chiamo piantina', new Date());
      this.exportPiantina(t); // DA FARE
    // }

    // if (t.exportEventsKML === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Chiamo eventi', new Date());
      this.exportEventi(t, formato, listaEventi); // DA FARE ?
    // }

    // if (t.exportOverlayKML === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Chiamo overlay', new Date());
      this.exportOverlay(t, formato); // FATTO
    // }

    // if (t.exportAntenneKML === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Chiamo antenne 1 e 2', new Date());
      this.exportAntenne1e2(t, formato); // FATTO
    // }

    // if (t.exportRaysKML === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Chiamo rays', new Date());
      this.exportRays(t, formato);
    // }
    */
  }

  chiamataPost(Utils, funzione, jsonString) {
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, jsonString);
    return this.httpclient.post(Utils, Utils.serverPostRest + '/' + funzione, jsonString);
  }

  async exportPathAntenne(t, formato, act_set_per_titolo, listaEventi, tipoEvento, listaMisure) {
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Export path antenne', t.tmsSelezionato, t.isCheckedServingCell2);
    }

    let tms = t.tmsSelezionato;
    if (!tms) {
      if (!t.Utils.tmsSelezionato) {
        tms = t.Utils.tmsSelezionato;
        tms = t.datePipe.transform(tms, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
      }
    }
    if ((!tms || tms === 'undefined') && t.eseguitoInProgetto2 === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Export path antenne. Esco per tms selezionato assente', t.tmsSelezionato, t.isCheckedServingCell2);
      }
      return;
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tms:', t.tmsSelezionato);

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.strutturaClick);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TMS: ', new Date(tms).getTime());

    // const dInizio = ((new Date(tms).getTime()) - (t.Utils.rangeDiSecondiPerMille)) + (new Date().getTimezoneOffset() * 60000);
    let sInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
    // const dFine = ((new Date(tms).getTime()) + (t.Utils.rangeDiSecondiPerMille)) + (new Date().getTimezoneOffset() * 60000);
    let sFine; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');

    if (t.eseguitoInProgetto2) {
      sInizio = t.timeRangeDSFStop2; // t.Utils.tmsFine;
      if (sInizio) {
        if (sInizio.indexOf('Z') === -1) {
          sInizio += 'Z';
        }
        sInizio = sInizio.replace(' ', 'T');
      }
      sFine = sInizio;
    } else {
      if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
        if (t.Utils.tmsInizio && t.Utils.tmsFine) {
          sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
          sFine = t.Utils.tmsFine; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Time Range', sInizio, sFine);
        } else {
          // t.datiCellMeasure = 'empty grid';
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati CM: Cell measures ESCO 2');
          }
          return;
        }
      } else {
        sInizio = t.timeRangeDSFStart2;
        sFine = t.timeRangeDSFStop2;
      }
    }

    // if (!t.tmsSelezionato || t.tmsSelezionato === undefined || t.tmsSelezionato === 'undefined' || t.isCheckedServingCell2 === false) {
    if (!sInizio || sInizio === undefined || sInizio === 'undefined') {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Export path antenne. Esco per tms null');
      }
      return;
    }
      // const tmsFilter = ' tms between \'' + sInizio + '\' and \'' + sFine + '\'';
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tmsFilter);

    // if (!t.act_set) {t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ACTSET UNDEFINED'); }

    // let act_set_name = ExternalUtilities.ritornaStringPerActivitySetAGrafici(t, t.Utils);
    // const act_set_per_titolo = JSON.parse(JSON.stringify(act_set_name));
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_set_per_titolo);
    // if (act_set_name.indexOf('geo_act_set_name') === -1) {
    //   act_set_name = act_set_name + '\' ';
    // }

    // const params = '{ "act_set_name": "' + act_set_name +
    //     '", "tms_min": "' + sInizio + '", "tms_max": "' + sFine + '" }';

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

    let agnact = '';
    if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = 'null';
    } else {
      agnact = ExternalUtilities.stringaAGNoACT;
    }
    let valoreRicerca = t.act_set;
    if (t.tipoDataset2 === 2) {
      valoreRicerca = agnact;
    }
    if (valoreRicerca) {
      while (valoreRicerca.indexOf('\'') > -1) {
        valoreRicerca = valoreRicerca.replace('\'', '');
      }
      while (valoreRicerca.indexOf('"') > -1) {
        valoreRicerca = valoreRicerca.replace('"', '');
      }
    }

    let sla = ExternalUtilities.tornaSla(t);
    if (sla !== undefined && sla !== '') {
      // sla = 'sla_name:' + sla;
    } else {
      sla = '';
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto sla:', sla);

    let qBbox = ExternalUtilities.ritornaBboxGiusta(t, 'exportPathAntenne');
    let qualeBbox;

    if (+t.geoFilter2 === 1 || t.geoFilter2 === 1) {
      qualeBbox = qBbox;
    } else {
      qualeBbox = [qBbox[1], qBbox[0],qBbox[3],qBbox[2]];
    }

    let listaEventi2 = '';
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, listaEventi);
    let le;
    if (typeof(listaEventi) === 'string') {
      le = JSON.parse(listaEventi);
    } else {
      le = listaEventi;
    }
    logConsole(le);
    if (tipoEvento) {
      if (listaEventi && listaEventi !== '' && listaEventi !== 'empty grid' && listaEventi !== '"empty grid"') {
        le.forEach(element => {
          listaEventi2 += element.EVENT_TYPE + ',';
        });
        if (listaEventi2.length > 0) {
          listaEventi2 = listaEventi2.substring(0, listaEventi2.length - 1);
          // listaEventi2 = '\'' + listaEventi2 + '\'';
        }
      }
    } else {
      if (listaEventi && listaEventi !== '' && listaEventi !== 'empty grid' && listaEventi !== '"empty grid"') {
        const le = JSON.parse(listaEventi);
        le.forEach(element => {
          listaEventi2 += element.EVENT_TYPE + ',';
        });
        if (listaEventi2.length > 0) {
          listaEventi2 = listaEventi2.substring(0, listaEventi2.length - 1);
          // listaEventi2 = '\'' + listaEventi2 + '\'';
        }
      }
    }

    if (t.eseguitoInProgetto2) {
      valoreRicerca = '';
    }

    const bbox = qualeBbox;
    if (bbox[0] > bbox[1]) {
      let appo = bbox[0];
      bbox[0] = bbox[1];
      bbox[1] = appo;

      appo = bbox[2];
      bbox[2] = bbox[3];
      bbox[3] = appo;
    }

    const params = {
      cntx_id: t.sessionID2 ,
      v_act_set_name_list: valoreRicerca,
      v_geo_sla_name: sla,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_cell_type_list: cell_type,

      geoants_bbox_min_x: bbox[0],
      geoants_bbox_min_y: bbox[1],
      geoants_bbox_max_x: bbox[2],
      geoants_bbox_max_y: bbox[3],

      /* geoants_bbox_min_x: qualeBbox[1],
      geoants_bbox_min_y: qualeBbox[0],
      geoants_bbox_max_x: qualeBbox[3],
      geoants_bbox_max_y: qualeBbox[2], */
      v_event_type_list: listaEventi2 ? listaEventi2 : '',
      v_measr_code_list: listaMisure
    }

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Antenne', params);
    }
    this.chiamataPost(t.Utils, 'antsgeo_act_path_cell3d_kml', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$.per(t)))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data);
      let actSet = act_set_per_titolo;
      if (actSet === environment.stringaLatestSelection) {
        actSet = 'Latest';
      }
      if (actSet === environment.stringaAll) {
        actSet = 'All';
      }

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data);
      let nomeFile = '';
      if (t.eseguitoInProgetto2) {
        const d1 = new Date(sFine).getTime();
        const t1 = t.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        nomeFile = ExternalUtilities.sistemaNomeFrame(t, 'GeoAnts_SitesAndCoverage_' + t1) + '.' + formato;
      } else {
        nomeFile = ExternalUtilities.sistemaNomeFrame(t, 'GeoAnts_' + valoreRicerca + '_' + t.frameName) + '.' + formato;
      }
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeFile);
      // const FileSaver = require('file-saver');
      const data3 = new Blob([data2], {type: 'text/plain;charset=utf-8'});
      // this.fileSaver.save(data3, nomeFile);

      // download(data3, nomeFile, 'text/plain;charset=utf-8');
      download(data3, nomeFile, 'text/plain;charset=utf-8');
    }, error => {
      ExternalUtilities.messaggioDiErrore('null', error);
    });

    /* const parameters = {
      'LAYERS': nomeLayer,
      'TILED': false,
      'CQL_FILTER': tmsFilter + act_set
    };

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, parameters);

    let url = '';
    if (formato === 'kml') {
      url = t.Utils.indirizzoGEOServer + environment.urlBaseGS +  '/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=application/vnd.google-earth.kml+xml&' +
        'TRANSPARENT=true&LAYERS=' + nomeLayer + '&TILED=false&' +
        'CQL_FILTER=' + parameters.CQL_FILTER +
        '&CRS=EPSG%3A4326&WIDTH=1024&HEIGHT=768&BBOX=36.381849,8.5544938,47.864238,14.183044';
    } else {
      url = t.Utils.indirizzoGEOServer + environment.urlBaseGS + '/ows?' +
        'SERVICE=WFS&version=1.0.0&REQUEST=GetFeature&typeName=' + nomeLayer + '&outputFormat=csv&' +
        'CQL_FILTER=' + parameters.CQL_FILTER;
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri overlay frame', t.NumeroFrame, parameters);
    while (url.indexOf(' ') > -1) {
      url = url.replace(' ', '%20');
    }
    let actSet = act_set_per_titolo;
    if (actSet === environment.stringaLatestSelection) {
      actSet = 'Latest';
    }
    if (actSet === environment.stringaAll) {
      actSet = 'All';
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, url);
    const c = await t.downloadFile.downloadJSON(url);
    const cc = JSON.parse(c['_body']);

    const nomeFile = t.Utils.sistemaNomeFrame(t, 'GeoAnts_' + actSet + '_' + t.frameName + '_PathAntenne') + '.' + formato;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeFile);
    // const FileSaver = require('file-saver');
    // FileSaver.saveAs(url, nomeFile); */
  }

  exportPiantina(t) {
    if (t.blobImmagine === undefined || t.blobImmagine === null) {
      return;
    }

    const act_set = ExternalUtilities.ritornaStringPerActivitySetAGrafici(t, t.Utils);
    let valoreRicerca = '\'' + act_set + '\'';
    // if (t.tipoDataset2 === 2) {
    //  valoreRicerca = agnGroupId;
    // }
    if (t.eseguitoInProgetto2 === true) {
      if (t.agnGroup && t.agnGroup !== 'undefined') {
        valoreRicerca = '\'' + t.agnGroup + '\'';
      } else {
        valoreRicerca = t.datePipe.transform(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss.SSS');
      }
    }

    const nomeFile = valoreRicerca + '_' + t.frameName + '.jpg';
    // const FileSaver = require('file-saver');
    // FileSaver.saveAs(t.blobImmagine, nomeFile);
    // this.fileSaver.save(t.blobImmagine, nomeFile);

    download(t.blobImmagine, nomeFile, 'image/jpeg');

    let imm = '';
    imm += '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    imm += '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:ns2="http://www.google.com/kml/ext/2.2" xmlns:ns3="http://www.w3.org/2005/Atom" xmlns:ns4="urn:oasis:names:tc:ciq:xsdschema:xAL:2.0">';
    imm += '<Document>';
    imm += '<LookAt>';
    imm += '<longitude>11.112696788065335</longitude>';
    imm += '<latitude>42.15715873186984</latitude>';
    imm += '<altitude>1676917.9601343612</altitude>';
    imm += '<heading>0.0</heading>';
    imm += '<tilt>0.0</tilt>';
    imm += '<range>1355037.6689365518</range>';
    imm += '<altitudeMode>clampToGround</altitudeMode>';
    imm += '</LookAt>';
    imm += '<GroundOverlay>';
    imm += '<Icon><href> ' + nomeFile + ' </href></Icon>';
    imm += '<LatLonBox>';
    imm += '<west>' + t.lng1 + '</west><east>' + t.lng2 + '</east>';
    imm += '<north>' + t.lat1 + '</north><south>' + t.lat2 + '</south>';
    imm += '<rotation>0.</rotation>';
    imm += '<altitude>0.</altitude>';
    imm += '</LatLonBox>';
    imm += '</GroundOverlay>';
    imm += '</Document>';
    imm += '</kml>';

    const nomeFile2 = 'GeoAnts_Image_' + valoreRicerca + '_' + t.frameName + '.kml';
    const blob = new Blob([imm], {
      type: 'application/vnd.google-earth.kml+xml'
    });
    // FileSaver.saveAs(blob, nomeFile2);
    // this.fileSaver.save(blob, nomeFile);

    download(blob, nomeFile, 'application/vnd.google-earth.kml+xml');
  }

  async exportEventi(t, formato, listaEventi) {
    //return;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Option overlay frame', t.NumeroFrame, t.viewAs2);
    // t.disegnaPathComeFeature(t);
    // return;

    if ((t.timeFilter === 2 || t.timeFilter2 === 'Time Range') && !t.Utils.tmsSelezionato) {
      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna overlay');
    if (t.ConnessioneStabilita === 'OK') {
      // let act_set = t.Utils.ritornaStringPerActivitySetAGrafici(t);
      // let ok = false;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'act_set:', t.act_set);

      let lista = null;
      let lep = null;
      if (t.tipoEvento2 === 'L') {
        lista = t.listaEventiDaPassare2;
        lep = ExternalUtilities.converteStringaInJSON(lista);
      } else {
        lista = t.eventiSceltiES;
        lep = lista;
      }

      let filtro = '';
      if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep.length > 0) {
        lep.forEach(element => {
          if (element.EVENT_TYPE && element.EVENT_TYPE !== undefined && element.EVENT_TYPE !== 'undefined') {
            filtro += '\'' + element.EVENT_TYPE + '\'\\,';
          }
        });
        if (filtro.length > 0) {
          filtro = filtro.substring(0, filtro.length - 2);
          // filtro = 'event_type in (' + filtro + ')';
        } else {
          if (t.tipoEvento2 === 'G') {
            filtro = '\'NONE\'';
          }
        }
      } else {
        if (t.tipoEvento2 === 'G') {
          filtro = '\'NONE\'';
        }
      }
      /* if (filtro.length > 0 ) {
        filtro += ' and ';
      } */

      let act_set = ExternalUtilities.ritornaStringPerActivitySetAGrafici(t, t.Utils);
      const act_set_per_titolo = act_set;

      let sInizio = 'null';
      let sFine = 'null';
      /* let tmsFilter = '';
      if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
        if (t.Utils.tmsInizio && t.Utils.tmsFine) {
          sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
          sFine = t.Utils.tmsFine; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
        } else {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.Utils.tmsSelezionato);
          if (t.Utils.tmsSelezionato) {
          }
        }
        if (sInizio !== '' && sFine !== '') {
          tmsFilter = ' and tms >= \'' + sInizio + '\' and tms <= \'' + sFine + '\'';
        }
      } else {
        sInizio = t.timeRangeDSFStart2;
        sFine = t.timeRangeDSFStop2;
      } */
      sInizio = t.timeRangeDSFStart2;
      sFine = t.timeRangeDSFStop2;

      if (t.eseguitoInProgetto2 === true && t.tmsPassatiDaProgetto2) {
        /* const t1 = new Date().getTime() - (t.lastDays2 * 24 * 60 * 60 * 1000);
        sInizio = t.datePipe.transform(t1, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        const t2 = new Date().getTime() + (24 * 60 * 60 * 1000);
        sFine = t.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC'); */
        const tt = t.tmsPassatiDaProgetto2.split(';');
        sInizio = tt[0];
        sFine = tt[1];

        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Impostato tms passato per export l_geo_events', t.NumeroFrame2, sInizio, sFine, t.tmsPassatiDaProgetto2);
        }
      }

      if (sInizio === undefined || sFine === undefined) {
        return;
      }

      let valoreRicerca = '\'' + t.act_set + '\'';
      // if (t.tipoDataset2 === 2) {
      //  valoreRicerca = agnGroupId;
      // }
      if (t.eseguitoInProgetto2 === true) {
        // if (t.tipoDataset2 === 1) {
          if (t.agnGroup && t.agnGroup !== 'undefined') {
            valoreRicerca = '\'' + t.agnGroup + '\'';
          } else {
            valoreRicerca = t.datePipe.transform(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss.SSS');
          }
        // } else {
        //   valoreRicerca = '\'' + t.actSetNameFM + '\'';
        // }
      }

      let vp = 'cntx_id:\'' + t.sessionID2 + '\';' +
          'v_act_set_name_list:' + valoreRicerca + ';' +
          'v_event_type_list:' + filtro + ';' +
          'v_tms_min:\'' + sInizio + '\';' +
          'v_tms_max:\'' + sFine + '\';';
      const bbox = ExternalUtilities.bboxStringa; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
      vp += bbox;

      /* t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, vp);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '1', ExternalUtilities.bboxAttuale);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '2', ExternalUtilities.bboxAttualeFisso);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '3', ExternalUtilities.bboxStringa);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '4', ExternalUtilities.bboxStringaFisso);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '5', ExternalUtilities.bboxExport);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '6', ExternalUtilities.bboxExportFisso); */
      let qualeBbox = ExternalUtilities.ritornaBboxGiusta(t, 'exportEventi');

      const parameters = {
        'LAYERS': 'Geo_ANTS:l_geo_event',
        'CQL_FILTER': vp
      };

      let url = '';
      if (formato === 'kml') {
        const b = qualeBbox;
        url = t.Utils.indirizzoGEOServer + environment.urlBaseGS +  '/wms?' +
          'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=application/vnd.google-earth.kml+xml&' +
          'TRANSPARENT=true&LAYERS=' + parameters.LAYERS + '&TILED=false&' +
          'VIEWPARAMS=' + parameters.CQL_FILTER +
          '&CRS=EPSG%3A4326&WIDTH=1024&HEIGHT=768&BBOX=' + b[0] + ',' + b[1] + ',' + b[2] + ',' + b[3];
          // BBOX=36.381849,8.5544938,47.864238,14.183044   ITALIA, Sopra SLOVENIA
      } else {
        url = t.Utils.indirizzoGEOServer + environment.urlBaseGS + '/ows?' +
          'SERVICE=WFS&version=1.0.0&REQUEST=GetFeature&typeName=' + parameters.LAYERS + '&outputFormat=csv&' +
          'VIEWPARAMS=' + parameters.CQL_FILTER;
      }
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri overlay frame', t.NumeroFrame, url);
      while (url.indexOf(' ') > -1) {
        url = url.replace(' ', '%20');
      }

      const nomeFile = ExternalUtilities.sistemaNomeFrame(t, 'GeoAnts_' + valoreRicerca + '_' + t.frameName + '_Events') + '.' + formato;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeFile);
      // const FileSaver = require('file-saver');
      // FileSaver.saveAs(url, nomeFile);
      const data3 = new Blob([url], {type: 'text/plain;charset=utf-8'});
      // this.fileSaver.save(data3, nomeFile);

      download(data3, nomeFile, 'text/plain;charset=utf-8');
    }
  }

  exportRays(t, formato) {
    if (!t.Utils.tmsSelezionato ) {
      ExternalUtilities.messaggioDiErrore('null', 'Please, for rays, select a point first');
      return;
    }

    const act_id = ExternalUtilities.prendeTuttiIdActSet(t, false, t.Utils);

    const tm3 = t.Utils.tmsSelezionato.toString().replace('T', ' ').replace('Z', ' ');
    const tms2 = t.datePipe.transform(tm3.replace('T', ' ').replace('Z', ' ') + ' UTC +00', 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    const params = '{ ' +
      '"cntx_id": "' + t.sessionID2 + '",' +
      '"v_act_id_list": "' + act_id + '", ' +
      '"v_tms": "' + tms2 + '"' +
    ' }';

    this.apiService.chiamataPost(t.Utils, 'act_path_cell_point_3dkml__sel', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$.per(t)))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

      let actSet = t.act_set;
      if (actSet === environment.stringaLatestSelection) {
        actSet = 'Latest';
      }
      if (actSet === environment.stringaAll) {
        actSet = 'All';
      }
      let valoreRicerca = '\'' + t.act_set + '\'';
      // if (t.tipoDataset2 === 2) {
      //  valoreRicerca = agnGroupId;
      // }
      if (t.eseguitoInProgetto2 === true) {
        // if (t.tipoDataset2 === 1) {
          valoreRicerca = '\'' + t.agnGroup + '\'';
        // } else {
        //   valoreRicerca = '\'' + t.actSetNameFM + '\'';
        // }
      }

      const nomeFile = ExternalUtilities.sistemaNomeFrame(t, 'GeoAnts_' + valoreRicerca + '_' + t.frameName + '_Rays') + '.' + formato;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeFile);
      // const FileSaver = require('file-saver');
      const data3 = new Blob([data2], {type: 'text/plain;charset=utf-8'});
      // FileSaver.saveAs(data3, nomeFile);
      // this.fileSaver.save(data3, nomeFile);

      download(data3, nomeFile, 'text/plain;charset=utf-8');
    });
  }

  exportOverlay(t, formato) {
    const flagLocaleOverlay = t.viewAs2;

    if (flagLocaleOverlay === 1 || t.overlay2 === 0 || t.overlay2 === '') {
      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Option overlay frame', t.NumeroFrame, t.viewAs2);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura:', t.overlay2);

    // t.disegnaPathComeFeature(t);
    // return;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna overlay');
    if (t.ConnessioneStabilita === 'OK') {
      // let ok = false;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'act_set:', t.act_set);
      let act_set = ExternalUtilities.ritornaStringPerActivitySetAGrafici(t, t.Utils);
      if (act_set && act_set !== '') {
        act_set = ' geo_act_set_name = \'' + act_set + '\'';

        // geo_act_set_name='TIM Coverage BO Highway.20191218.124349' and measr_code='act_coverage_net_tech'
        let sla = ExternalUtilities.tornaSla(t);
        if (sla !== undefined && sla !== '') {
          // sla = ' and geo_sla_name = \'' + sla + '\'';
        } else {
          sla = '';
        }

        let nomeLayer = '';
        let cluster = '';
        let zindex;
        let tipo = '';
        let nomeStyle = '';
        let nomeMisura = '';
        let vParams = '';

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.measureData2);
        let tempo = '';
        if (t.timeFilter === 1 || t.timeFilter2 === 'All') {
          tempo = 'v_tms_min:\'' + t.timeRangeDSFStart2 + '\';';
          tempo += 'v_tms_max:\'' + t.timeRangeDSFStop2 + '\';';
        }

        t.measureData2.forEach(element2 => {
          if (nomeLayer === '') {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2.NAME, t.overlay2);
            if (element2.CODE === t.overlay2) {
              nomeMisura = element2.NAME;

              let qualeCluster = t.overlayCluster2;
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno overlay Frame', t.NumeroFrame, qualeCluster, element2.CODE);
              if (qualeCluster === environment.stringaClusterGlobale) {
                if (t.clusterGlobale2.NAME !== '') {
                  qualeCluster = t.clusterGlobale2.CODE;
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prendo overlay globale', t.NumeroFrame, qualeCluster);
                }
              }

              if (+element2.TYPE === 1) {
                if (flagLocaleOverlay === 2) {
                  tipo = 'CLUSTER';
                  zindex = 4;
                  nomeLayer = 'Geo_ANTS:l_geo_measr_num_cluster';
                  // nomeStyle = 's_geo_measr_mosaic';  // 's_geo_measr_num_line_google_earth';
                  cluster = ' and cluster_set_name = \'' + qualeCluster + '\'';
                  nomeMisura = element2.CODE;

                  const misura = ExternalUtilities.ritornaMisura(t, nomeMisura, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Export 1');
                  nomeMisura = misura;

                  /* if (nomeMisura && (nomeMisura.toUpperCase().indexOf('<GLOBAL MEASURE>') > -1 || (nomeMisura.indexOf('global_measure') > -1 && nomeMisura.indexOf('global_measure_') === -1))) {
                    t.measureData2.forEach(element3 => {
                      if (element3.CODE === t.Utils.globalMeasure.MEASR_CODE) {
                        const m = element3.CODE.replace('"', '').replace('"', '');
                        nomeMisura = nomeMisura.replace('<GLOBAL MEASURE>', m).replace('global_measure', m);
                      }
                    });
                  } else {
                    if (nomeMisura && nomeMisura && (nomeMisura.indexOf('<GLOBAL CHECKED MEASURE ') > -1 || nomeMisura.indexOf('global_measure_') > -1)) {
                      let indice;
                      if (nomeMisura.indexOf('<GLOBAL CHECKED MEASURE ') > -1) {
                        indice = +(nomeMisura.replace('<GLOBAL CHECKED MEASURE ', '').replace('>', ''));
                      } else {
                        indice = +(nomeMisura.replace('global_measure_', ''));
                      }

                      if (indice && indice > 0 && ExternalUtilities.misureGlobali) {
                        if (ExternalUtilities.misureGlobali[indice - 1]) { // !== '') {
                          let cosa;
                          if (ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE']) {
                            cosa = ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE'];
                          } else {
                            cosa = ExternalUtilities.misureGlobali[indice - 1];
                          }
                          // Modifica 25/02/2025
                          // event2 = cosa;
                          nomeMisura = nomeMisura.replace('global_measure_' + indice, cosa).replace('<GLOBAL CHECKED MEASURE ' + indice + '>', cosa) + '\\, ';
                        }
                      }
                    }
                  } */

                  vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
                    'v_act_set_name_list:\'' + t.act_set + '\';' +
                    'v_geo_sla_name:\'' + sla + '\';' +
                    tempo +
                    'v_measr_code:\'' + nomeMisura + '\';' +
                    'v_cluster_set_name:\'' + qualeCluster + '\'';
                } else {
                  if (flagLocaleOverlay === 3) {
                    tipo = 'MOSAIC';
                    zindex = 13;
                    nomeLayer = 'Geo_ANTS:l_geo_measr_num_mosaic';
                    nomeStyle = 's_geo_measr_mosaic'; // 's_geo_measr_num_line_google_earth';
                    nomeMisura = element2.CODE;

                    const misura = ExternalUtilities.ritornaMisura(t, nomeMisura, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Export 2');
                    nomeMisura = misura;

                    /* if (nomeMisura && (nomeMisura.toUpperCase().indexOf('<GLOBAL MEASURE>') > -1 || (nomeMisura.indexOf('global_measure') > -1 && nomeMisura.indexOf('global_measure_') === -1))) {
                      t.measureData2.forEach(element3 => {
                        if (element3.CODE === t.Utils.globalMeasure.MEASR_CODE) {
                          const m = element3.CODE.replace('"', '').replace('"', '');
                          nomeMisura = nomeMisura.replace('<GLOBAL MEASURE>', m).replace('global_measure', m);
                        }
                      });
                    } else {
                      if (nomeMisura && (nomeMisura.indexOf('<GLOBAL CHECKED MEASURE ') > -1 || nomeMisura.indexOf('global_measure_') > -1)) {
                        let indice;
                        if (nomeMisura.indexOf('<GLOBAL CHECKED MEASURE ') > -1) {
                          indice = +(nomeMisura.replace('<GLOBAL CHECKED MEASURE ', '').replace('>', ''));
                        } else {
                          indice = +(nomeMisura.replace('global_measure_', ''));
                        }
  
                        if (indice && indice > 0 && ExternalUtilities.misureGlobali) {
                          if (ExternalUtilities.misureGlobali[indice - 1]) { // !== '') {
                            let cosa;
                            if (ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE']) {
                              cosa = ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE'];
                            } else {
                              cosa = ExternalUtilities.misureGlobali[indice - 1];
                            }
                            // Modifica 25/02/2025
                            // event2 = cosa;
                            nomeMisura = nomeMisura.replace('global_measure_' + indice, cosa).replace('<GLOBAL CHECKED MEASURE ' + indice + '>', cosa) + '\\, ';
                          }
                        }
                      } else {
                        nomeMisura = element2.CODE;
                      }
                    } */

                    vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
                      'v_act_set_name_list:\'' + t.act_set + '\';' +
                      'v_geo_sla_name:\'' + sla + '\';' +
                      tempo +
                      'v_measr_code:\'' + nomeMisura + '\';' +
                      'v_square_meters:' + t.squareMeters + '';
                  }
                }
              } else {
                if (flagLocaleOverlay === 2) {
                  tipo = 'CLUSTER';
                  zindex = 4;
                  nomeLayer = 'Geo_ANTS:l_geo_measr_str_cluster';
                  // nomeStyle = 's_geo_measr_mosaic'; // 's_geo_measr_str_line_google_earth';
                  sla = '';
                  cluster = ' and cluster_set_name = \'' + qualeCluster + '\'';
                  nomeMisura = element2.CODE;

                  const misura = ExternalUtilities.ritornaMisura(t, nomeMisura, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Export 3');
                  nomeMisura = misura;

                  /* if (nomeMisura && (nomeMisura.toUpperCase().indexOf('<GLOBAL MEASURE>') > -1 || (nomeMisura.indexOf('global_measure') > -1 && nomeMisura.indexOf('global_measure_') === -1))) {
                    t.measureData2.forEach(element3 => {
                      if (element3.CODE === t.Utils.globalMeasure.MEASR_CODE) {
                        const m = element3.CODE.replace('"', '').replace('"', '');
                        nomeMisura = nomeMisura.replace('<GLOBAL MEASURE>', m).replace('global_measure', m);
                      }
                    });
                  } else {
                    if (nomeMisura && (nomeMisura.indexOf('<GLOBAL CHECKED MEASURE ') > -1 || nomeMisura.indexOf('global_measure_') > -1)) {
                      let indice;
                      if (nomeMisura.indexOf('<GLOBAL CHECKED MEASURE ') > -1) {
                        indice = +(nomeMisura.replace('<GLOBAL CHECKED MEASURE ', '').replace('>', ''));
                      } else {
                        indice = +(nomeMisura.replace('global_measure_', ''));
                      }

                      if (indice && indice > 0 && ExternalUtilities.misureGlobali) {
                        if (ExternalUtilities.misureGlobali[indice - 1]) { // !== '') {
                          let cosa;
                          if (ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE']) {
                            cosa = ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE'];
                          } else {
                            cosa = ExternalUtilities.misureGlobali[indice - 1];
                          }
                          // Modifica 25/02/2025
                          // event2 = cosa;
                          nomeMisura = nomeMisura.replace('global_measure_' + indice, cosa).replace('<GLOBAL CHECKED MEASURE ' + indice + '>', cosa) + '\\, ';
                        }
                      }
                    }
                  } */

                  vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
                    'v_act_set_name_list:\'' + t.act_set + '\';' +
                    tempo +
                    'v_measr_code:\'' + nomeMisura + '\';' +
                    'v_cluster_set_name:\'' + qualeCluster + '\'';
                } else {
                  if (flagLocaleOverlay === 3) {
                    tipo = 'MOSAIC';
                    zindex = 13;
                    nomeStyle = 's_geo_measr_mosaic'; // 's_geo_measr_str_line_google_earth';
                    sla = '';
                    nomeLayer = 'Geo_ANTS:l_geo_measr_str_mosaic';
                    nomeMisura = element2.CODE;

                    const misura = ExternalUtilities.ritornaMisura(t, nomeMisura, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Export 4');
                    nomeMisura = misura;

                    /* if (nomeMisura && (nomeMisura.toUpperCase().indexOf('<GLOBAL MEASURE>') > -1 || (nomeMisura.indexOf('global_measure') > -1 && nomeMisura.indexOf('global_measure_') === -1))) {
                      t.measureData2.forEach(element3 => {
                        if (element3.CODE === t.Utils.globalMeasure.MEASR_CODE) {
                          const m = element3.CODE.replace('"', '').replace('"', '');
                          nomeMisura = nomeMisura.replace('<GLOBAL MEASURE>', m).replace('global_measure', m);
                        }
                      });
                    } else {
                      if (nomeMisura && (nomeMisura.indexOf('<GLOBAL CHECKED MEASURE ') > -1 || nomeMisura.indexOf('global_measure_') > -1)) {
                        let indice;
                        if (nomeMisura.indexOf('<GLOBAL CHECKED MEASURE ') > -1) {
                          indice = +(nomeMisura.replace('<GLOBAL CHECKED MEASURE ', '').replace('>', ''));
                        } else {
                          indice = +(nomeMisura.replace('global_measure_', ''));
                        }
  
                        if (indice && indice > 0 && ExternalUtilities.misureGlobali) {
                          if (ExternalUtilities.misureGlobali[indice - 1]) { // !== '') {
                            let cosa;
                            if (ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE']) {
                              cosa = ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE'];
                            } else {
                              cosa = ExternalUtilities.misureGlobali[indice - 1];
                            }
                            // Modifica 25/02/2025
                            // event2 = cosa;
                            nomeMisura = nomeMisura.replace('global_measure_' + indice, cosa).replace('<GLOBAL CHECKED MEASURE ' + indice + '>', cosa) + '\\, ';
                          }
                        }
                      }
                    } */

                    vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
                      'v_act_set_name_list:\'' + t.act_set + '\';' +
                      tempo +
                      'v_measr_code:\'' + nomeMisura + '\';' +
                      'v_square_meters:' + t.squareMeters + '';
                  }
                }
              }
            }
          }
        });

        // const zoom = t.mapScale(t, t.currZoom);
        const zoom = Math.round(t.currScale * 5 / 1000); //  Math.round(100000 / (t.currZoom * t.currZoom));
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'dime ', zoom);

        const bbox1 = ExternalUtilities.bboxStringa; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
        const bbox = ExternalUtilities.bboxExport; // ExternalUtilities.prendeBBOXExport(t.map1[t.NumeroFrame2]);
        vParams += ';' + bbox1 + '&' + bbox;

        if (nomeLayer !== '') {
          const parameters = {
            LAYERS: nomeLayer,
            TILED: false,
            // 'VIEWPARAMS': 'square_meters:' + zoom,
            // 'CQL_FILTER': act_set + ' and measr_code=\'' + t.overlay + '\'' + sla + cluster,
            VIEWPARAMS: vParams
          };
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione mosaic/cluster', parameters);
          }
          // return;

          let url = '';
          if (formato === 'kml') {
            url = t.Utils.indirizzoGEOServer + environment.urlBaseGS +  '/wms?' +
              'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=application/vnd.google-earth.kml+xml&' +
              'TRANSPARENT=true&LAYERS=' + nomeLayer + '&TILED=false&' +
              'STYLES=' + nomeStyle + '&' +
              'VIEWPARAMS=' + parameters.VIEWPARAMS; //  + '&' +
              // 'CQL_FILTER=' + parameters.CQL_FILTER +
              // '&CRS=EPSG%3A4326&WIDTH=1024&HEIGHT=768&BBOX=46.04117299156534,14.190784381074742,46.1963585846484,14.628038869782134';
              // BBOX=36.381849,8.5544938,47.864238,14.183044   ITALIA, Sopra SLOVENIA
          } else {
            url = t.Utils.indirizzoGEOServer + environment.urlBaseGS + '/ows?' +
              'SERVICE=WFS&version=1.0.0&REQUEST=GetFeature&typeName=' + nomeLayer + '&outputFormat=csv&' +
              'STYLES=' + nomeStyle + '&VIEWPARAMS=' + parameters.VIEWPARAMS; // CQL_FILTER=' + parameters.CQL_FILTER;
          }
          while (url.indexOf(' ') > -1) {
            url = url.replace(' ', '%20');
          }
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri overlay frame', t.NumeroFrame, url);

          let actSet = t.act_set;
          if (actSet === environment.stringaLatestSelection) {
            actSet = 'Latest';
          }
          if (actSet === environment.stringaAll) {
            actSet = 'All';
          }
          let valoreRicerca = '\'' + t.act_set + '\'';
          // if (t.tipoDataset2 === 2) {
          //  valoreRicerca = agnGroupId;
          // }
          if (t.eseguitoInProgetto2 === true) {
            // if (t.tipoDataset2 === 1) {
              valoreRicerca = '\'' + t.agnGroup + '\'';
            // } else {
            //   valoreRicerca = '\'' + t.actSetNameFM + '\'';
            // }
          }

          const nomeFile = ExternalUtilities.sistemaNomeFrame(t, 'GeoAnts_' + valoreRicerca + '_' +
            t.frameName + '_Overlay_' + nomeMisura) + '.' + formato;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeFile);
          // const FileSaver = require('file-saver');
          // FileSaver.saveAs(url, nomeFile);
          const data3 = new Blob([url], {type: 'text/plain;charset=utf-8'});
          // this.fileSaver.save(data3, nomeFile);

          download(data3, nomeFile, 'text/plain;charset=utf-8');
        }
      }
    }
  }

  exportAntenne1e2(t, formato) {
    if (!t.isCheckedAntenne2 || t.isCheckedAntenne2 === 0) {
      return;
    }

    let nomeStyle = '';
    let nomeLayer = '';
    t.Utils.antenne.forEach(element => {
      if (t.isCheckedAntenne2 === element.id) {
        nomeStyle = element.style;
        nomeLayer = element.layer;
      }
    });

    /* t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Export antenne');
    const par = {
      LAYERS: 'Geo_ANTS:' + nomeLayer,
      TILED: false,
      // 'CQL_FILTER': filtro + altro
    }; */

    let vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
      'v_antenna_set_name_list:null;' +
      'v_xcgi_list:null;' +
      'v_net_tech_list:null;' +
      'v_band_list:null;' +
      'v_tms_min:null;' +
      'v_tms_max:null;' +
      'v_view_mode:null';

    const bbox = ExternalUtilities.bboxExport; // ExternalUtilities.prendeBBOXExport(t.map1[t.NumeroFrame2]);
    vParams += '&' + bbox;

    let url = '';
    if (formato === 'kml') {
      url = t.Utils.indirizzoGEOServer + environment.urlBaseGS +  '/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=application/vnd.google-earth.kml+xml&' +
        'STYLES=' + nomeStyle + '&' +
        'TRANSPARENT=true&LAYERS=' + 'Geo_ANTS:' + nomeLayer + '&VIEWPARAMS=' + vParams + '&TILED=false'; // &' +
        // '&CRS=EPSG%3A4326&WIDTH=1024&HEIGHT=768&BBOX=46.04117299156534,14.190784381074742,46.1963585846484,14.628038869782134';
        // BBOX=36.381849,8.5544938,47.864238,14.183044   ITALIA, Sopra SLOVENIA
    } else {
      url = t.Utils.indirizzoGEOServer + environment.urlBaseGS + '/ows?' +
        'SERVICE=WFS&version=1.0.0&REQUEST=GetFeature&typeName=' + 'Geo_ANTS:' + nomeLayer + '&VIEWPARAMS=' + vParams + '&outputFormat=csv';
    }
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri antenne', t.NumeroFrame, url);
    while (url.indexOf(' ') > -1) {
      url = url.replace(' ', '%20');
    }
    // window.open(url, '_blank');
    const nomeFile = ExternalUtilities.sistemaNomeFrame(t, 'GeoAnts_' + t.frameName + '_Antenne') + '.' + formato;
    // const FileSaver = require('file-saver');
    // FileSaver.saveAs(url, nomeFile);
    const data3 = new Blob([url], {type: 'text/plain;charset=utf-8'});
    // this.fileSaver.save(data3, nomeFile);

    download(data3, nomeFile, 'text/plain;charset=utf-8');
  }
}

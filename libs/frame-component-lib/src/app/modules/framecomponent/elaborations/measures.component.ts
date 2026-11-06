import { logConsole } from '../console-log';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
// import Utils from '../Utilities.component';
import { PathComponent } from './path.component';
import { LegendaComponent } from './legenda.component';
import ExternalUtilities from '../ExternalUtilities.component';
// import { runInThisContext } from 'vm';

@Injectable()
export class MeasuresComponent {
  // lastCallMeasures = undefined;
  // lastCallMeasuresSMS = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  // staDisegnandoMisure = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

  /* lastCall = [
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  ''],
    ['', '', '', '', '', '', '', '', '', '',  '']
  ]; */

  // ultimaVoltaTMS = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // ultimaVoltaTMS2 = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  GestisceLayerConSetSource = true;
  // vecchiaMisura = ['', '', '', '', ''];
  layerAttivo1 = ExternalUtilities.creaVettore(environment.quantePagine, false);
  layerAttivo2 = ExternalUtilities.creaVettore(environment.quantePagine, false);
  
  constructor(
    private pathComponent: PathComponent,
    private legendaComponent: LegendaComponent
  ) {
  }

  pulisceAppoggi(t) {
    this.layerAttivo1[t.NumeroFrame2] = false;
    this.layerAttivo2[t.NumeroFrame2] = false;

    let i = 0;
    t.lastCallMeasures[t.NumeroFrame2].forEach(element => {
      t.lastCallMeasures[t.NumeroFrame2][i] = '';
      i++;
    });
    t.lastCallMeasuresSMS[t.NumeroFrame2] = '';
    // this.vecchiaMisura = ['', '', '', '', ''];
  }

  disegnaMeasure(t) {
    // logConsole('Disegna misure 1');

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo1[t.NumeroFrame2] = false;

      return;
    }
    
    // logConsole('Disegna misure 2');
    
    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo mappa', t.NumeroFrame2, t.MappaOGrafico2);
      this.layerAttivo1[t.NumeroFrame2] = false;

      return;
    }    

    // logConsole('Disegna misure 3');
    
    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna measures 1', t.ConnessioneStabilita, t.MappaOGrafico2, t.map1[t.NumeroFrame2]);
    // }
    if (t.ConnessioneStabilita === 'OK' && t.MappaOGrafico2 === 'M' && t.map1[t.NumeroFrame2]!== undefined) {
      /* if (this.staDisegnandoMisure[t.NumeroFrame2] === true) {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da Disegna measures 1', t.ConnessioneStabilita, t.MappaOGrafico2, t.map1[t.NumeroFrame2]);
        }
        return;
      } */

      // if (t.debug2 === true) {
      //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna measures 2', t.timeFilter2, t.Utils.tmsSelezionato, t.eseguitoInProgetto2);
      // }
      if ((t.timeFilter === 2 || t.timeFilter2 === 'Time Range') && !t.Utils.tmsSelezionato) {
        if (t.eseguitoInProgetto2 === false) {
          // if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da Disegna measures 3', t.ConnessioneStabilita, t.MappaOGrafico2, t.map1[t.NumeroFrame2]);
          // }
          this.layerAttivo1[t.NumeroFrame2] = false;

          return;
        }
      }

      // logConsole('Disegna misure 4');
    
      if (t.eseguitoInProgetto2 === true && (t.permessoFleetManagerAM2 === undefined || t.permessoFleetManagerAM2 === false)) {
        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna measures. Esco 5');
        // }
        this.layerAttivo1[t.NumeroFrame2] = false;

        return;
      }

      // logConsole('Disegna misure 5');
    
      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
      /* const ora = new Date().getTime();
      if (ora - this.ultimaVoltaTMS < t.ritardoPerFunzioni && this.ultimaVoltaTMS !== -1) {
        return;
      }
      this.ultimaVoltaTMS = ora; */
      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

      // this.staDisegnandoMisure[t.NumeroFrame2] = true;

      let q = 0;
      // if (t.debug2 === true) {
      //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna measures 3', t.Measure);
      // }
      if (t.Measure && t.Measure !== '' && ExternalUtilities.isArray(t.Measure)) {
        t.Measure.forEach(element => {
          if (element && element !== '') {
            q++;
          }
        });
        // const meas1 = t.Measure1;
        // const meas2 = t.Measure2;
        // const meas3 = t.Measure3;

        const array = new Array();

        if (q > 0) {
          // SOLO PER TEST
          // meas1 = 'accuracy';
          // meas3 = 'speed';
          // SOLO PER TEST

          let parameters;

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure originali:', t.NumeroFrame2, t.Measure);
          // logConsole('Misure iniziali', t.Measure);
          t.Measure.forEach(element => {
            const misura = ExternalUtilities.ritornaMisura(t, element, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Misure 1');
            if (misura) {
              array.push(misura);
            } else {
              array.push('---');
            }
          });
          // logConsole('Misure da convertire 2', array);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure da visualizzare: ', t.NumeroFrame, t.measureType, array);
        
          const act_set = '';
          // if (t.act_set) {
          // act_set += ' geo_act_set_name = \'' + t.act_set + '\'';
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Filtro measures per act_set: ' + act_set);

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Filtro: ', sla, act_set);

          let nomeStyle = '';

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Sla Name:', t.slaName2);
          // if (t.slaName2 && t.slaName2 !== '') {
          //   sla = 'geo_sla_name = \'' + t.slaName2 + '\'';
          // }

          const sla = ExternalUtilities.tornaSla(t);

          let agnact = '';
          if (t.tipoDataset2 === 2) {
            if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
              agnact = 'null';
            } else {
              if (ExternalUtilities.stringaAGNoACT.indexOf('\'') === -1) {
                agnact = '\'' + ExternalUtilities.stringaAGNoACT + '\'';
              } else {
                agnact = ExternalUtilities.stringaAGNoACT;
              }
            }
            // if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Per Misura. AgnAct:', t.NumeroFrame2, agnact);
            // }
          } else {
            // if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Per Misura. Act Set:', t.NumeroFrame2, t.act_set);
            // }
          }

          let valoreRicerca = '\'' + t.act_set + '\'';
          if (t.tipoDataset2 === 2) {
            valoreRicerca = agnact;
          }
          if (t.eseguitoInProgetto2 === true) {
            if (t.listaActSet2) {
              valoreRicerca = '\'' + t.listaActSet2 + '\'';
            } else {
              valoreRicerca = '\'' + t.agnGroup + '\'';
            }
          }

          // logConsole('Disegna misure 6', valoreRicerca);
    
          // if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna measures 4. Valore ricerca', valoreRicerca, t.tipoDataset2, t.act_set, agnact, t.agnGroup);
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure: ', array, t.showMeasures);
          // }

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure: ', array, t.showMeasures);
          let index = 0;

          if (!t.lastCallMeasures[t.NumeroFrame2]) {
            // if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Creo nuova struttura per ultime chiamate', t.NumeroFrame2);
            // }
            t.lastCallMeasures[t.NumeroFrame2] = new Array();
          }
          let quale = 0;
          array.forEach(element => {
            if (!t.lastCallMeasures[t.NumeroFrame2][quale]) {
              // if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Creo indice su struttura ultima chiamata per misure', t.NumeroFrame2, quale);
              // }
              t.lastCallMeasures[t.NumeroFrame2].push('');
            }
            quale++;
          });

          array.forEach(element => {
            if (!t.showMeasures2) {
              if (t.measureLayer[t.NumeroFrame2][index]) {
                t.removeLayerFromMap('Measure layer' + index, t.measureLayer[t.NumeroFrame2][index]);
                t.measureLayer[t.NumeroFrame2][index] = undefined;
              }
              this.layerAttivo1[t.NumeroFrame2] = false;
              // if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulisco ultima chiamata misure 2');
              // }
              t.lastCallMeasures[t.NumeroFrame2][index] = '';
              // logConsole('Pulisco misura ', index, t.NumeroFrame2);
            } else {
              if (element !== '---') {
                // logConsole('Disegno misura ', index, t.NumeroFrame2);

                let nomeLayer = '';
                let filtro = '';
                let tipo = 'NESSUN TIPO';
                let nomeMisuraRilevata = 'NESSUNA MISURA';
                let mc;
                let altro = '';

                // if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiungo e gestisco Misura', index, t.NumeroFrame2, element);
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura, stile mappa:', t.mappeMS2);
                // }

                // logConsole('Misura da rilevare', element);
                // logConsole('Misure per controllo coaxial 1', index, t.measureData2);
                if (t.measureData2) {
                  t.measureData2.forEach(element2 => {
                    if (nomeLayer === '') {
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2.NAME, element);
                      // logConsole('Misura rilevata', element2);
                      if (element2.CODE === element) {
                        tipo = element2.TYPE;
                        nomeMisuraRilevata = element2.CODE;

                        mc = true;
                        if (+element2.TYPE === 1) {
                          nomeLayer = environment.layerNumerico;
                          switch (+t.mappeMS2) {
                            case 1:
                              nomeStyle = 's_geo_measr_num_line_band';
                              break;
                            case 2:
                              nomeStyle = 's_geo_measr_num_line_line';
                              break;
                            case 3:
                              nomeStyle = 's_geo_measr_num_line_coaxial';
                              break;
                          }
                          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeStyle);

                          /* if (sla !== '' && act_set !== '') {
                            // filtro = sla + ' and ' + act_set;
                          } else {
                            // filtro = sla + act_set;
                          } */
                          filtro = act_set;
                          altro = 'v_geo_sla_name:\'' + sla + '\';';
                        } else {
                          if (+element2.TYPE === 5) {
                            nomeLayer = 'Geo_ANTS:l_' + element2.CODE;
                            // filtro = element;
                            nomeStyle = '';
                            mc = false;
                          } else {
                            if (+element2.TYPE === 6) {
                              nomeLayer = 'Geo_ANTS:l_' + element2.CODE;
                              nomeStyle = '';
                              // filtro = '';
                              mc = false;
                            } else {
                              nomeLayer = environment.layerStringa;
                              /* if (t.styleMappa2 === 1) {
                                nomeStyle = 's_geo_measr_str_group_band';
                              } else {
                                nomeStyle = 's_geo_measr_str_group_line';
                              } */
                              switch (+t.mappeMS2) {
                                case 1:
                                  nomeStyle = 's_geo_measr_str_line_band';
                                  break;
                                case 2:
                                  nomeStyle = 's_geo_measr_str_line_line';
                                  break;
                                case 3:
                                  nomeStyle = 's_geo_measr_str_line_coaxial';
                                  break;
                              }
                              // filtro = element;
                              altro = '';
                            }
                          }
                        }
                      }
                    }
                  });
                }
                // logConsole('Misure per controllo coaxial 1-1', index, nomeStyle, nomeLayer, altro);

                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Measure frame ' + t.NumeroFrame + ': ', index, nomeLayer, element, act_set);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Filtro:', filtro);

                // altro = ' and measr_code=\'' + element + '\'';
                if (!mc) {
                  altro = '';
                }

                // act_set += ' geo_act_set_name = \'' + t.act_set + '\'';
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

                if (t.eseguitoInProgetto2 === true) {
                  if (t.tmsPassatiDaProgetto2) {
                    /* const t1 = new Date().getTime() - (t.lastDays2 * 24 * 60 * 60 * 1000);
                    sInizio = t.datePipe.transform(t1, 'yyyy-MM-dd HH:mm:00'); // ,'UTC'
                    const t2 = new Date().getTime() + (24 * 60 * 60 * 1000);
                    sFine = t.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:00'); // ,'UTC'
                    */
                   
                    const tt = t.tmsPassatiDaProgetto2.split(';');
                    sInizio = tt[0];
                    sFine = tt[1];

                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Impostato tmsPassato per chiamata misure', t.NumeroFrame2, sInizio, sFine, t.tmsPassatiDaProgetto2);
                  }

                  if (t.agnGroup2 === undefined || t.agnGroup2 === 'undefined') {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco dal misure per agn vuoto');

                    // logConsole('Disegna misure 7 Esco per agn vuoto');
                    this.layerAttivo1[t.NumeroFrame2] = false;

                    return;
                  }
                  if (t.eseguitoInProgetto2 === true) {
                    if (t.listaActSet2) {
                      valoreRicerca = '\'' + t.listaActSet2 + '\'';
                    } else {
                      valoreRicerca = '\'' + t.agnGroup + '\'';
                    }
                  } else {
                    valoreRicerca = '\'' + t.agnGroup2 + '\'';
                  }
                  
                  // logConsole('Disegna misure 8', valoreRicerca);

                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AGN Passato', t.agnGroup2);
                } else {
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
                      tmsFilter = ' and \'' + sInizio + '\' < tms_max and \'' + sFine + '\' > tms_min';
                    }
                  } else {
                    sInizio = t.timeRangeDSFStart2;
                    sFine = t.timeRangeDSFStop2;
                  }
                }

                if (sInizio !== '' && sInizio !== undefined) {
                  if (sInizio.indexOf('\'') === -1) {
                    sInizio =  '\'' + sInizio + '\'';
                  }
                } else {
                  sInizio = 'null';
                }

                if (sFine !== '' && sFine !== undefined) {
                  if (sFine.indexOf('\'') === -1) {
                    sFine =  '\'' + sFine + '\'';
                  }
                } else {
                  sFine = 'null';
                }

                if (!nomeLayer || nomeLayer === null || nomeLayer.trim() === '') {
                  // logConsole('Elimino layer', index, element);

                  t.lastCallMeasures[t.NumeroFrame2][index] = '';
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco ed elimino layer. Misura non rilevata e di conseguenza il layer', t.NumeroFrame2, valoreRicerca);

                  if (t.measureLayer[t.NumeroFrame2][index]) {
                    t.removeLayerFromMap('Measure layer' + index, t.measureLayer[t.NumeroFrame2][index]);                  
                    t.measureLayer[t.NumeroFrame2][index] = undefined;
                  }
                } else {
                  if (!valoreRicerca || valoreRicerca === '\'undefined\'' || valoreRicerca === 'undefined' || valoreRicerca === 'null' || valoreRicerca === null || valoreRicerca === '' || valoreRicerca === '\'\'') {
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da disegna measure per valore activity vuoto', t.NumeroFrame2, valoreRicerca);
                  } else {
                    if (!altro || altro === null) {
                      if (t.debug2) {
                        logConsole('SLA e Altro vuoti 2', t.NumeroFrame2, '*' + altro + '*', mc, tipo, nomeMisuraRilevata,
                         t.measureData2, element);
                      }
                    }

                    let vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
                      'v_act_set_name_list:' + valoreRicerca + ';' +
                      altro +
                      'v_measr_code:\'' + element + '\';' +
                      'v_tms_min:' + sInizio + ';' +
                      'v_tms_max:' + sFine;

                    /* if (this.vecchiaMisura[index] !== element) {
                      t.measureLayer[t.NumeroFrame2][index] = undefined;
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura vecchia diversa dall\'attuale. Pulisco il layer', element);
                    }
                    this.vecchiaMisura[index] = element; */

                    // FILTER
                    const filtri = ExternalUtilities.prendeFiltri(t, true, 'measures2');
                    const cm1 = filtri.cm1;
                    const cm2 = filtri.cm2;
                    const tf1 = filtri.tf1;
                    const tf2 = filtri.tf2;
                    // FILTER

                    vParams += ';v_filter_measr_code_1:' + cm1 + ';v_filter_measr_value_1:' + tf1 + ';';
                    vParams += 'v_filter_measr_code_2:' + cm2 + ';v_filter_measr_value_2:' + tf2 + '';

                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'BBOXs', ExternalUtilities.bboxOverview, ExternalUtilities.bboxZoom, ExternalUtilities.bboxMaschera[t.NumeroFrame2]);
                  
                    // logConsole('Disegna misure 9', vParams);

                    const tutto = false;
                    if (!tutto) {
                      const bbox = ExternalUtilities.ritornaBboxGiusta(t, 'Measures'); // ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
                      if (bbox.indexOf('NaN') > -1 || bbox.indexOf('undefined') > -1) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per bbox non valida: ', t.NumeroFrame2, bbox);
                        this.layerAttivo1[t.NumeroFrame2] = false;

                        return;
                      }
                      let bb = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';';
                      bb += 'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'BBOX ', bbox, bb);
                    
                      vParams += ';' + bb;
                    } else {
                      const bb = [ -90, -180, 90, 180 ];
                      vParams += ';geoants_bbox_min_x:' + bb[0] + ';geoants_bbox_min_y:' + bb[1] + 
                        ';geoants_bbox_max_x:' + bb[2] + ';geoants_bbox_max_y:' + bb[3];
                    }

                    // logConsole('Parametri', vParams);

                    // if (t.debug2 === true) {
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri measures: ', t.NumeroFrame2, vParams, sInizio, sFine);
                    // }

                    parameters = {
                      LAYERS: nomeLayer,
                      TILED: false,
                      STYLES: nomeStyle,
                      ENV: 'measr_num:' + (index) + ';style_size:' + stSize,
                      // CQL_FILTER: filtro + altro + tmsFilter + ' and act_id in (' + act_id + ')'
                      VIEWPARAMS: vParams,
                      NUMERO_FRAME: t.NumeroFrame2,
                      NUMERO_MISURA: index
                    };
                    // logConsole('Parametri', vParams);
                    
                    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
                      t.frameAttivo + ';' + t.act_set + ';';
                    const actualCall = 'MEASURES;' + JSON.stringify(parameters) + ';' + valoriDiBase + ';' + t.showMeasures2 ;
                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Paremeters: ', t.NumeroFrame, actualCall);

                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura da caricare', t.NumeroFrame2, index, actualCall);
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura caricata in precedenza', t.NumeroFrame2, index, t.lastCallMeasures[t.NumeroFrame2][index]);
                  
                    // logConsole('Disegna misure 10', parameters);

                    if (t.lastCallMeasures[t.NumeroFrame2][index] !== actualCall) {
                      //   (t.eseguitoInProgetto2 === true && t.progettoEsterno === 'FleetManager')) {

                      t.lastCallMeasures[t.NumeroFrame2][index] = actualCall;

                      // logConsole('Disegna misure 11');

                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna frame ' + t.NumeroFrame + ' misura', index, nomeLayer, nomeStyle);
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, parameters);

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

                          if (t.debug2 === true) {
                            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura caricata', t.NumeroFrame, index, parameters);
                          } */

                          // if (wms) {
                            if (t.measureLayer[t.NumeroFrame2][index] && t.measureLayer[t.NumeroFrame2][index].getSource() && this.GestisceLayerConSetSource) {
                              // logConsole('Update misure', t.NumeroFrame2, index);
                          
                              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure. Aggiorno il layer', index, t.measureLayer[t.NumeroFrame2][index]);

                              // try {
                                this.layerAttivo1[t.NumeroFrame2] = true;

                                t.measureLayer[t.NumeroFrame2][index].getSource().updateParams(parameters); // .setSource(wms);
                                
                                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.measureLayer[t.NumeroFrame2][index]);

                              // } catch (e) {
                              //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nell\'update del layer measure ' + index + ': ' + element, e['message']);
                              // }
                            } else {
                              // logConsole('Chiamata misure', t.NumeroFrame2, index);
                          
                              // t.measureLayer[t.NumeroFrame2].forEach(element2 => {
                              if (t.measureLayer[t.NumeroFrame2][index]) {
                                t.removeLayerFromMap('Measure layer' + index, t.measureLayer[t.NumeroFrame2][index]);
                                t.measureLayer[t.NumeroFrame2][index] = undefined;
                              }
                              // });
                              /* t.wms.forEach(element2 => {
                                element2 = undefined;
                              }); */

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
                              // t.wms[t.NumeroFrame2][index] = wms;
                              this.layerAttivo1[t.NumeroFrame2] = true;

                              if (newWms) {
                                t.addLayerToMap(newWms, 15 - index, 'Misura' + index + ':' + element);

                                t.measureLayer[t.NumeroFrame2][index] = newWms;
                                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure. Disegno per la prima volta', index, t.measureLayer[t.NumeroFrame2][index]);
                              } else {
                                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ERRORE Caricamento layer misure. LAYER Vuoto:', parameters);
                              }

                              // t.removeLayerFromMap('Measure layer' + index, t.measureLayer[t.NumeroFrame2][index]);                         
                              // t.wms[t.NumeroFrame2][index] = undefined;
                            }                        
                      } else {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ERRORE Caricamento layer misure (' + index + '). WMS uguale al precedente:', parameters);
                      }
                    }
                  /*       }
                    }, 1000); */

                    /* } else {
                      // Già caricato con gli stessi valori
                      t.removeLayerFromMap(t.measureLayer[t.NumeroFrame2][index]);
                      t.wms[t.NumeroFrame2][index] = undefined;
                      const tm = setTimeout(() => {
                        clearTimeout(tm);
                        t.addLayerToMap(t.measureLayer[t.NumeroFrame2][index], 9 - index, 'StessoMisura' + index + ':' + element);
                      }, 100);
                    } */
                  // }
                }
              } else {
                if (t.measureLayer[t.NumeroFrame2][index]) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulisco ultima chiamata misure 1');

                  t.lastCallMeasures[t.NumeroFrame2][index] = '';
                  t.removeLayerFromMap('Measure layer ' + index, t.measureLayer[t.NumeroFrame2][index]);
                  t.measureLayer[t.NumeroFrame2][index] = undefined;
                }
              }
            }

            index++;
          });
          // }
        } else {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ZERO MISURE');
          let c = 0;
          t.measureLayer.forEach(element => {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PULISCO MISURA ', c);
            t.removeLayerFromMap('Measure layer ' + c, element);
            element = undefined;
            c++;
          });
        }
        // t.impostaLayerAttivo1();
      }

      /* if (t.map1[t.NumeroFrame2]) {
        t.map1[t.NumeroFrame2].un('singleclick', this.pathComponent.clickOnMap);
        t.map1[t.NumeroFrame2].on('singleclick', this.pathComponent.clickOnMap.bind(null, this));
      } */

      // this.staDisegnandoMisure[t.NumeroFrame2] = false;
    }
  }

  disegnaMeasureSample(t, disegnoDaMosaic) {
    // logConsole('SMS 1', t.NumeroFrame2);

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo2[t.NumeroFrame2] = false;

      return;
    }

    // logConsole('SMS 2', t.NumeroFrame2);

    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo mappa', t.NumeroFrame2, t.MappaOGrafico2);
      this.layerAttivo2[t.NumeroFrame2] = false;

      return;
    }
    
    // logConsole('SMS 3', t.NumeroFrame2);

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna layer per SMS:', t.measureSMS2);
    if (t.ConnessioneStabilita === 'OK' && t.MappaOGrafico2 === 'M' && t.map1[t.NumeroFrame2]!== undefined) {
      /* if (t.staDisegnandoMisureSMS[t.NumeroFrame2] === true) {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna layer per SMS. Esco 1');
        }
        t.staDisegnandoServingCell[t.NumeroFrame2]  = false;

        return;
      } */

      if ((t.timeFilter === 2 || t.timeFilter2 === 'Time Range') && !t.Utils.tmsSelezionato) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna layer per SMS. Esco 2', t.timeFilter2, t.Utils.tmsSelezionato);

        t.staDisegnandoServingCell[t.NumeroFrame2]  = false;
        this.layerAttivo2[t.NumeroFrame2] = false;

        return;
      }

      // logConsole('SMS 4', t.NumeroFrame2);

      if (t.eseguitoInProgetto2 === true && (t.permessoFleetManagerAM2 === undefined || t.permessoFleetManagerAM2 === false)) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna layer per SMS. Esco 5');

        t.staDisegnandoServingCell[t.NumeroFrame2] = false;
        this.layerAttivo2[t.NumeroFrame2] = false;

        return;
      }

      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
      /* const ora = new Date().getTime();
      if (ora - this.ultimaVoltaTMS2 < t.ritardoPerFunzioni && this.ultimaVoltaTMS2 !== -1) {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna layer per SMS. Esco per troppo presto');
        }
        return;
      }
      this.ultimaVoltaTMS2 = ora; */
      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

      t.staDisegnandoMisureSMS[t.NumeroFrame2] = true;
      t.staDisegnandoMisureSMS = JSON.parse(JSON.stringify(t.staDisegnandoMisureSMS));

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura SMS', t.measureSMS2);

      // logConsole('SMS 5', t.NumeroFrame2);

      if (t.measureSMS2 && t.measureSMS2 !== '') {
        let parameters;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura per SMS prima:', t.measureSMS2);

        let misura = ExternalUtilities.ritornaMisura(t, t.measureSMS2, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Misure 2');
        if (!misura) { misura = '---'; }

        let ok = false;
        let scrittaSample = '';

        if (t.measureData2) {
          t.measureData2.forEach(element3 => {
            if (!ok && element3.CODE === misura) {
              ok = true;
              misura = element3.DISPLAY_NAME;
            }
          });
        }

        /* if (ok) {
          scrittaSample = misura;
        } else {
          scrittaSample = misura + ' <span style="color: red;">[NOT EXISTS]</span>';
        }
        t.scrittaSample = scrittaSample; */

        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura per SMS dopo:', misura);
        // }

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'SMS act set', t.act_set);
        // let act_set = '';
        // if (t.act_set) {
        // let wms = undefined; // ExternalUtilities.creaVettore(t.Utils.quanteMisure + 1, undefined);
        let nomeStyle;

        const sla = ExternalUtilities.tornaSla(t);
        /* if (sla !== undefined && sla !== '') {
          // sla = ' geo_sla_name = \'' + sla + '\'';
        } else {
          // sla = '';
        } */

        /* let act_id = ExternalUtilities.prendeTuttiIdActSet(t, false, t.Utils);
        const a = act_id.split(',');
        act_id = '';
        a.forEach(element => {
          act_id += element + '\\,';
        });
        if (act_id.length > 0) {
          act_id = act_id.substring(0, act_id.length - 2);
        } */

        // if (misura !== '---') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Mostro show measures s', t.showMeasuresS2);

        // logConsole('SMS 6', t.NumeroFrame2, misura, t.showMeasuresS2);

        if ((t.showMeasuresS2 === false || t.showMeasuresS2 === undefined)) { //  && disegnoDaMosaic === false) {
          // if (t.layerMeasureSMS {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elimino measure SMS', t.NumeroFrame2);
            
            t.lastCallMeasuresSMS[t.NumeroFrame2] = '';
            if (t.layerMeasureSMS[t.NumeroFrame2]) {
              t.removeLayerFromMap('Layer SMS', t.layerMeasureSMS[t.NumeroFrame2]);
              t.layerMeasureSMS[t.NumeroFrame2] = undefined;
            }

            t.staDisegnandoMisureSMS[t.NumeroFrame2] = false;
            const tm = setTimeout(() => {
              clearTimeout(tm);

              t.staDisegnandoMisureSMS = JSON.parse(JSON.stringify(t.staDisegnandoMisureSMS));
            }, 1000);
  
            this.layerAttivo2[t.NumeroFrame2] = false;
    
            return;
          // }
        } else {
          // logConsole('SMS 7', t.NumeroFrame2);

          const nomeLayer = 'Geo_ANTS:l_geo_measr_single';
          let filtro = '';
          let tipo = 'NESSUN TIPO';
          let nomeMisuraRilevata = 'NESSUNA MISURA RILEVATA';
          let mc = false;
          let altro = '';
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.measureData2);

          // logConsole('Misure per controllo coaxial 2', t.measureData2);
          if (t.measureData2) {
            t.measureData2.forEach(element2 => {
              // if (nomeLayer === '') {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2.NAME, element);
              if (element2.CODE === misura || element2.DISPLAY_NAME === misura) {
                if (element2.DISPLAY_NAME === misura) {
                  misura = element2.CODE;
                }
                nomeMisuraRilevata = element2.CODE;
                tipo = element2.TYPE;

                mc = true;
                // if (+element2.TYPE === 1) {
                  // nomeLayer = environment.layerNumerico;
                  switch (+t.mappeMS2) {
                    case 1:
                      nomeStyle = 's_geo_measr_num_line_band';
                      break;
                    case 2:
                      nomeStyle = 's_geo_measr_num_line_line';
                      break;
                    case 3:
                      nomeStyle = 's_geo_measr_num_line_coaxial';
                      break;
                  }
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeStyle);

                  /* if (sla !== '' && t.act_set !== '') {
                    // filtro = sla + ' and ' + act_set;
                  } else {
                    // filtro = sla + act_set;
                  } */
                  filtro = t.act_set;
                  altro = 'v_geo_sla_name:\'' + sla + '\';';
                /* } else {
                  if (+element2.TYPE === 5) {
                    // nomeLayer = 'Geo_ANTS:l_' + element2.CODE;
                    // filtro = element;
                    nomeStyle = '';
                    mc = false;
                  } else {
                    if (+element2.TYPE === 6) {
                      // nomeLayer = 'Geo_ANTS:l_' + element2.CODE;
                      nomeStyle = '';
                      // filtro = '';
                      mc = false;
                    } else {
                      mc = false;
                      // nomeLayer = environment.layerStringa;
                      /* if (t.styleMappa2 === 1) {
                        nomeStyle = 's_geo_measr_str_group_band';
                      } else {
                        nomeStyle = 's_geo_measr_str_group_line';
                      } * /
                      switch (+t.mappeMS2) {
                        case 1:
                          nomeStyle = 's_geo_measr_str_line_band';
                          break;
                        case 2:
                          nomeStyle = 's_geo_measr_str_line_line';
                          break;
                        case 3:
                          nomeStyle = 's_geo_measr_str_line_coaxial';
                          break;
                      }
                      // filtro = element;
                      // altro = '';
                    }
                  }
                } */
              }
              // }
            });
          }          
          // logConsole('Misure per controllo coaxial 2-2', nomeStyle, nomeLayer, altro);

          // if (t.debug2 === true) {
          //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Measure SMS frame ' + t.NumeroFrame + ': ', nomeLayer, misura, t.act_set);
          //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Filtro:', filtro);
          // }

          // altro = ' and measr_code=\'' + element + '\'';
          if (!mc) {
            altro = '';
          }

          // act_set += ' geo_act_set_name = \'' + t.act_set + '\'';
          let stSize = -1;
          if (t.styleSize2 === -1) {
            // GLOBAL STYLE SIZE
            stSize = t.styleSizeGlobale2;
          } else {
            stSize = t.styleSize2;
          }

          // logConsole('SMS 6', t.NumeroFrame2, nomeLayer);

          let sInizio = '';
          let sFine = '';
          // let tmsFilter = '';

          // Modifica richiesta 15/02/2021 mail 12/02/2021 17:35
          // Passo sempre range all
          // Non più (mail 02/05/2022 Ore 08:46)
          if (+t.timeFilter === 1 || t.timeFilter2 === 'All') {
            sInizio = t.timeRangeDSFStart2;
            sFine = t.timeRangeDSFStop2;
          } else {
            sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
            sFine = t.Utils.tmsFine; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
          }
          /* if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
            if (t.Utils.tmsInizio && t.Utils.tmsFine) {
              sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
              sFine = t.Utils.tmsFine; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
            } else {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.Utils.tmsSelezionato);
              if (t.Utils.tmsSelezionato) {
              }
            }
            if (sInizio !== '' && sFine !== '') {
              tmsFilter = ' and \'' + sInizio + '\' < tms_max and \'' + sFine + '\' > tms_min';
            }
          } else {
            sInizio = t.timeRangeDSFStart2;
            sFine = t.timeRangeDSFStop2;
            tmsFilter = ' and \'' + t.timeRangeDSFStart2 + '\' < tms_max and \'' + t.timeRangeDSFStop2 + '\' > tms_min';
          } */

          // logConsole('SMS 8', t.NumeroFrame2, sInizio, sFine);

          if (sInizio !== undefined && sInizio !== '') {
            if (sInizio.indexOf('\'') === -1) {
              sInizio =  '\'' + sInizio + '\'';
            }
          } else {
            sInizio = 'null';
          }

          if (sFine !== undefined && sFine !== '') {
            if (sFine.indexOf('\'') === -1) {
              sFine =  '\'' + sFine + '\'';
            }
          } else {
            sFine = 'null';
          }

          if (t.eseguitoInProgetto2 && t.tmsPassatiDaProgetto2) {
            /* const t1 = new Date().getTime() - (t.tmsPassati * 24 * 60 * 60 * 1000);
            sInizio = '\'' + t.datePipe.transform(t1, 'yyyy-MM-dd HH:mm:ss.SSS') + '\''; // , 'UTC'
            const t2 = new Date().getTime() + (24 * 60 * 60 * 1000);
            sFine = '\'' + t.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:ss.SSS') + '\''; // , 'UTC' */
            const tt = t.tmsPassatiDaProgetto2.split(';');
            sInizio = tt[0];
            sFine = tt[1];

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Impostate date per chiamata l_geo_measr_single', t.NumeroFrame2, sInizio, sFine, t.tmsPassatiDaProgetto2);
          }

          let valoreRicerca = t.act_set; // '\'' + t.act_set + '\'';
          if (t.eseguitoInProgetto2 === true) {
            // if (t.tipoDataset2 === 1) {
            //   valoreRicerca = t.agnGroup; // '\'' + t.agnGroup.replace('\'', '').replace('\'', '') + '\'';
            // } else {
            //   valoreRicerca = '\'' + t.actSetNameFM + '\'';
            // }
            if (t.listaActSet2) {
              valoreRicerca = '\'' + t.listaActSet2 + '\'';
            } else {
              if (t.agnGroup2 === undefined || t.agnGroup2 === 'undefined') {
                t.staDisegnandoSartPosition[t.NumeroFrame2] = false;
                this.layerAttivo2[t.NumeroFrame2] = false;
          
                return;
              }

              valoreRicerca = '\'' + t.agnGroup2 + '\'';
            }
          }

          // logConsole('SMS 8-5', t.NumeroFrame2, valoreRicerca, nomeMisuraRilevata);

          if (!valoreRicerca || valoreRicerca === 'undefined' || valoreRicerca === null || valoreRicerca === 'null') {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da disegna measure sample per valore activity vuoto', t.NumeroFrame2, valoreRicerca);
            this.layerAttivo2[t.NumeroFrame2] = false;

            return;
          }

          if (nomeMisuraRilevata === 'NESSUNA MISURA RILEVATA' || !altro) {
            /* console.error('Misura non rilevata nel frame ' + t.NumeroFrame2 + ' - ', 
              'Tipo misura: ' + tipo + ' - ', 
              'Misura rilevata: ' + nomeMisuraRilevata + ' - ',
              'Misura da ricercare: ' + misura + ' - ',
              'SLA Costruito: ' + altro); */
              this.layerAttivo2[t.NumeroFrame2] = false;
              if (t.layerMeasureSMS[t.NumeroFrame2]) {
                t.removeLayerFromMap('Layer SMS', t.layerMeasureSMS[t.NumeroFrame2]);
                t.layerMeasureSMS[t.NumeroFrame2] = undefined;
              }

              return;
          }

          // logConsole('SMS 8-75', t.NumeroFrame2, valoreRicerca);

          let vParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
            'v_act_set_name_list:\'' + valoreRicerca + '\';' +
            altro +
            'v_measr_code:\'' + misura + '\';' +
            'v_tms_min:' + sInizio + ';' +
            'v_tms_max:' + sFine;

          // logConsole('Misura sms', t.NumeroFrame2, t.measureSMS2, misura, vParams);

          // FILTER
          const filtri = ExternalUtilities.prendeFiltri(t, true, 'Measures1');
          const cm1 = filtri.cm1;
          const cm2 = filtri.cm2;
          const tf1 = filtri.tf1;
          const tf2 = filtri.tf2;
          // FILTER
          
          vParams += ';v_filter_measr_code_1:' + cm1 + ';v_filter_measr_value_1:' + tf1 + ';';
          vParams += 'v_filter_measr_code_2:' + cm2 + ';v_filter_measr_value_2:' + tf2 + '';

          /* let bbox = JSON.stringify(ExternalUtilities.bboxAttualeFisso); // JSON.stringify(ExternalUtilities.prendeBBOXSoloValori(t.map1[t.NumeroFrame2]));
          bbox = ExternalUtilities.effettuaReplace(bbox, ',', '\\,');
          vParams += ';v_bbox:\'' + bbox.replace('[', 'BOX(').replace(']', ')') + '\''; */

          const bbox = ExternalUtilities.ritornaBboxGiusta(t, 'Measures'); // ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
          if (bbox.indexOf('NaN') > -1 || bbox.indexOf('undefined') > -1) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per bbox non valida: ', t.NumeroFrame2, bbox);
          }
          let bb = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';';
          bb += 'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];
          vParams += ';v_bbox:\'BOX(' + bbox[0] + '|' + bbox[1] + '|' + bbox[2] + '|' + bbox[3] + ')\'';
          // v_bbox:|BOX(12.374755124609376|41.79671671252345|12.443419675390627|41.84788666454887|)
  
          parameters = {
            LAYERS: nomeLayer,
            TILED: false,
            // STYLES: nomeStyle,
            ENV: 'style_size:' + stSize,
            // CQL_FILTER: filtro + altro + tmsFilter + ' and act_id in (' + act_id + ')'
            VIEWPARAMS: vParams
          };

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Parametri measures SMS: ', parameters);

          const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
            t.frameAttivo + ';' + t.showMeasuresS2;
          const actualCall = 'MEASURESSMS;' + JSON.stringify(parameters) + ';' + valoriDiBase + ';' + t.showMeasuresS;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Paremeters: ', t.NumeroFrame, actualCall);

          // logConsole('SMS 9', t.NumeroFrame2, parameters);

          if (t.lastCallMeasuresSMS[t.NumeroFrame2] !== actualCall) {
            t.lastCallMeasuresSMS[t.NumeroFrame2] = actualCall;

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Leggo Misure SMS', t.NumeroFrame, actualCall);

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna frame ' + t.NumeroFrame + ' misura', index, nomeLayer, nomeStyle);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, parameters);

            // logConsole('SMS 10', t.NumeroFrame2);

            if (t.layerMeasureSMS[t.NumeroFrame2] && t.layerMeasureSMS[t.NumeroFrame2].getSource() && this.GestisceLayerConSetSource) {
              let nuoviParametri = { 
                LAYERS: nomeLayer,
                TILED: false,
                ENV: 'style_size:' + stSize,
                VIEWPARAMS: vParams
              };
              // logConsole('Nuovi parametri 1', nuoviParametri);

              this.layerAttivo2[t.NumeroFrame2] = true;

              t.layerMeasureSMS[t.NumeroFrame2].getSource().updateParams(nuoviParametri); // .setSource(wms);

              // logConsole('SMS 11', t.NumeroFrame2);
            } else {
              if (t.layerMeasureSMS[t.NumeroFrame2]) {
                t.removeLayerFromMap('Layer SMS 2', t.layerMeasureSMS[t.NumeroFrame2]);
                t.layerMeasureSMS[t.NumeroFrame2] = undefined;
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
                  if (!this.layerAttivo2[t.NumeroFrame2]) { return; }

                  const timestamp = new Date().getTime();
                  const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                  // logConsole('Measure 1', noCacheUrl);
                  const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                  // logConsole('Measure 2', noCacheUrl2);
                  image.getImage()['src'] = noCacheUrl2;
                }
              });

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
                    const newWms = new ImageLayer({
                      source: wms
                    });
                    // t.wmsSMS[t.NumeroFrame2] = wms;

                    /* if (t.layerMeasureSMS) && this.GestisceLayerConSetSource) {
                      try {
                        t.layerMeasureSMS.setSource(newWms);
                      } catch (e) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nell\'update del layer measure sms', newWms, e['message']);
                      }
                    } else { */
                      t.layerMeasureSMS[t.NumeroFrame2] = newWms;
                      t.addLayerToMap(newWms, 6, 'MisuraSMS');

                      this.layerAttivo2[t.NumeroFrame2] = true;
                    // }
                  // }
              }

              t.staDisegnandoMisureSMS[t.NumeroFrame2] = false;

              // logConsole('SMS 12', t.NumeroFrame2);
              /* }
            }, 1000); */

          } else {
            // Già caricato con gli stessi valori
            // t.removeLayerFromMap('Layer SMS 3', t.layerMeasureSMS);
            // t.addLayerToMap(t.layerMeasureSMS, 6, 'RipresoMisuraSMS');

            // logConsole('SMS 13', t.NumeroFrame2);

            t.staDisegnandoMisureSMS[t.NumeroFrame2] = false;
          }
        }
          // }
        // }
      }
      // t.impostaLayerAttivo1();
    }

    // if (t.map1[t.NumeroFrame2]) {
    //   t.map1[t.NumeroFrame2].un('singleclick', this.pathComponent.clickOnMap);
    //   t.map1[t.NumeroFrame2].on('singleclick', this.pathComponent.clickOnMap.bind(null, this));
    // }

    /* const tm = setTimeout(() => {
          clearTimeout(tm);
      t.staDisegnandoMisureSMS[t.NumeroFrame2] = false;
      t.staDisegnandoMisureSMS = JSON.parse(JSON.stringify(t.staDisegnandoMisureSMS));
    }, 10); */
  }
}

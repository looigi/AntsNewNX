import { logConsole } from '../console-log';
// import {isNumeric} from 'rxjs/util/isNumeric';
import { ExternalApiService } from './../services/externalapi.service';
// import { SessionService } from './../../../../db/session.service';
// import * as CanvasJS from '../js/canvasjs.min';
// import * as CanvasJS from '../../../../assets/js/canvasjs.min.js';
import { Injectable } from '@angular/core';
// import Utils from '../Utilities.component';
import { environment } from '../../../../environments/environment';
import ExternalUtilities from '../ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';
// import * as CanvasJS from './canvasjs.min.js';

// declare const CanvasJS: any;

@Injectable()
export class ScatterComponent {
  destroy$ = new FineRichieste();

  // PROVARE INCREMENTANDO DI 100 IL VALORE DELLA DIMENSIONE DELLE BOLLE



  // lastCallScatter = undefined; // ['', '', '', '', '', '', '', '', '', '', '','', '', '', '', '', '', '', '', '', '', ''];

  // staGiaDisegnandoGraficiScatter = [false, false,false,false,false,false,false,false,false,false,false,
  //                                   false, false,false,false,false,false,false,false,false,false,false];
  // lastCall = ['', '', '', '', '', '', '', '', '', '',  ''];
  /* tipiApp = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  righeApp = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  arrayApp = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  minYApp = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  maxYApp = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]; */

  vecchiaMassimizzata = false;
  // vecchioJson = ['', '', '', '', '', '', '', '', '', '', ''];
  // righeScatter = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //               undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // tipiScatter = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //               undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // arrayScatter = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //               undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // asseYMin = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // asseYMax = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // asseXMin = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // asseXMax = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // charts = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //           undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // coloriFinali = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //   undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // minYScatter = undefined;
  // maxYScatter = undefined;

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService
  ) {

  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    /* for (let i = 0; i < 500; i++) {
      const nome = "chartContainersScatter_" + t.frameAttivo2 + "_" + t.NumeroFrame2 + "_" + i;
      const divGrafico = document.getElementById(nome);
      if (divGrafico) {
        divGrafico.outerHTML = '';
        divGrafico.remove();
        // // logConsole('PULIZIA ISTOGRAMMI', nome);
      }
    }

    const divGraficoContenitoreInterno = document.getElementById('divScatter');
    if (divGraficoContenitoreInterno) {
      divGraficoContenitoreInterno.outerHTML = '';
      divGraficoContenitoreInterno.remove();
    } */

    t.lastCallScatter[t.NumeroFrame2] = '';
    t.vecchioJsonScatter[t.NumeroFrame2] = '';

    // t.chartsScatter[t.NumeroFrame2] = new Array();
    t.arrayScatter[t.NumeroFrame2] = new Array();
    t.righeScatter[t.NumeroFrame2] = new Array();
    t.tipiScatter[t.NumeroFrame2] = new Array();
    t.asseYMin[t.NumeroFrame2] = -1;
    t.asseYMax[t.NumeroFrame2] = -1;
    t.asseXMin[t.NumeroFrame2] = -1;
    t.asseXMax[t.NumeroFrame2] = -1;
    t.coloriFinali[t.NumeroFrame2] = '';

    t.measureDaDisegnareScatter = new Array();

    /* if (t.chartsScatter[t.NumeroFrame2]) {
      t.chartsScatter[t.NumeroFrame2].forEach(element => {
        if (element && element.container && element.container !== null) {
          element.destroy();
        }
      });
      t.chartsScatter[t.NumeroFrame2] = new Array();
    } */
  }

  pulisceValoriDiAppoggio(t) {
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulisco valori Pareto');
    // t.measureDaDisegnareScatter = new Array();
    // t.Utils.altezzaGraficoScat = new Array();

    // this.righeScatter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, new Array());
    // this.tipiScatter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, new Array());
    // this.arrayScatter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
    // this.minYScatter = t.Utils.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 9999);
    // this.maxYScatter = t.Utils.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -9999);
  }

  ultimaVoltaEseguo = -1;

  disegnaScatter(t, soloEstrazioneDati, forzaRidisegno) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'PS') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo scatter', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno scatter', t.NumeroFrame2, t.frameVisible2);


    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'PS' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Esco per problemi di view', t.NumeroFrame2);
      }
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'esco 1');
      return;
    } */

    /* if (this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] === true) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Struttura click nulla');
      // t.comboDisabilitata = false;
      // const tm = setTimeout(() => {
          clearTimeout(tm);
      //   this.staGiaDisegnandoGraficiScatter = false;
      // }, 2000);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'esco 2');
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Sta già disegnando', t.NumeroFrame2);
      }
      return;
    } */

    if (t.subscribe !== null) {
      t.comboDisabilitata = false;
      t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'esco 3');
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Subscribe già attivo', t.NumeroFrame2);
      // }
      return;
    }

    let act_set = ExternalUtilities.ritornaStringPerActivitySet(t, t.Utils);
    act_set = act_set.replace('geo_act_set_name_1:', '');
    if (act_set === '' || !act_set || act_set === 'undefined') {
      t.comboDisabilitata = false;
      t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
      // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: act_set vuoto', t.NumeroFrame2);
      // }
      return;
    }

    // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = true;
    t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = true;

    /* let tms = '';
    if (t.timeFilter === 2) {
      tms = t.strutturaClick.tms;
      if (!tms) {
        tms = t.strutturaClick.tms_min;
      }
    } else {
      tms = 'ALL';
    }
    if (tms) { *///
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Struttura arrivata: ', t.strutturaClick);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Timestamp di riferimento:', tms);
    let q = 0;
    if (t.Measure && t.Measure !== null) {
      t.Measure.forEach(element => {
        if (element && element !== '') {
          q++;
        }
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Esco per misure vuote', t.NumeroFrame2);
      }
      t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter. Misure selezionate:', q);
    let sla = ExternalUtilities.tornaSla(t);
    if (sla !== undefined && sla !== '') {
      // sla = 'sla_name:' + sla;
    } else {
      sla = '';
    }
        
    if (!sla) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Esco per sla non valido');
      }
      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter sla:', sla);

    if (q > 0 && t.datiSlaDT2 !== undefined && sla !== '') {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.listaActivityName2);
      /* let list_Act = '';
      if (t.listaActivityName2 !== undefined) {
        t.staGiaDisegnandoGraficiHistogram = true;
        t.caricamentoDatiInCorsoHistogram = true;
        */

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ACT SET SCATTER:', t.strutturaClick.geo_act_set_name);
      // const act_set = t.strutturaClick.geo_act_set_name;
      /* if (t.act_set) {
        act_set = t.act_set;
      } else {
        t.strutturaGraficiVuota = true;
        t.staGiaDisegnandoGrafici = false;
        // t.caricamentoDatiInCorso = false;
        t.comboDisabilitata = false;
        return;
      } */

      let tmsFilter = '';
      let sInizio = '';
      let sFine = '';
      if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
        // const dInizio = ((new Date(t.Utils.tmsSelezionato).getTime()) - (t.Utils.rangeDiSecondiPerMille)) +
        //   (new Date().getTimezoneOffset() * 60000);
        sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
        // const dFine = ((new Date(t.Utils.tmsSelezionato).getTime()) + (t.Utils.rangeDiSecondiPerMille)) +
        //   (new Date().getTimezoneOffset() * 60000);
        sFine = t.Utils.tmsFine; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
        tmsFilter = 'tms_min:' + sInizio + ';tms_max:' + sFine + ';';
        if (t.Utils.tmsInizio === undefined || t.Utils.tmsFine === undefined) {
          // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
          t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Esco per tms non validi 1', t.NumeroFrame2, t.Utils.tmsInizio, t.Utils.tmsFine);
          }

          t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
          return;
        }
      } else {
        tmsFilter = 'tms_min:' + t.timeRangeDSFStart2 + ';tms_max:' + t.timeRangeDSFStop2 + ';';
        sInizio = t.timeRangeDSFStart2;
        sFine = t.timeRangeDSFStop2;
      }
      if (!sInizio || sInizio === '' || sInizio === null) {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Esco per tms vuoti', t.NumeroFrame2);
        }

        t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
        return;
      }

      // const nomeChart2 = 'chartContainersHystogram';
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tmsFilter);

      const array = new Array();

      let n = 0;
      // t.Measure.forEach(element => {
      for (let i = 1; i <= t.Utils.quanteMisureScatter; i++) {
        const element = t.Measure[i];
        const misura = ExternalUtilities.ritornaMisura(t, element, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Scatter 1');
        if (misura) {
          array.push(misura);
        } else {
          array.push('---');
        }

        /* if (element && element !== '' && element !== null) {
          if (element.toUpperCase().indexOf('<GLOBAL MEASURE>') > -1 || (element.indexOf('global_measure') > -1 && element.indexOf('global_measure_') === -1)) {
            t.measureData2.forEach(element2 => {
              if (element2.CODE === t.Utils.globalMeasure.MEASR_CODE) {
                const m = element2.CODE.replace('"', '').replace('"', '');
                array.push(element.replace('<GLOBAL MEASURE>', m).replace('global_measure', m));
              }
            })
          } else {
            // MAIL 18/07/2023 16:30 -> possibilità di usare anche sulle mappe e volendo istogrami, pareto etc le <globaly checked measure>
            if (element.indexOf('<GLOBAL CHECKED MEASURE ') > -1 || element.indexOf('global_measure_') > -1) {
              let indice;
              if (element.indexOf('<GLOBAL CHECKED MEASURE ') > -1) {
                indice = +(element.replace('<GLOBAL CHECKED MEASURE ', '').replace('>', ''));
              } else {
                indice = +(element.replace('global_measure_', ''));
              }        

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Indicie: ', indice, ExternalUtilities.misureGlobali)
              if (indice && indice > 0) {
                if (ExternalUtilities.misureGlobali && ExternalUtilities.misureGlobali[indice - 1] !== '') {
                  let cosa;
                  if (ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE']) {
                    cosa = ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE'];
                  } else {
                    cosa = ExternalUtilities.misureGlobali[indice - 1];
                  }
                  // Modifica 25/02/2025
                  // array.push(cosa);
                  array.push(element.replace('global_measure_' + indice, cosa).replace('<GLOBAL CHECKED MEASURE ' + indice + '>', cosa));
              } else {
                  array.push('---');
                }
              } else {
                array.push('---');
              }
            } else {
              // MAIL 18/07/2023 16:30 -> possibilità di usare anche sulle mappe e volendo istogrami, pareto etc le <globaly checked measure>
              array.push(element);
            }
          }
        } else {
          array.push('---');
        } */
      };
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure scatter: ', t.Utils.quanteMisureScatter, t.Measure, array);

      let index = 0;
      // let params = 'viewparams=';

      const misure = new Array();

      array.forEach(async element => {
        if (element !== '---') {
          let campo = '';
          let tipo = '';

          t.measureData2.forEach(element2 => {
            if (campo === '' && element2) {
              if (element2 && element2.CODE && element2.CODE.toLowerCase().trim() === element.toLowerCase().trim()) {
                index++;
                campo = element2.CODE.toLowerCase().trim();
                /* if (element2.TYPE !== 1) {
                  tipo = 'str_measr_code_' + index;
                } else {
                  tipo = 'num_measr_code_' + index;
                } */
                tipo = 'measr_code_' + index;

                const altro = tipo + ':' + campo + ';';
                // params += altro;
                let code = element2.CODE;
                while (code.indexOf('\'') > -1) {
                  code = code.replace('\'', '');
                }
                while (code.indexOf('"') > -1) {
                  code = code.replace('"', '');
                }
                misure.push(code);
              }
            }
          });
        }
      });

      // params += (sla + ';');
      // params += (act_set + ';');
      // params += tmsFilter;

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
      // tmsFilter = '';

      if (misure.length < t.Utils.quanteMisureScatter) {
        for (let i = misure.length; i <= t.Utils.quanteMisureScatter ; i++) {
          misure.push(null);
        }
      }

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Misure impostate', t.NumeroFrame2, misure);
      }

      const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

      if (sInizio !== null && sInizio !== 'null') {
        sInizio = '"' + sInizio + '"';
      }
      if (sFine !== null && sFine !== 'null') {
        sFine = '"' + sFine + '"';
      }

      // FILTER
      const filtri = ExternalUtilities.prendeFiltri(t, false, 'Scatter');
      const cm1 = filtri.cm1;
      const cm2 = filtri.cm2;
      const tf1 = filtri.tf1;
      const tf2 = filtri.tf2;
      // FILTER

      let params;
      if (t.Utils.tmsInizio && t.Utils.tmsFine && tmsFilter !== '') {
        params = '{ ' +
          '"cntx_id": "' + t.sessionID2 + '",' +
          // '"v_caller_tag": "' + t.chiSonoScatter[t.NumeroFrame2] + '",' +
          '"v_act_set_name_list": "' + t.act_set + '", ' +
          '"v_geo_sla_name": "' + sla + '", ' +
          '"v_tms_min": ' + sInizio + ',' +
          '"v_tms_max": ' + sFine + ', ' +
          '"v_aggr_type": "group", ' +
          '"v_measr_code_1": "' + misure[0] + '", ' +
          '"v_measr_code_2": "' + misure[1] + '", ' +
          '"v_measr_code_3": "' + misure[2] + '", ' +
          '"v_measr_code_4": "' + misure[3] + '", ' +
          '"v_bbox": "' + geoFilter + '", ' +
          '"v_filter_measr_code_1": "' + cm1 + '", ' +
          '"v_filter_measr_value_1": "' + tf1 + '", ' +
          '"v_filter_measr_code_2": "' + cm2 + '", ' +
          '"v_filter_measr_value_2": "' + tf2 + '", ';
        // ' }';
      } else {
        params = '{ ' +
          '"cntx_id": "' + t.sessionID2 + '",' +
          // '"v_caller_tag": "' + t.chiSonoScatter[t.NumeroFrame2] + '",' +
          '"v_act_set_name_list": "' + t.act_set + '", ' +
          '"v_geo_sla_name": "' + sla + '", ' +
          '"v_tms_min": ' + sInizio + ',' +
          '"v_tms_max": ' + sFine + ', ' +
          '"v_aggr_type": "group", ' +
          '"v_measr_code_1": "' + misure[0] + '", ' +
          '"v_measr_code_2": "' + misure[1] + '", ' +
          '"v_measr_code_3": "' + misure[2] + '", ' +
          '"v_measr_code_4": "' + misure[3] + '", ' +
          '"v_bbox": "' + geoFilter + '", ' +
          '"v_filter_measr_code_1": ' + cm1 + ', ' +
          '"v_filter_measr_value_1": ' + tf1 + ', ' +
          '"v_filter_measr_code_2": ' + cm2 + ', ' +
          '"v_filter_measr_value_2": ' + tf2 + ', ';
        // ' }';
      }
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Parametri', t.NumeroFrame2, params);
      }
      // const propName = 'propertyName=value_1,value_2,value_3,value_4,color_3,count';

      const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
        t.frameAttivo + ';';
      const actualCall = 'SCATTER;' + params + ';' + array + valoriDiBase + ';' + t.heightChart2 + ';' + t.timeFilter + ';' + t.timeFilter2;

      /* if (t.massimizzata !== this.vecchiaMassimizzata || forzaRidisegno === true) {
        const tm = setTimeout(() => {
          clearTimeout(tm);
          const altezzaDIV = t.divScatter.nativeElement.offsetHeight;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Ridisegno per adattarlo alla finestra', t.NumeroFrame2, altezzaDIV);
          }

          this.vecchiaMassimizzata = t.massimizzata;
          if (t.vecchioJson[t.frameAttivo2]) {
            this.elaboraRigheJSON(t, t.vecchioJson[t.frameAttivo2]);

            t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
            t.comboDisabilitata = false;
            // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
          }
        }, 1000);
      } else { */
       // let leggiPerForza = true;

        if (soloEstrazioneDati || 
          (t.lastCallScatter[t.NumeroFrame2] !== actualCall ||
            t.tipiScatter[t.NumeroFrame2] === undefined || t.tipiScatter[t.NumeroFrame2].length === 0 ||
            t.righeScatter[t.NumeroFrame2] === undefined || t.righeScatter[t.NumeroFrame2].length === 0)) {
          t.lastCallScatter[t.NumeroFrame2] = actualCall;
          // t.Utils.rinfrescaGraficoScatter = false;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Richiamo url scatter frame', t.NumeroFrame2, actualCall);

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Eseguo lettura', t.NumeroFrame2);
          }

          if (soloEstrazioneDati === false) {
            this.pulisceValoriDiAppoggio(t);
          }

          const app = JSON.parse(JSON.stringify(array));

          // const layer = 'Geo_ANTS:l_geo_measr_group';
          // const csv = await t.downloadFile.downloadCSV(layer, '', '', '', '',
          //             propName, 'application/json', params, 'EXECUTE', true, 'Scatter');

          t.arrayScatter[t.NumeroFrame2] = JSON.parse(JSON.stringify(app));

          t.righeScatter[t.NumeroFrame2] = new Array();
          t.tipiScatter[t.NumeroFrame2] = new Array();
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CSV:', csv);

          // return;

          t.erroreScatter[t.NumeroFrame2] = '';

          t.chiSonoScatter[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
          params += '"v_caller_tag": "' + t.chiSonoScatter[t.NumeroFrame2] + '" }';

          // logConsole('SCATTER: ', JSON.parse(params));

          t.lastCallScatter2[t.NumeroFrame2] = JSON.parse(params);
          this.apiService.chiamataPost(t.Utils, 'geo_measure_sample_cross__sel', JSON.parse(params))
          // .map(response => response)
            .pipe(takeUntil(this.destroy$.per(t)))
            .subscribe((data2: any) => {
              // const data2 = JSON.parse(data);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Ritorno:', righeJson);
              ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

              if (!t.controllaRitornoChiamata(t, data2, 'Sample Cross Scatter')) {
                t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
                return;
              }

              if (data2 && data2.v_req_tms) {
                const ritorno = new Date(data2.v_req_tms);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno: ', ritorno);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia: ', t.timeStampChiamataTCRUN);
                if (t.timeStampChiamataScatter && ritorno.getTime() < t.timeStampChiamataScatter.getTime()) {
                  if (t.debug2 === true) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: esco per query vecchia', ritorno, t.timeStampChiamataScatter);
                  }

                  t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
                  return;
                } else {
                  t.timeStampChiamataScatter = ritorno;
                }
              }

              /* const colori = new Array();
              righeJson.DataTable.forEach(element => {
                const colore = element.color_3;
                let ok = true;
                colori.forEach(element2 => {
                  if (element2.colore === colore) {
                    ok = false;
                    element2.quanti++;
                  }
                });
                if (ok) {
                  const c = { colore: colore, quanti: 0};
                  colori.push(c);
                }
              });
              t.coloriFinali[t.frameAttivo2] = colori;
              t.coloriFinali[t.frameAttivo2].sort((a, b) => b.quanti - a.quanti);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Conteggio colori:', t.coloriFinali[t.frameAttivo2]);
              t.legendaScatter = t.coloriFinali[t.frameAttivo2]; */
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: righeJson', data2);
              }

              if (data2 && data2.message && data2.message !== '') {
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Messaggio rilevato ', data2.message);
                }

                // ExternalUtilities.messaggioDiErrore('null', data.message);
                t.erroreScatter[t.NumeroFrame2] = ' ERROR: ' + data2.message;

                // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
                t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
              } else {
                if (data2.v_legend_table) {
                  t.coloriFinali[t.frameAttivo2] = data2.v_legend_table;
                  // t.legendaScatter = new Array();
                  // const tm = setTimeout(() => {
                  // clearTimeout(tm);
                    t.legendaScatter = data2.v_legend_table;
                  // }, 100);
                } else {
                  t.coloriFinali[t.frameAttivo2] = new Array();
                  t.legendaScatter = new Array();
                }

                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: legenda', data2.v_legend_table);
                }

                // const errori = t.Utils.contaErrori(csv);
                // if (errori === 0) {
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, csv);
                // const righeJson = JSON.parse(csv.toString());
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati letti per lo scatter:', righeJson.DataTable);

                if (soloEstrazioneDati === true) {
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Salvo i valori pareto', t.NumeroFrame2);
                  const nomeFile = 'GeoAnts_' + act_set + '_' + t.frameName + '_Scatter.csv';
                  // ExternalUtilities.salvaCSV(righeJson, nomeFile);

                  t.exportGridComponent.creaGriglia(t, data2, 'Scatter Data');

                  t.comboDisabilitata = false;
                  t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
                  // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
                  return;
                }

                // t.quantiGraficiSCCiSono = 0;
                // const righe = new Array();
                // const tipi = new Array();
                // let minY = 999;
                // let maxY = -999;

                // t.Utils.contatoreGraficiScatter[t.frameAttivo][t.NumeroFrame] = 0;
                // t.Utils.quantoContatoreGraficiScatter[t.frameAttivo][t.NumeroFrame] = 0;
                t.vecchioJson[t.frameAttivo2] = data2;

                this.elaboraRigheJSON(t, data2);
              }
              
              /* const quantiGrafici = t.righeScatter[t.NumeroFrame2].length;
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Numero grafici scatter', quantiGrafici);
              t.measureDaDisegnareScatter = t.righeScatter[t.NumeroFrame2]; // t.tipiScatter[t.NumeroFrame2]; */
      
              // const appoChart = new Array();
              // let n = 0;
             }, error => {
              // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
              t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;

              if (error._body) {
                try {
                  const e = JSON.parse(error._body);
                  t.erroreScatter[t.NumeroFrame2] = ' ERROR: ' + JSON.stringify(e.message);
                } catch (e) {
                  t.erroreScatter[t.NumeroFrame2] = error._body;
                }
              } else {
                t.erroreScatter[t.NumeroFrame2] = ' ERROR: ' + JSON.stringify(error);
              }
              return;
            });
            // } else {
            //   t.caricamentoDatiInCorsoScatter = false;
            //   t.comboDisabilitata = false;
            //   this.staGiaDisegnandoGraficiScatter = false;
            // }
        } else {
          // if (t.forzaRidisegnoScatter) {
              // Già caricato con gli stessi valori
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno senza richiamare url scatter frame', t.NumeroFrame2, actualCall);
            t.legendaScatter = t.coloriFinali[t.frameAttivo2];

            ExternalUtilities.distruggiGrafici(t.chartsScatter[t.NumeroFrame2]);
            t.chartsScatter[t.NumeroFrame2] = new Array();
            this.disegnaGrafici(t);
            
            /* if (t.Utils.dimensioniFramesModif[t.NumeroFrame] !== t.Utils.dimensioniFrames[t.NumeroFrame]) {
              t.Utils.dimensioniFramesModif[t.NumeroFrame] = t.Utils.dimensioniFrames[t.NumeroFrame];
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'RIDISEGNO SCATTER');
            } */

            // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
          }
          t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
        // }
      // }
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scatter: Esco per problemi di impostazione', t.NumeroFrame2, q, t.datiSlaDT2, sla);
      }

      t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
      t.comboDisabilitata = false;
      // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
    }
    // }
  }

  elaboraRigheJSON(t, righeJson) {
    if (righeJson.DataTable === null) {
      // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
      t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da elabora righe scatter per datatable nullo');
      }
    } else {
      t.asseYMax[t.frameAttivo2] = righeJson.value_2_max + 1;
      t.asseYMin[t.frameAttivo2] = righeJson.value_2_min - 1;

      t.asseXMax[t.frameAttivo2] = righeJson.value_1_max + 1;
      t.asseXMin[t.frameAttivo2] = righeJson.value_1_min - 1;

      const vCount = righeJson.v_count;
      const valoreMedioCount = vCount / righeJson.DataTable.length;

      righeJson.DataTable.forEach(element => {
        // const element = ele.properties;
        let tipoGrafico = element.value_4;

        /* if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tipo grafico scatter', tipoGrafico);
        } */

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tipoGrafico);
        if (tipoGrafico === undefined) {
          tipoGrafico = 'UNDEFINED';
        }
        if (tipoGrafico !== null && tipoGrafico !== '') {
          let index3 = 0;
          let qualeIndex = -1;
          t.tipiScatter[t.NumeroFrame2].forEach(element2 => {
            if (qualeIndex === -1 && tipoGrafico === element2) {
              qualeIndex = index3;
            }
            index3++;
          });
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, qualeIndex);

          if (qualeIndex === -1) {
            t.righeScatter[t.NumeroFrame2].push('');
            t.tipiScatter[t.NumeroFrame2].push(tipoGrafico);
            qualeIndex = t.tipiScatter[t.NumeroFrame2].length - 1;

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'X:', GestioneGrafici.asseXScatter[qualeIndex]);
          }

          const valoreX = element.value_1;
          const valoreYApp = element.value_2;
          const valoreC = element.color_3;
          const valoreCS = element.value_3;
          const valoreD = Math.round(Math.sqrt(element.count) / valoreMedioCount); // (Math.round(Math.sqrt(Math.log(element.count))) * 5) * 3; //
          const valoreDC = element.count;
          const valoreL = element.value_3;

          let valoreY;

          /* if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ValoreYApp scatter', valoreYApp);
          } */
    
          if (valoreYApp !== null) {
            /* if (typeof(valoreYApp) === 'string') {
              valoreY = '"' + valoreYApp + '"';
            } else { */
            if (typeof(valoreYApp) === 'string') {
              valoreY = valoreYApp;
            } else {
              valoreY = +valoreYApp;
            }
            // }

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, valoreY, valoreYApp);
            /* if (valoreY > this.maxYScatter[t.frameAttivo][t.NumeroFrame] && valoreY !== null) {
              this.maxYScatter[t.frameAttivo][t.NumeroFrame] = valoreY;
            }
            if (valoreY < this.minYScatter[t.frameAttivo][t.NumeroFrame] && valoreY !== null) {
              this.minYScatter[t.frameAttivo][t.NumeroFrame] = valoreY;
            } */
          } else {
            valoreY = null;
          }
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);

          /* if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'valoreX scatter', valoreX);
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'valoreC scatter', valoreC);
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'valoreY scatter', valoreY);
          } */
            
          if (valoreX !== undefined && valoreY !== undefined && valoreC !== undefined &&
              valoreX !== null && valoreY !== null && valoreC !== null &&
              valoreX !== '' && valoreC !== '' &&
              valoreX !== 'NoValue' && valoreC !== 'NoValue' && valoreX !== 'no value' &&
              valoreX !== 'NaN'  && valoreC !== 'NaN' && valoreY.toString() !== 'NaN') {
                // && !isNaN(valoreX) && !isNaN(valoreC)

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, valoreX, valoreY, valoreC);
            const valoreC2 = valoreC + '33';
            // "markerSize": ' + valoreD + ',
            t.righeScatter[t.NumeroFrame2][qualeIndex] += '{ "x": ' + valoreX + ', "label": "' +
                valoreX + '", "y": ' + valoreY + ', "z": ' + valoreDC + ', "color": "' + valoreC2 + '", "descColor": "' + valoreCS +
                '", "count": ' + valoreDC + ', "labelIndex": "' + valoreL + '", ' +
                '"markerBorderColor": "' + valoreC + '", "markerBorderThickness": "1"},';
            // if (t.quantiGraficiSCCiSono === 0) {
            //   t.quantiGraficiSCCiSono = 1;
            // }
                // } else {
          //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scartata riga della misura ' + tipoGrafico);
          }
        }
      });
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Righe scatter', t.righeScatter[t.NumeroFrame2]);
      }

      // if (!tipi || tipi.length === 0) {
      //   ExternalUtilities.messaggioDiErrore(t, 'No valid data to show scatter: no chart types');
      // }

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Min-Max', minY, maxY);

      /* if (this.minYScatter[t.frameAttivo][t.NumeroFrame] > this.maxYScatter[t.frameAttivo][t.NumeroFrame]) {
        const app2 = this.minYScatter[t.frameAttivo][t.NumeroFrame];
        this.minYScatter[t.frameAttivo][t.NumeroFrame] = this.maxYScatter[t.frameAttivo][t.NumeroFrame];
        this.maxYScatter[t.frameAttivo][t.NumeroFrame] = app2;
      } */

      /* this.tipiApp[t.NumeroFrame] = tipi;
      this.righeApp[t.NumeroFrame] = righe;
      this.arrayApp[t.NumeroFrame] = array;
      this.minYApp[t.NumeroFrame] = minY;
      this.maxYApp[t.NumeroFrame] = maxY; */

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno grafici');
      this.disegnaGrafici(t);

      // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
      t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
    }
  }

  disegnaGrafici(t) {
    if (t.tipiScatter[t.NumeroFrame2] === undefined || t.righeScatter[t.NumeroFrame2] === undefined) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da disegna grafici scatter', t.tipiScatter[t.NumeroFrame2], t.righeScatter[t.NumeroFrame2]);
      }
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco');
      return;
    }

    // t.Utils.altezzaGraficoScatter[t.frameAttivo][t.NumeroFrame] = new Array();
    // t.measureDaDisegnareScatter = new Array();
    // logConsole('Scatter 1', t.righeScatter[t.NumeroFrame2]);
    // Sempre, non solo con struttura da ricreare: aggiungeGraficoScatter crea ogni volta grafici nuovi
    // (il ramo di aggiornamento è commentato), quindi i vecchi vanno distrutti, altrimenti l'elenco cresce a ogni ridisegno
    ExternalUtilities.distruggiGrafici(t.chartsScatter[t.NumeroFrame2]);
    t.chartsScatter[t.NumeroFrame2] = new Array();

    let index2 = 0;
    /* t.tipiScatter[t.NumeroFrame2].forEach(element => {
      if (t.righeScatter[t.NumeroFrame2][index2] && t.righeScatter[t.NumeroFrame2][index2] !== null) {
        t.measureDaDisegnareScatter.push('');
      }
      index2++;
    }); */
    // t.measureDaDisegnareScatter = t.tipiScatter[t.NumeroFrame2];

    // this.tipiScatter.forEach(element => {
    //   t.measureDaDisegnareScatter.push('');
      // t.Utils.altezzaGraficoScatter[t.frameAttivo][t.NumeroFrame].push(200);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.righeScatter);
    // });
    t.altezzaGraficoScatter[t.NumeroFrame2] = new Array();
    let quantiGrafici = 0;
    index2 = 0;
    t.tipiScatter[t.NumeroFrame2].forEach(element => {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.righeScatter[index2]);
      // t.Utils.contatoreGraficiScatter[t.frameAttivo][t.NumeroFrame]++;
      if (t.righeScatter[t.NumeroFrame2][index2] && t.righeScatter[t.NumeroFrame2][index2] !== null) {
        quantiGrafici++;
      }
      index2++;
    });

    if (quantiGrafici > 100) {
      t.erroreScatter[t.NumeroFrame2] = 'Too many charts (> 100)!';

      t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
      return;
    } else {
      if (quantiGrafici < 1) {
        t.erroreScatter[t.NumeroFrame2] = 'No charts!';

        t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;
        return;
      } else {
        t.erroreScatter[t.NumeroFrame2] = '';
      }
    }

    if (t.divScatter) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza grafico scatter', t.divScatter.nativeElement.offsetHeight);
    }
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Quanti grafici', quantiGrafici);

    const altezzaDIV = t.divScatter.nativeElement.offsetHeight;
    // logConsole('Scatter 1: ', altezzaDIV);
    // logConsole('Scatter 1.5: ', quantiGrafici);
    let altGrafico = altezzaDIV / quantiGrafici;
    if (altGrafico < 190) {
      altGrafico = 190;
    }
    // logConsole('Scatter 2: ', altGrafico);

    let fattore;
    if (t.heightChart2) {
      fattore = t.heightChart2;
      fattore = +(fattore.replace('X', ''));
    } else {
      fattore = 1;
    }
    // logConsole('Scatter 3: ', fattore, t.heightChart2);
    altGrafico *= fattore;
    // logConsole('Scatter 4: ', altGrafico);

    t.altezzaGraficoScatter[t.NumeroFrame2].push(altGrafico);

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza Grafici scatter', altGrafico);

    t.measureDaDisegnareScatter = new Array();
    index2 = 0;
    t.tipiScatter[t.NumeroFrame2].forEach(element => {
      t.measureDaDisegnareScatter.push('Grafico ' + index2);
      index2++;
    });

    const tipiOrdinati = t.tipiScatter[t.NumeroFrame2];
    tipiOrdinati.sort((a,b) => a.localeCompare(b));
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure da disegnare scatter', t.measureDaDisegnareScatter, t.tipiScatter[t.NumeroFrame2], tipiOrdinati);

    const tm = setTimeout(() => {
      clearTimeout(tm);    

      index2 = 0;
      // let index22 = 0;
      tipiOrdinati.forEach(element => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.righeScatter[index2]);
        // t.Utils.contatoreGraficiScatter[t.frameAttivo][t.NumeroFrame]++;
        // if (t.righeScatter[t.NumeroFrame2][index2] && t.righeScatter[t.NumeroFrame2][index2] !== null) {
          let index22 = -1;
          const tipo = element;
          let ok = false;
          t.tipiScatter[t.NumeroFrame2].forEach(element2 => {
            if (!ok && element2 === tipo) {
              ok = true;
            } else {
              index22++;
            }
          });
          if (ok) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiunge grafico scatter ', tipo, index2.toString(), index22.toString());

            const nomeChart = 'chartContainersScatter_' + t.frameAttivo + '_' + t.NumeroFrame + '_' + index2;
            /* let divIstogramma = document.getElementById(nomeChart);
            if (divIstogramma !== null) {

            } else {

            } */
            this.aggiungeGraficoScatter(t, nomeChart, element, index22, t.righeScatter[t.NumeroFrame2][index2],
                            t.arrayScatter[t.NumeroFrame2], t.asseYMin[t.frameAttivo2], t.asseYMax[t.frameAttivo2],
                            t.measureData2);
            // index22++;
          } else {
            console.error('Grafico scatter ' + tipo + ' non rilevato', t.tipiScatter[t.NumeroFrame2])
          }
        // }
        index2++;
      });

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Render scatter');
      index2 = 0;
      t.chartsScatter[t.NumeroFrame2].forEach(element2 => {
        if (element2 && element2.canvas && element2.canvas !== null) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Render grafico scatter ', index2, element2);
          element2.render();

          // element2.set('dataPointWidth', Math.ceil(element2.axisX[0].bounds.width / element2.data[0].dataPoints.length), true);
        }
        index2++;
      });
      if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
        t.giaDisegnataStruttura[t.NumeroFrame2] = true;
      }

      t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false;

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Combo abilitata');
      t.comboDisabilitata = false;
      // this.staGiaDisegnandoGraficiScatter[t.NumeroFrame2] = false;
    }, 100);
  }

  aggiungeGraficoScatter(t, nomeChart, element, index, riga, misure, minY, maxY, datiMisure) {
    let righe = JSON.parse(JSON.stringify(riga));

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righe);
    if (righe.length > 1) {
      righe = righe.substring(0, righe.length - 1);
    }
    righe = '[' + righe + ']';

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righe);
    let righeJson;
    try {
      righeJson = JSON.parse(righe);
    } catch(e) {
      console.error('Errore di conversione dati json per scatter: ', righe);
    }

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'RigheJson scatter', righeJson);
    }
    // logConsole('Scatter 1', righeJson);
    
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righeJson);
    const campo = element;
    const display_name2 = campo; //  ExternalUtilities.PrendeNomeMisuraDaCodice(campo, t.measureData2, 'Scatter1');

    const puntini = {
      datasets: [{
        name: campo,
        data: righeJson,
        type: 'bubble'
      }]
    };
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, puntini);

    const misureDaScrivere = new Array();
    for (let i = 1; i <= t.Utils.quanteMisureScatter; i++) {
      const element3 = t.Measure[i];
      datiMisure.forEach(element2 => {
        if (element2.CODE === element3) {
          misureDaScrivere.push(element2);
        }
      });
    };
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati misure scatter', datiMisure, misureDaScrivere);

    const misureGiuste = new Array();
    misureGiuste.push('---');
    misure.forEach(element2 => {
      const misura = ExternalUtilities.ritornaMisura(t, element2, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Scatter 2');
      misureGiuste.push(misura);
    });
    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati misure scatter', misureDaScrivere, misureGiuste);
    // }

    const contentToolTip = {
      content: misureGiuste[4] + ': ' + element + '<br/>' + misureGiuste[1] + ': {x}<br/>' +
               misureGiuste[2] + ': {y}<br/>' + misureGiuste[3] + ': {descColor}<br/>Count: {count}',
      cornerRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, .7)'
    };
    const axisColor = '#c6c6c6';
    const fontColor = 'transparent';

    const display_name1 = ExternalUtilities.PrendeNomeMisuraDaCodice(misureGiuste[4], t.measureData2, 'Scatter2');
    const display_name3 = ExternalUtilities.PrendeNomeMisuraDaCodice(misureGiuste[3], t.measureData2, 'Scatter3');
    const titolo =  display_name1 + ': ' + display_name2 + ', Color ' +  display_name3;
    // logConsole('Scatter:', titolo);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, puntini);

    // const cjs = new t.canvasJS();

    const titoloAsseX = ExternalUtilities.PrendeNomeMisuraDaCodice(misureGiuste[1], t.measureData2, 'Scatter4');
    const titoloAsseY = ExternalUtilities.PrendeNomeMisuraDaCodice(misureGiuste[2], t.measureData2, 'Scatter5');
    const struttura = {
      title: {
        text: t.NumeroFrame2 + '.' + t.frameAttivo2 + ' ' + t.nomiFrames[t.frameAttivo2] + ' - ' + titolo,
        fontSize: 12,
        fontFamily: 'Arial'
      },
      height: t.altezzaGraficoScatter[t.NumeroFrame2],
      zoomEnabled: true,
      zoomType: 'xy', // change it to "xy" to enable zooming on both axes
      animationEnabled: false,
      /* title: {
          text: display_name,
          fontWeight: 'normal',
          fontFamily: 'arial',
      }, */
      toolTip: contentToolTip,
      axisX: {
        title: titoloAsseX,
        labelFormatter: function (e) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e);
          return e.value;
        },
        fontWeight: 'normal',
        fontFamily: 'arial',
        labelFontColor: '#646464',
        // labelAngle: -70
        lineColor: axisColor,
        gridColor: axisColor,
        tickColor: '#646464',
        minimum: t.asseXMin[t.frameAttivo2],
        maximum: t.asseXMax[t.frameAttivo2]
      },
      axisY: {
        title: titoloAsseY,
        titleWrap: false,
        titleFontColor: '#646464',
        fontWeight: 'normal',
        fontFamily: 'arial',
        lineColor: axisColor,
        gridColor: axisColor,
        labelFontColor: '#646464',
        valueFormatString: '000',
        tickColor: 'transparent',
        minimum: t.asseYMin[t.frameAttivo2],
        maximum: t.asseYMax[t.frameAttivo2]
      },
      data: [{
        type: puntini.datasets[0].type,
        name: puntini.datasets[0].name,
        dataPoints: puntini.datasets[0].data,
        'click': this.onClickScatter.bind(null, t),
      }],
      // rangeChanged: this.syncHandler
    };
    // logConsole('Scatter', JSON.stringify(struttura));

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Creazione/update scatter', t.chartsScatter[t.NumeroFrame2], index, 
      t.chartsScatter[t.NumeroFrame2].length - 1, t.giaDisegnataStruttura[t.NumeroFrame2]);

    /* if (!t.giaDisegnataStruttura[t.NumeroFrame2] || index >= t.chartsScatter[t.NumeroFrame2].length - 1) {
      if (!t.chartsScatter[t.NumeroFrame2]) {
        t.chartsScatter[t.NumeroFrame2] = new Array();
      } */

      t.chartsScatter[t.NumeroFrame2].push(new t.CanvJS.Chart(nomeChart, struttura));
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Crezione dati dello scatter' , index, t.chartsScatter[t.NumeroFrame2][index], struttura);
      // }
    /* } else {
      if (struttura && struttura.data) {
        t.chartsScatter[t.NumeroFrame2][index].options.data = struttura.data;
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiornamento dati dello scatter' , index, t.chartsScatter[t.NumeroFrame2][index], struttura);
        }
      }
    } */
  }

  onClickScatter(t, e) {
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Element', element);
    const datiMisure = t.measureData2;
    const misure = t.arrayScatter[t.NumeroFrame2];

    const misureDaScrivere = new Array();
    for (let i = 1; i <= t.Utils.quanteMisureScatter; i++) {
      const element3 = t.Measure[i];
      datiMisure.forEach(element2 => {
        if (element2.CODE === element3) {
          misureDaScrivere.push(element2);
        }
      });
    };
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati misure scatter', datiMisure, misureDaScrivere);

    const misureGiuste = new Array();
    misureGiuste.push('---');
    misure.forEach(element2 => {
      const misura = ExternalUtilities.ritornaMisura(t, element2, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Scatter 3');
      misureGiuste.push(misura);

      /* if (element2.indexOf('<GLOBAL CHECKED MEASURE ') > -1 || element2.indexOf('global_measure_') > -1) {
        let indice;
        if (element2.indexOf('<GLOBAL CHECKED MEASURE ') > -1) {
          indice = +(element2.replace('<GLOBAL CHECKED MEASURE ', '').replace('>', ''));
        } else {
          indice = +(element2.replace('global_measure_', ''));
        }        

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Indice scatter: ', indice, ExternalUtilities.misureGlobali)
        if (indice && indice > 0) {
          if (ExternalUtilities.misureGlobali && ExternalUtilities.misureGlobali[indice - 1] !== '') {
            let cosa;
            if (ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE']) {
              cosa = ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE'];
            } else {
              cosa = ExternalUtilities.misureGlobali[indice - 1];
            }
            misureGiuste.push(ExternalUtilities.PrendeNomeMisuraDaCodice(element2.replace('global_measure_' + indice, cosa).replace('<GLOBAL CHECKED MEASURE ' + indice + '>', cosa), datiMisure));
          }
        }
      } else {
        misureGiuste.push(ExternalUtilities.PrendeNomeMisuraDaCodice(element2, misureDaScrivere));
      } */
    });

    // const element = '';
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CLICK SU SCATTER: ', e);

    t.testoDatiGrafici = misureGiuste[4] + ': ' + e.dataSeries.name + '<br/>' + 
      misureGiuste[1] + ': ' + e.dataPoint.x + '<br/>' +
      misureGiuste[2] + ': ' + e.dataPoint.y + '<br/>' + 
      misureGiuste[3] + ': ' + e.dataPoint.descColor + '<br/>' +
      'Count: ' + e.dataPoint.count + '';

    t.datiGrafici = true;
  }
}

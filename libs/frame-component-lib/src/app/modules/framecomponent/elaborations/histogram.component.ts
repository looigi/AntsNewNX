import { logConsole } from '../console-log';
import { ExternalApiService } from './../services/externalapi.service';
import { Inject, Injectable } from '@angular/core';
// import Utils from '../Utilities.component';
// import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { environment } from '../../../../environments/environment';
import ExternalUtilities from '../ExternalUtilities.component';
// import { ExportGridComponent } from './exportGrid';
import { DecimalPipe } from '@angular/common';
// import { isNumeric } from 'rxjs/internal-compatibility';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TraceRun2Component } from '../tcrun2/tracerun2.component';
import { param } from 'jquery';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';
// import { isNumeric } from 'rxjs/internal-compatibility';
// import { FileSaverService } from 'ngx-filesaver';
// import { debugPort, env } from 'process';
// import { threadId } from 'worker_threads';
// import { noUndefined } from '@angular/compiler/src/util';
// import * as CanvasJS from './canvasjs.min.js';

// declare const CanvasJS: any;

@Injectable()
export class HistogramComponent {
  destroy$ = new FineRichieste();

  // vecchioJson = undefined;
  // lastCallHistogram = undefined;

  nomeQuery = 'geo_measure_sample_cross__sel'
  tipiHistogrammiTutto: any[] = [
    { id: 'S0', name: 'Count' },
    { id: 'S1', name: 'Count 100%' },
    { id: 'N9', name: 'Count Distinct' },
    { id: 'N0', name: 'Avg' },
    { id: 'N1', name: 'Avg/Min/Max' },
    { id: 'N2', name: 'Avg/Count' },
    { id: 'N3', name: 'Avg/Min/Max/Count' },
  ];
  vecchieColumnProperty = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  altezzaPerBar = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  appoRigheFinali = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  static NumeroFrame;
  tipoHistogramma;
  tipoPerChiamata;

  vecchiaMassimizzata = false;
  giaRidisegnato = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  formatoValore2 = ExternalUtilities.creaVettore(environment.quantiFrames, -9999);
  // staGiaDisegnandoGraficiHistogram = [ false, false, false, false, false, false, false, false, false, false, false]; // ,
  //                                     false, false, false, false, false, false, false, false, false, false, false];
  // lastCall = ['', '', '', '', '', '', '', '', '', '',  ''];
  maxX = undefined;
  minY;
  maxY;
  settaMinimoMassimo = false;
  righeDoubleGraph;
  altezzaGraficoBarMulti = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  ultimaVoltaReSize = ExternalUtilities.creaVettore(environment.quantiFrames, -1);

  // dimeBarre = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // dimeYApp = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // asseXMinimo = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // asseXMassimo = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // charts = undefined; // [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //           undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // tipiApp = undefined; // [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //   undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // arrayApp = undefined; // [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //   undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // righeApp = undefined; // [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //   undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // nomiLabelsApp = undefined; // [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //   undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // numeroColonne = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  constructor(
    private apiService: ExternalApiService,
    private _decimalPipe: DecimalPipe
  ) {
    /* if (!this.vecchioJson) {
      this.vecchioJson = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
    }
    if (!this.tipiApp) {
      this.tipiApp = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
    }
    if (!this.lastCallHistogram) {
      this.lastCallHistogram = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
    }
    if (!this.arrayApp) {
      this.arrayApp = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
    }
    if (!this.righeApp) {
      this.righeApp = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
    }
    if (!this.nomiLabelsApp) {
      this.nomiLabelsApp = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
    }
    if (!this.charts) {
      this.charts = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, new Array());
    } */
  }

  pulisceAppoggi(t) {
    // logConsole('Histogrammi. Pulisco appoggi', t.NumeroFrame2);

    this.destroy$.ferma(t);

    /* for (let i = 0; i < 500; i++) {
      const nome = "chartContainersHistogram_" + t.frameAttivo2 + "_" + t.NumeroFrame2 + "_" + i;
      const divGrafico = document.getElementById(nome);
      if (divGrafico) {
        divGrafico.outerHTML = '';
        divGrafico.remove();
        // // logConsole('PULIZIA ISTOGRAMMI', nome);
      }
    }

    const divGraficoContenitoreInterno = document.getElementById('divIstogrammi_' + t.NumeroFrame2);
    if (divGraficoContenitoreInterno) {
      divGraficoContenitoreInterno.outerHTML = '';
      divGraficoContenitoreInterno.remove();
    } */

    this.appoRigheFinali[t.NumeroFrame2] = -1;
    t.vecchioJson[t.NumeroFrame2] = '';
    t.lastCallHistogram[t.NumeroFrame2] = '';
    t.tipiApp[t.NumeroFrame2] = new Array();
    t.arrayApp[t.NumeroFrame2] = new Array();
    t.righeApp[t.NumeroFrame2] = new Array();
    t.nomiLabelsApp[t.NumeroFrame2] = new Array();
    t.dimeBarre[t.NumeroFrame2] = '';
    t.dimeYApp[t.NumeroFrame2] = '';
    t.asseXMinimo[t.NumeroFrame2] = '';
    t.asseXMassimo[t.NumeroFrame2] = '';
    t.numeroColonne[t.NumeroFrame2] = '';
    t.legendaHistogram = undefined;
    // // logConsole('Dati griglia h 0');
    t.datiGrigliaExportH[t.NumeroFrame2] = 'empty grid';
    t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = undefined;
    t.timeStampChiamataIstogrammi = undefined;
    t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
    t.measureDaDisegnareHistogram[t.NumeroFrame2] = new Array();
    // t.visualizzaGrigliaExportH[t.NumeroFrame2] = false;
    this.vecchieColumnProperty[t.NumeroFrame2] = '';
    this.giaRidisegnato[t.NumeroFrame2] = false;

    /* if (t.chartsIstogrammi[t.NumeroFrame2]) {
      t.chartsIstogrammi[t.NumeroFrame2].forEach(element => {
        if (element && element.container && element.container !== null) {
          element.destroy();
        }
      });
      t.chartsIstogrammi[t.NumeroFrame2] = new Array();
    } */

    /* const tm = setTimeout(() => {
          clearTimeout(tm);
      t.measureDaDisegnareHistogram = new Array();
    }, 1000); */

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia dati istogramma', t.NumeroFrame2);
    // }
  }

  isNumeric(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
  }

  formattaNumero(nn) {
    if (!nn || nn === '') {
      return '';
    }
    if (!this.isNumeric(nn)) {
      return nn;
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nn, isNumeric(nn));
    const nnn: String = nn.toString();

    let n;
    let perc = false;
    if (nnn.indexOf('%') > -1) {
      n = nnn.replace('%', '').trim();
      perc = true;
    } else {
      n = nnn.trim();
    }
    let decimal_formatted =  this._decimalPipe.transform(n, "1.2-2");
    if (perc) {
      decimal_formatted += '%';
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, decimal_formatted);

    return decimal_formatted;
  }

  disegnaHistogram(t, soloEstrazioneDati, forzaRidisegno) {
    // logConsole('Histogrammi 1', t.NumeroFrame2);
    /* if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = '';

      // return;
    } */

    if (t.MappaOGrafico2 !== 'AH') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Histograms', t.NumeroFrame2, t.MappaOGrafico2);
      t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = '';

      return;
    }
    

    if (!this.maxX && !soloEstrazioneDati) {
      this.maxX = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 0);
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno histogrammi', t);

    let sla = ExternalUtilities.tornaSla(t);
    if (sla !== undefined && sla !== '') {
      // sla = 'sla_name:' + sla;
    } else {
      sla = '';
    }
    
    t.erroreHistogram[t.NumeroFrame2] = '';

    // logConsole('Histogrammi 2', t.NumeroFrame2);

    if (!sla) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Esco per sla non valido');

      t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = '';
      t.erroreHistogram[t.NumeroFrame2] = 'No SLA specified';
      return;
    }

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /* let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'AH' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Esco da istogrammi 1', t.frameVisible2, t.frameAttivo2, t.MappaOGraficoTutti2, t.MappaOGraficoTutti2[t.frameAttivo2]);
      }
      return;
    } */

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Entro in istogrammi', t.frameVisible2, t.frameAttivo2, t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2]);
  
    // logConsole('Histogrammi 3', t.NumeroFrame2);

    if (t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Esco da istogrammi 1.5');
      t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = '';
  
      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno histogrammi', t.frameAttivo, t.NumeroFrame, soloEstrazioneDati);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.strutturaClick);
    // let tms = t.strutturaClick.tms;
    // if (!tms) {
    //   tms = t.strutturaClick.tms_min;
    // }
    // if (tms) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Struttura arrivata: ', t.strutturaClick);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Timestamp di riferimento:', tms);
    let q = 0;
    if (t.Measure && t.Measure !== null) {
      t.Measure.forEach(element => {
        if (element && element !== '') {
          q++;
        }
      });
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure selezionate:', q);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, q, t.datiSlaDT2, sla);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Metto rondella');

    // t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = true;
    t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = true;

    if (q > 0 && t.datiSlaDT2 !== undefined && sla !== '') {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.listaActivityName2);
      /* let list_Act = '';
      if (t.listaActivityName2 !== undefined) {
        t.staGiaDisegnandoGraficiHistogram = true;
        t.caricamentoDatiInCorsoHistogram = true;

      let conta = 1;
      t.listaActivityName2.forEach(element => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
        if (element && element.NAME && element.NAME !== '' && element.NAME !== 'empty') {
          list_Act += ('geo_act_set_name_' + conta + ':' + element.NAME + ';');
          conta++;
        }
      });
      if (list_Act !== '') {
        list_Act = '(' + list_Act.substring(0, list_Act.length - 1) + ')';
      } */
      let act_set = ExternalUtilities.ritornaStringPerActivitySet(t, t.Utils);
      act_set = act_set.replace('geo_act_set_name_1:', '');

      if (act_set === '' || !act_set || act_set === 'undefined') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Attesa act_set', t.NumeroFrame2);

        let q = 0;
        const f = setInterval(() => {
          act_set = t.act_set; //  ExternalUtilities.ritornaStringPerActivitySet(t, t.Utils);
          // logConsole('ACT_SET Per Isto', act_set);
          // act_set = act_set.replace('geo_act_set_name_1:', '');

          // if (act_set && act_set !== '' || act_set === 'undefined') {
          if (act_set && act_set !== '' && act_set !== 'undefined') {
            clearInterval(f);

            this.continuaDisegnaIstogrammi(t, sla, act_set, forzaRidisegno, soloEstrazioneDati);
          } else {
            q++;
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Attesa act_set', t.NumeroFrame2, q);

            if (q > 5) {
              clearInterval(f);

              /* if (soloEstrazioneDati === false) {
                if (t.chartsIstogrammi[t.NumeroFrame2]) {
                  t.chartsIstogrammi[t.NumeroFrame2].forEach(element => {
                    if (element && element.container && element.container !== null) {
                      element.destroy();
                      element = null;
                    }
                  });
                }
              } */
              // t.Utils.charts[t.frameAttivo][t.NumeroFrame] = undefined;

              t.comboDisabilitata = false;
              // if (t.debug2 === true) {
              //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 1');
              // }
              // t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
              t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Esco da istogrammi per mancanza di activity');
              t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = '';

              return;

            }
          }
        }, 1000);
      } else {
        this.continuaDisegnaIstogrammi(t, sla, act_set, forzaRidisegno, soloEstrazioneDati);
      }
    } else {
      t.comboDisabilitata = false;
      t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
      /* if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 2');
      }
      t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; */
    }
  }

  continuaDisegnaIstogrammi(t, sla, act_set, forzaRidisegno, soloEstrazioneDatiP) {
    // logConsole('Histogrammi 4', t.NumeroFrame2);
      // let act_set = '';
      // if (t.act_set) {
      //   act_set += 'geo_act_set_name_1:' + t.act_set;

      let tmsFilter = '';
      let sInizio = '';
      let sFine = '';
      if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
        /* const dInizio = (new Date(t.Utils.tmsSelezionato).getTime()) - (t.Utils.rangeDiSecondiPerMille);
        const sInizio = t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
        const dFine = (new Date(t.Utils.tmsSelezionato).getTime()) + (t.Utils.rangeDiSecondiPerMille);
        const sFine = t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
        tmsFilter = 'tms_min:' + sInizio + ';tms_max:' + sFine + ';'; */
        if (t.Utils.tmsInizio && t.Utils.tmsFine) {
          // const c = t.Utils.rangeSelezionato.split(';');
          // if (c[0] !== null && c[1] !== null && c[0] !== 'null' && c[1] !== 'null') {
            // tmsFilter = 'tms_min:' + c[0] + ';tms_max:' + c[1] + ';';
            sInizio = t.Utils.tmsInizio;
            sFine = t.Utils.tmsFine;

            sInizio =  t.datePipe.transform(sInizio, 'yyyy-MM-dd HH:mm:ss');
            sFine =  t.datePipe.transform(sFine, 'yyyy-MM-dd HH:mm:ss');

            tmsFilter = 'tms_min:' + sInizio + ';tms_max:' + sFine + ';';
        // } else {
          //   t.comboDisabilitata = false;
          //   t.staGiaDisegnandoGraficiHistogram = false;
          //   t.caricamentoDatiInCorsoHistogram = false;
          //   return;
          // }
        } else {
          t.comboDisabilitata = false;
          t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
          /* if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 3');
          }
          t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; */
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Esco da istogrammi per tms sballato');
          t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = '';

          return;
        }
      } else {
        t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 4');
        // t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;

        sInizio = t.timeRangeDSFStart2;
        sFine = t.timeRangeDSFStop2;

        sInizio =  t.datePipe.transform(sInizio, 'yyyy-MM-dd HH:mm:ss');
        sFine =  t.datePipe.transform(sFine, 'yyyy-MM-dd HH:mm:ss');

        tmsFilter = 'tms_min:' + sInizio + ';tms_max:' + sFine + ';';
      }
      if (!sInizio || sInizio === '' || sInizio === null) {
        /* if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 5');
        }
        t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; */
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Histogram esco per tms vuoti');
        t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = '';
        // logConsole('Histogrammi 4 ESCO', t.NumeroFrame2);

        return;
      }
      // logConsole('Inizio Fine TMS', t.NumeroFrame2, sInizio, sFine, t.timeFilter, t.timeFilter2);

      const array = new Array();
      array.push('---');
      let q = 0;
      t.Measure.forEach(element => {
        if (q > 0) {
          const misura = ExternalUtilities.ritornaMisura(t, element, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Istogrammi 1');
          if (misura) {
            array.push(misura);
          } else {
            array.push('---');
          }
        }
        q++;
      });

      if (t.eventsMeasure2 === true) {
        array[2] = 'EVENT';
      }

      // logConsole('Histogrammi 5', t.NumeroFrame2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Array misure: ', array);

      let index = 0;
      // let params = 'viewparams=';
      let layer = '';
      let tipologia = '';
      let tipoPerChiamata = 'columns';
      let daClick = false;

      let soloEstrazioneDati = soloEstrazioneDatiP;

      if (soloEstrazioneDati === true) {
        daClick = true;
      }

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Solo estrazione dati', soloEstrazioneDati);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'daClick', daClick);

      soloEstrazioneDati = false;
      let tipoHistogramma = 'stackedColumn'; // '"stackedColumn100"';
      if (t.doubleGraph2) {
        if (t.columnsBars2 === '3') {
          tipoHistogramma = 'bar';
          tipoPerChiamata = 'bars';
        } else {
          tipoHistogramma = 'column';
          tipoPerChiamata = 'columns';
        }
      } else {
        if (t.columnsBars2 === '3') {
          tipoHistogramma = 'stackedBar';
          tipoPerChiamata = 'bars';
        } else {
          if (+t.columnsBars2 === 1) {
            soloEstrazioneDati = true;
            tipoPerChiamata = 'bars';

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Modalità table');
          }
        }
      }

      this.tipoHistogramma = tipoHistogramma;
      this.tipoPerChiamata = tipoPerChiamata;

      let controlloSuValue2 = '';
      let propName = '';
      let modalita = '';

      const misure = new Array();
      let tipoChiamata = '';

      // if (t.eventsMeasure2 === undefined || t.eventsMeasure2 === false) {
      array.forEach(element => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elemento array istogrammi', element, typeof(element));
        if (element && typeof(element) === 'string' && element !== '---') {
          if (element === 'EVENT') {
            misure.push('Event:');
          } else {
            let campo = '';
            let tipo = '';

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Istogramma: Misura ', index + 1, t.NumeroFrame, t.histDisplayAs2[index]);

            this.settaMinimoMassimo = false;

            t.measureData2.forEach(element2 => {
              if (campo === '' && element2) {
                if (element2 && element2.CODE && element2.CODE.toLowerCase().trim() === element.toLowerCase().trim()) {
                  if (+element2.TYPE === 1) {
                    if (index === 1) {
                      if (t.eventsMeasure2 === false) {
                        t.Utils.tipiHistogrammiNUM.forEach(element3 => {
                          if (modalita === '' && element3.id === t.histDisplayAs2[2]) {
                            modalita = element3.name;
                          }
                        });
                      } else {
                        this.tipiHistogrammiTutto.forEach(element3 => {
                          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, modalita, element3.id, t.histDisplayTutto2[2]);
                          if (modalita === '' && element3.id === t.histDisplayTutto2[2]) {
                            modalita = element3.name;
                          }
                        });
                      }

                      if (modalita.toUpperCase().indexOf('SEVERITY') > -1) {
                        layer = 'l_geo_measr_histo_y_sev_str';
                        propName = 'propertyName=value_1,value_3,color_2,count,severity_2,value_2';
                        controlloSuValue2 = 'value_2 is not null';
                        tipologia = 'STR';
                        tipoChiamata = 'histo_y_sev_str';
                      } else {
                        layer = 'l_geo_measr_histo_y_num';
                        propName = 'propertyName=value_1,value_3,color_2,count,value_2_avg,value_2_min,value_2_max,sr_2';
                        controlloSuValue2 = 'value_2_avg is not null';
                        tipologia = 'NUM';

                        if (modalita.toUpperCase().indexOf('COUNT DISTINCT') > -1) {
                          tipoChiamata = 'histo_y_count_distinct';
                        } else {
                          tipoChiamata = 'histo_y_num';
                          this.settaMinimoMassimo = true;
                        }
                      }

                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Tipo chiamata per misura 1, tipologia numerica: ', tipoChiamata);
                    }
                  } else {
                    if (index === 1) {
                      layer = 'l_geo_measr_histo_y_sev_str';

                      /* if (t.eventsMeasure2 === false) {
                        t.Utils.tipiHistogrammiNUM.forEach(element3 => {
                          if (modalita === '' && element3.id === t.histDisplayAs2[2]) {
                            modalita = element3.name;
                          }
                        });
                      } else {
                        this.tipiHistogrammiTutto.forEach(element3 => {
                          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, modalita, element3.id, t.histDisplayTutto2[2]);
                          if (modalita === '' && element3.id === t.histDisplayTutto2[2]) {
                            modalita = element3.name;
                          }
                        });
                      }

                      if (modalita.toUpperCase().indexOf('COUNT DISTINCT') > -1) {
                        tipoChiamata = 'histo_y_count_distinct';
                      } else {
                        tipoChiamata = 'histo_y_sev_str';
                      } */

                      // tipoChiamata = 'histo_y_sev_str';
                      tipologia = 'STR';

                      if (t.eventsMeasure2 === false) {
                        t.Utils.tipiHistogrammiSTR.forEach(element3 => {
                          if (modalita === '' && element3.id === t.histDisplayAs2[2]) {
                            modalita = element3.name;
                          }
                        });

                        if (modalita.toUpperCase().indexOf('COUNT DISTINCT') > -1) {
                          tipoChiamata = 'histo_y_count_distinct';
                        } else {
                          tipoChiamata = 'histo_y_sev_str';
                        }
                      } else {
                        this.tipiHistogrammiTutto.forEach(element3 => {
                          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, modalita, element3.id, t.histDisplayTutto2[2]);
                          if (modalita === '' && element3.id === t.histDisplayTutto2[2]) {
                            modalita = element3.name;
                          }
                        });

                        if (modalita.toUpperCase().indexOf('AVG') > -1 || modalita.toUpperCase().indexOf('SUM') > -1) {
                          layer = 'l_geo_measr_histo_y_num';
                          tipoChiamata = 'histo_y_num';
                          tipologia = 'NUM';
                          this.settaMinimoMassimo = true;
                        } else {
                          if (modalita.toUpperCase().indexOf('COUNT DISTINCT') > -1) {
                            tipoChiamata = 'histo_y_count_distinct';
                          } else {
                            tipoChiamata = 'histo_y_sev_str';
                          }
                        }
                      }

                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Eventi o misure: ', t.eventsMeasure2);
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Tipo chiamata per misura 1, modalità: ', modalita);
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Tipo chiamata per misura 1, tipologia stringa: ', tipoChiamata);

                      propName = 'propertyName=value_1,value_3,color_2,count,severity_2,value_2,sr_2';
                      controlloSuValue2 = 'value_2 is not null';
                    } else {
                      /* if (modalita.toUpperCase().indexOf('COUNT DISTINCT') > -1) {
                        tipoChiamata = 'histo_y_count_distinct';
                      } else {
                        tipoChiamata = 'histo_y_sev_str';
                      } */
                    }
                  }
                  index++;
                  if (element2 && element2.CODE) {
                    campo = element2.CODE.toLowerCase().trim();
                  } else {
                    campo = '';
                  }
                  tipo = 'measr_code_' + index;

                  const altro = tipo + ':' + campo + ';';

                  if (element2 && element2.CODE) {
                    let code = element2.CODE;
                    while (code.indexOf('\'') > -1) {
                      code = code.replace('\'', '');
                    }
                    while (code.indexOf('"') > -1) {
                      code = code.replace('"', '');
                    }
                    misure.push(code);
                  }
                  // params += altro;
                }
              }
            });

            if (modalita.indexOf('Quartiles') > -1) {
              tipoHistogramma = 'boxAndWhisker';
            }

            if (modalita.indexOf('%') > - 1) {
              if (tipoHistogramma.indexOf('100') === -1) {
                tipoHistogramma += '100';
              }
            }

            this.tipoHistogramma = tipoHistogramma;
          }
        }
      });

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Misure rilevate prima degli eventi: ', misure);

      // logConsole('Histogrammi 6', t.NumeroFrame2);

      if (t.eventsMeasure2 === true) {
        let listaEventi = '';
        let lista = null;
        let lep = null;
        if (t.tipoEvento2 === 'L') {
          lista = t.listaEventiDaPassare2;
          lep = ExternalUtilities.converteStringaInJSON(lista);
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi locale');
        } else {
          lista = t.Utils.eventiSceltiES2;
          lep = lista;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi globale');
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lista);
        }

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi', t.NumeroFrame2, lep);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lep, lep.length);
        if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep !== '"empty grid"' && lep.length > 0) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi', lep);
          lep.forEach(element => {
            if (element.EVENT_TYPE && element.EVENT_TYPE !== undefined && element.EVENT_TYPE !== 'undefined') {
              const misura = ExternalUtilities.ritornaMisura(t, element, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Istogrammi 2');
              listaEventi += (misura + ',').trim();

              /* if (element.toUpperCase().indexOf('<GLOBAL MEASURE>') > -1 || (element.indexOf('global_measure') > -1 && element.indexOf('global_measure_') === -1)) {
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ricerca misura globale', t.Utils.globalMeasure, t.Utils.globalMeasure.MEASR_CODE);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.measureData2);
                t.measureData2.forEach(element2 => {
                  if (element2.CODE === t.Utils.globalMeasure.MEASR_CODE) {
                    const m = element2.CODE.replace('"', '').replace('"', '');
                    listaEventi += (element.replace('<GLOBAL MEASURE>', m).replace('global_measure', m) + ',').trim();
                  }
                });
              } else {
                listaEventi += (element + ',').trim();
              } */
            }
          });
            // if (t.tipoEvento2 === 'G') {
            //   filtro = 'event_type = \'NONE\'';
            // }
        } else {
          // if (t.tipoEvento2 === 'G') {
          //   filtro = 'event_type = \'NONE\'';
          // }
        }

        if (listaEventi.length > 0) {
          listaEventi = listaEventi.substring(0, listaEventi.length - 1);
        } else {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Histogram esco per lista eventi vuoti');

          /* if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 6');
          }
          t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; */
          t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;

          // logConsole('Histogrammi 6 ESCO', t.NumeroFrame2);
          return;
        }

        misure[1] = 'Event:' + listaEventi;
        misure[4] = null;
      }
      // params += (sla + ';');
      // params += (act_set + ';');
      // params += tmsFilter;

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
      // tmsFilter = '';

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tipi istogrammi tutti: ', this.tipiHistogrammiTutto);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Modalità arrivata: ', t.histDisplayTutto2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Modalità', modalita);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Misure rilevate dopo gli eventi: ', JSON.parse(JSON.stringify(misure)));

      if (misure.length < 5) {
        for (let i = misure.length; i <= 5 ; i++) {
          misure.push(null);
        }
      }
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'MISURE', misure);

      let geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);
      // geoFilter = ExternalUtilities.converteTestoInUrl(geoFilter, ',', '\\,');

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'geoFilter histogram', t.geoFilter2, geoFilter);

      if (sInizio === '"null"') {
        sInizio = 'null';
      }
      if (sFine === '"null"') {
        sFine = 'null';
      }

      // FILTER
      const filtri = ExternalUtilities.prendeFiltri(t, true, 'Histogram');
      const cm1 = filtri.cm1;
      const cm2 = filtri.cm2;
      const tf1 = filtri.tf1;
      const tf2 = filtri.tf2;
      // FILTER

      // logConsole('Histogrammi 7', t.NumeroFrame2);
      if (!tipoChiamata || tipoChiamata === null || tipoChiamata === 'undefined' || tipoChiamata === 'null') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da histogram per tipo chiamata nulla', t.NumeroFrame2, tipoChiamata);

        t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
        t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = '';

        return;
      }

      t.misureIstogrammi = misure;

      let params;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tmsFilter);
      if (sInizio && sFine && tmsFilter !== '') {
        params = {
          cntx_id: t.sessionID2,
          // v_caller_tag: t.chiSonoIstogrammi[t.NumeroFrame2],
          v_act_set_name_list: t.act_set,
          v_geo_sla_name: sla,
          v_tms_min: sInizio,
          v_tms_max: sFine,
          v_aggr_type: tipoChiamata,
          v_measr_code_1: misure[0],
          v_measr_code_2: misure[1],
          v_measr_code_3: misure[2],
          v_measr_code_4: misure[3],
          v_bbox: geoFilter,
          v_chart_type: tipoPerChiamata,
          v_filter_measr_code_1: cm1,
          v_filter_measr_value_1: tf1,
          v_filter_measr_code_2: cm2,
          v_filter_measr_value_2: tf2
        };
      } else {
        params = {
          cntx_id: t.sessionID2,
          // v_caller_tag: t.chiSonoIstogrammi[t.NumeroFrame2],
          v_act_set_name_list: act_set,
          v_geo_sla_name: sla,
          v_tms_min: sInizio,
          v_tms_max: sFine,
          v_aggr_type: tipoChiamata,
          v_measr_code_1: misure[0],
          v_measr_code_2: misure[1],
          v_measr_code_3: misure[2],
          v_measr_code_4: misure[3],
          v_bbox: geoFilter,
          v_chart_type: tipoPerChiamata,
          v_filter_measr_code_1: cm1,
          v_filter_measr_value_1: tf1,
          v_filter_measr_code_2: cm2,
          v_filter_measr_value_2: tf2
        };
      }
      // logConsole('Chiamata istogrammi', t.NumeroFrame2, params);
      
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);

      /* if (soloEstrazioneDati && daClick) {
        t.visualizzaIstogrammiGrafici = false;
        t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
        t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;

        t.exportGridComponent.creaGriglia(t, HistogramComponent.vecchioJson[t.NumeroFrame2], 'Histogram Data', false);
        return;
      } */

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Histogrammi: Frame attivo', t.frameAttivo);

      if (t.frameAttivo && t.frameAttivo.toString().indexOf(';') > -1) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: esco per frame attivo con CONTEXT');

        // t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
        t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
        t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = '';

        // logConsole('Histogrammi 7 ESCO', t.NumeroFrame2);
        return;
      }

      // logConsole('Histogrammi 8', t.NumeroFrame2, t.massimizzata, this.vecchiaMassimizzata, t.vecchioJson[t.NumeroFrame2]);
      this.maxX[t.frameAttivo][t.NumeroFrame] = 0;

      const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
        t.frameAttivo + ';' + t.columnsBars2 + ';';
      const actualCall = 'HIST;' + propName + ';' + JSON.stringify(params) + ';' + tipoHistogramma +
            ';' + layer + ';' + controlloSuValue2 + ';' + modalita + valoriDiBase + ';' + t.heightChart2 + ';' +
            t.timeFilter + ';' + t.timeFilter2;

      if (((t.massimizzata !== this.vecchiaMassimizzata) || forzaRidisegno === true) && t.vecchioJson[t.NumeroFrame2]) {
        const ora = new Date().getTime();
        if (ora - this.ultimaVoltaReSize[t.NumeroFrame2] < 2000) {
          // logConsole('Histogrammi 9-1. Esco per troppo veloce', t.NumeroFrame2);
          return;
        }
        this.ultimaVoltaReSize[t.NumeroFrame2] = ora;

        const tm = setTimeout(() => {
          clearTimeout(tm);
          /* let altezzaDIV = t.divIstogrammi.nativeElement.offsetHeight;
          if (t.tipoLegendaIstogrammi2 === 'TOP') {
            altezzaDIV -= 40;
          } */

          // logConsole('Histogrammi 9.5', t.NumeroFrame2);
          // logConsole('Istogrammi ridisegno per massimizzazione', t.NumeroFrame2);
          
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Ridisegno istogramma per adattarlo alla finestra', t.NumeroFrame, t.massimizzata, forzaRidisegno);

          this.vecchiaMassimizzata = t.massimizzata;
          // if (t.vecchioJson[t.NumeroFrame2]) {
            this.elaboraRigheJSON(t, t.vecchioJson[t.NumeroFrame2], index, tipoHistogramma, tipologia, modalita, array);

            t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
            /* if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 7');
            }
            t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; */
          /* } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Non posso ridisegnare. Mancanza di vecchi dati');
            }
          } */
        }, 1000);
      } else {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: vecchia chiamata', t.lastCallHistogram[t.NumeroFrame2]);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: nuova chiamata', actualCall);

        // logConsole('Histogrammi 10', t.NumeroFrame2);
        
        if (t.datiGrigliaExportH[t.NumeroFrame2] && typeof(t.datiGrigliaExportH[t.NumeroFrame2]) === 'string') {
          if (t.datiGrigliaExportH[t.NumeroFrame2].indexOf('ERROR: ') > -1) {
            t.datiGrigliaExportH[t.NumeroFrame2] = 'empty grid';
            t.lastCallHistogram[t.NumeroFrame2] = undefined;
          }
        }
        
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tipo histogram', t.NumeroFrame, index, actualCall, tipoHistogramma, soloEstrazioneDati);
        // logConsole('Vecchi dati istogrammi', t.NumeroFrame2, typeof(t.ultimiDatiGrigliaIsto[t.NumeroFrame2]), t.ultimiDatiGrigliaIsto[t.NumeroFrame2]);

        let forzaCaricamento = false;
        if (!t.ultimiDatiGrigliaIsto[t.NumeroFrame2]) {
          forzaCaricamento = true;
        } else {
          if (typeof(t.ultimiDatiGrigliaIsto[t.NumeroFrame2]) === 'object') {
            const r = JSON.stringify(t.ultimiDatiGrigliaIsto[t.NumeroFrame2]);
            if (r.toUpperCase().indexOf('ERROR') > -1) {
              forzaCaricamento = true;
            }
          } else {
            if (t.ultimiDatiGrigliaIsto[t.NumeroFrame2].toUpperCase().indexOf('ERROR') > -1) {
              forzaCaricamento = true;
            }
          }
        }

        // logConsole('Istogrammi 1. Controllo vecchia query', t.lastCallHistogram[t.NumeroFrame2] !== actualCall, actualCall);

        if (t.lastCallHistogram[t.NumeroFrame2] !== actualCall || forzaCaricamento) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: chiamate diverse. Eseguo chiamata');

          // logConsole('Istogrammi 2. Controllo vecchia query', t.lastCallHistogram[t.NumeroFrame2] !== actualCall, actualCall);

          // logConsole('Istogrammi eseguo nuova query. Vecchia chiamata: ', t.NumeroFrame2, t.lastCallHistogram[t.NumeroFrame2])
          // logConsole('Istogrammi eseguo nuova query. Nuova Chiamata: ', t.NumeroFrame2, actualCall);

          /* if (soloEstrazioneDati === true &&  t.columnsBars2 !== '1') {
            t.visualizzaIstogrammiGrafici = false;
            t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
            t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;

            t.exportGridComponent.creaGriglia(t, this.vecchioJson[t.NumeroFrame2], 'Histogram Data', false);
            return;
          } */

          t.lastCallHistogram[t.NumeroFrame2] = actualCall;
          // t.Utils.rinfrescaGraficoHistogram = false;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Richiama url Istogramma frame', t.NumeroFrame, actualCall);

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI', t.NumeroFrame, params);
          if (daClick === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Modalità Table');
          } else {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Modalità', modalita);
          }

          // const layer = 'l_geo_measr_histo_y_sev_str '; // 'Geo_ANTS:l_geo_measr_group';
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, layer, propName, params);
          // const csv = await t.downloadFile.downloadCSV(layer, '', '', '', controlloSuValue2,
          //             propName, 'application/json', params, 'EXECUTE', false, 'Histogram');

          if (!soloEstrazioneDati) {
            if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
              t.measureDaDisegnareHistogram[t.NumeroFrame2] = new Array();
            }
          }

          t.chiSonoIstogrammi[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
          params['v_caller_tag'] = t.chiSonoIstogrammi[t.NumeroFrame2];
          
          t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
          t.queryPerSS[t.NumeroFrame2] = '' + this.nomeQuery;

          t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = true; // BUONO
          t.lastCallHistogram2[t.NumeroFrame2] = params;
          this.apiService.chiamataPost(t.Utils, '' + this.nomeQuery, params)
          // .map(response => response)
          .pipe(takeUntil(this.destroy$.per(t)))
          .subscribe((data2: any) => {
            // const data2 = JSON.parse(data);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno istogrammi', data);
            ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);
            // this.nomeQuery = 'Pppp';

            if (!t.controllaRitornoChiamata(t, data2, 'Sample Cross Istogrammi')) {
              t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;

              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: esco per query vecchia 1');

              // logConsole('Esco istogrammi 1');
              return;
            }

            this.giaRidisegnato[t.NumeroFrame2] = false;
            if (data2.result) {
              const result = data2.result;
              if (result.toUpperCase().indexOf('ERROR') > -1) {
                t.erroreHistogram[t.NumeroFrame2] = 'ERROR: ' + result;

                t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;

                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: esco per query in errore');

                // logConsole('Esco istogrammi 2');
                return;
              }
            } else {
              t.erroreHistogram[t.NumeroFrame2] = '';
            }

            if (data2.v_grid_msg !== undefined) {
              t.messaggioWarningH = data2.v_grid_msg;
            } else {
              t.messaggioWarningH = '';
            }

            if (data2 && data2.v_req_tms) {
              const ritorno = new Date(data2.v_req_tms);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno: ', ritorno);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia: ', t.timeStampChiamataTCRUN);
              if (t.timeStampChiamataIstogrammi && ritorno.getTime() < t.timeStampChiamataIstogrammi.getTime()) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: esco per query vecchia 2', ritorno, t.timeStampChiamataIstogrammi);

                t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
                // logConsole('Esco istogrammi 3');
                return;
              } else {
                t.timeStampChiamataIstogrammi = ritorno;
              }
            }

            t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; // BUONO

            // logConsole('Istogrammi 3. Ritorno dati', t.NumeroFrame2, data2);
            
            if (data2) {
              if (data2.DataTable && data2.DataTable.length > 0) {
                t.ciSonoDatiIstogrammi[t.NumeroFrame2] = true;
              } else {
                t.ciSonoDatiIstogrammi[t.NumeroFrame2] = false;
              }
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: dati ritornati', t.NumeroFrame2, data2, t.ciSonoDatiIstogrammi[t.NumeroFrame2]);

              if (data2.message && data2.message !== '') {
                // ExternalUtilities.messaggioDiErrore('null', data.message);
                t.erroreHistogram[t.NumeroFrame2] = ' ERROR: ' + data2.message;

                // logConsole('Esco istogrammi 5');

                t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
                /* if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 8');
                }
                t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; */
              } else {
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno: ', csv);
                // const errori = t.Utils.contaErrori(csv);
                // if (errori === 0) {
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, csv);
                // const righeJson = JSON.parse(csv.toString());
                // const nomeChart2 = 'chartContainersHistogram';
                // t.legendaHistogram = [];
                // const tm = setTimeout(() => {
                  // clearTimeout(tm);
                  t.legendaHistogram = data2.v_legend_table;
                // }, 100);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Legenda', data2.v_legend_table);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.legendaHistogram);

                // logConsole('Data2: ', data2, data2.value_2_min, data2.value_2_max);

                this.minY = data2.value_2_min;
                this.maxY = data2.value_2_max;

                t.vecchioJson[t.NumeroFrame2] = data2;

                t.ultimiDatiGrigliaIsto[t.NumeroFrame2] = data2;

                if (soloEstrazioneDati === true) {
                  if (t.columnsBars2 === '1') {

                    // t.exportGridComponent.creaGriglia(t, data, 'Histogram Data', true);
                    // return;

                    // t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = true;

                    let DataTable = data2.DataTable;

                    const datiGriglia = {
                      ColumnProperty: data2.v_column_property,
                      DataTable: DataTable,
                      GridProperty: data2.v_grid_property
                    };
                    // t.effettuaAutoFitCSV = !t.effettuaAutoFitCSV;

                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Disegno griglia', datiGriglia);

                    // t.datiGrigliaExportH = 'empty grid';
                    // t.visualizzaGrigliaExportH[t.NumeroFrame2] = false;
                    // t.visualizzaGrigliaExportH[t.NumeroFrame2] = true;
                    // const tm = setTimeout(() => {
                      // clearTimeout(tm);
                      // t.grigliaAHVisibile[t.NumeroFrame2] = false;
                      if (t.datiGrigliaExportH[t.NumeroFrame2] && t.datiGrigliaExportH[t.NumeroFrame2].DataTable && data2.DataTable 
                        && data2.DataTable.length > 0 && this.vecchieColumnProperty[t.NumeroFrame2] === JSON.stringify(datiGriglia.ColumnProperty)) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Aggiorno valori', data2.DataTable);

                        t.datiGrigliaExportH[t.NumeroFrame2].DataTable = data2.DataTable;

                        // t.effettuaAutoFitPM = !t.effettuaAutoFitPM;
                        t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
                      } else {
                        // t.datiGrigliaExportH = undefined;
                        // const tm = setTimeout(() => {
                          // clearTimeout(tm);
                          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Creo valori', datiGriglia);

                          this.vecchieColumnProperty[t.NumeroFrame2] = JSON.stringify(datiGriglia.ColumnProperty);
                          // // logConsole('Azzero visua griglia h 1');
                          t.visualizzaGrigliaExportH[t.NumeroFrame2] = false;
                          t.datiGrigliaExportH[t.NumeroFrame2] = datiGriglia;
                          const tm = setTimeout(() => {
                            clearTimeout(tm);

                            t.effettuaAutoFitAH[t.NumeroFrame2] = !t.effettuaAutoFitAH[t.NumeroFrame2];
                            t.visualizzaGrigliaExportH[t.NumeroFrame2] = true;
                            // t.grigliaAHVisibile[t.NumeroFrame2] = true;
                            t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
                          }, 500);
                        // }, 100);
                      }

                      // t.visualizzaGrigliaExportH[t.NumeroFrame2] = true;

                      t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
                      // t.visualizzaIstogrammiGrafici = false;
                    // }, 500);
                    return;
                  /* } else {
                    t.visualizzaIstogrammiGrafici = true;
                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Salvo i valori');
                    const nomeFile = 'GeoAnts_' + act_set + '_' + t.frameName + '_Histogram.csv';
                    // ExternalUtilities.salvaCSV(data.DataTable, nomeFile);

                    t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
                    t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;

                    t.exportGridComponent.creaGriglia(t, data, 'Histogram Data', false);
                    return; */
                  }
                }
                // t.visualizzaGrigliaExportH[t.NumeroFrame2] = false;

                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Dati', data2);
                  //t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
                t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
                //return;

                // t.visualizzaIstogrammiGrafici = true;

                this.elaboraRigheJSON(t, data2, index, tipoHistogramma, tipologia, modalita, array);
              }
            } else {
              t.ciSonoDatiIstogrammi[t.NumeroFrame2] = false;
            }
          }, error => {
            // ExternalUtilities.messaggioDiErrore('null', error);
            // alert('Errore');
            /* if (error._body) {
              try {
                const e = JSON.parse(error._body);
                t.erroreHistogram[t.NumeroFrame2] = ' ERROR: ' + JSON.stringify(e.message);
              } catch(e) {
                t.erroreHistogram[t.NumeroFrame2] = error._body;
              }
            } else {
              t.erroreHistogram[t.NumeroFrame2] = ' ERROR: ' + JSON.stringify(error);
            } */
            t.datiGrigliaExportH[t.NumeroFrame2] = 'ERROR: ' + error?.message;

            t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
            t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; // BUONO
            /* if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 10');
            }
            t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; */

            return;
          });
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CSV:', csv);

          // return;
        } else {
          // logConsole('HISTOGRAMMI: dati vecchi da ridisegnare: ', t.NumeroFrame2, 'Dati:', t.ultimiDatiGrigliaIsto[t.NumeroFrame2]);
          // logConsole('Istogrammi 3. Controllo vecchia query', t.ultimiDatiGrigliaIsto[t.NumeroFrame2]);

          // Già caricato
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegna senza richiamare url Istogramma frame', t.NumeroFrame, actualCall);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Ridisegno senza caricare nulla', t.NumeroFrame2);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Da Estrazione: ', t.NumeroFrame2, soloEstrazioneDati);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: daClick: ', t.NumeroFrame2, daClick);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: dati vecchi da ridisegnare: ', t.NumeroFrame2, 'Dati:', t.ultimiDatiGrigliaIsto[t.NumeroFrame2]);

          if (soloEstrazioneDati && !daClick) {
            if (t.ultimiDatiGrigliaIsto[t.NumeroFrame2] !== undefined && t.ultimiDatiGrigliaIsto[t.NumeroFrame2] !== 'empty grid') {

              // t.visualizzaIstogrammiGrafici = false;
              /* if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 11');
              }
              t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; */
              //// t.visualizzaGrigliaExportH[t.NumeroFrame2] = false;
              // t.visualizzaGrigliaExportH[t.NumeroFrame2] = true;
              if (t.datiGrigliaExportH[t.NumeroFrame2] && t.datiGrigliaExportH[t.NumeroFrame2].DataTable && t.ultimiDatiGrigliaIsto[t.NumeroFrame2].DataTable) {
                if (JSON.stringify(t.datiGrigliaExportH[t.NumeroFrame2].DataTable) === JSON.stringify(t.ultimiDatiGrigliaIsto[t.NumeroFrame2].DataTable)) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Ultimi valori uguali agli attuali');
                } else {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Aggiorno valori ridisegnati:', t.ultimiDatiGrigliaIsto[t.NumeroFrame2].DataTable);

                  // // logConsole('1', t.datiGrigliaExportH[t.NumeroFrame2]);
                  // // logConsole('2', t.ultimiDatiGrigliaIsto[t.NumeroFrame2]);
                  
                  // logConsole('Azzero visua griglia h 2');
                  t.visualizzaGrigliaExportH[t.NumeroFrame2] = false;
                  t.datiGrigliaExportH[t.NumeroFrame2].DataTable = t.ultimiDatiGrigliaIsto[t.NumeroFrame2].DataTable;
                  const tm = setTimeout(() => {
                    clearTimeout(tm);

                    t.visualizzaGrigliaExportH[t.NumeroFrame2] = true;                    
                  }, 100);
                  // t.effettuaAutoFitPM = !t.effettuaAutoFitPM;
        
                  // logConsole('Istogrammi ridisegno 1', t.NumeroFrame2);
                }
              } else {
                /* t.grigliaAHVisibile = false;
                const tm = setTimeout(() => {
                clearTimeout(tm);
                t.datiGrigliaExportH[t.NumeroFrame2] = 'empty grid'; */
                // t.grigliaAHVisibile[t.NumeroFrame2] = false;
                // logConsole('Azzero visua griglia h 3');
                t.visualizzaGrigliaExportH[t.NumeroFrame2] = false;
                t.datiGrigliaExportH[t.NumeroFrame2] = t.ultimiDatiGrigliaIsto[t.NumeroFrame2];
                const tm = setTimeout(() => {
                  clearTimeout(tm);

                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: dati vecchi ridisegnati: ', t.NumeroFrame2, t.datiGrigliaExportH[t.NumeroFrame2]);                
                  // t.grigliaAHVisibile[t.NumeroFrame2] = true;
                  t.effettuaAutoFitAH[t.NumeroFrame2] = !t.effettuaAutoFitAH[t.NumeroFrame2];
                  t.visualizzaGrigliaExportH[t.NumeroFrame2] = true;
        
                  // logConsole('Istogrammi ridisegno 2', t.NumeroFrame2);
                }, 10);
              }
              /* }, 100);
                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  t.effettuaAutoFitAH = !t.effettuaAutoFitAH;
                }, 500);
              } */

              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Ridisegnato senza caricare nulla', t.NumeroFrame2);

              /* t.datiGrigliaExportH = 'empty grid';
              const tm = setTimeout(() => {
                clearTimeout(tm);
                t.visualizzaGrigliaExportH[t.NumeroFrame2] = true;
                t.datiGrigliaExportH = t.ultimiDatiGrigliaIsto[t.NumeroFrame2]; // JSON.parse(JSON.stringify(t.ultimiDatiGrigliaIsto[t.NumeroFrame2]));

                t.visualizzaIstogrammiGrafici = false;
              }, 500); */

              // const tm = setTimeout(() => {
                //  clearTimeout(tm);
                // t.exportGridComponent.creaGriglia(t, HistogramComponent.vecchioJson[t.NumeroFrame2], 'Histogram Data', true);
              // }, 1000);
            } else {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: dati vecchi ripuliti: ', t.NumeroFrame2, t.ultimiDatiGrigliaIsto[t.NumeroFrame2]);
              // logConsole('Dati griglia h 3', t.ultimiDatiGrigliaIsto[t.NumeroFrame2]);
              t.datiGrigliaExportH[t.NumeroFrame2] = 'empty grid';
        
              // logConsole('Istogrammi ridisegno 3', t.NumeroFrame2);
            }

            t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
            return;
          }
          /* if (t.staGiaDisegnandoGraficiHistogram === true ||
            t.caricamentoDatiInCorsoHistogram === true) {
              t.caricamentoDatiInCorsoHistogram = false;
              t.staGiaDisegnandoGraficiHistogram = false;
              return;)
          } */
          // alert(t.columnsBars2);
          // if (t.Utils.dimensioniFramesModif[t.NumeroFrame] !== t.Utils.dimensioniFrames[t.NumeroFrame]) {
          // t.chartsIstogrammi[t.NumeroFrame2] = new Array();
          
          // logConsole('Ridisegno isogramma', t.NumeroFrame2);

          // this.disegnaHistogramAVideo(t, tipoHistogramma, tipologia, modalita, t.numeroColonne[t.NumeroFrame2]);

          const nomeChart = "divIstogrammi_" + t.NumeroFrame2;
          const divIstogramma = document.getElementById(nomeChart);
        
          // logConsole('Istogrammi. Controllo divIstogrammi per ridisegno', t.NumeroFrame2, divIstogramma);

          let q = 0;
          const t1 = setInterval(() => {
            if (divIstogramma && divIstogramma !== null) {
              clearInterval(t1);

              this.continuaRidisegno(t, tipoHistogramma);
            } else {
              q++;
              if (q > 10) {
                clearInterval(t);
              }
            }
          }, 100);
        }
      }
  }
  // }

  continuaRidisegno(t, tipoHistogramma) {
      // logConsole('Istogrammi. divIstogrammi trovato per ridisegno', t.NumeroFrame2);
    // if (divIstogramma && divIstogramma !== null) {
      let fattore;
      if (t.heightChart2) {
        fattore = t.heightChart2;
        fattore = +(fattore.replace('X', ''));
      } else {
        fattore = 1;
      }

      this.calcolaAltezzaGrafici(t, t.nomiLabelsApp[t.NumeroFrame2], tipoHistogramma, 'ContinuaDisegniIstogrammi');

      const nomeChart = HistogramComponent.nomiChart[t.NumeroFrame2][0];
      t.dimeBarre[t.NumeroFrame2] = 20;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righeFinali, righeFinali.length, righeFinali[0].dataPoints.length);
      if (tipoHistogramma.toUpperCase().indexOf('BAR') > -1) {
        // if (righeFinali[0].dataPoints) {
          t.dimeBarre[t.NumeroFrame2] = 20;
      } else {
        const divIstogramma = document.getElementById(nomeChart);
        if (divIstogramma && divIstogramma !== null) {
          let larghezzaDIV = divIstogramma.getBoundingClientRect().width - 15;
          //let largh = Math.ceil((t.elementView.nativeElement.offsetWidth * 65) / 100);
          if (t.tipoLegendaIstogrammi2 === 'LEFT') {
            // largh -= 140;
            larghezzaDIV -= 140;
          }
          t.dimeBarre[t.NumeroFrame2] = Math.floor(larghezzaDIV / (this.appoRigheFinali[t.NumeroFrame2] + 1)) - 1;
          // logConsole('BARRE 2: ', t.NumeroFrame2, larghezzaDIV, this.appoRigheFinali[t.NumeroFrame2] + 1, t.dimeBarre[t.NumeroFrame2]);
        } else {
          t.dimeBarre[t.NumeroFrame2] = 1;
        }
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.elementView.nativeElement.offsetWidth, largh, righeFinali.length, this.dimeBarre);
      }

      t.chartsIstogrammi[t.NumeroFrame2].forEach(element2 => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Controllo render' , i, element2);
        if (element2 !== undefined && element2 !== '' && element2 !== null &&
          element2.canvas && element2.canvas !== null) {
          element2.options.height = t.altezzaGraficiIstogrammi[t.NumeroFrame2];
          // logConsole('Chart', i, element2);

          element2.options.dataPointWidth = tipoHistogramma === 'boxAndWhisker' ? t.dimeBarre[t.NumeroFrame2] / 3 : t.dimeBarre[t.NumeroFrame2],
          
          element2.render();
        }
      });
    // }
  
    // logConsole('Istogrammi ridisegno finale', t.NumeroFrame2);

    t.Utils.dimensioniFramesModif[t.NumeroFrame] = t.Utils.dimensioniFrames[t.NumeroFrame];

    t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
  }
  // buttami = true;

  elaboraRigheJSON(t, data, index, tipoHistogramma, tipologia, modalita, array) {
    // t.quantiGraficiHICiSono = 0;

    /* const puntini = {
      'name': 'Histogram',
      'dataPoints': righeJson,
      'type': 'column',
      // 'click': t.onClick,
    }; */

    // t.Utils.contatoreGraficiHistogram = 0;
    // t.Utils.quantoContatoreGraficiHistogram = 0;

    t.dimeBarre[t.NumeroFrame2] = 9999;
    // t.Utils.altezzaGraficoHistogram[t.frameAttivo][t.NumeroFrame] = new Array();
    if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
      t.measureDaDisegnareHistogram[t.NumeroFrame2] = new Array();
    }
    // this.charts = new Array();
    index = 0;

    const righe = new Array();
    const tipi = new Array();
    const nomiLabels = new Array();
    const contaX = new Array();
    // let minY = 999;
    // let maxY = -999;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.checkSeverity2);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data);
    t.asseXMinimo[t.NumeroFrame2] = +data.value_1_min - 1;
    t.asseXMassimo[t.NumeroFrame2] = +data.value_1_max + 1;
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Asse x min/max', t.asseXMinimo[t.NumeroFrame2], t.asseXMassimo[t.NumeroFrame2]);

    const numeroColonne = t.asseXMassimo[t.NumeroFrame2] - t.asseXMinimo[t.NumeroFrame2];
    t.numeroColonne[t.NumeroFrame2] = numeroColonne;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Numero colonne istogramma', t.numeroColonne[t.NumeroFrame2]);

    let qualeIndex = -1;
    let listaDati = data.DataTable;
    if (!listaDati || listaDati === null) {
      listaDati = new Array();
    }
    // if (!this.buttami) { listaDati = []; }
    // this.buttami = !this.buttami;

    // if (data.DataTable && data.DataTable !== null) {
      listaDati.forEach(element => {
        // if (element.tms !== null) {
        // const element = ele.properties;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
        let valoreChartLabel = '';

        if (tipoHistogramma.toUpperCase().indexOf('BAR') > -1 && !t.doubleGraph2) {
          // valoreChartLabel = element.measr_code_3 + ' ' + element.measr_code_1;
          valoreChartLabel = element.value_3 + '§' + element.value_1;
          // logConsole('Valore chart label 1 per tipi', valoreChartLabel);
          /* if (qualeIndex === -1) {
            righe.push('');
            contaX.push(1);
            tipi.push('_');
            qualeIndex = tipi.length - 1;
          } */

          // valoreChartLabel = ExternalUtilities.PrendeNomeMisuraDaCodice(element.measr_code_3, t.measureData2) + ' ' + ExternalUtilities.PrendeNomeMisuraDaCodice(element.measr_code_1, t.measureData2)
        } else {
          valoreChartLabel = element.value_3;
          if (!valoreChartLabel) { valoreChartLabel = ' '; }
          // logConsole('Valore chart label 2 per tipi', valoreChartLabel);
          qualeIndex = -1;
        }
        // logConsole('Valore chart label 2 per tipi', valoreChartLabel);

        
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, valoreChartLabel);
        if (valoreChartLabel === undefined || valoreChartLabel === null) {
          valoreChartLabel = 'UNDEFINED';
        }
        if (valoreChartLabel !== null && valoreChartLabel !== '') {
          valoreChartLabel = ExternalUtilities.effettuaReplace(valoreChartLabel, '"', '');

          let index3 = 0;
          // if (tipoHistogramma.toUpperCase().indexOf('BAR') === -1) {
          /* if (t.doubleGraph2) {
            if (qualeIndex === -1) {
              righe.push('');
              contaX.push(1);
              tipi.push(valoreChartLabel);
              qualeIndex = 0;
            }
          } else { */
            tipi.forEach(element2 => {
              if (qualeIndex === -1 && valoreChartLabel === element2) {
                qualeIndex = index3;
              }
              index3++;
            });
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, qualeIndex);
            if (qualeIndex === -1) {
              righe.push('');
              contaX.push(1);
              tipi.push(valoreChartLabel);
              qualeIndex = tipi.length - 1;
              // righe[qualeIndex].push(new Array());
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'X:', GestioneGrafici.asseXScatter[qualeIndex]);
            }
          // }
          // } else {
          //   qualeIndex = 0;
          // }

          let valoreXLabel = null;
          let valoreXLabelPerTooltip = null;
          let valoreY_Count = null;
          let valoreYColor = null;
          let valoreYLabel = null;
          let valoreY_Barra = null;
          let valoreY_Min = null;
          let valoreY_Max = null;
          let valoreY_Avg = null;
          let valoreY_Perc2 = null;
          let valoreY_SR = null;
          let valoreY_CD = null;
          let valore_SEVERITY = null;
          let valore_Chart = null;
          let perc = null;
          let valoreY_P25 = null;
          let valoreY_P50 = null;
          let valoreY_P75 = null;
          let valoreY_Sum = null;

          // Prima stavano a riga 1286 e non era commentato lo stesso campo sulla numerica
          if (t.eventsMeasure2 !== true) {
            valoreYLabel = element.value_2;
          } else {
            valoreYLabel = element.measr_code_2;
          }
          // Prima stavano a riga 1286 e non era commentato lo stesso campo sulla numerica

          /* logConsole('HISTO: Tipologia', tipologia);
          logConsole('HISTO: Modalita', modalita);
          logConsole('HISTO: Tipo istogramma', tipoHistogramma);
          logConsole('HISTO: Element', element);
          logConsole('HISTO: doubleGraph', t.doubleGraph2); */

          if (tipologia === 'STR') {
            if (tipoHistogramma.toUpperCase().indexOf('BAR') > -1) {
              valoreXLabel = element.value_3 + ' ' + element.value_1;
              // valoreXLabel = ExternalUtilities.PrendeNomeMisuraDaCodice(element.value_3, t.measureData2)+ ' ' + ExternalUtilities.PrendeNomeMisuraDaCodice(element.value_1, t.measureData2);
            } else {
              valoreXLabel = element.value_1;
            }
            valoreXLabelPerTooltip = element.value_1;
            valoreY_Count = element.count;
            valoreYColor = element.color_2;

            valoreY_Barra = element.count;
            // if (t.debug2 === true) { t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Valore Y 1:', valoreY_Barra)};
            if (t.eventsMeasure2 === true) {
              if (element.value_2_avg !== null && element.value_2_avg !== undefined)  {
                valoreY_Avg = element.value_2_avg;
              } else {
                valoreY_Avg = '---';
              }
              if (element.value_2_min !== null && element.value_2_min !== undefined)  {
                valoreY_Min = element.value_2_min;
              } else {
                valoreY_Min = '---';
              }
              if (element.value_2_max !== null && element.value_2_max !== undefined)  {
                valoreY_Max = element.value_2_max;
              } else {
                valoreY_Max = '---';
              }
              valoreY_SR = '---';
            } else {
              valoreY_Min = '---';
              valoreY_Max = '---';
              valoreY_Avg = '---';
              valoreY_CD = '---';
              valoreY_SR = '---';
            }
            valore_SEVERITY = element.severity_2;
            valore_Chart = element.value_3;
            // logConsole('Valore chart 1', element);
          } else {
            if (tipoHistogramma.toUpperCase().indexOf('BAR') > -1) {
              valoreXLabel = element.value_3 + ' ' + element.value_1;
            } else {
              valoreXLabel = element.value_1;
            }
            valoreXLabelPerTooltip = element.value_1;
            valoreY_Count = element.count;
            valoreYColor = element.color_2;

            // valoreYLabel = '';
            
            if (modalita.toUpperCase().indexOf('SEVERITY') > -1) {
              if (element.count !== null)  {
                valoreY_Barra = element.count;
                // if (t.debug2 === true) { t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Valore Y 2:', valoreY_Barra) };
              } else {
                valoreY_Barra = '---';
                // if (t.debug2 === true) { t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Valore Y 3:', valoreY_Barra) };
              }
              valoreY_Avg = '---';
            } else {
              if (modalita.toUpperCase().indexOf('SUCCESS RATE') > -1) {
                valoreY_Barra = element.sr_2;
                // if (t.debug2 === true) { t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Valore Y 4:', valoreY_Barra) };
              } else {
                if (modalita.toUpperCase().indexOf('SUM') > -1 && modalita.toUpperCase().indexOf('100%') === -1) {
                  valoreY_Barra = element.value_2_sum;
                  // if (t.debug2 === true) { t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Valore Y 5:', valoreY_Barra) };
                } else {
                  if (modalita.toUpperCase().indexOf('SUM 100%') > -1) {
                    valoreY_Barra = element.perc_2;
                    valoreY_Barra = valoreY_Barra.replace('%', '');
                    while (valoreY_Barra.indexOf(' ') > -1) {
                      valoreY_Barra = valoreY_Barra.replace(' ', '');
                    }
                    valoreY_Barra = +valoreY_Barra;

                    // if (t.debug2 === true) { t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Valore Y 5 NEW:', valoreY_Barra) };
                  } else {
                    if (element.value_2_avg !== null)  {
                      valoreY_Barra = element.value_2_avg;
                      // if (t.debug2 === true) { t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Valore Y 6:', valoreY_Barra) };
                    } else {
                      valoreY_Barra = '---';
                      // if (t.debug2 === true) { t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Valore Y 7:', valoreY_Barra) };
                    }
                  }
                }
              }
            }

            if (element.perc_2 !== null && element.perc_2 !== undefined)  {
              valoreY_Perc2 = valoreY_Barra + '%';
            } else {
              valoreY_Perc2 = '---';
            }
            if (element.value_2_avg !== null && element.value_2_avg !== undefined)  {
              valoreY_Avg = element.value_2_avg;
            } else {
              valoreY_Avg = '---';
            }
            if (element.value_2_min !== null && element.value_2_min !== undefined)  {
              valoreY_Min = element.value_2_min;
            } else {
              valoreY_Min = '---';
            }
            if (element.value_2_max !== null && element.value_2_max !== undefined)  {
              valoreY_Max = element.value_2_max;
            } else {
              valoreY_Max = '---';
            }
            if (element.value_2_p25 !== null && element.value_2_p25 !== undefined)  {
              valoreY_P25 = element.value_2_p25;
            } else {
              valoreY_P25 = '---';
            }
            if (element.value_2_p50 !== null && element.value_2_p50 !== undefined)  {
              valoreY_P50 = element.value_2_p50;
            } else {
              valoreY_P50 = '---';
            }
            if (element.value_2_p75 !== null && element.value_2_p75 !== undefined)  {
              valoreY_P75 = element.value_2_p75;
            } else {
              valoreY_P75 = '---';
            }
            if (element.value_2_sum !== null && element.value_2_sum !== undefined)  {
              valoreY_Sum = element.value_2_sum;
            } else {
              valoreY_Sum = '---';
            }

            valoreY_CD= element.sr_2;
            valoreY_SR = element.sr_2;
            valore_SEVERITY = element.severity_2;
            valore_Chart = element.value_3;
            // logConsole('Valore chart 2', element);
          }

          if (element.perc_2) {
            perc = element.perc_2;
          } else {
            perc = 0;
          }

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, valoreY_Barra);

          if (valoreXLabel !== undefined && valoreY_Count !== undefined && valoreYColor !== undefined &&
            valoreXLabel !== null && valoreY_Count !== null && valoreYColor !== null &&
            valoreXLabel !== '' && valoreYColor !== '' &&
            valoreXLabel !== 'NoValue' && valoreYColor !== 'NoValue') {

              if (t.eventsMeasure2 === true) {
                if (valoreYLabel === undefined) { valoreYLabel = ''; }
                valoreYLabel = valoreYLabel.replace('%', '');
              }

              let nuovaRiga = '{ "x": ' + contaX[qualeIndex] + ', "y": ' + (valoreY_Barra === '---' ? 0 : valoreY_Barra) + ', ' +
                '"yF": "' + (valoreY_Barra === '---' ? 0 : this.formattaNumero(valoreY_Barra)) + '", ' +
                '"label": "' + valoreXLabel + '", "labelPerTooltip": "' + valoreXLabelPerTooltip + '", "color": "' + valoreYColor +
                '", "YLabel": "' + valoreYLabel + '", "Count": ' + valoreY_Count + ', "perc": "' + perc + '", ' +
                '"CountF": "' + this.formattaNumero(valoreY_Count) + '", "percF": "' + this.formattaNumero(perc) + '", "perc2": "' + valoreY_Perc2 + '" ';
              contaX[qualeIndex]++;
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, qualeIndex, contaX[qualeIndex]);

              if (tipoHistogramma === 'boxAndWhisker') {
                nuovaRiga += ', "yPerBW": [' +
                    (valoreY_Min !== '---' ? valoreY_Min : '0') + ', ' +
                    (valoreY_P25 !== '---' ? valoreY_P25 : '0') + ', ' +
                    (valoreY_P75 !== '---' ? valoreY_P75 : '0') + ', ' +
                    (valoreY_Max !== '---' ? valoreY_Max : '0') + ', ' +
                    (valoreY_P50 !== '---' ? valoreY_P50 : '0') +
                  ']';
              }

              nuovaRiga += ', "p25": ' + (valoreY_P25 !== '---' ? valoreY_P25 : '0') + ', ';
              nuovaRiga += '"p50": ' + (valoreY_P50 !== '---' ? valoreY_P50 : '0') + ', ';
              nuovaRiga += '"p75": ' + (valoreY_P75 !== '---' ? valoreY_P75 : '0') + ' ';

              nuovaRiga += ', "p25F": "' + (valoreY_P25 !== '---' ? this.formattaNumero(valoreY_P25) : '0') + '", ';
              nuovaRiga += '"p50F": "' + (valoreY_P50 !== '---' ? this.formattaNumero(valoreY_P50) : '0') + '", ';
              nuovaRiga += '"p75F": "' + (valoreY_P75 !== '---' ? this.formattaNumero(valoreY_P75) : '0') + '" ';

              if (valoreY_Min !== '---') {
                nuovaRiga += ', "min": ' + valoreY_Min;
                nuovaRiga += ', "minF": "' + this.formattaNumero(valoreY_Min) + '"';
              } else {
                nuovaRiga += ', "min": 0';
              } ;
              if (valoreY_Max !== '---') {
                nuovaRiga += ', "max": ' + valoreY_Max;
                nuovaRiga += ', "maxF": "' + this.formattaNumero(valoreY_Max) + '"';
              } else {
                nuovaRiga += ', "max": 0';
              } ;
              if (valoreY_Avg !== '---') {
                nuovaRiga += ', "avg": ' + valoreY_Avg;
                nuovaRiga += ', "avgF": "' + this.formattaNumero(valoreY_Avg) + '"';
              } else {
                nuovaRiga += ', "avg": 0';
              }
              if (valoreY_Sum !== '---') {
                nuovaRiga += ', "sum": ' + valoreY_Sum;
                nuovaRiga += ', "sumF": "' + this.formattaNumero(valoreY_Sum) + '"';
              } else {
                nuovaRiga += ', "sum": 0';
              }
              if (valoreY_SR !== '---') {
                nuovaRiga += ', "sr": ' + valoreY_SR;
                nuovaRiga += ', "srF": "' + this.formattaNumero(valoreY_SR) + '"';
              } else {
                nuovaRiga += ', "sr": 0';
              }
              if (valoreY_CD !== '---') {
                nuovaRiga += ', "cd": ' + valoreY_CD;
                nuovaRiga += ', "cdF": "' + this.formattaNumero(valoreY_CD) + '"';
              } else {
                nuovaRiga += ', "cd": 0';
              }
              if (valore_SEVERITY !== '---' && valore_SEVERITY !== undefined) {
                nuovaRiga += ', "severity": "' + valore_SEVERITY + '"';
                nuovaRiga += ', "severityF": "' + this.formattaNumero(valore_SEVERITY) + '"';
              } else {
                nuovaRiga += ', "severity": 0';
              }
              if (valore_Chart !== '---' && valore_Chart !== undefined) {
                nuovaRiga += ', "chart": "' + valore_Chart + '"';
                nuovaRiga += ', "chartF": "' + this.formattaNumero(valore_Chart) + '"';
              } else {
                nuovaRiga += ', "chart": 0';
              }
              nuovaRiga += ' },';
              if (nuovaRiga.indexOf('NaN') === - 1) {
                righe[qualeIndex] += nuovaRiga;
              }
          // } else {
          //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scartata riga della misura ' + tipoGrafico);
              let ok = true;
              nomiLabels.forEach(element2 => {
                if (element2 === valoreXLabel) {
                  ok = false;
                }
              });
              if (ok) {
                nomiLabels.push(valoreXLabel);
              }
          }
        }

      });

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righe[0]);
      // t.caricamentoDatiInCorsoHistogram = false;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tipi);

      if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
        if (tipoHistogramma.toUpperCase().indexOf('BAR') === -1) {
          tipi.forEach(element => {
            t.measureDaDisegnareHistogram[t.NumeroFrame2].push('');
            // t.Utils.altezzaGraficoHistogram[t.frameAttivo][t.NumeroFrame].push(200);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'misura: '  + element + ' - index:' + index, righe[index]);
            // t.quantiGraficiHICiSono = 1;
            index++;
          });
        } else {
          t.measureDaDisegnareHistogram[t.NumeroFrame2].push('');
        }
      }

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.altezzaGraficoHistogram[t.frameAttivo][t.NumeroFrame]);
      // if (!tipi || tipi.length === 0) {
      //   ExternalUtilities.messaggioDiErrore(t, 'No valid data to show scatter: no chart types');
      // }
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Valori per istogramma', t.NumeroFrame2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Tipi:', tipi);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Array:', array);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Righe:', righe[0]);
      /* if (righe && righe[0] && righe[0].length > 0) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Righe parsate:', JSON.parse('[' + righe[0].substring(0, righe[0].length - 1) + ']'));
      } */
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Nomi Labels:', nomiLabels);

      t.tipiApp[t.NumeroFrame2] = tipi;
      t.arrayApp[t.NumeroFrame2] = array;
      t.righeApp[t.NumeroFrame2] = righe;
      t.nomiLabelsApp[t.NumeroFrame2] = nomiLabels;

      /* logConsole('Tipi', tipi);
      logConsole('Array', array);
      logConsole('Righe', righe);
      logConsole('Labels', nomiLabels); */

      this.disegnaHistogramAVideo(t, tipoHistogramma, tipologia, modalita, numeroColonne);

      // const tm = setTimeout(() => {
      //     clearTimeout(tm);
      //   t.refreshaLaMaschera();
      // }, 1000);
    //// } else {
      /* if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 13');
      }
      t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; */
    ////  t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
    //// }
  }

  static nomiChart = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  quanti = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  trovati = ExternalUtilities.creaVettore(environment.quantiFrames, 0);

  disegnaHistogramAVideo(t, tipoHistogramma, tipologia, modalita, numeroX) {   
    let index2 = 0;
    // const q = new Array();
    HistogramComponent.nomiChart[t.NumeroFrame2] = new Array();
    t.measureDaDisegnareHistogram[t.NumeroFrame2] = new Array();
    t.tipiApp[t.NumeroFrame2].forEach(element => {
      // q.push(0);
      HistogramComponent.nomiChart[t.NumeroFrame2].push('chartContainersHistogram_' + t.frameAttivo + '_' + t.NumeroFrame2 + '_' + index2);
      t.measureDaDisegnareHistogram[t.NumeroFrame2].push(index2);
      index2++;
    });
    this.quanti[t.NumeroFrame2] = t.tipiApp[t.NumeroFrame2].length - 1;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Disegna istogrammmi: dati globali ', this.quanti[t.NumeroFrame2], HistogramComponent.nomiChart[t.NumeroFrame2], t.measureDaDisegnareHistogram[t.NumeroFrame2]);

    /* this.trovati[t.NumeroFrame2] = 0;
    this.disegnaHistogramAVideoCiclo(0, t);
    let q = 0;
    const tt = setInterval(() => {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Attesa controllo div istogrammi: ', this.trovati[t.NumeroFrame2], this.quanti[t.NumeroFrame2]);
      if (this.trovati[t.NumeroFrame2] === this.quanti[t.NumeroFrame2]) {
        clearInterval(tt);
        this.disegnaHistogramAVideo2(t, tipoHistogramma, tipologia, modalita, numeroX);
      } else {
        q++;
        if (q > 3) {
          clearInterval(tt);
          // console.error('Impossibile disegnare tutti i div istogrammi: ', this.trovati[t.NumeroFrame2], this.quanti[t.NumeroFrame2])
          this.disegnaHistogramAVideo2(t, tipoHistogramma, tipologia, modalita, numeroX);
        }
      }
    }, 500); */
    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.disegnaHistogramAVideo2(t, tipoHistogramma, tipologia, modalita, numeroX);
    }, 500);
  }

  disegnaHistogramAVideoCiclo(index2, t) {
      const nomeChart = HistogramComponent.nomiChart[t.NumeroFrame2][index2];
    // t.tipiApp[t.NumeroFrame2].forEach(element => {
      const divIstogramma = document.getElementById(nomeChart);
      let q = 0;
      if (divIstogramma !== null) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Disegna istogrammmi: Div per istogramma ' + index2 + ' su frame ' + t.NumeroFrame2 + ' già visibile');

        // this.disegnaHistogramAVideo2(t, nomeChart, tipoHistogramma, tipologia, modalita, numeroX);
        index2++;
        if (index2 <= this.quanti[t.NumeroFrame2]) {
          this.trovati[t.NumeroFrame2]++;
          this.disegnaHistogramAVideoCiclo(index2, t);
        }
      } else {
        const t2 = setInterval(() => {
          const divIstogramma = document.getElementById(nomeChart);
          if (divIstogramma !== null) {
            clearInterval(t2);            
            // this.disegnaHistogramAVideo2(t, nomeChart, tipoHistogramma, tipologia, modalita, numeroX);
            index2++;
            if (index2 <= this.quanti[t.NumeroFrame2]) {
              this.trovati[t.NumeroFrame2]++;
              this.disegnaHistogramAVideoCiclo(index2, t);
            }
          }
          q++;
          if (q > 2) {
            clearInterval(t2);
            console.error('HISTOGRAMMI: Impossibile disegnare istogramma ' + index2 + ' su frame ' + t.NumeroFrame2 + '. DIV non esistente');
            /* index2++;
            if (index2 < this.quanti[t.NumeroFrame2]) {
              this.trovati[t.NumeroFrame2]++;
              this.disegnaHistogramAVideoCiclo(index2, t, tipoHistogramma, tipologia, modalita, numeroX);
            } */
          }
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Disegna istogrammmi: Attesa visibilità div per istogramma ' + index2 + ' su frame ' + t.NumeroFrame2, t.measureDaDisegnareHistogram[t.NumeroFrame2]);
        }, 100);
      }
      index2++;
    // });
  }

  disegnaHistogramAVideo2(t, tipoHistogramma, tipologia, modalita, numeroX) {
    if (t.tipiApp[t.NumeroFrame2] === undefined || t.righeApp[t.NumeroFrame2] === undefined) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Esco da disegna istogrammi', t.tipiApp[t.NumeroFrame2], t.righeApp[t.NumeroFrame2]);

      return;
    }

    // logConsole('TIPI ISTO', t.tipiApp[t.NumeroFrame2]);
    /* const ora = new Date().getTime();
    // this.ultimaVoltaRefresh = ora;
    if (ora - t.Utils.ultimaVoltaHistogram[t.frameAttivo][t.NumeroFrame] < 750) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'esco 2');
      return;
    }

    t.Utils.ultimaVoltaHistogram[t.frameAttivo][t.NumeroFrame] = ora; */
    // t.caricamentoDatiInCorsoHistogram = true;

    t.dimeBarre[t.NumeroFrame2] = 9999;
    // t.Utils.altezzaGraficoHistogram[t.frameAttivo][t.NumeroFrame] = new Array();
    // t.measureDaDisegnareHistogram = new Array();
    // this.charts = new Array();
    // t.caricamentoDatiInCorsoHistogram = true;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno histogramma', t.NumeroFrame);

    ////// t.Utils.maxTipiHistogram[t.frameAttivo][t.NumeroFrame] = 0;

    // let unoSolo = false;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Sto qua 1');
    if (t.tipiApp[t.NumeroFrame2].length === 1) {
      const nomeChart = 'cntHistogram_' + t.frameAttivo + '_' + t.NumeroFrame;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.nomiLabelsApp[t.NumeroFrame].length);
      if (document.getElementById(nomeChart) !== undefined) {
        const dimeYY = 100 + (t.nomiLabelsApp[t.NumeroFrame2].length * 30);
        // document.getElementById(nomeContenitore).clientHeight;
        // if (dimeY > 400) { dimeY = 400; };
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dimensioni chart:', dimeYY);
        // t.Utils.altezzaGraficoHistogram[t.frameAttivo][t.NumeroFrame][0] = dimeYY;
        t.dimeYApp[t.NumeroFrame2] = dimeYY;
      } else {
        t.dimeYApp[t.NumeroFrame2] = 200;
      }
    } else {
      t.dimeYApp[t.NumeroFrame2] = 200;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Sto qua 2');
    let quantiGrafici = 0;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tipi app', t.tipiApp);
    if (!t.doubleGraph2) {
      t.tipiApp[t.NumeroFrame2].forEach(element => {
        quantiGrafici++;
      });
    } else {
      quantiGrafici = 1;
      t.measureDaDisegnareHistogram[t.NumeroFrame2] = [''];
    }

    if (quantiGrafici > 100) {
      t.erroreHistogram[t.NumeroFrame2] = 'Too many charts (> 100)!';

      t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
      return;
    } else {
      t.erroreHistogram[t.NumeroFrame2] = '';
    }

    if (tipoHistogramma.toUpperCase().indexOf('BAR') > -1) {
      // if (righeFinali[0].dataPoints) {
        // logConsole('Altezza grafico 4', this.altezzaPerBar[t.NumeroFrame2]);

        t.altezzaGraficiIstogrammi[t.NumeroFrame2] = this.altezzaPerBar[t.NumeroFrame2];
        this.altezzaGraficoBarMulti[t.NumeroFrame2] = this.altezzaPerBar[t.NumeroFrame2];

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Altezza grafico Istogrammi BAR', t.altezzaGraficiIstogrammi[t.NumeroFrame2]);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Quanti grafici Istogrammi', quantiGrafici);
    } else {
      const nomeChart = "divIstogrammi_" + t.NumeroFrame2;
      const divIstogramma = document.getElementById(nomeChart);

      if (divIstogramma && divIstogramma !== null) {
        let fattore;
        if (t.heightChart2) {
          fattore = t.heightChart2;
          fattore = +(fattore.replace('X', ''));
        } else {
          fattore = 1;
        }

        let altGrafico = 0;
        const altezzaDIV = divIstogramma.getBoundingClientRect().height - 15;

        // logConsole('Quanti istogrammi 2', quantiGrafici);

        altGrafico = altezzaDIV / quantiGrafici;
        if (altGrafico < 75) { //  < 150) { MODIFICHE PER MAIL 22/06/2023 07:50
          altGrafico = 75; // = 150;
        }
        if (t.heightChart2) {
          altGrafico *= (+fattore);
        }  
        // let altezzaDIV = divIstogramma.nativeElement.offsetHeight - 15;

        /* if (t.tipoLegendaIstogrammi2 === 'TOP') {
          altezzaDIV -= 40;
        } */

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Altezza grafico Istogrammi', altezzaDIV);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Quanti grafici Istogrammi', quantiGrafici);

        // // logConsole('Istogrammi Height 2: ' + t.heightChart2, altGrafico);
        // logConsole('Altezza grafico 5', altGrafico, fattore, quantiGrafici);

        t.altezzaGraficiIstogrammi[t.NumeroFrame2] = altGrafico;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Altezza Grafici Istogrammi', altGrafico);
      }
    }

    // Sempre, non solo con struttura da ricreare: aggiungeGraficoHistogram crea ogni volta grafici nuovi
    // (il ramo di aggiornamento è commentato). Prima, con struttura già disegnata, i vecchi grafici restavano
    // nell'elenco senza destroy() e l'elenco cresceva a ogni ridisegno.
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Pulizia strutture istogrammi', t.NumeroFrame2, quantiGrafici);
    ExternalUtilities.distruggiGrafici(t.chartsIstogrammi[t.NumeroFrame2]);
    t.chartsIstogrammi[t.NumeroFrame2] = new Array();

    const tm = setTimeout(() => {
      clearTimeout(tm);
      
      let index2 = 0;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Sto qua 3');
      if (quantiGrafici === 0) {
        t.altezzaGraficiIstogrammi[t.NumeroFrame2] = 0;
  
        if (t.chartsIstogrammi[t.NumeroFrame2][index2]) {
          t.chartsIstogrammi[t.NumeroFrame2][index2].options.dataPointWidth = 0;
          t.chartsIstogrammi[t.NumeroFrame2][index2].options.data = [];
          /* t.chartsIstogrammi[t.NumeroFrame2][index2].options.title = '';
          t.chartsIstogrammi[t.NumeroFrame2][index2].title.text = '';
          t.chartsIstogrammi[t.NumeroFrame2][index2].title.options.text = ''; */
        }
        t.legendaHistogram = [];

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Altezza Grafici Istogrammi 0 per mancanza di grafici', t.chartsIstogrammi[t.NumeroFrame2][index2]);
      } else {    
        if (t.doubleGraph2) {
          this.righeDoubleGraph = new Array();
        }
        
        t.tipiApp[t.NumeroFrame2].forEach(element => {
          // if (!unoSolo) {
          //   t.Utils.altezzaGraficoHistogram[t.frameAttivo][t.NumeroFrame][index2] = 150;
          // }
          // t.Utils.altezzaGraficoHistogram[frameAttivo][NumeroFrame][ii] =

          const nomeChart = 'chartContainersHistogram_' + t.frameAttivo + '_' + t.NumeroFrame2 + '_' + index2;

          if (t.doubleGraph2) {
            this.righeDoubleGraph.push({
              id: index2,
              Dati: new Array()
            });
          }
          
          this.aggiungeGraficoHistogram(t, element, index2, t.righeApp[t.NumeroFrame2][index2],
              t.arrayApp[t.NumeroFrame2], tipoHistogramma, modalita, nomeChart, tipologia, t.dimeYApp[t.NumeroFrame2],
              t.doubleGraph2);

          if (!t.doubleGraph2) {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, numeroX);
            let dimeX = 0;
            let dimeY = 0;
            if (document.getElementById(nomeChart) !== undefined && document.getElementById(nomeChart) !== null) {
              dimeX = document.getElementById(nomeChart).clientWidth;
              if (t.tipiApp[t.NumeroFrame2].length === 1) {
                dimeY = t.dimeYApp[t.NumeroFrame2];
              } else {
                dimeY = document.getElementById(nomeChart).clientHeight;
              }
            }

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, dime, numeroX);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.charts[numeroGrafico].plotArea);

            /* if (dimeX > 0 && dimeY > 0 && numeroX > 0) {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dimensioni chart:', t.NumeroFrame , dimeX, dimeY, numeroX);
              let dimeBarre2;
              if (tipoHistogramma.indexOf('Column') > - 1) {
                dimeBarre2 = Math.round((dimeX - 150) / (numeroX));
                if (dimeBarre2 < 1) { dimeBarre2 = 1; }
              } else {
                // dimeBarre2 = Math.round((dimeY - 150) / (numeroX));
                // if (dimeBarre2 < 1) { dimeBarre2 = 1};
                dimeBarre2 = 30;
              }
              if (dimeBarre2 < this.dimeBarre) {
                this.dimeBarre = dimeBarre2;
              }
            } */

            // this.dimeBarre = numeroX;
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Dimensione barre prima del render:', t.dimeBarre[t.NumeroFrame2]);
          }

          index2++;
        });

        if(t.doubleGraph2) {
          this.disegnaDoubleGraph(t);
        }
      }

      this.calcolaAltezzaGrafici(t, t.nomiLabelsApp[t.NumeroFrame2], tipoHistogramma, 'DisegnaHistogramAVideo2');

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.dimeBarre);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: controllo charts ', t.chartsIstogrammi[t.NumeroFrame2]);

      if (t.chartsIstogrammi[t.NumeroFrame2] !== undefined && t.chartsIstogrammi[t.NumeroFrame2] !== null) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.charts);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dimensione barre', this.dimeBarre);
        let i = 0;
        const tm = setTimeout(() => {
          clearTimeout(tm);

          t.chartsIstogrammi[t.NumeroFrame2].forEach(element2 => {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Controllo render' , i, element2);
            if (element2 !== undefined && element2 !== '' && element2 !== null &&
              element2.canvas && element2.canvas !== null) {
              // element2.set('dataPointWidth', this.dimeBarre);

              if (modalita.toUpperCase().indexOf('SUCCESS RATE') > -1) {
                element2.options.axisY.viewportMaximum = 100;
                element2.options.axisY.viewportMinimum = 0;
              }

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.maxTipiHistogram);
              // if (t.Utils.maxTipiHistogram[t.frameAttivo][t.NumeroFrame] > 0) {
              /* if (element2.axisX[0] !== undefined) {
                // element2.axisX[0].set('minimum', -.5);
                // element2.axisX[0].set('maximum', t.Utils.maxTipiHistogram[t.frameAttivo][t.NumeroFrame] + .5);

                const diff = Math.abs(t.asseXMassimo[t.NumeroFrame2] - t.asseXMinimo[t.NumeroFrame2]);
                // if (t.debug2 === true) {
                //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Minimo: ', this.asseXMinimo);
                //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Massimo: ', this.asseXMassimo);
                //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Diff: ', this.asseXMinimo);
                // }
                element2.axisX[0].set('minimum', - 1); // this.asseXMassimo.toString());
                element2.axisX[0].set('maximum', diff - 1); // this.asseXMinimo.toString());
              } */
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2);

                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2.axisX[0]);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tipologia', tipologia);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Modalità', modalita);

              /* t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elemento istogramma prima', i, element2);

              if (tipoHistogramma === 'stackedColumn100' || tipoHistogramma === 'stackedBar100'
                  || (tipologia === 'NUM' &&
                  modalita.toUpperCase().indexOf('SEVERITY') === -1 && modalita.toUpperCase().indexOf('COUNT') > -1)) {
                this.aggiungeCount(element2, modalita);
              }
              if (tipologia === 'NUM')  {
                this.aggiungeMinMax(element2, modalita);
              }

              // } */
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elemento istogramma dopo', element2);
              // i++;

              // if (element2 && element2.canvas && element2.canvas !== null) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: eseguo render elemento ', i, element2);

                i++;

                element2.render();
              // }
            }
          });
        }, 10);

        // t.refreshaLaMaschera();s
      }

      if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
        t.giaDisegnataStruttura[t.NumeroFrame2] = true;
      }

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Fine operazione');
      t.comboDisabilitata = false;
      t.staGiaDisegnandoGraficiHistogram[t.NumeroFrame2] = false;
      /* if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: tolgo rondella 14');
      }
      t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false; */

      /* if (tipoHistogramma.toUpperCase().indexOf('BAR') > -1 && !t.modalitaRealTimeAttiva2 && !this.giaRidisegnato[t.NumeroFrame2]) {
        this.giaRidisegnato[t.NumeroFrame2] = true;
        // Faccio ridisegnare il grafico per sistemarlo (quando disegna le barre diverta impiastricciato)
        const tm2 = setTimeout(() => {
          clearTimeout(tm2);

          // alert('ridisegno');
          this.disegnaHistogram(t, false, true);
        }, 50);
      } */
    }, 100);
  }

  calcolaAltezzaGrafici(t, nomiLabels, tipoIstogramma, daDove) {
    const quantiGrafici2 = (t.tipiApp[t.NumeroFrame2].length);
    const altezzaDIV = t.elementView.nativeElement.offsetHeight - 10;

    // logConsole('Altezza grafico 1', quantiGrafici2);

    let altGrafico;

    /* logConsole('Tipo istogramma', t.NumeroFrame2, tipoIstogramma, daDove);
    logConsole('Tipo istogramma tipi', t.NumeroFrame2, t.tipiApp[t.NumeroFrame2]);
    logConsole('Tipo istogramma array', t.NumeroFrame2, t.arrayApp[t.NumeroFrame2]);
    logConsole('Tipo istogramma righe', t.NumeroFrame2, t.righeApp[t.NumeroFrame2]);
    logConsole('Tipo istogramma nomi', t.NumeroFrame2, t.nomiLabelsApp[t.NumeroFrame2]); */

    if (quantiGrafici2 === 1 || t.doubleGraph2) {
      if (tipoIstogramma === 'stackedBar' || tipoIstogramma === 'stackedBar100') {
        const quanteBarre = nomiLabels.length + 1;
        altGrafico = 120 + (quanteBarre * 20);
        // logConsole('Impostata altezza grafico 1 da ' + daDove, t.NumeroFrame2, quanteBarre, altGrafico);
      } else {
        altGrafico = altezzaDIV;
        // logConsole('Impostata altezza grafico 2 da ' + daDove, t.NumeroFrame2, altGrafico);

        if (t.visualizzaLegendaHistogram2 && t.legendaHistogram && t.legendaHistogram.length > 0 && t.tipoLegendaIstogrammi2 === 'TOP') {
          altGrafico -= 75;
        }
      }
    } else {
      let legenda = 0;

      if (t.visualizzaLegendaHistogram2 && t.legendaHistogram && t.legendaHistogram.length > 0 && t.tipoLegendaIstogrammi2 === 'TOP') {
        legenda = 75;
      }

      altGrafico = ((altezzaDIV - legenda) / quantiGrafici2);
      // logConsole('Impostata altezza grafico 3 da ' + daDove, t.NumeroFrame2, altGrafico);

      if (t.heightChart2) {
        let fattore = t.heightChart2;
        fattore = fattore.replace('X', '');
        altGrafico *= (+fattore);
        // logConsole('Impostata altezza grafico 4 da ' + daDove, t.NumeroFrame2, altGrafico);
      }
    }

    if (altGrafico < 75) {
      altGrafico = 75;
    }
    
    // logConsole('Altezza grafico finale da ' + daDove, quantiGrafici2, altGrafico);

    t.altezzaGraficiIstogrammi[t.NumeroFrame2] = altGrafico; // altezzaGrafico = ((righeFinali.length) + 1) * 50;
    if (t.altezzaGraficiIstogrammi[t.NumeroFrame2] < 20) { t.altezzaGraficiIstogrammi[t.NumeroFrame2] = 20; }
    this.altezzaPerBar[t.NumeroFrame2] = t.altezzaGraficiIstogrammi[t.NumeroFrame2];

    this.altezzaGraficoBarMulti[t.NumeroFrame2] = this.altezzaPerBar[t.NumeroFrame2];
  }

  onClickHistogram(t, e) {
    // ExternalUtilities.messaggioDiErrore(t, e.dataSeries.type + ', dataPoint { x:' + e.dataPoint.x + ', y: '+ e.dataPoint.y + ' }' );
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e);

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e);
  }

  generaToolTip(t, modalita, tipologia, element, misure) {
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elemento', element);
    const spazi = "&nbsp;&nbsp;&nbsp;";

    const value = ''; // 'value: {YLabel}';
    let altriValori = '';
    // if (modalita.toUpperCase().indexOf('SEVERITY') > - 1) {
    //   altriValori += '<br/>severity: {count}';
    // }
    let ele = '';
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);

    if (this.tipoHistogramma !== 'stackedBar') {
      ele = (t.debug2 === true ? '*1*' : '') + ': {YLabel}';
      ele += '<br />';
    } else {
      if (ele === '1') { 
        ele = (t.debug2 === true ? '*=*' : '') + ': {YLabel}'; 
      }
    }
    

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'VALORI', modalita, tipologia, tipoHistogramma, misure, element);

    if (modalita.toUpperCase().indexOf('SEVERITY') === -1) {
      // if (element !== '1') {
      // ele += ExternalUtilities.PrendeNomeMisuraDaCodice(misure[3], t.measureData2) + ': {chart}<br />';
    // }
      if (tipologia !== 'STR') {
      // if (modalita.toUpperCase().indexOf('AVG') > - 1) {
        // if (modalita.toUpperCase().indexOf('SUM') > -1) {
        altriValori += (t.debug2 === true ? '*2*' : '') + "<br />Measure: " + ExternalUtilities.PrendeNomeMisuraDaCodice(misure[2], t.measureData2, 'GeneraToolTip Istogrammi 4. Frame ' + t.NumeroFrame2) + "<br />";
        // } else {
          altriValori += (t.debug2 === true ? '*2*' : '') + '<br />' + spazi + 'avg: {avgF}';
        // }
      // }
      // if (modalita.toUpperCase().indexOf('MIN') > - 1) {
        altriValori += (t.debug2 === true ? '*3*' : '') + '<br/>' + spazi + 'min: {minF}, max: {maxF}';
      // }
      // if (tipoHistogramma === 'boxAndWhisker') {
        altriValori += '<br />' + spazi + 'p25: {p25F}, p50: {p50F}, p75: {p75F}';
      // }

      // if (modalita.toUpperCase().indexOf('MAX') > - 1) {
      //  altriValori += (t.debug2 === true ? '*4*' : '') + '<br/>max: {max}';
      // }
        altriValori += (t.debug2 === true ? '*5*' : '') + '<br/>' + spazi + 'sr: {srF}';
        altriValori += (t.debug2 === true ? '*21*' : '') + '<br />' + spazi + 'sum: {sumF}';
        altriValori += (t.debug2 === true ? '*21*' : '') + '<br />' + spazi + 'count: {CountF}';
      } else {
        altriValori += (t.debug2 === true ? '*C*' : '') + '<br /><br />' + spazi + 'Perc: {percF}';
        altriValori += (t.debug2 === true ? '*23*' : '') + '<br />' + spazi + 'count: {CountF}';
      }
    } else {
      altriValori += (t.debug2 === true ? '*C*' : '') + '<br /><br />' + spazi + 'Perc: {percF}';
      ele += (t.debug2 === true ? '*6S*' : '') + ': {severityF}<br />';
    }
    
    // } else {
    let aCapo = '<br />';
    if (element.indexOf('§') > -1) {
      const e = element.split('§');
      let misura = ExternalUtilities.PrendeNomeMisuraDaCodice(misure[3], t.measureData2, 'GeneraToolTip Istogrammi 1. Frame ' + t.NumeroFrame2);
      if (misura.indexOf('NOT FOUND') === -1) {
        ele += (t.debug2 === true ? '*6B11*' : '') + misura + ': {chartF}';
      } 
    } else {
      const misura = ExternalUtilities.PrendeNomeMisuraDaCodice(misure[3], t.measureData2, 'GeneraToolTip Istogrammi 2. Frame ' + t.NumeroFrame2);
      if (misura.toUpperCase().trim() !== 'NONE') {
        ele += (t.debug2 === true ? '*6B12*' : '') + misura + ': ' + element;
      } else {
        aCapo = '';
      }
    }
      // }

    /* if (t.eventsMeasure2 === true) {
      altriValori += (t.debug2 === true ? '*7*' : '') + '<br />avg: {avg}';
      // }
      // if (modalita.toUpperCase().indexOf('MIN') > - 1) {
        altriValori += (t.debug2 === true ? '*8*-' : '') + '<br/>min: {min}';
      // }
      // if (modalita.toUpperCase().indexOf('MAX') > - 1) {
        altriValori += (t.debug2 === true ? '*9*' : '') + '<br/>max: {max}';
      // }
        altriValori += (t.debug2 === true ? '*A*' : '') + '<br/>sr: {sr}';
    } */

    // if (modalita.toUpperCase().indexOf('COUNT') > - 1) {
    // altriValori += (t.debug2 === true ? '*B*' : '') + '<br/>Count: {Count}';
    // altriValori += (t.debug2 === true ? '*C*' : '') + '<br />Perc: {perc}';
    // }

    let ele2 = '';
    /* if (element.indexOf('§') > -1) {
      const e = element.split('§');
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elemento ', e);
      ele2 += (t.debug2 === true ? '*6B21*' : '') + ExternalUtilities.PrendeNomeMisuraDaCodice(misure[1], t.measureData2) + ': ' + e[1];
    } else {
      ele2 += (t.debug2 === true ? '*6B22*' : '') + ExternalUtilities.PrendeNomeMisuraDaCodice(misure[1], t.measureData2) + ': {label}';
    } */

    // logConsole('Element', modalita, tipologia, element, misure);
    if (misure[3] && misure[3] !== null && misure[3] !== 'undefined' && misure[3] !== 'null') {
      let e;
      if (element.indexOf('§') > -1) {
        e = element.split('§')[0];
      } else {
        e = element;
      }
      const nomeMisura3 = ExternalUtilities.PrendeNomeMisuraDaCodice(misure[3], t.measureData2, 'GeneraToolTip Istogrammi 5. Frame ' + t.NumeroFrame2) + ": " + e;
      // logConsole('Element 2', nomeMisura3);
      ele2 += (t.debug2 === true ? '*6BC2*' : '') + nomeMisura3 + '<br />';
    }
    if (misure[2] && misure[2] !== null && misure[2] !== 'undefined' && misure[2] !== 'null') {
      let e = '{YLabel}'; 
      const nomeMisura2 = ExternalUtilities.PrendeNomeMisuraDaCodice(misure[2], t.measureData2, 'GeneraToolTip Istogrammi 4. Frame ' + t.NumeroFrame2) + ": " + e;
      // logConsole('Element 1', nomeMisura2);
      ele2 += (t.debug2 === true ? '*6BC1*' : '') + nomeMisura2 + '<br />';
    }

    ele2 += (t.debug2 === true ? '*6B22*' : '') + ExternalUtilities.PrendeNomeMisuraDaCodice(misure[1], t.measureData2, 'GeneraToolTip Istogrammi 3. Frame ' + t.NumeroFrame2) + ': {labelPerTooltip}';

    let inizio = '';
    if (t.eventsMeasure2 === true) {
      inizio = 'Event'
    }

    // let bw = '';
    // if (tipoHistogramma === 'boxAndWhisker') {
    //  bw = '<br />pMin: {pMin} p25: {p25} p50: {p50} p75: {p75} pMax: {pMax}';
    // }

    logConsole('Tipo histogramma', t.NumeroFrame2, this.tipoHistogramma, this.tipoPerChiamata);

    let inizio2 = "";
    if (this.tipoHistogramma !== 'stackedBar') {
      inizio2 = (t.debug2 === true ? '*D*' : '') + inizio +
          ' ' + (t.debug2 === true ? '*E*' : '') + ExternalUtilities.PrendeNomeMisuraDaCodice(misure[2], t.measureData2, 'GeneraToolTip Istogrammi 4. Frame ' + t.NumeroFrame2) +
          ' ' + (t.debug2 === true ? '*F*' : '') + ele +
          ' ' + (t.debug2 === true ? '*G*' : '') + aCapo;
    }

    return {
      // shared: true,
      content: inizio2 +
        ele2 +
        (t.debug2 === true ? '*H*' : '') + value +
        ' ' +
        (t.debug2 === true ? '*F*' : '') + altriValori + (t.debug2 === true ? '*I*' : ''),
        cornerRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, .75)'
    };
  }

  aggiungeGraficoHistogram(t, element, index, riga, misure, tipoHistogramma, modalita, nomeChart, tipologia, altezza, raggruppato) {
    let righe = JSON.parse(JSON.stringify(riga));

    if (righe.length > 1) {
      righe = righe.substring(0, righe.length - 1);
    }
    righe = '[' + righe + ']';

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeChart);
    let righeJson = null;

    try {
      righeJson = JSON.parse(righe);
    } catch (e) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nel parse json', righe);
      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righeJson);

    const tipi = new Array();
    const righe2 = new Array();
    let ii = 0;
    let numeroX = 0;
    let ii2 = 0;
    let yy = new Array();

    righeJson.forEach(element2 => {
      const x = element2.label;
      let i = 0;
      let q = -1;

      tipi.forEach(element3 => {
        if (q === -1) {
          if (element3 === x) {
            q = i;
          }
        }
        i++;
      });
      if (q === -1) {
        tipi.push(x);
        righe2.push('');
        yy.push('');
      }
    });

    if (tipoHistogramma.toUpperCase().indexOf('BAR') > -1) {
      // logConsole('RIGHE FINALI 1', t.NumeroFrame2, JSON.parse(JSON.stringify(tipi)));
      tipi.sort((a, b) => b.localeCompare(a));
      // logConsole('RIGHE FINALI 2', t.NumeroFrame2, JSON.parse(JSON.stringify(tipi)));
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tipi);

    tipi.forEach(element2 => {
      righeJson.forEach(element3 => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2, element3.label);
        if (element2 === element3.label) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element3);
          if (tipoHistogramma === 'boxAndWhisker') {
            element3.y = element3.yPerBW;
          }

          let righella = JSON.stringify(element3);
          righella = righella.replace('{', '');
          righella = righella.replace('}', '');
          // righella += ',"label": "' + element2 + '","x": ' + ii
          righella += ',"x": ' + ii;
          righella = '{' + righella + '}';
          righe2[ii2] += righella + ',';
        }
      });

      if (righe2[ii2] !== '') {
        righe2[ii2] = '[' + righe2[ii2].substring(0, righe2[ii2].length - 1) + ']';
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righe2[ii2]);
      }
      ii++;
      ii2++;

        // if (numeroX > this.maxX[t.frameAttivo][t.NumeroFrame]) {
        //   this.maxX[t.frameAttivo][t.NumeroFrame] = numeroX;
      // }
    });

    /* if (tipoHistogramma === 'boxAndWhisker') {
      let i = 0;
      tipi.forEach(element2 => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tipo: ', element2);
        righe2.forEach(element3 => {
          const e = JSON.parse(element3);
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e);
          if (e[0].label === element2) {
            yy[i] += (e[0].y * 15) + ',';
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, yy[i]);
          }
        });
        i++;
      });
      i = 0;
      yy.forEach(element3 => {
        if (yy[i].length > 0) {
          yy[i] = '[' + yy[i].substring(0, yy[i].length - 1) + ', 10, 20, 15, 10]';
        }
        i++;
      });
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, yy);

      const r = new Array();
      i = 0;
      righe2.forEach(element3 => {
        const e = JSON.parse(element3);
        e[0].y = yy[i];
        r.push(JSON.stringify(e));
        i++;
      });
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, r);
    } */

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Numero massimo di x:', t.NumeroFrame, ii);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Numero massimo di y:', tipi.length);

    /* if (ii - 1 > t.Utils.maxTipiHistogram[t.frameAttivo][t.NumeroFrame]) {
      t.Utils.maxTipiHistogram[t.frameAttivo][t.NumeroFrame] = ii - 1;
    } */
    let righe3 = '';

    numeroX = righe2.length;

    if (numeroX > this.maxX[t.frameAttivo][t.NumeroFrame]) {
      this.maxX[t.frameAttivo][t.NumeroFrame] = numeroX;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.histDisplayAs2, tipoHistogramma);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tipoHistogramma);
    /* if (t.NumeroFrame2 === 6) {

      righe2.forEach(element2 => {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, JSON.parse(element2));
      });
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '-----------------------');
    } */
   
    let percentuale = true;
    if (+t.columnsBars2 === 2) {
      // Se il tipo è colonna e le barre sono più strette di 10px non disegno le percentuali
      const divIstogramma = document.getElementById(nomeChart);
      if (divIstogramma && divIstogramma !== null) {
        const larghezzaDIV = divIstogramma.getBoundingClientRect().width;
        const dimeBarra = larghezzaDIV / righe2.length;
        if (dimeBarra < 15) {
          percentuale = false;
        }
        // logConsole('LARGHEZZA DIV: ', larghezzaDIV, dimeBarra);
      }
    }

    righe2.forEach(element2 => {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2);
      let altro = '';

      if (modalita.toUpperCase().indexOf('AVG') > - 1) {
        altro = '"indexLabel": "{avgF}", "indexLabelPlacement": "outside", "indexLabelFontSize": 11,';
      }
      if (modalita.toUpperCase().indexOf('SUM') > - 1) {
        altro = '"indexLabel": "{sumF}", "indexLabelPlacement": "inside", "indexLabelFontSize": 11,';
      }
      if (modalita.toUpperCase().indexOf('SUM 100%') > - 1) {
        altro = '"indexLabel": "{perc2}", "indexLabelPlacement": "inside", "indexLabelFontSize": 11, "indexLabelFontColor": "white",';
      }
      if (modalita.toUpperCase().indexOf('COUNT DISTINCT') > - 1) {
        altro = '"indexLabel": "{yF}", "indexLabelPlacement": "outside", "indexLabelFontSize": 11,';
      }
      if (modalita.toUpperCase().indexOf('SUCCESS RATE') > - 1) {
        altro = '"indexLabel": "{srF}", "indexLabelPlacement": "outside", "indexLabelFontSize": 11,';
      }

      if (percentuale) {
        if (modalita.toUpperCase().indexOf('SEVERITY') > - 1) {
          altro = '"indexLabel": "{percF}", "indexLabelPlacement": "inside", "indexLabelFontSize": 11,';
        }
        if (modalita.toUpperCase().indexOf('COUNT 100%') > - 1) {
          altro = '"indexLabel": "{percF}", "indexLabelPlacement": "inside", "indexLabelFontSize": 11, "indexLabelFontColor": "white", ';
          /* const ee = JSON.parse(element2);

          ee.forEach(element3 => {
            let perc = element3.perc;
            if (perc) { perc = perc.replace('%', '').trim(); }
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PERC1', element2);

            // if (+perc > 9) {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PERC2 > 9');
            // }
            // element2 += altro;
          }); */
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, altro);

          /* const n = new Array();
          ee.forEach(element3 => {
            element3.indexLabelFormatter = function(e) {
              if (e.dataPoint.perc > 10) {
                return e.dataPoint.perc;
              } else {
                return 'ppp';
              }
            };
            // if (t.NumeroFrame2 === 9) {t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element3);}
            n.push(element3);
          });
          if (t.NumeroFrame2 === 9) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, n);
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, JSON.stringify(n));
            return;
          }
          element2 = JSON.stringify(n);
          if (t.NumeroFrame2 === 9) { t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2); return; } */
        }
      }

      if (tipoHistogramma === 'boxAndWhisker') {
        const e = JSON.parse(element2);
        const valori = e[0].y;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e, valori);
        e[0].pMin = valori[0];
        e[0].p25 = valori[1];
        e[0].p75 = valori[2];
        e[0].pMax = valori[3];
        e[0].p50 = valori[4];
        element2 = JSON.stringify(e);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2);
      }

      righe3 += '{"type": "' + tipoHistogramma + '", "name": "' + element + '", ' + altro + '"dataPoints": ' + element2 + ', "axisYType": "primary"},';
    });

    if (righe3.length > 0) {
      righe3 = '[' + righe3.substring(0, righe3.length - 1) + ']';
    } else {
      let altro = '';

      if (modalita.toUpperCase().indexOf('AVG') > - 1) {
        altro = '"indexLabel": "{avgF}", "indexLabelPlacement": "outside", "indexLabelFontSize": 11,';
      }
      if (modalita.toUpperCase().indexOf('SUM') > - 1) {
        altro = '"indexLabel": "{sumF}", "indexLabelPlacement": "inside", "indexLabelFontSize": 11,';
      }
      if (modalita.toUpperCase().indexOf('SUM 100%') > - 1) {
        altro = '"indexLabel": "{perc2}", "indexLabelPlacement": "inside", "indexLabelFontSize": 11, "indexLabelFontColor": "white",';
      }
      if (modalita.toUpperCase().indexOf('COUNT DISTINCT') > - 1) {
        altro = '"indexLabel": "{yF}", "indexLabelPlacement": "outside", "indexLabelFontSize": 11, ';
      }
      if (modalita.toUpperCase().indexOf('SUCCESS RATE') > - 1) {
        altro = '"indexLabel": "{srF}", "indexLabelPlacement": "outside", "indexLabelFontSize": 11,';
      }

      if (percentuale) {
        if (modalita.toUpperCase().indexOf('SEVERITY') > - 1) {
          altro = '"indexLabel": "{percF}", "indexLabelPlacement": "inside", "indexLabelFontSize": 11,';
        }
      }

      righe3 += '[{"type": "' + tipoHistogramma + '", "name": "' + element + '", ' + altro + '"dataPoints": [], "axisYType": "primary"}]';
    }

    let righeFinali;
    try {
      righeFinali = JSON.parse(righe3);
    } catch (e) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nel parsing degli istogrammi', righe3);
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Index', index);
    let maxY = -9999;

    righeFinali.forEach(element => {
      element.dataPoints.forEach(element2 => {
        let y = element2.y;
        if (y > maxY) {
          maxY = y;
        }
      });
    });

    let minX = 9999;
    let maxX = -9999;
    let ciSonoDecimali = false;

    righeFinali.forEach(element => {
      element.dataPoints.forEach(element2 => {
        let x = +element2.label;
        if (!ciSonoDecimali) {
          let xx = x.toString().trim();
          if (xx.indexOf(".") > -1 && xx.indexOf(".00") === -1) {
            ciSonoDecimali = true;
          }
        }
        if (x > maxX) {
          maxX = x;
        }
        if (x < minX) {
          minX = x;
        }
      });
    });

    // logConsole('Asse X: ', minX, maxX, ciSonoDecimali);

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Righe finali', righeFinali, maxY);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza massima: ', maxY);
    // return;

    righeFinali.forEach(element => {
      element.click = this.onClick2.bind(null, t);
    });
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Righe finali Istogramma', righeFinali);

    /* data: [{
      type: puntini.datasets[0].type,
      name: puntini.datasets[0].name,
      dataPoints: puntini.datasets[0].data,
      'click': this.onClickHistogram,
    }], */

    // const puntini = righeFinali;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, misure, element, modalita);

    const contentToolTip = this.generaToolTip(t, modalita, tipologia, element, misure);

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, ele);
    let axisColor = '#c6c6c6';
    const fontColor = 'transparent';

    let titolo = element.replace('§', ' '); // ExternalUtilities.PrendeNomeMisuraDaCodice(misure[3], t.measureData2) + ' ' + element;
    if (titolo === undefined || titolo.toUpperCase().indexOf('UNDEFINED') > - 1 || titolo.toUpperCase().indexOf('NOVALUE') > - 1) { titolo = ''; }

    // if (this.charts !== undefined) {
    let formatoValore = '000';

    // logConsole('Asse X1', righeFinali);

    // Se il valore massimo è compreso fra 0 e 10 (inclusi), la formattazione diventa 0.00
    // negli altri valori, come funziona adesso
    let formatoValoreX;

    if (Math.abs(maxX - minX) <= 10) {
      formatoValoreX = '0';
    } else {
      if (!ciSonoDecimali) {
        righeFinali.forEach(element => {
          element.dataPoints.forEach(element2 => {
            let x = element2.label;
            element2.label = x.replace('.0', '');
          });
        });
        // logConsole('Righe finali', righeFinali);
      }
      formatoValoreX = '###';
    }

    if (maxY >=0 && maxY <=10 ) {
      // logConsole('Asse X', righeFinali);
      formatoValore = '0.00';
    }
    
    /* let formatoValore = '000\'%\'';
    if ((tipoHistogramma !== 'stackedColumn100' && tipoHistogramma !== 'stackedBar100') ||
      modalita.toUpperCase().indexOf('COUNT') > -1) {
      formatoValore = '000';
    } */

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, tipoHistogramma, formatoValore);

    let intervallo = 1;
    /* let intervallo = -1;
    if (tipoHistogramma.toUpperCase().indexOf('BAR') > -1) {
      intervallo = 1;
      // titolo = '';
    } */

    let altro = new Array();

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tipo istogramma: ', tipoHistogramma, tipologia, modalita);
    // }

    let coloreAsseY2;
    if (tipoHistogramma === 'stackedColumn100' || tipoHistogramma === 'stackedBar100'
      || (tipologia === 'NUM' &&
      modalita.toUpperCase().indexOf('SEVERITY') === -1 && modalita.toUpperCase().indexOf('COUNT') > -1) && modalita.toUpperCase().indexOf(' DISTINCT') === -1) {
      coloreAsseY2 = '#646464';
      altro.push(this.aggiungeCount(t, righeFinali, modalita, false));
    } else {
      coloreAsseY2 = 'transparent';
      altro.push(this.aggiungeCount(t, righeFinali, modalita, true));
    }
    if (tipologia === 'NUM')  {
      if (modalita.indexOf('Min') !== -1 || modalita.indexOf('Max') !== -1) {
        coloreAsseY2 = '#646464';
        altro.push(this.aggiungeMinMax(t, righeFinali, modalita));
      }
    }
    altro.forEach(element => {
      if (element) {
        righeFinali.push(element);
      }
    });

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati histogram', righeFinali);
    // }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeChart, altezza);

    // let altezzaGrafico = 200;
    t.dimeBarre[t.NumeroFrame2] = 20;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righeFinali, righeFinali.length, righeFinali[0].dataPoints.length);
    if (tipoHistogramma.toUpperCase().indexOf('BAR') > -1) {
      // if (righeFinali[0].dataPoints) {
        t.dimeBarre[t.NumeroFrame2] = 20;
    } else {
      const divIstogramma = document.getElementById(nomeChart);
      let larghezzaDIV = divIstogramma.getBoundingClientRect().width - 15;
      //let largh = Math.ceil((t.elementView.nativeElement.offsetWidth * 65) / 100);
      if (t.tipoLegendaIstogrammi2 === 'LEFT') {
        // largh -= 140;
        larghezzaDIV -= 140;
      }
      t.dimeBarre[t.NumeroFrame2] = Math.floor(larghezzaDIV / (righeFinali.length + 1)) - 1;
      // logConsole('BARRE: ', t.NumeroFrame2, larghezzaDIV, righeFinali.length + 1, t.dimeBarre[t.NumeroFrame2]);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.elementView.nativeElement.offsetWidth, largh, righeFinali.length, this.dimeBarre);
    }
    this.appoRigheFinali[t.NumeroFrame2] = righeFinali.length;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza istogrammi', t.altezzaGrafici[t.NumeroFrame2]);

    // t.Utils.altezzaGraficiHistogram[t.frameAttivo][t.NumeroFrame][index] = altezza;
    // const cjs = new t.canvasJS();

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame2 + '.' + t.frameAttivo2 + ' ' + t.nomiFrames[t.frameAttivo2]);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, ExternalUtilities.PrendeNomeMisuraDaCodice(misure[3], t.measureData2, 'Aggiunge Grafico Istogrammi 1. Frame ' + t.NumeroFrame2));
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, ExternalUtilities.PrendeNomeMisuraDaCodice(misure[1], t.measureData2, 'Aggiunge Grafico Istogrammi 2. Frame ' + t.NumeroFrame2));
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, titolo);

    // if (index === 0) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righeFinali);
    HistogramComponent.NumeroFrame = t.NumeroFrame2;

    if (modalita.toUpperCase().indexOf('COUNT 100%') > - 1 || modalita.toUpperCase().indexOf('SUM 100%') > - 1) {
      righeFinali.forEach(element => {
        let ind = 0;
        element.indexLabelFormatter = function(e) {
          /* const nomeChart = "divIstogrammi_" + HistogramComponent.NumeroFrame;
          const divIstogramma = document.getElementById(nomeChart);
          const altezzaDiv = divIstogramma.getBoundingClientRect().height;
          const altezzaMinima = Math.floor((altezzaDiv - 50) / 20); */

          let p;

          if (modalita.toUpperCase().indexOf('COUNT 100%') > - 1) {
            p = e.dataPoint.perc;
          } else {
            p = e.dataPoint.percF;
          }
          // p = e.dataPoint.y;

          // if (p[1]) { p = p[0]; return ''; }

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, index, e, altezzaMinima, p);
          if (p) {
            p = +(p.replace('%', '').trim());
            // p = p.replace('%', '').trim();
      
            // let scritta = 'frame ' + HistogramComponent.NumeroFrame + ': ' + ind + ' Altezza div ' + altezzaDiv + ' Altezza minima ' + altezzaMinima + ' Valore ' + p;

            let ritorno = '';
            if (+p > 6) { // 6
              ritorno = e.dataPoint.perc;
              // scritta += ' -> disegnato';
            } else {
              // if (t.debug2 === true) {
                // scritta += ' -> NON DISEGNATO';
              // }
              ritorno = '';
            }
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, scritta);

            return ritorno;
          } else {
            return '';
          }
        };
        ind++;
      });
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Righe finali 1', righeFinali);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Check per dati finali', t.doubleGraph2);

    // Conversione istogramma con multi grafici a singolo
    /* const r = [ JSON.parse(JSON.stringify(righeFinali[0])) ];
    let primo = true;
    righeFinali.forEach(element => {
      if (element.type !== 'error') {
        if (!primo) {
          element.dataPoints.forEach(element2 => {
            r[0].dataPoints.push(element2);
          });
        } else {
          primo = false;
        }
      }
    });
    if (!t.doubleGraph2) {
      righeFinali.forEach(element => {
        if (element.type === 'error') {
          r.push(element);
        }
      });
    }

    righeFinali = JSON.parse(JSON.stringify(r));

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Righe finali 2', r); */

    if (raggruppato) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Qui', this.righeDoubleGraph, index);
      righeFinali.forEach(element => {
        this.righeDoubleGraph[this.righeDoubleGraph.length - 1].Dati.push(element);
      });
      return;
    }

    // logConsole('FORMATO', formatoValoreX);

    const asseX = {
      fontWeight: 'normal',
      titleWrap: false,
      titleFontSize: 14,
      fontFamily: 'arial',
      interval: intervallo,
      labelFontColor: '#646464',
      labelFontSize: 12,
      labelAngle: 0,
      lineColor: axisColor,
      gridColor: axisColor,
      valueFormatString: formatoValoreX,
      tickColor: '#646464',
      // title: t.Utils.PrendeNomeMisuraDaCodice(misure[1], t.measureData2),
    };
    
    const asseY = {
      title: ExternalUtilities.PrendeNomeMisuraDaCodice(misure[2], t.measureData2, 'Aggiunge Grafico Istogrammi 3. Frame ' + t.NumeroFrame2),
      titleFontSize: 12,
      titleWrap: false,
      titleFontColor: '#555',
      fontWeight: 'normal',
      fontFamily: 'arial',
      labelFontSize: 10,
      lineColor: axisColor,
      gridColor: axisColor,
      labelFontColor: '#555',
      valueFormatString: formatoValore,
      tickColor: '#c6c6c6',
    }

    const asseY2 = {
      title: 'Count',
      titleFontSize: 12,
      titleWrap: false,
      titleFontColor: coloreAsseY2,
      fontWeight: 'normal',
      fontFamily: 'arial',
      labelFontSize: 10,
      lineColor: axisColor,
      gridColor: axisColor,
      labelFontColor: coloreAsseY2,
      valueFormatString: this.formatoValore2[t.NumeroFrame2],
      tickColor: coloreAsseY2,
    };

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, misure[3]);
    let nomeMisura1 = ExternalUtilities.PrendeNomeMisuraDaCodice(misure[3], t.measureData2, 'Aggiunge Grafico Istogrammi 4. Frame ' + t.NumeroFrame2);
    if (nomeMisura1 === 'none') { nomeMisura1 = ''; } else { nomeMisura1 = ' - ' + nomeMisura1; }

    let nomeMisura2 = ExternalUtilities.PrendeNomeMisuraDaCodice(misure[1], t.measureData2, 'Aggiunge Grafico Istogrammi 5. Frame ' + t.NumeroFrame2);
    let virgola = ',';
    if (!titolo) { virgola = ''; }
    if (nomeMisura2 === 'none') { nomeMisura2 = ''; } else { nomeMisura2 = virgola + ' X: ' + nomeMisura2; }

    if (titolo) { titolo = ': ' + titolo; }
    // logConsole('Titolo', titolo, '>' + nomeMisura1 + '<', '>' + nomeMisura2 + '<');

    let cosaScrivere = '';
    if (tipoHistogramma.toUpperCase().indexOf('BAR') > -1) {
      cosaScrivere = t.nomiFrames[t.frameAttivo2] + 
        ' ' + nomeMisura2.replace('X:', '');
    } else {
      cosaScrivere = t.nomiFrames[t.frameAttivo2] + 
        nomeMisura1 + titolo + ' ' + nomeMisura2;
    }
    const strutturaFinale = {
      title: {
        text: cosaScrivere,
        fontSize: 12 , fontFamily: 'Arial', titleWrap: false, titleFontSize: 14
      },
      zoomEnabled: true,
      // height: t.altezzaGrafici[t.NumeroFrame2],
      zoomType: 'x', // change it to "xy" to enable zooming on both axes
      // animationEnabled: true,
      legend: {
        horizontalAlign: "right", // "center" , "right"
        verticalAlign: "top",  // "top" , "bottom"
        fontSize: 15
      },
      toolTip: contentToolTip,
      axisX: asseX,
      axisY: asseY,
      axisY2: asseY2,
      // rangeChanged: this.syncHandler
      dataPointWidth: tipoHistogramma === 'boxAndWhisker' ? t.dimeBarre[t.NumeroFrame2] / 3 : t.dimeBarre[t.NumeroFrame2],
      data: righeFinali,
    }

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Controllo dati dell\'istogramma' , index, t.giaDisegnataStruttura[t.NumeroFrame2], t.chartsIstogrammi[t.NumeroFrame2].length - 1);
    // }
    
    // logConsole('Istogrammi', t.giaDisegnataStruttura[t.NumeroFrame2], index, t.chartsIstogrammi[t.NumeroFrame2].length - 1);

    // if (!t.giaDisegnataStruttura[t.NumeroFrame2] || index > t.chartsIstogrammi[t.NumeroFrame2].length - 1) {
      t.chartsIstogrammi[t.NumeroFrame2].push(new t.CanvJS.Chart(nomeChart, strutturaFinale));
      // if (t.debug2 === true) {
    /*    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Crezione dati dell\'istogramma' , index, t.chartsIstogrammi[t.NumeroFrame2][index], strutturaFinale);
      // }
    } else {
      t.chartsIstogrammi[t.NumeroFrame2][index].options.dataPointWidth = tipoHistogramma === 'boxAndWhisker' ? t.dimeBarre[t.NumeroFrame2] / 3 : t.dimeBarre[t.NumeroFrame2]
      t.chartsIstogrammi[t.NumeroFrame2][index].options.data = strutturaFinale.data;

      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiorno dati dell\'istogramma' , index, t.chartsIstogrammi[t.NumeroFrame2][index], strutturaFinale);
      // }
    } */
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false,  this.charts);
    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dimensione barra:', t.dimeBarre[t.NumeroFrame2], righeFinali);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Quanti istogrammi:', t.chartsIstogrammi[t.NumeroFrame2].length);
    // }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.charts[t.NumeroFrame2]);
    // return;
    // }

    return numeroX;
  }

  onClick2(t, e) {
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Clickato sui grafici', e);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'HISTOGRAMMI: Misure inserite su click', t.misureIstogrammi);

    t.generaToolTip(t, e);

    let ok = false;
    let q = 0;
    let titolo;
    t.misureIstogrammi.forEach(element => {
      if (element && element !== null && element.toUpperCase().indexOf('_TC_RUN_') > -1) {
        ok = true;
        switch (q) {
          case 0:
            titolo = e.dataSeries.name;
            const t = titolo.split('§');
            titolo = t[1];
            break;
          case 1:
            titolo = e.dataPoint.YLabel;
            break;
          case 2:
            titolo = e.dataPoint.label;
            break;
        }
      }
      q++;
    });
    // if (t.misureIstogrammi[2].toUpperCase().indexOf('_TC_RUN_') > -1) {
    //   ok = true;
    // }
    if (ok) {
      if (!titolo || titolo === '' ) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Trovata misura TC_RUN. Esco per misura non rilevata');

        return;
      }

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Trovata misura TC_RUN: ' + titolo + '. Eseguo sincronizzazione');

      // const titolo = e.dataPoint.label;

      const params = {
        v_cntx: t.sessionID2,
        v_str_command: titolo
      };
      t.apiService.chiamataPost(t.Utils, 'string_to_command', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        if (data2 && data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno click istogrammi', data2);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tms ', data2.v_parameter.v_start_time_stamp, data2.v_parameter.v_end_time_stamp);

          // FUNZIONE DI SINCRONIZZAZIONE
          const inizio = data2.v_parameter.v_start_time_stamp;
          // inizio = new Date(inizio).getTime();

          const fine = data2.v_parameter.v_end_time_stamp;
          // const fineS = new Date(fine).getTime();

          const nomeTabella = 'operator_obj_sync_my__upd';
          const params = {
            cntx_id: t.sessionID2,
            v_ds_name: data2.v_parameter.v_dataset,
            v_agn_code: ExternalUtilities.stringaAGNoACT,
            v_ds_tms_min: inizio,
            v_ds_tms_max: fine,
            v_dsg_tms_min: inizio,
            v_dsg_tms_max: fine,
            v_tms_curr: inizio
          };

          t.apiService.chiamataPost(t.Utils, '' + nomeTabella, params)
          // .map(response => response)
          .pipe(takeUntil(this.destroy$.per(t)))
          .subscribe((data2: any) => {
            // const data2 = JSON.parse(data);
            ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);
          });
        }
      });

    }
  }

  aggiungeCount(t, chart, modalita, vuoto) {
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Count. Modalità: ', chart, modalita);

    if (modalita.toUpperCase().indexOf('COUNT') === -1 && modalita.toUpperCase().indexOf('SUM 100%') === -1 && vuoto === false) {
      return;
    }

    const dps = [];

    let maxYCount = 0;
    // if (chart && chart !== null && chart.data !== null && chart.data[0] !== undefined) {
    // if (vuoto === false) {
      chart.forEach(element => {
        const dp = element.dataPoints;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element.dataPoints);
        let q = 0;
        let slabel = '';
        let sx = 0;
        dp.forEach(element2 => {
          q += element2.Count;
          // if (slabel === '') {
            slabel = element2.label;
            sx = element2.x;
          // }
        });
        const qq = [q , q];
        if (q > maxYCount) {
          maxYCount = q;
        }
        let colore;
        if (vuoto === true) {
          colore = 'transparent';
        } else {
          colore = '#0000FF';
        }
        dps.push( { label: slabel, x: sx, y: qq, color: colore, lineColor: '#0000FF' } );
      });

      this.formatoValore2[t.NumeroFrame2] = '000';

      // Se il valore massimo è compreso fra 0 e 10 (inclusi), la formattazione diventa 0.00
      // negli altri valori, come funziona adesso
      if (maxYCount >=0 && maxYCount <=10 ) {
        this.formatoValore2[t.NumeroFrame2] = '0.00';
      }
  
    /* } else {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiungo asse x minimo fake',  t.asseXMinimo[t.NumeroFrame2]);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiungo asse x massimo fake',  t.asseXMassimo[t.NumeroFrame2]);
      dps.push( { x: 0, y: [0, 0], color: '#FF0000', lineColor: '#0000FF' } );
      dps.push( { x: 2, y: [0, 0], color: '#FF0000', lineColor: '#0000FF' } );
    } */
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Valori count:', dps);

    // chart.addTo('data', { type: 'error', yValueFormatString: '0.##\"%\"', axisYType: 'secondary',
    const ritorno = { type: 'error', yValueFormatString: '0.##\"%\"', axisYType: 'secondary', axisYIndex: 1, dataPoints: dps };
    //     axisYIndex: 1, dataPoints: dps });
    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno COUNT:', ritorno);
    // }

    return ritorno

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Valori count', chart);
    // }
  };

  aggiungeMinMax(t, chart, modalita) {
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Min / Max: modalità', chart, modalita);

    if (modalita.indexOf('Min') === -1 && modalita.indexOf('Max') === -1) {
      return;
    }

    const dps = [];

    // if (chart && chart !== null && chart.data !== null && chart.data[0] !== undefined) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, chart.data[0]);
      chart.forEach(element => {
        const dp = element.dataPoints;
        let min = null;
        let max = null;
        let slabel = '';
        let sx = 0;
        dp.forEach(element2 => {
          // q = element2.count;
          if (modalita.indexOf('Min') > -1) {
            min += element2.min;
          }
          if (modalita.indexOf('Max') > -1) {
            max += element2.max;
          }
          // if (slabel === '') {
            slabel = element2.label;
            sx = element2.x;
          // }
        });
        // if (min === -1 && max > -1) { min = max; };
        // if (max === -1 && min > -1) { max = min; };
        const qq = [min , max];

        dps.push( { label: slabel, x: sx, y: qq, color: '#666', lineColor: '#666' } );
      });
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Min / Max valori:', dps);

      // chart.addTo('data', { type: 'error', yValueFormatString: '0.##\"%\"', axisYType: 'primary',
      //   axisYIndex: 1, dataPoints: dps });
      const ritorno = { type: 'error', toolTipContent: null, yValueFormatString: '0.##\"%\"', axisYType: 'primary', axisYIndex: 1, dataPoints: dps };

      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno MINMAX', ritorno);
      // }

      return ritorno;
      // return ritorno;

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Valori min/max', chart);

    // }
  };

  disegnaDoubleGraph(t) {
    const nomeChart = 'chartContainersHistogram_' + t.frameAttivo + '_' + t.NumeroFrame2 + '_0';
    const divIstogramma = document.getElementById(nomeChart);
    if (divIstogramma && divIstogramma !== null) {
      const altezzaDIV = divIstogramma.getBoundingClientRect().height - 15;
      t.measureDaDisegnareHistogram[t.NumeroFrame2] = [''];
      ExternalUtilities.distruggiGrafici(t.chartsIstogrammi[t.NumeroFrame2]);
      t.chartsIstogrammi[t.NumeroFrame2] = new Array();
      let altGrafico = altezzaDIV;
      if (altGrafico < 75) { //  < 150) { MODIFICHE PER MAIL 22/06/2023 07:50
        altGrafico = 75; // = 150;
      }
      if (t.heightChart2) {
        let fattore = t.heightChart2;
        fattore = fattore.replace('X', '');
        altGrafico *= (+fattore);
      }
      // // logConsole('Istogrammi Height 1: ' + t.heightChart2);

      // logConsole('Altezza grafico 2', altGrafico);

      t.altezzaGraficiIstogrammi[t.NumeroFrame2] = altGrafico;
      this.altezzaGraficoBarMulti[t.NumeroFrame2] = altGrafico;

      const finale = new Array();
      /* this.righeDoubleGraph[0].Dati.forEach(element => {
        finale.push(new Array());
      }); */

      // const colori = ['#f2ee0c', '#7dff03', '#ffb837'];
      // let c = 0;

      // // logConsole('Finale arrivato: ', this.righeDoubleGraph);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Finale 1: ', this.righeDoubleGraph);

      let riga = 0;
      // logConsole('Righe istogrammi', this.righeDoubleGraph);

      this.righeDoubleGraph.forEach(element => {
        const inizio = element.Dati[riga];
        // // logConsole('Finale -: ', inizio, riga);
        riga++;
        const inizio2 = {
          name: inizio ? inizio.name : '',
          type: inizio ? inizio.type : '',
          dataPoints: new Array(),
          toolTipContent: 'chart: {chart}<br />y: {y}',
          indexLabel: '{showLabel}',
          indexLabelFontSize: 11
          // color: colori[c]
        }

        const campoVisua = inizio2.indexLabel.replace('{', '').replace('}', '');
        // // logConsole('Finale -: ', inizio2, campoVisua);
        // c++; if (c > 2) { c = 0; }
        finale.push(inizio2);
        element.Dati.forEach(element2 => {
          // // logConsole('Finale 1-5: ', inizio2);
          const label = inizio2.name;
          if (element2.type !== 'error') {
            // // logConsole('Finale 1-5-1: ', element2);
            element2.dataPoints.forEach(element3 => {
              const dp = JSON.parse(JSON.stringify(element3));
              const vY = JSON.stringify(dp.y);
              let valoreY;
              if (vY.indexOf(',') > -1) {
                valoreY = dp.y[0];
              } else {
                valoreY = dp.y;
              }

              let percentuale = dp.percF;
              // // logConsole('Finale 3: ', label);
              const dp2 = {
                y: valoreY,
                label: dp.label.indexOf(dp.chart) === -1 ? dp.chart + ' ' + dp.label : dp.label,
                color: dp.color,
                chart: dp.chart,
                avgF: dp.avgF,
                minF: dp.minF,
                maxF: dp.maxF,
                p25F: dp.p25F,
                p50F: dp.p50F,
                p75F: dp.p75F,
                srF: dp.srF,
                sumF: dp.sumF,
                CountF: dp.CountF,
                percF: percentuale,
                severityF: dp.severityF,
                YLabel: dp.YLabel,
                labelPerTooltip: dp.labelPerTooltip,
                chartF: dp.chartF,
                click: this.onClick2.bind(null, t),
                showLabel: dp[campoVisua] ? dp[campoVisua] : ''
              }

              finale[finale.length - 1].dataPoints.push(dp2);
            });
          }
        });
      });

      /* // logConsole('Finale 2: ', finale);
      const finale2 = new Array();
      let quanti = 0;
      finale.forEach(element => {
        finale2.push(new Array);
        quanti = element.dataPoints.length;
        element.dataPoints.forEach(element => {
          finale2[finale2.length - 1].push({});
        });          
      });
      // logConsole('Finale 22: ', quanti, finale2);
      for (let i = 0; i <= quanti; i++) {
        let k = 0;
        finale.forEach(element => {
          finale2[k][i] = element.dataPoints[i];
          k++;
        });
      } */
      // logConsole('Finale 222: ', finale);

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Finale 2: ', JSON.parse(JSON.stringify(finale)));

      let dimeX = 0;
      let dimeY = 0;
      if (document.getElementById(nomeChart) !== undefined && document.getElementById(nomeChart) !== null) {
        dimeX = document.getElementById(nomeChart).clientWidth;
        if (t.tipiApp[t.NumeroFrame2].length === 1) {
          dimeY = t.dimeYApp[t.NumeroFrame2];
        } else {
          dimeY = document.getElementById(nomeChart).clientHeight;
        }
      }

      let axisColor = '#c6c6c6';
      let coloreAsseY2;
      coloreAsseY2 = '#646464';
      let formatoValore = '000';

      const asseX = {
        fontWeight: 'normal',
        titleWrap: false,
        titleFontSize: 14,
        fontFamily: 'arial',
        // interval: 1,
        labelFontColor: '#646464',
        labelFontSize: 12,
        labelAngle: 0,
        lineColor: axisColor,
        gridColor: axisColor,
        valueFormatString: ' ',
        tickColor: '#646464',
        // title: t.Utils.PrendeNomeMisuraDaCodice(misure[1], t.measureData2),
      };
      
      const asseY = {
        title: '', // ExternalUtilities.PrendeNomeMisuraDaCodice(misure[2], t.measureData2),
        titleFontSize: 12,
        titleWrap: false,
        titleFontColor: '#555',
        fontWeight: 'normal',
        fontFamily: 'arial',
        labelFontSize: 10,
        lineColor: axisColor,
        gridColor: axisColor,
        labelFontColor: '#555',
        valueFormatString: formatoValore,
        tickColor: '#c6c6c6',
      }

      const asseY2 = {
        title: 'Count',
        titleFontSize: 12,
        titleWrap: false,
        titleFontColor: coloreAsseY2,
        fontWeight: 'normal',
        fontFamily: 'arial',
        labelFontSize: 10,
        lineColor: axisColor,
        gridColor: axisColor,
        labelFontColor: coloreAsseY2,
        valueFormatString: this.formatoValore2[t.NumeroFrame2],
        tickColor: coloreAsseY2,
      };

      const strutturaFinale = {
        title: {
          text: t.nomiFrames[t.frameAttivo2],
          fontSize: 12 , fontFamily: 'Arial', titleWrap: false, titleFontSize: 14 // , labelFontColor: '#F00'
        },
        zoomEnabled: true,
        // height: t.altezzaGrafici[t.NumeroFrame2],
        zoomType: 'x', // change it to "xy" to enable zooming on both axes
        // animationEnabled: true,
        legend: {
          horizontalAlign: "right", // "center" , "right"
          verticalAlign: "top",  // "top" , "bottom"
          fontSize: 15
        },
        axisX: asseX,
        axisY: asseY,
        axisY2: asseY2,
        // rangeChanged: this.syncHandler
        // dataPointWidth: 2, // t.dimeBarre[t.NumeroFrame2] / 1.2,
        data: finale,
      }
      
      // logConsole('Struttura Finale', strutturaFinale);

      // .chartsIstogrammi[t.NumeroFrame2].push(new t.CanvJS.Chart(nomeChart, strutturaFinale));

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Controllo dati dell\'istogramma dg' , 0, t.giaDisegnataStruttura[t.NumeroFrame2], t.chartsIstogrammi[t.NumeroFrame2].length - 1);

      if (!t.chartsIstogrammi[t.NumeroFrame2][0]) {
        t.chartsIstogrammi[t.NumeroFrame2].push(new t.CanvJS.Chart(nomeChart, strutturaFinale));
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Crezione dati dell\'istogramma dg' , 0, t.chartsIstogrammi[t.NumeroFrame2][0], strutturaFinale);
      } else {
        t.chartsIstogrammi[t.NumeroFrame2][0].options = strutturaFinale;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiorno dati dell\'istogramma dg' , 0, t.chartsIstogrammi[t.NumeroFrame2][0], strutturaFinale);
      }
    }
  }
}

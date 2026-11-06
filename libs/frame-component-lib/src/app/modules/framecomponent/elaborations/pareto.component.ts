import { logConsole } from '../console-log';
// import { SessionService } from './../../../../db/session.service';
// import * as CanvasJS from '../js/canvasjs.min';
// import * as CanvasJS from '../../../../assets/js/canvasjs.min.js';
import { Injectable } from '@angular/core';
// import Utils from '../Utilities.component';
// import { GestioneGrafici } from './GestioneGrafici.component';
// import { environment } from '../../../../environments/environment';
import { ExternalApiService } from './../services/externalapi.service';
import ExternalUtilities from '../ExternalUtilities.component';
import { DecimalPipe } from '@angular/common';
import { ReturnStatement } from '@angular/compiler';
import { environment } from '../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';
// import * as CanvasJS from './canvasjs.min.js';

// declare const CanvasJS: any;

@Injectable()
export class ParetoComponent {
  destroy$ = new FineRichieste();

  // lastCallPareto = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  // staGiaDisegnandoGraficiPareto = [ false, false, false, false, false, false, false, false, false, false, false,
  //                                   false, false, false, false, false, false, false, false, false, false, false];
  // lastCall = ['', '', '', '', '', '', '', '', '', '',  ''];
  // tipiApp = undefined;
  // arrayApp = undefined;
  // righeApp = undefined;
  // minXApp = undefined;
  // maxXApp = undefined;

  // passaggio = 0;
  vecchiaLarghezzaDiv = -1;
  vecchiaAltezzaDiv = -1;
  vecchiaMassimizzata = false;
  tipiParetoAppoggio = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  righeParetoAppoggio = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  conteggiAppoggio = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  arrayParetoAppoggio = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  asseXMassimo = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  asseXMinimo = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  ultimaActSet = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  larghezzaBarra = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);

  // vecchioJson = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // righePareto = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //   undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // tipiPareto = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //   undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // conteggi = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //   undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // arrayPareto = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //   undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // minXPareto = [99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999,
  //               99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999, 99999];
  // maxXPareto = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // charts = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  //   undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
    private _decimalPipe: DecimalPipe
  ) {
  }

  pulisceAppoggi(t, daDove) {
    // alert('Pulisco appoggi pareto ' + daDove);

    this.destroy$.ferma(t);

    this.vecchiaAltezzaDiv = -1;
    this.vecchiaLarghezzaDiv = -1;
    /* for (let i = 0; i < 500; i++) {
      const nome = "chartContainersPareto_" + t.frameAttivo2 + "_" + t.NumeroFrame2 + "_" + i;
      const divGrafico = document.getElementById(nome);
      if (divGrafico) {
        divGrafico.outerHTML = '';
        divGrafico.remove();
        // // logConsole('PULIZIA ISTOGRAMMI', nome);
      }
    }

    const divGraficoContenitoreInterno = document.getElementById('divPareto');
    if (divGraficoContenitoreInterno) {
      divGraficoContenitoreInterno.outerHTML = '';
      divGraficoContenitoreInterno.remove();
    } */
    // logConsole('Pulisco appoggi pareto', daDove);

    // return;
    

    t.lastCallPareto[t.NumeroFrame2] = '';
    t.vecchioJson[t.NumeroFrame2] = '';
    this.vecchiaLarghezzaDiv = -1;

    // t.chartsPareto[t.NumeroFrame2] = new Array();
    t.righePareto[t.NumeroFrame2] = new Array();
    t.arrayPareto[t.NumeroFrame2] = new Array();
    t.tipiPareto[t.NumeroFrame2] = new Array();
    t.conteggi[t.NumeroFrame2] = new Array();
    t.minXPareto[t.NumeroFrame2] = new Array();
    t.maxXPareto[t.NumeroFrame2] = new Array();
    this.tipiParetoAppoggio[t.NumeroFrame2] = undefined;
    this.righeParetoAppoggio[t.NumeroFrame2] = undefined;
    this.conteggiAppoggio[t.NumeroFrame2] = undefined;
    this.arrayParetoAppoggio[t.NumeroFrame2] = undefined;
    this.ultimaActSet[t.NumeroFrame2] = undefined;
    t.messaggioErrorePareto[t.NumeroFrame2] = '';
    // t.forzaRidisegnoPareto = true;
    // t.forzaRidisegno = false;

    /* if (t.chartsPareto[t.NumeroFrame2]) {
      t.chartsPareto[t.NumeroFrame2].forEach(element => {
        if (element && element.container && element.container !== null) {
          element.destroy();
        }
      });
      t.chartsPareto[t.NumeroFrame2] = new Array();
    } */
  }

  pulisceValoriDiAppoggio(t) {
    if (t.frameAttivo === undefined || t.NumeroFrame === undefined) {
      t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
      return;
    }

    t.measureDaDisegnarePareto = new Array();
    t.righePareto[t.NumeroFrame2] = new Array();
    t.arrayPareto[t.NumeroFrame2] = new Array();
    t.tipiPareto[t.NumeroFrame2] = new Array();
    t.conteggi[t.NumeroFrame2] = new Array();
    t.minXPareto[t.NumeroFrame2] = new Array();
    t.maxXPareto[t.NumeroFrame2] = new Array();
    this.tipiParetoAppoggio[t.NumeroFrame2] = undefined;
    this.righeParetoAppoggio[t.NumeroFrame2] = undefined;
    this.conteggiAppoggio[t.NumeroFrame2] = undefined;
    this.arrayParetoAppoggio[t.NumeroFrame2] = undefined;
    this.ultimaActSet[t.NumeroFrame2] = undefined;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Pulisco valori Pareto');
    // t.measureDaDisegnarePareto = new Array();
    // t.altezzaPareto = new Array();
    // t.Utils.altezzaPareto[t.frameAttivo][t.NumeroFrame] = new Array();

    // this.righePareto = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, new Array());
    // this.tipiPareto = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, new Array());
    // this.arrayPareto = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, new Array());
    // this.minXPareto = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 9999);
    // this.maxXPareto = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -9999);

    // this.righe[t.frameAttivo][t.NumeroFrame] = new Array();
    // this.array[t.frameAttivo][t.NumeroFrame] = new Array();
    // this.tipi[t.frameAttivo][t.NumeroFrame] = new Array();

    // this.tipiApp = t.Utils.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
    // this.arrayApp = t.Utils.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
    // this.righeApp = t.Utils.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
    // this.minXApp = t.Utils.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
    // this.maxXApp = t.Utils.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
  }

  /* azzeraValori(t) {
    this.tipiApp = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    this.arrayApp = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    this.righeApp = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    this.minXApp = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    this.maxXApp = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
    // this.passaggio = 1;
    t.measureDaDisegnarePareto = new Array();
    t.Utils.altezzaPareto = new Array();
    this.righe = new Array();
    this.tipi = new Array();
    this.minX = 9999;
    this.maxX = -9999;
  }*/

  createPareto(t, qualeGrafico, chartP, minX, maxX) {
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'linea pareto', qualeGrafico);

    const chart = chartP;
    const dps = [];
    let yValue, yTotal = 0, yPercent = 0;
    // let ret = true;

    if (chart && chart !== null && chart.data && chart.data !== null && chart.data[0]) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, chart.data[0].dataPoints);
      // if (chart.data[0] !== undefined) {
        /* const listaValori = chart.data[0].dataPoints;

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Pareto', listaValori);

        let max = 0;
        let min = 0;
        for (let i = 0; i < listaValori.length; i++) {
          yTotal += listaValori[i].y;
          if (listaValori[i].y > max) {
            max = chart.data[0].dataPoints[i].y + 1;
          }
          if (listaValori[i].y < min) {
            min = chart.data[0].dataPoints[i].y - 1;
          }
        }

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Max:', max);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Min:', min);

        const vMin = {
          y: min,
          x: minX,
          color: '#000000',
          YLabel: '800'
        };
        const appo = new Array();
        appo.push(vMin);
        listaValori.forEach(element => {
          appo.push(element);
        });
        const vMax = {
          y: min,
          x: maxX,
          color: '#ff0000',
          YLabel: '800'
        };
        appo.push(vMax);

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Appoggio valori', appo);

        for (let i = 0; i < appo.length; i++) {
          // yValue = appo[i].y;
          // yPercent += (yValue / yTotal * 100);
          // let y2 = (100 - yPercent);
          // y2 = Math.round(y2 * 100) / 100;

          yPercent = appo[i].runPerc;
          let yPerc1 = '0.00';
          if (yPercent) {
            yPerc1 = this._decimalPipe.transform(yPercent, "1.2-2")
          }
          const y1 = 100 - yPercent;
          // const y1 = 100 * +appo[i].count / +appo[i].total_count;
          let y2 = '0.00';
          if (y1) {
            y2 = this._decimalPipe.transform(y1, "1.2-2")
          }
          // y2 = y2.toString().trim();

          dps.push({
            label: appo[i].YLabel,
            x: appo[i].x,
            y: yPercent,
            color: '#444',
            lineColor: '#444',
            y1: yPerc1,
            y2: y2,
            count: appo[i].count
          });
        }

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: DPS', dps);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati pareto', chart.data[0].dataPoints);

      	const dps = [];
	      let yValue, yTotal = 0, yPercent = 0, max = 0, min = 9999;
  
        chart.data[0].dataPoints.forEach(element => {
          yTotal += element.y;

          if (+element.y > max) {
            max = +element.y + 1;
          }
          if (+element.y < min) {
            min = +element.y - 1;
          }          
        }); */
        /* for(var i = 0; i < chart.data[0].dataPoints.length; i++) {
          yTotal += chart.data[0].dataPoints[i].y;

          if (+chart.data[0].dataPoints[i].y > max) {
            max = +chart.data[0].dataPoints[i].y + 1;
          }
          if (+chart.data[0].dataPoints[i].y < min) {
            min = +chart.data[0].dataPoints[i].y - 1;
          }
        } */
  
        // logConsole('Pareto', chart.data[0].dataPoints, minX, maxX);
    
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Info pareto', yTotal, min, max);

        chart.data[0].dataPoints.forEach(element => {
          // yValue = chart.data[0].dataPoints[i].y;
          // yPercent += (yValue / yTotal * 100);
          yPercent = element.runPerc;

          let y2 = ''; // '0.00';
          /* if (yPercent) {
            y2 = this._decimalPipe.transform(yPercent, "1.2-2")
          } */
          // y2 = y2.toString().trim();

          dps.push({
            // label: chart.data[0].dataPoints[i].YLabel, 
            y: yPercent, 
            color: '#444', 
            lineColor: '#444',
            x: element.x,
            y1: element.y1,
            y2: y2,
            runPerc: element.runPerc,
            cRunPerc: element.cRunPerc,
            count: element.count
          });
        });
        /* for(var i = 0; i < chart.data[0].dataPoints.length; i++){
          // yValue = chart.data[0].dataPoints[i].y;
          // yPercent += (yValue / yTotal * 100);
          yPercent = chart.data[0].dataPoints[i].runPerc;

          let y2 = ''; // '0.00';
          /* if (yPercent) {
            y2 = this._decimalPipe.transform(yPercent, "1.2-2")
          } * /
          // y2 = y2.toString().trim();

          dps.push({
            // label: chart.data[0].dataPoints[i].YLabel, 
            y: yPercent, 
            color: '#444', 
            lineColor: '#444',
            x: chart.data[0].dataPoints[i].x,
            y1: chart.data[0].dataPoints[i].y1,
            y2: y2,
            runPerc: chart.data[0].dataPoints[i].runPerc,
            cRunPerc: chart.data[0].dataPoints[i].cRunPerc,
            count: chart.data[0].dataPoints[i].count
          });
        } */
        
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'DPS pareto', dps);

        this.createPareto2(t, qualeGrafico, chart, dps, minX, maxX,  yTotal);
    }
  }

  oldMinX;
  oldMaxX;
  oldY;

  createPareto2(t, qualeGrafico, chart, dps, minX, maxX, yTotal) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'chart', chart.data[1]);
      if (!chart.options.data) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per chart non valida', qualeGrafico, chart);
        t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
        return;
      }
      if (chart.options.data[1]) {
      // if (chart.data && chart.data[1]) {
        t.tipiPareto[t.NumeroFrame2] = this.tipiParetoAppoggio[t.NumeroFrame2];
        // logConsole('Pareto tipi pareto 2', t.tipiPareto[t.NumeroFrame2]);            
        t.righePareto[t.NumeroFrame2] = this.righeParetoAppoggio[t.NumeroFrame2];
        t.conteggi[t.NumeroFrame2] = this.conteggiAppoggio[t.NumeroFrame2];
        t.arrayPareto[t.NumeroFrame2] = this.arrayParetoAppoggio[t.NumeroFrame2];

        const element = this.tipiParetoAppoggio[t.NumeroFrame2][qualeGrafico];
        const total_count = this.conteggiAppoggio[t.NumeroFrame2][qualeGrafico];
        const misure = this.arrayParetoAppoggio[t.NumeroFrame2];
        let titolo = ExternalUtilities.PrendeNomeMisuraDaCodice(misure[0], t.measureData2, 'Pareto 1. Frame ' + t.NumeroFrame2) + ': ' +
          ExternalUtilities.PrendeNomeMisuraDaCodice(misure[1], t.measureData2, 'Pareto 2. Frame ' + t.NumeroFrame2)  + ' ' + element +
          ' Total Count ' + total_count; //  + ' SR ' + sr; + '% AVG ' + avg;

        titolo = t.NumeroFrame2 + '.' + t.frameAttivo2 + ' ' + t.nomiFrames[t.frameAttivo2] + ' - ' + titolo,

        chart.options.title.text = titolo;

        /* if (!chart.data[1].type) {
          chart.addTo('data', {type: 'line', yValueFormatString: '0.##\"%\"'});
          chart.data[1].set('axisYType', 'secondary', false);
        } else {
          chart.data[1].type = 'line';
          chart.data[1].yValueFormatString = '0.##\"%\"';
        } */

        chart.options.data[1].type = 'line';
        chart.options.data[1].yValueFormatString = '0.##\"%\"';
        chart.options.data[1].axisYType = 'secondary';

        // chart.axisX[1].set("minimum", minX);
        // chart.axisX[1].set("maximum", maxX);

        chart.options.data[1].dataPoints = dps;
        logConsole('Dati vecchi dps', dps);

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'aggiorno dati del pareto 2', qualeGrafico, chart.data[1]);
      } else {
          // chart.addTo('data', {type: 'line', yValueFormatString: '0.##\"%\"', dataPoints: dps, creazione: 'daCodice'});
          // chart.data[1].set('axisYType', 'secondary', false);

          chart.options.data.push({type: 'line', yValueFormatString: '0.##\"%\"', dataPoints: dps, creazione: 'daCodice'});
          chart.options.data[1].axisYType = 'secondary';

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'creo dati del pareto secondario', qualeGrafico, chart);
      }

      /* chart.data[1].set('type', 'line', false);
      chart.data[1].set('yValueFormatString', '0.##\"%\"', false);
      chart.data[1].type = 'line';
      chart.data[1].yValueFormatString = '0.##\"%\"'; 

      // logConsole('PARETO ' + qualeGrafico, chart, chart.data[1]); */

      // const tm = setTimeout(() => {
      //     clearTimeout(tm);
        // chart.axisY[0].set("maximum", maxX);
        if (chart && chart.axisY2 && chart.axisY2[0]) {
          chart.axisY2[0].set("minimum", 0);
          chart.axisY2[0].set("maximum", 100);
        }      
      // }, 10);

      // if (max !== this.oldY) {
      //   chart.axisY[0].set('maximum', max);
      // }

      // if (minX !== this.oldMinX || maxX !== this.oldMaxX) {
      //   chart.axisX[0].set('minimum', minX);
      //   chart.axisX[0].set('maximum', maxX);
      // }
      this.oldMaxX = maxX;
      this.oldMinX = minX;

      // if (max !== this.oldY) {
      // chart.axisY[0].set('maximum', max);
      // }
      chart.axisX[0].set("minimum", minX);
      chart.axisX[0].set("maximum", maxX);

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto chart finale', chart, minX, maxX);

      // if (minX !== this.oldMinX || maxX !== this.oldMaxX) {
      /* const tm = setTimeout(() => {
          clearTimeout(tm);
        chart.options.data[1].axisX.minimum = min;
        chart.options.data[1].axisX.maximum = max;
      }, 10); */
      // }
      this.oldMaxX = maxX;
      this.oldMinX = minX;

    //   }
    // } else {
    //   ret = false;
    // }

    // chart.render();
    // return chart;
  }

  disegnaPareto(t, soloEstrazioneDati, forzaRidisegno, daDove) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
      return;
    }

    if (t.MappaOGrafico2 !== 'PC') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Pareto', t.NumeroFrame2, t.MappaOGrafico2);

      t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
      return;
    }

    // alert('Disegno pareto da ' + daDove);

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'PC' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Esco 0 ', t.NumeroFrame2);
      }
      return;
    } */

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Richiama Pareto frame ', t.NumeroFrame2);
    // }

    /* if (this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] === true) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Sta già disegnando pareto ', t.NumeroFrame2);
      }
      this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = false;
        // t.comboDisabilitata = false;
      // t.caricamentoDatiInCorsoPareto = false;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Esce da Pareto. Già impegnato', t.NumeroFrame, t.frameVisibile, t.staGiaDisegnandoGraficiPareto);
      // const tm = setTimeout(() => {
          clearTimeout(tm);
      //   this.staGiaDisegnandoGraficiPareto = false;
      // }, 2000);
      return;
    } */

    // this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = true;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Inizio Pareto');
    // let tms = t.strutturaClick.tms;
    // if (!tms) {
    //   tms = t.strutturaClick.tms_min;
    // }
    // if (tms) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Quante misure per Pareto: ', t.Utils.quanteMisurePareto, t.Measure);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Timestamp di riferimento:', tms);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Measure);

    let q = 0;
    let misuraX = '';
    for (let i = 1; i <= t.Utils.quanteMisurePareto; i++) {
      if (t.Measure && t.Measure[i] && t.Measure[i] !== '') {
        q++;
        if (i === 1) {
          misuraX = t.Measure[i];
        }
      }
    }

    let ok = 'OK';
    if (misuraX !== '') {
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Lista Misure: ', t.Measure);
      // }
      // for (let i = 1; i <= t.Utils.quanteMisurePareto; i++) {
        const element = t.Measure[1];
        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura da considerare: ', element);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misura globale impostata: ', t.Utils.globalMeasure.MEASR_CODE);
        // }

        const misura = ExternalUtilities.ritornaMisura(t, element, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Misure 2');
        t.measureData2.forEach(element2 => {
          if (element2.CODE === misura) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Tipologia misura X globale', misuraX, +element2.TYPE);
            if (+element2.TYPE !== 1) {
              ok = '';
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Errore su Tipologia misura X globale');
            }
          }
        });
      
        /* if (element && (element.toUpperCase().indexOf('<GLOBAL MEASURE>') > -1 || (element.indexOf('global_measure') > -1 && element.indexOf('global_measure_') === -1))) {
          const misura = element.replace('<GLOBAL MEASURE>', t.Utils.globalMeasure.MEASR_CODE)
            .replace('global_measure', t.Utils.globalMeasure.MEASR_CODE)

          t.measureData2.forEach(element2 => {
            if (element2.CODE === misura) {
              // if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Tipologia misura X globale', misuraX, +element2.TYPE);
              // }
              if (+element2.TYPE !== 1) {
                ok = '';
                // if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Errore su Tipologia misura X globale');
                // }
              }
            }
          });
        } else {
          if (element && element !== null) {
              // MAIL 18/07/2023 16:30 -> possibilità di usare anche sulle mappe e volendo istogrami, pareto etc le <globaly checked measure>
              // logConsole('Misura considerare pareto', element);
              if (element.indexOf('<GLOBAL CHECKED MEASURE_') > -1 || element.indexOf('global_measure_') > -1) {
                let indice;
                if (element.indexOf('<GLOBAL CHECKED MEASURE_') > -1) {
                  const m = element.replace('<GLOBAL CHECKED MEASURE_', '').replace('>', '').substring(0, 1);
                  indice = +m;
                } else {
                  indice = +(element.replace('global_measure_', '').substring(0, 1));
                }        

                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Indicie: ', indice, ExternalUtilities.misureGlobali)
                // logConsole('Misure globali pareto', ExternalUtilities.misureGlobali, indice);
                if (indice && indice > 0) {
                  if (ExternalUtilities.misureGlobali && ExternalUtilities.misureGlobali[indice - 1] !== '') {
                    let misura;
                    if (!ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE']) {
                      misura = element.replace('<GLOBAL CHECKED MEASURE_' + indice + '>', ExternalUtilities.misureGlobali[indice - 1])
                        .replace('global_measure_' + indice, ExternalUtilities.misureGlobali[indice - 1])
                    } else {
                      misura = element.replace('<GLOBAL CHECKED MEASURE_' + indice + '>', ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE'])
                        .replace('global_measure_' + indice, ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE'])
                    }
                    // logConsole('Misura pareto', ExternalUtilities.misureGlobali[indice - 1], misura);

                    // if (t.debug2 === true) {
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Tipologia misura X globale checked', misuraX, ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE']);
                    // }

                    t.measureData2.forEach(element2 => {
                      if (element2.CODE ===  misura) {
                        logConsole('Misura pareto', misura, element2);
                        // if (t.debug2 === true) {
                          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Tipologia misura X', misuraX, +element2.TYPE);
                        // }
                        if (+element2.TYPE !== 1) {
                          ok = '';
                          // if (t.debug2 === true) {
                            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Errore su Tipologia misura X');
                          // }
                        }
                      }
                    });
    
                  }
                }
              } else {
                // MAIL 18/07/2023 16:30 -> possibilità di usare anche sulle mappe e volendo istogrami, pareto etc le <globaly checked measure>
                t.measureData2.forEach(element2 => {
                  if (element2.CODE ===  misuraX) {
                    // if (t.debug2 === true) {
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Tipologia misura X', misuraX, +element2.TYPE);
                    // }
                    if (+element2.TYPE !== 1) {
                      ok = '';
                      // if (t.debug2 === true) {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Errore su Tipologia misura X');
                      // }
                    }
                  }
                });
            }
          }
        } */
      // }
    }

    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Misure selezionate per Pareto:', q, t.Measure, misuraX, '->' + ok + '<-');
    // }

    // t.messaggioErrorePareto[t.NumeroFrame2] = '';
    if (soloEstrazioneDati === false) {
      if (ok === '' && t.chartsPareto && t.chartsPareto[t.NumeroFrame2]) {
        let ii = 0;
        t.chartsPareto[t.NumeroFrame2].forEach(element => {
          if (element && element.container && element.container !== null) {
            element.destroy();
            t.altezzaPareto[t.NumeroFrame2][ii] = 0;
            ii++;
            element = null;
          }
        });
        t.messaggioErrorePareto[t.NumeroFrame2] = 'X measure must be numeric for Pareto Chart in view ';
        // this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = false;
        t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;

        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Misura non valida per Pareto ', t.NumeroFrame);
        // }

        return;
      } else {
        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Array Charts vuoto');
        // }
      }
    }

    let sla = ExternalUtilities.tornaSla(t);
    if (sla !== undefined && sla !== '') {
      // sla = 'sla_name:' + sla;
    } else {
      sla = '';
    }
    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Pareto sla:', sla);
    // }
        
    if (!sla) {
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Esco per sla non valido');
      // }
        t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;

      return;
    }


    if (q > 0 && t.datiSlaDT2 !== undefined && sla !== '') {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Entro pareto con sla:', t.NumeroFrame, sla);

        let act_set = ExternalUtilities.ritornaStringPerActivitySet(t, t.Utils);
        act_set = act_set.replace('geo_act_set_name_1:', '');
        if (act_set === '' || !act_set || act_set === 'undefined') {
          // if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Esco per actset non valida');
          // }

          t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;

          return;
        }

        // if (act_set.indexOf('geo_act_set_name_1') === -1) {
        //   act_set = 'geo_act_set_name_1:' + act_set;
        // }

        if (soloEstrazioneDati === false) {
          if (act_set === '') {
            let ii = 0;
            t.chartsPareto[t.NumeroFrame2].forEach(element => {
              if (element && element.container && element.container !== null) {
                element.destroy();
                t.altezzaPareto[t.NumeroFrame2][ii] = 0;
                ii++;
                element = null;
              }
            });
            // t.Utils.charts[t.frameAttivo][t.NumeroFrame] = undefined;

            t.comboDisabilitata = false;

            // if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Act not set su Pareto ', t.NumeroFrame);
            // }

            t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
            
            return;
          }
        }

        t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = true;

        let tmsFilter = '';
        let sInizio = '';
        let sFine = '';
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Tipo filtro pareto', t.timeFilter2);
        if (t.timeFilter2 === 2 || t.timeFilter2 === 'Time Range') {
          if (t.Utils.tmsInizio && t.Utils.tmsFine) {
            // const c = t.Utils.rangeSelezionato.split(';');
            // if (c[0] !== null && c[1] !== null && c[0] !== 'null' && c[1] !== 'null') {
              sInizio = t.Utils.tmsInizio;
              sFine = t.Utils.tmsFine;

              sInizio =  t.datePipe.transform(sInizio, 'yyyy-MM-dd HH:mm:ss');
              sFine =  t.datePipe.transform(sFine, 'yyyy-MM-dd HH:mm:ss');

            // } else {
              tmsFilter = 'tms_min:' + sInizio + ';tms_max:' + sFine + ';';
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Esce per range non valido', c);
            //   this.staGiaDisegnandoGraficiPareto = false;
            //   t.caricamentoDatiInCorsoPareto = false;
            //   return;
            // }
          } else {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Esce per range non impostato');
            // this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = false;
            t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;

            // if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Esco da Pareto frame ', t.NumeroFrame, t.timeFilter2);
            // }

            return;
          }
        } else {
          sInizio = t.timeRangeDSFStart2;
          sFine = t.timeRangeDSFStop2;

          sInizio =  t.datePipe.transform(sInizio, 'yyyy-MM-dd HH:mm:ss');
          sFine =  t.datePipe.transform(sFine, 'yyyy-MM-dd HH:mm:ss');

          tmsFilter = 'tms_min:' + sInizio + ';tms_max:' + sFine + ';';
        }
        if (!sInizio || sInizio === '' || sInizio === null) {
          // if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Pareto esco per tms vuoti');
          // }
          t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
  
          return;
        }

        const arrayAppoggio = new Array();
        for (let con = 1; con <= t.Utils.quanteMisurePareto; con++) {
          const element = t.Measure[con];
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
          const misura = ExternalUtilities.ritornaMisura(t, element, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Pareto');
          if (misura) {
            arrayAppoggio.push(misura);
          } else {
            arrayAppoggio.push('---');
          }

          /* if (element && element !== '' && element !== null) {
            if (element.toUpperCase().indexOf('<GLOBAL MEASURE>') > -1 || (element.indexOf('global_measure') > -1 && element.indexOf('global_measure_') === -1)) {
              t.measureData2.forEach(element2 => {
                if (element2.CODE === t.Utils.globalMeasure.MEASR_CODE) {
                  const m = element2.CODE.replace('"', '').replace('"', '');
                  arrayAppoggio.push(element.replace('<GLOBAL MEASURE>', m).replace('global_measure', m));
                }
              });
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
                    // arrayAppoggio.push(cosa);
                    arrayAppoggio.push(element.replace('global_measure_' + indice, cosa).replace('<GLOBAL CHECKED MEASURE ' + indice + '>', cosa));
                  } else {
                    arrayAppoggio.push('---');
                  }
                } else {
                  arrayAppoggio.push('---');
                }
              } else {
                // MAIL 18/07/2023 16:30 -> possibilità di usare anche sulle mappe e volendo istogrami, pareto etc le <globaly checked measure>
                arrayAppoggio.push(element);
              }
            }
          } else {
            arrayAppoggio.push('---');
          } */
        }

        // let index = 0;
        // let params = 'viewparams=';
        // let qualeMisura = 0;

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.array[t.frameAttivo][t.NumeroFrame]);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Array appoggio', arrayAppoggio);

        const misure = new Array();
        arrayAppoggio.forEach(async eleArray => {
          if (eleArray !== '---' && eleArray !== undefined && eleArray !== null) {
            // let tipo = '';
            // let campo = '';

            t.measureData2.forEach(element2 => {
              // if (campo === '' && element2 && qualeMisura < t.Utils.quanteMisurePareto) {
                if (element2.CODE && element2.CODE.toLowerCase().trim() === eleArray.toLowerCase().trim()) {
                  // index++;
                  // campo = element2.CODE.toLowerCase().trim();
                  // tipo = 'measr_code_' + index;
                  // qualeMisura++;
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Aggiunge misura', tipo, campo);

                  // const altro = tipo + ':' + campo + ';';
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
              // }
            });
          }
        });

        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Misure ', misure);
        // }
        // params += (sla + ';');
        // params += (act_set + ';');
        // params += tmsFilter;

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Pareto frame ' + t.NumeroFrame + ':' , params);
        // tmsFilter = '';

        // const propName = '&propertyName=value_1,value_2,color_1,count,severity_1'; // &sortBy=value_1';

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.lastCall[t.frameAttivo][t.NumeroFrame]);
        const valoriDiBase = ';' + t.dashboardAttiva2 + ';' + t.NumeroFrame2 + ';' + t.frameAttivo2 + ';';

        if (misure.length < 4) {
          for (let i = misure.length; i <= 4 ; i++) {
            misure.push(null);
          }
        }

        const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

        if (sInizio !== null && sInizio !== 'null') {
          sInizio = '"' + sInizio + '"';
        }
        if (sFine !== null && sFine !== 'null') {
          sFine = '"' + sFine + '"';
        }

        // FILTER
        const filtri = ExternalUtilities.prendeFiltri(t, false, 'Pareto');
        const cm1 = filtri.cm1;
        const cm2 = filtri.cm2;
        const tf1 = filtri.tf1;
        const tf2 = filtri.tf2;
        // FILTER

        let params;
        /* if (t.Utils.tmsInizio && t.Utils.tmsFine && tmsFilter !== '') {
          params = '{ ' +
            '"cntx_id": "' + t.sessionID2 + '",' +
            '"v_act_set_name_list": "' + t.act_set + '", ' +
            '"v_geo_sla_name": "' + sla + '", ' +
            '"v_tms_min": ' + sInizio + ',' +
            '"v_tms_max": ' + sFine + ', ' +
            '"v_aggr_type": "group", ' +
            '"v_measr_code_1": ' + misure[0] + ', ' +
            '"v_measr_code_2": ' + misure[1] + ', ' +
            '"v_measr_code_3": ' + misure[2] + ', ' +
            '"v_measr_code_4": ' + misure[3] + ', ' +
            '"v_bbox": "' + geoFilter + '" ' +
          ' }';
        } else { */
        params = '{ ' +
            '"cntx_id": "' + t.sessionID2 + '",' +
            // '"v_caller_tag": "' + t.chiSonoPareto[t.NumeroFrame2] + '",' +
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
        // }
        // logConsole('CHIAMTA PARETO', params);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);

        if (soloEstrazioneDati === false) {
          // TOLTO 12/05/2025 perché non aggiornava il grafico quando si ridimensionava il div
          /* if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
            t.chartsPareto[t.NumeroFrame2] = new Array();
          }
          t.righePareto[t.NumeroFrame2] = new Array();
          t.arrayPareto[t.NumeroFrame2] = new Array();
          t.tipiPareto[t.NumeroFrame2] = new Array();
          logConsole('Pareto tipi pareto 3', t.tipiPareto[t.NumeroFrame2]);            
          t.conteggi[t.NumeroFrame2] = new Array(); */
          // TOLTO 12/05/2025 perché non aggiornava il grafico quando si ridimensionava il div
        }

        /* for (let i = 0; i <= 2; i++) {
          t.chartsPareto.push(null);
          t.altezzaPareto.push(0);
          this.righePareto.push(null);
          this.arrayPareto.push(null);
          this.tipiPareto.push(null);
          this.conteggi.push(null);
        } */

        const actualCall = 'PARETO;' + params + ';' + arrayAppoggio + ";" + valoriDiBase + ';' + t.timeFilter2 + ';' + t.timeFilter2;
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: actual call', actualCall, t.massimizzata, this.vecchiaMassimizzata, forzaRidisegno);

      /* if (t.massimizzata !== this.vecchiaMassimizzata || forzaRidisegno === true) {
        const tm = setTimeout(() => {
          clearTimeout(tm);
          const altezzaDIV = t.divPareto.nativeElement.offsetHeight;

          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Ridisegno pareto per adattarlo alla finestra', t.NumeroFrame, altezzaDIV);
          }

          this.vecchiaMassimizzata = t.massimizzata;
          if (t.vecchioJson[t.NumeroFrame2]) {
            this.elaboraRigheJSON(t, t.vecchioJson[t.NumeroFrame2]);

            t.comboDisabilitata = false;
            // this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = false;
            t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
          }
        }, 1000);
      } else { */
        // if (t.debug2 === true) {
          // logConsole('Pareto: actual call 2', soloEstrazioneDati,
          //   t.lastCallPareto[t.NumeroFrame2] !== actualCall);
        // }
        /* logConsole('Pareto last 1', t.lastCallPareto[t.NumeroFrame2]);
        logConsole('Pareto last 2', actualCall);
        logConsole('Pareto last 3', t.lastCallPareto[t.NumeroFrame2] !== actualCall); */

        /* logConsole('Pareto', t.NumeroFrame2, 
          t.lastCallPareto[t.NumeroFrame2] === actualCall, 
          '\n>' + t.lastCallPareto[t.NumeroFrame2] + '<', 
          '\n>' + actualCall + '<', 
          soloEstrazioneDati); */

        if (soloEstrazioneDati === true || t.lastCallPareto[t.NumeroFrame2] !== actualCall) {
          t.lastCallPareto[t.NumeroFrame2] = actualCall;

          // logConsole('Pareto last 4', t.lastCallPareto[t.NumeroFrame2]);
          // t.Utils.rinfrescaGraficoPareto = false;
          // logConsole('Pareto diverso', t.NumeroFrame2);

          const larghezzaDIV = t.divPareto.nativeElement.offsetWidth - 20;
          const altezzaDIV = t.divPareto.nativeElement.offsetHeight - 20;
          this.vecchiaLarghezzaDiv = larghezzaDIV;
          this.vecchiaAltezzaDiv = altezzaDIV;

          if (soloEstrazioneDati === false) {
            this.pulisceValoriDiAppoggio(t);
          }

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Richiamo url Pareto frame', t.NumeroFrame, actualCall);

          const app = JSON.parse(JSON.stringify(arrayAppoggio));

          // const csv = '';
          // const layer = 'Geo_ANTS:l_geo_measr_group';
          // const csv = await t.downloadFile.downloadCSV(layer, '', '', '', '',
          // propName, 'application/json', params, 'EXECUTE', false, 'Pareto');

          // this.stampaTempoImpiegato('Inizio lettura');
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: geo_measure_sample__sel', t.NumeroFrame, t.frameAttivo, new Date().getTime());
          /* if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
            t.measureDaDisegnarePareto = new Array();
          } */
          // t.altezzaPareto = new Array();

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Esecuzione Pareto', t.NumeroFrame, params);

          t.errorePareto[t.NumeroFrame2] = '';
          // t.messaggioErrorePareto = '';
            
          t.chiSonoPareto[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
          params += '"v_caller_tag": "' + t.chiSonoPareto[t.NumeroFrame2] + '" }';

          // SERVE SOLO PER DEBUG
          /* params = JSON.stringify({
            cntx_id: t.sessionID2,
            v_act_set_name_list: "[AGN] SDTU000269.01",
            v_aggr_type: "group",
            v_bbox: "(ALL)",
            v_filter_measr_code_1: "null",
            v_filter_measr_code_2: "null",
            v_filter_measr_value_1: "null",
            v_filter_measr_value_2: "null",
            v_geo_sla_name: "Template",
            v_measr_code_1: "act_coverage_rsrp",
            v_measr_code_2: "cell_xcgi_pcell",
            v_measr_code_3: "null",
            v_measr_code_4: "null",
            v_tms_max: "2023-12-14 10:26:18",
            v_tms_min: "2023-12-14 09:56:18",
            v_caller_tag: t.chiSonoPareto[t.NumeroFrame2]
          }); */
          // SERVE SOLO PER DEBUG

          t.lastCallPareto2[t.NumeroFrame2] = JSON.parse(params);
          this.apiService.chiamataPost(t.Utils, 'geo_measure_sample_cross__sel', JSON.parse(params))
          // .map(response => response)
          .pipe(takeUntil(this.destroy$.per(t)))
          .subscribe((data2: any) => {
            // const data2 = JSON.parse(data);
            ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

            if (!t.controllaRitornoChiamata(t, data2, 'Sample Cross Pareto')) {
              t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
              // logConsole('Pareto esco');
              return;
            }

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati pareto', data2, data2.DataTable, data2.DataTable.length);

            if (data2 && data2.DataTable && data2.DataTable.length > 0) {
              t.messaggioErrorePareto[t.NumeroFrame2] = '';

              // if (t.act_set !== this.ultimaActSet[t.NumeroFrame2]) {
              //   this.ultimaActSet[t.NumeroFrame2] = t.act_set;
                t.giaDisegnataStruttura[t.NumeroFrame2] = false;
                if (t.chartsPareto[t.NumeroFrame2]) {
                  t.chartsPareto[t.NumeroFrame2].forEach(element => {
                    if (element && element.container && element.container !== null) {
                      element.destroy();
                    }
                  });
                  t.chartsPareto[t.NumeroFrame2] = new Array();
                }
              // }
          
              if (data2.v_step_1) {
                this.larghezzaBarra[t.NumeroFrame2] = data2.v_bar_num_1;
              } else {
                this.larghezzaBarra[t.NumeroFrame2] = 1;
              }

              if (data2.v_req_tms) {
                const ritorno = new Date(data2.v_req_tms);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno: ', ritorno);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia: ', t.timeStampChiamataTCRUN);
                if (t.timeStampChiamataPareto && ritorno.getTime() < t.timeStampChiamataPareto.getTime()) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: esco per query vecchia', ritorno, t.timeStampChiamataPareto);

                  t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
                  return;
                } else {
                  t.timeStampChiamataPareto = ritorno;
                }
              }

              if (data2.value_1_max) {
                // MAIL 2/06/2023 21:33
                this.asseXMinimo[t.NumeroFrame2] = data2.value_1_min;
                this.asseXMassimo[t.NumeroFrame2] = data2.value_1_max;
              }

              t.arrayPareto[t.NumeroFrame2] = JSON.parse(JSON.stringify(app));

              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Esecuzione Pareto Effettuata', t.NumeroFrame, data2);

              if (data2.message && data2.message !== '') {
                // ExternalUtilities.messaggioDiErrore('null', data.message);
                t.errorePareto[t.NumeroFrame2] = ' ERROR: ' + data2.message;

                t.comboDisabilitata = false;

                // this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = false;
                t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
              } else {
                t.minXPareto[t.NumeroFrame2] = data2.value_1_min;
                t.maxXPareto[t.NumeroFrame2] = data2.value_1_max;
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.arrayPareto);

                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Ritorno pareto: ', data);
                // const errori = t.Utils.contaErrori(csv);
                // if (errori === 0) {
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data);
                  // const righeJson = data; //  JSON.parse(csv.toString());
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: JSON pareto', t.NumeroFrame, righeJson.features);
                  // const nomeChart2 = 'chartContainersPareto';

                if (soloEstrazioneDati === true) {
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Salvo i valori pareto', t.NumeroFrame);
                  const nomeFile = 'GeoAnts_' + act_set + '_' + t.frameName + '_Pareto.csv';
                  // ExternalUtilities.salvaCSV(data.DataTable, nomeFile);

                  t.exportGridComponent.creaGriglia(t, data2, 'Pareto Data');

                  // return;
                }

                t.vecchioJson[t.NumeroFrame2] = data2;
                this.elaboraRigheJSON(t, data2);

                if (soloEstrazioneDati === true) {
                  const tm = setTimeout(() => {
                    clearTimeout(tm);

                    t.comboDisabilitata = false;
                  }, 1000);
                }

                // this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = false;
                t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
                // ParetoComponent.lastCallPareto[t.NumeroFrame] = '';

                t.measureDaDisegnarePareto = t.tipiPareto[t.NumeroFrame2];
                // const appoChart = new Array();
                // let n = 0;
                t.altezzaPareto[t.NumeroFrame2].forEach(element => {
                  element = 0;
                  /* if (t.chartsPareto[t.NumeroFrame2][n]) {
                    appoChart.push(t.chartsPareto[t.NumeroFrame2][n]);
                  }
                  n++; */
                });
                /* t.chartsPareto[t.NumeroFrame2].forEach(element => {
                  if (element && element.container && element.container !== null) {
                    element.destroy();
                  }
                });
                t.chartsPareto[t.NumeroFrame2] = appoChart; */
                if (t.tipiPareto[t.NumeroFrame2]) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Quanti tipi pareto', t.tipiPareto[t.NumeroFrame2].length - 1);
                }
                if (t.chartsPareto[t.NumeroFrame2]) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Quante chart pareto', t.chartsPareto[t.NumeroFrame2].length - 1);            
                }
              }
            } else {
              // t.errorePareto[t.NumeroFrame2] = 'No data to be displayed';
              t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
              t.messaggioErrorePareto[t.NumeroFrame2] = 'No data to be displayed';
            }
          }, error => {
            t.comboDisabilitata = false;
            // this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = false;
            t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;

            if (error._body) {
              try {
                const e = JSON.parse(error._body);
                t.errorePareto[t.NumeroFrame2] = ' ERROR: ' + JSON.stringify(e.message);
              } catch (e) {
                t.errorePareto[t.NumeroFrame2] = error._body;
              }
            } else {
              t.errorePareto[t.NumeroFrame2] = ' ERROR: ' + JSON.stringify(error);
            }

            t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
            return;
          });
        } else {
          const larghezzaDIV = t.divPareto.nativeElement.offsetWidth - 20;
          const altezzaDIV = t.divPareto.nativeElement.offsetHeight - 20;
          if (larghezzaDIV === this.vecchiaLarghezzaDiv && altezzaDIV === this.vecchiaAltezzaDiv) {
            t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
            // logConsole('Esco da pareto per larghezza div uguale', larghezzaDIV, this.vecchiaLarghezzaDiv);

            return;            
          }
          this.vecchiaLarghezzaDiv = larghezzaDIV;
          this.vecchiaAltezzaDiv = altezzaDIV;
          // logConsole('Pareto larghezza div', larghezzaDIV);

          // if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Forza ridisegno', t.NumeroFrame2, t.frameAttivo2, t.forzaRidisegnoPareto);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Vecchie dimensioni', t.Utils.dimensioniFramesModif[t.frameAttivo2][t.NumeroFrame2]);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Nuove dimensioni', t.Utils.dimensioniFrames[t.frameAttivo2][t.NumeroFrame2]);
          // }
          // if (t.forzaRidisegnoPareto) {
          //   t.forzaRidisegnoPareto = false;
            // if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Disegno senza richiamare url Pareto frame', t.NumeroFrame2, t.frameAttivo2);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Vecchie dimensioni', t.Utils.dimensioniFramesModif[t.frameAttivo2][t.NumeroFrame2]);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Nuove dimensioni', t.Utils.dimensioniFrames[t.frameAttivo2][t.NumeroFrame2]);
            // }

            //if (t.Utils.dimensioniFramesModif[t.frameAttivo2][t.NumeroFrame2] !== t.Utils.dimensioniFrames[t.frameAttivo2][t.NumeroFrame2]) {
            //   t.Utils.dimensioniFramesModif[t.frameAttivo2][t.NumeroFrame2] = t.Utils.dimensioniFrames[t.frameAttivo2][t.NumeroFrame2];
            //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Ridisegno per dimensioni frame diverse', t.NumeroFrame2);
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'RIDISEGNO PARETO');
              t.tipiPareto[t.NumeroFrame2] = this.tipiParetoAppoggio[t.NumeroFrame2];
              // logConsole('Pareto tipi pareto 1', t.tipiPareto[t.NumeroFrame2]);            
              t.righePareto[t.NumeroFrame2] = this.righeParetoAppoggio[t.NumeroFrame2];
              t.conteggi[t.NumeroFrame2] = this.conteggiAppoggio[t.NumeroFrame2];
              t.arrayPareto[t.NumeroFrame2] = this.arrayParetoAppoggio[t.NumeroFrame2];

              // logConsole('Pareto uguale al precedente', t.righePareto[t.NumeroFrame2]);

              /* t.altezzaPareto[t.NumeroFrame2][0] = 100;

              for (let i = 0; i <= t.measureDaDisegnarePareto.length - 1; i++) {
                const element2 = t.chartsPareto[t.NumeroFrame2][i];
                if (element2 && element2.canvas && element2.canvas !== null) {
                  element2.height = 100;
                  element2.render();
      
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Renderizzo pareto', i, element2.canvas);
                  this.createPareto(i, element2, t.minXPareto[t.NumeroFrame2], t.maxXPareto[t.NumeroFrame2]);
                }
                // mddp.push(-1);
              }; */

              // t.chartsPareto[t.NumeroFrame2] = new Array();

              // t.giaDisegnataStruttura[t.NumeroFrame2] = false;
              // logConsole('Disegno Pareto per larghezza div');

              // this.disegnaParetoAVideo(t, 'Ridisegna Pareto');

              let altGrafico = 150;
    
              const quantiGrafici = t.chartsPareto[t.NumeroFrame2].length;
            
              if (quantiGrafici > 0) {
                altGrafico = altezzaDIV / quantiGrafici;
              }
              if (altGrafico < 150) {
                altGrafico = 150;
              }

              let i = 0;
              t.chartsPareto[t.NumeroFrame2].forEach(element2 => {
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Controllo render' , i, element2);
                if (element2 !== undefined && element2 !== '' && element2 !== null &&
                  element2.canvas && element2.canvas !== null) {
                  element2.options.height = altGrafico;
                  // logConsole('Chart', i, element2);
                  
                  t.altezzaPareto[t.NumeroFrame2][i] = altGrafico;
                  i++;
      
                  element2.render();

                  // this.createPareto(t, i, element2, t.minXPareto[t.NumeroFrame2], t.maxXPareto[t.NumeroFrame2]);
                }
              });

              // Già caricato
              /* if (t.Utils.dimensioniFramesModif[t.NumeroFrame] !== t.Utils.dimensioniFrames[t.NumeroFrame]) {
                t.Utils.dimensioniFramesModif[t.NumeroFrame] = t.Utils.dimensioniFrames[t.NumeroFrame];
              } */
              // this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = false;
            // }
          // }

          t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
        }
      // }
    } else {
      t.comboDisabilitata = false;
      // this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = false;
      t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
    }
    // }
  }
  // }

  elaboraRigheJSON(t, data) {
    // t.quantiGraficiPACiSono = 0;

    /* const puntini = {
      'name': 'Pareto',
      'dataPoints': righeJson,
      'type': 'column',
      // 'click': t.onClick,
    }; */

    // t.Utils.altezzaPareto[t.frameAttivo][t.NumeroFrame] = new Array();
    /* if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'pulisco charts pareto 4');
      t.chartsPareto[t.NumeroFrame2] = ExternalUtilities.creaVettore(t.Utils.quanteMisurePareto, undefined);
    } */

    // t.Utils.contatoreGraficiPareto[t.frameAttivo][t.NumeroFrame] = 0;
    // t.Utils.quantoContatoreGraficiPareto = 0;
    // index = 0;

    // let minY = 999;
    // let maxY = -999;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.checkSeverity);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righeJson);

    let totY = 0;
    let sr = 0;
    let numRighe = 0;

    let total_count = '';
    let sr2 = '';
    let avg = '';

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data);

    if (data.DataTable && data.DataTable !== null) {
      data.DataTable.forEach(ele => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, ele);

        total_count = ele.total_count; if (total_count && total_count !== null) { total_count = total_count.toString().trim() };
        sr2 = ele.sr; if (sr2 && sr2 !== null) { sr2 = sr2.toString().trim() };
        avg = ele.avg; if (avg && avg !== null) { avg = avg.toString().trim() };

        // const element5 = JSON.parse(JSON.stringify(ele.properties));
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
        let valoreChartLabel = ele.value_2;
        if (!valoreChartLabel) { valoreChartLabel = ' '; }

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tipoGrafico);
        if (valoreChartLabel === undefined) {
          valoreChartLabel = 'UNDEFINED';
        }
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, valoreChartLabel);
        // const passaggio2 = '';
        // if (this.passaggio === 2) {
        //   passaggio2 = 'Time Range';
        // }
        if (valoreChartLabel !== null && valoreChartLabel !== '') {
          let index3 = 0;
          let qualeIndex = -1;
          if (t.tipiPareto && t.tipiPareto[t.NumeroFrame2]) {
            t.tipiPareto[t.NumeroFrame2].forEach(element2 => {
              if (qualeIndex === -1 && valoreChartLabel === element2) {
                qualeIndex = index3;
              }
              index3++;
            });
          }
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, qualeIndex);
          if (qualeIndex === -1) {
            if (!t.righePareto[t.NumeroFrame2]) {
              t.righePareto[t.NumeroFrame2] = new Array();
            }
            if (!t.tipiPareto[t.NumeroFrame2]) {
              t.tipiPareto[t.NumeroFrame2] = new Array();
            }
            if (!t.conteggi[t.NumeroFrame2]) {
              t.conteggi[t.NumeroFrame2] = new Array();
            }
            t.righePareto[t.NumeroFrame2].push('');
            t.tipiPareto[t.NumeroFrame2].push(valoreChartLabel);
            t.conteggi[t.NumeroFrame2].push(total_count + ';' + sr2 + ';' + avg);
            qualeIndex = t.tipiPareto[t.NumeroFrame2].length - 1;
            // righe[qualeIndex].push(new Array());
            
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Tipo Pareto aggiunto', valoreChartLabel, t.tipiPareto[t.NumeroFrame2]);
          }

          const valoreXLabel = ele.value_1;
          const valoreY_ValApp = ele.count;
          const valoreYColor = ele.color_1;
          let valoreYLabel = ele.value_2;
          if (t.checkSeverity) {
          //   valoreYLabel = ele.severity_1;
          }
          // const valoreD = element.count;
          // const valoreDC = element.count;
          // const valoreL = element.value_3;

          const runPerc = ele.running_perc;
          const cRunPerc = 100 - ele.running_perc;

          let valoreY_Val;
          if (valoreY_ValApp !== null) {
            if (!t.checkSeverity) {
              valoreY_Val = +valoreY_ValApp;
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, valoreY_Val);
            } else {
              valoreY_Val = valoreY_ValApp;
            }
          } else {
            valoreY_Val = null;
          }
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, valoreY_Val);

          if (valoreXLabel !== undefined && valoreY_Val !== undefined && valoreYColor !== undefined &&
            valoreXLabel !== null && valoreY_Val !== null && valoreYColor !== null &&
            valoreXLabel !== '' && valoreYColor !== '' &&
            valoreXLabel !== 'NoValue' && valoreXLabel !== 'no value' && valoreYColor !== 'NoValue' && 
            valoreY_Val.toString() !== 'NaN') {

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, valoreXLabel);
              const nuovaRiga = '{ "y": ' + valoreY_Val + ', "y1": ' + valoreY_Val + ', "y2": "", ' +
                '"x": ' + valoreXLabel + ', "runPerc": ' + runPerc + ', "cRunPerc": ' + cRunPerc + ', "color": "' + valoreYColor +
                '", "YLabel": "' + valoreYLabel + '", "severity": "' + ele.severity_1 + '", ' +
                '"count": ' + ele.count + ', "total_count": ' + ele.total_count + '},';
              // logConsole('RIGHE PARETO', qualeIndex, nuovaRiga);
              if (nuovaRiga && nuovaRiga.indexOf('NaN') === - 1) {
                t.righePareto[t.NumeroFrame2][qualeIndex] += nuovaRiga;

                /* if (+valoreXLabel > this.maxXPareto) {
                  this.maxXPareto = +valoreXLabel;
                }
                if (+valoreXLabel < this.minXPareto) {
                  this.minXPareto = +valoreXLabel;
                } */
                totY += valoreY_Val;
                if (valoreY_Val > 3) {
                  sr++;
                }
                numRighe++;
              } else {
                // logConsole('Nuova riga Pareto nulla: ValoreY', valoreY_Val);
                // logConsole('Nuova riga Pareto nulla: ValoreXLabel', valoreXLabel);
                // logConsole('Nuova riga Pareto nulla: runPerc', runPerc);
                // logConsole('Nuova riga Pareto nulla: cRunPerc', cRunPerc);
                // logConsole('Nuova riga Pareto nulla: valoreYColor', valoreYColor);
                // logConsole('Nuova riga Pareto nulla: valoreYLabel', valoreYLabel);
                // logConsole('Nuova riga Pareto nulla: ele', ele);
                // logConsole('Nuova riga Pareto nulla: severity_1', ele.severity_1);
                // logConsole('Nuova riga Pareto nulla: count', ele.count);
                // logConsole('Nuova riga Pareto nulla: total_count', ele.total_count);
              }
          // } else {
          //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Scartata riga della misura ' + tipoGrafico);
          }
        }
      });
    }

    if (numRighe > 0) {
      // t.quantiGraficiPACiSono = 1;
    }
    // logConsole('Pareto: Misure da disegnare', t.NumeroFrame2, t.measureDaDisegnarePareto);
    // logConsole('Pareto: Tipi da disegnare', t.NumeroFrame2, t.tipiPareto[t.NumeroFrame2]);
    // logConsole('Pareto: Righe da disegnare', t.NumeroFrame2, t.righePareto[t.NumeroFrame2]);
    
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Misure da disegnare', t.NumeroFrame, t.measureDaDisegnarePareto);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Tipi Pareto', t.NumeroFrame2, t.tipiPareto[t.NumeroFrame2]);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Righe Pareto', t.NumeroFrame2, t.righePareto[t.NumeroFrame2]);

      // t.caricamentoDatiInCorsoPareto = false;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Frame ' + t.NumeroFrame + ', tipi: ', tipi);

      // if (!tipi || tipi.length === 0) {
      //   ExternalUtilities.messaggioDiErrore(t, 'No valid data to show pareto: no chart types');
      // }

      // this.tipiApp[t.frameAttivo][t.NumeroFrame] = JSON.parse(JSON.stringify(this.tipi[t.frameAttivo]));
      // this.arrayApp[t.frameAttivo][t.NumeroFrame] = JSON.parse(JSON.stringify(this.array[t.frameAttivo]));
      // this.righeApp[t.frameAttivo][t.NumeroFrame] = JSON.parse(JSON.stringify(this.righe[t.frameAttivo]));
      // this.minXApp[t.frameAttivo][t.NumeroFrame] = JSON.parse(JSON.stringify(this.minX[t.frameAttivo][t.NumeroFrame]));
      // this.maxXApp[t.frameAttivo][t.NumeroFrame] = JSON.parse(JSON.stringify(this.maxX[t.frameAttivo][t.NumeroFrame]));
      // this.totYG[t.NumeroFrame] = JSON.parse(JSON.stringify(totY));
      // this.srG[t.NumeroFrame] = JSON.parse(JSON.stringify(sr));
      // this.numRigheG[t.NumeroFrame] = JSON.parse(JSON.stringify(numRighe));

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.tipiPareto);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.arrayPareto);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.righePareto);

      this.tipiParetoAppoggio[t.NumeroFrame2] = t.tipiPareto[t.NumeroFrame2];
      this.righeParetoAppoggio[t.NumeroFrame2] = t.righePareto[t.NumeroFrame2];
      this.conteggiAppoggio[t.NumeroFrame2] = t.conteggi[t.NumeroFrame2];
      this.arrayParetoAppoggio[t.NumeroFrame2] = t.arrayPareto[t.NumeroFrame2];

      // this.passaggio++;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.passaggio);
      // if (this.passaggio === 2) {
      //   this.disegnaPareto(this);
      // } else {
        // t.comboDisabilitata = false;
        // this.staGiaDisegnandoGraficiPareto = false;
        // t.caricamentoDatiInCorsoPareto = false;


      this.disegnaParetoAVideo(t, 'Elabora righe json');
      // }
    // } else {
    //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Esco per errore di pareto', t.NumeroFrame, errori);
    //   t.comboDisabilitata = false;
    //   this.staGiaDisegnandoGraficiPareto = false;
    //   t.caricamentoDatiInCorsoPareto = false;
    // }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: CSV:', csv);

    // return;
  }

  disegnaParetoAVideo(t, daDove) {
    // alert('Disegna pareto da ' + daDove);

    if (t.tipiPareto[t.NumeroFrame2] === undefined || t.righePareto[t.NumeroFrame2] === undefined) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da disegna pareto', t.tipiPareto[t.NumeroFrame2], t.righePareto[t.NumeroFrame2]);

      t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
      return;
    }

    // logConsole('Disegno pareto da', daDove);

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Quanti tipi Pareto ', t.tipiPareto[t.NumeroFrame2]);

    let quantiGrafici = 0;
    let index2 = 0;
    t.tipiPareto[t.NumeroFrame2].forEach(element => {
        /* if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Tipo ', index2, element, this.righePareto[index2]);
        } */
        // if (element !== '') {
        if (element !== '' &&
            element !== undefined  &&
            element !== null &&
            t.righePareto[t.NumeroFrame2][index2] && t.righePareto[t.NumeroFrame2][index2] !== null) {
            quantiGrafici++;
        }
        index2++;
        // t.Utils.altezzaPareto[t.frameAttivo][t.NumeroFrame].push(150);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: misura: '  + element + ' - index:' + index, righe[index]);
      // }
      // index2++;
    });

    if (quantiGrafici > 100) {
      t.errorePareto[t.NumeroFrame2] = 'Too many charts (> 100)!';

      t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
      return;
    } else {
      t.errorePareto[t.NumeroFrame2] = '';
    }

    if (t.divPareto) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Altezza grafico Pareto', t.divPareto.nativeElement.offsetHeight);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Quanti grafici Pareto', quantiGrafici);
    }

    let altGrafico = 150;
    
    if (quantiGrafici > 0) {
      const altezzaDIV = t.divPareto.nativeElement.offsetHeight;
      altGrafico = altezzaDIV / quantiGrafici;
    }
    if (altGrafico < 150) {
      altGrafico = 150;
    }
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Altezza Grafici Pareto', quantiGrafici, altGrafico);

    // logConsole('Pareto 1', quantiGrafici);

    index2 = 0;
    t.tipiPareto[t.NumeroFrame2].forEach(element => {
        /* if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Tipo ', index2, element, this.righePareto[index2]);
        } */
        // if (element !== '') {
        if (element !== '' &&
            element !== undefined  &&
            element !== null &&
            t.tipiPareto[t.NumeroFrame2][index2] && t.righePareto[t.NumeroFrame2][index2] !== null) {
          /* if (!t.measureDaDisegnarePareto[index2]) {
            t.measureDaDisegnarePareto.push('');
          } */
          t.altezzaPareto[t.NumeroFrame2][index2] = altGrafico;
        } else {
          t.altezzaPareto[t.NumeroFrame2][index2] = 0;
          ExternalUtilities.distruggiGrafici([t.chartsPareto[t.NumeroFrame2][index2]]);
          t.chartsPareto[t.NumeroFrame2][index2] = undefined;
        }
        index2++;
        // t.Utils.altezzaPareto[t.frameAttivo][t.NumeroFrame].push(150);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: misura: '  + element + ' - index:' + index, righe[index]);
      // }
      // index2++;
    });
    // logConsole('Pareto 2', t.tipiPareto[t.NumeroFrame2]);

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Grafici pareto preparati:', t.measureDaDisegnarePareto, t.altezzaPareto[t.NumeroFrame2]);

    const tm = setTimeout(() => {
      clearTimeout(tm);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Disegno Pareto:', t.NumeroFrame, this.tipiPareto);

      // t.chartsPareto[t.NumeroFrame2] = new Array();

      // t.giaDisegnataStruttura[t.NumeroFrame2] = false;
      // t.chartsPareto[t.NumeroFrame2] = new Array();

      // Con struttura da ricreare ogni grafico viene creato di nuovo (push): i precedenti non vengono riusati,
      // quindi si distruggono qui. Prima restavano nell'elenco (es. dopo un cambio vista senza nuovi dati),
      // senza destroy() e con gli indici sfasati.
      if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
        ExternalUtilities.distruggiGrafici(t.chartsPareto[t.NumeroFrame2]);
        t.chartsPareto[t.NumeroFrame2] = new Array();
      }

      let index22 = 0;
      index2 = 0;

      // logConsole('Pareto 3', t.tipiPareto[t.NumeroFrame2]);

      t.tipiPareto[t.NumeroFrame2].forEach(element => {
        // // logConsole('DISEGNO PARETO', index2, index22, element);
        // if (element !== undefined) {
        if (element !== '' &&
            element !== undefined  &&
            element !== null &&
            t.righePareto[t.NumeroFrame2][index22] && 
            t.righePareto[t.NumeroFrame2][index22] !== null) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);

          // t.Utils.contatoreGraficiPareto[t.frameAttivo][t.NumeroFrame]++;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.righePareto[index22]);
          
          const valori = t.conteggi[t.NumeroFrame2][index22].split(';');
          // logConsole('Pareto aggiunge grafico', element);
          this.aggiungeGraficoPareto(t, element, index2, t.righePareto[t.NumeroFrame2][index22],
                        t.arrayPareto[t.NumeroFrame2], valori[0], valori[1], valori[2], altGrafico); // ,
                        // this.totYG[t.NumeroFrame],
                        // this.srG[t.NumeroFrame],
                        // this.numRigheG[t.NumeroFrame]);
          index2++;
        }
        index22++;
        // }
      });
      
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: 1', t.chartsPareto);
      if (t.chartsPareto[t.NumeroFrame2]) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto da disegnare: ', t.measureDaDisegnarePareto.length);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Charts totale: ', t.chartsPareto[t.NumeroFrame2].length - 1);

        /* for (let i = t.measureDaDisegnarePareto.length; i <= t.chartsPareto[t.NumeroFrame2].length - 1; i++) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Chart da eliminare', i);
          // t.chartsPareto[t.NumeroFrame2][i].destroy();
          // t.chartsPareto[t.NumeroFrame2][i] = undefined;
        } */
        
        // const mddp = new Array();
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure da disegnare Pareto: ', mddp);

        // t.chartsPareto[t.NumeroFrame2].forEach(element2 => {
        for (let i = 0; i <= t.measureDaDisegnarePareto.length - 1; i++) {
          let element2 = t.chartsPareto[t.NumeroFrame2][i];
          if (element2 && element2.canvas && element2.canvas !== null) {            
            element2.render();

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Renderizzo pareto', n, element2.canvas);
            // logConsole('Pareto', index2, element2, t.minXPareto[t.NumeroFrame2], t.maxXPareto[t.NumeroFrame2]);

            this.createPareto(t, index2, element2, t.minXPareto[t.NumeroFrame2], t.maxXPareto[t.NumeroFrame2]);
          // } else {
          //   t.altezzaGraficoPareto[t.NumeroFrame2][index2] = 0;
          }
          // mddp.push(-1);
        };

        /* index2 = 0;
        t.chartsPareto[t.NumeroFrame2].forEach(element2 => {
          if (element2 && element2.canvas && element2.canvas !== null) {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2);
            this.createPareto(index2, element2, t.minXPareto[t.NumeroFrame2], t.maxXPareto[t.NumeroFrame2]);
            // t.altezzaPareto[t.NumeroFrame2].push(150);
          }
          index2++;
        }); */
      }

      if (t.modalitaRealTimeAttiva2) {
        // Messo il controllo di realtime attivo in quanto se si fa un cambio dei filtri non ricarica tutti i dati
        // tipo il titolo e la dimensione delle barre (Mail 28/07/2023 10:22)
        if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
          t.giaDisegnataStruttura[t.NumeroFrame2] = true;
        }
      }
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: 3'); /* */

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Combo abilitata');s
      t.comboDisabilitata = false;
      // this.staGiaDisegnandoGraficiPareto[t.NumeroFrame2] = false;
      t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
    }, 200);
  }

  aggiungeGraficoPareto(t, element, index, riga, misure, total_count, sr, avg, altGrafico) { // , totY, sr, numRighe
    // let ret = true;
    const nomeChart = 'chartContainersPareto_' + t.frameAttivo2 + '_' + t.NumeroFrame2 + '_' + index;
    // logConsole('Pareto chart', nomeChart);

    // // logConsole('NOME PARETO', nomeChart, riga, misure);

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Chart Pareto', nomeChart);

    let righe = undefined;
    if (riga && riga !== undefined && riga !== 'undefined') {
      righe = JSON.parse(JSON.stringify(riga));
      if (righe.length > 1) {
        righe = righe.substring(0, righe.length - 1);
      }
      righe = '[' + righe + ']';
    }
    
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righe);
    if (righe !== '' && righe !== undefined) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Righe JSON', righe);
      let righeJson;
      if (righe.indexOf('[undefined{') > -1) {
        righe = righe.replace('[undefined{', '[{');
      }
      try {
        righeJson = JSON.parse(righe);
      } catch(e) {
        console.error('ERRORE NELLA CONVERSIONE DEL PARETO', righe, riga);
        righeJson = undefined;
      }

      // logConsole(righeJson);
      if (righeJson) {
        const tipi = new Array();
        const righe2 = new Array();

        righeJson.forEach(element2 => {
          const yPercent = 100 * element2.count /  element2.total_count;
          let yPerc1 = '0.00';
          if (yPercent) {
            yPerc1 = this._decimalPipe.transform(yPercent, "1.2-2")
          }
          element2.y1 = yPerc1;

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2.YLabel);
          const x = element2.YLabel;
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
          }
        });

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tipi);

        let ii = 0;
        let ii2 = 0;
        let numeroRighe = 0;
        let tot = 0;
        let sr = 0;
        tipi.forEach(element2 => {
          let righella2 = '';

          righeJson.forEach(element3 => {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2, element3);
            if (element2 === element3.YLabel) {
              const righella = JSON.stringify(element3);
              // righella = righella.replace('{', '');
              // righella = righella.replace('}', '');
              // righella += ',"x": ' + ii
              // righella = '{' + righella + '}';
              righella2 += righella + ',';

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element3);
              if (element3.count !== undefined) {
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, +((element3.x).replace('"', '').replace('"', '')));
                tot += +element3.count; // ((element3.x).replace('"', '').replace('"', ''));
              }

              if (element3.severity !== undefined) {
                if (element3.severity.indexOf('1 ') > -1 || element3.severity.indexOf('2 ') > -1) {
                  sr++;
                }
              }
            }
            ii++;
            numeroRighe++;
          });
          if (righella2 !== '') {
            righe2[ii2] = '[' + righella2.substring(0, righella2.length - 1) + ']';
          }
          ii2++;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righe2[ii2]);
        });

        let righe3 = '';
        righe2.forEach(element2 => {
          righe3 += '{"type": "column", "name": "' + element + '", "dataPoints": ' + element2 + '},';
        });
        if (righe3.length > 0) {
          righe3 = '[' + righe3.substring(0, righe3.length - 1) + ']';
        } else {
          righe3 += '[{"type": "column", "name": "' + element + '", "dataPoints": []}]';
        }
        const righeFinali = JSON.parse(righe3);
        // logConsole(righeFinali);

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Righe per Pareto', righeFinali);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Righe finali', righeFinali, righeFinali.length);

        /* data: [{
          type: puntini.datasets[0].type,
          name: puntini.datasets[0].name,
          dataPoints: puntini.datasets[0].data,
          'click': this.onClickHistogram,
        }], */

        // const puntini = righeFinali;

        const tito = ExternalUtilities.PrendeNomeMisuraDaCodice(misure[0], t.measureData2, 'Pareto 3. Frame ' + t.NumeroFrame2);

        const contentToolTip = {
          content: 'Chart: ' + element + '<br/>' +
                    '' + tito + ': {x}<br/>' +
                    '%: {y1} {y2}<br/>' +
                    'Count: {count}<br/>' +
                    'Total Count: ' + total_count + '<br />' +
                    'CDF: {runPerc}%<br />' +
                    'CCDF: {cRunPerc}%',
          cornerRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, .75)'
        };
        const axisColor = '#c6c6c6';
        const fontColor = 'transparent';

        const media = Math.round((tot / numeroRighe) * 100) / 100;
        // const srT = Math.round(100 * tot / sr) + '%';

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element, numeroRighe, tot, sr);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, totY, sr, numRighe);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.elementView.nativeElement.clientWidth);

        const larghezzaChart = t.elementView.nativeElement.clientWidth - 130;
        // const quantiPunti = righeFinali[0].dataPoints.length;
        let larghezzaBarra = Math.floor(larghezzaChart / this.larghezzaBarra[t.NumeroFrame2]);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Dime Barra -> ', quantiPunti, righeFinali, larghezzaBarra[t.NumeroFrame2]);
        // let larghezzaBarra[t.NumeroFrame2] = Math.round(larghezzaChart / (t.maxXPareto[t.NumeroFrame2] - t.minXPareto[t.NumeroFrame2])) - 1;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: barre ',index, larghezzaChart, t.maxXPareto[t.NumeroFrame2], t.minXPareto[t.NumeroFrame2], larghezzaBarra[t.NumeroFrame2]);
        if (larghezzaBarra <= 0) { larghezzaBarra = 1; }

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Valori per barra pareto', larghezzaChart, larghezzaBarra,
          t.elementView.nativeElement.clientWidth, t.maxXPareto[t.NumeroFrame2], t.minXPareto[t.NumeroFrame2]);

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Misure per titolo', misure);
        const titolo = ExternalUtilities.PrendeNomeMisuraDaCodice(misure[0], t.measureData2, 'Pareto 4. Frame ' + t.NumeroFrame2) + ': ' +
          ExternalUtilities.PrendeNomeMisuraDaCodice(misure[1], t.measureData2, 'Pareto 5. Frame ' + t.NumeroFrame2)  + ' ' + element +
          ' Total Count ' + total_count; //  + ' SR ' + sr; + '% AVG ' + avg;

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Titolo Pareto', titolo);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Altezza grafico', altGrafico);

        righeFinali.forEach(element => {
          element.click =  this.onClickPareto.bind(null, t)  
        });

        const strutturaChart = {
          height: altGrafico,
          title: {
            text: t.NumeroFrame2 + '.' + t.frameAttivo2 + ' ' + t.nomiFrames[t.frameAttivo2] + ' - ' + titolo,
            fontSize: 12,
            fontFamily: 'Arial'
          },
          zoomEnabled: true,
          zoomType: 'x', // change it to "xy" to enable zooming on both axes
          animationEnabled: false,
          dataPointWidth: larghezzaBarra,
          toolTip: contentToolTip,
          axisX: {
            fontWeight: 'normal',
            fontFamily: 'arial',
            labelFontColor: '#646464',
            // labelAngle: -70
            lineColor: axisColor,
            gridColor: axisColor,
            tickColor: '#646464',
            minimum: this.asseXMinimo[t.NumeroFrame2],
            maximum: this.asseXMassimo[t.NumeroFrame2]
          },
          axisY: {
            // title: element,
            titleWrap: false,
            titleFontColor: '#646464',
            fontWeight: 'normal',
            fontFamily: 'arial',
            lineColor: axisColor,
            gridColor: axisColor,
            labelFontColor: '#646464',
            valueFormatString: '000',
            tickColor: 'transparent',
            title: 'count'
          },
          // rangeChanged: this.syncHandler
          data: righeFinali,
        };

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nomeChart, strutturaChart);

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pareto: Renderizzo Pareto', index, t.chartsPareto[t.NumeroFrame2].length, nomeChart, t.altezzaPareto[t.NumeroFrame2][index]);

        // t.altezzaPareto[t.NumeroFrame2][index] = 150;

        // t.giaDisegnataStruttura[t.NumeroFrame2] = false;
          
        if (!t.giaDisegnataStruttura[t.NumeroFrame2] || index > t.chartsPareto[t.NumeroFrame2].length - 1 || !t.chartsPareto[t.NumeroFrame2][index]) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Creazione dati del pareto: Index arrivato ' + index + 
            ' Charts già presenti: ' + t.chartsPareto[t.NumeroFrame2].length + 
            ' Struttura disegnata: ' + t.giaDisegnataStruttura[t.NumeroFrame2]);

          if (!t.chartsPareto[t.NumeroFrame2]) {
            t.chartsPareto[t.NumeroFrame2] = new Array();
          }

          // Il grafico va nella posizione della sua misura (index), non in coda: con push, se la posizione era vuota,
          // il grafico finiva altrove, la posizione restava vuota e al ridisegno successivo se ne creava un altro,
          // lasciando vivo il precedente (canvas staccati dalla pagina). Un eventuale grafico già presente viene distrutto.
          ExternalUtilities.distruggiGrafici([t.chartsPareto[t.NumeroFrame2][index]]);
          t.chartsPareto[t.NumeroFrame2][index] = new t.CanvJS.Chart(nomeChart, strutturaChart);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Creo dati del pareto', index, t.chartsPareto[t.NumeroFrame2][index], strutturaChart);
        } else {
          t.chartsPareto[t.NumeroFrame2][index].options.data[0] = strutturaChart.data[0];
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiorno dati del pareto', index, t.chartsPareto[t.NumeroFrame2][index], strutturaChart);
        }

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista charts pareto', t.chartsPareto[t.NumeroFrame2].length);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure da disegnare pareto', t.measureDaDisegnarePareto);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza pareto', t.altezzaPareto[t.NumeroFrame2]);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tipi pareto', t.tipiPareto[t.NumeroFrame2]);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Righe pareto', righeFinali);
      }
      // }
    }
  }

  onClickPareto(t, e) {
    const tito = ExternalUtilities.PrendeNomeMisuraDaCodice(t.arrayPareto[t.NumeroFrame2][0], t.measureData2, 'On Click Pareto. Frame ' + t.NumeroFrame2);

    t.testoDatiGrafici = 'Chart: ' + e.dataPoint.YLabel + '<br/>' +
                '' + tito + ': ' + e.dataPoint.x + '<br/>' +
                '%: ' + e.dataPoint.y1 + ' ' + e.dataPoint.y2 + '<br/>' +
                'Count: ' + e.dataPoint.count + '<br/>' +
                'Total Count: ' + e.dataPoint.total_count + '<br />' +
                'CDF: ' + e.dataPoint.runPerc + '%<br />' +
                'CCDF: ' + e.dataPoint.cRunPerc + '%';

    t.datiGrafici = true;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CLICK SU PARETO: ', e);
  }
}

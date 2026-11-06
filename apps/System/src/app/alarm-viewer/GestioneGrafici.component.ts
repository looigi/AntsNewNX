import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';
import download from 'downloadjs';  // Importa downloadjs
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '../db/api.service';
import { ReturnStatement } from '@angular/compiler';

// declare const CanvasJS: any;

@Injectable()
export class GestioneGrafici {
  static destroy$ = new Subject<void>();

  vecchioTms;
  vecchioParams = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  appoData2 = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ];
  quantiDisegnati = 0;
  quantiNonDisegnati = 0;
  quantiNulli = 0;
  vecchieRigheDT = 0;

  constructor(
    // private fileSaver: FileSaverService,
    private apiService: ApiService
  ) {
  }

  // static terminatoCaricamento;
  // static contatore;

  pulisceGrafici(t) {
    // if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
      // logConsole('Pulizia grafici 2', t.chartsGrafici, t.NumeroFrame2);
      // this.vecchioParams[t.NumeroFrame2] = '';
      // this.appoData2[t.NumeroFrame2] = undefined;

      t.chartsGrafici[t.NumeroFrame2].forEach(element => {
        if (element && element.container && element.container !== null) {
          element.destroy();
          element = null;
        }
      });

      // GestioneGrafici.charts.forEach(element => {
      for (let i = 0; i < 500; i++) {
        let element = t.chartsGrafici[t.NumeroFrame2][i];
        if (element) {
          if (t.altezzaGraficiChart[t.NumeroFrame2] && t.altezzaGraficiChart[t.NumeroFrame2][i]) {
            t.altezzaGraficiChart[t.NumeroFrame2][i] = -1;
          }
          if (element && element.container && element.container !== null) {
            element.destroy();
          }
        }
        element = '';
        // if (element && element !== null && element !== '') {
        //   element.options.axisX.viewportMinimum = null;
        //   element.options.axisX.viewportMaximum = null;
        //   element.render();
        // }
      }
    // }
    // });
  }

  pulisceAppoggi(t) {
    // logConsole('Pulizia grafici 1', t.NumeroFrame2);

    GestioneGrafici.destroy$.next();
    GestioneGrafici.destroy$.complete();  

    this.vecchieRigheDT = 0;
    this.vecchioParams[t.NumeroFrame2] = '';

    t.lastCallGrafici[t.NumeroFrame2] = '';
    t.lastCallTmsToGps[t.NumeroFrame2] = '';
    t.measureDaDisegnare[t.NumeroFrame2] = new Array();
    t.dimeBarra[t.NumeroFrame2] = -1;
    t.datiAppoggio[t.NumeroFrame2] = undefined;
    t.dataInizio[t.NumeroFrame2] = undefined;
    t.dataFine[t.NumeroFrame2] = undefined;
    t.array2[t.NumeroFrame2] = undefined;
    t.folders[t.NumeroFrame2] = undefined;
    t.contaGrafici[t.NumeroFrame2] = undefined;
    t.tmsGrafici[t.NumeroFrame2] = undefined;
    t.altezzaGraficiChart[t.NumeroFrame2] = new Array();
    t.tipoGrafico[t.NumeroFrame2] = new Array();
    t.larghezzaDiv[t.NumeroFrame2] = -1;
    t.quantiPuntiGrafico[t.NumeroFrame2] = -1;
    t.chartsGrafici[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
    t.aggiornaGrafici[t.NumeroFrame2] = true;
    t.dataPointsAppoggio[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
    /* this.datiChartAppoggiati = new Array();
    for (let k = 0; k <= 200; k++) {
      t.chartsGrafici[t.NumeroFrame2].push(null);
      this.datiChartAppoggiati.push(null);
    } */

    // logConsole('Pulizia grafici 3', t.NumeroFrame2);

    t.vecchioaArrayMisure[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
    t.puntiniAppoggio[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
    t.nomiChart[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
    t.nomiGrafici[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
    t.minimo[t.NumeroFrame2] = -1;
    t.massimo[t.NumeroFrame2] = -1;
    t.minimoY[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
    t.massimoY[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
    // t.axisY[t.NumeroFrame2] = t.creaVettore(150, undefined);
    // t.axisX[t.NumeroFrame2] = t.creaVettore(150, undefined);
    t.DPNulloVecchio[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
    t.DPNullo[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, true);
    /* for (let k = 0; k <= 200; k++) {
      this.puntiniAppoggio.push(null);
      this.nomiChart.push('');
    } */
    t.giaDisegnataStruttura[t.NumeroFrame2] = false;
    t.erroreGrafici[t.NumeroFram2] = '';

    // logConsole('Pulizia grafici 4', t.NumeroFrame2);
  }

  static spegneBottoni() {
    const p = document.getElementsByClassName('canvasjs-chart-toolbar') as HTMLCollectionOf<Element>;
    for(let i = 0; i < p.length; i++) {
      const pe = p[i];
      if (pe) {
        pe['style']['visibility'] = 'hidden';
        pe['style']['display'] = 'none';

        for (let i = 0; i < pe.children.length; i++) {
          const button: HTMLElement = pe.children[i] as HTMLElement;
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, button);
          button.style.visibility = 'hidden';
          button.style.display = 'none';
        }
      }
    };
    return;
    /*
    const parentElement: HTMLElement = document.getElementsByClassName('canvasjs-chart-toolbar')[n] as HTMLElement;
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, n, document, parentElement);
    if (parentElement) {
      // parentElement.setAttribute('style', '');
      parentElement.style.visibility = 'hidden';
      parentElement.style.display = 'none';

      for (let i = 0; i < parentElement.children.length; i++) {
        const button: HTMLElement = parentElement.children[i] as HTMLElement;
        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, button);
        button.style.visibility = 'hidden';
        button.style.display = 'none';
      }
      // const button1: HTMLElement = parentElement.children[0] as HTMLElement;
      const button2: HTMLElement = parentElement.children[1] as HTMLElement;
      // if (n !== 0) {
      if (parentElement) {
        parentElement.setAttribute('style', '');
      }
      if (button1) {
        button1.style.visibility = 'hidden';
      }
      if (button2) {
        button2.style.visibility = 'hidden';
      } */
        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, parentElement);
      /* } else {
        if (parentElement) {
          parentElement.setAttribute('style', 'position: absolute; right: -41px; top: 1px; border: 1px solid rgb(33, 150, 243);');
        }
        if (button1) {
          button1.style.visibility = 'display';
        }
        if (button2) {
          button2.style.visibility = 'hidden';
        }
      }
    } else {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Bottone non trovato');
    } */
  }

  /* resetGrafici(t) {
    if (t.Utils.charts && t.Utils.charts[t.frameAttivo] && t.Utils.charts[t.frameAttivo][t.NumeroFrame] && t.Utils.charts[t.frameAttivo][t.NumeroFrame].length > 0) {
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: RESET GRAFICI');
      let index = 0;
      t.Utils.charts[t.frameAttivo][t.NumeroFrame].forEach(element => {
        if (element !== null && element !== undefined && element.options !== undefined) {
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
          // element.options.axisX = {...this.Utils.axisXMaxMin[this.frameAttivo][this.NumeroFrame][index]};
          element.options.axisX = {...t.axisXConTempoVisibile};
          // GestioneGrafici.axisXApp = {...GestioneGrafici.axisXMaxMin};

          if (element && element.canvas && element.canvas !== null) {
            element.render();
          }
        }
        index++;
      });
    }
  } */

  onClick2(t, e) {
    // ExternalUtilities.messaggioDiErrore(t, e.dataSeries.type + ', dataPoint { x:' + e.dataPoint.x + ', y: '+ e.dataPoint.y + ' }' );

    t.clickSuChart2 = true;
    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Clickato sui grafici', t.clickSuChart2);
    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e.dataPoint.x);
    // this.tmsSelezionato = e.dataPoint.x;

    // this.disegnaSelezioneGrafici(t, e.dataPoint.x, true, 'Click');

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // GestioneGrafici.disegnaSelezione(t, e.dataPoint.x, true);
    }, 100);
  }

  creaStrutturaGrafico(t, numeroGrafico, nomeChart, contentToolTip, axisY, puntini, tipoGrafico, titolo, dInizio, dFine) {
    const axisX = {
      // xValueType: "dateTime",            // Indica che i valori sono timestamp
      // valueFormatString: "DD MMM YYYY HH:mm:ss",  // Formato visualizzato
      /* crosshair: {
        enabled: true,
        labelFormatter: e => { return ' '}
      },
      gridThickness: 0,
      tickLength: 0,
      lineThickness: 0,
      labelFormatter: function() {
        return ' ';
      }, */
      labelAngle: 0,
    };

    // Rimetto l'axisX giusto visto che cambiarlo non funge
    // axisX = axisX2;

    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Altezza grafico', t.frameAttivo, t.NumeroFrame, numeroGrafico, altezza + 2);

    // t.altezzaGrafici[numeroGrafico] = altezza + 2;
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.titoloChart);
    // const differenza = (new Date(dFine).getTime() - new Date(dInizio).getTime());
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: PUNTINI', puntini, dInizio, dFine);

    /* const quantiPunti = puntini[0].dataPoints.length;
    let dimeBarra = 100 / quantiPunti;
    if (dimeBarra < 1 ) { dimeBarra = 1; }

    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PUNTINI 1: ', puntini); */

    // puntini[0]['xValueType'] = "dateTime";
    // logConsole('PUNTINI 1: ', puntini);

    const datiChart = {
      // height: altezza,
      title: { text: titolo, fontSize: 10 , fontFamily: 'Arial', margin: -2 },
      zoomEnabled: true,
      // exportEnabled: true,
      zoomType: 'x', // change it to "xy" to enable zooming on both axes
      animationEnabled: false,
      /* title: {
          text: display_name,
          fontWeight: 'normal',
          fontFamily: 'arial',
          margin: -4,
      }, */
      // width: t.larghezzaDiv[t.NumeroFrame2],
      toolTip: contentToolTip,
      axisX: t.axisXConTempoVisibile, // axisX,
      axisY: axisY,
      dataPointWidth: t.dimeBarra[t.NumeroFrame2],
      rangeChanged: this.syncHandler.bind(null, t, this),
      data: puntini,  /* [
        {
        'mouseover': function(e) {
            // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e.dataSeries.type + ', dataPoint { x:' + e.dataPoint.x + ', y: ' + e.dataPoint.y + ' }' );
            t.GestioneGrafici.charts.forEach(element2 => {
              if (element2 !== null) {
                // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2);
                // element2.dispatchEvent(createEvent(
                  e.type,
                  e.screenX,
                  e.screenY,
                  e.clientX,
                  e.clientY
                )); //
                element2.axisX[0].intervalStartPosition = e.dataPoint.x;
              }
            });
          },
          type: puntini.datasets[0].type,
          name: puntini.datasets[0].name,
          dataPoints: puntini.datasets[0].data,
        },
      ], */
      // rangeChanging: disableZoomButtonOnReset
    };
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, datiChart);
    // t.axisY[t.NumeroFrame2][numeroGrafico] = axisY;
    
    // logConsole('Grafico', datiChart);
    // logConsole('Disegna grafici   8.4.3-1', t.NumeroFrame2, numeroGrafico, nomeChart, datiChart);

    t.chartsGrafici[t.NumeroFrame2][numeroGrafico] = new t.CanvJS.Chart(nomeChart, datiChart);
    t.Utils.qualeGrafico++;

    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Grafico ', numeroGrafico, t.NumeroFrame2, nomeChart);

    // t.Utils.quantoContatoreGrafici++;
  }

  isVisible(t, numeroGrafico, altezzaDivContenitore) {
    /* const ele = document.getElementById(this.nomiChart[numeroGrafico]);
    if (ele) {
      const coordinate = ele.getBoundingClientRect();
      const bottom = coordinate.x;
      const top = coordinate.y;
      const height = coordinate.height;

      const divGraficoContenitore = document.getElementById('divGraficiInterno');
      const containerRect = divGraficoContenitore.getBoundingClientRect();
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Posizione contenitore', containerRect.top, containerRect.top);
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Posizione oggetto', numeroGrafico, nomeGrafico, coordinate);

      return top <= containerRect.top ? containerRect.top - top <= height : bottom - containerRect.bottom <= height;
    } else {
      return false;
    } */
    // const divGraficoContenitore = document.getElementById('divGraficiInterno');
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scroll div contenitore', t.scrollAttualeGrafici);
    let altezza = 55;
    if (t.debug2) {
      altezza = 105;
    }

    // if (!t.modalitaRealTimeAttiva2) {
      return true;
    /* } else {
      let pos = 0;
      for (let i = 0; i <= numeroGrafico; i++) {
        pos += (t.altezzaGraficiChart[t.NumeroFrame2][i] - 1);
      }
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Posizione grafico: ', pos);
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Grafico ', numeroGrafico, pos);
      if (pos >= t.scrollAttualeGrafici && pos <= t.scrollAttualeGrafici + altezzaDivContenitore + altezza) {
        return true;
      } else {
        // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false,
        //   'Disegno grafici a video: RT Grafico ' + numeroGrafico + 
        //   ' (' + t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico] + '). NON Visibile ', pos, t.scrollAttualeGrafici, t.scrollAttualeGrafici + altezzaDivContenitore + altezza);

        return false;
      }
    } */
  }

  disegnaGraficiAVideo(t, numeroGrafico) {    
    if (!t.frameVisible2) {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'MC') {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Time Chart', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    if (!t.divGrafici || !t.dataPointsAppoggio[t.NumeroFrame2] ||
      !t.dataPointsAppoggio[t.NumeroFrame2][numeroGrafico] || !t.altezzaGraficiChart[t.NumeroFrame2]) {
      // if (t.modalitaRealTimeAttiva2 === false) {
        // t.altezzaGrafici[numeroGrafico] = 0;
        this.quantiNonDisegnati++;
      // }
      t.graficoVisibile[t.NumeroFrame2][numeroGrafico] = false;
      t.altezzaGraficiChart[t.NumeroFrame2][numeroGrafico] = 0;
      return;
    }
    // t.altezzaGraficiChart[t.NumeroFrame2][numeroGrafico] = this.calcoloAltezza(t, numeroGrafico);

    const puntini = t.dataPointsAppoggio[t.NumeroFrame2][numeroGrafico];
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Numero grafico', numeroGrafico, puntini);

    const altezzaDivContenitore = t.divGrafici.nativeElement.offsetHeight;

    // const siVede = this.isVisible(numeroGrafico, this.nomiChart[numeroGrafico]);
    /* let visibile;
    if (!t.modalitaRealTimeAttiva2) {
      visibile = true;
    } else { */
    const visibile = this.isVisible(t, numeroGrafico, altezzaDivContenitore);
    // }


    // if (tipoGrafico !== 'HYSTOGRAM') {
      // this.datiChartAppoggiati.data = puntini;
      /* let quantiPunti = 0;
      if (puntini !== -1 && puntini && puntini[0] && puntini[0].dataPoints) {
        quantiPunti = puntini[0].dataPoints.length;
      } */

    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Numero grafico', numeroGrafico, puntini, visibile, t.altezzaGrafici[numeroGrafico], );

      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Graficone: ', numeroGrafico, puntini, quantiPunti, this.DPNullo[numeroGrafico]);
      // if (!puntini || !puntini.dataPoints || (puntini.dataPoints && puntini.dataPoints.length === 1) || puntini === -1) {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 
      //   'Disegno grafici a video: RT ' + t.modalitaRealTimeAttiva2 + 
      //   ' Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico + 
      //   ' (' + t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico] + '). Nullo: ' + 
      //   t.DPNullo[t.NumeroFrame2][numeroGrafico] + ' - Visibile: ' + visibile + 
      //   ' - Altezza: ' + t.altezzaGraficiChart[t.NumeroFrame2][numeroGrafico]); //  + 
        // ' - Datapoints su Chart: ' + t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.data[0].dataPoints);

      // logConsole('Disegno grafici a video: 1 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico, t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico], t.DPNullo[t.NumeroFrame2][numeroGrafico]);

      t.DPNulloVecchio[t.NumeroFrame2][numeroGrafico] = t.DPNullo[t.NumeroFrame2][numeroGrafico];

      if (t.DPNullo[t.NumeroFrame2][numeroGrafico] === true) { // (puntini === -1 || quantiPunti < 2) {
        // if (!t.modalitaRealTimeAttiva2) {
          // logConsole('NON Disegno grafici a video 1: 1 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico, t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico], t.DPNullo[t.NumeroFrame2][numeroGrafico]);

          t.altezzaGraficiChart[t.NumeroFrame2][numeroGrafico] = 0;
          t.graficoVisibile[t.NumeroFrame2][numeroGrafico] = false;
          this.quantiNonDisegnati++;
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Nullo ' + numeroGrafico);
        // } else {
          // logConsole('NON Disegno grafici a video 2: 1 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico, t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico], t.DPNullo[t.NumeroFrame2][numeroGrafico]);

          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Nullo ma lo disegno lo stesso per RT ' + t.modalitaRealTimeAttiva2);
        // }
      } else {
        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prova da matti', numeroGrafico, t);
        // if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
        // }

        if (t.chartsGrafici[t.NumeroFrame2][numeroGrafico] && t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options && 
            t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.data && t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.data[0] && 
            t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.data[0].dataPoints) {
          // // logConsole('Disegno grafici a video: 2 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico);

          if (visibile) {
            // // logConsole('Disegno grafici a video: 3 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico);

            // t.graficoVisibile[numeroGrafico] = false;
            // const tm = setTimeout(() => {
          // clearTimeout(tm);
              t.graficoVisibile[t.NumeroFrame2][numeroGrafico] = true;

              this.quantiDisegnati++;

              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Frame ' + t.NumeroFrame2 + ' div grafico ' + numeroGrafico + ': ' + visibile, t.chartsGrafici[t.NumeroFrame2][numeroGrafico]);

              if (puntini !== null) {                
                // // logConsole('Disegno grafici a video: 4 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico);

                const contentToolTip = { content: '{x2}<br />' + t.nomiGrafici[t.NumeroFrame2][numeroGrafico] + ': {label}', cornerRadius: 4 };
                // title: { text: titolo, fontSize: 10 , fontFamily: 'Arial', margin: -2 },
              
                // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno grafico: ', numeroGrafico, t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options);

                t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.title.text = t.nomiGrafici[t.NumeroFrame2][numeroGrafico];
                t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.toolTip = contentToolTip;

                let axisX = t.axisXConValueVisibile; // t.axisXSenzaTempoVisibile;
                if (numeroGrafico === 0) {
                  // axisX = t.axisXConTempoVisibile;
                } else {
                  if (t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico] === 'act_distance') {
                    // axisX = t.axisXConValueVisibile; // axisXSenzaTempoVisibile; QUI
                  }
                }

                // if (axisX) {
                  /*  */

                  // // logConsole('*3* Assi impostati', t.minimo[t.NumeroFrame2], t.massimo[t.NumeroFrame2])

                  // axisX.viewportMinimum = t.minimo[t.NumeroFrame2]; TOLTO
                  // axisX.viewportMaximum = t.massimo[t.NumeroFrame2];
                  axisX.minimum = t.minimo[t.NumeroFrame2];
                  axisX.maximum = t.massimo[t.NumeroFrame2];

                  // // logConsole('*B* Assi', numeroGrafico, t.massimo[t.NumeroFrame2] - t.minimo[t.NumeroFrame2]);

                  t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.axisX = axisX;
                // }

                let axisY; // = // t.axisY[t.NumeroFrame2][numeroGrafico];
                axisY = {
                  fontWeight: 'normal',
                  fontFamily: 'arial',
                  fontSize: 10,
                  // title: display_name,
                  titleWrap: false,
                  titleFontColor: '#aaaaaa',
                  lineColor: '#c6c6c6',
                  gridColor: '#c6c6c6',
                  labelFontColor: '#aaaaaa',
                  valueFormatString: '000',
                  tickColor: '#c6c6c6'
                };          
                  /* axisY.titleFontColor = '#aaaaaa';
                  axisY.lineColor = t.Utils.axisColor;
                  axisY.gridColor = t.Utils.axisColor;
                  axisY.labelFontColor = '#aaaaaa';
                  axisY.valueFormatString = '000';
                  axisY.tickColor = t.Utils.axisColor; */

                  if (t.minimoY[t.NumeroFrame2][numeroGrafico]) {
                    axisY.minimum = t.minimoY[t.NumeroFrame2][numeroGrafico];
                  }
                  if (t.massimoY[t.NumeroFrame2][numeroGrafico]) {
                    axisY.maximum = t.massimoY[t.NumeroFrame2][numeroGrafico];
                  }
                  // axisY.gridColor = 'green';
                  
                  // t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.data[0].axisY = axisY;
                  t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.axisY = axisY;
                  // t.chartsGrafici[t.NumeroFrame2][numeroGrafico].axisY = axisY;
                // }

                // logConsole('Disegno grafici a video: 5 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico, t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico], t.dimeBarra[t.NumeroFrame2]);
                t.chartsGrafici[t.NumeroFrame2][numeroGrafico].dataPointWidth = t.dimeBarra[t.NumeroFrame2];
                t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.dataPointWidth = t.dimeBarra[t.NumeroFrame2];
                
                /* if (t.debug2 === true) {
                  // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ridisegno grafico: ', numeroGrafico, t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico]);
                  // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ridisegno grafico. Dimensione barra: ', numeroGrafico, t.dimeBarra[t.NumeroFrame2]);
                  // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ridisegno grafico. Asse X:', numeroGrafico, t.minimo[t.NumeroFrame2], t.massimo[t.NumeroFrame2]); 
                  // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ridisegno grafico. Punti grafico:', numeroGrafico,  t.quantiPuntiGrafico[t.NumeroFrame2]);
                  // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ridisegno grafico. Datapoints:', numeroGrafico, puntini[0].dataPoints);
                  // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ridisegno grafico. Dimensione div:', numeroGrafico, t.larghezzaDiv[t.NumeroFrame2]);
                  // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ridisegno grafico. Chart:', numeroGrafico, t.chartsGrafici[t.NumeroFrame2][numeroGrafico]);
                } */
                
                // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Grafico', numeroGrafico, t.chartsGrafici[t.NumeroFrame2][numeroGrafico], puntini);
                // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Punti e dimensioni barra', numeroPunti, dimeBarra);

                if (t.chartsGrafici[t.NumeroFrame2] && 
                  t.chartsGrafici[t.NumeroFrame2][numeroGrafico] && t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.data && 
                  t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.data[0] && puntini && puntini[0]) {
                  t.chartsGrafici[t.NumeroFrame2][numeroGrafico].options.data[0].dataPoints = puntini[0].dataPoints;

                  logConsole('Disegno grafici a video: 6 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico);
                  try {
                    t.chartsGrafici[t.NumeroFrame2][numeroGrafico].render();
                  } catch (e) {
                    // console.error('Errore su render chart: ', t.chartsGrafici[t.NumeroFrame2][numeroGrafico]);
                  }
                } else {
                  if (!puntini || !puntini[0]) {
                    console.error('Disegno grafici a video: Puntini non validi del grafico ' + numeroGrafico, t.NumeroFrame2);
                  }
                }
                /* const tm = setTimeout(() => {
                  clearTimeout(tm);
                  // MESSO ALTRIMENTI IL GRAFICO SI DISEGNA MALE
                  t.chartsGrafici[t.NumeroFrame2][numeroGrafico].render();
                }, 50) */
              }
            // }, 100);
            // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegnato ' + numeroGrafico);
          } else {
            // // logConsole('Disegno grafici a video: 5 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico);

            // if (!t.modalitaRealTimeAttiva2) {
              // logConsole('NON Disegno grafici a video 3: 1 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico, t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico], t.DPNullo[t.NumeroFrame2][numeroGrafico]);

              t.altezzaGraficiChart[t.NumeroFrame2][numeroGrafico] = 0;
              t.graficoVisibile[t.NumeroFrame2][numeroGrafico] = false;
              this.quantiNonDisegnati++;
              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Non visibile ' + numeroGrafico);
            // } else {
              // logConsole('NON Disegno grafici a video 4: 1 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico, t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico], t.DPNullo[t.NumeroFrame2][numeroGrafico]);

              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Non visibile ma disegno per RT ' + t.modalitaRealTimeAttiva2);
            // }
          }

          // } else {
        //   // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Grafico ' + numeroGrafico + ' non esistente.', t.chartsGrafici[t.NumeroFrame2][numeroGrafico]);
        } else {
          // logConsole('NON Disegno grafici a video 5: 1 - Frame ' + t.NumeroFrame2 + ' Grafico ' + numeroGrafico, t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico], t.DPNullo[t.NumeroFrame2][numeroGrafico]);

          t.graficoVisibile[t.NumeroFrame2][numeroGrafico] = false;
          this.quantiNonDisegnati++;
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Non esistente ' + numeroGrafico);
        }
      }
    // }
  }

  syncHandler(t, t2, e) {
    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: syncHandler: Charts:', t.chartsGrafici[t.NumeroFrame2]);
    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: syncHandler: Event', e);

    // // logConsole('*4* Assi', e.axisX[0].viewportMinimum, e.axisX[0].viewportMaximum)

    let valoreX1 = e.axisX[0].viewportMinimum;
    let valoreX2 = e.axisX[0].viewportMaximum;

    t2.limitiNuovi = { valoreX1, valoreX2 };
    // valoreX1 = new Date((t.Utils.datePipe.transform(new Date(valoreX1), 'yyyy-MM-dd HH:mm:ss', 'UTC+0'))).getTime();
    // valoreX2 = new Date((t.Utils.datePipe.transform(new Date(valoreX2), 'yyyy-MM-dd HH:mm:ss', 'UTC+0'))).getTime();

    try {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: syncHandler: Valore X1 viewPort: ', valoreX1);
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: syncHandler: Valore X2 viewPort: ', valoreX2);

      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: syncHandler: Valore X1 min: ', t.Utils.datePipe.transform(new Date(valoreX1), 'yyyy-MM-dd HH:mm:ss', 'UTC'));
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: syncHandler: Valore X2 max: ', t.Utils.datePipe.transform(new Date(valoreX2), 'yyyy-MM-dd HH:mm:ss', 'UTC'));
    } catch (ee) {

    }

    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, new )
    // const valoreX1 = e.axisX[0].minimum;
    // const valoreX2 = e.axisX[0].maximum;

    /* if (valoreX1 === null || valoreX2 === null) {
      const p = e.chart;
      valoreX1 = p.axisX[0].dataInfo.viewportMinimum;
      valoreX2 = p.axisX[0].dataInfo.viewportMaximum;
    }
    if (t.debug2 === true) {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Min/Max', valoreX1, valoreX2);
    } */

    // if (t.GestioneGrafici.charts[t.frameAttivo][t.NumeroFrame]) {

    let max = valoreX2.toString();
    if (max.indexOf('.') > -1) { max = max.substring(0, max.indexOf('.')); }
    let min = valoreX1.toString();
    if (min.indexOf('.') > -1) { min = min.substring(0, min.indexOf('.')); }
    let diff = (Math.round(((+max - +min)) / 1000) + .5).toString();
    if (diff.indexOf('.') > -1) { diff = diff.substring(0, diff.indexOf('.')); }
    let nuovoTms = ((+min + ((+diff / 2) * 1000)) ).toString();
    if (nuovoTms.indexOf('.') > -1) { nuovoTms = nuovoTms.substring(0, nuovoTms.indexOf('.')); }
    const sInizio = t.Utils.datePipe.transform(nuovoTms, 'yyyy-MM-dd HH:mm:ss');

    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      if (t.chartsGrafici[t.NumeroFrame2] !== null) {
        let index = 0;
        let nuovoRange = null;
        t.chartsGrafici[t.NumeroFrame2].forEach(chart => {
          if (chart && chart !== null && chart !== '' && chart.canvas && chart.canvas !== null) {
            /* if (t.debug2 === true) {
              // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Sync Handler chart', index);
            } */
            const parentElement: HTMLElement = document.getElementsByClassName('canvasjs-chart-toolbar')[index] as HTMLElement;
            if (parentElement && parentElement !== null) {
              if (index !== 0) {
                parentElement.setAttribute('style', '');
                // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, parentElement);
              } else {
                parentElement.setAttribute('style', 'position: absolute; right: -41px; top: 1px; border: 1px solid rgb(33, 150, 243);');
                const button1: HTMLElement = parentElement.children[1] as HTMLElement;
                button1.style.visibility = 'hidden';
              }
            }

            if (!chart.options.axisX) {
              chart.options.axisX = {};
            }

            // if (!chart.options.axisY) {
            //   chart.options.axisY = {};
            // }


            if (e.trigger === 'reset') {
              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, GestioneGrafici.axisXApp);
              // chart.options.axisX = null;

              const tm = setTimeout(() => {
                clearTimeout(tm);
                // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: syncHandler: Sync Handler chart reset', t.Utils.axisXMaxMin[t.frameAttivo][t.NumeroFrame][index].viewportMinimum,
                //   t.Utils.axisXMaxMin[t.frameAttivo][t.NumeroFrame][index].viewportMaximum);

                // // logConsole('*5* Assi', index, t.Utils.axisXMaxMin[t.NumeroFrame][t.frameAttivo][index].viewportMinimum, t.Utils.axisXMaxMin[t.NumeroFrame][t.frameAttivo][index].viewportMaximum)

                // chart.options.axisX.viewportMinimum = t.Utils.axisXMaxMin[t.NumeroFrame][t.frameAttivo][index].viewportMinimum; TOLTO
                // chart.options.axisX.viewportMaximum = t.Utils.axisXMaxMin[t.NumeroFrame][t.frameAttivo][index].viewportMaximum;
                chart.options.axisX.minimum = t.Utils.axisXMaxMin[t.frameAttivo][t.NumeroFrame][index].minimum; // QUI2
                chart.options.axisX.maximum = t.Utils.axisXMaxMin[t.frameAttivo][t.NumeroFrame][index].maximum;

                // GestioneGrafici.axisXApp = GestioneGrafici.axisXMaxMin; // chart.options.axisX;

                //7 this.disegnaSelezioneGraficiSingolo(t, nuovoTms, index);

                try {
                  chart.render();
                } catch (e) {
                  // console.error('Errore su render chart 4: ', t.chartsGrafici[t.NumeroFrame2]);
                }
              }, 1000);

              // chart.options.axisY.viewportMinimum = chart.options.axisY.viewportMaximum = null;
              // GestioneGrafici.axisYApp = chart.options.axisY;

              chart.options.axisX = {...t.Utils.axisXMaxMin[t.NumeroFrame][t.frameAttivo][index]};
  
              // GestioneGrafici.axisXApp = {...GestioneGrafici.axisXMaxMin};

              try {
                chart.render();
              } catch (e) {
                // console.error('Errore su render chart 5: ', t.chartsGrafici[t.NumeroFrame2]);
              }
            } else { // if (chart !== e.chart) {
              // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: syncHandler: Sync Handler chart limit', valoreX1, valoreX2);

              chart.options.axisX.minimum = valoreX1; // QUI2
              chart.options.axisX.maximum = valoreX2;

              /* chart.options.axisX.viewportMinimum = valoreX1;
              chart.options.axisX.viewportMaximum = valoreX2;

              if (nuovoRange === null) {
                nuovoRange = chart.options.axisX;
              } */

              // chart.options.axisY.viewportMinimum = e.axisY[0].viewportMinimum;
              // chart.options.axisY.viewportMaximum = e.axisY[0].viewportMaximum;

              // GestioneGrafici.axisXApp = {...chart.options.axisX};
              // GestioneGrafici.axisYApp = chart.options.axisY;

              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, chart);
              /* chart.render(); */
            }

            // chart.set('dataPointWidth', Math.ceil(chart.axisX[0].bounds.width / chart.data[0].dataPoints.length), true);
          }

          index++;
        });
      }
    }

    // if (nuovoRange !== null && nuovoRange.viewportMinimum && nuovoRange.viewportMaximum) {
    //  if (nuovoRange !== null && nuovoRange.minimum && nuovoRange.maximum) {
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: min:', t.Utils.datePipe.transform(min, 'yyyy-MM-dd HH:mm:ss.SSS'));
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: max:', t.Utils.datePipe.transform(max, 'yyyy-MM-dd HH:mm:ss.SSS'));
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: diff:', diff);
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: nuovoTms:', t.Utils.datePipe.transform(nuovoTms, 'yyyy-MM-dd HH:mm:ss.SSS'));

      // t.Utils.tmsInizio = t.Utils.datePipe.transform(min, 'yyyy-MM-dd HH:mm:ss.SSS');
      // t.Utils.tmsFine = t.Utils.datePipe.transform(max, 'yyyy-MM-dd HH:mm:ss.SSS');

      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: syncHandler: Sync Handler time range cambiato', diff, sInizio);

      // let smin = new Date(min).getUTCDate();
      // let smax = new Date(max).getUTCDate();
      /* const ssmin = t.Utils.datePipe.transform(min, 'yyyy-MM-dd HH:mm:ss', 'UTC+00');
      const ssmax = t.Utils.datePipe.transform(max, 'yyyy-MM-dd HH:mm:ss', 'UTC+00');
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: TIME RANGE 1', sInizio, min, max);
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: TIME RANGE 2', ssmin, ssmax); */

      t.timeRangeCambiato.emit(diff + ';' + sInizio + ';' + min + ';' + max + ';ZOOMGRAFICI');

      t.aggiornaGrafici[t.NumeroFrame2] = true;

      /* if (t.timeFilter !== 2 && t.timeFilter2 !== 'Time Range') {
        t.lastCallGrafici[t.NumeroFrame2] = '';
        t.giaDisegnataStruttura[t.NumeroFrame2] = false;
        const tm = setTimeout(() => {
          clearTimeout(tm);
          t2.disegnaGrafici(t, false);              
        }, 500);
      } */

      // AppComponent.CambioTmsSelezionato(sInizio);
      // t.Utils.cambioTimeRange = new Date();
    // }

    /* const tm = setTimeout(() => {
          clearTimeout(tm);
      // t.graficiComponent.disegnaSelezione(t, nuovoTms, index);
      GestioneGrafici.disegnaSelezione(t, nuovoTms, true);      
    }, 100); */

  }

  disegnaGrafici(t, nomeMisura, larghezzaDiv, altezzaDiv) {
    t.erroreGrafici[t.NumeroFrame2] = undefined;

    if (nomeMisura === '') {
      this.pulisceGrafici(t);
      return;
    }      

    let sInizio = '';
    let sFine = '';

    sInizio =  t.datePipe.transform(t.dateFrom, 'yyyy-MM-dd HH:mm:ss');
    sFine =  t.datePipe.transform(t.dateTo, 'yyyy-MM-dd HH:mm:ss');

    if (sInizio) {
      t.strutturaGraficiVuota = false;

      if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
        // t.DPNulloVecchio[t.NumeroFrame2] = new Array();
        for (let k = 0; k <= t.quantiGraficiMax; k++) {
          t.DPNulloVecchio[t.NumeroFrame2][k] = undefined;
        }
      }
  
      t.titoloChart = new Array();

      // let lista = null;
      // let lep = null;
      // const folders = new Array();
      // const conta = new Array();
      let eventi = '';

      // const divGraficoContenitore = document.getElementById('divGrafici_' + t.NumeroFrame2);
      // if (divGraficoContenitore) {
        t.larghezzaDiv[t.NumeroFrame2] = larghezzaDiv; // divGraficoContenitore.offsetWidth;
        // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Larghezza div per grafici: ', t.NumeroFrame2, t.larghezzaDiv[t.NumeroFrame2]);
      // }

      const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
        t.frameAttivo + ';';

      const actualCall = 'GRAFICI;' + t.stringaAGNoACT + ';' + sInizio + ';' + sFine + ';' + ';' +
        JSON.stringify(nomeMisura) + ';' + eventi + ';' + t.heightChart2;
      
      const n = nomeMisura.split(';');
      let nomeMisura2 = '';
      n.forEach(element => {
        nomeMisura2 += element + ',';
      });
      if (nomeMisura2.endsWith(',')) {
        nomeMisura2 = nomeMisura2.substring(0, nomeMisura2.length - 1);
      }
      nomeMisura2 = '"' + nomeMisura2 + '"';

      const params = '{ ' +
        '"cntx_id": "' + t.sessionID2 + '",' +
        '"v_filter_act_set_name": "[ACT ID] 0", ' +
        '"v_event_type_list": "", ' +
        '"v_measr_code_list": ' + nomeMisura2 + ', ' +
        '"v_geo_sla_name": "Template", ' +
        '"v_tms_min": "' + sInizio + '",' +
        '"v_tms_max": "' + sFine + '" ' +
      ' }';
      const diff = new Date().getTime() - new Date(sInizio).getTime();
      const giorni = diff / (1000 * 60 * 60 * 24);

      t.impostaAxisX(giorni >= 1 ? true : false);
      
      // logConsole('Chiamata grafici. Tempo totale ', sInizio + ' - ' + sFine, 'Giorni: ',giorni);

      t.caricamentoDatiInCorsoMC[t.NumeroFrame] = true;

      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Parametri grafici', params);

      t.tmsMinPerEsclusione = sInizio;
      t.tmsMaxPerEsclusione = sFine;
      t.erroreGrafici[t.NumeroFrame2] = '';
      t.caricamentoGraficiInCorso = true;

      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Grafici', t.NumeroFrame, params);
      // logConsole('Parametri', this.vecchioParams[t.NumeroFrame2], JSON.stringify(params), this.vecchioParams[t.NumeroFrame2] === JSON.stringify(params));

      /* if (this.vecchioParams[t.NumeroFrame2] === JSON.stringify(params) && this.appoData2[t.NumeroFrame2]) {
        // Skippo ultimo caricamento uguale
        this.gestioneGrafico(t, this.appoData2[t.NumeroFrame2], larghezzaDiv, altezzaDiv);
        t.caricamentoGraficiInCorso = false;
        return;
      } */

      this.vecchioParams[t.NumeroFrame2] = JSON.stringify(params);
      this.apiService.chiamataPost('geo_measure_sample__sel', params)
        // .map(response => response)
        .pipe(takeUntil(GestioneGrafici.destroy$))
        .subscribe(data2 => {
          t.Utils.checkRitornoChiamata(t, t.Utils, data2);

          const t2 = setTimeout(() => {
            clearTimeout(t2);

            t.caricamentoGraficiInCorso = false;
          }, 1000);

          this.pulisceGrafici(t);
          
          if (data2 === null || data2 === undefined) {
            // logConsole('Caricamento grafici nullo');
            t.erroreGrafici[t.NumeroFrame2] = 'No data detected';
          } else {
            // logConsole('Ritorno dati grafici:', data2);

            this.appoData2[t.NumeroFrame2] = JSON.parse(JSON.stringify(data2));
            // logConsole('Dati grafici salvati in appoData2 per frame ' + t.NumeroFrame2, larghezzaDiv, altezzaDiv);
            this.gestioneGrafico(t, data2, larghezzaDiv, altezzaDiv);
          }
        }, error => {
          // ExternalUtilities.messaggioDiErrore('null', error);
          t.caricamentoDatiInCorsoMC[t.NumeroFrame2] = false;

          return;
        });
      } else {
        if (t.aggiornaGrafici[t.NumeroFrame2] === false) {
          // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Esco per valore aggiorna grafici falso', '*' + t.aggiornaGrafici[t.NumeroFrame2] + '*');

          // // logConsole('Caricamento grafici annullato 7');
          return;
        }
        t.aggiornaGrafici[t.NumeroFrame2] = false;

        const min = new Date(t.dataInizio[t.NumeroFrame2]).getTime();
        const max = new Date(t.dataFine[t.NumeroFrame2]).getTime();

        this.quantiDisegnati = 0;
        this.quantiNonDisegnati = 0;
    
        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchi dati grafici', this.dataPointsAppoggio);

        t.dimeBarra[t.NumeroFrame2] = ((t.larghezzaDiv[t.NumeroFrame2] - 75) / t.quantiPuntiGrafico[t.NumeroFrame2]); // * 1.15;
        if (+t.dimeBarra[t.NumeroFrame2] < 1) { t.dimeBarra[t.NumeroFrame2] = 1; }
        // logConsole('Disegno grafici a video: 3 - Frame ' + t.NumeroFrame2, t.larghezzaDiv[t.NumeroFrame2], t.quantiPuntiGrafico[t.NumeroFrame2], t.dimeBarra[t.NumeroFrame2]);

        // const altezze = new Array();

        let inizio = 0;

        // const numeroCharts = t.chartsGrafici[t.NumeroFrame2];
        for (let numeroGrafico = inizio; numeroGrafico <= t.quantiGraficiMax; numeroGrafico++) {
          const element2 = t.chartsGrafici[t.NumeroFrame2][numeroGrafico];
          if (element2) {
            element2.width = t.larghezzaDiv[t.NumeroFrame2];
          }

          if (element2 && element2 !== null && element2 !== '' && element2.canvas && element2.canvas !== null) {
            if (t.datiAppoggio[t.NumeroFrame2]) {
              // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aggiorno grafico ', t.NumeroFrame2, numeroGrafico);

              // this.disegnaSelezioneGraficiSingolo(t, tms, numeroGrafico);
              // altezze.push(this.calcoloAltezza(t, numeroGrafico));
              t.altezzaGraficiChart[t.NumeroFrame2][numeroGrafico] = this.calcoloAltezza(t, numeroGrafico);
              this.disegnaGraficiAVideo(t, numeroGrafico);
              /* const tm = setTimeout(() => {
                clearTimeout(tm);
                this.disegnaSelezioneGraficiSingolo(t, tms2, numeroGrafico);
              }, 1000); */
            }
          } else {
            // if (t.modalitaRealTimeAttiva2 === false) {
              /* if (!t.altezzaGraficiChart[t.NumeroFrame2]) {
                t.altezzaGraficiChart[t.NumeroFrame2] = new Array();
              } */
              // altezze.push(0);
              t.altezzaGraficiChart[t.NumeroFrame2][numeroGrafico] = 0;
            // }
          }
        };

        const tm = setTimeout(() => {
          clearTimeout(tm);
          /* for (let numeroGrafico = inizio; numeroGrafico <= t.quantiGraficiMax; numeroGrafico++) {
            const element2 = t.chartsGrafici[t.NumeroFrame2][numeroGrafico];
            if (element2 && element2 !== null && element2 !== '' && element2.canvas && element2.canvas !== null) {
              if (t.datiAppoggio[t.NumeroFrame2]) {
                this.disegnaSelezioneGraficiSingolo(t, tms2, numeroGrafico, 'Ciclo 2');
              }
            }
          }; */
          this.disegnaSelezioneGrafici(t, sInizio, true, 'Ciclo2');                 
        }, 500);
        // altezze.push(35); // TOLTO PER IL MOMENTO
        // altezze.push(35); // TOLTO PER IL MOMENTO

        this.calcolaAltezzaTotale(t);
      }
  }

  gestioneGrafico(t, data2, larghezzaDiv, altezzaDiv) {
    let eliminaTutto = false;

    if (data2.DataTable.length !== this.vecchieRigheDT) {
      eliminaTutto = true;
    }
    this.vecchieRigheDT = data2.DataTable.length;

    // if (eliminaTutto && !t.modalitaRealTimeAttiva2) { 
    if (eliminaTutto) { 
      // // logConsole('Caricamento grafici annullato 3.5');

      // NUOVA QUERY -> PULISCO LE CHARTS
      t.measureDaDisegnare[t.NumeroFrame2] = new Array();
      t.dimeBarra[t.NumeroFrame2] = -1;
      t.datiAppoggio[t.NumeroFrame2] = undefined;
      t.dataInizio[t.NumeroFrame2] = undefined;
      t.dataFine[t.NumeroFrame2] = undefined;
      t.array2[t.NumeroFrame2] = undefined;
      t.folders[t.NumeroFrame2] = undefined;
      t.contaGrafici[t.NumeroFrame2] = undefined;
      t.tmsGrafici[t.NumeroFrame2] = undefined;
      t.altezzaGraficiChart[t.NumeroFrame2] = new Array();
      t.tipoGrafico[t.NumeroFrame2] = new Array();
      // t.larghezzaDiv[t.NumeroFrame2] = -1;
      // t.quantiPuntiGrafico[t.NumeroFrame2] = -1;
      t.chartsGrafici[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
      t.dataPointsAppoggio[t.NumeroFrame2] =  t.creaVettore(t.quantiGraficiMax, undefined);
      // // logConsole('Azzero flag struttura per grafici 2');
      t.giaDisegnataStruttura[t.NumeroFrame2] = false;

      t.larghezzaDiv[t.NumeroFrame2] = -1;
      t.quantiPuntiGrafico[t.NumeroFrame2] = -1;
      t.vecchioaArrayMisure[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
      t.puntiniAppoggio[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
      t.nomiChart[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
      t.nomiGrafici[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
      t.minimo[t.NumeroFrame2] = -1;
      t.massimo[t.NumeroFrame2] = -1;
      t.minimoY[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
      t.massimoY[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
      t.DPNulloVecchio[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, undefined);
      t.DPNullo[t.NumeroFrame2] = t.creaVettore(t.quantiGraficiMax, true);
      t.erroreGrafici[t.NumeroFram2] = '';

      t.aggiornaGrafici[t.NumeroFrame2] = true;
      // NUOVA QUERY -> PULISCO LE CHARTS
    }

    t.Utils.caricamentoGraficiFinito = false;

    if (!data2 || data2 === null) {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Esco per ritorno undefined:', t.NumeroFrame, data2);

      // logConsole('Disegna grafici   8-1 ESCO', t.NumeroFrame2);

      // logConsole('Caricamento grafici annullato 4');
      return;
    }

    t.quantiPuntiGrafico[t.NumeroFrame2] = +data2.v_num_sample;

    /* if (t.larghezzaDiv[t.NumeroFrame2] === -1) {
      // const divGraficoContenitore = document.getElementById('divGrafici_' + t.NumeroFrame2);
      // if (divGraficoContenitore) {
        t.larghezzaDiv[t.NumeroFrame2] = t.larghezzaDiv[t.NumeroFrame2]; // divGraficoContenitore.offsetWidth;

        // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Larghezza div per grafici 2: ', t.NumeroFrame2, t.larghezzaDiv[t.NumeroFrame2]);
      // }
    } */

    // logConsole('Disegna grafici. Larghezza: ', t.NumeroFrame2, larghezzaDiv, data2.DataTable[1].DataPoints.length, t.quantiPuntiGrafico[t.NumeroFrame2]);
    // const quantiPuntini = data2.DataTable[1].DataPoints.length;
    t.dimeBarra[t.NumeroFrame2] = ((larghezzaDiv - 75) / t.quantiPuntiGrafico[t.NumeroFrame2]); // * 1.15;
    if (+t.dimeBarra[t.NumeroFrame2] < 1) { t.dimeBarra[t.NumeroFrame2] = 1; }
    // logConsole('Dimensioni barra', t.NumeroFrame2, larghezzaDiv, t.quantiPuntiGrafico[t.NumeroFrame2], t.dimeBarra[t.NumeroFrame2]);

    if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
      t.Utils.quantiGrafici = 0;

      t.chartsGrafici[t.NumeroFrame2][t.Utils.quantiGrafici] = '';
      // t.Utils.quantiGrafici++;

      t.measureDaDisegnare[t.NumeroFrame2] = new Array();
      t.DPNullo[t.NumeroFrame2] = new Array(); 
      data2.DataTable.forEach(element => {
        let ok = true;
        if (!t.shownEvents2 && element.measr_code === 'events') {
          ok = false;
        }
        if (ok) {
          t.measureDaDisegnare[t.NumeroFrame2].push(element.measr_code)
          t.DPNullo[t.NumeroFrame2].push(true);
        }
      });
      t.measureDaDisegnare[t.NumeroFrame2].push('Last chart'); // TOLTO PER IL MOMENTO
      t.measureDaDisegnare[t.NumeroFrame2].push('Last chart 2'); // TOLTO PER IL MOMENTO
    }

    t.Utils.qualeGrafico = 0;

    const tm1 = setTimeout(() => {
      clearTimeout(tm1);

      const dInizio = data2.v_tms_min;
      const dFine = data2.v_tms_max;

      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Data inizio', dInizio);
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Data fine', dFine);

      t.datiAppoggio[t.NumeroFrame2] = data2.DataTable;
      t.dataInizio[t.NumeroFrame2] = dInizio;
      t.dataFine[t.NumeroFrame2] = dFine;
      // t.array2[t.NumeroFrame2] = array2;
      // t.folders[t.NumeroFrame2] = folders;
      // t.contaGrafici[t.NumeroFrame2] = conta;
      // t.tmsGrafici[t.NumeroFrame2] = sInizio;
      
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lunghezza grafici dati Appoggio ', JSON.stringify(t.datiAppoggio[t.NumeroFrame2]).length);
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lunghezza grafici dati Array2 ', JSON.stringify(t.array2[t.NumeroFrame2]).length);
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lunghezza grafici dati Folders ', JSON.stringify(t.folders[t.NumeroFrame2]).length);

      // logConsole('Disegna grafici   8-4', t.NumeroFrame2, t.datiAppoggio[t.NumeroFrame2]);

      this.disegnaGraficiFunzione(t);

      const min = new Date(dInizio).getTime();
      const max = new Date(dFine).getTime();
            
      this.quantiDisegnati = 0;
      this.quantiNonDisegnati = 0;

      t.numSamples[t.NumeroFrame2] = +data2.v_num_sample;
      t.minimo[t.NumeroFrame2] = min;
      t.massimo[t.NumeroFrame2] = max;
      // this.altezzaDivContenitore = t.divGrafici.nativeElement.offsetHeight - 40;
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza div contenitore', altezzaDivContenitore);

      let inizio = 0;
      t.altezzaGraficiChart[t.NumeroFrame2][0] = 0;

      // const numeroCharts = t.chartsGrafici[t.NumeroFrame2];
      for (let numeroGrafico = inizio; numeroGrafico <= t.quantiGraficiMax; numeroGrafico++) {
        const element2 = t.chartsGrafici[t.NumeroFrame2][numeroGrafico];
        if (element2) {
          // logConsole('Larghezza div grafici 3', t.larghezzaDiv[t.NumeroFrame2]);
          element2.width = t.larghezzaDiv[t.NumeroFrame2];
        }

        if (element2 && element2 !== null && element2 !== '' && element2.canvas && element2.canvas !== null) {
          if (t.puntiniAppoggio[t.NumeroFrame2][numeroGrafico]) {
            if (t.DPNulloVecchio[t.NumeroFrame2][numeroGrafico] === true && t.DPNullo[t.NumeroFrame2][numeroGrafico] === true) {
              t.altezzaGraficiChart[t.NumeroFrame2][numeroGrafico] = 0;
              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Grafico nullo', numeroGrafico);
            } else {
              // altezze.push(this.calcoloAltezza(t, numeroGrafico));
              t.altezzaGraficiChart[t.NumeroFrame2][numeroGrafico] = altezzaDiv; // this.calcoloAltezza(t, numeroGrafico);

              // logConsole('Disegno misura', t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico]);
              this.disegnaGraficiAVideo(t, numeroGrafico);
            }
          }
        } else {
          // if (!t.modalitaRealTimeAttiva2) {
            // altezze.push(0);
            t.altezzaGraficiChart[t.NumeroFrame2][numeroGrafico] = 0;
          // }
        }
      };

      // Disegno selezione di tutti i grafici
      const tm = setTimeout(() => {
        clearTimeout(tm);

        this.disegnaSelezioneGrafici(t, t.dateFrom, true, 'Ciclo1');
      }, 500);

      if (t.giaDisegnataStruttura[t.NumeroFrame2] === false) {
        // t.giaDisegnataStruttura[t.NumeroFrame2] = true;
      }       

      this.calcolaAltezzaTotale(t);

      t.caricamentoDatiInCorsoMC[t.NumeroFrame2] = false;    
    }, 100);
  }
  calcolaAltezzaTotale(t) {
    t.altezzaTotaleGrafici[t.NumeroFrame2] = 0;
    let i = 0;
    let aumento = 1;
    if (t.debug2) {
      aumento = 5;
    }
    t.altezzaGraficiChart[t.NumeroFrame2].forEach(element => {
      if (element) {
        if (t.graficoVisibile[t.NumeroFrame2][i]) {
          t.altezzaTotaleGrafici[t.NumeroFrame2] += (element + aumento);  
        }
      }
      i++;
    });
    t.altezzaTotaleGrafici[t.NumeroFrame2] += 30;

    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza totale', t.altezzaGraficiChart[t.NumeroFrame2], t.altezzaTotaleGrafici[t.NumeroFrame2]);
  }

  disegnaGraficiFunzione(t) {
    if (!t.datiAppoggio[t.NumeroFrame2]) {
      return;
    }

    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati arrivati al grafico', t.datiAppoggio[t.NumeroFrame2], t.shownEvents2);

    this.quantiNulli = 0;
    // t.nomiGrafici[t.NumeroFrame2] = new Array();
    // t.DPNullo[t.NumeroFrame2] = new Array();
    // t.dataPointsAppoggio[t.NumeroFrame2] = new Array();
    // t.minimoY[t.NumeroFrame2] = new Array();
    // t.massimoY[t.NumeroFrame2] = new Array();

    t.tipoGrafico[t.NumeroFrame2] = new Array();

    let n = 0;
    if (t.shownEvents2) {
      t.datiAppoggio[t.NumeroFrame2].forEach(element => {
        if (element.measr_code === 'events') {
          t.nomiGrafici[t.NumeroFrame2][0] = element.display_name;
          t.tipoGrafico[t.NumeroFrame2].push(-1);
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Grafico eventi');
          // t.measureDaDisegnare[t.NumeroFrame2].push(element.measr_code);
          if (this.creaGraficoEventiDaJSON(t, element, t.folders[t.NumeroFrame2], t.contaGrafici[t.NumeroFrame2], t.dataInizio[t.NumeroFrame2], t.dataFine[t.NumeroFrame2]) === 1) {
            n++;
          }
        }
      });
    }

    // t.array2[t.NumeroFrame2].forEach(element2 => {
      t.datiAppoggio[t.NumeroFrame2].forEach(element => {
        if (element.measr_code !== 'events') {
          t.nomiGrafici[t.NumeroFrame2][n] = element.display_name;
          t.tipoGrafico[t.NumeroFrame2].push(-1);
          // if (element2 === element.measr_code) {
          // this.stampaTempoImpiegato('Grafico ' + element2);
          this.creaGraficoDaJSON(t, n, element, t.dataInizio[t.NumeroFrame2], t.dataFine[t.NumeroFrame2]);
          n++;
        }
      });
    // });

    // logConsole('Disegna grafici   8.5', t.NumeroFrame2);

    // t.applicaModifiche();

    // this.stampaTempoImpiegato('Rendering');
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Rendering grafici', dInizio, dFine);
    this.disegnaGraficiFinali(t, t.dataInizio[t.NumeroFrame2], t.dataFine[t.NumeroFrame2], t.tmsGrafici[t.NumeroFrame2], false);
  }

  disegnaGraficiFinali(t, dInizio, dFine, tms, refresh) {
    if (t.giaDisegnataStruttura[t.NumeroFrame2]) {
      return;
    }

    // logConsole('Disegna grafici   8.6', t.NumeroFrame2);

    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Grafici creati:', GestioneGrafici.charts, t.Utils);
    let index = 0;
    let inizio = -1;
    // let lastElement;
    let lastIndex = -1;
    t.chartsGrafici[t.NumeroFrame2].forEach(element2 => {
      if (t.chartsGrafici[t.NumeroFrame2][index] === '') {
        t.chartsGrafici[t.NumeroFrame2][index] = undefined;
      } else {
        if (t.chartsGrafici[t.NumeroFrame2][index] !== undefined &&
            t.chartsGrafici[t.NumeroFrame2][index] !== null) {
          if (inizio === -1) {
            inizio = index;
          }
          lastIndex = index;
        }
      }
      index++;
    });

    inizio = 0;
    index = 0;

    // const stampaTempoSuTutti = t.debug2;
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, GestioneGrafici.charts);
    let min = new Date(dInizio).getTime();
    let max = new Date(dFine).getTime();

    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Lunghezza document', document.getElementsByClassName('canvasjs-chart-toolbar').length);

    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Asse', t.Utils.axisXMaxMin);
    let ultimo = -1;

    // logConsole('Disegna grafici   8.7', t.NumeroFrame2, min, max);

    t.chartsGrafici[t.NumeroFrame2].forEach(element2 => {
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Element2:', element2.canvas);
      if (element2 && element2 !== null && element2 !== '' && element2.canvas && element2.canvas !== null &&
        t.tipoGrafico[t.NumeroFrame2][index] !== 3) {
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Creo grafico', index);
          // lastIndex = index;
          
          let quale = -1;
          if (index === inizio) {
            // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Metto tms', index, inizio, t.Utils.axisXConTempoVisibile);
            element2.options.axisX = t.axisXConTempoVisibile;
            quale = 1;
          } else {
            if (t.measureDaDisegnare[t.NumeroFrame2][index] === 'act_distance') {
              element2.options.axisX = t.axisXConValueVisibile; // axisXSenzaTempoVisibile; QUI
              quale = 2;

              min = 0;
              max = 0.001;
            } else {
              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: NON Metto tms', index, inizio);
              // if (stampaTempoSuTutti === true) {
              //   element2.options.axisX = t.axisXConTempoVisibile; // axisXSenzaTempoVisibile; QUI
              //   altro = 40;
              // } else {
                // element2.options.axisX = t.axisXSenzaTempoVisibile; // axisXSenzaTempoVisibile; QUI
                quale = 3;
              // }
            }
          }
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'AxisX: ', index, quale, element2.options.axisX);

          // // logConsole('*6* Assi', index, min, max)

          // element2.options.axisX.viewportMinimum = min; TOLTO
          // element2.options.axisX.viewportMaximum = max;

          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Ora minima: ', dInizio, min,);
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Ora massima: ', dFine, max);

          // element2.options.axisX.minimum = min; // QUI 07/10/2025
          // element2.options.axisX.maximum = max;

          // t.axisX[t.NumeroFrame2][index] = element2.options.axisX;

          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.tipoGrafico[index]);

          // t.altezzaGrafici[index] = this.calcoloAltezza(t, index);
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.frameAttivo, t.NumeroFrame, index, t.altezzaGrafici[index]);

          // if (dInizio > -1 && dFine > -1) {
          // if (dInizio && dFine) {
            // let min = new Date(dInizio).getTime();
            // let max = new Date(dFine).getTime();

            // min =  t.datePipe.transform(min, 'yyyy-MM-dd HH:mm:ss');
            // max =  t.datePipe.transform(max, 'yyyy-MM-dd HH:mm:ss');

            // element2.options.axisX.viewPortMinimum = min;
            // element2.options.axisX.viewPortMaximum = max;
            // element2.options.axisX.minimum = min; // QUI
            // element2.options.axisX.maximum = max;

            // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, index, min, max);
          // }
          /* } else {
            element2.options.data[0].dataPoints.forEach(element => {
              if (+element.x < dInizio || dInizio === -1) {
                dInizio = +element.x;
              }
              if (+element.x > dFine) {
                dFine = +element.x;
              }
            });
            element2.options.axisX.viewportMinimum = dInizio;
            element2.options.axisX.viewportMaximum = dFine;
          } */

          // try {
          if (t.Utils.axisXMaxMin && t.Utils.axisXMaxMin[t.NumeroFrame2] && t.Utils.axisXMaxMin[t.NumeroFrame2][t.frameAttivo2] &&
             t.Utils.axisXMaxMin[t.NumeroFrame2][t.frameAttivo2][index]) {
            t.Utils.axisXMaxMin[t.NumeroFrame2][t.frameAttivo2][index] = {...element2.options.axisX};
          }
          
          // } catch (e) {
            // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ERRORE ASSE GRAFICI: ', t.frameAttivo2, t.NumeroFrame2, index, e, t.Utils.axisXMaxMin);
          // }

          // requestAnimationFrame(function() {
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2);
          if (element2 && element2.canvas && element2.canvas !== null) {
            // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Eseguo render');
            // lastElement = {...element2};
            // ultimo = index;

            // element2.render();

            // element2.set('dataPointWidth', Math.ceil(element2.axisX[0].bounds.width / element2.data[0].dataPoints.length), true);
          }
        // });

          // GestioneGrafici.spegneBottoni(index);

          index++;
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Eseguito rendering grafico ', index, new Date());
        } else {
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2);
          // t.altezzaGraficiChart[t.NumeroFrame2][index] = 0;
          
          if (element2 && element2.container && element2.container !== null) {
            // requestAnimationFrame(function() {
              element2.destroy();
            // });
          }
        }

      // const tm = setTimeout(() => {
      //     clearTimeout(tm);
      // }, 100);
    });

    // logConsole('Disegna grafici   8.8', t.NumeroFrame2);

    // GestioneGrafici.spegneBottoni();

    // Aggiunge orario all'ultima chart (TOLTO PER IL MOMENTO)
    /* if (lastElement !== undefined) {
      const nomeChart = 'chartContainers_' + t.frameAttivo2 + '_' +
          t.NumeroFrame2 + '_' + index;
      t.nomiChart[t.NumeroFrame2][index] = nomeChart;

      // logConsole('Disegna grafici   8.9', t.NumeroFrame2, nomeChart);

      // t.altezzaGraficiChart[t.NumeroFrame2][index] = 30;

      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Nome grafico ora', nomeChart, index, dInizio, dFine);
      const x = t.axisXConTempoVisibile;

      let min = new Date(dInizio).getTime();
      let max = new Date(dFine).getTime();

      // min =  t.datePipe.transform(min, 'yyyy-MM-dd HH:mm:ss');
      // max =  t.datePipe.transform(max, 'yyyy-MM-dd HH:mm:ss');

      // // logConsole('*7* Assi', index, min, max)

      // x.viewportMinimum = min; TOLTO
      // x.viewportMaximum = max;

      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Ora minima: ', dInizio, min,);
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Ora massima: ', dFine, max);

      // x.minimum = min; // QUI 07/10/2025
      // x.maximum = max;

      const riga = [{ x: 0, y: 100, color: '#000', label: '', x2: '-' }];
      const app = {
        name: '',
        dataPoints: riga,
        type: 'column',
        click: this.onClick2.bind(null, t),
      };

      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PUNTINI 2: ', app);

      const nuovoGrafico = {
        height: 35,
        title: { text: '', fontSize: 10 , fontFamily: 'Arial', margin: -2 },
        zoomEnabled: true,
        dataPointWidth: t.dimeBarra[t.NumeroFrame2],
        axisX: x,
        // width: t.larghezzaDiv[t.NumeroFrame2],
        zoomType: 'x', // change it to "xy" to enable zooming on both axes
        // dataPointWidth: 10,
        data: [app]
      };
      // t.axisX[t.NumeroFrame2][index] = x;

      // lastElement.options.text = '';

      // const cjs = new t.canvasJS();
      t.chartsGrafici[t.NumeroFrame2][index] = new t.CanvJS.Chart(nomeChart, nuovoGrafico);
      // if (dInizio > -1 && dFine > -1) {
      //   GestioneGrafici.charts[index].options.axisX.viewportMinimum = dInizio;
      //   GestioneGrafici.charts[index].options.axisX.viewportMaximum = dFine;
      // }
      // t.altezzaGraficiChart[t.NumeroFrame2][index] = 25;
      // alert(t.NumeroFrame2 + '->' + index);

      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Grafici creati:', nomeChart, index, t.chartsGrafici[t.NumeroFrame2]); // , t.Utils);
  
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza grafici 2: ', t.heightChart2);

        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza grafici 2. Moltiplicatore: ', moltiplicatore, index, t.altezzaGrafici[index]);
      // }

      t.tipoGrafico[t.NumeroFrame2][index] = 3;
      if (t.chartsGrafici[t.NumeroFrame2][index] && t.chartsGrafici[t.NumeroFrame2][index].canvas &&
        t.chartsGrafici[t.NumeroFrame2][index].canvas !== null) {

        try {
          t.chartsGrafici[t.NumeroFrame2][index].render();
        } catch (e) {
          // console.error('Errore su render chart 6: ', t.chartsGrafici[t.NumeroFrame2]);
        }

        // GestioneGrafici.charts[index].set('dataPointWidth', Math.ceil(GestioneGrafici.charts[index].axisX[0].bounds.width / GestioneGrafici.charts[index].data[0].dataPoints.length), true);
      }
    } */

    GestioneGrafici.spegneBottoni();
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, GestioneGrafici.charts);

    // console.log (this.tipoGrafico,
    //   t.altezzaGrafici);

    // this.disegnaSelezioneGrafici(t, tms);

    // const tm1 = setTimeout(() => {
    //   clearTimeout(tm1);
      // GestioneGrafici.disegnaSelezione(t, tms, false);

      const tm2 = setTimeout(() => {
        clearTimeout(tm2);

        t.chartsGrafici[t.NumeroFrame2].forEach(element => {
          if (element && element.canvas) {
            try {
              element.render();
            } catch (e) {
              // console.error('Errore su render chart 2: ', t.chartsGrafici[t.NumeroFrame2]);
            }

            // element.set('dataPointWidth', Math.ceil(element.axisX[0].bounds.width / element.data[0].dataPoints.length), true);
          }
        });

        const tm = setTimeout(() => {
          clearTimeout(tm);
          const p = document.getElementById('divGrafici'); // pannelloGrafici_' + t.NumeroFrame2);
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Altezza grafico', p.scrollTop);
          if (t.Utils.altezzaDivGrafici > 0) {
            // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Imposto altezza div grafici', t.Utils.altezzaDivGrafici);
            p.scrollTop = t.Utils.altezzaDivGrafici;
          }

          // GestioneGrafici.disegnaSelezione(t, tms, false);
        }, 100);
      }, 1000);
    // }, 1000);

  }

  calcoloAltezza(t, index) {
    let daMoltiplicare = false;
    let altro = 0;
    let altezza = -1;

    /* if (index === 0 && t.shownEvents2) {
      if (t.tipoGrafico[t.NumeroFrame2][index] === 2) {
        altezza = 85 + altro;
      } else {
        if (t.tipoGrafico[t.NumeroFrame2][index] === 3) {
          altezza = 105 + altro;
        } else {
          altezza = 105 + altro;
        }
      }
    } else {
      if (t.tipoGrafico[t.NumeroFrame2][index] === 2) {
        if (index === 0) {
          altezza = 50 + altro;
        } else {
          altezza = 30 + altro;
        }
      } else {
        if (t.tipoGrafico[t.NumeroFrame2][index] === 3) {
          if (index === 0) {
            altezza = 45 + altro;
          } else {
            altezza = 25 + altro;
          }
        } else {
          if (index === 0) {
            altezza = 75 + altro;
          } else {
            altezza = 55 + altro;
          }
          daMoltiplicare = true;
        }
      }
    }

    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza grafici: ', t.heightChart2, index, t.altezzaGrafici[index], t.tipoGrafico[t.NumeroFrame2][index]);
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza grafici. ', t.heightChart, t.heightChart2, altezza, daMoltiplicare)
    if (daMoltiplicare) {
      if (t.heightChart2 === undefined) {
        if (t.heightChart !== undefined) {
          t.heightChart2 = t.heightChart;
        }
      }

      if (t.heightChart2 !== 'X1') {
        let moltiplicatore = 1;

        switch(t.heightChart2) {
          case 'X2':
            moltiplicatore = 2;
            break;
          case 'X3':
            moltiplicatore = 3;
            break;
          case 'X4':
            moltiplicatore = 4;
            break;
        }

        altezza *= moltiplicatore;
        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Altezza grafici. Moltiplicatore: ', t.NumeroFrame2, t.heightChart2, moltiplicatore, index, altezza);
      }
    }

    if (t.debug2) {
      altezza += 30;
    } */
    
    return altezza;
  }

  
  creaGraficoEventiDaJSON(t, elemento, folders, conta, dInizio, dFine) {
    if (t.shownEvents2 === false) {
      return;
    }

    let dataPoints = elemento.DataPoints;
    const tipo = elemento.measr_type;
    const code = elemento.measr_code;
    const display_name = elemento.display_name;
    const puntini = new Array();
    const jsonEventi = new Array();

    
    if (!dataPoints || dataPoints === null) {
      // return;
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Datapoints nullo', numeroGrafico, elemento);
      dataPoints = [];
      this.quantiNulli++;
      t.DPNullo[t.NumeroFrame2][0] = true;
    } else {
      t.DPNullo[t.NumeroFrame2][0] = false;
    }

    const righe = new Array();
    let index = 0;
    const differenzaFraRighe = 1;
    // t.titoloChart = new Array();
    /* if (t.debug2 === true) {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Punti per grafico eventi', dataPoints.length);
    } */
    let qualeFolder = 0;
    if (righe[qualeFolder] === undefined) { righe[qualeFolder] = ''; }
    conta[qualeFolder] = 0;

    let inc = 0;
    let dataPointsEventi = "";
    const quante = dataPoints.length;
    dataPoints.forEach(element2 => {
      // if (index > 0) {
        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2);
        // return;
        const tms2 = element2.tms;
        const icona = element2.icon;
        const coloreback = element2.bck_color;
        const colorefore = element2.fore_color;
        const info = element2.event_type.trim();
        const folder = element2.event_type;
        let altezza = 1;
        for (let i = 0; i < folders.length; i++) {
          if (folders[i] === folder) {
            altezza = ((i - 1) * differenzaFraRighe);
            qualeFolder = i;
          }
        }
        const tt = Date.parse(tms2);
        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tms2);
        
        // // logConsole(qualeFolder, altezza);
        let indexLabel = '';
        if (+altezza === 0) {
          indexLabel = ', "indexLabel": "_", "indexLabelFontColor": "black", "indexLabelOrientation": "vertical", "indexLabelPlacement": "outside"';
        } else {
          if (quante > 29) {
            indexLabel = ', "indexLabel": "", "indexLabelFontColor": "black", "indexLabelOrientation": "horizontal", "indexLabelPlacement": "outside"';
          } else {
            indexLabel = ', "indexLabel": "' + info + '", "indexLabelFontColor": "black", "indexLabelOrientation": "horizontal", "indexLabelPlacement": "outside"';
          }
        }
        conta[qualeFolder]++;
        // t.titoloChart.push(info);

        righe[qualeFolder] += '{ "x": ' + tt + ', "y": ' + (altezza + inc) + ', "markerType": "' + icona + '", "markerColor": "' + coloreback +
                  '", "markerSize": 7, "label": "' + info + '", "x2": "' + tms2.replace("T", " ") + '", "conta": ' + conta[qualeFolder] + 
                  ', "desc": "' + info + '", "markerBorderColor": "' + colorefore + '", ' +
                  '"markerBorderThickness": 1 },';
        const avanzamento = 0; // 1000; // 75000 + (70000 * (info.length - 1));
        dataPointsEventi += '{ "x": ' + (tt + avanzamento) + ', "y": ' + ((altezza + inc) + 1) + ' ' + indexLabel + ' },';

        inc++;
        if (inc > 4) { inc = 0; }
                  // }
      index++;
    });
    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici eventi. Titolo:', t.titoloChart);
    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici eventi. Datapoints:', dataPoints);
    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici eventi. Numero Righe:', righe.length);
    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici eventi. Righe:', righe);

    let dpe;
    righe.forEach(element => {
      if (element.length > 3) {
        element = element.substring(0, element.length - 1);
        element = '[' + element + ']';
        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);

        /* const buttami = JSON.parse(element);
        buttami.forEach(element2 => {
          // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element2.conta, element2.x2);
        }); */

        try {
          jsonEventi.push(JSON.parse(element));
        } catch (e) {
          console.error('Disegno Grafici eventi. Conversione json eventi', element, e);
        }

        dataPointsEventi = dataPointsEventi.substring(0, dataPointsEventi.length - 1);
        dataPointsEventi = '[' + dataPointsEventi + ']';

        try {
          dpe = JSON.parse(dataPointsEventi);
        } catch (e) {
          console.error('Disegno Grafici eventi. Conversione json eventi label', dataPointsEventi, e);
        }
      // } else {
        // const riga = JSON.parse('[{"x": 0, "y": 0, "markerType": "", "markerColor": "", "markerSize": 7, "label": "",
        // "x2": "", "indexLabel": "", "conta": -1, "folder": -1 }]');
        // jsonEventi.push(riga);
      }
    });

    if (righe.length > 0) {
      if (jsonEventi !== null) {
        const puntini2 = new Array();
        jsonEventi.forEach(element => {
          // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
          const app1 =
            {
              'name': 'Folders',
              'type': 'line',
              // 'indexLabel': '{indexLabel}',
              'indexLabelOrientation': 'vertical',
              'indexLabelFontColor': '#808080',
              'indexLabelFontSize': '10',
              'lineColor': 'transparent',
              'indexLabelFormatter': function(e) {
                return ''; // e.dataPoint.desc; // folders[e.dataPoint.folder];
                /* const disegna = e.dataPoint.conta % 3;
                if (disegna === 1) {
                  return e.dataPoint.desc; // folders[e.dataPoint.folder];
                } else {
                  return '';
                } */
              },
              'click': this.onClick.bind(null, t),
              'dataPoints': element,
            };
          const app2 =
            {
              'type': "scatter",
              'markerType': "none",
              'markerSize': 20,
              'toolTipContent': null,
              'dataPoints': dpe  
            };
          puntini2.push(app1);
          puntini2.push(app2);
          t.dataPointsAppoggio[t.NumeroFrame2][0] = puntini2;
        });

        logConsole('PUNTINI', puntini2);

        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, puntini);

        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, folders);
        const contentToolTip = { content: '{label}', cornerRadius: 4 };
        const fontColor = 'transparent';

        const axisY = {
          fontWeight: 'normal',
          fontFamily: 'arial',
          fontSize: 10,
          interval: 1,
          /* labelFormatter: function (e) {
            let f = folders[e.value];
            if (f === undefined) {
              f = '';
            }
            return f; // CanvasJS.formatDate( e.value, 'hh:mm:ss.SSS');
          },
          title: 'Events', */
          titleWrap: false,
          titleFontColor: '#aaaaaa',
          lineColor: t.Utils.axisColor,
          gridColor: t.Utils.axisColor,
          labelFontColor: fontColor,
          valueFormatString: '000',
          tickColor: t.Utils.axisColor,
          minimum: 0,
          maximum: jsonEventi.length + 1
        };
        t.minimoY[t.NumeroFrame2][0] = 0;
        t.massimoY[t.NumeroFrame2][0] = 6; // jsonEventi.length + 1;
        // t.axisY[t.NumeroFrame2][0] = axisY;

        // t.Utils.altezzaGrafico[numeroGrafico] = 150;

        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Creo struttura grafico eventi', t.NumeroFrame);

        // this.tipoGrafico[0] = 3;
        // t.altezzaGrafici[0] = 75;

        const nomeChart = 'chartContainers_' + t.frameAttivo2 + '_' +
            t.NumeroFrame2 + '_0'; // t.Utils.contatoreGrafici;
        t.nomiChart[t.NumeroFrame2][0] = nomeChart;

        // logConsole('Disegna grafici  chart: ', nomeChart);

        t.puntiniAppoggio[t.NumeroFrame2][0] = puntini2;

        // // logConsole('EVENTI', puntini2);

        // if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
          this.creaStrutturaGrafico(t, 0, nomeChart, contentToolTip, axisY,
              puntini2, 'EVENTS', 'Events', dInizio, dFine);
        // } else {
          // this.aggiornaGrafici(t, 'EVENTS', 0, puntini2);
          // this.puntiniAppoggio[0] = puntini2;
        // }
        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lunghezza grafici dati Chart: ', JSON.stringify(t.chartsGrafici[t.NumeroFrame2]).length);

          // this.spegneBottoni(numeroGrafico);
        // t.Utils.altezzaGrafico[t.frameAttivo][t.NumeroFrame][0] = 100;
        return 1;
      } else {
        // GestioneGrafici.charts[0] = '';
        return 0;
      }
    } else {
      // GestioneGrafici.charts[0] = '';
      return 0;
    }
  }

  creaGraficoDaJSON(t, numeroGrafico, elemento, dInizio, dFine) {
    let dataPoints = elemento.DataPoints;
    const tipo = elemento.measr_type;
    const code = elemento.measr_code;
    const display_name = elemento.display_name;
    const puntini = new Array();

    if (!dataPoints || dataPoints === null) {
      // return;
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Datapoints nullo', numeroGrafico, elemento);
      dataPoints = [];
      this.quantiNulli++;
      t.DPNullo[t.NumeroFrame2][numeroGrafico] = true;
      t.dataPointsAppoggio[t.NumeroFrame2][numeroGrafico] = [{dataPoints: dataPoints}];
    } else {
      t.DPNullo[t.NumeroFrame2][numeroGrafico] = false;
    }

    const righe = new Array();
    let oldtms = '';
    let minimo = 99999;
    let massimo = -99999;
    let epoch;
    let colore;
    let value;

    const dataPerOffset = new Date();
    const offset = Math.abs(dataPerOffset.getTimezoneOffset() * 60);

    let alzaAbbassaLimite = false;

    dataPoints.forEach(element => {
      let v = element.value;

      if (v && v !== '' && v !== 'NoValue') {
        // v = -9999;
      } else {
        if (v === null || v === 'transparent' || v === '"transparent"') {
          v = -9999;
        } else {
          v = 0;
        }
      }
      
      /* if (display_name === 'Gps Accuracy [m]') {
        // logConsole('Numero grafico: ' + numeroGrafico + ' tms: ' + element.tms + ' Value: ' + element.value + ' Value Impostato: ' + v);
      } */

      let tms = element.tms;
      if (tms === '') {
        tms = oldtms + 1;
      } else {
        oldtms = tms;
      }

      // tms = t.datePipe.transform(tms, 'yyyy-MM-dd HH:mm:ss');
      /* const tt = Date.parse(tms);
      const epoch = new Date(tt).getTime(); */
      // epoch = (element.epoch - offset) * 1000;

      colore = element.color;
      value = element.value;
      let tms2 = tms.replace('T', ' ');

      // MESSO PERCHE' NON FACEVA VISUALIZZARE CORRETTAMENTE ALCUNE ACTIVITIES
      epoch = new Date(tms2).getTime();
      // MESSO PERCHE' NON FACEVA VISUALIZZARE CORRETTAMENTE ALCUNE ACTIVITIES
      
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, numeroGrafico, v);
      if (+tipo === 1) {
        let riga;
        if (+v === 0) {
          /* if (display_name === 'Gps Accuracy [m]') {
            // logConsole('Messo 0', numeroGrafico, tms2, epoch, v);
          } */
          riga = { x: epoch, y: .1, color: 'transparent', label: value, x2: tms2, indexLabel: '_',
            indexLabelFontColor: "black", indexLabelOrientation: "horizontal", indexLabelPlacement: "inside" };
          
          alzaAbbassaLimite = true;
        } else {
          if (v === -9999) {
            riga = { x: epoch, y: 0, color: colore, label: value, x2: tms2 };
          } else {
            if (v > massimo) {
              massimo = v;
            }
            if (v < minimo) {
              minimo = v;
            }
            riga = { x: epoch, y: +v, color: colore, label: value, x2: tms2 };
          }
        }
        righe.push(riga);
      } else {
        const riga = { x: epoch, y: 100, color: colore, label: value, x2: tms2, xConv: new Date(epoch) };
        righe.push(riga);
      }
    });
    if (minimo > 0) { minimo = 0 };

    // logConsole('Disegna grafici   8.4.1', t.NumeroFrame2, righe);

    if (alzaAbbassaLimite) {
      // if (minimo <= 0) { minimo -= 2; } else { massimo += 2;}
      minimo -= 2;
    }

    /* if (display_name === 'Gps Accuracy [m]') {
      // logConsole('Limiti', numeroGrafico, minimo, massimo);
    }
    if (display_name === 'Gps Accuracy [m]') {
      // logConsole(righe);
    } */

    if (display_name === 'Distance [km]') {
      minimo = 0;
      massimo = 0.001;
    }

    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati grafico', numeroGrafico, display_name, minimo, massimo, righe);

    if (righe.length > 0) {
      let tipoGrafico;
      if (+tipo === 1) {
        tipoGrafico = 'column';
      } else {
        tipoGrafico = 'column';
      }

      t.titoloChart.push(display_name);

      /*  if (t.debug2 === true) {
        // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, display_name);
        // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tipo);
        // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righe);
      }

      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame2, display_name, righe); */
      
      const app = {
        'name': code,
        'dataPoints': righe,
        'type': tipoGrafico,
        'click': this.onClick.bind(null, t),
      };
      puntini.push(app);
      t.dataPointsAppoggio[t.NumeroFrame2][numeroGrafico] = [app];
    } else {
      const riga = [{ x: 0, y: 0, color: '#000', label: '', x2: '-', indexLabel: '0',
        indexLabelFontColor: "red", indexLabelOrientation: "vertical", indexLabelPlacement: "inside" }];

      const app = {
        'name': display_name,
        'dataPoints': riga,
        'type': 'column',
        'click': this.onClick.bind(null, t),
      };
      puntini.push(app);
    }

    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'GRAFICO', t.NumeroFrame2, numeroGrafico, t.dataPointsAppoggio[t.NumeroFrame2][numeroGrafico]);

    let axisY;
    let axisColor;
    let fontColor;
    let contentToolTip;

    if (display_name.toUpperCase().indexOf('RSSI') > -1 ||
      display_name.toUpperCase().indexOf('RSRP') > -1 ||
      display_name.toUpperCase().indexOf('RSCP') > -1 ||
      display_name.toUpperCase().indexOf('RXLEV') > -1) {
      massimo = -35;
      minimo  = -120;
    }

    if (t.debug2 === true) {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Tipo grafico', display_name, tipo, massimo);
    }

    // logConsole('Disegna grafici   8.4.2', t.NumeroFrame2, tipo);

    if (+tipo === 1) {
      t.tipoGrafico[t.NumeroFrame2][numeroGrafico] = 1;
      // altezza = 30;
      contentToolTip = { content: '{x2}<br />' + display_name + ': {label}', cornerRadius: 4 };
      axisColor = '#c6c6c6';
      fontColor = '#aaaaaa';
      if (righe.length === 0) {
        axisY = {
          fontWeight: 'normal',
          fontFamily: 'arial',
          fontSize: 10,
          // title: display_name,
          titleWrap: false,
          titleFontColor: 'transparent',
          lineColor: 'transparent',
          gridColor: 'transparent',
          labelFontColor: 'transparent',
          valueFormatString: '000',
          tickColor: 'transparent',
          minimum: -100,
          maximum: 100
        };
        t.minimoY[t.NumeroFrame2][numeroGrafico] = -100;
        t.massimoY[t.NumeroFrame2][numeroGrafico] = 100;
        // t.axisY[t.NumeroFrame2][numeroGrafico] = axisY;
        // // logConsole('ASSE Y 1');
        // // logConsole('Grafico 0 ' + numeroGrafico, display_name, -100, 100);
      } else {
        t.tipoGrafico[t.NumeroFrame2][numeroGrafico] = 1;
        axisY = {
          fontWeight: 'normal',
          fontFamily: 'arial',
          fontSize: 10,
          // title: display_name,
          titleWrap: false,
          titleFontColor: '#aaaaaa',
          lineColor: axisColor,
          gridColor: axisColor,
          labelFontColor: fontColor,
          valueFormatString: '000',
          tickColor: 'transparent'
        };

        if (massimo === -99999) {
          // Messo per visualizzare le barrette in caso di grafico vuoto
          minimo = -1;
          massimo = 5;
        }
        // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Min/Max grafico ', numeroGrafico, t.measureDaDisegnare[t.NumeroFrame2][numeroGrafico], minimo, massimo)
        // if (minimo) {
          axisY['minimum'] = minimo;
          t.minimoY[t.NumeroFrame2][numeroGrafico] = minimo;
        // }
        // if (massimo) {
          axisY['maximum'] = massimo;
          t.massimoY[t.NumeroFrame2][numeroGrafico] = massimo;
        // }
        // t.axisY[t.NumeroFrame2][numeroGrafico] = axisY;
        // // logConsole('ASSE Y 2');
        // // logConsole('Grafico 1 ' + numeroGrafico, display_name, minimo, massimo);
      }
    } else {
      t.tipoGrafico[t.NumeroFrame2][numeroGrafico] = 2;
      contentToolTip = { content: '{x2}<br />' + display_name + ': {label}', cornerRadius: 4 };
      axisColor = 'transparent';
      fontColor = 'transparent';
      axisY = {
        fontWeight: 'normal',
        fontFamily: 'arial',
        fontSize: 10,
        maximum: 1,
        // title: display_name,
        titleWrap: false,
        titleFontColor: '#aaaaaa',
        lineColor: axisColor,
        gridColor: axisColor,
        labelFontColor: fontColor,
        valueFormatString: '000',
        tickColor: 'transparent'
      };
      t.minimoY[t.NumeroFrame2][numeroGrafico] = 0;
      t.massimoY[t.NumeroFrame2][numeroGrafico] = 1;
      // t.axisY[t.NumeroFrame2][numeroGrafico] = axisY;
      // // logConsole('ASSE Y 3');
      // // logConsole('Grafico 2 ' + numeroGrafico, display_name, 0, 1);
    }
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, display_name, axisY);

    const nomeChart = 'chartContainers_' + t.frameAttivo2 + '_' +
      t.NumeroFrame2 + '_' + numeroGrafico; // t.Utils.contatoreGrafici;
    t.nomiChart[t.NumeroFrame2][numeroGrafico] = nomeChart;

    t.puntiniAppoggio[t.NumeroFrame2][numeroGrafico] = puntini;
    
    // logConsole('Disegna grafici   8.4.3', t.NumeroFrame2, nomeChart, t.measureDaDisegnare[t.NumeroFrame2], t.giaDisegnataStruttura[t.NumeroFrame2]);

    // // logConsole('Grafici: Già disegnata struttura', t.giaDisegnataStruttura[t.NumeroFrame2]);

    if (!t.giaDisegnataStruttura[t.NumeroFrame2]) {
      this.creaStrutturaGrafico(t, numeroGrafico, nomeChart, contentToolTip, axisY,
        puntini, 'GRAPHICS', display_name, dInizio, dFine);
    // } else {
    //   this.aggiornaGrafici(t, 'GRAPHICS', numeroGrafico, puntini);
    //   this.puntiniAppoggio[numeroGrafico] = puntini;
    }
  }

  onClick(t, e) {
    // ExternalUtilities.messaggioDiErrore(t, e.dataSeries.type + ', dataPoint { x:' + e.dataPoint.x + ', y: '+ e.dataPoint.y + ' }' );
    // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e);
    // this.tmsSelezionato = e.dataPoint.x;

    // GestioneGrafici.disegnaSelezione(t, e.dataPoint.x, true);
  }

  disegnaSelezioneGrafici(t, tms, esegueRender, daDove) {
    if (!t.frameVisible2) {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    // return;

    // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Disegno selezione grafici', t.NumeroFrame2, tms);
    /* if (t.modalitaRealTimeAttiva2 === true) {
      // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Disegno selezione grafici. Esco per real time attivo', t.NumeroFrame2, t.modalitaRealTimeAttiva2);

      return;
    } */

    // return;

    if (!tms || tms === null || tms === 'null' || tms === 'nullo') {
      return;
    }

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGrafico2 === 'MC' && aperto === true) {
    */
    if (t.MappaOGrafico2 === 'MC') {
      const inizio = new Date().getTime();
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Render stripline inizio: ', inizio);

      tms = t.datePipe.transform(tms, 'yyyy-MM-dd HH:mm:ss');
      tms = tms.replace('Z', ' ').replace('T', ' ') ;

      const tt = new Date(tms).getTime();
      if (t.chartsGrafici[t.NumeroFrame2] && t.chartsGrafici[t.NumeroFrame2].length > 0) {
        t.aggiornaGrafici[t.NumeroFrame2] === true;
        let index = 0;

        t.chartsGrafici[t.NumeroFrame2].forEach(element => {
          // if (element !== null && element !== undefined && element !== '') {
            // // logConsole('ELEMENTO', index, element);
            // if (element && element.options) {
              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
              let diff = 1;

              /* if (element.options.axisX.viewPortMaximum) {
                diff =
                  new Date(element.options.axisX.viewPortMaximum).getTime() -
                  new Date(element.options.axisX.viewPortMinimum).getTime();
    
                  element.options.axisX.maximum = element.options.axisX.viewPortMaximum;
                  element.options.axisX.minimum = element.options.axisX.viewPortMinimum;
    
                  // // logConsole('*21* Assi ' + index, element.options.axisX.viewPortMinimum, element.options.axisX.viewPortMaximum)
                  index++;
              } else {
                if (element.options.axisX.minimum) { */
                let colore = '#000';
                if (element && element.options && element.options.axisX) {
                  diff =
                    new Date(element.options.axisX.maximum).getTime() -
                    new Date(element.options.axisX.minimum).getTime();
                } else {
                  // // logConsole('ELEMENTO MANCANTE', index, element);
                  colore = 'red';
                  diff = 123456;
                }
                  // // logConsole('*A* Assi ' + index, diff);

                  // element.options.axisX.viewPortMaximum = element.options.axisX.maximum;
                  // element.options.axisX.viewPortMinimum = element.options.axisX.minimum;
    
                  // // logConsole('*21* Assi ' + index, element.options.axisX.viewPortMinimum, element.options.axisX.viewPortMaximum)
                  index++;
                /* } else {
                  diff =
                    new Date(t.massimo[t.NumeroFrame2]).getTime() -
                    new Date(t.minimo[t.NumeroFrame2]).getTime();
          
                  element.options.axisX.viewPortMaximum = t.massimo[t.NumeroFrame2];
                  element.options.axisX.viewPortMinimum = t.minimo[t.NumeroFrame2];
                  element.options.axisX.maximum = t.massimo[t.NumeroFrame2];
                  element.options.axisX.minimum = t.minimo[t.NumeroFrame2];
    
                  // // logConsole('*221* Assi ' + index, t.minimo[t.NumeroFrame2], t.massimo[t.NumeroFrame2]);
                  index++;
                }
              } */
    
              /* if (element.options.axisX.viewPortMaximum > 0) {
                diff =
                  new Date(element.options.axisX.viewPortMaximum).getTime() -
                  new Date(element.options.axisX.viewPortMinimum).getTime();

                  // logConsole('*21* Assi ' + index, element.options.axisX.viewPortMinimum, element.options.axisX.viewPortMaximum)
                  index++;
              } else {
                if (element.options.axisX.maximum) {
                  diff =
                    new Date(element.options.axisX.maximum).getTime() -
                    new Date(element.options.axisX.minimum).getTime();

                    // logConsole('*22* Assi ' + index, element.options.axisX.minimum, element.options.axisX.maximum)
                    index++;
                  } else {
                    diff =
                      new Date(t.massimo[t.NumeroFrame2]).getTime() -
                      new Date(t.minimo[t.NumeroFrame2]).getTime();
      
                    element.options.axisX.viewPortMaximum = t.massimo[t.NumeroFrame2];
                    element.options.axisX.viewPortMinimum = t.minimo[t.NumeroFrame2];
                    element.options.axisX.maximum = t.massimo[t.NumeroFrame2];
                    element.options.axisX.minimum = t.minimo[t.NumeroFrame2];

                    // logConsole('*221* Assi ' + index, t.minimo[t.NumeroFrame2], t.massimo[t.NumeroFrame2]);
                    index++;
                  }
                } */
              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: STRIP LINE 1', element.options.axisX.viewPortMaximum, element.options.axisX.viewPortMinimum, diff, this.dimeBarra);
              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: STRIP LINE 2', element.options.axisX.maximum, element.options.axisX.minimum, diff, this.dimeBarra);
              // diff /= 1000;
              // if (diff > 500) {
                diff /= 500;
              // } else {
              //   diff /= this.dimeBarra;
              // }

              // diff /= 2000;
              // diff *= 4;

              // diff = this.dimeBarra / 2;
              if (diff < 1) {
                diff = t.dimeBarra[t.NumeroFrame2];
              }
              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: STRIP LINE 3', diff);


              const sl = [
                {
                  startValue: tt - (diff),
                  endValue: tt + (diff),
                  showOnTop: true,
                  color: colore,
                  lineDashType: 'dot',
                  opacity: .9,
                }
              ];

              // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: 2. Da ' + daDove + '. DSGS: Valore', t.NumeroFrame2, index, sl[0].endValue - sl[0].startValue);

                  // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element.options);
              if (element && element.options) {
                element.options.axisX.stripLines = sl;
              }
              // // logConsole('SELEZIONE', sl);
              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, this.NumeroFrame, element);

              // try {
              // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
              // if (t.debug2 === true) {
              //   // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno Grafici: Disegno selezione grafici 2', t.NumeroFrame2, element.canvas);
              // }

              if (esegueRender) {
                if (element && element.canvas && element.canvas !== null) {
                  // if (t.modalitaRealTimeAttiva2 === true) {
                  // } else {
                    try {
                      element.render();
                    } catch (e) {
                      // console.error('Errore su render chart 3: ', t.chartsGrafici[t.NumeroFrame2]);
                    }
                  // }

                  // element.set('dataPointWidth', Math.ceil(element.axisX[0].bounds.width / element.data[0].dataPoints.length), true);
                }
              }
              // } catch (e) {

              // }
            // } else {
            //   // logConsole('ELEMENTO NON PRESENTE', element, t.minimo[t.NumeroFrame2], t.massimo[t.NumeroFrame2]);
            // }
          // }
        });
      }
      // const fine = new Date().getTime() - inizio;
      // // t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Render stripline fine: ', fine);
    }
  }
}

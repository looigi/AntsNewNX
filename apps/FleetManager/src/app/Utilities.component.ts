import { logConsole } from './console-log';
// import Swal from 'sweetalert2/dist/sweetalert2.js';

import Swal from "sweetalert2";

export default class Utils {
  static modalitaDebug = false;
  static indirizzoServer;
  static linkIcone;
  static serverPostRest;
  // static facadeServerAddress;
  static serverGEOServer;
  static permessoFrameEditor = 'false';

  // modalitaLettura = 'POSTGREST';
  static indirizzoGEOServer = undefined;

  static tmsSelezionato = undefined;
  static tmsSelezionatoStringa = undefined;
  static cambioTimeRange = undefined;
  static rangeSelezionatoStampa = undefined;
  static tmsInizio = undefined;
  static tmsFine = undefined;

  static caricataDashboard = undefined;
  static datePipe = undefined;
  static range = undefined;
  static premutoReposition = false;
  static activitySceltaStampa = '';

  static clickSuCV = false;

  static eventiSceltiESTesto = undefined;
  static userRedirect = '';

  static limitPerVirtual = undefined;
  static urlRoot;
  static datiActTimeSpan: any[] = [
    { id: 1, name: 1 },
    { id: 5, name: 5 },
    { id: 10, name: 10 },
    { id: 60, name: 60 },
    { id: 120, name: 120 },
    { id: 300, name: 300 },
    { id: 600, name: 600 },
    { id: 1800, name: 1800 },
    { id: 3600, name: 3600 },
  ];

  static datiActTimeSpanRange: any[] = [
    { id: 1, name: 1 },
    { id: 5, name: 5 },
    { id: 10, name: 10 },
    { id: 60, name: 60 },
    { id: 120, name: 120 },
    { id: 300, name: 300 },
    { id: 600, name: 600 },
  ];

  static staModificandoValoriInSettings1: boolean = false;
  static staModificandoValoriInSettings2: boolean = false;
  static staModificandoValoriInSettings3: boolean = false;
  static staModificandoValoriInSettings4: boolean = false;

  static strutturaGrigliaDiBase = undefined;
  // charts = undefined;
  // chartHystogram = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // chartsScatter = undefined;
  // chartsHistogram = undefined;
  // chartsPareto = undefined;

  static giaPresoCentro = [undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined];

  // quantiFrames = 9;
  static quanteMisure = 4;
  static quanteMisureGrafici = 201;
  static quanteMisureScatter = 4;
  static quanteMisureHistogram = 4;
  static quanteMisurePareto = 2;
  static quanteMisurePivot = 4;

  static rangeDiSecondiPerMille = 60000;

  static sceltaActivityDaSet = [undefined, undefined, undefined, undefined, undefined];

  // mappaLocale = 'Use Local';
  // idMappaLocale 1= 5;

  // contatoreGrafici;
  // contatoreGraficiScatter;
  // contatoreGraficiHistogram;
  // contatoreGraficiPareto;

  // quantoContatoreGrafici;
  // quantoContatoreGraficiScatter;
  // quantoContatoreGraficiHistogram;
  // quantoContatoreGraficiPareto;

  // altezzaGrafico = undefined;
  // altezzaGraficoScatter = undefined;
  // altezzaGraficoHistogram = undefined;
  // altezzaGraficoPareto = undefined;

  // tipiApp = undefined;
  // arrayApp = undefined;
  // righeApp = undefined;
  // nomiLabelsApp = undefined;

  // rinfrescaGrafico = false;
  // rinfrescaGraficoScatter = false;
  // rinfrescaGraficoHistogram = false;
  // rinfrescaGraficoPareto = false;

  static layerPath = undefined;

  static globalMeasure = undefined;
  static datiMeasureType = [
    {
      id: 1,
      Name: 'Local'
    },
    {
      id: 2,
      Name: 'Global'
    }
  ];

  static axisXMaxMin = undefined;

  static ActivitySetDelPuntoClickato = undefined;
  static ActivitySetDelPuntoClickatoPerScritta = undefined;
  static SlaDelPuntoClickato = undefined;

  static clickDaMappa: Boolean = false;

  static maxTipiHistogram = undefined;
  static act_setDelPuntoClickatoSullaMappa = '';
  static mappaClickata = -1;

  // staGiaDisegnandoGrafici = [false, false, false, false, false, false, false, false, false, false];
  // staGiaDisegnandoGraficiScatter = [false, false, false, false, false, false, false, false, false, false];
  // staGiaDisegnandoGraficiHistogram = [false, false, false, false, false, false, false, false, false, false];
  // staGiaDisegnandoGraficiPareto = [false, false, false, false, false, false, false, false, false, false];
  // staDisegnandoMisure = [false, false, false, false, false, false, false, false, false, false];
  // staDisegnandoLegenda = [false, false, false, false, false, false, false, false, false, false];
  // staGiaDisegnandoPivot = [false, false, false, false, false, false, false, false, false, false];

  // quantiGraficiTCCiSono = undefined;
  // quantiGraficiHICiSono = undefined;
  // quantiGraficiPACiSono = undefined;
  // quantiGraficiSCCiSono = undefined;
  static caricamentoGraficiFinito = false;
  static qualeGrafico = 0;
  static quantiGrafici = 0;

  // caricamentoDatiInCorsoScatter = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoDatiInCorsoHistogram = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoEventiInCorso = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoEventi2InCorso = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoEventSummaryInCorso = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoPCM = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoCellMeasuresInCorso = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoTcRunInCorso = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoDatiInCorsoMC = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoDatiInCorsoPareto = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoDatiInCorsoPointMeasures = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoCdrDataInCorso = [false, false, false, false, false, false, false, false, false, false];
  // caricamentoCdrVoiceInCorso = [false, false, false, false, false, false, false, false, false, false];
  static ultimaVoltaHistogram = undefined;
  static puntoSelezionato = undefined;
  // lastCallAntenne = undefined;
  // lastCallPointCellMeasures = undefined;
  // lastCallLegenda = undefined;
  // lastCallPath = undefined;
  // lastCallPath2 = undefined;
  // lastCallPath3 = undefined;
  // lastCallPath4 = undefined;
  // lastCallPathSC = undefined;
  static lastRangeEventi = undefined;
  static lastRangeCells = undefined;
  static lastRangeCDRData = undefined;
  static lastRangeCDRVoice = undefined;
  // lastCallText = undefined;
  // lastCallCM = undefined;
  // lastCallPivot = undefined;
  // lastCallHist = undefined;
  // lastCallPareto = undefined;
  // lastCallES = undefined;
  // lastCallTrace = undefined;
  // lastCallTrace2 = undefined;
  // lastCallPointNum = undefined;
  // lastCallPointStr = undefined;
  // lastCallScatter = undefined;
  // lastCallEventi = undefined;
  // lastCallCrossTab = undefined;
  // lastCallCrossTabMenoUno = undefined;
  // lastCallCrossTabMenoDue = undefined;
  static csvApp = undefined;
  // lastCallGrafici = undefined;
  // lastCallMeasures = undefined;
  // lastCallGraficoEventi = undefined;
  // lastCallImmagine = undefined;
  // lastCallCD = undefined;
  // lastCallCV = undefined;
  static dimensioniFrames = undefined;
  static dimensioniFramesModif = undefined;

  // measureDaDisegnare = undefined;
  // measureDaDisegnareScatter = undefined;
  // measureDaDisegnareHistogram = undefined;
  // measureDaDisegnarePareto = undefined;

  // altezzaGrafici = undefined;
  // altezzaGraficiHistogram = undefined;

  static eventiSceltiES2 = undefined;
  static eventiSceltiESDiPassaggio = undefined;
  static tmsDelta = null;

  static dpi: number = -1;

  static clickSuMappaZoom = false;

  static tipiEvents = [
    { id: 'L', name: 'Local' },
    { id: 'G', name: 'Global' }
  ];

  static mappe: any[] = [
    { id: 1, name: 'CartoDB' },
    { id: 2, name: 'OSM' },
    { id: 3, name: 'Google' },
    { id: 4, name: 'Stamen' },
    { id: 5, name: 'Satellite' },
    // { id: this.idMappaLocale, name: this.mappaLocale },
  ];

  /* tipiHistogram: any[] = [
    { id: '0', name: 'Stacked Column', tipo: 'stackedColumn' },
    { id: '1', name: 'Stacked Column 100%', tipo: 'stackedColumn100' },
    { id: '2', name: 'Stacked Bar', tipo: 'stackedBar' },
    { id: '3', name: 'Stacked Bar 100%', tipo: 'stackedBar100' }
  ]; */

  static tipiHistogrammiNUM: any[] = [
    { id: 'N0', name: 'Avg' },
    { id: 'N1', name: 'Avg/Min/Max' },
    { id: 'N2', name: 'Avg/Count' },
    { id: 'N3', name: 'Avg/Min/Max/Count' },
    { id: 'N7', name: 'Success Rate' },
    { id: 'N8', name: 'Success Rate/Count' },
    { id: 'N4', name: 'Severity' },
    { id: 'N5', name: 'Severity 100%' },
    { id: 'N6', name: 'Severity 100%/Count' },
  ];

  static tipiHistogrammiSTR: any[] = [
    { id: 'S0', name: 'Count' },
    { id: 'S1', name: 'Count 100%' },
  ];

  static datiTipiFrame: any[] = [
    { id: '--', name: 'Empty' },
    { id: 'AE', name: 'Activity Events' },
    { id: 'MC', name: 'Activity Time Chart' },
    { id: 'CD', name: 'CDR Data' },
    { id: 'CV', name: 'CDR Voice' },
    { id: 'CM', name: 'Cell Measure' },
    { id: 'ES', name: 'Event Summary' },
    { id: 'XX', name: 'General View' },
    { id: 'AH', name: 'Histogram' },
    { id: 'M', name: 'Map' },
    { id: 'NB', name: 'Notebook' },
    { id: 'PC', name: 'Pareto Chart' },
    { id: 'PT', name: 'Pivot Table' },
    { id: 'PK', name: 'Point Cell Measures' },
    { id: 'PM', name: 'Point Measures' },
    { id: 'PS', name: 'Scatter' },
    { id: 'TI', name: 'Tc Run Info' },
  ];

  static antenne: any[] = [
    { id: 0, name: '<None>', layer: '' },
    { id: 1, name: 'Antenna', layer: 'l_antenne', style: 's_antenna' },
    { id: 2, name: 'Radiation Diagram', layer: 'l_antenne', style: 's_antenna_radiation_diagram' },
    { id: 3, name: 'Crossed Feeder LTE', layer: 'l_antenna_crossed_feeder_lte', style: 's_antenna_crossed_feeder_lte' },
    // { id: this.idMappaLocale, name: this.mappaLocale },
  ];

  static datiTipiActivity: any[] = [
    { id: 1, name: 'Activity Set 1' },
    { id: 2, name: 'Activity Set 2' },
    { id: 3, name: 'Activity Set 3' },
    { id: 4, name: 'Activity Set 4' }
  ];

  static ConversioneMisureLayers: any[] = [
    { misura: '', layer: '' },
  ];

  static ritornaCampoCSVSistemato(e) {
    if (e) {
      let ee = JSON.parse(JSON.stringify(e));
      ee = ee.replace(/[\r\n]+/gm, '');

      return ee;
    } else {
      return undefined;
    }
  }

  static checkRitornoChiamata(t, d) {
    if (d) {
      if (d.err_code) {
        if (d.err_code === 1) {
          if (d.failure_reason) {
            if (d.failure_reason === 'cntx invalid') {
              // Torna al login
              if (Utils.userRedirect === 'default') {
                localStorage.setItem('ERROR', 'CNTX_INVALID');
                window.location.href = Utils.urlRoot + 'login/?err=cntx_invalid';
              } else {
                location.assign(Utils.userRedirect);
              }
            } else {
              // alert (d.failure_reason);
              t.mostraPopup('Error: ' + d.failure_reason, false, '');
            }
          }
        }
      }
      if (d.v_err_code && d.v_err_code === 2) {
        if (d.v_failure_reason) {
          // alert(d.v_failure_reason);
          t.mostraPopup('Error: ' + d.failure_reason, false, '');
        } else {
          // alert('V_ERR_CODE = 2 without failure reason');
          t.mostraPopup('Error: V_ERR_CODE = 2 without failure reason', false, '');
        }
      }
      if (d[0] && d[0].v_err_code && d[0].v_err_code === 2) {
        if (d[0].v_failure_reason) {
          // alert(d[0].v_failure_reason);
          t.mostraPopup('Error: ' + d.failure_reason, false, '');
        } else {
          // alert('V_ERR_CODE = 2 without failure reason');
          t.mostraPopup('Error: V_ERR_CODE = 2 without failure reason', false, '');
        }
      }
    }
  }

  static messaggioDiErrore(griglia, mess) {
    // t.messaggioDiErrore.emit(mess);
    if (!griglia || griglia === null || typeof(griglia) !== 'string' || (typeof(griglia) === 'string' && griglia !== 'null')) {
      griglia = 'ERROR: ' + JSON.stringify(JSON.parse(mess._body).message);
    } else {
      console.error('ERROR:', mess);
    }
  }

  static cripta(s) {
    const x = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    // // logConsole('Stringa:', s);
    // // logConsole('Codice random:', x);
    let rit = x + ';';
    // // logConsole('Rit 1:', rit);
    for (let i = 0; i < s.length; i++) {
      let a = s.charCodeAt(i);
      a += (x + i);
      rit += a +';';
      // // logConsole('Rit ' + i + ':', rit);
    }
    for (let i = 0; i <= 5; i++) {
      const x = Math.floor(Math.random() * (255 - 1 + 1)) + 1;
      rit += x +';';
      // // logConsole('Rit ' + (i + 100) + ':', rit);
    }
    rit += s.length + ';';

    return rit;
  }

  static decripta(s) {
    let rit = '';
    if (s && s !== '') {
      const c = s.split(';');
      // // logConsole(c, +c[c.length - 2], c.length - 2);
      const differenza = +c[0];
      const lunghezza = +c[c.length - 2];
      // // logConsole('Differenza: ', differenza);
      // // logConsole('Lunghezza: ', lunghezza);

      for (let i = 1; i < lunghezza + 1; i ++) {
        // // logConsole('Carattere ' + i + ': ', c[i]);
        let v = +c[i] - (i - 1);
        // // logConsole('Valore Carattere ' + i + ': ', v);
        v -= differenza;
        // // logConsole('Carattere ' + i + '. Differenza: ', v);
        const car = String.fromCharCode(v);
        // // logConsole('Carattere ' + i + ': ', car);
        rit += car;
      }
    }

    return rit;
  }

  static scriveLog(Cosa, P1?, P2?, P3?, P4?, P5?) {
    if (this.modalitaDebug === true) {
      if (P1 && P2 && P3 && P4 && P5) {
        // console.log(Cosa, P1, P2, P3, P4, P5);
      } else {
        if (P1 && P2 && P3 && P4 && !P5) {
          // console.log(Cosa, P1, P2, P3, P4);
        } else {
          if (P1 && P2 && P3 && !P4 && !P5) {
            // console.log(Cosa, P1, P2, P3);
          } else {
            if (P1 && P2 && !P3 && !P4 && !P5) {
              // console.log(Cosa, P1, P2,);
            } else {
              if (P1 && !P2 && !P3 && !P4 && !P5) {
                // console.log(Cosa, P1);
              } else {
                // console.log(Cosa);
              }  
            }
          }
        }
      }
    }
  }

  static visualizzaAlert(messaggio) {
    Swal.fire({
      title: 'Confirm',
      text: messaggio,
      icon: 'question',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    });
  }

  static scriveDimensioniColonne(tabella, dimensioniColonne) {
    logConsole('Scrittura dimensioni colonna', tabella, dimensioniColonne);
  }

}

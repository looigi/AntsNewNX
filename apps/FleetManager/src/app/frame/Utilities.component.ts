import { logConsole } from '../console-log';
// import {isNumeric} from 'rxjs/util/isNumeric';
import Utils from '../Utilities.component';

declare const CanvasJS: any;

export class FrameUtils {
  static bboxOverview = undefined;
  static squareMetersGlobaleOverView = 200;
  static bboxZoom = undefined;
  static squareMetersGlobaleZoom = 200;
  static rigaSelezionataMG = {};
  static fattoQuadrato = [ false, false, false, false, false, false, false, false, false, false, false ];

  // modalitaLettura = 'POSTGREST';
  static indirizzoServer = undefined;
  static indirizzoGEOServer = undefined;
  static linkIcone = undefined;
  static serverPostRest = '';
  // static facadeServerAddress = undefined;
  static serverGEOServer = undefined;

  static tmsSelezionato = undefined;
  static tmsSelezionatoStringa = undefined;
  static cambioTimeRange = undefined;
  static rangeSelezionatoStampa = undefined;
  static tmsInizio = undefined;
  static tmsFine = undefined;

  static caricataDashboard = undefined;
  static range = undefined;
  static premutoReposition = false;
  static activitySceltaStampa = '';

  static clickSuCV = false;

  static eventiSceltiESTesto = undefined;

  static limitPerVirtual = undefined;

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
    { id: 'MD', name: 'Measure Definition' },
    { id: 'MG', name: 'Mosaic Grid' },
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
    }
  }

  static sistemaJSONPerSalvarloSuDB(j) {
    const jj = JSON.stringify(j);
    const a = new Array();

    for (let i = 0; i < jj.length; i ++) {
      const s = jj.substring(i, i + 1);
      a.push(s.charCodeAt(0));
      // // logConsole(s);
    }
    return a.toString();
  }

  static isNumeric(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
  }

  static sistemaStringaLettaDaDB(j) {
    const jj = j.trim();
    const a = jj.split(',');
    let s = '';

    if (!this.isNumeric(a[0])) {
      return '{}';
    }

    a.forEach(element => {
     s += String.fromCharCode(element);
    });

    return s;
  }
}

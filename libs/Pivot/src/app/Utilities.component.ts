import { Injectable } from '@angular/core';

// import * as CanvasJS from './js/canvasjs.min';
// import * as CanvasJS from '../../../assets/js/canvasjs.min.js';
declare const CanvasJS: any;

export class Utils {
  userRedirect = '';
  static urlRoot = '';
  posizioneActivity;

  // modalitaLettura = 'POSTGREST';
  
  indirizzoServer = undefined;
  indirizzoGEOServer = undefined;
  linkIcone = undefined;
  serverPostRest = '';
  facadeServerAddress = undefined;
  serverGEOServer = undefined;
  permessoFrameEditor = '';
  additionalLayer= undefined;

  tmsSelezionato = undefined;
  // tmsSelezionatoStringa = undefined;
  cambioTimeRange = undefined;
  rangeSelezionatoStampa = undefined;
  tmsInizio = undefined;
  tmsFine = undefined;
  uidMoventeMappa = '';

  caricataDashboard = undefined;
  datePipe = undefined;
  // range = undefined;
  premutoReposition = false;
  activitySceltaStampa = '';

  clickSuCV = false;

  eventiSceltiESTesto = undefined;

  limitPerVirtual = undefined;
  nomeActivitySelezionata = '';

  // posDaImpostare = '';

  datiHeightChart = [
    { id: 'X1', name: 'X1' },
    { id: 'X2', name: 'X2' },
    { id: 'X3', name: 'X3' },
    { id: 'X4', name: 'X4' }
  ];

  datiActTimeSpan: any[] = [
    /* { id: 1, name: 1 },
    { id: 5, name: 5 },
    { id: 10, name: 10 }, */
    { id: 60, name: 60 },
    { id: 120, name: 120 },
    { id: 300, name: 300 },
    { id: 600, name: 600 },
    { id: 1800, name: 1800 },
    { id: 3600, name: 3600 },
    { id: 7200, name: 7200 },
    { id: 14400, name: 14400 },
    { id: 43200, name: 43200 },
  ];

  datiActTimeSpanRange: any[] = [
    { id: -10, name: -10 },
    { id: -5, name: -5 },
    { id: -1, name: -1 },
    { id: 1, name: 1 },
    { id: 5, name: 5 },
    { id: 10, name: 10 },
    { id: 60, name: 60 },
    { id: 120, name: 120 },
    { id: 300, name: 300 },
    { id: 600, name: 600 },
  ];

  staModificandoValoriInSettings1: boolean = false;
  staModificandoValoriInSettings2: boolean = false;
  staModificandoValoriInSettings3: boolean = false;
  staModificandoValoriInSettings4: boolean = false;

  strutturaGrigliaDiBase = undefined;
  // charts = undefined;
  // chartHystogram = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  // chartsScatter = undefined;
  // chartsHistogram = undefined;
  // chartsPareto = undefined;

  giaPresoCentro = [undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined];

  // quantiFrames = 9;
  quanteMisure = 4;
  quanteMisureGrafici = 201;
  quanteMisureScatter = 4;
  quanteMisureHistogram = 5;
  quanteMisurePareto = 2;
  quanteMisurePivot = 4;

  // rangeDiSecondiPerMille = 60000;

  sceltaActivityDaSet = [undefined, undefined, undefined, undefined, undefined];
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

  layerPath = undefined;

  globalMeasure = undefined;
  tipoMisuraGlobale = undefined;

  datiMeasureType = [
    {
      id: 1,
      Name: 'Local'
    },
    {
      id: 2,
      Name: 'Global'
    }
  ];

  axisXMaxMin = undefined;

  ActivitySetDelPuntoClickato = undefined;
  ActivitySetDelPuntoClickatoPerScritta = undefined;
  SlaDelPuntoClickato = undefined;

  clickDaMappa: Boolean = false;

  maxTipiHistogram = undefined;
  act_setDelPuntoClickatoSullaMappa = '';
  mappaClickata = -1;

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
  caricamentoGraficiFinito = false;
  qualeGrafico = 0;
  quantiGrafici = 0;

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

  ultimaVoltaHistogram = undefined;
  puntoSelezionato = undefined;
  // lastCallAntenne = undefined;
  // lastCallPointCellMeasures = undefined;
  // lastCallLegenda = undefined;
  // lastCallPath = undefined;
  // lastCallPath2 = undefined;
  // lastCallPath3 = undefined;
  // lastCallPath4 = undefined;
  // lastCallPathSC = undefined;
  lastRangeEventi = undefined;
  lastRangeCells = undefined;
  lastRangeCDRData = undefined;
  lastRangeActivities = undefined;
  lastRangeCDRVoice = undefined;
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
  csvApp = undefined;
  // lastCallGrafici = undefined;
  // lastCallMeasures = undefined;
  // lastCallGraficoEventi = undefined;
  // lastCallImmagine = undefined;
  // lastCallCD = undefined;
  // lastCallCV = undefined;
  dimensioniFrames = undefined;
  dimensioniFramesModif = undefined;
  fattoQuadrato = [ false, false, false, false, false, false, false, false, false, false, false ];

  // measureDaDisegnare = undefined;
  // measureDaDisegnareScatter = undefined;
  // measureDaDisegnareHistogram = undefined;
  // measureDaDisegnarePareto = undefined;

  // altezzaGrafici = undefined;
  // altezzaGraficiHistogram = undefined;

  eventiSceltiES2 = undefined;
  eventiSceltiESDiPassaggio = undefined;
  tmsDelta = null;

  dpi: number = -1;

  tipiEvents = [
    { id: 'L', name: 'Local' },
    { id: 'G', name: 'Global' },
    { id: 'S', name: 'Selected Events' }
  ];

  mappe: any[] = [
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

  tipiHistogrammiNUM: any[] = [
    { id: 'N0', name: 'Avg' },
    { id: 'N1', name: 'Avg/Min/Max' },
    { id: 'N2', name: 'Avg/Count' },
    { id: 'N3', name: 'Avg/Min/Max/Count' },
    { id: 'S0', name: 'Count' },
    // { id: 'SC', name: 'Count 100%' },
    { id: 'N9', name: 'Count Distinct' },
    { id: 'Q0', name: 'Quartiles' },
    { id: 'Q1', name: 'Quartiles/Count' },
    { id: 'N7', name: 'Success Rate' },
    { id: 'N8', name: 'Success Rate/Count' },
    { id: 'S1', name: 'Sum' },
    { id: 'SC', name: 'Sum 100%' },
    { id: 'S2', name: 'Sum/Count' },
    { id: 'N4', name: 'Severity' },
    { id: 'N5', name: 'Severity 100%' },
    { id: 'N6', name: 'Severity 100%/Count' },
  ];

  tipiHistogrammiSTR: any[] = [
    { id: 'S0', name: 'Count' },
    { id: 'S1', name: 'Count 100%' },
    { id: 'N9', name: 'Count Distinct' },
  ];

  datiTipiFrameTutti: any[] = [
    { id: '--', name: 'Empty' },
    { id: 'LA', name: 'Activities' },
    { id: 'AE', name: 'Activity Events' },
    { id: 'MC', name: 'Activity Time Chart' },
    { id: 'AI', name: 'Area Info Grid' },
    { id: 'CD', name: 'CDR Data' },
    { id: 'CV', name: 'CDR Voice' },
    { id: 'CM', name: 'Cell Measure' },
    { id: 'CG', name: 'Cluster Grid' },
    { id: 'ES', name: 'Event Summary' },
    { id: 'XX', name: 'Generic Grid' },
    { id: 'AH', name: 'Histogram' },
    { id: 'M', name: 'Map' },
    { id: 'MD', name: 'Measure Definition' },
    { id: 'MG', name: 'Mosaic Grid' },
    { id: 'NB', name: 'Notebook' },
    { id: 'NP', name: 'NPS' },
    { id: 'PC', name: 'Pareto Chart' },
    // { id: 'PT', name: 'Pivot Table' },
    { id: 'PK', name: 'Point Cell Measures' },
    { id: 'PL', name: 'Point Layer Info' },
    { id: 'PM', name: 'Point Measures' },
    { id: 'PS', name: 'Scatter' },
    { id: 'TC', name: 'Tc Run Grid' },
    { id: 'TP', name: 'Tc Run Grid Pivot' },
    // { id: 'TI', name: 'Tc Run Info' },
  ];

  antenne: any[] = [
    { id: 0, name: '<None>', layer: '' },
    { id: 1, name: 'Antenna', layer: 'l_antenne', style: 's_antenna' },
    { id: 2, name: 'Radiation Diagram', layer: 'l_antenne', style: 's_antenna_radiation_diagram' },
    { id: 3, name: 'Crossed Feeder LTE', layer: 'l_antenna_crossed_feeder_lte', style: 's_antenna_crossed_feeder_lte' },
    // { id: this.idMappaLocale, name: this.mappaLocale },
  ];

  datiTipiActivity: any[] = [
    { id: 1, name: 'Activity Set 1' },
    { id: 2, name: 'Activity Set 2' },
    { id: 3, name: 'Activity Set 3' },
    { id: 4, name: 'Activity Set 4' }
  ];

  ConversioneMisureLayers: any[] = [
    { misura: '', layer: '' },
  ];

  static cripta(s) {
    const x = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    // console.log('Stringa:', s);
    // console.log('Codice random:', x);
    let rit = x + ';';
    // console.log('Rit 1:', rit);
    for (let i = 0; i < s.length; i++) {
      let a = s.charCodeAt(i);
      a += (x + i);
      rit += a +';';
      // console.log('Rit ' + i + ':', rit);
    }
    for (let i = 0; i <= 5; i++) {
      const x = Math.floor(Math.random() * (255 - 1 + 1)) + 1;
      rit += x +';';
      // console.log('Rit ' + (i + 100) + ':', rit);
    }
    rit += s.length + ';';

    return rit;
  }
}

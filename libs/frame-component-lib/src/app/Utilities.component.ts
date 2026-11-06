import { Injectable } from '@angular/core';
// import {isNumeric} from 'rxjs/util/isNumeric'
import { environment } from '../environments/environment';
// import * as wjOlap from '@grapecity/wijmo.olap';
// import {Fill, Stroke, Style, Text} from 'ol/style';

// import * as CanvasJS from './js/canvasjs.min';
// import * as CanvasJS from '../assets/js/canvasjs.min.js';
// import ExternalUtilities from './modules/framecomponent/ExternalUtilities.component.js';
// import { environment } from 'src/environments/environment.js';
import ExternalUtilities from './modules/framecomponent/ExternalUtilities.component';
// declare const CanvasJS: any;
import download from 'downloadjs';  // Importa downloadjs

@Injectable()
export default class Utils {
  //  modalitaLettura = 'POSTGREST';
   static indirizzoServer = undefined;
   static indirizzoGEOServer = undefined;
   static linkIcone = ''; // 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/assets/img'; // 'http://localhost:2727/assets/img';
   static serverPostRest;
   // static facadeServerAddress;
   static urlRoot;
   static permessoFrameEditor = '';
   static posizioneActivity;

   static tmsSelezionato = undefined;
   static tmsSelezionatoStringa = undefined;
   static cambioTimeRange = undefined;
   static rangeSelezionatoStampa = undefined;
   static tmsInizio = undefined;
   static tmsFine = undefined;
   static tmsInizioPausa = undefined;
   static tmsFinePausa = undefined;
   static tmsInizioCDR = undefined;
   static tmsFineCDR = undefined;
   static clickSuChart2 = false;
   static uidMoventeMappa = -1;

   static caricataDashboard = undefined;
   static datePipe = undefined;
   static range = undefined;
   static premutoReposition = false;
   static activitySceltaStampa = '';

   static clickSuCV = false;

   // static eventiSceltiESTesto = undefined;

   static limitPerVirtual = undefined;
   static fattoQuadrato = [false, false, false, false, false, false, false, false, false, false, false];

   static staCaricandoBounds = false;
   static altezzaDivGrafici = -1;
   // static coordinateShowRaysAllLayer = null;

   static edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  static datiHeightChart = [
    { id: 'X1', name: 'X1' },
    { id: 'X2', name: 'X2' },
    { id: 'X3', name: 'X3' },
    { id: 'X4', name: 'X4' }
  ];

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
   // chartHystogram = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
   // chartsScatter = undefined;
   // chartsHistogram = undefined;
   // chartsPareto = undefined;

  static giaPresoCentro = [undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined];

  //  quantiFrames = 9;
  static quanteMisure = 4;
  static quanteMisureGrafici = 201;
  static quanteMisureScatter = 4;
  static quanteMisureHistogram = 5;
  static quanteMisurePareto = 2;
  static quanteMisurePivot = 4;
  static userRedirect = '';

  static rangeDiSecondiPerMille = 60000;

  static sceltaActivityDaSet = [undefined, undefined, undefined, undefined, undefined];
  //  mappaLocale = 'Use Local';
  //  idMappaLocale 1= 5;

  //  contatoreGrafici;
  //  contatoreGraficiScatter;
  //  contatoreGraficiHistogram;
  //  contatoreGraficiPareto;

  //  quantoContatoreGrafici;
  //  quantoContatoreGraficiScatter;
  //  quantoContatoreGraficiHistogram;
  //  quantoContatoreGraficiPareto;

  //  altezzaGrafico = undefined;
  //  altezzaGraficoScatter = undefined;
  //  altezzaGraficoHistogram = undefined;
  //  altezzaGraficoPareto = undefined;

   // tipiApp = undefined;
   // arrayApp = undefined;
   // righeApp = undefined;
   // nomiLabelsApp = undefined;

  //  rinfrescaGrafico = false;
  //  rinfrescaGraficoScatter = false;
  //  rinfrescaGraficoHistogram = false;
  //  rinfrescaGraficoPareto = false;

  static layerPath = undefined;
   /* stylePerPath = new Style({
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.6)'
    }),
    stroke: new Stroke({
      color: 'rgba(128, 0, 0, 0.6)',
      width: 1
    })
  }); */

  static globalMeasure = undefined;
  static globalMeasureArfcn = undefined;
  static tipoMisuraGlobale = undefined;
  static tipoMisuraGlobaleArfcn = undefined;

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

   //  quantiGraficiTCCiSono = undefined;
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
   // static puntoSelezionato = undefined;
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
   static lastRangeActivities = undefined;
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

   // static eventiSceltiES2 = undefined;
   // static eventiSceltiESDiPassaggio = undefined;
   static tmsDelta = null;

   static dpi: number = -1;

   static clickSuMappaZoom = ExternalUtilities.creaVettore(environment.quantiFrames, false);
   static nomeActivitySelezionata = '';

   static tipiEvents = [
    { id: 'L', name: 'Local' },
    { id: 'G', name: 'Global' },
    { id: 'S', name: 'Selected Events' }
  ];

  static mappe: any[] = [
    { id: 1, name: 'CartoDB' },
    { id: 2, name: 'OSM' },
    { id: 3, name: 'Google' },
    { id: 4, name: 'Stamen' },
    { id: 5, name: 'Satellite' },
    // { id: 6, name: 'Magnify' },
    // { id: this.idMappaLocale, name: this.mappaLocale },
  ];

  static ultimaVoltaTMSLA = -1;

  /*  tipiHistogram: any[] = [
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

  static tipiHistogrammiSTR: any[] = [
    { id: 'S0', name: 'Count' },
    { id: 'S1', name: 'Count 100%' },
    { id: 'N9', name: 'Count Distinct' },
  ];

  static datiTipiFrameTutti: any[] = [
    { id: '--', name: 'Empty' },
    { id: 'LA', name: 'Activities' },
    { id: 'AE', name: 'Activity Events' },
    { id: 'MC', name: 'Activity Time Chart' },
    { id: 'AI', name: 'Area Info Grid' },
    { id: 'AP', name: 'Point Arfcn' },
    { id: 'AR', name: 'Arfcn Grid' },
    { id: 'AA', name: 'Arfcn All Measures' },
    { id: 'CD', name: 'CDR Data' },
    { id: 'CV', name: 'CDR Voice' },
    { id: 'CM', name: 'Cell Measure' },
    { id: 'CG', name: 'Cluster Grid' },
    { id: 'ES', name: 'Event Summary' },
    { id: 'XX', name: 'General View' },
    { id: 'AH', name: 'Histogram' },
    { id: 'M', name: 'Map' },
    { id: 'MD', name: 'Measure Definition' },
    { id: 'M2', name: 'Mistral CDR' },
    { id: 'MF', name: 'Mistral Flow Segment' },
    { id: 'MS', name: 'Mistral Flow Stat' },
    { id: 'MQ', name: 'Mistral Flow Queue' },
    { id: 'MR', name: 'Mistral RBC-IXL Messages' },
    { id: 'TP', name: 'Tc Run Grid Pivot' },
    { id: 'MG', name: 'Mosaic Grid' },
    { id: 'NB', name: 'Notebook' },
    { id: 'NP', name: 'NPS' },
    { id: 'PC', name: 'Pareto Chart' },
    // { id: 'PT', name: 'Pivot Table' },
    { id: 'PK', name: 'Point Cell Measures' },
    { id: 'PL', name: 'Point Layer Info' },
    { id: 'PM', name: 'Point Measures' },
    { id: 'PS', name: 'Scatter' },
    { id: 'SY', name: 'Synoptic' },
    { id: 'TC', name: 'Tc Run Grid' },
    { id: 'TP', name: 'Tc Run Grid Pivot' },
    // { id: 'PP', name: 'Pivot Test' },
  ];

  static antenne: any[] = [
    { id: -1, name: '<None>', layer: '' },
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

  static converteStringaInJSON(val) {
    let ee;
    if (typeof(val) === 'string') {
      const vv = val.substring(0, 3);
      // // console.log('Prefisso:', vv);
      if (val !== undefined && val !== '' && val !== 'empty' && val !== 'empty grid' && vv !== '***') {
        // // console.log('Valore da parsare:', val);
        ee  = JSON.parse(val);
        if (typeof(ee) === 'string' && ee !== 'empty grid') {
          if (ee !== '') {
            // // console.log('->' + ee + '<-');
            ee = JSON.parse(ee);
          }
        }
      } else {
        if (vv === '***') {
          ee = val.replace(vv, '');
        } else {
          ee = '';
        }
      }
    } else {
      ee = val;
    }

    return ee;
  }

  static  sistemaJSONPerSalvarloSuDB(j) {
    const jj = JSON.stringify(j);
    const a = new Array();

    for (let i = 0; i < jj.length; i ++) {
      const s = jj.substring(i, i + 1);
      a.push(s.charCodeAt(0));
      // // console.log(s);
    }
    return a.toString();
  }

  static  sistemaStringaLettaDaDB(j) {
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

  static isNumeric(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
  }

  static  VECCHIOsistemaJSONPerSalvarloSuDB(j) {
    if (j !== null) {
      let impost = JSON.stringify(j);

      while (impost.indexOf('"') > -1) {
        impost = impost.replace('"', '*2V*');
      }
      while (impost.indexOf(',') > -1) {
        impost = impost.replace(',', '*V*');
      }
      while (impost.indexOf(':') > -1) {
        impost = impost.replace(':', '*2P*');
      }
      while (impost.indexOf('{') > -1) {
        impost = impost.replace('{', '*GA*');
      }
      while (impost.indexOf('}') > -1) {
        impost = impost.replace('}', '*GC*');
      }
      while (impost.indexOf('\\') > -1) {
        impost = impost.replace('\\', '*B*');
      }

      return impost;
    } else {
      return '';
    }
  }

  static  VECCHIOsistemaStringaLettaDaDB(j) {
    if (j !== null) {
      let jj = j;

      while (jj.indexOf('*2V*') > -1) {
        jj = jj.replace('*2V*', '"');
      }
      while (jj.indexOf('*V*') > -1) {
        jj = jj.replace('*V*', ',');
      }
      while (jj.indexOf('*2P*') > -1) {
        jj = jj.replace('*2P*', ':');
      }
      while (jj.indexOf('*GA*') > -1) {
        jj = jj.replace('*GA*', '{');
      }
      while (jj.indexOf('*GC*') > -1) {
        jj = jj.replace('*GC*', '}');
      }
      while (jj.indexOf('*B*') > -1) {
        jj = jj.replace('*B*', '\\');
      }

      return jj;
    } else {
      return '';
    }
  }

  static  ritornaRigaTotaleDaDescrizioneCombo(desc, dati, campoTesto) {
    let ee = desc;
    if (typeof(ee) === 'object') {
      ee = ee[campoTesto];
    }
    // // console.log(ee);
    if (ee && ee.substring(0, 1) === '"' && ee.substr(ee.length - 1) === '"') {
      ee = ee.substring(1, ee.length);
      ee = ee.substring(0, ee.length - 1);
    }
    // // console.log('Cambiato valore combo:', ee);
    let ritorno: any;
    ritorno = null;
    if (dati) {
      dati.forEach(element => {
        if (ee === element[campoTesto]) {
          ritorno = element;
        }
      });
    }

    return ritorno;
  }

  static  PrendeNomeMisuraDaCodice(codice, misure) {
    let display_name = '';

    if (misure !== undefined && misure !== null && codice !== null && codice !== undefined) {
      // // console.log(codice);
      misure.forEach(element2 => {
        // // console.log(element2.CODE, codice);
        if (display_name === '' && element2) {
          if (this.isNumeric(codice)) {
            if (element2 && element2.CODE && +element2.CODE === codice) {
              display_name = element2.DISPLAY_NAME;
            }
          } else {
            if (element2 && element2.CODE && element2.CODE !== null && codice && codice !== null) {
              if (typeof(codice) === 'string') {
                try {
                  if (element2 && element2.CODE && element2.CODE.toLowerCase().trim() === codice.toLowerCase().trim()) {
                    display_name = element2.DISPLAY_NAME;
                  }
                } catch (e) {
                  console.error('Prende nome misura da codice 2: ', e, codice);
                }
              } else {
                if (typeof(codice) === 'object') {
                  if (codice && codice.DISPLAY_NAME) {
                    display_name = codice.DISPLAY_NAME;
                  }
                }
              }
            }
          }
        }
      });
    }

    return display_name;
  }

  static prendeActivitySceltaPerEvents(t) {
    let act_id = '';
    let conta2 = 0;
    // // console.log(t.NumeroFrame, t.Activity2);
    if (t.Activity2 === 0) { // LATEST SELECTION
      // // console.log(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_id = t.stringaAGNoACT;
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
        // // console.log(this.sceltaActivityDaSet);
        this.sceltaActivityDaSet.forEach(element => {
          if (element) {
            element.forEach(element2 => {
              // // console.log(element2.ID);
              if (element2.ID && element.ID !== null && element2.ID.toString().trim() !== '') {
                act_id += element2.ID + ',';
              }
            });
          }
        });
        if (act_id !== '') {
          act_id = act_id.substring(0, act_id.length - 1);
        }
      } else {
        //  // console.log(this.datiTipiActivity, t.Activity2, t.stringaAGNoACT, t.listaActivityName2, this.sceltaActivityDaSet);
        // conta2 = 1;
        // let act = '';
        // this.datiTipiActivity.forEach(element => {
        //   if (t.Activity2 === element.id) {
        //     act = t.stringaAGNoACT[conta2];
        //   }
        //   conta2++;
        // });
        if (t.stringaAGNoACT) {
          const act = t.stringaAGNoACT;
          // // console.log(act);
          if (this.sceltaActivityDaSet[t.Activity2]) {
            this.sceltaActivityDaSet[t.Activity2].forEach(element => {
              if (act === element.NAME) {
                if (element.ID && element.ID !== null && element.ID.toString().trim() !== '') {
                  act_id = element.ID;
                }
              }
            });
          }
        }
      }
    }
    act_id = Utils.toglieVirgoleInutili(act_id);
    // // console.log('Activity Set', act_id);
    return act_id;
  }

  static prendeTuttiIdActSet(t, conSlash) {
    let act_id = '';
    let altro = ',';
    if (conSlash === true) {
      altro = '\\,';
    }

    if (t.Activity2 === 0) { // LATEST SELECTION
      let conta = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            this.sceltaActivityDaSet[conta].forEach(element2 => {
              act_id += element2.ID + ',';
            });
          }
        }
        conta++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
        this.sceltaActivityDaSet.forEach(element => {
          element.forEach(element2 => {
            act_id += element2.ID + altro;
          });
        });
      } else {
        if (this.sceltaActivityDaSet[t.Activity2]) {
          this.sceltaActivityDaSet[t.Activity2].forEach(element => {
            act_id += element.ID + altro;
          });
        } else {
          act_id = '';
        }
      }
    }

    if (act_id !== '') {
      if (conSlash === false) {
        act_id = Utils.toglieVirgoleInutili(act_id);
      } else {
        if (act_id.substring(act_id.length - 1, act_id.length) === ',') {
          act_id = act_id.substring(0, act_id.length - 2);
        }
      }
    }

    return act_id;
  }

  static  toglieVirgoleInutili(act_id) {
    act_id = act_id.toString().trim();
    // // console.log(act_id.substring(0, 1));
    if (act_id.substring(0, 1) === ',') {
      act_id = act_id.substring(1, act_id.length);
    }
    // // console.log(act_id.substring(act_id.length - 1, act_id.length));
    if (act_id.substring(act_id.length - 1, act_id.length) === ',') {
      act_id = act_id.substring(0, act_id.length - 1);
    }
    // // console.log(act_id);
    return act_id;
  }

  static  prendeActivitySceltaPerPointCM(t) {
    let act_set = '';
    let conta2 = 0;
    // // console.log(t.NumeroFrame, t.Activity2);
    if (t.Activity2 === 0) { // LATEST SELECTION
      // // console.log(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_set = t.stringaAGNoACT;
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
        // // console.log(this.sceltaActivityDaSet);
        Utils.sceltaActivityDaSet.forEach(element => {
          if (element) {
            element.forEach(element2 => {
              act_set += element2.ID + ',';
            });
          }
        });
        if (act_set !== '') {
          act_set = act_set.substring(0, act_set.length - 1);
        }
      } else {
        // // console.log(this.datiTipiActivity, t.Activity2, t.stringaAGNoACT, this.sceltaActivityDaSet);
        conta2 = 1;
        let ac = '';
        this.datiTipiActivity.forEach(element => {
          if (t.Activity2 === element.id) {
            ac = t.stringaAGNoACT;
          }
          conta2++;
        });
        if (ac !== '' && this.sceltaActivityDaSet) {
          // // console.log(ac, this.sceltaActivityDaSet);
          this.sceltaActivityDaSet[t.Activity2].forEach(element => {
            if (element) {
              if (ac === element.NAME) {
                act_set = element.ID;
              }
            }
          });
        }
      }
    }
    // // console.log('Activity Set', act_set);
    act_set = Utils.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static  prendeActivitySceltaCellMeasures(t) {
    let act_set = '';
    let conta2 = 0;

    // // console.log(t.NumeroFrame, t.Activity2);
    if (t.Activity2 === 0) { // LATEST SELECTION
      // // console.log(t.NumeroFrame, this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_set = element.ID;
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
        // // console.log(t.NumeroFrame, act_set, this.sceltaActivityDaSet);
        this.sceltaActivityDaSet.forEach(element => {
          if (element) {
            element.forEach(element2 => {
              // console.log ('Presa ', element);
              act_set += element2.SET_ID + ',';
            });
          }
        });
        if (act_set !== '') {
          act_set = act_set.substring(0, act_set.length - 1);
        }
      } else {
        // // console.log(t.NumeroFrame, t.listaActivityName2[t.Activity2]);
        conta2 = 1;
        // this.datiTipiActivity.forEach(element => {
        //   if (t.Activity2 === element.id) {
        //     act_set = element.id;
        //   }
        //   conta2++;
        // });
        if (t.listaActivityName2[t.Activity2]) {
          act_set = t.listaActivityName2[t.Activity2].ID;
        }
      }
    }
    // // console.log('Activity Set', t.NumeroFrame, act_set);
    act_set = this.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static prendeActivityScelta(t) {
    let act_set = '';
    let conta2 = 0;

    if (t.Activity2 === 0) { // LATEST SELECTION
      // // console.log(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_set = t.stringaAGNoACT;
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
      } else {
        // // console.log(t.NumeroFrame, this.datiTipiActivity, t.Activity2, t.stringaAGNoACT, t.listaActivityName2);
        conta2 = 1;
        this.datiTipiActivity.forEach(element => {
          if (t.Activity2 === element.id) {
            act_set = t.stringaAGNoACT;
          }
          conta2++;
        });
      }
    }
    // // console.log('Activity Set', act_set);
    act_set = Utils.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static prendeActivitySceltaGrafici(t) {
    let act_set = '';
    let conta2 = 0;

    if (t.Activity2 === 0) { // LATEST SELECTION
      // // console.log(this.act_setDelPuntoClickatoSullaMappa, t.listaActivityName2);
      conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            act_set = t.stringaAGNoACT;
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL SELECTION
      } else {
        // // console.log(t.NumeroFrame, this.datiTipiActivity, t.Activity2, t.stringaAGNoACT, t.listaActivityName2);
        /* conta2 = 1;
        this.datiTipiActivity.forEach(element => {
          if (t.Activity2 === element.id) {
            act_set = t.stringaAGNoACT[conta2];
          }
          conta2++;
        }); */
        act_set = t.listaActivityName2[t.Activity2].NAME;
      }
    }
    // // console.log('Activity Set', act_set);
    act_set = this.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static  ritornaStringPerActivitySet(t) {
    const modalitaActivitySet = t.Activity2;
    let act_set = '';

    switch (modalitaActivitySet) {
      case -1:
        let conta = 1;
        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME !== 'empty') {
            act_set += ('geo_act_set_name_' + conta + ':' + element.NAME + ';');
            conta++;
          }
        });
        if (act_set !== '') {
          act_set = act_set.substring(0, act_set.length - 1);
        }
        break;
      case 0:
        act_set = 'geo_act_set_name_1:' + Utils.act_setDelPuntoClickatoSullaMappa;
        break;
      default:
        act_set = 'geo_act_set_name_1:' + t.act_set;
        break;
    }
    // // console.log('Act set ritornata:', act_set);

    return act_set;
  }

  static  ritornaStringPerActivitySetAPoint(t, act_set_p) {
    if (t.activity2) {
      // // console.log(t.activity2)
      const modalitaActivitySet = t.Activity2;
      let act_set = '';

      switch (modalitaActivitySet) {
        case 0:
          act_set = act_set_p;
          break;
        default:
          act_set = t.act_set;
          break;
      }
      // // console.log('Act set ritornata:', act_set);

      return act_set;
    } else {
      return act_set_p;
    }
  }

  static  ritornaStringPerActivitySetAGrafici(t) {
    const modalitaActivitySet = t.Activity2;
    let act_set = '';

    // // console.log(modalitaActivitySet);
    switch (modalitaActivitySet) {
      case -1:
        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME !== 'empty') {
            act_set += ('geo_act_set_name = \'' + element.NAME + '\' or ');
          }
        });
        if (act_set !== '') {
          act_set = '(' + act_set.substring(0, act_set.length - 4) + ')';
        }
        break;
      case 0:
        act_set = Utils.act_setDelPuntoClickatoSullaMappa;
        break;
      default:
        act_set = t.act_set;
        break;
    }
    // // console.log('Act set ritornata:', act_set);

    return act_set;
  }

  static  ritornaStringPerActivitySetEventSummary(t) {
    const modalitaActivitySet = t.Activity2;
    let act_set = '';

    // // console.log(t.listaActivityName2);
    switch (modalitaActivitySet) {
      case -1:
        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME !== 'empty') {
            act_set += (element.ID + ',');
          }
        });
        if (act_set !== '') {
          act_set = act_set.substring(0, act_set.length - 1);
        }
        // // console.log('-1', act_set);
        break;
      case 0:
        act_set = Utils.act_setDelPuntoClickatoSullaMappa;

        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME === act_set) {
            act_set = element.ID;
          }
        });
        // // console.log('0', act_set);
        break;
      default:
        // act_set = t.act_set;

        t.listaActivityName2.forEach(element => {
          if (element && element.NAME && element.NAME !== '' && element.NAME === t.act_set) {
            act_set = element.ID;
          }
        });
        // // console.log('>0', act_set);
        break;
    }
    // // console.log('Act set ritornata:', act_set);

    act_set = Utils.toglieVirgoleInutili(act_set);
    return act_set;
  }

  static  creaRangeSelezionato(q, tms) {
    if (this.range === undefined) {
      if (this.rangeDiSecondiPerMille !== undefined) {
        this.range = this.rangeDiSecondiPerMille;
        // // console.log('RANGE definito', this.range);
      } else {
        this.range = 1000;
        // console.log('RANGE non definito. Imposto 1000 come default');
      }
    } else {
      // // console.log('RANGE già definito', this.range);
    }
    // // console.log('Tms:', tms, new Date(tms), this.range);
    if (tms) {
      const dInizio = ((new Date(tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) - (this.range / 2));
      const sInizio = this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
      const dFine = ((new Date(tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) + (this.range / 2));
      const sFine = this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

      // // console.log(this.tmsSelezionato, typeof(this.tmsSelezionato));

      this.tmsInizio = sInizio;
      this.tmsFine = sFine;

      this.rangeSelezionatoStampa = sInizio + '<br />' + sFine;
      // // console.log('Range:', q, sInizio + ';' + sFine);
    }
  }

  static  aggiornaTmsStringa(t) {
    if (t && t !== null) {
      // // console.log('Aggiorna TMS', t);
      if (typeof(t) === 'string') {
        Utils.tmsSelezionatoStringa = t.replace('Z', ' ').replace('T', ' ');
      } else {
        Utils.tmsSelezionatoStringa = (Utils.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC')).replace('Z', ' ').replace('T', ' ');
      }
      if (this.isNumeric(t)) {
        Utils.tmsSelezionatoStringa = (Utils.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC')).replace('Z', ' ').replace('T', ' ');
      }
      if (this.tmsSelezionatoStringa.indexOf('.') > -1) {
        this.tmsSelezionatoStringa = this.tmsSelezionatoStringa.substring(0, this.tmsSelezionatoStringa.indexOf('.'));
      }
      setTimeout(() => {
        this.tmsSelezionato = this.tmsSelezionatoStringa;
      }, 100);
    }
  }

  /*  ricalcolaRange(t, tms) {
    const dInizio = ((new Date(tms).getTime()) - (this.range));
    const sInizio = this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    const dFine = ((new Date(tms).getTime()) + (this.range));
    const sFine = this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    this.rangeSelezionato[t.frameAttivo][t.NumeroFrame] = sInizio + ';' + sFine + ';';
    // // console.log('Range modificato:', this.rangeSelezionato);
    if (sInizio !== null && sFine !== null) {
      this.rangeSelezionatoStampa = sInizio + '<br />' + sFine;
    } else {
      this.rangeSelezionatoStampa = '';
    }
  } */

  static  contaErrori(csv) {
    if (csv === undefined) {
      return -1;
    } else {
      if (csv.length === 0 || csv.trim === '') {
        return -2;
      } else {
        // // console.log(csv.length);
        let errori = 0;
        let err = '';
        csv.forEach(element => {
          // // console.log(element[0]);
          if (element[0].indexOf('<ServiceException') > -1) {
            errori++;
            // if (element[0].indexOf('Detail:') > -1) {
            //   // console.log('ERRORE: ' + element);
            // }
          }
          if (errori > 0) {
            if (errori === 1) {
              err += 'ERRORE: ';
            }
            let ee = JSON.stringify(element);
            ee = ee.replace('[', '');
            ee = ee.replace(']', '');
            ee = ee.trim() + ' ';
            err += ee;
          }
        });
        if (err !== '') {
          ExternalUtilities.visualizzaAlert('ATTENZIONE!!! Errore nella query. Visualizzare la console');
          // console.log(err);
        }

        return errori;
      }
    }
  }

  static tornaSla(t) {
    let sla = '';

    // // console.log('Sla attuale:', t.NumeroFrame, t.slaValue2);
    if (t.slaValue2 || t.slaValue2 === 0) {
      // if (typeof(t.slaValue2) === 'object') {
        // // console.log('Converto sla globale', t.NumeroFrame, t.slaValue2);
        // if (t.slaValue2.NAME === environment.stringaGlobalSettingSLA || t.slaValue2.NAME === '<Global Template>') {
          // // console.log(t.datiSlaDT);
          if (t.datiSlaDT && t.datiSlaDT !== null && t.datiSlaDT !== 'empty grid') {
            t.datiSlaDT.forEach(element => {
              if (element.ID === t.slaValueGlobale2) {
                sla = element.NAME;
              }
            });
          }
        // } else {
        //   if (t.slaValue2.NAME === environment.stringaGlobalSettingSLA || t.slaValue2.NAME === '<Global Template>') {
        //    if (t.datiSlaDT && t.datiSlaDT !== null && t.datiSlaDT !== 'empty grid') {
        //       t.datiSlaDT.forEach(element => {
        //         if (element.ID === t.slaValueGlobale2) {
        //           sla = element.NAME;
        //         }
        //       });
        //     }
            // // console.log('Ritorno SLA normale convertito da globale ',t.NumeroFrame, sla);
        //   } else {
        //     sla = t.slaValue2.NAME;
            // // console.log('Ritorno SLA normale ', t.NumeroFrame, sla);
        //   }
        // }
      // } else {
      //   sla = this.tornaSla2(t);
        // // console.log('Ritorno SLA2 ', t.NumeroFrame, sla);
      // }
    }

    return sla;
  }

  static  tornaIDSla(t) {
    let sla = '';

    // // console.log('Sla attuale:', t.NumeroFrame, t.slaValue2);
    if (t.slaValue2 || t.slaValue2 === 0) {
      // if (typeof(t.slaValue2) === 'object') {
        // // console.log('Converto sla globale', t.NumeroFrame, t.slaValue2);
        // if (t.slaValue2.NAME === environment.stringaGlobalSettingSLA || t.slaValue2.NAME === '<Global Template>') {
          // // console.log(t.datiSlaDT);
          if (t.datiSlaDT && t.datiSlaDT !== null && t.datiSlaDT !== 'empty grid') {
            t.datiSlaDT.forEach(element => {
              if (element.ID === t.slaValueGlobale2) {
                sla = element.ID;
              }
            });
          }
        // } else {
        //   if (t.slaValue2.NAME === environment.stringaGlobalSettingSLA || t.slaValue2.NAME === '<Global Template>') {
        //     if (t.datiSlaDT && t.datiSlaDT !== null && t.datiSlaDT !== 'empty grid') {
        //       t.datiSlaDT.forEach(element => {
        //         if (element.ID === t.slaValueGlobale2) {
        //           sla = element.ID;
        //         }
        //       });
        //     }
            // // console.log('Ritorno SLA normale convertito da globale ',t.NumeroFrame, sla);
        //   } else {
        //     sla = t.slaValue2.ID;
            // // console.log('Ritorno SLA normale ', t.NumeroFrame, sla);
        //   }
        // }
      // } else {
      //   sla = this.tornaSla2ID(t);
        // // console.log('Ritorno SLA2 ', t.NumeroFrame, sla);
      // }
    }

    return sla;
  }

  static  tornaSla2(t) {
    let sla = '';
    // // console.log('Sla impostato in locale:', t.NumeroFrame, t.slaValue2, t.slaName2);
    // if (t.slaValue2 === -1) {
    //   if (t.datiSla) {
    //     t.datiSla.forEach(element => {
    //       if (element.ID === t.slaValueGlobale2) {
    //         sla = element.NAME;
    //       }
    //     });
    //   }
      // // console.log('Sla impostato come globale per il frame ' + t.NumeroFrame, sla);
    // } else {
    if (t.datiSlaDT) {
      t.datiSlaDT.forEach(element => {
        if (element.ID === t.slaValue2) {
          sla = element.NAME;
        }
      });
    }
      // // console.log('Sla impostato come locale per il frame ' + t.NumeroFrame, sla);
    // }

    return sla;
  }

  static  tornaSla2ID(t) {
    let sla = '';
    // // console.log('Sla impostato in locale:', t.NumeroFrame, t.slaValue2, t.slaName2);
    // if (t.slaValue2 === -1) {
    //   if (t.datiSla) {
    //     t.datiSla.forEach(element => {
    //       if (element.ID === t.slaValueGlobale2) {
    //         sla = element.ID;
    //       }
    //     });
    //   }
      // // console.log('Sla impostato come globale per il frame ' + t.NumeroFrame, sla);
    // } else {
    if (t.datiSlaDT) {
      t.datiSlaDT.forEach(element => {
        if (element.ID === t.slaValue2) {
          sla = element.ID;
        }
      });
    }
      // // console.log('Sla impostato come locale per il frame ' + t.NumeroFrame, sla);
    // }

    return sla;
  }

  static  tornaGlobale(t) {
    // // console.log('Valore mapType', t.NumeroFrame, t.mapType);
    if (t.mapType2 === -1) {
      return true;
    } else {
      return false;
    }
  }

  static  creaMatrice(x, y, valore) {
    const m = new Array();
    for (let i = 0; i <= x; i++) {
      m.push(new Array());
      for (let j = 0; j <= y; j++) {
        if (valore && valore !== true && valore !== false && !this.isNumeric(valore) && valore !== null && !ExternalUtilities.isArray(valore)) {
          const v = valore.replace('***CONT***', i);
          m[i].push(v);
        } else {
          m[i].push(valore);
        }
      }
    }
    // // console.log(m);
    return m;
  }

  static  creaVettore(x, valore) {
    const m = new Array();
    for (let j = 0; j <= x; j++) {
      if (valore && valore !== true && valore !== false && !this.isNumeric(valore) && valore !== null) {
        const v = valore.replace('***CONT***', j);
        m.push(v);
      } else {
        m.push(valore);
      }
    }
    // // console.log(m);
    return m;
  }

  static  creaMatriceMisure(x, y, z) {
    const m = new Array();
    for (let i = 0; i <= x; i++) {
      m.push(new Array());
      for (let j = 0; j <= y; j++) {
        m[i].push(new Array());
        for (let k = 0; k <= z; k++) {
          m[i][j].push('');
        }
      }
    }
    // // console.log(m);
    return m;
  }

  static  salvaCSV(righeJson, nomeFile) {
    let s = '';
    let i = '';
    let riga = 0;
    // // console.log(righeJson);
    righeJson.forEach(element => {
      let r = JSON.stringify(element); //  JSON.stringify(element.properties);
      if (r && r !== '') {
        r = r.replace('{', '');
        r = r.replace('}', '');
        const r2 = r.split(';');
        // // console.log(r2);
        r2.forEach(element2 => {
          const r3 = element2.split(',');
          r3.forEach(element3 => {
            const r4 = element3.split(':');
            if (riga === 0) {
              let rr4 = r4[0];
              while (rr4.indexOf('"') > -1) {
                rr4 = rr4.replace('"', '');
              }
              i += rr4 + ';';
            }
            let rr3 = r4[1];
            while (rr3.indexOf('"') > -1) {
              rr3 = rr3.replace('"', '');
            }
            s += rr3 + ';';
          });
        });
        if (riga === 0) {
          s = i + '\n' + s;
        }
        s += '\n';
        riga++;
      }
    });
    // // console.log(s);
    // const FileSaver = require('file-saver');
    const blob = new Blob([s], {type: 'text/plain;charset=utf-8'});
    // FileSaver.saveAs(blob, nomeFile);

    download(blob, nomeFile, 'text/plain;charset=utf-8');
  }

  static sistemaNomeFrame(t, cosa) {
    let nf = cosa;
    const caratteriDaEliminare = ' <>+:=?*|/\\&%"#.,';
    for (let i = 0; i < caratteriDaEliminare.length; i++) {
      const carattere = caratteriDaEliminare.substring(i, i + 1);
      // // console.log(carattere);
      while (nf.indexOf(carattere) > -1) {
        nf = nf.replace(carattere, '_');
      }
    }
    return nf;
  }
}

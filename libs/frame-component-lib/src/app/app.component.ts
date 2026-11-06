import { AggiustaArrayComponent } from './aggiustaarray.component';
import { ExternalApiService } from './modules/framecomponent/services/externalapi.service';
import { ExternalHttpClient } from './modules/framecomponent/services/externalhttpclient.service';
// import {isNumeric} from 'rxjs/util/isNumeric';
import OlView from 'ol/View';
// import {transform} from 'ol/proj';
import { fromLonLat } from 'ol/proj';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
// import { ExternalFrameComponent } from './modules/framecomponent/frame.component';
import { environment } from './../environments/environment.prod';
import { AfterContentChecked, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { ExternalSessionService } from './modules/framecomponent/services/externalsession.service';
import ExternalUtilities from './modules/framecomponent/ExternalUtilities.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as CanvasJS from '../assets/js/canvasjs.min.js';

import Utils from './Utilities.component';
import { ActivityDiTestComponent } from './activityDiTest.component';
import { LogComponentInterno } from './modules/framecomponent/log.component';
// import { trigger } from '@angular/animations';
// import { MatDialog } from '@angular/material/dialog';
// import { GestioneGrafici } from './modules/framecomponent/elaborations/GestioneGrafici.component';
// import { TransitiveCompileNgModuleMetadata } from '@angular/compiler';
// import Utils from './Utilities.component';

// npm run build:stats
// npm run analyze

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit, AfterContentChecked {
  static ultimaVoltaCambioTms = 0;
  // static tmsAttuale = '';

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  Utils = Utils;
  ExternalUtilities = ExternalUtilities;
  canvJS = CanvasJS;

  dimensioniJSON = '';
  permessiDataView;
  refreshAccentratore;
  listaWorkspaces;
  groupName;
  operatorID;
  listaEventiSE;
  testJson = false;
  pagine;
  paginaAttuale = 1;
  
  bbox = undefined;
  bboxO;
  bboxZ;
  rigaMG;
  rigaCG;
  rigaArfcn;
  squareMetersO = '50';
  squareMetersZ = '50';
  cellSet = undefined;
  mapTypePerStampa = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  tipoLegendaIstogrammi;

  // IMPOSTAZIONI MASCHERA
  // nonNascondereCampi = true;
  modalitaRealTimeAttiva2 = false;

  numeroZeroFrame = 1;
  numeroPrimoFrame = 2;
  numeroSecondoFrame = 9;
  numeroTerzoFrame = 4;
  
  scelta = this.actDiTest.actMi5G0223; // actRM4G; // actSetMI19; // .; // actSetPerImmagine; // actFWBO5g070623; //actSetSDTU000269;

  timeRangeDSFStart = this.scelta.dataInizio;
  timeRangeDSFStop = this.scelta.dataFine;
  // per impostare le date automatiche mettere a true sopra e settare le righe da 750 (circa)

  impostaDateAttuali = false;
  centroImpostato;
  nomeAntenne = undefined;

  activitySet = [-1, this.scelta.ActNumero, -1, -1, -1]; 

  utilizzoMemoria = false;

  progetto0 = false; // Per l'eseguito in progetto utilizzare questo e lasciare inalterato questo sotto
  debug0 = false;
  tipoFrameProgetto0 = 'M';
  eseguitoinProgetto0 = false;
  permessoFMAM0 = true;
  progettoEsterno0 = 'FleetManager';

  progetto1 = false; // Per l'eseguito in progetto utilizzare questo e lasciare inalterato questo sotto
  debug1 = false;
  tipoFrameProgetto1 = 'M';
  eseguitoinProgetto1 = false;
  permessoFMAM1 = true;
  progettoEsterno1 = 'FleetManager'; // 'DD;Cluster';

  progetto2 = false; // Per l'eseguito in progetto utilizzare questo e lasciare inalterato questo sotto
  debug2 = false;
  tipoFrameProgetto2 = 'M';
  eseguitoinProgetto2 = false;
  permessoFMAM2 = true;
  progettoEsterno2 = 'FleetManager';

  progetto3 = false; // Per l'eseguito in progetto utilizzare questo e lasciare inalterato questo sotto
  debug3 = false;
  tipoFrameProgetto3 = 'M';
  eseguitoinProgetto3 = false;
  permessoFMAM3= true;
  progettoEsterno3 = 'FleetManager';
  // IMPOSTAZIONI MASCHERA

  accordionDebug = true;
  righePerPaginazioneAutomatica = -1;
  frameEditorAttivo = false;
  exportKML;
  additionalLayer;
  microfonoAttivo = false;
  nuovoTmsDelta = '';
  editMode = false;

  limitaRighePerDebug = {
    numeroRighe: -1,
    numeroCampi: -1,
    getOtherStyle: true,
    getCellStyle: true,
    eseguiAutoFit: true,
    controllaSelezione: true,
    allineamentiVari: true
  }

  resizeFrame = '';
  // canvasJs: CanvasJS = CanvasJS();

  datiZoomMap = [
    { CODE: 0, VALUE_STR: 'No' },
    { CODE: 1, VALUE_STR: 'Position' },
    { CODE: 2, VALUE_STR: 'Position and Zoom' },
  ]
  zoomMap = 2;

  AppComp = AppComponent;
  lastQ = -1;

  // nuoviDatiPerCambioFrame;

  refreshDaTasto = [ false, false, false, false, false, false, false, false, false, false ];

  posXPopupEvents = 50;
  posYPopupEvents = 150;
  popupVisibile = false;

  mostraSceltaAGNoACT = false;

  forzaSelezioneActivitySet = ['', '', '', '', '', ''];
  forzaSelezioneDashboard = '';
  centroAttuale = ['', '', '', '', '', '', '', '', '', '', ''];

  pulisceFiltroActScelta = [false, false, false, false, false];

  campoClickatoAE = '';
  frameAttivoClickatoAE;
  NumeroFrameClickatoAE;
  datiEventiDaMettere;

  isPlaying = false;
  secondiSpostamento = 1;
  subscribePlay;
  geoFilterClick = -1;

  // Utilities = Utils;
  listaActivitySets = [null, null, null, null, null];

  sessioneID;
  lastDays = -1;

  ridisegaMappa;

  // nomiFrames = ['', 'Frame 01', 'Frame 02', 'Frame 03', 'Frame 04', 'Frame 05', 'Frame 06', 'Frame 07',
  //   'Frame 08', 'Frame 09', 'Frame 10'];

  mappeStyle: any[] = [
    { id: 1, name: 'Band' },
    { id: 2, name: 'Line' },
    { id: 3, name: 'Coaxial' },
  ];

  htmlCode;
  appoHtml = '';
  subscribe;
  mediaLon;
  mediaLat;
  debugCaricamentoDashboard = false;
  dbWorkOnDashboard = false;
  caricataComboDashboard = false;
  caricataComboActivitSet = false;
  caricatoDashboardGroup = false;
  caricatoScenario = false;
  caricatoRAT = false;
  caricatoBand = false;
  caricatoNotebook = false;
  caricatoUEProf = false;
  caricatoActivityGroup = false;
  caricatoSlaGroup = false;
  caricateMeasures = false;
  caricatiLookUp = false;
  caricatiAddLayers = false;
  caricatoClusterGroup = false;
  caricatiMosaicStyle = false;
  slaManagerVisible = false;
  espandiTreeView = [undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, undefined];
  collassaTreeView = [undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, undefined];
  copyAllClips = [undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, undefined];

  nomeSet1 = '';
  // styleSize = 14;
  // styleSize2 = 14;
  graficoAggiornatoDaTutti = true;
  resettaValoriFrame = false;
  tipoMappeCaricate;
  refreshQuanteMisure = false;
  coordinate;
  coordinateConClick;
  rotation;
  valoreTimeSpan = 5;
  valoreTimeSpanRange = 5;
  activityPassateDaScegliere;
  numeroSetPerActivityScelta = -1;
  numeroFramePerActivityScelta = -1;
  cambiatoAGNACTDopoScelta = ['', '', '', '', '', '', '', '', '', '', ''];
  // activitySceltaStampa = '';
  ricaricaRaggi;

  ultimaVoltaHtml = 0;

  ridisegnaTutto = null;

  calcolaCentro = false;
  // extent;

  ridisegnaGrafici = undefined;

  pulisceFiltroDashboard;
  pulisceFiltroActSet = [false, false, false, false, false, false, false, false, false, false, false];
  pulisceFiltroMaps;
  pulisceFiltroMapsStyle;
  pulisceFiltroATS;
  pulisceFiltroATSR;
  pulisceFiltroSSTS;
  pulisceFiltroSG;
  styleSizes = [
    { id: -1, name: '<Global Style Size>'},
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 6, name: '6' },
    { id: 12, name: '12' },
    { id: 16, name: '16' },
    { id: 20, name: '20' },
  ];
  styleSizes2 = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 6, name: '6' },
    { id: 12, name: '12' },
    { id: 16, name: '16' },
    { id: 20, name: '20' },
  ];
  styleSizeG = 12;

  tmsSelezionatoPerGrafico = ['', '', '', '', '', '', '', '', '', '', ''];
  massimizzata = [ false, false, false, false, false, false, false, false, false, false];

  refreshMap = [false, false, false, false, false, false, false, false, false, false, false];
  settaMascheraVuota = false;

  datiDashboard;
  datiDashboardPerPassaggio;
  lastDashboard;
  dashboardGroup;
  clusterGroup;
  clusterGroup2;
  activityGroup;
  slaGroup;
  datiSlaDT;
  datiSlaDTi;
  datiSLA;
  slaValueGlobale = undefined;

  heightOfHeaderApp = 5;
  heightOfFramesApp = 95;

  mappeGlobal;
  larghezzaContenitore;

  dashboardSelezionata;
  nomeDashboardSelezionata;
  nomeDashboardSelezionata2;
  dashboardSelected = 'start';

  dashboardName;
  dashboardFolder;
  dashboardOperator;
  dashboardGroupName;
  dashboardSelectedDescription;
  MappaOGraficoTutti;

  measureData;
  datiLookUp;
  datiFolders;
  datiMosaicStyle;

  valoriComboSelArea = [
    {
      id: 1,
      name: 'Zoomed Map'
    },
    {
      id: 2,
      name: 'Polygon'
    },
    /* {
      id: 3,
      name: 'Draw Polygon'
    } */
  ];
  comboSelArea = 1;

  impostazioni: any = {
    frameAttivo: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    maskSize: [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
    maskSizeHor: [33, 33, 33, 34],
    // maskVisibleHor: [true, false, false, false],
    styleVis: 1,
    maskVisible: [true, false, false, false, false, false, false, false, false, false],
    maskDisabled12: true,
    maskDisabled34: true,
    maskDisabled56: true,
    maskDisabledH1: true,
    heightOfHeader: 5,
    heightOfFrames: 95,
    frameName: undefined,
    // titoloFrame: undefined,
    barraAperta: undefined,
    frameDesc: undefined,
    MappaOGrafico: undefined,
    overviewZoom: undefined,
    isCheckedServingCell: undefined,
    isCheckedAntenne: undefined,
    tipoMappa: undefined,
    netTech: undefined,
    // slaValue: undefined,
    slaName: undefined,
    activity: undefined,
    plmn: undefined,
    bandwidth: undefined,
    FiltroAntenna: '',
    FiltroAntennaSel: '',
    // isVisibleCheckedAntenne: 1,
    isCheckedPath: 1,
    isCheckedCoverage: 1,
    isVisibleCheckedServingCell: 1,
    signalCoverage: '',
    signalPath1: '',
    selectedPath1: 0,
    selectedCoverage1: 0,
    // layerMappa: undefined,
    mapType: undefined,
    latPartenza: 0,
    lonPartenza: 0,
    viewGlobal: true,
    // Maximized: '0',
    // maximized: [null, null, null, null, null, null, null, null, null, null, null],
    listaEventi: undefined,
    mostraGrafico: [null, null, null, null, null, null, null, null, null, null, null],
    tabSelezionato: undefined,
    measure: undefined,
    countHistogram: undefined,
    checkSeverity: undefined,
    currZoom: undefined,
    viewAs: undefined,
    overlay: undefined,
    overlayCluster: undefined,
    timeFilter: undefined,
    viewDefinition: undefined,
    // viewOlG: undefined,
    // viewOlL: undefined,
    dimensioniFinestraLegenda:  [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    histDisplayAs: undefined,
    columnsBars: undefined,
    showPlanimetry: undefined,
    // columnsSettings: undefined,
    tipoEvento: undefined,
    eventiSceltiES: undefined,
    eventiSceltiGlobaliES: undefined,
    fixedSeconds: undefined,
    styleSize: undefined,
    actualDimeDrawer: 350,
    cellType: undefined,
    frameMassimizzato: false,
    filtriEventi: undefined,
    /* filtroEventiCol1: undefined,
    filtroEventiCol2: undefined,
    filtroEventiCol3: undefined,
    filtroEventiCol4: undefined, */
    isCheckedShowPaths: undefined,
    isCheckedShowSelectedPaths: undefined,
    addLayers: undefined,
    opacity: undefined,
    shownEvents: undefined,
    modificaChart: undefined,
    doNotSetGM: undefined,
    showRays: undefined,
    showMeasures: undefined,
    squareMeters: undefined,
    globalMeasure: undefined,
    globalMeasureArfcn: undefined,
    measureType: undefined,
    mosaicStyle: undefined,
    sartPosition: undefined,
    // bboxOZ: undefined,
    geoFilter: undefined,
    measureSMS: undefined,
    showMeasuresS: undefined,
    tipoDataset: undefined,
    mappeMS: undefined,
    clusterMeasure: undefined,
    textFilter: undefined,
    // textLov: undefined,
    addGlobalLayer: undefined,
    measureRCM: undefined,
    tipoMisuraGlobale: undefined,
    tipoMisuraGlobaleArfcn: undefined,
    eventsMeasure: undefined,
    histDisplayTutto: undefined,
    showRaysAllLayer: undefined,
    correlation: undefined,
    isNonSyncEventTime: undefined,
    showVoiceCallMeasures: undefined,
    showDataMeasures: undefined,
    showCoverageMeasures: undefined,
    clusterMeasure2: undefined,
    // lov: undefined,
    textFilter2: undefined,
    showAxisX: undefined,
    misureAddizionaliTCRUN: undefined,
    heightCHart: undefined,
    doubleGraph: undefined,
    listaCampiTCRP: undefined,
    dimensioniSplitTcRun: undefined,
    impostazioniPivot: undefined,
    tipoDatiLayout: undefined,
    showAdditionalLayers: undefined,
    viewModeMS: undefined,
    flowTypeMS: undefined,
    isStandAloneMR: undefined,
  };
  activityName = undefined;
  // viewOlG = undefined;
  // viewOlL = undefined;
  slaValue = undefined;

  newarray = [[], [], [], [], [], [], [], [], [], [], []];

  designInfo = [null, false, false, false, false, false, false, false, false, false, false];
  dimeDrawer = 3;
  dimeDrawerInizio = 3;
  nonChiudereDrawer = false;

  isVisibileBars = false;
  dashboardAccordionOpen = true;
  activityAccordionOpen = false;
  settingsAccordionOpen = false;
  filtersAccordionOpen = false;
  dataSetAccordionOpen = false;
  // datiPointMeasures = '';
  // datiActivityEvents = '';
  isSyncTms = false;

  // timeRangeDSFStart = undefined;
  // timeRangeDSFStop = undefined;

  ueProf;
  ueProfScelto;
  pulisceFiltroUE = false;
  rat;
  ratScelto;
  pulisceFiltroRat = false;
  band;
  bandScelto;
  pulisceFiltroBand = false;
  scenario;
  scenarioScelto;
  pulisceFiltroScenario = false;
  notebook;

  mapTypeG;
  mapTypeS = -1;
  activitySetName = [-1, '', '', '', ''];
  // activityName = [-1, '', '', '', ''];
  nomeActivitySet;

  mostraNewFrame = true;
  refreshMaschera = [null, null, null, null, null, null, null, null, null, null, null];

  x: any = {};

  impostazioniDefault;

  activityComponentShowed = false;
  dashboardEditComponentShowed = false;
  dashboardListComponentShowed = false;
  dashboardNameComponentShowed = false;
  numeroActSet;
  activitySelezionata;
  activitySelezionataDaPassare;
  activitySelezionataA = [null, null, null, null, null, null, null, null, null, null, null];

  csvView;
  // viewOlLocal = [null, null, null, null, null];

  userName = 'Luigi.Pecce';
  ConnessioneStabilita = '';
  dashboardSelected2;
  datiActivitySet;
  opacitaBottone = .5;

  impostazioniIniziali;
  differenzeDiImpostazioni;

  sessId;
  gname;
  uname;
  collegatoDaUrl = false;

  elem;

  // viewAsM = 1;
  overlayClusterG = '';
  pulisceFiltroOverlayCluster;
  subscribeStart;

  mosaicoSelezionato = undefined;
  clusterSelezionato = undefined;

  centroSpostatoManualmente;

  actSetVisibile1;
  actSetVisibile2;
  actSetVisibile3;
  actSetVisibile4;
  numeroActSetVisibili = -1;

  center_position;
  time_cursor_position;
  impostaValoriMascheraProgetto = false;

  datiAddLayers;

  quadratoMappa;
  cellaSelezionata;
  coordinateSRLE;
  lastSelectedLayer;

  UtilitiesInterne = Utils;

  static CambioTmsSelezionato(UtilitiesPassate, tms, daDove) {
      // console.log('Cambio tms selezionato. TMS: ', tms);
      // console.log('Cambio tms selezionato. Provenienza', daDove);
  // if (tms > 0) {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato', tms);

      if (tms === 0 || tms === null) {
        return;
      }

      const ora = new Date().getTime();
      if (ora - AppComponent.ultimaVoltaCambioTms > 1000) {
        AppComponent.ultimaVoltaCambioTms = ora;

        // if (tms === 0) {
        //   this.Utilities.tmsSelezionato = JSON.parse(JSON.stringify(tms));
        // } else {

        if (UtilitiesPassate.tmsInizio && UtilitiesPassate.tmsFine) {
          const rInizio = new Date(UtilitiesPassate.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
          const rFine = new Date(UtilitiesPassate.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();

          const t = new Date(tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();

          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t, this.Utilities.tmsInizio, this.Utilities.tmsFine);
          if (t < rInizio || t > rFine) {
            // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio range', t, rInizio, rFine);
            UtilitiesPassate.creaRangeSelezionato('1', tms);
            UtilitiesPassate.cambioTimeRange = new Date();
          }
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Reimposto range', tms);
          UtilitiesPassate.creaRangeSelezionato('2', tms);
          UtilitiesPassate.cambioTimeRange = new Date();
        }

        UtilitiesPassate.aggiornaTmsStringa(tms);

        // setTimeout(() => {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Range di riferimento:', this.Utilities.rangeSelezionato);
        if (tms === 0) {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno il tms di riferimento');
          if (UtilitiesPassate.tmsSelezionato !== undefined) {
            UtilitiesPassate.tmsSelezionato = JSON.parse(JSON.stringify(UtilitiesPassate.tmsSelezionato));
          }
        } else {
          if (tms.indexOf('.') > -1) {
            tms = tms.substring(0, tms.indexOf('.'));
          }
          UtilitiesPassate.tmsSelezionato = tms;
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto il tms di riferimento:', UtilitiesPassate.tmsSelezionato);
        }
          // AppComponent.tmsAttuale = this.Utilities.datePipe.transform(this.Utilities.tmsSelezionato, 'yyyy-MM-dd HH:mm:ss.SSS');
        // }, 100);
        // }
      }
    // }
  }

  public getJSON(): Observable<any> {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, indirizzo);
    
    // console.log('Indirizzo JSON:', indirizzo);

    return this.http.get(this.UtilitiesInterne, indirizzo);
  }

  indirizzoServer;

  constructor(
    private http: ExternalHttpClient,
    private sessionService: ExternalSessionService,
    private apiService: ExternalApiService,
    private sanitizer: DomSanitizer,
    public datePipe: DatePipe,
    private aggiustaArray: AggiustaArrayComponent,
    private location: Location,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private actDiTest: ActivityDiTestComponent,
    // public UtilitiesInterne: Utils
    public Log: LogComponentInterno
  ) {
    const d0 = localStorage.getItem('debug0');
    const d1 = localStorage.getItem('debug1');
    const d2 = localStorage.getItem('debug2');
    const d3 = localStorage.getItem('debug3');
    const tj = localStorage.getItem('testJson');
    if (d0 !== null) { 
      this.debug0 = (d0 === 'S');
    } else { 
      this.debug0 = false; 
    }
    if (d1 !== null) { 
      this.debug1 = (d1 === 'S');
    } else { 
      this.debug1 = false; 
    }
    if (d2 !== null) { 
      this.debug2 = (d2 === 'S');
    } else { 
      this.debug2 = false; 
    }
    if (d3 !== null) { 
      this.debug3 = (d3 === 'S');
    } else { 
      this.debug3 = false; 
    }
    if (tj !== null) { 
      this.testJson = (tj === 'S');
    } else { 
      this.testJson = false; 
    }

    this.getJSON().subscribe((data: any) => {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'getJSON:', data);
      // console.log('Dati JSON:', data);

      /* const b = data; //  JSON.parse(data._body);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, b);

      // Utils.indirizzoGEOServer = JSON.parse(data._body).indirizzoGEOServer;
      Utils.indirizzoServer = b.indirizzoServer;
      Utils.indirizzoGEOServer = b.serverGEOServer;
      if (b.eventsDisplayedRows)  {
        Utils.limitPerVirtual = b.eventsDisplayedRows;
      } else {
        Utils.limitPerVirtual = 60;
      }
      // alert(Utils.limitPerVirtual);

      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, b.Proxy.toUpperCase());
      Utils.linkIcone = b.linkIcone;
      Utils.serverPostRest = b.serverPostRest;
      this.indirizzoServer = b.serverPostRest;
      /* if (b.Proxy.toUpperCase() === 'TRUE') {
        Utils.facadeServerAddress = b.facadeServerAddressViaProxy;
      } else {
        Utils.facadeServerAddress = b.facadeServerAddressLocale;
      } * /
      Utils.urlRoot = b.urlRoot; */
      
      // console.log('Link icone:', Utils.linkIcone);

      // this.apiService.setUrl(Utils.facadeServerAddress);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, Utils.serverPostRest);

      /* let d1 = this.datePipe.transform(new Date(), 'dd-MM-yyyy', 'UTC');
      d1 += ' 00:00:00';
      let d2 = this.datePipe.transform(new Date(), 'dd-MM-yyyy', 'UTC');
      d2 += ' 20:00:00';

      this.timeRangeDSFStart = d1;
      this.timeRangeDSFStop = d2; */

      const b = data; // JSON.parse(data._body);
      
      // Nuova gestione della mail del 28/04/2026 13:16
      // Si possono mettere url assoluti oppure relativi
      // Se la urlroot è relativa assume l'indirizzo del sito
      let indirizzoCaricato =  window.location.href; // 'https://antsgraclient.ants-aubay.it/gdpsondamistral/geoantsweb/Mappe/'; //
      // console.log('Indirizzo di base 1: ', indirizzoCaricato);
      if (indirizzoCaricato.toLowerCase().indexOf('geoantsweb/') > -1) {
        indirizzoCaricato = indirizzoCaricato.substring(0, indirizzoCaricato.toLowerCase().indexOf('geoantsweb/'));
      }
      if (indirizzoCaricato.indexOf('?') > -1) {
        indirizzoCaricato = indirizzoCaricato.substring(0, indirizzoCaricato.indexOf('?'));
      }
      if (indirizzoCaricato.endsWith('/')) {
        indirizzoCaricato = indirizzoCaricato.substring(0, indirizzoCaricato.length - 1);
      }

      let urlRoot = b.urlRoot;
      if (urlRoot.length < 2) {
        urlRoot = indirizzoCaricato + "/";
      }
      if (urlRoot.toLowerCase().indexOf('geoantsweb/') > -1) {
        urlRoot = urlRoot.substring(0, urlRoot.toLowerCase().indexOf('geoantsweb/'));
      }
      if (urlRoot.endsWith('/')) {
        urlRoot = urlRoot.substring(0, urlRoot.length - 1);
      }
      if (urlRoot.toLowerCase().indexOf('http://localhost:4200') > -1) {
        urlRoot = 'https://antsgraclient.ants-aubay.it/gdpsondamistral'; // Qualsiasi indirizzo in caso di urlRoot /
      }

      Utils.urlRoot = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.urlRoot, true);
      Utils.linkIcone  = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
      // this.linkIcone = this.aggiungeIndirizzoAPathRelativo(indirizzoCaricato, b.linkIcone, true);
      let urlRootSenzaBarraFinale = urlRoot;
      if (urlRootSenzaBarraFinale.endsWith('/') && b.serverPostRest.startsWith(':')) {
        urlRootSenzaBarraFinale = urlRootSenzaBarraFinale.substring(0, urlRootSenzaBarraFinale.length - 1);
      }
      Utils.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRootSenzaBarraFinale, b.serverPostRest, true);
      Utils.indirizzoServer = Utils.serverPostRest;
      this.indirizzoServer = Utils.serverPostRest;
      Utils.indirizzoGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.serverGEOServer, true);

      if (b.eventsDisplayedRows)  {
        Utils.limitPerVirtual = b.eventsDisplayedRows;
      } else {
        Utils.limitPerVirtual = 60;
      }

      console.log('Indirizzo di base 1 frame: ', indirizzoCaricato);
      console.log('Indirizzo di base 2 frame: ', urlRoot);
      console.log('Indirizzo urlRoot frame: ', Utils.urlRoot);
      console.log('Indirizzo geoServer frame: ', Utils.indirizzoGEOServer);
      console.log('Indirizzo Icone frame: ', Utils.linkIcone);
      console.log('Indirizzo PostGrest frame: ', Utils.serverPostRest);
      // Nuova gestione della mail del 28/04/2026 13:16
      
      this.eseguiConnessione();
    });

    // // console.log('URL:' , window.location.href);
  }

  aggiungeIndirizzoAPathRelativo(pathIniziale, indirizzo, aggiungeBarra) {
    let ind = indirizzo;

    if (ind.toUpperCase().indexOf('HTTP:') === -1 && ind.toUpperCase().indexOf('HTTPS:') === -1) {
      if (ind.startsWith('/')) {
        ind = ind.substring(1, ind.length);
      }
      let barra = '';
      if (aggiungeBarra) {
        barra = '/';
      }
      ind = pathIniziale + barra + ind;
    }

    return ind;
  }

  checkEdge(event) {
    this.Utils.edge = event;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'edge:', event);
  }

  eseguiConnessione() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Constructor');
    this.route.queryParams.subscribe(params => {
      this.sessId = params['sess'];
      this.gname = params['gname'];
      this.uname = params['uname'];

      if (this.sessId && this.sessId !== undefined && this.sessId !== 'undefined') {
        setTimeout(() => {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'C\'è sessione. Mi collego: ', this.sessId);
          this.collegatoDaUrl = true;
          const dd = { username: this.uname };

          let pwd = '';
          const p = localStorage.getItem('H7-25-FC');
          if (p !== null) {
            pwd = p;
          } else {
            pwd = prompt("H7-25-FC", "");
            if (pwd === '') {
              alert('No!');
              return;
            }  else  {
              localStorage.setItem('H7-25-FC', pwd);
            }
          }

          this.EffettuaLogin(dd, this.sessId, this.gname, environment.nomeLogin, pwd);
          this.aggiornaLarghezzaContenitore();
          // this.impostazioniIniziali = JSON.parse(JSON.stringify(this.impostazioni));
          // this.checkDifferenceFromStartJSON();

          this.rinfrescaTuttiIframes();

          this.location.replaceState('/');
        }, 500);
      } else {
        /* setTimeout(() => {
          if (environment.clientTypeVersion === 'Debug') {
            // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Non c\'è sessione. Mi collego senza sessione');
            this.connettitiAMano();
          }
        }, 500); */
      }
    });

    this.connettitiAMano();
  }

  pulisciPassword() {
    localStorage.removeItem('H7-25-FC');
    alert('OK');
  }

  connettitiAMano() {
    this.collegatoDaUrl = true;

    let pwd = '';
    const p = localStorage.getItem('H7-25-FC');
    if (p !== null) {
      pwd = p;
    } else {
      pwd = prompt("H7-25-FC", "");
      if (pwd === '') {
        alert('No!');
        return;
      }  else  {
        localStorage.setItem('H7-25-FC', pwd);
      }
    }

    this.EffettuaLogin(null, null, null, environment.nomeLogin, pwd);
    this.aggiornaLarghezzaContenitore();
    // this.impostazioniIniziali = JSON.parse(JSON.stringify(this.impostazioni));
    // this.checkDifferenceFromStartJSON();
  }

  getDpi = function() {
    const div = document.createElement('div');
    div.style.height = '1in';
    div.style.width = '1in';
    div.style.top = '100%';
    div.style.left = '100%';
    div.style.position = 'absolute';

    document.body.appendChild(div);
    const dpi = div.offsetHeight;
    document.body.removeChild(div);
    return dpi;
  };

  /* beep() {
    var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
  } */

  ngOnInit() {
    // this.testaJson();

    // this.beep();

    /* setTimeout(() => {
      this.eseguitoinProgetto1 = true;
    }, 20000); */

    const d = new Date();
    d.setDate(d.getDate() - 7);

    let d1 = this.datePipe.transform(d, 'yyyy-MM-dd');
    d1 += ' 00:00:00';
    let d2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd', 'UTC');
    d2 += ' 20:00:00';

    if (this.impostaDateAttuali) {
      const dd1 = new Date(d1);
      const dd2 = new Date(d2);
      this.timeRangeDSFStart = new Date(d1).toString();
      this.timeRangeDSFStop = new Date(d2).toString();
    }

    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time start - stop', d1, d2);

    /* if (this.subscribeStart) {
      this.subscribeStart.unsubscribe();
    }
    this.subscribeStart = Observable.timer(0, 100)
      .take(32000)
      .subscribe(() => {
        if (Utils.serverPostRest !== '') {
          this.subscribeStart.unsubscribe();

          this.parte();

          ExternalUtilities.stringaAGNoACT = this.scelta.StringaAGN;
        }
    }); */

    const t = setInterval(() => {
      if (Utils.serverPostRest !== '') {
        clearInterval(t);

        const pagine = new Array();
        for (let i = 1; i <= 30; i++) {
          pagine.push({ id: i });
        }
        this.pagine = pagine;

        this.parte();

        ExternalUtilities.stringaAGNoACT = this.scelta.StringaAGN;

        this.nomeAntenne = 'TIM';
        this.tipoLegendaIstogrammi = 'LEFT';
      }
    }, 100);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.canvJS);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Charts', GestioneGrafici.charts);

    this.listaWorkspaces = [
      {
        DESCRIPTION: "",
        FOLDER: "Template",
        NAME: "TcRun (template)",
        SELECTED: false
      }
    ];

    
  }

  LeggeAttivazioneActSet() {
    const params = {
      cntx_id: this.sessioneID,
      v_operator_profile_id: null
    };
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(Utils, 'operator_profile_privilege__grid', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
        if (data) {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno login: ', data.DataTable);
          if (data.v_err_code && data.v_err_code === 2) {
            this.actSetVisibile1 = false;
            this.actSetVisibile2 = false;
            this.actSetVisibile3 = false;
            this.actSetVisibile4 = false;
            alert(data.v_failure_reason);
          } else {
            this.numeroActSetVisibili = 0;
            if (data.DataTable) {
              // const dd2 = data.OBJECT[0].object;
              const act_set_1 = data.DataTable.filter(x => x.PRIVILEGE === 'act_set_1');
              // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act Set 1', act_set_1);
              if (!act_set_1 || !act_set_1[0]) {
                this.actSetVisibile1 = false;
              } else {
                this.actSetVisibile1 = act_set_1[0].IS_ENABLED !== 'Y' ? false : true;
              }
              if (this.actSetVisibile1 === true) {
                this.numeroActSetVisibili++;
              }

              const act_set_2 = data.DataTable.filter(x => x.PRIVILEGE === 'act_set_2');
              // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act Set 2', act_set_2);
              if (!act_set_2 || !act_set_2[0]) {
                this.actSetVisibile2 = false;
              } else {
                this.actSetVisibile2 = act_set_2[0].IS_ENABLED !== 'Y' ? false : true;
              }
              if (this.actSetVisibile2 === true) {
                this.numeroActSetVisibili++;
              }

              const act_set_3 = data.DataTable.filter(x => x.PRIVILEGE === 'act_set_3');
              // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act Set 3', act_set_3);
              if (!act_set_3 || !act_set_3[0]) {
                this.actSetVisibile3 = false;
              } else {
                this.actSetVisibile3 = act_set_3[0].IS_ENABLED !== 'Y' ? false : true;
              }
              if (this.actSetVisibile3 === true) {
                this.numeroActSetVisibili++;
              }

              const act_set_4 = data.DataTable.filter(x => x.PRIVILEGE === 'act_set_4');
              // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act Set 4', act_set_4);
              if (!act_set_4 || !act_set_4[0]) {
                this.actSetVisibile4 = false;
              } else {
                this.actSetVisibile4 = act_set_4[0].IS_ENABLED !== 'Y' ? false : true;
              }
              if (this.actSetVisibile4 === true) {
                this.numeroActSetVisibili++;
              }
            } else {
              this.actSetVisibile1 = false;
              this.actSetVisibile2 = false;
              this.actSetVisibile3 = false;
              this.actSetVisibile4 = false;
            }
          }
        } else {
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nessun dato ritornato dal login:', data);
        }
    }, error =>  {
      // ExternalUtilities.messaggioDiErroreEsterno(this, 'Login:' + error);
    // TODO alert error
    });
  }

  parte() {
    this.elem = document.documentElement;

    /* let d1 = this.datePipe.transform(new Date(), 'dd-MM-yyyy', 'UTC');
    d1 += ' 00:00:00';
    let d2 = this.datePipe.transform(new Date(), 'dd-MM-yyyy', 'UTC');
    d2 += ' 20:00:00';

    this.timeRangeDSFStart = d1;
    this.timeRangeDSFStop = d2; */

    Utils.dpi = this.getDpi();

    let okLs = false;
    let okAll = false;
    Utils.datiTipiActivity.forEach(element => {
      if (okLs === false) {
        if (element.name === environment.stringaLatestSelection) {
          okLs = true;
        }
      }
      if (okAll === false) {
        if (element.name === environment.stringaAll) {
          okAll = true;
        }
      }
    });
    if (okLs === false) {
      Utils.datiTipiActivity.push({ id: 0, name: environment.stringaLatestSelection });
    }
    if (okAll === false) {
      Utils.datiTipiActivity.push({ id: -1, name: environment.stringaAll });
    }

    this.mappeGlobal = JSON.parse(JSON.stringify(Utils.mappe))
    let okGs = false;
    Utils.mappe.forEach(element => {
      if (okGs === false) {
        if (element.name === environment.stringaGlobalSettingMapStyle) {
          okGs = true;
        }
      }
    });
    if (okGs === false) {
      Utils.mappe.push({ id: -1, name: environment.stringaGlobalSettingMapStyle });
    }

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onInit', this.impostazioni.frameName);
    this.csvView = new Array();

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Config.JSON:', this.impostazioni);

    /* this.viewOl = new OlView({
      // center: fromLonLat([12.4090874, 41.8223068, 0]),
      center: fromLonLat([0, 0, 0]),
      zoom: 1
    });
    this.viewOlLocal[1] = {...this.viewOl};
    this.viewOlLocal[2] = {...this.viewOl};
    this.viewOlLocal[3] = {...this.viewOl};
    this.viewOlLocal[4] = {...this.viewOl}; */

    // this.gest_finestre.controllaPerRighe(this);
    // RIMETTERE. SISTEMAZIONE LAYOUT
  }

  checkStrings(nome, jsonetto1, jsonetto2) {
    if (this.datiDashboard && this.dashboardSelezionata) {
      if (this.differenzeDiImpostazioni === false) {
        const uno = JSON.stringify(jsonetto1);
        const due = JSON.stringify(jsonetto2);

        // this.dimensioniJSON += nome + ';' + uno.length + '\n';
        // if (uno.length && uno.length > 0) {
        //   this.dimensioniJSON += +uno;
        // }

        if (uno !== due) {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Differenze in ', nome, uno, due);
          this.differenzeDiImpostazioni = true;
        }
      }
    }
  }

  checkDifferenceFromStartJSON() {
    setTimeout(() => {
      if (this.impostazioni === undefined || this.impostazioniIniziali === undefined) {
        return;
      }

      /* // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo differenze fra impostazioni');
      const uno = JSON.stringify(this.impostazioniIniziali);
      const due = JSON.stringify(this.impostazioni);

      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(uno), JSON.parse(due));
      if (uno !== due) {
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, uno, due);
        this.differenzeDiImpostazioni = true;
      } else {
        this.differenzeDiImpostazioni = false;
      } */

      this.differenzeDiImpostazioni = false;

      this.dimensioniJSON = '';
      this.checkStrings('frameAttivo', this.impostazioni.frameAttivo, this.impostazioniIniziali.frameAttivo);
      this.checkStrings('maskSize', this.impostazioni.maskSize, this.impostazioniIniziali.maskSize);
      this.checkStrings('maskSizeHor', this.impostazioni.maskSizeHor, this.impostazioniIniziali.maskSizeHor);
      this.checkStrings('maskVisibleHor', this.impostazioni.maskVisibleHor, this.impostazioniIniziali.maskVisibleHor);
      this.checkStrings('maskVisible', this.impostazioni.maskVisible, this.impostazioniIniziali.maskVisible);
      this.checkStrings('frameName', this.impostazioni.frameName, this.impostazioniIniziali.frameName);
      // this.checkStrings('titoloFrame', this.impostazioni.titoloFrame, this.impostazioniIniziali.titoloFrame);
      this.checkStrings('barraAperta', this.impostazioni.barraAperta, this.impostazioniIniziali.barraAperta);
      this.checkStrings('frameDesc', this.impostazioni.frameDesc, this.impostazioniIniziali.frameDesc);
      this.checkStrings('MappaOGrafico', this.impostazioni.MappaOGrafico, this.impostazioniIniziali.MappaOGrafico);
      this.checkStrings('overviewZoom', this.impostazioni.overviewZoom, this.impostazioniIniziali.overviewZoom);
      this.checkStrings('isCheckedServingCell', this.impostazioni.isCheckedServingCell, this.impostazioniIniziali.isCheckedServingCell);
      this.checkStrings('isCheckedShowPaths', this.impostazioni.isCheckedShowPaths, this.impostazioniIniziali.isCheckedShowPaths);
      this.checkStrings('isCheckedShowSelectedPaths', this.impostazioni.isCheckedShowSelectedPaths, this.impostazioniIniziali.isCheckedShowSelectedPaths);
      this.checkStrings('isCheckedAntenne', this.impostazioni.isCheckedAntenne, this.impostazioniIniziali.isCheckedAntenne);
      this.checkStrings('isStandAloneMR', this.impostazioni.isStandAloneMR, this.impostazioniIniziali.isStandAloneMR);
      this.checkStrings('isNonSyncEventTime', this.impostazioni.isNonSyncEventTime, this.impostazioniIniziali.isNonSyncEventTime);
      this.checkStrings('showAxisX', this.impostazioni.showAxisX, this.impostazioniIniziali.showAxisX);
      this.checkStrings('tipoMappa', this.impostazioni.tipoMappa, this.impostazioniIniziali.tipoMappa);
      this.checkStrings('netTech', this.impostazioni.netTech, this.impostazioniIniziali.netTech);
      this.checkStrings('shownEvents', this.impostazioni.shownEvents, this.impostazioniIniziali.shownEvents);
      this.checkStrings('modificaChart', this.impostazioni.modificaChart, this.impostazioniIniziali.modificaChart);
      this.checkStrings('doNotSetGM', this.impostazioni.doNotSetGM, this.impostazioniIniziali.doNotSetGM);
      // this.checkStrings('slaValue', this.impostazioni.slaValue, this.impostazioniIniziali.slaValue);
      this.checkStrings('slaName', this.impostazioni.slaName, this.impostazioniIniziali.slaName);
      this.checkStrings('activity', this.impostazioni.activity, this.impostazioniIniziali.activity);
      this.checkStrings('geofilter', this.impostazioni.geoFilter, this.impostazioniIniziali.geoFilter);
      this.checkStrings('plmn', this.impostazioni.plmn, this.impostazioniIniziali.plmn);
      this.checkStrings('bandwidth', this.impostazioni.bandwidth, this.impostazioniIniziali.bandwidth);
      this.checkStrings('mapType', this.impostazioni.mapType, this.impostazioniIniziali.mapType);
      this.checkStrings('viewGlobal', this.impostazioni.viewGlobal, this.impostazioniIniziali.viewGlobal);
      this.checkStrings('maximized', this.impostazioni.maximized, this.impostazioniIniziali.maximized);
      this.checkStrings('listaEventi', this.impostazioni.listaEventi, this.impostazioniIniziali.listaEventi);
      this.checkStrings('mostraGrafico', this.impostazioni.mostraGrafico, this.impostazioniIniziali.mostraGrafico);
      this.checkStrings('tabSelezionato', this.impostazioni.tabSelezionato, this.impostazioniIniziali.tabSelezionato);
      this.checkStrings('measure', this.impostazioni.measure, this.impostazioniIniziali.measure);
      this.checkStrings('countHistogram', this.impostazioni.countHistogram, this.impostazioniIniziali.countHistogram);
      this.checkStrings('checkSeverity', this.impostazioni.checkSeverity2, this.impostazioniIniziali.checkSeverity2);
      this.checkStrings('viewAs', this.impostazioni.viewAs, this.impostazioniIniziali.viewAs);
      this.checkStrings('overlay', this.impostazioni.overlay, this.impostazioniIniziali.overlay);
      this.checkStrings('overlayCluster', this.impostazioni.overlayCluster, this.impostazioniIniziali.overlayCluster);
      this.checkStrings('timeFilter', this.impostazioni.timeFilter, this.impostazioniIniziali.timeFilter);
      // this.checkStrings('bboxOZ', this.impostazioni.bboxOZ, this.impostazioniIniziali.bboxOZ);
      this.checkStrings('viewDefinition', this.impostazioni.viewDefinition, this.impostazioniIniziali.viewDefinition);
      // this.checkStrings('viewOlG', this.impostazioni.viewOlG, this.impostazioniIniziali.viewOlG);
      // this.checkStrings('viewOlL', this.impostazioni.viewOlL, this.impostazioniIniziali.viewOlL);

      this.checkStrings('styleVis', this.impostazioni.styleVis, this.impostazioniIniziali.styleVis);
      this.checkStrings('maskDisabled12', this.impostazioni.maskDisabled12, this.impostazioniIniziali.maskDisabled12);
      this.checkStrings('maskDisabled34', this.impostazioni.maskDisabled34, this.impostazioniIniziali.maskDisabled34);
      this.checkStrings('maskDisabled56', this.impostazioni.maskDisabled56, this.impostazioniIniziali.maskDisabled56);
      this.checkStrings('maskDisabledH1', this.impostazioni.maskDisabledH1, this.impostazioniIniziali.maskDisabledH1);
      this.checkStrings('heightOfHeader', this.impostazioni.heightOfHeader, this.impostazioniIniziali.heightOfHeader);
      this.checkStrings('heightOfFrames', this.impostazioni.heightOfFrames, this.impostazioniIniziali.heightOfFrames);
      this.checkStrings('FiltroAntenna', this.impostazioni.FiltroAntenna, this.impostazioniIniziali.FiltroAntenna);
      this.checkStrings('FiltroAntennaSel', this.impostazioni.FiltroAntennaSel, this.impostazioniIniziali.FiltroAntennaSel);
      // this.checkStrings('isVisibleCheckedAntenne', this.impostazioni.isVisibleCheckedAntenne,
      //   this.impostazioniIniziali.isVisibleCheckedAntenne);
      this.checkStrings('isCheckedPath', this.impostazioni.isCheckedPath, this.impostazioniIniziali.isCheckedPath);
      this.checkStrings('isCheckedCoverage', this.impostazioni.isCheckedCoverage, this.impostazioniIniziali.isCheckedCoverage);
      this.checkStrings('isVisibleCheckedServingCell', this.impostazioni.isVisibleCheckedServingCell,
        this.impostazioniIniziali.isVisibleCheckedServingCell);
      this.checkStrings('signalCoverage', this.impostazioni.signalCoverage, this.impostazioniIniziali.signalCoverage);
      this.checkStrings('signalPath1', this.impostazioni.signalPath1, this.impostazioniIniziali.signalPath1);
      this.checkStrings('selectedPath1', this.impostazioni.selectedPath1, this.impostazioniIniziali.selectedPath1);
      this.checkStrings('selectedCoverage1', this.impostazioni.selectedCoverage1, this.impostazioniIniziali.selectedCoverage1);
      this.checkStrings('latPartenza', this.impostazioni.latPartenza, this.impostazioniIniziali.latPartenza);
      this.checkStrings('lonPartenza', this.impostazioni.lonPartenza, this.impostazioniIniziali.lonPartenza);
      // this.checkStrings('Maximized', this.impostazioni.Maximized, this.impostazioniIniziali.Maximized);
      this.checkStrings('FiltroAntennaSel', this.impostazioni.FiltroAntennaSel, this.impostazioniIniziali.FiltroAntennaSel);
      this.checkStrings('dimensioniFinestraLegenda', this.impostazioni.dimensioniFinestraLegenda,
        this.impostazioniIniziali.dimensioniFinestraLegenda);
      this.checkStrings('histDisplayAs', this.impostazioni.histDisplayAs, this.impostazioniIniziali.histDisplayAs);
      this.checkStrings('histDisplayTutto', this.impostazioni.histDisplayTutto, this.impostazioniIniziali.histDisplayTutto);
      this.checkStrings('columnsBars', this.impostazioni.columnsBars, this.impostazioniIniziali.columnsBars);
      this.checkStrings('doubleGraph', this.impostazioni.doubleGraph, this.impostazioniIniziali.doubleGraph);
      this.checkStrings('eventsMeasure', this.impostazioni.eventsMeasure, this.impostazioniIniziali.eventsMeasure);
      this.checkStrings('showPlanimetry', this.impostazioni.showPlanimetry, this.impostazioniIniziali.showPlanimetry);
      // this.checkStrings('columnsSettings', this.impostazioni.columnsSettings, this.impostazioniIniziali.columnsSettings);
      this.checkStrings('currZoom', this.impostazioni.currZoom, this.impostazioniIniziali.currZoom);
      this.checkStrings('tipoEvento', this.impostazioni.tipoEvento, this.impostazioniIniziali.tipoEvento);
      this.checkStrings('eventiSceltiES', this.impostazioni.eventiSceltiES, this.impostazioniIniziali.eventiSceltiES);
      this.checkStrings('eventiSceltiGlobaliES', this.impostazioni.eventiSceltiGlobaliES, this.impostazioniIniziali.eventiSceltiGlobaliES);
      this.checkStrings('fixedSeconds', this.impostazioni.fixedSeconds, this.impostazioniIniziali.fixedSeconds);
      this.checkStrings('styleSizes', this.impostazioni.styleSize, this.impostazioniIniziali.styleSize);
      this.checkStrings('actualDimeDrawer', this.impostazioni.actualDimeDrawer, this.impostazioniIniziali.actualDimeDrawer);
      this.checkStrings('cellType', this.impostazioni.cellType, this.impostazioniIniziali.cellType);
      this.checkStrings('addLayers', this.impostazioni.addLayers, this.impostazioniIniziali.addLayers);
      this.checkStrings('filtriEventi', this.impostazioni.filtriEventi, this.impostazioniIniziali.filtriEventi);
      /* this.checkStrings('filtroEventiCol1', this.impostazioni.filtroEventiCol1, this.impostazioniIniziali.filtroEventiCol1);
      this.checkStrings('filtroEventiCol2', this.impostazioni.filtroEventiCol2, this.impostazioniIniziali.filtroEventiCol2);
      this.checkStrings('filtroEventiCol3', this.impostazioni.filtroEventiCol3, this.impostazioniIniziali.filtroEventiCol3);
      this.checkStrings('filtroEventiCol4', this.impostazioni.filtroEventiCol4, this.impostazioniIniziali.filtroEventiCol4); */
      this.checkStrings('opacity', this.impostazioni.opacity, this.impostazioniIniziali.opacity);
      this.checkStrings('showRays', this.impostazioni.showRays, this.impostazioniIniziali.showRays);
      this.checkStrings('showMeasures', this.impostazioni.showMeasures, this.impostazioniIniziali.showMeasures);
      this.checkStrings('showVoiceCallMeasures', this.impostazioni.showVoiceCallMeasures, this.impostazioniIniziali.showVoiceCallMeasures);
      this.checkStrings('showDataMeasures', this.impostazioni.showDataMeasures, this.impostazioniIniziali.showDataMeasures);
      this.checkStrings('showDataSamplesMeasures', this.impostazioni.showCoverageMeasures, this.impostazioniIniziali.showCoverageMeasures);
      this.checkStrings('squareMeters', this.impostazioni.squareMeters, this.impostazioniIniziali.squareMeters);
      this.checkStrings('globalMeasure', this.impostazioni.globalMeasure, this.impostazioniIniziali.globalMeasure);
      this.checkStrings('globalMeasureArfcn', this.impostazioni.globalMeasureArfcn, this.impostazioniIniziali.globalMeasureArfcn);
      this.checkStrings('measureType', this.impostazioni.measureType, this.impostazioniIniziali.measureType);
      this.checkStrings('mosaicStyle', this.impostazioni.mosaicStyle, this.impostazioniIniziali.mosaicStyle);
      this.checkStrings('SaRTPosition', this.impostazioni.sartPosition, this.impostazioniIniziali.sartPosition);
      this.checkStrings('MeasureSMS', this.impostazioni.measureSMS, this.impostazioniIniziali.measureSMS);
      this.checkStrings('showMeasuresS', this.impostazioni.showMeasuresS, this.impostazioniIniziali.showMeasuresS);
      this.checkStrings('tipoDataset', this.impostazioni.tipoDataset, this.impostazioniIniziali.tipoDataset);
      this.checkStrings('MappeMS', this.impostazioni.mappeMS, this.impostazioniIniziali.mappeMS);
      this.checkStrings('ClusterMeasure', this.impostazioni.clusterMeasure, this.impostazioniIniziali.clusterMeasure);
      this.checkStrings('ClusterMeasure2', this.impostazioni.clusterMeasure2, this.impostazioniIniziali.clusterMeasure2);
      // this.checkStrings('Lov', this.impostazioni.lov, this.impostazioniIniziali.lov);
      this.checkStrings('AddGlobalLayer', this.impostazioni.addGlobalLayer, this.impostazioniIniziali.addGlobalLayer);
      this.checkStrings('MeasureRCM', this.impostazioni.measureRCM, this.impostazioniIniziali.measureRCM);
      this.checkStrings('TipoMisuraGlobale', this.impostazioni.tipoMisuraGlobale, this.impostazioniIniziali.tipoMisuraGlobale);
      this.checkStrings('TipoMisuraGlobaleArfcn', this.impostazioni.tipoMisuraGlobaleArfcn, this.impostazioniIniziali.tipoMisuraGlobaleArfcn);
      this.checkStrings('ShowRaysAllLayer', this.impostazioni.showRaysAllLayer, this.impostazioniIniziali.showRaysAllLayer);
      this.checkStrings('Correlation', this.impostazioni.correlation, this.impostazioniIniziali.correlation);
      this.checkStrings('misureAddizionaliTCRUN', this.impostazioni.misureAddizionaliTCRUN, this.impostazioniIniziali.misureAddizionaliTCRUN);
      this.checkStrings('heightChart', this.impostazioni.heightChart, this.impostazioniIniziali.heightChart);
      this.checkStrings('listaCampiTCRPEmit', this.impostazioni.listaCampiTCRP, this.impostazioniIniziali.listaCampiTCRP);
      this.checkStrings('dimensioniSplitTcRun', this.impostazioni.dimensioniSplitTcRun, this.impostazioniIniziali.dimensioniSplitTcRun);
      this.checkStrings('impostazioniPivot', this.impostazioni.impostazioniPivotGrid, this.impostazioniIniziali.impostazioniPivot);
      this.checkStrings('tipoDatiLayout', this.impostazioni.tipoDatiLayout, this.impostazioniIniziali.tipoDatiLayout);
      this.checkStrings('showAdditionalLayers', this.impostazioni.showAdditionalLayers, this.impostazioniIniziali.showAdditionalLayers);
      this.checkStrings('flowTypeMS', this.impostazioni.flowTypeMS, this.impostazioniIniziali.flowTypeMS);
      this.checkStrings('viewModeMS', this.impostazioni.viewModeMS, this.impostazioniIniziali.viewModeMS);

      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dimensioni totali JSON', this.dimensioniJSON);
    }, 1000);
  }

  ngOnChanges(c) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onChanges Main:', c);
  }

  chiudiHeader() {
    if (this.impostazioni.heightOfHeader > 0) {
      this.impostazioni.heightOfHeader = 0;
      this.impostazioni.heightOfFrames = 100;
    } else {
      this.impostazioni.heightOfHeader = this.heightOfHeaderApp;
      this.impostazioni.heightOfFrames = this.heightOfFramesApp;
    }

    this.rinfrescaTuttiIframes();
  }

  refreshActivity(t) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh Activity da Activity Manager', this.activitySelezionataDaPassare);
    // if (t) {

      this.LeggeDatiFolders(false, -1);
      this.LeggeActivitySetPR();
      this.LeggeActivityGroupPR();
    // }
  }

  refreshDashboard(t) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh dashboard in APP', this.dashboardSelezionata, t);
    if (t) {
      this.csvView = new Array();
      /* for (let nf = 1; nf <= 9 ; nf ++) {
        for (let fa = 1; fa <= 5 ; fa ++) {
          this.viewOlG[fa][nf] = undefined;
          this.viewOlL[fa][nf] = undefined;
          // this.impostazioni.currZoom[fa][nf] = 10;
        }
        this.centroAttuale[nf] = '';
      } */

      const appo = this.dashboardSelezionata;
      this.dashboardSelezionata = 0;
      if (t.FOLDER) {
        // this.LeggeDashboard();
        this.dashboardFolder = t.FOLDER;
        this.dashboardName = t.NAME;
        this.dashboardGroupName = t.GROUP_NAME;
        this.dashboardOperator = t.OPERATOR_NAME;
        this.dashboardSelectedDescription = t.DESCRIPTION;
        if (this.dashboardSelectedDescription === null) { this.dashboardSelectedDescription = ''; };
      }

      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rileggo dashboard');
      this.LeggeDashboardPR();

      setTimeout(() => {
        this.dashboardSelezionata = appo;
        // this.dashboardSelezionata = t.ID;
        // this.forzaSelezioneDashboard = JSON.parse(t.ID);
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.forzaSelezioneDashboard);
        if (t === true) {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiDashboard);
          this.datiDashboard.forEach(element => {
            if (this.dashboardSelezionata === element.ID) {
              this.dashboardFolder = element.FOLDER;
              this.dashboardName = element.NAME;
              this.dashboardGroupName = element.GROUP_NAME;
              this.dashboardOperator = element.OPERATOR_NAME;
              this.dashboardSelectedDescription = element.DESCRIPTION;
              if (this.dashboardSelectedDescription === null) { this.dashboardSelectedDescription = ''; };
            }
          });
        }
      }, 1000);
    }
  }

  aggiornaSize(n, e) {
    this.resizeFrame = new Date().toString();

    this.refreshMap[0] = !this.refreshMap[0];
    this.refreshMap[1] = !this.refreshMap[1];
    this.refreshMap[2] = !this.refreshMap[2];
    this.refreshMap[3] = !this.refreshMap[3];
    this.refreshMap[4] = !this.refreshMap[4];

    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'refresh', this.refreshMap, this.numeroZeroFrame);
    // }
    /* // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DragEnd12', e);
    let conta = 0;
    if (this.impostazioni.maskVisible[n] === true) {
      const x = Math.round(e.sizes[conta]);
      if (x !== this.impostazioni.maskSize[n]) {
        this.impostazioni.maskSize[n] = x;
        // this.gest_finestre.memorizzaSizeApp(this, n, x);
        this.refreshMaschera[n] = !this.refreshMaschera[n];
      }
      conta++;
    }
    if (this.impostazioni.maskVisible[n + 1] === true) {
      const x = Math.round(e.sizes[conta]);
      if (x !== this.impostazioni.maskSize[n + 1]) {
        this.impostazioni.maskSize[n + 1] = x;
        // this.gest_finestre.memorizzaSizeApp(this, n + 1, x);
        this.refreshMaschera[n + 1] = !this.refreshMaschera[n + 1];
      }
      conta++;
    }
    if (this.impostazioni.maskVisible[n + 2] === true) {
      const x = Math.round(e.sizes[conta]);
      if (x !== this.impostazioni.maskSize[n + 2]) {
        this.impostazioni.maskSize[n + 2] = x;
        // this.gest_finestre.memorizzaSizeApp(this, n + 2, x);
        this.refreshMaschera[n + 2] = !this.refreshMaschera[n + 2];
      }
    }

    if (!this.differenzeDiImpostazioni) { this.differenzeDiImpostazioni = true; }
    // this.rinfrescaTuttiIframes(); */
  }

  dragEnd12(e) {
    this.aggiornaSize(1, e);
  }

  dragEnd34(e) {
    this.aggiornaSize(4, e);
  }

  dragEnd56(e) {
    this.aggiornaSize(7, e);
  }

  dragEndHor(e) {
    this.aggiornaSize(1, e);
    this.aggiornaSize(2, e);
    this.aggiornaSize(3, e);
    this.aggiornaSize(4, e);
    // if (this.impostazioni.maskSizeHor !== undefined) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DragEndHor', e);
    // this.gest_finestre.refreshMaschere(this, e.sizes[1], e.sizes[2], e.sizes[3]);
  }

  impostaValoriDefault() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta valori di default');
    this.eseguitoinProgetto0 = this.progetto0;
    this.eseguitoinProgetto1 = this.progetto1;
    this.eseguitoinProgetto2 = this.progetto2;
    this.eseguitoinProgetto3 = this.progetto3;

    setTimeout(() => {
      // this.pareto.pulisceValoriDiAppoggio(this);

      Utils.layerPath = ExternalUtilities.creaMatrice(environment.quantiFrames, Utils.quanteMisureGrafici, undefined);

      Utils.maxTipiHistogram = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 0);
      // this.Utilities.rangeSelezionato = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      Utils.dimensioniFrames = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      Utils.dimensioniFramesModif = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      // Utils.puntoSelezionato = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, null);
      // this.Utilities.lastCallPointCellMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallLegenda = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPath = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPath2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPath3 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPath4 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPathSC = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallScatter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallCrossTab = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallCrossTabMenoUno = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallCrossTabMenoDue = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallTrace = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallTrace2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallAntenne = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      Utils.lastRangeEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, null);
      Utils.lastRangeCells = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, null);
      Utils.lastRangeCDRData = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, null);
      Utils.lastRangeCDRVoice = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, null);
      // this.Utilities.lastCallCM = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPointNum = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPointStr = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPivot = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallHist = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPareto = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallES = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallCD = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallCV = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallText = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallImmagine = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.charts = ExternalUtilities.creaMatriceMisure(environment.quantiFrames, this.Utilities.quanteMisureGrafici, this.Utilities.quanteMisureGrafici);
      // this.Utilities.chartsPareto = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisurePareto, undefined);
      // this.Utilities.chartsHistogram = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, 30);
      // this.Utilities.chartsScatter = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureScatter, undefined);

      // this.Utilities.altezzaGrafici = ExternalUtilities.creaMatriceMisure(environment.quantiFrames, this.Utilities.quanteMisureGrafici, this.Utilities.quanteMisureGrafici);
      // this.Utilities.altezzaGraficiHistogram = this.Utilities.creaMatriceMisure(environment.quantiFrames, this.Utilities.quanteMisureHistogram,
      //   this.Utilities.quanteMisureHistogram);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.altezzaGraficiHistogram[9][2]);

      // this.Utilities.quantiGraficiTCCiSono = this.Utilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureGrafici, 0);
      // this.Utilities.quantiGraficiHICiSono = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureHistogram, 0);
      // this.Utilities.quantiGraficiPACiSono = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisurePareto, 0);
      // this.Utilities.quantiGraficiSCCiSono = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureScatter, 0);

      // this.Utilities.tipiApp = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, this.Utilities.quanteMisureGrafici);
      // this.Utilities.arrayApp = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, this.Utilities.quanteMisureGrafici);
      // this.Utilities.righeApp = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, this.Utilities.quanteMisureGrafici);
      // this.Utilities.nomiLabelsApp = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, this.Utilities.quanteMisureGrafici);

      // this.Utilities.altezzaGrafico = this.Utilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, this.Utilities.quanteMisureGrafici);
      // this.Utilities.altezzaGraficoScatter = this.Utilities.creaMatriceMisure(environment.quantiSottoFrames,
      //     environment.quantiFrames, this.Utilities.quanteMisureGrafici);
      // this.Utilities.altezzaGraficoHistogram = this.Utilities.creaMatriceMisure(environment.quantiSottoFrames,
      //     environment.quantiFrames, this.Utilities.quanteMisureGrafici);
      // this.Utilities.altezzaGraficoPareto = this.Utilities.creaMatriceMisure(environment.quantiSottoFrames,
      //     environment.quantiFrames, this.Utilities.quanteMisureGrafici);

      // this.Utilities.measureDaDisegnare = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
      //     environment.quantiFrames, this.Utilities.quanteMisureGrafici);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.measureDaDisegnare[2][3]);
      // this.Utilities.measureDaDisegnareScatter = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
      //   environment.quantiFrames, this.Utilities.quanteMisureScatter);
      // this.Utilities.measureDaDisegnareHistogram = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
      //   environment.quantiFrames, this.Utilities.quanteMisureHistogram);
      // this.Utilities.measureDaDisegnarePareto = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
      //   environment.quantiFrames, this.Utilities.quanteMisurePareto);

      /* for (let i = 0; i <= environment.quantiSottoFrames; i++) {
        for (let k = 0; k <= environment.quantiFrames; k++) {
          for (let z = 0; z <= 5; z++) {
            this.Utilities.measureDaDisegnareHistogram[i][k].push('');
          }
        }
      } */
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.measureDaDisegnareHistogram);

      Utils.ultimaVoltaHistogram = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 0);

      // this.Utilities.contatoreGraficiPareto = this.Utilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureGrafici, 0);
      // this.Utilities.contatoreGraficiScatter = this.Utilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureGrafici, 0);
      // this.Utilities.quantoContatoreGraficiScatter = this.Utilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureGrafici, 0);
      // this.Utilities.lastCallGrafici = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, environment.quantiFrames);
      // this.Utilities.lastCallMeasures = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, environment.quantiFrames);
      // this.Utilities.lastCallGraficoEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      Utils.csvApp = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, environment.quantiFrames);

      Utils.axisXMaxMin = ExternalUtilities.creaMatriceMisure(environment.quantiFrames, Utils.quanteMisureGrafici, Utils.quanteMisureGrafici);

      // this.pareto.pulisceValoriDiAppoggio(this);

      for (let i = 0; i < 10; i++) {
        Utils.maxTipiHistogram.push(0);
      }
      this.mapTypeG = 1;
      this.mapTypeS = 1;
      this.refreshMaschera = [false, false, false, false, false, false, false, false, false, false, false];
      this.impostazioni.frameName = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '<empty>');
      // this.impostazioni.titoloFrame = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      //  ['', 'Title 1', 'Title 2', 'Title 3', 'Title 4', 'Title 5', 'Title 6', 'Title 7', 'Title 8', 'Title 9', 'Title 10'];
      this.cellSet = 'Tim';
      this.impostazioni.frameDesc = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.maskVisible = [false, true, true, true, true, true, true, true, true, true, true];
      this.impostazioni.bandwidth = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.countHistogram = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.checkSeverity2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.mapType = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 9999);
      this.impostazioni.tipoMappa = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.MappaOGrafico = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.overviewZoom = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.barraAperta = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.currZoom = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.maximized =  [false, false, false, false, false, false, false, false, false, false, false];
      this.impostazioni.isCheckedServingCell = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.isCheckedShowPaths = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.isCheckedShowSelectedPaths = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.isCheckedAntenne = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.impostazioni.isStandAloneMR = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.isNonSyncEventTime = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.showAxisX = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.measure = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, Utils.quanteMisure);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.measure);
      this.slaValue = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.impostazioni.activity = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.geoFilter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.netTech = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.shownEvents = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.modificaChart = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.doNotSetGM = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.plmn = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.activityName = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.activitySet = [-1, -1, -1, -1, -1];
      this.impostazioni.listaEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '')
      // this.impostazioni.layerMappa = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.impostazioni.tabSelezionato = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 0);
      this.impostazioni.maskSize = [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34];
      this.impostazioni.slaName = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.tipoMappeCaricate = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      this.impostazioni.viewAs = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 1);
      this.impostazioni.overlay = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.overlayCluster = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '<Global Cluster>');
      this.impostazioni.timeFilter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 2);
      // this.impostazioni.bboxOZ = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.viewDefinition = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.maskDisabledH1 = false;
      // this.viewOlG = ExternalUtilities.creaMatriceView(environment.quantiSottoFrames, environment.quantiFrames);
      // this.viewOlL = ExternalUtilities.creaMatriceView(environment.quantiSottoFrames, environment.quantiFrames);

      this.impostazioni.histDisplayAs = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames,
            Utils.quanteMisureHistogram);
      this.impostazioni.histDisplayTutto = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames,
            Utils.quanteMisureHistogram);
      this.impostazioni.columnsBars = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 2);
      this.impostazioni.doubleGraph = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.listaCampiTCRP = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.dimensioniSplitTcRun = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.impostazioniPivotGrid = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.tipoDatiLayout = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 3);
      this.impostazioni.showAdditionalLayers = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.viewModeMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.flowTypeMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.eventsMeasure = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.showPlanimetry = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames,
        'L');
      // this.impostazioni.columnsSettings = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, 10);
      this.impostazioni.tipoEvento = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames,
        undefined);
      this.impostazioni.styleSize = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames,
          12);
      this.impostazioni.cellType = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames,
          '');
      this.impostazioni.addLayers = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames,
          '');
      this.impostazioni.eventiSceltiES = new Array(); // ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.eventiSceltiGlobaliES = new Array(); // ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.fixedSeconds = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.filtriEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      /* this.impostazioni.filtroEventiCol1 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol3 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol4 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, ''); */
      this.impostazioni.opacity = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 20);
      this.impostazioni.showRays = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.showMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.showVoiceCallMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.showDataMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.showCoverageMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.squareMeters = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.impostazioni.measureType = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 1);
      this.impostazioni.mosaicStyle = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.sartPosition = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.measureSMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.showMeasuresS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.tipoDataset = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 1);
      this.impostazioni.mappeMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 1);
      this.impostazioni.clusterMeasure = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.clusterMeasure2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.impostazioni.lov = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.textFilter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.textFilter2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.impostazioni.textLov = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.addGlobalLayer = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.measureRCM = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.impostazioni.showRaysAllLayer = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.correlation = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.tipoMisuraGlobale = -1;
      this.impostazioni.tipoMisuraGlobaleArfcn = -1;
      this.impostazioni.misureAddizionaliTCRUN = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, ['', '', '', '']);
      this.impostazioni.heightChart = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 'X1');

      this.isVisibileBars = false;

      // this.impostazioniIniziali = JSON.parse(JSON.stringify(this.impostazioni));
      this.impostazioniDefault = JSON.parse(JSON.stringify(this.impostazioni));

      /* let d = new Date();
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Inizio Test conversione', d);
      const t1 = this.Utilities.testConversioneDA(JSON.stringify(this.impostazioni));
      d = new Date();
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fine Test conversione', d, t1.length);
      const t2 = this.Utilities.testConversioneA(t1);
      d = new Date();
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno alla normalità', d, t2.length);
      if (JSON.stringify(this.impostazioni) !== t2) {
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Diverso', JSON.stringify(this.impostazioni).length, t2.length);
      } else {
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Uguale');
      }
      d = new Date();
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fine', d); */
    }, 100);
  }

  ngAfterViewInit() {
    this.impostaValoriDefault();
  }

  LeggeMeasuresPR() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost(Utils, 'geo_measure_dfn__grid', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista measure pr:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.measureData = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.measureData = data.DataTable;

          this.clusterGroup = new Array();
          this.measureData.forEach(element => {
            if (element.FOLDER === '5 Cluster') {
              this.clusterGroup.push(element);
            }
            // if (element.CODE === 'Samples') {
            //   // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
            // }
          });
          this.clusterGroup2 = JSON.parse(JSON.stringify(this.clusterGroup));

          const clustG = {
            ROW_ID: -1,
            NAME: environment.stringaClusterGlobale,
            FOLDER: 'Cluster',
            DESCRIPTION: 'Global <Cluster',
            INSERT_TIMESTAMP: '2020-01-12 21:12:44',
            UPDATE_TIMESTAMP: '2020-01-12 21:12:44',
            NET_TECH: 'ALL',
            DISPLAY_NAME: environment.stringaClusterGlobale,
            TYPE: 3,
            FILE_TYPE: 'Cluster',
            CODE: environment.stringaClusterGlobale
          }
          this.clusterGroup.push(clustG);

          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.clusterGroup);
        }
      } else {
        this.measureData = 'empty grid'; // null;
      }

      setTimeout(() => {
        this.caricateMeasures = true;
      }, 100);
    }, error => {
      alert('Read Measures:' + error);
    });
  }

  LeggeDatiMosaicStyle() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure mosaic style');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "mosaic_style"' +
    '}';
    this.apiService.chiamataPost(Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // // const data2 = JSON.parse(data);
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiMosaicStyle = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mosaic Style:', data);
          this.datiMosaicStyle = data;
        }
      } else {
        this.datiMosaicStyle = 'empty grid'; // null;
      }

      setTimeout(() => {
        this.caricatiMosaicStyle = true;
      }, 100);
    }, error => {
      alert('Read look up:' + error);
    });
  }

  LeggeDatiLookUp() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "cell_type"' +
    '}';
    this.apiService.chiamataPost(Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiLookUp = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.datiLookUp = data;
        }
      } else {
        this.datiLookUp = 'empty grid'; // null;
      }

      setTimeout(() => {
        this.caricatiLookUp = true;
      }, 100);
    }, error => {
      alert('Read look up:' + error);
    });
  }

  LeggeDatiFolders(apreMascheraActivity, q) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo dati folders');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "ActSetFolder"' +
    '}';
    this.apiService.chiamataPost(Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiFolders = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          const dd = {
            ColumnProperty: null,
            DataTable: new Array(),
            GridProperty: null
          }
          this.datiFolders = dd;
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Folders:', data);
          const d = {
            CATEGORY: 'ActFolder',
            CODE: 0,
            DESCRIPTION: '',
            ROW_ID: 1,
            VALUE_STR: '<ALL>'
          };
          this.datiFolders.ColumnProperty = JSON.parse(JSON.stringify(data.ColumnProperty));
          this.datiFolders.GridProperty = JSON.parse(JSON.stringify(data.GridProperty));
          this.datiFolders.DataTable.push(d);
          let c = 2;
          data.DataTable.forEach(element => {
            const e = {
              CATEGORY: 'ActFolder',
              CODE: 0,
              DESCRIPTION: '',
              ROW_ID: c,
              VALUE_STR: element.VALUE_STR
            };
            this.datiFolders.DataTable.push(e);
            c++;
          });

          if (q > -1) {
            // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiFolders);
            this.activitySelezionataDaPassare = '';
            setTimeout(() => {
              if (apreMascheraActivity) {
                this.numeroActSet = q;
                switch (q) {
                  case 1:
                    this.activitySelezionataDaPassare = this.activitySelezionataA[1];
                    break;
                  case 2:
                    this.activitySelezionataDaPassare = this.activitySelezionataA[2];
                    break;
                  case 3:
                    this.activitySelezionataDaPassare = this.activitySelezionataA[3];
                    break;
                  case 4:
                    this.activitySelezionataDaPassare = this.activitySelezionataA[4];
                    break;
                }
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity selezionata', this.activitySelezionataDaPassare);
                this.activityComponentShowed = true;
              }
            }, 100);
          } else {
            const app = this.activitySelezionataDaPassare;
            this.activitySelezionataDaPassare = '';
            setTimeout(() => {
              this.activitySelezionataDaPassare = app;
            }, 1000);
          }
        }
      } else {
        this.datiFolders = 'empty grid'; // null;
      }
    }, error => {
      alert('Read look up:' + error);
    });
  }

  /* LeggeEventiPR() {
    // this.datiDiProvaTree = this.CreateTree();
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera ' + this.NumeroFrame);

    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost('geo_event_dfn__grid', params)
    // .map(response => response())
    .subscribe((data2: any) => {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        // // const data = JSON.parse(data2); // [0].geo_event_dfn__grid);
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS data:', data.DataTable);
        this.datiEventiDaMettere = data;
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Struttura di base', data);
        this.Utilities.strutturaGrigliaDiBase = data;
     } else {
        this.datiEventiDaMettere = 'empty grid';
      }
    }, error => {
      alert(error);
    });
  } */

  LeggeActivitySetPR() {
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": "<RECENT>"' +
    '}';
    this.apiService.chiamataPost(Utils, 'geo_act_set__grid', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiActivitySet = 'empty';
          this.pulisceFiltroActSet[1] = !this.pulisceFiltroActSet[1];
          this.pulisceFiltroActSet[2] = !this.pulisceFiltroActSet[2];
          this.pulisceFiltroActSet[3] = !this.pulisceFiltroActSet[3];
          this.pulisceFiltroActSet[4] = !this.pulisceFiltroActSet[4];
          alert(data2.v_failure_reason);
        } else {
          const data = data2; // [0].geo_act_set__grid);
        // if (data === undefined) { data = null; }
        // if (data.RESULT && data.RESULT[0].message.toUpperCase() === 'OK') {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities', data.DataTable);
          this.datiActivitySet = data.DataTable;
          this.pulisceFiltroActSet[1] = !this.pulisceFiltroActSet[1];
          this.pulisceFiltroActSet[2] = !this.pulisceFiltroActSet[2];
          this.pulisceFiltroActSet[3] = !this.pulisceFiltroActSet[3];
          this.pulisceFiltroActSet[4] = !this.pulisceFiltroActSet[4];

          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity set', this.datiActivitySet, Utils.sceltaActivityDaSet );
          // this.leggeActivityDaSet(1, 37547);
        }
      } else {
        // alert(data.RESULT[0].message);
        this.datiActivitySet = 'empty';
        this.pulisceFiltroActSet[1] = !this.pulisceFiltroActSet[1];
        this.pulisceFiltroActSet[2] = !this.pulisceFiltroActSet[2];
        this.pulisceFiltroActSet[3] = !this.pulisceFiltroActSet[3];
        this.pulisceFiltroActSet[4] = !this.pulisceFiltroActSet[4];
      }

      setTimeout(() => {
        this.caricataComboActivitSet = true;
      }, 500);
    }, error => {
        console.warn(error);
    });
  }

  selectTipoActivity(n, e) {
    let eee;

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezionata activity set:', n, e, this.activitySet[n]);
    if (e && e != null) {
      if (e !== 'empty') {
        eee = ExternalUtilities.converteStringaInJSON(e);
      } else {
        eee = '';
      }

      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity frame:' + n, e);
      let ee;
      if (e === 'empty') {
        this.activitySelezionataA[n] = '';
        this.activitySet[n] = -1;
        this.activitySetName[n] = 'empty';
        this.listaActivitySets[n] = ee;
        this.listaActivitySets = JSON.parse(JSON.stringify(this.listaActivitySets));
        this.nomeActivitySet = '';
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.listaActivitySets);
        ee = 'empty';
      } else {
        if (typeof(eee) !== 'object') {
          ee = JSON.parse(eee);
        } else {
          ee = eee;
        }
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity frame:' + n, ee);

        // ee = this.Utilities.ritornaRigaTotaleDaDescrizioneCombo(e, this.datiActivitySet, 'NAME');
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity frame ' + n, ee, this.impostazioni.activity);
        if (ee !== null) {
          this.activitySelezionataA[n] = ee;
          this.activitySet[n] = ee.ID;
          this.activitySetName[n] = ee;
          this.nomeActivitySet = ee;

          // for (let f = 1; f <= environment.quantiSottoFrames; f++) {
          this.listaActivitySets[n] = ee;
          // }
          this.listaActivitySets = JSON.parse(JSON.stringify(this.listaActivitySets));
          /* this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.nomeActivitySet);
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activitySetName);
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activitySet);
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activitySelezionata); */
        }
      }

      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numero activity impostate:', this.impostazioni.activity);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi activity impostate:', this.activitySet);

      this.nomeSet1 = this.prendeNomeSET1(this.activitySet[1]);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activitySetName[1]);

      for (let f = 1; f <= environment.quantiSottoFrames; f++) {
        this.impostaNomiActivity(f, n, ee);
      }

      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numero activity impostate 2:', this.impostazioni.activity);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi activity impostate 2:', this.activitySetName);

      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activityName);

      // this.calcolaCentro = !this.calcolaCentro;
      Utils.ActivitySetDelPuntoClickato = undefined;
      Utils.ActivitySetDelPuntoClickatoPerScritta = Utils.ActivitySetDelPuntoClickato;

      this.leggeActivityDaSet(n, ee.ID);

      AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, 0, 'SelectTipoActivity');

      this.checkDifferenceFromStartJSON();
      this.rinfrescaTuttiIframes();

      setTimeout(() => {
        this.resetPosition();
      }, 2000);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activitySet);
    }
  }

  selectTipoMappa1(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo mappa:', e);
    if (e && e !== 'empty') {
        const ee = ExternalUtilities.converteStringaInJSON(e);
        // const ee = this.Utilities.ritornaRigaTotaleDaDescrizioneCombo(e, this.mappeGlobal, 'name');

        this.mapTypeG = ee.id;
    }
    this.checkDifferenceFromStartJSON();
  }

  checkValuePath(event: any) {
  }

  checkValueAntenne(event: any) {
  }

  checkValueVisibileBars(e) {
    // this.checkDifferenceFromStartJSON();
  }

  checkSyncTms(e) {
    // this.checkDifferenceFromStartJSON();
  }

  checkValueServingCell(event: any) {
  }

  checkValueGrafico(event: any) {
  }

  checkValueCoverage(event: any) {
  }

  rinfrescaTuttiIframes() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rinfresca tutti i frames');
    for (let i = 1; i <= environment.quantiFrames; i++) {
      this.refreshMaschera[i] = !this.refreshMaschera[i];
    }
  }

  refreshaDaTasto() {
    for (let i = 1; i <= environment.quantiFrames; i++) {
      this.refreshDaTasto[i] = !this.refreshDaTasto[i];
    }
  }

  stateChangeOnTree(e) {
    // alert(e);
  }

  refreshPlanimetria = '';

  refreshPlanimetriaEmit(e) {
    this.refreshPlanimetria = new Date().toString();
  }

  EffettuaLogin(dd, sessionId, groupName, userName, password) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Effettua login:', userName, password);

    if (sessionId && sessionId !== '') {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Login con credenziali automatiche');
      this.loginOK(dd, sessionId, groupName);
    } else {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Login con credenziali interne');
      /* this.apiService.login(this.UtilitiesInterne, {username: userName, password: password, groupname: 'ANTSNVL'})
      // .map(response => response())
      .subscribe(
        data => {
          if (data) {
            // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno login: ', data);

            const dd2 = data.OBJECT[0].object;
            const rr = data.RESULT[0].message;

            this.sessioneID = data.OBJECT[0].object.sessionID2;

            // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.sessioneID);
            if (rr === 'Ok') {
              this.loginOK(dd2, dd2.sessionId, dd2.groupName);
            } else {
              alert('Connection error:' + rr);
            }
          } else {
            // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nessun dato ritornato dal login:', data);
          }
      }, error =>  {
        alert('Login:' + error);
      // TODO alert( error
      }); */

      let pwd = '';
      const p = localStorage.getItem('H7-25-FC');
      if (p !== null) {
        pwd = p;
      } else {
        pwd = prompt("H7-25-FC", "");
        if (pwd === '') {
          alert('No!');
          return;
        }  else  {
          localStorage.setItem('H7-25-FC', pwd);
        }
      }

      const params = {
        v_city: 'Milan',
        v_client_country: 'ITA',
        v_client_public_ip: '185.142.153.241',
        v_name: userName,
        v_org: 'SUPERNAP Italia S.r.l.',
        v_password: pwd
      };
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
      this.apiService.chiamataPost(Utils, 'operator__login', params)
      // .map(response => response)
      .subscribe((data: any) => {
        // // const data = JSON.parse(data2);
          if (data) {
            if (data.v_err_code && data.v_err_code === 2) {
              alert(data.v_failure_reason);
            } else {
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno login: ', data);

              data.platform_info.forEach(element => {
                switch(element.name) {
                  case 'login_page_url':
                    Utils.userRedirect = element.VALUE;
                    // alert(element.VALUE);
                    break;
                  case 'geo_dashboard__frame_editor':
                    Utils.permessoFrameEditor = element.VALUE === 'Y' ? 'false' : 'true';
                    break;
                }
              });
              // Utils.permessoFrameEditor = 'false';
              // const dd2 = data.OBJECT[0].object;
              const rr = data.err_code;

              if (rr === 0) {
                this.userName = userName;
                this.sessioneID = data.cntx_id;
                this.loginOK(data, data.cntx_id, '');
              } else {
                alert('Connection error:' + data.v_failure_reason);
              }
            }
          } else {
            // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nessun dato ritornato dal login:', data);
          }
      }, error =>  {
        alert('Login:' + error);
      // TODO alert( error
      });

    }
  }

  loginOK(dd, sessionId, groupName) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Login Ok:', dd);

    this.sessionService.setRemember(true);
    this.sessionService.setUser(dd);
    this.sessionService.setToken(sessionId);
    this.sessionService.setLogged(true);
    this.groupName = groupName;

    // this.sessioneID = dd.sessionId;

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo simbolici', this.sessioneID);
    this.prendeTutteLeMisure();
    this.LeggeSimbolici();
    this.LeggeAttivazioneActSet();
    this.LeggeImpostazioni();

    if (!this.userName || this.userName === '') {
      this.userName = 'DebugUser'; // dd.username;
    }

    setTimeout(() => {
      this.testFunzione();
    }, 1000);
  }

  LeggeImpostazioni() {
    this.Utils.permessoFrameEditor = 'false';
    this.frameEditorAttivo = false;
    this.exportKML = false;
    this.accordionDebug = false;
    this.permessiDataView = new Array();

    const params = {
      cntx_id: this.sessioneID
    }
    this.apiService.chiamataPost(this.Utils, 'operator_info_my__grid', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
        if (data) {
          // ExternalUtilities.checkRitornoChiamata(data);

          this.accordionDebug = false;
          const permessiDataView = new Array();

          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Operator info my grid', data.DataTable);
          data.DataTable.forEach(element => {
            // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
            switch (element.NAME) {
              case 'login_page_url':
                this.Utils.userRedirect = element.VALUE;
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redirect', element);
                break;
              case 'geo_dashboard__upd':
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato', element);
                this.accordionDebug = element.VALUE === 'Y' ? true : false;
                break;
              case 'operator_id':
                this.operatorID = element.VALUE;
                break;
              case 'operator_group_name':
                this.groupName = element.VALUE;
                break;
              case 'antsgeo_act_path_cell3d_kml':
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato', element);
                this.exportKML = element.VALUE === 'Y' ? true : false;
                break;
              case 'string_to_command':
                this.microfonoAttivo = (element.VALUE === 'Y' ? true : false);
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Microfono attivo:', element, this.microfonoAttivo);
                break;
              case 'geo_dashboard__frame_editor':
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato', element);
                this.Utils.permessoFrameEditor = element.VALUE === 'Y' ? 'true' : 'false';
                this.frameEditorAttivo = element.VALUE === 'Y' ? true : false;
                break;

              case 'data_view_AA':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AA"});
                }
                break;
              case 'data_view_LA':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "LA"});
                }
                break;
              case 'data_view_SY':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "SY"});
                }
                break;
              case 'data_view_AE':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AE"});
                }
                break;
              case 'data_view_MC':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MC"});
                }
                break;
              case 'data_view_AI':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AI"});
                }
                break;
              case 'data_view_AP':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AP"});
                }
                break;
              case 'data_view_AR':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AR"});
                }
                break;
              case 'data_view_CD':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "CD"});
                }
                break;
              case 'data_view_CV':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "CV"});
                }
                break;
              case 'data_view_CM':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "CM"});
                }
                break;
              case 'data_view_CG':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "CG"});
                }
                break;
              case 'data_view_ES':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "ES"});
                }
                break;
              case 'data_view_AH':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AH"});
                }
                break;
              case 'data_view_M':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "M"});
                }
                break;
              case 'data_view_MD':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MD"});
                }
                break;
              case 'data_view_NB':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "NB"});
                }
                break;
              case 'data_view_NP':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "NP"});
                }
                break;
              case 'data_view_MG':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MG"});
                }
                break;
              case 'data_view_PC':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PC"});
                }
                break;
              case 'data_view_PT':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PT"});
                }
                break;
              case 'data_view_PK':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PK"});
                }
                break;
              case 'data_view_PL':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PL"});
                }
                break;
              case 'data_view_PM':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PM"});
                }
                break;
              case 'data_view_PS':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PS"});
                }
                break;
              case 'data_view_TC':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "TC"});
                  permessiDataView.push({ NAME: "TP"});
                }
                break;
              case 'data_view_TI':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "TI"});
                }
                break;
              case 'data_view_MCDR':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "M2"});
                }
                break;
              case 'data_view_MFSEG':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MF"});
                }
                break;
              case 'data_view_MFS':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MS"});
                }
                break;
              case 'data_view_MFQ':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MQ"});
                }
                break;
              case 'data_view_MRBCIXL':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MR"});
                }
                break;
              case 'data_view_XX':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "XX"});
                }
                break;
            }
          });
          // permessiDataView.push({ NAME: "MR"});

          this.permessiDataView = permessiDataView;
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Permesso frame editor:', this.Utilities.permessoFrameEditor);
        }
    }, error =>  {
      // ExternalUtilities.messaggioDiErroreEsterno(this, 'Login:' + error);
    // TODO alert error
    });
  }

  LeggeSimbolici() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo simbolici');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '"' +
    '}';
    this.apiService.chiamataPost(Utils, 'geo_symbolic__sel', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'GEO SYMBOLIC SEL: ', data2);
      // // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data2);
          // // // const data = JSON.parse(data2);
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data); //  and name = \'GEO_R_MAP_MAX_MEASR\'

          data2.forEach(element => {
            const name = element.NAME;
            switch (name) {
              case 'GEO_MAP_MAX_MEASR':
                Utils.quanteMisure = element.VALUE;
                break;
              case 'GEO_TIMECHART_MAX_MEASR':
                Utils.quanteMisureGrafici = +(element.VALUE) + 1;
                break;
              case 'SHOW_DEBUG_INFO':
                this.accordionDebug = element.VALUE;
                break;
              case 'GRID_PAGEABLE_ROW_NUM':
                this.righePerPaginazioneAutomatica = element.VALUE;
                break;
              }
            Utils.quanteMisurePareto = 2;
          });

          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.quanteMisure);

          this.impostaValoriDefault();
          this.refreshQuanteMisure = !this.refreshQuanteMisure;

          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo dashboard');
          this.LeggeDashboardPR();
          this.LeggeDashboardGroupPR();
          this.LeggeActivityGroupPR();
          this.LeggeSlaGroupPR();

          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo activity set');
          this.LeggeActivitySetPR();
          // this.LeggeEventiPR();
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo dashboard group');
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo activity group');
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo sla group');
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo sla data');
          this.LeggeSLADataPR();
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo measures');
          this.LeggeMeasuresPR();
          this.LeggeDatiLookUp();
          this.LeggeDatiAddLayers();
          this.LeggeDatiMosaicStyle();

          this.LeggeDatiFolders(false, -1);

          this.LeggeRAT();
          this.LeggeUEProf();
          this.LeggeBand();
          this.LeggeScenario();
          this.LeggeNotebook();

          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Letto tutto');
          this.CaricaDatiDashboard(247406);

          this.ConnessioneStabilita = 'OK';
        }
      } else {
        alert('Read symbolic null');
      }
    }, error => {
      alert('Read symbolic: ' + error);
    });
  }

  LeggeDatiAddLayers() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "MapLayer"' +
    '}';
    this.apiService.chiamataPost(Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiAddLayers = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
          // const data = data2; // [0].geo_measure_dfn__grid);
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati add layers:', data2);
          this.datiAddLayers = data2;
        }
     } else {
        this.datiAddLayers = 'empty grid'; // null;
      }

      setTimeout(() => {
        this.caricatiAddLayers = true;
      }, 100);
    }, error => {
      alert('Read look up:' + error);
    });
  }

  LeggeDashboardPR() {
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost(Utils, 'geo_dashboard__grid', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data2);
      // // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiDashboard = 'empty grid';
          this.datiDashboardPerPassaggio = 'empty grid';
          this.pulisceFiltroDashboard = !this.pulisceFiltroDashboard;
          alert(data2.v_failure_reason);
        } else {
          const d = data2;
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, d);
          const data = d; // [0].geo_dashboard__grid;
          // if (+data[0].v_err_code === 0) {
          this.datiDashboard = data.DataTable

          this.datiDashboardPerPassaggio = data;
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno:', this.datiDashboardPerPassaggio);

          this.pulisceFiltroDashboard = !this.pulisceFiltroDashboard;

          // this.Utilities.strutturaGrigliaDiBase = data;
        }
      } else {
        this.datiDashboard = 'empty grid';
        this.datiDashboardPerPassaggio = 'empty grid';
        this.pulisceFiltroDashboard = !this.pulisceFiltroDashboard;
      }

      setTimeout(() => {
        this.caricataComboDashboard = true;
      }, 100);
    }, error => {
      alert(error);
    });
  }

  LeggeUEProf() {
    const params = {
      cntx_id: this.sessioneID,
      v_category: 'Filter_UeProf'
    };
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(Utils, 'geo_lookup__sel', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
      if (data) {
        if (data.v_err_code && data.v_err_code === 2) {
          alert(data.v_failure_reason);
        } else {
          this.ueProf = new Array();
          let c = 1;
          data.forEach(element => {
            const d = {
              ROW_ID: c,
              CATEGORY: params.v_category,
              VALUE_STR: element.value_str
            }
            this.ueProf.push(d);
            c++;
          });
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno dashboard group:', this.dashboardGroup);
        }
      }
      setTimeout(() => {
        this.caricatoUEProf = true;
      }, 100);
    }, error => {
      alert(error);
    });
  }

  LeggeNotebook() {
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "Notebook"' +
    '}';
    this.apiService.chiamataPost(Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.notebook = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.notebook = data;
        }
      } else {
        this.notebook = 'empty grid'; // null;
      }

      setTimeout(() => {
        this.caricatoNotebook = true;
      }, 100);
    }, error => {
      alert('Read look up:' + error);
    });
  }

  LeggeRAT() {
    const params = {
      cntx_id: this.sessioneID,
      v_category: 'Filter_RAT'
    };
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(Utils, 'geo_lookup__sel', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data2 = JSON.parse(data);
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data);
      if (data) {
        if (data.v_err_code && data.v_err_code === 2) {
          alert(data.v_failure_reason);
        } else {
          this.rat = new Array();
          let c = 1;
          data.forEach(element => {
            const d = {
              ROW_ID: c,
              CATEGORY: params.v_category,
              VALUE_STR: element.value_str
            }
            this.rat.push(d);
            c++;
          });
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno dashboard group:', this.dashboardGroup);
        }
        setTimeout(() => {
          this.caricatoRAT = true;
        }, 100);
      } else {
        setTimeout(() => {
          this.caricatoRAT = true;
        }, 100);
      }
    }, error => {
      alert(error);
    });
  }

  LeggeBand() {
    const params = {
      cntx_id: this.sessioneID,
      v_category: 'Filter_Band'
    };
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(Utils, 'geo_lookup__sel', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
      if (data.v_err_code && data.v_err_code === 2) {
        alert(data.v_failure_reason);
      } else {
        this.band = new Array();
        let c = 1;
        data.forEach(element => {
          const d = {
            ROW_ID: c,
            CATEGORY: params.v_category,
            VALUE_STR: element.value_str
          }
          this.band.push(d);
          c++;
        });
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno dashboard group:', this.dashboardGroup);
      }
      setTimeout(() => {
        this.caricatoBand = true;
      }, 100);
    }, error => {
      alert(error);
    });
  }

  LeggeScenario() {
    const params = {
      cntx_id: this.sessioneID,
      v_category: 'Filter_Scenario'
    };
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(Utils, 'geo_lookup__sel', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
      if (data.v_err_code && data.v_err_code === 2) {
        alert(data.v_failure_reason);
      } else {
        this.scenario = new Array();
        let c = 1;
        data.forEach(element => {
          const d = {
            ROW_ID: c,
            CATEGORY: params.v_category,
            VALUE_STR: element.value_str
          }
          this.scenario.push(d);
          c++;
        });
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno dashboard group:', this.dashboardGroup);
      }
      setTimeout(() => {
        this.caricatoScenario = true;
      }, 100);
    }, error => {
      alert(error);
    });
  }

  LeggeDashboardGroupPR() {
    const params = {
      cntx_id: this.sessioneID,
      v_category: 'DashboardFolder'
    };
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(Utils, 'geo_lookup__sel', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
      if (data) {
        if (data.v_err_code && data.v_err_code === 2) {
          alert(data.v_failure_reason);
        } else {
          this.dashboardGroup = new Array();
          let c = 1;
          data.forEach(element => {
            const d = {
              ROW_ID: c,
              CATEGORY: params.v_category,
              VALUE_STR: element.value_str
            }
            this.dashboardGroup.push(d);
            c++;
          });
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno dashboard group:', this.dashboardGroup);
        }
      }
      setTimeout(() => {
        this.caricatoDashboardGroup = true;
      }, 100);
    }, error => {
      alert(error);
    });
  }

  LeggeActivityGroupPR() {
    const params = {
      cntx_id: this.sessioneID,
      v_category: 'ActSetFolder'
    };
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 2', new Date().getTime());
    this.apiService.chiamataPost(Utils, 'geo_lookup__sel', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
      if (data.v_err_code && data.v_err_code === 2) {
        alert(data.v_failure_reason);
      } else {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno:', data);
        this.activityGroup = new Array();
        let c = 1;
        data.forEach(element => {
          const d = {
            ROW_ID: c,
            CATEGORY: params.v_category,
            VALUE_STR: element.value_str
          }
          this.activityGroup.push(d);
          c++;
        });
      }
      setTimeout(() => {
        this.caricatoActivityGroup = true;
      }, 100);
    }, error => {
      alert(error);
    });
  }

  LeggeSlaGroupPR() {
    const params = {
      cntx_id: this.sessioneID,
      v_category: 'SlaFolder'
    };
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 3', new Date().getTime());
    this.apiService.chiamataPost(Utils, 'geo_lookup__sel', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
      if (data.v_err_code && data.v_err_code === 2) {
        alert(data.v_failure_reason);
      } else {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno:', data);
        this.slaGroup = new Array();
        let c = 1;
        data.forEach(element => {
          const d = {
            ROW_ID: c,
            CATEGORY: params.v_category,
            VALUE_STR: element.value_str
          }
          this.slaGroup.push(d);
          c++;
        });
      }
      setTimeout(() => {
        this.caricatoSlaGroup = true;
      }, 100);
    }, error => {
      alert(error);
    });
  }

  LeggeSLADataPR() {
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost(Utils, 'geo_sla__grid', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiSLA = 'empty grid'; // null;
          this.datiSlaDT = 'empty grid';
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SLA:', data2);
          const data = data2;
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiSLA);
          this.datiSLA = data;
          this.datiSlaDT = data.DataTable;
          this.datiSlaDTi = JSON.parse(JSON.stringify(data.DataTable));

          const slaG = {
            ROW_ID: 1,
            ID: -1,
            NAME: environment.stringaGlobalSettingSLA,
            OPERATOR_NAME: 'Maintenance',
            GROUP_NAME: 'root',
            DESCRIPTION: 'Global settings',
            FOLDER: 'Global',
            INSERT_TIMESTAMP: '2020-01-17 06:42:35',
            UPDATE_TIMESTAMP: '2020-01-17 06:42:35',
          }
          // this.datiSLA.DataTable.push(slaG);
          this.datiSlaDT.push(slaG);
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sla data:', this.datiSlaDT, this.slaValueGlobale);

          // this.pulisceFiltroSLA = !this.pulisceFiltroSLA;
          if (this.slaValueGlobale === undefined) {
            this.slaValueGlobale = 0;
          }
        }
      } else {
        this.datiSLA = 'empty grid'; // null;
        this.datiSlaDT = 'empty grid';
        // this.pulisceFiltroSLA = !this.pulisceFiltroSLA;
      }
    }, error => {
      alert(error);
    });
  }

  impostActivityNameSuFrames(n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto activity name su frame ' + n, e);
    setTimeout(() => {
      this.activitySetName[n] = e;
      this.nomeActivitySet = e;
    }, 100);
  }

  valoreActivitySet(n, e) {
    // const eee = this.Utilities.ritornaRigaTotaleDaDescrizioneCombo(e, this.datiActivitySet, 'NAME');
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore activity set ' + n + ':', e);
    if (e && e !== 'undefined' && e !== 'empty' && e !== null) {
      const ee = ExternalUtilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      setTimeout(() => {
        this.activitySelezionataA[n] = ee;
        this.activitySet[n] = ee.ID;
        this.impostActivityNameSuFrames(n, ee);

        this.selectTipoActivity(n, ee);
        this.nomeActivitySet = ee.NAME;

        this.checkDifferenceFromStartJSON();
      }, 100);
    // }
    }
  }

  mostraActivityComponent(q) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mostra component activity', q);
    this.LeggeDatiFolders(true, q);
  }

  visibileDaMascheraActivity(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura finestra activity', e);
    this.numeroActSet = -1;
    this.activityComponentShowed = false;
    this.LeggeActivitySetPR();
    this.LeggeActivityGroupPR();

    setTimeout(() => {
      const ee = e.split('§');
      this.leggeActivityDaSet(ee[0], ee[1]);

      AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, 0, 'VisibileDaMascheraActivity');

      this.checkDifferenceFromStartJSON();
      this.rinfrescaTuttiIframes();
    }, 1000);
  }

  mostraDashboardEditComponent() {
    if (this.dashboardSelected && this.dashboardSelected !== null) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta dash 2');
      this.dashboardSelected2 = this.dashboardSelected;

      const g = this.dashboardGroup;
      this.dashboardGroup = 'empty';
      this.dashboardGroup = g;

      this.dashboardEditComponentShowed = true;
    }
  }

  visibileDaMascheraDashboardEdit(e) {
    this.dashboardEditComponentShowed = false;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Maschera dashboard chiusa');
  }

  mostraDashboardListComponent() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.nomeDashboardSelezionata);
    this.nomeDashboardSelezionata2 = this.nomeDashboardSelezionata;

    const g = this.dashboardGroup;
    this.dashboardGroup = 'empty';
    this.dashboardGroup = g;

    this.dashboardListComponentShowed = true;
  }

  visibileDaMascheraDashboardList(e) {
    this.dashboardListComponentShowed = false;
    this.CaricaDatiDashboard(this.dashboardSelezionata);
  }

  confirmDaDahsboardList(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confirm dashboard list', e);
    if (e) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confirm dashboard list:', e);
      this.dashboardSelected = e;
      this.dashboardName = e.NAME;
      this.dashboardGroupName = e.GROUP_NAME;
      this.dashboardSelectedDescription = e.DESCRIPTION;
      if (this.dashboardSelectedDescription === null) { this.dashboardSelectedDescription = ''; };
      this.dashboardFolder = e.FOLDER;
      this.dashboardOperator = e.OPERATOR_NAME;
      this.impostazioni.dashboardSelezionata = e.ID;

      this.nomeDashboardSelezionata = e.ID;
      this.dashboardSelezionata = e.ID;
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confirm:', '*' + this.nomeDashboardSelezionata + '*');
      this.CaricaDatiDashboard(e.ID);
      // this.checkDifferenceFromStartJSON();
    }
  }

  selectDashboard(e) {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select dashboard: ', e, this.dashboardSelezionata);
    // }

    if (e && e !== 'empty') {
      const ee = ExternalUtilities.converteStringaInJSON(e);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, ee);

      /* for (let nf = 1; nf <= 9 ; nf ++) {
        for (let fa = 1; fa <= 5 ; fa ++) {
          this.viewOlG[fa][nf] = undefined;
          this.viewOlL[fa][nf] = undefined;
          // this.impostazioni.currZoom[fa][nf] = 10;
        }
        this.centroAttuale[nf] = '';
      } */

      if (ee !== null && ee.ID !== this.dashboardSelezionata) {
        this.dashboardSelected = ee;
        this.dashboardName = ee.NAME;
        this.dashboardGroupName = ee.GROUP_NAME;
        this.dashboardSelectedDescription = ee.DESCRIPTION;
        if (this.dashboardSelectedDescription === null) { this.dashboardSelectedDescription = ''; };
        this.dashboardFolder = ee.FOLDER;
        this.dashboardOperator = ee.OPERATOR_NAME;

        this.nomeDashboardSelezionata = ee.ID;

        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activitySet[1], this.activitySet[2], this.activitySet[3], this.activitySet[4]);
        // if (this.activitySet[1] !== -1 || this.activitySet[2] !== -1 || this.activitySet[3] !== -1 || this.activitySet[4] !== -1) {
        this.dashboardSelezionata = ee.ID;

        this.CaricaDatiDashboard(ee.ID);
        // }
      }
    } else {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulita dashboard:', e);
      this.dashboardSelected = '';
      this.dashboardName = '';
      this.dashboardGroupName = '';
      this.dashboardSelectedDescription = '';
      this.dashboardFolder = '';
      this.dashboardOperator = '';

      this.nomeDashboardSelezionata = '';
      this.dashboardSelezionata = 0;

      this.impostazioni = JSON.parse(JSON.stringify(this.impostazioniDefault));
      this.aggiornaLarghezzaContenitore();
    }
    this.checkDifferenceFromStartJSON();
  }

  CaricaDatiDashboard(q) {
    if (q) {
      if (this.lastQ === q) {
        return;
      }

      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Caricamento dati dashboard:', q);
      // this.activitySet1 = 0;
      // this.activitySet2 = 0;

      this.impostaValoriDefault();

      /* if (this.subscribe) {
        this.subscribe.unsubscribe();
      }
      this.subscribe = Observable.timer(0, 1000)
        .take(32000)
        .subscribe(() => {
          /* // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.caricataComboDashboard,
            this.caricataComboActivitSet,
            this.caricatoDashboardGroup,
            this.caricatoActivityGroup,
            this.caricatoSlaGroup,
            this.caricateMeasures &&
            this.caricatiLookUp &&
            this.caricatoBand &&
            this.caricatoRAT &&
            this.caricatoUEProf &&
            this.caricatoScenario &&
            this.caricatoNotebook &&
            this.caricatiMosaicStyle &&
            this.caricatiAddLayers); * /

          if (this.caricataComboDashboard &&
            this.caricataComboActivitSet &&
            this.caricatoDashboardGroup &&
            this.caricatoActivityGroup &&
            this.caricatoSlaGroup &&
            this.caricateMeasures &&
            this.caricatiLookUp &&
            this.caricatoBand &&
            this.caricatoRAT &&
            this.caricatoUEProf &&
            this.caricatoScenario &&
            this.caricatoNotebook &&
            this.caricatiMosaicStyle &&
            this.caricatiAddLayers) {

            this.subscribe.unsubscribe();
            this.effettuaCaricamento(q);
          }
        }); */

        const t = setInterval(() => {
          if (this.caricataComboDashboard &&
            this.caricataComboActivitSet &&
            this.caricatoDashboardGroup &&
            this.caricatoActivityGroup &&
            this.caricatoSlaGroup &&
            this.caricateMeasures &&
            this.caricatiLookUp &&
            this.caricatoBand &&
            this.caricatoRAT &&
            this.caricatoUEProf &&
            this.caricatoScenario &&
            this.caricatoNotebook &&
            this.caricatiMosaicStyle &&
            this.caricatiAddLayers) {

            clearInterval(t);
            this.effettuaCaricamento(q);
          }
        }, 1000);
    }
  }

  effettuaCaricamento(q) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, q);
    this.dbWorkOnDashboard = true;
    Utils.caricataDashboard = false;
    let d = new Date();
    if (this.debugCaricamentoDashboard === true) {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Effettuo caricamento dashboard', d, q);
    }

    /* for (let i = 0; i < environment.quantiSottoFrames; i++) {
      for (let k = 0; k < environment.quantiSottoFrames; k++) {
        this.impostazioni.viewOlL[i][k] = 'REFRESH';
        this.impostazioni.viewOlG[i][k] = 'REFRESH';
      }
    } */

    setTimeout(() => {
      ExternalUtilities.eseguitoBounds = false;
      this.resettaValoriFrame = !this.resettaValoriFrame;

      const params = '{' +
        '"cntx_id": "' + this.sessioneID + '",' +
        '"v_id": ' + q + ' ' +
      '}';
      this.apiService.chiamataPost(Utils, 'geo_dashboard__sel2', params)
      // .map(response => response)
      .subscribe((data: any) => {
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati dashboard: ', data2);
        // let data = JSON.parse(data2);
        if (data === undefined) { return; data = null; }
        if (data.v_err_code && data.v_err_code === 2) {
          alert(data.v_failure_reason);
        } else {
          // if (data.RESULT && data.RESULT[0].message.toUpperCase() === 'OK' && data.OBJECT[0].object.GEO_DASHBOARD.length > 0) {
          if (data[0]) {
            // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lettura config_json:', data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON);
            // if (data.OBJECT[0].object.GEO_DASHBOARD[0] && data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON
            //   && data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON !== null) {
            if (data[0].config_json && data[0].config_json !== null) {
              // let imp = data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON;
              let imp2 = data[0].config_json[0];
              // alert('Lunghezza json letto: ' + imp2.length);
              // imp = ExternalUtilities.sistemaStringaLettaDaDB(imp);
              if (this.debugCaricamentoDashboard === true) {
                d = new Date();
                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'JSON letto e convertito', d, imp);
              }

              // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni:', JSON.parse(imp), typeof(imp));

              // this.impostazioni.activity = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
              // this.activityName = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
              // this.activitySet = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
              // this.activitySetName = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');

              // const imp2 = JSON.parse(JSON.parse(JSON.stringify(imp)));
              if (imp2 === null || (imp2 !== null && typeof(imp2.maskSize) === 'undefined')) {
                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Config JSON non valido:', imp2, typeof(imp2));
                // alert('Config JSON not valid for this dashboard');
                // this.impostaValoriDefault();
                this.dbWorkOnDashboard = false;
                Utils.caricataDashboard = true;
                this.resettaValoriSuMaschera();
              } else {
                let impostazioni = imp2;

                const fa = new Array();
                impostazioni.frameAttivo.forEach(element => {
                  fa.push(+element);
                });
                impostazioni.frameAttivo = JSON.parse(JSON.stringify(fa));

                // console.log('IMPOSTAZIONI', this.impostazioni);
                
                /*
                const nomeFile = ExternalUtilities.sistemaNomeFrame(this, 'GeoAnts_Impostazioni') + '.json';
                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, nomeFile);
                const FileSaver = require('file-saver');
                const data2 = new Blob([JSON.stringify(this.impostazioni)], {type: 'application/json;charset=utf-8'});
                FileSaver.saveAs(data2, nomeFile);
                */

                if (this.debugCaricamentoDashboard === true) {
                  d = new Date();
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni inziali settate', d);
                }

                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Zooms caricati:', this.impostazioni.currZoom);
                /* // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'activity names:', this.activityName);
                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity set name:', this.activitySetName);

                this.cambioActivity(1, this.impostazioni.activity[1]);
                this.cambioActivity(2, this.impostazioni.activity[2]);
                this.cambioActivity(3, this.impostazioni.activity[3]);
                this.cambioActivity(4, this.impostazioni.activity[4]); */

                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.isNonSyncEventTime);

                this.slaValueGlobale = 0;

                // SISTEMA STYLE SIZE
                const ss = new Array();
                let riga = 0;
                if (impostazioni.styleSize) {
                  impostazioni.styleSize.forEach(element => {
                    ss.push(new Array());
                    element.forEach(element2 => {
                      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element2, typeof(element2));
                      if (typeof(element2) === 'object') {
                        element2 = 12;
                        ss[riga].push(12)
                      } else {
                        element2 = +element2;
                        ss[riga].push(element2);
                      }
                    });
                    riga++;
                  });
                  impostazioni.styleSize = JSON.parse(JSON.stringify(ss));
                }
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.styleSize);
                // SISTEMA STYLE SIZE

                if (impostazioni.globalMeasure && impostazioni.globalMeasure !== undefined &&
                  impostazioni.globalMeasure !== null) {
                  Utils.globalMeasure = JSON.parse(impostazioni.globalMeasure);
                }

                if (impostazioni.globalMeasureArfcn && impostazioni.globalMeasureArfcn !== undefined &&
                  impostazioni.globalMeasureArfcn !== null) {
                  Utils.globalMeasureArfcn = JSON.parse(impostazioni.globalMeasureArfcn);
                }

                // Si possono eliminare dopo il primo salvataggio
                this.aggiustaArray.aggiustaArray(this, this.UtilitiesInterne);
                
                // Si possono eliminare dopo il primo salvataggio
                if (impostazioni.maskSizeHor.length > 4) {
                  impostazioni.maskSizeHor = [0, 33, 33, 33];
                }
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize, this.impostazioni.maskSizeHor, this.impostazioni.maskVisible);

                const m = new Array();
                for (let n = 0; n <= environment.quantiFrames; n++) {
                  m.push(undefined);
                }
                for (let n = 0; n <= environment.quantiFrames; n++) {
                  const v = new Array();
                  for (let i = 0; i <= environment.quantiSottoFrames; i++) {
                    if (impostazioni.MappaOGrafico[i] && impostazioni.MappaOGrafico[i][n]) {
                      v.push(impostazioni.MappaOGrafico[i][n]);
                    } else {
                      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore non trovato', i, n);
                      impostazioni.MappaOGrafico.push(new Array());
                      for (let n2 = 0; n2 <= environment.quantiFrames; n2++) {
                        impostazioni.MappaOGrafico[i].push('--');
                      }
                      v.push('--');
                    }
                  }
                  m[n] = v;
                }
                this.MappaOGraficoTutti = m;
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.MappaOGraficoTutti);

                if (this.debugCaricamentoDashboard === true) {
                  d = new Date();
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Array aggiustati', d);
                }
      
                // if (this.debug2) {
                  this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi locali', impostazioni.listaEventi);
                // }

                // this.impostazioni.listaEventi = this.Utilities.creaMatrice(environment.quantiSottoFrames,
                // environment.quantiFrames, undefined);

                let x = 0;
                let y = 0;
                impostazioni.MappaOGrafico.forEach(element => {
                  y = 0;
                  element.forEach(element2 => {
                    if (element2 === '') {
                      impostazioni.MappaOGrafico[x][y] = '--';
                    }
                    y++;
                  });
                  x++;
                });

                let cambia = true;
                impostazioni.frameName.forEach(element => {
                  if (element[1] && element[1] !== '' && element[1] !== '<empty>') {
                    cambia = false;
                  }
                });
                if (cambia) {
                  if (impostazioni.titoloFrame) {
                    impostazioni.frameName = impostazioni.titoloFrame;
                  }
                }
                impostazioni.titoloFrame = undefined;

                this.creaNomiFrames();
                // if (this.debug2) {
                  this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'VALORI IMPOSTAZIONI', impostazioni);
                // }
                // console.log('VIEW AS: ', this.impostazioni.viewAs);

                if (this.debugCaricamentoDashboard === true) {
                  d = new Date();
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Creati nomi frames', d);
                }

                for (let j = 0; j <= environment.quantiSottoFrames; j ++) {
                  for (let i = 0; i <= environment.quantiFrames; i ++) {

                    /* if (!this.impostazioni.eventiSceltiES[j] || !this.impostazioni.eventiSceltiES[j][i]) {
                      this.impostazioni.eventiSceltiES.push(new Array());
                      this.impostazioni.overviewZoom.push(new Array());
                      this.impostazioni.activity.push(new Array());
                      this.impostazioni.frameDesc.push(new Array());
                      this.viewOlG.push(new Array());
                      this.viewOlL.push(new Array());
                      this.impostazioni.tipoMappa.push(new Array());
                      this.impostazioni.mapType.push(new Array());
                      this.impostazioni.isCheckedServingCell.push(new Array());
                      this.impostazioni.isCheckedShowPaths.push(new Array());
                      this.impostazioni.isCheckedAntenne.push(new Array());
                      this.impostazioni.measure.push(new Array());
                      this.slaValue.push(new Array());
                      this.impostazioni.slaName.push(new Array());
                      this.impostazioni.plmn.push(new Array());
                      this.impostazioni.netTech.push(new Array());
                      this.impostazioni.shownEvents.push(new Array());
                      this.impostazioni.modificaChart.push(new Array());
                      this.impostazioni.bandwidth.push(new Array());
                      this.impostazioni.countHistogram.push(new Array());
                      this.impostazioni.checkSeverity2.push(new Array());
                      this.impostazioni.listaEventi.push(new Array());
                      this.impostazioni.tabSelezionato.push(new Array());
                      this.impostazioni.currZoom.push(new Array());
                      this.impostazioni.viewAs.push(new Array());
                      this.impostazioni.overlay.push(new Array());
                      this.impostazioni.overlayCluster.push(new Array());
                      this.impostazioni.timeFilter.push(new Array());
                      this.impostazioni.viewDefinition.push(new Array());
                      this.impostazioni.styleSize.push(new Array());
                      this.impostazioni.histDisplayAs.push(new Array());
                      this.impostazioni.histDisplayTutto.push(new Array());
                      this.impostazioni.columnsBars.push(new Array());
                      this.impostazioni.eventsMeasure.push(new Array());
                      this.impostazioni.showPlanimetry.push(new Array());
                      this.impostazioni.columnsSettings.push(new Array());
                      this.impostazioni.tipoEvento.push(new Array());
                      this.impostazioni.fixedSeconds.push(new Array());
                      this.impostazioni.cellType.push(new Array());
                      this.impostazioni.addLayers.push(new Array());
                      this.impostazioni.filtroEventi.push(new Array());
                      this.impostazioni.showRays.push(new Array());
                      this.impostazioni.showMeasures.push(new Array());
                      this.impostazioni.squareMeters.push(new Array());
                      this.impostazioni.measureType.push(new Array());
                      this.impostazioni.mosaicStyle.push(new Array());
                      this.impostazioni.sartPosition.push(new Array());
                      this.impostazioni.bboxOZ.push(new Array());
                      this.impostazioni.geoFilter.push(new Array());
                      this.impostazioni.measureSMS.push(new Array());
                      this.impostazioni.showMeasuresS.push(new Array());
                      this.impostazioni.tipoDataset.push(new Array());
                      this.impostazioni.mappeMS.push(new Array());
                      this.impostazioni.clusterMeasure.push(new Array());
                      this.impostazioni.textFilter.push(new Array());
                      this.impostazioni.addGlobalLayer.push(new Array());
                      this.impostazioni.barraAperta.push(new Array());
                      this.impostazioni.opacity.push(new Array());
                      this.impostazioni.measureRCM.push(new Array());

                      for (let i2 = 0; i2 <= environment.quantiFrames; i2 ++) {
                        this.impostazioni.eventiSceltiES[j].push('');
                        this.impostazioni.overviewZoom[j].push(true);
                        this.impostazioni.activity[j].push('');
                        this.impostazioni.frameDesc[j].push('');
                        this.viewOlG[j].push(new OlView);
                        this.viewOlL[j].push(new OlView);
                        this.impostazioni.tipoMappa[j].push('');
                        this.impostazioni.mapType[j].push('');
                        this.impostazioni.isCheckedServingCell[j].push(true);
                        this.impostazioni.isCheckedShowPaths[j].push(true);
                        this.impostazioni.isCheckedAntenne[j].push(-1);
                        this.impostazioni.measure[j].push(new Array());
                        this.slaValue[j].push(-1);
                        this.impostazioni.slaName[j].push('');
                        this.impostazioni.plmn[j].push('');
                        this.impostazioni.netTech[j].push(true);
                        this.impostazioni.shownEvents[j].push(false);
                        this.impostazioni.modificaChart[j].push(true);
                        this.impostazioni.bandwidth[j].push(true);
                        this.impostazioni.countHistogram[j].push(true);
                        this.impostazioni.checkSeverity2[j].push(true);
                        this.impostazioni.listaEventi[j].push('');
                        this.impostazioni.tabSelezionato[j].push('');
                        this.impostazioni.currZoom[j].push('');
                        this.impostazioni.viewAs[j].push('');
                        this.impostazioni.overlay[j].push('');
                        this.impostazioni.overlayCluster[j].push('');
                        this.impostazioni.timeFilter[j].push('');
                        this.impostazioni.viewDefinition[j].push('');
                        this.impostazioni.styleSize[j].push('');
                        this.impostazioni.histDisplayAs[j].push('');
                        this.impostazioni.histDisplayTutto[j].push('');
                        this.impostazioni.columnsBars[j].push('');
                        this.impostazioni.eventsMeasure[j].push('');
                        this.impostazioni.showPlanimetry[j].push('');
                        this.impostazioni.columnsSettings[j].push('');
                        this.impostazioni.tipoEvento[j].push('');
                        this.impostazioni.fixedSeconds[j].push('');
                        this.impostazioni.cellType[j].push('');
                        this.impostazioni.addLayers[j].push('');
                        this.impostazioni.filtroEventi[j].push('');
                        this.impostazioni.showRays[j].push(false);
                        this.impostazioni.showMeasures[j].push(false);
                        this.impostazioni.squareMeters[j].push(false);
                        this.impostazioni.measureType[j].push(true);
                        this.impostazioni.mosaicStyle[j].push(true);
                        this.impostazioni.sartPosition[j].push(false);
                        this.impostazioni.bboxOZ[j].push(undefined);
                        this.impostazioni.geoFilter[j].push(false);
                        this.impostazioni.measureSMS[j].push(false);
                        this.impostazioni.showMeasuresS[j].push(false);
                        this.impostazioni.tipoDataset[j].push(2);
                        this.impostazioni.mappeMS[j].push(false);
                        this.impostazioni.clusterMeasure[j].push(false);
                        this.impostazioni.textFilter[j].push('');
                        this.impostazioni.addGlobalLayer[j].push(false);
                        this.impostazioni.barraAperta[j].push(false);
                        this.impostazioni.opacity[j].push(false);
                        this.impostazioni.measureRCM[j].push(-1);
                      }
                    } */

                    if (impostazioni.eventiSceltiGlobaliES) {
                      this.cambioEventiSceltiGlobali(j, i, impostazioni.eventiSceltiGlobaliES);
                    }

                    if (impostazioni.eventiSceltiES) {
                      this.cambioEventiScelti(j, i, impostazioni.eventiSceltiES);

                      /* if (impostazioni.overviewZoom[j][i] === undefined ||
                        impostazioni.overviewZoom[j][i] === null) {
                        impostazioni.overviewZoom[j][i] = true;
                      } */
                      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, j, i, this.impostazioni.activity[j][i]);
                      if (impostazioni.activity[j] !== undefined) {
                        let name;
                        if (impostazioni.activity[j][i] === 0) {
                          name = environment.stringaLatestSelection;
                        } else {
                          if (impostazioni.activity[j][i] === -1) {
                            name = environment.stringaAll;
                          } else {
                            if (impostazioni.activity[j][i] !== '') {
                              name = this.activitySetName[impostazioni.activity[j][i]];
                            }
                          }
                        }
                        if (name === ' ' || name === '') {
                          name = 'empty';
                        }
                        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, j, i, name);a
                        this.activityName[j][i] = name;
                      }
                      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, name);
                    }
                  }
                }
                this.activityName = JSON.parse(JSON.stringify(this.activityName));

                // this.impostazioni.titoloFrame = JSON.parse(JSON.stringify(this.impostazioni.frameName));
                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni, this.impostazioni.frameName);
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'activity name', this.activityName);
                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi frames', this.impostazioni.frameName);
                /* if (this.impostazioni.frameName.length > environment.quantiFrames + 1) {
                  const fm = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
                  this.impostazioni.frameName = fm;
                  this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi frames Modificato', this.impostazioni.frameName);
                } */

                if (this.debugCaricamentoDashboard === true) {
                  d = new Date();
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostate activity name', d);
                }

                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'activity names:', this.activityName);

                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskVisible);

                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'cambiato SHOW RAYS ALL caricando', this.impostazioni.showRaysAllLayer[1][4]);

                /* for (let i = 0; i < 5 ; i++) {
                  if (this.impostazioni.overviewZoom[i]) {
                    this.viewOlLocal[i] = {...this.viewOl};
                  }
                } */
                // this.impostazioni.maskVisible = [true, true, true, true, true, true, true, true, true, true, true];

                this.checkDifferenceFromStartJSON();
                this.aggiornaLarghezzaContenitore();

                if (this.debugCaricamentoDashboard === true) {
                  d = new Date();
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'check differenze e aggiornamento larghezza contenitore', d);
                }

                // this.calcolaCentro = !this.calcolaCentro;

                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'MISURE', this.impostazioni.measure);
                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'MISURE', this.impostazioni.MappaOGrafico);
                for (let i = 0; i <= impostazioni.measure.length - 1; i++) {
                  const element = impostazioni.measure[i];
                  const tipo = impostazioni.MappaOGrafico[i];
                  for (let j = 0; j <= element.length - 1; j++) {
                    const tipo2 = tipo[j];
                    if (tipo2 === 'M') {
                      const element2 = element[j];
                      if (element2 && element2 !== null && element2[0] !== undefined) {
                        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, i, j, element2, element2[0], tipo2);
                        impostazioni.measure[i][j][0] = '';
                      }
                    }
                  };
                };
                // if (this.debug2) {
                  this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'MISURE MOD', impostazioni.measure);
                // }

                this.prendeDescrizioniDiTuttiIframes();

                // this.rinfrescaTuttiIframes();

                if (this.debugCaricamentoDashboard === true) {
                  d = new Date();
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Frames rinfrescati', d);
                }

                this.tipoMappeCaricate = JSON.parse(JSON.stringify(impostazioni.mapType));

                // this.settaVisteDaPassare();

                if (this.debugCaricamentoDashboard === true) {
                  d = new Date();
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Viste da passare settate', d);
                }

                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize, this.impostazioni.maskVisible);
                // this.gest_finestre.controllaPerRighe(this);

                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misura globale', this.impostazioni.globalMeasure)
                if (impostazioni.globalMeasure) {
                  const m = JSON.parse(impostazioni.globalMeasure);
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misura globale parsato', m);
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure', this.measureData);

                  this.measureData.forEach(element => {
                    if (m && m.MEASR_CODE && element && element.CODE && m.MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
                      this.Utils.tipoMisuraGlobale = +element.TYPE;
                      impostazioni.tipoMisuraGlobale = +element.TYPE;
                    }
                  });
                }
                if (impostazioni.globalMeasureArfcn) {
                  const m = JSON.parse(impostazioni.globalMeasureArfcn);
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misura globale parsato', m);
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure', this.measureData);

                  this.measureData.forEach(element => {
                    if (m && m.MEASR_CODE && element && element.CODE && m.MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
                      this.Utils.tipoMisuraGlobaleArfcn = +element.TYPE;
                      impostazioni.tipoMisuraGlobaleArfcn = +element.TYPE;
                    }
                  });
                }
                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo Misura globale', this.impostazioni.tipoMisuraGlobale)

                /* this.impostazioni.showRaysAllLayer = new Array();
                this.impostazioni.measureRCM = new Array();
                for (let i2 = 0; i2 <= environment.quantiFrames; i2 ++) {
                  this.impostazioni.showRaysAllLayer.push(true);
                  this.impostazioni.measureRCM.push(-1);
                } */

                setTimeout(() => {
                  Utils.caricataDashboard = true;
                  this.dbWorkOnDashboard = false;

                  // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.Maximized, this.impostazioni.maximized, this.impostazioni.maskSize);
                  // RIMETTERE. SISTEMAZIONE LAYOUT
                  /* let index = 0;
                  if (this.impostazioni.Maximized > 0) {
                    this.gest_finestre.controllaPerRighe(this);
                    this.impostazioni.maskSize.forEach(element => {
                      if (element === 100) {
                        this.impostazioni.Maximized = index;
                        this.impostazioni.maximized[index] = true
                        this.gest_finestre.massimizzaFinestre(this, index);
                      }
                      index++;
                    });
                    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.Maximized, this.impostazioni.maximized, this.impostazioni.maskSize);
                  }
                  index = 0;
                  // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize,this.impostazioni.Maximized);
                  this.Utilities.dimensioniFrames = JSON.parse(JSON.stringify(this.impostazioni.maskSize));
                  this.Utilities.dimensioniFramesModif = JSON.parse(JSON.stringify(this.impostazioni.maskSize));
                  // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.dimensioniFrames);

                  if (this.impostazioni.Maximized === 0) {
                    this.impostazioni.maskSize.forEach(element => {
                      if (element === 0) {
                        this.impostazioni.maskVisible[index] = false;
                      } else {
                        this.impostazioni.maskVisible[index] = true;
                      }
                      index++;
                    });
                  }
                  */
                  Utils.dimensioniFrames = JSON.parse(JSON.stringify(impostazioni.maskSize));
                  Utils.dimensioniFramesModif = JSON.parse(JSON.stringify(impostazioni.maskSize));
                  // RIMETTERE. SISTEMAZIONE LAYOUT

                  // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskVisible);

                  // TOLTO PER CAPIRE SE DAVA PROBLEMI
                  // this.gest_finestre.controllaPerRighe(this);
                  // TOLTO PER CAPIRE SE DAVA PROBLEMI

                  /* // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskVisible, this.impostazioni.maskSize,
                    this.impostazioni.maskSizeHor, this.impostazioni.maskDisabled56);

                  this.impostazioni.maskVisibleHor[1] = true;
                  this.impostazioni.maskVisibleHor[2] = true;
                  this.impostazioni.maskVisibleHor[3] = true;

                  this.impostazioni.maskSizeHor[1] = 33;
                  this.impostazioni.maskSizeHor[2] = 33;
                  this.impostazioni.maskSizeHor[3] = 33;

                  this.impostazioni.maskDisabled12 = false;
                  this.impostazioni.maskDisabled34 = false;
                  this.impostazioni.maskDisabled56 = false;
                  this.impostazioni.maskDisabledH1 = false; */

                  if (this.datiActivitySet && this.datiActivitySet[0] && this.datiActivitySet[0].NAME) {
                    if (this.datiActivitySet[0].NAME.indexOf('[AGN] ') > -1) {
                      ExternalUtilities.stringaAGNoACT = this.datiActivitySet[0].NAME;
                      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PRESO DATASET: ', ExternalUtilities.stringaAGNoACT);
                    }
                  }
    
                  this.massimizzata = [ false, false, false, false, false, false, false, false, false, false];
                  if (impostazioni.frameMassimizzato > -1) {
                    this.massimizzata[impostazioni.frameMassimizzato] = true;
                  }

                  if (!this.mapTypeG || this.mapTypeG === null || +this.mapTypeG < 1) {
                    this.mapTypeG = 1;
                  }

                  impostazioni.maskVisible = [false, true, true, true, true, true, true, true, true, true, true];

                  setTimeout(() => {
                    // this.impostazioni.titoloFrame = JSON.parse(JSON.stringify(this.impostazioni.frameName));

                    // if (this.debug2) {
                      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Square meters', this.impostazioni.squareMeters);
                    // }

                    this.aggiustaArray.controllaDimensioneGiusta(this, this.UtilitiesInterne);

                    this.impostazioniIniziali = JSON.parse(JSON.stringify(impostazioni));
                    this.checkDifferenceFromStartJSON();

                    this.impostaValoriMascheraProgetto = !this.impostaValoriMascheraProgetto;

                    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.cellType);
                    console.log('IMPOSTAZIONI CARICATE', impostazioni);

                    // console.log('Frame attivi', impostazioni.frameAttivo, this.numeroSecondoFrame);

                    this.impostazioni = JSON.parse(JSON.stringify(impostazioni));
                  }, 1000);

                  if (this.debugCaricamentoDashboard === true) {
                    d = new Date();
                    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fine caricamento', d);
                  }
                }, 3000);
              }
            } else {
              this.dbWorkOnDashboard = false;
              // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Config JSON nullo');
              // alert('Config JSON null for this dashboard');

              this.resettaValoriSuMaschera();
            }
          } else {
            this.dbWorkOnDashboard = false;
            // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Problemi nella lettura del Config JSON');
            // alert('Config JSON error for this dashboard');

            this.resettaValoriSuMaschera();

            if (data.RESULT && data.RESULT[0].message.toUpperCase() !== 'OK') {
              alert(data.RESULT[0].message);
            }
          }
        }
      }, error => {
        this.dbWorkOnDashboard = false;
        this.impostaValoriDefault();
        alert('Error in load dashboard:' + error);
      });

      // this.controllaEsistenzaValoriCombo();
    }, 1000);
  }

  resettaValoriSuMaschera() {
    this.impostaValoriDefault();

    this.checkDifferenceFromStartJSON();
    this.aggiornaLarghezzaContenitore();

    this.dashboardSelectedDescription = '';
    // this.dashboardSelected = 'empty';
    // this.dashboardSelected2 = 'empty';

    this.rinfrescaTuttiIframes();

    this.settaMascheraVuota = !this.settaMascheraVuota;
  }

  aggiornaLarghezzaContenitore() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AggiornaLarghezzaContenitore');
    this.larghezzaContenitore = this.sanitizer.bypassSecurityTrustStyle('calc(100%)'); // - (' + (this.dimeDrawer + 3) + 'px)');
  }

  apriChiudiDrawer() {
    if (this.dimeDrawer === this.dimeDrawerInizio) {
      this.dimeDrawer = this.impostazioni.actualDimeDrawer;
      this.aggiornaLarghezzaContenitore();
    } else {
      if (this.opacitaBottone === 1) {
        this.opacitaBottone = .5;
      }
      this.dimeDrawer = this.dimeDrawerInizio;
      this.aggiornaLarghezzaContenitore();
    }
    this.checkDifferenceFromStartJSON();

    this.rinfrescaTuttiIframes();
  }

  /* scurisceBottone() {
    if (this.opacitaBottone === .5) {
      this.opacitaBottone = 1;
    }
  }

  schiarisceBottone() {
    if (this.dimeDrawer < 300) {
      if (this.opacitaBottone === 1) {
        this.opacitaBottone = .5;
      }
    } else {
      if (this.opacitaBottone === .5) {
        this.opacitaBottone = 1;
      }
    }
  } */

  onResizingDrawer(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onResizingDrawer');
    this.dimeDrawer = e.size.width;
    this.impostazioni.actualDimeDrawer = this.dimeDrawer;
    this.aggiornaLarghezzaContenitore();

    this.refreshMaschera.forEach(element => {
      element = !element;
    });

    this.checkDifferenceFromStartJSON();
  }

  cambioNomeFrame(f, n, e) {
    this.impostazioni.frameName[n][f] = e;
    this.creaNomiFrames();
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio nome frame ' + n + ': ', e);
    // }
    this.checkDifferenceFromStartJSON();
  }

  /* cambioTitoloFrame(f, n, e) {
    setTimeout(() => {
      this.impostazioni.frameName[f][n] = e;
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio nome frame ' + n + ', frame ' + f + ': ', e);
      this.creaNomiFrames();
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio nome frame dopo ', this.impostazioni.frameName[f][n]);
      this.checkDifferenceFromStartJSON();
    }, 100);
  } */

  descrizioniDiTuttiIframes;

  prendeDescrizioniDiTuttiIframes() {
    const descrizioniDiTuttiIframes = new Array();
    for (let i = 0; i <= environment.quantiFrames; i++) {
      const descFrame = new Array();
      for (let k = 0; k <= environment.quantiSottoFrames; k++) {
        descFrame.push(this.impostazioni.frameDesc[k][i]);
      }
      descrizioniDiTuttiIframes.push(descFrame);
    }
    this.descrizioniDiTuttiIframes = descrizioniDiTuttiIframes;
    // console.log('Descrizioni di tutti i frames', this.impostazioni.frameDesc, this.descrizioniDiTuttiIframes);
  }

  cambioDescFrame(f, n, e) {
    this.impostazioni.frameDesc[f][n] = e;

    console.log('Cambio descrizione frame', f, n, e);

    this.prendeDescrizioniDiTuttiIframes();
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio desc frame 1: ', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioMG(f, n, e) {
    if (this.impostazioni.MappaOGrafico && this.impostazioni.MappaOGrafico[f] && this.impostazioni.MappaOGrafico[f][n] !== e) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo frame', n, e);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vecchio tipo frame', this.impostazioni.MappaOGrafico[f][n]);

      this.impostazioni.MappaOGrafico[f][n] = e;
      const v = new Array();
      for (let i = 0; i <= environment.quantiSottoFrames; i++) {
        v.push(this.impostazioni.MappaOGrafico[i][n]);
      }
      if (this.MappaOGraficoTutti) {
        this.MappaOGraficoTutti[n] = v;
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mappa o grafico 1:', e);
        if (this.impostazioni.MappaOGrafico[f][n] === 'M') {
          this.resetPosition();
        }
      }
      this.checkDifferenceFromStartJSON();
    }
  }

  cambiooverviewZoom(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio overview zoom', f, n, e);
    if (e !== undefined && this.impostazioni.overviewZoom && this.impostazioni.overviewZoom[f]) {
      this.impostazioni.overviewZoom[f][n] = e;
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.overviewZoom);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio global view:', f, n, e);
      this.checkDifferenceFromStartJSON();
    }
  }

  cambioViewAs(f, n, e) {
    this.impostazioni.viewAs[f][n] = e;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio viewas:', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoMappa(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo mappa:', e);
    this.impostazioni.mapType[f][n] = e;
    this.tipoMappeCaricate[n] = e;

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato tipo mappa: ', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioIsCheckedSC(f, n, e) {
    this.impostazioni.isCheckedServingCell[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioIsCheckedSP(f, n, e) {
    this.impostazioni.isCheckedShowPaths[f][n] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show paths', this.impostazioni.isCheckedShowPaths[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioIsCheckedSSP(f, n, e) {
    if (this.impostazioni.isCheckedShowSelectedPaths === undefined || this.impostazioni.isCheckedShowSelectedPaths[0] === undefined || this.impostazioni.isCheckedShowSelectedPaths[0][0] === undefined) {
      this.impostazioni.isCheckedShowSelectedPaths = Utils.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }

    this.impostazioni.isCheckedShowSelectedPaths[f][n] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show paths', this.impostazioni.isCheckedShowPaths[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioShowRays(f, n, e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato show rays app', f, n, e);
    this.impostazioni.showRays[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioSartPosition(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio sart position', f, n, e);
    this.impostazioni.sartPosition[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioMeasureSMS(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', f, n, e);
    this.impostazioni.measureSMS[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioMappeMS(f, n, e) {
    this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mappe MS 1', f, n, e);
    this.impostazioni.mappeMS[f][n] = e;
    this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mappe MS 2', this.impostazioni.mappeMS);

    this.checkDifferenceFromStartJSON();
  }

  cambioClusterMeasure(f, n, e) {
    console.log('Cambio Cluster measure in app', e);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', f, n, e);
    this.impostazioni.clusterMeasure[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioClusterMeasure2(f, n, e) {
    this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster measure 2', f, n, e);
    this.impostazioni.clusterMeasure2[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  /* cambioLov(f, n, e) {
    this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio lov', f, n, e);
    this.impostazioni.lov[f][n] = e;
    this.checkDifferenceFromStartJSON();
  } */

  cambioCorrelation(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', f, n, e);
    this.impostazioni.correlation[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioTextFilter(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', f, n, e);
    // console.log('Text filter app', e);
    this.impostazioni.textFilter[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioTextFilter2(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', f, n, e);
    this.impostazioni.textFilter2[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  /* cambioTextLov(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', f, n, e);
    this.impostazioni.textLov[f][n] = e;
    this.checkDifferenceFromStartJSON();
  } */

  cambioGlobalLayer(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', f, n, e);
    this.impostazioni.addGlobalLayer[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioMeasureRCM(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', f, n, e);
    this.impostazioni.measureRCM[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioShowRaysAllLayer(f, n, e) {
    this.impostazioni.showRaysAllLayer[f][n] = e;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato show rays all layers', f, n, e, this.impostazioni.showRaysAllLayer[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioIsCheckedAntenne(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio antenne frame ' + n + ':', e);
    // if (e === 1) {
    this.impostazioni.isCheckedAntenne[f][n] = e;
    // } else {
    //   this.impostazioni.isCheckedAntenne[n] = false;
    // }
    this.checkDifferenceFromStartJSON();
  }

  isStandAloneMRChanged(f, n, e) {
    if (this.impostazioni.isStandAloneMR === undefined || this.impostazioni.isStandAloneMR[0] === undefined || this.impostazioni.isStandAloneMR[0][0] === undefined) {
      this.impostazioni.isStandAloneMR = Utils.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio antenne frame ' + n + ':', e);
    // if (e === 1) {
    this.impostazioni.isStandAloneMR[f][n] = e;
    // } else {
    //   this.impostazioni.isCheckedAntenne[n] = false;
    // }
    this.checkDifferenceFromStartJSON();
  }

  cambioNonSyncEventTime(f, n, e) {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio isNonSync ' + n + ':', e);
    // }
    // if (e === 1) {
    if (this.impostazioni.isNonSyncEventTime[f]) {
      this.impostazioni.isNonSyncEventTime[f][n] = e;
    }
    // } else {
    //   this.impostazioni.isCheckedAntenne[n] = false;
    // }
    this.checkDifferenceFromStartJSON();
  }

  cambioShowAxisX(f, n, e) {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show axis x ' + n + ':', e);
    // }
    // if (e === 1) {
    if (this.impostazioni.showAxisX[f]) {
      this.impostazioni.showAxisX[f][n] = e;
    }
    // } else {
    //   this.impostazioni.isCheckedAntenne[n] = false;
    // }
    this.checkDifferenceFromStartJSON();
  }

  cambioMeasure(f, q, e) {
    // console.log('Cambio meassure', f, q, e);
    // console.log('Cambio measure 2', this.impostazioni.measure[f][q]);
    this.impostazioni.measure[f][q] = e;
    // this.impostazioni.measure = JSON.parse(JSON.stringify(this.impostazioni.measure));
    console.log('Impostazione misure 1', this.impostazioni.measure);
    this.checkDifferenceFromStartJSON();
  }

  cambioOverlay(f, q, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio misura overlay', q, e);
    this.impostazioni.overlay[f][q] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioOverlayCluster(f, q, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio misura overlay cluster', q, e);
    this.impostazioni.overlayCluster[f][q] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioTimeFilter(f, q, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio timeFilter', f, q, e);
    if (this.impostazioni.timeFilter[f]) {
      this.impostazioni.timeFilter[f][q] = e;
      this.checkDifferenceFromStartJSON();
    }
  }

  cambioBboxOZ(f, q, e) {
  /*   // this.impostazioni.bboxOZ[f][q] = e;
    this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio bbox Overview Zoom', f, q, e, this.impostazioni.bboxOZ);

    switch (+e) {
      case 3:
        break;
      case 1:
        this.bboxO =  { frame: q, valori: this.bboxO }; // this.bbox;
        break;
      case 2:
        this.bboxZ =  { frame: q, valori: this.bboxZ }; // this.bbox;
        break;
    }
    this.checkDifferenceFromStartJSON(); */
  }

  cambioHistDisplayAs(f, q, e) {
    this.impostazioni.histDisplayAs[f][q] = e;
    this.impostazioni.histDisplayAs = JSON.parse(JSON.stringify(this.impostazioni.histDisplayAs));
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo istogramma', f, q, e, this.impostazioni.histDisplayAs[f][q]);
    this.checkDifferenceFromStartJSON();
  }

  cambioHistDisplayTutto(f, q, e) {
    this.impostazioni.histDisplayTutto[f][q] = e;
    this.impostazioni.histDisplayTutto = JSON.parse(JSON.stringify(this.impostazioni.histDisplayTutto));
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo istogramma', f, q, e, this.impostazioni.histDisplayAs[f][q]);
    this.checkDifferenceFromStartJSON();
  }

  cambioPlanimetry(f, q, e) {
    this.impostazioni.showPlanimetry[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio planimetry', f, q, e, this.impostazioni.showPlanimetry[f][q]);
    this.impostazioni.showPlanimetry = JSON.parse(JSON.stringify(this.impostazioni.showPlanimetry));
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoEvento(f, q, e) {
    this.impostazioni.tipoEvento[f][q] = e;
    // console.log('Tipo evento in app: ', f, q, e);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo evento', f, q, e, this.impostazioni.tipoEvento[f][q]);
    // this.impostazioni.tipoEvento = JSON.parse(JSON.stringify(this.impostazioni.tipoEvento));
    this.checkDifferenceFromStartJSON();
  }

  cambioStyleSize(f, q, e) {
    this.impostazioni.styleSize[f][q] = e;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio style size', f, q, e, this.impostazioni.styleSize[f][q]);
    this.impostazioni.styleSize = JSON.parse(JSON.stringify(this.impostazioni.styleSize));
    this.checkDifferenceFromStartJSON();
  }

  cambioCellType(f, q, e) {
    this.impostazioni.cellType[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cell type', f, q, e, this.impostazioni.cellType[f][q]);
    this.impostazioni.cellType = JSON.parse(JSON.stringify(this.impostazioni.cellType));
    this.checkDifferenceFromStartJSON();
  }

  cambioOpacity(f, q, e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio opacità in app', f, q, e);
    this.impostazioni.opacity[f][q] = e;
    this.impostazioni.opacity = JSON.parse(JSON.stringify(this.impostazioni.opacity));
    this.checkDifferenceFromStartJSON();
  }

  cambioAddLayers(f, q, e) {
    this.impostazioni.addLayers[f][q] = e;
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio add layers', f, q, e, this.impostazioni.addLayers[f][q]);
    // }
    this.impostazioni.addLayers = JSON.parse(JSON.stringify(this.impostazioni.addLayers));
    this.checkDifferenceFromStartJSON();
  }

  aperturaFiltroEventi(e) {
    /* setTimeout(() => {
      this.zIndexSplitArea = 1;
    }, 100); */
    // alert('zindex: ' + this.zIndexSplitArea);
  }

  cambioFiltroEventi(f, q, e) {
    // // console.log('Cambio filtro eventi', f, q, e);
    // // console.log('Cambio filtro eventi', JSON.parse(JSON.stringify(this.impostazioni.filtriEventi)));
    this.impostazioni.filtriEventi[f][q] = e;
    console.log('Cambio filtro eventi', f, q, this.impostazioni.filtriEventi);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    // this.impostazioni.filtriEventi = JSON.parse(JSON.stringify(this.impostazioni.filtriEventi));
    this.checkDifferenceFromStartJSON();
  }

  /* cambioFiltroEventiCol1(f, q, e) {
    this.impostazioni.filtroEventiCol1[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol1 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol1));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol2(f, q, e) {
    this.impostazioni.filtroEventiCol2[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol2 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol2));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol3(f, q, e) {
    this.impostazioni.filtroEventiCol3[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol3 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol3));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol4(f, q, e) {
    this.impostazioni.filtroEventiCol4[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol4 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol4));
    this.checkDifferenceFromStartJSON();
  } */

  cambioFixedSeconds(f, q, e) {
    this.impostazioni.fixedSeconds[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio fixed seconds', f, q, e, this.impostazioni.fixedSeconds[f][q]);
    this.impostazioni.fixedSeconds = JSON.parse(JSON.stringify(this.impostazioni.fixedSeconds));
    this.checkDifferenceFromStartJSON();
  }

  // cambioEventiSceltiES(f, q, e) {
  //   this.impostazioni.eventiSceltiES = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio eventi globali', f, q, e, this.impostazioni.eventiSceltiES[f][q]);
  //   this.checkDifferenceFromStartJSON();
  // }

  /* cambioColumnsSettings(f, q, e) {
    this.impostazioni.columnsSettings[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio column settings', f, q, e, this.impostazioni.columnsSettings[f][q]);
    this.impostazioni.columnsSettings = JSON.parse(JSON.stringify(this.impostazioni.columnsSettings));
    this.checkDifferenceFromStartJSON();
  } */

  cambioColumnsBars(f, q, e) {
    this.impostazioni.columnsBars[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioDoubleGraph(f, q, e) {
    ///// this.impostazioni.doubleGraph[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioListaCampiTCRP(f, q, e) {
    this.impostazioni.listaCampiTCRP[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioDimensioniSplitTcRun(f, q, e) {
    this.impostazioni.dimensioniSplitTcRun[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    // // console.log('Cambio dimensioni split tcrun', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioImpostazioniPivot(f, q, e) {
    if (e) {
      this.impostazioni.impostazioniPivotGrid[f][q] = e;
      // console.log('Impostazioni pivot app', this.impostazioni.impostazioniPivotGrid, f, q);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
      // // console.log('Cambio dimensioni split tcrun', f, q, e);
      this.checkDifferenceFromStartJSON();
    }
  }

  cambioTipoDatiLayout(f, q, e) {
    if (e) {
      this.impostazioni.tipoDatiLayout[f][q] = e;
      // console.log('Impostazioni pivot tipo dati layout', this.impostazioni.tipoDatiLayout, f, q);
      this.checkDifferenceFromStartJSON();
    }
  }

  cambioEventsMeasure(f, q, e) {
    this.impostazioni.eventsMeasure[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioDesignInfo(q, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio designInfo', q, e);
    this.designInfo[q] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioSla(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio sla da frame ' + n, e);
    this.slaValue[f][n] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio sla 1:', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioActivity(f, n, e) {
    const ee: number = +e;

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity del frame ' + n + '/SF ' + f + ' -> ', e);

    switch (ee) {
      case 0:
        this.activityName[f][n] = environment.stringaLatestSelection;
        this.impostazioni.activity[f][n] = ee;

        break;
      case -1:
        this.activityName[f][n] = environment.stringaAll;
        this.impostazioni.activity[f][n] = ee;

        break;
      default:
        this.activitySelezionataA[n] = ee;

        let act = this.activitySetName[ee];
        if (act === '' || act === ' ') { act = 'empty'; };
        this.activityName[f][n] = act;
        this.impostazioni.activity[f][n] = ee;
        break;
    }
    // this.activityName = JSON.parse(JSON.stringify(this.activityName));

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome sets: ', this.activitySetName);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome set ' + e + ': ', this.activitySetName[+e]);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'activityName: ', this.activityName);
    // this.impostazioni.activity[n] = ee;
    // this.activitySet[n] = ee;
    // this.activityName[n] = this.activitySetName[+e];


    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numero activity impostate:', this.impostazioni.activity);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi activity impostate:', this.activityName);

    // this.impostaNomiActivity(n, e);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity:', this.activitySetName[ee]);

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numero activity impostate 2:', this.impostazioni.activity);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi activity impostate 2:', this.activityName);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activityName);

    // this.calcolaCentro = !this.calcolaCentro;

    AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, 0, 'CambioActivity');

    this.checkDifferenceFromStartJSON();
    this.rinfrescaTuttiIframes();
  }

  impostaNomiActivity(f, n, e) {
    let nomeActivity = null;
    // let numeroActivity = -1;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo e:', e, typeof(e));
    if (e !== 'empty' && typeof(e) !== 'object') {
      nomeActivity = this.activitySetName[e];
      // numeroActivity = e;
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta nome activity:', f, n, e, nomeActivity);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca: ', this.datiActivitySet, e);
      /* this.datiActivitySet.forEach(element => {
        if (nomeActivity === null) {
          if (element.NAME === confronto) {
            nomeActivity = element;
          }
        }
      }); */
    } else {
      nomeActivity = e;
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Che numero devo mettere?', f, n, e);
    }
    this.nomeActivitySet = nomeActivity;

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'N:', n);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome activity:', nomeActivity);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numeri activity set:', this.impostazioni.activity);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity names:', this.activityName);

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi nuove activity prima:', f, n, e, this.impostazioni.activity, nomeActivity, this.activityName);
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][1] === n) {
      this.activityName[f][1] = nomeActivity;
    }
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][2] === n) {
      this.activityName[f][2] = nomeActivity;
    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo 3:', this.impostazioni.activity[3], n);
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][3] === n) {
      this.activityName[f][3] = nomeActivity;
      // this.impostazioni.activity[3] = numeroActivity;
    }
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][4] === n) {
      this.activityName[f][4] = nomeActivity;
    }
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][5] === n) {
      this.activityName[f][5] = nomeActivity;
    }
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][6] === n) {
      this.activityName[f][6] = nomeActivity;
    }
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][7] === n) {
      this.activityName[f][7] = nomeActivity;
    }
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][8] === n) {
      this.activityName[f][8] = nomeActivity;
    }
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][9] === n) {
      this.activityName[f][9] = nomeActivity;
    }
    // this.impostazioni.activity[n] = numeroActivity;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi nuove activity dopo:', f, n, e, this.impostazioni.activity, nomeActivity, this.activityName);
  }

  cambioPlmn(f, n, e) {
    this.impostazioni.plmn[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioNetTech(f, n, e) {
    this.impostazioni.netTech[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioShownEvents(f, n, e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.shownEvents[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioShowMeasures(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.showMeasures[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioShowVoiceCallMeasures(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.showVoiceCallMeasures[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioShowDataMeasures(f, n, e) {
    this.impostazioni.showDataMeasures[f][n] = e;
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'cambiato show data measures', this.impostazioni.showDataMeasures[f][n]);
    // }
    this.checkDifferenceFromStartJSON();
  }

  cambioShowCoverageMeasures(f, n, e) {
    this.impostazioni.showCoverageMeasures[f][n] = e;
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'cambiato show data measures', this.impostazioni.showCoverageMeasures[f][n]);
    // }
    this.checkDifferenceFromStartJSON();
  }

  cambioShowMeasuresS(f, n, e) {
    this.impostazioni.showMeasuresS[f][n] = e;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Show measures s', this.impostazioni.showMeasuresS);
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoDataset(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.showMeasuresS);
    this.impostazioni.tipoDataset[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioSquareMeters(f, n, e) {
    this.impostazioni.squareMeters[f][n] = e;
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio square meters in app', this.impostazioni.squareMeters, f, n);
    // }
    this.checkDifferenceFromStartJSON();
  }

  cambioMosaicStyle(f, n, e) {
    this.impostazioni.mosaicStyle[f][n] = e;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mosaic style', this.impostazioni.mosaicStyle[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioMeasureType(f, n, e) {
    this.impostazioni.measureType[f][n] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio square meters', this.impostazioni.squareMeters);
    this.checkDifferenceFromStartJSON();
  }

  cambioDoNotSetGM(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.doNotSetGM[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioModificaChart(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.modificaChart[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioBW(f, n, e) {
    this.impostazioni.bandwidth[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioHistogramEmit(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio count histogram del frame ' + n, e);
    this.impostazioni.countHistogram[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioSeverityEmit(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio count histogram del frame ' + n, e);
    this.impostazioni.checkSeverity2[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  undo() {
    // this.impostazioni = JSON.parse(JSON.stringify(this.impostazioniIniziali));
    // this.checkDifferenceFromStartJSON();
    // this.aggiornaLarghezzaContenitore();
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.dashboardSelezionata);
    let valore = this.dashboardSelezionata.ID;
    if (valore === undefined) { valore = this.dashboardSelezionata; }
    this.effettuaCaricamento(valore);
  }

  saveDashboard(copia) {
    if (copia) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Richiesta nome per salvataggio dashboard');
      this.dashboardNameComponentShowed = true;
    } else {
      this.salvataggioFisicoDashboardPR();
    }
  }

  creaNuovaDashboardPR() {
    let ok = false;
    let x1 = 0;
    let y1 = 0;
    this.impostazioni.MappaOGrafico.forEach(element => {
      if (!ok) {
        y1 = 0;
        element.forEach(element2 => {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, x1, y1, element2);
          if (element2 && element2 === 'M') {
            if (this.impostazioni.overviewZoom[x1][y1] === true) {
              // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TROVATA', x1, y1, element2, this.impostazioni.overviewZoom[x1][y1]);
              ok = true;
            }
          }
          y1++;
        });
        x1++;
      }
    });
    if (ok) {
      alert('Check failed: one map must be overview');
      return;
    }

    this.dbWorkOnDashboard = true;
    const folder = this.dashboardFolder;
    const description = '';
    const dateNow: Date = new Date();
    const update_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    const nome = 'new ' + update_ts;

    let desc = description;
    if (desc) {
      desc = desc.replace(/(\r\n|\n|\r)/gm, '');
    }

    const impost = ExternalUtilities.sistemaJSONPerSalvarloSuDB(this.impostazioniDefault);

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, nome, folder, description, impost);

    let jsonString = '{';
    jsonString += '"v_cntx": "' + this.sessioneID + '",';
    jsonString += '"v_name": "' + nome + '",';
    jsonString += '"v_folder": "' + folder + '",';
    jsonString += '"v_description": "' + desc + '",';
    jsonString += '"v_config_json": "' + impost + '" ';
    jsonString += '}';

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(jsonString));

    this.apiService.chiamataPost(Utils, 'geo_dashboard__ins', JSON.parse(jsonString))
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Create new dashboard return:', data);

      if (+data[0].v_err_code === 0) {
        this.LeggeDashboardPR();

        setTimeout(() => {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati dashboard: ', this.datiDashboard);
          this.datiDashboard.forEach(element => {
            if (element.NAME === nome) {
              this.dashboardSelezionata = element.ID;
            }
          });
        }, 100);

        this.differenzeDiImpostazioni = false;
        this.dbWorkOnDashboard = false;
      } else {
        this.dbWorkOnDashboard = false;
        alert('Create new dashboard: ' + data[0].v_failure_reason);
      }
    }, error => {
      this.dbWorkOnDashboard = false;
      alert('Create new dashboard: ' + error);
    });
  }

  salvataggioFisicoDashBoardConNomePR(nome, folder, description) {
    this.dbWorkOnDashboard = true;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Salvataggio dashboard con nome:', nome, folder);

    // const dash = this.Utilities.converteStringaInJSON(this.dashboardSelected);

    let desc = description;
    if (desc) {
      desc = desc.replace(/(\r\n|\n|\r)/gm, '');
    }

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.listaEventi[1][9]);

    const impost = ExternalUtilities.sistemaJSONPerSalvarloSuDB(this.impostazioni);

    let jsonString = '{';
    jsonString += '"v_cntx": "' + this.sessioneID + '",';
    jsonString += '"v_name": "' + nome + '",';
    jsonString += '"v_folder": "' + folder + '",';
    jsonString += '"v_description": "' + desc + '",';
    jsonString += '"v_config_json": "' + impost + '" ';
    jsonString += '}';

    this.apiService.chiamataPost(Utils, 'geo_dashboard__ins', JSON.parse(jsonString))
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data);
      if (data.v_err_code && data.v_err_code === 2) {
        this.dbWorkOnDashboard = false;
        alert(data.v_failure_reason);
      } else {
        if (data.length === 0) {
          this.dbWorkOnDashboard = false;
          alert('Trouble in save dashboard. Name already present ?');
        } else {
          if (+data[0].v_err_code === 0) {
            // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Copy dashboard return:', data);

            this.LeggeDashboardPR();

            setTimeout(() => {
              // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati dashboard: ', this.datiDashboard);
              this.datiDashboard.forEach(element => {
                if (element.NAME === nome) {
                  this.selectDashboard(element);
                  this.forzaSelezioneDashboard = element;
                }
              });
            }, 100);

            this.differenzeDiImpostazioni = false;
            this.dbWorkOnDashboard = false;
          } else {
            this.dbWorkOnDashboard = false;
            alert('Create dashboard: ' + data[0].v_failure_reason);
          }
        }
      }
    }, error => {
      this.dbWorkOnDashboard = false;
      alert('Create dashboard: ' + error);
    });
  }

  salvataggioFisicoDashboardPR() {
    // console.log('Salvataggio dashboard:', this.dashboardSelected);
    // console.log('Impostazioni:', this.impostazioni);

    return;

    const dash = ExternalUtilities.converteStringaInJSON(this.dashboardSelected);

    let desc = dash.DESCRIPTION;
    if (desc === null) { desc = ''; };
    if (desc) {
      desc = desc.replace(/(\r\n|\n|\r)/gm, '');
    }

    // const impost = this.impostazioni; // ExternalUtilities.sistemaJSONPerSalvarloSuDB(this.impostazioni);

    let jsonString = '{';
    jsonString += '"v_cntx": "' + this.sessioneID + '",';
    jsonString += '"v_id": "' + dash.ID + '",';
    jsonString += '"v_name": "' + dash.NAME + '",';
    jsonString += '"v_folder": "' + dash.FOLDER + '",';
    jsonString += '"v_description": "' + desc + '",';
    jsonString += '"v_config_json": [' + JSON.stringify(this.impostazioni) + '] ';
    jsonString += '}';

    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Salvataggio: ', this.impostazioni.showRaysAllLayer[1][4]);

    this.dbWorkOnDashboard = true;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, jsonString);

    this.apiService.chiamataPost(Utils, 'geo_dashboard__upd', JSON.parse(jsonString))
    // .map(response => response)
    .subscribe((data: any) => {
      // // const data = JSON.parse(data2);
      ExternalUtilities.checkRitornoChiamata(this, Utils, data);

      if (+data[0].v_err_code === 0) {
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Update dashboard return:', data);
        // }
        this.LeggeDashboardPR();

        this.impostazioniIniziali = JSON.parse(JSON.stringify(this.impostazioni));
        this.checkDifferenceFromStartJSON();
        this.dbWorkOnDashboard = false;
      } else {
        this.dbWorkOnDashboard = false;
        // ExternalUtilities.messaggioDiErroreEsterno(this, 'update dashboard: ' + data[0].Return + ': ' + data[0].Message);
      }
    }, error => {
      // ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  cambioBarraAperta(f, n, e) {
    this.impostazioni.barraAperta[f][n] = e;
    // this.impostazioni.barraAperta1 = e;
    this.refreshMaschera[n] = !this.refreshMaschera[n];
    this.checkDifferenceFromStartJSON();
  }

  visibileDaMascheraDashboardName(e) {
    this.dashboardNameComponentShowed = false;
  }

  confirmDashboardName(e) {
    if (e) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Name / Folder inseriti:', e);
      const c = e.split('§');
      const name = c[0];
      const folder = c[1];
      const desc = c[2];

      this.salvataggioFisicoDashBoardConNomePR(name, folder, desc);
    }
  }

  aggiornaListaEventi(f, n, e) {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiornata lista eventi da frame ', f, n, e);
    // }
    /* if (typeof(e) === 'object') {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '1-Aggiornata lista eventi da frame ', f, n, e);

      this.impostazioni.listaEventi[f][n] = stringify(e);
    } else {
      if (typeof(e) === 'string') {
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '2-Aggiornata lista eventi da frame ', f, n, e);

        this.impostazioni.listaEventi[f][n] = e;
      } else {
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Errore nel tipo eventi:', typeof(e));
      }
    } */
    try {
      this.impostazioni.listaEventi[f][n] = JSON.stringify(e);

      this.checkDifferenceFromStartJSON();
    } catch (ee) {

    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi:', this.impostazioni.listaEventi);
  }

  changeStateAccordion(n) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio stato accordion')
    setTimeout(() => {
      switch (n) {
        case 1:
          this.dashboardAccordionOpen = true;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          break;
        case 2:
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = true;
          break;
        case 3:
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = true;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          break;
        case 4:
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = true;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          break;
        case 5:
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = true;
          this.dataSetAccordionOpen = false;
          break;
      }
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Stato accordion: ', this.settingsAccordionOpen);

      this.checkDifferenceFromStartJSON();
    }, 100);
  }

  aggiornaView(n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorna view', e);
    /* if (!this.impostazioni.overviewZoom[n]) {
      this.viewOlLocal[n] = {...e};
    } */
    // this.viewOl = e;
  }

  csvImpostato(n, e) {
    const vals = e.split(';');
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CSV Impostato:', n, vals);
    let ok = true;
    let qq = '';

    const minLat: number = vals[1];
    const minLng: number = vals[2];
    const maxLat: number = vals[3];
    const maxLng: number = vals[4];

    this.csvView.forEach(element => {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element, vals[0]);
      if (element.indexOf(vals[0]) > -1) {
        element = vals[0];
        qq = element;
        ok = false;
      }
    });
    if (ok) {
      this.csvView.push(e);
    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, n, vals, this.csvView);

    this.mediaLon = (+maxLng + +minLng) / 2;
    this.mediaLat = (+maxLat + +minLat) / 2;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, maxLng, minLng, this.mediaLon);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, maxLat, minLat, this.mediaLat);

    // this.extent = transformExtent([ minLat, maxLat, minLng, maxLng ], 'EPSG:4326', 'EPSG:4326');

    // const f = 1;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto viste:', this.impostazioni.currZoom);

    // const viewG = new Array();
    // const viewL = new Array();

    /* let qG = -1;
    let qL = -1;
    let zoomLocale = 10;
    let zoomGlobale = 10;

    for (let f = 1; f <= environment.quantiSottoFrames; f++) {
      for (let i = 1; i <= environment.quantiFrames; i++) {
        if (qG === -1) {
          if (this.impostazioni.overviewZoom[f][i] === true) {
            qG = i;
          }
        }
        if (qL === -1) {
          if (this.impostazioni.overviewZoom[f][i] === false) {
            qL = i;
          }
        }
      }

      if (qG > -1) {
        zoomGlobale = this.impostazioni.currZoom[f][qG];
      }
      if (qL > -1) {
        zoomLocale = this.impostazioni.currZoom[f][qL];
      }
    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Zooms:', zoomGlobale, qG, zoomLocale, qL);

    // for (let i = 0; i < 5; i++) { */
    if (this.impostazioni.frameAttivo[n]) {
      const viewG = new OlView({
        center: fromLonLat([+this.mediaLon, +this.mediaLat]),
        zoom: this.impostazioni.currZoom[this.impostazioni.frameAttivo[n]][n]
        // zoom: 10
      });

      const viewL = new OlView({
        center: fromLonLat([+this.mediaLon, +this.mediaLat]),
        zoom: this.impostazioni.currZoom[this.impostazioni.frameAttivo[n]][n]
        // zoom: 10
      });

      // console.log('CSV Impostato:', this.mediaLat, this.mediaLon);

      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista impostata:', this.impostazioni.frameAttivo[n], n,
      //   this.mediaLat, this.mediaLon, this.impostazioni.currZoom);

      // this.viewOlG[this.impostazioni.frameAttivo[n]][n] = viewG;
      // this.viewOlL[this.impostazioni.frameAttivo[n]][n] = viewL;
    }
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiornamento vista G', viewG);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiornamento vista L', viewL);

    this.centroAttuale[n] = this.mediaLon + ';' + this.mediaLat;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro attuale', n, this.centroAttuale[n]);

    /* for (let j = 1; j <= environment.quantiSottoFrames; j++) {
      for (let i = 1; i <= environment.quantiFrames; i++) {
        // const vG = viewG[i];
        // vG.setZoom(this.impostazioni.currZoom[1]);
        // if (this.impostazioni.viewOlG[j][i] !== undefined) {
          this.impostazioni.viewOlG[j][i] = viewG;
        // }

        // const vL = viewL[i];
        // vL.setZoom(this.impostazioni.currZoom[i]);
        // if (this.impostazioni.viewOlL[j][i] !== undefined) {
          this.impostazioni.viewOlL[j][i] = viewL;
        // }
      }
    } */
  }

  slaEmit(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato sla ', n, e);
    this.impostazioni.slaName[f][n] = e;
  }

  tabSelez(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tab selezionato frame ' + n + ': ', e);
    switch (n) {
      case 1:
        this.impostazioni.tabSelezionato[f][1] = e;
        break;
      case 2:
        this.impostazioni.tabSelezionato[f][2] = e;
        break;
      case 3:
        this.impostazioni.tabSelezionato[f][3] = e;
        break;
      case 4:
        this.impostazioni.tabSelezionato[f][4] = e;
        break;
      case 5:
        this.impostazioni.tabSelezionato[f][5] = e;
        break;
      case 6:
        this.impostazioni.tabSelezionato[f][6] = e;
        break;
    }
    this.checkDifferenceFromStartJSON();
  }

  resetPosition() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'premuto reposition');
    Utils.premutoReposition = true;
    // this.extent = {};

    // TOLTO 16/09/2021 - DAVA PROBLEMI
    /* this.csvView = new Array();
    for (let nf = 1; nf <= 9 ; nf ++) {
      for (let fa = 1; fa <= 5 ; fa ++) {
        this.viewOlG[fa][nf] = undefined;
        this.viewOlL[fa][nf] = undefined;
        // this.impostazioni.currZoom[fa][nf] = 10;
      }
      this.centroAttuale[nf] = '';
    }

    this.calcolaCentro = !this.calcolaCentro; */
    // TOLTO 16/09/2021 - DAVA PROBLEMI
  }

  clickSuMappaEmit(n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click fatto su mappa ' + n + ':', e, this.impostazioni.MappaOGrafico);
    // let index = 0;
    // this.impostazioni.MappaOGrafico.forEach(element2 => {
      // const element = element2[this.impostazioni.frameAttivo[n]];
      // if (element === 'MC' || element === 'PS' || element === 'M') {
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element, index);
        setTimeout(() => {
          for (let i = 1; i <= environment.quantiFrames; i++) {
            this.tmsSelezionatoPerGrafico[i] = e;
          }
        }, 10);
      // }
      // index++;
    // });
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.tmsSelezionatoPerGrafico);
  }

  selectTipoMappeStyle(e) {
    this.mapTypeS = e.id;
  }

  valoreMappeMisureStyle(e) {
    if (e) {
      setTimeout(() => {
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ultimo valore misure style mappe', e);
        this.mapTypeS = e.id;
      }, 100);
    }
  }

  valoreMappeStyle(e) {
    if (e) {
      setTimeout(() => {
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ultimo valore style mappe', e);
        this.mapTypeG = e.id;
      }, 100);
    }
  }

  clickHtml(h) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, h);
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaHtml > 1000) {
      this.ultimaVoltaHtml = ora;

      if (this.appoHtml === '') {
        this.appoHtml = h;
      }
      this.htmlCode = this.appoHtml;
      this.appoHtml = '';
    } else {
      this.appoHtml = h;
    }
  }

  selectActivityTimeSpan(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select time span', e);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e, e.name);
    if (e !== undefined && e.name !== undefined) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      Utils.cambioTimeRange = new Date();
      Utils.rangeDiSecondiPerMille = +e.name * 1000;
      this.valoreTimeSpan = e.name;
      Utils.range = Utils.rangeDiSecondiPerMille;
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS Selezionato', Utils.tmsSelezionato, this.timeRangeDSFStart);
      /* if (Utils.tmsSelezionato || Utils.tmsSelezionato === 0) {
        if (!this.timeRangeDSFStart) {
          Utils.tmsSelezionato = this.timeRangeDSFStart;
        }
      } */
      let q = 0;
      const t = setInterval(() => {
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS Selezionato', q);
        if (Utils.tmsSelezionato) {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS Trovato', q, Utils.tmsSelezionato);
          clearInterval(t);
          ExternalUtilities.creaRangeSelezionato('3', Utils.tmsSelezionato, this.UtilitiesInterne);
          this.refreshAccentratore = !this.refreshAccentratore;
        } else {
          q++;
          if (q > 50) {
            clearInterval(t);
          }
        }
      }, 100);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activityTimeSpan, this.Utilities.rangeDiSecondiPerMille);
    } else {
      if (e !== undefined) {
        const v = +e.replace('***', '');
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, v);
        // if (isNumeric(v)) {
        if (v !== 0) {
          this.controlloTimeRange('1', v);
        }
        // } else {
        //   alert(v + ': Is not a valid value');
        // }
      }
    }
  }

  selectActivityTimeSpanRange(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e, e.name);
    if (e !== undefined && e.name !== undefined) {
      this.valoreTimeSpanRange = e.name;
    } else {
      if (e !== undefined) {
        const v = +e.replace('***', '');
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, v);
        if (v !== 0) {
          // if (isNumeric(v)) {
          this.controlloTimeRange2('1', v);
        // } else {
        //   alert(v + ': Is not a valid value');
        }
      }
    }
  }

  pad(num, size) {
    let s = num + '';
    while (s.length < size) { s = '0' + s };
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, s);
    return s;
  }

  valoreActivityTimeSpan(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore time span', e);
    if (e) {
      setTimeout(() => {
        if (e.name) {
          Utils.cambioTimeRange = new Date();
          this.valoreTimeSpan = +e.name;
          Utils.rangeDiSecondiPerMille = +e.name  * 1000;
        } else {
          Utils.cambioTimeRange = new Date();
          this.valoreTimeSpan = +e;
          Utils.rangeDiSecondiPerMille = +e * 1000;
        }
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.rangeDiSecondiPerMille);
      }, 100);
    }
  }

  valoreActivityTimeSpanRange(e) {
    if (e) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      setTimeout(() => {
        if (e.name === undefined) {
          this.valoreTimeSpanRange = e;
        } else {
          this.valoreTimeSpanRange = e.name;
        }
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.valoreTimeSpanRange);
      }, 1000);
    }
  }

  valoreStyleSize(e) {
    if (e) {
      setTimeout(() => {
        this.styleSizeG = e.id;
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.styleSizeG);
      }, 100);
    }
  }

  /* cambioDatiPointMeasures(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio dati Point Measures', e);
    setTimeout(() => {
      this.datiPointMeasures = e;
    }, 100);
  }

  cambioDatiActivityEvents(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio dati Point Measures', e);
    setTimeout(() => {
      this.datiActivityEvents = e;
    }, 100);
  } */

  confermaActivity(eee) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Conferma activity:', eee);
    if (eee) {
      const e = eee.split('§');
      const n = e[0]
      const ee = e[1];

      // this.activitySet[n] = JSON.parse(ee).ID;
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Conferma activity:', JSON.parse(ee));
      this.forzaSelezioneActivitySet[n] = JSON.parse(ee);
      this.selectTipoActivity(n, JSON.parse(ee));
    }
  }

  cambioCoordinateConClick(n, e) {
    this.coordinateConClick = e;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio coordinate con click', this.coordinate);
  }

  cambioCoordinate(n, e) {
    setTimeout(() => {
      this.coordinate = e;
    }, 10);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Coordinate cambiate', this.coordinate);
  }

  cambiataRotation(n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiata rotation:', n, e);
    setTimeout(() => {
      this.rotation = e;
    }, 100);
  }

  currZoomCambiato(f, n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio zoom frame', f, n, e);
    this.impostazioni.currZoom[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  chiudeFrame(e) {
  }

  massimizzaFinestra(e) {
    // if (e > -1) {
    //   this.impostazioni.frameMassimizzato = true;
    // } else {
    //   this.impostazioni.frameMassimizzato = false;
    // }
    this.impostazioni.frameMassimizzato = e;
    this.massimizzata = [ false, false, false, false, false, false, false, false, false, false];
    this.massimizzata[e] = true;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Massimizzo', e);
    // this.gest_finestre.massimizzaFinestra(this, e);
  }

  aggiungeFrame() {
    // this.gest_finestre.aggiungeFrame(this, -1);
  }

  selectSla(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sla impostato:', e);
    this.slaValueGlobale = e.ID;
  }

  ritornoValoreDaComboSLA(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo sla:', e);
    if (e && e !== 'empty' && e !== null) {
      const ee = ExternalUtilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      setTimeout(() => {
        if (e === undefined) {
          this.slaValueGlobale = 0;
        } else {
          this.slaValueGlobale = e.ID;
        }
      }, 100);
    // }
    }
  }

  /* viewAsClick(e) {
    if (e === '1') {
      this.overlayClusterG = '';
    }
  } */

  selectOverlayCluster(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.overlayClusterG = e;
  }

  ritornoValoreDaComboCluster(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo cluster:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      setTimeout(() => {
        if (e === undefined) {
          this.overlayClusterG = '';
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');
          this.clusterGroup2.forEach(element => {
            if (element.CODE === e) {
              // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato:', element);
              this.overlayClusterG = element;
            }
          });
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo cluster:', this.overlayClusterG);
        }
      }, 2000);
    // }
    }
  }

  cambioViewDefinition(f, n, e) {
    this.impostazioni.viewDefinition[f][n] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio view definition', n, e);
    this.checkDifferenceFromStartJSON();
  }

  checkDesignInfo(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e.target.checked);
    for (let i = 1; i <= 9 ; i++) {
      this.designInfo[i] = e.target.checked;
    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.designInfo);
  }

  ultimaVoltaCambioFrame = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  puliziaFrame = ExternalUtilities.creaVettore(environment.quantiFrames, false);

  cambioFrameAttivo(n, e) {
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaCambioFrame[n] < 1000) {
      return;
    }
    this.ultimaVoltaCambioFrame[n] = ora; */

    // if (this.debug2 === true) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio frame attivo', n, e, this.refreshMaschera[n]);
    // }

    this.puliziaFrame[e] = !this.puliziaFrame[e];

    // if (this.impostazioni.frameName) {
      setTimeout(() => {
        this.impostazioni.frameAttivo[n] = +e; // + ';***';
        // alert('Cambio frame ' + n + ' attivo:  ' + e);
        // console.log('Frames attivi: ', this.impostazioni.frameAttivo);
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio frame attivo', this.impostazioni.frameAttivo[n]);

        /* this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nuovo Frame attivo', n);
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Square meter completo', this.impostazioni.squareMeters);
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Quale frame attivo', this.impostazioni.frameAttivo[n]);
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore di impostazione', this.impostazioni.squareMeters[this.impostazioni.frameAttivo[n]][n]);  */

        if (this.impostazioni.MappaOGrafico && this.impostazioni.MappaOGrafico[n] &&
          this.impostazioni.MappaOGrafico[n][e] && this.impostazioni.MappaOGrafico[n][e].trim() === '') {
          this.impostazioni.MappaOGrafico[n][e] = '--';
        }

        /* setTimeout(() => {
          this.refreshMaschera[n] = !this.refreshMaschera[n];
        }, 1000); */
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.MappaOGrafico[n][e]);
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, n, e, this.impostazioni.measure[this.impostazioni.frameAttivo[n]]);

        /* const passaggio = {
          Measure: this.impostazioni.measure[this.impostazioni.frameAttivo[n]]
        }
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, passaggio);
        setTimeout(() => {
          this.nuoviDatiPerCambioFrame = passaggio
        }, 10); */

        this.checkDifferenceFromStartJSON();
      }, 1000);
    // }
  }

  creaNomiFrames() {
    //return;

    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frame: Da sistemare: ', this.impostazioni.frameName);
    // }
    const n = new Array();
    for (let i = 0; i <= environment.quantiFrames; i ++) {
      const riga = this.impostazioni.frameName[i];
      const nn = new Array();
      for (let j = 0; j <= environment.quantiSottoFrames; j ++) {
        if (this.impostazioni.frameName[i] && this.impostazioni.frameName[i][j] && this.impostazioni.frameName[i][j] !== '') {
          nn.push(this.impostazioni.frameName[i][j]);
        } else {
          nn.push('<empty>');
        }
      }
      n.push(nn);
    }
    this.impostazioni.frameName = JSON.parse(JSON.stringify(n));
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frame: Nomi frames impostati', this.impostazioni.frameName);
    // }
    return;

    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.nomiFrames);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.frameName);
    const nf = new Array();
    for (let j = 0; j <= environment.quantiFrames; j ++) {
      const nf2 = new Array();
      for (let i = 0; i <= environment.quantiSottoFrames; i ++) {
        if (this.impostazioni.MappaOGrafico[i] !== undefined) {
          if (this.impostazioni.MappaOGrafico[i][j] !== '') {
            if (!this.impostazioni.frameName[i] || !!this.impostazioni.frameName[i][j]) {
              this.impostazioni.frameName.push(new Array());
              for (let j2 = 0; j2 <= environment.quantiFrames; j2 ++) {
                this.impostazioni.frameName[i].push('');
              }
            }
            let tit = this.impostazioni.frameName[i][j];
            if (tit === undefined || tit === null || tit === '') {
              tit = '<empty>';
            }
            nf2.push(tit);
          } else {
            nf2.push('<empty>');
          }
        } else {
          nf2.push('<empty>');
        }
      }
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, nf2);
      nf.push(nf2);
    }
    /// this.nomiFrames = JSON.parse(JSON.stringify(nf));
    /// this.impostazioni.frameName = this.nomiFrames;
    // this.impostazioni.titoloFrame = this.nomiFrames;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.nomiFrames);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.frameName);
  }

  appoggiaValori(view, frame) {
    const app = {
      frameName: this.impostazioni.frameName[view][frame],
      // titoloFrame: this.impostazioni.titoloFrame[view][frame],
      frameDesc: this.impostazioni.frameDesc[view][frame],
      tipoMapp: this.impostazioni.tipoMappa[view][frame],
      MappaOGrafico: this.impostazioni.MappaOGrafico[view][frame],
      overviewZoom: this.impostazioni.overviewZoom[view][frame],
      mapType: this.impostazioni.mapType[view][frame],
      isCheckedServingCell: this.impostazioni.isCheckedServingCell[view][frame],
      isCheckedShowPaths: this.impostazioni.isCheckedShowPaths[view][frame],
      isCheckedShowSelectedPaths: this.impostazioni.isCheckedShowSelectedPaths[view][frame],
      isCheckedAntenne: this.impostazioni.isCheckedAntenne[view][frame],
      isStandAloneMR: this.impostazioni.isStandAloneMR[view][frame],
      measure: this.impostazioni.measure[view][frame],
      slaValue: this.slaValue[view][frame],
      slaName: this.impostazioni.slaName[view][frame],
      activity: this.impostazioni.activity[view][frame],
      plmn: this.impostazioni.plmn[view][frame],
      netTech: this.impostazioni.netTech[view][frame],
      bandwidth: this.impostazioni.bandwidth[view][frame],
      countHistogram: this.impostazioni.countHistogram[view][frame],
      checkSeverity: this.impostazioni.checkSeverity2[view][frame],
      listaEventi: this.impostazioni.listaEventi[view][frame],
      currZoom: this.impostazioni.currZoom[view][frame],
      viewAs: this.impostazioni.viewAs[view][frame],
      overlay: this.impostazioni.overlay[view][frame],
      overlayCluster: this.impostazioni.overlayCluster[view][frame],
      timeFilter: this.impostazioni.timeFilter[view][frame],
      bboxOZ: this.impostazioni.bboxOZ[view][frame],
      viewDefinition: this.impostazioni.viewDefinition[view][frame],
      activityName: this.activityName[view][frame],
      // viewOlL: this.viewOlL[view][frame],
      // viewOlG: this.viewOlG[view][frame],
      histDisplayAs: this.impostazioni.histDisplayAs[view][frame],
      histDisplayTutto: this.impostazioni.histDisplayTutto[view][frame],
      columnsBars: this.impostazioni.columnsBars[view][frame],
      doubleGraph: this.impostazioni.doubleGraph[view][frame],
      eventsMeasure: this.impostazioni.eventsMeasure[view][frame],
      showPlanimetry: this.impostazioni.showPlanimetry[view][frame],
      // columnsSettings: this.impostazioni.columnsSettings[view][frame],
      tipoEvento: this.impostazioni.tipoEvento[view][frame],
      fixedSeconds: this.impostazioni.fixedSeconds[view][frame],
      styleSize: this.impostazioni.styleSize[view][frame],
      cellType: this.impostazioni.cellType[view][frame],
      MappaOGraficoTutti: this.MappaOGraficoTutti[frame][view],
      addLayers: this.impostazioni.addLayers[view][frame],
      opacity: this.impostazioni.opacity[view][frame],
      shownEvents: this.impostazioni.shownEvents[view][frame],
      modificaChart: this.impostazioni.modificaChart[view][frame],
      doNotSetGM: this.impostazioni.doNotSetGM[view][frame],
      showRays: this.impostazioni.showRays[view][frame],
      showMeasures: this.impostazioni.showMeasures[view][frame],
      squareMeters: this.impostazioni.squareMeters[view][frame],
      measureType: this.impostazioni.measureType[view][frame],
      mosaicStyle: this.impostazioni.mosaicStyle[view][frame],
      sartPosition: this.impostazioni.sartPosition[view][frame],
      geoFilter: this.impostazioni.geoFilter[view][frame],
      measureSMS: this.impostazioni.measureSMS[view][frame],
      showMeasuresS: this.impostazioni.showMeasuresS[view][frame],
      tipoDataset: this.impostazioni.tipoDataset[view][frame],
      mappeMS: this.impostazioni.mappeMS[view][frame],
      clusterMeasure: this.impostazioni.clusterMeasure[view][frame],
      textFilter: this.impostazioni.textFilter[view][frame],
      // textLov: this.impostazioni.textLov[view][frame],
      addGlobalLayer: this.impostazioni.addGlobalLayer[view][frame],
      measureRCM: this.impostazioni.measureRCM[view][frame],
      showRaysAllLayer: this.impostazioni.showRaysAllLayer[view][frame],
      correlation: this.impostazioni.correlation[view][frame],
      isNonSyncEventTime: this.impostazioni.isNonSyncEventTime[view][frame],
      showVoiceCallMeasures: this.impostazioni.showVoiceCallMeasures[view][frame],
      showDataMeasures: this.impostazioni.showDataMeasures[view][frame],
      showCoverageMeasures: this.impostazioni.showCoverageMeasures[view][frame],
      clusterMeasure2: this.impostazioni.clusterMeasure2[view][frame],
      // lov: this.impostazioni.lov[view][frame],
      textFilter2: this.impostazioni.textFilter2[view][frame],
      showAxisX: this.impostazioni.showAxisX[view][frame],
    };

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, view, frame, app.currZoom, this.impostazioni.styleSize);

    return app;
  }

  spostaValori(app, view, frame) {
    this.impostazioni.frameName[view][frame] = app.frameName;
    // this.impostazioni.titoloFrame[view][frame] = app.titoloFrame;
    this.impostazioni.frameDesc[view][frame] = app.frameDesc;
    this.impostazioni.tipoMappa[view][frame] = app.tipoMappa;
    this.impostazioni.MappaOGrafico[view][frame] = app.MappaOGrafico;
    this.impostazioni.overviewZoom[view][frame] = app.overviewZoom;
    this.impostazioni.mapType[view][frame] = app.mapType;
    this.impostazioni.isCheckedServingCell[view][frame] = app.isCheckedServingCell;
    this.impostazioni.isCheckedShowPaths[view][frame] = app.isCheckedShowPaths;
    this.impostazioni.isCheckedShowSelectedPaths[view][frame] = app.isCheckedShowSelectedPaths;
    this.impostazioni.isCheckedAntenne[view][frame] = app.isCheckedAntenne;
    this.impostazioni.isStandAloneMR[view][frame] = app.isStandAloneMR;
    this.impostazioni.measure[view][frame] = app.measure;
    this.slaValue[view][frame] = app.slaValue;
    this.impostazioni.slaName[view][frame] = app.slaName;
    this.impostazioni.activity[view][frame] = app.activity;
    this.impostazioni.plmn[view][frame] = app.plmn;
    this.impostazioni.netTech[view][frame] = app.netTech;
    this.impostazioni.bandwidth[view][frame] = app.bandwidth;
    this.impostazioni.countHistogram[view][frame] = app.countHistogram;
    this.impostazioni.checkSeverity2[view][frame] = app.checkSeverity2;
    this.impostazioni.listaEventi[view][frame] = app.listaEventi;
    this.impostazioni.currZoom[view][frame] = app.currZoom;
    this.impostazioni.viewAs[view][frame] = app.viewAs;
    this.impostazioni.overlay[view][frame] = app.overlay;
    this.impostazioni.overlayCluster[view][frame] = app.overlayCluster;
    this.impostazioni.timeFilter[view][frame] = app.timeFilter;
    this.impostazioni.bboxOZ[view][frame] = app.bboxOZ;
    this.impostazioni.viewDefinition[view][frame] = app.viewDefinition;
    this.activityName[view][frame] = app.activityName;
    // this.viewOlL[view][frame] = app.viewOlL;
    // this.viewOlG[view][frame] = app.viewOlG;
    this.impostazioni.histDisplayAs[view][frame] = app.histDisplayAs;
    this.impostazioni.histDisplayTutto[view][frame] = app.histDisplayTutto;
    this.impostazioni.columnsBars[view][frame] = app.columnsBars;
    this.impostazioni.doubleGraph[view][frame] = app.doubleGraph;
    this.impostazioni.eventsMeasure[view][frame] = app.eventsMeasure;
    this.impostazioni.showPlanimetry[view][frame] = app.showPlanimetry;
    // this.impostazioni.columnsSettings[view][frame] = app.columnsSettings;
    this.impostazioni.tipoEvento[view][frame] = app.tipoEvento;
    this.impostazioni.fixedSeconds[view][frame] = app.fixedSeconds;
    this.impostazioni.styleSize[view][frame] = app.styleSize;
    this.impostazioni.cellType[view][frame] = app.cellType;
    this.MappaOGraficoTutti[frame][view] = app.MappaOGraficoTutti;
    this.impostazioni.addLayers[view][frame] = app.addLayers;
    this.impostazioni.opacity[view][frame] = app.opacity;
    this.impostazioni.shownEvents[view][frame] = app.shownEvents;
    this.impostazioni.modificaChart[view][frame] = app.modificaChart;
    this.impostazioni.doNotSetGM[view][frame] = app.doNotSetGM;
    this.impostazioni.showRays[view][frame] = app.showRays;
    this.impostazioni.showMeasures[view][frame] = app.showMeasures;
    this.impostazioni.squareMeters[view][frame] = app.squareMeters;
    this.impostazioni.measureType[view][frame] = app.measureType;
    this.impostazioni.mosaicStyle[view][frame] = app.mosaicStyle;
    this.impostazioni.sartPosition[view][frame] = app.sartPosition;
    this.impostazioni.geoFilter[view][frame] = app.geoFilter;
    this.impostazioni.measureSMS[view][frame] = app.measureSMS;
    this.impostazioni.showMeasuresS[view][frame] = app.showMeasuresS;
    this.impostazioni.tipoDataset[view][frame] = app.tipoDataset;
    this.impostazioni.mappeMS[view][frame] = app.mappeMS;
    this.impostazioni.clusterMeasure[view][frame] = app.clusterMeasure;
    this.impostazioni.clusterMeasure2[view][frame] = app.clusterMeasure2;
    // this.impostazioni.lov[view][frame] = app.lov;
    this.impostazioni.textFilter[view][frame] = app.textFilter;
    this.impostazioni.textFilter2[view][frame] = app.textFilter2;
    // this.impostazioni.textLov[view][frame] = app.textLov;
    this.impostazioni.addGlobalLayer[view][frame] = app.addGlobalLayer;
    this.impostazioni.measureRCM[view][frame] = app.measureRCM;
    this.impostazioni.showRaysAllLayer[view][frame] = app.showRaysAllLayer;
    this.impostazioni.correlation[view][frame] = app.correlation;
    this.impostazioni.isNonSyncEventTime[view][frame] = app.isNonSyncEventTime;
    this.impostazioni.showVoiceCallMeasures[view][frame] = app.showVoiceCallMeasures;
    this.impostazioni.showDataMeasures[view][frame] = app.showDataMeasures;
    this.impostazioni.showCoverageMeasures[view][frame] = app.showCoverageMeasures;
    this.impostazioni.showAxisX[view][frame] = app.showAxisX;

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, view, frame, this.impostazioni);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.currZoom[view][frame]);

    this.impostazioni = JSON.parse(JSON.stringify(this.impostazioni));
  }

  spostamentoView(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    const c = e.split(';');
    const operazione = c[0];
    const frameDa = c[1];
    const viewDa = c[2];
    const frameTo = c[3];
    const viewTo = c[4];

    const vistaDa = JSON.parse(JSON.stringify(this.appoggiaValori(viewDa, frameDa)));
    const vistaA = JSON.parse(JSON.stringify(this.appoggiaValori(viewTo, frameTo)));
    this.spostaValori(vistaDa, viewTo, frameTo);
    if (operazione === 'SWAP') {
      this.spostaValori(vistaA, viewDa, frameDa);
      this.refreshMaschera[frameTo] = !this.refreshMaschera[frameTo];
    } else {
      this.refreshMaschera[frameDa] = !this.refreshMaschera[frameDa];
    }
    this.creaNomiFrames();
  }

  refreshSLA(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato refresh sla');
    this.datiSLA = 'empty';
    this.datiSlaDT = 'empty grid'; // null;
    this.datiSlaDTi = 'empty grid'; // null;
    this.slaGroup = 'empty';

    this.LeggeSlaGroupPR();
    this.LeggeSLADataPR();
  }

  changeStyleSize(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e, typeOf(e));
    if (e) {
      if (!e.id  && e.indexOf('***') > - 1) {
        const v = e.replace('***', '');
        if (this.isNumeric(v)) {
          this.styleSizeG = +v;
          // this.styleSize = this.styleSizeG;
          let ok = false;
          this.styleSizes2.forEach(element => {
            if (+element.id === +this.styleSizeG) {
              ok = true;
            }
          });
          if (ok === false) {
            const s = { id: +this.styleSizeG, name: this.styleSizeG.toString() };
            this.styleSizes2.push (s);
            this.styleSizes2.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));
            this.styleSizes2 = JSON.parse(JSON.stringify(this.styleSizes2));
          }
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.styleSizes);
        } else {
          alert('\'' + v + '\' is not a valid value');
        }
      } else {
        if (e.id) {
          // this.styleSize = e['id'];
          this.styleSizeG = e['id'];
          this.styleSizes = JSON.parse(JSON.stringify(this.styleSizes));
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.styleSizes);
        }
      }
    }
  }

  dimeFinestraLegenda(n, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio dimensioni finestra legenda:', n, e);
    this.impostazioni.dimensioniFinestraLegenda[n] = e;
    this.checkDifferenceFromStartJSON();
  }

  confermaDaSla(e) {

  }

  refreshSLAManager(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh sla data');
    this.LeggeSLADataPR();
  }

  /* aperturaPopup(e) {
    if (e && e !== '') {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Apertura popup', e);
      const rit = e.split(';');
      this.campoClickatoAE = '';
      this.frameAttivoClickatoAE = rit[3];
      this.NumeroFrameClickatoAE = rit[4];
      if (rit[2].indexOf(':') > -1) {
        this.campoClickatoAE = rit[2].substring(0, rit[2].indexOf(':')).trim();
        if (this.campoClickatoAE.indexOf('=') > -1) {
          this.campoClickatoAE = this.campoClickatoAE.substring(this.campoClickatoAE.indexOf('=') + 1, this.campoClickatoAE.length).trim();
        }
      }
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.campoClickatoAE);
      this.posXPopupEvents = +rit[0];
      this.posYPopupEvents = +rit[1];
      this.popupVisibile = true;
    }
  }

  addField() {
    if (this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE] === null) {
      this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE] = new Array();
    }
    const campi = this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE];
    const quanti = this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE].length;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, campi, this.campoClickatoAE);
    // for (let i = quanti; quanti <= 10; i++) {
    //   this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE].push('');
    // }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, campi, this.campoClickatoAE);
    let Ok = false;
    let giaPresente = false;
    let riga = 0;
    campi.forEach(element => {
      if (!Ok && !giaPresente) {
        if (!element || (element && element.trim() === ''))  {
          Ok = true;
        } else {
          if (!element && element.trim() === this.campoClickatoAE) {
            giaPresente = true;
          }
          riga++;
        }
      }
    });
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, Ok, quanti, this.campoClickatoAE);
    if (Ok) {
      this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE][riga] = this.campoClickatoAE;
      this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE] =
        JSON.parse(JSON.stringify(this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE]));
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 
      //   this.frameAttivoClickatoAE,
      //   this.NumeroFrameClickatoAE,
      //   this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE]);
      this.checkDifferenceFromStartJSON();
    } else {
      if (giaPresente) {
        alert('Field already inserted');
      } else {
        if (quanti < 10) {
          if (!this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE][riga]) {
            this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE].push(this.campoClickatoAE);
          } else {
            this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE][riga] = this.campoClickatoAE;
          }
          // const q = this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE].length - 1;
          this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE] =
            JSON.parse(JSON.stringify(this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE]));
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE], this.campoClickatoAE);
        } else {
          alert('Array full');
        }
      }
    }
    this.popupVisibile = false;
  }

  chiusuraPopup(e) {
    this.popupVisibile = false;
  }

  expandAll() {
    const d = new Date();
    this.espandiTreeView[this.NumeroFrameClickatoAE] = d;
    this.popupVisibile = false;
  }

  collapseAll() {
    const d = new Date();
    this.collassaTreeView[this.NumeroFrameClickatoAE] = d;
    this.popupVisibile = false;
  }

  copyAllClip() {
    const d = new Date();
    this.copyAllClips[this.NumeroFrameClickatoAE] = d;
    this.popupVisibile = false;
  } */

  selectstringaAGNoACT(n, e) {
    if (e) {
      setTimeout(() => {
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione stringaAGNoACT 1:', n, e);
        // }
        ExternalUtilities.stringaAGNoACT = e.NAME;
        setTimeout(() => {
          ExternalUtilities.stringaAGNoACT = JSON.parse(JSON.stringify(ExternalUtilities.stringaAGNoACT));
  
          setTimeout(() => {
            this.resetPosition();
          }, 2000);
        }, 100);
      }, 100);
    }
  }

  valorestringaAGNoACT(n, e) {
    if (e) {
      setTimeout(() => {
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione stringaAGNoACT 2:', n, e);
        // }
        setTimeout(() => {
          ExternalUtilities.stringaAGNoACT = e;
        }, 100);
        Utils.activitySceltaStampa = e.replace('"', '').replace('"', '');
      }, 100);
    }
  }

  leggeActivityDaSet(n, actID) {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione stringaAGNoACT 3:', n, actID);
    // }
    if (!actID) {
      Utils.sceltaActivityDaSet[n] = [{ ID: '', SET_ID: '', NAME: '' }];
      setTimeout(() => {
        ExternalUtilities.stringaAGNoACT = '';
      }, 100);

      return;
    }

    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": "",' +
      '"v_filter_act_set_id": ' + actID + '' +
    '}';
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lettura activity da set:', n, params);
    this.apiService.chiamataPost(Utils, 'geo_act_set_rec__grid', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          alert(data2.v_failure_reason);
        } else {
          const d = data2;
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity da set', d);
          const a = new Array();
          let primo = null;
          if (d.DataTable) {
            d.DataTable.forEach(element => {
              const aa = { ID: element.ACT_ID, SET_ID: actID, NAME: element.ACT_NAME };
              if (primo === null) {
                primo = aa;

                this.Utils.tmsInizio = element.START_TMS;
                this.Utils.tmsFine = element.END_TMS;

                // this.impostaTimeRangeStart1(element.START_TMS);
                // this.impostaTimeRangeStop1(element.END_TMS);
          
                this.timeRangeDSFStart = element.START_TMS;                
                this.timeRangeDSFStop = element.END_TMS;
                // // console.log('ACTIVITY: ', element);
              }
              a.push(aa);
            });
            this.Utils.sceltaActivityDaSet[n] = a;
            // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity da sets', this.Utils.sceltaActivityDaSet);

            if (primo !== null) {
              // if (this.debug2) {
                this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione stringaAGNoACT 4:', primo);
              // }
              ExternalUtilities.stringaAGNoACT = primo.NAME;
              setTimeout(() => {
                ExternalUtilities.stringaAGNoACT = JSON.parse(JSON.stringify(ExternalUtilities.stringaAGNoACT));
              }, 100);
            }
          }
        }
      }
    });
  }

  sceltaAGNoACTDaClickSuMappa(n, e) {
    // alert('ppp');
    const ee = e.split('§');
    this.numeroSetPerActivityScelta = +ee[0];
    this.numeroFramePerActivityScelta = n;
    this.activityPassateDaScegliere = JSON.parse(ee[1]);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activityPassateDaScegliere);
    this.mostraSceltaAGNoACT = true;
  }

  sceltaAGNoACTDaMaschera(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.mostraSceltaAGNoACT = false;
    // Utils.sceltaActivityDaSet[this.numeroSetPerActivityScelta] = e;
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione stringaAGNoACT 5:', e);
    // }
    setTimeout(() => {
      ExternalUtilities.stringaAGNoACT = e.AGN_CODE;
      this.cambiatoAGNACTDopoScelta[this.numeroFramePerActivityScelta] = e;
      this.numeroFramePerActivityScelta = - 1;
      this.numeroSetPerActivityScelta = - 1;
      Utils.activitySceltaStampa = e.AGN_CODE;
    }, 100);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.cambiatoAGNACTDopoScelta);
  }

  eventiSceltiESTesto;

  cambioEventiScelti(s, n, e) {
    if (e) {
      // console.log('Cambio eventi scelti', e);
      if (this.impostazioni.eventiSceltiES) {
        this.impostazioni.eventiSceltiES = JSON.parse(JSON.stringify(e));
      } else {
        this.impostazioni.eventiSceltiES = new Array();
      }
    } else {
      this.impostazioni.eventiSceltiES = new Array();
    }
    // console.log('Eventi scelti es', e);
    
    // if (this.impostazioni.eventiSceltiES) {
      // this.impostazioni.eventiSceltiES[s][n] = JSON.parse(JSON.stringify(e));
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio eventi scelti ES. S: ', n, s, e);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'N: ', n);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Struttura: ', this.impostazioni.eventiSceltiES);
      this.eventiSceltiESTesto = '';
      if (e) {
        e.forEach(element => {
          this.eventiSceltiESTesto += element.EVENT_TYPE + ', ';
        });
        if (this.eventiSceltiESTesto.length > 1) {
          this.eventiSceltiESTesto = this.eventiSceltiESTesto.substring(0, this.eventiSceltiESTesto.length - 2);
        }
      }
      this.checkDifferenceFromStartJSON();
    // }
    // }
  }

  eventiSceltiGlobaliESTesto;

  cambioEventiSceltiGlobali(s, n, e) {
    if (e) {
      // console.log('Cambio eventi scelti', e);
      if (this.impostazioni.eventiSceltiGlobaliES) {
        this.impostazioni.eventiSceltiGlobaliES = JSON.parse(JSON.stringify(e));
      } else {
        this.impostazioni.eventiSceltiGlobaliES = new Array();
      }
    } else {
      this.impostazioni.eventiSceltiGlobaliES = new Array();
    }
    // console.log('Eventi scelti es', e);
    
    // if (this.impostazioni.eventiSceltiES) {
      // this.impostazioni.eventiSceltiES[s][n] = JSON.parse(JSON.stringify(e));
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio eventi scelti ES. S: ', n, s, e);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'N: ', n);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Struttura: ', this.impostazioni.eventiSceltiES);
      this.eventiSceltiGlobaliESTesto = '';
      if (e) {
        e.forEach(element => {
          this.eventiSceltiGlobaliESTesto += element.EVENT_TYPE + ', ';
        });
        if (this.eventiSceltiGlobaliESTesto.length > 1) {
          this.eventiSceltiGlobaliESTesto = this.eventiSceltiGlobaliESTesto.substring(0, this.eventiSceltiGlobaliESTesto.length - 2);
        }
      }
      this.checkDifferenceFromStartJSON();
    // }
    // }
  }

  indietroTR() {
    if (!Utils.tmsSelezionato) {
      alert('Please select a point first');
      return;
    }
    const t = (new Date(Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) - Utils.range;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, nuovoTMS, 'Indietro TR');
  }

  indietro() {
    if (!Utils.tmsSelezionato) {
      alert('Please select a point first');
      return;
    }
    const t = (new Date(Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) - 1000;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, nuovoTMS, 'Indietro');
  }

  indietro2() {
    if (!Utils.tmsSelezionato) {
      alert('Please select a point first');
      return;
    }
    const t = (new Date(Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) - 5000;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, nuovoTMS, 'Indietro 2');
  }

  centro() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.tmsSelezionato, this.Utilities.tmsSelezionatoStringa);
    if (!Utils.tmsSelezionato) {
      alert('Please select a point first');
      return;
    }
    ExternalUtilities.creaRangeSelezionato(null, Utils.tmsSelezionato, this.UtilitiesInterne);
    Utils.tmsInizio = undefined;
    Utils.tmsFine = undefined;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Setto centro', Utils.tmsSelezionato, Utils.tmsInizio, Utils.tmsFine);

    AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, Utils.tmsSelezionato, 'Centro');
  }

  playStop() {
    if (!Utils.tmsSelezionato) {
      alert('Please select a point first');
      return;
    }
    if (this.isPlaying === false) {
      this.isPlaying = true;
      /* if (this.subscribePlay) {
        this.subscribePlay.unsubscribe();
      }
      this.subscribePlay = timer(0, 5000)
        .take(32000)
        .subscribe(() => {
          if (this.isPlaying === false) {
            Utils.clickDaMappa = false;
            this.subscribePlay.unsubscribe();
          } else {
            Utils.clickDaMappa = true;

            const nuovoTMS = ((new Date(Utils.tmsSelezionato).getTime()) + (this.secondiSpostamento * 1000));
            AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, nuovoTMS, 'PlayStop');
          }
        }); */

        const t = setInterval(() => {
          if (this.isPlaying === false) {
            if (this.isPlaying === false) {
              Utils.clickDaMappa = false;
              clearInterval(t);
            } else {
              Utils.clickDaMappa = true;
  
              const nuovoTMS = ((new Date(Utils.tmsSelezionato).getTime()) + (this.secondiSpostamento * 1000));
              AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, nuovoTMS, 'PlayStop');
            }
         }
        }, 5000);
    } else {
      this.isPlaying = false;
    }
  }

  avantiTR() {
    if (!Utils.tmsSelezionato) {
      alert('Please select a point first');
      return;
    }
    const t = (new Date(Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) + Utils.range;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, nuovoTMS, 'Avanti TR');
  }

  avanti2() {
    if (!Utils.tmsSelezionato) {
      alert('Please select a point first');
      return;
    }
    const t = (new Date(Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) + 5000;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, nuovoTMS, 'Avanti 2');
  }

  avanti() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.tmsSelezionato, this.Utilities.tmsSelezionatoStringa);
    if (!Utils.tmsSelezionato) {
      alert('Please select a point first');
      return;
    }
    const t = (new Date(Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) + 1000;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, nuovoTMS);

    AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, nuovoTMS, 'Avanti');
  }

  mouseOverCombo1(e) {
    this.dimeDrawer = this.impostazioni.actualDimeDrawer;
  }

  impostaNonChiudere(e) {
    this.nonChiudereDrawer = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
  }

  chiudeDrawer() {
    if (this.nonChiudereDrawer === true) {
      return;
    }
    this.dimeDrawer = this.dimeDrawerInizio;
  }

  apriDrawer() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Apri drawer', this.impostazioni.actualDimeDrawer);
    if (!this.impostazioni.actualDimeDrawer) {
      this.impostazioni.actualDimeDrawer = 350;
    }
    this.dimeDrawer = this.impostazioni.actualDimeDrawer
  }

  controlloTimeRange(q, e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo time span', e);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vengo da', q);
    let ok = false;
    Utils.datiActTimeSpan.forEach(element => {
      if (+element.name === +e) {
        Utils.cambioTimeRange = new Date();
        Utils.rangeDiSecondiPerMille = +element.name * 1000;
        this.valoreTimeSpan = +element.name;
        Utils.range = Utils.rangeDiSecondiPerMille;
        if (Utils.tmsSelezionato !== 0 && Utils.clickSuCV === false) {
          ExternalUtilities.creaRangeSelezionato('5', Utils.tmsSelezionato, this.UtilitiesInterne);
        }
        if (Utils.clickSuCV === true) {
          Utils.clickSuCV = false;
        }
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activityTimeSpan, this.Utilities.rangeDiSecondiPerMille);
        ok = true;
      }
    });
    if (ok === false) {
      let maxN = 0;
      Utils.datiActTimeSpan.forEach(element => {
        if (+element.id > +maxN) {
          maxN = +element.id;
        }
      });
      maxN++;
      const vv = { id: +maxN, name: +e };
      Utils.datiActTimeSpan.push(vv);
      Utils.datiActTimeSpan.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));
      setTimeout(() => {
        Utils.cambioTimeRange = new Date();
        Utils.rangeDiSecondiPerMille = +e * 1000;
        this.valoreTimeSpan = +vv.name;
        Utils.range = Utils.rangeDiSecondiPerMille;
        if (Utils.tmsSelezionato !== 0 && Utils.clickSuCV === false) {
          ExternalUtilities.creaRangeSelezionato('4', Utils.tmsSelezionato, this.UtilitiesInterne);
        }
        if (Utils.clickSuCV === true) {
          Utils.clickSuCV = false;
        }
      }, 100);
    }
  }

  controlloTimeRange2(q, e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vengo da', q);
    let ok = false;
    Utils.datiActTimeSpanRange.forEach(element => {
      if (+element.name === +e) {
        this.valoreTimeSpanRange = +element.name;
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore trovato', e, +element.name);
        ok = true;
      }
    });
    if (ok === false) {
      let maxN = 0;
      Utils.datiActTimeSpanRange.forEach(element => {
        if (element.id > maxN) {
          maxN = +element.id;
        }
      });
      maxN++;
      const vv = { id: +maxN, name: +e };
      Utils.datiActTimeSpanRange.push(+vv);
      Utils.datiActTimeSpanRange.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));
      setTimeout(() => {
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, vv.name);
        this.valoreTimeSpanRange = +vv.name;
      }, 100);
    }
  }

  extendMin() {
    if (!Utils.tmsInizio) {
      return;
    }

    let rInizio = new Date(Utils.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    rInizio -= (+this.valoreTimeSpanRange * 1000);

    const rFine = new Date(Utils.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, +this.valoreTimeSpanRange, rInizio, rFine);
    if (rInizio < rFine) {
      const sInizio = Utils.datePipe.transform(rInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
      const sFine = Utils.datePipe.transform(rFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nuovo inizio:', sInizio);

      Utils.tmsInizio = sInizio;
      this.valoreTimeSpan += +this.valoreTimeSpanRange;
      Utils.rangeDiSecondiPerMille = +this.valoreTimeSpan * 1000;
      Utils.range = Utils.rangeDiSecondiPerMille;

      let rActual = new Date(Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      if (rActual < rInizio) {
        rActual = rInizio;
        const sActual = Utils.datePipe.transform(rActual, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        Utils.tmsSelezionato = sActual;
      }

      Utils.rangeSelezionatoStampa = sInizio + '<br />' + sFine;

      this.ridisegnaTutto = new Date();
    }
  }

  extendMax() {
    if (!Utils.tmsFine) {
      return;
    }

    let rFine = new Date(Utils.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    rFine += (+this.valoreTimeSpanRange * 1000);

    const rInizio = new Date(Utils.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, rInizio, rFine);
    if (rInizio < rFine) {
      const sInizio = Utils.datePipe.transform(rInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
      const sFine = Utils.datePipe.transform(rFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nuovo fine:', sFine);

      this.valoreTimeSpan += +this.valoreTimeSpanRange;
      Utils.tmsFine = sFine;
      Utils.rangeDiSecondiPerMille = +this.valoreTimeSpan * 1000;
      Utils.range = Utils.rangeDiSecondiPerMille;

      let rActual = new Date(Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      if (rActual > rFine) {
        rActual = rFine;
        const sActual = Utils.datePipe.transform(rActual, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        Utils.tmsSelezionato = sActual;
      }

      Utils.rangeSelezionatoStampa = sInizio + '<br />' + sFine;

      this.ridisegnaTutto = new Date();
    }
  }

  /* cambioTimeRange(e) {
    if (e === null || Utils.tmsInizio === null || Utils.tmsFine === null) {
      return;
    }
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range', e, Utils.tmsInizio, Utils.tmsFine);
    const ee = e.split(';');
    this.controlloTimeRange('2', ee[0]);

    const rInizio = new Date(Utils.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    const rFine = new Date(Utils.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();

    const t = new Date(e[1].replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t, this.Utilities.datePipe.transform(rInizio, 'yyyy-MM-dd HH:mm:ss.SSS'),
    //    this.Utilities.datePipe.transform(rFine, 'yyyy-MM-dd HH:mm:ss.SSS'));

    if (t < rInizio || t > rFine) {
      if (ee[1].indexOf('.') > -1) {
        ee[1] = ee[1].substring(0, ee[1].indexOf('.'));
      }
      Utils.tmsSelezionato = ee[1];

      ExternalUtilities.aggiornaTmsStringa(ee[1], this.UtilitiesInterne);
    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range', this.Utilities.tmsInizio, this.Utilities.tmsFine);
  } */

  cambioTimeRange(e) {
    if (e === null || Utils.tmsInizio === null || Utils.tmsFine === null) {
      return;
    }

    const ee = e.split(';');
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range', e, Utils.tmsInizio, Utils.tmsFine);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range provenienza', ee[4]);
    // }
    if (ee[2] && ee[3]) {
      const sInizio = Utils.datePipe.transform(ee[2], 'yyyy-MM-dd HH:mm:ss');
      const sFine = Utils.datePipe.transform(ee[3], 'yyyy-MM-dd HH:mm:ss');

      Utils.tmsInizio = sInizio;
      Utils.tmsFine = sFine;
      
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range min', Utils.tmsInizio);
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range max', Utils.tmsFine);
      // }

      // AppComponent.aggiungeRange(this.Utilities);
    }
    this.controlloTimeRange('2', ee[0]);

    let rInizio;
    let rFine;

    try {
      rInizio = new Date(Utils.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      rFine = new Date(Utils.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    } catch(e) {
      rInizio = Utils.tmsInizio.getTime();
      rFine = Utils.tmsFine.getTime();
    }

    const t = new Date(e[1].replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();

    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t, this.Utilities.datePipe.transform(rInizio, 'yyyy-MM-dd HH:mm:ss'),
    //    this.Utilities.datePipe.transform(rFine, 'yyyy-MM-dd HH:mm:ss'));

    if (t < rInizio || t > rFine) {
      if (ee[1].indexOf('.') > -1) {
        ee[1] = ee[1].substring(0, ee[1].indexOf('.'));
      }
      Utils.tmsSelezionato = ee[1];

      ExternalUtilities.aggiornaTmsStringa(ee[1], this.UtilitiesInterne);
    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range', this.Utilities.tmsInizio, this.Utilities.tmsFine);
  }

  impostaTimeRange(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (!e || e === '') {
      return;
    }

    const ee = e.split(';');

    if (ee.length < 1) {
      return;
    }
    if (!ee[0] || ee[0] === '' || !ee[1] || ee[1] === '') {
      return;
    }

    // this.controlloTimeRange('2', ee[0]);

    const rInizio = new Date(ee[0].replace('T', ' ').replace('Z', ' ') + ' UTC+00');
    const rFine = new Date(ee[1].replace('T', ' ').replace('Z', ' ') + ' UTC+00');

    if (rFine < rInizio) {
      return;
    }

    Utils.range = (rFine.getTime() - rInizio.getTime()) / 2;

    if (Utils.range) {
      // this.Utilities.tmsSelezionato = new Date(rInizio + this.Utilities.range);
      Utils.tmsSelezionato = this.datePipe.transform((rInizio + Utils.range).replace('T', ' ').replace('Z', ' ') + ' UTC +00', 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.tmsSelezionato);

      setTimeout(() => {
        ExternalUtilities.aggiornaTmsStringa(ee[1], this.UtilitiesInterne);
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.tmsInizio, this.Utilities.tmsFine, this.Utilities.range, this.Utilities.tmsSelezionato);
      }, 10);
    }
    // AppComponent.CambioTmsSelezionato(this.Utilities.tmsSelezionato);
  }

  impostaTimeRangeStart(eee) {
    if (eee && eee.toString() !== 'Invalid Date') {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, eee);
      setTimeout(() => {
        const e = this.datePipe.transform(new Date(eee), 'yyyy-MM-dd HH:mm:ss.SSS')
        this.timeRangeDSFStart = e; // new Date(e.getFullYear(), e.getMonth(), e.getDay(), e.getHours(), e.getMinutes(), e.getSeconds());
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato time range start', e);
      }, 100);
    }
  }

  impostaTimeRangeStop(eee) {
    if (eee && eee.toString() !== 'Invalid Date') {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, eee);
      setTimeout(() => {
        const e = this.datePipe.transform(new Date(eee), 'yyyy-MM-dd HH:mm:ss.SSS')
        this.timeRangeDSFStop = e; // new Date(e.getFullYear(), e.getMonth(), e.getDay(), e.getHours(), e.getMinutes(), e.getSeconds());
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato time range stop', e);
      }, 100);
    }
  }

  impostaTimeRangeStart1(eee) {
    if (eee && eee.toString() !== 'Invalid Date') {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, eee);
      setTimeout(() => {
        const e = this.datePipe.transform(new Date(eee), 'yyyy-MM-dd HH:mm:ss.SSS')
        this.Utils.tmsInizio = e; // new Date(e.getFullYear(), e.getMonth(), e.getDay(), e.getHours(), e.getMinutes(), e.getSeconds());
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato time range start', e);
        // }
        this.impostaTimeRange(this.Utils.tmsInizio + ';' + this.Utils.tmsFine);
      }, 100);
    }
  }

  impostaTimeRangeStop1(eee) {
    if (eee && eee.toString() !== 'Invalid Date') {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, eee);
      setTimeout(() => {
        const e = this.datePipe.transform(new Date(eee), 'yyyy-MM-dd HH:mm:ss.SSS')
        this.Utils.tmsFine = e; // new Date(e.getFullYear(), e.getMonth(), e.getDay(), e.getHours(), e.getMinutes(), e.getSeconds());
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato time range stop', e);
        // }
        this.impostaTimeRange(this.Utils.tmsInizio + ';' + this.Utils.tmsFine);
      }, 100);
    }
  }

  apriFrame(n) {
    // this.gest_finestre.aggiungeFrame(this, n);
  }

  prendeNomeSET1(e) {
    if (this.datiActivitySet && this.datiActivitySet !== 'empty') {
      let ritorno = '';
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiActivitySet);
      this.datiActivitySet.forEach(element => {
        if (+element.ID === +e) {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
          ritorno = element.NAME;
        }
      });
      return ritorno;
    }
  }

  impostaAGNoACT(n, e) {
    if (e) {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AGN o ACT', e);
      const campi = e.split('§');
      if (campi[0] && campi[1] && campi[0] !== 'undefined' && campi[1] !== 'undefined') {
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta AGN o ACT:', campi[0], campi[1]);
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione stringaAGNoACT 6', n, e, campi[1]);
        // }
        ExternalUtilities.stringaAGNoACT = JSON.parse(campi[1]);
        setTimeout(() => {
          ExternalUtilities.stringaAGNoACT = JSON.parse(JSON.stringify(ExternalUtilities.stringaAGNoACT));
        }, 100);
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AGN o ACT impostato:', n, ExternalUtilities.stringaAGNoACT);
      }
    }
  }

  impostaTimeSelezionato(e) {
    if (!e || e === '') {
      return;
    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);

    /* const rI = new Date(this.datePipe.transform(e.replace('T', ' ').replace('Z', ' ') + ' UTC +00', 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC'))
      .getTime() - (this.Utilities.range / 2);
    const rF = new Date(this.datePipe.transform(e.replace('T', ' ').replace('Z', ' ') + ' UTC +00', 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC'))
      .getTime() + (this.Utilities.range / 2);

    if (rF < rI) {
      return;
    }

    this.Utilities.range = (rF - rI) / 2;

    setTimeout(() => {
      this.Utilities.tmsSelezionato = this.datePipe.transform(e.replace('T', ' ').replace('Z', ' ') + ' UTC +00', 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

      this.Utilities.aggiornaTmsStringa(e);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.tmsInizio, this.Utilities.tmsFine, this.Utilities.range, this.Utilities.tmsSelezionato);

      AppComponent.CambioTmsSelezionato(e);
    }, 10);
    // AppComponent.CambioTmsSelezionato(this.Utilities.tmsSelezionato); */
    const d1 = new Date(e + ' UTC+00').getTime();
    const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC')
    AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, t1, 'ImpostaTimeSelezionato');
  }

  selectUeProf(e) {
    if (e && e.VALUE_STR) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      setTimeout(() => {
        this.ueProfScelto = e.VALUE_STR;
      }, 10);
    }
  }

  valoreUeProf(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e) {
      setTimeout(() => {
        this.ueProfScelto = e.replace('"', '').replace('"', '');
      }, 10);
    }
  }

  selectRat(e) {
    if (e && e.VALUE_STR) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      setTimeout(() => {
        this.ratScelto = e.VALUE_STR;
      }, 10);
    }
  }

  valoreRat(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e) {
      setTimeout(() => {
        this.ratScelto = e.replace('"', '').replace('"', '');
      }, 10);
    }
  }

  selectBand(e) {
    if (e && e.VALUE_STR) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      setTimeout(() => {
        this.ratScelto = e.VALUE_STR;
      }, 10);
    }
  }

  valoreBand(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e) {
      setTimeout(() => {
        this.bandScelto = e.replace('"', '').replace('"', '');
      }, 10);
    }
  }

  selectScenario(e) {
    if (e && e.VALUE_STR) {
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      setTimeout(() => {
        this.scenarioScelto = e.VALUE_STR;
      }, 10);
    }
  }

  valoreScenario(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e) {
      setTimeout(() => {
        this.scenarioScelto = e.replace('"', '').replace('"', '');
      }, 10);
    }
  }

  cambioGlobalMeasure(e) {
    this.impostazioni.globalMeasure = JSON.stringify(e);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio global measure', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioGlobalMeasureArfcn(e) {
    this.impostazioni.globalMeasureArfcn = JSON.stringify(e);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio global measure', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoMisuraGlobaleArfcn(e) {
    this.impostazioni.tipoMisuraGlobaleArfcn = e;
    this.UtilitiesInterne.tipoMisuraGlobaleArfcn = e;
    // console.log('Misura globale arrivata', e);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo global measure', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoMisuraGlobale(e) {
    this.impostazioni.tipoMisuraGlobale = e;
    this.UtilitiesInterne.tipoMisuraGlobale = e;
    // console.log('Misura globale arrivata', e);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo global measure', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioTmsSelezionato(e) {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato', e);
    // }
    if (e.indexOf(';') > -1) {
      const ee = e.split(';');
      AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, ee[0], 'Cambio tms selezionato da ' + ee[1]);
    } else {
      AppComponent.CambioTmsSelezionato(this.UtilitiesInterne, e, 'Cambio tms selezionato');
    }
  }

  ciSonoModifiche(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Modifiche effettuate:', e);
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni);
  }

  cambioTimeRangeStart(e) {
    // const d1 = this.datePipe.transform(e, 'dd-MM-yyyy HH:mm:ss.SSS', 'UTC+00');
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time range start', e);
    this.timeRangeDSFStart = e;

    // this.timeRangeDSFStart = '1970-01-01 00:00:00';
  }

  cambioTimeRangeStop(e) {
    // const d1 = this.datePipe.transform(e, 'dd-MM-yyyy HH:mm:ss.SSS', 'UTC+00');
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time range stop', e);
    this.timeRangeDSFStop = e;

    // this.timeRangeDSFStop = '2999-01-01 00:00:00';
  }

  cambioBBOXO(f, q, e) {
    if (e !== this.bboxO) {
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio BBOX Overview', q, e);
      // }
      this.bboxO = e;
    }
    // this.bbox = { frame: q, valori: e };
  }

  cambioBBOXZ(f, q, e) {
    if (e !== this.bboxZ) {
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio BBOX Zoom', q, e);
      // }
      this.bboxZ = e;
    }
    // this.bbox = { frame: q, valori: e };
  }

  cambioRigaMG(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio Riga Selezionata Mosaic Grid', e);
    this.rigaMG = JSON.stringify(e);
  }

  cambioRigaCG(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio Riga Selezionata Cluster Grid', e);
    this.rigaCG = e;
  }

  cambioRigaArfcn(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio Riga Selezionata Cluster Grid', e);
    this.rigaArfcn = e;
  }

  testFunzione() {
    return;

    const params = {
      // cntx_id: this.sessioneID,
      v_property_list: { arr: 1 }
      // [{ agn_status: 'running', phone_rom_ver: 'ver fede prova', pluto: 'non esiste', lat: 12.12, lng: 42.03}]
    };
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, params);
    this.apiService.chiamataPost(this.Utils, 'agn_info__dev_upd2', params)
    // .map(response => response)
    .subscribe((data2: any) => {
      // // const data2 = JSON.parse(data);
      ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

      if (data2 && data2 !== null) {
        const data = data2;
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Test funzione', data);
      }
    }, error => {
      alert('Test funzione:' + error);
    });
  }

  passaggioSquareMetersO(e) {
    if (e) {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Passaggio Square Meters OverView', e);
      this.squareMetersO = JSON.stringify(e);
    }
  }

  passaggioSquareMetersZ(e) {
    if (e) {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Passaggio Square Meters Zoom', e);
      this.squareMetersZ = JSON.stringify(e);
    }
  }

  cambioGeoFilter(f, q, e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio Geo Filter', f, q, e);
    this.impostazioni.geoFilter[f][q] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioMosaicoSelezionato(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mosaico selezionato', e);
    this.mosaicoSelezionato = e;
  }

  cambioClusterSelezionato(e) {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster selezionato', e);
    // }
    this.clusterSelezionato = e;
  }

  arrivatoMessaggioDiErrore(e) {

  }

  spostaCentro() {
    setTimeout(() => {
      this.centroSpostatoManualmente = '12;43';
    }, 1000);
  }

  impostaTimeCursorPosition(e) {
    const ee = this.sistemaPunto(e);
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cursor position', ee);
    // }
    this.time_cursor_position = ee;
  }

  impostaCenterPosition(e) {
    const ee = this.sistemaPunto(e);
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Center position', ee);
    // }
    this.center_position = ee;
  }

  sistemaPunto(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Center Position', e, typeof(e));
    if (e && e !== null) {
      let ee = e;
      if (typeof(ee) === 'object') {
        ee = ee.toString();
        ee = ee.replace('[', '');
        ee = ee.replace(']', '');
        ee = ee.replace(',', ' ');
      }
      if (ee.indexOf('POINT(') > -1) {
        ee = ee.replace('POINT(', '');
        ee = ee.replace(')', '');
        ee = ee.replace(',', ' ');
      }
      if (ee.indexOf(',') > -1) {
        ee = ee.replace(',', ' ');
      }
      return ee.trim();
    } else {
      return '';
    }
  }

  funzione1() {
    this.coordinate = '10 15';
  }

  impostaQuadratoDaPassare(e) {
    this.quadratoMappa = e;
  }

  fRefreshDaTasto() {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refrescio mappe');
    // }

    this.refreshDaTasto[1] = !this.refreshDaTasto[1];
    this.refreshDaTasto[2] = !this.refreshDaTasto[2];
    this.refreshDaTasto[3] = !this.refreshDaTasto[3];
    this.refreshDaTasto[4] = !this.refreshDaTasto[4];
  }

  selectAdditionalLayer(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Combo cluster selezionato', e);
    this.additionalLayer = e;
  }

  ritornoValoreDaComboAL(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo AL:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      setTimeout(() => {
        if (e === undefined) {
          this.additionalLayer = '';
        } else {
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');

          let dati = this.datiAddLayers;
          if (dati.DataTable) {
            dati = dati.DataTable;
          }

          dati.forEach(element => {
            if (element.CODE === e) {
              // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato:', element);
              this.additionalLayer = element;
            }
          });
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo AL:', this.additionalLayer);
        }
      }, 2000);
    // }
    }
  }

  cambioCellaSelezionata(e) {
    this.cellaSelezionata = e;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cella selezionata', e);
  }

  cambioCoordinateSRALE(e) {
    this.coordinateSRLE = e;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio coordinate SRLE', e);
  }

  selectZoomMap(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Combo cluster selezionato', e);
    this.zoomMap = e;
  }

  ritornoValoreDaZoomMap(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo cluster:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      setTimeout(() => {
        if (e === undefined) {
          this.zoomMap = 2;
        } else {
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');
          this.datiZoomMap.forEach(element => {
            if (element.CODE === e) {
              // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato:', element);
              this.zoomMap = element.CODE;
            }
          });
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo cluster:', this.overlayClusterG);
        }
      }, 2000);
    // }
    }
  }

  cambioGeoFilterClick(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto geo filter app', e);
    this.geoFilterClick = e;
  }

  cambioSelArea(e) {
    const ee =  { name: e, id: e};
    this.selectComboSelArea(ee);
  }

  selectComboSelArea(e) {
    if (e && e.name) {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      setTimeout(() => {
        this.comboSelArea = e.id;
      }, 10);
    }
  }

  valoreSelArea(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e) {
      setTimeout(() => {
        this.comboSelArea = +(e.replace('"', '').replace('"', ''));
      }, 10);
    }
  }

  cambioLastSelectedLayer(e) {
    this.lastSelectedLayer = e;
  }

  cambioRicaricaRaggi(e) {
    this.ricaricaRaggi = e;
  }

  cambioBBox(e) {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio BBOX: ', e);
    // }
  }

  refreshAccentratoreEmit(e) {
    this.refreshAccentratore = new Date();
  }

  checkDataSet(n, e, esegui) {
    if (typeof(e) === 'string') {
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca activityset per stringa', e);
      // }

      if (e.length > 0) {
        const params = '{' +
          '"cntx_id": "' + this.sessioneID + '",' +
          '"v_filter_folder": "", ' +
          '"v_filter_name": "' + e + '"' +
        '}';
        this.apiService.chiamataPost(this.Utils, 'geo_act_set__grid', params)
        // .map(response => response)
        .subscribe((data2: any) => {
          // // const data2 = JSON.parse(data);
              // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno check dataset', data);
          if (data2 && data2.DataTable && data2.DataTable.length > 0) {
            // if (this.debug2) {
              this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovata activityset per stringa', data2);
            // }
            this.datiActivitySet = data2.DataTable;
            if (esegui === true) {
              setTimeout(() => {
                // this.prosegueGestioneActivitySet(n, data.DataTable[0]);
              }, 1000);
            }
          } else {
            this.datiActivitySet = 'empty';
          }
        });
      }
    } else {
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca activityset per id basata sui recenti', e);
      // }

      const params = '{' +
        '"cntx_id": "' + this.sessioneID + '",' +
        '"v_filter_folder": "<RECENT>"' +
      '}';
      this.apiService.chiamataPost(this.Utils, 'geo_act_set__grid', params)
      // .map(response => response)
      .subscribe((data2: any) => {
        // // const data2 = JSON.parse(data);
        if (data2) {
          // if (this.debug2) {
            this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovata activityset per id basata sui recenti', data2);
          // }
          data2.DataTable.forEach(element => {
            if (element.ID === +e) {
              this.datiActivitySet = [ element ];
              if (esegui === true) {
                setTimeout(() => {
                  // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Proseguo elaborazione', element);
                  // this.prosegueGestioneActivitySet(n, element);
                }, 1000);
              }

            }
          });
        } else {
          this.datiActivitySet = 'empty';
        }
      });
    }
  }

  dragEnd(e) {
    this.aggiornaSize(1, e);
  }

  funzione3() {
    this.eseguitoinProgetto0 = !this.eseguitoinProgetto0;
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eseguito in progetto: ', this.eseguitoinProgetto0);
    // }
  }

  passaggioListaEventiSE(e) {
    if (e) {
      // console.log('Cambio eventi scelti 2', e);
      if (this.impostazioni.eventiSceltiES) {
        this.impostazioni.eventiSceltiES = JSON.parse(JSON.stringify(e));
      } else {
        this.impostazioni.eventiSceltiES = new Array();
      }
    } else {
      this.impostazioni.eventiSceltiES = new Array();
    }
  }

  passaggioListaEventiGlobaliSE(e) {
    if (e) {
      // console.log('Cambio eventi scelti 2', e);
      if (this.impostazioni.eventiSceltiGlobaliES) {
        this.impostazioni.eventiSceltiGlobaliES = JSON.parse(JSON.stringify(e));
      } else {
        this.impostazioni.eventiSceltiGlobaliES = new Array();
      }
    } else {
      this.impostazioni.eventiSceltiGlobaliES = new Array();
    }
  }

  cambioDelta(e) {
    this.nuovoTmsDelta = e;
  }

  ridisegnaGraficiF(e) {
    this.ridisegnaGrafici = e;
  }

  cambiateMisureTCRUN(f, n, e) {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio misure tcrun addizionali Frame ' + f + ' Pagina ' + n + ':', e);
    // }
    if (!this.impostazioni.misureAddizionaliTCRUN) {
      this.impostazioni.misureAddizionaliTCRUN = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, ['', '', '', '']);
    }
    this.impostazioni.misureAddizionaliTCRUN[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambiatoHeightChart(f, n, e) {
    if (e) {
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio height chart Frame ' + f + ' Pagina ' + n + ':', e);
      // }
      if (!this.impostazioni.heightChart) {
        this.impostazioni.heightChart = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 'X1');
      }
      this.impostazioni.heightChart[f][n] = e;
      this.checkDifferenceFromStartJSON();
    }
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  lastRitardoAuto = -1;
  ritardoAuto = 5000;
  ritardoForzato = 60000;
  timerAuto = undefined;
  timerAttivatoAuto = false;
  strutturaTms;
  lastServerTime;
  lastTms = -1;
  chkUpdatePosition = true;
  coordinatePassateRT;

  attivaTimerAuto() {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Attivazione timer', this.ritardoAuto);
    // }
    if (this.timerAuto) {
      clearInterval(this.timerAuto);
    }
    this.modalitaRealTimeAttiva2 = true;
    this.timerAttivatoAuto = true;

    let contatore = 0;
    this.spostaTempo1(contatore, true);

    this.timerAuto = setInterval(() => {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dentro timer', contatore);
      this.spostaTempo1(contatore, false);

      contatore++;
    }, this.ritardoAuto)
  }

  fermaTimerAuto() {
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fermo timer');
    // }
    clearInterval(this.timerAuto);

    this.modalitaRealTimeAttiva2 = false;
    this.timerAttivatoAuto = false;
  }

  spostaTempo1(contatore, forza) {
    let valoreRicerca; //  = this.activitySetName[1]['NAME'];
    valoreRicerca = ExternalUtilities.stringaAGNoACT;
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Timer stringa act: ', valoreRicerca);
    // }
    if (!valoreRicerca || valoreRicerca === '' || valoreRicerca === 'undefined' || valoreRicerca === null || valoreRicerca === 'null') {
      return;
    }
    const dateNow = new Date() + ' UTC+00';
    const fine_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss', 'UTC');

    const params = {
      v_agn_code: valoreRicerca,
      v_tms: fine_ts,
      v_tms_min: this.Utils.tmsInizio
    };

    this.apiService.chiamataPost(this.Utils, 'antsgeo_tms_to_gps1', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data, this.NumeroFrame);
      if (data !== null) {
        ExternalUtilities.checkRitornoChiamata(this, this.Utils, data);
        this.strutturaTms = { server_time: new Date(data.v_server_time + ' UTC+00').getTime(), tms: data.v_tms};

        this.coordinatePassateRT = data;
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati tms to gps1', data);
        // }
        this.spostaTempo(contatore, data.v_server_time, data.v_tms, forza);

        // Imposta time range troncando a 0 minuti e 0 secondi (Mail 26/05/2023 07:23)
        const d = new Date();
        d.setHours(d.getHours() - 2);
        const inizio = this.datePipe.transform(d, 'yyyy-MM-dd HH:00:00', 'UTC');
        this.timeRangeDSFStart = inizio;
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ora inizio', inizio);
        // }

        const d2 = new Date();
        d2.setHours(d2.getHours() + 1);
        const fine = this.datePipe.transform(d2, 'yyyy-MM-dd HH:00:00', 'UTC');
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ora fine', fine);
        // }
        this.timeRangeDSFStop = fine;
        // Imposta time range troncando a 0 minuti e 0 secondi (Mail 26/05/2023 07:23)

        this.ritardoAuto = data.DASHBOARD_REFRESH_AUTO_SEC;
        if (this.ritardoAuto < 1000) {
          this.ritardoAuto *= 1000;
        }
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tempo attesa per refresh arrivato', this.ritardoAuto, this.lastRitardoAuto);
        if (this.lastRitardoAuto !== -1 && this.lastRitardoAuto !== this.ritardoAuto) {   
          // if (this.debug2) {
            this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tempo attesa per refresh', this.ritardoAuto);
          // }

          this.attivaTimerAuto();
        }
            
        this.lastRitardoAuto = this.ritardoAuto;          
      }
    });
  }
  
  spostaTempo(contatore, server_time_passato, selezionato, forza) {
    const tms = selezionato;
    const s_t = new Date(server_time_passato).getTime();
    // const server_time = fine_ts;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Server time ', server_time_passato, s_t);
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'LAST Server time ', this.lastServerTime);
    const diff1 = s_t - this.lastServerTime;

    if (forza === false) {
      if (this.lastTms !== -1 && this.lastServerTime !== -1) {
        if (this.lastTms === tms && +diff1 < +this.ritardoForzato) {
          // if (this.debug2) {
            this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: Sto uscendo e non aggiorno niente. Secondi ', diff1, this.ritardoForzato);
          // }
          return;
        }
      }
    }
    this.lastTms = tms;
    this.lastServerTime = s_t;

    // const dateNow: Date = new Date();
    // const fine_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: Tms:', tms);
    // }
    const tmsPassato = new Date(tms + ' UTC+00').getTime(); // new Date().getTime();
    const tmsPassatoS = this.datePipe.transform(new Date(tmsPassato), 'yyyy-MM-dd HH:mm:ss', 'UTC');

    const att = new Date(server_time_passato + ' UTC+00').getTime(); // new Date().getTime();
    const diff = this.valoreTimeSpan * 1000;
    const inizio = att - diff;
    const inizio_ts = this.datePipe.transform(new Date(inizio), 'yyyy-MM-dd HH:mm:ss', 'UTC');

    this.valoreTimeSpan = diff;

    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: Global time', diff);
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Orario Attuale convertito', att);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: Inizio TS', inizio_ts);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: Fine TS', server_time_passato);
    // }

    const tmsSel = new Date(this.Utils.tmsSelezionato).getDate();
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: Tms Selezionato', this.Utils.tmsSelezionato);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: Diff selez inizio', tmsSel, inizio);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: Diff selez fine', tmsSel, att);
    // }

    this.impostaTimeSelezionatoFine(server_time_passato, 'SPOSTATEMPO');
    this.impostaTimeSelezionatoInizio(inizio_ts, 'SPOSTATEMPO');

    if (!this.timerAttivatoAuto) {
      if (tmsSel < inizio) {
        this.Utils.tmsSelezionato = tms;
        this.Utils.tmsSelezionatoStringa = inizio_ts;
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: TS minore dello start, lo imposto', this.Utils.tmsSelezionato);
        // }
      }

      if (tmsSel > att) {
        this.Utils.tmsSelezionato = att;
        this.Utils.tmsSelezionatoStringa = inizio_ts;
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: TS maggiore dell\'end, lo imposto', this.Utils.tmsSelezionato);
        // }
      }
    } else {
      this.Utils.tmsSelezionato = tms;
      this.Utils.tmsSelezionatoStringa = tmsPassatoS;
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: TS impostato', this.Utils.tmsSelezionato);
      // }
    }

    // 02/05/2023
    // if (!this.timerAttivatoAuto && this.chkUpdatePosition === true) {
    if (!this.timerAttivatoAuto && this.chkUpdatePosition === true) {
      const time_cursor = selezionato;
      // AppComponent.CambioTmsSelezionato(this.Utilities, time_cursor, 'Automatic cursor set');
      this.impostaTimeSelezionato(time_cursor);
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: Cursor TS', time_cursor);
      // }
    }

    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SPOSTATEMPO: Auto timer scattato', contatore, inizio_ts, server_time_passato);
    // }
  }

  impostaTimeSelezionatoInizio(e, daDove) {
    if (!e || e === '') {
      return;
    }
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta tms Inizio', e , daDove);
    // }
    const d1 = new Date(e + ' UTC+00').getTime();
    const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss', 'UTC')
    this.Utils.tmsInizio = t1;

    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time start impostato', t1);
    // }

    this.calcolaRangeInizio();
  }

  calcolaRangeInizio() {
    let rInizio = new Date(this.Utils.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    // rInizio -= (+this.valoreTimeSpanRange * 1000);

    const diff = (new Date(this.Utils.tmsFine).getTime() - new Date(this.Utils.tmsInizio).getTime()) / 1000;
    this.valoreTimeSpan = +diff;
    this.Utils.rangeDiSecondiPerMille = +this.valoreTimeSpan * 1000;
    this.Utils.range = this.Utils.rangeDiSecondiPerMille;

    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Calcolarangeinizio: Tms Inizio', this.Utils.tmsInizio);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Calcolarangeinizio: Tms Selezionato', this.Utils.tmsSelezionato);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Calcolarangeinizio: Tms Fine', this.Utils.tmsFine);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Calcolarangeinizio: Valore time span', this.valoreTimeSpan);
    // }

    if (this.Utils.tmsSelezionato) {
      let rActual = new Date(this.Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Calcolarangeinizio: Controllo congruità: ', rActual, rInizio);
      // }
      if (rActual < rInizio) {
        rActual = rInizio + (diff / 2);
        const sActual = this.Utils.datePipe.transform(rActual, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Calcolarangeinizio: Ts minore dell\'inizio. Reimposto a ', sActual);
        // }
        this.Utils.tmsSelezionato = sActual;
        this.Utils.tmsSelezionatoStringa = sActual;
      }

      this.Utils.rangeSelezionatoStampa = this.Utils.tmsInizio + '<br />' + this.Utils.tmsFine;

      this.ridisegnaTutto = new Date();
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Calcolarangeinizio: Calcola range inizio', this.Utils.tmsInizio);
      // }
    }
  }
  
  calcolaRangeFine() {
    let rFine = new Date(this.Utils.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    // rInizio -= (+this.valoreTimeSpanRange * 1000);

    const diff = (new Date(this.Utils.tmsFine).getTime() - new Date(this.Utils.tmsInizio).getTime()) / 1000;
    this.valoreTimeSpan = +diff;
    this.Utils.rangeDiSecondiPerMille = +this.valoreTimeSpan * 1000;
    this.Utils.range = this.Utils.rangeDiSecondiPerMille;

    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine: Tms Inizio', this.Utils.tmsInizio);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine: Tms Selezionato', this.Utils.tmsSelezionato);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine: Tms Fine', this.Utils.tmsFine);
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine: Valore time span', this.valoreTimeSpan);
    // }

    if (this.Utils.tmsSelezionato) {
      let rActual = new Date(this.Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine: Controllo congruità: ', rActual, rFine, rActual - rFine);
      // }
      if (rActual > rFine) {
        rActual = (rFine - (diff / 2)) + 1;
        const sActual = this.Utils.datePipe.transform(rActual, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        // if (this.debug2) {
          this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine: Ts maggiore della fine. Reimposto a ', sActual);
        // }
        this.Utils.tmsSelezionato = sActual;
        this.Utils.tmsSelezionatoStringa = sActual;
      }

      this.Utils.rangeSelezionatoStampa = this.Utils.tmsInizio + '<br />' + this.Utils.tmsFine;

      this.ridisegnaTutto = new Date();

      const sActual = this.Utils.datePipe.transform(this.Utils.tmsSelezionato, 'yyyy-MM-dd HH:mm:ss');
      this.Utils.tmsSelezionatoStringa = sActual;

      // if (this.debug2) {
        this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine: Fine', this.Utils.tmsInizio);
      // }
    }
  }

  impostaTimeSelezionatoFine(e, daDove) {
    if (!e || e === '') {
      return;
    }

    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta tms fine', e , daDove);
    // }
    const d1 = new Date(e + ' UTC+00').getTime();
    const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss', 'UTC')
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS FINE 5: ', t1);
    // }
    this.Utils.tmsFine = t1;

    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time end impostato', t1);
    // }

    this.calcolaRangeFine();
  }

  funzione4() {
    const jasone = '{"act_name":"20230609_071206_SDTU000464.01. RM 4G Benchmarking Dinamico ILIAD","_ws.lua.text":{"ants-pdu.fldmsk":"0111","ants-pdu.string":"[ANTS] start trace file (this is the T0 ref pkt)","ants-pdu.fullrow":"captured by antsradio ver 2.2.5 - May 31 2023 16:41:23 at 2023-06-09 08:20:11.794035 (1686298811.794035) ' +
      '- /data/local/tmp/antsradio --out-cap-trace /storage/emulated/0/MobiANTS/Log/Sys.Radio/20230609_071206_SDTU000464.01_Act_L3.%E.cap --out-cap-trace-wrap-KB 5000 ' +
      '--out-cap-measure /storage/emulated/0/MobiANTS/Log/Sys.Radio/20230609_071206_SDTU000464.01_Act_L3.%E.meas.pcap --out-cap-measure-wrap-KB 5000 --t0 1686294780000", ' +
      '"ants-pdu.fldmsk_tree":{"_ws.lua.text":"","ants-pdu.fldmsk.msk":"11"}},"ants-pdu.dissectorversion":"ANTS dissector version 1.0.6 (30-apr-2021) running in ' +
      'wireshark/tshark version 3.6.5"}';
    const jasoneParse = JSON.parse(jasone);
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CERCASTRINGAJSON: ', jasoneParse);
    // }
    this.vociTrovate = new Array();
    this.percorsoCompleto = '';
    this.cercaStringaInJSON('', jasoneParse, 'pdu');
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CERCASTRINGAJSON: ', this.vociTrovate);
    // }
  }

  vociTrovate;
  percorsoCompleto;

  cercaStringaInJSON(inizio, jasone, stringaDaCercare) {
    Object.keys(jasone).forEach(element => {
      if (element) {
        if (typeof(jasone[element]) === 'object') {
          if (element.indexOf(stringaDaCercare) > -1) {
            this.vociTrovate.push(this.percorsoCompleto + element);
          }

          this.percorsoCompleto += element + ',';

          this.cercaStringaInJSON(inizio, jasone[element], stringaDaCercare)
        } else {
          if (element.indexOf(stringaDaCercare) > -1) {
            // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '--->' + inizio + ' - ' + element);
            this.vociTrovate.push(this.percorsoCompleto + element);
            return;
          }
        }
      }
    });
    const i = this.percorsoCompleto.split(',');
    let ii = '';
    let primo = true;
    i.forEach(element => {
      if (!primo) {
        ii += element + ',';
      } else {
        primo = false;
      }
    });
    while (ii.indexOf(',,') > -1) {
      ii = ii.replace(',,', ',');
    }
    if (ii.substring(0, 1) === ',') {
      ii = ii.substring(1, ii.length);
    }
    this.percorsoCompleto = ii;
    // if (this.debug2) {
      this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CERCASTRINGAJSON: fine', this.percorsoCompleto);
    // }
  }

  checkEditMode(e) {
    this.editMode = e.srcElement.checked;
    // console.log('Click su edit mode', this.editMode);
  }

  checkTestJson(e) {
    this.testJson = e.srcElement.checked;
    localStorage.setItem('testJson', (e.srcElement.checked ? 'S' : 'N'));
  }

  checkDebug(n, e) {
    switch (n) {
      case 0:
        this.debug0 = e.srcElement.checked;
        break;
      case 1:
        this.debug1 = e.srcElement.checked;
        break;
      case 2:
        this.debug2 = e.srcElement.checked;
        break;
      case 3:
        this.debug3 = e.srcElement.checked;
        break;
    }
    localStorage.setItem('debug' + n.toString(), (e.srcElement.checked ? 'S' : 'N'));
    // this.editMode = e.srcElement.checked;
    // console.log('Click su debug', n, e.srcElement.checked);
  }

  fMenuAperti = false;
  
  menuAperti(e) {
    setTimeout(() => {
      this.fMenuAperti = e.srcElement.checked;
      // this.isVisibileBars = e.srcElement.checked;
    }, 100);
    // console.log('Click su menu aperti', this.fMenuAperti);
  }

  ridisegnaMappaEmit(e) {
    this.ridisegaMappa = e;
  }
  
  impostaMisureGlobali(e) {
    // console.log('Misure globali passate dal frame', e);
  }

  refreshPerTcRunClickUguale() {
    this.refreshaDaTasto();
  }

  bboxDisegnataSullaMappa;
  
  boxDisegnataSuMappa(e) {
    this.bboxDisegnataSullaMappa = e;
  }

  showAddLayers(f, q, e) {
    this.impostazioni.showAdditionalLayers[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    // console.log('tipoDati Layout', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  viewModeMSChanged(f, q ,e) {
    if (this.impostazioni.viewModeMS === undefined || this.impostazioni.viewModeMS[0] === undefined || this.impostazioni.viewModeMS[0][0] === undefined) {
      this.impostazioni.viewModeMS = Utils.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    this.impostazioni.viewModeMS[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    // console.log('viewModeMSChanged', this.impostazioni.viewModeMS);
    this.checkDifferenceFromStartJSON();
  }

  flowTypeMSChanged(f, q ,e) {
    if (this.impostazioni.flowTypeMS === undefined || this.impostazioni.flowTypeMS[0] === undefined || this.impostazioni.flowTypeMS[0][0] === undefined) {
      this.impostazioni.flowTypeMS = Utils.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    this.impostazioni.flowTypeMS[f][q] = e;
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    // console.log('flowTypeMSChanged', this.impostazioni.flowTypeMS);
    this.checkDifferenceFromStartJSON();
  }

  fCentroImpostato(e) {
    // console.log('Centro impostato: ', e);
    this.centroImpostato = e;
  }

  impostaPagine(e) {
    // console.log('Pagina impostata', e, this.impostazioni.frameAttivo);
    let n = 0;
    this.impostazioni.frameAttivo.forEach(element => {
      this.impostazioni.frameAttivo[n] = e.id;
      n++;
    });
  }

  impostaFrameAttivoPerTest() {
    this.impostazioni.frameAttivo[this.numeroZeroFrame] = -1;
    this.impostazioni.frameAttivo[this.numeroPrimoFrame] = -1;
    this.impostazioni.frameAttivo[this.numeroSecondoFrame] = -1;
    this.impostazioni.frameAttivo[this.numeroTerzoFrame] = -1;
    setTimeout(() => {
      this.impostazioni.frameAttivo[this.numeroZeroFrame] = 15;
      this.impostazioni.frameAttivo[this.numeroPrimoFrame] = 15;
      this.impostazioni.frameAttivo[this.numeroSecondoFrame] = 15;
      this.impostazioni.frameAttivo[this.numeroTerzoFrame] = 15;
    }, 500);
  }

  squareMetersGlobale = '100';

  DatiSquareMeters = [
    { CODE: '0', DISPLAY_NAME: '0' },
    { CODE: '1', DISPLAY_NAME: '1' },
    { CODE: '2', DISPLAY_NAME: '2' },
    { CODE: '5', DISPLAY_NAME: '5' },
    { CODE: '7', DISPLAY_NAME: '7' },
    { CODE: '10', DISPLAY_NAME: '10' },
    { CODE: '20', DISPLAY_NAME: '20' },
    { CODE: '50', DISPLAY_NAME: '50' },
    { CODE: '100', DISPLAY_NAME: '100' },
    { CODE: '200', DISPLAY_NAME: '200' },
    { CODE: '500', DISPLAY_NAME: '500' },
    { CODE: '1000', DISPLAY_NAME: '1000' },
    { CODE: '2000', DISPLAY_NAME: '2000' },
    { CODE: '5000', DISPLAY_NAME: '5000' },
    { CODE: '10000', DISPLAY_NAME: '10000' }
  ];

  cambioSquareMetersGlobale(e) {
    console.log('Cambio square meters globale', e);
    this.squareMetersGlobale = e.DISPLAY_NAME;
  }

  partitionLabel = '';
  partitionLabelEdit = '';

  partitionLabelEmit(e) {
    this.partitionLabel = e;
    this.partitionLabelEdit = e;
  }

  cambioPartitionLabel() {
    this.partitionLabel = this.partitionLabelEdit;
  }

  misureGlobaliEmit(e) {
    console.log('Misure globali in app', e);
    this.impostazioni.misureGlobaliChecked = e;
  }
  
  funzione5() {
    let i = 0;
    const m = new Array();
    this.mapTypePerStampa.forEach(element => {
      if (!element || element > -1) {
        m.push(-1);
      } else {
        m.push(this.impostazioni.tipoMappa[i]);
      }
      i++;
    });
    this.mapTypePerStampa = JSON.parse(JSON.stringify(m));
    console.log('Map type per stampa', this.mapTypePerStampa);
  }

  funzione6() {
    const eventi = [
      {
        EVENT_TYPE: "4G: EMM Authentication request",
        ROW_ID: 3
      },
      {
        EVENT_TYPE: "4G: EMM Attach request",
        ROW_ID: 1
      },
    ];
    this.impostazioni.eventiSceltiGlobaliES = eventi;
  }

  listaEventiDaTogliere;

  eventiDaTogliere(e) {
    this.listaEventiDaTogliere = e;
  }

  measureDataCompleti = undefined;

  prendeTutteLeMisure() {
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": "", ' +
      '"v_filter_display_name": ""' +
    '}';
    // console.log('Query misura', JSON.parse(params));
    this.apiService.chiamataPost(Utils, 'geo_measure_dfn__grid', params)
    // .map(response => response)
    .subscribe((data: any) => {
      if (data && data.DataTable && data.DataTable.length > 0) {
        // console.log('Prende tutte le misure', data.DataTable);
        this.measureDataCompleti = data;
      }
    });
  }

  settingsAperto = false;

  gestioneSetting(e) {
    this.settingsAperto = e;
  }

  imsi = undefined;
  uniqueID = undefined;

  imsiSelezionato(e) {
    // console.log('IMSI selezionato in app', e);
    this.imsi = undefined;
    const t = setTimeout(() => {
      clearTimeout(e);
      this.imsi = e;
    }, 500);
  }

  uniqueIDSelezionato(e)  {
    // console.log('UniqueID selezionato in app', e);
    this.uniqueID = undefined;
    const t = setTimeout(() => {
      clearTimeout(e);
      this.uniqueID = e;
    }, 500);
  }

  filterMQ = '';

  cambioFilterMQ(e) {
    console.log('Filter MQ selezionato in app', e);
    this.filterMQ = JSON.parse(JSON.stringify(e)); // undefined;
    /* const t = setTimeout(() => {
      clearTimeout(e);
      
      this.filterMQ = e;
    }, 500); */
  }

  testaJson() {
    const stringa: string = '{"to_tms": "2026-02-11T06:29:39.656", "from_tms": "2026-02-11T05:30:15.413", "interface": "50_rbcixl_normal_rx"}';
    let base64 = this.toBase64(stringa);
    let params = {
      W_Pippo: 'ppp',
      W_Paperino: 'aaa',
      W_Stringa: base64
    }
    console.log('Testa json', JSON.parse(JSON.stringify(params)), decodeURIComponent(escape(atob(base64))));
  }

  toBase64(text: string): string {
    return btoa(
      new TextEncoder()
        .encode(text)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  }

  public ssData: any[] = [
    {
        name: 'Food Order',
        rows: [
            {cells: [ {value: 'ID'}, {value: 'Pizzas'} ]},
            {cells: [ {value: 216321}, {value: 'Calzone'} ]},
            {cells: [ {value: 216322}, {value: 'Margarita'} ]},
        ]
    },
  ];

  arrivoDati(e: any) {
    console.log('Dati arrivati: ', e);
  }  

  isNumeric(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
  }
}
import { logConsole } from './console-log';
// import {isNumeric} from 'rxjs/util/isNumeric'
import { Component, OnInit, OnChanges, ViewChild, AfterViewInit, HostListener, ElementRef, AfterContentChecked, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import OlView from 'ol/View';
import { fromLonLat } from 'ol/proj';
import { SplitComponent } from 'angular-split';
import {ApiService} from '../db/api.service';
// import {SessionService} from '../db/session.service';
// import 'rxjs/add/operator/map';
import { environment } from '../environments/environment';
import {DomSanitizer, Title} from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { transformExtent } from 'ol/proj';
import { HttpClient } from '@angular/common/http';
import { GestioneFinestreComponent } from './components/frame/gestione_frames';
import { AggiunstaArrayComponent } from './components/frame/elaborations/aggiustaarray.component';
import { Utils } from './components/Utilities.component';
import ExternalUtilities from './components/ExternalUtilities.component';
import * as CanvasJS from '../assets/js/canvasjs.min.js';
import { ComandiVocaliComponent } from './comandi_vocali.component';
// import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfermaComponent } from './components/conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { ClipboardService } from 'ngx-clipboard';
import packageJson from '../../package.json';
// import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ChangeDetectorRef } from '@angular/core';
import { LogComponent } from './components/log.component';
import { Platform } from '@angular/cdk/platform';
import { ScreenShotComponent } from './screenshot';
// import { Paginator } from 'primeng';
// import { FileSaverService } from 'ngx-filesaver';
import download from 'downloadjs';  // Importa downloadjs
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoaderSize, LoaderThemeColor, LoaderType } from '@progress/kendo-angular-indicators';
import { ThemeService } from '@progress/kendo-angular-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush, // AGGIUNTO PER MEMORY LEAKES
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy, AfterContentChecked {
  @ViewChild('divContenitore', {static: false}) elementView: ElementRef;
  @ViewChild('divContenitoreStampa', {static: false}) divContStampa: ElementRef;
  // @ViewChild('divStampa', { static: true }) schermoDaStampare: any;
  
  destroy$ = new Subject<void>();

  static ultimaVoltaCambioTms = 0;
  // static tmsAttuale = '';

  static ranges = new Array();
  static qualeRange = -1;

  public Utils = Utils;
  public AC = AppComponent;

  limitaRighePerDebug = undefined;
  
  canvJS = CanvasJS;
  indirizzoServer;
  ceGPS = false;
  opacitaCAM = .1;

  cellSet;
  cellSetRow;
  datiActTimeSpanAppoggio;

  bUploadReport = false;
  aggiornaGrigliaReport;

  timerSynch;
  stoppaSynch = false;
  lastJsone;
  listaWorkspaces;
  tastiVisibiliSalva = false;
  ridisegnaGrafici = undefined;
  // primaActivityPresente = undefined;

  act_set_originale;
  ricaricaReport = '';

  debugFrame1 = false;
  debugFrame2 = false;
  debugFrame3 = false;
  debugFrame4 = false;
  debugFrame5 = false;
  debugFrame6 = false;
  debugFrame7 = false;
  debugFrame8 = false;
  debugFrame9 = false;

  datiActivities;
  datiPageSelector;
  pageSelector = 1;
  pageSelector2 = 1;
  effettuaAutoFitLA = false;
  impostaPaginaLA = 0;
  impostaSelezioneLA;
  gridActivities = 'grdActivitiesP';
  lastCallAct = '';
  vecchioParamsAct = '';
  caricamentoActivitiesInCorso = false;
  activitiesPassataDaRoot;
  permessiDataView;
  righePerPaginareAutomaticamente = -1;
  showLegendaHistogram = true;
  tipoLegendaIstogrammi = 'TOP';
  nomePaginaSelezionata = '';
  listaEventiSE;
  listaEventiGlobaliSE;
  bCambioTimeRange = false;

  menuVisibile = false;
  menuVisibile2 = false;
  ultimaVoltaClickMenu = -1;
  ultimaVoltaClickMenu2 = -1;
  dimeDrawer = '0px';
  dimeDrawer2 = '0px';
  dimeDrawerAperto = 500;
  // vecchieImpostazioniHor;
  platformName = '';
  dateNowH = '';
  symb_TimeStamp = '';
  maschera = '';
  fullScreen = '';
  altro = '';
  fromFleet;
  vociChiuseMenu = false;
  // static modalitaDebug = false;
  debug2 = false;
  additionalLayer;
  additionalLayer2;
  statoServer = '';
  statoManutenzione = '';
  coloreStatoServer = 'white';
  microfonoAttivo = false;
  operatorID = -1;
  comandoVocale = '';
  setNetTech = false;
  datiGrigliaAntenne;
  refreshExclIncl = false;
  staPartendo = true;
  
  richiedeNomePS = false;
  nomePS = '';
  descriptionPS = '';
  ridisegnaMappa = undefined;
  resizeFrame = ExternalUtilities.creaVettore(environment.quantiFrames, '');

  refreshPlanimetria = '';

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
  comboSelArea;
  salvataggioInCorsoFav = false;

  timerAttivatoAuto = false;

  lastTms = -1;
  lastServerTime = -1;
  nuovoTmsDelta = '';

  @ViewChild('divContenitore', {static: true}) divCont: any;
  @ViewChild('splitMenu', {static: true}) splitMenu: SplitComponent;
  @ViewChild('split12', {static: true}) split12: SplitComponent;
  @ViewChild('split34', {static: true}) split34: SplitComponent;
  @ViewChild('split56', {static: true}) split56: SplitComponent;
  @ViewChild('splitVertical', {static: true}) splitVertical: SplitComponent;

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  
  centroImpostato;

  loaderAttesa = {
    type: <LoaderType>"converging-spinner",
    themeColor: <LoaderThemeColor>"success",
    size: <LoaderSize>"large",
  };

  loaderContext = {
    type: <LoaderType>"converging-spinner",
    themeColor: <LoaderThemeColor>"primary",
    size: <LoaderSize>"medium",
  };

  AppComp = AppComponent;
  lastQ = -1;
  numeroDashboardDefault = 0;

  // nuoviDatiPerCambioFrame;
  datePickerConfig1 = {
    disableKeypress: true,
    allowMultiSelect: false,
    closeOnSelect: true,
    showSeconds: true
  };
  datePickerConfig2 = {
    disableKeypress: true,
    allowMultiSelect: false,
    closeOnSelect: true,
    showSeconds: true
  };

  schermoStretto = false;
  timestampVisibile = true;
  dimeX;
  dimeY;

  refreshDaTasto = [ false, false, false, false, false, false, false, false, false, false ];
  messaggioDiErrore = false;

  actSetVisibile1 = false;
  actSetVisibile2 = false;
  actSetVisibile3 = false;
  actSetVisibile4 = false;
  numeroActSetVisibili = 0;

  datiPageSelectorFiltrati;
  posXPopupEvents = 50;
  posYPopupEvents = 150;
  maxDimeDrawer = 500;
  descrizioniDiTuttiIframes = ExternalUtilities.creaMatrice(environment.quantiFrames, environment.quantiSottoFrames, '');

  popupVisibile = false;

  forzaSelezioneActivitySet = ['', '', '', '', '', ''];
  forzaSelezioneDashboard = '';
  centroAttuale = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

  datiNetTech;
  datiBandWidth;

  stringaAGNoACT = '';
  pulisceFiltroActScelta = [false, false, false, false, false];

  accordionDebug = true;
  editModeActive = false;
  frameEditorAttivo = true;
  exportKML;
  strutturaTms;

  campoClickatoAE = '';
  frameAttivoClickatoAE;
  NumeroFrameClickatoAE;
  datiEventiDaMettere;
  squareMetersO = undefined;
  squareMetersZ = undefined;

  isPlaying = false;
  secondiSpostamento = 1;
  // subscribePlay;
  primaPartenzaEffettuata = false;

  datiGrigliaCheck;
  checkPopup = false;
  modalitaCheckPopup;
  operazioneCheckPopup = '';

  // Utilities = Utils;
  listaActivitySets = [null, null, null, null, null];

  sessioneID;
  editMode = false;

  nomiFrames = ['', 'Frame 01', 'Frame 02', 'Frame 03', 'Frame 04', 'Frame 05', 'Frame 06', 'Frame 07',
    'Frame 08', 'Frame 09', 'Frame 10'];

  mappeStyle: any[] = [
    { id: 1, name: 'Band' },
    { id: 2, name: 'Line' },
    { id: 3, name: 'Coaxial' },
  ];

  htmlCode;
  appoHtml = '';
  // subscribe;
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
  caricatiFoldersWS = false;
  slaManagerVisible = false;
  espandiTreeView = [undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, undefined];
  collassaTreeView = [undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, undefined];
  copyAllClips = [undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined, undefined];

  tmsStartPassatoDaProgetto;
  tmsEndPassatoDaProgetto;

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
  valoreTimeSpan = 300;
  valoreTimeSpanRange = 60;
  mostraSceltaAGNoACT = false;
  activityPassateDaScegliere;
  numeroSetPerActivityScelta = -1;
  numeroFramePerActivityScelta = -1;
  cambiatoAGNACTDopoScelta = ['', '', '', '', '', '', '', '', '', '', ''];
  // activitySceltaStampa = '';

  groupName;
  ultimaVoltaHtml = 0;
  ultimoCSV = '';

  ridisegnaTutto = null;

  calcolaCentro = false;
  // extent;

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
  styleSizeG;

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
  slaValueGlobale;

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
  showTimeCursor;
  MappaOGraficoTutti;

  measureData;
  datiLookUp;
  datiAddLayers;
  datiAddLayers2;
  datiFolders;
  datiMosaicStyle;
  datiFoldersWS;

  datiZoomMap = [
    { CODE: -1, VALUE_STR: 'No' },
    { CODE: 1, VALUE_STR: 'Position' },
    { CODE: 2, VALUE_STR: 'Position and Zoom' },
  ]
  zoomMap;
  geoFilterClick = -1;
  pulisceFiltroFoldersWS = false;

  arrayDelete;
  idxDelete;
  showActSet = false;
  righeSelezionatePerActSet;

  impostazioni: any = {
    frameAttivo: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    maskSize: [[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
      [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34]
      ],
    maskSizeHor: [[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
      [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
      [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
      [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
      [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],
      [33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34],[33, 33, 33, 34]],
    // maskVisibleHor: [true, false, false, false],
    styleVis: 1,
    maskVisible: [[true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
      [true, true, true, true, true, true, true, true, true, true]],
    maskDisabled12: false,
    maskDisabled34: false,
    maskDisabled56: false,
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
    misureGlobaliImpostate: undefined,
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
    actualDimeDrawer: this.maxDimeDrawer,
    actualDimeDrawer2: this.maxDimeDrawer,
    cellType: undefined,
    frameMassimizzato: false,
    filtriEventi: undefined,
    isCheckedShowPaths: undefined,
    isCheckedShowSelectedPaths: undefined,
    addLayers: undefined,
    opacity: undefined,
    shownEvents: undefined,
    modificaChart: undefined,
    doNotGM: undefined,
    showRays: undefined,
    showMeasures: undefined,
    squareMeters: undefined,
    globalMeasure: undefined,
    globalMeasureArfcn: undefined,
    measureType: undefined,
    mosaicStyle: undefined,
    sartPosition: undefined,
    bboxOZ: undefined,
    geoFilter: undefined,
    measureSMS: undefined,
    showMeasuresS: undefined,
    tipoDataset: undefined,
    nascoste123: false,
    // framesPinnati: true,
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
    datiPageSelector: undefined,
    correlation: undefined,
    dimensioni: new Array(),
    isNonSyncEventTime: undefined,
    occhioCheckato: new Array(),
    showVoiceCallMeasures: undefined,
    showDataMeasures: undefined,
    showCoverageMeasures: undefined,
    clusterMeasure2: undefined,
    // lov: undefined,
    textFilter2: undefined,
    pageSelector: 1,
    showAxisX: undefined,

    mapTypeG: undefined,
    mapTypeS: undefined,
    styleSizeG: undefined,
    slaValueGlobale: undefined,
    overlayClusterG: undefined,
    zoomMap: undefined,
    comboSelArea: undefined,
    showLegendaHistogram: undefined,
    tipoLegendaIstogrammi: undefined,
    datiActTimeSpan: undefined,
    datiActTimeSpanRange: undefined,
    // cellSet: undefined,
    misureAddizionaliTCRUN: undefined,
    heightChart: undefined,
    // cellSetRow: undefined
    doubleGraph: undefined,
    listaCampiTCRP: undefined,
    dimensioniSplitTcRun: undefined,
    impostazioniPivotGrid: undefined,
    tipoDatiLayout: 3,
    showAdditionalLayers: undefined,
    viewModeMS: undefined,
    flowTypeMS: undefined,
    isStandAloneMR: undefined
  };
  activityName = undefined;
  // viewOlG = undefined;
  // viewOlL = undefined;
  slaValue = undefined;

  newarray = [[], [], [], [], [], [], [], [], [], [], []];

  designInfo = [null, false, false, false, false, false, false, false, false, false, false];
  dimeDrawerInizio = 0;
  nonChiudereDrawer = false;
  dimeDrawerInizio2 = 0;
  nonChiudereDrawer2 = false;

  isVisibileBars = true;
  chkUpdatePosition;
  contextAperto = false;
  dashboardAccordionOpen = false;
  activityAccordionOpen = false;
  settingsAccordionOpen = false;
  filtersAccordionOpen = false;
  dataSetAccordionOpen = false;
  debugAccordionOpen = false;
  timeAccordionOpen = false;
  antenneAccordionOpen = false;
  eventsAccordionOpen = false;
  exportAccordionOpen = false;
  ltpAccordionOpen = false;

  // datiPointMeasures = '';
  // datiActivityEvents = '';
  isSyncTms = false;

  timeRangeDSFStart = undefined;
  timeRangeDSFStop = undefined;
  bbox;
  bboxO;
  bboxZ;
  rigaMG;
  rigaCG;
  rigaArfcn;

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

  mapTypeG = 1;
  mapTypeS = -1;
  activitySet = [-1, -1, -1, -1, -1];
  activitySetName = ['', '', '', '', '', ''];
  // activityName = [-1, '', '', '', ''];
  nomeActivitySet;
  coordinateSRLE;

  mostraNewFrame = true;
  // refreshMaschera = [null, null, null, null, null, null, null, null, null, null, null];

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

  // subscribeStart;

  mosaicoSelezionato = undefined;
  clusterSelezionato = undefined;

  center_position;
  time_cursor_position;

  lastDays;
  refreshAccentratore;
  misureComboLTP;

  datiPointMeasureDFN;
  nomeGrigliaMD = 'grigliaMD_1M';
  impostaSelezioneMeasureDFN = new Array();
  effettuaAutoFitMeasureDFN;
  impostaPaginaMeasureDFN = 0;
  caricamentoMeasureDFN = false;
  staElaborandoMDFN = false;
  caricamentoDatiInCorsoMeasureDFN = false;
  lastCallMeasureDFN = '';
  impostaValoriMascheraProgetto = false;

  datiEventSummary;
  nomeGrigliaES = 'grigliaES_1M';
  impostaSelezioneES = new Array();
  effettuaAutoFitES = false;
  caricamentoEVenti = false;
  frameNameES = '';
  lastCallES = '';
  appoEventSummary;
  act_setES = '';
  listaEventiDaPassare;
  idSelezionatoES = [-1];
  eventiSceltiDaFrame;
  eventiSceltiGlobaliDaFrame;

  quadratoMappa;
  cellaSelezionata;

  netTech2 = '';
  netTech22 = 0;
  bandwidth2 = '';
  bandwidth22 = 0;
  codeLike2 = '';
  ch2  = '';
  bsic2 = '';
  scr2 = '';
  pci2 = '';
  territory2 = '';
  freeText2 = '';
  parametriDD = '';
  lastSelectedLayer;

  linkIcone = undefined;

  // Sostituisce nel template l'espressione linkIcone && linkIcone.toUpperCase().indexOf('UNDEFINED')==-1 (55 volte,
  // rivalutata a ogni change detection): il controllo sulla stringa si rifà solo quando linkIcone cambia
  private ultimoLinkIconeControllato;
  private iconeValideCalcolato = false;
  get iconeValide(): boolean {
    if (this.linkIcone !== this.ultimoLinkIconeControllato) {
      this.ultimoLinkIconeControllato = this.linkIcone;
      this.iconeValideCalcolato = !!this.linkIcone && this.linkIcone.toUpperCase().indexOf('UNDEFINED') === -1;
    }
    return this.iconeValideCalcolato;
  }
  refreshFavoriti = false;

  nomeWorkSpace = '';
  folderWorkSpace = '';
  descWorkSpace = '';
  salvaWorkSpace = false;

  ritardoAuto = 5000;
  ritardoForzato = 60000;
  timerAuto = undefined;

  ricaricaRaggi;
  mapTypePerStampa;

  // Modulo APK
  /* device;
  infoGPS = false;
  infoSistema = undefined;
  datiGPS = {
    GPS: undefined,
    network: undefined,
    satellite: undefined,
    cellInfo: undefined,
    cellLocation: undefined,
    signalStrength: undefined,
    datiUlteriori: undefined,
    connectionJSON: undefined
  }
  presoJSON = false; */
  // Modulo APK

  static CambioTmsSelezionato(Utilities, tms, daDove, timerAttivatoAuto) {
    // if (tms > 0) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato. TMS: ', tms);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato: ', tms, daDove);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato. Attuale tms : ', Utilities.tmsSelezionato);
      if (tms === 0) {
        return;
      }

      const ora = new Date().getTime();
      if (ora - AppComponent.ultimaVoltaCambioTms > 1000) {
        AppComponent.ultimaVoltaCambioTms = ora;
        
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato. Aggiorno il tms');
        // if (tms === 0) {
        //   this.Utilities.tmsSelezionato = JSON.parse(JSON.stringify(tms));
        // } else {

        if (Utilities.tmsInizio && Utilities.tmsFine) {
          AppComponent.aggiungeRange(Utilities);

          const rInizio = new Date(Utilities.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
          const rFine = new Date(Utilities.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();

          if (tms && tms !== null) {
            const t = new Date(tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();

            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato. Controlo il tms di riferimento:', t);
            // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t, this.Utilities.tmsInizio, this.Utilities.tmsFine);
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato. Deve essere compreso fra:', rInizio, rFine);

            if (t < rInizio || t > rFine) {
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato. NON lo è... lo aggiorno');
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio range', t, rInizio, rFine);
              ExternalUtilities.creaRangeSelezionato('CambioTMSSelezionato 1', tms, Utilities, timerAttivatoAuto);
              Utilities.cambioTimeRange = new Date();
            }
          }
        } else {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato. Imposto tms per mancanza limiti');
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Reimposto range', tms);
          ExternalUtilities.creaRangeSelezionato('CambioTMSSelezionato 2', tms, Utilities, timerAttivatoAuto);
          Utilities.cambioTimeRange = new Date();
        }

        ExternalUtilities.aggiornaTmsStringa(tms, Utilities, 'Cambio TMS Selezionato');

        // const tm = setTimeout(() => {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Range di riferimento:', this.Utilities.rangeSelezionato);
        if (tms === 0) {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno il tms di riferimento');
          if (Utilities.tmsSelezionato !== undefined) {
            Utilities.tmsSelezionato = JSON.parse(JSON.stringify(Utilities.tmsSelezionato));
          }
        } else {
          if (tms.indexOf('.') > -1) {
            tms = tms.substring(0, tms.indexOf('.'));
          }
          Utilities.tmsSelezionato = tms;
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato. Imposto il tms di riferimento:', Utilities.tmsSelezionato);
        }
          // AppComponent.tmsAttuale = this.Utilities.datePipe.transform(this.Utilities.tmsSelezionato, 'yyyy-MM-dd HH:mm:ss');
        // }, 100);

        // }
      }
    // }
  }

  /* getJSON(): Observable<any> {
    // alert('getJSON: ' + this.infoSistema.ceCordova);
    let indirizzo = '';

    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }
    if (this.accordionDebug === true) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, indirizzo);
    }

    // return this.http.get(indirizzo);

    return this.http.get(indirizzo).catch(this.catchAuthError());
  }

  getJSONAndroid(indirizzo) {
    return this.httpAndroid.get(indirizzo, {}, {})
  }

  private catchAuthError() {
    return (res: Response) => {
      if (this.device === 'ANDROID') {
        alert('ERRORE Http: ' + res['message']);
      } else {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ERRORE Http: ', res['message']);
      }
      if (res.status === 404) {

      }
      return observableThrowError(res);
    };
  } */

  constructor(
    // private fileSaver: FileSaverService,
    private renderer: Renderer2,
    // private sessionService: SessionService,
    private apiService: ApiService,
    // private deviceService: DeviceDetectorService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private location: Location,
    private route: ActivatedRoute,
    public gest_finestre: GestioneFinestreComponent,
    private aggiustaArray: AggiunstaArrayComponent,
    public Utilities: Utils,
    private comandiVocali: ComandiVocaliComponent,
    private _matDialog: MatDialog,
    private _clipboardService: ClipboardService,
    private cdRef: ChangeDetectorRef,
    public Log: LogComponent,
    private titleService: Title,
    private platform: Platform,
    public screenShotMask: ScreenShotComponent
    // private httpAndroid: HTTP
  ) {
    // logConsole('ANDROID: ', this.platform.ANDROID);
    this.caricaLimitiDebug();
    
    // const tm = setTimeout(() => {
    //   clearTimeout(tm);
      
      this.titleService.setTitle('GeoAnalysis');
    // }, 1000);

    // alert('Start application');

    /* if (this.platform.ANDROID) {
      this.device = 'ANDROID';
    } else {
      this.device = 'WEB PAGE';
    } */
    // alert('Tipo device: ' + this.device);
    // this.mostraPopup('ppp', false, '');

    /* const tm = setTimeout(() => {
      this.effettuaScreenShotFrame();
    }, 5000); */
  }

  /* prendeJSON() {
    if (this.device === 'ANDROID') {
      const indirizzo = 'https://geoants.aubay.it:444/assets/connection.json?d=' + new Date();

      alert('JSON indirizzo Android: ' + indirizzo);

      const res = this.getJSONAndroid(indirizzo);

      this.lettoJSON(res);
    } else {
      this.getJSON().subscribe(data => {
        this.lettoJSON(data);
      });
    }
  } */

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

  menuSemplificato = false;
  
  lettoJSON(data) {
    // if (this.device === 'ANDROID') {
    //   alert('Preso json: ' + JSON.stringify(data));
    // }

    const b = data; // JSON.parse(data._body);
    
    // Nuova gestione della mail del 28/04/2026 13:16
    // Si possono mettere url assoluti oppure relativi
    // Se la urlroot è relativa assume l'indirizzo del sito
    let indirizzoCaricato =  window.location.href; // 'https://antsgraclient.ants-aubay.it/gdpsondamistral/geoantsweb/Mappe/'; //
    // logConsole('Indirizzo di base 1: ', indirizzoCaricato);
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

    logConsole('Indirizzo di base 1: ', indirizzoCaricato);
    logConsole('Indirizzo di base 2: ', urlRoot);
    Utils.urlRoot = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.urlRoot, true);
    this.Utilities.linkIcone  = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
    this.linkIcone = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
    let urlRootSenzaBarraFinale = urlRoot;
    if (urlRootSenzaBarraFinale.endsWith('/') && b.serverPostRest.startsWith(':')) {
      urlRootSenzaBarraFinale = urlRootSenzaBarraFinale.substring(0, urlRootSenzaBarraFinale.length - 1);
    }
    this.Utilities.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRootSenzaBarraFinale, b.serverPostRest, true);
    this.Utilities.serverGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.serverGEOServer, true);
    this.Utilities.indirizzoGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.serverGEOServer, true);
    if (b.eventsDisplayedRows)  {
      this.Utilities.limitPerVirtual = b.eventsDisplayedRows;
    } else {
      this.Utilities.limitPerVirtual = 60;
    }
    this.indirizzoServer = this.Utilities.serverPostRest;
    logConsole('Indirizzo urlRoot: ', Utils.urlRoot);
    logConsole('Indirizzo Icone: ', this.Utilities.linkIcone);
    logConsole('Indirizzo PostGrest: ', this.Utilities.serverPostRest);
    logConsole('Indirizzo GeoServer: ', this.Utilities.serverGEOServer);
    // Nuova gestione della mail del 28/04/2026 13:16

    const ps = new Array();
    for (let i = 1; i <= environment.quantePagine; i++) {
      const id = { ROW_ID: i, id: i, value: i + ': Page ' + i };
      ps.push(id);
    }
   
    this.generaDatiPageSelector(ps);

    this.generaDatiPageSelectorFiltrati(this.impostazioni.datiPageSelector, 'LettoJSON');

    this.eseguiConnessione();
  }

  generaDatiPageSelectorFiltrati(d, daDove) {        
    if (!d) {
      return;
    }

    let ce = false;
    d.ColumnProperty.forEach(element => {
      // // logConsole('Dps: ', element);
      if (!ce && element.key === 'OnlyName') {
        ce = true;
      }
    });
    if (!ce) {
      // // logConsole('Dps: OnlyName Mancante. Lo Aggiungo');
      this.generaDatiPageSelector(d.DataTable);
      d = JSON.parse(JSON.stringify(this.impostazioni.datiPageSelector));
    }
    this.datiPageSelectorFiltrati = undefined;
    const tm = setTimeout(() => {
      clearTimeout(tm);
      
      if (this.editMode === true)  {
        d.sort((a, b) => a.ROW_ID - b.ROW_ID);
        logConsole('Dati page selector 1', d);

        this.datiPageSelectorFiltrati = d;
        this.datiPageSelectorFiltrati.DataTable.forEach(element => {
          let soloNome = element.value;
          if (soloNome.indexOf(':') > -1) {
            soloNome = soloNome.substring(soloNome.indexOf(':') + 1, soloNome.length);
            soloNome = soloNome.trim();
          }
          element['OnlyName'] = soloNome;
        });
        this.datiPageSelectorFiltrati.DataTable.sort((a, b) => (a.OnlyName.localeCompare(b.OnlyName)));
      } else {
        const dps = {
          ColumnProperty: d.ColumnProperty,
          GridProperty: d.GridProperty,
          DataTable: new Array()          
        }
        d.DataTable.forEach(element => {
          // // logConsole(element.value, element.value.indexOf('[hidden]'));
          if (element.value.indexOf('[hidden]') === -1) {
            const agg = element;
            let soloNome = element.value;
            if (soloNome.indexOf(':') > -1) {
              soloNome = soloNome.substring(soloNome.indexOf(':') + 1, soloNome.length);
              soloNome = soloNome.trim();
            }
            agg['OnlyName'] = soloNome;
            dps.DataTable.push(element);
          }
        });
        // dps.DataTable.sort((a, b) => (a.OnlyName.localeCompare(b.OnlyName)));
        dps.DataTable.sort((a, b) => (a.ROW_ID - b.ROW_ID));
        logConsole('Dati page selector 2', dps);

        this.datiPageSelectorFiltrati = dps;
      }        
      // // logConsole('DPS: ', daDove, this.datiPageSelectorFiltrati);
    }, 100);
  }

  generaDatiPageSelector(ps) {
    let col = '[';
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "ROW_ID",';
      col += '"key": "ROW_ID",';
      col += '"hide": "false",';
      col += '"locked": "true",';
      col += '"place": "0"';
      col += '},';
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "id",';
      col += '"key": "id",';
      col += '"hide": "true",';
      col += '"locked": "true",';
      col += '"place": "0"';
      col += '},';
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "Page Name With Index",';
      col += '"key": "value",';
      col += '"hide": "true",';
      col += '"locked": "true",';
      col += '"place": "1"';
      col += '},';
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "Page Name",';
      col += '"key": "OnlyName",';
      col += '"hide": "false",';
      col += '"locked": "true",';
      col += '"place": "1"';
      col += '},';
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "Description",';
      col += '"key": "description",';
      col += '"hide": "false",';
      col += '"locked": "true",';
      col += '"place": "0"';
      col += '}';
    col += ']';
    const proprieta = [{
      GridName: 'Page Selector',
      IsFilterDisplayed: 'N',
      ShowColumnSelector: 'true',
      pageable: "true",
      reportType: 'Rep',
      rowCount: environment.quantiSottoFrames,
      ItemsPerPage: environment.quantiSottoFrames
    }];
    const strutt = {
      ColumnProperty: JSON.parse(col),
      DataTable: ps,
      GridProperty: proprieta
    };
    this.impostazioni.datiPageSelector = strutt;
    // // logConsole('dps: ', this.impostazioni.datiPageSelector);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Creato Page selector: ', strutt);
  }

  // http://localhost:4200/?par=6;129;39;42;124;111;126;127;47;72;47;50;74;72;68;119;122;74;124;75;76;125;128;128;80;127;81;131;130;86;133;92;90;86;137;95;98;95;95;101;147;100;144;150;83;94;83;86;156;164;152;165;158;92;117;92;95;176;174;175;181;100;111;100;103;187;181;169;182;175;109;134;109;112;155;197;186;185;188;130;165;187;186;187;190;124;135;124;127;196;206;210;206;132;157;132;135;179;200;216;217;207;141;152;141;144;181;195;147;172;147;150;219;215;227;235;222;156;167;158;227;240;238;237;199;238;232;233;249;168;193;168;171;254;253;257;242;176;187;178;242;254;263;262;260;184;209;184;187;270;256;265;269;190;250;210;254;196;288;226;174;47;148;26;126;158;
  eseguiConnessione() {
    this.altro = '';
    this.fromFleet = false;

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'LETTURA URL: Parametri url', params);
      let par = null;
      let daUrl = false;

      if (par === null) {
        daUrl = true;
        par = params['par'];
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'LETTURA URL: Cookie nullo, provo i parametri passati', par);
      }
      
      if (par && par !== null) {
        localStorage.removeItem('lastWorkspace');
        localStorage.setItem('lastWorkspace', par);

        let pp = ExternalUtilities.decripta(par);
        if (pp.indexOf('}') > -1) {
          pp = pp.substring(0, pp.indexOf('}') + 1);
        }
        // logConsole('QueryString:', pp);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'LETTURA URL: QueryParams:', pp);
        const param = JSON.parse(pp);
        // logConsole('Parametri', param);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'LETTURA URL: QueryParams parametri:', param);
        // return;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, param);

        if (!daUrl) {
          this.sessId = '';
        } else {
          this.sessId = param.sess;
        }
        this.gname = param.gname;
        this.userName = param.uname;
        this.maschera = param.form;
        this.fullScreen = param.FS;
        this.altro = param.altro;
        this.fromFleet = param.fromFleet ? true : false;

        logConsole('Parametri Avvio:', param);
        // alert('Workspace: ' + this.altro);
        this.titleService.setTitle(this.altro);

        // alert('From Fleet: ' + param.fromFleet);
        const dashboard = param.dashboard;
        // const dataset = param.dataset;

        this.activitySet[1] = param.actset;

        if (this.fullScreen === 'true') {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.fullScreen);
          document.documentElement.requestFullscreen();
        }

        let tempo = 500;
        if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
          tempo = 2000;
        }
    
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eseguo connessione', this.sessId, this.gname, this.uname);
        // // logConsole('PASSAGGIO PARAMETRI: ', param);

        // if (this.sessId && this.sessId !== undefined && this.sessId !== 'undefined') {
          const tm = setTimeout(() => {
            clearTimeout(tm);
            // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'C\'è sessione. Mi collego: ', this.sessId);
            this.collegatoDaUrl = true;
            const dd = { 'username': this.uname };
            this.EffettuaLogin(dd, this.sessId, this.gname, this.userName, '');
            this.aggiornaLarghezzaContenitore();
            // this.impostazioniIniziali = JSON.parse(JSON.stringify(this.impostazioni));
            // this.checkDifferenceFromStartJSON();

            this.rinfrescaTuttiIframes('Esegui Connessione');

            this.location.replaceState('/');

            if (this.altro && this.altro !== '') {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Carico workset: ', this.altro);
              const tm = setTimeout(() => {
                clearTimeout(tm);

                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CaricaDashboard: ', this.altro);
                this.caricaDashboard(this.altro, true);
              }, 1000);
              // }
            } else {
              if (dashboard && dashboard !== '') {
                // alert('1 1000');
                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Carico dashboard da url: ', dashboard);
                  this.selectDashboard(dashboard, true, 'Esegui connessione');
                }, 1000);
              } else {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nuova dashboard');
                if (!this.timeRangeDSFStart || !this.timeRangeDSFStop) {
                  const d = new Date();
                  d.setDate(d.getDate() - 7);

                  let d1 = this.datePipe.transform(d, 'yyyy-MM-dd');
                  d1 += ' 00:00:00';
                  let d2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd', 'UTC');
                  d2 += ' 20:00:00';

                  const dd1 = new Date(d1);
                  const dd2 = new Date(d2);
                  this.timeRangeDSFStart = ''; // new Date(d1);
                  this.timeRangeDSFStop = ''; // new Date(d2);
                }

                this.prendeNomeWorkspace();
              }
            }
          }, tempo);
        // } else {
        //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nessuna sessione attiva');
        // }
      }
    });
  }

  cercaAS;

  prendeNomeWorkspace() {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prende Nome workspace');

    if (!this.datiDashboard || !this.datiActivitySet) { // || this.altro) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prende Nome workspace: Esco');
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prende Nome workspace: Dati Dashboard', this.datiDashboard);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prende Nome workspace: Dati ActivitySet', this.datiActivitySet);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prende Nome workspace: Altro', this.altro);
      return;
    }

    let dash;
    if (this.datiDashboard && this.datiDashboard !== 'empty grid') {
      this.datiDashboard.forEach(element => {
        if (+element.ID === +this.dashboardSelezionata) {
          dash = element;
        }
      });
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prende dashboard:', dash, this.dashboardSelezionata);

    let dataSet;
    let c = 0;
    if (this.activitySet[1] > -1 && !this.cercaAS) {
      this.cercaAS = setInterval(() => {
        // logConsole('Controllo SET: ', this.datiActivitySet, this.activitySet[1]);
        if (this.datiActivitySet && this.datiActivitySet !== 'empty') {
          clearInterval(this.cercaAS);
          
          this.cercaAS = undefined;

          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca dataSet', this.activitySet);
    
          this.datiActivitySet.forEach(element => {
            if (+element.ID === +this.activitySet[1]) {
              dataSet = element;
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca dataSet: Trovato ', dataSet);
            }
          });
        } else {
          c++;
          if (c > 10) {
            clearInterval(this.cercaAS);
            this.cercaAS = undefined;
          }
        }
      }, 1000);
    }

    if (!dataSet || !dash) {
      return;
    }

    if (!this.nomeWorkSpace || this.nomeWorkSpace === '') {
      this.nomeWorkSpace = dash.NAME + ' DataSet: ' + dataSet.NAME;
    }
    if (!this.descWorkSpace || this.descWorkSpace === '') {
      this.descWorkSpace = dash.NAME + ' DataSet: ' + dataSet.NAME + '. Written on ' + new Date().toDateString();
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome workspace: ', this.nomeWorkSpace);
  }

  caricaDashboard(altro, vieneDaCambioWS) {
    this.dbWorkOnDashboard = true;
    
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Carico dashboard', altro);
    const params = {
      cntx_id: this.sessioneID,
      v_obj_type: 'geo_analysis',
      v_obj_name: altro
    };
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'operator__login', params);
    this.apiService.chiamataPost(this.Utilities, 'operator_obj_my__get', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if (data) {
        const ddd =  data.DataTable[0];
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'WORKSPACE: ', data);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DDD', ddd, typeof(ddd));
        let impostazioni;
        if (ddd && typeof(ddd.OBJ_JSON) === 'string') {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DDD1', ddd.OBJ_JSON);
          if (ddd.OBJ_JSON.indexOf('\"') > -1) {
            ddd.OBJ_JSON = JSON.parse(ddd.OBJ_JSON);
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DDD2', ddd.OBJ_JSON, typeof(ddd.OBJ_JSON));
          }
          if (ddd.OBJ_JSON[0].length < 2) {
            ddd.OBJ_JSON = JSON.parse(ddd.OBJ_JSON);
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DDD3', ddd.OBJ_JSON, typeof(ddd.OBJ_JSON));
          }
          // impostazioni = JSON.parse(ddd.OBJ_JSON)[0];
        } else {
        }
        impostazioni = ddd.OBJ_JSON[0];

        if (impostazioni) {
          this.nomeWorkSpace = ddd.OBJ_NAME;
          this.descWorkSpace = ddd.OBJ_DESCRIPTION;
          this.folderWorkSpace = ddd.FOLDER;

          this.cellSet = impostazioni.cellSet;
          // this.selezioneAntenne = impostazioni.cellSetRow;
  
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'MENU. Impostazioni dashboard caricate:', ddd);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'MENU. Impostazioni :', impostazioni);

          // return;
          // logConsole('Impostazioni dashboard caricate: ', impostazioni);

          // alert('3 1000 + 2000 + 1000 + 1000');
          const tm = setTimeout(() => {
            clearTimeout(tm);

            // this.titleService.setTitle(impostazioni.dashboardName);

            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Seleziono dashboard da carica dashboard: ', vieneDaCambioWS);
            // logConsole('Descrizione dashboard. Carica dashboard: ', impostazioni);
            this.selectDashboard(impostazioni.dashboardSelezionata, vieneDaCambioWS, 'Carica dashboard');

            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              let ceActSet = false;
              if (impostazioni.activitySet) {
                ceActSet = true;
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, "Select tipo activity: Carica dashboard");
                this.selectTipoActivity(1, impostazioni.activitySet, false);
              }

              const tm22 = setTimeout(() => {
                clearTimeout(tm22);
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity set impostata', impostazioni.activitySet, this.activitySet[1])

                this.impostazioni.maskVisible = impostazioni.maskVisible;

                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CD: C\'è ACTSET', ceActSet);
                if (ceActSet) {
                  this.timeRangeDSFStart = impostazioni.timeRangeDSFStart;
                  this.timeRangeDSFStop = impostazioni.timeRangeDSFStop;
                  // alert(this.timeRangeDSFStart + '-' + this.timeRangeDSFStop);
                }
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CD: Time range: ', this.timeRangeDSFStart, this.timeRangeDSFStop);

                // this.impostaSelezioneLA = impostazioni.impostaSelezioneLA;
                this.ch2 = impostazioni.ch2;
                this.bsic2 = impostazioni.bsic2;
                this.scr2 = impostazioni.scr2;
                this.pci2 = impostazioni.pci2;
                this.territory2 = impostazioni.territory2;
                this.freeText2 = impostazioni.freeText2;
                this.impostaSelezioneMeasureDFN = impostazioni.impostaSelezioneMeasureDFN;
                this.selectAdditionalLayer(impostazioni.additionalLayer);
                this.lastSelectedOfGridAntenne(this.cellSet);
                this.selectNetTech(impostazioni.netTech22);
                this.selectBandwidth(impostazioni.bandwidth22);
                this.selectTipoMappa1(impostazioni.mapTypeG);
                this.selectTipoMappeStyle(impostazioni.mapTypeS);
                this.changeStyleSize(impostazioni.styleSizeG);
                // alert('Cluster letto: ' + impostazioni.overlayClusterG);
                this.selectOverlayCluster(impostazioni.overlayClusterG);
                this.selectZoomMap(impostazioni.zoomMap);
                this.selectComboSelArea(impostazioni.comboSelArea);
                this.checkShowLegendHistogram(impostazioni.showLegendaHistogram);
                this.clickRadioTipoLegend(impostazioni.tipoLegendaIstogrammi);
                // this.Utilities.tmsSelezionatoStringa = impostazioni.tmsSelezionatoStringa;

                // Controllo esistenza valore time span nella combo
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo timespan -> ', impostazioni);
                const valoreTimeSpan = impostazioni.valoreTimeSpan;
                // logConsole('Valore time span 1: ', valoreTimeSpan);
                const dsr = JSON.parse(JSON.stringify(this.Utilities.datiActTimeSpan));
                let trovato = false;
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo timespan 1', dsr, valoreTimeSpan);
                dsr.forEach(element => {
                  if (!trovato && element.id === valoreTimeSpan) {
                    trovato = true;
                  }
                });
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo timespan 2', trovato, valoreTimeSpan);
                if (!trovato) {
                  const v = { id: valoreTimeSpan, name: valoreTimeSpan};
                  dsr.push(v);
                  dsr.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));
                }
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo timespan 3', this.Utilities.datiActTimeSpan, valoreTimeSpan);
                this.Utilities.datiActTimeSpan = undefined;
                const tm1 = setTimeout(() => {
                  clearTimeout(tm1);
                  
                  this.Utilities.datiActTimeSpan = JSON.parse(JSON.stringify(dsr));
                  this.valoreTimeSpan = +valoreTimeSpan;
                  // logConsole('Valore time span 2: ', valoreTimeSpan);
                  // alert('Imposto time span: ' + valoreTimeSpan);

                  this.Utilities.datiActTimeSpan.forEach(element => {
                    if (+valoreTimeSpan === +element.name) {
                      // alert(element.name);
                      this.valoreTimeSpan = +element.name;
                      // logConsole('Valore time span 3: ', valoreTimeSpan);
                      this.cambioDataSet = false;
                      // this.selectActivityTimeSpan(element, 'CaricaDashboard'); TOLTO 20/05/2025
                    }
                  });
                }, 1000);
                // Controllo esistenza valore time span nella combo

                // this.selectActivityTimeSpan(impostazioni.datiActTimeSpan);
            
                this.selectActivityTimeSpanRange(impostazioni.datiActTimeSpanRange);
                // this.Utilities.tmsSelezionato = impostazioni.tmsSelezionato;

                // Controllo esistenza valore time span range nella combo
                const valoreTimeSpanRange = impostazioni.valoreTimeSpanRange;
                const dsrr = JSON.parse(JSON.stringify(this.Utilities.datiActTimeSpanRange));
                trovato = false;
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo timespan range 1', dsrr);
                dsrr.forEach(element => {
                  if (!trovato && element.id === valoreTimeSpanRange) {
                    trovato = true;
                  }
                });
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo timespan range 2', trovato);
                if (!trovato) {
                  const v = { id: valoreTimeSpanRange, name: valoreTimeSpanRange};
                  dsrr.push(v);
                  dsrr.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));
                }
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo timespan range 3', this.Utilities.datiActTimeSpanRange, valoreTimeSpanRange);
                this.Utilities.datiActTimeSpanRange = undefined;
                const tm = setTimeout(() => {
                  clearTimeout(tm);

                  this.Utilities.datiActTimeSpanRange = JSON.parse(JSON.stringify(dsrr));
                  this.valoreTimeSpanRange = valoreTimeSpanRange;
                }, 100);
                // Controllo esistenza valore time span range nella combo

                this.stringaAGNoACT = impostazioni.stringaAGNoACT;
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione tmsInizio 1', impostazioni.tmsInizio);
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS FINE 8: ', impostazioni.tmsFine);
                
                /* if (this.fromFleet) {
                  this.Utilities.tmsInizio = impostazioni.timeRangeDSFStart;
                  this.Utilities.tmsFine = impostazioni.timeRangeDSFStop;
                  this.Utilities.tmsSelezionato = impostazioni.timeRangeDSFStart;
                } else {
                  this.Utilities.tmsInizio = impostazioni.tmsInizio;
                  this.Utilities.tmsFine = impostazioni.tmsFine;
                  this.Utilities.tmsSelezionato = impostazioni.tmsSelezionato;
                } */
                
                //  this.isVisibileBars = impostazioni.isVisibileBars;
                const nn = localStorage.getItem("VisibleMenues_" + this.userName);
                let n = true;
                if (nn !== null) {
                  n = (nn === 'S' ? true : false);
                }
                this.isVisibileBars = n;
                this.menuAperti = n;

                // logConsole('Impostazioni', impostazioni);
                // alert('Impostazione visibile bars: ' + this.isVisibileBars);
                this.designInfo = impostazioni.designInfo;
                this.isSyncTms = impostazioni.isSyncTms;
                this.dashboardName = impostazioni.dashboardName;
                this.dashboardFolder = impostazioni.dashboardFolder;
                this.chkUpdatePosition = impostazioni.chkUpdatePosition !== undefined ? impostazioni.chkUpdatePosition : false;
                this.timerAttivatoAuto = impostazioni.timerAttivatoAuto !== undefined ? impostazioni.timerAttivatoAuto : false;
                
                this.caricatoTimer = true;
                const tm2 = setTimeout(() => {
                  clearTimeout(tm2);

                  if (this.timerAttivatoAuto) {
                    this.attivaTimerAuto("CaricaDashboard");
                  } else {
                    this.fermaTimerAuto();
                  }                  
                }, 1000);

                /* const tm = setTimeout(() => {
                  this.routineCambioDashboard(this.dashboardSelezionata);
                }, 2000); */

                // alert(this.altro);
                this.tmsStartPassatoDaProgetto = impostazioni.timeRangeDSFStart;
                this.tmsEndPassatoDaProgetto = impostazioni.timeRangeDSFStop;

                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione tmsInizio 2', impostazioni.timeRangeDSFStart);
                // this.Utilities.tmsInizio = impostazioni.timeRangeDSFStart;
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS FINE 1: ', impostazioni.timeRangeDSFStop)
                // this.Utilities.tmsFine = impostazioni.timeRangeDSFStop;
                // AppComponent.CambioTmsSelezionato(this.Utilities, impostazioni.timeRangeDSFStart, 'Carica Dashboard', this.timerAttivatoAuto);

                this.cambioTmsSelezionatoConControlloGPS(impostazioni.timeRangeDSFStart, 'Carica Dashboard', false);
  
                // this.bbox = this.impostazioni.bboxOZ[impostazioni.frameAttivo[this.Num]][q];

                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Contenuto workspace', impostazioni);

                // logConsole('IMPOSTAZIONI', this.impostazioni);                
              }, 2000); // TEMPI MODIFICATI -> 2000
            }, 1000); // TEMPI MODIFICATI -> 1000
          }, 1000); // TEMPI MODIFICATI -> 1000
        }
      }
    }, error => {
      this.dbWorkOnDashboard = false;
    });
  }

  connettitiAMano() {
    if (!this.collegatoDaUrl) {
      let pwd = '';
      const p = localStorage.getItem('H7-25-M');
      if (p !== null) {
        pwd = p;
      } else {
        pwd = prompt("H7-25-M", "");
        if (pwd === '') {
          ExternalUtilities.visualizzaAlert('No!');
          return;
        }  else  {
          localStorage.setItem('H7-25-M', pwd);
        }
      }
      this.collegatoDaUrl = true;
      this.EffettuaLogin(null, null, null, environment.nomeLogin, pwd);
      this.aggiornaLarghezzaContenitore();
      // this.impostazioniIniziali = JSON.parse(JSON.stringify(this.impostazioni));
      // this.checkDifferenceFromStartJSON();
    } else {
      this.sessioneID = 'xxx';
    }
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

  frameVersion = '';
  gridVersion = '';
  appVersion = '';

  caricatoTimer = false;

  ngOnInit() {
    // this.avviaControlloMemoria();

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, packageJson);
    this.frameVersion = packageJson.dependencies['frame-component-lib'];
    this.frameVersion = this.frameVersion.replace('file:frame-component-lib-', '').replace('.tgz', '');
    this.gridVersion = packageJson.dependencies['ants-grid-lib'];
    this.gridVersion = this.gridVersion.replace('file:ants-grid-lib-', '').replace('.tgz', '');
    this.appVersion = packageJson['version'];
    this.caricatoTimer = false;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.frameVersion);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.gridVersion);
    // this.prendeJSON();

    const d = new Date();
    d.setDate(d.getDate() - 7);

    let d1 = this.datePipe.transform(d, 'yyyy-MM-dd');
    d1 += ' 00:00:00';
    let d2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd', 'UTC');
    d2 += ' 20:00:00';

    const dd1 = new Date(d1);
    const dd2 = new Date(d2);
    this.timeRangeDSFStart = ''; // new Date(d1);
    this.timeRangeDSFStop = ''; // new Date(d2);

    this.mapTypePerStampa = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time start - stop', d1, d2); */

    /* if (this.subscribeStart) {
      this.subscribeStart.unsubscribe();
    }
    this.subscribeStart = Observable.timer(0, 1000)
      .take(32000)
      .subscribe(() => { */
    const t = setInterval(() => {
      if (this.Utilities.serverPostRest !== '') {
        // this.subscribeStart.unsubscribe();
        clearInterval(t);

        if (this.accordionDebug === true) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.serverPostRest);
        }

        const tm = setTimeout(() => {
          clearTimeout(tm);
          const slh = null; // localStorage.getItem(this.userName + '_ShowLegendHistogram');
          if (slh !== null) {
            this.showLegendaHistogram = slh === 'S' ? true : false;
          } else {
            this.showLegendaHistogram = true;
          }

          const tl = null; // localStorage.getItem(this.userName + '_tipoLegendaIstogrammi');
          if (tl !== null) {
            this.tipoLegendaIstogrammi = tl;
          } else {
            this.tipoLegendaIstogrammi = 'TOP';
          }
        }, 100);

        this.parte();
      }
    }, 1000);
  }

  parte() {
    this.elem = document.documentElement;

    this.Utilities.dpi = this.getDpi();

    let okLs = false;
    let okAll = false;
    this.Utilities.datiTipiActivity.forEach(element => {
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
      this.Utilities.datiTipiActivity.push({ id: 0, name: environment.stringaLatestSelection });
    }
    if (okAll === false) {
      this.Utilities.datiTipiActivity.push({ id: -1, name: environment.stringaAll });
    }

    this.mappeGlobal = JSON.parse(JSON.stringify(this.Utilities.mappe))
    let okGs = false;
    this.Utilities.mappe.forEach(element => {
      if (okGs === false) {
        if (element.name === environment.stringaGlobalSettingMapStyle) {
          okGs = true;
        }
      }
    });
    if (okGs === false) {
      this.Utilities.mappe.push({ id: -1, name: environment.stringaGlobalSettingMapStyle });
    }

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onInit', this.impostazioni.frameName);
    this.csvView = new Array();

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Config.JSON:', this.impostazioni);

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

    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      this.connettitiAMano();
    }

    const ms = localStorage.getItem('squareMeters');
    // alert('MS: ' + ms);
    if (ms !== null) {
      this.squareMetersGlobale = ms;
    }      
    this.staPartendo = false;

    const tm = setTimeout(() => {
      clearTimeout(tm);
      // // logConsole('Detach cdref');

      this.cdRef.detach();
    }, 5000);
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

        if (nome && uno !== due) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Differenze in ', nome, uno, due);
          this.differenzeDiImpostazioni = true;
        }
      }
    }
  }

  checkDifferenceFromStartJSON() {
    this.differenzeDiImpostazioni = false;

    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (this.impostazioni === undefined || this.impostazioniIniziali === undefined) {
        return;
      }

      /* // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo differenze fra impostazioni');
      const uno = JSON.stringify(this.impostazioniIniziali);
      const due = JSON.stringify(this.impostazioni);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(uno), JSON.parse(due));
      if (uno !== due) {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, uno, due);
        this.differenzeDiImpostazioni = true;
      } else {
        this.differenzeDiImpostazioni = false;
      } */

      // this.dimensioniJSON = '';
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
      this.checkStrings('geoFilter', this.impostazioni.geoFilter, this.impostazioniIniziali.geoFilter);
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
      this.checkStrings('checkSeverity', this.impostazioni.checkSeverity, this.impostazioniIniziali.checkSeverity);
      this.checkStrings('viewAs', this.impostazioni.viewAs, this.impostazioniIniziali.viewAs);
      this.checkStrings('overlay', this.impostazioni.overlay, this.impostazioniIniziali.overlay);
      this.checkStrings('overlayCluster', this.impostazioni.overlayCluster, this.impostazioniIniziali.overlayCluster);
      this.checkStrings('timeFilter', this.impostazioni.timeFilter, this.impostazioniIniziali.timeFilter);
      this.checkStrings('bboxOZ', this.impostazioni.bboxOZ, this.impostazioniIniziali.bboxOZ);
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
      this.checkStrings('listaCampiTCRP', this.impostazioni.listaCampiTCRP, this.impostazioniIniziali.listaCampiTCRP);
      this.checkStrings('dimensioniSplitTcRun', this.impostazioni.dimensioniSplitTcRun, this.impostazioniIniziali.dimensioniSplitTcRun);
      this.checkStrings('impostazioniPivot', this.impostazioni.impostazioniPivotGrid, this.impostazioniIniziali.impostazioniPivotGrid);
      this.checkStrings('tipoDatiLayout', this.impostazioni.tipoDatiLayout, this.impostazioniIniziali.tipoDatiLayout);
      this.checkStrings('flowTypeMS', this.impostazioni.flowTypeMS, this.impostazioniIniziali.flowTypeMS);
      this.checkStrings('viewModeMS', this.impostazioni.viewModeMS, this.impostazioniIniziali.viewModeMS);
      this.checkStrings('showAdditionalLayers', this.impostazioni.showAdditionalLayers, this.impostazioniIniziali.showAdditionalLayers);
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
      /* this.checkStrings('filtroEventiEscluso', this.impostazioni.filtroEventiEscluso, this.impostazioniIniziali.filtroEventiEscluso);
      this.checkStrings('filtroEventiCol1', this.impostazioni.filtroEventiCol1, this.impostazioniIniziali.filtroEventiCol1);
      this.checkStrings('filtroEventiCol2', this.impostazioni.filtroEventiCol2, this.impostazioniIniziali.filtroEventiCol2);
      this.checkStrings('filtroEventiCol3', this.impostazioni.filtroEventiCol3, this.impostazioniIniziali.filtroEventiCol3);
      this.checkStrings('filtroEventiCol4', this.impostazioni.filtroEventiCol4, this.impostazioniIniziali.filtroEventiCol4);
      this.checkStrings('filtroEventiCol5', this.impostazioni.filtroEventiCol5, this.impostazioniIniziali.filtroEventiCol5);
      this.checkStrings('filtroEventiCol6', this.impostazioni.filtroEventiCol6, this.impostazioniIniziali.filtroEventiCol6);
      this.checkStrings('filtroEventiCol7', this.impostazioni.filtroEventiCol7, this.impostazioniIniziali.filtroEventiCol7);
      this.checkStrings('filtroEventiCol8', this.impostazioni.filtroEventiCol8, this.impostazioniIniziali.filtroEventiCol8);
      this.checkStrings('filtroEventiCol9', this.impostazioni.filtroEventiCol9, this.impostazioniIniziali.filtroEventiCol9);
      this.checkStrings('filtroEventiCol10', this.impostazioni.filtroEventiCol10, this.impostazioniIniziali.filtroEventiCol10);
      this.checkStrings('filtroEventiCol11', this.impostazioni.filtroEventiCol11, this.impostazioniIniziali.filtroEventiCol11);
      this.checkStrings('filtroEventiCol12', this.impostazioni.filtroEventiCol12, this.impostazioniIniziali.filtroEventiCol12);
      this.checkStrings('filtroEventiCol13', this.impostazioni.filtroEventiCol13, this.impostazioniIniziali.filtroEventiCol13);
      this.checkStrings('filtroEventiCol14', this.impostazioni.filtroEventiCol14, this.impostazioniIniziali.filtroEventiCol14);
      this.checkStrings('filtroEventiCol15', this.impostazioni.filtroEventiCol15, this.impostazioniIniziali.filtroEventiCol15);
      this.checkStrings('filtroEventiCol16', this.impostazioni.filtroEventiCol16, this.impostazioniIniziali.filtroEventiCol16);
      this.checkStrings('filtroEventiCol17', this.impostazioni.filtroEventiCol17, this.impostazioniIniziali.filtroEventiCol17);
      this.checkStrings('filtroEventiCol18', this.impostazioni.filtroEventiCol18, this.impostazioniIniziali.filtroEventiCol18);
      this.checkStrings('filtroEventiCol19', this.impostazioni.filtroEventiCol19, this.impostazioniIniziali.filtroEventiCol19);
      this.checkStrings('filtroEventiCol20', this.impostazioni.filtroEventiCol20, this.impostazioniIniziali.filtroEventiCol20); */
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
      this.checkStrings('sartPosition', this.impostazioni.sartPosition, this.impostazioniIniziali.sartPosition);
      this.checkStrings('measureSMS', this.impostazioni.measureSMS, this.impostazioniIniziali.measureSMS);
      this.checkStrings('showMeasuresS', this.impostazioni.showMeasuresS, this.impostazioniIniziali.showMeasuresS);
      this.checkStrings('tipoDataset', this.impostazioni.tipoDataset, this.impostazioniIniziali.tipoDataset);
      // this.checkStrings('nascoste123', this.impostazioni.nascoste123, this.impostazioniIniziali.nascoste123);
      // this.checkStrings('framesPinnati', this.impostazioni.framesPinnati, this.impostazioniIniziali.framesPinnati);
      this.checkStrings('MappeMS', this.impostazioni.mappeMS, this.impostazioniIniziali.mappeMS);
      this.checkStrings('ClusterMeasure', this.impostazioni.clusterMeasure, this.impostazioniIniziali.clusterMeasure);
      this.checkStrings('ClusterMeasure2', this.impostazioni.clusterMeasure2, this.impostazioniIniziali.clusterMeasure2);
      // this.checkStrings('Lov', this.impostazioni.lov, this.impostazioniIniziali.lov);
      this.checkStrings('TextFilter', this.impostazioni.textFilter, this.impostazioniIniziali.textFilter);
      this.checkStrings('TextFilter2', this.impostazioni.textFilter2, this.impostazioniIniziali.textFilter2);
      // this.checkStrings('TextLov', this.impostazioni.textLov, this.impostazioniIniziali.textLov);
      this.checkStrings('AddGlobalLayer', this.impostazioni.addGlobalLayer, this.impostazioniIniziali.addGlobalLayer);
      this.checkStrings('Measure RCM', this.impostazioni.measureRCM, this.impostazioniIniziali.measureRCM);
      this.checkStrings('TipoMisuraGlobale', this.impostazioni.tipoMisuraGlobale, this.impostazioniIniziali.tipoMisuraGlobale);
      this.checkStrings('TipoMisuraGlobaleArfcn', this.impostazioni.tipoMisuraGlobaleArfcn, this.impostazioniIniziali.tipoMisuraGlobaleArfcn);
      this.checkStrings('Show Rays All Layer', this.impostazioni.showRaysAllLayer, this.impostazioniIniziali.showRaysAllLayer);
      this.checkStrings('Correlation', this.impostazioni.correlation, this.impostazioniIniziali.correlation);
      this.checkStrings('misureAddizionaliTCRUN', this.impostazioni.misureAddizionaliTCRUN, this.impostazioniIniziali.misureAddizionaliTCRUN);
      this.checkStrings('heightChart', this.impostazioni.heightChart, this.impostazioniIniziali.heightChart);
      this.checkStrings('listToPrint', this.impostazioni.listToPrint, this.impostazioniIniziali.listToPrint);

      if (!this.impostazioni.dimensioni) {
        this.impostazioni.dimensioni = new Array();
        this.impostazioniIniziali.dimensioni = new Array();
        for (let i = 0; i <= environment.quantiSottoFrames; i++) {
          this.impostazioniIniziali.dimensioni.push({
            PrimaRiga: [33, 34, 33],
            SecondaRiga: [33, 34, 33],
            TerzaRiga: [33, 34, 33],
            Orizzontale: [33, 34, 33]
          });
          this.impostazioni.dimensioni.push({
            PrimaRiga: [33, 34, 33],
            SecondaRiga: [33, 34, 33],
            TerzaRiga: [33, 34, 33],
            Orizzontale: [33, 34, 33]
          });
        }
      }
      if (this.pageSelector > -1) {
        if (this.impostazioni.dimensioni[this.pageSelector] && this.impostazioniIniziali.dimensioni[this.pageSelector] && this.impostazioni.dimensioni[this.pageSelector].PrimaRiga && this.impostazioniIniziali.dimensioni[this.pageSelector].PrimaRiga) {
          this.checkStrings('Dimensioni Riga 1', this.impostazioni.dimensioni[this.pageSelector].PrimaRiga, this.impostazioniIniziali.dimensioni[this.pageSelector].PrimaRiga);
        }
        if (this.impostazioni.dimensioni[this.pageSelector] && this.impostazioniIniziali.dimensioni[this.pageSelector] && this.impostazioni.dimensioni[this.pageSelector].SecondaRiga && this.impostazioniIniziali.dimensioni[this.pageSelector].SecondaRiga) {
          this.checkStrings('Dimensioni Riga 2', this.impostazioni.dimensioni.SecondaRiga, this.impostazioniIniziali.dimensioni.SecondaRiga);
        }
        if (this.impostazioni.dimensioni[this.pageSelector] && this.impostazioniIniziali.dimensioni[this.pageSelector] && this.impostazioni.dimensioni[this.pageSelector].TerzaRiga && this.impostazioniIniziali.dimensioni[this.pageSelector].TerzaRiga) {
          this.checkStrings('Dimensioni Riga 3', this.impostazioni.dimensioni[this.pageSelector].TerzaRiga, this.impostazioniIniziali.dimensioni[this.pageSelector].TerzaRiga);
        }
        if (this.impostazioni.dimensioni[this.pageSelector] && this.impostazioniIniziali.dimensioni[this.pageSelector] && this.impostazioni.dimensioni[this.pageSelector].Orizzontale && this.impostazioniIniziali.dimensioni[this.pageSelector].Orizzontale) {
          this.checkStrings('Dimensioni Riga Orizz', this.impostazioni.dimensioni[this.pageSelector].Orizzontale, this.impostazioniIniziali.dimensioni[this.pageSelector].Orizzontale);
        }

        /*
        MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.occhioCheckato, this.impostazioni.occhioCheckato.length);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioniIniziali.occhioCheckato);
        if (!this.impostazioni.occhioCheckato || this.impostazioni.occhioCheckato.length === 0) {
          this.impostazioni.occhioCheckato = new Array();
          this.impostazioniIniziali.occhioCheckato = new Array();
          for (let i = 0; i <= environment.quantiSottoFrames; i++) {
            this.impostazioniIniziali.occhioCheckato.push(false);
            this.impostazioni.occhioCheckato.push(false);
          }
        }
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.occhioCheckato);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioniIniziali.occhioCheckato);
        this.checkStrings('Check Occhio', this.impostazioni.occhioCheckato[this.pageSelector], this.impostazioniIniziali.occhioCheckato[this.pageSelector]);
        MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
        */
      }

    }, 1000);
  }

  ngOnChanges(c) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onChanges Main:', c);
  }

  chiudiHeader() {
    if (this.impostazioni.heightOfHeader > 0) {
      this.impostazioni.heightOfHeader = 0;
      this.impostazioni.heightOfFrames = 100;
    } else {
      this.impostazioni.heightOfHeader = this.heightOfHeaderApp;
      this.impostazioni.heightOfFrames = this.heightOfFramesApp;
    }

    this.rinfrescaTuttiIframes('Chiudi Header');
  }

  refreshActivity(t) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh Activity da Activity Manager', this.activitySelezionataDaPassare);
    // if (t) {

      this.LeggeDatiFolders(false, -1);
      this.LeggeActivitySetPR();
      this.LeggeActivityGroupPR();
    // }
  }

  refreshDashboard(t) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh dashboard in APP', this.dashboardSelezionata, t);
    if (t) {
      logConsole('Refresh dashboard', t);

      this.descrizioneDashboard = t.description;
      this.dashboardSelected2.DESCRIPTION = t.description;
      
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
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto dashboard selezionata 3');
      // logConsole('Select dashboard 6:', 0);
      this.dashboardSelezionata = 0;
      logConsole('Dati dashboard 5', t);
      if (t.folder) {
        // this.LeggeDashboard();
        this.dashboardFolder = t.folder;
        this.dashboardName = t.name;
        this.dashboardGroupName = t.group_name;
        this.dashboardOperator = t.operator_name;
        this.dashboardSelectedDescription = t.description;
        this.showTimeCursor = t.showTimeCursor;
        // logConsole('Descrizione dashboard 1:', this.dashboardSelectedDescription, t);
        if (this.dashboardSelectedDescription === null) { this.dashboardSelectedDescription = ''; };
      }

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rileggo dashboard');
      this.LeggeDashboardPR();

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto dashboard selezionata 4', appo);
        // logConsole('Select dashboard 7:', appo);
        this.dashboardSelezionata = appo;
        // this.dashboardSelezionata = t.ID;
        // this.forzaSelezioneDashboard = JSON.parse(t.ID);
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.forzaSelezioneDashboard);
        if (t === true) {
          let n = 0;
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiDashboard);
          logConsole('Dati dashboard 1', this.datiDashboard);
          this.datiDashboard.forEach(element => {
            if (this.dashboardSelezionata === element.id) {
              this.dashboardFolder = element.folder;
              this.dashboardName = element.name;
              this.dashboardGroupName = element.group_name;
              this.dashboardOperator = element.operator_name;
              this.dashboardSelectedDescription = element.description;
              // this.showTimeCursor = element.showTimeCursor;
              // logConsole('Descrizione dashboard 2:', this.dashboardSelectedDescription, element);
              if (this.dashboardSelectedDescription === null) { this.dashboardSelectedDescription = ''; };

              this.resizeFrame[n] = new Date().toString();
            }
            n++;
          });
        }
      }, 1000);
    }
  }

  aggiornaSize(n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DragEnd12', e);
    // let conta = 0;
    // if (this.impostazioni.maskVisible[n] === true) {
      // const x = Math.round(e.sizes[conta]);
      // if (x !== this.impostazioni.maskSize[n]) {
        // this.impostazioni.maskSize[n] = x;
        // this.gest_finestre.memorizzaSizeApp(this, n, x);
        this.refreshMap[n] = !this.refreshMap[n];
      // }
      // conta++;
    // }
    // if (this.impostazioni.maskVisible[n + 1] === true) {
      // const x = Math.round(e.sizes[conta]);
      // if (x !== this.impostazioni.maskSize[n + 1]) {
        // this.impostazioni.maskSize[n + 1] = x;
        // this.gest_finestre.memorizzaSizeApp(this, n + 1, x);
        this.refreshMap[n + 1] = !this.refreshMap[n + 1];
      // }
      // conta++;
    // }
    // if (this.impostazioni.maskVisible[n + 2] === true) {
      // const x = Math.round(e.sizes[conta]);
      // if (x !== this.impostazioni.maskSize[n + 2]) {
        // this.impostazioni.maskSize[n + 2] = x;
        // this.gest_finestre.memorizzaSizeApp(this, n + 2, x);
        this.refreshMap[n + 2] = !this.refreshMap[n + 2];
      // }
    // }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refreshati frame', this.refreshMap);
    // if (!this.differenzeDiImpostazioni) { this.differenzeDiImpostazioni = true; } */
    // this.rinfrescaTuttiIframes();
  }

  gestioneSpostamentoSoloAllaFineDelMovimentoDelMouse = true;
  intervalloSpostamentoSplitter;
  ultimoValore;

  dragEnd(quale, e) {
    if (this.gestioneSpostamentoSoloAllaFineDelMovimentoDelMouse) {
      // let newZoom = view.getZoom();
      if (!this.intervalloSpostamentoSplitter) {
        let c = 0;
        this.intervalloSpostamentoSplitter = setInterval(() => {
          if (JSON.stringify(e) === this.ultimoValore) {
            this.agisceDrag(quale, e);
          } else {
            this.ultimoValore = JSON.stringify(e);
            c++;
            if (c > 10) {
            this.agisceDrag(quale, e);
            }
          }
        }, 50);
      }
    } else {
      this.agisceDrag(quale, e);
    }
  }

  agisceDrag(quale, e) {
    if (this.intervalloSpostamentoSplitter) {
      clearInterval(this.intervalloSpostamentoSplitter);
      this.intervalloSpostamentoSplitter = undefined;
    }

    logConsole('Spostamento splitter', quale, e);

    switch (quale) {
      case 1:
        this.dragEnd12(e);
        break;
      case 2:
        this.dragEnd34(e);
        break;
      case 3:
        this.dragEnd56(e);
        break;
      case 4:
        this.dragEndHor(e);

        /* if (e.sizes[0] === 0) {
          this.chiudeFrame(1);
          this.chiudeFrame(2);
          this.chiudeFrame(3);
        } else {
          if (e.sizes[1] === 0) {
            this.chiudeFrame(4);
            this.chiudeFrame(5);
            this.chiudeFrame(6);
          } else {
            if (e.sizes[2] === 0) {
              this.chiudeFrame(7);
              this.chiudeFrame(8);
              this.chiudeFrame(9);
            }
          }
        } */
        break;
    }
  }

  dragEnd12(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '12', e.sizes);
    if (!this.impostazioni.dimensioni[this.pageSelector]) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisco dimensioni 12');
      this.impostazioni.dimensioni[this.pageSelector] = { PrimaRiga: [33, 34, 33], SecondaRiga: [33, 34, 33], TerzaRiga: [33, 34, 33], Orizzontale: [33, 34, 33]};
    }
    const vecchie = this.impostazioni.dimensioni[this.pageSelector].PrimaRiga;

    this.impostazioni.dimensioni[this.pageSelector].PrimaRiga = e.sizes;
    this.impostazioni.maskSize[this.pageSelector][1] = e.sizes[0];
    this.impostazioni.maskSize[this.pageSelector][2] = e.sizes[1];
    this.impostazioni.maskSize[this.pageSelector][3] = e.sizes[2];
    
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '12', this.impostazioni.maskSize[this.pageSelector]);

    let i = 0;
    vecchie.forEach(element => {
      if (e.sizes[i] > 0 && +element !== +e.sizes[i]) {
        this.refreshMap[1 + i] = !this.refreshMap[1 + i];
        this.resizeFrame[1 + i] = new Date().toString();
      }
      i++;
    });
    // this.aggiornaSize(1, e);
  }

  dragEnd34(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '34', e.sizes);
    if (!this.impostazioni.dimensioni[this.pageSelector]) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisco dimensioni 34');
      this.impostazioni.dimensioni[this.pageSelector] = { PrimaRiga: [33, 34, 33], SecondaRiga: [33, 34, 33], TerzaRiga: [33, 34, 33], Orizzontale: [33, 34, 33]};
    }
    const vecchie = this.impostazioni.dimensioni[this.pageSelector].SecondaRiga;

    this.impostazioni.dimensioni[this.pageSelector].SecondaRiga = e.sizes;
    this.impostazioni.maskSize[this.pageSelector][4] = e.sizes[0];
    this.impostazioni.maskSize[this.pageSelector][5] = e.sizes[1];
    this.impostazioni.maskSize[this.pageSelector][6] = e.sizes[2];

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '34', this.impostazioni.maskSize[this.pageSelector]);

    let i = 0;
    vecchie.forEach(element => {
      if (e.sizes[i] > 0 && +element !== +e.sizes[i]) {
        this.refreshMap[4 + i] = !this.refreshMap[4 + i];
        this.resizeFrame[4 + i] = new Date().toString();
      }
      i++;
    });

    // this.aggiornaSize(4, e);
  }

  dragEnd56(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '56', e.sizes);
    if (!this.impostazioni.dimensioni[this.pageSelector]) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisco dimensioni 56');
      this.impostazioni.dimensioni[this.pageSelector] = { PrimaRiga: [33, 34, 33], SecondaRiga: [33, 34, 33], TerzaRiga: [33, 34, 33], Orizzontale: [33, 34, 33]};
    }
    const vecchie = this.impostazioni.dimensioni[this.pageSelector].TerzaRiga;

    this.impostazioni.dimensioni[this.pageSelector].TerzaRiga = e.sizes;
    this.impostazioni.maskSize[this.pageSelector][7] = e.sizes[0];
    this.impostazioni.maskSize[this.pageSelector][8] = e.sizes[1];
    this.impostazioni.maskSize[this.pageSelector][9] = e.sizes[2];
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '56', this.impostazioni.maskSize[this.pageSelector]);

    let i = 0;
    vecchie.forEach(element => {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confronto', i, element, e.sizes[i]);
      if (e.sizes[i] > 0 && +element !== +e.sizes[i]) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rinfresco', i);
        this.refreshMap[7 + i] = !this.refreshMap[7 + i];
        this.resizeFrame[7 + i] = new Date().toString();
      }
      i++;
    });

    // this.aggiornaSize(7, e);
  }

  dragEndHor(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Hor', e, e.sizes);
    if (!this.impostazioni.dimensioni[this.pageSelector]) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisco dimensioni Hor');
      this.impostazioni.dimensioni[this.pageSelector] = { PrimaRiga: [33, 34, 33], SecondaRiga: [33, 34, 33], TerzaRiga: [33, 34, 33], Orizzontale: [33, 34, 33]};
    }
    const vecchie = this.impostazioni.dimensioni[this.pageSelector].Orizzontale;

    this.impostazioni.dimensioni[this.pageSelector].Orizzontale = e.sizes;
    // alert('HOR 0');
    this.impostazioni.maskSizeHor[this.pageSelector][1] = e.sizes[0];
    this.impostazioni.maskSizeHor[this.pageSelector][2] = e.sizes[1];
    this.impostazioni.maskSizeHor[this.pageSelector][3] = e.sizes[2];

    logConsole('Impostazioni drag orizzontale', this.pageSelector, this.impostazioni.maskSizeHor[this.pageSelector]);

    if (e.gutterNum === 1) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno prime due righe');
      this.refreshMap[1] = !this.refreshMap[1];
      this.refreshMap[2] = !this.refreshMap[2];
      this.refreshMap[3] = !this.refreshMap[3];
      this.refreshMap[4] = !this.refreshMap[4];
      this.refreshMap[5] = !this.refreshMap[5];
      this.refreshMap[6] = !this.refreshMap[6];

      this.resizeFrame[1] = new Date().toString();
      this.resizeFrame[2] = new Date().toString();
      this.resizeFrame[3] = new Date().toString();
      this.resizeFrame[4] = new Date().toString();
      this.resizeFrame[5] = new Date().toString();
      this.resizeFrame[6] = new Date().toString();
    }
    if (e.gutterNum === 2) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno ultime due righe');
      this.refreshMap[4] = !this.refreshMap[4];
      this.refreshMap[5] = !this.refreshMap[5];
      this.refreshMap[6] = !this.refreshMap[6];
      this.refreshMap[7] = !this.refreshMap[7];
      this.refreshMap[8] = !this.refreshMap[8];
      this.refreshMap[9] = !this.refreshMap[9];

      this.resizeFrame[4] = new Date().toString();
      this.resizeFrame[5] = new Date().toString();
      this.resizeFrame[6] = new Date().toString();
      this.resizeFrame[7] = new Date().toString();
      this.resizeFrame[8] = new Date().toString();
      this.resizeFrame[9] = new Date().toString();
    }
    // if (this.impostazioni.maskSizeHor !== undefined) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DragEndHor', e);
    // this.gest_finestre.refreshMaschere(this, e.sizes[1], e.sizes[2], e.sizes[3]);
  }

  impostaValoriDefault() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta valori di default');
    const tm = setTimeout(() => {
      clearTimeout(tm);
      // this.pareto.pulisceValoriDiAppoggio(this);

      this.Utilities.layerPath = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureGrafici, undefined);

      this.Utilities.maxTipiHistogram = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 0);
      // this.Utilities.rangeSelezionato = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.Utilities.dimensioniFrames = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.Utilities.dimensioniFramesModif = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.Utilities.puntoSelezionato = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, null);
      // this.Utilities.lastCallPointCellMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallLegenda = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPath = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPath2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPath3 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPath4 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallPathSC = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallCrossTab = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallCrossTabMenoUno = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallCrossTabMenoDue = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallTrace = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallTrace2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.Utilities.lastCallAntenne = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.Utilities.lastRangeEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, null);
      this.Utilities.lastRangeCells = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, null);
      this.Utilities.lastRangeCDRData = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, null);
      this.Utilities.lastRangeCDRVoice = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, null);
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
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.altezzaGraficiHistogram[9][2]);

      // this.Utilities.quantiGraficiTCCiSono = this.Utilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureGrafici, 0);
      // this.Utilities.quantiGraficiHICiSono = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureHistogram, 0);
      // this.Utilities.quantiGraficiPACiSono = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisurePareto, 0);
      // this.Utilities.quantiGraficiSCCiSono = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureScatter, 0);

      // his.Utilities.tipiApp = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, this.Utilities.quanteMisureGrafici);
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

      /* this.Utilities.measureDaDisegnare = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
          environment.quantiFrames, this.Utilities.quanteMisureGrafici);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.measureDaDisegnare[2][3]);
      this.Utilities.measureDaDisegnareScatter = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
        environment.quantiFrames, this.Utilities.quanteMisureScatter);
      this.Utilities.measureDaDisegnareHistogram = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
        environment.quantiFrames, this.Utilities.quanteMisureHistogram); */
      // this.Utilities.measureDaDisegnarePareto = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
      //   environment.quantiFrames, this.Utilities.quanteMisurePareto);

      /* for (let i = 0; i <= environment.quantiSottoFrames; i++) {
        for (let k = 0; k <= environment.quantiFrames; k++) {
          for (let z = 0; z <= 5; z++) {
            this.Utilities.measureDaDisegnareHistogram[i][k].push('');
          }
        }
      } */
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.measureDaDisegnareHistogram);

      this.Utilities.ultimaVoltaHistogram = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 0);

      // this.Utilities.contatoreGraficiPareto = this.Utilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureGrafici, 0);
      // this.Utilities.contatoreGraficiScatter = this.Utilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureGrafici, 0);
      // this.Utilities.quantoContatoreGraficiScatter = this.Utilities.creaMatrice(environment.quantiFrames, this.Utilities.quanteMisureGrafici, 0);
      // this.Utilities.lastCallGrafici = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, environment.quantiFrames);
      // this.Utilities.lastCallMeasures = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, environment.quantiFrames);
      // this.Utilities.lastCallGraficoEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.Utilities.csvApp = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, environment.quantiFrames);

      this.Utilities.axisXMaxMin = ExternalUtilities.creaMatriceMisure(environment.quantiFrames, this.Utilities.quanteMisureGrafici, this.Utilities.quanteMisureGrafici);

      // this.pareto.pulisceValoriDiAppoggio(this);

      for (let i = 0; i < 10; i++) {
        this.Utilities.maxTipiHistogram.push(0);
      }

      const md = localStorage.getItem('ModalitaDebug');
      if (md !== null) {
        this.debug2 = (md === 'S' ? true : false);
      } else {
        this.debug2 = false;
      }

      const mapGlobal = null; // localStorage.getItem('MapGlobalContext');
      if (mapGlobal !== null) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Map style cookie', mapStyle);
        this.mapTypeG = +mapGlobal;
      } else {
        this.mapTypeG = 1;
      }

      const mapStyle = null; // localStorage.getItem('MapStyleContext');
      if (mapStyle !== null) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Map style cookie', mapStyle);
        this.mapTypeS = +mapStyle;
      } else {
        this.mapTypeS = 1;
      }

      const styleSize = null; // localStorage.getItem('StyleSizeContext');
      if (styleSize !== null) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Map style cookie', mapStyle);
        this.styleSizeG = +styleSize;
      } else {
        this.styleSizeG = 12;
      }

      const z = null; // localStorage.getItem('ZoomContext');
      if (z !== null) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Map style cookie', mapStyle);
        this.zoomMap = z;
      } else {
        this.zoomMap = 2;
      }

      const sa = null; // localStorage.getItem('SelectAreaContext');
      if (sa !== null) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Map style cookie', mapStyle);
        this.comboSelArea = sa;
      } else {
        this.comboSelArea = 2;
      }

      // this.refreshMaschera = [false, false, false, false, false, false, false, false, false, false, false];
      this.impostazioni.frameName = ExternalUtilities.creaMatrice(environment.quantiFrames, environment.quantiSottoFrames, '<empty>');
      // this.impostazioni.titoloFrame = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 'Title ***CONT***');
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TITOLO FRAME', this.impostazioni.titoloFrame);
      //  ['', 'Title 1', 'Title 2', 'Title 3', 'Title 4', 'Title 5', 'Title 6', 'Title 7', 'Title 8', 'Title 9', 'Title 10'];
      this.impostazioni.frameDesc = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.maskVisible = [[true, true, true, true, true, true, true, true, true, true], [true, true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true, true],[true, true, true, true, true, true, true, true, true, true],
        [true, true, true, true, true, true, true, true, true, true]];
      this.impostazioni.bandwidth = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.countHistogram = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.checkSeverity = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.mapType = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 9999);
      this.impostazioni.tipoMappa = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.MappaOGrafico = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '--');
      this.impostazioni.overviewZoom = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.barraAperta = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.currZoom = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.maximized =  [false, false, false, false, false, false, false, false, false, false, false];
      this.impostazioni.isCheckedServingCell = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.isCheckedShowPaths = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.isCheckedShowSelectedPaths = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.isCheckedAntenne = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.isStandAloneMR = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.isNonSyncEventTime = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.showAxisX = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.misureAddizionaliTCRUN = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, ['', '', '', '']);
      this.impostazioni.heightChart = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 'X1');
      this.impostazioni.measure = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames, this.Utilities.quanteMisure);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.measure);
      this.slaValue = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.impostazioni.activity = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.geoFilter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.netTech = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.shownEvents = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.modificaChart = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.doNotSetGM = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.plmn = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.activityName = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.activitySet = [-1, -1, -1, -1, -1];
      this.impostazioni.listaEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '')
      // this.impostazioni.layerMappa = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.impostazioni.tabSelezionato = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 0);
      this.impostazioni.maskSize = [[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34], [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],[33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34],
        [33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34]
        ];
      this.impostazioni.slaName = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.tipoMappeCaricate = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      this.impostazioni.viewAs = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 2);
      this.impostazioni.overlay = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.overlayCluster = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '<Global Cluster>');
      this.impostazioni.timeFilter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 2);
      this.impostazioni.bboxOZ = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.viewDefinition = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.maskDisabledH1 = false;

      // this.viewOlG = ExternalUtilities.creaMatriceView(environment.quantiSottoFrames, environment.quantiFrames);
      // this.viewOlL = ExternalUtilities.creaMatriceView(environment.quantiSottoFrames, environment.quantiFrames);
      // const coord = [ 12.4963655, 41.9027835 ];
      const coord = [ 0, 0 ];
      for (let i = 0; i < environment.quantiFrames; i++) { this.centroAttuale[i] = fromLonLat(coord); }

      this.impostazioni.histDisplayAs = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames,
            this.Utilities.quanteMisureHistogram);
      this.impostazioni.histDisplayTutto = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames, environment.quantiFrames,
          this.Utilities.quanteMisureHistogram);
      this.impostazioni.columnsBars = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '2');
      this.impostazioni.doubleGraph = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.listaCampiTCRP = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.dimensioniSplitTcRun = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.impostazioniPivotGrid = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.flowTypeMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.viewModeMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.tipoDatiLayout = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 3);
      this.impostazioni.showAdditionalLayers = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
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
      this.impostazioni.eventiSceltiES = undefined; // ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.eventiSceltiGlobaliES = undefined; // ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.fixedSeconds = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames,
        undefined);
      this.impostazioni.filtriEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      /* this.impostazioni.filtroEventiEscluso = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol1 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol3 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol4 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol5 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol6 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol7 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol8 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol9 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol10 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol11 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol12 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol13 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol14 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol15 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol16 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol17 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol18 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol19 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.filtroEventiCol20 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, ''); */
      this.impostazioni.opacity = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames,
        '');
      this.impostazioni.showRays = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, undefined);
      this.impostazioni.showMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.showVoiceCallMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.showDataMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.showCoverageMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.squareMeters = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.impostazioni.measureType = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 1);
      this.impostazioni.mosaicStyle = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.sartPosition = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.measureSMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.showMeasuresS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.tipoDataset = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 2);
      this.impostazioni.mappeMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 1);
      this.impostazioni.clusterMeasure = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.clusterMeasure2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.impostazioni.lov = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.textFilter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.textFilter2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      // this.impostazioni.textLov = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.addGlobalLayer = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
      this.impostazioni.measureRCM = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
      this.impostazioni.showRaysAllLayer = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, true);
      this.impostazioni.correlation = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
      this.impostazioni.tipoMisuraGlobale = -1;
      this.impostazioni.tipoMisuraGlobaleArfcn = -1;

      const nn = localStorage.getItem("VisibleMenues_" + this.userName);
      let n = true;
      if (nn !== null) {
        n = (nn === 'S' ? true : false);
      }
      this.isVisibileBars = n;
      this.menuAperti = n;

      // this.impostazioniIniziali = JSON.parse(JSON.stringify(this.impostazioni));
      this.impostazioniDefault = JSON.parse(JSON.stringify(this.impostazioni));

      /* let d = new Date();
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Inizio Test conversione', d);
      const t1 = this.Utilities.testConversioneDA(JSON.stringify(this.impostazioni));
      d = new Date();
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fine Test conversione', d, t1.length);
      const t2 = this.Utilities.testConversioneA(t1);
      d = new Date();
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno alla normalità', d, t2.length);
      if (JSON.stringify(this.impostazioni) !== t2) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Diverso', JSON.stringify(this.impostazioni).length, t2.length);
      } else {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Uguale');
      }
      d = new Date();
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fine', d); */
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PLMN 1', this.impostazioni.plmn);

    }, 100);
  }

  @HostListener('window:resize')
  public detectResize(): void {
    // logConsole('ANDROID: ', this.platform.ANDROID);

    const x = this.divCont.nativeElement.offsetWidth;
    const y = this.divCont.nativeElement.offsetHeight;

    this.dimeX = x;
    this.dimeY = y;
    // alert (x +'-'+y);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dimensione x schermo: ', x);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dimensione y schermo: ', y);

    if (x <= 1200) {
      this.timestampVisibile = false;
    } else {
      this.timestampVisibile = true;
    }

    if (x <= 650) {
      this.schermoStretto = true;
    } else {
      this.schermoStretto = false;
    }
  }

  ngAfterViewInit() {
    this.detectResize();

    this.impostaValoriDefault();

    if (!this.split12) { return; }
    /* this.split12.dragEnd.subscribe(x => {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 1, 2, x);

      // RIMETTERE. SISTEMAZIONE LAYOUT
      // this.Utilities.dimensioniFramesModif[1] = x.sizes[0];
      // this.Utilities.dimensioniFramesModif[2] = x.sizes[1];
      // this.Utilities.dimensioniFramesModif[3] = x.sizes[2];
      // RIMETTERE. SISTEMAZIONE LAYOUT

      this.impostazioni.maskSize[this.pageSelector][1] = x.sizes[0];
      this.impostazioni.maskSize[this.pageSelector][2] = x.sizes[1];
      this.impostazioni.maskSize[this.pageSelector][3] = x.sizes[2];

      // this.gest_finestre.memorizzaSizeApp(this, 1, x);

      // if (!this.differenzeDiImpostazioni) { this.differenzeDiImpostazioni = true; }
      this.Utilities.dimensioniFramesModif = JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.pageSelector]));

      this.refreshMaschera[1] = !this.refreshMaschera[1];
      this.refreshMaschera[2] = !this.refreshMaschera[2];
      this.refreshMaschera[3] = !this.refreshMaschera[3];

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize);
    });
    this.split34.dragEnd.subscribe(x => {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 3, 4, x);

      // RIMETTERE. SISTEMAZIONE LAYOUT
      // this.Utilities.dimensioniFramesModif[4] = x.sizes[0];
      // this.Utilities.dimensioniFramesModif[5] = x.sizes[1];
      // this.Utilities.dimensioniFramesModif[6] = x.sizes[2];
      // RIMETTERE. SISTEMAZIONE LAYOUT

      this.impostazioni.maskSize[this.pageSelector][4] = x.sizes[0];
      this.impostazioni.maskSize[this.pageSelector][5] = x.sizes[1];
      this.impostazioni.maskSize[this.pageSelector][6] = x.sizes[2];

      this.Utilities.dimensioniFramesModif = JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.pageSelector]));

      this.refreshMaschera[4] = !this.refreshMaschera[4];
      this.refreshMaschera[5] = !this.refreshMaschera[5];
      this.refreshMaschera[6] = !this.refreshMaschera[6];

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize);
    });
    this.split56.dragEnd.subscribe(x => {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 5, 6, x);
      // RIMETTERE. SISTEMAZIONE LAYOUT
      // this.Utilities.dimensioniFramesModif[7] = x.sizes[0];
      // this.Utilities.dimensioniFramesModif[8] = x.sizes[1];
      // this.Utilities.dimensioniFramesModif[9] = x.sizes[2];
      // RIMETTERE. SISTEMAZIONE LAYOUT

      this.impostazioni.maskSize[this.pageSelector][7] = x.sizes[0];
      this.impostazioni.maskSize[this.pageSelector][8] = x.sizes[1];
      this.impostazioni.maskSize[this.pageSelector][9] = x.sizes[2];

      this.Utilities.dimensioniFramesModif = JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.pageSelector]));

      this.refreshMaschera[7] = !this.refreshMaschera[7];
      this.refreshMaschera[8] = !this.refreshMaschera[8];
      this.refreshMaschera[9] = !this.refreshMaschera[9];

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize);
    });
    this.splitVertical.dragEnd.subscribe(x => {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vertical', x.sizes);

      this.impostazioni.maskSizeHor[this.pageSelector][1] = x.sizes[0];
      this.impostazioni.maskSizeHor[this.pageSelector][2] = x.sizes[1];
      this.impostazioni.maskSizeHor[this.pageSelector][3] = x.sizes[2];

      this.refreshMaschera[1] = !this.refreshMaschera[1];
      this.refreshMaschera[2] = !this.refreshMaschera[2];
      this.refreshMaschera[3] = !this.refreshMaschera[3];

      this.refreshMaschera[4] = !this.refreshMaschera[4];
      this.refreshMaschera[5] = !this.refreshMaschera[5];
      this.refreshMaschera[6] = !this.refreshMaschera[6];

      this.refreshMaschera[7] = !this.refreshMaschera[7];
      this.refreshMaschera[8] = !this.refreshMaschera[8];
      this.refreshMaschera[9] = !this.refreshMaschera[9];
    }); */
  }

  LeggeMeasuresPR() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_measure_dfn__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      ExternalUtilities.checkRitornoChiamata(Utils, data2);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cluster group:', data);
        this.measureData = data.DataTable;

        this.clusterGroup = new Array();
        this.measureData.forEach(element => {
          if (element.FOLDER === '5 Cluster') {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element.FOLDER);
            this.clusterGroup.push(element);
          }
        });
        this.clusterGroup2 = JSON.parse(JSON.stringify(this.clusterGroup));
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cluster group:', this.clusterGroup2);

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

        const o = null; // localStorage.getItem('OverlayContext');
        if (o !== null) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Overlaycookie', o);
          this.overlayClusterG = o;
        } else {
          this.overlayClusterG = '';
        }

        /* const valCluster = localStorage.getItem(this.userName + '_Cluster_G_sel');
        if (valCluster !== null) {
          const ultimoValoreCluster = valCluster.replace('"', '').replace('"', '');
          if (ultimoValoreCluster && ultimoValoreCluster !== null) {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ultimo valore cluster', ultimoValoreCluster);
            this.clusterGroup2.forEach(element => {
              if (element.CODE === ultimoValoreCluster) {
                this.overlayClusterG =  element; // .CODE;
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ultimo valore cluster rilevato', element);
              }
            });
          }
        } */

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLUSTERS:', this.clusterGroup2);
     } else {
        this.measureData = 'empty grid'; // null;
      }

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricateMeasures = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Read Measures:' + error);
    });
  }

  LeggeDatiMosaicStyle() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "mosaic_style"' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
        this.datiMosaicStyle = data;
     } else {
        this.datiMosaicStyle = 'empty grid'; // null;
      }

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatiMosaicStyle = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Read look up:' + error);
    });
  }

  LeggeDatiFoldersWS() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "geo_analysis"' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
        this.datiFoldersWS = data.DataTable;
     } else {
        this.datiFoldersWS = 'empty grid'; // null;
      }

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatiFoldersWS = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Read look up:' + error);
    });
  }

  LeggeDatiLookUp() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_category": "cell_type"' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      ExternalUtilities.checkRitornoChiamata(Utils, data2);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
        this.datiLookUp = data;
     } else {
        this.datiLookUp = 'empty grid'; // null;
      }

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatiLookUp = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Read look up:' + error);
    });
  }

  LeggeDatiAddLayers() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_category": "MapLayer"' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      ExternalUtilities.checkRitornoChiamata(Utils, data2);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        this.datiAddLayers = data;
        const a = new Array();
        this.datiAddLayers.DataTable.forEach(element => {
          if (element.VALUE_STR.indexOf('GLOBAL') === -1) {
            a.push(element);
          }
        });
        this.datiAddLayers2 = a;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Additional layer:', this.datiAddLayers2);
      } else {
        this.datiAddLayers = 'empty grid'; // null;
        this.datiAddLayers2 = 'empty grid'; // null;
      }

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatiAddLayers = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Read look up:' + error);
    });
  }

  LeggeDatiFolders(apreMascheraActivity, q) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo dati folders');
    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_category": "ActSetFolder"' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      ExternalUtilities.checkRitornoChiamata(Utils, data2);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        const dd = {
          ColumnProperty: null,
          DataTable: new Array(),
          GridProperty: null
        }
        this.datiFolders = dd;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Folders:', data);
        /* const d = {
          CATEGORY: 'ActFolder',
          CODE: 0,
          DESCRIPTION: '',
          ROW_ID: 1,
          VALUE_STR: '<ALL>'
        }; */
        this.datiFolders.ColumnProperty = JSON.parse(JSON.stringify(data.ColumnProperty));
        this.datiFolders.GridProperty = JSON.parse(JSON.stringify(data.GridProperty));
        // this.datiFolders.DataTable.push(d);
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
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorna activity da passare 1');
          this.activitySelezionataDaPassare = '';
          const tm = setTimeout(() => {
            clearTimeout(tm);
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
              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity selezionata', this.activitySelezionataDaPassare);
              this.activityComponentShowed = true;
            }
          }, 100);
        } else {
          /* // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorna activity da passare 2');
          const app = this.activitySelezionataDaPassare;
          this.activitySelezionataDaPassare = '';
          const tm = setTimeout(() => {
            this.activitySelezionataDaPassare = app;
          }, 1000); */
        }
     } else {
        this.datiFolders = 'empty grid'; // null;
      }
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Read look up:' + error);
    });
  }

  /* LeggeEventiPR() {
    // this.datiDiProvaTree = this.CreateTree();
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera ' + this.NumeroFrame);

    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost('geo_event_dfn__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        const data = JSON.parse(data2); // [0].geo_event_dfn__grid);
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS data:', data.DataTable);
        this.datiEventiDaMettere = data;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Struttura di base', data);
        this.Utilities.strutturaGrigliaDiBase = data;
     } else {
        this.datiEventiDaMettere = 'empty grid';
      }
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  } */

  LeggeActivitySetPR() {
    this.datiActivitySet = 'empty';
    this.pulisceFiltroActSet[1] = !this.pulisceFiltroActSet[1];

    this.prendeNomeWorkspace();

    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.caricataComboActivitSet = true;
    }, 500);

    return;

    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_filter_folder": "<RECENT>"' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_act_set__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data2);
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(Utils, data2);

        const data = data2; // [0].geo_act_set__grid);
      // if (data === undefined) { data = null; }
      // if (data.RESULT && data.RESULT[0].message.toUpperCase() === 'OK') {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities', data.DataTable);
        this.datiActivitySet = data.DataTable;
        this.pulisceFiltroActSet[1] = !this.pulisceFiltroActSet[1];
        this.pulisceFiltroActSet[2] = !this.pulisceFiltroActSet[2];
        this.pulisceFiltroActSet[3] = !this.pulisceFiltroActSet[3];
        this.pulisceFiltroActSet[4] = !this.pulisceFiltroActSet[4];
      } else {
        // ExternalUtilities.messaggioDiErroreEsterno(this, data.RESULT[0].message);
        this.datiActivitySet = 'empty';
        this.pulisceFiltroActSet[1] = !this.pulisceFiltroActSet[1];
        this.pulisceFiltroActSet[2] = !this.pulisceFiltroActSet[2];
        this.pulisceFiltroActSet[3] = !this.pulisceFiltroActSet[3];
        this.pulisceFiltroActSet[4] = !this.pulisceFiltroActSet[4];
      }

      this.prendeNomeWorkspace();

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricataComboActivitSet = true;
      }, 500);
    }, error => {
        console.warn(error);
    });
  }

  ultimaActivitySelezionata = '';
  
  selectTipoActivity(n, e, vieneDaHTML) {
    if (e.NAME === this.ultimaActivitySelezionata) {
      return;
    }
    this.ultimaActivitySelezionata = e.NAME;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Selezione combo activity', n, e, vieneDaHTML);
    if (e === '***') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Pulita la combo');
      this.stringaAGNoACT = '';
    }
    if (e && typeof(e) === 'string' && e.indexOf('***') > -1) {
      return;
    }

    // let nuovoValore = false;

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezionata activity set:', n, e, this.activitySet[n]);
    if (e && e != null) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Valore passato all\'activityset', e, typeof(e));
      let nomeDaRicercare = '';
      let modo = 'string';
      if (e && e !== '' && e !== null) {
        if (typeof(e) === 'object') {
          if (e.NAME) {
            nomeDaRicercare = e.NAME;
          }
        } else {
          if (typeof(e) === 'string') {
            nomeDaRicercare = e;
          } else {
            if (typeof(e) === 'number') {
              nomeDaRicercare = e.toString();
              modo = 'number';
            }
          }
        }
      }
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Nome da ricercare: ', nomeDaRicercare);
      if (nomeDaRicercare !== '') {
        let ok = false;
        if (this.datiActivitySet && this.datiActivitySet !== 'empty') {
          this.datiActivitySet.forEach(element => {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element, nomeDaRicercare);
            if (!ok) {
              if (modo === 'string') {
                if (element.NAME === nomeDaRicercare) {
                  // logConsole('cambio activity forzato 1.5:', element);
                  ok = true;
                }
              } else {
                if (element.ID === +nomeDaRicercare) {
                  // logConsole('cambio activity forzato 1.7:', element);
                  e = element;
                  ok = true;
                }
              }
            }
          });
        }
        if (!ok) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Riga NON trovata nella combo', nomeDaRicercare);
          if (modo === 'string') {
            // logConsole('cambio activity forzato 2:', nomeDaRicercare);

            this.checkDataSet(n, nomeDaRicercare , true);
          } else {
            // logConsole('cambio activity forzato 3:', nomeDaRicercare);

            this.checkDataSet(n, +nomeDaRicercare , true);
          }
        } else {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Riga trovata nella combo', nomeDaRicercare);

          // logConsole('cambio activity forzato 4:',n , e, vieneDaHTML);

          this.prosegueGestioneActivitySet(n, e, vieneDaHTML);
        }
      } else {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulita la combo');
        // this.stringaAGNoACT = '';

        // logConsole('cambio activity forzato 5:',n, e, vieneDaHTML);

        this.prosegueGestioneActivitySet(n, e, vieneDaHTML);
      }
    } else {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulita la combo');
      // this.stringaAGNoACT = '';
    }
  }

  ultimoNomeSet;

  prosegueGestioneActivitySet(n, e, vieneDaHTML) {
    let eee;

    if (e !== 'empty') {
      /* if (e.indexOf('***') > -1) {
        nuovoValore = true;
        e = e.replace('***', '').trim();
      } */
      if (typeof(e) === 'string') {
        if (e.indexOf('{') > -1 && e.indexOf('}') > -1) {
          eee = ExternalUtilities.converteStringaInJSON(e);
        } else {
          eee = e;
        }
      } else {
        eee = e;
      }
    } else {
      eee = '';
    }

    if (!eee || eee === '') {
      console.error('Nome activity non valido', n, e);
      return;
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Cambio activity set: Nome Activity: ', n, e, eee, vieneDaHTML);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity frame:' + n, e, typeof(eee));
      let ee;
      if (e === 'empty') {
        // logConsole('cambio activity forzato 6:', e);

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Cambio activity set: Nome Activity vuota. Viene da html ', vieneDaHTML);
        this.activitySelezionataA[n] = '';
        this.activitySet[n] = -1;
        this.activitySetName[n] = 'empty';
        this.listaActivitySets[n] = ee;
        this.listaActivitySets = JSON.parse(JSON.stringify(this.listaActivitySets));
        // logConsole('Activity set 3', 'pulisco');
        this.nomeActivitySet = '';
        this.act_set_originale = '';
        this.ricaricaReport = new Date().toString();
        ee = 'empty';
      } else {
        if (typeof(eee) !== 'object' && typeof(eee) !== 'string') {
          ee = JSON.parse(eee);
        } else {
          ee = eee;
        }
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity frame:' + n, ee);

        // ee = this.Utilities.ritornaRigaTotaleDaDescrizioneCombo(e, this.datiActivitySet, 'NAME');
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity frame ' + n, ee, this.impostazioni.activity);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Cambio activity set: Nome Activity ' + ee.NAME + '. Viene da html ', vieneDaHTML);

        // logConsole('cambio activity forzato 7:', '1:', e, '2:', ee);

        // alert('Cambio activity set: Nome Activity ' + ee.NAME + '. Viene da html ' + vieneDaHTML);

        if (ee !== null) {
          this.activitySelezionataA[n] = ee;
          this.activitySet[n] = ee.ID;
          this.activitySetName[n] = ee;
          // logConsole('Activity set 4', ee);
          this.nomeActivitySet = ee;
          this.act_set_originale = ee.NAME;
          this.ricaricaReport = new Date().toString();

          // for (let f = 1; f <= environment.quantiSottoFrames; f++) {
            this.listaActivitySets[n] = ee;
          // }
          this.listaActivitySets = JSON.parse(JSON.stringify(this.listaActivitySets));
        } else {
          // logConsole('cambio activity forzato 7-0: ee === null');
          return;
        }
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.listaActivitySets);
      }

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity 1:', this.activitySelezionataA);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity 2:', this.activitySet);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity 3:', this.activitySetName);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numero activity impostate:', this.impostazioni.activity);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi activity impostate:', this.activitySet);

      // logConsole('cambio activity forzato 7-1:', this.ultimoNomeSet, ee.NAME);

      this.nomeSet1 = ee.NAME; // this.prendeNomeSET1(this.activitySet[1]);
      if (this.ultimoNomeSet === ee.NAME) {
        return;
      }
      this.ultimoNomeSet = ee.NAME;
      // alert(this.nomeSet1);

      /* if (!this.nomeSet1 || this.nomeSet1 === '') {
        console.error('Prende nome set non valido', this.nomeSet1, this.activitySet[1]);
        return;
      } */
  
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activitySetName[1]);

      // logConsole('cambio activity forzato 8:', ee);

      for (let f = 1; f <= environment.quantiSottoFrames; f++) {
        this.impostaNomiActivity(f, n, ee);
      }

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numero activity impostate 2:', this.impostazioni.activity);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi activity impostate 2:', this.activitySetName);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.sceltaActivityDaSet);

      // this.calcolaCentro = !this.calcolaCentro;
      this.Utilities.ActivitySetDelPuntoClickato = ee.NAME; // this.nomeSet1;
      this.Utilities.ActivitySetDelPuntoClickatoPerScritta = this.Utilities.ActivitySetDelPuntoClickato;

      this.datiActTimeSpanAppoggio = undefined;
      // this.valoreTimeSpan = -9999;
      // this.leggeActivityDaSet(n, ee.ID);

      if (vieneDaHTML || (!vieneDaHTML && (!this.timeRangeDSFStart || !this.timeRangeDSFStop)) || this.clickDaActSetPerCambioActivity === true) {
        this.clickDaActSetPerCambioActivity = false;
        
        const params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: ee.NAME // this.nomeSet1
        };
        this.apiService.chiamataPost(this.Utilities, 'geo_act_set_bounds__sel', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          let dataBuono;
          if (data) {
            if (data[0]) {
              dataBuono = data[0];
            } else {
              if (data) {
                dataBuono = data;
              }
            }
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su act: ', dataBuono);
            if (dataBuono) {
              /*const lat = dataBuono.lat_min + ((dataBuono.lat_max - dataBuono.lat_min) / 2);
              const lng = dataBuono.lng_min + ((dataBuono.lng_max - dataBuono.lng_min) / 2);
              this.coordinateConClick = [lng, lat, -1];
              "11.274650856164836,44.46219246558342,11.435409933075924,44.54456755402696" */
              const tm2 = setTimeout(() => {
                clearTimeout(tm2);

                this.quadratoMappa = dataBuono.lng_min + ',' + dataBuono.lat_min + ',' + dataBuono.lng_max + ',' + dataBuono.lat_max + ',CAMBIOACTSET';
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio coordinate', this.quadratoMappa);
  
                // if (dataBuono.start_tms && dataBuono.start_tms !== null) {

                this.Utilities.posizioneActivity = ';' + dataBuono.lat_min.toString() + ';' +
                  dataBuono.lng_min.toString() + ';' + dataBuono.lat_max.toString() + ';' +
                  dataBuono.lng_max.toString() + ';' +
                  new Date().getTime();
                // alert('Bounds impostata: ' + this.Utilities.posizioneActivity);

                let tmsStart;
                if (dataBuono.start_tms) {
                  tmsStart = dataBuono.start_tms; 
                }
                // alert('1-' + dataBuono.start_tms + ' (' + this.tmsStartPassatoDaProgetto + ') -> ' + tmsStart);
                // alert('From fleet:' + this.fromFleet);
                if (this.fromFleet === true || this.fromFleet === 'true') {
                  if (this.tmsStartPassatoDaProgetto) {
                    tmsStart = JSON.parse(JSON.stringify(this.tmsStartPassatoDaProgetto));
                    this.tmsStartPassatoDaProgetto = undefined;
                    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity set: TMS Start da progetto', tmsStart);
                  }
                }

                let tmsEnd;
                if (dataBuono.end_tms) {
                  tmsEnd = dataBuono.end_tms;
                }
                if (this.fromFleet === true || this.fromFleet === 'true') {
                  if (this.tmsEndPassatoDaProgetto) {
                    tmsEnd = JSON.parse(JSON.stringify(this.tmsEndPassatoDaProgetto));
                    this.tmsEndPassatoDaProgetto = undefined;
                    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity set: TMS End da progetto', tmsEnd);
                  }
                }

                // alert('TMS START: ' + tmsStart + ' - TMS END: ' + tmsEnd);

                if (tmsStart) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity set: TMS Bounds', tmsStart);
                  // this.timeRangeDSFStart = this.datePipe.transform(dataBuono.start_tms, 'yyyy-MM-dd HH:mm:ss.SSS');

                  /* if (this.fromFleet) {
                    this.timeRangeDSFStart = this.datePipe.transform(tmsStart, 'yyyy-MM-dd HH:mm:ss');
                  } else { */
                    this.timeRangeDSFStart = this.datePipe.transform(tmsStart, 'yyyy-MM-dd HH:mm:ss.SSS');
                  // }

                  // this.Utilities.tmsInizio = this.datePipe.transform(dataBuono.start_tms, 'yyyy-MM-dd HH:mm:ss');
                  // logConsole('TMS INIZIO 1', this.datePipe.transform(tmsStart, 'yyyy-MM-dd HH:mm:ss'));
                  this.Utilities.tmsInizio = this.datePipe.transform(tmsStart, 'yyyy-MM-dd HH:mm:ss');
                  // const sel = new Date(dataBuono.start_tms).getTime() + 1000;
                  const sel = new Date(tmsStart).getTime() + 1000;
                  
                  this.Utilities.tmsSelezionato = this.datePipe.transform(sel, 'yyyy-MM-dd HH:mm:ss');
                  // this.Utilities.tmsSelezionatoStringa = this.datePipe.transform(sel, 'yyyy-MM-dd HH:mm:ss');
                }
                
                // if (dataBuono.end_tms && dataBuono.end_tms !== null) {
                if (tmsEnd) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity set: END TMS Bounds', tmsEnd);
                  // this.timeRangeDSFStop = this.datePipe.transform(dataBuono.end_tms, 'yyyy-MM-dd HH:mm:ss.SSS');

                  /* if (this.fromFleet) {
                    this.timeRangeDSFStop = this.datePipe.transform(tmsEnd, 'yyyy-MM-dd HH:mm:ss');
                  } else { */
                    this.timeRangeDSFStop = this.datePipe.transform(tmsEnd, 'yyyy-MM-dd HH:mm:ss.SSS');
                  // }

                  // const sel = new Date(dataBuono.end_tms).getTime();
                  const sel = new Date(tmsEnd).getTime();
                  // logConsole('TMS FINE 1', this.datePipe.transform(sel, 'yyyy-MM-dd HH:mm:ss'));
                  this.Utilities.tmsFine = this.datePipe.transform(sel, 'yyyy-MM-dd HH:mm:ss');
                }

                this.fromFleet = false;

                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity set: TMS Start', this.Utilities.tmsInizio);
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity set: TMS Fine', this.Utilities.tmsFine);
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity set: TMS Selez', this.Utilities.tmsSelezionato);

                // const rInizio = new Date(dataBuono.start_tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00');
                // const rFine = new Date(dataBuono.end_tms.replace('T', ' ').replace('Z', ' ') + ' UTC+00');            
                const rInizio = new Date(tmsStart.replace('T', ' ').replace('Z', ' ') + ' UTC+00');
                const rFine = new Date(tmsEnd.replace('T', ' ').replace('Z', ' ') + ' UTC+00');

                // this.Utilities.range = (rFine.getTime() - rInizio.getTime()) / 2;
                const timeSpan = (rFine.getTime() - rInizio.getTime()) / 2;

                this.stringaAGNoACT = dataBuono.agn_code;
                // alert(this.stringaAGNoACT);

                // if (this.Utilities.range) {
                // if (timeSpan) {
                  const tm1 = setTimeout(() => {
                    clearTimeout(tm1);

                    ExternalUtilities.aggiornaTmsStringa(ee[1], this.Utilities, 'Imposta time range 2');
                  }, 10);

                  // logConsole('cambio activity forzato 9:', ee);

                  this.Utilities.clickSuCV = true;
                  this.cambioDataSet = true;
                  this.controlloTimeRangeProsegue('Cambio Set', timeSpan / 1000);
                  const tm = setTimeout(() => {
                    clearTimeout(tm);
                    
                    if (dataBuono && dataBuono !== null) {
                      const qq = [+dataBuono.lng_min, +dataBuono.lat_min, +dataBuono.lng_max, +dataBuono.lat_max];
                      this.bbox = { frame: 0, valori: qq };
                      let qq2 = qq;
                      if (qq[0] < 200) {
                        qq2 = transformExtent(qq, 'EPSG:4326', 'EPSG:3857');
                      }
                      ExternalUtilities.bboxImpostataNelFrame = qq2;
                      // alert('Bound set: ' + JSON.stringify(qq2));

                      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto BBOX su prosegue gestione act set', qq);
                    }

                    this.cambioDataSet = false;
                  }, 5000);
                // }
              
                this.prosegueGestioneActivitySet2();
              }, 1000);
            }
          } else {
            console.error('Problemi nel caricamento della geo_act_set_bounds__sel: ', params);
          }
        });
    } else {
      /* if (!this.timeRangeDSFStart || !this.timeRangeDSFStop) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CD: Time range non valido', ee.NAME);
      } */
      this.prosegueGestioneActivitySet2();
    }
    // }
  }

  prosegueGestioneActivitySet2() {
    // AppComponent.CambioTmsSelezionato(this.Utilities, 0, 'Select Tipo Activity', this.timerAttivatoAuto);

    // logConsole('cambio activity forzato 10');

    this.cambioTmsSelezionatoConControlloGPS(0, 'Select Tipo Activity', false);

    this.checkDifferenceFromStartJSON();
    this.rinfrescaTuttiIframes('Prosegue Gestione ACTSet 2');

    if (this.caricamentoEVenti === false) {
      // alert('Ricaricamento eventi');
      this.disegnaEventi();
    }

    this.resetPosition();
    /* const tm = setTimeout(() => {
      this.leggeBounds();
      // const tm = setTimeout(() => {
      ///////   this.resetPosition();
      // }, 1000);
    }, 1000); */
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activitySet);

    /* let q = 0;
    const oraI = this.timeRangeDSFStart;
    const oraF = this.timeRangeDSFStop;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity set: tms attuale inizio: ', oraI, oraF);
    const t = setInterval(() => {
      if (this.timeRangeDSFStart !== oraI || this.timeRangeDSFStop !== oraF) {
        clearInterval(t);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity set: tms attuale partenza: ', oraI, oraF);

        this.LeggeActivities2();

        this.disegnaEventi();
      } else {
        q++;
        if (q > 4) {
          clearInterval(t);
          this.LeggeActivities2();

          this.disegnaEventi();
        }
      }
    }, 1000); */

    // logConsole('cambio activity forzato 11');

    this.LeggeActivities2();

    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.disegnaEventi();
    }, 1000);

    // logConsole('cambio activity forzato 12');

    this.prendeNomeWorkspace();
  }

  selectTipoMappa1(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Combo tipo mappa:', e);
    if (e && e !== 'empty') {
        const ee = ExternalUtilities.converteStringaInJSON(e);
        // const ee = this.Utilities.ritornaRigaTotaleDaDescrizioneCombo(e, this.mappeGlobal, 'name');
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo mappa:', ee);
        // localStorage.setItem('MapGlobalContext', ee.id);

        this.mapTypeG = ee.id;
        this.impostazioni.mapTypeG = ee;
    }
    this.checkDifferenceFromStartJSON();
  }

  checkValuePath(event: any) {
  }

  checkValueAntenne(event: any) {
  }

  checkValueVisibileBars(e) {
    // this.checkDifferenceFromStartJSON();
    setTimeout(() => {
      // this.impostazioni.isVisibileBars = e;
      this.isVisibileBars = e;
      this.menuAperti = e;

      localStorage.setItem("VisibleMenues_" + this.userName, e ? 'S' : 'N');
      // logConsole('Cambiato isVisibileBars', e);
    }, 100);
  }

  checkModalitaDebug(e) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      localStorage.setItem('ModalitaDebug', this.debug2 === true ? 'S' : 'N');
    }, 100);
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

  rinfrescaTuttiIframes(daDove) {
    // logConsole('Rinfresca tutti i frames', daDove);
    // alert('Refresh 1');
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rinfresca tutti i frames');
    for (let i = 1; i <= environment.quantiFrames; i++) {
      this.refreshMap[i] = !this.refreshMap[i];
    }
  }

  refreshaDaTasto() {
    for (let i = 1; i <= environment.quantiFrames; i++) {
      this.refreshDaTasto[i] = !this.refreshDaTasto[i];
    }
    this.refreshExclIncl = false;

    this.refreshActivities(null, false);
  }

  stateChangeOnTree(e) {
    // ExternalUtilities.messaggioDiErroreEsterno(this, e);
  }

  login(username, password, rememberme) {
    this.sessioneID = undefined;
    // if (this.infoSistema.ceCordova === false && environment.production === true) {
    /* if (environment.production === true) {
      // alert('Error: no sessionID found');
      this.mostraPopup('Error: no sessionID found', false, '');
      return;
    } */

    const params = {
      v_name: username,
      v_password: password,
      v_client_public_ip: '',
      v_city: '',
      v_client_country: '',
      v_org: ''
    };
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'operator__login', params);
    this.apiService.chiamataPost(this.Utilities, 'operator__login', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'LOGIN:', data);
      if (data) {
        if (data.err_code !== 0) {
          const rr = data.failure_reason;
        } else {
          this.loginOK(environment.nomeLogin ,data.cntx_id, '');
        }
      } else {
        alert('No return for login');
      }
    }, error => {
      // alert('Errore durante la login: ' + JSON.stringify(error);
    });
  }

  EffettuaLogin(dd, sessionId, groupName, userName, password) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Effettua login:', userName, password);

    /* if (sessionId && sessionId !== '') {
      this.groupName = groupName;
      this.loginOK(dd, sessionId, groupName);
    } else { */
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Login con credenziali interne', sessionId, userName);
      // return;
    if (sessionId && sessionId !== '') {
      this.userName = userName;
      this.loginOK(dd, sessionId, '');
    } else {
      if (userName !== '') {
        this.login(userName, password, '');
      } else {
        let pwd = '';
        const p = localStorage.getItem('H7-25-M');
        if (p !== null) {
          pwd = p;
        } else {
          pwd = prompt("H7-25", "");
          if (pwd === '') {
            ExternalUtilities.visualizzaAlert('No!');
            return;
          }  else  {
            localStorage.setItem('H7-25-M', pwd);
          }
        }

        this.login(environment.nomeLogin, pwd, '');
      }
    }
    return;

      const params = {
        cntx_id: sessionId
      }
      this.apiService.chiamataPost(this.Utilities, 'operator_info_my__grid', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data) {
            // ExternalUtilities.checkRitornoChiamata(Utils, data);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data);

            data.DataTable.forEach(element => {
              switch(element.name) {
                /* case 'string_to_command':
                  this.microfonoAttivo = (element.VALUE === 'Y' ? true : false);
                  // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Microfono attivo:', element, this.microfonoAttivo);
                  break;
                case 'login_page_url':
                  this.Utilities.userRedirect = element.value;
                  // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
                  // alert(element.value);
                  break; */
                case 'operator_group_name':
                  this.groupName = element.value;
                  break;
              }
            });

            /*
            // const dd2 = data.OBJECT[0].object;
            const rr = data.err_code;

            if (rr === 0) {
              this.userName = userName;
              this.loginOK(data, data.cntx_id, '');
            } else {
              ExternalUtilities.messaggioDiErroreEsterno(this, 'Connection error:' + data.v_failure_reason);
            }
          } else {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nessun dato ritornato dal login:', data); */
          }
      }, error =>  {
        ExternalUtilities.messaggioDiErroreEsterno(this, 'Login:' + error);
      // TODO alert error
      });
    // }
  }

  pulisciPassword() {
    localStorage.removeItem('H7-25-M');
    ExternalUtilities.visualizzaAlert('OK');
  }

  loginOK(dd, sessionId, groupName) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Login Ok:', dd);

    // this.sessionService.setRemember(true);
    // this.sessionService.setUser(dd);
    // this.sessionService.setToken(sessionId);
    // this.sessionService.setLogged(true);
    // this.groupName = groupName;

    this.sessioneID = sessionId;
    ExternalUtilities.sessione = sessionId;

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sessione impostata', ExternalUtilities.sessione);

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo simbolici');
    this.prendeTutteLeMisure();
    this.LeggeAttivazioneActSet();
    this.LeggeSimbolici();
    this.LeggeImpostazioni();

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome utente collegato', this.userName);

    if (this.userName === '') {
      this.userName = 'DebugUser';
    }
    localStorage.setItem(this.userName + '_last_page', 'Mappe');
    localStorage.setItem(this.userName + '_last_form', this.maschera);
    localStorage.setItem(this.userName + '_last_full_screen', this.fullScreen);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, dd, this.userName, this.Utilities.permessoFrameEditor);
    this.disegnaMeasureDFN();
    this.disegnaEventi();

    const params2 = {
      cntx_id: sessionId
    }
    this.apiService.chiamataPost(this.Utilities, 'operator_info_my__grid', params2)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data);
          // ExternalUtilities.checkRitornoChiamata(Utils, data);

          data.DataTable.forEach(element => {
            switch(element.NAME) {
              case "geo_dashboard_context_menu_simplified":
                // alert(element.VALUE);
                if (element.VALUE === 'N') {
                  this.menuSemplificato = false;
                } else {
                  this.menuSemplificato = true;
                }
                break;
              case 'operator_id':
                this.operatorID = element.VALUE;
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Operator ID: ', this.operatorID);
                break;
              case 'operator_group_name':
                this.groupName = element.value;
                break;
            }
          });
        }
      });
  }

  LeggeImpostazioni() {
    this.Utilities.permessoFrameEditor = 'false';
    this.frameEditorAttivo = false;
    this.exportKML = false;
    this.accordionDebug = false;
    const permessiDataView = new Array();

    const params = {
      cntx_id: this.sessioneID
    }
    this.apiService.chiamataPost(this.Utilities, 'operator_info_my__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
        if (data) {
          ExternalUtilities.checkRitornoChiamata(Utils, data);

          this.accordionDebug = false;
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Operator info my grid', data.DataTable);
          data.DataTable.forEach(element => {
            switch (element.NAME) {
              case 'operator_group_name':
                this.groupName = element.VALUE;
                break;
              case 'login_page_url':
                this.Utilities.userRedirect = element.VALUE;
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redirect', element);
                break;
              case 'antsgeo_act_path_cell3d_kml':
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato', element);
                this.exportKML = element.VALUE === 'Y' ? true : false;
                break;
              case 'geo_dashboard__upd':
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato', element);
                this.accordionDebug = element.VALUE === 'Y' ? true : false;
                this.editModeActive = element.VALUE === 'Y' ? true : false;
                break;
              case 'string_to_command':
                this.microfonoAttivo = (element.VALUE === 'Y' ? true : false);
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Microfono attivo:', element, this.microfonoAttivo);
                break;
              case 'operator_id':
                this.operatorID = element.VALUE;
                break;
              case 'geo_dashboard__frame_editor':
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato', element);
                this.Utilities.permessoFrameEditor = element.VALUE === 'Y' ? 'true' : 'false';
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
              case 'data_view_AR':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AR"});
                }
                break;
              case 'data_view_AP':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AP"});
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
              case 'data_view_MG':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MG"});
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
              case 'data_view_XX':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "XX"});
                }
                break;
            }
          });

          this.permessiDataView = permessiDataView;
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PERMESSI DATA VIEW', this.permessiDataView);
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Permesso frame editor:', this.Utilities.permessoFrameEditor);
        }
    }, error =>  {
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Login:' + error);
    // TODO alert error
    });
  }

  LeggeAttivazioneActSet() {
    const params = {
      cntx_id: this.sessioneID,
      v_operator_profile_id: null
    };
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(this.Utilities, 'operator_profile_privilege__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
        if (data) {
          ExternalUtilities.checkRitornoChiamata(Utils, data);

          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno login: ', data.DataTable);

          this.numeroActSetVisibili = 0;
          if (data.DataTable) {
            // const dd2 = data.OBJECT[0].object;
            const act_set_1 = data.DataTable.filter(x => x.PRIVILEGE === 'act_set_1');
            // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act Set 1', act_set_1);
            if (!act_set_1 || !act_set_1[0]) {
              this.actSetVisibile1 = false;
            } else {
              this.actSetVisibile1 = act_set_1[0].IS_ENABLED !== 'Y' ? false : true;
            }
            if (this.actSetVisibile1 === true) {
              this.numeroActSetVisibili++;
            }

            const act_set_2 = data.DataTable.filter(x => x.PRIVILEGE === 'act_set_2');
            // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act Set 2', act_set_2);
            if (!act_set_2 || !act_set_2[0]) {
              this.actSetVisibile2 = false;
            } else {
              this.actSetVisibile2 = act_set_2[0].IS_ENABLED !== 'Y' ? false : true;
            }
            if (this.actSetVisibile2 === true) {
              this.numeroActSetVisibili++;
            }

            const act_set_3 = data.DataTable.filter(x => x.PRIVILEGE === 'act_set_3');
            // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act Set 3', act_set_3);
            if (!act_set_3 || !act_set_3[0]) {
              this.actSetVisibile3 = false;
            } else {
              this.actSetVisibile3 = act_set_3[0].IS_ENABLED !== 'Y' ? false : true;
            }
            if (this.actSetVisibile3 === true) {
              this.numeroActSetVisibili++;
            }

            const act_set_4 = data.DataTable.filter(x => x.PRIVILEGE === 'act_set_4');
            // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act Set 4', act_set_4);
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
        } else {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nessun dato ritornato dal login:', data);
        }
    }, error =>  {
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Login:' + error);
    // TODO alert error
    });
  }

  LeggeSimbolici() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo simbolici');
    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '"' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_symbolic__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(Utils, data2);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data2);
        // const data = JSON.parse(data2);
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data); //  and name = \'GEO_R_MAP_MAX_MEASR\'

        data2.forEach(element => {
          let name = '';
          if (element.NAME) {
            name = element.NAME;
          } else {
            if (element.name) {
              name = element.name;
            }
          }
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
          switch (name) {
            case 'GEO_MAP_MAX_MEASR':
              this.Utilities.quanteMisure = element.value ? element.value : element.VALUE ? element.VALUE : 10;
              break;
            case 'GRID_PAGEABLE_ROW_NUM':
              this.righePerPaginareAutomaticamente = element.value ? element.value : element.VALUE ? element.VALUE : 100;
          // alert(this.righePerPaginareAutomaticamente);
              break;
            case 'DASHBOARD_REFRESH_FORCED_SEC':
              this.ritardoForzato = element.value ? element.value : element.VALUE ? element.VALUE : 60000;
              if (this.ritardoForzato < 100) {
                this.ritardoForzato *= 1000;
              }
              break;
            case 'DASHBOARD_REFRESH_AUTO_SEC':
              this.ritardoAuto = element.value ? element.value : element.VALUE ? element.VALUE : 15000;
              if (this.ritardoAuto < 100) {
                this.ritardoAuto *= 1000;
              }
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo simbolici. Ritardo auto:', this.ritardoAuto);
              break;
            case 'GEO_TIMECHART_MAX_MEASR':
              this.Utilities.quanteMisureGrafici = +(element.value ? element.value : element.VALUE ? element.VALUE : 10) + 1;
              break;
            case 'PRINT_PIXEL_X':
              this.Utilities.imageWidthPerScreenShot = +(element.value ? element.value : element.VALUE ? element.VALUE : 1920);
              break;
            case 'PRINT_PIXEL_Y':
              this.Utilities.imageHeightPerScreenShot = +(element.value ? element.value : element.VALUE ? element.VALUE : 945);
              break;
            // case 'SHOW_DEBUG_INFO':
            //  this.accordionDebug = element.VALUE;
          }
          this.Utilities.quanteMisurePareto = 2;
        });

        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.quanteMisure);

        this.impostaValoriDefault();
        this.refreshQuanteMisure = !this.refreshQuanteMisure;

        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo dashboard');
        this.LeggeDashboardPR();
        this.LeggeDashboardGroupPR();
        this.LeggeActivityGroupPR();
        this.LeggeSlaGroupPR();

        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo activity set');
        this.LeggeActivitySetPR();
        // this.LeggeEventiPR();
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo dashboard group');
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo activity group');
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo sla group');
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo sla data');
        this.LeggeSLADataPR();
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo measures');
        this.LeggeMeasuresPR();
        this.LeggeDatiLookUp();
        this.LeggeDatiAddLayers();
        this.caricaTabellaAntenne();
        this.LeggeDatiMosaicStyle();
        this.LeggeDatiFoldersWS();

        this.LeggeDatiFolders(false, -1);

        this.LeggeRAT();
        this.LeggeUEProf();
        this.LeggeBand();
        this.LeggeScenario();
        this.LeggeNotebook();

        this.LeggeDatiNetTech();
        this.LeggeDatiBandWidth();

        // this.LeggeActivities();
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Letto tutto');
        this.ConnessioneStabilita = 'OK';
      } else {
        ExternalUtilities.messaggioDiErroreEsterno(this, 'Read symbolic null');
      }
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Read symbolic: ' + error);
    });
  }

  LeggeDashboardPR() {
    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_dashboard__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(Utils, data2);

        // const d = data2;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, d);
        // const data = d; // [0].geo_dashboard__grid;
        // if (+data[0].v_err_code === 0) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista dashboard caricate', data2)
        this.datiDashboard = data2.DataTable

        this.datiDashboardPerPassaggio = data2;
        // // logConsole('Dati dashboard', data2);
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno:', this.datiDashboardPerPassaggio);

        this.pulisceFiltroDashboard = !this.pulisceFiltroDashboard;

        this.prendeNomeWorkspace();
        // this.Utilities.strutturaGrigliaDiBase = data;
      } else {
        this.datiDashboard = 'empty grid';
        this.datiDashboardPerPassaggio = 'empty grid';
        this.pulisceFiltroDashboard = !this.pulisceFiltroDashboard;
      }

      const tm1 = setTimeout(() => {
        clearTimeout(tm1);

        // logConsole('Dashboard selezionata in app component:', this.dashboardSelezionata);
        if (!this.dashboardSelezionata || this.dashboardSelezionata === 0) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiDashboard);
          this.datiDashboard.forEach(element => {
            if (element.ID === 0) {
              /* this.dashboardFolder = element.folder;
              this.dashboardName = element.name;
              this.dashboardGroupName = element.group_name;
              this.dashboardOperator = element.operator_name;
              this.dashboardSelectedDescription = element.description;
              if (this.dashboardSelectedDescription === null) { this.dashboardSelectedDescription = ''; };
              this.dashboardSelezionata = 1008; */
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Legge dashboard PR 1: ', this.dashboardSelezionata);
              // this.dashboardSelezionata = 0;
              this.selectDashboard(element, false, 'Legge dashboard PR 1');
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dashboard impostata', this.dashboardSelezionata);
            }
          });
        } else {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Legge dashboard PR 2: ', this.dashboardSelezionata);
          this.selectDashboard(this.dashboardSelezionata, false, 'Legge dashboard PR 2');
        }
      }, 1000);

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricataComboDashboard = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  LeggeUEProf() {
    const params = {
      cntx_id: ExternalUtilities.sessione,
      v_category: 'Filter_UeProf'
    };
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

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
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno dashboard group:', this.dashboardGroup);

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatoUEProf = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  LeggeNotebook() {
    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_category": "Notebook"' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      ExternalUtilities.checkRitornoChiamata(Utils, data2);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
        this.notebook = data;
     } else {
        this.notebook = 'empty grid'; // null;
      }

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatoNotebook = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Read look up:' + error);
    });
  }

  LeggeRAT() {
    const params = {
      cntx_id: ExternalUtilities.sessione,
      v_category: 'Filter_RAT'
    };
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data);
      if (data) {
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
      }
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno dashboard group:', this.dashboardGroup);

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatoRAT = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
      this.caricatoRAT = true;
    });
  }

  LeggeBand() {
    const params = {
      cntx_id: ExternalUtilities.sessione,
      v_category: 'Filter_Band'
    };
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

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
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno dashboard group:', this.dashboardGroup);

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatoBand = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  LeggeScenario() {
    const params = {
      cntx_id: ExternalUtilities.sessione,
      v_category: 'Filter_Scenario'
    };
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

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
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno dashboard group:', this.dashboardGroup);

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatoScenario = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  LeggeDashboardGroupPR() {
    const params = {
      cntx_id: ExternalUtilities.sessione,
      v_category: 'DashboardFolder'
    };
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

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
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno dashboard group:', this.dashboardGroup);

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatoDashboardGroup = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  LeggeActivityGroupPR() {
    const params = {
      cntx_id: ExternalUtilities.sessione,
      v_category: 'ActSetFolder'
    };
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 2', new Date().getTime());
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno:', data);
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

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatoActivityGroup = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  LeggeSlaGroupPR() {
    const params = {
      cntx_id: ExternalUtilities.sessione,
      v_category: 'SlaFolder'
    };
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_lookup__sel 3', new Date().getTime());
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno:', data);
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

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.caricatoSlaGroup = true;
      }, 100);
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  LeggeSLADataPR() {
    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_sla__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(Utils, data2);

        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SLA:', data2);
        const data = data2;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiSLA);
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
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sla data:', this.datiSlaDT, this.slaValueGlobale);

        /* const sla = null; // localStorage.getItem('SlaContext');
        if (sla !== null) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Map style cookie', mapStyle);
          this.slaValueGlobale = +sla;
        } else {
          this.slaValueGlobale = 0;
        } */

        // this.pulisceFiltroSLA = !this.pulisceFiltroSLA;
        // if (this.slaValueGlobale === undefined && this.slaValueGlobale !== 0) {
        //   this.slaValueGlobale = 0;
        // }
      } else {
        this.datiSLA = 'empty grid'; // null;
        this.datiSlaDT = 'empty grid'; // null;
        // this.pulisceFiltroSLA = !this.pulisceFiltroSLA;
      }
    }, error => {
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  impostActivityNameSuFrames(n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto activity name su frame ' + n, e);
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.activitySetName[n] = e;
      // logConsole('Activity set 1', e);
      this.nomeActivitySet = e;
      this.act_set_originale = e.NAME;
      this.ricaricaReport = new Date().toString();
    }, 100);
  }

  /* valoreActivitySet(n, e) {
    // const eee = this.Utilities.ritornaRigaTotaleDaDescrizioneCombo(e, this.datiActivitySet, 'NAME');
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore activity set ' + n + ':', e);
    if (e && e !== 'undefined' && e !== 'empty' && e !== null) {
      const ee = ExternalUtilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        this.activitySelezionataA[n] = ee;
        this.activitySet[n] = ee.ID;

        this.impostActivityNameSuFrames(n, ee);

        this.selectTipoActivity(n, ee);
        this.nomeActivitySet = ee.NAME;

        this.checkDifferenceFromStartJSON();
      }, 100);
    // }
    }
  } */

  mostraActivityComponent(q) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mostra component activity', q);
    this.chiudeDrawer(null);

    this.LeggeDatiFolders(true, q);
  }

  visibileDaMascheraActivity(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura finestra activity', e);
    this.numeroActSet = -1;
    this.activityComponentShowed = false;
    this.LeggeActivitySetPR();
    this.LeggeActivityGroupPR();

    const tm = setTimeout(() => {
      clearTimeout(tm);
      const ee = e.split('§');
      this.leggeActivityDaSet(ee[0], ee[1]);

      // AppComponent.CambioTmsSelezionato(this.Utilities, 0, 'Visibile da maschera activity', this.timerAttivatoAuto);

      this.cambioTmsSelezionatoConControlloGPS(0, 'Visibile da maschera activity', false);

      this.checkDifferenceFromStartJSON();
      this.rinfrescaTuttiIframes('visibileDaMascheraActivity');
    }, 1000);
  }

  mostraDashboardEditComponent() {
    if (this.dashboardSelected && this.dashboardSelected !== null) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta dash 2');
      this.dashboardSelected2 = this.dashboardSelected;

      const g = this.dashboardGroup;
      this.dashboardGroup = 'empty';
      this.dashboardGroup = g;

      this.dashboardEditComponentShowed = true;
    }
  }

  visibileDaMascheraDashboardEdit(e) {
    this.dashboardEditComponentShowed = false;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Maschera dashboard chiusa');
  }

  mostraDashboardListComponent() {
    this.impostaNonChiudere2(false);

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.nomeDashboardSelezionata);
    this.nomeDashboardSelezionata2 = this.nomeDashboardSelezionata;

    const g = this.dashboardGroup;
    this.dashboardGroup = 'empty';
    this.dashboardGroup = g;

    this.dashboardListComponentShowed = true;
  }

  visibileDaMascheraDashboardList(e) {
    this.dashboardListComponentShowed = false;
    // // logConsole('Chiusura DBList: Vecchia: ' + this.nomeDashboardSelezionata2 + ' - Nuova: ', this.dashboardSelezionata);
    if (this.nomeDashboardSelezionata2 !== this.dashboardSelezionata) {
      this.CaricaDatiDashboard(this.dashboardSelezionata);
    }
  }

  confirmDaDahsboardList(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confirm dashboard list', e);
    if (e) {
      logConsole('Dati dashboard 2', e);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confirm dashboard list:', e);
      this.dashboardSelected = e;
      this.dashboardName = e.NAME;
      this.dashboardGroupName = e.GROUP_NAME;
      this.dashboardSelectedDescription = e.DESCRIPTION;
      // logConsole('Descrizione dashboard 3:', this.dashboardSelectedDescription, e);
      if (this.dashboardSelectedDescription === null) { this.dashboardSelectedDescription = ''; };
      // this.showTimeCursor = e.SHOWTIMECURSOR;
      this.dashboardFolder = e.FOLDER;
      this.dashboardOperator = e.OPERATOR_NAME;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto dashboard selezionata 5', e.ID);
      this.impostazioni.dashboardSelezionata = e.ID;

      this.nomeDashboardSelezionata = e.ID;
      // logConsole('Select dashboard 8:', e);
      this.dashboardSelezionata = e.ID;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confirm:', '*' + this.nomeDashboardSelezionata + '*');
      this.CaricaDatiDashboard(e.ID);
      // this.checkDifferenceFromStartJSON();
    }
  }

  sde;
  ve;
  dde;
  dse;

  selectDashboard(e, vieneDaCambioWS, daDove) {
    if (e) {
      if (JSON.stringify(e) !== JSON.stringify(this.sde)) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select dashboard: Imposto ', e, vieneDaCambioWS, this.dashboardSelezionata);
        this.sde = JSON.parse(JSON.stringify(e));
        this.ve = vieneDaCambioWS;
        this.dde = daDove;
        this.dse = this.dashboardSelezionata;
      }
      this.caricatoTimer = false;

      // alert('2 2000 ' + daDove);
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select dashboard: Controllo ', e, this.sde, JSON.stringify(e) === JSON.stringify(this.sde));
        if (JSON.stringify(e) === JSON.stringify(this.sde)) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select dashboard: Richiamo ', this.sde, this.ve, this.dde, this.dse);
          // logConsole('Select dashboard 1:', this.dse);
          this.dashboardSelezionata = this.dse;
          this.selectDashboard2(this.sde, this.ve, this.dde);

          this.sde = undefined;    
          this.ve = undefined;
          this.dde = undefined;
          this.dse = undefined;
        }
      }, 2000); // TEMPI MODIFICATI -> 2000
    }
  }

  isNumeric(value: unknown): boolean {
  	return typeof value === 'number' && !Number.isNaN(value);
  }

  selectDashboard2(eee, vieneDaCambioWS, daDove) {
    // alert(daDove);
    let e;
    let appo = -1;
    let cambiata = false
    if (this.isNumeric(eee)) {
      appo = this.dashboardSelezionata;
      this.datiDashboard.forEach(element => {
        if (!e) {
          if (+element.ID === +eee) {
            e = element;
          }
        }
      });
      if (!e) {
        alert('ppp');
      }
      cambiata = true;
      this.dashboardSelezionata = -1;
    } else {
      e = JSON.parse(JSON.stringify(eee));
    }
    // logConsole('>>>Select dashboard:', e, eee);
    if (e && e !== 'empty') {
      const ee = ExternalUtilities.converteStringaInJSON(e);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select dashboard: ', ee, vieneDaCambioWS, this.dashboardSelezionata);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select dashboard. Altro ', this.altro);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select dashboard. Da Dove ', daDove);

      if (ee.ID === 0 && this.altro !== '') {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select dashboard. Esco in quanto si sta caricando un\'altra dashboard');
        return;
      }
      /* for (let nf = 1; nf <= 9 ; nf ++) {
        for (let fa = 1; fa <= 5 ; fa ++) {
          this.viewOlG[fa][nf] = undefined;
          this.viewOlL[fa][nf] = undefined;
          // this.impostazioni.currZoom[fa][nf] = 10;
        }
        this.centroAttuale[nf] = '';
      } */

      // if (ee !== null && ee.ID !== this.dashboardSelezionata) {
      /* for (let nf = 1; nf <= 9 ; nf ++) {
        for (let fa = 1; fa <= 5 ; fa ++) {
          this.viewOlG[fa][nf] = undefined;
          this.viewOlL[fa][nf] = undefined;
          // this.impostazioni.currZoom[fa][nf] = 10;
        }
        this.centroAttuale[nf] = '';
      } */

      // if (ee !== null && ee.ID !== this.dashboardSelezionata) {
      if (ee !== null && ee.ID !== this.dashboardSelezionata) {
        logConsole('Dati dashboard 3', ee);

        this.dashboardSelected = ee;
        this.dashboardName = ee.NAME;
        this.dashboardGroupName = ee.GROUP_NAME;
        this.dashboardSelectedDescription = ee.DESCRIPTION;
        this.dashboardFolder = ee.FOLDER;
        this.dashboardOperator = ee.OPERATOR_NAME;
        this.nomeDashboardSelezionata = ee.ID;
        // this.showTimeCursor = ee.SHOWTIMECURSOR;
        // logConsole('Descrizione dashboard 4:', daDove, vieneDaCambioWS, this.dashboardSelectedDescription, ee);
        if (this.dashboardSelectedDescription === null) { this.dashboardSelectedDescription = ''; };

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dashboard name:', this.dashboardName);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto dashboard selezionata 6', this.nomeDashboardSelezionata);
        // if (this.activitySet[1] !== -1 || this.activitySet[2] !== -1 || this.activitySet[3] !== -1 || this.activitySet[4] !== -1) {
        // if (this.primaPartenzaEffettuata) {
        // logConsole('Select dashboard 2:', ee);
        this.dashboardSelezionata = this.nomeDashboardSelezionata;

        // logConsole('Descrizione dashboard 4.1:', daDove, vieneDaCambioWS, this.dashboardSelezionata, e);
        this.routineCambioDashboard(this.nomeDashboardSelezionata, ee, vieneDaCambioWS);
        // }
        // }
        const tt = setTimeout(() => {
          clearTimeout(tt);

          if (cambiata) {
            this.dashboardSelezionata = appo;
          }          
        }, 1000);
      }
    } else {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulita Dashboard');
      let ok = false;
      if (this.datiDashboard && this.datiDashboard.DataTable) {
        logConsole('Dati dashboard 4', this.datiDashboard);

        this.datiDashboard.DataTable.forEach(element => {
          if (element.ID === this.numeroDashboardDefault) {
            this.dashboardSelected = element;
            this.dashboardName = element.NAME;
            this.dashboardGroupName = element.GROUP_NAME;
            this.dashboardSelectedDescription = element.DESCRIPTION;
            // this.showTimeCursor = element.SHOWTIMECURSOR;
            this.dashboardFolder = element.FOLDER;
            this.dashboardOperator = element.OPERATOR_NAME;
            this.nomeDashboardSelezionata = element.ID;
            this.dashboardSelezionata = element.ID;
            // logConsole('Descrizione dashboard 5:', this.dashboardSelectedDescription, element);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto dashboard selezionata 2', this.dashboardSelezionata);
            // logConsole('Select dashboard 3:', element);
            
            ok = true;
          }
        });
      }
      if (!ok) {
        this.dashboardSelected = '';
        this.dashboardName = '';
        this.dashboardGroupName = '';
        this.dashboardSelectedDescription = '';
        this.dashboardFolder = '';
        this.dashboardOperator = '';

        this.nomeDashboardSelezionata = '';
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto dashboard selezionata 1');
        // logConsole('Select dashboard 4:', 0);
        this.dashboardSelezionata = 0;

        /* this.impostazioni.nomiFrames = new Array();
        for (let i = 0; i <= environment.quantiFrames; i++ ) {
          this.impostazioni.nomiFrames.push(new Array());
          for (let k = 0; k <= environment.quantiSottoFrames; k++ ) {
            this.impostazioni.nomiFrames[i].push('--');
          }
        }
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.nomiFrames);
        this.creaNomiFrames(false); */
      }

      this.impostazioni = JSON.parse(JSON.stringify(this.impostazioniDefault));
      this.aggiornaLarghezzaContenitore();
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Proseguimento Select Dashboard');

    this.prendeNomeWorkspace();
    this.checkDifferenceFromStartJSON();
  }

  routineCambioDashboard(ee, e, vieneDaCambioWS) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Routine cambio dashboard:', ee, e, this.primaPartenzaEffettuata, vieneDaCambioWS, e.DESCRIPTION);

    /* if (this.primaPartenzaEffettuata === false) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Routine cambio dashboard: Prima partenza non ancora effettuata. Esco');
      return;
    } */
    // const ultimaDash = localStorage.getItem('lastDashboardSelected');
    if (e.DESCRIPTION === 'default dashboard') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Routine cambio dashboard: default dashboard', e.DESCRIPTION);
      this.CaricaDatiDashboard(ee);

      this.rinfrescaTuttiIframes('Cambio Dash 1');
    } else {
      if (vieneDaCambioWS === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Routine cambio dashboard: viene da cambio ws');
        this.CaricaDatiDashboard(ee);

        this.rinfrescaTuttiIframes('Cambio Dash 2');
      } else {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '***QUI DEVE PASSARE SOLO IN CASO DI CAMBIO DASHBOARD***')
        // localStorage.setItem('lastDashboardSelected', e.DESCRIPTION);
        const id = this.operatorID;
        this.nomeWorkSpace = 'temp [' + id + ']';
        this.folderWorkSpace = 'My Folder';
        this.salvaFavoritoFisico(true, e, vieneDaCambioWS, 'Routine cambio dashboard');
      }
    }
  }

  cambioDashboard2(e, vieneDaCambioWS, daDove) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        let indirizzo = '';
        let altro = 'Mappe'

        if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
          indirizzo = 'http://localhost:4200';
          altro = '';
        } else {
          indirizzo = Utils.urlRoot;
        }

        const id = this.operatorID;

        const passaggio = '{ ' +
          '"sess": "' + this.sessioneID + '", ' +
          '"gname": "' + this.gname + '", ' +
          '"uname": "' + this.userName + '", ' +
          '"form": "Home", ' +
          '"FS": "' + this.fullScreen.toString() + '", ' +
          '"actset": "' + (this.activitySet && this.activitySet[1] ? this.activitySet[1].toString() : '') + '", ' +
          '"altro": "temp [' + id + ']"' +
        '}';
        const pass = Utils.cripta(passaggio);
        let indir = indirizzo + altro;
        if (indir.indexOf('host:') === -1 && indir.indexOf('geoantsweb/') === -1) {
          indir = indir.replace('/Mappe', '/geoantsweb/Mappe');
        }
        // alert('Passaggio 1: ' + indir);
        const doveURL = indir + '/?par=' + pass; // ?sess=' + this.sessioneID +
                // '&gname=' + this.gname +
                // '&uname=' + this.userName +
                // '&form=Home' +
                // '&FS=' + this.fullScreen;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CHIAMATA URL:', doveURL);
        // alert(daDove + '(' + vieneDaCambioWS + '): ' + passaggio);
        location.assign(doveURL);
      }, 1000);
  }

  CaricaDatiDashboard(q) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Caricamento dati dashboard:', q);

    this.impostaValoriDefault();

    if (+q === 0) {
      // DASHBOARD EMPTY
      this.caricataComboDashboard = true;
      this.caricataComboActivitSet = true;
      this.caricatoDashboardGroup = true;
      this.caricatoActivityGroup = true;
      this.caricatoSlaGroup = true;
      this.caricateMeasures = true;
      this.caricatiLookUp = true;
      this.caricatoBand = true;
      this.caricatoRAT = true;
      this.caricatoUEProf = true;
      this.caricatoScenario = true;
      this.caricatoNotebook = true;
      this.caricatiMosaicStyle = true;
      this.caricatiFoldersWS = true;
      this.caricatiAddLayers = true;
      
      this.dashboardSelected = 'empty';
    } else {
      /* const t = setInterval(() => {
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
          this.caricatiFoldersWS &&
          this.caricatiAddLayers) {

          // this.subscribe.unsubscribe();
          clearInterval(t);

          this.effettuaCaricamento(q);
        }
      }, 1000); */
      this.effettuaCaricamento(q);
    }
  }

  impostaDragDrop() {
    if (this.pageSelector === -1) {
      return;
    }

    // logConsole('GF: Imposta drag drop', this.pageSelector);
    // Fatto uscire il 09/06/2025 - Quando si cambiava pagina resettava gli slider invece li doveva lasciare come li aveva impostati 
    // l'ultima volta che si era entrati in quella pagina
    return; 

    /* if (!this.impostazioni.dimensioni) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisco dimensioni DragDrop', this.impostazioni.dimensioni);
      this.impostazioni.dimensioni = new Array();
      for (let i = 0; i <= environment.quantiSottoFrames; i++) {
        this.impostazioni.dimensioni.push({
          PrimaRiga: [33, 34, 33],
          SecondaRiga: [33, 34, 33],
          TerzaRiga: [33, 34, 33],
          Orizzontale: [33, 34, 33]
        });
      }
    } */
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize[this.pageSelector][1], typeof(this.impostazioni.maskSize[this.pageSelector][1]));
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize[this.pageSelector][1].length);

    // this.aggiustaArray.controllaImpostazioniSize(this);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.pageSelector);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.dimensioni[this.pageSelector]);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize[this.pageSelector]);

    // // logConsole('IMPOZZ1', JSON.parse(JSON.stringify(this.impostazioni.dimensioni[this.pageSelector])));

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask: Dimensioni: ', this.pageSelector, this.impostazioni.dimensioni);
    if (!this.impostazioni.dimensioni[this.pageSelector]) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask: Dimensioni non esistenti per la pagina: ', this.pageSelector, this.impostazioni.dimensioni);
      const n = new Array();
      for (let i = 0; i <= environment.quantiSottoFrames; i++) {
        let nn;
        if (!this.impostazioni.dimensioni[this.pageSelector]) {
          nn = {
            PrimaRiga: [33, 34, 33],
            SecondaRiga: [33, 34, 33],
            TerzaRiga: [33, 34, 33],
            Orizzontale: [33, 33, 33]
          }
        } else {
          nn = {
            PrimaRiga: this.impostazioni.dimensioni[this.pageSelector].PrimaRiga,
            SecondaRiga: this.impostazioni.dimensioni[this.pageSelector].SecondaRiga,
            TerzaRiga: this.impostazioni.dimensioni[this.pageSelector].TerzaRiga,
            Orizzontale: this.impostazioni.dimensioni[this.pageSelector].Orizzontale,
          }
        }
        n.push(nn);
      }
      this.impostazioni.dimensioni = n;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask: Dimensioni non esistenti per la pagina. Le creo', this.pageSelector, this.impostazioni.dimensioni[this.pageSelector]);
    }

    this.aggiustaArray.controllaImpostazioniSize(this, 'ImpostaDragDrop');
    // // logConsole('IMPOZZ2', JSON.parse(JSON.stringify(this.impostazioni.dimensioni[this.pageSelector])));

    // 28/05/2024
    if (this.impostazioni.maskSize[this.pageSelector] && this.impostazioni.dimensioni[this.pageSelector]) {
      this.impostazioni.maskSize[this.pageSelector][1] = this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[0];
      this.impostazioni.maskSize[this.pageSelector][2] = this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[1];
      this.impostazioni.maskSize[this.pageSelector][3] = this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[2];

      this.impostazioni.maskSize[this.pageSelector][4] = this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[0];
      this.impostazioni.maskSize[this.pageSelector][5] = this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[1];
      this.impostazioni.maskSize[this.pageSelector][6] = this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[2];

      // this.sistemaRiga(3);
      this.impostazioni.maskSize[this.pageSelector][7] = this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[0];
      this.impostazioni.maskSize[this.pageSelector][8] = this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[1];
      this.impostazioni.maskSize[this.pageSelector][9] = this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[2];

      // alert('HOR 1');
      // logConsole('HOR', this.pageSelector, this.impostazioni.dimensioni[this.pageSelector]);
      this.impostazioni.maskSizeHor[this.pageSelector][1] = this.impostazioni.dimensioni[this.pageSelector].Orizzontale[0];
      this.impostazioni.maskSizeHor[this.pageSelector][2] = this.impostazioni.dimensioni[this.pageSelector].Orizzontale[1];
      this.impostazioni.maskSizeHor[this.pageSelector][3] = this.impostazioni.dimensioni[this.pageSelector].Orizzontale[2];

      this.gest_finestre.sistemaHor(this, 1);
      this.gest_finestre.sistemaHor(this, 4);
      this.gest_finestre.sistemaHor(this, 7);
    }
    // 28/05/2024
    
    // // logConsole('IMPOZZ3', JSON.parse(JSON.stringify(this.impostazioni.dimensioni[this.pageSelector])));

    /* let i = 0;
    this.impostazioni.maskSize[this.pageSelector].forEach(element => {
      if (element === 0) {
        this.impostazioni.maskVisible[this.pageSelector][i] = false;
      } else {
        this.impostazioni.maskVisible[this.pageSelector][i] = true;
      }
      i++;
    }); */

    if (this.impostazioni.maskSize[this.pageSelector] && this.impostazioni.maskSize[this.pageSelector][1] === false && 
      this.impostazioni.maskSize[this.pageSelector][2] === false && this.impostazioni.maskSize[this.pageSelector][3] === false) {
      this.impostazioni.nascoste123 = true;
    } else {
      this.impostazioni.nascoste123 = false;
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask: size:', this.impostazioni.maskSize[this.pageSelector]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask: size Hor:', this.impostazioni.maskSizeHor[this.pageSelector]);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask: visible:', this.impostazioni.maskVisible[this.pageSelector]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask: dimensioni:', this.impostazioni.dimensioni[this.pageSelector]);

    /* let ok = true;
    for (let i = 4; i < 10; i++) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask Controllo Frame chiuso ', i, this.impostazioni.maskVisible[this.pageSelector][i]);
      if (ok === true) {
        if (this.impostazioni.maskVisible[this.pageSelector][i] === false) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask Frame chiuso ', i);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask Dimensionsi frame: ', this.impostazioni.maskSize[this.pageSelector][i]);
          if (this.impostazioni.maskSize[this.pageSelector][i] > 0) {
            ok = false;
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask Ci sono frames chiusi con dimensioni maggiori di 0. Chiudo');
          // } else {

          }
        }
      }
    } */

    /* if (this.impostazioni.dimensioni[this.pageSelector]) {
      this.impostazioni.maskSize[this.pageSelector][1] = this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[0];
      this.impostazioni.maskSize[this.pageSelector][2] = this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[1];
      this.impostazioni.maskSize[this.pageSelector][3] = this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[2];

      this.impostazioni.maskSize[this.pageSelector][4] = this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[0];
      this.impostazioni.maskSize[this.pageSelector][5] = this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[1];
      this.impostazioni.maskSize[this.pageSelector][6] = this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[2];

      this.impostazioni.maskSize[this.pageSelector][7] = this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[0];
      this.impostazioni.maskSize[this.pageSelector][8] = this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[1];
      this.impostazioni.maskSize[this.pageSelector][9] = this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[2];

      this.impostazioni.maskSizeHor[this.pageSelector][1] = this.impostazioni.dimensioni[this.pageSelector].Orizzontale[0];
      this.impostazioni.maskSizeHor[this.pageSelector][2] = this.impostazioni.dimensioni[this.pageSelector].Orizzontale[1];
      this.impostazioni.maskSizeHor[this.pageSelector][3] = this.impostazioni.dimensioni[this.pageSelector].Orizzontale[2];
    } */

    /*
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    if (!this.impostazioni.occhioCheckato) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Azzero array');
      this.impostazioni.occhioCheckato = new Array();
    }
    if (this.impostazioni.occhioCheckato[this.pageSelector]) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Imposto array su pagina', this.pageSelector);
      this.impostazioni.framesPinnati = this.impostazioni.occhioCheckato[this.pageSelector];
    }
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    */

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask: Dati pagine: ', this.impostazioni.datiPageSelector);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mask: Pagina attuale: ', this.pageSelector);
  }

  descrizioneDashboard = '';

  effettuaCaricamento(q) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, q);
    this.dbWorkOnDashboard = true
    this.Utilities.caricataDashboard = false;
    let d = new Date();
    if (this.debugCaricamentoDashboard === true) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Effettuo caricamento dashboard', d, q);
    }

    /* for (let i = 0; i < environment.quantiSottoFrames; i++) {
      for (let k = 0; k < environment.quantiSottoFrames; k++) {
        this.impostazioni.viewOlL[i][k] = 'REFRESH';
        this.impostazioni.viewOlG[i][k] = 'REFRESH';
      }
    } */

    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.resettaValoriFrame = !this.resettaValoriFrame;

      const params = '{' +
        '"cntx_id": "' + ExternalUtilities.sessione + '",' +
        '"v_id": ' + q + ' ' +
      '}';
      this.apiService.chiamataPost(this.Utilities, 'geo_dashboard__sel', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        ExternalUtilities.checkRitornoChiamata(Utils, data);

        if (this.debugCaricamentoDashboard === true) {
          d = new Date();
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lettura dati dashboard:', data.RESULT[0].message.toUpperCase(), d);
        }
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati dashboard: ', data);
        // if (data === undefined) { data = null; }
        // if (data.RESULT && data.RESULT[0].message.toUpperCase() === 'OK' && data.OBJECT[0].object.GEO_DASHBOARD.length > 0) {
        if (data && data[0]) {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lettura config_json:', data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON);
          // if (data.OBJECT[0].object.GEO_DASHBOARD[0] && data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON
          //   && data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON !== null) {
          if (data[0].config_json && data[0].config_json[0] !== null) {
            // let imp = data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON;
            let imp2 = data[0].config_json[0];

            this.descrizioneDashboard = data[0].description;
            this.showTimeCursor = imp2.showTimeCursor;
            if (this.showTimeCursor === undefined) { this.showTimeCursor = true; }
            // alert('Show time cursor: ' + this.showTimeCursor);

            // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, imp2);
            // return;

            // imp = ExternalUtilities.sistemaStringaLettaDaDB(imp);
            if (this.debugCaricamentoDashboard === true) {
              d = new Date();
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'JSON letto e convertito', d, imp2);
            }

            // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni:', JSON.parse(imp), typeof(imp));

            // this.impostazioni.activity = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
            // this.activityName = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
            // this.activitySet = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
            // this.activitySetName = this.Utilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');

            // const imp2 = JSON.parse(JSON.parse(JSON.stringify(imp)));
            if (imp2 === null || (imp2 !== null && typeof(imp2.maskSize[this.pageSelector]) === 'undefined')) {
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Config JSON non valido:', imp2, typeof(imp2));
              // ExternalUtilities.messaggioDiErroreEsterno(this, 'Config JSON not valid for this dashboard');
              // this.impostaValoriDefault();
              this.dbWorkOnDashboard = false;
              this.Utilities.caricataDashboard = true;
              this.resettaValoriSuMaschera();
            } else {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni caricate', imp2);

              // logConsole('Pagina da caricare', this.pageSelector, imp2.framesAttivi[this.pageSelector]);

              this.impostazioni = imp2;

              if (this.debugCaricamentoDashboard === true) {
                d = new Date();
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni inziali settate', d);
              }

              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Zooms caricati:', this.impostazioni.currZoom);
              /* // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'activity names:', this.activityName);
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity set name:', this.activitySetName);

              this.cambioActivity(1, this.impostazioni.activity[1]);
              this.cambioActivity(2, this.impostazioni.activity[2]);
              this.cambioActivity(3, this.impostazioni.activity[3]);
              this.cambioActivity(4, this.impostazioni.activity[4]); */

              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.eventiSceltiES);

              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lettura page selector: ', this.impostazioni.datiPageSelector);
              if (this.impostazioni.datiPageSelector === undefined) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Page selector non definito');
                const ps = new Array();
                for (let i = 1; i <= environment.quantiSottoFrames; i++) {
                  const id = { ROW_ID: i, id: i, value: i + ': Page ' + i, OnlyName: 'Page ' + i };
                  ps.push(id);
                }

                this.generaDatiPageSelector(ps);
                // logConsole('Dati page selector 1', ps);
                // this.impostazioni.datiPageSelector = this.datiPageSelector;
              } else {
                if(this.impostazioni.datiPageSelector && this.impostazioni.datiPageSelector.DataTable
                   && this.impostazioni.datiPageSelector.DataTable.length >= environment.quantiSottoFrames) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Page selector valido');
                  // logConsole('Dati page selector 2', this.impostazioni.datiPageSelector);
                } else {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Page selector NON valido');
                  let maxId = 0;
                  this.impostazioni.datiPageSelector.DataTable.forEach(element => {
                    if (element.ROW_ID > maxId) {
                      maxId = element.ROW_ID;
                    }
                  });
                  maxId++;
                  for (let i = this.impostazioni.datiPageSelector.DataTable.length; i < environment.quantiSottoFrames; i++) {
                    // const id = { ROW_ID: maxId, id: maxId, value: maxId + ': [hidden] empty', OnlyName: '[hidden] empty' };
                    const id = { ROW_ID: maxId, id: maxId, value: maxId + ': Page ' + maxId, OnlyName: 'Page ' + maxId };
                    this.impostazioni.datiPageSelector.DataTable.push(id);
                    maxId++;
                  }
                  this.generaDatiPageSelector(this.impostazioni.datiPageSelector.DataTable);
                  logConsole('Dati page selector 3', this.impostazioni.datiPageSelector);
                }
              }

              if (!this.impostazioni.datiPageSelector.DataTable[0].ROW_ID) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Page selector con ROW_ID mancante');
                this.impostazioni.datiPageSelector.DataTable.forEach(element => {
                  element['ROW_ID'] = element.id;
                  if (!element.description) {
                    element['description'] = '';
                  }
                });
              }
              const tm1 = setTimeout(() => {
                clearTimeout(tm1);
                this.impostazioni.datiPageSelector = JSON.parse(JSON.stringify(this.impostazioni.datiPageSelector));
                // // logConsole('DPS: 1', this.impostazioni.datiPageSelector);
                this.generaDatiPageSelectorFiltrati(this.impostazioni.datiPageSelector, 'EffettuaCaricamento');
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Page selector risultante: ', this.impostazioni.datiPageSelector);
              }, 2000);
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.datiPageSelector);

              if (this.pageSelector > -1)  {
                if (!this.impostazioni.dimensioni || !this.impostazioni.dimensioni[this.pageSelector]) {
                  this.impostazioni.dimensioni = new Array();
                  for (let i = 0; i <= environment.quantiSottoFrames; i++) {
                    this.impostazioni.dimensioni.push({
                      PrimaRiga: [33, 34, 33],
                      SecondaRiga: [33, 34, 33],
                      TerzaRiga: [33, 34, 33],
                      Orizzontale: [33, 34, 33]
                    });
                  }
                }
              }
              this.impostaDragDrop();

              // SISTEMA STYLE SIZE
              const ss = new Array();
              let riga = 0;
              if (this.impostazioni.styleSize) {
                this.impostazioni.styleSize.forEach(element => {
                  ss.push(new Array());
                  element.forEach(element2 => {
                    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element2, typeof(element2));
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
                this.impostazioni.styleSize = JSON.parse(JSON.stringify(ss));
              }
              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.styleSize);
              // SISTEMA STYLE SIZE

              if (this.impostazioni.globalMeasure && this.impostazioni.globalMeasure !== undefined &&
                this.impostazioni.globalMeasure !== null) {
                this.Utilities.globalMeasure = JSON.parse(this.impostazioni.globalMeasure);
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.globalMeasure.measr_code);
              }

              if (this.impostazioni.globalMeasureArfcn && this.impostazioni.globalMeasureArfcn !== undefined &&
                this.impostazioni.globalMeasureArfcn !== null) {
                this.Utilities.globalMeasureArfcn = JSON.parse(this.impostazioni.globalMeasureArfcn);
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.globalMeasure.measr_code);
              }

              // Si possono eliminare dopo il primo salvataggio
              this.aggiustaArray.aggiustaArray(this, this.Utilities);
              // Si possono eliminare dopo il primo salvataggio
              
              if (this.impostazioni.maskSizeHor[this.pageSelector].length > 4) {
                // alert('HOR 2');
                this.impostazioni.maskSizeHor[this.pageSelector] = [0, 33, 33, 33];
              }
              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize, this.impostazioni.maskSizeHor, this.impostazioni.maskVisible);

              const m = new Array();
              for (let n = 0; n <= environment.quantiFrames; n++) {
                m.push(undefined);
              }
              for (let n = 0; n <= environment.quantiFrames; n++) {
                const v = new Array();
                for (let i = 0; i <= environment.quantiSottoFrames; i++) {
                  if (this.impostazioni.MappaOGrafico[i] && this.impostazioni.MappaOGrafico[i][n]) {
                    v.push(this.impostazioni.MappaOGrafico[i][n]);
                  } else {
                    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore non trovato', i, n);
                    this.impostazioni.MappaOGrafico.push(new Array());
                    for (let n2 = 0; n2 <= environment.quantiFrames; n2++) {
                      this.impostazioni.MappaOGrafico[i].push('--');
                    }
                    v.push('--');
                  }
                }
                m[n] = v;
              }
              this.MappaOGraficoTutti = m;
              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.MappaOGraficoTutti);

              this.listToPrint = this.impostazioni.listToPrint;
              // // logConsole('listToPrint', this.listToPrint);

              if (this.debugCaricamentoDashboard === true) {
                d = new Date();
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Array aggiustati', d);
              }
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi locali. Caricati: ', this.impostazioni.listaEventi);
              // this.impostazioni.listaEventi = this.Utilities.creaMatrice(environment.quantiSottoFrames,
              // environment.quantiFrames, undefined);

              /* let cambia = true;
              this.impostazioni.frameName.forEach(element => {
                if (element[1] && element[1] !== '' && element[1] !== '<empty>') {
                  cambia = false;
                }
              });
              if (cambia) {
                if (this.impostazioni.titoloFrame) {
                  this.impostazioni.frameName = this.impostazioni.titoloFrame;
                }
              } */
              this.impostazioni.titoloFrame = undefined;

              this.creaNomiFrames(false);

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cell set letto', this.cellSetRow);
              // this.selezioneAntenne = this.cellSetRow;

              /* if (this.impostazioni.maskVisible[1].length < environment.quantiSottoFrames) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiusto array visible prima', this.impostazioni.maskVisible);
                this.impostazioni.maskVisible.forEach(element => {
                  for (let i = element.length; i <= environment.quantiSottoFrames; i++) {
                    element.push(true)
                  }
                });
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiusto array visible dopo', this.impostazioni.maskVisible);
              } */

              if (this.debugCaricamentoDashboard === true) {
                d = new Date();
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Creati nomi frames', d);
              }

              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.eventiSceltiES);
              /* if (!this.impostazioni.histDisplayTutto) { this.impostazioni.histDisplayTutto = new Array(); }

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
              this.impostazioni.slaValue.push(new Array());
              this.impostazioni.slaName.push(new Array());
              this.impostazioni.plmn.push(new Array());
              this.impostazioni.netTech.push(new Array());
              this.impostazioni.shownEvents.push(new Array());
              this.impostazioni.modificaChart.push(new Array());
              this.impostazioni.bandwidth.push(new Array());
              this.impostazioni.countHistogram.push(new Array());
              this.impostazioni.checkSeverity.push(new Array());
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
              this.impostazioni.measureRCM.push(new Array()); */

              for (let j = 0; j <= environment.quantiSottoFrames; j ++) {
                for (let i = 0; i <= environment.quantiFrames; i ++) {
                  /* if (!this.impostazioni.eventiSceltiES[j] || !this.impostazioni.eventiSceltiES[j][i]) {
                    // for (let i2 = 0; i2 <= environment.quantiFrames; i2 ++) {
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
                      this.impostazioni.slaValue[j].push(-1);
                      this.impostazioni.slaName[j].push('');
                      this.impostazioni.plmn[j].push('');
                      this.impostazioni.netTech[j].push(true);
                      this.impostazioni.shownEvents[j].push(false);
                      this.impostazioni.modificaChart[j].push(true);
                      this.impostazioni.bandwidth[j].push(true);
                      this.impostazioni.countHistogram[j].push(true);
                      this.impostazioni.checkSeverity[j].push(true);
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
                      this.impostazioni.measureRCM[j].push(false);
                    // }
                  } */

                  if (this.impostazioni.eventiSceltiGlobaliES) {
                    this.cambioEventiSceltiGlobali(this.impostazioni.eventiSceltiGlobaliES);
                  }

                  if (this.impostazioni.eventiSceltiES) {
                    this.cambioEventiScelti(j, i, this.impostazioni.eventiSceltiES);

                    /* logConsole(this.impostazioni.overviewZoom);
                    if (this.impostazioni.overviewZoom[j][i] === undefined ||
                      this.impostazioni.overviewZoom[j][i] === null) {
                      this.impostazioni.overviewZoom[j][i] = true;
                    } */
                    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, j, i, this.impostazioni.activity[j][i]);
                    if (this.impostazioni.activity[j] !== undefined) {
                      let name;
                      if (this.impostazioni.activity[j][i] === 0) {
                        name = environment.stringaLatestSelection;
                      } else {
                        if (this.impostazioni.activity[j][i] === -1) {
                          name = environment.stringaAll;
                        } else {
                          if (this.impostazioni.activity[j][i] !== '') {
                            name = this.activitySetName[this.impostazioni.activity[j][i]];
                          }
                        }
                      }
                      if (name === ' ' || name === '') {
                        name = 'empty';
                      }
                      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, j, i, name);a
                      this.activityName[j][i] = name;
                    }
                    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, name);
                  }
                }
              }
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi frames', this.impostazioni.frameName);

              // this.impostazioni.frameName = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 'Title ***CONT***');
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi frames', this.impostazioni.frameName);

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi frames', this.impostazioni.frameName);
              /* if (this.impostazioni.frameName.length > environment.quantiFrames + 1) {
                const fm = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
                /* for (let i = 0; i <= environment.quantiFrames; i++ ) {
                  for (let k = 0; k <= environment.quantiSottoFrames; k++ ) {
                    fm[i][k] = this.impostazioni.nomiFrames[i][k];
                  }
                } //
                this.impostazioni.frameName = fm;
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi frames Modificato', this.impostazioni.frameName);
              } */

              this.sistemaImpostazioni();

              this.activityName = JSON.parse(JSON.stringify(this.activityName));
              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'activity 2:', this.impostazioni.overviewZoom);

              if (this.debugCaricamentoDashboard === true) {
                d = new Date();
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostate activity name', d);
              }

              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'activity names:', this.activityName);

              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize, this.impostazioni.maskVisible);

              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSizeHor);

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
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'check differenze e aggiornamento larghezza contenitore', d);
              }

              // this.calcolaCentro = !this.calcolaCentro;

              /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity set impostato', this.activitySet[1]);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time start impostato', this.timeRangeDSFStart);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time stop impostato', this.timeRangeDSFStop); */
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CELL SET: ', this.selezioneAntenne);

              this.descrizioniDiTuttiIframes = ExternalUtilities.creaMatrice(environment.quantiFrames, environment.quantiSottoFrames, '');
              this.prendeDescrizioniDiTuttiIframes();

              // this.rinfrescaTuttiIframes('Effettua Caricamento');

              if (this.debugCaricamentoDashboard === true) {
                d = new Date();
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Frames rinfrescati', d);
              }

              this.tipoMappeCaricate = JSON.parse(JSON.stringify(this.impostazioni.mapType));

              // this.settaVisteDaPassare();

              if (this.debugCaricamentoDashboard === true) {
                d = new Date();
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Viste da passare settate', d);
              }

              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize, this.impostazioni.maskVisible);
              // this.gest_finestre.controllaPerRighe(this);

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni);
              this.impostaCellSetSuFrame()

              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misura globale', this.impostazioni.globalMeasure)
              if (this.impostazioni.globalMeasure) {
                const m = JSON.parse(this.impostazioni.globalMeasure);
                if (m.length > 0) {
                  // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misura globale parsato', m);
                  // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure', this.measureData);
                  // // logConsole('MISURE', this.impostazioni.globalMeasure, m, m.length);

                  this.measureData.forEach(element => {
                    if (m.MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
                      this.Utilities.tipoMisuraGlobale = +element.TYPE;
                      this.impostazioni.tipoMisuraGlobale = +element.TYPE;
                    }
                  });
                }
              }

              if (this.impostazioni.globalMeasureArfcn) {
                const m = JSON.parse(this.impostazioni.globalMeasureArfcn);
                if (m.length > 0) {
                  // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misura globale parsato', m);
                  // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure', this.measureData);
                  // // logConsole('MISURE', this.impostazioni.globalMeasure, m, m.length);

                  this.measureData.forEach(element => {
                    if (m.MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
                      this.Utilities.tipoMisuraGlobaleArfcn = +element.TYPE;
                      this.impostazioni.tipoMisuraGlobaleArfcn = +element.TYPE;
                    }
                  });
                }
              }
              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo Misura globale', this.impostazioni.tipoMisuraGlobale)

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DATASET: ', this.datiActivitySet[0].NAME);
              if (this.datiActivitySet[0].NAME) {
                if (this.datiActivitySet[0].NAME.indexOf('[AGN] ') > -1) {
                  this.stringaAGNoACT = this.datiActivitySet[0].NAME;
                  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PRESO DATASET: ', this.stringaAGNoACT);
                }
              }

              this.pageSelector = this.impostazioni.pageSelector;

              const tm2 = setTimeout(() => {
                clearTimeout(tm2);
                this.Utilities.caricataDashboard = true;
                this.dbWorkOnDashboard = false;

                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.Maximized, this.impostazioni.maximized, this.impostazioni.maskSize);
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
                  // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.Maximized, this.impostazioni.maximized, this.impostazioni.maskSize);
                }
                index = 0;
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize,this.impostazioni.Maximized);
                this.Utilities.dimensioniFrames = JSON.parse(JSON.stringify(this.impostazioni.maskSize));
                this.Utilities.dimensioniFramesModif = JSON.parse(JSON.stringify(this.impostazioni.maskSize));
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.dimensioniFrames);

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
                this.Utilities.dimensioniFrames = JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.pageSelector]));
                this.Utilities.dimensioniFramesModif = JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.pageSelector]));
                // RIMETTERE. SISTEMAZIONE LAYOUT

                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskVisible);

                // TOLTO PER CAPIRE SE DAVA PROBLEMI
                // this.gest_finestre.controllaPerRighe(this);
                // TOLTO PER CAPIRE SE DAVA PROBLEMI

                /* // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskVisible, this.impostazioni.maskSize,
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

                this.massimizzata = [ false, false, false, false, false, false, false, false, false, false];
                if (this.impostazioni.frameMassimizzato > -1) {
                  this.massimizzata[this.impostazioni.frameMassimizzato] = true;
                }

                if (!this.mapTypeG || this.mapTypeG === null || +this.mapTypeG < 1) {
                  this.mapTypeG = 1;
                }

                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  // this.impostazioni.titoloFrame = JSON.parse(JSON.stringify(this.impostazioni.frameName));

                  this.impostazioniIniziali = JSON.parse(JSON.stringify(this.impostazioni));
                  this.checkDifferenceFromStartJSON();

                  this.impostaValoriMascheraProgetto = !this.impostaValoriMascheraProgetto;

                  this.primaPartenzaEffettuata = true;

                  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'VALORI IMPOSTAZIONI', this.impostazioni.maskSizeHor);
                  this.LeggeActivities2();

                  if (this.impostazioni.maskSize[1][this.pageSelector] === 0 && this.impostazioni.maskSize[2][this.pageSelector] === 0 &&
                    this.impostazioni.maskSize[3][this.pageSelector] === 0) {
                    this.impostazioni.nascoste123 = true;
                  } else {
                    this.impostazioni.nascoste123 = false;
                  }

                  /*  const t = setInterval(() => {
                    clearInterval(t);
                  }, 1000);*/

                  if (!this.impostazioni.pageSelector) { this.impostazioni.pageSelector = 1; }
                  // this.dashboardSelezionata = -999;
                  const tm1 = setTimeout(() => {
                    clearTimeout(tm1);
                    this.pageSelector = this.impostazioni.pageSelector;
                    this.ultimaPaginaSelezionata = this.pageSelector;
                    this.impostazioni.datiPageSelector.DataTable.forEach(element => {
                      if (+element.id === +this.pageSelector) {
                        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pagina selezionata per nome', element);
                        let nome = element.value;
                        nome = nome.replace(element.id + ': ', '');
                        this.nomePaginaSelezionata = nome;
                        this.selectPageSelector([element]);
                      }
                    });

                    const nomi = JSON.parse(JSON.stringify(this.impostazioni.frameName));
                    if (nomi[0].length < environment.quantiSottoFrames - 1) {
                      nomi.forEach(element => {
                        for (let i = element.length; i < environment.quantiSottoFrames; i++) {
                          element.push('<empty>');
                        }
                      });
                      // // logConsole('Nomi frames 3: ', nomi);
                      this.impostazioni.frameName = nomi;
                    }

                    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'VALORI IMPOSTAZIONI', this.impostazioni);
                    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'VALORI IMPOSTAZIONI TIPO FRAME', this.MappaOGraficoTutti);

                    // this.dashboardSelezionata = q.toString();
                    // const tm = setTimeout(() => {
                    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sla letto', this.impostazioni.slaValueGlobale);
                    this.selectSla(this.impostazioni.slaValueGlobale);
                    // }, 100);
    
                    const md = localStorage.getItem('ModalitaDebug');
                    if (md !== null) {
                      this.debug2 = (md === 'S' ? true : false);
                    } else {
                      this.debug2 = false;
                    }

                    // this.isVisibileBars = this.impostazioni.isVisibileBars;
                    const nn = localStorage.getItem("VisibleMenues_" + this.userName);
                    let n = true;
                    if (nn !== null) {
                      n = (nn === 'S' ? true : false);
                    }
                    this.isVisibileBars = n;
                    this.menuAperti = n;
                    
                    logConsole('IMPOSTAZIONI CARICATE: ', this.impostazioni);
                  }, 1000);

                }, 1000);

                if (this.debugCaricamentoDashboard === true) {
                  d = new Date();
                  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fine caricamento', d);
                }
              }, 1000);
            }
          } else {
            this.dbWorkOnDashboard = false;
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Config JSON nullo');
            // ExternalUtilities.messaggioDiErroreEsterno(this, 'Config JSON null for this dashboard');

            this.resettaValoriSuMaschera();
          }
        } else {
          this.dbWorkOnDashboard = false;
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Problemi nella lettura del Config JSON');
          // ExternalUtilities.messaggioDiErroreEsterno(this, 'Config JSON error for this dashboard');

          this.resettaValoriSuMaschera();

          if (data && data.RESULT && data.RESULT[0].message.toUpperCase() !== 'OK') {
            ExternalUtilities.messaggioDiErroreEsterno(this, data.RESULT[0].message);
          }
        }
      }, error => {
        this.dbWorkOnDashboard = false;
        this.impostaValoriDefault();
        ExternalUtilities.messaggioDiErroreEsterno(this, 'Error in load dashboard:' + error);
      });

      // this.controllaEsistenzaValoriCombo();
    }, 1000);
  }

  impostaCellSetSuFrame() {
    let q = 0;
    const selA = localStorage.getItem(this.userName + '_SelAntenne_GA');
    if (selA != null) {
      const tt = setInterval(() => {
        if (this.datiGrigliaAntenne && this.datiGrigliaAntenne.DataTable && this.datiGrigliaAntenne.DataTable.length > 0) {
          clearInterval(tt);

          this.datiGrigliaAntenne.DataTable.forEach(element => {
            if (+element.ROW_ID === +selA) {
              this.selezioneAntenne = [selA];
              this.cellSet = element.VALUE_STR;
              this.cellSetRow = [element.ROW_ID];
              this.selezioneAntenne = element.ROW_ID;
              
              logConsole('SELEZIONE ANTENNE', selA, this.selezioneAntenne, this.cellSet, this.cellSetRow);
            }
          });
        } else {
          q++;
          if (q > 10) {
            clearInterval(tt);
          }
        }
      }, 500);
    }      
  }

  resettaValoriSuMaschera() {
    this.impostaValoriDefault();

    this.checkDifferenceFromStartJSON();
    this.aggiornaLarghezzaContenitore();

    this.dashboardSelectedDescription = '';
    this.showTimeCursor = true;
    // this.dashboardSelected = 'empty';
    // this.dashboardSelected2 = 'empty';

    this.rinfrescaTuttiIframes('Resetta valori su maschera');

    this.settaMascheraVuota = !this.settaMascheraVuota;
  }

  aggiornaLarghezzaContenitore() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AggiornaLarghezzaContenitore');
    this.larghezzaContenitore = this.sanitizer.bypassSecurityTrustStyle('calc(100%)'); // - (' + (this.dimeDrawer + 3) + 'px)');
  }

  /* apriChiudiDrawer() {
    if (this.dimeDrawer === this.dimeDrawerInizio) {
      this.dimeDrawer = this.maxDimeDrawer; // this.impostazioni.actualDimeDrawer;
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
  } */

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
    return;

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onResizingDrawer');
    this.dimeDrawer = e.size.width;
    this.impostazioni.actualDimeDrawer = this.dimeDrawer;
    this.aggiornaLarghezzaContenitore();

    /* this.refreshMaschera.forEach(element => {
      element = !element;
    }); */

    this.checkDifferenceFromStartJSON();
  }

  onResizingDrawer2(e) {
    return;

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onResizingDrawer');
    this.dimeDrawer2 = e.size.width;
    this.impostazioni.actualDimeDrawer2 = this.dimeDrawer2;
    this.aggiornaLarghezzaContenitore();

    /* this.refreshMaschera.forEach(element => {
      element = !element;
    }); */

    this.checkDifferenceFromStartJSON();
  }

  cambioNomeFrame(f, n, e) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (e !== undefined && e !== null) {
        /* const nn = new Array();
        let q = 0;
        this.impostazioni.frameName[+n].forEach(element => {
          nn.push(element);
          q++;
        });
        nn[f] = e;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio nome frame ' + +n + ' pagina ' + +f + ': Creo array ', nn, e);
        this.impostazioni.frameName[+n] = JSON.parse(JSON.stringify(nn)); */
        this.impostazioni.frameName[+f][+n] = e;
        this.creaNomiFrames(false);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio nome frame ' + +f + ' pagina ' + +n + ': ', e);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.frameName[+f]);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.frameName[+f][+n]);

        this.checkDifferenceFromStartJSON();
      } else {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio nome frame ' + +n + ' pagina ' + +f + ': valore nullo ', e);
      }
    }, 10);
  }

  prendeDescrizioniDiTuttiIframes() {
    // logConsole('Impostazioni finali', this.impostazioni.frameDesc);
    
    const descrizioniDiTuttiIframes = new Array();
    for (let i = 0; i <= environment.quantiFrames; i++) {
      const descFrame = new Array();
      for (let k = 0; k <= environment.quantiSottoFrames; k++) {
        descFrame.push(this.impostazioni.frameDesc[k][i]);
      }
      descrizioniDiTuttiIframes.push(descFrame);
    }
    this.descrizioniDiTuttiIframes = descrizioniDiTuttiIframes;
    // logConsole('Descrizioni di tutti i frames', this.impostazioni.frameDesc, this.descrizioniDiTuttiIframes);
  }

  cambioDescFrame(f, n, e) {
    this.impostazioni.frameDesc[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio desc frame 1: ', e);
    this.prendeDescrizioniDiTuttiIframes();

    this.checkDifferenceFromStartJSON();
  }

  cambioMG(f, n, e) {
    if (this.impostazioni.MappaOGrafico && this.impostazioni.MappaOGrafico[f] && this.impostazioni.MappaOGrafico[f][n] !== e) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo frame', n, e);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vecchio tipo frame', this.impostazioni.MappaOGrafico[f][n]);

      this.impostazioni.MappaOGrafico[f][n] = e;
      const v = new Array();
      for (let i = 0; i <= environment.quantiSottoFrames; i++) {
        v.push(this.impostazioni.MappaOGrafico[i][n]);
      }
      if (this.MappaOGraficoTutti) {
        this.MappaOGraficoTutti[n] = v;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mappa o grafico 1:', e);
        if (this.impostazioni.MappaOGrafico[f][n] === 'M') {
          this.resetPosition();
        }
      }
      this.checkDifferenceFromStartJSON();
    }
  }

  cambiooverviewZoom(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio overview zoom', f, n, e);
    if (e !== undefined && this.impostazioni.overviewZoom && this.impostazioni.overviewZoom[f]) {
      this.impostazioni.overviewZoom[f][n] = e;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.overviewZoom);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio global view:', f, n, e);
      this.checkDifferenceFromStartJSON();
    }
  }

  cambioViewAs(f, n, e) {
    this.impostazioni.viewAs[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio view as 1:', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoMappa(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo mappa:', e);
    this.impostazioni.mapType[f][n] = e;
    this.tipoMappeCaricate[n] = e;

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato tipo mappa: ', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioIsCheckedSC(f, n, e) {
    this.impostazioni.isCheckedServingCell[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioIsCheckedSP(f, n, e) {
    this.impostazioni.isCheckedShowPaths[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show paths', this.impostazioni.isCheckedShowPaths[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioIsCheckedSSP(f, n, e) {
    if (this.impostazioni.isCheckedShowSelectedPaths === undefined || this.impostazioni.isCheckedShowSelectedPaths[0] === undefined || this.impostazioni.isCheckedShowSelectedPaths[0][0] === undefined) {
      this.impostazioni.isCheckedShowSelectedPaths = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }

    this.impostazioni.isCheckedShowSelectedPaths[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show paths', this.impostazioni.isCheckedShowPaths[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioShowRays(f, n, e) {
    this.impostazioni.showRays[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show rays', this.impostazioni.showRays[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoDataset(f, n, e) {
    if (e) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.showMeasuresS);
      this.impostazioni.tipoDataset[f][n] = e;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo dataset', f, n, e, this.impostazioni.tipoDataset[f]);
      this.checkDifferenceFromStartJSON();
    }
  }

  cambioSartPosition(f, n, e) {
    this.impostazioni.sartPosition[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show paths', this.impostazioni.isCheckedShowPaths[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioMeasureSMS(f, n, e) {
    this.impostazioni.measureSMS[f][n] = e;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', this.impostazioni.measureSMS[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioMappeMS(f, n, e) {
    this.impostazioni.mappeMS[f][n] = e;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mappe MS', this.impostazioni.mappeMS[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioClusterMeasure(f, n, e) {
    this.impostazioni.clusterMeasure[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', this.impostazioni.measureSMS[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioClusterMeasure2(f, n, e) {
    this.impostazioni.clusterMeasure2[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', this.impostazioni.measureSMS[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  /* cambioLov(f, n, e) {
    this.impostazioni.lov[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', this.impostazioni.measureSMS[f][n]);
    this.checkDifferenceFromStartJSON();
  } */

  cambioCorrelation(f, n, e) {
    this.impostazioni.correlation[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', this.impostazioni.measureSMS[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioTextFilter(f, n, e) {
    this.impostazioni.textFilter[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', this.impostazioni.measureSMS[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  cambioTextFilter2(f, n, e) {
    this.impostazioni.textFilter2[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', this.impostazioni.measureSMS[f][n]);
    this.checkDifferenceFromStartJSON();
  }

  /* cambioTextLov(f, n, e) {
    this.impostazioni.textLov[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', this.impostazioni.measureSMS[f][n]);
    this.checkDifferenceFromStartJSON();
  } */

  cambioGlobalLayer(f, n, e) {
    // // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', f, n, e);
    this.impostazioni.addGlobalLayer[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioMeasureRCM(f, n, e) {
    // // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure SMS', f, n, e);
    this.impostazioni.measureRCM[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioShowRaysAllLayer(f, n, e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio showRaysAllLayer', f, n, e);
    this.impostazioni.showRaysAllLayer[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoMisuraGlobale(e) {
    this.impostazioni.tipoMisuraGlobale = e;
    this.Utilities.tipoMisuraGlobale = e;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo global measure', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioIsCheckedAntenne(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio antenne frame ' + n + ':', e);
    // if (e === 1) {
      this.impostazioni.isCheckedAntenne[f][n] = e;
    // } else {
    //   this.impostazioni.isCheckedAntenne[n] = false;
    // }
    this.checkDifferenceFromStartJSON();
  }

  cambioNonSyncEventTime(f, n, e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio isNonSyncEventTime Frame ' + f + ' Pagina ' + n + ':', e);
    //
    if (!this.impostazioni.isNonSyncEventTime) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiustato array isNonSync', this.impostazioni.isNonSyncEventTime);
      this.impostazioni.isNonSyncEventTime = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
    }
    // if (this.impostazioni.isNonSyncEventTime[f]) {
      this.impostazioni.isNonSyncEventTime[f][n] = e;
    // }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio isNonSyncEventTime Frame ' + f + ' Pagina ' + n + ':', this.impostazioni.isNonSyncEventTime[f][n]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio isNonSyncEventTime Frame ' + f + ' Pagina ' + n + ':', this.impostazioni.isNonSyncEventTime[f]);
    // } else {
    //   this.impostazioni.isCheckedAntenne[n] = false;
    // }
    this.checkDifferenceFromStartJSON();
  }

  cambiateMisureTCRUN(f, n, e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio misure tcrun addizionali Frame ' + f + ' Pagina ' + n + ':', e);
    if (!this.impostazioni.misureAddizionaliTCRUN || !this.impostazioni.misureAddizionaliTCRUN[f] || !this.impostazioni.misureAddizionaliTCRUN[f][n]) {
      this.impostazioni.misureAddizionaliTCRUN = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, ['', '', '', '']);
    }
    this.impostazioni.misureAddizionaliTCRUN[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambiatoHeightChart(f, n, e) {
    if (e) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio height chart Frame ' + f + ' Pagina ' + n + ':', e);
      if (!this.impostazioni.heightChart || !this.impostazioni.heightChart[f] || !this.impostazioni.heightChart[f][n]) {
        this.impostazioni.heightChart = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 'X1');
      }
      this.impostazioni.heightChart[f][n] = e;
      this.checkDifferenceFromStartJSON();
    }
  }

  cambioShowAxisX(f, n, e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio showAxisX Frame ' + f + ' Pagina ' + n + ':', e);
    //
    if (!this.impostazioni.showAxisX || !this.impostazioni.showAxisX[f] || !this.impostazioni.showAxisX[f][n]) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiustato array showAxisX', this.impostazioni.showAxisX);
      this.impostazioni.showAxisX = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    // if (this.impostazioni.isNonSyncEventTime[f]) {
      this.impostazioni.showAxisX[f][n] = e;
    // }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio showAxisX Frame ' + f + ' Pagina ' + n + ':', this.impostazioni.showAxisX[f][n]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio showAxisX Frame ' + f + ' Pagina ' + n + ':', this.impostazioni.showAxisX[f]);
    // } else {
    //   this.impostazioni.isCheckedAntenne[n] = false;
    // }
    this.checkDifferenceFromStartJSON();
  }

  cambioMeasure(f, q, e) {
    this.impostazioni.measure[f][q] = e;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio misure', this.impostazioni.measure[f]);
    this.checkDifferenceFromStartJSON();
  }

  cambioOverlay(f, q, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio misura overlay', q, e);
    this.impostazioni.overlay[f][q] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioOverlayCluster(f, q, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio misura overlay cluster', q, e);
    this.impostazioni.overlayCluster[f][q] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioTimeFilter(f, q, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio timeFilter', f, q, e);
    this.impostazioni.timeFilter[f][q] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioBboxOZ(f, q, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio bboxOZ', f, q, e);
    /* this.impostazioni.bboxOZ[f][q] = e;
    if (this.bboxZ && this.bboxZ[f] && this.bboxZ[f][q]) { this.bboxZ[f][q] = e };
    /* if (e ===  '1' || e === true) {
      this.bbox = this.bboxO;
    } else {
      this.bbox = this.bboxZ;
    } * /
    switch (+e) {
      case 3:
        break;
      case 1:
        this.bbox = { frame: q, valori: this.bboxO }; // this.bboxO;
        break;
      case 2:
        this.bbox = { frame: q, valori: this.bboxZ }; // this.bboxZ;
        break;
    }

    // // logConsole('BBOX 1: ', this.bbox);

    this.checkDifferenceFromStartJSON(); */
  }

  cambioHistDisplayAs(f, q, e) {
    this.impostazioni.histDisplayAs[f][q] = e;
    this.impostazioni.histDisplayAs = JSON.parse(JSON.stringify(this.impostazioni.histDisplayAs));
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo istogramma', f, q, e, this.impostazioni.histDisplayAs[f][q]);
    this.checkDifferenceFromStartJSON();
  }

  cambioHistDisplayTutto(f, q, e) {
    this.impostazioni.histDisplayTutto[f][q] = e;
    this.impostazioni.histDisplayTutto = JSON.parse(JSON.stringify(this.impostazioni.histDisplayTutto));
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo istogramma', f, q, e, this.impostazioni.histDisplayTutto[f][q]);
    this.checkDifferenceFromStartJSON();
  }

  cambioPlanimetry(f, q, e) {
    this.impostazioni.showPlanimetry[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio planimetry', f, q, e, this.impostazioni.showPlanimetry[f][q]);
    this.impostazioni.showPlanimetry = JSON.parse(JSON.stringify(this.impostazioni.showPlanimetry));
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoEvento(f, q, e) {
    this.impostazioni.tipoEvento[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo evento', f, q, e, this.impostazioni.tipoEvento[f][q]);
    this.impostazioni.tipoEvento = JSON.parse(JSON.stringify(this.impostazioni.tipoEvento));
    this.checkDifferenceFromStartJSON();
  }

  cambioStyleSize(f, q, e) {
    this.impostazioni.styleSize[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio style size', f, q, e, this.impostazioni.styleSize[f][q]);
    this.impostazioni.styleSize = JSON.parse(JSON.stringify(this.impostazioni.styleSize));
    this.checkDifferenceFromStartJSON();
  }

  cambioCellType(f, q, e) {
    this.impostazioni.cellType[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cell type', f, q, e, this.impostazioni.cellType[f][q]);
    this.impostazioni.cellType = JSON.parse(JSON.stringify(this.impostazioni.cellType));
    this.checkDifferenceFromStartJSON();
  }

  cambioOpacity(f, q, e) {
    this.impostazioni.opacity[f][q] = e;
    this.impostazioni.opacity = JSON.parse(JSON.stringify(this.impostazioni.opacity));
    this.checkDifferenceFromStartJSON();
  }

  cambioAddLayers(f, q, e) {
    this.impostazioni.addLayers[f][q] = e;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio add layers', f, q, e, this.impostazioni.addLayers[f][q]);
    this.impostazioni.addLayers = JSON.parse(JSON.stringify(this.impostazioni.addLayers));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventi(f, q, e) {
    // alert('cambio filtro eventi page ' + f + ' frame ' + q + ': ' + e);
    this.impostazioni.filtriEventi[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    logConsole('Cambio filtro eventi in app', f, q, e, this.impostazioni.filtriEventi);
    this.impostazioni.filtriEventi = JSON.parse(JSON.stringify(this.impostazioni.filtriEventi));
    this.checkDifferenceFromStartJSON();
  }

  /* cambioFiltroEventiEscluso(f, q, e) {
    // alert('cambio filtro eventi page ' + f + ' frame ' + q + ': ' + e);
    this.impostazioni.filtroEventiEscluso[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiEscluso = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiEscluso));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol1(f, q, e) {
    this.impostazioni.filtroEventiCol1[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol1 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol1));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol2(f, q, e) {
    this.impostazioni.filtroEventiCol2[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol2 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol2));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol3(f, q, e) {
    this.impostazioni.filtroEventiCol3[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol3 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol3));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol4(f, q, e) {
    this.impostazioni.filtroEventiCol4[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol4 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol4));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol5(f, q, e) {
    this.impostazioni.filtroEventiCol5[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol5 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol5));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol6(f, q, e) {
    this.impostazioni.filtroEventiCol6[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol6 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol6));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol7(f, q, e) {
    this.impostazioni.filtroEventiCol7[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol7 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol7));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol8(f, q, e) {
    this.impostazioni.filtroEventiCol8[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol8 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol8));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol9(f, q, e) {
    this.impostazioni.filtroEventiCol9[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol9 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol9));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol10(f, q, e) {
    this.impostazioni.filtroEventiCol10[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol10 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol10));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol11(f, q, e) {
    this.impostazioni.filtroEventiCol11[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol11 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol11));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol12(f, q, e) {
    this.impostazioni.filtroEventiCol12[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol12 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol12));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol13(f, q, e) {
    this.impostazioni.filtroEventiCol13[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol13 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol13));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol14(f, q, e) {
    this.impostazioni.filtroEventiCol14[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol14 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol14));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol15(f, q, e) {
    this.impostazioni.filtroEventiCol15[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol15 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol15));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol16(f, q, e) {
    this.impostazioni.filtroEventiCol16[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol16 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol16));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol17(f, q, e) {
    this.impostazioni.filtroEventiCol17[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol17 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol17));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol18(f, q, e) {
    this.impostazioni.filtroEventiCol18[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol18 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol18));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol19(f, q, e) {
    this.impostazioni.filtroEventiCol19[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol19 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol19));
    this.checkDifferenceFromStartJSON();
  }

  cambioFiltroEventiCol20(f, q, e) {
    this.impostazioni.filtroEventiCol20[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio filtro eventi', f, q, e, this.impostazioni.filtroEventi[f][q]);
    this.impostazioni.filtroEventiCol20 = JSON.parse(JSON.stringify(this.impostazioni.filtroEventiCol20));
    this.checkDifferenceFromStartJSON();
  } */

  cambioFixedSeconds(f, q, e) {
    this.impostazioni.fixedSeconds[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio fixed seconds', f, q, e, this.impostazioni.fixedSeconds[f][q]);
    this.impostazioni.fixedSeconds = JSON.parse(JSON.stringify(this.impostazioni.fixedSeconds));
    this.checkDifferenceFromStartJSON();
  }

  // cambioEventiSceltiES(f, q, e) {
  //   this.impostazioni.eventiSceltiES = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio eventi globali', f, q, e, this.impostazioni.eventiSceltiES[f][q]);
  //   this.checkDifferenceFromStartJSON();
  // }

  /* cambioColumnsSettings(f, q, e) {
    this.impostazioni.columnsSettings[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio column settings', f, q, e, this.impostazioni.columnsSettings[f][q]);
    this.impostazioni.columnsSettings = JSON.parse(JSON.stringify(this.impostazioni.columnsSettings));
    this.checkDifferenceFromStartJSON();
  } */

  cambioColumnsBars(f, q, e) {
    this.impostazioni.columnsBars[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioDoubleGraph(f, q, e) {
    this.impostazioni.doubleGraph[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioListaCampiTCRP(f, q, e) {
    this.impostazioni.listaCampiTCRP[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioDimensioniSplitTcRun(f, q, e) {
    this.impostazioni.dimensioniSplitTcRun[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioImpostazioniPivot(f, q, e) {
    this.impostazioni.impostazioniPivotGrid[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    // logConsole('Impostazioni pivot', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoDatiLayout(f, q, e) {
    this.impostazioni.tipoDatiLayout[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    // logConsole('tipoDati Layout', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioEventsMeasure(f, q, e) {
    this.impostazioni.eventsMeasure[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  cambioDesignInfo(q, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio designInfo', q, e);
    this.designInfo[q] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioSla(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio sla da frame ' + n, e);
    this.slaValue[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio sla 1:', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioActivity(f, n, e) {
    const ee: number = +e;

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity del frame ' + n + '/SF ' + f + ' -> ', e);

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

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome sets: ', this.activitySetName);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome set ' + e + ': ', this.activitySetName[+e]);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'activityName: ', this.activityName);
    // this.impostazioni.activity[n] = ee;
    // this.activitySet[n] = ee;
    // this.activityName[n] = this.activitySetName[+e];


    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numero activity impostate:', this.impostazioni.activity);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi activity impostate:', this.activityName);

    // this.impostaNomiActivity(n, e);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity:', this.activitySetName[ee]);

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numero activity impostate 2:', this.impostazioni.activity);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi activity impostate 2:', this.activityName);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activityName);

    // this.calcolaCentro = !this.calcolaCentro;

    // AppComponent.CambioTmsSelezionato(this.Utilities, 0, 'Cambio activity', this.timerAttivatoAuto);

    this.cambioTmsSelezionatoConControlloGPS(0, 'Cambio activity', false);

    this.checkDifferenceFromStartJSON();
    this.rinfrescaTuttiIframes('Cambio Activity');
  }

  impostaNomiActivity(f, n, e) {
    let nomeActivity = null;
    // let numeroActivity = -1;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo e:', e, typeof(e));
    if (e !== 'empty' && typeof(e) !== 'object') {
      nomeActivity = this.activitySetName[e];
      // numeroActivity = e;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta nome activity:', f, n, e, nomeActivity);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca: ', this.datiActivitySet, e);
      /* this.datiActivitySet.forEach(element => {
        if (nomeActivity === null) {
          if (element.NAME === confronto) {
            nomeActivity = element;
          }
        }
      }); */
    } else {
      nomeActivity = e;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Che numero devo mettere?', f, n, e);
    }
    // logConsole('Activity set 2', nomeActivity);
    this.nomeActivitySet = nomeActivity;
    this.act_set_originale = nomeActivity;
    this.ricaricaReport = new Date().toString();

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'N:', n);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome activity:', nomeActivity);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numeri activity set:', this.impostazioni.activity);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity names:', this.activityName);

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi nuove activity prima:', f, n, e, this.impostazioni.activity, nomeActivity, this.activityName);
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][1] === n) {
      this.activityName[f][1] = nomeActivity;
    }
    if (this.impostazioni.activity[f] && this.impostazioni.activity[f][2] === n) {
      this.activityName[f][2] = nomeActivity;
    }
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo 3:', this.impostazioni.activity[3], n);
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
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi nuove activity dopo:', f, n, e, this.impostazioni.activity, nomeActivity, this.activityName);
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
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.shownEvents[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioShowMeasures(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.showMeasures[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioShowVoiceCallMeasures(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.showVoiceCallMeasures[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioShowDataMeasures(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.showDataMeasures[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioshowCoverageMeasures(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.showCoverageMeasures[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioShowMeasuresS(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.showMeasuresS);
    this.impostazioni.showMeasuresS[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioSquareMeters(f, n, e) {
    this.impostazioni.squareMeters[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio square meters', this.impostazioni.squareMeters);
    this.checkDifferenceFromStartJSON();
  }

  cambioMosaicStyle(f, n, e) {
    this.impostazioni.mosaicStyle[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio square meters', this.impostazioni.squareMeters);
    this.checkDifferenceFromStartJSON();
  }

  cambioMeasureType(f, n, e) {
    this.impostazioni.measureType[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio square meters', this.impostazioni.squareMeters);
    this.checkDifferenceFromStartJSON();
  }

  cambioDoNotSetGM(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.doNotSetGM[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioModificaChart(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.shownEvents);
    this.impostazioni.modificaChart[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioBW(f, n, e) {
    this.impostazioni.bandwidth[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioHistogramEmit(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio count histogram del frame ' + n, e);
    this.impostazioni.countHistogram[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  cambioSeverityEmit(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio count histogram del frame ' + n, e);
    this.impostazioni.checkSeverity[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  undo() {
    // this.impostazioni = JSON.parse(JSON.stringify(this.impostazioniIniziali));
    // this.checkDifferenceFromStartJSON();
    // this.aggiornaLarghezzaContenitore();
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.dashboardSelezionata);
    let valore = this.dashboardSelezionata.ID;
    if (valore === undefined) { valore = this.dashboardSelezionata };
    this.effettuaCaricamento(valore);
  }

  saveDashboard(copia, riavvia) {
    if (copia) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Richiesta nome per salvataggio dashboard');
      this.dashboardNameComponentShowed = true;
    } else {
      this.salvataggioFisicoDashboardPR(riavvia);
    }
  }

  creaNuovaDashboardPR() {
    const folder = this.dashboardFolder;
    const description = '';
    const dateNow: Date = new Date();
    const update_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    const nome = 'new ' + update_ts;

    let desc = description;
    if (desc) {
      desc = desc.replace(/(\r\n|\n|\r)/gm, '');
    }

    // const impost = ExternalUtilities.sistemaJSONPerSalvarloSuDB(this.impostazioniDefault);

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, nome, folder, description, impost);

    logConsole('Salvataggio impostazioni', this.impostazioni);

    let jsonString = '{';
    jsonString += '"v_cntx": "' + ExternalUtilities.sessione + '",';
    jsonString += '"v_name": "' + nome + '",';
    jsonString += '"v_folder": "' + folder + '",';
    jsonString += '"v_description": "' + desc + '",';
    jsonString += '"v_config_json": [' + JSON.stringify(this.impostazioni) + '] ';
    jsonString += '}';

    this.salvaFileImpostazioni(jsonString);

    this.dbWorkOnDashboard = true;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(jsonString));

    this.apiService.chiamataPost(this.Utilities, 'geo_dashboard__ins', JSON.parse(jsonString))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Create new dashboard return:', data);

      if (+data[0].v_err_code === 0) {
        this.LeggeDashboardPR();

        const tm = setTimeout(() => {
          clearTimeout(tm);
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati dashboard: ', this.datiDashboard);
          this.datiDashboard.forEach(element => {
            if (element.NAME === nome) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto dashboard selezionata 7', element.ID);
              // logConsole('Select dashboard 5:', element);
              this.dashboardSelezionata = element.ID;
            }
          });
        }, 100);

        this.differenzeDiImpostazioni = false;
        this.dbWorkOnDashboard = false;
      } else {
        this.dbWorkOnDashboard = false;
        ExternalUtilities.visualizzaAlert(data[0].v_err_code + ': ' + data[0].v_failure_reason)
        ExternalUtilities.messaggioDiErroreEsterno(this, 'Create new dashboard: ' + data[0].v_failure_reason);
      }
    }, error => {
      this.dbWorkOnDashboard = false;
      ExternalUtilities.visualizzaAlert(JSON.stringify(error));
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Create new dashboard: ' + error);
    });
  }

  sistemaArrayDimensionePagine() {
    // Sistema array dimensione pagine
    for (let i = 0; i <= environment.quantePagine; i++) {
      const r1 = [ 33, 34, 33 ];
      const r2 = { PrimaRiga: r1, SecondaRiga: r1, TerzaRiga: r1, Orizzontale: r1 };

      if (!this.impostazioni.dimensioni[i] || this.impostazioni.dimensioni[i] === null) {
        this.impostazioni.dimensioni[i] = r2;
      } else {
        if (this.impostazioni.dimensioni[i].length !== 1) {
          this.impostazioni.dimensioni[i] = r2;
        }
      }
    }
    // Sistema array dimensione pagine
  }

  salvataggioFisicoDashBoardConNomePR(nome, folder, description) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Salvataggio dashboard con nome:', nome, folder);

    // const dash = this.Utilities.converteStringaInJSON(this.dashboardSelected);

    let desc = description;
    if (desc) {
      desc = desc.replace(/(\r\n|\n|\r)/gm, '');
    }

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.listaEventi[1][9]);

    this.sistemaArrayDimensionePagine();
    // const impost = ExternalUtilities.sistemaJSONPerSalvarloSuDB(this.impostazioni);

    let jsonString = '{';
    jsonString += '"v_cntx": "' + ExternalUtilities.sessione + '",';
    jsonString += '"v_name": "' + nome + '",';
    jsonString += '"v_folder": "' + folder + '",';
    jsonString += '"v_description": "' + desc + '",';
    jsonString += '"v_config_json": [' + JSON.stringify(this.impostazioni) + '] ';
    jsonString += '}';

    this.salvaFileImpostazioni(jsonString);

    this.dbWorkOnDashboard = true;

    this.apiService.chiamataPost(this.Utilities, 'geo_dashboard__ins', JSON.parse(jsonString))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data);
      if (data.length === 0) {
        this.dbWorkOnDashboard = false;
        ExternalUtilities.messaggioDiErroreEsterno(this, 'Trouble in save dashboard. Name already present ?');
      } else {
        if (+data[0].v_err_code === 0) {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Copy dashboard return:', data);

          this.LeggeDashboardPR();

          const tm = setTimeout(() => {
            clearTimeout(tm);
            // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati dashboard: ', this.datiDashboard, nome);
            this.datiDashboard.forEach(element => {
              if (element.NAME === nome) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Carico dashboard da salvataggio: ', element);
                this.selectDashboard(element, true, 'Carico dashboard da salvataggio');
                this.forzaSelezioneDashboard = element;
              }
            });
          }, 100);

          this.differenzeDiImpostazioni = false;
          this.dbWorkOnDashboard = false;
        } else {
          this.dbWorkOnDashboard = false;
          ExternalUtilities.visualizzaAlert(data[0].v_err_code + ': ' + data[0].v_failure_reason)
          ExternalUtilities.messaggioDiErroreEsterno(this, 'Create dashboard: ' + data[0].v_failure_reason);
        }
      }
    }, error => {
      this.dbWorkOnDashboard = false;
      ExternalUtilities.visualizzaAlert(JSON.stringify(error));
      ExternalUtilities.messaggioDiErroreEsterno(this, 'Create dashboard: ' + error);
    });
  }

  salvaFileImpostazioni(j) {
    return;

    // Tolto... Non serve più
    this.checkDifferenceFromStartJSON();

    // this.dimensioniJSON += 'Totale impostazioni;' + JSON.stringify(this.impostazioni).length + '\n';
    // this.dimensioniJSON += 'Totale chiamata;' + j.length + '\n';

    const nomeFile = ExternalUtilities.sistemaNomeFrame(this, 'GeoAnts_Impostazioni_Dim') + '.csv';
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, nomeFile);
    // const FileSaver = require('file-saver');
    ////const data2 = new Blob([this.dimensioniJSON], {type: 'text/plain;charset=utf-8'});
    // FileSaver.saveAs(data2, nomeFile);

    const nomeFile2 = ExternalUtilities.sistemaNomeFrame(this, 'GeoAnts_Impostazioni_Det') + '.json';
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, nomeFile);
    // const FileSaver2 = require('file-saver');
    const data22 = new Blob([JSON.stringify(this.impostazioni)], {type: 'application/json;charset=utf-8'});
    // FileSaver2.saveAs(data22, nomeFile2);
    download(data22, nomeFile2, 'application/json;charset=utf-8');
  }

  removeCircularReferences() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "null"; // Replace circular references
        seen.add(value);
      }
      return value;
    };
  }

  salvataggioFisicoDashboardPR(riavvia) {
    /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Salvataggio dashboard:', this.dashboardSelected);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi frames:', this.nomiFrames);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni Nomi Frames:', this.impostazioni.frameName);
    if (this.impostazioni.frameName.length > environment.quantiFrames + 1) {
      this.creaNomiFrames(true);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni 2:', this.impostazioni.frameName);
    }  */
    // return;

    const dash = ExternalUtilities.converteStringaInJSON(this.dashboardSelected);

    let desc = dash.DESCRIPTION;
    if (desc === null) { desc = ''; };
    if (desc) {
      desc = desc.replace(/(\r\n|\n|\r)/gm, '');
    }

    this.impostazioni = JSON.parse(JSON.stringify(this.impostazioni, this.removeCircularReferences()));

    logConsole('Impostazioni da salvare', this.impostazioni);
    
    const impo = JSON.parse(JSON.stringify(this.impostazioni));
    impo.listToPrint = this.listToPrint;

    if (this.impostazioni.impostazioniPivot) {
      delete this.impostazioni.impostazioniPivot;
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Salvataggio impostazioni', impo);

    // const impost = this.impostazioni; // ExternalUtilities.sistemaJSONPerSalvarloSuDB(this.impostazioni);

    let jsonString = '{';
    jsonString += '"v_cntx": "' + ExternalUtilities.sessione + '",';
    jsonString += '"v_id": "' + dash.ID + '",';
    jsonString += '"v_name": "' + dash.NAME + '",';
    jsonString += '"v_folder": "' + dash.FOLDER + '",';
    jsonString += '"v_description": "' + desc + '",';
    jsonString += '"v_config_json": [' + JSON.stringify(impo) + '] ';
    jsonString += '}';

    this.salvaFileImpostazioni(jsonString);

    this.dbWorkOnDashboard = true;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, jsonString);

    this.apiService.chiamataPost(this.Utilities, 'geo_dashboard__upd', JSON.parse(jsonString))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      if (+data[0].v_err_code === 0) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Update dashboard return:', data);
        if (riavvia) {
          this.LeggeDashboardPR();
        }

        this.impostazioniIniziali = JSON.parse(JSON.stringify(this.impostazioni));
        this.checkDifferenceFromStartJSON();
        this.dbWorkOnDashboard = false;
      } else {
        this.dbWorkOnDashboard = false;
        ExternalUtilities.visualizzaAlert(data[0].v_err_code + ': ' + data[0].v_failure_reason)
        ExternalUtilities.messaggioDiErroreEsterno(this, 'update dashboard: ' + data[0].v_err_code + ': ' + data[0].v_failure_reason);
      }
    }, error => {
      ExternalUtilities.visualizzaAlert(JSON.stringify(error));
      ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  cambioBarraAperta(f, n, e) {
    // alert('Refresh 2');
    this.impostazioni.barraAperta[f][n] = e;
    // this.impostazioni.barraAperta1 = e;
    this.refreshMap[n] = !this.refreshMap[n];
    this.checkDifferenceFromStartJSON();
  }

  visibileDaMascheraDashboardName(e) {
    this.dashboardNameComponentShowed = false;
  }

  confirmDashboardName(e) {
    if (e) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Name / Folder inseriti:', e);
      const c = e.split('§');
      const name = c[0];
      const folder = c[1];
      const desc = c[2];

      this.salvataggioFisicoDashBoardConNomePR(name, folder, desc);
    }
  }

  aggiornaListaEventi(f, n, e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi locali. Aggiornata lista eventi da frame ', f, n, e);
    /* if (typeof(e) === 'object') {

      this.impostazioni.listaEventi[f][n] = stringify(e);
    } else {
      if (typeof(e) === 'string') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '2-Aggiornata lista eventi da frame ', f, n, e);

        this.impostazioni.listaEventi[f][n] = e;
      } else {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Errore nel tipo eventi:', typeof(e));
      }
    } */
    // // logConsole('Lista eventi', e);
    this.impostazioni.listaEventi[f][n] = JSON.stringify(e);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi:', this.impostazioni.listaEventi);

    this.checkDifferenceFromStartJSON();
  }

  accordionApertoPerExport = false;

  // Pannelli del Context Menu: valore del p-accordion-panel, flag di apertura e caso di changeStateAccordion.
  // Con PrimeNG 18 (p-accordion-panel al posto di p-accordionTab [selected]) i flag non erano più collegati
  // all'accordion, e il clic sulle label Dashboard / Data Set non apriva più la sezione corrispondente.
  private static readonly PANNELLI_CONTEXT = [
    { valore: 'dashboardAccordionOpen', flag: 'dashboardAccordionOpen', caso: 1 },
    { valore: 'dataSetAccordionOpen', flag: 'dataSetAccordionOpen', caso: 2 },
    { valore: 'activityAccordionOpen', flag: 'activityAccordionOpen', caso: 3 },
    { valore: 'settingsAccordionOpen', flag: 'settingsAccordionOpen', caso: 4 },
    { valore: 'filtersAccordionOpen', flag: 'filtersAccordionOpen', caso: 5 },
    { valore: 'debugAccordionOpen', flag: 'debugAccordionOpen', caso: 6 },
    { valore: 'timeAccordionOpen', flag: 'timeAccordionOpen', caso: 7 },
    { valore: 'antenneAccordionOpen', flag: 'antenneAccordionOpen', caso: 8 },
    { valore: 'eventsAccordionOpen', flag: 'eventsAccordionOpen', caso: 9 },
    { valore: 'ltpAccordionExport', flag: 'exportAccordionOpen', caso: 10 },
    { valore: 'ltpAccordionOpen', flag: 'ltpAccordionOpen', caso: 11 },
  ];

  // Pannello aperto secondo i flag (null = tutti chiusi)
  get pannelloContextAperto(): string | null {
    const p = AppComponent.PANNELLI_CONTEXT.find(x => this[x.flag] === true);
    return p ? p.valore : null;
  }

  menuSelezionato = '0';

  // Apertura/chiusura di un pannello con il clic sull'intestazione: si aggiornano i flag come faceva il vecchio selectedChange
  cambioPannelloContext(valore) {
    this.menuSelezionato = valore;
    // console.log('Cambio menù: ', valore);

    const p = AppComponent.PANNELLI_CONTEXT.find(x => x.valore === valore);
    if (p) {
      if (this[p.flag] !== true) {
        this.changeStateAccordion(p.caso);
      }
    } else {
      AppComponent.PANNELLI_CONTEXT.forEach(x => this[x.flag] = false);
    }
  }

  changeStateAccordion(n) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio stato accordion')
    const tm = setTimeout(() => {
      clearTimeout(tm);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Premuto voce menu 1');
      // this.vociChiuseMenu = true; // !this.vociChiuseMenu;

      switch (n) {
        case 1:
          this.vecchioAccordionPerExportAperto = false;
          this.accordionApertoPerExport = false;
          this.dashboardAccordionOpen = true;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          this.debugAccordionOpen = false;
          this.timeAccordionOpen = false;
          this.antenneAccordionOpen = false;
          this.eventsAccordionOpen = false;
          this.exportAccordionOpen = false;
          this.ltpAccordionOpen = false;
          break;
        case 2:
          this.vecchioAccordionPerExportAperto = false;
          this.accordionApertoPerExport = false;
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = true;
          this.debugAccordionOpen = false;
          this.timeAccordionOpen = false;
          this.antenneAccordionOpen = false;
          this.eventsAccordionOpen = false;
          this.exportAccordionOpen = false;
          this.ltpAccordionOpen = false;
          break;
        case 3:
          this.vecchioAccordionPerExportAperto = false;
          this.accordionApertoPerExport = false;
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = true;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          this.debugAccordionOpen = false;
          this.timeAccordionOpen = false;
          this.antenneAccordionOpen = false;
          this.eventsAccordionOpen = false;
          this.exportAccordionOpen = false;
          this.ltpAccordionOpen = false;
          break;
        case 4:
          this.vecchioAccordionPerExportAperto = false;
          this.accordionApertoPerExport = false;
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = true;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          this.debugAccordionOpen = false;
          this.timeAccordionOpen = false;
          this.antenneAccordionOpen = false;
          this.eventsAccordionOpen = false;
          this.exportAccordionOpen = false;
          this.ltpAccordionOpen = false;
          break;
        case 5:
          this.vecchioAccordionPerExportAperto = false;
          this.accordionApertoPerExport = false;
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = true;
          this.dataSetAccordionOpen = false;
          this.debugAccordionOpen = false;
          this.timeAccordionOpen = false;
          this.antenneAccordionOpen = false;
          this.eventsAccordionOpen = false;
          this.exportAccordionOpen = false;
          this.ltpAccordionOpen = false;
          break;
        case 6:
          this.vecchioAccordionPerExportAperto = false;
          this.accordionApertoPerExport = false;
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          this.debugAccordionOpen = true;
          this.timeAccordionOpen = false;
          this.antenneAccordionOpen = false;
          this.eventsAccordionOpen = false;
          this.exportAccordionOpen = false;
          this.ltpAccordionOpen = false;
          break;
        case 7:
          this.vecchioAccordionPerExportAperto = false;
          this.accordionApertoPerExport = false;
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          this.debugAccordionOpen = false;
          this.timeAccordionOpen = true;
          this.antenneAccordionOpen = false;
          this.eventsAccordionOpen = false;
          this.exportAccordionOpen = false;
          this.ltpAccordionOpen = false;
          break;
        case 8:
          this.vecchioAccordionPerExportAperto = false;
          this.accordionApertoPerExport = false;
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          this.debugAccordionOpen = false;
          this.timeAccordionOpen = false;
          this.antenneAccordionOpen = true;
          this.eventsAccordionOpen = false;
          this.exportAccordionOpen = false;
          this.ltpAccordionOpen = false;
          break;
        case 9:
          this.vecchioAccordionPerExportAperto = false;
          this.accordionApertoPerExport = false;
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          this.debugAccordionOpen = false;
          this.timeAccordionOpen = false;
          this.antenneAccordionOpen = false;
          this.eventsAccordionOpen = true;
          this.exportAccordionOpen = false;
          this.ltpAccordionOpen = false;
          break;
        case 10:
          this.vecchioAccordionPerExportAperto = true;
          this.accordionApertoPerExport = true;
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          this.debugAccordionOpen = false;
          this.timeAccordionOpen = false;
          this.antenneAccordionOpen = false;
          this.eventsAccordionOpen = false;
          this.exportAccordionOpen = true;
          this.ltpAccordionOpen = false;
          break;
        case 11:
          this.vecchioAccordionPerExportAperto = false;
          this.accordionApertoPerExport = false;
          this.dashboardAccordionOpen = false;
          this.activityAccordionOpen = false;
          this.settingsAccordionOpen = false;
          this.filtersAccordionOpen = false;
          this.dataSetAccordionOpen = false;
          this.debugAccordionOpen = false;
          this.timeAccordionOpen = false;
          this.antenneAccordionOpen = false;
          this.eventsAccordionOpen = false;
          this.exportAccordionOpen = false;
          this.ltpAccordionOpen = true;
          break;
        }
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Stato accordion: ', this.settingsAccordionOpen);

      this.checkDifferenceFromStartJSON();
    }, 100);
  }

  premutoVoceMenu(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Premuto voce menu 2');
    // return;
    this.vociChiuseMenu = false;
    this.contextAperto = false;
    /* this.dashboardAccordionOpen = false;
    this.activityAccordionOpen = false;
    this.settingsAccordionOpen = false;
    this.filtersAccordionOpen = false;
    this.dataSetAccordionOpen = false;
    this.debugAccordionOpen = false;
    this.timeAccordionOpen = false; */
  }

  aggiornaView(n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorna view', e);
    /* if (!this.impostazioni.overviewZoom[n]) {
      this.viewOlLocal[n] = {...e};
    } */
    // this.viewOl = e;
  }

  csvImpostato(n, e) {
    /* if (this.ultimoCSV === JSON.stringify(e)) {
      return;
    }
    this.ultimoCSV = JSON.stringify(e); */
    const vals = e.split(';');
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CSV Impostato:', n, vals);
    let ok = true;
    let qq = '';

    const minLat: number = vals[1];
    const minLng: number = vals[2];
    const maxLat: number = vals[3];
    const maxLng: number = vals[4];

    this.csvView.forEach(element => {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element, vals[0]);
      if (element.indexOf(vals[0]) > -1) {
        element = vals[0];
        qq = element;
        ok = false;
      }
    });
    if (ok) {
      this.csvView.push(e);
    }
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, n, vals, this.csvView);

    this.mediaLon = (+maxLng + +minLng) / 2;
    this.mediaLat = (+maxLat + +minLat) / 2;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, maxLng, minLng, this.mediaLon);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, maxLat, minLat, this.mediaLat);

    // this.extent = transformExtent([ minLat, maxLat, minLng, maxLng ], 'EPSG:4326', 'EPSG:4326');

    // const f = 1;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto viste:', this.impostazioni.currZoom);

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
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Zooms:', zoomGlobale, qG, zoomLocale, qL);

    // for (let i = 0; i < 5; i++) { */
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

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista impostata:', this.impostazioni.frameAttivo[n], n,
    //   this.mediaLat, this.mediaLon, this.impostazioni.currZoom);

    // this.viewOlG[this.impostazioni.frameAttivo[n]][n] = viewG;
    // this.viewOlL[this.impostazioni.frameAttivo[n]][n] = viewL;

    this.centroAttuale[n] = this.mediaLon + ';' + this.mediaLat;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro attuale', n, this.centroAttuale[n]);

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
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato sla ', n, e);
    this.impostazioni.slaName[f][n] = e;
  }

  tabSelez(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tab selezionato frame ' + n + ': ', e);
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
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'premuto reposition');
    this.Utilities.premutoReposition = true;

    // this.extent = {};

    /*
    this.csvView = new Array();
    for (let nf = 1; nf <= 9 ; nf ++) {
      for (let fa = 1; fa <= 5 ; fa ++) {
        this.viewOlG[fa][nf] = undefined;
        this.viewOlL[fa][nf] = undefined;
        // this.impostazioni.currZoom[fa][nf] = 10;
      }
      this.centroAttuale[nf] = '';
    }

    this.calcolaCentro = !this.calcolaCentro; */
  }

  clickSuMappaEmit(n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click fatto su mappa ' + n + ':', e, this.impostazioni.MappaOGrafico);
    // let index = 0;
    // this.impostazioni.MappaOGrafico.forEach(element2 => {
      // const element = element2[this.impostazioni.frameAttivo[n]];
      // if (element === 'MC' || element === 'PS' || element === 'M') {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element, index);
        const tm = setTimeout(() => {
          clearTimeout(tm);
          for (let i = 1; i <= environment.quantiFrames; i++) {
            this.tmsSelezionatoPerGrafico[i] = e;
          }
        }, 10);
      // }
      // index++;
    // });
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.tmsSelezionatoPerGrafico);
  }

  selectTipoMappeStyle(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione map style', e);
    // localStorage.setItem('MapStyleContext', e.id);
    this.mapTypeS = e.id;
    this.impostazioni.mapTypeS = e;
  }

  /* valoreMappeMisureStyle(e) {
    if (e) {
      const tm = setTimeout(() => {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ultimo valore misure style mappe', e);
        this.mapTypeS = e.id;
      }, 100);
    }
  }

  valoreMappeStyle(e) {
    if (e) {
      const tm = setTimeout(() => {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ultimo valore style mappe', e);
        this.mapTypeG = e.id;
      }, 100);
    }
  } */

  clickHtml(h) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, h);
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

  lastE;
  cambioDataSet = false;
  appoggioTimeSpan;

  setTimeSpan(daDove) {
    /* const messaggio = 'Do you want apply selected value?';
    Swal.fire({
      title: '',
      text: messaggio,
      icon: 'warning',
      background: 'white',
      color: 'black',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    }).then((result) => { */
    this.impostaNonChiudere2(false);
    this.bCambioTimeRange = false;

    const attivato = this.timerAttivatoAuto;
    this.fermaTimerAuto();

    const dsr = JSON.parse(JSON.stringify(this.Utilities.datiActTimeSpan));
    let trovato = false;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Set timespan 1', dsr);
    dsr.forEach(element => {
      if (!trovato && element.id === this.appoggioTimeSpan) {
        trovato = true;
      }
    });
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Set timespan 2', trovato);
    if (!trovato) {
      const v2 = { id: this.appoggioTimeSpan, name: this.appoggioTimeSpan};
      dsr.push(v2);
      dsr.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));
    }
    // this.Utilities.datiActTimeSpan = undefined;
    // const tm = setTimeout(() => {

    this.Utilities.datiActTimeSpan = JSON.parse(JSON.stringify(dsr));

    this.Utilities.datiActTimeSpan.forEach(element => {
      if (+this.appoggioTimeSpan === +element.name) {
        // alert('Tempo impostato: ' + this.appoggioTimeSpan);
        // alert('Salvataggio valore: ' + element.name);
        this.valoreTimeSpan = +element.name;
        // logConsole('Valore time span 4: ', this.valoreTimeSpan);
        this.impostazioni.valoreTimeSpan = +element.name;
        this.selectActivityTimeSpan(element, daDove);
      }
    });

      // if (result.value) {
      // } else if (result.dismiss === Swal.DismissReason.cancel) {
      // }
    // });
    if (attivato) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'selectActivityTimeSpan: Faccio ripartire timer dopo aver fermato tutto per cambio range', this.appoggioTimeSpan);
        this.attivaTimerAuto('SelectTimeSpan');
      }, 1000);
    }
  }

  checkTS(e) {
    // alert(e);
    this.appoggioTimeSpan = e;
    // // logConsole('AppoggioTimeSpan 1', e);
  }

  changeTimeSpan(e) {
    // logConsole(e);
    if (e !== undefined) {
      if (!e.name) {
        /* if (e.indexOf('***') > -1) {
          const v = +e.replace('***', '');
          if (v !== 0) {            
            // this.controlloTimeRange('changeTimeSpan 1', v);

            const dsr = JSON.parse(JSON.stringify(this.Utilities.datiActTimeSpan));
            let trovato = false;
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo timespan 1', dsr);
            dsr.forEach(element => {
              if (!trovato && element.id === v) {
                trovato = true;
              }
            });
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo timespan 2', trovato);
            if (!trovato) {
              const v2 = { id: v, name: v};
              dsr.push(v2);
              dsr.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));
            }
            // this.Utilities.datiActTimeSpan = undefined;
            // const tm = setTimeout(() => {

              this.Utilities.datiActTimeSpan = JSON.parse(JSON.stringify(dsr));
              const tm = setTimeout(() => {
                this.valoreTimeSpan = +v;
              }, 100);
            // }, 50);
          }
        } */
        
          // // logConsole('AppoggioTimeSpan 3', e);
      } else {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'changeTimeSpan 2: Riga selezionata combo', e.name);
        this.appoggioTimeSpan = +e.name;
        this.valoreTimeSpan = +e.name;
        // logConsole('Valore time span 5: ', this.valoreTimeSpan);
        // this.controlloTimeRange('changeTimeSpan 1', e.name);
        
        // // logConsole('AppoggioTimeSpan 2', e);
      }
    }
  }

  selectActivityTimeSpan(e, daDove) {
    // alert('Attivo timer:' + daDove);
    // logConsole('CAMBIO ACTTIMESPAN',e , this.lastE, this.cambioDataSet);

    if (!e || (e && !e.name)) {
      return;
    }
    if (+e.name === +this.lastE || this.cambioDataSet) {
      return;
    }
    this.lastE = +e.name;

    this.appoggioTimeSpan = +e.name;
    this.valoreTimeSpan = +e.name;
    // logConsole('Valore time span 6: ', this.valoreTimeSpan);
    // alert('Time span: *' + e.name + '* -> *' + this.lastE + '* (' + this.cambioDataSet + ')');

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'selectActivityTimeSpan: ', e);
    if (e !== undefined) {
      // if (!e.name) {
        /* if (e.indexOf('***') > -1) {
          const v = +e.replace('***', '');
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, v);
          // if (isNumeric(v)) {
          if (v !== 0) {
            this.controlloTimeRange('selectActivityTimeSpan 1', v);
          }
        } */
      // } else {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'selectActivityTimeSpan: Riga selezionata combo', e.name);
        // this.Utilities.rangeDiSecondiPerMille = +e.name * 1000;
        // this.valoreTimeSpan = e.name;
        // this.Utilities.range = this.Utilities.rangeDiSecondiPerMille;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activityTimeSpan, this.Utilities.rangeDiSecondiPerMille);

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.Utilities.cambioTimeRange = new Date();

          if (this.Utilities.tmsSelezionato !== 0) {
            ExternalUtilities.creaRangeSelezionato('SATS 1 -> ' + daDove, this.Utilities.tmsSelezionato, this.Utilities, this.timerAttivatoAuto, +e.name);
          }
        }, 500);
      // } // else {

      let q = 0;
      const t = setInterval(() => {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS Selezionato', q);
        if (this.Utilities.tmsSelezionato) {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS Trovato', q, Utils.tmsSelezionato);
          clearInterval(t);
          // ExternalUtilities.creaRangeSelezionato('selectActivityTimeSpan 3', this.Utilities.tmsSelezionato, this.Utilities, this.timerAttivatoAuto);

          const attivato = this.timerAttivatoAuto;
          this.fermaTimerAuto();
          if (attivato) {
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'selectActivityTimeSpan: Faccio ripartire timer dopo aver fermato tutto per cambio range', e);
              this.attivaTimerAuto('SelectTimeSpan');
            }, 500);
          }
        } else {
          q++;
          if (q > 50) {
            clearInterval(t);
          }
        }
      }, 100);

    }
  }

  selectActivityTimeSpanRange(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e, e.name);
    if (e && e.name) {
      this.valoreTimeSpanRange = e.name;
    } else {
      if (e) {
        const v = +e.replace('***', '');
        logConsole('Selezione', v);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, v);
        // if (v !== 0) {
          // if (isNumeric(v)) {
          this.controlloTimeRange2('1', v);
        // } else {
        //   ExternalUtilities.messaggioDiErroreEsterno(this, v + ': Is not a valid value');
        // }
      }
    }
  }

  pad(num, size) {
    let s = num + '';
    while (s.length < size) { s = '0' + s };
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, s);
    return s;
  }

  /* valoreActivityTimeSpan(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore activity time stamp', e);
    if (e) {
      const tm = setTimeout(() => {
        if (e.name) {
          this.Utilities.cambioTimeRange = new Date();
          this.valoreTimeSpan = +e.name;
          this.Utilities.rangeDiSecondiPerMille = +e.name  * 1000;
        } else {
          this.Utilities.cambioTimeRange = new Date();
          this.valoreTimeSpan = +e;
          this.Utilities.rangeDiSecondiPerMille = +e * 1000;
        }
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.rangeDiSecondiPerMille);
      }, 100);
    }
  } */

  /* valoreActivityTimeSpanRange(e) {
    if (e) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      const tm = setTimeout(() => {
        if (e.name === undefined) {
          this.valoreTimeSpanRange = e;
        } else {
          this.valoreTimeSpanRange = e.name;
        }
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.valoreTimeSpanRange);
      }, 1000);
    }
  } */

  /* valoreStyleSize(e) {
    if (e) {
      const tm = setTimeout(() => {
        this.styleSizeG = e.id;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.styleSizeG);
      }, 100);
    }
  } */

  /* cambioDatiPointMeasures(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio dati Point Measures', e);
    const tm = setTimeout(() => {
      this.datiPointMeasures = e;
    }, 100);
  }

  cambioDatiActivityEvents(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio dati Point Measures', e);
    const tm = setTimeout(() => {
      this.datiActivityEvents = e;
    }, 100);
  } */

  clickDaActSetPerCambioActivity = false;

  confermaActivity(eee) {
    // return;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Conferma activity:', eee);
    if (eee) {
      const e = eee.split('§');
      const n = e[0]
      const ee = e[1];

      this.clickDaActSetPerCambioActivity = true;

      // this.activitySet[n] = JSON.parse(ee).ID;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Conferma activity:', JSON.parse(ee));
      this.forzaSelezioneActivitySet[n] = JSON.parse(ee);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, "Select tipo activity: Conferma Activity");
      // logConsole("Select tipo activity: Conferma Activity", JSON.parse(ee).NAME);
      const t = setTimeout(() => {
        // logConsole('cambio activity forzato 1:', n, JSON.parse(ee).NAME);
        this.selectTipoActivity(n, JSON.parse(ee).NAME, true);
      }, 1000);
    }
  }

  cambioCoordinateConClick(n, e) {
    this.coordinateConClick = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click coordinate', this.coordinate);
  }

  cambioCoordinate(n, e) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.coordinate = e;
    }, 10);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click coordinate', this.coordinate);
  }

  cambiataRotation(n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiata rotation:', n, e);
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.rotation = e;
    }, 100);
  }

  currZoomCambiato(f, n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio zoom frame', f, n, e);
    this.impostazioni.currZoom[f][n] = e;
    this.checkDifferenceFromStartJSON();
  }

  sistemaDimensioniFramesSuChiusura(primo, secondo) {
    if (this.impostazioni.maskSize[this.pageSelector][primo] === 0 && this.impostazioni.maskSize[this.pageSelector][secondo] > 0) {
      this.impostazioni.maskSize[this.pageSelector][secondo] = 100;
    } else {
      if (this.impostazioni.maskSize[this.pageSelector][primo] > 0 && this.impostazioni.maskSize[this.pageSelector][secondo] === 0) {
        this.impostazioni.maskSize[this.pageSelector][primo] = 100;
      } else {
        if (this.impostazioni.maskSize[this.pageSelector][primo] > 0 && this.impostazioni.maskSize[this.pageSelector][secondo] > 0) {
          this.impostazioni.maskSize[this.pageSelector][primo] = 50;
          this.impostazioni.maskSize[this.pageSelector][secondo] = 50;
        } else {
          this.impostazioni.maskSize[this.pageSelector][primo] = 0;
          this.impostazioni.maskSize[this.pageSelector][secondo] = 0;
        }
      }
    }
  }

  chiudeFrame(e) {
    // this.gest_finestre.chiudeFrame(this, e);
    // RIMETTERE. SISTEMAZIONE LAYOUT
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskVisible[this.pageSelector][e]);
    /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.pageSelector])));
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(JSON.stringify(this.impostazioni.maskVisible[this.pageSelector])));
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(JSON.stringify(this.impostazioni.maskVisible[this.pageSelector][e]))); */
    this.aggiustaArray.controllaImpostazioniSize(this, 'Chiude Frame');

    this.impostazioni.maskSize[this.pageSelector][e] = 0;
    // this.impostazioni.maskVisible[this.pageSelector][e] = false;

    if (e < 4) {
      let primo;
      let secondo;
      if (e == 1) { primo = 2; secondo = 3;}
      if (e == 2) { primo = 1; secondo = 3;}
      if (e == 3) { primo = 1; secondo = 2;}
      this.sistemaDimensioniFramesSuChiusura(primo, secondo);
    } else {
      if (e > 3 && e < 7) {
        let primo;
        let secondo;
        if (e == 4) { primo = 5; secondo = 6;}
        if (e == 5) { primo = 4; secondo = 6;}
        if (e == 6) { primo = 4; secondo = 5;}
        this.sistemaDimensioniFramesSuChiusura(primo, secondo);
      } else {
        let primo;
        let secondo;
        if (e == 7) { primo = 8; secondo = 9;}
        if (e == 8) { primo = 7; secondo = 9;}
        if (e == 9) { primo = 7; secondo = 8;}
        this.sistemaDimensioniFramesSuChiusura(primo, secondo);
      }
    }
    // this.gestisceFinestre(e);

    this.sistemaArrayDimensionePagine();

    // alert('DIMENS 1');
    this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[0] = this.impostazioni.maskSize[this.pageSelector][1];
    this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[1] = this.impostazioni.maskSize[this.pageSelector][2];
    this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[2] = this.impostazioni.maskSize[this.pageSelector][3];

    this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[0] = this.impostazioni.maskSize[this.pageSelector][4];
    this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[1] = this.impostazioni.maskSize[this.pageSelector][5];
    this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[2] = this.impostazioni.maskSize[this.pageSelector][6];

    this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[0] = this.impostazioni.maskSize[this.pageSelector][7];
    this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[1] = this.impostazioni.maskSize[this.pageSelector][8];
    this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[2] = this.impostazioni.maskSize[this.pageSelector][9];

    // alert('HOR 3');
    this.impostazioni.dimensioni[this.pageSelector].Orizzontale[0] = this.impostazioni.maskSizeHor[this.pageSelector][1];
    this.impostazioni.dimensioni[this.pageSelector].Orizzontale[1] = this.impostazioni.maskSizeHor[this.pageSelector][2];
    this.impostazioni.dimensioni[this.pageSelector].Orizzontale[2] = this.impostazioni.maskSizeHor[this.pageSelector][3];
  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.pageSelector])));
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(JSON.stringify(this.impostazioni.maskVisible[this.pageSelector])));

    // alert('SISTHOR 1'); 28/05/2024
    this.gest_finestre.sistemaHor(this, e);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura frame: size:', this.impostazioni.maskSize[this.pageSelector]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura frame: size Hor:', this.impostazioni.maskSizeHor[this.pageSelector]);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura frame: visible:', this.impostazioni.maskVisible[this.pageSelector]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura frame: dimensioni:', this.impostazioni.dimensioni[this.pageSelector]);

    this.checkDifferenceFromStartJSON();
  }

  gestisceFinestre(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskVisible);
    if (this.impostazioni.maskSize[this.pageSelector][1] === 0 && this.impostazioni.maskSize[this.pageSelector][2] === 0 &&
      this.impostazioni.maskSize[this.pageSelector][3] === 0) {
      this.impostazioni.nascoste123 = true;
    } else {
      this.impostazioni.nascoste123 = false;
    }

    switch (e) {
      case 1:
        this.gest_finestre.controllaDimensioniFrames(this, 2, 3);
        break;
      case 2:
        this.gest_finestre.controllaDimensioniFrames(this, 1, 3);
        break;
      case 3:
        this.gest_finestre.controllaDimensioniFrames(this, 1, 2);
        break;
      case 4:
        this.gest_finestre.controllaDimensioniFrames(this, 5, 6);
        break;
      case 5:
        this.gest_finestre.controllaDimensioniFrames(this, 4, 6);
        break;
      case 6:
        this.gest_finestre.controllaDimensioniFrames(this, 4, 5);
        break;
      case 7:
        this.gest_finestre.controllaDimensioniFrames(this, 8, 9);
        break;
      case 8:
        this.gest_finestre.controllaDimensioniFrames(this, 7, 9);
        break;
      case 9:
        this.gest_finestre.controllaDimensioniFrames(this, 7, 8);
        break;
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.pageSelector])));
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(JSON.stringify(this.impostazioni.maskVisible[this.pageSelector])));

    /*
    if (this.impostazioni.occhioCheckato[this.pageSelector] === true) {
      // alert('HOR 4');
      this.impostazioni.maskSizeHor[this.pageSelector] = [ 0, 0, 50, 50 ];
    }
    */

  /* 
  MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
  if (this.impostazioni.occhioCheckato[this.pageSelector] === false) {
      this.impostazioni.framesPinnati = false;
      this.apre123();
    } else {
      this.impostazioni.framesPinnati = true;
      const tm = setTimeout(() => {
        this.chiude123();
      }, 1000);
    }
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    */

    /* if (this.impostazioni.nascoste123) {
      this.chiude123();
    } */
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
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Massimizzo', e);

    this.gest_finestre.massimizzaFinestra(this, e);

    const tm = setTimeout(() => {
      clearTimeout(tm);
      
      this.refreshMap[e] = !this.refreshMap[e];
      this.resizeFrame[e] = new Date().toString();

      if (this.bboxZ) {
        const vecchioBBox = JSON.parse(JSON.stringify(this.bboxZ));
        this.bboxZ = '';
        const tm = setTimeout(() => {
          clearTimeout(tm);

          this.bboxZ = JSON.parse(JSON.stringify(vecchioBBox));
        }, 1500);
      }
    }, 1000);
  }

  aggiungeFrame() {
    this.gest_finestre.aggiungeFrame(this, -1);
  }

  selectSla(e) {
    // alert(e.ID);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sla value globale: ', e);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sla impostato:', e);
    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (e) {
        this.slaValueGlobale = e.ID;
        this.impostazioni.slaValueGlobale = e;
        // localStorage.setItem('SlaContext', e.ID);
      }        
    }, 100);
  }

  /* ritornoValoreDaComboSLA(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo sla:', e);
    if (e && e !== 'empty' && e !== null) {
      const ee = ExternalUtilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        if (e === undefined) {
          this.slaValueGlobale = 0;
        } else {
          this.slaValueGlobale = e.ID;
        }
      }, 100);
    // }
    }
  } */

  /* viewAsClick(e) {
    if (e === '1') {
      this.overlayClusterG = '';
    }
  } */

  clickRadioTipoLegend(e) {
    if (e) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      this.tipoLegendaIstogrammi = e;
      this.impostazioni.tipoLegendaIstogrammi = e;
      // localStorage.setItem(this.userName + '_tipoLegendaIstogrammi', this.tipoLegendaIstogrammi);

      for (let i = 0; i <= 9; i++) {
        this.refreshMap[i] = !this.refreshMap[i];
      }
    }
  }

  selectOverlayCluster(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Combo cluster selezionato', e);
    if (e) {
      if (e && !e.CODE) {
        e = {CODE: e};
      }
      // localStorage.setItem('OverlayContext', e.CODE);
      this.overlayClusterG = e.CODE;
      this.impostazioni.overlayClusterG = e;
    }
  }

  selectZoomMap(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Combo select zoom map', e);
    if (e) {
      if (e && !e.CODE) {
        e = {CODE: e, VALUE_STR: e};
      }
      this.zoomMap = e.CODE;
      this.impostazioni.zoomMap = e;
      // localStorage.setItem('ZoomContext', e.CODE);
    }
 }

  selectAdditionalLayer(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Combo additional layer selezionato', e);
    if (e) {
      if (e && !e.VALUE_STR) {
        let ok = false;
        this.datiAddLayers2.array.forEach(element => {
          if (!ok && e === element.VALUE_STR) {
            e = element;
            ok = true;
          }
        });
      }
      this.additionalLayer = e; // .CODE;
      this.additionalLayer2 = e.CODE;
    }
  }

  /* ritornoValoreDaZoomMap(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo cluster:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        if (e === undefined) {
          this.zoomMap = 2;
        } else {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');
          this.datiZoomMap.forEach(element => {
            if (element.CODE === e) {
              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato:', element);
              this.zoomMap = element.CODE;
            }
          });
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo cluster:', this.overlayClusterG);
        }
      }, 2000);
    // }
    }
  } */

  /* ritornoValoreDaComboCluster(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo cluster:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        if (e === undefined) {
          this.overlayClusterG = '';
        } else {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');
          if (this.clusterGroup2) {
            this.clusterGroup2.forEach(element => {
              if (element.CODE === e) {
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato:', element);
                this.overlayClusterG = element;
              }
            });
          }
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo cluster:', this.overlayClusterG);
        }
      }, 2000);
    // }
    }
  } */

  /* ritornoValoreDaComboAL(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo cluster:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        if (e === undefined) {
          this.additionalLayer = '';
        } else {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');
          this.datiAddLayers2.forEach(element => {
            if (element.CODE === e) {
              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato:', element);
              this.additionalLayer = element;
            }
          });
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo cluster:', this.overlayClusterG);
        }
      }, 2000);
    // }
    }
  } */

  cambioViewDefinition(f, n, e) {
    this.impostazioni.viewDefinition[f][n] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio view definition', n, e);
    this.checkDifferenceFromStartJSON();
  }

  checkDesignInfo(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e.target.checked);
    for (let i = 1; i <= 9 ; i++) {
      this.designInfo[i] = e.target.checked;
    }
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.designInfo);
  }

  ultimaVoltaCambioFrame = ExternalUtilities.creaVettore(environment.quantiFrames, -1);

  cambioFrameAttivo(n, e) {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaCambioFrame[n] < 1000) {
      return;
    }
    this.ultimaVoltaCambioFrame[n] = ora;
    
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio frame attivo', n, e);

    // if (this.impostazioni.frameName) {
      const tm = setTimeout(() => {
        clearTimeout(tm);

        this.impostazioni.frameAttivo[n] = e;

        // logConsole('Cambio frames attivi. Page selector: ', this.pageSelector);
        // logConsole('Cambio frames attivi. n: ', n);
        // logConsole('Cambio frames attivi. Array: ', this.impostazioni.framesAttivi[this.pageSelector]);

        if (!this.impostazioni.framesAttivi || this.impostazioni.framesAttivi === null) {
          this.impostazioni.framesAttivi = ExternalUtilities.creaMatrice(environment.quantePagine, environment.quantiFrames, -1);
        } else {
          if (this.impostazioni.framesAttivi[this.pageSelector] === null || this.impostazioni.framesAttivi[this.pageSelector].length === 0) {
            this.impostazioni.framesAttivi[this.pageSelector] = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
          }
        }
        if (e !== -1) {
          this.impostazioni.framesAttivi[this.pageSelector][n] = e;

          logConsole('Cambio frames attivi: Pagina ' + this.pageSelector + '. Impostata: ' +  this.impostazioni.framesAttivi[this.pageSelector][n] + 
            ' Views: ' + this.impostazioni.framesAttivi[this.pageSelector]);
        }

        /* if (this.impostazioni.filtroEventi) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio frame attivo. Filtro Eventi: ', this.impostazioni.filtroEventi[n][e], n, e);
        } */

        this.checkDifferenceFromStartJSON();
      }, 100);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, n, e, this.impostazioni.measure[this.impostazioni.frameAttivo[n]]);

      /* const passaggio = {
        Measure: this.impostazioni.measure[this.impostazioni.frameAttivo[n]]
      }
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, passaggio);
      const tm = setTimeout(() => {
        this.nuoviDatiPerCambioFrame = passaggio
      }, 10); */
    // }
  }

  /* creaNomiFrames(aggiorna) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frames ingresso', this.nomiFrames);
    const nf = new Array();

    for (let j= 0; j <= environment.quantiFrames; j ++) {
      const nf2 = new Array();
      for (let i= 0; i <= environment.quantiSottoFrames; i ++) {
        // if (this.impostazioni.MappaOGrafico[i] !== undefined) {
          if (this.impostazioni.MappaOGrafico[i][j] !== '') {
            // /* if (!this.impostazioni.frameName[i] || !!this.impostazioni.frameName[i][j]) {
              this.impostazioni.frameName.push(new Array());
              for (let j2 = 0; j2 <= environment.quantiFrames; j2 ++) {
                this.impostazioni.frameName[i].push('');
              }
            } // /
            let tit = this.impostazioni.frameName[j][i];
            if (tit === undefined || tit === null || tit === '') {
              tit = '<empty>';
            }
            nf2.push(tit);
          } else {
            nf2.push('<empty>');
          }
        // } else {
        //   nf2.push('<empty>');
        // }
      }
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, nf2);
      nf.push(nf2);
    }
    this.nomiFrames = JSON.parse(JSON.stringify(nf));
    // this.impostazioni.frameName = JSON.parse(JSON.stringify(this.nomiFrames));
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi frames', this.nomiFrames);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni Nomi frames', this.impostazioni);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni Nomi frames', this.impostazioni.frameName);
    /*
    if (aggiorna === true) {
      this.impostazioni.frameName = JSON.parse(JSON.stringify(this.nomiFrames));
      // this.impostazioni.titoloFrame = JSON.parse(JSON.stringify(this.nomiFrames));
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi frames', this.impostazioni.frameName);
    } //
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frames uscita', this.nomiFrames);
  } */

  creaNomiFrames(aggiorna) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frame: Da sistemare: ', this.impostazioni.frameName);
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
    // alert('Nomi frames 1: ' + JSON.stringify(n));
    this.impostazioni.frameName = JSON.parse(JSON.stringify(n));
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frame: Nomi frames impostati', this.impostazioni.frameName);
    return;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frame: Da sistemare: ', this.impostazioni.frameName);
    const n2 = new Array();
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
      n2.push(nn);
    }
    // logConsole('Nomi frames 2: ', n2);
    this.impostazioni.frameName = JSON.parse(JSON.stringify(n2));
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frame: Nomi frames impostati', this.impostazioni.frameName);
    return;

    const nf = new Array();
    for (let j = 0; j <= environment.quantiFrames; j ++) {
      const nf2 = new Array();
      for (let i = 0; i <= environment.quantiSottoFrames; i ++) {
        if (this.impostazioni.MappaOGrafico[i] !== undefined) {
          if (this.impostazioni.MappaOGrafico[i][j] !== '') {

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
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, nf2);
      nf.push(nf2);
    }
    this.nomiFrames = JSON.parse(JSON.stringify(nf));
    // this.impostazioni.frameName = JSON.parse(JSON.stringify(this.nomiFrames));
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frames: Nomi frames', this.nomiFrames);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frames: Impostazioni Nomi frames', this.impostazioni.frameName);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Crea nomi frames: Impostazioni Titoli frames', this.impostazioni.titoloFrame);
    /*
    if (aggiorna === true) {
      this.impostazioni.frameName = JSON.parse(JSON.stringify(this.nomiFrames));
      // this.impostazioni.titoloFrame = JSON.parse(JSON.stringify(this.nomiFrames));
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nomi frames', this.impostazioni.frameName);
    } */
  }

  appoggiaValori(view, frame) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni);
    if (!this.MappaOGraficoTutti) {
      this.MappaOGraficoTutti = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '--');
    }

    this.impostazioni.overviewZoom = this.aggiustaArray.SistemaDimensioni(this.impostazioni.overviewZoom, true);
    this.impostazioni.histDisplayTutto = this.aggiustaArray.SistemaDimensioni(this.impostazioni.histDisplayTutto, undefined);
    this.impostazioni.listaCampiTCRP = this.aggiustaArray.SistemaDimensioni(this.impostazioni.listaCampiTCRP, undefined);
    this.impostazioni.isStandAloneMR = this.aggiustaArray.SistemaDimensioni(this.impostazioni.isStandAloneMR, false);
    this.impostazioni.viewModeMS = this.aggiustaArray.SistemaDimensioni(this.impostazioni.viewModeMS, '');
    this.impostazioni.flowTypeMS = this.aggiustaArray.SistemaDimensioni(this.impostazioni.flowTypeMS, '');
    this.impostazioni.isStandAloneMR = this.aggiustaArray.SistemaDimensioni(this.impostazioni.isStandAloneMR, false);

    const app = {
      // maskSize:  this.impostazioni.maskSize && this.impostazioni.maskSize[view] && this.impostazioni.maskSize[view][frame] ? this.impostazioni.maskSize[view][frame]: '',
      // horSize:  this.impostazioni.dimensioni && this.impostazioni.dimensioni[frame] ? this.impostazioni.dimensioni[frame]: '',
      frameName: this.impostazioni.frameName && this.impostazioni.frameName[frame] && this.impostazioni.frameName[frame][view] ? this.impostazioni.frameName[frame][view]: '',
      // titoloFrame: this.impostazioni.titoloFrame[view][frame],
      frameDesc: this.impostazioni.frameDesc[view][frame],
      tipoMappa: this.impostazioni.tipoMappa[view][frame],
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
      checkSeverity: this.impostazioni.checkSeverity[view][frame],
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
      listaCampiTCRP: this.impostazioni.listaCampiTCRP[view][frame],
      dimensioniSplitTcRun: this.impostazioni.dimensioniSplitTcRun[view][frame],
      impostazioniPivotGrid: this.impostazioni.impostazioniPivotGrid[view][frame],
      tipoDatiLayout: this.impostazioni.tipoDatiLayout[view][frame],
      flowTypeMS: this.impostazioni.flowTypeMS[view][frame],
      viewModeMS: this.impostazioni.viewModeMS[view][frame],
      showAdditionalLayers: this.impostazioni.showAdditionalLayers && this.impostazioni.showAdditionalLayers[view] ? this.impostazioni.showAdditionalLayers[view][frame] : undefined,
      eventsMeasure: this.impostazioni.eventsMeasure[view][frame],
      showPlanimetry: this.impostazioni.showPlanimetry[view][frame],
      filtriEventi: this.impostazioni.filtriEventi && this.impostazioni.filtriEventi[view] ? this.impostazioni.filtriEventi[view][frame] : undefined,
      tipoEvento: this.impostazioni.tipoEvento[view][frame],
      fixedSeconds: this.impostazioni.fixedSeconds[view][frame],
      styleSize: this.impostazioni.styleSize[view][frame],
      cellType: this.impostazioni.cellType[view][frame],
      // MappaOGraficoTutti: this.MappaOGraficoTutti && this.MappaOGraficoTutti[frame] ? this.MappaOGraficoTutti[frame][view] : this.MappaOGraficoTutti[frame][view],
      addLayers: this.impostazioni.addLayers[view][frame],
      opacity: this.impostazioni.opacity[view][frame],
      shownEvents: this.impostazioni.shownEvents[view][frame],
      modificaChart: this.impostazioni.modificaChart[view][frame],
      doNotSetGM: this.impostazioni.doNotSetGM && this.impostazioni.doNotSetGM[view] ? this.impostazioni.doNotSetGM[view][frame] : undefined,
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
      textFilter2: this.impostazioni.textFilter2[view][frame],
      // textLov: this.impostazioni.textLov[view][frame],
      addGlobalLayer: this.impostazioni.addGlobalLayer[view][frame],
      measureRCM: this.impostazioni.measureRCM[view][frame],
      showRaysAllLayer: this.impostazioni.showRaysAllLayer[view][frame],
      correlation: this.impostazioni.correlation[view][frame],
      isNonSyncEventTime: this.impostazioni.isNonSyncEventTime && this.impostazioni.isNonSyncEventTime[view] ? this.impostazioni.isNonSyncEventTime[view][frame] : false,
      showAxisX: this.impostazioni.showAxisX && this.impostazioni.showAxisX[view] ? this.impostazioni.showAxisX[view][frame] : true,
      showVoiceCallMeasures: this.impostazioni.showVoiceCallMeasures[view][frame],
      showDataMeasures: this.impostazioni.showDataMeasures[view][frame],
      showCoverageMeasures: this.impostazioni.showCoverageMeasures[view][frame],
      clusterMeasure2: this.impostazioni.clusterMeasure2[view][frame],
      // lov: this.impostazioni.lov[view][frame],
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Appoggio valori per copia', app);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, view, frame, app.currZoom, this.impostazioni.styleSize);

    return app;
  }

  spostaValori(app, view, frame) {
    if (!this.impostazioni.frameName || !this.impostazioni.frameName[frame] || !this.impostazioni.frameName[frame][view]) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.frameName);
    } else {
      this.impostazioni.frameName[frame][view] = app.frameName;
    }
    // this.impostazioni.titoloFrame[view][frame] = app.titoloFrame;
    // this.impostazioni.maskSize[view][frame] = app.maskSize;
    // this.impostazioni.dimensioni[frame] = app.dimensioni;
    this.impostazioni.frameDesc[view][frame] = app.frameDesc;
    this.impostazioni.tipoMappa[view][frame] = app.tipoMappa;
    this.impostazioni.MappaOGrafico[view][frame] = app.MappaOGrafico;
    this.impostazioni.overviewZoom = this.aggiustaArray.SistemaDimensioni(this.impostazioni.overviewZoom, true);
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
    this.impostazioni.checkSeverity[view][frame] = app.checkSeverity;
    this.impostazioni.listaEventi[view][frame] = app.listaEventi;
    this.impostazioni.currZoom[view][frame] = app.currZoom;
    this.impostazioni.viewAs[view][frame] = app.viewAs;
    this.impostazioni.overlay[view][frame] = app.overlay;
    this.impostazioni.overlayCluster[view][frame] = app.overlayCluster;
    this.impostazioni.timeFilter[view][frame] = app.timeFilter;
    this.impostazioni.bboxOZ[view][frame] = app.bboxOZ;
    this.impostazioni.viewDefinition[view][frame] = app.viewDefinition;
    this.activityName[view][frame] = app.activityName;
    if (this.impostazioni.filtriEventi && this.impostazioni.filtriEventi[view]) {
      this.impostazioni.filtriEventi[view][frame] = app.filtriEventi;
    }
    // this.viewOlL[view][frame] = app.viewOlL;
    // this.viewOlG[view][frame] = app.viewOlG;
    this.impostazioni.histDisplayAs[view][frame] = app.histDisplayAs;
    this.impostazioni.histDisplayTutto = this.aggiustaArray.SistemaDimensioni(this.impostazioni.histDisplayTutto, undefined);
    this.impostazioni.histDisplayTutto[view][frame] = app.histDisplayTutto;
    this.impostazioni.columnsBars[view][frame] = app.columnsBars;
    this.impostazioni.doubleGraph[view][frame] = app.doubleGraph;
    this.impostazioni.listaCampiTCRP = this.aggiustaArray.SistemaDimensioni(this.impostazioni.listaCampiTCRP, undefined);
    this.impostazioni.listaCampiTCRP[view][frame] = app.listaCampiTCRP;
    this.impostazioni.dimensioniSplitTcRun[view][frame] = app.dimensioniSplitTcRun;
    this.impostazioni.impostazioniPivotGrid[view][frame] = app.impostazioniPivotGrid;
    this.impostazioni.tipoDatiLayout[view][frame] = app.tipoDatiLayout;
    if (this.impostazioni.showAdditionalLayers && this.impostazioni.showAdditionalLayers[view] && this.impostazioni.showAdditionalLayers[view][frame]) {
      this.impostazioni.showAdditionalLayers[view][frame] = app.showAdditionalLayers;
    }
    if (this.impostazioni.viewModeMS && this.impostazioni.viewModeMS[view][frame] != undefined) {
      this.impostazioni.viewModeMS[view][frame] = app.viewModeMS;
    }
    if (this.impostazioni.flowTypeMS && this.impostazioni.flowTypeMS[view][frame] != undefined) {
      this.impostazioni.flowTypeMS[view][frame] = app.flowTypeMS;
    }
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
    this.impostazioni.showAxisX = this.aggiustaArray.SistemaDimensioni(this.impostazioni.showAxisX, undefined);
    this.impostazioni.showAxisX[view][frame] = app.showAxisX;
    this.impostazioni.showVoiceCallMeasures[view][frame] = app.showVoiceCallMeasures;
    this.impostazioni.showDataMeasures[view][frame] = app.showDataMeasures;
    this.impostazioni.showCoverageMeasures[view][frame] = app.showCoverageMeasures;

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni valori da copia', this.impostazioni.filtriEventi, 
    //   this.impostazioni.filtriEventi[this.impostazioni.frameAttivo[view]][frame], 
    //   view, frame);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, view, frame, this.impostazioni);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.currZoom[view][frame]);

    this.impostazioni = JSON.parse(JSON.stringify(this.impostazioni));
  }

  spostamentoView(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Spostamento view', e);
    const c = e.split(';');
    const operazione = c[0];
    const frameDa = c[1];
    const viewDa = c[2];
    const frameTo = c[3];
    const viewTo = c[4];
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Frame da', frameDa);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'View da', viewDa);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Frame to', frameTo);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'View to', viewTo);

    let valori = this.appoggiaValori(viewDa, frameDa);
    const vistaDa = JSON.parse(JSON.stringify(valori));
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista da:', vistaDa);

    let vistaA;
    if (operazione === 'SWAP') {
      valori = this.appoggiaValori(viewTo, frameTo);
      vistaA = JSON.parse(JSON.stringify(valori));
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista a:', vistaA);
    }

    this.spostaValori(vistaDa, viewTo, frameTo);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Frames: ', this.impostazioni);

    if (operazione === 'SWAP') {
      this.spostaValori(vistaA, viewDa, frameDa);
    }

    this.refreshMap[frameTo] = !this.refreshMap[frameTo];
    this.refreshMap[frameDa] = !this.refreshMap[frameDa];

    this.creaNomiFrames(false);
  }

  refreshSLA(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato refresh sla');
    this.datiSLA = null;
    this.datiSlaDT = null;
    this.datiSlaDTi = null;
    this.slaGroup = null;

    this.LeggeSlaGroupPR();
    this.LeggeSLADataPR();

    // alert('SLA rinfrescato');
  }

  changeStyleSize(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e, typeOf(e));
    // logConsole('Style size', e);
    if (e) {
      if (typeof(e) === 'string' && e.indexOf('***')  > -1) {
        let v = e.toString();
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, v);
        // if (v && v.indexOf('***') > -1) {
          v = v.replace('***', '');
        // }
        if (this.isNumeric(v)) {
          // localStorage.setItem('StyleSizeContext', v.toString());
          // logConsole('Valore: ', v);

          // this.styleSize = this.styleSizeG;
          let ok = false;
          this.styleSizes2.forEach(element => {
            if (+element.id === +v) {
              ok = true;
            }
          });
          // logConsole('Valore 2: ', ok);
          if (!ok) {
            const app = JSON.parse(JSON.stringify(this.styleSizes2));
            const s = { id: +v, name: v };
            app.push (s);
            app.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));

            this.styleSizes2 = JSON.parse(JSON.stringify(app));
            logConsole('StyleSize2:', this.styleSizes2, this.styleSizeG);

            const tm = setTimeout(() => {
              clearTimeout(tm);

              this.styleSizeG = +v;
              this.impostazioni.styleSizeG = +v;
            }, 100);
          }
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.styleSizes);
        } else {
          // alert('\'' + v + '\' is not a valid value');
          this.mostraPopup('\'' + v + '\' is not a valid value', false, '');
        }
      } else {
        if (e.id) {
          // this.styleSize = e['id'];
          // localStorage.setItem('StyleSizeContext', e['id']);

          this.styleSizes = JSON.parse(JSON.stringify(this.styleSizes));
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.styleSizes);

          const tm = setTimeout(() => {
            clearTimeout(tm);

            this.styleSizeG = e['id'];
            this.impostazioni.styleSizeG = e;
          }, 100);
        } else {
          logConsole('Vaore non valido su scelta style size', e);
        }
      }
    }
  }

  dimeFinestraLegenda(n, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio dimensioni finestra legenda:', n, e);
    this.impostazioni.dimensioniFinestraLegenda[n] = e;
    this.checkDifferenceFromStartJSON();
  }

  confermaDaSla(e) {

  }

  refreshSLAManager(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh sla data');
    this.LeggeSLADataPR();
  }

  /* aperturaPopup(e) {
    if (e && e !== '') {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Popup', e);
      const rit = e.split(';');
      this.campoClickatoAE = rit[2].replace(':', '');
      if (this.campoClickatoAE.length > 250) {
        this.campoClickatoAE = this.campoClickatoAE.substring(0, 250);
      }
      this.frameAttivoClickatoAE = rit[3];
      this.NumeroFrameClickatoAE = rit[4];

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.campoClickatoAE);
      this.posXPopupEvents = +rit[0];
      this.posYPopupEvents = +rit[1];
      this.popupVisibile = true;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.posXPopupEvents, this.posYPopupEvents);
    }
  } */

  /* addField() {
    if (this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE] === null) {
      this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE] = new Array();
    }
    const campi = this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE];
    const quanti = this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE].length;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, campi, this.campoClickatoAE);
    // for (let i = quanti; quanti <= 10; i++) {
    //   this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE].push('');
    // }
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, campi, this.campoClickatoAE);
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
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, Ok, quanti, this.campoClickatoAE);
    if (Ok) {
      this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE][riga] = this.campoClickatoAE;
      this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE] =
        JSON.parse(JSON.stringify(this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE]));
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 
      //   this.frameAttivoClickatoAE,
      //   this.NumeroFrameClickatoAE,
      //   this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE]);
      this.checkDifferenceFromStartJSON();
    } else {
      if (giaPresente) {
        // alert('Field already inserted');
        this.mostraPopup('Field already inserted', false, '');
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
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.columnsSettings[this.frameAttivoClickatoAE][this.NumeroFrameClickatoAE], this.campoClickatoAE);
        } else {
          // alert('Array full');
          this.mostraPopup('Array full', false, '');
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

  /* selectstringaAGNoACT(n, e) {
    if (e) {
      const tm = setTimeout(() => {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select Activity Da Set:', n, e);
        this.stringaAGNoACT[n] = e.NAME;
        this.stringaAGNoACT = JSON.parse(JSON.stringify(this.stringaAGNoACT));

        const tm = setTimeout(() => {
          this.resetPosition();
        }, 2000);
      }, 100);
    }
  }

  valorestringaAGNoACT(n, e) {
    if (e) {
      const tm = setTimeout(() => {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore Activity Da Set:', n, e);
        this.stringaAGNoACT[n] = e;
        this.Utilities.activitySceltaStampa = e.replace('"', '').replace('"', '');
      }, 100);
    }
  } */

  leggeActivityDaSet(n, actID) {
    // alert('Legge act da set: ' + actID);
    if (!actID || actID === 'undefined') {
      this.Utilities.sceltaActivityDaSet[n] = [{ ID: '', SET_ID: '', NAME: '' }];
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.stringaAGNoACT = '';
      }, 100);

      return;
    }

    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_filter_folder": "",' +
      '"v_filter_act_set_id": ' + actID + '' +
    '}';
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lettura activity da set:', n, params);
    this.apiService.chiamataPost(this.Utilities, 'geo_act_set_rec__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(Utils, data2);

        const d = data2;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, d);
        const a = new Array();
        // this.primaActivityPresente = undefined;
        d.DataTable.forEach(element => {
          const aa = { ID: element.ACT_ID, SET_ID: actID, NAME: element.ACT_NAME };
          // if (this.primaActivityPresente === undefined) {
          //   this.primaActivityPresente = aa;
          // }
          a.push(aa);
        });
        this.Utilities.sceltaActivityDaSet[n] = a;

        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.sceltaActivityDaSet[n]);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Legge activityDaSet', primo);
      }
    });
  }

  trackByAGN(index: number, item: any) {
    return item.ROW_ID;
  }

  sceltaAGNoACTDaClickSuMappa(n, e) {
    // logConsole('Click su mappa app: ', n, e);
    const ee = e.split('§');
    this.numeroSetPerActivityScelta = +ee[0];
    this.numeroFramePerActivityScelta = n;
    this.activityPassateDaScegliere = JSON.parse(ee[1]);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activityPassateDaScegliere);
    this.mostraSceltaAGNoACT = true;
  }

  sceltaAGNoACTDaMaschera(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.mostraSceltaAGNoACT = false;
    // this.Utilities.sceltaActivityDaSet[this.numeroSetPerActivityScelta] = e;
    this.stringaAGNoACT = e.AGN_CODE;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Stringa AGN o ACT da maschera', this.stringaAGNoACT);
    this.cambiatoAGNACTDopoScelta[this.numeroFramePerActivityScelta] = e;
    this.numeroFramePerActivityScelta = - 1;
    this.numeroSetPerActivityScelta = - 1;
    // Utils.activitySceltaStampa = e.AGN_CODE;
    this.Utilities.activitySceltaStampa = e.AGN_CODE;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.cambiatoAGNACTDopoScelta);
  }

  eventiSceltiESTesto;

  cambioEventiScelti(s, n, e) {
    if (e) {
      if (this.impostazioni.eventiSceltiES) {
        this.impostazioni.eventiSceltiES= JSON.parse(JSON.stringify(e));
      } else {
        this.impostazioni.eventiSceltiES = undefined;
      }
    } else {
      this.impostazioni.eventiSceltiES = undefined;
    }

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio eventi scelti ES. S: ', s);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'N: ', n);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Struttura: ', this.impostazioni.eventiSceltiES);
    this.eventiSceltiDaFrame = e;
    this.eventiSceltiESTesto = '';
    if (e) {
      e.forEach(element => {
        if (element && element.EVENT_TYPE) {
          this.eventiSceltiESTesto += element.EVENT_TYPE + ', ';
        }
      });
      if (this.eventiSceltiESTesto.length > 1) {
        this.eventiSceltiESTesto = this.eventiSceltiESTesto.substring(0,
          this.eventiSceltiESTesto.length - 2);
      }
    }

    const impostaSelezioneES = [-1];
    if (e) {
      e.forEach(element => {
        impostaSelezioneES.push(+element.ROW_ID);
      });
      this.impostaSelezioneES = impostaSelezioneES;
    }

    this.checkDifferenceFromStartJSON();
  }

  eventiSceltiGlobaliESTesto;

  cambioEventiSceltiGlobali(e) {
    if (e) {
      if (this.impostazioni.eventiSceltiGlobaliES) {
        this.impostazioni.eventiSceltiGlobaliES= JSON.parse(JSON.stringify(e));
      } else {
        this.impostazioni.eventiSceltiGlobaliES = undefined;
      }
    } else {
      this.impostazioni.eventiSceltiGlobaliES = undefined;
    }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio eventi scelti ES. S: ', e);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'N: ', n);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Struttura: ', this.impostazioni.eventiSceltiES);
    this.eventiSceltiGlobaliDaFrame = e;
    this.eventiSceltiGlobaliESTesto = '';
    if (e) {
      e.forEach(element => {
        if (element && element.event_type) {
          this.eventiSceltiGlobaliESTesto += element.event_type + ', ';
        }
      });
      if (this.eventiSceltiGlobaliESTesto.length > 1) {
        this.eventiSceltiGlobaliESTesto = this.eventiSceltiGlobaliESTesto.substring(0,
          this.eventiSceltiGlobaliESTesto.length - 2);
      }
  
      // logConsole('Eventi scelti globali es', e, this.eventiSceltiGlobaliESTesto);
    }

    /* const impostaSelezioneES = [-1];
    if (e) {
      e.forEach(element => {
        impostaSelezioneES.push(+element.ROW_ID);
      });
      this.impostaSelezioneES = impostaSelezioneES;
    } */

    this.checkDifferenceFromStartJSON();
  }

  indietroTR() {
    if (!this.Utilities.tmsSelezionato) {
      // alert('Please select a point first');
      this.mostraPopup('Please select a point first', false, '');
      return;
    }
    const diff = ExternalUtilities.calcolaTimeSpan(this.Utilities) * 1000;
    // // logConsole('Indietro TR', this.Utilities.tmsInizio + ' - ' + this.Utilities.tmsFine + ' -> ' + diff);
    const t = (new Date(this.Utilities.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) - diff; // this.Utilities.range;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    // // logConsole('Indietro TR', nuovoTMS);
    // AppComponent.CambioTmsSelezionato(this.Utilities, nuovoTMS, 'Indietro TR', this.timerAttivatoAuto);

    this.cambioTmsSelezionatoConControlloGPS(nuovoTMS, 'Indietro TR', true);
  }

  indietro() {
    if (!this.Utilities.tmsSelezionato) {
      // alert('Please select a point first');
      this.mostraPopup('Please select a point first', false, '');
      return;
    }
    const t = (new Date(this.Utilities.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) - 1000;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    // AppComponent.CambioTmsSelezionato(this.Utilities, nuovoTMS, 'Indietro', this.timerAttivatoAuto);

    this.cambioTmsSelezionatoConControlloGPS(nuovoTMS, 'Indietro', true);
  }

  indietro2() {
    if (!this.Utilities.tmsSelezionato) {
      // alert('Please select a point first');
      this.mostraPopup('Please select a point first', false, '');
      return;
    }
    const t = (new Date(this.Utilities.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) - 5000;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    // AppComponent.CambioTmsSelezionato(this.Utilities, nuovoTMS, 'Indietro2', this.timerAttivatoAuto);

    this.cambioTmsSelezionatoConControlloGPS(nuovoTMS, 'Indietro 2', true);
  }

  centro() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.tmsSelezionato, this.Utilities.tmsSelezionatoStringa);
    if (!this.Utilities.tmsSelezionato) {
      // alert('Please select a point first');
      this.mostraPopup('Please select a point first', false, '');
      return;
    }
    ExternalUtilities.creaRangeSelezionato('CENTRO', this.Utilities.tmsSelezionato, this.Utilities, this.timerAttivatoAuto);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione tmsInizio 3, nullo');
    this.Utilities.tmsInizio = undefined;
    this.Utilities.tmsFine = undefined;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Setto centro', this.Utilities.tmsSelezionato, this.Utilities.tmsInizio, this.Utilities.tmsFine);

    // AppComponent.CambioTmsSelezionato(this.Utilities, this.Utilities.tmsSelezionato, 'Centro', this.timerAttivatoAuto);

    this.cambioTmsSelezionatoConControlloGPS(this.Utilities.tmsSelezionato, 'Centro', false);
  }

  playStop() {
    if (!this.Utilities.tmsSelezionato) {
      // alert('Please select a point first');
      this.mostraPopup('Please select a point first', false, '');
      return;
    }
    if (this.isPlaying === false) {
      this.isPlaying = true;
      /* if (this.subscribePlay) {
        this.subscribePlay.unsubscribe();
      }
      this.subscribePlay = Observable.timer(0, 5000)
        .take(32000)
        .subscribe(() => { */
      const t = setInterval(() => {
        clearInterval(t);

        if (this.isPlaying === false) {
          this.Utilities.clickDaMappa = false;
          // this.subscribePlay.unsubscribe();
        } else {
          this.Utilities.clickDaMappa = true;

          const nuovoTMS = ((new Date(this.Utilities.tmsSelezionato).getTime()) + (this.secondiSpostamento * 1000));
          // AppComponent.CambioTmsSelezionato(this.Utilities, nuovoTMS, 'PlayStop', this.timerAttivatoAuto);

          this.cambioTmsSelezionatoConControlloGPS(nuovoTMS, 'PlayStop', false);
        }
      }, 5000);
    } else {
      this.isPlaying = false;
    }
  }

  avantiTR() {
    if (!this.Utilities.tmsSelezionato) {
      // alert('Please select a point first');
      this.mostraPopup('Please select a point first', false, '');
      return;
    }
    const diff = ExternalUtilities.calcolaTimeSpan(this.Utilities) * 1000;
    // // logConsole('Avanti TR', this.Utilities.tmsInizio + ' - ' + this.Utilities.tmsFine + ' -> ' + diff);
    const t = (new Date(this.Utilities.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) + diff; // this.Utilities.range;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    // // logConsole('Avanti TR', nuovoTMS);
    // AppComponent.CambioTmsSelezionato(this.Utilities, nuovoTMS, 'Avanti TR', this.timerAttivatoAuto);

    this.cambioTmsSelezionatoConControlloGPS(nuovoTMS, 'Avanti TR', true);
  }

  avanti2() {
    if (!this.Utilities.tmsSelezionato) {
      // alert('Please select a point first');
      this.mostraPopup('Please select a point first', false, '');
      return;
    }
    const t = (new Date(this.Utilities.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) + 5000;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    // AppComponent.CambioTmsSelezionato(this.Utilities, nuovoTMS, 'Avanti 2', this.timerAttivatoAuto);

    this.cambioTmsSelezionatoConControlloGPS(nuovoTMS, 'Avanti 2', true);
  }

  avanti() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.tmsSelezionato, this.Utilities.tmsSelezionatoStringa);
    if (!this.Utilities.tmsSelezionato) {
      //alert('Please select a point first');
      this.mostraPopup('Please select a point first', false, '');
      return;
    }
    const t = (new Date(this.Utilities.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime()) + 1000;
    const nuovoTMS = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, nuovoTMS);

    this.cambioTmsSelezionatoConControlloGPS(nuovoTMS, 'Avanti', true);
  }

  posDaImpostare;

  cambioTmsSelezionatoConControlloGPS(nuovoTMS, daDove, esegueQuery) {    
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato con controllo GPS: ' + daDove + '. Nuovo TMS: ' + nuovoTMS + '. Esegue Query: ' + esegueQuery);

    if (nuovoTMS === 0) {
      AppComponent.CambioTmsSelezionato(this.Utilities, nuovoTMS, daDove, this.timerAttivatoAuto);
      return;
    }

    if (!esegueQuery) {
      AppComponent.CambioTmsSelezionato(this.Utilities, nuovoTMS, daDove, this.timerAttivatoAuto);
    } else {
      let agnact = '';
      if (this.stringaAGNoACT && this.stringaAGNoACT === '') {
        agnact = '"null"';
      } else {
        agnact = this.stringaAGNoACT;
      }
      let valoreRicerca = agnact;

      if (!valoreRicerca) {
        return;
      }

      const params = {
        v_agn_code: valoreRicerca,
        v_tms: nuovoTMS
      };

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiamata tms to gps per cambio tms 1',  params);
      
      this.apiService.chiamataPost(this.Utilities, 'antsgeo_tms_to_gps1', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data, this.NumeroFrame);
        if (data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(Utils, data2);

          // const coordinate = this.map1.getEventCoordinate(event);
          if (data2) { // } && data2.lat && data2.lng && data2.lat !== '' && data2.lng !== '' && +data2.lng !== 0 && +data2.lat !== 0) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Data per cambio 2', data2);      

            // this.impostaCenterPosition.emit(data2.lng + ' ' + data2.lat);
            // this.impostaTimeCursorPosition.emit(data2.lng + ' ' + data2.lat);

            this.posDaImpostare = 'POINT(' + data2.lng + ' ' + data2.lat + ')';
            // alert(this.Utilities.posDaImpostare);

            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Data per cambio tms 3', this.posDaImpostare);
            
            AppComponent.CambioTmsSelezionato(this.Utilities, nuovoTMS, daDove, this.timerAttivatoAuto);
          }
        }
      });
    }
  }

  mouseOverCombo1(e) {
    this.dimeDrawer = this.maxDimeDrawer + 'px'; // this.impostazioni.actualDimeDrawer;
  }

  impostaNonChiudere(e) {
    // alert('Imposta non chiudere', e);
    this.nonChiudereDrawer = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
  }

  impostaNonChiudere2(e) {
    // alert('Imposta non chiudere2: ' + e);
    this.nonChiudereDrawer2 = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
  }

  /* chiudeDrawer(e) {
    if (this.nonChiudereDrawer === true) {
      return;
    }
    this.dimeDrawer = this.dimeDrawerInizio;
  } */

  /* apriDrawer() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Apri drawer', this.impostazioni.actualDimeDrawer);
    // if (!this.impostazioni.actualDimeDrawer || this.impostazioni.actualDimeDrawer === 1) {
    //   this.impostazioni.actualDimeDrawer = 350;
    // }
    this.dimeDrawer = this.maxDimeDrawer ; // this.impostazioni.actualDimeDrawer;
    this.chiudeDrawer2(null);
  }

  apriDrawer2() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Apri drawer', this.impostazioni.actualDimeDrawer);
    // if (!this.impostazioni.actualDimeDrawer2 || this.impostazioni.actualDimeDrawer2 === 1) {
    //   this.impostazioni.actualDimeDrawer2 = 350;
    // }
    this.dimeDrawer2 = this.maxDimeDrawer; // this.impostazioni.actualDimeDrawer2;
    this.chiudeDrawer(null);
  }

  impostaNonChiudere2(e) {
    this.nonChiudereDrawer2 = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
  }

  chiudeDrawer2(e) {
    if (this.nonChiudereDrawer2 === true) {
      return;
    }
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiude drawer 2');
    this.dimeDrawer2 = this.dimeDrawerInizio2;
  } */

  ultimoE;

  controlloTimeRange(q, e) {
    // return;

    // const tm = setTimeout(() => {
    if (e === this.ultimoE) {
      return;
    }
    this.ultimoE = e;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo time range. Vengo da: ', q, e);
    if (!this.datiActTimeSpanAppoggio) {
      let qq = 0;
      const t = setInterval(() => {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo time range. Attesa per datiActTimeSpan: ', qq);
        if (this.Utilities.datiActTimeSpan) {
          clearInterval(t);
          this.controlloTimeRangeProsegue(q, e);
        } else {
          qq++;
          if (qq > 5) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo time range. Esco per struttura vuota: ', this.Utilities.datiActTimeSpan);
            return;
          }
        }
      }, 100)
    } else {
      this.controlloTimeRangeProsegue(q, e);
    }
  }

  controlloTimeRangeProsegue(q, e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo time range 1', this.Utilities.datiActTimeSpan, q, e);

    if (!this.Utilities.datiActTimeSpan) {
      return;
    }
    
    let ok = false;
      this.Utilities.datiActTimeSpan.forEach(element => {
        if (+element.name === +e) {
          this.Utilities.cambioTimeRange = new Date();
          // this.Utilities.rangeDiSecondiPerMille = +element.name * 1000; 26/10
          // this.valoreTimeSpan = +element.name;
          // this.Utilities.range = this.Utilities.rangeDiSecondiPerMille;
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo time range 1. Trovato valore 1');
          if (this.Utilities.tmsSelezionato !== 0 && this.Utilities.clickSuCV === false) {
            ExternalUtilities.creaRangeSelezionato('TimeRangeProsegue 1', this.Utilities.tmsSelezionato, this.Utilities, this.timerAttivatoAuto);
          }
          if (this.Utilities.clickSuCV === true) {
            this.Utilities.clickSuCV = false;
          }
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activityTimeSpan, this.Utilities.rangeDiSecondiPerMille);
          ok = true;
        }
      });
      // alert(ok);
      if (ok === false) {
        let maxN = 0;
        this.Utilities.datiActTimeSpan.forEach(element => {
          if (+element.id > +maxN) {
            maxN = +element.id;
          }
        });
        maxN++;
        const vv = { id: +maxN, name: +e };
        this.Utilities.datiActTimeSpan.push(vv);
        this.Utilities.datiActTimeSpan.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo time range 1. Aggiungo valore', vv, q, 
              this.Utilities.tmsInizio, this.Utilities.tmsFine);
        const dsr = JSON.parse(JSON.stringify(this.Utilities.datiActTimeSpan));
        this.Utilities.datiActTimeSpan = undefined;
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.Utilities.datiActTimeSpan = JSON.parse(JSON.stringify(dsr));
          this.Utilities.cambioTimeRange = new Date();
          // this.Utilities.rangeDiSecondiPerMille = +e * 1000;
          // this.valoreTimeSpan = +vv.name; // 26/10
          // this.Utilities.range = this.Utilities.rangeDiSecondiPerMille;
          if (this.Utilities.tmsSelezionato !== 0 && this.Utilities.clickSuCV === false) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo time range 1. Aggiorno time range', q);
            ExternalUtilities.creaRangeSelezionato('TimeRangeProsegue 2', this.Utilities.tmsSelezionato, this.Utilities, this.timerAttivatoAuto);
          } else {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo time range 1. Caricato set', q);
            this.datiActTimeSpanAppoggio = this.Utilities.datiActTimeSpan;
          }
          if (this.Utilities.clickSuCV === true) {
            this.Utilities.clickSuCV = false;
          }
        }, 100);
      }      
    // }, 500);
  }

  controlloTimeRange2(q, e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vengo da', q);
    let ok = false;
    this.Utilities.datiActTimeSpanRange.forEach(element => {
      if (+element.name === +e) {
        // this.valoreTimeSpanRange = +element.name;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore trovato', e, +element.name);
        ok = true;
      }
    });
    if (ok === false) {
      let maxN = 0;
      this.Utilities.datiActTimeSpanRange.forEach(element => {
        if (element.id > maxN) {
          maxN = +element.id;
        }
      });
      maxN++;

      const app = JSON.parse(JSON.stringify(this.Utilities.datiActTimeSpanRange));
      app.push({ id: maxN, name: e });
      app.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));
      this.Utilities.datiActTimeSpanRange = JSON.parse(JSON.stringify(app));

      logConsole('Selezione 2', this.Utilities.datiActTimeSpanRange, e);

      const tm = setTimeout(() => {
        clearTimeout(tm);

        this.valoreTimeSpanRange = e;
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, vv.name);
        // this.valoreTimeSpanRange = +vv.name;
      }, 100);
    }
  }

  extendMin() {
    if (!this.Utilities.tmsInizio) {
      return;
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Extend min', this.Utilities.tmsInizio);

    let rInizio = new Date(this.Utilities.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    rInizio -= (+this.valoreTimeSpanRange * 1000);

    const rFine = new Date(this.Utilities.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, +this.valoreTimeSpanRange, rInizio, rFine);
    if (rInizio < rFine) {
      const sInizio = this.Utilities.datePipe.transform(rInizio, 'yyyy-MM-dd HH:mm:ss', 'UTC');
      const sFine = this.Utilities.datePipe.transform(rFine, 'yyyy-MM-dd HH:mm:ss', 'UTC');
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nuovo inizio:', sInizio);

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tms Inizio extendMin', sInizio);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione tmsInizio 4', sInizio);
      // logConsole('TMS INIZIO 2', sInizio);
      this.Utilities.tmsInizio = sInizio;

      // this.valoreTimeSpan += +this.valoreTimeSpanRange; 26/10
      // this.Utilities.rangeDiSecondiPerMille = +this.valoreTimeSpan * 1000;
      // this.Utilities.range = this.Utilities.rangeDiSecondiPerMille;

      let rActual = new Date(this.Utilities.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      if (rActual < rInizio) {
        rActual = rInizio;
        const sActual = this.Utilities.datePipe.transform(rActual, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        this.Utilities.tmsSelezionato = sActual;
      }

      this.Utilities.rangeSelezionatoStampa = sInizio + '<br />' + sFine;

      this.ridisegnaTutto = new Date();
    }
  }

  extendMax() {
    if (!this.Utilities.tmsFine) {
      return;
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Extend max', this.Utilities.tmsInizio);

    let rFine = new Date(this.Utilities.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    rFine += (+this.valoreTimeSpanRange * 1000);

    const rInizio = new Date(this.Utilities.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, rInizio, rFine);
    if (rInizio < rFine) {
      const sInizio = this.Utilities.datePipe.transform(rInizio, 'yyyy-MM-dd HH:mm:ss', 'UTC');
      const sFine = this.Utilities.datePipe.transform(rFine, 'yyyy-MM-dd HH:mm:ss', 'UTC');
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nuovo fine:', sFine);

      // this.valoreTimeSpan += +this.valoreTimeSpanRange; 26/10
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS FINE 2: ', sFine);
      this.Utilities.tmsFine = sFine;
      // this.Utilities.rangeDiSecondiPerMille = +this.valoreTimeSpan * 1000;
      // this.Utilities.range = this.Utilities.rangeDiSecondiPerMille;

      let rActual = new Date(this.Utilities.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      if (rActual > rFine) {
        rActual = rFine;
        const sActual = this.Utilities.datePipe.transform(rActual, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        this.Utilities.tmsSelezionato = sActual;
      }

      this.Utilities.rangeSelezionatoStampa = sInizio + '<br />' + sFine;

      this.ridisegnaTutto = new Date();
    }
  }

  cambioTimeRange(e) {
    if (e === null || this.Utilities.tmsInizio === null || this.Utilities.tmsFine === null) {
      return;
    }

    const ee = e.split(';');
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range', e, this.Utilities.tmsInizio, this.Utilities.tmsFine);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range provenienza', ee[4]);
    if (ee[2] && ee[3]) {
      const sInizio = this.Utilities.datePipe.transform(ee[2], 'yyyy-MM-dd HH:mm:ss');
      const sFine = this.Utilities.datePipe.transform(ee[3], 'yyyy-MM-dd HH:mm:ss');

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tms Inizio cambio time range', sInizio);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione tmsInizio 5', sInizio);
      // logConsole('TMS INIZIO 3', sInizio);
      this.Utilities.tmsInizio = sInizio;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS FINE 3: ', sFine);
      this.Utilities.tmsFine = sFine;

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range min', this.Utilities.tmsInizio);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range max', this.Utilities.tmsFine);

      AppComponent.aggiungeRange(this.Utilities);
    }
    this.controlloTimeRange('2', ee[0]);

    let rInizio;
    let rFine;

    try {
      rInizio = new Date(this.Utilities.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      rFine = new Date(this.Utilities.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    } catch(e) {
      rInizio = this.Utilities.tmsInizio.getTime();
      rFine = this.Utilities.tmsFine.getTime();
    }

    const t = new Date(e[1].replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t, this.Utilities.datePipe.transform(rInizio, 'yyyy-MM-dd HH:mm:ss'),
    //    this.Utilities.datePipe.transform(rFine, 'yyyy-MM-dd HH:mm:ss'));

    if (t < rInizio || t > rFine) {
      if (ee[1].indexOf('.') > -1) {
        ee[1] = ee[1].substring(0, ee[1].indexOf('.'));
      }
      this.Utilities.tmsSelezionato = ee[1];

      ExternalUtilities.aggiornaTmsStringa(ee[1], this.Utilities, 'Imposta time range 1');
    }
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time range', this.Utilities.tmsInizio, this.Utilities.tmsFine);
  }

  impostaTimeRangeStart(eee) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'imposto time start', eee);
    if (eee) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        const e = this.datePipe.transform(new Date(eee), 'yyyy-MM-dd HH:mm:ss')
        this.timeRangeDSFStart = e; // new Date(e.getFullYear(), e.getMonth(), e.getDay(), e.getHours(), e.getMinutes(), e.getSeconds());
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato time range start', e);
        this.LeggeActivities2();

        this.chiamaBound();
      }, 100);
    }
  }

  impostaTimeRangeStop(eee) {
    if (eee) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        const e = this.datePipe.transform(new Date(eee), 'yyyy-MM-dd HH:mm:ss')
        this.timeRangeDSFStop = e; // new Date(e.getFullYear(), e.getMonth(), e.getDay(), e.getHours(), e.getMinutes(), e.getSeconds());
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato time range stop', e);
        this.LeggeActivities2();

        this.chiamaBound();
      }, 100);
    }
  }

  impostaTimeFilterStart(eee) {
    // alert('Imposto start: ' + eee);
    if (eee) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta time filter start', eee);
      const e = this.datePipe.transform(new Date(eee), 'yyyy-MM-dd HH:mm:ss.SSS')
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tms Inizio time filter start', e);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione tmsInizio 6', e);
      // logConsole('TMS INIZIO 4', e);
      this.Utilities.tmsInizio = e;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      this.impostaTimeRange(this.Utilities.tmsInizio + ';' + this.Utilities.tmsFine);
    }
  }

  impostaTimeFilterStop(eee) {
    // alert('Imposto stop: ' + eee);
    if (eee) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta time filter stop', eee);
      const e = this.datePipe.transform(new Date(eee), 'yyyy-MM-dd HH:mm:ss')
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS FINE 4: ', e);
      this.Utilities.tmsFine = e;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      this.impostaTimeRange(this.Utilities.tmsInizio + ';' + this.Utilities.tmsFine);
    }
  }

  impostaTimeRange(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (!e || e === '') {
      return;
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta time filter range', e);
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

    // this.Utilities.range = (rFine.getTime() - rInizio.getTime()) / 2; // 26/10
    const diff = (rFine.getTime() - rInizio.getTime()) / 2;

    // if (this.Utilities.range) {
      // this.Utilities.tmsSelezionato = new Date(rInizio + this.Utilities.range);
      this.Utilities.tmsSelezionato = this.datePipe.transform((rInizio.getTime() + diff).toString().replace('T', ' ').replace('Z', ' ') + ' UTC +00', 'yyyy-MM-dd HH:mm:ss', 'UTC');
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.tmsSelezionato);

      const tm = setTimeout(() => {
        clearTimeout(tm);
        ExternalUtilities.aggiornaTmsStringa(ee[1], this.Utilities, 'Imposta time range 2');
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utilities.tmsInizio, this.Utilities.tmsFine, this.Utilities.range, this.Utilities.tmsSelezionato);
      }, 10);
    // }
    // AppComponent.CambioTmsSelezionato(this.Utilities.tmsSelezionato);
  }

  sistemaDimensioniFramesSuApertura(quale, primo, secondo) {
    if (this.impostazioni.maskSize[this.pageSelector][primo] === 0 && this.impostazioni.maskSize[this.pageSelector][secondo] > 0) {
      this.impostazioni.maskSize[this.pageSelector][quale] = 50;
      this.impostazioni.maskSize[this.pageSelector][secondo] = 50;
    } else {
      if (this.impostazioni.maskSize[this.pageSelector][primo] > 0 && this.impostazioni.maskSize[this.pageSelector][secondo] === 0) {
        this.impostazioni.maskSize[this.pageSelector][primo] = 50;
        this.impostazioni.maskSize[this.pageSelector][quale] = 50;
      } else {
        if (this.impostazioni.maskSize[this.pageSelector][primo] > 0 && this.impostazioni.maskSize[this.pageSelector][secondo] > 0) {
          this.impostazioni.maskSize[this.pageSelector][primo] = 33;
          this.impostazioni.maskSize[this.pageSelector][secondo] = 33;
          this.impostazioni.maskSize[this.pageSelector][quale] = 33;
        } else {
          this.impostazioni.maskSize[this.pageSelector][primo] = 0;
          this.impostazioni.maskSize[this.pageSelector][secondo] = 0;
          this.impostazioni.maskSize[this.pageSelector][quale] = 100;
        }
      }
    }
    // logConsole('Finestre', this.impostazioni.maskSize[this.pageSelector], primo, secondo, quale);
    if (this.impostazioni.maskSizeHor[this.pageSelector][1] === 0) {
      this.impostazioni.maskSizeHor[this.pageSelector][1] = 6;
      this.impostazioni.maskSizeHor[this.pageSelector][2] -= 3;
      this.impostazioni.maskSizeHor[this.pageSelector][3] -= 3;
    } else {
      if (this.impostazioni.maskSizeHor[this.pageSelector][2] === 0) {
        this.impostazioni.maskSizeHor[this.pageSelector][1] -= 3;
        this.impostazioni.maskSizeHor[this.pageSelector][2] = 6;
        this.impostazioni.maskSizeHor[this.pageSelector][3] -= 3;
      } else {
        if (this.impostazioni.maskSizeHor[this.pageSelector][3] === 0) {
          this.impostazioni.maskSizeHor[this.pageSelector][1] -= 3;
          this.impostazioni.maskSizeHor[this.pageSelector][2] -= 3;
          this.impostazioni.maskSizeHor[this.pageSelector][3] = 6;
        }
      }
    }
    // logConsole('Finestre HOR', this.impostazioni.maskSizeHor[this.pageSelector]);
  }

  apriFrame(e) {
    // this.gest_finestre.aggiungeFrame(this, n);

    // this.impostazioni.maskSize[this.pageSelector][e] = 33;
    // this.impostazioni.maskVisible[this.pageSelector][e] = false;

    if (e < 4) {
      let primo;
      let secondo;
      if (e == 1) { primo = 2; secondo = 3;}
      if (e == 2) { primo = 1; secondo = 3;}
      if (e == 3) { primo = 1; secondo = 2;}

      this.sistemaDimensioniFramesSuApertura(e, primo, secondo);
    } else {
      if (e > 3 && e < 7) {
        let primo;
        let secondo;
        if (e == 4) { primo = 5; secondo = 6;}
        if (e == 5) { primo = 4; secondo = 6;}
        if (e == 6) { primo = 4; secondo = 5;}

        this.sistemaDimensioniFramesSuApertura(e, primo, secondo);
      } else {
        let primo;
        let secondo;
        if (e == 7) { primo = 8; secondo = 9;}
        if (e == 8) { primo = 7; secondo = 9;}
        if (e == 9) { primo = 7; secondo = 8;}
        
        this.sistemaDimensioniFramesSuApertura(e, primo, secondo);
      }
    }
    // this.gestisceFinestre(e);

    // alert('DIMENS 2');
    this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[0] = this.impostazioni.maskSize[this.pageSelector][1];
    this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[1] = this.impostazioni.maskSize[this.pageSelector][2];
    this.impostazioni.dimensioni[this.pageSelector].PrimaRiga[2] = this.impostazioni.maskSize[this.pageSelector][3];

    this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[0] = this.impostazioni.maskSize[this.pageSelector][4];
    this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[1] = this.impostazioni.maskSize[this.pageSelector][5];
    this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[2] = this.impostazioni.maskSize[this.pageSelector][6];

    this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[0] = this.impostazioni.maskSize[this.pageSelector][7];
    this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[1] = this.impostazioni.maskSize[this.pageSelector][8];
    this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[2] = this.impostazioni.maskSize[this.pageSelector][9];

    // alert('HOR 5');
    this.impostazioni.dimensioni[this.pageSelector].Orizzontale[0] = this.impostazioni.maskSizeHor[this.pageSelector][1];
    this.impostazioni.dimensioni[this.pageSelector].Orizzontale[1] = this.impostazioni.maskSizeHor[this.pageSelector][2];
    this.impostazioni.dimensioni[this.pageSelector].Orizzontale[2] = this.impostazioni.maskSizeHor[this.pageSelector][3];
  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.pageSelector])));
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(JSON.stringify(this.impostazioni.maskVisible[this.pageSelector])));

    // alert('SISTHOR 2'); 28/05/2024
    this.gest_finestre.sistemaHor(this, e);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura frame: size:', this.impostazioni.maskSize[this.pageSelector]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura frame: size Hor:', this.impostazioni.maskSizeHor[this.pageSelector]);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura frame: visible:', this.impostazioni.maskVisible[this.pageSelector]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura frame: dimensioni:', this.impostazioni.dimensioni[this.pageSelector]);

    this.checkDifferenceFromStartJSON();

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskVisible);
    if (this.impostazioni.maskSize[this.pageSelector][1] === 0 && this.impostazioni.maskSize[this.pageSelector][2] === 0 &&
      this.impostazioni.maskSize[this.pageSelector][3] === 0) {
      this.impostazioni.nascoste123 = true;
    } else {
      this.impostazioni.nascoste123 = false;
    }

    /* 
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    if (this.impostazioni.occhioCheckato[this.pageSelector] === false) {
      this.impostazioni.framesPinnati = false;
      this.apre123();
    } else {
      this.impostazioni.framesPinnati = true;
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.chiude123();
      }, 1000);
    }
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    */
  }

  prendeNomeSET1(e) {
    if (this.datiActivitySet && this.datiActivitySet !== 'empty') {
      let ritorno = '';
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiActivitySet);
      this.datiActivitySet.forEach(element => {
        if (+element.ID === +e) {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
          ritorno = element.NAME;
        }
      });
      return ritorno;
    }
  }

  impostaAGNoACT(n, e) {
    if (e && e.toString().indexOf('§') > -1) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      const campi = e.toString().split('§');
      if (campi[1] && campi[1] !== 'undefined') {
        this.stringaAGNoACT = JSON.parse(campi[1]);
        this.stringaAGNoACT = JSON.parse(JSON.stringify(this.stringaAGNoACT));
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta Stringa AGN o ACT', this.stringaAGNoACT);
      }
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.stringaAGNoACT);
    }
  }

  impostaTimeSelezionato(e, daDove) {
    if (!e || e === '') {
      return;
    }

    // const tm = setTimeout(() => {
      // alert(e);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta tms selezionato', e , daDove);
      let d1 = new Date(e + ' UTC+00').getTime();
      const rInizio = new Date(this.Utilities.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      const rFine = new Date(this.Utilities.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      if (d1 > rFine || d1 < rInizio) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta tms selezionato. TMS Maggiore della fine', d1, rFine);

        const diff = (rFine - rInizio) / 2;

        const sInizio = this.Utilities.datePipe.transform(d1 - diff, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        // logConsole('TMS INIZIO 5', sInizio);
        this.Utilities.tmsInizio = sInizio;

        const sFine = this.Utilities.datePipe.transform(d1 + diff, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        this.Utilities.tmsFine = sFine;

        // d1 = rFine;
      }

      this.Utilities.rangeSelezionatoStampa = this.Utilities.tmsInizio + '<br />' + this.Utilities.tmsFine;

      const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss', 'UTC');
      // alert(t1);
      this.Utilities.tmsSelezionato = t1; // 26/10

      // AppComponent.CambioTmsSelezionato(this.Utilities, t1, 'Imposta time selezionato', this.timerAttivatoAuto);

      this.cambioTmsSelezionatoConControlloGPS(t1, 'Imposta time selezionato', true);
    // }, 100);
  }

  impostaTimeSelezionatoInizio(ee, daDove) {
    if (!ee || ee === '') {
      return;
    }
    let e = ee;
    if (typeof(e) === 'string' && e.indexOf(';') > -1) {
      const eee = e.split(';');
      e = eee[0];
      daDove = eee[1]
    }
    const d1 = new Date(e + ' UTC+00').getTime();
    const dFine = new Date(this.Utilities.tmsFine + ' UTC+00').getTime();
    if (d1 > dFine) {
      const dI = new Date(this.Utilities.tmsInizio + ' UTC+00').getTime();
      const t1 = this.datePipe.transform(dI , 'yyyy-MM-dd HH:mm:ss', 'UTC');
      this.Utilities.tmsInizio = '';
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione tmsInizio 7', t1);
        // logConsole('TMS INIZIO 6', t1);
        this.Utilities.tmsInizio = t1;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Errore sull\'impostazione del tms inizio. Maggiore della fine: ', e , daDove);
        const messaggio = 'Start time cannot be greater than End time';
        Swal.fire({
          title: 'Warning',
          text: messaggio,
          icon: 'warning',
          showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
          },
        });    
      }, 100);
      return;
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta tms Inizio', e , daDove);
    const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss', 'UTC')
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tms Inizio imposta time selezionato inizio', t1, daDove);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione tmsInizio 8', t1);
    // logConsole('TMS INIZIO 7', t1);
    this.Utilities.tmsInizio = t1;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time start impostato', t1);

    this.calcolaRangeInizio();
  }

  calcolaRangeInizio() {
    // return;

    let rInizio = new Date(this.Utilities.tmsInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    // rInizio -= (+this.valoreTimeSpanRange * 1000);

    // const diff = (new Date(this.Utilities.tmsFine).getTime() - new Date(this.Utilities.tmsInizio).getTime()) / 1000;
    // this.valoreTimeSpan = +diff;
    const timeSpan = ExternalUtilities.calcolaTimeSpan(this.Utilities);
    // this.Utilities.rangeDiSecondiPerMille = +this.valoreTimeSpan * 1000;
    // this.Utilities.range = this.Utilities.rangeDiSecondiPerMille;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeInizio. Tms Inizio', this.Utilities.tmsInizio);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeInizio. Tms Selezionato', this.Utilities.tmsSelezionato);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeInizio. Tms Fine', this.Utilities.tmsFine);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeInizio. Valore time span', timeSpan); // this.valoreTimeSpan);

    if (this.Utilities.tmsSelezionato) {
      let rActual = new Date(this.Utilities.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeInizio. Controllo congruità: ', rActual, rInizio);
      if (rActual < rInizio) {
        rActual = rInizio + (timeSpan / 2);
        const sActual = this.Utilities.datePipe.transform(rActual, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeInizio. Ts minore dell\'inizio. Reimposto a ', sActual);
        this.Utilities.tmsSelezionato = sActual;
        // this.Utilities.tmsSelezionatoStringa = sActual;
      }

      // this.cambioTmsSelezionatoConControlloGPS(this.Utilities.tmsSelezionato, 'calcolaRangeInizio', true);

      this.ridisegnaTutto = new Date();

      this.Utilities.rangeSelezionatoStampa = this.Utilities.tmsInizio + '<br />' + this.Utilities.tmsFine;

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeInizio. Calcola range inizio', this.Utilities.tmsInizio, this.Utilities.tmsSelezionato, this.Utilities.tmsFine);
    }
  }

  calcolaRangeFine() {
    // return;

    let rFine = new Date(this.Utilities.tmsFine.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
    // rInizio -= (+this.valoreTimeSpanRange * 1000);

    // const diff = (new Date(this.Utilities.tmsFine).getTime() - new Date(this.Utilities.tmsInizio).getTime()) / 1000;
    // this.valoreTimeSpan = +diff;
    const timeSpan = ExternalUtilities.calcolaTimeSpan(this.Utilities);
    // this.Utilities.rangeDiSecondiPerMille = +this.valoreTimeSpan * 1000;
    // this.Utilities.range = this.Utilities.rangeDiSecondiPerMille;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine. Tms Inizio', this.Utilities.tmsInizio);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine. Tms Selezionato', this.Utilities.tmsSelezionato);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine. Tms Fine', this.Utilities.tmsFine);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine. Valore time span', timeSpan); // this.valoreTimeSpan);

    if (this.Utilities.tmsSelezionato) {
      let rActual = new Date(this.Utilities.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine. Controllo congruità: ', rActual, rFine, rActual - rFine);
      if (rActual > rFine) {
        rActual = (rFine - (timeSpan / 2)) + 1;
        const sActual = this.Utilities.datePipe.transform(rActual, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine. Ts maggiore della fine. Reimposto a ', sActual);
        this.Utilities.tmsSelezionato = sActual;
        // this.Utilities.tmsSelezionatoStringa = sActual;
      }

      this.Utilities.rangeSelezionatoStampa = this.Utilities.tmsInizio + '<br />' + this.Utilities.tmsFine;

      // this.cambioTmsSelezionatoConControlloGPS(this.Utilities.tmsSelezionato, 'calcolaRangeInizio', true);

      this.ridisegnaTutto = new Date();

      const sActual = this.Utilities.datePipe.transform(this.Utilities.tmsSelezionato, 'yyyy-MM-dd HH:mm:ss');
      // this.Utilities.tmsSelezionatoStringa = sActual;

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaRangeFine. Fine', this.Utilities.tmsInizio);
    }
  }

  impostaRangesContemporaneamente(e) {
    if (e) {
      const min = e.min;
      const max = e.max;

      this.Utilities.tmsInizio = this.datePipe.transform(new Date(min), 'yyyy-MM-dd HH:mm:ss');
      this.Utilities.tmsFine = this.datePipe.transform(new Date(max), 'yyyy-MM-dd HH:mm:ss');

      this.impostaTimeSelezionatoInizio(this.Utilities.tmsInizio, 'impostaRangesContemporaneamente');
      this.impostaTimeSelezionatoFine(this.Utilities.tmsFine, 'impostaRangesContemporaneamente');
    }
  }

  impostaTimeSelezionatoFine(ee, daDove) {
    if (!ee || ee === '') {
      return;
    }
    let e = ee;
    if (typeof(e) === 'string' && e.indexOf(';') > -1) {
      const eee = e.split(';');
      e = eee[0];
      daDove = eee[1]
    }
    const d1 = new Date(e + ' UTC+00').getTime();
    const dInizio = new Date(this.Utilities.tmsInizio + ' UTC+00').getTime();
    if (d1 < dInizio) {
      const dI = new Date(this.Utilities.tmsFine + ' UTC+00').getTime();
      const t1 = this.datePipe.transform(dI , 'yyyy-MM-dd HH:mm:ss', 'UTC');
      this.Utilities.tmsFine = '';
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.Utilities.tmsFine = t1;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Errore sull\'impostazione del tms inizio. Maggiore della fine: ', e , daDove);
        const messaggio = 'End time cannot be lesser than Start time';
        Swal.fire({
          title: 'Warning',
          text: messaggio,
          icon: 'warning',
          showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
          },
        });    
      }, 100);
      return;
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta tms fine', e , daDove);
    const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss', 'UTC')
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS FINE 5: ', t1);
    this.Utilities.tmsFine = t1;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time end impostato', t1);

    this.calcolaRangeFine();
  }

  selectUeProf(e) {
    if (e && e.VALUE_STR) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.ueProfScelto = e.VALUE_STR;
      }, 10);
    }
  }

  valoreUeProf(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.ueProfScelto = e.replace('"', '').replace('"', '');
      }, 10);
    }
  }

  selectRat(e) {
    if (e && e.VALUE_STR) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.ratScelto = e.VALUE_STR;
      }, 10);
    }
  }

  valoreRat(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.ratScelto = e.replace('"', '').replace('"', '');
      }, 10);
    }
  }

  selectBand(e) {
    if (e && e.VALUE_STR) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.ratScelto = e.VALUE_STR;
      }, 10);
    }
  }

  valoreBand(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.bandScelto = e.replace('"', '').replace('"', '');
      }, 10);
    }
  }
  
  refreshPlanimetriaEmit(e) {
    this.refreshPlanimetria = new Date().toString();
  }

  cambioSelArea(e) {
    const ee =  { name: e, id: e};
    this.selectComboSelArea(ee);
  }

  selectComboSelArea(e) {
    if (e && e.name) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select combo sel area', e);
      // const tm = setTimeout(() => {
        this.comboSelArea = e.id;
        this.impostazioni.comboSelArea = e;
        // localStorage.setItem('SelectAreaContext', e.id);
      // }, 10);
    }
  }

  /* valoreSelArea(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e) {
      const tm = setTimeout(() => {
        this.comboSelArea = +(e.replace('"', '').replace('"', ''));
      }, 10);
    }
  } */

  selectScenario(e) {
    if (e && e.VALUE_STR) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.scenarioScelto = e.VALUE_STR;
      }, 10);
    }
  }

  valoreScenario(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.scenarioScelto = e.replace('"', '').replace('"', '');
      }, 10);
    }
  }

  cambioGlobalMeasure(e) {
    this.impostazioni.globalMeasure = JSON.stringify(e);
    this.Utilities.globalMeasure = e;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e.measr_code);
    this.checkDifferenceFromStartJSON();
  }

  cambioGlobalMeasureArfcn(e) {
    this.impostazioni.globalMeasureArfcn = JSON.stringify(e);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio global measure', e);
    this.checkDifferenceFromStartJSON();
  }

  cambioTipoMisuraGlobaleArfcn(e) {
    this.impostazioni.tipoMisuraGlobaleArfcn = e;
    this.Utilities.tipoMisuraGlobaleArfcn = e;
    // logConsole('Misura globale arrivata', e);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo global measure', e);
    this.checkDifferenceFromStartJSON();
  }

  checkEdge(event) {
    this.edge = event;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'edge:', event);
  }

  cambioTmsSelezionato(n, e) {
    if (e.indexOf(';') > -1) {
      const ee = e.split(';');
      // AppComponent.CambioTmsSelezionato(this.Utilities, ee[0], 'Cambio tms selezionato da ' + ee[1] + ' in frame ' + n, this.timerAttivatoAuto);

      this.cambioTmsSelezionatoConControlloGPS(ee[0], 'Cambio tms selezionato da ' + ee[1] + ' in frame ' + n, false);
    } else {
      // AppComponent.CambioTmsSelezionato(this.Utilities, e, 'Cambio tms selezionato in frame ' + n, this.timerAttivatoAuto);

      this.cambioTmsSelezionatoConControlloGPS(e, 'Cambio tms selezionato in frame ' + n, false);
    }
  }

  cambioTimeRangeStart(eee) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time start', eee);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time start', eee);
    // const e = new Date(eee); // this.datePipe.transform(new Date(eee), 'yyyy-MM-dd HH:mm:ss')
    this.timeRangeDSFStart = eee; // new Date(e.getFullYear(), e.getMonth(), e.getDay(), e.getHours(), e.getMinutes(), e.getSeconds());
  }

  cambioTimeRangeStop(eee) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio time stop', eee);
    // const e = new Date(eee); // this.datePipe.transform(new Date(eee), 'yyyy-MM-dd HH:mm:ss')
    this.timeRangeDSFStop = eee; // new Date(e.getFullYear(), e.getMonth(), e.getDay(), e.getHours(), e.getMinutes(), e.getSeconds());
  }

  clickSuMappaPerEsterno(e) {

  }

  cambioBBOXO(f, q, e) {
    if (e !== this.bboxO) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio BBOX Overview', q, f, e);
      this.bboxO = e;
    }
    // this.bbox =  { frame: q, valori: e }; // MODIFICA 13/06/2023
  }

  cambioBBOXZ(f, q, e) {
    // if (e) {
      // if (Math.abs(e[2] - e[0]) < 30 && Math.abs(e[3] - e[1]) < 20) {
        if (e !== this.bboxZ) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio BBOX Zoom', q, f, e);
          this.bboxZ = e;
        }
        // this.bbox =  { frame: q, valori: e }; // MODIFICA 13/06/2023
      // }
    // }
  }

  cambioRigaMG(e) {
    if (e) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio riga MG', e);
      this.rigaMG = JSON.stringify(e);
      this.rigaBBoxSelected = JSON.stringify(e);
    }
  }

  passaggioSquareMetersO(e) {
    if (e) {
      if (this.accordionDebug === true) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Passaggio Square Meters OverView', e);
      }
      this.squareMetersO = JSON.stringify(e);
    }
  }

  passaggioSquareMetersZ(e) {
    if (e) {
      if (this.accordionDebug === true) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Passaggio Square Meters Zoom', e);
      }
      this.squareMetersZ = JSON.stringify(e);
    }
  }

  cambioGeoFilter(f, q, e) {
    if (this.accordionDebug === true) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio Geo Filter', f, q, e);
    }
    this.impostazioni.geoFilter[f][q] = e;
    this.checkDifferenceFromStartJSON();
  }

  rigaBBoxSelected = '';

  cambioRigaCG(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio Riga Selezionata Cluster Grid', e);
    this.rigaCG = JSON.parse(JSON.stringify(e));
    this.rigaBBoxSelected = e.bbox;
  }

  cambioRigaArfcn(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio Riga Selezionata Cluster Grid', e);
    this.rigaArfcn = JSON.parse(JSON.stringify(e));
    this.rigaBBoxSelected = e.bbox;
  }

  cambioMosaicoSelezionato(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mosaico selezionato', e);
    this.mosaicoSelezionato = e;
  }

  cambioClusterSelezionato(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster selezionato', e);
    this.clusterSelezionato = e;
  }

  arrivatoMessaggioDiErrore(e) {
    this.messaggioDiErrore = true;
  }

  prendePlatFormName(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Platform name:', e);
    this.platformName = e;
  }

  prendeDateNowH(e) {
    this.dateNowH = e;
  }

  prendeSymb_TimeStamp(e) {
    this.symb_TimeStamp = e;
  }

  impostaTimeCursorPosition(e) {
    const ee = this.sistemaPunto(e);
    this.time_cursor_position = ee;
  }

  impostaCenterPosition(e) {
    const ee = this.sistemaPunto(e);
    this.center_position = ee;
  }

  sistemaPunto(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Center Position', e, typeof(e));
    let ee = e;
    if (ee && ee != null) {
      if (typeof(ee) === 'object') {
        ee = ee.toString();
        ee = ee.replace('[', '');
        ee = ee.replace(']', '');
        ee = ee.replace(',', ' ');
      }
      if (ee) {
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
    } else {
      return '';
    }
  }

  /* leggeBounds() {
    const params = {
      cntx_id: this.sessioneID,
      v_act_set_name_list: this.activitySetName[1]['NAME']
    };
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo Bounds', params);

    this.apiService.chiamataPost(this.Utilities, 'geo_act_set_bounds__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if (data !== null && data[0]) {
        ExternalUtilities.checkRitornoChiamata(data);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'RitornoBounds', data);
        if (data[0].start_tms && data[0].start_tms !== null) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'START TMS Bounds', data[0].start_tms);

          this.impostaTimeRangeStart(this.datePipe.transform(data[0].start_tms, 'yyyy-MM-dd HH:mm:ss'));
        }
        if (data[0].end_tms && data[0].end_tms !== null) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'END TMS Bounds', data[0].end_tms);

          this.impostaTimeRangeStop(this.datePipe.transform(data[0].end_tms, 'yyyy-MM-dd HH:mm:ss'));
        }

        if (data[0].agn_code) {
          this.stringaAGNoACT[this.activitySet[1]] = data[0].agn_code;
          this.impostaAGNoACT(1 + '§' + JSON.stringify(this.stringaAGNoACT[this.activitySet[1]]));
        }

        if (data[0].start_tms && data[0].start_tms !== null) {
          const d1 = new Date(data[0].start_tms.replace('T', ' ')).getTime();
          const d2 = new Date(data[0].start_tms.replace('T', ' ')).getTime() + 60000;
          const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss');
          const t2 = this.datePipe.transform(d2 , 'yyyy-MM-dd HH:mm:ss');
          const ts = this.datePipe.transform(d1 + (d2 - d1) , 'yyyy-MM-dd HH:mm:ss');
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data[0].start_tms, d2, d1, t1);

          this.Utilities.tmsSelezionato = ts;
          this.Utilities.tmsInizio = t1;
          this.Utilities.tmsFine = t2;

          const tm = setTimeout(() => {
            this.Utilities.range = (d2 - d1) / 2;

            // this.cambioTmsSelezionato.emit(ts);
            ExternalUtilities.aggiornaTmsStringa(ts, this.Utilities);
            // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.range, this.Utils.tmsSelezionato);

            this.resetPosition();
          }, 10);
        }
      }
    });
  } */

  async disegnaEventi() {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno event summary: ', this.activitySetName[1]);

    this.act_setES = this.activitySetName[1]['NAME'];
    let sInizio = this.timeRangeDSFStart;
    let sFine = this.timeRangeDSFStop;

    if (!this.act_setES) {
      let q = 0;
      const t = setInterval(() => {
  
        this.act_setES = this.activitySetName[1]['NAME'];
        sInizio = this.timeRangeDSFStart;
        sFine = this.timeRangeDSFStop;
        
        if (this.act_setES && sInizio && sFine) {
          clearInterval(t);

          this.disegnaEventi2();
        } else {
          q++;
          if (q > 10) {
            clearInterval(t);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da event summary 0', this.act_setES);

            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '*' + act_set + '*');
            this.datiEventSummary = 'empty grid';
            this.caricamentoEVenti = false;
            return;
          }
        }
      }, 1000);
    } else {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Event summary. Activity presente, proseguo: ', this.act_setES);

      this.disegnaEventi2();
    }
  }

  erroreEventSummary = '';

  async disegnaEventi2() {
    // // // this.staDisegnandoEventiSummary[this.NumeroFrame2] = true;

    // this.sceltaActivityDaSet
    // const id = act_set;

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, act_set);

    // let tmsFilter = '';
    let sInizio = '';
    let sFine = '';
    /* const timeFilter = 2;

    if (timeFilter === 2) {
      if (!this.Utilities.tmsSelezionato || this.Utilities.tmsSelezionato === null || this.Utilities.tmsSelezionato === '') {
        this.datiEventSummary = 'empty grid';
        // // // this.staDisegnandoEventiSummary[this.NumeroFrame2] = false;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da event summary 2');

        return;
      }

      // const dInizio = ((new Date(this.Utils.tmsSelezionato).getTime()) - (this.Utils.rangeDiSecondiPerMille)) +
      //   (new Date().getTimezoneOffset() * 60000);
      sInizio = this.Utilities.tmsInizio; // this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
      // const dFine = ((new Date(this.Utils.tmsSelezionato).getTime()) + (this.Utils.rangeDiSecondiPerMille)) +
      //   (new Date().getTimezoneOffset() * 60000);
      sFine = this.Utilities.tmsFine; //  this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
      // tmsFilter = '(tms >= \'' + sInizio + '\' and tms <= \'' + sFine + '\')';
    } else { */
      // sInizio = '1970-01-01 00:00:00';
      // sFine = '3999-01-01 00:00:00';
      sInizio = this.timeRangeDSFStart;
      sFine = this.timeRangeDSFStop;
    // }

    let eventi = '';

    let lista = null;
    let lep = null;
    /* if (this.tipoEvento2 === 'L') {
      if (!this.listaEventiDaPassare2) {
        this.listaEventiDaPassare2 = 'empty grid';
      }
      lista = this.listaEventiDaPassare2;
      lep = ExternalUtilities.converteStringaInJSON(lista);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi locale', this.NumeroFrame2, this.listaEventiDaPassare2);
    } else {
      if (!this.listaEventiDaPassare2) {
        this.Utils.eventiSceltiES2 = new Array();
      }
      lista = this.Utils.eventiSceltiES2;
      lep = lista;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi globale', this.NumeroFrame2, lista);
    } */

    if (!this.listaEventiDaPassare) {
      this.listaEventiDaPassare = 'empty grid';
    }
    lista = this.listaEventiDaPassare;
    lep = ExternalUtilities.converteStringaInJSON(lista);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi locale', this.listaEventiDaPassare);

    /* const tipoEvento2 = 'G';

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure per eventi:', lista, lep);
    if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep !== '"empty grid"' && lep.length > 0) {
      lep.forEach(element => {
        eventi += element.EVENT_TYPE + ',';
      });
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Folders / eventi:', folders, eventi);
    if (eventi.length > 0) {
      eventi = eventi.substring(0, eventi.length - 1);

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, eventi);
    } else {
      if (tipoEvento2 === 'G') {
        eventi = 'NONE';
      } else {
        eventi = 'ALL';
      }
    } */
    eventi = 'ALL';

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi finale: ', eventi);

    /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.tipoEvento2);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, eventi);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, lista);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, lep);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, act_set);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, id);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, sInizio, sFine); */

    // // // this.staDisegnandoEventiSummary[this.NumeroFrame2] = false;

    if (lista === undefined || lista === 'undefined')  {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da event summary 3');

      return;
    }

    if (sInizio === undefined || sInizio === 'undefined') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da event summary 4');

      return; // sInizio = this.timeRangeDSFStart2;
    }
    if (sFine === undefined || sFine === 'undefined') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da event summary 5');

      return; // sFine = this.timeRangeDSFStop2;
    }

    // const geoFilter = ExternalUtilities.ritornaGeoFilter(this, this.geoFilter2);
    const geoFilter = '(ALL)';
    
    if (!sInizio || !sFine || sInizio === 'undefined' || sInizio === '"undefined"' || sFine === 'undefined' || sFine === '"undefined"'
    || sInizio === null || sInizio === 'null' || sInizio === '"null"' || sFine === null || sFine === 'null' || sFine === '"null"') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da event summary', sInizio, sFine);

      return;
    }

    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_act_set_name_list": "' + this.act_setES + '",' +
      '"v_event_type_list": "' + eventi + '",' +
      '"v_tms_min": "' + sInizio + '",' +
      '"v_tms_max": "' + sFine + '",' +
      '"v_bbox": "' + geoFilter + '"' +
    '}';

    const propertyName = '';
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Event Summary', params);
    const actualCall = this.act_setES + ';' + params + ';' +
          propertyName;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, actualCall);
    // if (!this.Utils.lastCallES) {
    //   this.Utils.lastCallES = ExternalUtilities.creaMatrice(environmenthis.quantiSottoFrames, environmenthis.quantiFrames, '');
    // }
    if (actualCall !== this.lastCallES) {
      this.lastCallES = actualCall;

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Event summary', params);

      this.caricamentoEVenti = true;
      this.erroreEventSummary = '';
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh summary:', params);

      // this.effettuaAutoFitES = false;
      this.apiService.chiamataPost(this.Utilities, 'geo_act_set_summary__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        if (data2 && data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(Utils, data2);

          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati Event Summary:', data2);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati griglia Event Summary:', this.datiEventSummary);

          if (data2) {
            if (data2.message) {
              this.erroreEventSummary = 'ERROR: ' + data2.code + '-' + data2.message;
              this.caricamentoEVenti = false;
              this.datiEventSummary = undefined;
            } else {
              if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
                this.frameNameES = data2.GridProperty[0].GridName;
              }
              this.appoEventSummary = data2;
              // this.datiEventSummary = data2;

              if (this.datiEventSummary && this.datiEventSummary !== 'empty grid') {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Faccio refresh Dati griglia Event Summary');

                if (data2 && data2.DataTable && data2.DataTable.length > 0) {
                  this.datiEventSummary.DataTable = data2.DataTable;
                } else {
                  this.datiEventSummary = 'empty grid';
                }

                // this.impostaArraySelezioneES();
                // this.impostaPaginaES = 0;

                // // // this.staDisegnandoEventiSummary[this.NumeroFrame2] = false;
                this.caricamentoEVenti = false;
              } else {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricarico Dati griglia Event Summary');

                this.datiEventSummary = data2;
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, dCS, dCD);

                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  this.effettuaAutoFitES = !this.effettuaAutoFitES;

                  // // this.staDisegnandoEventiSummary[this.NumeroFrame2] = false;
                  this.caricamentoEVenti = false;
                }, 100);
              }
            }
          } else {
            // // this.staDisegnandoEventiSummary[this.NumeroFrame2] = false;
            this.caricamentoEVenti = false;
          }
        } else {
          // // this.staDisegnandoEventiSummary[this.NumeroFrame2] = false;
          this.caricamentoEVenti = false;
        }
      }, error => {
        this.caricamentoEVenti = false;
        // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, error);

        if (error && error !== null) {
          this.datiEventSummary = 'ERROR: ' + error._body;
        } else {
          this.datiEventSummary = 'empty grid';
        }
      });
    } else {
      this.caricamentoEVenti = false;
      // this.datiEventSummary = JSON.parse(this.appoEventSummary);
      // // this.staDisegnandoEventiSummary[this.NumeroFrame2] = false;
      // this.caricamentoEventSummaryInCorso = false;
    }
  }

  clickRigaES(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click riga', e);
    this.eventiSceltiDaFrame = undefined;

    const ee = { dati: e, selezionato: e, deselezionato: e };
    this.gestisceClickSummary(ee);
  }

  deselezionateTutteLeRigheES(e) {
    const ee = { dati: undefined, selezionato: undefined, deselezionato: undefined };
    this.gestisceClickSummary(ee);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulizia filtro eventi ES', this.Utilities.listaEventiSE);
  }

  selezionateTutteLeRigheES(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezionati tutti gli eventi', e);

    this.idSelezionatoES = e;

    const ee = { dati: e, selezionato: e, deselezionato: undefined };
    this.gestisceClickSummary(ee);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezionati tutti gli eventi. Da passare', this.impostazioni.eventiSceltiES);
  }

  eventiSceltiESDiPassaggio;

  riempieArraySelezioneES(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click array selezione', e);
    this.eventiSceltiDaFrame = undefined;
    this.eventiSceltiESTesto = '';
    this.impostaSelezioneES = [-1];
    this.eventiSceltiESDiPassaggio = this.impostazioni.eventiSceltiES;

    this.gestisceClickSummary(e);
  }

  gestisceClickSummary(rit) {
    if (this.eventiSceltiDaFrame) {
      if (!rit.dati.length) {
        const r = rit.dati;
        rit.dati = new Array();
        rit.dati.push(r);
      }
      this.eventiSceltiDaFrame.forEach(element => {
        rit.dati.push(element);
      });
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Clickati', rit);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Passati', this.eventiSceltiDaFrame);

    let eventiSceltiES = new Array();
    let impostaSelezioneESAPP = new Array();

    /* if (rit.dati === undefined) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco per pulizia totale');

      this.Utilities.eventiSceltiESTesto = '';
      this.impostaSelezioneES = [-1];
      this.Utilities.eventiSceltiESDiPassaggio = this.Utilities.eventiSceltiES2;
      // this.eventiSceltiESEmit.emit(this.Utils.eventiSceltiES2);
      return;
    } */
    // logConsole('Click su check eventi', rit);

    let e = rit.dati;
    if (e.ROW_ID) {
      e = [e];
    }
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezionati da aggiungere', sel);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Deselezionati da togliere', desel);
    let messi = '';
    e.forEach(element => {
      // logConsole('GSC', element);
      if (element && element !== null && messi.indexOf(element.EVENT_TYPE + ',') === - 1) {
        messi += element.EVENT_TYPE + ',';
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, messi);
        const v = { EVENT_TYPE: element.EVENT_TYPE, ROW_ID: element.ROW_ID };
        eventiSceltiES.push(v);
        impostaSelezioneESAPP.push(element.ROW_ID);
      }
    });
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.eventiSceltiES2);

    this.eventiSceltiESTesto = '';
    if (eventiSceltiES) {
      eventiSceltiES.forEach(element => {
        this.eventiSceltiESTesto += element.EVENT_TYPE + ', ';
      });
      if (this.eventiSceltiESTesto.length > 1) {
        this.eventiSceltiESTesto = this.eventiSceltiESTesto.substring(0, this.eventiSceltiESTesto.length - 2);
      }
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Riempie array selezione es 1', eventiSceltiES);

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventi 4',  this.Utils.eventiSceltiES2)
      this.eventiSceltiESDiPassaggio = eventiSceltiES;
      this.impostazioni.eventiSceltiES = eventiSceltiES;
      logConsole('Click su check eventi', eventiSceltiES);
    }, 10);

    /* if (desel !== undefined && desel !== null) {
      const togliere = desel.EVENT_TYPE;
      const d1 = new Array();
      const d2 = new Array();
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiEventSummary.DataTable);
      impostaSelezioneESAPP.forEach(element => {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element)
        if (element) {
          let ok = true;
          this.datiEventSummary.DataTable.forEach(element2 => {
            if (ok) {
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element2)
              if (element.ROW_ID === element2.ROW_ID) {
                ok = false;
              }
            }
          });
          if (ok) {
            d1.push(element);
          }
        }
      });
      eventiSceltiES.forEach(element => {
        if (element.EVENT_TYPE !== togliere) {
          d2.push(element);
        }
      });
      impostaSelezioneESAPP = d1;
      eventiSceltiES = d2;

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rimepie array selezione es 2', eventiSceltiES);

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventi 5',  eventiSceltiES)
        this.eventiSceltiESDiPassaggio = eventiSceltiES;

        for (let s = 0; s <= environment.quantiSottoFrames; s++) {
          for (let n = 0; n <= environment.quantiFrames; n++) {
            this.impostazioni.eventiSceltiES[s][n] = JSON.parse(JSON.stringify(eventiSceltiES));
            logConsole('Emitto valori', s, n, this.impostazioni.eventiSceltiES[s][n])
          }
        }
      }, 10);
    } */

    this.impostaSelezioneES = JSON.parse(JSON.stringify(impostaSelezioneESAPP));
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione 2:', this.frameAttivo2, this.NumeroFrame, this.Utils.eventiSceltiES2, this.impostaSelezioneES);
    // this.eventiSceltiESEmit.emit(this.Utils.eventiSceltiES2);
  }

  dimensioniGriglia(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio dimensione griglia: ', this.NumeroFrame, e);
  }

  async disegnaMeasureDFN() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prende Point measures', t.NumeroFrame, tms);
    if (this.staElaborandoMDFN === true) {
      return;
    }

    const params = {
      cntx_id: this.sessioneID,
      v_filter_folder: null
    };

    const actualCall1 = 'MEASUREDFN;' + ';' + JSON.stringify(params);

    if (this.lastCallMeasureDFN !== actualCall1) {
      this.caricamentoDatiInCorsoMeasureDFN = true;

      this.lastCallMeasureDFN = actualCall1;

      this.staElaborandoMDFN = true;

      this.apiService.chiamataPost(this.Utilities, 'geo_measure_dfn__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        ExternalUtilities.checkRitornoChiamata(Utils, data2);

        this.staElaborandoMDFN = false;
        this.caricamentoDatiInCorsoMeasureDFN = false;
        if (data2 && data2 !== null) {
          const data = data2;
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Point info:', data);
          if (this.datiPointMeasureDFN && data.DataTable) {
            this.datiPointMeasureDFN.DataTable = data.DataTable;
          } else {
            this.datiPointMeasureDFN = data;
            this.effettuaAutoFitMeasureDFN = !this.effettuaAutoFitMeasureDFN;
          }
        } else {
          this.datiPointMeasureDFN = 'empty grid'; // null;
        }
      }, error => {
        this.staElaborandoMDFN = false;
        this.caricamentoDatiInCorsoMeasureDFN = false;
        // ExternalUtilities.messaggioDiErrore(t, 'Read point Measure DFN:' + error);
      });
    }
  }

  clickRigaMeasureDFN(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio misura DFN', e);

    // this.selezionePM = e[0].ROW_ID;
    // logConsole('Click riga mDFN', e[0]);
    this.Utilities.globalMeasure = e[0];
    this.cambioGlobalMeasure(e[0]);
  }

  riempieArraySelezioneMeasureDFN(e) {
    // alert('Misure mappa: ' + JSON.stringify(e));
  }

  misureDaPassare;

  clickSuComboMisuraDFN(e) {
    if (!e) {
      return;
    }
    // // logConsole('Misure selezionate', e);

    const misureGlobaliMappa = ['', '', '', '', ''];
    if (e.Tutte && e.Tutte.length > 0) {
      // let i = 0;
      e.Tutte.forEach(element => {
        if (element.VALORE !== undefined || element.VALORE === 0) {
          const numero = element.VALORE - 1;
          misureGlobaliMappa[numero] = element.MEASR_CODE;
          // i++;
        }
      });
    }
    // ExternalUtilities.misureGlobali = e.Tutte;

    // if (this.debug2 === true) {
    // // logConsole('Misure globali impostate', misureGlobaliMappa);
    
    this.impostazioni.misureGlobaliImpostate = e.Tutte;
    // // logConsole('Misure globali impostate dal context', e.Tutte);

    // this.Utilities.globalMeasure = e.Tutte;
    // ExternalUtilities.misureGlobali = JSON.parse(JSON.stringify(e.Tutte));
    // // logConsole('GRAFICI: MISURE impostate', e.Tutte);
    this.misureDaPassare = JSON.parse(JSON.stringify(e.Tutte));
    
    this.ridisegnaMappa = misureGlobaliMappa;
  }
  
  impostaMisureGlobali(e) {
    if (e) {
      this.impostazioni.misureGlobaliImpostate = e;
      this.misureComboLTP = e;
      // // logConsole('Misure globali passate dal frame', e);
    }
  }

  ridisegnaMappaEmit(e) {
    this.ridisegnaMappa = e;
    this.ridisegnaGrafici = JSON.parse(JSON.stringify(this.ridisegnaGrafici));
  }

  impostaQuadratoDaPassare(e) {
    this.quadratoMappa = e;
  }

  apre123() {
    // MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    return;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Vedo se devo aprire 123');
    if (this.impostazioni.maskSize[this.pageSelector][1] === 0 && this.impostazioni.maskSize[this.pageSelector][2] === 0 &&
      this.impostazioni.maskSize[this.pageSelector][3] === 0) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: No, ci sono i frames 1-2-3 chiusi');
        return;
    }
    /* let ok = true;
    this.massimizzata.forEach(element => {
      if (element === true) {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da apre123 per frame massimizzato');
        if (!this.impostazioni.framesPinnati) {
          ok = false;
        }
      }
    });
    if (!ok)  {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Esco per elemento non definito', this.impostazioni.framesPinnati);
      return
    };

    if (this.impostazioni.framesPinnati === false) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Esco per elemento falso', this.impostazioni.framesPinnati);
      return;
    } */
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Apro 123');
    /* let a = 33;
    let b = this.impostazioni.maskSizeHor[2];
    let c = this.impostazioni.maskSizeHor[3];
    if (b > 0 && c > 0) {
      b -= 17;
      c -= 16;
    } else {
      if (b > 0 && c === 0) {
        b -= 33;
        c = 0;
      } else {
        if (b === 0 && c > 0) {
          b = 0;
          c -= 33;
        } else {
          if (b === 0 && c === 100) {
            b = 0;
            c = 67;
          } else {
            if (b === 100 && c === 0) {
              b = 67;
              c = 0;
            } else {
              if (b === 0 && c === 0) {
                a = 100;
                b = 0;
                c = 0;
              }
            }
          }
        }
      }
    }

    this.impostazioni.maskSizeHor = [ 0, a, b, c]; */

    const tm = setTimeout(() => {
      clearTimeout(tm);
      /* if (!this.vecchieImpostazioniHor) { // || !this.vecchieImpostazioniHor[this.pageSelector]) {
        this.vecchieImpostazioniHor = [[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],
          [0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],
          [0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],
          [0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],
          [0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],
          [0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33],[0, 33, 33, 33]];
      } */
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.dimensioni[this.pageSelector]);
      // this.vecchieImpostazioniHor[this.pageSelector] =

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.vecchieImpostazioniHor[this.pageSelector]);
      let PrimaRiga = 33;
      let SecondaRiga = 33;
      let TerzaRiga = 33;
      if (this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[0] === 0 &&
        this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[1] === 0 &&
        this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[2] === 0) {
          if (this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[0] === 0 &&
            this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[1] === 0 &&
            this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[2] === 0) {
            PrimaRiga = 100;
            SecondaRiga = 0;
            TerzaRiga = 0;
          } else {
            PrimaRiga = 50;
            SecondaRiga = 0;
            TerzaRiga = 50;
          }
      } else {
        if (this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[0] === 0 &&
          this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[1] === 0 &&
          this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[2] === 0) {
          PrimaRiga = 50;
          SecondaRiga = 50;
          TerzaRiga = 0;
        }
      }
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, PrimaRiga, SecondaRiga, TerzaRiga);

      // alert('HOR 6');
      this.impostazioni.maskSizeHor[this.pageSelector] = [0, PrimaRiga, SecondaRiga, TerzaRiga]; // this.vecchieImpostazioniHor[this.pageSelector];

      // alert('DIMENS 3');
      this.impostazioni.dimensioni[this.pageSelector].Orizzontale[0] = this.impostazioni.maskSizeHor[this.pageSelector][1];
      // this.impostazioni.nascoste123 = false;

      this.refreshMap[1] = !this.refreshMap[1];
      this.refreshMap[2] = !this.refreshMap[2];
      this.refreshMap[3] = !this.refreshMap[3];

      for (let i = 1; i <= environment.quantiFrames; i++) {
        const fa = this.impostazioni.frameAttivo[i];
        const fr = this.impostazioni.MappaOGrafico[fa][i];

        switch(fr) {
          case 'M':
            this.refreshMap[i] = !this.refreshMap[i];
            this.refreshDaTasto[i] = !this.refreshDaTasto[i];
            break;
          case ('AH'):
          case ('MC'):
          case ('PC'):
          case ('PS'):
            this.refreshMap[i] = !this.refreshMap[i];
            break;
        }
      }

      this.checkDifferenceFromStartJSON();
    }, 1000);
  }

  chiude123() {
    // MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    return;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Vedo se devo chiudere 123');
    /* let ok = true;
    this.massimizzata.forEach(element => {
      if (element === true) {
        // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da chiude123 per frame massimizzato');
        if (!this.impostazioni.framesPinnati) {
          ok = false;
        }
      }
    });
    if (!ok)  {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Vedo se devo chiudere 123. Esco 1');
      return
    }; */

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiudo 123', this.impostazioni.framesPinnati);
    // if (this.impostazioni.framesPinnati === true) {

    let PrimaRiga = 0;
    let SecondaRiga = 50;
    let TerzaRiga = 50;
    if (this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[0] === 0 &&
      this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[1] === 0 &&
      this.impostazioni.dimensioni[this.pageSelector].SecondaRiga[2] === 0) {
        if (this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[0] === 0 &&
          this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[1] === 0 &&
          this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[2] === 0) {
          PrimaRiga = 0;
          SecondaRiga = 0;
          TerzaRiga = 0;
        } else {
          PrimaRiga = 0;
          SecondaRiga = 0;
          TerzaRiga = 100;
        }
    } else {
      if (this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[0] === 0 &&
        this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[1] === 0 &&
        this.impostazioni.dimensioni[this.pageSelector].TerzaRiga[2] === 0) {
        PrimaRiga = 0;
        SecondaRiga = 100;
        TerzaRiga = 0;
      }
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, PrimaRiga, SecondaRiga, TerzaRiga);

    // alert('HOR 7');
    this.impostazioni.maskSizeHor[this.pageSelector] = [ 0, 0, SecondaRiga, TerzaRiga ];
    this.impostazioni.dimensioni[this.pageSelector].Orizzontale[0] = this.impostazioni.maskSizeHor[this.pageSelector][1];

      /* if (!this.impostazioni.maskSizeHor) {
        this.impostazioni.maskSizeHor = [ 0, 33, 33, 33];
      }
      this.vecchieImpostazioniHor = this.impostazioni.maskSizeHor;
      if (this.impostazioni.maskSizeHor[2] > 0 && this.impostazioni.maskSizeHor[3] > 0) {
        this.impostazioni.maskSizeHor = [ 0, 0, 50, 50 ];
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiudo 123 veramente 1', this.impostazioni.maskSizeHor);
      } else {
        if (this.impostazioni.maskSizeHor[2] > 0 && this.impostazioni.maskSizeHor[3] === 0) {
          this.impostazioni.maskSizeHor = [ 0, 0, 100, 0 ];
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiudo 123 veramente 2', this.impostazioni.maskSizeHor);
        } else {
          if (this.impostazioni.maskSizeHor[3] > 0 && this.impostazioni.maskSizeHor[2] === 0) {
            this.impostazioni.maskSizeHor = [ 0, 0, 0, 100 ];
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiudo 123 veramente 3', this.impostazioni.maskSizeHor);
          } else {
            if (this.impostazioni.maskSizeHor[2] === 0 && this.impostazioni.maskSizeHor[3] === 0) {
              this.impostazioni.maskSizeHor = [ 0, 0, 0, 0 ];
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiudo 123 veramente 4', this.impostazioni.maskSizeHor);
            }
          }
        }
      }
      this.impostazioni.nascoste123 = true; */

      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.MappaOGrafico, this.impostazioni.frameAttivo);
      for (let i = 1; i <= environment.quantiFrames; i++) {
        /* const fa = this.impostazioni.frameAttivo[i];
        if (this.impostazioni.MappaOGrafico && this.impostazioni.MappaOGrafico[fa] && this.impostazioni.MappaOGrafico[fa][i] === 'M') {
          this.refreshMaschera[i] = !this.refreshMaschera[i];
          this.refreshDaTasto[i] = !this.refreshDaTasto[i];
        } */

        const fa = this.impostazioni.frameAttivo[i];
        const fr = this.impostazioni.MappaOGrafico[fa][i];

        switch(fr) {
          case 'M':
            this.refreshMap[i] = !this.refreshMap[i];
            this.refreshDaTasto[i] = !this.refreshDaTasto[i];
            break;
          case ('AH'):
          case ('MC'):
          case ('PC'):
          case ('PS'):
            this.refreshMap[i] = !this.refreshMap[i];
            break;
        }
      }

      this.checkDifferenceFromStartJSON();
    // }
  }

  attivaPin() {
    /* 
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    this.impostazioni.framesPinnati = true;
    if (this.pageSelector > -1) {
      if (!this.impostazioni.occhioCheckato) {
        this.impostazioni.occhioCheckato = ExternalUtilities.creaVettore(environment.quantiSottoFrames,
          false);
        this.impostazioniIniziali.occhioCheckato = ExternalUtilities.creaVettore(environment.quantiSottoFrames,
          false);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Aggiustato array occhioCheckato A', this.impostazioni.occhioCheckato);
      }
      this.impostazioni.occhioCheckato[this.pageSelector] = true;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Premuto attiva', this.pageSelector, this.impostazioni.occhioCheckato, this.impostazioni.occhioCheckato[this.pageSelector]);
    }
    this.chiude123();
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    */
  }

  disattivaPin() {
    /* 
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    this.impostazioni.framesPinnati = false;
    if (this.pageSelector > -1) {
      if (!this.impostazioni.occhioCheckato) {
        this.impostazioni.occhioCheckato = ExternalUtilities.creaVettore(environment.quantiSottoFrames,
          false);
        this.impostazioniIniziali.occhioCheckato = ExternalUtilities.creaVettore(environment.quantiSottoFrames,
          false);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Aggiustato array occhioCheckato D', this.impostazioni.occhioCheckato);
      }
      this.impostazioni.occhioCheckato[this.pageSelector] = false;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto: Premuto disattiva', this.pageSelector, this.impostazioni.occhioCheckato, this.impostazioni.occhioCheckato[this.pageSelector]);
    }
    this.apre123();
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    */
  }

  apreMenuSuDataSet() {
    // if (!this.impostazioni.actualDimeDrawer2 || this.impostazioni.actualDimeDrawer2 === 1) {
    //  this.impostazioni.actualDimeDrawer2 = this.maxDimeDrawer;
    // }
    // this.dimeDrawer2 = this.maxDimeDrawer + 'px';
    // this.menuVisibile2 = true;
    // this.contextAperto = true;
    this.apreMenu2();
    this.changeStateAccordion(2);
  }

  apreMenuSuDashboard() {
    // if (!this.impostazioni.actualDimeDrawer2 || this.impostazioni.actualDimeDrawer2 === 1) {
    //   this.impostazioni.actualDimeDrawer2 = this.maxDimeDrawer;
    // }
    // this.dimeDrawer2 = this.maxDimeDrawer + 'px'; // this.impostazioni.actualDimeDrawer2;
    // this.menuVisibile2 = true;
    // this.contextAperto = true;
    this.apreMenu2();
    this.changeStateAccordion(1);
  }

  cambioCellaSelezionata(e) {
    this.cellaSelezionata = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cella selezionata', e);
  }

  sistemaImpostazioni() {
    this.aggiustaArray.controllaDimensioneGiusta(this, Utils);
    return;

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sistema impostazioni', this.impostazioni);
    const imp = {
      activity: undefined,
      addGlobalLayer: undefined,
      addLayers: undefined,
      bandwidth: undefined,
      barraAperta: undefined,
      bboxOZ: undefined,

      cellType: undefined,
      checkSeverity: undefined,
      clusterMeasure: undefined,
      clusterMeasure2: undefined,
      // lov: undefined,
      columnsBars: undefined,
      // columnsSettings: undefined,
      countHistogram: undefined,
      currZoom: undefined,
      eventiSceltiES: undefined,
      eventiSceltiGlobaliES: undefined,
      eventsMeasure: undefined,
      filtriEventi: undefined,
      /* filtroEventiEscluso: undefined,
      filtroEventiCol1: undefined,
      filtroEventiCol2: undefined,
      filtroEventiCol3: undefined,
      filtroEventiCol4: undefined,
      filtroEventiCol5: undefined,
      filtroEventiCol6: undefined,
      filtroEventiCol7: undefined,
      filtroEventiCol8: undefined,
      filtroEventiCol9: undefined,
      filtroEventiCol10: undefined,
      filtroEventiCol11: undefined,
      filtroEventiCol12: undefined,
      filtroEventiCol13: undefined,
      filtroEventiCol14: undefined,
      filtroEventiCol15: undefined,
      filtroEventiCol16: undefined,
      filtroEventiCol17: undefined,
      filtroEventiCol18: undefined,
      filtroEventiCol19: undefined,
      filtroEventiCol20: undefined, */
      fixedSeconds: undefined,
      frameDesc: undefined,
      frameName: undefined,
      // titoloFrame: undefined,
      geoFilter: undefined,
      histDisplayAs: undefined,
      histDisplayTutto: undefined,
      isCheckedAntenne: undefined,
      isCheckedServingCell: undefined,
      isCheckedShowPaths: undefined,
      isCheckedShowSelectedPaths: undefined,
      listaEventi: undefined,
      mapType: undefined,
      mappeMS: undefined,
      measure: undefined,
      measureRCM: undefined,
      measureSMS: undefined,
      measureType: undefined,
      modificaChart: undefined,
      doNotSetGM: undefined,
      mosaicStyle: undefined,
      netTech: undefined,
      opacity: undefined,
      overlay: undefined,
      overlayCluster: undefined,
      overviewZoom: undefined,
      plmn: undefined,
      sartPosition: undefined,
      showMeasures: undefined,
      showMeasuresS: undefined,
      showPlanimetry: undefined,
      showRays: undefined,
      shownEvents: undefined,
      slaName: undefined,
      // slaValue: undefined,
      squareMeters: undefined,
      styleSize: undefined,
      tabSelezionato: undefined,
      textFilter: undefined,
      textFilter2: undefined,
      // textLov: undefined,
      timeFilter: undefined,
      tipoDataset: undefined,
      tipoEvento: undefined,
      tipoMappa: undefined,
      viewAs: undefined,
      viewDefinition: undefined,
      showRaysAllLayer: undefined,
      correlation: undefined,
      dimensioni: undefined,
      // isNonSyncEventTime: undefined,
      occhioCheckato: undefined,
      // Togliere viewOlG
      // Togliere viewOlL
      doubleGraph: undefined,
      listaCampiTCRP: undefined,
      dimensioniSplitTcRun: undefined,
      impostazioniPivotGrid: undefined,
      tipoDatiLayout: undefined,
      showAdditionalLayers: undefined,
      viewModeMS: undefined,
      flowTypeMS: undefined,
      isStandAloneMR: undefined
    }
    imp.activity = new Array();
    imp.addGlobalLayer = new Array();
    imp.addLayers = new Array();
    imp.bandwidth = new Array();
    imp.barraAperta = new Array();
    imp.bboxOZ = new Array();
    imp.cellType = new Array();
    imp.checkSeverity = new Array();
    imp.clusterMeasure = new Array();
    imp.clusterMeasure2 = new Array();
    // imp.lov = new Array();
    imp.columnsBars = new Array();
    imp.doubleGraph = new Array();
    imp.listaCampiTCRP = new Array();
    imp.dimensioniSplitTcRun = new Array();
    imp.impostazioniPivotGrid = new Array();
    imp.tipoDatiLayout = new Array();
    imp.showAdditionalLayers = new Array();
    imp.viewModeMS = new Array();
    imp.flowTypeMS = new Array();
    // imp.columnsSettings = new Array();
    imp.countHistogram = new Array();
    imp.currZoom = new Array();
    imp.eventiSceltiES = new Array();
    imp.eventiSceltiGlobaliES = new Array();
    imp.eventsMeasure = new Array();
    imp.filtriEventi = new Array();
    imp.fixedSeconds = new Array();
    imp.frameDesc = new Array();
    imp.frameName = new Array();
    // imp.titoloFrame = new Array();
    imp.geoFilter = new Array();
    imp.histDisplayAs = new Array();
    imp.histDisplayTutto = new Array();
    imp.isCheckedAntenne = new Array();
    imp.isStandAloneMR = new Array();
    imp.isCheckedServingCell = new Array();
    imp.isCheckedShowPaths = new Array();
    imp.isCheckedShowSelectedPaths = new Array();
    imp.listaEventi = new Array();
    imp.mapType = new Array();
    imp.mappeMS = new Array();
    imp.measure = new Array();
    imp.measureRCM = new Array();
    imp.measureSMS = new Array();
    imp.measureType = new Array();
    imp.modificaChart = new Array();
    imp.doNotSetGM = new Array();
    imp.mosaicStyle = new Array();
    imp.netTech = new Array();
    imp.opacity = new Array();
    imp.overlay = new Array();
    imp.overlayCluster = new Array();
    imp.overviewZoom = new Array();
    imp.plmn = new Array();
    imp.sartPosition = new Array();
    imp.showMeasures = new Array();
    imp.showMeasuresS = new Array();
    imp.showPlanimetry = new Array();
    imp.showRays = new Array();
    imp.shownEvents = new Array();
    imp.slaName = new Array();
    // imp.slaValue = new Array();
    imp.squareMeters = new Array();
    imp.styleSize = new Array();
    imp.tabSelezionato = new Array();
    imp.textFilter = new Array();
    imp.textFilter2 = new Array();
    // imp.textLov = new Array();
    imp.timeFilter = new Array();
    imp.tipoDataset = new Array();
    imp.tipoEvento = new Array();
    imp.tipoMappa = new Array();
    imp.viewAs = new Array();
    imp.viewDefinition = new Array();
    imp.showRaysAllLayer = new Array();
    imp.correlation = new Array();
    // imp.dimensioni = new Array();
    // imp.isNonSyncEventTime = new Array();
    // imp.occhioCheckato = new Array();

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTI SCELTI ES', this.impostazioni.eventiSceltiES);

    for (let j = 0; j <= environment.quantiSottoFrames; j ++) {
      imp.activity.push(new Array());
      imp.addGlobalLayer.push(new Array());
      imp.addLayers.push(new Array());
      imp.bandwidth.push(new Array());
      imp.barraAperta.push(new Array());
      imp.bboxOZ.push(new Array());
      imp.cellType.push(new Array());
      imp.checkSeverity.push(new Array());
      imp.clusterMeasure.push(new Array());
      imp.clusterMeasure2.push(new Array());
      // imp.lov.push(new Array());
      imp.columnsBars.push(new Array());
      imp.doubleGraph.push(new Array());
      imp.listaCampiTCRP.push(new Array());
      imp.dimensioniSplitTcRun.push(new Array());
      imp.impostazioniPivotGrid.push(new Array());
      imp.tipoDatiLayout.push(new Array());
      imp.showAdditionalLayers.push(new Array());
      imp.viewModeMS.push(new Array());
      imp.flowTypeMS.push(new Array());
      // imp.columnsSettings.push(new Array());
      imp.countHistogram.push(new Array());
      imp.currZoom.push(new Array());
      imp.eventiSceltiES.push(new Array());
      imp.eventiSceltiGlobaliES.push(new Array());
      imp.eventsMeasure.push(new Array());
      imp.filtriEventi.push(new Array());
      imp.fixedSeconds.push(new Array());
      imp.frameDesc.push(new Array());
      imp.frameName.push(new Array());
      // imp.titoloFrame.push(new Array());
      imp.geoFilter.push(new Array());
      imp.histDisplayAs.push(new Array());
      imp.histDisplayTutto.push(new Array());
      imp.isStandAloneMR.push(new Array());
      imp.isCheckedAntenne.push(new Array());
      imp.isCheckedServingCell.push(new Array());
      imp.isCheckedShowPaths.push(new Array());
      imp.isCheckedShowSelectedPaths.push(new Array());
      imp.listaEventi.push(new Array());
      imp.mapType.push(new Array());
      imp.mappeMS.push(new Array());
      imp.measure.push(new Array());
      imp.measureRCM.push(new Array());
      imp.measureSMS.push(new Array());
      imp.measureType.push(new Array());
      imp.modificaChart.push(new Array());
      imp.doNotSetGM.push(new Array());
      imp.mosaicStyle.push(new Array());
      imp.netTech.push(new Array());
      imp.opacity.push(new Array());
      imp.overlay.push(new Array());
      imp.overlayCluster.push(new Array());
      imp.overviewZoom.push(new Array());
      imp.plmn.push(new Array());
      imp.sartPosition.push(new Array());
      imp.showMeasures.push(new Array());
      imp.showMeasuresS.push(new Array());
      imp.showPlanimetry.push(new Array());
      imp.showRays.push(new Array());
      imp.shownEvents.push(new Array());
      imp.slaName.push(new Array());
      // imp.slaValue.push(new Array());
      imp.squareMeters.push(new Array());
      imp.styleSize.push(new Array());
      imp.tabSelezionato.push(new Array());
      imp.textFilter.push(new Array());
      imp.textFilter2.push(new Array());
      // imp.textLov.push(new Array());
      imp.timeFilter.push(new Array());
      imp.tipoDataset.push(new Array());
      imp.tipoEvento.push(new Array());
      imp.tipoMappa.push(new Array());
      imp.viewAs.push(new Array());
      imp.viewDefinition.push(new Array());
      imp.showRaysAllLayer.push(new Array());
      imp.correlation.push(new Array());
      // imp.dimensioni.push(new Array());
      // imp.isNonSyncEventTime.push(new Array());
      // imp.occhioCheckato.push(new Array());

      for (let i = 0; i <= environment.quantiFrames; i ++) {
        if (this.impostazioni.activity[j]) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sistema impostazioni', j, i);
          imp.activity[j].push(this.impostazioni.activity[j][i]);
          imp.addGlobalLayer[j].push(this.impostazioni.addGlobalLayer[j][i]);
          imp.addLayers[j].push(this.impostazioni.addLayers[j][i]);
          imp.bandwidth[j].push(this.impostazioni.bandwidth[j][i]);
          imp.barraAperta[j].push(this.impostazioni.barraAperta[j][i]);
          imp.bboxOZ[j].push(this.impostazioni.bboxOZ[j][i]);
          imp.cellType[j].push(this.impostazioni.cellType[j][i]);
          imp.checkSeverity[j].push(this.impostazioni.checkSeverity[j][i]);
          imp.clusterMeasure[j].push(this.impostazioni.clusterMeasure[j][i]);
          imp.clusterMeasure2[j].push(this.impostazioni.clusterMeasure2[j][i]);
          // imp.lov[j].push(this.impostazioni.lov[j][i]);
          imp.columnsBars[j].push(this.impostazioni.columnsBars[j][i]);
          imp.doubleGraph[j].push(this.impostazioni.doubleGraph[j][i]);
          imp.listaCampiTCRP[j].push(this.impostazioni.listaCampiTCRP[j][i]);
          imp.dimensioniSplitTcRun[j].push(this.impostazioni.dimensioniSplitTcRun[j][i]);
          imp.impostazioniPivotGrid[j].push(this.impostazioni.impostazioniPivotGrid[j][i]);
          imp.tipoDatiLayout[j].push(this.impostazioni.tipoDatiLayout[j][i]);
          imp.flowTypeMS[j].push(this.impostazioni.flowTypeMS[j][i]);
          imp.viewModeMS[j].push(this.impostazioni.viewModeMS[j][i]);
          imp.showAdditionalLayers[j].push(this.impostazioni.showAdditionalLayers[j][i]);
          // imp.columnsSettings[j].push(this.impostazioni.columnsSettings[j][i]);
          imp.countHistogram[j].push(this.impostazioni.countHistogram[j][i]);
          imp.currZoom[j].push(this.impostazioni.currZoom[j][i]);
          // imp.eventiSceltiES[j].push(this.impostazioni.eventiSceltiES[j][i]);
          imp.eventsMeasure[j].push(this.impostazioni.eventsMeasure[j][i]);
          imp.filtriEventi[j].push(this.impostazioni.filtriEventi[j][i]);
          imp.fixedSeconds[j].push(this.impostazioni.fixedSeconds[j][i]);
          imp.frameDesc[j].push(this.impostazioni.frameDesc[j][i]);
          // imp.frameName[i].push(this.impostazioni.frameName[j][i]);
          // imp.titoloFrame[j].push(this.impostazioni.titoloFrame[j][i]);
          imp.geoFilter[j].push(this.impostazioni.geoFilter[j][i]);
          imp.histDisplayAs[j].push(this.impostazioni.histDisplayAs[j][i]);
          imp.histDisplayTutto[j].push(this.impostazioni.histDisplayTutto[j][i]);
          imp.isStandAloneMR[j].push(this.impostazioni.isStandAloneMR[j][i]);
          imp.isCheckedAntenne[j].push(this.impostazioni.isCheckedAntenne[j][i]);
          imp.isCheckedServingCell[j].push(this.impostazioni.isCheckedServingCell[j][i]);
          imp.isCheckedShowPaths[j].push(this.impostazioni.isCheckedShowPaths[j][i]);
          imp.isCheckedShowSelectedPaths[j].push(this.impostazioni.isCheckedShowSelectedPaths[j][i]);
          imp.listaEventi[j].push(this.impostazioni.listaEventi[j][i]);
          imp.mapType[j].push(this.impostazioni.mapType[j][i]);
          imp.mappeMS[j].push(this.impostazioni.mappeMS[j][i]);
          imp.measure[j].push(this.impostazioni.measure[j][i]);
          imp.measureRCM[j].push(this.impostazioni.measureRCM[j][i]);
          imp.measureSMS[j].push(this.impostazioni.measureSMS[j][i]);
          imp.measureType[j].push(this.impostazioni.measureType[j][i]);
          imp.modificaChart[j].push(this.impostazioni.modificaChart[j][i]);
          imp.doNotSetGM[j].push(this.impostazioni.doNotSetGM[j][i]);
          imp.mosaicStyle[j].push(this.impostazioni.mosaicStyle[j][i]);
          imp.netTech[j].push(this.impostazioni.netTech[j][i]);
          imp.opacity[j].push(this.impostazioni.opacity[j][i]);
          imp.overlay[j].push(this.impostazioni.overlay[j][i]);
          imp.overlayCluster[j].push(this.impostazioni.overlayCluster[j][i]);
          imp.overviewZoom[j].push(this.impostazioni.overviewZoom[j][i]);
          imp.plmn[j].push(this.impostazioni.plmn[j][i]);
          imp.sartPosition[j].push(this.impostazioni.sartPosition[j][i]);
          imp.showMeasures[j].push(this.impostazioni.showMeasures[j][i]);
          imp.showMeasuresS[j].push(this.impostazioni.showMeasuresS[j][i]);
          imp.showPlanimetry[j].push(this.impostazioni.showPlanimetry[j][i]);
          imp.showRays[j].push(this.impostazioni.showRays[j][i]);
          imp.shownEvents[j].push(this.impostazioni.shownEvents[j][i]);
          imp.slaName[j].push(this.impostazioni.slaName[j][i]);
          // imp.slaValue[j].push(this.impostazioni.slaValue[j][i]);
          imp.squareMeters[j].push(this.impostazioni.squareMeters[j][i]);
          imp.styleSize[j].push(this.impostazioni.styleSize[j][i]);
          imp.tabSelezionato[j].push(this.impostazioni.tabSelezionato[j][i]);
          imp.textFilter[j].push(this.impostazioni.textFilter[j][i]);
          imp.textFilter2[j].push(this.impostazioni.textFilter2[j][i]);
          // imp.textLov[j].push(this.impostazioni.textLov[j][i]);
          imp.timeFilter[j].push(this.impostazioni.timeFilter[j][i]);
          imp.tipoDataset[j].push(this.impostazioni.tipoDataset[j][i]);
          imp.tipoEvento[j].push(this.impostazioni.tipoEvento[j][i]);
          imp.tipoMappa[j].push(this.impostazioni.tipoMappa[j][i]);
          imp.viewAs[j].push(this.impostazioni.viewAs[j][i]);
          imp.viewDefinition[j].push(this.impostazioni.viewDefinition[j][i]);
          imp.showRaysAllLayer[j].push(this.impostazioni.showRaysAllLayer[j][i]);
          imp.correlation[j].push(this.impostazioni.correlation[j][i]);
          // imp.dimensioni[j].push(this.impostazioni.dimensioni[j][i]);
          // imp.isNonSyncEventTime[j].push(this.impostazioni.isNonSyncEventTime[j][i]);
          // imp.occhioCheckato[j].push(this.impostazioni.occhioCheckato[j][i]);
        }
      }
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sistema impostazioni', imp);
    this.impostazioni.activity = imp.activity;
    this.impostazioni.addGlobalLayer = imp.addGlobalLayer;
    this.impostazioni.addLayers = imp.addLayers;
    this.impostazioni.bandwidth = imp.bandwidth;
    this.impostazioni.barraAperta = imp.barraAperta;
    this.impostazioni.bboxOZ = imp.bboxOZ;
    this.impostazioni.cellType = imp.cellType;
    this.impostazioni.checkSeverity = imp.checkSeverity;
    this.impostazioni.clusterMeasure = imp.clusterMeasure;
    this.impostazioni.clusterMeasure2 = imp.clusterMeasure2;
    // this.impostazioni.lov = imp.lov;
    this.impostazioni.columnsBars = imp.columnsBars;
    this.impostazioni.doubleGraph = imp.doubleGraph;
    this.impostazioni.listaCampiTCRP = imp.listaCampiTCRP;
    this.impostazioni.dimensioniSplitTcRun = imp.dimensioniSplitTcRun;
    this.impostazioni.impostazioniPivotGrid = imp.impostazioniPivotGrid;
    this.impostazioni.tipoDatiLayout = imp.tipoDatiLayout;
    this.impostazioni.flowTypeMS = imp.flowTypeMS;
    this.impostazioni.viewModeMS = imp.viewModeMS;
    this.impostazioni.showAdditionalLayers = imp.showAdditionalLayers;
    // this.impostazioni.columnsSettings = imp.columnsSettings;
    this.impostazioni.countHistogram = imp.countHistogram;
    this.impostazioni.currZoom = imp.currZoom;
    // this.impostazioni.eventiSceltiES = imp.eventiSceltiES;
    this.impostazioni.eventsMeasure = imp.eventsMeasure;
    this.impostazioni.filtriEventi = imp.filtriEventi;
    this.impostazioni.fixedSeconds = imp.fixedSeconds;
    this.impostazioni.frameDesc = imp.frameDesc;
    // this.impostazioni.frameName = imp.frameName;
    // this.impostazioni.titoloFrame = imp.titoloFrame;
    this.impostazioni.geoFilter = imp.geoFilter;
    this.impostazioni.histDisplayAs = imp.histDisplayAs;
    this.impostazioni.histDisplayTutto = imp.histDisplayTutto;
    this.impostazioni.isStandAloneMR = imp.isStandAloneMR;
    this.impostazioni.isCheckedAntenne = imp.isCheckedAntenne;
    this.impostazioni.isCheckedServingCell = imp.isCheckedServingCell;
    this.impostazioni.isCheckedShowPaths = imp.isCheckedShowPaths;
    this.impostazioni.isCheckedShowSelectedPaths = imp.isCheckedShowSelectedPaths;
    this.impostazioni.listaEventi = imp.listaEventi;
    this.impostazioni.mapType = imp.mapType;
    this.impostazioni.mappeMS = imp.mappeMS;
    this.impostazioni.measure = imp.measure;
    this.impostazioni.measureRCM = imp.measureRCM;
    this.impostazioni.measureSMS = imp.measureSMS;
    this.impostazioni.measureType = imp.measureType;
    this.impostazioni.modificaChart = imp.modificaChart;
    this.impostazioni.doNotSetGM = imp.doNotSetGM;
    this.impostazioni.mosaicStyle = imp.mosaicStyle;
    this.impostazioni.netTech = imp.netTech;
    this.impostazioni.opacity = imp.opacity;
    this.impostazioni.overlay = imp.overlay;
    this.impostazioni.overlayCluster = imp.overlayCluster;
    this.impostazioni.overviewZoom = imp.overviewZoom;
    this.impostazioni.plmn = imp.plmn;
    this.impostazioni.sartPosition = imp.sartPosition;
    this.impostazioni.showMeasures = imp.showMeasures;
    this.impostazioni.showMeasuresS = imp.showMeasuresS;
    this.impostazioni.showPlanimetry = imp.showPlanimetry;
    this.impostazioni.showRays = imp.showRays;
    this.impostazioni.shownEvents = imp.shownEvents;
    this.impostazioni.slaName = imp.slaName;
    this.impostazioni.slaValue = undefined;
    this.impostazioni.squareMeters = imp.squareMeters;
    this.impostazioni.styleSize = imp.styleSize;
    this.impostazioni.tabSelezionato = imp.tabSelezionato;
    this.impostazioni.textFilter = imp.textFilter;
    this.impostazioni.textFilter2 = imp.textFilter2;
    // this.impostazioni.textLov = imp.textLov;
    this.impostazioni.timeFilter = imp.timeFilter;
    this.impostazioni.tipoDataset = imp.tipoDataset;
    this.impostazioni.tipoEvento = imp.tipoEvento;
    this.impostazioni.tipoMappa = imp.tipoMappa;
    this.impostazioni.viewAs = imp.viewAs;
    this.impostazioni.viewDefinition = imp.viewDefinition;
    this.impostazioni.showRaysAllLayer = imp.showRaysAllLayer;
    // this.impostazioni.viewOlG = undefined;
    // this.impostazioni.viewOlL = undefined;
    this.impostazioni.correlation = imp.correlation;
    // this.impostazioni.dimensioni = imp.dimensioni;
    // this.impostazioni.isNonSyncEventTime = imp.isNonSyncEventTime;
    // this.impostazioni.occhioCheckato = imp.occhioCheckato;

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni sistemate', this.impostazioni);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni ricaricate dalla copia', this.impostazioni);
  }

  esegueRicercaAntenne() {
    let nt = '';
    let bw = '';
    const vm = 'null';
    let cl = 'null';
    let ch = '';
    let bs = '';
    let sc = '';
    let pc = '';
    let te = '';
    let ft = '';

    if (this.netTech2 && this.netTech2 !== '') {
      nt = '\'' + this.netTech2 + '\'';
    } else {
      nt = null;
    }
    if (this.bandwidth2 && this.bandwidth2 !== '') {
      bw = '\'' + this.bandwidth2 + '\'';
    } else {
      bw = null;
    }
    if (this.ch2 && this.ch2 !== '') {
      ch = '' + this.ch2 + '';
    } else {
      ch = null;
    }
    if (this.bsic2 && this.bsic2 !== '') {
      bs = '' + this.bsic2 + '';
    } else {
      bs = null;
    }
    if (this.scr2 && this.scr2 !== '') {
      sc = '' + this.scr2 + '';
    } else {
      sc = null;
    }
    if (this.pci2 && this.pci2 !== '') {
      pc = '' + this.pci2 + '';
    } else {
      pc = null;
    }
    if (this.territory2 && this.territory2 !== '') {
      te = '\'' + this.territory2 + '\'';
    } else {
      te = null;
    }
    if (this.freeText2 && this.freeText2 !== '') {
      ft = '\'' + this.freeText2 + '\'';
    } else {
      ft = null;
    }
    const st = '';
    const sp = '';

    this.parametriDD = nt + '§' + bw +
      '§\'' + st +
      '\'§\'' + sp + '\'§' + vm + '§' +
      te + '§' + pc + '§' + sc + '§' +
      bs + '§'  + ch + '§' + cl + '§' +
      ft;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Parametri DD', this.parametriDD);
  }

  pressioneEnter(e) {
    if (e === 'AUTO' || e.key === 'Enter') {
      this.esegueRicercaAntenne();
    }
  }

  LeggeDatiNetTech() {
    // // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "combo_NetTech"' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiNetTech = 'empty grid'; // null;
          // alert(data2.v_failure_reason);
          this.mostraPopup('Error: ' + data2.v_failure_reason, false, '');
        } else {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup NetTech:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.datiNetTech = data.DataTable;
        }
     } else {
        this.datiNetTech = 'empty grid'; // null;
      }
    }, error => {
      // alert('Read look up:' + error);
      this.mostraPopup('Read look up: ' + error, false, '');
    });
  }

  LeggeDatiBandWidth() {
    // // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "Filter_Band"' +
    '}';
    this.apiService.chiamataPost(this.Utilities, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiBandWidth = 'empty grid'; // null;
          // alert(data2.v_failure_reason);
          this.mostraPopup('Error: ' + data2.v_failure_reason , false, '');
        } else {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup Bandwidth:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.datiBandWidth = data.DataTable;
        }
     } else {
        this.datiBandWidth = 'empty grid'; // null;
      }
    }, error => {
      // alert('Read look up:' + error);
      this.mostraPopup('Read look up: ' + error, false, '');
    });
  }

  selectBandwidth(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Combo cluster selezionato', e);
    this.bandwidth2 = e.VALUE_STR;
    this.bandwidth22 = e.CODE;
    this.pressioneEnter('AUTO');
  }

  /* ritornoValoreDaComboBW(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo AL:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        if (e === undefined) {
          this.bandwidth22 = 0;
          this.bandwidth2 = '<ALL>';
        } else {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');

          let q = 0;
          const tdb = setInterval(() => {
            if (this.datiBandWidth && this.datiBandWidth.DataTable) {
              clearInterval(tdb);
              this.datiBandWidth.DataTable.forEach(element => {
                if (element.CODE === e) {
                  // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato:', element);
                  this.bandwidth22 = element.CODE;
                  this.bandwidth2 = element.VALUE_STR;
                  this.pressioneEnter('AUTO');
                }
              });
            } else {
              q++;
              if (q > 10) {
                clearInterval(tdb);
                this.bandwidth22 = 0;
                this.bandwidth2 = '<ALL>';
              }
            }
          }, 1000);
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo AL:', this.additionalLayer);
        }
      }, 2000);
    // }
    }
  } */

  selectNetTech(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Combo net tech selezionato', e);
    this.netTech2 = e.VALUE_STR;
    this.netTech22 = e.CODE;
    this.pressioneEnter('AUTO');
  }

  /* ritornoValoreDaComboNT(e) {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo NT:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        if (e === undefined) {
          this.netTech22 = 0;
          this.netTech2 = '<ALL>';
        } else {
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');

          let q = 0;
          this.netTech2 = '<ALL>';
          const tdtn = setInterval(() => {
            if (this.datiNetTech && this.datiNetTech.DataTable) {
              clearInterval(tdtn);
              this.datiNetTech.DataTable.forEach(element => {
                if (element.CODE === e) {
                  // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato:', element);
                  this.netTech22 = element.CODE;
                  this.netTech2 = element.VALUE_STR;
                  this.pressioneEnter('AUTO');
                }
              });
            } else {
              q++;
              if (q > 10) {
                clearInterval(tdtn);
                this.netTech22 = 0;
                this.netTech2 = '<ALL>';
              }
            }
          }, 1000);
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore combo AL:', this.additionalLayer);
        }
      }, 2000);
    // }
    }
  } */

  cambioCoordinateSRALE(e) {
    this.coordinateSRLE = e;
  }

  cambioGeoFilterClick(e) {
    this.geoFilterClick = e;
  }

  comandoVocaleEmit(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Comando vocale arrivato: ', e);
    this.comandoVocale = e;
    this.comandiVocali.esegueComandoVocale(this, e);
  }

  cambioLastSelectedLayer(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio add layer', e);

    if (this.setNetTech === true) {
      if (e.LAYER_NAME === 'ALL' || e.LAYER_NAME === 'NONE') {
        this.datiNetTech.forEach(element => {
          if (element.VALUE_STR === '<' + e.LAYER_NAME + '>') {
            this.netTech22 = element.CODE;
            this.netTech2 = element.VALUE_STR;
          }
        });
        this.datiBandWidth.forEach(element => {
          if (element.VALUE_STR === '<' + e.LAYER_NAME + '>') {
            this.bandwidth22 = element.CODE;
            this.bandwidth2 = element.VALUE_STR;
          }
        });
      } else {
        this.datiNetTech.forEach(element => {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cerco netTech', element.VALUE_STR, e.CELL_TECH);
          if (element.VALUE_STR === e.CELL_TECH) {
            this.netTech22 = element.CODE;
            this.netTech2 = element.VALUE_STR;
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rilevato netTech', element.CODE);
          }
        });
        this.datiBandWidth.forEach(element => {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cerco bw', element.VALUE_STR, e.BAND);
          if (element.VALUE_STR === e.BAND) {
            this.bandwidth22 = element.CODE;
            this.bandwidth2 = element.VALUE_STR;
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rilevato bw', element.CODE);
          }
        });
      }

      // const tm = setTimeout(() => {
        this.pressioneEnter('AUTO');
      // }, 100);
    }

    this.lastSelectedLayer = e;
  }

  // MODULO APK
  /* prendeConnectionJSON(e) {
    this.infoSistema.connectionJSON = e;
    if (this.device) {
      // if (this.device === 'ANDROID') {
      //   alert('Arrivato connection JSON: ' + JSON.stringify(e));
      // }
      this.lettoJSON(e);
    }
  }

  prendeInfoSistema(e) {
    this.infoSistema = e;
    this.device = e.deviceGirante;
    // if (this.device === 'ANDROID') {
    //   alert('Device: ' + this.device);
    // }
    this.ceGPS = this.infoSistema.ceCordova;
    if (this.infoSistema.connectionJSON) {
      this.lettoJSON(e);
    }
  }

  prendeGPS(e) {
    this.datiGPS.GPS = e
  }

  prendeNetwork(e) {
    this.datiGPS.network = e;
    // alert(JSON.stringify(e));
  }

  prendeSatellite(e) {
    this.datiGPS.satellite = JSON.stringify(e);
  }

  prendeCellInfo(e) {
    this.datiGPS.cellInfo = e;
  }

  prendeCellLocation(e) {
    this.datiGPS.cellLocation = e;
  }

  prendeSignalStrength(e) {
    this.datiGPS.signalStrength = e;
  }

  apreInfoGPS(e) {
    this.infoGPS = e;
  }

  prendeDatiUlteriori(e) {
    this.datiGPS.datiUlteriori = e;
  } */
  // MODULO APK

  // MENU
  apreMenu() {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaClickMenu < 750) {
      return;
    }
    this.ultimaVoltaClickMenu = ora;

    this.menuVisibile = true; // !this.menuVisibile;
    this.dimeDrawer = this.schermoStretto === true ? '100%' : this.dimeDrawerAperto + 'px';
    this.chiudeDrawer2(null);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.menuVisibile);
  }
  chiudeDrawer(e) {
    if (this.menuVisibile === true && this.nonChiudereDrawer === false) {
      this.menuVisibile = false;
      this.dimeDrawer = this.dimeDrawerInizio + 'px';
    }
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.menuVisibile, this.dimeDrawer);
  }
  over1() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'over1');
  // if (this.menuVisibile === false && this.schermoStretto === false) {
    if (this.schermoStretto === true) {
      this.dimeDrawer = '100%';
    } else {
      this.dimeDrawer = this.dimeDrawerAperto + 'px';
    }
    this.menuVisibile = true;
    // }
  }
  leave1() {
    if (this.menuVisibile === true && this.nonChiudereDrawer === false) {
      this.dimeDrawer = '0px';
      this.menuVisibile = false;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'leave 1');
    }
  }

  vecchioAccordionPerExportAperto = false;

  apreMenu2() {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaClickMenu2 < 750) {
      return;
    }
    this.ultimaVoltaClickMenu2 = ora;

    if (this.vecchioAccordionPerExportAperto === true) {
      this.accordionApertoPerExport = true;
    } else {
      this.accordionApertoPerExport = false;
    }

    this.menuVisibile2 = true; // !this.menuVisibile2;
    this.dimeDrawer2 = this.schermoStretto === true ? '100%' : this.dimeDrawerAperto + 'px';
    this.chiudeDrawer(null);
  }
  chiudeDrawer2(e) {
    if (this.menuVisibile2 === true && this.nonChiudereDrawer2 === false) {
      this.menuVisibile2 = false;
      this.dimeDrawer2 = this.dimeDrawerInizio2 + 'px';

      this.accordionApertoPerExport = false;
    }
  }
  over2() {
    // if (this.menuVisibile2 === true && this.schermoStretto === false) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'over2');
      if (this.schermoStretto === true) {
        this.dimeDrawer2 = '100%';
      } else {
        this.dimeDrawer2 = this.dimeDrawerAperto + 'px';
      }

      if (this.vecchioAccordionPerExportAperto === true) {
        this.accordionApertoPerExport = true;
      } else {
        this.accordionApertoPerExport = false;
      }

      this.menuVisibile2 = true;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'over 2');
    // }
  }
  leave2() {
    if (this.menuVisibile2 === true && this.nonChiudereDrawer2 === false) {
      this.dimeDrawer2 = '0px';
      this.menuVisibile2 = false;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'leave 2');

      this.accordionApertoPerExport = false;
    }
  }

  /* LeggeActivities() {
    const t = setInterval(() => {
      if (this.timeRangeDSFStart && this.timeRangeDSFStop && this.activitySet[1]) {
        clearInterval(t);

        this.LeggeActivities2();
      }
    }, 1000);
  } */

  LeggeActivities2() {
    this.impostaSelezioneLA = new Array();

       // const tm = setTimeout(() => {
      let sInizio = '';
      let sFine = '';
      let filtro = '';
      sInizio = this.timeRangeDSFStart;
      sFine = this.timeRangeDSFStop;

      if (!sInizio || sInizio === null || sInizio === '') {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities. Esco per data inizio nulla');

        return;
      }
      if (!sFine || sFine === null || sFine === '') {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities. Esco per data fine nulla');

        return;
      }
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities. Lettura griglia menù', sInizio, sFine);

      let ricerca = '';
      if (this.datiActivitySet && this.datiActivitySet !== 'empty') {
        this.datiActivitySet.forEach(element => {
          if (+element.ID === +this.activitySet[1]) {
            ricerca = element.NAME;
          }
        });
      }

      if (!ricerca || ricerca === null || ricerca === '') {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities. Esco per valore ricerca nulla');
        
        return;
      }

      const params = {
        cntx_id: this.sessioneID,
        v_act_set_name_list: ricerca,
        v_tms_min: sInizio,
        v_tms_max: sFine,
        v_bbox: '(ALL)'
      };
      /* if (this.lastCallAct === JSON.stringify(params)) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities. Esco per vecchio valore uguale');
        return;
      } */
      this.lastCallAct = JSON.stringify(params);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities. Parametri', params);

      if (this.vecchioParamsAct === JSON.stringify(params)) {
        return;
      }
      this.vecchioParamsAct = JSON.stringify(params);

      this.caricamentoActivitiesInCorso = true;
      this.apiService.chiamataPost(this.Utilities, 'geo_act__grid2', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          ExternalUtilities.checkRitornoChiamata(this.Utils, data);

          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities. Valori di ritorno', data);
          this.caricamentoActivitiesInCorso = false;
          const dCD = data;
          if (this.datiActivities !== undefined && this.datiActivities.DataTable && this.datiActivities.DataTable.length > 0
            && this.datiActivities !== 'empty grid' && dCD.DataTable) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities. Aggiorno valori', dCD.DataTable);
              this.datiActivities.DataTable = dCD.DataTable;
          } else {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities. Creo valori', dCD);
            this.datiActivities = dCD;
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.effettuaAutoFitLA = !this.effettuaAutoFitLA;
              // this.impostaPaginaLA = 0;
            }, 1000);
          }

          if (this.datiActivities && this.datiActivities.DataTable && this.datiActivities.DataTable[0]) {
            const primaActivityPresente = this.datiActivities.DataTable[0];

            /* let q = 0;
            this.impostaSelezioneLA = [];
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo su prima act');
            const t = setInterval(() => {
              if (this.caricatoTimer) {
                clearInterval(t);
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivata prima act', primaActivityPresente);

                if (primaActivityPresente && !this.timerAttivatoAuto) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'imposto time start 2', primaActivityPresente.START_TMS);
                  this.timeRangeDSFStart = this.datePipe.transform(primaActivityPresente.START_TMS, 'yyyy-MM-dd HH:mm:ss.SSS');
                  this.timeRangeDSFStop = this.datePipe.transform(primaActivityPresente.END_TMS, 'yyyy-MM-dd HH:mm:ss.SSS');

                  this.impostaSelezioneLA = primaActivityPresente.ROW_ID;
                  this.stringaAGNoACT = '[ACT] ' + primaActivityPresente.NAME;
                  this.stringaAGNoACT = JSON.parse(JSON.stringify(this.stringaAGNoACT));
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Stringa AGN o ACT', this.stringaAGNoACT);
                  this.Utilities.activitySceltaStampa = '[ACT] ' + primaActivityPresente.NAME;

                  this.ultimaActSelezionata = primaActivityPresente.NAME;
                  this.Utilities.nomeActivitySelezionata = primaActivityPresente.NAME;

                  this.clickRigaLA(primaActivityPresente);
                }
              } else {
                q++;
                if (q > 20) {
                  clearInterval(t);
                }
              }
            }, 500); */
          }

          /* if (this.datiActivities !== 'empty grid' && this.datiActivities.DataTable.length > 0) {
            if (this.ultimaActSelezionata === this.datiActivities.DataTable[0].NAME) {
              return;
            }
            this.ultimaActSelezionata = this.datiActivities.DataTable[0].NAME;
            this.Utilities.nomeActivitySelezionata = this.datiActivities.DataTable[0].NAME;
            alert('2');
            this.impostaSelezioneLA = [this.datiActivities.DataTable[0].ROW_ID];
            this.clickRigaLA(this.datiActivities.DataTable[0]);
          } */
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, JSON.parse(data));


        }, error => {
          // ExternalUtilities.messaggioDiErrore(this.datiActivities, error);
          this.datiActivities = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
          this.caricamentoActivitiesInCorso = false;
      });

    // }, 1500);
  }

  refreshActivities(e, r) {
    this.lastCallAct = '';
    this.vecchioParamsAct = '';
    if (r === true) {
      this.datiActivities = undefined;
    }
    this.LeggeActivities2();
  }

  rigaClickataSuActivities;
  ultimaActSelezionata;

  clickRigaLA(ee) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click Riga LA', ee);
    if (ee || (ee && ee[0])) {
      let e = ee;
      if (e[0]) { e = e[0]; }
      this.activitiesPassataDaRoot = e;

      let valoreRicerca = '[ACT] ' + e.NAME;
      if (valoreRicerca.indexOf('***') > -1) {
        valoreRicerca = valoreRicerca.substring(0, valoreRicerca.indexOf('***'));
      }
      this.Utilities.nomeActivitySelezionata = valoreRicerca;
      /* if (this.ultimaActSelezionata === valoreRicerca) {
        return;
      } */
      this.ultimaActSelezionata = valoreRicerca;

      this.righeSelezionatePerActSet = [e];
      this.activitiesPassataDaRoot = [e];

      // this.rigaClickataSuActivities = e;
      // this.coordinate = [23, 23];
      let c = e.CENTER;
      c = c.replace('POINT(', '').replace(')', '');
      c = c.split(' ');
      // this.coordinateConClick = [c[0], c[1], -1];

      let agn = e.AGN;
      this.stringaAGNoACT = agn;
      // this.agnPerTcInfo = agn;
      // this.impostaAGNoACT.emit(this.Activity2 + '§' + JSON.stringify(ExternalUtilities.stringaAGNoACT));
      
      if (e.BBOX) {
        const q = e.BBOX.split(',');
        const qq = [+q[0], +q[1], +q[2], +q[3]];
        /* for (let i = 0; i <= environment.quantiFrames; i++) {
          ExternalUtilities.bboxMaschera[i] = qq;  
        } */
        this.bbox = { frame: q, valori: qq };

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto BBOX su click activities', qq);
      }

      // const tm = setTimeout(() => {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tms Inizio clickRigaLa', e.START_TMS);
        // logConsole('TMS INIZIO 8', e.START_TMS);
        this.Utilities.tmsInizio = e.START_TMS;
        this.Utilities.tmsFine = e.END_TMS;
        this.Utilities.tmsSelezionato = e.START_TMS;

        // this.Utilities.tmsSelezionatoStringa = e.START_TMS;
        // alert(this.Utilities.tmsInizio + '-' + this.Utilities.tmsFine);
        this.calcolaRangeInizio();
      // }, 100);

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Riga activity selezionata', this.righeSelezionatePerActSet, c);
    }
  }

  cambioActivitiesDaFrame(e) {
    if (e) {
      if (!this.timerAttivatoAuto) {
        this.impostaSelezioneLA = e;
      }
      this.datiActivities.DataTable.forEach(element => {
        if (+element.ROW_ID === +e) {
          this.righeSelezionatePerActSet = [element];
        }
      });
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Riga activity selezionata da frame', this.righeSelezionatePerActSet);
    }
  }

  premutoTastoDeleteActSet(e) {
    // Una sola copia, senza duplicare il DataTable originale che viene comunque sostituito
    this.datiGrigliaCheck = JSON.parse(JSON.stringify({ ...this.datiActivities, DataTable: e }));
    this.modalitaCheckPopup = 'delete_activities';
    this.operazioneCheckPopup = 'Delete';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  premutoTastoDeleteActSet1(e) {
    if (e) {;
      this.arrayDelete = new Array();
      e.forEach(ee => {
        this.arrayDelete.push(ee);
      });
      if (this.arrayDelete.length > 0) {
        this.idxDelete = 0;
        this.eliminazioneFisicaActSet();
      }
    }
  }

  eliminazioneFisicaActSet() {
    const messaggio = 'Warning this Activity shall be permanently removed from the platform.\nIt shall not be possible to restore it.';
    Swal.fire({
      title: '',
      text: messaggio,
      icon: 'warning',
      background: '#9f1f1f',
      color: '#fbf7f7',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    }).then((result) => {
      if (result.value) {
        const e = this.arrayDelete[this.idxDelete];

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, jsonString);
  
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno scrittura', this.apiService.UpdateDashboard(jsonString));
        // this.apiService.UpdateDashboard(jsonString)
        const params = '{' +
          '"v_cntx": "' + this.sessioneID + '",' +
          '"v_act_id": ' + e.GEO_ACT_ID + '' +
        '}';
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Funzione chiamata: geo_act__del', params)
        // return;
  
        this.apiService.chiamataPost(this.Utilities, 'geo_act__del', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          ExternalUtilities.checkRitornoChiamata(this.Utils, data);
  
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Create Act Set return:', data);
          if (+data[0].v_err_code === 0) {
            this.idxDelete++;
            if (this.idxDelete < this.arrayDelete.length) {
              const tm = setTimeout(() => {
                clearTimeout(tm);
                this.eliminazioneFisicaActSet()
              }, 10);
            } else {
              this.LeggeActivities2();
  
              // this.LeggeActivities(this.savedActSetId);
  
              this.effettuaAutoFitLA = !this.effettuaAutoFitLA;
              // this.refreshEmit.emit(this.refresh);
            }
          } else {
            // alert(data[0].v_failure_reason);
            this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
          }
        }, error => {
          // alert(error);
          this.mostraPopup(error, false, '');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
    /* if (confirm('Warning this Activity shall be permanently removed from the platform.\nIt shall not be possible to restore it.')) {
      const e = this.arrayDelete[this.idxDelete];

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, jsonString);

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno scrittura', this.apiService.UpdateDashboard(jsonString));
      // this.apiService.UpdateDashboard(jsonString)
      const params = '{' +
        '"v_cntx": "' + this.sessioneID + '",' +
        '"v_act_id": ' + e.GEO_ACT_ID + '' +
      '}';
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Funzione chiamata: geo_act__del', params)
      // return;

      this.apiService.chiamataPost(this.Utilities, 'geo_act__del', params)
      // .map(response => response)
      .subscribe(data => {
        ExternalUtilities.checkRitornoChiamata(this.Utils, data);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Create Act Set return:', data);
        if (+data[0].v_err_code === 0) {
          this.idxDelete++;
          if (this.idxDelete < this.arrayDelete.length) {
            setTimeout(_ => this.eliminazioneFisicaActSet(), 10);
          } else {
            this.LeggeActivities2();

            // this.LeggeActivities(this.savedActSetId);

            this.effettuaAutoFitLA = !this.effettuaAutoFitLA;
            // this.refreshEmit.emit(this.refresh);
          }
        } else {
          // alert(data[0].v_failure_reason);
          this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
        }
      }, error => {
        // alert(error);
        this.mostraPopup(error, false, '');
      });
    } */
  }

  fAddToActSet(e) {
    this.righeSelezionatePerActSet = e;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.showActSet = true;
  }

  chiudiMascheraAS() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiudo maschera ActSet');
    this.showActSet = false;
  }

  /* salvaFavorito() {
    if (!this.datiDashboard || !this.datiActivities) {
      return;
    }

    let dash;
    this.datiDashboard.forEach(element => {
      if (+element.ID === +this.dashboardSelezionata) {
        dash = element;
      }
    });

    let dataSet;
    this.datiActivitySet.forEach(element => {
      if (+element.ID === +this.activitySet[1]) {
        dataSet = element;
      }
    });

    if (!dataSet || !dash) {
      return;
    }

    this.nomeFav = dash.NAME + ' DataSet: ' + dataSet.NAME;
    this.salvataggioInCorsoFav = true;
  }

  pressioneEnterFav(e) {
    if (e === 'AUTO' || e.key === 'Enter') {
      this.salvaFavoritoFisico();
    }
  } */

  salvaFavorito() {
    this.salvaWorkSpace = true;
  }

  salvaFavoritoFisico(cambioDashboard, ee, vieneDaCambioWS, daDove) {
    if (!this.nomeWorkSpace || this.nomeWorkSpace === '') {
      // alert('Please insert a name for the workspace');
      this.mostraPopup('Please insert a name for the workspace', false, '');
      return;
    }
    
    let dash;
    this.datiDashboard.forEach(element => {
      if (+element.ID === +this.dashboardSelezionata) {
        dash = element;
      }
    });
    // logConsole('Salvataggio workspace', dash, this.datiDashboard, this.dashboardSelezionata);
    // return;

    let dataSet;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiActivitySet);
    if (this.datiActivitySet && this.datiActivitySet !== 'empty') {
      this.datiActivitySet.forEach(element => {
        if (+element.ID === +this.activitySet[1]) {
          dataSet = element;
        }
      });
    }

    let addLay = this.additionalLayer;

    let netTech;
    this.datiNetTech.forEach(element => {
      if (+element.CODE === +this.netTech22) {
        netTech = element;
      }
    });

    let bw;
    this.datiBandWidth.forEach(element => {
      if (+element.CODE === +this.bandwidth22) {
        bw = element;
      }
    });

    let mg;
    this.mappeGlobal.forEach(element => {
      if (+element.id === +this.mapTypeG) {
        mg = element;
      }
    });

    let ms;
    this.mappeStyle.forEach(element => {
      if (+element.id === +this.mapTypeS) {
        ms = element;
      }
    });

    let ss;
    this.styleSizes2.forEach(element => {
      if (+element.id === +this.styleSizeG) {
        ss = element;
      }
    });

    let sg;
    this.datiSlaDTi.forEach(element => {
      if (+element.ID === +this.slaValueGlobale) {
        sg = element;
      }
    });

    let oc = this.impostazioni.overlayClusterG; // this.overlayClusterG;

    let zm = this.zoomMap;

    let sa;
    this.valoriComboSelArea.forEach(element => {
      if (+element.id === +this.comboSelArea) {
        sa = element;
      }
    });

    let ats;
    this.Utilities.datiActTimeSpan.forEach(element => {
      if (+element.name === ExternalUtilities.calcolaTimeSpan(this.Utilities)) { // +this.valoreTimeSpan) {
        ats = element;
      }
    });

    let atsr;
    this.Utilities.datiActTimeSpanRange.forEach(element => {
      if (+element.name === +this.valoreTimeSpanRange) {
        atsr = element;
      }
    });

    const jsone = {
      dashboardSelezionata: dash,
      maskVisible: this.impostazioni.maskVisible,
      activitySet: dataSet,
      timeRangeDSFStart: this.timeRangeDSFStart,
      timeRangeDSFStop: this.timeRangeDSFStop,
      impostaSelezioneLA: this.impostaSelezioneLA,
      additionalLayer: addLay,
      netTech22: netTech,
      bandwidth22: bw,
      ch2: this.ch2,
      bsic2: this.bsic2,
      scr2: this.scr2,
      pci2: this.pci2,
      territory2: this.territory2,
      freeText2: this.freeText2,
      impostaSelezioneMeasureDFN: this.impostaSelezioneMeasureDFN,
      mapTypeG: mg,
      mapTypeS: ms,
      styleSizeG: ss,
      slaValueGlobale: sg,
      overlayClusterG: oc,
      zoomMap: zm,
      comboSelArea: sa,
      datiActTimeSpan: ats,
      datiActTimeSpanRange: atsr,
      tmsSelezionato: this.Utilities.tmsSelezionato,
      // tmsSelezionatoStringa: this.Utilities.tmsSelezionatoStringa,
      valoreTimeSpan: this.valoreTimeSpan,
      valoreTimeSpanRange: this.valoreTimeSpanRange,
      stringaAGNoACT: this.stringaAGNoACT,
      tmsInizio: this.Utilities.tmsInizio,
      tmsFine: this.Utilities.tmsFine,
      isVisibileBars: this.isVisibileBars,
      designInfo: this.designInfo,
      isSyncTms: this.isSyncTms,
      dashboardName: this.dashboardName,
      dashboardFolder: this.dashboardFolder,
      chkUpdatePosition: this.chkUpdatePosition,
      timerAttivatoAuto: this.timerAttivatoAuto,
      cellSet: this.cellSet,
      cellSetRow: this.cellSetRow
    }

    logConsole('SALVATAGGIO IMPOSTAZIONI', jsone);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore workspace', this.valoreTimeSpan);

    const parametri = {
      cntx_id: this.sessioneID,
      v_obj_type: 'geo_analysis',
      v_obj_json: '[' + JSON.stringify(jsone) + ']',
      v_description: this.descWorkSpace ? this.descWorkSpace : '',
      v_obj_name: this.nomeWorkSpace,
      v_folder: this.folderWorkSpace
    }

    this.salvataggioInCorsoFav = true;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Salvo favorito', parametri, jsone);
// return;

    this.apiService.chiamataPost(this.Utilities, 'operator_obj_my__ins', parametri)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(this.Utils, data);

      if (data.err_code) {
        // alert('Error: ' + data.failure_reason);
        this.mostraPopup('Error: ' + data.failure_reason, false, '');
      } else {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Create Act Set return:', data);
        this.refreshFavoriti = !this.refreshFavoriti;

        this.salvataggioInCorsoFav = false;
        this.salvaWorkSpace = false;
        // alert('Dashboard saved');

        if (cambioDashboard) {
          this.cambioDashboard2(ee, vieneDaCambioWS, daDove);
        }
      }
    }, error => {
      // alert(error);
      this.mostraPopup(error, false, '');
    });
  }

  chiudeFav() {
    this.salvataggioInCorsoFav = false;
  }

  lastRitardoAuto = -1;
  coordinatePassateRT;

  attivaTimerAuto(daDove) {
    // alert('Attivazione timer: ' + daDove);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Attivazione timer. MilliSecondi', this.ritardoAuto);
    if (this.timerAuto) {
      clearInterval(this.timerAuto);
      this.timerAuto = undefined;
    }
    this.timerAttivatoAuto = true;

    // this.appoggioTimeSpan = 345;
    this.Utilities.cambioTimeRange = new Date();

    if (this.Utilities.tmsSelezionato !== 0) {
      ExternalUtilities.creaRangeSelezionato('SATS 2 -> ' + daDove, this.Utilities.tmsSelezionato, this.Utilities, this.timerAttivatoAuto, +this.appoggioTimeSpan);
    }

    let contatore = 0;
    this.spostaTempo1(contatore, true);

    this.timerAuto = setInterval(() => {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dentro timer', this.ritardoAuto, contatore, ExternalUtilities.calcolaTimeSpan(this.Utilities)); // this.valoreTimeSpan);
      this.spostaTempo1(contatore, false);

      contatore++;
    }, this.ritardoAuto)
  }

  spostaTempo1(contatore, forza) {
    let valoreRicerca; //  = this.activitySetName[1]['NAME'];
    valoreRicerca = this.stringaAGNoACT;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Timer stringa act', valoreRicerca);
    if (!valoreRicerca || valoreRicerca === '' || valoreRicerca === 'undefined' || valoreRicerca === null || valoreRicerca === 'null') {
      return;
    }
    
    // const dateNow = new Date() + ' UTC+00';
    // const fine_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss', 'UTC');

    const params = {
      v_agn_code: valoreRicerca,
      v_tms: null, // fine_ts,
      v_tms_min: this.Utilities.tmsInizio
    };

    this.apiService.chiamataPost(this.Utilities, 'antsgeo_tms_to_gps1', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data, this.NumeroFrame);
      if (data !== null) {
        ExternalUtilities.checkRitornoChiamata(this.Utils, data);
        this.strutturaTms = { server_time: new Date(data.v_server_time + ' UTC+00').getTime(), tms: data.v_tms};

        this.coordinatePassateRT = data;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati tms to gps1', data);
        this.spostaTempo(contatore, data.v_server_time, data.v_tms, forza);

        // Imposta time range troncando a 0 minuti e 0 secondi (Mail 26/05/2023 07:23)
        const d = new Date();
        // Mail 05/12/2023 18:39 Ora deve impostare le date anche per i minuti e di una sola ora indietro
        // d.setHours(d.getHours() - 2);
        // const inizio = this.datePipe.transform(d, 'yyyy-MM-dd HH:00:00', 'UTC');
        d.setHours(d.getHours() - 1);
        const inizio = this.datePipe.transform(d, 'yyyy-MM-dd HH:mm:00', 'UTC');

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'imposto time start 3', inizio);
        this.timeRangeDSFStart = inizio;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ora inizio', inizio);

        const d2 = new Date();
        // Mail 05/12/2023 18:39 Ora deve impostare le date anche per i minuti e di una sola ora indietro
        // d2.setHours(d2.getHours() + 1);
        // const fine = this.datePipe.transform(d2, 'yyyy-MM-dd HH:00:00', 'UTC');
        d2.setHours(d2.getHours());
        const fine = this.datePipe.transform(d2, 'yyyy-MM-dd HH:mm:00', 'UTC');

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ora fine', fine);
        this.timeRangeDSFStop = fine;
        // Imposta time range troncando a 0 minuti e 0 secondi (Mail 26/05/2023 07:23)

        let ritardoAuto = data.DASHBOARD_REFRESH_AUTO_SEC;
        if (ritardoAuto < 1000) {
          ritardoAuto *= 1000;
        }
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tempo attesa per refresh arrivato', this.ritardoAuto, this.lastRitardoAuto);
        if (this.lastRitardoAuto !== -1 && this.lastRitardoAuto !== ritardoAuto) {   
          this.lastRitardoAuto = ritardoAuto;
          this.ritardoAuto = ritardoAuto;
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tempo attesa per refresh', this.ritardoAuto);

          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.attivaTimerAuto('SpostaTempo');
          }, 100);
        } else {
          if (this.lastRitardoAuto === -1) {
            this.lastRitardoAuto = ritardoAuto;
          }
        }
            
        // this.lastRitardoAuto = this.ritardoAuto;          
      }
    });
  }

  spostaTempo(contatore, server_time_passato, selezionato, forza) {
    const tms = selezionato;
    const s_t = new Date(server_time_passato).getTime();
    // const server_time = fine_ts;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Server time ', server_time_passato, s_t);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'LAST Server time ', this.lastServerTime);
    const diff1 = s_t - this.lastServerTime;

    if (forza === false) {
      if (this.lastTms !== -1 && this.lastServerTime !== -1) {
        if (this.lastTms === tms && +diff1 < +this.ritardoForzato) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sto uscendo e non aggiorno niente. Secondi ', diff1, this.ritardoForzato);
          return;
        }
      }
    }
    this.lastTms = tms;
    this.lastServerTime = s_t;

    // const dateNow: Date = new Date();
    // const fine_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tms:', tms);
    const tmsPassato = new Date(tms + ' UTC+00').getTime(); // new Date().getTime();
    const tmsPassatoS = this.datePipe.transform(new Date(tmsPassato), 'yyyy-MM-dd HH:mm:ss', 'UTC');

    const att = new Date(server_time_passato + ' UTC+00').getTime(); // new Date().getTime();
    const diff = ExternalUtilities.calcolaTimeSpan(this.Utilities) * 1000; // this.valoreTimeSpan * 1000;
    const inizio = att - diff;
    const inizio_ts = this.datePipe.transform(new Date(inizio), 'yyyy-MM-dd HH:mm:ss', 'UTC');

    // this.valoreTimeSpan = diff;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Global time', diff);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Orario Attuale convertito', att);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Inizio TS', inizio_ts);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fine TS', server_time_passato);

    const tmsSel = new Date(this.Utilities.tmsSelezionato).getDate();
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tms Selezionato', this.Utilities.tmsSelezionato);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Diff selez inizio', tmsSel, inizio);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Diff selez fine', tmsSel, att);

    this.impostaTimeSelezionatoFine(server_time_passato, 'SPOSTATEMPO');
    this.impostaTimeSelezionatoInizio(inizio_ts, 'SPOSTATEMPO');

    if (!this.timerAttivatoAuto) {
      if (tmsSel < inizio) {
        this.Utilities.tmsSelezionato = tms;
        // this.Utilities.tmsSelezionatoStringa = inizio_ts;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TS minore dello start, lo imposto', this.Utilities.tmsSelezionato);
      }

      if (tmsSel > att) {
        this.Utilities.tmsSelezionato = att;
        // this.Utilities.tmsSelezionatoStringa = inizio_ts;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TS maggiore dell\'end, lo imposto', this.Utilities.tmsSelezionato);
      }
    } else {
      this.Utilities.tmsSelezionato = tms;
      // this.Utilities.tmsSelezionatoStringa = tmsPassatoS;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TS impostato', this.Utilities.tmsSelezionato);
    }

    // 02/05/2023
    // if (!this.timerAttivatoAuto && this.chkUpdatePosition === true) {
    if (!this.timerAttivatoAuto && this.chkUpdatePosition === true) {
      const time_cursor = selezionato;
      // AppComponent.CambioTmsSelezionato(this.Utilities, time_cursor, 'Automatic cursor set');
      this.impostaTimeSelezionato(time_cursor, 'SPOSTATEMPO');
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cursor TS', time_cursor);
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Auto timer scattato', contatore, inizio_ts, server_time_passato);
  }

  ngAfterContentChecked(): void {
    // Ripristinato: senza questo il menu (e potenzialmente altri componenti figli che emettono eventi
    // durante il proprio ciclo di vita) non aggiorna più la vista. Va rimosso solo dopo aver corretto
    // i singoli punti che ne dipendono.
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    // Ferma i timer e chiude le sottoscrizioni con takeUntil(this.destroy$)
    [this.timerAuto, this.timerSynch, this.tmrMemoria].forEach(timer => {
      if (timer) {
        clearInterval(timer);
      }
    });
    this.destroy$.next();
    this.destroy$.complete();

    if (this.elementView) {
      this.elementView.nativeElement.remove();
    }
    if (this.divContStampa) {
      this.divContStampa.nativeElement.remove();
    }

    if (this.divCont) {
      if (this.splitMenu) {
        this.renderer.removeChild(this.divCont.nativeElement, this.splitMenu);
      }
      if (this.split12) {
        this.renderer.removeChild(this.divCont.nativeElement, this.split12);
      }
      if (this.split34) {
        this.renderer.removeChild(this.divCont.nativeElement, this.split34);
      }
      if (this.split56) {
        this.renderer.removeChild(this.divCont.nativeElement, this.split56);
      }
      if (this.splitVertical) {
        this.renderer.removeChild(this.divCont.nativeElement, this.splitVertical);
      }

      this.divCont.nativeElement.remove();
    }
  }

  impostaTmsAttuale() {
    const time_cursor = this.Utilities.tmsFine;
    // AppComponent.CambioTmsSelezionato(this.Utilities, time_cursor, 'Automatic cursor set');
    this.impostaTimeSelezionato(time_cursor, 'TMSATTUALE');
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato cursor TS', time_cursor);
  }

  fermaTimerAuto() {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Timer fermato');
    clearInterval(this.timerAuto);

    this.timerAttivatoAuto = false;
  }

  mostraPopup(Messaggio, Dialog, Cosa) {
    ExternalUtilities.visualizzaAlert(Messaggio);
    return;

    const dialogRef = this._matDialog.open(ConfermaComponent, {
      data: {
        messaggio: Messaggio,
        mostraAnnulla: Dialog
      },
    });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      switch(Cosa) {

      }
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'The dialog was closed', result);
      // this.animal = result;
    });
  }

  selectFoldersWS(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione folder: ', e);
    if (e) {
      if (e.CODE_STR) {
        this.folderWorkSpace = e.CODE_STR;
      } else {
        if (e.indexOf('***') > -1) {
          this.folderWorkSpace = e.replace('***', '');
        }
      }
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.folderWorkSpace);
    }
  }

  vecchioE = '';

  checkDataSet(n, e, esegui) {
    this.vecchioE = e;
    const t = setInterval(() => {
      if (this.vecchioE === e) {
        this.vecchioE = '';
        clearInterval(t);

        this.checkDataSet2(n, e, esegui);
      }
    }, 200);
  }

  checkDataSet2(n, e, esegui) {
    if (typeof(e) === 'string') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca activityset per stringa', e);

      if (e.length > 0) {
        const params = '{' +
          '"cntx_id": "' + ExternalUtilities.sessione + '",' +
          '"v_filter_folder": "", ' +
          '"v_filter_name": "' + e + '"' +
        '}';
        // logConsole('cambio activity forzato 3.1:', JSON.parse(params));
        this.apiService.chiamataPost(this.Utilities, 'geo_act_set__grid', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Ritorno check dataset', data);
          if (data && data.DataTable && data.DataTable.length > 0) {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovata activityset per stringa', data);

            /* const a = new Array();
            data.DataTable.forEach(element => {
              if (element.FOLDER === 'RECENT (latest 7 days)') {
                a.push(element);
              }
            });
            data.DataTable = a; */
            this.datiActivitySet = data.DataTable;
            // logConsole('Dati actset: ', data.DataTable);

            // this.datiActivitySet = data; // .DataTable;
            // logConsole('cambio activity forzato 3.5:', this.datiActivitySet);

            let ok = false;
            data.DataTable.forEach(element => {
              if (element.NAME === e) {
                if (esegui === true) {
                  // logConsole('cambio activity forzato 3.7:', element);
                  ok = true;
                  this.activitySet[1] = element.ID;
                  const tm = setTimeout(() => {
                    clearTimeout(tm);

                    this.prosegueGestioneActivitySet(n, element, false);
                  }, 1000);
                }
              }
            });
            if (!ok) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Nessuna activity rilevata 1', data);
            }
          } else {
            this.datiActivitySet = 'empty';
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Nessuna activity rilevata 2', data);
          }
        });
      }
    } else {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Ricerca activityset per id basata sui recenti', e);

      const params = '{' +
        '"cntx_id": "' + ExternalUtilities.sessione + '",' +
        '"v_filter_folder": "<RECENT>"' +
      '}';
      this.apiService.chiamataPost(this.Utilities, 'geo_act_set__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        if (data2) {
          let ok = false;
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Trovata activityset per id basata sui recenti', data2);
          data2.DataTable.forEach(element => {
            if (element.ID === +e) {
              ok = true;
              this.datiActivitySet = [ element ];
              this.activitySet[1] = element.ID;
              // alert('Activity set impostato: ' + element.ID);
              if (esegui === true) {
                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Proseguo elaborazione', element);
                  this.prosegueGestioneActivitySet(n, element, false);
                }, 1000);
              }
            }
          });
          if (!ok) {
            alert('Activity id non trovato sui recenti:' + e);
          }
        } else {
          this.datiActivitySet = 'empty';
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Select tipo activity: Nessuna activity rilevata 3');
        }
      });
    }
  }

  cambioRicaricaRaggi(e) {
    this.ricaricaRaggi = e;
  }

  checkSetNetText(e) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      this.setNetTech = e.srcElement.checked;
    }, 100);
  }

  checkShowLegendHistogram(e) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (e) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
        this.showLegendaHistogram = e.srcElement.checked;
        this.impostazioni.showLegendHistogram = e;
        // localStorage.setItem(this.userName + '_ShowLegendHistogram', this.showLegendaHistogram ? 'S' : 'N');

        for (let i = 0; i <= 9; i++) {
          this.refreshMap[i] = !this.refreshMap[i];
        }
      }
    }, 100);
  }

  chiamaBound() {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.activitySetName[1]['NAME']);

    // this.tmsStartPassatoDaProgetto = impostazioni.timeRangeDSFStart;
    // this.tmsEndPassatoDaProgetto = impostazioni.timeRangeDSFStop;

    let sta;
    let sto;

    sta = this.timeRangeDSFStart;
    sto = this.timeRangeDSFStop;

    if (sta === undefined || sta === 'undefined' || sta === '"undefined"') {
      return;
    }

    if (sto === undefined || sto === 'undefined' || sto === '"undefined"') {
      return;
    }

    const params = '{' +
      '"v_cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_act_set_name_list": "' + this.activitySetName[1]['NAME'] + '",' +
      '"v_tms_min": "' + sta + '",' +
      '"v_tms_max": "' + sto + '"' +
    '}';
    // const params = JSON.parse(param);
    this.apiService.chiamataPost(this.Utilities, 'geo_act_set_bounds__set', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      if (data2) {
      }
    });
  }

  listaProcess;

  premutoProcess(e) {
    // Una sola copia, senza duplicare il DataTable originale che viene comunque sostituito
    this.datiGrigliaCheck = JSON.parse(JSON.stringify({ ...this.datiActivities, DataTable: e }));
    this.modalitaCheckPopup = 'process_activities';
    this.operazioneCheckPopup = 'Process';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  premutoProcess1(e) {
    this.listaProcess = e;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.premutoProcessElaborazione(0);
  }

  premutoProcessElaborazione(q) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    const params = '{' +
      '"v_cntx": "' + ExternalUtilities.sessione + '",' +
      '"v_act_id": ' + this.listaProcess[q].GEO_ACT_ID + '' +
    '}';
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Funzione chiamata: geo_act__reproc', this.listaProcess[q], params)
    // }
    // return;

    this.apiService.chiamataPost(this.Utilities, 'geo_act__reproc', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Create Act Set return:', data);
      if (+data[0].v_err_code === 0) {
        q+=1
        if (q < this.listaProcess.length) {
          this.premutoProcessElaborazione(q);
        } else {
          this.vecchioParamsAct = '';
          this.LeggeActivities2();
        }
        // this.vecchioParamsAct = '';
        // this.LeggeActivities2();
      } else {
        this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
      }
    });
  }

  indietroRange() {
    if (AppComponent.qualeRange > 0) {
      AppComponent.qualeRange--;

      this.impostaTimeRangeTasto();
    }
  }

  avantiRange() {

  }

  impostaTimeRangeTasto() {
    const s = AppComponent.ranges[AppComponent.qualeRange];
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione tmsInizio 10', this.Utilities.datePipe.transform(new Date(s.inizio + ' UTC+00'), 'yyyy-MM-dd HH:mm:ss', 'UTC'));
    // logConsole('TMS INIZIO 9', this.Utilities.datePipe.transform(new Date(s.inizio + ' UTC+00'), 'yyyy-MM-dd HH:mm:ss', 'UTC'));
    this.Utilities.tmsInizio = this.Utilities.datePipe.transform(new Date(s.inizio + ' UTC+00'), 'yyyy-MM-dd HH:mm:ss', 'UTC');
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tms Inizio impost time range tasto', this.Utilities.tmsInizio);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS FINE 6: ', s.fine);
    this.Utilities.tmsFine = this.Utilities.datePipe.transform(new Date(s.fine + ' UTC+00'), 'yyyy-MM-dd HH:mm:ss', 'UTC');

    const sInizio = this.Utilities.datePipe.transform(s.inizio, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    const sFine = this.Utilities.datePipe.transform(s.fine, 'yyyy-MM-dd HH:mm:ss', 'UTC');

    this.Utilities.rangeSelezionatoStampa = s.inizio + '<br />' + s.fine;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato time range', s, AppComponent.qualeRange);

    // this.impostaTimeRange(sInizio + ';' + sFine);
    this.ridisegnaTutto = new Date();
  }

  static aggiungeRange(u) {
    // this.Utilities.tmsInizio
    // this.Utilities.tmsFine
    let ok = true;

    if (AppComponent.qualeRange > -1) {
      const ultimo = AppComponent.ranges[AppComponent.qualeRange];
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, ultimo);
      if (ultimo.inizio === u.tmsInizio && ultimo.fine === u.tmsFine) {
        ok = false;
      }
    }
    if (ok) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AggiungeRange. Inizio', u.tmsInizio);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AggiungeRange. Fine', u.tmsFine);

      let tmsInizio;
      let tmsFine;
      let ok = true;

      try {
        tmsInizio = new Date(u.tmsInizio + ' UTC+00');
        tmsFine = new Date(u.tmsFine + ' UTC+00');
      } catch(e) {
        ok = false;
        console.error('AggiungeRange. Conversione data non riuscita:', tmsInizio, tmsFine);
      }

      if (ok) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AggiungeRange. Inizio Conv', tmsInizio);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AggiungeRange. Fine Conv', tmsFine);

        let sInizio;
        let sFine;

        try {
          sInizio = u.datePipe.transform(tmsInizio, 'yyyy-MM-dd HH:mm:ss');
          sFine = u.datePipe.transform(tmsFine, 'yyyy-MM-dd HH:mm:ss');
        } catch (e) {
          console.error('AggiungeRange. Trasformazione data non riuscita:', sInizio, sFine);
        }

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AggiungeRange. Inizio Conv 2', sInizio);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AggiungeRange. Fine Conv 2', sFine);

        const s = {
          inizio: sInizio,
          fine: sFine
        }
        AppComponent.ranges.push(s);
        AppComponent.qualeRange++;

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiunto time range', s);
      }
    }
  }

  refreshAccentratoreEmit(e) {
    this.refreshAccentratore = e;
  }

  /* cambioTitoloFrame(f, n, e) {
    const tm = setTimeout(() => {
      this.impostazioni.titoloFrame[f][n] = e;
      this.impostazioni.frameName[f][n] = e;
      // this.creaNomiFrames(false);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio nome frame ' + n + ' (Attivo: ' + f + '): ', e);
      this.checkDifferenceFromStartJSON();
    }, 100);
  } */ // NAMEFRAME

  /* cambioTitoloFrame(f, n, e) {
    const tm = setTimeout(() => {
      // this.impostazioni.titoloFrame[f][n] = e;
      this.impostazioni.frameName[f][n] = e;
      this.creaNomiFrames(false);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio nome frame ' + n + ': ', e);
      this.checkDifferenceFromStartJSON();
    }, 100);
  } */

  syncDash() {
    if (this.timerSynch === undefined) {
      this.stoppaSynch = false;
      this.timerSynch = setInterval(() => {
        if (this.stoppaSynch === true) {
          clearInterval(this.timerSynch);
          this.timerSynch = undefined;
        } else {
          this.chiamaSynchDash();
        }
      }, 1000);
    } else {
      this.stoppaSynch = true;
    }
  }

  chiamaSynchDash() {
    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_obj_type": "geo_analysis_sync",' +
      '"v_obj_name": "sync [' + this.operatorID + ']"' +
    '}';
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Funzione chiamata: operator_obj_my__get', params)

    this.apiService.chiamataPost(this.Utilities, 'operator_obj_my__get', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data);
      if (data.DataTable && data.DataTable[0] && data.DataTable[0].OBJ_JSON[0]) {
        const jsone = data.DataTable[0].OBJ_JSON[0];
        if (JSON.stringify(jsone) !== JSON.stringify(this.lastJsone)) {
          let ok = false;
          let sInizio;
          let sFine;
          let sSelezionato;

          if (!this.lastJsone || this.lastJsone.tmsFine !== jsone.tmsFine) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno synch dash. Tms Fine diverso:', jsone.tmsFine);

            sFine = this.Utilities.datePipe.transform(jsone.tmsFine, 'yyyy-MM-dd HH:mm:ss');
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS FINE 7: ', sFine);
            this.Utilities.tmsFine = sFine;

            ok = true;
          }

          if (!this.lastJsone || this.lastJsone.tmsInizio !== jsone.tmsInizio) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno synch dash. Tms Inizio diverso:', jsone.tmsInizio);

            sInizio = this.Utilities.datePipe.transform(jsone.tmsInizio, 'yyyy-MM-dd HH:mm:ss');
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tms Inizio chiam sync dash', sInizio);
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazione tmsInizio 12', sInizio);
            // logConsole('TMS INIZIO 10', sInizio);
            this.Utilities.tmsInizio = sInizio;

            ok = true;
          }

          if (!this.lastJsone || this.lastJsone.tmsSelezionato !== jsone.tmsSelezionato) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno synch dash. Tms Selezionato diverso:', jsone.tmsSelezionato);

            sSelezionato = this.Utilities.datePipe.transform(jsone.tmsSelezionato, 'yyyy-MM-dd HH:mm:ss');
            this.Utilities.tmsSelezionato = sSelezionato;
            // this.Utilities.tmsSelezionatoStringa = sSelezionato;

            ok = true;
          }

          if (!this.lastJsone || this.lastJsone.activitySet.NAME !== jsone.activitySet.NAME) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno synch dash. Activity Name diverso:', jsone.activitySet.NAME);
            this.checkDataSet(1, jsone.activitySet.NAME , true);

            ok = true;
          }

          if (!this.lastJsone ||this.lastJsone.stringaAGNoACT !== jsone.stringaAGNoACT) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno synch dash. stringaAGNoACT diverso:', jsone.stringaAGNoACT);
            this.stringaAGNoACT = JSON.parse(JSON.stringify(jsone.stringaAGNoACT));

            ok = true;
          }

          if (!this.lastJsone || this.lastJsone.timeRangeDSFStart !== jsone.timeRangeDSFStart) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno synch dash. timeRangeDSFStart diverso:', jsone.timeRangeDSFStart);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'imposto time start 4', jsone.timeRangeDSFStart);
            this.timeRangeDSFStart = this.Utilities.datePipe.transform(jsone.timeRangeDSFStart, 'yyyy-MM-dd HH:mm:ss');

            ok = true;
          }

          if (!this.lastJsone || this.lastJsone.timeRangeDSFStop !== jsone.timeRangeDSFStop) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno synch dash. timeRangeDSFStop diverso:', jsone.timeRangeDSFStop);
            this.timeRangeDSFStop = this.Utilities.datePipe.transform(jsone.timeRangeDSFStop, 'yyyy-MM-dd HH:mm:ss');

            ok = true;
          }

          if (ok) {
            this.Utilities.rangeSelezionatoStampa = sInizio + '<br />' + sFine;

            this.ridisegnaTutto = new Date();

            // this.LeggeActivitySetPR();
            this.LeggeActivities2();
          }

          this.lastJsone = jsone;
        }
      // } else {
      //   this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
      }
    });
  }


  impostaActSet(actSet, start, fine) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity da impostare:', actSet);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tms inizio: ', start);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tms fine: ', fine);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'imposto time start 5', start);
    this.timeRangeDSFStart = start;
    this.timeRangeDSFStop = fine;
    this.checkDataSet(1, actSet , true);
  }

  ultimaPaginaSelezionata;
  puliziaFrame = ExternalUtilities.creaVettore(environment.quantiFrames, false);

  selectPageSelector(ee) {
    if (!ee) {
      return;
    }
    let e = ee; // .dataItem;
    if (e.dataItem) { 
      e = e.dataItem[0]; 
    } else { 
      e = e[0]; 
    }
    this.ultimaRigaSelezionataPS = ee[0];
    // logConsole('Pagina selezionata: ', ee[0]);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pagina selezionata:', e, ee);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pagina attiva:', this.ultimaPaginaSelezionata);
    if (this.ultimaPaginaSelezionata && +ee[0].id === +this.ultimaPaginaSelezionata) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vecchio frame uguale al nuovo. SKippo');

      // return;
    }
    this.ultimaPaginaSelezionata = ee[0].id;
    let nuovoFrameAttivo;

    if (e) {
      if (typeof(e) !== 'string') {
        nuovoFrameAttivo = e.id;
      } else {
        if (e.indexOf('***') === -1) {
          nuovoFrameAttivo = e.replace('***', '');
        } else {
          return;
        }
      }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      
      this.nomePaginaSelezionata = e.value;
      if (this.nomePaginaSelezionata && this.nomePaginaSelezionata.indexOf(':') > -1) {
        this.nomePaginaSelezionata = this.nomePaginaSelezionata.substring(this.nomePaginaSelezionata.indexOf(':') + 2, this.nomePaginaSelezionata.length);
      }

      /* const mv = JSON.parse(JSON.stringify(this.impostazioni.maskVisible));
      this.impostazioni.maskVisible[1] = true;
      this.impostazioni.maskVisible[2] = true;
      this.impostazioni.maskVisible[3] = true; */

      // const tm = setTimeout(() => {
        
        this.pageSelector = nuovoFrameAttivo;
        this.impostazioni.pageSelector = nuovoFrameAttivo;
        // this.impostazioni.pageSelector = this.pageSelector;
      
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa o grafico tutti', this.MappaOGraficoTutti);
  
        this.aggiustaArray.controllaImpostazioniSize(this, 'Select page Selector');
        this.impostaDragDrop();

        if (!this.impostazioni.framesAttivi) {
          this.impostazioni.framesAttivi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, -1);
        }

        this.impostazioni.framesAttivi = this.aggiustaArray.SistemaDimensioni(this.impostazioni.framesAttivi, -1);
        this.impostazioni.frameName = this.aggiustaArray.SistemaDimensioni(this.impostazioni.frameName, '<empty>');

        for (let i = 1; i <= environment.quantiFrames; i++) {
          /* if (!this.impostazioni.framesAttivi[this.pageSelector]) {
            this.impostazioni.framesAttivi[this.pageSelector] = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
          }
          if (!this.impostazioni.framesAttivi[this.pageSelector][i] ||
            this.impostazioni.framesAttivi[this.pageSelector][i] === -1
          ) {
            if (this.impostazioni.framesAttivi[this.pageSelector] === null || this.impostazioni.framesAttivi[this.pageSelector] === 'null') {
              this.impostazioni.framesAttivi[this.pageSelector] = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
            }
            // logConsole(this.impostazioni.framesAttivi, this.pageSelector, i);
            this.impostazioni.framesAttivi[this.pageSelector][i] = this.pageSelector;
          } */

          if (this.impostazioni.frameAttivo[i] !== this.impostazioni.framesAttivi[this.pageSelector][i]) {
            this.impostazioni.frameAttivo[i] = -1;
          }
        }

        // logConsole('Select page selector');

        // this.impostazioni.framesAttivi[this.pageSelector] = [-1, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15];

        const t0 = setTimeout(() => {
          clearTimeout(t0);

          for (let i = 1; i <= environment.quantiFrames; i++) {
              // if (i !== 2) {
              // this.puliziaFrame[i] = !this.puliziaFrame[i];
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulizia frame', this.puliziaFrame);
              // alert('Pulizia frame ' + this.pageSelector );

              const tm = setTimeout(() => {
                clearTimeout(tm);

                if (this.impostazioni.frameAttivo[i] === -1) {
                  // logConsole('Impostazioni frames attivi', i, this.impostazioni.framesAttivi[this.pageSelector][i]);

                  let vistaImpostata;

                  let pagina = this.impostazioni.frameName[this.pageSelector][this.impostazioni.framesAttivi[this.pageSelector][i]];
                  // logConsole('Pagine', this.impostazioni.frameName);
                  // logConsole('Pagina da cambiare', this.pageSelector, i, this.impostazioni.framesAttivi[this.pageSelector][i], pagina);
                  if (!pagina || pagina === null) {
                    pagina = '';
                  }
                  if (pagina.indexOf('[' + this.pageSelector + ']') > -1) {
                    vistaImpostata = this.impostazioni.framesAttivi[this.pageSelector][i];
                  } else {
                    vistaImpostata = this.pageSelector;
                  }

                  this.impostazioni.frameAttivo[i] = vistaImpostata; // this.impostazioni.framesAttivi[this.pageSelector][i]; // this.pageSelector; // + ';DACONTEXT';

                  // logConsole('Imposto view ' + this.impostazioni.framesAttivi[this.pageSelector][i] + ' su frame ' + i + ' della pagina ' + this.pageSelector);
                  // logConsole('Pagina 1', this.pageSelector, this.impostazioni.frameAttivo[i], i, this.impostazioni.filtriEventi);

                  if (this.impostazioni.filtriEventi && this.impostazioni.filtriEventi[this.impostazioni.frameAttivo[i]]) {
                    const vecchio = this.impostazioni.filtriEventi[this.impostazioni.frameAttivo[i]][i];
                    // logConsole('Pagina 2', vecchio, this.impostazioni.frameAttivo[i], i);
                    // const vecchioEscluso = this.impostazioni.filtriEventiEscluso[this.impostazioni.frameAttivo[i]][i];
                    this.impostazioni.filtriEventi[this.impostazioni.frameAttivo[i]][i] = '';
                    // this.impostazioni.filtriEventiEscluso[this.impostazioni.frameAttivo[i]][i] = '';
                    const tm = setTimeout(() => {
                      clearTimeout(tm);

                      this.impostazioni.filtriEventi[this.impostazioni.frameAttivo[i]][i] = vecchio;
                      // this.impostazioni.filtriEventiEscluso[this.impostazioni.frameAttivo[i]][i] = vecchioEscluso;

                      // logConsole('Sliders', this.impostazioni.maskSize[this.pageSelector]);

                      const tm1 = setTimeout(() => {
                        clearTimeout(tm1);
                        
                        if (this.ultimoCSV) {
                          this.csvImpostato(i, this.ultimoCSV);
                        }
                      }, 100);
                    }, 100);
                  }
                }
                
                /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio frame attivo per PS. Filtro Eventi: ', 
                  this.impostazioni.filtroEventi[this.impostazioni.frameAttivo[i]][i], 
                  this.impostazioni.frameAttivo[i], i); */
              }, 1000);
            // }
          }

          // logConsole('Impostazione pagina ' + this.pageSelector + ' Views: ' + this.impostazioni.framesAttivi[this.pageSelector]);

          /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e, this.pageSelector, this.impostazioni.frameAttivo);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSize[this.pageSelector]);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskSizeHor[this.pageSelector]);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.maskVisible[this.pageSelector]); */
          // this.impostazioni = JSON.parse(JSON.stringify(this.impostazioni));

          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Occhietto:', this.impostazioni.occhioCheckato, this.impostazioni.occhioCheckato[this.pageSelector]);
          // this.vecchieImpostazioniHor = undefined;
          
          /* 
          MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
          if (this.impostazioni.occhioCheckato[this.pageSelector] === false) {
            this.impostazioni.framesPinnati = false;
            this.apre123();
          } else {
            this.impostazioni.framesPinnati = true;
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.chiude123();
            }, 1000);
          }
          MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
          */

          // this.gestisceFinestre();

          /* const tm = setTimeout(() => {
            this.impostazioni.maskVisible = JSON.parse(JSON.stringify(mv));
          }, 1000); */

          /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.frameName[3][this.pageSelector]);
          const a = this.impostazioni.frameName[3][this.pageSelector];
          this.impostazioni.frameName[3][this.pageSelector] = '*';
          const tm = setTimeout(() => {
            this.impostazioni.frameName[3][this.pageSelector] = a;
            this.impostazioni.frameName = JSON.parse(JSON.stringify(this.impostazioni.frameName));
          }, 100);
          for (let i = 0; i < 10; i++) {
            const n = this.impostazioni.frameName[i][this.pageSelector];
            this.impostazioni.frameName[i][this.pageSelector] = '';
            const tm = setTimeout(() => {
              this.impostazioni.frameName[i][this.pageSelector] = n;
            }, 10);
          } */
          // this.impostazioni.frameName[3][this.pageSelector] = JSON.parse(JSON.stringify(this.impostazioni.frameName[3][this.pageSelector]));

        // }, 2000);
      }, 500);
    }
  }

  ultimaRigaSelezionataPS;

  apreMascheraPS() {
    if (this.pageSelector === -1) {
      ExternalUtilities.visualizzaAlert('Please select a page');
      return;
    }
    /* this.pageSelector2 = -1;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, "Page selector", this.pageSelector);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, "Dati Page Selector", this.impostazioni.datiPageSelector);
    let id = -1;
    let i = 0;
    this.impostazioni.datiPageSelector.DataTable.forEach(element => {
      // // logConsole(+element.id, +this.pageSelector);
      if (id === -1 && +element.id === +this.pageSelector) {
        id = i;
        this.idRigaPS = element.id;
        this.row_idPS = element.ROW_ID;
        // // logConsole('PRESO: ', id);
      }
      i++;
    });
    if (id > -1) {
      this.pageSelector = id;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, "ID Page Selector Presa", id);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, "ID Riga Page Selector Presa", this.idRigaPS);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, "ROW_ID Riga Page Selector Presa", this.row_idPS);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, "Riga Page Selector Presa", this.impostazioni.datiPageSelector.DataTable[id]); */
      
      // this.ultimaRigaSelezionataPS = ee[0];

      let riga;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, "Riga Page Selector Presa 1", this.ultimaRigaSelezionataPS);
      /* this.impostazioni.datiPageSelector.DataTable.forEach(element => {
        if (!riga && +element.ROW_ID === +this.ultimaRigaSelezionataPS.ROW_ID) {
          riga = element;
        }
      }); */
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, "Riga Page Selector Presa", this.ultimaRigaSelezionataPS);
      this.nomePS = this.ultimaRigaSelezionataPS.value;
      if (this.nomePS.indexOf(':') > -1) {
        const n = this.nomePS.split(':');
        this.nomePS = n[1].trim();
      }
      if(!this.ultimaRigaSelezionataPS.description) {
        this.ultimaRigaSelezionataPS['description']='';
      }
      this.descriptionPS = this.ultimaRigaSelezionataPS.description;
      // alert('Descrizione: ' + this.descriptionPS);
      this.impostaNonChiudere2(true);
      this.richiedeNomePS = true;
    // }
  }

  rinfrescaGrigliaPS = false;

  impostaNomePageSelector() {
    // const vecchio = this.pageSelector;
    const ps = { 
      ROW_ID: this.ultimaRigaSelezionataPS.ROW_ID, 
      id: this.ultimaRigaSelezionataPS.id, 
      value: (this.ultimaRigaSelezionataPS.id) + ': ' + this.nomePS, 
      description: this.descriptionPS, 
      OnlyName: this.nomePS
    };
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Page Selector Nuovo nome ', ps);
    const nuoviDati = new Array(); // this.impostazioni.datiPageSelector.DataTable;
    this.impostazioni.datiPageSelector.DataTable.forEach(element => {
      if (+element.id === +this.ultimaRigaSelezionataPS.id) {
        nuoviDati.push(ps);
      } else {
        nuoviDati.push(element);
      }
    });
    // nuoviDati[this.ultimaRigaSelezionataPS.ROW_ID] = ps;
    // this.impostazioni.datiPageSelector.DataTable = nuoviDati;
    this.impostazioni.datiPageSelector.DataTable = JSON.parse(JSON.stringify(nuoviDati));
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.datiPageSelector);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.pageSelector, this.impostazioni.datiPageSelector.DataTable);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostazioni.datiPageSelector.DataTable[this.pageSelector - 1]);
    /* this.pageSelector = 1;
    const vecchiDati = this.impostazioni.datiPageSelector;
    this.impostazioni.datiPageSelector = null;
    const tm = setTimeout(() => {
      this.pageSelector = vecchio;
      this.impostazioni.pageSelector = vecchio;
      this.impostazioni.datiPageSelector = vecchiDati;
      // this.rinfrescaGrigliaPS = !this.rinfrescaGrigliaPS;
      this.effettuaAutoFitPS = !this.effettuaAutoFitPS;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, vecchiDati);
    }, 100); */
    this.generaDatiPageSelectorFiltrati(this.impostazioni.datiPageSelector, 'impostaNomePage');

    this.impostaNonChiudere2(false);
    this.richiedeNomePS = false;
    // const nome = inputbox('Name for the page selector')
  }

  selectPageSelector2(e) {
    let nuovoFrameAttivo;

    if (e) {
      if (typeof(e) !== 'string') {
        nuovoFrameAttivo = e.id;
      } else  {
        if (e.indexOf('***') === -1) {
          nuovoFrameAttivo = e.replace('***', '');
        } else {
          return;
        }
      }

      this.pageSelector2 = nuovoFrameAttivo;
    }
  }

  swapPagina() {
    if (this.pageSelector2 === -1) {
      ExternalUtilities.visualizzaAlert('Please select a destination page');
      return;
    }
    if (this.pageSelector === this.pageSelector2) {
      ExternalUtilities.visualizzaAlert('Origin and destination are the same');
      return;
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Swap pagine da ' + this.pageSelector + ' a ' + this.pageSelector2);

    const frameDa = this.pageSelector;
    const frameTo = this.pageSelector2;

    for (let i = 1; i <= 9; i++) {
      const vistaDa = JSON.parse(JSON.stringify(this.appoggiaValori(frameDa, i)));
      const vistaA = JSON.parse(JSON.stringify(this.appoggiaValori(frameTo, i)));

      this.spostaValori(vistaDa, frameTo, i);
      this.spostaValori(vistaA, frameDa, i);
    }

    const appo = this.impostazioni.datiPageSelector.DataTable[this.pageSelector2 - 1];
    let appo2 = appo.value;
    if (appo2.indexOf(':') > -1) {
      const n = appo2.split(':');
      appo2 = n[1].trim();
    }
    appo.value = this.pageSelector + ': ' + appo2;

    const appo21 = this.impostazioni.datiPageSelector.DataTable[this.pageSelector - 1];
    let appo22 = appo21.value;
    if (appo22.indexOf(':') > -1) {
      const n = appo22.split(':');
      appo22 = n[1].trim();
    }
    appo21.value = this.pageSelector2 + ': ' + appo22;

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, appo, appo21);

    this.impostazioni.datiPageSelector.DataTable[this.pageSelector - 1] = appo;
    this.impostazioni.datiPageSelector.DataTable[this.pageSelector2 - 1] = appo21;

    const dime = this.impostazioni.dimensioni[this.pageSelector2 - 1];
    const dime21 = this.impostazioni.dimensioni[this.pageSelector - 1];
    this.impostazioni.dimensioni[this.pageSelector - 1] = dime;
    this.impostazioni.dimensioni[this.pageSelector2 - 1] = dime21;

    /*
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    const dimeOC = this.impostazioni.occhioCheckato[this.pageSelector2 - 1];
    const dime21OC = this.impostazioni.occhioCheckato[this.pageSelector - 1];
    this.impostazioni.occhioCheckato[this.pageSelector - 1] = dimeOC;
    this.impostazioni.occhioCheckato[this.pageSelector2 - 1] = dime21OC;
    MAIL 27/02/2025 - Non serve più l'occhio che gestisce le aperture chiusure della prima riga
    */

    this.impostaDragDrop();

    const appo3 = this.pageSelector2;
    this.pageSelector2 = -1;

    const tm = setTimeout(() => {
      clearTimeout(tm);
      // this.impostazioni.datiPageSelector = JSON.parse(JSON.stringify(this.impostazioni.datiPageSelector));
      this.pageSelector2 = appo3;

      let id = 1;
      this.impostazioni.datiPageSelector.DataTable.forEach(element => {
        element.id = id;
        id++;
      });
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nuovo page selector', this.impostazioni.datiPageSelector.DataTable);

      const vecchi = this.impostazioni.datiPageSelector;
      this.impostazioni.datiPageSelector = undefined;
      const tm1 = setTimeout(() => {
        clearTimeout(tm1);

        this.impostazioni.datiPageSelector = vecchi;
      }, 100);
      this.richiedeNomePS = false;
    }, 100);

    /* const appo = this.pageSelector;
    this.pageSelector = -1;
    this.pageSelector2 = -1;

    const tm = setTimeout(() => {
      this.pageSelector = this.pageSelector2;
      this.pageSelector2 = appo;
    }, 100); */
  }

  lettiWS(e) {
    /* const l = new Array();
    e.forEach(element => {
      if (element.FOLDER === 'Template')  {
        element.DASHBOARD.forEach(element2 => {
          l.push(element2);
        });
      }
    }); */
    this.listaWorkspaces = e;
  }

  soloPaginaAttuale = true;
  stampaPagine = false;
  bloccaStampa = false;
  // screenShot;
  // toglieScreenShot;

  fBloccaStampa() {
    this.bloccaStampa = true;
    this.titoloScreenShot = '';
    this.descrizioneScreenShot = 'Print cancellation';
    this.dettaglioScreenShot = '';
  }

  esegueScreenshot() {
    this.stampaPagine = true;
    this.bloccaStampa = false;

    this.leave2();

    // this.screenShot = new Date().toString();
  
    const tm = setTimeout(() => {
      clearTimeout(tm);
      // // logConsole('Pagine da screenshottare: ', this.datiPageSelectorFiltrati.DataTable);
      this.screenShotMask.esegueScreenShot(this, this.soloPaginaAttuale);
      // this.toglieScreenShot = new Date().toString();
    }, 5000);
  }
  
  passaggioListaEventiSE(e) {
    // this.listaEventiSE = undefined;
    // const tm = setTimeout(() => {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi cambiata', e);
      /* if (typeof(e) === 'string') {
        e = JSON.parse(e);
      }
      this.listaEventiSE = e; */
      
      this.listaEventiSE = e;
      if (e) {
        // logConsole('Cambio eventi scelti 2', e);
        if (this.impostazioni.eventiSceltiES) {
          this.impostazioni.eventiSceltiES = JSON.parse(JSON.stringify(e));
        } else {
          this.impostazioni.eventiSceltiES = new Array();
        }
      } else {
        this.impostazioni.eventiSceltiES = new Array();
      }

    // }, 100);
  }
  
  passaggioListaEventiGlobaliSE(e) {
    // this.listaEventiSE = undefined;
    // const tm = setTimeout(() => {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi globali cambiata', e);
      /* if (typeof(e) === 'string') {
        e = JSON.parse(e);
      }
      this.listaEventiSE = e; */
      
      this.listaEventiGlobaliSE = e;
      if (e) {
        // logConsole('Cambio eventi scelti 2', e);
        if (this.impostazioni.eventiSceltiGlobaliES) {
          this.impostazioni.eventiSceltiGlobaliES = JSON.parse(JSON.stringify(e));
        } else {
          this.impostazioni.eventiSceltiGlobaliES = new Array();
        }
      } else {
        this.impostazioni.eventiSceltiGlobaliES = new Array();
      }

    // }, 100);
    this.cambioEventiSceltiGlobali(this.impostazioni.eventiSceltiGlobaliES);
  }

  cambioDelta(e) {
    this.nuovoTmsDelta = e;
  }

  listaIncExc = undefined;

  includeClick(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Include', e);

    this.listaIncExc = e;
    let nomeActSet = '';
    this.datiActivitySet.forEach(element => {
      if (+element.ID === +this.activitySet[1]) {
        nomeActSet = element.NAME;
      }
    });

    this.chiamaIncExc(nomeActSet, 'incld', 0);
  }

  excludeClick(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Exclude', e);

    this.listaIncExc = e;
    let nomeActSet = '';
    this.datiActivitySet.forEach(element => {
      if (+element.ID === +this.activitySet[1]) {
        nomeActSet = element.NAME;
      }
    });

    this.chiamaIncExc(nomeActSet, 'excld', 0);
  }

  chiamaIncExc(nomeActSet, Come, q) {
    const element = this.listaIncExc[q];
    const params = '{' +
      '"v_cntx": "' + this.sessioneID + '",' +
      '"v_act_set_name": "' + nomeActSet + '",' +
      '"v_geo_act_id": "' + element.GEO_ACT_ID + '",' +
      '"v_mode": "' + Come + '"' +
    '}';

    this.apiService.chiamataPost(this.Utilities, 'geo_act_set_rec_excld__upd', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if (data) {
        if (+data.err_code === 0) {
          q+=1;
          if (q < this.listaIncExc.length) {
            this.chiamaIncExc(nomeActSet, Come, q);
          } else {
            this.vecchioParamsAct = '';
            this.LeggeActivities2();
          }
          this.refreshExclIncl = true;
        } else {
          ExternalUtilities.visualizzaAlert(data.failure_reason);
        }
      }
    });
  }

  ridisegnaGraficiF(e) {
    this.ridisegnaGrafici = e;
  }

  /* static scriveLog(Cosa, P1?, P2?, P3?, P4?, P5?) {
    if (AppComponent.modalitaDebug === true) {
      if (P1 && P2 && P3 && P4 && P5) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'APP: ' + Cosa, P1, P2, P3, P4, P5);
      } else {
        if (P1 && P2 && P3 && P4 && !P5) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'APP: ' + Cosa, P1, P2, P3, P4);
        } else {
          if (P1 && P2 && P3 && !P4 && !P5) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'APP: ' + Cosa, P1, P2, P3);
          } else {
            if (P1 && P2 && !P3 && !P4 && !P5) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'APP: ' + Cosa, P1, P2,);
            } else {
              if (P1 && !P2 && !P3 && !P4 && !P5) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'APP: ' + Cosa, P1);
              } else {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'APP: ' + Cosa);
              }  
            }
          }
        }
      }
    }
  } */

  rigaSelezionataAntenne;
  selezioneAntenne = new Array();

  caricaTabellaAntenne() {
    const nomeTabella = 'geo_lookup__grid';
    const params = {
      cntx_id: this.sessioneID,
      v_category: 'antenna_set_name'
    };

    this.rigaSelezionataAntenne = null;

    // this.caricamentoDatiInCorsoAntenne = true;
    // this.datiGrigliaAntenne = 'empty grid'; // null;
    this.apiService.chiamataPost(this.Utilities, '' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data = JSON.parse(data2);
      // this.caricamentoDatiInCorsoAntenne = false;
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(Utils, data2);

        // // this.Utils.scriveLog(data);
        if (this.datiGrigliaAntenne && this.datiGrigliaAntenne !== 'empty grid' && data2.DataTable) {
          if (data2.DataTable.length > 0) {
            this.datiGrigliaAntenne.DataTable = data2.DataTable;
          } else {
            this.datiGrigliaAntenne = 'empty grid';
          }
        } else {
          // this.datiGrigliaAntenne = 'empty grid'; // null;
          this.datiGrigliaAntenne = JSON.parse(JSON.stringify(data2));

          const tm = setTimeout(() => {
            clearTimeout(tm);

            const selA = localStorage.getItem(this.userName + '_SelAntenne_GA');
            if (selA != null) {
              this.selezioneAntenne = new Array();
              this.selezioneAntenne.push(selA);
              // // logConsole('Dati ga: ', this.datiGrigliaAntenne, this.selezioneAntenne);
              // alert('Letto: ' + this.selezioneAntenne);
            }      
          }, 1000);
        }
      } else {
        this.datiGrigliaAntenne = 'empty grid'; // null;
      }
    }, error => {
      // this.caricamentoDatiInCorsoAntenne = false;
      this.datiGrigliaAntenne = 'empty grid'; // null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  clickSelezioneAntenne(e) {
    // // this.Utils.scriveLog(e);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione cellset', e[0]);
    this.rigaSelezionataAntenne = e[0];
    this.cellSet = e[0].VALUE_STR;
    this.cellSetRow = [e[0].ROW_ID];
    this.selezioneAntenne = e[0].ROW_ID;
    localStorage.setItem(this.userName + '_SelAntenne_GA', e[0].ROW_ID);
    // alert(this.selezioneAntenne);
    // alert('Id antenne: ' + this.cellSetRow);
  }

  lastSelectedOfGridAntenne(e) {
    if (e) {
      if (this.datiGrigliaAntenne && this.datiGrigliaAntenne !== null && this.datiGrigliaAntenne !== 'empty grid') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati griglia antenne', this.datiGrigliaAntenne);
        this.datiGrigliaAntenne.DataTable.forEach(element => {
          if (element.VALUE_STR === e) {
            this.rigaSelezionataAntenne = e;
            this.selezioneAntenne = [e.ROW_ID];
          }
        });
      }
    }
  }

  refreshGrid1Antenne(e, r) {
    this.caricaTabellaAntenne();
  }

  listaEventiSEArrivata;

  aggiornataListaEventiSE(e) {
    this.listaEventiSEArrivata = e;
  }

  // arrayPerReport;

  apreReportXls() {
    // this.posizioneFinestraReport = 10;

    const act_set = ExternalUtilities.prendeActivitySceltaGrafici(this, this.Utils);
    const array2 = new Array();
        
    // if (this.exportOnlyDisplayedMeasures === true) {
      /* this.Measure.forEach(element => {
        if (element && element !== '') {
          array2.push(element);
        }
      }); */

      /* this.Measure.forEach(element => {
        if (element && element !== '') {
          if (element === 'global_measure' && element.indexOf('global_measure_') === -1) {
            if (this.Utils.globalMeasure) {
              this.measureData2.forEach(element2 => {
                if (element2.CODE === this.Utils.globalMeasure.MEASR_CODE) {
                  array2.push(element2.CODE.replace('"', '').replace('"', ''));
                }
              })
            }
          } else {
            if (element.indexOf('global_measure_') > -1) {
              const indice = +(element.replace('global_measure_', ''));
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Indicie: ', indice, ExternalUtilities.misureGlobali)
              if (indice && indice > 0) {
                if (ExternalUtilities.misureGlobali[indice - 1] !== '') {
                  array2.push(ExternalUtilities.misureGlobali[indice - 1]);
                }
              }
            } else {
              array2.push(element);
            }
          }
        }
      });
    } else {
      array2.push('ALL');
    }
    this.arrayPerReport = array2;

    this.reportXls = true; */
  }

  syncAttivo = false;
  // posizioneFinestraReport = 10;

  gestisceSyncAttivo(e) {
    this.syncAttivo = e;
  }

  chiudeReportXLS() {
    /* if (!this.syncAttivo) {
      // this.reportXls = false;
    } else {
      this.posizioneFinestraReport = 150;
    } */
  }

  ritornaNomeApp(c) {
    const campi = c.split(';');
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Passaggio a progetto ' + campi[0] + ', maschera: ' + campi[1]);

    let dove = '';
    switch (campi[0]) {
      case 'DD':
        dove = 'DataDictionaries';
        break;
      case 'FM':
        dove = 'FleetManager';
        break;
      case 'SY':
        dove = 'System';
        break;
      case 'UM':
        dove = 'UserManager';
        break;
      case 'Mappe':
        dove = 'Mappe';
        break;
      case 'Home':
        dove = 'HomePage';
        break;
      case 'SS':
        dove = 'SpreadSheet';
        break;
      case 'A1':
        dove = 'Ants';
        break;
    }

    let funzione = '';
    switch (campi[1]) {
      case 'Mappe':
        funzione = 'Home';
        break;
      case 'TC':
        funzione = 'Test Campaigns';
        break;
      case 'AGD':
        funzione = 'Agent Group Definition';
        break;
      case 'AGC':
        funzione = 'Agent Group Configuration';
        break;
      case 'AGPL':
        funzione = 'Agent Profiles Library';
        break;
      case 'QPL':
        funzione = 'QueryPCK Library';
        break;
      case 'TDL':
        funzione = 'Test Design Library';
        break;
      case 'DTUM':
        funzione = 'Drive Test Units Mng';
        break;
      case 'SAM':
        funzione = 'Single Agent Mode';
        break;
      case 'Antenna':
        funzione = 'Antenna';
        break;
      case 'Cluster':
        funzione = 'Cluster';
        break;
      case 'PLMN':
        funzione = 'PLMN';
        break;
      case 'Users':
        funzione = 'Users';
        break;
      case 'Groups':
        funzione = 'User Groups';
        break;
      case 'UP':
        funzione = 'User Profiles';
        break;
      case 'SC':
        funzione = 'System Configuration';
        break;
      case 'EV':
        funzione = 'Event Viewer';
        break;
      case 'SM':
        funzione = 'System Monitor';
        break;
      case 'AV':
        funzione = 'Alarm Viewer';
        break;
      case 'ETLM':
        funzione = 'Activities Loading Monitor';
        break;
      case 'DBO':
        funzione = 'DB Ojects';
        break;
      case 'SESS':
        funzione = 'Session Monitor';
        break;
      case 'SS':
        dove = 'Spread Sheet';
        break;
      case 'SIM':
        funzione = 'SIM Management';
        break;
    }

    const cc = new Array();
    cc.push(dove);
    cc.push(funzione);
    cc.push(campi[0]);
    cc.push(campi[1]);

    return cc;
  }

  cripta(s) {
    const x = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Stringa:', s);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Codice random:', x);
    let rit = x + ';';
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rit 1:', rit);
    for (let i = 0; i < s.length; i++) {
      let a = s.charCodeAt(i);
      a += (x + i);
      rit += a +';';
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rit ' + i + ':', rit);
    }
    for (let i = 0; i <= 5; i++) {
      const x = Math.floor(Math.random() * (255 - 1 + 1)) + 1;
      rit += x +';';
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rit ' + (i + 100) + ':', rit);
    }
    rit += s.length + ';';

    return rit;
  }

  apreWorkspace() {    
    this.changePage('Mappe;Mappe', this.nomeWorkSpace, true);
    return;
    
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Copia nome act:', this.activitySetName[1], this.activitySet[1]);
    // return;

    const nuovoNome = 'temp [' + this.operatorID + ']';

    let start = this.timeRangeDSFStart;
    let stop = this.timeRangeDSFStop;
    const activitySetName = this.activitySetName[1]['NAME'];

    if (start !== null ) { start = '"' + start + '"'; }
    if (stop !== null ) { stop = '"' + stop + '"'; }

    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_obj_type": "geo_analysis",' +
      '"v_obj_name": "' + nuovoNome + '",' +
      '"v_obj_name_new": "' + nuovoNome + '_bck",' +
      '"v_activityset_name": "' + activitySetName + '",' +
      // '"v_activityset_act_set_type": "' + '' + '",' +
      '"v_timerangedsfstart": ' + start + ',' +
      '"v_timerangedsfstop": ' + stop + '' +
    '}';
    // return;

    this.apiService.chiamataPost(this.Utilities, 'operator_obj_my__copy', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if (data) {
        localStorage.removeItem('lastWorkspace');
        this.changePage('Mappe;Mappe', nuovoNome, true);
      }
    });
  }

  changePage(url, altro, newPage) {
    const campiOrig = url.split(';');
    const campi = this.ritornaNomeApp(url);

    let ancora = '';
    if (altro && altro !== '') {
      ancora = ',"altro": "' + altro + '"'
    }

    const passaggio = '{ ' +
      '"sess": "' + this.sessioneID + '", ' +
      '"gname": "' + this.groupName + '", ' +
      '"uname": "' + this.userName + '", ' +
      '"form": "' + campi[3] + '", ' +
      '"FS": "false"' +
      ancora +
    '}';
    const pass = this.cripta(passaggio);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, passaggio);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, pass);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, UtilsInterna.decripta(pass));
    // return;

    let addr = this.Utils.urlRoot;

    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      addr = 'http://localhost:2727';
      // addr = 'https://geoants-pre.ants-aubay.it/geoantsweb/Mappe';
      campi[0] = '';
    } else {
      if (!addr.endsWith('/')) {
        addr += '/';
      }
      if (addr.indexOf('geoantsweb/') === -1) {
        addr += 'geoantsweb/';
      }
    }

    /* let add = 'geoantsweb';

    switch (this.Utilities.pre) {
      case "true":
        add = 'geoantsweb_pre'
        break;
      case "false":
        add = 'geoantsweb_prod'
        break;
      default:
        break;
    }

    if (addr.indexOf('geoantsweb') > -1 && add.indexOf(add) === -1) {
      addr = addr.replace('geoantsweb', add);
    }
    addr = addr.replace('_pre_pre', '_pre');
    addr = addr.replace('_prod_prod', '_prod'); */

    alert('Passaggio 2: ' + addr + campi[0]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, addr + campi[0] + '/?par=' + pass); // sess=' + this.sessionID2 +
                                                        // '&gname=' + this.operatorGroupName +
                                                        // '&uname=' + this.userName +
                                                        // '&form=' + campiOrig[1] +
                                                        // '&FS=' + this.fullScreen);
    const doveURL = addr + campi[0] + '/?par=' + pass; // + '/?sess=' + this.sessionID2 +
                                      //                   '&gname=' + this.operatorGroupName +
                                      //                   '&uname=' + this.userName +
                                      //                   '&form=' + campiOrig[1] +
                                      //                   '&FS=' + this.fullScreen;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, doveURL);
    // return;
    // window.location.href = doveURL;
    // const ww = window.open(doveURL, '_blank');
    if (newPage) {
      const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, url2);
      const ww = window.open(doveURL, '_blank');
    } else {
      location.assign(doveURL);
    }
  }

  refreshMeasureDFN(r) {
    if (r === true) {
      this.datiPointMeasureDFN = undefined;
    }
    this.lastCallMeasureDFN = '';
    this.disegnaMeasureDFN();
  }

  refreshEventSummary(r) {
    if (r === true) {
      this.datiEventSummary = undefined;
    }
    this.lastCallES = '';
    this.disegnaEventi2();    
  }

  apreTimeRange() {
    this.impostaNonChiudere2(true);
    this.bCambioTimeRange = true;    
  }

  clickSuContenitore() {
    if (this.platform.ANDROID) {
      this.menuVisibile = false;
      this.menuVisibile2 = false;
    }
  }

  checkEditMode(e) {
    this.editMode = e.srcElement.checked;
    // if (this.editMode === true) {
    //   this.isVisibileBars = false;
    // }
    // logConsole('Click su edit mode', this.editMode);
    this.generaDatiPageSelectorFiltrati(this.impostazioni.datiPageSelector, 'CheckEdit');
  }

  menuAperti = false;

  apreTuttiIMenu() {
    if (!this.isVisibileBars) {
      this.menuAperti = true;
    }
  }

  chiudeTuttiIMenu() {
    if (!this.isVisibileBars) {
      this.menuAperti = false;
    }
  }

  file: File | null = null;
  nomeFile = '';
  nomeFile2 = '';
  estensione = '';
  folderFile = '';
  descriptionFile = '';

  apreUploadReport() {
    this.impostaNonChiudere2(true); 
    this.file = undefined;
    this.bUploadReport = true;
    this.nomeFile = '';
    this.folderFile = '';
    this.nomeFile2 = '';
    this.estensione = '';
    this.descriptionFile = '';
  }

  onSelectFile(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.name.toUpperCase().indexOf('.PBIX') === -1 && file.name.toUpperCase().indexOf('.XLSB') === -1
        && file.name.toUpperCase().indexOf('.XML') === -1 && file.name.toUpperCase().indexOf('.DOCX') === -1
        && file.name.toUpperCase().indexOf('.PPTX') === -1) {
        ExternalUtilities.visualizzaAlert('Not a valid file');

        return;
      }

      this.file = file;
      this.nomeFile = file.name;
      this.nomeFile2 = file.name;
      for (let i = this.nomeFile2.length - 1; i > 0; i--) {
        if (this.nomeFile2.substring(i, i + 1) === '.') {
          this.estensione = '.' + this.nomeFile2.substring(i + 1, this.nomeFile2.length);
          this.nomeFile2 = this.nomeFile2.substring(0, i);
          break;
        }
      }

      // this.onUpload();
    }
  }

  onUpload() {
    if (!this.nomeFile2 || this.nomeFile2.length === 0) {
      ExternalUtilities.visualizzaAlert('Insert a file name');

      return;
    }
    if (this.nomeFile2.length > 49) {
      ExternalUtilities.visualizzaAlert('File name too long');

      return;
    }

    let v_config = '';
    let idDashboard = 'null';

    if (this.estensione.toUpperCase().trim() === '.DOCX') {
      idDashboard = this.dashboardSelected['ID'];

      v_config = '{';
      // v_config += '"DashboardName": "' + this.dashboardSelected['NAME'] + '", ';
      v_config += '"PageList": [';

      const selezionate = this.listToPrint.impostaSelezioneLTP;
      /* // logConsole('v_config selezionate', selezionate);

      this.listToPrint.DataTable.forEach(element => {
        const ROW_ID = element.ROW_ID;
        const pagina = element.pagina;
        // logConsole('v_config controllo selezionata', ROW_ID, selezionate, selezionate[ROW_ID]);
        const selezionata = (selezionate[ROW_ID] ? true : false);

        v_config += '{';
        v_config += '"Page": ' + pagina + ',';
        v_config += '"Selected": ' + selezionata;
        v_config += '},';
      }); */
      selezionate.forEach(element => {
        v_config += element.toString() + ',';
      });
      v_config = v_config.substring(0, v_config.length - 1);
      v_config += ']';
      v_config += '}';
    }
    // // logConsole('v_config', v_config);
    // return;

    const reader = new FileReader();
    reader.onloadend = () => {
      let base64String = reader.result as string;
      if (base64String.indexOf('base64') >= 0) {
        const b = base64String.split('base64');
        base64String = b[1].substring(1, b[1].length);
      }

      const params = '{' +
        '"v_cntx": "' + this.sessioneID + '",' +
        '"v_name": "' + this.nomeFile2 + this.estensione + '",' +
        '"v_folder": "' + this.folderFile + '",' +
        '"v_description": "' + this.descriptionFile + '",' +
        '"v_file_content_bytea": "' + base64String + '",' +
        '"v_dashboard_id": ' + idDashboard + ',' +
        '"v_config": "' + v_config + '"' +
      '}';
      this.apiService.chiamataPost(this.Utilities, 'report__ins', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        if (data2 && data2 !== null) {
          // alert('data2.v_err_code: ' + data2[0].v_err_code);
          if (+data2[0].v_err_code !== 0) {
            const rr = data2[0].v_failure_reason;
            ExternalUtilities.visualizzaAlert(rr);
          } else {
            ExternalUtilities.visualizzaAlert('Report uploaded');
            this.aggiornaGrigliaReport = new Date().toString();

            this.bUploadReport = false;
            this.impostaNonChiudere2(false);
          }
        }
      }, error => {
        ExternalUtilities.messaggioDiErroreEsterno(this, 'Read look up:' + error);
      });      
    }
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
  }

  listToPrint;
  effettuaAutoFitLTP;
  rigaSelezionataLTP;
  bMascheraLTP = false;
  descriptionLTP;
  imageNameLTP;
  titoloScreenShot;
  descrizioneScreenShot;
  dettaglioScreenShot;

  premutoTastoEditLTP(e) {
    if (!this.rigaSelezionataLTP) {
      Swal.fire({
        title: 'Warning',
        text: 'Please, select a row first',
        icon: 'warning',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      })
    } else {
      this.impostaNonChiudere2(true);
      this.modalitaMascheraLTP = 'UPDATE';
      this.bMascheraLTP = true;
      this.descriptionLTP = this.rigaSelezionataLTP.description;
      this.imageNameLTP = this.rigaSelezionataLTP.imageName;
      // // logConsole(this.rigaSelezionataLTP);
    }
  }

  clickRigaLTP(dati) {
    this.rigaSelezionataLTP = dati;

    // const dati = e;
    const pagina = dati.pagina;

    this.selezioneAntenne = dati.selezioneAntenne;
    this.additionalLayer2 = dati.additionalLayer2;
    this.setNetTech = dati.setNetTech;
    this.netTech22 = dati.netTech22;
    this.bandwidth22 = dati.bandwidth22;
    this.ch2 = dati.ch2;
    this.bsic2 = dati.bsic2;
    this.scr2 = dati.scr2;
    this.pci2 = dati.pci2;
    this.territory2 = dati.territory2;
    this.freeText2 = dati.freeText2;

    if (dati.misureGlobaliImpostate) {
      this.impostazioni.misureGlobaliImpostate = JSON.parse(JSON.stringify(dati.misureGlobaliImpostate));
      this.misureComboLTP = JSON.parse(JSON.stringify(dati.misureGlobaliImpostate));
      this.ridisegnaMappa = JSON.parse(JSON.stringify(dati.misureGlobaliImpostate));
      // // logConsole('Misure impostate LPT', this.misureComboLPT);
    }
    // this.impostaSelezioneMeasureDFN = dati.impostaSelezioneMeasureDFN;
    this.Utilities.globalMeasure = dati.impostaSelezioneMeasureDFN
    // alert('Misura: ' + this.Utilities.globalMeasure);
    this.cambioGlobalMeasure(this.Utilities.globalMeasure);

    // this.impostaSelezioneES = dati.impostaSelezioneES;
    const ee = { dati: dati.impostaSelezioneES, selezionato: dati.impostaSelezioneES, deselezionato: dati.impostaSelezioneES };
    this.gestisceClickSummary(ee);

    this.mapTypeG = dati.mapTypeG;
    this.mapTypeS = dati.mapTypeS;
    this.styleSizeG = dati.styleSizeG;
    this.slaValueGlobale = dati.slaValueGlobale;
    this.overlayClusterG = dati.overlayClusterG;
    this.zoomMap = dati.zoomMap;
    this.comboSelArea = dati.comboSelArea;
    this.showLegendaHistogram = dati.showLegendaHistogram;
    this.tipoLegendaIstogrammi = dati.tipoLegendaIstogrammi;
    this.impostazioni.framesAttivi[this.pageSelector] = dati.framesAttivi;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Riga selezionata LTP: Cambio pagina', pagina, dati);

    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.impostazioni.datiPageSelector.DataTable.forEach(element => {
          if (+element.id === +pagina) {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pagina selezionata per nome', element);
            let nome = element.value;
            nome = nome.replace(element.id + ': ', '');
            this.nomePaginaSelezionata = nome;
            this.selectPageSelector([element]);

            if (this.bbox) {
              const tm = setTimeout(() => {
                clearTimeout(tm);

                this.bbox = JSON.parse(JSON.stringify(this.bbox));
              }, 1000);
            }
          }
      });
    }, 1000);

    // // logConsole('Riga selezionata LTP', e);
  }

  salvaLTP() {
    if (this.modalitaMascheraLTP === 'INSERT') {
      this.addToPrintList2();
    } else {
      let ok = false;
      this.listToPrint.DataTable.forEach(element => {
        if (element.imageName === this.imageNameLTP && element.ROW_ID !== this.rigaSelezionataLTP.ROW_ID) {
          ok = true;
        }
      });
      if (ok) {
        const messaggio = 'Image Name already exists';
        Swal.fire({
          title: 'Warning',
          text: messaggio,
          icon: 'warning',
          showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
          },
        });

        return;
      }

      ok = false;
      this.listToPrint.DataTable.forEach(element => {
        if (element.ROW_ID === this.rigaSelezionataLTP.ROW_ID) {
          if (element.imageName) {
            if (element.imageName.toUpperCase().trim() !== this.imageNameLTP.toUpperCase().trim()) {
              ok = true;
            }
          }
        }
      });

      if (ok) {
        const messaggio = 'If you change the name, you need to modify Report Template referencing it';
        Swal.fire({
          title: '',
          text: messaggio,
          icon: 'warning',
          background: '#9f1f1f',
          color: '#fbf7f7',
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancel',
          showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
          },
        }).then((result) => {
          if (result.value) {
            this.salvaLTP2();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });  
      } else {
        this.salvaLTP2();
      }
    }
  }

  salvaLTP2() {
    this.listToPrint.DataTable.forEach(element => {
      if (element.ROW_ID === this.rigaSelezionataLTP.ROW_ID) {
        element.description = this.descriptionLTP;
        element.imageName = this.imageNameLTP;
      }
    });
    this.listToPrint.DataTable = JSON.parse(JSON.stringify(this.listToPrint.DataTable));
    this.descriptionLTP = undefined;
    this.impostaNonChiudere2(false);
    this.bMascheraLTP = false;
    this.rigaSelezionataLTP = undefined;
  }

  moveFirstLTP() {
    const lista = new Array();
    lista.push(this.rigaSelezionataLTP);
    this.listToPrint.DataTable.forEach(element => {
      if (element.ROW_ID !== this.rigaSelezionataLTP.ROW_ID) {
        lista.push(element);
      }
    });
    this.listToPrint.DataTable = JSON.parse(JSON.stringify(lista));
  }

  moveUpLTP() {
    const lista = JSON.parse(JSON.stringify(this.listToPrint.DataTable));
    let ok = false;
    let qualeRiga = 0;
    // // logConsole('Riga selezionata', this.rigaSelezionataLTP);
    lista.forEach(element => {
      if (!ok) {
        if (element.ROW_ID !== this.rigaSelezionataLTP.ROW_ID) {
          qualeRiga++;
        } else {
          ok = true;
        }
      } 
    });
    // // logConsole('Numero Riga selezionata', qualeRiga);
    if (qualeRiga > 0) {
      const riga1 = JSON.parse(JSON.stringify(lista[qualeRiga - 1]));
      const riga2 = JSON.parse(JSON.stringify(lista[qualeRiga]));
      // // logConsole('Riga 1', riga1);
      // // logConsole('Riga 2', riga2);
      if (riga1 && riga2) {
        lista[qualeRiga] = JSON.parse(JSON.stringify(riga1));
        lista[qualeRiga - 1] = JSON.parse(JSON.stringify(riga2));
        this.listToPrint.DataTable = JSON.parse(JSON.stringify(lista));
      }
    }
  }

  moveDownLTP() {
    const lista = JSON.parse(JSON.stringify(this.listToPrint.DataTable));
    let ok = false;
    let qualeRiga = 0;
    // // logConsole('Riga selezionata', this.rigaSelezionataLTP);
    lista.forEach(element => {
      if (!ok) {
        if (element.ROW_ID !== this.rigaSelezionataLTP.ROW_ID) {
          qualeRiga++;
        } else {
          ok = true;
        }
      } 
    });
    // // logConsole('Numero Riga selezionata', qualeRiga);
    if (qualeRiga < lista.length - 1) {
      const riga1 = JSON.parse(JSON.stringify(lista[qualeRiga]));
      const riga2 = JSON.parse(JSON.stringify(lista[qualeRiga + 1]));
      // // logConsole('Riga 1', riga1);
      // // logConsole('Riga 2', riga2);
      if (riga1 && riga2) {
        lista[qualeRiga] = JSON.parse(JSON.stringify(riga2));
        lista[qualeRiga + 1] = JSON.parse(JSON.stringify(riga1));
        this.listToPrint.DataTable = JSON.parse(JSON.stringify(lista));
      }
    }
  }

  moveLastLTP() {
    const lista = new Array();
    this.listToPrint.DataTable.forEach(element => {
      if (element.ROW_ID !== this.rigaSelezionataLTP.ROW_ID) {
        lista.push(element);
      }
    });
    lista.push(this.rigaSelezionataLTP);
    this.listToPrint.DataTable = JSON.parse(JSON.stringify(lista));
  }

  sistemaNomePaginaLTP(t) {
    let tt = t;
    const array = ['>', '<'];
    array.forEach(element => {
      while(tt.indexOf(element) > -1) {
        tt = tt.replace(element, ' ');
      }
    });

    return tt;
  }

  sistemaNomeImmagineLTP(t) {
    let tt = t;
    const array = ['>', '<', '?', '#', '|', '\\', '/', '*', '%'];
    array.forEach(element => {
      while(tt.indexOf(element) > -1) {
        tt = tt.replace(element, ' ');
      }
    });

    return tt;
  }

  modalitaMascheraLTP = '';
  nomePaginaLTP = '';

  addToPrintList() {
    let nomePagina = '';
    let nomeImmagine = '';
    this.impostazioni.datiPageSelector.DataTable.forEach(element => {
      if (+element.id === +this.pageSelector) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pagina selezionata per nome', element);
        let nome = element.value;
        nome = nome.replace(element.id + ': ', '');
        nomePagina = nome;
      }
    });

    let quale;
    if (this.listToPrint && this.listToPrint.DataTable) {
      quale = this.listToPrint.DataTable.length + 1;
    } else {
      quale = 1;
    }
    // // logConsole('quale', quale, quale.length);
    if (quale.toString().trim().length === 1) { quale = '0' + quale; }

    this.nomePaginaLTP = this.sistemaNomePaginaLTP(nomePagina);
    nomeImmagine = this.sistemaNomeImmagineLTP(nomePagina);
    this.modalitaMascheraLTP = 'INSERT';

    this.impostaNonChiudere2(true);
    this.bMascheraLTP = true;
    this.descriptionLTP = ''; // this.rigaSelezionataLTP.description;
    this.imageNameLTP = nomeImmagine; // this.rigaSelezionataLTP.imageName;
  }

  addToPrintList2() {
    let fitta = false;

    if (!this.listToPrint) {
      fitta = true;

      this.listToPrint = {
        ColumnProperty: [{
          dataType: "string",
          headerText: "ROW_ID",
          hide: "true",
          hide_is_editable: "Y",
          key: "ROW_ID",
          place: "01"
        },
        {
          dataType: "string",
          headerText: "Image Name",
          hide: "false",
          hide_is_editable: "Y",
          key: "imageName",
          place: "04"
        },
        {
          dataType: "string",
          headerText: "Dashboard Page",
          hide: "false",
          hide_is_editable: "Y",
          key: "pagename",
          place: "02"
        },
        {
          dataType: "string",
          headerText: "Description",
          hide: "false",
          hide_is_editable: "Y",
          key: "description",
          place: "03"
        }
        ],
        DataTable: new Array(),
        GridProperty: [{
          GridName: "listToPrint",
          IsFilterDisplayed: "N",
          ItemsPerPage: "300",
          ShowColumnSelector: "true",
          configured_by_user: "N",
          pageable: "false",
          reportType: "Rep",
          view_name: "VIEW_GEO_ACT2"
        }],
        impostaSelezioneLTP: new Array()
      }
    }

    let max = 0;

    this.listToPrint.DataTable.forEach(element => {
      const id = element.ROW_ID;
      if (+id > +max) {
        max = id;
      }
    });
    max++;
    
    const dati = {
      ROW_ID: max,
      pagina: this.pageSelector,
      pagename: this.nomePaginaLTP,
      description: this.descriptionLTP,
      imageName: this.imageNameLTP,
      selezioneAntenne: this.selezioneAntenne,
      additionalLayer2: this.additionalLayer2,
      setNetTech: this.setNetTech,
      netTech22: this.netTech22,
      bandwidth22: this.bandwidth22,
      ch2: this.ch2,
      bsic2: this.bsic2,
      scr2: this.scr2,
      pci2: this.pci2,
      territory2: this.territory2,
      freeText2: this.freeText2,
      impostaSelezioneMeasureDFN: this.Utilities.globalMeasure, // this.impostaSelezioneMeasureDFN,
      misureGlobaliImpostate: this.impostazioni.misureGlobaliImpostate,
      impostaSelezioneES: this.impostaSelezioneES,      
      mapTypeG: this.mapTypeG,
      mapTypeS: this.mapTypeS,
      styleSizeG: this.styleSizeG,
      slaValueGlobale: this.slaValueGlobale,
      overlayClusterG: this.overlayClusterG,
      zoomMap: this.zoomMap,
      comboSelArea: this.comboSelArea,
      showLegendaHistogram: this.showLegendaHistogram,
      tipoLegendaIstogrammi: this.tipoLegendaIstogrammi,
      framesAttivi: this.impostazioni.framesAttivi[this.pageSelector]
    }
    this.listToPrint.impostaSelezioneLTP.push(max);
    this.listToPrint.DataTable.push(dati);
    this.listToPrint.DataTable = JSON.parse(JSON.stringify(this.listToPrint.DataTable));
    this.listToPrint.impostaSelezioneLTP = JSON.parse(JSON.stringify(this.listToPrint.impostaSelezioneLTP));
    // logConsole('Dati LTP', this.listToPrint.DataTable);
    if (fitta) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.effettuaAutoFitLTP = !this.effettuaAutoFitLTP;
      }, 100);
    }

    this.bMascheraLTP = false;

    this.impostaNonChiudere2(false);

    this.impostazioni.listToPrint = this.listToPrint;
    this.checkDifferenceFromStartJSON();
  }

  riempieArraySelezioneLTP(e) {
    // // logConsole(e);
    const n = new Array();
    if (e.dati) {
      e.dati.forEach(element => {
        n.push(element.ROW_ID);
      });
    }
    this.listToPrint.impostaSelezioneLTP = JSON.parse(JSON.stringify(n));
  }

  deselezionateTutteLeRigheLTP(e) {
    this.listToPrint.impostaSelezioneLTP = new Array();
    this.listToPrint.impostaSelezioneLTP = JSON.parse(JSON.stringify(this.listToPrint.impostaSelezioneLTP));
  }

  selezionateTutteLeRigheLTP(e) {
    const n = new Array();
    this.listToPrint.DataTable.forEach(element => {
      n.push(element.ROW_ID);
    });
    this.listToPrint.impostaSelezioneLTP = JSON.parse(JSON.stringify(n));
  }
  
  /* premutoTastoDeleteLTP(e) {
    const grigliaDaPassare = JSON.parse(JSON.stringify(this.listToPrint));
    const righe = new Array();
    this.listToPrint.DataTable.forEach(element => {
      if (e === element.ROW_ID) {
        righe.push(element);
      }
    });
    grigliaDaPassare.DataTable = righe;
    this.datiGrigliaCheck = JSON.parse(JSON.stringify(grigliaDaPassare));
    this.modalitaCheckPopup = 'delete_ltp';
    this.operazioneCheckPopup = 'Delete';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  } */

  premutoTastoDeleteLTP(e) {
    logConsole('Elimino riga print list', this.rigaSelezionataLTP);

    const n = new Array();
    this.listToPrint.DataTable.forEach(element => {
      if (element.ROW_ID !== this.rigaSelezionataLTP.ROW_ID) {
        n.push(element);
      }
    });
    this.listToPrint.DataTable = JSON.parse(JSON.stringify(n));

    const n2 = new Array();
    this.listToPrint.impostaSelezioneLTP.forEach(element => {
      if (element !== this.rigaSelezionataLTP.ROW_ID) {
        n2.push(element);
      }
    });
    this.listToPrint.impostaSelezioneLTP = JSON.parse(JSON.stringify(n2));

    logConsole('Elimino riga print list', this.listToPrint);
  }

  userManualPrint = false;

  fDownloadUserManual(e) {
    this.userManualPrint = true;
    const params = {
      cntx_id: this.sessioneID,
      v_name: 'User Manual ITA.pdf'
    }
    this.apiService.chiamataPost(this.Utilities, 'report__download', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      let mimeType = 'application/octet-stream';
      const byteBuf = this.u_atob(data2); // atob(data);

      const data3 = new Blob([byteBuf], {type: mimeType});
      
      // this.fileSaver.save(data3, 'User Manual ITA.pdf');
      download(data3, 'User Manual ITA.pdf', mimeType);

      const tt = setTimeout(() => {
        clearTimeout(tt);
        
        this.userManualPrint = false;
      }, 3000);
    });
  }

  u_atob(ascii) {
    return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
  }

  clearPage() {
    // alert('Pagina da pulire: ' + this.pageSelector + '/' + this.pageSelector2);
    const messaggio = 'Do you want to empty this page ?';
    Swal.fire({
      title: '',
      text: messaggio,
      icon: 'warning',
      background: '#9f1f1f',
      color: '#fbf7f7',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    }).then((result) => {
      if (result.value) {
        // // logConsole('Empty. Pulisco pagina ' + this.pageSelector);
        for (let i = 1; i <= environment.quantiFrames; i++) {
          // // logConsole('Empty. Pulisco frame attivo: ' + this.pageSelector + ' pagina ' + i);
          // // logConsole('Azzero ', this.impostazioni.frameAttivo[i], i, this.impostazioni.MappaOGrafico, this.impostazioni.frameName);
          /* this.impostazioni.MappaOGrafico[this.pageSelector][i] = '--'; // this.pageSelector ??this.impostazioni.frameAttivo[i]
          this.impostazioni.frameName[i][this.pageSelector] = '<empty>'; // this.pageSelector ?? al posto di frameattivo
          this.MappaOGraficoTutti[i][this.pageSelector] = '--'; */

          this.pulisceFrame(this.pageSelector, i);
        }

        // // logConsole('Mappa O Grafico tutti', this.MappaOGraficoTutti);
        
        let quale = -1;
        let riga = 0;
        this.datiPageSelectorFiltrati.DataTable.forEach(element => {
          if (quale === -1 && +element.id === +this.pageSelector) {
            quale = riga;
          }
          riga++;
        });
        
        // // logConsole('Empty. Quale riga 1: ', quale);

        const n = {
          OnlyName: "[hidden] empty",
          ROW_ID: this.pageSelector,
          description: "",
          id: this.pageSelector,
          value: this.pageSelector + ": [hidden] empty"
        }
        this.datiPageSelectorFiltrati.DataTable[quale] = n;
        const d = JSON.parse(JSON.stringify(this.datiPageSelectorFiltrati));
        this.datiPageSelectorFiltrati = undefined;

        quale = -1;
        riga = 0;
        this.impostazioni.datiPageSelector.DataTable.forEach(element => {
          if (quale === -1 && +element.id === +this.pageSelector) {
            quale = riga;
          }
          riga++;
        });
        
        // // logConsole('Empty. Quale riga 2: ', quale);

        this.nomePaginaSelezionata = 'Empty Page';
        this.impostazioni.datiPageSelector.DataTable[quale].value = this.pageSelector + ": [hidden] empty";
        this.impostazioni.datiPageSelector.DataTable[quale].OnlyName = "[hidden] empty";

        /* // logConsole('Empty. Pagina: ', this.pageSelector);
        // logConsole('Empty. Filtrati: ', this.datiPageSelectorFiltrati);
        // logConsole('Empty. Lista Page Selector', this.impostazioni.datiPageSelector); */

        /* const dd = JSON.parse(JSON.stringify(this.impostazioni.datiPageSelector));
        this.impostazioni.datiPageSelector.DataTable[quale] = n;
        this.impostazioni.datiPageSelector = undefined; */
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.datiPageSelectorFiltrati = JSON.parse(JSON.stringify(d));
          // this.impostazioni.datiPageSelector = JSON.parse(JSON.stringify(dd));

          this.gest_finestre.riposizionaMaschere(this);

        }, 500);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  refreshLTP() {
    this.listToPrint = JSON.parse(JSON.stringify(this.listToPrint));
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.effettuaAutoFitLTP = !this.effettuaAutoFitLTP;
    }, 500);
  }

  pulisceFrame(view, frame) {
    // const tm = setTimeout(() => {
      logConsole('Pulizia frame ' + frame + ' pagina ' + view, this.MappaOGraficoTutti);

      this.impostazioni.MappaOGrafico[view][frame] = '--'; // this.pageSelector ??this.impostazioni.frameAttivo[i]
      this.impostazioni.frameName[frame][view] = '<empty>'; // this.pageSelector ?? al posto di frameattivo
      
      if (!this.MappaOGraficoTutti) {
        const m = new Array();
        for (let n = 0; n <= environment.quantiFrames; n++) {
          m.push(undefined);
        }
        for (let n = 0; n <= environment.quantiFrames; n++) {
          const v = new Array();
          for (let i = 0; i <= environment.quantiSottoFrames; i++) {
            if (this.impostazioni.MappaOGrafico[i] && this.impostazioni.MappaOGrafico[i][n]) {
              v.push(this.impostazioni.MappaOGrafico[i][n]);
            } else {
              // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore non trovato', i, n);
              this.impostazioni.MappaOGrafico.push(new Array());
              for (let n2 = 0; n2 <= environment.quantiFrames; n2++) {
                this.impostazioni.MappaOGrafico[i].push('--');
              }
              v.push('--');
            }
          }
          m[n] = v;
        }
        this.MappaOGraficoTutti = m;
      }

      if (this.MappaOGraficoTutti[frame] && this.MappaOGraficoTutti[frame][view]) {
        this.MappaOGraficoTutti[frame][view] = '--';
      }

      this.impostazioni.frameDesc[view][frame] = '';
      this.impostazioni.tipoMappa[view][frame] = '';
      this.impostazioni.overviewZoom[view][frame] = undefined;
      this.impostazioni.mapType[view][frame] = 9999;
      this.impostazioni.isCheckedServingCell[view][frame] = true;
      this.impostazioni.isCheckedShowPaths[view][frame] = true;
      this.impostazioni.isCheckedShowSelectedPaths[view][frame] = true;
      this.impostazioni.isStandAloneMR[view][frame] = false;
      this.impostazioni.isCheckedAntenne[view][frame] = true;
      this.impostazioni.measure[view][frame] = ['', '', '', '', ''];
      // this.slaValue[view][frame] = app.slaValue;
      this.impostazioni.slaName[view][frame] = '';
      this.impostazioni.activity[view][frame] = '';
      this.impostazioni.plmn[view][frame] = '';
      this.impostazioni.netTech[view][frame] = true;
      this.impostazioni.bandwidth[view][frame] = true;
      this.impostazioni.countHistogram[view][frame] = true;
      this.impostazioni.checkSeverity[view][frame] = true;
      this.impostazioni.listaEventi[view][frame] = '';
      this.impostazioni.currZoom[view][frame] = undefined;
      this.impostazioni.viewAs[view][frame] = 2;
      this.impostazioni.overlay[view][frame] = '';
      this.impostazioni.overlayCluster[view][frame] = '<Global Cluster>';
      this.impostazioni.timeFilter[view][frame] = 2;
      this.impostazioni.bboxOZ[view][frame] = undefined;
      this.impostazioni.viewDefinition[view][frame] = '';
      // this.activityName[view][frame] = app.activityName;
      if (this.impostazioni.filtriEventi[view] && this.impostazioni.filtriEventi[view][frame]) {
        this.impostazioni.filtriEventi[view][frame] = undefined;
      }
    // this.viewOlL[view][frame] = app.viewOlL;
      // this.viewOlG[view][frame] = app.viewOlG;
      this.impostazioni.histDisplayAs[view][frame] = ['', '', '', '', '', ''];
      this.impostazioni.histDisplayTutto[view][frame] = ['', '', '', '', '', ''];
      this.impostazioni.columnsBars[view][frame] = '2';
      this.impostazioni.doubleGraph[view][frame] = false;
      this.impostazioni.listaCampiTCRP[view][frame] = undefined;
      this.impostazioni.dimensioniSplitTcRun[view][frame] = undefined;
      this.impostazioni.impostazioniPivotGrid[view][frame] = undefined;
      this.impostazioni.tipoDatiLayout[view][frame] = undefined;
      if (this.impostazioni.showAdditionalLayers && this.impostazioni.showAdditionalLayers[view] && this.impostazioni.showAdditionalLayers[view][frame]) {
        this.impostazioni.showAdditionalLayers[view][frame] = undefined;
      }
      if (this.impostazioni.flowTypeMS && this.impostazioni.flowTypeMS[view][frame] != undefined) {
        this.impostazioni.flowTypeMS[view][frame] = undefined;
      }
      if (this.impostazioni.viewModeMS && this.impostazioni.viewModeMS[view][frame] != undefined) {
        this.impostazioni.viewModeMS[view][frame] = undefined;
      }
      this.impostazioni.eventsMeasure[view][frame] = false;
      this.impostazioni.showPlanimetry[view][frame] = 'L';
      // this.impostazioni.columnsSettings[view][frame] = app.columnsSettings;
      this.impostazioni.tipoEvento[view][frame] = undefined;
      this.impostazioni.fixedSeconds[view][frame] = undefined;
      this.impostazioni.styleSize[view][frame] = 12;
      this.impostazioni.cellType[view][frame] = '';
      this.impostazioni.addLayers[view][frame] = '';
      this.impostazioni.opacity[view][frame] = '';
      this.impostazioni.shownEvents[view][frame] = undefined;
      this.impostazioni.modificaChart[view][frame] = true;
      this.impostazioni.doNotSetGM[view][frame] = false;
      this.impostazioni.showRays[view][frame] = undefined;
      this.impostazioni.showMeasures[view][frame] = false;
      this.impostazioni.squareMeters[view][frame] = -1;
      this.impostazioni.measureType[view][frame] = 1;
      this.impostazioni.mosaicStyle[view][frame] = '';
      this.impostazioni.sartPosition[view][frame] = '';
      this.impostazioni.geoFilter[view][frame] = '';
      this.impostazioni.measureSMS[view][frame] = '';
      this.impostazioni.showMeasuresS[view][frame] = false;
      this.impostazioni.tipoDataset[view][frame] = 2;
      this.impostazioni.mappeMS[view][frame] = 1;
      this.impostazioni.clusterMeasure[view][frame] = '';
      this.impostazioni.clusterMeasure2[view][frame] = '';
      // this.impostazioni.lov[view][frame] = app.lov;
      this.impostazioni.textFilter[view][frame] = '';
      this.impostazioni.textFilter2[view][frame] = '';
      // this.impostazioni.textLov[view][frame] = app.textLov;
      this.impostazioni.addGlobalLayer[view][frame] = false;
      this.impostazioni.measureRCM[view][frame] = -1;
      this.impostazioni.showRaysAllLayer[view][frame] = true;
      this.impostazioni.correlation[view][frame] = '';
      this.impostazioni.isNonSyncEventTime[view][frame] = false;
      this.impostazioni.showAxisX[view][frame] = true;
      this.impostazioni.showVoiceCallMeasures[view][frame] = false;
      this.impostazioni.showDataMeasures[view][frame] = false;
      this.impostazioni.showCoverageMeasures[view][frame] = false;
    // }, 100);
  }

  refreshPerTcRunClickUguale() {
    for (let i = 1; i <= environment.quantiFrames; i++) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.refreshDaTasto[i] = !this.refreshDaTasto[i];
      }, 50 * i);
    }
    this.refreshExclIncl = false;
  }

  utilizzoMemoria = false;
  memoriaUsata = '';
  controlloMemoriaAttivo = false;
  tmrMemoria;

  avviaControlloMemoria() {
    if (typeof performance['memory'] !== 'undefined') {
      /* this.memoriaSupportata = true;
      this.memoriaUsata = performance.memory.usedJSHeap / 1024 / 1024; // In MB
      this.memoriaTotale = performance.memory.totalJSHeap / 1024 / 1024; // In MB
      this.memoriaDisponibile = this.memoriaTotale - this.memoriaUsata; */
      if (this.tmrMemoria) {
        clearInterval(this.tmrMemoria);
      }
      // Salvato nel campo: prima era una costante locale, quindi clearInterval(this.tmrMemoria) non lo fermava mai
      this.tmrMemoria = setInterval(() => {
        const valore = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        // // logConsole(performance.memory, valore);
        this.memoriaUsata = valore + ' MB';
      }, 5000);
    } else {
      // this.memoriaSupportata = false;  // Se l'API non è disponibile, impostiamo su false
      alert('Controllo memoria impossibile sul browser attuale');
    }
  }

  checkShowMemory(e) {
    this.utilizzoMemoria = !this.utilizzoMemoria;
  
    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (this.utilizzoMemoria) {
        this.avviaControlloMemoria();
      } else {
        if (this.tmrMemoria) {
          clearInterval(this.tmrMemoria);
        }
      }
    }, 100);
  }

  bboxDisegnataSullaMappa;
  
  boxDisegnataSuMappa(e) {
    this.bboxDisegnataSullaMappa = e;
  }

  showAddLayers(f, q, e) {
    if (!this.impostazioni.showAdditionalLayers) {
      this.impostazioni.showAdditionalLayers = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, false);
    }
    this.impostazioni.showAdditionalLayers[f][q] = e;
    // logConsole('Show add layers', f, q, e, this.impostazioni.showAdditionalLayers);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    // logConsole('tipoDati Layout', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  caricaLimitiDebug() {
    const l = localStorage.getItem('LimitDebug');
    if (l !== null) {
      this.limitaRighePerDebug = JSON.parse(l);
    } else {
      this.limitaRighePerDebug = {
        numeroRighe: -1,
        numeroCampi: -1,
        getOtherStyle: true,
        getCellStyle: true,
        eseguiAutoFit: true,
        controllaSelezione: true,
        allineamentiVari: true
      };
    }
    // logConsole('Limiti per debug', this.limitaRighePerDebug);
  }
  
  uscitaDebugGriglia() {
    const a = JSON.parse(JSON.stringify(this.limitaRighePerDebug));
    this.limitaRighePerDebug = undefined;
      
    const t = setTimeout(() => {
      clearTimeout(t);

      this.limitaRighePerDebug = a;
      localStorage.setItem('LimitDebug', JSON.stringify(this.limitaRighePerDebug));

      // logConsole('Limiti per debug impostati', this.limitaRighePerDebug);

      let i = 0;
      this.refreshMap.forEach(element => {
        this.refreshMap[i] = !this.refreshMap[i];
        i++;
      });
    }, 100);
  }

  ritornoDimensioniColonneES(e) {
    ExternalUtilities.scriveDimensioniColonne('ES', e);
  }

  ritornoDimensioniColonnePS(e) {
    ExternalUtilities.scriveDimensioniColonne('PS', e);
  }

  ritornoDimensioniColonneLA(e) {
    ExternalUtilities.scriveDimensioniColonne('LA', e);
  }

  ritornoDimensioniColonneLTP(e) {
    ExternalUtilities.scriveDimensioniColonne('LTP', e);
  }

  ritornoDimensioniColonneAntenne(e) {
    ExternalUtilities.scriveDimensioniColonne('Antenne', e);
  }

  ritornoDimensioniColonneDFN(e) {
    ExternalUtilities.scriveDimensioniColonne('DFN', e);
  }  

  fCentroImpostato(e) {
    // logConsole('Centro impostato: ', e);
    this.centroImpostato = e;
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
    if (!this.staPartendo) {
      // logConsole('Cambio square meters globale', e);
      if (e) {
        if (typeof(e) === 'string' && e.indexOf('***') > -1) {
          const ee = e.replace('***', '');
          let ok = false;
          this.DatiSquareMeters.forEach(element => {
            if (element.CODE === ee) {
              ok = true;
            }
          });
          if (!ok) {
            const app = JSON.parse(JSON.stringify(this.DatiSquareMeters));
            app.push({ CODE: ee, DISPLAY_NAME: ee });
            app.sort((a, b) => (this.pad(a.DISPLAY_NAME, 10)).localeCompare(this.pad(b.DISPLAY_NAME, 10)));
            this.DatiSquareMeters = app;
            const tt = setTimeout(() => {
              clearTimeout(tt);

              this.squareMetersGlobale = ee;
            }, 100);
          }
        } else {
          if (e.DISPLAY_NAME) {
            this.squareMetersGlobale = e.DISPLAY_NAME;
          }
        }
      }
      localStorage.setItem('squareMeters', this.squareMetersGlobale);
      // alert('MS: ' + this.squareMetersGlobale);
    }
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

  misureChecekdGlobali;

  misureGlobaliEmit(e) {
    this.misureChecekdGlobali = e;
  }

  refreshTimeRangeToActSet() {
    const i = this.datePipe.transform(new Date(this.timeRangeDSFStart), 'yyyy-MM-dd HH:mm:ss.SSS')
    this.Utilities.tmsInizio = i;
    const f = this.datePipe.transform(new Date(this.timeRangeDSFStop), 'yyyy-MM-dd HH:mm:ss.SSS')
    this.Utilities.tmsFine = f;

    const rInizio = new Date(i.replace('T', ' ').replace('Z', ' ') + ' UTC+00');
    const rFine = new Date(f.replace('T', ' ').replace('Z', ' ') + ' UTC+00');

    if (rFine < rInizio) {
      return;
    }

    // this.Utilities.range = (rFine.getTime() - rInizio.getTime()) / 2; // 26/10
    const diff = (rFine.getTime() - rInizio.getTime()) / 2;
    const d = this.datePipe.transform(diff, 'yyyy-MM-dd HH:mm:ss.SSS')

    this.Utilities.tmsSelezionato = d;

    // logConsole(i, f, d);

    const tm = setTimeout(() => {
      clearTimeout(tm);

      ExternalUtilities.aggiornaTmsStringa(diff, this.Utilities, 'Imposta time range 2');
    }, 10);
  }

  mostraCopia = false;
  numeroPaginaDaCopiare;
  paginaDestinazionePerCopiaSpostamento;
  datiView;

  copyKeyPremutoPerPage(e) {
    logConsole('Copia pagina', e);

    this.datiView = new Array();
    for (let i = 1; i <= environment.quantiSottoFrames; i++) {
      if (i !== +e) {
        const r = { id: i, name: 'Page ' + i };
        this.datiView.push(r);
      }
    }

    this.numeroPaginaDaCopiare = e;
    this.paginaDestinazionePerCopiaSpostamento = undefined;
    this.mostraCopia = true;
  }

  selectView(e) {
    this.paginaDestinazionePerCopiaSpostamento = e.id;
  }

  spostaPagina(come) {
    logConsole('Operazione per pagina: ' + come + ' da ' + this.numeroPaginaDaCopiare + ' a ' + 
      this.paginaDestinazionePerCopiaSpostamento);
    // logConsole('Dati Page Selector', this.datiPageSelector, this.datiPageSelectorFiltrati);

    // Aggiustamento campi
    const m = new Array();
    for (let i = 0; i <= environment.quantiSottoFrames; i++) {
      m.push([33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34])
    }
    this.impostazioni.maskSize = this.aggiustaArray.SistemaDimensioni(this.impostazioni.maskSize, m);

    const d = {
      PrimaRiga: [33, 34, 33],
      SecondaRiga: [33, 34, 33],
      TerzaRiga: [33, 34, 33],
      Orizzontale: [33, 34, 33]
    };
    this.impostazioni.dimensioni = this.aggiustaArray.SistemaDimensioni(this.impostazioni.dimensioni, d);
    // Aggiustamento campi

    // logConsole(come + ' pagina da ', this.numeroPaginaDaCopiare, this.paginaDestinazionePerCopiaSpostamento);

    for (let i = 1; i <= environment.quantiFrames; i++) {
      let valori = this.appoggiaValori(this.numeroPaginaDaCopiare, i);
      // logConsole('Operazione di ' + come + ' per valori da frame ' + i + ' pagina ' + this.numeroPaginaDaCopiare + ' a frame ' + i + 
      //   ' della pagina ' + this.paginaDestinazionePerCopiaSpostamento + ': ', valori);
      const vistaDa = JSON.parse(JSON.stringify(valori));

      let vistaA;
      if (come === 'SWAP') {
        valori = this.appoggiaValori(this.paginaDestinazionePerCopiaSpostamento, i);
        vistaA = JSON.parse(JSON.stringify(valori));
      }

      this.spostaValori(vistaDa, this.paginaDestinazionePerCopiaSpostamento, i);

      if (come === 'SWAP') {
        this.spostaValori(vistaA, this.numeroPaginaDaCopiare, i);
      }
    }

    // logConsole('Dati Frames size prima', JSON.parse(JSON.stringify(this.impostazioni.maskSize)));
    // for (let i = 0; i < 10; i++) {
      const appo1 = JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.paginaDestinazionePerCopiaSpostamento]));
      this.impostazioni.maskSize[this.paginaDestinazionePerCopiaSpostamento] = JSON.parse(JSON.stringify(this.impostazioni.maskSize[this.numeroPaginaDaCopiare]));

      const appo21 = JSON.parse(JSON.stringify(this.impostazioni.maskSizeHor[this.paginaDestinazionePerCopiaSpostamento]));
      this.impostazioni.maskSizeHor[this.paginaDestinazionePerCopiaSpostamento] = JSON.parse(JSON.stringify(this.impostazioni.maskSizeHor[this.numeroPaginaDaCopiare]));

      if (come === 'SWAP') {
        this.impostazioni.maskSize[this.numeroPaginaDaCopiare] = JSON.parse(JSON.stringify(appo1));

        this.impostazioni.maskSizeHor[this.numeroPaginaDaCopiare] = JSON.parse(JSON.stringify(appo21));
      }      
    // }
    // logConsole('Dati Frames size dopo', JSON.parse(JSON.stringify(this.impostazioni.maskSize)));

    // NOMI PAGINE
    // this.datiPageSelectorFiltrati = this.aggiustaArray.SistemaDimensioni(this.datiPageSelectorFiltrati, )
    let paginaPerNomeOrigine;
    let paginaPerNomeDestinazione;
    let indice = 0;

    this.impostazioni.datiPageSelector.DataTable.forEach(element => {
      if (+element.id === +this.numeroPaginaDaCopiare) {
        paginaPerNomeOrigine = indice;
      }
      if (+element.id === +this.paginaDestinazionePerCopiaSpostamento) {
        paginaPerNomeDestinazione = indice;
      }
      indice++;
    });
    
    const nomePaginaDaCopiare = JSON.parse(JSON.stringify(this.impostazioni.datiPageSelector.DataTable[paginaPerNomeOrigine]));
    /* logConsole('Lista dati page selector 1', 
      paginaPerNomeOrigine, this.impostazioni.datiPageSelector.DataTable[paginaPerNomeOrigine],
      paginaPerNomeDestinazione, this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione]); */

    if (come === 'SWAP') {
      // const appoNome = this.datiPageSelectorFiltrati.DataTable[this.paginaDestinazionePerCopiaSpostamento];
      this.impostazioni.datiPageSelector.DataTable[paginaPerNomeOrigine].OnlyName = this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].OnlyName;
      this.impostazioni.datiPageSelector.DataTable[paginaPerNomeOrigine].value = this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].value;
      this.impostazioni.datiPageSelector.DataTable[paginaPerNomeOrigine].description = this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].description;
      // this.impostazioni.datiPageSelector.DataTable[paginaPerNomeOrigine].id = this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].id;

      this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].OnlyName = nomePaginaDaCopiare.OnlyName;
      this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].value = nomePaginaDaCopiare.value;
      this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].description = nomePaginaDaCopiare.description;
      // this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].id = nomePaginaDaCopiare.id;
    } else {
      this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].OnlyName = 'Copy of ' + nomePaginaDaCopiare.OnlyName;
      this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].value = nomePaginaDaCopiare.id + ': ' + 'Copy of ' + nomePaginaDaCopiare.OnlyName;
      this.impostazioni.datiPageSelector.DataTable[paginaPerNomeDestinazione].description = nomePaginaDaCopiare.description;
    }
    
    // logConsole('Lista dati page selector 2', this.impostazioni.datiPageSelector);
    this.generaDatiPageSelectorFiltrati(this.impostazioni.datiPageSelector, 'SpostaPagina');
    // NOMI PAGINE

    let appo2;
    appo2 = JSON.parse(JSON.stringify(this.impostazioni.dimensioni[this.paginaDestinazionePerCopiaSpostamento]));
    this.impostazioni.dimensioni[this.paginaDestinazionePerCopiaSpostamento] = JSON.parse(JSON.stringify(this.impostazioni.dimensioni[this.numeroPaginaDaCopiare]));
    if (come === 'SWAP') {
      this.impostazioni.dimensioni[this.numeroPaginaDaCopiare] = JSON.parse(JSON.stringify(appo2));
    }

    // logConsole('Dati Frames prima', JSON.parse(JSON.stringify(this.impostazioni.frameName)), 
    //   '[' + this.numeroPaginaDaCopiare + '] -> [' + this.paginaDestinazionePerCopiaSpostamento + ']');

    if (come === 'SWAP') {
      const frameNames = JSON.parse(JSON.stringify(this.impostazioni.frameName));

      // [2] -> [999]
      for (let i = 1; i <= environment.quantiFrames; i++) {
        for (let q = 1; q <= environment.quantiSottoFrames; q++) {
          // logConsole('Element 1: ', i, q, element);
          if (frameNames[i][q].indexOf('[' + this.numeroPaginaDaCopiare + ']') > -1) {
            // logConsole('Sposto [origine] ', i, q, JSON.parse(JSON.stringify(frameNames[i][q])));
            frameNames[i][q] = frameNames[i][q].replace('[' + this.numeroPaginaDaCopiare + ']', '[999]');
            // logConsole('Spostato [origine] ', i, q, JSON.parse(JSON.stringify(frameNames[i][q])));
          }
        }
      }

      // [37] -> [2]
      for (let i = 1; i <= environment.quantiFrames; i++) {
        for (let q = 1; q <= environment.quantiSottoFrames; q++) {
          if (frameNames[i][q].indexOf('[' + this.paginaDestinazionePerCopiaSpostamento + ']') > -1) {
            // logConsole('Sposto [dest] ', i, q, JSON.parse(JSON.stringify(frameNames[i][q])));
            frameNames[i][q] = frameNames[i][q].replace('[' + this.paginaDestinazionePerCopiaSpostamento + ']', '[' + this.numeroPaginaDaCopiare + ']');
            // logConsole('Spostato [dest] ', i, q, JSON.parse(JSON.stringify(frameNames[i][q])));
          }
        }
      }

      // [999] -> [37]
      for (let i = 1; i <= environment.quantiFrames; i++) {
        for (let q = 1; q <= environment.quantiSottoFrames; q++) {
          if (frameNames[i][q].indexOf('[999]') > -1) {
            // logConsole('Sistemo [] ', i, q, JSON.parse(JSON.stringify(frameNames[i][q])));
            frameNames[i][q] = frameNames[i][q].replace('[999]', '[' + this.paginaDestinazionePerCopiaSpostamento + ']');
            // logConsole('Sistemato [] ', i, q, JSON.parse(JSON.stringify(frameNames[i][q])));
          }
        }
      }

      this.impostazioni.frameName = JSON.parse(JSON.stringify(frameNames));
    }

    /* logConsole('Dati Frames attivi prima', JSON.parse(JSON.stringify(this.impostazioni.framesAttivi)));
    if (come === 'SWAP') {
      const appo = JSON.parse(JSON.stringify(this.impostazioni.framesAttivi[this.paginaDestinazionePerCopiaSpostamento]));
      this.impostazioni.framesAttivi[this.paginaDestinazionePerCopiaSpostamento] = JSON.parse(JSON.stringify(this.impostazioni.framesAttivi[this.numeroPaginaDaCopiare]));
      this.impostazioni.framesAttivi[this.numeroPaginaDaCopiare] = JSON.parse(JSON.stringify(appo));
    } else {
      this.impostazioni.framesAttivi[this.paginaDestinazionePerCopiaSpostamento] = JSON.parse(JSON.stringify(this.impostazioni.framesAttivi[this.numeroPaginaDaCopiare]));
    }
    logConsole('Dati Frames attivi dopo', JSON.parse(JSON.stringify(this.impostazioni.framesAttivi))); */

    if (come === 'SWAP') {
      if (this.listToPrint.DataTable) {
        this.listToPrint.DataTable.forEach(element => {
          if (+element.pagina === +this.numeroPaginaDaCopiare) {
            element.pagina = +this.paginaDestinazionePerCopiaSpostamento;
          }
        });
      }
    }

    this.creaNomiFrames(false);

    this.editMode = !this.editMode;
    const tt = setTimeout(() => {
      clearTimeout(tt);
      
      this.editMode = !this.editMode;

      const tt2 = setTimeout(() => {
        clearTimeout(tt2);
        
        for (let i = 0; i <= environment.quantiFrames; i++) {
          this.refreshMap[i] = !this.refreshMap[i];
        }
    
        this.mostraCopia = false;
      }, 1000);
    }, 1000);
  }

  listaEventiDaTogliere;

  eventiDaTogliere(e) {
    this.listaEventiDaTogliere = e;
  }

  measureDataCompleti;

  prendeTutteLeMisure() {
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": "", ' +
      '"v_filter_display_name": ""' +
    '}';
    // logConsole('Query misura', JSON.parse(params));
    this.apiService.chiamataPost(this.Utilities, 'geo_measure_dfn__grid', params)
    // .map(response => response)
    .subscribe(data => {
      if (data && data.DataTable && data.DataTable.length > 0) {
        // logConsole('Prende tutte le misure', data.DataTable);
        this.measureDataCompleti = data;
      }
    });
  }

  settingsAperto = false;

  gestioneSetting(e) {
    this.settingsAperto = e;
  }

  eseguiCheck(e) {
    logConsole('Ritorno esegui check', e);
    const modalita = e.modalita;

    switch (modalita) {
      case 'delete_activities':
        this.premutoTastoDeleteActSet1(e.dati)
        break;
      case 'process_activities':
        this.premutoProcess1(e.dati)
        break;
      // case 'delete_ltp':
      //   this.premutoTastoDeleteLTP1(e.dati);
      //   break;
    }
  }

  selezioneActivity = false;

  clickCheckRigaLA(e) {
    if (e && e.dati && e.dati.length > 0) {
      this.selezioneActivity = true;
    } else {
      this.selezioneActivity = false;
    }
  }

  selezionateTutteLeRigheAct(e, come) {
    if (Array.isArray(e)) {
      this.clickRigaLA(e);
    }

    if (come) {
      this.selezioneActivity = true;
    } else {
      this.selezioneActivity = false;
    }
  }

  imsi = undefined;
  uniqueID = undefined;

  imsiSelezionato(e) {
    // logConsole('IMSI selezionato in app', e);
    this.imsi = undefined;
    const t = setTimeout(() => {
      clearTimeout(e);
      this.imsi = e;
    }, 500);
  }

  uniqueIDSelezionato(e)  {
    // logConsole('UniqueID selezionato in app', e);
    this.uniqueID = undefined;
    const t = setTimeout(() => {
      clearTimeout(e);
      this.uniqueID = e;
    }, 500);
  }

  filterMQ = '';

  cambioFilterMQ(e) {
    this.filterMQ = JSON.parse(JSON.stringify(e));
    /* const t = setTimeout(() => {
      clearTimeout(e);
      this.filterMQ = e;
    }, 500); */
  }

  isStandAloneMRChanged(f, n, e) {
    if (this.impostazioni.isStandAloneMR === undefined || this.impostazioni.isStandAloneMR[0] === undefined || this.impostazioni.isStandAloneMR[0][0] === undefined) {
      this.impostazioni.isStandAloneMR = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
    }

    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio antenne frame ' + n + ':', e);
    // if (e === 1) {
      this.impostazioni.isStandAloneMR[f][n] = e;
    // } else {
    //   this.impostazioni.isCheckedAntenne[n] = false;
    // }
    // logConsole('isStandAloneMRChanged', f, n, e, this.impostazioni);
    this.checkDifferenceFromStartJSON();
  }

  viewModeMSChanged(f, q ,e) { 
    if (this.impostazioni.viewModeMS === undefined || this.impostazioni.viewModeMS[0] === undefined || this.impostazioni.viewModeMS[0][0] === undefined) {
      this.impostazioni.viewModeMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    this.impostazioni.viewModeMS[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    // logConsole('tipoDati Layout', f, q, e);
    this.checkDifferenceFromStartJSON();
  }

  flowTypeMSChanged(f, q ,e) { 
    if (this.impostazioni.flowTypeMS === undefined || this.impostazioni.flowTypeMS[0] === undefined || this.impostazioni.flowTypeMS[0][0] === undefined) {
      this.impostazioni.flowTypeMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    this.impostazioni.flowTypeMS[f][q] = e;
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio columns bars', f, q, e);
    // logConsole('tipoDati Layout', f, q, e);
    this.checkDifferenceFromStartJSON();
  }
}

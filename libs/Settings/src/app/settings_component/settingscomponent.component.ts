import { logConsole } from '../console-log';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, 
  ChangeDetectionStrategy,SimpleChanges, 
  OnDestroy,
  ViewChild,
  ElementRef} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import Swal from 'sweetalert2';
import { ExternalApiService } from "./services/externalapi.service";
import { environment } from "../../environments/environment";
import { getLocaleNumberSymbol } from "@angular/common";

@Component({
    templateUrl: 'settingscomponent.component.html',
    selector: 'settings-component',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./settingscomponent.style.css']
})

export class SettingsComponentFrame implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  // @ViewChild('divContenitoreMisure', {static: true}) divCont: ElementRef;
  @ViewChild('divFiltri') divFiltri!: ElementRef;

  @Input() passaggioValori;

  @Output() MappaOGraficoEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() tipoMappaEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() overviewZoomEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isCheckedServingCellEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isCheckedShowPathsEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isCheckedShowSelectedPathsEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isCheckedAntenneEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isNonSyncEventTimeEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() measureEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() slaEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() activityEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() geoFilterEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() visibileEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() frameNameEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() descrizioneEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() plmnEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() netTechEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() shownEventsEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modificaChartEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() doNoSetGMEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() bandWidthEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() listaEventi: EventEmitter<string> = new EventEmitter<string>();
  // @Output() listaEventiTemp: EventEmitter<string> = new EventEmitter<string>();
  @Output() tabSelezionatoEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() visualizzaSLA: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() ridisegnaFrame: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() countHistogramEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() checkSeverityEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() viewAsEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() overlayEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() overlayClusterEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() timeFilterEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() bboxOverViewZoomEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() tipoDatasetEmit: EventEmitter<number> = new EventEmitter<number>();
  // @Output() viewDefinition: EventEmitter<string> = new EventEmitter<string>();
  @Output() designInfoEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshSLAEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() histDisplayAsEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() histDisplayTuttoEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() columnsBarsEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() doubleGraphEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() showPlanimetryEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Output() columnsSettingsEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() tipoEventoEmit: EventEmitter<string> = new EventEmitter<string>();
  // @Output() eventiSceltiESEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() fixedSecondsEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() styleSizesEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() styleImpostatoEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() cellTypeEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() addLayersEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() opacityEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() showRaysEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() showMeasuresEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() squareMetersEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() measureTypeEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() mosaicStyleEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() checkSeCiSonoModificheEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sartPositionEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() measureSMSEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() showMeasuresSEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() mappeMSEmit: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() clusterMeasureEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() clusterMeasure2Emit: EventEmitter<string> = new EventEmitter<string>();
  // @Output() lovEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() textFilterEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() textFilter2Emit: EventEmitter<string> = new EventEmitter<string>();
  // @Output() textLovEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() addGlobalLayerEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() measureRCMEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() eventsMeasureEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showRaysAllLayerEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() showAdditionalLayersEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() correlationEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() showCoverageMeasuresEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showVoiceCallMeasuresEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showDataMeasuresEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showSamplesMeasuresEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showAxisXEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() additionalMeasuresTCRUN: EventEmitter<string> = new EventEmitter<string>();
  @Output() heightChartEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() showMultiSelectEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() applyTextFilter1: EventEmitter<string> = new EventEmitter<string>();
  @Output() applyTextFilter2: EventEmitter<string> = new EventEmitter<string>();
  @Output() listaCampiEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() tipoDatiLayoutMEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewModeMSEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() flowTypeMSEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() isStandAloneMREmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  // private destroy$ = new Subject<void>();
  
  destroy$ = new Subject<void>();

  permetteEmit = false;

  ngOnInit() {
    this.datiMeasures = 'empty grid';
    
    this.azzeraValoriPagina();
    this.creaDatiTipiFrame('--');

    // NUOVA VERSIONE
    // this.menuVisibile = true;

    /* const tm1 = setTimeout(() => {
      clearTimeout(tm1);

      this.LeggeEventi();
      
      const tm = setTimeout(() => {
      clearTimeout(tm);
        this.puoEffettuareControlli = true;
      }, 2000);
    }, 1000); */

    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.puoEffettuareControlli = true;
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();  
  }

  showMultiSelect = true;

  sessionID;
  Debug;
  indirizzoServer;
  righePerPaginazioneAutomatica;
  numeroActSetVisibili;
  userName;
  mappeStyle;
  NumeroFrame;
  frameAttivo;
  Log;
  measurePassato;
  ConnessioneStabilita;
  datiSlaDT;
  slaValue;
  styleSizes;
  // measureData;
  act_set;
  tmsMin;
  tmsMax;
  tmsSelezionato;
  tmsGlobaleMin;
  tmsGlobaleMax;
  dashboardAttiva;
  tipoDatiLayoutM;
  listaCampiAttuale;
  listaEventiDaPassareOriginali;

  filter1;
  filter1NAME;
  txtFilter1;
  filter2;
  filter2NAME;
  txtFilter2;

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  datiLayout = [
    {
      id: 1,
      name: 'Pivot'
    },
    {
      id: 2,
      name: 'TcRun'
    },
    {
      id: 3,
      name: 'Pivot And TcRun'
    }
  ];

  nomeGrigliaMeasure = ['Measure_0', 'Measure_1', 'Measure_2', 'Measure_3', 'Measure_4', 'Measure_5', 'Measure_6'
    , 'Measure_7', 'Measure_8', 'Measure_9'];

  filtroModificato1 = false;
  filtroModificato2 = false;

  quanteMisure;
  eseguitoInProgetto = false;
  tipoFrameProgetto2 = 'M';

  nomiMeasureScatter = ['', 'X', 'Y', 'Color', 'Chart'];
  nomiMeasureHistogram = ['', 'X', 'Y', 'Chart', 'Y Measure (if Y is string)'];
  nomiMeasurePareto = ['', 'X', 'Chart'];

  effettuaAutoFitEL = false;

  datiPointMeasures;
  titoloPointMeasures;
  nomeGrigliaPM = ['grid_additional_measure_1', 'grid_additional_measure_2', 'grid_additional_measure_3', 'grid_additional_measure_4'
    , 'grid_additional_measure_5', 'grid_additional_measure_6', 'grid_additional_measure_7', 'grid_additional_measure_8'
    , 'grid_additional_measure_9', 'grid_additional_measure_10'];
  selezionePM;
  staElaborandoPM;
  misureAddizionaliTCRUN;
  misureAddizionaliTCRUNStart = '';
  effettuaAutoFitPM = false;
  puoEffettuareControlli = false;

  // RICORDARSI DI MODIFICARE ANCHE LA STESSA STRUTTURA SU HISTOGRAM.COMPONENT.TS
  tipiHistogrammiTutto: any[] = [
    { id: 'S0', name: 'Count' },
    { id: 'S1', name: 'Count 100%' },
    { id: 'N9', name: 'Count Distinct' },
    { id: 'N0', name: 'Avg' },
    { id: 'N1', name: 'Avg/Min/Max' },
    { id: 'N2', name: 'Avg/Count' },
    { id: 'N3', name: 'Avg/Min/Max/Count' },
  ];
  // RICORDARSI DI MODIFICARE ANCHE LA STESSA STRUTTURA SU HISTOGRAM.COMPONENT.TS

  fixedSecondsData: any[] = [
    // { id: '0.5', name: '0.5' },
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '5', name: '5' },
    { id: '10', name: '10' },
  ];

  datiTipiGeoFilter = [
    { ID: '0', DISPLAY_NAME: 'All'},
    { ID: '1', DISPLAY_NAME: 'Overview Map'},
    // { ID: '2', DISPLAY_NAME: 'Zoomed Map'},
    { ID: '3', DISPLAY_NAME: 'Selected Area'},
  ];

  datiTipiGeoFilterCluster = [
    { ID: '0', DISPLAY_NAME: 'All'},
    { ID: '1', DISPLAY_NAME: 'Overview Map'},
    // { ID: '2', DISPLAY_NAME: 'Zoomed Map'},
    // { ID: '3', DISPLAY_NAME: 'Selected Area'},
  ];

  tipiOpacita = [
    { id: 5, name: '5'},
    { id: 10, name: '10'},
    { id: 20, name: '20'},
    { id: 30, name: '30'},
    { id: 40, name: '40'},
    { id: 50, name: '50'},
    { id: 60, name: '60'},
    { id: 70, name: '70'},
    { id: 80, name: '80'},
    { id: 90, name: '90'},
  ];

  viewModes = [
    { name: 'mistral_calls'},
    { name: 'mistral_rbcscc'},
    { name: 'mistral_rbcixl'},
    { name: 'mistral_imsi'},
  ]

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
    { CODE: '10000', DISPLAY_NAME: '10000' },
    { CODE: '<GLOBAL SQUARE SIDE>', DISPLAY_NAME: '<GLOBAL SQUARE SIDE>' }
  ];

  datiMeasures;
  refreshGrigliaDM = false;
  rigaSelezionataDM;
  idRigaSelezionataDM;
  misuraSelezionata;
  misSel;
  numeroRigheMisure;

  caricamentoMisureInCorso = false;
  rigaDaSpostare;

  Ut;

  refreshSlaboolean = false;
  ultimoRidisegnaFrame = false;
  tabSelezionato2 = 0;
  // menuVisibile = false;
  dashboardMeasuresData;
  EventiSelezionati;
  EventiDeselezionati;
  pulisceSelezioneDaMettere;
  pulisceSelezioneDaTogliere;
  selezioneMultiplaTogliere;
  selezioneMultiplaMettere;
  refreshGrigliaMettere;
  refreshGrigliaTogliere;
  slaGroup2;
  slaValueToPass2;
  modificheEffettuate;
  effettuaAutoFitAL = false;
  // measureData2;
  EventiDaMettereVisibile = false;
  measureD = new Array();
  measureDSMS = '';
  measureDD;
  datiTipiActivity2;
  datiEventiDaMettere2;
  // impostaSelezioneES = new Array();
  selezioneCellType;
  selezioneAddLayers;
  lookupMR = false;
  // showAdditionalLayers = true;

  sla = false; // [false, false, false, false, false, false, false, false, false, false];
  sla2 = [false, false, false, false, false, false, false, false, false, false];

  pulisceValoriCombo;

  pulisceFiltroDL;
  pulisceFiltroMG;
  pulisceFiltroOpacity;
  pulisceFiltroAct;
  pulisceFiltroMapStyle;
  pulisceFiltroMapsStyle;
  pulisceFiltroMeasures = new Array();
  pulisceFiltroSLA;
  pulisceFiltroOverlay;
  pulisceFiltroOverlaySM;
  pulisceFiltroOverlayCluster;
  pulisceFiltroHistDisplayAs;
  pulisceFiltroHistDisplayTutto;
  pulisceFiltroEvents;
  pulisceFiltroGeo;
  pulisceFiltroMeasuresSMS;
  pulisceFiltroCCG;
  pulisceFiltroMeasuresRC;

  // measureDataCM1;
  // measureDataCM2;
  measureDataCor;
  measureDataRCM;
  measureDataO;
  measureDataC;
  measureDataSMS;
  measureDataMeas = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  measureDataMeasTC;
  measureDataCompleti2;

  /* datiOriginali: any = {
    MapName: '',
    Descrizione: '',
    MapGraph: '',
    Activity: '',
    ViewGlobal: '',
    MapType: '',
    ServingCell: true,
    Antenne: '',
    Measure: ['', '', '', '', '', '', '', '', '', ''],
    SLA: '',
    ListaDaPassare: '',
    PLMN: '',
    NetTech: '',
    BandWidth: '',
    countHystogram: '',
    Severity: '',
    // originalLayerMappa: '',
    ViewAs: 1,
    Overlay: '',
    OverlayCluster: '',
    TimeFilter: '',
    HistDisplayAS: ['', '', '', '', '', '', '', '', '', ''],
    ColumnsBars: ['2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2' ],
    ShowPlanimetry: [false, false, false, false, false, false, false, false, false, false],
    ColumnSettings: ['', '', '', '', '', '', '', '', '', ''],
    TipoEvento: ['', '', '', '', '', '', '', '', '', ''],
    styleImpostato: 12,
    // EventiSceltiES: new Array()
    FixedSeconds: '',
    CellType: ['', '', '', '', '', '', '', '', '', ''],
    AddLayers: ['', '', '', '', '', '', '', '', '', ''],
    Opacity: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
    ShownEvents: false,
    ModificaChart: false,
    DoNoSetGM: false,
    ShowMeasures: false,
    SquareMeters: 200,
    MeasureType: 1,
    MosaicStyle: '',
    BboxOverViewZoom: 1,
    GeoFilter: '0',
    ShowMeasuresS: false,
    TipoDataset: 1,
    MappeMS: 1,
    ClusterMeasure: '',
    ClusterMeasure2: '',
    // Lov: '',
    TextFilter: '',
    TextFilter2: '',
    // TextLov: '',
    AddGlobalLayer: false,
    MeasureRCM: 1,
    EventsMeasure: [true, true, true, true, true, true, true, true, true, true],
    HistDisplayTutto: ['', '', '', '', '', '', '', '', '', ''],
    showRaysAllLayer: [true, true, true, true, true, true, true, true, true, true],
    Correlation: '',
    ShowCoverageMeasures: false,
    ShowVoiceCallMeasures: false,
    ShowDataMeasures: false,
    ShowSamplesMeasures: false,
    doubleGraph: false,
  }; */

  // lovM1;
  // lovM1Id;
  // lovM1Appo;
  // lovM2;
  // lovM2Id;
  // lovM2Appo;

  //  + this.NumeroFrame,
  datiModificati: any = {
    mapNameM: '<empty>',
    descrizioneM: '',
    mappaOGraficoM: '',
    activityM: 9999,
    viewGlobalM: true,
    mapTypeM: '-1',
    isCheckedServingCellM: true,
    isCheckedAntenneM: 1,
    measureM: ['', '', '', '', '', '', '', '', '', ''],
    slaValue2M: -1,
    // datiEventiDaPassareM: '',
    plmnM: true,
    netTechM: true,
    bandWidthM: true,
    countHystogram: '',
    severity: '',
    // layerMappa: '',
    viewAsM: 1,
    overlayM: 0,
    overlayClusterM: -1,
    timeFilterM: '',
    histDisplayAsM: ['', '', '', '', '', '', '', '', '', ''],
    columnsBarsM: ['2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2', '2' ],
    showPlanimetryM: [false, false, false, false, false, false, false, false, false, false],
    // columnsSettingsM: ['', '', '', '', '', '', '', '', '', ''],
    tipoEventoM: ['', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
    styleImpostatoM: 12,
    // eventiSceltiES: new Array()
    fixedSecondsM: '',
    cellTypeM: '',
    addLayersM: '',
    isCheckedShowPathsM: true,
    isCheckedShowSelectedPathsM: true,
    opacityM: 20,
    shownEventsM: false,
    modificaChartM: true,
    doNotSetGM: false,
    showRaysM: false,
    showMeasuresM: false,
    squareMetersM: 100,
    measureTypeM: 1,
    mosaicStyleM: '',
    sartPositionM: true,
    bboxOverViewZoomM: 1,
    geoFilterM: '0',
    measureSMSM: '',
    showMeasuresSM: false,
    tipoDatasetM: 1,
    mappeMSM: 1,
    clusterMeasureM: '',
    clusterMeasure2M: '',
    textFilterM: '',
    textFilter2M: '',
    // textLovM: '',
    addGlobalLayerM: false,
    measureRCM: '',
    eventsMeasureM: false, // [true, true, true, true, true, true, true, true, true, true],
    HistDisplayTuttoM: ['', '', '', '', '', '', '', '', '', ''],
    showRaysAllLayerM: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
    correlationM: '',
    isNonSyncEventTimeM: false,
    showCoverageMeasuresM: false,
    showVoiceCallMeasuresM: false,
    showDataMeasuresM: false,
    showSamplesMeasuresM: false,
    showAxisXM: true,
    heightChartM: 'X1',
    doubleGraphM: false,
    listaCampiAttuale: undefined,
    tipoDatiLayoutM: 3,
    viewModeMS: '',
    flowTypeMS: '',
    isStandAloneMR: false
  };
  datiOriginali = this.datiModificati;

  // Utils;
  datiAntenne;
  effettuaAutoFitColumn = false;

  tipiEventi;
  infoKeyVisibileMettere;
  infoKeyVisibileTogliere;

  slaVisible = false;
  // datiSLA;
  // datiSlaDT;
  measureDaDisegnare;
  comboDisabilitata;
  clusterGroup2;
  datiPivotOriginali;
  grigliaColumnSettings;
  datiLookUp2;
  datiAddLayers2;
  rinfrescaGrigliaCellTypes;
  rinfrescaGrigliaAddLayers;

  datiMosaicStyle2;
  staDisegnandoSMSM;
  pulisceFiltroOverlayMS = false;
  numeroActSetVisibili2 = -1;

  progettoEsterno2 = '';
  moduloProgettoEsterno2 = '';
  misureCluster;

  datiTipiFrame;
  Frame2;

  nomeGrigliaConfig = [ 'gridConfigTcRun2_0', 'gridConfigTcRun2_1', 'gridConfigTcRun2_2', 'gridConfigTcRun2_3',
    'gridConfigTcRun2_4', 'gridConfigTcRun2_5', 'gridConfigTcRun2_6', 'gridConfigTcRun2_7', 
    'gridConfigTcRun2_8', 'gridConfigTcRun2_9' ];
  datiConfig;
  effettuaAutoFitConfig = false;
  caricamentoConfigInCorso = false;
  erroreConfig;
  impostaSelezioneConfig;
  vecchioDatiJsonConfig;
  tastoRefreshAttivo = false;
  listaCampiAttualeConfronto;

  nomeGrigliaConfigList = [ 'gridConfigListTcRun2_0', 'gridConfigListTcRun2_1', 'gridConfigListTcRun2_2', 'gridConfigListTcRun2_3',
        'gridConfigListTcRun2_4', 'gridConfigListTcRun2_5', 'gridConfigListTcRun2_6', 'gridConfigListTcRun2_7', 
        'gridConfigListTcRun2_8', 'gridConfigListTcRun2_9' ];
  datiConfigList;
  effettuaAutoFitConfigList = false;
  erroreConfigList;
  impostaSelezioneConfigList;
  vecchioDatiJsonConfigList;
  caricamentoConfigListInCorso = false;
  campoSelezionato;
  listaCampiFiltrati;
  lastCallConfig = this.creaVettore(environment.quantiFrames, '');
  lastCallConfigList = this.creaVettore(environment.quantiFrames, '');
  chiSonoField = ''; // ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoFieldValue = ''; // ExternalUtilities.creaVettore(environment.quantiFrames, '');

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
    // private _matDialog: MatDialog
    // public Utils2: Utils
  ) {
  }

  isArray(obj: any ) {
    return Array.isArray(obj);
  }

  creaVettore(x, valore) {
    const m = new Array();
    for (let j = 0; j <= x; j++) {
      // // logConsole(valore);
      if (valore && valore !== true && valore !== false && !this.isNumeric(valore) && valore !== null && !this.isArray(valore)) {
        const v = valore.replace('***CONT***', j);
        m.push(v);
      } else {
        m.push(valore);
      }
    }
    // this.scriveLog(m);
    return m;
  }

  conta = 0;
  pagina = 0;
  staSistemandoTabs = false;
  appoggioValoriComboMATCRUN;

  aggiornaDatiOriginali(daDove) {
    // logConsole('Aggiorno dati originali', daDove, '*' + this.datiModificati.textFilterM + '*', '>' + this.datiModificati.textFilter2M + '<');

    this.datiOriginali = JSON.parse(JSON.stringify(this.datiModificati));
  
    if (this.misureAddizionaliTCRUN) {
      this.misureAddizionaliTCRUNStart = JSON.parse(JSON.stringify(this.misureAddizionaliTCRUN));
    }

    this.listaEventiDaPassareOriginali = JSON.parse(JSON.stringify(this.datiModificati.datiEventiDaPassareM));

    // logConsole('Aggiornamento originale misure tcrun', this.appoggioValoriComboMATCRUN);
    const vatcrun = localStorage.getItem(this.userName + '_' + this.nomeGrigliaPM[this.NumeroFrame] + '_' + this.frameAttivo + '_SelectedPointInfoV2');
    if (vatcrun !== null) {
      this.appoggioValoriComboMATCRUN = vatcrun;
    }
    // logConsole('Aggiorno dati originali', this.datiOriginali, daDove);

    const t = setTimeout(() => {
      this.permetteEmit = true;
    }, 1500);
    return;

    this.datiOriginali.MapName = this.datiModificati.mapNameM;
    this.datiOriginali.Descrizione = this.datiModificati.descrizioneM;
    this.datiOriginali.MapGraph = this.datiModificati.mappaOGraficoM;
    this.datiOriginali.Activity = this.datiModificati.activityM;
    this.datiOriginali.GeoFilter = this.datiModificati.geoFilterM;
    this.datiOriginali.ViewGlobal = this.datiModificati.viewGlobalM;
    this.datiOriginali.MapType = this.datiModificati.mapTypeM;
    this.datiOriginali.ServingCell = this.datiModificati.isCheckedServingCellM;
    this.datiOriginali.isCheckedShowPaths = this.datiModificati.isCheckedShowPathsM;
    this.datiOriginali.Antenne = this.datiModificati.isCheckedAntenneM;
    this.datiOriginali.isNonSyncEventTime = this.datiModificati.isNonSyncEventTimeM;
    if (this.datiModificati.measureM !== undefined) {
      this.datiOriginali.Measure = JSON.parse(JSON.stringify(this.datiModificati.measureM));
    }
    this.datiOriginali.SLA = this.datiModificati.slaValue2M;
    this.datiOriginali.ListaDaPassare = this.datiModificati.datiEventiDaPassareM;
    this.datiOriginali.PLMN = this.datiModificati.plmnM;
    this.datiOriginali.NetTech = this.datiModificati.netTechM;
    this.datiOriginali.BandWidth = this.datiModificati.bandWidthM;
    this.datiOriginali.Severity = this.datiModificati.severityM;
    this.datiOriginali.countHistogram = this.datiModificati.countHistogram;
    this.datiOriginali.ViewAs = this.datiModificati.viewAsM;
    this.datiOriginali.Overlay = this.datiModificati.overlayM;
    this.datiOriginali.OverlayCluster = this.datiModificati.overlayClusterM;
    this.datiOriginali.TimeFilter = this.datiModificati.timeFilterM;
    this.datiOriginali.BboxOverViewZoom = this.datiModificati.bboxOverViewZoomM;
    this.datiOriginali.TipoDataset = this.datiModificati.tipoDatasetM;
    this.datiOriginali.DesignInfo = this.datiModificati.designInfoM;
    this.datiOriginali.HistDisplayAS = this.datiModificati.histDisplayAsM;
    this.datiOriginali.HistDisplayTutto = this.datiModificati.HistDisplayTuttoM;
    this.datiOriginali.ColumnsBars = this.datiModificati.columnsBarsM;
    this.datiOriginali.doubleGraph = this.datiModificati.doubleGraphM;
    this.datiOriginali.EventsMeasure = this.datiModificati.eventsMeasureM;
    this.datiOriginali.ShowPlanimetry = this.datiModificati.showPlanimetryM;
    // this.datiOriginali.ColumnsSettings = this.datiModificati.columnsSettingsM;
    this.datiOriginali.TipoEvento = this.datiModificati.tipoEventoM;
    this.datiOriginali.styleImpostato = this.datiModificati.styleImpostatoM;
    // this.datiOriginali.EventiSceltiES = this.datiModificati.eventiSceltiESM;
    this.datiOriginali.FixedSeconds = this.datiModificati.fixedSecondsM;
    this.datiOriginali.CellType = this.datiModificati.cellTypeM;
    this.datiOriginali.AddLayers = this.datiModificati.addLayersM;
    this.datiOriginali.Opacity = this.datiModificati.opacityM;
    this.datiOriginali.ShownEvents = this.datiModificati.shownEventsM;
    this.datiOriginali.ModificaChart = this.datiModificati.modificaChartM;
    this.datiOriginali.DoNotSetGM = this.datiModificati.doNotSetGMM;
    this.datiOriginali.ShowRays = this.datiModificati.showRaysM;
    this.datiOriginali.ShowMeasures = this.datiModificati.showMeasuresM;
    this.datiOriginali.ShowVoiceCallMeasures = this.datiModificati.showVoiceCallMeasuresM;
    this.datiOriginali.ShowDataMeasures = this.datiModificati.showDataMeasuresM;
    this.datiOriginali.ShowSamplesMeasures = this.datiModificati.showSamplesMeasuresM;
    this.datiOriginali.SquareMeters = this.datiModificati.squareMetersM;
    this.datiOriginali.MeasureType = this.datiModificati.measureTypeM;
    this.datiOriginali.MosaicStyle = this.datiModificati.mosaicStyleM;
    this.datiOriginali.SartPosition = this.datiModificati.sartPositionM;
    this.datiOriginali.MeasureSMS = this.datiModificati.measureSMSM;
    this.datiOriginali.ShowMeasuresS = this.datiModificati.showMeasuresSM;
    this.datiOriginali.ShowCoverageMeasures = this.datiModificati.showCoverageMeasuresM;
    this.datiOriginali.ShowVoiceCallMeasures = this.datiModificati.showVoiceCallMeasuresM;
    this.datiOriginali.ShowDataMeasures = this.datiModificati.showDataMeasuresM;
    this.datiOriginali.ShowSamplesMeasures = this.datiModificati.showSamplesMeasuresM;
    this.datiOriginali.MappeMS = this.datiModificati.mappeMSM;
    this.datiOriginali.ClusterMeasure = this.datiModificati.clusterMeasureM;
    this.datiOriginali.ClusterMeasure2 = this.datiModificati.clusterMeasure2M;
    // this.datiOriginali.Lov1 = this.datiModificati.lovM1;
    // this.datiOriginali.Lov2 = this.datiModificati.lovM2;
    this.datiOriginali.TextFilter = this.datiModificati.textFilterM;
    this.datiOriginali.TextFilter2 = this.datiModificati.textFilter2M;
    // this.datiOriginali.TextLov = this.datiModificati.textLovM;
    this.datiOriginali.AddGlobalLayer = this.datiModificati.addGlobalLayerM;
    this.datiOriginali.MeasureRCM = this.datiModificati.measureRCM;
    this.datiOriginali.showRaysAllLayer = this.datiModificati.showRaysAllLayerM;
    this.datiOriginali.Correlation = this.datiModificati.correlationM;
    this.datiOriginali.ShowAxisX = this.datiModificati.showAxisXM;
    this.datiOriginali.HeightChart = this.datiModificati.heightChartM;
    this.datiOriginali.tipoDatiLayoutM = this.datiModificati.tipoDatiLayoutM;

    this.modificheEffettuate = false;

    // this.scriveLog(this.datiOriginali, this.datiModificati);
  }

  Utils;
  messaggioWarningDAL2 = '';

  ngOnChanges(rr) {
    if (!rr.passaggioValori) {
      return;
    }

    const r = rr.passaggioValori.currentValue;

    // // logConsole('Apertura settings', r);

    if (r.Utils) {
      this.Utils = r.Utils;
      this.Ut = r.Utils;

      this.datiAntenne = r.Utils.antenne;
      // this.datiAntenne[0].id = -1;
      // logConsole('Dati antenne', this.datiAntenne);
    }

    if (r.sessionID) {
      this.sessionID = r.sessionID;
    }

    if (r.mappeStyle) {
      this.mappeStyle = r.mappeStyle;
    }

    if (r.Debug) {
      this.Debug = r.Debug;
    }

    if (r.indirizzoServer) {
      this.indirizzoServer = r.indirizzoServer;
    }

    if (r.MappaOGrafico) {
      // if (this.NumeroFrame === 1) {
      //   this.scriveLog('Mappa o Grafico impostato', r.MappaOGrafico);
      // }
      this.datiModificati.mappaOGraficoM = r.MappaOGrafico;
      // if (this.menuVisibile === false) {
      // this.datiOriginali.MapGraph = r.MappaOGrafico;

      // }
      this.creaDatiTipiFrame(this.datiModificati.mappaOGraficoM);

      if (this.datiModificati.mappaOGraficoM === 'ES' || this.datiModificati.mappaOGraficoM === 'AE') {
        //   this.selezioneMultiplaES = true;
        // this.impostaSelezioneES = [ 96, 204 ];
        this.datiModificati.tipoEventoM = 'A';
      }

      this.aggiornaQuanteMisure();

      if (this.datiModificati.mappaOGraficoM === 'TC' || this.datiModificati.mappaOGraficoM === 'TP') {        
        this.caricaPointMeasures();
      }

      // this.LeggeEventi();
    }

    if (r.measureDataCompleti) {
      if (r.measureDataCompleti.DataTable) {
        // logConsole('Aggiornamento measure data completi settings component', r.measureDataCompleti.DataTable);
        this.measureDataCompleti2 = r.measureDataCompleti.DataTable;
      }
    }

    if (r.righePerPaginazioneAutomatica) {
      this.righePerPaginazioneAutomatica = r.righePerPaginazioneAutomatica;
    }

    if (r.numeroActSetVisibili) {
      this.numeroActSetVisibili = r.numeroActSetVisibili;
    }
    
    if (r.userName) {
      this.userName = r.userName;
    }

    if (r.NumeroFrame) {
      this.NumeroFrame = r.NumeroFrame;
    }

    if (r.frameAttivo) {
      this.frameAttivo = r.frameAttivo;
    }

    if (r.datiSlaDT) {
      this.datiSlaDT = r.datiSlaDT;
    }

    if (r.slaValue) {
      this.slaValue = r.slaValue;
    }

    if (r.styleSizes) {
      this.styleSizes = r.styleSizes;
    }

    /* if (r.measureData) {
      // this.measureData = r.measureData;
      this.measureDataCompleti = r.measureData;
    } */

    if (r.act_set) {
      this.act_set = r.act_set;
    }

    if (r.tmsMin) {
      this.tmsMin = r.tmsMin;
    }

    if (r.tmsMax) {
      this.tmsMax = r.tmsMax;
    }

    if (r.tmsSelezionato) {
      this.tmsSelezionato = r.tmsSelezionato;
    }

    if (r.tmsGlobaleMin) {
      this.tmsGlobaleMin = r.tmsGlobaleMin;
    }

    if (r.tmsGlobaleMax) {
      this.tmsGlobaleMax = r.tmsGlobaleMax;
    }

    if (r.dashboardAttiva) {
      this.dashboardAttiva = r.dashboardAttiva;
    }

    if (r.tipoDatiLayoutM) {
      this.tipoDatiLayoutM = r.tipoDatiLayoutM;
    }
  
    if (r.listaCampiAttuale) {
      this.listaCampiAttuale = r.listaCampiAttuale;
    }

    /* if (r.visibile) {
      if (r.visibile === true) {
        // this.scriveLog('Maschera visibile:', r.visibile);
        // this.azzeraValoriPagina();
        // this.pulisceCampiAppoggio();
        if (this.eseguitoInProgetto) {
          this.tabSelezionato2 = 1;
        } else {
          this.tabSelezionato2 = 0;
        }

        // this.menuVisibile = true;

        const tm1 = setTimeout(() => {
          clearTimeout(tm1);

          this.LeggeEventi();
          
          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.puoEffettuareControlli = true;
          }, 2000);
        }, 1000);
      }
    } */

    if (r.Debug && r.Debug !== undefined) {
      this.Debug = r.Debug;
    }

    if (r.Frame && r.Frame !== undefined) {
      this.Frame2 = r.Frame;
    }

    if (r.tipoFrameProgetto && r.tipoFrameProgetto !== undefined) {
      this.tipoFrameProgetto2 = r.tipoFrameProgetto;
    }

    if (r.eseguitoInProgetto && r.eseguitoInProgetto !== undefined) {
      this.eseguitoInProgetto = r.eseguitoInProgetto;

      if (this.eseguitoInProgetto) {
        this.tabSelezionato2 = 1;
      } else {
        this.tabSelezionato2 = 0;
      }
  
      this.scriveLog('Eseguito in progetto:', this.eseguitoInProgetto);
    }

    if (r.progettoEsterno) {
      this.scriveLog('Refresh progettto esterno settings', this.NumeroFrame, r.progettoEsterno);

      if (r.progettoEsterno && r.progettoEsterno.indexOf(';') > -1) {
        const c = r.progettoEsterno.split(';');
        this.progettoEsterno2 = c[0];
        this.moduloProgettoEsterno2 = c[1];
      } else {
        if (r.progettoEsterno && r.progettoEsterno.indexOf(';') === -1) {
          this.progettoEsterno2 = r.progettoEsterno;
          this.moduloProgettoEsterno2 = '';
        } else {
          this.progettoEsterno2 = '';
          this.moduloProgettoEsterno2 = '';
        }
      }
    }

    if (r.permessiDataView) {
      if (r.permessiDataView && r.permessiDataView.length > 0) {
        if (this.Debug === true) {
          this.scriveLog('Permessi Data VIEW Settings:', r.permessiDataView);
        }
        // // logConsole('Permessi Data VIEW Settings:', r.permessiDataView);

        this.datiTipiFrame = new Array();
        this.Utils.datiTipiFrameTutti.forEach(element => {
          let ok = false;
          if (element.id === '--' || element.id === 'PP') {
            ok = true;
          } else {
            r.permessiDataView.forEach(element2 => {
              if (element2.NAME === element.id) {
                ok = true;
              }
            });
          }
          if (ok) {
            this.datiTipiFrame.push(element);
          }
        });
        // logConsole('Data view', this.datiTipiFrame, r.permessiDataView)
        this.scriveLog('Lista Data VIEW Settings:', this.datiTipiFrame);
      }
    }

    if (r.datiMosaicStyle) {
      if (r.datiMosaicStyle) {
        this.datiMosaicStyle2 = new Array();
        r.datiMosaicStyle.DataTable.forEach(element => {
          const d = {
            CODE_STR: element.CODE_STR,
            VALUE_STR: element.VALUE_STR
          };
          this.datiMosaicStyle2.push(d);
        });
      }
    }

    if (r.staDisegnandoSMS) {
      if (r.staDisegnandoSMS) {
        this.staDisegnandoSMSM = r.staDisegnandoSMS;
        this.scriveLog('Sta disegnando misure SMS:', this.staDisegnandoSMSM);
      }
    }

    if (r.numeroActSetVisibili) {
      this.numeroActSetVisibili2 = r.numeroActSetVisibili;
      this.scriveLog('Numero act set visibili:', this.NumeroFrame, this.numeroActSetVisibili2);
    }

    if (r.misureAddizionaliTCRUNP) {
      // logConsole('Passaggio misure addizionali TCRUN', r.misureAddizionaliTCRUNP);

      this.misureAddizionaliTCRUN = r.misureAddizionaliTCRUNP;
      if (!this.misureAddizionaliTCRUN) {
        this.misureAddizionaliTCRUN = ['', '', '', '', '', '', ''];
      }

      this.scriveLog('Misure addizionali tcrun:', this.NumeroFrame, this.misureAddizionaliTCRUN);
    }

    if (r.sessionID) {
      if (r.sessionID) {
        this.sessionID = r.sessionID;
        // this.scriveLog('Sessione settings:', this.sessionID2);
      }
    }

    if (r.ConnessioneStabilita && r.ConnessioneStabilita !== undefined) {
      if (r.ConnessioneStabilita === 'OK') {
        this.ConnessioneStabilita = r.ConnessioneStabilita;

        // this.LeggeMeasures();
        // this.LeggeEventi();
        // this.LeggeEventiDaTogliere();
        // this.LeggeSLA();

        this.gestisceSelezioneGriglia();
      }
    }

    if (r.datiAddLayers && r.datiAddLayers) {
      this.scriveLog('dati AddLayers', r.datiAddLayers);

      if (this.datiAddLayers2 && this.datiAddLayers2 !== 'empty grid' && this.datiAddLayers2.DataTable
        && this.datiAddLayers2.DataTable.length > 0 && r.datiAddLayers.DataTable) {
          this.datiAddLayers2.DataTable = JSON.parse(JSON.stringify(r.datiAddLayers.DataTable));
      } else {
        this.datiAddLayers2 = 'empty grid'; // null;
        const tm = setTimeout(() => {
          clearTimeout(tm);

          if (r.datiAddLayers && r.datiAddLayers !== null && r.datiAddLayers.v_grid_msg !== undefined) {
            this.messaggioWarningDAL2 = r.datiAddLayers.v_grid_msg;
          } else {
            this.messaggioWarningDAL2 = '';
          }

          this.datiAddLayers2 = JSON.parse(JSON.stringify(r.datiAddLayers));
          this.effettuaAutoFitAL = !this.effettuaAutoFitAL;
        }, 10);
      }
    }

    if (r.datiLookUp && r.datiLookUp) {
      this.datiLookUp2 = JSON.parse(JSON.stringify(r.datiLookUp));
      // this.scriveLog('dati LookUp', this.NumeroFrame, this.datiLookUp2);
      /* if (this.datiModificati.cellTypeM && this.datiModificati.cellTypeM !== '') {
        // this.scriveLog(this.datiModificati.cellTypeM);
        const ct = this.datiModificati.cellTypeM.split(',');
        let sel = '';
        ct.forEach(element => {
          this.datiLookUp2.DataTable.forEach(element2 => {
            if (element === element2.CODE) {
              sel += element2.ROW_ID + ',';
            }
          });
        });
        if (sel.length > 1) {
          sel = sel.substring(0, sel.length - 1);
        }
        this.selezioneCellType = sel;
        this.scriveLog('Setting cell type impostato', this.NumeroFrame, this.selezioneCellType);
      } */
      const tm = setTimeout(() => {
          clearTimeout(tm);
        this.lookupMR = !this.lookupMR;
      }, 100);
    }

    if (r.datiPivot) {
      // if (this.menuVisibile === false && r.datiPivot) {
        this.datiPivotOriginali = JSON.parse(JSON.stringify(r.datiPivot.viewDefinition));
      // }
    }

    if (r.clusterGroup) {
      this.clusterGroup2 = r.clusterGroup;
      // this.scriveLog('Clusters: ', r.clusterGroup);
    }

    // if (this.NumeroFrame === 1) {
      // this.scriveLog('Settings On Changes', r);
    // }

    if (r.disabilitata) {
      // this.scriveLog('Combo disabilitata: ', r.disabilitata);
      this.comboDisabilitata = r.disabilitata;
    }

    if (r.refreshMaschera) {
      // this.scriveLog('Refresh maschera frame ' + this.NumeroFrame);
      this.aggiornaDatiOriginali('refreshMaschera');

      // this.checkSeCiSonoModifiche();
      return;
    }

    if (r.tabSelezionato) {
      if (r.tabSelezionato === 0 || r.tabSelezionato !== undefined) {
        this.scriveLog('Tab Selezionato on change', this.NumeroFrame, r.tabSelezionato);
        this.tabSelezionato2 = r.tabSelezionato;
      }
    }

    if (r.mapName) {
      if (r.mapName !== undefined || r.mapName === '') {
        if (this.Debug === true) {
          this.scriveLog('MapName: on change frame ' + this.NumeroFrame, r.mapName);
        }
        this.datiModificati.mapNameM = r.mapName;
        if (this.datiModificati.mapNameM === '') { 
          this.datiModificati.mapNameM = '<empty>'; 
        }
        // if (this.menuVisibile === false) {
          // this.scriveLog('Cambiato Map name originale frame ' + this.NumeroFrame, this.datiOriginali.MapName);
          // this.datiOriginali.MapName = r.mapName;
        // }
      }
    }

    if (r.Descrizione) {
      // this.scriveLog('sla settings', r);
      this.datiModificati.descrizioneM = r.Descrizione;
      // if (this.menuVisibile === false) {
      //   this.datiOriginali.Descrizione = r.Descrizione;
      // }
    }

    if (r.refreshQuanteMisure) {
      this.aggiornaQuanteMisure();
    }

    if (r.activity) {
      // this.scriveLog('Activity on change frame ' + this.NumeroFrame + ':', r.activity);
      this.datiModificati.activityM = r.activity;
      
      // if (this.menuVisibile === false) {
        this.datiModificati.activityM = r.activity;
        // this.datiOriginali.Activity = r.activity;
      // }
    }

    if (r.geoFilter) {
      this.scriveLog('Settings Geo Filter ' + this.NumeroFrame + ':', r.geoFilter);

      this.datiModificati.geoFilterM = r.geoFilter;

      // if (this.menuVisibile === false) {
      //  this.datiModificati.GeoFilter = this.datiModificati.geoFilterM; // r.geoFilter;
      // }
    }

    if (r.viewGlobal !== undefined) {
      // this.scriveLog('Setting global view', this.NumeroFrame, r.viewGlobal);
      // if (!r.viewGlobal || r.viewGlobal === null) {
      //   this.datiModificati.viewGlobalM = true;
      // } else {
      this.scriveLog('Cambio view global', this.NumeroFrame, r.viewGlobal);

      this.datiModificati.viewGlobalM = r.viewGlobal;
      // }
      // if (this.menuVisibile === false) {
      //   this.datiOriginali.ViewGlobal = r.viewGlobal;
      // }
    }

    if (r.viewAs && r.viewAs) {
      this.scriveLog('Setting view as', r.viewAs);
      this.datiModificati.viewAsM = r.viewAs;
      // alert('VIEW AS Frame ' + this.NumeroFrame + ': '+ this.datiModificati.viewAsM);
      // if (this.menuVisibile === false) {
      //   this.datiOriginali.ViewAs = r.viewAs;
      // }
    }

    /* if (r.measureData) {
      if (this.Debug === true) {
        this.scriveLog('Settings measureData:', r.measureData);
      }
      // if (r.measureData) {
      this.measureDataCompleti = r.measureData;

      if (this.datiModificati.measureM && this.datiModificati.measureM.length > 0) {
        let n = 0;
        const mp = this.measurePassato;
        this.measurePassato = '***';
        this.measureD = new Array();
        this.datiModificati.measureM.forEach(element => {
          const ret = this.ritornadescrizioneMisura(n, element);
          this.measureD.push(ret);
          n++;
        });
        this.measurePassato = mp;
      }
    // }
    } */

    if (r.overlay) {
      // this.scriveLog('Setting overlay', r.overlay);
      /* let contr = r.overlay;

      let ok = false;
      let maxId = 0;
      if (this.measureDataCompleti) {
        this.measureDataCompleti.forEach(element => {
          if (!ok && contr === element.CODE) {
            ok = true;
          }
          if (element.ROW_ID > maxId) {
            maxId = element.ROW_ID;
          }
        });
        if (!ok) {
          // logConsole('Misura mancante overlay', contr);
          const nuovaMisura = {
            CODE: contr,
            DESCRIPTION: contr,
            DISPLAY_NAME: contr,
            FILE_TYPE: "Overlay",
            FOLDER: "New Measure",
            INSERT_TIMESTAMP: "",
            MEASR_CODE: contr,
            NET_TECH: "",
            ROW_ID: maxId + 1,
            TYPE: "2",
            TYPE_STR: "list",
            UPDATE_TIMESTAMP: ""
          }            
          this.measureDataCompleti.push(nuovaMisura);
        }
      }
      // if (this.menuVisibile === false) {
      // setTimeout(() => {
      if (this.measureDataCompleti) {
        setTimeout(() => {
          // logConsole(contr);
          if (contr === 'global_measure') {
            contr = '<GLOBAL MEASURE>';
          }
          this.datiModificati.overlayM = contr;

          // if (this.datiOriginali) {
          //  this.datiOriginali.overlayM = contr;
          // }
        }, 200)
      } */
      this.controllaEsistenzaMisura(r.overlay, 'OVERLAY', -1);
    }

    if (r.overlayCluster) {
      this.controllaEsistenzaMisura(r.overlayCluster, 'OVERLAYCLUSTER', -1);
      // if (this.menuVisibile === false) {
      //   this.datiOriginali.OverlayCluster = r.overlayCluster;
      // }
    }

    if (r.timeFilter) {
      // this.scriveLog('Setting time filter', r.timeFilter);
      if (r.timeFilter === 'All') {
        this.datiModificati.timeFilterM = 1;
      } else {
        if (r.timeFilter === 'Time Range') {
          this.datiModificati.timeFilterM = 2;
        } else {
          if (r.timeFilter === 'Fixed Seconds') {
            this.datiModificati.timeFilterM = 3;
          }
        }
      }
      // this.datiModificati.timeFilterM = r.timeFilter;
      // if (this.menuVisibile === false) {
      //   this.datiOriginali.TimeFilter = this.datiModificati.timeFilterM;
      // }
    }

    if (r.bboxOverViewZoom) {
      if (this.Debug === true) {
        this.scriveLog('Setting bboxOverViewZoom', r.bboxOverViewZoom);
      }
      this.datiModificati.bboxOverViewZoomM = r.bboxOverViewZoom;
      // if (this.menuVisibile === false) {
      //   this.datiOriginali.BboxOverViewZoom = this.datiModificati.bboxOverViewZoomM;
      // }
    }

    if (r.tipoDataset) {
      if (this.Debug === true) {
        this.scriveLog('Setting tipoDataset', r.tipoDataset);
      }
      this.datiModificati.tipoDatasetM = +r.tipoDataset;
      // if (this.menuVisibile === false) {
      //   this.datiOriginali.TipoDataset = this.datiModificati.tipoDatasetM;
      // }
    }

    if (r.HistDisplayAs) {
      if (r.HistDisplayAs !== undefined && r.HistDisplayAs !== '' && r.HistDisplayAs !== null && r.HistDisplayAs.length > 0) {
        // this.scriveLog('Setting tipo histogramma', r.HistDisplayAs);
        this.datiModificati.histDisplayAsM = r.HistDisplayAs;
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.HistDisplayAS = JSON.parse(JSON.stringify(r.HistDisplayAs));
        // }
      }
    }

    if (r.HistDisplayTutto) {
      if (r.HistDisplayTutto !== undefined && r.HistDisplayTutto !== '' && r.HistDisplayTutto !== null && r.HistDisplayTutto.length > 0) {
        // this.scriveLog('Setting tipo histogramma tutto', r.HistDisplayTutto);
        this.datiModificati.HistDisplayTuttoM = r.HistDisplayTutto;
        // if (this.menuVisibile === false) {
        //    this.datiOriginali.HistDisplayTutto = JSON.parse(JSON.stringify(r.HistDisplayTutto));
        // }
      }
    }

    // if (r.showPlanimetry) {
      if (r.showPlanimetry !== undefined) {
        // this.scriveLog('Setting show planimetry', r.showPlanimetry);
        this.datiModificati.showPlanimetryM = r.showPlanimetry;
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.ShowPlanimetry = JSON.parse(JSON.stringify(r.showPlanimetry));
        // }
      }
    // }

    if (r.showAdditionalLayers !== undefined) {
      // this.scriveLog('Setting show planimetry', r.showPlanimetry);
      this.datiModificati.showAdditionalLayersM = r.showAdditionalLayers;
      // logConsole('Show al passato', this.showAdditionalLayers);
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ShowAdditionalLayers = JSON.parse(JSON.stringify(r.showAdditionalLayers));
      // }
    }

    /* if (r.eventiSceltiES) {
      if (r.eventiSceltiES !== undefined && r.eventiSceltiES !== null) {
        // this.scriveLog('Eventi scelti ES Passati', r.eventiSceltiES);
        this.datiModificati.eventiSceltiESM = r.eventiSceltiES;
        // this.riempieArraySelezioneES();
        if (this.menuVisibile === false) {
          this.datiOriginali.EventiSceltiES = JSON.parse(JSON.stringify(r.eventiSceltiES));
        }
      }
    } */

    if (r.tipoEvento) {
      if (this.Debug === true) {
        this.scriveLog('Setting tipo evento', this.NumeroFrame, this.datiModificati.mappaOGraficoM, r.tipoEvento);
      }
      if (this.datiModificati.mappaOGraficoM === 'ES') {
        this.datiModificati.tipoEventoM = 'A';
      } else {
        if (!r.tipoEvento || r.tipoEvento === null) {
          this.datiModificati.tipoEventoM = 'G';
        } else {
          this.datiModificati.tipoEventoM = r.tipoEvento;
        }
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.TipoEvento = r.tipoEvento;
        // }
      }
    }

    if (r.fixedSeconds1) {
      // this.scriveLog('Setting fixed seconds', this.NumeroFrame, r.fixedSeconds1);
      this.datiModificati.fixedSecondsM = r.fixedSeconds1;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.FixedSeconds = r.fixedSeconds1;
      // }
    }

    if (r.styleImpostato) {
      if (this.Debug === true) {
        this.scriveLog('Setting stile impostato', this.NumeroFrame, r.styleImpostato);
      }
      this.datiModificati.styleImpostatoM = r.styleImpostato;
      this.aggiungeCampoStyleSize(+this.datiModificati.styleImpostatoM);
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.styleImpostato = r.styleImpostato;
      // }
    }

    if (r.opacity) {
      if (r.opacity) {
        if (this.Debug === true) {
          this.scriveLog('Opacity impostato', this.NumeroFrame, r.opacity);
        }
        
        if (r.opacity.toString().indexOf('ROW_ID') > -1) {
          this.datiModificati.opacityM = 20;
        } else {
          this.datiModificati.opacityM = r.opacity;
        }

        if (!this.datiModificati.opacityM || this.datiModificati.opacityM === '') {
          this.datiModificati.opacityM = 20;
        }
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.Opacity = this.datiModificati.opacityM; //r.opacity;
        // }
      }
    }

    if (r.cellType) {
      // this.scriveLog(r.cellType);
      /* if (this.datiLookUp2) {
        const ct = r.cellType.split(',');
        let sel = '';
        ct.forEach(element => {
          this.datiLookUp2.DataTable.forEach(element2 => {
            if (element === element2.CODE) {
              sel += element2.ROW_ID + ',';
            }
          });
        });
        if (sel.length > 1) {
          sel = sel.substring(0, sel.length - 1);
        }
        this.selezioneCellType = sel;
      }*/
      if (typeof(r.cell_type) === 'string') {
        this.datiModificati.cellTypeM = JSON.parse(r.cellType);
      } else {
        this.datiModificati.cellTypeM = r.cellType;
      }
     // logConsole('Cell types', this.datiModificati.cellTypeM);
      let a = null;
      try {
        a = JSON.parse(this.datiModificati.cellTypeM);
      } catch(e) {
        this.scriveLog('Parse error', this.datiModificati.cellTypeM);
      }
      if (a) {
        let aa = new Array();
        // this.scriveLog(a);
        a.forEach(element => {
          aa.push(element.ROW_ID);
        });

        this.selezioneCellType = aa;
        
        // logConsole('Cell types selezionate', a, aa);
        // this.scriveLog('Setting cell type impostato', a, aa, this.NumeroFrame,
        //    r.cellType, this.selezioneCellType, this.datiLookUp2);
        this.rinfrescaGrigliaCellTypes = !this.rinfrescaGrigliaCellTypes;
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.CellType = r.cellType;
        // }
      }
    }

    if (r.addLayers && r.addLayers) {
      /* if (this.datiLookUp2) {
        // this.scriveLog(this.datiLookUp2);
        const ct = r.cellType.split(',');
        let sel = '';
        ct.forEach(element => {
          this.datiLookUp2.DataTable.forEach(element2 => {
            if (element === element2.CODE) {
              sel += element2.ROW_ID + ',';
            }
          });
        });
        if (sel.length > 1) {
          sel = sel.substring(0, sel.length - 1);
        }
        this.selezioneCellType = sel;
      }*/
      this.datiModificati.addLayersM = r.addLayers;
      // this.scriveLog(r.addLayers);
      let a = null;
      if (typeof(this.datiModificati.addLayersM) === 'string') {
        try {
          a = JSON.parse(this.datiModificati.addLayersM);
        } catch(e) {
          this.scriveLog('Parse error', this.datiModificati.addLayersM);
        }
      } else {
        a = this.datiModificati.addLayersM;
      }
      if (a && a.length > 0) {
        let aa = new Array();
        // this.scriveLog(a);
        a.forEach(element => {
          aa.push(element.ROW_ID); //  += element.ROW_ID + ',';
        });
        // if (aa.length > 0 ) {
        //   aa = aa.substring(0, aa.length - 1);
        // }
        if (this.Debug === true) {
          this.scriveLog('Add layers settings:', r.addLayers, a, aa);
        }
        this.selezioneAddLayers = aa; //  JSON.parse(JSON.stringify(aa));
        // this.scriveLog('Setting cell type impostato', a, aa, this.NumeroFrame,
        //    r.cellType, this.selezioneCellType, this.datiLookUp2);
        this.rinfrescaGrigliaAddLayers = !this.rinfrescaGrigliaAddLayers;
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.AddLayers = r.addLayers;
        // }
      }
    }

    /* if (r.columnsSettings) {
      if (r.columnsSettings !== undefined) {
        this.datiModificati.columnsSettingsM = r.columnsSettings;
        if (this.datiModificati.columnsSettingsM) {
          // this.scriveLog('Setting columns Settings', this.frameAttivo, this.NumeroFrame,
          //   r.columnsSettings);
          this.creaStrutturaColumnSettings();
        } else {
          this.grigliaColumnSettings = undefined;
        }
      }

      if (this.menuVisibile === false) {
        this.datiOriginali.ColumnsSettings = r.columnsSettings; // JSON.parse(JSON.stringify(r.columnsSettings));
      }
    } */

    if (r.Log) {
      this.Log = r.Log;
    }

    if (r.columnsBars) {
      if (r.columnsBars !== undefined) {
        if (this.Debug === true) {
          // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Setting column bars 1', this.NumeroFrame, r.columnsBars);
        }

        this.datiModificati.columnsBarsM = r.columnsBars;

        // if (this.menuVisibile === false) {
          if (this.datiModificati.columnsBarsM === true || this.datiModificati.columnsBarsM === 'true') {
            this.datiModificati.columnsBarsM = '2';
          }
          if (this.datiModificati.columnsBarsM === false || this.datiModificati.columnsBarsM === 'false') {
              this.datiModificati.columnsBarsM = '3';
          }

          if (!this.datiModificati.columnsBarsM || (this.datiModificati.columnsBarsM !== '1' && this.datiModificati.columnsBarsM !== '2' && this.datiModificati.columnsBarsM !== '3')) {
            this.datiModificati.columnsBarsM = '2';
          }

        //  this.datiOriginali.ColumnsBars = this.datiModificati.columnsBarsM; // r.columnsBars;
        // }

        if (this.Debug === true) {
          // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Setting column bars 2', this.NumeroFrame, this.datiModificati.columnsBarsM);
        }
      }
    }

    // if (r.doubleGraph) {
      if (r.doubleGraph !== undefined) {
        if (this.Debug === true) {
          // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Setting doubleGraph', this.NumeroFrame, r.doubleGraph);
        }

        this.datiModificati.doubleGraphM = r.doubleGraph;

        // if (this.menuVisibile === false) {
        //  this.datiOriginali.doubleGraph = r.doubleGraph;
        // }
      }
    // }

    if (r.eventsMeasure) {
      if (r.eventsMeasure !== undefined) {
        // this.scriveLog('Setting tipo Events Measure', r.eventsMeasure);
        this.datiModificati.eventsMeasureM = r.eventsMeasure;
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.EventsMeasure = r.eventsMeasure;
        // }
      }
    }

    if (r.designInfo) {
      // this.scriveLog('Setting time filter', r.timeFilter);
      this.datiModificati.designInfoM = r.designInfo;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.DesignInfo = r.designInfo;
      // }
    }

    let caricaConf = false;

    if (r.listaCampiAttuale) {
      // this.scriveLog('Setting time filter', r.timeFilter);
      this.datiModificati.listaCampiAttuale = r.listaCampiAttuale;
      caricaConf = true;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.listaCampiAttuale = r.listaCampiAttuale;
      // }
    }

    if (r.act_set && r.act_set) {
      caricaConf = true;
    }

    if (r.tmsMin && r.tmsMin) {
      caricaConf = true;
    }

    if (r.tmsMax && r.tmsMax) {
      caricaConf = true;
    }

    if (r.tmsSelezionato && r.tmsSelezionato) {
      caricaConf = true;
    }

    if (r.tmsGlobaleMin && r.tmsGlobaleMin) {
      caricaConf = true;
    }

    if (r.tmsGlobaleMax && r.tmsGlobaleMax) {
      caricaConf = true;
    }

    if (caricaConf) {
      this.caricaConfig();
      this.datiConfigList = 'empty grid';  
    }

    if (r.mapType) {
      // if (this.NumeroFrame === 1) {
      //   this.scriveLog('mapType', this.NumeroFrame, r.mapType);
      // }
      this.datiModificati.mapTypeM = r.mapType;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.MapType = r.mapType;
      // }
    }

    if (r.isCheckedServingCell !== undefined) {
      if (this.Debug === true) {
        this.scriveLog('Serving Cell settings', r.isCheckedServingCell);
      }
      this.datiModificati.isCheckedServingCellM = r.isCheckedServingCell;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ServingCell = r.isCheckedServingCell;
      // }
    }

    if (r.isCheckedShowPaths !== undefined) {
      // this.scriveLog('Hide Paths', r.isCheckedShowPaths);
      this.datiModificati.isCheckedShowPathsM = r.isCheckedShowPaths;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.isCheckedShowPaths = r.isCheckedShowPaths;
      // }
    }

    if (r.isCheckedShowSelectedPaths !== undefined) {
      // this.scriveLog('Hide Paths', r.isCheckedShowPaths);
      this.datiModificati.isCheckedShowSelectedPathsM = r.isCheckedShowSelectedPaths;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.isCheckedShowPaths = r.isCheckedShowPaths;
      // }
    }

    if (r.ShowRays) {
      if (this.Debug === true) {
        this.scriveLog('Show Rays settings', r.ShowRays);
      }
      this.datiModificati.showRaysM = r.ShowRays;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ShowRays = r.ShowRays;
      // }
    }

    if (r.SartPosition !== undefined) {
      // this.scriveLog('Hide Paths', r.isCheckedShowPaths);
      this.datiModificati.sartPositionM = r.SartPosition;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.SartPosition = r.SartPosition;
      // }
    }

    if (r.measureSMS) {
      // this.scriveLog('Hide Paths', r.isCheckedShowPaths);
      /* const contr = r.measureSMS;
      // logConsole('Misura SMS', contr);

      if (this.measureDataSMS) {
        let ok = false;
        let maxId = 0;
        this.measureDataSMS.forEach(element => {
          if (!ok && contr === element.CODE) {
            ok = true;
          }
          if (element.ROW_ID > maxId) {
            maxId = element.ROW_ID;
          }
        });
        if (!ok) {
          // logConsole('Misura mancante SMSM', contr);
          const nuovaMisura = {
            CODE: contr,
            DESCRIPTION: contr,
            DISPLAY_NAME: contr,
            FILE_TYPE: "SMS",
            FOLDER: "New Measure",
            INSERT_TIMESTAMP: "",
            MEASR_CODE: contr,
            NET_TECH: "",
            ROW_ID: maxId + 1,
            TYPE: "2",
            TYPE_STR: "list",
            UPDATE_TIMESTAMP: ""
          }            
          this.measureDataSMS.push(nuovaMisura);
        }
      } */

    // if (this.menuVisibile === false) {
      // setTimeout(() => {
      // setTimeout(() => {
        this.controllaEsistenzaMisura(r.measureSMS, 'MEASURESMS', -1);
      // }, 200);
    }

    if (r.mappeMS) {
      if (this.Debug === true) {
        this.scriveLog('Mappe style line', r.mappeMS);
      }
      this.datiModificati.mappeMSM = r.mappeMS;
      // if (this.menuVisibile === false) {
      //   this.datiOriginali.MappeMS = r.mappeMS;
      // }
    }

    this.attesaClusterMeasure = true;

    if (r.ClusterMeasure) {
      // // logConsole('Cluster Measure in settings', r.ClusterMeasure);
      // this.controllaEsistenzaMisura(r.ClusterMeasure, 'CLUSTERMEASURE1', -1);
      this.datiModificati.clusterMeasureM = r.ClusterMeasure;
      this.filter1 = r.ClusterMeasure;
      this.ritornaMisura(1, r.ClusterMeasure);
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ClusterMeasure = r.ClusterMeasure;
      // }
    }

    if (r.TextFilter) {
      // const t1 = setInterval(() => {
        // logConsole('Check',this.attesaClusterMeasure);
      //   if (!this.attesaClusterMeasure) {
      //     clearInterval(t1);

          // logConsole('Arrivato filtro 1', r.TextFilter);
          this.datiModificati.textFilterM = r.TextFilter;
          this.txtFilter1 = r.TextFilter.trim();
          // logConsole('Imposto filtro 1 settings su onChange', r.TextFilter);
          // this.lovM1Id = this.datiModificati.textFilterM;

          // this.datiOriginali.textFilterM = r.TextFilter;

          /* if (!this.datiLOV1) {
            this.LeggeDatiLOV(1, this.datiModificati.clusterMeasureM, 'TextFilter1', this.datiModificati.textFilterM);
          } else {
            this.impostaIdLov(1, 'r.TextFilter1');
          } */

          // if (this.menuVisibile === false) {
            // alert('Impostazione valore default lovM1: ' + this.datiModificati.textFilterM);
          //  this.datiOriginali.TextFilter = r.TextFilter;

          // this.lovM1Appo = JSON.parse(JSON.stringify(this.datiModificati.textFilterM));
          this.filtroModificato1 = false;
          // }
      //   }
      // }, 100);
    }

    this.attesaClusterMeasure2 = true;
    
    if (r.ClusterMeasure2) {
      // this.scriveLog('Hide Paths', r.isCheckedShowPaths);
      this.datiModificati.clusterMeasure2M = r.ClusterMeasure2;
      this.filter2 = r.ClusterMeasure2;
      this.ritornaMisura(2, r.ClusterMeasure2);
      // this.controllaEsistenzaMisura(r.ClusterMeasure2, 'CLUSTERMEASURE2', -1);
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ClusterMeasure2 = r.ClusterMeasure2;
      // }
    }

    if (r.TextFilter2) {
      // const t1 = setInterval(() => {
        // logConsole('Check',this.attesaClusterMeasure2, new Date());
      //   if (!this.attesaClusterMeasure2) {
      //     clearInterval(t1);

          // // logConsole('TextFilter2', r.TextFilter2);
          this.datiModificati.textFilter2M = r.TextFilter2;
          this.txtFilter2 = r.TextFilter2.trim();
          // this.lovM2Id = this.datiModificati.textFilter2M;

          // this.datiOriginali.textFilter2M = r.TextFilter2;

          /* if (!this.datiLOV2) {
            this.LeggeDatiLOV(2, this.datiModificati.clusterMeasure2M, 'TextFIlter2', this.datiModificati.textFilter2M);
          } else {
            this.impostaIdLov(2, 'r.TextFilter2');
          } */

          // if (this.menuVisibile === false) {
          //  this.datiOriginali.TextFilter2 = r.TextFilter2;

            // this.lovM2Appo = JSON.parse(JSON.stringify(this.datiModificati.textFilter2M));
            this.filtroModificato2 = false;
      //   }
      // }, 100);
    }

    /* if (r.Lov) {
      // this.scriveLog('Hide Paths', r.isCheckedShowPaths);
      this.datiModificati.lovM = r.Lov;
      if (this.menuVisibile === false) {
        this.datiOriginali.Lov = r.Lov;
      }
    } */

    if (r.Correlation) {
      // this.scriveLog('Hide Paths', r.isCheckedShowPaths);
      this.controllaEsistenzaMisura(r.Correlation, 'CORRELATION', -1);
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.Correlation = r.Correlation;
      // }
    }

    /* if (r.TextLov) {
      // this.scriveLog('Hide Paths', r.isCheckedShowPaths);
      this.datiModificati.textLovM = r.TextLov;
      if (this.menuVisibile === false) {
        this.datiOriginali.TextLov = r.TextLov;
      }
    } */

    if (r.addGlobalLayer) {
      // this.scriveLog('Hide Paths', r.isCheckedShowPaths);
      this.datiModificati.addGlobalLayerM = r.addGlobalLayer;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.AddGlobalLayer = r.addGlobalLayer;
      // }
    }

    if (r.showRaysAllLayer !== undefined) {
      if (this.Debug === true) {
        this.scriveLog('showRaysAllLayer', this.NumeroFrame, r.showRaysAllLayer);
      }
      // logConsole('showRaysAllLayer', this.NumeroFrame, r.showRaysAllLayer);
      this.datiModificati.showRaysAllLayerM = r.showRaysAllLayer;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.showRaysAllLayer = r.showRaysAllLayer;
      // }
    }

    if (r.measureRCM) {
      // this.scriveLog('Hide Paths', r.isCheckedShowPaths);
      this.controllaEsistenzaMisura(r.measureRCM, 'MEASURERCM', -1);
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.MeasureRCM = r.measureRCM;
      // }
    }

    if (r.isCheckedAntenne) {
      if (r.isCheckedAntenne !== undefined) {
        this.datiModificati.isCheckedAntenneM = r.isCheckedAntenne;
        if (this.Debug === true) {
          this.scriveLog('Antenne settings', this.datiModificati.isCheckedAntenneM);
        }
        // logConsole('Antenne al frame', this.datiAntenne, this.datiModificati.isCheckedAntenneM, r.isCheckedAntenne);
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.Antenne = r.isCheckedAntenne;
        // }
      }
    }

    // if (r.isNonSyncEventTime) {
      if (r.isNonSyncEventTime !== undefined) {
        this.datiModificati.isNonSyncEventTimeM = r.isNonSyncEventTime;
        if (this.Debug === true) {
          this.scriveLog('isNonSyncEventTime settings', this.datiModificati.isNonSyncEventTimeM);
        }
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.isNonSyncEventTime = r.isNonSyncEventTime;
        // }
      }
    // }
      if (r.isStandAloneMR !== undefined) {
        this.datiModificati.isStandAloneMR = r.isStandAloneMR;
        if (this.Debug === true) {
          this.scriveLog('isStandAloneMR settings', this.datiModificati.isStandAloneMR);
        }
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.isNonSyncEventTime = r.isNonSyncEventTime;
        // }
      }

  if (r.viewModeMS !== undefined) {
      const viewModeMS = r.viewModeMS;
      if (this.Debug === true) {
        this.scriveLog('viewModeMS settings',viewModeMS);
      }
      let ok = false;
      this.viewModes.forEach(element => {
        if (!ok && element.name === r.viewModeMS) {
          ok = true;
        }
      });
      if (!ok) {
        this.viewModes.push({name: r.viewModeMS});
        this.viewModes.sort((a, b) => a.name.localeCompare(b.name));
        this.viewModes = JSON.parse(JSON.stringify(this.viewModes));
      }
      this.datiModificati.viewModeMS = r.viewModeMS;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.viewModeMS = r.viewModeMS;
      // }
    }

  if (r.flowTypeMS !== undefined) {
      this.datiModificati.flowTypeMS = r.flowTypeMS;
      if (this.Debug === true) {
        this.scriveLog('flowTypeMS settings', this.datiModificati.flowTypeMS);
      }
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.viewModeMS = r.viewModeMS;
      // }
    }

    if (r.showAxisX) {
      if (r.showAxisX !== undefined) {
        this.datiModificati.showAxisXM = r.showAxisX;
        if (this.Debug === true) {
          this.scriveLog('Show Axis X settings', this.datiModificati.showAxisXM);
        }
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.ShowAxisX = r.showAxisX;
        // }
      }
    }

    if (r.heightChart) {
      if (r.heightChart !== undefined) {
        this.datiModificati.heightChartM = r.heightChart;
        if (this.Debug === true) {
          this.scriveLog('Show heightChart settings', this.datiModificati.heightChartM);
        }
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.HeightChart = r.heightChart;
        // }
      }
    }

    if (r.tipoDatiLayoutM) {
      if (r.tipoDatiLayoutM !== undefined) {
        this.datiModificati.tipoDatiLayoutM = r.tipoDatiLayoutM;
        if (this.Debug === true) {
          this.scriveLog('tipoDatiLayoutM settings', this.datiModificati.tipoDatiLayoutM);
        }
        // if (this.menuVisibile === false) {
        //  this.datiOriginali.tipoDatiLayoutM = r.tipoDatiLayoutM;
        // }
      }
    }

    if (r.measurePassato) {
      // if (this.Debug === true) {
      //   // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Misure frame ' + this.NumeroFrame, r.measurePassato);
      // }

      if (r.measurePassato !== null) {
        const m3 = r.measurePassato;
        let i = 0;
        m3.forEach(element2 => {
          this.controllaEsistenzaMisura(element2, 'MEASURE', i);
          i++;
        });

        setTimeout(() => {
          this.datiModificati.measureM = m3;

          let n = 0;
          const mp = r.measurePassato;
          this.measurePassato = '***';
          this.measureD = new Array();
          this.datiModificati.measureM.forEach(element => {
            const ret = this.ritornadescrizioneMisura(n, element);
            this.measureD.push(ret);
            n++;
          });
          this.measurePassato = mp;
        }, 100);
      } else {
        // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 13');
        this.datiModificati.measureM = new Array();
        for (let i = 0; i <= this.Utils.quanteMisure; i++) {
          this.datiModificati.measureM.push('');
        }
        // logConsole('Impostazione misure 2', this.datiModificati.measureM);
        if (this.Debug === true) {
          this.scriveLog('Pulisco Misure passate ai settaggi', this.NumeroFrame, this.datiModificati.measureM, this.sla2);
        }
      }

      // // logConsole('SETTINGS: Creo struttura misure', this.datiModificati.measureM);
      this.creaStrutturaMisure(true);
      if (this.Debug === true) {
        this.scriveLog('Misure passate ai settaggi 2', this.NumeroFrame, this.datiModificati.measureM, this.sla2);
      }
  // if (this.NumeroFrame === 3) {
      //   this.scriveLog('Misure frame ' + this.NumeroFrame, '*' + this.datiModificati.measureM + '*');
      // }

      // // logConsole('SETTINGS: Creata struttura misure. Numero: ', this.quanteMisure);

      this.measureD = this.ritornaTutteDescrizioniMisura();
      this.measureDaDisegnare = new Array();
      for (let i = 0; i <= this.quanteMisure; i ++) {
        this.measureDaDisegnare.push({id: i});
      }

      // if (this.menuVisibile === false) {
        // this.scriveLog(r.measurePassato);
        // if (r.measurePassato !== undefined) {
        //  this.datiOriginali.Measure = JSON.parse(JSON.stringify(this.datiModificati.measureM)); // r.measurePassato;
        // }
      // }
    }

    if (r.slaGroup) {
      // this.scriveLog('sla settings', r);
      this.slaGroup2 = r.slaGroup;
    }

    if (r.slaValue) {
      // this.scriveLog('Sla value. Frame: ' + this.NumeroFrame, r.slaValue);
      this.datiModificati.slaValue2M = r.slaValue;
      // if (this.menuVisibile === false) {
      //   this.datiOriginali.SLA = r.slaValue;
      // }
    }

    if (r.listaEventiDaPassare) {
      // const tm = setTimeout(() => {
      //     clearTimeout(tm);
        const rr = r.listaEventiDaPassare;
        // logConsole('Eventi da passare', rr);

        if (this.Debug === true) {
          this.scriveLog('Eventi locali. Eventi da passare frame ' + this.NumeroFrame, rr); // , JSON.parse(rr));
        }

        if (rr) {
          // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'EVENT_DFN chiamata', this.NumeroFrame);
          if (this.Utils.strutturaGrigliaDiBase === undefined) {
            this.LeggeEventi();

            /* let subscribeE;
            subscribeE = Observable.timer(0, 1000)
              .take(32000)
              .subscribe(() => {
                if (this.Utils.strutturaGrigliaDiBase) {
                  subscribeE.unsubscribe();

                  this.gestisceEventiArrivati(rr);
                }
            }) */

            const t = setInterval(() => {
              if (this.Utils.strutturaGrigliaDiBase) {
                clearInterval(t)

                this.gestisceEventiArrivati(rr, true);
              }
            }, 1000);
          } else {
            this.gestisceEventiArrivati(rr, true);
          }

          const t1 = setTimeout(() => {
            this.aggiornaDatiOriginali('ListaEventiDaPassare');
          }, 1500);
          // if (this.menuVisibile === false) {
          //   this.datiOriginali.ListaDaPassare = this.datiModificati.datiEventiDaPassareM;
          // }
        }
      // }, 100);
    }

    if (r.plmn) {
      // this.scriveLog('sla settings', r);
      this.datiModificati.plmnM = r.plmn;
      // if (this.menuVisibile === false) {
      //   this.datiOriginali.PLMN = r.plmn;
      // }
    }

    /* if (r.viewGlobal) {
      // this.scriveLog('Overview / Zoom settings', r.viewGlobal);
      if (r.viewGlobal === null) {
        this.datiModificati.viewGlobalM = true;
      } else {
        this.datiModificati.viewGlobalM = r.viewGlobal;
      }
      if (this.menuVisibile === false) {
        this.datiOriginali.ViewGlobal = r.viewGlobal;
      }
    }

    if (r.viewAs) {
      // this.scriveLog('view global settings', r.viewGlobal);
      this.datiModificati.viewAsM = r.viewAs;
      if (this.menuVisibile === false) {
        this.datiOriginali.ViewAs = r.viewAs;
      }
    }

    if (r.overlay) {
      // this.scriveLog('view global settings', r.viewGlobal);
      this.datiModificati.overlayM = r.overlay;
      if (this.menuVisibile === false) {
        this.datiOriginali.Overlay = r.overlay;
      }
    }

    if (r.overlayCluster) {
      this.scriveLog('Overlay cluster settings', r.overlayCluster);
      this.datiModificati.overlayClusterM = r.overlayCluster;
      if (this.menuVisibile === false) {
        this.datiOriginali.OverlayCluster = r.overlayCluster;
      }
    }

    if (r.timeFilter) {
      // this.scriveLog('Setting time filter', r.timeFilter);
      this.datiModificati.timeFilterM = r.timeFilter;
      if (this.menuVisibile === false) {
        this.datiOriginali.TimeFilter = r.timeFilter;
      }
    }

    if (r.designInfo) {
      // this.scriveLog('Setting time filter', r.timeFilter);
      this.datiModificati.designInfoM = r.designInfo;
      if (this.menuVisibile === false) {
        this.datiOriginali.DesignInfo = r.designInfo;
      }
    } */

    if (r.shownEvents !== undefined) {
      if (this.Debug === true) {
        this.scriveLog('Shown events ' + this.NumeroFrame, r.shownEvents);
      }
      this.datiModificati.shownEventsM = r.shownEvents;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ShownEvents = r.shownEvents;
      // }
    }

    if (r.showMultiSelect !== undefined) {
      this.showMultiSelect = r.showMultiSelect;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ShowMultiSelect = r.showMultiSelect;
      // }
    }

    if (r.showMeasures !== undefined) {
      this.scriveLog('Show Measures in settings ' + this.NumeroFrame, r.showMeasures);
      this.datiModificati.showMeasuresM = r.showMeasures;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ShowMeasures = r.showMeasures;
      // }
    }

    if (r.showMeasuresS !== undefined) {
      // this.scriveLog('Net tech on change frame ' + this.NumeroFrame, r.netTech);
      this.datiModificati.showMeasuresSM = r.showMeasuresS;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ShowMeasuresS = r.showMeasuresS;
      // }
    }

    if (r.showCoverageMeasures !== undefined) {
      this.scriveLog('showCoverageMeasures frame ' + this.NumeroFrame, r.showCoverageMeasures);
      this.datiModificati.showCoverageMeasuresM = r.showCoverageMeasures;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ShowCoverageMeasures = r.showCoverageMeasures;
      // }
    }

    if (r.showVoiceCallMeasures !== undefined) {
      this.scriveLog('showVoiceCallMeasures frame ' + this.NumeroFrame, r.showVoiceCallMeasures);
      this.datiModificati.showVoiceCallMeasuresM = r.showVoiceCallMeasures;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ShowVoiceCallMeasures = r.showVoiceCallMeasures;
      // }
    }

    if (r.showDataMeasures !== undefined) {
      this.scriveLog('showDataMeasures frame ' + this.NumeroFrame, r.showDataMeasures);
      this.datiModificati.showDataMeasuresM = r.showDataMeasures;
      // if (this.menuVisibile === false) {
      //  this.datiOriginali.ShowDataMeasures = r.showDataMeasures;
      // }
    }

    if (r.showSamplesMeasures) {
      // this.scriveLog('Net tech on change frame ' + this.NumeroFrame, r.netTech);
      this.datiModificati.showSamplesMeasuresM = r.showSamplesMeasures;
      // if (this.menuVisibile === false) {
      //    this.datiOriginali.ShowSamplesMeasures = r.showSamplesMeasures;
      // }
    }

    if (r.squareMeters) {
      if (this.Debug === true) {
        this.scriveLog('Square meters on change frame ' + this.NumeroFrame, r.squareMeters);
      }
      this.datiModificati.squareMetersM = r.squareMeters;
      // if (this.menuVisibile === false) {
      //    this.datiOriginali.SquareMeters = r.squareMeters;
      // }
    }

    if (r.mosaicStyle) {
      // this.scriveLog('Square meters on change frame ' + this.NumeroFrame, r.squareMeters);
      this.datiModificati.mosaicStyleM = r.mosaicStyle;
      // if (this.menuVisibile === false) {
      //    this.datiOriginali.MosaicStyle = r.mosaicStyle;
      // }
    }

    if (r.measureType) {
      // this.scriveLog('Measure type on change frame ' + this.NumeroFrame, r.measureType);
      this.datiModificati.measureTypeM = r.measureType;
      // if (this.menuVisibile === false) {
      //    this.datiOriginali.MeasureType = r.measureType;
      // }
    }

    if (r.modificaChart !== undefined) {
      // this.scriveLog('Net tech on change frame ' + this.NumeroFrame, r.netTech);
      this.datiModificati.modificaChartM = r.modificaChart;
      // if (this.menuVisibile === false) {
      //    this.datiOriginali.ModificaChart = r.modificaChart;
      // }
    }

    if (r.doNotSetGM !== undefined) {
      // this.scriveLog('Net tech on change frame ' + this.NumeroFrame, r.netTech);
      this.datiModificati.doNotSetGMM = r.doNotSetGM;
      // if (this.menuVisibile === false) {
      //    this.datiOriginali.DoNotSetGM = r.doNotSetGM;
      // }
    }

    if (r.netTech) {
      // this.scriveLog('Net tech on change frame ' + this.NumeroFrame, r.netTech);
      this.datiModificati.netTechM = r.netTech;
      // if (this.menuVisibile === false) {
      //    this.datiOriginali.NetTech = r.netTech;
      // }
    }

    if (r.bandWidth) {
      // this.scriveLog('sla settings', r);
      this.datiModificati.bandWidthM = r.bandWidth;
      // if (this.menuVisibile === false) {
      //    this.datiOriginali.BandWidth = r.bandWidth;
      // }
    }

    if (r.checkSeverity) {
      // this.scriveLog('check severity', r);
      this.datiModificati.severityM = r.checkSeverity;
      // if (this.menuVisibile === false) {
      //    this.datiOriginali.Severity = r.checkSeverity;
      // }
    }

    if (r.countHistogram) {
      // this.scriveLog('sla settings', r);
      this.datiModificati.countHistogram = r.countHistogram;
      // if (this.menuVisibile === false) {
      //    this.datiOriginali.countHistogram = r.countHistogram;
      // }
    }

    /* if (r.settaMascheraVuota !== undefined && r.settaMascheraVuota === true) {
      const tm = setTimeout(() => {
        clearTimeout(tm);

        this.aggiornaDati('Inizio');
        this.aggiornaDatiOriginali('SettaMascheraVuota');
        this.modificheEffettuate = false;
      }, 100);
    } else { */
      this.aggiornaDatiOriginali('OnChangeFine');
    // }
  }

  /* riempieArraySelezioneES() {
    const s = new Array();
    this.datiModificati.eventiSceltiESM.forEach(element => {
      s.push(element.ROW_ID);
    });
    this.impostaSelezioneES = s;
    // this.scriveLog('Selezione impostata:', this.impostaSelezioneES, this.datiModificati.eventiSceltiESM);
  } */
  converteStringaInJSON(val) {
    let ee;
    if (typeof(val) === 'string') {
      const vv = val.substring(0, 3);
      // this.scriveLog('Prefisso:', vv);
      if (val !== undefined && val !== '' && val !== 'empty' && val !== 'empty grid' && vv !== '***') {
        // this.scriveLog('Valore da parsare:', val);
        ee  = JSON.parse(val);
        if (typeof(ee) === 'string' && ee !== 'empty grid') {
          if (ee !== '') {
            // this.scriveLog('->' + ee + '<-');
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
  
  gestisceEventiArrivati(rr, aggiornaDatiOriginali) {
    if (rr) {
      // this.scriveLog(this.Utils.strutturaGrigliaDiBase);
      // this.scriveLog('Dati Eventi Da Passare', this.NumeroFrame, rr);
      // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Struttura griglia di base', this.Utils.strutturaGrigliaDiBase);
      // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Lista da passare', this.datiOriginali.ListaDaPassare);

      if (this.Debug === true) {
        this.scriveLog('Eventi locali. Eventi da passare 1', rr, this.datiModificati.datiEventiDaPassareM);
      }

      this.datiModificati.datiEventiDaPassareM = JSON.parse(JSON.stringify(this.Utils.strutturaGrigliaDiBase));
      this.datiModificati.datiEventiDaPassareM.DataTable = this.converteStringaInJSON(rr);
      // this.datiOriginali.ListaDaPassare = this.datiModificati.datiEventiDaPassareM.DataTable;
      if (this.Debug === true) {
        this.scriveLog('Eventi locali. Eventi da passare 2', this.datiModificati.datiEventiDaPassareM);
      }

      let title = 'Events Selected';
      if (this.datiModificati.datiEventiDaPassareM.GridProperty && this.datiModificati.datiEventiDaPassareM.GridProperty[0].GridName) {
        title = this.datiModificati.datiEventiDaPassareM.GridProperty[0].GridName;
      }
      this.datiModificati.datiEventiDaPassareM.GridProperty[0].GridName = title;
      this.datiModificati.datiEventiDaPassareM.GridProperty[0].ItemsPerPage = "25"

      this.EventiSelezionati = JSON.parse(JSON.stringify(this.datiModificati.datiEventiDaPassareM.DataTable));
      if (this.Debug === true) {
        this.scriveLog('Eventi locali. Eventi da passare. Eventi selezionati', this.EventiSelezionati);
      }

      // if (this.menuVisibile === false) {
      //   this.datiOriginali.listaEventiDaPassare = JSON.parse(JSON.stringify(this.datiModificati.datiEventiDaPassareM));
      // }

      if (aggiornaDatiOriginali) {
        this.listaEventiDaPassareOriginali = JSON.parse(JSON.stringify(this.datiModificati.datiEventiDaPassareM));
        // logConsole('Liste eventi', this.listaEventiDaPassareOriginali, this.datiModificati.datiEventiDaPassareM);
      }


      // this.scriveLog(this.EventiSelezionati);
      if (this.EventiSelezionati) {
        if (this.Debug === true) {
          this.scriveLog('Eventi locali. Tolgo eventi selezionati da listona', this.EventiSelezionati);
        }

        this.ToglieGliEventiDaGrigliaMettere();
      }

      // logConsole('Griglia eventi', this.datiModificati.datiEventiDaPassareM);

      this.gestisceSelezioneGriglia();

      this.EventiSelezionati = new Array();
      this.pulisceSelezioneDaTogliere = 'OK';

      // this.scriveLog(this.NumeroFrame, this.datiModificati.datiEventiDaPassareM);
    } else {
      this.datiModificati.datiEventiDaPassareM = JSON.parse(JSON.stringify(this.Utils.strutturaGrigliaDiBase));
      // this.datiOriginali.ListaDaPassare = 'empty grid';
    }

    this.FaIlRefreshDelleGriglie();
  }

  aggiornaQuanteMisure() {
    // // logConsole('SETTINGS: Tipo mappa, controllo quante misure', this.datiModificati.mappaOGraficoM);

    switch (this.datiModificati.mappaOGraficoM) {
      case 'MC':
        this.quanteMisure = this.Utils.quanteMisureGrafici - 1;
        this.creaArrayMisure();
        this.measureDaDisegnare = this.datiModificati.measureM;
        break;
      case 'M':
        this.quanteMisure = this.Utils.quanteMisure;
        this.tagliaArrayMisure();
        this.measureDaDisegnare = new Array();
        for (let i = 0; i <= this.quanteMisure; i++) {
          this.measureDaDisegnare.push('');
        }
        break;
      case 'PS':
        this.quanteMisure = this.Utils.quanteMisureScatter;
        this.creaArrayMisure();
        this.measureDaDisegnare = new Array();
        for (let i = 0; i <= this.quanteMisure; i++) {
          this.measureDaDisegnare.push('');
        }
        break;
      case 'PT':
        this.quanteMisure = this.Utils.quanteMisurePivot;
        this.creaArrayMisure();
        this.measureDaDisegnare = new Array();
        for (let i = 0; i <= this.quanteMisure; i++) {
          this.measureDaDisegnare.push('');
        }
        break;
      case 'AH':
        this.quanteMisure = this.Utils.quanteMisureHistogram;
        this.creaArrayMisure();
        this.measureDaDisegnare = new Array();
        for (let i = 0; i <= this.quanteMisure; i++) {
          this.measureDaDisegnare.push('');
        }
        break;
      case 'PC':
      case 'AI':
        this.quanteMisure = this.Utils.quanteMisurePareto;
        this.creaArrayMisure();
        this.measureDaDisegnare = new Array();
        for (let i = 0; i <= this.quanteMisure; i++) {
          this.measureDaDisegnare.push('');
        }
        break;
      case 'AR':
        this.quanteMisure = this.Utils.quanteMisurePareto;
        this.creaArrayMisure();
        this.measureDaDisegnare = new Array();
        for (let i = 0; i <= this.quanteMisure; i++) {
          this.measureDaDisegnare.push('');
        }
        break;
    }
    
    // // logConsole('SETTINGS: Quante misure', this.quanteMisure, this.measureDaDisegnare);
    // this.scriveLog('Misure: ', this.quanteMisure);
  }

  azzeraValoriPagina() {
    this.tabSelezionato2 = 0;
    // this.scriveLog('Entrato in init settings');

    this.infoKeyVisibileMettere = false;
    this.infoKeyVisibileTogliere = false;

    this.EventiSelezionati = new Array();
    this.EventiDeselezionati = new Array();

    this.selezioneMultiplaTogliere = true;
    this.selezioneMultiplaMettere = false;

    this.refreshGrigliaMettere = false;
    this.refreshGrigliaTogliere = false;

    this.modificheEffettuate = false;

    this.scriveLog('Eventi locali. Azzera valori griglie');
    this.datiModificati.datiEventiDaPassareM = 'empty grid';
    this.datiEventiDaMettere2 = 'empty grid';
  }

  controlloCampi(campo, uno, due) {
    /* if (this.modificheEffettuate === true) {
      return;
    } */

    let u = uno;
    let d = due;

    const tipoU = typeof(u);
    if (tipoU === 'object') { u = JSON.stringify(u); }
    const tipoD = typeof(d);
    if (tipoD === 'object') { d = JSON.stringify(d); }

    if (tipoU === 'string' && u) {
      while (u.indexOf('"') > -1) {
        u = u.replace('"', '');
      }
      if (u.indexOf('[') > -1 && u.indexOf(']') > -1) {
        let uu = u.replace('[', '').replace(']', '');
        while (uu.indexOf(',') > -1) {
          uu = uu.replace(',', '').trim();
        }
        // // logConsole('uu: ', campo, uu);
        if (!uu || uu === '') {
          u = '';
        }
      }
    } else {
      if (tipoU === 'string' && !u) {
        u = '';
      }
    }
    if (tipoD === 'string' && d) {
      while (d.indexOf('"') > -1) {
        d = d.replace('"', '');
      }
      if (d.indexOf('[') > -1 && d.indexOf(']') > -1) {
        let dd = d.replace('[', '').replace(']', '');
        while (dd.indexOf(',') > -1) {
          dd = dd.replace(',', '').trim();
        }
        // // logConsole('dd: ', campo, dd);
        if (!dd || dd === '') {
          d = '';
        }
      }
      if (d.trim() === 'null' || d === null || d === undefined || d === 'undefined') {
        d = '';
      }
    } else {
      if (tipoD === 'string' && !d) {
        d = '';
      }
    }

    // // logConsole('Tipo u', campo, tipoU, u);
    // // logConsole('Tipo d', campo, tipoD, d);

    if (u === 'empty grid' || u === undefined || u === null || u === 'undefined' || u === 'null') {
      if (tipoU === 'boolean') {
        u = false;
      } else {
        if (tipoU === 'string') {
          if (u === 'empty grid' && d === '') {
            if (d = '\"\"') { d = ''; }

            u = '';
          } else {
            u = '';
          }
        } else {
          if (tipoU === 'undefined') {
            if (tipoD === 'undefined') {
              u = d;
            } else {
              u = true;
            }
          }
        }
      }
    } else {
    }

    // if (u !== d && d) {
    if (u !== d) { // && (u && d)) {
      // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Valori diversi su campo \'' + campo + '\' del frame ' + this.NumeroFrame + ':', u, d);
      logConsole('Valori diversi su campo \'' + campo + '\' del frame ' + this.NumeroFrame + ':', 
        '>' + u + '<', '(Tipo ' + tipoU +')',  '>' + d + '< (Tipo ' + tipoD + ')');
      this.valoriDiversi.push(campo);

      this.modificheEffettuate = true;
    }
  }

  valoriDiversi;

  checkSeCiSonoModifiche() {
    if (!this.puoEffettuareControlli || !this.datiOriginali) {
      return;
    }

    this.valoriDiversi = new Array();

    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.modificheEffettuate = false;

      const tipoFrame = this.datiModificati.mappaOGraficoM;
      this.controlloCampi('Frame Name', this.datiOriginali.mapNameM, this.datiModificati.mapNameM);
      this.controlloCampi('Frame Description', this.datiOriginali.descrizioneM, this.datiModificati.descrizioneM);
      this.controlloCampi('Data View', this.datiOriginali.mappaOGraficoM, this.datiModificati.mappaOGraficoM);
      // this.controlloCampi('Activity', this.datiOriginali.activityM, this.datiModificati.activityM);

      this.controlloCampi('Show Additional Layer', this.datiOriginali.showAdditionalLayersM, this.datiModificati.showAdditionalLayersM);
      this.controlloCampi('SaRT Position', this.datiOriginali.sartPositionM, this.datiModificati.sartPositionM);
      this.controlloCampi('Show Rays All Layer', this.datiOriginali.showRaysAllLayerM, this.datiModificati.showRaysAllLayerM);
      this.controlloCampi('Opacity', this.datiOriginali.opacityM, this.datiModificati.opacityM);
      this.controlloCampi('View Global', this.datiOriginali.viewGlobalM, this.datiModificati.viewGlobalM);
      this.controlloCampi('Map Type', this.datiOriginali.mapTypeM, this.datiModificati.mapTypeM);
      this.controlloCampi('Mappe MS', this.datiOriginali.mappeMSM, this.datiModificati.mappeMSM);
      this.controlloCampi('Show Planimetry', this.datiOriginali.showPlanimetryM, this.datiModificati.showPlanimetryM);
      this.controlloCampi('Style Size', this.datiOriginali.styleImpostatoM, this.datiModificati.styleImpostatoM);
      this.controlloCampi('Show Paths', this.datiOriginali.isCheckedShowPathsM, this.datiModificati.isCheckedShowPathsM);
      this.controlloCampi('Show Selected Paths', this.datiOriginali.isCheckedShowSelectedPathsM, this.datiModificati.isCheckedShowSelectedPathsM);
      this.controlloCampi('Show Rays', this.datiOriginali.showRaysM, this.datiModificati.showRaysM);
      this.controlloCampi('Serving Cell', 
        this.datiOriginali.isCheckedServingCellM === null ? false : this.datiOriginali.isCheckedServingCellM, 
        this.datiModificati.isCheckedServingCellM === null ? false : this.datiModificati.isCheckedServingCellM);
      this.controlloCampi('Measure RCM', this.datiOriginali.measureRCM, this.datiModificati.measureRCM);
      this.controlloCampi('Antenne', this.datiOriginali.isCheckedAntenneM, this.datiModificati.isCheckedAntenneM);
      this.controlloCampi('Geo Filter', this.datiOriginali.geoFilterM, this.datiModificati.geoFilterM);
      this.controlloCampi('Layout', this.datiOriginali.tipoDatiLayoutM, this.datiModificati.tipoDatiLayoutM);
      this.controlloCampi('Dataset', this.datiOriginali.tipoDatasetM, this.datiModificati.tipoDatasetM);

      // logConsole('Controllo filter e text filter', this.filter1, this.txtFilter1);
      this.controlloCampi('Filter 1', this.datiOriginali.clusterMeasureM, this.filter1 ? this.filter1 : '');
      this.controlloCampi('Filter 2', this.datiOriginali.clusterMeasure2M, this.filter2 ? this.filter2 : '');
      this.controlloCampi('Text Filter 1', this.datiOriginali.textFilterM, this.txtFilter1 ? this.txtFilter1 : '');
      this.controlloCampi('Text Filter 2', this.datiOriginali.textFilter2M, this.txtFilter2 ? this.txtFilter2 : '');

      this.controlloCampi('Correlation', this.datiOriginali.correlationM, this.datiModificati.correlationM);
      this.controlloCampi('Overview/Zoom', this.datiOriginali.viewGlobalM, this.datiModificati.viewGlobalM);
      this.controlloCampi('Map Measure Style', this.datiOriginali.mappeMSM, this.datiModificati.mappeMSM);
      this.controlloCampi('Show Planimetry', this.datiOriginali.showPlanimetryM, this.datiModificati.showPlanimetryM);

      // logConsole('Controllo misure', this.datiOriginali.measureM, this.datiModificati.measureM);
      this.controlloCampi('Measure', 
        this.sistemaArrayMisure(this.datiOriginali.measureM), 
        this.sistemaArrayMisure(this.datiModificati.measureM)
      );
      this.controlloCampi('Show Measures', this.datiOriginali.showMeasuresM, this.datiModificati.showMeasuresM);

      this.controlloCampi('Non Sync Event Time', this.datiOriginali.isNonSyncEventTimeM, this.datiModificati.isNonSyncEventTimeM);
      this.controlloCampi('Stand Alone MR', this.datiOriginali.isStandAloneMR, this.datiModificati.isStandAloneMR);
      this.controlloCampi('SLA', this.datiOriginali.slaValue2M, this.datiModificati.slaValue2M);

      this.controlloCampi('View Mode', this.datiOriginali.viewModeMS, this.datiModificati.viewModeMS);
      this.controlloCampi('Flow Type', this.datiOriginali.flowTypeMS, this.datiModificati.flowTypeMS);

      let u = '';
      if (this.listaEventiDaPassareOriginali && this.listaEventiDaPassareOriginali.DataTable) {
        u = this.listaEventiDaPassareOriginali.DataTable;
      } else {
        u = '';
      }

      let d = '';
      if (this.datiModificati.datiEventiDaPassareM && this.datiModificati.datiEventiDaPassareM.DataTable) {
        d = this.datiModificati.datiEventiDaPassareM.DataTable;
      } else {
        d = '';
      }

      // this.scriveLog('Lista eventi originale:', u);
      // this.scriveLog('Lista eventi modificata:', d);

      this.controlloCampi('Events List',
                          JSON.stringify(u),
                          JSON.stringify(d));
      this.controlloCampi('PLMN', this.datiOriginali.plmnM, this.datiModificati.plmnM);
      this.controlloCampi('Net Tech', this.datiOriginali.netTechM, this.datiModificati.netTechM);
      this.controlloCampi('BandWidth', this.datiOriginali.bandWidthM, this.datiModificati.bandWidthM);
      this.controlloCampi('Count Histogram', this.datiOriginali.countHistogram, this.datiModificati.countHistogram);
      this.controlloCampi('Severity', this.datiOriginali.severityM, this.datiModificati.severityM);
      this.controlloCampi('View As', this.datiOriginali.viewAsM, this.datiModificati.viewAsM);
      this.controlloCampi('Overlay', this.datiOriginali.overlayM, this.datiModificati.overlayM);
      this.controlloCampi('Overlay Cluster', this.datiOriginali.overlayClusterM, this.datiModificati.overlayClusterM);
      this.controlloCampi('Time Filter', this.datiOriginali.timeFilterM, this.datiModificati.timeFilterM);
      this.controlloCampi('BBOX', this.datiOriginali.bboxOverViewZoomM, this.datiModificati.bboxOverViewZoomM);
      // this.controlloCampi('DesignInfo', this.datiOriginali.designInfoM, this.datiModificati.designInfoM);
      /* if (this.datiPivot !== undefined) {
        this.controlloCampi('ViewPivot', this.datiPivotOriginali, this.datiPivot.viewDefinition);
      } */
      // this.scriveLog(JSON.stringify(this.datiOriginali.HistDisplayAS), JSON.stringify(this.datiModificati.histDisplayAsM));
      this.controlloCampi('Hist Display AS', this.datiOriginali.histDisplayAsM, this.datiModificati.histDisplayAsM);
      this.controlloCampi('Hist Display ', this.datiOriginali.HistDisplayTuttoM, this.datiModificati.HistDisplayTuttoM);
      this.controlloCampi('Columns Bars', this.datiOriginali.columnsBarsM, this.datiModificati.columnsBarsM);
      this.controlloCampi('Double Graph', this.datiOriginali.doubleGraphM, this.datiModificati.doubleGraphM);
      this.controlloCampi('Events Measure', this.datiOriginali.eventsMeasureM, this.datiModificati.eventsMeasureM);
      // this.controlloCampi('ColumnsSettings', this.datiOriginali.ColumnsSettings, this.datiModificati.columnsSettingsM);
      this.controlloCampi('Event Type', this.datiOriginali.tipoEventoM, this.datiModificati.tipoEventoM);
      /* this.controlloCampi('EventiSceltiES',
        JSON.stringify(this.datiOriginali.EventiSceltiES),
        JSON.stringify(this.datiModificati.eventiSceltiESM)); */
      this.controlloCampi('Fixed Seconds', this.datiOriginali.fixedSecondsM, this.datiModificati.fixedSecondsM);
      this.controlloCampi('Cell Type',this.datiOriginali.cellTypeM,this.datiModificati.cellTypeM);
      this.controlloCampi('Add Layers', this.sistemaAddLayers(this.datiOriginali.addLayersM), this.sistemaAddLayers(this.datiModificati.addLayersM));
      this.controlloCampi('Shown Events', this.datiOriginali.shownEventsM, this.datiModificati.shownEventsM);
      this.controlloCampi('Refresh Measures', this.datiOriginali.modificaChartM, this.datiModificati.modificaChartM);
      // this.controlloCampi('DoNotSetGM', this.datiOriginali.doNotSetGMM, this.datiModificati.doNotSetGMM);
      this.controlloCampi('Square Meters', 
        this.sistemaSquareMeters(this.datiOriginali.squareMetersM), 
        this.sistemaSquareMeters(this.datiModificati.squareMetersM)
      );
      this.controlloCampi('Measure Type', this.datiOriginali.measureTypeM, this.datiModificati.measureTypeM);
      this.controlloCampi('Mosaic Style', this.datiOriginali.mosaicStyleM, this.datiModificati.mosaicStyleM);
      this.controlloCampi('Measure SMS', this.datiOriginali.measureSMSM, this.datiModificati.measureSMSM);
      this.controlloCampi('Show Measures S', 
        this.datiOriginali.showMeasuresSM === null ? false : this.datiOriginali.showMeasuresSM, 
        this.datiModificati.showMeasuresSM === null ? false : this.datiModificati.showMeasuresSM
      );
      this.controlloCampi('Show Coverage Measures', this.datiOriginali.showCoverageMeasuresM, this.datiModificati.showCoverageMeasuresM);
      this.controlloCampi('Show Voice Call Measures', this.datiOriginali.showVoiceCallMeasuresM, this.datiModificati.showVoiceCallMeasuresM);
      this.controlloCampi('Show Data Measures', this.datiOriginali.showDataMeasuresM, this.datiModificati.showDataMeasuresM);
      this.controlloCampi('Show Samples Measures', this.datiOriginali.showSamplesMeasuresM, this.datiModificati.showSamplesMeasuresM);
      this.controlloCampi('Add Global Layer', this.datiOriginali.addGlobalLayerM, this.datiModificati.addGlobalLayerM);
      this.controlloCampi('Show Axis X', this.datiOriginali.showAxisXM, this.datiModificati.showAxisXM);
      this.controlloCampi('Height Chart', this.datiOriginali.heightChartM, this.datiModificati.heightChartM);
      this.controlloCampi('Additional Measures TCRUN', 
        this.misureAddizionaliTCRUNStart ? JSON.stringify(this.misureAddizionaliTCRUNStart) : '', 
        this.misureAddizionaliTCRUN ? JSON.stringify(this.misureAddizionaliTCRUN) : ''
      );
    }, 100);
  }

  sistemaAddLayers(al) {
    let a = al;

    if (typeof(a) === 'object') {
      if (a.length === 0) {
        a = '';
      }
    }

    return a;
  }

  sistemaSquareMeters(sq) {
    let s = sq;

    // logConsole('Square meters iniziale', s);
    if (s === null) {
      // logConsole('Square meters 1', s);
      s = 0;
    } else {
      if (s === '<GLOBAL SQUARE SIDE>') {
        
      } else {
        if (isNaN(s)) {
          // logConsole('Square meters 2', s);
          s = 0;
        } else {
          if (s.toString() === 'NaN') {
            // logConsole('Square meters 3', s);

            s = 0;
          } else {
            if (this.isNumeric(s)) {
              s = +s;

              // logConsole('Square meters 4', s);
            } else {
              // logConsole('Square meters 5', s);

              s = 0;
            }
          }
        }
      }
    }

    return s;
  }

  sistemaArrayMisure(am) {
    const a = JSON.parse(JSON.stringify(am));

    if (a) {
      // logConsole('Misure length 1', a.length, this.quanteMisure);
      if (a.length <= this.quanteMisure) {
        for (let i = a.length; i <= this.quanteMisure; i++) {
          a.push('');
        }
      }
      // logConsole('Misure length 2', a.length, this.quanteMisure);
    }

    return a;
  }

  creaArrayMisure() {
    // this.scriveLog('Aumento array. Posizioni: ', this.quanteMisure);
    const appo1 = this.measureD;
    const appo2 = this.pulisceFiltroMeasures;
    const appo3 = this.datiModificati.measureM;

    // this.scriveLog('Prima dell\'aumento: ', this.measureD);
    this.measureD = new Array();
    this.pulisceFiltroMeasures = new Array();
    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 14');
    this.datiModificati.measureM = new Array();
    for (let i = 0; i <= this.quanteMisure; i++) {
      this.measureD.push('');
      this.pulisceFiltroMeasures.push('');
      this.datiModificati.measureM.push('');
    }
    // logConsole('Impostazione misure 3', this.datiModificati.measureM);

    let index = 0;

    appo1.forEach(element => {
      this.measureD[index] = element;
      index++;
    });
    // this.scriveLog('Dopo l\'aumento: ', this.measureD);

    index = 0;
    appo2.forEach(element => {
      this.pulisceFiltroMeasures[index] = element;
      index++;
    });

    index = 0;
    if (appo3 !== undefined) {
      appo3.forEach(element => {
        // logConsole('Imposto measureM 6', element);
        this.datiModificati.measureM[index] = element;
        index++;
      });
    }
  }

  tagliaArrayMisure() {
    if (this.measureD.length > 3) {
      // this.scriveLog('Prima del taglio: ', this.measureD);

      let appo = this.measureD;
      this.measureD = new Array();
      for (let i = 0; i < 4; i++) {
        this.measureD.push(appo[i]);
      };
      // this.scriveLog('Dopo il taglio:', this.measureD);

      appo = this.pulisceFiltroMeasures;
      this.pulisceFiltroMeasures = new Array();
      for (let i = 0; i < 5; i++) {
        this.pulisceFiltroMeasures.push(appo[i]);
      };

      appo = this.datiModificati.measureM;
      // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 15', appo);
      this.datiModificati.measureM = new Array();
      for (let i = 0; i < 5; i++) {
        this.datiModificati.measureM.push(appo[i]);
      };
      // logConsole('Impostazione misure 4', this.datiModificati.measureM);
    }
  }

  ngAfterViewInit() {
    // this.creaArrayMisure();
  }

  checkRitornoChiamata(t, Utils, d) {
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
              // this.messaggioDiErrore(t,  (d.failure_reason);
              this.scriveLog(d.failure_reason);
            }
          }
        }
      }
      if (d.v_err_code && d.v_err_code === 2) {
        if (d.v_failure_reason) {
          if (t === null) {
            alert(d.v_failure_reason);
          } else {
            t.mostraPopup('Error: ' + d.v_failure_reason, false, '');
          }
        } else {
          if (t === null) {
            alert('V_ERR_CODE = 2 without failure reason');
          } else {
            t.mostraPopup('V_ERR_CODE = 2 without failure reason', false, '');
          }
        }
      }
      if (d[0] && d[0].v_err_code && d[0].v_err_code === 2) {
        if (d[0].v_failure_reason) {
          if (t === null) {
            alert(d[0].v_failure_reason);
          } else {
            t.mostraPopup('Error: ' + d[0].v_failure_reason, false, '');
          }
        } else {
          if (t === null) {
            alert('V_ERR_CODE = 2 without failure reason');
          } else {
            t.mostraPopup('V_ERR_CODE = 2 without failure reason', false, '');
          }
        }
      }
    }
  }

  vecchiaChiamataEventi = '';

  LeggeEventi() {
    if (this.Debug === true) {
      // logConsole('Chiamata EVENT_DFN. Frame: ', this.NumeroFrame);
    }
    // const ora = new Date().getTime();
    if (this.vecchiaChiamataEventi !== '') {
      let q = 0;
      const t1 = setInterval(() => {
        if (this.datiEventiDaMettere2 && this.datiEventiDaMettere2.DataTable) { // } || params === this.vecchiaChiamataEventi) {
          clearInterval(t1);
          if (this.Debug === true) {
            // logConsole('Chiamata EVENT_DFN. Dati già esistenti. Riprendo quelli caricati con timer', this.NumeroFrame, this.datiEventiDaMettere2);
          }
    
          this.Utils.strutturaGrigliaDiBase = this.datiEventiDaMettere2; // ***
          // this.datiEventiDaMettere2 = this.datiEventiDaMettere2;
  
          this.gestisceSelezioneGriglia();
        } else {
          q++;
          if (q > 10) {
            clearInterval(t1);
            // logConsole('Chiamata EVENT_DFN. Impossibile accedere ai dati già caricati', this.NumeroFrame);
          }
        }
      }, 1000);
      return;
    }
    this.vecchiaChiamataEventi = this.NumeroFrame;

    let eventi = '';
    if (this.datiModificati.datiEventiDaPassareM && 
      this.datiModificati.datiEventiDaPassareM.DataTable &&
      this.datiModificati.datiEventiDaPassareM.DataTable !== null &&
      this.datiModificati.datiEventiDaPassareM.DataTable !== 'empty grid') {
      // this.scriveLog(this.datiModificati.datiEventiDaPassareM.DataTable);
      this.datiModificati.datiEventiDaPassareM.DataTable.forEach(element => {
        eventi += element.EVENT_TYPE + ',';
      });
      if (eventi !== '') {
        eventi = eventi.substring(0, eventi.length - 1);
      }
    }

    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_filter_folder": "",' +
      '"v_event_type_list_not": "' + eventi + '"' +
    '}';

    /* if (this.datiEventiDaMettere2 && this.datiEventiDaMettere2.DataTable) { // } || params === this.vecchiaChiamataEventi) {
      // if (t.Debug2 === true) {
        // logConsole('Chiamata EVENT_DFN. Dati già esistenti. Riprendo quelli caricati', this.datiEventiDaMettere2);
      // }

      // t.Utils.strutturaGrigliaDiBase = this.datiEventiDaMettere2;
      t.datiEventiDaMettere2 = this.datiEventiDaMettere2;
    } else { */
      if (this.Debug === true) {
        // logConsole('Chiamata EVENT_DFN. Dati NON esistenti. Carico i dati');
      }

      this.vecchiaChiamataEventi = params;

      const destroy$ = new Subject<void>();

      this.apiService.chiamataPost(this.Utils, 'geo_event_dfn__grid', params)
      // .map(response => response)
       .pipe(takeUntil(destroy$))
       .subscribe(data2 => {
        // const data2 = JSON.parse(data);
        this.checkRitornoChiamata(this, this.Utils, data2);
  
        // this.scriveLog('Lista eventi da mettere:', data2);
        if (data2 && data2 !== null) {
          const data = data2; // [0].geo_event_dfn__grid);
          if (this.Debug === true) {
            // logConsole('EVENT_DFN data:', data.DataTable);
          }
            /* data.DataTable.forEach(element => {
              if (element.EVENT_TYPE === 'CADF') {
                this.scriveLog('CADF trovato:', element);
              }
            }); */
          // }
          this.datiEventiDaMettere2 = data;
  
          // this.scriveLog(this.NumeroFrame, 'Struttura di base', JSON.stringify(data));
          this.Utils.strutturaGrigliaDiBase = data;
  
          // this.EventiDaMettereVisibile = true;
        } else {
          if (this.Debug === true) {
            // logConsole('EVENT_DFN data: Pulisco griglia');
          }
          this.datiEventiDaMettere2 = 'empty grid';
          this.datiEventiDaMettere2 = 'empty grid';
        }
  
        this.gestisceSelezioneGriglia();
      }, error => {
        this.messaggioDiErrore(this, error);
      });
  
      /* const params = '{' +
        '"cntx_id": "' + this.sessionService.getToken() + '",' +
        '"v_filter_folder": ""' +
      '}';
      this.apiService.chiamataPost('geo_event_dfn__grid', params)
      // .map(response => response())
      .subscribe(data2 => {
        this.scriveLog('Lista eventi da mettere:', data2);
        if (data2 && data2 !== null) {
          // // const data = JSON.parse(data2); // [0].geo_act_set__grid);
          // this.scriveLog('Measures data:', data.DataTable);
          this.datiEventiDaMettere = data;
          // this.scriveLog('Struttura di base', data);
          this.Utils.strutturaGrigliaDiBase = data;
       } else {
          this.datiEventiDaMettere = 'empty grid';
        }
  
        this.gestisceSelezioneGriglia();
      }, error => {
        ExternalUtilities.messaggioDiErrore(t, error);
      }); */
    // }
  }

  LeggeEventiVecchio() {
    /* if (this.ConnessioneStabilita !== 'OK') {
      return;
    } */

    // ExternalUtilities.LeggeEventi(this);
    return;
    
    // this.datiDiProvaTree = this.CreateTree();
    // this.scriveLog('Leggo misure maschera ' + this.NumeroFrame);

    let eventi = '';
    if (this.datiModificati.datiEventiDaPassareM.DataTable &&
      this.datiModificati.datiEventiDaPassareM.DataTable !== null &&
      this.datiModificati.datiEventiDaPassareM.DataTable !== 'empty grid') {
      // this.scriveLog(this.datiModificati.datiEventiDaPassareM.DataTable);
      this.datiModificati.datiEventiDaPassareM.DataTable.forEach(element => {
        eventi += element.EVENT_TYPE + ',';
      });
      if (eventi !== '') {
        eventi = eventi.substring(0, eventi.length - 1);
      }
    }

    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_filter_folder": "",' +
      '"v_event_type_list_not": "' + eventi + '"' +
    '}';
    if (this.Debug === true) {
      this.scriveLog('Chiamata EVENT_DFN. Frame: ', this.NumeroFrame, params);
    }
    this.apiService.chiamataPost(this.Utils, 'geo_event_dfn__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      this.checkRitornoChiamata(this, this.Utils, data2);

      // this.scriveLog('Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        const data = data2; // [0].geo_event_dfn__grid);
        if (this.Debug === true) {
          this.scriveLog('EVENTS data:', data.DataTable);
          /* data.DataTable.forEach(element => {
            if (element.EVENT_TYPE === 'CADF') {
              this.scriveLog('CADF trovato:', element);
            }
          }); */
        }
        this.datiEventiDaMettere2 = data;

        // this.scriveLog(this.NumeroFrame, 'Struttura di base', JSON.stringify(data));
        this.Utils.strutturaGrigliaDiBase = data;

        // this.EventiDaMettereVisibile = true;
      } else {
        this.datiEventiDaMettere2 = 'empty grid';
      }

      this.gestisceSelezioneGriglia();
    }, error => {
      this.messaggioDiErrore(this, error);
    });

    /* const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost('geo_event_dfn__grid', params)
    // .map(response => response())
    .subscribe(data2 => {
      this.scriveLog('Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        // // const data = JSON.parse(data2); // [0].geo_act_set__grid);
        // this.scriveLog('Measures data:', data.DataTable);
        this.datiEventiDaMettere = data;
        // this.scriveLog('Struttura di base', data);
        this.Utils.strutturaGrigliaDiBase = data;
     } else {
        this.datiEventiDaMettere = 'empty grid';
      }

      this.gestisceSelezioneGriglia();
    }, error => {
      this.messaggioDiErrore(t, error);
    }); */
  }
  
  messaggioDiErrore(griglia, mess) {
    // t.messaggioDiErrore.emit(mess);
    this.scriveLog(griglia, typeof(griglia), mess);
    try {
      if (!griglia || griglia === null || typeof(griglia) !== 'string' || (typeof(griglia) === 'string' && griglia !== 'null')) {
        griglia = 'ERROR: ' + JSON.stringify(JSON.parse(mess._body).message);
      } else {
        console.error('ERROR:', mess);
      }
    } catch (e) {

    }
  }

  LeggeEventiDaTogliere() {
    // this.datiEventiDaTogliere = null;
  }

  /* checkValueAntenne(event: any) {
    // this.scriveLog('Emit antenne:', this.datiModificati.isCheckedAntenneM);
    this.isCheckedAntenneEmit.emit(this.datiModificati.isCheckedAntenneM);
    // let rit = '0';
    // if (this.isCheckedAntenne) {
    //   rit = '1';
    // }
    this.checkSeCiSonoModifiche();

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
  } */

  checkShowPlanimetry() {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);
      
      // this.scriveLog('Emit show planimetry:', this.datiModificati.showPlanimetryM);
      this.showPlanimetryEmit.emit(this.datiModificati.showPlanimetryM);
      // let rit = '0';
      // if (this.isCheckedAntenne) {
      //   rit = '1';
      // }
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  checkValueServingCell() {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);
        
      // this.datiModificati.isCheckedServingCellM = event;
      // this.scriveLog('Cambio check serving cell', this.datiModificati.isCheckedServingCellM);
      this.isCheckedServingCellEmit.emit(this.datiModificati.isCheckedServingCellM);
      let rit = '0';
      if (this.datiModificati.isCheckedServingCellM) {
        rit = '1';
      }
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  checkSyncEventTime() {
    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (this.Debug === true) {
        this.scriveLog('Cambiato Sync Event Time', this.datiModificati.isNonSyncEventTimeM);
      }
      this.isNonSyncEventTimeEmit.emit(this.datiModificati.isNonSyncEventTimeM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  checkStandAloneMR() {
    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (this.Debug === true) {
        this.scriveLog('Cambiato Stand Alone MR', this.datiModificati.isStandAloneMR);
      }
      this.isStandAloneMREmit.emit(this.datiModificati.isStandAloneMR);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  checkValuePaths() {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // this.datiModificati.isCheckedShowPathsM = event;
      this.isCheckedShowPathsEmit.emit(this.datiModificati.isCheckedShowPathsM);
      this.checkSeCiSonoModifiche();
  
      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  checkValueSelectedPaths() {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // this.datiModificati.isCheckedShowPathsM = event;
      this.isCheckedShowSelectedPathsEmit.emit(this.datiModificati.isCheckedShowSelectedPathsM);
      this.checkSeCiSonoModifiche();
  
      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  checkValueShowRays() {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // this.datiModificati.showRaysM = event;
      this.showRaysEmit.emit(this.datiModificati.showRaysM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  checkValueSartPosition() {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);
        
      this.sartPositionEmit.emit(this.datiModificati.sartPositionM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
      this.effettuaAutoFitAL = !this.effettuaAutoFitAL;
    }, 100);
  }

  onTabSelect(e) {
    if (!this.permetteEmit) {
      return;
    }

    // this.scriveLog('Tab premuto:', e);
    if (!this.eseguitoInProgetto) {
      this.tabSelezionato2 = e.index;
      this.tabSelezionatoEmit.emit(e.index);
    }

    /* if (e.index === 0) {
      // logConsole('Cambio tab', e, 1, this.datiModificati.textFilterM, 2, this.datiModificati.textFilter2M);
      if (this.datiModificati.clusterMeasureM) {
        this.LeggeDatiLOV(1, this.datiModificati.clusterMeasureM, 'ImpostoCM1', true);
      } else {
        // logConsole('Imposto tf1 problema');
      }
      if (this.datiModificati.clusterMeasure2M) {
        this.LeggeDatiLOV(2, this.datiModificati.clusterMeasure2M, 'ImpostoCM2', true);
      } else {
        // logConsole('Imposto tf1 problema');
      }
    } */
  }

  ritornaRigaTotaleDaDescrizioneCombo(desc, dati, campoTesto) {
    let ee = desc;
    if (typeof(ee) === 'object') {
      ee = ee[campoTesto];
    }
    // this.scriveLog(ee);
    if (ee && ee.substring(0, 1) === '"' && ee.substr(ee.length - 1) === '"') {
      ee = ee.substring(1, ee.length);
      ee = ee.substring(0, ee.length - 1);
    }
    // this.scriveLog('Cambiato valore combo:', ee);
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

  selectTipoMappa1(e) {
    if (!this.permetteEmit) {
      return;
    }

    // this.messaggioDiErrore(t, e.id);
    if (e) {
      // const e = JSON.parse(ee);
      // const e = this.Utils.converteStringaInJSON(ee);
      const ee = this.ritornaRigaTotaleDaDescrizioneCombo(e, this.Utils.mappe, 'name');
      if (ee !== null) {
        // this.scriveLog('Tipo mappa selezionata:', e);
        this.datiModificati.mapTypeM = ee.id;
        this.tipoMappaEmit.emit(ee.id);
        this.checkSeCiSonoModifiche();

        this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
        this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
      }
    }
  }

  checkViewGlobal(event: any) {
    if (!this.permetteEmit) {
      return;
    }

    this.overviewZoomEmit.emit(event);
    this.checkSeCiSonoModifiche();

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
  }

  checkDoubleGraph() {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);
          
      this.doubleGraphEmit.emit(this.datiModificati.doubleGraphM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  creaDatiTipiFrame(tipo) {
    if (!this.Utils) {
      return;
    }

    // this.scriveLog('Cambio tipo frame', tipo, this.datiModificati.mappaOGraficoM, this.datiModificati.activityM);
    // alert('Cambio tipo frame: ' + tipo + ' - ' + this.datiModificati.mappaOGraficoM + ' - ' + this.datiModificati.activityM);
    this.datiTipiActivity2 = new Array();
    if (this.datiModificati.mappaOGraficoM === '') {
      this.datiModificati.mappaOGraficoM = '--';
    }

    this.tipiEventi = JSON.parse(JSON.stringify(this.Utils.tipiEvents));

    switch (tipo) {
      case 'AE':
      case 'CM':
      case 'CD':
      case 'LA':
      case 'CV':
      case 'ES':
      case 'PC':
      case 'PT':
      case 'TI':
      case 'PS':
      case 'PL':
      case 'PK':
      case 'AH':
        this.Utils.datiTipiActivity.forEach(element => {
          // if (element.name !== environment.stringaAll) {
           this.datiTipiActivity2.push(element);
          // }
        });
        if (this.datiModificati.activityM === 9999) {
          this.datiModificati.activityM = 0;
        }

        if (tipo === 'ES' || tipo === 'AE') {
          this.tipiEventi.push ( { id: 'A', name: 'All' } );
        }
        break;
      case 'M':
      case 'MC':
      case 'MG':
      case 'CG':
      case 'PM':
        this.Utils.datiTipiActivity.forEach(element => {
          if (element.name !== environment.stringaAll) {
            this.datiTipiActivity2.push(element);
          }
        });
        if (this.datiModificati.activityM === 9999) {
          this.datiModificati.activityM = 1;
        }
        break;
    }

    if (this.datiModificati.timeFilterM === '') {
      this.datiModificati.timeFilterM = 1;
    }

    // if (this.datiModificati.histDisplayAsM === '') {
    //   this.scriveLog('Reimposto a 1 l\'histDisplayAs');
    //   this.datiModificati.histDisplayAsM = '1';
    // }
    // this.scriveLog(this.datiTipiActivity2);
    // // logConsole('Misure', this.measureDataCompleti);
  }

  selectOptionOpacity(e) {
    if (!this.permetteEmit) {
      return;
    }

    // logConsole('Cambio opacità in settings', e);
    if (this.Debug === true) {
      this.scriveLog('Cambio opacità in settings', e);
    }
    this.datiModificati.opacityM = e.id;
    this.opacityEmit.emit(e.id);
    this.checkSeCiSonoModifiche();
    this.effettuaAutoFitAL = !this.effettuaAutoFitAL;
  }

  selectOptiontipoDatiLayoutM(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (this.Debug === true) {
      this.scriveLog('Cambio tipo dati layout in settings', e);
    }
    this.datiModificati.tipoDatiLayoutM = e.id;
    this.tipoDatiLayoutMEmit.emit(e.id);
    this.checkSeCiSonoModifiche();
  }

  selectOptionMappaGrafico(e) {
    if (!this.permetteEmit) {
      return;
    }

    // logConsole(e);
    if (e) {
      // this.scriveLog('MapName: ', this.datiModificati.mapNameM, e.name);

      if (e.name === 'Map' && this.datiModificati.mapNameM !== 'Map') {
        // this.scriveLog(this.datiModificati.measureM);
        if (this.datiModificati.measureM && this.datiModificati.measureM[0]) {
          // logConsole('Imposto measureM 7');
          this.datiModificati.measureM[0] = '';
          // this.scriveLog(this.datiModificati.measureM);
        }
      }

      if (e.id === '--') {
        this.datiModificati.mapNameM = '<empty>';
        this.frameNameEmit.emit(this.datiModificati.mapNameM);
      }

      this.datiModificati.mappaOGraficoM = e.id;

      this.aggiornaQuanteMisure();
      
      /* if (this.Debug === true) {
        this.scriveLog('Imposto il nome frame da selectOptionMappaGrafico: ', e)
      }
      this.datiModificati.mapNameM = e.name;

      if (e.id === '--') {
        this.frameNameEmit.emit('<empty>');
      } else {
        // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Frame name emit 1', e.name);
        this.frameNameEmit.emit(e.name);
      } */
      this.creaStrutturaMisure(false);

      // this.scriveLog('Nome view', this.datiModificati.mapNameM);
      // const ee = JSON.parse(e);
      // const ee = this.Utils.ritornaRigaTotaleDaDescrizioneCombo(e, this.Utils.datiTipiFrame, 'name');
      this.tabSelezionato2 = 0;
      this.tabSelezionatoEmit.emit(0);

      this.creaDatiTipiFrame(e.id);

      // this.datiModificati.mappaOGraficoM = ee.id;
      this.MappaOGraficoEmit.emit(e);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }
  }

  ritornaTutteDescrizioniMisura() {
    const ret = new Array();
    // ret.push('');
    // this.scriveLog('ritornaTutteDescrizioniMisura');
    if (this.measureDataCompleti2 && this.measurePassato !== undefined && this.measurePassato !== '' && this.measurePassato !== null) {
      let ok = false;
      // this.scriveLog('Misure: ', this.measurePassato);
      for (let i = 0; i < this.measurePassato.length; i++) {
        ok = false;
        this.measureDataCompleti2.forEach(element2 => {
          if (this.measurePassato[i] === element2.CODE) {
            // this.scriveLog(i, this.measurePassato[i], element2);
            ret.push(element2.DESCRIPTION);
            if (+element2.TYPE === 1) {
              // this.sla[i] = true;
              this.datiModificati.severityM = true;
            } else {
              // this.sla[i] = false;
              this.datiModificati.severityM = false;
            }
            ok = true;
          }
        });
        if (!ok) {
          ret.push('');
        }
      };
    }

    // this.scriveLog('Modificate tutte le descrizioni: ', this.measureD);
    return ret;
  }

  ritornadescrizioneMisuraSMS(descr) {
    // this.scriveLog('Ritorna Descrizione Misura SMS:', num, descr);
    let ret = '';
    if (this.measureDataCompleti2 && this.measurePassato && this.measurePassato !== '') {
      this.measureDataCompleti2.forEach(element => {
        if (ret === '') {
          if (element.CODE === descr) {
            // this.scriveLog(descr, element);
            ret = element.DESCRIPTION;
          }
        }
      });
    }

    return ret;
  }

  ritornadescrizioneMisura(num, descr) {
    // this.scriveLog('Ritorna Descrizione Misura:', num, descr);
    let ret = '';
    if (this.measureDataCompleti2 && this.measurePassato && this.measurePassato !== '') {
      this.measureDataCompleti2.forEach(element => {
        if (ret === '') {
          if (element.CODE === descr) {
            // this.scriveLog(descr, element);
            ret = element.DESCRIPTION;
            // logConsole('Trovata descrizione misura:', ret);

            if (num > -1) {
              // this.scriveLog(element.DESCRIPTION);
              // this.scriveLog(element.TYPE);

              if (+element.TYPE === 1) {
                this.sla2[num] = true;
              } else {
                this.sla2[num] = false;
              }
            }
          }
        }
      });
    }

    this.checkSla();

    // this.scriveLog('Modificata descrizione: ', this.measureD);
    return ret;
  }

  ritornaMisura(q, descr) {
    if (this.measureDataCompleti2) {
      this.ritornaMisura2(q, descr);
    } else {
      const t1 = setInterval(() => {
        if (this.measureDataCompleti2) {
          clearInterval(t1);
          this.ritornaMisura2(q, descr); 
        }
      }, 100);
    }
  }

  ritornaMisura2(q, descr) {
    // logConsole('Ritorna Descrizione Misura:', q, descr, this.measureDataCompleti2);
    let ret = '';
    if (this.measureDataCompleti2) {
      this.measureDataCompleti2.forEach(element => {
        if (ret === '') {
          if (element.MEASR_CODE === descr) {
            // this.scriveLog(descr, element);
            ret = element.DISPLAY_NAME;
            // logConsole('Trovata descrizione misura:', ret, element);
            if (q === 1) {
              this.filter1NAME = ret;
            } else {
              this.filter2NAME = ret;
            }
          }
        }
      });
    }

    // this.scriveLog('Modificata descrizione: ', this.measureD);
    return ret;
  }

  checkSla() {
    if (!this.permetteEmit) {
      return;
    }

    // this.scriveLog('Sla:' , this.sla);
    const ceSla = this.sla;
    /* let ceSla = false;
    this.sla.forEach(element => {
      if (element !== undefined && element === true) {
        ceSla = true;
      }
    }); */
    if (ceSla) {
      this.visualizzaSLA.emit(false);
    } else {
      this.visualizzaSLA.emit(true);
    }

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
  }

  ultimoCambioMisura = -1;
  comboMisureVisibile = [true, true, true, true, true, true, true];
  appoggioMisura = ['', '', '', '', '', '', ''];
  appoggioMisura2;

  checkMisura(n, e) {
    this.appoggioMisura[n] = e;
    logConsole('Misura scritta', e);
  }

  vecchiaStringaMisura2 = '';

  checkMisura2(e) {
    /* this.vecchiaStringaMisura2 = e;

    const tt = setInterval(() => {
      if (this.vecchiaStringaMisura2 === e) {
        clearInterval(tt);

        let i = 0;
        this.measureDataCompleti.forEach(element => {
          if (+element.ROW_ID > +i) {
            i = +element.ROW_ID;
          }
        });
        const m = {
          CODE: this.appoggioMisura2,
          DESCRIPTION: "New Measure",
          DISPLAY_NAME: this.appoggioMisura2,
          FILE_TYPE: "New Measure",
          FOLDER: "New Measure",
          INSERT_TIMESTAMP: "2019-09-23T00:00:00+00:00",
          MEASR_CODE: this.appoggioMisura2,
          NET_TECH: "",
          ROW_ID: i + 1,
          TYPE: "1",
          TYPE_STR: "list",
          UPDATE_TIMESTAMP: "2024-04-10T01:00:00+00:00"
        }
        this.measureDataCompleti.push(m);
  
        this.misuraSelezionata = m.CODE;
      }
    }, 100); */
  }
  
  selectMisura(n, e) {
    if (!this.permetteEmit) {
      return;
    }

    /* const ora = new Date().getTime();
    if (ora - this.ultimoCambioMisura < 1000) {
      return;
    }
    this.ultimoCambioMisura = ora; */
    
    // logConsole('Misura cambiata', n, e, this.datiModificati.measureM);

    if (this.Debug === true) {
      this.scriveLog('Misura cambiata settings: ', n, e);
    }
    // const tm = setTimeout(() => {
    //   clearTimeout(tm);
    if (typeof(e) === 'string' && e.indexOf('***') > -1)  {
      // logConsole('Misura cambiata a mano 1', n, e);
      const elemento = e.replace('***', '');
      // logConsole('Misura cambiata a mano 2', n, e);

      let maxId = 0;
      this.measureDataCompleti2.forEach(element => {
        if (element.ROW_ID > maxId) {
          maxId = element.ROW_ID;
        }
      });
      const nuovaMisura = {
        CODE: elemento,
        DESCRIPTION: elemento,
        DISPLAY_NAME: elemento,
        FILE_TYPE: "Act_Coverage",
        FOLDER: "New Measure",
        INSERT_TIMESTAMP: "",
        MEASR_CODE: elemento,
        NET_TECH: "",
        ROW_ID: maxId + 1,
        TYPE: "2",
        TYPE_STR: "list",
        UPDATE_TIMESTAMP: ""
      }            
      if (!this.measureDataCompleti2) {
        this.measureDataCompleti2 = new Array();
      }
      this.measureDataCompleti2.push(nuovaMisura);
      // logConsole('Nuove misure', this.measureDataCompleti, elemento);

      this.measureD[n] = elemento;
      // logConsole('Imposto measureM 8', elemento);
      this.datiModificati.measureM[n] = elemento;

      this.comboMisureVisibile[n] = false;
      setTimeout(() => {
        this.comboMisureVisibile[n] = true;
      }, 100);

      // logConsole('Misure emit 1', this.datiModificati.measureM);
      this.measureEmit.emit(this.datiModificati.measureM);

      if (this.datiModificati.modificaChartM === false) {
        this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
        this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
      }

      this.checkSeCiSonoModifiche();
    } else {
      if (e && e !== 'empty') {
        this.appoggioMisura[n] = '';
        
        const ee = this.converteStringaInJSON(e);
        // const ee = this.Utils.ritornaRigaTotaleDaDescrizioneCombo(e, this.measureDataCompleti, 'DISPLAY_NAME');

        const ret = this.ritornadescrizioneMisura(n, ee.CODE);
        // logConsole('Quante misure memorizzate', this.datiModificati.measureM.length, n);
        /* if (this.measureD < n) {
          for (let i = this.measureD.length; i <= n; i++) {
            this.measureD.push('');
          }
        } */
        this.measureD[n] = ret;
        // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE prima:', JSON.parse(JSON.stringify(this.datiModificati.measureM)), n, ee.CODE);
        /* if (this.datiModificati.measureM.length < n) {
          for (let i = this.datiModificati.measureM.length; i <= n; i++) {
            this.datiModificati.measureM.push('');
          }
        } */
        // logConsole('Imposto measureM 1', ee.CODE);
        this.datiModificati.measureM[n] = ee.CODE;
        // if (this.Debug === true) {
          // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE dopo:', this.datiModificati.measureM);
          this.scriveLog('Descrizione Misure modificate:', this.measureD);
        // }
        if (this.datiModificati.mappaOGraficoM === 'MC') {
          if (this.datiModificati.modificaChartM === false || this.eseguitoInProgetto === true) {
            // this.scriveLog('Emit misure 1');
            // // logConsole('Misure emit 1', this.datiModificati.measureM);
            // logConsole('Misure emit 2', this.datiModificati.measureM);
            this.measureEmit.emit(this.datiModificati.measureM);
          }
        } else {
          /* const passaggio1 = new Array();
          passaggio1.push('');
          this.datiModificati.measureM.forEach(element => {
            passaggio1.push(element);
          });
          const passaggio2 = JSON.stringify(passaggio1); */
          
          // // logConsole('Misure emit 2', this.datiModificati.measureM);
          // logConsole('Misure emit 3', this.datiModificati.measureM);
          this.measureEmit.emit(this.datiModificati.measureM);
        }
      } else {
        // logConsole('Imposto measureM 2');
        this.datiModificati.measureM[n] = '';
        if (this.datiModificati.mappaOGraficoM === 'MC') {
          if (this.datiModificati.modificaChartM === false || this.eseguitoInProgetto === true) {
            // this.scriveLog('Emit misure 1');
            // // logConsole('Misure emit 3', this.datiModificati.measureM);
            // logConsole('Misure emit 4', this.datiModificati.measureM);
            this.measureEmit.emit(this.datiModificati.measureM);
          }
        } else {
          // // logConsole('Misure emit 4', this.datiModificati.measureM);
          // logConsole('Misure emit 5', this.datiModificati.measureM);
          this.measureEmit.emit(this.datiModificati.measureM);
        }
        this.measureD[n] = '';
        if (this.sla && this.sla[n]) {
          this.sla[n] = false;
        }
        this.checkSla();
      }

      // if (this.Debug === true) {
        this.scriveLog('Misure modificate. Modifica chart', this.datiModificati.modificaChartM);
      // }

      // this.scriveLog(this.datiModificati.measureM);
      if (this.datiModificati.modificaChartM === false) {
        this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
        this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
      }

      // this.viewDefinition.emit('');

      this.checkSeCiSonoModifiche();
    // }, 100);
    }
  }

  selectMisuraRC(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (this.Debug === true) {
      this.scriveLog('MisuraRC cambiata settings: ', e);
    }
    const tm = setTimeout(() => {
          clearTimeout(tm);
      if (e && e !== 'empty') {
        const ee = this.converteStringaInJSON(e);
        // const ee = this.Utils.ritornaRigaTotaleDaDescrizioneCombo(e, this.measureDataCompleti, 'DISPLAY_NAME');

        const ret = this.ritornadescrizioneMisura(-1, ee.CODE);
        this.datiModificati.measureRCM = ee.CODE;
        // this.scriveLog('Click su combo RCM', ee);
        // this.scriveLog('Emit misure RCM', this.datiModificati.measureRCM);
      } else {
        this.datiModificati.measureRCM = '';
      }
      this.measureRCMEmit.emit(this.datiModificati.measureRCM);

      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  selectTipoMappeMS(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (this.Debug) {
      this.scriveLog('Mappe MS', e);
    }
    this.datiModificati.mappeMSM = e.id;
    this.mappeMSEmit.emit(e.id);
    this.checkSeCiSonoModifiche();
  }

  /* selectMisuraFilter(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (this.Debug) {
      this.scriveLog('Misura filter', e, typeof(e));
    }
    // logConsole('Misura filter', e);
    
    logConsole('Azzero filtro 1 (1)');
    this.filtro1 = '';
    if (e && e !== '') {
      this.datiModificati.clusterMeasureM = e.CODE;
      // logConsole('Imposto filtro 1 settings', this.datiModificati.clusterMeasureM);
      this.LeggeDatiLOV(1, e.CODE, 'SelectMisuraFilter', false);
      // logConsole('Misure emit 6', this.datiModificati.measureM);
      this.clusterMeasureEmit.emit(e.CODE);
    } else {
      // // logConsole('Pulizia Misura filter', e);
      this.datiModificati.clusterMeasureM = '';
      logConsole('Pulisco filtro 1 settings');
      this.datiModificati.textFilterM = '';
      this.datiLOV1 = undefined;
      // logConsole('PULISCO  LOV1 1');
      // this.lovM1Id = '';
      // logConsole('Pulizia misura filter 1', this.datiModificati.clusterMeasureM);
      logConsole('Emit filtro 1 settings (7) vuoto');
      this.textFilterEmit.emit('*EMPTY*');
      // logConsole('Misure emit 7', this.datiModificati.measureM);
      this.clusterMeasureEmit.emit('');
    }

    this.checkSeCiSonoModifiche();
  } */

  /* selectMisuraLov(e) {
    if (this.Debug) {
      this.scriveLog('Misura Lov', e);
    }
    if (e && e !== '') {
      this.datiModificati.lovM = e.value;
      this.clusterMeasureEmit.emit(e.value);
    } else {
      this.datiModificati.lovM = '';
      this.clusterMeasureEmit.emit('');
    }
    this.checkSeCiSonoModifiche();
  } */

  /* selectMisuraFilter2(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (this.Debug) {
      this.scriveLog('Misura filter 2', e, typeof(e));
    }
    logConsole('Pulisco filtro 2 settings');
    this.filtro2 = '';
    if (e && e !== '') {
      this.datiModificati.clusterMeasure2M = e.CODE;
      this.LeggeDatiLOV(2, e.CODE, 'SelectMisuraFilter2', false);
      this.clusterMeasure2Emit.emit(e.CODE);
    } else {
      this.datiModificati.clusterMeasure2M = '';
      this.datiModificati.textFilter2M = '';
      this.datiLOV2 = undefined;
      // this.lovM2Id = '';
      this.textFilter2Emit.emit('*EMPTY*');
      this.clusterMeasure2Emit.emit('');
    }

    // logConsole('Cambio filtro2 ', e, 'Modificato: ' + this.datiModificati.clusterMeasure2M, 'Originale: ' + this.datiOriginali.clusterMeasure2M);

    this.checkSeCiSonoModifiche();
  } */

  selectCorrelation(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (this.Debug) {
      this.scriveLog('Correlation', e);
    }
    if (e && e !== '') {
      this.datiModificati.correlationM = e.CODE;
      this.correlationEmit.emit(e.CODE);
    } else {
      this.datiModificati.correlationM = '';
      this.correlationEmit.emit('');
    }
    this.checkSeCiSonoModifiche();
  }

  /* impostaIdLov(q, daDove) {
    return;
    logConsole('Imposto ID LOV da ' + daDove, q);

    if (q === 1) {
      const lovM1Id = this.checkIdLov(this.datiLOV1, this.datiModificati.textFilterM);

      const tm = setTimeout(() => {
        clearTimeout(tm);

        // this.lovM1Id = lovM1Id;        

        // logConsole('ID lovm1 impostato da ' + daDove + ' frame ' + this.NumeroFrame + ': ', this.datiLOV1, this.datiModificati.textFilterM, '*' + this.lovM1Id + '*');  
      }, 100);
    } else {
      const lovM2Id = this.checkIdLov(this.datiLOV2, this.datiModificati.textFilter2M);

      const tm = setTimeout(() => {
        clearTimeout(tm);

        // this.lovM2Id = lovM2Id;

        // logConsole('ID lovm2 impostato da ' + daDove + ' frame ' + this.NumeroFrame + ': ', this.datiLOV2, this.datiModificati.textFilter2M, '*' + this.lovM2Id + '*');  
      }, 100);
    }
  }

  checkIdLov(d, codice) {
    logConsole('Check id lov', d, codice);

    if (!codice || !d) {
      return '';
    }

    let lovMId = '';
    let id = new Array();
    if (codice && codice.indexOf(',') > -1) {
      const iid = codice.split(',');
      iid.forEach(element => {
        id.push(element);
      });
    } else {
      if (id !== undefined) {
        id.push(codice);
      }
    }
    // // logConsole('Ricerca codici', id);
    if (d) {
      id.forEach(element => {
        // // logConsole('Ricerca codice', element);
        d.forEach(element2 => {
          if (element2.value.toString() === element.toString()) {
            // // logConsole('Trovato codice', element2);
            if (element2.id) {
              lovMId += element2.id.toString().trim() + ',';
            }
          }
        });
      });
    }
    if (lovMId) {
      lovMId = lovMId.substring(0, lovMId.length - 1);
    }

    return lovMId;
  } */

  /* cambioFilterText(e) {
    if (!this.permetteEmit) {
      return;
    }

    // logConsole('Misura filter 1 1', e);
    if (this.Debug) {
      this.scriveLog('Misura text 1', e);
    }
    if (e && e !== undefined && e.indexOf('***') === -1) {
      if (e.value) {
        // logConsole('Misura filter 1 2', e);
        this.datiModificati.textFilterM = e.value;
        logConsole('Imposto filtro 1 settings (1)', e.value);
        logConsole('Emit filtro 1 settings (1)', e.value);
        this.textFilterEmit.emit(e.value);
        // logConsole('PULISCO  LOV1 2');
        // this.lovM1Id = e.value;
      } else {
        // logConsole('Misura filter 1 3', e);
        // logConsole('Valore lov1 1', e);
        this.datiModificati.textFilterM = e;
        logConsole('Imposto filtro 1 settings (2)', e);
        logConsole('Emit filtro 1 settings (2)', e);
        this.textFilterEmit.emit(e);
        // logConsole('PULISCO  LOV1 3');
        // this.lovM1Id = e;
      }
      this.checkSeCiSonoModifiche();
    } else {
      if (e && e.indexOf('***') > -1) {
        // logConsole('Misura filter 1 4', e);

        const codice = e.replace('***', '');
        this.aggiungeCodiceALov(1, codice, 'cambio filter 1');
        this.datiModificati.textFilterM = codice;
        logConsole('Imposto filtro 1 settings (3)', codice);
        logConsole('Emit filtro 1 settings (3)', codice);
        this.textFilterEmit.emit(codice);
        this.checkSeCiSonoModifiche();
      } else {
        if (e === '') {
          // logConsole('Misura filter 1 5', e);
          // logConsole('Pulizia Ritorno selezione 1', e);
          // logConsole('Valore lov1 2', e);
          this.datiModificati.textFilterM = '';
          logConsole('Pulisco filtro 1 settings (4)');
          logConsole('Emit filtro 1 settings (4) vuoto');
          this.textFilterEmit.emit('*EMPTY*');
          // logConsole('PULISCO  LOV1 4');
          // this.lovM1Id = '';
          this.checkSeCiSonoModifiche();
        }
      }
    }

    // logConsole('Misura filter 1 6', e);
    this.impostaIdLov(1, 'CambioFilterText1');    
    // logConsole('Misura filter 1 7', e);
    
    if (this.lovM1Appo === undefined || this.lovM1Appo === 'undefined') {
      this.lovM1Appo = '';
    }
    if (this.lovM1Appo !== this.datiModificati.textFilterM) {
      this.filtroModificato1 = true;
    } else {
      this.filtroModificato1 = false;
    }
  }

  cambioFilterText2(e) {
    if (!this.permetteEmit) {
      return;
    }

    // logConsole('Misura filter 2', e);
    if (this.Debug) {
      this.scriveLog('Misura text 2', e);
    }
    if (e && e !== undefined && e.indexOf('***') === -1) {
      if (e) {
        if (e.value) {
          this.datiModificati.textFilter2M = e.value;
          // this.lovM2Id = e.value;
          this.textFilter2Emit.emit(e.value);
        } else {
          this.datiModificati.textFilter2M = e;
          // this.lovM2Id = e;
          this.textFilter2Emit.emit(e);
        }
        this.checkSeCiSonoModifiche();
      }
    } else {
      if (e && e.indexOf('***') > -1) {
        const codice = e.replace('***', '');
        this.aggiungeCodiceALov(2, codice, 'cambio filter 2');
        this.datiModificati.textFilter2M = codice;
        this.textFilter2Emit.emit(codice);
        this.checkSeCiSonoModifiche();
      } else {
        if (e === '') {
          this.datiModificati.textFilter2M = '';
          // this.lovM2Id = '';
          this.textFilter2Emit.emit('*EMPTY*');
          this.checkSeCiSonoModifiche();
        }
      }
    }
    
    this.impostaIdLov(2, 'CambioFilterText2');
        
    // alert(this.lovM2Appo + '->' + this.datiModificati.textFilter2M);
    if (this.lovM2Appo === undefined || this.lovM2Appo === 'undefined') {
      this.lovM2Appo = '';
    }
    if (this.lovM2Appo !== this.datiModificati.textFilter2M) {
      this.filtroModificato2 = true;
    } else {
      this.filtroModificato2 = false;
    }
  } */

  cambioViewModeMS() {
    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (this.Debug) {
        this.scriveLog('Cambio view mode MS', this.datiModificati.viewModeMS);
      }
      this.viewModeMSEmit.emit(this.datiModificati.viewModeMS);

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  cambioViewModeMSCombo(e) {
    if (!e.name && e.indexOf('***') > -1) {
      e = e.replace('***', '');
      let ok = false;
      this.viewModes.forEach(element => {
        if (!ok && element.name === e) {
          ok = true;
        }
      });
      if (!ok) {
        this.viewModes.push({name: e});
        this.viewModes.sort((a, b) => a.name.localeCompare(b.name));
        this.viewModes = JSON.parse(JSON.stringify(this.viewModes));
      }
      const t = setTimeout(() => {
        clearTimeout(t);

        this.datiModificati.viewModeMS = e;
      }, 500);
    } else {
      this.datiModificati.viewModeMS = e.name;
    }
    if (this.Debug) {
      this.scriveLog('Cambio view mode MS', this.datiModificati.viewModeMS);
    }
    this.viewModeMSEmit.emit(this.datiModificati.viewModeMS);

    this.checkSeCiSonoModifiche();
  }

  cambioFlowTypeMS() {
    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (this.Debug) {
        this.scriveLog('Cambio flow type MS', this.datiModificati.flowTypeMS);

      }
      this.flowTypeMSEmit.emit(this.datiModificati.flowTypeMS);

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  checkValueGlobalLayer(e) {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (this.Debug) {
        this.scriveLog('Global Layer', e);
      }
      this.datiModificati.addGlobalLayerM = e;
      this.addGlobalLayerEmit.emit(e);
      this.checkSeCiSonoModifiche();
    }, 100);
  }

  checkValueShowRaysAllLayer() {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (this.Debug) {
        logConsole('Show Rays All Layer', this.datiModificati.showRaysAllLayerM);
      }
      // this.datiModificati.showRaysAllLayerM = e;
      this.showRaysAllLayerEmit.emit(this.datiModificati.showRaysAllLayerM);
      this.checkSeCiSonoModifiche();
    }, 100);
  }

  selectMisuraSMS(e) {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (e && e !== 'empty') {
        let rit;

        if (typeof(e) === 'string' && e.indexOf('***') > -1) {
          e = e.replace('***', '');

          rit = e;
        } else {
          const ee = this.converteStringaInJSON(e);
          const ret = this.ritornadescrizioneMisuraSMS(ee.CODE);
          // logConsole('SMSM ', '1:' + ee, '2:' + ee.CODE, '3:' + ret);

          this.measureDSMS = ret;
          rit = ee.CODE;
        }
          // const ee = this.Utils.ritornaRigaTotaleDaDescrizioneCombo(e, this.measureDataCompleti, 'DISPLAY_NAME');

        // logConsole('SMSM modificato', rit);

        let ok = false;
        let maxId = 0;
        if (!this.measureDataSMS) {
          this.measureDataSMS = new Array();
        }
        this.measureDataSMS.forEach(element => {
          if (!ok && rit === element.CODE) {
            ok = true;
          }
          if (element.ROW_ID > maxId) {
            maxId = element.ROW_ID;
          }
        });
        if (!ok) {
          logConsole('Misura mancante SMSM', rit);
          const nuovaMisura = {
            CODE: rit,
            DESCRIPTION: rit,
            DISPLAY_NAME: rit,
            FILE_TYPE: "SMS",
            FOLDER: "New Measure",
            INSERT_TIMESTAMP: "",
            MEASR_CODE: rit,
            NET_TECH: "",
            ROW_ID: maxId + 1,
            TYPE: "2",
            TYPE_STR: "list",
            UPDATE_TIMESTAMP: ""
          }            
          this.measureDataSMS.push(nuovaMisura);
        }

        const m = JSON.parse(JSON.stringify(this.measureDataSMS));
        this.measureDataSMS = undefined;
        setTimeout(() => {
          this.measureDataSMS = JSON.parse(JSON.stringify(m));

          logConsole(rit);
          this.datiModificati.measureSMSM = rit;

          // this.scriveLog(this.datiModificati.measureM);
          // if (this.datiModificati.modificaChartM === false) {
          // this.scriveLog('Emit misure 1');
          this.measureSMSEmit.emit(this.datiModificati.measureSMSM);
        }, 200);
      } else {
        if (this.Debug === true) {
          this.scriveLog('Misura SMS cambiata: Vuota');
        }

        this.datiModificati.measureSMSM = '';
        // if (this.datiModificati.modificaChartM === false) {
          // this.scriveLog('Emit misure 2');
        this.measureSMSEmit.emit(this.datiModificati.measureSMSM);
        // }
      }

      // this.scriveLog(this.datiModificati.measureM);
      if (this.datiModificati.modificaChartM === false) {
        this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
        this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
      }

      // this.viewDefinition.emit('');

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  fattoClickSuRigaDaMettere(tipo, e) {
    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, e);

    // this.scriveLog('Maschera Mettere');
    // this.scriveLog('Tipo:', tipo);
    // this.scriveLog('Cosa:', e);

    this.pulisceSelezioneDaMettere = '';
    this.infoKeyVisibileMettere = true;
    this.EventiSelezionati = JSON.parse(JSON.stringify(e.dati));

    // this.scriveLog('Eventi Da Mettere:', this.EventiSelezionati);
    if (e && e.dati && e.dati.length > 0) {
      this.selezioneRigheAddEvents = true;
    } else {
      this.selezioneRigheAddEvents = false;
    }
  }

  fattoClickSuRigaDaTogliere(tipo, e) {
    // this.scriveLog('Maschera Togliere');
    // this.scriveLog('Tipo:', tipo);
    // this.scriveLog('Cosa da togliere:', e);

    this.pulisceSelezioneDaTogliere = '';
    this.EventiDeselezionati = JSON.parse(JSON.stringify(e.dati));

    this.scriveLog('Eventi locali. Eventi da togliere: ', this.EventiDeselezionati);
  }

  refreshGridEventi(e, r) {
    this.LeggeEventi();
  }

  refreshGridEventiDaTogliere(e) {

  }

  ToglieGliEventiDaGrigliaMettere() {
    this.scriveLog('Eventi locali. Tolgo eventi da mettere:', this.datiModificati.datiEventiDaPassareM, 
          this.datiEventiDaMettere2, this.EventiSelezionati);

    let t = '';
    const app = JSON.parse(JSON.stringify(this.datiEventiDaMettere2));

    if (app !== undefined && app.DataTable !== undefined && app.DataTable !== 'empty grid') {
      app.DataTable.forEach(element => {
        let ok = true;
        if (this.EventiSelezionati && this.EventiSelezionati !== 'empty grid') {
          this.EventiSelezionati.forEach(element2 => {
            if (ok) {
              if (element.EVENT_TYPE === element2.EVENT_TYPE) {
                this.scriveLog('Eventi locali. Tolgo eventi. Trovato:', element.ROW_ID);
                ok = false;
              }
            }
          });
        }
        if (ok) {
          let tt = JSON.stringify(element);
          tt = tt.replace('BCK_COLOR', 'BackColor');
          tt = tt.replace('FORE_COLOR', 'ForeColor');
          t += tt + ',';
        }
      });
    }
    if (t.length > 0) {
      t = t.substring(0, t.length - 1);
      t = '[' + t + ']';
      const tt = JSON.parse(t);

      this.scriveLog('Eventi locali. Togliere: ', tt);
      // this.datiEventiDaMettere = this.CreateemptyGrid('Nuovi');
      this.datiEventiDaMettere2.DataTable = tt;
      // this.scriveLog('Tolti:', this.datiEventiDaMettere2.DataTable);
    } else {
      this.scriveLog('Eventi locali. Azzero griglia eventi da mettere: ', t.length);
      this.datiEventiDaMettere2 = 'empty grid';
    }

    this.scriveLog('Eventi locali. Griglia risultante: ', this.datiEventiDaMettere2);
  }

  FaIlRefreshDelleGriglie() {
    if (this.datiModificati.datiEventiDaPassareM.DataTable === 'empty grid') {
      this.datiModificati.datiEventiDaPassareM = 'empty grid';
    }

    const app = JSON.parse(JSON.stringify(this.datiModificati.datiEventiDaPassareM));
    this.datiModificati.datiEventiDaPassareM = 'empty grid';
    const tm1 = setTimeout(() => {
      clearTimeout(tm1);

      // this.effettuaAutoFitEL = !this.effettuaAutoFitEL;
      this.datiModificati.datiEventiDaPassareM = JSON.parse(JSON.stringify(app));
    }, 100);
    return;

    this.scriveLog('Eventi locali. Refresh griglie');
    // Doppio valore soltanto per far scattare l'evento nella griglia
    this.refreshGrigliaMettere = true;
    this.refreshGrigliaTogliere = true;
    const dati = JSON.parse(JSON.stringify(this.datiModificati.datiEventiDaPassareM));
    this.datiModificati.datiEventiDaPassareM = undefined;
    this.scriveLog('Eventi locali. Refresh griglie. Dati appoggiati: ', dati);
    // Doppio valore soltanto per far scattare l'evento nella griglia
    const tm = setTimeout(() => {
          clearTimeout(tm);
      this.refreshGrigliaMettere = false;
      this.refreshGrigliaTogliere = false;
      this.datiModificati.datiEventiDaPassareM = JSON.parse(JSON.stringify(dati));
      this.scriveLog('Eventi locali. Refresh griglie. Dati reinseriti: ', this.datiModificati.datiEventiDaPassareM);
    }, 500);
  }

  AggiungeEventiAGrigliaTogliere() {
    this.scriveLog('Eventi locali. Aggiungo eventi:', this.EventiSelezionati, this.datiModificati.datiEventiDaPassareM);
    // logConsole('Eventi selezionati', this.EventiSelezionati);
    let s = '';

    let q = 0;
    if (!this.datiModificati.datiEventiDaPassareM || !this.datiModificati.datiEventiDaPassareM.DataTable ||
        this.datiModificati.datiEventiDaPassareM === 'empty grid' ||
        this.datiModificati.datiEventiDaPassareM.DataTable === 'empty grid') {
          this.datiModificati.datiEventiDaPassareM = JSON.parse(JSON.stringify(this.Utils.strutturaGrigliaDiBase));
      this.scriveLog('Eventi locali. Aggiungo eventi: Creo tabella');
    } else {
      this.scriveLog('Eventi locali. Aggiungo eventi: Copio tabella già esistente: ', this.datiModificati.datiEventiDaPassareM);
      this.datiModificati.datiEventiDaPassareM.DataTable.forEach(element => {
        s += JSON.stringify(element) + ',';
        q++;
      });
    }
    this.scriveLog('Eventi locali. Eventi selezionati:', this.EventiSelezionati);
    this.scriveLog('Eventi locali. Eventi già messi:', q);

    this.EventiSelezionati.forEach(element => {
      let ok = true;
      if (this.datiModificati.datiEventiDaPassareM && this.datiModificati.datiEventiDaPassareM !== 'empty grid'       
        && this.datiModificati.datiEventiDaPassareM.DataTable && this.datiModificati.datiEventiDaPassareM.DataTable !== 'empty grid') {
        this.datiModificati.datiEventiDaPassareM.DataTable.forEach(element2 => {
          if (!ok && element.DISPLAY_NAME === element2.DISPLAY_NAME) {
            ok = false;
          }
        });
      }
      if (ok) {
        this.scriveLog('Eventi locali. Aggiungo evento:', element.DISPLAY_NAME);
        s += JSON.stringify(element) + ',';
      } else {
        this.scriveLog('Eventi locali. NON aggiungo ' + element.DISPLAY_NAME + ' già presente');
      }
    });
    // alert('ppp: ' + s.length);
    if (s.length > 0) {
      s = s.substring(0, s.length - 1);
      s = '[' + s + ']';
      const ss = JSON.parse(s);
      this.scriveLog('Eventi locali. Eventi totali:', ss);

      const sorted = ss.sort(function(a, b) {return a.ROW_ID - b.ROW_ID});
      this.scriveLog('Eventi locali. Da aggiungere:', ss);

      if (this.datiModificati.datiEventiDaPassareM && this.datiModificati.datiEventiDaPassareM.DataTable) {
        // if (this.datiModificati.datiEventiDaPassareM === undefined) {
        //   this.datiModificati.datiEventiDaPassareM = 'empty grid';
        // }

        const appT = JSON.parse(JSON.stringify(this.datiModificati.datiEventiDaPassareM));
        appT.DataTable = sorted;
        this.datiModificati.datiEventiDaPassareM = appT;
      } else {
        let title = 'Events Selected';
        if (this.datiModificati.datiEventiDaPassareM.GridProperty && this.datiModificati.datiEventiDaPassareM.GridProperty[0].GridName) {
          title = this.datiModificati.datiEventiDaPassareM.GridProperty[0].GridName;
        }
        this.datiModificati.datiEventiDaPassareM = JSON.parse(JSON.stringify(this.Utils.strutturaGrigliaDiBase));
        this.datiModificati.datiEventiDaPassareM.DataTable = sorted;
        this.datiModificati.datiEventiDaPassareM.GridProperty[0].GridName = title;
        this.datiModificati.datiEventiDaPassareM.GridProperty[0].ItemsPerPage = "25"
      }

      // this.FaIlRefreshDelleGriglie();
  
      // this.ToglieGliEventiDaGrigliaMettere();
    }
    this.scriveLog('Eventi locali. Eventi selezionati:', this.datiModificati.datiEventiDaPassareM);
  }

  AggiungeEventiAGrigliaMettere() {
    let s = '';
    let q = 0;
    this.scriveLog('Eventi Locali: Aggiunge eventi. ', this.datiEventiDaMettere2);
    if (this.datiEventiDaMettere2 && this.datiEventiDaMettere2.DataTable) {
      this.datiEventiDaMettere2.DataTable.forEach(element => {
        s += JSON.stringify(element) + ',';
        q++;
      });
    }
    this.scriveLog('Eventi Locali: Aggiunge eventi. Eventi Deselezionati:', this.EventiDeselezionati);
    this.scriveLog('Eventi Locali: Aggiunge eventi. Eventi già messi:', q);

    this.EventiDeselezionati.forEach(element => {
      s += JSON.stringify(element) + ',';
    });
    if (s.length > 0) {
      s = s.substring(0, s.length - 1);
      s = '[' + s + ']';
      const ss = JSON.parse(s);
      /* if (this.Debug === true) {
        this.scriveLog('EVENTS data 2-1:', ss);
        ss.DataTable.forEach(element => {
          if (element.EVENT_TYPE === 'CADF') {
            this.scriveLog('CADF trovato:', element);
          }
        });
      } */

      const sorted = ss.sort(function(a, b) {return a.EVENT_TYPE - b.EVENT_TYPE});
      this.scriveLog('Eventi Locali: Aggiunge eventi. Da aggiungere:', ss);

      if (this.datiEventiDaMettere2 && this.datiEventiDaMettere2.DataTable) {
        const appT = JSON.parse(JSON.stringify(this.datiEventiDaMettere2));
        appT.DataTable = sorted;
        /* if (this.Debug === true) {
          this.scriveLog('EVENTS data 2:', appT.DataTable);
          appT.DataTable.forEach(element => {
            if (element.EVENT_TYPE === 'CADF') {
              this.scriveLog('CADF trovato:', element);
            }
          });
        } */
        this.datiEventiDaMettere2 = appT;
      } else {
        // this.scriveLog(this.datiEventiDaMettere);
        let title = 'Events';
        if (this.datiEventiDaMettere2.GridProperty && this.datiEventiDaMettere2.GridProperty[0].GridName) {
          title = this.datiEventiDaMettere2.GridProperty[0].GridName;
        }
        /* if (this.Debug === true) {
          this.scriveLog('EVENTS data 3:', this.Utils.strutturaGrigliaDiBase);
          this.Utils.strutturaGrigliaDiBase.DataTable.forEach(element => {
            if (element.EVENT_TYPE === 'CADF') {
              this.scriveLog('CADF trovato:', element);
            }
          });
        } */

        // this.FaIlRefreshDelleGriglie();

        this.datiEventiDaMettere2 = this.Utils.strutturaGrigliaDiBase;
        this.datiEventiDaMettere2.DataTable = sorted;
        this.datiEventiDaMettere2.GridProperty[0].GridName = title;
        this.scriveLog('Eventi locali. Aggiunge eventi. Eventi da mettere', this.datiEventiDaMettere2.DataTable);
      }
    }
  }

  ToglieEventiDaGrigliaTogliere() {
    this.scriveLog('Eventi Locali: Eventi da togliere. Tolgo eventi da togliere:', this.EventiDeselezionati, 
      this.datiModificati.datiEventiDaPassareM);

    if (this.datiModificati.datiEventiDaPassareM.DataTable.length === 0) {
      alert('Grid empty');
      return;
    }

    const app = new Array();
    this.datiModificati.datiEventiDaPassareM.DataTable.forEach(element => {
      let ok = true;
      this.EventiDeselezionati.forEach(element2 => {
        if (ok) {
          if (element2.EVENT_TYPE === element.EVENT_TYPE) {
            ok = false;
          }
        }
      });
      if (ok) {
        app.push(element);
      }
    });
    this.scriveLog('Eventi Locali: Eventi da togliere. Rimasti:', app);
    // if (app.length > 0) {
      this.datiModificati.datiEventiDaPassareM.DataTable = app;
    /* } else {
      this.datiModificati.datiEventiDaPassareM = 'empty grid';
    } */
    this.scriveLog('Eventi Locali: Eventi da togliere. Nuova griglia:', this.datiModificati.datiEventiDaPassareM);

    // this.FaIlRefreshDelleGriglie();
  }

  metteEventi() {
    if (!this.permetteEmit) {
      return;
    }

    if (this.EventiSelezionati.length === 0) {
      this.messaggioDiErrore(this, 'Please select one or more events');
      return;
    }

    // this.scriveLog(this.EventiSelezionati);

    this.AggiungeEventiAGrigliaTogliere();

    this.gestisceSelezioneGriglia();

    // this.scriveLog('Eventi selezionati 1:', this.datiModificati.datiEventiDaPassareM);
    this.ToglieGliEventiDaGrigliaMettere();

    this.EventiSelezionati = new Array();
    this.pulisceSelezioneDaMettere = 'OK';

    // this.scriveLog('Passaggio dati 1:', this.datiModificati.datiEventiDaPassareM.DataTable)
    this.scriveLog('Eventi Locali: Impostazione EVENTS', this.datiModificati.datiEventiDaPassareM);

    let ll = JSON.stringify(this.datiModificati.datiEventiDaPassareM.DataTable);

    // this.scriveLog('Lista eventi temporanei:', ll);
    // logConsole('Lista eventi da passare modificata: ', ll);

    // this.listaEventiTemp.emit(ll);
    this.listaEventi.emit(ll);

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);

    this.FaIlRefreshDelleGriglie();

    this.checkSeCiSonoModifiche();
  }

  toglieEventi() {
    if (!this.permetteEmit) {
      return;
    }

    if (this.EventiDeselezionati.length === 0) {
      this.messaggioDiErrore(this, 'Please select one or more selected events');
      return;
    }

    this.ToglieEventiDaGrigliaTogliere();
    // return;

    this.gestisceSelezioneGriglia();

    this.AggiungeEventiAGrigliaMettere();

    this.EventiDeselezionati = new Array();
    this.pulisceSelezioneDaTogliere = 'OK';

    // this.scriveLog('Passaggio dati 2:', this.datiModificati.datiEventiDaPassareM.DataTable)
    // let ll = '';
    // if (this.datiModificati.datiEventiDaPassareM.DataTable && this.datiModificati.datiEventiDaPassareM.DataTable.length > 0) {
    this.scriveLog('Eventi Locali: Impostazione EVENTS', this.datiModificati.datiEventiDaPassareM);

    const ll = JSON.stringify(this.datiModificati.datiEventiDaPassareM.DataTable);
    // }

    // this.scriveLog('Eventi rimasti:', ll);

    // this.listaEventiTemp.emit(ll);
    this.listaEventi.emit(ll);

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);

    this.FaIlRefreshDelleGriglie();

    this.checkSeCiSonoModifiche();
  }

  gestisceSelezioneGriglia() {
    this.scriveLog('Eventi locali. Gestisce selezione griglia 1', this.datiModificati.datiEventiDaPassareM, this.datiEventiDaMettere2);
    if (this.datiModificati.datiEventiDaPassareM && this.datiModificati.datiEventiDaPassareM.DataTable) {
      if (this.datiModificati.datiEventiDaPassareM.DataTable.length > 0) {
        this.selezioneMultiplaTogliere = true;
      } else {
        this.selezioneMultiplaTogliere = false;
        this.datiModificati.datiEventiDaPassareM = 'empty grid';
      }
    } else {
      this.datiModificati.datiEventiDaPassareM = 'empty grid';
    }

    if (this.datiEventiDaMettere2 && this.datiEventiDaMettere2.DataTable) {
      if (this.datiEventiDaMettere2.DataTable.length > 0) {
        this.selezioneMultiplaMettere = true;
      } else {
        this.selezioneMultiplaMettere = false;
        this.datiEventiDaMettere2 = 'empty grid';
      }
    } else {
      this.datiEventiDaMettere2 = 'empty grid';
    }
    this.scriveLog('Eventi locali. Gestisce selezione griglia 2', this.datiModificati.datiEventiDaPassareM, this.datiEventiDaMettere2);
  }

  selectActivity(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (e) {
      // this.scriveLog('Activity selezionata in settings:', e);
      // const ee = JSON.parse(e);
      const ee = this.ritornaRigaTotaleDaDescrizioneCombo(e, this.Utils.datiTipiActivity, 'name');
      // this.scriveLog('valore impostato activity:', this.datiModificati.activityM); // = ee.id;
      this.datiModificati.activityM = e.id;
      this.activityEmit.emit(e);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }
  }

  cambioHeightChart(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (e) {
      if (e.id !== this.datiModificati.heightChartM) {
        this.scriveLog('Height chart cambiata in settings:', e, this.datiModificati.heightChartM);
        // const ee = JSON.parse(e);
        // this.scriveLog('valore impostato activity:', this.datiModificati.activityM); // = ee.id;
        this.datiModificati.heightChartM = e.id;
        this.heightChartEmit.emit(e);
        this.checkSeCiSonoModifiche();

        this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
        this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
      }
    }
  }

  selectGeoFilter(e) {
    if (!this.permetteEmit) {
      return;
    }

    // if (e) {
      if (this.Debug === true) {
        this.scriveLog('Geofilter selezionata in settings:', e);
      }
      // const ee = JSON.parse(e);
      this.datiModificati.geoFilterM = e.ID;
      this.geoFilterEmit.emit(e.ID);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    // }
  }

  selectAntenne(e) {
    if (!this.permetteEmit) {
      return;
    }

    // logConsole('Selezione antenne', e);
    // if (e && e !== 'empty' && e !== '0') {
    if (e.id) {
      if (this.Debug === true) {
        this.scriveLog('Select Antenne', e.id);
      }
      this.datiModificati.isCheckedAntenneM = e.id;
      // logConsole('Antenne settate', e, this.datiAntenne, e.id);

      this.isCheckedAntenneEmit.emit(e.id);

      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }
  }

  selectSla(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (e && e !== 'empty') {
      // const ee = this.Utils.converteStringaInJSON(e);
      const ee = this.ritornaRigaTotaleDaDescrizioneCombo(e, this.datiSlaDT, 'NAME');

      // this.slaValueToPass = ee;
      this.slaValue = ee.ID;
      // this.scriveLog('nuovo valore SLA', ee);
      this.slaEmit.emit(ee);
      this.checkSeCiSonoModifiche();
    } else {
      // this.slaValueToPass = '';
      this.slaValue = '';
      // this.scriveLog('nuovo valore SLA', 'Vuoto');
      this.slaEmit.emit('');
      this.checkSeCiSonoModifiche();
    }

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
  }

  debounceTimerFrameName;

  cambioNomeFrame(value) {
    this.datiModificati.mapNameM = value;

    clearTimeout(this.debounceTimerFrameName);

    this.debounceTimerFrameName = setTimeout(() => {
      clearInterval(this.debounceTimerFrameName);
      this.debounceTimerFrameName = undefined;

      this.cambioNomeFrame2(value);
    }, 500);
  }

  cambioNomeFrame2(n) {
    if (!this.permetteEmit) {
      return;
    }

    // if (n) {
      this.scriveLog('MapName: Cambio nome frame:', n);
      if (!n || n === null || n.trim() === '') {
        n = '<empty>';
      }
      this.datiModificati.mapNameM = n;
      // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Frame name emit 2', n);
      this.frameNameEmit.emit(n);
      this.checkSeCiSonoModifiche();

      // this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      // this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
        // }
  }

  debounceTimerFrameDesc;

  cambioDescrizioneFrame(value) {
    this.datiModificati.descrizioneM = value;

    clearTimeout(this.debounceTimerFrameDesc);

    this.debounceTimerFrameDesc = setTimeout(() => {
      clearInterval(this.debounceTimerFrameDesc);
      this.debounceTimerFrameDesc = undefined;
      
      this.cambioDescrizioneFrame2(value);
    }, 500);
  }

  cambioDescrizioneFrame2(m) {
    if (!this.permetteEmit) {
      return;
    }

    // if (m) {
      // this.scriveLog('Cambio descrizione frame:', m);
      this.datiModificati.descrizioneM = m;
      this.descrizioneEmit.emit(m);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    // }
  }

  cambioPlmn(p) {
    if (!this.permetteEmit) {
      return;
    }

    // if (p) {
      // this.scriveLog('Cambio plmn:', p);
      this.datiModificati.plmn = p;
      this.plmnEmit.emit(p);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
        // }
  }

  cambioNetTech(n) {
    if (!this.permetteEmit) {
      return;
    }

    this.datiModificati.netTechM = n;
    this.netTechEmit.emit(n);
    this.checkSeCiSonoModifiche();

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
  }

  cambioShownEvents() {
    if (!this.permetteEmit) {
      return;
    }

    const t = setTimeout(() => {
      clearTimeout(t);

      // this.datiModificati.shownEventsM = n;
      this.shownEventsEmit.emit(this.datiModificati.shownEventsM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  cambioShowMeasures() {
    if (!this.permetteEmit) {
      return;
    }

    const t = setTimeout(() => {
      clearTimeout(t);

      // this.datiModificati.showMeasuresM = n;
      this.showMeasuresEmit.emit(this.datiModificati.showMeasuresM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  cambioShowMeasuresS() {
    if (!this.permetteEmit) {
      return;
    }

    const t = setTimeout(() => {
      clearTimeout(t);

      if (this.Debug === true) {
        this.scriveLog('Cambiato show measuresS', this.datiModificati.showMeasuresSM);
      }
      // this.datiModificati.showMeasuresSM = n;
      this.showMeasuresSEmit.emit(this.datiModificati.showMeasuresSM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  cambioshowVoiceCallMeasures() {
    if (!this.permetteEmit) {
      return;
    }

    const t = setTimeout(() => {
      clearTimeout(t);

      if (this.Debug === true) {
        this.scriveLog('Cambiato show voice call measures', this.datiModificati.showVoiceCallMeasuresM);
      }
      // this.datiModificati.showVoiceCallMeasuresM = n;
      this.showVoiceCallMeasuresEmit.emit(this.datiModificati.showVoiceCallMeasuresM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  cambioshowCoverageMeasures() {
    if (!this.permetteEmit) {
      return;
    }

    const t = setTimeout(() => {
      clearTimeout(t);

      // if (this.Debug === true) {
        this.scriveLog('Cambiato show coverage measures', this.datiModificati.showCoverageMeasuresM);
      // }
      // this.datiModificati.showCoverageMeasuresM = n;
      this.showCoverageMeasuresEmit.emit(this.datiModificati.showCoverageMeasuresM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  cambioshowDataMeasures() {
    const t = setTimeout(() => {
      clearTimeout(t);

      // if (this.Debug === true) {
        this.scriveLog('Cambiato show data measures', this.datiModificati.showDataMeasuresM);
      // }
      // this.datiModificati.showDataMeasuresM = n;
      this.showDataMeasuresEmit.emit(this.datiModificati.showDataMeasuresM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  cambioShowSamplesMeasures() {
    if (!this.permetteEmit) {
      return;
    }

    const t = setTimeout(() => {
      clearTimeout(t);

      if (this.Debug === true) {
        this.scriveLog('Cambiato show samples measures', this.datiModificati.showSamplesMeasuresM);
      }
      // this.datiModificati.showSamplesMeasuresM = n;
      this.showSamplesMeasuresEmit.emit(this.datiModificati.showSamplesMeasuresM);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  cambioSquareMeters(n) {
    if (!this.permetteEmit) {
      return;
    }

    if (n !== undefined && n !== 'undefined') {
      // if (typeof(n) !== 'string') {
      // // logConsole('Square side 1', n, typeof(n));
      if (typeof(n) !== 'object' && n.indexOf('***') > -1) {
        n = n.replace('***', '');

        if (this.isNumeric(n)) {
          const nn = { CODE: n.toString(), DISPLAY_NAME: n.toString() };

          n = nn;

          let ok = false;
          this.DatiSquareMeters.forEach(element => {
            if (!ok && +element.CODE === +n.CODE) {
              ok = true;
            }
          });
          if (!ok) {
            this.DatiSquareMeters.push(nn);
            this.DatiSquareMeters.sort((a, b) => +a.CODE - +b.CODE);
            this.DatiSquareMeters = JSON.parse(JSON.stringify(this.DatiSquareMeters));

            // // logConsole('Nuovo array square side', this.DatiSquareMeters, +n);
          }
        } else {
          alert('\'' + n + '\' is not a valid value');
          return;
        }
      }
      this.scriveLog('Cambio square meters', n, n.DISPLAY_NAME);
    
      // logConsole('Cambio square meters', n, n.DISPLAY_NAME);
      
      this.datiModificati.squareMetersM = n.DISPLAY_NAME;
      this.squareMetersEmit.emit(n.DISPLAY_NAME);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
      // }
    }
  }

  cambioMosaicStyle(n) {
    if (!this.permetteEmit) {
      return;
    }

    // // logConsole('Cambio mosaic style', n);
    if (n && n !== undefined && n !== 'undefined') {
      // this.scriveLog('Cambio square meters', n, n.DISPLAY_NAME);
      this.datiModificati.mosaicStyleM = n.CODE_STR;
      this.mosaicStyleEmit.emit(n.CODE_STR);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }
  }
 
  selectMeasureType(n) {
    if (!this.permetteEmit) {
      return;
    }

    if (n && n !== undefined && n !== 'undefined') {
      // this.scriveLog('Measure type', n);
      this.datiModificati.measureType = n.id;
      this.measureTypeEmit.emit(n.id);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }
  }

  cambioDoNoSetGM(n) {
    if (!this.permetteEmit) {
      return;
    }

    this.datiModificati.doNotSetGMM = n;
    this.doNoSetGMEmit.emit(n);
    this.checkSeCiSonoModifiche();
  }

  cambioModificaChart() {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);
        
      // this.datiModificati.modificaChartM = n;
      this.modificaChartEmit.emit(this.datiModificati.modificaChartM);
      this.checkSeCiSonoModifiche();
    }, 100);
  }

  cambioMultiselect() {
    if (!this.permetteEmit) {
      return;
    }

    // this.showMultiSelect = n;
    this.showMultiSelectEmit.emit(this.showMultiSelect);
  }

  cambioBandWidth(b) {
    if (!this.permetteEmit) {
      return;
    }

    this.datiModificati.bandWidthM = b;
    this.bandWidthEmit.emit(b);
    this.checkSeCiSonoModifiche();

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
  }

  cambioCountHystogram(b) {
    if (!this.permetteEmit) {
      return;
    }

    this.datiModificati.countHystogram = b;
    this.countHistogramEmit.emit(b);
    this.checkSeCiSonoModifiche();

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
  }

  cambioSeverity(b) {
    if (!this.permetteEmit) {
      return;
    }

    this.datiModificati.severityM = b;
    this.checkSeverityEmit.emit(b);
    this.checkSeCiSonoModifiche();

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
  }

  staChiudendo = false;

  chiudiMenu(ok: string) {
    if (!this.permetteEmit) {
      return;
    }

    this.staChiudendo = true;

    // this.scriveLog('ok:', ok, this.modificheEffettuate);
    this.puoEffettuareControlli = false;
    this.checkSeCiSonoModificheEmit.emit(this.modificheEffettuate);

    this.pulisceValoriCombo = true;
    // this.scriveLog(1);
    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (ok === '1') {
        if (this.modificheEffettuate === true) {
          // this.scriveLog(2);
          this.aggiornaDati('Chiudi Menù');
          this.aggiornaDatiOriginali('ChiudiMenu');
          /* if (this.datiPivot !== undefined) {
            this.viewDefinition.emit(this.datiPivot.viewDefinition);
          } */
        }
        // this.menuVisibile = false;

        this.destroy$.next();
        this.destroy$.complete();  
    
        this.visibileEmit.emit('');
      } else {
        if (this.modificheEffettuate === true) {
          let campi = '';
          if (this.valoriDiversi) {
            this.valoriDiversi.forEach(element => {
              if (campi.indexOf('&nbsp;' + element) === -1) {
                campi += '<br />&#x2022;&nbsp;' + element;
              }
            });
          }
          this.mostraPopupNuovo('Close loosing changes?<br />' + campi); // , true, 'CLOSE');
          /* if (confirm('Do you want to lose all your changes?')) {
            this.undo();
            this.menuVisibile = false;
            this.visibileEmit.emit(false);
          } */
        } else {
          const tt = setTimeout(() => {
            clearTimeout(tt);

            this.staChiudendo = false;
          }, 1500);

          // this.menuVisibile = false;

          this.destroy$.next();
          this.destroy$.complete();  
      
          this.visibileEmit.emit('');
        }
      }
    }, 100);
  }

  aggiornaDati(daDove) {
    if (!this.permetteEmit) {
      return;
    }

    // return;

    // this.scriveLog('Aggiorno i dati da settings');

    // this.scriveLog('Lista Eventi da settings:', this.datiModificati.datiEventiDaPassareM.DataTable);
    this.listaEventi.emit(this.datiModificati.datiEventiDaPassareM.DataTable);

    let mg = '';
    let mt = '';
    let act = '';
    // const m1 = ['', '', '', ''];
    let sl = '';

    // this.Utils.rinfrescaGrafico = true;
    // this.Utils.rinfrescaGraficoScatter = true;
    // this.Utils.rinfrescaGraficoHistogram = true;
    // this.Utils.rinfrescaGraficoPareto = true;

    // this.scriveLog('Activity modificata:', this.datiModificati.activityM);
    if (this.Utils.datiTipiActivity && this.Utils.datiTipiActivity !== null && typeof(this.Utils.datiTipiActivity) !== 'string') {
      this.Utils.datiTipiActivity.forEach(element => {
        if (element.id === this.datiModificati.activityM) {
          act = element;
        }
      });
    }
    // this.scriveLog('Salvataggio', this.datiModificati.mappaOGraficoM);
    if (this.datiTipiFrame && this.datiTipiFrame !== null && typeof(this.datiTipiFrame) !== 'string') {
      this.datiTipiFrame.forEach(element => {
        if (element.id === this.datiModificati.mappaOGraficoM) {
          mg = element;
        }
      });
    }
    if (this.Utils.mappe && this.Utils.mappe !== null && typeof(this.Utils.mappe) !== 'string') {
      this.Utils.mappe.forEach(element => {
        if (element.id === this.datiModificati.mapTypeM) {
          mt = element.id;
        }
      });
    }
    if (this.datiSlaDT && this.datiSlaDT !== null && typeof(this.datiSlaDT) !== 'string') {
      this.datiSlaDT.forEach(element => {
        if (element.ID === this.datiModificati.slaValue2M) {
          sl = element;
          this.datiModificati.slaValue2M = element.ID;
        }
      });
    }

    this.datiModificati.clusterMeasureM = this.filter1
    this.datiModificati.textFilterM = this.txtFilter1;
    this.datiModificati.clusterMeasure2M = this.filter2;
    this.datiModificati.textFilter2M = this.txtFilter2;

    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.MappaOGraficoEmit.emit(mg);
      this.tipoMappaEmit.emit(mt);

      this.overviewZoomEmit.emit(this.datiModificati.viewGlobalM);
      this.isCheckedServingCellEmit.emit(this.datiModificati.isCheckedServingCellM);
      this.isCheckedShowPathsEmit.emit(this.datiModificati.isCheckedShowPathsM);
      this.isCheckedShowSelectedPathsEmit.emit(this.datiModificati.isCheckedShowSelectedPathsM);
      this.isCheckedAntenneEmit.emit(this.datiModificati.isCheckedAntenneM);
      this.isNonSyncEventTimeEmit.emit(this.datiModificati.isNonSyncEventTimeM);
      this.isStandAloneMREmit.emit(this.datiModificati.isStandAloneMR);
      this.showAxisXEmit.emit(this.datiModificati.showAxisXM);
      this.heightChartEmit.emit(this.datiModificati.heightChartM);
      this.tipoDatiLayoutMEmit.emit(this.datiModificati.tipoDatiLayoutM);
      this.flowTypeMSEmit.emit(this.datiModificati.flowTypeMS);
      this.viewModeMSEmit.emit(this.datiModificati.viewModeMS);

      // this.scriveLog('Measure modificate:', this.datiModificati.measureM);

      // this.scriveLog('Emit misure 3');
      // // logConsole('Misure emit 5', daDove, this.datiModificati.measureM);
      // logConsole('Misure passate', this.datiModificati.measureM);
      // logConsole('Misure emit 8', this.datiModificati.measureM);
      this.measureEmit.emit(this.datiModificati.measureM);
      // this.scriveLog('Activity emessa dal setting:', act);
      this.activityEmit.emit(act);
      this.geoFilterEmit.emit(this.datiModificati.geoFilterM);
      this.slaEmit.emit(sl);

      // this.scriveLog('Emit nome frame in fase di chiusura settings: ', this.datiModificati.mapNameM);
      // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Frame name emit 3', this.datiModificati.mapNameM);
      this.frameNameEmit.emit(this.datiModificati.mapNameM);
      this.descrizioneEmit.emit(this.datiModificati.descrizioneM);
      this.plmnEmit.emit(this.datiModificati.plmnM);
      this.netTechEmit.emit(this.datiModificati.NetTechM);
      this.bandWidthEmit.emit(this.datiModificati.bandWidthM);
      this.countHistogramEmit.emit(this.datiModificati.countHistogram);
      this.checkSeverityEmit.emit(this.datiModificati.severityM);
      this.listaEventi.emit(this.datiModificati.datiEventiDaPassareM.DataTable);
      this.viewAsEmit.emit(this.datiModificati.viewAsM);
      this.overlayEmit.emit(this.datiModificati.overlayM);
      this.overlayClusterEmit.emit(this.datiModificati.overlayClusterM);
      this.timeFilterEmit.emit(this.datiModificati.timeFilterM);
      this.bboxOverViewZoomEmit.emit(this.datiModificati.bboxOverViewZoomM);
      this.tipoDatasetEmit.emit(this.datiModificati.tipoDatasetM);
      this.designInfoEmit.emit(this.datiModificati.designInfoM);
      this.histDisplayAsEmit.emit(this.datiModificati.histDisplayAsM);
      this.histDisplayTuttoEmit.emit(this.datiModificati.HistDisplayTuttoM);
      this.columnsBarsEmit.emit(this.datiModificati.columnsBarsM);
      this.doubleGraphEmit.emit(this.datiModificati.doubleGraphM);
      this.eventsMeasureEmit.emit(this.datiModificati.eventsMeasureM);
      this.showPlanimetryEmit.emit(this.datiModificati.showPlanimetryM);
      // this.columnsSettingsEmit.emit(this.datiModificati.columnsSettingsM);
      // this.scriveLog('Ritorno tipo evento 1', this.datiModificati.tipoEventoM);
      this.tipoEventoEmit.emit(this.datiModificati.tipoEventoM);
      // this.scriveLog(this.datiModificati.styleImpostatoM);
      this.styleImpostatoEmit.emit(this.datiModificati.styleImpostatoM);
      // this.eventiSceltiESEmit.emit(this.datiModificati.eventiSceltiESM);
      this.fixedSecondsEmit.emit(this.datiModificati.fixedSecondsM);
      // this.cellTypeEmit.emit(this.datiModificati.cellTypeM);
      // this.addLayersEmit.emit(this.datiModificati.addLayersM);
      this.opacityEmit.emit(this.datiModificati.opacityM);
      this.shownEventsEmit.emit(this.datiModificati.shownEventsM);
      this.showRaysEmit.emit(this.datiModificati.showRaysM);
      this.showMeasuresEmit.emit(this.datiModificati.showMeasuresM);
      this.squareMetersEmit.emit(this.datiModificati.squareMetersM);
      this.measureTypeEmit.emit(this.datiModificati.measureTypeM);
      this.mosaicStyleEmit.emit(this.datiModificati.mosaicStyleM);
      this.sartPositionEmit.emit(this.datiModificati.sartPositionM);
      this.measureSMSEmit.emit(this.datiModificati.measureSMSM);
      this.mappeMSEmit.emit(this.datiModificati.mappeMSM);
      this.clusterMeasureEmit.emit(this.datiModificati.clusterMeasureM);
      this.clusterMeasure2Emit.emit(this.datiModificati.clusterMeasure2M);
      // this.lovEmit.emit(this.datiModificati.lovM);
      // logConsole('Emit filtro 1 settings (5)', this.datiModificati.textFilterM);
      this.textFilterEmit.emit(this.datiModificati.textFilterM);
      this.textFilter2Emit.emit(this.datiModificati.textFilter2M);
      // this.textLovEmit.emit(this.datiModificati.textLovM);
      this.addGlobalLayerEmit.emit(this.datiModificati.addGlobalLayerM);
      this.showRaysAllLayerEmit.emit(this.datiModificati.showRaysAllLayerM);
      this.measureRCMEmit.emit(this.datiModificati.measureRCM);
      this.correlationEmit.emit(this.datiModificati.correlationM);
      this.additionalMeasuresTCRUN.emit(this.misureAddizionaliTCRUN);

      this.misureAddizionaliTCRUNStart = '';
      
      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }, 100);
  }

  pulisceFiltroCM1: any = true;
  pulisceFiltroCM2: any = true;
  pulisceFiltroLov1: any = true;
  pulisceFiltroLov2: any = true;
  
  undo() {
    if (!this.permetteEmit) {
      return;
    }

    this.pulisceFiltroCM1 = new Date().toString();
    this.pulisceFiltroCM2 = new Date().toString();
    // this.pulisceFiltroLov1 = new Date().toString();
    // this.pulisceFiltroLov2 = new Date().toString();
    // this.datiModificati.clusterMeasureM = '';
    // this.datiModificati.clusterMeasure2M = '';
    // this.datiModificati.textFilterM = '';
    // this.datiModificati.textFilter2M = '';
    // this.lovM1Id = '';
    // this.lovM2Id = '';

    const t = setTimeout(() => {
      clearTimeout(t);
      
      this.datiModificati = JSON.parse(JSON.stringify(this.datiOriginali));
      // logConsole('Filtro 1', this.datiModificati.textFilterM);
      // logConsole('Filtro 2', this.datiModificati.textFilter2M);

      this.filter1 = this.datiModificati.clusterMeasureM;
      this.txtFilter1 = this.datiModificati.textFilterM;
      this.filter2 = this.datiModificati.clusterMeasure2M;
      this.txtFilter2 = this.datiModificati.textFilter2M;

      // this.cambioScrittaMisura2(this.datiModificati.clusterMeasureM, this.datiModificati.clusterMeasureM, false, 'CLUSTERMEASURE1', -1);
      // this.cambioScrittaMisura2(this.datiModificati.clusterMeasure2M, this.datiModificati.clusterMeasure2M, false, 'CLUSTERMEASURE2', -1);
    }, 100);

    this.misureAddizionaliTCRUN = JSON.parse(JSON.stringify(this.misureAddizionaliTCRUNStart));

    this.datiModificati.datiEventiDaPassareM = JSON.parse(JSON.stringify(this.listaEventiDaPassareOriginali));

    this.selezioneAddLayers = [];
    this.datiModificati.addLayersM = '';

    let ee = '[';
    let eee = '';

    let a = null;
    try {
      a = JSON.parse(this.datiOriginali.cellTypeM);
    } catch(e) {
      this.scriveLog('Parse error', this.datiOriginali.cellTypeM);
    }
    if (a) {
      a.forEach(element => {
        ee += '{"ROW_ID": ' + element.ROW_ID + ', "VALUE_STR": "' + element.VALUE_STR + '"},';
        eee += element.ROW_ID + ',';
      });
      if (ee.length > 2) {
        ee = ee.substring(0, ee.length - 1) + ']';
        eee = eee.substring(0, eee.length - 1);

        this.selezioneCellType = eee;
        this.datiModificati.cellTypeM = ee;

        // logConsole('Undo per cell types', this.selezioneCellType, this.datiOriginali.cellTypeM);
      }
    } else {
      this.selezioneCellType = [];
      this.datiModificati.cellTypeM = this.datiOriginali.cellTypeM;
    }

    // logConsole('Undo misure tcrun', this.appoggioValoriComboMATCRUN);
    if (this.appoggioValoriComboMATCRUN) {
      localStorage.setItem(this.userName + '_' + this.nomeGrigliaPM[this.NumeroFrame] + '_' + this.frameAttivo + '_SelectedPointInfoV2', this.appoggioValoriComboMATCRUN);
    }
    this.refreshPointMeasures(false);

    this.creaStrutturaMisure(false);

    let mg = this.datiModificati.mappaOGraficoM; // '';
    let mt = this.datiModificati.mapTypeM; // '';
    let act = this.datiModificati.activityM; // '';
    // const m1 = ['', '', '', ''];
    let sl = this.datiModificati.slaValue2M; // '';

    /* if (this.Utils.datiTipiActivity && this.Utils.datiTipiActivity !== null && typeof(this.Utils.datiTipiActivity) !== 'string') {
      this.Utils.datiTipiActivity.forEach(element => {
        if (element.id === this.datiOriginali.Activity) {
          act = element;
          this.datiModificati.activityM = element.id;
        }
      });
    }
    if (this.datiTipiFrame && this.datiTipiFrame !== null && typeof(this.datiTipiFrame) !== 'string') {
      if (this.datiOriginali.MapGraph === '') { this.datiOriginali.MapGraph = '--'; }
      // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, this.datiTipiFrame, this.datiOriginali.MapGraph);
      this.datiTipiFrame.forEach(element => {
        if (element.id === this.datiOriginali.MapGraph) {
          mg = element;
          this.datiModificati.mappaOGraficoM = element.id;
        }
      });
    }
    if (this.Utils.mappe && this.Utils.mappe !== null && typeof(this.Utils.mappe) !== 'string') {
      this.Utils.mappe.forEach(element => {
        if (element.id === this.datiOriginali.MapType) {
          mt = element.id;
          this.datiModificati.mapTypeM = element.id;
        }
      });
    }
    // this.scriveLog('Misura 1', this.datiOriginali.Measure1);
    if (this.datiSlaDT && this.datiSlaDT !== null && typeof(this.datiSlaDT) !== 'string') {
      this.datiSlaDT.forEach(element => {
        if (element.ID === this.datiOriginali.SLA) {
          sl = element;
          this.datiModificati.slaValue2M = element.ID;
        }
      });
    }

    this.datiModificati.mapNameM = this.datiOriginali.MapName;
    this.datiModificati.descrizioneM = this.datiOriginali.Descrizione;
    this.datiModificati.geoFilterM = this.datiOriginali.GeoFilter;
    this.datiModificati.viewGlobalM = this.datiOriginali.ViewGlobal;
    // this.datiModificati.mapTypeM = this.datiOriginali.MapType;
    this.datiModificati.isCheckedServingCellM = this.datiOriginali.ServingCell;
    this.datiModificati.isCheckedShowPathsM = this.datiOriginali.isCheckedShowPaths;
    this.datiModificati.isCheckedAntenneM = this.datiOriginali.Antenne;
    this.datiModificati.isNonSyncEventTimeM = this.datiOriginali.isNonSyncEventTime;
    this.datiModificati.showAxisXM = this.datiOriginali.ShowAxisX;
    this.datiModificati.heightChartM = this.datiOriginali.HeightChart;
    this.datiModificati.tipoDatiLayoutM = this.datiOriginali.tipoDatiLayoutM;
    this.datiModificati.plmnM = this.datiOriginali.PLMN;
    this.datiModificati.NetTechM = this.datiOriginali.NetTech;
    this.datiModificati.bandWidthM = this.datiOriginali.BandWidth;
    this.datiModificati.severityM = this.datiOriginali.Severity;
    this.datiModificati.countHistogram = this.datiOriginali.countHistogram;
    this.misureAddizionaliTCRUN = this.misureAddizionaliTCRUNStart;
    if (this.datiOriginali.ListaDaPassare === 'empty grid') {
      this.datiModificati.datiEventiDaPassareM = this.datiOriginali.ListaDaPassare;
      if (this.datiModificati.datiEventiDaPassareM === undefined) {
        this.datiModificati.datiEventiDaPassareM = 'empty grid';
      }
    } else {
      if (this.datiModificati.datiEventiDaPassareM === 'empty grid') {
        try {
          this.datiModificati.datiEventiDaPassareM = JSON.parse(JSON.stringify(this.Utils.strutturaGrigliaDiBase));
        } catch (e) {

        }
      }
      this.datiModificati.datiEventiDaPassareM.DataTable = this.datiOriginali.ListaDaPassare;
    }
    // this.datiModificati.measureM = this.datiOriginali.Measure;
    this.datiModificati.viewAsM = this.datiOriginali.ViewAs;
    this.datiModificati.overlayM = this.datiOriginali.Overlay;
    this.datiModificati.overlayClusterM = this.datiOriginali.OverlayCluster;
    this.datiModificati.timeFilterM = this.datiOriginali.TimeFilter;
    this.datiModificati.bboxOverViewZoomM = this.datiOriginali.BboxOverViewZoom;
    this.datiModificati.tipoDatasetM = this.datiOriginali.TipoDataset;
    this.datiModificati.designInfoM = this.datiOriginali.DesignInfo;
    this.datiModificati.histDisplayAsM = this.datiOriginali.HistDisplayAS;
    this.datiModificati.HistDisplayTuttoM = this.datiOriginali.HistDisplayTutto;
    this.datiModificati.columnsBarsM = this.datiOriginali.ColumnsBars;
    this.datiModificati.doubleGraphM = this.datiOriginali.doubleGraph;
    this.datiModificati.eventsMeasureM = this.datiOriginali.EventsMeasure;
    this.datiModificati.showPlanimetryM = this.datiOriginali.ShowPlanimetry;
    // this.datiModificati.columnsSettingsM = this.datiOriginali.ColumnsSettings;
    this.datiModificati.tipoEventoM = this.datiOriginali.TipoEvento;
    this.datiModificati.styleImpostatoM = this.datiOriginali.styleImpostato;
    // this.datiModificati.eventiSceltiESM = this.datiOriginali.EventiSceltiES;
    this.datiModificati.fixedSecondsM = this.datiOriginali.FixedSeconds;
    this.datiModificati.cellTypeM = this.datiOriginali.CellType;
    this.datiModificati.addLayersM = this.datiOriginali.AddLayers;
    this.datiModificati.opacityM = this.datiOriginali.Opacity;
    this.datiModificati.shownEventsM = this.datiOriginali.ShownEvents;
    this.datiModificati.showRaysM = this.datiOriginali.ShowRays;
    this.datiModificati.showMeasuresM = this.datiOriginali.ShowMeasures;
    this.datiModificati.squareMetersM = this.datiOriginali.SquareMeters;
    this.datiModificati.measureTypeM = this.datiOriginali.MeasureType;
    this.datiModificati.mosaicStyleM = this.datiOriginali.MosaicStyle;
    this.datiModificati.sartPositionM = this.datiOriginali.SartPosition;
    this.datiModificati.measureSMSM = this.datiOriginali.MeasureSMS;
    this.datiModificati.mappeMSM = this.datiOriginali.MappeMS;
    this.datiModificati.clusterMeasureM = this.datiOriginali.ClusterMeasure;
    this.datiModificati.clusterMeasure2M = this.datiOriginali.ClusterMeasure2;
    // this.datiModificati.lovM1 = this.datiOriginali.Lov1;
    // this.datiModificati.lovM2 = this.datiOriginali.Lov2;
    this.datiModificati.textFilterM = this.datiOriginali.TextFilter;
    this.datiModificati.textFilter2M = this.datiOriginali.TextFilter2;
    // this.datiModificati.textLovM = this.datiOriginali.TextLov;
    this.datiModificati.addGlobalLayerM = this.datiOriginali.AddGlobalLayer;
    this.datiModificati.measureRCM = this.datiOriginali.MeasureRCM;
    this.datiModificati.showRaysAllLayerM = this.datiOriginali.showRaysAllLayer;
    this.datiModificati.correlationM = this.datiOriginali.Correlation;
    this.datiModificati.isNonSyncEventTimeM = this.datiOriginali.isNonSyncEventTime;
    this.datiModificati.showAxisXM = this.datiOriginali.ShowAxisX;
    this.datiModificati.heightChartM = this.datiOriginali.HeightChart;
    this.datiModificati.tipoDatiLayoutM = this.datiOriginali.tipoDatiLayoutM;

    if (this.datiModificati.viewDefinition !== undefined) {
      this.datiModificati.viewDefinition = this.datiPivotOriginali;
    }

    // this.scriveLog('Dati modificati:', this.datiModificati); */
    // this.aggiornaDatiOriginali();

    this.MappaOGraficoEmit.emit(mg);
    this.tipoMappaEmit.emit(mt);

    this.overviewZoomEmit.emit(this.datiModificati.viewGlobalM);
    this.viewAsEmit.emit(this.datiModificati.viewAsM);
    this.isCheckedServingCellEmit.emit(this.datiModificati.isCheckedServingCellM);
    this.isCheckedShowPathsEmit.emit(this.datiModificati.isCheckedShowPathsM);
    this.isCheckedShowSelectedPathsEmit.emit(this.datiModificati.isCheckedShowSelectedPathsM);

    // this.scriveLog('Emit antenne:', this.datiModificati.isCheckedAntenneM);
    this.isCheckedAntenneEmit.emit(this.datiModificati.isCheckedAntenneM);
    this.viewModeMSEmit.emit(this.datiModificati.viewModeMS);
    this.flowTypeMSEmit.emit(this.datiModificati.flowTypeMS);
    this.isStandAloneMREmit.emit(this.datiModificati.isStandAloneMR);
    this.isNonSyncEventTimeEmit.emit(this.datiModificati.isNonSyncEventTimeM);
    this.showAxisXEmit.emit(this.datiModificati.showAxisXM);
    this.heightChartEmit.emit(this.datiModificati.heightChartM);
    this.tipoDatiLayoutMEmit.emit(this.datiModificati.tipoDatiLayoutM);

    // this.scriveLog('Emit misure 4');
    // // logConsole('Misure emit 6', this.datiModificati.measureM);
    // logConsole('Misure emit 9', this.datiModificati.measureM);
    this.measureEmit.emit(this.datiModificati.measureM);
    this.activityEmit.emit(act);
    this.slaEmit.emit(sl);

    this.geoFilterEmit.emit(this.datiModificati.geoFilterM);
    // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Frame name emit 4', this.datiModificati.mapNameM);
    this.frameNameEmit.emit(this.datiModificati.mapNameM);
    this.descrizioneEmit.emit(this.datiModificati.descrizioneM);
    this.plmnEmit.emit(this.datiModificati.plmnM);
    this.netTechEmit.emit(this.datiModificati.NetTechM);
    this.bandWidthEmit.emit(this.datiModificati.bandWidthM);
    this.countHistogramEmit.emit(this.datiModificati.countHistogram);
    this.checkSeverityEmit.emit(this.datiModificati.severityM);
    this.listaEventi.emit(this.datiModificati.datiEventiDaPassareM.DataTable);

    this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
    this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    this.viewAsEmit.emit(this.datiModificati.viewAsM);
    this.overlayEmit.emit(this.datiModificati.overlayM);
    this.overlayClusterEmit.emit(this.datiModificati.overlayClusterM);
    this.timeFilterEmit.emit(this.datiModificati.timeFilterM);
    this.bboxOverViewZoomEmit.emit(this.datiModificati.bboxOverViewZoomM);
    this.tipoDatasetEmit.emit(this.datiModificati.tipoDatasetM);
    this.designInfoEmit.emit(this.datiModificati.designInfoM);
    this.histDisplayAsEmit.emit(this.datiModificati.histDisplayAsM);
    this.histDisplayTuttoEmit.emit(this.datiModificati.HistDisplayTuttoM);
    this.columnsBarsEmit.emit(this.datiModificati.columnsBarsM);
    this.doubleGraphEmit.emit(this.datiModificati.doubleGraphM);
    this.eventsMeasureEmit.emit(this.datiModificati.eventsMeasureM);
    this.showPlanimetryEmit.emit(this.datiModificati.showPlanimetryM);
    // this.columnsSettingsEmit.emit(this.datiModificati.columnsSettingsM);
    // this.scriveLog('Ritorno tipo evento 2', this.datiModificati.tipoEventoM);
    this.tipoEventoEmit.emit(this.datiModificati.tipoEventoM);
    // this.scriveLog(this.datiModificati.styleImpostatoM);
    this.styleImpostatoEmit.emit(this.datiModificati.styleImpostatoM);
    // this.eventiSceltiESEmit.emit(this.datiModificati.eventiSceltiESM);
    this.fixedSecondsEmit.emit(this.datiModificati.fixedSecondsM);
    // this.cellTypeEmit.emit(this.datiModificati.cellTypeM);
    // this.addLayersEmit.emit(this.datiModificati.addLayersM);
    this.opacityEmit.emit(this.datiModificati.opacityM);
    this.shownEventsEmit.emit(this.datiModificati.showneEventsM);
    this.showRaysEmit.emit(this.datiModificati.showRaysM);
    this.showMeasuresEmit.emit(this.datiModificati.showMeasuresM);
    this.squareMetersEmit.emit(this.datiModificati.squareMetersM);
    this.measureTypeEmit.emit(this.datiModificati.measureTypeM);
    this.mosaicStyleEmit.emit(this.datiModificati.mosaicStyleM);
    this.sartPositionEmit.emit(this.datiModificati.sartPositionM);
    this.measureSMSEmit.emit(this.datiModificati.measureSMSM);
    this.mappeMSEmit.emit(this.datiModificati.mappeMSM);
    this.clusterMeasureEmit.emit(this.datiModificati.clusterMeasureM);
    this.clusterMeasure2Emit.emit(this.datiModificati.clusterMeasure2M);
    // this.lovEmit.emit(this.datiModificati.lovM);
    logConsole('Emit filtro 1 settings (6) undo: ', this.datiModificati.textFilterM);
    this.textFilterEmit.emit(this.datiModificati.textFilterM);
    this.textFilter2Emit.emit(this.datiModificati.textFilter2M);
    // this.textLovEmit.emit(this.datiModificati.textLovM);
    this.addGlobalLayerEmit.emit(this.datiModificati.addGlobalLayerM);
    this.measureRCMEmit.emit(this.datiModificati.measureRCM);
    this.showRaysAllLayerEmit.emit(this.datiModificati.showRaysAllLayerM);
    this.correlationEmit.emit(this.datiModificati.correlationM);
    this.isNonSyncEventTimeEmit.emit(this.datiModificati.isNonSyncEventTimeM);
    this.isStandAloneMREmit.emit(this.datiModificati.isStandAloneMR);
    this.flowTypeMSEmit.emit(this.datiModificati.flowTypeMS);
    this.viewModeMSEmit.emit(this.datiModificati.viewModeMS);
    this.showAxisXEmit.emit(this.datiModificati.showAxisXM);
    this.additionalMeasuresTCRUN.emit(this.misureAddizionaliTCRUN);
    this.heightChartEmit.emit(this.datiModificati.heightChartM);
    this.tipoDatiLayoutMEmit.emit(this.datiModificati.tipoDatiLayoutM);

    /* if (this.datiPivot) {
      this.viewDefinition.emit(this.datiPivot.viewDefinition);
    } */

    this.modificheEffettuate = false;
    // this.checkSeCiSonoModifiche();
  }

  visibileDaMascheraDashboardSLA(e) {
    this.slaVisible = false;
  }

  confermaDaSla(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (e) {
      const ee = this.converteStringaInJSON(e);
      // this.scriveLog('nuovo valore SLA', ee);
      // this.slaValueToPass = ee;
      this.slaValue = ee.ID;
      this.datiModificati.slaValue2M = ee.ID;
      this.slaEmit.emit(ee);
      this.checkSeCiSonoModifiche();

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);
    }
  }

  refreshSLA(e) {
    if (!this.permetteEmit) {
      return;
    }

    // this.scriveLog('Refresh sla in settings');
    // if (e) {
      this.refreshSlaboolean = !this.refreshSlaboolean;
      this.refreshSLAEmit.emit(this.refreshSlaboolean);
    // }
  }

  ritornoValoreDaComboSLA(e) {
    // if (e) {
      // this.scriveLog('Ritorno valore da combo SLA:', e);
      const tm = setTimeout(() => {
        clearTimeout(tm);
        // this.slaValueToPass = e;
        this.datiOriginali.SLA = e;
      });
    // }
  }

  ritornoValoreDaComboAntenne(e) {
    // if (e) {
      // this.scriveLog('Ritorno valore da combo Antenne:', e);
      const tm = setTimeout(() => {
          clearTimeout(tm);
        // this.slaValueToPass = e;
        this.datiOriginali.isCheckedAntenne = e;
      });
    // }
  }

  apreSla() {
    let sl;

    this.datiSlaDT.forEach(element => {
      if (element.ID === this.datiModificati.slaValue2M) {
        sl = element;
      }
    });

    // this.scriveLog('Passaggio SLA:', sl);
    this.slaValueToPass2 = sl;
    this.slaVisible = true;
  }

  clickSuRigaMettere(e) {
    if (e) {
      // this.scriveLog(e);
      this.infoKeyVisibileMettere = true;
    }
  }

  clickSuRigaTogliere(e) {
    if (e) {
      this.infoKeyVisibileTogliere = true;
    }
  }

  newKeyPremutoTogliere(e) {
    this.LeggeEventi();
    this.EventiDaMettereVisibile = true;
  }

  delKeyPremutoTogliere(e) {
    this.toglieEventi();
  }

  confirmKeyPremutoMettere(e) {
    this.metteEventi();
    this.EventiDaMettereVisibile = false;
    // this.scriveLog('Passaggio dati 3:', e)
  }

  checkEdge(event) {
    this.Utils.edge = event;
    // this.scriveLog('edge:', event);
  }

  radioClick(t) {
    if (!this.permetteEmit) {
      return;
    }

    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
      this.datiModificati.viewGlobalM = t;
      // this.scriveLog(this.datiModificati.viewGlobalM);
      this.overviewZoomEmit.emit(this.datiModificati.viewGlobalM);
      this.checkViewGlobal(this.datiModificati.viewGlobalM);
    // }, 100);
  }

  viewAsClick(v) {
    if (!this.permetteEmit) {
      return;
    }

    // const tm = setTimeout(() => {
    //   clearTimeout(tm);

      // this.scriveLog(this.datiModificati.viewAsM);
      this.datiModificati.viewAsM = v;
      this.viewAsEmit.emit(this.datiModificati.viewAsM);
      this.checkSeCiSonoModifiche();
    // }, 100);
  }

  selectOverlayMisura(e) {
    if (!this.permetteEmit) {
      return;
    }

    logConsole('Misura overlay cambiata: ', e);
    const tm = setTimeout(() => {
      clearTimeout(tm);
      
      if (e && e !== 'empty') {
        const ee = this.converteStringaInJSON(e);
        // const ee = this.Utils.ritornaRigaTotaleDaDescrizioneCombo(e, this.measureDataCompleti, 'DISPLAY_NAME');

        let contr;
        if (ee.CODE) {
          contr = ee.CODE;
        } else {
          contr = ee;
        }

        // logConsole('Overlay inserito', ee);

        let ok = false;
        let maxId = 0;
        if (!this.measureDataCompleti2) {
          this.measureDataCompleti2 = new Array();
        }
        // logConsole('Mdc:', this.measureDataCompleti2, this.measureDataO);
        this.measureDataCompleti2.forEach(element => {
          if (!ok && contr === element.CODE) {
            ok = true;
          }
          if (element.ROW_ID > maxId) {
            maxId = element.ROW_ID;
          }
        });
        if (!ok) {
          // logConsole('Misura mancante overlay', this.datiModificati.overlayM);
          const nuovaMisura = {
            CODE: contr,
            DESCRIPTION: contr,
            DISPLAY_NAME: contr,
            FILE_TYPE: "Overlay",
            FOLDER: "New Measure",
            INSERT_TIMESTAMP: "",
            MEASR_CODE: contr,
            NET_TECH: "",
            ROW_ID: maxId + 1,
            TYPE: "2",
            TYPE_STR: "list",
            UPDATE_TIMESTAMP: ""
          }
          if (!this.measureDataCompleti2) {
            this.measureDataCompleti2 = new Array();
          }
          this.measureDataCompleti2.push(nuovaMisura);
        }
  
        const m = JSON.parse(JSON.stringify(this.measureDataCompleti2));
        this.measureDataCompleti2 = undefined;
        setTimeout(() => {
          this.measureDataCompleti2 = JSON.parse(JSON.stringify(m));

          // logConsole('Contr', contr);
          /* if (contr === 'global_measure') {
            contr = '<GLOBAL MEASURE>';
          } */
          // this.datiModificati.overlayM = contr;

          // this.scriveLog(this.datiModificati.overlayM);
          this.datiModificati.overlayM = contr;
          this.overlayEmit.emit(this.datiModificati.overlayM);
        }, 100);
      } else {
        this.datiModificati.overlayM = 0;
        this.overlayEmit.emit(this.datiModificati.overlayM);
      }

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  selectOverlayClusterMisura(e) {
    if (!this.permetteEmit) {
      return;
    }

    // this.scriveLog('Misura overlay cambiata: ', n, e, this.measureDataCompleti);
    const tm = setTimeout(() => {
      clearTimeout(tm);
      
      if (e && e !== 'empty') {
        const ee = this.converteStringaInJSON(e);
        // const ee = this.Utils.ritornaRigaTotaleDaDescrizioneCombo(e, this.measureDataCompleti, 'DISPLAY_NAME');

        let contr;
        if (ee.CODE) {
          contr = ee.CODE;
        } else {
          contr = ee;
        }

        // logConsole('Overlay inserito', ee);

        let ok = false;
        let maxId = 0;
        if (!this.measureDataCompleti2) {
          this.measureDataCompleti2 = new Array();
        }
        this.measureDataCompleti2.forEach(element => {
          if (!ok && contr === element.CODE) {
            ok = true;
          }
          if (element.ROW_ID > maxId) {
            maxId = element.ROW_ID;
          }
        });
        if (!ok) {
          logConsole('Misura mancante overlay', this.datiModificati.overlayClusterM);
          const nuovaMisura = {
            CODE: contr,
            DESCRIPTION: contr,
            DISPLAY_NAME: contr,
            FILE_TYPE: "Overlay",
            FOLDER: "New Measure",
            INSERT_TIMESTAMP: "",
            MEASR_CODE: contr,
            NET_TECH: "",
            ROW_ID: maxId + 1,
            TYPE: "2",
            TYPE_STR: "list",
            UPDATE_TIMESTAMP: ""
          }
          if (!this.measureDataCompleti2) {
            this.measureDataCompleti2 = new Array();
          }
          this.measureDataCompleti2.push(nuovaMisura);
        }
  
        const m = JSON.parse(JSON.stringify(this.measureDataCompleti2));
        this.measureDataCompleti2 = undefined;
        setTimeout(() => {
          this.measureDataCompleti2 = JSON.parse(JSON.stringify(m));

          /* logConsole(contr);
          if (contr === 'global_measure') {
            contr = '<GLOBAL MEASURE>';
          } */
          this.datiModificati.overlayClusterM = contr;

          // this.scriveLog(this.datiModificati.overlayM);
          this.overlayEmit.emit(this.datiModificati.overlayClusterM);
        }, 100);
      } else {
        this.datiModificati.overlayClusterM = '';
        this.overlayEmit.emit(this.datiModificati.overlayClusterM);
      }

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  selectOverlayCluster(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (this.Debug === true) {
      this.scriveLog('Misura overlay cluster cambiata: ', this.NumeroFrame, e, this.measureDataCompleti2);
    }
    const tm = setTimeout(() => {
      clearTimeout(tm);
      
      if (e && e !== 'empty') {
        const ee = this.converteStringaInJSON(e);
        // const ee = this.Utils.ritornaRigaTotaleDaDescrizioneCombo(e, this.measureDataCompleti, 'DISPLAY_NAME');

        this.datiModificati.overlayClusterM = ee.CODE;
        // this.scriveLog(this.datiModificati.overlayClusterM);
        this.overlayClusterEmit.emit(this.datiModificati.overlayClusterM);
      } else {
        this.datiModificati.overlayClusterM = '';
        this.overlayClusterEmit.emit(this.datiModificati.overlayClusterM);
      }

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  timeFilterClick(e) {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);
      
      // this.scriveLog('FATTO CLICK SU OPTION:', e);

      this.datiModificati.timeFilterM = e;
      this.timeFilterEmit.emit(this.datiModificati.timeFilterM);

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  bboxOZClick(e) {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
          clearTimeout(tm);
      if (this.Debug === true) {
        this.scriveLog('FATTO CLICK SU BBOXOZ:', e);
      }

      this.datiModificati.bboxOverViewZoomM = e;
      this.bboxOverViewZoomEmit.emit(this.datiModificati.bboxOverViewZoomM);

      this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame);

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  dataSetClick(e) {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (this.Debug === true) {
        this.scriveLog('FATTO CLICK SU TIPODATASET:', e);
      }

      this.datiModificati.tipoDatasetM = e;
      this.tipoDatasetEmit.emit(this.datiModificati.tipoDatasetM);

      /* this.ultimoRidisegnaFrame = !this.ultimoRidisegnaFrame;
      this.ridisegnaFrame.emit(this.ultimoRidisegnaFrame); */

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  cambiataView() {
    // this.viewDefinition.emit(this.datiPivot.viewDefinition);
    this.checkSeCiSonoModifiche();
  }

  checkDesignInfo(e) {
    if (!this.permetteEmit) {
      return;
    }

    // this.scriveLog(e.target.checked);
    this.datiModificati.designInfoM = e.target.checked;
    this.designInfoEmit.emit(this.datiModificati.designInfoM);
    this.checkSeCiSonoModifiche();
  }

  selectHistDisplayAs(i, e) {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // this.scriveLog(this.datiModificati.histDisplayAsM);
      if (e === undefined) {
        this.datiModificati.histDisplayAsM[i] = '';
      } else {
        this.datiModificati.histDisplayAsM[i] = e.id;
      }
      logConsole('Hist display as', this.datiModificati.histDisplayAsM, i, e.id);
      
      // this.scriveLog(this.datiModificati.histDisplayAsM);
      this.histDisplayAsEmit.emit(this.datiModificati.histDisplayAsM);
      this.checkSeCiSonoModifiche();
    }, 100);
  }

  selectHistDisplayTutto(i, e) {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // this.scriveLog('Selezionato histdisplaytutto', e, this.datiModificati.HistDisplayTuttoM, i);
      if (e === undefined) {
        this.datiModificati.HistDisplayTuttoM[i] = '';
      } else {
        this.datiModificati.HistDisplayTuttoM[i] = e.id;
      }
      // this.scriveLog(this.datiModificati.histDisplayAsM);
      this.histDisplayTuttoEmit.emit(this.datiModificati.HistDisplayTuttoM);
      this.checkSeCiSonoModifiche();
    }, 100);
  }

  ColumnsBarsClick(e) {
    if (!this.permetteEmit) {
      return;
    }

    this.datiModificati.columnsBarsM = e;
    this.columnsBarsEmit.emit(e);
    this.checkSeCiSonoModifiche();
  }

  EventsMeasureClick(e) {
    if (!this.permetteEmit) {
      return;
    }

    this.datiModificati.eventsMeasureM = e;
    this.eventsMeasureEmit.emit(e);
    this.checkSeCiSonoModifiche();
  }

  /* fineDragDrop(e) {
    // this.scriveLog('fine drag drop', e);
    this.datiModificati.columnsSettingsM = ['', '', '', '', '', '', '', '', '', ''];
    let riga = 0;
    e.forEach(element => {
      if (e !== '') {
        this.datiModificati.columnsSettingsM[riga] = element.Field;

        riga++;
      }
    });
    this.checkSeCiSonoModifiche();
    this.creaStrutturaColumnSettings();
    this.columnsSettingsEmit.emit(this.datiModificati.columnSettingsM);
    // this.scriveLog(this.datiModificati.columnsSettingsM);
  }

  creaStrutturaColumnSettings() {
    if (!this.datiModificati.columnsSettingsM) {
      this.grigliaColumnSettings = undefined;
      return;
    }

    const proprieta = [{
      GridName: 'Columns Settings',
      IsFilterDisplayed: 'N',
      ItemsPerPage: '10',
      ShowColumnSelector: true,
      pageable: 'false',
      reportType: 'Rep',
    }];
    let col = '[{';
    col += '"IsEmpty": "false",';
    col += '"dataType": "string",';
    col += '"headerText": "ROW_ID",';
    col += '"hide": "true",';
    col += '"key": "ROW_ID",';
    col += '"locked": "true",';
    col += '"place": "1"';
    col += '},';
    col += '{'
    col += '"IsEmpty": "false",';
    col += '"dataType": "string",';
    col += '"headerText": "Field",';
    col += '"key": "Field",';
    col += '"locked": "true",';
    col += '"place": "1"';
    col += '}]';
    let c = 0;
    let p = '[';
    this.datiModificati.columnsSettingsM.forEach(element => {
      if (element !== '') {
        p += '{"ROW_ID": ' + c + ', "Field": "' + element + '"}, ';
        c++;
      }
    });
    // this.scriveLog(this.datiModificati.columnsSettingsM);
    if (p !== '[') {
      p = p.substring(0, p.length - 2) + ']';
      // this.scriveLog(p);
      const dati = JSON.parse(p);
      const strutt = {
        ColumnProperty: JSON.parse(col),
        DataTable: dati,
        GridProperty: proprieta
      };
      // this.scriveLog('Struttura columns', strutt);
      const tm = setTimeout(() => {
          clearTimeout(tm);
        this.grigliaColumnSettings = strutt;
        this.effettuaAutoFitColumn = !this.effettuaAutoFitColumn;
      }, 100);
    } else {
      // this.scriveLog(this.datiModificati.columnsSettingsM);
      // this.scriveLog('Puliza griglia column settings')
      this.grigliaColumnSettings = undefined;
    }
  }

  eliminaCampo(e) {
    // this.scriveLog(e[0].Field, this.datiModificati.columnsSettingsM);
    const app = new Array();
    this.datiModificati.columnsSettingsM.forEach(element => {
      // this.scriveLog(element);
      if (element !== e[0].Field) {
        app.push(element);
      }
    });
    this.datiModificati.columnsSettingsM = JSON.parse(JSON.stringify(app));
    // this.scriveLog(e[0].Field, this.datiModificati.columnsSettingsM);
    this.checkSeCiSonoModifiche();
    this.creaStrutturaColumnSettings();
    this.columnsSettingsEmit.emit(this.datiModificati.columnSettingsM);
  } */

  selectTipoEvents(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (e) {
      this.datiModificati.tipoEventoM = e.id;
      if (e.id === 'A') {
        this.datiModificati.datiEventiDaPassareM = 'empty grid';
      }
      if (e.id === 'L') {
        if (this.datiModificati.datiEventiDaPassareM.DataTable === 'empty grid') {
          this.datiModificati.datiEventiDaPassareM = 'empty grid';
        }
        // // logConsole('Lista Eventi: ', this.datiModificati.datiEventiDaPassareM);
      }
      if (this.Debug === true) {
        this.scriveLog('Tipo evento', e, e.id, this.datiModificati.tipoEventoM);
      }
      this.tipoEventoEmit.emit(this.datiModificati.tipoEventoM);
      this.checkSeCiSonoModifiche();
    }
  }

  changeStyleSize(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (e) {
      if (e.id) {
        this.datiModificati.styleImpostatoM = e.id;
        // this.scriveLog(e, e.id);
      } else {
        if (e.indexOf('***') > - 1) {
          const num = e.replace('***', '');
          if (this.isNumeric(num)) {
            // this.datiModificati.styleImpostatoM = +num;
            this.aggiungeCampoStyleSize(num);
          }
        } else {
          return;
        }
      }
      this.styleImpostatoEmit.emit(this.datiModificati.styleImpostatoM);
      this.checkSeCiSonoModifiche();
    }
  }

  changeCellType(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (e) {
      // this.scriveLog(e);
      this.datiModificati.cellTypeM = '';
      this.selezioneCellType = '';
      let ee = '[';
      let eee = '';
      e.dati.forEach(element => {
        ee += '{"ROW_ID": ' + element.ROW_ID + ', "VALUE_STR": "' + element.VALUE_STR + '"},';
        eee += element.ROW_ID + ',';
      });
      if (ee.length > 2) {
        ee = ee.substring(0, ee.length - 1) + ']';
        eee = eee.substring(0, eee.length - 1);

        this.selezioneCellType = eee;
        this.datiModificati.cellTypeM = ee;

        if (this.Debug === true) {
          this.scriveLog('Impostazione CELL TYPE', eee, JSON.parse(ee));
        }

        this.cellTypeEmit.emit(this.datiModificati.cellTypeM);
        this.checkSeCiSonoModifiche();

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.lookupMR = !this.lookupMR;
        }, 1000);
      }
    }
  }

  changeAddLayers(e) {
    if (!this.permetteEmit) {
      return;
    }

    if (e) {
      // this.scriveLog(e);
      this.datiModificati.addLayersM = '';
      // this.selezioneAddLayers = '';
      let ee = '[';
      let eee = new Array();
      e.dati.forEach(element => {
        ee += '{"ROW_ID": ' + element.ROW_ID + ', "VALUE_STR": "' + element.VALUE_STR + '", "CODE_STR": "' + element.CODE_STR + '"},';
        eee.push(element.ROW_ID); //  += element.ROW_ID + ',';
      });
      if (ee.length > 2) {
        ee = ee.substring(0, ee.length - 1) + ']';
        // eee = eee.substring(0, eee.length - 1);

        this.selezioneAddLayers = eee;
        this.datiModificati.addLayersM = ee;
        if (this.Debug === true) {
          this.scriveLog('Add layers emit', eee, JSON.parse(ee));
        }
        this.addLayersEmit.emit(this.datiModificati.addLayersM);
      } else {
        this.selezioneAddLayers = [];
        this.datiModificati.addLayersM = '';
        this.addLayersEmit.emit(this.datiModificati.addLayersM);
      }
      this.checkSeCiSonoModifiche();

      const tm = setTimeout(() => {
        clearTimeout(tm);

        this.effettuaAutoFitAL = !this.effettuaAutoFitAL;
      }, 1000);
    }
  }

  aggiungeCampoStyleSize(num) {
    let ok = false;
    if (this.styleSizes) {
      this.styleSizes.forEach(element => {
        if (+element.id === +num) {
          ok = true;
        }
      });
      if (ok === false) {
        const app = JSON.parse(JSON.stringify(this.styleSizes));
        const aa = { id: num, name: num };
        app.push(aa);
        app.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));
        this.styleSizes = JSON.parse(JSON.stringify(app));
        
        const t = setTimeout(() => {
          clearTimeout(t);

          this.datiModificati.styleImpostatoM = +num;
        }, 100);
      }
    }
  }

  selectFixedSeconds(e) {
    if (!this.permetteEmit) {
      return;
    }

    // this.scriveLog('Fixed seconds impostati', e);
    if (e && e.name !== undefined) {
      this.datiModificati.fixedSecondsM = e.id;
      this.fixedSecondsEmit.emit(this.datiModificati.fixedSecondsM);
      this.checkSeCiSonoModifiche();
    } else {
      if (e) {
        const v = e.replace('***', '');
        // this.scriveLog(v);
        if (this.isNumeric(v)) {
          let ok = false;
          this.scriveLog(this.fixedSecondsData, v);
          this.fixedSecondsData.forEach(element => {
            if (+element.name === +v) {
              this.datiModificati.fixedSecondsM = e.id;
              this.fixedSecondsEmit.emit(this.datiModificati.fixedSecondsM);
              this.checkSeCiSonoModifiche();
              ok = true;
            }
          });
          if (ok === false) {
            /* let maxN = 0;
            this.fixedSecondsData.forEach(element => {
              if (element.id > maxN) {
                maxN = element.id;
              }
            });
            maxN++; */
            const vv = { id: v, name: v };
            this.fixedSecondsData.push(vv);
            this.fixedSecondsData.sort((a, b) => (this.pad(a.name, 10)).localeCompare(this.pad(b.name, 10)));
            const tm = setTimeout(() => {
              clearTimeout(tm);

              this.datiModificati.fixedSecondsM = vv.id;
              this.fixedSecondsEmit.emit(this.datiModificati.fixedSecondsM);
              this.checkSeCiSonoModifiche();
            }, 100);
          }
        } else {
          this.messaggioDiErrore(this, v + ': Is not a valid value');
        }
      }
    }
  }

  pad(num, size) {
    let s = num + '';
    while (s.length < size) { s = '0' + s };
    // this.scriveLog(s);
    return s;
  }

  clickSuRigaDM(e) {
    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, e);
    this.misSel = e;
    this.misuraSelezionata = undefined;
    if (!e[0]) {
      if (e.dataItem) {
        // this.misuraSelezionata = e.dataItem.CODE;
        if (+e.dataItem.TYPE === 1) {
          this.sla = true
        } else {
          this.sla = false
        }
        this.measureDD = e.dataItem.DESCRIPTION;
        this.rigaSelezionataDM = e.dataItem;
        this.idRigaSelezionataDM = [e.dataItem.ROW_ID];
      } else {
        // this.scriveLog(e);
      }
    } else {
      // this.scriveLog(e[0].CODE);
      // this.misuraSelezionata = e[0].CODE;
      if (+e[0].TYPE === 1) {
        this.sla = true
      } else {
        this.sla = false
      }
      this.measureDD = e[0].DESCRIPTION;
      this.rigaSelezionataDM = e[0];
      this.idRigaSelezionataDM = [e[0].ROW_ID];
    }

    // this.scriveLog('Click DM: ', this.rigaSelezionataDM, this.measureDD, this.misuraSelezionata, this.idRigaSelezionataDM);

    if (this.datiModificati.modificaChartM === false) {
      this.checkSla();
    }
  }

  cambioMisura(e) {
    if (this.staEliminandoMisura) {
      return;
    }
    
    // logConsole('Misura selezionara', typeof(e), e);

    if (typeof(e) === 'string' && e.indexOf('***') > -1) {
      const ee = e.replace('***', '');

      let i = 0;
      let ok = false;
      this.measureDataCompleti2.forEach(element => {
        if (+element.ROW_ID > +i) {
          i = +element.ROW_ID;
        }
        if (element.CODE === ee) {
          ok = true;
        }
      });

      if (!ok) {
        const app = JSON.parse(JSON.stringify(this.measureDataCompleti2));
        const m = {
          CODE: ee,
          DESCRIPTION: "New Measure",
          DISPLAY_NAME: ee,
          FILE_TYPE: "New Measure",
          FOLDER: "New Measure",
          INSERT_TIMESTAMP: "2019-09-23T00:00:00+00:00",
          MEASR_CODE: ee,
          NET_TECH: "",
          ROW_ID: i + 1,
          TYPE: "2",
          TYPE_STR: "list",
          UPDATE_TIMESTAMP: "2024-04-10T01:00:00+00:00"
        }
        app.push(m);
        this.measureDataCompleti2 = JSON.parse(JSON.stringify(app));
      }
      
      const tm = setTimeout(() => {
        clearTimeout(tm);

        this.misuraSelezionata = ee;
        
        // logConsole('Nuova misura', this.misuraSelezionata);
      }, 100);
    }

    if (this.Debug === true) {
      this.scriveLog('Cambio misura', e, this.measureDataCompleti2);
    }
    if (!e || e === null || e === 'empty' || e === 'undefined') {
      return;
    }

    this.rigaSelezionataDM = undefined;
    this.misuraSelezionata = e.CODE;
    this.measureDataCompleti2.forEach(element => {
      if (element.CODE === e.CODE) {
        if (+element.TYPE === 1) {
          this.sla = true
        } else {
          this.sla = false
        }
        this.measureDD = element.DESCRIPTION;
      }
    });
  }

  pulisceMisura() {
    this.rigaSelezionataDM = undefined;
    this.misuraSelezionata = '';
    this.sla = false;
  }

  modificaMisura() {
    if (!this.permetteEmit) {
      return;
    }

    this.scriveLog(this.misuraSelezionata);
    this.scriveLog(this.rigaSelezionataDM);
    this.scriveLog(this.datiModificati.measureM);
    const rigaModificata = this.misuraSelezionata;

    let q = 0;
    let fatto = false;
    this.datiModificati.measureM.forEach(element => {
      if (fatto === false && element === this.rigaSelezionataDM.CODE) {
        fatto = true;
        // logConsole('Imposto measureM 3', this.misuraSelezionata.CODE);
        this.datiModificati.measureM[q] = this.misuraSelezionata.CODE;
        // this.scriveLog(this.datiModificati.measureM);
        if (this.datiModificati.modificaChartM === false) {
          // this.scriveLog('Emit misure 5');

          // // logConsole('Misure emit 7', this.datiModificati.measureM);
          // logConsole('Misure emit 10', this.datiModificati.measureM);
          this.measureEmit.emit(this.datiModificati.measureM);
        }
        this.creaStrutturaMisure(false);
        /* const app = JSON.parse(JSON.stringify(this.datiMeasures));
        this.datiMeasures = undefined;
        this.checkSeCiSonoModifiche();
        // this.scriveLog(this.datiMeasures);
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.datiMeasures.DataTable = JSON.parse(JSON.stringify(app.DataTable));
          this.pulisceMisura();
        }, 1000); */
        this.checkSeCiSonoModifiche();

        this.cambioMisura(this.rigaSelezionataDM);
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.misuraSelezionata = rigaModificata.CODE;
          this.rigaSelezionataDM = rigaModificata;
        }, 1000);
      }
      q++;
    });

    /*
    // this.scriveLog(this.rigaSelezionataDM);
    if (this.rigaSelezionataDM) {
      // const appo = JSON.parse(JSON.stringify(this.rigaSelezionataDM));
      let appo;
      let q = 0;
      this.datiModificati.measureM.forEach(element => {
        if (this.rigaSelezionataDM) {
          // this.scriveLog(element, this.rigaSelezionataDM);
          if (element === this.rigaSelezionataDM.CODE) {
            this.datiModificati.measureM[q] = this.misuraSelezionata.CODE;
            this.measureDataCompleti.forEach(element2 => {
              if (element2.CODE === this.misuraSelezionata.CODE) {
                appo = element2;
              }
            });
            // this.rigaSelezionataDM = undefined;
            // this.datiModificati.measureM.push(this.misuraSelezionata.CODE);
            // this.misuraSelezionata = undefined;
            // this.scriveLog(this.datiModificati.measureM);
            if (this.datiModificati.modificaChartM === false) {
              // this.scriveLog('Emit misure 5');
              this.measureEmit.emit(this.datiModificati.measureM);
            }
            this.creaStrutturaMisure();
            const app = JSON.parse(JSON.stringify(this.datiMeasures));
            this.datiMeasures = undefined;
            // this.scriveLog(this.datiMeasures);
            this.checkSeCiSonoModifiche();
            const tm = setTimeout(() => {
          clearTimeout(tm);
              this.datiMeasures.DataTable = JSON.parse(JSON.stringify(app.DataTable));
              this.pulisceMisura();
            }, 1000);
          }
        }
        q++;
      });
      this.rigaSelezionataDM = JSON.parse(JSON.stringify(appo));
      this.scriveLog(this.rigaSelezionataDM);
    } */
  }

  visualizzaAlert(messaggio) {
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

  staEliminandoMisura = false;

  delKeyPremutoDM() {
    if (!this.permetteEmit) {
      return;
    }

    if (this.staEliminandoMisura) {
      return;
    }

    if (!this.rigaSelezionataDM) {
      this.visualizzaAlert('Select a row');
      return;
    }
    if (this.Debug === true) {
      this.scriveLog('Pressione del su misura', this.misSel, this.datiModificati.measureM);
    }
    if (this.misSel) {
      const e = this.misSel;
      const idRow = e[0].ROW_ID;
      let id = 0;
      let idRiga = -1;
      if (this.datiMeasures && this.datiMeasures.DataTable) {
        this.datiMeasures.DataTable.forEach(element => {
          // logConsole('Confronto', element.ROW_ID, idRow);
          if (idRiga === -1 && +element.ROW_ID === +idRow) {
            idRiga = id;
          }
          id++;
        });
        // logConsole('idRiga da eliminare', idRiga);
      }
      const daEliminare = e[0].CODE;
      const d = new Array();
      this.datiModificati.measureM.forEach(element => {
        if (element !== daEliminare) {
          d.push(element);
        }
      });
      this.misSel = undefined;
      // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 1', d);
      this.datiModificati.measureM = d;
      // logConsole('Impostazione misure 5', this.datiModificati.measureM);
      if (this.datiModificati.modificaChartM === false || this.datiModificati.mappaOGraficoM === 'PM') {
        // this.scriveLog('Emit misure 6');
        // // logConsole('Misure emit 8', this.datiModificati.measureM);
        // logConsole('Misure emit 11', this.datiModificati.measureM);
        this.measureEmit.emit(this.datiModificati.measureM);
      }
      this.misuraSelezionata = undefined;
      // this.rigaSelezionataDM = undefined;
      this.staEliminandoMisura = true;
  
      this.creaStrutturaMisure(false);
      this.checkSeCiSonoModifiche();

      const tt = setTimeout(() => {
        clearTimeout(tt);

        if (this.datiMeasures.DataTable[idRiga]) {
          const riga = this.datiMeasures.DataTable[idRiga];
          // logConsole('Riseleziono riga 1', idRiga, riga);
          const rowId = riga.ROW_ID;
          this.idRigaSelezionataDM = [rowId];
          this.rigaSelezionataDM = riga;
          logConsole('Riseleziono riga 2', this.rigaSelezionataDM);
          this.misuraSelezionata = riga.CODE;
          this.misSel = [riga];

          const tt2 = setTimeout(() => {
            clearTimeout(tt2);
    
            this.staEliminandoMisura = false;
          }, 500);
        }
      }, 100);
    }
  }

  refreshGridPM(e) {

  }

  dragDropMisure(e) {
    if (!this.permetteEmit) {
      return;
    }

    // this.scriveLog('Drag drop misure', this.datiModificati.measureM);

    this.scriveLog(e);
    const m = new Array();
    m.push('');
    e.data.forEach(element => {
      // this.scriveLog(element);
      m.push(element.CODE);
    });
    // m.push(e.CODE);
    // this.scriveLog(m);
    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 2', m);
    this.datiModificati.measureM = JSON.parse(JSON.stringify(m));
    // logConsole('Impostazione misure 6', this.datiModificati.measureM);
    this.misuraSelezionata = '';
    this.rigaSelezionataDM = undefined;
    this.creaStrutturaMisure(false);
    if (this.datiModificati.modificaChartM === false || this.datiModificati.mappaOGraficoM === 'PM') {
      // this.scriveLog('Emit misure 7');
      // // logConsole('Misure emit 9', this.datiModificati.measureM);
      // logConsole('Misure emit 12', this.datiModificati.measureM);
      this.measureEmit.emit(this.datiModificati.measureM);
    }
    // this.scriveLog(this.datiModificati.measureM);
  
    this.checkSeCiSonoModifiche();
  }

  spostaSu() {
    if (!this.permetteEmit) {
      return;
    }

    if (!this.rigaSelezionataDM) {
      return;
    }
    // this.scriveLog(this.datiModificati.measureM);
    // this.scriveLog(this.rigaSelezionataDM);
    // this.scriveLog(this.idRigaSelezionataDM);

    let primo;
    let primoIdx = 0;
    let secondo;
    let i = 0;
    // let prende = false;
    this.datiModificati.measureM.forEach(element => {
      if (!primo && element === this.rigaSelezionataDM.CODE) {
        primo = element;
        secondo = this.datiModificati.measureM[i - 1];
        primoIdx = i;
      }
      i++;
      /* if (primo != null && element !== this.rigaSelezionataDM.CODE && prende === true) {
        secondo = element;
        prende = false;
      }
      if (primo === null && element === this.rigaSelezionataDM.CODE) {
        primo = element;
        prende = true;
      } */
    });
    // logConsole('Sposto ', primo ,secondo);
    // this.scriveLog(primo);
    // this.scriveLog(secondo);
    if (secondo === undefined) {
      this.caricamentoMisureInCorso = false;
      return;
    }

    // logConsole('Imposto measureM 4', primoIdx, primo, secondo);
    this.datiModificati.measureM[primoIdx] = secondo;
    this.datiModificati.measureM[primoIdx - 1] = primo;

    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 4', this.datiModificati.measureM);
    this.datiModificati.measureM = JSON.parse(JSON.stringify(this.datiModificati.measureM));
    // logConsole('Impostazione misure 7', this.datiModificati.measureM);
    // this.idRigaSelezionataDM--;

    // this.scriveLog(this.datiModificati.measureM);

    this.creaStrutturaMisure(false);

    const t = setTimeout(() => {
      /* this.datiMeasures.DataTable.forEach(element => {
        if (element.CODE === secondo.CODE) { */
          this.rigaSelezionataDM = primo.ROW_ID;
          /*  }
      });  */
    }, 1000);

    if (this.datiModificati.modificaChartM === false || this.datiModificati.mappaOGraficoM === 'PM') {
      // this.scriveLog('Emit misure 8');
      // // logConsole('Misure emit 10', this.datiModificati.measureM);
      // logConsole('Misure emit 13', this.datiModificati.measureM);
      this.measureEmit.emit(this.datiModificati.measureM);
    }

    this.checkSeCiSonoModifiche();
    this.caricamentoMisureInCorso = false;
  }

  spostaPrimo() {
    if (!this.permetteEmit) {
      return;
    }

    if (!this.rigaSelezionataDM) {
      return;
    }
    /* this.datiModificati.measureM[this.idRigaSelezionataDM] = secondo;
    this.datiModificati.measureM[this.idRigaSelezionataDM + 1] = primo;
    this.datiModificati.measureM = JSON.parse(JSON.stringify(this.datiModificati.measureM)); */
    // this.scriveLog(this.datiModificati.measureM);

    this.caricamentoMisureInCorso = true;
    const mm = new Array();
    mm.push(this.rigaSelezionataDM.CODE);
    // let ok = false;
    let i = 0;
    this.datiModificati.measureM.forEach(element => {
      // if (ok === true) {
        if (this.datiModificati.measureM[i] !== this.rigaSelezionataDM.CODE) {
          mm.push(element);
        }
      // }
      // ok = true;
      i++;
    });

    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 5', mm);
    this.datiModificati.measureM = JSON.parse(JSON.stringify(mm));
    // logConsole('Impostazione misure 8', this.datiModificati.measureM);

    // this.scriveLog(this.datiModificati.measureM);

    this.rigaSelezionataDM = this.datiMeasures.DataTable[0];
    this.misSel = this.datiMeasures.DataTable[0];
    this.idRigaSelezionataDM = 0;

    this.creaStrutturaMisure(false);

    if (this.datiModificati.modificaChartM === false || this.datiModificati.mappaOGraficoM === 'PM') {
      // this.scriveLog('Emit misure 8');
      // // logConsole('Misure emit 11', this.datiModificati.measureM);
      // logConsole('Misure emit 14', this.datiModificati.measureM);
      this.measureEmit.emit(this.datiModificati.measureM);
    }

    this.checkSeCiSonoModifiche();
    this.caricamentoMisureInCorso = false;
  }

  spostaUltimo() {
    if (!this.permetteEmit) {
      return;
    }

    if (!this.rigaSelezionataDM) {
      return;
    }

    this.caricamentoMisureInCorso = true;
    const mm = new Array();
    for (let i = 0; i < this.datiModificati.measureM.length; i++) {
      if (this.datiModificati.measureM[i] !== this.rigaSelezionataDM.CODE) {
        mm.push(this.datiModificati.measureM[i]);
      }
    }
    mm.push(this.rigaSelezionataDM.CODE);

    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 6', mm);
    this.datiModificati.measureM = JSON.parse(JSON.stringify(mm));
    // logConsole('Impostazione misure 9', this.datiModificati.measureM);

    // this.scriveLog(this.datiModificati.measureM);

    this.rigaSelezionataDM = this.datiMeasures.DataTable[this.datiMeasures.DataTable.length - 1];
    this.misSel = this.datiMeasures.DataTable[this.datiMeasures.DataTable.length - 1];
    this.idRigaSelezionataDM = this.datiModificati.measureM.length - 1;

    this.creaStrutturaMisure(false);

    if (this.datiModificati.modificaChartM === false || this.datiModificati.mappaOGraficoM === 'PM') {
      // this.scriveLog('Emit misure 8');
      // // logConsole('Misure emit 12', this.datiModificati.measureM);
      // logConsole('Misure emit 15', this.datiModificati.measureM);
      this.measureEmit.emit(this.datiModificati.measureM);
    }

    this.checkSeCiSonoModifiche();
    this.caricamentoMisureInCorso = false;
  }

  spostaARiga() {
    if (!this.permetteEmit) {
      return;
    }

    if (+this.rigaDaSpostare === 1) {
      this.spostaPrimo();
      return;
    }

    if (+this.rigaDaSpostare === this.datiModificati.measureM.length) {
      this.spostaUltimo();
      return;
    }

    if (+this.rigaDaSpostare < 1 || +this.rigaDaSpostare > this.datiModificati.measureM.length) {
      this.visualizzaAlert('Range not valid (1 - ' + this.datiModificati.measureM.length + ')');
      this.rigaDaSpostare = '';
      return;
    }
    // this.scriveLog('Riga da spostare', this.rigaDaSpostare, this.datiModificati.measureM);

    if (!this.rigaSelezionataDM) {
      return;
    }

    this.caricamentoMisureInCorso = true;
    const n = new Array();
    let trovato = true;
    let q = 1;
    this.datiModificati.measureM.forEach(element => {
      // if (trovato === true) {
        if (this.rigaSelezionataDM.CODE !== element) {
          n.push(element);
          // this.scriveLog(element);
        }
      /* } else {
        n.push(element);
      } */
      if (q === +this.rigaDaSpostare) {
        trovato = false;
        n.push(this.rigaSelezionataDM.CODE);
        // this.scriveLog('TROVATA: ', this.rigaSelezionataDM.CODE);
      }
      q++;
    });

    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 7', n);
    this.datiModificati.measureM = JSON.parse(JSON.stringify(n));
    // logConsole('Impostazione misure 10', this.datiModificati.measureM);
    this.idRigaSelezionataDM = +this.rigaDaSpostare;

    // this.scriveLog(this.datiModificati.measureM);
    this.creaStrutturaMisure(false);

    this.rigaSelezionataDM = undefined;
    /* q = 0;
    this.datiMeasures.DataTable.forEach(element => {
      if (q === +this.rigaDaSpostare) {
        this.rigaSelezionataDM = element;
        this.misSel = element;
      }
      q++;
    }); */

    if (this.datiModificati.modificaChartM === false || this.datiModificati.mappaOGraficoM === 'PM') {
      // this.scriveLog('Emit misure 8');
      // // logConsole('Misure emit 13', this.datiModificati.measureM);
      // logConsole('Misure emit 16', this.datiModificati.measureM);
      this.measureEmit.emit(this.datiModificati.measureM);
    }
    this.rigaDaSpostare = '';

    this.checkSeCiSonoModifiche();
    this.caricamentoMisureInCorso = false;
  }

  spostaGiu() {
    /* this.scriveLog(this.datiModificati.measureM);
    this.scriveLog(this.rigaSelezionataDM);
    this.scriveLog(this.idRigaSelezionataDM); */

    if (!this.permetteEmit) {
      return;
    }

    if (!this.rigaSelezionataDM) {
      return;
    }

    this.caricamentoMisureInCorso = true;
    let primo;
    let primoIdx = 0;
    let secondo;
    let i = 0;
    // let prende = false;
    this.datiModificati.measureM.forEach(element => {
      if (!primo && element === this.rigaSelezionataDM.CODE) {
        primo = element;
        secondo = this.datiModificati.measureM[i + 1];
        primoIdx = i;
      }
      i++;
      /* if (primo != null && element !== this.rigaSelezionataDM.CODE && prende === true) {
        secondo = element;
        prende = false;
      }
      if (primo === null && element === this.rigaSelezionataDM.CODE) {
        primo = element;
        prende = true;
      } */
    });
    // logConsole('Sposto ', primo ,secondo);
    // this.scriveLog(primo);
    // this.scriveLog(secondo);
    if (secondo === undefined) {
      this.caricamentoMisureInCorso = false;
      return;
    }

    // logConsole('Imposto measureM 5', primoIdx, primo, secondo);
    this.datiModificati.measureM[primoIdx] = secondo;
    this.datiModificati.measureM[primoIdx + 1] = primo;

    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Riga selezionata', this.idRigaSelezionataDM[0], this.datiModificati.measureM[this.idRigaSelezionataDM[0]])
    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Riga selezionata dopo', this.idRigaSelezionataDM[0] + 1, this.datiModificati.measureM[this.idRigaSelezionataDM[0] + 1])
    /* if (this.idRigaSelezionataDM[0] !== undefined)  {
      this.datiModificati.measureM[this.idRigaSelezionataDM[0]] = secondo;
      this.datiModificati.measureM[this.idRigaSelezionataDM[0] + 1] = primo;

      this.idRigaSelezionataDM[0]++;
    } else {
      this.datiModificati.measureM[this.idRigaSelezionataDM] = secondo;
      this.datiModificati.measureM[this.idRigaSelezionataDM + 1] = primo;
      this.idRigaSelezionataDM++;
    } */
    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 8', this.datiModificati.measureM);
    this.datiModificati.measureM = JSON.parse(JSON.stringify(this.datiModificati.measureM));
    // logConsole('Impostazione misure', this.datiModificati.measureM);

    // this.scriveLog(this.datiModificati.measureM);

    this.creaStrutturaMisure(false);

    const t = setTimeout(() => {
      clearTimeout(t);

      /* this.datiMeasures.DataTable.forEach(element => {
        if (element.CODE === primo) { */
          this.rigaSelezionataDM = primo.ROW_ID;
          this.misSel = primo.ROW_ID;
      /*  }
      }); */
    }, 1000);

    if (this.datiModificati.modificaChartM === false || this.datiModificati.mappaOGraficoM === 'PM') {
      // this.scriveLog('Emit misure 8');
      // // logConsole('Misure emit 14', this.datiModificati.measureM);
      // logConsole('Misure emit 17', this.datiModificati.measureM);
      this.measureEmit.emit(this.datiModificati.measureM);
    }

    this.checkSeCiSonoModifiche();
    this.caricamentoMisureInCorso = false;
  }

  aggiungeMisura() {
    if (!this.permetteEmit) {
      return;
    }

    logConsole('Misura selezionata', this.misuraSelezionata);

    this.scriveLog('Misura selezionata: ', this.misuraSelezionata);
    this.caricamentoMisureInCorso = true;
    if (this.rigaSelezionataDM) {
      const m = new Array();
      this.datiModificati.measureM.forEach(element => {
        if (element !== this.rigaSelezionataDM.CODE) {
          m.push(element.CODE);
        } else {
          m.push(element.CODE);
          m.push(this.misuraSelezionata);
        }
      });
      // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 9', m);
      this.datiModificati.measureM = JSON.parse(JSON.stringify(m));
      // logConsole('Impostazione misure 12', this.datiModificati.measureM);
    } else {
      this.datiModificati.measureM.push(this.misuraSelezionata);
    }
    this.scriveLog('Aggiunge misura: ', this.misuraSelezionata, this.datiModificati.measureM);
    this.misuraSelezionata = undefined;

    if (this.datiModificati.modificaChartM === false || this.datiModificati.mappaOGraficoM === 'PM') {
      // this.scriveLog('Emit misure 8');
      // // logConsole('Misure emit 15', this.datiModificati.measureM);
      // logConsole('Misure emit 18', this.datiModificati.measureM);
      this.measureEmit.emit(this.datiModificati.measureM);
    }

    this.creaStrutturaMisure(false);
    this.checkSeCiSonoModifiche();
    this.caricamentoMisureInCorso = false;
  }

  PrendeNomeMisuraDaCodice(codice, misure) {
    let display_name = '';

    if (misure !== undefined && misure !== null && codice !== null && codice !== undefined) {
      // this.scriveLog(codice);
      misure.forEach(element2 => {
        // this.scriveLog(element2.CODE, codice);
        if (element2.CODE) {
          if (display_name === '' && element2) {
            if (this.isNumeric(codice)) {
              if (+element2.CODE === codice) {
                display_name = element2.DISPLAY_NAME;
              }
            } else {
              if (element2.CODE.toLowerCase().trim() === codice.toLowerCase().trim()) {
                display_name = element2.DISPLAY_NAME;
              }
            }
          }
        }
      });
    }

    return display_name;
  }

  creaStrutturaMisure(aggiornaDatiOriginali) {
    if (this.datiModificati.mappaOGraficoM === 'M' || this.datiModificati.mappaOGraficoM === 'AH'
    || this.datiModificati.mappaOGraficoM === 'PS' || this.datiModificati.mappaOGraficoM === 'PC') {
      return;
    }

    const t = setTimeout(() => {
      clearTimeout(t);

      let col = '';
      col += '[';
      col += '{'
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "Index",';
      col += '"key": "Index",';
      col += '"locked": "true",';
      col += '"hide": "false",';
      col += '"place": "1"';
      col += '},';
      col += '{'
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "ROW_ID",';
      col += '"key": "ROW_ID",';
      col += '"locked": "true",';
      col += '"hide": "true",';
      col += '"place": "2"';
      col += '},';
      /* col += '{'
      col += '"Icon": "icons",';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "",';
      col += '"key": "DragDrop",';
      col += '"locked": "true",';
      col += '"hide": "false",';
      col += '"place": "1",';
      col += '"showIconText": "false"';
      col += '},'; */
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "Measure",';
      col += '"hide": "true",';
      col += '"key": "Measure",';
      col += '"locked": "true",';
      col += '"place": "3"';
      col += '},';
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "CODE",';
      col += '"hide": "true",';
      col += '"key": "CODE",';
      col += '"locked": "true",';
      col += '"place": "4"';
      col += '},';
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "Display Name",';
      col += '"hide": "false",';
      col += '"key": "DISPLAY_NAME",';
      col += '"locked": "true",';
      col += '"place": "5"';
      col += '},';
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "Folder",';
      col += '"hide": "false",';
      col += '"key": "FOLDER",';
      col += '"locked": "true",';
      col += '"place": "6"';
      col += '},';
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "Net Tech",';
      col += '"hide": "false",';
      col += '"key": "NET_TECH",';
      col += '"locked": "true",';
      col += '"place": "7"';
      col += '},';
      col += '{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "Description",';
      col += '"hide": "false",';
      col += '"key": "DESCRIPTION",';
      col += '"locked": "true",';
      col += '"place": "8"';
      col += '}';
      col += ']';

      const proprieta = [{
        GridName: 'Measures',
        IsFilterDisplayed: 'N',
        ItemsPerPage: this.Utils.quanteMisureGrafici,
        ShowColumnSelector: 'true',
        pageable: false,
        reportType: 'Rep',
        rowCount: this.datiModificati.measureM.length
      }];
      let q = 0;
      const dati = new Array();
      dati.push('');
      const dati2 = new Array();
      dati2.push('');
      
      // logConsole('MISURE SETTINGS tutte ' + this.NumeroFrame, this.datiModificati.measureM);
      this.datiModificati.measureM.forEach(element => {
        // logConsole('MISURE SETTINGS ' + this.NumeroFrame, element);
        
        let ok = true;
        // if (this.datiModificati.mappaOGraficoM === 'MC') {
          if (!element || element === '') {
            ok = false;
          }
        // }
        if (ok) {
          // this.scriveLog(q + ': ', element, typeof(element));
          if (typeof(element) !== 'object') {
            const ee = this.PrendeNomeMisuraDaCodice(element, this.measureDataCompleti2);
            // logConsole('Conversione misura', element, ee);
            let tipo = '';
            let desc = '';
            let dispname = '';
            let folder = '';
            let nettech = '';
            if (this.measureDataCompleti2) {
              this.measureDataCompleti2.forEach(element2 => {
                if (tipo === '') {
                  if (element2.CODE === element) {
                    tipo = element2.TYPE;
                    desc = element2.DESCRIPTION;
                    dispname = element2.DISPLAY_NAME; // .replace('<', '').replace('>', '');
                    folder = element2.FOLDER;
                    nettech = element2.NET_TECH;
                  }
                }
              });
            }
            const e = { ROW_ID: q, Index: q + 1, Measure: ee, CODE: element, TYPE: tipo, DESCRIPTION: desc,
              DISPLAY_NAME: dispname, FOLDER: folder, NET_TECH: nettech, DragDrop: 'dragdrop' };
            // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Aggiungo riga alle misure: ', e);

            // // logConsole('MISURE SETTINGS ' + this.NumeroFrame, e);

            dati.push(e);
            dati2.push(element);
            q++;
          }
        }
      });

      // logConsole('Misure da gestire: ', this.datiModificati.measureM, this.measureDataCompleti, dati2);
      // logConsole('Crea struttura misure', dati2);
      // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'MISURE MODIFICATE 10', dati2);
      this.datiModificati.measureM = dati2;
      if (aggiornaDatiOriginali) {
        this.aggiornaDatiOriginali('CreaStrutturaMisure');
      }
      // logConsole('Impostazione misure 13', this.datiModificati.measureM);

      // logConsole('MISURE', this.datiModificati.measureM);
      // logConsole('MISURE 2', this.measureDataCompleti);

      if (dati.length > 0) {
        const dati2 = new Array();
        let ok = false;
        dati.forEach(element => {
          if (ok) {
            dati2.push(element);
          } else {
            ok = true;
          }
        });
        const strutt = {
          ColumnProperty: JSON.parse(col),
          DataTable: dati2,
          GridProperty: proprieta
        };
        // this.scriveLog(this.NumeroFrame, JSON.stringify(strutt));
        // this.refreshGrigliaDM = !this.refreshGrigliaDM;

        this.misuraSelezionata = '';
        this.rigaSelezionataDM = undefined;
        this.measureDD = undefined;
        this.sla = false;

        // logConsole('MISURE SETTINGS ' + this.NumeroFrame, strutt);

        /* if (this.datiMeasures && this.datiMeasures !== 'empty grid') {
          this.datiMeasures.DataTable = JSON.parse(JSON.stringify(dati));
          // this.scriveLog('datiMeasures: Aggiorno dati', this.datiMeasures);
        } else {
          // this.scriveLog('datiMeasures: Ricreo struttura', strutt);
          this.datiMeasures = strutt;

          this.refreshGrigliaDM = !this.refreshGrigliaDM;
        } */

        this.datiMeasures = undefined;
        const t1 = setTimeout(() => {
          clearTimeout(t1);

          this.datiMeasures = strutt;

          // logConsole('MISURE SETTINGS ', this.datiModificati.measureM);
          const t2 = setTimeout(() => {
            clearTimeout(t2);

            this.refreshGrigliaDM = !this.refreshGrigliaDM;
          }, 500);
        }, 100);

        this.numeroRigheMisure = dati.length;
      } else {
        this.datiMeasures = 'empty grid';
        this.numeroRigheMisure = 0;
      }
    }, 1000);
  }

  /* cambiaOpacity(e) {
    if (this.Debug === true) {
      this.scriveLog('Cambio opacità in settings', e);
    }
    this.datiModificati.opacityM = e;
    this.opacityEmit.emit(e);
    this.checkSeCiSonoModifiche();
    this.effettuaAutoFitAL = !this.effettuaAutoFitAL;
  } */

  checkShowAdditionalLayers() {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // logConsole('Cambio show al', this.datiModificati.showAdditionalLayersM);
      this.showAdditionalLayersEmit.emit(this.datiModificati.showAdditionalLayersM);

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  checkShowAxisX(e) {
    if (!this.permetteEmit) {
      return;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (this.Debug === true) {
        this.scriveLog('Cambio show axis x', this.datiModificati.showAxisXM)
      }
      this.showAxisXEmit.emit(this.datiModificati.showAxisXM);

      this.checkSeCiSonoModifiche();
    }, 100);
  }

  mostraPopupNuovo(messaggio) {
    if (!this.permetteEmit) {
      return;
    }

    Swal.fire({
      title: 'Confirm',
      html: messaggio,
      icon: 'warning',
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
        // alert('Chiudo lo stesso');
        this.undo();

        logConsole('Reimposto dati', this.datiModificati);
        // this.menuVisibile = false;
        const tm = setTimeout(() => {
          clearTimeout(tm);

          this.destroy$.next();
          this.destroy$.complete();  

          this.visibileEmit.emit('');

          const tt = setTimeout(() => {
            clearTimeout(tt);
            
            this.staChiudendo = false;
          }, 1500);
        }, 2000);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.staChiudendo = false;
      }
    });
  }

  /*
  mostraPopup(Messaggio, Dialog, Cosa) {
    const dialogRef = this._matDialog.open(ConfermaComponent, {
      data: {
        messaggio: Messaggio,
        mostraAnnulla: Dialog
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.scriveLog(Cosa, result);
      switch(result) {
        case 'OK':
          // ExternalFrameComponent.pulisceCalls(this.Frame2);
          this.undo();

          this.menuVisibile = false;
          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.visibileEmit.emit('');
          }, 2000);
          break;
      }
      // if (this.Debug === true) {
      // this.scriveLog('The dialog was closed', result);
      // }
      // this.animal = result;
    });
  }
  */

  scriveLog(Cosa, P1?, P2?, P3?, P4?, P5?) {
    if (this.Debug === true) {
      if (P1 && P2 && P3 && P4 && P5) {
        // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'FRAME SETTINGS: ' + Cosa, P1, P2, P3, P4, P5);
      } else {
        if (P1 && P2 && P3 && P4 && !P5) {
          // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'FRAME SETTINGS: ' + Cosa, P1, P2, P3, P4);
        } else {
          if (P1 && P2 && P3 && !P4 && !P5) {
            // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'FRAME SETTINGS: ' + Cosa, P1, P2, P3);
          } else {
            if (P1 && P2 && !P3 && !P4 && !P5) {
              // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'FRAME SETTINGS: ' + Cosa, P1, P2,);
            } else {
              if (P1 && !P2 && !P3 && !P4 && !P5) {
                // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'FRAME SETTINGS: ' + Cosa, P1);
              } else {
                // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'FRAME SETTINGS: ' + Cosa);
              }  
            }
          }
        }
      }
    }
  }

  refreshPointMeasures(r) {
    if (r === true) {
      this.datiPointMeasures = undefined;
    }
    this.vecchiaChiamataDPM = '';
    this.caricaPointMeasures();
  }

  vecchiaChiamataDPM = '';

  caricaPointMeasures() {
    // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, this.Utils);
    if (this.vecchiaChiamataDPM !== '') {
      // this.datiPointMeasures = this.datiPointMeasures;
      // this.titoloPointMeasures = this.titoloPointMeasures;
      return;
    }

    if (this.datiPointMeasures && typeof(this.datiPointMeasures) === 'string') {
      if (this.datiPointMeasures.indexOf('ERROR: ') > -1) {
        this.datiPointMeasures = undefined;
      }
    }
    
    this.staElaborandoPM = true;

    const params = {
      cntx_id: this.sessionID,
      v_filter_folder: 'TcRunEvent'
    };
    this.vecchiaChiamataDPM = JSON.stringify(params);

    this.apiService.chiamataPost(this.Utils, 'geo_measure_dfn__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      this.checkRitornoChiamata(this, this.Utils, data2);

      this.staElaborandoPM = false;
      if (data2 && data2 !== null) {
        this.titoloPointMeasures = data2.GridProperty[0].GridName;
        // this.titoloPointMeasures = this.titoloPointMeasures;
          this.datiPointMeasures = undefined;

          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.datiPointMeasures = data2;

            /* const selezionate = new Array();
            this.misureAddizionaliTCRUN.forEach(element => {
              let ok = false;
              this.datiPointMeasures.DataTable.forEach(element2 => {
                if (!ok && element2.MEASR_CODE === element) {
                  ok = true;
                  selezionate.push(element2.ROW_ID);
                }
              });
            });
            this.selezionePM = selezionate;
            logConsole('Misure addizionali', this.misureAddizionaliTCRUN, this.datiPointMeasures, this.selezionePM); */

            // this.datiPointMeasures = data2;            
            this.effettuaAutoFitPM = !this.effettuaAutoFitPM;

            // logConsole('Aggiorno dati originali PM');
            // this.aggiornaDatiOriginali('PointMeasures');
          }, 100);
      } else {
        this.datiPointMeasures = 'empty grid'; // null;
      }
    }, error => {
      this.staElaborandoPM = false;
      // this.messaggioDiErrore(t.datiPointMeasures, error);
      this.datiPointMeasures = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  clickSuComboMisura(e) {
    // logConsole('Click su combo misura', e, e.Tutte.length);
    // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Click su combo misura tcrun', e);

    // { Selezionato: this.numeroSelezionato[riga], Precedente: valorePrecedente, Misura: misura }
    // if (!this.misureAddizionaliTCRUN) {
      const misureAddizionaliTCRUN = ['', '', '', '', '', '', ''];
    // }
    /* if (e.Selezionato > 0) {
      let misura = '';
      this.measureDataCompleti.forEach(element => {
        if (misura === '' && element.DISPLAY_NAME === e.Misura) {
          misura = element.CODE;
        }
      });
      this.misureAddizionaliTCRUN[e.Selezionato] = misura;
    } else {
      this.misureAddizionaliTCRUN[e.Precedente] = '';
    } */

    const appoggioValoriComboMATCRUN = new Array();

    let ok = false;
    if (e.Tutte.length > 0) {
      e.Tutte.forEach(element => {
        const quale = element.VALORE;
        this.measureDataCompleti2.forEach(element2 => {
          if (!ok && element2.MEASR_CODE === element.MEASR_CODE) {
            misureAddizionaliTCRUN[quale] = element.MEASR_CODE;
            appoggioValoriComboMATCRUN.push(element);
            ok = false;
          }
        });
      });
    }

    this.misureAddizionaliTCRUN = JSON.parse(JSON.stringify(misureAddizionaliTCRUN));

    localStorage.setItem(this.userName + '_' + this.nomeGrigliaPM[this.NumeroFrame] + '_' + this.frameAttivo + '_SelectedPointInfoV2', JSON.stringify(appoggioValoriComboMATCRUN));
    // logConsole('Modifica misure tcrun', appoggioValoriComboMATCRUN);

    // if (!this.misureAddizionaliTCRUNStart) {
    //   this.misureAddizionaliTCRUNStart = JSON.parse(JSON.stringify(this.misureAddizionaliTCRUN));
    // }
    // logConsole('CONTROLLO TCRUN. Imposto ', JSON.stringify(this.misureAddizionaliTCRUN));

    // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Misure tcrun impostate', this.misureAddizionaliTCRUN);

    this.checkSeCiSonoModifiche();
  }

  // datiLOV1;
  // datiLOV2;
  // lastM1;
  // lastM2;

  /*
  LeggeDatiLOV(q, misura, daDove, AggiornareDati) {
    // let NomeCombo = '';
    // logConsole('Legge dati LOV' + q, misura, this.lastM1);

    if (q === 1) {
      if (misura === this.lastM1) {
        return;
      }

      this.lastM1 = misura;
      // logConsole('PULISCO  LOV1 5');
      // this.lovM1Id = '';
      this.datiModificati.textFilterM = '';
      logConsole('Pulisco filtro 1 settings (5)', this.filtro1);
      this.lovM1Appo = '';
      // NomeCombo = 'FilterLOV1_' + this.NumeroFrame + '_' + this.frameAttivo;
    } else {
      if (misura === this.lastM2) {
        return;
      }

      this.lastM2 = misura;
      // this.lovM2Id = '';
      this.datiModificati.textFilter2M = '';
      this.lovM2Appo = '';
      // NomeCombo = 'FilterLOV2_' + this.NumeroFrame + '_' + this.frameAttivo;
    }
    // localStorage.setItem(this.userName + '_' + NomeCombo + '_multisel', null);

    // // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Leggo misure mosaic style');

    // // logConsole('Leggo dati lov' + q + ': ', misura);

    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_measr_code": "' + misura + '"' +
    '}';
    this.apiService.chiamataPost(this.Utils, 'geo_measure_lov__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        let ok = false;
        let id = 1;

        // logConsole('Lettura lov1', q, daDove, data2.DataTable);
        if (q === 1) {
          this.datiLOV1 = data2.DataTable;

          if (this.datiLOV1) {
            this.datiLOV1.forEach(element => {
              element.id = id;
              id++;
            });
          }

          if (this.filtro1) {
            this.datiModificati.textFilterM = this.filtro1;
            logConsole('Imposto filtro 1 settings (6)', this.filtro1);
          } else {
            logConsole('Imposto filtro 1 settings (7) ma è vuoto');
          }
          this.lovM1Appo = JSON.parse(JSON.stringify(this.datiModificati.textFilterM));
          this.filtroModificato1 = false;
        } else {
          this.datiLOV2 = data2.DataTable;

          if (this.datiLOV2) {
            this.datiLOV2.forEach(element => {
              element.id = id;
              id++;
            });
          }

          if (this.filtro2) {
            this.datiModificati.textFilter2M = this.filtro2;
          }
          this.lovM2Appo = JSON.parse(JSON.stringify(this.datiModificati.textFilter2M));
          this.filtroModificato2 = false;
        }

        if (AggiornareDati) {
          this.aggiornaDatiOriginali('LeggeDatiLOV' + q);
        }
      } else {
        if (q === 1) {
          this.datiLOV1 = 'empty grid'; // null;
        } else {
          this.datiLOV2 = 'empty grid'; // null;
        }
      }
    }, error => {
      alert('Read Dati LOV:' + error);
    });
  }
  */

  aggiungeRigaLov1;
  aggiungeRigaLov2;

  aggiungeCodiceALov(q, codice, daDove) {
    if (codice.indexOf(',') > -1) {
      return;
    }

    if (!codice || codice === undefined || codice.trim() === 'undefined') {
      return;
    }

    // alert('aggiungo codice: ' + codice + ' -> ' + daDove);

    if (q === 1) {
      this.aggiungeRigaLov1 = { value: codice, Selezionata: true };
    } else {
      this.aggiungeRigaLov2 = { value: codice, Selezionata: true };
    }
  }

  finestraFilterAperta = false;
  qualeFilterAperto = 0;
  measureDataCM;
  datiLOV;
  filtroSelezionato;
  filtroTestoSelezionato;
  puoControllareFilter = false;

  applicaTextFilter(n) {
    let filtro = '';
    this.puoControllareFilter = false;
    this.qualeFilterAperto = n;
    if (n === 1) { 
      filtro = this.filter1;
      this.filtroSelezionato = this.filter1;
      this.filtroTestoSelezionato = this.txtFilter1;
    } else { 
      filtro = this.filter2; 
      this.filtroSelezionato = this.filter2;
      this.filtroTestoSelezionato = this.txtFilter2;
    }
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_filter_folder": "", ' +
      '"v_filter_display_name": "' + filtro + '"' +
    '}';
    // logConsole('Query misura', JSON.parse(params));
    this.apiService.chiamataPost(this.Utils, 'geo_measure_dfn__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // logConsole('Ritorno filtro misura', data);
      if (data && data.DataTable && data.DataTable.length > 0) {
        this.measureDataCM = JSON.parse(JSON.stringify(data.DataTable));
      }
      this.prendeLov(filtro);
    });
  }

  posizioneFinestraFilter = { x: 0, y: 0 };

  prendeLov(misura) {
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_measr_code": "' + misura + '"' +
    '}';
    this.apiService.chiamataPost(this.Utils, 'geo_measure_lov__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        let id = 1;

        // logConsole('Lettura lov1', q, daDove, data2.DataTable);
        this.datiLOV = data2.DataTable;

        if (this.datiLOV) {
          this.datiLOV.forEach(element => {
            element.id = id;
            id++;
          });
        }
      }

      const rect = this.divFiltri.nativeElement.getBoundingClientRect();
      const x = rect.left - 250;
      const y = rect.top - 50;

      this.posizioneFinestraFilter = { x: x, y: y };

      this.finestraFilterAperta = true;

      const tt = setTimeout(() => {
        clearTimeout(tt);
    
        this.puoControllareFilter = true;
      }, 500);
    });
  }

  clickIconaConfigList(e) {
    // // logConsole('Premuta icona config list', e);
    // // logConsole('Lista campi', this.listaCampi);

    const listaCampi = this.datiModificati.listaCampiAttuale;
    const checkata = !(e.valore === 'Y');
    // // logConsole('Da checkare', e.valore, checkata);
    const valore = e.dati.VALUE;
    const codice = e.dati.CODE;
    let ok = false;
    listaCampi.forEach(element => {
      if (element.CODE === codice) {
        ok = true;
        if (checkata) {
          let lista = element.FILTER_VALUE_LIST;
          if (!lista) {
            lista = new Array();
          }
          lista.push(valore);
          element.FILTER_VALUE_LIST = lista;
          this.listaCampiFiltrati = lista;

          // // logConsole('Elemento aggiunto', valore, element.FILTER_VALUE_LIST);
        } else {
          const nuovaLista = new Array();
          if (element.FILTER_VALUE_LIST) {
            element.FILTER_VALUE_LIST.forEach(element2 => {
              if (element2 !== valore) {
                nuovaLista.push(element2);
              }            
            });
          }
          element.FILTER_VALUE_LIST = nuovaLista;
          this.listaCampiFiltrati = nuovaLista;

          // // logConsole('Elemento rimosso', valore, element.FILTER_VALUE_LIST);
        }
      }
    });
    if (!ok) {
      if (checkata) {
        this.listaCampiFiltrati = [ valore ];
      } else {
        this.listaCampiFiltrati = [];
      }
      let riga = 0;
      listaCampi.forEach(element => {
        if (element.ROW_ID > riga) {
          riga = element.ROW_ID + 1;
        }
      });
      // // logConsole(this.datiConfig)
      this.datiConfig.DataTable.forEach(element => {
        if (element.CODE === codice) {
          const ee = element;
          ee.FILTER_VALUE_LIST = this.listaCampiFiltrati;
          listaCampi.push(ee);
        }
      });
    }

    // // logConsole('Lista campi finale', this.listaCampi, this.listaCampiFiltrati);

    if (JSON.stringify(listaCampi) === this.listaCampiAttualeConfronto) {
      this.tastoRefreshAttivo = false;
    } else {
      this.tastoRefreshAttivo = true;
      this.listaCampiAttualeConfronto = JSON.stringify(listaCampi);
    }

    this.caricaConfigList();

    // VA MESSO? QUESTO AGGIORNA LA LISTA DEI CAMPI MA NON DOVREBBE FARLO SEMPRE
    // this.propagaListaCampi();
    // VA MESSO? QUESTO AGGIORNA LA LISTA DEI CAMPI MA NON DOVREBBE FARLO SEMPRE
  }

  refreshConfig(e) {
    if (e) {
      this.datiConfig = undefined;
    }
    this.lastCallConfig[this.NumeroFrame] = '';

    this.caricaConfig();
  }

  messaggioWarningConfig = '';

  caricaConfig() {
    if (this.datiModificati.mappaOGraficoM !== 'TP') {
      return;
    }

    this.chiSonoField = 'F' + this.NumeroFrame + ';P' + this.frameAttivo + ';' + new Date().toString();

    let sInizio;
    let sFine;
    let nomeActSet = this.act_set;

    if (this.datiModificati.timeFilterM === 2) {
      if (!this.tmsSelezionato || this.tmsSelezionato === null || this.tmsSelezionato === '') {
        // this.datiList = 'empty grid';
        // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Tc Run Grid Config: esco da tcrun grid per tms selezionato vuoto');
        return;
      }

      sInizio = this.tmsMin; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
      sFine = this.tmsMax ; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
    } else {
      if (this.eseguitoInProgetto === false) {
        if (this.datiModificati.timeFilterM === 4) {
          // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Tc Run Grid Config: Time filter activity');

          nomeActSet = this.Utils.nomeActivitySelezionata;
          sInizio = null;
          sFine = null;
        } else {
          sInizio = this.tmsGlobaleMin;
          sFine = this.tmsGlobaleMax;
        }
      } else {
        sInizio = this.tmsGlobaleMin;
        sFine = this.tmsGlobaleMax;
      }
    }

    if (!nomeActSet) {
      // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Tc Run Grid Config: esco da tcrun grid per nome act set vuoto');
      return;
    }

    if (!sInizio) {
      // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Tc Run Grid Config: esco da tcrun grid per tms inizio vuoto');
      return;
    }

    if (!sFine) {
      // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Tc Run Grid Config: esco da tcrun grid per tms fine vuoto');
      return;
    }

    const listaCampi = this.datiModificati.listaCampiAttuale;

    const params = {
      v_cntx_id: this.sessionID,
      v_caller_tag: null,
      v_field_list: listaCampi ? listaCampi : [],
      v_act_set_name_list: nomeActSet,
      v_tms_min: sInizio,
      v_tms_max: sFine
    }
    // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Tc Run Grid Config: Richiamo tcrun Config', params);

    // // logConsole('CONFIG: ', params);

    const valoriDiBase2 = ';' + this.dashboardAttiva + ';' + this.frameAttivo + ';';
    const actualCall2 = 'TCRUN2Config;' + valoriDiBase2 + ';' + JSON.stringify(params);

    params.v_caller_tag = this.chiSonoField;
    this.erroreConfig = '';

    if (this.lastCallConfig[this.NumeroFrame] !== actualCall2) { // && this.vecchioDatiJsonConfig) {
      this.lastCallConfig[this.NumeroFrame] = actualCall2;
      this.caricamentoConfigInCorso = true;
      // this.maiCaricatoConfig = false;

      this.apiService.chiamataPostEventi(this.Utils, 'geo_tc_run_fields__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.checkRitornoChiamata(null,  this.Utils, data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningConfig= data.v_grid_msg;
        } else {
          this.messaggioWarningConfig = '';
        }

        /* if (!this.controllaRitornoChiamata(data, 'Fields')) {
          this.caricamentoConfigInCorso = false;
          return;
        } */

        if (this.datiConfig && this.datiConfig.DataTable) {
          if (data && data.DataTable) {
            // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'TC Run Grid Config: rinfresco griglia 2');

            this.datiConfig.DataTable = data.DataTable;
          } else {
            this.datiConfig = 'empty grid';
          }
        } else {
          // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'TC Run Grid Config: riempimento griglia 2');

          this.datiConfig = data;
          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.effettuaAutoFitConfig = !this.effettuaAutoFitConfig;
          }, 500);
        }

        this.vecchioDatiJsonConfig = this.datiConfig;
        this.caricamentoConfigInCorso = false;
      }, error => {
        this.erroreConfig = error?.message;
        this.caricamentoConfigInCorso = false;
        this.vecchioDatiJsonConfig = undefined;
        this.lastCallConfig[this.NumeroFrame] = '';
        this.datiConfig = 'ERROR: ' + error?.message;
      });
    /* } else {
      this.datiConfig = this.vecchioDatiJsonConfig;
      this.caricamentoConfigInCorso = false; */
    }
  }

  clickRigaConfig(e) {
    // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'TC Run Grid Config: click config', e);
    this.campoSelezionato = e[0].CODE;
    /* if (!this.listaCampi) {
      this.listaCampi = new Array();
    }
    this.listaCampi.push(e[0]);
    this.listaCampiEmit.emit(this.listaCampi); */

    this.listaCampiFiltrati = e[0].FILTER_VALUE_LIST;

    // this.prendeDatiList();
    this.caricaConfigList();
  }

  clickIconaConfig(e) {
    this.campoSelezionato = e.dati.CODE;

    let nuovoValore = '';
    if (e.valore === 'Y') {
      nuovoValore = 'N';
    } else {
      nuovoValore = 'Y';
    }
    const nomeCampo = e.clickata.field;
    const riga = JSON.parse(JSON.stringify(e.dati));
    riga[nomeCampo] = nuovoValore;

    let listaCampi = this.datiModificati.listaCampiAttuale;

    // logConsole('Click icona', e, listaCampi, riga, nuovoValore);

    const lc = new Array();
    if (!listaCampi) {
      listaCampi = new Array();
    }
    let ok = false;
    listaCampi.forEach(element => {
      if (element) {
        if (element.CODE === e.dati.CODE) {
          element = JSON.parse(JSON.stringify(riga));
          // // logConsole('Aggiorno elemento', element, riga, nuovoValore);
          ok = true;
        }
        lc.push(element);
      }
    });
    if (!ok) {
      // // logConsole('Aggiungo elemento', riga, nuovoValore);
      lc.push(riga);
    }

    const n = new Array();
    lc.forEach(element => {
      // Aggiungere qui sotto tutti i campi icona
      if (element.DIM !== 'N' || element.VIEW !== 'N' || element.MEASURE_MIN !== 'N' || 
        element.MEASURE_MAX !== 'N' || element.MEASURE_AVG !== 'N') {
        n.push(element);
      }
    });
    // logConsole('Lista elementi', n);
    listaCampi = JSON.parse(JSON.stringify(n));

    if (this.listaCampiAttualeConfronto === JSON.stringify(listaCampi)) {
      this.tastoRefreshAttivo = false;
    } else {
      this.tastoRefreshAttivo = true;
    }
    // this.listaCampiEmit.emit(this.listaCampi);

    this.datiModificati.listaCampiAttuale = listaCampi;
    
    // // this.Log?.scriveLog(this, this.debugConfig, this.Log?.getMethodName(), false, 'TC Run Grid Config: click icona config', this.listaCampi);

    this.listaCampiFiltrati = listaCampi;

    this.caricaConfig();
    // this.prendeDatiList();

    this.caricaConfigList();
  }

  propagaListaCampi() {
    if (!this.permetteEmit) {
      return;
    }

    const listaCampi = this.datiModificati.listaCampiAttuale;
    // // logConsole('Propaga', listaCampi);

    this.listaCampiAttualeConfronto = JSON.stringify(listaCampi);
    this.listaCampiAttuale = JSON.parse(JSON.stringify(listaCampi));
    this.tastoRefreshAttivo = false;

    this.listaCampiEmit.emit(listaCampi);
  }

  refreshConfigList(e) {
    if (e) {
      this.datiConfigList = undefined;
    }
    this.lastCallConfigList[this.NumeroFrame] = '';

    this.caricaConfigList();
  }

  messaggioWarningConfigList = '';

  caricaConfigList() {
    if (!this.campoSelezionato) {
      return;
    }

    this.chiSonoFieldValue = 'F' + this.NumeroFrame + ';P' + this.frameAttivo + ';' + new Date().toString();

    let sInizio;
    let sFine;
    let nomeActSet = this.act_set;

    if (this.datiModificati.timeFilterM === 2) {
      if (!this.tmsSelezionato || this.tmsSelezionato === null || this.tmsSelezionato === '') {
        // this.datiList = 'empty grid';
        // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Tc Run Grid Config List: esco da tcrun grid per tms selezionato vuoto');
        return;
      }

      sInizio = this.tmsMin; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
      sFine = this.tmsMax ; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
    } else {
      if (this.eseguitoInProgetto === false) {
        if (this.datiModificati.timeFilterM === 4) {
          // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Tc Run Grid Config List: Time filter activity');

          nomeActSet = this.Utils.nomeActivitySelezionata;
          sInizio = null;
          sFine = null;
        } else {
          sInizio = this.tmsGlobaleMin;
          sFine = this.tmsGlobaleMax;
        }
      } else {
        sInizio = this.tmsGlobaleMin;
        sFine = this.tmsGlobaleMax;
      }
    }

    const listaCampi = this.datiModificati.listaCampiAttuale;

    const params = {
      v_cntx_id: this.sessionID,
      v_code : this.campoSelezionato,
      v_caller_tag: null,
      v_act_set_name_list: nomeActSet,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_filter_value_list: this.listaCampiFiltrati ? this.listaCampiFiltrati : []
    }
    // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'Tc Run Grid Config List: Richiamo tcrun ConfigList', params);

    const valoriDiBase2 = ';' + this.dashboardAttiva + ';' + this.frameAttivo + ';';
    const actualCall2 = 'TCRUN2ConfigList;' + valoriDiBase2 + ';' + JSON.stringify(params);

    params.v_caller_tag = this.chiSonoFieldValue;

    if (this.lastCallConfigList[this.NumeroFrame] !== actualCall2) { // && this.vecchioDatiJsonConfigList) {
      this.lastCallConfigList[this.NumeroFrame] = actualCall2;
      this.caricamentoConfigListInCorso = true;

      this.apiService.chiamataPostEventi(this.Utils, 'geo_tc_run_field_values__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.checkRitornoChiamata(null,  this.Utils, data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningConfigList = data.v_grid_msg;
        } else {
          this.messaggioWarningConfigList = '';
        }

        /* if (!this.controllaRitornoChiamata(data, 'FieldValues')) {
          this.caricamentoConfigListInCorso = false;
          return;
        } */

        if (this.datiConfigList && this.datiConfigList.DataTable) {
          if (data && data.DataTable) {
            // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'TC Run Config List: rinfresco griglia 2');

            this.datiConfigList.DataTable = data.DataTable;
          } else {
            this.datiConfigList = 'empty grid';
          }
        } else {
          // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'TC Run Config List: riempimento griglia 2');

          this.datiConfigList = data;
          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.effettuaAutoFitConfigList = !this.effettuaAutoFitConfigList;
          }, 500);
        }

        // // logConsole('CONFIG 1', listaCampi, this.datiConfigList);

        if (listaCampi) {
          // this.listaCampi.forEach(element => {
            const list2 = new Array();
            if (this.datiConfigList.DataTable) {
              this.datiConfigList.DataTable.forEach(element => {
                // if (element.CODE === element2.CODE) {
                  if (element.IS_INCLUDED === 'Y') {
                    list2.push(element.VALUE);
                  }
                // }
              });
            }
            this.listaCampiFiltrati = list2;

            // element2.FILTER_VALUE_LIST = list2;
            listaCampi.forEach(element => {
              if (element.CODE === this.campoSelezionato) {
                element.FILTER_VALUE_LIST = list2;
              }
            });
          // });
          // // logConsole('CONFIG 2', listaCampi);
        }
        // // logConsole('Car. Config List', this.listaCampi, this.datiConfigList.DataTable, this.listaCampiFiltrati);

        this.erroreConfigList = '';
        this.vecchioDatiJsonConfigList = this.datiConfigList;
        this.caricamentoConfigListInCorso = false;
      }, error => {
        this.caricamentoConfigListInCorso = false;
        this.erroreConfigList = error?.message;
        this.vecchioDatiJsonConfigList = undefined;
        this.lastCallConfigList[this.NumeroFrame] = '';
        this.datiConfigList = 'ERROR: ' + error?.message;
      });
    /* } else {
      this.datiConfigList = this.vecchioDatiJsonConfigList;
      this.caricamentoConfigListInCorso = false; */
    }
  }

  clickRigaConfigList(e) {
    // this.Log?.scriveLog(this, this.Debug, this.Log?.getMethodName(), false, 'TC Run Config List: click riga config list', e);
  }

  trackByMeasures(index: number, item: any) {
    return item.id;
  }

  ritornoDimensioniColonneConfig(e) {
    this.scriveDimensioniColonne('Config', e);
  }

  ritornoDimensioniColonneLookUp(e) {
    this.scriveDimensioniColonne('LookUp', e);
  }

  ritornoDimensioniColonneAddLayers(e) {
    this.scriveDimensioniColonne('AddLayers', e);
  }

  ritornoDimensioniColonneDM(e) {
    this.scriveDimensioniColonne('DM', e);
  }

  ritornoDimensioniColonneConfigList(e) {
    this.scriveDimensioniColonne('ConfigList', e);
  }

  ritornoDimensioniColonnePM(e) {
    this.scriveDimensioniColonne('PM', e);
  }

  ritornoDimensioniColonneEventiTogliere(e) {
    this.scriveDimensioniColonne('EventiTogliere', e);
  }

  ritornoDimensioniColonneEventiMettere(e) {
    this.scriveDimensioniColonne('EventiMettere', e);
  }

  scriveDimensioniColonne(tabella, dimensioniColonne) {
    logConsole('Scrittura dimensioni colonna', tabella, dimensioniColonne);
  }

  vecchioE = '';

  cambioScrittaMisura(e, tipo, numeroMisura) {
    this.vecchioE = e;
  
    const t = setInterval(() => {
      if (this.vecchioE === e) {
        this.vecchioE = '';
        clearInterval(t);
  
        // logConsole('Ricerco misura ' + e + ' per ', tipo);
        this.cambioScrittaMisura2(e, '', true, tipo, numeroMisura);
      }
    }, 200);
  }

  cambioScrittaMisura2(e, codice, daScrittaSuCombo, tipo, numeroMisura) {
    if (typeof(e) === 'string') {
      if (e.length > 0) {
        const params = '{' +
          '"cntx_id": "' + this.sessionID + '",' +
          '"v_filter_folder": "", ' +
          '"v_filter_display_name": "' + e + '"' +
        '}';
        // logConsole('Query misura', JSON.parse(params));
        this.apiService.chiamataPost(this.Utils, 'geo_measure_dfn__grid', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data && data.DataTable && data.DataTable.length > 0) {
            let elemento = undefined;
            data.DataTable.forEach(element => {
              if (element.CODE === e || element.DISPLAY_NAME.indexOf('e') > -1 ) {
                elemento = element;
              }
            });
            
            // logConsole('Controllo misura 1: ' + tipo, e, elemento, data.DataTable);


            /* MIO LOG
            Imposto filtro 1 settings 1 prima
            Chiamata antenne frame 7. Esco 4 Accentratore-EsegueChiamataLayers
            Pulisco filtro 1 settings
            Cambio cluster measure in frame struct_partition_label
            */

            const t = setTimeout(() => {
              clearTimeout(t);

              switch (tipo) {
                /* case "CLUSTERMEASURE1":
                  this.measureDataCM1 = JSON.parse(JSON.stringify(data.DataTable));
                  if (!elemento) { 
                    this.aggiungeMisuraNonTrovata(e, this.measureDataCM1); 
                  }
                  break;
                case "CLUSTERMEASURE2":
                  this.measureDataCM2 = JSON.parse(JSON.stringify(data.DataTable));
                  if (!elemento) { 
                    this.aggiungeMisuraNonTrovata(e, this.measureDataCM2); 
                  }
                  break; */
                case "CORRELATION":
                  this.measureDataCor = JSON.parse(JSON.stringify(data.DataTable));
                  if (!elemento) { 
                    this.aggiungeMisuraNonTrovata(e, this.measureDataCor); 
                  }
                  break;
                case "MEASURERCM":
                  this.measureDataRCM = JSON.parse(JSON.stringify(data.DataTable));
                  if (!elemento) { 
                    this.aggiungeMisuraNonTrovata(e, this.measureDataRCM); 
                  }
                  break;
                case "MEASURESMS":
                  this.measureDataSMS = JSON.parse(JSON.stringify(data.DataTable));
                  if (!elemento) { 
                    this.aggiungeMisuraNonTrovata(e, this.measureDataSMS); 
                  }
                  break;
                case "OVERLAY":
                  this.measureDataO = JSON.parse(JSON.stringify(data.DataTable));
                  if (!elemento) { 
                    this.aggiungeMisuraNonTrovata(e, this.measureDataO); 
                  }
                  break;
                case "OVERLAYCLUSTER":
                  this.measureDataC = JSON.parse(JSON.stringify(data.DataTable));
                  if (!elemento) { 
                    this.aggiungeMisuraNonTrovata(e, this.measureDataC); 
                  }
                  break;
                case "MEASURE":
                  this.measureDataMeas[numeroMisura] = JSON.parse(JSON.stringify(data.DataTable));
                  if (!elemento) { 
                    this.aggiungeMisuraNonTrovata(e, this.measureDataMeas[numeroMisura]); 
                  }
                  break;
                case "MEASURETC":
                  this.measureDataMeasTC = JSON.parse(JSON.stringify(data.DataTable));
                  if (!elemento) { 
                    this.aggiungeMisuraNonTrovata(e, this.measureDataMeasTC); 
                  }
                  break;
              }

              // if (!daScrittaSuCombo) {
                this.gestisceMisuraArrivata(e, codice, tipo);
              // }
            }, 500);
          } else {
            // logConsole('Controllo misura vuoto', e);
            // this.measureDataCompleti = undefined;
          }
        });
      }
    }
  }

  aggiungeMisuraNonTrovata(contr, dove) {
    let maxId = 0;
    dove.forEach(element => {
      if (element.ROW_ID > maxId) {
        maxId = element.ROW_ID;
      }
    });

    const nuovaMisura = {
      CODE: contr,
      DESCRIPTION: contr,
      DISPLAY_NAME: contr,
      FILE_TYPE: "SMS",
      FOLDER: "New Measure",
      INSERT_TIMESTAMP: "",
      MEASR_CODE: contr,
      NET_TECH: "",
      ROW_ID: maxId + 1,
      TYPE: "2",
      TYPE_STR: "list",
      UPDATE_TIMESTAMP: ""
    }            
    dove.push(nuovaMisura);
    if (!this.measureDataCompleti2) {
      this.measureDataCompleti2 = new Array();
    }
    this.measureDataCompleti2.push(nuovaMisura);
  }

  controllaEsistenzaMisura(m, tipo, numeroMisura) {
    // logConsole('Controllo misura', m, tipo);
    this.cambioScrittaMisura2(m, m, false, tipo, numeroMisura);
  }

  attesaClusterMeasure = false;
  attesaClusterMeasure2 = false;
  filtro1;
  filtro2;

  gestisceMisuraArrivata(e, codice, tipo) {
    switch (tipo) {
      /* case "CLUSTERMEASURE1":
        // logConsole('Misura passata', e, codice, tipo, this.measureDataCM1);
        this.datiModificati.clusterMeasureM = codice;
        this.datiLOV1 = undefined;
        logConsole('Imposto filtro 1 settings', this.datiModificati.textFilterM);
        this.filtro1 = this.datiModificati.textFilterM;        
        if (this.datiModificati.clusterMeasureM) {
          this.LeggeDatiLOV(1, this.datiModificati.clusterMeasureM, 'ImpostoCM1', true);
        } else {
          // logConsole('Imposto tf1 problema');
        }
        // logConsole('PULISCO  LOV1 7', this.datiOriginali.textFilterM);
        // this.lovM1Id = this.datiOriginali.textFilterM;
        this.attesaClusterMeasure = false;
        break;
      case "CLUSTERMEASURE2":
        this.datiModificati.clusterMeasure2M = codice;
        this.datiLOV2 = undefined;
        logConsole('Imposto filtro 2 settings', this.datiModificati.textFilter2M);
        this.filtro2 = this.datiModificati.textFilter2M;
        if (this.datiModificati.clusterMeasure2M) {
          this.LeggeDatiLOV(2, this.datiModificati.clusterMeasure2M, 'ImpostoCM2', true);
        } else {
          // logConsole('Imposto tf2 problema');
        }
        this.attesaClusterMeasure2 = false;
        // this.lovM2Id = this.datiOriginali.textFilter2M;
        break; */
      case "CORRELATION":
        this.datiModificati.correlationM = codice;
        // this.datiOriginali.correlationM = codice;
        this.aggiornaDatiOriginali('GestisceMisureArrivate.CORR');
        break;
      case "MEASURERCM":
        this.datiModificati.measureRCM = codice;
        // this.datiOriginali.measureRCM = codice;
        this.aggiornaDatiOriginali('GestisceMisureArrivate.RCM');
        break;
      case "MEASURESMS":
        this.datiModificati.measureSMSM = codice;
        // this.datiOriginali.measureSMSM = codice;
        this.aggiornaDatiOriginali('GestisceMisureArrivate.SMS');
        break;
      case "OVERLAY":
        if (codice === '') {
          this.datiModificati.overlayM = '<Global Mosaic>';
        } else {
          this.datiModificati.overlayM = codice;
        }
        // this.datiOriginali.overlayClusterM = this.datiModificati.overlayClusterM;
        this.aggiornaDatiOriginali('GestisceMisureArrivate.O');
        break;
      case "OVERLAYCLUSTER":
        if (codice === '') {
          this.datiModificati.overlayClusterM = '<Global Cluster>';
        } else {
          this.datiModificati.overlayClusterM = codice;
        }
        // this.datiOriginali.overlayClusterM = this.datiModificati.overlayClusterM;
        this.aggiornaDatiOriginali('GestisceMisureArrivate.OC');
        break;
    }
  }

  vecchioF;

  cambioScrittaMisuraFiltro(e) {
    this.vecchioF = e;
  
    const t = setInterval(() => {
      if (this.vecchioF === e) {
        this.vecchioF = '';
        clearInterval(t);
  
        // logConsole('Ricerco misura ' + e + ' per ', tipo);
        this.cambioScrittaMisuraFiltro2(e);
      }
    }, 200);
  }

  cambioScrittaMisuraFiltro2(e) {
    if (typeof(e) === 'string') {
      if (e.length > 0) {
        const params = '{' +
          '"cntx_id": "' + this.sessionID + '",' +
          '"v_filter_folder": "", ' +
          '"v_filter_display_name": "' + e + '"' +
        '}';
        // logConsole('Query misura', JSON.parse(params));
        this.apiService.chiamataPost(this.Utils, 'geo_measure_dfn__grid', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data && data.DataTable && data.DataTable.length > 0) {
            this.measureDataCM = JSON.parse(JSON.stringify(data.DataTable));
          }
        });
      }
    }
  }

  selectMisuraFilter(a) {
    if (!this.puoControllareFilter) {
      return;
    }

    if (a) {
      // logConsole('Select misura filter', a);
      this.filtroSelezionato = a.MEASR_CODE;
      this.filtroTestoSelezionato = '';
      this.prendeLov(a.MEASR_CODE);
    } else {
      // logConsole('Select misura filter vuoto');
      this.filtroSelezionato = '';
      this.filtroTestoSelezionato = '';      
    }
  }

  cambioFilterText(a) {
    // logConsole('Select testo misura filter', a);
    this.filtroTestoSelezionato = a;
  }

  applicaFiltri() {
    // logConsole('Applica filtri', this.qualeFilterAperto, this.filtroSelezionato, this.filtroTestoSelezionato);
    if (this.qualeFilterAperto === 1) {
      this.filter1 = this.filtroSelezionato;
      if (this.filter1) {
        this.ritornaMisura(1, this.filter1);
      } else {
        this.filter1NAME = '';
      }
      this.txtFilter1 = this.filtroTestoSelezionato;
    } else {  
      this.filter2 = this.filtroSelezionato;
      if (this.filter2) {
        this.ritornaMisura(2, this.filter2);
      } else {
        this.filter2NAME = '';
      }
      this.txtFilter2 = this.filtroTestoSelezionato;
    }

    this.checkSeCiSonoModifiche();
    
    this.finestraFilterAperta = false; 
    this.puoControllareFilter = false;
  }

  selezioneRigheAddEvents = false;

  selezioneTutteLeRigheAE(e, come) {
    logConsole('Selezionate tutte le righe AddEvents', e, come);
    if (come) {
      this.selezioneRigheAddEvents = true;

      this.pulisceSelezioneDaMettere = '';
      this.infoKeyVisibileMettere = true;
      this.EventiSelezionati = JSON.parse(JSON.stringify(e));
    } else {
      this.selezioneRigheAddEvents = false;

      this.pulisceSelezioneDaMettere = '';
      this.infoKeyVisibileMettere = true;
      this.EventiSelezionati = new Array();
    }
  }

  selezioneTuttiILayers = false;

  selezionatiTuttiILayers(e, come) {
    logConsole('Selezionate tutti i layers', e, come);

    let ee = '[';
    let eee = new Array();
    if (e.length > 0) {
      e.forEach(element => {
        ee += '{"ROW_ID": ' + element.ROW_ID + ', "VALUE_STR": "' + element.VALUE_STR + '", "CODE_STR": "' + element.CODE_STR + '"},';
        eee.push(element.ROW_ID); //  += element.ROW_ID + ',';
      });
    }
    if (ee.length > 2) {
      ee = ee.substring(0, ee.length - 1) + ']';
      // eee = eee.substring(0, eee.length - 1);

      this.selezioneAddLayers = eee;
      this.datiModificati.addLayersM = ee;
      if (this.Debug === true) {
        this.scriveLog('Add layers emit', eee, JSON.parse(ee));
      }
      this.addLayersEmit.emit(this.datiModificati.addLayersM);
    } else {
      this.selezioneAddLayers = [];
      this.datiModificati.addLayersM = '';
      this.addLayersEmit.emit(this.datiModificati.addLayersM);
    }

    if (come) {
      this.selezioneTuttiILayers = true;
    } else {
      this.selezioneTuttiILayers = false;
    }
  }

  isNumeric(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
  }
}

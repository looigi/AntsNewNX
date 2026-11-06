import { logConsole } from './console-log';
import { conta } from './contatori';
import { Subject, Subscription, fromEvent, of } from 'rxjs';
import { tap, catchError, take, map, takeUntil } from 'rxjs/operators';
import {
  Component, Input, EventEmitter, Output, OnChanges, AfterViewChecked, OnInit, AfterViewInit,
  OnDestroy,
  Inject,
  ViewChild,
  ViewEncapsulation,
  Renderer2,
  NgZone,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { process, State, GroupDescriptor, DataResult, GroupResult, CompositeFilterDescriptor, filterBy} from '@progress/kendo-data-query';
import { ColumnANTS } from './models/column-ANTS-component';
import { environment } from '../../../environments/environment';
import { GridSettings } from './models/grid-settings.interface';
import { DialogComponent } from './dialog-box/dialog-component';
// import * as moment_ from 'moment';
// import { isNumeric } from 'rxjs/util/isNumeric';
import { ColumnSettings } from './models/column-settings.interface';
import { GridComponent, RowArgs, RowClassArgs, GridDataResult, SortSettings, SelectableSettings, SelectableMode, ScrollRequest, GroupRowArgs } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
// import 'rxjs/add/observable/timer';
// import 'rxjs/add/operator/take';
import {PanelBarItemModel} from '@progress/kendo-angular-layout';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { DomSanitizer } from '@angular/platform-browser';
// import { AxisLabelVisualArgs, ThemeService, ValueAxisLabels } from '@progress/kendo-angular-charts';
import { ContextMenuComponent } from '@progress/kendo-angular-menu';
import { ApiService } from './services/api.service';
// import 'rxjs/add/operator/map';
// import { map } from 'rxjs/operators';

// import { ResizedEvent } from 'angular-resize-event';
import { ExternalHttpClient } from './services/httpclient.service';
import { DatePipe, DecimalPipe, DOCUMENT } from '@angular/common';
import { ConfermaComponent } from './conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { flush } from '@angular/core/testing';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { SortableComponent } from 'ngx-bootstrap';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ModifierKey } from '@progress/kendo-angular-charts';
import Swal from 'sweetalert2';
// import { isNumeric } from 'rxjs/internal-compatibility';
import { TextMeasureService } from './services/TextMeasureService.srvice';
import { constructorParametersDownlevelTransform } from '@angular/compiler-cli';
import { FilterComponent, FilterExpression } from '@progress/kendo-angular-filter';
// import { DataResultIterator } from '@progress/kendo-angular-grid/dist/es2015/data/data.collection';
// import { trigger } from '@angular/animations';
// import { ConsoleReporter } from 'jasmine';
// import Swal from 'sweetalert2/dist/sweetalert2.js';

export let gridExtern: any;
export let idPerQuery: string;
export let howManyDays = 30;
export let latestIterations = 100;
export let rowNum = '100';

const tableRow = node => node.tagName.toLowerCase() === 'tr';

const closest = (node, predicate) => {
    while (node && !predicate(node)) {
        node = node.parentNode;
    }

    return node;
};

interface Item {
  text: string;
  value: number;
}

/** @dynamic */
@Component({
  selector: 'app-ants-grid-lib',
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./general.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AntsGridLibraryComponent implements OnChanges, OnInit, AfterViewChecked, OnDestroy, AfterViewInit {
  // @ViewChild('txtFilter', { static: false }) txtFilter: ElementRef;

  static serverPostRest = '';

  modificaCampi = false;
  
  // subscribeStart = undefined;
  cookieOrder = '';
  cookieKey = '';
  righeDaEliminare;
  popupWsAperto = false;
  posXWS = -1;
  posYWS = -1;
  erroreDati = '';
  hoverTEM;
  autofitSoloRigheIniziali = true;
  ciSonoColumnHidden = false;
  debug2 = false;
  eseguitoRefresh = false;
  // debugTasto = false;

  public modifierKey: ModifierKey = "ctrl";
  sortSettings: SortSettings = {
    mode: "multiple",
    initialDirection: "asc",
    allowUnsort: true,
    showIndexes: true,
  };

  // static chartone;
  @Input() modalita;
  @Input() navigabile = true;
  @Input() debug = false;
  @Input() data;
  @Input() title;
  @Input() icoPath;
  @Input() maskName;
  @Input() hiddenTitle;
  @Input() gridId;
  @Input() minimumRowModality: boolean;
  @Input() userName;
  @Input() gridHeight;
  @Input() idProperty;
  @Input() selection;
  @Input() eliminaSelezioniSuClickRiga = true;
  @Input() newKeyVisibile: boolean;
  @Input() processKeyVisibile: boolean;
  @Input() includeKeyVisibile: boolean = false;
  @Input() excludeKeyVisibile: boolean = false;
  @Input() copyKeyVisibile: boolean;
  @Input() infoKeyVisibile: boolean;
  @Input() tcRunInfoVisibile: boolean;
  @Input() editKeyVisibile: boolean;
  @Input() editKeyVisibileN: boolean;
  @Input() refreshKeyVisibile: boolean;
  @Input() deleteKeyVisibile: boolean;
  @Input() delete2KeyVisibile: boolean;
  @Input() deleteKeyTcRunVisibile: boolean;
  @Input() addKeyVisibile: boolean;
  @Input() removeKeyVisibile: boolean;
  @Input() confirmKeyVisibile: boolean;
  @Input() runKeyVisibile: boolean;
  @Input() getTcRunFilesKeyVisibile: boolean;
  @Input() rePlayKeyVisibile: boolean;
  @Input() selezioneMultipla: boolean;
  @Input() ricordaSelezione: boolean;
  @Input() pulisceSelezione;
  @Input() rinfrescaGriglia: boolean;
  @Input() raggruppabile: boolean;
  @Input() campiPerRaggruppamento;
  @Input() visualizzaScrittaFolder = true;
  @Input() paginabile;
  @Input() impostaSelezione;
  @Input() confirmKeyPersistant: boolean;
  @Input() newKeyPersistant: boolean;
  @Input() copyKeyPersistant: boolean;
  @Input() deleteKeyPersistant: boolean;
  @Input() deleteKeyPersistant2: boolean;
  @Input() deleteKeyTcRunPersistant: boolean;
  @Input() addKeyPersistant: boolean;
  @Input() removeKeyPersistant: boolean;
  @Input() editKeyPersistant: boolean;
  @Input() editKeyPersistantN: boolean;
  @Input() infoKeypersistant: boolean;
  @Input() DimensioneFont: number;
  @Input() AutoResize: boolean = false; // NON PIU' UTILIZZATO
  @Input() PermetteDragDrop: boolean;
  @Input() ManualResize: boolean = false; // NON PIU' UTILIZZATO
  @Input() CalcolaDelta: boolean;
  @Input() CampoCalcolaDelta: string;
  @Input() possoSelezionareTutto: boolean;
  @Input() visualizzaCampiUlterioriColumnSelector: boolean;
  @Input() impostaPagina;
  @Input() itemsMenu;
  @Input() tastoSync;
  @Input() tastoTicket;
  @Input() filtroEventi;
  @Input() gestioneTicket;
  @Input() sessioneAttuale;
  @Input() filtroAttivoPass;
  /* @Input() filtroAttivoPassCol1;
  @Input() filtroAttivoPassCol2;
  @Input() filtroAttivoPassCol3;
  @Input() filtroAttivoPassCol4; */
  @Input() titleDaDatiGriglia = false;
  @Input() righeAutomatiche;
  @Input() paginazione = "scrollable"; // virtual oppure scrollable
  @Input() righePerPaginaVirtuale = 100;
  @Input() toolbarVisibile = true;
  @Input() pageSize = 200;
  @Input() datiNuovi;
  @Input() stampaTempiGrid = false;
  @Input() collassaTutto = false;
  @Input() espandiTutto = false;
  @Input() excelEventi = false;
  @Input() linkIcone = 'http://localhost:2727/assets/img';

  // Sostituisce nel template linkIcone && linkIcone.toUpperCase().indexOf('UNDEFINED')==-1, rivalutata a ogni
  // change detection: il controllo sulla stringa si rifà solo quando linkIcone cambia
  private ultimoLinkIconeControllato;
  private iconeValideCalcolato = false;
  get iconeValide(): boolean {
    if (this.linkIcone !== this.ultimoLinkIconeControllato) {
      this.ultimoLinkIconeControllato = this.linkIcone;
      this.iconeValideCalcolato = !!this.linkIcone && this.linkIcone.toUpperCase().indexOf('UNDEFINED') === -1;
    }
    return this.iconeValideCalcolato;
  }

  // Colonna da visualizzare come HTML (nome con _HTMLFRM oppure "HTML"): il template lo controllava per ogni cella
  // a ogni change detection; il risultato dipende solo dal nome del campo, quindi si calcola una volta per campo
  private colonneHtml: { [campo: string]: boolean } = {};
  colonnaHtml(column): boolean {
    const campo = column && column.field;
    if (!campo) {
      return false;
    }
    let r = this.colonneHtml[campo];
    if (r === undefined) {
      r = this.colonneHtml[campo] = campo.indexOf('_HTMLFRM') > -1 || campo.toUpperCase().trim() === 'HTML';
    }
    return r;
  }
  @Input() nomiColonne;
  @Input() attesaClick = false;
  @Input() tempoRipristinoAttesa = 1500;
  @Input() visualizzaToolTipGrafici = true;
  @Input() addToActSetOn = false;
  @Input() cambioTitolo = '';
  @Input() downloadTDKey = false;
  @Input() keyWorkspace = false;
  @Input() listaWorkSpaces;
  @Input() indirizzoServer;
  @Input() righePerPaginareAutomaticamente = 100;
  @Input() backToSelectedKey = false;
  @Input() filtroVisibile = false;
  @Input() messaggioWarning = '';
  @Input() pulisceCookieCH = '';
  @Input() selectAll = true;
  @Input() numeroRigheDVisualizzare;
  @Input() misureAddizionaliTCRUN;
  @Input() gestisceComboTramiteCookie = true;
  @Input() metteInPausaGrigliaDaAutoRun = undefined;
  @Input() pageSelectorVisibile: boolean = false;
  @Input() pageEmptyVisibile: boolean = false;
  @Input() scrollAllaRiga;
  @Input() impostaMisure;
  @Input() nonConvertireCuspidi = false;
  @Input() tcRun2Refresh = false;
  @Input() tcRun2RefreshAttivo = false;
  @Input() downloadTcRun = false;
  @Input() selezionaTuttiPerFiltro = true;
  @Input() tastoCopia = false;
  @Input() listaElementi = false;
  @Input() sortMultiplo = true;
  @Input() tastoAI = false;
  // @Input() tastoAITutte = false;
  // @Input() puliziaOggettoGriglia;
  @Input() limitaRighe = undefined;
  @Input() actSet = '';
  @Input() tooltipDelete = 'Delete';
  @Input() tastoMoveToPointVisibile = false;
  @Input() coloreSfondoEliminazione = '#9f1f1f';
  @Input() titoloEliminazione = 'Are you sure want to remove?';
  @Input() coloreTestoEliminazione = '#fbf7f7';
  @Input() scriveQuanteSuEliminazione = false;
  @Input() tcRunInfoTitle = 'Tc Run Info';
  @Input() downloadTDTitle = 'Download TD';
  @Input() modalitaTDDownload = 'selezionato';
  @Input() mistralFilters = false;
  @Input() tooltipCopy = 'Copy';
  @Input() tastoSpreadSheet = false;
  @Input() iconaFolderGroupVisibile = false;
  @Input() eseguiAutoFitAutomatico = false;
  // Icone della barra superiore da nascondere (nomi separati da virgola). Può arrivare come input oppure nelle
  // GridProperty dei dati (IconExcludedList); se ci sono entrambe valgono tutte e due le liste
  @Input() IconExcludedList = '';
  iconeEscluseDaDati = '';

  get iconeEscluse(): string {
    return [this.IconExcludedList, this.iconeEscluseDaDati].filter(l => l).join(',');
  }

  @Output() pausaGrigliaDaAutoRunEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() itemSelected: EventEmitter<any> = new EventEmitter<any>();
  // @Output() stateChanged: EventEmitter<State> = new EventEmitter<State>();
  // @Output() editClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() addClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() delClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() detailClicked: EventEmitter<string> = new EventEmitter<string>();

  @Output() cellClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() stateChange: EventEmitter<Array<PanelBarItemModel>> = new EventEmitter<Array<PanelBarItemModel>>();
  @Output() refresh: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() resetLayout: EventEmitter<string> = new EventEmitter<string>();
  @Output() lastSelectedOfTree: EventEmitter<string> = new EventEmitter<string>();
  @Output() lastSelectedOfGrid: EventEmitter<string> = new EventEmitter<string>();
  @Output() newKeyPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() copyKeyPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteKeyPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteKeyPressed2: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteKeyTcRunPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() addKeyPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeKeyPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() editKeyPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() editKeyNPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() confirmKeyPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() runKeyPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() processKeyPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() infoKeyPressed: EventEmitter<string> = new EventEmitter<string>();
  @Output() clickSelezioneSuCheckRiga: EventEmitter<any> = new EventEmitter<any>();
  // @Output() pubblicazioneRigheSelezionate: EventEmitter<any> = new EventEmitter<any>()
  @Output() detectFineDragDrop: EventEmitter<any> = new EventEmitter<any>();
  @Output() detectCambioPagina: EventEmitter<any> = new EventEmitter<any>();
  @Output() detectSetDelta: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickOnMenu: EventEmitter<any> = new EventEmitter<any>();
  @Output() synchroniseEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() dimensioniGrigliaEmit: EventEmitter<any> = new EventEmitter<any>();
  // @Output() detectCambioItemsPerPagina: EventEmitter<number> = new EventEmitter<number>();
  @Output() excelEventiEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() numeroRighePagina: EventEmitter<number> = new EventEmitter<number>();
  @Output() clickSuIconaEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() stoPassandoSulGrafico: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addToActSetEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() downloadTDEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() keyWorkspaceEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() backToSelectedEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() rePlayKeyPressed: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickSuGrafico: EventEmitter<any> = new EventEmitter<any>();
  @Output() editTicketPressed: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() deselectedAllRows: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedAllRows: EventEmitter<any> = new EventEmitter<any>();
  @Output() includeClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() excludeClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickSuComboMisura: EventEmitter<any> = new EventEmitter<any>();
  @Output() aperturaFiltroEventi: EventEmitter<string> = new EventEmitter<string>();
  @Output() aperturaTcRunInfo: EventEmitter<string> = new EventEmitter<string>();
  @Output() pageSelectorEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() pageEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() refreshTcRunEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() downloadTcRunEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() pasteEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() getTcRunFilesKeyTcRunPressed: EventEmitter<any> = new EventEmitter<any>();
  @Output() ritornoQueryAI: EventEmitter<any> = new EventEmitter<any>();
  @Output() ritornoDimensioniColonne: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveToPointEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitAITutte: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickSuMistralFilter: EventEmitter<string> = new EventEmitter<string>();
  @Output() spreadSheetEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() groupClickEmit: EventEmitter<string> = new EventEmitter<string>();
  
  // @ViewChild(DialogComponent, {static: true}) errorMsg: DialogComponent;
  @ViewChild(TooltipDirective, {static: false}) public tooltipDir: TooltipDirective;
  @ViewChild('divContenitore', {static: true}) public divConten: ElementRef;
  @ViewChild('gridMenu', { static: true })  public gridContextMenu: ContextMenuComponent;
  @ViewChild('riga', {static: true}) public divRiga: ElementRef;
  @ViewChild('testo', {static: true}) public inputTesto: ElementRef;

  @ViewChild('GridGenVirtuale', {static: false}) public GridVirtuale: GridComponent; //  QueryList<GridComponent>;
  @ViewChild('GridGenNormale', {static: false}) public GridNormale: GridComponent; // QueryList<GridComponent>;
  // @ViewChild('GridGenVirtuale', {static: false}) public GridVirtualeElement: ElementRef;
  // @ViewChild('GridGenNormale', {static: false}) public GridNormaleElement: ElementRef;
  public GridGenInterna: GridComponent;

  elaborazioneInCorso = false;
  toolbarVisibile2 = true;
  altezzaRiga = -1;
  vecchiaOra = -1;
  // subscribeAutoFit;
  disegnaDivAttesa = false;
  clickatoSuIcona = false;
  righePerAutoFit;
  filtroAttivo;
  CodiceGriglia;
  tastoPaste = false;
  tastoAiTutte = false;

  excelEventi2 = false;
  rigaSelezionataPerDelta;

  dimeXGriglia = -1;
  dimeYGriglia = -1;
  public quantePagine = 2;
  paginaAttuale = 1;

  deveFareAutoFit = false;
  sceltaFilter = false;
  oldAutoFit = -1;
  tastoAI2 = false;

  TitoloTastoNew = 'New';
  TitoloTastoRemove = 'Delete';

  appoggioRighePerCollassamento = -1;
  /* selectableSettings;

  settaSelectable() {
    this.selezioneMultipla2 = false;

    this.selectableSettings = {
      checkboxOnly: this.eliminaSelezioniSuClickRiga,
      mode: this.selezioneMultipla2 ? 'multiple' : 'single',
      // drag: this.drag
    };
    logConsole('Selectable settings:', this.selectableSettings);
  } */

  /* filtroAttivo2 = '';
  filtroAttivoCol1 = '';
  filtroAttivoCol2 = '';
  filtroAttivoCol3 = '';
  filtroAttivoCol4 = ''; */
  
  mascheraTicketAperta = false;
  titoloTicket = '';
  descTicket = '';
  datiTicket;
  valoreDefaultTicket;
  selezioneTicket = 'Info';
  oldDataAutoColumns = -1;

  // warningVisualizzato = false;

  vecchioTMS = -1;
  inizioTMS = -1;
  /* presoStileCella;
  presoStileCella2;
  presoValoreCella;
  haCaricato = false;
  vecchioRows; */
  ultimoAperto = false;
  aperteIcone = false;

  altezzaRigaInterna = new Array(); // '0px';

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  act_set = '';

  private contextItem: any;

  private currentSubscription: Subscription;

  dimeArea1 = 0;
  dimeArea2 = 100;
  dimeArea3 = 0;
  dimeArea4 = 0;
  paginabile2 = undefined;

  premutoShiftSuSelezione;
  record = 0;
  appoggioValori;
  selectedRow: string = '';

  multipleSelection: SelectableSettings;
  modoMultiplo: SelectableMode = 'multiple';
  modoSingolo: SelectableMode = 'single';

  grigliaVisibile = true;

  toConfirm;
  allRowsSelected;
  dimeTD;
  htmlCode = '';
  collassaTutto2 = false;
  espandiTutto2 = false;
  // possoSelezionareTutto = false;

  // COLUMN HIDER
  showColumnHiderAndOrderGrid = true;
  showColumnHideFlag = false;
  // columnsApp;
  // columnsApp2;
  columnsAppFiltered;
  columnsAppFilteredNomi;
  // modifiedColumns = false;
  hideEmptyColumns = 'true';
  filterForColumn;
  // COLUMN HIDER

  // EDITING
  editableCell;
  appoTake;
  editable;
  editMode;
  lastEdited = -1;
  gridDataBeforeEditing;
  // Serializzazione delle ultime righe ricevute con datiNuovi, per non ridisegnare se non sono cambiate
  ultimaFirmaDatiNuovi: string;
  comboValues = [];
  lookUp;
  checkListRowsSel;
  checkListRowsUnsel;
  colSelected;
  rowSelected;
  editGridOn = false;
  dontSave = false;
  lookUpValues = [];
  lookUpNames = [];
  rowsEdited = false;
  editableRow = [];
  deletableRow = [];
  // EDITING

  isReloading;
  righeTotali = -1;
  righeRecordset = -1;

  originalFieldNames = [];
  lastPressed = '';
  days = [0, 1, 2, 3, 4, 5, 6, 7];
  days_day = [0];

  campoComboPresente = false;
  quantiNumeri = new Array();
  // comboVisibile = new Array();
  // numeroSelezionato = new Array();
  // vecchieSelezioni = [{}, {}, {}, {}];

  @Input()
  set viewRow(num) {
    // logConsole('Take 1', num);
    this.take = +num;
    this.numeroRighePagina.emit(this.take);
    // logConsole('Settaggi pagina griglia ' + this.maskName + ': set view row', this.take);
  }

  public rowButtonsConfig2 = {
    showHeader: false,
    showAddnew: true,
    showFilter: false,
    showEdit: false,
    showDelete: false,
    showDetails: false,
    showCopy: false,
    showRun: false,
    showPause: false,
    showStop: false,
    showInfo: true,
    showRefresh: false,
    showRequests: false,
    showSearch: false
  };

  showSettedFilter = false;

  pausaGrigliaDaAutorun = undefined;
  pausaGrigliaAttiva = false;

  confirmKeyVisibile2;
  newKeyVisibile2;
  editKeyVisibile2;
  editKeyVisibileN2;
  deleteKeyVisibile2;
  deleteKeyTcRunVisibile2;
  deleteKeyVisibile3;
  deleteKeyTcRunVisibile3;
  addKeyVisibile2;
  removeKeyVisibile2;
  copyKeyVisibile2;

  columns: ColumnANTS[];
  // columnsOrdered: string[];
  originalColumns: ColumnANTS[];
  selectedElement;
  selectionIsChanged = false;
  dateNow: Date = new Date();
  timer0Id: string;
  TcRunForParameters;
  // timer1Id: string;
  lastSelected;
  gridData;
  fieldNames: string[];
  fieldNamesForInfo: string[];
  fieldNamesForInfoKey: string[];
  fieldNamesForDescription: string[];
  public showPopup = false;
  showCheckList = false;
  public showPopupGrid = false;
  filtroDaPassare = '';

  public textInfo;
  // public textInfoGrid;

  public spanIcon;
  // public logText;
  // logColor;
  isPaused;
  public title2;

  public mySelection: number[] = [];

  // public OK_COUNT_LIST: number[];
  // public FAILED_COUNT_LIST: number[];
  // public ABORTED_COUNT_LIST: number[];
  // public DAYS_AGO_LIST: number[];
  // public DIFFERENCE: number[];
  public sOK: number[][];
  public sABORT: number[][];
  public sFAILED: number[][];
  public sOK_DAY: number[][];
  public sABORT_DAY: number[][];
  public sFAILED_DAY: number[][];
  public sOTHER_DAY: number[][];

  public righeCst;
  public righeTEM;
  public righeHistCat;
  public righeHist;
  // caricatoCst = false;
  public minToMax;
  // public sDIFFERENCE: number[][];

  public numberOfDays = 0;
  public numberOfLatestIterations = 0;
  public numberOfRows = 2;

  public isAlreadyLoaded = false;

  gridSettings: GridSettings;
  loadedGridSettings;

  requestParameterList;
  showPopupParameters = false;
  lastColor = '#FFF';
  tcRunIdRequest;

  eliminaSelezioniSuClickRiga2 = true;

  permetteDragDrop2;
  // showPopupRequests = false;

  // per number e numeric il tipo dovrebbe essere numeric
  // abbiamo messo text per gestire il filtro numerico anche con 'contains'
  private dataTypeEnum = new Map([
    ['string', 'text'],
    ['number', 'numeric'],
    ['numeric', 'numeric'],
    ['date', 'text'],
    ['boolean', 'boolean']
  ]);

  conf = '';

  pageable;
  pageableList = [10, 25, 50]; // , 100, 200, 500];
  pageableListToAssign = [];

  public pageableValues = {
    type: 'input',
    // buttonCount: 10,
    info: true,
    pageSizes: [],
    numeric: false,
    alwaysVisible: false
  };

  public take = 25;
  public skip = 0;
  public sort = [];
  public filter = undefined;

  // myTimer;
  // stopTimer = false;
  // timerActive = false;

  oldTakeValue = -1;

  // tooltipLogText = '';
  public showRowNum;
  tsRefresh: number = null ;
  // subscribe;
  // subscribeGrid;

  // lastMousePosition;
  // divGridPosX;
  // divGridPosY;

  // ICON ON MENU
  /* styleMaximized1 = {
    // 'border': '1px solid #a0a',
    'padding-bottom': '2px',
    'overflow': 'auto',
    'white-space': 'nowrap',
    'width': '33%'
  };

  styleTitWithoutIcon1 = {
    // 'border': '1px solid #0a0',
    'padding-bottom': '2px',
    'text-align': 'center',
    'white-space': 'nowrap',
    'margin-top': '0px',
    'padding-top': '8px !important',
    'overflow-x': 'auto',
    'overflow-y': 'hidden',
    'width': '33%'
  };

  styleMaximized2 = {
    // 'border': '1px solid #00a',
    'text-align': 'right',
    'overflow': 'auto',
    'white-space': 'nowrap',
    'width': '33%'
  };

  styleMinimizedLeft = {
    // 'border': '1px solid #0a0',
    'text-align': 'left',
    'white-space': 'nowrap',
    'position': 'absolute',
    'left': '3px',
    'overflow-y': 'auto',
    'overflow-x': 'hidden',
    'max-height': '150px',
    // 'background-color': '#f6f6f6',
    'width': '30px',
    'z-index': '1099',
    'display': 'grid',
    'top' : '30px',
    'border': '1px solid #999',
    'background-color': '#f6f6f6'
  };

  styleTitMinimized1 = {
    // 'border': '1px solid #a00',
    'text-align': 'center',
    'white-space': 'nowrap',
    'margin-top': '0px',
    'padding-top': '8px !important',
    'left': '3px',
    'overflow': 'auto',
    'max-height': '30px',
    // 'background-color': '#f6f6f6',
    'width': '70%',
    'z-index': '1099',
    'display': 'grid',
    'top' : '30px'
  };

  styleMinimized2 = {
    // 'border': '1px solid #0aa',
    'text-align': 'right',
    'white-space': 'nowrap',
    'position': 'absolute',
    'right': '10px',
    'overflow-y': 'auto',
    'overflow-x': 'hidden',
    'max-height': '150px',
    'width': '30px',
    'z-index': '1099',
    'display': 'grid',
    'top' : '30px',
    'border': '1px solid #999',
    'background-color': '#f6f6f6'
  }; */
  // eliminaSelezioniSuClickRiga2 = true;

  clickOnMenu1 = false;
  clickOnMenu2 = false;
  // minimized = true;
  // ICON ON MENU

  showedSearch = false;
  // tcRunForSearch;

  eventSimTree: Array<any>;
  eventSimTreeOrd;

  groups: GroupDescriptor[];
  groups2 = new Array();
  raggruppabileVar = false;
  gridView: DataResult;

  // ManualResize2;

  warning = '';
  timerWarning;

  selezioneMultipla2 = false;

  public listItemsPerRowNum: Array<Item> = [
    { text: '50', value: 1 },
    { text: '100', value: 2 },
    { text: '500', value: 3 },
    { text: '1000', value: 4 },
    { text: '5000', value: 5 },
    { text: '10000', value: 6 },
    { text: '20000', value: 7 },
    { text: '50000', value: 8 }
  ];

  public mySelectionKey(context: RowArgs): string {
    /* if (!this.selezioneMultipla) {
      const s: string = context.dataItem.CODE + ' ' + context.dataItem.ICC_ID + ' ' +
        context.dataItem.ID + ' ' + context.dataItem.TS_ID + ' ' +
        context.dataItem.TC_RUN_ID + ' ' + context.dataItem.TS_RUN_ID + ' ' +
        context.dataItem.DAY + ' ' + context.dataItem.NAME;

        // this.scriveLog('mySelection', s);

      if (s !== 'undefined undefined undefined undefined undefined undefined undefined undefined') {
        return s;
      } else {
        return ' ' + context.index;
      }
    } else { */
      if (context && context.dataItem) {
        // this.scriveLog('MySelectionKey', context.dataItem.ROW_ID);
        return context.dataItem.ROW_ID;
      } else {
        return 'undefined';
      }
    // }
  }

  resettaPagina(daDove) {
    // alert('Imposto pagina 0');
    if (this.gridData && this.gridSettings) {
      const pAtt = Math.round(this.gridSettings.state.skip / this.take) + 1;
      const pMax = Math.round(this.gridData.length / this.take);

      this.scriveLog('RESET: DA DOVE', daDove);
      this.scriveLog('RESET: TAKE', this.take);
      this.scriveLog('RESET: PAGE SIZE', this.pageSize);
      this.scriveLog('RESET: SKIP', this.gridSettings.state.skip);
      this.scriveLog('RESET: Pagina Attuale', pAtt);
      this.scriveLog('RESET: RIGHE', this.gridData);
      this.scriveLog('RESET: Pagine max', pMax);
      // logConsole('RESET: Pagina Attuale su ants grid: ', daDove);
      this.paginaAttuale = 1;
  
      if (pAtt > pMax) {
        const qualePagina = 1;
        const dove = (this.take * (qualePagina - 1));
        const event = {skip: dove, take: 25};
        this.scriveLog('RESET: Nuova pagina', event);
        logConsole('Skip 2 su ants grid: ', dove, this.skip);
        this.skip = dove;
        this.gridSettings.state = event;

        const tm = setTimeout(() => {
          clearTimeout(tm)

          const ritorno = {
            take: event.take,
            skip: event.skip,
            pagina: 1
          }

          this.detectCambioPagina.emit(event);
        }, 10);
      }
    }
  }

  ultimaVoltaSetPageNumber = -1;

  setPageNumber(n, daDove) {
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaSetPageNumber < 1000 && this.ultimaVoltaSetPageNumber !== -1) {
      logConsole('SET PAGE NUMBER ants grid: Esco per query troppo veloce');

      return;
    }
    this.ultimaVoltaSetPageNumber = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    const totalPages = Math.ceil(this.righeTotali / this.take);
    // logConsole('SET PAGE NUMBER ants grid 1:', totalPages, this.righeTotali, n);

    if (n < 1) {
      n = 1;
    }

    if (n > totalPages) {
      n = totalPages;
    }

    if (n > 0) {
      this.paginaAttuale = n;
      this.skip = (n - 1) * this.take;
      // logConsole('SET PAGE NUMBER ants grid 2:', totalPages, this.righeTotali, this.skip, n);
    } else {
      this.paginaAttuale = 1;
      this.skip = 0;
      // logConsole('SET PAGE NUMBER ants grid 3:', totalPages, this.righeTotali, this.skip, n);
    }

    this.gridSettings.state.skip = this.skip;

    /* logConsole('SET PAGE NUMBER ants grid 4:', {
      n,
      daDove,
      paginaAttuale: this.paginaAttuale,
      skip: this.skip,
      take: this.take
    }); */
  }

  /* @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
      this.lastMousePosition = event;
  }; */

  constructor(
    private renderer: Renderer2,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private sr: DomSanitizer,
    private http: ExternalHttpClient,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private zone: NgZone,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    private textMeasureService: TextMeasureService
  ) {
    /* this.getJSON().subscribe(data => {
      // Utils.indirizzoServer = JSON.parse(data._body).indirizzoServer;
      // Utils.linkIcone = JSON.parse(data._body).linkIcone;
      // this.scriveLog(Utils.indirizzoServer);

      const b = JSON.parse(data._body);
      // this.scriveLog(b.Proxy.toUpperCase());
      AntsGridLibraryComponent.serverPostRest = b.serverPostRest;
    }); */

    const s: State = { filter: undefined, group: [], skip: 0, sort: [], take: 25 };

    const ccc = Array<ColumnSettings>();
    const cc: ColumnSettings = { field: '',  title: '',  filterable: false,  _width: 40 };
    ccc[0] = cc;

    this.gridSettings = { state: s, filtered: false, columnsConfig: ccc };

    this.leggeCookies();

    /* const tm = setTimeout(() => {
      this.readAndSetGridSettings();
    }, 100);

    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
    this.subscribe = Observable.timer(0, 60000)
      .take(32000)
      .subscribe(() => {
        this.callback();
    }); */

    const tm = setTimeout(() => {
      clearTimeout(tm)
      this.callback();
    }, 60000);
  }

  /* public getJSON(): Observable<any> {
    // this.scriveLog(window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }
    // this.scriveLog(indirizzo);
    return this.http.get(indirizzo);
  } */

  setHowManyDays(h) {
    if (howManyDays === -1) {
      howManyDays = h;
    }
  }

    // ICON STYLE
    getIconClass1() {
      /* if (this.minimized === undefined || this.minimized === false) {
        return 'col-md-4 c-slim';
      } else {
        return '';
      } */
    }

    getIconClassTit() {
      /* if (this.minimized === undefined || this.minimized === false) {
        return 'col-md-2 c-slim';
      } else {
        return 'col-md-10 c-slim';
      } */
    }

    getIconClass2() {
      /* if (this.minimized === undefined || this.minimized === false) {
        return 'col-md-5';
      } else {
        return '';
      } */
    }

    /* getIconStyle1() {
      if (this.minimized === undefined || this.minimized === false) {
        return this.styleMaximized1;
      } else {
        return this.styleMinimizedLeft;
      }
    }

    getIconStyleTit() {
      if (this.minimized === undefined || this.minimized === false) {
        return this.styleTitWithoutIcon1;
      } else {
        return this.styleTitMinimized1;
      }
    }

    getIconStyle2() {
      if (this.minimized === undefined || this.minimized === false) {
        return this.styleMaximized2;
      } else {
        return this.styleMinimized2;
      }
    } */

    openCloseMenu1() {
      this.clickOnMenu1 = !this.clickOnMenu1;

      if (this.clickOnMenu1) {
        this.clickOnMenu2 = false;
      }
    }

    openCloseMenu2() {
      this.clickOnMenu2 = !this.clickOnMenu2;

      if (this.clickOnMenu2) {
        this.clickOnMenu1 = false;
      }
    }
    // ICON STYLE

    public mapGridSettings(gridSettings: GridSettings): GridSettings {
      const state = gridSettings.state;

      let sgridData = this.gridData;
      if (this.paginazione === 'virtual') {
        sgridData = this.gridData.data;
      }

      return {
        state,
        filtered: gridSettings.filtered,
        columnsConfig: gridSettings.columnsConfig.sort((a, b) => a.orderIndex - b.orderIndex),
        // width: gridSettings.width,
        gridData: sgridData
      }
      // gridData: process(this.gridData, state)
    }

    CreateEmptyGrid(maskName) {
      // this.scriveLog('Create empty grid: ' + maskName);

      let s: string;
      s = '{"ColumnProperty":';
      s += '[{"headerText":"Empty","key":"Empty","dataType":"number","width":"*"';
      s += ',"place":"01","Icon":null,"hide":"false","locked":"true"}], ';
      s += '"DataTable":';
      s += '[{"Empty":"No items selected"}],';
      s += '"GridProperty":';
      s += '[{"IsFilterDisplayed":"N","GridName":"' + maskName + '","ItemsPerPage":"1","reportType":"Rep"}]';
      s += '}';
      const dd = JSON.parse(s);

      return dd;
    }

    getCookieValue(name) {
      let s: string;

      /* const cookieExists: boolean = this.cookieService.check(name);
      if (cookieExists) {
        s = this.cookieService.get(name);
      } else {
        s = '';
      } */

      s = localStorage.getItem(name);

      return s;
    }

    returnUserName() {
      return this.userName;
    }

    ultimoState;
    ultimoFiltered;

    readAndSetGridSettings() {
      // this.stampaTempi('Read and set grid settings');
      this.scriveLog('Imposto griglia');
      this.loadedGridSettings = false;
      this.gridSettings.filtered = false;

      if (this.maskName === 'report') {
        if (this.title.length > 20) {
          this.title2 = this.title.substring(0, 17) + '...';
        } else {
          this.title2 = this.title;
        }
      } else {
        this.title2 = this.title;
      }
      if (this.title2) {
        if (this.title2.startsWith('[') && this.title2.indexOf(']') > 0) {
          const fine = this.title2.indexOf(']');
          this.title2 = this.title2.substring(fine + 1).trim();
        }
      }
      // this.scriveLog(this.title);
      // this.titleEmit.emit(this.title2);

      // const s = localStorage.getItem('gridSettings_' + this.maskName);

      const clearAll = this.getCookieValue('clear_all_cookies');
      // const t = DashboardHeaderComponent.t;

      if (clearAll && clearAll === 'clear') {
        if (this.paginazione !== 'virtual') {
          localStorage.removeItem(this.returnUserName() + '_grid_' + this.maskName + '_state');
        }
        localStorage.removeItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered');

        const s: State = { filter: undefined, group: [], skip: 0, sort: [], take: 25 };

        const ccc = Array<ColumnSettings>();
        const cc: ColumnSettings = { field: '',  title: '',  filterable: false,  _width: 40 };
        ccc[0] = cc;

        this.gridSettings = { state: s, filtered: false, columnsConfig: ccc };
      } else {
        // const tm = setTimeout(() => {
          // if (this.returnUserName() !== undefined) {
            if (this.paginazione !== 'virtual') {
              // const state = this.getCookieValue(this.returnUserName() + '_grid_' + this.maskName + '_state');
              // const filtered = this.getCookieValue(this.returnUserName() + '_grid_' + this.maskName + '_filtered');
              const state = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_state');
              const filtered = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered');

              // logConsole(this.returnUserName() + '_grid_' + this.maskName + '_state');
              this.scriveLog('Imposto griglia. Cookies: ', state, filtered);

              if (state && state !== null && state !== 'undefined' && state !== 'null') { // } && state !== this.ultimoState) {
                this.ultimoState = state;
                // const tm = setTimeout(() => {
                  const st: State = JSON.parse(state);
                  const appoTake = this.take;
                  // alert('Imposto pagina 2 ' + this.take);
                  this.gridSettings.state = st;
                  this.gridSettings.state.take = appoTake;
                  this.scriveLog('Imposto griglia per stato', state);
                  this.gridSettings.filtered = true;

                  if (this.gridSettings.state.filter) {
                    this.filter = JSON.parse(JSON.stringify(this.gridSettings.state.filter));
                  }

                  // this.gridSettings = JSON.parse(JSON.stringify(this.gridSettings));
                  // this.scriveLog('Imposto griglia per filtro aperto 1->', this.filter);
                  // this.scriveLog('Imposto griglia per filtro aperto 2->', this.gridSettings);
                  // }, 1000);

                  // this.rowButtonsConfig2.showFilter = this.gridSettings.filtered;
                  // alert('Azzero Filtro ' + this.rowButtonsConfig2.showFilter);
                  // this.setFilter();

                  this.loadedGridSettings = true;
              }
              if (filtered !== null && filtered !== this.ultimoFiltered) {
                this.ultimoFiltered = filtered;
                this.scriveLog('Imposto griglia per filtro', filtered);
                // const tm = setTimeout(() => {
                  const ft: boolean = filtered === 'S' ? true : false; // JSON.parse(filtered);
                  this.gridSettings.filtered = ft;
                  this.rowButtonsConfig2.showFilter = ft;
                  // }, 1500);

                  this.loadedGridSettings = true;
              }
              /* if (state !== null && filtered !== null) {
                  this.loadedGridSettings = true;
              } */
            }
          // }

          // this.take = +this.gridSettings.state.take;
          // alert('Imposto pagina 3 ' + this.gridSettings.state.skip);
          logConsole('Skip 4 su ants grid: ', this.gridSettings.state.skip, this.skip);
          this.skip = +this.gridSettings.state.skip;

          this.sorta(this.gridSettings.state.sort, 'readAndSetGridSettings');

          this.scriveLog('Settaggi pagina griglia ' + this.maskName + ':  readAndSetGridSettings', this.take, this.skip);
          // if (this.debugTasto === true) {
            this.scriveLog('Griglia ' + this.maskName + '. Impostato take 1: ', this.take);
            this.scriveLog('Griglia ' + this.maskName + '. Impostato skip: ', this.skip);
            this.scriveLog('Griglia ' + this.maskName + '. Righe per pagina: ', this.maskName, this.take);
            this.scriveLog('Griglia ' + this.maskName + '. Skip: ', this.skip);
            this.scriveLog('Griglia ' + this.maskName + '. Filtro: ', this.filter);
          // }

          if (this.take < 5) {
            // logConsole('Take 2', 25);
            this.take = 25;
            this.scriveLog('Settaggi pagina griglia ' + this.maskName + ':  readAndSetGridSettings. Take troppo basso lo imposto a 25', this.take, this.skip);
          }

          this.numeroRighePagina.emit(this.take);

          if (this.filter && this.filter.filters && this.filter.filters.length > 0) {
            this.showSettedFilter = true;
          } else {
            this.showSettedFilter = false;
          }
        // }, 100);
      }
      // this.stampaTempi('Fatto Read and set grid settings');
  }

  ngOnInit() {
    this.onKeyDown = function(e: any) : void {
      // alert('premuto tastino');
        if (e.ctrlKey) {
          if (this.sonoDentro) {
            this.attuale = new Date().getTime();
            if (!this.timerCtrl) {
              // logConsole('Premuto ctrl');
              this.premutoCtrl = true;
              this.timerCtrl = setInterval(() => {
                const ora = new Date().getTime();
                const diff = ora - this.attuale;
                // logConsole('Tempo', diff);
                if (diff > 100) {
                  // logConsole('Spengo', diff);
                  this.premutoCtrl = false;
                  clearInterval(this.timerCtrl);
                  const tm = setTimeout(() => {
                    clearTimeout(tm);
                    this.timerCtrl = undefined;
                  }, 100);
                }
              }, 50);
            }
          } else {
            this.premutoCtrl = false;
          }
        } else {
          this.premutoCtrl = false;
        }
          /* if(($event.ctrlKey || $event.metaKey) && $event.keyCode == 67)
              logConsole('CTRL + C');
          if(($event.ctrlKey || $event.metaKey) && $event.keyCode == 86)
              logConsole('CTRL +  V'); */
      }
    
    /* for (let i = 0; i < 5; i++) {
      const n = { numero: i, testo: i > 0 ? i : '' };
      this.quantiNumeri.push(n);
    } */

    const righe = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_COPIED_ROWS');
    if (righe != null) {
      this.tastoPaste = true;
    }

    /* if (this.subscribeStart) {
      this.subscribeStart.unsubscribe();
    }
    this.subscribeStart = Observable.timer(0, 100)
      .take(32000)
      .subscribe(() => {
        if (AntsGridLibraryComponent.serverPostRest !== '') {
          this.subscribeStart.unsubscribe();

          this.parte();
        }
    }); */
    const t = setInterval(() => {
      if (AntsGridLibraryComponent.serverPostRest !== '') {
        clearInterval(t);

        this.parte();
      }
    }, 100);

    /* this.listaWorkSpaces = new Array();
    this.listaWorkSpaces.push({ FOLDER: 'Prova', SELECTED: false, NAME: 'W Pippo'});
    this.listaWorkSpaces.push({ FOLDER: 'Prova', SELECTED: false, NAME: 'W Mike Bongiorno'});
    this.listaWorkSpaces.push({ FOLDER: 'Prova', SELECTED: false, NAME: 'W Corrado'}); */

    // this.cdRef.detach();
  }

  parte() {
    // if (this.pageable) {
    //   this.pageable = this.pageableValues;
    // }
    // this.stampaTempi('Init');

    // this.tornaStatusTicket();

    this.raggruppabileVar = false;
    if (this.raggruppabile) {
      if (this.raggruppabile === true) {
        this.raggruppabileVar = true;

        let gru;
        if (this.campiPerRaggruppamento) {
          let campiRaggr = new Array(); 

          // Controllo se la variabile di raggruppamento è un array oppure una stringa che contiene ; o ,
          logConsole('Campi di raggruppamento: ' , this.campiPerRaggruppamento);
          if (Array.isArray(this.campiPerRaggruppamento)) {
            campiRaggr = JSON.parse(JSON.stringify(this.campiPerRaggruppamento));
          } else {
            if (this.campiPerRaggruppamento.indexOf(';') > -1) {
              campiRaggr = this.campiPerRaggruppamento.split(';');
            } else {
              if (this.campiPerRaggruppamento.indexOf(',') > -1) {
                campiRaggr = this.campiPerRaggruppamento.split(',');
              } else {
                campiRaggr = [this.campiPerRaggruppamento];
              }
            }
          }          

          let campiR = new Array();
          let campiR2 = new Array();

          campiRaggr.forEach(element => {
            if (element) {
              campiR.push({ field: element.trim() });
              campiR2.push({ field: element, value: "A", parentGroupKeys: [] });
            }
          });
          if (campiR.length > 0) {
            // campiR = campiR.substring(0, campiR.length - 1);
            // gru = [campiR];
            logConsole('Raggruppamento: ' , campiR, campiR2);
            this.groups = campiR;
            this.groups2 = campiR2;
          } else {
            this.groups = null;
            this.groups2 = new Array();
          }
        } else {
          this.groups = null;
          this.groups2 = new Array();
        }
      }
    }

    // GeneralComponent.t = this;
    // this.gridData = this.CreateEmptyGrid(this.title);
    this.editGridOn = false;
    this.isReloading = false;
    this.selectedRow = '';
    this.toConfirm = false;

    if (this.selezioneMultipla2) {
      this.multipleSelection =
        {
          checkboxOnly: !this.eliminaSelezioniSuClickRiga2,
          mode: this.modoMultiplo
        };
    } else {
      this.multipleSelection =
        {
          checkboxOnly: true,
          mode: this.modoSingolo
        };
    }
    // logConsole('Selezione: ', this.multipleSelection);

    // this.scriveLog('new:', this.newKeyVisibile);

    this.onOffKeysOnInit();

    if (!this.icoPath) {
      this.icoPath = 'assets/img/icons/';
    }

    switch (this.modalita) {
      case 'Griglia':
        // this.gridData = this.data;
        break;
      case 'Tree':
        // this.eventSimTree = this.data;
        // this.scriveLog(this.eventSimTree);
        // this.CreaArrayAlbero();
        break;
    }

    // const f = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_event_filter');
    // if (f === null) {
    //   this.filtroAttivo = '';
    // } else {
    //   this.filtroAttivo = f;
    // }
    const tm = setTimeout(() => {
      clearTimeout(tm)
      this.calcoloNumeroPagine();
    }, 10);
    // this.stampaTempi('Fatto Init');
  }

  setTimerForRefresh() {
    // this.stampaTempi('Set Timer for refresh');

    this.tsRefresh = Date.now();

    // if (!this.timerActive) {
      // this.timerActive = true;
    /* if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
    this.subscribe = Observable.timer(3000, 3000)
      .take(32000)
      .subscribe(() => {
          this.testRefresh();
    }); */
    const t = setInterval(() => {
      if (this.tsRefresh) {
        clearInterval(t);

        this.testRefresh();

        // alert('Fatto');
      }
    }, 3000);
    // }
  }

  testRefresh() {
    if (this.tsRefresh) {
      const actualDate: number = Date.now();

      const diffInMs: number = actualDate - this.tsRefresh;
      const diffInSeconds: number = diffInMs / 1000;

      if (diffInSeconds > 3) {
        this.tsRefresh = null;
        // this.timerActive = false;

        // this.reloadGrid();

        this.loadDatas(false);

        // this.subscribe.unsubscribe();

        // this.stampaTempi('Fatto Set Timer for refresh');
      }
    } else {
      // this.timerActive = false;
    }
  }
  
  // 10.180.245.164

  routineDiCaricamento(daDove) {
    conta('griglia: caricamento completo', this.maskName + ' (' + daDove + ')');
    this.elaborazioneInCorso = true;

    // alert('accendo 2');
    /* let vecchiaMultiSelect = false;
    if (this.selezioneMultipla) {
      vecchiaMultiSelect = JSON.parse(JSON.stringify(this.selezioneMultipla));
      this.selezioneMultipla = false;
      this.multipleSelection = 'true';
      // alert('Set vecchia multi:' + vecchiaMultiSelect);
    } */

    // this.selezioneMultipla = false;
    // this.multipleSelection = 'true';

    // this.stampaTempi('Routine di caricamento');

    /* const ora = new Date().getTime();
    if (ora - this.vecchiaOra < 500) {
      this.scriveLog('Esco da routine caricamento 1', daDove);
      return;
    }
    this.vecchiaOra = ora; */

    // this.scriveLog('Routine di caricamento');
    const inizio = Date.now();

    // this.readAndSetGridSettings();
    this.editGridOn = false;

    // const td = DashboardHeaderComponent.t;
    // this.scriveLog( td.returnUserName() + '_grid_' + this.maskName + '_hideC');
    // this.scriveLog(this.hideEmptyColumns);

    this.isAlreadyLoaded = false;
    this.numberOfDays = howManyDays;
    this.numberOfLatestIterations = latestIterations;

    if (this.limitaRighe) {
      this.data = this.sistemaDatiGrigliaPerDebug(this.data, 'RoutineDiCaricamento');
      // logConsole('Dati limitati', this.data);
    }
    
    // CONTROLLO SE C'E' IL PRIMO CAMPO NULLO
    if (this.data && this.data.ColumnProperty && this.data.ColumnProperty[0] && !this.data.ColumnProperty[0].key) {
      // alert('Errore');
      const a = new Array();
      this.data.ColumnProperty.forEach(element => {
        if (element.key) {
          a.push(element);
        }
      });
      this.data.ColumnProperty = a;
    }
    // CONTROLLO SE C'E' IL PRIMO CAMPO NULLO

    if (this.data && this.data.DataTable) {
      let riga = 0;
      this.data.DataTable.forEach(element => {
        if (!element.ROW_ID) {
          element['ROW_ID'] = riga;
        }
        riga++;
      });
    }

    // logConsole('Grid property', this.data.GridProperty);

    // if (this.isAlreadyLoaded) {
    this.onOffKeysOnInit();

    this.scriveLog('Routine di caricamento 1', daDove, this.appoggioValori.data);

    if (this.appoggioValori.data) {
      if (!this.data || !this.data.ColumnProperty || !this.data.GridProperty || !this.data.DataTable) {
        // this.gridData = null;
        // this.gridDataBeforeEditing = null;
        this.pulisceTutto();
        this.scriveLog('Esco da routine caricamento 2');
        this.elaborazioneInCorso = false;
        this.cdRef.detectChanges();
        return;
      }

      // this.scriveLog('Routine di caricamento 2');

      this.originalFieldNames = new Array();
      if (this.data.ColumnProperty) {
        this.data.ColumnProperty.forEach(element => {
          this.originalFieldNames.push(element.key);
        });
      }

      if (this.data.GridProperty !== undefined &&
        this.data.GridProperty[0] !== undefined &&
        this.data.GridProperty[0].IsEditable === 'true') {
        this.editable = true;
      } else {
        this.editable = false;
      }

      if (this.data.GridProperty !== undefined &&
        this.data.GridProperty[0] !== undefined &&
        this.data.GridProperty[0].configured_by_user === 'Y') {
        this.ciSonoColumnHidden = true;
      } else {
        this.ciSonoColumnHidden = false;
      }

      if (this.data.GridProperty !== undefined &&
        this.data.GridProperty[0] !== undefined &&
        this.data.GridProperty[0].ShowColumnSelector === 'true') {
        this.showColumnHiderAndOrderGrid = true;
      } else {
        this.showColumnHiderAndOrderGrid = false;
      }
      // this.showColumnHiderAndOrderGrid = true;

      this.CodiceGriglia = this.data.GridProperty[0].view_name;
      // logConsole('GridProperty', this.data.GridProperty[0]);
      // alert(this.CodiceGriglia);
      for (const key in this.data.GridProperty) {
        if (this.data.GridProperty.hasOwnProperty(key)) {
          if (this.data.GridProperty[key]) {
            this.rowButtonsConfig2[key] = this.data.GridProperty[key];
            if (this.rowButtonsConfig2[key].ItemsPerPage) {
              // if (!this.loadedGridSettings) {
                // logConsole('Take 4', Number(this.rowButtonsConfig2[key].ItemsPerPage));
                this.take = +this.rowButtonsConfig2[key].ItemsPerPage;
                this.scriveLog('Griglia ' + this.maskName + '. Impostato take 2-1: ', this.take, this.rowButtonsConfig2[key]);

                // logConsole('Settaggi pagina griglia ' + this.maskName + ':  routineDiCaricamento', this.take);

                if (this.take < 5) {
                  // logConsole('Take 5', 25);
                  this.scriveLog('Griglia ' + this.maskName + '. Impostato take 2-1-1: ', this.take,);
                  this.take = 25;
                  // logConsole('Settaggi pagina griglia ' + this.maskName + ':  routineDiCaricamento. Take troppo basso lo imposto a 25', this.take, this.skip);
                }
              // } else {
                // this.take = +this.gridSettings.state.take;
              // }
            }

            // if (this.debugTasto === true) {
              this.scriveLog('Griglia ' + this.maskName + '. Impostato take 2-2: ', this.take);
            // }

            this.numeroRighePagina.emit(this.take);
            // this.scriveLog('Take 2', this.maskName, this.take);
            if (!this.loadedGridSettings) {
              if (this.rowButtonsConfig2[key] !== undefined) {
                // this.scriveLog('key: ', this.rowButtonsConfig2[key]);
                // this.rowButtonsConfig2[key].IsFilterDisplayed = 'Y';
                if (this.rowButtonsConfig2[key].IsFilterDisplayed) {
                  switch (this.rowButtonsConfig2[key].IsFilterDisplayed) {
                    case 'Y':
                      this.rowButtonsConfig2.showFilter = true;
                      // alert('Filtro si 1 ' + this.rowButtonsConfig2.showFilter);
                      break;
                    case 'N':
                      this.rowButtonsConfig2.showFilter = false;
                      // alert('Filtro no 1 ' + this.rowButtonsConfig2.showFilter);
                      break;
                  }

                  const f = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered');
                  if (f === null) {
                    localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered', this.rowButtonsConfig2.showFilter ? 'S' : 'N');
                  }
                  // logConsole('Filtro impostato 1: ', this.rowButtonsConfig2[key].IsFilterDisplayed, this.rowButtonsConfig2);
                }
              }
            } else {
              this.rowButtonsConfig2.showFilter = this.gridSettings.filtered;
              // alert('Filtro no 3 ' + this.rowButtonsConfig2.showFilter);

              // logConsole('Filtro impostato 2: ', this.data.GridProperty, key, this.rowButtonsConfig2[key], this.rowButtonsConfig2, this.gridSettings.filtered);
            }
          } else {
            // if (this.debugTasto === true) {
              this.scriveLog('Griglia ' + this.maskName + '. data.gridProperty nullo:', this.data, key);
            // }
          }
        }
      }

      // this.scriveLog('1: ' + (Date.now() - inizio));

      this.fieldNames = new Array();
      let s = ';';

      const dati = this.data;
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Dati arrivati:', dati);
      // }
      /* if (this.data.DataTable) {
        dati = this.data.DataTable;
      } else {
        if (this.data) {
          dati = this.data;
        } else {
          dati = null;
        }
      } */

      // this.scriveLog('Routine di caricamento 3');

      if (dati !== null) {
        try {
          // this.scriveLog(dati);
          this.gridData = dati.DataTable;
          // Prima qui si creava una copia di ogni riga con le chiavi rinominate, mai usata: restava solo l'elenco
          // fieldNames. Ora si calcola solo quello, una volta per chiave distinta invece che per ogni cella.
          if (this.modificaCampi && Array.isArray(dati.DataTable)) {
            const chiaviViste = new Set<string>();
            dati.DataTable.forEach(row => {
              Object.keys(row).forEach(key => {
                if (chiaviViste.has(key)) {
                  return;
                }
                chiaviViste.add(key);

                let newKey = key;
                while (newKey.indexOf('<') > -1) {
                  newKey = newKey.replace('<', '');
                }
                while (newKey.indexOf('>') > -1) {
                  newKey = newKey.replace('>', '');
                }
                while (newKey.indexOf('.') > -1) {
                  newKey = newKey.replace('.', environment.replaceChar);
                }

                newKey = this.toglieNumeroIniziale(newKey);

                if (s.indexOf(';' + newKey + ';') === -1) {
                  s += newKey + ';';
                  this.fieldNames.push(newKey);
                }
              });
            });
          }
        } catch (e) {

        }
        // this.scriveLog(this.gridData);

        this.fieldNamesForInfo = new Array();
        this.fieldNamesForInfoKey = new Array();
        this.fieldNamesForDescription = new Array();
        // this.scriveLog(dati, dati.ColumnProperty);
        if (dati) {
          dati.ColumnProperty.forEach(element => {
            // this.scriveLog(element.description);
            this.fieldNamesForInfo.push(element.headerText);
            this.fieldNamesForInfoKey.push(element.key);
            this.fieldNamesForDescription.push(element.description);
          });
        }
        // this.scriveLog('fieldNamesForInfo', this.fieldNamesForInfo);

        // this.scriveLog('Punto 1. Dati: ', this.gridData);

        // this.scriveLog('2: ' + (Date.now() - inizio));

        /* let firstField = JSON.stringify(this.gridData[0]);
        if (firstField) {
          firstField = firstField.replace('{', '');
          firstField = firstField.substring(0, firstField.indexOf(':'));
          while (firstField.indexOf('""') > -1) {
            firstField = firstField.replace('""', '"');
          }
        }

        // this.scriveLog('2-1: ' + (Date.now() - inizio));
        let gr = JSON.stringify(this.gridData);
        this.record = 0;
        this.lastEdited = -1;
        // this.scriveLog('2-1-1: ' + (Date.now() - inizio));
        while (gr.indexOf('{' + firstField + '') > -1) {
          gr = gr.replace('{' + firstField + '', '{"ROW_ID": ' + this.record + ', ' + firstField + '');
          this.record++;
        }
        // this.scriveLog('2-2: ' + (Date.now() - inizio));
        this.gridData = JSON.parse(gr); */
        this.editMode = new Array();
        this.editableRow = new Array();
        this.deletableRow = new Array();
        // this.scriveLog('2-3: ' + (Date.now() - inizio));
        // this.scriveLog(this.gridData);

        let ok = true;

        if (this.gridData) {
          try {
            const a = JSON.parse(this.gridData);
          } catch (e) {
            ok = false;
          }
        }

        // this.scriveLog('GridData1', this.gridData);

        if (ok && this.gridData !== undefined) {
          if (this.gridData !== undefined && this.gridData !== null && typeof(this.gridData) !== 'string') {
            this.gridData.forEach(element => {
              this.editMode.push(false);

              if (element.IS_EDITABLE === 'Y') {
                this.editableRow.push(true);
              } else {
                this.editableRow.push(false);
              }
              if (element.IS_DELETABLE === 'Y') {
                this.deletableRow.push(true);
              } else {
                this.deletableRow.push(false);
              }
            });
          }
          // this.scriveLog('2-4: ' + (Date.now() - inizio));
          // La copia serve solo per annullare/confrontare le modifiche: prima veniva creata a ogni caricamento
          // per tutte le griglie, raddoppiando la memoria dei dati anche per quelle non modificabili
          if (this.editable) {
            this.gridDataBeforeEditing = JSON.parse(JSON.stringify(this.gridData));
          } else {
            this.gridDataBeforeEditing = undefined;
          }
        }

        // this.scriveLog('3: ' + (Date.now() - inizio));

        // this.scriveLog('Routine di caricamento 4');

        this.loadTrailis();

        // this.scriveLog('4: ' + (Date.now() - inizio));

        this.loadTrailis_Day();

        this.loadCST();
        this.loadTEM();
        this.loadHist();
        // this.scriveLog('5: ' + (Date.now() - inizio));

        // this.scriveLog('GridData2', this.gridData);

        this.lookUpValues = new Array();
        this.lookUpNames = new Array();
        if (dati.LOOKUP) {
          this.lookUp = dati.LOOKUP;

          let lastLookUp = '';
          let first = true;
          let ret = '';
          // let nodo = 0;

          if (this.lookUp) {
            this.lookUp.forEach(element => {
                if (element.CATEGORY === lastLookUp || first) {
                  if (first) {
                    lastLookUp = element.CATEGORY;
                    first = false;
                  }

                  ret += '{"CATEGORY": "' + element.CATEGORY + '", "VALUE_STR": "' + element.VALUE_STR + '"},';
                } else {
                  if (ret.length > 0) {
                    ret = '[' + ret.substring(0, ret.length - 1) + ']';
                    // if (nodo === 1095) {
                    //   this.scriveLog(ret);
                    // }
                    try {
                      ret = JSON.parse(ret);
                    } catch (e) {
                      // this.scriveLog(nodo);
                      ret = '';
                    }
                  }

                  if (ret !== '') {
                  const nn = JSON.parse('[{"CATEGORY": "' + lastLookUp + '"}]');
                  this.lookUpNames.push(nn);
                  this.lookUpValues.push(ret);

                  lastLookUp = element.CATEGORY;
                  ret = '{"CATEGORY": "' + element.CATEGORY + '", "VALUE_STR": "' + element.VALUE_STR + '"},';
                }
              }
                // nodo++;
            });

            if (ret.length > 0) {
              ret = '[' + ret.substring(0, ret.length - 1) + ']';
              ret = JSON.parse(ret);
            }

            const n = JSON.parse('[{"CATEGORY": "' + lastLookUp + '"}]');
            this.lookUpNames.push(n);
            this.lookUpValues.push(ret);
          }
        } else {
          this.lookUp = null;
        }

        // this.scriveLog('Routine di caricamento 5');

        if (dati.ColumnProperty && dati.ColumnProperty !== undefined) {
          // ELIMINAZIONE CAMPI UGUALI
          const col = new Array();
          let colName = '';

          if (dati) {
            dati.ColumnProperty.forEach(element => {
              if (colName.indexOf(';' + element.key + ';') === -1) {
                col.push(element);
                colName += ';' + element.key + ';';
              }
            });
            dati.ColumnProperty = col;
            // this.scriveLog(col);
            // ELIMINAZIONE CAMPI UGUALI

            // const t = DashboardHeaderComponent.t;

            /* if (this.maskName === 'report') {
              const tr = ReportMainComponent.t;
              const ah = AdHocComponent.t;

              if (tr || ah) {
                let tt;
                if (tr) {
                  tt = tr.titleReport;
                } else {
                  tt = ah.titleOrderKey;
                }
                while (tt.indexOf(' ') > -1) {
                  tt = tt.replace(' ', '');
                }
                while (tt.indexOf(':') > -1) {
                  tt = tt.replace(':', '');
                }
                while (tt.indexOf('<') > -1) {
                  tt = tt.replace('<', '');
                }
                while (tt.indexOf('>') > -1) {
                  tt = tt.replace('>', '');
                }
                if (tt.length > 15) {
                  tt = tt.substring(0, 14);
                }

                ss = localStorage.getItem(t.returnUserName() + '_grid_' + this.maskName + '_' + tt + '_order');
              }
            } else {
              ss = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_order');
            }*/
            // this.scriveLog('Colonne ordinate lette:', ss);
            /* const ss = this.cookieOrder;
            if (ss !== undefined && ss !== 'undefined' && ss !== null) {
              this.orderColumnsByCookie(ss);
            } */

            this.createColumns(dati);
          }
        }

        // this.scriveLog('COLUMNS:');
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Colonne:', this.columns);
        // }

        /* if (this.columns) {
          this.columnsApp2 = JSON.parse(JSON.stringify(this.columns));
        } */
        // this.originalColumns = this.columns; *TOLTO*

        // RIMESSO
        // this.columnsOrdered = new Array();
        this.columnsAppFilteredNomi = new Array();
        // logConsole('***', this.columns);
        /* if (this.data.ColumnProperty) {
          this.data.ColumnProperty.forEach(element => {
            if (element.hide !== 'true') {
              this.columnsOrdered.push(element.key);
            }
          });
        }
        if (this.columns) {
          this.columns.forEach(element => {
            // if (!element.hidden) {
              this.columnsOrdered.push(element.field);
            // }
          });
        } */
        if (this.columns) {
          let conta = 0;
          this.columns.forEach(element => {
            // if (!element.hidden) {
              element['place'] = conta;
              this.columnsAppFilteredNomi.push(element.field);
              conta++;
            // }
          });
        }
        // RIMESSO
        // const rit = this.getColumnsOrdered();

        // this.scriveLog('LETTURA COLONNE ORDINATE ' + this.maskName);
        // this.scriveLog(this.columnsOrdered);

        // this.modifiedColumns = false;

        // Check previous state changed
        // const t = DashboardHeaderComponent.t;
        // if (t !== null) {
        /* let t2 = this.title2;
        if (t2) {
          while (t2.indexOf(':') > -1) {
            t2 = t2.replace(':', '');
          }
          while (t2.indexOf(' ') > -1) {
            t2 = t2.replace(' ', '');
          }
        } */
        // const columnHidden = this.getCookieValue(this.returnUserName() + '_column_' + this.maskName + '_hidden');
        /* const columnHidden = localStorage.getItem(this.returnUserName() + '_column_' + this.maskName + '_hidden');
        // alert(this.returnUserName() + '_column_' + this.maskName + '_' + t2 + '_hidden');
        if (columnHidden !== null) {
          this.ciSonoColumnHidden = true;
          // this.scriveLog(columnHidden);

          let index = 0;
          const ch = columnHidden.split(';');
          if (dati && dati.ColumnProperty)  {
            if (this.data.ColumnProperty) {
              this.data.ColumnProperty.forEach(element => {
                let h = true;
                if (ch[index] === '0') {
                  h = false;
                }
                this.columns[index].hidden = h;
                index++;
              });
            }
          }
          this.modifiedColumns = true;
        } */
        // }
        // Check previous state changed

        /* const order = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_order');
        if (order !== null) {
          logConsole('Ordinamento da cookie', order);
          // this.orderColumnsByCookie(order);
          this.columnsOrdered = JSON.parse(order);
        } */

        /* if (this.columns) { *TOLTO*
          // this.columnsApp = JSON.parse(JSON.stringify(this.columns));
          this.columnsAppFiltered = JSON.parse(JSON.stringify(this.columns));
        } */

        // this.scriveLog('LETTURA COLUMNS ' + this.maskName);
        // this.scriveLog(this.columnsAppFiltered);

        if (!this.loadedGridSettings) {
          this.setValuesForPersistance(dati.ColumnProperty, this.data.GridProperty);
        }
      }

      if (this.appoggioValori.selection) {
        this.selectionIsChanged = true;
      }

      // this.scriveLog('Routine di caricamento 6');

      if (this.appoggioValori.icoPath) {
        if (!this.icoPath) {
          this.icoPath = 'assets/img/icons/';
        }
      }

      if (this.gridData) {
        if (this.isReloading) {
          this.isReloading = false;
          logConsole('Skip 5 su ants grid: ', 0, this.skip);
          this.skip = 0;
          // logConsole('Settaggi pagina griglia ' + this.maskName + ': routineDiCaricamento', this.skip);
          // alert('Imposto pagina 4 ');
          this.gridSettings.state.skip = 0;
        }
      }

      if (this.paginazione !== 'virtual') {
        if (dati.GridProperty && dati.GridProperty[0]) {
          if (dati.GridProperty[0].ItemsPerPageMax) {
            const maxValue: number = dati.GridProperty[0].ItemsPerPageMax;
            this.pageableListToAssign = new Array();
            if (this.pageableList) {
              this.pageableList.forEach(element => {
                const value: number = element;
                if (value <= maxValue) {
                  this.pageableListToAssign.push(element);
                }
              });
            }
          } else {
            this.pageableListToAssign = this.pageableList;
          }
        } else {
          this.pageableListToAssign = this.pageableList;
        }

        // this.scriveLog(this.pageableListToAssign);
        this.righeRecordset = dati.DataTable.length;
        /* if (this.paginazione === 'virtual') {
          // this.scriveLog(dati);
          if (dati.GridProperty.rowCount) {
            this.righeTotali = (+dati.GridProperty.rowCount);
            // if (this.debugTasto === true) {
              this.scriveLog('RIGHE TOTALI 1: ', this.righeTotali);
            }
          } else {
            if (dati.GridProperty[0].rowCount) {
              this.righeTotali = (+dati.GridProperty[0].rowCount);
              // if (this.debugTasto === true) {
                this.scriveLog('RIGHE TOTALI 2: ', this.righeTotali);
              }
            }
          }
        } else { */
          this.righeTotali = this.righeRecordset;
          // if (this.debugTasto === true) {
            this.scriveLog('Griglia ' + this.maskName + '. RIGHE TOTALI 3: ', this.righeTotali);
          // }
        // }

        // Griglia paginabile si/no
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Paginazione automatica da db:', dati.GridProperty[0].pageable)
        // }
        this.pageable = this.pageableValues;

        if (dati.GridProperty[0].pageable === true || dati.GridProperty[0].pageable === 'true') {
          // if (this.debugTasto === true) {
            this.scriveLog('Griglia ' + this.maskName + '. Imposto paginazione automatica da db');
          // }
          // this.pageable = this.pageableValues;
          if (this.righeAutomatiche === false) {
            this.pageable.pageSizes = this.pageableListToAssign;
          } else {
            this.pageable.pageSizes = false; //  this.pageableListToAssign;
          }
        } else {
          // this.take = 50;
          if (!dati.GridProperty[0].pageable || dati.GridProperty[0].pageable === 'auto') {
            // if (this.debugTasto === true) {
              this.scriveLog('Griglia ' + this.maskName + '. Righe per paginazione automatica:', this.righePerPaginareAutomaticamente);
              this.scriveLog('Griglia ' + this.maskName + '. Righe totali', this.righeTotali);
              this.scriveLog('Griglia ' + this.maskName + '. Take', this.take);
            // }
            if (+this.take > -1) {
              // if (+this.righeTotali < +this.righePerPaginareAutomaticamente) {
              if (+this.righeTotali > +this.take) {
                // if (this.debugTasto === true) {
                  this.scriveLog('Griglia ' + this.maskName + '. Imposto paginazione automatica');
                // }
                this.pageable = true;
              } else {
                // if (this.debugTasto === true) {
                  this.scriveLog('Griglia ' + this.maskName + '. Tolgo paginazione automatica');
                // }
                this.pageable = false;
              }
            } else {
              // if (this.debugTasto === true) {
                this.scriveLog('Griglia ' + this.maskName + '. Paginazione automatica inutile');
              // }
              this.pageable = false;
            }
          } else {
            // if (this.debugTasto === true) {
              this.scriveLog('Griglia ' + this.maskName + '. Tolgo paginazione automatica');
            // }
            this.pageable = false;
          }
        }
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Paginabile: ', this.pageable);
        // }
        if (!this.pageable) { this.pageable = false; }
      } else {
        // if (this.paginazione === 'virtual') {
          // this.scriveLog(dati);
          if (dati.GridProperty.rowCount) {
            this.righeTotali = (+dati.GridProperty.rowCount);
            // if (this.debugTasto === true) {
              this.scriveLog('Griglia ' + this.maskName + '. RIGHE TOTALI 1: ', this.righeTotali);
            // }
          } else {
            if (dati.GridProperty[0].rowCount) {
              this.righeTotali = (+dati.GridProperty[0].rowCount);
              // if (this.debugTasto === true) {
                this.scriveLog('Griglia ' + this.maskName + '. RIGHE TOTALI 2: ', this.righeTotali);
              // }
            }
          }
        // }
      }

      if (this.paginabile2 !== undefined && this.paginabile2 === false) {
        this.pageable = false;
      }

      // Titolo griglia
      if (this.titleDaDatiGriglia === true) {
        if (dati.GridProperty[0] && dati.GridProperty[0].GridName) {
          this.title2 = dati.GridProperty[0].GridName;
          this.title = this.title2;
          // this.titleEmit.emit(this.title);
        }
      }
      // this.scriveLog(dati);
      // this.righeTotali = -1;
      // this.righeTotali = 168407;
    }

    if (this.righeTotali === 0 && this.gridData.length > 0) {
      this.righeTotali = this.gridData.length;
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. RIGHE TOTALI 4: ', this.righeTotali);
      // }
    }

    // if (this.debugTasto === true) {
      this.scriveLog('Griglia ' + this.maskName + '. Righe totali: ', this.righeTotali, this.gridData); // , this.gridData?.length);
    // }

    gridExtern = this.gridData;

    const k = this.cookieKey;
    if (this.ricordaSelezione) {
      if (k) {
        if (this.gridData) {
          this.updateGridAfterSelection(k);

          if (this.selezioneMultipla2 && this.eliminaSelezioniSuClickRiga2) {
            const q = this.mySelection.length;
            // this.scriveLog('Selezionati: ', q);
            if (q > 0) {
              this.toConfirm = true;
            } else {
              this.toConfirm = false;
            }
          } else {
            if (this.selezioneMultipla2 && !this.eliminaSelezioniSuClickRiga2) {
              if (this.lastSelected && this.lastSelected.dataItem) {
                this.toConfirm = true;
              } else {
                this.toConfirm = false;
              }
            }
          }
        }
      } else {
        // this.scriveLog('nessun valore di chiave');
        if (this.gridData && this.gridData[0]) {
          this.selectedElement = this.gridData[0];
          this.lastSelected = this.gridData[0];

          // this.scriveLog('chiamo da 3');
          this.updateGridAfterSelection(1);
        }
      }
    }
    // GET LAST ROW CLICKED

    // this.isAlreadyLoaded = true;

    // this.scriveLog('Dati finali:', this.gridData);

    // this.scriveLog(this.columns);

    // this.gridDataAppoggio = JSON.parse(JSON.stringify(this.gridData));
    // this.setDeltaValue();
    // this.scriveLog('Prima dell\'impostazione:', this.gridData);
    // this.righeTotali = 165000;

    // logConsole('Settaggi pagina griglia ' + this.maskName + ':  RAGGRUPPABILE', this.raggruppabile, 'COLLASSA TUTTO 2', this.collassaTutto2, 'Paginazione', this.paginazione);
    if (this.raggruppabile && this.collassaTutto2) {
      // Modifica per take - 05/05/2026 08:07
      // this.appoggioRighePerCollassamento = this.take;
      // this.take = this.righeTotali;
      // this.gridSettings.state.take = this.righeTotali;
      // this.pageable = false;
      this.collapseAll();
    } else {
      if (this.raggruppabile) {
        this.expandAll();      
      }
      
      if (this.paginazione === 'virtual') {
        if (this.gridData && this.gridData.data) {
          // if (this.righeTotali === -1) {
            // if (this.gridData.data) {
            //   this.righeTotali = this.gridData.data.length;
              // this.scriveLog('RIGHE TOTALI 3: ', this.righeTotali);
            // }
          // }
          // Prima due copie complete delle righe: si usano le righe ricevute, come nella modalità normale
          this.gridData = this.gridData.data;
        }
        const g: GridDataResult = { data: this.gridData, total: this.righeTotali};
        /* for (let i = this.gridData.length + 1; i <= this.righeTotali; i++) {
          const a = { ROW_ID: i };
          this.gridData.push(a);
        } */
        // Prima un'altra copia completa: basta il risultato appena costruito
        this.gridData = g;
        if (this.righeTotali < this.righePerPaginaVirtuale) {
          this.take = this.righeTotali;
        } else {
          this.take = this.righePerPaginaVirtuale;
        }
        // logConsole('Settaggi pagina griglia ' + this.maskName + ':  routineDiCaricamento2', this.take);

        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Impostato take 3: ', this.take);
          this.scriveLog('Griglia ' + this.maskName + '. Impostati valori griglia:', this.righeTotali, this.take, this.gridData);
        // }

        this.numeroRighePagina.emit(this.take);
      }
      // this.firstStepForAutofit();
    }

    // this.scriveLog(this.gridData);

    /* let p;
    if (this.paginazione === 'virtual') {
      p = JSON.parse(JSON.stringify(this.gridData.data));
    } else {
      p = JSON.parse(JSON.stringify(this.gridData));
    }
    const c = JSON.parse(JSON.stringify(this.originalFieldNames));
    // this.scriveLog(c);
    let riga = 0;
    p.forEach(element => {
      // this.scriveLog(element);
      c.forEach(element2 => {
      // this.scriveLog('Prima', riga, element2, this.presoStileCella[riga][element2]);
        p[riga][element2] = '';
      // this.scriveLog('Dopo', riga, element2, this.presoStileCella[riga][element2]);
      });
      riga++;
    });
    this.presoStileCella = JSON.parse(JSON.stringify(p));
    this.presoStileCella2 = JSON.parse(JSON.stringify(p));
    this.presoValoreCella = JSON.parse(JSON.stringify(p));
    this.vecchioRows = undefined;
    // this.scriveLog(p, this.presoStileCella);
    const tm = setTimeout(() => {
      this.haCaricato = true;
    }, 1000); */

    // this.scriveLog(this.gridData);

    if (this.campoComboPresente && this.gestisceComboTramiteCookie === true) {
      let d;
      if (this.gridData.DataTable) {
        d = this.gridData.DataTable;
      } else {
        d = this.gridData;
      }
      if (d.data) { d = d.data; }
      // this.scriveLog(d);
      /* this.comboVisibile = new Array();

      const vecchiNumeri = localStorage.getItem(this.userName + '_' + this.maskName + '_SelectedPointInfo');
      if (vecchiNumeri !== null) {
        const vn = JSON.parse(vecchiNumeri);
        this.vecchieSelezioni = vn;

        if (d && d !== null && typeof(d) !== 'string') {
          let i = 0;
          d.forEach(element => {
            let ok = false;
            vn.forEach(element2 => {
              if (element2 && element2 !== null) {
                if (ok === false && element.DISPLAY_NAME === element2.misura) {
                  ok = true;
                  this.numeroSelezionato[element2.numeroRiga] = element2.numero;
                // } else {
                //   this.numeroSelezionato[i] = 0;
                }
              }
            });
            this.comboVisibile.push(true);

            if (ok) {
              // if (this.debugTasto === true) {
                this.scriveLog('Griglia ' + this.maskName + '. Routine di caricamento 1: ', { Selezionato: this.numeroSelezionato[i], Precedente: 0, Misura: element.DISPLAY_NAME });
              // }
              this.clickSuComboMisura.emit({ Selezionato: this.numeroSelezionato[i], Precedente: 0, Misura: element.DISPLAY_NAME });
            }
            i++;
          });
        }

      } else {
        this.numeroSelezionato = new Array();
        if (d && d !== null && typeof(d) !== 'string') {
          d.forEach(element => {
            this.numeroSelezionato.push(0);
            this.comboVisibile.push(true);
          });
        }
      } */
    }

    const fdp = localStorage.getItem(this.maskName + '_' + this.userName + '_Filter');
    if (fdp !== null) {
      this.filtroDaPassare = fdp;
    }

    /* let eseguiAutoFit = false;

    if (this.AutoResize === true) {
      eseguiAutoFit = true;
    } */

    // this.stampaTempi('Fatto Routine di caricamento');
    this.excelData = this.excelData.bind(this);

    this.readAndSetGridSettings();

    if (this.eseguitoRefresh) {
      this.scriveLog('Griglia ' + this.maskName + '. Eseguito refresh');

      this.eseguitoRefresh = false;

      // eseguiAutoFit = true;
    }

    if (this.selezioneMultipla2 || this.AutoResize) {
      // eseguiAutoFit = true;
    }

    /* if (eseguiAutoFit) {
    // if (this.debugTasto === true) {
      this.scriveLog('Griglia ' + this.maskName + '. Autofit automatico', this.AutoResize);
      // }

      // const tm = setTimeout(() => {
        // this.autoFitColumns(true, 'routineDiCaricamento'); TOLTO AUTOFIT
      // }, 1000);
    } */
   // logConsole('TC_RUN_RESULT_BY_TIME', this.columns);
    if (this.eseguiAutoFitAutomatico === true && this.columns) {
      // alert('Eseguo autofit automatico');
      /* let autofitta = false;
      
      this.columns.forEach(element => {
        if (element.field === 'TC_RUN_RESULT_BY_TIME') {
          autofitta = true;
        }
      });
      
      if (autofitta) { */
        const tm = setTimeout(() => {
          clearTimeout(tm);

          this.autoFitColumns(true, 'routineDiCaricamento'); // TOLTO AUTOFIT
        }, 1500);
      // }
    }

    this.resettaPagina('RoutineDiCaricamento');
    
    this.elaborazioneInCorso = false;
    this.cdRef.detectChanges();
  }

  pulisceTutto() {
    /* const app = this.puliziaOggettoGriglia;
    if (!app || app === null) {
      return;
    }
    const nomeCookie = 'LastCleanGrid_' + this.maskName + '_' + this.userName;
    const ultimaPuliziaFatta = localStorage.getItem(nomeCookie);
    // logConsole('Pulizia prima', ultimaPuliziaFatta);
    if (ultimaPuliziaFatta === app) {
      return;
    }
    localStorage.setItem(nomeCookie, app); */
    // logConsole('Pulizia dopo', ultimaPuliziaFatta);
    // logConsole('Pulizia', app);

    // this.grigliaVisibile = false;
    // return;

    // this.gridData = JSON.parse(JSON.stringify(this.CreateEmptyGrid(this.title)));
    // alert('Pulizia: ');

    this.gridData = undefined;
    this.data = JSON.parse(JSON.stringify(this.CreateEmptyGrid(this.title)));
    this.createColumns(this.data);

    this.scriveLog('Griglia ' + this.maskName + '. Empty grid', this.gridData, this.columns);

    // this.gridData = this.CreateEmptyGrid('EMPTY GRID');
  
    // this.gridData = undefined;
    this.gridView = undefined;
    this.righePerAutoFit = undefined;
    this.gridDataBeforeEditing = undefined;
    // this.GridGenInterna = undefined;
    this.mySelection = new Array();
    this.fieldNames = new Array();
    this.fieldNamesForInfo = new Array();
    this.fieldNamesForInfoKey = new Array();
    this.fieldNamesForDescription = new Array();
    this.editMode = new Array();
    this.editableRow = new Array();
    this.deletableRow = new Array();
    this.lookUpValues = new Array();
    this.lookUpNames = new Array();
    // this.columnsApp2 = undefined;
    this.originalColumns = this.columns;
    // this.columnsOrdered = new Array();
    // this.columnsApp = undefined;
    this.columnsAppFiltered = undefined;
    this.columnsAppFilteredNomi = undefined;
    this.pageableListToAssign = new Array();
    this.righeRecordset = -1;
    // this.columns = undefined;
    // this.GridNormale = undefined;
    // this.GridVirtuale = undefined;
    this.erroreDati = '';        

    const tt = setTimeout(() => {
      clearTimeout(tt);

      this.grigliaVisibile = true;
    }, 1000);
  }

  showTooltip_vecchio(e: MouseEvent): void {
    const element = e.target as HTMLElement;
    if (element.nodeName === 'DIV') {
      // this.scriveLog('DIV:', element.id);
      if (element.id === 'cella') {
        if (element.offsetHeight < element.scrollHeight ||
            element.offsetWidth < element.scrollWidth) {
            this.tooltipDir.toggle(element);
        } else {
            this.tooltipDir.hide();
        }
      }
    } else {
      this.tooltipDir.hide();
    }
  }

  modalitaTDDownload2 = 'selezionato';
  iconaFolderGroupVisibile2 = false;

  ngOnChanges(changes: any) {
    // this.stampaTempi('On Changes');

    let effettuaRicaricamentoGriglia = false;
    let chiECheEffettuaRicaricamento = '';
    let nonAggiornare = false;
    // logConsole('Pulizia', this.ultimaPuliziaFatta, changes);
    // this.scriveLog('Modalità: ', this.modalita);
    // this.scriveLog('Libreria OnChange: ', changes);

    if (changes.debug) {
      if (changes.debug.currentValue !== undefined) {
        // this.debugTasto = changes.debug.currentValue;

        // if (this.debugTasto === true) {
        //   this.scriveLog('Griglia ' + this.maskName + '. Debug: ', this.debugTasto);
        // }
        this.debug2 = changes.debug.currentValue;
      }
    }

    if (changes.selezioneMultipla) {
      if (changes.selezioneMultipla.currentValue !== undefined) {
        this.selezioneMultipla2 = changes.selezioneMultipla.currentValue;
        if (this.selezioneMultipla2) {
          this.multipleSelection =
            {
              checkboxOnly: !this.eliminaSelezioniSuClickRiga2,
              mode: this.modoMultiplo
            };
        } else {
          this.multipleSelection =
            {
              checkboxOnly: true,
              mode: this.modoSingolo
            };
        }
        // logConsole('Selezione: ', this.multipleSelection);
      }
    }

    if (changes.indirizzoServer && changes.indirizzoServer.currentValue) {
      AntsGridLibraryComponent.serverPostRest = changes.indirizzoServer.currentValue;
      // alert('Indirizzo server per griglia: ' + AntsGridLibraryComponent.serverPostRest);
    }

    if (changes.actSet) {
      if (changes.actSet.currentValue) {
        this.act_set = changes.actSet.currentValue + '_';
      } else {
        this.act_set = '';
      }
    }

    if (changes.modalitaTDDownload) {
      if (changes.modalitaTDDownload.currentValue) {
        this.modalitaTDDownload2 = changes.modalitaTDDownload.currentValue;
      } else {
        this.modalitaTDDownload2 = 'selezionato';
      }
    }

    if (changes.iconaFolderGroupVisibile) {
      if (changes.iconaFolderGroupVisibile.currentValue) {
        this.iconaFolderGroupVisibile2 = changes.iconaFolderGroupVisibile.currentValue;
      } else {
        this.iconaFolderGroupVisibile = false;
      }
    }

    if (changes.sortMultiplo !== undefined && changes.sortMultiplo.currentValue !== undefined) {
      if (changes.sortMultiplo.currentValue === true) {
        this.sortSettings = {
          mode: "multiple",
          initialDirection: "asc",
          allowUnsort: true,
          showIndexes: true,
        };      
      } else {
        this.sortSettings = {
          mode: "single",
          initialDirection: "asc",
          allowUnsort: true,
          // showIndexes: true,
        };      
      }
    }

    if (changes.collassaTutto) {
      if (changes.collassaTutto.currentValue === true) {
        this.collassaTutto2 = true;
        this.fCollassaTutto();
      } else {
        this.collassaTutto2 = false;
      }
    }

    if (changes.espandiTutto) {
      if (changes.espandiTutto.currentValue === true) {
        this.espandiTutto2 = true;
        this.fEspandiTutto();
      } else {
        this.espandiTutto2 = false;
      }
    }

    if (changes.listaElementi) {
      if (changes.listaElementi.currentValue === true) {
        this.TitoloTastoNew = 'Add to list';
        this.TitoloTastoRemove = 'Remove from list'
      } else {
        this.TitoloTastoNew = 'New';
        this.TitoloTastoRemove = 'Delete'
      }
    }

    if(changes.eliminaSelezioniSuClickRiga && changes.eliminaSelezioniSuClickRiga.currentValue !== undefined) {
      this.eliminaSelezioniSuClickRiga2 = changes.eliminaSelezioniSuClickRiga.currentValue;
      if (this.selezioneMultipla2) {
        this.multipleSelection =
          {
            checkboxOnly: !this.eliminaSelezioniSuClickRiga2,
            mode: this.modoMultiplo
          };
      } else {
        this.multipleSelection =
          {
            checkboxOnly: true,
            mode: this.modoSingolo
          };
      }
    }

    // this.scriveLog(changes);
    if (changes.paginabile) {
      this.paginabile2 = changes.paginabile.currentValue;
      if (this.paginabile2 !== undefined && this.paginabile2 === false) {
        this.pageable = false;
      } else {
        this.pageable = true;
      }
    }

    if (changes.tastoAI) {
      this.tastoAI2 = changes.tastoAI.currentValue;
    }

    if (changes.metteInPausaGrigliaDaAutoRun) {
      this.scriveLog('Griglia ' + this.maskName + '. Arrivato cambio per pausa griglia da autorun: ', changes.metteInPausaGrigliaDaAutoRun.currentValue);
      this.pausaGrigliaDaAutorun = changes.metteInPausaGrigliaDaAutoRun.currentValue;
    }

    // Se nello stesso ciclo arriva anche la struttura completa, il caricamento completo (più sotto) sostituisce
    // comunque righe e colonne: l'aggiornamento parziale sarebbe lavoro (e ridisegno) buttato
    const arrivaAncheStruttura = !!(changes.data && changes.data.currentValue);
    if (changes.data) {
      this.ultimaFirmaDatiNuovi = undefined;
    }

    if (changes.datiNuovi && changes.datiNuovi.currentValue && !arrivaAncheStruttura) {
      this.grigliaVisibile = true;

      // if (!changes.data || (changes.data && !changes.data.currentValue)) {
        // this.scriveLog(changes.datiNuovi.currentValue);
        if (!changes.datiNuovi.currentValue.DataTable && typeof(changes.datiNuovi.currentValue) === 'string' && changes.datiNuovi.currentValue.indexOf('ERROR:') > -1) {
          // if (this.debugTasto === true) {
            this.scriveLog('Griglia ' + this.maskName + '. Arrivati dati parziali con errore: ', changes.datiNuovi.currentValue);
          // }

          this.erroreDati = changes.datiNuovi.currentValue;
        } else {
          // let titolo;
          let datinuovi = changes.datiNuovi.currentValue;

          // if (this.debugTasto === true) {
            this.scriveLog('Griglia ' + this.maskName + '. Arrivati dati parziali: ', datinuovi, this.gridData);
          // }
          if (this.gridData || (this.gridData && this.gridData.data)) {
            let nonProseguire = false;

            /* if (this.limitaRighe && (this.limitaRighe.numeroRighe > -1 || this.limitaRighe.numeroCampi > -1)) {
              try {
                let datiLimitati = JSON.parse(JSON.stringify(this.gridData.data)); 
                datiLimitati.DataTable = datinuovi;
                datinuovi = this.sistemaDatiGrigliaPerDebug(datiLimitati, 'DatiNuovi');
                if (!datiLimitati) {
                  nonProseguire = true;
                }
              } catch (e) {
                logConsole('Dati nuovi. Errore:', e, this.maskName, datinuovi);
                nonProseguire = true;
              }
            } */
            // logConsole('Dati nuovi', this.maskName, nonProseguire, datinuovi);

            // Righe identiche a quelle già visualizzate (tipico del refresh automatico): niente copia, ridisegno
            // e ritorno alla prima pagina. La stringa serve anche per la copia, così la serializzazione si fa una volta sola.
            const firmaDatiNuovi = JSON.stringify(datinuovi);
            if (firmaDatiNuovi === this.ultimaFirmaDatiNuovi) {
              nonProseguire = true;
              conta('griglia: righe invariate (ridisegno evitato)', this.maskName);
            } else {
              conta('griglia: aggiornamento righe', this.maskName);
            }
            this.ultimaFirmaDatiNuovi = firmaDatiNuovi;

            if (!nonProseguire) {
              // if (this.debugTasto === true) {
                this.scriveLog('Griglia ' + this.maskName + '. Arrivati dati parziali. Dati parziali vecchi');
              // }

              let passaggio = datinuovi;
              // logConsole('Arrivati dati nuovi', datinuovi);

              if (!passaggio.DataTable) { passaggio = { DataTable: passaggio }; }
              this.calcolaAltezzaRighe(passaggio);

              if (this.gridData.data) {
                // this.scriveLog('Aggiornato dati virtual', this.gridData, changes.datiNuovi.currentValue);
                this.gridData.data = JSON.parse(firmaDatiNuovi);
              } else {
                // this.scriveLog('Aggiornato dati scrollable', this.gridData, changes.datiNuovi.currentValue);
                this.gridData = JSON.parse(firmaDatiNuovi);
              }

              // if (this.debugTasto === true) {
                this.scriveLog('Griglia ' + this.maskName + '. Arrivati dati parziali. Risultante: ', this.gridData);
              // }

              if (this.paginazione !== 'virtual') {
                // this.scriveLog('Rinfrescati i dati: ', this.gridData);

                this.righeTotali = this.gridData.length;
              }

              this.prendeValoriCombo(this.gridData, 'OnChanges');

              this.resettaPagina('ArrivatiDatiNuovi');

              nonAggiornare = true;
            }
          } else {
            // if (this.debugTasto === true) {
              this.scriveLog('Griglia ' + this.maskName + '. Arrivati dati parziali. Struttura vecchia vuota.');
            // }
          }
        }
      /* } else {
        // if (this.debugTasto === true) {
          if (changes.data && changes.data.currentValue) {
            this.scriveLog('Griglia ' + this.maskName + '. Arrivati dati parziali ma arrivata anche struttura completa: ', changes.data.currentValue);
          } else {
            this.scriveLog('Griglia ' + this.maskName + '. Arrivati dati parziali ma arrivata anche struttura completa: ', changes.data);
          }
        // }
      }
    } else {
      this.scriveLog('Griglia ' + this.maskName + '. Arrivati dati parziali ma struttura vuota: ', changes.datiNuovi.currentValue, this.gridData);
      if (changes.data)  {
        this.scriveLog('Griglia ' + this.maskName + '. Arrivati dati parziali ed è presente tutto: ', changes.data);
      } */
    }

    /* if (changes.misureAddizionaliTCRUN) {
      const tm = setTimeout(() => {
        this.scriveLog('Griglia ' + this.maskName + '. Arrivate misure addizionali: ', changes.misureAddizionaliTCRUN.currentValue);
        const misure = changes.misureAddizionaliTCRUN.currentValue;
        if (this.data && this.data.DataTable) {
          this.comboVisibile = new Array();
          let i = 0;
          let vn = '';
          misure.forEach(element => {
            if (element) {
              const misura = element;
              let riga = 0;
              this.data.DataTable.forEach(element2 => {
                if (element2.CODE === misura) {
                  // logConsole('Rilevata misura ' + misura + ': Riga ' + riga + ' Numero ' + i);
                  this.numeroSelezionato[riga] = i;
                  // this.clickSuComboMisura.emit({ Selezionato: this.numeroSelezionato[riga], Precedente: 0, Misura: element.CODE });
                  vn += '{"numero": ' + i + ', "misura": "' +  element2.CODE + '", "numeroRiga": ' + riga + '},';
                }
                riga++;
              });
            }
            i++;
          });
          this.data.DataTable.forEach(element2 => {
            this.comboVisibile.push(true);
          });
          vn = vn.substring(0, vn.length - 1);
          vn = '[' + vn + ']';
          // logConsole(vn);
          this.vecchieSelezioni = JSON.parse(vn);
        }
      }, 1000);
    } */

    if (changes.pulisceCookieCH) {
      if (changes.pulisceCookieCH.currentValue && changes.pulisceCookieCH.currentValue !== '') {
        /* let t2 = this.title2;
        if (t2) {
          while (t2.indexOf(':') > -1) {
            t2 = t2.replace(':', '');
          }
          while (t2.indexOf(' ') > -1) {
            t2 = t2.replace(' ', '');
          }
        } */
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Pulizia cookie column hider', this.returnUserName() + '_grid_' + this.maskName + '_hidden');
        // }
        localStorage.removeItem(this.returnUserName() + '_column_' + this.maskName + '_hidden');
        this.ciSonoColumnHidden = false;

        /*  this.routineDiCaricamento();

        const tm = setTimeout(() => {
          this.GridGenInterna.autoFitColumns();
        }, 1000); */
      }
    }

    if (changes.messaggioWarning) {
      if (changes.messaggioWarning.currentValue && changes.messaggioWarning.currentValue !== '') {
        this.warning = changes.messaggioWarning.currentValue;
        /* this.warningVisualizzato = true;
        this.timerWarning = const tm = setTimeout(() => {
          this.warningVisualizzato = false;
        }, 3000);
        this.scriveLog(this.warning, this.title2); */
      } else {
        this.warning = '';
      }
    }

    if (changes.cambioTitolo) {
      const titolo = changes.cambioTitolo.currentValue;

      if (titolo) {
        // Titolo griglia
        this.title = titolo;
        this.title2 = titolo;
      }
    }

    /* if (changes.title) {
      const titolo = changes.title.currentValue;

      if (titolo) {
        // Titolo griglia
        this.title = titolo;
        this.title2 = titolo;
      }
    } */

    if (changes.vociTrovateJson) {
      if (changes.vociTrovateJson.currentValue) {
        if (changes.vociTrovateJson.currentValue.length === 1) {
          this.filtroAttivoPass = changes.vociTrovateJson.currentValue[0];
        }
      }
    }

    if (changes.nomiColonne) {
      if (this.columns && changes.nomiColonne.currentValue) {
        // this.scriveLog(changes.nomiColonne.currentValue);
        for (let i = 0; i < changes.nomiColonne.currentValue.length; i++) {
          if (this.columns[i] && changes.nomiColonne.currentValue[i]) {
            // this.scriveLog(changes.nomiColonne.currentValue[i] + ' -> ' + this.columns[i].title);
            this.columns[i].title = changes.nomiColonne.currentValue[i];
          }
        }
      }
    }

    if (changes.confirmKeyVisibile) {
      this.confirmKeyVisibile2 = changes.confirmKeyVisibile.currentValue;
      if (this.confirmKeyVisibile2 === true) {
        this.toConfirm = true;
      } else {
        this.toConfirm = false;
      }
      // this.scriveLog('Cambio confirm key', this.confirmKeyVisibile2);
    }

    if (changes.newKeyVisibile) {
      this.newKeyVisibile2 = changes.newKeyVisibile.currentValue;
    }

    if (changes.editKeyVisibile) {
      this.editKeyVisibile2 = changes.editKeyVisibile.currentValue;
    }

    if (changes.editKeyVisibileN) {
      this.editKeyVisibileN2 = changes.editKeyVisibileN.currentValue;
    }

    if (changes.deleteKeyVisibile) {
      this.deleteKeyVisibile2 = changes.deleteKeyVisibile.currentValue;
    }

    if (changes.delete2KeyVisibile !== undefined) {
      this.deleteKeyVisibile3 = changes.delete2KeyVisibile.currentValue;
    }

    if (changes.deleteKeyTcRunVisibile !== undefined) {
      this.deleteKeyTcRunVisibile2 = changes.deleteKeyTcRunVisibile.currentValue;
    }

    if (changes.addKeyVisibile !== undefined) {
      this.addKeyVisibile2 = changes.addKeyVisibile.currentValue;
    }

    if (changes.removeKeyVisibile !== undefined) {
      this.removeKeyVisibile2 = changes.removeKeyVisibile.currentValue;
    }

    if (changes.copyKeyVisibile !== undefined) {
      this.copyKeyVisibile2 = changes.copyKeyVisibile.currentValue;
    }

    if (changes.excelEventi !== undefined) {
      this.excelEventi2 = changes.excelEventi.currentValue;
      // this.scriveLog('Excel eventi', this.excelEventi2);
    }

    if (changes.PermetteDragDrop) {
      this.permetteDragDrop2 = changes.PermetteDragDrop.currentValue;
      // this.scriveLog(this.permetteDragDrop2);
    }

    /* if (changes.filtroAttivo) {
      this.filtroAttivo2 = changes.filtroAttivo.currentValue;
    } */

    if (changes.impostaPagina) {
      if (changes.impostaPagina.currentValue !== undefined) {
        if (!nonAggiornare) {
          const tm = setTimeout(() => {
            clearTimeout(tm)

            logConsole('Cambio pagina su ants grid/onchange. Imposta pagina: ', changes.impostaPagina, changes.impostaPagina.currentValue);
            this.setPageNumber(changes.impostaPagina.currentValue, 'Imposta Pagina da onChanges');
          }, 10);
          effettuaRicaricamentoGriglia = false;
        }
      }
    }

    /* if (changes.ManualResize) {
      if (changes.ManualResize.currentValue !== undefined) {
        if (changes.ManualResize.currentValue !== this.ManualResize2) {
          // if (this.debugTasto === true) {
            this.scriveLog('Griglia ' + this.maskName + '.  Autofit manuale. Cambiato valore: ', changes.ManualResize.currentValue, this.ManualResize2);
          // }
          this.ManualResize2 = changes.ManualResize.currentValue;

          const diff = new Date().getTime() - this.oldAutoFit;
          if (diff < 2000) {
          } else {
            this.oldAutoFit = new Date().getTime();
            
            // if (!nonAggiornare) {
            const tm = setTimeout(() => {
              clearTimeout(tm)

              this.autoFitColumns(true, 'ManualResize');
            }, 20);
          }
        }
      }
    } */

    /* if (changes.eliminaSelezioniSuClickRiga) {
      if (changes.eliminaSelezioniSuClickRiga.currentValue !== undefined) {
        this.eliminaSelezioniSuClickRiga2 = changes.eliminaSelezioniSuClickRiga.currentValue;
      }
    } */

    if (changes.impostaSelezione) {
      this.scriveLog('Imposta Selezione');
      if (typeof(changes.impostaSelezione.currentValue) === 'number') {
        this.scriveLog('Imposta Selezione numero');
        this.mySelection = [ changes.impostaSelezione.currentValue ];
        this.selectedKeysChange(this.mySelection);
      } else {
        if (typeof(changes.impostaSelezione.currentValue) === 'string') {
          this.scriveLog('Imposta Selezione stringa');
          let carattere;
          if (changes.impostaSelezione.currentValue.indexOf(',') > -1) {
            carattere = ',';
          } else {
            if (changes.impostaSelezione.currentValue.indexOf(';') > -1) {
              carattere = ';';
            } else {
              carattere = '';
            }
          }
          if (carattere !== '') {
            const s = changes.impostaSelezione.currentValue.split(carattere);
            this.mySelection = new Array();
            s.forEach(element => {
              this.mySelection.push(+element);
            });
            this.selectedKeysChange(this.mySelection);
          }
        } else {
          this.scriveLog('Imposta Selezione altro', typeof(changes.impostaSelezione.currentValue));
          this.mySelection = new Array();
          if (changes.impostaSelezione.currentValue !== undefined &&
            changes.impostaSelezione.currentValue !== null) {
            // this.scriveLog(changes.impostaSelezione.currentValue);
            try {
              changes.impostaSelezione.currentValue.forEach(element => {
                this.mySelection.push(+element);
              });
              this.selectedKeysChange(this.mySelection);
            } catch (e) {

            }
          }
          // this.scriveLog('Selezione impostata', this.mySelection);
        }
        // logConsole("SELEZIONE: ", changes.impostaSelezione.currentValue, this.mySelection);
        this.scriveLog('Imposta selezione: elimina check', this.eliminaSelezioniSuClickRiga2);

        // if (!this.eliminaSelezioniSuClickRiga) {
          if (this.mySelection && this.mySelection.length > 0) {
            this.selectedRow = JSON.stringify(this.mySelection[0]);
          }
        // }

        this.scriveLog('Imposta Selezione fine: ', this.selectedRow, this.mySelection);
        effettuaRicaricamentoGriglia = false;

        // logConsole('Imposta selezione 1: ', this.mySelection, this.selectedRow);
      }

      /* let nuovaPagina = Math.round(+changes.impostaSelezione.currentValue / this.take);
      if (nuovaPagina > -1 && changes.impostaSelezione.currentValue > -1) {
        this.scriveLog('Impostata selezione', changes.impostaSelezione.currentValue, this.take, this.skip, nuovaPagina);
        if (nuovaPagina < 1) {
          nuovaPagina = 1;
        }
        const tm = setTimeout(() => {
          this.setPageNumber(nuovaPagina);
        }, 10);
        // fai = false;
      } */
      if (this.showPopup) {
        // this.scriveLog(this.mySelection);
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Show popup: ', this.gridData);
        // }
        if (this.gridData !== undefined && this.gridData !== null && typeof(this.gridData) !== 'string') {
          this.gridData.forEach(element => {
            if (+element.ROW_ID === +this.mySelection[0]) {
              this.lastSelected = element;
            }
          });
        }
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Last selected: ', this.lastSelected);
        // }
        this.scriveInfoAVideo();
      }
    }

    if (changes.data) {
      if (this.modalita === 'Tree') {
        this.eventSimTree = changes.data.currentValue;
        this.CreaArrayAlbero();
        return;
    } else {
      // this.scriveLog('Libreria OnChange: ', changes.data);

      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Arrivata nuova struttura griglia: ', changes.data);
      // }
      if (changes.data.currentValue) {
        if (changes.data && changes.data !== null) {
          if (changes.data.currentValue.GridProperty && changes.data.currentValue.GridProperty.length > 0) {
            this.tastoAiTutte = ((changes.data.currentValue.GridProperty[0].AiReqEnabled === 'Y') ? true : false);
            // logConsole('AI Req Enabled:', this.title, changes.data.currentValue.GridProperty[0].AiReqEnabled + ': ' + this.tastoAiTutte);
            const escluse = changes.data.currentValue.GridProperty[0].IconExcludedList;
            this.iconeEscluseDaDati = escluse ? String(escluse) : '';
          } else {
            this.tastoAiTutte = false;
            this.iconeEscluseDaDati = '';
            // logConsole('AI Req Enabled Non arrivato:', this.title, this.tastoAiTutte);
          }
          // logConsole('DATI ARRIVATI', changes.data.currentValue);

          // this.scriveLog('Nuovo dataset arrivato:', changes.data.currentValue, typeof(changes.data.currentValue));
          if (changes.data.currentValue && !changes.data.currentValue.DataTable && typeof(changes.data.currentValue) === 'string' && changes.data.currentValue.indexOf('ERROR:') > -1) {
            // if (this.debugTasto === true) {
              this.scriveLog('Griglia ' + this.maskName + '. Errore dati: ', changes.data.currentValue);
            // }
            this.erroreDati = changes.data.currentValue;
          } else {
            // this.haCaricato = false;
            if (changes.data && changes.data.currentValue && typeof(changes.data.currentValue) === 'string' && changes.data.currentValue === 'empty grid') {
              // if (this.debugTasto === true) {
              // }

              this.pulisceTutto();
              
              // logConsole('PULIZIA: ', this.gridData, this.columns);
              // this.scriveLog('Creo griglia vuota', this.gridData);
              // this.routineDiCaricamento();
              effettuaRicaricamentoGriglia = true;
              chiECheEffettuaRicaricamento = 'Data 1';
            } else {
              if (changes.data.currentValue && changes.data.currentValue !== null) {
                // if (this.debugTasto === true) {
                  this.scriveLog('Griglia ' + this.maskName + '. Check dati');
                // }

                let ok = true;

                if (!changes.data.currentValue.DataTable) {
                  // if (this.debugTasto === true) {
                    this.scriveLog('Griglia ' + this.maskName + ': DataTable mancante');
                  // }
                  ok = false;
                }
                if (!changes.data.currentValue.GridProperty) {
                  // if (this.debugTasto === true) {
                    this.scriveLog('Griglia ' + this.maskName + ': GridProperty mancante');
                  // }
                  ok = false;
                }
                if (!changes.data.currentValue.ColumnProperty) {
                  // if (this.debugTasto === true) {
                    this.scriveLog('Griglia ' + this.maskName + ': ColumnProperty mancante');
                  // }
                  ok = false;
                }
                if (ok) {
                  this.righeTotali = changes.data.currentValue.DataTable.length;

                  this.risorta();

                  // if (this.debugTasto === true) {
                    this.scriveLog('Griglia ' + this.maskName + '. Dati corretti. Righe Totali: ', this.righeTotali);
                  // }
                  // this.scriveLog('RIGHE TOTALI 4: ', this.righeTotali);

                  // this.routineDiCaricamento();
                  effettuaRicaricamentoGriglia = true;
                  chiECheEffettuaRicaricamento = 'Data 2';
                } else {
                  // if (this.debugTasto === true) {
                    this.scriveLog('Griglia ' + this.maskName + '. Dati NON corretti.');
                  // }
                }
              } else {
                // if (this.debugTasto === true) {
                  this.scriveLog('Griglia ' + this.maskName + '. Dati griglia mancanti');
                // }

                this.pulisceTutto();

                // this.routineDiCaricamento();
                effettuaRicaricamentoGriglia = true;
                chiECheEffettuaRicaricamento = 'Data 3';
              }
            }
          }
        } else {
          // this.scriveLog(this.maskName + ': Pulisco griglia');
          if (changes.data && changes.data === null) {
            // if (this.debugTasto === true) {
              this.scriveLog('Griglia ' + this.maskName + '. Creazione griglia vuota');
            // }

            this.pulisceTutto();

            // this.routineDiCaricamento();
            effettuaRicaricamentoGriglia = true;
            chiECheEffettuaRicaricamento = 'Data 4';
          } else {
            // if (this.debugTasto === true) {
              this.scriveLog('Griglia ' + this.maskName + '. Griglia indefinita: ', changes.data);
            // }

            effettuaRicaricamentoGriglia = false;
          }
        }

        const state = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_gridSettings');
        this.gridSettings.state = JSON.parse(state);

        if (this.gridSettings.state === null) {
          const s: State = { filter: undefined, group: [], skip: 0, sort: [], take: 25 };
          this.gridSettings.state = s;
        }

        if (this.gridSettings.state.filter && this.gridSettings.state.filter.filters && this.gridSettings.state.filter.filters.length > 0) {
          this.gridSettings.filtered = true;
          this.rowButtonsConfig2.showFilter = true;
          this.showSettedFilter = true;
        } else {
          this.gridSettings.filtered = false;
          this.rowButtonsConfig2.showFilter = false;
          this.showSettedFilter = false;
        }

        if (this.gridSettings.state.filter && this.gridSettings.state.filter !== null) {
          this.filter = JSON.parse(JSON.stringify(this.gridSettings.state.filter));
          this.filterValue = JSON.parse(JSON.stringify(this.filter));
        } else {
          this.filterValue = { logic: "and", filters: [] };
          this.filters = [];
        }
      } else {
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Arrivata nuova struttura griglia indefinita. Non faccio nulla');
        // }

        // effettuaRicaricamentoGriglia = false;
      }
    }

      if (changes.rinfrescaGriglia) {
        if (changes.rinfrescaGriglia.currentValue) {
          // this.scriveLog('Rinfresco griglia', JSON.stringify(changes));

          this.appoggioValori = changes;
          this.appoggioValori.data = this.data;
          // this.routineDiCaricamento();
        }
      }
      if (changes.pulisceSelezione) {
        if (changes.pulisceSelezione.currentValue === 'OK') {
          this.scriveLog('Pulisco selezione righe');
          this.allRowsSelected = false;
          this.toConfirm = false;
          this.mySelection = [];
          // this.routineDiCaricamento();

          effettuaRicaricamentoGriglia = true;
          chiECheEffettuaRicaricamento = 'Data 5';
        }
      }
    }

    if (changes.numeroRigheDVisualizzare && changes.numeroRigheDVisualizzare.currentValue) {
      // if (changes.numeroRigheDVisualizzare?.currentValue?.toString() === '0') {
        this.righeTotali = changes.numeroRigheDVisualizzare.currentValue;
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Arrivate righe totali alla Griglia. ', this.righeTotali);
        // }
      // }
    }

    if (changes.scrollAllaRiga) {
      if (changes.scrollAllaRiga.currentValue || changes.scrollAllaRiga.currentValue === 0) {
        this.fScrollAllaRiga(changes.scrollAllaRiga.currentValue);
      }
    }

    if (changes.impostaMisure) {
      this.impostaMisureCombo(changes.impostaMisure.currentValue);
    }

    if (!changes.data && !changes.minimumRowModality) {
      // return;
    }

    this.appoggioValori = changes;
    if (effettuaRicaricamentoGriglia) {
      this.routineDiCaricamento('ngOnChanges ' + chiECheEffettuaRicaricamento);
    }

    // this.stampaTempi('Fatto On Changes');
    this.applicaModifiche();

    /* const tm = setTimeout(() => {
      clearTimeout(tm)
      if (this.gridData && this.gridData !== null) {
        const pagineTotali = Math.round(this.gridData.length / this.take);
        // const paginaAttuale = (this.skip / this.take) + 1;

        // logConsole('PAGGGINE: Per pagina -> ', this.take);
        // logConsole('PAGGGINE: Pagine totali -> ', pagineTotali);
        // logConsole('PAGGGINE: Pagina attuale -> ', paginaAttuale);

        logConsole('Controllo pagina. Pagine totali: ' + pagineTotali + ' - Pagina attuale: ' + this.paginaAttuale, 
          this.gridData.length, this.take);

        if (this.paginaAttuale + 1> pagineTotali) {
          this.setPageNumber(1, 'Imposta Reset Pagina');
        }
      }
    }, 10); */

    /* if (changes.puliziaOggettoGriglia) {
      if (changes.puliziaOggettoGriglia.currentValue !== undefined) {
        this.empty = true;
        this.pulisceTutto();
      }
    } */
  }

  applicaModifiche() {
    const tm = setTimeout(() => {
      clearTimeout(tm)
      if (this.cdRef) {
        try {
          this.cdRef.detectChanges();
        } catch (e) {

        }
      }
    }, 1000);
  }
  
  /* ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  } */

  createColumns(dati) {
    this.scriveLog('Griglia ' + this.maskName + '. Dati per calcolo colonne:', dati);
    /* let quanto = 12;
    if (this.DimensioneFont) {
      quanto = this.DimensioneFont;
    }
    quanto += 3;
    
    this.altezzaRigaInterna = quanto.toString() + 'px'; */
    this.calcolaAltezzaRighe(dati);

    try {
      // logConsole('Valori combo', valoriCombo);

      if (dati && dati.ColumnProperty) {
        const d = new Array();
        dati.ColumnProperty.forEach(element => {
          if (element && element.key) {
            d.push(element);
          }
        });
        // logConsole('Colonne senza impicci', d);
        const columns = d.map(column => {
          // logConsole('Colonna: ', column);
          return <ColumnANTS> {
            // idRow: this.changeStringForOrdering(column.ROW_ID),
            multiSelection: false,
            field: this.changeStringForOrdering(column.key),
            title: column.headerText?.trim(),
            editor: this.dataTypeEnum.get(column.dataType),
            filter: this.dataTypeEnum.get(column.dataType),
            hidden: this.isColumnHidden(column),
            hiddenLabel: this.isHiddenLabel(column),
            locked: this.isColumnLocked(column),
            icon: this.isIcon(column, column.Icon),
            iconName: this.isIconName(column, column.IconName),
            width: this.getColumnWidth(dati.DataTable, column),
            isEditable: this.isEdit(column),
            domain: this.getDomain(column),
            domainType: this.getDomainType(column),
            dataType: column.dataType,
            description: this.getDescription(column),
            showIconText: this.getSIT(column),
            clickEnabled: this.getClickEnabled(column),
            combo: this.getCombo(column),
            combo_value: this.getComboValue(column),
            hideIsEditable: this.getHideIsEditable(column),
            format: this.getFormat(column)
          };
        });

        /* const c = new Array();
        if (this.selezioneMultipla2) {
          const e = {
            multiSelection: true,
            field: 'chk'
          }
          c.push(e);
        }
        columns.forEach(element => {
          if (element) {
            c.push(element);
          }
        }); */
        this.columns = columns;

        // logConsole('Colonne', c);
        // logConsole('Colonne senza impicci finali', this.maskName, this.columns);

        // logConsole('Ricarico', new Date());
        this.prendeValoriCombo(this.data.DataTable, 'creaColonne');

        this.originalColumns = JSON.parse(JSON.stringify(this.columns));
        if (this.columns) {
          // this.columnsApp = JSON.parse(JSON.stringify(this.columns));
          this.columnsAppFiltered = JSON.parse(JSON.stringify(this.columns));
        }

        this.scriveLog('Colonne rilevate: ', this.columns);
      }
    } catch (e) {
      console.error('Errore nella conversione delle colonne della griglia ' + this.maskName, e);
    }
    // this.scriveLog(this.columns);
  }

  trackByIdColumns(index: number, item: any) {
    return item.field;
  }
  // visualizzaCombo = false;
  
  trackByTag(index: number, item: any): any {
    return item.valore;  // Identifica univocamente ogni elemento
  }
  
  trackByRow(index: number, item: any): any {
    return item.valore;  // Identifica univocamente ogni elemento
  }
  
  trackByPoint(index: number, item: any): any {
    return item.name;  // Identifica univocamente ogni elemento
  }
  
  trackByNumero(index: number, item: any): any {
    return item.numero;  // Identifica univocamente ogni elemento
  }
  
  trackByCombo(index: number, item: any): any {
    return item.VALURE_STR;  // Identifica univocamente ogni elemento
  }
  
  trackByText(index: number, item: any): any {
    return item.NomeCampo;  // Identifica univocamente ogni elemento
  }
  
  trackByWS(index: number, item: any): any {
    return item.NAME;  // Identifica univocamente ogni elemento
  }
  
  trackByTicket(index: number, item: any): any {
    return item.value_str;  // Identifica univocamente ogni elemento
  }
  
  getHideIsEditable(c) {
    return c.hide_is_editable;
  }
  
  getFormat(c) {
    return c.format;
  }

  prendeValoriCombo(griglia, daChi) {
    this.prendeValoriCombo2(griglia, daChi);
    /* if (this.quantiNumeri.length === 0) {
      let n = 0;
      const t = setInterval(() => {
        this.scriveLog('Visualizzazione valori combo. Attesa: ' + n, this.quantiNumeri.length);
        if (this.quantiNumeri.length > 0) {
          clearInterval(t);
          this.prendeValoriCombo2(griglia);
        } else {
          n++;
          if (n === 5) {
            this.scriveLog('Visualizzazione valori combo. Skippo controllo');
            clearInterval(t);
          }
        }
      }, 1000);
    } else {
      this.prendeValoriCombo2(griglia);
    } */
  }

  prendeValoriCombo2(griglia, daChi) {
    // logConsole('Prende valori combo', daChi);
    // return;

    // this.visualizzaCombo = false;
    const r = new Array();
    this.scriveLog('Visualizzazione valori combo 1:', griglia, daChi);
    let valoriCombo = localStorage.getItem(this.userName + '_' + this.maskName + '_SelectedPointInfoV2');
    if (valoriCombo && valoriCombo !== null && valoriCombo !== 'undefined') {
      griglia.forEach(element2 => {
        element2.combo_value = -1;
      });
      // logConsole(valoriCombo, griglia);
      const valoriCombo2 = JSON.parse(valoriCombo);
      this.scriveLog('Visualizzazione valori combo 2.1:', valoriCombo2);
      this.scriveLog('Visualizzazione valori combo 2.2:', griglia);
      // MODIFICATO 06/09/2023 - PROBLEMI RITORNO CLICK SU COMBO
      valoriCombo2.forEach(element => {
        if (element && element.MEASR_CODE) {
          // this.scriveLog('Visualizzazione valori combo 2.3:', element);
          griglia.forEach(element2 => {
            if (element.MEASR_CODE === element2.MEASR_CODE) {
              element2.combo_value = +element.VALORE;
              const ritorno = { Selezionato: +element.VALORE, Precedente: +element.VALORE, Misura: element.DISPLAY_NAME, DataPerAggiornamento: new Date().toString(), Tutte: valoriCombo2 };
              r.push(ritorno);
            }
          });
        }
      });
      // logConsole('Ritorni: ', r);
      /* r.forEach(element => {
        this.clickSuComboMisura.emit(element);
      }); */
      // this.clickSuComboMisura.emit(r);
    }
    // this.clickSuComboMisura.emit(r);
    /* const tm = setTimeout(() => {
      this.visualizzaCombo = true;
    }, 100); */
  }

  orderColumnsByCookie(ss) {
    return;

    // this.stampaTempi('Order cloumns by cookie');
    // this.scriveLog(ss);
    // if (ss === undefined || ss !== 'undefined' || ss === null) {
    //   return;
    // }
    // this.scriveLog('Order column by cookie', ss, this.columns);
    // return;

    const colOrdered = new Array();
    const corder = JSON.parse(ss);

    // this.scriveLog('ORDINAMENTO DA COOKIE 1');
    // this.scriveLog(corder);
    // this.scriveLog(this.data.ColumnProperty);

    let modified = false;
    corder.forEach(element1 => {
      if (element1 && element1 !== null) {
        let nome1 = element1.trim().toUpperCase();
        while (nome1.indexOf(' ') > -1) {
          nome1 = nome1.replace(' ', '_');
        }
        if (this.columns)  {
          this.columns.forEach(element2 => {
            let nome2 = element2.field.trim().toUpperCase();
            while (nome2.indexOf(' ') > -1) {
              nome2 = nome2.replace(' ', '_');
            }
            if (nome1 === nome2) {
              /* if (this.columnsAppFiltered) {
                this.columnsAppFiltered.forEach(element3 => {
                  const ele = element3.title.trim();
                  if (ele === nome1) {
                    element2.hidden = element3.hidden;
                  }
                });
              } */

              colOrdered.push(element2);
              modified = true;
            }
          });
        }
      }
    });

    if (modified) {
      this.columns = colOrdered;

      // this.scriveLog('ORDINAMENTO DA COOKIE 2');
      // this.scriveLog(this.data.ColumnProperty);
    }

    // this.stampaTempi('Fatto orderColumnsByCookie');
  }

  updateGridAfterSelection(e) {
    // this.stampaTempi('Update grid after selection');
    // this.scriveLog('Filtro', e);
    if (e !== undefined && e !== null && e !== '') {
      // if (this.ricordaSelezione && !this.selezioneMultipla) {
      // if (this.ricordaSelezione) {
        // if (!e.Empty) {
        // const s: string = JSON.stringify(e.CODE + ' ' +  e.ICC_ID + ' ' +
        //   e.ID + ' ' + e.TS_ID + ' ' +
        //   e.TC_RUN_ID + ' ' + e.TS_RUN_ID + ' ' +
        //   e.DAY + ' ' + e.NAME);
        // const s: string = JSON.stringify(e.ROW_ID);
        // this.mySelection = new Array();
        // this.mySelection.push(JSON.parse(s));
      // this.scriveLog('Filtro: ', e);

      try {
        // if (e.indexOf(',') > -1) {
          const ee = e.split(',');
          const eee: number[] = new Array();
          ee.forEach(element => {
            eee.push(+element);
          });

          // this.scriveLog('update grid after selection', eee);
          this.mySelection = eee;
          // alert('Selection 1: ' + JSON.stringify(eee));
        // } else {
        //   this.mySelection = +e;
        // }

          this.loadDatas(false);

          // this.scriveLog('Riga selezionata: ', JSON.stringify(this.data.DataTable[e]));
          this.lastSelectedOfGrid.emit(JSON.stringify(this.data.DataTable[e - 1]));
      } catch (eeee) {
          // this.scriveLog('Errore:', ee);
          // }
      }
    }
    // this.stampaTempi('Fatto Update grid after selection');
  }

  selectedKeysChange(rows: number[]) {
    /* if (rows === this.vecchioRows) {
      return;
    }
    this.vecchioRows = rows; */

    // this.scriveLog('Righe: ', rows);
    // if (!this.selezioneMultipla) {
    // const r = rows[rows.length - 1];

    // this.scriveLog('Selected key change');
    // this.scriveLog(rows);
    // this.stampaTempi('Inizio Selected keys change');

    // const s: string = JSON.stringify(rows);
    // this.mySelection = new Array();
    // this.mySelection.push(JSON.parse(s));
    this.mySelection = rows;
    // alert('Selection 2: ' + JSON.stringify(rows));

    this.setKey(this.maskName, rows, this.maskName);

    if (this.selezioneMultipla2 && this.eliminaSelezioniSuClickRiga2) {
      const q = this.mySelection.length;
      // this.scriveLog('Selezionati: ', q);
      if (q > 0) {
        this.toConfirm = true;
      } else {
        this.toConfirm = false;
      }
    } else {
      if (this.selezioneMultipla2 && !this.eliminaSelezioniSuClickRiga2) {
        if (this.lastSelected && this.lastSelected.dataItem) {
          this.toConfirm = true;
        } else {
          this.toConfirm = false;
        }
      }
    }
    // this.stampaTempi('Fatto Selected keys change');
  }

  public pageChange(event): void {
    this.elaborazioneInCorso = true;
    // alert('accendo 3');

    if (event.skip > 0) {
      this.paginaAttuale = Math.floor(event.skip / event.take) + 1;
    } else {
      this.paginaAttuale = 1;
    }
    // logConsole('Pagina cambiata su ants grid: ', this.paginaAttuale, event);

    logConsole('Skip 1 su ants grid: ', event.skip, this.skip);
    this.skip = event.skip;

    // this.risorta();
    /* if (this.collassaTutto2 === true) {
      this.fCollassaTutto();
    }
    if (this.espandiTutto2 === true) {
      this.fEspandiTutto();
    } */

    this.elaborazioneInCorso = false;
    this.cdRef.detectChanges();

    const tm = setTimeout(() => {
      clearTimeout(tm)

      const ritorno = {
        take: event.take,
        skip: event.skip,
        pagina: this.paginaAttuale
      }

      // logConsole('Pagina cambiata su ants grid: ', ritorno);

      this.detectCambioPagina.emit(ritorno);
    }, 10);
  }

  fillGridExtern(t) {
    gridExtern = t;
  }

  getDescription(ss) {
    let s: string = '';
    if (ss.description && ss.description !== null && ss.description !== '') {
      s = ' ' + ss.description + ' ';
    }

    return s;
  }

  getComboValue(ss) {
    return -1;
    /* if (ss.combo && ss.combo !== null && ss.combo !== '') {
      return -1;
    } else {
      return -1;
    } */
  }

  getCombo(ss) {
    let s: string = '';
    if (ss.combo && ss.combo !== null && ss.combo !== '') {
      s = ' ' + ss.combo + ' ';
      this.campoComboPresente = true;
      if (!ss.combo_value) {
        this.data.DataTable.forEach(element => {
          element['combo_value'] = -1;
        });
      }
    }

    // this.scriveLog(ss.combo);
    if (ss.combo && ss.combo !== 'undefined' && (!this.quantiNumeri || this.quantiNumeri.length === 0)) {
      let valori = ss.combo.replace('"', '').replace('"', '').split(',');
      this.quantiNumeri = new Array();
      this.quantiNumeri.push({ numero: 0, testo: ''});
      valori.forEach(element => {
        const v = element;
        this.quantiNumeri.push( { numero: +v, testo: +v > 0 ? v : '' });
      });
      // this.scriveLog(d, ss.combo, valori, this.quantiNumeri);
    }
    /* new Array();
    d.forEach(element => {
      this.numeroSelezionato.push(0);
    }); */

    return s;
  }

  getSIT(ss) {
    const s: string = ss.showIconText;

    return s;
  }

  getClickEnabled(ss) {
    const s: string = ss.click_enabled;

    return s === 'true' ? true : false;
  }

  getDomain(ss) {
    const s: string = ss.Domain;

    return s;
  }

  getDomainType(ss) {
    const s: string = ss.DomainType;

    return s;
  }

  getColumnWidth(righe, ss) {
    let w: number;

    if (ss.width || ss.width === 0) {
      w = ss.width;
    } else {
      if (ss.hide) {
        if (ss.hide === true || ss.hide === 'true' || ss.hide === '"true"') {
          return 0;
        }
      }

      const nome = ss.key;
      const titolo = ss.headerText.toString().trim();
      /* let fontSize;
      if (this.DimensioneFont) {
        fontSize = this.DimensioneFont;
      } else {
        fontSize = 14;
      }

      const divisore = 1.63;
      let max = ((titolo.toString().trim()) + ' ').length  * (fontSize / divisore);
      const ceIcona = ss.IconName;
      if (ceIcona) {
        max += 35;
      }

      righe.forEach(element => {
        if (element && element[nome]) {
          const contenuto = (element[nome].toString().trim()) + ' ';
          const lunghezza = (contenuto.length * (fontSize / divisore)) + (ceIcona ? 35 : 0) ;
          if (lunghezza > max) {
            max = lunghezza;
          }
        }
      }); */

      const font = (this.DimensioneFont) + 'px "Helvetica Neue", Helvetica, Arial, sans-serif';
      let maxScritta = titolo;

      righe.forEach(element => {
        if (element && element[nome]) {
          const contenuto = (element[nome].toString().trim());
          if (contenuto.length > maxScritta.length) {
            maxScritta = contenuto;
          }
        }
      });

      const ceIcona = ss.IconName;
      const ceCombo = ss.combo;
      let lunghezza = this.textMeasureService.getTextWidth(maxScritta, font);
      if (ceIcona || ceCombo) {
        lunghezza += 35;
      }

      if (ss.maxWidth && ss.maxWidth > 0) {
        if (lunghezza > ss.maxWidth) {  
          lunghezza = ss.maxWidth;
        }
      }
      // logConsole('Dimensioni colonna', nome, maxScritta, ceIcona, ceCombo, lunghezza);

      w = lunghezza;
    }

    return w;
  }

  getComboValues(d) {
    let ret: string = '';
    let index = 0;
    let filled = false;

    this.lookUpNames.forEach(element => {
      if (element[0].CATEGORY === d) {
        if (!filled) {
          filled = true;
          ret = this.lookUpValues[index];
        }
      }
      index++;
    });

    return ret;
  }

  /* showChart(f, q) {
    // this.scriveLog(f, this.righeCst[q]);
    if (f === 'CST_CHART') {
      if (this.caricatoCst === false) {
        this.loadCST();
      }
      // this.scriveLog(this.righeCst);
      if (AntsGridLibraryComponent.chartone[q] === null) {
        const tm = setTimeout(() => {
          const nomeChart =  'chartContainers_' + q;
          if (this.righeCst[q] !== null) {
            this.scriveLog(f, q, this.righeCst[q], AntsGridLibraryComponent.chartone[q]);
            AntsGridLibraryComponent.chartone[q] = new CanvasJS.Chart(nomeChart,
              this.righeCst[q]
            );
            AntsGridLibraryComponent.chartone[q].render();
          }
        // } else {
          // AntsGridLibraryComponent.chartone[q].render();
        }, 1000);
      }

      return true;
    } else {
      return false;
    }
  } */

  /* loadCST() {
    if (this.caricatoCst === true) {
      return;
    }

    // this.scriveLog('Disegna grafico');
    if (this.data && this.data.ColumnProperty && this.data !== 'empty grid')  {
      // this.scriveLog(this.data.DataTable);
      // const tm = setTimeout(() => {
        this.data.ColumnProperty.forEach(element => {
          if (element.field === 'STACKED_BAR') {
            let q = 0;
            this.righeCst = new Array();
            AntsGridLibraryComponent.chartone = new Array();
            this.data.DataTable.forEach(element2 => {
              // if (!element2['ROW_ID']) {
              //   element2['ROW_ID'] = q;
              // }
              // this.scriveLog(element2.CST_CHART);

              const c = JSON.parse(element2.CST_CHART);
              this.righeCst.push(new Array());
              AntsGridLibraryComponent.chartone.push(null);
              // let tot = 0;
              const min = +c.ChartProperty.min;
              const max = +c.ChartProperty.max;
              // this.minToMax = new Array();
              // for (let i = 0; i <= max; i++) {
              //   this.minToMax.push(i);
              // };

              this.righeCst[q] = this.creaGrafico(q, c.Values, min, max);

              /* for (let i = 0; i < 5; i++) {
                if (c.Values[i]) {
                  // this.righeCst[q].push(c.Values[i]);
                  // tot += +c.Values[i].value;
                  this.righeCst[q].push(this.creaGrafico(c.Values[i]));
                } else {
                  // this.righeCst[q].push(
                  //   {name: '', color: '', value: 0}
                  // );
                }
              } // /
              // this.righeCst[q].push({name: 'Filler', color: '#9f1f1f', value: max - tot});

              q++;
            });
            // this.scriveLog(this.data.DataTable);
          }
        });
        this.caricatoCst = true;
        // }, 1000);
    }
  } */

  loadTEM() {
    if (this.data && this.data.ColumnProperty && this.data !== 'empty grid')  {
      this.righeTEM = new Array();
      let q = 0;
      this.data.ColumnProperty.forEach(element => {
        if (element.key === 'TC_RUN_RESULT_BY_TIME') {
          this.data.DataTable.forEach(element2 => {
            this.righeTEM[element2.ROW_ID] = new Array();

            const dati = element2.TC_RUN_RESULT_BY_TIME;
            dati.forEach(element3 => {
              // const tms = element3.tc_run_end_time_stamp;
              const tipo = element3.tc_run_result;
              let ok = true;
              this.righeTEM[element2.ROW_ID].forEach(element4 => {
                if (element4.tipo === tipo) {
                  ok = false;
                  let tms = element3.tc_run_end_time_stamp;
                  tms = tms.substring(0, tms.indexOf(' ')).trim();

                  // element4.valore.push({value: element3.count, tms: tms});
                  element4.tms.push(tms);
                  element4.valore.push(element3.count);
                }
              });
              if (ok === true) {
                let tms = element3.tc_run_end_time_stamp;
                tms = tms.substring(0, tms.indexOf(' ')).trim();

                const n = {
                  idRiga: element2.ROW_ID,
                  // tms: tms,
                  tipo: tipo,
                  // valore: [{value: element3.count, tms: tms}],
                  valore: [element3.count],
                  tms: [tms],
                  coloresfondo: element3.color,
                  testo: element3.tc_run_result,
                  coloretesto: '#9f1f1f'
                }
                q++;
                this.righeTEM[element2.ROW_ID].push(n);
              }
            });
          });
        }
      });

      // this.scriveLog(this.righeTEM);
    }
  }

  onSeriesHover(e) {
    this.hoverTEM = e;
    // this.scriveLog(e);
  }

  onSeriesClick(e, r) {
    // this.scriveLog(this.gridData);
    const ee = {
      ColonnaSelezionata: e.point.categoryIx,
      Valore: e.value,
      NumeroRiga: r,
      DatiGrafico: e,
      DatiRiga: this.righeTEM[r],
      Clickato: e.point.seriesIx,
      Tipologia: this.righeTEM[r][e.point.seriesIx].tipo,
      Tms: this.righeTEM[r][e.point.seriesIx].tms[this.hoverTEM.point.categoryIx],
      RigaSelezionata: this.gridData[r - 1]
    }
    this.clickSuGrafico.emit(ee);

    const mySelection2 = new Array();
    let d = this.gridData;
    if (this.paginazione === 'virtual') {
      d = this.gridData.data;
    }
    // this.scriveLog(d);
    if (d) {
      d.forEach(element => {
        if (element.ROW_ID === this.gridData[r - 1].ROW_ID) {
          mySelection2.push(element.ROW_ID);
        }
      });
    }
    this.mySelection = mySelection2;
    // alert('Selection 3: ' + JSON.stringify(mySelection2));
    this.selectedRow = JSON.stringify(this.gridData[r - 1]);
    this.scriveLog('Imposta Selezione 2: ', this.selectedRow, this.mySelection);
  }

  scriveTooltip(item) {
    // const tm = setTimeout(() => {
    // this.scriveLog('Numero Riga:', item.idRiga),
    // this.scriveLog('Riga:', item),
    // this.scriveLog('Colonna: ', this.hoverTEM.point.categoryIx);
    // this.scriveLog('Hover:', this.hoverTEM);
    // this.scriveLog('Riga TEM:', this.righeTEM[this.hoverTEM.point.categoryIx]);

    const colonna = this.hoverTEM.point.categoryIx;
    const riga = item.idRiga;
    let rit = new Array();
    rit.push({ colore: 'transparent', valore: item.tms[colonna]});
    rit.push({ colore: 'transparent', valore: ''});
    if (this.righeTEM[riga]) {
      this.righeTEM[riga].forEach(element => {
        if (+element.valore[colonna] !== 0 && element.valore[colonna] !== '') {
          rit.push({ 
            coloresfondo: element.coloresfondo, 
            coloretesto: element.coloretesto, 
            valore: element.valore[colonna] + ': ' + element.testo
          });
        }
      });
    }
    // this.scriveLog(rit)

    return rit;
    // }, 100);
  }

  loadCST() {
    if (this.data && this.data.ColumnProperty && this.data !== 'empty grid')  {
      // this.scriveLog(this.data.ColumnProperty);
      this.data.ColumnProperty.forEach(element => {
        if (element.key === 'CST_CHART') {
          let q = 0;
          this.righeCst = new Array();
          this.data.DataTable.forEach(element2 => {
            if (!element2['ROW_ID']) {
              element2['ROW_ID'] = q;
            }
            // this.scriveLog(element2.CST_CHART);

            const c = element2.CST_CHART;
            this.righeCst.push(new Array());
            let tot = 0;
            const max = +c.ChartProperty.max;
            // this.minToMax = new Array();
            // for (let i = 0; i <= max; i++) {
            //   this.minToMax.push(i);
            // };
            for (let i = 0; i < 5; i++) {
              // this.scriveLog(c.Values[i]);
              if (c.Values[i]) {
                this.righeCst[q].push(c.Values[i]);
                tot += +c.Values[i].value;
              } else {
                // this.righeCst[q].push(
                //   {name: '', color: '', value: 0}
                // );
              }
            }
            this.righeCst[q].push({name: 'Filler', color: '#9f1f1f', value: max - tot});

            q++;
          });
          // this.scriveLog('RIGHE CST', this.righeCst);
        }
      });
    }
  }

  loadHist() {
    if (this.data && this.data.ColumnProperty && this.data !== 'empty grid')  {
      // this.scriveLog(this.data.ColumnProperty);
      this.data.ColumnProperty.forEach(element => {
        if (element.key === 'CST_CHART1') {
          let q = 0;
          this.righeHist = new Array();
          this.righeHistCat = new Array();
          this.data.DataTable.forEach(element2 => {
            if (!element2['ROW_ID']) {
              element2['ROW_ID'] = q;
            }

            // this.scriveLog(element2.CST_CHART1);
            const c = element2.CST_CHART1;
            // this.scriveLog(c);
            const arrayX = new Array();
            const arrayY = new Array();
            if (c) {
              c.Values.forEach(element3 => {
                arrayX.push(element3.x.toString());
                arrayY.push(+element3.y);
              });
            }
            this.righeHist.push(arrayY);
            this.righeHistCat.push(arrayX);
            // this.scriveLog(this.righeHistCat[q], this.righeHist[q]);
            q++;
          });
        }
      });
    }
  }

  public labelContent = (e: any) => {
    if (e.value.indexOf('.') === -1) {
      return e.value;
    } else {
      return '';
    }
  }

  /* creaGrafico(riga, valori, min, max) {
    if (!valori) {
      return null;
    }
    // this.scriveLog('Disegna grafico', valori);

    let righe = '[';
    valori.forEach(element => {
      righe += '{' +
          '"type": "stackedBar",' +
          '"color": "' + element.color + '",' +
          '"name": "' + element.name + '",' +
          '"dataPoints": [' +
          ' { "x": 1, "y": ' + element.value + ' }' +
          ']' +
        '},';
    });
    if (righe.length > 1) {
      righe = righe.substring(0, righe.length - 1);
      righe += ']';
    } else {
      return;
    }
    // this.scriveLog(righe);
    const str = {
      animationEnabled: false,
      title: {
        // text: 'Titolo'
      },
      axisX: {
        interval: 1,
        crosshair: {enabled: true, color: 'red', thickness: 2, lineDashType: 'dot' },
        fontFamily: 'arial',
        fontWeight: 'normal',
        gridColor: 'transparent',
        labelFontColor: '#aaaaaa',
        labelFontSize: 0,
        lineColor: 'transparent',
        margin: -10,
        tickColor: '#c6c6c6',
        tickLength: 0,
        lineThickness: 0,
        gridThickness: 0,
        // viewportMaximum: min,
        // viewportMinimum: max
      },
      height: 60,
      axisY: {
        fontFamily: 'arial',
        fontWeight: 'normal',
        gridColor: 'transparent',
        labelFontColor: 'transparent',
        lineColor: 'transparent',
        maximum: 10,
        margin: 0,
        tickColor: 'transparent',
        titleFontColor: '#aaaaaa',
        titleWrap: false,
        valueFormatString: '000'
      },
      toolTip: {
        shared: true
      },
      axisY2: {
        interlacedColor: 'black',
        gridColor: 'transparent',
        title: 'Titolo 2'
      },
      data: JSON.parse(righe),
    };

    return str;
  } */

  loadTrailis() {
    let d = this.data.DataTable;

    // Load TRAILIS
    this.sOK = new Array();
    this.sABORT = new Array();
    this.sFAILED = new Array();
    // this.sDIFFERENCE = new Array();

    // let index = 1;
    if (this.data && d && this.data !== 'empty grid' && d !== 'empty grid')  {
      d.forEach(element => {
        if (element.TRAILIS) {
          this.getOk(element.TRAILIS, element.ROW_ID);
          this.getAbort(element.TRAILIS, element.ROW_ID);
          this.getFailed(element.TRAILIS, element.ROW_ID);
        }

        // index++;
      });
    }
    // Load TRAILIS
  }

  loadTrailis_Day() {
    let d = this.data.DataTable;

    // Load TRAILIS_DAY
    this.sOK_DAY = new Array();
    this.sABORT_DAY = new Array();
    this.sFAILED_DAY = new Array();
    this.sOTHER_DAY = new Array();
    // this.sDIFFERENCE = new Array();

    // let index = 1;
    if (this.data && d && this.data !== 'empty grid' && d !== 'empty grid')  {
      d.forEach(element => {
        if (element.TRAILISDAY) {
          this.getOk_Day(element.TRAILISDAY, element.ROW_ID);
          this.getAbort_Day(element.TRAILISDAY, element.ROW_ID);
          this.getFailed_Day(element.TRAILISDAY, element.ROW_ID);
          this.getOther_Day(element.TRAILISDAY, element.ROW_ID);
        }

        // index++;
      });
    }
    // Load TRAILIS_DAY
  }

  setFilter() {
    // this.stampaTempi('Set filter');

    this.rowButtonsConfig2.showFilter = !this.rowButtonsConfig2.showFilter;
    // alert('Inverto Filtro ' + this.rowButtonsConfig2.showFilter);

    if (this.rowButtonsConfig2.showFilter) {
      this.scriveLog('Imposto griglia per filtro ', this.rowButtonsConfig2.showFilter);
      this.gridSettings.filtered = this.rowButtonsConfig2.showFilter;
    } else {
      // this.gridSettings.state.filter.filters = [];
      this.scriveLog('Imposto griglia per filtro chiuso');
      this.gridSettings.filtered = false;

      // this.reloadGrid();
    }
    localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered', this.rowButtonsConfig2.showFilter ? 'S' : 'N');

    this.saveGrid();
    // this.stampaTempi('Fatto Set filter');
  }

  clearFilter() {
    this.mySelection = new Array();
    // this.stampaTempi('Clear filter');
    // alert('Clear ' + daDove);

    this.rowButtonsConfig2.showFilter = false;
    // alert('Pulisco Filtro ' + this.rowButtonsConfig2.showFilter);

    this.scriveLog('Imposto griglia per filtro chiuso in clear');
    this.gridSettings.filtered = false;
    this.showSettedFilter = false;

    const s: State = { filter: undefined, group: [], skip: 0, sort: [], take: 25 };

    const ccc = Array<ColumnSettings>();
    const cc: ColumnSettings = { field: '',  title: '',  filterable: false,  _width: 40 };
    ccc[0] = cc;

    this.gridSettings = { state: s, filtered: false, columnsConfig: ccc };

    localStorage.removeItem(this.returnUserName() + '_grid_' + this.maskName + '_gridSettings');

    this.saveGrid();

    // this.stampaTempi('Fatto clear filter');
    if (this.appoggioSelezione) {
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // this.ordinaValoriCombo();
        this.mySelection = JSON.parse(JSON.stringify(this.appoggioSelezione));
        logConsole('Selezione dopo clear filter: ', this.mySelection);
      }, 100);
    } else {
      this.mySelection = [];
    }
  }

  setValuesForPersistance(c, g) {
    // this.stampaTempi('Set value for persistance');
    if (g && g !== null && g[0] !== undefined) {
      const isFiltered: string = g[0].IsFilterDisplayed;
      let filtered: boolean;
      if (isFiltered === 'Y') {
        filtered = true;
      } else {
        filtered = false;
      }

      this.gridSettings.state = { skip: 0, take: +g[0].ItemsPerPage, filter: { logic: 'and', filters: [] } };
      // alert('Imposto pagina 5 ' + this.gridSettings.state.skip);
      // this.scriveLog(g[0].ItemsPerPage);
      /* const ww = Array<number>();
      let index = 0;
      c.forEach(element => {
        let w: number = element.width;
        if (element.width === '*') {
          w = 150;
        }
        ww[index] = w;
        index++;
      });
      this.gridSettings.width = ww; */

      const ccc = Array<ColumnSettings>();
      let index = 0;
      c.forEach(element => {
        const cc: ColumnSettings = { field: element.key, title: element.headerText,
          filter: element.dataType, filterable: filtered, width: -1 };
        ccc[index] = cc;
        index++;
      });
      this.gridSettings.columnsConfig = ccc;

      // this.scriveLog('SET VALUE FOR PERSISTANCE');
      // this.scriveLog(ccc);

      this.getWidth();
    }
    // this.stampaTempi('Fatto Set value for persistance');
  }

  /* reloadGridReport() {
    const appo = rowNum;

    rowNum = '-1';

    // const tt = ReportMainComponent.t;
    // tt.loadReport(null);

    rowNum = appo;

    this.clickOnMenu2 = false;
  }

  updateRowNum(e) {
    rowNum = e.text;
    this.numberOfRows = e.value;

    // const t = DashboardHeaderComponent.t;
    localStorage.setItem( this.returnUserName() + '_grid_' + this.maskName + '_rownum', rowNum);

    const tt = ReportMainComponent.t;
    tt.loadReport(null);
  } */

  updateDaysAgo() {
    howManyDays = this.numberOfDays;
  }

  updateDaysAgoClick() {
    // this.reloadGrid();

    this.clickOnMenu1 = false;
  }

  updateLatestIterations() {
    latestIterations = this.numberOfLatestIterations;
  }

  updateLatestIterationsClick() {
    // this.reloadGrid();

    this.clickOnMenu1 = false;
  }

  onClickTrailis(e, c) {
    if (this.lastPressed === '') {
      // 16.65 = dimensioni casella Trailis (130) diviso (numero celle visualizzate (8) + gap (0.4))
      const day = (Math.floor(e.layerX / 16.65));
      // this.scriveLog('Premuto click. Giorno ' + day);
      // this.loadDayByTrailis(day, c);
    }
    this.lastPressed = '';
  }

  onPlotAreaClick(e, c) {
    // this.scriveLog('Premuto Plot. Giorno ' + e.category);
    // this.loadDayByTrailis(e.category, c);
    this.lastPressed = 'Plot';
  }

  onOffKeysOnInit() {
    if (this.rowButtonsConfig2) {
      this.rowButtonsConfig2.showAddnew = false;
      this.rowButtonsConfig2.showDetails = false;
      this.rowButtonsConfig2.showDelete = false;
      this.rowButtonsConfig2.showCopy = false;
      this.rowButtonsConfig2.showEdit = false;
      // this.rowButtonsConfig2.showInfo = false;
      this.rowButtonsConfig2.showPause = false;
      this.rowButtonsConfig2.showRun = false;
      this.rowButtonsConfig2.showStop = false;
      this.rowButtonsConfig2.showDetails = false;

      this.rowButtonsConfig2.showHeader = true;
      this.rowButtonsConfig2.showRefresh = true;
      this.showRowNum = false;
    // } catch (e) {
    }
  }

  onOffKeysOnSelect() {
    this.onOffKeysOnInit();

    // this.rowButtonsConfig2.showInfo = true;

    // const t = DashboardHeaderComponent.t;
  }

  changeStringForOrdering(s) {
    if (!s) {
      return s;
    }
    // this.stampaTempi('Change string for ordering');

    let appo: String;

    appo = s;
    appo = appo.replace('<', '');
    appo = appo.replace('>', '');
    
    if (this.modificaCampi) {
      while (appo.indexOf('.') > -1) {
        appo = appo.replace('.', environment.replaceChar);
      }
      // // appo = '[' + appo + ']';

      appo = this.toglieNumeroIniziale(appo);

      // this.scriveLog(environment);
      // ONLY FOR DEBUG
      if (environment.production === false) {
        while (appo.indexOf(' ') > -1) {
          appo = appo.replace(' ', '');
        }
      }
      // ONLY FOR DEBUG
    }

    // this.stampaTempi('Fatto Change string for ordering');
    return appo;
  }

  toglieNumeroIniziale(appo) {
    const primoCarattere = appo.substring(0, 1);
    // logConsole('Campo', newKey, primoCarattere);
    if (primoCarattere === '0' || primoCarattere === '1' || primoCarattere === '2' || primoCarattere === '3'
        || primoCarattere === '4' || primoCarattere === '5' || primoCarattere === '6' || primoCarattere === '7'
        || primoCarattere === '8' || primoCarattere === '9') {
      appo = environment.replaceChar + appo;
      // logConsole('Campo modificato', appo);
    }

    return appo;
  }

  trimFunction(s: string) {
    // this.stampaTempi('Trim function');
    let ss: string = s.toString();
    ss = ss.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    // this.stampaTempi('Fatto Trim function');
    return ss;
  }

  isEdit(column) {
    if (column.IsEditable) { return column.IsEditable === 'true' ? true : false; } else { return false; }
    // return true;
  }

  isColumnLocked(column) {
    if (column.locked) { return column.locked === 'true' ? true : false; } else { return false; }
  }

  isColumnHidden(column) {
    let r = false;

    /* if (this.maskName === 'tc-run-list_scheduler') {
      if (column.IsEmpty === true || column.IsEmpty === 'true' || column.IsEmpty === '"true"') {
        const i = 1;
      }
    } */

    // this.scriveLog('Colonne modificate: ', this.modifiedColumns);
    // this.scriveLog('Colonne filtrate: ', this.columnsAppFiltered);
    // if (this.modifiedColumns && this.columnsAppFiltered) {
    /* if (this.columnsAppFiltered) {
      // this.scriveLog('è presente il cookie');
      // this.scriveLog('CERCO ');
      // this.scriveLog(column.headerText);
      this.columnsAppFiltered.forEach(element => {
        if (column.headerText === element.title) {
          // this.scriveLog('TROVATO. Ritorno ' + element.hidden);
          r = element.hidden;
        }
      });
    } else { */
      // this.scriveLog('Colonna hide: ', column.hide);
      
      if (column.hide) {
        if (column.hide === true || column.hide === 'true' || column.hide === '"true"') {
          r = true;
        }
      }

      if (!r) {
        if (column.IsEmpty) {
          if (column.IsEmpty === true || column.IsEmpty === 'true' || column.IsEmpty === '"true"') {
            if (this.hideEmptyColumns && this.hideEmptyColumns === 'true') {
              r = true;
            }
          }
        }

    //   }
    }

    return r;
  }

  isHiddenLabel(column) {
    if (column.hiddenLabel) { return column.hiddenLabel === 'true' ? true : false; } else { return false; }
  }

  callback() {
    this.dateNow = new Date();
  }

  ngOnDestroy() {
    conta('griglia: distrutta', this.maskName);
    // this.cdRef.reattach();

    this.onKeyDown = function() : void {};

    // this.st.delTimer('5sec');
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
    }

    if (this.divConten) {
      if (this.tooltipDir) {
        this.renderer.removeChild(this.divConten.nativeElement, this.tooltipDir);
      }
      if (this.gridContextMenu) {
        this.renderer.removeChild(this.divConten.nativeElement, this.gridContextMenu);
      }
      if (this.GridNormale) {
        this.renderer.removeChild(this.divConten.nativeElement, this.GridNormale);
      }
      if (this.GridVirtuale) {
        this.renderer.removeChild(this.divConten.nativeElement, this.GridVirtuale);
      }
      if (this.GridGenInterna) {
        this.renderer.removeChild(this.divConten.nativeElement, this.GridGenInterna);
      }
    }

    if (this.divRiga) {
      this.divRiga.nativeElement.remove();
    }
    if (this.inputTesto) {
      this.inputTesto.nativeElement.remove();
    }
    if (this.divConten) {
      this.divConten.nativeElement.removeEventListener('scroll', this.callback);
      this.divConten.nativeElement.remove();
    }
  
    // clearInterval(this.myTimer);
    // this.stopTimer = true;
  }

  public ngAfterViewInit(): void {
    // this.stampaTempi('After view init');
    // this.scriveLog(this.permetteDragDrop2);
    if (this.permetteDragDrop2 === true) {
      this.currentSubscription = this.handleDragAndDrop();
    }

    // this.scriveLog('Grid data bound');
    // if (this.gridHTML) {
      // const tm = setTimeout(_ => this.scriveLog('My element: ' + this.GridGen), 1000);
      // this.scriveLog('alert (afterviewinit)', this.alertElement.nativeElement);

      // this.maskName !== 'tc-run-detail' &&

      // this.scriveLog('AfterViewInit', this.Grids);

    /* this.Grids.changes.subscribe((comps: QueryList <GridComponent>) => {
      // this.scriveLog('Presa');
      this.scriveLog('Prendo Griglia. ', comps.first);
      this.GridGenInterna = comps.first;
      if (this.deveFareAutoFit === true) {
        // this.scriveLog('Deve fare autofit');
        const tm = setTimeout(_ => this.autoFitColumns(), 200);
      }
      // this.firstStepForAutofit();
    }); */

    const tm = setTimeout(() => {
      clearTimeout(tm)

      this.dimeXGriglia = this.divConten.nativeElement.offsetWidth;
      this.dimeYGriglia = this.divConten.nativeElement.offsetHeight;
      this.calcoloNumeroPagine();
      // this.scriveLog(this.dimeXGriglia, this.dimeYGriglia);
    }, 100); // TIMEOUT - PRIMA ERA 1000

      // this.gridHTML.nativeElement.autoFitColumns();
    //   this.scriveLog('Fatto');
    // }
    // this.stampaTempi('Fatto After view init');
  }

  // prova(e) {
    // this.scriveLog(e);
    // return
  // }

  calcoloNumeroPagine() {
    // this.stampaTempi('Calcolo numero pagine');
    // let altezzaRiga = (this.DimensioneFont * 2);
    // altezzaRiga += ((altezzaRiga * 35) / 100);
    // this.scriveLog('Altezza riga', this.DimensioneFont, this.altezzaRiga);
    if (this.paginazione !== 'virtual') {
      // if (this.altezzaRiga === 0) {
      //   this.altezzaRiga = 15;
      // }

      const a = Math.round((this.dimeYGriglia - 100) / this.altezzaRiga);
      if (a > 0) {
        this.quantePagine = a;
        if (this.righeAutomatiche === true) {
          // this.scriveLog('Impostato take:', this.quantePagine);
          // TOLTO 13/09/2021 per problema di righe non visibili
          /* const tm = setTimeout(() => {
            this.take = this.quantePagine;

            // this.scriveLog('Impostato take 4: ', this.take);

            this.numeroRighePagina.emit(this.take);
          }, 10); */
        }
      }
    } else {
      // this.take = 100;
    }
    // this.pageable = JSON.parse(JSON.stringify(this.pageable));
    // this.scriveLog(this.take);
    // this.stampaTempi('Fatto Calcolo numero pagine');
  }

  // onResizedRow(e) {
    // this.altezzaRiga = document.getElementById('divRiga').offsetHeight;

    // if (this.altezzaRiga === -1) {
      // this.altezzaRiga = e.newHeight;
      // this.calcoloNumeroPagine();
      // this.scriveLog('Altezza riga:', e);
    // }
    // this.scriveLog(this.dimeXGriglia, this.dimeYGriglia);
  // }

  onResized(e) {
    // this.stampaTempi('On resized');
    const aa = document.getElementById('divRiga');
    if (aa && aa !== null) {
      const a = aa.offsetHeight + 8;
      // this.scriveLog('Altezza riga', a);
      this.altezzaRiga = a;
      // this.scriveLog(e);
      this.dimeXGriglia = this.divConten.nativeElement.offsetWidth;
      this.dimeYGriglia = this.divConten.nativeElement.offsetHeight;
      this.dimensioniGrigliaEmit.emit(this.dimeXGriglia + ';' + this.dimeYGriglia + ';' + a);
      this.calcoloNumeroPagine();
    }
    // this.scriveLog(this.dimeXGriglia, this.dimeYGriglia);
    // this.stampaTempi('Fatto On resized');
  }

  /* firstStepForAutofitFromExtern() {
    this.isAlreadyLoaded = false;
    this.firstStepForAutofit();
  } */

  firstStepForAutofit() {
    // this.stampaTempi('First step for autofit');
    // this.maskName !== 'tc-run-detail' &&
    // if (this.debugTasto === true) {
      this.scriveLog('Griglia ' + this.maskName + '. Autofit 2');
    // }

    if (!this.isAlreadyLoaded) {
      // if (this.AutoResize === undefined || this.AutoResize === true) {
        const tm = setTimeout(() => {
          clearTimeout(tm)

          this.autoFitColumns(false, 'firstStep')
        }, 10); // TIMEOUT - PRIMA ERA 200
      // }
      this.isAlreadyLoaded = true;
    }
    // this.stampaTempi('Fatto First step for autofit');
  }

  groupCollapse_OLD(e) {
    return;

    this.elaborazioneInCorso = true;
    // alert('accendo 4');

    // this.scriveLog('Collapse');
    // this.firstStepForAutofit();
    // if (this.GridGen) {
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Autofit 3');
      // }
      const tm = setTimeout(() => {
        clearTimeout(tm)
        
        // this.GridGenInterna.autoFitColumns();

        this.elaborazioneInCorso = false;
        this.cdRef.detectChanges();
      });
    // }
  }

  groupExpand_OLD(e) {
    return;

    this.elaborazioneInCorso = true;

    // this.scriveLog('Expand');
    // this.firstStepForAutofit();
    // if (this.GridGen) {
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Autofit 4');
      // }
      const tm = setTimeout(() => {
        clearTimeout(tm);

        // this.GridGenInterna.autoFitColumns()

        this.elaborazioneInCorso = false;
        this.cdRef.detectChanges();
      });
    // }
  }

  impostaGridGenInterna(daDove) {
    logConsole('AUTOFIT: Imposto GridGenInterna da ' + daDove);
    if (this.GridGenInterna === undefined) {
      if (this.paginazione === 'virtual') {
        this.scriveLog('Impostazione GridGenInterna: Prendo griglia virtuale: ', this.GridVirtuale);
        if (this.GridVirtuale) {
          this.GridGenInterna = this.GridVirtuale;
        } else {
          this.GridGenInterna = undefined;
        }
        logConsole('AUTOFIT: Imposto GridGenInterna virtual da ' + daDove + ': ', this.GridGenInterna);
      } else {
        this.scriveLog('Impostazione GridGenInterna: Prendo griglia normale: ', this.GridNormale);
        if (this.GridNormale) {
          this.GridGenInterna = this.GridNormale;
        } else {
          this.GridGenInterna = undefined;
        }
        logConsole('AUTOFIT: Imposto GridGenInterna normale da ' + daDove + ': ', this.GridGenInterna);
      }
    }
  }

  controlloAutofit(daDove) {
    this.impostaGridGenInterna(daDove);

    // logConsole('Controllo Autofit: Griglia ' + this.maskName + '. GridGen', daDove, this.GridGenInterna);
    this.scriveLog('Controllo Autofit: Griglia ' + this.maskName + '. GridGen', daDove, this.GridGenInterna);
    if (this.GridGenInterna) {
      logConsole('AUTOFIT: Grid interna esistente');
      /* if (t !== null) {
        clearInterval(t);
      } */
      // const tm = setTimeout(() => {
        this.autoFitColumns2('AutoFitColumns1');
        this.staAutoFittando = false;
      // }, 1000);

      return true;
    } else {
      logConsole('AUTOFIT: Grid interna inesistente');
      /* this.q2 += 1;
      if (this.q2 > 10) {
        if (t !== null) {
          clearInterval(t);
        }
      } */
      return false;
    }
  }

  staAutoFittando = false;
  q2;
  ultimoAutofit = -1;
  autoFitSMFatto = false;

  autoFitColumns(refreshManuale, daChi) {
    const diff = new Date().getTime() - this.ultimoAutofit;
    if (diff < 1000) {
      return;
    }
    this.ultimoAutofit = new Date().getTime();

    if (this.limitaRighe) {
      if (!this.limitaRighe.eseguiAutoFit) {
        if (this.selezioneMultipla) {
          if (!this.autoFitSMFatto) {
            this.autoFitSMFatto = true;
          } else {
            return;
          }
        }
      }
    }

    logConsole('Eseguo autofit in griglia', daChi, this.maskName);

    // Messo per testare la velocità
    // return;

    /* if (this.AutoResize === false && refreshManuale === false) {
      return;
    } */

    // this.stampaTempi('autoFitColumns');

    // if (this.debugTasto === true) {
      this.scriveLog('Griglia ' + this.maskName + '. Autofit routine', daChi);
    // }

    /* if (this.staAutoFittando) {
      this.scriveLog('Griglia ' + this.maskName + '. Autofit routine. Esco per attività già in corso');
      return;
    }

    const diff = new Date().getTime() - this.oldDataAutoColumns;
    if (diff < 2000) {
      return;
    }
    this.oldDataAutoColumns = new Date().getTime(); */

    this.staAutoFittando = true;
    this.q2 = 0;

    if (!this.controlloAutofit(daChi)) {
      let q = 0;
      const t = setInterval(() => {
        if (this.controlloAutofit(daChi)) {
          clearInterval(t);

          logConsole('Autofit effettuato in griglia', daChi, this.maskName);
        } else {
          q++;
          if (q > 2) {
            clearInterval(t);

            logConsole('Autofit annullato in griglia', daChi, this.maskName);
          }
        }
      }, 1000); // TIMEOUT - PRIMA ERA 1000 
    }

    return;

      /* if (this.subscribeAutoFit) {
        this.subscribeAutoFit.unsubscribe();
      } */

      let q = 0;
      // this.subscribeAutoFit = Observable.timer(0, 1000)
      //   .take(32000)
      //   .subscribe(() => {

          // this.scriveLog(this.paginazione, this.gridData);

          // this.scriveLog(this.take);
          // this.scriveLog(this.skip);

          // this.scriveLog(r);

          // this.Grids.changes.subscribe((comps: QueryList <GridComponent>) => {
            // this.scriveLog('Presa');
          // this.scriveLog('Prendo griglia 2: ', this.Grids.first);
            // this.firstStepForAutofit();
          // });

          /* if (this.GridGenInterna === undefined) {
            q++;
            if (q > 5) {
              this.subscribeAutoFit.unsubscribe();
              // this.scriveLog('Non sono riuscito più a fare l\'autofit');
            }
          } else {
            this.subscribeAutoFit.unsubscribe();
            this.subscribeAutoFit = undefined;
            // this.scriveLog('Faccio l\'autofit ritardato. Secondi: ', q);

            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.calcoloNumeroPagine();
              this.autoFitColumns2('AutoFitColumns1');

              // this.ordinaValoriCombo();

              // this.stampaTempi('Fatto autoFitColumns 1');
            }, 10); * / 
          }
        // });
    /* } else {
      const tm = setTimeout(() => {
        this.calcoloNumeroPagine();
        this.autoFitColumns2('AutoFitColumns2');

        // this.ordinaValoriCombo();

        // this.stampaTempi('Fatto autoFitColumns 2');
      }, 10);
    } */
  }

autofitta() {
  this.impostaGridGenInterna('autofitta');

  return new Promise(resolve => {
    // alert('autofit 3');

    this.esegueAutoFitFisico('Autofitta');
  });
}

autoFitta1Riga = false;

  autoFitColumns2(daChi) {
    // this.stampaTempi('autoFitColumns2');
    // this.scriveLog('Autofit columns II', this.title);

    // this.scriveLog('Dati:', this.GridGen, this.gridData, this.modalita, this.raggruppabileVar);
    // if (this.GridGen !== undefined) {
      // if (this.modalita === 'Griglia' && this.raggruppabileVar) {
      // logConsole('Autofit', this.GridGenInterna.data);
      
      const vecchioTake = JSON.parse(JSON.stringify(this.take));
      if (this.autoFitta1Riga) {
        // logConsole('Take 6', 1);
        this.take = 1;
      }

      let a = new Date().getTime();
      /* const originali = JSON.parse(JSON.stringify(this.GridGenInterna.data['data']));
      const totale = JSON.parse(JSON.stringify(this.GridGenInterna.data['total']));
      if (this.autoFitta1Riga) {
        const riga = this.GridGenInterna.data['data'][0];
        this.GridGenInterna.data = { 
          data: [riga],
          total: 1
        }
      } */

      // logConsole('Autofit', this.GridGenInterna.data);
      /* if (this.autofitSoloRigheIniziali === true) {
        if (this.GridGenInterna) {
          this.righePerAutoFit = this.GridGenInterna.data['data'];
          const r = new Array();
          const righe = this.take > 50 ? 50 : this.take;
          for (let i = 0; i < righe; i++) {
            r.push(this.righePerAutoFit[i]);
          }
          this.GridGenInterna.data['data'] = r;

          // if (this.debugTasto === true) {
            this.scriveLog('Griglia ' + this.maskName + '. Tempo autofit 0', new Date().getTime() - a);
          // }
        }
      }
      a = new Date().getTime() */

      try {
      /* let gridData = this.gridData;
      if (this.paginazione === 'virtual') {
        gridData = this.gridData.data;
      }
      // this.scriveLog('Selezione: ', this.mySelection);
      let foldersSelezionati = '';
      this.mySelection.forEach(element => {
        let ok = true;
        if (gridData !== undefined && gridData.indexOf('empty') === -1) {
          gridData.forEach(element2 => {
            if (ok) {
              if (element2.ROW_ID === element) {
                foldersSelezionati += element2.FOLDER + ';';
                ok = false;
              }
            }
          });
        }
      }); */
      // const d = 'data';
      // this.scriveLog('Folders selezionati', foldersSelezionati);
      //

      /* const vecchioPageable = this.pageable;
      const vecchioRigheAutomatice = this.righeAutomatiche;
      const vecchioPageSizes = this.take;

      this.pageable = true;
      this.righeAutomatiche = false;
      this.take = 20; */

      // const tm = setTimeout(() => {
        logConsole('AUTOFIT: Eseguo autofit fisico. Controllo esistenza griglia');
        if (this.GridGenInterna) {
          // this.scriveLog(this.GridGenInterna);

          // await this.autofitta();
          // this.GridGenInterna.autoFitColumns();

          /* this.ngZone.onStable
          .asObservable()
          .pipe(take(1))
          .subscribe(() => { */
            // logConsole('Autofit column in griglia', daChi, this.maskName);

            // this.impostaGridGenInterna();

            // if (this.GridGenInterna) {
              // alert('autofit 1');

              logConsole('AUTOFIT: Eseguo autofit fisico');
              this.esegueAutoFitFisico('AutofitColumns2');
            // }

            /* setTimeout(() => {
              logConsole(this.GridGenInterna.columnsContainer.allColumns['_results'][2]['_width'])
              this.GridGenInterna.columnsContainer.allColumns['_results'][2]['_width'] = 0;
            }, 100); */

            if (this.autoFitta1Riga) {
              // logConsole('Take 3', vecchioTake);
              this.take = vecchioTake;
            }

            /* if (this.autoFitta1Riga) {
              this.GridGenInterna.data = { 
                data: originali,
                total: totale
              };
              logConsole('Autofit', this.GridGenInterna.data);
            } */
            // this.routineDiCaricamento('ngOnChanges');
          // });

          this.deveFareAutoFit = false;
          // if (this.debugTasto === true) {
            this.scriveLog('Griglia ' + this.maskName + '. Tempo autofit 1', new Date().getTime() - a);
          // }
          a = new Date().getTime()

          /* const tm = setTimeout(() => {
            if (this.autofitSoloRigheIniziali === true) {
              this.GridGenInterna.data['data'] = this.righePerAutoFit;
              // if (this.debugTasto === true) {
                this.scriveLog('Griglia ' + this.maskName + '. Tempo autofit 2', new Date().getTime() - a);
              // }
            }
          }, 10); */

          /* this.pageable = vecchioPageable;
          this.righeAutomatiche = vecchioRigheAutomatice;
          this.take = vecchioPageSizes; */
          
          this.calcolaERitornaDimensioniColonne();
        }
      // }, 100);
      // this.gridData.data.forEach((gr, idx) => this.GridGen.collapseGroup(idx.toString()));
      /* for (let m = 0; m < 500; m = m + 1) {
        let ok = true;
        if (this.GridGenInterna.data[d][m] !== undefined) {
          const nomeFolder = this.GridGenInterna.data[d][m].value;
          if (foldersSelezionati.indexOf(nomeFolder) > -1) {
            ok = false;
          }
        }
        if (ok) {
          if (this.collassaTutto === true) {
            this.GridGenInterna.collapseGroup(m.toString());
          }
        }
      } */
    } catch (e) {
      // if (this.debugTasto === true) {
        logConsole('Autofit column in griglia. ERRORE', daChi, this.maskName, e);

        this.scriveLog('Griglia ' + this.maskName + '. Autofit Error:', e);
      // }
      this.deveFareAutoFit = true;
    }
      // } else {
      //   this.GridGen.autoFitColumns();
      //   this.deveFareAutoFit = false;
      // }
    // } else {
      // this.deveFareAutoFit = true;
      // if (this.modalita === 'Griglia') {
        // this.refreshGridKey();
      //   this.routineDiCaricamento();
      // }
    // }
    // this.stampaTempi('Fatto autoFitColumns2');
  }

  calcolaERitornaDimensioniColonne() {
    this.elaborazioneInCorso = true;
    // alert('accendo 6');

    this.impostaGridGenInterna('calcolaERitornaDimensioniColonne');

    if (this.GridGenInterna && this.GridGenInterna.columnsContainer && this.GridGenInterna.columnsContainer.allColumns && this.GridGenInterna.columnsContainer.allColumns['_results']) {
      const c = this.GridGenInterna.columnsContainer.allColumns['_results'];
      const ritDimensioni = new Array();
      c.forEach(element => {
        if (element.field && element.field !== 'chk') {
          const cc = {
            field: element.field,
            width: element._width
          }
          ritDimensioni.push(cc);
        }
      });
      this.ritornoDimensioniColonne.emit(ritDimensioni);
    }

    this.elaborazioneInCorso = false;
    this.cdRef.detectChanges();
  }

  ngAfterViewChecked() {
    // this.scriveLog('Grid data bound');
  }

  changeCheckBox(e) {
    // this.stampaTempi('change check box');
    if (e.IS_ACTIVE === 'N') {
      e.IS_ACTIVE = 'Y';
    } else {
      e.IS_ACTIVE = 'N';
    }

    // const t = TsEditorExternalComponent.t;
    // t.setSave(true);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }

    gridExtern = gridData;
    // this.stampaTempi('Fatto change check box');
  }

  checkedCheckBox() {

  }

  dataStateChange(state): void {
    this.elaborazioneInCorso = true;
    // alert('accendo 7');

    // this.scriveLog('FILTRO');
    // this.scriveLog(state);

    this.gridSettings.state = state;
    localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_gridSettings', JSON.stringify(state));
    // alert('Imposto pagina 6 ' + this.gridSettings.state);
    // this.stateChanged.emit(this.gridSettings.state);
    const graphColumns = <any>[];
    graphColumns.push(this.data['ColumnProperty'].find(col => col.key === 'TRAILIS'));
    if (graphColumns[0] !== undefined) {
      graphColumns.map(col => this.renderGraph(col.key));
    }

    /* this.data.ColumnProperty.map(col => {
      this.calculateTextSize(col);
    });

    this.gridSettings.state = state; */

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }

    if (state.group.length > 0 || state.sort.length > 0) {
      // this.scriveLog('DataStateChange', gridData, state);

      // Qui prima si eseguiva process(gridData, state) su tutte le righe a ogni ordinamento/raggruppamento, ripetendo
      // il lavoro che fa già kendoGridBinding. Il risultato serviva solo all'export (converteInCSV), che lo ricalcola
      // dallo stato salvato in localStorage poco sopra.

      if (this.permetteDragDrop2 === true) {
        this.currentSubscription.unsubscribe();
        this.zone.onStable.pipe(take(1))
            .subscribe(() => this.currentSubscription = this.handleDragAndDrop());
      }

      this.saveGrid();
    }
  // }
  
    this.elaborazioneInCorso = false;
    this.cdRef.detectChanges();
  }

  getWidth() {
    /* const h: GridComponent = this.gridHTML;
    if (h) {
      const c = h.columnsContainer.allColumns;
      let index = 0;
      c.forEach(element => {
        const w = element.width;
        if (index > 0) {
          this.gridSettings.width[index - 1] = w;
        }
        index++;
      });
      this.saveGrid();
    } */
  }

  public onResize(e: any): void {
    this.calcolaERitornaDimensioniColonne();
    return;
    
    // this.stampaTempi('on resize');
    // if (this.debugTasto === true) {
      this.scriveLog('Griglia ' + this.maskName + '. On resize');
    // }
    const cp = this.data['ColumnProperty'];
    let index = 0;
    let value = 0;
    cp.forEach(element => {
      if (element.key === e[0].column.field) {
        value = index;
      }
      index++;
    });

    // this.gridSettings.width[value] = e[0].newWidth;

    // this.saveGrid();
    // this.stampaTempi('Fatto on resize');
  }

  sorting(e) {
    this.elaborazioneInCorso = true;
    // alert('accendo 8');
    // logConsole('Sort griglia. CTRL: ', '*' + this.premutoCtrl + '*', e);

    if (!this.premutoCtrl) {
      // logConsole('Sort griglia. Prima: ', e, (e.length - 1));
      if (e.length > 0) {
        e = [e[e.length - 1]];
      }
      // logConsole('Sort griglia. Dopo: ', e);
    }
    // logConsole(e);
    this.sorta(e, 'Sorting');
    // this.ordinaValoriCombo();

    this.elaborazioneInCorso = false;
    this.cdRef.detectChanges();
  }

  sorta(e, daDove) {
    if (daDove === 'readAndSetGridSettings') {
      return;
    }
    /* let numCampo = -1;
    let tipo = '';
    let i = 0;
    this.data.ColumnProperty.forEach(element => {
      if (numCampo === -1 && element.key === e[0].field) {
        numCampo = i;
        tipo = element.dataType;
      }
      i++;
    });
    const modif = new Array();
    if (tipo === 'numeric'  || tipo === 'number') {
      this.data.DataTable.forEach(element => {
        let valore = element[e[0].field];
        // if (!isNumeric(valore)) {
          if (!isNumeric(valore) && valore.indexOf('***') > -1) {
            this.scriveLog(element.ROW_ID, valore);

            const m = { riga: element.ROW_ID, valore: valore };
            modif.push(m);

            valore = valore.substring(0, valore.indexOf('***'));
          }
          // const m = { prima: valore, dopo: +valore };
          // modif.push(m);
          element[e[0].field] = +valore;
        // }
      });
    }

    this.scriveLog('Sorting', e, this.gridData, modif);

    const tm = setTimeout(() => {
      // this.scriveLog('Sistemo');
      modif.forEach(element => {
        this.data.DataTable.forEach(element2 => {
          if (+element.riga === +element2.ROW_ID) {
            // this.scriveLog(element2);
            element2[e[0].field] = element.valore;
          }
        });
      });
    }, 100); */

    this.sort = e;

    localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_sort', JSON.stringify(e));
    logConsole('Sort 1: ', e, daDove);
  }

  onReorder(e: any): void {
    this.elaborazioneInCorso = true;
  
    // const reorderedColumn = this.gridSettings.columnsConfig.splice(e.oldIndex, 1);
    // this.gridSettings.columnsConfig.splice(e.newIndex, 0, ...reorderedColumn);
    // if (this.debugTasto === true) { 
      this.impostaGridGenInterna('onReorder');

      this.scriveLog('onReorder: Griglia ' + this.maskName + '. On reorder');
      this.scriveLog('onReorder: Dati spostamento', e, e.column.field);
      this.scriveLog('onReorder: Vecchie colonne', this.columnsAppFiltered);
      this.scriveLog('onReorder: GridGenInterna', this.GridGenInterna);

      const tm = setTimeout(() => {
        clearTimeout(tm);

        const nuoveVisibili = this.GridGenInterna.columnsContainer.allColumns['_results'];
        this.scriveLog('onReorder: Dati', nuoveVisibili);
        let nuova = new Array();
        let conta = 0;
        nuoveVisibili.forEach(element => {
          if (element.field) {
            const nomeCampo = element.field;
            this.columnsAppFiltered.forEach(element2 => {
              if (element2.field === nomeCampo) {
                element2.place = conta;
                nuova.push(element2);
                conta++;
              } else {
                if (element2.hidden === true) {
                  let ok = false;
                  nuova.forEach(element3 => {
                    if (element3.field === element2.field) {
                      ok = true;
                    }
                  });
                  if (!ok) {
                    nuova.push(element2);
                  }
                }
              }
            });
          }
        });
        nuova.sort((a,b) => (a.place - b.place));
        this.columnsAppFilteredNomi = new Array();
        nuova.forEach(element => {
          this.columnsAppFilteredNomi.push(element.field);
        });
        this.scriveLog('onReorder: Dati finali', nuova);
        this.columnsAppFiltered = nuova;
        this.scriveLog('onReorder: Colonne riordinate: ', this.columnsAppFilteredNomi);

        this.scriveImpostazioniColonne(false);

        this.elaborazioneInCorso = false;
        this.cdRef.detectChanges();
      }, 500);
  }

  scriveImpostazioniColonne(svuotaValori) {
    // this.CodiceGriglia = 'VIEW_GEO_TC_RUN'; // TOGLIERE
    // alert(this.CodiceGriglia);

    // logConsole('scriveImpostazioniColonne', this.columnsAppFiltered);
    let lista = new Array();
    if (!svuotaValori) {
      let conta = 0;
      this.columnsAppFiltered.forEach(element => {
        if (element.field !== 'CHECKBOX') {
          const nHide = {
            view_field_name: element.field,
            property_name: 'hide',
            configuration: element.hidden,
            data_type: 1
          }
          lista.push(nHide);
          let conta2 = conta.toString();
          if (conta2.length === 1) { conta2 = '0' + conta2 }
          const nPlace = {
            view_field_name: element.field,
            property_name: 'place',
            configuration: conta2,
            data_type: 1
          }
          conta++;
          lista.push(nPlace);
        }
      });
    } else {
      lista = null;
    }
    logConsole('Column selector: scriveImpostazioniColonne', this.columnsAppFiltered, lista);

    const params = {
      cntx_id: this.sessioneAttuale,
      v_view_name: this.CodiceGriglia,
      v_column_property: lista
    };
    // logConsole('ScriveImpostazioniColonne: ', JSON.stringify(params));
    // return;
    this.apiService.chiamataPost('hci_configuration_rec_column_property_json__set', params)
    // .map(response => response)
    .subscribe(data2 => {
      // logConsole('Column selector: scritteImpostazioniColonne', data2);
      if (data2 && data2 !== null) {
        this.ciSonoColumnHidden = true;
      } else {
      }
    }, error => {
      // logConsole('Column selector: Errore su scritteImpostazioniColonne', error);
      this.scriveLog('Griglia ' + this.maskName + '. Errore salvataggio impostazioni griglia: ', error);
    });
  }

  getColumnsOrdered() {
    /* if (!this.GridGenInterna) {
      return false;
    }
    // alert('Get column order');
    // this.scriveLog('GridGen: ', this.GridGen.columns);

    const ident: string = '_results';
    let colComplete;
    if (this.GridGenInterna && this.GridGenInterna.columns[ident] && this.GridGenInterna.columns[ident][1]) {
      if (this.GridGenInterna.columns[ident][1].children) {
        colComplete = this.GridGenInterna.columns[ident][1].children[ident];
      } else {
        if (this.GridGenInterna.columns[ident][0].children) {
          colComplete = this.GridGenInterna.columns[ident][0].children[ident];
        } else {
          colComplete = null;
        }
      }
    }

    if (colComplete && colComplete !== null) {
      // this.scriveLog('STAMPA GRIGLIA');
      // this.scriveLog(this.columnsAppFiltered);

      const nc1 = new Array();
      colComplete.forEach(element => {
        if (element.field && element.field.trim() !== '') {
          nc1.push(element.title.trim());
        }
      });

      const col: string = this.GridGenInterna.header.nativeElement.innerText;
      const orderedCol = col.split('\n', -1);
      const nc2 = new Array();
      orderedCol.forEach(element1 => {
        const ele = element1.trim();
        if (ele !== '') {
          nc2.push(ele);
        }
      });

      // this.scriveLog(nc1);
      // this.scriveLog(nc2);

      const nc3 = new Array();
      let ok = true;
      let conta = 0;

      nc1.forEach(element1 => {
        ok = true;
        nc2.forEach(element2 => {
          if (ok && element1 === element2) {
            ok = false;
          }
        });
        if (ok) {
          nc3.push(element1);
        } else {
          nc3.push('***' + conta);
          conta++;
        }
      });

      let pos = 0;

      const nc4 = new Array();

      nc3.forEach(element1 => {
        if (element1.indexOf('***') > -1) {
          let number = +(element1.replace('***', ''));
          nc4.push(nc2[pos]);
          pos++;
        } else {
          nc4.push(element1);
        }
      });

      // this.columnsOrdered = nc4;
    }
    // this.scriveLog(this.columnsOrdered); */

    return true;
  }

  hideEmptyCols(e) {
    if (e.target.checked) {
      this.hideEmptyColumns = 'true';
    } else {
      this.hideEmptyColumns = 'false';
    }
    // this.scriveLog('e: ', e);
    // this.scriveLog('empty cols: ', this.hideEmptyColumns);

    // const t = DashboardHeaderComponent.t;
    localStorage.setItem( this.returnUserName() + '_grid_' + this.maskName + '_hideC', this.hideEmptyColumns);
  }

  saveGrid(): void {
    // this.stampaTempi('Save grid');
    // if (this.gridSettings.state.filter.filters[0].value) {
    //   this.gridSettings.state.filter.filters[0].value = new Date(this.gridSettings.state.filter.filters[0].value);
    // }

    const gridConfig = {
      filtered: this.gridSettings.filtered,
      columnsConfig: this.gridSettings.columnsConfig,
      state: this.gridSettings.state
      // width: this.gridSettings.width
    };

    // this.scriveLog('Salvo');

    // this.persistingService.set('gridSettings_' + this.maskName, gridConfig, {type: StorageType.LOCAL});
    // localStorage.setItem('gridSettings_' + this.maskName, s);
    let s: string = JSON.stringify(gridConfig.state);
    /* if (this.premutoCtrl === false) {
      s = '[]';
    } */

    const now = new Date();
    // const t = DashboardHeaderComponent.t;

    // this.cookieService.set( t.returnUserName() + '_grid_' + this.maskName + '_state', s,
    //     new Date(now.getTime() * 1000), '/');

    // if (this.debugTasto === true) {
    // }
    if (this.paginazione !== 'virtual') {
      let ss;
 
      if (!this.premutoCtrl) {
        // logConsole('Sort griglia. Savegrid Prima 1: ', s);
        ss = JSON.parse(s);
        
        if (ss.sort) {
          // logConsole('Sort griglia. Savegrid Prima 2: ', ss);
          if (ss.sort.length > 0) {
            const sort = [ss.sort[ss.sort.length - 1]];
            ss.sort = sort;
          }
          if (ss.sort.length > 0) {
            this.sort = ss.sort;
          } else {
            this.sort = [ss.sort];
          }
          // logConsole('Sort 2: ', this.sort);
        }

        // logConsole('Sort griglia. Savegrid Dopo: ', ss);
        ss = JSON.stringify(ss);
      } else {
        /* if (s.length > 0) {
          ss = s;
        } else {
          ss = [s];
        } */
        if (ss && ss !== null && ss !== 'undefined' && ss !== 'null') {
          this.sort = JSON.parse(ss);
        }
        // logConsole('Sort 3: ', this.sort);
      }
      this.scriveLog('Griglia ' + this.maskName + '. Filtro impostato', this.sort);
  
      localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_state', ss);
    }

    // s = JSON.stringify(this.filter); // gridConfig.filtered
    // this.cookieService.set('grid_' + this.maskName + '_filter', s,
    //     new Date(now.getTime() * 1000), '/');

    // s = JSON.stringify(gridConfig.filtered); // gridConfig.filtered
    // this.cookieService.set( t.returnUserName() + '_grid_' + this.maskName + '_filtered', s,
    //     new Date(now.getTime() * 1000), '/');

    // localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered', this.rowButtonsConfig2.showFilter ? 'S' : 'N');

    this.filter = gridConfig.state.filter;

    localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered', this.filter === true ? 'S' : 'N');

    // this.scriveLog('Filtro scritto:');
    // console.log (this.filter.filters[0].value);

    // s = JSON.stringify(gridConfig.columnsConfig);
    /* let index = 0;
    while (s.length > 1500) {
      this.cookieService.set('grid_' + this.maskName + '_columns_' + index, s.substring(0, 1499),
        new Date(now.getTime() * 1000), '/');
      index++;
      s = s.substring(1500, s.length);
    } */
    // this.cookieService.set('grid_' + this.maskName + '_columns', s,
    //     new Date(now.getTime() * 1000), '/');

    // s = JSON.stringify(gridConfig.width);
    // this.cookieService.set('grid_' + this.maskName + '_width', s);

    if (this.filter && this.filter.filters && this.filter.filters.length > 0) {
      this.showSettedFilter = true;
    } else {
      this.showSettedFilter = false;
    }

    this.loadedGridSettings = true;

    this.clickOnMenu2 = false;
    // this.stampaTempi('Fatto Save grid');

    /* const tm = setTimeout(() => {
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Ordino valori combo');
      // }
      this.ordinaValoriCombo();
    }, 100); */

  }

  public resetGrid(): void {
  }

  checkText(t) {
    if (t.indexOf('"') > -1) {
      t = t.replace('"', '');
    }
    if (t.indexOf('\'') > -1) {
      t = t.replace('\'', '');
    }

    return t;
  }

  saveGridValues() {
    // Nessuna copia di confronto: la griglia non è modificabile
    if (!this.gridDataBeforeEditing) {
      return;
    }
    // this.stampaTempi('Save grid values');
    // Nome della griglia copiata originale dalla quale fare confronti
    // this.gridDataBeforeEditing

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }

    let index = 0;
    let q = 0;
    let newGrid = '[';
    while (index < gridData.length) {
      const element = JSON.stringify(gridData[index]);
      const element2 = JSON.stringify(this.gridDataBeforeEditing[index]);
      if (element !== element2) {
        if (gridData[index].CHANGE_STATUS !== '') {
          let n = JSON.stringify(element);
          while (n.indexOf('§') > -1) {
            n = n.replace('§', '.');
          }
          while (n.indexOf('\\') > -1) {
            n = n.replace('\\', '');
          }
          n = n.substring(0, n.length - 1);
          n = n.substring(1, n.length);

          newGrid += n + ',';
          q++;
        }
      }
      index++;
    }
    let ng;
    if (q > 0) {
      newGrid = newGrid.substring(0, newGrid.length - 1);
      newGrid += ']';

      newGrid = '{ "DataTable": ' + newGrid + '}';
      ng = JSON.parse(newGrid);

      // this.scriveLog(newGrid);

      if (q > 0) {
        let viewId = '';

        /* if (this.maskName === 'sim-manager') {
          viewId = 'VIEW_SIM_FULL';
        }

        this.apiService.getCommitData(viewId, newGrid)
        .map(response => response.json())
        .subscribe(data => {
          if (data.RESULT && data.RESULT[0].Message.toUpperCase() === 'OK') {
            let index2 = 0;
            this.gridData.forEach(element => {
              this.gridData[index2].CHANGE_STATUS = '';
              index2++;
            });
            // this.scriveLog(this.gridData);
            this.gridDataBeforeEditing = JSON.parse(JSON.stringify(this.gridData));
            // GeneralComponent.rowsModified = false;
            this.rowsEdited = false;

            this.gridGeneral.reloadGrid(this.maskName, null);

            this.scriveLog('Rows saved: ' + q);
          } else {
            if (data.RESULT !== undefined) {
              this.scriveLog(data.RESULT[0].Message);
              const rID = data.RESULT[0].RowId;
            } else {
              this.scriveLog('Error. No response from server');
            }
          }
        }, error => {
          this.scriveLog('Error: '  + error);
        }); */
      } else {
        // ng = null;
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Rows edited: 0');
        // }
      }

      if (this.lastEdited > -1) {
        this.editMode[this.lastEdited] = false;
      }
      // this.showSave = false;

      this.clickOnMenu1 = false;
    } else {
      this.rowsEdited = false;
      // GeneralComponent.rowsModified = false;
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. No rows to be saved');
      // }
    }
    // this.stampaTempi('Fatto Save grid values');
  }

  checkIfIsPresentsInList(value, fields) {
    // this.stampaTempi('check if is presents in list');
    let ret = false;

    fields.forEach(element => {
      if (value.trim() === element.trim()) {
        ret = true;
      }
    });

    // this.stampaTempi('Fatto check if is presents in list');
    return ret;
  }

  updateCheckList(column, value, type, rowID, domain, domainType) {
    // this.stampaTempi('Update check list');
    this.dontSave = true;
    this.colSelected = column;
    this.rowSelected = rowID;

    let retSel: string = '';
    let retUns: string = '';
    const fields = value.split(',');

    this.lookUp.forEach(element => {
      if (element.CATEGORY === domain) {
        let e = '';
        let checked = 'false';

        if (this.checkIfIsPresentsInList(element.VALUE_STR, fields)) {
          checked = 'true';
          e = '{"CATEGORY": "' + element.CATEGORY + '", "VALUE_STR": "' + element.VALUE_STR + '", "CHECKED": "' + checked + '"},';
          retSel += e;
        } else {
          checked = 'false';
          e = '{"CATEGORY": "' + element.CATEGORY + '", "VALUE_STR": "' + element.VALUE_STR + '", "CHECKED": "' + checked + '"},';
          retUns += e;
        }
      }
    });

    if (retSel.length > 0) {
      retSel = '[' + retSel.substring(0, retSel.length - 1) + ']';
      retSel = JSON.parse(retSel);
      this.checkListRowsSel = retSel;
    } else {
      this.checkListRowsSel = null;
    }

    if (retUns.length > 0) {
      retUns = '[' + retUns.substring(0, retUns.length - 1) + ']';
      retUns = JSON.parse(retUns);
      this.checkListRowsUnsel = retUns;
    } else {
      this.checkListRowsUnsel = null;
    }

    if (this.checkListRowsSel !== null || this.checkListRowsUnsel !== null)  {
      this.orderList();
    }

    this.showCheckList = true;

    this.enableSave();
    // this.stampaTempi('Fatto Update check list');
  }

  orderList() {
    // this.stampaTempi('Order list');
    if (this.checkListRowsSel !== null) {
      this.checkListRowsSel.sort(function (a, b) {
        a = a.VALUE_STR;
        b = b.VALUE_STR;
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        }
        return 0;
      });
    }

    if (this.checkListRowsUnsel !== null) {
        this.checkListRowsUnsel.sort(function (a, b) {
        a = a.VALUE_STR;
        b = b.VALUE_STR;
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        }
        return 0;
      });
    }
  }

  clickCheckList(selected, field) {
    // this.stampaTempi('Click check list');
    let retSel: string = '';
    let retUns: string = '';

    if (this.checkListRowsSel !== null) {
      this.checkListRowsSel.forEach(element => {
        let e = '';
        if (element.VALUE_STR === field) {
          if (element.CHECKED === 'true') {
            e = '{"CATEGORY": "' + element.CATEGORY + '", "VALUE_STR": "' + element.VALUE_STR + '", "CHECKED": "false"},';
            retUns += e;
          } else {
            e = '{"CATEGORY": "' + element.CATEGORY + '", "VALUE_STR": "' + element.VALUE_STR + '", "CHECKED": "true"},';
            retSel += e;
          }
        } else {
          e = '{"CATEGORY": "' + element.CATEGORY + '", "VALUE_STR": "' + element.VALUE_STR + '", "CHECKED": "true"},';
          retSel += e;
        }
      });
    }

    if (this.checkListRowsUnsel !== null) {
      this.checkListRowsUnsel.forEach(element => {
        let e = '';
        if (element.VALUE_STR === field) {
          if (element.CHECKED === 'true') {
            e = '{"CATEGORY": "' + element.CATEGORY + '", "VALUE_STR": "' + element.VALUE_STR + '", "CHECKED": "false"},';
            retUns += e;
          } else {
            e = '{"CATEGORY": "' + element.CATEGORY + '", "VALUE_STR": "' + element.VALUE_STR + '", "CHECKED": "true"},';
            retSel += e;
          }
        } else {
          e = '{"CATEGORY": "' + element.CATEGORY + '", "VALUE_STR": "' + element.VALUE_STR + '", "CHECKED": "false"},';
          retUns += e;
        }
      });
    }

    if (retSel.length > 0) {
      retSel = '[' + retSel.substring(0, retSel.length - 1) + ']';
      retSel = JSON.parse(retSel);
      this.checkListRowsSel = retSel;
    } else {
      this.checkListRowsSel = null;
    }

    if (retUns.length > 0) {
      retUns = '[' + retUns.substring(0, retUns.length - 1) + ']';
      retUns = JSON.parse(retUns);
      this.checkListRowsUnsel = retUns;
    } else {
      this.checkListRowsUnsel = null;
    }

    if (this.checkListRowsSel !== null || this.checkListRowsUnsel !== null) {
      this.orderList();
    }
    // this.stampaTempi('Fatto Click check list');
  }

  saveCheckList() {
    // this.stampaTempi('Save check list');
    let newValue = '';

    if (this.checkListRowsSel !== null) {
      this.checkListRowsSel.forEach(element => {
        // if (element.CHECKED === 'true') {
          newValue += element.VALUE_STR + ',';
        // }
      });
    }
    if (newValue.length > 0) {
      newValue = newValue.substring(0, newValue.length - 1);
    }

    this.putValueInGrid(newValue, this.colSelected, this.rowSelected);

    this.colSelected = '';
    this.rowSelected = '';

    this.showCheckList = false;

    this.enableSave();
    // this.stampaTempi('Fatto Save check list');
  }

  cancelGridValues() {
    // Nessuna copia da ripristinare: la griglia non è modificabile
    if (!this.gridDataBeforeEditing) {
      return;
    }
    if (!this.selezioneMultipla2) {
      Swal.fire({
        title: 'Confirm',
        text: 'Are you sure to discard changes ?',
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
          if (this.lastEdited > -1) {
            // this.editMode[this.lastEdited] = false;
            let index = 0;
            this.editMode.forEach(element => {
              this.editMode[index] = false;
              index++;
            });
          }
          // GeneralComponent.rowsModified = false;
          this.rowsEdited = false;

          if (this.paginazione === 'virtual') {
            this.gridData.data = JSON.parse(JSON.stringify(this.gridDataBeforeEditing));
          } else {
            this.gridData = JSON.parse(JSON.stringify(this.gridDataBeforeEditing));
          }

          this.clickOnMenu1 = false;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } else {
      if (this.lastEdited > -1) {
        // this.editMode[this.lastEdited] = false;
        let index = 0;
        this.editMode.forEach(element => {
          this.editMode[index] = false;
          index++;
        });
      }
      // GeneralComponent.rowsModified = false;
      this.rowsEdited = false;

      if (this.paginazione === 'virtual') {
        this.gridData.data = JSON.parse(JSON.stringify(this.gridDataBeforeEditing));
      } else {
        this.gridData = JSON.parse(JSON.stringify(this.gridDataBeforeEditing));
      }

      this.clickOnMenu1 = false;
    }

    /* if (confirm('Are you sure to discard changes ?')) {
      if (this.lastEdited > -1) {
        // this.editMode[this.lastEdited] = false;
        let index = 0;
        this.editMode.forEach(element => {
          this.editMode[index] = false;
          index++;
        });
      }
      // GeneralComponent.rowsModified = false;
      this.rowsEdited = false;

      if (this.paginazione === 'virtual') {
        this.gridData.data = JSON.parse(JSON.stringify(this.gridDataBeforeEditing));
      } else {
        this.gridData = JSON.parse(JSON.stringify(this.gridDataBeforeEditing));
      }

      this.clickOnMenu1 = false;
    } */
  }

  setChangeStatus(nn, s, refresh) {
    // this.stampaTempi('Set change status');
    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    const element = gridData[nn];
    let n = JSON.stringify(element);
    if (n.indexOf('CHANGE_STATUS') === -1 && element.CHANGE_STATUS !== undefined) {
      while (n.indexOf('\\') > -1) {
        n = n.replace('\\', '');
      }

      // n = n.replace('{"ROW_ID"', '{"CHANGESTATUS":"' + s + '", "ROW_ID"');
      gridData[nn] = JSON.parse(n);
    } else {
      gridData[nn].CHANGE_STATUS = s;
    }

    if (refresh) {
      this.refreshGrid();
    }
    // this.stampaTempi('Fatto Set change status');
  }

  refreshGrid() {
    // this.stampaTempi('Refresh grid');
    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    const gd = JSON.parse(JSON.stringify(gridData));
    const c = this.columns;
    if (this.paginazione === 'virtual') {
      gridData.data = null;
    } else {
      gridData = null;
    }
    this.columns = null;

    /* if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
    this.subscribe = Observable.timer(0, 10)
      .take(1)
      .subscribe(() => {
        if (this.paginazione === 'virtual') {
          gridData.data = gd;
          // this.stampaTempi('Fatto Refresh grid virtual');
        } else {
          gridData = gd;
          // this.stampaTempi('Fatto Refresh grid');
        }
        this.columns = c;
    }); */

    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (this.paginazione === 'virtual') {
        gridData.data = gd;
        // this.stampaTempi('Fatto Refresh grid virtual');
      } else {
        gridData = gd;
        // this.stampaTempi('Fatto Refresh grid');
      }
      this.columns = c;
    }, 100);
  }

  setNotDeleteRow(nn) {
    this.setChangeStatus(nn, '', true);
    this.enableSave();
  }

  setDeleteRow(nn) {
    this.setChangeStatus(nn, 'D', true);
    this.enableSave();
  }

  putValueInGrid(newValue, col, row) {
    // this.stampaTempi('Put value in grid');
    if (this.paginazione === 'virtual') {
      this.gridData.data[row - 1][col] = newValue;

      this.gridData.data[row - 1].CHANGE_STATUS = 'U';
    } else {
      this.gridData[row - 1][col] = newValue;

      this.gridData[row - 1].CHANGE_STATUS = 'U';
    }
    // this.setChangeStatus(row, 'U', true);

    this.enableSave();
    // this.stampaTempi('Fatto Put value in grid');
  }

  createArray() {
    /*
      // this.stampaTempi('Create array');
    // this.scriveLog('CreateArray 1', this.columnsAppFiltered);
    // this.scriveLog('CreateArray 1.5', this.columnsApp2);

    // this.scriveLog('R:', r);
    // this.scriveLog('F:', this.filterForColumn);

    // if (this.filterForColumn !== '') {
      // this.filterForColumn = r;
      const val = new Array();
      let ric = '';
      if (this.filterForColumn) {
        ric = this.filterForColumn.toUpperCase();
      }

      this.columnsApp2.forEach(element => {
        if ((element.title + '').toUpperCase().indexOf(ric) > -1) {
          // this.scriveLog('TROVATO: ' + element.title);
          const ele = element;
          let Ok = false;
          this.columnsAppFiltered.forEach(element2 => {
            // this.scriveLog('  ', element.title + '->' + element2.title);
            if (!Ok && (element.title + '').toUpperCase() === (element2.title + '').toUpperCase()) {
              // this.scriveLog('TROVATO 1: ' + ele);
              ele.hidden = element2.hidden;
              Ok = true;
              val.push(ele);
            }
          });
          if (!Ok) {
            val.push(ele);
          }
        }
      });
      // this.scriveLog('CREATE 1');
      // this.scriveLog(val);

      this.columnsAppFiltered = val;
      // this.scriveLog('CreateArray 2', this.columnsAppFiltered);
      // } else {
      // this.scriveLog('CREATE 2');
      // this.scriveLog(this.columnsApp);

      // this.columnsAppFiltered = this.columnsApp;
    // }
      // this.stampaTempi('Fatto Create array');
      */
  }

  editGridOnOff() {
    /*
    this.isAlreadyLoaded = false;
    // if (this.editGridOn && GeneralComponent.rowsModified) {
    if (this.editGridOn) {
      if (confirm('Are you sure to discard changes ?')) {
        this.editGridOn = false;
        // GeneralComponent.rowsModified = false;
        this.rowsEdited = false;
      }
    } else {
      this.editGridOn = !this.editGridOn;
    }

    if (!this.editGridOn) {
      let index = 0;
      this.editMode.forEach(element => {
        this.editMode[index] = false;
        index++;
      });

      // this.editMode[this.lastEdited] = false;
      // GeneralComponent.rowsModified = false;
      this.lastEdited = -1;
      if (this.paginazione === 'vitual') {
        this.gridData.data = JSON.parse(JSON.stringify(this.gridDataBeforeEditing));
      } else {
        this.gridData = JSON.parse(JSON.stringify(this.gridDataBeforeEditing));
      }

      this.clickOnMenu1 = false;

      // this.columns = this.originalColumns;

      // console.log (this.columns);
      this.refreshGrid();

      this.take = this.appoTake;
      logConsole('Settaggi pagina griglia ' + this.maskName + ':  editGridOnOff', this.take);

      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Impostato take 5: ', this.take);
      // }

      this.numeroRighePagina.emit(this.take);
    } else {
      if (this.showColumnHiderAndOrderGrid && !this.modifiedColumns) {
        let index = 0;
        if (this.data && this.data.ColumnProperty)  {
          const n: number = this.data.ColumnProperty.length;
          while (index < n) {
            this.columns[index].hidden = false;
            index++;
          }
        }
      }
      // console.log (this.columns);

      this.refreshGrid();

      this.appoTake = this.take;
      this.take = 10;
      logConsole('Settaggi pagina griglia ' + this.maskName + ':  editGridOnOff2', this.take);

      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Impostato take 6: ', this.take);
      // }

      this.numeroRighePagina.emit(this.take);
    } */
  }

  checkTextField(d, c) {
    if (!d) {
      return;
    }

    const row = d.ROW_ID;

    // this.stampaTempi('Check text field');
    if (row === this.lastEdited) {
      if (c.field !== 'IS_EDITABLE') {
        if (c.field !== 'CHANGE_STATUS') {
          if (c.domainType === '0' || c.domainType === '8' || c.domainType === '21') {
            // this.stampaTempi('Fatto Check text field: ' + c.domainType);
            return true;
          } else {
            // this.stampaTempi('Fatto Check text field 1');
            return false;
          }
        } else {
          // this.stampaTempi('Fatto Check text field 2');
          return false;
        }
      } else {
        // this.stampaTempi('Fatto Check text field 3');
        return false;
      }
    } else {
      // this.stampaTempi('Fatto Check text field 4');
      return false;
    }
  }

  prendeAllineamentoCella(c) {
    if (this.limitaRighe) {
      if (!this.limitaRighe.allineamentiVari) {
        return 'left';
      }
    }

    let allineamento = 'left';
    if (c && c.dataType) {
      if (c.dataType.toUpperCase() === 'NUMERIC' || c.dataType.toUpperCase() === 'NUMBER') {
        allineamento = 'right';
      } else {
        allineamento = 'left';
      }
    }
    // this.scriveLog(c.title, c.dataType, allineamento);
    return allineamento;
  }

  prendePaddingCella(c) {
    let padding = '0px';
    if (c && c.dataType) {
      if (c.dataType.toUpperCase() === 'NUMERIC' || c.dataType.toUpperCase() === 'NUMBER') {
        padding = '4px';
      } else {
        padding = '0px';
      }
    }
    // this.scriveLog(c, allineamento);
    return padding;
  }


  prendeStileHeader(c) {
    // this.scriveLog(c);
    let allineamento = '';
    if (c && c.dataType) {
      // logConsole(c.field);
      let altro = '';
      if (c.dataType.toUpperCase() === 'NUMERIC' || c.dataType.toUpperCase() === 'NUMBER') {
        allineamento = 'right';
        // altro = ', "padding": "0px !important"'
      } else {
        allineamento = 'left';
      }
      const ret = '{"font-size" : "12px", "text-align": "' + allineamento + '" ' + altro + '}';
      // this.scriveLog(ret);
      return JSON.parse(ret);
    } else {
      const ret = '{"font-size" : "12px", "text-align": "left"}';

      return JSON.parse(ret);
    }
  }

  checkNumberField(d, c, ) {
    if (!d) {
      return;
    }

    const row = d.ROW_ID;

    // this.stampaTempi('Check number field');
    if (row === this.lastEdited) {
      if (c.field !== 'IS_EDITABLE') {
        if (c.field !== 'CHANGE_STATUS') {
          if (c.domainType === '4') {
            // this.stampaTempi('Fatto Check number field 1');
            return true;
          } else {
            // this.stampaTempi('Fatto Check number field 2');
            return false;
          }
        } else {
          // this.stampaTempi('Fatto Check number field 3');
          return false;
        }
      } else {
        // this.stampaTempi('Fatto Check number field 4');
        return false;
      }
    } else {
      // this.stampaTempi('Fatto Check number field 5');
      return false;
    }
  }

  getDeleteOn(dataItem, column) {
    // if (row === this.lastEdited) {
      if (this.editGridOn) {
        if (this.deletableRow[dataItem.ROW_ID - 1] === true)   {
          if (column.field === 'IS_DELETABLE') {
            if (dataItem.CHANGE_STATUS === null || dataItem.CHANGE_STATUS === '' ||
              dataItem.CHANGE_STATUS === 'E' || dataItem.CHANGE_STATUS === 'U') {
                return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      }  else {
        return false;
      }
    // }  else {
    //   return false;
    // }
  }

  // showtextField(dataItem, column) {

    // !editMode[dataItem.ROW_ID] || dataItem.CHANGE_STATUS == 'D' || checkEditableCell(columnIndex) == false ||
    // (!editMode[dataItem.ROW_ID] && (dataItem.CHANGE_STATUS == '' || dataItem.CHANGE_STATUS == 'D' || dataItem.CHANGE_STATUS == 'U')) ||
    // (column.field == 'IS_EDITABLE' || column.field == 'IS_DELETABLE') &&
    // column.field != 'TRAILIS' &&
    // column.field != 'TRAILISDAY' && !column.hiddenLabel && column.dataType != 'checkBox'
  // }

  getDeleteUndoOn(dataItem, column) {
    // if (row === this.lastEdited) {
      if (this.editGridOn) {
        if (this.deletableRow[dataItem.ROW_ID] === true) {
          if (column.field === 'IS_DELETABLE') {
            if (dataItem.CHANGE_STATUS === 'D') {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    // } else {
    //   return false;
    // }
  }

  getIconUndoEditOff(dataItem, column) {
    if (!dataItem) {
      return;
    }

    const row = dataItem.ROW_ID;

    if (row === this.lastEdited) {
      if (this.editGridOn) {
        if (this.editableRow[dataItem.ROW_ID] === true) {
          if (column.field === 'IS_EDITABLE') {
            if (dataItem.CHANGE_STATUS === 'U') {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getIconEditOn(dataItem, column) {
    if (!dataItem) {
      return;
    }

    const row = dataItem.ROW_ID;

    if (row === this.lastEdited) {
      if (this.editGridOn) {
        if (this.editableRow[dataItem.ROW_ID - 1] === true) {
          if (column.field === 'IS_EDITABLE') {
            if (dataItem.CHANGE_STATUS === null || dataItem.CHANGE_STATUS === '' || dataItem.CHANGE_STATUS === 'D') {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else  {
      return false;
    }
  }

  checkEditableCell(name) {
    let ret = null;
    let preso = null;
    if (this.data && this.data.ColumnProperty)  {
      this.data.ColumnProperty.forEach(element => {
        if (ret === null) {
          if (element.key.toUpperCase().trim() === name.toUpperCase().trim().replace('§', '.')) {
            ret = element.IsEditable;
            preso = true;
          }
        }
      });
    }
    if (preso === null) {
      const i = 0;
    }
    return ret;
  }

  checkIfEditable(d, c) {
    if (!d) {
      return;
    }

    const r = d.ROW_ID;

    if (this.editable === true) {
      if (r === this.lastEdited) {
        if (this.editMode[d.ROW_ID]) {
          if (this.checkEditableCell(c) === 'true') {
            if ((d.CHANGE_STATUS === null || d.CHANGE_STATUS === '' || d.CHANGE_STATUS === 'E' || d.CHANGE_STATUS === 'U')) {
              this.editableCell = true;
              return true;
            } else {
              this.editableCell = false;
              return false;
            }
          } else {
            this.editableCell = false;
            return false;
          }
        } else {
          this.editableCell = false;
          return false;
        }
      } else {
        this.editableCell = false;
        return false;
      }
    } else {
      this.editableCell = false;
      return false;
    }
  }

  enableSave() {
    // if (GeneralComponent.rowsModified === false) {
    //   GeneralComponent.rowsModified = true;
      this.rowsEdited = true;
    // }
  }

  setNotEditRow(n) {
    if (this.editable && this.editGridOn) {
      let Ok = true;

      if (this.rowsEdited) {
        if (confirm('Are you sure to discard changes ?')) {
          Ok = true;
        }
      }

      if (Ok) {
        const r = this.gridDataBeforeEditing[n - 1];
        if (this.paginazione === 'virtual') {
          this.gridData.data[n - 1] = {...r};
        } else {
          this.gridData[n - 1] = {...r};
        }

        this.editMode[n - 1] = false;
        // this.lastEdited = n;

        this.setChangeStatus(n - 1, '', true);

        // this.gridGeneral.setAutoFit(this.maskName);
      }
    }
  }

  setEditRow(n) {
    if (this.editable && this.editGridOn) {
      if (this.lastEdited > -1) {
        this.editMode[this.lastEdited] = false;
      }
      this.editMode[n] = !this.editMode[n];
      this.lastEdited = n;
    }
  }

  /* stampaTempi(Cosa) {
    if (this.stampaTempiGrid === false) {
      return;
    }

    const a = new Date().getTime();
    if (Cosa.toUpperCase().indexOf('INIZIO') > -1) {
      this.scriveLog('***INIZIO TEMPI*** ' + Cosa, 0);
      this.inizioTMS = a;
    } else {
      if (Cosa.toUpperCase().indexOf('FINE') > -1) {
        this.scriveLog('***FINE TEMPI*** ' + Cosa, a - this.inizioTMS);
      } else {
        this.scriveLog('***TEMPI*** ' + Cosa, a - this.vecchioTMS);
      }
    }
    this.vecchioTMS = a;
  } */

  ultimaSelezione;

  cellClickOnGrid(ee) {
    // alert('click su riga');
    // return;

    if (this.clickatoSuIcona === true) {
      this.clickatoSuIcona = false;
      return;
    }

    this.lastSelected = ee;

    if (this.selezioneMultipla === true && this.eliminaSelezioniSuClickRiga2) {
      // logConsole('Selezionato', ee);
      // logConsole('Selezione', this.mySelection);

      const sel = [ee.dataItem];
      const desel = new Array();
      let gridData = this.gridData;
      if (this.paginazione === 'virtual') {
        if (this.gridData.data.data) {
          gridData = this.gridData.data.data;
        } else {
          gridData = this.gridData.data;
        }
      }
      this.mySelection.forEach(element => {
        let ok = false;
        if (gridData !== undefined) {
          gridData.forEach(element2 => {
            if (!ok) {
              if (element === element2.ROW_ID) {
                ok = true;
                desel.push(element2);
              }
            }
          });
        }
      });
      // logConsole('Selezione', sel);
      // logConsole('DeSelezione', desel);
      // alert('1');
      this.mySelection = [ee.dataItem.ROW_ID];
      // alert('Selection 4: ' + JSON.stringify(ee.dataItem.ROW_ID));
      this.selectedRow = JSON.stringify(ee.dataItem.ROW_ID);

      // this.creaRitornoSelezionati(sel, desel);

      if (this.showPopup === true) {
        this.scriveInfoAVideo();
      }

      this.cellClick.emit(ee.dataItem);
      return false;
    }
    
    // // logConsole('click 1:', this.attesaClick);

    if (this.attesaClick === true) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.disegnaDivAttesa = true;
        const tm1 = setTimeout(() => {
          clearTimeout(tm1);
          this.disegnaDivAttesa = false;
          this.cdRef.markForCheck();
        }, this.tempoRipristinoAttesa);
      }, 0);
    }

    // return;
    // // logConsole('click su riga:', ee);
    // logConsole(ee);
    // let orGrid;
    // this.stampaTempi('Inizio Cell click on grid');
    // // logConsole('click 2');

    const tm = setTimeout(() => {
      clearTimeout(tm);
      // logConsole('1');
      // logConsole('click 3', ee.type, this.itemsMenu);
      if (ee.type === 'contextmenu' && this.itemsMenu) {
        // // logConsole('click 4');
        const originalEvent = ee.originalEvent;

        originalEvent.preventDefault();

        this.contextItem = ee.dataItem;

        // if (this.gridContextMenu) {
        this.gridContextMenu.show({ left: originalEvent.pageX, top: originalEvent.pageY });
        // }
        // logConsole(this.itemsMenu);
      }
      // logConsole('2');

      this.premutoShiftSuSelezione = ee.originalEvent.shiftKey;

      let mySelection2 = new Array();;
      // logConsole(this.eliminaSelezioniSuClickRiga);

      let d = this.gridData;
      if (this.paginazione === 'virtual') {
        d = this.gridData.data;
      }
      // logConsole(d);

      // logConsole('click 4');
      if (this.selezioneMultipla === false) {
        // logConsole('click 5');
        if (this.eliminaSelezioniSuClickRiga) {
          // logConsole('click 6');
          if (d) {
            d.forEach(element => {
              if (element && ee.dataItem && element.ROW_ID === ee.dataItem.ROW_ID) {
                // logConsole('click 65', element.ROW_ID, ee.dataItem.ROW_ID);
                if (element.ROW_ID || +element.ROW_ID === 0) {
                  // logConsole('click 67', element.ROW_ID);
                  if (this.debug === true) {
                    logConsole('Aggiungo id ', element.ROW_ID);
                  }
                  mySelection2.push(element.ROW_ID);
                } else {
                  // logConsole('click 69', element.ROW_ID);
                  if (this.debug === true) {
                    logConsole('ROW ID non rilevato', d, ee.dataItem);
                  }
                }
              }
            });
          }
        } else {
          // logConsole('click 55');
          if (this.debug === true) {
            logConsole('Aggiungo indice attuale', ee.dataItem.ROW_ID);
          }
          mySelection2.push(ee.dataItem.ROW_ID);
        }
      } else {
        // logConsole('click 45');
        // alert(this.eliminaSelezioniSuClickRiga2);
        if (this.eliminaSelezioniSuClickRiga) {
          // logConsole('click 47');
          if (this.debug === true) {
            logConsole('Pulisco array e aggiungo id', ee.dataItem.ROW_ID);
          }
          mySelection2.push(ee.dataItem.ROW_ID);
        } else {
          // logConsole('click 49');
          if (this.debug === true) {
            logConsole('Aggiungo vecchi indici', this.mySelection);
          }
          mySelection2 = this.mySelection; // [ee.dataItem.ROW_ID]; // 
        }
      }
    // this.stampaTempi('Riempimento selezione effettuata: ' + this.mySelection);
    // logConsole('3');
    // logConsole(mySelection2);
    // if (this.eliminaSelezioniSuClickRiga === true) {
      this.mySelection = mySelection2;
      // alert('Selection 5: ' + JSON.stringify(mySelection2));
      this.rigaSelezionataPerDelta = ee.dataItem;

      // logConsole('Selezione in corso:', this.mySelection);
      // logConsole('Premuto shift:', shift);

      this.selectedRow = JSON.stringify(ee.dataItem.ROW_ID);
      // logConsole('Riga premuta: ', JSON.stringify(e.dataItem));

      // if (localStorage.getItem(this.maskName + '_' + DashboardHeaderComponent.userName + '_loading') === 'false') {
      // logConsole('4');
      if (this.editable && this.editGridOn && ee.dataItem.IS_EDITABLE === 'Y') {
        /* if (this.lastEdited > -1) {
          this.editMode[this.lastEdited] = false;
        }

        this.editMode[e.dataItem.ROW_ID] = !this.editMode[e.dataItem.ROW_ID];
        this.lastEdited = e.dataItem.ROW_ID;

        this.gridGeneral.setAutoFit(this.maskName); */
        this.setEditRow(ee.dataItem.ROW_ID);
      } else {
        // // logConsole('click su cella');
        // logConsole(e);
        // if (ee.dataItem.Empty !== 'No items selected') { // 27/10
          this.selectedElement = ee.dataItem;
          // this.lastSelected = ee;

          this.loadDatas(true);
        // }
      }
      // logConsole('5');
      // this.stampaTempi('Acquisita riga');

      // this.toConfirm = true;
      if (this.selezioneMultipla2 && this.eliminaSelezioniSuClickRiga2) {
        const q = this.mySelection.length;
        // this.scriveLog('Selezionati: ', q);
        if (q > 0) {
          this.toConfirm = true;
        } else {
          this.toConfirm = false;
        }
      } else {
        this.toConfirm = true;
      }

      // logConsole(this.mySelection, d);

      let ret = '[';
      this.mySelection.forEach(element => {
        d.forEach(element2 => {
          if (element === element2.ROW_ID) {
            ret += JSON.stringify(element2) + ',';
          }
        });

        /* if (this.gridData[element + 1] && this.gridData[element + 1] !== undefined  && this.gridData[element + 1] !== 'undefined') {
          if (element -1 >= 0) {
            ret += JSON.stringify(this.gridData[element + 1]) + ',';
          } else {
            logConsole('ANTSGRID: Element 0 non valido nell\'array di selezione ', this.mySelection);
          }
        } */
      });
      // logConsole('6');
      // this.stampaTempi('Creata stringa di ritorno JSON da selezione');
      if (this.selezioneMultipla === true) {
          // logConsole('Emissione su click 3: ', r);

          this.cellClick.emit(ee.dataItem);
      } else {
        if (ret.length > 3 && ret !== '[undefined') {
          ret = ret.substring(0, ret.length - 1);
          ret += ']';
          const r = JSON.parse(ret);

          // logConsole('Emissione su click 1: ', r);

          this.cellClick.emit(r);
        } else {
          // logConsole('Emissione su click 2: ', e);

          this.cellClick.emit(ee);
        }
      }
      // this.stampaTempi('Fatto emit');
      // logConsole('7');
      // logConsole('Scive info a video', this.showPopup);

      if (this.showPopup === true) {
        this.scriveInfoAVideo();
      }
      // logConsole('8');

      /* if (this.gridDataAppoggio) {
        this.gridData = JSON.parse(JSON.stringify(orGrid));
      } */

      // logConsole('9');
      if (ee.originalEvent.which === 3) {
        // logConsole('9.5');
        // logConsole('Destro');
        ee.originalEvent.stopPropagation();
        // return false;
      }
      // logConsole('10');
      // this.stampaTempi('Fine click');
    }, 0);

    return false;
  }

  /* cellClickOnGridVECCHIA(ee) {
    if (this.clickatoSuIcona === true) {
      this.clickatoSuIcona = false;
      return;
    }

    if (this.selezioneMultipla === true && this.eliminaSelezioniSuClickRiga2 === true) {
      // this.scriveLog('Selezionato', ee);
      // this.scriveLog('Selezione', this.mySelection);

      const sel = [ee.dataItem];
      const desel = new Array();
      let gridData = this.gridData;
      if (this.paginazione === 'virtual') {
        if (this.gridData.data.data) {
          gridData = this.gridData.data.data;
        } else {
          gridData = this.gridData.data;
        }
      }
      this.mySelection.forEach(element => {
        let ok = false;
        if (gridData !== undefined) {
          gridData.forEach(element2 => {
            if (!ok) {
              if (element === element2.ROW_ID) {
                ok = true;
                desel.push(element2);
              }
            }
          });
        }
      });
      // this.scriveLog('Selezione', sel);
      // this.scriveLog('DeSelezione', desel);
      this.mySelection = [ee.dataItem.ROW_ID];
      this.selectedRow = ee.dataItem.ROW_ID;
      this.scriveLog('Imposta Selezione 3: ', this.selectedRow, this.mySelection);

      this.creaRitornoSelezionati(sel, desel);
      return;

      // * let sel = null;
      let desel = null;
      if (ee.selectedRows && ee.selectedRows[0]) {
        sel = ee.selectedRows[0].dataItem;
      }
      if (ee.deselectedRows && ee.deselectedRows[0]) {
        desel = ee.deselectedRows[0].dataItem;
      } /* /
      // const tm = setTimeout(_ => this.creaRitornoSelezionati(sel, desel), 10);
      this.creaRitornoSelezionati(sel, desel);

      return;
    }

    if (this.attesaClick === true) {
      const tm = setTimeout(() => {
        this.disegnaDivAttesa = true;
        const tm = setTimeout(() => {
          this.disegnaDivAttesa = false;
          this.cdRef.markForCheck();
        }, this.tempoRipristinoAttesa);
      }, 0);
    }


    // return;
    // if (this.debugTasto === true) {
      this.scriveLog('Griglia ' + this.maskName + '. Click su riga:', ee);
    // }
    // this.scriveLog(ee);
    // let orGrid;
    // this.stampaTempi('Inizio Cell click on grid');
    const tm = setTimeout(() => {
      const e = ee;

      // this.scriveLog('1');
      if (e.type === 'contextmenu' && this.itemsMenu) {
        const originalEvent = e.originalEvent;

        originalEvent.preventDefault();

        this.contextItem = e.dataItem;

        // if (this.gridContextMenu) {
        this.gridContextMenu.show({ left: originalEvent.pageX, top: originalEvent.pageY });
        // }
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Items Menu: ', this.itemsMenu);
        // }
      }
      // this.scriveLog('2');

      this.premutoShiftSuSelezione = e.originalEvent.shiftKey;

      let mySelection2 = new Array();
      // this.scriveLog(this.eliminaSelezioniSuClickRiga);

      let d = this.gridData;
      if (this.paginazione === 'virtual') {
        d = this.gridData.data;
      }
      // this.scriveLog(d);

      if (this.selezioneMultipla === false) {
        if (this.eliminaSelezioniSuClickRiga2 === false) {
          if (d) {
            d.forEach(element => {
              if (element && e.dataItem && element.ROW_ID === e.dataItem.ROW_ID) {
                if (element.ROW_ID || +element.ROW_ID === 0) {
                  // if (this.debugTasto === true) {
                    this.scriveLog('Griglia ' + this.maskName + '. Aggiungo id ', element.ROW_ID);
                  // }
                  mySelection2.push(element.ROW_ID);

                  this.selectedRow = e.dataItem.ROW_ID;
                  this.scriveLog('Imposta Selezione 4: ', this.selectedRow, this.mySelection);
                } else {
                  // if (this.debugTasto === true) {
                    this.scriveLog('Griglia ' + this.maskName + '. ROW ID non rilevato', d, e.dataItem);
                  // }
                }
              }
            });
          }
        } else {
          // if (this.debugTasto === true) {
          if (e && e.dataItem) {
            this.scriveLog('Griglia ' + this.maskName + '. Aggiungo indice attuale', e.dataItem.ROW_ID);
            // }
            mySelection2.push(e.dataItem.ROW_ID);

            this.selectedRow = e.dataItem.ROW_ID;
            this.scriveLog('Imposta Selezione 5: ', this.selectedRow, this.mySelection);
          }
        }
      } else {
        if (this.eliminaSelezioniSuClickRiga2 === true) {
          // if (this.debugTasto === true) {
            this.scriveLog('Griglia ' + this.maskName + '. Pulisco array e aggiungo id', e.dataItem.ROW_ID);
          // }
          mySelection2.push(e.dataItem.ROW_ID);

          this.selectedRow = e.dataItem.ROW_ID;
          this.scriveLog('Imposta Selezione 6: ', this.selectedRow, this.mySelection);
        } else {
          // if (this.debugTasto === true) {
            this.scriveLog('Griglia ' + this.maskName + '. Aggiungo vecchi indici', this.mySelection);
          // }
          mySelection2 = this.mySelection;

          this.selectedRow = e.dataItem.ROW_ID;
          this.scriveLog('Imposta Selezione 7: ', this.selectedRow, this.mySelection);
        }
      }
    // this.stampaTempi('Riempimento selezione effettuata: ' + this.mySelection);
    // this.scriveLog('3');
    // this.scriveLog(mySelection2);
    // if (this.eliminaSelezioniSuClickRiga === true) {
      this.mySelection = mySelection2;

      this.scriveLog('Griglia ' + this.maskName + '. Selezione in corso:', this.mySelection);
      // this.scriveLog('Premuto shift:', shift);

      // // logConsole('click selezione: ', this.mySelection);
      // this.scriveLog('Riga premuta: ', JSON.stringify(e.dataItem));

      // if (localStorage.getItem(this.maskName + '_' + DashboardHeaderComponent.userName + '_loading') === 'false') {
      // this.scriveLog('4');
      if (this.editable && this.editGridOn && e.dataItem.IS_EDITABLE === 'Y') {
        /* if (this.lastEdited > -1) {
          this.editMode[this.lastEdited] = false;
        }

        this.editMode[e.dataItem.ROW_ID] = !this.editMode[e.dataItem.ROW_ID];
        this.lastEdited = e.dataItem.ROW_ID;

        this.gridGeneral.setAutoFit(this.maskName); * /
        this.setEditRow(e.dataItem.ROW_ID);
      } else {
        // this.scriveLog('Click su cella');
        // this.scriveLog(e);
        if (e.dataItem && e.dataItem.Empty !== 'No items selected') {
          this.selectedElement = e.dataItem;
          this.lastSelected = e;

          this.loadDatas(true);
        }
      }
      // this.scriveLog('5');
      // this.stampaTempi('Acquisita riga');

      this.toConfirm = true;

      // this.scriveLog(this.mySelection, d);

      let ret = '[';
      this.mySelection.forEach(element => {
        d.forEach(element2 => {
          if (element === element2.ROW_ID) {
            ret += JSON.stringify(element2) + ',';
          }
        });

        /* if (this.gridData[element + 1] && this.gridData[element + 1] !== undefined  && this.gridData[element + 1] !== 'undefined') {
          if (element -1 >= 0) {
            ret += JSON.stringify(this.gridData[element + 1]) + ',';
          } else {
            this.scriveLog('ANTSGRID: Element 0 non valido nell\'array di selezione ', this.mySelection);
          }
        } * /
      });

      // this.scriveLog('6');
      // this.stampaTempi('Creata stringa di ritorno JSON da selezione');
      if (this.selezioneMultipla === true) {
          this.scriveLog('Emissione su click 3: ', e.dataItem);
          this.rigaSelezionataPerDelta = e.dataItem;

          this.cellClick.emit(e.dataItem);
      } else {
        if (ret.length > 3 && ret !== '[undefined') {
          ret = ret.substring(0, ret.length - 1);
          ret += ']';
          const r = JSON.parse(ret);

          this.scriveLog('Emissione su click 1: ', r);
          this.rigaSelezionataPerDelta = this.selectedRow = r;

          this.cellClick.emit(r);
        } else {
          this.scriveLog('Emissione su click 2: ', e);
          this.rigaSelezionataPerDelta = this.selectedRow = e;

          this.cellClick.emit(e);
        }
      }
      // this.stampaTempi('Fatto emit');
      // this.scriveLog('7');

      if (this.showPopup === true) {
        this.scriveInfoAVideo();
      }
      // this.scriveLog('8');

      /* if (this.gridDataAppoggio) {
        this.gridData = JSON.parse(JSON.stringify(orGrid));
      } * /

      // this.scriveLog('9');
      if (e.originalEvent.which === 3) {
        // this.scriveLog('9.5');
        // this.scriveLog('Destro');
        e.originalEvent.stopPropagation();
        // return false;
      }
      // this.scriveLog('10');
      // this.stampaTempi('Fine click');
    }, 0);
  } */

  loadDatas(showFiles) {
    // this.scriveLog('LOAD DATAS', this.maskName);

    // if (this.maskName !== 'tc-requests') {
    //   this.itemSelected.emit(this.selectedElement || null);
    // }

    this.onOffKeysOnSelect();
  }

  /* protected selectionChanged(selection): void {
    // this.scriveLog('Selection click: ');
    // this.scriveLog(selection.selectedRows[0].dataItem);
    this.selectedElement = selection && selection.selected ? selection.selectedRows[0].dataItem : null;
    this.lastSelected = selection.selectedRows[0];
  } */

  /* loadRequestParameters(s) {
    // const t = DashboardHeaderComponent.t;

    const ss: string = 'TcRunId=' + s.TC_RUN_ID + ',' + s.TC_RUN_RETRY_NUM + ',' + s.ID;
    this.TcRunForParameters = s.TC_RUN_ID + ',' + s.TC_RUN_RETRY_NUM + ',' + s.ID;
    this.tcRunIdRequest = s.TC_RUN_ID;
    // this.gridGeneral.setGridContext(this);
    if (this.maskName === 'tc-requests') {
      this.maskName = 'Requests';
    }
    // localStorage.setItem(t.returnUserName() + '_' + this.maskName + '_persistence', '0');
    // this.gridGeneral.reloadGrid(this.maskName, ss);
  }

  fillRequestGrid(s: string, data) {
    if (data) {
      this.requestParameterList = data.TC_RUN_REQ_PRM_OUTPUT;
    } else {
      this.requestParameterList = null;
    }
    this.showPopupParameters = false;

    // this.gridGeneral.setAutoFit(this.maskName);
  } */

  /* saveParameters() {
    let s = '';

    s += '{';
    s += '  \"TC_RUN_REQ_PRM_INPUT\": [';

    let ss = '';

    this.requestParameterList.forEach(element => {
      ss += '{';
      ss += ' \"NAME\": \"' + element.NAME + '\",';
      ss += ' \"VALUE\": \"' + element.DEFAULT_NAME + '\",';
      ss += ' \"TYPE\": \"string\"';
      ss += '},';
    });

    if (ss.length > 1) {
      ss = ss.substring(0, ss.length - 1);
    }

    s += ss;

    s += '  ],';
    s += '  \"GENERAL_INFO\": []';
    s += '}';

    s = JSON.parse(s);

    this.apiService.setRequestParameters(this.TcRunForParameters, s)
    .map(response => response.json())
    .subscribe(data => {
      if (data) {
        // this.scriveLog('Save parameters: OK');
        this.errorMsg.showErrorMessage('Save parameters', 'OK', '');

        this.showPopupParameters = false;
        // const t = DashboardHeaderComponent.t;
        // t.checkRequests(true);
      } else {
        // this.scriveLog('Save parameters: Error');
        this.errorMsg.showErrorMessage('Save parameters', 'Error', 'Error');
      }
  }, error => {
      console.warn(error);
      this.scriveLog(error);
      this.errorMsg.showErrorMessage('Save parameters', error, 'Error');
    });
  } */

  public get animate(): any {
    return {
      type: 'zoom',
      direction: 'down',
      duration: 300
    };
  }

  public getBackColorReqPar() {
    if (this.lastColor === '#FFF') {
      this.lastColor = '#f5f5f5';
    } else {
      this.lastColor = '#FFF';
    }
    return this.lastColor;
  }

  getValueEdit(colKey, val, type) {
    return type;
  }

  getHtml(div, val) {
    const nome = 'divHtml_' + div;
    // if (this.debugTasto === true) {
      this.scriveLog('Griglia ' + this.maskName + '. Get HTML: ', document.getElementById(nome), val);
    // }
  }

  getValue(column, dataItem) {
    // logConsole(column, dataItem);
    if (!column || !dataItem) {
      return;
    }

    const colKey = column.field;
    let val = dataItem[column.field];
    const type = column.dataType;
    // return val;

    /* if (this.haCaricato === false) {
      return;
    }

    // this.scriveLog('Cell Style: ', riga, colonna);
    if (this.presoValoreCella[riga][colonna] && this.presoValoreCella[riga][colonna] === '' + val) {
      if ('' + val === 'null') {
        return null;
      } else {
        return this.presoValoreCella[riga][colonna];
      }
    }
    // this.scriveLog('Nuovo Valore:', val, riga, colonna, this.presoValoreCella[riga][colonna]); */
    // this.presoValoreCella[riga][colonna] = '' + val;

    if (colKey === 'Delta' && this.selectedElement) {
      const baseValue = this.selectedElement['Delta'];
      const delta = Math.round((val - baseValue) * 1000) / 1000;
      // logConsole('Val: Uscito 1');
      return delta;
    }

    let q = 0;

    // // this.stampaTempi('Get value');
    if (val === 'null' || (!val && val !== 0) || val === 'undefined' || val === undefined || val === undefined) {
      if (this.maskName === 'tc-run-detail') {
        this.scriveLog('Val: Uscito 2');
        return '-';
      } else {
        if (this.maskName === 'report') {
          // if (val !== undefined) {
          //   return '0';
          // }
        } else {
          // this.scriveLog('fesso fesso', val);
          // logConsole('Val: Uscito 3', val, dataItem, column.field);
          return '';
          // val = '*';
        }
      }
    } else {
      if (type === 'date') {
        if (val) {
          // while (val.indexOf('-') > -1) {
          //  val = val.replace('-', '/');
          // }
          // const moment = moment_;
          // val = moment(new Date(val)).format('YYYY-MM-DD HH:mm:ss');

          val = this.datePipe.transform(new Date(val), 'yyyy-MM-dd HH:mm:ss');

          q = 1;
        } else {
          q = 2;
        }
      } else {
        if (type && type !== null && type.toUpperCase().trim() === 'NUMERIC') {
          /* if (val) {
            let valS: string = '' + val.toString().trim();
            while (valS.indexOf('"') > -1) {
              valS = valS.replace('"', '');
            }
            if (valS === '') {
              valS = '0';
            }
            val = +valS;
          }*/
          q = 3;
          if (column.format) {
            // val += ' *' + column.format + '*';
            try {
              val = (this.decimalPipe.transform(val, column.format));
            } catch (e) {

            }
          }
        } else {
          if (type && type !== null && type.toUpperCase().trim() === 'HTML') {
            val = '';
            q = 4;
          } else {
            val = val + '';
            let n = val.indexOf('&');
            const url = val.toUpperCase().trim();
            if (url.indexOf('HTTP') > -1) {
              n = -1;
            }
            if (n > -1) {
              val = val.substring(0, n);
            }
            q = 5;
          }
        }
      }
    }

    // val = '<span style="color: #a00;">' + val + '</span>';
    // this.scriveLog(val);

    // TOGLIERE IN FASE FINALE
    /* if (typeof val !== 'number' && (val && val.toString().indexOf('***') > - 1)) {
      // this.scriveLog('Prima', val);

      if (val.indexOf('***') > -1 && val.indexOf('***') < 1) {
        val = val.substring(0, val.indexOf('***')) + val.substring(val.indexOf('***') + 3, val.length);
        val = val.substring(val.indexOf('***') + 3, val.length).trim();
      } else {
        val = val.substring(0, val.indexOf('***')).trim();
        // this.scriveLog('Dopo', val);
      }

      if (isNumeric(val)) {
        val = +val;
        // this.scriveLog('Converto in numerico ', val);
      }
    } */
    // TOGLIERE IN FASE FINALE

    // // this.stampaTempi('Fatto Get value');
    // logConsole('Val:' , val, q);
    
    if (!this.nonConvertireCuspidi) {
      if (val && typeof(val) === 'string') {
        while (val.indexOf('<') > -1) {
          val = val.replace('<', '&lt;')
        }
        while (val.indexOf('>') > -1) {
          val = val.replace('>', '&gt;');
        }
      }
    }

    if (val && typeof(val) === 'string') {
      if (val.toUpperCase().indexOf('HTTP://') > -1 || val.toUpperCase().indexOf('HTTPS://') > -1)  {
        val = '<a href="' + val + '" target="_blank">' + val + '</a>';
      }
    }

    return val;
  }

  prendeTestoUrl(e) {
    return this.sr.bypassSecurityTrustHtml(e);
  }

  fDownloadTcRun() {
    this.downloadTcRunEmit.emit(new Date().toString());
  }

  /* contieneHttp(e) {
    // this.scriveLog(e);
    if (e) {
      // this.scriveLog(e);
      if (e.toString().toUpperCase().indexOf('HTTP://') > -1 ||
          e.toString().toUpperCase().indexOf('HTTPS://') > -1 ||
          e.toString().toUpperCase().indexOf('1') > -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } */

  // Stili di cella memorizzati per oggetto riga e campo. getCellStyle + getOtherStyles costruiscono stringhe JSON
  // e fanno 2-3 JSON.parse per cella a ogni change detection: qui si ricalcolano solo se cambia uno dei valori da cui
  // dipendono, e si restituisce lo stesso oggetto (così anche ngStyle non deve confrontarlo di nuovo).
  // La WeakMap rilascia da sola le voci quando le righe vengono sostituite da dati nuovi.
  private cacheStiliCella = new WeakMap<object, Map<string, { chiave: string, stile: any }>>();
  private nomiCampoFrm: { [campo: string]: [string, string] } = {};

  // 1) Tooltip della cella impostato al passaggio del mouse. Prima era un binding [title] che chiamava isTextTruncated
  //    (scrollWidth/clientWidth) per ogni cella a ogni change detection, costringendo il browser a ricalcolare il layout.
  impostaTitoloCella(cella: HTMLElement, column, dataItem) {
    if (!cella) {
      return;
    }
    const titolo = this.isTextTruncated(cella) ? this.valoreCella(column, dataItem) : '';
    cella.title = titolo === undefined || titolo === null ? '' : '' + titolo;
  }

  // 2) Valore visualizzato della cella memorizzato per oggetto riga e campo: getValue formatta date e numeri e fa
  //    sostituzioni sul testo; ora lo fa solo se cambia il valore o una delle proprietà da cui dipende il risultato.
  private cacheValoriCella = new WeakMap<object, Map<string, { chiave: string, valore: any }>>();

  valoreCella(column, dataItem) {
    if (!column || !dataItem || typeof dataItem !== 'object') {
      return this.getValue(column, dataItem);
    }
    const chiave = [
      dataItem[column.field], column.dataType, column.format, this.maskName, this.nonConvertireCuspidi,
      column.field === 'Delta' && this.selectedElement ? this.selectedElement['Delta'] : ''
    ].join('\u0001');

    let perRiga = this.cacheValoriCella.get(dataItem);
    if (!perRiga) {
      perRiga = new Map();
      this.cacheValoriCella.set(dataItem, perRiga);
    }
    const salvato = perRiga.get(column.field);
    if (salvato && salvato.chiave === chiave) {
      return salvato.valore;
    }
    const valore = this.getValue(column, dataItem);
    perRiga.set(column.field, { chiave, valore });
    return valore;
  }

  // 3) Allineamento, larghezza e margine dipendono solo dalla colonna (e, per gli ultimi due, dal fatto che la cella
  //    abbia un valore): calcolati una volta per colonna invece che per ogni cella a ogni change detection.
  private cacheColonne = new WeakMap<object, { [chiave: string]: any }>();

  private memoColonna(column, nome: string, chiave: string, calcola: () => any) {
    if (!column || typeof column !== 'object') {
      return calcola();
    }
    let perColonna = this.cacheColonne.get(column);
    if (!perColonna) {
      perColonna = {};
      this.cacheColonne.set(column, perColonna);
    }
    const k = nome + '\u0001' + chiave;
    if (!(k in perColonna)) {
      perColonna[k] = calcola();
    }
    return perColonna[k];
  }

  private chiaveLimiti(): string {
    return this.limitaRighe ? (this.limitaRighe.allineamentiVari ? '1' : '0') : '-';
  }

  allineamentoCella(column) {
    return this.memoColonna(column, 'allineamento', this.chiaveLimiti() + '\u0001' + (column && column.dataType),
      () => this.prendeAllineamentoCella(column));
  }

  dimensioneRigaCella(column, dataItem) {
    if (!column || !dataItem) {
      return this.tornaDimensioneRiga(column, dataItem);
    }
    const chiave = [this.chiaveLimiti(), !!dataItem[column.field], column.icon, column.showIconText, column.combo].join('\u0001');
    return this.memoColonna(column, 'dimensione', chiave, () => this.tornaDimensioneRiga(column, dataItem));
  }

  margineRigaCella(column, dataItem) {
    if (!column || !dataItem) {
      return this.tornaMargineRiga(column, dataItem);
    }
    const chiave = [this.chiaveLimiti(), !!dataItem[column.field], column.icon, column.iconName, column.combo].join('\u0001');
    return this.memoColonna(column, 'margine', chiave, () => this.tornaMargineRiga(column, dataItem));
  }

  stileCella(dataItem, column) {
    if (!dataItem || !column || typeof dataItem !== 'object') {
      return this.getOtherStyles(this.getCellStyle(dataItem, column), dataItem, column);
    }

    let nomi = this.nomiCampoFrm[column.field];
    if (!nomi) {
      nomi = this.nomiCampoFrm[column.field] = [(column.field + '_FRM').toUpperCase(), (column.field + '_FRM').toLowerCase()];
    }

    // Tutti e soli i valori letti da getCellStyle, getBGColorRow, getFGColor e getOtherStyles
    const chiave = [
      dataItem[column.field], dataItem.CHANGE_STATUS, dataItem.IS_EDITABLE, this.editGridOn, this.DimensioneFont,
      !!this.gridData, this.getBGColorRow(dataItem), this.getFGColor(dataItem), column.dataType,
      dataItem[nomi[0]], dataItem[nomi[1]],
      this.limitaRighe ? (this.limitaRighe.getCellStyle ? '1' : '0') + (this.limitaRighe.getOtherStyle ? '1' : '0') : '-'
    ].join('\u0001');

    let perRiga = this.cacheStiliCella.get(dataItem);
    if (!perRiga) {
      perRiga = new Map();
      this.cacheStiliCella.set(dataItem, perRiga);
    }
    const salvato = perRiga.get(column.field);
    if (salvato && salvato.chiave === chiave) {
      return salvato.stile;
    }

    const stile = this.getOtherStyles(this.getCellStyle(dataItem, column), dataItem, column);
    perRiga.set(column.field, { chiave, stile });
    return stile;
  }

  getOtherStyles(style, dataItem, column) {
    if (this.limitaRighe) {
      if (!this.limitaRighe.getOtherStyle) {
        return '';
      }
    }

    if (!dataItem || !column) {
      return '';
    }

    let val = dataItem[column.field];
    const datiColonna = column.field;
    const datiRiga = dataItem;
    // return;

    /* if (this.haCaricato === false) {
      return;
    }

    // const row2 = row - 1;
    // const confronto = val + ';' + datatype + ';' + d.CHANGE_STATUS + ';' + fontSize;
    // this.scriveLog('Cell Style: ', row2, colonna, this.presoStileCella[row2][colonna]);
    if (this.presoStileCella2[row2][colonna] && this.presoStileCella[row2][colonna] !== '') {
      // this.scriveLog('Esco da cell style', val, this.presoStileCella[row][colonna]);
      return this.presoStileCella2[row2][colonna]; //  this.presoStileCella[colonna];
    } */

    // this.stampaTempi('Get other styles');
    let styleFinale = JSON.parse(JSON.stringify(style));
    let nomeDaCercareGrande = (datiColonna + '_FRM').toUpperCase();
    let nomeDaCercarePiccolo = (datiColonna + '_FRM').toLowerCase();

    // this.scriveLog(nomeDaCercare);
    if (datiRiga) {
      if (datiRiga[nomeDaCercarePiccolo] || datiRiga[nomeDaCercareGrande]) {
        let campo;
        if (datiRiga[nomeDaCercareGrande]) {
          campo = datiRiga[nomeDaCercareGrande];
        } else {
          campo = datiRiga[nomeDaCercarePiccolo];
        }
        // this.scriveLog('Trovato', datiRiga[nomeDaCercare]);

        let styleFinale2 = JSON.stringify(styleFinale);
        styleFinale2 = styleFinale2.replace('{', '');
        styleFinale2 = styleFinale2.replace('}', '');
        if (styleFinale2.substring(styleFinale2.length - 1, styleFinale2.length) !== ',')  {
          styleFinale2 += ',';
        }

        let style2 = campo;
        const stili = style2.split(',');
        let Ok = false;
        stili.forEach(element => {
          while (element.indexOf('"') > - 1) {
            element = element.replace('"', '');
          }
          Ok = true;
          // this.scriveLog(element);
          const stile = element.split(':');
          if (stile[0] && stile[1]) {
            styleFinale2 += '"' + stile[0].trim() + '": "' + stile[1].trim() + '",';
          }
        });
        if (Ok) {
          styleFinale2 = '{ ' + styleFinale2.substring(0, styleFinale2.length - 1) + '}';
        } else {
          styleFinale2 = '{ ' + styleFinale2 + '}';
        }
        // this.scriveLog(styleFinale2);
        styleFinale = JSON.parse(styleFinale2);
      }
    }

    return styleFinale;

    if (val !== undefined && val !== null) {
      // this.scriveLog(val);
      let a = val.toString().indexOf('***');
      if (a > - 1) {
        a = val.indexOf('***');
        let style2 = '';
        if (a > - 1) {
          // this.scriveLog(style2, val);
          /* if (a < 2) {
            // style2 = val.substring(a + 3, val.length);
            val = val.substring(0, a) + val.substring(a + 3, val.length);
            style2 = val.substring(0, a);
            val = val.substring(a + 3, a.length);
          } else {
            this.scriveLog(a, val);
            return;
            style2 = val.substring(a, val.length);
            val = val.substring(0, a);
          } */
          const a1 = val.indexOf('***');
          style2 = val.substring(a1 + 3, a1.length);
          const a2 = style2.indexOf('***');
          style2 = style2.substring(0, a2);
          val = val.replace('***' + style2 + '***', '');

          /* let styleFinale2 = JSON.stringify(styleFinale);
          styleFinale2 = styleFinale2.replace('{', '');
          styleFinale2 = styleFinale2.replace('}', '');
          if (styleFinale2.substring(styleFinale2.length - 1, styleFinale2.length) !== ',')  {
            styleFinale2 += ',';
          }

          const stili = style2.split(',');
          let Ok = false;
          stili.forEach(element => {
            while (element.indexOf('"') > - 1) {
              element = element.replace('"', '');
            }
            Ok = true;
            // this.scriveLog(element);
            const stile = element.split(':');
            styleFinale2 += '"' + stile[0].trim() + '": "' + stile[1].trim() + '",';
          });
          if (Ok) {
            styleFinale2 = '{ ' + styleFinale2.substring(0, styleFinale2.length - 1) + '}';
          } else {
            styleFinale2 = '{ ' + styleFinale2 + '}';
          }
          // this.scriveLog(styleFinale2);
          styleFinale = JSON.parse(styleFinale2); */
        }
      }
    }

    // this.presoStileCella2[row2][colonna] = styleFinale;
    // this.stampaTempi('Fatto Get other styles');
    return styleFinale;
  }

  getCellStyle(dataItem, column) {
    if (this.limitaRighe) {
      if (!this.limitaRighe.getCellStyle) {
        return '';
      }
    }
    
    if (!dataItem || !column) {
      return '';
    }

    const d = dataItem;
    const row = dataItem.ROW_ID;
    const datatype = column.dataType;
    let val = dataItem[column.field];
      // return;

      /* if (this.haCaricato === false) {
        return;
      }

      // const row2 = row - 1;
      // const confronto = val + ';' + datatype + ';' + d.CHANGE_STATUS + ';' + fontSize;
      // this.scriveLog('Cell Style: ', row2, colonna, this.presoStileCella[row2][colonna]);
      if (this.presoStileCella[row2][colonna] && this.presoStileCella[row2][colonna] !== '') {
        // this.scriveLog('Esco da cell style', val, this.presoStileCella[row][colonna]);
        return this.presoStileCella[row2][colonna]; //  this.presoStileCella[colonna];
      } */
      // this.scriveLog('Nuovo Valore:', row2, colonna);
      // this.presoStileCella[row][colonna] = confronto;

      // this.stampaTempi('Get cell style');

      let fontSize;
      if (this.DimensioneFont) {
        fontSize = this.DimensioneFont;
      } else {
        fontSize = 14;
      }
      // if (row === this.lastEdited) {
      const bgColor = this.getBGColorRow(d);
      const fgColor = this.getFGColor(d);

      let dType = '';
      if (datatype) {
        dType = datatype.toString().trim().toUpperCase();
      }

      if (d.CHANGE_STATUS === 'U') {
        let r = '{ "background-color": "#e8ca96",';
        if (dType === 'NUMBER' || dType === 'NUMERIC') {
          r += '"text-align": "right", ';
        }
        r += '"color": "black", "margin": "0px", "height": "30px", ';
        r += '"font-size": ' + fontSize + 'px }';
        const object = JSON.parse( r );
        // this.stampaTempi('Fatto Get cell style 1');

        // this.presoStileCella[row2][colonna] = object;

        return object;
      } else {
        if (d.CHANGE_STATUS === 'D') {
          let r = '{ "background-color": "#e06d6d",';
          if (dType === 'NUMBER' || dType === 'NUMERIC') {
            r += '"text-align": "right", ';
          }
          r += '"color": "black", "margin": "0px", "height": "30px", ';
          r += '"font-size": ' + fontSize + 'px }';
          const object = JSON.parse( r );
          // this.stampaTempi('Fatto Get cell style 2');

          // this.presoStileCella[row2][colonna] = object;

          return object;
        } else {
          let editableRowI = false;
          // let deletableRowI = false;

          if (d.IS_EDITABLE === 'Y') {
            editableRowI = true;
          }
          // if (d.IS_DELETABLE === 'Y') {
          //   deletableRowI = true;
          // }
          if ((d.CHANGE_STATUS === null || d.CHANGE_STATUS === '' || d.CHANGE_STATUS === 'E') &&
            editableRowI && this.editGridOn) {
            let r = '{ "background-color": "#e5efd7",';
            if (dType === 'NUMBER' || dType === 'NUMERIC') {
              r += '"text-align": "right", ';
            }
            r += '"color": "black", "margin": "0px", "height": "30px", ';
            r += '"font-size": "' + fontSize + 'px"';
            r += '}';
            const object = JSON.parse( r );
            // this.stampaTempi('Fatto Get cell style 3');

            // this.presoStileCella[row2][colonna] = object;

            return object;
          } else {
            if (bgColor !== '' && fgColor !== '') {
              let r = '{';
              // logConsole('Colore di sfondo: ', bgColor);
              if (bgColor !== '') {
                r += '"background-color": "' + bgColor + '", ';
              }
              if (dType === 'NUMBER' || dType === 'NUMERIC') {
                r += '"text-align": "right", ';
              }
              if (fgColor !== '') {
                r += '"color": "' + fgColor + '", ';
              }
              r += '"font-size": "' + fontSize + 'px"';
              r += '}';
              const object = JSON.parse( r );
              // this.stampaTempi('Fatto Get cell style 4');

              // this.presoStileCella[row2][colonna] = object;

              return object;
            } else {
              /* if (bgColor === '' && fgColor === '') {
                let r = '{';
                // logConsole('Colore di sfondo: ', bgColor);
                if (bgColor === '') {
                  r += '"background-color": "transparent", ';
                }
                if (dType === 'NUMBER' || dType === 'NUMERIC') {
                  r += '"text-align": "right", ';
                }
                if (fgColor === '') {
                  r += '"color": "black", ';
                }
                r += '"font-size": "' + fontSize + 'px"';
                r += '}';
                
                const object = JSON.parse( r );
                // this.stampaTempi('Fatto Get cell style 4');

                // this.presoStileCella[row2][colonna] = object;

                return object;
              } else { */
                if (val === 'null' || !val || val === 'undefined' || val === undefined || val === undefined) {
                  let r = '{';
                  if (dType === 'NUMBER' || dType === 'NUMERIC') {
                    r += '"text-align": "right", ';
                  }
                  r += '"font-size": "' + fontSize + 'px"';
                  r += '}';
                  const object = JSON.parse( r );
                  // this.stampaTempi('Fatto Get cell style 5');

                  // this.presoStileCella[row2][colonna] = object;

                  return object;
                } else {
                  val = val + '';
                  let n = val.indexOf('&');
                  const l: number = val.length;
                  const url = val.toUpperCase().trim();
                  if (url.indexOf('HTTP') > -1) {
                    n = -1;
                  }

                  if (n > -1) {
                    const v = val.substring(n + 1, l);
                    const isNumber = this.isNumeric(v);
                    if (isNumber) {
                      val = '{' + val.substring(n + 1, l);
                      while (val.indexOf('\'') > -1) {
                        val = val.replace('\'', '"');
                      }
                      if (dType === 'NUMBER' || dType === 'NUMERIC') {
                        val += '"text-align": "right", ';
                      }
                      val += '"font-size": "' + fontSize + 'px"';
                      val += '}';
                      const object = JSON.parse( val );
                      // this.stampaTempi('Fatto Get cell style 6');

                      // this.presoStileCella[row2][colonna] = object;

                      return object;
                    } else {
                      let r = '{';
                      if (dType === 'NUMBER' || dType === 'NUMERIC') {
                        r += '"text-align": "right", ';
                      }
                      r += '"font-size": "' + fontSize + 'px"';
                      r += '}';
                      const object = JSON.parse( r );
                      // this.stampaTempi('Fatto Get cell style 7');

                      // this.presoStileCella[row2][colonna] = object;

                      return object;
                    }
                  } else {
                    let r = '{';
                    if (dType === 'NUMBER' || dType === 'NUMERIC') {
                      r += '"text-align": "right", ';
                    }
                    r += '"font-size": "' + fontSize + 'px"';
                    r += '}';
                    const object = JSON.parse( r );
                    // this.stampaTempi('Fatto Get cell style 8');

                    // this.presoStileCella[row2][colonna] = object;

                    return object;
                  }
                }
              // }
            }
          }
        }
      }
    // }
  }

  fAddToActSet() {
    let d = this.gridData;
    if (this.paginazione === 'virtual') {
      d = this.gridData.data;
    }

    let ret = '[';
    this.mySelection.forEach(element => {
      d.forEach(element2 => {
        if (element === element2.ROW_ID) {
          ret += JSON.stringify(element2) + ',';
        }
      });
    });
    if (ret.length > 3 && ret !== '[undefined') {
      ret = ret.substring(0, ret.length - 1);
      ret += ']';
      const r = JSON.parse(ret);

      this.addToActSetEmit.emit(r);
    }
  }

  fDownloadTD() {
    let d = this.gridData;
    if (this.paginazione === 'virtual') {
      d = this.gridData.data;
    }

    if (this.modalitaTDDownload2 === 'selezionato') {
      let ret = '[';
      let r = null;

      this.mySelection.forEach(element => {
        d.forEach(element2 => {
          if (element === element2.ROW_ID) {
            ret += JSON.stringify(element2) + ',';
          }
        });
      });

      if (ret.length > 3 && ret !== '[undefined') {
        ret = ret.substring(0, ret.length - 1);
        ret += ']';
        r = JSON.parse(ret);

        this.downloadTDEmit.emit(r);
      } else {
        alert('Please select at least one row to download');
      }
    } else {
      this.downloadTDEmit.emit(new Date().toString());
    }

  }

  resetGridLayout() {
    // this.mostraPopup('Are you sure to reset this grid layout ?', true, 'RESETGRIDLAYOUT');

    Swal.fire({
      title: 'Confirm',
      text: 'Are you sure to reset this grid layout ?',
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
        this.resetGridLayout2();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

  }

  resetGridLayout2() {
    // if (confirm('Are you sure to reset this grid layout ?')) {
      // const t = DashboardHeaderComponent.t;
      // let k;
      // if (this.maskName === 'tc-run-list_report' || this.maskName === 'tc-run-list_adHocTCRun' ||
      //   this.maskName === 'ad-hoc' || this.maskName === 'adhoc-list-scenario' || this.maskName === 'report' ||
      //   this.maskName.toUpperCase().trim() === 'TS_BY_DAY') {
      /* if (this.maskName === 'report') {
        const tr = ReportMainComponent.t;
        const ah = AdHocComponent.t;

        if (tr || ah) {
          let tt;
          if (tr) {
            tt = tr.titleReport;
          } else {
            tt = ah.titleOrderKey;
          }
          while (tt.indexOf(' ') > -1) {
            tt = tt.replace(' ', '');
          }
          while (tt.indexOf(':') > -1) {
            tt = tt.replace(':', '');
          }
          while (tt.indexOf('<') > -1) {
            tt = tt.replace('<', '');
          }
          while (tt.indexOf('>') > -1) {
            tt = tt.replace('>', '');
          }
          if (tt.length > 15) {
            tt = tt.substring(0, 14);
          }

          localStorage.removeItem(t.returnUserName() + '_grid_' + this.maskName + '_' + tt + '_key');
          localStorage.removeItem(t.returnUserName() + '_grid_' + this.maskName + '_' + tt + '_order');
        }
      } else {
        localStorage.removeItem(t.returnUserName() + '_grid_' + this.maskName + '_key');
        localStorage.removeItem(t.returnUserName() + '_grid_' + this.maskName + '_order');
      } */
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Pulizia ', this.returnUserName() + '_grid_' + this.maskName + '_key');
      // }
      localStorage.removeItem(this.returnUserName() + '_grid_' + this.maskName + '_key');
      // if (this.debugTasto === true) {
        // this.scriveLog('Griglia ' + this.maskName + '. Pulizia ', this.returnUserName() + '_grid_' + this.maskName + '_order');
      // }
      // localStorage.removeItem(this.returnUserName() + '_grid_' + this.maskName + '_order');

      // const t = DashboardHeaderComponent.t;
      /* let t2 = this.title2;
      if (t2) {
        while (t2.indexOf(':') > -1) {
          t2 = t2.replace(':', '');
        }
        while (t2.indexOf(' ') > -1) {
          t2 = t2.replace(' ', '');
        }
      } */
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Pulizia ', this.returnUserName() + '_grid_' + this.maskName + '_hidden');
      // }
      localStorage.removeItem(this.returnUserName() + '_column_' + this.maskName + '_hidden');
      this.ciSonoColumnHidden = false;

      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Pulizia ', this.returnUserName() + '_grid_' + this.maskName + '_rownum');
      // }
      localStorage.removeItem(this.returnUserName() + '_grid_' + this.maskName + '_rownum');
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Pulizia ', this.returnUserName() + '_grid_' + this.maskName + '_state');
      // }
      localStorage.removeItem(this.returnUserName() + '_grid_' + this.maskName + '_state');
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Pulizia ', this.returnUserName() + '_grid_' + this.maskName + '_hideC');
      // }
      localStorage.removeItem(this.returnUserName() + '_grid_' + this.maskName + '_hideC');
      localStorage.removeItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered');
      // localStorage.removeItem(this.returnUserName() + '_grid_' + this.maskName + '_hideC');

      this.hideEmptyColumns = 'true';
      // this.modifiedColumns = false;

      // this.gridGeneral.reloadGrid(this.maskName, null);
      this.clearFilter();
      /* */

      this.scriveImpostazioniColonne(true);

      /* this.columns = undefined; // JSON.parse(JSON.stringify(this.originalColumns));
      this.columnsAppFiltered = undefined; // JSON.parse(JSON.stringify(this.columns));
      this.gridData = undefined;
      this.GridGenInterna = undefined; /* */

      logConsole('Pulizia: ', this.columns);

      /* const changes = '{"rinfrescaGriglia":{"previousValue":false,"currentValue":true,"firstChange":false}}';
      this.appoggioValori = JSON.parse(changes);
      // this.appoggioValori.data = this.data; //
      // this.gridData = undefined;
      const tm = setTimeout(() => {
        this.routineDiCaricamento('Reset grid layout');

        const tm = setTimeout(() => {
          this.autoFitColumns(true);
        }, 20);

        this.refresh.emit(true);
      }, 100); */
    // }
    this.eseguitoRefresh = true;

    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.routineDiCaricamento('Reset grid layout');

      const tm1 = setTimeout(() => {
        clearTimeout(tm1);
        this.autoFitColumns(true, "RESET LAYOUT");
      }, 20);
    }, 100);

    const tm2 = setTimeout(() => {
      clearTimeout(tm2);
      this.resetLayout.emit(new Date().toString());
    }, 100);
  }

  // saveGridLayout() {
  //   let order;
  //   let key;
    // let tt;

    // const t = DashboardHeaderComponent.t;
    // let k;
    /* if (this.maskName === 'report') {
      // if (this.maskName === 'tc-run-list_report' || this.maskName === 'tc-run-list_adHocTCRun' ||
    //   this.maskName === 'ad-hoc' || this.maskName === 'adhoc-list-scenario' || this.maskName === 'report' ||
    //  this.maskName.toUpperCase().trim() === 'TS_BY_DAY') {
      const tr = ReportMainComponent.t;
      const ah = AdHocComponent.t;

      if (tr || ah) {
        if (tr) {
          tt = tr.titleReport;
        } else {
          tt = ah.titleOrderKey;
        }
        while (tt.indexOf(' ') > -1) {
          tt = tt.replace(' ', '');
        }
        while (tt.indexOf(':') > -1) {
          tt = tt.replace(':', '');
        }
        while (tt.indexOf('<') > -1) {
          tt = tt.replace('<', '');
        }
        while (tt.indexOf('>') > -1) {
          tt = tt.replace('>', '');
        }
        if (tt.length > 15) {
          tt = tt.substring(0, 14);
        }

        key = localStorage.getItem(t.returnUserName() + '_grid_' + this.maskName + '_' + tt + '_key');
        order = localStorage.removeItem(t.returnUserName() + '_grid_' + this.maskName + '_' + tt + '_order');
      }
    } else {
      key = localStorage.getItem(t.returnUserName() + '_grid_' + this.maskName + '_key');
      order = localStorage.getItem(t.returnUserName() + '_grid_' + this.maskName + '_order');
    } //
    key = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_key');
    order = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_order');

    // const t = DashboardHeaderComponent.t;
    let t2 = this.title2;
    while (t2.indexOf(':') > -1) {
      t2 = t2.replace(':', '');
    }
    while (t2.indexOf(' ') > -1) {
      t2 = t2.replace(' ', '');
    }
    let hidden = localStorage.getItem(this.returnUserName() + '_column_' + this.maskName + '_' + t2 + '_hidden');
    let rownum = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_rownum');
    let state = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_state');
    let hc = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_hideC');
    let filtered = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered');

    if (!key) { key = '""'; }
    if (!order) { order = ''; }
    if (!hidden) { hidden = ''; }
    if (!rownum) { rownum = ''; }
    if (!state) { state = ''; }
    if (!filtered) { filtered = ''; }
    if (!hc) {hc = ''; }

    while (order.indexOf('"') > -1) {
      order = order.replace('"', '');
    }
    while (order.indexOf(' ') > -1) {
      order = order.replace(' ', ',');
    }
    order = '"' + order + '"';
    hidden = '"' + hidden + '"';
    rownum = '"' + rownum + '"';
    // state = '"' + state + '"';
    filtered = '"' + filtered + '"';

    let s: string;
    s = '{';
    s += '"maskname":"' + this.maskName + '",';
    s += '"title1":"' + tt + '",';
    s += '"title2":"' + t2 + '",';
    s += '"key":' + key + ', ';
    s += '"order":' + order + ',';
    s += '"hidden":' + hidden + ',';
    s += '"rownum":' + rownum + ',';
    s += '"state":[' + state + '],';
    s += '"filtered":' + filtered + '';
    s += '}';
    const dd = JSON.parse(s);
  } */

  /* editHandler() {
    if (this.lastSelected !== null) {
      if (!this.lastSelected.Empty) {
        // DashboardComponent.t = this;
        // this.editClicked.emit(this.lastSelected || null);

        let pass = this.lastSelected;
        if (this.lastSelected.dataItem) {
          pass = this.lastSelected.dataItem;
        }
        // this.scriveLog(pass);

        // GeneralComponent.tsToPass = pass;
        this.router.navigate(['/dashboard/editor-scenario'], {queryParams: { modality: 'edit', caller: this.maskName,
          'tdName': '', 'tsId': '' }});
      }
    }

    this.clickOnMenu1 = false;
  }

  // removeHandler() {
    // const ll = DashboardHeaderComponent.t;
    // if (this.lastSelected) {
       // this.delClicked.emit(this.lastSelected || null);
    // }
    /* if (this.maskName === 'tc-scenario' || this.maskName === 'ad-hoc') {
      let ls;
      if (this.lastSelected.dataItem) {
        ls = this.lastSelected.dataItem;
      } else {
        ls = this.lastSelected;
      }
      if (ls.TS_ID) {
        if (confirm('Are you sure to delete TS ' + ls.TS_ID)) {
          this.setTimerForRefresh();

          idPerQuery = ls.TS_ID;

          this.apiService.postDeleteTS(idPerQuery, this.sessionService.getToken())
            .map(response => response.json())
            .subscribe(result => {
              // this.writeLog('Delete', result);
            },
            error => {
              // this.logColor = '#ba371a';
              // this.logText = 'Error: ' + error.statusText;
              const msg = 'Error: ' + error.statusText;
              // ll.writeLogText(msg, '#ba371a', msg);
            }); ;
           }
      }
    } */

  //   this.clickOnMenu1 = false;
  // }

  // addHandler() {
    /* if (this.maskName === 'tc-scenario') {
      const t1 = SchedulerComponent.t;
      if (t1) {
        t1.minimumRowModality = true;
      }
      const t2 = TestScenarioComponent.t;
      if (t2) {
        t2.minimumRowModality = true;
      }
      const t3 = TCRunListComponent.t;
      if (t3) {
        t3.minimumRowModality = true;
      }
    } */

    // this.addClicked.emit(this.dataAdd || null);
    // GeneralComponent.tsToPass = this.dataAdd;
    // this.router.navigate(['/dashboard/editor-scenario'], {queryParams: { modality: 'create', caller: this.maskName }});

  //   this.clickOnMenu1 = false;
  // }

  /* detailHandler() {
    let ls;
    if (this.lastSelected.dataItem) {
      ls = this.lastSelected.dataItem;
    } else {
      ls = this.lastSelected;
    }
    if (this.maskName === 'tc-run-list_scheduler' || this.maskName === 'tc-run-list_adHocTCRun') {

      this.showPopupParameters = false;

      this.tcRunModalService.modalShow({'modal': 'tcDetail', 'action': 'open', 'tcRunId': ls});
    } else {
      if (this.maskName === 'adhoc-list-scenario') {
        this.tcRunModalService.modalShow({'modal': 'tsDetail', 'action': 'open', 'ts': ls.TS_RUN_ID});
      } else {
        if (this.maskName === 'tc-run-list_report') {
          // ls.TC_RUN_ID = ls.ID;
          this.showPopupParameters = false;

          this.tcRunModalService.modalShow({'modal': 'tcDetail', 'action': 'open', 'tcRunId': ls});
        }
      }
    }

    this.clickOnMenu1 = false;
  } */

  showInfos() {
    // this.reportMode = '';
    if (this.showPopup === true) {
      this.showPopup = false;
    } else {
      if (this.lastSelected) {
        this.scriveInfoAVideo();

        this.showPopup = true;
      } else {
        logConsole('Show Infos: Nessun elemento selezionato', this.lastSelected);
      }
    }

    this.clickOnMenu1 = false;
    this.gestisceSplit();
  }

  gestisceSplit() {
    if (this.showColumnHideFlag === true) {
      this.dimeArea1 = 25;
    } else {
      this.dimeArea1 = 0;
    }
    if (this.showPopup === true) {
      this.dimeArea3 = 25;
    } else {
      this.dimeArea3 = 0;
    }
    if (this.openAdvancedFilter === true) {
      this.dimeArea4 = 25;
    } else {
      this.dimeArea4 = 0;
    }

    this.dimeArea2 = 100 - this.dimeArea1 - this.dimeArea3 - this.dimeArea4;
  }

  scriveInfoAVideo() {
    if (this.lastSelected) {
      // this.scriveLog('Apertura info 1', this.lastSelected);
      let ls;
      if (this.lastSelected.dataItem) {
        ls = this.lastSelected.dataItem;
      } else {
        ls = this.lastSelected;
      }
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. INFO', ls, this.fieldNames, this.fieldNamesForInfo);
      // }

      // this.scriveLog('Struttura per info', this.data, this.fieldNamesForInfo, this.fieldNamesForInfo.length);
      if (!this.fieldNamesForInfo || this.fieldNamesForInfo.length === 0) {
        this.fieldNamesForInfo = new Array();
        this.fieldNamesForInfoKey = new Array();
        this.fieldNamesForDescription = new Array();
        if (this.data) {
          this.data.ColumnProperty.forEach(element => {
            // this.scriveLog(element.description);
            this.fieldNamesForInfo.push(element.headerText);
            this.fieldNamesForInfoKey.push(element.key);
            this.fieldNamesForDescription.push(element.description);
          });
        }
      }

      let s = '';
      let index = 0;
      this.fieldNamesForInfo.forEach(element => {
        if (element !== 'TRAILIS' && element !== 'TRAILIS_DAY' ) {
            // s += '<bold>' + element + ':</bold> ' + this.lastSelected.dataItem[element] + '<br />';
            if (this.fieldNamesForInfo[index]) {
              let fn = this.fieldNamesForInfo[index];
              if (!fn || fn === null) {
                fn = '';
              }
              const ss = '<b>' + fn + '</b>';
              let num = this.fieldNamesForInfoKey[index];
              let lss = '';
              if (num && num !== null && ls && ls[num]) {
                lss = ls[num];
              }

              s += ss + ': ' + lss + '<br />';
            }
        }
        index++;
      });
      while (s.indexOf(environment.replaceChar) > -1) {
        s = s.replace(environment.replaceChar, '.');
      }
      
      // this.scriveLog(s);
      /* let ancora = true;
      while (ancora === true && s.indexOf('***') > -1) {
        let tratto = s.substring(s.indexOf('***') + 3, s.length);
        if (tratto.indexOf('***') > -1) {
          tratto = tratto.substring(0, tratto.indexOf('***'));
          tratto = '***' + tratto + '***';
          // this.scriveLog(tratto);
          s = s.replace(tratto, '');
        } else {
          ancora = false;
        }
      } */

      // this.scriveLog(s);
      let esci = false;
      // this.scriveLog(testo);
      while (s.indexOf('***') > -1 && esci === false) {
        let sost = s.substring(s.indexOf('***') + 3, s.length);
        // this.scriveLog(sost);
        if (sost.indexOf('***') > -1) {
          sost = sost.substring(0, sost.indexOf('***'));
          sost = '***' + sost + '***';
          // this.scriveLog('------------------------------');
          // this.scriveLog(testo);
          // this.scriveLog(sost);
          while (s.indexOf(sost) > -1) {
            s = s.replace(sost, '');
          }
        } else {
          esci = true;
        }
      }

      // this.scriveLog('Apertura info 2', s);
      // logConsole('Testo finale per info: ', s); 
      const campi = new Array();
      // const tm = setTimeout(() => {
        const righe = s.split('<br />');
        righe.forEach(element => {
          const riga = element.replace('<b>', '').replace('</b>', '');
          const a = riga.indexOf(':');
          if (a > -1) {
            const nomeCampo = riga.substring(0, a);
            const contenutoCampo = riga.substring(a + 2, riga.length);
            const campo = {
              NomeCampo: nomeCampo,
              ContenutoCampo: contenutoCampo
            }
            campi.push(campo);
          }
        });
        this.textInfo = campi;
        logConsole('Testo finale per info: ', campi); 

        // this.textInfo = JSON.parse(JSON.stringify(s));
      // }, 100);
    }
  }

  apriLink(e) {
    window.open(e, '_blank');
  }

  /* public reloadGrid() {
    // const t = DashboardHeaderComponent.t;

    // localStorage.setItem(t.returnUserName() + '_' + this.maskName + '_persistence', '0');

    // this.itemSelected.emit(this.selectedElement || null);

    // if (this.maskName === 'tc-run-list_adHocTCRun') {
      // const t = DashboardHeaderComponent.t;
      // t.checkRequests(false);
    // }

    // if (this.maskName === 'Requests') {
      // const t = DashboardHeaderComponent.t;
      // t.checkRequests(true);
    // } else {
      /* if (this.maskName === 'tc-run-list_scheduler' || this.maskName === 'tc-run-list_adHocTCRun') {
        daysAgo = this.numberOfDays;
      } else {
        daysAgo = -1;
      } //

      // const t = DashboardHeaderComponent.t;
      // t.checkRequests(false);

      // this.lastSelected = null;

      this.isReloading = true;
      if (this.editGridOn) { //  && GeneralComponent.rowsModified
        if (confirm('Are you sure to discard changes ?')) {
          // GeneralComponent.rowsModified = false;
          this.rowsEdited = false;
          // this.gridGeneral.reloadGrid(this.maskName, null);
        }
      } else {
        // this.gridGeneral.reloadGrid(this.maskName, null);
      }
    // }

    this.clickOnMenu2 = false;
  } */

  getBGColorRow(r) {
    // this.stampaTempi('getBgColorRow');
    let bgColor = '';

    if (this.gridData && this.gridData !== null) {
      if ((this.gridData.data || this.gridData) && (r.BackColor !== undefined || r.BACKCOLOR !== undefined)) {
        if (r.BackColor !== undefined) {
          bgColor = r.BackColor;
        } else {
          bgColor = r.BACKCOLOR;
        }
      }
    }
    // this.scriveLog('Colore', bgColor);
    // this.stampaTempi('Fatto getBgColorRow: ' + bgColor);
    // logConsole('Colore riga: ', bgColor);
    return bgColor;
  }

  getLogColor() {
     return ''; // this.logColor;
  }

  /* getBGColor(r) {
    let bgColor = '';

    if (this.gridData) {
        bgColor = r.BackColor;
    }

    return bgColor;
  } */

  getFGColor(r) {
    // this.stampaTempi('getFgColor');
    let fgColor = '';

    if (this.gridData && this.gridData !== null) {
      if ((this.gridData.data || this.gridData) && (r.ForeColor !== undefined || r.FORECOLOR !== undefined)) {
        if (r.ForeColor !== undefined) {
          fgColor = r.ForeColor;
        } else {
          fgColor = r.FORECOLOR;
        }
      }
    }

    // this.stampaTempi('getFgColor: ' + fgColor);
    return fgColor;
  }

  getPadding() {
    let padding = '2';

    // if (this.maskName === 'tc-run-detail') {
    //   padding = '0';
    // }

    return padding;
  }

  /* getRowColor(rowIndex) {
    const style = {'background-color': null, 'color': null};

    this.paddingCell = '2';
    if (this.gridData) {
      if (this.gridData[rowIndex].BackColor) {
        // style['background-color'] = this.gridData[rowIndex].BackColor;
        this.bgColorCell = this.gridData[rowIndex].BackColor;
      }
      if (this.gridData[rowIndex].ForeColor) {
        // style['color'] = this.gridData[rowIndex].ForeColor;
        this.fgColorCell = this.gridData[rowIndex].ForeColor;
      }
    }

    if (this.maskName === 'tc-scenario') {
      this.paddingCell = '0';
    }
    return style;
  } */

  getIconTrace(column) {
    if (column.Protocol === 'L3') {
      return 'k-icon k-i-star';
    } else {
      return 'k-icon k-i-stop';
    }
  }

  /* doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
    // this.scriveLog(xhr);
    if (xhr.status === 404) {
        return false;
    } else {
        return true;
    }
  } */

  fileExists(url: string): Observable<boolean> {
    return this.http.get(null, url)
      .pipe(
          map(response => {
            return true;
          }),
          catchError(error => {
            return of(false);
          })
      );
  }

  getIconNameIfExists(c, d) {
    // this.scriveLog(c.iconName, d[c.iconName]);

    let icon = '';
    const nomeIcona = d[c.iconName];
    if (nomeIcona && nomeIcona !== null) {
      icon = this.linkIcone + "/icons/" + nomeIcona;
    } else {
      icon = this.linkIcone + '/icons/Empty.png';
    }
    // this.scriveLog(icon);

    return icon;
  }

  getIconIfExists(c, d) {
    // this.scriveLog(c.showIconText);
    const nomeIcona = this.getIconString(c.icon, d);
    let icon = '';

    /* this.fileExists(icon).subscribe((i) => {
      // this.scriveLog(i);
      if (i === true) {
        return icon;
      } else {
        return this.linkIcone + '/icons/Empty.png';
      }
    }); */
    // return this.fileExists(icon) ? icon : this.linkIcone + '/icons/Empty.png';

    // return icon;
    /* this.imageExists(icon, function(exists) {
      if (exists) {
        return icon;
      } else {
        return '';
      }
    }); */

    // this.scriveLog(icon);
    // if (!this.doesFileExist(icon)) {
    //    icon = 'assets/img/icons/Failed.png';
    // }

    /* const urlExists = require('url-exists');

    urlExists(icon, function(err, exists) {
      if (exists) {
        icon = 'assets/img/icons/Failed.png';
      }
    }); */

    const ultimaLettera = nomeIcona.substring(nomeIcona.length - 1, nomeIcona.length);
// this.scriveLog(nomeIcona, primaLettera);
    if (ultimaLettera === '0' || ultimaLettera === '1' || ultimaLettera === '2' || ultimaLettera === '3'
        || ultimaLettera === '4' || ultimaLettera === '5' || ultimaLettera === '6'
        || ultimaLettera === '7' || ultimaLettera === '8' || ultimaLettera === '9') {
      icon = this.linkIcone + '/icons/Empty.png';
    } else {
      icon = this.linkIcone + c.icon + nomeIcona + '.png';
      // this.scriveLog(icon);
    }

    return icon;
  }

  onImgError(e) {
    e.target.src = this.linkIcone + '/icons/Empty.png';
  }

  ultimeColumnProperty;
  modalitaAltezza = -1;
  altezzaRigaStandard;
  margineAlto = 0;

  calcolaAltezzaRighe(dati) {
    this.altezzaRigaInterna = new Array();

    if (this.paginazione === 'virtual') {
      let quanto = 15;

      if (this.DimensioneFont) {
        this.modalitaAltezza = 62;
        quanto = this.DimensioneFont + 5;
      }
  
      this.modalitaAltezza = 6;
      this.altezzaRigaStandard = quanto;

      dati.DataTable.forEach(element => {
        this.altezzaRigaInterna[element.ROW_ID] = quanto + 'px';
      });
      return;
    }
    // logConsole('Dati per altezza', dati);

    if (!dati.ColumnProperty) {
      dati.ColumnProperty = JSON.parse(JSON.stringify(this.ultimeColumnProperty));
    }
    this.ultimeColumnProperty = JSON.parse(JSON.stringify(dati.ColumnProperty));

    let quanto2 = 15;
    this.modalitaAltezza = 1;
    // this.margineAlto = -2;
    
    if (this.DimensioneFont) {
      this.modalitaAltezza = 2;
      quanto2 = this.DimensioneFont + 5;
      this.margineAlto = -2;
    }

    this.altezzaRigaStandard = quanto2;

    // logConsole('DATI', dati);

    let ceCombo = false;
    let ceIcona = false;
    if (dati.ColumnProperty) {
      dati.ColumnProperty.forEach(element => {
        if (!ceCombo && element.combo) {
          ceCombo = true;
        }
        if (!ceIcona && element.IconName) {
          ceIcona = true;
        }
      });
    }

    if (dati && dati.DataTable && dati.DataTable[0] && dati.DataTable[0]['TC_RUN_RESULT_BY_TIME']) {
      quanto2 = 75;
      this.altezzaRigaStandard = quanto2;

      this.modalitaAltezza = 3;

      dati.DataTable.forEach(element => {
        this.altezzaRigaInterna[element.ROW_ID] = quanto2 + 'px';
      });
    } else {    
      if (ceIcona) {
        this.modalitaAltezza = 41;
        quanto2 = 20;
        if (this.DimensioneFont) {
          this.modalitaAltezza = 42;
          quanto2 = this.DimensioneFont + 6;
          this.margineAlto = -4;
        }
        this.altezzaRigaStandard = quanto2;
    
        dati.DataTable.forEach(element => {
          this.altezzaRigaInterna[element.ROW_ID] = quanto2 + 'px';
        });
      } else {
        if (ceCombo) {
          quanto2 = 18;

          this.modalitaAltezza = 5;
          this.altezzaRigaStandard = quanto2;

          dati.DataTable.forEach(element => {
            this.altezzaRigaInterna[element.ROW_ID] = quanto2 + 'px';
          });
        } else {
          if (dati && dati.DataTable && dati.DataTable[0] && dati.DataTable[0].VALUE_STR_ALL) {
            this.modalitaAltezza = 6;

            dati.DataTable.forEach(element => {
              let quanto = quanto2 + 1;
              this.altezzaRigaStandard = quanto;

              const colKey = element.VALUE_STR_ALL;
              if (colKey.indexOf('<br />') > -1) {
                const ck = colKey.split('<br />');
                if (ck.length > 0) {
                  quanto *= (ck.length);
                }
                // logConsole('BR1:', element.VALUE_STR_ALL);
              } else {
                if (colKey.indexOf('\\n') > -1) {
                  const ck = colKey.split('\\n');
                  if (ck.length > 0) {
                    quanto *= (ck.length);
                  }
                  while (element.VALUE_STR_ALL.indexOf('\\n') > -1) {
                    element.VALUE_STR_ALL = element.VALUE_STR_ALL.replace('\\n', '<br />');
                  }
                  // logConsole('BR2:', element.VALUE_STR_ALL);
                // } else {
                //   quanto += 3;
                }
              }
            
              if (quanto < 15) { quanto = 15; }

              // this.altezzaRigaStandard = quanto;

              this.altezzaRigaInterna[element.ROW_ID] = quanto + 'px';
            });
          } else {
            dati.DataTable.forEach(element => {
              this.altezzaRigaInterna[element.ROW_ID] = quanto2 + 'px';
            });
          }
        }
      }
    }
  }

  isIconName(column, columnIcon)  {
    /* let quanto = 12;
    if (this.DimensioneFont) {
      quanto = this.DimensioneFont;
    }
    
    quanto += 3;

    this.altezzaRigaInterna = quanto.toString() + 'px'; */

    return columnIcon;
  }

  isIcon(column, columnIcon) {
    let s: string;
    let iconPath = '';
    let iconName = '';
    let ceIcona = false;
    // const column = this.data.ColumnProperty.find(col =>
    //   col.key.replace('<' , '').replace('>' , '').replace('.' , ' ').replace('.' , ' ')
    //   ===
    //   columnKey);
    if (column) {
      if (columnIcon) {
        switch (columnIcon) {
          case 'icons':
            iconPath = '/icons/';
            iconName = column.key;
            s = iconPath;
            this.spanIcon = '';
            ceIcona = true;
            break;
          case 'flags':
            iconPath = '/flags/';
            iconName = column.key;
            s = iconPath;
            this.spanIcon = '';
            ceIcona = true;
            break;
          case 'ICON_TRACE':
            iconPath = '';
            s = 'ICON_TRACE';
            this.spanIcon = 'k-i-star';
            ceIcona = true;
            break;
        }

        /* if (ceIcona) {
          let quanto = 12;
          if (this.DimensioneFont) {
            quanto = this.DimensioneFont;
          }
          quanto += 3;

          this.altezzaRigaInterna = quanto.toString() + 'px';
        } */

        return s;
      } else {
        s = '';
        return s;
      }
    } else {
      // this.scriveLog(columnKey);
    }
    s = '';
    return s;
  }

  getIconString(c, s) {
    if (s.indexOf('***') > -1) {
      s = s.substring(s.indexOf('***') + 3, s.length);
      s = s.substring(s.indexOf('***') + 3, s.length);
    }
    // this.scriveLog(s);
    if (c.toUpperCase().indexOf('FLAGS') > -1) {
      let ss = s;
      ss = ss.replace('PORT ' , '');
      if (ss.indexOf('-') > -1) {
        ss = ss.substring(0, ss.indexOf('-'));
      }

      return ss;
    } else {
      return s;
    }
  }

  renderGraph(key) {
  }

  convertStringToArrayNumber(c: string) {
    // this.stampaTempi('convertStringToArrayNumber');
    const c2 = c.split(',');
    const n = new Array<number>();
    c2.forEach(element => {
      n.push(Number(element));
    });

    // this.stampaTempi('Fatto convertStringToArrayNumber');
    return n;
  }

  /* getsOK(r) {
    return this.sOK[r];
  }

  getsFAILED(r) {
    return this.sFAILED[r];
  }

  getsABORT(r) {
    return this.sABORT[r];
  }

  getsDIFFERENCE(r) {
    return this.sDIFFERENCE[r];
  } */

  getOk(data, r) {
    // this.stampaTempi('getOK');
    if (this.sOK[r] === undefined) {
      this.sOK.push([]);

      if (data && data.indexOf('|') > -1 && data.indexOf(',') > -1) {
        const c = data.split('|');

        // const d1 = this.convertStringToArrayNumber(c[1]);
        this.sOK[r] = this.convertStringToArrayNumber(c[1]);

        // return  d1;
      }
    // } else {
    //   const d1 = this.convertStringToArrayNumber(this.sOK[r]);

    //  return  d1;
    }
    // this.stampaTempi('Fatto getOK');
  }

  getOk_Day(data, r) {
    // this.stampaTempi('getOK_Day');
    if (this.sOK_DAY[r] === undefined) {
      this.sOK_DAY.push([]);

      if (data && data.indexOf('|') > -1) {
        const c = data.split('|');

        // const d1 = this.convertStringToArrayNumber(c[1]);
        this.sOK_DAY[r] = this.convertStringToArrayNumber(c[1]);

        // return  d1;
      }
    // } else {
    //   const d1 = this.convertStringToArrayNumber(this.sOK[r]);

    //  return  d1;
    }
    // this.stampaTempi('Fatto getOK_Day');
  }

  getFailed(data, r) {
    // this.stampaTempi('getFailed');
    if (this.sFAILED[r] === undefined) {
      this.sFAILED.push([]);

      if (data && data.indexOf('|') > -1 && data.indexOf(',') > -1) {
        const c = data.split('|');

        // const d1 = this.convertStringToArrayNumber(c[2]);
        this.sFAILED[r] = this.convertStringToArrayNumber(c[2]);

        // return  d1;
      }
    // } else {
    //   const d1 = this.convertStringToArrayNumber(this.sFAILED[r]);

    //   return  d1;
    }
    // this.stampaTempi('Fatto getFailed');
  }

  ritornaDatiSB(d, n) {
    /* let dd;
    const ret = new Array();
    try {
      dd = JSON.parse(d.toString());
      // this.scriveLog(dd);
      let q = 0;
      dd.Values.forEach(element => {
        // this.scriveLog(element);
        if (q === n) {
          ret.push( { value: element.value, color: element.color, name: element.name } );
        }
        q++;
      });
    } catch (e) {
      // this.scriveLog('Errore di parse:', d);
    }
    // this.scriveLog(ret); */

    // const ret = [this.righeCst[d][n]];
    // this.scriveLog(d, n, ret);

    // return ret;
  }

  getFailed_Day(data, r) {
    // this.stampaTempi('getFailed_Day');
    if (this.sFAILED_DAY[r] === undefined) {
      this.sFAILED_DAY.push([]);

      if (data && data.indexOf('|') > -1) {
        const c = data.split('|');

        // const d1 = this.convertStringToArrayNumber(c[2]);
        this.sFAILED_DAY[r] = this.convertStringToArrayNumber(c[2]);

        // return  d1;
      }
    // } else {
    //   const d1 = this.convertStringToArrayNumber(this.sFAILED[r]);

    //   return  d1;
    }
    // this.stampaTempi('Fatto getFailed_Day');
  }

  getAbort(data, r) {
    // this.stampaTempi('getAbort');
    if (this.sABORT[r] === undefined) {
      this.sABORT.push([]);

      if (data && data.indexOf('|') > -1 && data.indexOf(',') > -1) {
        const c = data.split('|');

        // const d1 = this.convertStringToArrayNumber(c[3]);
        this.sABORT[r] = this.convertStringToArrayNumber(c[3]);

        // return  d1;
      }
    // } else {
    //   const d1 = this.convertStringToArrayNumber(this.sABORT[r]);

    //   return  d1;
    }
    // this.stampaTempi('Fatto getAbort');
  }

  getAbort_Day(data, r) {
    // this.stampaTempi('getAbort_Day');
    if (this.sABORT_DAY[r] === undefined) {
      this.sABORT_DAY.push([]);

      if (data && data.indexOf('|') > -1) {
        const c = data.split('|');

        // const d1 = this.convertStringToArrayNumber(c[3]);
        this.sABORT_DAY[r] = this.convertStringToArrayNumber(c[3]);

        // return  d1;
      }
    // } else {
    //   const d1 = this.convertStringToArrayNumber(this.sABORT[r]);

    //   return  d1;
    }
    // this.stampaTempi('Fatto getAbort_Day');
  }

  getOther_Day(data, r) {
    // this.stampaTempi('getOther');
    if (this.sOTHER_DAY[r] === undefined) {
      this.sOTHER_DAY.push([]);

      if (data && data.indexOf('|') > -1) {
        const c = data.split('|');

        // const d1 = this.convertStringToArrayNumber(c[3]);
        this.sOTHER_DAY[r] = this.convertStringToArrayNumber(c[4]);

        // return  d1;
      }
    // } else {
    //   const d1 = this.convertStringToArrayNumber(this.sABORT[r]);

    //   return  d1;
    }
    // this.stampaTempi('Fatto getOther_Day');
  }

  /* getDifference(data, r) {
    if (this.sDIFFERENCE[r] === undefined) {
      this.sDIFFERENCE.push([]);

      if (data && data.indexOf('|') > -1 && data.indexOf(',') > -1) {
        const c = data.split('|');

        // let max = [0, 0, 0, 0, 0, 0, 0];
        // let maxB = 0;
        // let maxC = 0;

        const d0 = this.convertStringToArrayNumber(c[0]);
        const d1 = this.convertStringToArrayNumber(c[1]);
        const d2 = this.convertStringToArrayNumber(c[2]);
        const d3 = this.convertStringToArrayNumber(c[3]);

        let maxT =  0;
        let index = 0;
        d1.forEach(element => {
          const t = d1[index] + d2[index] + d3[index];
          if (t > maxT) {
            maxT = t;
          }
          index++;
        });
        /* d2.forEach(element => {
          if (element > maxB) {
            maxB = element;
          }
        });
        d3.forEach(element => {
          if (element > maxC) {
            maxC = element;
          }
        });

        max.forEach(element => {
          if (element > maxT) {
            maxT = element;
          }
        }); *//*

        // let maxT = maxA + maxB + maxC;
        if (maxT === 0) {
          maxT = 1;
        }
        const dd = [0, 0, 0, 0, 0, 0, 0];

        // let index = 0;
        // this.sDIFFERENCE[r] = '';
        index = 0;
        d0.forEach(element => {
          dd[index] = maxT - (d1[index] + d2[index] + d3[index]);
          index++;
        });

        this.sDIFFERENCE[r] = dd;

        // this.scriveLog('Riga ' + r + ' -> ' + dd + ' T.: ' + maxT + ')');
        // this.scriveLog('   -> ' + d1 + ' - ' + d2 + ' - ' + d3);
        // this.sDIFFERENCE[r] = this.sDIFFERENCE[r].substring(0, this.sDIFFERENCE[r].length - 1);

        // return dd;
      }
    // } else {
    //   const d1 = this.convertStringToArrayNumber(this.sDIFFERENCE[r]);

    //   return  d1;
    }
  } */

  getCount() {
    return [0, 1, 2, 3, 4, 5, 6, 7];
  }

  estraeSoloDatiFiltratiDallaGriglia = true;

  exportCSV() {
    const date = new Date();
    const formattedDate =
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0');
    const fileName=this.act_set.replace('[', '(').replace(']', ')') + '_' + this.title + '_' + formattedDate + '.csv';
    this.exportToCSV(this.gridData, fileName);
  }

  exportToCSV(data: any[], fileName: string = 'export.csv') {
    if (!data || !data.length) return;

    logConsole('CSV:', data, this.data);
    // return;

    const separator = ';';
    const keys = Object.keys(data[0]);

    const csvRows = [];

    // header
    let header = '';
    const campi = new Array();
    this.data.ColumnProperty.forEach(element => {
      if (element.hide === 'false') {
        header += '"' + element.headerText + '"' + separator;
        campi.push(element.key);
      }
    });
    csvRows.push(header);

    let righeFiltrate = data;

    if (this.estraeSoloDatiFiltratiDallaGriglia) {
      const filtro = {
        skip: 0,
        filter: this.filter
      }
      // logConsole('Campi per CSV:', campi, process(this.gridData, filtro), filtro);
      righeFiltrate = process(this.gridData, filtro).data;
    }

    for (const row of righeFiltrate) {
      let riga = '';
      campi.forEach(element => {
        let campo = row[element];
        if (campo === null || campo === undefined) {
          campo = '';
        } else {
          campo = campo.toString().replace(/"/g, '""');
        }
        riga += '"' + campo + '"' + separator;
      });
      csvRows.push(riga);
    }

    const csvContent = csvRows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.click();

    URL.revokeObjectURL(url);
  }

  exportExcel() {
    this.GridNormale.saveAsExcel();
  }

  excelData(): ExcelExportData {
    // this.scriveLog('Estrazione Excel');
    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    const datas = gridData;
    let datasToPrint1 = '';
    // if (this.debugTasto === true) {
      this.scriveLog('Griglia ' + this.maskName + '. Estrazione Excel', gridData);
    // }

    let righeFiltrate = datas;

    if (this.estraeSoloDatiFiltratiDallaGriglia) {
      const filtro = {
        skip: 0,
        filter: this.filter
      }
      // logConsole('Campi per CSV:', campi, process(this.gridData, filtro), filtro);
      righeFiltrate = process(this.gridData, filtro).data;
    }

    righeFiltrate.forEach(element => {
      let testo = JSON.stringify(element);
      const orig = JSON.stringify(element.VALUE);
      let valore = JSON.stringify(element.VALUE);
      if (valore && valore.indexOf('&') > -1) {
        // let conta = 0;
        const url = valore.toUpperCase().trim();
        if (url.indexOf('HTTP') === -1) {
          do {
            // this.scriveLog(testo);

            let t = valore.indexOf('&');
            let tt = valore.substring(t, valore.length);
            t = tt.indexOf(',');
            if (t > 0) {
              tt = tt.substring(0, t - 1);
            }
            valore = valore.replace(tt, '');
            valore += '"';
            /* conta++;
            if (conta > 5) {
              break;
            } */
          }
          while (valore.indexOf('&') > -1);
          // this.scriveLog('Uscita', valore);
          testo = testo.replace(orig, valore);
        }

        datasToPrint1 += (testo + ',');
      } else {
        let esci = false;
        // this.scriveLog(testo);
        while (testo.indexOf('***') > -1 && esci === false) {
          let sost = testo.substring(testo.indexOf('***') + 3, testo.length);
          // this.scriveLog(sost);
          if (sost.indexOf('***') > -1) {
            sost = sost.substring(0, sost.indexOf('***'));
            sost = '***' + sost + '***';
            // this.scriveLog('------------------------------');
            // this.scriveLog(testo);
            // this.scriveLog(sost);
            while (testo.indexOf(sost) > -1) {
              testo = testo.replace(sost, '');
            }
          } else {
            esci = true;
          }
        }

        datasToPrint1 += (testo + ',');
      }
    });
    if (!datasToPrint1) {
      datasToPrint1 = JSON.stringify(datas) + ' ';
    }

    datasToPrint1 = '[' + datasToPrint1.substring(0, datasToPrint1.length - 1);
    datasToPrint1 += ']';

    const datasToPrint2 = JSON.parse(datasToPrint1);
    // this.scriveLog('Estrazione Excel. Dati finali', datasToPrint2);

    this.clickOnMenu2 = false;

    return process(datasToPrint2, {});
    // return datasToPrint2;
  }

  pdfPrint() {
    this.clickOnMenu2 = false;
  }

  showColumnHider() {
    // this.columnsAppFiltered = JSON.parse(JSON.stringify(this.columnsApp));

    // this.columnsAppFiltered = this.columns;
    // this.columnsApp2 = this.columns;
    // const rit = this.getColumnsOrdered();

    // this.scriveLog('COLUMN HIDER');
    // this.scriveLog(this.columnsApp2);

    this.showColumnHideFlag = !this.showColumnHideFlag;
    this.gestisceSplit();
  }

  clickColumnHide(c) {
    logConsole('Column selector: Click column hide prima', c);

    if (c) {
      c.hidden = !c.hidden;

      const t = setTimeout(() => {
        clearTimeout(t);

        logConsole('Column selector: Click column hide dopo', this.columnsAppFiltered);
      }, 100);
    } else {
      logConsole('Column selector: Colonna non trovata', c);
    }
  }

  saveColumnHide(closeMask) {
    // this.scriveLog('ORDINAMENTO COLONNE 1');
    // this.scriveLog(this.columnsAppFiltered);
    logConsole('Column selector: Salvataggio colonne nascoste prima', this.columnsAppFiltered);

    this.createArray();

    // this.scriveLog('NASCONDIMENTO COLONNE 2');
    // this.scriveLog(this.columnsAppFiltered);

    this.isAlreadyLoaded = false;

    if (closeMask) {
      this.showColumnHideFlag = false;
    }

    // this.scriveLog(JSON.parse(JSON.stringify(this.columns)));
    this.columns = JSON.parse(JSON.stringify(this.columnsAppFiltered));
    // this.scriveLog(JSON.parse(JSON.stringify(this.columns)));

    const rit = this.getColumnsOrdered();

    // this.orderColumnsByCookie(s);
    // this.createColumns();

    // this.columnsApp = JSON.parse(JSON.stringify(this.columns));
    // this.columnsAppFiltered = JSON.parse(JSON.stringify(this.columns));
    // this.columnsApp2 = this.columnsAppFiltered;

    // this.scriveLog(this.data.ColumnProperty);

    let s = '';
    let index = 0;
    this.columnsAppFiltered.forEach(element => {
      let v = '0';
      if (this.columns[index].hidden) {
        v = '1';
      }
      s += v + ';';
      index++;
    });

    this.columnsAppFiltered = this.columns;
    // this.scriveLog(this.columnsAppFiltered);

    // this.scriveLog(s);

    localStorage.setItem(this.returnUserName() + '_column_' + this.maskName + '_hidden', s);
    this.ciSonoColumnHidden = true;

    /* if (this.selezioneMultipla2) {
      this.routineDiCaricamento('Save column hide');
    } */

    this.scriveImpostazioniColonne(false);

    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (!this.GridGenInterna) {
        this.impostaGridGenInterna('saveColumnHide');
      }

      if (this.GridGenInterna) {
        // alert('autofit 2');
        this.esegueAutoFitFisico('saveColumnHide');
      }
    }, 100); // TIMEOUT - PRIMA ERA 1000
  }

  esegueAutoFitFisico(daDove) {
    // const t = setTimeout(() => {
    //  clearTimeout(t);
      
      logConsole('Autofit fisico 1: ', this.GridGenInterna, this.raggruppabile);
      // requestAnimationFrame(() => {
        if (this.raggruppabile === undefined ||this.raggruppabile === false) {
          if (!this.GridGenInterna) {
            this.impostaGridGenInterna(daDove);
          }

          logConsole('Autofit fisico 2: ', this.GridGenInterna);
          this.GridGenInterna.autoFitColumns();
        }
      // });
    // });
  }
  
  selectAllColumnHide() {
    /* let index = 0;
    if (this.data && this.data.ColumnProperty)  {
      this.data.ColumnProperty.forEach(element => {
        this.columnsAppFiltered[index].hidden = false;
        index++;
      });
    } */

    // this.columnsApp = this.columnsAppFiltered;

    // this.saveColumnHide(false);
  }

  unselectAllColumnHide() {
    /* let index = 0;
    if (this.data && this.data.ColumnProperty)  {
      this.data.ColumnProperty.forEach(element => {
        this.columnsAppFiltered[index].hidden = true;
        index++;
      });
    } */

    // this.columnsApp = this.columnsAppFiltered;

    // this.saveColumnHide(false);
  }

  defaultColumnHide() {
    /* let index = 0;
    if (this.data && this.data.ColumnProperty)  {
      this.data.ColumnProperty.forEach(element => {
        this.columnsAppFiltered[index].hidden = this.columnsApp2[index].hidden;
        index++;
      });
    } */

    // this.columnsApp = this.columnsAppFiltered;

    // this.saveColumnHide(false);
  }

  // searchTcRun() {
  //   this.showedSearch = true;
  // }

  /* checkTextForSearch(e) {
    this.tcRunForSearch = e;

    return e;
  } */

  onFilterChange(e) {
    this.elaborazioneInCorso = true;
    // alert('accendo 1');

    // FUNZIONA TUTTO PER I MONITORING
    // SU AD-HOC NON AGGIORNA LE ALTRE GRIGLIE QUANDO IL RISULTATO E' NULLO
    // this.scriveLog('On filter change');

    if (e.filters && e.filters[0]) {
      const filter = new Array();
      const field = new Array();
      let q = 0;

      e.filters.forEach(element => {
        filter.push(('' + element.value).trim().toUpperCase());
        field.push(element.field);
        q++;
      });

      let ss = '';
      let ok = false;

      // this.scriveLog(this.maskName);

      let gridData = this.gridData;
      if (this.paginazione === 'virtual') {
        gridData = this.gridData.data;
      }
      if (gridData !== undefined) {
        gridData.forEach(element => {
          // this.scriveLog('Element', ele + ' -> ' + filter);
          if (!ok) {
            let row = 0;
            let equals = 0;

            field.forEach(element2 => {
              const ele = ('' + element[field[row]]).trim().toUpperCase();

              if (ele.indexOf(filter[row]) > -1) {
                // this.scriveLog(ele + '->' + filter[row]);
                equals++;
                if (equals === q) {
                  // if (this.maskName === 'tc-scenario' || this.maskName === 'ad-hoc') {
                  //   ss = 'undefined undefined undefined ' + element.TS_ID + ' undefined undefined undefined undefined';
                  // }

                  this.lastSelected = element;
                  this.selectedElement = element;

                  ok = true;
                  // this.scriveLog('Last selected', this.lastSelected);
                }
              }
              row++;
            });
          }
        });
      }
      // this.scriveLog('Valore', filter);
      // this.scriveLog('Field', field);
      // this.scriveLog('Griglia', this.gridData);

      let s = '';

      if (!ok) {
        // ss = 'undefined undefined undefined undefined undefined undefined undefined undefined';
        // ss = 'undefined';
        // s = JSON.stringify(ss);
        // this.lastSelected = null;
        // this.selectedElement = null;
        // this.mySelection = new Array();
      } else {
        // s  = JSON.stringify(ss);
        // this.mySelection = new Array();
        // this.mySelection.push(JSON.parse(s));
      }

      this.loadDatas(false);

      // this.scriveLog('maskName', this.maskName);
      // this.scriveLog('On filter change', s);

      this.setKey(this.maskName, s, this.maskName);
      /* if (!this.lastSelected) {
        if (this.maskName === 'ad-hoc') {
          this.setKey('adhoc-list-scenario', s, 'adhoc-list-scenario');
          this.setKey('tc-run-list_adHocTCRun', s, 'tc-run-list_adHocTCRun');
        }
        if (this.maskName === 'adhoc-list-scenario') {
          this.setKey('tc-run-list_adHocTCRun', s, 'tc-run-list_adHocTCRun');
        }

        if (this.maskName === 'tc-scenario') {
          this.setKey('Ts_By_day', s, 'Ts_By_day');
          this.setKey('tc-run-list_scheduler', s, 'tc-run-list_scheduler');
        }
        if (this.maskName === 'Ts_By_day',) {
          this.setKey('tc-run-list_scheduler', s, 'tc-run-list_scheduler');
        }
      } */
    } else {
      // this.scriveLog('Nessun filtro impostato');
    }
    this.saveGrid();

    this.elaborazioneInCorso = false;
  }

  setKey(maskName, s, title) {
    // this.scriveLog('Set Key: ', s);
    localStorage.setItem(this.returnUserName() + '_grid_' + title + '_key', s);
  }

  // TREE
  stateChangeOnTree(data: Array<PanelBarItemModel>) {
    const focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    // const categoryID = focusedEvent.id.substring(focusedEvent.id.indexOf('\'') + 1, focusedEvent.id.lastIndexOf('\''));

    // this.scriveLog('Click tree:', focusedEvent);

    let filter = null;
    let last_click = null;

    // this.scriveLog('Lista albero', this.eventSimTreeOrd);

    const secondo = focusedEvent.id.toUpperCase().trim();
    this.eventSimTreeOrd[0].children.forEach(element => {
      if (!filter) {
        const primo = element.id.toUpperCase().trim();
        // this.scriveLog('Confronto: ', '*' + primo + '*', '*' + secondo + '*');
        if (primo === secondo) {
          // this.scriveLog('Filtro: ', element);
          filter = element.id;
          last_click = element.id;
        }
      }
    });

    // this.scriveLog('Elemento selezionato:', filter);

    // Save last click
    // const t = DashboardHeaderComponent.t;
    // let cat = categoryID;
    // while (cat.indexOf('%') > -1) {
    //   cat = cat.replace('%', '');
    // }
    // localStorage.setItem(t.returnUserName() + '_last_click_port', cat);
    // Save last click

    /* if (filter === undefined || filter === null) {
      filter = '';
    } */

    this.clearSelections();

    // Save last click
    // this.scriveLog(this.returnUserName() + '_last_click', last_click + '§' + filter);
    // this.scriveLog(last_click + '§' + filter);
    localStorage.setItem(this.returnUserName() + '_last_click_' + this.maskName, last_click + '§' + filter);
    // Save last click

    // this.router.navigate(['/dashboard/line-manager'], {queryParams: {category: filter}});

    this.stateChange.emit(data);

    return false;
  }

  clearSelections() {
    this.eventSimTreeOrd[0].selected = false;
    this.eventSimTreeOrd[0].focused = false;
    this.eventSimTreeOrd[0].expanded = true;
    this.eventSimTreeOrd[0].children.forEach(element => {
      element.selected = false;
      element.focused = false;
    });

    // this.scriveLog('Pulizia: ', this.eventLineTree);
  }

  addChildren(node, array, root_id) {
      const treenode = <PanelBarItemModel> {
        id: node.OBJ_ID,
        title: ' ' + node.LABEL,
        children: [],
        expanded: node.OBJ_ID === root_id,
        icon: node.NODE_TYPE === 'Folder' ? 'folder' : 'file'
      };

      treenode.children = array
          .filter(current => {
              return current.FATHER_ID === treenode.id;
          })
          .map(current => this.addChildren(current, array, root_id));

      return treenode;
  }

  CreaArrayAlbero() {
    const root_id = 'root';
    // const root_id = 'CATEGORY = \'root\' ';

    // this.scriveLog('Library lettura tree: ' , this.eventSimTree);

    if (this.eventSimTree) {
      try {
        this.eventSimTreeOrd =
        this.eventSimTree.filter(e => e.OBJ_ID === root_id).map(e => this.addChildren(e, this.eventSimTree, root_id));
      } catch (e) {

      }
    }

    // this.scriveLog('Library CreaArrayAlbero: ' , this.eventSimTreeOrd);

    // Load last click
    const filter = localStorage.getItem(this.returnUserName() + '_last_click_' + this.maskName);

    // this.scriveLog('Leggo 3. Filtro: ', filter);

    if (filter !== null) {
      // this.scriveLog('filter');
      this.lastSelectedOfTree.emit(filter);

      this.clickOnLast(filter);
    }
  }

  clickOnLast(f) {
    if (this.eventSimTreeOrd && this.eventSimTreeOrd[0] && f && f !== '') {
      const c = f.split('§');
      const i = this.eventSimTreeOrd[0].children.length - 1;

      if (i > -1) {
        try {
          if (c[0] === 'root') {
            this.eventSimTreeOrd[0].selected = true;
            this.eventSimTreeOrd[0].focused = true;

            // this.router.navigate(['/dashboard/line-manager'], {queryParams: {category: ''}});
          } else {
              this.eventSimTreeOrd[0].children.forEach(element => {
              if (element.id.trim() === c[0].trim()) {
                element.selected = true;
                element.focused = true;

                // this.router.navigate(['/dashboard/line-manager'], {queryParams: {category: c[1]}});
              } else {
                element.children.forEach(elementc => {
                  if (elementc.id.trim() === c[0].trim()) {
                    elementc.selected = true;
                    elementc.focused = true;
                    element.expanded = true;

                    // this.router.navigate(['/dashboard/line-manager'], {queryParams: {category: c[1]}});
                  }
                });
              }
            });
          }
        } catch (e) {
          this.scriveLog('Griglia ' + this.maskName + '. Errore su click on last: ', e);
        }
      }
    }
  }

  sendLastSelectedOfTree(e) {
    // this.lastSelectedOfTree.emit(e);
  }
  // TREE

  public onTabSelect(e) {
    // if (this.debugTasto === true) {
      this.scriveLog('Griglia ' + this.maskName + '. Tab select: ', e);
    // }
  }

  refreshGridKey() {
    this.refresh.emit(true);
  }

  newKey() {
    this.newKeyPressed.emit(this.selectedRow);
  }

  copyKey() {
    this.copyKeyPressed.emit(this.selectedRow);
  }

  editKey() {
    this.editKeyPressed.emit(this.selectedRow);
  }

  editKeyN() {
    this.editKeyNPressed.emit(this.selectedRow);
  }

  deleteKey() {
    // this.stampaTempi('Delete key');
    let avviso = '';
    let righeSelezionate: string = '[';

    // this.scriveLog('Righe: ', this.mySelection);
    // this.scriveLog('Righe: ', this.gridData);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    logConsole('Riga da eliminare', this.mySelection, this.lastSelected, this.eliminaSelezioniSuClickRiga2);
    let messaggio = '';
    if (!this.eliminaSelezioniSuClickRiga2) {
      const riga = this.lastSelected.dataItem;

      this.righeDaEliminare = [riga.ROW_ID];
      messaggio = 'The object shall be permantly removed from the server.';
      // this.mostraPopup(messaggio, true, 'DELETEOBJECT');
    } else {
      this.mySelection.forEach(element => {
        if (gridData !== undefined) {
          if (this.debug2) {
            logConsole('Griglia per eliminazione: ', gridData, this.mySelection, element);
          }
          gridData.forEach(element2 => {
            // logConsole('Ricerca ', element2.ROW_ID, element);
            if (+element2.ROW_ID === +element) {
              if (this.debug2) {
                logConsole('Riga rilevata nella griglia per eliminazione: ', element2);
              }
              const riga = JSON.stringify(element2);
              const campi = riga.split(',');
              let q = 0;
              campi.forEach(element3 => {
                if (q === 1 || q === 2 || q === 3) {
                  logConsole('Campo ', q, element3);
                  if (element3.indexOf(':') > - 1)  {
                    let valore = element3.substring(element3.indexOf(':') + 1, element3.length);
                    valore = valore.replace('"', '');
                    valore = valore.replace('"', '');
                    if (valore.indexOf('***')  > -1) {
                      const inizio = valore.indexOf('***');
                      // if (this.debugTasto === true) {
                        this.scriveLog('Griglia ' + this.maskName + '. Inizio 1', valore, inizio);
                      // }
                      if (inizio === 0) {
                        // ***background-color: #42d4f4,color: #FFFFFF***20220131_094327_SDTU100262.01
                        valore = valore.substring(inizio + 3, valore.length);
                        const fine = valore.indexOf('***');
                        valore = valore.substring(fine + 3, valore.length).trim();
                      } else {
                        // 20220131_094327_SDTU100262.01***background-color: #42d4f4,color: #FFFFFF***
                        valore = valore.substring(0, inizio).trim();
                      }
                      if (!valore || valore === null || valore.substring(0, 1) === '#' || valore.toUpperCase().trim() === 'UNDEFINED' || valore.toUpperCase().trim() === 'NULL') {
                        valore = '';
                      }
                      // if (this.debugTasto === true) {
                        this.scriveLog('Griglia ' + this.maskName + '. Fine', valore);
                      // }
                    }
                    avviso += valore + ' ';
                  } else {
                    let valore = element3;
                    valore = valore.replace('"', '');
                    valore = valore.replace('"', '');
                    if (valore.indexOf('***')  > -1) {
                      const inizio = valore.indexOf('***');
                      // if (this.debugTasto === true) {
                        this.scriveLog('Griglia ' + this.maskName + '. Inizio 2', valore, inizio);
                      // }
                      if (inizio === 0) {
                        // ***background-color: #42d4f4,color: #FFFFFF***20220131_094327_SDTU100262.01
                        valore = valore.substring(inizio + 3, valore.length);
                        const fine = valore.indexOf('***');
                        valore = valore.substring(fine + 3, valore.length).trim();
                      } else {
                        // 20220131_094327_SDTU100262.01***background-color: #42d4f4,color: #FFFFFF***
                        valore = valore.substring(0, inizio).trim();
                      }
                      if (!valore || valore === null || valore.substring(0, 1) === '#' || valore.toUpperCase().trim() === 'UNDEFINED' || valore.toUpperCase().trim() === 'NULL') {
                        valore = '';
                      }
                      // if (this.debugTasto === true) {
                        this.scriveLog('Griglia ' + this.maskName + '. Fine', valore);
                      // }
                    }
                    avviso += valore + ' ';
                  }
                }
                q++;
              });
              avviso += '\n';

              const riga2 = JSON.stringify(element2);
              righeSelezionate += riga2 + ', ';

              if (this.debug2) {
                logConsole('Riga impostata per eliminazione: ', righeSelezionate, element2);
              }

              /* let nome = '';
              if (element2.NAME) {
                nome = element2.NAME;
              } else {
                if (element2.NAME) {
                  nome = element2.ACT_NAME;
                } else {
                  if (element2.ACT_CODE) {
                    nome = element2.ACT_CODE;
                  }
                }
              }
              let folder = element2.FOLDER;
              if (folder === null) {
                folder = '';
              } else {
                folder += ' / ';
              }
              if (folder !== undefined && nome !== undefined && folder !== 'undefined' && nome !== 'undefined') {
                avviso += folder + nome + '\n';
              } */
            }
          });
        }
      });
      righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
      righeSelezionate += ']';
      // this.scriveLog(JSON.parse(righeSelezionate));

      if (this.debug2) {
        logConsole('Riga impostata per eliminazione finale: ', righeSelezionate, righeSelezionate.length);
      }

      if (righeSelezionate.length > 5) {
        this.righeDaEliminare = righeSelezionate;
        messaggio = 'The object \n\n' + avviso + '\n\nshall be permantly removed from the server.';
        // this.mostraPopup(messaggio, true, 'DELETEOBJECT');

        if (this.debug2) {
          logConsole('Eliminazione. Mostro popup');
        }
      }
    }

    if (this.scriveQuanteSuEliminazione) {
      let quanteRighe = 0;
      this.mySelection.forEach(element => {
        if (element > -1) {
          quanteRighe++;
        }
      });
      messaggio = quanteRighe + ' pages shall be removed';
    }

    // alert(this.modoMultiplo + ' - ' + messaggio);
    if (!this.selezioneMultipla2) {
      Swal.fire({
          title: this.titoloEliminazione,
          text: messaggio,
          icon: 'warning',
          background: this.coloreSfondoEliminazione,
          color: this.coloreTestoEliminazione,
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
          this.deleteKeyPressed.emit(JSON.parse(this.righeDaEliminare));
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } else {
      this.deleteKeyPressed.emit(JSON.parse(this.righeDaEliminare));
    }

    /* if (confirm(messaggio)) {
      this.deleteKeyPressed.emit(JSON.parse(this.righeDaEliminare));
    }
      if (confirm(messaggio)) {
      this.deleteKeyPressed.emit(JSON.parse(righeSelezionate));
    } */
    // this.stampaTempi('Fatto Delete key');
  }

  deleteKeyTcRun() {
    // this.stampaTempi('Delete key');
    let avviso = '';
    let righeSelezionate: string = '[';

    this.scriveLog('Delete key tc run: Dati selezionati ', this.mySelection, this.mySelection.length);
    this.scriveLog('Delete key tc run: Dati griglia ', this.gridData);

    if (this.mySelection.length === 0) {
      Swal.fire({
        title: 'Confirm',
        text: 'Check one or more TcRun you want to abort, then push this button',
        icon: 'question',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      });
      // alert('Check one or more TcRun you want to abort, then push this button');
      return;
    }

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (+element2.ROW_ID === +element) {
            const riga = JSON.stringify(element2);
            const campi = riga.split(',');
            let q = 0;
            campi.forEach(element3 => {
              if (q === 1 || q === 2 || q === 3) {
                if (element3.indexOf(':') > - 1)  {
                  let valore = element3.substring(element3.indexOf(':') + 1, element3.length);
                  valore = valore.replace('"', '');
                  valore = valore.replace('"', '');
                  if (valore.indexOf('***')  > -1) {
                    const inizio = valore.indexOf('***');
                    // if (this.debugTasto === true) {
                      this.scriveLog('Griglia ' + this.maskName + '. Inizio 1', valore, inizio);
                    // }
                    if (inizio === 0) {
                      // ***background-color: #42d4f4,color: #FFFFFF***20220131_094327_SDTU100262.01
                      valore = valore.substring(inizio + 3, valore.length);
                      const fine = valore.indexOf('***');
                      valore = valore.substring(fine + 3, valore.length).trim();
                    } else {
                      // 20220131_094327_SDTU100262.01***background-color: #42d4f4,color: #FFFFFF***
                      valore = valore.substring(0, inizio).trim();
                    }
                    if (!valore || valore === null || valore.substring(0, 1) === '#' || valore.toUpperCase().trim() === 'UNDEFINED' || valore.toUpperCase().trim() === 'NULL') {
                      valore = '';
                    }
                    // if (this.debugTasto === true) {
                      this.scriveLog('Griglia ' + this.maskName + '. Fine', valore);
                    // }
                  }
                  avviso += valore + ' ';
                } else {
                  let valore = element3;
                  valore = valore.replace('"', '');
                  valore = valore.replace('"', '');
                  if (valore.indexOf('***')  > -1) {
                    const inizio = valore.indexOf('***');
                    // if (this.debugTasto === true) {
                      this.scriveLog('Griglia ' + this.maskName + '. Inizio 2', valore, inizio);
                    // }
                    if (inizio === 0) {
                      // ***background-color: #42d4f4,color: #FFFFFF***20220131_094327_SDTU100262.01
                      valore = valore.substring(inizio + 3, valore.length);
                      const fine = valore.indexOf('***');
                      valore = valore.substring(fine + 3, valore.length).trim();
                    } else {
                      // 20220131_094327_SDTU100262.01***background-color: #42d4f4,color: #FFFFFF***
                      valore = valore.substring(0, inizio).trim();
                    }
                    if (!valore || valore === null || valore.substring(0, 1) === '#' || valore.toUpperCase().trim() === 'UNDEFINED' || valore.toUpperCase().trim() === 'NULL') {
                      valore = '';
                    }
                    // if (this.debugTasto === true) {
                      this.scriveLog('Griglia ' + this.maskName + '. Fine', valore);
                    // }
                  }
                  avviso += valore + ' ';
                }
              }
              q++;
            });
            avviso += '\n';

            const riga2 = JSON.stringify(element2);
            righeSelezionate += riga2 + ', ';

            /* let nome = '';
            if (element2.NAME) {
              nome = element2.NAME;
            } else {
              if (element2.NAME) {
                nome = element2.ACT_NAME;
              } else {
                if (element2.ACT_CODE) {
                  nome = element2.ACT_CODE;
                }
              }
            }
            let folder = element2.FOLDER;
            if (folder === null) {
              folder = '';
            } else {
              folder += ' / ';
            }
            if (folder !== undefined && nome !== undefined && folder !== 'undefined' && nome !== 'undefined') {
              avviso += folder + nome + '\n';
            } */
          }
        });
      }
    });
    if (righeSelezionate.length > 3) {
      righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
      righeSelezionate += ']';
      this.debug2 && this.scriveLog('Delete key tc run: Righe selezionate finali: ', JSON.parse(righeSelezionate));

      this.righeDaEliminare = righeSelezionate;
      const messaggio = 'Abort the selected TcRun to discard it from analysis.\nAction is permanent, cannot be cancelled.\nRelated Act must be reprocessed ';
      // this.mostraPopup(messaggio, true, 'DELETEOBJECT');

      if (!this.selezioneMultipla2) {
        Swal.fire({
          title: 'Confirm',
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
            this.deleteKeyTcRunPressed.emit(JSON.parse(this.righeDaEliminare));
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
      } else {
        this.deleteKeyTcRunPressed.emit(JSON.parse(this.righeDaEliminare));
      }
      /* if (confirm(messaggio)) {
        this.deleteKeyTcRunPressed.emit(JSON.parse(this.righeDaEliminare));
      }
      if (confirm(messaggio)) {
        this.deleteKeyPressed.emit(JSON.parse(righeSelezionate));
      } */
    } else {
      Swal.fire({
        title: 'Confirm',
        text: 'Check one or more TcRun you want to abort, then push this button',
        icon: 'question',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      });
    }
    // this.stampaTempi('Fatto Delete key');
  }

  deleteKey2() {
    // this.stampaTempi('Delete key');
    let avviso = '';
    let righeSelezionate: string = '[';
    // this.scriveLog('Righe: ', this.mySelection);
    // this.scriveLog('Righe: ', this.gridData);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (+element2.ROW_ID === +element) {
            const riga = JSON.stringify(element2);
            const campi = riga.split(',');
            let q = 0;
            campi.forEach(element3 => {
              if (q === 1 || q === 2 || q === 3) {
                if (element3.indexOf(':') > - 1)  {
                  let valore = element3.substring(element3.indexOf(':') + 1, element3.length);
                  valore = valore.replace('"', '');
                  valore = valore.replace('"', '');
                  // this.scriveLog(valore);
                  avviso += valore + ' ';
                } else {
                  let valore = element3;
                  valore = valore.replace('"', '');
                  valore = valore.replace('"', '');
                  // this.scriveLog(valore);
                  avviso += valore + ' ';
                }
              }
              q++;
            });
            avviso += '\n';

            const riga2 = JSON.stringify(element2);
            righeSelezionate += riga2 + ', ';

            /* let nome = '';
            if (element2.NAME) {
              nome = element2.NAME;
            } else {
              if (element2.NAME) {
                nome = element2.ACT_NAME;
              } else {
                if (element2.ACT_CODE) {
                  nome = element2.ACT_CODE;
                }
              }
            }
            let folder = element2.FOLDER;
            if (folder === null) {
              folder = '';
            } else {
              folder += ' / ';
            }
            if (folder !== undefined && nome !== undefined && folder !== 'undefined' && nome !== 'undefined') {
              avviso += folder + nome + '\n';
            } */
          }
        });
      }
    });
    if (righeSelezionate.length > 5) {
      righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
      righeSelezionate += ']';
    // this.scriveLog(JSON.parse(righeSelezionate));

      // if (confirm('Are you sure to delete selected rows? \n\n' + avviso)) {
        this.deleteKeyPressed2.emit(JSON.parse(righeSelezionate));
      // }
    } else {
    }
    // this.stampaTempi('Fatto Delete key');
  }

  addKey() {
    this.addKeyPressed.emit(new Date().toString());
  }

  removeKey() {
    // this.stampaTempi('Delete key');
    let avviso = '';
    let righeSelezionate: string = '[';
    // this.scriveLog('Righe: ', this.mySelection);
    // this.scriveLog('Righe: ', this.gridData);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (+element2.ROW_ID === +element) {
            const riga = JSON.stringify(element2);
            const campi = riga.split(',');
            let q = 0;
            campi.forEach(element3 => {
              if (q === 1 || q === 2 || q === 3) {
                if (element3.indexOf(':') > - 1)  {
                  let valore = element3.substring(element3.indexOf(':') + 1, element3.length);
                  valore = valore.replace('"', '');
                  valore = valore.replace('"', '');
                  // this.scriveLog(valore);
                  avviso += valore + ' ';
                } else {
                  let valore = element3;
                  valore = valore.replace('"', '');
                  valore = valore.replace('"', '');
                  // this.scriveLog(valore);
                  avviso += valore + ' ';
                }
              }
              q++;
            });
            avviso += '\n';

            const riga2 = JSON.stringify(element2);
            righeSelezionate += riga2 + ', ';

            /* let nome = '';
            if (element2.NAME) {
              nome = element2.NAME;
            } else {
              if (element2.NAME) {
                nome = element2.ACT_NAME;
              } else {
                if (element2.ACT_CODE) {
                  nome = element2.ACT_CODE;
                }
              }
            }
            let folder = element2.FOLDER;
            if (folder === null) {
              folder = '';
            } else {
              folder += ' / ';
            }
            if (folder !== undefined && nome !== undefined && folder !== 'undefined' && nome !== 'undefined') {
              avviso += folder + nome + '\n';
            } */
          }
        });
      }
    });
    righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
    righeSelezionate += ']';
    // this.scriveLog(JSON.parse(righeSelezionate));

    if (righeSelezionate.length > 5) {
      // if (confirm('Are you sure to remove selected rows? \n\n' + avviso)) {
        this.removeKeyPressed.emit(JSON.parse(righeSelezionate));
      // }
    }
    // this.stampaTempi('Fatto Delete key');
  }

  confirmKey() {
    // this.stampaTempi('Confirm key');
    let righeSelezionate: string = '[';
    // this.scriveLog('Righe: ', this.mySelection);
    // this.scriveLog('Righe: ', this.gridData);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (+element2.ROW_ID === +element) {
            const riga = JSON.stringify(element2);
            righeSelezionate += riga + ', ';
          }
        });
      }
    });
    righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
    righeSelezionate += ']';
    // this.scriveLog(JSON.parse(righeSelezionate));

    if (righeSelezionate.length > 5) {
      this.confirmKeyPressed.emit(JSON.parse(righeSelezionate));
    }
    // this.stampaTempi('Fatto Confirm key');
  }

  selectAllRows(e, daDove): void {
    // this.stampaTempi('Select all rows');
    // this.scriveLog('Selezionato tutto');
    logConsole('Select all rows', e.target.checked, this.possoSelezionareTutto);
    if (e.target.checked && (this.possoSelezionareTutto === undefined || this.possoSelezionareTutto === true)) {
      this.allRowsSelected = true;
      this.toConfirm = true;
      this.mySelection = this.data.DataTable.map(o => o.ROW_ID);
    } else {
      this.allRowsSelected = false;
      this.toConfirm = false;
      this.mySelection = [];
    }
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.creaRitornoSelezionati(null, null);
    }, 10);
    // this.stampaTempi('Fatto Select all rows');
  }

  clickSuCheck(e) {
    // alert('Click su check');
    // return;

    // logConsole('click su check', e, this.mySelection);
    
    let sel = new Array();
    let desel = new Array();
    let selID = JSON.parse(JSON.stringify(this.mySelection));

    if (e.selectedRows && e.selectedRows[0] && e.selectedRows[0].dataItem) {
      e.selectedRows.forEach(element => {
        sel.push(element.dataItem);
        if (!selID.includes(element.dataItem.ROW_ID)) {
          selID.push(element.dataItem.ROW_ID);
        }
      });
    } else {
      sel = null;
    }
    if (e.deselectedRows && e.deselectedRows[0] && e.deselectedRows[0].dataItem) {
      e.deselectedRows.forEach(element => {
        desel.push(element.dataItem);
        selID = selID.filter(x => x !== element.dataItem.ROW_ID);
        // logConsole('Deselezionato', element.dataItem.ROW_ID, selID);
      });
    } else {
      desel = null;
    }

    this.mySelection = JSON.parse(JSON.stringify(selID));

    // const tm = setTimeout(_ => this.creaRitornoSelezionati(sel, desel), 10);
    this.creaRitornoSelezionati(sel, desel);
  }

  /* prendeSelezionati() {
    const inv = new Array();

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      if (this.gridData.data.data) {
        gridData = this.gridData.data.data;
      } else {
        gridData = this.gridData.data;
      }
    }
    this.mySelection.forEach(element1 => {
      let ok = false;
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (!ok) {
            if (element1 === element2.ROW_ID) {
              ok = true;
              inv.push(element2);
            }
          }
        });
      }
    });

    return inv;
  } */

  vecchioRitorno = undefined;

  creaRitornoSelezionati(sel, desel) {
    // logConsole(sel, desel);
    const tm = setTimeout(() => {
      clearTimeout(tm);
      const inv = new Array();

      let gridData = this.gridData;
      if (this.paginazione === 'virtual') {
        if (this.gridData.data.data) {
          gridData = this.gridData.data.data;
        } else {
          gridData = this.gridData.data;
        }
      }
      // logConsole('Crea ritorno selezionati', this.mySelection, gridData);
      this.mySelection.forEach(element1 => {
        let ok = false;
        if (gridData !== undefined) {
          gridData.forEach(element2 => {
            if (!ok) {
              if (element1 === element2.ROW_ID) {
                ok = true;
                inv.push(element2);
              }
            }
          });
        }
      });
      const ritorno = {
        dati: inv,
        selezionato: sel,
        deselezionato: desel
      };
      // logConsole(inv, sel, desel);

      if (this.selezioneMultipla2 && this.eliminaSelezioniSuClickRiga2) {
        const q = this.mySelection.length;
        // this.scriveLog('Selezionati: ', q);
        if (q > 0) {
          this.toConfirm = true;
        } else {
          this.toConfirm = false;
        }
      } else {
        if (this.selezioneMultipla2 && !this.eliminaSelezioniSuClickRiga2) {
          if (this.lastSelected && this.lastSelected.dataItem) {
            this.toConfirm = true;
          } else {
            this.toConfirm = false;
          }
        }
      }

      this.clickSelezioneSuCheckRiga.emit(ritorno);
    }, 100);
    return;

    /* this.vecchioRitorno = ritorno;

    const tm = setTimeout(() => {
      // logConsole(JSON.stringify(this.vecchioRitorno), ritorno);
      if (JSON.stringify(this.vecchioRitorno) === JSON.stringify(ritorno)) {
        this.clickSelezioneSuCheckRiga.emit(ritorno);
      } else {
      }
    }, 1000); */
    // this.stampaTempi('Fatto Crea ritorno selezionati');
  }

  checkEdge(event) {
    this.edge = event;
    // this.scriveLog('edge:', event);
  }

  public rowCallback(context: RowClassArgs) {
    if (context && context.dataItem) {
      return {
          dragging: context.dataItem.dragging
      };
    } else {
      return null;
    }
  }

  // this.currentSubscription.unsubscribe();
  // this.zone.onStable.pipe(take(1))
  //     .subscribe(() => this.currentSubscription = this.handleDragAndDrop());

  private handleDragAndDrop(): Subscription {
    // this.scriveLog(this.PermetteDragDrop);
    // if (this.PermetteDragDrop === undefined || this.PermetteDragDrop === false) {
    //   return;
    // }

    const sub = new Subscription(() => {});
    let draggedItemIndex;

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }

    const tableRows = Array.from(document.querySelectorAll('.k-grid tr'));
    tableRows.forEach(item => {
        this.renderer.setAttribute(item, 'draggable', 'true');
        const dragStart = fromEvent<DragEvent>(item, 'dragstart');
        const dragOver = fromEvent(item, 'dragover');
        const dragEnd = fromEvent(item, 'dragend');

        sub.add(dragStart.pipe(
            tap(({ dataTransfer }) => {
                try {
                  const dragImgEl = document.createElement('span');
                  dragImgEl.setAttribute('style', 'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;');
                  document.body.appendChild(dragImgEl);
                  dataTransfer.setDragImage(dragImgEl, 0, 0);
                } catch (err) {
                  // IE doesn't support setDragImage
                }
                try {
                    // Firefox won't drag without setting data
                    dataTransfer.setData('application/json', '');
                } catch (err) {
                    // IE doesn't support MIME types in setData
                }
            })
        ).subscribe(({ target }) => {
            const row: HTMLTableRowElement = <HTMLTableRowElement>target;
            draggedItemIndex = row.rowIndex;
            // this.scriveLog(this.gridData);
            const dataItem = gridData[draggedItemIndex];
            dataItem.dragging = true;
        }));

        sub.add(dragOver.subscribe((e: any) => {
            e.preventDefault();
            const dataItem = gridData.splice(draggedItemIndex, 1)[0];
            const dropIndex = closest(e.target, tableRow).rowIndex;
            const dropItem = gridData[dropIndex];

            draggedItemIndex = dropIndex;
            this.zone.run(() =>
            gridData.splice(dropIndex, 0, dataItem)
            );
        }));

        sub.add(dragEnd.subscribe((e: any) => {
            e.preventDefault();
            const dataItem = gridData[draggedItemIndex];
            dataItem.dragging = false;

            if (this.paginazione === 'virtual') {
              this.gridData.data = JSON.parse(JSON.stringify(gridData));
              this.mySelection = [];
              this.detectFineDragDrop.emit(this.gridData);
            } else {
              this.gridData = JSON.parse(JSON.stringify(this.gridData));
              this.mySelection = [];
              this.detectFineDragDrop.emit(this.gridData);
            }
        }));
    });

    return sub;
  }

  setDelta() {
    if (!this.rigaSelezionataPerDelta) {
      // alert('Griglia ' + this.maskName + '. Please select a row first');
      Swal.fire({
        title: 'Confirm',
        text: 'Please select a row first',
        icon: 'question',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      });

      return;
    }
    this.scriveLog('Riga selezionata per delta', this.rigaSelezionataPerDelta);

    this.detectSetDelta.emit(this.rigaSelezionataPerDelta);

    /* let valore = JSON.parse(this.selectedRow)[this.CampoCalcolaDelta];
    if (this.gridDataAppoggio) {
      this.gridData = JSON.parse(JSON.stringify(this.gridDataAppoggio));
      const row = JSON.parse(this.selectedRow);
      this.gridData.forEach(element => {
        if (element.ROW_ID === row.ROW_ID) {
          valore = element[this.CampoCalcolaDelta];
        }
      });
      // this.scriveLog('Annullo modifiche', this.selectedRow, this.gridDataAppoggio[4], this.gridData[4], valore);
    }

    this.scriveLog('Imposto Delta', valore);
    if (valore) {
      const delta = valore;
      this.ultimoDelta = delta;
      // this.scriveLog(this.gridData);
      this.gridDataAppoggio = JSON.parse(JSON.stringify(this.gridData));
      // this.scriveLog('Imposto appoggio', this.gridDataAppoggio);

      this.setDeltaValue();
    } else {
      this.scriveLog('The field \'' + this.CampoCalcolaDelta + '\' doesn\'t exists');
    }

    /* const tm = setTimeout(() => {
      this.effettuaAutoFitAE = !this.effettuaAutoFitAE;
    }, 1000); */

    // this.rinfrescaGriglia = !this.rinfrescaGriglia; */
  }

  /* setDeltaValue() {
    if (this.ultimoDelta === -1) {
      return;
    }
    // this.scriveLog('Scrivo delta in base a', this.ultimoDelta);
    const delta = this.ultimoDelta;

    // if (this.gridDataAppoggio) {
    //   this.gridData = JSON.parse(JSON.stringify(this.gridDataAppoggio));
    // }

    const dati = this.gridData;
    dati.forEach(element => {
      element.delta = (Math.round((element.delta - delta) * 1000) / 1000).toString();
      if (element.delta.indexOf('.') === -1) {
        element.delta += '.000';
      } else {
        const intero = element.delta.substring(0, element.delta.indexOf('.'));
        let decimali = element.delta.substring(element.delta.indexOf('.') + 1, element.delta.length);
        const diff = 3 - decimali.length;
        for (let i = 1; i <= diff ; i++) {
          decimali += '0';
        }
        element.delta = intero + '.' + decimali;
      }
      if (element.delta.substring(0, 1) !== '-') {
        element.delta = '+' + element.delta;
      }
    });
  } */

  onSelectMenu(e) {
    // this.scriveLog(e.item.text, this.maskName);
    const rit = { Premuto: e.item.text, NomeGriglia: this.maskName};
    this.clickOnMenu.emit(rit);
  }

  synchronise() {
    this.synchroniseEmit.emit(new Date());
  }

  apreGestioneTicket() {
    // this.scriveLog(this.selectedRow);
    const s = JSON.parse(this.selectedRow);
    const params = {
      v_cntx: this.sessioneAttuale,
      v_act_id: s.act_id,
      v_file_hist_id: s.file_hist_id,
      v_event_row_id: s.event_row_id
    };
    // this.scriveLog(params);
    this.apiService.chiamataPost('ticket__sel', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // this.scriveLog(data2);
      if (data2 && data2 !== null) {
        // const d = JSON.parse(data2);
        if (data2.length > 0) {
          this.selezioneTicket = data2[0].status;
          this.titoloTicket = data2[0].title;
          this.descTicket = data2[0].description;
        } else {
          this.selezioneTicket = 'Info';
          this.titoloTicket = '';
          this.descTicket = '';
        }
    } else {
        this.selezioneTicket = 'Info';
        this.titoloTicket = '';
        this.descTicket = '';
        this.scriveLog('Griglia ' + this.maskName + '. Gestione ticket vuota: ', data2);
      }
    }, error => {
      this.scriveLog('Griglia ' + this.maskName + '. Gestione ticket errore: ', error);
    });
    this.mascheraTicketAperta = true;
  }

  changeValueTicket(e) {

  }

  cambiataSelezioneTicket(e) {
  }

  salvaTicket() {
    // this.scriveLog(this.selectedRow);
    const s = JSON.parse(this.selectedRow);
    const params = {
      v_cntx: this.sessioneAttuale,
      v_act_id: s.act_id,
      v_file_hist_id: s.file_hist_id,
      v_event_row_id: s.event_row_id,
      v_status: this.selezioneTicket,
      v_title: this.titoloTicket,
      v_description: this.descTicket,
      v_act_set_1_id: null,
      v_act_set_2_id: null,
      v_act_set_3_id: null,
      v_act_set_4_id: null,
      v_dashboard_id: null
    };
    // this.scriveLog(params);
    this.apiService.chiamataPost('rpc/ticket__ins', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // this.scriveLog(data2);
      // this.scriveLog(this.gridData);
      if (data2 && data2 !== null) {
        const r = JSON.parse(this.selectedRow);
        let g;
        if (this.paginazione === 'virtual') {
          g = this.gridData.data;
        } else {
          g = this.gridData;
        }
        g.forEach(element => {
          // this.scriveLog(element.ROW_ID, r.ROW_ID);
          if (+element.ROW_ID === +r.ROW_ID) {
            // this.scriveLog(element);
            element.tck_description = this.descTicket;
            element.tck_status = this.selezioneTicket;
            element.tck_title = this.titoloTicket;
          }
        });
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Salva ticket: ', r.ROW_ID, this.gridData.data);
        // }
        this.refreshGrid();
        // this.scriveLog('Ticket updated');
        this.mascheraTicketAperta = false;
      } else {
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. ', data2);
        // }
      }
    }, error => {
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Errore salva ticket: ', error);
      // }
    });
  }

  tornaStatusTicket() {
    if (!this.sessioneAttuale) {
      return;
    }

    const params = {
      cntx_id: this.sessioneAttuale,
      v_category: 'TicketStatus'
    };
    this.apiService.chiamataPost('geo_lookup__sel', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // this.scriveLog(data2);
      if (data2 && data2 !== null) {
        this.datiTicket = data2;
      } else {
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Status ticket: ', data2);
        // }
      }
    }, error => {
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Errore status ticket: ', error);
      // }
    });
  }

  eliminaTicket() {
    const s = JSON.parse(this.selectedRow);
    const params = {
      v_cntx: this.sessioneAttuale,
      v_act_id: s.act_id,
      v_file_hist_id: s.file_hist_id,
      v_event_row_id: s.event_row_id,
    };
    // this.scriveLog(params);
    this.apiService.chiamataPost('ticket__del', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // this.scriveLog(data2);
      if (data2 && data2 !== null) {
        this.selezioneTicket = 'Info';
        this.titoloTicket = '';
        this.descTicket = '';
        this.refreshGrid();
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Ticket deleted');
        // }
        this.mascheraTicketAperta = false;
      } else {
        // if (this.debugTasto === true) {
          this.scriveLog('Griglia ' + this.maskName + '. Ticket deleting: ', data2);
        // }
      }
    }, error => {
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Errore ticket deleting: ', error);
      // }
    });
  }

  prendeAltezzaGriglia() {
    if (this.sceltaFilter === true) {
      return 'calc(100% - 26px)';
    } else {
      return '100%';
    }
  }

  premutoExcelEventi() {
    this.excelEventiEmit.emit(new Date());
  }

  apreChiudeMenu(aperto) {
    // this.rowButtonsConfig2.showHeader = true;
    // return;

    // this.scriveLog(this.ultimoAperto);
    if (aperto) {
      this.rowButtonsConfig2.showHeader = true;
    } else {
      this.rowButtonsConfig2.showHeader = false;
    }
    /* if (this.rowButtonsConfig2.showHeader === false) {
      this.rowButtonsConfig2.showHeader = true;
      const tm = setTimeout(() => {
        this.rowButtonsConfig2.showHeader = false;
      }, 5000);
    } */
  }

  clickSuIcona(e, v, c) {
    // // logConsole('click su icona', e, v, c);
    if (c.clickEnabled) {
      // this.scriveLog(c);
      if (e) { // && (e.IS_EDITABLE && e.IS_EDITABLE.indexOf('Edit2') > - 1) || (e.IS_ACTIVE && (e.IS_ACTIVE === 'Y' || e.IS_ACTIVE === 'N'))) {
        this.clickatoSuIcona = true;
        const ee = {
          dati: e,
          valore: v,
          clickata: c
        };
        // this.scriveLog(ee);

        this.clickSuIconaEmit.emit(ee);
      }
    }
  }

  stoSulGrafico(n, v) {
    // this.scriveLog('Sto sul grafico', n, v);
    this.stoPassandoSulGrafico.emit(v);
  }

  ppp(e) {
    this.scriveLog(e);
  }

  apreIcone() {
    this.aperteIcone = true;
    // logConsole(this.aperteIcone);
  }

  chiudeIcone() {
    const elements = this._document.querySelectorAll('.k-overflow-anchor');
    if (elements && elements[0] && elements[0]['style'] && elements[0]['style']['visibility']) {
      const bottoncinoIcone = elements[0]['style']['visibility'];
      if (bottoncinoIcone === 'hidden') {
        this.aperteIcone = false;
      }
    }
    this.aperteIcone = false;
  }

  lastR;

  controllaSelezione(d, r1rr) {
    if (!d) {
      return;
    }

    if (this.limitaRighe) {
      if (!this.limitaRighe.controllaSelezione) {
        return;
      }
    }

    const r = d.ROW_ID;
    // logConsole('Selezione riga:', d, r);
    // this.scriveLog(r);
    if (!this.selectedRow) { // || !this.selectedRow) {
      // logConsole('Esco da selezione', this.mySelection, this.selectedRow);
      return '0px';
    }
    // logConsole('Selezione myselection: ', this.mySelection, r, this.selectedRow);
    let rr;
    if (typeof(this.selectedRow) === 'object') {
      // logConsole(this.selectedRow, typeof(this.selectedRow))
      const r1: JSON = this.selectedRow;
      // logConsole(r1);
      if (r1[0]) {
        rr = r1[0]['ROW_ID']; // JSON.stringify(this.selectedRow);
      } else {
        rr = r1['ROW_ID']; // JSON.stringify(this.selectedRow);
      }
    } else {
      if (typeof(this.selectedRow) === 'number' || typeof(this.selectedRow) === 'string') {
        rr = this.selectedRow;
      } else {
        const rrr = JSON.parse(this.selectedRow);
        rr  = rrr.ROW_ID;
      }
    }
    // logConsole(rr);
    if (r !== this.lastR) {
      // this.scriveLog('Selezione evidenza: ', r, rr, this.selectedRow);
      this.lastR = r;
    }
    if (+r === +rr) { // this.selectedRow.indexOf(r) > -1) {
      // if (this.selezioneMultipla === true) {
        // if (this.selectedRow && this.selectedRow !== '') {
          /* let riga = '';
          if (this.selectedRow.indexOf('ROW_ID') > -1) {
            riga = JSON.parse(this.selectedRow).ROW_ID;
          } else {
            riga = this.selectedRow;
          }

          if(+r === +riga) { */
            // logConsole('Selezione riga 1: ', r, this.mySelection, this.selectedRow, riga);
            return '1px solid red';
          /* } else {
            // logConsole('DeSelezione riga 1: ', r, this.mySelection, this.selectedRow, riga);
            return '0px';
          }
        } else {
          return '0px';
        }
      } else {
        return '1px solid red';
      } */
    } else {
      // if (this.selezioneMultipla === true) {
        // if (this.selectedRow && this.selectedRow !== '') {
          /* let riga = '';
          if (this.selectedRow.indexOf('ROW_ID') > -1) {
            riga = JSON.parse(this.selectedRow).ROW_ID;
          } else {
            riga = this.selectedRow;
          }

          // logConsole('Selezione riga 2: ', r, this.selectedRow, riga);
          if(+r === +riga) { */
          //  return '1px solid red';
          /* } else {
            return '0px';
          }
        } else {
          return '0px';
        } */
      // } else {
        return '0px';
      // }
    }
  }

  leggeCookies() {
    // this.cookieOrder = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_order');
    this.cookieKey = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_key');
    this.hideEmptyColumns = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_hideC');
    if (!this.hideEmptyColumns) {
      this.hideEmptyColumns = 'true';
    }
  }

  mostraPopup(Messaggio, Dialog, Cosa) {
    const dialogRef = this._matDialog.open(ConfermaComponent, {
      data: {
        messaggio: Messaggio,
        mostraAnnulla: Dialog
      },
    });

    const destroy$ = new Subject<void>();

    dialogRef.afterClosed().pipe(takeUntil(destroy$)).subscribe(result => {
      // alert(Cosa);
      switch(Cosa) {
        case 'RESETGRIDLAYOUT':
          this.resetGridLayout2();
          break;
        case 'DELETEOBJECT':
          this.deleteKeyPressed.emit(JSON.parse(this.righeDaEliminare));
          break;
      }
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. The dialog was closed', result);
      // }
      // this.animal = result;
    });
  }

  runKey() {
    // this.stampaTempi('Confirm key');
    let righeSelezionate: string = '[';
    // this.scriveLog('Righe: ', this.mySelection);
    // this.scriveLog('Righe: ', this.gridData);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (+element2.ROW_ID === +element) {
            const riga = JSON.stringify(element2);
            righeSelezionate += riga + ', ';
          }
        });
      }
    });
    righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
    righeSelezionate += ']';
    // this.scriveLog(JSON.parse(righeSelezionate));

    if (righeSelezionate.length > 5) {
      this.runKeyPressed.emit(JSON.parse(righeSelezionate));
    }
    // this.stampaTempi('Fatto Confirm key');
  }

  rePlayKey() {
    // this.stampaTempi('Confirm key');
    let righeSelezionate: string = '[';
    // this.scriveLog('Righe: ', this.mySelection);
    // this.scriveLog('Righe: ', this.gridData);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (+element2.ROW_ID === +element) {
            const riga = JSON.stringify(element2);
            righeSelezionate += riga + ', ';
          }
        });
      }
    });
    righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
    righeSelezionate += ']';
    // this.scriveLog(JSON.parse(righeSelezionate));

    if (righeSelezionate.length > 5) {
      this.rePlayKeyPressed.emit(JSON.parse(righeSelezionate));
    }
    // this.stampaTempi('Fatto Confirm key');
  }

  processKey() {
    // this.stampaTempi('Confirm key');
    let righeSelezionate: string = '[';
    // this.scriveLog('Righe: ', this.mySelection);
    // this.scriveLog('Righe: ', this.gridData);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (+element2.ROW_ID === +element) {
            const riga = JSON.stringify(element2);
            righeSelezionate += riga + ', ';
          }
        });
      }
    });
    righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
    righeSelezionate += ']';
    // this.scriveLog(JSON.parse(righeSelezionate));

    if (righeSelezionate.length > 5) {
      const messaggio = 'The object shall be processed.\nConfirm?';
      // this.mostraPopup(messaggio, true, 'DELETEOBJECT');

      if (!this.selezioneMultipla2) {
        Swal.fire({
          title: 'Confirm',
          text: messaggio,
          icon: 'warning',
          // background: '#9f1f1f',
          // color: '#fbf7f7',
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
            this.processKeyPressed.emit(JSON.parse(righeSelezionate));
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
      } else {
        this.processKeyPressed.emit(JSON.parse(righeSelezionate));
      }

      /* if (confirm(messaggio)) {
        this.processKeyPressed.emit(JSON.parse(righeSelezionate));
      } */

    }
    // this.stampaTempi('Fatto Confirm key');
  }

  keyWorkSpacePress(e) {
    // this.scriveLog(e);
    this.posXWS = e.x;
    this.posYWS = e.y + 20;
    this.popupWsAperto = !this.popupWsAperto;
  }

  wsSelezionato(e) {
    this.popupWsAperto = false;
    this.keyWorkspaceEmit.emit(e);
  }

  /* LeggeSimbolici() {
    // // this.scriveLog('Leggo simbolici');
    const params = '{' +
      '"cntx_id": "' + this.sessioneAttuale + '"' +
    '}';
    this.apiService.chiamataPost('geo_symbolic__sel', params)
    .map(response => response.json())
    .subscribe(data2 => {
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          alert(data2.v_failure_reason);
        } else {
          // // this.scriveLog(data2);
          // // const data = JSON.parse(data2);
          // // this.scriveLog(data); //  and name = \'GEO_R_MAP_MAX_MEASR\'

          data2.forEach(element => {
            const name = element.NAME;
            switch (name) {
              case 'GRID_PAGEABLE_ROW_NUM':
                this.puoPaginareAutomaticamente = element.VALUE;
                this.scriveLog('Paginazione automatica', this.puoPaginareAutomaticamente);
                break;
              }
          });
        }
      }
    }, error => {
      alert('Read symbolic: ' + error);
    });
  } */

  fBackToSelected() {
    /* let d = this.gridData;
    if (this.paginazione === 'virtual') {
      d = this.gridData.data;
    }

    let ret = '[';
    this.mySelection.forEach(element => {
      d.forEach(element2 => {
        if (element === element2.ROW_ID) {
          ret += JSON.stringify(element2) + ',';
        }
      });
    });
    // this.scriveLog(ret);
    if (ret.length > 3 && ret !== '[undefined') {
      ret = ret.substring(0, ret.length - 1);
      ret += ']';
      const r = JSON.parse(ret);

      this.backToSelectedEmit.emit(r);
    } */
    this.backToSelectedEmit.emit(new Date());
  }

  editTicket() {
    this.editTicketPressed.emit(this.selectedRow);
  }

  onFilterChanges(e) {
    this.filtroDaPassare = e;
    
    const tm = setTimeout(() => {
      clearTimeout(tm);
      // if (this.debugTasto === true) {
        this.scriveLog('Griglia ' + this.maskName + '. Filtro da passare: ', this.filtroDaPassare);
      // }
      localStorage.setItem(this.maskName + '_' + this.userName + '_Filter', this.filtroDaPassare);
      this.filterChanged.emit(this.filtroDaPassare);
      const tm1 = setTimeout(() => {
        clearTimeout(tm1);
        const filtro = document.getElementById('txtFilter_' + this.maskName);
        filtro.focus();
      }, 100);
    }, 100); // TIMEOUT - PRIMA ERA 1000
  }

  deselectAllRows() {
    this.mySelection = [];
    this.toConfirm = false;
    this.deselectedAllRows.emit(new Date());
  }

  appoggioSelezione;

  selectAllRowsByKey() {
    // logConsole('selectAllRowsByKey', this.gridData);
    let n = new Array();

    this.impostaGridGenInterna('selectAllRowsByKey');

    const d = JSON.stringify(this.GridGenInterna.data);

    // Mail 14/04/2026 14:24 -> Cambio gestione per selezione totale. Deve AGGIUNGERE tutte le righe filtrate, non solo quelle visibili
    // let gridData = JSON.parse(d);
    let gridData = JSON.parse(JSON.stringify(this.gridData));
    // Mail 14/04/2026 14:24 -> Cambio gestione per selezione totale. Deve AGGIUNGERE tutte le righe filtrate, non solo quelle visibili

    /* if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    } */
    // logConsole(gridData.data);
    let filtri;
    if (this.filter) {
      filtri = this.filter.filters;
    }
    // logConsole('FILTRO:', this.rowButtonsConfig2.showFilter, filtri, "Righe:", gridData.data);

    const r = new Array();
    if (gridData !== undefined) {
      // Mail 14/04/2026 14:24 -> Cambio gestione per selezione totale. Deve AGGIUNGERE tutte le righe filtrate, non solo quelle visibili
      // gridData.data.forEach(element => {
      gridData.forEach(element => {
      // Mail 14/04/2026 14:24 -> Cambio gestione per selezione totale. Deve AGGIUNGERE tutte le righe filtrate, non solo quelle visibili

        let ok = false;
        // logConsole('PROVA Filtro', this.rowButtonsConfig2.showFilter);
        if (!this.rowButtonsConfig2.showFilter) {
          ok = true;
        } else {
          // logConsole('Filtro 1: ', this.selezionaTuttiPerFiltro);
          if (!this.selezionaTuttiPerFiltro) {
            ok = true;
          } else {
            let q = 0;
            if (filtri) {
              filtri.forEach(f => {
                // logConsole('Filtro: ', f.field, f.value, element[f.field]);
                if (element[f.field] !== null && element[f.field].toUpperCase().indexOf(f.value.toUpperCase()) > -1) {
                  // logConsole('---->Trovato: ', f.field, f.value, element[f.field]);
                  q++;
                }
              });
              // logConsole('Filtro 1: ', filtri, q, filtri.length);
              if (q === filtri.length) {
                // logConsole('Filtro 2: ', filtri, q, filtri.length);
                ok = true;
              }
            } else {
              ok = true;
            }
          }
        }
        if (ok) {
          n.push(element.ROW_ID);
          r.push(element);
        }
      });
    }
    // logConsole('FILTRO SU RIGHE (' + gridData.data.length + '):', n);
  
    // Mail 14/04/2026 14:24 -> Cambio gestione per selezione totale. Deve AGGIUNGERE tutte le righe filtrate, non solo quelle visibili
    n.forEach(element => {
      this.mySelection.push(element);
    });
    // this.mySelection = n;
    // Mail 14/04/2026 14:24 -> Cambio gestione per selezione totale. Deve AGgIUNGERE tutte le righe filtrate, non solo quelle visibili
  
    this.appoggioSelezione = JSON.parse(JSON.stringify(this.mySelection));
    this.toConfirm = true;
    this.selectedAllRows.emit(r);
  }

  /* chiudiWarning() {
    this.warningVisualizzato = false;
    if (this.timerWarning) {
      clearInterval(this.timerWarning);
      this.timerWarning = undefined;
    }
  } */

  includeKey() {
    // this.stampaTempi('Confirm key');
    let righeSelezionate: string = '[';
    // this.scriveLog('Righe: ', this.mySelection);
    // this.scriveLog('Righe: ', this.gridData);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (+element2.ROW_ID === +element) {
            const riga = JSON.stringify(element2);
            righeSelezionate += riga + ', ';
          }
        });
      }
    });
    righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
    righeSelezionate += ']';
    // this.scriveLog(JSON.parse(righeSelezionate));

    if (righeSelezionate.length > 5) {
      this.includeClick.emit(JSON.parse(righeSelezionate));
    }
    // this.stampaTempi('Fatto Confirm key');
  }

  excludeKey() {
    // this.stampaTempi('Confirm key');
    let righeSelezionate: string = '[';
    // this.scriveLog('Righe: ', this.mySelection);
    // this.scriveLog('Righe: ', this.gridData);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (+element2.ROW_ID === +element) {
            const riga = JSON.stringify(element2);
            righeSelezionate += riga + ', ';
          }
        });
      }
    });
    righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
    righeSelezionate += ']';
    // this.scriveLog(JSON.parse(righeSelezionate));

    if (righeSelezionate.length > 5) {
      this.excludeClick.emit(JSON.parse(righeSelezionate));
    }
    // this.stampaTempi('Fatto Confirm key');
  }

  tornaDimensioneRiga(column, dataItem) {
    if (this.limitaRighe) {
      if (!this.limitaRighe.allineamentiVari) {
        return '';
      }
    }

    if (!column || !dataItem) {
      return;
    }

    let dime = 0;
    if (column.icon && column.icon != 'ICON_TRACE' && dataItem[column.field]) {
      if (column.showIconText && (column.showIconText === 'false' || column.showIconText === false)) {
        dime = 30;
      } else {
        dime += 30;
      }
    }
    if (column.combo && dataItem && dataItem[column.field]) {
      dime += 40;
    }
    if (dime === 0) {
      return '100%';
    } else {
      return 'calc(100% - ' + dime + 'px)';
    }
  }

  tornaMargineRiga(column, dataItem) {
    if (this.limitaRighe) {
      if (!this.limitaRighe.allineamentiVari) {
        return '';
      }
    }

    if (!column || !dataItem) {
      return;
    }

    let dime = 0;
    if (column.icon && column.icon != 'ICON_TRACE' && dataItem[column.field]) {
      if (column.icon.indexOf('flags') > -1) {
        dime += 20;
      } else {
        dime += 10;
      }
    }
    if (column.iconName && column.iconName != 'ICON_TRACE' && dataItem[column.field]) {
      if (column.iconName.indexOf('flags') > -1) {
        dime += 20;
      } else {
        dime += 10;
      }
    }
    if (column.combo && dataItem[column.field]) {
      dime += 37;
    }
    if (dime === 0) {
      return '0px';
    } else {
      return dime + 'px';
    }
  }

  clickSuCombo(e, misura) {
    if (e.type !== 'change') {
      return;
    }

    this.scriveLog('GRIGLIA: Click su combo misura', e, e.target.value, misura);

    let rigaSelezionata;
    const qualeValore = +e.srcElement.value;
    if (e.target.value === 0 || e.target.value === '0') {
      misura = '';
    } else {
      this.gridData.forEach(element => {
        if (element.DISPLAY_NAME === misura) {
          rigaSelezionata = element;
        }
        if (qualeValore === +element.combo_value) {
          element.combo_value = -1;
        }
      });
      rigaSelezionata.combo_value = qualeValore;
    }

    this.scriveLog('GRIGLIA: Riga selezionata', rigaSelezionata, this.gridData);

    const salv = new Array();
    this.gridData.forEach(element => {
      if (element.combo_value > 0) {
        const r = { MEASR_CODE: element.MEASR_CODE, VALORE: +element.combo_value, DISPLAY_NAME: element.DISPLAY_NAME };
        salv.push(r)
      }
    });

    const ritorno = { Selezionato: qualeValore, Precedente: qualeValore, Misura: misura, DataPerAggiornamento: new Date().toString(), Tutte: salv };

    this.scriveLog('GRIGLIA: Misure da salvare e ritorno', salv, ritorno);

    // const tm = setTimeout(() => {
      this.clickSuComboMisura.emit(ritorno);
      localStorage.setItem(this.userName + '_' + this.maskName + '_SelectedPointInfoV2', JSON.stringify(salv));
    // }, 500);
  }

  valoreWidth = 10;
  valoreFalse: boolean = false;

  controllaSelezionato(c, cosa) {
    if (c.VALUE_STR === cosa) {
      return true;
    } else {
      return false;
    }
  }

  /* ordinaValoriCombo() {
    if (!this.campoComboPresente) {
      return;
    }

    // const tm = setTimeout(() => {
      if (!this.GridGenInterna || !this.GridGenInterna.data || !this.GridGenInterna.data['data']) {
        // if (this.debugTasto === true)  {
          this.scriveLog('Griglia ' + this.maskName + '. OrdinaValoriCombo: Non ci sono i valori: ', this.gridData);
        // }
        return;
      }
      this.numeroSelezionato = new Array();
      this.comboVisibile = new Array();
      let numero = 1;

      // Controllo se la griglia è raggruppata
      let dati;
      if (this.raggruppabile === false) {
        // if (this.debugTasto === true)  {
          this.scriveLog('Griglia ' + this.maskName + '. OrdinaValoriCombo: Griglia non raggruppata');
        // }
        dati = this.GridGenInterna.data['data'];
      } else {
        // if (this.debugTasto === true)  {
          this.scriveLog('Griglia ' + this.maskName + '. OrdinaValoriCombo: Griglia raggruppata', this.GridGenInterna);
        // }
        dati = new Array();
        this.GridGenInterna.data['data'].forEach(element => {
          if (element && element.items) {
            element.items.forEach(element2 => {
              dati.push(element2);
            });
          }
        });
      }
      // if (this.debugTasto === true)  {
        this.scriveLog('Griglia ' + this.maskName + '. OrdinaValoriCombo: ', dati);
        this.scriveLog('Griglia ' + this.maskName + '. OrdinaValoriCombo: ', this.vecchieSelezioni);
        this.scriveLog('Griglia ' + this.maskName + '. OrdinaValoriCombo: ', this.numeroSelezionato);
      // }

      this.vecchieSelezioni.forEach(element => {
        // this.scriveLog('Cerco ' + element['misura']);
        let riga = 0;
        let ok = false;
        dati.forEach(element2 => {
          if (!ok) {
            if (element2 && element['misura'] && element2.DISPLAY_NAME === element['misura']) {
              // if (this.debugTasto === true)  {
                this.scriveLog('Griglia ' + this.maskName + '. OrdinaValoriCombo: Trovato Valore in griglia ', riga, element2.DISPLAY_NAME);
              // }
              element['numeroRiga'] = riga;
              this.numeroSelezionato[element['numeroRiga']] = numero;
              ok = true;
            } else {
              riga++;
            }
          }
        });
        numero++;
      });
      this.GridGenInterna.data['data'].forEach(element2 => {
        this.comboVisibile.push(true);
      });
      // if (this.debugTasto === true)  {
        this.scriveLog('Griglia ' + this.maskName + '. OrdinaValoriCombo: ', this.vecchieSelezioni);
        this.scriveLog('Griglia ' + this.maskName + '. OrdinaValoriCombo: ', this.numeroSelezionato);
      // }
    // }, 500);
  } */

  scriveLog(Cosa, P1?, P2?, P3?, P4?, P5?) {
    if (this.debug2 === true) {
      if (P1 && P2 && P3 && P4 && P5) {
        console.log('GRIGLIA \'' + this.maskName + '\': ', Cosa, P1, P2, P3, P4, P5);
      } else {
        if (P1 && P2 && P3 && P4 && !P5) {
          console.log('GRIGLIA \'' + this.maskName + '\': ', Cosa, P1, P2, P3, P4);
        } else {
          if (P1 && P2 && P3 && !P4 && !P5) {
            console.log('GRIGLIA \'' + this.maskName + '\': ', Cosa, P1, P2, P3);
          } else {
            if (P1 && P2 && !P3 && !P4 && !P5) {
              console.log('GRIGLIA \'' + this.maskName + '\': ', Cosa, P1, P2);
            } else {
              if (P1 && !P2 && !P3 && !P4 && !P5) {
                console.log('GRIGLIA \'' + this.maskName + '\': ', Cosa, P1);
              } else {
                console.log('GRIGLIA \'' + this.maskName + '\'', Cosa);
              }
            }
          }
        }
      }
    }
  }

  // Tentativo di gestire l'ordinamento multiplo delle colonne tramite il tasto CTRL
  sonoDentro = false;
  premutoCtrl = false;
  timerCtrl;
  attuale;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: any) : void {};

  mouseOver(e) {
    // logConsole('Mouse over');
    this.sonoDentro = true;
  }

  mouseOut(e) {
    // logConsole('Mouse out');
    this.sonoDentro = false;
    // this.premutoCtrl = false;
  }

  apreChiudeFiltroEventi() {
    this.aperturaFiltroEventi.emit(new Date().toString())
  }

  tcRunInfoKey() {
    this.aperturaTcRunInfo.emit(new Date().toString());
  }

  fPauseAutorun(c) {
    this.pausaGrigliaAttiva = c;
    this.pausaGrigliaDaAutoRunEmit.emit(c);
  }

  filtroCombo = false;
  tastoFiltroCombo = false;
  righePerFiltroCombo = new Array();

  visualizzaRiga(column, dataItem) {
    if (this.filtroCombo) {
      if (dataItem['combo_value'] > 0) {
        if (!this.tastoFiltroCombo) {
          this.tastoFiltroCombo = true;
        }
        // logConsole('Disegno', dataItem.ROW_ID, dataItem.combo_value);
        return true;
      } else {
        // logConsole('NON Disegno', dataItem.ROW_ID, dataItem.combo_value);
        return false;
      }
    } else {
      if (dataItem['combo_value'] > 0) {
        if (!this.tastoFiltroCombo) {
          this.tastoFiltroCombo = true;
        }
      }
      
      if (!column.combo) {
        return true;
      } else {
        if  (column.combo && dataItem && dataItem[column.field]) {
          return true;
        } else {
          return false;
        }
      }
    }
  }

  // divToolTip;
  // divHeader;
  posXDivToolTip;
  posYDivToolTip;
  messaggioToolTip;

  overGrid(e) {
    // return;

    if (this.maskName) {
      const element = e.target as HTMLElement;
      if (element.nodeName === 'SPAN' && element.className === "k-link") {
        const nome = e.srcElement.innerText;
        let quale = -1;
        let c = 0;
        let ok = false;
        this.columns.forEach(element => {
          if (!ok && element.title === nome) {
            ok = true;
            quale = c;
          }
          c++;
        });

        const divToolTip = document.getElementById('divToolTip_' + this.maskName);
        const tooltip = this.columns[quale].description;

        // logConsole(e, 'divToolTip_' + this.maskName, divToolTip, tooltip);

        if (tooltip) {
          const divHeader = document.getElementById('gridGenNormale_' + this.maskName);

          const coordinate = divHeader.getBoundingClientRect();
          // logConsole(coordinate);
          this.posXDivToolTip = e.x - coordinate.left;
          this.posYDivToolTip = e.y - coordinate.top - 30;
          // logConsole(e, 'divToolTip_' + this.maskName, this.divToolTip, this.posXDivToolTip, this.posYDivToolTip);
          this.messaggioToolTip = tooltip;
          divToolTip.style.display = 'inline-block';
          // logConsole('Tooltip', e, quale, nome, this.columns, element.nodeName);
        } else {
          this.messaggioToolTip = "";
          divToolTip.style.display='none';
        }
      }
    }
  }

  leaveGrid() {
    return;
    
    if (this.maskName) {
      const divToolTip = document.getElementById('divToolTip_' + this.maskName);
      divToolTip.style.display='none';
    }
  }

  aprePageSelector() {
    this.pageSelectorEmit.emit(new Date().toString());
  }

  apreEmptyPage() {
    this.pageEmit.emit(new Date().toString());
  }

  fScrollAllaRiga(riga) {
    let request: ScrollRequest = { row: riga };

    this.impostaGridGenInterna('fScrollAllaRiga');

    this.GridGenInterna.scrollTo(request);
  }

  impostaMisureCombo(m) {
    /* let m2 = undefined;
    if (m) {
      m2 = JSON.parse(JSON.stringify(m));
      m2.push({
        DISPLAY_NAME: "Automatic Return",
        MEASR_CODE: "AutomaticReturn",
        VALORE: -1
      });
    } */
    // logConsole('Imposta misure: ', m2);

    // this.clickSuComboMisura.emit(m2);
    localStorage.setItem(this.userName + '_' + this.maskName + '_SelectedPointInfoV2', JSON.stringify(m));
    this.prendeValoriCombo(this.data.DataTable, 'impostaMisureCombo');
  }

  refreshTcRun() {
    this.tcRun2RefreshAttivo = false;
    this.refreshTcRunEmit.emit(new Date().toString());
  }

  fCopiaRighe() {
    this.impostaGridGenInterna('fCopiaRighe');

    const d = JSON.stringify(this.GridGenInterna.data);
    let gridData = JSON.parse(d);
    logConsole('Selezione per act set', gridData);
    const rit = new Array();
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.data.forEach(element2 => {
          if (element === element2.ROW_ID) {
            rit.push(element2);
          }        
        });
      }
    });
    this.tastoPaste = true;

    localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_COPIED_ROWS', JSON.stringify(rit));

    /* Swal.fire({
      title: 'Confirm',
      text: 'Rows copied',
      icon: 'info',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    }); */
  }

  fIncollaRighe() {
    const righe = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_COPIED_ROWS');
    if (righe != null) {
      this.pasteEmit.emit(JSON.parse(righe));
    } else {
      Swal.fire({
        title: 'Confirm',
        text: 'No Rows copied',
        icon: 'warning',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      });  
    }
  }

  toolTipColonna;
  tootlTipTimeOut;

  showTooltip(e: MouseEvent): void {
    const element = e.target as HTMLElement;

    if (element.nodeName === "SPAN")  { // } || element.className === "k-column-title") {
      const titolo = element.innerText;
      // logConsole(this.columns);
      let toolTipColonna = '';
      this.columns.forEach(element => {
        if (element.title === titolo) {
          toolTipColonna = element.description.trim();
        }
      });
      if (toolTipColonna && toolTipColonna !== null) {
        if (toolTipColonna) {
          this.toolTipColonna = toolTipColonna;
          this.tooltipDir.toggle(element);

          if (this.tootlTipTimeOut) {
            clearTimeout(this.tootlTipTimeOut);
          }
          this.tootlTipTimeOut = setTimeout(() => {
            clearTimeout(this.tootlTipTimeOut);
            this.tootlTipTimeOut = undefined;
            
            this.nascondiToolTip();
          }, 6000);
        }
      }
    } else {
      this.nascondiToolTip();
    }
  }

  nascondiToolTip() {
    if (this.tootlTipTimeOut) {
      clearTimeout(this.tootlTipTimeOut);

      this.tootlTipTimeOut = undefined;
    }
    if (this.tooltipDir) {
      this.tooltipDir.hide();
    }
  }

  getTcRunFiles() {
    // this.stampaTempi('Delete key');
    let righeSelezionate: string = '[';

    this.scriveLog('Get tc run files: Dati selezionati ', this.mySelection, this.mySelection.length);
    this.scriveLog('Get tc run files: Dati griglia ', this.gridData);

    let gridData = this.gridData;
    if (this.paginazione === 'virtual') {
      gridData = this.gridData.data;
    }
    this.mySelection.forEach(element => {
      if (gridData !== undefined) {
        gridData.forEach(element2 => {
          if (+element2.ROW_ID === +element) {
            const riga = JSON.stringify(element2);
            const campi = riga.split(',');
            let q = 0;
            campi.forEach(element3 => {
              if (q === 1 || q === 2 || q === 3) {
                if (element3.indexOf(':') > - 1)  {
                  let valore = element3.substring(element3.indexOf(':') + 1, element3.length);
                  valore = valore.replace('"', '');
                  valore = valore.replace('"', '');
                  if (valore.indexOf('***')  > -1) {
                    const inizio = valore.indexOf('***');
                    // if (this.debugTasto === true) {
                      this.scriveLog('Griglia ' + this.maskName + '. Inizio 1', valore, inizio);
                    // }
                    if (inizio === 0) {
                      // ***background-color: #42d4f4,color: #FFFFFF***20220131_094327_SDTU100262.01
                      valore = valore.substring(inizio + 3, valore.length);
                      const fine = valore.indexOf('***');
                      valore = valore.substring(fine + 3, valore.length).trim();
                    } else {
                      // 20220131_094327_SDTU100262.01***background-color: #42d4f4,color: #FFFFFF***
                      valore = valore.substring(0, inizio).trim();
                    }
                    if (!valore || valore === null || valore.substring(0, 1) === '#' || valore.toUpperCase().trim() === 'UNDEFINED' || valore.toUpperCase().trim() === 'NULL') {
                      valore = '';
                    }
                    // if (this.debugTasto === true) {
                      this.scriveLog('Griglia ' + this.maskName + '. Fine', valore);
                    // }
                  }
                } else {
                  let valore = element3;
                  valore = valore.replace('"', '');
                  valore = valore.replace('"', '');
                  if (valore.indexOf('***')  > -1) {
                    const inizio = valore.indexOf('***');
                    // if (this.debugTasto === true) {
                      this.scriveLog('Griglia ' + this.maskName + '. Inizio 2', valore, inizio);
                    // }
                    if (inizio === 0) {
                      // ***background-color: #42d4f4,color: #FFFFFF***20220131_094327_SDTU100262.01
                      valore = valore.substring(inizio + 3, valore.length);
                      const fine = valore.indexOf('***');
                      valore = valore.substring(fine + 3, valore.length).trim();
                    } else {
                      // 20220131_094327_SDTU100262.01***background-color: #42d4f4,color: #FFFFFF***
                      valore = valore.substring(0, inizio).trim();
                    }
                    if (!valore || valore === null || valore.substring(0, 1) === '#' || valore.toUpperCase().trim() === 'UNDEFINED' || valore.toUpperCase().trim() === 'NULL') {
                      valore = '';
                    }
                    // if (this.debugTasto === true) {
                      this.scriveLog('Griglia ' + this.maskName + '. Fine', valore);
                    // }
                  }
                }
              }
              q++;
            });

            const riga2 = JSON.stringify(element2);
            righeSelezionate += riga2 + ', ';
          }
        });
      }
    });
    if (righeSelezionate.length > 3) {
      righeSelezionate = righeSelezionate.substring(0, righeSelezionate.length - 2);
      righeSelezionate += ']';
      this.debug2 && this.scriveLog('Get tc run files: Righe selezionate finali: ', JSON.parse(righeSelezionate));

      this.righeDaEliminare = righeSelezionate;
      this.getTcRunFilesKeyTcRunPressed.emit(JSON.parse(this.righeDaEliminare));
    } else {
      Swal.fire({
        title: 'Confirm',
        text: 'Check one or more TcRun you want to get, then push this button',
        icon: 'question',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      });
    }
  }
  
  creaQueryAI() {
    this.ritornoQueryAI.emit(new Date().toString());
  }

  fattoClickSuIcona(e) {
    if (!e) {
      return;
    }

    // logConsole('click su icona: ', e);

    switch (e.id) {
      case 1: this.refreshTcRun(); break;
      case 2: this.aprePageSelector(); break;
      case 3: this.apreEmptyPage(); break;
      case 4: this.apreChiudeFiltroEventi(); break;
      case 5: this.apreChiudeFiltroEventi(); break;
      case 6: this.debug2 = true; break;
      case 7: this.debug2 = false; break;
      case 8: this.setFilter(); break;
      case 9: this.clearFilter(); break;
      case 10: this.runKey(); break;
      case 11: this.setFilter(); break;
      case 12: 
        /* this.GridNormale.autoFitColumn(this.groupColumn); 
        this.getWidth(); 
        this.saveGrid(); */
        this.autoFitColumns(true, 'Tasto');
        break;
      case 13: this.setDelta(); break;
      case 14: this.fBackToSelected(); break;
      case 15: this.copyKey(); break;
      case 16: this.deleteKey(); break;
      case 17: this.editKey(); break;
      case 18: this.fDownloadTD(); break;
      case 19: this.fDownloadTcRun(); break;
      case 20: this.fPauseAutorun(true); break;
      case 21: this.fPauseAutorun(false); break;
      case 22: this.deselectAllRows(); break;
      case 23: this.selectAllRowsByKey(); break;
      case 24: this.processKey(); break;
      case 25: this.includeKey(); break;
      case 26: this.excludeKey(); break;
      case 27: this.fAddToActSet(); break;
      case 28: this.refreshGridKey(); break;
      case 29: this.showInfos(); break;
      case 30: this.showColumnHider(); break;
      case 31: this.showColumnHider(); break;
      case 32: this.tcRunInfoKey(); break;
      // case 33: this.excelData(); break;
      case 34: this.premutoExcelEventi(); break;
      case 35: this.resetGridLayout(); break;
      case 36: this.resetGridLayout(); break;
      case 37: this.rePlayKey(); break;
      case 38: this.confirmKey(); break;
      case 39: this.newKey(); break;
      case 40: this.fCopiaRighe(); break;
      case 41: this.fIncollaRighe(); break;
      case 42: this.deleteKeyTcRun(); break;
      case 43: this.getTcRunFiles(); break;
      case 44: this.deleteKey2(); break;
      case 45: this.addKey(); break;
      case 46: this.removeKey(); break;
      case 47: this.editKeyN(); break;
      case 48: this.editTicket(); break;
      case 49: this.creaQueryAI(); break;
      case 50: this.keyWorkSpacePress(e.valore); break;
      case 51: this.synchronise(); break;
      case 52: this.apreGestioneTicket(); break;
      case 53: this.editGridOnOff(); break;
      case 54: this.editGridOnOff(); break;
      case 55: this.saveGridValues(); break;
      case 56: this.cancelGridValues(); break;
      case 57: this.filtroCombo = true; break;
      case 58: this.filtroCombo = false; break;
      case 59: this.moveToPointEmit.emit(new Date().toString()); break;
      case 60: 
        let datiCSV = this.converteInCSV(this.data);
        // logConsole('Dati', datiCSV.length);
        const ritorno = {
          CSV: datiCSV,
          DATI: this.data.ColumnProperty
        }
        // logConsole('Dati per ai', ritorno.CSV.split('\n'), ritorno.CSV.length);
        this.emitAITutte.emit(ritorno); 
        break;
      case 61: this.clickSuMistralFilter.emit(new Date().toString()); break;
      case 62: this.spreadSheetEmit.emit(new Date().toString()); break;
      case 63: this.collapseAll(); break;
      case 64: this.expandAll(); break;
      case 65: this.fOpenAdvancedFilter(); break;

      case 98: this.exportCSV(); break;
      case 99: this.exportExcel(); break;
    }
  }
  
  converteInCSV(dati) {
    const state = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_gridSettings');
    if (state && state !== null) {
      this.gridSettings.gridData = process(this.gridData, JSON.parse(state));
    }

    let datiFiltrati;
    if (!this.gridSettings.gridData) {
      datiFiltrati = dati.DataTable;
    } else {
      datiFiltrati = this.gridSettings.gridData.data;
    }

    // logConsole('Dati da inserire in ai', datiFiltrati);

    const colonne = new Array();
    let colonne2 = '';
    dati.ColumnProperty.forEach(element => {
      colonne.push(element.key);
      colonne2 += element.headerText + ';';
    });

    // logConsole('Colonne', colonne);

    const righe = new Array();
    datiFiltrati.forEach(element => {
      let riga = '';
      colonne.forEach(element2 => {
        if (element[element2] && element[element2] !== null && element[element2] !== 'null' && element[element2] !== undefined && element[element2] !== 'undefined') {
          riga += element[element2] + ';';
        } else {
          riga += ';';
        }
      });
      righe.push(riga);
    });

    // logConsole('Righe', righe);
    let ritorno = colonne2 + '\n';
    righe.forEach(element => {
      ritorno += element + '\n';
    });
    // logConsole('Ritorno', ritorno);

    return ritorno;
  }

  sistemaDatiGrigliaPerDebug(datiGriglia, daDove) {
    if (datiGriglia === undefined) {
      return undefined;
    }

    const numeroRighe = this.limitaRighe.numeroRighe;
    const numeroCampi = this.limitaRighe.numeroCampi;
    // logConsole('Limita dati',datiGriglia, daDove);

    let colonneFinali = new Array();
    let righeFinali = new Array();

    const colonne = datiGriglia.ColumnProperty;
    const righe = datiGriglia.DataTable;
    const gridFinale = datiGriglia.GridProperty;

    if (numeroCampi > -1) {
      let trovati = 0;
      colonne.forEach(element => {
        if (trovati <= numeroCampi && (element.hide === 'false' || element.key === "ROW_ID")) {
          if (element.key !== "ROW_ID") {
            trovati++;
          }
        } else {
          element.hide = 'true';
        }

        colonneFinali.push(element);
      });

      righe.forEach(element => {
        const riga = {};
        colonneFinali.forEach(element2 => {
          const chiave = element2.key;
          const valore = element[chiave];
          riga[chiave] = valore;
          if (element2.IconName) {
            const chiave = element2.IconName;
            const valore = element[chiave];
            riga[chiave] = valore;
          }
        });
        righeFinali.push(riga);
      });
    } else {
      colonneFinali = colonne;
      righeFinali = righe;
    }

    if (numeroRighe > -1) {
      gridFinale[0].ItemsPerPage = numeroRighe;
      gridFinale[0].pageable = "true";
    }

    const ritorno = {
      ColumnProperty: colonneFinali,
      DataTable: righeFinali,
      GridProperty: gridFinale
    }

    // logConsole('Ritorno griglia ottimizzato ', ritorno);
    
    return ritorno;
  }

  risorta() {
    const sort = localStorage.getItem(this.returnUserName() + '_grid_' + this.maskName + '_sort');
    // alert('ppp')
    if (sort !== null) {
      this.sort = JSON.parse(sort);
    }
  }

  isTextTruncated(cell: HTMLElement): boolean {
    if (!cell) return false;

    return cell.scrollWidth > cell.clientWidth;
  }

  onGroupClick(field: string, value: any, event: MouseEvent) {
    event.stopPropagation(); // evita conflitti con expand/collapse
    
    // logConsole('Gruppo cliccato:', field, value);
    this.groupClickEmit.emit(value.toString());
  }

  fCollassaTutto() {
    return;

    this.elaborazioneInCorso = true;

    this.impostaGridGenInterna('collassaTutto');

    const t = setTimeout(() => {
      clearTimeout(t);

      const rows = Array.isArray(this.GridNormale.data)
        ? this.GridNormale.data
        : this.GridNormale.data.data || [];

      requestAnimationFrame(() => {
        this.ngZone.runOutsideAngular(() => {
          const grid = this.GridNormale;

          // HOT PATH: collapse
          for (let i = rows.length; i--;) {
            grid.collapseGroup(String(i));
          }

          this.ngZone.run(() => {
            /* if (this.appoggioRighePerCollassamento > -1) {
              this.take = this.appoggioRighePerCollassamento;
              this.gridSettings.state.take = this.appoggioRighePerCollassamento;
            } */

            this.elaborazioneInCorso = false;

            this.cdRef.markForCheck();
          });
        });
      });

    }, 200)
  }

  fEspandiTutto() {
    this.elaborazioneInCorso = true;
    this.impostaGridGenInterna('espandiTutto');

    const t = setTimeout(() => {
      clearTimeout(t);

      // logConsole('Espansione gruppi', this.GridNormale.data);
      const rows = Array.isArray(this.GridNormale.data)
        ? this.GridNormale.data
        : (this.GridNormale.data as any).data || [];
      rows.forEach((gr, idx) => this.GridNormale.expandGroup(idx.toString()));

      this.elaborazioneInCorso = false;
      this.cdRef.detectChanges();
    }, 100);
  }

  /* public expandBy = (group: any) => {
    return {
      field: group.field,
      value: group.value,
      parentGroupKeys: group.parentGroupKeys ?? []
    };
  }; */
  
  isNumeric(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
  }

  // GESTIONE COLLASSA / ESPANDI TUTTO in caso di raggruppamento
  public expandedGroups = new Set<string>();
  public expandAllGroups = false;
  public gruppiAperti = false;

  public isGroupExpanded = (args: any): boolean => {
    if (this.expandAllGroups) {
        return true;
    }

    return this.expandedGroups.has(args.groupIndex);
  };

  public expandAll(): void {
    this.gruppiAperti = true;
    this.expandAllGroups = true;
    this.expandedGroups.clear();
  }

  public collapseAll(): void {
    this.gruppiAperti = false;
    this.expandAllGroups = false;
    this.expandedGroups.clear();
  }

  public groupExpand(args: any): void {
    if (!this.expandAllGroups) {
        this.expandedGroups.add(args.groupIndex);
    }
  }

  public groupCollapse(args: any): void {
    if (this.expandAllGroups) {
        // l'utente ha collassato un gruppo mentre tutto era espanso
        this.expandAllGroups = false;
    }

    this.expandedGroups.delete(args.groupIndex);
  }

  openAdvancedFilter = false;
  filterValue: CompositeFilterDescriptor = { logic: "and", filters: [] };
  filters: FilterExpression[] = []

  fOpenAdvancedFilter() {
    if (this.openAdvancedFilter === true) {
      this.openAdvancedFilter = false;
    } else {
      const filt: FilterExpression[] = new Array();

      this.data.ColumnProperty.forEach(element => {
        if (element.hide !== 'true') {
          let tipo = element.dataType;
          if (tipo === 'numeric') { tipo = 'number'; }

          const f: FilterExpression =     {
            field: element.key,
            title: element.headerText,
            editor: tipo,
          }
          filt.push(f);
        }
      });
      this.filters = JSON.parse(JSON.stringify(filt));

      logConsole('Colonne:', this.data.ColumnProperty, this.filters);
      // return;

      this.openAdvancedFilter = true;
    }

    this.gestisceSplit();
  }

  @ViewChild('filterAvanzato')
  filterAvanzato!: FilterComponent;

  applyFilter() {
    const e: CompositeFilterDescriptor = this.filterAvanzato.value;
    logConsole('Filtro: ', e, this.filters, this.filterValue);
    if (!this.gridSettings.state.filter) {
      this.gridSettings.state.filter = e;
    } else {
      this.gridSettings.state.filter.filters = e.filters;
    }

    if (e && e.filters && e.filters.length > 0) {
      localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered', 'S');
      this.gridSettings.filtered = true;
      this.rowButtonsConfig2.showFilter = true;
      this.showSettedFilter = true;
      logConsole('Filtro attivo', e.filters);
    } else {
      localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_filtered', 'N');
      this.gridSettings.filtered = false;
      this.rowButtonsConfig2.showFilter = false;
      this.showSettedFilter = false;
      logConsole('Filtro NON attivo', e.filters);
    }

    this.filter = JSON.parse(JSON.stringify(this.gridSettings.state.filter));
    
    localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_gridSettings', JSON.stringify(this.gridSettings.state));
  }

  closeFilter() {
    this.openAdvancedFilter = false;
  }
}

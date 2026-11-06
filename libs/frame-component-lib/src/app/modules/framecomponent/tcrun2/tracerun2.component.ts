import { logConsole } from '../console-log';
// import { FileSaverService } from 'ngx-filesaver';
import { DatePipe } from '@angular/common';
import { Component, SimpleChanges, OnInit, AfterViewInit, OnChanges, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// import { TCRunInfoComponent } from '../elaborations/traceinfo.component';
import ExternalUtilities from '../ExternalUtilities.component';
import { ExternalApiService } from '../services/externalapi.service';
import { environment } from '../../../../environments/environment';
import { LogComponentInterno } from '../log.component';
// import Utils from '../Utilities.component';
import download from 'downloadjs';  // Importa downloadjs
// import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcrun2-component',
  templateUrl: 'tracerun2.component.html',
  styleUrls: ['./tracerun2.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // AGGIUNTO PER MEMORY LEAKES
  encapsulation: ViewEncapsulation.None
})

export class TraceRun2Component implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() Utils;
  @Input() sessionID;
  @Input() operatorID;
  @Input() groupName;
  @Input() userName;
  @Input() numeroFrame;
  @Input() listaWorkspaces;
  @Input() frameAttivo;
  @Input() righePerPaginazioneAutomatica = -1;
  @Input() indirizzoServer;
  @Input() urlRoot;
  @Input() frameName;
  @Input() modalitaRealTimeAttiva = false;
  @Input() dimensioniSplit;
  @Input() AgnOAct;
  @Input() listaCampi;
  @Input() frameVisibile;
  @Input() MappaOGraficoTutti;
  @Input() MappaOGrafico;
  @Input() dashboardAttiva;
  @Input() tmsMin;
  @Input() tmsMax;
  @Input() tmsSelezionato;
  @Input() timerSynch;
  @Input() Activity;
  @Input() tmsGlobaleMin;
  @Input() tmsGlobaleMax;
  @Input() timeFilter;
  @Input() geoFilter;
  @Input() comboSelArea;
  @Input() eseguitoInProgetto;
  @Input() misureAddizionaliTCRUN;
  @Input() act_set;
  @Input() impostazioniPivot;
  @Input() debug = false;
  @Input() resizeFrame;
  // @Input() pulisceDatiFrame;
  @Input() layout;
  @Input() debugEstremo = false;

  @Output() cambioDimensioni: EventEmitter<any> = new EventEmitter<any>();
  @Output() listaCampiEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() cambioTmsSelezionato: EventEmitter<any> = new EventEmitter<any>();
  @Output() cambioStartTms: EventEmitter<any> = new EventEmitter<any>();
  @Output() cambioEndTms: EventEmitter<any> = new EventEmitter<any>();
  @Output() impostaAGNoACT: EventEmitter<any> = new EventEmitter<any>();
  @Output() impostaCenterPosition: EventEmitter<any> = new EventEmitter<any>();
  @Output() passaggioListaEventiSE: EventEmitter<any> = new EventEmitter<any>();
  @Output() impostazioniPivotEmit: EventEmitter<any> = new EventEmitter<any>();
    
  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();  
  }

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  AgnOAct2;

  // maiCaricatoConfig = true;
  mostraPopup = false;
  chiSonoList = ''; //ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoAggr = ''; // ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // chiSonoField = ''; // ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // chiSonoFieldValue = ''; // ExternalUtilities.creaVettore(environment.quantiFrames, '');

  debugPivot = false;
  debugList = false;
  debugInfo = false;
  debugFile = false;
  // debugConfig = false;
  // debugConfigList = false;

  virtualization = true;
  refreshPivot;
  numeroFrame2;
  puliziaDati = '';
  expandAll = false;
  // listaCampiFiltrati;
  
  tipoDisplay = 'Both';

  nomeGrigliaList = [ 'gridListTcRun2_0', 'gridListTcRun2_1', 'gridListTcRun2_2', 'gridListTcRun2_3',
                      'gridListTcRun2_4', 'gridListTcRun2_5', 'gridListTcRun2_6', 'gridListTcRun2_7', 
                      'gridListTcRun2_8', 'gridListTcRun2_9' ];
  datiList;
  effettuaAutoFitList = false;
  caricamentoListInCorso = false;
  erroreList;
  impostaSelezioneList;
  vecchioDatiJsonList;
  righeSelezionateTcRun;
  datiLookUpStatus;
  datiLookUpPriority;
  datiOperatorGroup;
  TitoloMascheraModificaMT;
  operazioneTicket;
  rigaModificataTicket;
  vecchioValoreTicket;
  mascheraModificaTicket = false;
  // apertoInfoFile = true;
  colonneTcRun = '';
  ultimaVoltaDatiList = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  filtro;
  // tcRunRefreshAttivo = false;
  // ultimaChiamataList = '';

  /* nomeGrigliaAggr = [ 'gridAggrTcRun2_0', 'gridAggrTcRun2_1', 'gridAggrTcRun2_2', 'gridAggrTcRun2_3',
                      'gridAggrTcRun2_4', 'gridAggrTcRun2_5', 'gridAggrTcRun2_6', 'gridAggrTcRun2_7', 
                      'gridAggrTcRun2_8', 'gridAggrTcRun2_9' ];
  datiAggr;
  effettuaAutoFitAggr = false;
  caricamentoAggrInCorso = false;
  erroreAggr;
  impostaSelezioneAggr;
  vecchioDatiJsonAggr; */

  datiTcRunInfo;
  nomeGrigliaInfo = [ 'gridInfoTcRun2_0', 'gridInfoTcRun2_1', 'gridInfoTcRun2_2', 'gridInfoTcRun2_3',
    'gridInfoTcRun2_4', 'gridInfoTcRun2_5', 'gridInfoTcRun2_6', 'gridInfoTcRun2_7', 
    'gridInfoTcRun2_8', 'gridInfoTcRun2_9' ];  
  effettuaAutoFitInfo = false;
  selezionatoTII2;
  caricamentoInfoInCorso = false;
  erroreInfo;
  vecchioDatiJsonInfo;
  ultimaVoltaInfoFile = ExternalUtilities.creaVettore(10, '');  

  datiTcRunFile;
  nomeGrigliaFile = [ 'gridFileTcRun2_0', 'gridFileTcRun2_1', 'gridFileTcRun2_2', 'gridFileTcRun2_3',
    'gridFileTcRun2_4', 'gridFileTcRun2_5', 'gridFileTcRun2_6', 'gridFileTcRun2_7', 
    'gridFileTcRun2_8', 'gridFileTcRun2_9' ];
  effettuaAutoFitFile = false;
  selezionatoTIF2;
  caricamentoFileInCorso = false;
  erroreFile;
  vecchioDatiJsonFile;

  tcRunSelected = false;
  tcRunIdSelezionato;
  indiceTC;
  rigaSelezionataTcRun;

  /* nomeGrigliaConfig = [ 'gridConfigTcRun2_0', 'gridConfigTcRun2_1', 'gridConfigTcRun2_2', 'gridConfigTcRun2_3',
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
  listaCampiAttuale;
  
  nomeGrigliaConfigList = [ 'gridConfigListTcRun2_0', 'gridConfigListTcRun2_1', 'gridConfigListTcRun2_2', 'gridConfigListTcRun2_3',
                        'gridConfigListTcRun2_4', 'gridConfigListTcRun2_5', 'gridConfigListTcRun2_6', 'gridConfigListTcRun2_7', 
                        'gridConfigListTcRun2_8', 'gridConfigListTcRun2_9' ];
  datiConfigList;
  effettuaAutoFitConfigList = false;
  erroreConfigList;
  impostaSelezioneConfigList;
  vecchioDatiJsonConfigList;
  caricamentoConfigListInCorso = false;
  campoSelezionato; */
  // maiCaricatoList = true;
  
  TitoloPivot = '';
  impostazioniPivot2 = {
    columns: [],
    rows: [],
    formatSettings: [],
    values: [],
    expandAll: false,
    filters: [],
    filterSettings: [],
    fieldMapping: [],
    groupSettings: [],
    conditionalFormatSettings: [],
    excludeFields: []
  };
  cambioDimensioneContenitorePivot;

  lastCallList = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallAggr = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // lastCallConfig = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // lastCallConfigList = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallFileInfo = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallInfo = ExternalUtilities.creaVettore(environment.quantiFrames, '');

  dimensioni = {
    apertoInfoFile: true,
    dimensioneVerticaleSopra: 50,
    dimensioneVerticaleSotto: 50,
    dimensioneAggr: 30,
    dimensioneConfig: 40,
    dimensioneConfigList: 30,
    dimensioneList: 60,
    dimensioneInfo: 40,
  }

  listaCampiAttuale;
  layout2;

  constructor(
    // private fileSaver: FileSaverService,
    private apiService: ExternalApiService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private Log: LogComponentInterno
  ) {
  }

  ngOnInit(): void {
    this.setDebug();
  }

  checkEdge(event) {
    this.Utils.edge = event;
    // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'edge:', event);
  }

  ngAfterViewInit(): void {
  }

  pulisceAppoggiF() {
    this.datiList = undefined; // 'empty grid';
    // this.datiAggr = undefined; // 'empty grid';
    this.datiTcRunFile = undefined; // 'empty grid';
    this.datiTcRunInfo = undefined; // 'empty grid';
    // this.datiConfig = undefined; // 'empty grid';
    // this.datiConfigList = undefined; // 'empty grid';
  }

  ngOnChanges(changes): void {
    if (changes.pulisceAppoggi) {
      this.pulisceAppoggiF();
    }

    let ricarica = false;
    let aggiornaPivot = false;

    if (changes.layout && changes.layout.currentValue) {
      this.layout2 = changes.layout.currentValue;
      this.gestisceLayout();
    }

    if (changes.numeroFrame && changes.numeroFrame.currentValue) {
      this.numeroFrame2 = changes.numeroFrame.currentValue;
    }

    if (changes.frameAttivo && changes.frameAttivo.currentValue) {
      // Arrivato cambio frame attivo... Pulisco tutto
      this.pulisceDati();
    }

    if (changes.act_set && changes.act_set.currentValue) {
      // this.act_set2 = changes.act_set.currentValue;
      ricarica = true;
      aggiornaPivot = true;
      // logConsole('Pivot. Activity name: ', changes.act_set.currentValue);
    }

    if (changes.resizeFrame) {
      this.cambioDimensioneContenitorePivot = new Date().toString();
    }
    
    if (changes.AgnOAct && changes.AgnOAct.currentValue) {
      this.AgnOAct2 = changes.AgnOAct.currentValue;
      // // logConsole('Cambio AgnOAct', this.AgnOAct2);
      ricarica = true;
      aggiornaPivot = true;
      // logConsole('Pivot. AgnOAct: ', changes.AgnOAct.currentValue);
    }

    if (changes.sessionID && changes.sessionID.currentValue) {
      // this.sessionID = changes.sessionID.currentValue;
      ricarica = true;
    }

    if (changes.impostazioniPivot) {
      this.impostazioniPivot2 = changes.impostazioniPivot.currentValue;
      if (this.impostazioniPivot2 === undefined || this.impostazioniPivot2 === null) {
        // // logConsole('Impostazioni pivot pulite tcrun2', this.numeroFrame, this.impostazioniPivot2);
        this.impostazioniPivot2 = {
          columns: [],
          rows: [],
          formatSettings: [],
          values: [],
          expandAll: false,
          filters: [],
          filterSettings: [],
          fieldMapping: [],
          groupSettings: [],
          conditionalFormatSettings: [],
          excludeFields: []
        };
      // } else {
        // // logConsole('Impostazioni pivot arrivate tcrun2', this.numeroFrame, this.impostazioniPivot2);
      }
      // if (this.debugPivot) {
      // }
      aggiornaPivot = true;
    }
    /* if (changes.debug) {
      this.debug = changes.debug.currentValue;
    }

    if (changes.frameVisibile) {
      this.frameVisibile = changes.frameVisibile.currentValue;
    } */

    if (changes.dimensioniSplit && changes.dimensioniSplit.currentValue) {
      this.dimensioni = changes.dimensioniSplit.currentValue;
      // // logConsole('Nuove dimension tcrun', this.dimensioni);
    }

    if (changes.listaCampi && changes.listaCampi.currentValue) {
      // this.listaCampi2 = changes.listaCampi.currentValue;
      this.listaCampiAttuale = changes.listaCampi.currentValue;
      if (this.debugList) {
        // logConsole('Pivot. Lista campi passati TcRun2', this.listaCampiAttuale);
      }

      ricarica = true;
      aggiornaPivot = true;
    }

    if (changes.tmsMin && changes.tmsMin.currentValue) {
      ricarica = true;
      aggiornaPivot = true;
    }

    if (changes.tmsMax && changes.tmsMax.currentValue) {
      ricarica = true;
      aggiornaPivot = true;
    }

    if (changes.tmsGlobaleMin && changes.tmsGlobaleMin.currentValue) {
      // this.tmsGlobaleMin2 = changes.tmsGlobaleMin.currentValue;
      ricarica = true;
      aggiornaPivot = true;
      // logConsole('Pivot. tmsGlobaleMin', changes.tmsGlobaleMin.currentValue);
    }

    if (changes.tmsGlobaleMax && changes.tmsGlobaleMax.currentValue) {
      // this.tmsGlobaleMax2 = changes.tmsGlobaleMax.currentValue;
      ricarica = true;
      aggiornaPivot = true;
      // logConsole('Pivot. tmsGlobaleMin', changes.tmsGlobaleMax.currentValue);
    }

    if (changes.tmsSelezionato && changes.tmsSelezionato.currentValue) {
      ricarica = true;
      aggiornaPivot = true;
    }

    if (changes.dashboardAttiva && changes.dashboardAttiva.currentValue) {
      ricarica = true;
      aggiornaPivot = true;
    }

    if (changes.debug && changes.debug.currentValue !== undefined) {
      this.setDebug();
    }

    /* const chiamaFake = false;
    
    if (chiamaFake) {
      this.chiamataFake();
    } else { */
      if (ricarica) {
        this.prendeDatiList();

        this.datiTcRunInfo = 'empty grid';
        this.datiTcRunFile = 'empty grid';

        this.esegueCaricamentoInfoFile();
      }

      /* if (this.maiCaricatoConfig) {
        this.caricaConfig();
        this.datiConfigList = 'empty grid';  
      } */

      if (aggiornaPivot) {
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.refreshPivot = new Date().toString();
        }, 1000)
      }
    // }
  }

  aperturaInfoFile() {
    const primo = this.dimensioni.dimensioneAggr;
    const seconda = this.dimensioni.dimensioneList;
    const terza = this.dimensioni.dimensioneInfo;
    if (this.dimensioni.apertoInfoFile) {
      this.dimensioni.dimensioneList = seconda + terza;
      this.dimensioni.dimensioneInfo = 0;
    } else {
      this.dimensioni.dimensioneList = Math.round(seconda / 2);
      this.dimensioni.dimensioneInfo = (100 - primo - this.dimensioni.dimensioneList);
    }
    this.dimensioni.apertoInfoFile = !this.dimensioni.apertoInfoFile;

    this.cambioDimensioni.emit(this.dimensioni);
  }

  salvaDatiTicket() {
    const nomeFunzione = 'ticket__ins';

    let operator = this.rigaModificataTicket.TCK_OPERATOR_NAME_IN_CHARGE_TO;
    if (!operator || operator === null || operator === 'null') {
      operator = '';
    }

    let testo = this.rigaModificataTicket.TCK_DESCRIPTION;
    if (testo && testo !== null) {
      while (testo.indexOf('\n') > -1) {
        testo = testo.replace('\n', ' ');
      }
      while (testo.indexOf('"') > -1) {
        testo = testo.replace('"', ' ');
      }
    }

    const params = '{' +
        '"v_cntx": "' + this.sessionID + '",' +
        '"v_ticket_id": ' + this.rigaModificataTicket.TCK_ID + ',' +
        '"v_act_id": ' + this.rigaModificataTicket.ACT_ID + ',' +
        '"v_tms": "' + this.rigaModificataTicket.TMS + '",' +
        '"v_operator_name_in_charge_to": "' + operator + '",' +
        '"v_status": "' + this.rigaModificataTicket.TCK_STATUS + '",' +
        '"v_title": "' + this.rigaModificataTicket.TCK_TITLE + '",' +
        '"v_description": "' + testo + '",' +
        '"v_event_row_id_linked": null,' +
        '"v_dashboard_id": null,' +
        '"v_priority": "' + this.rigaModificataTicket.TCK_PRIORITY + '" ' + // +
      '}';
    // '"v_event_list": ' + this.rigaModificataTicket.TCK_EVENT_LIST + ' ';

    const params2 = JSON.parse(params);
    let eventi = JSON.stringify(this.rigaModificataTicket.TCK_EVENT_LIST);
    if (eventi) {
      while (eventi.indexOf('"') > -1) {
        eventi = eventi.replace('"', '*V*');
      }
    }
    params2["v_event_list"] = eventi ? eventi : null;
    this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Params', params2)

    this.apiService.chiamataPost(this.Utils, '' + nomeFunzione, params2)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        // this.caricaTicket();
        this.refreshList(false);
        this.mascheraModificaTicket = false;
      } else {
      }
    }, error => {
        console.error('POST ERROR ' + nomeFunzione + ': ', error, error.message);
        // ExternalUtilities.visualizzaAlert('Ticket operation:' + error);
    });

  }

  premutoTastoTicket(e) {
    if (!e) {
      return;
    }

    let rigaSelezionataPerTicket = e; // JSON.parse(e);

    this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Fatto click su riga per il ticket', e);

    this.caricaDatiEditTicket();
    this.TitoloMascheraModificaMT = 'Edit Ticket';
    this.operazioneTicket = 'MODIFICA';

    let ok = false;
    this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Fatto click su riga per il ticket', e, this.datiList.DataTable);
    this.datiList.DataTable.forEach(element => {
      if (!ok && +element.ROW_ID === +rigaSelezionataPerTicket) {
        rigaSelezionataPerTicket = element;
        ok = true;
      }
    });

    this.rigaModificataTicket = JSON.parse(JSON.stringify(rigaSelezionataPerTicket));
    this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Click su edit ticket prima', this.rigaModificataTicket);

    if (this.rigaModificataTicket.TCK_STATUS === null || this.rigaModificataTicket.TCK_STATUS === 'null') {
      this.rigaModificataTicket.TCK_STATUS = 'Open';
    }
    if (this.rigaModificataTicket.TCK_PRIORITY === null || this.rigaModificataTicket.TCK_PRIORITY === 'null') {
      this.rigaModificataTicket.TCK_PRIORITY = '3 Low';
    }
    this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Click su edit ticket dopo', this.rigaModificataTicket);
    this.vecchioValoreTicket = JSON.parse(JSON.stringify(this.rigaModificataTicket));

    this.mascheraModificaTicket = true;
  }

  caricaDatiEditTicket() {
    if (!this.datiLookUpStatus) {
      this.LeggeDatiLookUpStatus();
    }
    if (!this.datiLookUpPriority) {
      this.LeggeDatiLookUpPriority();
    }
    if (!this.datiOperatorGroup) {
      this.LeggeDatiOperator();
    }
  }

  LeggeDatiLookUpStatus() {
    // // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_category": "TicketStatus"' +
    '}';
    this.apiService.chiamataPost(this.Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiLookUpStatus = 'empty grid'; // null;
          ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
          // alert(data2.v_failure_reason);
        } else {
          this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Lookup status:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.datiLookUpStatus = data;
        }
      } else {
        this.datiLookUpStatus = 'empty grid'; // null;
      }
    }, error => {
      console.error('POST ERROR Lookup Grid: ', error, error.message);
      // ExternalUtilities.visualizzaAlert('Read look up status:' + error);
      
      // alert('Read look up status:' + error);
    });
  }

  LeggeDatiLookUpPriority() {
    // // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_category": "TicketPriority"' +
    '}';
    this.apiService.chiamataPost(this.Utils,  'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiLookUpPriority = 'empty grid'; // null;
          ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
          // alert(data2.v_failure_reason);
        } else {
          this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Lookup priority:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.datiLookUpPriority = data;
        }
      } else {
        this.datiLookUpPriority = 'empty grid'; // null;
      }
    }, error => {
        console.error('POST ERROR Lookup Grid: ', error, error.message);
        // ExternalUtilities.visualizzaAlert('Read look up priority:' + error);
    });
  }

  LeggeDatiOperator() {
    // // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_group_name": null' +
    '}';
    this.apiService.chiamataPost(this.Utils,  'operator__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiOperatorGroup = 'empty grid'; // null;
          ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
        } else {
          this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Operator:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.datiOperatorGroup = data;
        }
      } else {
        this.datiOperatorGroup = 'empty grid'; // null;
      }
    }, error => {
      // ExternalUtilities.visualizzaAlert('Read operator:' + error);
      console.error('POST ERROR Operator Grid: ', error, error.message);
    });
  }
  
  selectOperator(e) {
    if (e) {
      this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, e);
      this.rigaModificataTicket.TCK_OPERATOR_NAME_IN_CHARGE_TO = e.NAME;
    }
  }

  selectStatus(e) {
    if (e) {
      this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, e);
      this.rigaModificataTicket.TCK_STATUS = e.VALUE_STR;
    }
  }

  selectPriority(e) {
    if (e) {
      this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, e);
      this.rigaModificataTicket.TCK_PRIORITY = e.VALUE_STR;
    }
  }

  chiudeMascheraTicket() {
    if (JSON.stringify(this.vecchioValoreTicket) !== JSON.stringify(this.rigaModificataTicket)) {
      if (confirm('do you want to lose the changes made?')) {
        this.mascheraModificaTicket = false;
      }
    } else {
      this.mascheraModificaTicket = false;
    }
  }

  associaEventiTcRun() {
    // this.rigaSelezionataTcRun.TCK_EVENT_LIST = this.Utils.listaEventiSE;
    this.rigaModificataTicket.TCK_EVENT_LIST = this.Utils.listaEventiSE;

    ExternalUtilities.visualizzaInfo('Info', 'Events associated: ' + this.Utils.listaEventiSE.length, false);

    this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Eventi da associare: ', this.Utils.listaEventiSE);
    this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Ticket: ', this.rigaSelezionataTcRun);
  }

  visualizzaEventiTcRun() {
    // this.Utils.listaEventiSE = this.rigaSelezionataTcRun.TCK_EVENT_LIST;
    let eventi = this.rigaModificataTicket.TCK_EVENT_LIST;

    this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Eventi da visualizzare: ', eventi);

    if (eventi && eventi !== null) {
      while (eventi.indexOf('*V*') > -1) {
        eventi = eventi.replace('*V*', '"');
      }
      if (typeof(eventi) === 'string') {
        while (eventi.substring(0, 1) === '"' || eventi.substring(0, 1) === ' ') {
          eventi = eventi.substring(1, eventi.length);
        }
        while (eventi.substring(eventi.length - 1, eventi.length) === '"' || eventi.substring(eventi.length - 1, eventi.length) === ' ') {
          eventi = eventi.substring(0, eventi.length - 1);
        }
        // logConsole('Eventi da visualizzare 1: ', eventi, typeof(eventi));

        eventi = JSON.parse(eventi);
      }
      const tm = setTimeout(() => {
          clearTimeout(tm);
        // logConsole('Eventi da visualizzare 2: ', eventi);
        this.Utils.listaEventiSE = eventi;
        if (this.debug === true) {
          // logConsole('Eventi associati: ', this.Utils.listaEventiSE);
        }
      
        ExternalUtilities.visualizzaInfo('Info', 'Events showed: ' + this.Utils.listaEventiSE.length, false);
  
        this.passaggioListaEventiSE.emit(new Date().toString());
      }, 100);
    }
  }

  prendeJsonTicket(e) {
    let ritorno = 0;

    if (e && e.TCK_EVENT_LIST && e.TCK_EVENT_LIST !== null && e.TCK_EVENT_LIST !== '') {
      // const ee = JSON.parse(e.TCK_EVENT_LIST);
      if (typeof(e.TCK_EVENT_LIST) === 'object' && e.TCK_EVENT_LIST.length !== undefined) {
        // Object array
        ritorno = e.TCK_EVENT_LIST.length;
      } else {
        if (typeof(e.TCK_EVENT_LIST) === 'object' && e.TCK_EVENT_LIST.length === undefined) {
          // Object singolo
          ritorno = 1;
        } else {
          if (typeof(e.TCK_EVENT_LIST) === 'string' && e.TCK_EVENT_LIST !== '') {
            // Stringa
            let ee = e.TCK_EVENT_LIST;
            if (ee.indexOf('*V*') > -1) {
              while (ee.indexOf('*V*') > -1) {
                ee = ee.replace('*V*', '"');
              }
            }
            // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, ee.substr(1, 1));
            while (ee.substr(0, 1) === '"' || ee.substr(0,1) === ' ') {
              ee = ee.substr(1, ee.length);
            }
            while (ee.substr(ee.length - 1, ee.length) === '"' || ee.substr(ee.length - 1, ee.length) === ' ') {
              ee = ee.substr(0, ee.length - 1);
            }
            ee = ee.trim();
            // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, ee);
            try {
              ee = JSON.parse(ee);
              ritorno = ee.length;
            } catch (e1) {
              this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Error in JSON convert: ', ee);
              ritorno = 0;
            }
          } else {
            // Non Ã¨ ne stringa ne object
            this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, e.TCK_EVENT_LIST, typeof(e.TCK_EVENT_LIST));
          }
        }
      }
    }

    return ritorno;
  }

  premutoTastoDeleteTCrun(e) {
    this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, e);
    this.righeSelezionateTcRun = e;
    this.deleteTcRun(0);
  }

  deleteTcRun(q) {
    const params = '{' +
      '"v_cntx": "' + this.sessionID + '",' +
      '"v_tc_run_code": "' + this.righeSelezionateTcRun[q].TC_RUN_CODE + '"' +
    '}';

    this.apiService.chiamataPost(this.Utils, 'tc_run__del', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      if (data2) {
        if (+data2[0].v_err_code === 0) {
          q++;
          if (q < this.righeSelezionateTcRun.length) {
            this.deleteTcRun(q);
          } else {
            this.prendeDatiList();
          }
        } else {
          ExternalUtilities.visualizzaAlert(data2[0].v_failure_reason);
        }
      }
    }, error => {
      console.error('POST ERROR TC Run Del: ', error, error.message);
    });
  }

  refreshList(e) {
    // alert('refresh: ' + e);
    if (e) {
      this.datiList = undefined;
    }
    this.lastCallList[this.numeroFrame2] = '';

    // const listaTuttiICampi = this.act_set2 + ';' + this.tmsGlobaleMin2 + ';' + this.tmsGlobaleMax2 + ';' + 
    //   JSON.stringify(this.listaCampi2);

    // this.ultimaChiamataList = listaTuttiICampi;
    // this.tcRunRefreshAttivo = false;

    this.prendeDatiList();
  }

  prendeDatiList() {
    // // logConsole('Pivot. Prende dati list 1');

    if (this.layout2 === 1) {
      this.debugList && this.Log?.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'Redraw. Esco per impostazione solo pivot', this.numeroFrame2);

      return;
    }
    // return;

    // // logConsole('Pivot. Prende dati list 2');

    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaDatiList[this.numeroFrame2] < 1000) {
      this.debugList && this.Log?.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'Redraw. Esco per troppo veloce', this.numeroFrame2);
  
      return;
    }
    this.ultimaVoltaDatiList[this.numeroFrame2] = ora;

    // // logConsole('Pivot. Prende dati list 3');

    if (this.MappaOGrafico !== 'TP' || !this.frameVisibile) {
      this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'TC Run List: Esco 1 da prende dati tcrun', this.MappaOGrafico);
  
      return;
    }

    // // logConsole('Pivot. Prende dati list 4');

    if (!this.tmsGlobaleMin && !this.tmsGlobaleMax) {
      this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'TC Run List: esco per tms min/max vuoti', this.tmsGlobaleMin, this.tmsGlobaleMax);

      return
    }

    // // logConsole('Pivot. Prende dati list 5');

    let sInizio;
    let sFine;
    let nomeActSet = this.act_set;

    if (this.timeFilter === 2) {
      if (!this.tmsSelezionato || this.tmsSelezionato === null || this.tmsSelezionato === '') {
        // this.datiList = 'empty grid';
        this.debugList && this.Log?.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'Tc Run List: esco da tcrun grid per tms selezionato vuoto');
        return;
      }

      sInizio = this.tmsMin; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
      sFine = this.tmsMax ; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
    } else {
      if (this.eseguitoInProgetto === false) {
        if (this.timeFilter === 4) {
          this.debugList && this.Log?.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'Tc Run List: Time filter activity');

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
  
    // // logConsole('Pivot. Prende dati list 6', nomeActSet, this.act_set, this.timeFilter, sInizio, sFine);

    if (!nomeActSet) {
      this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'TC Run List: esco per actSet/AgnOAct vuoto', nomeActSet);

      return
    }

    // // logConsole('Pivot. Prende dati list 7');

    // DA IMPLEMENTARE SULLA QUERY
    let misureAddizionali = '';
    if (this.misureAddizionaliTCRUN) {
      this.misureAddizionaliTCRUN.forEach(element => {
        if (element) {
          misureAddizionali += element + ',';
        }
      });
    }
    if (misureAddizionali.length > 0) {
      misureAddizionali = misureAddizionali.substring(0, misureAddizionali.length - 1);
    }
    // DA IMPLEMENTARE SULLA QUERY

    // // logConsole('Pivot. Prende dati list 8');

    this.chiSonoList = 'F' + this.numeroFrame2 + ';P' + this.frameAttivo + ';' + new Date().toString();

    const geoFilter = ExternalUtilities.ritornaGeoFilter(this, this.geoFilter);

    const params = {
      cntx_id: this.sessionID,
      v_act_set_name_list: nomeActSet,
      v_bbox: geoFilter,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_cluster_set_name: null,
      v_field_list: this.listaCampi ? this.listaCampi : [],
      // v_additional_event_measure: misureAddizionali,
      v_filter_list: this.filtro ? this.filtro : null,
      v_caller_tag: null
    }

    const valoriDiBase2 = ';' + this.dashboardAttiva + ';' + this.frameAttivo + ';';
    const actualCall2 = 'TCRUNLIST;' + valoriDiBase2 + ';' + JSON.stringify(params);

    params.v_caller_tag = this.chiSonoList;

    // // logConsole('Pivot. Prende dati list 9');

    if (this.lastCallList[this.numeroFrame2] !== actualCall2) { // && this.vecchioDatiJsonList) {
      this.lastCallList[this.numeroFrame2] = actualCall2;
      this.caricamentoListInCorso = true;
      // this.maiCaricatoList = false;

      // // logConsole('Pivot. Prende dati list 10');

      this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'TC Run List: Parametri', params);

      this.apiService.chiamataPost(this.Utils, 'geo_tc_run2__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // // const data = JSON.parse(data2);
        ExternalUtilities.checkRitornoChiamata(null,  this.Utils, data);

        if (!this.controllaRitornoChiamata(data, 'List')) {
          this.caricamentoListInCorso = false;
          this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'TC Run list: Esco per chiamata vecchia');
          return;
        }

        /* if (this.colonneTcRun) {
          // logConsole('Vecchie colonne Tc Run List', JSON.parse(this.colonneTcRun));
          // logConsole('Nuove colonne Tc Run List', data.ColumnProperty);
        } */

        if (this.datiList && this.datiList.DataTable && data && data !== null && this.colonneTcRun === JSON.stringify(data.ColumnProperty)) {
          if (data && data.DataTable) {
            this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'TC Run list: rinfresco griglia 2');

            this.datiList.DataTable = data.DataTable;
          } else {
            this.datiList = 'empty grid';
          }
        } else {
          this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'TC Run list: riempimento griglia 2', data);

          this.datiList = data;
          if (this.datiList && this.datiList !== null) {
            this.colonneTcRun = JSON.stringify(this.datiList.ColumnProperty);
          }
          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.effettuaAutoFitList = !this.effettuaAutoFitList;
          }, 500);
        }

        this.vecchioDatiJsonList = this.datiList;
        this.caricamentoListInCorso = false;
      }, error => {
        this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'TC Run List: Errore', error?.message);

        this.vecchioDatiJsonList = undefined;
        this.colonneTcRun = '';
        this.lastCallList[this.numeroFrame2] = '';
        this.datiList = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      });
    /* } else {
      this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'TC Run list: riprendo dati vecchi', this.vecchioDatiJsonList);
      this.datiList = this.vecchioDatiJsonList; */
    }
  }

  premutoWorkSpaceList(e) {
    this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, e);
    // return;

    let activitySetName = '';
    let start = '';
    let stop ='';
    let tI;
    let tF;

    /* switch (Cosa) {
      case 'TCRUN':
        this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, this.tcrunSelezionato);
        activitySetName = this.tcrunSelezionato[0].ACT_SET_NAME;
        start = this.tcrunSelezionato[0].START_TIME_STAMP_SELECTED;
        stop = this.tcrunSelezionato[0].END_TIME_STAMP_SELECTED;
        break;
    } */

    const nuovoNome = 'temp [' + this.operatorID + ']';

    if (start !== null ) { start = '"' + start + '"'; }
    if (stop !== null ) { stop = '"' + stop + '"'; }

    const params = '{' +
      '"cntx_id": "' + this.frameAttivo.sessionID2 + '",' +
      '"v_obj_type": "geo_analysis",' +
      '"v_obj_name": "' + e.NAME + '",' +
      '"v_obj_name_new": "' + nuovoNome + '",' +
      '"v_activityset_name": "' + activitySetName + '",' +
      // '"v_activityset_act_set_type": "' + '' + '",' +
      '"v_timerangedsfstart": ' + start + ',' +
      '"v_timerangedsfstop": ' + stop + '' +
    '}';
    this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'operator_obj_my__copy', params);
    // return;

    this.apiService.chiamataPost(this.frameAttivo.Utils, 'operator_obj_my__copy', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      if (data2) {
        // Creato il temporaneo va caricato GeoAnalysis con il relativo url
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
      '"sess": "' + this.frameAttivo.sessionID2 + '", ' +
      '"gname": "' + this.groupName + '", ' +
      '"uname": "' + this.userName + '", ' +
      '"form": "' + campi[3] + '", ' +
      '"FS": "false"' +
      ancora +
    '}';
    const pass = this.frameAttivo.Utils.cripta(passaggio);
    // this.debug && this.Log.scriveLog(this,  this.debug, this.Log.getMethodName(), false, passaggio);
    // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, pass);
    // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, UtilsInterna.decripta(pass));
    // return;

    let addr = this.urlRoot;

    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      // addr = 'http://localhost:4200';
      addr = 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/Mappe';
      campi[0] = '';
    }

    this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, addr + campi[0] + '/?par=' + pass); // sess=' + this.sessionID +
                                                        // '&gname=' + this.operatorGroupName +
                                                        // '&uname=' + this.userName +
                                                        // '&form=' + campiOrig[1] +
                                                        // '&FS=' + this.fullScreen);
    const doveURL = addr + campi[0] + '/?par=' + pass; // + '/?sess=' + this.sessionID +
                                      //                   '&gname=' + this.operatorGroupName +
                                      //                   '&uname=' + this.userName +
                                      //                   '&form=' + campiOrig[1] +
                                      //                   '&FS=' + this.fullScreen;
    // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, doveURL);
    // return;
    // window.location.href = doveURL;
    // const ww = window.open(doveURL, '_blank');
    if (newPage) {
      const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
      this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, url2);
      const ww = window.open(doveURL, '_blank');
    } else {
      location.assign(doveURL);
    }
  }

  ritornaNomeApp(c) {
    const campi = c.split(';');
    // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Passaggio a progetto ' + campi[0] + ', maschera: ' + campi[1]);

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
      case 'ETLM':
        funzione = 'Activities Loading Monitor';
        break;
      case 'DBO':
        funzione = 'DB Ojects';
        break;
      case 'SESS':
        funzione = 'Session Monitor';
        break;
    }

    const cc = new Array();
    cc.push(dove);
    cc.push(funzione);
    cc.push(campi[0]);
    cc.push(campi[1]);

    return cc;
  }

  /* refreshAggr(e) {
    if (e) {
      this.datiAggr = undefined;
    }
    this.lastCallAggr[this.numeroFrame] = '';

    this.caricaAggr();
  }

  caricaAggr() {
    this.chiSonoAggr = 'F' + this.numeroFrame + ';P' + this.frameAttivo + ';' + new Date().toString();

    const params = {
      cntx_id: this.sessionID,
      v_act_set_name_list : this.AgnOAct,
      v_tms_min: '',
      v_tms_max: '',
      v_bbox: '',
      v_caller_tag: null,
      v_field_list: this.listaCampi ? this.listaCampi : { v_field_list: [] }
    }
    this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Richiamo tcrun info', params);

    const valoriDiBase2 = ';' + this.dashboardAttiva + ';' + this.frameAttivo + ';';
    const actualCall2 = 'TCRUN2AGGR;' + valoriDiBase2 + ';' + JSON.stringify(params);

    params.v_caller_tag = this.chiSonoAggr;

    if (this.lastCallAggr[this.numeroFrame] !== actualCall2) {
      this.lastCallAggr[this.numeroFrame] = actualCall2;
      this.caricamentoAggrInCorso = true;

      this.apiService.chiamataPost(this.Utils, 'geo_tc_run_aggr__grid', params)
      // .map(response => response)
      .subscribe((data: any) => {
        ExternalUtilities.checkRitornoChiamata(null,  this.Utils, data);

        if (!this.controllaRitornoChiamata(data, 'Aggr')) {
          this.caricamentoAggrInCorso = false;
          return;
        }

        if (this.datiAggr && this.datiAggr.DataTable) {
          if (data && data.DataTable) {
            this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Aggr: rinfresco griglia 2');

            this.datiAggr.DataTable = data.DataTable;
          } else {
            this.datiAggr = 'empty grid';
          }
        } else {
          this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Aggr: riempimento griglia 2');

          this.datiAggr = data;
          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.effettuaAutoFitAggr = !this.effettuaAutoFitAggr;
          }, 500);
        }

        this.vecchioDatiJsonAggr = this.datiAggr;
        this.caricamentoAggrInCorso = false;
      }, error => {
        this.erroreAggr = error?.message;
        this.lastCallAggr[this.numeroFrame] = '';
        this.datiAggr = 'ERROR: ' + error?.message;
      });
    } else {
      this.datiAggr = this.vecchioDatiJsonAggr;
    }
  }

  clickRigaAggr(e) {

  } */

  dragEndVerticale(e) {
    // // logConsole('Verticale', e);
    this.dimensioni.dimensioneVerticaleSopra = e.sizes[0];
    this.dimensioni.dimensioneVerticaleSotto = e.sizes[1];

    this.cambioDimensioni.emit(this.dimensioni);

    const tm = setTimeout(() => {
          clearTimeout(tm);
      this.cambioDimensioneContenitorePivot = new Date().toString();
    }, 100);
  }

  dragEndOrizzontale1(e) {
    // // logConsole('Drag end Orizzontale 1', e);
    this.dimensioni.dimensioneAggr = e.sizes[0];
    this.dimensioni.dimensioneConfig = e.sizes[1];
    this.dimensioni.dimensioneConfigList = e.sizes[2];

    this.cambioDimensioni.emit(this.dimensioni);

    const tm = setTimeout(() => {
          clearTimeout(tm);
      this.cambioDimensioneContenitorePivot = new Date().toString();
    }, 100);
  }

  dragEndOrizzontale2(e) {
    // // logConsole('Orizzontale 2', e);
    this.dimensioni.dimensioneList = e.sizes[0];
    this.dimensioni.dimensioneInfo = e.sizes[1];

    this.cambioDimensioni.emit(this.dimensioni);
  }
  
  clickRigaList(ee) {
    let e;
    if (ee.START_TIME_STAMP_SELECTED) {
      e = [ee];
    } else {
      e = ee;
    }
    this.tcRunSelected = true;
    this.rigaSelezionataTcRun = e[0];
    if (e && e[0] && e[0].ROW_ID) {
      // logConsole('Click riga tcrun', e[0], e[0].START_TIME_STAMP_SELECTED);

      this.tmsSelezionato = e[0].START_TIME_STAMP_SELECTED;    
      this.tcRunIdSelezionato = +(e[0].TC_RUN_ID.replace('"', '').replace('"', ''));
      this.indiceTC = [e[0].ROW_ID];
      this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'Click su tc run2', e);
      if (e && e[0] && e[0].START_TIME_STAMP_SELECTED) {
        const valoreRicerca = ExternalUtilities.effettuaReplace(e[0].ACT_SET_NAME, '\'', '');
        const tm = e[0].TMS;

        const params = {
          v_agn_code: valoreRicerca,
          v_tms: tm
        };
  
        this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'Chiamata tms to gps per click su tcrun', this.numeroFrame2, params);

        this.apiService.chiamataPost(this.Utils, 'antsgeo_tms_to_gps1', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data2: any) => {
          // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, data, this.NumeroFrame);
          if (data2 !== null) {
            ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);
  
            if (data2 && data2.lat && data2.lng && data2.lat !== '' && data2.lng !== '' && +data2.lng !== 0 && +data2.lat !== 0) {
              this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'Get Coord Data per click su tcrun 1', this.numeroFrame2, data2);

              this.impostaCenterPosition.emit('POINT(' + data2.lng + ' ' + data2.lat + ')');

              this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'Get Coord Data per click su tcrun 2', this.numeroFrame2, 'POINT(' + data2.lng + ' ' + data2.lat + ')');
            }

            let tms = e[0].START_TIME_STAMP_SELECTED;
            if (tms && tms !== null) {
              while(tms.indexOf('.') > -1)
              {
                tms = tms.replace('.', ':');
              }
            }

            let dstart = e[0].START_TIME_STAMP_SELECTED;
            if (dstart && dstart !== null) {
              while(dstart.indexOf('.') > -1) {
                dstart = dstart.replace('.', ':');
              }
              const i = new Date(dstart + ' UTC+00').getTime();
              this.Utils.tmsInizio = this.Utils.datePipe.transform(i, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            }

            let dend = e[0].END_TIME_STAMP_SELECTED;
            if (dend && dend !== null) {
              while(dend.indexOf('.') > -1) {
                dend = dend.replace('.', ':');
              }
              const f = new Date(dend + ' UTC+00').getTime();
              this.Utils.tmsFine = this.Utils.datePipe.transform(f, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            }
      
            this.Utils.tmsDelta = e[0].START_TIME_STAMP;

            this.Utils.rangeSelezionatoStampa = this.Utils.tmsInizio + '<br />' + this.Utils.tmsFine;

            this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, 'Imposto tms start end', dstart, dend);

            const t = new Date(tms + ' UTC+00').getTime();
            tms = this.Utils.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            this.cambioTmsSelezionato.emit(tms + ';clickRigaTC');

            let agn = e[0].AGN_CODE;
            agn = '[AGN] ' + agn;
            ExternalUtilities.stringaAGNoACT = agn;
            // this.AgnOAct = agn;
            // this.agnPerTcInfo = agn;
            this.impostaAGNoACT.emit(this.Activity + '§' + JSON.stringify(ExternalUtilities.stringaAGNoACT));

            // FUNZIONE DI SINCRONIZZAZIONE
            let inizio = e[0].START_TIME_STAMP_SELECTED;
            const inizioS = inizio;
            inizio = new Date(inizio).getTime();

            let fine = e[0].END_TIME_STAMP_SELECTED;
            const fineS = fine;

            const min = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS');
            const max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');

            this.cambioStartTms.emit(min + ';clickRigaTC');
            this.cambioEndTms.emit(max + ';clickRigaTC');

            this.debugList && this.Log.scriveLog(this, this.debugList, this.Log.getMethodName(), false, min, max);

            /* this.ricaricaTcRun = undefined;
            const tm = setTimeout(() => {
          clearTimeout(tm);
              this.ricaricaTcRun = tms;
            }, 100); */

            if (this.timerSynch === false) {
              const nomeTabella = 'operator_obj_sync_my__upd';
              const params = {
                cntx_id: this.sessionID,
                v_ds_name: e[0].ACT_SET_NAME,
                v_agn_code: e[0].AGN_CODE,
                v_ds_tms_min: min,
                v_ds_tms_max: max,
                v_dsg_tms_min: inizioS,
                v_dsg_tms_max: fineS,
                v_tms_curr: inizioS
              };

              this.apiService.chiamataPost(this.Utils, '' + nomeTabella, params)
              // .map(response => response)
              .pipe(takeUntil(this.destroy$))
              .subscribe((data2: any) => {
                // const data2 = JSON.parse(data);
                ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);
              }, error => {
                // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
                console.error('POST ERROR Obj Sync My Upd: ', error, error.message);
              });
            }
            // }
          }
        }, error => {
          // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
          console.error('POST ERROR Tms to Gps: ', error, error.message);
        });
      }
    }

    this.esegueCaricamentoInfoFile();
  }

  esegueCaricamentoInfoFile() {
    this.debugInfo && this.Log.scriveLog(this, this.debugInfo, this.Log.getMethodName(), false, 'TC Run Info/File: start');

    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaInfoFile[this.numeroFrame2] < 1000) {
      this.debugInfo && this.Log.scriveLog(this, this.debugInfo, this.Log.getMethodName(), false, 'TC Run Info/File: Esco per troppo veloce', this.numeroFrame2);
  
      return;
    }
    this.ultimaVoltaInfoFile[this.numeroFrame2] = ora; */

    if (!this.tcRunIdSelezionato) {
      this.debugInfo && this.Log.scriveLog(this, this.debugInfo, this.Log.getMethodName(), false, 'TC Run Info/File: esco per tc run id vuoto', this.tcRunIdSelezionato);

      return
    }

    if (!this.tmsSelezionato) {
      this.debugInfo && this.Log.scriveLog(this, this.debugInfo, this.Log.getMethodName(), false, 'TC Run Info/File: esco per tms vuoto', this.tmsSelezionato);

      return
    }

    if (!this.AgnOAct2) {
      this.debugInfo && this.Log.scriveLog(this, this.debugInfo, this.Log.getMethodName(), false, 'TC Run Info/File: esco per AgnOAct vuoto', this.AgnOAct2);

      return
    }

    // const act_id = ExternalUtilities.prendeActivitySceltaPerEvents(t, this.Utils);
    const paramsFile = {
      cntx_id: this.sessionID,
      v_act_set_name_list : this.AgnOAct2,
      v_tms: this.tmsSelezionato
    }
    const paramsOutcome = {
      cntx_id: this.sessionID,
      v_act_set_name_list : this.AgnOAct2,
      v_tms: this.tmsSelezionato,
      v_tc_run_id: this.tcRunIdSelezionato
    }
    this.debugInfo && this.Log.scriveLog(this, this.debugInfo, this.Log.getMethodName(), false, 'Richiamo tcrun info/file', paramsFile, paramsOutcome);

    // logConsole('Richiamo InfoFile', this.AgnOAct2, this.tmsSelezionato, this.tcRunIdSelezionato);

    const valoriDiBase2 = ';' + this.dashboardAttiva + ';' +
      this.frameAttivo + ';';
    const actualCall2 = 'TCRUNINFO;' + valoriDiBase2 + ';' + JSON.stringify(paramsFile) + ';' + JSON.stringify(paramsOutcome);
    // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, actualCall2);
    // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, TCRunInfoComponent.lastCallTrace);

    if (this.datiTcRunInfo && typeof(this.datiTcRunInfo) === 'string') {
      if (this.datiTcRunInfo.indexOf('ERROR: ') > -1) {
        this.datiTcRunInfo = undefined;
        this.datiTcRunFile = undefined;
        this.lastCallFileInfo[this.numeroFrame2] = undefined;
      }
    }

    if (this.lastCallFileInfo[this.numeroFrame2] !== actualCall2) { // && this.vecchioDatiJsonFile) {
      this.lastCallFileInfo[this.numeroFrame2] = actualCall2;
      this.caricamentoFileInCorso = true;

      this.debugFile && this.Log.scriveLog(this, this.debugFile, this.Log.getMethodName(), false, 'TC RUN Files', this.numeroFrame2, paramsFile);

      this.apiService.chiamataPost(this.Utils, 'geo_tc_run_files__grid', paramsFile)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // // const data = JSON.parse(data2);
        ExternalUtilities.checkRitornoChiamata(null,  this.Utils, data);

        if (this.datiTcRunFile && this.datiTcRunFile.DataTable) {
          if (data && data.DataTable) {
            this.debugFile && this.Log.scriveLog(this, this.debugFile, this.Log.getMethodName(), false, 'TC Run file: rinfresco griglia 2');

            this.datiTcRunFile.DataTable = data.DataTable;
          } else {
            this.datiTcRunFile = 'empty grid';
          }
        } else {
          this.debugFile && this.Log.scriveLog(this, this.debugFile, this.Log.getMethodName(), false, 'TC Run file: riempimento griglia 2');

          // this.datiTcRunFile = undefined;
          // const tm = setTimeout(() => {
          // clearTimeout(tm);
            this.datiTcRunFile = data;
          // }, 100);
          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.effettuaAutoFitFile = !this.effettuaAutoFitFile;
          }, 1000);
          this.vecchioDatiJsonFile = data;
        }

        this.caricamentoFileInCorso = false;

        /* if (data.v_tc_run_code !== this.vecchioTcRun) {
          this.vecchioTcRun = data.v_tc_run_code;
          this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Info: Caricamento la griglia 2. Codice diverso: ', this.vecchioTcRun); */

        this.caricamentoInfoInCorso = true;
        this.apiService.chiamataPost(this.Utils, 'geo_tc_run_outcome__grid', paramsOutcome)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data2: any) => {
          // const data2 = JSON.parse(data);
          ExternalUtilities.checkRitornoChiamata(null,  this.Utils, data2);

          // this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Ritorno info', data);
          if (this.datiTcRunInfo && this.datiTcRunInfo.DataTable) {
            if (data2 && data2.DataTable) {
              this.debugInfo && this.Log.scriveLog(this, this.debugInfo, this.Log.getMethodName(), false, 'TC Run Info: rinfresco griglia 1', data2.DataTable);

              this.datiTcRunInfo.DataTable = data2.DataTable;
            } else {
              this.datiTcRunInfo = 'empty grid';
            }
          } else {
            this.debugInfo && this.Log.scriveLog(this, this.debugInfo, this.Log.getMethodName(), false, 'TC Run Info: riempimento griglia 1');

            this.datiTcRunInfo = data2;
            // // logConsole('TC RUN INFO', data2);
            const tm = setTimeout(() => {
          clearTimeout(tm);
              this.effettuaAutoFitInfo = !this.effettuaAutoFitInfo;
            }, 1000);
            this.vecchioDatiJsonInfo = data2;                  
          }
            // this.datiTcRunFile = 'empty grid';

          /* const tm = setTimeout(() => {
          clearTimeout(tm);
              this.effettuaAutoFitInfo = !this.effettuaAutoFitInfo;
            }, 1000);
          } */

          this.caricamentoInfoInCorso = false;
        }, error => {
          // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
          this.caricamentoInfoInCorso = false;
          this.lastCallFileInfo[this.numeroFrame2] = '';
          this.datiTcRunInfo = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        });
        /* } else {
          this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Info: prevengo il caricamento della griglia 2. Stesso codice: ', this.vecchioTcRun);
        } */

        // t2.caricamentoTcRunInCorso1 = false;
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
        this.caricamentoInfoInCorso = false;
        this.lastCallFileInfo[this.numeroFrame2] = '';
        this.datiTcRunFile = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      });
    // } else {
      // t2.caricamentoTcRunInCorso2 = false;
    /* } else {
      // this.datiTcRunFile = undefined;
      // this.datiTcRunInfo = undefined;
      // const tm = setTimeout(() => {
          clearTimeout(tm);
        this.caricamentoFileInCorso = false;
        this.caricamentoInfoInCorso = false;
        this.datiTcRunFile = this.vecchioDatiJsonFile;
        this.datiTcRunInfo = this.vecchioDatiJsonInfo;
      // }, 100); */
    }
  }

  clickRigaINFO(e) {
    this.debugInfo && this.Log.scriveLog(this, this.debugInfo, this.Log.getMethodName(), false, e);
    // this.tcrunSelezionato = e;
    const tms = e[0].TAG_VALUE_STR;
  }

  clickRigaFile(e) {
    this.debugFile && this.Log.scriveLog(this, this.debugFile, this.Log.getMethodName(), false, e);
    let campo1 = '';
    let campo2 = '';

    if (e[0]) {
      campo1 = e[0].FILE_NAME;
      campo2 = e[0].FILE_EXT;
    } else {
      if (e.dataItem) {
        campo1 = e.dataItem.FILE_NAME;
        campo2 = e.dataItem.FILE_EXT;
      } else {
      }
    }

    if (campo1 !== '' && campo2 !== '') {
      this.mostraPopup = true;
      this.prendeFileDaTcRun(this.frameAttivo, campo1, campo2);
    }
  }

  prendeFileDaTcRun(t, nome, est) {
    if (this.MappaOGrafico !== 'TI' && this.MappaOGrafico !== 'TC') {
      this.mostraPopup = false;
      return;
    }

    const params = '{ "cntx_id": "' + t.sessionID2 + '", "v_file_name": "' + nome + '" }';

    this.debugFile && this.Log.scriveLog(this, this.debugFile, this.Log.getMethodName(), false, 'TC RUN File', this.numeroFrame2, params);

    this.apiService.chiamataPost(this.Utils, 'geo_tc_run_file__download', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      ExternalUtilities.checkRitornoChiamata(null,  this.Utils, data2);

      const byteBuf = this.u_atob(data2); // atob(data);

      const blob = new Blob([byteBuf], {type: 'application/octet-stream'});
      const nomeFile = nome;

      // const FileSaver = require('file-saver');
      // FileSaver.saveAs(blob, nomeFile);
      // this.fileSaver.save(blob, nomeFile);

      download(blob, nomeFile, 'application/octet-stream');

      // t.caricamentoTcRunInCorso = false;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        this.mostraPopup = false;
      }, 3000);
    }, error => {
      ExternalUtilities.messaggioDiErrore('null', error);
      this.mostraPopup = false;
    });
  }

  u_atob(ascii) {
    return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
  }

  onTabChanged(e) {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      this.debugFile && this.Log.scriveLog(this, this.debugFile, this.Log.getMethodName(), false, 'Cambio pagina', e);
      if (e.index === 0) {
        this.effettuaAutoFitInfo = !this.effettuaAutoFitInfo;
      } else {
        this.effettuaAutoFitFile = !this.effettuaAutoFitFile;
      }
    }, 1000);
  }  

  controllaRitornoChiamata(dataP, chiamante) {
    return true;

    const data = dataP;

    let chiSono = '';

    switch(chiamante) {
      case 'List':
        chiSono = this.chiSonoList;
        break;
      case 'Aggr':
        chiSono = this.chiSonoAggr;
        break;
      case 'Fields':
        // chiSono = this.chiSonoField;
        break;
      case 'FieldValues':
        // chiSono = this.chiSonoFieldValue;
        break;
    }

    if (chiSono === '') {
      this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata nulla ' + chiamante);

      return false;
    }

    if (data && data.v_caller_tag) {
      const ritorno = data.v_caller_tag;
      if (ritorno !== chiSono) {
        this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata diversa ' + chiamante, chiSono, ritorno);

        return false;
      } else {
        this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata uguale ' + chiamante, chiSono, ritorno);

        return true;
      }
    } else {
      this.debug && this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: nessun codice di ritorno ' + chiamante);

      return true;
    }
  }

  ritornoSettings(e) {
    this.debugPivot && this.Log.scriveLog(this, this.debugPivot, this.Log.getMethodName(), false, 'Ritorno settings pivot', e);
    // logConsole('Ritorno settings pivot tcrun2', e);

    this.impostazioniPivot2 = e;
    this.impostazioniPivotEmit.emit(e);
  }

  checkDebug(n, e) {
    this.setDebug2(n, e.srcElement.checked);
    localStorage.setItem('debugTcRun2_' + this.userName + '_' + this.numeroFrame2 + '_' + this.frameAttivo + '_' + n.toString(), (e.srcElement.checked ? 'S' : 'N'));
    this.debugPivot && this.Log.scriveLog(this, this.debugPivot, this.Log.getMethodName(), false, 'Click su debug', n, e.srcElement.checked);
  }

  setDebug2(n, valore) {
    // // logConsole('Debug tcrun2', n, valore);
    switch (n) {
      case 0:
        this.debugPivot = valore;
        break;
      case 1:
        this.debugList = valore;
        break;
      case 2:
        // this.debugConfig = valore;
        break;
      case 3:
        // this.debugConfigList = valore;
        break;
      case 4:
        this.debugInfo = valore;
        break;
      case 5:
        this.debugFile = valore;
        break;
    }
  }

  setDebug() {
    if (!this.debug) {
      this.debugPivot = false;
      this.debugList = false;
      this.debugInfo = false;
      this.debugFile = false;
      // this.debugConfig = false;
      // this.debugConfigList = false;
    } else {
      for (let i = 0; i < 6; i++) {
        const d = localStorage.getItem('debugTcRun2_' + this.userName + '_' + this.numeroFrame2 + '_' + this.frameAttivo + '_' + i);
        if (d === null) {
          this.setDebug2(i, false);
        } else {
          const v = (d === 'S');
          this.setDebug2(i, v);
        }
      }
    }
  }

  pulisceDati() {
    // this.maiCaricatoConfig = true;
    this.datiTcRunInfo = undefined;
    this.datiTcRunFile = undefined;
    // this.datiConfig = undefined;
    // this.datiConfigList = undefined;
    this.vecchioDatiJsonInfo = undefined;
    this.vecchioDatiJsonFile = undefined;
    // this.vecchioDatiJsonConfig = undefined;
    // this.listaCampiAttualeConfronto = undefined;
    this.listaCampiAttuale = undefined;
    // this.impostaSelezioneConfigList = undefined;
    // this.vecchioDatiJsonConfigList = undefined;
    this.lastCallList[this.numeroFrame2] = '';
    this.lastCallAggr[this.numeroFrame2] = '';
    // this.lastCallConfig[this.numeroFrame2] = '';
    // this.lastCallConfigList[this.numeroFrame2] = '';
    this.lastCallFileInfo[this.numeroFrame2] = '';
    this.lastCallInfo[this.numeroFrame2] = '';
    this.chiSonoList = '';
    this.chiSonoAggr = '';
    // this.chiSonoField = '';
    // this.chiSonoFieldValue = '';
    this.impostazioniPivot2 = {
      columns: [],
      rows: [],
      formatSettings: [],
      values: [],
      expandAll: false,
      filters: [],
      filterSettings: [],
      fieldMapping: [],
      groupSettings: [],
      conditionalFormatSettings: [],
      excludeFields: []
    };
    this.puliziaDati = new Date().toString();
  }

  clickCellaPivot(e) {
    // logConsole('Click cella pivot', e);
    // // logConsole('Impostazioni pivot', this.impostazioniPivot2);
    const jsonClick = new Array();
    let q = 0;
    this.impostazioniPivot2.rows.forEach(element => {
      let header;
      if (e && e.data && e.data.rowHeaders && e.data.rowHeaders.indexOf('.')) {
        header = e.data.rowHeaders.split('.');
      } else {
        header = [ '', '', '', '', '', '' ];
      }
      jsonClick.push({ CODE: element.name, VALUE_LIST: [header[q]] });
      /* jsonClick.push({ CODE: element.name, VALUE_LIST: [e.data.rowHeaders] }); */
      q++;
    });

    q = 0;
    this.impostazioniPivot2.columns.forEach(element => {
      let header;
      if (e && e.data && e.data.columnHeaders && e.data.columnHeaders.indexOf('.')) {
        header = e.data.columnHeaders.split('.');
      } else {
        header = [ '', '', '', '', '', '' ];
      }
      if (header[q] !== e.data.actualText) {
        jsonClick.push({ CODE: element.name, VALUE_LIST: [header[q]] });
      }
      /* jsonClick.push({ CODE: element.name, VALUE_LIST: [e.data.columnHeaders] }); */
      q++;
    });
    
    /* q = 0;
    this.impostazioniPivot2.filterSettings.forEach(element => {
      const filtro = new Array();
      element.items.forEach(element2 => {
        filtro.push(element2);
      });
      const filtro2 = {
        condition: element.condition,
        items: filtro
      }
      jsonClick.push({ CODE: element.name, VALUE_LIST: [filtro2] });
      q++;
    }); */

    /* this.impostazioniPivot2.filters.forEach(element => {
      jsonClick.push({ CODE: element.name, VALUE_LIST: [] });
    }); */
    // logConsole('Click da inviare', jsonClick);
    this.filtro = JSON.parse(JSON.stringify(jsonClick));

    this.prendeDatiList();
  }

  checkVirt(e) {
    this.virtualization = e.srcElement.checked;
  }

  gestisceLayout() {
    switch (this.layout2) {
      case 1:
        // SOLO PIVOT
        this.dimensioni.dimensioneVerticaleSopra = 100;
        this.dimensioni.dimensioneVerticaleSotto = 0;
        break;
      case 2:
        // SOLO TCRUN
        this.dimensioni.dimensioneVerticaleSopra = 0;
        this.dimensioni.dimensioneVerticaleSotto = 100;
        break;
      case 3:
        // PIVOT + TCRUN
        this.dimensioni.dimensioneVerticaleSopra = 50;
        this.dimensioni.dimensioneVerticaleSotto = 50;
        break;
    }
  }

  ritornoDimensioniColonneList(e) {
    ExternalUtilities.scriveDimensioniColonne('List', e);
  }

  ritornoDimensioniColonneInfo(e) {
    ExternalUtilities.scriveDimensioniColonne('Info', e);
  }

  ritornoDimensioniColonneTcRunFile(e) {
    ExternalUtilities.scriveDimensioniColonne('TcRunFile', e);
  }
}

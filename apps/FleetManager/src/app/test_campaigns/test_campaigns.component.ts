import { logConsole } from '../console-log';
import {transform} from 'ol/proj';
import { DatePipe } from '@angular/common';
import { environment } from './../../environments/environment';
import { SessionService } from './../db/session.service';
import { ApiService } from './../db/api.service';
import { Component, Input, OnInit, OnChanges, ViewEncapsulation, ViewChild, AfterViewInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import Utils from '../Utilities.component';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material/tabs';
// import Swal from 'sweetalert2/dist/sweetalert2.js';

/* import { ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService , RichTextEditorComponent, NodeSelection, TableService, ImageSettingsModel} from '@syncfusion/ej2-angular-richtexteditor';
import { createElement, addClass, removeClass, Browser } from '@syncfusion/ej2-base'; */

@Component({
  templateUrl: 'test_campaigns.component.html',
  selector: 'app-test-campaigns',
  styleUrls: ['./test_campaigns.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TestCampaignsComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('divContenitore', {static: true}) divContenitore: ElementRef;
  @ViewChild('tabgroup', {static: true}) tabGroup: MatTabGroup;
  @ViewChild('tabgroupAgent2', {static: true}) tabgroupAgent2: MatTabGroup;
  @ViewChild('tabgroupTS2', {static: true}) tabgroupTS2: MatTabGroup;
  @ViewChild('tabTests', {static: true}) tabTests: HTMLElement;

  // @ViewChild('toolsRTE', {static: true}) public rteObj: RichTextEditorComponent;
  // @ViewChild('Dialog', {static: true}) public dialogObj: Dialog;

  // public insertImageSettings: ImageSettingsModel = { allowedTypes: ['.jpeg', '.jpg', '.png'], display: 'inline', width: 'auto', height: 'auto', saveFormat: 'Blob', saveUrl: null, path: null,}

  @Input() indirizzoServer;
  @Input() userName;
  @Input() sessioneID;
  @Input() lastDays;
  @Input() additionalLayer;
  @Input() queryPck;
  @Input() groupName;
  @Input() urlRoot;
  @Input() operatorID;
  @Input() listaWorkSpaces;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() searchAgnCode = '';
  @Input() prop_name;
  @Input() FleetManagerAdvancedMonitoring;
  @Input() MisureTCRun;
  @Input() nomeSetAntenne;
  @Input() permessiTab;
  @Input() mappaVisibile = 'N';

  destroy$ = new Subject<void>();

  datiGrigliaCheck;
  checkPopup = false;
  modalitaCheckPopup;
  operazioneCheckPopup = '';
  dimensioneSplitSopra = 67;
  dimensioneSplitSotto = 33;

  permessiTab2 = {
    tab_agents: false,
    tab_monitoring: false,
    tab_test_scenario: false,
    tab_activities_by_day: false,
    tab_agent_group_conf: false,
    tab_all_tickets: false,
    tab_test: false,
  }

  public tools: object = {
    type: 'Expand',
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
    'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
    'LowerCase', 'UpperCase', '|',
    'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
    'Outdent', 'Indent', '|',
    'CreateLink', '|', 'ClearFormat', 'Print',
    'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
  }; // , 'Image'

  /* public tools: ToolbarModule = {
    items: [
        'Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
        'LowerCase', 'UpperCase', 'SuperScript', 'SubScript', '|',
        'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
        'Outdent', 'Indent', '|',
        'CreateTable', 'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
        'SourceCode', '|', 'Undo', 'Redo', '|' ]
  }; */
  public maxLength = 20000;
  public textArea: HTMLElement;
  public myCodeMirror: any;

  public Utils = Utils;
  public j = JSON;
  vecchioTab = 0;
  vecchioTab2 = 0;
  vecchioTab3 = 0;
  vecchioTab4 = 0;
  rigaSelezionataAgentInfo2;
  previousX;
  tabAperto = 'AGENTS';

  visualizzataPivot = false;

  propName = new Array();
  // propName2 = '';
  // propName3 = '';

  tmsPassati;
  tmsPassatiTcRun;
  nomeSetAntenne2;

  /* listaWorkSpaces = [{
    DESCRIPTION: "",
    FOLDER: "Fleet Mng",
    INSERT_TIMESTAMP: "2022-02-27 11:43:13",
    OBJ_NAME: "TcRun (sys)",
    OBJ_TYPE: "geo_analysis",
    OPERATOR_ID: "1"
  }]; */

  oldDaScenario = false;
  oldDaActivities = false;

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  effettuaAutoFitTS;
  effettuaAutoFitTS2;

  datiGriglia;
  nomeGriglia = '';
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  selezione;
  rigaSelezionata;
  agnGroupID;
  agnGroup;
  stringaAGNCode = undefined;
  TitoloMascheraModifica1;
  mascheraModificaAttiva1 = false;
  rigaModificata1;
  rigaOriginale1;
  modificaOInserimento1 = '';
  datiAgnGroupFolder;
  additionalLayer2;

  datiGrigliaTestScenario;
  nomeGriglia2 = '';
  effettuaAutoFit2 = false;
  caricamentoDatiInCorso2 = false;
  selezione2;
  tastoEdit2 = false;
  tastoCopia2 = false;
  tastoDelete2 = false;
  tastoNew2 = true;
  rigaSelezionata2;

  datiGrigliaTestScenario2;
  nomeGriglia3 = '';
  effettuaAutoFit3 = false;
  caricamentoDatiInCorso3 = false;
  selezione3;
  rigaSelezionata3;
  refreshMappa = false;
  modificaTDC = '';
  rigaSelPerModificaN;

  datiGrigliaAgentsInfo;
  nomeGrigliaAgentsInfo = '';
  effettuaAutoFit4 = false;
  editKeyVisibile4 = false;
  caricamentoDatiInCorso4 = false;
  caricamentoDatiInCorso42 = false;
  selezione4;
  actSetNameFM = '';
  groupIdSelezionato;
  agentSelezionato;
  coordinate;

  datiGrigliaAgentProfile;
  nomeGrigliaAgentProfile = '';
  effettuaAutoFit5 = false;
  rigaSelezionataAgentProfile;
  caricamentoDatiInCorso5 = false;
  selezione5;
  mascheraModificaAttivaComboAgentProfile = false;
  TitoloMascheraModificaCombo5 = 'Agent Profile associated to the group';
  mascheraModificaAttivaComboAgentProfileN = false;
  TitoloMascheraModificaCombo5N = '';
  datiAgnProf;
  agnProfSelezionato;
  selezioneAgnProfCombo;
  lovSelezionato;
  datiLov;
  replayVisibile = false;

  datiGrigliaAgentInfo;
  nomeGrigliaAgentInfo = '';
  selezioneAgentInfo;
  effettuaAutoFitAgentInfo = false;
  rigaSelezionataAgentInfo;
  rigaSelezionataAI;

  datiGrigliaTcRun;
  nomeGrigliaTcRun = 'Tc Run';
  selezioneTcRun;
  righeSelezionateTcRun;
  selezioneTcRun2;
  keyWorkspaceVisibileTcRun = false;
  effettuaAutoFitTcRun = false;
  caricamentoDatiInCorsoTcRun = false;
  datiGrafico;

  datiGrigliaTcRunAct;
  nomeGrigliaTcRunAct = 'Tc Run';
  selezioneTcRunAct;
  righeSelezionateTcRunAct;
  selezioneTcRun2Act;
  keyWorkspaceVisibileTcRunAct = false;
  effettuaAutoFitTcRunAct = false;
  caricamentoDatiInCorsoTcRunAct = false;

  datiGrigliaAgent1 = null;
  nomeGrigliaAgent1 = '';
  selezioneAgent1;
  keyWorkspaceVisibileAgent1 = false;
  effettuaAutoFitAgent1 = false;
  caricamentoDatiInCorsoAgent1 = false;
  RigaSelezioneAgent1;
  selezionatoAgent = false;

  datiGrigliaHistGrid;
  nomeGrigliaHistGrid = '';
  selezioneHistGrid;
  keyWorkspaceVisibileHistGrid = false;
  effettuaAutoFitHistGrid = false;
  caricamentoDatiInCorsoHistGrid = false;
  RigaSelezioneHistGrid;

  datiGrigliaActivityTS;
  nomeGrigliaActivityTS = '';
  selezioneActivityTS;
  keyWorkspaceVisibileActivityTS = false;
  effettuaAutoFitActivityTS = false;
  caricamentoDatiInCorsoActivityTS = false;
  RigaSelezioneActivityTS;

  datiGrigliaAgent2;
  nomeGrigliaAgent2 = '';
  selezioneAgent2;
  keyWorkspaceVisibileAgent2 = false;
  effettuaAutoFitAgent2 = false;
  caricamentoDatiInCorsoAgent2 = false;
  RigaSelezioneAgent2;
  righeSelezionateAgent2;

  datiGrigliaTicket;
  nomeGrigliaTicket = '';
  selezioneTicket;
  selezioneTicket2;
  keyWorkspaceVisibileTicket = false;
  effettuaAutoFitTicket = false;
  caricamentoDatiInCorsoTicket = false;

  mascheraModificaTicket = false;
  TitoloMascheraModificaMT = '';
  operazioneTicket;
  rigaModificataTicket;
  vecchioValoreTicket;
  datiLookUpStatus;
  datiLookUpPriority;
  datiOperator;

  datiGrigliaTestExManDati;
  nomeGrigliaTEMd = 'Test Execution Manager Data';
  editKeyVisibileTEMd = false;
  deleteKeyVisibileTEMd = false;
  newKeyVisibileTEMd = false;
  selezioneTEMd;
  effettuaAutoFitTEMd = false;
  caricamentoDatiInCorsoTEMd = false;

  datiGriglia6;
  nomeGriglia6 = 'Test Campaign 6';
  effettuaAutoFit6 = false;
  caricamentoDatiInCorso6 = false;
  selezione6;
  rigaSelezionata6;
  editKeyVisibile6 = false;
  deleteKeyVisibile6 = false;
  newKeyVisibile6 = false;
  TitoloMascheraModifica6;
  rigaModificata6;
  mascheraModificaAttiva6 = false;
  modificaOInserimento6;

  datiGriglia62;
  nomeGriglia62 = 'Test Campaign 62';
  effettuaAutoFit62 = false;
  caricamentoDatiInCorso62 = false;
  selezione62;
  rigaSelezionata62;
  editKeyVisibile62 = false;
  deleteKeyVisibile62 = false;
  newKeyVisibile62 = false;
  TitoloMascheraModifica62;
  rigaModificata62;
  mascheraModificaAttiva62 = false;
  modificaOInserimento62;

  datiGrigliaQueryPCK;
  nomeGrigliaQueryPCK = 'Test Campaign 7';
  effettuaAutoFit7 = false;
  caricamentoDatiInCorso7 = false;
  selezione7;
  mascheraModificaAttivaComboQueryPCK = false;
  TitoloMascheraModificaCombo7 = 'Query Pck';
  datiQueryPck;
  queryPckSelezionato;
  selezioneQueryPckCombo;

  datiGrigliaDataAcquisition;
  nomeGrigliaDataAcquisition = 'Test Campaign 8';
  effettuaAutoFit8 = false;
  caricamentoDatiInCorso8 = false;
  selezione8;
  mascheraModificaAttivaComboDataAcquisition = false;
  TitoloMascheraModificaCombo8 = 'Data Acquisition';
  datiDataAcquisition;
  rigaSelezionataDataAcquisition;
  dataAcquisitionSelezionato;
  selezioneQueryDataAcquisition;

  datiGrigliaDataAcquisition2;
  nomeGrigliaDataAcquisition2 = 'Test Campaign 82';
  effettuaAutoFitDataAcquisition2 = false;
  caricamentoDatiInCorsoDataAcquisition2 = false;
  selezioneDataAcquisition2;
  mascheraModificaAttivaComboDataAcquisition2 = false;
  TitoloMascheraModificaComboDataAcquisition2 = 'Data Acquisition 2';
  rigaSelezionataDataAcquisition2;
  datiDataAcquisition2;
  dataAcquisitionSelezionato2;
  selezioneQueryDataAcquisition2;

  mascheraModificaAttiva4 = false;
  TitoloMascheraModifica4;
  agentSelezionati4;
  rigaSelezionata4;
  confirmKey4 = false;

  mascheraModificaAttivaTestScenario = false;
  rigaModificata2;
  modificaOInserimentoTestScenario = '';
  datiActive = [
    { ID: 'Y', NAME: 'Yes' },
    { ID: 'N', NAME: 'No' },
  ];
  TitoloMascheraModificaTestScenario = '';

  datiTSID;
  ruleCriteria = [
    { ID: 'time', NAME: 'Time' },
    { ID: 'geo', NAME: 'Geo' },
  ];

  actSetIdScelto;
  actSetNameScelto;
  lastDays2 = 30;
  agnProf = false;
  opzione = 2;
  datiOperatorGroup;
  userName2;
  agentCodeMod;
  pulisceFiltroAgCode = false;
  queryPck2;
  searchAgnCode2 = '';

  FleetManagerAdvancedMonitoring2 = true;

  MisureTCRun2;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    public sessionService: SessionService,
    private _matDialog: MatDialog,
    private renderer: Renderer2,
  ) {
    // this.datiGrigliaAgent1 = 'empty grid';
  }

  ngOnDestroy(): void {
    if (this.divContenitore) {
      if (this.tabGroup) {
        this.renderer.removeChild(this.divContenitore.nativeElement, this.tabGroup);
      }
      if (this.tabgroupAgent2) {
        this.renderer.removeChild(this.divContenitore.nativeElement, this.tabgroupAgent2);
      }
      if (this.tabgroupTS2) {
        this.renderer.removeChild(this.divContenitore.nativeElement, this.tabgroupTS2);
      }
      if (this.tabTests) {
        this.renderer.removeChild(this.divContenitore.nativeElement, this.tabTests);
      }
      this.divContenitore.nativeElement.remove();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    // this.caricaTabella('Init');
    this.caricaTicket();
    this.caricaTSID();
    this.letturaAgnProf();
    this.letturaQueryPck();
    this.LeggeDatiMosaicStyle();
    this.LeggeOperatorGroup();
  }

  ngAfterViewInit() {
    /* const tm = setTimeout(() => {
      this.tabGroup.selectedIndex = 0;
      this.tabgroupAgent2.selectedIndex = 0;
      this.tabgroupTS2.selectedIndex = 0;
    }, 1000); */
  }

  mappaLockata = false;

  ngOnChanges(r) {
    if (r.permessiTab && r.permessiTab.currentValue && r.permessiTab.currentValue.test_campaigns) {
      this.permessiTab2 = JSON.parse(JSON.stringify(r.permessiTab.currentValue.test_campaigns));
      logConsole('-->Permessi Tab', this.permessiTab2);
      if (this.permessiTab2.tab_test === true) {
        this.vecchioTab2 = 0;
      } else {
        this.vecchioTab2 = 1;
      }
      console.log('Permessi:', this.permessiTab2);
    }

    if (r.mappaVisibile) {
      if (r.mappaVisibile.currentValue) {
        const mv = r.mappaVisibile.currentValue;
        if (mv === 'Y') {
          this.dimensioneSplitSopra = 67;
          this.dimensioneSplitSotto = 33;
          this.mappaLockata = false;
        } else {
          this.dimensioneSplitSopra = 100;
          this.dimensioneSplitSotto = 0;
          this.mappaLockata = true;
        }
      }
    }

    if (r.userName) {
      if (r.userName.currentValue) {
        this.userName2 = r.userName.currentValue;

        this.Utils.scriveLog('User name:', this.userName2);
      }
    }

    if (r.FleetManagerAdvancedMonitoring && r.FleetManagerAdvancedMonitoring.currentValue !== undefined) {
      this.FleetManagerAdvancedMonitoring2 = r.FleetManagerAdvancedMonitoring.currentValue;
      if (this.FleetManagerAdvancedMonitoring2 === true) {
        // this.vecchioTab2 = 0;
        // this.tabTests.remove();
      } else {
        // this.vecchioTab2 = 1;
      }

/*
      this.FleetManagerAdvancedMonitoring2 = false;
      this.dimensioneSplitAbD1 = 85;
      this.dimensioneSplitAbD2 = 0;
      */

    }

    if (r.listaWorkSpaces) {
      this.Utils.scriveLog('Lista workspaces: ', r.listaWorkSpaces.currentValue);
    }

    if (r.queryPck) {
      if (r.queryPck.currentValue) {
        this.queryPck2 = r.queryPck.currentValue;
      }
    }

    if (r.nomeSetAntenne) {
      if (r.nomeSetAntenne.currentValue) {
        this.nomeSetAntenne2 = r.nomeSetAntenne.currentValue;
        // logConsole('Passato set antenne in tc', this.nomeSetAntenne2);
      }
    }

    let okRicaricaTabelle = false;

    if (r.prop_name) {
      if (r.prop_name.currentValue !== undefined) {
        // this.Utils.scriveLog(r.prop_name_1.currentValue);
        if (r.prop_name.currentValue.VALUE_STR) {
          this.propName = r.prop_name.currentValue.VALUE_STR;
        } else {
          this.propName = r.prop_name.currentValue;
        }
        logConsole('PROPS:', this.propName);
        okRicaricaTabelle = true;
      }
    }

    /* if (r.prop_name_2) {
      if (r.prop_name_2.currentValue !== undefined) {
        this.propName2 = r.prop_name_2.currentValue.VALUE_STR;
        // this.Utils.scriveLog(r.prop_name_1.currentValue);
        if (r.prop_name_2.currentValue.VALUE_STR) {
          this.propName2 = r.prop_name_2.currentValue.VALUE_STR;
        } else {
          this.propName2 = r.prop_name_2.currentValue;
        }
        // logConsole('PROP 2:', this.propName2);
        okRicaricaTabelle = true;
      }
    }

    if (r.prop_name_3) {
      if (r.prop_name_3.currentValue !== undefined) {
        // this.propName3 = r.prop_name_3.currentValue.VALUE_STR;
        // this.Utils.scriveLog(r.prop_name_1.currentValue);
        if (r.prop_name_3.currentValue.VALUE_STR) {
          this.propName3 = r.prop_name_3.currentValue.VALUE_STR;
        } else {
          this.propName3 = r.prop_name_3.currentValue;
        }
        // logConsole('PROP 3:', this.propName3);
        okRicaricaTabelle = true;
      }
    } */

    if (okRicaricaTabelle) {
      // logConsole('Ricarico tabelle per cambio PROP:', this.groupIdSelezionato, this.rigaSelezionata);
      this.caricaAgentGroup(this.groupIdSelezionato);
      this.caricaAgent1();
    }

    if (r.lastDays) {
      if (r.lastDays.currentValue) {
        this.lastDays2 = r.lastDays.currentValue;

        const t1 = new Date().getTime() - (this.lastDays2 * 24 * 60 * 60 * 1000);
        const sInizio = this.datePipe.transform(t1, 'yyyy-MM-dd HH:mm:ss.SSS'); // , 'UTC'
        const t2 = new Date().getTime() + (24 * 60 * 60 * 1000);
        const sFine = this.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:ss.SSS'); // , 'UTC'
        this.tmsPassati = sInizio + ';' + sFine;

        logConsole('Last days in TC', this.lastDays2, sInizio, sFine);

        this.caricaDataAcquisition(this.groupIdSelezionato);
        this.caricaTestExecution();

        this.caricaHistGrid();
        this.caricaActivityTS();
        this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
      }
    }

    if (r.searchAgnCode) {
      if (r.searchAgnCode.currentValue !== undefined) {
        this.searchAgnCode2 = r.searchAgnCode.currentValue;
        this.caricaTabella('Search Agn Code');
      }
    }

    if (r.additionalLayer) {
      this.additionalLayer2 = r.additionalLayer.currentValue;
      // this.Utils.scriveLog('Refresh additionalLayer', this.additionalLayer2);
    }

    if (r.MisureTCRun) {
      if (r.MisureTCRun.currentValue) {
        this.MisureTCRun2 = r.MisureTCRun.currentValue;
        // logConsole('Arrivate nuove misure tcrun: ', this.MisureTCRun2, this.tabAperto);

        if (this.tabAperto === 'MONITORING' || this.tabAperto === 'TEST RUN' || this.tabAperto === 'ACTIVITIES BY DAY') {
          if (this.RigaSelezioneActivityTS) {
            this.caricaTcRun(this.oldDaScenario, this.oldDaActivities);
          }
        }
        if (this.tabAperto === 'ACTIVITIES BY DAY') {
          if (this.rigaSelezionataDataAcquisition2) {
            this.caricaTcRunAct();
          }
        }
        if (this.tabAperto === 'AGENTS' || this.tabAperto === 'TESTS') {
          if (this.RigaSelezioneHistGrid) {
            this.caricaAgent2();  
          }
        }
      }
    }
  }

  LeggeOperatorGroup() {
    const params = {
      cntx_id: this.sessionService.getToken(),
    };
    // // this.Utils.scriveLog('geo_lookup__sel 3', new Date().getTime());
    this.apiService.chiamataPost('operator_group__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);
      // // this.Utils.scriveLog('Ritorno:', data);
      this.datiOperatorGroup = data;
    }, error => {
      // alert(error);
    });
  }

  LeggeDatiMosaicStyle() {
    // // this.Utils.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_category": "AgnGroupFolder"' +
    '}';
    this.apiService.chiamataPost('geo_lookup__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // // this.Utils.scriveLog('Lista lookup:', data2);
      if (data2 && data2 !== null) {
        // // this.Utils.scriveLog('Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // // this.Utils.scriveLog('Mosaic Style:', data);
        this.datiAgnGroupFolder = data;
     } else {
        this.datiAgnGroupFolder = null; // 'empty grid';;
      }
    }, error => {
      // Utils.messaggioDiErrore(this.datiAgnGroupFolder, error);
      if (JSON.parse(error)._body) {
        this.datiAgnGroupFolder = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiAgnGroupFolder = 'ERROR: ' + error;
      }
    });
  }

  // vecchioQueryPck = '';

  letturaQueryPck() {
    if (!this.queryPck2 || this.queryPck2 === 'N') {
      return;
    }

    const nomeTabella = 'query_pck__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_query_pck_id: null
    };
    /* if (JSON.stringify(params) === this.vecchioQueryPck) {
      return;
    }
    this.vecchioQueryPck = JSON.stringify(params); */

    // this.datiGriglia = null; // 'empty grid';;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .subscribe((data: any) => {
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        this.datiQueryPck = data.DataTable;
        // // this.Utils.scriveLog(data);
      } else {
        this.datiQueryPck = null; // 'empty grid';;
      }
    }, error => {
      this.datiQueryPck = null; // 'empty grid';;
      // Utils.messaggioDiErrore(this.datiQueryPck, error);
      if (JSON.parse(error)._body) {
        this.datiQueryPck = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiQueryPck = 'ERROR: ' + error;
      }
    });
  }

  // vecchioAgnProf = '';

  letturaAgnProf() {
    const nomeTabella = 'agn_prof__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_prof_id: null
    };
    /*  if (JSON.stringify(params) === this.vecchioAgnProf) {
      return;
    }
    this.vecchioAgnProf = JSON.stringify(params);*/

    // this.datiGriglia = null; // 'empty grid';;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        this.datiAgnProf = data.DataTable;
        // // this.Utils.scriveLog(data);
      } else {
        this.datiAgnProf = null; // 'empty grid';;
      }
    }, error => {
      this.datiAgnProf = null; // 'empty grid';;
      // Utils.messaggioDiErrore(this.datiAgnProf, error);
      if (JSON.parse(error)._body) {
        this.datiAgnProf = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiAgnProf = 'ERROR: ' + error;
      }
    });
  }

  caricaTSID() {
    const nomeTabella = 'ts__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_filter_folder: ''
    };
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        // // this.Utils.scriveLog(data);
        this.datiTSID = new Array();
        if (data.DataTable) {
          data.DataTable.forEach(element => {
            const e = {
              TS_CODE: element.TS_CODE,
              NAME: element.NAME,
              FOLDER: element.FOLDER,
            };
            this.datiTSID.push(e);
          });
        }
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
  }

  // vecchioAgnGroupGrid = '';

  ultimoTmsAgentGroup;
  messaggioWarning = '';

  caricaTabella(daDove) {
    this.ultimoTmsAgentGroup = new Date().getTime();

    const nomeTabella = 'agn_group__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_filter_folder: '',
      v_agn_code_filter: this.searchAgnCode2,
      v_caller_tag: this.ultimoTmsAgentGroup
    };
    /* if (JSON.stringify(params) === this.vecchioAgnGroupGrid) {
      return;
    }
    this.vecchioAgnGroupGrid = JSON.stringify(params); */

    // logConsole('Carico agent group da ', daDove, params);

    this.caricamentoDatiInCorso = true;

    // this.rigaSelezionata = null;

    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso = false;
      this.Utils.scriveLog('Dati griglia', data);

      if (data && data !== null && data.DataTable && data.DataTable.length > 0) {
        Utils.checkRitornoChiamata(this, data);

        if (!this.controllaRitornoChiamata(this, data, 'Agent Group', this.ultimoTmsAgentGroup)) {
          return;
        }

        this.nomeGriglia = data.GridProperty[0].GridName;

        logConsole('Agent groups', data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning = data.v_grid_msg;
        } else {
          this.messaggioWarning = '';
        }

        if (this.datiGriglia && this.datiGriglia !== null && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
          && this.datiGriglia.DataTable.length > 1 && data.DataTable) {
            this.datiGriglia.DataTable = data.DataTable;
            this.pulisceTcRunInfoFile = new Date().toString();
            // logConsole('Aggiorno griglia Agent Group', data);
        } else {
          // this.datiGriglia = null; // 'empty grid';;
          // const tm = setTimeout(() => {
            // logConsole('Riempio griglia Agent Group', data);
            this.datiGriglia = JSON.parse(JSON.stringify(data));
            this.pulisceTcRunInfoFile = new Date().toString();
            // return;

            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.rigaSelezionata = this.datiGriglia.DataTable[0];

              this.effettuaAutoFit = !this.effettuaAutoFit;
            }, 500);
          // }, 1000);
        }

        /* const tm = setTimeout(() => {
          if (this.datiGriglia && this.datiGriglia.DataTable && this.datiGriglia.DataTable.length > 0) {
            this.agnGroupID = this.rigaSelezionata.ID;
            this.agnGroup = this.rigaSelezionata.ACT_SET_NAME;
            this.selezione = this.rigaSelezionata.ROW_ID;
            this.actSetIdScelto =  this.rigaSelezionata.ACT_SET_ID;
            this.actSetNameScelto =  this.rigaSelezionata.ACT_SET_NAME;
            this.stringaAGNCode = this.rigaSelezionata.ACT_SET_NAME;
            this.groupIdSelezionato = this.rigaSelezionata.ID;
            this.selezione4 = this.rigaSelezionata.ROW_ID;
            this.agnProfSelezionato = this.rigaSelezionata.AGN_PROF_ID;
            this.selezione5 = this.rigaSelezionata.ROW_ID;
            this.selezione6 = this.rigaSelezionata.ROW_ID;
            this.queryPckSelezionato = this.rigaSelezionata.QUERY_PCK_ID;
            this.selezione7 = this.rigaSelezionata.ROW_ID;
            this.dataAcquisitionSelezionato = this.rigaSelezionata.ID;
            this.selezione8 = this.rigaSelezionata.ROW_ID;

            this.Utils.scriveLog('Cambio agn_group_grid', this.rigaSelezionata);
            this.caricaSchedGrid(this.rigaSelezionata);
            this.caricaAgentGroup(this.groupIdSelezionato);
            this.caricaAgentsProfile(this.agnProfSelezionato);
            this.caricaTestDesign(this.agnGroupID);
            this.caricaQueryPCK(this.queryPckSelezionato);
            this.caricaDataAcquisition(this.dataAcquisitionSelezionato);
            this.caricaTestExecution();
            this.caricaTicket();
            this.caricaAgent1();
          } else {
            this.Utils.scriveLog('AZZERO 1');
            this.datiGrigliaTestScenario = 'empty grid';
            this.datiGrigliaTestScenario2 = null; // 'empty grid';
            this.datiGrigliaAgentsInfo = null; // 'empty grid';
            this.datiGrigliaAgentInfo = null; // 'empty grid';
            this.datiGrigliaTestExManDati = null; // 'empty grid';
            this.datiGrigliaActivityTS = null; // 'empty grid';
            // this.Utils.scriveLog('Pulisco griglia TcRun 3');
            this.datiGrigliaTcRun = null; // 'empty grid';
            this.datiGrigliaTicket = null; // 'empty grid';
            this.datiGrigliaAgent1 = null; // 'empty grid';
            this.Utils.scriveLog('AZZERO2 14');
            this.datiGrigliaAgent2 = null; // 'empty grid';
          }
        }, 1000); */
      } else {
        // this.datiGriglia = null;

        this.pulisceTcRunInfoFile = new Date().toString();
        this.datiGriglia = null; // 'empty grid';
        this.actSetIdScelto =  -1;
        this.actSetNameScelto =  'empty';
        this.agnGroupID = -1;
        this.agnGroup = -1;
        this.actSetNameFM = 'empty';
        this.stringaAGNCode = '';
        this.datiGrigliaTicket = null; // 'empty grid';
        this.datiGrigliaAgent1 = null; // 'empty grid';
        this.Utils.scriveLog('AZZERO2 15');
        this.datiGrigliaAgent2 = null; // 'empty grid';

        // this.Utils.scriveLog(this.additionalLayer2);
        // this.additionalLayer2 = this.additionalLayer;

        /* const tm = setTimeout(() => {
          this.coordinate = '12.4963655;41.9027835';
          // this.additionalLayer2 = JSON.parse(JSON.stringify(this.additionalLayer2));
        }, 5000); */
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      this.pulisceTcRunInfoFile = new Date().toString();
      // this.datiGriglia = null;
      /* Utils.messaggioDiErrore(this.datiGrigliaTestScenario, error);
      Utils.messaggioDiErrore(this.datiGrigliaTestScenario2, error);
      Utils.messaggioDiErrore(this.datiGrigliaAgentsInfo, error);
      Utils.messaggioDiErrore(this.datiGrigliaAgentInfo, error); */
      // console.error(error);
      this.Utils.scriveLog('AZZERO 2');
      if (JSON.parse(error)._body) {
        this.datiGrigliaTestScenario = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        this.datiGrigliaTestScenario2 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        this.datiGrigliaAgentsInfo = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        this.datiGrigliaAgentInfo = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        this.datiGrigliaTestExManDati = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiGrigliaTestScenario = 'ERROR: ' + error;
        this.datiGrigliaTestScenario2 = 'ERROR: ' + error;
        this.datiGrigliaAgentsInfo = 'ERROR: ' + error;
        this.datiGrigliaAgentInfo = 'ERROR: ' + error;
        this.datiGrigliaTestExManDati = 'ERROR: ' + error;
      }
      // this.Utils.scriveLog('Pulisco griglia TcRun 4');
      this.datiGrigliaTcRun = null; // 'empty grid';
      this.datiGrigliaTicket = null; // 'empty grid';
      this.datiGrigliaAgent1 = null; // 'empty grid';
      this.datiGrigliaAgent2 = null; // 'empty grid';
    });
  }

  vecchioTicket = '';
  ultimoTmsTicket = -1;
  messaggioWarningTicket = '';

  caricaTicket() {
    /* if (!this.rigaSelezionata) {
      return;
    } */
    // const min = this.datiGrafico.Tms + ' 00:00:00';
    // const max = this.datiGrafico.Tms + ' 23:59:59';

    const nomeTabella = 'geo_ticket__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_act_set_name_list: null, // this.rigaSelezionata.ACT_SET_NAME,
      v_bbox: null,
      v_tms_max: null,
      v_tms_min: null,
      v_tc_name: null,
      v_result: null,
      v_ts_name: null
    };
    if (JSON.stringify(params) === this.vecchioTicket) {
      return;
    }
    this.vecchioTicket = JSON.stringify(params);

    this.Utils.scriveLog('Carica ticket', params);
    // return;

    this.caricamentoDatiInCorsoTicket = true;
    this.keyWorkspaceVisibileTicket = false;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);

      this.caricamentoDatiInCorsoTicket = false;
      // this.Utils.scriveLog(data2);

      if (new Date(data2.v_req_tms).getTime() < this.ultimoTmsTicket) {
        return;
      }
      this.ultimoTmsTicket = new Date(data2.v_req_tms).getTime();

      if (data2 && data2 !== null && data2.v_grid_msg !== undefined) {
        this.messaggioWarningTicket = data2.v_grid_msg;
      } else {
        this.messaggioWarningTicket = '';
      }

      const dataD = data2;
      if (dataD && dataD !== null && dataD.DataTable && dataD.DataTable.length > 0) {
        this.Utils.scriveLog('Dati griglia Ticket', dataD, this.datiGrigliaTicket);
        this.nomeGrigliaTicket = dataD.GridProperty[0].GridName;

        if (this.datiGrigliaTicket && this.datiGrigliaTicket !== null && this.datiGrigliaTicket !== 'empty grid' && this.datiGrigliaTicket.DataTable
          && this.datiGrigliaTicket.DataTable.length > 1 && dataD.DataTable) {
            this.datiGrigliaTicket.DataTable = dataD.DataTable;
            // this.Utils.scriveLog('Aggiorno griglia tc run');
        } else {
          // this.Utils.scriveLog('Riempio griglia tc run');
          this.datiGrigliaTicket = JSON.parse(JSON.stringify(dataD));
          const tm = setTimeout(() => {
            clearTimeout(tm);
            // return;

            this.effettuaAutoFitTicket = !this.effettuaAutoFitTicket;

            // this.selezioneTEMd = this.datiGrigliaTestExManDati.DataTable[0];
          }, 10);
        }
      } else {
        // this.Utils.scriveLog('Pulisco griglia TcRun 5', dataD);
        this.datiGrigliaTicket = null; // 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorsoTicket = false;
      // this.Utils.scriveLog(error);
      try {
        if (JSON.parse(error)._body) {
          const ee = JSON.parse(error._body);
          this.datiGrigliaTicket = 'ERROR: ' + ee.message;
        } else {
          this.datiGrigliaTicket = 'ERROR: ' + error;
        }
      } catch (e) {

      }
    });
  }

  // vecchioTCRUN = '';
  vecchiaStrutturaTCRUN2;
  messaggioWarningTcRun = '';

  caricaTcRun(nonDaGrafico, daActivities) {
    this.oldDaScenario = nonDaGrafico;
    this.oldDaActivities = daActivities;

    if (nonDaGrafico === false && !this.datiGrafico) {
      return;
    }
    // alert('tcrun: ' + this.tabAperto);

    let min;
    let max;
    let act_set_name;
    let tc_name;
    let ts_name;

    if (nonDaGrafico === false) {
      min = this.datiGrafico.Tms + ' 00:00:00';
      max = this.datiGrafico.Tms + ' 23:59:59';
      act_set_name = this.datiGrafico.RigaSelezionata.ACT_SET_NAME;
      tc_name = this.datiGrafico.RigaSelezionata.TC_NAME;
      ts_name = this.datiGrafico.RigaSelezionata.TS_SCHED_NAME;
    } else {
      // this.Utils.scriveLog(this.rigaSelezionata2);
      const inizio = new Date();
      const quanti = +this.lastDays;
      const fine = new Date(inizio.getTime() - (quanti * 24 * 60 * 60 * 1000));
      max = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
      min = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

      let asn;
      let tsn;

      this.Utils.scriveLog(this.RigaSelezioneActivityTS);

      if (this.RigaSelezioneActivityTS[0]) {
        asn = this.RigaSelezioneActivityTS[0].ACT_CODE;
      } else {
        asn = this.RigaSelezioneActivityTS.ACT_CODE;
      }
      if (this.rigaSelezionata2[0]) {
        tsn = this.rigaSelezionata2[0].TS_SCHED_NAME;
      } else {
        tsn = this.rigaSelezionata2.TS_SCHED_NAME;
      }

      act_set_name = '[ACT] ' + asn;
      tc_name = null;
      ts_name = tsn;
      // return;
    }

    let misureAddizionali = '';
    if (this.MisureTCRun2) {
      this.MisureTCRun2.forEach(element => {
        if (element) {
          misureAddizionali += element + ',';
        }
      });
    }
    if (misureAddizionali.length > 0) {
      misureAddizionali = misureAddizionali.substring(0, misureAddizionali.length - 1);
    }

    const nomeTabella = 'geo_tc_run__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_act_set_name_list: act_set_name,
      v_bbox: null,
      v_tms_max: max,
      v_tms_min: min,
      v_tc_name: tc_name,
      v_result: null,
      v_ts_name: ts_name,
      v_additional_event_measure: misureAddizionali,
      v_cluster_set_name: null
    };
    /* if (JSON.stringify(params) === this.vecchioTCRUN) {
      return;
    }
    this.vecchioTCRUN = JSON.stringify(params); */

    this.Utils.scriveLog(params);
    // return;

    this.caricamentoDatiInCorsoTcRun = true;
    this.keyWorkspaceVisibileTcRun = false;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);

      this.caricamentoDatiInCorsoTcRun = false;
      // this.Utils.scriveLog('Dati tc run', data2);

      if (data2 && data2 !== null && data2.v_grid_msg !== undefined) {
        this.messaggioWarningTcRun = data2.v_grid_msg;
      } else {
        this.messaggioWarningTcRun = '';
      }

      const dataD = data2;
      if (dataD && dataD !== null && dataD.DataTable && dataD.DataTable.length > 0) {
        this.Utils.scriveLog('Dati griglia TcRun', dataD, this.datiGrigliaTcRun);
        // this.Utils.scriveLog('Dati colonne TcRun', dataD.ColumnProperty);
        // this.Utils.scriveLog('Colonne diverse TcRun', this.vecchiaStrutturaTCRUN2, JSON.stringify(dataD.ColumnProperty));
        this.nomeGrigliaTcRun = dataD.GridProperty[0].GridName;

        if (this.datiGrigliaTcRun && this.datiGrigliaTcRun !== null && this.datiGrigliaTcRun !== 'empty grid' && 
          this.datiGrigliaTcRun.DataTable
          && dataD.DataTable && this.vecchiaStrutturaTCRUN2 === JSON.stringify(dataD.ColumnProperty)) {
            this.datiGrigliaTcRun.DataTable = dataD.DataTable;
            this.Utils.scriveLog('Aggiorno griglia tcrun');
        } else {
          this.Utils.scriveLog('Riempio griglia tcrun');
          this.datiGrigliaTcRun = null; // 'empty grid';;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.vecchiaStrutturaTCRUN2 = JSON.stringify(dataD.ColumnProperty);
            this.datiGrigliaTcRun = dataD;
            // return;
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              this.effettuaAutoFitTcRun = !this.effettuaAutoFitTcRun;
            }, 1000);

            // this.selezioneTEMd = this.datiGrigliaTestExManDati.DataTable[0];
          }, 10);
        }
      } else {
        // this.Utils.scriveLog('Pulisco griglia TcRun 5', dataD);
        this.datiGrigliaTcRun = null; // 'empty grid';
      }
    }, error => {
      if (JSON.parse(error)._body) {
        this.datiGrigliaTcRun = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiGrigliaTcRun = 'ERROR: ' + error;
      }
    });
  }

  getDifference(a, b)
  {
      var i = 0;
      var j = 0;
      var result = "";

      while (j < b.length)
      {
        if (result === '') {
          if (a[i] != b[j] || i == a.length)
              result += j + '->' + b[j];
          else
              i++;
        }
        j++;
      }
      return result;
  }

  // vecchioTCRUNAct = '';
  vecchiaStrutturaTCRUN3;
  pulisceTcRunInfoFile = '';
  messaggioWarningTcRunAct = '';

  caricaTcRunAct() {
    // alert('tcrun act: ' + this.tabAperto);

    let min;
    let max;
    let act_set_name;
    let tc_name;
    let ts_name;

    const inizio = new Date();
    const quanti = +this.lastDays;
    const fine = new Date(inizio.getTime() - (quanti * 24 * 60 * 60 * 1000));
    max = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    min = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    
    if (this.rigaSelezionataDataAcquisition2[0]) {
      act_set_name = this.rigaSelezionataDataAcquisition2[0].ACT_SET_NAME;
    } else {
      act_set_name = this.rigaSelezionataDataAcquisition2.ACT_SET_NAME;
    }
    tc_name = null;
    ts_name = null; // this.rigaSelezionataDataAcquisition2[0].TS_SCHED_NAME;
    // logConsole('Act set name per tcrun', this.rigaSelezionataDataAcquisition2, act_set_name);
    if (!act_set_name) {
      return;
    }

    let misureAddizionali = '';
    if (this.MisureTCRun2) {
      this.MisureTCRun2.forEach(element => {
        if (element) {
          misureAddizionali += element + ',';
        }
      });
    }
    if (misureAddizionali.length > 0) {
      misureAddizionali = misureAddizionali.substring(0, misureAddizionali.length - 1);
    }

    const nomeTabella = 'geo_tc_run__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_act_set_name_list: act_set_name,
      v_bbox: null,
      v_tms_max: max, // Mail FTRA 23/06/2022 10:33
      v_tms_min: min, // Mail FTRA 23/06/2022 10:33
      v_tc_name: tc_name,
      v_result: null,
      v_ts_name: ts_name,
      v_additional_event_measure: misureAddizionali,
      v_cluster_set_name: null
    };
    /* if (JSON.stringify(params) === this.vecchioTCRUNAct) {
      return;
    }
    this.vecchioTCRUNAct = JSON.stringify(params); */

    this.Utils.scriveLog(params);
    // return;

    this.caricamentoDatiInCorsoTcRunAct = true;
    this.keyWorkspaceVisibileTcRunAct = false;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);

      this.caricamentoDatiInCorsoTcRunAct = false;
      // this.Utils.scriveLog(data2);

      if (data2 && data2 !== null && data2.v_grid_msg !== undefined) {
        this.messaggioWarningTcRunAct = data2.v_grid_msg;
      } else {
        this.messaggioWarningTcRunAct = '';
      }

      const dataD = data2;
      if (dataD && dataD !== null && dataD.DataTable && dataD.DataTable.length > 0) {
        this.Utils.scriveLog('Dati griglia TcRunAct', dataD, this.datiGrigliaTcRunAct);
        this.nomeGrigliaTcRunAct = dataD.GridProperty[0].GridName;

        /* if (this.vecchiaStrutturaTCRUN3) {
          // logConsole(this.vecchiaStrutturaTCRUN3);
          // logConsole(JSON.stringify(dataD.ColumnProperty));
          // logConsole(this.getDifference(this.vecchiaStrutturaTCRUN3, JSON.stringify(dataD.ColumnProperty)));
        } */

        if (this.datiGrigliaTcRunAct && this.datiGrigliaTcRunAct !== null && this.datiGrigliaTcRunAct !== 'empty grid' && this.datiGrigliaTcRunAct.DataTable
          && dataD.DataTable && this.vecchiaStrutturaTCRUN3 === JSON.stringify(dataD.ColumnProperty)) {
            this.datiGrigliaTcRunAct.DataTable = dataD.DataTable;
            this.pulisceTcRunInfoFile = new Date().toString();
            this.Utils.scriveLog('Aggiorno griglia tc run act');
        } else {
          this.vecchiaStrutturaTCRUN3 = JSON.stringify(dataD.ColumnProperty);
          this.Utils.scriveLog('Riempio griglia tc run act');
          // this.datiGrigliaTcRunAct = undefined;
          this.datiGrigliaTcRunAct = dataD;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            // return;

            this.pulisceTcRunInfoFile = new Date().toString();
            this.effettuaAutoFitTcRunAct = !this.effettuaAutoFitTcRunAct;

            // this.selezioneTEMd = this.datiGrigliaTestExManDati.DataTable[0];
          }, 500);
        }
      } else {
        // this.Utils.scriveLog('Pulisco griglia TcRun 5', dataD);
        this.datiGrigliaTcRunAct = null; // 'empty grid';
        this.pulisceTcRunInfoFile = new Date().toString();
        this.vecchiaStrutturaTCRUN3 = undefined;
      }
    }, error => {
      this.vecchiaStrutturaTCRUN3 = undefined;
      this.pulisceTcRunInfoFile = new Date().toString();
      if (JSON.parse(error)._body) {
        this.datiGrigliaTcRunAct = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiGrigliaTcRunAct = 'ERROR: ' + error;
      }
    });
  }

  // vecchioTCRunMon = '';
  ultimoTmsTcRunMonGrid = -1;

  caricaTestExecution() {
    if (!this.rigaSelezionata || this.rigaSelezionata === null) {
      return;
    }

    const inizio = new Date();
    const quanti = +this.lastDays;
    const fine = new Date(inizio.getTime() - (quanti * 24 * 60 * 60 * 1000));
    const min = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    const max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    const nomeTabella = 'geo_tc_run__mon_grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_act_set_name_list: this.rigaSelezionata.ACT_SET_NAME,
      v_bbox: '(ALL)',
      v_tms_max: min,
      v_tms_min: max
    };
    /* if (JSON.stringify(params) === this.vecchioTCRunMon) {
      return;
    }
    this.vecchioTCRunMon = JSON.stringify(params); */

    this.caricamentoDatiInCorsoTEMd = true;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);

      if (new Date(data2.v_req_tms).getTime() < this.ultimoTmsTcRunMonGrid) {
        return;
      }
      this.ultimoTmsTcRunMonGrid = new Date(data2.v_req_tms).getTime();

      this.caricamentoDatiInCorsoTEMd = false;
      // this.Utils.scriveLog(data2);

      if (data2 && data2 !== null && data2[1] && data2[1].trend && data2[1].trend.DataTable && data2[1].trend.DataTable.length > 0) {
        const dataD = data2[1].trend;
        this.Utils.scriveLog('Dati griglia TEMd', dataD);
        this.nomeGrigliaTEMd = dataD.GridProperty[0].GridName;

        /* if (this.datiGrigliaTestExManDati && this.datiGrigliaTestExManDati !== null && this.datiGrigliaTestExManDati !== 'empty grid' && this.datiGrigliaTestExManDati.DataTable
          && this.datiGrigliaTestExManDati.DataTable.length > 1 && dataD.DataTable) {
            this.datiGrigliaTestExManDati.DataTable = JSON.parse(JSON.stringify(dataD.DataTable));
        } else { */
          this.datiGrigliaTestExManDati = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            // return;

            this.datiGrigliaTestExManDati = JSON.parse(JSON.stringify(dataD));
            this.effettuaAutoFitTEMd = !this.effettuaAutoFitTEMd;

            // this.selezioneTEMd = this.datiGrigliaTestExManDati.DataTable[0];
            // this.Utils.scriveLog('Pulisco griglia TcRun 1', dataD);
            this.datiGrigliaTcRun = null; // 'empty grid';
          }, 500);
        // }
      } else {
        // this.Utils.scriveLog('Pulisco griglia TcRun 2', dataD);
        this.datiGrigliaTestExManDati = null; // 'empty grid';
        this.datiGrigliaTcRun = null; // 'empty grid';
      }
    }, error => {
      // console.error(error);
      if (JSON.parse(error)._body) {
        this.datiGrigliaTestExManDati = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiGrigliaTestExManDati = 'ERROR: ' + error;
      }
    });
  }

  clickSuGrafico(e) {
    this.Utils.scriveLog('Click su grafico', e);
    this.datiGrafico = e;
    this.pulisceTcRunInfoFile3 = new Date().toString();
    this.caricaTcRun(false, false);
  }

  selezionatiTcRun3 = false;

  premutoCheckTcRunAct(e) {
    this.Utils.scriveLog('Click su check griglia TcRunAct', e);
    if (e && e.dati && e.dati.length > 0) {
      this.selezionatiTcRun3 = true;
    } else {
      this.selezionatiTcRun3 = false;
    }
  }

  oldCoordinate;
  actId4;
  refreshTcRunInfoFile4;

  clickTcRunAct(ee) {
    const e = [ee];
    this.rigaSelezionataTcRun4 = e[0].ACT_SET_NAME;
    this.ricaricaTcRun4 = e[0].TMS;
    this.rigaSelezionataTcRun42 = e[0].TC_RUN_ID;
    this.actId4 = '[ACT ID] ' + e[0].ACT_ID;
    // logConsole('Click su tcrun', e, this.actId4);

    this.selezioneTcRunAct = e;
    this.keyWorkspaceVisibileTcRunAct = true;
    this.Utils.scriveLog('Click su griglia TcRunAct', e);

    let inizio = e[0].START_TIME_STAMP_SELECTED;
    /* const i = inizio.split('.');
    inizio = i[0] + ':' + i[1] + ':' + i[2] + '.' + i[3]; */
    const inizioS = inizio;
    inizio = new Date(inizio).getTime();
    // inizio -= 2000;

    let fine = e[0].END_TIME_STAMP_SELECTED;
    /* const f = fine.split('.');
    fine = f[0] + ':' + f[1] + ':' + f[2] + '.' + f[3]; */
    const fineS = fine;
    // fine += 2000;

    const min = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS');
    const max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');
    this.Utils.scriveLog(min, max);

    if (e && e[0] && e[0].ACT_SET_NAME) {
      // this.agnGroup = e[0].ACT_SET_NAME;

      // this.coordinate = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);
        let c = e[0].GEO_POS;
        if (c && c !== null) {
          c = c.replace('POINT(', '').replace(')', '').replace(' ', ';');
          if (this.oldCoordinate === c) {
            const cc = c.split(';');
            cc[1] += '0';
            c = cc[0] + ';' + cc[1];
          }
          this.oldCoordinate = c;
          this.Utils.scriveLog(c);
          this.coordinate = c;
        }

        this.tmsPassatiTcRun = e[0].START_TIME_STAMP_SELECTED + ';' + e[0].END_TIME_STAMP_SELECTED;

        this.refreshTcRunInfoFile4 = new Date().toString();
      }, 1000);
    }

    const nomeTabella = 'operator_obj_sync_my__upd';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_ds_name: e[0].ACT_SET_NAME,
      v_agn_code: e[0].AGN_CODE,
      v_ds_tms_min: min,
      v_ds_tms_max: max,
      v_dsg_tms_min: inizioS,
      v_dsg_tms_max: fineS,
      v_tms_curr: inizioS
    };

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);
    });
  }

  premutoCheckTcRun(e) {
    this.Utils.scriveLog('Click su check griglia TcRun', e);
  }

  actId3;
  refreshTcRunInfoFile3;

  clickTcRun(ee) {
    let e = ee; 
    if (!e[0]) { e = [e]; };
    logConsole('Tcrun premuto', e);
    this.rigaSelezionataTcRun2 = e[0].ACT_SET_NAME;
    this.rigaSelezionataTcRun3 = e[0].ACT_SET_NAME;
    this.rigaSelezionataTcRun22 = e[0].TC_RUN_ID;
    this.rigaSelezionataTcRun32 = e[0].TC_RUN_ID;
    this.ricaricaTcRun2 = e[0].TMS;
    this.ricaricaTcRun3 = e[0].TMS;
    this.selezioneTcRun = e;
    this.keyWorkspaceVisibileTcRun = true;
    this.actId3 = '[ACT ID] ' + e[0].ACT_ID;
    this.Utils.scriveLog('Click su griglia TcRun', e);

    let inizio = e[0].START_TIME_STAMP_SELECTED;
    /* const i = inizio.split('.');
    inizio = i[0] + ':' + i[1] + ':' + i[2] + '.' + i[3]; */
    const inizioS = inizio;
    inizio = new Date(inizio).getTime();
    inizio -= 2000;

    let fine = e[0].END_TIME_STAMP_SELECTED;
    /* const f = fine.split('.');
    fine = f[0] + ':' + f[1] + ':' + f[2] + '.' + f[3]; */
    const fineS = fine;
    fine += 2000;

    const min = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS');
    const max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');
    this.Utils.scriveLog(min, max);

    if (e && e[0] && e[0].ACT_SET_NAME) {
      // this.agnGroup = e[0].ACT_SET_NAME;

      // this.coordinate = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);
        let c = e[0].GEO_POS;
        if (c && c !== null) {
          c = c.replace('POINT(', '').replace(')', '').replace(' ', ';');
          if (this.oldCoordinate === c) {
            const cc = c.split(';');
            cc[1] += '0';
            c = cc[0] + ';' + cc[1];
          }
          this.oldCoordinate = c;
          this.Utils.scriveLog(c);
          this.coordinate = c;
        }

        this.tmsPassatiTcRun = e[0].START_TIME_STAMP_SELECTED + ';' + e[0].END_TIME_STAMP_SELECTED;

        this.refreshTcRunInfoFile3 = new Date().toString();
      }, 1000);
    }

    const nomeTabella = 'operator_obj_sync_my__upd';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_ds_name: e[0].ACT_SET_NAME,
      v_agn_code: e[0].AGN_CODE,
      v_ds_tms_min: min,
      v_ds_tms_max: max,
      v_dsg_tms_min: inizioS,
      v_dsg_tms_max: fineS,
      v_tms_curr: inizioS
    };

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);
    });
  }

  lastSelectedOfGridTcRun(e) {

  }

  refreshGridTcRun(e, r) {
    // this.vecchioTCRUN = '';
    if (r === true) {
      this.datiGrigliaTcRun = undefined;
    }
    this.caricaTcRun(this.oldDaScenario, this.oldDaActivities);
  }

  refreshGridTcRunAct(e, r) {
    // this.vecchioTCRUNAct = '';
    if (r === true) {
      this.datiGrigliaTcRunAct = undefined;
    }
    this.caricaTcRunAct();
  }

  actId2;
  refreshTcRunInfoFile2;

  clickTicket(e) {
    this.rigaSelezionataTcRun5 = e[0].ACT_SET_NAME;
    this.ricaricaTcRun5 = e[0].TMS;
    this.rigaSelezionataTcRun52 = e[0].TC_RUN_ID;
    this.selezioneTicket = e;
    this.keyWorkspaceVisibileTicket = true;
    this.actId2 = '[ACT ID] ' + e[0].ACT_ID;

    let inizio = e[0].START_TIME_STAMP;
    /* const i = inizio.split('.');
    inizio = i[0] + ':' + i[1] + ':' + i[2] + '.' + i[3]; */
    const inizioS = inizio;
    inizio = new Date(inizio).getTime();
    inizio -= 30000;

    let fine = e[0].END_TIME_STAMP
    ;
    /* const f = fine.split('.');
    fine = f[0] + ':' + f[1] + ':' + f[2] + '.' + f[3]; */
    const fineS = fine;
    fine += 30000;

    // logConsole('Click su griglia Ticket', e[0], inizio, fine);
    const min = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS');
    const max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');
    this.Utils.scriveLog(min, max);

    if (e && e[0] && e[0].ACT_ID) {
      this.agnGroup = '[ACT ID] ' + e[0].ACT_ID;

      // this.coordinate = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);
        let c = e[0].GEO_POS;
        if (c && c !== null) {
          c = c.replace('POINT(', '').replace(')', '').replace(' ', ';');
          if (this.oldCoordinate === c) {
            const cc = c.split(';');
            cc[1] += '0';
            c = cc[0] + ';' + cc[1];
          }
          this.oldCoordinate = c;
          this.Utils.scriveLog(c);
          this.coordinate = c;
        }

        this.tmsPassati = min + ';' + max;
        this.tmsPassatiTcRun =  e[0].START_TIME_STAMP_SELECTED + ';' + e[0].END_TIME_STAMP_SELECTED;

        this.refreshTcRunInfoFile2 = new Date().toString();
      }, 1000);
    }

    const nomeTabella = 'operator_obj_sync_my__upd';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_ds_name: e[0].ACT_SET_NAME,
      v_agn_code: e[0].AGN_CODE,
      v_ds_tms_min: min,
      v_ds_tms_max: max,
      v_dsg_tms_min: inizioS,
      v_dsg_tms_max: fineS,
      v_tms_curr: inizioS
    };

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);
    });
  }

  lastSelectedOfGridTicket(e) {

  }

  refreshGridTicket(e, r) {
    this.vecchioTicket = '';
    if (r === true) {
      this.datiGrigliaTicket = undefined;
    }
    this.caricaTicket();
  }

  clickTEMDati(e) {
    this.selezioneTEMd = e.ROW_ID;
    this.Utils.scriveLog('Click su griglia TEMd', e);
  }

  lastSelectedOfGridTestExecutionManagerDati(e) {

  }

  refreshGridTestExecutionManagerDati(e, r) {
    // this.vecchioTCRunMon = '';
    if (r === true) {
      this.datiGrigliaTestExManDati = undefined;
    }
    this.caricaTestExecution();
  }

  clickSelezione(ee) {
    this.pulisceListaActSet();

    // this.Utils.scriveLog('Click selezione', ee);
    let e;
    if (ee.ROW_ID !== undefined) {
      e = ee;
    } else {
      if (ee[0] !== undefined && ee[0].ID !== undefined) {
        e = ee[0];
      } else {
        // this.Utils.scriveLog('Errore sul click:', ee);
      }
    }

    const t1 = new Date().getTime() - (this.lastDays2 * 24 * 60 * 60 * 1000);
    const sInizio = this.datePipe.transform(t1, 'yyyy-MM-dd HH:mm:ss.SSS'); // , 'UTC'
    const t2 = new Date().getTime() + (24 * 60 * 60 * 1000);
    const sFine = this.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:ss.SSS'); // , 'UTC'
    this.tmsPassati = sInizio + ';' + sFine;

    this.rigaSelezionata = e;
    logConsole('Click agent', e);
    this.Utils.scriveLog('Click su prima griglia', e);
    let id;
    // if (e.ROW_ID) {
    const riga = e;
    this.rigaSelezionata = e;
    this.agnGroupID = e.ID;
    this.agnProfSelezionato = e.AGN_PROF_ID;
    this.queryPckSelezionato = e.QUERY_PCK_ID;
    id = e.ID;
    this.actSetIdScelto = e.ACT_SET_ID;
    this.actSetNameScelto = e.ACT_SET_NAME;
    this.agnGroup = e.ACT_SET_NAME;
    this.stringaAGNCode = e.ACT_SET_NAME;
    this.groupIdSelezionato = e.ID;

    this.pulisceTcRunInfoFile1 = new Date().toString();
    this.pulisceTcRunInfoFile = new Date().toString();
    this.pulisceTcRunInfoFile3 = new Date().toString();
    
    this.caricaSchedGrid(riga);
    this.Utils.scriveLog(this.datiGriglia);
    this.refreshMappa = !this.refreshMappa;

    this.datiGrigliaTestScenario2 = null; // 'empty grid';
    this.datiGrigliaAgentInfo = null; // 'empty grid';

    this.Utils.scriveLog('Group ID:', this.groupIdSelezionato);
    // this.caricaAgentGroup(this.groupIdSelezionato);
    // this.Utils.scriveLog(this.datiGrigliaAgentsInfo);

    this.caricaAgentsProfile(this.agnProfSelezionato);
    this.Utils.scriveLog(this.datiGrigliaAgentProfile);

    this.caricaTestDesign(this.agnGroupID);
    this.Utils.scriveLog(this.datiGrigliaTestScenario);

    this.caricaQueryPCK(this.queryPckSelezionato);
    this.Utils.scriveLog(this.datiGriglia);

    this.caricaDataAcquisition(this.groupIdSelezionato);
    this.Utils.scriveLog(this.datiGrigliaDataAcquisition);

    this.caricaTestExecution();
    this.caricaTicket();

    /* this.datiGrigliaAgent1 = null; // 'empty grid';
    this.datiGrigliaAgent2 = null; // 'empty grid';
    this.datiGrigliaHistGrid = null; // 'empty grid'; */

    this.caricaAgent1();
    /* const tm = setTimeout(() => {
      this.refreshGridAgentsInfo(null);
    }, 100); */
  }

  lastSelectedOfGrid(e) {

  }

  refreshGrid1(e, r) {
    // this.vecchioAgnGroupGrid = '';
    if (r === true) {
      this.datiGriglia = undefined;
    }
    this.caricaTabella('Refresh grid 1');
  }

  // vecchioSched = '';

  ultimoTmsTsSchedGrid = -1;
  messaggioWarningTestScenario = '';

  caricaSchedGrid(e) {
    // // this.Utils.scriveLog(e);
    let agnID;
    if (e.ID !== undefined) {
      agnID = e.ID;
    } else {
      if (e[0].ID !== undefined) {
        agnID = e[0].ID;
      }
    }
    // // this.Utils.scriveLog(agnID);
    this.ultimoTmsTsSchedGrid = new Date().getTime();

    const nomeTabella = 'ts_sched__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_group_id: agnID,
      v_ts_type: 'Remote',
      v_caller_tag: this.ultimoTmsTsSchedGrid
    };
    /* if (JSON.stringify(params) === this.vecchioSched) {
      return;
    }
    this.vecchioSched = JSON.stringify(params); */
    // // this.Utils.scriveLog('Lettura ts sched grid', params);

    this.tastoEdit2 = false;
    this.tastoDelete2 = false;
    this.caricamentoDatiInCorso2 = true;

    this.datiGrigliaActivityTS = null; // 'empty grid';

    // this.datiGrigliaTestScenario = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso2 = false;
      // this.Utils.scriveLog('Dati griglia sched', data, this.datiGrigliaTestScenario);
      if (data && data.DataTable) {
        Utils.checkRitornoChiamata(this, data);

        if (!this.controllaRitornoChiamata(this, data, 'TsSchedGrid', this.ultimoTmsTsSchedGrid)) {
          return;
        }

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningTestScenario = data.v_grid_msg;
        } else {
          this.messaggioWarningTestScenario = '';
        }

        this.nomeGriglia2 = data.GridProperty[0].GridName;

        if (this.datiGrigliaTestScenario && this.datiGrigliaTestScenario !== 'empty grid' && this.datiGrigliaTestScenario.DataTable
          && data.DataTable) {
            // logConsole('Aggiorna griglia test scenario', data);
            this.datiGrigliaTestScenario.DataTable = data.DataTable;
            // this.datiGriglia3 = null; // 'empty grid';
        } else {
          // const tm = setTimeout(() => {
            // logConsole('Creo griglia test scenario', data);

            this.datiGrigliaTestScenario = data;
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.effettuaAutoFitTS = !this.effettuaAutoFitTS;

              this.datiGrigliaTcRun = 'empty grid';
              this.datiGrigliaTestScenario2 = null; // 'empty grid';
              this.datiGrigliaActivityTS = 'empty grid';

              if (this.datiGrigliaTestScenario && this.datiGrigliaTestScenario.DataTable &&
                this.datiGrigliaTestScenario.DataTable.length > 0) {
                this.rigaSelezionata2 = this.datiGrigliaTestScenario.DataTable[0];
                this.tastoEdit2 = true;
                this.tastoDelete2 = true;
                // this.selezione2 = this.rigaSelezionata2.ROW_ID;
                // this.Utils.scriveLog('Cambio ts_sched_grid', this.rigaSelezionata2);
                // this.caricaInfoGrid(this.rigaSelezionata2);

                // this.Utils.scriveLog('Carico tcrun test scenario', this.rigaSelezionata2)
                // this.caricaTcRun(true, false);
              // } else {
              //   this.datiGrigliaTestScenario2 = null; // 'empty grid';
              //   this.datiGrigliaTcRun = null; // 'empty grid';
              }
            }, 500);
            // }, 10);
        }
      } else {
        // logConsole('Pulisco griglie test scenario');
        this.datiGrigliaTestScenario = null; // JSON.parse(JSON.stringify(data));
        this.datiGrigliaTestScenario2 = null; // JSON.parse(JSON.stringify(data));
        this.datiGrigliaTcRun = null; // JSON.parse(JSON.stringify(data));
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      this.datiGrigliaTestScenario = 'empty grid';
      this.datiGrigliaTcRun = null; // 'empty grid';
      this.datiGrigliaActivityTS = null; // 'empty grid';
      // this.datiGrigliaTcRun = null;
      // Utils.messaggioDiErrore(this.datiGrigliaTestScenario, error);
      // Utils.messaggioDiErrore(this.datiGrigliaTestScenario2, error);
      if (JSON.parse(error)._body) {
        this.datiGrigliaTestScenario = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        this.datiGrigliaTestScenario2 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiGrigliaTestScenario = 'ERROR: ' + error;
        this.datiGrigliaTestScenario2 = 'ERROR: ' + error;
      }
    });
  }

  clickSelezioneTestScenario(e) {
    logConsole('Click test scenario', e);
    this.righeSelezionateTS = undefined;
    this.pulisceTcRunInfoFile3 = new Date().toString();

    if (e && !e[0]) { e = [e]; }
    this.rigaSelezionata2 = e;
    this.tastoEdit2 = true;
    this.tastoDelete2 = true;
    // this.Utils.scriveLog(e[0]);

    if (e[0].GEO_POS) {
      this.coordinate = e[0].GEO_POS.replace('POINT(', '').replace(')', '').replace(' ', ';');
    }

    if (e[0].REPLAY_ENABLED) {
      this.replayVisibile = e[0].REPLAY_ENABLED === 'Y' ? true : false;
    }

    this.Utils.scriveLog('Click su test scenario', e, this.coordinate);
    // this.stringaAGNCode = e[0].ACT_SET_NAME;
    // this.agnGroup = e[0].ACT_SET_NAME;

    // this.caricaInfoGrid(e[0]);
    this.caricaInfoGrid(e[0]);

    // this.rigaSelezionata2 = e;
    // this.caricaTcRun(true, false);
    this.caricaActivityTS();
  }

  clickSelezioneTestScenario2(e) {
    this.rigaSelezionata2 = e;
    this.tastoEdit2 = true;
    this.tastoDelete2 = true;
    // this.Utils.scriveLog(e[0]);

    if (e[0].GEO_POS) {
      this.coordinate = e[0].GEO_POS.replace('POINT(', '').replace(')', '').replace(' ', ';');
    }

    if (e[0].REPLAY_ENABLED) {
      this.replayVisibile = e[0].REPLAY_ENABLED === 'Y' ? true : false;
    }

    this.Utils.scriveLog('Click su test scenario', e, this.coordinate);
    // this.stringaAGNCode = e[0].ACT_SET_NAME;
    // this.agnGroup = e[0].ACT_SET_NAME;
    // this.caricaInfoGrid(e[0]);
    this.caricaTcRun(true, false);
  }

  lastSelectedOfGridTestScenario(e) {

  }

  refreshGridTestScenario(e, r) {
    // // this.Utils.scriveLog(this.rigaSelezionata);
    // this.vecchioSched = '';
    if (r === true) {
      this.datiGrigliaTestScenario = undefined;
    }
    this.caricaSchedGrid(this.rigaSelezionata);
  }

  // vecchioSchedInfo = '';
  ultimoTmsTsSchedInfoGrid2 = -1;
  messaggioWarningTestScenario2 = '';

  caricaInfoGrid(e) {
    // this.Utils.scriveLog('Carica info grid', e);
    const nomeTabella = 'ts_sched_info__grid';
    /* let codice;
    if (e.AGN_GROUP_ID && e.AGN_GROUP_ID !== '' && e.AGN_GROUP_ID !== null) {
      codice = e.AGN_GROUP_ID;
    } else {
      codice = this.rigaSelezionata.ACT_SET_NAME;
    } */
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_ts_sched_id: e.TS_SCHED_ID,
      v_mode: 'standard',
      v_caller_tag: this.ultimoTmsTsSchedInfoGrid2
    };
    /* if (JSON.stringify(params) === this.vecchioSchedInfo) {
      return;
    }
    this.vecchioSchedInfo = JSON.stringify(params); */
    // this.Utils.scriveLog('Info grid', params);

    this.caricamentoDatiInCorso3 = true;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);
      this.caricamentoDatiInCorso3 = false;

      if (!this.controllaRitornoChiamata(this, data, 'TsSchedInfoGrid2', this.ultimoTmsTsSchedInfoGrid2)) {
        return;
      }

      if (data && data !== null && data.v_grid_msg !== undefined) {
        this.messaggioWarningTestScenario2 = data.v_grid_msg;
      } else {
        this.messaggioWarningTestScenario2 = '';
      }

      // // this.Utils.scriveLog(data);
      this.nomeGriglia3 = data.GridProperty[0].GridName;

      if (this.datiGrigliaTestScenario2 && this.datiGrigliaTestScenario2 !== 'empty grid' && this.datiGrigliaTestScenario2.DataTable
        && this.datiGrigliaTestScenario2.DataTable.length > 0 && data.DataTable) {
          // logConsole('Aggiorna config', data);
        this.datiGrigliaTestScenario2.DataTable = data.DataTable;
      } else {
        // logConsole('Creo config', data);
        this.datiGrigliaTestScenario2 = data;
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.effettuaAutoFitTS2 = !this.effettuaAutoFitTS2;
        }, 500);
      }
    }, error => {
      this.caricamentoDatiInCorso3 = false;
      // Utils.messaggioDiErrore(this.datiGrigliaTestScenario2, error);
      // if (JSON.parse(error)._body) {
      //   this.datiGrigliaTestScenario2 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      // } else {
        this.datiGrigliaTestScenario2 = 'ERROR: ' + error;
      // }
    });
  }

  clickSelezione3(e) {
    // // this.Utils.scriveLog('Click su info grid', e);
    // this.stringaAGNCode = e[0].ACT_SET_NAME;
    this.rigaSelezionata3 = e;
  }

  lastSelectedOfGrid3(e) {

  }

  editPremutoTestScenario() {
    logConsole('Click edit', this.rigaSelezionata2, this.rigaSelezionata2.length);

    if (!this.rigaSelezionata2 || (this.rigaSelezionata2 && this.rigaSelezionata2.length > 1)) {
      const messaggio = 'Please select only a row';
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
      });
      return;
    }

    this.caricaTSID();

    this.caricaAgentGroup(this.groupIdSelezionato);
    
    // this.Utils.scriveLog(this.rigaSelezionata2[0]);
    this.TitoloMascheraModificaTestScenario = 'Edit Test Scenario';
    this.modificaOInserimentoTestScenario = 'MODIFICA';
    this.mascheraModificaAttivaTestScenario = true;
    this.rigaModificata2 = JSON.parse(JSON.stringify(this.rigaSelezionata2[0]));
    logConsole('Riga selezionata', this.rigaModificata2);
    let isActive = this.rigaModificata2.IS_ACTIVE;
    if (isActive.indexOf('***') > -1) {
      let a = isActive.indexOf('***');
      isActive = isActive.substring(a + 3, isActive.length);
      a = isActive.indexOf('***');
      isActive = isActive.substring(a + 3, isActive.length);
      this.rigaModificata2.IS_ACTIVE = isActive;
    }
    this.Utils.scriveLog('Riga da modificare: ', this.rigaModificata2);

    this.rigaModificata2.SCHED_RULE_TMS_FROM = this.datePipe.transform(this.rigaModificata2.SCHED_RULE_TMS_FROM, 'yyyy-MM-dd HH:mm:ss');
    this.rigaModificata2.SCHED_RULE_TMS_TO = this.datePipe.transform(this.rigaModificata2.SCHED_RULE_TMS_TO, 'yyyy-MM-dd HH:mm:ss');

    let q = 0;
    const t1 = setInterval(() => {
      if (this.datiGrigliaAgentsInfo && this.datiGrigliaAgentsInfo.DataTable) {
        clearInterval(t1);

        this.agentCodeMod = this.rigaModificata2.AGN_CODE;
        // logConsole('Agents code', this.datiGrigliaAgentsInfo.DataTable);
      } else {
        q++;
        if (q > 15) {
          clearInterval(t1);
        }
      }
    }, 100);
  }

  newPremutoTestScenario(e) {
    this.caricaTSID();

    this.modificaOInserimentoTestScenario = 'INSERIMENTO';
    this.agentCodeMod = '';
    this.testDesign = '';
    this.TitoloMascheraModificaTestScenario = 'Add new Test Scenario';
    // this.rigaModificata2 = JSON.parse(JSON.stringify(this.rigaSelezionata2[0]));
    this.rigaModificata2 = {
      SCHED_RULE_TMS_FROM: this.datePipe.transform('2000-01-01 00:00:00', 'yyyy-MM-dd HH:mm:ss'),
      SCHED_RULE_TMS_TO: this.datePipe.transform('2100-01-01 23:59:59', 'yyyy-MM-dd HH:mm:ss'),
      TS_SCHED_ID: '',
      TS_NAME: '',
      TS_DESCRIPTION: '',
      TS_FOLDER: 'default',
      PRIORITY: 5,
      TS_SCHED_NAME: '',
      SCHED_RULE_CRITERIA: 'time',
      SCHED_RULE_RADIUS: 3000,
      SCHED_RULE_PERIOD: 300,
      SCHED_RULE_ITERATIONS: 0,
      SCHED_RULE_POINT: '',
      IS_ACTIVE: 'N',
      AGN_GROUP_ID: this.rigaSelezionata.ID,
      TS_CODE: ''
    };

    this.rigaSelezionata2 = JSON.parse(JSON.stringify(this.rigaModificata2));

    this.caricaAgentGroup(this.groupIdSelezionato);

    this.mascheraModificaAttivaTestScenario = true;
  }

  creaNomeScenario() {
    if (this.modificaOInserimentoTestScenario === 'INSERIMENTO') {
      this.rigaModificata2.TS_SCHED_NAME = (this.testDesign ? this.testDesign : ''); // (this.agentCodeMod ? this.agentCodeMod : '') + ' ' + (this.testDesign ? this.testDesign : '');
    }
  }

  deletePremutoTestScenario() {
    logConsole('Click delete', this.rigaSelezionata2, this.rigaSelezionata2.length);
    
    if (!this.rigaSelezionata2 || (this.rigaSelezionata2 && this.rigaSelezionata2.length > 1)) {
    const messaggio = 'Please select only a row';
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
      });
      return;
    }

    const nomeTabella = 'ts_sched__del';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_id: this.rigaSelezionata2[0].TS_SCHED_ID
    };

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);

      this.caricaSchedGrid(this.rigaSelezionata);
    }, error => {
      Utils.messaggioDiErrore('null', 'DELETE:' + error);
    });
    // }
  }

  chiudeMaschera2() {
    if (this.rigaSelezionata2) {
      let ok = true;
      if (!this.rigaSelezionata2[0]) { this.rigaSelezionata2 = [this.rigaSelezionata2]; }
      if (this.rigaModificata2[0]) { this.rigaModificata2 = this.rigaModificata2[0]; }
      if (
        this.rigaModificata2.AGN_GROUP_ID === this.rigaSelezionata2[0].AGN_GROUP_ID &&
        this.rigaModificata2.IS_ACTIVE === this.rigaSelezionata2[0].IS_ACTIVE &&
        this.rigaModificata2.PRIORITY === this.rigaSelezionata2[0].PRIORITY &&
        this.rigaModificata2.SCHED_RULE_CRITERIA === this.rigaSelezionata2[0].SCHED_RULE_CRITERIA &&
        this.rigaModificata2.SCHED_RULE_ITERATIONS === this.rigaSelezionata2[0].SCHED_RULE_ITERATIONS &&
        this.rigaModificata2.SCHED_RULE_PERIOD === this.rigaSelezionata2[0].SCHED_RULE_PERIOD &&
        this.rigaModificata2.SCHED_RULE_POINT === this.rigaSelezionata2[0].SCHED_RULE_POINT &&
        this.rigaModificata2.SCHED_RULE_RADIUS === this.rigaSelezionata2[0].SCHED_RULE_RADIUS &&
        this.rigaModificata2.SCHED_RULE_TMS_FROM === this.rigaSelezionata2[0].SCHED_RULE_TMS_FROM &&
        this.rigaModificata2.SCHED_RULE_TMS_TO === this.rigaSelezionata2[0].SCHED_RULE_TMS_TO &&
        this.rigaModificata2.TS_CODE === this.rigaSelezionata2[0].TS_CODE &&
        this.rigaModificata2.TS_DESCRIPTION === this.rigaSelezionata2[0].TS_DESCRIPTION &&
        this.rigaModificata2.TS_FOLDER === this.rigaSelezionata2[0].TS_FOLDER &&
        this.rigaModificata2.TS_NAME === this.rigaSelezionata2[0].TS_NAME &&
        this.rigaModificata2.TS_SCHED_NAME === this.rigaSelezionata2[0].TS_SCHED_NAME &&
        this.rigaModificata2.TS_SCHED_ID === this.rigaSelezionata2[0].TS_SCHED_ID
      ) {
        ok = false;
      }
      logConsole(this.rigaModificata2, this.rigaSelezionata2[0], ok);
      if (ok) {
        const messaggio = 'Discard changes?';
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
            this.mascheraModificaAttivaTestScenario = false;
            this.modificaOInserimentoTestScenario = '';
          } else if (result.dismiss === Swal.DismissReason.cancel) {
          }
        });
        return;

        if (confirm('do you want to lose the changes made?')) {
          this.mascheraModificaAttivaTestScenario = false;
          this.modificaOInserimentoTestScenario = '';
        }
      } else {
        this.mascheraModificaAttivaTestScenario = false;
        this.modificaOInserimentoTestScenario = '';
      }
    } else {
      this.mascheraModificaAttivaTestScenario = false;
      this.modificaOInserimentoTestScenario = '';
    }
  }

  selectActive2(e) {
    // // this.Utils.scriveLog(e);
    this.rigaModificata2.IS_ACTIVE = e.ID;
  }

  clickSuMappa(e) {
    // // this.Utils.scriveLog('Coordinate su test:', e, this.rigaModificata2);
    if (this.rigaModificata2 && e) {
      const ee = transform(e, 'EPSG:3857', 'EPSG:4326');
      this.rigaModificata2.SCHED_RULE_POINT = 'POINT (' + ee[0] + ' ' + ee[1] + ')';
      // // this.Utils.scriveLog('Punto: ', this.rigaModificata2.SCHED_RULE_POINT);
    } else {
      if (this.rigaModificata2) {
        this.rigaModificata2.SCHED_RULE_POINT = '';
      }
    }
  }

  selectActiveRC(e) {
    // // this.Utils.scriveLog(e);
    this.rigaModificata2.SCHED_RULE_CRITERIA = e.ID;
  }

  salvaDatiTestScenario() {
    if (!this.rigaModificata2.TS_SCHED_NAME || this.rigaModificata2.TS_SCHED_NAME === '') {
      this.Utils.visualizzaAlert('Please, select a value for Name field');
      return;
    }
    if (!this.rigaModificata2.TS_CODE || this.rigaModificata2.TS_CODE === '') {
      this.Utils.visualizzaAlert('Please, select a value for Test Design field');
      return;
    }

    this.agentCodeMod = this.appoggioAC;
    const dsr = JSON.parse(JSON.stringify(this.datiGrigliaAgentsInfo.DataTable));
    let trovato = false;
    let m = 0;
    dsr.forEach(element => {
      if (!trovato && element.AGN_CODE === this.appoggioAC) {
        trovato = true;
      }
      m++;
    });
    if (!trovato) {
      m++;
      const v2 = {
        ROW_ID: m,
        AGN_CODE: this.appoggioAC
      }
      dsr.push(v2);
      dsr.sort((a, b) => (a.AGN_CODE.localeCompare(b.AGN_CODE)));
    }
    this.datiGrigliaAgentsInfo.DataTable = JSON.parse(JSON.stringify(dsr));

    let nomeTabella = '';
    let params;

    let id;
    // this.Utils.scriveLog(this.rigaSelezionata);
    // if (this.modificaOInserimentoTestScenario !== 'INSERIMENTO') {
      if (this.rigaSelezionata.ID !== undefined) {
        id = this.rigaSelezionata.ID;
      } else {
        if (this.rigaSelezionata[0].ID !== undefined) {
          id = this.rigaSelezionata[0].ID;
        }
      }
    // }
    // this.Utils.scriveLog(this.rigaModificata2);
    // // this.Utils.scriveLog(id);
    // return;

    switch (this.modificaOInserimentoTestScenario) {
      case 'MODIFICA':
        nomeTabella = 'ts_sched__upd';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.rigaModificata2.TS_SCHED_ID,
          v_name: this.rigaModificata2.TS_SCHED_NAME,
          v_description: this.rigaModificata2.TS_SCHED_DESCRIPTION ? this.rigaModificata2.TS_SCHED_DESCRIPTION : '',
          v_folder: this.rigaModificata2.TS_FOLDER,
          v_priority: this.rigaModificata2.PRIORITY,
          // v_ts_code: this.rigaModificata2.TS_CODE,
          // v_sched_rule_criteria: this.rigaModificata2.SCHED_RULE_CRITERIA,
          // v_sched_rule_radius: this.rigaModificata2.SCHED_RULE_RADIUS,
          v_sched_rule_tms_from: this.datePipe.transform(this.rigaModificata2.SCHED_RULE_TMS_FROM, 'yyyy-MM-dd HH:mm:ss'),
          v_sched_rule_tms_to: this.datePipe.transform(this.rigaModificata2.SCHED_RULE_TMS_TO, 'yyyy-MM-dd HH:mm:ss'),
          // v_sched_rule_period: this.rigaModificata2.SCHED_RULE_PERIOD,
          // v_sched_rule_iterations: this.rigaModificata2.SCHED_RULE_ITERATIONS === '' ? 0 :
          //   +this.rigaModificata2.SCHED_RULE_ITERATIONS,
          // v_sched_rule_point: this.rigaModificata2.SCHED_RULE_POINT,
          v_ts_type: 'Remote',
          v_agn_group_id: id, // this.rigaModificata2.AGN_GROUP_ID,
          v_is_active: this.rigaModificata2.IS_ACTIVE,
          v_agn_code: this.agentCodeMod !== undefined ? this.agentCodeMod : null
        };
        break;
      case 'INSERIMENTO':
        nomeTabella = 'ts_sched__ins';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_name: this.rigaModificata2.TS_SCHED_NAME,
          v_description: this.rigaModificata2.TS_SCHED_DESCRIPTION ? this.rigaModificata2.TS_SCHED_DESCRIPTION : '',
          v_folder: this.rigaModificata2.TS_FOLDER,
          v_priority: this.rigaModificata2.PRIORITY,
          v_ts_code: this.rigaModificata2.TS_CODE,
          // v_sched_rule_criteria: this.rigaModificata2.SCHED_RULE_CRITERIA,
          // v_sched_rule_radius: +this.rigaModificata2.SCHED_RULE_RADIUS,
          v_sched_rule_tms_from: this.datePipe.transform(this.rigaModificata2.SCHED_RULE_TMS_FROM, 'yyyy-MM-dd HH:mm:ss'),
          v_sched_rule_tms_to: this.datePipe.transform(this.rigaModificata2.SCHED_RULE_TMS_TO, 'yyyy-MM-dd HH:mm:ss'),
          // v_sched_rule_period: this.rigaModificata2.SCHED_RULE_PERIOD,
          // v_sched_rule_iterations: this.rigaModificata2.SCHED_RULE_ITERATIONS === '' ? 0 :
          //   +this.rigaModificata2.SCHED_RULE_ITERATIONS,
          // v_sched_rule_point: this.rigaModificata2.SCHED_RULE_POINT,
          v_ts_type: 'Remote',
          v_agn_group_id: id, // this.rigaModificata2.AGN_GROUP_ID,
          v_is_active: this.rigaModificata2.IS_ACTIVE,
          v_agn_code: this.agentCodeMod !== undefined ? this.agentCodeMod : null
        };
        break;
    }
    // // this.Utils.scriveLog(this.rigaModificata2);
    this.Utils.scriveLog('Salvataggio dati', params);
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);

      this.caricaSchedGrid(this.rigaSelezionata);

      this.mascheraModificaAttivaTestScenario = false;
      this.modificaOInserimentoTestScenario = '';
    }, error => {
      Utils.messaggioDiErrore('null', this.modificaOInserimentoTestScenario + ':' + error);
    });
  }

  testDesign;

  selectTS_CODE(e) {
    if (e) {
      // // this.Utils.scriveLog(e);
      // logConsole('Test design', e);
      this.testDesign = e.NAME;
      this.rigaModificata2.TS_CODE = e.TS_CODE;
      this.creaNomeScenario();
    }
  }

  clickSelezioneAgentsInfo(e) {
    // // this.Utils.scriveLog('Selezione Agents Info', e);
    this.rigaSelezionataAgentInfo = e;
    this.caricaTabellaAgentInfo(this.rigaSelezionataAgentInfo);

    this.editKeyVisibile4 = true;
    this.rigaSelezionata4 = e;
    this.actSetNameFM = this.rigaSelezionataAgentInfo[0].ACT_SET_NAME;

    // this.Utils.scriveLog('Click su Agents Info', e);
    this.stringaAGNCode = e[0].ACT_SET_NAME;
    this.agnGroup = e[0].ACT_SET_NAME;

    if (e[0].GEO_POS && e[0].GEO_POS !== null) {
      // POINT(12.17904 44.69226)
      let c = e[0].GEO_POS;
      c = c.replace('POINT(', '').replace(')', '').replace(' ', ';');
      // this.Utils.scriveLog(c);
      this.coordinate = c;
    }
  }

  lastSelectedOfGridAgentsInfo(e) {

  }

  refreshGridAgentsInfo(e, r) {
    this.vecchioAgn = '';
    this.caricaAgentGroup(this.groupIdSelezionato);
  }

  vecchioAgn = '';
  ultimoTmsAgnGrid;

  caricaAgentGroup(groupId) {
    if (groupId === undefined || groupId === '') {
      return;
    }

    this.ultimoTmsAgnGrid = new Date().getTime();

    const nomeTabella = 'agn__grid';
    const params = {
      v_cntx_id: this.sessionService.getToken(),
      v_group_id: groupId,
      v_filter: '',
      v_prop_name_1: this.propName[1],
      v_prop_name_2: this.propName[2],
      v_prop_name_3: this.propName[3],
      v_prop_name_4: this.propName[4],
      v_prop_name_5: this.propName[5],
      v_prop_name_6: this.propName[6],
      v_prop_name_7: this.propName[7],
      v_prop_name_8: this.propName[8],
      v_prop_name_9: this.propName[9],
      v_caller_tag: this.ultimoTmsAgnGrid
    };
    /* if (JSON.stringify(params) === this.vecchioAgn) {
      return;
    }
    this.vecchioAgn = JSON.stringify(params); */

    this.Utils.scriveLog('AGN GRID params', params);
    this.caricamentoDatiInCorso4 = true;
    // logConsole('Caricamento agent info', params);
    // this.datiGrigliaAgentInfo = null; // 'empty grid';;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso4 = false;
      // // this.Utils.scriveLog(data);
      if (data) {
        Utils.checkRitornoChiamata(this, data);
        this.nomeGrigliaAgentsInfo = data.GridProperty[0].GridName;

        this.Utils.scriveLog('Ritorno dati AGN GRID', data);

        if (!this.controllaRitornoChiamata(this, data, 'AgnGrid', this.ultimoTmsAgnGrid)) {
          return;
        }

        if (this.datiGrigliaAgentsInfo && this.datiGrigliaAgentsInfo !== null && this.datiGrigliaAgentsInfo.DataTable 
          && this.datiGrigliaAgentsInfo.ColumnProperty && this.datiGrigliaAgentsInfo.GridProperty) {
          // // this.Utils.scriveLog('Refresh agent info', this.datiGrigliaAgentsInfo.DataTable[0]);
          this.datiGrigliaAgentsInfo.DataTable = data.DataTable;
        } else {
          // this.datiGrigliaAgentsInfo = null;
          this.datiGrigliaAgentsInfo = data;

          const tm = setTimeout(() => {
            clearTimeout(tm);
            /* const tm = setTimeout(() => {
              this.effettuaAutoFit4 = !this.effettuaAutoFit4;
            }, 1000); */
            // // this.Utils.scriveLog('Caricamento agent info', this.datiGrigliaAgentsInfo.DataTable[0]);
            if (this.datiGrigliaAgentsInfo && this.datiGrigliaAgentsInfo.DataTable) {
              this.rigaSelezionataAgentInfo = this.datiGrigliaAgentsInfo.DataTable[0];
              if (this.rigaSelezionataAgentInfo) {
                this.actSetNameFM = this.rigaSelezionataAgentInfo.ACT_SET_NAME;
                this.caricaTabellaAgentInfo(this.rigaSelezionataAgentInfo);
              }
            }
          }, 50);
        }
        const tm = setTimeout(() => {
          clearTimeout(tm);
          if (this.datiGrigliaAgentsInfo && this.datiGrigliaAgentsInfo.DataTable && this.datiGrigliaAgentsInfo.DataTable.length > 0) {
            if (this.rigaSelezionata && this.rigaSelezionata !== null) {
              this.Utils.scriveLog(this.rigaSelezionata);
              this.selezione4 = this.rigaSelezionata.ROW_ID;
            }
          }
        }, 1000);
      } else {
        this.datiGrigliaAgentsInfo = null; // 'empty grid';;
        this.Utils.scriveLog('AZZERO 3');
        this.datiGrigliaAgentInfo = null; // 'empty grid';;
      }
    }, error => {
      this.caricamentoDatiInCorso4 = false;
      // this.datiGrigliaAgentsInfo = null;
      // Utils.messaggioDiErrore(this.datiGrigliaAgentsInfo, error);
      // Utils.messaggioDiErrore(this.datiGrigliaAgentInfo, error);
      this.Utils.scriveLog('AZZERO 4');
      if (JSON.parse(error)._body) {
        this.datiGrigliaAgentsInfo = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        this.datiGrigliaAgentInfo = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiGrigliaAgentsInfo = 'ERROR: ' + error;
        this.datiGrigliaAgentInfo = 'ERROR: ' + error;
      }
    });
  }

  clickSelezioneAgentProfile(e) {
    // this.Utils.scriveLog('Click su Agent Profile', e);
    // this.stringaAGNCode = e[0].ACT_SET_NAME;
    // this.agnGroup = e[0].ACT_SET_NAME;

    this.rigaSelezionataAgentProfile = e;
    // this.Utils.scriveLog(e);
    this.selezioneAgnProfCombo = e[0];
    this.selezioneAgnProfCombo.ID = e[0].AGN_PROF_ID;

    if (this.rigaSelezionataAgentInfo) {
      this.actSetNameFM = this.rigaSelezionataAgentInfo.ACT_SET_NAME;
      this.caricaTabellaAgentInfo(this.rigaSelezionataAgentInfo);
    }
  }

  lastSelectedOfGridAgentProfile(e) {

  }

  refreshAgentProfile(e, r) {
    // this.vecchioAgnProfile = '';
    if (r === true) {
      this.datiGrigliaAgentProfile = undefined;
    }
    this.caricaAgentsProfile(this.agnProfSelezionato);
  }

  refreshTestScenario(e, r) {
    // this.vecchioAgnProfile = '';
    if (r === true) {
      this.datiGrigliaTestScenario2 = undefined; 
    }
    this.caricaInfoGrid(this.rigaSelezionata2[0]);
  }

  chiudeMascheraComboAgentProfileN(e) {
    // // this.Utils.scriveLog(this.lovSelezionato);
    // // this.Utils.scriveLog(this.rigaSelezionataAgentInfo);
    // // this.Utils.scriveLog(this.rigaSelezionataAI);
    // return;
    // this.Utils.scriveLog('MODIFICA TDC', this.modificaTDC);

    // logConsole('DATI', this.agnProf, this.opzione, this.rigaSelPerModificaN.DOMAIN_TYPE, this.lovSelezionato);

    if (this.agnProf === true && this.opzione === 1) {
      this.lovSelezionato = '<default>';
    } else {
      if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'string' || this.rigaSelPerModificaN.DOMAIN_TYPE === 'integer' || this.rigaSelPerModificaN.DOMAIN_TYPE === 'decimal') {

      } else {
        // this.lovSelezionato = this.appoggioLS;

        // logConsole('dati lov prima', this.datiLov);

        let trovato = false;
        let m = 0;
        let dsr;
        // logConsole('DATI: ', this.rigaSelPerModificaN.DOMAIN_TYPE, dsr, this.datiLov);
        if (this.datiLov) {
          dsr = JSON.parse(JSON.stringify(this.datiLov));
          dsr.forEach(element => {
            if (!trovato && element.NAME === this.lovSelezionato) {
              trovato = true;
            }
            m++;
          });
          if (!trovato) {
            m++;
            const v2 = {
              ROW_ID: m,
              ID: this.lovSelezionato,
              NAME: this.lovSelezionato
            }
            dsr.push(v2);
            dsr.sort((a, b) => (a.NAME.localeCompare(b.NAME)));
          }
        } else {
          dsr = new Array();
          const v2 = {
            ROW_ID: 0,
            ID: this.lovSelezionato,
            NAME: this.lovSelezionato
          }
          dsr.push(v2);
          dsr.sort((a, b) => (a.NAME.localeCompare(b.NAME)));
        }
        // this.Utilities.datiActTimeSpan = undefined;
        // const tm = setTimeout(() => {
        
        this.datiLov = JSON.parse(JSON.stringify(dsr));

        // logConsole('dati lov dopo', this.datiLov);
      }
    }

    if (this.opzione === 2) {
      if (this.lovSelezionato === this.rigaSelPerModificaN.TS_SCHED_VALUE) {
        this.lovSelezionato = '<default>';
      }
    }

    let nomeTabella = '';
    let params;

    if (this.modificaTDC === '1') {
      nomeTabella = 'agn_prof_property__upd';
      params = {
        v_cntx: this.sessionService.getToken(),
        v_agn_prof_id: this.rigaSelezionataAgentProfile[0].AGN_PROF_ID,
        v_name: this.rigaSelezionataAgentProfile[0].NAME,
        v_value: this.lovSelezionato
      };

      this.Utils.scriveLog('AGN PROF ID', this.rigaSelezionataAgentProfile[0].AGN_PROF_ID);
      this.Utils.scriveLog('Dati Griglia:', this.datiGriglia);
      let ok = false;
      this.datiGriglia.DataTable.forEach(element => {
        if (+element.AGN_PROF_ID === +this.rigaSelezionataAgentProfile[0].AGN_PROF_ID) {
          ok = true;
        }
      });
      if (ok) {
        const messaggio = 'Warning: you are going to modify an Agent Group Profile associated also to other Agent Groups.\nDo you confirm?';
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
            this.effettuaOperazione(nomeTabella, params);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            return;
          }
        });
    
        /* if (!confirm('Warning: you are going to modify an Agent Group Profile associated also to other Agent Groups.\nDo you confirm?')) {
          return;
        } */
        return;
      }
    } else {
      if (this.modificaTDC === '2') {
        nomeTabella = 'agn_property__upd';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_agn_code: this.rigaSelezionataAI.AGN_CODE,
          v_name: this.rigaSelezionataAI.NAME,
          v_value: this.lovSelezionato
        };
        this.effettuaOperazione(nomeTabella, params);
      } else {
        if (this.modificaTDC === '5') {
          nomeTabella = 'ts_sched_info__upd';
          params = {
            v_cntx: this.sessionService.getToken(),
            v_ts_sched_id: this.rigaSelPerModificaN.TS_SCHED_ID,
            v_ts_info_id: this.rigaSelPerModificaN.TS_INFO_ID,
            v_value: this.lovSelezionato
          };
          this.effettuaOperazione(nomeTabella, params);
        } else {
          nomeTabella = 'ts_sched_info__upd';
          params = {
            v_cntx: this.sessionService.getToken(),
            v_ts_sched_id: this.rigaSelPerModificaN.TS_SCHED_ID,
            v_ts_info_id: this.rigaSelPerModificaN.TS_INFO_ID,
            // v_ts_code: this.rigaSelPerModificaN.TS_CODE,
            // v_tc_name: this.rigaSelPerModificaN.TC_NAME,
            // v_prm_code: this.rigaSelPerModificaN.PRM_CODE,
            v_value: this.lovSelezionato
          };
          this.effettuaOperazione(nomeTabella, params);
        }
      }
    }
  }

  effettuaOperazione(nomeTabella, params) {
    // alert('Eseguo operazione: ' + nomeTabella);
    // alert('Parametri: ' + JSON.stringify(params));
    // return;

    // // this.Utils.scriveLog(params);
    this.caricamentoDatiInCorso5 = true;
    // return;

    logConsole('Parametri', params);

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso5 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        this.Utils.scriveLog('Valore controllo', this.modificaTDC);
        // this.caricaInfoGrid();

        if (this.modificaTDC === '1') {
          this.caricaAgentsProfile(this.agnProfSelezionato);
        } else {
          if (this.modificaTDC === '2') {
            // this.caricaTabellaAgentInfo(this.rigaSelezionataAgentInfo);
            this.caricaTabellaAgentInfo(this.RigaSelezioneAgent1);
          } else {
            if (this.modificaTDC === '3') {
              this.caricaSchedGrid(this.rigaSelezionata);
              this.Utils.scriveLog(this.rigaSelezionata2 );
              this.caricaInfoGrid(this.rigaSelezionata2[0]);
            } else {
              if (this.modificaTDC === '5') {
                this.caricaTestDesignConfig(this.rigaSelezionata62[0]);
              // } else {
              //   this.caricaInfoGrid(this.rigaSelezionata3[0]);
              }
            }
          }
        }
        // this.caricaInfoGrid(this.rigaSelezionata2[0]);
        // this.caricaAgentsProfile(this.selezioneAgnProfCombo.ID);

        this.mascheraModificaAttivaComboAgentProfileN = false;
      } else {
        // alert(data);
      }
      this.modificaTDC = '1';
    }, error => {
      Utils.messaggioDiErrore('null', 'Read:' + error);
      this.modificaTDC = '1';
    });
  }

  cambiaTitoloFrameAGP(e) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.Utils.scriveLog('Titolo AGP', e);
      this.nomeGrigliaAgentProfile = e;
    }, 100);
  }

  chiudeMascheraComboAgentProfile(e) {
    // // this.Utils.scriveLog(this.selezioneAgnProfCombo.ID);
    // this.Utils.scriveLog(this.rigaSelezionata, this.selezioneAgnProfCombo);
    // // this.Utils.scriveLog(this.rigaSelezionataAgentProfile);
    const nomeTabella = 'agn_group__upd';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_id: this.rigaSelezionata.ID,
      v_name: this.rigaSelezionata.NAME,
      v_folder: this.rigaSelezionata.FOLDER,
      v_description: this.rigaSelezionata.DESCRIPTION,
      v_agn_prof_id: this.selezioneAgnProfCombo.ID,
      v_query_pck_id: this.rigaSelezionata.QUERY_PCK_ID,
      v_operator_group_id: this.rigaSelezionata.OPERATOR_GROUP_ID
    };
    // this.Utils.scriveLog(params);
    this.caricamentoDatiInCorso5 = true;
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso5 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        this.caricaAgentsProfile(this.rigaSelezionata.AGN_PROF_ID);
        // this.caricaTabella();
        // this.caricaAgentsProfile(this.selezioneAgnProfCombo.ID);
        this.mascheraModificaAttivaComboAgentProfile = false;
      } else {
        // alert(data);
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
  }

  selectAgnProf(e) {
    if (e) {
      // this.Utils.scriveLog(e);
      this.selezioneAgnProfCombo = e;
    }
  }

  // vecchioAgnProfile = '';
  ultimoTmsAgnProfInfo = -1;
  messaggioWarningAgentProfile = '';

  caricaAgentsProfile(e) {
    this.ultimoTmsAgnProfInfo = new Date().getTime();

    const nomeTabella = 'agn_prof_info__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_prof_id: e,
      v_caller_tag: this.ultimoTmsAgnProfInfo
    };
    /* if (JSON.stringify(params) === this.vecchioAgnProfile) {
      return;
    }
    this.vecchioAgnProfile = JSON.stringify(params); */

    this.caricamentoDatiInCorso5 = true;
    // this.datiGrigliaAgentProfile = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso5 = false;
      // // this.Utils.scriveLog(data);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        this.nomeGrigliaAgentProfile = data.GridProperty[0].GridName;
        // this.Utils.scriveLog('Nome griglia agn prof', this.nomeGrigliaAgentProfile);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningAgentProfile = data.v_grid_msg;
        } else {
          this.messaggioWarningAgentProfile = '';
        }

        this.Utils.scriveLog('Dati griglia agn prof', data);
        // return;
        
        if (!this.controllaRitornoChiamata(this, data, 'AgnProfInfo', this.ultimoTmsAgnProfInfo)) {
          return;
        }

        if (this.datiGrigliaAgentProfile && this.datiGrigliaAgentProfile !== 'empty grid' && this.datiGrigliaAgentProfile.DataTable
          && this.datiGrigliaAgentProfile.DataTable.length > 0 && data.DataTable) {
            this.datiGrigliaAgentProfile.DataTable = JSON.parse(JSON.stringify(data.DataTable));
            // this.nomeGrigliaAgentProfile = data.GridProperty[0].GridName;
            // // this.Utils.scriveLog(this.nomeGrigliaAgentProfile);
        } else {
          // this.datiGrigliaAgentProfile = null;
          this.datiGrigliaAgentProfile = JSON.parse(JSON.stringify(data));
          this.effettuaAutoFit5 = !this.effettuaAutoFit5;
          /* const tm = setTimeout(() => {
            this.effettuaAutoFit5 = !this.effettuaAutoFit5;
          }, 1000); */
        }
      } else {
        this.datiGrigliaAgentProfile = null; // 'empty grid';;
      }
    }, error => {
      this.caricamentoDatiInCorso5 = false;
      // this.datiGrigliaAgentProfile = null;
      // Utils.messaggioDiErrore(this.datiGrigliaAgentProfile, error);
      if (JSON.parse(error)._body) {
        this.datiGrigliaAgentProfile = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiGrigliaAgentProfile = 'ERROR: ' + error;
      }
    });
  }

  clickSelezione6(e) {
    this.rigaSelezionata6 = e[0];
    this.newKeyVisibile6 = true;
    this.deleteKeyVisibile6 = true;

    this.caricaTestDesignConfig(this.rigaSelezionata6);
    // this.Utils.scriveLog('Click su Agent profile', e);
    // this.stringaAGNCode = e[0].ACT_SET_NAME;
    // this.agnGroup = e[0].ACT_SET_NAME;
  }

  lastSelectedOfGrid6(e) {

  }

  refreshGrid6(e, r) {
    // this.vecchioSchedLocal = '';
    if (r === true) {
      this.datiGriglia6 = undefined;
    }
    this.caricaTestDesign(this.agnGroupID);
  }

  // vecchioSchedLocal = '';
  ultimoTmsTsSchedLocal = -1;
  messaggioWarning6 = '';

  caricaTestDesign(e) {
    this.ultimoTmsTsSchedLocal = new Date().getTime();

    const nomeTabella = 'ts_sched_local__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_group_id: this.agnGroupID,
      v_ts_type: 'Local',
      v_caller_tag: this.ultimoTmsTsSchedLocal
    };
    /* if (JSON.stringify(params) === this.vecchioSchedLocal) {
      return;
    }
    this.vecchioSchedLocal = JSON.stringify(params); */

    this.caricamentoDatiInCorso6 = true;

    // this.datiGriglia6 = null;
    this.editKeyVisibile6 = false;
    this.deleteKeyVisibile6 = false;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso6 = false;
      // // this.Utils.scriveLog(data);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        if (!this.controllaRitornoChiamata(this, data, 'TsSchedLocal', this.ultimoTmsTsSchedLocal)) {
          return;
        }

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning6 = data.v_grid_msg;
        } else {
          this.messaggioWarning6 = '';
        }

        this.nomeGriglia6 = data.GridProperty[0].GridName;

        this.Utils.scriveLog('Dati griglia test design', data);
        if (this.datiGriglia6 && this.datiGriglia6 !== 'empty grid' && this.datiGriglia6.DataTable
          && this.datiGriglia6.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia6.DataTable = JSON.parse(JSON.stringify(data.DataTable));
        } else {
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia6 = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit6 = !this.effettuaAutoFit6;
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              if (this.datiGriglia6 && this.datiGriglia6.DataTable && this.datiGriglia6.DataTable.length > 0) {
                this.rigaSelezionata6 = this.datiGriglia6.DataTable[0];
                // this.Utils.scriveLog(this.rigaSelezionata6);
                this.selezione6 = this.rigaSelezionata6.ROW_ID;
                this.editKeyVisibile6 = true;
                this.deleteKeyVisibile6 = true;
              }
            }, 1000);
          }, 10);
        }

        const tm = setTimeout(() => {
          clearTimeout(tm);
          if (this.datiGriglia6 && this.datiGriglia6 !== 'empty grid' && this.datiGriglia6.DataTable
            && this.datiGriglia6.DataTable.length > 0) {
              this.selezione6 = this.datiGriglia6.DataTable[0].ROW_ID;
              this.rigaSelezionata6 = this.datiGriglia6.DataTable[0];
              // this.Utils.scriveLog(this.selezione62);
              this.caricaTestDesignConfig(this.rigaSelezionata6);
          } else {
            // this.datiGriglia62 = JSON.parse(JSON.stringify(data));
          }
        }, 10);
      } else {
        this.datiGriglia6 = 'empty rid';
        this.datiGriglia62 = null; // 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso6 = false;
      // this.datiGriglia6 = null;
      // Utils.messaggioDiErrore(this.datiGriglia6, error);
      // Utils.messaggioDiErrore(this.datiGriglia62, error);
      if (JSON.parse(error)._body) {
        this.datiGriglia6 = 'ERROR: ' + JSON.stringify(JSON.parse(error)._body.message);
        this.datiGriglia62 = 'ERROR: ' + JSON.stringify(JSON.parse(error)._body.message);
      } else {
        this.datiGriglia6 = 'ERROR: ' + error;
        this.datiGriglia62 = 'ERROR: ' + error;
      }
    });
  }

  // vecchioTestDesign = '';
  ultimoTmsTsSchedInfoGrid = -1;
  messaggioWarning62 = '';

  caricaTestDesignConfig(e) {
    if (e) {
      // this.Utils.scriveLog(e);
      const nomeTabella = 'ts_sched_info__grid';
      const params = {
        cntx_id: this.sessionService.getToken(),
        v_ts_sched_id: e.TS_SCHED_ID,
        v_mode: 'standard',
        v_caller_tag: this.ultimoTmsTsSchedInfoGrid
      };
      /* if (JSON.stringify(params) === this.vecchioTestDesign) {
        return;
      }
      this.vecchioTestDesign = JSON.stringify(params); */

      this.caricamentoDatiInCorso62 = true;

      // this.datiGriglia3 = null;
      this.apiService.chiamataPost('' + nomeTabella, params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.caricamentoDatiInCorso62 = false;
        if (data && data !== null) {
          Utils.checkRitornoChiamata(this, data);

          if (!this.controllaRitornoChiamata(this, data, 'TsSchedInfoGrid', this.ultimoTmsTsSchedInfoGrid)) {
            return;
          }

          if (data && data !== null && data.v_grid_msg !== undefined) {
            this.messaggioWarning62 = data.v_grid_msg;
          } else {
            this.messaggioWarning62 = '';
          }

          if (this.datiGriglia62 && this.datiGriglia62 !== 'empty grid' && this.datiGriglia62.DataTable
            && this.datiGriglia62.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia62.DataTable = data.DataTable;
          } else {
            // this.datiGriglia3 = null;
            this.datiGriglia62 = JSON.parse(JSON.stringify(data));
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.effettuaAutoFit62 = !this.effettuaAutoFit62;
            }, 1000);
          }
        } else {
          this.datiGriglia62 = null; // 'empty grid';
        }
      }, error => {
        this.caricamentoDatiInCorso62 = false;
        // this.datiGriglia3 = null;
        // Utils.messaggioDiErrore(this.datiGriglia62, error);
        if (JSON.parse(error)._body) {
          this.datiGriglia62 = 'ERROR: ' + JSON.stringify(JSON.parse(error)._body.message);
        } else {
          this.datiGriglia62 = 'ERROR: ' + error;
        }
      });
    }
  }

  editPremuto6(e) {
    this.TitoloMascheraModifica6 = 'Edit Local Test Scenario';
    this.modificaOInserimento6 = 'MODIFICA';
    this.mascheraModificaAttiva6 = true;
    this.rigaModificata6 = JSON.parse(JSON.stringify(this.rigaSelezionata6));
    // this.Utils.scriveLog('Riga da modificare: ', this.rigaModificata6);

    this.rigaModificata6.SCHED_RULE_TMS_FROM = this.datePipe.transform(this.rigaModificata6.SCHED_RULE_TMS_FROM, 'yyyy-MM-dd HH:mm:ss');
    this.rigaModificata6.SCHED_RULE_TMS_TO = this.datePipe.transform(this.rigaModificata6.SCHED_RULE_TMS_TO, 'yyyy-MM-dd HH:mm:ss');
  }

  newPremuto62(e) {
    this.rigaSelezionata6 = e;
    this.newPremuto6(e);
  }

  newPremuto6(e) {
    /* this.TitoloMascheraModifica6 = 'Add new Local Test Scenario';
    this.modificaOInserimento6 = 'INSERIMENTO';
    this.mascheraModificaAttiva6 = true;
    // this.rigaModificata4 = JSON.parse(JSON.stringify(this.rigaSelezionata4[0]));
    this.rigaModificata6 = {
      SCHED_RULE_TMS_FROM: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      SCHED_RULE_TMS_TO: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      TS_SCHED_ID: '',
      TS_NAME: '',
      TS_DESCRIPTION: '',
      // TS_FOLDER: '',
      PRIORITY: '',
      SCHED_RULE_CRITERIA: '',
      SCHED_RULE_RADIUS: '',
      SCHED_RULE_PERIOD: '',
      // SCHED_RULE_ITERATIONS = '';
      SCHED_RULE_POINT: '',
      IS_ACTIVE: '',
      AGN_GROUP_ID: this.rigaSelezionata.ID
    }; */

    let nomeTabella = '';
    let params;
    let messaggio = '';

    if (e.INCLUDED === 'Y') {
      messaggio = 'Remove selected item?';
      nomeTabella = 'ts_sched__del';
      params = {
        v_cntx: this.sessionService.getToken(),
        v_id: e.TS_SCHED_ID
      }
    } else {
      messaggio = 'Add selected item?';
      nomeTabella = 'ts_sched__ins';
      params = {
        v_cntx: this.sessionService.getToken(),
        v_name: null,
        v_description: null,
        v_folder: null,
        v_priority: null,
        v_ts_code: this.rigaSelezionata6.TS_CODE,
        // v_sched_rule_criteria: null,
        // v_sched_rule_radius: null,
        v_sched_rule_tms_from: null,
        v_sched_rule_tms_to: null,
        // v_sched_rule_period: null,
        // v_sched_rule_iterations: null,
        // v_sched_rule_point: null,
        v_ts_type: 'Local',
        v_agn_group_id: this.agnGroupID,
        v_is_active: null
      };
    }

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
        this.apiService.chiamataPost('' + nomeTabella, params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          Utils.checkRitornoChiamata(this, data);
  
          this.caricaTestDesign(this.agnProfSelezionato);
        }, error => {
          Utils.messaggioDiErrore('null', 'ADD NEW:' + error);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
    return;

    if (confirm(messaggio)) {
      this.apiService.chiamataPost('' + nomeTabella, params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        Utils.checkRitornoChiamata(this, data);

        this.caricaTestDesign(this.agnProfSelezionato);
      }, error => {
        Utils.messaggioDiErrore('null', 'ADD NEW:' + error);
      });
    }
  }

  deletePremuto6(e) {
    const messaggio = 'Do you want delete selected row ?';
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
        const nomeTabella = 'ts_sched__del';
        const params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.rigaSelezionata6.TS_SCHED_ID
        };
  
        this.apiService.chiamataPost('' + nomeTabella, params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          Utils.checkRitornoChiamata(this, data);
  
          this.caricaTestDesign(this.agnProfSelezionato);
        }, error => {
          Utils.messaggioDiErrore('null', 'DELETE:' + error);
        });  
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
    return;

    if (confirm('Do you want delete selected row ?')) {
      const nomeTabella = 'ts_sched__del';
      const params = {
        v_cntx: this.sessionService.getToken(),
        v_id: this.rigaSelezionata6.TS_SCHED_ID
      };

      this.apiService.chiamataPost('' + nomeTabella, params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        Utils.checkRitornoChiamata(this, data);

        this.caricaTestDesign(this.agnProfSelezionato);
      }, error => {
        Utils.messaggioDiErrore('null', 'DELETE:' + error);
      });
    }
  }

  chiudeMaschera6() {
    if (JSON.stringify(this.rigaModificata6) !== JSON.stringify(this.rigaSelezionata6[0])) {
      const messaggio = 'Do you want to lose the changes made?';
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
          this.mascheraModificaAttiva6 = false;
          this.modificaOInserimento6 = '';
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
      return;
  
      if (confirm('do you want to lose the changes made?')) {
        this.mascheraModificaAttiva6 = false;
        this.modificaOInserimento6 = '';
      }
    } else {
      this.mascheraModificaAttiva6 = false;
      this.modificaOInserimento6 = '';
    }
  }

  salvaDati6() {
    let nomeTabella = '';
    let params;

    switch (this.modificaOInserimento6) {
      case 'MODIFICA':
        nomeTabella = 'ts_sched__upd';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.rigaModificata6.TS_SCHED_ID,
          v_name: this.rigaModificata6.TS_NAME,
          v_description: this.rigaModificata6.TS_DESCRIPTION,
          v_folder: this.rigaModificata6.TS_FOLDER,
          v_priority: this.rigaModificata6.PRIORITY,
          // v_ts_code: this.rigaModificata6.TS_CODE,
          // v_sched_rule_criteria: this.rigaModificata6.SCHED_RULE_CRITERIA,
          // v_sched_rule_radius: this.rigaModificata6.SCHED_RULE_RADIUS,
          v_sched_rule_tms_from: this.datePipe.transform(this.rigaModificata6.SCHED_RULE_TMS_FROM, 'yyyy-MM-dd HH:mm:ss'),
          v_sched_rule_tms_to: this.datePipe.transform(this.rigaModificata6.SCHED_RULE_TMS_TO, 'yyyy-MM-dd HH:mm:ss'),
          // v_sched_rule_period: this.rigaModificata6.SCHED_RULE_PERIOD,
          // v_sched_rule_iterations: this.rigaModificata6.SCHED_RULE_ITERATIONS,
          // v_sched_rule_point: this.rigaModificata6.SCHED_RULE_POINT,
          v_ts_type: 'Local',
          v_agn_group_id: this.rigaModificata6.AGN_GROUP_ID,
          v_is_active: this.rigaModificata6.IS_ACTIVE
        };
        break;
      case 'INSERIMENTO':
        nomeTabella = 'ts_sched__ins';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_name: this.rigaModificata6.TS_NAME,
          v_description: this.rigaModificata6.TS_DESCRIPTION,
          v_folder: this.rigaModificata6.TS_FOLDER,
          v_priority: this.rigaModificata6.PRIORITY,
          v_ts_code: this.rigaModificata6.TS_CODE,
          // v_sched_rule_criteria: this.rigaModificata6.SCHED_RULE_CRITERIA,
          // v_sched_rule_radius: this.rigaModificata6.SCHED_RULE_RADIUS,
          v_sched_rule_tms_from: this.datePipe.transform(this.rigaModificata6.SCHED_RULE_TMS_FROM, 'yyyy-MM-dd HH:mm:ss'),
          v_sched_rule_tms_to: this.datePipe.transform(this.rigaModificata6.SCHED_RULE_TMS_TO, 'yyyy-MM-dd HH:mm:ss'),
          // v_sched_rule_period: this.rigaModificata6.SCHED_RULE_PERIOD,
          // v_sched_rule_iterations: this.rigaModificata6.SCHED_RULE_ITERATIONS,
          // v_sched_rule_point: this.rigaModificata6.SCHED_RULE_POINT,
          v_ts_type: 'Local',
          v_agn_group_id: this.rigaModificata6.AGN_GROUP_ID,
          v_is_active: this.rigaModificata6.IS_ACTIVE
        };
        break;
    }

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);

      this.caricaTestDesign(this.agnProfSelezionato);

      this.mascheraModificaAttiva6 = false;
      this.modificaOInserimento6 = '';
    }, error => {
      Utils.messaggioDiErrore('null', this.modificaOInserimento6 + ':' + error);
    });
  }

  selectActive6(e) {
    // // this.Utils.scriveLog(e);
    this.rigaModificata6.IS_ACTIVE = e.ID;
  }

  clickSelezioneQueryPCK(e) {
    // this.Utils.scriveLog('Click su Query PCK', e);
    // this.stringaAGNCode = e[0].ACT_SET_NAME;
    // this.agnGroup = e[0].ACT_SET_NAME;
  }

  lastSelectedOfGridQueryPCK(e) {

  }

  refreshQueryPCK(e, r) {
    // this.vecchioQueryPCK = '';
    if (r === true) {
      this.datiGrigliaQueryPCK = undefined;
    }
    this.caricaQueryPCK(this.queryPckSelezionato);
  }

  // vecchioQueryPCK = '';
  ultimoTmsQueryPCK = -1;
  messaggioWarningQueryPCK = '';

  caricaQueryPCK(e) {
    if (!this.queryPck2 || this.queryPck2 === 'N') {
      return;
    }

    this.ultimoTmsQueryPCK = new Date().getTime();

    const nomeTabella = 'query_pck__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_query_pck_id: e,
      v_caller_tag: this.ultimoTmsQueryPCK
    };
    /* if (JSON.stringify(params) === this.vecchioQueryPCK) {
      return;
    }
    this.vecchioQueryPCK = JSON.stringify(params); */

    this.caricamentoDatiInCorso7 = true;

    // this.datiGrigliaQueryPCK = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso7 = false;
      // // this.Utils.scriveLog(data);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        if (!this.controllaRitornoChiamata(this, data, 'Query PCK', this.ultimoTmsQueryPCK)) {
          return;
        }

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningQueryPCK = data.v_grid_msg;
        } else {
          this.messaggioWarningQueryPCK = '';
        }

        this.nomeGrigliaQueryPCK = data.GridProperty[0].GridName;

        this.Utils.scriveLog('Dati griglia query PCK', data);
        if (this.datiGrigliaQueryPCK && this.datiGrigliaQueryPCK !== 'empty grid' && this.datiGrigliaQueryPCK.DataTable
          && this.datiGrigliaQueryPCK.DataTable.length > 0 && data.DataTable) {
          this.datiGrigliaQueryPCK.DataTable = data.DataTable;
        } else {
          // this.datiGrigliaQueryPCK = null;
          this.datiGrigliaQueryPCK = JSON.parse(JSON.stringify(data));
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.effettuaAutoFit7 = !this.effettuaAutoFit7;
          }, 10);
        }
      } else {
        this.datiGrigliaQueryPCK = null; // 'empty grid';;
      }
    }, error => {
      this.caricamentoDatiInCorso7 = false;
      // this.datiGrigliaQueryPCK = null;
      // Utils.messaggioDiErrore(this.datiGrigliaQueryPCK, error);
      if (JSON.parse(error)._body) {
        this.datiGrigliaQueryPCK = 'ERROR: ' + JSON.stringify(JSON.parse(error)._body.message);
      } else {
        this.datiGrigliaQueryPCK = 'ERROR: ' + error;
      }
    });
  }

  chiudeMascheraComboQueryPCK(e) {
    // this.Utils.scriveLog(this.selezioneQueryPckCombo);
    // this.Utils.scriveLog(this.rigaSelezionata);
    // this.Utils.scriveLog(this.rigaSelezionataAgentProfile);
    const nomeTabella = 'agn_group__upd';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_id: this.rigaSelezionata.ID,
      v_name: this.rigaSelezionata.NAME,
      v_folder: this.rigaSelezionata.FOLDER,
      v_description: this.rigaSelezionata.DESCRIPTION,
      v_agn_prof_id: this.rigaSelezionata.AGN_PROF_ID,
      v_query_pck_id: this.selezioneQueryPckCombo.ID,
      v_operator_group_id: this.rigaSelezionata.OPERATOR_GROUP_ID
    };
    // this.Utils.scriveLog(params);
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso4 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        this.caricaTabella('Chiude Combo Query PCK');
        // this.caricaAgentsProfile(this.selezioneAgnProfCombo.ID);
        this.mascheraModificaAttivaComboQueryPCK = false;
      } else {
        // alert(data);
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
  }

  selectQueryPck(e) {
    if (e) {
      // this.Utils.scriveLog(e);
      this.selezioneQueryPckCombo = e;
      // this.caricaQueryPCK(e.ID);
    }
  }

  premutoConfirmAgentsInfo(e) {
    this.mascheraModificaAttiva4 = true;
    this.selezione4 = '';
    this.TitoloMascheraModifica4 = 'Move Agents to the selected Agn Group';
  }

  premutoDeleteAgentsInfo(e) {
    this.Utils.scriveLog(e);
    // this.caricaAgent1();
    // return;

    const nomeTabella = 'agn__del';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_agn_code: e[0].AGN_CODE
    };

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);
      if (data.err_code !== 0) {
        this.Utils.visualizzaAlert(data.v_failure_reason);
      } else {
        this.caricaAgent1();
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });

  }

  chiudeMaschera4() {
    this.mascheraModificaAttiva4 = false;
  }

  clickSuCheckRiga4(e) {
    // this.Utils.scriveLog(e);
    this.agentSelezionati4 = e;
    this.confirmKey4 = true;
  }

  premutoConfirm4(e) {
    if (!this.agentSelezionati4) {
      Utils.messaggioDiErrore('null', 'Please select an Agent Group');
      return;
    }

    this.spostaAgents();
    this.mascheraModificaAttiva4 = false;

    // this.datiGriglia = undefined;
    this.refreshGrid1(null, false);
  }

  spostaAgents() {
    this.Utils.scriveLog('Riga agents', this.RigaSelezioneAgent1);
    this.Utils.scriveLog('Riga nuovo gruppo', this.agentSelezionati4);
    // // this.Utils.scriveLog(this.rigaSelezionata4);
    // return;
    let agent = this.RigaSelezioneAgent1;
    if (!agent[0]) {
      agent = [agent]
    }

    let gruppo = this.agentSelezionati4;
    if (!gruppo[0]) {
      gruppo = [gruppo]
    }
    logConsole('Nuovo agent/gruppo selezionato:', agent, gruppo, this.groupIdSelezionato);
    // return;

    const nomeTabella = 'agn__upd';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_id_list: agent[0].ID,
      v_description: agent[0].DESCRIPTION,
      v_agn_group_id: gruppo[0].ID
    };

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);
      this.mascheraModificaAttivaTestScenario = false;
      this.caricaAgent1();
      this.caricaAgentGroup(this.groupIdSelezionato);
    }, error => {
      this.caricamentoDatiInCorso3 = false;
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
  }

  apreCombo5() {
    if (!this.rigaSelezionataAgentProfile) {
      return;
    }
    this.mascheraModificaAttivaComboAgentProfile = true;
  }

  /* appoggioLS;

  checkLS(e) {
    this.appoggioLS = e;
  } */

  selectLov(e) {
    // logConsole('Valore lov', e);
    if (e) {
      if (typeof(e) === 'string') { // && e.indexOf('***') > -1) {
        e = e.replace('***', '');

        if (this.datiLov) {
          let trovato = false;
          let m = 0;
          const dsr = JSON.parse(JSON.stringify(this.datiLov));
          dsr.forEach(element => {
            if (!trovato && element.NAME === e) {
              trovato = true;
            }
            m++;
          });
          if (!trovato) {
            m++;
            const v2 = {
              ROW_ID: m,
              ID: e,
              NAME: e
            }
            dsr.push(v2);
            dsr.sort((a, b) => (a.NAME.localeCompare(b.NAME)));
          }
          this.datiLov = JSON.parse(JSON.stringify(dsr));
        }
        const tt = setTimeout(() => {
          clearTimeout(tt);

          this.lovSelezionato = e;
        }, 100);
      } else {
        this.lovSelezionato = e.ID;
      }
    } else {
      this.lovSelezionato = '';
    }
  }

  selectLovString(e) {
    logConsole('Valore lov string', e);
    if (e) {
      if (typeof(e) === 'string') { // && e.indexOf('***') > -1) {
        e = e.replace('***', '');

        if (this.datiLov) {
          let trovato = false;
          let m = 0;
          const dsr = JSON.parse(JSON.stringify(this.datiLov));
          dsr.forEach(element => {
            if (!trovato && element.NAME === e) {
              trovato = true;
            }
            m++;
          });
          if (!trovato) {
            m++;
            const v2 = {
              ROW_ID: m,
              ID: e,
              NAME: e
            }
            dsr.push(v2);
            dsr.sort((a, b) => (a.NAME.localeCompare(b.NAME)));
          }
          this.datiLov = JSON.parse(JSON.stringify(dsr));
        }
        const tt = setTimeout(() => {
          clearTimeout(tt);
          
          this.lovSelezionato = e;
        }, 100);
      } else {
        this.lovSelezionato = e.ID;
      }
    } else {
      this.lovSelezionato = '';
    }
  }

  toglieCssDaStringa(e) {
    if (e) {
      if (e.indexOf('***') > -1) {
        e = e.replace('***', '');
        const e2 = e.indexOf('***');
        if (e2 > -1) {
          e = e.substring(e2 + 3, e.length);
        }
        return e;
      } else {
        return e;
      }
    } else {
      return '';
    }
  }

  apreCombo5N2(cosa, daDove) {
    if (daDove === 'AGENTSPROFILE') {
      this.rigaSelezionataAgentProfile = [ cosa ];
    } else {
      if (daDove === 'TESTDESIGNCONFIG') {
        this.rigaSelezionata3 = [ cosa ];
      } else {
        if (daDove === 'TESTDESIGNCONFIG2') {
          this.rigaSelezionata62 = [ cosa ];
        }
      }
    }
    this.apreCombo5N(daDove);
  }

  apreCombo5N(daDove) {
    logConsole('Apre combo 5N da: ', daDove, this.rigaSelPerModificaN);

    this.agnProf = false;
    this.rigaSelPerModificaN = undefined;
    if (daDove === 'AGENTSPROFILE') {
      this.rigaSelPerModificaN = JSON.parse(JSON.stringify(this.rigaSelezionataAgentProfile[0]));
      this.modificaTDC = '1';
    } else {
      if (daDove === 'AGENTINFO') {
        this.rigaSelPerModificaN = JSON.parse(JSON.stringify(this.rigaSelezionataAI));
        // this.Utils.scriveLog(this.rigaSelPerModificaN);
        if (this.rigaSelPerModificaN.INFO_TYPE.indexOf('AGN_PROF') > -1) {
          this.agnProf = true;
          if (this.rigaSelPerModificaN.VALUE_PROF.indexOf('<default>') > -1) {
            this.opzione = 1;
          }
        }
        this.modificaTDC = '2';
      } else {
        if (daDove === 'TESTDESIGNCONFIG2') {
          this.rigaSelPerModificaN = JSON.parse(JSON.stringify(this.rigaSelezionata62[0]));
          this.rigaSelPerModificaN.DOMAIN_TYPE = this.toglieCssDaStringa(this.rigaSelPerModificaN.DOMAIN_TYPE);
          this.rigaSelPerModificaN.VALUE = this.toglieCssDaStringa(this.rigaSelPerModificaN.VALUE);
          this.rigaSelPerModificaN.DOMAIN_LOV = this.toglieCssDaStringa(this.rigaSelPerModificaN.DOMAIN_LOV);
          this.rigaSelPerModificaN.TS_CODE = this.toglieCssDaStringa(this.rigaSelPerModificaN.TS_CODE);
          this.rigaSelPerModificaN.TC_NAME = this.toglieCssDaStringa(this.rigaSelPerModificaN.TC_NAME);
          this.rigaSelPerModificaN.PRM_CODE = this.toglieCssDaStringa(this.rigaSelPerModificaN.PRM_CODE);
          while (this.rigaSelPerModificaN.DOMAIN_LOV.indexOf(',') > -1) {
            this.rigaSelPerModificaN.DOMAIN_LOV = this.rigaSelPerModificaN.DOMAIN_LOV.replace(',', '|');
          }
          // if (this.rigaSelPerModificaN.INFO_TYPE.indexOf('AGN_PROF') > -1) {
            this.agnProf = true;
            if (this.rigaSelPerModificaN.TS_SCHED_VALUE.indexOf('<default>') > -1) {
              this.opzione = 1;
            }
          // }
          this.modificaTDC = '5';
        } else {
          this.rigaSelPerModificaN = JSON.parse(JSON.stringify(this.rigaSelezionata3[0]));
          this.rigaSelPerModificaN.DOMAIN_TYPE = this.toglieCssDaStringa(this.rigaSelPerModificaN.DOMAIN_TYPE);
          this.rigaSelPerModificaN.VALUE = this.toglieCssDaStringa(this.rigaSelPerModificaN.VALUE);
          this.rigaSelPerModificaN.DOMAIN_LOV = this.toglieCssDaStringa(this.rigaSelPerModificaN.DOMAIN_LOV);
          this.rigaSelPerModificaN.TS_CODE = this.toglieCssDaStringa(this.rigaSelPerModificaN.TS_CODE);
          this.rigaSelPerModificaN.TC_NAME = this.toglieCssDaStringa(this.rigaSelPerModificaN.TC_NAME);
          this.rigaSelPerModificaN.PRM_CODE = this.toglieCssDaStringa(this.rigaSelPerModificaN.PRM_CODE);
          while (this.rigaSelPerModificaN.DOMAIN_LOV.indexOf(',') > -1) {
            this.rigaSelPerModificaN.DOMAIN_LOV = this.rigaSelPerModificaN.DOMAIN_LOV.replace(',', '|');
          }
          // if (this.rigaSelPerModificaN.INFO_TYPE.indexOf('AGN_PROF') > -1) {
          
          // alert(this.rigaSelPerModificaN.DOMAIN_TYPE + ' -> ' + this.rigaSelPerModificaN.DOMAIN_LOV);
          if (this.rigaSelPerModificaN.TS_SCHED_VALUE.indexOf('<default>') > -1) {
            this.opzione = 1;
          }
          
          this.agnProf = true;
        
          // }
          this.modificaTDC = '3';
        }
      }
    }
    if (!this.rigaSelPerModificaN) {
      return;
    }
    // // this.Utils.scriveLog(this.rigaSelPerModificaN);
    this.lovSelezionato = this.rigaSelPerModificaN.VALUE;

    /* if (this.modificaTDC) {
      this.datiLov = new Array();
      this.datiLov.push({ ID: 'Y', NAME: 'Y' });
      this.datiLov.push({ ID: 'N', NAME: 'N' });
    } else { */
    if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'LOV' || (this.rigaSelPerModificaN.DOMAIN_TYPE === 'string' && this.rigaSelPerModificaN.DOMAIN_LOV)) {
      const dLov1 = this.rigaSelPerModificaN.DOMAIN_LOV;
      const dLov2 = dLov1.split('|');
      this.datiLov = new Array();
      let ok = false;
      dLov2.forEach(element => {
        if (element === this.lovSelezionato) {
          ok = true;
        }
        this.datiLov.push({ ID: element, NAME: element });
      });
      if (!ok) {
        this.datiLov.push({ ID: this.lovSelezionato, NAME: this.lovSelezionato });
      }
    } else {
      if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'date') {
      } else {
        if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'integer' || this.rigaSelPerModificaN.DOMAIN_TYPE === 'decimal') {
        } else {
          if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'string') {
          } else {
            if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'not_editable') {
            }
          }
        }
      }
      // }
    }
    let titolo = this.rigaSelPerModificaN.PRM_NAME;
    if (!titolo) { titolo = this.rigaSelPerModificaN.NAME; }
    if (titolo.indexOf('***') > -1) {
      const t = titolo.split('***');
      titolo = t[2];
    }
    this.TitoloMascheraModificaCombo5N = titolo;
    this.mascheraModificaAttivaComboAgentProfileN = true;
  }

  pulisceListaActSet() {
    logConsole('Pulisco lista act set: ', this.listaActSet);
    this.listaActSet = '';
    this.selezioneDataAcquisition2 = [];
  }

  clickSelezioneDataAcquisition(e) {
    this.pulisceTcRunInfoFile = new Date().toString();
    this.pulisceListaActSet();

    this.rigaSelezionataDataAcquisition = e;

    this.agnGroup = this.rigaSelezionata.ACT_SET_NAME;

    const sInizio = e[0].DAY + ' 00:00:00.000';
    const sFine = e[0].DAY + ' 23:59:59.999';
    this.tmsPassati = sInizio + ';' + sFine;

    // this.stringaAGNCode = e[0].ACT_SET_NAME;
    // this.agnGroup = e[0].ACT_SET_NAME;

    this.Utils.scriveLog('Click su Data Acquisition', e, this.tmsPassati, this.agnGroup);

    this.caricaDataAcquisition2(e);
  }

  lastSelectedOfGridDataAcquisition(e) {

  }

  refreshDataAcquisition(e, r) {
    // this.vecchioDataAcquisition = '';
    if (r === true) {
      this.datiGrigliaDataAcquisition = undefined;
    }
    this.caricaDataAcquisition(this.groupIdSelezionato);
  }

  // vecchioDataAcquisition = '';

  ultimoTmsETLMon = -1;
  messaggioWarningDataAcquisition = '';

  caricaDataAcquisition(e) {
    if (!e && e !== 0) {
      return;
    }

    const nomeTabella = 'etl_monitor__grid';

    const t1 = new Date().getTime() - (this.lastDays2 * 24 * 60 * 60 * 1000);
    const sInizio = this.datePipe.transform(t1, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    const t2 = new Date().getTime() + (24 * 60 * 60 * 1000);
    const sFine = this.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:ss', 'UTC');

    this.ultimoTmsETLMon = new Date().getTime();

    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_group_id: e,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      v_caller_tag: this.ultimoTmsETLMon
    };
    /* if (JSON.stringify(params) === this.vecchioDataAcquisition) {
      return;
    }
    this.vecchioDataAcquisition = JSON.stringify(params); */
    // this.Utils.scriveLog('ETL Monitor', params);

    this.caricamentoDatiInCorso8 = true;

    this.datiGrigliaDataAcquisition2 = null;

    // this.datiGrigliaDataAcquisition = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso8 = false;
      // // this.Utils.scriveLog(data);
      if (data) {
        Utils.checkRitornoChiamata(this, data);

        if (!this.controllaRitornoChiamata(this, data, 'TsSchedLocal', this.ultimoTmsETLMon)) {
          return;
        }

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningDataAcquisition = data.v_grid_msg;
        } else {
          this.messaggioWarningDataAcquisition = '';
        }

        this.nomeGrigliaDataAcquisition = data.GridProperty[0].GridName;

        this.Utils.scriveLog('Dati griglia etl monitor', data);
        if (this.datiGrigliaDataAcquisition && this.datiGrigliaDataAcquisition.DataTable && this.datiGrigliaDataAcquisition.DataTable.length > 1) {
          this.datiGrigliaDataAcquisition.DataTable = data.DataTable;
          this.vecchiaStrutturaTCRUN3 = undefined;
          this.pulisceTcRunInfoFile = new Date().toString();
          this.datiGrigliaTcRunAct = null; // 'empty grid';

          if (this.datiGrigliaDataAcquisition && this.datiGrigliaDataAcquisition.DataTable &&
            this.datiGrigliaDataAcquisition.DataTable.length > 0) {
              if (this.rigaSelezionataDataAcquisition) {
                this.selezione8 = this.rigaSelezionataDataAcquisition[0].ROW_ID;
              }
          }
          // this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
        } else {
          // this.datiGrigliaDataAcquisition = null;
          // this.datiGrigliaDataAcquisition2 = null;
          this.pulisceTcRunInfoFile = new Date().toString();
          this.datiGrigliaDataAcquisition = JSON.parse(JSON.stringify(data));
          const tm = setTimeout(() => {
            clearTimeout(tm);
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              this.effettuaAutoFit8 = !this.effettuaAutoFit8;
              // this.datiGrigliaDataAcquisition2 = null; // 'empty grid';
              this.vecchiaStrutturaTCRUN3 = undefined;
              this.datiGrigliaTcRunAct = null; // 'empty grid';

              if (this.datiGrigliaDataAcquisition && this.datiGrigliaDataAcquisition.DataTable &&
                  this.datiGrigliaDataAcquisition.DataTable.length > 0) {
                this.rigaSelezionataDataAcquisition = this.datiGrigliaDataAcquisition.DataTable;

                this.selezione8 = this.rigaSelezionataDataAcquisition[0].ROW_ID;
              //   this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
              }
            }, 1000);
          }, 10);
        }
      } else {
        this.vecchiaStrutturaTCRUN3 = undefined;
        this.datiGrigliaDataAcquisition = null; // 'empty grid';
        this.datiGrigliaDataAcquisition2 = null; // 'empty grid';
        this.pulisceTcRunInfoFile = new Date().toString();
        this.datiGrigliaTcRunAct = null; // 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso8 = false;
      this.pulisceTcRunInfoFile = new Date().toString();
      // this.datiGrigliaDataAcquisition = null;
      // Utils.messaggioDiErrore(this.datiGrigliaDataAcquisition, error);
      // Utils.messaggioDiErrore(this.datiGrigliaDataAcquisition2, error);
      this.vecchiaStrutturaTCRUN3 = undefined;
      if (JSON.parse(error)._body) {
        this.datiGrigliaDataAcquisition = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        this.datiGrigliaDataAcquisition2 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
        this.datiGrigliaTcRunAct = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);;
      } else {
        this.datiGrigliaDataAcquisition = 'ERROR: ' + error;
        this.datiGrigliaDataAcquisition2 = 'ERROR: ' + error;
        this.datiGrigliaTcRunAct = 'ERROR: ' + error;
      }
    });
  }

  // vecchioFileHist = '';
  messaggioWarningDataAcquisition2 = '';

  caricaDataAcquisition2(e) {
    if (!e) {
      return;
    }
    const nomeTabella = 'file_hist__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_status: e[0].STATUS,
      v_tms_min: '1972-01-01 00:00:00',
      v_tms_max: '3999-12-31 23:59:59',
      v_time_aggr: e[0].TIME_AGGR,
      v_agn_group_id: this.agnGroupID
    };
    /* if (JSON.stringify(params) === this.vecchioFileHist) {
      return;
    }
    this.vecchioFileHist = JSON.stringify(params); */

    this.rigaSelezionataDataAcquisition2 = null;

    this.caricamentoDatiInCorsoDataAcquisition2 = true;
    // this.datiGrigliaDataAcquisition2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorsoDataAcquisition2 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        this.nomeGrigliaDataAcquisition2 = data.GridProperty[0].GridName;

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningDataAcquisition2 = data.v_grid_msg;
        } else {
          this.messaggioWarningDataAcquisition2 = '';
        }

        // // this.Utils.scriveLog(data);
        if (this.datiGrigliaDataAcquisition2 && this.datiGrigliaDataAcquisition2 !== 'empty grid'
          && this.datiGrigliaDataAcquisition2.DataTable
          && this.datiGrigliaDataAcquisition2.DataTable.length > 0 && data.DataTable) {
          this.datiGrigliaDataAcquisition2.DataTable = data.DataTable;

          this.vecchiaStrutturaTCRUN3 = undefined;
          this.datiGrigliaTcRunAct = null; // 'empty grid';

          if (this.datiGrigliaDataAcquisition2 && this.datiGrigliaDataAcquisition2.DataTable &&
            this.datiGrigliaDataAcquisition2.DataTable.length > 0) {
            this.rigaSelezionataDataAcquisition2 = this.datiGrigliaDataAcquisition2.DataTable;
            // this.selezioneDataAcquisition2 = this.rigaSelezionataDataAcquisition2[0].ROW_ID;

            //   this.caricaTcRunAct();
          }
        } else {
          // this.datiGrigliaDataAcquisition2 = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGrigliaDataAcquisition2 = JSON.parse(JSON.stringify(data));
            this.pulisceTcRunInfoFile = new Date().toString();
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              this.effettuaAutoFitDataAcquisition2 = !this.effettuaAutoFitDataAcquisition2;
              // const tm = setTimeout(() => {
                this.vecchiaStrutturaTCRUN3 = undefined;
                this.datiGrigliaTcRunAct = null; // 'empty grid';

              if (this.datiGrigliaDataAcquisition2 && this.datiGrigliaDataAcquisition2.DataTable &&
                  this.datiGrigliaDataAcquisition2.DataTable.length > 0) {
                  this.rigaSelezionataDataAcquisition2 = this.datiGrigliaDataAcquisition2.DataTable;
                  // this.selezioneDataAcquisition2 = this.rigaSelezionataDataAcquisition2[0].ROW_ID;

                  //     this.caricaTcRunAct();
              }
              // }, 1000);
            }, 500);
          }, 500);
        }
      } else {
        this.vecchiaStrutturaTCRUN3 = undefined;
        this.pulisceTcRunInfoFile = new Date().toString();
        this.datiGrigliaDataAcquisition2 = null; // 'empty grid';
        this.datiGrigliaTcRunAct = null; // 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorsoDataAcquisition2 = false;
      this.pulisceTcRunInfoFile = new Date().toString();
      // this.datiGrigliaDataAcquisition2 = null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  selezionaTutteLeRigheAgent2(e, quali) {
    logConsole('Selezionate tutte le righe agent 2', quali);

    if (quali) {
      this.selezionatiTcRun2 = true;
    } else {
      this.selezionatiTcRun2 = false;
    }
  }

  selezioneTutteLeRigheDA2(e, quali) {
    logConsole('Selezionate tutte le righe DA2', quali);

    if (quali) {
      this.selezioneByDay = true;
    } else {
      this.selezioneByDay = false;
    }
  }

  selezioneTutteLeRigheTcRun2Act(e, quali) {
    logConsole('Selezionate tutte le righe TcRunAct2', quali);

    if (quali) {
      this.selezionatiTcRun3 = true;
    } else {
      this.selezionatiTcRun3 = false;
    }
  }

  listaActSet = '';
  listaRigheByDay;
  selezioneByDay = false;

  clickSelezioneCheckDataAcquisition2(e) {
    logConsole('Click selezione check by day', e);
    if (e && e.dati && e.dati.length > 0) {
      this.selezioneByDay = true;
    } else {
      this.selezioneByDay = false;
    }
    let listaActSet = '';
    if (e && e.dati) {
      this.actSelezionataPerEdit = e.dati[0];
      let ok = false;
      e.dati.forEach(element => {
        listaActSet += element.ACT_ID + '|';
        if (!ok) {
          ok = true;
          this.ACT_TAG1 =element.ACT_TAG1;
          this.ACT_TAG2 =element.ACT_TAG2;
        }
      });
      if (listaActSet.length > 0) {
        listaActSet = listaActSet.substring(0, listaActSet.length - 1);
        listaActSet = '[ACT ID] ' + listaActSet
      }
    } else {
      this.actSelezionataPerEdit = undefined;
    }
    this.listaActSet = listaActSet;
    this.listaRigheByDay = e;
    logConsole('Righe selezionate by day', e);
  }

  clickSelezioneDataAcquisition2(e) {
    this.rigaSelezionataDataAcquisition2 = e;

    if ((e && e.ACT_SET_NAME ) || (e[0] && e[0].ACT_SET_NAME)) {
      if (!e[0]) { e = [e]; }
      // this.agnGroup = e[0].ACT_SET_NAME;
      this.agnGroup = '[ACT] ' + e[0].ACT_NAME;
      this.listaActSet = '[ACT ID] ' + e[0].ACT_ID;

      // AGGIUNTO PER GESTIONE PIANTINA 19/11/2024
      this.stringaAGNCode = e[0].ACT_NAME;
      // logConsole('Agn per piantina', this.stringaAGNCode);
      // AGGIUNTO PER GESTIONE PIANTINA 19/11/2024

      const sInizio = e[0].DATA_MIN_TMS;
      const sFine = e[0].DATA_MAX_TMS;
      this.tmsPassati = sInizio + ';' + sFine;

      // this.stringaAGNCode = e[0].ACT_SET_NAME;
      // this.agnGroup = e[0].ACT_SET_NAME;

      this.Utils.scriveLog('Click su Data Acquisition 2', e, this.tmsPassati, this.agnGroup);

      const tm = setTimeout(() => {
        clearTimeout(tm);

        let c = e[0].CENTER;
        if (c && c !== null) {
          c = c.replace('POINT(', '').replace(')', '').replace(' ', ';');
          // // this.Utils.scriveLog(c);
          this.coordinate = c;
        }
      }, 1000);

      this.caricaTcRunAct();
    }
  }

  lastSelectedOfGridDataAcquisition2(e) {

  }

  refreshGridDataAcquisition2(e, r) {
    // this.vecchioFileHist = '';
    if (r === true) {
      this.datiGrigliaDataAcquisition2 = undefined;
    }
    this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
  }

  // vecchioAgentInfo = '';
  messaggioWarningAgentInfo = '';

  caricaTabellaAgentInfo(e) {
    let ID = '';
    if (e && e.ID) { 
      ID = e.ID; 
    } else { 
      if (e && e[0] && e[0].ID) { ID = e[0].ID; } 
    }
    if (!ID) {
      console.error('ID Vuoto: ', e);
      return;
    }

    const nomeTabella = 'agn_info__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_id: ID
    };
    /* if (JSON.stringify(params) === this.vecchioAgentInfo) {
      return;
    }
    this.vecchioAgentInfo = JSON.stringify(params); */

    this.caricamentoDatiInCorso42 = true;
    // // this.Utils.scriveLog('Parametri Agent Info', params);

    // this.datiGrigliaAgentInfo = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso42 = false;
      if (data && data !== null && data.DataTable && data.DataTable.length > 0) {
        Utils.checkRitornoChiamata(this, data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningAgentInfo = data.v_grid_msg;
        } else {
          this.messaggioWarningAgentInfo = '';
        }

        this.nomeGrigliaAgentInfo = data.GridProperty[0].GridName;

        // // this.Utils.scriveLog('Agent Info:', data.DataTable);
        if (this.datiGrigliaAgentInfo && this.datiGrigliaAgentInfo !== 'empty grid' && this.datiGrigliaAgentInfo.DataTable
          && this.datiGrigliaAgentInfo.DataTable.length > 1) {
            this.datiGrigliaAgentInfo.DataTable = data.DataTable;
            // // this.Utils.scriveLog('Agent Info2:', this.datiGrigliaAgentInfo);
        } else {
          // this.datiGrigliaAgentInfo = null;
          this.datiGrigliaAgentInfo = JSON.parse(JSON.stringify(data));
          const tm = setTimeout(() => {
            clearTimeout(tm);
            // // this.Utils.scriveLog('Agent Info4:', this.datiGrigliaAgentInfo);
            this.effettuaAutoFitAgentInfo = !this.effettuaAutoFitAgentInfo;
          }, 10);
        }
      } else {
        this.Utils.scriveLog('AZZERO 5');
        this.datiGrigliaAgentInfo = null; // 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso42 = false;
      this.Utils.scriveLog('AZZERO 6');
      // this.datiGrigliaAgentInfo = null;
      // Utils.messaggioDiErrore(this.datiGrigliaAgentInfo, error);
      if (JSON.parse(error)._body) {
        this.datiGrigliaAgentInfo = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      } else {
        this.datiGrigliaAgentInfo = 'ERROR: ' + error;
      }
    });
  }

  clickSelezioneAgentInfo(e) {
    // this.Utils.scriveLog('Click su Agent info', e);
    // this.stringaAGNCode = e[0].ACT_SET_NAME;
    // this.agnGroup = e[0].ACT_SET_NAME;
    this.rigaSelezionataAgentInfo2 = e;
  }

  clickAgentInfoN(e) {
    // // this.Utils.scriveLog(e);
    // return;
    // // this.Utils.scriveLog(this.rigaSelezionataAgentInfo);
    // logConsole('Click su riga agent conf', e);
    this.rigaSelezionataAI = e.dati;
    this.apreCombo5N('AGENTINFO');
  }

  lastSelectedOfGridAgentInfo(e) {

  }

  refreshAgentInfo(e, r) {
    // this.vecchioAgentInfo = '';
    if (r === true) {
      this.datiGrigliaAgentInfo = undefined;
    }
    this.caricaTabellaAgentInfo(this.RigaSelezioneAgent1);
  }

  dragEndMappa(e) {
    this.refreshMappa = !this.refreshMappa;
  }

  // GESTIONE EDIT-NEW GRIGLIA 1
  editPremuto1(e) {
    // logConsole('Edit premuto:', e);
    let r = this.rigaSelezionata;
    /* let ok = false;
    this.datiGriglia.DataTable.forEach(element => {
      if (!ok && +element.ROW_ID === +e) {
        r = element;
        ok = true;
      }
    });
    if (!ok) {
      return;
    }
    // logConsole('Conversione premuto:', r); */
    // // this.Utils.scriveLog(r);
    if (r[0]) { r = r[0]; }
    logConsole('Agent update', r);
    this.TitoloMascheraModifica1 = 'Edit Agent Group';
    this.modificaOInserimento1 = 'MODIFICA';
    this.mascheraModificaAttiva1 = true;
    this.rigaOriginale1 = JSON.parse(JSON.stringify(r))
    this.rigaModificata1 = JSON.parse(JSON.stringify(r));
    // this.Utils.scriveLog(this.rigaModificata1);
  }

  newPremuto1(e) {
    // // this.Utils.scriveLog(this.rigaSelezionata[0]);
    // return;

    this.TitoloMascheraModifica1 = 'Add new Agent Group';
    this.modificaOInserimento1 = 'INSERIMENTO';
    this.mascheraModificaAttiva1 = true;
    // this.rigaModificata1 = JSON.parse(JSON.stringify(this.rigaSelezionata[0]));
    this.rigaModificata1 = {
      NAME: '',
      FOLDER: '',
      DESCRIPTION: '',
      AGN_PROF_ID: '',
      QUERY_PCK_ID: '',
    };
    this.rigaOriginale1 = JSON.parse(JSON.stringify(this.rigaModificata1));
  }

  deletePremuto1(e) {
    // this.Utils.scriveLog(this.rigaSelezionata);
    // return;
    // if (confirm('Do you want delete selected row ?')) {
      let id;
      if (this.rigaSelezionata[0]) {
        id = this.rigaSelezionata[0].ID;
      } else {
        if (this.rigaSelezionata) {
          id = this.rigaSelezionata.ID;
        } else {
          return;
        }
      }

      const nomeTabella = 'agn_group__del';
      const params = {
        v_cntx: this.sessionService.getToken(),
        v_id: id
      };

      this.apiService.chiamataPost('' + nomeTabella, params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        Utils.checkRitornoChiamata(this, data);

        this.caricaTabella('Delete premuto');
      }, error => {
        Utils.messaggioDiErrore('null', 'DELETE:' + error);
      });
    // }
  }

  chiudeMaschera1() {
    this.Utils.scriveLog('Nuova', this.rigaModificata1);
    this.Utils.scriveLog('Vecchia', this.rigaOriginale1);
    if (JSON.stringify(this.rigaModificata1) !== JSON.stringify(this.rigaOriginale1)) {
      const messaggio = 'Do you want to lose the changes made?';
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
          this.mascheraModificaAttiva1 = false;
          this.modificaOInserimento1 = '';
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
      return;
  
      if (confirm('do you want to lose the changes made?')) {
        this.mascheraModificaAttiva1 = false;
        this.modificaOInserimento1 = '';
      }
    } else {
      this.mascheraModificaAttiva1 = false;
      this.modificaOInserimento1 = '';
    }
  }

  selectActive1(e) {
    // // this.Utils.scriveLog(e);
    this.rigaModificata1.IS_ACTIVE = e.ID;
  }

  salvaDati1() {
    this.Utils.scriveLog(this.rigaModificata1);

    let nomeTabella = '';
    let params;

    if (!this.appoggioAP2) {
      alert('Please insert Folder')
      return;
    }
    if (!this.rigaModificata1.AGN_PROF_ID) {
      alert('Please insert AGN PROF')
      return;
    }
    if (!this.appoggioAG) {
      alert('Please insert OPERATOR GROUP')
      return;
    }
    // // logConsole('FOLDER 1: ', this.appoggioAP2);

    this.rigaModificata1.FOLDER = this.appoggioAP2;

    let dsr = JSON.parse(JSON.stringify(this.datiAgnGroupFolder));
    let trovato = false;
    let m = 0;
    dsr.forEach(element => {
      if (!trovato && element.value_str === this.appoggioAP2) {
        trovato = true;
      }
      m++;
    });

    // // logConsole('FOLDER 2: ', dsr, trovato);

    if (!trovato) {
      m++;
      const v2 = {
        ROW_ID: m,
        value_str: this.appoggioAP2
      }
      dsr.push(v2);
      dsr.sort((a, b) => (a.value_str.localeCompare(b.value_str)));
    }

    this.datiAgnGroupFolder = JSON.parse(JSON.stringify(dsr));

    // // logConsole('AGN PROF ID: ', this.appoggioAP22);

    // this.rigaModificata1.AGN_PROF_ID = this.appoggioAP22;

    /* dsr = JSON.parse(JSON.stringify(this.datiAgnProf));
    trovato = false;
    m = 0;
    dsr.forEach(element => {
      if (!trovato && element.ID === this.appoggioAP22) {
        trovato = true;
      }
      m++;
    });

    // // logConsole('AGN PROF ID: ', dsr, trovato);

    if (!trovato) {
      m++;
      const v2 = {
        ROW_ID: m,
        ID: this.appoggioAP22,
        NAME: this.appoggioAP22
      }
      dsr.push(v2);
      
      // // logConsole('dsr:', dsr);

      dsr.sort((a, b) => (a.ID.localeCompare(b.ID)));
    }

    this.datiAgnProf = JSON.parse(JSON.stringify(dsr)); */

    // // logConsole('AGN PROF ID: ', this.appoggioAG, this.datiOperatorGroup);

    this.rigaModificata1.OPERATOR_GROUP_ID = this.appoggioAG;

    dsr = JSON.parse(JSON.stringify(this.datiOperatorGroup));
    trovato = false;
    m = 0;
    dsr.DataTable.forEach(element => {
      if (!trovato && element.GROUP_ID === this.appoggioAG) {
        trovato = true;
      }
      m++;
    });

    // // logConsole('AGN PROF ID: ', dsr, trovato);

    if (!trovato) {
      m++;
      const v2 = {
        ROW_ID: m,
        ID: this.appoggioAG,
        NAME: this.appoggioAG
      }
      dsr.push(v2);
      dsr.sort((a, b) => (a.NAME.localeCompare(b.NAME)));
    }

    this.datiOperatorGroup = JSON.parse(JSON.stringify(dsr));

    switch (this.modificaOInserimento1) {
      case 'MODIFICA':
        nomeTabella = 'agn_group__upd';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.rigaModificata1.ID,
          v_name: this.rigaModificata1.NAME,
          v_description: this.rigaModificata1.DESCRIPTION,
          v_folder: this.rigaModificata1.FOLDER,
          v_agn_prof_id: this.rigaModificata1.AGN_PROF_ID,
          v_query_pck_id: this.rigaModificata1.QUERY_PCK_ID,
          v_operator_group_id: this.rigaModificata1.OPERATOR_GROUP_ID,
        };
        break;
      case 'INSERIMENTO':
        nomeTabella = 'agn_group__ins';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_name: this.rigaModificata1.NAME,
          v_description: this.rigaModificata1.DESCRIPTION,
          v_folder: this.rigaModificata1.FOLDER,
          v_agn_prof_id: this.rigaModificata1.AGN_PROF_ID,
          v_query_pck_id: null // this.rigaModificata1.QUERY_PCK_ID,
        };
        break;
    }
    // this.Utils.scriveLog('Salvataggio dati AGN Group', params, this.rigaModificata1);
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);

      this.caricaTabella('Salva dati');

      this.mascheraModificaAttiva1 = false;
      this.modificaOInserimento1 = '';
    }, error => {
      Utils.messaggioDiErrore('null', this.modificaOInserimento1 + ':' + error);
    });
  }

  appoggioAP2;

  checkAP2(e) {
    this.appoggioAP2 = e;
  }

  selectAgnProf2(e) {
    if (e) {
      // this.Utils.scriveLog(e, typeof(e));
      if (typeof(e) === 'string') { // && e.indexOf('***') > -1) {
        // this.rigaModificata1.FOLDER = e.replace('***', '');
      } else {
        this.rigaModificata1.FOLDER = e.value_str;
        this.appoggioAP2 = e.value_str;
      }
      // this.Utils.scriveLog(this.rigaModificata1.FOLDER);
      // this.caricaAgnProf(e.ID);
    }
  }

  /* appoggioAP22;

  checkAP22(e) {
    this.appoggioAP22 = e;
  } */

  selectAgnProf22(e) {
    /* if (e) {
      if (typeof(e) === 'string') { // && e.indexOf('***') > -1) {
        // this.rigaModificata1.FOLDER = e.replace('***', '');
        
      } else {
        this.rigaModificata1.AGN_PROF_ID = e.ID;
      }
      // this.caricaAgnProf(e.ID);
    } */

    logConsole('Agn prof scelto: ', e);

    if (e) {
      if (typeof(e) === 'string') {
        const ee = e.replace('***', '');
      
        let ok = false;
        let q = 0;
        this.datiAgnProf.forEach(element => {
          if (element.ID === ee) {
            ok = true;
          }
          if (element.ROW_ID > q) {
            q = element.ROW_ID;
          }
        });
        
        if (!ok) {
          // logConsole('PL', this.datiPartitionLabel);
          const app = JSON.parse(JSON.stringify(this.datiAgnProf));
          const s =  { ROW_ID: q + 1, ID: ee, NAME: ee };
          app.push (s);
          // app.sort((a, b) => (a.CODE_STR).localeCompare(b.CODE_STR));

          this.datiAgnProf = JSON.parse(JSON.stringify(app));

          const tm = setTimeout(() => {
            clearTimeout(tm);

            this.rigaModificata1.AGN_PROF_ID = ee;
          }, 100);
        }
      } else {
        if (e.ID) {
          this.rigaModificata1.AGN_PROF_ID = e.ID;
        }
      }
    } else {
      this.rigaModificata1.AGN_PROF_ID = '';
    }
  }

  appoggioAG;

  checkAG(e) {
    this.appoggioAG = e;
  }

  selectAgnGroup(e) {
    if (e) {
      if (typeof(e) === 'string') {
      } else {
        // this.Utils.scriveLog(e);
        this.rigaModificata1.OPERATOR_GROUP_ID = e.GROUP_ID;
        this.appoggioAG = e.GROUP_ID;
        // this.caricaAgnProf(e.ID);
      }
    }
  }

  daEliminare;
  actSetRecDaEliminare;
  mostraEliminazione = false;
  actSetEliminante;

  premutoDeleteActSetRec(e) {
    const grigliaDaPassare = JSON.parse(JSON.stringify(this.datiGrigliaDataAcquisition2));
    grigliaDaPassare.DataTable = e;
    this.datiGrigliaCheck = JSON.parse(JSON.stringify(grigliaDaPassare));
    this.modalitaCheckPopup = 'delete_act_set_rec';
    this.operazioneCheckPopup = 'Delete';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  premutoDeleteActSetRec1(e) {
    logConsole('ACt Set Rec da eliminare', e);
    this.daEliminare = 0;
    this.actSetRecDaEliminare = e;
    this.mostraEliminazione = true;
    this.premutoDeleteActSetRec2();
  }

  premutoDeleteActSetRec2() {
    let e = this.actSetRecDaEliminare[this.daEliminare];
    if (e && !e[0]) {
      e = [e];
    }

    if (e && e[0]) {
      const id = e[0].ACT_ID;

      this.actSetEliminante = id;

      const params = '{' +
        '"v_cntx": "' + this.sessionService.getToken() + '",' +
        '"v_act_id": ' + id + '' +
      '}';
      logConsole('Eliminazione actsetrec', id, e, this.daEliminare, JSON.parse(params));
      this.apiService.chiamataPost('geo_act__del', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        Utils.checkRitornoChiamata(this, data);

        // this.Utils.scriveLog('Delete Act Set Rec return:', data);
        if (+data[0].v_err_code === 0) {
          this.daEliminare++;
          if (this.daEliminare < this.actSetRecDaEliminare.length) {
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.premutoDeleteActSetRec2();
            }, 100);
          } else {
            this.mostraEliminazione = false;
            this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
          }
        } else {
          // alert(data[0].v_failure_reason);
          this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
        }
      }, error => {
        // alert(error);
      });
    }
  }

  premutoDeleteActSetRecHistGrid(e) {
    // this.Utils.scriveLog('Premuto delete', e);
    if (e && e[0]) {
      const id = e[0].ACT_ID;

      const params = '{' +
        '"v_cntx": "' + this.sessionService.getToken() + '",' +
        '"v_act_id": ' + id + '' +
      '}';
      this.apiService.chiamataPost('geo_act__del', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        Utils.checkRitornoChiamata(this, data);

        // this.Utils.scriveLog('Delete Act Set Rec return:', data);
        if (+data[0].v_err_code === 0) {
          this.caricaHistGrid();
        } else {
          // alert(data[0].v_failure_reason);
          this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
        }
      }, error => {
        // alert(error);
      });
    }
  }

  premutoDeleteActSetRecActivityTS(e) {
    // this.Utils.scriveLog('Premuto delete', e);
    if (e && e[0]) {
      const id = e[0].ACT_ID;

      const params = '{' +
        '"v_cntx": "' + this.sessionService.getToken() + '",' +
        '"v_act_id": ' + id + '' +
      '}';
      this.apiService.chiamataPost('geo_act__del', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        Utils.checkRitornoChiamata(this, data);

        // this.Utils.scriveLog('Delete Act Set Rec return:', data);
        if (+data[0].v_err_code === 0) {
          this.caricaActivityTS();
        } else {
          // alert(data[0].v_failure_reason);
          this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
        }
      }, error => {
        // alert(error);
      });
    }
  }

  mostraPopup(Messaggio, Dialog, Cosa) {
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
      this.Utils.scriveLog('The dialog was closed', result);
      // this.animal = result;
    });
  }

  appoggioAC;

  checkAC(e) {
    this.appoggioAC = e;
  }

  selectAgentCode(e) {
    if (e) {
      if (typeof(e) === 'string') {
      } else {
        // this.Utils.scriveLog(e);
        this.agentCodeMod = e.AGN_CODE;
        this.appoggioAC = e.AGN_CODE;
        this.creaNomeScenario();
      }
    }
  }

  onTabChanged4(e) {
    return;

    this.visualizzataPivot = false;

    // alert('4');
    this.Utils.scriveLog('Cambio tab 4: ', e.tab.textLabel, e.index);
    if (this.vecchioTab4 === e.index) {
      // return;
    }
    this.vecchioTab4 = e.index;
    
    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (e.index === 4) {
        this.visualizzataPivot = true;
      }

      if (e.tab.textLabel === 'AgnGroup Prof') {
        // AGENT GROUP PROFILE
        this.effettuaAutoFit5 = !this.effettuaAutoFit5;
      }
      if (e.tab.textLabel === 'Local Test Lib') {
        // TEST DESIGN LIBRARY
        this.effettuaAutoFit6 = !this.effettuaAutoFit6;
        this.effettuaAutoFit62 = !this.effettuaAutoFit62;
      }
    }, 1000);
  }

  onTabChanged3(e) {
    return;

    // alert('3');
    this.Utils.scriveLog('Cambio tab 3: ', e.tab.textLabel, e.index);
    if (this.vecchioTab3 === e.index) {
      // return;
    }
    this.vecchioTab3 = e.index;
    this.tabAperto = e.tab.textLabel.toUpperCase().trim();

    // alert(e.tab.textLabel);
    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (e.tab.textLabel === 'Configuration') {
        // TEST SCENARIO CONF
        this.effettuaAutoFitTS2 = !this.effettuaAutoFitTS2;
      }
      if (e.tab.textLabel === 'Test Run') {
        // TEST RUN
        this.effettuaAutoFitActivityTS = !this.effettuaAutoFitActivityTS;
        this.effettuaAutoFitTcRun = !this.effettuaAutoFitTcRun;
      }
    }, 1000);
  }

  onTabChanged2(e) {
    return;

    // alert('2');
    this.Utils.scriveLog('Cambio tab 2: ', e.tab.textLabel, e.index);
    if (this.vecchioTab2 === e.index) {
      // return;
    }
    this.vecchioTab2 = e.index;
    this.tabAperto = e.tab.textLabel.toUpperCase().trim();

    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (e.tab.textLabel === 'Tests') {
        // TESTS
        this.effettuaAutoFitHistGrid = !this.effettuaAutoFitHistGrid;
      }        
      if (e.tab.textLabel === 'Agent Conf') {
        // AGENT CONF
        this.effettuaAutoFit4 = !this.effettuaAutoFit4;
        this.effettuaAutoFitAgentInfo = !this.effettuaAutoFitAgentInfo;
      }        
    }, 1000);
  }

  onTabChanged(e) {
    return;
    
    // alert('1');
    this.Utils.scriveLog('Cambio tab: ', e.tab.textLabel, e.index, this.vecchioTab, e.index);
    if (this.vecchioTab === e.index) {
      // return;
    }
    this.vecchioTab = e.index;
    this.tabAperto = e.tab.textLabel.toUpperCase().trim();

    // this.apertoTcRun = -1;
    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (e.tab.textLabel === 'Query Package') {
        this.effettuaAutoFit7 = !this.effettuaAutoFit7;
      }
      if (e.tab.textLabel === 'Agent\'s Tests') {
        // AGENT'S TEST RUNS
        this.effettuaAutoFitAgent1 = !this.effettuaAutoFitAgent1;
      }
      if (e.tab.textLabel === 'Test Scenario') {
        // TEST SCENARIO
        this.effettuaAutoFitTS = !this.effettuaAutoFitTS;
      }
      if (e.tab.textLabel === 'Tickets') {
        // TICKET
        this.effettuaAutoFitTicket = !this.effettuaAutoFitTicket;
      }
      if (e.tab.textLabel === 'Ad hoc test') {
        // AD HOC TEST
        this.effettuaAutoFit2 = !this.effettuaAutoFit2;
        this.effettuaAutoFitTcRun = !this.effettuaAutoFitTcRun;
      }
      if (e.tab.textLabel === 'All Tickets') {
        // MONITORING
        this.effettuaAutoFitTicket = !this.effettuaAutoFitTicket;
      }
      if (e.tab.textLabel === 'Monitoring') {
        // MONITORING
        if (e.tab.textLabel === 'Monitoring') {
          if (this.datiGrigliaTestExManDati && this.datiGrigliaTestExManDati !== 'empty grid') {
            const dataD = JSON.parse(JSON.stringify(this.datiGrigliaTestExManDati));
            this.datiGrigliaTestExManDati = null;
            const tm2 = setTimeout(() => {
              clearTimeout(tm2);

              this.datiGrigliaTestExManDati = JSON.parse(JSON.stringify(dataD));
              this.datiGrigliaTcRun = null; // 'empty grid';
            }, 500);
          }
        }
        // this.apertoTcRun = 2;
      }
      if (e.tab.textLabel === 'Activities by day') {
        // ACTIVITIES
        this.effettuaAutoFit8 = !this.effettuaAutoFit8;
        this.effettuaAutoFitDataAcquisition2 = !this.effettuaAutoFitDataAcquisition2;
        this.effettuaAutoFitTcRunAct = !this.effettuaAutoFitTcRunAct;
      }
      if (e.tab.textLabel === 'Agent Group Conf') {
        // AGENT GROUP PROFILE
        this.effettuaAutoFit5 = !this.effettuaAutoFit5;
        this.effettuaAutoFit6 = !this.effettuaAutoFit6;
        this.effettuaAutoFit62 = !this.effettuaAutoFit62;
      }
    }, 1000);
  }

  righeSelezionateTS;
    
  premutoCheckTestScenario(e) {
    this.rigaSelezionata2 = e.dati; // [e.dati[e.dati.length - 1]];
    // this.selezione2 = [this.rigaSelezionata2[0].ROW_ID];
    // this.righeSelezionateTS = e.dati;
    logConsole('Premuto check test scenario', this.rigaSelezionata2, e);
  }

  numeroRunTS = 0;

  runKeyPremuto(e) {
    const grigliaDaPassare = JSON.parse(JSON.stringify(this.datiGrigliaTestScenario));
    grigliaDaPassare.DataTable = e;
    this.datiGrigliaCheck = JSON.parse(JSON.stringify(grigliaDaPassare));
    this.modalitaCheckPopup = 'run_stop_scenario';
    this.operazioneCheckPopup = 'Run / Stop Scenario';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  runKeyPremuto1(e) {
    this.rigaSelezionata2 = new Array();
    e.forEach(element => {
      this.rigaSelezionata2.push(element);
    });
    // logConsole('Click run', this.rigaSelezionata2);

    if (!this.rigaSelezionata2) {
      const messaggio = 'Please select rows';
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
      });
      return;
    }
    this.numeroRunTS = 0;

    // logConsole('RUN', this.rigaSelezionata2, this.rigaSelezionata2[this.numeroRunTS]);
    this.runKeyPremuto2(this.rigaSelezionata2[this.numeroRunTS]);
  }

  runKeyPremuto2(e) {
    if (e && !e[0]) { e = [e]; }

    // this.Utils.scriveLog(e);
    if (e && e[0]) {
      const id = e[0].TS_SCHED_ID;

      const params = '{' +
        '"v_cntx": "' + this.sessionService.getToken() + '",' +
        '"v_id": ' + id + '' +
      '}';
      this.apiService.chiamataPost('ts_sched__run', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        Utils.checkRitornoChiamata(this, data);

        // this.Utils.scriveLog('Delete Act Set Rec return:', data);
        if (+data.err_code === 0) {
          // this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
          this.numeroRunTS++;
          if (this.numeroRunTS < this.rigaSelezionata2.length) {
            this.runKeyPremuto2(this.rigaSelezionata2[this.numeroRunTS]);
          } else {
            this.refreshGridTestScenario(null, false);
          }
          // this.mostraPopup('Test scenario runned', false, '');
        } else {
          // alert(data[0].v_failure_reason);
          this.mostraPopup('Error: ' + data.failure_reason, false, '');
        }
      }, error => {
        // alert(error);
      });
    }
  }

  premutoWorkSpace(e, Cosa) {
    this.Utils.scriveLog(e, Cosa);
    // return;

    let activitySetName = '';
    let start = '';
    let stop ='';
    let tI;
    let tF;

    switch (Cosa) {
      case 'AGENTGROUP':
        let rd = this.rigaSelezionata;
        if (rd[0]) { rd = rd[0]; }
        activitySetName = rd.ACT_SET_NAME;
        this.Utils.scriveLog(this.rigaSelezionata);
        tI = new Date().getTime() - (24 * 60 * 60 * 1000);
        tF = new Date().getTime();
        start = this.datePipe.transform(tI, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        stop = this.datePipe.transform(tF, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        break;
      case 'AGENTS':
        let rc = this.RigaSelezioneAgent1;
        if (!rc[0]) { rc = [rc]; }
        activitySetName = rc[0].ACT_SET_NAME;
        this.Utils.scriveLog(this.RigaSelezioneAgent1);
        tI = new Date().getTime() - (24 * 60 * 60 * 1000);
        tF = new Date().getTime();
        start = this.datePipe.transform(tI, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        stop = this.datePipe.transform(tF, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        break;
      case 'AGENTSINFO':
        let rb = this.rigaSelezionataAgentInfo;
        if (!rb[0]) { rb = [rb]; }
        activitySetName = rb[0].ACT_SET_NAME;
        this.Utils.scriveLog(rb[0].ACT_SET_NAME);
        tI = new Date().getTime() - (24 * 60 * 60 * 1000);
        tF = new Date().getTime();
        start = this.datePipe.transform(tI, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        stop = this.datePipe.transform(tF, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        break;
      case 'HIST_GRID':
        this.Utils.scriveLog(this.RigaSelezioneHistGrid);
        let ra;
        if (this.RigaSelezioneHistGrid[0]) {
          activitySetName = '[ACT] ' + this.RigaSelezioneHistGrid[0].ACT_NAME;
          ra = this.RigaSelezioneHistGrid;
        } else {
          activitySetName = '[ACT] ' +this.RigaSelezioneHistGrid.ACT_NAME;
          ra = [this.RigaSelezioneHistGrid];
        }
        // activitySetName = activitySetName.replace('[ACT ID]', '[ACT]');
        start = ra[0].DATA_MIN_TMS;
        stop = ra[0].DATA_MAX_TMS;
        break;
      case 'HIST_GRID2':
        this.Utils.scriveLog(this.RigaSelezioneActivityTS);
        let ra2;
        if (this.RigaSelezioneActivityTS[0]) {
          activitySetName = '[ACT] ' + this.RigaSelezioneActivityTS[0].ACT_NAME;
          ra2 = this.RigaSelezioneActivityTS;
        } else {
          activitySetName = '[ACT] ' +this.RigaSelezioneActivityTS.ACT_NAME;
          ra2 = [this.RigaSelezioneActivityTS];
        }
        // activitySetName = activitySetName.replace('[ACT ID]', '[ACT]');
        start = ra2[0].DATA_MIN_TMS;
        stop = ra2[0].DATA_MAX_TMS;
        break;
      case 'TICKET':
        this.Utils.scriveLog(this.selezioneTicket);
        let r0 = this.selezioneTicket;
        if (!r0[0]) { r0 = [r0]; }
        activitySetName = r0[0].ACT_SET_NAME;
        start = r0[0].START_TIME_STAMP_SELECTED;
        stop = r0[0].END_TIME_STAMP_SELECTED;

        /* const i = start.split('.');
        start = i[0] + ':' + i[1] + ':' + i[2] + '.' + i[3];
        const f = stop.split('.');
        stop = f[0] + ':' + f[1] + ':' + f[2] + '.' + f[3]; */
        // return;
        break;
      case 'TCRUN':
        this.Utils.scriveLog(this.selezioneTcRun);
        let r1 = this.selezioneTcRun;
        if (!r1[0]) { r1 = [r1]; }
        activitySetName = r1[0].ACT_SET_NAME;
        start = r1[0].START_TIME_STAMP_SELECTED;
        stop = r1[0].END_TIME_STAMP_SELECTED;

        /* const i = start.split('.');
        start = i[0] + ':' + i[1] + ':' + i[2] + '.' + i[3];
        const f = stop.split('.');
        stop = f[0] + ':' + f[1] + ':' + f[2] + '.' + f[3]; */
        // return;
        break;
      case 'TCRUNAGN':
        this.Utils.scriveLog(this.RigaSelezioneAgent2);
        let r2 = this.RigaSelezioneAgent2;
        if (!r2[0]) { r2 = [r2]; }
        activitySetName = r2[0].ACT_SET_NAME;
        start = r2[0].START_TIME_STAMP_SELECTED;
        stop = r2[0].END_TIME_STAMP_SELECTED;

        /* const i = start.split('.');
        start = i[0] + ':' + i[1] + ':' + i[2] + '.' + i[3];
        const f = stop.split('.');
        stop = f[0] + ':' + f[1] + ':' + f[2] + '.' + f[3]; */
        // return;
        break;
      case 'TCRUNACT':
        this.Utils.scriveLog(this.selezioneTcRunAct);
        let r3 = this.selezioneTcRunAct;
        if (!r3[0]) { r3 = [r3]; }
        activitySetName = r3[0].ACT_SET_NAME;
        start = r3[0].START_TIME_STAMP_SELECTED;
        stop = r3[0].END_TIME_STAMP_SELECTED;

        /* const i = start.split('.');
        start = i[0] + ':' + i[1] + ':' + i[2] + '.' + i[3];
        const f = stop.split('.');
        stop = f[0] + ':' + f[1] + ':' + f[2] + '.' + f[3]; */
        // return;
        break;
      case 'AGENTINFO':
        // riga = this.rigaSelezionataAgentInfo2;
        break;
      case 'DATAACQUISITION':
        this.Utils.scriveLog(this.rigaSelezionataDataAcquisition);
        let r4 = this.rigaSelezionataDataAcquisition;
        if (!r4[0]) { r4 = [r4]; }
        // // logConsole('Click su workspace: ', r4);
        activitySetName = this.rigaSelezionata.ACT_SET_NAME;
        this.Utils.scriveLog(this.rigaSelezionata);
        start = r4[0].DAY + ' 00:00:00.000'; // this.datePipe.transform(tI, 'yyyy-MM-dd HH:mm:ss', 'UTC');
        stop = r4[0].DAY + ' 23:59:59.999';
        break;
      case 'DATACQUISITION2':
        // this.Utils.scriveLog(this.rigaSelezionataDataAcquisition2);
        // return;
        // riga = this.rigaSelezionataDataAcquisition2;
        let r5 = this.rigaSelezionataDataAcquisition2;
        if (!r5[0]) { r5 = [r5]; }
        logConsole('Riga selezionata DataAcquisition2', r5);
        activitySetName = '[ACT] ' + r5[0].ACT_NAME;
        this.Utils.scriveLog(r5);
        start = r5[0].DATA_MIN_TMS; // null;
        stop = r5[0].DATA_MAX_TMS; // null;
        break;
      case 'TESTSCENARIO':
        // riga = this.rigaSelezionata2;
        break;
      case 'TESTSCENARIO2':
        // riga = this.rigaSelezionata3;
        break;
      case 'AGENTPROFILE':
        // riga = this.rigaSelezionataAgentProfile;
        break;
      case 'TESTDESIGNLIBRARY':
        break;
      case 'TESTDESIGNCONFIG':
        break;
    }

    const nuovoNome = 'temp [' + this.operatorID + ']';

    if (start !== null ) { start = '"' + start + '"'; }
    if (stop !== null ) { stop = '"' + stop + '"'; }

    const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_obj_type": "geo_analysis",' +
      '"v_obj_name": "' + e.NAME + '",' +
      '"v_obj_name_new": "' + nuovoNome + '",' +
      '"v_activityset_name": "' + activitySetName + '",' +
      // '"v_activityset_act_set_type": "' + '' + '",' +
      '"v_timerangedsfstart": ' + start + ',' +
      '"v_timerangedsfstop": ' + stop + '' +
    '}';
    this.Utils.scriveLog('operator_obj_my__copy', params);
    // return;
    logConsole('Premuto workspace', params);

    this.apiService.chiamataPost('operator_obj_my__copy', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
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
      '"sess": "' + this.sessionService.getToken() + '", ' +
      '"gname": "' + this.groupName + '", ' +
      '"uname": "' + this.userName + '", ' +
      '"form": "' + campi[3] + '", ' +
      '"FS": "false",' +
      '"fromFleet": "true"' +
      ancora +
    '}';
    const pass = Utils.cripta(passaggio);
    // this.Utils.scriveLog(passaggio);
    // this.Utils.scriveLog(pass);
    // this.Utils.scriveLog(UtilsInterna.decripta(pass));
    // return;

    let addr = this.urlRoot;

    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      // addr = 'http://localhost:4200';
      addr = 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/Mappe';
      campi[0] = '';
    } else {
      if (!addr.endsWith('/')) {
        addr += '/';
      }
      if (addr.indexOf('geoantsweb/') === -1) {
        addr += 'geoantsweb/';
      }
    }

    this.Utils.scriveLog(addr + campi[0] + '/?par=' + pass); // sess=' + this.sessionID2 +
                                                        // '&gname=' + this.operatorGroupName +
                                                        // '&uname=' + this.userName +
                                                        // '&form=' + campiOrig[1] +
                                                        // '&FS=' + this.fullScreen);
    const doveURL = addr + campi[0] + '/?par=' + pass; // + '/?sess=' + this.sessionID2 +
                                      //                   '&gname=' + this.operatorGroupName +
                                      //                   '&uname=' + this.userName +
                                      //                   '&form=' + campiOrig[1] +
                                      //                   '&FS=' + this.fullScreen;
    
    // // logConsole('URL DI RICHIAMO: ', passaggio, doveURL);

    // this.Utils.scriveLog(doveURL);
    // return;
    // window.location.href = doveURL;
    // const ww = window.open(doveURL, '_blank');
    if (newPage) {
      const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
      this.Utils.scriveLog(url2);
      const ww = window.open(doveURL, '_blank');
    } else {
      location.assign(doveURL);
    }
  }

  ritornaNomeApp(c) {
    const campi = c.split(';');
    // this.Utils.scriveLog('Passaggio a progetto ' + campi[0] + ', maschera: ' + campi[1]);

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
    }

    const cc = new Array();
    cc.push(dove);
    cc.push(funzione);
    cc.push(campi[0]);
    cc.push(campi[1]);

    return cc;
  }

  /* onDrag(event) {
    if (event.clientX > 0) {
      let deltaX = this.previousX - event.clientX;
      const children = this.tabGroup._tabHeader._elementRef.nativeElement.children;

      // get the tabGroup pagination buttons
      const back = children[0];
      const forward = children[2];
      // this.Utils.scriveLog('dragging' + deltaX);
      // depending on scroll direction click forward or back
      if (deltaX > 3) {
        forward.click();
      } else if (deltaX < -3) {
        back.click();
      }
    }
    this.previousX = event.clientX;
    event.target.style.opacity = 1;
  }

  onDragStart(event) {
    this.previousX = event.clientX;
    event.target.style.opacity = 0;
  } */

  clickSelezione62(e) {

  }

  /* premutoProcess(e) {
    // this.Utils.scriveLog(e);
    const params = '{' +
      '"v_cntx": "' + this.sessionService.getToken() + '",' +
      '"v_act_id": ' + e[0].ACT_ID + '' +
    '}';
    // if (this.debug2 === true) {
      this.Utils.scriveLog('Funzione chiamata: geo_act__reproc', e, params)
    // }
    // return;

    this.apiService.chiamataPost('geo_act__reproc', params)
    // .map(response => response)
    .subscribe((data: any) => {
      // this.Utils.scriveLog('Create Act Set return:', data);
      if (+data[0].v_err_code === 0) {
        this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
      } else {
        this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
      }
    });
  } */

  listaProcess;

  premutoProcess(e) {
    const grigliaDaPassare = JSON.parse(JSON.stringify(this.datiGrigliaDataAcquisition2));
    grigliaDaPassare.DataTable = e;
    this.datiGrigliaCheck = JSON.parse(JSON.stringify(grigliaDaPassare));
    this.modalitaCheckPopup = 'process_activity';
    this.operazioneCheckPopup = 'Process';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  premutoProcess1(e) {
    // logConsole(e);
    // return;

    // e.forEach(element => {
      this.listaProcess = e;
      this.premutoProcessElaborazione(0);
    // });
  }

  premutoProcessElaborazione(q) {
      const params = '{' +
        '"v_cntx": "' + this.sessionService.getToken() + '",' +
        '"v_act_id": ' + this.listaProcess[q].ACT_ID + '' +
      '}';
      // return;

      this.apiService.chiamataPost('geo_act__reproc', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        
        if (+data2[0].v_err_code === 0) {
          q+=1
          if (q < this.listaProcess.length) {
            this.premutoProcessElaborazione(q);
          } else {
            this.listaProcess = undefined;
            this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
          }
        } else {
          //this.mostraPopup('Error: ' + data2[0].v_failure_reason + '\nOn Act id ' + this.listaProcess[q].GEO_ACT_ID, false, '');
          this.mostraPopup('Error: ' + data2[0].v_failure_reason + '\nOn Act id ' + this.listaProcess[q].GEO_ACT_ID, '', '');
        }
      });
  }

  premutoProcessHistGrid(e) {
    // this.Utils.scriveLog(e);
    const params = '{' +
      '"v_cntx": "' + this.sessionService.getToken() + '",' +
      '"v_act_id": ' + e[0].ACT_ID + '' +
    '}';
    // if (this.debug2 === true) {
      this.Utils.scriveLog('Funzione chiamata: geo_act__reproc', e, params)
    // }
    // return;

    this.apiService.chiamataPost('geo_act__reproc', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      // this.Utils.scriveLog('Create Act Set return:', data);
      if (+data[0].v_err_code === 0) {
        this.caricaHistGrid();
      } else {
        this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
      }
    });
  }

  premutoProcessActivityTS(e) {
    // this.Utils.scriveLog(e);
    const params = '{' +
      '"v_cntx": "' + this.sessionService.getToken() + '",' +
      '"v_act_id": ' + e[0].ACT_ID + '' +
    '}';
    // if (this.debug2 === true) {
      this.Utils.scriveLog('Funzione chiamata: geo_act__reproc', e, params)
    // }
    // return;

    this.apiService.chiamataPost('geo_act__reproc', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      // this.Utils.scriveLog('Create Act Set return:', data);
      if (+data[0].v_err_code === 0) {
        this.caricaActivityTS();
      } else {
        this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
      }
    });
  }

  checkEdge(event) {
    this.edge = event;
    // this.Utils.scriveLog('edge:', event);
  }

  replayPremuto(e) {
    const params = '{' +
      '"v_cntx": "' + this.sessionService.getToken() + '",' +
      '"v_id": ' + e[0].TS_SCHED_ID + '' +
    '}';
    // if (this.debug2 === true) {
      this.Utils.scriveLog('Funzione chiamata: ts_sched__replay', e, params)
    // }
    // return;

    this.apiService.chiamataPost('ts_sched__replay', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      // this.Utils.scriveLog('Create Act Set return:', data);
      if (+data.v_err_code === 0) {
        this.caricaSchedGrid(this.rigaSelezionata);
      } else {
        this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
      }
    });
  }

  // TICKET
  LeggeDatiLookUpStatus() {
    // // this.Utils.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_category": "TicketStatus"' +
    '}';
    this.apiService.chiamataPost( 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // // this.Utils.scriveLog('Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiLookUpStatus = null; // 'empty grid';;
          this.Utils.visualizzaAlert(data2.v_failure_reason);
        } else {
          this.Utils.scriveLog('Lookup status:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.Utils.scriveLog('Mesaures:', data);
          this.datiLookUpStatus = data;
        }
      } else {
        this.datiLookUpStatus = null; // 'empty grid';;
      }
    }, error => {
      this.Utils.visualizzaAlert('Read look up status:' + error);
    });
  }

  LeggeDatiLookUpPriority() {
    // // this.Utils.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_category": "TicketPriority"' +
    '}';
    this.apiService.chiamataPost( 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // // this.Utils.scriveLog('Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiLookUpPriority = null; // 'empty grid';;
          this.Utils.visualizzaAlert(data2.v_failure_reason);
        } else {
          this.Utils.scriveLog('Lookup priority:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.Utils.scriveLog('Mesaures:', data);
          this.datiLookUpPriority = data;
        }
      } else {
        this.datiLookUpPriority = null; // 'empty grid';;
      }
    }, error => {
      this.Utils.visualizzaAlert('Read look up priority:' + error);
    });
  }

  LeggeDatiOperator() {
    // // this.Utils.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_group_name": null' +
    '}';
    this.apiService.chiamataPost( 'operator__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // // this.Utils.scriveLog('Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiOperator = null; // 'empty grid';;
          this.Utils.visualizzaAlert(data2.v_failure_reason);
        } else {
          this.Utils.scriveLog('Operator:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // this.Utils.scriveLog('Mesaures:', data);
          this.datiOperator = data;
        }
      } else {
        this.datiOperator = null; // 'empty grid';;
      }
    }, error => {
      this.Utils.visualizzaAlert('Read operator:' + error);
    });
  }

  caricaDatiEditTicket() {
    if (!this.datiLookUpStatus) {
      this.LeggeDatiLookUpStatus();
    }
    if (!this.datiLookUpPriority) {
      this.LeggeDatiLookUpPriority();
    }
    if (!this.datiOperator) {
      this.LeggeDatiOperator();
    }
  }

  /* public options: Object = {
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove', 'undo', 'redo'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove', 'undo', 'redo'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove', 'undo', 'redo'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove', 'undo', 'redo'],
  } */

  datiPerTicket;

  premutoTastoTicketAllTicket(e) {
    this.datiPerTicket = this.datiGrigliaTicket;
    this.premutoTastoTicket(e);
  }

  premutoTastoTicketTests(e) {
    this.datiPerTicket = this.datiGrigliaAgent2;
    this.premutoTastoTicket(e);
  }

  premutoTastoTicketMonitoring(e) {
    this.datiPerTicket = this.datiGrigliaTcRun;
    this.premutoTastoTicket(e);
  }

  premutoTastoTicketTestRun(e) {
    this.datiPerTicket = this.datiGrigliaTcRun;
    this.premutoTastoTicket(e);
  }

  premutoTastoTicketAByDay(e) {
    this.datiPerTicket = this.datiGrigliaTcRunAct;
    this.premutoTastoTicket(e);
  }

  premutoTastoTicket(e) {
    let ok = false;
    if (this.datiPerTicket) {
      this.datiPerTicket.DataTable.forEach(element => {
        if (!ok && +element.ROW_ID === +e) {
          ok = true;
          e = element;
        }
      });
    }
    if (!ok) {
      return;
    }
    const rigaSelezionataPerTicket = e; // JSON.parse(e);

    // logConsole(e);

    this.caricaDatiEditTicket();
    this.TitoloMascheraModificaMT = 'Edit Ticket';
    this.operazioneTicket = 'MODIFICA';
    this.rigaModificataTicket = JSON.parse(JSON.stringify(rigaSelezionataPerTicket));

    let testo = this.rigaModificataTicket.TCK_DESCRIPTION;
    if (testo !== null) {
      while (testo.indexOf('*DV*') > -1) {
        testo = testo.replace('*DV*', '"');
      }
      this.rigaModificataTicket.TCK_DESCRIPTION = testo;
    } else {
      this.rigaModificataTicket.TCK_DESCRIPTION = '';
    }
    
    this.Utils.scriveLog('Click su edit ticket prima', this.rigaModificataTicket);

    if (this.rigaModificataTicket.TCK_STATUS === null || this.rigaModificataTicket.TCK_STATUS === 'null') {
      this.rigaModificataTicket.TCK_STATUS = 'Open';
    }
    if (this.rigaModificataTicket.TCK_PRIORITY === null || this.rigaModificataTicket.TCK_PRIORITY === 'null') {
      this.rigaModificataTicket.TCK_PRIORITY = '3 Low';
    }
    this.Utils.scriveLog('Click su edit ticket dopo', this.rigaModificataTicket);
    this.vecchioValoreTicket = JSON.parse(JSON.stringify(this.rigaModificataTicket));

    this.mascheraModificaTicket = true;



    /* const tm = setTimeout(() => {
      const rteObj: RichTextEditorComponent = this.rteObj;

      const tm = setTimeout(() => {
          this.textArea = rteObj.contentModule.getEditPanel() as HTMLElement;
      }, 600);
    }, 100); */
  }

  /* editPremutoTicket(e) {
    this.caricaDatiEditTicket();
    this.TitoloMascheraModificaMT = 'Edit Ticket';
    this.operazioneTicket = 'MODIFICA';
    this.rigaModificataTicket = JSON.parse(JSON.stringify(this.selezioneTicket[0]));
    this.vecchioValoreTicket = JSON.parse(JSON.stringify(this.selezioneTicket[0]));
    this.Utils.scriveLog('Click su edit ticket', this.selezioneTicket);

    this.mascheraModificaTicket = true;
  }

  newPremutoTicket(e) {
    this.caricaDatiEditTicket();
    this.TitoloMascheraModificaMT = 'New Ticket';
    this.operazioneTicket = 'INSERIMENTO';

    const inizio = new Date();
    const datella = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    this.rigaModificataTicket = {
      TCK_ID: '',
      ACT_ID: this.selezioneTicket[0].ACT_ID,
      START_TIME_STAMP: datella,
      TCK_OPERATOR_NAME_IN_CHARGE_TO: '',
      STATUS: '',
      TCK_TITLE: '',
      TCK_DESCRIPTION: '',
      TCK_PRIORITY: ''
    };
    this.Utils.scriveLog('Click su nuovo ticket', this.rigaModificataTicket);
    this.vecchioValoreTicket = JSON.parse(JSON.stringify(this.rigaModificataTicket));

    this.mascheraModificaTicket = true;
  } */

  premutoSalvataggioTicket = '';

  salvaDatiTicketInizio() {
    // this.premutoSalvataggioTicket = new Date().toString();
    this.salvaDatiTicket();
  }

  RitornoTestoTicket(t) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.rigaModificataTicket.TCK_DESCRIPTION = t;

      this.Utils.scriveLog('Testo ritornato:', t);

      this.salvaDatiTicket();
    }, 100);
  }

  salvaDatiTicket() {
    const nomeFunzione = 'ticket__ins';

    this.rigaModificataTicket.TCK_STATUS = this.appoggioS;
    let dsr = JSON.parse(JSON.stringify(this.datiLookUpStatus.DataTable));
    let trovato = false;
    let m = 0;
    dsr.forEach(element => {
      if (!trovato && element.VALUE_STR === this.appoggioS) {
        trovato = true;
      }
      m++;
    });
    if (!trovato) {
      m++;
      const v2 = {
        ROW_ID: m,
        VALUE_STR: this.appoggioS
      }
      dsr.push(v2);
      dsr.sort((a, b) => (a.VALUE_STR.localeCompare(b.VALUE_STR)));
    }
    this.datiLookUpStatus.DataTable = JSON.parse(JSON.stringify(dsr));

    this.rigaModificataTicket.TCK_PRIORITY = this.appoggioT;
    dsr = JSON.parse(JSON.stringify(this.datiLookUpPriority.DataTable));
    trovato = false;
    m = 0;
    dsr.forEach(element => {
      if (!trovato && element.VALUE_STR === this.appoggioT) {
        trovato = true;
      }
      m++;
    });
    if (!trovato) {
      m++;
      const v2 = {
        ROW_ID: m,
        VALUE_STR: this.appoggioT
      }
      dsr.push(v2);
      dsr.sort((a, b) => (a.VALUE_STR.localeCompare(b.VALUE_STR)));
    }
    this.datiLookUpPriority.DataTable = JSON.parse(JSON.stringify(dsr));

    this.rigaModificataTicket.TCK_OPERATOR_NAME_IN_CHARGE_TO = this.appoggioO;
    dsr = JSON.parse(JSON.stringify(this.datiOperator.DataTable));
    trovato = false;
    m = 0;
    dsr.forEach(element => {
      if (!trovato && element.NAME === this.appoggioO) {
        trovato = true;
      }
      m++;
    });
    if (!trovato) {
      m++;
      const v2 = {
        ROW_ID: m,
        NAME: this.appoggioO
      }
      dsr.push(v2);
      dsr.sort((a, b) => (a.NAME.localeCompare(b.NAME)));
    }
    this.datiOperator.DataTable = JSON.parse(JSON.stringify(dsr));

    let operator = this.rigaModificataTicket.TCK_OPERATOR_NAME_IN_CHARGE_TO;
    if (!operator || operator === null || operator === 'null') {
      operator = '';
    }

    let testo = this.rigaModificataTicket.TCK_DESCRIPTION;
    while (testo.indexOf('"') > -1) {
      testo = testo.replace('"', '*DV*');
    }

    const params = '{' +
        '"v_cntx": "' + this.sessionService.getToken() + '",' +
        '"v_ticket_id": ' + this.rigaModificataTicket.TCK_ID + ',' +
        '"v_act_id": ' + this.rigaModificataTicket.ACT_ID + ',' +
        '"v_tms": "' + this.rigaModificataTicket.TMS + '",' +
        '"v_operator_name_in_charge_to": "' + operator + '",' +
        '"v_status": "' + this.rigaModificataTicket.TCK_STATUS + '",' +
        '"v_title": "' + this.rigaModificataTicket.TCK_TITLE + '",' +
        '"v_description": "' + testo + '",' +
        '"v_event_row_id_linked": null,' +
        '"v_dashboard_id": null,' +
        '"v_priority": "' + this.rigaModificataTicket.TCK_PRIORITY + '"' +
      '}';

    this.apiService.chiamataPost( '' + nomeFunzione, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // // this.Utils.scriveLog('Lista lookup:', data2);
      if (data2 && data2 !== null) {
        this.vecchioTicket = '';
        this.caricaTicket();
        this.refreshGridAgent2(null, false);
        this.refreshGridTcRun(null, false);
        this.mascheraModificaTicket = false;
      } else {
      }
    }, error => {
      this.Utils.visualizzaAlert('Ticket operation:' + error);
    });

  }

  appoggioO;

  checkO(e) {
    this.appoggioO = e;
  }

  selectOperator(e) {
    if (e) {
      if (typeof(e) === 'string') {
      } else {
        // this.Utils.scriveLog(e);
        this.rigaModificataTicket.TCK_OPERATOR_NAME_IN_CHARGE_TO = e.NAME;
        this.appoggioO = e.NAME;
      }
    }
  }

  appoggioS;

  checkS(e) {
    this.appoggioS = e;
  }

  selectStatus(e) {
    if (e) {
      if (typeof(e) === 'string') {
      } else {
        // this.Utils.scriveLog(e);
        this.rigaModificataTicket.TCK_STATUS = e.VALUE_STR;
        this.appoggioS = e.VALUE_STR;
      }
    }
  }

  appoggioT;

  checkT(e) {
    this.appoggioT = e;
  }

  selectPriority(e) {
    if (e) {
      if (typeof(e) === 'string') {
      } else {
        // this.Utils.scriveLog(e);
        this.rigaModificataTicket.TCK_PRIORITY = e.VALUE_STR;
        this.appoggioT = e.VALUE_STR;
      }
    }
  }

  chiudeMascheraTicket() {
    if (JSON.stringify(this.vecchioValoreTicket) !== JSON.stringify(this.rigaModificataTicket)) {
      const messaggio = 'Do you want to lose the changes made?';
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
          this.mascheraModificaTicket = false;
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
      return;
    
      if (confirm('do you want to lose the changes made?')) {
        this.mascheraModificaTicket = false;
      }
    } else {
      this.mascheraModificaTicket = false;
    }
  }

  public onCreate(): void {
    // let customBtn: HTMLElement = document.getElementById('custom_tbar') as HTMLElement;
    // this.dialogObj.target = document.getElementById('rteSection');
  }

  /* public handleFullScreen(e: any): void {
    const sbCntEle: HTMLElement = document.querySelector('.sb-content.e-view');
    const sbHdrEle: HTMLElement = document.querySelector('.sb-header.e-view');
    const leftBar: HTMLElement = document.querySelector('#left-sidebar');
    if (e.targetItem === 'Maximize') {
        if (Browser.isDevice && Browser.isIos) {
            addClass([sbCntEle, sbHdrEle], ['hide-header']);
        }
        addClass([leftBar], ['e-close']);
        removeClass([leftBar], ['e-open']);
    } else if (e.targetItem === 'Minimize') {
        if (Browser.isDevice && Browser.isIos) {
            removeClass([sbCntEle, sbHdrEle], ['hide-header']);
        }
        removeClass([leftBar], ['e-close']);
        if (!Browser.isDevice) {
            addClass([leftBar], ['e-open']);
        }
    }
  }

  public actionCompleteHandler(e: any): void {
    if (e.targetItem && (e.targetItem === 'SourceCode' || e.targetItem === 'Preview')) {
        (this.rteObj.sourceCodeModule.getPanel() as HTMLTextAreaElement).style.display = 'none';
        this.mirrorConversion(e);
    } else {
        const tm = setTimeout(() => {
            this.rteObj.toolbarModule.refreshToolbarOverflow();
        }, 400);
    }
  }

  public mirrorConversion(e?: any): void {
    const id: string = this.rteObj.getID() + 'mirror-view';
    let mirrorView: HTMLElement = this.rteObj.element.querySelector('#' + id) as HTMLElement;
    const charCount: HTMLElement = this.rteObj.element.querySelector('.e-rte-character-count') as HTMLElement;
    if (e.targetItem === 'Preview') {
        this.textArea.style.display = 'block';
        mirrorView.style.display = 'none';
        this.textArea.innerHTML = this.myCodeMirror.getValue();
        charCount.style.display = 'block';
    } else {
        if (!mirrorView) {
            mirrorView = createElement('div', { className: 'e-content' });
            mirrorView.id = id;
            this.textArea.parentNode.appendChild(mirrorView);
        } else {
            mirrorView.innerHTML = '';
        }
        this.textArea.style.display = 'none';
        mirrorView.style.display = 'block';
        this.renderCodeMirror(mirrorView, this.rteObj.value);
        charCount.style.display = 'none';
    }
  }

  public renderCodeMirror(mirrorView: HTMLElement, content: string): void {
    /*  this.myCodeMirror = CodeMirror(mirrorView, {
        value: content,
        lineNumbers: true,
        mode: 'text/html',
        lineWrapping: true,
    });
  } */

  propertyAppoggio = '';
  vecchioAgent1 = '';
  ultimoTmsAgent1 = -1;
  vecchieColumnProperty = '';
  messaggioWarningAgent1 = '';

  caricaAgent1() {
    if (!this.rigaSelezionata || this.groupIdSelezionato === undefined || this.groupIdSelezionato === '') {
      return;
    }

    // this.Utils.scriveLog(this.rigaSelezionata);
    // return;
    this.ultimoTmsAgent1 = new Date().getTime();

    const nomeTabella = 'agn__grid';
    const params = {
      v_cntx_id: this.sessionService.getToken(),
      v_group_id: this.groupIdSelezionato,
      v_filter: '',
      v_prop_name_1: this.propName[1],
      v_prop_name_2: this.propName[2],
      v_prop_name_3: this.propName[3],
      v_prop_name_4: this.propName[4],
      v_prop_name_5: this.propName[5],
      v_prop_name_6: this.propName[6],
      v_prop_name_7: this.propName[7],
      v_prop_name_8: this.propName[8],
      v_prop_name_9: this.propName[9],
      v_caller_tag: this.ultimoTmsAgent1
    };
    /* if (JSON.stringify(params) === this.vecchioAgent1) {
      return;
    }
    this.vecchioAgent1 = JSON.stringify(params); */

    logConsole('Aggiorna griglia agents', params);

    this.Utils.scriveLog('Carica agent 1', params);
    // return;

    /* let ricarica = false;
    if (this.propertyAppoggio !== this.propName1 + ';' + this.propName2 + ';' + this.propName3) {
      ricarica = true;
    }
    this.propertyAppoggio = this.propName1 + ';' + this.propName2 + ';' + this.propName3; */

    this.caricamentoDatiInCorsoAgent1 = true;
    this.selezioneAgent1 = -1;
    this.selezionatoAgent = false;

    // // logConsole('Agent: Inizio');
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((dataD: any) => {
      Utils.checkRitornoChiamata(this, dataD);

      this.caricamentoDatiInCorsoAgent1 = false;
      // this.Utils.scriveLog(data2);

      if (!this.controllaRitornoChiamata(this, dataD, 'AgentGrid', this.ultimoTmsAgent1)) {
        return;
      }

      // // logConsole('Agent: caricato ', dataD); // , ricarica);

      // const dataD = data2;
      if (dataD && dataD !== null && dataD.DataTable) {
        this.Utils.scriveLog('Dati griglia Agent1', dataD, this.datiGrigliaAgent1);

        // && this.datiGrigliaAgent1.DataTable.length > 1 
        // ricarica === false && 
        if (dataD && dataD.GridProperty && dataD.GridProperty[0]) {
          this.nomeGrigliaAgent1 = dataD.GridProperty[0].GridName;
          this.Utils.scriveLog('Nome griglia agent 1: ', this.nomeGrigliaAgent1)
        }

        if (dataD && dataD !== null && dataD.v_grid_msg !== undefined) {
          this.messaggioWarningAgent1 = dataD.v_grid_msg;
        } else {
          this.messaggioWarningAgent1 = '';
        }

        if (this.datiGrigliaAgent1 && this.datiGrigliaAgent1 !== null && this.datiGrigliaAgent1 !== 'empty grid' && 
          this.datiGrigliaAgent1.DataTable && dataD.DataTable && this.datiGrigliaAgent1.ColumnProperty
          && this.datiGrigliaAgent1.GridProperty && 
          JSON.stringify(dataD.ColumnProperty) === this.vecchieColumnProperty) {
            logConsole('Agent: Rinfresco la griglia', this.datiGrigliaAgent1);
            this.Utils.scriveLog('Rinfresco griglia agent 1');
            this.datiGrigliaAgent1.DataTable = null;
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.datiGrigliaAgent1.DataTable = dataD.DataTable;
              // this.Utils.scriveLog('Aggiorno griglia tc run');
              const tm1 = setTimeout(() => {
                clearTimeout(tm1);
                // this.selezioneAgent1 = this.datiGrigliaAgent1.DataTable[0].ROW_ID;
                  if (this.datiGrigliaAgent1 && this.datiGrigliaAgent1.DataTable && this.datiGrigliaAgent1 !== null && this.datiGrigliaAgent1.DataTable !== null) {
                    this.RigaSelezioneAgent1 = this.datiGrigliaAgent1.DataTable[0];
                  }
  
                  this.Utils.scriveLog('AZZERO2 2');
                  this.datiGrigliaAgent2 = null; // 'empty grid';
                  this.datiGrigliaHistGrid = null; // 'empty grid';

                  // this.caricaHistGrid();
              }, 500);
            }, 200);
        } else {
          logConsole('Agent: Creo la griglia', this.datiGrigliaAgent1);
          this.Utils.scriveLog('Riempio griglia agent 1', dataD.DataTable);
          this.datiGrigliaAgent1 = undefined;

          const tm = setTimeout(() => {
            clearTimeout(tm);
            
            this.datiGrigliaAgent1 = dataD;
            this.vecchieColumnProperty = JSON.stringify(dataD.ColumnProperty);

            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              // return;

              this.effettuaAutoFitAgent1 = !this.effettuaAutoFitAgent1;

              // this.Utils.scriveLog('AGENT 1', this.datiGrigliaAgent1);

              // const tm = setTimeout(() => {
                // this.selezioneAgent1 = this.datiGrigliaAgent1.DataTable[0].ROW_ID;
                if (this.datiGrigliaAgent1 && this.datiGrigliaAgent1 !== null && this.datiGrigliaAgent1.DataTable && this.datiGrigliaAgent1.DataTable !== null) {
                  this.RigaSelezioneAgent1 = this.datiGrigliaAgent1.DataTable[0];
                }
                // this.Utils.scriveLog('AGENT 1', this.selezioneAgent1);

                this.Utils.scriveLog('AZZERO2 4');
                this.datiGrigliaAgent2 = null; // 'empty grid';
                this.datiGrigliaHistGrid = null; // 'empty grid';

              //   this.caricaHistGrid();
              // }, 1000);
            }, 500);            
          }, 500);

        }
      } else {
        // logConsole('Agent: Azzero griglia');
        this.Utils.scriveLog('Azzero griglia agent 1');
        this.Utils.scriveLog('AZZERO2 5');
        this.nomeGrigliaAgent1 = '';
        this.datiGrigliaAgent1 = null; // 'empty grid';
        this.datiGrigliaHistGrid = null; // 'empty grid';
        this.datiGrigliaAgent2 = null; // 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorsoAgent1 = false;
      // this.Utils.scriveLog(error);
      try {
        this.Utils.scriveLog('AZZERO2 6');
        if (JSON.parse(error)._body) {
          const ee = JSON.parse(error._body);
          this.datiGrigliaAgent1 = 'ERROR: ' + ee.message;
          this.datiGrigliaHistGrid = 'ERROR: ' + ee.message;
          this.datiGrigliaAgent2 = 'ERROR: ' + ee.message;
        } else {
          this.datiGrigliaAgent1 = 'ERROR: ' + error;
          this.datiGrigliaHistGrid = 'ERROR: ' + error;
          this.datiGrigliaAgent2 = 'ERROR: ' + error;
        }
      } catch (e) {

      }
    });
  }

  // vecchioActTS = '';
  messaggioWarningActivityTS = '';

  caricaActivityTS() {
    this.Utils.scriveLog('Carica Activity TS', this.rigaSelezionata2);
    // return;

    if (!this.rigaSelezionata2) {
      return;
    }

    this.keyWorkspaceVisibileActivityTS = false;

    const inizio = new Date();
    const quanti = +this.lastDays;
    const fine = new Date(inizio.getTime() - (quanti * 24 * 60 * 60 * 1000));
    const min = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    const max = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    let agn;
    let agncode;

    if (this.rigaSelezionata2[0]) {
      agn = this.rigaSelezionata2[0].AGN_GROUP_ID;
    } else {
      agn = this.rigaSelezionata2.AGN_GROUP_ID;
    }

    if (this.rigaSelezionata2[0]) {
      if (this.rigaSelezionata2[0].AGN_CODE && this.rigaSelezionata2[0].AGN_CODE !== null) {
        agncode = '[AGN] ' + this.rigaSelezionata2[0].AGN_CODE;
      } else {
        agncode = null; // '[AGN GROUP] ' + this.rigaSelezionata2[0].AGN_GROUP_NAME;
      }
    } else {
      if (this.rigaSelezionata2.AGN_CODE && this.rigaSelezionata2.AGN_CODE !== null) {
        agncode = '[AGN] ' + this.rigaSelezionata2.AGN_CODE;
      } else {
        agncode = null; //  '[AGN GROUP] ' + this.rigaSelezionata2.AGN_GROUP_NAME;
      }
    }

    if (!agn) {
      this.datiGrigliaActivityTS = null; // 'empty grid';
      this.datiGrigliaTcRun = null; // 'empty grid';
      return;
    }

    const nomeTabella = 'file_hist__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_status: null,
      v_tms_min: min,
      v_tms_max: max,
      v_time_aggr: null,
      v_agn_group_id: agn,
      v_agn_code: agncode
    };
    /* if (JSON.stringify(params) === this.vecchioActTS) {
      return;
    }
    this.vecchioActTS = JSON.stringify(params); */

    this.Utils.scriveLog('Carica Activity TS', params);
    // return;

    this.caricamentoDatiInCorsoActivityTS = true;
    this.selezioneActivityTS = -1;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);

      this.caricamentoDatiInCorsoActivityTS = false;
      // this.Utils.scriveLog(data2);

      if (data2 && data2 !== null && data2.v_grid_msg !== undefined) {
        this.messaggioWarningActivityTS = data2.v_grid_msg;
      } else {
        this.messaggioWarningActivityTS = '';
      }

      const dataD = data2;
      if (dataD && dataD !== null && dataD.DataTable && dataD.DataTable.length > 0) {
        this.Utils.scriveLog('Dati griglia ActivityTS', dataD, this.datiGrigliaActivityTS);
        this.nomeGrigliaActivityTS = dataD.GridProperty[0].GridName;

        if (this.datiGrigliaActivityTS && this.datiGrigliaActivityTS !== null && this.datiGrigliaActivityTS !== 'empty grid' && 
          this.datiGrigliaActivityTS.DataTable && dataD.DataTable && dataD.DataTable.length > 0) {
            // if (dataD.DataTable.length > 0) {
              this.Utils.scriveLog('Rinfresco griglia ActivityTS');
              this.datiGrigliaActivityTS.DataTable = dataD.DataTable;
              // this.Utils.scriveLog('Aggiorno griglia tc run');

              // const tm = setTimeout(() => {
                // this.selezioneHistGrid = this.datiGrigliaHistGrid.DataTable[0].ROW_ID;
                this.RigaSelezioneActivityTS = this.datiGrigliaActivityTS.DataTable[0];
                this.keyWorkspaceVisibileActivityTS = true;
                // this.datiGrigliaActivityTS = null; // 'empty grid';
                this.datiGrigliaTcRun = null; // 'empty grid';

              //   this.caricaAgent2();
              // }, 10);
            /* } else {
              this.Utils.scriveLog('Pulisco griglia ActivityTS');
              this.keyWorkspaceVisibileActivityTS = false;
              this.datiGrigliaActivityTS = null; // 'empty grid';
              this.datiGrigliaTcRun = null; // 'empty grid';
            } */
        } else {
          // alert('ppp');
          this.Utils.scriveLog('Riempio griglia ActivityTS');
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGrigliaActivityTS = dataD;
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              // return;
              this.effettuaAutoFitActivityTS = !this.effettuaAutoFitActivityTS;

              // const tm = setTimeout(() => {
                // this.selezioneHistGrid = this.datiGrigliaHistGrid.DataTable[0].ROW_ID;
                this.RigaSelezioneActivityTS = this.datiGrigliaActivityTS.DataTable[0];
                this.keyWorkspaceVisibileActivityTS = true;
                // sthis.datiGrigliaActivityTS = null; // 'empty grid';
                this.datiGrigliaTcRun = null; // 'empty grid';

              //   this.caricaAgent2();
              // }, 10);
            }, 500);
          }, 500);
        }
      } else {
        this.keyWorkspaceVisibileActivityTS = false;
        this.Utils.scriveLog('Azzero griglia ActivityTS');
        this.datiGrigliaActivityTS = null; // 'empty grid';
        this.datiGrigliaTcRun = null; // 'empty grid';
      }
    }, error => {
      this.keyWorkspaceVisibileActivityTS = false;
      this.caricamentoDatiInCorsoActivityTS = false;
      // this.Utils.scriveLog(error);
      try {
        if (JSON.parse(error)._body) {
          const ee = JSON.parse(error._body);
          this.datiGrigliaActivityTS = 'ERROR: ' + ee.message;
          this.datiGrigliaTcRun = 'ERROR: ' + ee.message;
        } else {
          this.datiGrigliaActivityTS = 'ERROR: ' + error;
          this.datiGrigliaTcRun = 'ERROR: ' + error;
        }
      } catch (e) {

      }
    });
  }

  // vecchioHistGrid = '';
  messaggioWarningHistGrid = '';

  caricaHistGrid() {
    this.Utils.scriveLog('Carica hist grid', this.RigaSelezioneAgent1);
    // return;

    if (!this.RigaSelezioneAgent1) {
      return;
    }

    this.keyWorkspaceVisibileHistGrid = false;

    const inizio = new Date();
    const quanti = +this.lastDays;
    const fine = new Date(inizio.getTime() - (quanti * 24 * 60 * 60 * 1000));
    const min = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    const max = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    let agn;
    let agncode;

    if (this.RigaSelezioneAgent1[0]) {
      agn = this.RigaSelezioneAgent1[0].AGN_GROUP_ID;
      agncode = this.RigaSelezioneAgent1[0].ACT_SET_NAME;
    } else {
      agn = this.RigaSelezioneAgent1.AGN_GROUP_ID;
      agncode = this.RigaSelezioneAgent1.ACT_SET_NAME;
    }
    if (!agn || !agncode) {
      this.datiGrigliaHistGrid = null; // 'empty grid';
      this.Utils.scriveLog('AZZERO2 7');
      this.datiGrigliaAgent2 = null; // 'empty grid';
      return;
    }

    const nomeTabella = 'file_hist__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_status: null,
      v_tms_min: min,
      v_tms_max: max,
      v_time_aggr: null,
      v_agn_group_id: agn,
      v_agn_code: agncode
    };
    /* if (JSON.stringify(params) === this.vecchioHistGrid) {
      return;
    }
    this.vecchioHistGrid = JSON.stringify(params); */
    this.Utils.scriveLog('Carica HistGrid', params);
    // return;

    this.caricamentoDatiInCorsoHistGrid = true;
    this.selezioneHistGrid = -1;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((dataD: any) => {
      Utils.checkRitornoChiamata(this, dataD);

      this.caricamentoDatiInCorsoHistGrid = false;
      // this.Utils.scriveLog(data2);
      this.Utils.scriveLog('Dati griglia HistGrid', dataD);

      // const dataD = data2;
      if (dataD && dataD !== null && dataD.DataTable) {
        this.nomeGrigliaHistGrid = dataD.GridProperty[0].GridName;

        if (dataD && dataD !== null && dataD.v_grid_msg !== undefined) {
          this.messaggioWarningHistGrid = dataD.v_grid_msg;
        } else {
          this.messaggioWarningHistGrid = '';
        }

        if (this.datiGrigliaHistGrid && this.datiGrigliaHistGrid !== null && this.datiGrigliaHistGrid !== 'empty grid' && this.datiGrigliaHistGrid.DataTable
          && this.datiGrigliaHistGrid.DataTable.length > 1 && dataD.DataTable && dataD.DataTable.length > 0) {
            // if (dataD.DataTable.length > 0) {
              // logConsole('Rinfresco griglia histgrid');
              const tm = setTimeout(() => {
                clearTimeout(tm);
                this.datiGrigliaHistGrid.DataTable = dataD.DataTable;
                // this.Utils.scriveLog('Aggiorno griglia tc run');

                const tm1 = setTimeout(() => {
                  clearTimeout(tm1);
                  this.effettuaAutoFitHistGrid = !this.effettuaAutoFitHistGrid;

                  this.RigaSelezioneHistGrid = this.datiGrigliaHistGrid.DataTable[0];
                  this.keyWorkspaceVisibileHistGrid = true;
                  // logConsole('AZZERO2 8');
                  this.datiGrigliaAgent2 = null; // 'empty grid';
                }, 500);
                // const tm = setTimeout(() => {
                  // this.selezioneHistGrid = this.datiGrigliaHistGrid.DataTable[0].ROW_ID;
              }, 500);
              //   this.caricaAgent2();
              // }, 10);
            /* } else {
              // logConsole('Pulisco griglia histgrid');
              this.keyWorkspaceVisibileHistGrid = false;
              this.datiGrigliaHistGrid = 'empty grid'; // 'empty grid';
              // logConsole('AZZERO2 9');
              this.datiGrigliaAgent2 = 'empty grid'; // 'empty grid';
            } */
        } else {
          // logConsole('Riempio griglia histgrid');
          this.datiGrigliaHistGrid = JSON.parse(JSON.stringify(dataD));
            // return;
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.effettuaAutoFitHistGrid = !this.effettuaAutoFitHistGrid;

              // const tm = setTimeout(() => {
                // this.selezioneHistGrid = this.datiGrigliaHistGrid.DataTable[0].ROW_ID;
                this.RigaSelezioneHistGrid = this.datiGrigliaHistGrid.DataTable[0];
                this.keyWorkspaceVisibileHistGrid = true;
            }, 500);
            //   this.caricaAgent2();
            // }, 10);
        }
      } else {
        this.keyWorkspaceVisibileHistGrid = false;
        // logConsole('Azzero griglia histgrid');
        this.datiGrigliaHistGrid = null; // 'empty grid';
        // logConsole('AZZERO2 10');
        this.datiGrigliaAgent2 = null; // 'empty grid';
      }
    }, error => {
      this.keyWorkspaceVisibileHistGrid = false;
      this.caricamentoDatiInCorsoHistGrid = false;
      // this.Utils.scriveLog(error);
      try {
        if (JSON.parse(error)._body) {
          const ee = JSON.parse(error._body);
          this.RigaSelezioneHistGrid = 'ERROR: ' + ee.message;
        } else {
          this.RigaSelezioneHistGrid = 'ERROR: ' + error;
        }
      } catch (e) {

      }
    });
  }

  // vecchioAgent2 = '';
  vecchiaStrutturaTCRUN;
  messaggioWarningAgent2 = '';

  caricaAgent2() {
    if (!this.RigaSelezioneHistGrid) {
      return;
    }
    // alert('tcrun agent: ' + this.tabAperto);
    // const min = this.datiGrafico.Tms + ' 00:00:00';
    // const max = this.datiGrafico.Tms + ' 23:59:59';

    const inizio = new Date();
    const quanti = +this.lastDays;
    const fine = new Date(inizio.getTime() - (quanti * 24 * 60 * 60 * 1000));
    const max = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    const min = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    let asn;

    if (this.RigaSelezioneHistGrid[0]) {
      asn = this.RigaSelezioneHistGrid[0].ACT_SET_NAME;
    } else {
      asn = this.RigaSelezioneHistGrid.ACT_SET_NAME;
    }
    if (!asn) {
      this.Utils.scriveLog('AZZERO2 11');
      this.datiGrigliaAgent2 = null; // 'empty grid';
      return;
    }

    let misureAddizionali = '';
    if (this.MisureTCRun2) {
      this.MisureTCRun2.forEach(element => {
        if (element) {
          misureAddizionali += element + ',';
        }
      });
    }
    if (misureAddizionali.length > 0) {
      misureAddizionali = misureAddizionali.substring(0, misureAddizionali.length - 1);
    }

    const nomeTabella = 'geo_tc_run__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_act_set_name_list: asn,
      v_bbox: null,
      v_tc_name: null,
      v_result: null,
      v_ts_name: null,
      v_tms_max: max, // Mail FTRA 23/06/2022 10:33
      v_tms_min: min, // Mail FTRA 23/06/2022 10:33
      v_additional_event_measure: misureAddizionali,
      v_cluster_set_name: null
    };
    /* if (JSON.stringify(params) === this.vecchioAgent2) {
      return;
    }
    this.vecchioAgent2 = JSON.stringify(params); */

    this.Utils.scriveLog('Carica agent 2', params);
    // return;

    this.caricamentoDatiInCorsoAgent2 = true;
    this.selezioneAgent2 = -1;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);

      this.caricamentoDatiInCorsoAgent2 = false;
      // this.Utils.scriveLog(data2);

      const dataD: any = data2;
      if (dataD && dataD !== null && dataD.DataTable && dataD.DataTable.length > 0) {
        this.Utils.scriveLog('Dati griglia Agent2', dataD, this.datiGrigliaAgent2);

        if (dataD && dataD !== null && dataD.v_grid_msg !== undefined) {
          this.messaggioWarningAgent2 = dataD.v_grid_msg;
        } else {
          this.messaggioWarningAgent2 = '';
        }

        if (this.datiGrigliaAgent2 && this.datiGrigliaAgent2 !== null && this.datiGrigliaAgent2 !== 'empty grid' && this.datiGrigliaAgent2.DataTable
          && dataD.DataTable && this.vecchiaStrutturaTCRUN === JSON.stringify(dataD.ColumnProperty)) {
            this.datiGrigliaAgent2.DataTable = dataD.DataTable;
            this.Utils.scriveLog('Aggiorno griglia tc run');
        } else {
          this.Utils.scriveLog('Riempio griglia tc run', dataD);
          this.vecchiaStrutturaTCRUN = JSON.stringify(dataD.ColumnProperty);
          this.datiGrigliaAgent2 = dataD; // JSON.parse(JSON.stringify(dataD));
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.nomeGrigliaAgent2 = dataD.GridProperty[0].GridName;
              // return;

              this.effettuaAutoFitAgent2 = !this.effettuaAutoFitAgent2;

              this.keyWorkspaceVisibileAgent2 = true;
            }, 500);
        }
      } else {
        this.keyWorkspaceVisibileAgent2 = false;
        this.Utils.scriveLog('Azzero griglia agent 2');
        this.nomeGrigliaAgent2 = '';
        this.Utils.scriveLog('AZZERO2 12');
        this.datiGrigliaAgent2 = null; // 'empty grid';
        this.vecchiaStrutturaTCRUN = '';
      }
    }, error => {
      this.keyWorkspaceVisibileAgent2 = false;
      this.caricamentoDatiInCorsoAgent2 = false;
      // this.Utils.scriveLog(error);
      try {
        this.Utils.scriveLog('AZZERO2 13');
        if (JSON.parse(error)._body) {
          const ee = JSON.parse(error._body);
          this.datiGrigliaAgent2 = 'ERROR: ' + ee.message;
        } else {
          this.datiGrigliaAgent2 = 'ERROR: ' + error;
        }
      } catch (e) {

      }
    });
  }

  refreshGridAgent2(e, r) {
    // this.vecchioAgent2 = '';
    if (r === true) {
      this.datiGrigliaAgent2 = undefined;
    }
    this.caricaAgent2();
  }

  refreshGridAgent1(e, r) {
    this.vecchioAgent1 = '';
    if (r === true) {
      this.datiGrigliaAgent1 = undefined;
    }

    this.datiGrigliaAgent2 = undefined; // 'empty grid';
    this.datiGrigliaHistGrid = undefined; // 'empty grid';

    this.caricaAgent1();
  }

  clickSelezioneAgent1(e) {
    let ee = e;
    if (ee[0]) { ee = ee[0]; }
    
    this.RigaSelezioneAgent1 = ee;
    this.selezionatoAgent = true;
    this.pulisceTcRunInfoFile1 = new Date().toString();

    if (ee.GEO_POS) {
      this.coordinate = e[0].GEO_POS.replace('POINT(', '').replace(')', '').replace(' ', ';');
    }

    const t1 = new Date().getTime() - (this.lastDays2 * 24 * 60 * 60 * 1000);
    const sInizio = this.datePipe.transform(t1, 'yyyy-MM-dd HH:mm:ss.SSS'); // , 'UTC'
    const t2 = new Date().getTime() + (24 * 60 * 60 * 1000);
    const sFine = this.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:ss.SSS'); // , 'UTC'
    this.tmsPassati = sInizio + ';' + sFine;

    this.agnGroup = ee.ACT_SET_NAME;

    this.Utils.scriveLog('Click su agn grid', e, this.coordinate, this.tmsPassati);

    this.caricaHistGrid();
    this.caricaTabellaAgentInfo(this.RigaSelezioneAgent1);
  }

  lastSelectedOfGridAgent1(e) {

  }

  lastSelectedOfGridActivityTS(e) {

  }

  refreshGridHistGrid(e, r) {
    // this.vecchioHistGrid = '';
    if (r === true) {
      this.datiGrigliaHistGrid = undefined;
    }

    this.datiGrigliaAgent2 = undefined; // 'empty grid';

    this.caricaHistGrid();
  }

  refreshGridActivityTS(e, r) {
    // this.vecchioActTS = '';
    if (r === true) {
      this.datiGrigliaActivityTS = undefined;
    }
    this.caricaActivityTS();
  }

  pulisceTcRunInfoFile1;

  clickSelezioneHistGrid(e) {
    this.keyWorkspaceVisibileHistGrid = true;
    this.pulisceTcRunInfoFile1 = new Date().toString();

    this.RigaSelezioneHistGrid = e;
    this.Utils.scriveLog('Click su hist grid', e);

    const tm = setTimeout(() => {
      clearTimeout(tm);
      let c = e[0].CENTER;
      if (c && c !== null) {
        c = c.replace('POINT(', '').replace(')', '').replace(' ', ';');
        if (this.oldCoordinate === c) {
          const cc = c.split(';');
          cc[1] += '0';
          c = cc[0] + ';' + cc[1];
        }
        this.oldCoordinate = c;
        this.Utils.scriveLog(c);
        this.coordinate = c;
      }

      // this.agnGroup = e[0].ACT_SET_NAME;
      this.agnGroup = '[ACT] ' + e[0].ACT_NAME;

      // 22/06/2022 FTRA abbiamo aggiunto un giorno per avere un refresh della mappa (spostandola) anche senza rinfrescare la grigli nel caso di act in
      // in real time che sono ancora in accrescimento
      let fine = new Date(e[0].DATA_MAX_TMS).getTime();
      // fine += 15 * 60 * 1000; //  24 * 60 * 60 * 1000;

      const max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');
      // 22/06/2022 FTRA abbiamo aggiunto un giorno per avere un refresh della mappa (spostandola) anche senza rinfrescare la grigli nel caso di act in
      // in real time che sono ancora in accrescimento

      this.tmsPassati = e[0].DATA_MIN_TMS + ';' + max;
    }, 1000);

    this.caricaAgent2();
  }

  pulisceTcRunInfoFile3;

  clickSelezioneActivityTS(e) {
    // logConsole('Click ts');
    this.pulisceTcRunInfoFile3 = new Date().toString();

    this.keyWorkspaceVisibileActivityTS = true;

    this.RigaSelezioneActivityTS = e;
    this.Utils.scriveLog('Click su ActivtyTS', e);

    const tm = setTimeout(() => {
      clearTimeout(tm);
      let c = e[0].CENTER;
      if (c && c !== null) {
        c = c.replace('POINT(', '').replace(')', '').replace(' ', ';');
        if (this.oldCoordinate === c) {
          const cc = c.split(';');
          cc[1] += '0';
          c = cc[0] + ';' + cc[1];
        }
        this.oldCoordinate = c;
        this.Utils.scriveLog(c);
        this.coordinate = c;
      }

      // this.agnGroup = e[0].ACT_SET_NAME;
      this.agnGroup = '[ACT] ' + e[0].ACT_NAME;

      // 22/06/2022 FTRA abbiamo aggiunto un giorno per avere un refresh della mappa (spostandola) anche senza rinfrescare la grigli nel caso di act in
      // in real time che sono ancora in accrescimento
      let fine = new Date(e[0].DATA_MAX_TMS).getTime();
      // fine += 15 * 60 * 1000; //  24 * 60 * 60 * 1000;

      const max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');
      // 22/06/2022 FTRA abbiamo aggiunto un giorno per avere un refresh della mappa (spostandola) anche senza rinfrescare la grigli nel caso di act in
      // in real time che sono ancora in accrescimento

      this.tmsPassati = e[0].DATA_MIN_TMS + ';' + max;
    }, 1000);

    this.caricaTcRun(true, false);
  }

  lastSelectedOfGridHistGrid(e) {

  }

  lastSelectedOfGridAgent2(e) {

  }

  selezionatiTcRun2 = false;

  premutoCheckTcRunAgent2(e) {
    this.Utils.scriveLog('Click su check griglia Agent2', e);
    if (e && e.dati && e.dati.length > 0) {
      this.selezionatiTcRun2 = true;
    } else {
      this.selezionatiTcRun2 = false;
    }
  }

  premutoTastoDeleteTCrunAgent2(e) {
    const grigliaDaPassare = JSON.parse(JSON.stringify(this.datiGrigliaAgent2));
    grigliaDaPassare.DataTable = e;
    this.datiGrigliaCheck = JSON.parse(JSON.stringify(grigliaDaPassare));
    this.modalitaCheckPopup = 'delete_tcrun_agent2';
    this.operazioneCheckPopup = 'Delete';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  deleteTcRunAgent1(e) {
    // logConsole(e);
    this.righeSelezionateAgent2 = e;
    // return;
    // tc_run__del(v_cntx text, v_tc_run_code text)
    this.deleteTcRunAgent2(0);
  }

  deleteTcRunAgent2(q) {
    const params = '{' +
      '"v_cntx": "' + this.sessionService.getToken() + '",' +
      '"v_tc_run_code": "' + this.righeSelezionateAgent2[q].TC_RUN_CODE + '"' +
    '}';
//     this.Utils.scriveLog(JSON.parse(params));
// return;

    this.apiService.chiamataPost('tc_run__del', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        q++;
        if (q < this.righeSelezionateAgent2.length) {
          this.deleteTcRunAgent2(q);
        } else {
          this.caricaAgent2();
        }
      }
    });
  }

  actId1;
  refreshTcRunInfoFile1;

  clickSelezioneAgent2(ee) {
    let e = ee;
    if (!e[0]) { e = [e]; }

    this.actId1 = '[ACT ID] ' + e[0].ACT_ID;
    this.RigaSelezioneAgent2 = e;

    this.rigaSelezionataTcRun1 = e[0].ACT_SET_NAME;
    this.ricaricaTcRun1 = e[0].TMS;
    this.rigaSelezionataTcRun12 = e[0].TC_RUN_ID;

    this.keyWorkspaceVisibileAgent2= true;
    this.Utils.scriveLog('Click su griglia Agent2', ee, this.rigaSelezionataTcRun1, this.ricaricaTcRun1, this.rigaSelezionataTcRun12);

    let inizio = e[0].START_TIME_STAMP_SELECTED;
    /* const i = inizio.split('.');
    inizio = i[0] + ':' + i[1] + ':' + i[2] + '.' + i[3]; */
    const inizioS = inizio;
    inizio = new Date(inizio).getTime();
    // inizio -= 10000;

    let fine = e[0].END_TIME_STAMP_SELECTED;
    /* const f = fine.split('.');
    fine = f[0] + ':' + f[1] + ':' + f[2] + '.' + f[3]; */
    const fineS = fine;
    // fine += 10000;

    const min = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS');
    const max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');
    this.Utils.scriveLog(min, max);

    this.tmsPassatiTcRun = min + ';' + max;

    if (e && e[0] && e[0].ACT_SET_NAME) {
      this.agnGroup = e[0].ACT_SET_NAME;

      // this.coordinate = undefined;
      const tm = setTimeout(() => {
        clearTimeout(tm);
        let c = e[0].GEO_POS;
        if (c && c !== null) {
          c = c.replace('POINT(', '').replace(')', '').replace(' ', ';');
          if (this.oldCoordinate === c) {
            const cc = c.split(';');
            cc[1] += '0';
            c = cc[0] + ';' + cc[1];
          }
          this.oldCoordinate = c;
          this.Utils.scriveLog(c);
          this.coordinate = c;

          this.refreshTcRunInfoFile1 = new Date().toString();
        }
      }, 1000);
    }

    const nomeTabella = 'operator_obj_sync_my__upd';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_ds_name: e[0].ACT_SET_NAME,
      v_agn_code: e[0].AGN_CODE,
      v_ds_tms_min: min,
      v_ds_tms_max: max,
      v_dsg_tms_min: inizioS,
      v_dsg_tms_max: fineS,
      v_tms_curr: inizioS
    };

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);
    });
  }

  premutoTastoDeleteTCrun(e) {
    const grigliaDaPassare = JSON.parse(JSON.stringify(this.datiGrigliaTcRun));
    grigliaDaPassare.DataTable = e;
    this.datiGrigliaCheck = JSON.parse(JSON.stringify(grigliaDaPassare));
    this.modalitaCheckPopup = 'delete_tcrun';
    this.operazioneCheckPopup = 'Delete';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  deleteTCrun(e) {
    this.Utils.scriveLog(e);
    this.righeSelezionateTcRun = e;
    // return;
    // tc_run__del(v_cntx text, v_tc_run_code text)
    this.deleteTcRun2(0);
  }

  deleteTcRun2(q) {
    const params = '{' +
      '"v_cntx": "' + this.sessionService.getToken() + '",' +
      '"v_tc_run_code": "' + this.righeSelezionateTcRun[q].TC_RUN_CODE + '"' +
    '}';
//     this.Utils.scriveLog(JSON.parse(params));
// return;

    this.apiService.chiamataPost('tc_run__del', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        q++;
        if (q < this.righeSelezionateTcRun.length) {
          this.deleteTcRun2(q);
        } else {
          this.caricaTcRun(false, false);
        }
      }
    });
  }

  premutoTastoDeleteTCrunAct(e) {
    const grigliaDaPassare = JSON.parse(JSON.stringify(this.datiGrigliaTcRunAct));
    grigliaDaPassare.DataTable = e;
    this.datiGrigliaCheck = JSON.parse(JSON.stringify(grigliaDaPassare));
    this.modalitaCheckPopup = 'delete_tc_run_act';
    this.operazioneCheckPopup = 'Abort';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  premutoTastoDeleteTCrunAct1(e) {
    // this.Utils.scriveLog(e);
    // return;
    // tc_run__del(v_cntx text, v_tc_run_code text)
    this.righeSelezionateTcRunAct = e;
    this.deleteTcRunAct(0);
  }

  deleteTcRunAct(q) {
    const params = '{' +
      '"v_cntx": "' + this.sessionService.getToken() + '",' +
      '"v_tc_run_code": "' + this.righeSelezionateTcRunAct[q].TC_RUN_CODE + '"' +
    '}';

    this.apiService.chiamataPost('tc_run__del', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        q++;
        if (q < this.righeSelezionateTcRunAct.length) {
          this.deleteTcRunAct(q);
        } else {
          this.caricaTcRunAct();
        }
      }
    });
  }

  associaEventiTcRun() {

  }

  visualizzaEventiTcRun() {

  }

  controllaRitornoChiamata(t, dataP, chiamante, chiSono) {
    const data = dataP;

    if (chiSono === '') {
      // if (t.debug2 === true) {
      //   // logConsole('Controllo ritorno chiamata: chiamata nulla ' + chiamante);
      // }

      return false;
    }

    if (data && data.v_caller_tag) {
      const ritorno = +data.v_caller_tag;
      if (ritorno !== chiSono) {
        // if (t.debug2 === true) {
        // logConsole('Controllo ritorno chiamata: chiamata diversa ' + chiamante, chiSono, ritorno);
        // }
        // nomeRondella = false;
        return false;
      } else {
        // if (t.debug2 === true) {
        // logConsole('Controllo ritorno chiamata: chiamata uguale ' + chiamante, chiSono, ritorno);
        // }
        return true;
      }
    } else {
      // if (t.debug2 === true) {
      //   // logConsole('Controllo ritorno chiamata: nessun codice di ritorno ' + chiamante);
      // }

      return true;
    }
  }

  dimensioneTcRun1 = 100;
  dimensioneTcRun12 = 0;
  dimensioneTcRun2 = 100;
  dimensioneTcRun22 = 0;
  dimensioneTcRun3 = 100;
  dimensioneTcRun32 = 0;
  dimensioneTcRun4 = 100;
  dimensioneTcRun42 = 0;
  dimensioneTcRun5 = 100;
  dimensioneTcRun52 = 0;

  selezionatoTcRunInfo1;
  selezionatoTcRunInfo2;
  selezionatoTcRunInfo3;
  selezionatoTcRunInfo4;
  selezionatoTcRunInfo5;

  selezionatoTcRunFile1;
  selezionatoTcRunFile2;
  selezionatoTcRunFile3;
  selezionatoTcRunFile4;
  selezionatoTcRunFile5;

  ricaricaTcRun1;
  ricaricaTcRun2;
  ricaricaTcRun3;
  ricaricaTcRun4;
  ricaricaTcRun5;

  pulisceDatiTcRunInfo1;
  pulisceDatiTcRunInfo2;
  pulisceDatiTcRunInfo3;
  pulisceDatiTcRunInfo4;
  pulisceDatiTcRunInfo5;

  rigaSelezionataTcRun1;
  rigaSelezionataTcRun2;
  rigaSelezionataTcRun3;
  rigaSelezionataTcRun4;
  rigaSelezionataTcRun5;
  rigaSelezionataTcRun12;
  rigaSelezionataTcRun22;
  rigaSelezionataTcRun32;
  rigaSelezionataTcRun42;
  rigaSelezionataTcRun52;

  aperturaTcRunInfo1() {
    if (this.dimensioneTcRun1 === 50) {
      this.dimensioneTcRun1 = 100;
      this.dimensioneTcRun12 = 0;
    } else {
      this.dimensioneTcRun1 = 50;
      this.dimensioneTcRun12 = 50;
    }
  }

  aperturaTcRunInfo2() {
    if (this.dimensioneTcRun2 === 50) {
      this.dimensioneTcRun2 = 100;
      this.dimensioneTcRun22 = 0;
    } else {
      this.dimensioneTcRun2 = 50;
      this.dimensioneTcRun22 = 50;
    }
  }

  aperturaTcRunInfo3() {
    if (this.dimensioneTcRun3 === 50) {
      this.dimensioneTcRun3 = 100;
      this.dimensioneTcRun32 = 0;
    } else {
      this.dimensioneTcRun3 = 50;
      this.dimensioneTcRun32 = 50;
    }
  }

  aperturaTcRunInfo4() {
    if (this.dimensioneTcRun4 === 50) {
      this.dimensioneTcRun4 = 100;
      this.dimensioneTcRun42 = 0;
    } else {
      this.dimensioneTcRun4 = 50;
      this.dimensioneTcRun42 = 50;
    }
  }

  aperturaTcRunInfo5() {
    if (this.dimensioneTcRun5 === 50) {
      this.dimensioneTcRun5 = 100;
      this.dimensioneTcRun52 = 0;
    } else {
      this.dimensioneTcRun5 = 50;
      this.dimensioneTcRun52 = 50;
    }
  }

  cambioTmsDaTcRun1(e) {
  }

  cambioTmsDaTcRun2(e) {
  }

  cambioTmsDaTcRun3(e) {
  }

  cambioTmsDaTcRun4(e) {
  }

  cambioTmsDaTcRun5(e) {
  }

    fGetTcRunFiles(e, n) {
      this.righeSelezionateTcRun = e;
      this.getTcRunFiles(0, n);
    }
  
    getTcRunFiles(q, n) {
      const params = '{' +
        '"v_cntx_id": "' + this.sessionService.getToken() + '",' +
        '"v_tc_run_code": "' + this.righeSelezionateTcRun[q].TC_RUN_CODE + '"' +
      '}';
  
      this.apiService.chiamataPost('ants_tc_run_exp_full_pending__set ', JSON.parse(params))
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        Utils.checkRitornoChiamata(this, data2);
        // const data2 = JSON.parse(data);
        if (data2) {
          if (+data2.err_code === 0) {
            q++;
            if (q < this.righeSelezionateTcRun.length) {
              this.getTcRunFiles(q, n);
            } else {
              switch (n) {
                case 1:
                  this.caricaAgent2();
                  break;
                case 2:
                case 3:
                  this.caricaTcRun(this.oldDaScenario, this.oldDaActivities);
                  break;
                case 4:
                  this.caricaTcRunAct();
                  break;
              }
            }
          } else {
            this.Utils.visualizzaAlert(data2.failure_reason);
          }
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        console.error('POST ERROR TC Run Get Files: ', error, error.message);
      });
    }

  ritornoDimensioniColonneGDG(e) {
    Utils.scriveDimensioniColonne('GDG', e);
  }

  ritornoDimensioniColonneTC1(e) {
    Utils.scriveDimensioniColonne('TC1', e);
  }

  ritornoDimensioniColonneAgent1(e) {
    Utils.scriveDimensioniColonne('Agent1', e);
  }

  ritornoDimensioniColonneHG(e) {
    Utils.scriveDimensioniColonne('HG', e);
  }

  ritornoDimensioniColonneAgent2(e) {
    Utils.scriveDimensioniColonne('Agent2', e);
  }

  ritornoDimensioniColonneAgentInfo(e) {
    Utils.scriveDimensioniColonne('AgentInfo', e);
  }

  ritornoDimensioniColonneTcRun2(e) {
    Utils.scriveDimensioniColonne('TcRun2', e);
  }

  ritornoDimensioniColonneTS(e) {
    Utils.scriveDimensioniColonne('TS', e);
  }

  ritornoDimensioniColonneTcRun3(e) {
    Utils.scriveDimensioniColonne('TcRun3', e);
  }

  ritornoDimensioniColonneDA2(e) {
    Utils.scriveDimensioniColonne('DA2', e);
  }

  ritornoDimensioniColonneGC2(e) {
    Utils.scriveDimensioniColonne('GC2', e);
  }

  ritornoDimensioniColonneGC3(e) {
    Utils.scriveDimensioniColonne('GC3', e);
  }

  ritornoDimensioniColonneGC4(e) {
    Utils.scriveDimensioniColonne('GC4', e);
  }

  ritornoDimensioniColonneGC5(e) {
    Utils.scriveDimensioniColonne('GC5', e);
  }

  ritornoDimensioniColonneGC6(e) {
    Utils.scriveDimensioniColonne('GC6', e);
  }

  ritornoDimensioniColonneGC62(e) {
    Utils.scriveDimensioniColonne('GC62', e);
  }

  ritornoDimensioniColonneGC7(e) {
    Utils.scriveDimensioniColonne('GC7', e);
  }

  ritornoDimensioniColonneTcRunInfo5(e) {
    Utils.scriveDimensioniColonne('TcRunInfo5', e);
  }

  ritornoDimensioniColonneTS2(e) {
    Utils.scriveDimensioniColonne('TS2', e);
  }

  ritornoDimensioniColonneTcRun2Act(e) {
    Utils.scriveDimensioniColonne('TcRun2Act', e);
  }

  ritornoDimensioniColonneDA1(e) {
    Utils.scriveDimensioniColonne('DA1', e);
  }

  ritornoDimensioniColonneTEMd(e) {
    Utils.scriveDimensioniColonne('TEMd', e);
  }

  ritornoDimensioniColonneATS(e) {
    Utils.scriveDimensioniColonne('ATS', e);
  }

  mascheraModificaActivity = false;
  actSelezionataPerEdit = undefined;
  binning = undefined;
  actEScan = false;

  premutoTastoEditActivity(e, quale) {
    /* this.actSelezionataPerEdit = undefined;
    let data = undefined;
    if (quale === 'TestRun') {
      data = this.datiGrigliaActivityTS;
    } else if (quale === 'DataAcquisition2') {
      data = this.datiGrigliaDataAcquisition2;
    }
    data.DataTable.forEach(element => {
      if (!this.actSelezionataPerEdit && +element.ROW_ID === +e) {
        this.actSelezionataPerEdit = element;
      }
    }); */

    this.actEScan = false;
    if (this.actSelezionataPerEdit.ACT_NAME.toUpperCase().indexOf('SCAN') >= 0) {
      this.actEScan = true;
    }
    if (this.actSelezionataPerEdit.BINNING_SIDE) {
      this.binning = this.actSelezionataPerEdit.BINNING_SIDE;
    } else {
      this.binning = 10;
    }
    logConsole('Activity: ', this.actSelezionataPerEdit);
    this.mascheraModificaActivity = true;
  }

  chiudeMascheraEdtAct() {
    this.mascheraModificaActivity = false;
  }

  salvaDescAct2(e) {
    if (this.staSalvando) {
      return;
    }

    const selezionato = JSON.parse(JSON.stringify(this.listaRigheByDay));
    if (!selezionato) {
      return;
    }

    let ok = false;
    let qq = 0;
    let lista;
    if (selezionato.dati) {
      qq = selezionato.dati.length - 1
      lista = selezionato.dati;
    } else {
      if (selezionato) {
        qq = 1;
        lista = [selezionato];
      }
    }
    // logConsole('Valore pl: ', this.partitionLabelSel);
    // logConsole('Selezionati: ', qq, selezionato, selezionato.dati.length);
    if (selezionato.dati.length === 0) {
      alert('No rows checked');
      return;
    }

    this.progress = 0;
    let quante = qq;
    let quale = 0;
    this.staSalvando = true;
    const t = setInterval(() => {
      if (ok === true) {
        clearInterval(t);

        this.staSalvando = false;
        this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
        // this.showPartitionLabel = false;
        // this.selezioneActSetRec = undefined;
        this.mascheraModificaActivity = false;
        this.caricamentoDatiInCorso5 = false;
      }
    }, 1000);

    this.caricamentoDatiInCorso5 = true;
    lista.forEach(element => {
      const nomeTabella = 'geo_act__set_binning';
      const params = {
        v_cntx: this.sessionService.getToken(),
        v_act_set_name_list: '[ACT ID] ' + element.ACT_ID,
        v_binning_sec: 1,
        v_binning_side: this.binning
      };
      // this.Utils.scriveLog(params);
      // return;

      this.apiService.chiamataPost('' + nomeTabella, params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data && data !== null) {
          Utils.checkRitornoChiamata(this, data);

          if (data) {
            if (+data[0].v_err_code === 0) {
              // this.mascheraModificaActivity = false;
              this.progress = Math.round((quale + 1) / (quante + 1) * 100);
            } else {
              this.Utils.visualizzaAlert(data.failure_reason);
            }
          }
          quale++;
          if (quale > quante) {
            ok = true;
          }
        } else {
          // alert(data);
        }
      }, error => {
        Utils.messaggioDiErrore('null', 'Read:' + error);
      });
    });
  }

  salvaDescAct() {
    if (this.staSalvando) {
      return;
    }

    const selezionato = JSON.parse(JSON.stringify(this.listaRigheByDay));
    if (!selezionato) {
      return;
    }

    let ok = false;
    let qq = 0;
    let lista;
    if (selezionato.dati) {
      qq = selezionato.dati.length - 1
      lista = selezionato.dati;
    } else {
      if (selezionato) {
        qq = 1;
        lista = [selezionato];
      }
    }
    // logConsole('Valore pl: ', this.partitionLabelSel);
    // logConsole('Selezionati: ', qq, selezionato, selezionato.dati.length);
    if (selezionato.dati.length === 0) {
      alert('No rows checked');
      return;
    }

    this.progress = 0;
    let quante = qq;
    let quale = 0;
    this.staSalvando = true;
    const t = setInterval(() => {
      if (ok === true) {
        clearInterval(t);

        this.staSalvando = false;
        this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
        // this.showPartitionLabel = false;
        // this.selezioneActSetRec = undefined;
        this.mascheraModificaActivity = false;
        this.caricamentoDatiInCorso5 = false;
      }
    }, 1000);

    this.caricamentoDatiInCorso5 = true;
    lista.forEach(element => {
      const params = '{' +
        '"v_cntx": "' + this.sessionService.getToken() + '",' +
        '"v_act_set_name_list": "' + element.ACT_SET_NAME + '", ' +
        '"v_description": "' + this.actSelezionataPerEdit.FILE_DESCRIPTION + '"' +
      '}';
      logConsole('Parametri upd', params);
      // return;

      this.apiService.chiamataPost('geo_act__upd_properties ', JSON.parse(params))
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        Utils.checkRitornoChiamata(this, data2);
        // const data2 = JSON.parse(data);
        // logConsole('UPDATE: ', data2);
        if (data2) {
          if (+data2[0].v_err_code === 0) {
            // this.mascheraModificaActivity = false;
            this.progress = Math.round((quale + 1) / (quante + 1) * 100);
          } else {
            this.Utils.visualizzaAlert(data2.failure_reason);
          }
          quale++;
          if (quale > quante) {
            ok = true;
          }
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        console.error('POST ERROR UPD Properties: ', error, error.message);
      });
    });
  }

  eseguiCheck(e) {
    logConsole('Ritorno esegui check', e);
    const modalita = e.modalita;

    switch (modalita) {
      case 'delete_tcrun_agent2':
        this.deleteTcRunAgent1(e.dati)
        break;
      case 'delete_tcrun':
        this.deleteTCrun(e.dati)
        break;
      case 'run_stop_scenario':
        this.runKeyPremuto1(e.dati)
        break;
      case 'delete_act_set_rec':
        this.premutoDeleteActSetRec1(e.dati);
        break;
      case 'delete_tc_run_act':
        this.premutoTastoDeleteTCrunAct1(e.dati);
        break;
      case 'process_activity':
        this.premutoProcess1(e.dati);
        break;
    }
  }

  staSalvando = false;
  ACT_TAG1 = '';
  ACT_TAG2 = '';

  salvaTag(q) {
    if (this.staSalvando) {
      return;
    }

    let tag = '';
    let cosa = '';
    if (q === 1) {
      tag = 'act_tag1';
      cosa = this.ACT_TAG1;
    } else {
      tag = 'act_tag2';
      cosa = this.ACT_TAG2;
    }

    const selezionato = JSON.parse(JSON.stringify(this.listaRigheByDay));
    if (!selezionato) {
      return;
    }

    let ok = false;
    let qq = 0;
    let lista;
    if (selezionato.dati) {
      qq = selezionato.dati.length - 1
      lista = selezionato.dati;
    } else {
      if (selezionato) {
        qq = 1;
        lista = [selezionato];
      }
    }
    // logConsole('Valore pl: ', this.partitionLabelSel);
    // logConsole('Selezionati: ', qq, selezionato, selezionato.dati.length);
    if (selezionato.dati.length === 0) {
      alert('No rows checked');
      return;
    }

    this.progress = 0;
    let quante = qq;
    let quale = 0;
    this.staSalvando = true;
    const t = setInterval(() => {
      if (ok === true) {
        clearInterval(t);

        this.staSalvando = false;
        this.caricaDataAcquisition2(this.rigaSelezionataDataAcquisition);
        // this.showPartitionLabel = false;
        // this.selezioneActSetRec = undefined;
        this.mascheraModificaActivity = false;
        this.caricamentoDatiInCorso5 = false;
      }
    }, 1000);

    this.caricamentoDatiInCorso5 = true;
    lista.forEach(element => {
      const params = '{' +
        '"v_cntx": "' + this.sessionService.getToken() + '",' +
        '"v_act_set_name_list": "[ACT ID] ' + element.ACT_ID + '", ' +
        '"v_tag_field": "' + tag + '", ' +
        '"v_tag_value": "' + cosa + '", ' +
        '"v_tms_min": null, ' +
        '"v_tms_max": null ' +
      '}';
      logConsole('Parametri per tag', params);
      // return;

      this.apiService.chiamataPost('geo_act__tag ', JSON.parse(params))
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        Utils.checkRitornoChiamata(this, data2);
        // const data2 = JSON.parse(data);
        // logConsole('UPDATE: ', data2);
        if (data2 && data2 !== null) {
          if (data2.v_err_code && data2.v_err_code === 2) {
            this.progress = Math.round((quale + 1) / (quante + 1) * 100);
            // ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
          }
        } else {
        }
        quale++;
        if (quale > quante) {
          ok = true;
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        console.error('POST ERROR UPD Properties: ', error, error.message);
      });
    });
  }

  progress = 0;
}

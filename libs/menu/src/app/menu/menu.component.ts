import { logConsole } from '../console-log';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { OnInit, Component, Input, SecurityContext, Output, EventEmitter, ViewChild, OnChanges, ElementRef, AfterViewInit, TemplateRef, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ApiService } from '../services/api.service';
// import 'rxjs/add/operator/map';
import UtilsInterna from './utilities.component';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { DOCUMENT } from '@angular/common';
import { ExternalHttpClient } from '../services/httpclient.service';
import { Observable } from 'rxjs';
// import { FileSaverService } from "ngx-filesaver";

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: [ 'menu.style.css' ]
})

export class MenuComponent implements  OnInit, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('changeAbout2', { static: true }) changeAbout : ElementRef;
  @ViewChild('changePsw2', { static: true }) changePsw : ElementRef;

  serverPostRest = '';
  linkIcone = undefined;

  public MenuComponent = MenuComponent;

  @Input() applicazione;
  @Input() MenuVisibile: boolean = false;
  @Input() showButtons: boolean = true;
  @Input() Altezza = 35;
  // @Input() userName;
  @Input() sessionID;
  @Input() posizione = 'absolute';
  @Input() voceSelezionata = '';
  @Input() chiudiTutteVoci = false;
  @Input() statoServer = '';
  @Input() statoManutenzione = '';
  @Input() coloreStatoServer;
  @Input() debug = false;
  @Input() comandoVocale = '';
  @Input() refreshFavoriti = false;
  @Input() platFormName = '';

  @Output() platFormNameEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() dataAttualeEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() symbTsEmit: EventEmitter<string> = new EventEmitter<string>();
  // @Output() nomePaginaEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() chiusuraEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() premutoEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() lettoConfigJSON: EventEmitter<any> = new EventEmitter<any>();
  /* @Output() GPSEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() NetworkEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() SatelliteEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() CellInfoEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() CellLocationEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() SignalStrenghtEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() InfoSistemaEmit: EventEmitter<any> = new EventEmitter<any>(); */
  @Output() userManualEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() listaWorkSpacesEmit: EventEmitter<any> = new EventEmitter<any>();

  menuApplicazioni = false;
  menuSession = false;
  menuDD = false;
  menuFM = false;
  menuS = false;
  menuUM = false;
  menuAI = false;
  menuAnts1 = false;
  menuSpreadSheet = false;
  aperturaNavigazione = true;
  indirizzoAnalytics;
  connectionJSON;
  applicazione2 = '';
  NomeFleetManager = 'Fleet Manager';
  nomeTestCampaign = 'Test Campaigns';

  platform_name1 = '';
  platform_name2 = '';

  indirizzoServer = undefined;
  indirizzoGEOServer = undefined;

  visibilita = {
    hideScheduler: 'true',
    hideReport: 'true',
    hideAdhoc: 'true',
    hideSiteCoverage: 'true',
    hideEventLog: 'true',
    hideSimManager: 'true',
    hidePortManager: 'true',
    hideLineManager: 'true',
    hideAnalytics: 'true',
    hideAI: 'true',

    hideUserManager: 'true',
    hideUserManagerUsers: 'true',
    hideUserManagerGroups: 'true',
    hideUserManagerUP: 'true',

    hideMaps: 'true',

    hideFleetManager: 'true',
    hideFleetManagerTC: 'true',
    hideFleetManagerAGD: 'true',
    hideFleetManagerAGC: 'true',
    hideFleetManagerAGPL: 'true',
    hideFleetManagerQPL: 'true',
    hideFleetManagerTDL: 'true',
    hideFleetManagerDTUM: 'true',
    hideFleetManagerSAM: 'true',

    hideSystem: 'true',
    hideSystemSC: 'true',
    hideSystemEV: 'true',
    hideSystemSM: 'true',
    hideSystemAV: 'true',
    hideSystemNV: 'true',
    hideSystemETLM: 'true',
    hideSystemDBO: 'true',
    hideSystemSESS: 'true',
    hideSpreadSheet: 'true',
    hideDataDictionaries: 'true',
    hideDataDictionariesAntenna: 'true',
    hideDataDictionariesCluster: 'true',
    hideDataDictionariesPLMN: 'true',
    hideCambioPWD: 'true',
    hideAnts1: 'true',
    hideAnts1_SIM: 'true',
    hideAnts1_PORT: 'true',
    hideAnts1_LINE: 'true',
    hideAnts1_ADHOC: 'true',
    hideAnts1_TESTDESIGN: 'true',
    hideAnts1_TESTS: 'true'
  };

  sPlatformName: string = '';
  // static sOpenWindow: string;
  userName: string = '';
  // static sDateNow: Date = null;
  sDateNowH: string = '';
  // sUserData: any = null;
  sPassword: string = '';
  sSymb_TimeStamp: string = '';
  sMail: string = '';
  groupName: string = '';
  finestreMapsAperte = new Array();
  urlRoot: string = '';
  operatorGroupName: string = '';
  operatorProfileName: string = '';
  operatorProfileDesc: string = '';

  bloccatoContext = false;
  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;
  contextTesto = '';

  bloccatoContextDB = false;
  contextmenuDB = false;
  contextmenuDBX = 0;
  contextmenuDBY = 0;
  contextTestoDB = '';

  sessionID2 = '';
  fullScreen = false;
  i;
  debug2 = false;
  dataCompilazione = '';
  versione = '';

  messaggioConferma = '';
  gridDashboardSalvate;

  // Modulo APK
  device;
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
  presoJSON = false;
  // Modulo APK

  menuSelezionato: string[] = []; // ['menuApplicazioni', 'menuFM', 'menuDD', 'menuUM', 'menuS', 'menuSpreadSheet', 'menuAnts1', 'menuSession'];

  constructor(
    private router: Router,
    // private sessionService: SessionService,
    private apiService: ApiService,
    private http: ExternalHttpClient,
    public sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: any,
    // private platform: Platform,
    private comandiVocali: ComandiVocaliComponent,
    // private fileSaver: FileSaverService,
  ) {
    this.letteImpostazioni = false;

    const md = localStorage.getItem('ModalitaDebug');
    if (md !== null) {
      UtilsInterna.modalitaDebug = (md === 'S' ? true : false);
    } else {
      UtilsInterna.modalitaDebug = false;
    }

    /* UtilsInterna.scriveLog(chrome);
    chrome.tabs.query({windowType:'normal'}, function(tabs) {
      for(var i = 0; i < tabs.length; i++) {
        // chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
        UtilsInterna.scriveLog(tabs[i]);
      }
     });
    if (this.platform.ANDROID) {
      this.device = 'ANDROID';
    } else {
      this.device = 'WEB PAGE';
    }

    this.getJSON().subscribe(data => {
      const b = JSON.parse(data._body);
      // UtilsInterna.scriveLog(b.Proxy.toUpperCase());
      MenuComponent.linkIcone = b.linkIcone;
      this.serverPostRest = b.serverPostRest;
      this.urlRoot = b.urlRoot;
      // UtilsInterna.scriveLog('Letto connection.json');

      this.getJSONData().subscribe(data2 => {
        const b2 = JSON.parse(data2._body);
        this.dataCompilazione = b2.compilation_date;
        this.versione = b2.version;
      });

      // this.login('Luigi.Pecce', 'latitude', false);
      let q = 0;
      this.i = setInterval(() => {
        // UtilsInterna.scriveLog(q, this.sessionID2);
        if (this.sessionID2 && this.sessionID2 !== '') {
          clearInterval(this.i);
          this.LeggeImpostazioni();
        } else {
          q += 1;
          if (q === 50) {
            clearInterval(this.i);
            UtilsInterna.scriveLog('MENU: Scaduto tempo. DEBUG: ', this.debug2);
            if (this.debug2 === false) {
              const addr = this.urlRoot;
              const doveURL = addr + 'login';
              // window.location.href = doveURL;
              // const ww = window.open(doveURL, '_blank');
              location.assign(doveURL);
            }
          }
        }
      }, 100);
    }); */
  }

  ngAfterViewInit() {
  }

  /* getJSON(): Observable<any> {
    // UtilsInterna.scriveLog(window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && window.location.port === '4200') {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }
    // UtilsInterna.scriveLog(indirizzo);
    return this.http.get(indirizzo);
  } */

  public getJSONData(): Observable<any> {
    let indirizzo =  this.urlRoot + 'geoantsweb//login/assets/info.json?d=' + new Date();
    if (window.location.hostname.indexOf('localhost') > -1 && window.location.port === '4200') {
      indirizzo = 'http://localhost:2727/login/assets/info.json?d=' + new Date();
    }
    // UtilsInterna.scriveLog(indirizzo);
    return this.http.get(null, indirizzo);
  }

  LeggeSimbolici() {
    // UtilsInterna.scriveLog('Leggo simbolici', this.sessionId);
    if (!this.sessionID2 || this.sessionID2 === '' || this.sessionID2 === null)  {
      return;
    }
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '"' +
    '}';
    // UtilsInterna.scriveLog(params);
    this.apiService.chiamataPost('geo_symbolic__sel', JSON.parse(params), this.serverPostRest)
    // .map(response => response)
    .subscribe(data2 => {
      // UtilsInterna.scriveLog(data2);
      // logConsole('Simbolici', data2);
      if (data2 && data2 !== null) {
        // if (data2.v_err_code && data2.v_err_code === 2) {
        //   alert(data2.v_failure_reason);
        // } else {
          // const data = JSON.parse(data2);
          // // UtilsInterna.scriveLog(data); //  and name = \'GEO_R_MAP_MAX_MEASR\'

          data2.forEach(element => {
            let name;
            let valore;

            if (element.NAME) {
              name = element.NAME;
              valore = element.VALUE;
            } else {
              if (element.name) {
                name = element.name;
                valore = element.value;
              }
            }
            // UtilsInterna.scriveLog(name, valore);

            switch (name) {
              case 'fleet_manager.name':
                this.NomeFleetManager = valore;
                break;
              case 'fleet_manager.test_campaigns.name':
                this.nomeTestCampaign = valore;
                break;
              case 'ANTS1_ENABLED':
                // alert('Symbolic ants1: ' + valore);
                break;
              case 'SYS_ANALYTICTS_PAGE':
                this.indirizzoAnalytics = valore;
                UtilsInterna.scriveLog('Indirizzo Analytics Menu', this.indirizzoAnalytics);
                break;
              }
          });
        // }
      // } else {
        // alert('Read symbolic null');
      }
    }, error => {
      // alert('Read symbolic: ' + error);
    });
  }

  newWorkSpaceVisibile = false;
  letteImpostazioni = false;

  LeggeImpostazioni() {
    if (this.debug === true) {
      UtilsInterna.scriveLog('MENU: Sessione utente per lettura info my grid', this.sessionID2);
    }
    if (!this.giaLettoJson) {
      logConsole('Esco per indirizzo non caricato');
      return;
    }
    if (this.letteImpostazioni) {
      logConsole('Esco per impostazioni caricate');
      return;
    }
    this.letteImpostazioni = true;

    const params = {
      cntx_id: this.sessionID2
    };
    
    // logConsole('MENU: Lettura impostazioni menù per utente: ' + this.sessionID2 + ' con parametri: ' + JSON.stringify(params), this.serverPostRest);
    // UtilsInterna.scriveLog(this.serverPostRest, 'operator_info_my__grid', params);
    this.apiService.chiamataPost('operator_info_my__grid',  params, this.serverPostRest)
    // .map(response => response)
    .subscribe(data => {
      this.visibilita.hideScheduler = 'true'; // data2.DataTable[0].TestScenario;
      this.visibilita.hideReport = 'true'; // data2.DataTable[0].Olap;
      this.visibilita.hideAdhoc = 'true'; // data2.DataTable[0].TestScenario;
      this.visibilita.hideSiteCoverage = 'true'; // data2.DataTable[0].NetworkDb;
      this.visibilita.hideEventLog = 'true'; // data2.DataTable[0].Event;
      this.visibilita.hideSimManager = 'true'; // data2.DataTable[0].Sim;
      this.visibilita.hidePortManager = 'true'; // data2.DataTable[0].Rtu;
      this.visibilita.hideLineManager = 'true'; // data2.DataTable[0].Line;
      this.visibilita.hideSpreadSheet = 'true';
      this.visibilita.hideAnts1 = 'true';
      this.visibilita.hideAnts1_SIM = 'true';
      this.visibilita.hideAnts1_PORT = 'true';
      this.visibilita.hideAnts1_LINE = 'true';
      this.visibilita.hideAnts1_ADHOC = 'true';
      this.groupName = 'SVIL';
      this.visibilita.hideAnalytics = 'true';
      this.sPlatformName = '';
      this.sMail = '';
      this.sDateNowH = '';

      if (data && data.DataTable) {
        // UtilsInterna.scriveLog('Lettura impostazioni menù', data);

        // let platform_name1 = '';
        // let platform_name2 = '';
        this.userName = '';
        //logConsole('Privilegi', data.DataTable);

        data.DataTable.forEach(element => {
          switch (element.NAME) {
            case 'geo_dashboard__ins':
              this.newWorkSpaceVisibile = (element.VALUE === 'Y' ? true : false);
              break;
            case 'PLATFORM_NAME':
              this.platform_name1 = element.VALUE;
              break;
            case 'PLATFORM_VER':
              this.platform_name2 = element.VALUE;
              break;
            case 'operator_name':
              this.userName = element.VALUE;
              if (this.debug === true) {
                UtilsInterna.scriveLog('MENU: Utente loggato', this.userName);
              }
              break;
            case 'login_page_url':
              UtilsInterna.userRedirect = element.VALUE;
              // alert(element.VALUE);
              if (this.debug === true) {
                UtilsInterna.scriveLog('MENU: URL Redirect per utente', element.VALUE);
              }
              break;
            case 'operator_group_name':
              this.operatorGroupName = element.VALUE;
              break;
            case 'operator_profile_name':
              this.operatorProfileName = element.VALUE;
              break;
            case 'operator_profile_description':
              this.operatorProfileDesc = element.VALUE;
              break;
            case 'PLATFORM_TIMEZONE':
              this.sSymb_TimeStamp =
                'Time of the remote server  (' + element.VALUE + '). ' +
                'All timestamps are reported in the remote server time';
              break;
            case 'analytics':
              this.visibilita.hideAnalytics = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'geo_analysis':
              this.visibilita.hideMaps = element.VALUE === 'Y' ? 'false' : 'true';
              break;

            case 'user_manager':
              this.visibilita.hideUserManager = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'user_manager.user':
              this.visibilita.hideUserManagerUsers = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'user_manager.groups':
              this.visibilita.hideUserManagerGroups = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'user_manager.user_profiles':
              this.visibilita.hideUserManagerUP = element.VALUE === 'Y' ? 'false' : 'true';
              break;

            case 'fleet_manager':
              this.visibilita.hideFleetManager = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'fleet_manager.test_campaigns':
              this.visibilita.hideFleetManagerTC = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'fleet_manager.group_definition':
              this.visibilita.hideFleetManagerAGD = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'fleet_manager.group_configuration':
              this.visibilita.hideFleetManagerAGC = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'fleet_manager.agent_profile_library':
              this.visibilita.hideFleetManagerAGPL = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'fleet_manager.query_pck_library':
              this.visibilita.hideFleetManagerQPL = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'fleet_manager.test_scenario_library':
              this.visibilita.hideFleetManagerTDL = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'fleet_manager.drive_test_units_manager':
              this.visibilita.hideFleetManagerDTUM = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'fleet_manager.single_agent_test':
              this.visibilita.hideFleetManagerSAM = element.VALUE === 'Y' ? 'false' : 'true';
              break;

            case 'system_manager':
              this.visibilita.hideSystem = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'system_manager.system_config':
              this.visibilita.hideSystemSC = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'system_manager.event_viewer':
              this.visibilita.hideSystemEV = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'system_manager.system_monitor':
              this.visibilita.hideSystemSM = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'system_manager.alarm_viewer':
              this.visibilita.hideSystemAV = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'system_manager.etl_monitor':
              this.visibilita.hideSystemETLM = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'system_manager.db_obj':
              this.visibilita.hideSystemDBO = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'system_manager.session':
              this.visibilita.hideSystemSESS = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
              
            case 'spreadsheet':
              this.visibilita.hideSpreadSheet = (element.VALUE === 'Y' ? 'false' : 'true');
              break;

            case 'ants1_menu_sim_archive_mng':
              this.visibilita.hideAnts1 = 'false';
              this.visibilita.hideAnts1_SIM = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'ants1_menu_port_mng':
              this.visibilita.hideAnts1 = 'false';
              this.visibilita.hideAnts1_PORT= (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'anst1_menu_line_mng':
              this.visibilita.hideAnts1 = 'false';
              this.visibilita.hideAnts1_LINE = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'ants1_menu_test_adhoc':
              this.visibilita.hideAnts1 = 'false';
              this.visibilita.hideAnts1_ADHOC = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'ants1_menu_test_design':
              this.visibilita.hideAnts1 = 'false';
              this.visibilita.hideAnts1_TESTDESIGN = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
            case 'ants1_menu_test_monitoring':
              this.visibilita.hideAnts1 = 'false';
              this.visibilita.hideAnts1_TESTS = (element.VALUE === 'Y' ? 'false' : 'true');
              break;

            case 'data_dictionaries':
              this.visibilita.hideDataDictionaries = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'data_dictionaries.antenna':
              this.visibilita.hideDataDictionariesAntenna = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'data_dictionaries.cluster':
              this.visibilita.hideDataDictionariesCluster = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'data_dictionaries.plmn':
              this.visibilita.hideDataDictionariesPLMN = element.VALUE === 'Y' ? 'false' : 'true';
              break;
            case 'operator__change_psw_my':
              this.visibilita.hideCambioPWD = element.VALUE === 'Y' ? 'false' : 'true';
              break;
          }
        });
        // UtilsInterna.scriveLog('Utente letto: ', this.userName);
        if (!this.userName || this.userName === '') {
          this.userName = 'DebugUser';
        }
        if (this.userName.indexOf('Luigi.Pecce') > -1) {
          this.visibilita.hideSpreadSheet = 'false';
          
          this.visibilita.hideAnts1 = 'false';
          this.visibilita.hideAnts1_SIM = 'false';
          this.visibilita.hideAnts1_PORT = 'false';
          this.visibilita.hideAnts1_LINE = 'false';
          this.visibilita.hideAnts1_ADHOC = 'false';
          this.visibilita.hideAnts1_TESTS = 'false';
          this.visibilita.hideAnts1_TESTDESIGN = 'false';
        }
        
        // UtilsInterna.scriveLog(this.platform_name1 + ' *** ' + this.platform_name2);
        this.sPlatformName =  this.platform_name1; //  + ' ' + this.platform_name2;
        // alert(this.platform_name1);

        this.platFormNameEmit.emit(this.sPlatformName);
        this.dataAttualeEmit.emit(this.sDateNowH);
        this.symbTsEmit.emit(this.sSymb_TimeStamp);

        UtilsInterna.scriveLog(this.visibilita);

        // this.LeggeDashboardSalvate();
      }
    }, error =>  {
      // TODO alert error
    });
  }

  ngOnInit() {
    // window.addEventListener('popstate', this.handlePopState);
    this.letteImpostazioni = false;
  }

  /* handlePopState(event: PopStateEvent) {
    alert('Pulisco cache');
    window.location.reload();
  } */

  ngOnDestroy() {
    // window.removeEventListener('popstate', this.handlePopState);
    if (this.changeAbout) {
      this.changeAbout.nativeElement.remove();
    }
    if (this.changePsw) {
      this.changePsw.nativeElement.remove();
    }
  }

  ngOnChanges(r) {
    let aggiorna = false;

    if (r.sessionID) {
      if (r.sessionID.currentValue) {
        this.sessionID2 = r.sessionID.currentValue;
        UtilsInterna.sessionID = this.sessionID2;
        logConsole('MENU: Sessione utente per lettura info my grid', this.sessionID2);
        // UtilsInterna.scriveLog('SESSION ID:', this.sessionID2);

        aggiorna = true;

        this.LeggeDashboardSalvate();
      } else {
        this.sessionID2 = '';
      }
    }

    if (r.debug) {
      if (r.debug.currentValue) {
        this.debug2 = r.debug.currentValue;
      }
    }

    if (r.applicazione) {
      if (r.applicazione.currentValue) {
        this.applicazione2 = r.applicazione.currentValue;
        aggiorna = true;
      }
    }

    if (r.refreshFavoriti) {
      if (this.sessionID2) {
        this.LeggeDashboardSalvate();
        aggiorna = true;
      }
    }

    if (r.comandoVocale) {
      if (r.comandoVocale.currentValue) {
        if (this.debug2 === true) {
          UtilsInterna.scriveLog('Arrivato comando vocale menù:', r.comandoVocale.currentValue);
        }
        this.comandiVocali.esegueComandoVocale(this, r.comandoVocale.currentValue);
      }
    }

    if (r.voceSelezionata) {
      if (r.voceSelezionata.currentValue) {
        switch (r.voceSelezionata.currentValue) {
          case 'AI':
            this.changeStateAccordion(7);
            break;
          case 'UserManager':
            this.changeStateAccordion(6);
            break;
          case 'System':
            this.changeStateAccordion(5);
            break;
          case 'FleetManager':
            this.changeStateAccordion(4);
            break;
          case 'Session':
            this.changeStateAccordion(2);
            break;
          case 'DataDictionaries':
            this.changeStateAccordion(3);
            break;
          case 'Mappe':
            this.changeStateAccordion(1);
            break;
          case 'Ants':
            this.changeStateAccordion(9);
            break;
          case '':
            this.changeStateAccordion(0);
            break;
        }
        aggiorna = true;
      }
    }

    if (r.chiudiTutteVoci) {
      if (r.chiudiTutteVoci.currentValue === true) {
        this.changeStateAccordion(0);
        aggiorna = true;
      }
    }

    if (aggiorna) {
      this.LeggeImpostazioni();
    }
  }

  apreNavigazione() {
    this.aperturaNavigazione = !this.aperturaNavigazione;
    if (this.aperturaNavigazione) {
      this.premutoEmit.emit(1);
      // UtilsInterna.scriveLog('Apertura menù');
    }
  }

  changeStateAccordion(n) {
    // UtilsInterna.scriveLog('Cambio stato accordion')
    return;
    
    const tm = setTimeout(() => {
      clearTimeout(tm);

      alert('Cambio stato accordion: ' + n);

      switch (n) {
        case '':
          this.menuSelezionato = [];
          this.aperturaNavigazione = false;
          this.menuApplicazioni = false;
          this.menuSession = false;
          this.menuDD = false;
          this.menuFM = false;
          this.menuS = false;
          this.menuUM = false;
          this.menuSpreadSheet = false;
          this.menuAnts1 = false;
          break;
        case 'menuApplicazioni':
          this.menuSelezionato = ['menuApplicazioni'];
          this.aperturaNavigazione = true;
          this.menuApplicazioni = true;
          this.menuSession = false;
          this.menuDD = false;
          this.menuFM = false;
          this.menuS = false;
          this.menuUM = false;
          this.menuAI = false;
          this.menuSpreadSheet = false;
          this.premutoEmit.emit(1);
          this.menuAnts1 = false;
          break;
        case 'menuSession':
          this.menuSelezionato = ['menuSession'];
          this.aperturaNavigazione = true;
          this.menuApplicazioni = false;
          this.menuSession = true;
          this.menuDD = false;
          this.menuFM = false;
          this.menuS = false;
          this.menuUM = false;
          this.menuAI = false;
          this.menuSpreadSheet = false;
          this.menuAnts1 = false;
          this.premutoEmit.emit(2);
          break;
        case 'menuDD':
          this.menuSelezionato = ['menuDD'];
          this.aperturaNavigazione = true;
          this.menuApplicazioni = false;
          this.menuSession = false;
          this.menuDD = true;
          this.menuFM = false;
          this.menuS = false;
          this.menuUM = false;
          this.menuAI = false;
          this.menuSpreadSheet = false;
          this.menuAnts1 = false;
          this.premutoEmit.emit(3);
          break;
        case 'menuFM':
          this.menuSelezionato = ['menuFM'];
          this.aperturaNavigazione = true;
          this.menuApplicazioni = false;
          this.menuSession = false;
          this.menuDD = false;
          this.menuFM = true;
          this.menuS = false;
          this.menuUM = false;
          this.menuAI = false;
          this.menuSpreadSheet = false;
          this.menuAnts1 = false;
          this.premutoEmit.emit(4);
          break;
        case 'menuS':
          this.menuSelezionato = ['menuS'];
          this.aperturaNavigazione = true;
          this.menuApplicazioni = false;
          this.menuSession = false;
          this.menuDD = false;
          this.menuFM = false;
          this.menuS = true;
          this.menuUM = false;
          this.menuAI = false;
          this.menuSpreadSheet = false;
          this.menuAnts1 = false;
          this.premutoEmit.emit(5);
          break;
        case 'menuUM':
          this.menuSelezionato = ['menuUM'];
          this.aperturaNavigazione = true;
          this.menuApplicazioni = false;
          this.menuSession = false;
          this.menuDD = false;
          this.menuFM = false;
          this.menuS = false;
          this.menuUM = true;
          this.menuAI = false;
          this.menuSpreadSheet = false;
          this.menuAnts1 = false;
          this.premutoEmit.emit(6);
          break;
        case 'menuAI':
          this.menuSelezionato = ['menuAI'];
          this.aperturaNavigazione = true;
          this.menuApplicazioni = false;
          this.menuSession = false;
          this.menuDD = false;
          this.menuFM = false;
          this.menuS = false;
          this.menuUM = false;
          this.menuAI = true;
          this.menuSpreadSheet = false;
          this.menuAnts1 = false;
          this.premutoEmit.emit(7);
          break;
        case 'menuSpreadSheet':
          this.menuSelezionato = ['menuSpreadSheet'];
          this.aperturaNavigazione = true;
          this.menuApplicazioni = false;
          this.menuSession = false;
          this.menuDD = false;
          this.menuFM = false;
          this.menuS = false;
          this.menuUM = false;
          this.menuAI = false;
          this.menuSpreadSheet = true;
          this.menuAnts1 = false;
          this.premutoEmit.emit(8);
          break;
        case 'menuAnts1':
          this.menuSelezionato = ['menuAnts1'];
          this.aperturaNavigazione = true;
          this.menuApplicazioni = false;
          this.menuSession = false;
          this.menuDD = false;
          this.menuFM = false;
          this.menuS = false;
          this.menuUM = false;
          this.menuAI = false;
          this.menuSpreadSheet = false;
          this.menuAnts1 = true;
          this.premutoEmit.emit(9);
          break;
      }
    }, 100);
  }

  caricaDashboard(i, ii, inNuovaPagina) {
    // UtilsInterna.scriveLog(this.gridDashboardSalvate[i].DASHBOARD[ii]);
    localStorage.removeItem('lastWorkspace');
    // alert(this.gridDashboardSalvate[i].DASHBOARD[ii].NAME);
    this.changePage('Mappe;Mappe', this.gridDashboardSalvate[i].DASHBOARD[ii].NAME, inNuovaPagina);
  }

  changePage(url, altro, newPage) {
    if (url.indexOf('Analytics') > -1) {
      const url2 = this.sanitizer.bypassSecurityTrustUrl(this.indirizzoAnalytics) as string;
      UtilsInterna.scriveLog(url2);
      const ww = window.open(this.indirizzoAnalytics, '_blank');

      return;
    }

    if (url.indexOf('AI') > -1) {
      newPage = true;
    }

    const campiOrig = url.split(';');
    const campi = this.ritornaNomeApp(url);

    let ancora = '';
    if (altro && altro !== '') {
      ancora = ',"altro": "' + altro + '"'
    }

    const passaggio = '{ ' +
      '"sess": "' + this.sessionID2 + '", ' +
      '"gname": "' + this.operatorGroupName + '", ' +
      '"uname": "' + this.userName + '", ' +
      '"form": "' + campi[3] + '", ' +
      '"FS": "' + this.fullScreen.toString() + '"' +
      ancora +
    '}';
    logConsole('Chiamata:', passaggio);
    // return;
    const pass = UtilsInterna.cripta(passaggio);
    // alert('Passaggio dati: ' + JSON.stringify(passaggio));
    // UtilsInterna.scriveLog(pass);
    // UtilsInterna.scriveLog(UtilsInterna.decripta(pass));
    // return;

    let addr = this.urlRoot;

    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      addr = 'http://localhost:4200';
      campi[0] = '';
    } else {
      if (!addr.endsWith('/')) {
        addr += '/';
      }
      if (addr.indexOf('geoantsweb/') === -1) {
        addr += 'geoantsweb/';
      }
    }
    // logConsole('Indirizzo da menu ', addr);

    /* let add = 'geoantsweb';

    switch (this.pre) {
      case "true":
        add = 'geoantsweb-pre'
        break;
      case "false":
        add = 'geoantsweb-prod'
        break;
      default:
        break;
    }

    if (addr.indexOf('geoantsweb') > -1 && add.indexOf(add) === -1) {
      addr = addr.replace('geoantsweb', add);
    }
    addr = addr.replace('_pre_pre', '_pre');
    addr = addr.replace('_prod_prod', '_prod'); */

    UtilsInterna.scriveLog(addr + campi[0] + '/?par=' + pass); // sess=' + this.sessionID2 +
                                                        // '&gname=' + this.operatorGroupName +
                                                        // '&uname=' + this.userName +
                                                        // '&form=' + campiOrig[1] +
                                                        // '&FS=' + this.fullScreen);
    const doveURL = addr + campi[0] + '/?par=' + pass; // + '/?sess=' + this.sessionID2 +
                                      //                   '&gname=' + this.operatorGroupName +
                                      //                   '&uname=' + this.userName +
                                      //                   '&form=' + campiOrig[1] +
                                      //                   '&FS=' + this.fullScreen;
    // UtilsInterna.scriveLog(doveURL);
    logConsole('Cambio pagina: ', doveURL);
    // return;
    // window.location.href = doveURL;
    // const ww = window.open(doveURL, '_blank');
    if (newPage) {
      const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
      UtilsInterna.scriveLog(url2);
      const ww = window.open(doveURL, '_blank');
    } else {
      // location.assign(doveURL);
      // const doveURL = "https://chatgpt.com/"
      window.location.replace(doveURL)
    }
  }

  onrightClick(cosa, event) {
    event.preventDefault();
    this.contextTesto = cosa;
    // UtilsInterna.scriveLog('Premuto right:', event, cosa);
    this.contextmenuX = event.clientX;
    this.contextmenuY = event.clientY;
    this.contextmenu = true;
  }

  onrightClickDB(cosa1, cosa2, event) {
    event.preventDefault();
    this.contextTestoDB = cosa1 + ';' + cosa2;
    // UtilsInterna.scriveLog('Premuto right:', event, cosa);
    this.contextmenuDBX = event.clientX;
    this.contextmenuDBY = event.clientY;
    this.contextmenuDB = true;
  }

  chiudiContext() {
    this.contextmenu = false;
  }

  clickContextMenu(e) {
    this.chiudiContext();

    if (+e === -1) {
      return;
    }
   //  switch (e) {
   //    case '1':
    this.openLinkInNewTab();
   //      break;
   //  }
  }

  chiudiContextDB() {
    this.contextmenuDB = false;
  }

  clickContextMenuDB(e) {
    this.chiudiContextDB();

    const ee = e.split(';');

    if (+ee[0] === -1) {
      return;
    }

    switch (ee[0]) {
      case '1':
        localStorage.removeItem('lastWorkspace');
        this.caricaDashboard(ee[1], ee[2], true);
        break;
      case '2':
        this.eliminaDashboard(ee[1], ee[2]);
        break;
    }
  }

  eliminaDashboard(i, ii) {
    if (confirm('Do you want delete the favourite\n\n\'' + this.gridDashboardSalvate[i].DASHBOARD[ii].NAME + '\' ?')) {
      const params = {
        cntx_id: this.sessionID2,
        v_obj_type: 'geo_analysis',
        v_obj_name: this.gridDashboardSalvate[i].DASHBOARD[ii].NAME
      };
      this.apiService.chiamataPost2(this.serverPostRest, 'operator_obj_my__del',  params)
      // .map(response => response)
      .subscribe(data => {
        UtilsInterna.scriveLog(data);
        if (data.err_code > 0) {
          alert('ERROR: ' + data.failure_reason);
        } else {
          this.LeggeDashboardSalvate();
        }
      });
    }
  }

  aprichiudi(i) {
    this.gridDashboardSalvate.forEach(element => {
      element.VISIBLE = false;
    });
    this.gridDashboardSalvate[i].VISIBLE = true;
  }

  openLinkInNewTab() {
    const campi = this.ritornaNomeApp(this.contextTesto);
    // alert(campi[3]);

    const passaggio = '{ ' +
      '"sess": "' + this.sessionID2 + '", ' +
      '"gname": "' + this.operatorGroupName + '", ' +
      '"uname": "' + this.userName + '", ' +
      '"form": "' + campi[3] + '", ' +
      '"FS": "' + this.fullScreen.toString() + '"' +
      '}';
    const pass = UtilsInterna.cripta(passaggio);
    // UtilsInterna.scriveLog(passaggio);
    // UtilsInterna.scriveLog(pass);
    // UtilsInterna.scriveLog(UtilsInterna.decripta(pass));

    let addr = this.urlRoot;

    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      addr = 'http://localhost:4200';
      campi[0] = '';
    } else {
      if (!addr.endsWith('/')) {
        addr += '/';
      }
      if (addr.indexOf('geoantsweb/') === -1) {
        addr += 'geoantsweb/';
      }
    }

    UtilsInterna.scriveLog(addr + campi[0] + '/?par=' + pass); // sess=' + this.sessionID2 +
                                                    //     '&gname=' + this.operatorGroupName +
                                                    //     '&uname=' + this.userName +
                                                    //     '&form=' + campi[3] +
                                                    //     '&FS=' + this.fullScreen);
    const doveURL = addr + campi[0] + '/?par=' + pass; //  + '/?sess=' + this.sessionID2 +
                                        //                 '&gname=' + this.operatorGroupName +
                                        //                 '&uname=' + this.userName +
                                        //                 '&form=' + campi[3] +
                                        //                 '&FS=' + this.fullScreen;
    // UtilsInterna.scriveLog(doveURL);
    const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
    UtilsInterna.scriveLog(url2);
    const ww = window.open(doveURL, '_blank');
  }

  toggleFullScreen() {
    this.MenuVisibile = false;

    if (this.fullScreen === false) {
      UtilsInterna.scriveLog('Imposto full screen: SI');
      this.fullScreen = true;
      const elem: any = document.documentElement; // .requestFullscreen();

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
      }
      this.chiudeDrawer('SCREEN');
    } else {
      // if (document.exitFullscreen) {
        UtilsInterna.scriveLog('Imposto full screen: NO');
        this.fullScreen = false;
      //   document.exitFullscreen();
      // }
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
      this.chiudeDrawer('SCREEN');
    }
  }

  resetLayout() {
    // this.confermaDialog.showDialogMessage('W Pippe les Baud');
    return;

    if (confirm('The layout will be reset for all the Dashboards and you\'ll be logged out.')) {
      // this.cookieService.deleteAll('/');

      // const now = new Date();
      // this.cookieService.set('clear_all_cookies', 'clear',
      // new Date(now.getTime() * 1000), '/');

      localStorage.clear();

      // this.router.navigate(['/login']);
      const addr = this.urlRoot;
      // const doveURL = addr + 'login';
      // UtilsInterna.scriveLog(doveURL);
      // const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
      // UtilsInterna.scriveLog(url2);
      // const ww = window.open(doveURL, '_blank');
      // location.assign(doveURL);
      const doveURL = addr + 'login/';
      // alert(doveURL);
      // const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
      // UtilsInterna.scriveLog(url2);
      location.assign(doveURL);
    }
  }

  about() {
    // this.errorMsg.showErrorMessage('', '', 'About');
  }

  logout() {
    const params = {
      v_cntx: this.sessionID2
    };
    // UtilsInterna.scriveLog('geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost('operator__logout',  params,this.serverPostRest)
    // .map(response => response)
    .subscribe(data => {
      // UtilsInterna.scriveLog(data);

      // Chiude le eventuali maschere maps aperte
      if (this.finestreMapsAperte.length > 0) {
        this.finestreMapsAperte.forEach(element => {
          element.close();
        });
        this.finestreMapsAperte = new Array();
      }
      // Chiude le eventuali maschere maps aperte

      // this.sessionService.logout();

      // const addr = this.urlRoot;
      // const doveURL = addr + 'login';
      // window.location.href = doveURL;
      // location.assign(doveURL);

      if (UtilsInterna.userRedirect === 'default') {
        let u = window.location.href;
        // u = 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/login/login/';
        // u = 'https://geoants.aubay.it/login';
        // UtilsInterna.scriveLog(u);
        if (u.indexOf('?') > -1) {
          u = u.substring(0, u.indexOf('?'));
        }
        u = u.replace('login/login', 'login');
        // UtilsInterna.scriveLog(u);
        const prima = u.substring(0, 8);
        let seconda = u.substring(8, u .length);
        while (seconda.indexOf('//') > -1) {
          seconda = seconda.replace('//', '/');
        }
        u = prima + seconda;
        // UtilsInterna.scriveLog(u);
        // UtilsInterna.scriveLog(u.substring(u.length - 1, u.length));
        if (u.substring(u.length - 1, u.length) === '/') {
          u = u.substring(0, u.length - 1);
        }
        // UtilsInterna.scriveLog(u);
        let q = 0;
        for (let i = 0; i<u.length; i++) {
          if (u.substring(i, i + 1) === '/') {
            q++;
          }
        }
        if (q > 2) {
          // UtilsInterna.scriveLog(u, prima, seconda);
          for (let i = u.length; i>0; i--) {
            if (u.substring(i, i + 1) === '/')  {
              u = u.substring(0, i);
              i = 0;
            }
          }
        }
        // UtilsInterna.scriveLog('Indirizzo lettura connection.json', u  + '/assets/connection.json');
        const addr = u; // + '/assets/connection.json?d=' + new Date();

        const doveURL = addr + '/login/';
        // alert(doveURL);
        // const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
        // UtilsInterna.scriveLog(url2);
        // const ww = window.open(doveURL, '_blank');
        if (this.debug === true) {
          UtilsInterna.scriveLog('MENU: Premuto logout. Redirect: ', doveURL);
        }

        window.location.replace(doveURL);
      } else {
        if (this.debug === true) {
          UtilsInterna.scriveLog('MENU: Premuto logout. Redirect diversa da default: ', UtilsInterna.userRedirect);
        }

        window.location.replace(UtilsInterna.userRedirect);
      }

      // this.router.navigateByUrl('/login');
      // forza un 401
      // this.apiService.getUserData().subscribe();
    }, error => {
      alert(error);
    });

    /* this.apiService.logout()
      // .map(response => response)
      .subscribe(
        data => {
          // Chiude le eventuali maschere maps aperte
          if (this.finestreMapsAperte.length > 0) {
            this.finestreMapsAperte.forEach(element => {
              element.close();
            });
            this.finestreMapsAperte = new Array();
          }
          // Chiude le eventuali maschere maps aperte

          this.sessionService.logout();
          this.router.navigateByUrl('/login');
          // forza un 401
          // this.apiService.getUserData().subscribe();
      }, error => {
          // TODO alert error
    }); */
  }

  chiudeDrawer(r) {
    let emittone = new Date().toString();
    if (r === 'SCREEN') {
      emittone = 'SCREEN;' + emittone;
    }
    this.chiusuraEmit.emit(emittone);
  }

  converteTesto(e) {
    const dove = this.ritornaNomeApp(this.contextTesto);

    return dove[0] + ' / ' + dove[1];
  }

  ritornaNomeApp(c) {
    const campi = c.split(';');
    // UtilsInterna.scriveLog('Passaggio a progetto ' + campi[0] + ', maschera: ' + campi[1]);

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
      case 'Analytics':
        dove = 'Analytics';
        break;
      case 'Mappe':
        dove = 'Mappe';
        break;
      case 'Home':
        dove = 'HomePage';
        break;
      case 'AI':
        dove = 'aiProject';
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
      case 'AI':
        funzione = 'AI';
        break;
      case 'SC':
        funzione = 'System Configuration';
        break;
      case 'EV':
        funzione = 'Event Viewer';
        break;
      case 'AV':
        funzione = 'Alarms Viewer';
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
      case 'SS':
        funzione = 'Spread Sheet';
        break;
      case 'SIM':
        funzione = 'SIM Management';
        break;
      case 'PORT':
        funzione = 'Port Management';
        break;
      case 'LINE':
        funzione = 'Line Management';
        break;
      case 'ADHOC':
        funzione = 'Ad Hoc Tests';
        break;        
      case 'TESTDESIGN':
        funzione = 'Test Design';
        break;
      case 'TESTS':
        funzione = 'Tests';
        break;
    }

    const cc = new Array();
    cc.push(dove);
    cc.push(funzione);
    cc.push(campi[0]);
    cc.push(campi[1]);

    return cc;
  }

  LeggeDashboardSalvate() {
    const params = {
      cntx_id: this.sessionID2,
      v_obj_type: 'geo_analysis'
    };
    // UtilsInterna.scriveLog('operator__login', params);
    this.apiService.chiamataPost2(this.serverPostRest, 'operator_obj_my__grid', params)
    // .map(response => response)
    .subscribe(data => {
      // const data = JSON.parse(data2);
      // UtilsInterna.scriveLog(data);
      const f = new Array();
      data.DataTable.forEach(element => {
        let ok = true;
        f.forEach(element2 => {
          if (ok && element.FOLDER === element2.FOLDER) {
            ok = false;
          }
        });
        if (ok) {
          f.push({ FOLDER: element.FOLDER, VISIBLE: false, DASHBOARD: new Array(), SELECTED: false });
        }
      });
      data.DataTable.forEach(element => {
        f.forEach(element2 => {
          if (element2.FOLDER === element.FOLDER) {
            element2.DASHBOARD.push({ NAME: element.OBJ_NAME, DESCRIPTION: element.DESCRIPTION, SELECTED: false });
          }
        });
      });
      if (this.debug === true) {
        UtilsInterna.scriveLog('Lista workspaces', f);
      }

      const ff = new Array();
      data.DataTable.forEach(element => {
        if (element.OBJ_NAME.toUpperCase().indexOf('(TEMPLATE)') > -1) {
          ff.push({ FOLDER: element.FOLDER, NAME: element.OBJ_NAME, DESCRIPTION: element.DESCRIPTION, SELECTED: false });
        }
      });
      if (this.debug === true) {
        UtilsInterna.scriveLog('Lista workspaces per template', ff);
      }

      this.gridDashboardSalvate = f;
      this.listaWorkSpacesEmit.emit(ff);
      if (this.debug === true) {
        UtilsInterna.scriveLog('MENU. Dashboard caricate:', this.gridDashboardSalvate);
      }
    }, error => {
    });
  }

  pre;

  // MODULO APK
  prendeConnectionJSON(e) {
    this.connectionJSON = e;
    // this.pre = e.pre;
    // logConsole('MENU: Prendo connection JSON:', e);
    // if (this.device) {
      // if (this.device === 'ANDROID') {
      //   alert('Arrivato connection JSON: ' + JSON.stringify(e));
      // }
      this.lettoJSON(e);
    // }
  }

  /* prendeInfoSistema(e) {
    this.infoSistema = e;
    this.device = e.deviceGirante;
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

  giaLettoJson = false;

  lettoJSON(data) {
    /* const b = data;
    // UtilsInterna.scriveLog(b);
    this.linkIcone = b.linkIcone;
    this.serverPostRest = b.serverPostRest;
    this.urlRoot = b.urlRoot;
    UtilsInterna.scriveLog('Letto connection.json: ', b); */

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
    if (urlRoot === 'http://localhost:4200') {
      urlRoot = 'https://antsgraclient.ants-aubay.it/gdpsondamistral'; // Qualsiasi indirizzo in caso di urlRoot /
    }

    this.urlRoot = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.urlRoot, true);
    this.linkIcone  = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
    // this.linkIcone = this.aggiungeIndirizzoAPathRelativo(indirizzoCaricato, b.linkIcone, true);
    this.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.serverPostRest, true);
    this.indirizzoServer = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.serverPostRest, true);
    if (this.debug2) {
      logConsole('Indirizzo di base 1 menù: ', indirizzoCaricato);
      logConsole('Indirizzo di base 2 menù: ', urlRoot);
      logConsole('Indirizzo urlRoot menù: ', this.urlRoot);
      logConsole('Indirizzo Icone menù: ', this.linkIcone);
      logConsole('Indirizzo PostGrest menù: ', this.serverPostRest);
    }
    // Nuova gestione della mail del 28/04/2026 13:16

    this.getJSONData().subscribe(data2 => {
      // UtilsInterna.scriveLog(data2);
      // const b2 = JSON.parse(data2._body);
      this.dataCompilazione = data2.compilation_date;
      this.versione = data2.version;
    });

    this.giaLettoJson = true;

    // this.login('Luigi.Pecce', 'latitude', false);
    let q = 0;
    this.i = setInterval(() => {
      // UtilsInterna.scriveLog(q, this.sessionID2);
      if (this.sessionID2 && this.sessionID2 !== '') {
        clearInterval(this.i);

        this.LeggeImpostazioni();

        this.LeggeSimbolici();
      } else {
        q += 1;
        if (q === 150) {
          clearInterval(this.i);

          UtilsInterna.scriveLog('MENU: Scaduto tempo. DEBUG: ', this.debug2);
          if (window.location.hostname.indexOf('localhost') > -1 && window.location.port === '4200') {
            logConsole('Riavviato verso login 2. Ora sono in debug e non lo faccio');
          } else {
          // if (this.debug2 === false) {
            const addr = this.urlRoot;
            const doveURL = addr + 'geoantsweb/login';
            // alert('Session not found. Redirect to login page: ' + doveURL);
            window.location.replace(doveURL);
          }
        }
      }
    }, 100);

    this.lettoConfigJSON.emit(data);
  }
  // MODULO APK

  fDownloadUserManual() {
    this.userManualEmit.emit(new Date().toString());
  }
}

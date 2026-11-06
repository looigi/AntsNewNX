import { logConsole } from './console-log';
import { ExternalHttpClient } from './db/httpclient.service';
import { environment } from './../environments/environment';
import { ApiService } from './db/api.service';
import { SessionService } from './db/session.service';
import { AfterViewInit, Component, HostListener, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Utils from './Utilities.component';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfermaComponent } from './conferma/conferma.component';
import download from 'downloadjs';  // Importa downloadjs
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('divContenitore', {static: true}) divCont: any;

  public Utils = Utils;
  opacitaCAM = .1;
  agnProps: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  righePerPaginareAutomaticamente = -1;
  indirizzoServer;
  schermoStretto = false;
  ultimaVoltaClickMenu = -1;
  ultimaVoltaClickMenu2 = -1;
  menuVisibile = false;
  menuVisibile2 = false;
  platformName = '';
  dateNowH = '';
  symb_TimeStamp = '';
  maschera = '';
  sessionID;
  searchAgnCode = '';
  searchAgnCode2 = '';
  nomiMaschere = [ '', 'Test Campaigns', 'Single Agent Mode', 'Agent Group Def.', 'Agent Group Conf.',
    'Agent Prof. Libr.', 'Test Design Library', 'QueryPck Library', 'Drive Test Units Mng'
     ];
  fullScreen = '';
  // modalitaDebug = !environment.production;
  dimeDrawer = '0px';
  dimeDrawerInizio = 0;
  nonChiudereDrawer = false;
  dimeDrawerInizio2 = 0;
  dimeDrawer2 = '0px';
  nonChiudereDrawer2 = false;
  datiTimeControl = [
    { ID: 1, NAME: '1'},
    { ID: 2, NAME: '2'},
    { ID: 5, NAME: '5'},
    { ID: 10, NAME: '10'},
    { ID: 30, NAME: '30'},
  ];
  timeControlSelezionato = 10;
  pulisceFiltroDatiControl = false;
  additionalLayer;
  additionalLayer2;
  dimeDrawerAperto = 500;
  statoServer = '';
  statoManutenzione = '';
  coloreStatoServer = 'white';
  microfonoAttivo = false;
  listaWS;
  fmam = false;

  datiPointMeasures;
  titoloPointMeasures;
  nomeGrigliaPM = 'grid_additional_measure_1_fm';
  selezionePM;
  staElaborandoPM;
  misureAddizionaliTCRUN;
  misureAddizionaliTCRUNStart;
  effettuaAutoFitPM = false;
  righePerPaginazioneAutomatica = 60;
  measureData;

  datiAddLayers;

  datiAgnProp;
  AgnProp_G = ['AgnProp 0', 'AgnProp 1', 'AgnProp 2','AgnProp 3','AgnProp 4','AgnProp 5','AgnProp 6','AgnProp 7','AgnProp 8','AgnProp 9'];
  agnProp = ['', '', '', '', '', '', '', '', '', ''];
  /* AgnProp2_G = 'AgnProp 2';
  agnProp2;
  AgnProp3_G = 'AgnProp 3';
  agnProp3; */

  title = 'FleetManager';
  sessId;
  gname;
  uname;
  collegatoDaUrl = false;
  groupName;
  queryPck;
  userName;
  qualeGriglia = 1;
  vociChiuseMenu = false;
  contextAperto = false;
  contextVisibile = false;
  comandoVocale = '';
  operatorID = -1;
  nomeSetAntenne = undefined;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    if (this.divCont) {
      this.divCont.nativeElement.remove();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    // private fileSaver: FileSaverService,
    private http: ExternalHttpClient,
    public sessionService: SessionService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private comandiVocali: ComandiVocaliComponent,
    private _matDialog: MatDialog,
    private titleService: Title
  ) {
    this.impostaTitoloPagina();

    // this.mostraPopup('Error: no sessionID found', false, '');
    const md = localStorage.getItem('ModalitaDebug');
    if (md !== null) {
      this.Utils.modalitaDebug = (md === 'S' ? true : false);
    } else {
      this.Utils.modalitaDebug = false;
    }

    this.agisce(0);

    /* this.getJSON().subscribe((data: any) => {
      // Utils.indirizzoServer = JSON.parse(data._body).indirizzoServer;
      // Utils.linkIcone = JSON.parse(data._body).linkIcone;
      // // this.Utils.scriveLog(Utils.indirizzoServer);

      const b = JSON.parse(data._body);
      // // this.Utils.scriveLog(b.Proxy.toUpperCase());
      Utils.linkIcone = b.linkIcone;
      Utils.serverPostRest = b.serverPostRest;
      if (b.Proxy.toUpperCase() === 'TRUE') {
        Utils.facadeServerAddress = b.facadeServerAddressViaProxy;
      } else {
        Utils.facadeServerAddress = b.facadeServerAddressLocale;
      }
      Utils.serverGEOServer = b.serverGEOServer;
      Utils.indirizzoGEOServer = JSON.parse(data._body).serverGEOServer;
      Utils.urlRoot = b.urlRoot;
      // this.apiService.setUrl(Utils.facadeServerAddress);
      // // this.Utils.scriveLog(Utils.linkIcone);

      this.eseguiConnessione();
    }); */
  }

  portable = false;
  
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

  lettoJSON(data) {
    /* const b = data; // JSON.parse(data._body);
    // // this.Utils.scriveLog(b.Proxy.toUpperCase());
    Utils.linkIcone = b.linkIcone;
    Utils.serverPostRest = b.serverPostRest;
    /* if (b.Proxy.toUpperCase() === 'TRUE') {
      Utils.facadeServerAddress = b.facadeServerAddressViaProxy;
    } else {
      Utils.facadeServerAddress = b.facadeServerAddressLocale;
    } * /
    Utils.serverGEOServer = b.serverGEOServer;
    Utils.indirizzoGEOServer = b.serverGEOServer;
    Utils.urlRoot = b.urlRoot; */

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

    Utils.urlRoot = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.urlRoot, true);
    Utils.linkIcone  = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
    let urlRootSenzaBarraFinale = urlRoot;
    if (urlRootSenzaBarraFinale.endsWith('/') && b.serverPostRest.startsWith(':')) {
      urlRootSenzaBarraFinale = urlRootSenzaBarraFinale.substring(0, urlRootSenzaBarraFinale.length - 1);
    }
    Utils.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRootSenzaBarraFinale, b.serverPostRest, true);
    Utils.indirizzoGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot,  b.serverGEOServer, true);
    Utils.serverGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot,  b.serverGEOServer, true);

    logConsole('Indirizzo di base 1 Fleet: ', indirizzoCaricato);
    logConsole('Indirizzo di base 2 Fleet: ', urlRoot);
    logConsole('Indirizzo urlRoot Fleet: ', Utils.urlRoot);
    logConsole('Indirizzo Icone Fleet: ', Utils.linkIcone);
    logConsole('Indirizzo PostGrest Fleet: ', Utils.serverPostRest);
    logConsole('Indirizzo GeoServer Fleet: ', Utils.serverGEOServer);
    // Nuova gestione della mail del 28/04/2026 13:16
    
    if (b.portable !== undefined) {
      this.portable = true;
        // logConsole(b, b.portable);
        // alert('1' + Utils.portable);
    }

    // this.apiService.setUrl(Utils.facadeServerAddress);
    this.Utils.scriveLog('Indirizzo server', b.serverPostRest);
    this.indirizzoServer = b.serverPostRest;

    this.eseguiConnessione();
  }

  /* public getJSON(): Observable<any> {
    // // this.Utils.scriveLog(window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }
    // this.Utils.scriveLog(indirizzo);
    return this.http.get(indirizzo);
  } */

  eseguiConnessione() {
    this.route.queryParams
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {
      const par = params['par'];
      if (par) {
        const param = JSON.parse(Utils.decripta(par));
        // // this.Utils.scriveLog(param);

        this.sessId = param.sess;
        this.gname = param.gname;
        this.userName = param.uname;
        this.maschera = param.form;
        this.fullScreen = param.FS;

        if (this.fullScreen === 'true') {
          // // this.Utils.scriveLog(this.fullScreen);
          document.documentElement.requestFullscreen();
        }

        if (this.sessId && this.sessId !== undefined && this.sessId !== 'undefined') {
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.collegatoDaUrl = true;
            const dd = { 'username': this.uname };
            this.EffettuaLogin(dd, this.sessId, this.gname, this.userName, '');
          }, 500);
        }
      } else {
        const par = params['form'];
        this.maschera = par;
      }
    });
  }

  connettitiAMano() {
    this.collegatoDaUrl = true;
    this.userName = environment.nomeLogin;

    let pwd = '';
    const p = localStorage.getItem('H7-25-FM');
    if (p !== null) {
      pwd = p;
    } else {
      pwd = prompt("H7-25-FM", "");
      if (pwd === '') {
        this.Utils.visualizzaAlert('No!');
        return;
      }  else  {
        localStorage.setItem('H7-25-FM', pwd);
      }
    }

    this.EffettuaLogin(null, null, null, environment.nomeLogin, pwd);
  }

  login(username, password, rememberme) {
    if (environment.production === true) {
      // alert('Error: no sessionID found');
      this.mostraPopup('Error: no sessionID found', false, '');
      return;
    }

    /* let user = '';
    let pwd = '';
    let tipo = 'Looigi';

    if (tipo === 'Looigi') {
      user = username;
      pwd = password;
    // } else {
      // user = 'Federico.Travaglini.er';
      // pwd = 'cerioni';
    } */

    const params = {
      v_name: username,
      v_password: password,
      v_client_public_ip: '',
      v_city: '',
      v_client_country: '',
      v_org: ''
    };
    // this.Utils.scriveLog('operator__login', params);
    this.apiService.chiamataPost('operator__login', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      // this.Utils.scriveLog(data);
      if (data.err_code !== 0) {
        const rr = data.failure_reason;
      } else {
        this.loginOK(environment.nomeLogin ,data.cntx_id, '');
      }
    }, error => {
      // alert(error);
    });
  }

  pulisciPassword() {
    localStorage.removeItem('H7-25-FM');
    this.Utils.visualizzaAlert('OK');
  }

  EffettuaLogin(dd, sessionId, groupName, userName, password) {
    if (sessionId && sessionId !== '') {
      this.userName = userName;
      this.loginOK(dd, sessionId, '');
    } else {
      let pwd = '';
      const p = localStorage.getItem('H7-25-FM');
      if (p !== null) {
        pwd = p;
      } else {
        pwd = prompt("H7-25-FM", "");
        if (pwd === '') {
          this.Utils.visualizzaAlert('No!');
          return;
        }  else  {
          localStorage.setItem('H7-25-FM', pwd);
        }
      }

      this.login(environment.nomeLogin, pwd, '');
    }
  }

  permessiTab = {
    test_campaigns: {
      tab_agents: false,
      tab_monitoring: false,
      tab_test_scenario: false,
      tab_activities_by_day: false,
      tab_agent_group_conf: false,
      tab_all_tickets: false,
      tab_test: false,
    }
  }

  leggeOperatorInfo() {
    // // this.Utils.scriveLog('Effettua login:', userName, password);

    /* if (sessionId && sessionId !== '') {
      // // this.Utils.scriveLog('Login con credenziali automatiche');
      this.groupName = groupName;
      this.loginOK(dd, sessionId, groupName);
    } else { */
      // // this.Utils.scriveLog('Login con credenziali interne');
      const params = {
        cntx_id: this.sessionID
      }
      this.apiService.chiamataPost('operator_info_my__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
          if (data) {
            Utils.checkRitornoChiamata(this, data);
            // // this.Utils.scriveLog('Ritorno login: ', data);

            // const dd2 = data.OBJECT[0].object;
            // const rr = data.err_code;


            const permessiTab = {
              test_campaigns: {
                tab_agents: false,
                tab_monitoring: false,
                tab_test_scenario: false,
                tab_activities_by_day: false,
                tab_agent_group_conf: false,
                tab_all_tickets: false,
                tab_test: false
              }
            }

            data.DataTable.forEach(element => {
              // this.Utils.scriveLog(element.NAME);
              switch(element.NAME) {
                case 'fleet_manager.map':
                  this.mappaVisibile = element.VALUE;
                  // alert('Mappa visibile: ' + this.mappaVisibile);
                  break;

                case 'fleet_manager.test_campaigns.tab_agents':
                  permessiTab.test_campaigns.tab_agents = (element.VALUE === 'Y' ? true : false);
                  break;
                case 'fleet_manager.test_campaigns.tab_agents.tab_test':
                  permessiTab.test_campaigns.tab_test = (element.VALUE === 'Y' ? true : false);
                  break;
                case 'fleet_manager.test_campaigns.tab_monitoring':
                  permessiTab.test_campaigns.tab_monitoring = (element.VALUE === 'Y' ? true : false);
                  break;
                case 'fleet_manager.test_campaigns.tab_test_scenario':
                  permessiTab.test_campaigns.tab_test_scenario = (element.VALUE === 'Y' ? true : false);
                  break;
                case 'fleet_manager.test_campaigns.tab_activities_by_day':
                  permessiTab.test_campaigns.tab_activities_by_day = (element.VALUE === 'Y' ? true : false);
                  break;
                case 'fleet_manager.test_campaigns.tab_agent_group_conf':
                  permessiTab.test_campaigns.tab_agent_group_conf = (element.VALUE === 'Y' ? true : false);
                  break;
                case 'fleet_manager.test_campaigns.tab_all_tickets':
                  permessiTab.test_campaigns.tab_all_tickets = (element.VALUE === 'Y' ? true : false);
                  break;                  

                case 'fleet_manager.advanced_monitoring':
                  this.fmam = (element.VALUE === 'Y' ? true : false);
                  break;
                case 'string_to_command':
                  this.microfonoAttivo = (element.VALUE === 'Y' ? true : false);
                  break;
                case 'geo_dashboard__frame_editor':
                  Utils.permessoFrameEditor = element.VALUE === 'Y' ? 'false' : 'true';
                  break;
                case 'operator_id':
                  this.operatorID = element.VALUE;
                  break;
                case 'login_page_url':
                  Utils.userRedirect = element.VALUE;
                  // alert(element.VALUE);
                  break;
                case 'operator_group_name':
                  this.groupName = element.VALUE;
                  break;
                case 'query_pck__grid':
                  this.queryPck = element.VALUE;
                  break;
              }
            });

            this.permessiTab = JSON.parse(JSON.stringify(permessiTab));
            // logConsole('Permessi Tab APP', this.permessiTab);
            // if (rr === 0) {
            //   this.loginOK(data, sessionId, '');
            // } else {
            //   // this.Utils.scriveLog('Connection error:' + data.v_failure_reason);
            // }
          } else {
            // this.Utils.scriveLog('Nessun dato ritornato dal login:', data);
          }
      }, error =>  {
        // this.Utils.scriveLog('Login:' + error);
      // TODO alert error
      });
    // }
  }

  loginOK(dd, sessionId, groupName) {
    // // this.Utils.scriveLog('Login Ok:', dd);

    this.sessionService.setRemember(true);
    this.sessionService.setUser(dd);
    this.sessionService.setToken(sessionId);
    this.sessionService.setLogged(true);
    // this.groupName = dd.groupname;
    this.sessionID = sessionId;

    // // this.Utils.scriveLog('Leggo simbolici');
    this.LeggeSimbolici();

    if (this.userName === '') {
      this.userName = 'DebugUser';
    }
    localStorage.setItem(this.userName + '_last_page', 'Fleet Manager');
    localStorage.setItem(this.userName + '_last_form', this.maschera);
    localStorage.setItem(this.userName + '_last_full_screen', this.fullScreen);

    this.caricaTabellaAntenne();

    this.contextVisibile = false;
    const tm = setTimeout(() => {
      clearTimeout(tm);

      switch (this.maschera) {
        case 'TC':
          this.contextVisibile = true;
          this.agisce(1);
          break;
        case 'SAM':
          this.agisce(2);
          break;
        case 'AGD':
        /*   this.agisce(3);
          break; */
        case 'AGC':
          this.agisce(4);
          break;
        case 'AGPL':
          this.agisce(5);
          break;
        case 'TDL':
          this.agisce(6);
          break;
        case 'QPL':
          this.agisce(7);
          break;
        case 'DTUM':
          this.agisce(8);
          break;
      }

      this.leggeOperatorInfo();
      this.LeggeDatiAddLayers();
      this.LeggeDatiAgnProp();

      this.LeggeMeasuresPR();

      const t = setInterval(() => {
        // logConsole(this.datiAgnProp, this.datiTimeControl);
        if (this.datiAgnProp && this.datiTimeControl) {
          clearInterval(t);

          this.leggeCookies();
        }
      }, 1000)
    }, 500);
  }

  partitaMaschera = false;

  leggeCookies() {    
    const lastDays = localStorage.getItem('Fleet_' + this.userName + '_LastDays');
    let timeControlSelezionato = 30;
    
    if (lastDays === null) {
      timeControlSelezionato = 30;
    } else {
      timeControlSelezionato = +lastDays;
    }
      
    // Last days
    let datiTimeControl = new Array();
    if (timeControlSelezionato !== 0) {
      let ok = true;
      this.datiTimeControl.forEach(element => {
        if (element.ID === timeControlSelezionato) {
          ok = false;
        }
        datiTimeControl.push(element);
      });
      if (ok) {
        const s = { ID: timeControlSelezionato, NAME: timeControlSelezionato.toString() };
        datiTimeControl.push(s);
        // this.datiTimeControl.sort((a, b) => (this.pad(a.NAME, 10)).localeCompare(this.pad(b.NAME, 10)));
        // this.datiTimeControl = JSON.parse(JSON.stringify(this.datiTimeControl));
      }
    }
    this.datiTimeControl = JSON.parse(JSON.stringify(datiTimeControl));

    this.timeControlSelezionato = timeControlSelezionato;
    // Last Days

    // AGN
    const agn = localStorage.getItem('Fleet_' + this.userName + '_AgnCode');
    if (agn === null) {
      this.searchAgnCode2 = '';
      this.searchAgnCode = '';
    } else {
      this.searchAgnCode2 = agn;
      this.searchAgnCode = this.searchAgnCode2;
    }
    // AGN

    // AGN PROP 1
    this.agnProps.forEach(element => {
      const agnProp = localStorage.getItem('Fleet_' + this.userName + '_AgnProp' + +element);
      let agn1 = '';
      
      if (agnProp !== null) {
        agn1 = agnProp;
      }

      this.agnProp[+element] = agn1;
      // AGN PROP 1      
    });

    /* 
    // AGN PROP 2
    const agnProp2 = localStorage.getItem('Fleet_' + this.userName + '_AgnProp2');
    let agn2 = '';
    
    if (agnProp2 !== null) {
      agn2 = agnProp2;
    }

    this.agnProp2 = agn2;
    // AGN PROP 2

    // AGN PROP 3
    const agnProp3 = localStorage.getItem('Fleet_' + this.userName + '_AgnProp3');
    let agn3 = '';
    
    if (agnProp3 !== null) {
      agn3 = agnProp3;
    }

    this.agnProp3 = agn3;
    // AGN PROP 3
    */

    const t = setTimeout(() => {
      clearTimeout(t);

      this.partitaMaschera = true;
    }, 1500);
  }

  LeggeDatiAgnProp() {
    // // // this.Utils.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_category": "agn_prop_name"' +
    '}';
    this.apiService.chiamataPost('geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      this.Utils.scriveLog('Lista lookup agn prop:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiAgnProp = 'empty grid'; // null;
          // alert(data2.v_failure_reason);
          this.mostraPopup('Error: ' + data2.v_failure_reason, false, '');
        } else {
          this.datiAgnProp = data2.DataTable;

          const tm = setTimeout(() => {
            clearTimeout(tm);

            this.agnProps.forEach(quale => {        
              const ee1 = localStorage.getItem('Combo_AgnProp' + quale + '_G');
              // logConsole('Leggo agnprop ', quale, ee1);
              if (ee1 && ee1 !== null) {
                let ok = false;
                this.datiAgnProp.forEach(element => {
                  if (element.VALUE_STR === ee1) {
                    ok = true;
                  }
                });
                if (!ok) {
                  const app = JSON.parse(JSON.stringify(this.datiAgnProp));
                  app.push({ VALUE_STR: ee1 });
                  app.sort((a, b) => (this.pad(a.VALUE_STR, 10)).localeCompare(this.pad(b.VALUE_STR, 10)));
                  this.datiAgnProp = JSON.parse(JSON.stringify(app));

                  const t = setTimeout(() => {
                    clearTimeout(t);

                    this.agnProp[quale] = ee1;
                    this.Utils.scriveLog('Valore combo AgnProp' + quale + '_G:', ee1);
                  }, 100);
                }
              }
            });

            const t = setTimeout(() => {
              clearTimeout(t);

              this.agnProp = JSON.parse(JSON.stringify(this.agnProp));
              // logConsole('Agn prop finali', this.agnProp);
            }, 1000);

            /* const ee2 = localStorage.getItem('Combo_AgnProp2_G');
            if (ee2 && ee2 !== null) {
              let ok = false;
              this.datiAgnProp.forEach(element => {
                if (element.VALUE_STR === ee2) {
                  ok = true;
                }
              });
              if (!ok) {
                const app = JSON.parse(JSON.stringify(this.datiAgnProp));
                app.push({ VALUE_STR: ee2 });
                app.sort((a, b) => (this.pad(a.VALUE_STR, 10)).localeCompare(this.pad(b.VALUE_STR, 10)));
                this.datiAgnProp = JSON.parse(JSON.stringify(app));

                const t = setTimeout(() => {
                  clearTimeout(t);

                  this.agnProp2 = ee2;
                  this.Utils.scriveLog('Valore combo AgnProp2_G:', ee2);
                }, 100);
              }
            }

            const ee3 = localStorage.getItem('Combo_AgnProp3_G');
            if (ee3 && ee3 !== null) {
              let ok = false;
              this.datiAgnProp.forEach(element => {
                if (element.VALUE_STR === ee3) {
                  ok = true;
                }
              });
              if (!ok) {
                const app = JSON.parse(JSON.stringify(this.datiAgnProp));
                app.push({ VALUE_STR: ee3 });
                app.sort((a, b) => (this.pad(a.VALUE_STR, 10)).localeCompare(this.pad(b.VALUE_STR, 10)));
                this.datiAgnProp = JSON.parse(JSON.stringify(app));

                const t = setTimeout(() => {
                  clearTimeout(t);

                  this.agnProp3 = ee3;
                  this.Utils.scriveLog('Valore combo AgnProp3_G:', ee3);
                }, 100);
              }
            } */
          }, 500);

        }
     } else {
        this.datiAgnProp = 'empty grid'; // null;
      }
    }, error => {
      // alert('Read look up:' + error);
      this.mostraPopup('Read look up: ' + error, false, '');
    });
  }

  LeggeDatiAddLayers() {
    // // // this.Utils.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_category": "MapLayer"' +
    '}';
    this.apiService.chiamataPost('geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // // // this.Utils.scriveLog('Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiAddLayers = 'empty grid'; // null;
          // alert(data2.v_failure_reason);
          this.mostraPopup('Error: ' + data2.v_failure_reason, false, '');
        } else {
          // // // this.Utils.scriveLog('Lookup:', data2);
          // const data = data2; // [0].geo_measure_dfn__grid);
          // // // this.Utils.scriveLog('Mesaures:', data);
          const datiAddLayers = data2;

          const a = new Array();
          datiAddLayers.DataTable.forEach(element => {
            if (element.VALUE_STR.indexOf('GLOBAL') === -1) {
              a.push(element);
            }
          });
          this.datiAddLayers = a;
          // logConsole('Dati add layers', a);
        }
     } else {
        this.datiAddLayers = 'empty grid'; // null;
      }
    }, error => {
      // alert('Read look up:' + error);
      this.mostraPopup('Read look up: ' + error, false, '');
    });
  }

  mappaVisibile = 'N';

  LeggeSimbolici() {
    // // this.Utils.scriveLog('Leggo simbolici');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '"' +
    '}';
    this.apiService.chiamataPost('geo_symbolic__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.Utils.visualizzaAlert(data2.v_failure_reason);
        } else {
          // // this.Utils.scriveLog(data2);
          // const data = JSON.parse(data2);
          // // this.Utils.scriveLog(data); //  and name = \'GEO_R_MAP_MAX_MEASR\'

          data2.forEach(element => {
            let name = '';
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

            switch (name) {
              case 'fleet_manager.name':
                this.title = valore;
                // this.nomiMaschere[1] = valore;
                this.impostaTitoloPagina();
                break;
              case 'fleet_manager.test_campaigns.name':
                this.nomiMaschere[1] = valore;
                this.impostaTitoloPagina();
                break;
              case 'GRID_PAGEABLE_ROW_NUM':
                this.righePerPaginareAutomaticamente = valore;
                break;
              }
          });
        }
      } else {
        this.Utils.visualizzaAlert('Read symbolic null');
      }
    }, error => {
      this.Utils.visualizzaAlert('Read symbolic: ' + error);
    });
  }

  agisce(n) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.titleService.setTitle(this.nomiMaschere[n]);
    }, 1000);

    this.qualeGriglia = n;
  }

  apreMenu() {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaClickMenu < 750) {
      return;
    }
    this.ultimaVoltaClickMenu = ora;

    this.menuVisibile = true; // !this.menuVisibile;
    this.dimeDrawer = this.schermoStretto === true ? '100%' : this.dimeDrawerAperto + 'px';
    this.chiudeDrawer2(null);
    // // this.Utils.scriveLog(this.menuVisibile);
  }
  chiudeDrawer(e) {
    if (this.menuVisibile === true && this.nonChiudereDrawer === false) {
      this.menuVisibile = false;
      this.dimeDrawer = this.dimeDrawerInizio + 'px';
    }
    // // this.Utils.scriveLog(this.menuVisibile, this.dimeDrawer);
  }
  over1() {
    // this.Utils.scriveLog('over1');
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
      // // this.Utils.scriveLog('leave 1');
    }
  }

  apreMenu2() {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaClickMenu2 < 750) {
      return;
    }
    this.ultimaVoltaClickMenu2 = ora;

    this.menuVisibile2 = true; // !this.menuVisibile2;
    this.dimeDrawer2 = this.schermoStretto === true ? 'calc(100% - 30px)' : this.dimeDrawerAperto + 'px';
    this.chiudeDrawer(null);
  }
  chiudeDrawer2(e) {
    if (this.menuVisibile2 === true && this.nonChiudereDrawer2 === false) {
      this.menuVisibile2 = false;
      this.dimeDrawer2 = this.dimeDrawerInizio2 + 'px';
    }
  }
  over2() {
    // if (this.menuVisibile2 === true && this.schermoStretto === false) {
      // this.Utils.scriveLog('over2');
      if (this.schermoStretto === true) {
        this.dimeDrawer2 = 'calc(100% - 30px)';
      } else {
        this.dimeDrawer2 = this.dimeDrawerAperto + 'px';
      }
      this.menuVisibile2 = true;
      // // this.Utils.scriveLog('over 2');
    // }
  }
  leave2() {
    if (this.menuVisibile2 === true && this.nonChiudereDrawer2 === false) {
      this.dimeDrawer2 = '0px';
      this.menuVisibile2 = false;
      // // this.Utils.scriveLog('leave 2');
    }
  }

  aperturaContext() {
    // this.vociChiuseMenu = true; // !this.vociAperteMenu;
    this.contextAperto = true;
  }

  impostaNonChiudere(e) {
    this.nonChiudereDrawer = e;
    // // this.Utils.scriveLog(e);
  }

  impostaNonChiudere2(e) {
    this.nonChiudereDrawer2 = e;
    // // this.Utils.scriveLog(e);
  }

  prendePlatFormName(e) {
    // // this.Utils.scriveLog(e);
    this.platformName = e;
  }

  prendeDateNowH(e) {
    this.dateNowH = e;
  }

  prendeSymb_TimeStamp(e) {
    this.symb_TimeStamp = e;
  }

  selectDatiControl(e) {
    if (!this.partitaMaschera) {
      return;
    }
    // logConsole('Last days: ', e);

    if (e) {
      if (!e.ID && e.indexOf('***') > -1) {
        const v = +(e.replace('***', ''));
        if (v !== 0) {
          this.timeControlSelezionato = v;

          let ok = true;
          this.datiTimeControl.forEach(element => {
            if (element.ID === +v) {
              ok = false;
            }
          });
          if (ok) {
            const s = { ID: +v, NAME: v.toString() };
            this.datiTimeControl.push(s);
            this.datiTimeControl.sort((a, b) => (this.pad(a.NAME, 10)).localeCompare(this.pad(b.NAME, 10)));
            this.datiTimeControl = JSON.parse(JSON.stringify(this.datiTimeControl));
          }
        }
      } else {
        this.timeControlSelezionato = e.ID;
      }
    /* }

    if (e) {
      if (!e.ID && e.indexOf('***') > -1) {
        const v = +(e.replace('***', ''));
        if (v !== 0) {
          this.timeControlSelezionato = v;

          const s = { ID: +v, NAME: v.toString() };
          this.datiTimeControl.push(s);
          this.datiTimeControl.sort((a, b) => (this.pad(a.NAME, 10)).localeCompare(this.pad(b.NAME, 10)));
          this.datiTimeControl = JSON.parse(JSON.stringify(this.datiTimeControl));
        }
      } else {
        if (e.ID) {
          this.timeControlSelezionato = e.ID;
        }
      } */
      // // this.Utils.scriveLog(this.timeControlSelezionato);
    }

    if (this.userName) {
      localStorage.setItem('Fleet_' + this.userName + '_LastDays', this.timeControlSelezionato.toString());
    }
  }

  pad(num, size) {
    let s = num + '';
    while (s.length < size) { s = '0' + s; }
    // // this.Utils.scriveLog(s);
    return s;
  }

  premutoVoceMenu(e) {
    // // this.Utils.scriveLog('Premuto voce menu 2');
    // return;
    this.vociChiuseMenu = false;
    this.contextAperto = false;
  }

  selectAdditionalLayer(e) {
    // // this.Utils.scriveLog('Combo cluster selezionato', e);
    this.Utils.scriveLog('Combo Additional Layer selezionato', e);
    if (e && e.VALUE_STR) {
      if ((typeof(e) === 'string' && e.indexOf('***') > -1)) {
        this.additionalLayer = e.replace('***', '');
      } else {
        this.additionalLayer = e;
      }
      this.additionalLayer2 = e.CODE;
      // localStorage.setItem('Combo Additional Layer', e.VALUE_STR);
    } else {
    }

  }

  selectAgnProp(e, quale) {
    if (!this.partitaMaschera) {
      return;
    }

    this.Utils.scriveLog('Combo AGN Prop ' + quale + ' selezionato', e);
    // logConsole('AGN Prop ' + quale + ' selezionato', e, this.partitaMaschera);

    if (e) {
      if (typeof(e) === 'object' && e.VALUE_STR) {
        this.agnProp[quale] = e.VALUE_STR;
        localStorage.setItem('Combo_AgnProp' + quale + '_G', e['VALUE_STR']);
      } else {
        if (typeof(e) === 'string' && e.indexOf('***') > -1) {
          // this.Utils.scriveLog(e);
          const ee = e.replace('***', '');
          let ok = false;
          this.datiAgnProp.forEach(element => {
            if (element.VALUE_STR === ee) {
              ok = true;
            }
          });
          if (!ok) {
            const app = JSON.parse(JSON.stringify(this.datiAgnProp));
            app.push({ VALUE_STR: ee });
            app.sort((a, b) => (this.pad(a.VALUE_STR, 10)).localeCompare(this.pad(b.VALUE_STR, 10)));
            this.datiAgnProp = JSON.parse(JSON.stringify(app));
            const tt = setTimeout(() => {
              this.agnProp[quale] = ee;
    
              localStorage.setItem('Combo_AgnProp' + quale + '_G', this.agnProp[quale]);
            }, 100);
          }
        } else {
          this.Utils.scriveLog('ERRORE Nella selezione: ', e);
        }
      }
    } else {
      this.agnProp[quale] = '';
      localStorage.setItem('Combo_AgnProp' + quale + '_G', '');
    }

    if (this.userName) {
      localStorage.setItem('Fleet_' + this.userName + '_AgnProp' + quale, this.agnProp[quale]);
    }

    this.agnProp = JSON.parse(JSON.stringify(this.agnProp));

    this.Utils.scriveLog('Combo AgnProp' + quale + '_G selezionato', this.agnProp[quale]);
  }

  /* ritornaValoreDaComboAgnProp(e) {
    this.Utils.scriveLog(e);
    return;
    const ee = localStorage.getItem('Combo_AgnProp1_G');
    this.Utils.scriveLog('Valore combo AgnProp1_G:', ee);
    if (ee && ee !== null) {
      this.agnProp1 = JSON.parse(ee);
    }

    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        if (e === undefined) {
          this.additionalLayer = '';
        } else {
          let dati = this.datiAgnProp;
          if (dati.DataTable) {
            dati = dati.DataTable;
          }

          // // this.Utils.scriveLog(this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');

          dati.forEach(element => {
            if (element.CODE === e) {
              // // this.Utils.scriveLog('Trovato:', element);
              this.agnProp1 = element;
            }
          });
          // this.Utils.scriveLog('Valore combo AL:', this.additionalLayer);
        }
      }, 2000);
    // }
    }
  } */

  ritornoValoreDaComboAL(e) {
    // this.Utils.scriveLog('Valore combo AL:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        if (e === undefined) {
          this.additionalLayer = '';
        } else {
          let dati = this.datiAddLayers;
          if (dati.DataTable) {
            dati = dati.DataTable;
          }

          // // this.Utils.scriveLog(this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');

          dati.forEach(element => {
            if (element.CODE === e) {
              // // this.Utils.scriveLog('Trovato:', element);
              this.additionalLayer = element;
            }
          });
          // this.Utils.scriveLog('Valore combo AL:', this.additionalLayer);
        }
      }, 2000);
    // }
    }
  }

  comandoVocaleEmit(e) {
    this.comandoVocale = e;
    this.comandiVocali.esegueComandoVocale(this, e);
  }

  @HostListener('window:resize')
  public detectResize(): void {
    const x = this.divCont.nativeElement.offsetWidth;
    const y = this.divCont.nativeElement.offsetHeigth;
    // // this.Utils.scriveLog(this.divCont.nativeElement.offsetWidth);
    // // this.Utils.scriveLog(this.divCont.nativeElement.offsetHeight);
    if (x <= 650) {
      this.schermoStretto = true;
    } else {
      this.schermoStretto = false;
    }
  }

  ngAfterViewInit() {
    this.detectResize();
  }

  mostraPopup(Messaggio, Dialog, Cosa) {
    this.Utils.visualizzaAlert(Messaggio);
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
      this.Utils.scriveLog('The dialog was closed', result);
      // this.animal = result;
    });
  }

  lettiWS(e) {
    this.Utils.scriveLog('WS', e);

    /* const l = new Array();
    e.forEach(element => {
      if (element.FOLDER === 'Template')  {
        element.DASHBOARD.forEach(element2 => {
          l.push(element2);
        });
      }
    }); */
    this.listaWS = e;
    this.Utils.scriveLog('Lista WS: ', e);
  }

  pressioneEnter(e) {
    if (!this.partitaMaschera) {
      return;
    }

    if (e === 'AUTO' || e.key === 'Enter') {
      this.Utils.scriveLog(e, this.searchAgnCode2);
      this.searchAgnCode = this.searchAgnCode2;

      if (this.userName) {
        localStorage.setItem('Fleet_' + this.userName + '_AgnCode', this.searchAgnCode2.toString());
      }
    }
  }

  checkModalitaDebug(e) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      localStorage.setItem('ModalitaDebug', this.Utils.modalitaDebug === true ? 'S' : 'N');
    }, 100);
  }

  caricaPointMeasures() {
    // // logConsole(this.Utils);
    this.staElaborandoPM = true;

    const params = {
      cntx_id: this.sessionID,
      v_filter_folder: 'TcRunEvent'
    };

    this.apiService.chiamataPost('geo_measure_dfn__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      if (data2) {
        Utils.checkRitornoChiamata(this, data2);

        this.staElaborandoPM = false;
        if (data2 && data2 !== null) {
          this.titoloPointMeasures = data2.GridProperty[0].GridName;
          this.titoloPointMeasures = this.titoloPointMeasures;

            this.datiPointMeasures = undefined;
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.datiPointMeasures = data2;
              this.datiPointMeasures = data2;            
              this.effettuaAutoFitPM = !this.effettuaAutoFitPM;

              const tm1 = setTimeout(() => {
                clearTimeout(tm1);
                const m = localStorage.getItem(this.userName + '_tcRunAdditionalMeasure');
                if (m !== null) {
                  this.misureAddizionaliTCRUN = JSON.parse(m);
                } else {
                  this.misureAddizionaliTCRUN = ['', '', '', '', ''];
                }
                // alert (m);          
              }, 1000);        
            }, 100);
        } else {
          this.datiPointMeasures = 'empty grid'; // null;
        }
      }
    }, error => {
        this.staElaborandoPM = false;
        // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
        this.datiPointMeasures = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  LeggeMeasuresPR() {
    // // // logConsole('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost('geo_measure_dfn__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      Utils.checkRitornoChiamata(this, data2);

      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.measureData = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // // logConsole('Mesaures:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // // logConsole('Mesaures:', data);
          this.measureData = data.DataTable;

          this.caricaPointMeasures();
        }
      } else {
        this.measureData = 'empty grid'; // null;
      }
    }, error => {
      alert('Read Measures:' + error);
    });
  }

  clickSuComboMisura(e) {
    if (this.Utils.modalitaDebug === true) {
      // logConsole('Click su combo misura tcrun', e);
    }
    // { Selezionato: this.numeroSelezionato[riga], Precedente: valorePrecedente, Misura: misura }
    let misure = this.misureAddizionaliTCRUN;
    if (!misure) {
      misure = ['', '', '', '', '', ''];
    }
    if (e.Selezionato > 0) {
      let misura = '';
      this.measureData.forEach(element => {
        if (misura === '' && element.DISPLAY_NAME === e.Misura) {
          misura = element.CODE;
        }
      });
      misure[e.Selezionato] = misura;
    } else {
      misure[e.Precedente] = '';
    }

    this.misureAddizionaliTCRUN = JSON.parse(JSON.stringify(misure));
    localStorage.setItem(this.userName + '_tcRunAdditionalMeasure', JSON.stringify(this.misureAddizionaliTCRUN));

    if (this.Utils.modalitaDebug === true) {
      // logConsole('Misure tcrun impostate', this.misureAddizionaliTCRUN);
    }
  }

  refreshGrigliaPM(r) {
    if (r === true) {
      this.datiPointMeasures = undefined;
    }
    this.caricaPointMeasures();
  }
  
  userManualPrint = false;

  fDownloadUserManual(e) {
    this.userManualPrint = true;
    const params = {
      cntx_id: this.sessionID,
      v_name: 'User Manual ITA.pdf'
    }
    this.apiService.chiamataPost('report__download', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      let mimeType = 'application/octet-stream';
      const byteBuf = this.u_atob(data2); // atob(data);

      const data3 = new Blob([byteBuf], {type: mimeType});
      
      // this.fileSaver.save(data3, 'User Manual ITA.pdf');    
      download(data3, 'User Manual ITA.pdf', mimeType);

      this.userManualPrint = false;
    });  

  }

  u_atob(ascii) {
    return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
  }

  ritornoDimensioniColonnePM(e) {
    Utils.scriveDimensioniColonne('PM', e);
  }


  // ANTENNE
  datiGrigliaAntenne;
  rigaSelezionataAntenne;
  caricamentoDatiInCorsoAntenne = false;
  selezioneAntenne;

  caricaTabellaAntenne() {
    const nomeTabella = 'geo_lookup__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_category: 'antenna_set_name'
    };

    this.rigaSelezionataAntenne = null;

    this.caricamentoDatiInCorsoAntenne = true;
    // this.datiGrigliaAntenne = 'empty grid'; // null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data = JSON.parse(data2);
      this.caricamentoDatiInCorsoAntenne = false;
      if (data2 && data2 !== null) {
        Utils.checkRitornoChiamata(this, data2);
        // // this.Utils.scriveLog(data);
        /* if (this.datiGrigliaAntenne && this.datiGrigliaAntenne !== 'empty grid' && data2.DataTable) {
          if (data2.DataTable.length > 0) {
            this.datiGrigliaAntenne.DataTable = JSON.parse(JSON.stringify(data2.DataTable));
          } else {
            this.datiGrigliaAntenne = 'empty grid';
          }
        } else { */
          // this.datiGrigliaAntenne = 'empty grid'; // null;
          this.datiGrigliaAntenne = data2;
        /*   const tm = setTimeout(() => {
            this.effettuaAutoFitAntenne = !this.effettuaAutoFitAntenne;
            // const tm = setTimeout(() => {
            // }, 200);
          }, 100);
        } */

        const tm = setTimeout(() => {
          clearTimeout(tm);
          /* const r = localStorage.getItem(this.sUserName + '_last_antenne_dd');
          // logConsole('Riga antenne selezionate', JSON.parse(r), data2);
          if (r && r !== null) {
            this.rigaSelezionataAntenne = JSON.parse(r);
            this.selezioneAntenne = [+JSON.parse(r).ROW_ID];
            // alert('1: ' + JSON.parse(r).ROW_ID);
          } else { */
            if (this.datiGrigliaAntenne && this.datiGrigliaAntenne.DataTable && this.datiGrigliaAntenne.DataTable.length > 0) {
              /* const tt = setTimeout(() => {
                clearTimeout(tt);

                this.rigaSelezionataAntenne = this.datiGrigliaAntenne.DataTable[0];
              }, 1000); */
              
              // this.selezioneAntenne = [+this.datiGrigliaAntenne.DataTable[0].ROW_ID];
              // alert('2: ' + this.datiGrigliaAntenne.DataTable[0].ROW_ID);
              
              this.nonAggiornareSelezioneAntenne = true;
              const tm = setTimeout(() => {
                clearTimeout(tm);

                const selA = localStorage.getItem(this.userName + '_SelAntenne_Fleet');
                if (selA != null) {
                  const selezioneAntenne = new Array();
                  selezioneAntenne.push(selA);
                  this.datiGrigliaAntenne.DataTable.forEach(element => {
                    if (+element.ROW_ID === +selA) {
                      this.selezioneAntenne = selezioneAntenne;
                      this.rigaSelezionataAntenne = element;
                      logConsole('Antenna riselezionata: ', element);
                      this.nomeSetAntenne = element.VALUE_STR;
                    }
                  });
                  // alert('Letto: ' + this.selezioneAntenne);
                } else {
                  this.selezioneAntenne = [-1];
                  this.rigaSelezionataAntenne = '';
                }
                this.nonAggiornareSelezioneAntenne = false;
              }, 1000);
            }
          // }            
        }, 100);
      } else {
        this.datiGrigliaAntenne = 'empty grid'; // null;
      }
    }, error => {
      this.caricamentoDatiInCorsoAntenne = false;
      this.datiGrigliaAntenne = 'empty grid'; // null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  nonAggiornareSelezioneAntenne = false;

  clickSelezioneAntenne(e) {
    if (this.nonAggiornareSelezioneAntenne) {
      return;
    }

    // // this.Utils.scriveLog(e);
    // logConsole('Click selezione antenne', e);
    this.rigaSelezionataAntenne = e[0];
    this.selezioneAntenne = e[0].ROW_ID;

    this.nomeSetAntenne = e[0].VALUE_STR;
    // localStorage.setItem(this.sUserName + '_last_antenne_dd', JSON.stringify(e[0]));
    localStorage.setItem(this.userName + '_SelAntenne_Fleet', this.selezioneAntenne);
    // this.caricaTabella2Inizio(e[0]);
  }

  lastSelectedOfGridAntenne(e) {

  }

  uploadFile = false;

  apreUpload() {
    this.uploadFile = true;
  }
  
  chiudeUpload(e) {
    this.uploadFile = false;
  }

  ritornoDimensioniColonneAntenne1(e) {
    Utils.scriveDimensioniColonne('Antenne1', e);
  }

  refreshGrid1Antenne(e, r) {
    if (r === true) {
      this.datiGrigliaAntenne = undefined;
    }
    this.caricaTabellaAntenne();
  }

  trackByNomi(index: number, item: any) {
    return index; // this.nomiFrames2[index];
  }

  impostaTitoloPagina() {
    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.titleService.setTitle(this.title);

      // this.nomeSetAntenne = 'TIM';
    }, 1000);
  }
}

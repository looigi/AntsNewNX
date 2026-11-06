import { logConsole } from './console-log';
import { environment } from './../environments/environment';
import { ApiService } from './db/api.service';
import { SessionService } from './db/session.service';
import { ExternalHttpClient } from './db/httpclient.service';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Utils from './Utilities.component';
// import 'rxjs/add/operator/map';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { ConfermaComponent } from './conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
// import { FileSaverService } from 'ngx-filesaver';
import download from 'downloadjs';  // Importa downloadjs
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('divContenitore', {static: true}) divCont: any;

  destroy$ = new Subject<void>();

  public Utils = Utils;
  opacitaCAM = .1;

  indirizzoServer;
  schermoStretto = false;
  ultimaVoltaClickMenu = -1;
  ultimaVoltaClickMenu2 = -1;
  menuVisibile = false;
  menuVisibile2 = false;
  comboVisibile = true;
  platformName = '';
  mascheraScelta = 'CellList';
  dateNowH = '';
  symb_TimeStamp = '';
  sessionID;
  maschera;
  nomiMaschere = [ '', 'Sites And Coverage', 'Cluster', 'PLMN' ];
  fullScreen = '';
  modalitaDebug = !environment.production;
  contextVisibile = false;
  datiBandWidth;
  datiTerritory;
  datiNetTech;
  dimeDrawerAperto = 500;
  microfonoAttivo = false;
  exportKML;
  setNetTech = true;
  syncGridToMap = true;
  syncGridToMap2 = true;
  menu1 = false;
  menu2 = false;
  menu3 = false;

  title = 'DataDictionaries';
  sessId;
  gname;
  uname;
  collegatoDaUrl = false;
  groupName;
  userName = 'Luigi.Pecce';
  qualeGriglia = 0;
  caricamentoDatiInCorso = false;
  caricamentoDatiInCorso2 = false;
  datiGriglia;
  nomeGriglia;
  selezione = [ '-1', '-1', '-1', '-1', '-1'];
  effettuaAutoFit = false;
  oldGriglia = -1;
  dimeFinestraGriglia1 = 100;
  dimeFinestraGriglia2 = 0;
  dimeFinestraGrigliaHor1 = 100;
  dimeFinestraGrigliaHor2 = 0;
  datiGriglia2;
  nomeGriglia2 = '';
  selezione2 = '-1';
  effettuaAutoFit2 = false;
  nonAggiornare = false;
  nuovoUtente = true;
  additionalLayer;
  additionalLayer2;
  righePerPaginareAutomaticamente = -1;

  pulisceFiltroSG;
  sUserName;
  sMail;
  sDescription;
  sPassword;
  sMobile;
  sLock: boolean;
  iId: number;
  operatorProfileId: number;
  repositoryClientPath;
  groupId: number;

  sUserNameOrig;
  sMailOrig;
  sDescriptionOrig;
  sPasswordOrig;
  sMobileOrig;
  sGroupId;
  sOperatorProfileId;

  datiGroup;
  datiProfile;

  datiGrigliaAntenne;
  rigaSelezionataAntenne;
  selezioneAntenne;
  // nomeLayerAntenne;
  effettuaAutoFitAntenne = false;
  caricamentoDatiInCorsoAntenne = false;

  datiGrigliaCluster;
  rigaSelezionataCluster;
  selezioneCluster;
  // nomeLayerCluster;
  effettuaAutoFitCluster = false;
  caricamentoDatiInCorsoCluster = false;

  dimeDrawer = '0px';
  dimeDrawerInizio = 0;
  nonChiudereDrawer = false;
  dimeDrawer2 = '0px';
  dimeDrawerInizio2 = 0;
  nonChiudereDrawer2 = false;
  vociChiuseMenu = false;
  contextAperto = false;
  mascheraAntenne = false;
  mascheraCluster = false;

  datiAddLayers;

  netTech = '';
  freeText = '';
  bandwidth = '';
  dateFrom = new Date(new Date().getTime() - (60 * 60 * 24 * 1000));
  dateTo = new Date();
  viewMode = '';

  // netTech2 = 0;
  netTech2P = '<ALL>';
  freeText2 = '';
  bandwidth2 = '<ALL>';
  // bandwidth2P = '<ALL>';
  dateFrom2 = new Date(new Date().getTime() - (60 * 60 * 24 * 1000));
  dateTo2 = new Date();
  // viewMode2 = '';
  codeLike = null;
  ch = null;
  bsic = null;
  scr = null;
  pci = null;
  territory = null;
  codeLike2 = null;
  ch2  = null;
  bsic2 = null;
  scr2 = null;
  pci2 = null;
  territory2 = null;

  datiViewModeA = [
    { VALUE_STR: 'net_tech_trend' },
    { VALUE_STR: 'statistics' },
    { VALUE_STR: 'net_tech_and_band_trend' },
    { VALUE_STR: 'statistics variation' },
    { VALUE_STR: 'coverage_files' },
    { VALUE_STR: 'cell_files' },
  ]
  viewModeP2 = 'net_tech_trend';

  statoServer = '';
  statoManutenzione = '';
  coloreStatoServer = 'white';
  comandoVocale = '';

  datiSlaDT;
  datiSlaDTi;
  datiSLA;
  slaValueGlobale;

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
    const md = localStorage.getItem('ModalitaDebug');
    if (md !== null) {
      this.Utils.modalitaDebug = (md === 'S' ? true : false);
    } else {
      this.Utils.modalitaDebug = false;
    }

    this.agisce(0);

    /* this.getJSON().subscribe(data => {
      // Utils.indirizzoServer = JSON.parse(data._body).indirizzoServer;
      // Utils.linkIcone =  JSON.parse(data._body).linkIcone;
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
      if (b.righePerEventi)  {
        Utils.limitPerVirtual = JSON.parse(b._body).righePerEventi;
      } else {
        Utils.limitPerVirtual = 60;
      }
      Utils.serverGEOServer = b.serverGEOServer;
      Utils.indirizzoGEOServer = JSON.parse(data._body).serverGEOServer;
      Utils.urlRoot = b.urlRoot;
      // this.apiService.setUrl(Utils.facadeServerAddress);
      // // this.Utils.scriveLog(Utils.linkIcone);

      this.eseguiConnessione();
    }); */
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

  lettoJSON(data) {
    /* let b = data;
    Utils.linkIcone = b.linkIcone;
    Utils.serverPostRest = b.serverPostRest; // 'https://geoants-007.ants-aubay.it'; // 
    /* if (b.Proxy.toUpperCase() === 'TRUE') {
      Utils.facadeServerAddress = b.facadeServerAddressViaProxy;
    } else {
      Utils.facadeServerAddress = b.facadeServerAddressLocale;
    } * /
    if (b.righePerEventi)  {
      Utils.limitPerVirtual = b.righePerEventi;
    } else {
      Utils.limitPerVirtual = 60;
    }
    Utils.serverGEOServer = b.serverGEOServer; // 'https://geoants-007.ants-aubay.it/geoserver/'; // 
    Utils.indirizzoGEOServer = b.serverGEOServer; // 'https://geoants-007.ants-aubay.it/geoserver/'; // 
    Utils.urlRoot = b.urlRoot; // 'https://geoants-007.ants-aubay.it/geoantsweb/'; // 
    // this.apiService.setUrl(Utils.facadeServerAddress);
    // // this.Utils.scriveLog(Utils.linkIcone);
    this.indirizzoServer = b.serverPostRest; // 'https://geoants-007.ants-aubay.it'; // 
    */
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
    Utils.linkIcone  = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
    // this.linkIcone = this.aggiungeIndirizzoAPathRelativo(indirizzoCaricato, b.linkIcone, true);
    let urlRootSenzaBarraFinale = urlRoot;
    if (urlRootSenzaBarraFinale.endsWith('/') && b.serverPostRest.startsWith(':')) {
      urlRootSenzaBarraFinale = urlRootSenzaBarraFinale.substring(0, urlRootSenzaBarraFinale.length - 1);
    }
    Utils.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRootSenzaBarraFinale, b.serverPostRest, true);
    Utils.serverGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.serverGEOServer, true);
    Utils.indirizzoGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.serverGEOServer, true);
    if (b.eventsDisplayedRows)  {
      Utils.limitPerVirtual = b.eventsDisplayedRows;
    } else {
      Utils.limitPerVirtual = 60;
    }
    this.indirizzoServer = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.serverPostRest, true);
    logConsole('Indirizzo urlRoot: ', Utils.urlRoot);
    logConsole('Indirizzo Icone: ', Utils.linkIcone);
    logConsole('Indirizzo PostGrest: ', Utils.serverPostRest);
    logConsole('Indirizzo GeoServer: ', Utils.serverGEOServer);
    // Nuova gestione della mail del 28/04/2026 13:16

    this.eseguiConnessione();
  }

  ngOnInit() {
    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.titleService.setTitle(this.title);
    }, 1000);

    const r = localStorage.getItem('radiobutton_DD');
    if (r !== null) {
      this.mascheraScelta = r;
    }

    const ch = localStorage.getItem(this.userName + '_DD_CH');
    if (ch !== null) {
      this.ch2 = ch;
    }

    const bsic = localStorage.getItem(this.userName + '_DD_BSIC');
    if (bsic !== null) {
      this.bsic2 = bsic;
    }

    const scr = localStorage.getItem(this.userName + '_DD_SCR');
    if (scr !== null) {
      this.scr2 = scr;
    }

    const pci = localStorage.getItem(this.userName + '_DD_PCI');
    if (pci !== null) {
      this.pci2 = pci;
    }

    const free = localStorage.getItem(this.userName + '_DD_FREE');
    if (free !== null) {
      this.freeText2 = free;
    }

    const cl = localStorage.getItem(this.userName + '_DD_CL');
    if (cl !== null) {
      this.codeLike2 = cl;
    }
  }

  /* public getJSON(): Observable<any> {
    // // this.Utils.scriveLog(window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }
    // // this.Utils.scriveLog(indirizzo);
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
            const dd = { username: this.uname };
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
    // this.EffettuaLogin(null, null, null, environment.nomeLogin, environment.pwdLogin);
    let pwd = '';
    const p = localStorage.getItem('H7-25-DD');
    if (p !== null) {
      pwd = p;
    } else {
      pwd = prompt("H7-25-DD", "");
      if (pwd === '') {
        Utils.visualizzaAlert('No!');
        return;
      }  else  {
        localStorage.setItem('H7-25-DD', pwd);
      }
    }

    this.EffettuaLogin(null, null, null, environment.nomeLogin, pwd);
  }

  pulisciPassword() {
    localStorage.removeItem('H7-25-DD');
    Utils.visualizzaAlert('OK');
  }

  login(username, password, rememberme) {
    if (environment.production === true) {
      // alert('Error: no sessionID found');
      this.mostraPopup('Error: no sessionID found', false, '');
      return;
    }
    
    this.sUserName = username;
    // alert('User name: ' + this.sUserName);

    const params = {
      v_name: username, //'Federico.Travaglini.tim',
      v_password: password, // 'cerioni',
      v_client_public_ip: '',
      v_city: '',
      v_client_country: '',
      v_org: ''
    };
    // this.Utils.scriveLog('operator__login', params);
    this.apiService.chiamataPost('operator__login', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      this.Utils.scriveLog(data2);
      // const data = JSON.parse(data2);
      // this.Utils.scriveLog(data);
      if (data2.err_code !== 0) {
        const rr = data2.failure_reason;
      } else {
        this.loginOK(environment.nomeLogin ,data2.cntx_id, '');
      }
    }, error => {
      // alert(error);
    });
  }

  EffettuaLogin(dd, sessionId, groupName, userName, password) {
    // // this.Utils.scriveLog('Effettua login:', userName, password);

    /* if (sessionId && sessionId !== '') {
      // // this.Utils.scriveLog('Login con credenziali automatiche');
      this.groupName = groupName;
      this.loginOK(dd, sessionId, groupName);
    } else { */
      // // this.Utils.scriveLog('Login con credenziali interne');
    if (sessionId && sessionId !== '') {
      this.userName = userName;
      this.loginOK(dd, sessionId, '');
    } else {
      let pwd = '';
      const p = localStorage.getItem('H7-25-DD');
      if (p !== null) {
        pwd = p;
      } else {
        pwd = prompt("H7-25-DD", "");
        if (pwd === '') {
          Utils.visualizzaAlert('No!');
          return;
        }  else  {
          localStorage.setItem('H7-25-DD', pwd);
        }
      }

      this.login(environment.nomeLogin, pwd, '');
    }
  }

  LeggeSLADataPR() {
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost('geo_sla__grid', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // // this.Utils.scriveLog('Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        Utils.checkRitornoChiamata(this, data2);

        // // this.Utils.scriveLog('SLA:', data2);
        const data = data2;
        // // this.Utils.scriveLog(this.datiSLA);
        this.datiSLA = data;
        this.datiSlaDT = data.DataTable;
        this.datiSlaDTi = JSON.parse(JSON.stringify(data.DataTable));
        // this.Utils.scriveLog('Sla data:', this.datiSlaDTi, this.slaValueGlobale);

        // this.pulisceFiltroSLA = !this.pulisceFiltroSLA;
        if (this.slaValueGlobale === undefined) {
          this.slaValueGlobale = 0;
        }
      } else {
        // this.datiSLA = null;
        // this.datiSlaDT = 'empty grid';
        // this.pulisceFiltroSLA = !this.pulisceFiltroSLA;
      }
    }, error => {
      Utils.messaggioDiErrore('null', error);
    });
  }

  refreshSLA(e) {
    // // this.Utils.scriveLog('Arrivato refresh sla');
    this.datiSlaDTi = 'empty grid'; // null;

    this.LeggeSLADataPR();
  }

  selectSla(e) {
    // // this.Utils.scriveLog('Sla impostato:', e);
    this.slaValueGlobale = e.ID;

    this.permetteLaRichiusuraDelDrawer();
  }

  ritornoValoreDaComboSLA(e) {
    // // this.Utils.scriveLog('Valore combo sla:', e);
    if (e && e !== 'empty' && e !== null) {
      const ee = Utils.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        if (e === undefined) {
          this.slaValueGlobale = 0;
        } else {
          this.slaValueGlobale = e.ID;
        }
      }, 100);
    // }
    }
  }

  leggeOperatorInfo() {
      const params = {
        cntx_id: this.sessionID
      }
      this.apiService.chiamataPost('operator_info_my__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // const data = JSON.parse(data2);
        if (data) {
            Utils.checkRitornoChiamata(this, data);
            // // this.Utils.scriveLog('Ritorno login: ', data);

            // const dd2 = data.OBJECT[0].object;
            // const rr = data.err_code;

            data.DataTable.forEach(element => {
              switch(element.NAME) {
                case 'geo_dashboard__frame_editor':
                  Utils.permessoFrameEditor = element.VALUE === 'Y' ? 'false' : 'true';
                  break;
                case 'antsgeo_act_path_cell3d_kml':
                  // // this.Utils.scriveLog('Trovato', element);
                  this.exportKML = element.VALUE === 'Y' ? true : false;
                  break;
                case 'string_to_command':
                  this.microfonoAttivo = (element.VALUE === 'Y' ? true : false);
                  // // this.Utils.scriveLog('Microfono attivo:', element, this.microfonoAttivo);
                  break;
                case 'login_page_url':
                  Utils.userRedirect = element.VALUE;
                  // alert(element.VALUE);
                  break;
                case 'operator_group_name':
                  this.groupName = element.VALUE;
                  break;
              }
            });

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

  puoCaricareAntenne = false;

  loginOK(dd, sessionId, groupName) {
    // // this.Utils.scriveLog('Login Ok:', dd);

    this.sessionService.setRemember(true);
    this.sessionService.setUser(dd);
    this.sessionService.setToken(sessionId);
    this.sessionService.setLogged(true);
    // this.groupName = dd.groupname;
    this.sessionID = sessionId;

    // // this.Utils.scriveLog('Leggo simbolici', this.sessionID, this.groupName);

    if (this.userName === '') {
      this.userName = 'DebugUser';
    }
    localStorage.setItem(this.userName + '_last_page', 'Data Dictionaries');
    localStorage.setItem(this.userName + '_last_form', this.maschera);
    localStorage.setItem(this.userName + '_last_full_screen', this.fullScreen);

    this.mascheraAntenne = false;
    this.mascheraCluster = false;

    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.contextVisibile = false;
      switch (this.maschera) {
        case 'Antenna':
          this.contextVisibile = true;
          this.mascheraAntenne = true;
          this.caricaTabellaAntenne();
          this.agisce(1);
          this.refreshGrid2(0);
          break;
        case 'Cluster':
          this.contextVisibile = true;
          this.mascheraCluster = true;
          this.caricaTabellaAntenne();
          this.caricaTabellaCluster();
          this.agisce(2);
          break;
        case 'PLMN':
          this.agisce(3);
          break;
      }

      this.LeggeSimbolici();
      this.leggeOperatorInfo();
      this.LeggeDatiAddLayers();
      this.LeggeDatiNetTech();
      this.LeggeDatiBandWidth();
      this.LeggeTerritory();
      this.LeggeSLADataPR();

      const tt = setTimeout(() => {
        clearTimeout(tt);
        
        this.puoCaricareAntenne = true;
      }, 1000);
    }, 500);
  }

  LeggeDatiNetTech() {
    // // // this.Utils.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_category": "combo_NetTech"' +
    '}';
    this.apiService.chiamataPost('geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // // // this.Utils.scriveLog('Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiNetTech = 'empty grid'; // null;
          // alert(data2.v_failure_reason);
          this.mostraPopup('Error: ' + data2.v_failure_reason, false, '');
        } else {
          // // this.Utils.scriveLog('Lookup NetTech:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // // this.Utils.scriveLog('Mesaures:', data);
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
    // // // this.Utils.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_category": "Filter_Band"' +
    '}';
    this.apiService.chiamataPost('geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // // // this.Utils.scriveLog('Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiBandWidth = 'empty grid'; // null
          // alert(data2.v_failure_reason);
          this.mostraPopup('Error: ' + data2.v_failure_reason, false, '');
        } else {
          // // this.Utils.scriveLog('Lookup Bandwidth:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // // this.Utils.scriveLog('Mesaures:', data);
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

  LeggeTerritory() {
    // // // this.Utils.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_category": "Territory"' +
    '}';
    this.apiService.chiamataPost('geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // // // this.Utils.scriveLog('Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiTerritory = 'empty grid'; // null;
          // alert(data2.v_failure_reason);
          this.mostraPopup('Error: ' + data2.v_failure_reason, false, '');
        } else {
          // // this.Utils.scriveLog('Lookup Bandwidth:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // // this.Utils.scriveLog('Mesaures:', data);
          this.datiTerritory = data.DataTable;
        }
     } else {
        this.datiTerritory = 'empty grid'; // null;
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
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // // // this.Utils.scriveLog('Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiAddLayers = 'empty grid'; // null;
          // alert(data2.v_failure_reason);
          this.mostraPopup('Error: ' + data2.v_failure_reason, false, '');
        } else {
          // // this.Utils.scriveLog('Lettura Add Layers:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.Utils.scriveLog('Mesaures:', data);
          const datiAddLayers = data;

          const a = new Array();
          datiAddLayers.DataTable.forEach(element => {
            if (element.VALUE_STR.indexOf('GLOBAL') === -1) {
              a.push(element);
            }
          });
          this.datiAddLayers = a;

        }
     } else {
        this.datiAddLayers = 'empty grid'; // null;
      }
    }, error => {
      // alert('Read look up:' + error);
    });
  }

  LeggeSimbolici() {
    // // this.Utils.scriveLog('Leggo simbolici');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '"' +
    '}';
    this.apiService.chiamataPost('geo_symbolic__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // this.Utils.scriveLog('GEO SYMBOLIC SEL:', data2);
      // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        // if (data2.v_err_code && data2.v_err_code === 2) {
        //   alert(data2.v_failure_reason);
        // } else {
          this.Utils.scriveLog(data2);
          // // const data = JSON.parse(data2);
          // // this.Utils.scriveLog(data); //  and name = \'GEO_R_MAP_MAX_MEASR\'

          data2.forEach(element => {
            let name;
            if (element.NAME) {
              name = element.NAME;
            } else {
              name = element.name;
            }

            switch (name) {
              case 'GRID_PAGEABLE_ROW_NUM':
                this.righePerPaginareAutomaticamente = element.VALUE ? element.VALUE : element.value;
                this.Utils.scriveLog('Righe paginazione automatica', element.VALUE ? element.VALUE : element.value);
                break;
              }
          });
        // }
      } else {
        Utils.visualizzaAlert('Read symbolic null');
      }
    }, error => {
      Utils.visualizzaAlert('Read symbolic: ' + error);
    });
  }

  agisce(n) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.titleService.setTitle(this.nomiMaschere[n]);
    }, 1000);

    // this.nomeMaschera = this.nomiMaschere[n];
    this.qualeGriglia = n;
  }

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
    // // this.Utils.scriveLog('over1');
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
    this.dimeDrawer2 = this.schermoStretto === true ? '100%' : this.dimeDrawerAperto + 'px';
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
      // // this.Utils.scriveLog('over2');
      if (this.schermoStretto === true) {
        this.dimeDrawer2 = '100%';
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

  premutoVoceMenu(e) {
    // // this.Utils.scriveLog('Premuto voce menu 2');
    // return;
    this.vociChiuseMenu = false;
    this.contextAperto = false;
  }

  // ANTENNE
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
    .subscribe(data2 => {
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

                const selA = localStorage.getItem(this.sUserName + '_SelAntenne_DD');
                if (selA != null) {
                  const selezioneAntenne = new Array();
                  selezioneAntenne.push(selA);
                  this.datiGrigliaAntenne.DataTable.forEach(element => {
                    if (+element.ROW_ID === +selA) {
                      this.selezioneAntenne = selezioneAntenne;
                      this.rigaSelezionataAntenne = element;
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
    // localStorage.setItem(this.sUserName + '_last_antenne_dd', JSON.stringify(e[0]));
    localStorage.setItem(this.sUserName + '_SelAntenne_DD', this.selezioneAntenne);
    // this.caricaTabella2Inizio(e[0]);
  }

  lastSelectedOfGridAntenne(e) {

  }

  refreshGrid1Antenne(e, r) {
    if (r === true) {
      this.datiGrigliaAntenne = undefined;
    }
    this.caricaTabellaAntenne();
  }

  // CLUSTER
  caricaTabellaCluster() {
    const nomeTabella = 'geo_lookup__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_category: 'Cluster'
    };

    this.rigaSelezionataCluster = null;

    this.caricamentoDatiInCorsoCluster = true;
    // this.datiGrigliaCluster = 'empty grid'; // null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data = JSON.parse(data2);
      this.caricamentoDatiInCorsoCluster = false;
      if (data2 && data2 !== null) {
        Utils.checkRitornoChiamata(this, data2);
        // // this.Utils.scriveLog(data);
        if (this.datiGrigliaCluster && this.datiGrigliaCluster !== 'empty grid' && data2.DataTable) {
          if (data2.DataTable.length > 0) {
            this.datiGrigliaCluster.DataTable = data2.DataTable;
          } else {
            this.datiGrigliaCluster = 'empty grid';
          }
        } else {
          // this.datiGrigliaCluster = 'empty grid'; // null;
          this.datiGrigliaCluster = JSON.parse(JSON.stringify(data2));
          const tm = setTimeout(() => {
            clearTimeout(tm);
            // this.effettuaAutoFitCluster = !this.effettuaAutoFitCluster;
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              const r = localStorage.getItem(this.sUserName + '_last_cluster_dd');
              if (r && r !== null) {
                this.rigaSelezionataCluster = JSON.parse(r);
                this.selezioneCluster= JSON.parse(r).ROW_ID;
              } else {
                if (this.datiGrigliaCluster && this.datiGrigliaCluster.DataTable && this.datiGrigliaCluster.DataTable.length > 0) {
                  this.rigaSelezionataCluster = this.datiGrigliaCluster.DataTable[0];
                  this.selezioneCluster = this.datiGrigliaCluster.DataTable[0].ROW_ID;
                  // this.nomeLayerCluster = this.rigaSelezionataCluster.VALUE_STR;
                  // this.caricaTabella2Inizio(this.rigaSelezionata);
                }
              }
            }, 1000);
          }, 10);
        }
      } else {
        this.datiGrigliaCluster = 'empty grid'; // null;
      }
    }, error => {
      this.caricamentoDatiInCorsoCluster = false;
      this.datiGrigliaCluster = 'empty grid'; // null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  clickSelezioneCluster(e) {
    // // this.Utils.scriveLog(e);
    this.rigaSelezionataCluster = e[0];
    localStorage.setItem(this.sUserName + '_last_cluster_dd', JSON.stringify(e[0]));
    // this.caricaTabella2Inizio(e[0]);
  }

  lastSelectedOfGridCluster(e) {

  }

  refreshGrid1Cluster(e, r) {
    if (r === true) {
      this.datiGrigliaCluster = undefined;
    }
    this.caricaTabellaCluster();
  }

  refreshGrid2(e) {
    this.codeLike = this.codeLike2 && this.codeLike2 !== null ? this.codeLike2 : null;
    if (!this.codeLike2 || this.codeLike2 === '')  {
      this.netTech = this.netTech2P;
      this.freeText = this.freeText2;
      this.bandwidth = this.bandwidth2;
      this.dateFrom = this.dateFrom2;
      this.dateTo = this.dateTo2;
      this.viewMode = this.viewModeP2;
      this.ch = this.ch2 && this.ch2 !== null ? this.ch2 : null;
      this.bsic = this.bsic2 && this.bsic2 !== null ? this.bsic2 : null;
      this.scr = this.scr2 && this.scr2 !== null ? this.scr2 : null;
      this.pci = this.pci2 && this.pci2 !== null ? this.pci2 : null;
      this.territory = this.territory2 && this.territory2 !== null ? this.territory2 : null;
      this.syncGridToMap2 = this.syncGridToMap;
    } else {
      this.netTech = '';
      this.freeText = '';
      this.bandwidth = '';
      this.viewMode = '';
      this.ch = null;
      this.bsic = null;
      this.scr = null;
      this.pci = null;
      this.territory = null;
      this.syncGridToMap2 = true;
    }
    // this.Utils.scriveLog('Aggiornamento valori', this.netTech, this.freeText, this.bandwidth, this.dateFrom,
    //   this.dateTo, this.viewMode, this.codeLike, this.ch, this.bsic, this.scr, this.pci, this.territory);
  }

  pressioneEnter(e) {
    if (e === 'AUTO' || e.key === 'Enter') {
      // this.Utils.scriveLog(e);
      this.esegueRicerca(e);
    }
  }

  esegueRicerca(e) {
    // // this.Utils.scriveLog(e);
    this.chiudeDrawer2(null);
    this.refreshGrid2(0);
  }

  selectAdditionalLayer(e) {
    // this.Utils.scriveLog('Combo cluster selezionato', e);
    this.additionalLayer = e;
    this.additionalLayer2 = e.CODE;

    this.permetteLaRichiusuraDelDrawer();
  }

  ritornoValoreDaComboAL(e) {
    // // this.Utils.scriveLog('Valore combo AL:', e);
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
          // // this.Utils.scriveLog(this.datiAddLayers);
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

  selectNetTech(e) {
    // // this.Utils.scriveLog('Combo cluster selezionato', e);
    // logConsole('Valore selezionato NT', '*' + e + '*');
    if (e || e === 0) {
      // this.netTech2 = e.CODE;
      this.netTech2P = e.VALUE_STR;
    } else {
      // this.netTech2 = 0;
      this.netTech2P = '<ALL>';
    }

    this.pressioneEnter('AUTO');

    this.permetteLaRichiusuraDelDrawer();
  }

  permetteLaRichiusuraDelDrawer() {
    const tt = setTimeout(() => {
      clearTimeout(tt);

      this.nonChiudereDrawer2 = false;
    }, 1000);
  }

  selectViewMode2(e) {
    // // this.Utils.scriveLog('Combo cluster selezionato', e);
    this.viewModeP2 = e.VALUE_STR;
    // this.pressioneEnter('AUTO');
  }

  tdtn;

  ritornoValoreDaComboNT(e) {
    // // this.Utils.scriveLog('Valore combo NT:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        clearTimeout(tm);

        if (e === undefined) {
          // this.netTech2 = 0;
          this.netTech2P = '<ALL>';
        } else {
          // // this.Utils.scriveLog(this.clusterGroup2);
          if (e === '***EMPTY***') { 
            e = 0; 
          } else {
            e = e.replace('"', '');
            e = e.replace('"', '');
          }

          let q = 0;
          // let netTech2 = 0;
          let netTech2P = '<ALL>';

          if (this.tdtn) {
            return;
          }

          this.tdtn = setInterval(() => {
            if (this.datiNetTech) {
              clearInterval(this.tdtn);
              this.tdtn = undefined;

              this.datiNetTech.forEach(element => {
                if (element.VALUE_STR === e) {
                  // // this.Utils.scriveLog('Trovato:', element);
                  
                  // netTech2 = element.CODE;
                  netTech2P = element.VALUE_STR;

                  // this.netTech2 = netTech2;
                  this.netTech2P = netTech2P;

                  this.pressioneEnter('AUTO');
                }
              });
            } else {
              q++;
              if (q > 10) {
                clearInterval(this.tdtn);
                this.tdtn = undefined;
                
                // netTech2 = 0;
                netTech2P = '<ALL>';

                // this.netTech2 = netTech2;
                this.netTech2P = netTech2P;
              }
            }
          }, 1000);
          // // this.Utils.scriveLog('Valore combo AL:', this.additionalLayer);
        }
        this.pressioneEnter('AUTO');
      }, 2000);
    // }
    } else {
      // this.netTech2 = 0;
      this.netTech2P = '<ALL>';
    }
  }

  ritornoValoreDaComboVM(e) {
    // // this.Utils.scriveLog('Valore combo AL:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        if (e === undefined) {
          this.viewModeP2 = 'net_tech_trend';
        } else {
          // // this.Utils.scriveLog(this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');
          this.datiViewModeA.forEach(element => {
            if (element.VALUE_STR === e) {
              // // this.Utils.scriveLog('Trovato:', element);
              this.viewModeP2 = element.VALUE_STR;
            }
          });
          // // this.Utils.scriveLog('Valore combo AL:', this.additionalLayer);
        }
        this.pressioneEnter('AUTO');
      }, 2000);
    // }
    }
  }

  selectBandwidth(e) {
    // // this.Utils.scriveLog('Combo cluster selezionato', e);
    // this.bandwidth2 = e.CODE;
    this.bandwidth2 = e.VALUE_STR;
    this.pressioneEnter('AUTO');

    this.permetteLaRichiusuraDelDrawer();
  }

  selectTerritory(e) {
    // // this.Utils.scriveLog('Combo cluster selezionato', e);
    this.territory2 = e.VALUE_STR;
    this.pressioneEnter('AUTO');

    this.permetteLaRichiusuraDelDrawer();
  }

  tmbw;
  
  ritornoValoreDaComboBW(e) {
    // // this.Utils.scriveLog('Valore combo AL:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

    // if (eee !== null && eee !== undefined) {
      // const tm = setTimeout(() => {
      //   clearTimeout(tm);
        if (e === undefined) {
          this.bandwidth2 = '<ALL>';
          // this.bandwidth2P = '<ALL>';
        } else {
          // // this.Utils.scriveLog(this.clusterGroup2);
          e = e.replace('"', '');
          e = e.replace('"', '');

          if (this.tmbw) { return; }

          let q = 0;
          this.tmbw = setInterval(() => {
            // logConsole('bw', this.datiBandWidth, e);

            if (this.datiBandWidth) {
              clearInterval(this.tmbw);
              this.tmbw = undefined;

              this.datiBandWidth.forEach(element => {
                if (element.VALUE_STR === e) {
                  // this.Utils.scriveLog('Trovato:', element, e);
                  this.bandwidth2 = element.VALUE_STR;
                  // this.bandwidth2P = element.VALUE_STR;
                  this.pressioneEnter('AUTO');
                }
              });
            } else {
              q++;
              if (q > 10) {
                clearInterval(this.tmbw);
                this.tmbw = undefined;

                this.bandwidth2 = '<ALL>';
                // this.bandwidth2P = '<ALL>';
              }
            }
          }, 1000);
          // // this.Utils.scriveLog('Valore combo AL:', this.additionalLayer);
        }
        this.pressioneEnter('AUTO');
      // }, 2000);
    // }
    }
  }

  ritornoValoreDaComboTE(e) {
    // this.Utils.scriveLog('Valore combo territory:', e);
    if (e && e !== 'empty' && e !== null) {
      // const ee = this.Utilities.converteStringaInJSON(e);

        e = e.replace('"', '');
        e = e.replace('"', '');

        let q = 0;
        this.territory2 = null;
        const tdb = setInterval(() => {
          // this.Utils.scriveLog('Aspetto valori territory');
          if (this.datiTerritory) {
            // this.Utils.scriveLog('Caricato valori territory', this.datiTerritory);
            clearInterval(tdb);
            this.datiTerritory.forEach(element => {
              // if (this.territory2 === null) {
                // this.Utils.scriveLog('Cerco valore territory:', element.VALUE_STR, e);
                if (element.VALUE_STR === e) {
                  // this.Utils.scriveLog('Trovato territory:', element);
                  // if (this.territory2 === null) {
                    this.territory2 = element.VALUE_STR;
                    this.pressioneEnter('AUTO');
                  // }
                }//
              // }
            });
          } else {
            q++;
            if (q > 50) {
              clearInterval(tdb);
              this.territory2 = null;
            }
          }
        }, 1000);
        // // this.Utils.scriveLog('Valore combo AL:', this.additionalLayer);

        // this.pressioneEnter('AUTO');
      } else {
        this.territory2 = null;
      }
  }

  comandoVocaleEmit(e) {
    this.comandoVocale = e;
    this.comandiVocali.esegueComandoVocale(this, e);
  }

  impostaDate(e) {
    if (e) {
      this.Utils.scriveLog('Date impostate', e);
      const ee = e.split('§');
      const oggi = ee[0];
      const domani = ee[1];

      this.dateFrom = oggi;
      this.dateTo = domani;
    }
  }

  cambioAdditionalLayer(e) {
    // this.Utils.scriveLog('Arrivato nuovo valore additional layer', e, this.datiAddLayers);

    if (e === 'NONE') {
      this.comboVisibile = false;
    } else {
      this.comboVisibile = true;
    }

    this.datiAddLayers.forEach(element => {
      if (element.VALUE_STR === e) {
        this.additionalLayer = element;
      }
    });
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
    Utils.visualizzaAlert(Messaggio);
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

  cambioAddLayer(e) {
    this.Utils.scriveLog('Cambio add layer', e, this.datiNetTech, this.datiBandWidth);
    if (this.setNetTech === true) {
      if (e[0].LAYER_NAME === 'ALL' || e[0].LAYER_NAME === 'NONE') {
        this.datiNetTech.forEach(element => {
          if (element.VALUE_STR === '<' + e[0].LAYER_NAME + '>') {
            // this.netTech2 = element.CODE;
            this.netTech2P = element.VALUE_STR;
          }
        });
        this.bandwidth2 = '<' + e[0].LAYER_NAME + '>';
      } else {
        this.datiNetTech.forEach(element => {
          if (element.VALUE_STR === e[0].CELL_TECH) {
            // this.netTech2 = element.CODE;
            this.netTech2P = element.VALUE_STR;
          }
        });
        this.bandwidth2 = e[0].BAND;
      }
      this.pressioneEnter('AUTO');
    }

    /*
    // let dom = new Date(e[0].FILE_DATE).getTime();
    let dom = new Date(this.dateTo).getTime();
    dom += (60 * 60 * 24 * 1000);
    const domani = this.datePipe.transform(dom, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    */
    let misura = '';
    if (e[0].LAYER_NAME === 'NONE') {
      this.datiAddLayers.forEach(element => {
        if (element.VALUE_STR === 'NONE') {
          misura = element;
        }
      });
    } else {
      this.datiAddLayers.forEach(element => {
        if (element.CODE_STR === e[0].LAYER_NAME) {
          misura = element;
        }
      });
      // this.Utils.scriveLog('Misura rilevata: ', misura);

      // this.impostaDate(e[0].FILE_DATE + '§' + domani + '§' + misura);
    }
    this.additionalLayer = misura;

    // this.cambioAdditionalLayer(e[0].LAYER_PATH + '§' + e[0].FILE_DATE + '§' + domani + '§' + misura + '§20'); //  + this.opacity
  }

  checkSetNetText(e) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      // this.Utils.scriveLog(e);
      this.setNetTech = e.srcElement.checked;
    }, 100);
  }

  checkSyncGridToMap(e) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      // this.Utils.scriveLog(e);
      this.syncGridToMap = e.srcElement.checked;
      this.syncGridToMap2 = e.srcElement.checked;
      this.pressioneEnter('AUTO');
    }, 100);
  }

  sceltaMaschera(q) {
    // this.Utils.scriveLog(q, this.mascheraScelta);
    this.mascheraScelta = q;
    localStorage.setItem('radiobutton_DD', this.mascheraScelta);
  }

  changeStateAccordion(n) {
    // this.Utils.scriveLog('Cambio stato accordion')
    const tm = setTimeout(() => {
      clearTimeout(tm);
      switch (n) {
        case 1:
          this.menu1 = true;
          this.menu2 = false;
          this.menu3 = false;
          break;
        case 2:
          this.menu2 = true;
          this.menu1 = false;
          this.menu3 = false;
          break;
        case 3:
          this.menu3 = true;
          this.menu2 = false;
          this.menu1 = false;
          break;
      }
    }, 100);
  }

  uploadFile = false;

  apreUpload() {
    this.uploadFile = true;
  }
  
  chiudeUpload(e) {
    this.uploadFile = false;
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
    .subscribe(data2 => {
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

  ritornoDimensioniColonneAntenne1(e) {
    Utils.scriveDimensioniColonne('Antenne1', e);
  }

  ritornoDimensioniColonneAntenne2(e) {
    Utils.scriveDimensioniColonne('Antenne2', e);
  }

  ritornoDimensioniColonneCluster(e) {
    Utils.scriveDimensioniColonne('Cluster', e);
  }

  aggiornaCH() {
    localStorage.setItem(this.userName + '_DD_CH', this.ch2);
  }

  aggiornaBSIC() {
    localStorage.setItem(this.userName + '_DD_BSIC', this.bsic2);
  }

  aggiornaSCR() {
    localStorage.setItem(this.userName + '_DD_SCR', this.scr2);
  }

  aggiornaPCI() {
    localStorage.setItem(this.userName + '_DD_PCI', this.pci2);
  }

  aggiornaFREE() {
    localStorage.setItem(this.userName + '_DD_FREE', this.freeText2);
  }

  aggiornaCL() {
    localStorage.setItem(this.userName + '_DD_CL', this.codeLike2);
  }
}

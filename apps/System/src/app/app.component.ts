import { logConsole } from './console-log';
import { environment } from './../environments/environment';
import { ApiService } from './db/api.service';
import { SessionService } from './db/session.service';
import { AfterViewInit, Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { DatePipe, DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Utils from './Utilities.component';
// import 'rxjs/add/operator/map';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { ConfermaComponent } from './conferma/conferma.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExternalHttpClient } from './db/httpclient.service';
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
  dimeDrawerAperto = 500;
  sessionID = '';
  nomiMaschere = [ '', 'System Configuration', 'Event Viewer', 'System Monitor', 'Activities Loading Monitor', 'DB Monitor', 'Session Monitor', 'Alarm Viewer' ]
  fullScreen = '';
  modalitaDebug = !environment.production;
  contextVisibile = false;
  dimeDrawer2 = '0px';
  nonChiudereDrawer2 = false;
  comandoVocale = '';
  agnLog = false;
  nomeGrigliaVM = 'View Mode';
  selezioneVM;
  listaWS;
  operatorID = -1;
  urlRoot;
  filtroTipo = 'Current';

  statoServer = '';
  statoManutenzione = '';
  coloreStatoServer = 'white';
  microfonoAttivo = false;
  autoUpdateAV = false;

  filtro = '';
  impostataDataFrom = false;
  dateFrom = new Date(new Date().getTime() - (60 * 60 * 24 * 1000));
  dateTo = new Date(new Date().getTime() + (60 * 60 * 24 * 1000));

  title = 'System';
  sessId;
  gname;
  uname;
  collegatoDaUrl = false;
  groupName;
  userName;
  qualeGriglia = 1;

  dimeDrawer = '0px';
  dimeDrawerInizio = 0;
  dimeDrawerInizio2 = 0;
  nonChiudereDrawer = false;
  vociChiuseMenu = false;
  contextAperto = false;
  mascheraEvents = false;

  slaManagerVisible = false;
  slaGroup;
  datiSLA;
  slaValueGlobale;

  datiViewMode;
  /* datiVM = [
    { ROW_ID: 0, id: 12, name: 'cmp_db_detail' },
    { ROW_ID: 1, id: 13, name: 'cmp_db_summary' },
    { ROW_ID: 2, id: 1, name: 'db_obj_size' },
    { ROW_ID: 3, id: 3, name: 'pg_stat_activity' },
    { ROW_ID: 4, id: 2, name: 'pg_stat_user_functions' },
    { ROW_ID: 5, id: 4, name: 'pg_statio_all_tables' },
    { ROW_ID: 6, id: 12, name: 'pg_stat_statements' },
    { ROW_ID: 7, id: 9, name: 'pg_stat_user_indexes' },
    { ROW_ID: 8, id: 5, name: 'sys_lock_blocking_blocked' },
    { ROW_ID: 9, id: 6, name: 'sys_lock_to_kill' },
    { ROW_ID: 10, id: 10, name: 'v_tc_run_files' },
    { ROW_ID: 11, id: 7, name: 'v_job' },
    { ROW_ID: 12, id: 8, name: 'v_job_run_details' },
    { ROW_ID: 13, id: 11, name: 'v_act_proc_statistic' },
  ];
  datiViewMode = {
    ColumnProperty: [
      { dataType: "string", headerText: "ROW_ID", hide: "true", key: "ROW_ID", locked: "true", place: "01" },
      { dataType: "numeric", headerText: "id", hide: "true", key: "id", locked: "true", place: "02" },
      { dataType: "string", headerText: "name", hide: "false", key: "name", locked: "true", place: "03" },
    ],
    DataTable: this.datiVM,
    GridSettings: {
      GridName: "Trace",
      IsFilterDisplayed: "N",
      ItemsPerPage: "25",
      ShowColumnSelector: "true",
      pageable: "true",
      reportType: "Rep",
    }
  } */
  viewMode;
  viewModeS = '';
  pulisceFiltroVM;

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
    private sessionService: SessionService,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    private comandiVocali: ComandiVocaliComponent,
    private _matDialog: MatDialog,
    private titleService: Title
  ) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.titleService.setTitle(this.title);
    }, 1000);

    const md = localStorage.getItem('ModalitaDebug');
    if (md !== null) {
      Utils.modalitaDebug = (md === 'S' ? true : false);
    } else {
      Utils.modalitaDebug = false;
    }

    this.agisce(0);

    /* this.getJSON().subscribe(data => {
      // Utils.indirizzoServer = JSON.parse(data._body).indirizzoServer;
      // Utils.linkIcone = JSON.parse(data._body).linkIcone;
      // Utils.scriveLog(Utils.indirizzoServer);

      const b = JSON.parse(data._body);
      // Utils.scriveLog(b.Proxy.toUpperCase());
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
      Utils.urlRoot = b.urlRoot;

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
    /* const b = data; // JSON.parse(data._body);
    Utils.scriveLog(b);
    Utils.linkIcone = b.linkIcone;
    Utils.serverPostRest = b.serverPostRest;
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
    Utils.serverGEOServer = b.serverGEOServer;
    Utils.urlRoot = b.urlRoot;
    this.urlRoot = b.urlRoot;
    this.indirizzoServer = b.serverPostRest; */

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
    let urlRootSenzaBarraFinale = urlRoot;
    if (urlRootSenzaBarraFinale.endsWith('/') && b.serverPostRest.startsWith(':')) {
      urlRootSenzaBarraFinale = urlRootSenzaBarraFinale.substring(0, urlRootSenzaBarraFinale.length - 1);
    }
    Utils.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRootSenzaBarraFinale, b.serverPostRest, true);
    // Utils.indirizzoGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot,  b.serverGEOServer, true);
    Utils.serverGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot,  b.serverGEOServer, true);
    if (b.righePerEventi)  {
      Utils.limitPerVirtual = b.righePerEventi;
    } else {
      Utils.limitPerVirtual = 60;
    }
    this.urlRoot = Utils.urlRoot;
    this.indirizzoServer = Utils.serverPostRest;
    logConsole('Indirizzo urlRoot: ', Utils.urlRoot);
    logConsole('Indirizzo Icone: ', Utils.linkIcone);
    logConsole('Indirizzo PostGrest: ', Utils.serverPostRest);
    logConsole('Indirizzo GeoServer: ', Utils.serverGEOServer);
    // Nuova gestione della mail del 28/04/2026 13:16

    this.eseguiConnessione();
  }

  ngOnInit() {
  }

  /* public getJSON(): Observable<any> {
    // Utils.scriveLog(window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }
    Utils.scriveLog(indirizzo);
    return this.http.get(indirizzo);
  } */

  eseguiConnessione() {
    this.route.queryParams
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {
      const par = params['par'];
      if (par) {
        const param = JSON.parse(Utils.decripta(par));
        // Utils.scriveLog(param);

        this.sessId = param.sess;
        this.gname = param.gname;
        this.userName = param.uname;
        // alert('1: ' + this.userName);
        this.maschera = param.form;
        this.fullScreen = param.FS;

        if (this.fullScreen === 'true') {
          // Utils.scriveLog(this.fullScreen);
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

    let pwd = '';
    const p = localStorage.getItem('H7-25-SY');
    if (p !== null) {
      pwd = p;
    } else {
      pwd = prompt("H7-25-SY", "");
      if (pwd === '') {
        Utils.visualizzaAlert('No!');
        return;
      }  else  {
        localStorage.setItem('H7-25-SY', pwd);
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
    
    const auav = localStorage.getItem(username + '_auto_update_av');
    // logConsole('Auto update AV from storage:', username, auav);
    if (auav !== null) {
      this.autoUpdateAV = (auav === 'S' ? true : false);
    } else {
      this.autoUpdateAV = false;
    }
    this.userName = username;

    const params = {
      v_name: username,
      v_password: password,
      v_client_public_ip: '',
      v_city: '',
      v_client_country: '',
      v_org: ''
    };
    // Utils.scriveLog('operator__login', params);
    this.apiService.chiamataPost('operator__login', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // // const data = JSON.parse(data2);
      Utils.scriveLog(data);
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
    localStorage.removeItem('H7-25-SY');
    Utils.visualizzaAlert('OK');
  }

  EffettuaLogin(dd, sessionId, groupName, userName, password) {
    if (sessionId && sessionId !== '') {
      this.userName = userName;
      // alert('2: ' + this.userName);
      this.loginOK(dd, sessionId, '');
    } else {
      let pwd = '';
      const p = localStorage.getItem('H7-25-SY');
      if (p !== null) {
        pwd = p;
      } else {
        pwd = prompt("H7-25-SY", "");
        if (pwd === '') {
          Utils.visualizzaAlert('No!');
          return;
        }  else  {
          localStorage.setItem('H7-25-SY', pwd);
        }
      }

      this.login(environment.nomeLogin, pwd, '');
    }
  }

  leggeViewMode() {
      const params = {
        cntx_id: this.sessionID,
        v_category: 'db_obj_size'
      }
      this.apiService.chiamataPost('geo_lookup__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // const data = JSON.parse(data2);
          if (data) {
            Utils.checkRitornoChiamata(this, data);
            this.datiViewMode = data;
            this.datiViewMode.DataTable.forEach(element => {
              if (element.VALUE_STR === 'db_obj_size') {
                this.selezioneVM = element.ROW_ID;
                this.viewMode = element.CODE;
                this.viewModeS = element.VALUE_STR;
              }
            });
          } else {
            Utils.scriveLog('Nessun dato ritornato dal login:', data);
          }
      }, error =>  {
        Utils.scriveLog('Login:' + error);
      // TODO alert error
      });
    // }
  }

  leggeOperatorInfo() {
    // Utils.scriveLog('Effettua login:', userName, password);

    /* if (sessionId && sessionId !== '') {
      // Utils.scriveLog('Login con credenziali automatiche');
      this.groupName = groupName;
      this.loginOK(dd, sessionId, groupName);
    } else { */
      // Utils.scriveLog('Login con credenziali interne');
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
            // Utils.scriveLog('Ritorno login: ', data);

            // const dd2 = data.OBJECT[0].object;
            // const rr = data.err_code;

            data.DataTable.forEach(element => {
              switch(element.NAME) {
                case 'geo_dashboard__frame_editor':
                  Utils.permessoFrameEditor = element.VALUE === 'Y' ? 'false' : 'true';
                  break;
                case 'operator_id':
                  this.operatorID = element.VALUE;
                  break;
                case 'login_page_url':
                  this.Utils.userRedirect = element.VALUE;
                  // alert(element.VALUE);
                  break;
                case 'string_to_command':
                  this.microfonoAttivo = (element.VALUE === 'Y' ? true : false);
                  // Utils.scriveLog('Microfono attivo:', element, this.microfonoAttivo);
                  break;
                case 'operator_group_name':
                  this.groupName = element.VALUE;
                  break;
              }
            });

            // if (rr === 0) {
            //   this.loginOK(data, sessionId, '');
            // } else {
            //   Utils.scriveLog('Connection error:' + data.v_failure_reason);
            // }
          } else {
            Utils.scriveLog('Nessun dato ritornato dal login:', data);
          }
      }, error =>  {
        Utils.scriveLog('Login:' + error);
      // TODO alert error
      });
    // }
  }

  loginOK(dd, sessionId, groupName) {
    Utils.scriveLog('Login Ok:', dd);

    // this.userName = dd;
    // alert('3: ' + this.userName);

    this.sessionService.setRemember(true);
    this.sessionService.setUser(dd);
    this.sessionService.setToken(sessionId);
    this.sessionService.setLogged(true);
    // this.groupName = dd.groupname;
    this.sessionID = sessionId;

    // Utils.scriveLog('Leggo simbolici');
    this.LeggeSimbolici();

    if (!this.userName || this.userName === '') {
      this.userName = 'DebugUser';
    }
    localStorage.setItem(this.userName + '_last_page', 'System');
    localStorage.setItem(this.userName + '_last_form', this.maschera);
    localStorage.setItem(this.userName + '_last_full_screen', this.fullScreen);

    this.mascheraEvents = false;
    this.contextVisibile = false;

    const tm = setTimeout(() => {
      clearTimeout(tm);
      switch (this.maschera) {
        case 'SC':
          this.agisce(1);
          break;
        case 'EV':
          this.contextVisibile = true;
          this.mascheraEvents = true;
          const d = new Date();
          let mese = (d.getMonth() + 1).toString().trim();
          if (mese.length === 1) { mese = '0' + mese; }
          let giorno = d.getDay().toString().trim();
          if (giorno.length === 1) { giorno = '0' + giorno; }
          this.dateTo = new Date('3000-' + mese + '-' + giorno + ' 23:59:59');
          // alert('3000-' + mese + '-' + giorno + ' 23:59:59');
          this.agisce(2);
          break;
        case 'SM':
          this.agisce(3);
          break;
        case 'AV':
          this.contextVisibile = true;
          let dInizio = new Date();
          let dFine = new Date();
          dInizio.setDate(dInizio.getDate() - 7);
          dFine.setDate(dFine.getDate());
          /* const annoInizio = dInizio.getFullYear();
          let meseInizio = (dInizio.getMonth() + 1).toString().trim();
          if (meseInizio.length === 1) { meseInizio = '0' + meseInizio; }
          let giornoInizio = dInizio.getDate().toString().trim();
          if (giornoInizio.length === 1) { giornoInizio = '0' + giornoInizio; } */

          /* const annoFine = dFine.getFullYear();
          let meseFine = (dFine.getMonth() + 1).toString().trim();
          if (meseFine.length === 1) { meseFine = '0' + meseFine; }
          let giornoFine = dFine.getDate().toString().trim();
          if (giornoFine.length === 1) { giornoFine = '0' + giornoFine; } */

          // this.dateFrom = new Date(annoInizio + '-' + meseInizio + '-' + giornoInizio + ' 00:00:00');
          // this.dateTo = new Date(annoFine + '-' + meseFine + '-' + giornoFine + ' 23:59:59');
          this.dateTo = new Date('3000-01-01 00:00:01');

          this.agisce(7);
          break;
        case 'ETLM':
          this.agisce(4);
          break;
        case 'DBO':
          this.agisce(5);
          break;
        case 'SESS':
          this.agisce(6);
          break;
      }

      this.leggeOperatorInfo();

      if (this.maschera === 'ETLM') {
        const domani = new Date();
        domani.setDate(domani.getDate() + 1);
        const unMeseFa = new Date();
        unMeseFa.setDate(unMeseFa.getDate() - 30);

        this.dateFrom = unMeseFa;
        this.dateTo = domani;
      }

      this.LeggeMeasuresPR();

      if (this.maschera === 'DBO') {
        const tm = setTimeout(() => {
          clearTimeout(tm);
          // this.viewMode = { id: 11, name: 'v_act_proc_statistic' };
          // this.viewModeS = 'v_act_proc_statistic';

          this.leggeViewMode();
        }, 1000);
      }
    }, 500);
  }

  tempoAutoUpdateAV = 10000;

  LeggeSimbolici() {
    // alert('Leggo simbolici');
    // // Utils.scriveLog('Leggo simbolici');
    if (!this.sessionID) {
      return;
    }
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '"' +
    '}';
    this.apiService.chiamataPost('geo_symbolic__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // Utils.scriveLog(data);
      // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          Utils.visualizzaAlert(data2.v_failure_reason);
        } else {
          // // Utils.scriveLog(data2);
          // // const data = JSON.parse(data2);
          // // Utils.scriveLog(data); //  and name = \'GEO_R_MAP_MAX_MEASR\'

          data2.forEach(element => {
            let name = '';
            if (element.NAME) {
              name = element.NAME;
            } else {
              if (element.name) {
                name = element.name;
              }
            }
            // logConsole('name symbolic:', name); 
            switch (name) {
              case 'GRID_PAGEABLE_ROW_NUM':
                this.righePerPaginareAutomaticamente = element.value;
                break;
              case 'ALARM_GUI_REFRESH_PERIOD':
                this.tempoAutoUpdateAV = +element.value;
                if (this.tempoAutoUpdateAV < 100) {
                  this.tempoAutoUpdateAV *= 1000;
                }
                // alert('Auto update alarm viewer every ' + this.tempoAutoUpdateAV + ' ms');
                break;
              }
          });
        }
      } else {
        // alert('Read symbolic null');
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
    // Utils.scriveLog(this.menuVisibile);
  }
  chiudeDrawer(e) {
    // Utils.scriveLog(e);
    if (this.menuVisibile === true && this.nonChiudereDrawer === false) {
      this.menuVisibile = false;
      this.dimeDrawer = this.dimeDrawerInizio + 'px';
    }
    // Utils.scriveLog(this.menuVisibile, this.dimeDrawer);
  }
  over1() {
    // Utils.scriveLog('over1', this.menuVisibile, this.dimeDrawer);
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
      // Utils.scriveLog('leave 1');
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
      // Utils.scriveLog('over2');
      if (this.schermoStretto === true) {
        this.dimeDrawer2 = '100%';
      } else {
        this.dimeDrawer2 = this.dimeDrawerAperto + 'px';
      }
      this.menuVisibile2 = true;
      // Utils.scriveLog('over 2');
    // }
  }
  leave2() {
    if (this.menuVisibile2 === true && this.nonChiudereDrawer2 === false) {
      this.dimeDrawer2 = '0px';
      this.menuVisibile2 = false;
      // Utils.scriveLog('leave 2');
    }
  }

  aperturaContext() {
    this.vociChiuseMenu = true; // !this.vociAperteMenu;
    this.contextAperto = true;
  }

  impostaNonChiudere(e) {
    this.nonChiudereDrawer = e;
    // Utils.scriveLog(e);
  }

  premutoVoceMenu(e) {
    // Utils.scriveLog('Premuto voce menu 2');
    // return;
    this.vociChiuseMenu = false;
    this.contextAperto = false;
  }

  prendePlatFormName(e) {
    Utils.scriveLog('Platform name', e);
    this.platformName = e;
  }

  prendeDateNowH(e) {
    this.dateNowH = e;
  }

  prendeSymb_TimeStamp(e) {
    this.symb_TimeStamp = e;
  }

  comandoVocaleEmit(e) {
    this.comandoVocale = '';
    this.comandiVocali.esegueComandoVocale(this, e);
  }

  @HostListener('window:resize')
  public detectResize(): void {
    const x = this.divCont.nativeElement.offsetWidth;
    const y = this.divCont.nativeElement.offsetHeigth;
    // Utils.scriveLog(this.divCont.nativeElement.offsetWidth);
    // Utils.scriveLog(this.divCont.nativeElement.offsetHeight);
    if (x <= 650) {
      this.schermoStretto = true;
    } else {
      this.schermoStretto = false;
    }
  }

  impostaNonChiudere2(e) {
    this.nonChiudereDrawer2 = e;
    // // Utils.scriveLog(e);
  }

  ngAfterViewInit() {
    this.detectResize();
  }

  /* selectViewMode(e) {
    // // Utils.scriveLog('Combo cluster selezionato', e);
    this.viewMode = e.id;
    this.viewModeS = e.name;
    // this.pressioneEnter('AUTO');
  } */

  /* ritornoValoreDaComboVM(e) {
    if (e && e !== 'empty' && e !== null) {
      Utils.scriveLog('Valore combo VM:', e, this.datiViewMode);
      let q = 0;
      const t = setInterval(() => {
        if (this.datiViewMode && this.datiViewMode !== null) {
          clearInterval(t);
          let ok = false;
          this.datiViewMode.forEach(element => {
            if (!ok && element.id === e) {
              ok = true;
              this.viewModeS = element.name;
              this.viewMode = e;
            }
          });
          if (ok) {
            this.viewModeS = this.datiViewMode[0].name;
            this.viewMode = this.datiViewMode[0];
        }
        } else {
          q++;
          if (q > 15) {
            clearInterval(t);
          }
        }
      }, 1000);
    }
  } */

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
      Utils.scriveLog('The dialog was closed', result);
      // this.animal = result;
    });
  }

  clickSelezioneVM(e) {
    // Utils.scriveLog(e[0]);
    this.viewMode = e[0].CODE;
    this.viewModeS = e[0].VALUE_STR;

    // Utils.scriveLog(this.viewMode, this.viewModeS);
  }

  lastSelectedOfGridVM(e) {
    Utils.scriveLog(e);
  }

  lettiWS(e) {
    Utils.scriveLog(e);

    /* const l = new Array();
    e.forEach(element => {
      if (element.FOLDER === 'Template')  {
        element.DASHBOARD.forEach(element2 => {
          l.push(element2);
        });
      }
    }); */
    this.listaWS = e;
    Utils.scriveLog('Lista WS: ', e);
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

      const tt = setTimeout(() => {
        clearTimeout(tt);
        
        this.userManualPrint = false;
      }, 3000);
    });  

  }

  u_atob(ascii) {
    return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
  }

  ritornoDimensioniColonneVM(e) {
    Utils.scriveDimensioniColonne('VM', e);
  }

  clickAutoUpdateAV() {
    const t = setTimeout(() => {
      clearTimeout(t);

      // logConsole('Auto update AV:', this.userName, this.autoUpdateAV);
      localStorage.setItem(this.userName + '_auto_update_av', this.autoUpdateAV ? 'S' : 'N');
    }, 100);
  }

  confermaDaSla(e) {

  }

  refreshSLAManager(e) {
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh sla data');
    // this.LeggeSLADataPR();
  }

  measureData;

  LeggeMeasuresPR() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost('geo_measure_dfn__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      Utils.checkRitornoChiamata(Utils, data2);

      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cluster group:', data);
        this.measureData = data.DataTable;
     } else {
        this.measureData = 'empty grid'; // null;
      }
    }, error => {
      logConsole('Read Measures:' + error);
    });
  }

  arrivataDataOraServer(e) {
    if (this.impostataDataFrom) {
      return;
    }
    
    const d = new Date(e);
    d.setHours(d.getHours() - 24);
    logConsole('Data ora server:', e, d);

    const anno = d.getFullYear();
    let mese = (d.getMonth() + 1).toString().trim();
    if (mese.length === 1) { mese = '0' + mese; }
    let giorno = d.getDate().toString().trim();
    if (giorno.length === 1) { giorno = '0' + giorno; }
    let ora = d.getHours().toString().trim();
    if (ora.length === 1) { ora = '0' + ora; }
    let minuti = d.getMinutes().toString().trim();
    if (minuti.length === 1) { minuti = '0' + minuti; }
    let secondi = d.getSeconds().toString().trim();
    if (secondi.length === 1) { secondi = '0' + secondi; }

    this.dateFrom = new Date(anno + '-' + mese + '-' + giorno + ' ' + ora + ':' + minuti + ':' + secondi);
    
    this.impostataDataFrom = true;
  }
}

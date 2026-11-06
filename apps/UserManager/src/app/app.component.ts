import { logConsole } from './console-log';
import { ExternalHttpClient } from './db/httpclient.service';
import { environment } from './../environments/environment';
import { ApiService } from './db/api.service';
import { SessionService } from './db/session.service';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import Utils from './Utilities.component';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { ConfermaComponent } from './conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
// import Swal from 'sweetalert2/dist/sweetalert2.js';
// import { FileSaverService } from 'ngx-filesaver';
import download from 'downloadjs';  // Importa downloadjs
import Swal from 'sweetalert2';
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

  mascheraUtente = false;
  titoloMascheraEdit = '';
  messaggioWarning;
  messaggioWarning2;

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  raggruppabile = false;
  indirizzoServer;
  schermoStretto = false;
  ultimaVoltaClickMenu = -1;
  menuVisibile = false;
  platformName = '';
  dateNowH = '';
  symb_TimeStamp = '';
  maschera = '';
  sessionID = '';
  nomiMaschere = [ '', 'Users', 'User Groups', 'User Profiles' ];
  fullScreen = '';
  modalitaDebug = !environment.production;
  salvato = false;
  righePerPaginareAutomaticamente = -1;

  dimeDrawer = '0px';
  dimeDrawerInizio = 3;
  nonChiudereDrawer = false;
  vociChiuseMenu = false;
  contextAperto = false;

  statoServer = '';
  statoManutenzione = '';
  coloreStatoServer = 'white';
  microfonoAttivo = false;
  comandoVocale = '';

  title = 'UserManager';
  sessId;
  gname;
  uname;
  collegatoDaUrl = false;
  groupName;
  userName;
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
  groupIdOrig;
  operatorProfileIdOrig;
  sGroupId;
  sOperatorProfileId;

  datiGroup;
  datiProfile;

  sTokensLeft = 0;
  sTokensLeftOriginale = 0;

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
    private comandiVocali: ComandiVocaliComponent,
    private _matDialog: MatDialog,
    private titleService: Title
  ) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.titleService.setTitle(this.title);
    }, 1000);

    // this.agisce(0);

    /* this.getJSON().subscribe(data => {
      // Utils.indirizzoServer = JSON.parse(data._body).indirizzoServer;
      // Utils.linkIcone = JSON.parse(data._body).linkIcone;
      // // logConsole(Utils.indirizzoServer);

      // this.eseguiConnessione();

      const b = JSON.parse(data._body);
      // // logConsole(b.Proxy.toUpperCase());
      Utils.indirizzoServer = b.indirizzoServer;
      Utils.linkIcone = b.linkIcone;
      Utils.serverPostRest = b.serverPostRest;
      if (b.Proxy.toUpperCase() === 'TRUE') {
        Utils.facadeServerAddress = b.facadeServerAddressViaProxy;
      } else {
        Utils.facadeServerAddress = b.facadeServerAddressLocale;
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
    // // logConsole(b.Proxy.toUpperCase());
    Utils.indirizzoServer = b.indirizzoServer;
    Utils.linkIcone = b.linkIcone;
    Utils.serverPostRest = b.serverPostRest;
    /* if (b.Proxy && b.Proxy.toUpperCase() === 'TRUE') {
      Utils.facadeServerAddress = b.facadeServerAddressViaProxy;
    } else {
      Utils.facadeServerAddress = b.facadeServerAddressLocale;
    } * /
    Utils.serverGEOServer = b.serverGEOServer;
    Utils.urlRoot = b.urlRoot;
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
    Utils.serverGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot,  b.serverGEOServer, true);
    Utils.indirizzoServer = Utils.serverPostRest;
    this.indirizzoServer = Utils.serverPostRest;
    logConsole('Indirizzo urlRoot: ', Utils.urlRoot);
    logConsole('Indirizzo Icone: ', Utils.linkIcone);
    logConsole('Indirizzo PostGrest: ', Utils.serverPostRest);
    logConsole('Indirizzo GeoServer: ', Utils.serverGEOServer);
    // Nuova gestione della mail del 28/04/2026 13:16


    this.eseguiConnessione();
  }

  ngOnInit() {
    // ?par=5;128;38;41;123;110;125;126;46;71;46;49;72;68;68;67;122;76;120;122;77;125;75;77;81;85;128;81;82;84;131;83;138;86;140;94;93;97;95;140;99;97;103;147;82;93;82;85;155;163;151;164;157;91;116;91;94;175;173;174;180;99;110;99;102;186;180;168;181;174;108;133;108;111;154;196;185;184;187;129;164;186;185;186;189;123;134;123;126;195;205;209;205;131;156;131;134;186;217;204;218;220;140;151;140;143;180;194;146;171;146;149;218;214;226;234;221;155;247;64;105;161;1;30;227;118;
  }

  /* public getJSON(): Observable<any> {
    // // logConsole(window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && window.location.port === '4200') {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }
    // logConsole(indirizzo);
    return this.http.get(indirizzo);
  } */

  eseguiConnessione() {
    this.route.queryParams
    .pipe(takeUntil(this.destroy$))    
    .subscribe(params => {
      const par = params['par'];
      if (par) {
        const param = JSON.parse(Utils.decripta(par));
        // // logConsole(param);

        this.sessId = param.sess;
        this.gname = param.gname;
        // alert('User 0: ' + param.uname);
        this.userName = param.uname;
        this.maschera = param.form;
        this.fullScreen = param.FS;

        if (this.fullScreen === 'true') {
          // // logConsole(this.fullScreen);
          document.documentElement.requestFullscreen();
        }

        if (this.sessId && this.sessId !== undefined && this.sessId !== 'undefined') {
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.collegatoDaUrl = true;
            const dd = this.userName; // { 'username': this.userName };
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
    const p = localStorage.getItem('H7-25-UM');
    if (p !== null) {
      pwd = p;
    } else {
      pwd = prompt("H7-25-UM", "");
      if (pwd === '') {
        Utils.visualizzaAlert('No!');
        return;
      }  else  {
        localStorage.setItem('H7-25-UM', pwd);
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

    const params = {
      v_name: username,
      v_password: password,
      v_client_public_ip: '',
      v_city: '',
      v_client_country: '',
      v_org: ''
    };
    // logConsole('operator__login', params);
    this.apiService.chiamataPost('operator__login', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))    
    .subscribe(data => {
      // logConsole(data);
      if (data.err_code !== 0) {
        const rr = data.failure_reason;
      } else {
        this.loginOK(environment.nomeLogin ,data.cntx_id, '', 'login');
      }
    }, error => {
      // alert(error);
    });
  }

  pulisciPassword() {
    localStorage.removeItem('H7-25-UM');
    Utils.visualizzaAlert('OK');
  }

  EffettuaLogin(dd, sessionId, groupName, userName, password) {
    if (sessionId && sessionId !== '') {
      // alert('User 11: ' + userName);
      // this.userName = dd;
      this.loginOK(dd, sessionId, '', 'login 2');
    } else {
      let pwd = '';
      const p = localStorage.getItem('H7-25-UM');
      if (p !== null) {
        pwd = p;
      } else {
        pwd = prompt("H7-25-UM", "");
        if (pwd === '') {
          Utils.visualizzaAlert('No!');
          return;
        }  else  {
          localStorage.setItem('H7-25-UM', pwd);
        }
      }

      this.login(environment.nomeLogin, pwd, '');
    }
  }

  leggeOperatorInfo() {
    // // logConsole('Effettua login:', userName, password);

    /* if (sessionId && sessionId !== '') {
      // // logConsole('Login con credenziali automatiche');
      this.groupName = groupName;
      this.loginOK(dd, sessionId, groupName);
    } else { */
      // // logConsole('Login con credenziali interne');
      const params = {
        cntx_id: this.sessionID
      }
      this.apiService.chiamataPost('operator_info_my__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))    
      .subscribe(data => {
          if (data) {
            Utils.checkRitornoChiamata(this, data);
            // // logConsole('Ritorno login: ', data);

            // const dd2 = data.OBJECT[0].object;
            // const rr = data.err_code;

            data.DataTable.forEach(element => {
              switch(element.NAME) {
                case 'string_to_command':
                  this.microfonoAttivo = (element.VALUE === 'Y' ? true : false);
                  // // logConsole('Microfono attivo:', element, this.microfonoAttivo);
                  break;
                case 'geo_dashboard__frame_editor':
                  Utils.permessoFrameEditor = element.VALUE === 'Y' ? 'false' : 'true';
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
            //    this.loginOK(data, this.sessionID, '');
            // } else {
            //   // logConsole('Connection error:' + data.v_failure_reason);
            // }
          } else {
            // logConsole('Nessun dato ritornato dal login:', data);
          }
      }, error =>  {
        // logConsole('Login:' + error);
      // TODO alert error
      });
    // }
  }

  loginOK(dd, sessionId, groupName, daDove) {
    // // logConsole('Login Ok:', dd);

    this.sessionService.setRemember(true);
    this.sessionService.setUser(dd);
    this.sessionService.setToken(sessionId);
    this.sessionService.setLogged(true);
    // this.groupName = dd.groupname;
    this.sessionID = sessionId;
    logConsole('User name: ', dd, daDove);
    // alert('User 1: ' + dd);
    this.userName = dd;

    // // logConsole('Leggo simbolici');
    this.LeggeSimbolici();
    this.leggeGroups();
    this.leggeProfiles();

    if (this.userName === '') {
      this.userName = 'DebugUser';
    }
    localStorage.setItem(this.userName + '_last_page', 'User Manager');
    localStorage.setItem(this.userName + '_last_form', this.maschera);
    localStorage.setItem(this.userName + '_last_full_screen', this.fullScreen);

    // logConsole(this.maschera);

    const tm = setTimeout(() => {
      clearTimeout(tm);
      switch (this.maschera) {
        case 'Users':
          const tm1 = setTimeout(() => {
            clearTimeout(tm1);
            this.titleService.setTitle('Users');
          }, 1000);

          this.raggruppabile = true;
          this.agisce(1);
          break;
        case 'Groups':
          const tm2 = setTimeout(() => {
            clearTimeout(tm2);
            this.titleService.setTitle('Users Groups');
          }, 1000);

          this.raggruppabile = false;
          this.agisce(2);
          break;
        case 'UP':
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.titleService.setTitle('Users Profiles');
          }, 1000);

          this.raggruppabile = false;
          this.agisce(3);
          break;
      }

      this.leggeOperatorInfo();
    }, 500);

    // this.caricaTabella();
  }

  refreshGrid1(e, r) {
    // logConsole(e);
    if (r === true) {
      this.datiGriglia = undefined;
    }
    this.caricaTabella();
  }

  refreshGrid2(e, r) {
    // logConsole(e);
    if (r === true) {
      this.datiGriglia2 = undefined;
    }
    this.clickSelezione(this.rigaSelezionata); // (this.datiGriglia.DataTable)
  }

  LeggeSimbolici() {
    // // // logConsole('Leggo simbolici');
    const params = '{' +
      '"cntx_id": "' + this.sessionID + '"' +
    '}';
    this.apiService.chiamataPost('geo_symbolic__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))    
    .subscribe(data2 => {
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          Utils.visualizzaAlert(data2.v_failure_reason);
        } else {
          // // // logConsole(data2);
          // const data = JSON.parse(data2);
          // // // logConsole(data); //  and name = \'GEO_R_MAP_MAX_MEASR\'

          data2.forEach(element => {
            let name = '';
            if (element.NAME) {
              name = element.NAME;
            } else {
              if (element.name) {
                name = element.name;
              }
            }
            switch (name) {
              case 'GRID_PAGEABLE_ROW_NUM':
                this.righePerPaginareAutomaticamente = element.VALUE;
                break;
              }
          });
        }
      } else {
        Utils.visualizzaAlert('Read symbolic null');
      }
    }, error => {
      Utils.visualizzaAlert('Read symbolic: ' + error);
    });
  }

  agisce(n) {
    // // logConsole(n);
    this.qualeGriglia = n;
    // if (this.qualeGriglia !== 1) {
      // this.selezione = '-1';
    // }
    this.caricaTabella();
  }

  clickOnGriglia2(e) {
    // logConsole(e);
  }

  accendeSpegneSliders() {
    const gutter = document.getElementsByClassName('as-split-gutter');
    const areeHor = document.getElementsByClassName('as-horizontal');
    const areeVer = document.getElementsByClassName('as-vertical');

    // logConsole(gutter, this.qualeGriglia);
    /* switch (acceso) {
      case true:
        come = 'display';
        dimeX = '100%';
        break;
      case false:
        come = 'hidden';
        dimeX = '101%';
        break;
    } */

    switch (this.qualeGriglia) {
      case 1:
        if (gutter) {
          for (let i = 0; i < gutter.length; i++) {
            const parent = gutter[i]['parentElement'].innerHTML.indexOf('direction="vertical"');
            if (parent > -1) {
              gutter[i]['style'] = 'flex-basis: 11px; order: 1; visibility: hidden;';
            } else {
              gutter[i]['style'] = 'flex-basis: 11px; order: 1;';
            }
          }
        }

        if (areeHor) {
          for (let i = 0; i < areeHor.length; i++) {
            areeHor[i]['style'].width = 'calc(100% + 11px)';
          }
        }

        if (areeVer) {
          for (let i = 0; i < areeVer.length; i++) {
            areeVer[i]['style'].height = '100%';
          }
        }
        break;
      case 2:
      case 3:
        if (gutter) {
          for (let i = 0; i < gutter.length; i++) {
            gutter[i]['style'] = 'flex-basis: 11px; order: 1; visibility: hidden;';
          }
        }

        if (areeHor) {
          for (let i = 0; i < areeHor.length; i++) {
            areeHor[i]['style'].width = 'calc(100% + 11px)';
          }
        }

        if (areeVer) {
          for (let i = 0; i < areeVer.length; i++) {
            areeVer[i]['style'].height = 'calc(100% + 11px)';
          }
        }
        break;
      case 4:
        if (gutter) {
          for (let i = 0; i < gutter.length; i++) {
            const parent = gutter[i]['parentElement'].innerHTML.indexOf('direction="vertical"');
            if (parent === -1) {
              gutter[i]['style'] = 'flex-basis: 11px; order: 1; visibility: hidden;';
            } else {
              gutter[i]['style'] = 'flex-basis: 11px; order: 1;';
            }
          }
        }

        if (areeHor) {
          for (let i = 0; i < areeHor.length; i++) {
            areeHor[i]['style'].width = '100%';
          }
        }

        if (areeVer) {
          for (let i = 0; i < areeVer.length; i++) {
            areeVer[i]['style'].width = 'calc(100% + 11px)';
          }
        }
        break;
      }
  }

  tastoNewVisibile = true;
  tastoEditVisibile = true;

  caricaTabella() {
    let nomeTabella = '';
    let params;

    this.dimeFinestraGriglia1 = 100;
    this.dimeFinestraGriglia2 = 0;

    this.dimeFinestraGrigliaHor1 = 100;
    this.dimeFinestraGrigliaHor2 = 0;

    this.tastoNewVisibile = true;
    this.tastoEditVisibile = true;
    
    switch (this.qualeGriglia) {
      case 1:
        this.raggruppabile = false;
        this.nomeGriglia = 'Users';
        nomeTabella = 'operator__grid';
        params = {
          cntx_id: this.sessionService.getToken(),
          v_group_name: '' // this.groupName
        };
        this.dimeFinestraGrigliaHor1 = 70;
        this.dimeFinestraGrigliaHor2 = 30;

        this.accendeSpegneSliders();
        break;
      /* case 2:
        this.nomeGriglia = 'Connected Users';
        nomeTabella = 'operator_session__grid';
        params = {
          cntx_id: this.sessionService.getToken()
        };

        this.accendeSpegneSliders();
        break; */
      case 2:
        this.raggruppabile = false;
        this.nomeGriglia = 'Groups';
        nomeTabella = 'operator_group__grid';
        params = {
          cntx_id: this.sessionService.getToken()
        };
        this.tastoNewVisibile = false;
        this.tastoEditVisibile = true;
    
        this.accendeSpegneSliders();
        break;
      case 3:
        this.raggruppabile = true;
        this.nomeGriglia = 'User Profiles';
        nomeTabella = 'operator_profile__grid';
        params = {
          cntx_id: this.sessionService.getToken()
        };
        this.dimeFinestraGriglia1 = 50;
        this.dimeFinestraGriglia2 = 50;

        this.tastoNewVisibile = false;
        this.tastoEditVisibile = false;

        this.accendeSpegneSliders();
        break;
    }
    // // logConsole(nomeTabella, params);

    this.caricamentoDatiInCorso = true;
    // this.datiGriglia2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))    
    .subscribe(data => {
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        if (data.v_grid_msg !== undefined) {
          this.messaggioWarning = data.v_grid_msg;
        } else {
          this.messaggioWarning = '';
        }

        if (this.qualeGriglia === 3) {
          this.datiGriglia = JSON.parse(JSON.stringify(data));
          this.effettuaAutoFit = !this.effettuaAutoFit;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            if (this.datiGriglia && this.datiGriglia.DataTable && this.datiGriglia.DataTable.length > 0) {
              this.clickSelezione(this.rigaSelezionata); // this.datiGriglia.DataTable);
            }
          }, 1000);
        } else {
          if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
            && this.datiGriglia.DataTable.length > 0 && data.DataTable && this.oldGriglia === this.qualeGriglia) {
            this.datiGriglia.DataTable = data.DataTable;
          } else {
            // this.datiGriglia = null;
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.datiGriglia = JSON.parse(JSON.stringify(data));
              this.effettuaAutoFit = !this.effettuaAutoFit;
              const tm1 = setTimeout(() => {
                clearTimeout(tm1);
                if (this.datiGriglia && this.datiGriglia.DataTable && this.datiGriglia.DataTable.length > 0) {
                  this.clickSelezione(this.rigaSelezionata); // this.datiGriglia.DataTable);
                }
              }, 1000);
            }, 10);
          }
        }
      } else {
        this.datiGriglia = 'empty grid';
      }
      this.oldGriglia = this.qualeGriglia;
    }, error => {
      this.caricamentoDatiInCorso = false;
      this.oldGriglia = this.qualeGriglia;
      // this.Utils.messaggioDiErrore(this.datiGriglia, error);
      this.datiGriglia = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      // this.datiGriglia = null;
      // alert('Read:' + error);
    });
  }

  rigaSelezionata;

  clickSelezione(ee) {
    if (!ee) {
      return;
    }
    
    this.nonAggiornare = true;
    this.salvato = false;

    this.rigaSelezionata = ee;
    let e;
    if (ee[0]) { 
      e = ee; 
    } else { 
      e = [e]; 
    }
    this.selezione[this.qualeGriglia] = e[0].ROW_ID;
    logConsole('CLICK', this.rigaSelezionata);

    if (this.qualeGriglia === 1) {
      this.sUserName = e[0].NAME;
      this.sMail = e[0].EMAIL;
      this.sDescription = e[0].DESCRIPTION;
      this.sPassword = '';
      this.sMobile = e[0].MOBILE;
      this.iId = e[0].OPERATOR_ID;
      this.operatorProfileId = e[0].OPERATOR_PROFILE_ID;
      this.repositoryClientPath = e[0].REPOSITORY_CLIENT_PATH;
      this.groupId = e[0].GROUP_ID;
      this.sTokensLeft = !e[0].AIREQ_TOKENS_LEFT_FULL || e[0].AIREQ_TOKENS_LEFT_FULL === null ? 0 : +e[0].AIREQ_TOKENS_LEFT_FULL;
      this.sGroupId = e[0].GROUP_ID;
      this.sOperatorProfileId = e[0].OPERATOR_PROFILE_ID;

      this.sUserNameOrig = e[0].NAME;
      this.sMailOrig = e[0].EMAIL;
      this.sDescriptionOrig = e[0].DESCRIPTION;
      this.sPasswordOrig = '';
      this.sMobileOrig = e[0].MOBILE;
      this.groupIdOrig = this.sGroupId;
      this.operatorProfileIdOrig = this.operatorProfileId;
      this.sTokensLeftOriginale = !e[0].AIREQ_TOKENS_LEFT_FULL || e[0].AIREQ_TOKENS_LEFT_FULL === null ? 0 : +e[0].AIREQ_TOKENS_LEFT_FULL;

      this.nuovoUtente = false;

      this.sLock = e[0].STATUS === 'locked' ? true : false;
      // alert('0');
    } else {
      this.groupName = e[0].NAME;
      this.sDescription = e[0].DESCRIPTION;
      this.sTokensLeft = !e[0].AIREQ_TOKENS_LEFT_FULL || e[0].AIREQ_TOKENS_LEFT_FULL === null ? 0 : +e[0].AIREQ_TOKENS_LEFT_FULL;

      this.sDescriptionOrig = e[0].DESCRIPTION;
      this.sTokensLeftOriginale = +e[0].AIREQ_TOKENS_LEFT_FULL;
    }
    localStorage.setItem(this.userName + '_userManagerGrid1', JSON.stringify(this.selezione));
    // // logConsole('Lock', this.sLock, e[0]);

    if (this.qualeGriglia === 3) {
      // // logConsole(e);
      const params = {
        cntx_id: this.sessionService.getToken(),
        v_operator_profile_id: e[0].OPERATOR_PROFILE_ID
      };
      // // logConsole(params);
      this.caricamentoDatiInCorso2 = true;
      this.apiService.chiamataPost('operator_profile_privilege__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))    
      .subscribe(data => {
        this.caricamentoDatiInCorso2 = false;
        // // logConsole(data);
        if (data && data !== null) {
          Utils.checkRitornoChiamata(this, data);

          if (data.v_grid_msg !== undefined) {
            this.messaggioWarning2 = data.v_grid_msg;
          } else {
            this.messaggioWarning2 = '';
          }

          if (this.datiGriglia2 && this.datiGriglia2 !== 'empty grid' && this.datiGriglia2.DataTable
              && this.datiGriglia2.DataTable.length > 0 && data.DataTable) {
              this.datiGriglia2.DataTable = data.DataTable;
          } else {
            // this.datiGriglia2 = null;
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.datiGriglia2 = JSON.parse(JSON.stringify(data));
              this.effettuaAutoFit2 = !this.effettuaAutoFit2;
            }, 10);
          }
        } else {
          this.datiGriglia2 = 'empty grid';
        }
      }, error => {
        this.caricamentoDatiInCorso2 = false;
        this.oldGriglia = this.qualeGriglia;
        // this.datiGriglia2 = null;
        // alert('Read:' + error);
      });

      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.nonAggiornare = false;
      }, 100);
    }

    // logConsole('CLICK', this.rigaSelezionata);
  }

  lastSelectedOfGrid(ee) {
    // if (this.nonAggiornare === false && ee) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        let e = ee;
        if (typeof(e) === 'string') {
          try {
            const e1 = JSON.parse(ee);
            e = e1;
          } catch (e2) {
            // logConsole('Error in lastSelectedOfGrid');
            // this.nuovoUtente = true;
            return;
          }
        }

        this.sUserName = e.NAME;
        this.sMail = e.EMAIL;
        this.sDescription = e.DESCRIPTION;
        this.sPassword = '';
        this.sMobile = e.MOBILE;
        this.iId = e.OPERATOR_ID;
        this.operatorProfileId = e.OPERATOR_PROFILE_ID;
        this.repositoryClientPath = e.REPOSITORY_CLIENT_PATH;
        this.groupId = e.GROUP_ID;

        this.sUserNameOrig = e.NAME;
        this.sMailOrig = e.EMAIL;
        this.sDescriptionOrig = e.DESCRIPTION;
        this.sPasswordOrig = '';
        this.sMobileOrig = e.MOBILE;
        this.sGroupId = e.GROUP_ID;
        this.sOperatorProfileId = e.OPERATOR_PROFILE_ID;

        // this.sLock = e.LOCK_TIMESTAMP === null ? false : true;
        this.sLock = e.STATUS === 'locked' ? true : false;
        // alert('1');

        // logConsole('lastSelectedOfGrid', e, this.groupId, this.datiGroup);
      }, 500);
    // }
  }

  modificaGroup() {
    let params;
    let nomeQuery;

    nomeQuery = 'operator_group__ins';
    params =  {
      v_cntx: this.sessionService.getToken(),
      v_description: this.sDescription ? this.sDescription : '',
      v_group_priority: null,
      v_group_name: this.groupName,
      v_aireq_tokens_left: this.sTokensLeft ? this.sTokensLeft : 0
    };

    this.caricamentoDatiInCorso2 = true;
    this.apiService.chiamataPost('' + nomeQuery, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))    
    .subscribe(data => {
      this.caricamentoDatiInCorso2 = false;
      // // logConsole(data);
      if (data) {
        Utils.checkRitornoChiamata(this, data);
        if (data.err_code === 0) {
          // // logConsole('Ho appena salvato', this.nuovoUtente);
          this.salvato = true;

          this.caricaTabella();
        } else {
          this.mostraPopup('Error: ' + data.failure_reason, false, '');
        }
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
    });
  }

  modificaUser() {
    let params;
    let nomeQuery;

    if (this.nuovoUtente === true) {
      // v_cntx text, v_name text, v_email text, v_description text, v_password text, v_mobile text,
      // v_operator_profile_id integer, v_repository_client_path text, v_group_id integer
      nomeQuery = 'operator__ins';
      params =  {
        v_cntx: this.sessionService.getToken(),
        v_name: this.sUserName ? this.sUserName : '',
        v_email: this.sMail ? this.sMail : '',
        v_description: this.sDescription ? this.sDescription : '',
        v_password: this.sPassword ? this.sPassword : '',
        v_mobile: this.sMobile ? this.sMobile : '',
        v_operator_profile_id: this.operatorProfileId ? this.operatorProfileId : 1,
        v_repository_client_path: '',
        v_group_id: this.groupId ? this.groupId : 1,
        v_aireq_tokens_left: this.sTokensLeft ? this.sTokensLeft : 0
      };
    } else {
      nomeQuery = 'operator__upd';
      params =  {
        v_cntx: this.sessionService.getToken(),
        v_id: this.iId,
        v_email: this.sMail ? this.sMail : '',
        v_description: this.sDescription ? this.sDescription : '',
        v_mobile: this.sMobile ? this.sMobile : '',
        v_repository_client_path: this.repositoryClientPath ? this.repositoryClientPath : '',
        v_operator_profile_id: this.operatorProfileId ? this.operatorProfileId : 1,
        v_group_id: this.groupId ? this.groupId : 1,
        v_aireq_tokens_left: this.sTokensLeft ? this.sTokensLeft : 0
      };
    }
    // // logConsole(params);

    this.caricamentoDatiInCorso2 = true;
    this.apiService.chiamataPost('' + nomeQuery, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))    
    .subscribe(data => {
      this.caricamentoDatiInCorso2 = false;
      // // logConsole(data);
      if (data) {
        Utils.checkRitornoChiamata(this, data);
        if (data.err_code === 0) {
          // // logConsole('Ho appena salvato', this.nuovoUtente);
          this.salvato = true;

          if (this.nuovoUtente === true) {
            this.sUserName = '';
            this.sMail = '';
            this.sDescription = '';
            this.sPassword = '';
            this.sMobile = '';
            this.groupId = 1;
            this.operatorProfileId = 1;

            this.sUserNameOrig = '';
            this.sMailOrig = '';
            this.sDescriptionOrig = '';
            this.sPasswordOrig = '';
            this.sMobileOrig = '';
            this.sGroupId = 1;
            this.sOperatorProfileId = 1;

            this.mascheraUtente = false;
          } else {
            this.sUserNameOrig = this.sUserName;
            this.sMailOrig = this.sMail;
            this.sDescriptionOrig = this.sDescription;
            this.sPasswordOrig = this.sPassword;
            this.sMobileOrig = this.sMobile;
            this.sGroupId = this.groupId;
            this.sOperatorProfileId = this.operatorProfileId;
          }

          this.repositoryClientPath = '';

          this.caricaTabella();

          this.sLock = false;
          // alert('2');
        } else {
          // alert ('Error: ' + data.failure_reason);
          this.mostraPopup('Error: ' + data.failure_reason, false, '');
        }
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      // alert('Save:' + error);
    });
  }

  selectGroup(e) {
    if (e) {
      // // logConsole(e);
      this.groupId = e.GROUP_ID;
    }
  }

  selectProfile(e) {
    if (e) {
      this.operatorProfileId = e.OPERATOR_PROFILE_ID;
    }
  }

  saveUser() {
    this.sUserName = '';
    this.sMail = '';
    this.sDescription = '';
    this.sPassword = '';
    this.sMobile = '';
    this.iId = -1;
    this.groupId = 1;
    this.operatorProfileId = 1;

    this.sUserNameOrig = '';
    this.sMailOrig = '';
    this.sDescriptionOrig = '';
    this.sPasswordOrig = '';
    this.sMobileOrig = '';
    this.sGroupId = 1;
    this.sOperatorProfileId = 1;

    this.nuovoUtente = true;
  }

  deleteUser() {
    if (this.nuovoUtente === false) {
      const messaggio = 'Are you sure to delete selected user ?';
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
          const params = {
            v_cntx: this.sessionService.getToken(),
            v_id: this.iId
          };
          this.caricamentoDatiInCorso2 = true;
          this.apiService.chiamataPost('operator__del', params)
          // .map(response => response)
          .pipe(takeUntil(this.destroy$))    
          .subscribe(data => {
            this.caricamentoDatiInCorso2 = false;
            // // logConsole(data);
            if (data) {
              Utils.checkRitornoChiamata(this, data);
              if (data.err_code === 0) {
                this.caricaTabella();
                this.saveUser();
  
                this.mascheraUtente = false;
              } else {
                // alert ('Error: ' + data.failure_reason);
                this.mostraPopup('Error: ' + data.failure_reason, false, '');
              }
            }
          }, error => {
            this.caricamentoDatiInCorso2 = false;
            // alert('Save:' + error);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
      return;
    
      if (confirm('Are you sure to delete selected user ?')) {
        const params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.iId
        };
        this.caricamentoDatiInCorso2 = true;
        this.apiService.chiamataPost('operator__del', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))    
        .subscribe(data => {
          this.caricamentoDatiInCorso2 = false;
          // // logConsole(data);
          if (data) {
            Utils.checkRitornoChiamata(this, data);
            if (data.err_code === 0) {
              this.caricaTabella();
              this.saveUser();

              this.mascheraUtente = false;
            } else {
              // alert ('Error: ' + data.failure_reason);
              this.mostraPopup('Error: ' + data.failure_reason, false, '');
            }
          }
        }, error => {
          this.caricamentoDatiInCorso2 = false;
          // alert('Save:' + error);
        });
      }
    }
  }

  lockUser() {
    if (this.nuovoUtente === false) {
      const messaggio = 'Are you sure to lock selected user ?';
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
          const params = {
            v_cntx: this.sessionService.getToken(),
            v_id: this.iId
          };
          this.caricamentoDatiInCorso2 = true;
          this.apiService.chiamataPost('operator__lock', params)
          // .map(response => response)
          .pipe(takeUntil(this.destroy$))    
          .subscribe(data => {
            this.caricamentoDatiInCorso2 = false;
            // // logConsole(data);
            if (data) {
              Utils.checkRitornoChiamata(this, data);
              if (data.err_code === 0) {
                this.caricaTabella();
                this.sLock = true;
                // alert('3');
                // // alert('User locked');
              } else {
                // alert ('Error: ' + data.v_failure_reason);
                this.mostraPopup('Error: ' + data.v_failure_reason, false, '');
              }
            }
          }, error => {
            this.caricamentoDatiInCorso2 = false;
            // alert('Save:' + error);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
      return;
    
      if (confirm('Are you sure to lock selected user ?')) {
        const params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.iId
        };
        this.caricamentoDatiInCorso2 = true;
        this.apiService.chiamataPost('operator__lock', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))    
        .subscribe(data => {
          this.caricamentoDatiInCorso2 = false;
          // // logConsole(data);
          if (data) {
            Utils.checkRitornoChiamata(this, data);
            if (data.err_code === 0) {
              this.caricaTabella();
              this.sLock = true;
              // // alert('User locked');
            } else {
              // alert ('Error: ' + data.v_failure_reason);
              this.mostraPopup('Error: ' + data.v_failure_reason, false, '');
            }
          }
        }, error => {
          this.caricamentoDatiInCorso2 = false;
          // alert('Save:' + error);
        });
      }
    }
  }

  unlockUser() {
    if (this.nuovoUtente === false) {
      const messaggio = 'Are you sure to unlock selected user ?';
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
          const params = {
            v_cntx: this.sessionService.getToken(),
            v_id: this.iId
          };
          this.caricamentoDatiInCorso2 = true;
          this.apiService.chiamataPost('operator__unlock', params)
          // .map(response => response)
          .pipe(takeUntil(this.destroy$))    
          .subscribe(data => {
            this.caricamentoDatiInCorso2 = false;
            // // logConsole(data);
            if (data) {
              Utils.checkRitornoChiamata(this, data);
              if (data.err_code === 0) {
                this.caricaTabella();
                this.sLock = false;
                // alert('4');
                // // alert('User unlocked');
              } else {
                // alert ('Error: ' + data.v_failure_reason);
                this.mostraPopup('Error: ' + data.v_failure_reason, false, '');
              }
            }
          }, error => {
            this.caricamentoDatiInCorso2 = false;
            // alert('Save:' + error);
          });    
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
      return;
  
      if (confirm('Are you sure to unlock selected user ?')) {
        const params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.iId
        };
        this.caricamentoDatiInCorso2 = true;
        this.apiService.chiamataPost('operator__unlock', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))    
        .subscribe(data => {
          this.caricamentoDatiInCorso2 = false;
          // // logConsole(data);
          if (data) {
            Utils.checkRitornoChiamata(this, data);
            if (data.err_code === 0) {
              this.caricaTabella();
              this.sLock = false;
              // // alert('User unlocked');
            } else {
              // alert ('Error: ' + data.v_failure_reason);
              this.mostraPopup('Error: ' + data.v_failure_reason, false, '');
            }
          }
        }, error => {
          this.caricamentoDatiInCorso2 = false;
          // alert('Save:' + error);
        });
      }
    }
  }

  leggeGroups() {
    const params = {
      cntx_id: this.sessionService.getToken(),
    };
    // // logConsole('geo_lookup__sel 3', new Date().getTime());
    this.apiService.chiamataPost('operator_group__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))    
    .subscribe(data => {
      Utils.checkRitornoChiamata(this, data);
      // // logConsole('Ritorno:', data);
      this.datiGroup = data.DataTable;
    }, error => {
      // alert(error);
    });
  }

  leggeProfiles() {
    const params = {
      cntx_id: this.sessionService.getToken(),
    };
    // // logConsole('geo_lookup__sel 3', new Date().getTime());
    this.apiService.chiamataPost('operator_profile__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))    
    .subscribe(data => {
      Utils.checkRitornoChiamata(this, data);
      // // logConsole('Ritorno:', data);
      this.datiProfile = data.DataTable;
    }, error => {
      // alert(error);
    });
  }

  apreMenu() {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaClickMenu < 750) {
      return;
    }
    this.ultimaVoltaClickMenu = ora;

    this.menuVisibile = !this.menuVisibile;
    this.dimeDrawer = this.schermoStretto === true ? '100%' : '500px';
    // // logConsole(this.menuVisibile);
  }
  chiudeDrawer(e) {
    if (this.nonChiudereDrawer === false) {
      this.menuVisibile = false;
      this.dimeDrawer = this.dimeDrawerInizio + 'px';
    }
    // // logConsole(this.menuVisibile, this.dimeDrawer);
  }
  over1() {
    // // logConsole('over1');
    if (this.schermoStretto === false) {
      this.dimeDrawer = '500px';
      this.menuVisibile = true;
    }
  }
  leave1() {
    if (this.nonChiudereDrawer === false) {
      this.dimeDrawer = '0px';
      this.menuVisibile = false;
      // // logConsole('leave 1');
    }
  }

  prendePlatFormName(e) {
    // // logConsole(e);
    this.platformName = e;
  }

  prendeDateNowH(e) {
    this.dateNowH = e;
  }

  prendeSymb_TimeStamp(e) {
    this.symb_TimeStamp = e;
  }

  comandoVocaleEmit(e) {
    this.comandoVocale = e;
    this.comandiVocali.esegueComandoVocale(this, e);
  }

  @HostListener('window:resize')
  public detectResize(): void {
    const x = this.divCont.nativeElement.offsetWidth;
    const y = this.divCont.nativeElement.offsetHeigth;
    // // logConsole(this.divCont.nativeElement.offsetWidth);
    // // logConsole(this.divCont.nativeElement.offsetHeight);
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
      // logConsole('The dialog was closed', result);
      // this.animal = result;
    });
  }

  controllaDescr() {
    // logConsole(this.sDescription);
    if (this.sDescription === this.sDescriptionOrig) {
      this.salvato = true;
    } else {
      this.salvato = false;
    }
  }

  controllaTokens() {
    // logConsole(this.sTokensLeft, this.sTokensLeftOriginale);
    if (this.sTokensLeft === this.sTokensLeftOriginale) {
      this.salvato = true;
    } else {
      this.salvato = false;
    }
  }

  checkEdge(event) {
    this.edge = event;
    // // logConsole('edge:', event);
  }

  premutoNewUser(e) {
    this.titoloMascheraEdit = "New user";
    this.salvato = false;
    this.saveUser();
    this.mascheraUtente = true;
  }

  chiudeMascheraUtente() {
    /* if (JSON.stringify(this.vecchioValoreUser) !== JSON.stringify(this.rigaModificataUser)) {
      if (confirm('do you want to lose the changes made?')) {
        this.mascheraModificaTicket = false;
      }
    } else {
      this.mascheraModificaTicket = false;
    } */
    this.mascheraUtente = false;
  }

  premutoEdit(e) {
    if (this.qualeGriglia === 1) {
      this.titoloMascheraEdit = "Edit user";
      this.lastSelectedOfGrid(this.rigaSelezionata[0]);
      // logConsole('Apertura edit riga', this.rigaSelezionata[0]);
      this.mascheraUtente = true;
    } else {
      this.titoloMascheraEdit = "Edit group";
      this.lastSelectedOfGrid(this.rigaSelezionata[0]);
      // logConsole('Apertura edit riga', this.rigaSelezionata[0]);
      this.mascheraUtente = true;
    }
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

  ritornoDimensioniColonne1(e) {
    this.scriveDimensioniColonne('1', e);
  }

  ritornoDimensioniColonne2(e) {
    this.scriveDimensioniColonne('2', e);
  }

  scriveDimensioniColonne(tabella, dimensioniColonne) {
    logConsole('Scrittura dimensioni colonna', tabella, dimensioniColonne);
  }
}

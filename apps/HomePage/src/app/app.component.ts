import { logConsole } from './console-log';
import { EncodedSourceMap } from '@jridgewell/source-map';
import { environment } from './../environments/environment';
import { AfterViewChecked, AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { SessionService } from './services/session.service';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { ExternalHttpClient } from './services/httpclient.service';
import Utils from './Utilities.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
// import { FileSaverService } from 'ngx-filesaver';
import download from 'downloadjs';  // Importa downloadjs

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('divContenitore', {static: true}) divCont: any;

  public Utils = Utils;
  title = 'Home Page';
  pathCarousel = '/';
  NomeFleetManager = 'Fleet Manager';
  // pathImmagini = undefined;
  images = [ 'Slide1', 'Slide2', 'Slide3', 'Slide4', 'Slide5', 'Slide6', 'Slide7', 'Slide8', 'Slide9', 'Slide10', 'Slide11', 'Slide12', 'Slide13'];
  showButtons = true;
  sessionId = '';
  maschera = '';
  fullScreen = '';
  modalitaDebug = !environment.production;
  schermoStretto = false;
  statoServer = '';
  statoManutenzione = '';
  coloreStatoServer = 'white';
  comandoVocale = '';

  screenX;
  screenY;
  rotturaSu1 = false;
  rotturaSu2 = false;
  rotturaSu3 = false;

  menuVisibile = false;
  platformName = '';
  dateNowH = '';
  symb_TimeStamp = '';
  userName = '';
  groupName;

  dimeDrawer = '0px';
  dimeDrawerInizio = 0;
  dimeDrawerAperto = 500;
  nonChiudereDrawer = false;
  microfonoAttivo = false;
  ultimaVoltaClickMenu = -1;

  indirizzoAnalytics = '';

  ngOnDestroy(): void {
    if (this.divCont) {
      this.divCont.nativeElement.remove();
    }
  }

  constructor(
    // private fileSaver: FileSaverService,
    private sessionService: SessionService,
    private http: ExternalHttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private comandiVocali: ComandiVocaliComponent,
    private titleService: Title
  ) {
    setTimeout(() => {
      this.titleService.setTitle(this.title);
    }, 1000);

    // // logConsole(this.pathImmagini);
    /* this.getJSON().subscribe(data => {
      const b = JSON.parse(data._body);
      // // logConsole(b.Proxy.toUpperCase());
      Utils.linkIcone = b.linkIcone;
      Utils.serverPostRest = b.serverPostRest;
      if (b.Proxy.toUpperCase() === 'TRUE') {
        Utils.facadeServerAddress = b.facadeServerAddressViaProxy;
      } else {
        Utils.facadeServerAddress = b.facadeServerAddressLocale;
      }
      this.apiService.setUrl(Utils.facadeServerAddress);
      Utils.urlRoot = b.urlRoot;

      this.activatedRoute.queryParams.subscribe(params => {
        const par = params['par'];
        if (par) {
          const param = JSON.parse(Utils.decripta(par));
          // // logConsole(param);

          this.sessionId = param.sess;
          this.groupName = param.gname;
          this.userName = param.uname;
          this.maschera = param.form;
          this.fullScreen = param.FS;
          // // logConsole('Parametri di passaggio su home page', this.sessionId, this.maschera, this.fullScreen);

          // // logConsole(this.modalitaDebug);
          if ((this.sessionId && this.maschera === 'Empty') || this.modalitaDebug === true) {
            this.LeggeImpostazioni();
          } else {
            // return;
            const addr = Utils.urlRoot;
            // // logConsole(addr + 'login');
            const doveURL = addr + 'login';
            // logConsole(doveURL);
            window.location.href = doveURL;
          }
        }
      });
    }); */
  }

  @HostListener('window:resize')
  public detectResize(): void {
    if (this.divCont) {
      const x = this.divCont.nativeElement.offsetWidth;
      const y = this.divCont.nativeElement.offsetHeigth;
      // // logConsole(this.divCont.nativeElement.offsetWidth);
      // // logConsole(this.divCont.nativeElement.offsetHeight);
      this.screenX = x;
      this.screenY = y;
      this.rotturaSu3 = true;

      if (x < 900) {
        this.schermoStretto = true;
      } else {
        this.schermoStretto = false;
      }
    }
  }

  pre;
  geoAntsPath;
  
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
    // logConsole('Letto json', data);
    // alert('Letto json');
    /* const b = data; // JSON.parse(data._body);
    // // logConsole(b);
    Utils.linkIcone = b.linkIcone;
    Utils.serverPostRest = b.serverPostRest;
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
    // Utils.serverGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot,  b.serverGEOServer, true);
    logConsole('Indirizzo urlRoot: ', Utils.urlRoot);
    logConsole('Indirizzo Icone: ', Utils.linkIcone);
    logConsole('Indirizzo PostGrest: ', Utils.serverPostRest);
    // logConsole('Indirizzo GeoServer: ', Utils.serverGEOServer);
    // Nuova gestione della mail del 28/04/2026 13:16

    this.activatedRoute.queryParams.subscribe(params => {
      const par = params['par'];
      // // logConsole(par);
      if (par) {
        this.prosegueLettoJSON(par);
      } else {
        const par2 = '7;130;40;43;125;112;127;128;48;73;48;51;74;118;72;122;124;79;126;74;126;81;85;131;80;85;84;132;82;133;85;138;88;141;139;91;94;99;97;94;101;104;105;98;84;95;84;87;157;165;153;166;159;93;118;93;96;97;108;97;100;184;178;166;179;172;106;131;106;109;152;194;183;182;185;127;162;184;183;184;187;121;132;121;124;193;203;207;203;129;154;129;132;168;209;213;218;224;138;149;138;141;178;192;144;169;144;147;216;212;224;232;219;153;245;50;165;55;238;109;211;114;';
        this.prosegueLettoJSON(par2)
      }
    });
  }

  prosegueLettoJSON(par) {
    // alert(Utils.decripta(par))
    const param = JSON.parse(Utils.decripta(par));

    this.sessionId = param.sess;
    // alert('sss:' + this.sessionId);
    this.groupName = param.gname;
    this.userName = param.uname;
    this.maschera = param.form;
    this.fullScreen = param.FS;
    // logConsole('Parametri di passaggio su home page', this.sessionId, this.maschera, this.fullScreen);

    // // logConsole(this.modalitaDebug);
    if ((this.sessionId && this.maschera === 'Empty') || this.modalitaDebug === true) {
      this.LeggeImpostazioni();

      this.LeggeSimbolici();
    } else {
      // return;
      const addr = Utils.urlRoot;
      // // logConsole(addr + 'login');
      const doveURL = addr + 'login';
      // logConsole(doveURL);
      window.location.href = doveURL;
    }
  }
  /* public getJSON(): Observable<any> {
    // // logConsole(window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && window.location.port === '4200') {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }
    // // logConsole(indirizzo);
    return this.http.get(indirizzo);
  } */

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // logConsole(this.divCont);
      this.detectResize();
    }, 100);
  }

  simboliciCaricati = false;

  LeggeSimbolici() {
    // // logConsole('Leggo simbolici', this.sessionId);
    if (!this.sessionId || this.sessionId === '' || this.sessionId === null)  {
      return;
    }
    const params = '{' +
      '"cntx_id": "' + this.sessionId + '"' +
    '}';
    this.apiService.chiamataPost(Utils.serverPostRest, 'geo_symbolic__sel', JSON.parse(params))
    // .map(response => response.json())
    .subscribe(data2 => {
      // // logConsole(data2);
      if (data2 && data2 !== null) {
        // if (data2.v_err_code && data2.v_err_code === 2) {
        //   alert(data2.v_failure_reason);
        // } else {
          // const data = JSON.parse(data2);
          logConsole('Simbolici', data2); //  and name = \'GEO_R_MAP_MAX_MEASR\'

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
            // logConsole(name, valore);

            switch (name) {
              case 'PLATFORM_ASSETS_DIR':
                this.pathCarousel = valore;
                break;
              case 'fleet_manager.name':
                this.NomeFleetManager = valore;
                break;
              case 'SYS_ANALYTICTS_PAGE':
                Utils.urlAnalytics = valore;
                // logConsole('Indirizzo Analytics', Utils.urlAnalytics);
                break;
              case 'ELK_GUI_URL':
                this.indirizzoAnalytics = valore;
                // logConsole('Indirizzo ELK GUI', this.indirizzoAnalytics);
                break;
              }
          });
        // }
      // } else {
        // alert('Read symbolic null');
      }
      this.simboliciCaricati = true;
    }, error => {
      // alert('Read symbolic: ' + error);
    });
  }

  dimensioneBottone = 100;

  LeggeImpostazioni() {
    const params = {
      cntx_id: this.sessionId
    };
    this.apiService.chiamataPost(Utils.serverPostRest, 'operator_info_my__grid', params)
    // .map(response => response.json())
    .subscribe(data => {
      Utils.visibilita.hideScheduler = 'true'; // data2.DataTable[0].TestScenario;
      Utils.visibilita.hideReport = 'true'; // data2.DataTable[0].Olap;
      Utils.visibilita.hideAdhoc = 'true'; // data2.DataTable[0].TestScenario;
      Utils.visibilita.hideSiteCoverage = 'true'; // data2.DataTable[0].NetworkDb;
      Utils.visibilita.hideEventLog = 'true'; // data2.DataTable[0].Event;
      Utils.visibilita.hideSimManager = 'true'; // data2.DataTable[0].Sim;
      Utils.visibilita.hidePortManager = 'true'; // data2.DataTable[0].Rtu;
      Utils.visibilita.hideSpreadSheet = 'true'; // data2.DataTable[0].Rtu;
      Utils.visibilita.hideLineManager = 'true'; // data2.DataTable[0].Line;
      Utils.visibilita.hideAI = 'true'; // data2.DataTable[0].Line;
      Utils.visibilita.hideAnts1 = 'true'; // data2.DataTable[0].Line;
      // Utils.sUserName = this.userName;
      Utils.groupName = 'SVIL';
      Utils.visibilita.hideAnalytics = 'true';
      Utils.sPlatformName = '';
      Utils.sMail = '';
      Utils.sDateNowH = '';

      let quanti = 0;

      if (data && data.DataTable) {
        // logConsole('Lettura impostazioni home', data);

        let platform_name1 = '';
        let platform_name2 = '';
        this.userName = '';

        data.DataTable.forEach(element => {
          // if (element.NAME === 'operator_group_name') {
          //   logConsole(element);
          // }
          switch (element.NAME) {
            case 'operator_group_name':
              this.groupName = element.VALUE;
              break;
            case 'PLATFORM_NAME':
              platform_name1 = element.VALUE;
              break;
            case 'PLATFORM_VER':
              platform_name2 = element.VALUE;
              break;
            case 'operator_group_name':
              Utils.operatorGroupName = element.VALUE;
              break;
            case 'operator_name':
              this.userName = element.VALUE;
              break;
            case 'operator_profile_name':
              Utils.operatorProfileName = element.VALUE;
              break;
            case 'operator_profile_description':
              Utils.operatorProfileDesc = element.VALUE;
              break;
            case 'string_to_command':
              this.microfonoAttivo = (element.VALUE === 'Y' ? true : false);
              // // logConsole('Microfono attivo:', element, this.microfonoAttivo);
              break;
            case 'PLATFORM_TIMEZONE':
              Utils.sSymb_TimeStamp =
                'Time of the remote server  (' + element.VALUE + '). ' +
                'All timestamps are reported in the remote server time';
              break;
            case 'geo_analysis':
              Utils.visibilita.hideMaps = (element.VALUE === 'Y' ? 'false' : 'true');
              if (element.VALUE === 'Y') { quanti++; }
              break;
            case 'user_manager':
              Utils.visibilita.hideUserManager = (element.VALUE === 'Y' ? 'false' : 'true');
              if (element.VALUE === 'Y') { quanti++; }
              break;
            case 'login_page_url':
              Utils.userRedirect = element.VALUE;
              // alert(element.VALUE);
              break;
            case 'fleet_manager':
              Utils.visibilita.hideFleetManager = (element.VALUE === 'Y' ? 'false' : 'true');
              if (element.VALUE === 'Y') { quanti++; }
              break;
            case 'system_manager':
              Utils.visibilita.hideSystem = (element.VALUE === 'Y' ? 'false' : 'true');
              if (element.VALUE === 'Y') { quanti++; }
              break;
            case 'spreadsheet':
              Utils.visibilita.hideSpreadSheet = (element.VALUE === 'Y' ? 'false' : 'true');
              if (element.VALUE === 'Y') { quanti++; }
              break;
            case 'ants1':
              Utils.visibilita.hideAnts1 = (element.VALUE === 'Y' ? 'false' : 'true');
              if (element.VALUE === 'Y') { quanti++; }
              break;
            case 'analytics':
              Utils.visibilita.hideAnalytics = (element.VALUE === 'Y' ? 'false' : 'true');
              if (element.VALUE === 'Y') { quanti++; }
              break;
            case 'data_dictionaries':
              Utils.visibilita.hideDataDictionaries = (element.VALUE === 'Y' ? 'false' : 'true');
              if (element.VALUE === 'Y') { quanti++; }
              break;
            case 'data_dictionaries':
              Utils.visibilita.hideDataDictionaries = (element.VALUE === 'Y' ? 'false' : 'true');
              if (element.VALUE === 'Y') { quanti++; }
              break;
            case 'geo_dashboard__frame_editor':
              Utils.permessoFrameEditor = (element.VALUE === 'Y' ? 'false' : 'true');
              break;
          }
        });
        // logConsole('Parametri group name: ', this.groupName);
        Utils.sPlatformName =  platform_name1 + ' ' + platform_name2;

        if (this.userName === '') {
          this.userName = 'DebugUser';
        }
        if (this.userName.indexOf('Luigi.Pecce') > -1) {
          if (Utils.visibilita.hideSpreadSheet === 'true') { quanti++ }
          if (Utils.visibilita.hideAnts1 === 'true') { quanti++ }
          Utils.visibilita.hideSpreadSheet = 'false';
          Utils.visibilita.hideAnts1 = 'false';
          quanti --;
        }
        this.dimensioneBottone = Math.floor(100 / quanti);
        // alert('Maschere visibili: ' + quanti + ' -> ' + this.dimensioneBottone);

        localStorage.setItem(this.userName + '_last_page', 'Home Page');
        localStorage.setItem(this.userName + '_last_form', this.maschera);
        localStorage.setItem(this.userName + '_last_full_screen', this.fullScreen);

        // // logConsole(Utils.visibilita);
      }
    }, error =>  {
      // TODO alert error
    });
  }

  changePage(url) {
    // this.router.navigate([url]);
    // this.router.navigate([url]);
    const campi = url.split(';');
    // logConsole('Passaggio a progetto ' + campi[0] + ', maschera: ' + campi[1]);

    let dove = '';
    switch (campi[0]) {
      case 'AN':
        // this.indirizzoAnalytics = Utils.urlRoot;
        // this.indirizzoAnalytics += 'elk_index/elk_index.htm';

        this.indirizzoAnalytics = Utils.urlAnalytics;
        // // logConsole(this.indirizzoAnalytics);
        const ww = window.open(this.indirizzoAnalytics, '_blank');
        break;
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

    if (campi[0] !== 'AN') {
      const passaggio = '{ ' +
        '"sess": "' + this.sessionId + '", ' +
        '"gname": "' + Utils.operatorGroupName + '", ' +
        '"uname": "' + this.userName + '", ' +
        '"form": "' + campi[1] + '", ' +
        '"FS": "' + this.fullScreen.toString() + '"' +
        '}';
      const pass = Utils.cripta(passaggio);

      let addr = this.Utils.urlRoot;
      if (!addr.endsWith('/')) {
        addr += '/';
      }
      if (addr.indexOf('geoantsweb/') === -1) {
        addr += 'geoantsweb/';
      }

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
      } */

      // logConsole(addr + dove + '/?par=' + pass); // sess=' + this.sessionId +
                                                      //    '&gname=' + Utils.operatorGroupName +
                                                      //    '&uname=' + this.userName +
                                                      //    '&form=' + campi[1] +
                                                      //    '&FS=' + this.fullScreen);
      const doveURL = addr + dove + '/?par=' + pass; // sess=' + this.sessionId +
                                                          // '&gname=' + Utils.operatorGroupName +
                                                          // '&uname=' + this.userName +
                                                          // '&form=' + campi[1] +
                                                          // '&FS=' + this.fullScreen;
      logConsole('Cambio pagin home:', doveURL);
      // return;

      window.location.href = doveURL;
    }
  }

  tastoImmagine(e) {
    // // logConsole(Utils.linkIcone + e);
    return this.sanitizer.bypassSecurityTrustStyle('url(' + Utils.linkIcone + e + ')');
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
    // this.chiudeDrawer2(null);
    // // logConsole(this.menuVisibile);
  }
  chiudeDrawer(e) {
    if (this.menuVisibile === true && this.nonChiudereDrawer === false) {
      this.menuVisibile = false;
      this.dimeDrawer = this.dimeDrawerInizio + 'px';
    }
    // // logConsole(this.menuVisibile, this.dimeDrawer);
  }
  over1() {
    // // logConsole('over1');
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
      // // logConsole('leave 1');
    }
  }

  vociChiuseMenu = false;
  
  premutoVoceMenu(e) {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Premuto voce menu 2');
    // return;
    this.vociChiuseMenu = false;
    /* this.dashboardAccordionOpen = false;
    this.activityAccordionOpen = false;
    this.settingsAccordionOpen = false;
    this.filtersAccordionOpen = false;
    this.dataSetAccordionOpen = false;
    this.debugAccordionOpen = false;
    this.timeAccordionOpen = false; */
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
  
  userManualPrint = false;

  fDownloadUserManual(e) {
    this.userManualPrint = true;
    const params = {
      cntx_id: this.sessionId,
      v_name: 'User Manual ITA.pdf'
    }
    this.apiService.chiamataPost(Utils.serverPostRest, 'report__download', params)
    // .map(response => response)
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
}

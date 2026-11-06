import { logConsole } from './console-log';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Utils } from './Utilities.component';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { environment } from './environments/environment';
import { Subject } from 'rxjs';
import { ApiService } from './db/api.service';
import { takeUntil } from 'rxjs/operators';
import * as download from 'downloadjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  encapsulation: ViewEncapsulation.None
})

export class App implements OnInit, OnDestroy {
  public Utils = Utils;
  modalitaDebug = false;
  platformName = '';
  sessionID = '';
  userName = '';
  groupName = '';
  mascheraSim = false;
  microfonoAttivo = false;
  operatorID = -1;
  comandoVocale = '';
  fullScreen = false;
  statoServer = '';
  statoManutenzione = '';
  coloreStatoServer = 'white';
  vociChiuseMenu = false;
  dateNowH = '';
  symb_TimeStamp = '';
  contextAperto = false;
  destroy$ = new Subject<void>();
  altro = '';
  fromFleet = false;
  maschera = '';
  collegatoDaUrl = false;
  menuSemplificato = false;
  ConnessioneStabilita = '';
  permessiDataView = new Array();  
  opacitaLogin = .1;
  mostraTastiLogin = false;

  constructor(
    private comandiVocali: ComandiVocaliComponent,
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  aggiungeIndirizzoAPathRelativo(pathIniziale: string, indirizzo: string, aggiungeBarra: boolean) {
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

  lettoJSON(data: any) {
    /* const b = data;
    if (!b.serverPostRestOracle) {
      Utils.visualizzaAlert('Variabile serverPostRestOracle non presente su connection.json');
      return;
    }

    Utils.linkIcone = b.linkIcone;
    Utils.serverPostRest = b.serverPostRest;
    Utils.serverPostRestOracle = b.serverPostRestOracle;
    Utils.serverGEOServer = b.serverGEOServer;
    Utils.indirizzoGEOServer = b.serverGEOServer;
    if (b.eventsDisplayedRows)  {
      Utils.limitPerVirtual = b.eventsDisplayedRows;
    } else {
      Utils.limitPerVirtual = 60;
    }
    Utils.urlRoot = b.urlRoot; */

    const b = data; // JSON.parse(data._body);
    if (!b.serverPostRestOracle) {
      Utils.visualizzaAlert('Variabile serverPostRestOracle non presente su connection.json');
      return;
    }
   
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
    Utils.serverPostRestOracle = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.serverPostRestOracle, true);

    if (b.eventsDisplayedRows)  {
      Utils.limitPerVirtual = b.eventsDisplayedRows;
    } else {
      Utils.limitPerVirtual = 60;
    }

    logConsole('Indirizzo di base 1 Ants1: ', indirizzoCaricato);
    logConsole('Indirizzo di base 2 Ants1: ', urlRoot);
    logConsole('Indirizzo urlRoot Ants1: ', Utils.urlRoot);
    logConsole('Indirizzo Icone Ants1: ', Utils.linkIcone);
    logConsole('Indirizzo PostGrest Ants1: ', Utils.serverPostRest);
    logConsole('Indirizzo GeoServer Ants1: ', Utils.serverGEOServer);
    // Nuova gestione della mail del 28/04/2026 13:16

    const ps = new Array();
    for (let i = 1; i <= environment.quantePagine; i++) {
      const id = { ROW_ID: i, id: i, value: i + ': Page ' + i };
      ps.push(id);
    }
    this.mostraTastiLogin = true;
   
    this.eseguiConnessione();
  }

  eseguiConnessione() {
    this.altro = '';
    this.fromFleet = false;

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      // logConsole(params['form']);
      if (params['form']) {
        this.maschera = params['form'];
        this.connettitiAMano();
        return;
      }

      let par = null;
      let daUrl = false;

      if (par === null) {
        daUrl = true;
        par = params['par'];
      }
      
      if (par && par !== null) {
        localStorage.removeItem('lastWorkspace');
        localStorage.setItem('lastWorkspace', par);

        let pp = Utils.decripta(par);
        if (pp.indexOf('}') > -1) {
          pp = pp.substring(0, pp.indexOf('}') + 1);
        }
        const param = JSON.parse(pp);
        this.maschera = param.form;
        logConsole('Parametri arrivati: ', param, this.maschera);

        if (!daUrl) {
          this.sessionID = '';
        } else {
          this.sessionID = param.sess;
        }
        this.groupName = param.gname;
        this.userName = param.uname;
        this.maschera = param.form;
        this.fullScreen = param.FS;
        this.altro = param.altro;
        this.fromFleet = param.fromFleet ? true : false;
        const dashboard = param.dashboard;

        if (this.fullScreen) {
          document.documentElement.requestFullscreen();
        }

        let tempo = 500;
        if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
          tempo = 2000;
        }

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.collegatoDaUrl = true;
          
          this.EffettuaLogin(this.sessionID, this.userName, '');
        }, tempo);
      } else {

      }
    });
  }

  EffettuaLogin(sessionId: string, userName: string, password: string) {
    if (sessionId && sessionId !== '') {
      this.userName = userName;
      this.loginOK(sessionId, 'effettua login');
    } else {
      if (userName !== '') {
        this.login(userName, password);
      } else {
        let pwd = '';
        const p = localStorage.getItem('ANTSGUI');
        if (p !== null) {
          pwd = p;
        } else {
          const promptResult: string | null = prompt("ANTSGUI", "");
          if (promptResult === null || promptResult === '') {
            Utils.visualizzaAlert('No!');
            return;
          } else {
            pwd = promptResult;
            localStorage.setItem('ANTSGUI', pwd);
          }
        }

        this.login(environment.nomeLogin, pwd);
      }
    }
  }
  
  login(username: string, password: string) {
    const params = {
      v_city: 'Milan',
      v_client_country: 'ITA',
      v_client_public_ip: '185.142.153.241',
      v_name: username,
      v_org: 'SUPERNAP Italia S.r.l.',
      v_password: password,
      v_web_site_root_url: Utils.urlRoot.replace("/geoantsweb", "")
    };
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'operator__login', params);
    this.apiService.chiamataPost('operator__login', params, false)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'LOGIN:', data);
      if (data) {
        if (data.err_code !== 0) {
          const rr = data.failure_reason;
        } else {
          // alert('CNTX: ' + data.cntx_id);
          this.loginOK(data.cntx_id, "login");
        }
      } else {
        alert('No return for login');
      }
    }, error => {
      // alert(error);
    });
  }

  loginOK(sessionId: string, daDove: string) {
    logConsole('Sessione: ' + sessionId + ' da ' + daDove);

    this.sessionID = sessionId;
    Utils.sessione = sessionId;
    
    this.collegatoDaUrl = true;
    this.mostraTastiLogin = false;

    this.LeggeSimbolici();
    this.LeggeImpostazioni();

    if (this.userName === '') {
      this.userName = 'DebugUser';
    }

    const params2 = {
      cntx_id: sessionId
    }
    this.apiService.chiamataPost('operator_info_my__grid', params2, false)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          data.DataTable.forEach((element: any) => {
            switch(element.NAME) {
              case "geo_dashboard_context_menu_simplified":
                // alert(element.VALUE);
                if (element.VALUE === 'N') {
                  this.menuSemplificato = false;
                } else {
                  this.menuSemplificato = true;
                }
                break;
              case 'operator_id':
                this.operatorID = element.VALUE;
                break;
              case 'operator_group_name':
                this.groupName = element.value;
                break;
            }
          });
        }
      });
  }
  
  LeggeSimbolici() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo simbolici');
    const params = '{' +
      '"cntx_id": "' + Utils.sessione + '"' +
    '}';
    this.apiService.chiamataPost('geo_symbolic__sel', params, false)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      if (data2 && data2 !== null) {
        Utils.checkRitornoChiamata(Utils, data2);

        data2.forEach((element: any) => {
          let name = '';
          if (element.NAME) {
            name = element.NAME;
          } else {
            if (element.name) {
              name = element.name;
            }
          }
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
          switch (name) {
            case 'ANTS1_ENABLED':
              break;
            case 'GEO_MAP_MAX_MEASR':
              break;
          }
        });

        this.impostaValoriDefault();

        this.ConnessioneStabilita = 'OK';
      } else {
        Utils.visualizzaAlert('Read symbolic null');
      }
    }, error => {
      Utils.visualizzaAlert('Read symbolic: ' + error);
    });
  }

  impostaValoriDefault() {
  }

  LeggeImpostazioni() {
    const permessiDataView = new Array();

    const params = {
      cntx_id: this.sessionID
    }
    this.apiService.chiamataPost('operator_info_my__grid', params, false)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
        if (data) {
          Utils.checkRitornoChiamata(Utils, data);

          data.DataTable.forEach((element: any) => {
            switch (element.NAME) {
              case 'operator_group_name':
                this.groupName = element.VALUE;
                break;
              case 'login_page_url':
                Utils.userRedirect = element.VALUE;
                break;
              case 'string_to_command':
                this.microfonoAttivo = (element.VALUE === 'Y' ? true : false);
                // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Microfono attivo:', element, this.microfonoAttivo);
                break;
              case 'operator_id':
                this.operatorID = element.VALUE;
                break;

                case 'data_view_AA':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AA"});
                }
                break;
              case 'data_view_LA':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "LA"});
                }
                break;
              case 'data_view_SY':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "SY"});
                }
                break;
              case 'data_view_AE':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AE"});
                }
                break;
              case 'data_view_MC':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MC"});
                }
                break;
              case 'data_view_AI':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AI"});
                }
                break;
              case 'data_view_AR':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AR"});
                }
                break;
              case 'data_view_AP':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AP"});
                }
                break;
              case 'data_view_CD':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "CD"});
                }
                break;
              case 'data_view_CV':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "CV"});
                }
                break;
              case 'data_view_CM':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "CM"});
                }
                break;
              case 'data_view_CG':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "CG"});
                }
                break;
              case 'data_view_ES':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "ES"});
                }
                break;
              case 'data_view_AH':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AH"});
                }
                break;
              case 'data_view_M':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "M"});
                }
                break;
              case 'data_view_MD':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MD"});
                }
                break;
              case 'data_view_MG':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MG"});
                }
                break;
              case 'data_view_MCDR':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "M2"});
                }
                break;
              case 'data_view_MFSEG':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MF"});
                }
                break;
              case 'data_view_MFS':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MS"});
                }
                break;
              case 'data_view_MFQ':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MQ"});
                }
                break;
              case 'data_view_MRBCIXL':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MR"});
                }
                break;
              case 'data_view_NB':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "NB"});
                }
                break;
              case 'data_view_NP':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "NP"});
                }
                break;
              case 'data_view_PC':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PC"});
                }
                break;
              case 'data_view_PT':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PT"});
                }
                break;
              case 'data_view_PK':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PK"});
                }
                break;
              case 'data_view_PL':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PL"});
                }
                break;
              case 'data_view_PM':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PM"});
                }
                break;
              case 'data_view_PS':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "PS"});
                }
                break;
              case 'data_view_TC':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "TC"});
                  permessiDataView.push({ NAME: "TP"});
                }
                break;
              case 'data_view_TI':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "TI"});
                }
                break;
              case 'data_view_XX':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "XX"});
                }
                break;
            }
          });

          this.permessiDataView = permessiDataView;
        }
    }, error =>  {
      Utils.visualizzaAlert('Login:' + error);
    // TODO alert error
    });
  }

  prendeDateNowH(e: any) {
    this.dateNowH = e;
  }

  prendeSymb_TimeStamp(e: any) {
    this.symb_TimeStamp = e;
  }

  prendePlatFormName(e: any) {
    this.platformName = e;
  }
  
  comandoVocaleEmit(e: any) {
    this.comandoVocale = e;
    this.comandiVocali.esegueComandoVocale(this, e);
  }

  premutoVoceMenu(e: any) {
    this.vociChiuseMenu = false;
    this.contextAperto = false;
  }

  // MENU
  ultimaVoltaClickMenu = 0;
  menuVisibile = false;
  dimeDrawer = '0px';
  schermoStretto = false;
  dimeDrawerInizio = 0;
  dimeDrawerAperto = 350
  nonChiudereDrawer = false;
  vecchioAccordionPerExportAperto = false;
  ultimaVoltaClickMenu2 = 0;
  accordionApertoPerExport = false;
  menuVisibile2 = false;
  dimeDrawer2 = '0px';
  dimeDrawerInizio2 = 0;
  nonChiudereDrawer2 = false;

  apreMenu() {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaClickMenu < 750) {
      return;
    }
    this.ultimaVoltaClickMenu = ora;

    this.menuVisibile = true; // !this.menuVisibile;
    this.dimeDrawer = this.schermoStretto === true ? '100%' : this.dimeDrawerAperto + 'px';
    this.chiudeDrawer2(null);
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.menuVisibile);
  }
  chiudeDrawer(e: any) {
    if (this.menuVisibile === true && this.nonChiudereDrawer === false) {
      this.menuVisibile = false;
      this.dimeDrawer = this.dimeDrawerInizio + 'px';
    }
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.menuVisibile, this.dimeDrawer);
  }
  over1() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'over1');
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
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'leave 1');
    }
  }

  apreMenu2() {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaClickMenu2 < 750) {
      return;
    }
    this.ultimaVoltaClickMenu2 = ora;

    if (this.vecchioAccordionPerExportAperto === true) {
      this.accordionApertoPerExport = true;
    } else {
      this.accordionApertoPerExport = false;
    }

    this.menuVisibile2 = true; // !this.menuVisibile2;
    this.dimeDrawer2 = this.schermoStretto === true ? '100%' : this.dimeDrawerAperto + 'px';
    this.chiudeDrawer(null);
  }
  chiudeDrawer2(e: any) {
    if (this.menuVisibile2 === true && this.nonChiudereDrawer2 === false) {
      this.menuVisibile2 = false;
      this.dimeDrawer2 = this.dimeDrawerInizio2 + 'px';

      this.accordionApertoPerExport = false;
    }
  }
  over2() {
    // if (this.menuVisibile2 === true && this.schermoStretto === false) {
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'over2');
      if (this.schermoStretto === true) {
        this.dimeDrawer2 = '100%';
      } else {
        this.dimeDrawer2 = this.dimeDrawerAperto + 'px';
      }

      if (this.vecchioAccordionPerExportAperto === true) {
        this.accordionApertoPerExport = true;
      } else {
        this.accordionApertoPerExport = false;
      }

      this.menuVisibile2 = true;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'over 2');
    // }
  }
  leave2() {
    if (this.menuVisibile2 === true && this.nonChiudereDrawer2 === false) {
      this.dimeDrawer2 = '0px';
      this.menuVisibile2 = false;
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'leave 2');

      this.accordionApertoPerExport = false;
    }
  }
  
  userManualPrint = false;

  fDownloadUserManual(e: any) {
    this.userManualPrint = true;
    const params = {
      cntx_id: this.sessionID,
      v_name: 'User Manual ITA.pdf'
    }
    this.apiService.chiamataPost('report__download', params, false)
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

  u_atob(ascii: string) {
    const uint8Array = Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
    return new Uint8Array(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
  }
  // MENU

  connettitiAMano() {
    this.collegatoDaUrl = true;
    // this.EffettuaLogin(null, null, null, environment.nomeLogin, environment.pwdLogin);
    let pwd = '';
    const p = localStorage.getItem('ANTSGUI');
    if (p !== null) {
      pwd = p;
    } else {
      const promptResult: string | null = prompt("ANTSGUI", "");
      if (promptResult === null || promptResult === '') {
        Utils.visualizzaAlert('No!');
        return;
      } else {
        pwd = promptResult;
        localStorage.setItem('ANTSGUI', pwd);
      }
    }

    this.EffettuaLogin('', environment.nomeLogin, pwd);
  }

  pulisciPassword() {
    localStorage.removeItem('ANTSGUI');
    Utils.visualizzaAlert('OK');
  }
}

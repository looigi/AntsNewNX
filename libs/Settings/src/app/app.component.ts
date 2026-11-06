import { logConsole } from './console-log';
import { environment } from './../environments/environment';
import { Component, isStandalone, OnInit } from '@angular/core';
import { ExternalHttpClient } from './settings_component/services/externalhttpclient.service';
import { ExternalSessionService } from './settings_component/services/externalsession.service';
import { ExternalApiService } from './settings_component/services/externalapi.service';
import { Utils } from './Utilities.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'settings_component';

  sessId;
  gname;
  uname;
  collegatoDaUrl = false;

  userName;
  righeSelezionatePerActSet;
  sessionID2;
  righePerPaginazioneAutomatica = -1;
  indirizzoServer2;

  constructor(
    private http: ExternalHttpClient,
    private sessionService: ExternalSessionService,
    private apiService: ExternalApiService,
    public Utils: Utils
  ) {
    this.getJSON().subscribe(data => {
      /* const b = data;

      this.Utils.indirizzoServer = b.indirizzoServer;
      this.Utils.indirizzoGEOServer = b.serverGEOServer;
      if (b.eventsDisplayedRows)  {
        this.Utils.limitPerVirtual = b.eventsDisplayedRows;
      } else {
        this.Utils.limitPerVirtual = 60;
      }

      this.Utils.linkIcone = b.linkIcone;
      this.Utils.serverPostRest = b.serverPostRest;
      if (b.Proxy.toUpperCase() === 'TRUE') {
        this.Utils.facadeServerAddress = b.facadeServerAddressViaProxy;
      } else {
        this.Utils.facadeServerAddress = b.facadeServerAddressLocale;
      }
      this.Utils.urlRoot = b.urlRoot; */

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

      this.Utils.urlRoot = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.urlRoot, true);
      this.Utils.linkIcone  = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
      // this.linkIcone = this.aggiungeIndirizzoAPathRelativo(indirizzoCaricato, b.linkIcone, true);
      let urlRootSenzaBarraFinale = urlRoot;
      if (urlRootSenzaBarraFinale.endsWith('/') && b.serverPostRest.startsWith(':')) {
        urlRootSenzaBarraFinale = urlRootSenzaBarraFinale.substring(0, urlRootSenzaBarraFinale.length - 1);
      }
      this.Utils.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRootSenzaBarraFinale, b.serverPostRest, true);
      if (b.eventsDisplayedRows)  {
        this.Utils.limitPerVirtual = b.eventsDisplayedRows;
      } else {
        this.Utils.limitPerVirtual = 60;
      }

      logConsole('Indirizzo di base 1 Settings: ', indirizzoCaricato);
      logConsole('Indirizzo di base 2 Settings: ', urlRoot);
      logConsole('Indirizzo urlRoot Settings: ', this.Utils.urlRoot);
      logConsole('Indirizzo Icone Settings: ', this.Utils.linkIcone);
      logConsole('Indirizzo PostGrest Settings: ', this.Utils.serverPostRest);
      // Nuova gestione della mail del 28/04/2026 13:16

      this.eseguiConnessione();
    });
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

  ngOnInit() {
  }

  getJSON(): Observable<any> {
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }

    return this.http.get(Utils, indirizzo);
  }

  eseguiConnessione() {
    this.collegatoDaUrl = true;

    let pwd = '';
    const p = localStorage.getItem('H7-25-AS');
    if (p !== null) {
      pwd = p;
    } else {
      pwd = prompt("H7-25-AS", "");
      if (pwd === '') {
        alert('No!');
        return;
      }  else  {
        localStorage.setItem('H7-25-AS', pwd);
      }
    }

    this.EffettuaLogin(environment.nomeLogin, pwd);
  }
  
  EffettuaLogin(userName, password) {
    const params = {
      v_city: 'Milan',
      v_client_country: 'ITA',
      v_client_public_ip: '185.142.153.241',
      v_name: userName,
      v_org: 'SUPERNAP Italia S.r.l.',
      v_password: password
    };
    this.apiService.chiamataPost(this.Utils, 'operator__login', params)
    // .map(response => response)
    .subscribe(data => {
      if (data) {
        if (data.v_err_code && data.v_err_code === 2) {
          alert(data.v_failure_reason);
        } else {
          const rr = data.err_code;

          if (rr === 0) {
            this.userName = userName;
            this.sessionID2 = data.cntx_id;
            this.loginOK(data, data.cntx_id, '');
          } else {
            alert('Connection error:' + data.v_failure_reason);
          }
        }
      } else {
      }
    }, error =>  {
      alert('Login:' + error);
    });
  }

  loginOK(dd, sessionId, groupName) {
    this.sessionService.setRemember(true);
    this.sessionService.setUser(dd);
    this.sessionService.setToken(sessionId);
    this.sessionService.setLogged(true);

    if (!this.userName || this.userName === '') {
      this.userName = 'DebugUser';
    }

    this.indirizzoServer2 = this.Utils.serverPostRest;
    // logConsole('Dati', this.Utils, this.sessionID2, this.indirizzoServer2);

    this.LeggeImpostazioni();
    this.prendeTutteLeMisure();
    this.LeggeDatiAddLayers();
    this.LeggeDatiLookUp();
    this.LeggeDatiMosaicStyle();
    this.LeggeMeasuresPR();
  }

  datiAddLayers;

  LeggeDatiAddLayers() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_category": "MapLayer"' +
    '}';
    this.apiService.chiamataPost(this.Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiAddLayers = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
          // const data = data2; // [0].geo_measure_dfn__grid);
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati add layers:', data2);
          this.datiAddLayers = data2;
        }
     } else {
        this.datiAddLayers = 'empty grid'; // null;
      }
    }, error => {
      alert('Read look up:' + error);
    });
  }

  permessiDataView;
  accordionDebug;
  frameEditorAttivo;
  exportKML;
  operatorID;
  groupName;
  microfonoAttivo;

  LeggeImpostazioni() {
    this.Utils.permessoFrameEditor = 'false';
    this.frameEditorAttivo = false;
    this.exportKML = false;
    this.accordionDebug = false;
    this.permessiDataView = new Array();

    const params = {
      cntx_id: this.sessionID2
    }
    this.apiService.chiamataPost(this.Utils, 'operator_info_my__grid', params)
    // .map(response => response)
    .subscribe(data => {
      // // const data = JSON.parse(data2);
        if (data) {
          // ExternalUtilities.checkRitornoChiamata(data);

          this.accordionDebug = false;
          const permessiDataView = new Array();

          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Operator info my grid', data.DataTable);
          data.DataTable.forEach(element => {
            // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
            switch (element.NAME) {
              case 'login_page_url':
                this.Utils.userRedirect = element.VALUE;
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
                // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redirect', element);
                break;
              case 'geo_dashboard__upd':
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato', element);
                this.accordionDebug = element.VALUE === 'Y' ? true : false;
                break;
              case 'operator_id':
                this.operatorID = element.VALUE;
                break;
              case 'operator_group_name':
                this.groupName = element.VALUE;
                break;
              case 'antsgeo_act_path_cell3d_kml':
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato', element);
                this.exportKML = element.VALUE === 'Y' ? true : false;
                break;
              case 'string_to_command':
                this.microfonoAttivo = (element.VALUE === 'Y' ? true : false);
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Microfono attivo:', element, this.microfonoAttivo);
                break;
              case 'geo_dashboard__frame_editor':
                // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovato', element);
                this.Utils.permessoFrameEditor = element.VALUE === 'Y' ? 'true' : 'false';
                this.frameEditorAttivo = element.VALUE === 'Y' ? true : false;
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
              case 'data_view_AP':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AP"});
                }
                break;
              case 'data_view_AR':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "AR"});
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
              case 'data_view_MG':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MG"});
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
              case 'data_view_MRBCIXL':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MR"});
                }
                break;
              case 'data_view_MFQ':
                if (element.VALUE === 'Y') {
                  permessiDataView.push({ NAME: "MQ"});
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
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Permesso frame editor:', this.Utilities.permessoFrameEditor);
        }
    }, error =>  {
      // ExternalUtilities.messaggioDiErroreEsterno(this, 'Login:' + error);
    // TODO alert error
    });
  }
  
  clusterGroup;
  measureData;
  caricateMeasures = false;

  LeggeMeasuresPR() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost(this.Utils, 'geo_measure_dfn__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista measure pr:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.measureData = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.measureData = data.DataTable;

          this.clusterGroup = new Array();
          this.measureData.forEach(element => {
            if (element.FOLDER === '5 Cluster') {
              this.clusterGroup.push(element);
            }
            // if (element.CODE === 'Samples') {
            //   // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
            // }
          });
          this.clusterGroup2 = JSON.parse(JSON.stringify(this.clusterGroup));

          const clustG = {
            ROW_ID: -1,
            NAME: environment.stringaClusterGlobale,
            FOLDER: 'Cluster',
            DESCRIPTION: 'Global <Cluster',
            INSERT_TIMESTAMP: '2020-01-12 21:12:44',
            UPDATE_TIMESTAMP: '2020-01-12 21:12:44',
            NET_TECH: 'ALL',
            DISPLAY_NAME: environment.stringaClusterGlobale,
            TYPE: 3,
            FILE_TYPE: 'Cluster',
            CODE: environment.stringaClusterGlobale
          }
          this.clusterGroup.push(clustG);

          logConsole('Misure', this.clusterGroup, this.measureData);
        }
      } else {
        this.measureData = 'empty grid'; // null;
      }

      setTimeout(() => {
        this.caricateMeasures = true;
      }, 100);
    }, error => {
      alert('Read Measures:' + error);
    });
  }

  settingsVisibileFlag = false;
  passaggioPerSettings = {
    Frame: undefined,
    Debug: undefined,
    tipoFrameProgetto: 'M',
    eseguitoInProgetto: undefined,
    Utils: undefined,
    sessionID: undefined,
    visibile: false,
    userName: undefined,
    NumeroFrame: undefined,
    mapName: undefined,
    Descrizione: undefined,
    MappaOGrafico: undefined,
    viewGlobal: undefined,
    mapType: undefined,
    isCheckedServingCell: undefined,
    isCheckedShowPaths: undefined,
    ConnessioneStabilita: undefined,
    measurePassato: undefined,
    isCheckedAntenne: undefined,
    slaValue: undefined,
    activity: undefined,
    geoFilter: undefined,
    plmn: undefined,
    netTech: undefined,
    bandWidth: undefined,
    slaGroup: undefined,
    measureData: undefined,
    listaEventiDaPassare: undefined,
    tabSelezionato: undefined,
    refreshMaschera: undefined,
    settaMascheraVuota: undefined,
    disabilitata: undefined,
    refreshQuanteMisure: undefined,
    countHistogram: undefined,
    checkSeverity: undefined,
    viewAs: undefined,
    overlay: undefined,
    overlayCluster: undefined,
    timeFilter: undefined,
    bboxOverViewZoom: 1,
    tipoDataset: 1,
    clusterGroup: undefined,
    datiSLA: undefined,
    datiSlaDT: undefined,
    //  datiPivot: undefined,
    designInfo: undefined,
    frameAttivo: undefined,
    HistDisplayAs: undefined,
    HistDisplayTutto: undefined,
    columnsBars: undefined,
    doubleGraph: undefined,
    showPlanimetry: undefined,
   //  columnsSettings: undefined,
    tipoEvento: undefined,
   //  eventiSceltiES: undefined,
    fixedSeconds1: undefined,
    styleSizes: undefined,
    styleImpostato: undefined,
    cellType: undefined,
    datiLookUp: undefined,
    datiAddLayers: undefined,
    addLayers: undefined,
    opacity: undefined,
    shownEvents: undefined,
    modificaChart: undefined,
    ShowRays: undefined,
    showMeasures: undefined,
    showCoverageMeasures: undefined,
    showVoiceCallMeasures: undefined,
    showDataMeasures: undefined,
    showSamplesMeasures: undefined,
    squareMeters: undefined,
    measureType: undefined,
    datiMosaicStyle: undefined,
    mosaicStyle: undefined,
    SartPosition: undefined,
    measureSMS: undefined,
    showMeasuresS: undefined,
    numeroActSetVisibili: undefined,
    progettoEsterno: '',
    mappeStyle: undefined,
    mappeMS: undefined,
    ClusterMeasure: undefined,
    ClusterMeasure2: undefined,
   //  Lov: undefined,
    TextFilter: undefined,
    TextFilter2: undefined,
   //  TextLov: undefined,
    addGlobalLayer: undefined,
    measureRCM: undefined,
    eventsMeasure: undefined,
    showRaysAllLayer: undefined,
    permessiDataView: undefined,
    staDisegnandoSMS: undefined,
    righePerPaginazioneAutomatica: -1,
    indirizzoServer: undefined,
    Correlation: undefined,
    isNonSyncEventTime: undefined,
    showAxisX: undefined,
    heightChart: undefined,
    misureAddizionaliTCRUNP: undefined,
    Log: undefined,
    listaCampiAttuale: undefined,
    act_set: undefined,
    tmsMin: undefined,
    tmsMax: undefined,
    tmsSelezionato: undefined,
    tmsGlobaleMin: undefined,
    tmsGlobaleMax: undefined,
    dashboardAttiva: undefined,
    tipoDatiLayout: undefined,
    showAdditionalLayers: undefined,
    measureDataCompleti: undefined,
    viewModeMS: undefined,
    isStandAloneMR: undefined
  };
  
  /* measureData = '[' +
    '{"ROW_ID":10,"FOLDER":"1 Coverage","DESCRIPTION":"Absolute Radio Frequency Channel Number: it\'s a decimal integer number","INSERT_TIMESTAMP":"2019-09-23T00:00:00+00:00","UPDATE_TIMESTAMP":"2024-04-10T01:00:00+00:00","NET_TECH":"2G","DISPLAY_NAME":"ARFCN","TYPE":"2","TYPE_STR":"list","FILE_TYPE":"Act_Coverage","MEASR_CODE":"act_coverage_arfcn","CODE":"act_coverage_arfcn"}, ' +
    '{"ROW_ID":76,"FOLDER":"1 Coverage","DESCRIPTION":"Radio Frequency (MHZ): 700, 800, 850, 900, ... , 2600","INSERT_TIMESTAMP":"2020-11-24T14:33:48+00:00","UPDATE_TIMESTAMP":"2024-04-10T01:00:00+00:00","NET_TECH":"2G,3G,4G,5G(NSA)","DISPLAY_NAME":"Band Frequency PCell [Mhz]","TYPE":"2","TYPE_STR":"list","FILE_TYPE":"Act_Coverage","MEASR_CODE":"act_coverage_frequency","CODE":"act_coverage_frequency"}, ' +
    '{"ROW_ID":77,"FOLDER":"1 Coverage","DESCRIPTION":"Radio Frequency (MHZ): 700, 800, 850, 900, ... , 2600","INSERT_TIMESTAMP":"2020-11-24T14:33:48+00:00","UPDATE_TIMESTAMP":"2024-04-10T01:00:00+00:00","NET_TECH":"2G,3G,4G,5G(NSA)","DISPLAY_NAME":"Band Frequency PSCell [Mhz]","TYPE":"2","TYPE_STR":"list","FILE_TYPE":"Act_Coverage","MEASR_CODE":"act_coverage_frequency_pscell","CODE":"act_coverage_frequency_pscell"}, ' +
    '{"ROW_ID":78,"FOLDER":"1 Coverage","DESCRIPTION":"Radio Frequency (MHZ): 700, 800, 850, 900, ... , 2600","INSERT_TIMESTAMP":"2020-11-25T12:10:00+00:00","UPDATE_TIMESTAMP":"2024-04-10T01:00:00+00:00","NET_TECH":"2G,3G,4G,5G(NSA)","DISPLAY_NAME":"Band Frequency SCell1 [Mhz]","TYPE":"2","TYPE_STR":"list","FILE_TYPE":"Act_Coverage","MEASR_CODE":"act_coverage_frequency_scell1","CODE":"act_coverage_frequency_scell1"}, ' +
    '{"CODE": "struct_partition_label", "DESCRIPTION": "Partition Label attributed to Act, to create free partition criteria, based on the mode and intent the acivity was executed, e.g. Before/After a network upgrade, Ericsson / Nokia /Huaway for manufacturedr comparison, VO / TIM / WIND for operator benchmarking", "DISPLAY_NAME": "Partition Label", "FILE_TYPE": "Struct", "FOLDER": "9 Test", "INSERT_TIMESTAMP": "2019-12-10T00:00:00+00:00", "MEASR_CODE": "struct_partition_label", "NET_TECH": "", "ROW_ID": 7838, "TYPE": "3", "TYPE_STR": "str", "UPDATE_TIMESTAMP": "2000-01-01T00:00:00+00:00"} ' +
  ']'; */
  misureDaPassare = ['', 'act_coverage_arfcn', 'act_geoposition_speed', 'global_measure', 'W Pippo', 'W Pippetto'];
  listaEventiDaPassare = [{"ROW_ID":824,"FOLDER":"MobiAnts","EVENT_TYPE":"TcRun_Outcome","DISPLAY_NAME":"TcRun_Outcome","CELLULAR_SYSTEM":" ","RECORD_STATE":" ","TOOLS":" ","DESCRIPTION":" ","FILE_TYPE":"MobiAnts","BACKCOLOR":"#FFFFFF","FORECOLOR":"#000000","ICON":"circle","INSERT_TIMESTAMP":"2020-04-14 10:52:42","UPDATE_TIMESTAMP":" "}];

  mappeStyle: any[] = [
    { id: 1, name: 'Band' },
    { id: 2, name: 'Line' },
    { id: 3, name: 'Coaxial' },
  ];

  cellTypes = '[{"ROW_ID": 6, "VALUE_STR": "SCell 1"},{"ROW_ID": 7, "VALUE_STR": "SCell 2"},{"ROW_ID": 8, "VALUE_STR": "SCell 3"},{"ROW_ID": 9, "VALUE_STR": "SCell 4"},{"ROW_ID": 1, "VALUE_STR": "Active"},{"ROW_ID": 10, "VALUE_STR": "Serving"}]';
  
  apreSettings() {
    // this.settingsVisibile = 'OK';
    this.passaggioPerSettings = {
      Debug: false,
      Utils: this.Utils,
      MappaOGrafico: 'M',
      tipoFrameProgetto: 'M',
      permessiDataView: this.permessiDataView,
      NumeroFrame: 1,
      frameAttivo: 1,
      userName: 'Looigi',
      sessionID: this.sessionID2,
      numeroActSetVisibili: 1,
      measureData: undefined, // JSON.parse(this.measureData),
      eventsMeasure: false,
      tipoEvento: 'L',
      listaEventiDaPassare: this.listaEventiDaPassare,
      ConnessioneStabilita: 'OK',
      mapName: 'Point Cell List',
      activity: 1,
      viewGlobal: true,

      Frame: undefined,
      eseguitoInProgetto: false,
      visibile: false,
      Descrizione: '',
      mapType: 2,
      isCheckedServingCell: null,
      isCheckedShowPaths: true,
      measurePassato: this.misureDaPassare,
      isCheckedAntenne: null,
      slaValue: -1,
      geoFilter: '0',
      plmn: null,
      netTech: null,
      bandWidth: true,
      slaGroup: undefined,
      tabSelezionato: 0,
      refreshMaschera: false,
      settaMascheraVuota: true,
      disabilitata: false,
      refreshQuanteMisure: true,
      countHistogram: null,
      checkSeverity: false,
      viewAs: 2,
      overlay: 'global_measure',
      overlayCluster: 'cluster_cluster_prov2011',
      timeFilter: 'Time Range',
      bboxOverViewZoom: 1,
      tipoDataset: 1,
      clusterGroup: this.clusterGroup2,
      datiSLA: undefined,
      datiSlaDT: undefined,
      //  datiPivot: undefined,
      designInfo: false,
      HistDisplayAs: ['', '', 'N6', 'S0', ''],
      HistDisplayTutto: ['', '', 'N3', 'S0', ''],
      columnsBars: "2",
      doubleGraph: false,
      showPlanimetry: false,
     //  columnsSettings: undefined,
     //  eventiSceltiES: undefined,
      fixedSeconds1: null,
      styleSizes: [{ id: 1, name: 1 }, { id: 2, name: 2 }, { id: 3, name: 3 }],
      styleImpostato: 3,
      cellType: this.cellTypes,
      datiLookUp: this.datiLookUp,
      datiAddLayers: this.datiAddLayers,
      addLayers: null,
      opacity: 20,
      shownEvents: true,
      modificaChart: null,
      ShowRays: false,
      showMeasures: true,
      showCoverageMeasures: false,
      showVoiceCallMeasures: false,
      showDataMeasures: false,
      showSamplesMeasures: undefined,
      squareMeters: null,
      measureType: null,
      datiMosaicStyle: this.datiMosaicStyle,
      mosaicStyle: 's_geo_measr_mosaic_samples',
      SartPosition: true,
      measureSMS: 'act_geoposition_speed',
      showMeasuresS: null,
      progettoEsterno: '',
      mappeStyle: this.mappeStyle,
      mappeMS: null,
      ClusterMeasure: 'struct_partition_label',
      ClusterMeasure2: 'struct_partition_label',
     //  Lov: undefined,
      TextFilter: 'Prova1', // '<GLOBAL PARTITION LABEL>',
      TextFilter2: 'Prova2', // '<GLOBAL PARTITION LABEL>',
     //  TextLov: undefined,
      addGlobalLayer: false,
      measureRCM: 'act_geoposition_speed',
      showRaysAllLayer: true,
      staDisegnandoSMS: undefined,
      righePerPaginazioneAutomatica: -1,
      indirizzoServer: undefined,
      Correlation: '',
      isNonSyncEventTime: false,
      showAxisX: true,
      heightChart: 'X1',
      misureAddizionaliTCRUNP: ['', 'Event:tc_run_outcome_all>{o,voice_dropped_call_l3}','Event:tc_run_outcome_all>{o,cst_l3}', 'Event:tc_run_outcome_all>{o,voice_setup_l3}','Event:tc_run_outcome_all>{o,nsa_5g_nr_leg_setup_l3}', '', ''],
      Log: undefined,
      listaCampiAttuale: undefined,
      act_set: undefined,
      tmsMin: undefined,
      tmsMax: undefined,
      tmsSelezionato: undefined,
      tmsGlobaleMin: undefined,
      tmsGlobaleMax: undefined,
      dashboardAttiva: 597221,
      tipoDatiLayout: 3,
      showAdditionalLayers: true,
      measureDataCompleti: this.measureDataCompleti,
      viewModeMS: '',
      isStandAloneMR: false
    };

    this.settingsVisibileFlag = true;
  }

  chiudeSettings(e) {
    const tm = setTimeout(() => {
      this.settingsVisibileFlag = false;
    }, 1000);
  }

  misureCambiate(e) {
    logConsole('Misure cambiate', e);
    this.misureDaPassare = e;
  }

  viewAsEmit(e) {
    logConsole('View as cambiato', e);
  }

  geoFilterEmit(e) {
    logConsole('Geo filter cambiato', e);
  }

  squareMetersEmit(e) {
    logConsole('Square Meters cambiato', e);
  }

  listaEventi(e) {
    logConsole('Eventi ripassati', e);
    this.listaEventiDaPassare = e;
  }

  selectTipoMappa1(e) {
    logConsole('Tipo mappa', e);
  }

  measureDataCompleti;
  clusterGroup2;

  prendeTutteLeMisure() {
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_filter_folder": "", ' +
      '"v_filter_display_name": ""' +
    '}';
    // logConsole('Query misura', JSON.parse(params));
    this.apiService.chiamataPost(this.Utils, 'geo_measure_dfn__grid', params)
    // .map(response => response)
    .subscribe(data => {
      if (data && data.DataTable && data.DataTable.length > 0) {
        logConsole('Prende tutte le misure', data.DataTable);
        this.measureDataCompleti = data;

        const clusterGroup = new Array();
        this.measureDataCompleti.DataTable.forEach(element => {
          if (element.FOLDER === '5 Cluster') {
            clusterGroup.push(element);
          }
        });
        this.clusterGroup2 = JSON.parse(JSON.stringify(clusterGroup));

        const clustG = {
          ROW_ID: -1,
          NAME: environment.stringaClusterGlobale,
          FOLDER: 'Cluster',
          DESCRIPTION: 'Global <Cluster',
          INSERT_TIMESTAMP: '2020-01-12 21:12:44',
          UPDATE_TIMESTAMP: '2020-01-12 21:12:44',
          NET_TECH: 'ALL',
          DISPLAY_NAME: environment.stringaClusterGlobale,
          TYPE: 3,
          FILE_TYPE: 'Cluster',
          CODE: environment.stringaClusterGlobale
        }
        this.clusterGroup2.push(clustG);

        logConsole('Cluster group', this.clusterGroup2);
      }
    });
  }

  datiLookUp;

  LeggeDatiLookUp() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_category": "cell_type"' +
    '}';
    this.apiService.chiamataPost(this.Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      // // const data2 = JSON.parse(data);
      // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiLookUp = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.datiLookUp = data;
        }
      } else {
        this.datiLookUp = 'empty grid'; // null;
      }
    }, error => {
      alert('Read look up:' + error);
    });
  }

  datiMosaicStyle;

  LeggeDatiMosaicStyle() {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure mosaic style');
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_category": "mosaic_style"' +
    '}';
    this.apiService.chiamataPost(this.Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      // // const data2 = JSON.parse(data);
      // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiMosaicStyle = 'empty grid'; // null;
          alert(data2.v_failure_reason);
        } else {
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mosaic Style:', data);
          this.datiMosaicStyle = data;
        }
      } else {
        this.datiMosaicStyle = 'empty grid'; // null;
      }
    }, error => {
      alert('Read look up:' + error);
    });
  }

  viewMode(e) {
    logConsole('View mode cambiato', e);
  }
}

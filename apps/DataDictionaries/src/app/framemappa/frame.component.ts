import { logConsole } from '../console-log';
import { DatePipe } from '@angular/common';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { environment } from '../../environments/environment';
import { Component, Input, OnInit, OnChanges, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FrameUtils } from './Utilities.component';
import Utils from '../Utilities.component';
import { fromLonLat } from 'ol/proj';
import OlView from 'ol/View';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  templateUrl: 'frame.component.html',
  selector: 'app-frame-dd',
  styleUrls: ['./frame.component.css']
})

export class InternalFrameComponent implements OnInit, OnChanges {
  @Input() indirizzoServer;
  @Input() debug;
  @Input() userName;
  @Input() sessioneID;
  @Input() UtilityPassata;
  @Input() refreshMappa;
  @Input() activitySetName;
  @Input() activitySetID;
  @Input() refresh = false;
  @Input() agnGroupId;
  @Input() agnGroup;
  @Input() actSetNameFM;
  @Input() centraMappa;
  @Input() stringaAGNoACTp;
  @Input() lastDays = 10;
  @Input() nomeProgetto;
  @Input() nomeAntennaDD;
  @Input() nomeClusterDD;
  @Input() parametriDD;
  @Input() additionalLayer;
  @Input() cellaSelezionata;
  @Input() timeRangeDSFStart;
  @Input() timeRangeDSFStop;
  @Input() addLayerDiretto;
  @Input() slaValueGlobale;
  @Input() datiSla;
  @Input() datiSlaDT;
  @Input() ricaricaRaggi;
  @Input() lastSelectedLayer;
  @Input() refreshLegenda;
  @Input() exportKMLAttivo;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() pulisceLastCallAddLayers;
  @Input() opacity = 50;
  @Input() antenne = 1;
  @Input() viewAs = 3;
  @Input() setAntenna;
  @Input() permessoFMAM;
  @Input() tipoFrame = 'M';

  @Output() coordinateDaClickSuMappa: EventEmitter<any> = new EventEmitter<any>();
  @Output() opacityEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() ricaricaRaggiEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() passaggioValoriLegenda: EventEmitter<any> = new EventEmitter<any>();
  @Output() cambioBBoxEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() stringaRitornoEmit: EventEmitter<string> = new EventEmitter<string>();

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    // Chiude le sottoscrizioni con takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  eseguitoInProgetto = false;

  // VARIABILI FRAME
  timeRangeDSFStop2;
  ActivitySetName;
  ActivitySetID;
  ActivitySetName2;
  ActivitySetID2;
  impostazioni;
  ConnessioneStabilita = '';
  refreshMap = [ false ];
  Utilities = FrameUtils;
  // UtilityInterna = FrameUtils;

  tipoFrame2 = 'M';
  permessoFMAM2;

  accordionDebug = true;
  frameEditorAttivo = true;
  opacity2 = 50;
  antenne2 = 1;

  slaGroup = undefined;
  activityName;
  refreshMaschera = [ false ];
  refreshDaTasto = false;
  measureData = undefined;
  clusterGroup;
  clusterGroup2;
  isVisibileBars = false;
  calcolaCentro = false;
  tmsSelezionatoPerGrafico = [''];
  resettaValoriFrame = false;
  listaActivitySets;
  settaMascheraVuota = false;
  mapTypeS = -1;
  refreshQuanteMisure = false;
  ridisegnaTutto = null;
  listaActivitySetsordinate;
  coordinateConClick;
  rotation;
  isSyncTms = false;
  // datiSlaDTi;
  // datiSLA;
  numeroFrame = 0;
  frameAttivo = undefined;
  mapTypeG;
  overlayClusterG = '';
  designInfo = [false];
  nomiFrames = ['Frame 01'];
  dashboardSelezionata;
  espandiTreeView = [undefined];
  collassaTreeView = [undefined];
  copyAllClips = [undefined];
  stringaAGNoACT = ['', '', '', '', ''];
  cambiatoAGNACTDopoScelta = [''];
  datiActivitySet;
  coordinate;
  ultimoCSV = '';
  centroAttuale = [''];
  styleSizes = [
    { id: -1, name: '<Global Style Size>'},
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 6, name: '6' },
    { id: 12, name: '12' },
    { id: 16, name: '16' },
    { id: 20, name: '20' },
  ];
  styleSizes2 = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 6, name: '6' },
    { id: 12, name: '12' },
    { id: 16, name: '16' },
    { id: 20, name: '20' },
  ];
  styleSizeG = 12;
  datiLookUp;
  datiAddLayers;
  datiMosaicStyle;
  massimizzata = [ false];
  notebook;
  newarray = [[]];
  MappaOGraficoTutti;
  csvView = new Array();
  mediaLon;
  mediaLat;
  measureData2;
  caricataMappa = false;
  creaNuovoImpostazioni = true;
  agnGroupId2;
  agnGroup2;
  actSetNameFM2;
  bboxO;
  bboxZ;
  rigaMG;
  impostaCentro;
  numeroActSetVisibili = 1;
  lastDays2 = 10;
  nomeAntennaDD2;
  nomeClusterDD2;
  nomeProgetto2;
  parametriDD2;
  impostaValoriMascheraProgetto = false;
  additionalLayer2;
  additionalLayerDiretto;
  slaValueGlobale2;
  datiSLA2;
  datiSlaDT2;
  refreshLegenda2;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private sessionService: SessionService,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.creaStrutturaJsonImpostazioni();
  }

  ngOnChanges(r) {
    if (r.refreshLegenda) {
      if (r.refreshLegenda.currentValue) {
        this.refreshLegenda2 = r.refreshLegenda.currentValue;
        this.UtilityPassata.scriveLog('Refresh legenda', this.refreshLegenda2);
      }
    }

    if (r.sessioneID) {
      if (r.sessioneID.currentValue) {
        // this.UtilityPassata.scriveLog('Arrivata nuova sessione', r.sessioneID.currentValue);
        this.LeggeSlaGroupPR();
        this.LeggeMeasuresPR();
        // this.LeggeSLADataPR();
        this.LeggeActivitySetPR();
        this.LeggeDatiMosaicStyle();
        this.LeggeDatiAddLayers();
        this.LeggeDashboard(0);
        // this.creaNuovoImpostazioni = false;
      }
    }

    if (r.datiSLA) {
      this.datiSLA2 = r.datiSLA.currentValue;
      if (this.debug === true) {
        // this.UtilityPassata.scriveLog('Dati SLA', this.datiSLA2);
      }
    }

    if (r.timeRangeDSFStop) {
      this.timeRangeDSFStop2 = r.timeRangeDSFStop.currentValue;
      if (this.debug === true) {
        this.UtilityPassata.scriveLog('timeRangeDSFStop', this.timeRangeDSFStop2);
      }
    }

    if (r.datiSlaDT) {
      this.datiSlaDT2 = r.datiSlaDT.currentValue;
      if (this.debug === true) {
        // this.UtilityPassata.scriveLog('Dati SLA DT', this.datiSlaDT2);
      }
    }

    if (r.opacity) {
      this.opacity2 = r.opacity.currentValue;
      // this.impostazioni.opacity[0][0] = this.opacity2;
      // this.UtilityPassata.scriveLog('Cambio opacity', this.opacity2);
      if (this.debug === true) {
        // this.UtilityPassata.scriveLog('Dati SLA DT', this.datiSlaDT2);
      }
    }

    if (r.antenne && r.antenne.currentValue) {
      this.antenne2 = r.antenne.currentValue;
      this.UtilityPassata.scriveLog('Cambio antenne', this.antenne2);
      // if (this.debug === true) {
        // this.UtilityPassata.scriveLog('Dati SLA DT', this.datiSlaDT2);
      // }
    }

    if (r.agnGroupId) {
      this.agnGroupId2 = r.agnGroupId.currentValue;
      // this.UtilityPassata.scriveLog('AGN Group id:', this.agnGroupId2);
    }

    if (r.agnGroup) {
      this.agnGroup2 = r.agnGroup.currentValue;
      // this.UtilityPassata.scriveLog('AGN Group:', this.agnGroup2);
      // this.calcolaCentro = !this.calcolaCentro;
    }

    if (r.slaValueGlobale) {
      this.slaValueGlobale2 = r.slaValueGlobale.currentValue;
      // this.UtilityPassata.scriveLog('slaValueGlobale:', this.slaValueGlobale2);
      // this.calcolaCentro = !this.calcolaCentro;
    }

    if (r.additionalLayer) {
      this.additionalLayer2 = r.additionalLayer.currentValue;
      // this.UtilityPassata.scriveLog('Additional layer:', this.additionalLayer2);
    }

    if (r.addLayerDiretto) {
      this.additionalLayerDiretto = r.addLayerDiretto.currentValue;
      // this.UtilityPassata.scriveLog('Additional layer diretto:', this.additionalLayerDiretto);
    }

    if (r.lastDays) {
      this.lastDays2 = r.lastDays.currentValue;
      // this.UtilityPassata.scriveLog('lastDays:', this.lastDays2);
    }

    if (r.nomeProgetto) {
      this.nomeProgetto2 = r.nomeProgetto.currentValue;
      // this.UtilityPassata.scriveLog('nomeProgetto:', this.nomeProgetto2);
    }

    if (r.actSetNameFM) {
      this.actSetNameFM2 = r.actSetNameFM.currentValue;
      // this.UtilityPassata.scriveLog('Act Set Name:', this.actSetNameFM);
    }

    if (r.tipoFrame) {
      if (r.tipoFrame.currentValue) {
        this.tipoFrame2 = r.tipoFrame.currentValue;
        this.creaJsonImpostazioni();
      }
    }

    if (r.permessoFMAM) {
      this.permessoFMAM2 = r.permessoFMAM.currentValue;
      // this.UtilityPassata.scriveLog('Permesso fleet manager:', this.permessoFMAM2);
    }

    if (r.nomeAntennaDD) {
      this.nomeAntennaDD2 = r.nomeAntennaDD.currentValue;
      // this.UtilityPassata.scriveLog('nome Antenna DD:', this.nomeAntennaDD2);
    }

    if (r.nomeClusterDD) {
      this.nomeClusterDD2 = r.nomeClusterDD.currentValue;
      this.UtilityPassata.scriveLog('nome Cluster DD:', this.nomeClusterDD2);
    }

    if (r.stringaAGNoACTp) {
      this.stringaAGNoACT[1] = r.stringaAGNoACTp.currentValue;
      // this.UtilityPassata.scriveLog('Stringa passata AGN o ACT', this.stringaAGNoACT);
    }

    if (r.parametriDD) {
      if (r.parametriDD.currentValue) {
        this.parametriDD2 = r.parametriDD.currentValue;
      }
      this.UtilityPassata.scriveLog('Parametri passati', this.parametriDD2);
    }

    if (r.UtilityPassata) {
      if (r.UtilityPassata.currentValue) {
        // this.UtilityPassata.scriveLog('Utility passata');
        this.Utilities.indirizzoServer = r.UtilityPassata.currentValue.indirizzoServer;
        this.Utilities.indirizzoGEOServer = r.UtilityPassata.currentValue.indirizzoGEOServer;
        this.Utilities.linkIcone = r.UtilityPassata.currentValue.linkIcone;
        this.Utilities.serverPostRest = r.UtilityPassata.currentValue.serverPostRest;
        // this.Utilities.facadeServerAddress = r.UtilityPassata.currentValue.facadeServerAddress;
        this.Utilities.serverGEOServer = r.UtilityPassata.currentValue.serverGEOServer;
      }
    }

    if (r.refreshMappa) {
      // this.UtilityPassata.scriveLog('Refresh mappa');
      this.refreshMap[0] = !this.refreshMap[0];
      this.refreshMaschera[0] = !this.refreshMaschera[0];
    }

    if (r.activitySetID && r.activitySetID.currentValue) {
      this.ActivitySetID = r.activitySetID.currentValue;
      this.ActivitySetID2 = this.ActivitySetID;
      this.refreshMap[0] = !this.refreshMap[0];
      this.refreshMaschera[0] = !this.refreshMaschera[0];
      // this.UtilityPassata.scriveLog('Refresh set ID', this.ActivitySetID);

      if (this.ActivitySetID2 && this.ActivitySetName2 && this.caricataMappa === false) {
        // // this.UtilityPassata.scriveLog('Ricarico mappa');
        this.caricataMappa = true;
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.LeggeDashboard(0);
        }, 100);
      }
    }

    if (r.activitySetName && r.activitySetName.currentValue) {
      this.ActivitySetName = r.activitySetName.currentValue;
      this.ActivitySetName2 = this.ActivitySetName;
      this.refreshMap[0] = !this.refreshMap[0];
      this.refreshMaschera[0] = !this.refreshMaschera[0];
      // this.UtilityPassata.scriveLog('Refresh set NAME', this.ActivitySetName);

      if (this.ActivitySetID2 && this.ActivitySetName2 && this.caricataMappa === false) {
        // // this.UtilityPassata.scriveLog('Ricarico mappa');
        this.caricataMappa = true;
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.LeggeDashboard(0);
        }, 100);
      }
    }

    if (r.centraMappa) {
      if (r.centraMappa.currentValue) {
        const c = r.centraMappa.currentValue.split(';');
        const cc = c[0];
        this.impostaCentro = cc.replace('POINT(', '').replace(')', '') + '§' + new Date();
        // this.UtilityPassata.scriveLog('Nuovo centro impostato', this.impostaCentro);
      }
    }
  }

  LeggeDatiAddLayers() {
    // // this.UtilityPassata.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "MapLayer"' +
    '}';
    this.apiService.chiamataPost('geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // // this.UtilityPassata.scriveLog('Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        // // this.UtilityPassata.scriveLog('Lookup:', data2);
        // const data = data2; // [0].geo_measure_dfn__grid);
        // // this.UtilityPassata.scriveLog('Mesaures:', data);
        const datiAddLayers = data2;

        const a = new Array();
        datiAddLayers.DataTable.forEach(element => {
          if (element.VALUE_STR.indexOf('GLOBAL') === -1) {
            a.push(element);
          }
        });
        this.datiAddLayers = data2;
        this.datiAddLayers.DataTable = a;
        // // this.UtilityPassata.scriveLog('Dati Add Layers:', this.datiAddLayers);

      } else {
        this.datiAddLayers = 'empty grid'; // null;
      }
    }, error => {
      // alert('Read look up:' + error);
    });
  }

  LeggeDatiMosaicStyle() {
    // // this.UtilityPassata.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "mosaic_style"' +
    '}';
    this.apiService.chiamataPost('geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // // this.UtilityPassata.scriveLog('Lista lookup:', data2);
      if (data2 && data2 !== null) {
        // // this.UtilityPassata.scriveLog('Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // // this.UtilityPassata.scriveLog('Mosaic Style:', data);
        this.datiMosaicStyle = data;
     } else {
        this.datiMosaicStyle = 'empty grid'; // null;
      }
    }, error => {
      // Utils.messaggioDiErrore(this.datiMosaicStyle, error);
      this.datiMosaicStyle = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  LeggeDashboard(q) {
    if (q === -1) { return; }

    // // this.UtilityPassata.scriveLog('Leggo dashboard');
    if (this.creaNuovoImpostazioni === true) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.creaJsonImpostazioni();
      }, 1000);
      return;
    }

    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '"' +
    '}';
    // // this.UtilityPassata.scriveLog('Leggo dashboard 2', params);
    this.apiService.chiamataPost('geo_dashboard__sel?id=eq.' + q, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // // this.UtilityPassata.scriveLog('Leggo dashboard ritorno', data2);
      if (data2 && data2 !== null) {
        if (data2[0]) {
          if (data2[0].config_json && data2[0].config_json !== null) {
            let imp = data2[0].config_json;
            imp = this.Utilities.sistemaStringaLettaDaDB(imp);

            const imp2 = JSON.parse(JSON.parse(JSON.stringify(imp)));
            // if (imp2 === null || (imp2 !== null && typeof(imp2.FiltroAntenna) === 'undefined')) {
            this.ConnessioneStabilita = 'OK';
            this.impostazioni = imp2;
            // this.UtilityPassata.scriveLog(JSON.stringify(imp2));

            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.measureData2 = this.measureData;

              this.ActivitySetName2 = this.ActivitySetName;
              this.ActivitySetID2 = this.ActivitySetID;

              // this.calcolaCentro = true;
              this.Utilities.premutoReposition = true;
            }, 1000);
            // } else {
            //   this.creaJsonImpostazioni();
            // }
          } else {
            this.creaJsonImpostazioni();
          }
        } else {
          this.creaJsonImpostazioni();
        }
      } else {
        this.creaJsonImpostazioni();
      }
    }, error => {
        console.warn(error);
    });
  }

  LeggeActivitySetPR() {
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": "<RECENT>"' +
    '}';
    this.apiService.chiamataPost('geo_act_set__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // // this.UtilityPassata.scriveLog(data2);
      if (data2 && data2 !== null) {
        const data = data2; // [0].geo_act_set__grid);
      // if (data === undefined) { data = null; }
      // if (data.RESULT && data.RESULT[0].message.toUpperCase() === 'OK') {
        // // this.UtilityPassata.scriveLog('Activities', data.DataTable);
        this.datiActivitySet = data.DataTable;
      } else {
        // Utils.messaggioDiErrore(this, data.RESULT[0].message);
        this.datiActivitySet = 'empty';
      }
    }, error => {
        console.warn(error);
        this.datiActivitySet = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  LeggeSlaGroupPR() {
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_category: 'SlaFolder'
    };
    // // this.UtilityPassata.scriveLog('geo_lookup__sel 3', new Date().getTime());
    const slaGroup = new Array();
    this.apiService.chiamataPost('geo_lookup__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data2 = JSON.parse(data);
      Utils.checkRitornoChiamata(this, data);
      // // this.UtilityPassata.scriveLog('Ritorno:', data);
      let c = 1;
      data.forEach(element => {
        const d = {
          ROW_ID: c,
          CATEGORY: params.v_category,
          VALUE_STR: element.value_str
        };
        slaGroup.push(d);
        c++;
      });
      this.slaGroup = slaGroup;
    }, error => {
      Utils.messaggioDiErrore('null', error);
    });
  }

  /* LeggeSLADataPR() {
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost('geo_sla__grid', params)
    // .map(response => response.json())
    .subscribe(data2 => {
      // // this.UtilityPassata.scriveLog('Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        // // this.UtilityPassata.scriveLog('SLA:', data2);
        const data = data2;
        // // this.UtilityPassata.scriveLog(this.datiSLA);
        this.datiSLA = data;
        this.datiSlaDT = data.DataTable;
        this.datiSlaDTi = JSON.parse(JSON.stringify(data.DataTable));

        const slaG = {
          ROW_ID: 1,
          ID: -1,
          NAME: environment.stringaGlobalSettingSLA,
          OPERATOR_NAME: 'Maintenance',
          GROUP_NAME: 'root',
          DESCRIPTION: 'Global settings',
          FOLDER: 'Global',
          INSERT_TIMESTAMP: '2020-01-17 06:42:35',
          UPDATE_TIMESTAMP: '2020-01-17 06:42:35',
        };
        // this.datiSLA.DataTable.push(slaG);
        this.datiSlaDT.push(slaG);
        // // this.UtilityPassata.scriveLog('Sla data:', this.datiSlaDT, this.slaValueGlobale);

        // this.pulisceFiltroSLA = !this.pulisceFiltroSLA;
        if (this.slaValueGlobale === undefined) {
          this.slaValueGlobale = 0;
        }
      } else {
        this.datiSLA = null;
        this.datiSlaDT = 'empty grid';
        // this.pulisceFiltroSLA = !this.pulisceFiltroSLA;
      }
    }, error => {
      Utils.messaggioDiErrore(this, error);
    });
  } */

  LeggeMeasuresPR() {
    // // this.UtilityPassata.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost('geo_measure_dfn__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // // this.UtilityPassata.scriveLog('Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        Utils.checkRitornoChiamata(this, data2);
        // // this.UtilityPassata.scriveLog('Mesaures:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // // this.UtilityPassata.scriveLog('Mesaures:', data);
        this.measureData = data.DataTable;

        this.clusterGroup = new Array();
        this.measureData.forEach(element => {
          if (element.FOLDER === 'Cluster') {
            this.clusterGroup.push(element);
          }
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
        };
        this.clusterGroup.push(clustG);

        // // this.UtilityPassata.scriveLog(this.clusterGroup);
      } else {
        this.measureData = 'empty grid'; // null;
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Read Measures:' + error);
    });
  }

  csvImpostato(n, e) {
    if (this.ultimoCSV === JSON.stringify(e)) {
      return;
    }
    this.ultimoCSV = JSON.stringify(e);
    const vals = e.split(';');
    // this.UtilityPassata.scriveLog('CSV Impostato:', n, vals);
    let ok = true;
    let qq = '';

    const minLat: number = vals[1];
    const minLng: number = vals[2];
    const maxLat: number = vals[3];
    const maxLng: number = vals[4];

    this.csvView.forEach(element => {
      // // this.UtilityPassata.scriveLog(element, vals[0]);
      if (element.indexOf(vals[0]) > -1) {
        element = vals[0];
        qq = element;
        ok = false;
      }
    });
    if (ok) {
      this.csvView.push(e);
    }
    // // this.UtilityPassata.scriveLog(n, vals, this.csvView);

    this.mediaLon = (+maxLng + +minLng) / 2;
    this.mediaLat = (+maxLat + +minLat) / 2;
    // // this.UtilityPassata.scriveLog(maxLng, minLng, this.mediaLon);
    // // this.UtilityPassata.scriveLog(maxLat, minLat, this.mediaLat);

    // this.extent = transformExtent([ minLat, maxLat, minLng, maxLng ], 'EPSG:4326', 'EPSG:4326');

    // const f = 1;
    // // this.UtilityPassata.scriveLog('Imposto viste:', this.impostazioni.currZoom);

    // const viewG = new Array();
    // const viewL = new Array();

    /* let qG = -1;
    let qL = -1;
    let zoomLocale = 10;
    let zoomGlobale = 10;

    for (let f = 1; f <= environment.quantiSottoFrames; f++) {
      for (let i = 1; i <= environment.quantiFrames; i++) {
        if (qG === -1) {
          if (this.impostazioni.overviewZoom[f][i] === true) {
            qG = i;
          }
        }
        if (qL === -1) {
          if (this.impostazioni.overviewZoom[f][i] === false) {
            qL = i;
          }
        }
      }

      if (qG > -1) {
        zoomGlobale = this.impostazioni.currZoom[f][qG];
      }
      if (qL > -1) {
        zoomLocale = this.impostazioni.currZoom[f][qL];
      }
    }
    // // this.UtilityPassata.scriveLog('Zooms:', zoomGlobale, qG, zoomLocale, qL);

    // for (let i = 0; i < 5; i++) { */
    const viewG = new OlView({
      center: fromLonLat([+this.mediaLon, +this.mediaLat]),
      zoom: this.impostazioni.currZoom[this.frameAttivo][n]
      // zoom: 10
    });

    const viewL = new OlView({
      center: fromLonLat([+this.mediaLon, +this.mediaLat]),
      zoom: this.impostazioni.currZoom[this.frameAttivo][n]
      // zoom: 10
    });

    // // this.UtilityPassata.scriveLog('Vista impostata:', this.frameAttivo, n,
    //   this.mediaLat, this.mediaLon, this.impostazioni.currZoom);

    this.impostazioni.viewOlG[this.frameAttivo][n] = viewG;
    this.impostazioni.viewOlL[this.frameAttivo][n] = viewL;

    this.centroAttuale[n] = this.mediaLon + ';' + this.mediaLat;
    // this.UtilityPassata.scriveLog('Centro attuale', n, this.centroAttuale[n]);

    /* for (let j = 1; j <= environment.quantiSottoFrames; j++) {
      for (let i = 1; i <= environment.quantiFrames; i++) {
        // const vG = viewG[i];
        // vG.setZoom(this.impostazioni.currZoom[1]);
        // if (this.impostazioni.viewOlG[j][i] !== undefined) {
          this.impostazioni.viewOlG[j][i] = viewG;
        // }

        // const vL = viewL[i];
        // vL.setZoom(this.impostazioni.currZoom[i]);
        // if (this.impostazioni.viewOlL[j][i] !== undefined) {
          this.impostazioni.viewOlL[j][i] = viewL;
        // }
      }
    } */
  }

  /* creaNomiFrames() {
    const nf = new Array();
    for (let j = 0; j <= environment.quantiFrames; j ++) {
      const nf2 = new Array();
      for (let i = 0; i <= environment.quantiSottoFrames; i ++) {
        if (this.impostazioni.MappaOGrafico[i] !== undefined) {
          if (this.impostazioni.MappaOGrafico[i][j] !== '') {
            let tit = this.impostazioni.frameName[i][j];
            if (tit === undefined || tit === null || tit === '') {
              tit = 'Frame0' + j;
            }
            nf2.push(tit);
          } else {
            nf2.push('<empty>');
          }
        }
      }
      // // this.UtilityPassata.scriveLog(nf2);
      nf.push(nf2);
    }
    this.nomiFrames = JSON.parse(JSON.stringify(nf));
    // // this.UtilityPassata.scriveLog(this.nomiFrames);
  }

  cambioNomeFrame(f, n, e) {
    this.impostazioni.frameName[f][n] = e;
    this.creaNomiFrames();
  } */

  creaStrutturaJsonImpostazioni() {
    const impostazioni =  {
      // frameAttivo: [ 0 ],
      styleVis: 1,
      maskVisible: undefined,
      frameName: undefined,
      barraAperta: [ [ false ] ],
      frameDesc: [ [ '' ] ],
      MappaOGrafico: undefined,
      MappaOGraficoTutti: undefined,
      overviewZoom: undefined,
      isCheckedServingCell: [ [ true ] ],
      isCheckedAntenne: [ [ -1 ] ],
      tipoMappa: undefined,
      netTech: [ [ null ] ],
      slaValue: undefined,
      slaName: undefined,
      activity: undefined,
      plmn: [ [ '' ] ],
      bandwidth: [ [ true ] ],
      FiltroAntenna: '',
      FiltroAntennaSel: '',
      isCheckedPath: 1,
      isCheckedCoverage: 1,
      isVisibleCheckedServingCell: 1,
      signalCoverage: '',
      signalPath1: '',
      selectedPath1: 0,
      selectedCoverage1: 0,
      mapType: undefined,
      latPartenza: 0,
      lonPartenza: 0,
      viewGlobal: true,
      Maximized: -1,
      maximized: [ false ],
      listaEventi: undefined,
      mostraGrafico:  [ null ],
      tabSelezionato: undefined,
      measure: ['', '', '', '', ''],
      countHistogram: undefined,
      checkSeverity: undefined,
      currZoom: undefined,
      viewAs: undefined,
      clusterType: undefined,
      overlay: undefined,
      overlayCluster: undefined,
      timeFilter: undefined,
      viewDefinition: undefined,
      viewOlG: [ [ null ] ],
      viewOlL: [ [ null ] ],
      dimensioniFinestraLegenda: [ 5 ],
      histDisplayAs: [ [ '', '' , '', '', '' ] ],
      columnsBars: [ [ true ] ],
      showPlanimetry: [ [ 'L' ] ],
      // columnsSettings: [ [ '' ] ],
      tipoEvento: [ [ '' ] ],
      eventiSceltiES: [ [ '' ] ],
      fixedSeconds: [ [ null ] ],
      layerMappa: [ [ -1 ] ],
      activityName: undefined,
      styleSize: [ [ 12 ] ],
      styleMappa: 1,
      actualDimeDrawer: 586,
      cellType: undefined,
      frameMassimizzato: -1,
      maskVisibile: undefined,
      filtroEventi: [ [ '' ] ],
      sCheckedShowPaths: [ [ false ] ],
      shownEvents: [ [ false ] ],
      addLayers: [ [ '' ] ],
      opacity: [ [ this.opacity2 ] ],
      modificaChart: [ [ true ] ],
      showRays: [ [ false ] ],
      showMeasures: [ [ false ] ],
      isVisibleServingCell: [ [ true ] ],
      squareMeters: [ [ 0 ] ],
      globalMeasure: { ROW_ID: 7, measr_code: 'Speed [Km/s]', tms: '2020-02-25T11:11:08', value: 'max-width: 130px, ***background-color: #BBBBBB, color: black, text-align: right***108', severity: '6 none', color: '#BBBBBB' },
      measureType: [ [ 1 ] ],
      mosaicStyle: [ [ '' ] ],
      sartPosition: [ [ false ] ],
      bboxOZ: undefined,
      showMeasuresS: [ [ false ] ],
      geoFilter: '1',
      showRaysAllLayer: [ [ undefined ] ],
    };
    this.impostazioni = JSON.parse(JSON.stringify(impostazioni));
    this.UtilityPassata.scriveLog('Impostazioni inizio', this.impostazioni);
  }

  cambioMosaicStyle(e) {
    // this.UtilityPassata.scriveLog(e);
  }

  
  creaJsonImpostazioni() {
    // // this.UtilityPassata.scriveLog(this.impostazioni);
    // // this.UtilityPassata.scriveLog(this.Utilities.datiTipiActivity);

    this.measureData2 = this.measureData;
    this.ConnessioneStabilita = 'OK';
    // this.impostazioni.frameAttivo = [ 0 ];
    // this.numeroFrame = 0;
    this.frameAttivo = 0;
    this.debug = false;
    this.eseguitoInProgetto = true; // new Date().toString();

    if (this.tipoFrame2 === 'M') {
      const tm1 = setTimeout(() => {
        clearTimeout(tm1);
        this.impostazioni.MappaOGrafico = [ this.tipoFrame2 ];
        this.impostazioni.MappaOGraficoTutti = [ this.tipoFrame2, this.tipoFrame2, this.tipoFrame2, this.tipoFrame2, this.tipoFrame2, this.tipoFrame2 ];

        this.impostazioni.cellType = [ { ROW_ID: 1, VALUE_STR: 'Active' }, { ROW_ID: 10, VALUE_STR: 'Serving'} ];
        this.impostazioni.mapType = [ [ 1 ] ];
        // this.impostazioni.listaEventi = [ [ grigliaEventi ] ];
        this.impostazioni.tabSelezionato = [ [ 2 ] ];
        // this.impostazioni.measure = [ [ undefined ] ];
        this.impostazioni.countHistogram = [ [ null ] ];
        this.impostazioni.checkSeverity = [ [ '' ] ];
        this.impostazioni.currZoom = [ [ 11.9120369376739 ] ];
        this.impostazioni.maskVisible = [ true ];
        this.impostazioni.viewAs = [ [ 3 ] ];
        this.impostazioni.overlay = [ [ 'samples' ] ];
        this.impostazioni.squareMeters = [ [ 0 ] ];
        this.impostazioni.clusterType = [ [ 'Mosaic' ] ];
        this.impostazioni.overlayCluster = [ [ '<Global Cluster>' ] ];
        this.impostazioni.timeFilter = [ [ 3 ] ];
        this.impostazioni.activity = [ [ 1 ] ];
        // this.impostazioni.maskVisibile = [ true ];
        // this.impostazioni.isCheckedAntenne = [ [ 1 ] ],
        this.impostazioni.showRaysAllLayer = [ [ true ] ],
        this.impostazioni.viewDefinition = [ [ {
          showZeros: false,
          showColumnTotals: 1,
          showRowTotals: 1,
          defaultFilterType: 3,
          totalsBeforeData: false,
          sortableGroups: true,
          fields: [],
          rowFields: {items: [] },
          columnFields: { items: [] },
          filterFields: { items: [] },
          valueFields: { items: []}
        } ] ];
        this.impostazioni.slaValue = [ [ { ROW_ID: 1, ID: -1, NAME: '<Global SLA>', OPERATOR_NAME: 'Maintenance', GROUP_NAME: 'root',
          DESCRIPTION: 'Global settings', FOLDER: 'Global', INSERT_TIMESTAMP: '2020-01-17 06:42:35',
          UPDATE_TIMESTAMP: '2020-01-17 06:42:35' } ] ];
        this.impostazioni.slaName = [ [ '<Global SLA>' ] ];
        this.impostazioni.tipoMappa = [ [ 1 ] ];
        this.impostazioni.overviewZoom = [ [ true ] ];
        this.impostazioni.frameName = [ [ 'Map serving' ] ];
        // this.impostazioni.measure = [[["", "TC Name", "Act Name", "", "", "", "", "", "", "", ""]]];
        this.impostazioni.mosaicStyle = [ [ 's_geo_measr_mosaic_samples' ] ];
        this.impostazioni.showPlanimetry = [ [ false ] ];
        this.impostazioni.isCheckedShowPaths = [ [ true ] ];
        this.impostazioni.isCheckedServingCell = [ [ false ] ];
        this.impostazioni.isVisibleServingCell = [ [ false ] ];
        this.impostazioni.showRays = [ [ false ] ];
        // this.impostazioni.shownEvents = [ [ true ] ];
        // this.impostazioni.showMeasures = [ [ true ] ],
        this.impostazioni.tipoEvento = [ [ 'L' ] ];
        this.impostazioni.sartPosition = [ [ true ] ];
        this.impostazioni.permessiFAM = [ [ this.permessoFMAM2 ] ],

        this.UtilityPassata.scriveLog('Impostazioni', this.impostazioni);

        // this.stringaAGNoACT = [ '', '20200225_103819_e6a471fa9015_02 I1_1-2_usb_Auto_Call-VoLTE_Telekom.nsfx' ];

        this.ActivitySetName2 = this.ActivitySetName;
        this.ActivitySetID2 = this.ActivitySetID;

        this.timeRangeDSFStart = undefined;
        this.timeRangeDSFStop = undefined;
        // this.slaValueGlobale2 = undefined;
        this.dashboardSelezionata = 1;

        this.impostazioni = JSON.parse(JSON.stringify(this.impostazioni));

        this.UtilityPassata.scriveLog('Imposto valori per progetto su Frame', this.impostazioni);

        // alert('prima');

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.calcolaCentro = !this.calcolaCentro;
          this.Utilities.premutoReposition = true;

          /* this.eseguitoInProgetto = true; // new Date().toString();

          const tm = setTimeout(() => {
            this.refreshMap[0] = !this.refreshMap[0];
          }, 1000); */
        }, 1000);
      }, 1000);
    } else {
      if (this.tipoFrame2 === 'TP') {
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.impostazioni.MappaOGrafico = [ this.tipoFrame2 ];
          this.impostazioni.MappaOGraficoTutti = [ this.tipoFrame2, this.tipoFrame2, this.tipoFrame2, this.tipoFrame2, this.tipoFrame2, this.tipoFrame2 ];    

          this.impostazioni.tabSelezionato = [ [ 0 ] ];
          this.impostazioni.maskVisible = [ true ];
          this.impostazioni.frameName = [ [ 'Pivot serving' ] ];
          this.impostazioni.timeFilter = [ [ 1 ] ];

          /* this.ActivitySetName2 = undefined;
          this.activityName = undefined;
          this.ActivitySetID2 = undefined; 
  
          this.timeRangeDSFStart = undefined;
          this.timeRangeDSFStop = undefined; */
  
          this.impostazioni = JSON.parse(JSON.stringify(this.impostazioni));
        }, 1000);
      }
    }
  }

  creaJsonImpostazioni_vecchio() {
    // // this.UtilityPassata.scriveLog(this.impostazioni);
    // // this.UtilityPassata.scriveLog(this.Utilities.datiTipiActivity);

    this.ConnessioneStabilita = 'OK';
    // this.numeroFrame = 0;
    this.frameAttivo = 0;
    const tm1 = setTimeout(() => {
      clearTimeout(tm1);
      /* this.activityName = [ [ {
        DESCRIPTION: '',
        FOLDER: 'Slovenia',
        GROUP_NAME: 'root',
        ID: 361,
        INSERT_TIMESTAMP: '2020-04-28T21:44:46',
        NAME: 'Slovenia 02 usb_Auto_Call-VoLTE',
        OPERATOR_NAME: 'John Fish',
        ROW_ID: 3,
        UPDATE_TIMESTAMP: '2020-04-28T21:49:31'
      } ] ];
      this.listaActivitySets = [
        [ { DESCRIPTION: '',
          FOLDER: 'Slovenia',
          GROUP_NAME: 'root',
          ID: 361,
          INSERT_TIMESTAMP: '2020-04-28T21:44:46',
          NAME: 'Slovenia 02 usb_Auto_Call-VoLTE',
          OPERATOR_NAME: 'John Fish',
          ROW_ID: 3,
          UPDATE_TIMESTAMP: '2020-04-28T21:49:31' }
        ]
      ]; */
      this.impostazioni.cellType = [ { ROW_ID: 1, VALUE_STR: 'Active' }, { ROW_ID: 10, VALUE_STR: 'Serving'} ];
      this.impostazioni.mapType = [ [ 1 ] ];
      this.impostazioni.listaEventi = [ [ 'empty grid' ] ];
      this.impostazioni.tabSelezionato = [ [ 2 ] ];
      this.impostazioni.measure = [ [ '', 'act_coverage_packet_tech', '', '' ] ];
      this.impostazioni.countHistogram = [ [ null ] ];
      this.impostazioni.checkSeverity = [ [ '' ] ];
      this.impostazioni.currZoom = [ [ 11.9120369376739 ] ];
      this.impostazioni.maskVisible = [ true ];
      this.impostazioni.viewAs = [ [ this.viewAs ] ];
      this.impostazioni.overlay = [ [ 'samples' ] ];
      this.impostazioni.squareMeters = [ [ 0 ] ];
      this.impostazioni.clusterType = [ [ 'Mosaic' ] ];
      this.impostazioni.overlayCluster = [ [ '<Global Cluster>' ] ];
      this.impostazioni.timeFilter = [ [ 3 ] ];
      this.impostazioni.activity = [ [ 1 ] ];
      this.impostazioni.maskVisibile = [ true ];
      this.impostazioni.isCheckedAntenne = [ [ this.antenne2 ] ],
      this.impostazioni.showRaysAllLayer = [ [ true ] ],
      this.impostazioni.viewDefinition = [ [ {
        showZeros: false,
        showColumnTotals: 1,
        showRowTotals: 1,
        defaultFilterType: 3,
        totalsBeforeData: false,
        sortableGroups: true,
        fields: [],
        rowFields: {items: [] },
        columnFields: { items: [] },
        filterFields: { items: [] },
        valueFields: { items: []}
      } ] ];
      this.impostazioni.slaValue = [ [ { ROW_ID: 1, ID: -1, NAME: '<Global SLA>', OPERATOR_NAME: 'Maintenance', GROUP_NAME: 'root',
        DESCRIPTION: 'Global settings', FOLDER: 'Global', INSERT_TIMESTAMP: '2020-01-17 06:42:35',
        UPDATE_TIMESTAMP: '2020-01-17 06:42:35' } ] ];
      this.impostazioni.slaName = [ [ '<Global SLA>' ] ];
      this.impostazioni.tipoMappa = [ [ 1 ] ];
      this.impostazioni.overviewZoom = [ [ true ] ];
      this.impostazioni.frameName = [ [ 'Map serving' ] ];
      // this.impostazioni.frameAttivo = [ true ];
      this.impostazioni.MappaOGrafico = [ 'M' ];
      this.impostazioni.MappaOGraficoTutti = [ 'M', 'M', 'M', 'M', 'M', 'M' ];
      this.impostazioni.measure = ['', 'act_coverage_rsrp', 'mon_diagnostic_capability_list', '', ''];
      this.impostazioni.mosaicStyle = [ [ 's_geo_measr_mosaic_samples' ] ];
      this.impostazioni.showPlanimetry = [ [ false ] ];
      this.impostazioni.isCheckedShowPaths = [ [ true ] ];
      this.impostazioni.isCheckedServingCell = [ [ false ] ];
      this.impostazioni.isVisibleServingCell = [ [ false ] ];
      this.impostazioni.showRays = [ [ false ] ];
      this.impostazioni.shownEvents = [ false ];
      this.impostazioni.tipoEvento = [ [ 'L' ] ];
      this.impostazioni.sartPosition = [ [ true ] ];

      // this.stringaAGNoACT = [ '', '20200225_103819_e6a471fa9015_02 I1_1-2_usb_Auto_Call-VoLTE_Telekom.nsfx' ];
      this.measureData2 = this.measureData;

      this.ActivitySetName2 = this.ActivitySetName;
      this.ActivitySetID2 = this.ActivitySetID;

      this.timeRangeDSFStart = undefined;
      this.timeRangeDSFStop2 = undefined;
      // this.slaValueGlobale2 = undefined;
      this.dashboardSelezionata = 1;

      this.impostazioni = JSON.parse(JSON.stringify(this.impostazioni));

      // this.UtilityPassata.scriveLog(this.impostazioni);

      const tm2 = setTimeout(() => {
        clearTimeout(tm2);
        this.calcolaCentro = !this.calcolaCentro;
        this.Utilities.premutoReposition = true;

        this.eseguitoInProgetto = true;

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.refreshMap[0] = !this.refreshMap[0];
        }, 1000);
      }, 1000);
    }, 1000);
  }

  effettuateModifiche(e) {
    if (e === true) {
      // this.UtilityPassata.scriveLog('Modifiche effettuate', e);
      // this.UtilityPassata.scriveLog(this.impostazioni);
      // this.salvaModifiche();
    }
  }

  salvaModifiche() {
    // // this.UtilityPassata.scriveLog(this.impostazioni);
    const impost = this.Utilities.sistemaJSONPerSalvarloSuDB(this.impostazioni);

    let jsonString = '{';
    jsonString += '"v_cntx": "' + this.sessioneID + '",';
    jsonString += '"v_id": "0",';
    jsonString += '"v_name": "TestCampaignDefault",';
    jsonString += '"v_folder": "<TestCampaigns>",';
    jsonString += '"v_description": "TestCampaignDefault",';
    jsonString += '"v_config_json": "' + impost + '" ';
    jsonString += '}';

    this.apiService.chiamataPost('geo_dashboard__upd', JSON.parse(jsonString))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      this.Utilities.checkRitornoChiamata(this, data);
      if (data.length === 0) {
        Utils.messaggioDiErrore('null', 'Trouble in save dashboard. Name already present ?');
      } else {
        // this.UtilityPassata.scriveLog('Salvataggio', data[0]);
        if (+data[0].v_err_code === 0) {
        } else {
        }
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Create dashboard: ' + error);
    });
  }

  cambioCoordinateDaClickSuMappa(e) {
    // // this.UtilityPassata.scriveLog('Coordinate su frame:', e);
    this.coordinateDaClickSuMappa.emit(e);
  }

  cambioZoom(e) {
    // this.UtilityPassata.scriveLog('Zoom', e);
  }

  cambioBBOXO(e) {
    // // this.UtilityPassata.scriveLog('Cambio BBOX Overview', e);
    // logConsole('BBOX su frame chiamante', e);
    this.bboxO = JSON.stringify(e);
  }

  cambioBboxOZ(f, q, e) {
    // // this.UtilityPassata.scriveLog('Cambio bboxOZ', f, q, e);
    // logConsole('BBOXOZ su frame chiamante', e);
    if (this.impostazioni.bboxOZ && this.impostazioni.bboxOZ[f] && this.impostazioni.bboxOZ[f][q]) {
      this.impostazioni.bboxOZ[f][q] = e;
    }
  }

  cambioBBOXZ(e) {
    // // this.UtilityPassata.scriveLog('Cambio BBOX Zoom', e);
    this.bboxZ = JSON.stringify(e);
  }

  passaggioSquareMetersO(e) {
    // this.UtilityPassata.scriveLog('Passaggio Square Meters OverView', e);
    // this.squareMetersO = JSON.stringify(e);
  }

  passaggioSquareMetersZ(e) {
    // this.UtilityPassata.scriveLog('Passaggio Square Meters Zoom', e);
    // this.squareMetersZ = JSON.stringify(e);
  }

  cambioOpacity(e) {
    // this.UtilityPassata.scriveLog('Passaggio Opacity', e);
    this.impostazioni.opacity[0][0] = e;
    // this.opacity = e;
    this.opacityEmit.emit(e);
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
      this.UtilityPassata.scriveLog('The dialog was closed', result);
      // this.animal = result;
    });
  }

  cambioRicaricaRaggi(e) {
    this.ricaricaRaggi = e;
  }

  passaggioValoriPerLegenda(e) {
    this.passaggioValoriLegenda.emit(e);
  }

  cambioBBox(e) {
    this.cambioBBoxEmit.emit(e);
  }

  sStringaRitorno(e) {
    this.stringaRitornoEmit.emit(e);
  }
}

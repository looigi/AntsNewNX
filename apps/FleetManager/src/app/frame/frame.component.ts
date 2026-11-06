import { logConsole } from '../console-log';
import { DatePipe } from '@angular/common';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { environment } from '../../environments/environment';
import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FrameUtils } from './Utilities.component';
import Utils from '../Utilities.component';
import { fromLonLat } from 'ol/proj';
import OlView from 'ol/View';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: 'frame.component.html',
  selector: 'app-frame',
  styleUrls: ['./frame.component.css']
})

export class InternalFrameComponent implements OnInit, OnChanges {
  @Input() indirizzoServer;
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
  @Input() additionalLayer;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() tmsPassati;
  @Input() tmsPassatiTcRun;
  @Input() permessoFMAM;
  @Input() tipoFrame = 'M';
  @Input() nomeSetAntenne;
  @Input() listaActSet;

  @Output() coordinateDaClickSuMappa: EventEmitter<any> = new EventEmitter<any>();

  eseguitoInProgetto = false;

  // VARIABILI FRAME
  debug = false; // Per cambiare questo, impostare SOLO quello nella funzione creaJsonImpostazioni per i soliti problemi di aggiornamento angular
  ActivitySetName;
  ActivitySetID;
  ActivitySetName2;
  ActivitySetID2;
  impostazioni;
  ConnessioneStabilita = '';
  refreshMap = [ false ];
  Utilities = FrameUtils;
  additionalLayer2;
  impostazioniPivot2;
  listaCampiTCRP2;
  qualeFrame = 2;
  nomeSetAntenne2 = undefined;
  listaActSet2;
  // UtilityInterna = FrameUtils;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    // Chiude le sottoscrizioni con takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  mappeStyle2: any[] = [
    { id: 1, name: 'Band' },
    { id: 2, name: 'Line' },
    { id: 3, name: 'Coaxial' },
  ];

  accordionDebug = true;
  frameEditorAttivo = true;

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
  datiSlaDT;
  datiSlaDTi;
  datiSLA;
  numeroFrame = 0; // undefined;
  frameAttivo = undefined;
  slaValueGlobale = undefined;
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
  timeRangeDSFStart = undefined;
  timeRangeDSFStop = undefined;
  agnGroupId2;
  agnGroup2;
  actSetNameFM2;
  permessoFMAM2;
  bboxO;
  bboxZ;
  rigaMG;
  impostaCentro;
  numeroActSetVisibili = 1;
  lastDays2 = 10;
  impostaValoriMascheraProgetto = '';
  ultimoCSV = '';
  datiLookup;
  tipoFrame2 = 'M';

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
    if (r.sessioneID) {
      if (r.sessioneID.currentValue) {
        // // this.UtilityPassata.scriveLog(r.sessioneID.currentValue);
        this.LeggeDatiLookUp();
        this.LeggeSlaGroupPR();
        this.LeggeMeasuresPR();
        this.LeggeSLADataPR();
        this.LeggeActivitySetPR();
        this.LeggeDatiMosaicStyle();
        this.LeggeDatiAddLayers();
        // this.LeggeDashboard(0);
        // this.creaNuovoImpostazioni = false;
      }
    }

    /* if (r.agnGroupId) {
      if (r.agnGroupId.currentValue) {
        this.agnGroupId2 = r.agnGroupId.currentValue;
        // this.UtilityPassata.scriveLog('AGN Group id:', this.agnGroupId2);
      }
    } */

    if (r.agnGroup) {
      if (r.agnGroup.currentValue) {
        this.agnGroup2 = r.agnGroup.currentValue;
        // this.UtilityPassata.scriveLog('AGN Group:', this.agnGroup2);
        // this.calcolaCentro = !this.calcolaCentro;
      }
    }

    if (r.additionalLayer) {
      this.additionalLayer2 = r.additionalLayer.currentValue;
      // this.UtilityPassata.scriveLog('Additional layer:', this.additionalLayer2);
    }

    if (r.lastDays) {
      this.lastDays2 = r.lastDays.currentValue;
      // logConsole('Last days passate al frame: ', this.lastDays2);
      // this.UtilityPassata.scriveLog('lastDays:', this.lastDays2);
    }

    if (r.actSetNameFM) {
      this.actSetNameFM2 = r.actSetNameFM.currentValue;
      // this.UtilityPassata.scriveLog('Act Set Name:', this.actSetNameFM);
    }

    if (r.permessoFMAM) {
      this.permessoFMAM2 = r.permessoFMAM.currentValue;
      // this.UtilityPassata.scriveLog('Permesso fleet manager:', this.permessoFMAM2);
    }

    if (r.nomeSetAntenne) {
      this.nomeSetAntenne2 = r.nomeSetAntenne.currentValue;
      // logConsole('Passato set antenne: ', this.nomeSetAntenne2);
    }

    if (r.listaActSet) {
      this.listaActSet2 = r.listaActSet.currentValue;
      // logConsole('Passata listaActSet: ', this.listaActSet2);
    }

    if (r.stringaAGNoACTp) {
      // const tm = setTimeout(() => {
      this.stringaAGNoACT[1] = r.stringaAGNoACTp.currentValue;
      // this.UtilityPassata.scriveLog('Stringa passata AGN o ACT', this.stringaAGNoACT[1]);
      // }, 100);
    }

    if (r.UtilityPassata) {
      if (r.UtilityPassata.currentValue) {
        this.Utilities.indirizzoServer = r.UtilityPassata.currentValue.indirizzoServer;
        this.Utilities.indirizzoGEOServer = r.UtilityPassata.currentValue.indirizzoGEOServer;
        this.Utilities.linkIcone = r.UtilityPassata.currentValue.linkIcone;
        this.Utilities.serverPostRest = r.UtilityPassata.currentValue.serverPostRest;
        // this.Utilities.facadeServerAddress = r.UtilityPassata.currentValue.facadeServerAddress;
        this.Utilities.serverGEOServer = r.UtilityPassata.currentValue.serverGEOServer;
      }
    }

    if (r.tipoFrame) {
      if (r.tipoFrame.currentValue) {
        this.tipoFrame2 = r.tipoFrame.currentValue;
        if (this.tipoFrame2 === 'M') {
          this.qualeFrame = 0;
        } else {
          this.qualeFrame = 1;
        }
        this.creaJsonImpostazioni('TIPO FRAME');
      }
    }

    if (r.tmsPassati) {
      if (r.tmsPassati.currentValue) {
        if (r.tmsPassati.currentValue.indexOf(';') > -1) {
          const tt = r.tmsPassati.currentValue.split(';');
          const sInizio = tt[0];
          const sFine = tt[1];

          this.timeRangeDSFStart = sInizio;
          this.timeRangeDSFStop = sFine;

          // // logConsole('START/END', sInizio, sFine);
        }
      }
    }

    if (r.refreshMappa) {
      // // this.UtilityPassata.scriveLog('Refresh mappa');
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.refreshMap[0] = !this.refreshMap[0];
        this.refreshMaschera[0] = !this.refreshMaschera[0];
      }, 1500);
    }

    if (r.activitySetID && r.activitySetID.currentValue) {
      this.ActivitySetID = r.activitySetID.currentValue;
      this.ActivitySetID2 = this.ActivitySetID;
      // this.UtilityPassata.scriveLog('Refresh set ID', this.ActivitySetID);

      if (this.tipoFrame2 === 'M') {
        if (this.ActivitySetID2 && this.ActivitySetName2 && this.caricataMappa === false) {
          // // this.UtilityPassata.scriveLog('Ricarico mappa');
          this.caricataMappa = true;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.LeggeDashboard(1);
          }, 100);
        }
      }
    }

    if (r.activitySetName && r.activitySetName.currentValue) {
      const a = JSON.parse(JSON.stringify(r.activitySetName.currentValue));
      this.ActivitySetName = a;
      this.ActivitySetName2 = a;
      const a2 = new Array();
      a2.push(new Array());
      a2[0][0] = a;
      a2[0][1] = a;
      this.activityName = a2;
      // this.UtilityPassata.scriveLog('Refresh set NAME', this.ActivitySetName);

      // // logConsole('ACTIVITY NAME FRAME TC', a, this.activitySetName, this.activityName);

      if (this.tipoFrame2 === 'M') {
        if (this.ActivitySetID2 && this.ActivitySetName2 && this.caricataMappa === false) {
          // // this.UtilityPassata.scriveLog('Ricarico mappa');
          this.caricataMappa = true;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.LeggeDashboard(1);
          }, 100);
        }
      }
    }

    if (r.centraMappa) {
      if (r.centraMappa.currentValue) {
        this.impostaCentro = r.centraMappa.currentValue;
        // this.UtilityPassata.scriveLog('Nuovo centro impostato', this.impostaCentro);
      }
    }

    /* const tm = setTimeout(() => {
      this.refreshMap[0] = !this.refreshMap[0];
      this.refreshMaschera[0] = !this.refreshMaschera[0];
    },  2000); */
  }

  LeggeDatiLookUp() {
    // // this.UtilityPassata.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_category": "cell_type"' +
    '}';
    this.apiService.chiamataPost('geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // // this.UtilityPassata.scriveLog('Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiLookUp = 'empty grid'; // null;
          Utils.visualizzaAlert(data2.v_failure_reason);
        } else {
          // // this.UtilityPassata.scriveLog('Lookup:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.UtilityPassata.scriveLog('Mesaures:', data);
          this.datiLookUp = data;
        }
      } else {
        this.datiLookUp = 'empty grid'; // null;
      }

      // const tm = setTimeout(() => {
        // this.caricatiLookUp = true;
      // }, 100);
    }, error => {
      Utils.visualizzaAlert('Read look up:' + error);
    });
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
    .subscribe((data2: any) => {
      // // this.UtilityPassata.scriveLog('Lista lookup add layers:', data2);
      if (data2 && data2 !== null) {
        // // this.UtilityPassata.scriveLog('Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
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
    .subscribe((data2: any) => {
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
      Utils.messaggioDiErrore(this.datiMosaicStyle, error);
    });
  }

  LeggeDashboard(q) {
    if (q === -1) { return; }

    this.UtilityPassata.scriveLog('Leggo dashboard', q, this.creaNuovoImpostazioni);
    if (this.creaNuovoImpostazioni === true) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        this.creaJsonImpostazioni('LEGGE DASHBOARD');
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
    .subscribe((data2: any) => {
      // // this.UtilityPassata.scriveLog('Leggo dashboard ritorno', data2);
      if (data2 && data2 !== null) {
        if (data2[0]) {
          this.UtilityPassata.scriveLog('Letta dashboard', JSON.parse(params), data2);
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
            this.UtilityPassata.scriveLog('Letta dashboard. Creo impostazioni 0');
            // } else {
            //   this.creaJsonImpostazioni();
            // }
          } else {
            this.UtilityPassata.scriveLog('Letta dashboard. Creo impostazioni 1');
            this.creaJsonImpostazioni('1');
          }
        } else {
          this.UtilityPassata.scriveLog('Letta dashboard. Creo impostazioni 2');
          this.creaJsonImpostazioni('2');
        }
      } else {
        this.UtilityPassata.scriveLog('Letta dashboard. Creo impostazioni 3');
        this.creaJsonImpostazioni('3');
      }
    }, error => {
      this.UtilityPassata.scriveLog('Letta dashboard. Creo impostazioni 4');
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
    .subscribe((data2: any) => {
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
    .subscribe((data: any) => {
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

  LeggeSLADataPR() {
    const params = '{' +
      '"cntx_id": "' + this.sessioneID + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost('geo_sla__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
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
        this.datiSLA = 'empty grid'; // null;
        this.datiSlaDT = 'empty grid';
        // this.pulisceFiltroSLA = !this.pulisceFiltroSLA;
      }
    }, error => {
      Utils.messaggioDiErrore('null', error);
    });
  }

  LeggeMeasuresPR() {
    // // this.UtilityPassata.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_filter_folder": ""' +
    '}';
    this.apiService.chiamataPost('geo_measure_dfn__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // // this.UtilityPassata.scriveLog('Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        Utils.checkRitornoChiamata(this, data2);
        // // this.UtilityPassata.scriveLog('Mesaures:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // this.UtilityPassata.scriveLog('Mesaures:', data);
        this.measureData = data.DataTable;
        this.measureData2 = this.measureData;

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
    // // this.UtilityPassata.scriveLog('CSV Impostato:', n);
    // // this.UtilityPassata.scriveLog('CSV Impostato:', e);
    // this.UtilityPassata.scriveLog('CSV Impostato:', this.ultimoCSV);
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
    if (this.impostazioni.currZoom && this.impostazioni.frameAttivo) {
      const viewG = new OlView({
        center: fromLonLat([+this.mediaLon, +this.mediaLat]),
        zoom: this.impostazioni.currZoom[this.impostazioni.frameAttivo[n]][n]
        // zoom: 10
      });

      const viewL = new OlView({
        center: fromLonLat([+this.mediaLon, +this.mediaLat]),
        zoom: this.impostazioni.currZoom[this.impostazioni.frameAttivo[n]][n]
        // zoom: 10
      });

      // // this.UtilityPassata.scriveLog('Vista impostata:', this.impostazioni.frameAttivo[n], n,
      //   this.mediaLat, this.mediaLon, this.impostazioni.currZoom);

      this.impostazioni.viewOlG[this.impostazioni.frameAttivo[n]][n] = viewG;
      this.impostazioni.viewOlL[this.impostazioni.frameAttivo[n]][n] = viewL;
    }

    this.centroAttuale[n] = this.mediaLon + ';' + this.mediaLat;
    // // this.UtilityPassata.scriveLog('Centro attuale', n, this.centroAttuale[n]);

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

  /* creaStrutturaJsonImpostazioni() {
    const impostazioni =  {
      frameAttivo: [ 0 ],
      styleVis: 1,
      maskVisible: undefined,
      frameName: undefined,
      barraAperta: [ [ false ] ],
      frameDesc: [ [ '' ] ],
      MappaOGrafico: undefined,
      MappaOGraficoTutti: undefined,
      overviewZoom: undefined,
      isCheckedServingCell: [ [ true ] ],
      isCheckedAntenne: [ [ 0 ] ],
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
      columnsSettings: [ [ '' ] ],
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
      opacity: [ [ '' ] ],
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
    };
    this.impostazioni = JSON.parse(JSON.stringify(impostazioni));
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
      // isCheckedAntenne: [ [ -1 ] ],
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
      showPlanimetry: [ [ false ] ],
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
      shownEvents: [ [ undefined ] ],
      addLayers: [ [ '' ] ],
      opacity: [ [ 30 ] ],
      modificaChart: [ [ true ] ],
      showRays: [ [ false ] ],
      showMeasures: [ [ undefined ] ],
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
    // // this.UtilityPassata.scriveLog('Impostazioni inizio', this.impostazioni);
  }

  cambioMosaicStyle(e) {
    // this.UtilityPassata.scriveLog(e);
  }

  cambioMeasure(f, q, e) {
    // // this.UtilityPassata.scriveLog('Cambio measure', this.impostazioni.measure, f, q, e);
    logConsole('Misure arrivate dal frame', e);
    this.impostazioni.measure = [ new Array() ];
    this.impostazioni.measure[f][q] = e;
    // this.UtilityPassata.scriveLog('Cambio measure', this.impostazioni.measure);
  }

  cambioShowMeasures(f, n, e) {
    // // this.UtilityPassata.scriveLog('Cambio show measures', this.impostazioni.showMeasures);
    this.impostazioni.showMeasures[f][n] = e;
    // this.UtilityPassata.scriveLog('Cambio show measures', this.impostazioni.showMeasures);
  }

  /* creaJsonImpostazioniVecchio() {
    // // this.UtilityPassata.scriveLog(this.impostazioni);
    // // this.UtilityPassata.scriveLog(this.Utilities.datiTipiActivity);

    this.ConnessioneStabilita = 'OK';
    this.numeroFrame = 0;
    const tm = setTimeout(() => {
      // /* this.activityName = [ [ {
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
      // ]; *-/
      this.impostazioni.cellType = [ { ROW_ID: 1, VALUE_STR: 'Active' }, { ROW_ID: 10, VALUE_STR: 'Serving'} ];
      this.impostazioni.mapType = [ [ 2 ] ];
      this.impostazioni.listaEventi = [ [ 'empty grid' ] ];
      this.impostazioni.tabSelezionato = [ [ 2 ] ];
      this.impostazioni.measure = [ [ '', 'act_coverage_packet_tech', '', '' ] ];
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
      this.impostazioni.maskVisibile = [ true ];
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
      this.impostazioni.tipoMappa = [ [ 3 ] ];
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

      this.timeRangeDSFStart = '01-01-1900 00:00:00';
      this.timeRangeDSFStop = '12-31-2999 23:59:59';
      this.dashboardSelezionata = 1;

      this.impostazioni = JSON.parse(JSON.stringify(this.impostazioni));

      // this.UtilityPassata.scriveLog(this.impostazioni);

      const tm = setTimeout(() => {
        this.calcolaCentro = !this.calcolaCentro;
        this.Utilities.premutoReposition = true;
      }, 1000);
    }, 1000);
  } */

  impostazioniCreate = false;

  creaJsonImpostazioni(daDove) {
    if (this.impostazioniCreate) {
      return;
    }
    this.impostazioniCreate = true;

    // alert('Creo impostazioni: ' + daDove + ' - Tipo Frame: ' + this.tipoFrame2 + ' - Quale Frame: ' + this.qualeFrame);
    // // this.UtilityPassata.scriveLog(this.impostazioni);
    // // this.UtilityPassata.scriveLog(this.Utilities.datiTipiActivity);

    this.ConnessioneStabilita = 'OK';
    this.debug = false;
    
    if (this.tipoFrame2 === 'M') {
      this.measureData2 = this.measureData;
      // this.impostazioni.frameAttivo = [ 0 ];
      // this.numeroFrame = 0;
      this.frameAttivo = 0;

      const tm3 = setTimeout(() => {
        clearTimeout(tm3);
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
        this.impostazioni.showPlanimetry = [ [ true ] ];
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

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.calcolaCentro = !this.calcolaCentro;
          this.Utilities.premutoReposition = true;

          this.eseguitoInProgetto = true; // new Date().toString();

          const tm1 = setTimeout(() => {
            clearTimeout(tm1);
            this.refreshMap[0] = !this.refreshMap[0];
          }, 1000);
        }, 1000);
      }, 1000);
    } else {
      if (this.tipoFrame2 === 'TP') {
        this.frameAttivo = 0;

        const tm = setTimeout(() => {
          clearTimeout(tm);
          // this.impostazioni.MappaOGrafico = [ this.tipoFrame2, this.tipoFrame2 ];
          // this.impostazioni.MappaOGraficoTutti = [ this.tipoFrame2, this.tipoFrame2, this.tipoFrame2, this.tipoFrame2, this.tipoFrame2, this.tipoFrame2 ];    

          this.impostazioni.tabSelezionato = [ [ 0, 0 ] ];
          this.impostazioni.maskVisible = [ true ];
          this.impostazioni.frameName = [ [ '', 'Pivot serving' ] ];
          this.impostazioni.timeFilter = [ [ 1, 1 ] ];

          this.impostazioniPivot2 = undefined;

          this.listaCampiTCRP2 = [
            {
              "DIM": "Y",
              "CODE": "o,TcName",
              "USED": "N",
              "VIEW": "N",
              "FOLDER": "Default",
              "ROW_ID": 278,
              "TYPE_STR": "string",
              "RELEVANCE": "3 Low",
              "FILTER_MAX": "",
              "FILTER_MIN": "",
              "DESCRIPTION": null,
              "FIELD_COUNT": 3556,
              "IN_DATA_SET": "Y",
              "MEASURE_AVG": "N",
              "MEASURE_MAX": "N",
              "MEASURE_MIN": "N",
              "DISPLAY_NAME": "o,TcName",
              "DIM_ICON_NAME": "N.png",
              "VIEW_ICON_NAME": "N.png",
              "DISPLAY_NAME_FRM": "color: #000000",
              "MEASURE_DIM_STEP": "",
              "FIELD_VALUE_COUNT": 12,
              "FILTER_VALUE_LIST": [],
              "STATUS_DESCRIPTION": "in dataset",
              "TYPE_STR_ICON_NAME": "string.png",
              "MEASURE_AVG_ICON_NAME": "N.png",
              "MEASURE_MAX_ICON_NAME": "N.png",
              "MEASURE_MIN_ICON_NAME": "N.png"
          },
          {
              "DIM": "Y",
              "CODE": "o,ServerName",
              "USED": "N",
              "VIEW": "N",
              "FOLDER": "Default",
              "ROW_ID": 443,
              "TYPE_STR": "string",
              "RELEVANCE": "3 Low",
              "FILTER_MAX": "",
              "FILTER_MIN": "",
              "DESCRIPTION": null,
              "FIELD_COUNT": 2862,
              "IN_DATA_SET": "Y",
              "MEASURE_AVG": "N",
              "MEASURE_MAX": "N",
              "MEASURE_MIN": "N",
              "DISPLAY_NAME": "o,ServerName",
              "DIM_ICON_NAME": "N.png",
              "VIEW_ICON_NAME": "N.png",
              "DISPLAY_NAME_FRM": "color: #000000",
              "MEASURE_DIM_STEP": "",
              "FIELD_VALUE_COUNT": 4,
              "FILTER_VALUE_LIST": [],
              "STATUS_DESCRIPTION": "in dataset",
              "TYPE_STR_ICON_NAME": "string.png",
              "MEASURE_AVG_ICON_NAME": "N.png",
              "MEASURE_MAX_ICON_NAME": "N.png",
              "MEASURE_MIN_ICON_NAME": "N.png"
          },
          {
              "DIM": "Y",
              "CODE": "o,SubscrCategory",
              "USED": "N",
              "VIEW": "N",
              "FOLDER": "Default",
              "ROW_ID": 566,
              "TYPE_STR": "string",
              "RELEVANCE": "3 Low",
              "FILTER_MAX": "",
              "FILTER_MIN": "",
              "DESCRIPTION": null,
              "FIELD_COUNT": 8813,
              "IN_DATA_SET": "Y",
              "MEASURE_AVG": "N",
              "MEASURE_MAX": "N",
              "MEASURE_MIN": "N",
              "DISPLAY_NAME": "o,SubscrCategory",
              "DIM_ICON_NAME": "N.png",
              "VIEW_ICON_NAME": "N.png",
              "DISPLAY_NAME_FRM": "color: #000000",
              "MEASURE_DIM_STEP": "",
              "FIELD_VALUE_COUNT": 6,
              "FILTER_VALUE_LIST": [],
              "STATUS_DESCRIPTION": "in dataset",
              "TYPE_STR_ICON_NAME": "string.png",
              "MEASURE_AVG_ICON_NAME": "N.png",
              "MEASURE_MAX_ICON_NAME": "N.png",
              "MEASURE_MIN_ICON_NAME": "N.png"
          },
          {
              "DIM": "Y",
              "CODE": "o,ErrorCause.FailureReason",
              "USED": "N",
              "VIEW": "N",
              "FOLDER": "Default",
              "ROW_ID": 164,
              "TYPE_STR": "string",
              "RELEVANCE": "3 Low",
              "FILTER_MAX": "",
              "FILTER_MIN": "",
              "DESCRIPTION": null,
              "FIELD_COUNT": 173,
              "IN_DATA_SET": "Y",
              "MEASURE_AVG": "N",
              "MEASURE_MAX": "N",
              "MEASURE_MIN": "N",
              "DISPLAY_NAME": "o,ErrorCause.FailureReason",
              "DIM_ICON_NAME": "N.png",
              "VIEW_ICON_NAME": "N.png",
              "DISPLAY_NAME_FRM": "color: #000000",
              "MEASURE_DIM_STEP": "",
              "FIELD_VALUE_COUNT": 5,
              "FILTER_VALUE_LIST": "",
              "STATUS_DESCRIPTION": "in dataset",
              "TYPE_STR_ICON_NAME": "string.png",
              "MEASURE_AVG_ICON_NAME": "N.png",
              "MEASURE_MAX_ICON_NAME": "N.png",
              "MEASURE_MIN_ICON_NAME": "N.png"
          },
          {
              "DIM": "Y",
              "CODE": "o,YYYY-MM-DD",
              "USED": "N",
              "VIEW": "N",
              "FOLDER": "Default",
              "ROW_ID": 677,
              "TYPE_STR": "string",
              "RELEVANCE": "3 Low",
              "FILTER_MAX": "",
              "FILTER_MIN": "",
              "DESCRIPTION": null,
              "FIELD_COUNT": 11476,
              "IN_DATA_SET": "Y",
              "MEASURE_AVG": "N",
              "MEASURE_MAX": "N",
              "MEASURE_MIN": "N",
              "DISPLAY_NAME": "o,YYYY-MM-DD",
              "DIM_ICON_NAME": "N.png",
              "VIEW_ICON_NAME": "N.png",
              "DISPLAY_NAME_FRM": "color: #000000",
              "MEASURE_DIM_STEP": "",
              "FIELD_VALUE_COUNT": 1,
              "FILTER_VALUE_LIST": [],
              "STATUS_DESCRIPTION": "in dataset",
              "TYPE_STR_ICON_NAME": "string.png",
              "MEASURE_AVG_ICON_NAME": "N.png",
              "MEASURE_MAX_ICON_NAME": "N.png",
              "MEASURE_MIN_ICON_NAME": "N.png"
            }
          ];

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
    .subscribe((data: any) => {
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

  cambioTipoMappa(ee) {
    if (ee || ee === 0) {
      this.UtilityPassata.scriveLog('Tipo Mappa 1:', ee);

      // if (e.id) {
        // this.impostazioni.layerMappa1 = e.id;
      this.impostazioni.mapType[0][0] = ee;
      // }
    }
  }

  cambioCoordinateDaClickSuMappa(e) {
    // // this.UtilityPassata.scriveLog('Coordinate su frame:', e);
    this.coordinateDaClickSuMappa.emit(e);
  }

  cambioZoom(e) {
    // // this.UtilityPassata.scriveLog('Zoom', e);
  }

  cambioBBOXO(e) {
    // this.UtilityPassata.scriveLog('Cambio BBOX Overview', e);
    this.bboxO = JSON.stringify(e);
  }

  cambioBboxOZ(f, q, e) {
    // // this.UtilityPassata.scriveLog('Cambio bboxOZ', f, q, e);
    if (this.impostazioni.bboxOZ && this.impostazioni.bboxOZ[f] && this.impostazioni.bboxOZ[f][q]) {
      this.impostazioni.bboxOZ[f][q] = e;
    }
  }

  cambioBBOXZ(e) {
    // this.UtilityPassata.scriveLog('Cambio BBOX Zoom', e);
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
}

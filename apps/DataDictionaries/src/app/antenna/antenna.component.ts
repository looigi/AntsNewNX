import { logConsole } from '../console-log';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { Component, Input, OnInit, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import Utils from '../Utilities.component';
import { DatePipe } from '@angular/common';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { PointLayerInfoComponent } from '../point_layer_info.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'antenna.component.html',
  selector: 'app-antenna',
  styleUrls: ['./antenna.component.css']
})

export class AntennaComponent implements OnInit, OnChanges {
  @Input() indirizzoServer;
  @Input() userName;
  @Input() cambiatoSetAntenne;
  @Input() netTechP;
  @Input() freeTextP;
  @Input() bandwidthP;
  @Input() dateFromP;
  @Input() dateToP;
  // @Input() viewModeP;
  @Input() viewModeP2;
  @Input() additionalLayer;
  @Input() codeLikeP;
  @Input() chP;
  @Input() bsicP;
  @Input() scrP;
  @Input() pciP;
  @Input() territoryP;
  @Input() slaValueGlobale;
  @Input() datiAddLayers;
  @Input() datiSla;
  @Input() datiSlaDT;
  @Input() exportKMLAttivo;
  @Input() syncGridToMap = true;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() sceltaGriglia = 'CellList';
  @Input() bUploadFile = false;
  @Input() puoCaricare = false;

  @Output() impostateDate: EventEmitter<string> = new EventEmitter<string>();
  @Output() cambioAdditionalLayer: EventEmitter<string> = new EventEmitter<string>();
  @Output() cambioAddLayer: EventEmitter<string> = new EventEmitter<string>();
  @Output() uploadFileChiuso: EventEmitter<string> = new EventEmitter<string>();  

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    // Chiude le sottoscrizioni con takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  public Utils = Utils;

  datiGriglia;
  debug2 = false;
  nomeGriglia = 'Antenna';
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  rigaSelezionata = null;
  rigaSelezionataPerCella;
  opacity = 20;
  addLayerSel;
  bboxMappa;
  appoBBox;
  syncGridToMap2 = true;
  frameName2 = '';
  mascheraScelta = 'CellList';
  
  antenne = undefined;
  nomeLayerAntenna = '';

  datiPointLayerInfo;
  caricamentoDatiInCorsoPointLayerInfo = false;
  NumeroFrame = 0;
  nomeGrigliaPLI = [ 'Point Layer Info' ];
  impostaSelezionePLI = new Array();
  effettuaAutoFitPLI = false;
  visualizzaToolTipGrafici = true;
  caricamentoPLI = false;

  datiGriglia2;
  nomeGriglia2 = 'Antenna 2';
  selezione2;
  effettuaAutoFit2 = false;
  caricamentoDatiInCorso2 = false;
  rigaSelezionata2 = null;
  rigaSelezionata22 = null;
  totRighe;
  refreshLegenda;

  datiGriglia21;
  nomeGriglia21 = 'Antenna 22';
  selezione21;
  effettuaAutoFit21 = false;
  caricamentoDatiInCorso21 = false;

  datiGriglia212;
  nomeGriglia212 = 'Antenna 222';
  selezione212;
  effettuaAutoFit212 = false;
  caricamentoDatiInCorso212 = false;
  vecchioAdditionalLayer;
  vecchioAddLayer;

  // netTech = '';
  // freeText = '';
  // bandwidth = '';
  // dateFrom = new Date(new Date().getTime() - (60 * 60 * 24 * 1000));
  // dateTo = new Date();

  offsetAttuale;
  nuovaPagina;
  offsetAttuale2;
  nuovaPagina2;
  refreshMappa = false;
  centro = '';
  nomeLayer = '';

  actSetIdScelto;
  actSetNameScelto;
  agnGroupID;
  agnGroup;
  actSetNameFM;
  coordinate;
  stringaAGNCode;
  lastDays2;
  lastCall = '';
  lastCall2 = '';
  lastCall21 = '';
  lastCall212 = '';
  lastCall3 = '';

  netTech;
  freeText;
  bandwidth = null;
  dateFrom;
  dateTo;
  // viewMode;
  viewMode2;
  parametriDD = '';
  additionalLayer2;
  codeLike= null;
  ch= null;
  bsic= null;
  scr= null;
  pci= null;
  territory = null;
  addLayerDiretto;
  ricaricaRaggi;
  pulisceLastCallAddLayers;

  validtyStartDate;
  puoCaricare2 = false;

  /* oggettiFutili = new Array();
  quantiFutili = 100;
  aFutile = 0;
  aFutile2 = 0;
  aFutile3 = 0;
  aFutile4 = 0;
  */

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    public sessionService: SessionService,
    private pointLayerInfo: PointLayerInfoComponent,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    // this.caricaTabella();
    // this.disegnaFutili();
    this.validtyStartDate = new Date().toString();
    this.antenne = 0;
  }

  /* disegnaFutili() {
    this.caricamentoDatiInCorso2 = true;
    const tm = setTimeout(() => {
      this.oggettiFutili = new Array();
      let cosa = 0;
      for (let i = 0; i <= this.quantiFutili; i++) {
        this.oggettiFutili.push({ codice: cosa });
        cosa++;
        if (cosa > 10) { cosa = 0; }
      }
      this.caricamentoDatiInCorso2 = false;
    }, 100);
  } */

  ngOnChanges(r) {
    let modifica = false;
    let modifica2 = false;

    if (r.bUploadFile !== undefined) {
      if (r.bUploadFile.currentValue === true) {
        this.apreUpload();
      } else {
        this.bUploadFile2 = false;
      }
    }

    if (r.sceltaGriglia) {
      if (r.sceltaGriglia.currentValue) {
        const m = r.sceltaGriglia.currentValue;
        this.mascheraScelta = m;
        this.Utils.scriveLog('Cambio scelta: ', m)
        // logConsole('Cambio scelta', m);
        modifica = true;
      }
    }

    if (r.cambiatoSetAntenne) {
      if (r.cambiatoSetAntenne.currentValue && r.cambiatoSetAntenne.currentValue !== null) {
        this.rigaSelezionata = r.cambiatoSetAntenne.currentValue;
        this.selezione = r.cambiatoSetAntenne.currentValue.ROW_ID;
        this.nomeLayer = r.cambiatoSetAntenne.currentValue.VALUE_STR;
        // logConsole('Cambiato set antenne: ' + this.nomeLayer);
        // this.Utils.scriveLog('Nuovo cambio antenna', r.cambiatoSetAntenne.currentValue, this.selezione, this.nomeLayer);
        modifica = true;
      } else {
        this.rigaSelezionata = undefined;
        this.selezione = [-1];
        this.nomeLayer = '';
      }
    }

    if (r.syncGridToMap !== undefined && r.syncGridToMap.currentValue !== undefined) {
      this.syncGridToMap2 = r.syncGridToMap.currentValue;
      if (this.syncGridToMap2 === true) {
        if (this.appoBBox) {
          this.Utils.scriveLog('Imposto Bbox appoggiata per sync:', this.appoBBox);
          this.bboxMappa = this.appoBBox;

          // this.caricaTabella2(this.rigaSelezionata);
        }
      }
    }

    if (r.netTechP) {
      this.netTech = r.netTechP.currentValue;
      // this.Utils.scriveLog('Refresh netTech', this.netTech);
      modifica = true;
    }

    if (r.freeTextP) {
      this.freeText = r.freeTextP.currentValue;
      // this.Utils.scriveLog('Refresh freeText', this.freeTextP);
      modifica = true;
    }

    if (r.bandwidthP) {
      if (r.bandwidthP.currentValue) {
        this.bandwidth = r.bandwidthP.currentValue;
        // this.Utils.scriveLog('Refresh bandwidth', this.bandwidthP);
      } else {
        this.bandwidth = null;
      }
      modifica = true;
    }

    if (r.dateFromP) {
      if (r.dateFromP.currentValue) {
        this.dateFrom = r.dateFromP.currentValue;
      }
      // this.Utils.scriveLog('Refresh dateFrom', this.dateFrom);
      modifica = true;
    }

    if (r.dateToP) {
      if (r.dateToP.currentValue) {
        this.dateTo = r.dateToP.currentValue;
      }
      // this.Utils.scriveLog('Refresh dateTo', this.dateToP);
      modifica = true;
    }

    if (r.additionalLayer) {
      this.additionalLayer2 = r.additionalLayer.currentValue;
      // this.Utils.scriveLog('Refresh additionalLayer', this.additionalLayer2);
      // modifica = true;
    }

    /* if (r.viewModeP) {
      this.viewMode = r.viewModeP.currentValue;
      // this.Utils.scriveLog('Refresh viewMode', this.viewMode);
      modifica = true;
    } */

    if (r.viewModeP2) {
      this.viewMode2 = r.viewModeP2.currentValue;
      this.datiGriglia21 = null; // 'empty grid';
      this.datiGriglia212 = null; // 'empty grid';
      // this.Utils.scriveLog('Refresh viewMode 2', this.viewMode2);
      modifica = true;
    }

    if (r.codeLikeP) {
      this.codeLike = r.codeLikeP.currentValue;
      // this.Utils.scriveLog('Refresh codeLike', this.codeLike);
      modifica = true;
    }

    if (r.chP) {
      this.ch = r.chP.currentValue;
      // this.Utils.scriveLog('Refresh ch', this.ch);
      modifica = true;
    }

    if (r.bsicP) {
      this.bsic = r.bsicP.currentValue;
      // this.Utils.scriveLog('Refresh bsic', this.bsic);
      modifica = true;
    }

    if (r.bsicP) {
      this.bsic = r.bsicP.currentValue;
      // this.Utils.scriveLog('Refresh bsic', this.bsic);
      modifica = true;
    }

    if (r.scrP) {
      this.scr = r.scrP.currentValue;
      // this.Utils.scriveLog('Refresh scr', this.scr);
      modifica = true;
    }

    if (r.pciP) {
      this.pci = r.pciP.currentValue;
      // this.Utils.scriveLog('Refresh pci', this.pci);
      modifica = true;
    }

    if (r.territoryP) {
      this.territory = r.territoryP.currentValue;
      // this.Utils.scriveLog('Refresh territory', this.territory);
      modifica = true;
    }

    if (this.puoCaricare2) {
      if (modifica) {
        this.costruisceQuery();
      }

    }
    if (r.puoCaricare) {
      if (r.puoCaricare.currentValue === true) {
        // logConsole('Puo caricare', r.puoCaricare.currentValue);
        const tt = setTimeout(() => {
          modifica = true;
          let q = 0;
          const t = setInterval(() => {
            // logConsole('Puo caricare. Nome Layer: ', this.nomeLayer);
            if (this.nomeLayer) {
              this.puoCaricare2 = r.puoCaricare.currentValue;
              clearInterval(t);

              this.costruisceQuery();
            } else {
              q++;
              if (q > 5) {
                clearInterval(t);
              }
            }
          }, 500);
        }, 2000);
      }      
    }
  }

  costruisceQuery() {
    // if (modifica) {
      let nt = '';
      let bw = '';
      let vm = '';
      let te = '';
      let pc = '';
      let sc = '';
      let bs = '';
      let ch = '';
      let cl = '';
      let ft = '';

      if (this.netTech && this.netTech !== '') {
        nt = '\'' + this.netTech + '\'';
      } else {
        nt = 'null';
      }
      if (this.bandwidth && this.bandwidth !== '') {
        bw = '\'' + this.bandwidth + '\'';
      } else {
        bw = 'null';
      }
      if (this.viewMode2 && this.viewMode2 !== '') {
        vm = '\'' + this.viewMode2 + '\'';
      } else {
        vm = 'null';
      }
      if (this.codeLike && this.codeLike !== '') {
        cl = '' + this.codeLike + '';
      } else {
        cl = 'null';
      }
      if (this.ch && this.ch !== '') {
        ch = '' + this.ch + '';
      } else {
        ch = null;
      }
      if (this.bsic && this.bsic !== '') {
        bs = '' + this.bsic + '';
      } else {
        bs = null;
      }
      if (this.scr && this.scr !== '') {
        sc = '' + this.scr + '';
      } else {
        sc = null;
      }
      if (this.pci && this.pci !== '') {
        pc = '' + this.pci + '';
      } else {
        pc = null;
      }
      if (this.territory && this.territory !== '') {
        te = '' + this.territory + '';
      } else {
        te = null;
      }
      if (this.freeText && this.freeText !== '') {
        ft = '' + this.freeText + '';
      } else {
        ft = null;
      }

      // this.Utils.scriveLog('Datelle:', this.dateFrom, this.dateTo);
      let from;
      try {
        from = this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd HH:mm:ss');
      } catch (e) {
        from = ''; // new Date(new Date().getTime() - (60 * 60 * 24 * 1000));
      }

      let fine;
      try {
        fine = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd HH:mm:ss');
      } catch (e) {
        fine = ''; // new Date(new Date().getTime() - (60 * 60 * 24 * 1000));
      }
      
      if (from !== '' && fine !== '') {
        this.parametriDD = nt + '§' + bw +
          '§\'' + from +
          '\'§\'' + fine + '\'§' + vm + '§' +
          te + '§' + pc + '§' + sc + '§' + bs + '§' + ch + '§' + cl + '§' + ft;
        // this.Utils.scriveLog('Parametri DD passati', this.parametriDD);
        // logConsole('Parametri', this.parametriDD, this.mascheraScelta);

        // this.datiGriglia2 = null; // 'empty grid';
        // this.datiGriglia21 = null; // 'empty grid';
        switch (this.mascheraScelta) {
          case 'CellList':
            this.refreshGrid2(0, false);
            break;
          case 'CellAnalysis':
            this.refreshGrid21(0, false);
            break;
          case 'CoverageFiles':
            this.refreshGrid212(0, false);
            break;
        }
      }
    // }
  }

  clickSuMappa(e) {
    // this.Utils.scriveLog(e);
    this.aggiornaPLI(e);
  }

  stringaRitornoPerClick = '';
  messaggioWarningPLI = '';

  stringaRitorno(e) {
    return;
    this.stringaRitornoPerClick = e; // .replace(/\\/g, '');
    // // logConsole('Arrivata stringa ritorno dopo click su mappa: ', this.stringaRitornoPerClick);

    this.caricamentoPLI = true;
    const tms = this.datePipe.transform(this.dateTo, 'yyyy-MM-dd HH:mm:ss'); // .Utils.tmsFine; // t.timeRangeDSFStop2;

    /* const params = {
      cntx_id: this.sessionService.getToken(),
      v_point_layer_features_list: this.stringaRitornoPerClick ,
      v_tms: tms
    } */
    const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_point_layer_features_list": ' + this.stringaRitornoPerClick + ','  +
      '"v_tms": "' + tms + '"' +
    '}'    
    // if (this.debug2 === true) {
    // // logConsole('Ritorno letture Layers: ', JSON.parse(params));
    // }
    this.apiService.chiamataPost('geo_point_layer_list__grid', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      if (data2 && data2.headers) {
        const head = data2.headers.get('server');
        // // logConsole(data, head);
      }
      try {
        // const data2 = data.json();
        Utils.checkRitornoChiamata(this, data2);
        if (data2 && data2 !== null) {
          this.frameName2 = data2.GridProperty[0].GridName;

          // const data = data2; // [0].geo_measure_dfn__grid);
          // // logConsole('Point info:', t.datiPointMeasures, data2);
          if (this.datiPointLayerInfo && this.datiPointLayerInfo.DataTable && data2.DataTable) {
            // // logConsole('Aggiorno valori');
            this.datiPointLayerInfo.DataTable = data2.DataTable;
            // t.effettuaAutoFitPM = !t.effettuaAutoFitPM;
          } else {
            // // logConsole('Riscrivo valori');
            this.datiPointLayerInfo = data2;
            this.effettuaAutoFitPLI = !this.effettuaAutoFitPLI;
          }
        }
      } catch (e) {

      }

      this.caricamentoPLI = false;
    });
  }

  dragEnd1(e) {
    // // this.Utils.scriveLog('Drag finestre');
    this.refreshMappa = !this.refreshMappa;
  }

  dragEnd2(e) {
    // // this.Utils.scriveLog('Drag finestre');
    this.refreshMappa = !this.refreshMappa;
  }

  dragEnd3(e) {
    // // this.Utils.scriveLog('Drag finestre');
    this.refreshMappa = !this.refreshMappa;
  }

  /*
  caricaTabella() {
    const nomeTabella = 'geo_lookup__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_category: 'antenna_set_name'
    };

    this.rigaSelezionata = null;

    this.caricamentoDatiInCorso = true;
    this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response.json())
    .subscribe(data => {
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(data);
        // // this.Utils.scriveLog(data);
        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && data.DataTable) {
          if (data.DataTable.length > 0) {
            this.datiGriglia.DataTable = JSON.parse(JSON.stringify(data.DataTable));
          } else {
            this.datiGriglia = 'empty grid';
          }
        } else {
          this.datiGriglia = null;
          const tm = setTimeout(() => {
            this.datiGriglia = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit = !this.effettuaAutoFit;
            const tm = setTimeout(() => {
              if (this.datiGriglia && this.datiGriglia.DataTable && this.datiGriglia.DataTable.length > 0) {
                this.rigaSelezionata = this.datiGriglia.DataTable[0];
                this.selezione = this.rigaSelezionata.ROW_ID;
                this.nomeLayer = this.rigaSelezionata.VALUE_STR;
                this.caricaTabella2Inizio(this.rigaSelezionata);
              }
            }, 1000);
          }, 10);
        }
      } else {
        this.datiGriglia = null;
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      this.datiGriglia = null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  clickSelezione(e) {
    // // this.Utils.scriveLog(e);
    this.nomeLayer = e[0].VALUE_STR;
    this.rigaSelezionata = e[0];
    this.caricaTabella2Inizio(e[0]);
  }

  lastSelectedOfGrid(e) {

  }

  refreshGrid1(e) {
    // this.caricaTabella();
  }
  */

  haCaricatoLaPrima = false;

  caricaTabella2Inizio_NonPiuUsata(e) {
    if (!e || e === null || !this.viewMode2) {
      return;
    }
    // this.Utils.scriveLog('Sync Grid to Map:', this.syncGridToMap)

    let codice = '';
    if (e && e !== null && e.VALUE_STR) {
      codice = e.VALUE_STR;
    } else {
      if (e !== null && e[0] && e[0] !== null && e[0].VALUE_STR) {
        codice = e[0].VALUE_STR;
      } else {
        // this.Utils.scriveLog(e);
        // alert('ppp');
      }
    }

    let bbox;
    if (this.syncGridToMap2 === true) {
      if (this.bboxMappa) {
        // "BOX(13.208284850374678,37.91071753430228,13.859163518074931,38.155560063105014)"
        bbox = 'BOX(' + this.bboxMappa[0] + ',' + this.bboxMappa[1] + ',' + this.bboxMappa[2] + ',' + this.bboxMappa[3] + ')';
      } else {
        bbox = null;
      }
    } else {
      bbox = null;
    }
    if (!bbox || bbox === null || (bbox && bbox.indexOf('undefined') > -1)) {
      this.Utils.scriveLog('Esco per BBOX Antenna2_grid errata: ', bbox);
      return;
    }
    
    const nomeTabella = 'antenna__grid2';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_antenna_set_name: codice,
      v_tms_start: this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd HH:mm:ss'),
      v_tms_end: this.datePipe.transform(this.dateTo, 'yyyy-MM-dd HH:mm:ss'),
      v_net_tech: !this.netTech || this.netTech === 'null' ? null : this.netTech,
      v_free_text_filter: this.freeText,
      v_band: this.bandwidth,
      v_view_mode: this.viewMode2,
      v_row_offset: -1,
      v_row_limit: Utils.limitPerVirtual,
      v_code: this.codeLike,
      v_ch: !this.ch || this.ch === 'null' ? null : this.ch,
      v_bsic: !this.bsic || this.bsic === 'null' ? null : this.bsic,
      v_scr: !this.scr || this.scr === 'null' ? null : this.scr,
      v_pci: !this.pci || this.pci === 'null' ? null : this.pci,
      v_territory: this.territory,
      v_bbox: bbox
    };
    // // logConsole('parametri di lettura nuovi', JSON.stringify(params));
    // // logConsole('parametri di lettura vecchi', this.lastCall);
    if (this.lastCall === JSON.stringify(params)) {
      return;
    }
    this.haCaricatoLaPrima = true;

    // this.Utils.scriveLog('parametri di lettura', JSON.stringify(params) === this.lastCall);
    this.lastCall = JSON.stringify(params);

    this.rigaSelezionata2 = null;
    this.offsetAttuale = 0;

    this.caricamentoDatiInCorso2 = true;
    // this.datiGriglia2 = 'empty grid'; // null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        // // logConsole('Lettura generale antenna', data, e);
        this.totRighe = data.tot_rows;
        // alert(this.totRighe);
        this.caricaTabella2(e, 'DA QUI NO!');
      } else {
        this.datiGriglia2 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      // this.datiGriglia2 = null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  warningAE = '';

  caricaTabella2(e, daDove) {
    // logConsole('Ricarico tabella', e, daDove);
    if (e === null) {
      // logConsole('Esco carica tabella2');
      return;
    }
    
    let codice = '';
    if (e && e !== null && e.VALUE_STR) {
      codice = e.VALUE_STR;
    } else {
      if (e !== null && e && e[0] && e[0] !== null && e[0].VALUE_STR) {
        codice = e[0].VALUE_STR;
      } else {
        // this.Utils.scriveLog(e);
        // alert('ppp');
      }
    }

    let bbox;
    if (this.syncGridToMap2 === true) {
      if (this.bboxMappa) {
        // "BOX(13.208284850374678,37.91071753430228,13.859163518074931,38.155560063105014)"
        bbox = 'BOX(' + this.bboxMappa[0] + ',' + this.bboxMappa[1] + ',' + this.bboxMappa[2] + ',' + this.bboxMappa[3] + ')';
      } else {
        bbox = null;
      }
    } else {
      bbox = null;
    }
    if (!bbox || bbox === null || bbox.indexOf('undefined') > -1) {
      this.Utils.scriveLog('Esco per BBOX Antenna2_grid errata: ', bbox);
      this.caricamentoDatiInCorso2 = false;
      // return;
    }

    const nomeTabella = 'antenna__grid2';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_antenna_set_name: codice,
      v_tms_start: this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd HH:mm:ss'),
      v_tms_end: this.datePipe.transform(this.dateTo, 'yyyy-MM-dd HH:mm:ss'),
      v_net_tech: !this.netTech || this.netTech === 'null' ? null : this.netTech,
      v_free_text_filter: this.freeText,
      v_band: this.bandwidth,
      v_view_mode: this.viewMode2,
      v_row_offset: 0, // this.offsetAttuale,
      v_row_limit: Utils.limitPerVirtual,
      v_code: this.codeLike,
      v_ch: !this.ch || this.ch === 'null' ? null : this.ch,
      v_bsic: !this.bsic || this.bsic === 'null' ? null : this.bsic,
      v_scr: !this.scr || this.scr === 'null' ? null : this.scr,
      v_pci: !this.pci || this.pci === 'null' ? null : this.pci,
      v_territory: this.territory,
      v_bbox: bbox
    };
    if (this.lastCall2 === JSON.stringify(params)) {
      return;
    }
    this.lastCall2 = JSON.stringify(params);
    // this.Utils.scriveLog('Parametri di ricerca antenna__grid2', params);
    logConsole('Chiamata', params);

    // const inizio = new Date().getTime();
    // this.Utils.scriveLog('Inizio chiamata', inizio);

    this.caricamentoDatiInCorso2 = true;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      if (data && data !== null) {

        /* const fine = new Date().getTime();
        this.Utils.scriveLog('Fine chiamata', fine);
        this.Utils.scriveLog('Fine chiamata', fine - inizio); */

        Utils.checkRitornoChiamata(this, data);

        // logConsole('Dati antenne', data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.warningAE = data.v_grid_msg;
        } else {
          this.warningAE = '';
        }
        
        // alert('Numero righe: ' + this.totRighe);
        // data.GridProperty.rowCount = this.totRighe;
        data.GridProperty[0].rowCount = this.totRighe;
        // this.offsetAttuale = 0;

        // // logConsole('Righe rilevate', data);
        if (this.datiGriglia2 && this.datiGriglia2 !== 'empty grid' && this.datiGriglia2.DataTable
          && this.datiGriglia2.DataTable.length > 0 && data.DataTable) {
          // this.Utils.scriveLog('Aggiorno griglia', data);
          this.datiGriglia2.DataTable = JSON.parse(JSON.stringify(data.DataTable));
        } else {
          // this.datiGriglia2 = null;
          this.datiGriglia2 = JSON.parse(JSON.stringify(data));
          /* const tm = setTimeout(() => {
            // this.Utils.scriveLog('Imposto griglia', data);
            this.effettuaAutoFit2 = !this.effettuaAutoFit2;
          }, 10); */
        }
        // // logConsole('Tot righe', this.totRighe);
        this.caricamentoDatiInCorso2 = false;
      } else {
        this.datiGriglia2 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      // this.datiGriglia2 = null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  clickSelezione2(e) {
    if (e && e[0]) {
      if (e[0].GEO_CENTER !== null) {
        this.centro = e[0].GEO_CENTER + ';' + new Date();
        this.rigaSelezionata2 = e;
        this.rigaSelezionataPerCella = e[0];
        // // this.Utils.scriveLog(this.rigaSelezionataPerCella);
      }
    }
  }

  cambioPagina(e) {
    return;
    
    this.nuovaPagina = +e.skip;
    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (e.skip === this.nuovaPagina) {
        // // this.Utils.scriveLog(e.skip, e.take);
        this.offsetAttuale = e.skip;
        // this.pulisceSelezione = !this.pulisceSelezione;
        // this.paginaGriglia = this.offsetAttuale / Utils.limitPerVirtual;
        // // this.Utils.scriveLog('Pagina', this.nuovaPagina, this.rigaSelezionata);
        this.caricaTabella2(this.rigaSelezionata, 'NON PIU');
      }
    }, 500);
  }

  lastSelectedOfGrid2(e) {

  }

  refreshGrid2(e, r) {
    // this.Utils.scriveLog('Refresh griglia');
    this.lastCall = '';
    this.lastCall2 = '';
    if (r === true) {
      this.datiGriglia2 = undefined;
    }
    this.caricaTabella2(this.rigaSelezionata, 'Refresh');
  }

  messaggioWarning21 = '';

  caricaTabella21Inizio() {
    if (!this.nomeLayer || !this.viewMode2) {
      return;
    }

    const nomeTabella = 'antenna_analysis__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_antenna_set_name: this.nomeLayer,
      v_band: this.bandwidth,
      v_free_text_filter: this.freeText,
      v_net_tech: this.netTech,
      v_tms_start: this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd HH:mm:ss'),
      v_tms_end: this.datePipe.transform(this.dateTo, 'yyyy-MM-dd HH:mm:ss'),
      v_view_mode: this.viewMode2,
    };
    this.Utils.scriveLog('parametri di lettura 2', params);
    if (this.lastCall3 === JSON.stringify(params)) {
      return;
    }
    this.lastCall3 = JSON.stringify(params);

    this.caricamentoDatiInCorso21 = true;
    // this.datiGriglia2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        // // this.Utils.scriveLog(data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning21 = data.v_grid_msg;
        } else {
          this.messaggioWarning21 = '';
        }

        if (this.datiGriglia21 && this.datiGriglia21 !== 'empty grid' && this.datiGriglia21.DataTable
          && this.datiGriglia21.DataTable.length > 0 && data.DataTable) {
          // this.Utils.scriveLog('Aggiorno griglia 2', data);
          this.datiGriglia21.DataTable = JSON.parse(JSON.stringify(data.DataTable));
        } else {
          // this.datiGriglia2 = null;
          this.datiGriglia21 = JSON.parse(JSON.stringify(data));
          /* const tm = setTimeout(() => {
            // this.Utils.scriveLog('Imposto griglia 2', data);
            this.effettuaAutoFit21 = !this.effettuaAutoFit21;
          }, 10); */
        }
        this.caricamentoDatiInCorso21 = false;
      } else {
        this.datiGriglia21 = 'empty grid';
        this.caricamentoDatiInCorso21 = false;
      }
    }, error => {
      this.caricamentoDatiInCorso21 = false;
      // this.datiGriglia2 = null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  clickSelezione21(e) {
    if (e && e[0]) {
      if (e[0].GEO_CENTER !== null) {
        // this.centro = e[0].GEO_CENTER + ';' + new Date();
        // this.rigaSelezionata21 = e;
      }
      if (e[0].LAYER_PATH) {
        let dom = new Date(e[0].FILE_DATE).getTime();
        dom += (60 * 60 * 24 * 1000);
        const domani = this.datePipe.transform(dom, 'yyyy-MM-dd HH:mm:ss', 'UTC');

        // // this.Utils.scriveLog(this.datiAddLayers);
        let misura = '';
        this.datiAddLayers.forEach(element => {
          if (element.CODE_STR === e[0].LAYER_NAME) {
            misura = element.MEASURE_CODE;
          }
        });

        this.addLayerDiretto = e[0].LAYER_PATH + '§' + e[0].FILE_DATE + '§' + domani + '§' + misura + '§' + this.opacity;
        this.impostateDate.emit(e[0].FILE_DATE + '§' + domani + '§' + misura);
        // this.Utils.scriveLog('Layer diretto 1:', e);
        // this.Utils.scriveLog('Layer diretto 2:', this.addLayerDiretto);
      }
    }
  }

  messaggioWarning212 = '';

  caricaTabella212Inizio() {
    if (!this.nomeLayer || !this.viewMode2) {
      return;
    }

    const nomeTabella = 'antenna_analysis__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_antenna_set_name: this.nomeLayer,
      v_band: this.bandwidth,
      v_free_text_filter: this.freeText,
      v_net_tech: this.netTech,
      v_tms_start: this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd HH:mm:ss'),
      v_tms_end: this.datePipe.transform(this.dateTo, 'yyyy-MM-dd HH:mm:ss'),
      v_view_mode: 'coverage_files',
    };
    // this.Utils.scriveLog('parametri di lettura 22', params);
    if (this.lastCall3 === JSON.stringify(params)) {
      return;
    }
    this.lastCall3 = JSON.stringify(params);

    this.caricamentoDatiInCorso212 = true;
    // this.datiGriglia2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        // // this.Utils.scriveLog(data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning212 = data.v_grid_msg;
        } else {
          this.messaggioWarning212 = '';
        }

        if (this.datiGriglia212 && this.datiGriglia212 !== 'empty grid' && this.datiGriglia212.DataTable
          && this.datiGriglia212.DataTable.length > 0 && data.DataTable) {
          // this.Utils.scriveLog('Aggiorno griglia 2', data);
          this.datiGriglia212.DataTable = data.DataTable;
        } else {
          // this.datiGriglia2 = null;
          this.datiGriglia212 = JSON.parse(JSON.stringify(data));
          /* const tm = setTimeout(() => {
            // this.Utils.scriveLog('Imposto griglia 2', data);
            this.effettuaAutoFit212 = !this.effettuaAutoFit212;
          }, 10); */
        }
        this.caricamentoDatiInCorso212 = false;
      } else {
        this.datiGriglia212 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso212 = false;
      // this.datiGriglia2 = null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  clickSelezione212(e) {
    if (e && e[0]) {
      if (e[0].FILE_DATE === undefined || e[0].FILE_DATE === null) {
        return;
      }
      if (e[0].GEO_CENTER !== null) {
        // this.centro = e[0].GEO_CENTER + ';' + new Date();
        // this.rigaSelezionata21 = e;
      }
      if (e[0].LAYER_PATH) {
        let dom = new Date(e[0].FILE_DATE).getTime();
        dom += (60 * 60 * 24 * 1000);
        const domani = this.datePipe.transform(dom, 'yyyy-MM-dd HH:mm:ss', 'UTC');

        // // this.Utils.scriveLog(this.datiAddLayers);
        let misura = '';
        this.datiAddLayers.forEach(element => {
          if (element.CODE_STR === e[0].LAYER_NAME) {
            misura = element.MEASURE_CODE;
          }
        });

        // this.addLayerDiretto = e[0].LAYER_PATH + '§' + e[0].FILE_DATE + '§' + domani + '§' + misura + '§' + this.opacity;

        this.pulisceLastCallAddLayers = new Date();

        this.impostateDate.emit(e[0].FILE_DATE + '§' + domani + '§' + misura);
        this.addLayerSel = JSON.stringify(e[0]);
        this.cambioAddLayer.emit(e);

        this.Utils.scriveLog('Layer diretto 1:', e);
        // this.Utils.scriveLog('Layer diretto 2:', this.addLayerDiretto);
      }
    }
  }

  cambiaOpacity(e) {
    this.Utils.scriveLog('Cambio opacity', e);
    this.opacity = e;
    if (this.addLayerDiretto) {
      const a = this.addLayerDiretto.split('§');
      this.addLayerDiretto = a[0] + '§' + a[1] + '§' + a[2] + '§' + a[3] + '§' + this.opacity;
      this.impostateDate.emit(a[1] + '§' + a[2] + '§' + a[3]);
    }
    // this.Utils.scriveLog('Layer diretto 2 per cambio opacità:', this.addLayerDiretto);
  }

  cambioPagina2(e) {
    this.nuovaPagina2 = +e.skip;
    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (e.skip === this.nuovaPagina2) {
        // // this.Utils.scriveLog(e.skip, e.take);
        // this.offsetAttuale21 = e.skip;
        // this.pulisceSelezione = !this.pulisceSelezione;
        // this.paginaGriglia = this.offsetAttuale / Utils.limitPerVirtual;
        // // this.Utils.scriveLog('Pagina', this.nuovaPagina, this.rigaSelezionata);
        this.caricaTabella21Inizio();
      }
    }, 500);
  }

  lastSelectedOfGrid21(e) {

  }

  refreshGrid21(e, r) {
    // this.Utils.scriveLog('Refresh griglia 2', this.rigaSelezionata2);
    this.lastCall3 = '';
    if (r === true) {
      this.datiGriglia21 = undefined;
    }
    this.caricaTabella21Inizio();
  }

  lastSelectedOfGrid212(e) {

  }

  refreshGridPLI(e, r) {
    if (r === true) {
      this.datiPointLayerInfo = undefined;
    }
    // this.caricaTabella212Inizio();
  }

  refreshGrid212(e, r) {
    // this.Utils.scriveLog('Refresh griglia 22', this.rigaSelezionata22);
    this.lastCall3 = '';
    if (r === true) {
      this.datiGriglia212 = undefined;
    }
    this.caricaTabella212Inizio();
  }

  onTabSelect(e) {
    // // this.Utils.scriveLog('Cambio pagina', e);
    if (e.index === 2) {
      this.vecchioAdditionalLayer = this.additionalLayer2;
      this.cambioAdditionalLayer.emit('NONE');
      this.addLayerDiretto = this.vecchioAddLayer;
    } else {
      if (this.vecchioAdditionalLayer) {
        this.vecchioAddLayer = this.addLayerDiretto;
        this.addLayerDiretto = 'NONE§§§§';
        this.additionalLayer2 = this.vecchioAdditionalLayer;
        this.cambioAdditionalLayer.emit(this.additionalLayer2.VALUE_STR);
      }
    }
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
      this.Utils.scriveLog('The dialog was closed', result);
      // this.animal = result;
    });
  }

  aggiornaPLI(coordinate) {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (coordinate) {
        // this.debug2 = true;
        this.pointLayerInfo.prendePointLayerInfo(this, coordinate);
      }
    }, 10);
  }

  clickRigaPLI(e) {
    // this.Utils.scriveLog(e);
    this.pulisceLastCallAddLayers = new Date();
    this.addLayerSel = JSON.stringify(e[0]);
    this.cambioAddLayer.emit(e);
    this.ricaricaRaggi = e[0];
  }

  riempieArraySelezionePLI(e) {
    this.Utils.scriveLog(e);
  }

  dimensioniGriglia(e) {
    this.Utils.scriveLog(e);
  }

  cambioRicaricaRaggi(e) {
    this.ricaricaRaggi = e;
  }

  passaggioValoriLegenda(e) {
    if (e) {
      this.Utils.scriveLog('Passaggio valori legenda', e);
      const ee = e.split('§');
      this.refreshLegenda = this.addLayerSel + '§' + ee[0] + '§' + new Date().getTime();
    }
  }

  cambioBBOX(e) {
    this.Utils.scriveLog('Cambio Bbox:', e);
    logConsole('bbox arrivata', e);
    if (this.syncGridToMap2 === true) {
      this.Utils.scriveLog('Cambio Bbox con sync:', e);
      this.bboxMappa = e;

      if (!this.haCaricatoLaPrima) {
        this.haCaricatoLaPrima = true;
        this.bboxMappa = e;
      }
    } else {
      this.Utils.scriveLog('Appoggio Bbox per sync:', e);
      this.appoBBox = e;
    }
  }

  esegueSpostamentoMappa() {
    // logConsole('Click lente');
    this.caricaTabella2(this.rigaSelezionata, "Spostamento");
  }

  cambioPagina22(e) {
  }


  // UPLOAD
  file: File | null = null;
  nomeFile = '';
  nomeFile2 = '';
  estensione = '';
  bUploadFile2 = false;
  folderFile = '';
  descriptionFile = '';
  bMascheraLTP = false;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  staFacendoUpload = false;

  checkEdge(event) {
    this.edge = event;
    // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'edge:', event);
  }

  apreUpload() {
    // alert('Apre');
    this.file = undefined;
    this.nomeFile = '';
    this.bUploadFile2 = true;
    this.folderFile = '';
    this.nomeFile2 = '';
    this.estensione = '';
    this.descriptionFile = '';
  }

  onSelectFile(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.name.toUpperCase().indexOf('.JSON') === -1) {
        // ExternalUtilities.visualizzaAlert('Not a valid file');
        alert('Not a valid file');

        return;
      }

      this.file = file;
      this.nomeFile = file.name;
      this.nomeFile2 = file.name;
      for (let i = this.nomeFile2.length - 1; i > 0; i--) {
        if (this.nomeFile2.substring(i, i + 1) === '.') {
          this.estensione = '.' + this.nomeFile2.substring(i + 1, this.nomeFile2.length);
          this.nomeFile2 = this.nomeFile2.substring(0, i);
          break;
        }
      }

      // this.onUpload();
    }
  }

  impostaTimeVSD(d) {
    this.validtyStartDate = d;
  }
  
  onUpload() {
    if (!this.nomeFile2 || this.nomeFile2.length === 0) {
      alert('Insert a file name');

      return;
    }
    if (this.nomeFile2.length > 49) {
      alert('File name too long');

      return;
    }

    /* let v_config = '';
    let idDashboard = 'null';

    if (this.estensione.toUpperCase().trim() === '.DOCX') {
      idDashboard = this.dashboardSelected['ID'];

      v_config = '{';
      // v_config += '"DashboardName": "' + this.dashboardSelected['NAME'] + '", ';
      v_config += '"PageList": [';

      const selezionate = this.listToPrint.impostaSelezioneLTP;

      selezionate.forEach(element => {
        v_config += element.toString() + ',';
      });
      v_config = v_config.substring(0, v_config.length - 1);
      v_config += ']';
      v_config += '}';
    } */
    // // logConsole('v_config', v_config);
    // return;

    this.staFacendoUpload = true;

    const reader = new FileReader();
    reader.onloadend = () => {
      /* let base64String = reader.result as string;
      if (base64String.indexOf('base64') >= 0) {
        const b = base64String.split('base64');
        base64String = b[1].substring(1, b[1].length);
      } */
      let jsonString = reader.result as string;
      const b = jsonString.split('base64');
      jsonString = b[1].substring(1, b[1].length);
      const decodedStringAtoB = atob(jsonString);

      // const sess = 'd0d78612-ad74-11eb-8529-0242ac130003';
      const sess = this.sessionService.getToken();

      const tms = this.datePipe.transform(this.validtyStartDate, 'yyyy-MM-dd HH:mm:ss');

      const params = '{' +
        '"v_cntx": "' + sess + '",' +
        '"v_file_name": "' + this.nomeFile2 + this.estensione + '",' +
        '"v_file_content_bytea": ' + decodedStringAtoB + ',' +
        '"v_file_type":  "antenna_loaded_gui",' +
        '"v_loaded_tms":  "' + tms + '" ' +
      '}';
      // // logConsole('UPLOAD:', JSON.parse(params));
      // return;

      this.apiService.chiamataPost('file_imp__ins', JSON.parse(params))
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        this.staFacendoUpload = false;

        if (data2 && data2 !== null) {
          // alert('data2.v_err_code: ' + data2[0].v_err_code);
          if (+data2.err_code !== 0) {
            const rr = data2.failure_reason;
            alert(rr);
          } else {
            alert('Report uploaded');

            this.uploadFileChiuso.emit(new Date().toString());
          }
        }
      }, error => {
        alert('Read look up:' + error);
      });      
    }
    if (this.file) {
      reader.readAsDataURL(this.file);
    }
  }

  chiudeUpload() {
    this.uploadFileChiuso.emit(new Date().toString());
  }

  ritornoDimensioniColonneGriglia2(e) {
    Utils.scriveDimensioniColonne('Griglia2', e);
  }

  ritornoDimensioniColonneGriglia21(e) {
    Utils.scriveDimensioniColonne('Griglia21', e);
  }

  ritornoDimensioniColonneGriglia212(e) {
    Utils.scriveDimensioniColonne('Griglia212', e);
  }

  ritornoDimensioniColonnePLI(e) {
    Utils.scriveDimensioniColonne('PLI', e);
  }
}

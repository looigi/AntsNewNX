import { logConsole } from '../console-log';
// import { FileSaverService } from 'ngx-filesaver';
import { DatePipe } from '@angular/common';
import { Component, SimpleChanges, OnInit, AfterViewInit, OnChanges, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// import { TCRunInfoComponent } from '../elaborations/traceinfo.component';
import ExternalUtilities from '../ExternalUtilities.component';
import { ExternalApiService } from '../services/externalapi.service';
// import Utils from '../Utilities.component';
import download from 'downloadjs';  // Importa downloadjs
// import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcruninfo-component',
  templateUrl: 'traceruninfo.component.html',
  styleUrls: ['./traceruninfo.style.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush, // AGGIUNTO PER MEMORY LEAKES
  encapsulation: ViewEncapsulation.None
})

export class TraceRunInfoComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  destroy$ = new Subject<void>();

  static lastCallTrace = ['', '', '', '', '', '', '', '', '', '', ''];
  vecchioDatiJsonInfo;
  vecchioDatiJsonFile;
  vecchioTab = 0;

  @Input() Utils;
  @Input() Log;
  @Input() sessionID;
  @Input() debug = false;
  @Input() userName;
  @Input() nomeGrigliaTII;
  @Input() nomeGrigliaTIF;
  @Input() selezionatoTII;
  @Input() selezionatoTIF;
  @Input() numeroFrame;
  // @Input() effettuaAutoFitInfo = false;
  // @Input() effettuaAutoFitFile = false;
  // @Input() caricamentoTcRunInCorso = false;
  @Input() leggeDati;
  @Input() frameAttuale;
  @Input() righePerPaginazioneAutomatica = -1;
  @Input() indirizzoServer;
  @Input() listaWorkspaces;
  @Input() operatorID;
  @Input() groupName;
  @Input() urlRoot;
  @Input() pulisceAppoggi;
  @Input() modalitaRealTimeAttiva = false;
  @Input() AgnOAct;
  @Input() tcRunID;
  @Input() actId;
  @Input() pulisce;
  @Input() mascheraTcRunVisibile = false;
  @Input() refresh;

  @Output() cambioTmsSelezionato: EventEmitter<string> = new EventEmitter<string>();
  @Output() datiPerAI: EventEmitter<any> = new EventEmitter<any>();

  // @Output() clickRigaEmit: EventEmitter<string> = new EventEmitter<string>();

  // private destroy$ = new Subject<void>();

  listaWorkspaces2;

  caricamentoTcRunInCorso1 = false;
  caricamentoTcRunInCorso2 = false;
  datiTcRunFile;
  datiTcRunInfo;
  userName2;
  nomeGrigliaTII2 = 'TcRun Info';
  selezionatoTII2;
  nomeGrigliaTIF2 = 'TcRun Files';
  selezionatoTIF2;
  numeroFrame2;
  effettuaAutoFitInfo = false;
  effettuaAutoFitFile = false;
  vecchioTcRun = '';
  tcrunSelezionato;

  leggeDati2;
  AgnOAct2;
  sessionID2;
  tcRunID2;
  actId2;

  constructor(
    // private fileSaver: FileSaverService,
    private apiService: ExternalApiService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();    
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  pulisceAppoggiF() {
    this.datiTcRunInfo = undefined; // 'empty grid';
    this.datiTcRunFile = undefined; // 'empty grid';
    this.vecchioDatiJsonInfo = undefined;
    this.vecchioDatiJsonFile = undefined;
  }

  ngOnChanges(changes): void {
    if (changes.pulisceAppoggi) {
      this.pulisceAppoggiF();
    }

    // let ricarica = false;

    if (changes.mascheraTcRunVisibile) {
      if (changes.mascheraTcRunVisibile.currentValue === true) {
        // alert('ppp');
        // ricarica = true;
      }
    }

    if (changes.actId) {
      if (changes.actId.currentValue) {
        this.actId2 = changes.actId.currentValue;
      }
    }

    if (changes.AgnOAct) {
      if (changes.AgnOAct.currentValue) {
        this.AgnOAct2 = changes.AgnOAct.currentValue;
        // ricarica = true;
        // alert(this.AgnOAct2);
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Info: Arrivato agnoact nuovo', this.AgnOAct2);
      }
    }

    if (changes.leggeDati) {
      if (changes.leggeDati.currentValue) {
        this.leggeDati2 = changes.leggeDati.currentValue;
        // ricarica = true;
      }
    }

    if (changes.sessionID) {
      if (changes.sessionID.currentValue) {
        this.sessionID2 = changes.sessionID.currentValue;
        // ricarica = true;
      }
    }

    /* if (changes.effettuaAutoFitInfo) {
      this.effettuaAutoFitInfo2 = !this.effettuaAutoFitInfo2; // changes.effettuaAutoFitInfo.currentValue;
    }

    if (changes.effettuaAutoFitFile) {
      this.effettuaAutoFitFile2 = !this.effettuaAutoFitFile2; //  changes.effettuaAutoFitFile.currentValue;
    }

    if (changes.datiTcRunFile) {
      // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Cambiati dati file', changes.datiTcRunFile.currentValue);
      this.datiTcRunFile2 = changes.datiTcRunFile.currentValue;
      if (this.datiTcRunFile2 !== null) {
        // Necessario per visualizzare la prima griglia al primo caricamento
        /* if (this.primaVolta === true) {
          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.tabSelezionato = 1;
            const tm = setTimeout(() => {
          clearTimeout(tm);
              this.tabSelezionato = 0;
            }, 500);
          }, 500);
          this.primaVolta = false;
        } //
        // Necessario per visualizzare la prima griglia al primo caricamento
      }
    }
    if (changes.datiTcRunInfo) {
      // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Cambiati dati info', changes.datiTcRunInfo.currentValue);
      this.datiTcRunInfo2 = changes.datiTcRunInfo.currentValue;
    } */
    if (changes.userName) {
      this.userName2 = changes.userName.currentValue;
    }
    if (changes.nomeGrigliaTII) {
      this.nomeGrigliaTII2 = changes.nomeGrigliaTII.currentValue;
    }
    if (changes.nomeGrigliaTIF) {
      this.nomeGrigliaTIF2 = changes.nomeGrigliaTIF.currentValue;
    }
    if (changes.selezionatoTII) {
      this.selezionatoTII2 = changes.selezionatoTII.currentValue;
    }
    if (changes.selezionatoTIF) {
      this.selezionatoTIF2 = changes.selezionatoTIF.currentValue;
    }
    if (changes.numeroFrame) {
      this.numeroFrame2 = changes.numeroFrame.currentValue;
    }
    if (changes.listaWorkspaces && changes.listaWorkspaces.currentValue) {
      this.listaWorkspaces2 = changes.listaWorkspaces.currentValue;
      // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Lista workspaces', this.listaWorkspaces2);
    }

    if (changes.tcRunID) {
      if (changes.tcRunID.currentValue) {
        this.tcRunID2 = changes.tcRunID.currentValue;
        // ricarica = true;
      }
    }

    if (changes.pulisce) {
      if (changes.pulisce.currentValue) {
        // ricarica = false;
        this.datiTcRunInfo = 'empty grid';
        this.datiTcRunFile = 'empty grid';
      }
    }

    // logConsole('Prende dati tcrun 0', changes.refresh, this.leggeDati2);

    if (changes.refresh) {
      if (changes.refresh.currentValue) {
        if (this.leggeDati2 !== undefined) {
          this.prendeDatiTcRun(this.frameAttuale, this.leggeDati2);
        }
      }
    }
  }

  /* onTabSelect(e) {
    // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Tab premuto:', e);
    this.tabSelezionato = e.index;
  } */

  /* clickRigaTI(e) {
    this.clickRigaEmit.emit(e);
  } */

  clickRigaINFO(e) {
    this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, e);
    this.tcrunSelezionato = e;
    const tms = e[0].TAG_VALUE_STR;
    // this.Utils.tmsSelezionato = tms;
    // this.cambioTmsSelezionato.emit(tms + ';tcRun');
  }

  mostraPopup = false;

  clickRigaTI(e) {
    this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, e);
    let campo1 = '';
    let campo2 = '';

    if (e[0]) {
      campo1 = e[0].FILE_NAME;
      campo2 = e[0].FILE_EXT;
    } else {
      if (e.dataItem) {
        campo1 = e.dataItem.FILE_NAME;
        campo2 = e.dataItem.FILE_EXT;
      } else {
        // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Campo nome file non trovato');
      }
    }

    // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Campo rilevato:', campo1, campo2);
    if (campo1 !== '' && campo2 !== '') {
      this.mostraPopup = true;
      this.prendeFileDaTcRun(this.frameAttuale, campo1, campo2);
    }
  }

  prendeDatiTcRun(t, tms) {
    // logConsole('Prende dati tcrun 1', tms);
    let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if ((t.MappaOGraficoTutti2[t.frameAttivo2] !== 'TI' && t.MappaOGraficoTutti2[t.frameAttivo2] !== 'TC') || aperto === false) {
      this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Info: Esco 1 da prende dati tcrun', t.MappaOGraficoTutti2[t.frameAttivo2], aperto);
  
      return;
    }

    // logConsole('Prende dati tcrun 2', this.mascheraTcRunVisibile);
    if (this.mascheraTcRunVisibile === false) {
      this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Info: Esco 3. Maschera non visibile', t.MappaOGraficoTutti2[t.frameAttivo2], aperto);
      return;
    }
    // alert('Maschera visibile. Carico i dati');

    // logConsole('Prende dati tcrun 3', t.MappaOGrafico2);
    if (t.MappaOGrafico2 !== 'TI' && t.MappaOGrafico2 !== 'TC') {
      if (t.debug2 === true) {
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Info: Esco 2 da prende dati tcrun', t.MappaOGrafico2, aperto);
      }
  
      return;
    }

    t.datiPoint = 'empty grid'; // null;
    this.esegueCaricamento(t, tms)
  }

  messaggioWarningTcRunFile = '';
  messaggioWarningTcRunInfo = '';

  esegueCaricamento(t, tms) {
    if (t.debug2 === true) {
      this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Info: start');
    }

    this.tcrunSelezionato = undefined;
    /* let agnact = '';
    if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = 'null';
    } else {
      agnact = ExternalUtilities.stringaAGNoACT;
    }
    if (!agnact) {
      if (t.debug2 === true) {
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Info: esco per agnact vuoto');
      }
      return
    } */

    // logConsole('Prende dati tcrun 4', tms);
    if (!tms) {
      if (t.debug2 === true) {
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Info: esco per tms vuoto', tms);
      }
      return
    }

    // logConsole('Prende dati tcrun 5', this.AgnOAct2);
    if (!this.AgnOAct2) {
      t.debug && t.Log?.scriveLog(t, t.debug, t.Log.getMethodName(), false, 'TC Run Info: esco per AgnOAct vuoto', this.AgnOAct2);
      return
    }

    // logConsole('Prende dati tcrun 6', this.actId2);
    if (!this.actId2) {
      t.debug && t.Log?.scriveLog(t, t.debug, t.Log.getMethodName(), false, 'TC Run Info: esco per actID vuoto', this.actId2);
      return
    }

    // const act_id = ExternalUtilities.prendeActivitySceltaPerEvents(t, t.Utils);
    const paramsFile = {
      cntx_id: t.sessionID2,
      v_act_set_name_list : this.actId2, // this.AgnOAct2, // mail mercoledì 16/07/2025 09:15
      v_tms: tms
    }
    const paramsOutcome = {
      cntx_id: t.sessionID2,
      v_act_set_name_list : this.actId2, // this.AgnOAct2, // mail mercoledì 16/07/2025 09:15
      v_tms: tms,
      v_tc_run_id: (this.tcRunID2 ? this.tcRunID2 : null)
    }
    t.debug && t.Log?.scriveLog(t, t.debug, t.Log.getMethodName(), false, 'Richiamo tcrun info', paramsFile, paramsOutcome);
    // logConsole('Prende dati tcrun. Richiamo tcruns info', paramsFile, paramsOutcome);

    // const valoriDiBase2 = ';' + t.dashboardAttiva2 + ';' +
    //   t.frameAttivo + ';';
    // const actualCall2 = 'TCRUNINFO;' + valoriDiBase2 + ';' + JSON.stringify(paramsFile) + ';' +  + JSON.stringify(paramsOutcome);
    // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, actualCall2);
    // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, TCRunInfoComponent.lastCallTrace);

    if (t.datiTcRunInfo && typeof(t.datiTcRunInfo) === 'string') {
      if (t.datiTcRunInfo.indexOf('ERROR: ') > -1) {
        t.datiTcRunInfo = undefined;
        t.datiTcRunFile = undefined;
        TraceRunInfoComponent.lastCallTrace[t.NumeroFrame] = undefined;
      }
    }

    // if (TraceRunInfoComponent.lastCallTrace[t.NumeroFrame] !== actualCall2) {
    //   TraceRunInfoComponent.lastCallTrace[t.NumeroFrame] = actualCall2;
      this.caricamentoTcRunInCorso2 = true;

      t.debug && t.Log?.scriveLog(t, t.debug, t.Log.getMethodName(), false, 'TC RUN Files', t.NumeroFrame, paramsFile);

      this.apiService.chiamataPost(t.Utils, 'geo_tc_run_files__grid', paramsFile)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        // // const data = JSON.parse(data2);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data);
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningTcRunFile = data.v_grid_msg;
        } else {
          this.messaggioWarningTcRunFile = '';
        }

        if (this.datiTcRunFile && this.datiTcRunFile.DataTable) {
          if (data && data.DataTable) {
            t.debug && t.Log?.scriveLog(t, t.debug, t.Log.getMethodName(), false, 'TC Run file: rinfresco griglia 2');

            this.datiTcRunFile.DataTable = data.DataTable;
          } else {
            this.datiTcRunFile = 'empty grid';
          }
        } else {
          t.debug && t.Log?.scriveLog(t, t.debug, t.Log.getMethodName(), false, 'TC Run file: riempimento griglia 2');

          // this.datiTcRunFile = undefined;
          // const tm = setTimeout(() => {
          // clearTimeout(tm);
            this.datiTcRunFile = data;
          // }, 100);
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.effettuaAutoFitFile = !this.effettuaAutoFitFile;
          }, 500);
          this.vecchioDatiJsonFile = data;
        }

        this.caricamentoTcRunInCorso2 = false;

        // if (data.v_tc_run_code !== this.vecchioTcRun) {
          this.vecchioTcRun = data.v_tc_run_code;
          t.debug && t.Log?.scriveLog(t, t.debug, t.Log.getMethodName(), false, 'TC Run Info: Caricamento la griglia 2. Codice diverso: ', this.vecchioTcRun);

          this.caricamentoTcRunInCorso1 = true;
          this.apiService.chiamataPost(t.Utils, 'geo_tc_run_outcome__grid', paramsOutcome)
          // .map(response => response)
          .pipe(takeUntil(this.destroy$))
          .subscribe((data2: any) => {
            // const data2 = JSON.parse(data);
            ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);
        
            if (data && data !== null && data.v_grid_msg !== undefined) {
              this.messaggioWarningTcRunInfo = data.v_grid_msg;
            } else {
              this.messaggioWarningTcRunInfo = '';
            }

            // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Ritorno info', data);
            if (this.datiTcRunInfo && this.datiTcRunInfo.DataTable) {
              if (data2 && data2.DataTable) {
                t.debug && t.Log?.scriveLog(t, t.debug, t.Log.getMethodName(), false, 'TC Run Info: rinfresco griglia 1', data2.DataTable);

                this.datiTcRunInfo.DataTable = data2.DataTable;
              } else {
                this.datiTcRunInfo = 'empty grid';
              }
            } else {
              t.debug && t.Log?.scriveLog(t, t.debug, t.Log.getMethodName(), false, 'TC Run Info: riempimento griglia 1');

              this.datiTcRunInfo = data2;
              // // logConsole('TC RUN INFO', data2);
              const tm = setTimeout(() => {
                clearTimeout(tm);
                this.effettuaAutoFitInfo = !this.effettuaAutoFitInfo;
              }, 500);
              this.vecchioDatiJsonInfo = data2;                  
            }
              // this.datiTcRunFile = 'empty grid';

            /* const tm = setTimeout(() => {
          clearTimeout(tm);
                this.effettuaAutoFitInfo = !this.effettuaAutoFitInfo;
              }, 1000);
            } */

            this.caricamentoTcRunInCorso1 = false;
          }, error => {
            // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
            TraceRunInfoComponent.lastCallTrace[t.NumeroFrame] = '';
            t.datiTcRunInfo = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
          });
        // } else {
        //   t.debug && t.Log?.scriveLog(t, t.debug, t.Log.getMethodName(), false, 'TC Run Info: prevengo il caricamento della griglia 2. Stesso codice: ', this.vecchioTcRun);
        // }

        // t2.caricamentoTcRunInCorso1 = false;
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
        TraceRunInfoComponent.lastCallTrace[t.NumeroFrame] = '';
        t.datiTcRunFile = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      });
    // } else {
      // t2.caricamentoTcRunInCorso2 = false;
    /* } else {
      // this.datiTcRunFile = undefined;
      // this.datiTcRunInfo = undefined;
      // const tm = setTimeout(() => {
      //     clearTimeout(tm);
        this.datiTcRunFile = this.vecchioDatiJsonFile;
        this.datiTcRunInfo = this.vecchioDatiJsonInfo;
      // }, 100);
    } */
  }

  prendeFileDaTcRun(t, nome, est) {
    if (t.MappaOGrafico2 !== 'TI' && t.MappaOGrafico2 !== 'TC') {
      this.mostraPopup = false;
      return;
    }

    if (t.debug2 === true) {
      this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC Run Info: download file');
    }

    // t.caricamentoTcRunInCorso = true;

    const params = '{ "cntx_id": "' + t.sessionID2 + '", "v_file_name": "' + nome + '" }';

    if (t.debug2 === true) {
      this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'TC RUN File', t.NumeroFrame, params);
    }

    this.apiService.chiamataPost(t.Utils, 'geo_tc_run_file__download', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

      const byteBuf = this.u_atob(data2); // atob(data);

      const blob = new Blob([byteBuf], {type: 'application/octet-stream'});
      const nomeFile = nome;

      // const FileSaver = require('file-saver');
      // FileSaver.saveAs(blob, nomeFile);
      //// this.fileSaver.save(blob, nomeFile);

      // t.caricamentoTcRunInCorso = false;
      const tm = setTimeout(() => {
        clearTimeout(tm);

        this.mostraPopup = false;
      }, 1500);
      
      download(blob, nomeFile, 'application/octet-stream');
    }, error => {
      ExternalUtilities.messaggioDiErrore('null', error);
      this.mostraPopup = false;
    });
  }

  u_atob(ascii) {
    return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
  }

  premutoWorkSpace(e, Cosa) {
    this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, e, Cosa);
    // return;

    let activitySetName = '';
    let start = '';
    let stop ='';
    let tI;
    let tF;

    switch (Cosa) {
      case 'TCRUN':
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, this.tcrunSelezionato);
        activitySetName = this.tcrunSelezionato[0].ACT_SET_NAME;
        start = this.tcrunSelezionato[0].START_TIME_STAMP_SELECTED;
        stop = this.tcrunSelezionato[0].END_TIME_STAMP_SELECTED;

        /* const i = start.split('.');
        start = i[0] + ':' + i[1] + ':' + i[2] + '.' + i[3];
        const f = stop.split('.');
        stop = f[0] + ':' + f[1] + ':' + f[2] + '.' + f[3]; */
        // return;
        break;
    }

    const nuovoNome = 'temp [' + this.operatorID + ']';

    if (start !== null ) { start = '"' + start + '"'; }
    if (stop !== null ) { stop = '"' + stop + '"'; }

    const params = '{' +
      '"cntx_id": "' + this.frameAttuale.sessionID2 + '",' +
      '"v_obj_type": "geo_analysis",' +
      '"v_obj_name": "' + e.NAME + '",' +
      '"v_obj_name_new": "' + nuovoNome + '",' +
      '"v_activityset_name": "' + activitySetName + '",' +
      // '"v_activityset_act_set_type": "' + '' + '",' +
      '"v_timerangedsfstart": ' + start + ',' +
      '"v_timerangedsfstop": ' + stop + '' +
    '}';
    this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'operator_obj_my__copy', params);
    // return;

    this.apiService.chiamataPost(this.frameAttuale.Utils, 'operator_obj_my__copy', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      if (data2) {
        // Creato il temporaneo va caricato GeoAnalysis con il relativo url
        localStorage.removeItem('lastWorkspace');
        this.changePage('Mappe;Mappe', nuovoNome, true);
      }
    });
  }

  changePage(url, altro, newPage) {
    const campiOrig = url.split(';');
    const campi = this.ritornaNomeApp(url);

    let ancora = '';
    if (altro && altro !== '') {
      ancora = ',"altro": "' + altro + '"'
    }

    const passaggio = '{ ' +
      '"sess": "' + this.frameAttuale.sessionID2 + '", ' +
      '"gname": "' + this.groupName + '", ' +
      '"uname": "' + this.userName + '", ' +
      '"form": "' + campi[3] + '", ' +
      '"FS": "false"' +
      ancora +
    '}';
    const pass = this.frameAttuale.Utils.cripta(passaggio);
    // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, passaggio);
    // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, pass);
    // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, UtilsInterna.decripta(pass));
    // return;

    let addr = this.urlRoot;

    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      // addr = 'http://localhost:4200';
      addr = 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/Mappe';
      campi[0] = '';
    }

    this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, addr + campi[0] + '/?par=' + pass); // sess=' + this.sessionID2 +
                                                        // '&gname=' + this.operatorGroupName +
                                                        // '&uname=' + this.userName +
                                                        // '&form=' + campiOrig[1] +
                                                        // '&FS=' + this.fullScreen);
    const doveURL = addr + campi[0] + '/?par=' + pass; // + '/?sess=' + this.sessionID2 +
                                      //                   '&gname=' + this.operatorGroupName +
                                      //                   '&uname=' + this.userName +
                                      //                   '&form=' + campiOrig[1] +
                                      //                   '&FS=' + this.fullScreen;
    // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, doveURL);
    // return;
    // window.location.href = doveURL;
    // const ww = window.open(doveURL, '_blank');
    if (newPage) {
      const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
      this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, url2);
      const ww = window.open(doveURL, '_blank');
    } else {
      location.assign(doveURL);
    }
  }

  ritornaNomeApp(c) {
    const campi = c.split(';');
    // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Passaggio a progetto ' + campi[0] + ', maschera: ' + campi[1]);

    let dove = '';
    switch (campi[0]) {
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
    }

    let funzione = '';
    switch (campi[1]) {
      case 'Mappe':
        funzione = 'Home';
        break;
      case 'TC':
        funzione = 'Test Campaigns';
        break;
      case 'AGD':
        funzione = 'Agent Group Definition';
        break;
      case 'AGC':
        funzione = 'Agent Group Configuration';
        break;
      case 'AGPL':
        funzione = 'Agent Profiles Library';
        break;
      case 'QPL':
        funzione = 'QueryPCK Library';
        break;
      case 'TDL':
        funzione = 'Test Design Library';
        break;
      case 'DTUM':
        funzione = 'Drive Test Units Mng';
        break;
      case 'SAM':
        funzione = 'Single Agent Mode';
        break;
      case 'Antenna':
        funzione = 'Antenna';
        break;
      case 'Cluster':
        funzione = 'Cluster';
        break;
      case 'PLMN':
        funzione = 'PLMN';
        break;
      case 'Users':
        funzione = 'Users';
        break;
      case 'Groups':
        funzione = 'User Groups';
        break;
      case 'UP':
        funzione = 'User Profiles';
        break;
      case 'SC':
        funzione = 'System Configuration';
        break;
      case 'EV':
        funzione = 'Event Viewer';
        break;
      case 'SM':
        funzione = 'System Monitor';
        break;
      case 'ETLM':
        funzione = 'Activities Loading Monitor';
        break;
      case 'DBO':
        funzione = 'DB Ojects';
        break;
      case 'SESS':
        funzione = 'Session Monitor';
        break;
    }

    const cc = new Array();
    cc.push(dove);
    cc.push(funzione);
    cc.push(campi[0]);
    cc.push(campi[1]);

    return cc;
  }

  vecchioDatiTcRunFile;
  vecchioDatiTcRunInfo;
  
  onTabChanged(e) {
    // alert('1');
    /* if (this.vecchioTab === e.index) {
      return;
    }
    this.vecchioTab = e.index; */

    /* this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'tcruninfo: Vecchio', JSON.parse(this.vecchioDatiTcRunFile));
    this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'tcruninfo: Nuovo', this.datiTcRunFile);
    con sole.log('tcruninfo: Differenza: ', this.vecchioDatiTcRunFile !== JSON.stringify(this.datiTcRunFile)); */

    const tm = setTimeout(() => {
      clearTimeout(tm);
      /* if (this.vecchioDatiTcRunFile !== JSON.stringify(this.datiTcRunFile) || this.vecchioTab !== e.index) {
        this.effettuaAutoFitFile = !this.effettuaAutoFitFile;
        this.vecchioDatiTcRunFile = JSON.stringify(this.datiTcRunFile);
      }

      if (this.vecchioDatiTcRunInfo !== JSON.stringify(this.datiTcRunInfo) || this.vecchioTab !== e.index) {
        this.effettuaAutoFitInfo = !this.effettuaAutoFitInfo;
        this.vecchioDatiTcRunInfo = JSON.stringify(this.datiTcRunInfo);
      }

      this.vecchioTab = e.index; */
      // logConsole('Cambio pagina', e);
      if (e === 0) {
        this.effettuaAutoFitInfo = !this.effettuaAutoFitInfo;
      } else {
        this.effettuaAutoFitFile = !this.effettuaAutoFitFile;
      }
    }, 1000);

    this.vecchioTab = e;
  }

  ritornoDimensioniColonneTcRun1(e) {
    ExternalUtilities.scriveDimensioniColonne('TcRun1', e);
  }

  ritornoDimensioniColonneTcRun2(e) {
    ExternalUtilities.scriveDimensioniColonne('TcRun2', e);
  }

  @ViewChild('tabHeaderScroll') tabHeaderScroll!: ElementRef;
  @ViewChild('tabHeaderWrapper') tabHeaderWrapper!: ElementRef;

  scrollTabs(direction: 'left' | 'right') {
    const el = this.tabHeaderScroll.nativeElement as HTMLElement;
    const wrapper = this.tabHeaderWrapper.nativeElement as HTMLElement;
    const scrollAmount = wrapper.offsetWidth * 0.5; // scroll di metà visibile

    // logConsole('Direzione: ', direction, el, wrapper, scrollAmount);

    if (direction === 'left') {
      el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  scrollSelectedTabIntoView(index: number) {
    if (this.tabHeaderScroll) {
      const tabElements = this.tabHeaderScroll.nativeElement.children;
      const selectedTab = tabElements[index] as HTMLElement;
      selectedTab?.scrollIntoView({ inline: 'center' });
    }
  }

  ritornoTastoAiTutte(dati) {
    // logConsole('Richiesta AI da tcruninfo: ', dati);
    this.datiPerAI.emit(dati);
  }
}

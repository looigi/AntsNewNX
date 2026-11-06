import { logConsole } from '../../console-log';
import { AfterViewInit, Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChanges } from "@angular/core";
// import { FileSaverService } from "ngx-filesaver";
import { DatePipe } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { ReturnStatement } from "@angular/compiler";
import Swal from "sweetalert2";
import ExternalUtilities from "../ExternalUtilities.component";
import {ApiService} from '../../../db/api.service';
import { Utils } from "../Utilities.component";
import download from 'downloadjs';  // Importa downloadjs
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'report-component',
    templateUrl: 'report.component.html',
    styleUrls: ['./report.style.css']
  })
  
  export class ReportMD5Component implements OnInit, AfterViewInit, OnChanges {
    @Input() debug = false;
    @Input() frame;
    @Input() Log;
    @Input() indirizzoServer = '';
    @Input() userName = '';
    @Input() linkIcone = '';
    @Input() sessionID = '';
    // @Input() sla;
    @Input() Utils;
    // @Input() timeFilter;
    // @Input() timeFilter2;
    @Input() timeRangeDSFStart2;
    @Input() timeRangeDSFStop2;
    @Input() act_set_originale;
    @Input() tmsInizio;
    @Input() tmsFine;
    @Input() stringaAGNoACT;
    @Input() aggiornaDatiGriglia;
    @Input() accordionAperto;
    @Input() actSet;

    @Output() syncAttivoEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() bMostraUpload: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() nonChiudereDrawer: EventEmitter<boolean> = new EventEmitter<boolean>();    

    destroy$ = new Subject<void>();

    rigaSelezionata;
    exportWholeData = true;
    exportAll = true;
    exportDisplayedMeasures = true;
    exportDisplayedEvents = false;
    exportEverybody = false;
    exportRawData = false;
    datiGenerati = false;
    status = '';
    urlDati = '';
    urlDati2 = '';
    datiGriglia;
    effettuaAutoFit;
    caricamentoDatiInCorso = false;
    caricamentoDatiInCorso2 = false;
    caricamentoDatiInCorsoSync = false;
    bUploadReport = false;

    exportTcRunVisibile = false;
    nomeGrigliaExportTcRun = 'ExportTcRunGrid';
    selezioneExportTcRun;
    effettuaAutoFitExportTcRun= false;
    datiGrigliaExportTcRun;
    caricamentoDatiInCorsoETR = false;
    arrayExportTcRun = new Array();
    mostraPopupTcRun = false;
    actSet2;

    debug2 = false;
    userName2 = '';
    linkIcone2 = '';
    sessionID2 = '';
    array2 = '';
    tmsInizio2;
    tmsFine2;
    righePerPaginazioneAutomatica = -1;
    nomeGriglia = 'Export_to_Excel';
    selezioneID;
    visualizzaToolTipGrafici = true;
    inizio;
    fine;
    md5;
    dataSet;
    inPreparazione = false;
    syncAttivo = false;
    statusSync = '';
    urlDatiSync = '';
    urlDatiSync2 = '';
    // vecchioSA = undefined;
    act_set_originale2;
    stringaAGNoACT2;
    intervallo;
    frame2;

    constructor(
        private apiService: ApiService,
        private datePipe: DatePipe,
        private http: HttpClient,
        // private fileSaver: FileSaverService,
        private Utilities: Utils
    ) {

    }

    ngOnInit(): void {
        // const tm = setTimeout(() => {
          // this.vecchioSA = new Date().toString();
          // this.generaDati('N', true);
        // }, 500);
        
        this.leggeGriglia();
    }
    
    ngAfterViewInit(): void {
    }

    refreshGriglia(e, r) {
      this.leggeGriglia();
    }

    ngOnChanges(changes): void {
      /* if (changes.ricaricaInizio && changes.ricaricaInizio.currentValue !== undefined) {
      } */

      if (changes.frame && changes.frame.currentValue !== undefined) {
        this.frame2 = changes.frame.currentValue;
      }
      if (changes.accordionAperto && changes.accordionAperto.currentValue !== undefined) {
        if (changes.accordionAperto.currentValue) {
          // logConsole('Attivo timer export and report');

          this.generaDati("Y", false);
          this.generaDatiSync("Y", false);

          this.generaDati3('Y', true);
        } else {
          clearInterval(this.intervallo);
          this.intervallo = undefined;
          // logConsole('Disattivo timer export and report');
        }
      }
      if (changes.aggiornaDatiGriglia && changes.aggiornaDatiGriglia.currentValue !== undefined) {
        this.leggeGriglia();
      }
      if (changes.debug && changes.debug.currentValue !== undefined) {
          this.debug2 = changes.debug.currentValue;
      }
      if (changes.userName && changes.userName.currentValue !== undefined) {
          this.userName2 = changes.userName.currentValue;
      }
      if (changes.linkIcone && changes.linkIcone.currentValue !== undefined) {
          this.linkIcone2 = changes.linkIcone.currentValue;
      }
      if (changes.sessionID && changes.sessionID.currentValue !== undefined) {
          this.sessionID2 = changes.sessionID.currentValue;
      }
      if (changes.array && changes.array.currentValue !== undefined) {
          this.array2 = changes.array.currentValue;
      }

      if (changes.actSet && changes.actSet.currentValue !== undefined) {
        this.actSet2 = changes.actSet.currentValue;
      }

      let ok = false;
      
      if (changes.stringaAGNoACT && changes.stringaAGNoACT.currentValue !== undefined) {
        this.stringaAGNoACT2 = changes.stringaAGNoACT.currentValue;
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Agent', this.stringaAGNoACT2);
        if (!this.exportAll) {
          ok = true;
        }
      }

      if (changes.act_set_originale && changes.act_set_originale.currentValue !== undefined) {
        this.act_set_originale2 = changes.act_set_originale.currentValue;
        if (this.act_set_originale2.NAME) {
          this.act_set_originale2 = this.act_set_originale2.NAME;
        }
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Activity', this.act_set_originale2);          
        ok = true;
      }

      if (changes.tmsInizio && changes.tmsInizio.currentValue !== undefined) {
        this.tmsInizio2 = changes.tmsInizio.currentValue;
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Cambio tms inizio', this.exportWholeData, this.tmsInizio2);
        if (this.syncAttivo) {
          ok = true;
        } else {
          if (!this.exportWholeData) {
            this.generaDati('Y', false);
          }
        }
      }      
      if (changes.tmsFine && changes.tmsFine.currentValue !== undefined) {
        this.tmsFine2 = changes.tmsFine.currentValue;
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Cambio tms fine', this.exportWholeData, this.tmsFine2);
        if (this.syncAttivo) {
          ok = true;
        } else {
          if (!this.exportWholeData) {
            this.generaDati('Y', false);
          }
        }
      }

      if (changes.timeRangeDSFStart2 && changes.timeRangeDSFStart2.currentValue !== undefined) {
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Cambio tms All inizio', this.exportWholeData, changes.timeRangeDSFStart2.currentValue);
        if (this.syncAttivo) {
          ok = true;
        } else {
          if (this.exportWholeData) {
            this.generaDati('Y', false);
          }
        }
      }
      if (changes.timeRangeDSFStop2 && changes.timeRangeDSFStop2.currentValue !== undefined) {
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Cambio tms All fine', this.exportWholeData, changes.timeRangeDSFStop2.currentValue);
        if (this.syncAttivo) {
          ok = true;
        } else {
          if (this.exportWholeData) {
            this.generaDati('Y', false);
          }
        }
      }

      if (ok) {
        if (this.syncAttivo) {
          this.generaDatiSync('N', false);
        }
      }
      /* if (changes.riferimentoAlFrame && changes.riferimentoAlFrame.currentValue !== undefined) {
            this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, this.riferimentoAlFrame.mappaVisibile);
        } */
    }

    mostraPopup(titolo, messaggio) {
      Swal.fire({
        title: titolo,
        text: messaggio,
        icon: 'info',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      });
    }

    sistemaData(d) {
      let dd = d;
      while (dd.indexOf(':') > - 1) {
        dd = dd.replace(':', '');
      }
      while (dd.indexOf('-') > - 1) {
        dd = dd.replace('-', '');
      }
      while (dd.indexOf(' ') > - 1) {
        dd = dd.replace(' ', '');
      }
      if (dd.indexOf('.') > - 1) {
        dd = dd.substring(0, dd.indexOf('.'));
      }
      return dd;
    }
    
    selezioneRiga(e) {
      this.rigaSelezionata = e;
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Riga selezionata', e);

        if (e[0].REPORT_TYPE === 'download') {
          this.esportaDatiTcRun();
          return;
        }

        if (e[0].REPORT_TYPE === 'csv') {
            this.esportaDatiCSV();
            return;
        }

        if (e[0].REPORT_TYPE === 'json') {
          this.esportaDatiJson();
          return;
      }

        if (e[0].REPORT_TYPE === 'link') {
          this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Link: ', e[0]);
          if (e[0].REPORT_MODE === 'static') {
            if (!this.urlDati) {
              this.mostraPopup('Report', 'Data are not ready');
              return;
            }
            this.mostraPopup('Link', this.urlDati);
          } else {
            if (!this.urlDatiSync) {
              this.mostraPopup('Report', 'Sync Data are not ready');
              return;
            }
            this.mostraPopup('Link', this.urlDatiSync);
          }
          return;
        } else {
          this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Altro: ', e[0]);
          // logConsole('Url dati', this.urlDati);
          if (e[0].REPORT_TYPE !== 'docx') {
            if (e[0].REPORT_MODE === 'static') {
              if (!this.urlDati) {
                this.mostraPopup('Report', 'Data are not ready');
                return;
              } 
            } else {
              if (!this.urlDatiSync) {
                this.mostraPopup('Report', 'Sync Data are not ready');
                return;
              }
            }
          }
        }

        const params = {
            cntx_id: this.sessionID2,
            v_name: e[0].NAME
        }
        this.caricamentoDatiInCorso2 = true;
        this.apiService.chiamataPost(this.Utilities, 'report__download', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data2 => {
          // const data2 = JSON.parse(data);
          ExternalUtilities.checkRitornoChiamata(this.Utils, data2);
          this.caricamentoDatiInCorso2 = false;

          const inizio = ''; // this.sistemaData(this.inizio);
          const fine = ''; // this.sistemaData(this.fine);

          // let nomeFile = this.dataSet.replace('[', '').replace(']', '') + ' ' + inizio + ' ' + fine + ' {' + this.md5 + '} ' + e[0].NAME;

          let estensione = '';
          let nome = (e[0].NAME.replace('{', ' ').replace('}', ' '));
          if (e[0].REPORT_TYPE === 'xlsx') {
            estensione = '.xlsx';
            nome = nome.replace('.xlsx', '');
          }
          if (e[0].REPORT_TYPE === 'pbix') {
            estensione = '.pbix';
            nome = nome.replace('.pbix', '');
          }
          if (e[0].REPORT_TYPE === 'xlsb') {
            estensione = '.xlsb';
            nome = nome.replace('.xlsb', '');
          }
          if (e[0].REPORT_TYPE === 'docx') {
            estensione = '.docx';
            nome = nome.replace('.docx', '');
          }

          /* let url = window.location.href;
          url = url.replace('://', '.');
          url = url.replace(':', '..');
          if (url.substring(url.length - 1, url.length) === '/') {
            url = url.substring(0, url.length - 1);
          }
          const slash = url.indexOf('/');
          if (slash > -1) {
            url = url.substring(0, slash);
          } */

          let url = this.Utils.serverPostRest;
          url = url.replace('://', '.');
          url = url.replace(':', '..');
          if (url.substring(url.length - 1, url.length) === '/') {
            url = url.substring(0, url.length - 1);
          }

          let nomeFile = (this.dataSet.replace('[', '').replace(']', '').replace('{', ' ').replace('}', ' ')) + ' ' + 
            inizio + '' + 
            fine + '' + 
            nome + ' ' + 
            '{' + this.md5 + '} ' + 
            '{' + url + '} ' +
            estensione;
          // logConsole('Url xls 2: ', url, nomeFile);

          this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Nome file', nomeFile);
          let mimeType = 'application/octet-stream';
          if (e && e[0] && e[0].NAME && e[0].NAME.toUpperCase().indexOf('.XLSX') > -1) {
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          }
          if (e && e[0] && e[0].NAME && e[0].NAME.toUpperCase().indexOf('.PBI') > -1) {
            mimeType = 'application/octet-stream';
          }
          if (e && e[0] && e[0].NAME && e[0].NAME.toUpperCase().indexOf('.XLSB') > -1) {
          }
          if (e && e[0] && e[0].NAME && e[0].NAME.toUpperCase().indexOf('.DOCX') > -1) {
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            const v_config = this.rigaSelezionata[0].CONFIG;
            // logConsole('Docx. V_config:', this.rigaSelezionata, v_config, this.frame2.listToPrint.impostaSelezioneLTP);
            if (v_config && v_config !== null) {
              this.frame2.listToPrint.impostaSelezioneLTP = JSON.parse(JSON.stringify(v_config.PageList));
            }
            nomeFile = (this.dataSet.replace('[', '').replace(']', '').replace('{', ' ').replace('}', ' ')) + ' ' + nome + estensione;
          }

          const byteBuf = this.u_atob(data2); // atob(data);

          const data3 = new Blob([byteBuf], {type: mimeType});
          // this.fileSaver.save(data3, nomeFile);
          download(data3, nomeFile, mimeType);
        });  
    }

    u_atob(ascii) {
        return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
    }
           
    /* mostraPopup(Messaggio, Dialog, Cosa) {
        ExternalUtilities.visualizzaAlert(Messaggio);
    } */

    esportaDatiCSV() {
      // logConsole('Url dati CSV: ', this.urlDati);

      this.caricamentoDatiInCorso2 = true;
      this.http.get(
        this.urlDati,
        // { responseType: 'blob' as 'text', observe: 'response' }
        { responseType: 'blob' as 'text', observe: 'response' }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(async data => {
        if (data) {
            this.continuaCSV(data);
        }

        this.caricamentoDatiInCorso2 = false;
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        console.error('Download file CSV: ', error, error.message);
        this.mostraPopup('Download file CSV', error.message);

        this.caricamentoDatiInCorso2 = false;
      });
    }

    async continuaCSV(c) {
      const cc = await new Response(c.body).text()

      // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, cc);
      const inizio = this.sistemaData(this.inizio);
      const fine = this.sistemaData(this.fine);
      const nomeFile = this.dataSet.replace('[', '').replace(']', '') + ' ' + inizio + ' ' + fine + ' ' + this.md5 + '.gz';      
      
      const cc2 = cc.replace('"', '').replace('"', '').replace('\\\\x', '');
      // const byteBuf = this.u_atob(cc2);

      const byteArray = new Uint8Array(cc2.length/2);
      for (var x = 0; x < byteArray.length; x++){
          byteArray[x] = parseInt(cc2.substr(x*2,2), 16);
      }

      const data3 = new Blob([byteArray], {type: 'application/tar+gzip'}); // 'text/plain;charset=utf-8'});
      // this.fileSaver.save(data3, nomeFile);
      download(data3, nomeFile, 'application/tar+gzip');
    }

    esportaDatiJson() {
      // logConsole('Url dati JSON: ', this.urlDati);

      this.caricamentoDatiInCorso2 = true;
      this.http.get(
        this.urlDati,
        // { responseType: 'blob' as 'text', observe: 'response' }
        { responseType: 'blob' as 'text', observe: 'response' }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe(async data => {
        if (data) {
            this.continuaJson(data);
        }

        this.caricamentoDatiInCorso2 = false;
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        console.error('Download file JSON: ', error, error.message);
        this.mostraPopup('Download file JSON', error.message);

        this.caricamentoDatiInCorso2 = false;
      });
    }

    async continuaJson(c) {
      const cc = await new Response(c.body).text()

      // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, cc);
      const inizio = this.sistemaData(this.inizio);
      const fine = this.sistemaData(this.fine);
      const nomeFile = this.dataSet.replace('[', '').replace(']', '') + ' ' + inizio + ' ' + fine + ' ' + this.md5 + '.json';        
      const data3 = new Blob([cc], {type: 'text/plain; charset=UTF-8'}); // 'text/plain;charset=utf-8'});
      // this.fileSaver.save(data3, nomeFile);
      download(data3, nomeFile, 'text/plain; charset=UTF-8');
    }

    attivaDisattivaSync() {
      this.syncAttivo = !this.syncAttivo;
      if (this.syncAttivo) {
        this.generaDatiSync('N', false);
      }
      this.syncAttivoEmit.emit(this.syncAttivo);
    }

    generaDati3(checkStatus, soloUnSecondo) {
      if (this.intervallo) {
        return;
      }

      this.intervallo = setInterval(() => {
        this.generaDati2(checkStatus, soloUnSecondo);
      }, 5000);
    }

    generaDati2(checkStatus, soloUnSecondo) {
      // const s = this.syncAttivo;
      // this.syncAttivo = false;
      this.generaDati(checkStatus, false);
      this.generaDatiSync(checkStatus, false);
      // const tm = setTimeout(() => {
      //   this.syncAttivo = s;
      // }, 1000);
    }

    lastCall = '';
    
    generaDati(checkStatus, soloUnSecondo) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Export Whole Data: ', this.exportWholeData);
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Solo Un Secondo: ', soloUnSecondo);
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Agent: ', this.exportAll);
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Stringa AGNoACT: ', this.stringaAGNoACT2);

        let dInizio = -1;
        let dFine = -1;
        let sInizio;
        let sFine;
  
        if (soloUnSecondo) {
          dInizio = new Date(this.timeRangeDSFStart2).getTime();
          dFine = dInizio + 1000;
        
          sInizio = this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss');
          sFine = this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss');
  
          this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Prima chiamata dati', sInizio, sFine);
        } else {
          if (!this.exportWholeData) {
            sInizio = this.tmsInizio2;
            sFine = this.tmsFine2;
          } else {
            /* if (this.timeFilter === 2 || this.timeFilter2 === 'Time Range') {
              dInizio = this.tmsInizio2;
              dFine = this.tmsFine2; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss');
      
              sInizio = this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss');
              sFine = this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss');
            } else { */
              sInizio = this.timeRangeDSFStart2;
              sFine = this.timeRangeDSFStop2;
            // }
          }
        }
        if (!sInizio || sInizio === null || !sFine || sFine === null) {
          this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Esco per date nulle', sInizio, sFine);
  
          return;        
        }
  
        if (sInizio.indexOf('.') > -1) {
          sInizio = sInizio.substring(0, sInizio.indexOf('.'));
        }
        if (sFine.indexOf('.') > -1) {
          sFine = sFine.substring(0, sFine.indexOf('.'));
        }
        this.inizio = sInizio;
        this.fine = sFine;
  
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Chiamata report', this.inizio, this.fine);
  
        if (!this.act_set_originale2) {
          this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Esco per act set vuoto', this.act_set_originale2);
  
          return;
        }
  
        let agnact = '';
        // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Disegno Grafici: Export dati gestione grafici.', t.NumeroFrame2, t.exportWholeDataset, t.datiActivitySet2[t.Activity2], t.act_set_originale, ExternalUtilities.stringaAGNoACT);
        if (this.exportAll === true) {
            agnact = '"' + this.act_set_originale2 + '"';
            this.dataSet = this.act_set_originale2;
        } else {
          if (this.stringaAGNoACT2) {
            if (this.stringaAGNoACT2 && this.stringaAGNoACT2 === '') {
              agnact = 'null';
              this.dataSet = 'null';
            } else {
              agnact = '"' + this.stringaAGNoACT2 + '"';
              this.dataSet = this.stringaAGNoACT2;
            }
          } else {
            this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Esco per stringaAGNoACT vuota', this.stringaAGNoACT);

            alert('Agent not setted');
    
            return;
          }
        }
    
        let eventi = 'MEASURE';
        let listaEventi = 'NONE';
  
        const params = '{ ' +
            '"cntx_id": "' + this.sessionID2 + '",' +
            '"v_filter_act_set_name": ' + agnact + ', ' +
            '"v_event_type_list": "' + listaEventi + '", ' +
            '"v_measr_code_list": "' + this.array2 + '", ' +
            // '"v_geo_sla_name": "' + this.sla2 + '", ' +
            '"v_tms_min": "' + sInizio + '",' +
            '"v_tms_max": "' + sFine + '",' +
            '"report_event_text": "' + eventi + '", ' +
            '"v_check_status": "' + checkStatus + '", ' +
            '"v_mode": "" ' +
        ' }';
  
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Params', params);
  
        /* if (this.lastCall === JSON.stringify(params)) {
          this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Esco per ultima chiamata uguale');
  
          return;
        } */
        
        this.lastCall = JSON.stringify(params);
        this.status = 'Processing';
        this.inPreparazione = false;
        this.caricamentoDatiInCorso = true;
        this.apiService.chiamataPost(this.Utilities, 'geo_measure_export__set_md5', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data2 => {
          // const data2 = JSON.parse(data);
          ExternalUtilities.checkRitornoChiamata(this.Utils, data2);
          this.caricamentoDatiInCorso = false;
  
          if (data2 && data2 !== null) {
            if (data2.v_status && data2.v_status_description) {
              this.status = data2.v_status + ' ' + data2.v_status_description;
            } else {
              this.status = '';
            }
            if (data2.v_md5 && data2.v_md5 !== 'unk') {
              this.urlDati = this.Utils.serverPostRest + '/geo_measure_export_gz__get_by_md5?v_md5=' + data2.v_md5 + '&v_return_type=csv_return_gz';

              let url = window.location.href;
              url = url.replace('://', '.');
              url = url.replace(':', '..');
              if (url.substring(url.length - 1, url.length) === '/') {
                url = url.substring(0, url.length - 1);
              }
              const slash = url.indexOf('/');
              if (slash > -1) {
                url = url.substring(0, slash);
              }
    
              this.urlDati2 = '{' + data2.v_md5 + '} {' + url + '}';
            } else {
              this.urlDati = '';
              this.urlDati2 = '';
            }
  
            if (this.status && this.status.toUpperCase().indexOf('READY') > - 1) {
                this.datiGenerati = true;
            } else {
              if (this.status && this.status.toUpperCase().indexOf('PROCESSING') > - 1) {
                this.inPreparazione = true;
              }
  
              this.datiGenerati = false;
            }
  
            this.md5 = data2.v_md5;
          } else {
            this.status = "ERROR: Null return from query";
          }
        });          
      }, 100);
    }
    
    lastCallSync = '';

    generaDatiSync(checkStatus, soloUnSecondo) {
      let dInizio = -1;
      let dFine = -1;
      let sInizio;
      let sFine;

      if (soloUnSecondo) {
        dInizio = new Date(this.timeRangeDSFStart2).getTime();
        dFine = dInizio + 1000;
      
        sInizio = this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss');
        sFine = this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss');

        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Prima chiamata sync', sInizio, sFine);
      } else {
        if (!this.exportWholeData) {
          sInizio = this.tmsInizio2;
          sFine = this.tmsFine2;
        } else {
          /* if (this.timeFilter === 2 || this.timeFilter2 === 'Time Range') {
            dInizio = this.tmsInizio2;
            dFine = this.tmsFine2; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss');
    
            sInizio = this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss');
            sFine = this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss');
          } else { */
            sInizio = this.timeRangeDSFStart2;
            sFine = this.timeRangeDSFStop2;
          // }
        }

        // sInizio = this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss');
        // sFine = this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss');
      }
      
      if (!sInizio || sInizio === null || !sFine || sFine === null) {
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Esco per date nulle sync', sInizio, sFine);

        return;        
      }

      if (sInizio.indexOf('.') > -1) {
        sInizio = sInizio.substring(0, sInizio.indexOf('.'));
      }
      if (sFine.indexOf('.') > -1) {
        sFine = sFine.substring(0, sFine.indexOf('.'));
      }
      this.inizio = sInizio;
      this.fine = sFine;

      this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Chiamata report sync', this.inizio, this.fine);

      if (!this.act_set_originale2) {
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Esco per act set vuoto sync', this.act_set_originale2);

        return;
      }

      let agnact = '';
      // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Disegno Grafici: Export dati gestione grafici.', t.NumeroFrame2, t.exportWholeDataset, t.datiActivitySet2[t.Activity2], t.act_set_originale, ExternalUtilities.stringaAGNoACT);
      if (this.exportAll === true) {
          agnact = '"' + this.act_set_originale2 + '"';
          this.dataSet = this.act_set_originale2;
      } else {
          if (this.stringaAGNoACT && this.stringaAGNoACT === '') {
            agnact = 'null';
            this.dataSet = 'null';
          } else {
            agnact = '"' + this.stringaAGNoACT + '"';
            this.dataSet = this.stringaAGNoACT;
          }
      }
  
      let eventi = 'MEASURE';
      let listaEventi = 'NONE';

      const params = '{ ' +
          '"cntx_id": "' + this.sessionID2 + '",' +
          '"v_filter_act_set_name": ' + agnact + ', ' +
          '"v_event_type_list": "' + listaEventi + '", ' +
          '"v_measr_code_list": "' + this.array2 + '", ' +
          // '"v_geo_sla_name": "' + this.sla2 + '", ' +
          '"v_tms_min": "' + sInizio + '",' +
          '"v_tms_max": "' + sFine + '",' +
          '"report_event_text": "' + eventi + '", ' +
          '"v_check_status": "' + checkStatus + '", ' +
          '"v_mode": "sync" ' +
      ' }';

      this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Params sync', params);

      if (this.lastCallSync === JSON.stringify(params)) {
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'ExportAndReport: Esco per ultima chiamata uguale sync');

        return;
      }
      this.lastCallSync = JSON.stringify(params);
  
      this.statusSync = 'Processing';
      this.caricamentoDatiInCorsoSync = true;
      this.apiService.chiamataPost(this.Utilities, 'geo_measure_export__set_md5', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(this.Utils, data2);
        this.caricamentoDatiInCorsoSync = false;

        if (data2 && data2 !== null) {
          if (data2.v_status && data2.v_status_description) {
            this.statusSync = data2.v_status + ' ' + data2.v_status_description;
          } else {
            this.statusSync = '';
          }
          if (data2.v_md5 && data2.v_md5 !== 'unk') {
            this.urlDatiSync = this.Utils.serverPostRest + '/geo_measure_export_gz__get_by_md5?v_md5=' + data2.v_md5 + '&v_return_type=csv_return_gz';
            this.urlDatiSync2 = data2.v_md5;
          } else {
            this.urlDatiSync = '';
            this.urlDatiSync2 = '';
          }
        } else {
          this.statusSync = "ERROR: Null return from query";
        }
      });  
    }

    goToLink(url: string){
        window.open(url, "_blank");
    }

    leggeGriglia() {
      this.rigaSelezionata = undefined;
      this.datiGriglia = undefined;

      const params = {
        cntx_id: this.sessionID2,
        v_filter_folder: null
      }
      this.caricamentoDatiInCorso2 = true;
      this.apiService.chiamataPost(this.Utilities, 'report__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(this.Utils, data2);
        this.caricamentoDatiInCorso2 = false;

        if (this.datiGriglia && this.datiGriglia.DataTable && data2.DataTable && data2.DataTable.length > 0) {
          // logConsole('Refresh griglia report', data2);
          this.datiGriglia.DataTable = data2.DataTable;
        } else {
          // logConsole('Riempio griglia report', data2);
          this.datiGriglia = data2;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.effettuaAutoFit = !this.effettuaAutoFit;
          }, 100);
        }
      });  
    }

    apriUpload() {
      this.bMostraUpload.emit(true);
    }

    eliminaReport(e) {
      if (!this.rigaSelezionata) {
        return;
      }
      const riga = this.rigaSelezionata[0] ? this.rigaSelezionata[0] : this.rigaSelezionata;
      // logConsole(riga, riga.ID);

      const params = '{' +
        '"v_cntx": "' + this.sessionID2 + '",' +
        '"v_id": "' + riga.ID + '"' +
      '}';
      this.apiService.chiamataPost(this.Utilities, 'report__del', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        if (data2 && data2 !== null) {
          if (+data2[0].v_err_code !== 0) {
            const rr = data2[0].failure_reason;
            ExternalUtilities.messaggioDiErroreEsterno(this, rr);
          } else {
            this.leggeGriglia();
          }
        }
      }, error => {
        ExternalUtilities.messaggioDiErroreEsterno(this, 'Read look up:' + error);
      });
    }

    esportaDatiTcRun() {
      this.nonChiudereDrawer.emit(true);
      this.exportTcRunVisibile = true;

      this.caricamentoDatiInCorsoETR = true;
      const params = {
        cntx_id: this.sessionID2,
        v_act_set_name_list: this.actSet2.NAME,
        v_tms: null,
        v_tms_min: this.timeRangeDSFStart2,
        v_tms_max: this.timeRangeDSFStop2
      };
      this.apiService.chiamataPost(this.Utilities, 'geo_tc_run_files__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        this.caricamentoDatiInCorsoETR = false;
        if (data2 && data2 !== null) {
          /* if (+data2[0].v_err_code !== 0) {
            const rr = data2[0].failure_reason;
            ExternalUtilities.messaggioDiErroreEsterno(this, rr);
          } else { */
            this.datiGrigliaExportTcRun = data2;
          // }
        }
      }, error => {
        ExternalUtilities.messaggioDiErroreEsterno(this, 'Read export tcrun:' + error);
      });
    }

    selezioneRigaExportTcRun(e) {
      // logConsole('Premuta riga export tcrun', e);

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
          if (e.FILE_NAME) {
            campo1 = e.FILE_NAME;
            campo2 = e.FILE_EXT;
          }
        }
      }
  
      if (campo1 !== '' && campo2 !== '') {
        this.mostraPopupTcRun = true;
        this.prendeFileDaTcRun(campo1, true);
      }  
    }
    
    prendeFileDaTcRun(nome, chiudiPopup) {
      const params = '{ "cntx_id": "' + this.sessionID2 + '", "v_file_name": "' + nome + '" }';

      this.apiService.chiamataPostEventi(this.Utils, 'geo_tc_run_file__download', JSON.parse(params))
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data2 => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(this.Utils, data2);

        const byteBuf = this.u_atob(data2); // atob(data);

        const blob = new Blob([byteBuf], {type: 'application/octet-stream'});
        const nomeFile = nome;

        // const FileSaver = require('file-saver');
        // FileSaver.saveAs(blob, nomeFile);
        // this.fileSaver.save(blob, nomeFile);
        download(blob, nomeFile, 'application/octet-stream');

        this.attendeTcRun = false;

        // t.caricamentoTcRunInCorso = false;
        if (chiudiPopup) {
          const tm = setTimeout(() => {
            clearTimeout(tm);

            this.mostraPopupTcRun = false;
          }, 1000);
        }
      }, error => {
        ExternalUtilities.messaggioDiErrore('null', error);
        this.mostraPopupTcRun = false;
      });
    }

    refreshGrigliaExportTcRun(e) {
      if (e) {
        this.datiGrigliaExportTcRun = undefined;
      }
  
      this.esportaDatiTcRun();
    }

    qualeTcRun = 0;
    attendeTcRun = false;

    scaricaTcRunMultipli() {
      if (!this.arrayExportTcRun || this.arrayExportTcRun.length === 0) {
        Swal.fire({
          title: 'Warning',
          text: 'No rows selected',
          icon: 'warning',
          showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
          },
        });

        return;
      }
      this.qualeTcRun = 0;
      this.attendeTcRun = false;
      this.mostraPopupTcRun = true;
      // logConsole('Array download', this.arrayExportTcRun);
      this.scaricaTcRunMultipli2();
    }

    scaricaTcRunMultipli2() {
      logConsole('Quale tc run', this.qualeTcRun + "/" + this.arrayExportTcRun.length, this.arrayExportTcRun[this.qualeTcRun]);
      if (this.arrayExportTcRun[this.qualeTcRun] && this.arrayExportTcRun[this.qualeTcRun].FILE_NAME) {
        const campo1 = this.arrayExportTcRun[this.qualeTcRun].FILE_NAME;
        this.attendeTcRun = true;
        this.prendeFileDaTcRun(campo1, false);
        const t = setInterval(() => {
          if (this.exportTcRunVisibile) {
            if (!this.attendeTcRun) {
              clearInterval(t);

              this.qualeTcRun++;
              if (this.qualeTcRun <= this.arrayExportTcRun.length) {
                this.scaricaTcRunMultipli2();
              } else {
                const tm = setTimeout(() => {
                  clearTimeout(tm);

                  this.mostraPopupTcRun = false;
                }, 3000);
              }
            /* } else {
              clearInterval(t);

              this.mostraPopupTcRun = false;
              this.attendeTcRun = false; */
            }
          } else {
            // alert('Perché qui 1?');
            clearInterval(t);

            this.mostraPopupTcRun = false;
            this.attendeTcRun = false;
          }
        }, 500);
      } else {
        // alert('Perché qui 2?');
        this.mostraPopupTcRun = false;
        this.attendeTcRun = false;
      }
    }

    scaricaTcRun() {
      // logConsole('array da scaricare', this.arrayExportTcRun);
      // return;

      this.mostraPopupTcRun = true;
      const tm = setTimeout(() => {
        clearTimeout(tm);
        
        this.arrayExportTcRun.forEach(element => {
          const campo1 = element.FILE_NAME;
          this.prendeFileDaTcRun(campo1, false);
        });
        const tm1 = setTimeout(() => {
          clearTimeout(tm1);
          this.mostraPopupTcRun = false;
        }, 3000);          
      }, 1000);
    }

    selezionaAllRows(e) {
      // logConsole('Premuto check select all', e);
      this.arrayExportTcRun = e;
    }

    deselezionaAllRows(e) {
      // logConsole('Premuto check deselect all', e);
      this.arrayExportTcRun = [];
    }

    riempieArrayExportTcRun(e) {
      // logConsole('Premuto check riga export tcrun', e.dati);
      this.arrayExportTcRun = e.dati;
    }

    chiudeExportTcRun() {
      this.exportTcRunVisibile= false; 
      this.nonChiudereDrawer.emit(false);
    }

  ritornoDimensioniColonneReport(e) {
    ExternalUtilities.scriveDimensioniColonne('Report', e);
  }  

  ritornoDimensioniColonneExport(e) {
    ExternalUtilities.scriveDimensioniColonne('Export', e);
  }  
}  
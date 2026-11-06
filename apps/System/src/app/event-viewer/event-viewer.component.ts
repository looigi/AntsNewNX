import { logConsole } from '../console-log';
import { DatePipe } from '@angular/common';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import Utils from '../Utilities.component';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: 'event-viewer.component.html',
  selector: 'app-event-viewer',
  styleUrls: ['./event-viewer.component.css']
})

export class EventViewerComponent implements OnInit, OnChanges {
  @Input() indirizzoServer;
  @Input() userName;
  @Input() filtro;
  @Input() dateFrom;
  @Input() dateTo;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() agnLog;
  @Input() sessionID;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    // Chiude le sottoscrizioni con takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  public Utils = Utils;
  datiGriglia = undefined;
  datiGriglia2 = undefined;
  nomeGriglia = 'Event Viewer - Summary';
  nomeGriglia2 = 'Event Viewer';
  selezione;
  selezione2;
  effettuaAutoFit = false;
  effettuaAutoFit2 = false;
  caricamentoDatiInCorso = false;
  caricamentoDatiInCorso2 = false;
  rigaSelezionata = null;
  rigaSelezionata2 = null;
  paginaEvents = 1;
  paginaEvents2 = 1;

  filtro2 = '';
  dateFrom2;
  dateTo2;
  ultimaVoltaTMS = -1;

  agnLog2;
  sessionID2;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private sessionService: SessionService,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.caricaTabella();
  }

  ngOnChanges(e) {
    let aggiorna = false;
    let aggiorna2 = false;

    if (e.filtro) {
      // logConsole('Impostato filtro', e.filtro.currentValue);
      this.filtro2 = e.filtro.currentValue;
      // this.caricaTabella();
      aggiorna2 = true;
    }

    if (e.sessionID && e.sessionID.currentValue) {
      this.sessionID2 = e.sessionID.currentValue;
    }

    if (e.dateFrom && e.dateFrom.currentValue) {
      // logConsole('Impostato dateFrom', e.dateFrom.currentValue);
      this.dateFrom2 = e.dateFrom.currentValue;

      aggiorna = true;
      aggiorna2 = true;
    }

    if (e.dateTo && e.dateTo.currentValue) {
      // logConsole('Impostato dateTo', e.dateTo.currentValue);
      this.dateTo2 = e.dateTo.currentValue;

      aggiorna = true;
      aggiorna2 = true;
    }

    if (e.agnLog && e.agnLog.currentValue) {
      // logConsole('Impostato agnLog', e.agnLog.currentValue);
      this.agnLog2 = e.agnLog.currentValue;

      aggiorna2 = true;
    }

    if (aggiorna) { this.caricaTabella(); }
    if (aggiorna2) { this.caricaTabella2(); }
  }

  vecchieColumnProperty;
  messaggioWarning = '';

  caricaTabella() {
    // logConsole('Date From: ', this.dateFrom2);
    // logConsole('Date To: ', this.dateTo2);

    if (!this.dateFrom2 || this.dateFrom2 === null || this.dateFrom2 === 'null' || 
      !this.dateTo2 || this.dateTo2 === null || this.dateTo2 === 'null') {
      return;
    }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS < 1000 && this.ultimaVoltaTMS !== -1) {
      return;
    }
    this.ultimaVoltaTMS = ora;
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    const nomeTabella = 'hist_log_summary__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      // v_filter: this.filtro2,
      tms_from: this.datePipe.transform(this.dateFrom2, 'yyyy-MM-dd HH:mm:ss'),
      tms_to: this.dateTo === null ? null : this.datePipe.transform(this.dateTo2, 'yyyy-MM-dd HH:mm:ss'),
      // v_include_agn: this.agnLog2 === true ? 'Y' : 'N'
    };
    // logConsole('Paramteri di lettura: ', params);

    this.rigaSelezionata = null;

    this.datiGriglia2 = undefined;

    this.caricamentoDatiInCorso = true;
    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        if (this.vecchieColumnProperty) {
          // logConsole('Dati di ritorno:', JSON.parse(this.vecchieColumnProperty), data.ColumnProperty, this.vecchieColumnProperty === JSON.stringify(data.ColumnProperty));
        }
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning = data.v_grid_msg;
        } else {
          this.messaggioWarning = '';
        }

        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
          && data.DataTable && this.vecchieColumnProperty === JSON.stringify(data.ColumnProperty)) {
            // logConsole('Aggiorno dati', data.DataTable);
            this.datiGriglia.DataTable = data.DataTable;
        } else {
          this.vecchieColumnProperty = JSON.stringify(data.ColumnProperty);
          // logConsole('Creo dati', data.DataTable);
          // this.datiGriglia = null;
          // const tm = setTimeout(() => {
            this.datiGriglia = JSON.parse(JSON.stringify(data));
            // // logConsole(this.datiGriglia);
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.paginaEvents = 1;

              this.effettuaAutoFit = !this.effettuaAutoFit;
            }, 1000);
          // }, 1000);
        }
      } else {
        this.datiGriglia = 'empty grid'; // null;
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      // this.datiGriglia = null;
      // logConsole('Read:' + error);
    });
  }

  filtroImpostato = [];

  riempieArraySelezione(e) {
    logConsole('Click su riga check: ', e);
    // alert('1');
    this.filtroImpostato = e.dati;
    this.caricaTabella2();
  }

  clickSelezione1(e) {
    this.rigaSelezionata = e;
    logConsole('Click su riga 1', e);
    // alert('2');
    if (e[0]) { e = e[0]; }
    this.filtroImpostato = e;
    this.caricaTabella2();
  }

  clickSelezione(e) {
    this.rigaSelezionata2 = e;
  }

  lastSelectedOfGrid1(e) {

  }

  lastSelectedOfGrid(e) {

  }

  refreshGrid11(e, r) {
    if (r === true) {
      this.datiGriglia = undefined;
    }
    this.caricaTabella();
  }

  refreshGrid1(e, r) {
    if (r === true) {
      this.datiGriglia2 = undefined;
    }
    this.ultimoFiltro2 = '';
    this.caricaTabella2();
  }

  vecchieColumnProperty2;
  messaggioWarning2 = '';
  ultimoFiltro2 = '';
  callerTag = '';

  caricaTabella2() {
    let filtro = '';
    let f = this.filtroImpostato;
    if (f[0]) { f = f[0];}
    if (f['FILTER']) { 
      f = f['FILTER'];
    // } else {
    //   return;
    }
    logConsole('Carico hist log', this.filtroImpostato);
    if (!this.filtroImpostato[0]) { this.filtroImpostato = [this.filtroImpostato]; }

    if (!f) {
      filtro = '[]';
    } else {
      filtro = '[';
      this.filtroImpostato.forEach(element => {
        if (element.FILTER && element.FILTER !== null) {
          filtro += element.FILTER + ',';
        }
      });
      if (filtro.length > 2) {
        filtro = filtro.substring(0, filtro.length - 1);
      }
      filtro += ']';
    }

    const nomeTabella = 'hist_log__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_filter: this.filtro2,
      tms_from: this.datePipe.transform(this.dateFrom2, 'yyyy-MM-dd HH:mm:ss'),
      tms_to: this.dateTo === null ? null : this.datePipe.transform(this.dateTo2, 'yyyy-MM-dd HH:mm:ss'),
      v_include_agn: this.agnLog2 === true ? 'Y' : 'N',
      v_filter_list: filtro
    };
    logConsole('Paramteri di lettura: ', params);
    if (JSON.stringify(params) === this.ultimoFiltro2) {
      return;
    }
    this.ultimoFiltro2 = JSON.stringify(params);

    this.callerTag = new Date().toString();
    params['v_caller_tag'] = this.callerTag;

    this.rigaSelezionata2 = null;

    this.caricamentoDatiInCorso2 = true;
    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if (!this.controllaRitornoChiamata(this, data, 'EventViewer')) {
        return;
      }
      
      // const data = JSON.parse(data2);
      this.caricamentoDatiInCorso2 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        if (this.vecchieColumnProperty2) {
          // logConsole('Dati di ritorno:', JSON.parse(this.vecchieColumnProperty), data.ColumnProperty, this.vecchieColumnProperty === JSON.stringify(data.ColumnProperty));
        }
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning2 = data.v_grid_msg;
        } else {
          this.messaggioWarning2 = '';
        }

        if (this.datiGriglia2 && this.datiGriglia2 !== 'empty grid' && this.datiGriglia2.DataTable
          && data.DataTable && this.vecchieColumnProperty2 === JSON.stringify(data.ColumnProperty)) {
            // logConsole('Aggiorno dati', data.DataTable);
            this.datiGriglia2.DataTable = data.DataTable;
        } else {
          this.vecchieColumnProperty2 = JSON.stringify(data.ColumnProperty);
          // logConsole('Creo dati', data.DataTable);
          // this.datiGriglia = null;
          // const tm = setTimeout(() => {
            this.datiGriglia2 = JSON.parse(JSON.stringify(data));
            // // logConsole(this.datiGriglia);
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.paginaEvents2 = 1;

              this.effettuaAutoFit2 = !this.effettuaAutoFit2;
            }, 1000);
          // }, 1000);
        }
      } else {
        this.datiGriglia2 = 'empty grid'; // null;
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      // this.datiGriglia = null;
      // logConsole('Read:' + error);
    });
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
      // logConsole('The dialog was closed', result);
      // this.animal = result;
    });
  }

  ritornoDimensioniColonneEV1(e) {
    Utils.scriveDimensioniColonne('EV', e);
  }

  ritornoDimensioniColonneEV(e) {
    Utils.scriveDimensioniColonne('EV', e);
  }

  controllaRitornoChiamata(t, dataP, chiamante) {
    const data = dataP;
    // const chiSono = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2;

    let chiSono = '';

    switch(chiamante) {
      case 'EventViewer':
        chiSono = t.callerTag;
        break;
    }

    if (chiSono === '') {
      if (t.debug2 === true) {
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata nulla ' + chiamante);
      }

      return false;
    }

    if (data && data.v_caller_tag) {
      const ritorno = data.v_caller_tag;
      if (ritorno !== chiSono) {
        if (t.debug2 === true) {
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata diversa ' + chiamante, chiSono, ritorno);
        }
        // nomeRondella = false;
        return false;
      } else {
        if (t.debug2 === true) {
          // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata uguale ' + chiamante, chiSono, ritorno);
        }
        return true;
      }
    } else {
      if (t.debug2 === true) {
        // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: nessun codice di ritorno ' + chiamante);
      }

      return true;
    }
  }
}

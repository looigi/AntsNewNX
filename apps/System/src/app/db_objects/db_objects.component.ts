import { logConsole } from '../console-log';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import Utils from '../Utilities.component';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: 'db_objects.component.html',
  selector: 'app-db-objects',
  styleUrls: ['./db_objects.component.css']
})

export class DBObjectsComponent implements OnInit, OnChanges {
  @Input() indirizzoServer;
  @Input() userName;
  @Input() view_mode;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() sessionID;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    // Chiude le sottoscrizioni con takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  public Utils = Utils;

  datiGriglia;
  nomeGriglia = 'DB Monitor';
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  rigaSelezionata = null;
  totRighe;
  offsetAttuale;
  nuovaPagina;
  view_mode2;
  lastCall = -1;
  sessionID2;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    // // logConsole('Carico tabella');
    this.caricaTabella();
  }

  ngOnChanges(c) {
    if (c.view_mode && c.view_mode.currentValue) {
      if (c.view_mode.currentValue != -1) {
        this.view_mode2 = c.view_mode.currentValue;
        // onsole.log('Cambio view mode', this.view_mode2);
        this.caricaTabella();
      }
    }

    if(c.sessionID && c.sessionID.currentValue) {
      this.sessionID2 = c.sessionID.currentValue;
    }
  }

  /* caricaTabellaInizio() {
    const nomeTabella = 'db_obj__grid_new';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_row_offset: -1,
      v_row_limit:  60
    };

    this.rigaSelezionata = null;
    this.offsetAttuale = 0;

    this.caricamentoDatiInCorso = true;
    this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .subscribe(data => {
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(data);
        this.totRighe = data.tot_rows;
        // logConsole(this.totRighe);
        this.caricaTabella();
      } else {
        this.datiGriglia = null;
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      this.datiGriglia = null;
      // logConsole('Read:' + error);
    });
  } */

  messaggioWarning = '';

  caricaTabella() {
    const ora = new Date().getTime();
    if (ora - this.lastCall < 500 || !this.view_mode2) {
      return;
    }
    this.lastCall = ora;
    const nomeTabella = 'db_obj__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      // v_row_offset: this.offsetAttuale,
      v_view_mode: this.view_mode2
    };
    // logConsole(params);
    // return;

    this.rigaSelezionata = null;

    this.caricamentoDatiInCorso = true;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
        
      if (data && data !== null && data.v_grid_msg !== undefined) {
        this.messaggioWarning = data.v_grid_msg;
      } else {
        this.messaggioWarning = '';
      }

      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        // data.GridProperty[0].rowCount = this.totRighe;
        /* if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable) {
          // logConsole('Aggiorno', data, this.datiGriglia);
          this.datiGriglia.DataTable = JSON.parse(JSON.stringify(data.DataTable));
        } else {
          // this.datiGriglia = null; */
          this.datiGriglia = JSON.parse(JSON.stringify(data));
          const tm = setTimeout(() => {
            clearTimeout(tm);
            // this.datiGriglia.GridProperty[0].rowCount = this.totRighe;
            // // logConsole('Dati griglia 1', this.datiGriglia);
            this.effettuaAutoFit = !this.effettuaAutoFit;
          }, 10);
        // }
      } else {
        this.datiGriglia = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      this.Utils.messaggioDiErrore(this.datiGriglia, error);

      // this.datiGriglia = null;
      // // logConsole('Read:' + error);
    });
  }

  clickSelezione(e) {
    this.rigaSelezionata = e;
    // logConsole(e);
  }

  lastSelectedOfGrid(e) {

  }

  /* cambioPagina(e) {
    this.nuovaPagina = +e.skip;
    const tm = setTimeout(() => {
      if (e.skip === this.nuovaPagina) {
        // // logConsole(e.skip, e.take);
        this.offsetAttuale = e.skip;
        // this.pulisceSelezione = !this.pulisceSelezione;
        // this.paginaGriglia = this.offsetAttuale / Utils.limitPerVirtual;
        this.caricaTabella();
      }
    }, 500);
  } */

  refreshGrid1(e, r) {
    if (r === true) {
      this.datiGriglia = undefined;
    }
    this.caricaTabella();
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

  ritornoDimensioniColonneDBO(e) {
    Utils.scriveDimensioniColonne('DBO', e);
  }
}

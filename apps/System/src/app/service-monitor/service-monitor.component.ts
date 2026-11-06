import { logConsole } from '../console-log';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { Component, Input, OnInit } from '@angular/core';
import Utils from '../Utilities.component';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  templateUrl: 'service-monitor.component.html',
  selector: 'app-service-monitor',
  styleUrls: ['./service-monitor.component.css']
})

export class ServiceMonitorComponent implements OnInit {
  @Input() indirizzoServer;
  @Input() userName;
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
  nomeGriglia = 'Service Monitor';
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  rigaSelezionata = null;
  sessionID2;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.caricaTabella();
  }

  ngOnChanges(e) {
    if (e.sessionID && e.sessionID.currentValue) {
      this.sessionID2 = e.sessionID.currentValue;
    }
  }

  messaggioWarning = '';
  
  caricaTabella() {
    const nomeTabella = 'system_info__grid';
    const params = {
      cntx_id: this.sessionService.getToken()
    };

    this.rigaSelezionata = null;

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
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning = data.v_grid_msg;
        } else {
          this.messaggioWarning = '';
        }

        // // logConsole(data);
        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
          && this.datiGriglia.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia.DataTable = data.DataTable;
        } else {
          // this.datiGriglia = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit = !this.effettuaAutoFit;
          }, 10);
        }
      } else {
        this.datiGriglia = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      // this.datiGriglia = null;
      // logConsole('Read:' + error);
    });
  }

  clickSelezione(e) {
    this.rigaSelezionata = e;
  }

  lastSelectedOfGrid(e) {

  }

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

  ritornoDimensioniColonneSM(e) {
    Utils.scriveDimensioniColonne('SM', e);
  }

  mascheraEdit = false;
  
  premutoEdit(e) {
    logConsole('Premuto edit', e, this.rigaSelezionata);
    if (this.rigaSelezionata[0].FOLDER === "Services") {
      this.mascheraEdit = true;
    }
  }

  inviaModifica() {
    const nomeTabella = 'service_mon__upd';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_service_name: this.rigaSelezionata[0].NAME,
      v_expected_id: this.rigaSelezionata[0].EXPECTED_ID
    };

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

        this.mascheraEdit = false;
        this.caricaTabella();
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      // this.datiGriglia = null;
      // logConsole('Read:' + error);
    });
  }
}

import { logConsole } from '../console-log';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { Component, Input, OnInit } from '@angular/core';
import Utils from '../Utilities.component';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  templateUrl: 'sessions.component.html',
  selector: 'app-sessions',
  styleUrls: ['./sessions.component.css']
})

export class SessionsComponent implements OnInit {
  @Input() indirizzoServer;
  @Input() userName;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() sessionID;

  public Utils = Utils;

  datiGriglia;
  nomeGriglia = 'Session 1';
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

  caricaTabella() {
    this.nomeGriglia = 'Session Monitoring';
    const nomeTabella = 'operator_session__grid';
    const params = {
      cntx_id: this.sessionService.getToken()
    };

    this.rigaSelezionata = null;

    this.caricamentoDatiInCorso = true;
    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .subscribe(data => {
      // const data = JSON.parse(data2);
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        // logConsole(data);
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
    // logConsole(e);
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

    dialogRef.afterClosed().subscribe(result => {
      switch(Cosa) {

      }
      // logConsole('The dialog was closed', result);
      // this.animal = result;
    });
  }

  ritornoDimensioniColonneSESS(e) {
    Utils.scriveDimensioniColonne('SESS', e);
  }
}

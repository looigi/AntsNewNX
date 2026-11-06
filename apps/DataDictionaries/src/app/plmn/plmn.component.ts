import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { Component, Input, OnInit } from '@angular/core';
import Utils from '../Utilities.component';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  templateUrl: 'plmn.component.html',
  selector: 'app-plmn',
  styleUrls: ['./plmn.component.css']
})

export class PlmnComponent implements OnInit {
  @Input() indirizzoServer;
  @Input() userName;
  @Input() righePerPaginareAutomaticamente = -1;

  public Utils = Utils;

  datiGriglia;
  nomeGriglia = 'Plmn';
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  rigaSelezionata = null;
  tastoNew1 = false;
  tastoElimina1 = false;
  tastoEdit1 = false;

  constructor(
    private apiService: ApiService,
    public sessionService: SessionService,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.caricaTabella();
  }

  messaggioWarning = '';

  caricaTabella() {
    const nomeTabella = 'plmn__grid';
    const params = {
      cntx_id: this.sessionService.getToken()
    };

    this.rigaSelezionata = null;
    this.tastoNew1 = false;
    this.tastoElimina1 = false;
    this.tastoEdit1 = false;

    this.caricamentoDatiInCorso = true;
    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
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

        // // this.Utils.scriveLog(data, this.datiGriglia);
        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
          && this.datiGriglia.DataTable.length > 0 && data.DataTable) {
            // this.Utils.scriveLog('Vecchi dati');
            this.datiGriglia.DataTable = data.DataTable;
        } else {
          this.datiGriglia = JSON.parse(JSON.stringify(data));
          // this.Utils.scriveLog('Nuovi dati');
          // this.datiGriglia = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.effettuaAutoFit = !this.effettuaAutoFit;
          }, 500);
        }
      } else {
        this.datiGriglia = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      // this.datiGriglia = null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  clickSelezione(e) {
    this.tastoNew1 = true;
    this.tastoElimina1 = true;
    this.tastoEdit1 = true;
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

    dialogRef.afterClosed().subscribe(result => {
      switch(Cosa) {

      }
      this.Utils.scriveLog('The dialog was closed', result);
      // this.animal = result;
    });
  }

  ritornoDimensioniColonneGriglia(e) {
    Utils.scriveDimensioniColonne('Griglia', e);
  }
}

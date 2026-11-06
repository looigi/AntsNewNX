import { SessionService } from './../db/session.service';
import { ApiService } from './../db/api.service';
import { Component, Input, OnInit } from '@angular/core';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Utils from '../Utilities.component';

@Component({
  templateUrl: 'query_pck_library.component.html',
  selector: 'app-query-pck-library',
  styleUrls: ['./query_pck_library.component.css']
})

export class QueryPCKLibraryComponent implements OnInit {
  @Input() indirizzoServer;
  @Input() userName;
  @Input() righePerPaginareAutomaticamente = -1;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    // Chiude le sottoscrizioni con takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  public Utils = Utils;

  datiGriglia;
  nomeGriglia = 'Query Pck';
  selezione;
  rigaSelezionata;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;

  constructor(
    private apiService: ApiService,
    public sessionService: SessionService,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.caricaTabella();
  }

  refreshGrid1(e, r) {
    if (r === true) {
      this.datiGriglia = undefined;
    }
    this.caricaTabella();
  }

  messaggioWarning = '';
  
  caricaTabella() {
    const nomeTabella = 'query_pck__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_query_pck_id: null
    };
    this.caricamentoDatiInCorso = true;
    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning = data.v_grid_msg;
        } else {
          this.messaggioWarning = '';
        }

        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
          && this.datiGriglia.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia.DataTable = data.DataTable;
        } else {
          this.datiGriglia = 'empty grid'; // null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit = !this.effettuaAutoFit;
          }, 10);
        }
        const tm = setTimeout(() => {
          clearTimeout(tm);
          if (this.datiGriglia && this.datiGriglia.DataTable && this.datiGriglia.DataTable.length > 0) {
            this.rigaSelezionata = this.datiGriglia.DataTable[0];
            this.selezione = this.rigaSelezionata.ROW_ID;
          }
        }, 1000);

      } else {
        this.datiGriglia = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      // this.datiGriglia = null;
      // Utils.messaggioDiErrore(this.datiGriglia, error);
      this.datiGriglia = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  clickSelezione(e) {

  }

  lastSelectedOfGrid(e) {

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

  ritornoDimensioniColonneQPL(e) {
    Utils.scriveDimensioniColonne('QPL', e);
  }
}

import { SessionService } from './../db/session.service';
import { ApiService } from './../db/api.service';
import { Component, Input, OnInit } from '@angular/core';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  templateUrl: 'drive_test_units_mng.component.html',
  selector: 'app-drive-test-units-mng',
  styleUrls: ['./drive_test_units_mng.component.css']
})

export class DriveTestUnitsMngComponent implements OnInit {
  @Input() indirizzoServer;
  @Input() userName;
  @Input() Utils;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    // Chiude le sottoscrizioni con takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  datiGriglia;
  nomeGriglia;
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.caricaTabella();
  }

  caricaTabella() {
    const nomeTabella = '';
    const params = {
      cntx_id: this.sessionService.getToken()
    };
    this.caricamentoDatiInCorso = true;
    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        this.Utils.checkRitornoChiamata(this, data);
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
      // this.Utils.messaggioDiErrore(this.datiGriglia, error);
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
}

import { logConsole } from '../console-log';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { Component, Input, OnInit } from '@angular/core';
import Utils from '../Utilities.component';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: 'system-configuration.component.html',
  selector: 'app-system-configuration',
  styleUrls: ['./system-configuration.component.css']
})

export class SystemConfigurationComponent implements OnInit {
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
  
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  public Utils = Utils;
  datiGriglia;
  nomeGriglia = 'System Monitor';
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  rigaSelezionata = null;
  tastoEditVisibile = false;

  mascheraModifica = false;
  lovSelezionato;
  datiLov;
  TitoloMascheraModifica = '';
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
    const nomeTabella = 'symbolic__grid';
    const params = {
      cntx_id: this.sessionService.getToken()
    };

    this.rigaSelezionata = null;
    this.tastoEditVisibile = false;

    this.caricamentoDatiInCorso = true;
    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2)
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        // // logConsole(data);
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning = data.v_grid_msg;
        } else {
          this.messaggioWarning = '';
        }

        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
          && this.datiGriglia.DataTable.length > 0 && data.DataTable) {
            // // logConsole('Aggiornamento dati', data.DataTable);
            this.datiGriglia.DataTable = data.DataTable;
        } else {
          // this.datiGriglia = 'empty grid'; // null;
          this.datiGriglia = JSON.parse(JSON.stringify(data));
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
    this.tastoEditVisibile = true;
  }

  lastSelectedOfGrid(e) {

  }

  refreshGrid1(e, r) {
    if (r === true) {
      this.datiGriglia = undefined;
    }
    this.caricaTabella();
  }

  premutoTastoEdit(e) {

  }

  selectLov(e) {
    this.lovSelezionato = e.ID;
  }

  apreCombo5N2(cosa) {
    this.rigaSelezionata = [ cosa ];
    this.apreCombo5N();
  }

  apreCombo5N() {
    if (!this.rigaSelezionata) {
      return;
    }
    // logConsole(this.rigaSelezionata);
    const dLov1 = this.rigaSelezionata[0].DOMAIN_LOV;
    this.lovSelezionato = this.rigaSelezionata[0].VALUE;

    if (this.rigaSelezionata[0].DOMAIN_TYPE === 'LOV') {
      const dLov2 = dLov1.split('|');
      this.datiLov = new Array();
      dLov2.forEach(element => {
        this.datiLov.push({ ID: element, NAME: element });
      });
    } else {
      if (this.rigaSelezionata[0].DOMAIN_TYPE === 'date') {
      } else {
        if (this.rigaSelezionata[0].DOMAIN_TYPE === 'integer') {
        } else {
          if (this.rigaSelezionata[0].DOMAIN_TYPE === 'string') {
          } else {
            if (this.rigaSelezionata[0].DOMAIN_TYPE === 'not_editable') {
            }
          }
        }
      }
    }
    let titolo = this.rigaSelezionata[0].NAME;
    if (titolo.indexOf('***') > -1) {
      const t = titolo.split('***');
      titolo = t[2];
    }
    this.TitoloMascheraModifica = titolo;

    this.mascheraModifica = true;
  }

  chiudeMascheraComboAgentProfileN(e) {
    // // logConsole(this.lovSelezionato);
    // // logConsole(this.rigaSelezionataAgentProfile[0]);

    const nomeTabella = 'symbolic_definition__upd';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_name: this.rigaSelezionata[0].NAME,
      v_value: this.lovSelezionato
    };
    // logConsole(params);
    this.caricamentoDatiInCorso = true;
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2)
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        this.caricaTabella();
        // this.caricaAgentsProfile(this.selezioneAgnProfCombo.ID);
        this.mascheraModifica = false;
      } else {
        // alert(data);
      }
    }, error => {
      // logConsole('Read:' + error);
    });
  }

  checkTasto(k) {
    if (k.keyCode === 13) {
      this.chiudeMascheraComboAgentProfileN(k);
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
      // logConsole('The dialog was closed', result);
      // this.animal = result;
    });
  }

  ritornoDimensioniColonneSC(e) {
    Utils.scriveDimensioniColonne('SC', e);
  }

}

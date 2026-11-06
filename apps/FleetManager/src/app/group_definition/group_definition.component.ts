import Utils from '../Utilities.component';
import { SessionService } from './../db/session.service';
import { ApiService } from './../db/api.service';
import { Component, Input, OnInit } from '@angular/core';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: 'group_definition.component.html',
  selector: 'app-group-definition',
  styleUrls: ['./group_definition.component.css']
})

export class GroupDefinitionComponent implements OnInit {
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
  nomeGriglia = 'Group Definition';
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  rigaSelezionata = null;
  tastoEditVisibile1 = false;
  tastoDeleteVisibile1 = false;

  datiGriglia2;
  nomeGriglia2 = 'Group Definition';
  selezione2;
  rigaSelezionata2;
  effettuaAutoFit2 = false;
  caricamentoDatiInCorso2 = false;
  confirmKey2 = false;
  mascheraModificaAttiva2 = false;
  TitoloMascheraModifica2;

  selezione4;
  confirmKey4 = false;
  agentSelezionati4;

  datiGriglia3;
  nomeGriglia3 = 'Group Definition';
  selezione3;
  effettuaAutoFit3 = false;
  caricamentoDatiInCorso3 = false;

  datiGriglia4;
  nomeGriglia4 = 'Move Agents';
  effettuaAutofit4 = false;

  agentSelezionati = '';
  groupIdSelezionato = '';

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
  messaggioWarning4 = '';

  caricaTabella() {
    const nomeTabella = 'agn_group__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_filter_folder: '',
      v_agn_code_filter: ''
    };

    this.rigaSelezionata = null;
    this.tastoEditVisibile1 = false;
    this.tastoDeleteVisibile1 = false;

    this.caricamentoDatiInCorso = true;
    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        // // this.Utils.scriveLog(data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning = data.v_grid_msg;
        } else {
          this.messaggioWarning = '';
        }

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning4 = data.v_grid_msg;
        } else {
          this.messaggioWarning4 = '';
        }

        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
          && this.datiGriglia.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia.DataTable = JSON.parse(JSON.stringify(data.DataTable));
            this.datiGriglia4.DataTable = JSON.parse(JSON.stringify(data.DataTable));
        } else {
          // this.datiGriglia = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia = JSON.parse(JSON.stringify(data));
            this.datiGriglia4 = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit = !this.effettuaAutoFit;
            this.effettuaAutofit4 = !this.effettuaAutofit4;
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              if (this.datiGriglia && this.datiGriglia.DataTable && this.datiGriglia.DataTable.length > 0) {
                this.tastoEditVisibile1 = true;
                this.tastoDeleteVisibile1 = true;
                this.rigaSelezionata = this.datiGriglia.DataTable[0];
                this.selezione = this.rigaSelezionata.ROW_ID;
                const groupId = this.rigaSelezionata.ID;
                this.groupIdSelezionato = groupId;
                this.caricaTabella2(groupId);
              }
            }, 1000);
          }, 10);
        }
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
    this.rigaSelezionata = e;
    this.tastoEditVisibile1 = true;
    this.tastoDeleteVisibile1 = true;

    // this.Utils.scriveLog(e);
    const groupId = e[0].ID;
    this.groupIdSelezionato = groupId;
    this.caricaTabella2(groupId);
  }

  lastSelectedOfGrid(e) {

  }

  refreshGrid1(e, r) {
    if (r === true) {
      this.datiGriglia = undefined;
    }
    this.caricaTabella();
  }

  refreshGrid2(e, r) {
    if (r === true) {
      this.datiGriglia2 = undefined;
    }
    this.caricaTabella2(this.groupIdSelezionato);
  }

  refreshGrid3(e, r) {
    if (r === true) {
      this.datiGriglia3 = undefined;
    }
    this.caricaTabella3(this.rigaSelezionata2);
  }

  refreshGrid4(e, r) {
    if (r === true) {
      this.datiGriglia4 = undefined;
    }
    this.caricaTabella();
  }

  premutoTastoNew1(e) {

  }

  premutoTastoEdit1(e) {
    if (this.rigaSelezionata === null) {
      Utils.messaggioDiErrore('null', 'Please select a row');
      return;
    }
  }

  premutoTastoDelete1(e) {
    if (this.rigaSelezionata === null) {
      Utils.messaggioDiErrore('null', 'Please select a row');
      return;
    }
  }

  messaggioWarning2 = '';

  caricaTabella2(groupId) {
    if (!groupId) {
      return;
    }
    const nomeTabella = 'agn__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_group_id: groupId,
      v_filter: ''
    };
    this.caricamentoDatiInCorso2 = true;
    // this.datiGriglia2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso2 = false;
      if (data && data !== null && data.DataTable && data.DataTable.length > 0) {
        Utils.checkRitornoChiamata(this, data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning2 = data.v_grid_msg;
        } else {
          this.messaggioWarning2 = '';
        }

        if (this.datiGriglia2 && this.datiGriglia2 !== 'empty grid' && this.datiGriglia2.DataTable
          && this.datiGriglia2.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia2.DataTable = data.DataTable;
        } else {
          // this.datiGriglia2 = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia2 = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit2 = !this.effettuaAutoFit2;
          }, 10);
        }
        const tm = setTimeout(() => {
          clearTimeout(tm);
          if (this.datiGriglia2 && this.datiGriglia2.DataTable && this.datiGriglia2.DataTable.length > 0) {
            this.rigaSelezionata2 = this.datiGriglia2.DataTable[0];
            this.selezione2 = this.rigaSelezionata2.ROW_ID;
            const agnId = this.rigaSelezionata2.ID;
            this.caricaTabella3(this.rigaSelezionata2);
          }
        }, 1000);
      } else {
        this.datiGriglia2 = 'empty grid';
        this.datiGriglia3 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      // this.datiGriglia2 = null;
      // Utils.messaggioDiErrore(this.datiGriglia2, error);
      // Utils.messaggioDiErrore(this.datiGriglia3, error);
      this.datiGriglia2 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      this.datiGriglia3 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  clickSuCheckRiga2(e) {
    // this.Utils.scriveLog(e);
    this.agentSelezionati = '';

    e.dati.forEach(element => {
      if (this.agentSelezionati.indexOf(element.ID + ',') === -1) {
        this.agentSelezionati += element.ID + ',';
      }
    });
    if (this.agentSelezionati.length > 0) {
      this.agentSelezionati = this.agentSelezionati.substring(0, this.agentSelezionati.length - 1);
      this.confirmKey2 = true;
    } else {
      this.confirmKey2 = false;
    }
  }

  premutoConfirm2(e) {
    this.mascheraModificaAttiva2 = true;
    this.agentSelezionati4 = undefined;
    this.selezione4 = '';
    this.TitoloMascheraModifica2 = 'Move Agents to the selected Agn Group';
  }

  chiudeMaschera2() {
    this.mascheraModificaAttiva2 = false;
  }

  clickSuCheckRiga4(e) {
    // this.Utils.scriveLog(e);
    this.agentSelezionati4 = e;
    this.confirmKey4 = true;
  }

  premutoConfirm4(e) {
    if (!this.agentSelezionati4) {
      Utils.messaggioDiErrore('null', 'Please select an Agent Group');
      return;
    }

    this.spostaAgents();
  }

  spostaAgents() {
    const nomeTabella = 'agn__upd';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_id_list: this.rigaSelezionata2.ID,
      v_description: this.rigaSelezionata2.DESCRIPTION,
      v_agn_group_id: this.agentSelezionati4[0].ID
    };

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);
      this.mascheraModificaAttiva2 = false;
      this.caricaTabella2(this.groupIdSelezionato);
    }, error => {
      this.caricamentoDatiInCorso3 = false;
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
  }

  clickSelezione2(e) {
    this.selezione2 = e[0].ROW_ID;
    this.rigaSelezionata2 = e[0];
    this.confirmKey2 = true;
    // this.Utils.scriveLog(e);
    this.caricaTabella3(e);
  }

  lastSelectedOfGrid2(e) {

  }

  messaggioWarning3 = '';

  caricaTabella3(e) {
    let ID = '';
    if (e.ID) { ID = e.ID; } else { if (e[0].ID) { ID = e[0].ID; } }

    const nomeTabella = 'agn_info__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_id: ID
    };
    this.caricamentoDatiInCorso3 = true;
    // this.Utils.scriveLog('Parametri Agent Info', params);

    // this.datiGriglia3 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso3 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning3 = data.v_grid_msg;
        } else {
          this.messaggioWarning3 = '';
        }

        // this.Utils.scriveLog('Data Agent Info', data);
        if (this.datiGriglia3 && this.datiGriglia3 !== 'empty grid' && this.datiGriglia3.DataTable
          && this.datiGriglia3.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia3.DataTable = data.DataTable;
        } else {
          // this.datiGriglia3 = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia3 = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit3 = !this.effettuaAutoFit3;
          }, 10);
        }
      } else {
        this.datiGriglia3 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso3 = false;
      // this.datiGriglia3 = null;
      // Utils.messaggioDiErrore(this.datiGriglia3, error);
      this.datiGriglia3 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  clickSelezione3(e) {

  }

  lastSelectedOfGrid3(e) {

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

  ritornoDimensioniColonneGD1(e) {
    Utils.scriveDimensioniColonne('GD1', e);
  }

  ritornoDimensioniColonneGD2(e) {
    Utils.scriveDimensioniColonne('GD2', e);
  }

  ritornoDimensioniColonneGD3(e) {
    Utils.scriveDimensioniColonne('GD3', e);
  }

  ritornoDimensioniColonneGD4(e) {
    Utils.scriveDimensioniColonne('GD4', e);
  }
}

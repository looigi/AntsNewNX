import { logConsole } from '../console-log';
import Utils from '../Utilities.component';
import { SessionService } from './../db/session.service';
import { ApiService } from './../db/api.service';
import { Component, Input, OnInit } from '@angular/core';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  templateUrl: 'profiles_library.component.html',
  selector: 'app-profiles-library',
  styleUrls: ['./profiles_library.component.css']
})

export class ProfilesLibraryComponent implements OnInit {
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
  nomeGriglia = 'Profile Mng 1';
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  selezione;
  rigaSelezionata;
  tastoEditVisibile1 = false;
  tastoDeleteVisibile1 = false;

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  datiGriglia2;
  nomeGriglia2 = 'Profile Mng 2';
  effettuaAutoFit2 = false;
  caricamentoDatiInCorso2 = false;
  selezione2;
  rigaSelezionata2;
  tastoEditVisibile2 = false;
  rigaSelPerModificaN;

  datiLov;
  lovSelezionato;
  TitoloMascheraModifica = '';
  mascheraModificaAttiva = false;
  nomeAP = '';
  nomeCopyAP = '';
  descAP = '';
  modalita = '';
  vecchioNomeAP = '';
  TitoloMascheraModificaCombo5N = '';
  mascheraModificaAttivaComboAgentProfileN = false;

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
    const nomeTabella = 'agn_prof__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_prof_id: null
    };

    this.caricamentoDatiInCorso = true;

    this.rigaSelezionata = null;
    this.tastoEditVisibile1 = false;
    this.tastoDeleteVisibile1 = false;

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

        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable) {
          this.datiGriglia.DataTable = data.DataTable;
        } else {
          // this.datiGriglia = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit = !this.effettuaAutoFit;
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              if (this.datiGriglia && this.datiGriglia.DataTable && this.datiGriglia.DataTable.length > 0) {
                this.rigaSelezionata = this.datiGriglia.DataTable[0];
                this.selezione = this.rigaSelezionata.ROW_ID;
                this.tastoEditVisibile1 = true;
                this.tastoDeleteVisibile1 = true;
                this.caricaInfoGrid(this.rigaSelezionata);
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
    this.caricaInfoGrid(this.rigaSelezionata);
  }

  clickSelezione(e) {
    // this.Utils.scriveLog(e);
    this.tastoEditVisibile1 = true;
    this.tastoDeleteVisibile1 = true;
    this.rigaSelezionata = e[0];
    this.caricaInfoGrid(e[0]);
  }

  lastSelectedOfGrid(e) {

  }

  checkEdge(event) {
    this.edge = event;
    // this.Utils.scriveLog('edge:', event);
  }

  premutoTastoNew1(e) {
    if (this.rigaSelezionata) {
      this.modalita = 'INSERT';
      this.nomeAP = '';
      this.vecchioNomeAP = '';
      this.descAP = '';
      this.nomeCopyAP = this.rigaSelezionata.NAME;
      this.TitoloMascheraModifica = 'New Agent Profile';
      this.mascheraModificaAttiva = true;
    }
  }

  premutoTastoDelete1(e) {
    if (this.rigaSelezionata) {
      this.modalita = 'DELETE';
      this.nomeAP = this.rigaSelezionata.NAME;
      this.vecchioNomeAP = '';
      this.descAP = '';
      this.nomeCopyAP = '';

      this.salvaDatiAP();
    }
  }

  salvaDatiAP() {
    let nomeTabella;
    let params;

    if (this.modalita === 'EDIT') {
      nomeTabella = 'agn_prof__upd';
      params = {
        v_cntx: this.sessionService.getToken(),
        v_name: this.vecchioNomeAP,
        v_name_new: this.nomeAP,
        v_description: this.descAP
      };
    } else {
      if (this.modalita === 'INSERT') {
        nomeTabella = 'agn_prof__ins';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_name: this.nomeAP,
          v_name_copy_from: this.nomeCopyAP,
          v_description: this.descAP
        };
      } else {
        if (this.modalita === 'DELETE') {
          nomeTabella = 'agn_prof__del';
          params = {
            v_cntx: this.sessionService.getToken(),
            v_name: this.nomeAP,
          };
        }
      }
    }

    this.caricamentoDatiInCorso = true;

    // this.datiGriglia2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso = false;
      this.Utils.scriveLog(data);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        this.caricaTabella();

        this.mascheraModificaAttiva = false;
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
  }

  premutoTastoEdit1(e) {
    if (this.rigaSelezionata) {
      this.modalita = 'EDIT';
      this.nomeAP = this.rigaSelezionata.NAME;
      this.vecchioNomeAP = this.rigaSelezionata.NAME;
      this.descAP = this.rigaSelezionata.DESCRIPTION;
      this.nomeCopyAP = '';
      this.TitoloMascheraModifica = 'Edit Agent Profile';
      this.mascheraModificaAttiva = true;
    }
  }

  messaggioWarning2 = '';
  
  caricaInfoGrid(e) {
    const nomeTabella = 'agn_prof_info__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_prof_id: e.ID
    };

    this.caricamentoDatiInCorso2 = true;

    this.rigaSelezionata2 = null;
    this.tastoEditVisibile2 = false;

    // this.datiGriglia2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso2 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning2 = data.v_grid_msg;
        } else {
          this.messaggioWarning2 = '';
        }

        if (this.datiGriglia2 && this.datiGriglia2 !== 'empty grid' && data.DataTable) {
            this.datiGriglia2.DataTable = data.DataTable;
            this.nomeGriglia2 = data.GridProperty[0].GridName;
            this.Utils.scriveLog(this.nomeGriglia2);
        } else {
          // this.datiGriglia2 = null;
          this.datiGriglia2 = JSON.parse(JSON.stringify(data));
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.effettuaAutoFit2 = !this.effettuaAutoFit2;
          }, 100);
        }
      } else {
        this.datiGriglia2 = 'empty grid'; // null;
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      // this.datiGriglia2 = null;
      // Utils.messaggioDiErrore(this.datiGriglia2, error);
      this.datiGriglia2 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  clickSelezione2(e) {
    // this.Utils.scriveLog(e);
    this.tastoEditVisibile2 = true;
    this.rigaSelezionata2 = e;
  }

  lastSelectedOfGrid2(e) {

  }

  premutoTastoEdit2(e) {

  }

  toglieCssDaStringa(e) {
    if (e) {
      if (e.indexOf('***') > -1) {
        e = e.replace('***', '');
        const e2 = e.indexOf('***');
        if (e2 > -1) {
          e = e.substring(e2 + 3, e.length);
        }
        return e;
      } else {
        return e;
      }
    } else {
      return '';
    }
  }

  apreCombo5N2(cosa, daDove) {
    if (daDove === 'AGENTSPROFILE') {
      this.rigaSelezionata2 = [ cosa ];
    }

    this.apreCombo5N(daDove);
  }

  apreCombo5N(daDove) {
    if (!this.rigaSelezionata2 || this.rigaSelezionata2 === null) {
      return;
    }

    this.rigaSelPerModificaN = undefined;

    this.rigaSelPerModificaN = JSON.parse(JSON.stringify(this.rigaSelezionata2[0]));
    this.rigaSelPerModificaN.DOMAIN_TYPE = this.toglieCssDaStringa(this.rigaSelPerModificaN.DOMAIN_TYPE);
    this.rigaSelPerModificaN.VALUE = this.toglieCssDaStringa(this.rigaSelPerModificaN.VALUE);
    this.rigaSelPerModificaN.DOMAIN_LOV = this.toglieCssDaStringa(this.rigaSelPerModificaN.DOMAIN_LOV);
    this.rigaSelPerModificaN.TS_CODE = this.toglieCssDaStringa(this.rigaSelPerModificaN.TS_CODE);
    this.rigaSelPerModificaN.TC_NAME = this.toglieCssDaStringa(this.rigaSelPerModificaN.TC_NAME);
    this.rigaSelPerModificaN.PRM_CODE = this.toglieCssDaStringa(this.rigaSelPerModificaN.PRM_CODE);
    while (this.rigaSelPerModificaN.DOMAIN_LOV.indexOf(',') > -1) {
      this.rigaSelPerModificaN.DOMAIN_LOV = this.rigaSelPerModificaN.DOMAIN_LOV.replace(',', '|');
    }

    if (!this.rigaSelPerModificaN) {
      return;
    }
    // this.Utils.scriveLog(this.rigaSelPerModificaN, this.rigaSelPerModificaN.DOMAIN_TYPE);
    this.lovSelezionato = this.rigaSelPerModificaN.VALUE;

    if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'LOV') {
      const dLov1 = this.rigaSelPerModificaN.DOMAIN_LOV;
      const dLov2 = dLov1.split('|');
      this.datiLov = new Array();
      dLov2.forEach(element => {
        this.datiLov.push({ ID: element, NAME: element });
      });
    } else {
      if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'date') {
      } else {
        if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'integer' || this.rigaSelPerModificaN.DOMAIN_TYPE === 'decimal') {
        } else {
          if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'string') {
          } else {
            if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'not_editable') {
            }
          }
        }
      }
    }
    let titolo = this.rigaSelPerModificaN.NAME;
    if (titolo.indexOf('***') > -1) {
      const t = titolo.split('***');
      titolo = t[2];
    }
    this.TitoloMascheraModificaCombo5N = titolo;
    this.mascheraModificaAttivaComboAgentProfileN = true;
  }

  selectLov(e) {
    this.lovSelezionato = e.ID;
  }

  chiudeMascheraComboAgentProfileN(e) {
    // // this.Utils.scriveLog(this.lovSelezionato);
    // // this.Utils.scriveLog(this.rigaSelezionata);
    // // this.Utils.scriveLog(this.rigaSelPerModificaN);
    // return;

    let nomeTabella = '';
    let params;

    nomeTabella = 'agn_prof_property__upd';
    params = {
      v_cntx: this.sessionService.getToken(),
      v_agn_prof_id: this.rigaSelPerModificaN.AGN_PROF_ID,
      v_name: this.rigaSelPerModificaN.NAME,
      v_value: this.lovSelezionato
    };

    // this.Utils.scriveLog(params);
    this.caricamentoDatiInCorso2 = true;
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso2 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        // // this.Utils.scriveLog(this.rigaSelezionata2);
        this.caricaInfoGrid(this.rigaSelezionata);
        // this.caricaAgentsProfile(this.selezioneAgnProfCombo.ID);
        this.mascheraModificaAttivaComboAgentProfileN = false;
      } else {
        // alert(data);
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
  }

  clickSuIcona(e) {
    // this.Utils.scriveLog(e);
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

  ritornoDimensioniColonnePM1(e) {
    Utils.scriveDimensioniColonne('PM1', e);
  }

  ritornoDimensioniColonnePM2(e) {
    Utils.scriveDimensioniColonne('PM2', e);
  }

  scriveDimensioniColonne(tabella, dimensioniColonne) {
    logConsole('Scrittura dimensioni colonna', tabella, dimensioniColonne);
  }
}

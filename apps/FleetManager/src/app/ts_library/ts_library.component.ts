import { logConsole } from '../console-log';
import Utils from '../Utilities.component';
import { SessionService } from './../db/session.service';
import { ApiService } from './../db/api.service';
import { Component, Input, OnInit } from '@angular/core';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import download from 'downloadjs';  // Importa downloadjs
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  templateUrl: 'ts_library.component.html',
  selector: 'app-ts-library',
  styleUrls: ['./ts_library.component.css']
})

export class TsLibraryComponent implements OnInit {
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
  datiOperatorGroup;
  tsOperatorGroup;

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  nomeGriglia = 'TS Library 1';
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  selezione;
  rigaSelezionata;

  datiGriglia2;
  nomeGriglia2 = 'TS Library 2';
  effettuaAutoFit2 = false;
  caricamentoDatiInCorso2 = false;
  selezione2;
  rigaSelezionata2;
  tastoDeleteVisibile2 = false;
  tastoEditVisibile2 = false;
  tastoCopyVisibile2 = false;
  mascheraModificaAttiva1 = false;

  datiGriglia3;
  nomeGriglia3 = 'TS Library 3';
  effettuaAutoFit3 = false;
  caricamentoDatiInCorso3 = false;
  selezione3;
  rigaSelezionata3;
  tastoEditVisibile3 = false;
  rinfrescaGriglia3 = false;
  rigaSelPerModificaN;

  datiLov;
  lovSelezionato;
  mascheraModificaAttivaComboAgentProfileN = false;
  TitoloMascheraModificaCombo5N = '';

  pulisceFiltroFolders = false;
  tsName;
  tsFolder;
  tsDescription;
  tipoOperazione;
  titoloMaschera = '';
  myBounds2;

  constructor(
    private apiService: ApiService,
    public sessionService: SessionService,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.caricaTabella(false);
    this.caricaOperatorGroup();
  }

  caricaOperatorGroup() {
    const nomeTabella = 'operator_group__grid';
    const params = {
      cntx_id: this.sessionService.getToken()
    };
    this.datiOperatorGroup = 'empty grid'; // null;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);

      this.Utils.scriveLog(data);
      this.datiOperatorGroup = data;
    }, error => {
    });
  }

  caricaTabella(nonProseguire) {
    const nomeTabella = 'geo_lookup__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_category: 'TsFolder'
    };
    this.caricamentoDatiInCorso = true;
    this.datiGriglia = null;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso = false;
      Utils.checkRitornoChiamata(this, data);
      // // this.Utils.scriveLog(data);
      if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
        && this.datiGriglia.DataTable.length > 0 && data.DataTable) {
        this.datiGriglia.DataTable = JSON.parse(JSON.stringify(data.DataTable));
        if (!nonProseguire) {
          this.caricaGriglia2();
        }
      } else {
        // this.datiGriglia = null;
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.datiGriglia = JSON.parse(JSON.stringify(data));
          this.effettuaAutoFit = !this.effettuaAutoFit;
          if (!nonProseguire) {
            this.caricaGriglia2();
          }
        }, 10);
      }
  }, error => {
      this.caricamentoDatiInCorso = false;
      // this.datiGriglia = null;
      // Utils.messaggioDiErrore(this.datiGriglia, error);
      this.datiGriglia = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  caricaGriglia2() {
    // // this.Utils.scriveLog(this.datiGriglia.DataTable);
    if (this.datiGriglia.DataTable.length > 0) {
      this.selezione = this.datiGriglia.DataTable[0].ROW_ID;
      this.rigaSelezionata = this.datiGriglia.DataTable[0];
    } else {
      this.selezione = -1;
      this.rigaSelezionata = { VALUE_STR: '***' };
    }
    this.caricaTsGrid(this.rigaSelezionata);
  }

  refreshGrid1(e) {
    this.caricaTabella(false);
  }

  clickSelezione(e) {
    this.rigaSelezionata = e;
    // // this.Utils.scriveLog(e);
    this.caricaTsGrid(e[0]);
  }

  lastSelectedOfGrid(e) {

  }

  refreshGrid2(r) {
    // this.Utils.scriveLog(this.rigaSelezionata[0]);
    if (r === true) {
      this.datiGriglia2 = undefined;
    }
    this.caricaTsGrid(null);
  }

  refreshGrid3(r) {
    // this.Utils.scriveLog(this.rigaSelezionata[0]);
    if (r === true) {
      this.datiGriglia3 = 'empty grid';
    }
    this.caricaInfoGrid(this.rigaSelezionata2);
  }

  appoggioLS;

  checkLS(e) {
    this.appoggioLS = e;
  }

  selectLovString(e) {
    // logConsole('Valore lov string', e);
    if (e) {
      if (typeof(e) === 'string' && e.indexOf('***') > -1) {
        e = e.replace('***', '');

        const d = JSON.parse(JSON.stringify(this.datiLov));
        const ee = {
          ID: e.trim(),
          NAME: e.trim()
        }
        d.push(ee);
        d.sort((a, b) => (a.ID.localeCompare(b.ID)));
        this.datiLov = undefined;
        const t = setTimeout(() => {
          clearTimeout(t);

          this.datiLov = d;
          // logConsole(this.datiLov);
          const t2 = setTimeout(() => {
            clearTimeout(t2);

            this.lovSelezionato = e.trim();
          }, 100);
        }, 100);
      } else {
        this.lovSelezionato = e.ID;
      }
    } else {
      this.lovSelezionato = '';
    }
  }

  messaggioWarning2 = '';

  caricaTsGrid(e) {
    // if (!e)  { return; }

    const nomeTabella = 'ts__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_filter_folder: 'ALL' // e.VALUE_STR
    };
    this.caricamentoDatiInCorso2 = true;
    this.tastoDeleteVisibile2 = false;
    this.tastoEditVisibile2 = false;
    this.tastoCopyVisibile2 = false;
    this.rigaSelezionata2 = null;

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

        if (this.datiGriglia2 && this.datiGriglia2 !== 'empty grid' && this.datiGriglia2.DataTable
          && this.datiGriglia2.DataTable.length > 0 && data.DataTable) {
          this.datiGriglia2.DataTable = data.DataTable;
          this.caricaGriglia3();
        } else {
          // this.datiGriglia2 = null;
          this.datiGriglia2 = JSON.parse(JSON.stringify(data));
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.effettuaAutoFit2 = !this.effettuaAutoFit2;
            this.caricaGriglia3();
          }, 1000);
        }
      } else {
        this.datiGriglia2 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      this.datiGriglia2 = 'empty grid'; // null;
      // Utils.messaggioDiErrore(this.datiGriglia2, error);
      this.datiGriglia2 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  caricaGriglia3() {
    // // this.Utils.scriveLog(this.datiGriglia2.DataTable);
    if (this.datiGriglia2.DataTable.length > 0) {
      this.selezione2 = this.datiGriglia2.DataTable[0].ROW_ID;
      this.rigaSelezionata2 = this.datiGriglia2.DataTable[0];
    } else {
      this.selezione2 = -1;
      this.rigaSelezionata2 = { ID: -1 };
    }
    this.caricaInfoGrid(this.rigaSelezionata2);
  }

  clickSelezione2(e) {
    // // this.Utils.scriveLog(e);
    this.rigaSelezionata2 = e;
    this.tastoDeleteVisibile2 = true;
    this.tastoEditVisibile2 = true;
    this.tastoCopyVisibile2 = true;
    this.caricaInfoGrid(e[0]);
  }

  lastSelectedOfGrid2(e) {

  }

  checkEdge(event) {
    this.edge = event;
    // this.Utils.scriveLog('edge:', event);
  }

  premutoTastoEdit2(e) {
    if (e) {
      // logConsole(e, this.rigaSelezionata);

      let ok = false;
      this.datiGriglia2.DataTable.forEach(element => {
        if (!ok && +element.ROW_ID === +e) {
          e = element;
          ok = true;
        }
      });
      if (!ok) {
        return;
      }

      this.tipoOperazione = 'MODIFICA';
      this.titoloMaschera = 'Edit scenario';
      let ee;
      if (typeof(e) === 'object') {
        if (e[0]) {
          ee = e[0];
        } else {
          ee = e;
        }
      } else {
        ee = JSON.parse(e);
      }
      let riga = this.rigaSelezionata[0];
      if (!riga) {
        riga = this.rigaSelezionata;
      }
      this.Utils.scriveLog(ee);
      this.Utils.scriveLog(riga);
      this.mascheraModificaAttiva1 = true;
      this.tsName = ee.NAME;
      this.tsFolder = ee.FOLDER;
      this.tsDescription = ee.DESCRIPTION;
      this.tsOperatorGroup = ee.OPERATOR_GROUP_NAME;
    }
  }

  premutoTastoDelete2(e) {
    if (e) {
      this.tipoOperazione = 'DELETE';
      this.salvaDati1();
    }
  }

  premutoTastoCopy2(e) {
    // logConsole(e);
    if (e) {
      this.tipoOperazione = 'COPIA';
      this.titoloMaschera = 'Copy scenario';
      const ee = e[0]; // JSON.parse(e);
      // this.Utils.scriveLog(ee);
      // this.Utils.scriveLog(this.rigaSelezionata);
      let riga = this.rigaSelezionata[0];
      if (!riga) {
        riga = this.rigaSelezionata;
      }
      this.mascheraModificaAttiva1 = true;
      this.tsName = ee.NAME;
      this.tsFolder = riga.VALUE_STR;
      this.tsDescription = ee.DESCRIPTION;
    }
  }

  messaggioWarning3 = '';
  
  caricaInfoGrid(e) {
    // // logConsole('Info grid', e);
    if (e && (e.TS_CODE || (e[0] && e[0].TS_CODE))) {
      // this.Utils.scriveLog(e);
      let tsCode;
      if (e.TS_CODE) {
        tsCode = e.TS_CODE;
      } else {
        if (e[0].TS_CODE) {
          tsCode = e[0].TS_CODE;
        } else {
          console.error('TS_CODE Non presente', e);
          return;
        }
      }
      const nomeTabella = 'ts_info__grid';
      const params = {
        cntx_id: this.sessionService.getToken(),
        v_ts_code: tsCode,
        v_mode: 'advanced'
      };
      this.caricamentoDatiInCorso3 = true;
      this.tastoEditVisibile3 = false;

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

          if (this.datiGriglia3 && this.datiGriglia3 !== 'empty grid' && this.datiGriglia3.DataTable
            && this.datiGriglia3.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia3.DataTable = data.DataTable;
            // logConsole('Refresh info grid');
          } else {
            // this.datiGriglia3 = null;
            this.datiGriglia3 = JSON.parse(JSON.stringify(data));
            // logConsole('Creazione info grid');
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.effettuaAutoFit3 = !this.effettuaAutoFit3;
            }, 1000);
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
    } else {
      this.datiGriglia3 = 'empty grid';
    }
  }

  clickSelezione3(e) {
    this.tastoEditVisibile3 = true;
    this.rigaSelezionata3 = e;
    // // this.Utils.scriveLog(e);
  }

  lastSelectedOfGrid3(e) {

  }

  premutoTastoEdit3(e) {

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
    if (daDove === 'TESTDESIGNCONFIG') {
      this.rigaSelezionata3 = [ cosa ];
    }

    this.apreCombo5N(daDove);
  }

  apreCombo5N(daDove) {
    this.rigaSelPerModificaN = undefined;

    this.rigaSelPerModificaN = JSON.parse(JSON.stringify(this.rigaSelezionata3[0]));
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

    if (this.rigaSelPerModificaN.DOMAIN_TYPE === 'LOV' || (this.rigaSelPerModificaN.DOMAIN_TYPE === 'string' && this.rigaSelPerModificaN.DOMAIN_LOV)) {
      const dLov1 = this.rigaSelPerModificaN.DOMAIN_LOV;
      const dLov2 = dLov1.split('|');
      this.datiLov = new Array();
      let ok = false;
      dLov2.forEach(element => {
        if (element === this.lovSelezionato) {
          ok = true;
        }
        this.datiLov.push({ ID: element, NAME: element });
      });
      if (!ok) {
        this.datiLov.push({ ID: this.lovSelezionato, NAME: this.lovSelezionato });
      }
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
    let titolo = this.rigaSelPerModificaN.PRM_NAME;
    if (titolo.indexOf('***') > -1) {
      const t = titolo.split('***');
      titolo = t[2];
    }
    this.TitoloMascheraModificaCombo5N = titolo;
    this.mascheraModificaAttivaComboAgentProfileN = true;
  }

  selectLov(e) {
    // this.lovSelezionato = e.ID;
    // // logConsole('Valore lov string', e);
    if (e) {
      if (typeof(e) === 'string') { // && e.indexOf('***') > -1) {
        // e = e.replace('***', '');
        // this.lovSelezionato = e;
      } else {
        this.lovSelezionato = e.ID;
        this.appoggioLS = e.ID;
      }
    } else {
      this.lovSelezionato = '';
    }
  }

  chiudeMascheraComboAgentProfileN(e) {
    // // this.Utils.scriveLog(this.lovSelezionato);
    // // this.Utils.scriveLog(this.rigaSelezionataAgentProfile[0]);

    logConsole('Valore da salvare', this.appoggioLS, this.lovSelezionato);
    // return;

    let nomeTabella = '';
    let params;

    nomeTabella = 'ts_info__upd';
    params = {
      v_cntx: this.sessionService.getToken(),
      v_ts_code: this.rigaSelPerModificaN.TS_CODE,
      v_tc_name: this.rigaSelPerModificaN.TC_NAME,
      v_prm_code: this.rigaSelPerModificaN.PRM_CODE,
      v_value: this.lovSelezionato
    };

    // this.Utils.scriveLog(params);
    this.caricamentoDatiInCorso3 = true;
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso3 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        this.caricaInfoGrid(this.rigaSelezionata3[0]);
        // this.caricaAgentsProfile(this.selezioneAgnProfCombo.ID);
        this.mascheraModificaAttivaComboAgentProfileN = false;
      } else {
        // alert(data);
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Read:' + error);
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
      this.Utils.scriveLog('The dialog was closed', result);
      // this.animal = result;
    });
  }

  salvaDati1() {
    // this.Utils.scriveLog(this.rigaSelezionata);
    // this.Utils.scriveLog(this.rigaSelezionata2);
    // return;

    let nomeTabella;
    let params;

    if (this.tipoOperazione === 'COPIA') {
      nomeTabella = 'ts__copy';
      params = {
        v_cntx: this.sessionService.getToken(),
        v_ts_code: this.rigaSelezionata2[0].TS_CODE,
        v_new_name: this.tsName,
        v_folder: this.tsFolder,
        v_description: this.tsDescription
      };
    } else {
      if (this.tipoOperazione === 'MODIFICA') {
        nomeTabella = 'ts__upd';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_ts_code: this.rigaSelezionata2[0].TS_CODE,
          v_name: this.tsName,
          v_folder: this.tsFolder,
          v_description: this.tsDescription,
          v_group_name: this.tsOperatorGroup
        };
        // this.Utils.scriveLog(params);
        // return;
      } else {
        if (this.tipoOperazione === 'DELETE') {
          nomeTabella = 'ts__del';
          params = {
            v_cntx: this.sessionService.getToken(),
            v_ts_code: this.rigaSelezionata2[0].TS_CODE,
          };
        }
      }
    }
    this.tipoOperazione = '';

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.Utils.scriveLog(data);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        this.caricaTabella(true);
        this.caricaTsGrid(this.rigaSelezionata[0])
        this.chiudeMaschera1();
      }
    });
  }

  chiudeMaschera1() {
    this.mascheraModificaAttiva1 = false;
  }

  selectFolders(e) {
    // this.Utils.scriveLog(e);
    if (e) {
      if (e.VALUE_STR) {
        this.tsFolder = e.VALUE_STR;
      } else {
        if (e.indexOf('***') > -1) {
          this.tsFolder = e.replace('***', '');
        }
      }
      this.Utils.scriveLog(this.tsFolder);
    }
  }

  selectOperatorGroup(e) {
    // this.Utils.scriveLog(e);
    if (e) {
      this.tsOperatorGroup = e.NAME;
      // this.Utils.scriveLog(this.tsOperatorGroup);
    }
  }

  downloadTD(e) {
    const nomeTabella = 'ts_pkg__download';
    const params = {
      cntx_id:  this.sessionService.getToken(),
      v_ts_code: e[0].TS_CODE
    }
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // this.Utils.scriveLog(data);
      if (data2 && data2 !== null) {
        Utils.checkRitornoChiamata(this, data2);

        // const data = JSON.parse(data2);
        const data: any = data2;
        // this.Utils.scriveLog(data);
        const fileName = data.v_file_name;
        // const FileSaver = require('file-saver');
        const byteBuf = data.v_ts_pck; // this.u_atob(data.v_ts_pck); // atob(data);
        const blob = new Blob([byteBuf], {type: 'application/octet-stream'});
        // FileSaver.saveAs(blob, fileName);
        download(blob, fileName, 'application/octet-stream');
      }
    });
  }

  u_atob(ascii) {
    return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
  }

  ritornoDimensioniColonneTL2(e) {
    Utils.scriveDimensioniColonne('TL2', e);
  }

  ritornoDimensioniColonneTL3(e) {
    Utils.scriveDimensioniColonne('TL3', e);
  }
}

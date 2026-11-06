import { DatePipe } from '@angular/common';
import Utils from '../Utilities.component';
import { SessionService } from './../db/session.service';
import { ApiService } from './../db/api.service';
import { Component, Input, OnInit } from '@angular/core';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
// import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  templateUrl: 'group_configuration.component.html',
  selector: 'app-group-configuration',
  styleUrls: ['./group_configuration.component.css']
})

export class GroupConfigurationComponent implements OnInit {
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
  public j = JSON;

  datiGriglia;
  nomeGriglia = 'Group Configuration1';
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  rigaSelezionata;
  editKeyVisibile1 = false;
  deleteKeyVisibile1 = false;
  TitoloMascheraModifica1;
  agnGroupId;
  settingsDP = {
    color: '#999',
    bigBanner: true,
    timePicker: true,
    defaultOpen: false,
    format: 'yyyy-MM-dd HH:mm'
  };

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  datiGriglia2;
  nomeGriglia2 = 'Group Configuration2';
  selezione2;
  effettuaAutoFit2 = false;
  caricamentoDatiInCorso2 = false;
  rigaSelezionata2;

  datiGriglia3;
  nomeGriglia3 = 'Group Configuration3';
  selezione3;
  effettuaAutoFit3 = false;
  caricamentoDatiInCorso3 = false;

  datiGriglia4;
  nomeGriglia4 = 'Group Configuration4';
  selezione4;
  rigaSelezionata4;
  effettuaAutoFit4 = false;
  caricamentoDatiInCorso4 = false;
  newKeyVisibile4 = false;
  // editKeyVisibile4 = false;
  deleteKeyVisibile4 = false;
  TitoloMascheraModifica4;

  datiGrigliaAgent;
  nomeGrigliaAgent = 'Group Configuration5';
  selezioneAgent;
  rigaSelezionataAgent;
  effettuaAutoFitAgent = false;
  caricamentoDatiInCorsoAgent = false;
  confirmKeyAgent = false;
  mascheraModificaAttivaAgent = false;
  TitoloMascheraModificaAgent;
  agentSelezionati;

  datiGrigliaAgentInfo;
  nomeGrigliaAgentInfo = 'Group Configuration6';
  selezioneAgentInfo;
  effettuaAutoFitAgentInfo = false;
  caricamentoDatiInCorsoAgentInfo = false;

  datiGrigliaMA;
  nomeGrigliaMA = 'Move Agents';
  effettuaAutofitMA = false;
  selezioneMA;
  confirmKeyMA = false;
  agentSelezionatiMA;

  datiAgnProf;
  agnProfSelezionato;
  selezioneAgnProfCombo;

  datiQueryPck;
  queryPckSelezionato;
  selezioneQueryPckCombo;

  mascheraModificaAttiva1 = false;
  rigaModificata1;
  modificaOInserimento1 = '';

  mascheraModificaAttiva4 = false;
  rigaModificata4;
  modificaOInserimento4 = '';
  datiAgnGroupFolder;

  mascheraModificaAttivaCombo2 = false;
  TitoloMascheraModificaCombo2 = 'Agent Profile associated to the group';

  mascheraModificaAttivaCombo4 = false;
  TitoloMascheraModificaCombo4 = 'Query Pck';

  datiActive = [
    { ID: 'Y', NAME: 'Yes' },
    { ID: 'N', NAME: 'No' },
  ];

  rigaSelPerModificaN;
  rigaSelezionataAI;
  modificaTDC;

  datiLov;
  lovSelezionato;
  mascheraModificaAttivaComboAgentProfileN = false;
  TitoloMascheraModificaCombo5N = '';

  sessionID2;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    public sessionService: SessionService,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.letturaAgnProf();
    this.letturaQueryPck();
    this.caricaTabella();
    this.LeggeDatiMosaicStyle();
  }

  LeggeDatiMosaicStyle() {
    // // this.Utils.scriveLog('Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_category": "AgnGroupFolder"' +
    '}';
    this.apiService.chiamataPost('geo_lookup__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // // this.Utils.scriveLog('Lista lookup:', data2);
      if (data2 && data2 !== null) {
        // // this.Utils.scriveLog('Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        // // this.Utils.scriveLog('Mosaic Style:', data);
        this.datiAgnGroupFolder = data;
     } else {
        this.datiAgnGroupFolder = 'empty grid'; // null;
      }
    }, error => {
      // Utils.messaggioDiErrore(this.datiAgnGroupFolder, error);
      this.datiAgnGroupFolder = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  letturaAgnProf() {
    const nomeTabella = 'agn_prof__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_prof_id: null
    };

    // this.datiGriglia = 'empty grid'; // null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data && data !== null) {
        // this.Utils.scriveLog('AGN Prof', data);
        Utils.checkRitornoChiamata(this, data);
        this.datiAgnProf = data.DataTable; // .DataTable;
        // // this.Utils.scriveLog(data);
      } else {
        this.datiAgnProf = 'empty grid'; // null;
      }
    }, error => {
      this.datiAgnProf = 'empty grid'; // null;
      // Utils.messaggioDiErrore(this.datiAgnProf, error);
      this.datiAgnProf = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  letturaQueryPck() {
    const nomeTabella = 'query_pck__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_query_pck_id: null
    };

    // this.datiGriglia = 'empty grid'; // null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        this.datiQueryPck = data.DataTable;
        // // this.Utils.scriveLog(data);
      } else {
        this.datiQueryPck = 'empty grid'; // null;
      }
    }, error => {
      this.datiQueryPck = 'empty grid'; // null;
      // Utils.messaggioDiErrore(this.datiQueryPck, error);
      this.datiQueryPck = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  messaggioWarning1 = '';
  messaggioWarningMA = '';

  caricaTabella() {
    const nomeTabella = 'agn_group__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_filter_folder: '',
      v_agn_code_filter: ''
    };

    this.caricamentoDatiInCorso = true;
    this.rigaSelezionata = null;
    this.editKeyVisibile1 = false;
    this.deleteKeyVisibile1 = false;
    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso = false;
      // this.Utils.scriveLog('Lettura agn group grid', data);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning1 = data.v_grid_msg;
        } else {
          this.messaggioWarning1 = '';
        }
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningMA = data.v_grid_msg;
        } else {
          this.messaggioWarningMA = '';
        }

        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
          && this.datiGriglia.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia.DataTable = JSON.parse(JSON.stringify(data.DataTable));
            this.datiGrigliaMA.DataTable = JSON.parse(JSON.stringify(data.DataTable));
        } else {
          // this.datiGriglia = 'empty grid'; // null;
          // this.datiGrigliaMA = 'empty grid'; // null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia = JSON.parse(JSON.stringify(data));
            this.datiGrigliaMA = JSON.parse(JSON.stringify(data));
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              this.effettuaAutoFit = !this.effettuaAutoFit;
              if (this.datiGriglia && this.datiGriglia.DataTable && this.datiGriglia.DataTable.length > 0) {
                this.rigaSelezionata = this.datiGriglia.DataTable[0];
                this.agnGroupId = this.rigaSelezionata.ID;
                this.selezione = this.rigaSelezionata.ROW_ID;
                this.agnProfSelezionato = this.rigaSelezionata.AGN_PROF_ID;
                this.queryPckSelezionato = this.rigaSelezionata.QUERY_PCK_ID;

                // // this.Utils.scriveLog(this.rigaSelezionata);
                this.caricaTsLibrary();
                this.caricaAgnProf(this.rigaSelezionata.AGN_PROF_ID);
                this.caricaQueryPck(this.rigaSelezionata.QUERY_PCK_ID);
                this.caricaTabellaAgent(this.rigaSelezionata.ID);

                this.editKeyVisibile1 = true;
                this.deleteKeyVisibile1 = true;
              }
            }, 1000);
          }, 1000);
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
    let id;
    if (e.ROW_ID) {
      this.rigaSelezionata = e;
      this.agnGroupId = e.ID;
      this.agnProfSelezionato = e.AGN_PROF_ID;
      this.queryPckSelezionato = e.QUERY_PCK_ID;
      id = e.ID;
    } else {
      if (e[0].ROW_ID) {
        this.rigaSelezionata = e[0];
        this.agnGroupId = e[0].ID;
        this.agnProfSelezionato = e[0].AGN_PROF_ID;
        this.queryPckSelezionato = e[0].QUERY_PCK_ID;
        id = e[0].ID;
      }
    }
    // this.Utils.scriveLog(e);

    this.editKeyVisibile1 = true;
    this.deleteKeyVisibile1 = true;

    this.caricaTsLibrary();
    this.caricaAgnProf(this.agnProfSelezionato);
    this.caricaQueryPck(this.queryPckSelezionato);
    this.caricaTabellaAgent(id);
  }

  lastSelectedOfGrid(e) {

  }

  refreshGrid1(e, r) {
    if (r === true) {
      this.datiGriglia = undefined;
    }
    this.caricaTabella();
  }

  refreshGrigliaMA(r) {
    if (r === true) {
      this.datiGrigliaMA = undefined;
    }
    this.caricaTabella();
  }

  refreshGriglia3(r) {
    if (r === true) {
      this.datiGriglia3 = undefined;
    }
    this.caricaQueryPck(this.queryPckSelezionato);
  }

  refreshGrid4(r) {
    if (r === true) {
      this.datiGriglia4 = undefined;
    }
    this.caricaTsLibrary();
  }

  refreshAgentProfile(r) {
    if (r === true) {
      this.datiGriglia2 = undefined;
    }
    this.caricaAgnProf(this.agnProfSelezionato);
  }

  refreshGridAgent(r) {
    if (r === true) {
      this.datiGrigliaAgent = undefined;
    }
    this.caricaTabellaAgent(this.rigaSelezionataAgent);
  }

  refreshAgentInfo(r) {
    if (r === true) {
      this.datiGrigliaAgentInfo = undefined;
    }
    this.caricaTabellaAgentInfo(this.rigaSelezionataAgent);
  }

  clickSelezione2(e) {
    this.rigaSelezionata2 = e;
  }

  lastSelectedOfGrid2(e) {

  }

  selectAgnProf(e) {
    if (e) {
      // this.Utils.scriveLog(e);
      this.selezioneAgnProfCombo = e;
      // this.caricaAgnProf(e.ID);
    }
  }

  selectAgnProf2(e) {
    if (e) {
      // this.Utils.scriveLog(e);
      this.rigaModificata1.FOLDER = e;
      // this.caricaAgnProf(e.ID);
    }
  }

  selectAgnProf22(e) {
    if (e) {
      // this.Utils.scriveLog(e);
      this.rigaModificata1.AGN_PROF_ID = e.ID;
      // this.caricaAgnProf(e.ID);
    }
  }

  messaggioWarning2 = '';

  caricaAgnProf(e) {
    if (!e || e === null) {
      this.datiGriglia2 = 'empty grid'; // null;
      return;
    }

    // this.Utils.scriveLog('Carico info', e);
    const nomeTabella = 'agn_prof_info__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_prof_id: e
    };

    this.caricamentoDatiInCorso2 = true;
    // this.datiGriglia2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso2 = false;
      // // this.Utils.scriveLog(data);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning2 = data.v_grid_msg;
        } else {
          this.messaggioWarning2 = '';
        }

        if (this.datiGriglia2 && this.datiGriglia2 !== 'empty grid' && this.datiGriglia2.DataTable
          && this.datiGriglia2.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia2.DataTable = JSON.parse(JSON.stringify(data.DataTable));
            this.nomeGriglia2 = data.GridProperty[0].GridName;
        } else {
          // this.datiGriglia2 = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia2 = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit2 = !this.effettuaAutoFit2;
          }, 10);
        }
      } else {
        this.datiGriglia2 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      // this.datiGriglia2 = null;
      // Utils.messaggioDiErrore(this.datiGriglia2, error);
      this.datiGriglia2 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  clickSelezione3(e) {

  }

  lastSelectedOfGrid3(e) {

  }

  selectQueryPck(e) {
    if (e) {
      // this.Utils.scriveLog(e);
      this.selezioneQueryPckCombo = e;
      // this.caricaQueryPck(e.ID);
    }
  }

  messaggioWarning3 = '';

  caricaQueryPck(e) {
    if (!e || e === null) {
      this.datiGriglia3 = 'empty grid'; // null;
      return;
    }
    const nomeTabella = 'query_pck__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_query_pck_id: e
    };

    this.caricamentoDatiInCorso3 = true;
    // this.datiGriglia3 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso3 = false;
      // // this.Utils.scriveLog(data);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning3 = data.v_grid_msg;
        } else {
          this.messaggioWarning3 = '';
        }

        if (this.datiGriglia3 && this.datiGriglia3 !== 'empty grid' && this.datiGriglia3.DataTable
          && this.datiGriglia3.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia3.DataTable = JSON.parse(JSON.stringify(data.DataTable));
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

  messaggioWarning4 = '';

  caricaTsLibrary() {
    const nomeTabella = 'ts_sched_local__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_group_id: this.agnGroupId,
      v_ts_type: 'Local'
    };
    // this.Utils.scriveLog('Caricamento ts library', params);

    this.caricamentoDatiInCorso4 = true;
    // this.datiGriglia4 = null;
    // this.editKeyVisibile4 = false;
    this.deleteKeyVisibile4 = false;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso4 = false;
      // // this.Utils.scriveLog(data);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning4 = data.v_grid_msg;
        } else {
          this.messaggioWarning4 = '';
        }

        if (this.datiGriglia4 && this.datiGriglia4 !== 'empty grid' && this.datiGriglia4.DataTable
          && this.datiGriglia4.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia4.DataTable = JSON.parse(JSON.stringify(data.DataTable));
        } else {
          // this.datiGriglia4 = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia4 = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit4 = !this.effettuaAutoFit4;
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              if (this.datiGriglia4 && this.datiGriglia4.DataTable && this.datiGriglia4.DataTable.length > 0) {
                this.rigaSelezionata4 = this.datiGriglia4.DataTable[0];
                // this.Utils.scriveLog(this.rigaSelezionata4);
                this.selezione4 = this.rigaSelezionata4.ROW_ID;
                // this.editKeyVisibile4 = true;
                this.deleteKeyVisibile4 = true;
              }
            }, 1000);
          }, 10);
        }
      } else {
        this.datiGriglia4 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso4 = false;
      // this.datiGriglia4 = null;
      // Utils.messaggioDiErrore(this.datiGriglia4, error);
      this.datiGriglia4 = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  clickSelezione4(e) {
    // this.Utils.scriveLog(e);
    this.rigaSelezionata4 = e[0];
    this.newKeyVisibile4 = true;
    this.deleteKeyVisibile4 = true;
  }

  lastSelectedOfGrid4(e) {

  }

  // GESTIONE EDIT-NEW GRIGLIA 1
  editPremuto1(e) {
    this.TitoloMascheraModifica1 = 'Edit Agent Group';
    this.modificaOInserimento1 = 'MODIFICA';
    this.mascheraModificaAttiva1 = true;
    this.rigaModificata1 = JSON.parse(JSON.stringify(this.rigaSelezionata));
  }

  newPremuto1(e) {
    // // this.Utils.scriveLog(this.rigaSelezionata[0]);
    // return;

    this.TitoloMascheraModifica1 = 'Add new Agent Group';
    this.modificaOInserimento1 = 'INSERIMENTO';
    this.mascheraModificaAttiva1 = true;
    // this.rigaModificata1 = JSON.parse(JSON.stringify(this.rigaSelezionata[0]));
    this.rigaModificata1 = {
      NAME: '',
      FOLDER: '',
      DESCRIPTION: '',
      AGN_PROF_ID: '',
      QUERY_PCK_ID: '',
    };
  }

  deletePremuto1(e) {
    const messaggio = 'Do you want delete selected row ?';
    Swal.fire({
      title: '',
      text: messaggio,
      icon: 'warning',
      background: '#9f1f1f',
      color: '#fbf7f7',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    }).then((result) => {
      if (result.value) {
        const nomeTabella = 'agn_group__del';
        const params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.rigaSelezionata[0].ID
        };
  
        this.apiService.chiamataPost('' + nomeTabella, params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          Utils.checkRitornoChiamata(this, data);
  
          this.caricaTabella();
        }, error => {
          Utils.messaggioDiErrore('null', 'DELETE:' + error);
        });  
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
    return;

    if (confirm('Do you want delete selected row ?')) {
      const nomeTabella = 'agn_group__del';
      const params = {
        v_cntx: this.sessionService.getToken(),
        v_id: this.rigaSelezionata[0].ID
      };

      this.apiService.chiamataPost('' + nomeTabella, params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        Utils.checkRitornoChiamata(this, data);

        this.caricaTabella();
      }, error => {
        Utils.messaggioDiErrore('null', 'DELETE:' + error);
      });
    }
  }

  chiudeMaschera1() {
    if (JSON.stringify(this.rigaModificata1) !== JSON.stringify(this.rigaSelezionata[0])) {
      const messaggio = 'Do you want to lose the changes made?';
      Swal.fire({
        title: 'Are you sure want to remove?',
        text: messaggio,
        icon: 'warning',
        background: '#9f1f1f',
        color: '#fbf7f7',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      }).then((result) => {
        if (result.value) {
          this.mascheraModificaAttiva1 = false;
          this.modificaOInserimento1 = '';
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
      /* if (confirm('do you want to lose the changes made?')) {
        this.mascheraModificaAttiva1 = false;
        this.modificaOInserimento1 = '';
      } */
    } else {
      this.mascheraModificaAttiva1 = false;
      this.modificaOInserimento1 = '';
    }
  }

  selectActive1(e) {
    // // this.Utils.scriveLog(e);
    this.rigaModificata1.IS_ACTIVE = e.ID;
  }

  salvaDati1() {
    let nomeTabella = '';
    let params;

    switch (this.modificaOInserimento1) {
      case 'MODIFICA':
        nomeTabella = 'agn_group__upd';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.rigaModificata1.ID,
          v_name: this.rigaModificata1.NAME,
          v_description: this.rigaModificata1.DESCRIPTION,
          v_folder: this.rigaModificata1.FOLDER.value_str,
          v_agn_prof_id: this.rigaModificata1.AGN_PROF_ID,
          v_query_pck_id: this.rigaModificata1.QUERY_PCK_ID,
        };
        break;
      case 'INSERIMENTO':
        nomeTabella = 'agn_group__ins';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_name: this.rigaModificata1.NAME,
          v_description: this.rigaModificata1.DESCRIPTION,
          v_folder: this.rigaModificata1.FOLDER.value_str,
          v_agn_prof_id: this.rigaModificata1.AGN_PROF_ID,
          v_query_pck_id: -1 // this.rigaModificata1.QUERY_PCK_ID,
        };
        break;
    }
    // this.Utils.scriveLog('Salvataggio dati AGN Group', params);
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);

      this.caricaTabella();

      this.mascheraModificaAttiva1 = false;
      this.modificaOInserimento1 = '';
    }, error => {
      Utils.messaggioDiErrore('null', this.modificaOInserimento1 + ':' + error);
    });
  }

  checkEdge(event) {
    this.edge = event;
    // this.Utils.scriveLog('edge:', event);
  }

  // GESTIONE EDIT-NEW GRIGLIA 4
  editPremuto4(e) {
    this.TitoloMascheraModifica4 = 'Edit Local Test Scenario';
    this.modificaOInserimento4 = 'MODIFICA';
    this.mascheraModificaAttiva4 = true;
    this.rigaModificata4 = JSON.parse(JSON.stringify(this.rigaSelezionata4));
    // this.Utils.scriveLog('Riga da modificare: ', this.rigaModificata4);
    this.rigaModificata4.SCHED_RULE_TMS_FROM = this.datePipe.transform(this.rigaModificata4.SCHED_RULE_TMS_FROM, 'yyyy-MM-dd HH:mm:ss');
    this.rigaModificata4.SCHED_RULE_TMS_TO = this.datePipe.transform(this.rigaModificata4.SCHED_RULE_TMS_TO, 'yyyy-MM-dd HH:mm:ss');
  }

  newPremuto42(e) {
    this.rigaSelezionata4 = e;
    this.newPremuto4(e);
  }

  newPremuto4(e) {
    // this.Utils.scriveLog(this.rigaSelezionata4);
    // return;
    /* this.TitoloMascheraModifica4 = 'Add new Local Test Scenario';
    this.modificaOInserimento4 = 'INSERIMENTO';
    this.mascheraModificaAttiva4 = true;
    // this.rigaModificata4 = JSON.parse(JSON.stringify(this.rigaSelezionata4[0]));
    this.rigaModificata4 = {
      SCHED_RULE_TMS_FROM: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      SCHED_RULE_TMS_TO: this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      TS_SCHED_ID: '',
      TS_NAME: '',
      TS_DESCRIPTION: '',
      // TS_FOLDER: '',
      PRIORITY: '',
      SCHED_RULE_CRITERIA: '',
      SCHED_RULE_RADIUS: '',
      SCHED_RULE_PERIOD: '',
      // SCHED_RULE_ITERATIONS = '';
      SCHED_RULE_POINT: '',
      IS_ACTIVE: '',
      AGN_GROUP_ID: this.rigaSelezionata.ID
    }; */
    let nomeTabella = '';
    let params;
    if (e.INCLUDED === 'Y') {
      nomeTabella = 'ts_sched__del';
      params = {
        v_cntx: this.sessionService.getToken(),
        v_id: e.TS_SCHED_ID
      }
    } else {
      nomeTabella = 'ts_sched__ins';
      params = {
        v_cntx: this.sessionService.getToken(),
        v_name: null,
        v_description: null,
        v_folder: null,
        v_priority: null,
        // v_ts_id: this.rigaSelezionata4.TS_SCHED_ID,
        v_ts_code: this.rigaSelezionata4.TS_CODE,
        v_sched_rule_criteria: null,
        v_sched_rule_radius: null,
        v_sched_rule_tms_from: null,
        v_sched_rule_tms_to: null,
        v_sched_rule_period: null,
        v_sched_rule_iterations: null,
        v_sched_rule_point: null,
        v_ts_type: 'Local',
        v_agn_group_id: this.agnGroupId,
        v_is_active: null
      };
    }
    /* const params = {
      v_cntx: this.sessionService.getToken(),
      v_name: null,
      v_description: null,
      v_folder: null,
      v_priority: null,
      v_ts_code: this.rigaSelezionata6.TS_CODE,
      v_sched_rule_criteria: null,
      v_sched_rule_radius: null,
      v_sched_rule_tms_from: null,
      v_sched_rule_tms_to: null,
      v_sched_rule_period: null,
      v_sched_rule_iterations: null,
      v_sched_rule_point: null,
      v_ts_type: 'Local',
      v_agn_group_id: this.agnGroupID,
      v_is_active: null
    }; */

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);

      this.caricaTsLibrary();
    }, error => {
      Utils.messaggioDiErrore('null', this.modificaOInserimento1 + ':' + error);
    });
  }

  deletePremuto4(e) {
    const messaggio = 'Do you want delete selected row ?';
    Swal.fire({
      title: '',
      text: messaggio,
      icon: 'warning',
      background: '#9f1f1f',
      color: '#fbf7f7',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    }).then((result) => {
      if (result.value) {
        const nomeTabella = 'ts_sched__del';
        const params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.rigaSelezionata4.TS_SCHED_ID
        };
  
        this.apiService.chiamataPost('' + nomeTabella, params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          Utils.checkRitornoChiamata(this, data);
  
          this.caricaTsLibrary();
        }, error => {
          Utils.messaggioDiErrore('null', 'DELETE:' + error);
        });  
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
    return;

    if (confirm('Do you want delete selected row ?')) {
      const nomeTabella = 'ts_sched__del';
      const params = {
        v_cntx: this.sessionService.getToken(),
        v_id: this.rigaSelezionata4.TS_SCHED_ID
      };

      this.apiService.chiamataPost('' + nomeTabella, params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        Utils.checkRitornoChiamata(this, data);

        this.caricaTsLibrary();
      }, error => {
        Utils.messaggioDiErrore('null', 'DELETE:' + error);
      });
    }
  }

  chiudeMaschera4() {
    if (JSON.stringify(this.rigaModificata4) !== JSON.stringify(this.rigaSelezionata4[0])) {
      const messaggio = 'Do you want to lose the changes made?';
      Swal.fire({
        title: '',
        text: messaggio,
        icon: 'warning',
        background: '#9f1f1f',
        color: '#fbf7f7',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      }).then((result) => {
        if (result.value) {
          this.mascheraModificaAttiva4 = false;
          this.modificaOInserimento4 = '';
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });

      /* if (confirm('do you want to lose the changes made?')) {
        this.mascheraModificaAttiva4 = false;
        this.modificaOInserimento4 = '';
      } */
    } else {
      this.mascheraModificaAttiva4 = false;
      this.modificaOInserimento4 = '';
    }
  }

  selectActive4(e) {
    // // this.Utils.scriveLog(e);
    this.rigaModificata4.IS_ACTIVE = e.ID;
  }

  salvaDati4() {
    let nomeTabella = '';
    let params;

    switch (this.modificaOInserimento4) {
      case 'MODIFICA':
        nomeTabella = 'ts_sched__upd';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_id: this.rigaModificata4.TS_SCHED_ID,
          v_name: this.rigaModificata4.TS_NAME,
          v_description: this.rigaModificata4.TS_DESCRIPTION,
          v_folder: this.rigaModificata4.TS_FOLDER,
          v_priority: this.rigaModificata4.PRIORITY,
          v_ts_code: this.rigaModificata4.TS_ID,
          v_sched_rule_criteria: this.rigaModificata4.SCHED_RULE_CRITERIA,
          v_sched_rule_radius: this.rigaModificata4.SCHED_RULE_RADIUS,
          v_sched_rule_tms_from: this.datePipe.transform(this.rigaModificata4.SCHED_RULE_TMS_FROM, 'yyyy-MM-dd HH:mm:ss'),
          v_sched_rule_tms_to: this.datePipe.transform(this.rigaModificata4.SCHED_RULE_TMS_TO, 'yyyy-MM-dd HH:mm:ss'),
          v_sched_rule_period: this.rigaModificata4.SCHED_RULE_PERIOD,
          v_sched_rule_iterations: this.rigaModificata4.SCHED_RULE_ITERATIONS,
          v_sched_rule_point: this.rigaModificata4.SCHED_RULE_POINT,
          v_ts_type: 'Local',
          v_agn_group_id: this.rigaModificata4.AGN_GROUP_ID,
          v_is_active: this.rigaModificata4.IS_ACTIVE
        };
        break;
      case 'INSERIMENTO':
        nomeTabella = 'ts_sched__ins';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_name: this.rigaModificata4.TS_NAME,
          v_description: this.rigaModificata4.TS_DESCRIPTION,
          v_folder: this.rigaModificata4.TS_FOLDER,
          v_priority: this.rigaModificata4.PRIORITY,
          v_ts_code: this.rigaModificata4.TS_ID,
          v_sched_rule_criteria: this.rigaModificata4.SCHED_RULE_CRITERIA,
          v_sched_rule_radius: this.rigaModificata4.SCHED_RULE_RADIUS,
          v_sched_rule_tms_from: this.datePipe.transform(this.rigaModificata4.SCHED_RULE_TMS_FROM, 'yyyy-MM-dd HH:mm:ss'),
          v_sched_rule_tms_to: this.datePipe.transform(this.rigaModificata4.SCHED_RULE_TMS_TO, 'yyyy-MM-dd HH:mm:ss'),
          v_sched_rule_period: this.rigaModificata4.SCHED_RULE_PERIOD,
          v_sched_rule_iterations: this.rigaModificata4.SCHED_RULE_ITERATIONS,
          v_sched_rule_point: this.rigaModificata4.SCHED_RULE_POINT,
          v_ts_type: 'Local',
          v_agn_group_id: this.rigaModificata4.AGN_GROUP_ID,
          v_is_active: this.rigaModificata4.IS_ACTIVE
        };
        break;
    }

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);

      this.caricaTsLibrary();

      this.mascheraModificaAttiva4 = false;
      this.modificaOInserimento4 = '';
    }, error => {
      Utils.messaggioDiErrore('null', this.modificaOInserimento4 + ':' + error);
    });
  }

  chiudeMascheraCombo2(e) {
    // this.Utils.scriveLog(this.selezioneAgnProfCombo.ID);
    // this.Utils.scriveLog(this.rigaSelezionata);
    // this.Utils.scriveLog(this.rigaSelezionata2);
    const nomeTabella = 'agn_group__upd';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_id: this.rigaSelezionata.ID,
      v_name: this.rigaSelezionata.NAME,
      v_folder: this.rigaSelezionata.FOLDER,
      v_description: this.rigaSelezionata.DESCRIPTION,
      v_agn_prof_id: this.selezioneAgnProfCombo.ID,
      v_query_pck_id: this.rigaSelezionata.QUERY_PCK_ID
    };
    // this.Utils.scriveLog(params);
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso4 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        this.caricaAgnProf(this.rigaSelezionata.AGN_PROF_ID);
        // this.caricaTabella();
        // this.caricaAgentsProfile(this.selezioneAgnProfCombo.ID);
        this.mascheraModificaAttivaCombo2 = false;
      } else {
        // alert(data);
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
  }

  chiudeMascheraCombo4(e) {
    // this.Utils.scriveLog(this.selezioneQueryPckCombo);
    // this.Utils.scriveLog(this.rigaSelezionata);
    const nomeTabella = 'agn_group__upd';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_id: this.rigaSelezionata.ID,
      v_name: this.rigaSelezionata.NAME,
      v_folder: this.rigaSelezionata.FOLDER,
      v_description: this.rigaSelezionata.DESCRIPTION,
      v_agn_prof_id: this.rigaSelezionata.AGN_PROF_ID,
      v_query_pck_id: this.selezioneQueryPckCombo.ID
    };
    // this.Utils.scriveLog(params);
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso4 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        this.caricaTabella();
        // this.caricaAgentsProfile(this.selezioneAgnProfCombo.ID);
        this.mascheraModificaAttivaCombo4 = false;
      } else {
        // alert(data);
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
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
      this.rigaSelezionata2 = cosa;
    } else {
      if (daDove === 'TESTDESIGNCONFIG') {
        // this.rigaSelezionata3 = [ cosa ];
      }
    }
    this.apreCombo5N(daDove);
  }

  apreCombo5N(daDove) {
    this.rigaSelPerModificaN = undefined;
    if (daDove === 'AGENTINFO') {
      this.rigaSelPerModificaN = JSON.parse(JSON.stringify(this.rigaSelezionataAI));
      this.modificaTDC = '2';
    } else {
      let r = this.rigaSelezionata2;
      if (r[0]) {
        r = r[0];
      }
      // // this.Utils.scriveLog(r);
      this.rigaSelPerModificaN = JSON.parse(JSON.stringify(r));
      this.rigaSelPerModificaN.DOMAIN_TYPE = this.toglieCssDaStringa(this.rigaSelPerModificaN.DOMAIN_TYPE);
      this.rigaSelPerModificaN.VALUE = this.toglieCssDaStringa(this.rigaSelPerModificaN.VALUE);
      this.rigaSelPerModificaN.DOMAIN_LOV = this.toglieCssDaStringa(this.rigaSelPerModificaN.DOMAIN_LOV);
      this.rigaSelPerModificaN.TS_CODE = this.toglieCssDaStringa(this.rigaSelPerModificaN.TS_CODE);
      this.rigaSelPerModificaN.TC_NAME = this.toglieCssDaStringa(this.rigaSelPerModificaN.TC_NAME);
      this.rigaSelPerModificaN.PRM_CODE = this.toglieCssDaStringa(this.rigaSelPerModificaN.PRM_CODE);
      while (this.rigaSelPerModificaN.DOMAIN_LOV.indexOf(',') > -1) {
        this.rigaSelPerModificaN.DOMAIN_LOV = this.rigaSelPerModificaN.DOMAIN_LOV.replace(',', '|');
      }
      this.modificaTDC = '3';
    }
    if (!this.rigaSelPerModificaN) {
      return;
    }
    // // this.Utils.scriveLog(this.rigaSelPerModificaN, this.rigaSelPerModificaN.DOMAIN_TYPE);
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
    // // this.Utils.scriveLog(this.rigaSelPerModificaN);
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
    // // this.Utils.scriveLog(this.rigaSelPerModificaN);
    // return;

    /*
    v_agn_prof_id: 4
    v_cntx: "b9a793c8c7d166716949af3fccd59a99"
    v_name: "grant_scenario_add"
    v_value: "Y"
    */

    let nomeTabella = '';
    let params;

    if (this.modificaTDC === '3') {
      nomeTabella = 'agn_prof_property__upd';
      params = {
        v_cntx: this.sessionService.getToken(),
        v_agn_prof_id: this.agnProfSelezionato,
        v_name:  this.rigaSelPerModificaN.NAME,
        v_value: this.lovSelezionato
      };
    } else {
      if (this.modificaTDC === '2') {
        nomeTabella = 'agn_property__upd';
        params = {
          v_cntx: this.sessionService.getToken(),
          v_agn_code: this.rigaSelezionataAI.AGN_CODE,
          v_name: this.rigaSelezionataAI.NAME,
          v_value: this.lovSelezionato
        };
      }
    }
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

        if (this.modificaTDC === '3') {
          this.caricaAgnProf(this.agnProfSelezionato);
        } else {
          if (this.modificaTDC === '2') {
            this.caricaTabellaAgentInfo(this.rigaSelezionataAgent);
          } else {
          }
        }

        // this.caricaAgentsProfile(this.selezioneAgnProfCombo.ID);
        this.mascheraModificaAttivaComboAgentProfileN = false;
      } else {
        // alert(data);
      }
    }, error => {
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
  }

  messaggioWarningAgent = '';

  caricaTabellaAgent(groupId) {
    if (!groupId) {
      return;
    }
    const nomeTabella = 'agn__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_group_id: groupId,
      v_filter: ''
    };
    // this.Utils.scriveLog('Carica agent', params);
    this.caricamentoDatiInCorsoAgent = true;
    // this.datiGriglia2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorsoAgent = false;
      if (data && data !== null && data.DataTable && data.DataTable.length > 0) {
        Utils.checkRitornoChiamata(this, data);
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningAgent = data.v_grid_msg;
        } else {
          this.messaggioWarningAgent = '';
        }

        if (this.datiGrigliaAgent && this.datiGrigliaAgent !== 'empty grid' && this.datiGrigliaAgent.DataTable
          && this.datiGrigliaAgent.DataTable.length > 0 && data.DataTable) {
            this.datiGrigliaAgent.DataTable = data.DataTable;
        } else {
          // this.datiGriglia2 = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGrigliaAgent = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFitAgent = !this.effettuaAutoFitAgent;
          }, 10);
        }
        const tm = setTimeout(() => {
          clearTimeout(tm);
          if (this.datiGrigliaAgent && this.datiGrigliaAgent.DataTable && this.datiGrigliaAgent.DataTable.length > 0) {
            this.rigaSelezionataAgent = this.datiGrigliaAgent.DataTable[0];
            this.selezioneAgent = this.rigaSelezionataAgent.ROW_ID;
            const agnId = this.rigaSelezionataAgent.ID;
            this.caricaTabellaAgentInfo(this.rigaSelezionataAgent);
          }
        }, 1000);
      } else {
        this.datiGrigliaAgent = 'empty grid';
        this.datiGrigliaAgentInfo = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorsoAgent = false;
      // this.datiGriglia2 = null;
      // Utils.messaggioDiErrore(this.datiGrigliaAgent, error);
      // Utils.messaggioDiErrore(this.datiGrigliaAgentInfo, error);
      this.datiGrigliaAgent = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      this.datiGrigliaAgentInfo = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  clickSuCheckRigaAgent(e) {
    // this.Utils.scriveLog(e);
    this.agentSelezionati = '';

    e.dati.forEach(element => {
      if (this.agentSelezionati.indexOf(element.ID + ',') === -1) {
        this.agentSelezionati += element.ID + ',';
      }
    });
    if (this.agentSelezionati.length > 0) {
      this.agentSelezionati = this.agentSelezionati.substring(0, this.agentSelezionati.length - 1);
      this.confirmKeyAgent = true;
    } else {
      this.confirmKeyAgent = false;
    }
  }

  lastSelectedOfGridAgent(e) {

  }

  chiudeMascheraAgent() {
    this.mascheraModificaAttivaAgent = false;
  }

  premutoConfirmAgent(e) {
    this.mascheraModificaAttivaAgent = true;
    this.agentSelezionatiMA = undefined;
    this.selezione4 = '';
    this.TitoloMascheraModificaAgent = 'Move Agents to the selected Agn Group';
  }

  clickSuCheckRigaMA(e) {
    // this.Utils.scriveLog(e);
    this.agentSelezionatiMA = '';

    e.forEach(element => {
      if (this.agentSelezionatiMA.indexOf(element.ID + ',') === -1) {
        this.agentSelezionatiMA += element.ID + ',';
      }
    });
    if (this.agentSelezionatiMA.length > 0) {
      this.agentSelezionatiMA = this.agentSelezionatiMA.substring(0, this.agentSelezionatiMA.length - 1);
      this.confirmKeyMA = true;
    } else {
      this.confirmKeyMA = false;
    }
  }

  clickSelezioneAgent(e) {
    this.selezioneAgent = e[0].ROW_ID;
    this.rigaSelezionataAgent = e[0];
    this.confirmKeyAgent = true;
    // this.Utils.scriveLog(e);
    this.caricaTabellaAgentInfo(e);
  }

  messaggioWarningAgentInfo = '';

  caricaTabellaAgentInfo(e) {
    // // this.Utils.scriveLog('Carica tabella Agent Info', e);
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
          this.messaggioWarningAgentInfo = data.v_grid_msg;
        } else {
          this.messaggioWarningAgentInfo = '';
        }

        // this.Utils.scriveLog('Data Agent Info', data);
        if (this.datiGrigliaAgentInfo && this.datiGrigliaAgentInfo !== 'empty grid' && this.datiGrigliaAgentInfo.DataTable
          && this.datiGrigliaAgentInfo.DataTable.length > 0 && data.DataTable) {
            this.datiGrigliaAgentInfo.DataTable = data.DataTable;
        } else {
          // this.datiGriglia3 = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGrigliaAgentInfo = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFitAgentInfo = !this.effettuaAutoFitAgentInfo;
          }, 10);
        }
      } else {
        this.datiGrigliaAgentInfo = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorsoAgentInfo = false;
      // this.datiGriglia3 = null;
      // Utils.messaggioDiErrore(this.datiGrigliaAgentInfo, error);
      this.datiGrigliaAgentInfo = 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
    });
  }

  clickSelezioneAgentInfo(e) {

  }

  lastSelectedOfGridAgentInfo(e) {

  }

  premutoConfirmMA(e) {
    if (!this.agentSelezionatiMA) {
      Utils.messaggioDiErrore('null', 'Please select an Agent Group');
      return;
    }

    this.spostaAgents();
  }

  spostaAgents() {
    // // this.Utils.scriveLog(this.rigaSelezionataAgent);
    const nomeTabella = 'agn__upd';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_id_list: this.rigaSelezionataAgent.ID,
      v_description: this.rigaSelezionataAgent.DESCRIPTION,
      v_agn_group_id: this.rigaSelezionata.ID
    };
    // // this.Utils.scriveLog(params);
    // return;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      Utils.checkRitornoChiamata(this, data);
      this.mascheraModificaAttivaAgent = false;
      this.caricaTabellaAgent(this.rigaSelezionata.ID);
    }, error => {
      this.caricamentoDatiInCorso3 = false;
      Utils.messaggioDiErrore('null', 'Read:' + error);
    });
  }

  clickAgentInfoN(e) {
    // this.Utils.scriveLog(e);
    this.rigaSelezionataAI = JSON.parse(e);
    this.apreCombo5N('AGENTINFO');
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

  ritornoDimensioniColonneGDA(e) {
    Utils.scriveDimensioniColonne('GDA', e);
  }

  ritornoDimensioniColonneGDAI(e) {
    Utils.scriveDimensioniColonne('GDAI', e);
  }

  ritornoDimensioniColonneGC1(e) {
    Utils.scriveDimensioniColonne('GC2', e);
  }

  ritornoDimensioniColonneGC2(e) {
    Utils.scriveDimensioniColonne('GC2', e);
  }

  ritornoDimensioniColonneGC3(e) {
    Utils.scriveDimensioniColonne('GC3', e);
  }

  ritornoDimensioniColonneGC4(e) {
    Utils.scriveDimensioniColonne('GC4', e);
  }

  ritornoDimensioniColonneMA(e) {
    Utils.scriveDimensioniColonne('MA', e);
  }
}

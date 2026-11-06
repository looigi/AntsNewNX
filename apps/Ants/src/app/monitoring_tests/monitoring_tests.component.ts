import { logConsole } from '../console-log';
import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Utils } from "../Utilities.component";
import { ApiService } from "../db/api.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'tests-component',
  templateUrl: './monitoring_tests.component.html',
  styleUrls: ['./monitoring_tests.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TestsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() sessioneID: string = '';
  @Input() userName: string = '';
  @Input() Utils: any;

  caricamentoDatiInCorsoTree: boolean = false;
  datiGrigliaTree: any = 'empty grid';
  nomeGrigliaTree = '';
  selezioneTree: any[] = [];
  messaggioWarningTree = '';
  rigaSelezionataTree: any;
  lastTree = '';

  caricamentoDatiInCorsoGriglia: boolean = false;
  datiGrigliaGriglia: any = 'empty grid';
  nomeGrigliaGriglia = '';
  selezioneGriglia: any[] = [];
  messaggioWarningGriglia = '';
  lastGriglia = '';

  caricamentoDatiInCorsoGriglia1: boolean = false;
  datiGrigliaGriglia1: any = 'empty grid';
  nomeGrigliaGriglia1 = '';
  selezioneGriglia1: any[] = [];
  rigaSelezionata1: any;
  messaggioWarningGriglia1 = '';
  lastGriglia1 = '';

  caricamentoDatiInCorsoGriglia2: boolean = false;
  datiGrigliaGriglia2: any = 'empty grid';
  nomeGrigliaGriglia2 = '';
  selezioneGriglia2: any[] = [];
  rigaSelezionata2: any;
  messaggioWarningGriglia2 = '';
  lastGriglia2 = '';

  righePerPaginareAutomaticamente = 100;
  destroy$ = new Subject<void>();

  datiModifica: any;
  rigaSelezionata: any;
  editDataVisible = false;

  vecchiaStrutturaTree = '';
  vecchiaStrutturaGriglia = '';
  vecchiaStrutturaGriglia1 = '';
  vecchiaStrutturaGriglia2 = '';

  constructor (
    private apiService: ApiService,
  ) {

  }

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: any): void {
    let carica = false;

    if (changes.sessioneID) {
      if (changes.sessioneID.currentValue) {
        carica = true;
      }
    }
    if (changes.Utils) {
      if (changes.Utils.currentValue) {
        carica = true;
      }
    }
    if (changes.userName) {
      if (changes.userName.currentValue) {
        carica = true;
      }
    }

    if (carica) {
      this.caricaDatiTree();
    }
  }

  caricaDatiTree() {
    if (!this.sessioneID || !this.Utils || !Utils.serverPostRest || !this.userName) {
      return;
    }

    this.caricamentoDatiInCorsoTree = true;
    this.datiGrigliaGriglia = 'empty grid';
    this.selezioneGriglia = [];
    this.messaggioWarningTree = '';

    const params = {
      v_cntx_id: this.sessioneID,
      v_filter: [{"SCENARIO_TYPE": "Monitoring"}]
    };
    this.apiService.chiamataPost('ants1_td_sched_tree__grid', params, true)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.caricamentoDatiInCorsoTree = false;
      if (data) {
        /* if (data.err_code !== 0) {
          const rr = data.failure_reason;
          this.messaggioWarningTree = rr;
        } else { */
            if (this.datiGrigliaTree && data.DataTable && this.datiGrigliaTree !== null && this.datiGrigliaTree !== 'empty grid' &&
              this.vecchiaStrutturaTree !== JSON.stringify(data.ColumnProperty)) {
              this.datiGrigliaTree.DataTable = JSON.parse(JSON.stringify(data.DataTable));
            } else {
              this.datiGrigliaTree = undefined;
              this.vecchiaStrutturaTree = JSON.stringify(data.ColumnProperty);

              const tm1 = setTimeout(() => {
                clearTimeout(tm1);

                logConsole('Dati arrivati tree', data);
                this.datiGrigliaTree = data;
              }, 100);
            }          
        // }
      }
    }, error => {
      this.caricamentoDatiInCorsoTree = false;
      this.messaggioWarningTree = error;
    });    
  }

  clickSelezioneTree(event: any) {
    logConsole('clickSelezioneTree', event);
    this.rigaSelezionataTree = event;
    this.caricaDatiGriglia(event);
  }

  lastSelectedOfGridTree(event: any) {
    logConsole('lastSelectedOfGridTree', event);
  }

  refreshGridTree(event: any, resetLayout: boolean) {
    logConsole('refreshGridTree', event, resetLayout);
    if (resetLayout === true) {
      this.datiGrigliaTree = undefined;
    }
    this.lastTree = '';
    this.caricaDatiTree();
  }

  cambioPaginaTree(event: any) {
    logConsole('cambioPaginaTree', event);
  }

  ritornoDimensioniColonneGrigliaTree(event: any) {
    logConsole('ritornoDimensioniColonneGrigliaTree', event);
  } 

  caricaDatiGriglia(rigaSelezionata: any) {
    if (!this.sessioneID || !this.Utils || !Utils.serverPostRest || !this.userName || !rigaSelezionata) {
      return; 
    }

    this.caricamentoDatiInCorsoGriglia = true;
    this.messaggioWarningGriglia = '';

    if (!rigaSelezionata[0]) { rigaSelezionata = [rigaSelezionata]; }
    
    const params = {
      v_cntx_id: this.sessioneID,
      v_filter: JSON.parse(rigaSelezionata[0].filter)
    };
    
    if (this.lastGriglia === JSON.stringify(params)) {
      return;
    }
    this.lastGriglia = JSON.stringify(params);

    this.apiService.chiamataPost('ants1_td_sched_full__grid', params, true)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.caricamentoDatiInCorsoGriglia = false;
      if (data) {
        /* if (data.err_code !== 0) {
          const rr = data.failure_reason;
          this.messaggioWarningGriglia = rr;
        } else { */
          if (this.datiGrigliaGriglia && data.DataTable && this.datiGrigliaGriglia !== null && this.datiGrigliaGriglia !== 'empty grid' &&
            this.vecchiaStrutturaGriglia !== JSON.stringify(data.ColumnProperty)) {
            this.datiGrigliaGriglia.DataTable = JSON.parse(JSON.stringify(data.DataTable));
          } else {
            this.datiGrigliaGriglia = undefined;
            this.vecchiaStrutturaGriglia = JSON.stringify(data.ColumnProperty);

            const tm1 = setTimeout(() => {
              clearTimeout(tm1);

              this.datiGrigliaGriglia = data;
            }, 100);
          }      

          this.datiGrigliaGriglia1 = 'empty grid';
          this.datiGrigliaGriglia2 = 'empty grid';

        // }
      }
    }, error => {
      this.caricamentoDatiInCorsoGriglia = false;
      this.messaggioWarningGriglia = error;
    });    
  }

  clickSelezioneGriglia(event: any) {
    logConsole('clickSelezione', event);
    this.rigaSelezionata = event;
    if (this.rigaSelezionata[0]) { this.rigaSelezionata = this.rigaSelezionata[0]; }
    this.caricaDatiGriglia1(this.rigaSelezionata);
  }

  lastSelectedOfGridGriglia(event: any) {
    logConsole('lastSelectedOfGrid', event);
  }

  refreshGridGriglia(event: any, resetLayout: boolean) {
    logConsole('refreshGrid', event, resetLayout);
    if (resetLayout === true) {
      this.datiGrigliaGriglia = undefined;
    }
    this.lastGriglia = '';
    this.caricaDatiGriglia1(this.rigaSelezionataTree);
  }

  cambioPaginaGriglia(event: any) {
    logConsole('cambioPagina', event);
  }

  ritornoDimensioniColonneGrigliaGriglia(event: any) {
    logConsole('ritornoDimensioniColonneGriglia', event);
  } 

  editPremuto(e: any) {
    logConsole('Edit premuto: ', this.rigaSelezionata);

    this.datiModifica = {
      ColumnProperty: this.datiGrigliaGriglia.ColumnProperty,
      RigaSelezionata: this.rigaSelezionata
    }
    this.editDataVisible = true;
  }

  clickSelezioneGriglia1(event: any) {
    logConsole('clickSelezione', event);
    this.rigaSelezionata1 = event;
    if (this.rigaSelezionata1[0]) { this.rigaSelezionata1 = this.rigaSelezionata1[0]; }
    this.caricaDatiGriglia2(this.rigaSelezionata1);
  }

  lastSelectedOfGridGriglia1(event: any) {
    logConsole('lastSelectedOfGrid', event);
  }

  refreshGridGriglia1(event: any, resetLayout: boolean) {
    logConsole('refreshGrid', event, resetLayout);
    if (resetLayout === true) {
      this.datiGrigliaGriglia1 = undefined;
    }
    this.lastGriglia1 = '';
    this.caricaDatiGriglia1(this.rigaSelezionata);
  }

  cambioPaginaGriglia1(event: any) {
    logConsole('cambioPagina', event);
  }

  ritornoDimensioniColonneGrigliaGriglia1(event: any) {
    logConsole('ritornoDimensioniColonneGriglia', event);
  } 

  caricaDatiGriglia1(rigaSelezionata: any) {
    if (!this.sessioneID || !this.Utils || !Utils.serverPostRest || !this.userName || !rigaSelezionata) {
      return;
    }

    if (!rigaSelezionata[0]) { rigaSelezionata = [rigaSelezionata]; }

    this.caricamentoDatiInCorsoGriglia1 = true;
    this.messaggioWarningGriglia1 = '';

    const params = {
      v_cntx_id: this.sessioneID,
      v_filter: JSON.parse(rigaSelezionata[0].filter)
    };
    
    if (this.lastGriglia1 === JSON.stringify(params)) {
      return;
    }
    this.lastGriglia1 = JSON.stringify(params);

    this.apiService.chiamataPost('ants1_ts_run_byday_full__grid', params, true)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.caricamentoDatiInCorsoGriglia1 = false;
      if (data) {
        /* if (data.err_code !== 0) {
          const rr = data.failure_reason;
          this.messaggioWarningGriglia1 = rr;
        } else { */
          if (this.datiGrigliaGriglia1 && data.DataTable && this.datiGrigliaGriglia1 !== null && this.datiGrigliaGriglia1 !== 'empty grid' &&
            this.vecchiaStrutturaGriglia1 !== JSON.stringify(data.ColumnProperty)) {
            this.datiGrigliaGriglia1.DataTable = JSON.parse(JSON.stringify(data.DataTable));
          } else {
            this.datiGrigliaGriglia1 = undefined;
            this.vecchiaStrutturaGriglia1 = JSON.stringify(data.ColumnProperty);

            const tm1 = setTimeout(() => {
              clearTimeout(tm1);

              this.datiGrigliaGriglia1 = data;
            }, 100);
          }                    

          this.datiGrigliaGriglia2 = 'empty grid';
        // }
      }
    }, error => {
      this.caricamentoDatiInCorsoGriglia1 = false;
      this.messaggioWarningGriglia1 = error;
    });    
  }

  clickSelezioneGriglia2(event: any) {
    logConsole('clickSelezione 2', event);
    this.rigaSelezionata2 = event;
    if (this.rigaSelezionata2[0]) { this.rigaSelezionata2 = this.rigaSelezionata2[0]; }
    this.caricaDatiGriglia2(this.rigaSelezionata2);
  }

  lastSelectedOfGridGriglia2(event: any) {
    logConsole('lastSelectedOfGrid', event);
  }

  refreshGridGriglia2(event: any, resetLayout: boolean) {
    logConsole('refreshGrid', event, resetLayout);
    if (resetLayout === true) {
      this.datiGrigliaGriglia2 = undefined;
    }
    this.lastGriglia2 = '';
    this.caricaDatiGriglia2(this.rigaSelezionata2);
  }

  cambioPaginaGriglia2(event: any) {
    logConsole('cambioPagina', event);
  }

  ritornoDimensioniColonneGrigliaGriglia2(event: any) {
    logConsole('ritornoDimensioniColonneGriglia', event);
  } 

  caricaDatiGriglia2(rigaSelezionata: any) {
    if (!this.sessioneID || !this.Utils || !Utils.serverPostRest || !this.userName || !rigaSelezionata) {
      return;
    }

    this.caricamentoDatiInCorsoGriglia2 = true;
    this.messaggioWarningGriglia2 = '';

    if (!rigaSelezionata[0]) { rigaSelezionata = [rigaSelezionata]; }
    
    const params = {
      v_cntx_id: this.sessioneID,
      v_filter: JSON.parse(rigaSelezionata[0].filter)
    };
    
    if (this.lastGriglia2 === JSON.stringify(params)) {
      return;
    }
    this.lastGriglia2 = JSON.stringify(params);

    this.apiService.chiamataPost('ants1_tc_run_full__grid', params, true)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.caricamentoDatiInCorsoGriglia2 = false;
      if (data) {
        /* if (data.err_code !== 0) {
          const rr = data.failure_reason;
          this.messaggioWarningGriglia2 = rr;
        } else { */
          if (this.datiGrigliaGriglia2 && data.DataTable && this.datiGrigliaGriglia2 !== null && this.datiGrigliaGriglia2 !== 'empty grid' &&
            this.vecchiaStrutturaGriglia2 !== JSON.stringify(data.ColumnProperty)) {
            this.datiGrigliaGriglia2.DataTable = JSON.parse(JSON.stringify(data.DataTable));
          } else {
            this.datiGrigliaGriglia2 = undefined;
            this.vecchiaStrutturaGriglia2 = JSON.stringify(data.ColumnProperty);

            const tm1 = setTimeout(() => {
              clearTimeout(tm1);

              this.datiGrigliaGriglia2 = data;
            }, 100);
          }                    
        // }
      }
    }, error => {
      this.caricamentoDatiInCorsoGriglia2 = false;
      this.messaggioWarningGriglia2 = error;
    });    
  }

  groupClickEmit(event: any) {
    const filtro1 = '[{"TD_FOLDER":"' + event + '"}, {"SCENARIO_TYPE": "Monitoring"}]';
    const filtro = [{filter: filtro1}];
    logConsole('groupClickEmit', filtro);
    this.caricaDatiGriglia(filtro);
  }
}

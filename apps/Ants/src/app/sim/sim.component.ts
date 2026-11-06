import { logConsole } from '../console-log';
import { Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Utils } from "../Utilities.component";
import { ApiService } from "../db/api.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'sim-component',
  templateUrl: './sim.component.html',
  styleUrls: ['./sim.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SimComponent implements OnInit, OnDestroy, OnChanges {
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

  righePerPaginareAutomaticamente = 100;
  destroy$ = new Subject<void>();

  datiModifica: any;
  rigaSelezionata: any;
  editDataVisible = false;

  vecchiaStrutturaTree = '';
  vecchiaStrutturaGriglia = '';

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
      v_cntx_id: this.sessioneID
    };
    this.apiService.chiamataPost('ants1_sim_tree__grid', params, true)
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

                logConsole('Dati arrivati', data);
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
    if (!this.sessioneID || !this.Utils || !Utils.serverPostRest || !this.userName) {
      return;
    }

    this.caricamentoDatiInCorsoGriglia = true;
    this.messaggioWarningGriglia = '';

    const params = {
      v_cntx_id: this.sessioneID,
      v_filter: JSON.parse(rigaSelezionata[0].filter)
    };
    
    if (this.lastGriglia === JSON.stringify(params)) {
      return;
    }
    this.lastGriglia = JSON.stringify(params);

    this.apiService.chiamataPost('ants1_sim_full__grid', params, true)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.caricamentoDatiInCorsoGriglia = false;
      if (data) {
        /* if (data.err_code !== 0) {
          const rr = data.failure_reason;
          this.messaggioWarningGriglia = rr;
        } else { */
          if (this.datiGrigliaGriglia && data.DataTable && this.datiGrigliaGriglia !== null && this.datiGrigliaGriglia !== 'empty grid' &&
            this.vecchiaStrutturaGriglia !== JSON.stringify(data.ColumnProperty)
          ) {
            this.datiGrigliaGriglia.DataTable = JSON.parse(JSON.stringify(data.DataTable));
            logConsole('Dati aggiornati', this.datiGrigliaGriglia);
          } else {
            this.datiGrigliaGriglia = undefined;
            this.vecchiaStrutturaGriglia = JSON.stringify(data.ColumnProperty);

            const tm1 = setTimeout(() => {
              clearTimeout(tm1);

              this.datiGrigliaGriglia = data;
              logConsole('Dati nuovi', this.datiGrigliaGriglia);
           }, 100);
          }                    
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
    this.caricaDatiGriglia(this.rigaSelezionataTree);
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

  passaggioModifiche(e: any) {
    logConsole('Riga modificata', e);
  }
}

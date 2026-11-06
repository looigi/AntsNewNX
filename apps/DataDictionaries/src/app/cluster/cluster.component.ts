import { logConsole } from '../console-log';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import Utils from '../Utilities.component';
import {transform} from 'ol/proj';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: 'cluster.component.html',
  selector: 'app-cluster',
  styleUrls: ['./cluster.component.css']
})

export class ClusterComponent implements OnInit, OnChanges {
  @Input() indirizzoServer;
  @Input() userName;
  @Input() cambiatoSetCluster;
  @Input() additionalLayer;
  @Input() exportKMLAttivo;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() cambiatoSetAntenne;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    // Chiude le sottoscrizioni con takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  public Utils = Utils;

  bboxMappa;
  
  datiGriglia;
  nomeGriglia = 'Cluster';
  selezione;
  selezioneAntenna;
  opacity = undefined;
  antenne = undefined;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  rigaSelezionata = null;
  rigaSelezionataAntenna = null;

  datiGriglia2;
  nomeGriglia2 = 'Cluster 2';
  selezione2;
  effettuaAutoFit2 = false;
  caricamentoDatiInCorso2 = false;
  rigaSelezionata2 = null;
  tastoEdit2 = false;
  tastoElimina2 = false;
  totRighe;
  additionalLayer2;

  offsetAttuale;
  nuovaPagina;
  refreshMappa = false;
  centro = '';
  nomeLayer = '';

  actSetIdScelto;
  actSetNameScelto;
  agnGroupID;
  agnGroup;
  actSetNameFM;
  coordinate;
  stringaAGNCode;
  lastDays2;

  constructor(
    private apiService: ApiService,
    public sessionService: SessionService,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    // this.caricaTabella();
    this.opacity = 50;
    this.antenne = 0;
  }

  nomeLayerAntenna;
  parametriDD;
  
  ngOnChanges(r) {
    if (r.cambiatoSetCluster) {
      if (r.cambiatoSetCluster.currentValue) {
        this.selezione = r.cambiatoSetCluster.currentValue.ROW_ID;
        this.rigaSelezionata = r.cambiatoSetCluster.currentValue;
        this.nomeLayer = r.cambiatoSetCluster.currentValue.CODE_STR;
        // this.Utils.scriveLog('Nuovo cambio Cluster', r.cambiatoSetCluster.currentValue, this.selezione, this.nomeLayer);
        
        // alert('Cambiato set cluster: ' + this.nomeLayer);
        const tm = setTimeout(() => {
          clearTimeout(tm);

          this.caricaTabella2(r.cambiatoSetCluster.currentValue, 'OnChanges');
        }, 1000);
      }
    }

    if (r.cambiatoSetAntenne) {
      if (r.cambiatoSetAntenne.currentValue) {
        this.rigaSelezionataAntenna = r.cambiatoSetAntenne.currentValue;
        this.selezioneAntenna = r.cambiatoSetAntenne.currentValue.ROW_ID;
        this.nomeLayerAntenna = r.cambiatoSetAntenne.currentValue.VALUE_STR;
      } else {
        this.rigaSelezionata = undefined;
        this.selezione = [-1];
        this.nomeLayerAntenna = '';
      }
    }

    if (r.additionalLayer) {
      this.additionalLayer2 = r.additionalLayer.currentValue;
      // this.Utils.scriveLog('Refresh additionalLayer', this.additionalLayer2);
    }
  }

  clickSuMappa(e) {

  }

  dragEnd1(e) {
    // // this.Utils.scriveLog('Drag finestre');
    this.refreshMappa = !this.refreshMappa;
  }

  dragEnd2(e) {
    // // this.Utils.scriveLog('Drag finestre');
    this.refreshMappa = !this.refreshMappa;
  }

  /*
  caricaTabella() {
    const nomeTabella = 'geo_lookup__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_category: 'Cluster'
    };

    this.rigaSelezionata = null;

    this.caricamentoDatiInCorso = true;
    this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response.json())
    .subscribe(data => {
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(data);
        // // this.Utils.scriveLog(data);
        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && data.DataTable) {
          if (data.DataTable.length > 0) {
            this.datiGriglia.DataTable = JSON.parse(JSON.stringify(data.DataTable));
          } else {
            this.datiGriglia = 'empty grid';
          }
        } else {
          this.datiGriglia = null;
          const tm = setTimeout(() => {
            this.datiGriglia = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit = !this.effettuaAutoFit;
            const tm = setTimeout(() => {
              if (this.datiGriglia && this.datiGriglia.DataTable && this.datiGriglia.DataTable.length > 0) {
                this.rigaSelezionata = this.datiGriglia.DataTable[0];
                this.selezione = this.rigaSelezionata.ROW_ID;
                this.nomeLayer = this.rigaSelezionata.CODE_STR;
                this.caricaTabella2Inizio(this.rigaSelezionata);
              }
            }, 1000);
          }, 10);
        }
      } else {
        this.datiGriglia = null;
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      this.datiGriglia = null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  clickSelezione(e) {
    this.rigaSelezionata = e[0];
    // // this.Utils.scriveLog(e);
    this.nomeLayer = e[0].CODE_STR;
    this.caricaTabella2Inizio(e[0]);
  }

  lastSelectedOfGrid(e) {

  }

  refreshGrid1(e) {
    this.caricaTabella();
  }
  

  caricaTabella2Inizio(e) {
    const nomeTabella = 'cluster__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_cluster_name: e.VALUE_STR,
      v_row_offset: -1,
      v_row_limit: null
    };
    // // this.Utils.scriveLog(params);

    this.rigaSelezionata2 = null;
    this.tastoEdit2 = false;
    this.tastoElimina2 = false;
    this.offsetAttuale = 0;

    this.caricamentoDatiInCorso2 = true;
    // this.datiGriglia2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .subscribe(data => {
      // const data = JSON.parse(data2);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        // // this.Utils.scriveLog(data);
        this.totRighe = data.tot_rows;
        this.caricaTabella2(e);
      } else {
        this.datiGriglia2 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      // this.datiGriglia2 = null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }*/

  messaggioWarning2 = '';

  caricaTabella2(e, daDove) {
    // this.Utils.scriveLog(e);
    // logConsole('Caricamento cluster', e, daDove);
    let cluster = '';
    if (e) {
      if (e[0]) {
        cluster = e[0].VALUE_STR;
      } else {
        cluster = e.VALUE_STR;
      }
    }
    const nomeTabella = 'cluster__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_cluster_name: cluster,
      // v_row_offset: this.offsetAttuale,
      // v_row_limit: Utils.limitPerVirtual
    };
    this.caricamentoDatiInCorso2 = true;

    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      this.caricamentoDatiInCorso2 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        data.GridProperty[0].rowCount = this.totRighe;

        if (data && data !== null && data.v_grid_msg && data.v_grid_msg !== '') {
          this.messaggioWarning2 = data.v_grid_msg;
        } else {
          this.messaggioWarning2 = '';
        }

        // this.Utils.scriveLog(data);
        if (this.datiGriglia2 && this.datiGriglia2 !== 'empty grid' && this.datiGriglia2.DataTable
          && this.datiGriglia2.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia2.DataTable = data.DataTable;
        } else {
          // this.datiGriglia2 = 'empty grid'; // null;
          this.datiGriglia2 = JSON.parse(JSON.stringify(data));
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.effettuaAutoFit2 = !this.effettuaAutoFit2;
          }, 10);
        }
      } else {
        this.datiGriglia2 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      // this.datiGriglia2 = null;
      // this.Utils.scriveLog('Read:' + error);
    });
  }

  clickSelezione2(e) {
    // this.Utils.scriveLog(e);
    if (e && e[0]) {
      if (e[0].GEO_CENTER !== null) {
        const c = e[0].GEO_CENTER;
        this.centro = c; // transform(cc, 'EPSG:4326', 'EPSG:3857'); // e[0].GEO_CENTER;
        // alert('Click su cluster: ' + c);
        this.tastoEdit2 = true;
        this.tastoElimina2 = true;
        this.rigaSelezionata2 = e;
      }
    }
  }

  cambioPagina(e) {
    this.nuovaPagina = +e.skip;
    const tm = setTimeout(() => {
      clearTimeout(tm);
      if (e.skip === this.nuovaPagina) {
        // // this.Utils.scriveLog(e.skip, e.take);
        this.offsetAttuale = e.skip;
        // this.pulisceSelezione = !this.pulisceSelezione;
        // this.paginaGriglia = this.offsetAttuale / Utils.limitPerVirtual;
        // this.caricaTabella2(this.rigaSelezionata, 'CambioPagina');
      }
    }, 500);
  }

  lastSelectedOfGrid2(e) {

  }

  refreshGrid2(e, r) {
    if (r === true) {
      this.datiGriglia2 = undefined;
    }
    this.caricaTabella2(this.rigaSelezionata, 'RefreshGrid');
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

  cambiaOpacity(e) {
    this.Utils.scriveLog('Cambiata opacità', e);
    this.opacity = e;
  }

  cambioBBOX(e) {
    this.Utils.scriveLog('Cambio Bbox:', e);
    // // logConsole('bbox arrivata', e);
    this.bboxMappa = e;
  }

  ritornoDimensioniColonneGriglia2(e) {
    Utils.scriveDimensioniColonne('Griglia2', e);
  }
}

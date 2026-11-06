import { logConsole } from '../../../console-log';
import { Utils } from './../../Utilities.component';
import { OnInit, AfterViewInit, OnChanges, Component, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from '../../../../db/api.service';
import { DatePipe } from '@angular/common';
// import { Utils } from '../../Utilities.component';

import { environment } from '../../../../environments/environment.prod';
import { SessionService } from '../../../../db/session.service';
import ExternalUtilities from '../../ExternalUtilities.component';

@Component({
  templateUrl: 'sla-manager.component.html',
  selector: 'sla-manager-component',
  styleUrls: ['./sla-manager.component.css']
})

export class SLAManagerComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() indirizzoServer;
  @Input() visibile: boolean;
  @Input() userName: string;
  @Input() ConnessioneStabilita: string;
  @Input() slaGroup;
  @Input() slaData;
  @Input() valoreDefault;
  @Input() misure;
  @Input() Utils;
  @Input() righePerPaginareAutomaticamente = -1;

  @Output() visibileEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() confirmEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() editEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() refreshSLAEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  effettuaAutoFitThr = false;
  rSlaB = false;
  refreshGrigliaSla;
  refreshGrigliaThr;
  mascheraVisibile;
  SLASelected;
  SLASelected2;
  SLAThrSelected;
  SLAThrSelected2;
  slaGroup2;
  slaData2;
  listaDati;
  listaDatiThr;
  editVisibile;
  editSlaVisibile;
  editSlaThrVisibile;
  confirmKey;
  copyKey;
  nuovoSla;
  rigaSelezionataSLA;
  oldID = '';

  arrayDelete;
  idxDelete;
  prendeNomeSLA = false;
  slaSelezionato;
  newSLAName;

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
    private datePipe: DatePipe,
    // private Utilities: Utils
  ) {
  }

  ngOnChanges(c) {
    // logConsole('Sla manager onChange', c);

    if (c.ConnessioneStabilita && c.ConnessioneStabilita !== undefined) {
      if (c.ConnessioneStabilita.currentValue === 'OK') {
        // this.LeggeSLA();
      }
    }

    if (c.valoreDefault) {
      if (c.valoreDefault.currentValue) {
        // logConsole('Valore default:', c.valoreDefault.currentValue);
        if (this.slaData2 !== undefined && this.slaData2.DataTable !== undefined) {
          const cc = ExternalUtilities.converteStringaInJSON(c.valoreDefault.currentValue);
          let ccc = null;
          this.slaData2.DataTable.forEach(element => {
            if (ccc === null) {
              // logConsole('Ricerca:', element.NAME, cc.NAME);
              if (element.NAME === cc.NAME) {
                // logConsole('Trovato:', ccc);
                ccc = element;
                this.rigaSelezionataSLA = ccc.ROW_ID;
                this.SLASelected = ccc;
                this.LeggeSLAThr();
              }
            }
          });
        }
      }
    }

    if (c.slaData) {
      if (c.slaData.currentValue !== undefined && c.slaData.currentValue !== null) {
        // logConsole('Sla data onChange', c);
        const dati = new Array();
        if (c.slaData.currentValue.DataTable !== undefined) {
          c.slaData.currentValue.DataTable.forEach(element => {
            if (element.NAME !== environment.stringaGlobalSettingSLA) {
              dati.push(element);
            }
          });
          this.slaData2 = c.slaData.currentValue;
          this.slaData2.DataTable = dati;
          this.listaDati = this.slaData2;
        }
      }
    }

    if (c.slaGroup) {
      // logConsole('SLA Group:', c.slaGroup.currentValue);
      this.slaGroup2 = c.slaGroup.currentValue;
    }

    if (c.visibile) {
      this.mascheraVisibile = c.visibile.currentValue;
      if (this.mascheraVisibile) {
        // logConsole('Leggo activity');
      }
    }

    if (c.valoreDefault) {
      // logConsole('valore default cambiato:', c.valoreDefault.currentValue);
      if (this.slaData2) {
        // logConsole('Dati', this.slaData2);
        let id = false;
        this.slaData2.DataTable.forEach(element => {
          if (!id) {
            if (element.NAME === c.valoreDefault.currentValue) {
              // this.SLASelected = element;
              // logConsole(this.SLASelected);
              this.rigaSelezionataSLA = element.ROW_ID;
              id = true;
            }
          }
        });
        // logConsole('ID Rilevato:', id);
      }
    }

    /* if (c.ConnessioneStabilita && c.ConnessioneStabilita !== undefined) {
      if (c.ConnessioneStabilita.currentValue === 'OK') {
        this.LeggeSLA();
      }
    } */
  }

  ngOnInit() {
    /* this.mascheraVisibile = false;
    this.listaDati = null;
    this.listaDatiThr = null;
    this.editVisibile = false;
    this.editSlaVisibile = false;
    this.editSlaThrVisibile = false;
    this.confirmKey = false;
    this.nuovoSla = false;

    this.listaDati = 'empty grid';
    this.listaDatiThr = 'empty grid'; */

    this.mascheraVisibile = false;
    // this.LeggeSLA();
  }

  ngAfterViewInit() {
  }

  /* LeggeSLA() {
    if (this.ConnessioneStabilita === '') {
      return;
    }

    this.apiService.getViewData('VIEW_GEO_SLA', '')
    // .map(response => response)
    .subscribe(data => {
      // logConsole('SLA Tree return:', data.RESULT[0].message.toUpperCase());
      if (data === undefined) { data = null; }
      if (data.RESULT && data.RESULT[0].message.toUpperCase() === 'OK') {
        // logConsole('SLA Tree', data.DataTable);
        this.listaDati = data;
      } else {
        this.listaDati = 'empty grid';
      }
    }, error => {
      ExternalUtilities.visualizzaAlert(error);
    });
  } */

  LeggeSLAThr() {
    if (this.ConnessioneStabilita === '') {
      return;
    }

    const id = this.SLASelected.ID;

    if (id === this.oldID) {
      return;
    }
    this.oldID = id;
    // logConsole('Ricerca thr per id:', this.SLASelected, id);
    // this.apiService.getViewData('VIEW_GEO_SLA_THR', 'GEO_SLA_ID = ' + id)
    // // .map(response => response)
    // .subscribe(data => {

    const params = '{' +
      '"cntx_id": "' + ExternalUtilities.sessione + '",' +
      '"v_filter_geo_sla_id": ' + id + '' +
    '}';
    // logConsole(params);
    this.apiService.chiamataPost(this.Utils, 'geo_sla_thr__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(this.Utils, data2);

        const data = data2;
        // logConsole('SLA THR Tree return:', data, data.DataTable.length);
        // logConsole('Lista', this.listaDatiThr);

        if (data.DataTable.length > 0) {
          if (this.listaDatiThr) {
            // logConsole('Aggiorno SLA THR Tree', data.DataTable);
            this.listaDatiThr.DataTable = data.DataTable;
          } else {
            this.listaDatiThr = data;
            this.effettuaAutoFitThr = !this.effettuaAutoFitThr;
          }
        } else {
          this.listaDatiThr = 'empty grid';
        }
      } else {
        this.listaDatiThr = 'empty grid';
      }
    }, error => {
      ExternalUtilities.visualizzaAlert(error);
    });
  }

  mostraNascondeMenu() {
    this.mascheraVisibile = false;
    this.visibileEmit.emit(false);
  }

  cellClickGridSLA(e) {
    if (e) {
      // const ee = Utils.converteStringaInJSON(e);
      // logConsole('Click:', ee);

      // logConsole('Cell click ritorno totale: ', e);
      let riga;

      if (e.dataItem && e.dataItem[e.length - 1]) {
        riga = e.dataItem[e.length - 1];
      } else {
        if (e.dataItem) {
          riga = e.dataItem;
        } else {
          if (e[0].ID !== undefined) {
            riga = e[0];
          }
        }
      }
      // logConsole('Click su riga SLA:', riga);

      if (riga) {
        this.SLASelected = riga;
        this.rigaSelezionataSLA = riga.ROW_ID;
        this.confirmKey = true;
        this.copyKey = true;
        // this.listaDatiThr = undefined;

        this.LeggeSLAThr();
      }
    }
  }

  copyKeyPremuto(e) {
    this.prendeNomeSLA = true;
    this.slaSelezionato = e;
    this.newSLAName = '';
  }

  copyKeyPremutoFinale() {
    if (this.newSLAName === '') {
      ExternalUtilities.visualizzaAlert('Empty SLA Name');
      return;
    }

    const eee = this.slaSelezionato;
    let e;
    this.slaData2.DataTable.forEach(element => {
      if (!e && +element.ROW_ID === +eee) {
        e = element;
      }
    });
    // logConsole('SLA', this.slaData2, eee, e);
    // return;

    // const nuovoNome = in('New name of SLA');
    // const ee = ExternalUtilities.converteStringaInJSON(e);

    if (this.newSLAName === e.NAME) {
      ExternalUtilities.visualizzaAlert('Same SLA name');
      return;
    }

    let desc = e.DESCRIPTION;
    if (desc) {
      desc = desc.replace(/(\r\n|\n|\r)/gm, '');
    }
    // logConsole(desc);
    let desc2 = '';
    if (desc && desc !== undefined && desc !== null && desc !== 'undefined') {
      desc2 = desc;
    }
    

    let jsonString = '{';
    jsonString += '"v_cntx": "' + ExternalUtilities.sessione + '",';
    jsonString += '"v_id_origin": "' + e.ID + '",';
    jsonString += '"v_name": "' + this.newSLAName + '",';
    jsonString += '"v_folder": "' + e.FOLDER + '",';
    jsonString += '"v_description": "' + desc2 + '" ';
    jsonString += '}';

    // logConsole(JSON.parse(jsonString));

    this.apiService.chiamataPost(this.Utils, 'geo_sla__ins', JSON.parse(jsonString))
    // .map(response => response)
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      // logConsole('Copy sla return:', data);
      if (data && data[0] && data[0].v_err_code === 0) {
        this.rSlaB = !this.rSlaB;
        this.refreshSLAEmit.emit(this.rSlaB);
        this.prendeNomeSLA = false;
      } else {
        if (data && data[0] && data[0].v_failure_reason) {
          ExternalUtilities.visualizzaAlert(data[0].v_failure_reason);
        } else {
          ExternalUtilities.visualizzaAlert('Null Return');
        }
      }
    }, error => {
      ExternalUtilities.visualizzaAlert(error);
    });
  }

  lastSelectedOfGridSLAThr(e) {
    if (e) {
      const ee = JSON.parse(e);
      // this.lastSelectedOfGridDashboard = null;
      this.SLAThrSelected = null;

      if (this.listaDatiThr && this.listaDatiThr != null && this.listaDatiThr.DataTable) {
        this.listaDatiThr.DataTable.forEach(element => {
          if (this.SLAThrSelected === null) {
            if (+element.ID === +ee.ID) {
              this.SLAThrSelected = element;
            }
          }
        });
      }
    }
  }

  cellClickGridSLAThr(e) {
    if (e) {
      // // logConsole('Click:', ee.dataItem);

      // logConsole('Cell click ritorno totale: ', e);
      let riga;

      if (e.dataItem && e.dataItem[e.length - 1]) {
        riga = e.dataItem[e.length - 1];
      } else {
        if (e.dataItem) {
          riga = e.dataItem;
        } else {
          if (e[0].ID !== undefined) {
            riga = e[0];
          }
        }
      }

      if (riga) {
        this.SLAThrSelected = riga;
        this.rigaSelezionataSLA = riga.ROW_ID;
        // logConsole('Click su riga SLA Thr:', riga);
      }
    }
  }

  checkERiempieLastSelectedSLA(ee) {
    this.SLASelected = null;

    // logConsole('Last', this.listaDati);
    if (this.listaDati && this.listaDati != null && this.listaDati !== 'empty grid') {
      this.listaDati.DataTable.forEach(element => {
        if (this.SLASelected === null) {
          if (+element.ID === +ee.ID) {
            this.SLASelected = element;
            // logConsole('SLASelected impostato:', element);
          }
        }
      });
    }
  }

  lastSelectedOfGridSLA(e) {
    if (e) {
      const ee = JSON.parse(e);
      // logConsole('Last selected SLA:', ee);

      // this.lastSelectedOfGridDashboard = null;
      this.checkERiempieLastSelectedSLA(ee);

      if (this.SLASelected !== null) {
        this.LeggeSLAThr();
      }
    }
  }

  premutoTastoConfirm(e) {
    // logConsole(this.SLASelected);
    this.confirmEmit.emit(this.SLASelected);
    this.mostraNascondeMenu();
  }

  tastoNewPremuto(e) {
    this.nuovoSla = true;
    this.SLASelected2 = 'empty';
    this.editSlaThrVisibile = true;
  }

  tastoEditPremuto(e) {
    this.editSlaVisibile = true;
    this.SLASelected2 = this.SLASelected;
    // logConsole('Edit:', this.SLASelected);
  }

  tastoEditPremutoThr(e) {
    this.editSlaThrVisibile = true;
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.SLAThrSelected2 = JSON.parse(JSON.stringify(this.SLAThrSelected));
      // logConsole('Edit:', this.SLAThrSelected2);
    }, 1000);
  }

  visibileDaMascheraDashboardEdit(e) {
    this.editVisibile = false;
    this.refreshSLAEmit.emit(true);
  }

  visibileDaMascheraSlaEdit(e) {
    this.editSlaVisibile = false;
  }

  visibileDaMascheraSlaThrEdit(e) {
    this.editSlaThrVisibile = false;
  }

  refreshSla(e, r) {
    if (e) {
      this.refreshSLAEmit.emit(true);
    }
  }

  refreshSlaThr(e, r) {
    if (e) {
      // logConsole('Refresh SLA Thr:', this.rigaSelezionataSLA);

      /* this.SLASelected = null;

      // logConsole('Lista dati: ', this.listaDatiThr);
      if (this.listaDatiThr && this.listaDatiThr != null && this.listaDatiThr !== 'empty grid') {
        this.listaDatiThr.DataTable.forEach(element => {
          if (this.SLASelected === null) {
            if (+element.ROW_ID === +this.rigaSelezionataSLA) {
              this.SLASelected = element;
              // logConsole('SLASelected impostato in refreshSlaThr:', element);
            }
          }
        });
      } */

      // if (this.SLASelected !== null) {
        // logConsole(this.SLASelected);
        this.oldID = '-1';
        this.LeggeSLAThr();
      // }
    }
  }

  eliminazioneFisicaSLA() {
    const e = this.arrayDelete[this.idxDelete];

    let jsonString = '{';
    jsonString += '"v_cntx": "' + ExternalUtilities.sessione + '",';
    jsonString += '"v_id": "' + e.ID + '" ';
    jsonString += '}';

    // logConsole(JSON.parse(jsonString));

    this.apiService.chiamataPost(this.Utils, 'geo_sla__del', JSON.parse(jsonString))
    // .map(response => response)
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      // logConsole('Delete sla return:', data);
      if (+data[0].v_err_code === 0) {
          this.idxDelete++;
          if (this.idxDelete < this.arrayDelete.length) {
            setTimeout(_ => this.eliminazioneFisicaSLA(), 10);
          } else {
            this.rSlaB = !this.rSlaB;
            this.refreshSLAEmit.emit(this.rSlaB);
          }
        } else {
          ExternalUtilities.visualizzaAlert(data[0].v_failure_reason);
        }
      }, error => {
        ExternalUtilities.visualizzaAlert(error);
      });
  }

  eliminaSLA(e) {
    if (e) {
      this.arrayDelete = new Array();
      e.forEach(ee => {
        this.arrayDelete.push(ee);
      });
      // logConsole(this.arrayDelete);
      if (this.arrayDelete.length > 0) {
        this.idxDelete = 0;
        this.eliminazioneFisicaSLA();
      }
    }
  }

  checkEdge(event) {
    ExternalUtilities.edge = event;
    // logConsole('edge:', event);
  }

  ritornoDimensioniColonneSla(e) {
    ExternalUtilities.scriveDimensioniColonne('Sla', e);
  }  

  ritornoDimensioniColonneSlaThr(e) {
    ExternalUtilities.scriveDimensioniColonne('SlaThr', e);
  }  
}

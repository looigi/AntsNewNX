import { logConsole } from '../../../console-log';
import { OnInit, AfterViewInit, OnChanges, Component, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from '../../../../db/api.service';
import { DatePipe } from '@angular/common';
// import Utils from '../../Utilities.component';

import { SessionService } from '../../../../db/session.service';
import ExternalUtilities from '../../ExternalUtilities.component';
import { Utils } from '../../Utilities.component';

@Component({
  templateUrl: 'dashboard-list.component.html',
  selector: 'dashboard-list-component',
  styleUrls: ['./dashboard-list.component.css']
})

export class DashboardListComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() indirizzoServer;
  // @Input() visibile: boolean;
  @Input() userName: string;
  @Input() ConnessioneStabilita: string;
  @Input() dashboardGroup;
  @Input() dashboardSelezionata;
  @Input() accordionDebug;
  @Input() listaDati;
  @Input() Utils;
  @Input() righePerPaginareAutomaticamente = -1;

  @Output() visibileEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() confirmEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() editEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() refreshEmit: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  refreshGrigliaMettere;
  // mascheraVisibile = false;
  dashBoardSelected;
  dashBoardSelected2;
  editVisibile = false;
  confirmKey = false;
  nuovo;
  dashSelezionata2;
  tastoEditVisibile;
  tastoInfoVisibile;
  tastoDeleteVisibile;
  listaDati2;
  effettuaAutoFit = false;

  arrayDelete;
  idxDelete;

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private Utilities: Utils
  ) {
  }

  ngOnChanges(c) {
    // logConsole('Dashboard list onChange', c);

    if (c.listaDati) {
      // logConsole(c.listaDati.currentValue);
      if (c.listaDati.currentValue) {
        this.listaDati2 = c.listaDati.currentValue;

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.effettuaAutoFit = !this.effettuaAutoFit;
        }, 1000);
      }
    }

    if (c.dashboardSelezionata) {
      const cc = c.dashboardSelezionata.currentValue;
      let ccc = -1;
      if (this.listaDati && typeof(this.listaDati) !== 'string') {
        // logConsole('Cerco dashboard:', this.listaDati, cc);
        this.listaDati.DataTable.forEach(element => {
          if (ccc === -1) {
            if (+element.ID === +cc) {
              ccc = element.ROW_ID;
            }
          }
        });

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.dashSelezionata2 = [ccc];
          // logConsole('Trovata dashboard', this.dashSelezionata2);
        }, 2000);
      }
    }

    if (c.dashboardGroup) {
      // logConsole('Cambiata dashboardGroup');
      this.dashboardGroup = c.dashboardGroup.currentValue;
    }

    /* if (c.visibile) {
      this.mascheraVisibile = c.visibile.currentValue;
      if (this.mascheraVisibile) {
        // logConsole('Leggo activity');
      }
      return;
    } */

    if (c.ConnessioneStabilita && c.ConnessioneStabilita !== undefined) {
      if (c.ConnessioneStabilita.currentValue === 'OK') {
        // this.LeggeDashboard();
      }
    }
  }

  ngOnInit() {
    // this.mascheraVisibile = false;
    this.listaDati = 'empty grid';

    this.tastoEditVisibile = false;
    this.tastoInfoVisibile = false;
    this.tastoDeleteVisibile = false;
  }

  ngAfterViewInit() {

  }

  /* LeggeDashboard() {
    // this.datiDiProvaTree = this.CreateTree();
    // logConsole(this.datiDiProvaTree);

    // VP_GEO_DASHBOARD_TREE - VIEW_TD_TREE
    this.apiService.getViewData('VIEW_GEO_DASHBOARD', '')
    // .map(response => response)
    .subscribe(data => {
      // logConsole('Tree return:', data.RESULT[0].message.toUpperCase());
      if (data === undefined) { data = null; }
      if (data.RESULT && data.RESULT[0].message.toUpperCase() === 'OK') {
        // logConsole('HOME Tree', data.DataTable);
        this.listaDati = data;
      } else {
        this.listaDati = null;
      }
    }, error => {
      ExternalUtilities.visualizzaAlert(error);
    });
  } */

  refreshDashboard(e, r) {
    if (e) {
      // logConsole('Refresh dashboard in LIST', e);
      // this.LeggeDashboard();
      this.refreshEmit.emit(true);
    }
  }

  mostraNascondeMenu() {
    // this.mascheraVisibile = false;
    this.visibileEmit.emit(false);
  }

  cellClickGridDashboard(ee) {
    if (ee) {
      const e = ee[ee.length - 1];
      // logConsole('Click:', e.dataItem);
      this.dashBoardSelected = e;

      if (this.accordionDebug === true) {
        this.tastoEditVisibile = true;
        this.tastoInfoVisibile = true;
        this.tastoDeleteVisibile = true;
      }

      this.confirmKey = true;
    }
  }

  lastSelectedOfGridDashboard(e) {
    if (e) {
      const ee = JSON.parse(e);
      // this.lastSelectedOfGridDashboard = null;
      this.dashBoardSelected = null;

      if (this.listaDati && this.listaDati != null) {
        this.listaDati.DataTable.forEach(element => {
          if (this.dashBoardSelected === null) {
            if (+element.ID === +ee.ID) {
              this.dashBoardSelected = element;
            }
          }
        });
      }
    }
  }

  premutoTastoConfirm(e) {
    // logConsole('Confirm:', this.dashBoardSelected);
    this.confirmEmit.emit(this.dashBoardSelected);
    this.mostraNascondeMenu();
  }

  premutoTastoNew(e) {
    this.nuovo = true;
    this.dashBoardSelected2 = 'empty';
    this.editVisibile = true;
  }

  tastoEditPremuto(e) {
    this.nuovo = false;
    this.dashBoardSelected2 = this.dashBoardSelected;
    this.editVisibile = true;
    // logConsole('Edit:', this.dashBoardSelected);
  }

  visibileDaMascheraDashboardEdit(e) {
    this.editVisibile = false;
  }

  eliminazioneFisicaDashboard() {
    const ee = this.arrayDelete[this.idxDelete];
    // logConsole('Delete:', ee);

    let jsonString = '{';
    jsonString += '"v_cntx": "' + ExternalUtilities.sessione + '",';
    jsonString += '"v_id": ' + ee.ID + '';
    jsonString += '}';

    this.apiService.chiamataPost(this.Utilities, 'geo_dashboard__del', JSON.parse(jsonString))
    // .map(response => response)
    .subscribe(data => {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      if (+data[0].v_err_code === 0) {
        this.idxDelete++;
        if (this.idxDelete < this.arrayDelete.length) {
          setTimeout(_ => this.eliminazioneFisicaDashboard(), 10);
        } else {
          // this.LeggeDashboard();
          this.refreshEmit.emit(true);
        }
      } else {
        ExternalUtilities.visualizzaAlert(data[0].v_err_code + ': ' + data[0].v_failure_reason)
      }
    }, error => {
      ExternalUtilities.visualizzaAlert(error);
    });
  }

  premutoTastoDelete(e) {
    if (e) {
      this.arrayDelete = new Array();
      e.forEach(ee => {
        this.arrayDelete.push(ee);
      });
      if (this.arrayDelete.length > 0) {
        this.idxDelete = 0;
        this.eliminazioneFisicaDashboard();
      }
    }
  }

  checkEdge(event) {
    ExternalUtilities.edge = event;
    // logConsole('edge:', event);
  }

  ritornoDimensioniColonneDash(e) {
    ExternalUtilities.scriveDimensioniColonne('Dash', e);
  }  
}

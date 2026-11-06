import { logConsole } from '../../../console-log';
import { OnInit, AfterViewInit, OnChanges, Component, Output, EventEmitter, Input } from '@angular/core';
import {ApiService} from '../../../../db/api.service';
import { DatePipe } from '@angular/common';
// import Utils from '../../Utilities.component';

import { SessionService } from '../../../../db/session.service';
import ExternalUtilities from '../../ExternalUtilities.component';
import { Utils } from '../../Utilities.component';
// import { isNumeric } from 'rxjs/internal-compatibility';

@Component({
  templateUrl: 'dashboard-edit.component.html',
  selector: 'dashboard-edit-component',
  styleUrls: ['./dashboard-edit.component.css']
})

export class DashboardEditComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() visibile: boolean;
  @Input() userName: string;
  @Input() dati;
  @Input() dashboardGroup;
  @Input() nuovo: boolean;

  @Output() visibileEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshData: EventEmitter<any> = new EventEmitter<any>();

  mascheraVisibile = false;
  selFolder = '';
  dashboardGroup2;
  edge;
  isPublic = false;
  showTimeCursor = true;

  row_id;
  id;
  original_name;
  name;
  description;
  operator_name;
  group_name;
  folder;
  geo_act_set_id_1;
  geo_act_set_id_2;
  insert_ts;
  pulisceFiltro;
  config_json;
  Utils2;
  nuovoVecchio = '';

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
    private datePipe: DatePipe,
    public Utilities: Utils
  ) {
  }

  ngOnChanges(c) {
    // logConsole(c);

    if (c.visibile) {
      this.mascheraVisibile = c.visibile.currentValue;
      if (this.mascheraVisibile) {
        // logConsole('Leggo activity');
        this.pulisceFiltro = !this.pulisceFiltro;
      }
      // return;
    }

    if (c.dati && c.dati.currentValue) {
      if (c.dati.currentValue !== 'empty') {
        // logConsole('Dashboard selezionata EDIT', c.dati.currentValue);
        this.original_name = c.dati.currentValue.NAME;
        this.row_id = c.dati.currentValue.ROW_ID;
        this.id = c.dati.currentValue.ID;
        this.name = c.dati.currentValue.NAME;
        this.description = c.dati.currentValue.DESCRIPTION;
        if (this.description === null) { this.description = ''; };
        this.operator_name = c.dati.currentValue.OPERATOR_NAME;
        this.group_name = c.dati.currentValue.GROUP_NAME;
        this.folder = c.dati.currentValue.FOLDER;
        this.geo_act_set_id_1 = c.dati.currentValue.GEO_ACT_SET_ID_1;
        this.geo_act_set_id_2 = c.dati.currentValue.GEO_ACT_SET_ID_2;
        this.insert_ts = c.dati.currentValue.INSERT_TIMESTAMP;
        this.isPublic = c.dati.currentValue.IS_PUBLIC === 'Y';
        this.nuovoVecchio = 'VECCHIO';

        this.getConfigJSON();
      } else {
        // logConsole('Dashboard nuova');
        this.name = '';
        this.description = '';
        this.operator_name = '';
        this.group_name = '';
        this.folder = '';
        this.geo_act_set_id_1 = '';
        this.geo_act_set_id_2 = '';
        this.config_json = '';
        this.isPublic = false;
        this.nuovoVecchio = 'NUOVO';
      }
    }

    if (c.dashboardGroup) {
      // logConsole('Dati folder dashboard', c.dashboardGroup.currentValue);
      this.dashboardGroup2 = c.dashboardGroup.currentValue;
    }

    if (c.Utils) {
      if (c.Utils.currentValue) {
        // logConsole(c.Utils.currentValue);
        this.Utils2 = c.Utils.currentValue;
      }
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // ExternalUtilities.visualizzaAlert('Entrato');
  }

  isNumeric(value: unknown): boolean {
  	return typeof value === 'number' && !Number.isNaN(value);
  }

  getConfigJSON() {
    const params = '{' +
    '"cntx_id": "' + ExternalUtilities.sessione + '"' +
  '}';
  this.apiService.chiamataPost(this.Utilities, 'geo_dashboard__sel?id=eq.' + this.id, params)
  // .map(response => response)
  .subscribe(data => {
  // logConsole('Lettura dati dashboard:', data.RESULT[0].message.toUpperCase());
      if (data === undefined) { data = null; }
      // if (data.RESULT && data.RESULT[0].message.toUpperCase() === 'OK' && data.OBJECT[0].object.GEO_DASHBOARD.length > 0) {
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      if (data[0]) {
        // logConsole('Lettura config_json:', data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON);
        // if (data.OBJECT[0].object.GEO_DASHBOARD[0] && data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON
        //   && data.OBJECT[0].object.GEO_DASHBOARD[0].CONFIG_JSON !== null) {
        /* if (data[0].config_json && data[0].config_json !== null) {
          let imp = data[0].config_json;

          logConsole('imp', imp);

          imp = ExternalUtilities.sistemaStringaLettaDaDB(imp);
          const imp2 = JSON.parse(JSON.parse(JSON.stringify(imp)));
          if (typeof(imp2.maskSize) === 'undefined') {
            logConsole('Config JSON non valido:', imp2, typeof(imp2));
          } else {
            this.config_json = imp2;
            // logConsole('Config JSON letto: ', this.config_json);
          }
        } */

        let imp = data[0].config_json;
        // logConsole(imp);

        if (typeof(imp) !== 'object') {
          let imp2 = imp.split(',');
          // logConsole(imp2[0], imp2[3], imp2[4], imp2[5], isNumeric(imp2[3]), isNumeric(imp2[4]), isNumeric(imp2[5]));

          if (this.isNumeric(imp2[3]) === true && this.isNumeric(imp2[4]) === true && this.isNumeric(imp2[5]) === true) {
            /* imp = ExternalUtilities.sistemaStringaLettaDaDB(imp);
            imp2 = imp.split(',');
            if (isNumeric(imp2[3]) === true && isNumeric(imp2[4]) === true && isNumeric(imp2[5]) === true) {
              imp = ExternalUtilities.sistemaStringaLettaDaDB(imp);
              logConsole('Convertito config_json');
            } */
            ExternalUtilities.visualizzaAlert('Dashboard not valid');
            imp = null;
          }
        } else {
          imp = imp[0];
        }
        this.config_json = imp;

        // logConsole(this.config_json);

      } else {
        ExternalUtilities.visualizzaAlert(data.RESULT[0].message);
        this.config_json = null;
      }
    }, error => {
        console.warn(error);
    });
  }

  cambioValoreName() {
    // logConsole('Cambio valore name: ', this.name);
  }

  mostraNascondeMenu() {
    this.refreshData.emit(null);
    this.visibileEmit.emit(false);
    this.mascheraVisibile = false;
  }

  selectFolder(e) {
    if (typeof(e) !== 'undefined') {
      const ee = ExternalUtilities.converteStringaInJSON(e);
      // logConsole('Folder selezionato', ee);
      if (ee.VALUE_STR) {
        this.folder = ee.VALUE_STR;
      } else {
        this.folder = ee;
      }
    }
  }

  salvaDatiPR() {
    if (this.config_json === null || !this.config_json) {
      // ExternalUtilities.visualizzaAlert('Dashboard not valid');
      // return;
      const t = setInterval(() => {
        if (this.config_json !== null && this.config_json) {
          clearInterval(t);

          this.salvaDatiPR2();
        }
      }, 500);
    } else {
      this.salvaDatiPR2();
    }
  }

  salvaDatiPR2() {
    let desc = this.description;
    if (desc === null) { desc = ''; };
    desc = desc.replace(/(\r\n|\n|\r)/gm, '');

    const nuoviDati = {
      id: this.id,
      name: this.name,
      folder: this.folder,
      operator_name: this.operator_name,
      group_name: this.group_name,
      description: desc,
      showTimeCursor: this.showTimeCursor
    };
    this.config_json['showTimeCursor'] = this.showTimeCursor;
    logConsole('Config.json salvataggio', this.config_json);

    if (this.nuovo) {
      let jsonString = '{';
      jsonString += '"v_cntx": "' + ExternalUtilities.sessione + '",';
      jsonString += '"v_name": "' + this.name + '",';
      jsonString += '"v_folder": "' + this.folder + '",';
      jsonString += '"v_description": "' + desc + '",';
      jsonString += '"v_config_json": [' + JSON.stringify(this.config_json) + '] '; //ExternalUtilities.sistemaJSONPerSalvarloSuDB(this.config_json) + '" ';
      jsonString += '}';

      logConsole('Dashboard New', jsonString);
      // return;

      this.apiService.chiamataPost(this.Utilities, 'geo_dashboard__ins', JSON.parse(jsonString))
      // .map(response => response)
      .subscribe(data => {
        // logConsole('Create new dashboard return:', data);

        ExternalUtilities.checkRitornoChiamata(Utils, data);

        if (+data[0].v_err_code === 0) {
          // logConsole('Create dashboard return:', data);
          this.refreshData.emit(nuoviDati);
          this.mostraNascondeMenu();
        } else {
          ExternalUtilities.visualizzaAlert(data[0].v_err_code + ': ' + data[0].v_failure_reason)
        }
      }, error => {
        ExternalUtilities.visualizzaAlert(error);
      });
    } else {
      let jsonString = '{';
      jsonString += '"v_cntx": "' + ExternalUtilities.sessione + '",';
      jsonString += '"v_id": "' + this.id + '",';
      jsonString += '"v_name": "' + this.name + '",';
      jsonString += '"v_folder": "' + this.folder + '",';
      jsonString += '"v_description": "' + desc + '",';
      jsonString += '"v_is_public": ' + this.isPublic + ',';
      jsonString += '"v_config_json": [' + JSON.stringify(this.config_json) + '] '; //ExternalUtilities.sistemaJSONPerSalvarloSuDB(this.config_json) + '" ';
      jsonString += '}';

      logConsole('Dashboard Update', jsonString, this.config_json);
      // return;

      this.apiService.chiamataPost(this.Utilities, 'geo_dashboard__upd', JSON.parse(jsonString))
      // .map(response => response)
      .subscribe(data => {
        // logConsole('Create new dashboard return:', data);

        ExternalUtilities.checkRitornoChiamata(Utils, data);

        if (+data[0].v_err_code === 0) {
          // logConsole('Update dashboard return:', data);
          this.refreshData.emit(nuoviDati);
          this.mostraNascondeMenu();
        } else {
          ExternalUtilities.visualizzaAlert(data[0].v_err_code + ': ' + data[0].v_failure_reason)
        }
      }, error => {
        ExternalUtilities.visualizzaAlert(error);
      });
    }
  }

  checkEdge(event) {
    ExternalUtilities.edge = event;
    // logConsole('edge:', event);
  }

  checkIsPublic(e) {
    this.isPublic = e.target.checked;
  }

  checkShowTimeCursor(e) {
    this.showTimeCursor = e.target.checked;
  }
}

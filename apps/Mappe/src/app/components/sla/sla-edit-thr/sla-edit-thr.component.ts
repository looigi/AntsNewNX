import { logConsole } from '../../../console-log';
import { Utils } from './../../Utilities.component';
import { OnInit, AfterViewInit, OnChanges, Component, Output, EventEmitter, Input } from '@angular/core';
import {ApiService} from '../../../../db/api.service';
import { DatePipe } from '@angular/common';
// import Utils from '../../Utilities.component';

import { SessionService } from '../../../../db/session.service';
import ExternalUtilities from '../../ExternalUtilities.component';

@Component({
  templateUrl: 'sla-edit-thr.component.html',
  selector: 'sla-edit-thr-component',
  styleUrls: ['./sla-edit-thr.component.css']
})

export class SlaThrEditComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() visibile: boolean;
  @Input() userName: string;
  @Input() misure;
  @Input() dati;
  @Input() Utils;

  @Output() visibileEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshData: EventEmitter<boolean> = new EventEmitter<boolean>();

  mascheraVisibile = false;
  selFolder = '';
  edge;

  id;
  name;
  description;
  display_name;
  file_type;
  geo_measure_dfn_code;
  geo_sla_id;
  net_tech;
  thr_value_1;
  thr_value_2;
  thr_value_3;
  thr_value_4;
  thr_value_5;
  folder;
  cambiatoNome = false;
  misure2;

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private Utilities: Utils
  ) {
  }

  ngOnChanges(c) {
    // logConsole(c);

    if (c.visibile) {
      this.mascheraVisibile = c.visibile.currentValue;
      if (this.mascheraVisibile) {
        // logConsole('Leggo activity');
      }
      // return;
    }

    if (c.misure) {
      // logConsole(c.misure.currentValue);
      this.misure2 = c.misure.currentValue;
      if (this.cambiatoNome === false && this.name !== undefined) {
        const tm = setTimeout(() => {
          clearTimeout(tm);
          // logConsole('Cambio nome misura 1', this.name);
          this.geo_measure_dfn_code = ExternalUtilities.PrendeNomeMisuraDaCodice(this.geo_measure_dfn_code, c.misure.currentValue);
          this.cambiatoNome = true;
        }, 100);
      }
    }

    if (c.dati && c.dati.currentValue) {
      if (c.dati.currentValue !== 'empty') {
        // logConsole('SLA Thr scelto', c.dati.currentValue);
        this.id = c.dati.currentValue.ID;
        this.name = c.dati.currentValue.NAME;
        this.description = c.dati.currentValue.DESCRIPTION;
        this.folder = c.dati.currentValue.FOLDER;
        this.display_name = c.dati.currentValue.DISPLAY_NAME;
        this.file_type = c.dati.currentValue.FILE_TYPE;
        this.geo_measure_dfn_code = c.dati.currentValue.GEO_MEASURE_DFN_CODE;
        if (this.geo_measure_dfn_code !== undefined) {
          // logConsole('Cambio nome misura 2', this.geo_measure_dfn_code);
          this.geo_measure_dfn_code = ExternalUtilities.PrendeNomeMisuraDaCodice(this.geo_measure_dfn_code, this.misure2);
          this.cambiatoNome = true;
        }
        this.geo_sla_id = c.dati.currentValue.ID;
        this.net_tech = c.dati.currentValue.NET_TECH;
        this.thr_value_1 = c.dati.currentValue.THR_VALUE_1;
        this.thr_value_2 = c.dati.currentValue.THR_VALUE_2;
        this.thr_value_3 = c.dati.currentValue.THR_VALUE_3;
        this.thr_value_4 = c.dati.currentValue.THR_VALUE_4;
        this.thr_value_5 = 0; // c.dati.currentValue.THR_VALUE_5;
      } else {
        this.id = '';
        this.name = '';
        this.description = '';
        this.folder = '';
        this.display_name = '';
        this.file_type = '';
        this.geo_measure_dfn_code = '';
        this.geo_sla_id = '';
        this.net_tech = '';
        this.thr_value_1 = '';
        this.thr_value_2 = '';
        this.thr_value_3 = '';
        this.thr_value_4 = '';
        this.thr_value_5 = '0';
      }
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // ExternalUtilities.visualizzaAlert('Entrato');
  }

  mostraNascondeMenu() {
    this.mascheraVisibile = false;
    this.visibileEmit.emit(false);
  }

  selectFolder(e) {
    if (e) {
      this.folder = e.NAME;
    }
  }

  salvaDati() {
    let jsonString = '{';
    jsonString += '"v_cntx": "' + ExternalUtilities.sessione + '",';
    jsonString += '"v_id": ' + this.geo_sla_id + ',';
    jsonString += '"v_thr_value_1": ' + this.thr_value_1 + ',';
    jsonString += '"v_thr_value_2": ' + this.thr_value_2 + ',';
    jsonString += '"v_thr_value_3": ' + this.thr_value_3 + ', ';
    jsonString += '"v_thr_value_4": ' + this.thr_value_4 + ' ';
    // jsonString += '"v_thr_value_5": ' + this.thr_value_5 + ' ';
    jsonString += '}';

    // logConsole(JSON.parse(jsonString));

    this.apiService.chiamataPost(this.Utilities, 'geo_sla_thr__upd', JSON.parse(jsonString))
    // .map(response => response)
    .subscribe(data => {
      // logConsole('Update sla thr return:', data);
      ExternalUtilities.checkRitornoChiamata(Utils, data);

      if (+data[0].v_err_code === 0) {
        this.refreshData.emit(true);
        this.mostraNascondeMenu();
      } else {
        ExternalUtilities.visualizzaAlert(data[0].v_failure_reason);
      }
    }, error => {
      ExternalUtilities.visualizzaAlert(error);
    });
  }

  checkEdge(event) {
    ExternalUtilities.edge = event;
    // logConsole('edge:', event);
  }
}

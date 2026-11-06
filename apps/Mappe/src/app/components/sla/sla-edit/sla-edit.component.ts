import { logConsole } from '../../../console-log';
import { Utils } from './../../Utilities.component';
import { OnInit, AfterViewInit, OnChanges, Component, Output, EventEmitter, Input } from '@angular/core';
import {ApiService} from '../../../../db/api.service';
import { DatePipe } from '@angular/common';
// import Utils from '../../Utilities.component';

import { SessionService } from '../../../../db/session.service';
import ExternalUtilities from '../../ExternalUtilities.component';

@Component({
  templateUrl: 'sla-edit.component.html',
  selector: 'sla-edit-component',
  styleUrls: ['./sla-edit.component.css']
})

export class SlaEditComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() visibile: boolean;
  @Input() userName: string;
  @Input() dati;
  @Input() nuovo: boolean;
  @Input() slaGroup;
  @Input() Utils;

  @Output() visibileEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshData: EventEmitter<boolean> = new EventEmitter<boolean>();

  mascheraVisibile = false;
  selFolder = '';
  slaGroup2;
  edge;

  id;
  description;
  name;
  operator_name;
  group_name;
  folder;
  insert_ts;
  original_name;

  pulisceFiltroSLA;

  constructor(
    private sessionService: SessionService,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private Utilities: Utils
  ) {
  }

  ngOnChanges(c) {
    // logConsole(c);

    if (c.slaGroup) {
      this.slaGroup2 = c.slaGroup.currentValue;
    }

    if (c.visibile) {
      this.mascheraVisibile = c.visibile.currentValue;
      if (this.mascheraVisibile) {
        // logConsole('Leggo activity');
        this.pulisceFiltroSLA = !this.pulisceFiltroSLA;
      }
      // return;
    }

    if (c.dati) {
      // logConsole('SLA Caricato:', c.datiThr.currentValue);
      if (c.dati.currentValue && c.dati.currentValue !== 'empty') {
        this.id = c.dati.currentValue.ID;
        this.name = c.dati.currentValue.NAME;
        this.description = c.dati.currentValue.DESCRIPTION;
        this.operator_name = c.dati.currentValue.OPERATOR_NAME;
        this.group_name = c.dati.currentValue.GROUP_NAME;
        this.folder = c.dati.currentValue.FOLDER;
        this.insert_ts = c.dati.currentValue.INSERT_TIMESTAMP;
        this.original_name = this.name;
      } else {
        this.id = '';
        this.name = '';
        this.description = '';
        this.operator_name = '';
        this.group_name = '';
        this.folder = '';
        this.insert_ts = '';
        this.original_name = '';
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
      const ee = ExternalUtilities.converteStringaInJSON(e);
      // logConsole('Folder selezionato', ee);
      this.folder = ee.VALUE_STR;
    }
  }

  salvaDati() {
    const dateNow: Date = new Date();
    const update_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss', 'UTC');

    let desc = this.description;
    desc = desc.replace(/(\r\n|\n|\r)/gm, '');

    if (this.nuovo) {
      /* let jsonString = '{';
      jsonString += '"v_cntx": "' + this.sessionService.getToken() + '",';
      jsonString += '"v_id_origin": "' + this.id + '", ';
      jsonString += '"v_name": "' + this.name + '", ';
      jsonString += '"v_folder": "' + this.folder + '", ';
      jsonString += '"v_description": "' + desc + '" ';
      jsonString += '}';

      // logConsole(JSON.parse(jsonString));

      this.apiService.chiamataPost('geo_sla__ins', JSON.parse(jsonString))
      // .map(response => response)
      .subscribe(data => {
        logConsole('Update sla return:', data);
        if (+data[0].v_err_code === 0) {
            this.refreshData.emit(true);
          this.mostraNascondeMenu();
        } else {
          ExternalUtilities.visualizzaAlert(data[0]. Message);
        }
      }, error => {
        ExternalUtilities.visualizzaAlert(error);
      }); */
    } else {
      let jsonString = '{';
      jsonString += '"v_cntx": "' + ExternalUtilities.sessione + '",';
      jsonString += '"v_id": "' + this.id + '", ';
      jsonString += '"v_name": "' + this.name + '", ';
      jsonString += '"v_folder": "' + this.folder + '", ';
      jsonString += '"v_description": "' + desc + '" ';
      jsonString += '}';

      // logConsole(JSON.parse(jsonString));

      this.apiService.chiamataPost(this.Utilities, 'geo_sla__upd', JSON.parse(jsonString))
      // .map(response => response)
      .subscribe(data => {
        ExternalUtilities.checkRitornoChiamata(Utils, data);

        // logConsole('Update sla return:', data);
        if (+data[0].v_err_code === 0) {
            this.refreshData.emit(true);
          this.mostraNascondeMenu();
        } else {
          ExternalUtilities.visualizzaAlert(data[0]. Message);
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
}

import { logConsole } from '../../../console-log';
import { OnInit, AfterViewInit, OnChanges, Component, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from '../../../../db/api.service';
import { DatePipe } from '@angular/common';
// import Utils from '../../Utilities.component';
import ExternalUtilities from '../../ExternalUtilities.component';

@Component({
  templateUrl: 'dashboard-name.component.html',
  selector: 'dashboard-name-component',
  styleUrls: ['./dashboard-name.component.css']
})

export class DashboardNameComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() visibile: boolean;
  @Input() name: boolean;
  @Input() description: boolean;
  @Input() userName: string;
  @Input() ConnessioneStabilita: string;
  @Input() listaDati;
  @Input() folderName;
  @Input() Utils;

  @Output() confirmEmit: EventEmitter<String> = new EventEmitter<String>();
  @Output() visibileEmit: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  mascheraVisibile = false;
  folder;
  name2;
  desc2;
  listaDati2;
  pulisceFiltroDashboard;
  edge;

  ngOnInit() {
  }

  ngOnChanges(c) {
    // logConsole('On Changes dashboard name:', c);

    if (c.visibile) {
      this.mascheraVisibile = c.visibile.currentValue;
      if (this.mascheraVisibile) {
        // logConsole('Leggo activity');
        this.pulisceFiltroDashboard = !this.pulisceFiltroDashboard;
      }
      // return;
    }

    if (c.listaDati && c.listaDati.currentValue) {
      // logConsole('Lista dati onchange dashboard name:', c.listaDati.currentValue);
      if (c.listaDati.currentValue[0] === '') {
        ExternalUtilities.visualizzaAlert('Problema sulla lista dei valori in dashboard name');
      }
      this.listaDati2 = c.listaDati.currentValue;
    }

    if (c.folderName) {
      // logConsole('Folder', c.folderName.currentValue);
      this.folder = c.folderName.currentValue;
    }

    if (c.name) {
      this.name2 = c.name.currentValue;
    }

    if (c.description) {
      // logConsole('onChange description name', c.description.currentValue);
      this.desc2 = c.description.currentValue;
      if (this.desc2 === null) { this.desc2 = ''; };
    }
  }

  ngAfterViewInit() {

  }

  selectFolder(e) {
    if (typeof(e) !== 'undefined') {
      const ee = ExternalUtilities.converteStringaInJSON(e);
      // const ee = Utils.ritornaRigaTotaleDaDescrizioneCombo(e, this.listaDati2, 'VALUE_STR');
      // logConsole('Folder selezionato', ee);
      if (ee.VALUE_STR) {
        this.folder = ee.VALUE_STR;
      } else {
        this.folder = ee;
      }
    }
  }

  mostraNascondeMenu() {
    this.mascheraVisibile = false;
    this.visibileEmit.emit(false);
  }

  salvaDati() {
    if (!this.name2) {
      ExternalUtilities.visualizzaAlert('Please insert the name of the dashboard');
    } else {
      if (!this.folder) {
        ExternalUtilities.visualizzaAlert('Please insert the folder of the dashboard');
      } else {
        this.confirmEmit.emit(this.name2 + '§' + this.folder + '§' + this.desc2);
        this.visibileEmit.emit(false);
        this.mascheraVisibile = false;
      }
    }
  }

  checkEdge(event) {
    ExternalUtilities.edge = event;
    // logConsole('edge:', event);
  }
}

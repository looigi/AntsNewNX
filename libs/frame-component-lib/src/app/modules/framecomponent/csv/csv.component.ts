import { logConsole } from '../console-log';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import ExternalUtilities from "../ExternalUtilities.component";

@Component({
  templateUrl: 'csv.component.html',
  selector: 'csv-component',
  changeDetection: ChangeDetectionStrategy.OnPush, // AGGIUNTO PER MEMORY LEAKES
  styleUrls: ['./csv.component.css']
})

export class CsvComponent implements OnInit, OnChanges {
  @Input() debug = false;
  @Input() Utils;
  @Input() userName;
  @Input() NumeroFrame;
  @Input() NomeFrame;
  @Input() frameAttivo;
  @Input() visualizzaGrigliaExport = false;
  @Input() datiGrigliaExport;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() indirizzoServer;
  @Input() daIstogramma = false;
  @Input() sessionID;

  @Output() chiusuraCSV: EventEmitter<boolean> = new EventEmitter<boolean>();

  selezioneGE;
  effettuaAutoFitCSV = false;
  datiGrigliaExport2;
  nomeFrame2;
  debug2;
  sessionID2;

  constructor(

  ) {

  }

  ngOnInit() {

  }

  ngOnChanges(c) {
    // // logConsole(c);
    if (c.debug) {
      this.debug2 = c.debug.currentValue;
    }

    if (c.sessionID) {
      if (c.sessionID.currentValue !== undefined) {
        this.sessionID2 = c.sessionID.currentValue;
      }
    }

    if (c.NomeFrame) {
      if (c.NomeFrame.currentValue !== undefined) {
        this.nomeFrame2 = c.NomeFrame.currentValue;
        if (this.nomeFrame2 === '') { this.nomeFrame2 = '<empty>'; }
        if (this.debug2 === true) {
          // logConsole('CSV: Nome frame ', this.NumeroFrame, this.nomeFrame2);
        }
      }
    }

    if (c.datiGrigliaExport) {
      if (c.datiGrigliaExport.currentValue) {
        this.datiGrigliaExport2 = c.datiGrigliaExport.currentValue;
        // logConsole('Dati export', this.datiGrigliaExport2);
        if (this.debug2 === true) {
          // logConsole('CSV: Dati arrivati alla griglia csv', this.datiGrigliaExport2);
        }
      }
    }
  }

  checkEdge(event) {
    this.Utils.edge = event;
    // // logConsole('edge:', event);
  }

  selezioneRigaCSV(e) {
    if (this.debug === true) {
      // logConsole('Selezione riga CSV', e);
    }
    this.selezioneGE = e.ROW_ID
  }

  fChiusuraCSV() {
    this.visualizzaGrigliaExport = false;
    this.chiusuraCSV.emit(this.visualizzaGrigliaExport);
  }

  ritornoDimensioniColonneCSV(e) {
    ExternalUtilities.scriveDimensioniColonne('CSV', e);
  }
}

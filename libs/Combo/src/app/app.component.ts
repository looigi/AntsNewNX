import { logConsole } from './console-log';
import { environment } from './../environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'combocomponent';

  Utils = {
    linkIcone: 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/assets/img' // 'http://10.100.7.69/assets/img'
  };
  platformName = 'Scritta di Test';
  dimeFont = 20;
  menuVisibile = true;
  datiFrames = [
    { id: 11, name: 'Valore zero', categoria: 'Altro' },
    { id: 0, name: '0', categoria: 'Altro' },
    { id: 7, name: 'Paperuacchio', categoria: 'Paper' },
    { id: 1, name: 'Pippo', categoria: 'Altro' },
    { id: 2, name: 'Pluto', categoria: 'Cane' },
    { id: 12, name: '2022', categoria: 'Altro' },
    { id: 3, name: 'Paperino', categoria: 'Paper' },
    { id: 4, name: 'Minnie', categoria: 'Altro' },
    { id: 6, name: 'Paperonzolo', categoria: 'Paper' },
    { id: 5, name: 'Topolino', categoria: 'Altro' },
    { id: 8, name: 'Riga molto lunga per testare l\'andata a capo senza nessun problema', categoria: '' },
  ];
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  valoreDefault;
  aggiungeRiga;

  constructor(
  ) {
  }

  checkEdge(event) {
    this.edge = event;
    // this.scriveLog('edge:', event);
  }

  ngOnInit() {
    // logConsole(this.datiFrames);
    const vd = localStorage.getItem('TestCombo');
    if (vd !== null) {
      this.valoreDefault = vd;
      // logConsole('Valore default', vd);
    }
  }

  select(e) {
    logConsole('Selezionato', e);
    localStorage.setItem('TestCombo', e);
  }

  cambioValore(e) {
    logConsole('Digitazione', e);
  }

  impostaValore() {
    this.valoreDefault = 'Pippo,Pluto,Paperino,PPP';
    // logConsole('Valore impostato', this.valoreDefault)
  }

  aggiungeValore() {
    this.aggiungeRiga = { id: 12, name: 'Riga aggiunta', categoria: 'Altro' };
    // logConsole('Riga aggiunta', this.aggiungeRiga)
  }

  uscitaCombo(e) {
    logConsole('Uscito dal campo');
  }

  clickRiga(e) {
    logConsole('Click su riga', e);
  }
}

import { environment } from './../environments/environment';
import { Observable } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'moduloAPK';

  infoSistema;
  datiGPS = {
    GPS: undefined,
    network: undefined,
    satellite: undefined,
    cellInfo: undefined,
    cellLocation: undefined,
    signalStrength: undefined,
    datiUlteriori: undefined
  }
  q = 0;

  constructor(
  ) {
  }

  ngOnInit() {
    const t = setInterval(() => {
      this.q++;
    }, 1000);
  }

  prendeInfoSistema(e) {
    this.infoSistema = e;
    // console.log('Arrivate info di sistema', e);
  }

  prendeGPS(e) {
    this.datiGPS.GPS = JSON.stringify(e);
  }

  prendeNetwork(e) {
    this.datiGPS.network = e;
  }

  prendeSatellite(e) {
    this.datiGPS.satellite = JSON.stringify(e);
  }

  prendeCellInfo(e) {
    this.datiGPS.cellInfo = e;
  }

  prendeCellLocation(e) {
    this.datiGPS.cellLocation = e;
  }

  prendeSignalStrength(e) {
    this.datiGPS.signalStrength = e;
  }

  prendeDatiUlteriori(e) {
    this.datiGPS.datiUlteriori = e;
  }

  prendeConnectionJSON(e) {
    // console.log('JSON', e);
    // this.infoSistema.connectionJSON = JSON.stringify(e);
  }
}

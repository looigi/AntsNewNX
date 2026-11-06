import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  Utils = { linkIcone: 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/assets/img' }; // 'http://localhost:2727/assets/img' };
  visibile = false;
  data = '2021-05-05 0:38:00';
  data2 = '23:58:00';

  apre() {
    this.visibile = true;
  }

  ritornaData(e) {
    // console.log('Ritorna Data selezionata', e);
    // this.visibile = false;
  }

  premutoBottone() {
    // console.log('Premuto bottone');
    this.data = new Date().toString();
  }
}

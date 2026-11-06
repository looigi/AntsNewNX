import { OnInit, AfterViewInit, OnChanges, SimpleChange, Output, EventEmitter, Component, Input, ChangeDetectionStrategy } from '@angular/core';
// import Utils from '../Utilities.component';

@Component({
    templateUrl: 'editplanimetry.component.html',
    selector: 'editplanimetry-component',
    changeDetection: ChangeDetectionStrategy.OnPush, // AGGIUNTO PER MEMORY LEAKES
    styleUrls: ['./editplanimetry.style.css']
})

export class EditPlanimetryComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() mascheraVisibile;
  @Input() coordinate;
  @Input() Utils;

  @Output() mascheraVisibileEmit: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() coordinateEmit: EventEmitter<String> = new EventEmitter<String>();

  mascheraVisibile2 = false;
  coordinate2;
  coordinate2Originali;
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
  step: number = .005;

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  ngOnChanges(r) {
    if (r.mascheraVisibile) {
      this.mascheraVisibile2 = r.mascheraVisibile.currentValue;
    }
    if (r.coordinate) {
      this.coordinate2 = r.coordinate.currentValue;
      this.coordinate2Originali = JSON.parse(JSON.stringify(this.coordinate2));
      if (this.coordinate2 && this.coordinate2 !== '') {
        const c = this.coordinate2.split(';');
        this.lng1 = c[0];
        this.lat1 = c[1];
        this.lng2 = c[2];
        this.lat2 = c[3];
      }
    }
  }

  chiudiMenu(e) {
    this.mascheraVisibile2 = false;
    this.mascheraVisibileEmit.emit(false);
  }

  checkEdge(t, event) {
    t.Utils.edge = event;
  }

  cambioLat1(e) {
    this.lat1 = e;
    this.creaCoordinate();
  }

  cambioLat2(e) {
    this.lat2 = e;
    this.creaCoordinate();
  }

  cambioLng1(e) {
    this.lng1 = e;
    this.creaCoordinate();
  }

  cambioLng2(e) {
    this.lng2 = e;
    this.creaCoordinate();
  }

  creaCoordinate() {
    const coordinate = this.lng1 + ';' + this.lat1 + ';' + this.lng2 + ';' + this.lat2 + ';';
    this.coordinateEmit.emit(coordinate);
  }

  lat1Su() {
    this.lat1 = +this.lat1 + +this.step;
    this.creaCoordinate();
  }

  lat2Su() {
    this.lat2 = +this.lat2 + +this.step;
    this.creaCoordinate();
  }

  lng1Su() {
    this.lng1 = +this.lng1 + +this.step;
    this.creaCoordinate();
  }

  lng2Su() {
    this.lng2 = +this.lng2 + +this.step;
    this.creaCoordinate();
  }

  lat1Giu() {
    this.lat1 = +this.lat1 - +this.step;
    this.creaCoordinate();
  }

  lat2Giu() {
    this.lat2 = +this.lat2 - +this.step;
    this.creaCoordinate();
  }

  lng1Giu() {
    this.lng1 = +this.lng1 - +this.step;
    this.creaCoordinate();
  }

  lng2Giu() {
    this.lng2 = +this.lng2 - +this.step;
    this.creaCoordinate();
  }

  cambioStep(e) {
    this.step = +e;
  }

  spostaSu() {
    this.lat1 = +this.lat1 + +this.step;
    this.lat2 = +this.lat2 + +this.step;
    this.creaCoordinate();
  }

  spostaGiu() {
    this.lat1 = +this.lat1 - +this.step;
    this.lat2 = +this.lat2 - +this.step;
    this.creaCoordinate();
  }

  spostaSinistra() {
    this.lng1 = +this.lng1 - +this.step;
    this.lng2 = +this.lng2 - +this.step;
    this.creaCoordinate();
  }

  spostaDestra() {
    this.lng1 = +this.lng1 + +this.step;
    this.lng2 = +this.lng2 + +this.step;
    this.creaCoordinate();
  }

  centra() {
    /* const c = this.coordinate2Originali.split(';');
    this.lng1 = c[0];
    this.lat1 = c[1];
    this.lng2 = c[2];
    this.lat2 = c[3];

    this.creaCoordinate(); */
  }

  ruotaSinistra() {

  }

  ruotaDestra() {

  }

  centraRuota() {

  }

  centraSize() {

  }

  sizePiu() {
    this.lat1 = +this.lat1 + (+this.step / 2);
    this.lat2 = +this.lat2 - (+this.step / 2);

    this.lng1 = +this.lng1 + (+this.step / 2);
    this.lng2 = +this.lng2 - (+this.step / 2);

    this.creaCoordinate();
  }

  sizeMeno() {
    this.lat1 = +this.lat1 - (+this.step / 2);
    this.lat2 = +this.lat2 + (+this.step / 2);

    this.lng1 = +this.lng1 - (+this.step / 2);
    this.lng2 = +this.lng2 + (+this.step / 2);

    this.creaCoordinate();
  }
}

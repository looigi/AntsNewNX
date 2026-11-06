import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
    templateUrl: 'icone.component.html',
    selector: 'icone-component',
    changeDetection: ChangeDetectionStrategy.OnPush, // AGGIUNTO PER MEMORY LEAKES
    styleUrls: ['./icone.style.css']
})

export class IconeComponent implements OnInit, OnChanges {
  @Input() accordionDebug;
  @Input() debug2;
  @Input() userName;
  @Input() platformType;
  @Input() Utils;
  @Input() MappaOGrafico2;
  @Input() dimensioniFinestraRicerca;
  @Input() dimensioniFinestraLegenda2;
  @Input() exportKMLAttivo;
  @Input() frameEditorAttivo;
  @Input() massimizzata;
  @Input() eseguitoInProgetto2;
  @Input() modalitaDrawPolygon;
  @Input() barraImpostataAperta;

  @Output() clickIconaEmit: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() {

  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  clickIcona(e, v) {
    const rit = { id: e, valore: v};

    this.clickIconaEmit.emit(rit);
  }
}

import { logConsole } from '../console-log';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { Subject } from "rxjs";
// import { isNumeric } from "rxjs/internal-compatibility";
import { Utils } from "../Utilities.component";
import Swal from "sweetalert2";

@Component({
  selector: 'edit_dataset-component',
  templateUrl: './editDataset.component.html',
  styleUrls: ['./editDataset.style.css'],
  encapsulation: ViewEncapsulation.None
})

export class EditDataset implements OnInit, OnDestroy, OnChanges {
  @Input() sessioneID: string = '';
  @Input() userName: string = '';
  @Input() Utils: any;
  @Input() dataSet: any;
  @Input() titoloMaschera: string = '';

  @Output() chiudeMaschera: EventEmitter<string> = new EventEmitter<string>();
  @Output() passaggioModifiche: EventEmitter<any> = new EventEmitter<any>();

  campiMaschera = new Array();
  dimensioneTitolo = 0;
  rigaModificata: any;
  daSalvare = false;
  listaCampiModificati = new Array();

  destroy$ = new Subject<void>();
  
  constructor(

  ) {

  }

  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
      
  }

  ngOnChanges(changes: any): void {
    this.visualizzaDati();
  }

  visualizzaDati() {
    if (!this.dataSet) {
        return;
    }
    const campi = new Array();
    let lunghezzaMassimaTitolo = 0;
    this.rigaModificata = JSON.parse(JSON.stringify(this.dataSet));
    
    this.rigaModificata.ColumnProperty.forEach((element: any) => {
        if (element.IsEditable === 'true') {
            campi.push({
                HeaderText: element.headerText, 
                Key: element.key, 
                Tipologia: element.dataType,
                Valore: this.prendeValore(this.dataSet.RigaSelezionata, element.key)
            });
            if (element.headerText.length > lunghezzaMassimaTitolo) {
              lunghezzaMassimaTitolo = element.headerText.length;
            }
        }
    });
    // logConsole('Lunghezza massima titolo', lunghezzaMassimaTitolo);
    this.dimensioneTitolo = lunghezzaMassimaTitolo * 8;

    this.campiMaschera = campi;
  }

  prendeValore(Riga: any, Campo: string) {
    if (Riga && Riga[Campo]) {
      return Riga[Campo].trim();
    } else {
      return '';
    }
  }

  fChiudeMaschera() {
    if (this.daSalvare) {
      let campi = '';
      this.listaCampiModificati.forEach(element => {
        campi += '<br />' + element;
      });
      this.mostraPopupNuovo('Close loosing changes?<br />' + campi);
    } else {
      this.chiudeMaschera.emit(new Date().toString());
    }
  }
  
  mostraPopupNuovo(messaggio: String) {
    Swal.fire({
      title: 'Confirm',
      html: messaggio,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    }).then((result) => {
      if (result.value) {
        const tm = setTimeout(() => {
          clearTimeout(tm);

          this.chiudeMaschera.emit(new Date().toString());
        }, 100);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  trackByIndice(index: number, item: any) {
    return index;
  }

  prendeAllineamentoTesto(campo: any) {
    const tipologia = campo.Tipologia;
    
    switch (tipologia) {
        case 'numeric':
            return 'right';
        default:
            return 'left'
    }
  }

  checkEdge(event: any) {
    this.Utils.edge = event;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'edge:', event);
  }

  controlloSeDaSalvare() {
    let daSalvare = false;
    const listaCampiModificati = new Array();

    this.campiMaschera.forEach(element => {
      // if (!daSalvare) {
        const modificato = this.rigaModificata.RigaSelezionata[element.Key];
        const originale = element.Valore;
        const tipologia = element.Tipologia;

        if (tipologia === 'numeric') {
          if (+modificato !== +originale) {
            // logConsole('Campo diverso', modificato, originale);
            listaCampiModificati.push(element.HeaderText);
            daSalvare = true;
          }
        } else {
          if (modificato !== originale) {
            // logConsole('Campo diverso', modificato, originale);
            listaCampiModificati.push(element.HeaderText);
            daSalvare = true;
          }
        }
      // }
    });

    this.listaCampiModificati = listaCampiModificati;
    this.daSalvare = daSalvare;

    // logConsole('Campi modificati', this.listaCampiModificati);
  }

  undo() {
    this.campiMaschera.forEach(element => {
      element.Valore = this.rigaModificata.RigaSelezionata[element.Key];
    });

    this.daSalvare = false;
  }

  salva() {
    this.campiMaschera.forEach(element => {
      this.rigaModificata.RigaSelezionata[element.Key] = element.Valore;
    });

    // logConsole('Ritorno', this.campiMaschera);

    this.passaggioModifiche.emit(this.rigaModificata);
  }
}
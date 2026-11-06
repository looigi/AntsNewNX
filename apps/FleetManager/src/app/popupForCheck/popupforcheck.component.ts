import { logConsole } from '../console-log';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
    templateUrl: 'popupforcheck.component.html',
    selector: 'popupforcheck-component',
    // changeDetection: ChangeDetectionStrategy.OnPush, // AGGIUNTO PER MEMORY LEAKES
    styleUrls: ['./popupforcheck.style.css']
})

export class PopupForCheckComponent implements OnInit, OnChanges {
    @Input() Utils;
    @Input() sessionID;
    @Input() datiGriglia;
    @Input() userName;
    @Input() indirizzoServer;
    @Input() modalita;
    @Input() operazione = '';

    @Output() chiudePopup: EventEmitter<any> = new EventEmitter<any>();
    @Output() confermaPopup: EventEmitter<any> = new EventEmitter<any>();

    edge = {
        top: true,
        bottom: true,
        left: true,
        right: true
    };
    selezionePM;

    constructor() {
    }

    ngOnInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['datiGriglia'] && changes['datiGriglia'].currentValue) {
            this.selezionePM = new Array();
            changes['datiGriglia'].currentValue.DataTable.forEach(element => {
                this.selezionePM.push(element.ROW_ID);
            });
            logConsole('Selezione PM:', this.selezionePM);
        }
    }

    deSelezioneTutteLeRighe(e) {
        this.selezionePM = new Array();
    }

    selezioneTutteLeRighe(e) {
        this.selezionePM = new Array();
        this.datiGriglia.DataTable.forEach(element => {
            this.selezionePM.push(element.ROW_ID);  
        });
    }

    clickSuCheckRiga(e) {
        // logConsole('Ritorno click su check riga', e);
        this.selezionePM = new Array();
        e.dati.forEach(element => {
            this.selezionePM.push(element.ROW_ID);  
        });
    }

    fChiudePopup() {
        this.chiudePopup.emit(new Date().toString());
    }

    fConfermaPopup() {
        const dati = new Array();
        this.datiGriglia.DataTable.forEach(element => {
            if (this.selezionePM.indexOf(element.ROW_ID) > -1) {
                dati.push(element);
            }
        });
        this.confermaPopup.emit({ modalita: this.modalita, dati: dati });

        this.chiudePopup.emit(new Date().toString());
    }

    inviaFiltri() {
    }

    checkEdge(event) {
        this.Utils.edge = event;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'edge:', event);
    }

    ritornoDimensioniColonneCG(e) {
    }
}
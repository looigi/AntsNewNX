import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'barra_superiore_griglia-component',
    templateUrl: 'barra_superiore.component.html',
    styleUrls: ['barra_superiore.style.css'],
    encapsulation: ViewEncapsulation.None  
})

export class BarraSuperioreGrigliaComponent implements OnInit, OnChanges, OnDestroy {
    @Input() debug = false;
    @Input() visibile;
    @Input() linkIcone;
    @Input() userName;
    @Input() righeTotali;
    @Input() pageSize;
    @Input() take;
    @Input() skip;
    @Input() warning;
    @Input() aperteIcone;
    @Input() title;
    @Input() showSettedFilter;
    @Input() filtroEventi;
    @Input() filtroAttivo;
    @Input() rowButtonsConfig;
    @Input() pageSelectorVisibile;
    @Input() pageEmptyVisibile;
    @Input() filtroAttivoPass;
    @Input() runKeyVisibile;
    @Input() showRefresh;
    @Input() CalcolaDelta;
    @Input() CampoCalcolaDelta;
    @Input() backToSelectedKey;
    @Input() copyKeyVisibile2;
    @Input() toConfirm;
    @Input() copyKeyPersistant;
    @Input() deleteKeyVisibile2;
    @Input() deleteKeyPersistant;
    @Input() editKeyVisibile2;
    @Input() editKeyPersistant;
    @Input() downloadTDKey;
    @Input() downloadTcRun;
    @Input() pausaGrigliaDaAutorun;
    @Input() pausaGrigliaAttiva;
    @Input() selezioneMultipla;
    @Input() mySelection;
    @Input() selectAll;
    @Input() processKeyVisibile;
    @Input() includeKeyVisibile;
    @Input() excludeKeyVisibile;
    @Input() addToActSetOn;
    @Input() refreshKeyVisibile;
    @Input() infoKeyVisibile;
    @Input() infoKeypersistant;
    @Input() showColumnHiderAndOrderGrid;
    @Input() ciSonoColumnHidden;
    @Input() tcRunInfoVisibile;
    @Input() excelEventi2;
    @Input() confirmKeyVisibile;
    @Input() confirmKeyPersistant;
    @Input() TitoloTastoNew;
    @Input() newKeyVisibile2;
    @Input() newKeyPersistant;
    @Input() tastoCopia;
    @Input() tastoPaste;
    @Input() deleteKeyTcRunVisibile;
    @Input() deleteKeyTcRunPersistant;
    @Input() getTcRunFilesKeyVisibile;
    @Input() TitoloTastoRemove;
    @Input() deleteKeyVisibile3;
    @Input() deleteKeyPersistant2;
    @Input() addKeyVisibile2;
    @Input() addKeyPersistant;
    @Input() removeKeyVisibile2;
    @Input() removeKeyPersistant;
    @Input() editKeyVisibileN2;
    @Input() editKeyPersistantN;
    @Input() tastoTicket;
    @Input() tastoAI2;
    @Input() keyWorkspace;
    @Input() tastoSync;
    @Input() gestioneTicket;
    @Input() selectedRow;
    @Input() editable;
    @Input() editGridOn;
    @Input() rowsEdited;
    @Input() tastoFiltroCombo;
    @Input() filtroCombo;
    @Input() rePlayKeyVisibile;
    @Input() margineAlto;
    @Input() altezzaRigaStandard;
    @Input() modalitaAltezza;
    @Input() filtroVisibile;
    @Input() maskName;
    @Input() filtroDaPassare;
    @Input() tooltipDelete = 'Delete';
    @Input() tastoMoveToPointVisibile;
    @Input() tastoAITutte;
    @Input() tcRunInfoTitle;
    @Input() downloadTDTitle;
    @Input() mistralFilters;
    @Input() tooltipCopy = 'Copy';
    @Input() tastoSpreadSheet;
    @Input() raggruppabile;
    @Input() gruppiAperti;
    @Input() openAdvancedFilter;
    // Nomi delle icone da nascondere, separati da virgola (es. "Excel.png,Refresh"): senza estensione vale .png
    @Input() IconExcludedList = '';

    @Output() clickSuIcona: EventEmitter<any> = new EventEmitter<any>();
    @Output() invioFiltro: EventEmitter<any> = new EventEmitter<any>();
    
    constructor(
        private elemento: ElementRef
    ) {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: any) {
        if (changes.IconExcludedList) {
            this.applicaIconeEscluse();
        }
    }

    ngOnDestroy() {
        if (this.stileIconeEscluse) {
            this.stileIconeEscluse.remove();
            this.stileIconeEscluse = undefined;
        }
    }

    private static contatoreBarre = 0;
    private idBarra = 'barraGriglia' + (++BarraSuperioreGrigliaComponent.contatoreBarre);
    private stileIconeEscluse: HTMLStyleElement;

    // Nasconde le icone della barra il cui file è nella lista IconExcludedList. Le icone sono molte <img> nel template:
    // invece di aggiungere una condizione a ognuna si genera un foglio di stile che vale solo per questa barra
    // (attributo data-barra sull'elemento del componente). Il confronto sul nome non distingue maiuscole/minuscole.
    private applicaIconeEscluse() {
        const host = this.elemento.nativeElement as HTMLElement;
        host.setAttribute('data-barra', this.idBarra);

        const nomi = String(this.IconExcludedList || '')
            .split(',')
            .map(n => n.trim())
            .filter(n => n)
            // si tiene solo il nome del file (anche se arriva con un percorso) e si aggiunge .png se manca l'estensione
            .map(n => n.substring(n.lastIndexOf('/') + 1))
            .map(n => n.indexOf('.') > -1 ? n : n + '.png')
            // caratteri speciali nel selettore CSS tra virgolette
            .map(n => n.replace(/\\/g, '\\\\').replace(/"/g, '\\"'));

        if (nomi.length === 0) {
            if (this.stileIconeEscluse) {
                this.stileIconeEscluse.remove();
                this.stileIconeEscluse = undefined;
            }
            return;
        }

        const selettori = nomi.map(n => '[data-barra="' + this.idBarra + '"] img[src$="/' + n + '" i]');
        if (!this.stileIconeEscluse) {
            this.stileIconeEscluse = document.createElement('style');
            document.head.appendChild(this.stileIconeEscluse);
        }
        this.stileIconeEscluse.textContent = selettori.join(',\n') + ' { display: none !important; }';
    }

    ritornaStyleTitolo() {
        let ritorno = '';
        /* if (this.aperteIcone) {
          ritorno = '"margin-top": "-2px"';
        } else {
          ritorno = '"margin-top": "0px"';
        } */
        ritorno = '"margin-top": "2px"';
        ritorno += ',';
        if (this.warning === '') {
          ritorno += '"color": "black"';
        } else {
          ritorno += '"color": "red"';
        }
        return JSON.parse('{' + ritorno + '}');
    }

    invioPressione(cosa, campo) {
      this.clickSuIcona.emit({ id: cosa, valore: campo});
    }
    
    onFilterChanges() {
      setTimeout(() => {
        this.invioFiltro.emit(this.filtroDaPassare);
      }, 100);
    }
}  
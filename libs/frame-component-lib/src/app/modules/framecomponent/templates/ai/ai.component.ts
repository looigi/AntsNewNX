import { logConsole } from '../../console-log';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, NgZone } from "@angular/core";
import { ExternalApiService } from "../../services/externalapi.service";
import { OpenaiService } from "./openai.service";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import ExternalUtilities from "../../ExternalUtilities.component";
import { environment } from "../../../../../environments/environment";
// import Swal from 'sweetalert2/dist/sweetalert2.js';
import { GraphComponent } from '@swimlane/ngx-graph';
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { hash } from "ol/tilecoord";
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'ai-component',
  templateUrl: 'ai.component.html',
  styleUrls: ['./ai.style.css'],
  encapsulation: ViewEncapsulation.None
})

export class AIComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {  
  @Input() NumeroFrame;
  @Input() debug;
  @Input() frameAttivo;
  @Input() Utils;
  @Input() sessionId;
  @Input() frameName;
  @Input() userName;
  @Input() righePerPaginareAutomaticamente;
  @Input() indirizzoServer;
  @Input() act_id;
  @Input() tc_run_id;
  @Input() tmsFrom;
  @Input() tmsTo;
  @Input() tmrAttivo;
  // false quando il tab che contiene il componente non è visibile: il componente resta vivo (tab mantenuti)
  // ma i timer di aggiornamento non fanno chiamate al server
  @Input() visibile = true;
  @Input() apiCall;
  @Input() listaProfiliAI;

  @Input() visualizzareTastoSubmit = false;
  @Input() tipologiaFrame;
  @Input() eventiSceltiES;
  @Input() eventsMeasure;
  @Input() filtriEventi;
  @Input() isNonSyncEventTime;
  @Input() listaEventiDaPassare;
  @Input() listaEventiCheckatiES;
  @Input() listaEventiSEPassata;
  @Input() timeFilter;
  @Input() tipoEvento;
  @Input() ricercaJson;
  @Input() rigaEventoSelezionato;
  @Input() gestioneTemplate;
  @Input() datiPointActivityEvents;
  @Input() datiCSV;
  @Input() arrivatoJson;
  @Input() ultimoTemplateSelezionatoPassato;
  @Input() dimensioneSchermo;
  @Input() caricamentoEventiInCorso;
  @Input() tc_run_code;
  @Input() mappa_o_grafico;
  @Input() ultimiParametriCaricati;

  @Output() templateSelezionatoDaPassare: EventEmitter<any> = new EventEmitter<any>();
  @Output() nuoveImpostazioni: EventEmitter<any> = new EventEmitter<any>();
  @Output() inviaJson: EventEmitter<any> = new EventEmitter<any>();

  destroy$ = new Subject<void>();

  maskNameTemplate = ['', 'Templates2_1', 'Templates2_2', 'Templates2_3', 'Templates2_4', 'Templates2_5', 'Templates2_6',
    'Templates2_7', 'Templates2_8', 'Templates2_9'];
  selezioneTemplateAI;
  effettuaAutoFitTemplate = false;
  rigaSelezionataTemplate;
  messaggioWarningTemplate = '';
  modalitaEventi = false;
  prompt = '';
  vecchioPrompt = '';
  datiTemplate;
  datiPDT = [
      { name: 'msg_single' },
      { name: 'msg_list' }
  ];
  prompt_dt = 'msg_list';
  templateSelezionato;
  chiSonoTemplate = '';
  messaggioCSV = '';
  descrizioneAggiunta = false;
  eseguitoClickSuRiga = false;
  nomeGriglia2 = '';
  datiGriglia2;
  selezione2;
  effettuaAutoFit2 = false;
  chatMode1 = undefined;
  caricamentoEventiInCorso2 = false
  llm_profile_id;
  showPrompt = false;

  ngOnDestroy(): void {
    // alert('Chiudo');
    // if (this.tmr) { clearInterval(this.tmr); this.tmr = undefined; }
    if (this.tmr2) { clearInterval(this.tmr2); this.tmr2 = undefined; }
    if (this.tmrPending) { clearTimeout(this.tmrPending); this.tmrPending = undefined; }
    if (this.tmrAdattaGrafo) { clearTimeout(this.tmrAdattaGrafo); this.tmrAdattaGrafo = undefined; }
    if (this.osservatoreGrafo) { this.osservatoreGrafo.disconnect(); this.osservatoreGrafo = undefined; }

    this.destroy$.next();
    this.destroy$.complete();  
  }

  datiGriglia;
  nomeGriglia = 'AIGrid';
  maschera = 'AIQueries';
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  modello;

  elementidaScodare;
  qualeElementoStoScodando;
  vecchioColumnProperty;
  resultPrompt = '';
  resultRisposta = '';
  tempoTotale = 0;
  totalTokens = 0;
  totalSentTokens = 0;
  sommaRisposte = '';
  domandaAVideo = '';
  trovataRisposta;  
  titoloPerUpd;
  descrizionePerUpd;
  statusPerUpd;
  promptPerUpd;
  domandaDaFareAAI;
  sommaPrompt;
  sommaReq;
  answer;
  descrizione;
  titolo;
  context;
  hashID;
  cost;
  // duration;
  esecuzioneQuery = false;
  chiave = '';
  chiaveAdmin = '';
  promptDataSingolo;
  promptSingolo;
  ricaricaQuery = false;
  statTokens = '';
  rigaSelezionata;
  // status;
  modalitaTest = false;
  title;
  // tmr;
  tmr2;
  node_path;
  node_path_father_list;
  node_path_father_list_riga;
  hash_id;

  nodes = [];
  links = [];

  @ViewChild('graph')
  graph!: GraphComponent;

  @ViewChild('graphWrapper')
  graphWrapper!: ElementRef;

  view: [number, number] = [10, 10];
  private resizeObserver?: ResizeObserver;
  graphReady = false;

  ngAfterViewInit(): void {
    // this.costruisciChatModeTest();

    /* const t =setTimeout(() => {
      clearTimeout(t);

      const el = this.graphWrapper.nativeElement;

      if (el.clientWidth !== 0 && el.clientHeight !== 0) {
        this.view = [
          el.clientWidth,
          el.clientHeight
        ];

        this.graphReady = true;

        const t2 = setTimeout(() => {
          clearTimeout(t2);
          
          this.updateGraphSize();
        });

        this.cdRef.detectChanges();
      }
    }); */
    this.updateGraphSize();
  }

  onSplitDragEnd(): void {
    const t = setTimeout(() => {
      clearTimeout(t);
      
      this.updateGraphSize();
    });
  }

  onTabSelect1(event: any): void {
    // index tab graph
    if (event.index === 1) {
      const t = setTimeout(() => {
        clearTimeout(t);

        this.initializeGraph();
      }, 100);
    }
  }

  initializeGraph(): void {
    if (!this.graphWrapper) {
      return;
    }

    this.updateGraphSize();

    if (!this.resizeObserver) {
      this.resizeObserver =
        new ResizeObserver(() => {
          this.updateGraphSize();
        });

      this.resizeObserver.observe(
        this.graphWrapper.nativeElement
      );
    }
  }

  tmrUpd = undefined;

  updateGraphSize(): void {
    if (!this.graphWrapper) {
      let q = 0;

      if (this.tmrUpd) {
        clearInterval(this.tmrUpd);
        this.tmrUpd = undefined;
      }

      this.tmrUpd = setInterval(() => {
        if (this.graphWrapper) {
          clearInterval(this.tmrUpd);

          this.updateGraphSize2();
        } else {
          q++;
          if (q > 10) {
            clearInterval(this.tmrUpd);
          }
        }
      }, 200);
    } else {
      this.updateGraphSize2();
    }
  }

  layoutSettings = {
    // Grafo verticale: i figli di un nodo vanno sotto e non a destra (il default di dagre è 'LR')
    orientation: 'TB',
    // Margine a sinistra: le descrizioni sopra/sotto i nodi possono essere più larghe del nodo
    marginX: 40,
    // Spazio sopra il primo livello per l'INVESTIGATION_GOAL scritto sopra i nodi iniziali
    marginY: 30
  };

  // Dimensioni reali del grafo disegnato (larghezza, altezza) e timer per misurarle dopo ogni disegno
  dimensioniGrafo: [number, number] = [0, 0];
  tmrAdattaGrafo;
  scrollRotellaSu: HTMLElement;

  // ngx-graph intercetta sempre la rotella (per lo zoom) e blocca lo scroll della pagina: la si ferma sul contenitore,
  // in fase di cattura, così il div scorre normalmente. Lo zoom e il trascinamento del grafo sono disattivati.
  attivaScrollConRotella() {
    // Il contenitore può essere ricreato (contenuto del tab): il listener va messo sull'elemento attuale
    if (!this.graphWrapper || this.scrollRotellaSu === this.graphWrapper.nativeElement) {
      return;
    }
    this.scrollRotellaSu = this.graphWrapper.nativeElement;
    // Con Ctrl la rotella arriva al grafo e fa lo zoom
    this.graphWrapper.nativeElement.addEventListener('wheel', (e: WheelEvent) => {
      if (!e.ctrlKey) {
        e.stopPropagation();
      }
    }, { capture: true });

    this.attivaTrascinamentoContenitore(this.graphWrapper.nativeElement);
  }

  // Trascinamento col mouse sullo sfondo del grafo: fa scorrere il contenitore (come le barre), lasciando invariati
  // il trascinamento dei nodi, i clic e i pulsanti di zoom. I movimenti girano fuori da Angular per non scatenare
  // la change detection a ogni spostamento del mouse.
  attivaTrascinamentoContenitore(contenitore: HTMLElement) {
    contenitore.style.cursor = 'grab';
    this.ngZone.runOutsideAngular(() => {
      contenitore.addEventListener('mousedown', (e: MouseEvent) => {
        const bersaglio = e.target as Element;
        if (e.button !== 0 || !bersaglio || bersaglio.closest('.node-group, .zoom-grafo, button')) {
          return;
        }
        // Clic sulle barre di scorrimento: lo gestisce il browser
        const r = contenitore.getBoundingClientRect();
        if (e.clientX - r.left >= contenitore.clientWidth || e.clientY - r.top >= contenitore.clientHeight) {
          return;
        }
        const inizioX = e.clientX;
        const inizioY = e.clientY;
        const scrollX = contenitore.scrollLeft;
        const scrollY = contenitore.scrollTop;
        contenitore.style.cursor = 'grabbing';
        e.preventDefault();

        const muovi = (m: MouseEvent) => {
          contenitore.scrollLeft = scrollX - (m.clientX - inizioX);
          contenitore.scrollTop = scrollY - (m.clientY - inizioY);
        };
        const fine = () => {
          contenitore.style.cursor = 'grab';
          document.removeEventListener('mousemove', muovi);
          document.removeEventListener('mouseup', fine);
        };
        document.addEventListener('mousemove', muovi);
        document.addEventListener('mouseup', fine);
      });
    });
  }

  percentualeZoom = 100;

  // fattore > 0: moltiplica lo zoom attuale; 0: torna al 100%. Si usa zoom() e non zoomTo(), che rifarebbe il
  // layout perdendo le posizioni dei nodi spostati a mano.
  zoomGrafo(fattore: number) {
    if (!this.graph) {
      return;
    }
    const attuale = this.graph.zoomLevel || 1;
    let nuovo = fattore === 0 ? 1 : attuale * fattore;
    nuovo = Math.min(3, Math.max(0.2, nuovo));
    if (nuovo !== attuale) {
      this.graph.zoom(nuovo / attuale);
    }
  }

  zoomGrafoCambiato(livello: number) {
    this.percentualeZoom = Math.round((livello || 1) * 100);
  }

  // Percorso di un arco. Dopo lo spostamento di un nodo ngx-graph ricalcola l'arco con i soli punti di inizio e
  // fine (linea dritta): in quel caso si disegna una curva con tangenti verticali, adatta al grafo dall'alto in basso.
  // Con più punti si tiene il percorso calcolato da dagre.
  percorsoArco(link): string {
    const p = link && link.points;
    if (!p || p.length !== 2) {
      return link ? link.line : '';
    }
    const [inizio, fine] = p;
    const medio = (inizio.y + fine.y) / 2;
    return 'M' + inizio.x + ',' + inizio.y +
      ' C' + inizio.x + ',' + medio + ' ' + fine.x + ',' + medio + ' ' + fine.x + ',' + fine.y;
  }

  statoGrafoCambiato(e) {
    if (e && e.state === 'Transform') {
      this.programmaMisuraGrafo();
    }
  }

  programmaMisuraGrafo() {
    if (this.tmrAdattaGrafo) {
      clearTimeout(this.tmrAdattaGrafo);
    }
    this.tmrAdattaGrafo = setTimeout(() => {
      this.tmrAdattaGrafo = undefined;
      this.adattaVistaAlGrafo();
    }, 100);
  }

  osservatoreGrafo: MutationObserver;
  osservatoreGrafoSu: HTMLElement;

  // L'evento 'Transform' di ngx-graph arriva prima che i nodi siano posizionati, e la misura veniva presa sul
  // grafo ancora piccolo (area scorrevole troppo corta). Si misura invece dopo ogni cambio di posizione dei nodi o
  // dello zoom (attributo transform), compreso il trascinamento di un nodo.
  osservaGrafo() {
    if (!this.graphWrapper || this.osservatoreGrafoSu === this.graphWrapper.nativeElement) {
      return;
    }
    if (this.osservatoreGrafo) {
      this.osservatoreGrafo.disconnect();
    }
    this.osservatoreGrafoSu = this.graphWrapper.nativeElement;
    this.osservatoreGrafo = new MutationObserver(() => this.programmaMisuraGrafo());
    this.osservatoreGrafo.observe(this.osservatoreGrafoSu, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['transform']
    });
  }

  // Porta la vista del grafo alle dimensioni dei nodi disegnati: se supera il contenitore compaiono le barre di scorrimento
  adattaVistaAlGrafo() {
    if (!this.graphWrapper) {
      return;
    }
    const contenitore = this.graphWrapper.nativeElement as HTMLElement;
    const nodi = contenitore.querySelector('svg g.nodes') as SVGGraphicsElement;
    if (!nodi) {
      return;
    }
    let box;
    try {
      box = nodi.getBBox();
    } catch (e) {
      return;
    }
    // getBBox è nelle coordinate del grafo: si moltiplica per lo zoom per avere i pixel occupati
    const zoom = (this.graph && this.graph.zoomLevel) || 1;
    const margine = 20;
    this.dimensioniGrafo = [
      Math.ceil((box.x + box.width) * zoom + margine),
      Math.ceil((box.y + box.height) * zoom + margine)
    ];
    const larghezza = Math.max(contenitore.clientWidth, this.dimensioniGrafo[0]);
    const altezza = Math.max(contenitore.clientHeight, this.dimensioniGrafo[1]);
    // La dimensione si imposta direttamente sul componente e non tramite l'input [view]: ogni cambio di input fa
    // rifare il layout a ngx-graph, e i nodi spostati a mano tornerebbero al loro posto (es. dopo uno zoom)
    if (this.graph && (this.graph.width !== larghezza || this.graph.height !== altezza)) {
      this.graph.view = [larghezza, altezza];
      this.graph.basicUpdate();
      this.cdRef.detectChanges();
    }
  }

  updateGraphSize2(): void {
    if (!this.apertaGriglia2) {
      return;      
    }

    const element =
      this.graphWrapper.nativeElement;

    if (element.offsetWidth === 0 || element.offsetHeight === 0) {
      return;
    }

    this.attivaScrollConRotella();
    this.osservaGrafo();
    // Almeno quanto il contenitore; se il grafo è più grande, adattaVistaAlGrafo allarga la vista e il div scorre
    this.view = [
      Math.max(element.clientWidth, this.dimensioniGrafo[0]),
      Math.max(element.clientHeight, this.dimensioniGrafo[1])
    ];
    logConsole('Update graph size', this.view);

    const t1 = setTimeout(() => {
      clearTimeout(t1);
      
      this.graph?.update();

      // const t2 = setTimeout(() => {
      //   clearTimeout(t2);
        
        // this.graph?.center();
        // this.graph?.zoomToFit();

        const t3 = setTimeout(() => {
          clearTimeout(t3);
          
          this.graphReady = true;

          this.cdRef.detectChanges();
        }, 500);
      // }, 500);
      // alert('Graph size updated');
    }, 500);
  }
  
  /* updateGraphSize(): void {

    const el = this.graphWrapper.nativeElement;

    const width = el.clientWidth;
    const height = el.clientHeight;

    if (!width || !height) {
      return;
    }

    this.view = [width, height];

    this.cdRef.detectChanges();

    requestAnimationFrame(() => {
      this.graph?.update();
    });
  } */

  constructor(
      private apiService: ExternalApiService,
      private cdRef: ChangeDetectorRef,
      private openaiService: OpenaiService,
      private datePipe: DatePipe,

      private http: HttpClient,
      private sanitizer: DomSanitizer,
      private ngZone: NgZone
  ) {
  }

  executionContext = '';
  referenceKnowledge = '';

  LeggeSimbolici() {
    // // logConsole('Leggo simbolici', this.sessionId);
    if (!this.sessionId || this.sessionId === '' || this.sessionId === null)  {
      return;
    }
    const params = '{' +
      '"cntx_id": "' + this.sessionId + '"' +
    '}';
    // // logConsole('Symbolic', params);
    this.apiService.chiamataPost(this.Utils, 'geo_symbolic__sel', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // // logConsole('SYMBOLIC', data2);
      if (data2 && data2 !== null) {
        // if (data2.v_err_code && data2.v_err_code === 2) {
        //   alert(data2.v_failure_reason);
        // } else {
          // const data = JSON.parse(data2);
          // // // logConsole(data); //  and name = \'GEO_R_MAP_MAX_MEASR\'

          data2.forEach(element => {
            let name;
            let valore;

            if (element.NAME) {
              name = element.NAME;
              valore = element.VALUE;
            } else {
              if (element.name) {
                name = element.name;
                valore = element.value;
              }
            }
            // // logConsole(name, valore);

            switch (name) {
              case 'GRID_PAGEABLE_ROW_NUM':
                this.righePerPaginareAutomaticamente = element.VALUE;
                break;
              case 'AIREQ_KEY':
                // alert(valore);
                this.chiave = valore;

                this.richiedeTokens();
                break;
              case 'AIREQ_SYSTEM_PROMPT':
                // Tab System Prompt di Expert Investigation
                this.systemPrompt = valore;
                break;
              case 'AIREQ_SUMMARY_INSTRUCTION':
                // Tab Investigation Memory Instructions di Expert Investigation
                this.summaryInstruction = JSON.parse(valore);
                break;
              case 'AIREQ_MODEL':
                // alert(valore);
                this.modello = valore;
                break;
              case 'AIREQ_ADMIN_KEY':
                // alert(valore);
                this.chiaveAdmin = valore;

                // this.richiedeCredito();
                break;
              }
          });
        // }
      // } else {
        // alert('Read symbolic null');
      }
    }, error => {
      alert('Read symbolic: ' + error);
    });
  }

  ngOnInit(): void {        
    this.LeggeSimbolici();
    logConsole('AI: Entro in ngOnInit', new Date().toLocaleString());
  }

  nonDeveAggiornare = false;

  ngOnChanges(changes: SimpleChanges): void {
    logConsole('AI: Entro in ngOnChanges', changes, new Date().toLocaleString());

    let ricarica = false;
    let cambiato = '';
  
    if (changes['act_id']) {
      if (changes['act_id'].currentValue) {
        ricarica = true;
        cambiato += 'act_id;';
      }
    }
  
    if (changes['tc_run_id']) {
      if (changes['tc_run_id'].currentValue) {
        ricarica = true;
        cambiato += 'tc_run_id;';
      }
    }
  
    if (changes['tmsFrom']) {
      // // logConsole('Tms from ai: ', changes['tmsFrom'].currentValue);
      if (changes['tmsFrom'].currentValue) {
        ricarica = true;
        cambiato += 'tmsFrom;';
      }
    }
  
    if (changes['tmsTo']) {
      // // logConsole('Tms to ai: ', changes['tmsTo'].currentValue);
      if (changes['tmsTo'].currentValue) {
        ricarica = true;
        cambiato += 'tmsTo;';
      }
    }
  
    if (changes['tmrAttivo']) {
      // // logConsole('Tms to ai: ', changes['tmsTo'].currentValue);
      cambiato += 'tmrAttivo;';
      if (changes['tmrAttivo'].currentValue === 'SI') {
        // alert('Attivo timer');

        this.caricaQueries('tokens 1');
        /* if (!this.tmr) { // clearInterval(this.tmr); this.tmr = undefined; }
          this.tmr = setInterval(() => {
            this.caricaQueries('tokens 2');
          }, 10000);
        } */
      // } else {
        // alert('Disattivo timer');
      //   if (this.tmr) { clearInterval(this.tmr); this.tmr = undefined; }
      //   if (this.tmr2) { clearInterval(this.tmr2); this.tmr2 = undefined; }
      }
    }

    if (changes['tipologiaFrame']) {
      if (changes['tipologiaFrame'].currentValue === 'AE') {
        this.modalitaEventi = true;
      } else {
        this.modalitaEventi = false;
      }
      cambiato += 'tipologiaFrame;';
    }

    if (changes['arrivatoJson']) {
      const jsonRitornato = changes['arrivatoJson'].currentValue;
      logConsole('Json ritornato', jsonRitornato);
      if (jsonRitornato) {
        this.submitQuery2(jsonRitornato, false, 'HITL');
      }
      cambiato += 'arrivatoJson;';
    }

    if (changes['gestioneTemplate']) {
      if (changes['gestioneTemplate'].currentValue === true) {
        this.descrizione = '';
        this.title = '';
        this.prompt = '';
        this.prompt_dt = 'msg_list';
    
        // this.caricaTemplates();
      } else {

      }
      cambiato += 'gestioneTemplate;';
    }
  
    if (changes['datiCSV']) {
      // logConsole('Dati dentro template', changes['datiCSV']);
      this.descrizioneAggiunta = false;
      // this.datiCSV = changes['datiCSV'].currentValue;

      // logConsole('Prompt data', this.datiCSV.CSV.split('\n'));

      let messaggio = 'Data in prompt_data are provided as csv separated by ";". First row contains column header.\n' +
        'Hereafter the description of each column:\n';
      if (this.datiCSV && this.datiCSV.DATI) {
        this.datiCSV.DATI.forEach(element => {
          if (element.headerText && element.description) {
            messaggio += '\t' + element.headerText + ': ' + element.description + '\n';
            // logConsole('Elemento: ', element.headerText + ': ' + element.description);
          }
        });
        this.messaggioCSV = messaggio;
        // logConsole('Dati dentro template', this.datiCSV.DATI);
      } else {
        this.messaggioCSV = '';
      }
      cambiato += 'datiCSV;';
    }

    if (changes['ultimoTemplateSelezionatoPassato']) {
      // // logConsole('Ultimo template selezionato ripassato', this.ultimoTemplateSelezionatoPassato2);
      if (changes['ultimoTemplateSelezionatoPassato'].currentValue) {
        this.templateSelezionato = changes['ultimoTemplateSelezionatoPassato'].currentValue.view_cnf;
        const tm = setTimeout(() => {
          clearTimeout(tm);

          this.selezioneTemplateAI = [changes['ultimoTemplateSelezionatoPassato'].currentValue.ROW_ID];
          // alert('Selezione 1: ' + this.selezioneTemplate);
          this.selezioneRigaTemplate([changes['ultimoTemplateSelezionatoPassato'].currentValue], true);
        }, 1000);
      }
      cambiato += 'ultimoTSP;';
    }

    if (changes['caricamentoEventiInCorso']) {
      if (changes['caricamentoEventiInCorso'].currentValue === true) {
        this.caricamentoEventiInCorso2 = true;
      } else {
        const t1 = setTimeout(() => {
          clearTimeout(t1);
          
          this.caricamentoEventiInCorso2 = false;
        }, 2000);
      }
      cambiato += 'caricamentoEventiInCorso;';
    }

    if (changes['dimensioneSchermo']) {
      if (changes['dimensioneSchermo'].currentValue) {
        if (this.apertaGriglia2) {
          // alert('Aggiorno dimensione schermo: ' + changes['dimensioneSchermo'].currentValue);
          this.updateGraphSize();
        }
      }
    }

    if (ricarica && !this.nonDeveAggiornare) {
      // if (this.tmr) { clearInterval(this.tmr); this.tmr = undefined; }
      // if (this.tmr2) { clearInterval(this.tmr2); this.tmr2 = undefined; }

      const tmr = setTimeout(() => {
        clearTimeout(tmr);

        this.caricaQueries('onChanges (' + cambiato + ')');
      }, 1000);
    }

    if (this.nonDeveAggiornare){
      this.nonDeveAggiornare = false;
    }
  }

  richiedeTokens() {
    const myDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.openaiService.ritornaTokens(this.chiave, myDate)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      // this.esecuzioneQuery = false;
      // // logConsole(data);  // Visualizza la risposta dell'API nel console
      let tokensTotali = 0;
      let tokensRimanenti = 0;
      data.data.forEach(element => {
        const tokens = element.n_context_tokens_total;
        tokensTotali += tokens;

        tokensRimanenti = element.aggregation_timestamp;
      });
      this.statTokens = 'Tokens: ' + tokensTotali + '/' + tokensRimanenti;
    }, error => {
      console.error('Errore nella richiesta API', error);
    });
  }

  // forza = true: ignora i dati già in cache e interroga sempre il server (refresh delle voci pending)
  caricaQueries(daDove, forza = false) {
    const params = {
      v_cntx_id: this.sessionId,
      v_filter_status: null,
      v_caller_tag: null,
      v_tc_run_id: null,
      v_act_set_name_list: this.act_id,
      v_tms_from: this.tmsFrom,
      v_tms_to: this.tmsTo
    };
    const firmaParametri = JSON.stringify(params);

    // Riuso dei dati già caricati solo se arrivati proprio con questi parametri. Prima il confronto era con i parametri
    // registrati PRIMA della richiesta: se la risposta non arrivava (richiesta annullata chiudendo la scheda, errore,
    // risposta senza dati) la griglia restava vuota per sempre, oppure mostrava i dati di una richiesta precedente.
    if (!forza && ExternalUtilities.parametriDatiIA === firmaParametri && ExternalUtilities.datiIA && this.tmrAttivo !== 'SI') {
      logConsole('Riscrivo queries da ' + daDove, ExternalUtilities.parametriDatiIA, firmaParametri);
      // this.caricamentoDatiInCorso = true;
      if (ExternalUtilities.datiIA) {
        this.vecchioColumnProperty = JSON.stringify(ExternalUtilities.datiIA.ColumnProperty);
        this.datiGriglia = ExternalUtilities.datiIA;
        const t = setTimeout(() => {
          clearTimeout(t);
          // this.caricamentoDatiInCorso = false;

          this.controlloSeCiSonoPending(ExternalUtilities.datiIA, daDove + ' (dati già caricati)');
        }, 1000);
      // } else {
      //   this.caricamentoDatiInCorso = false;
      }
      return;
    }

    // Stessa richiesta già in corso da questa istanza: non serve rilanciarla
    if (this.richiestaQueriesInCorso === firmaParametri) {
      return;
    }
    this.richiestaQueriesInCorso = firmaParametri;
    ExternalUtilities.ultimiParametriCaricati = firmaParametri;

    logConsole('Carica queries da ' + daDove + '(query nuova)');
    this.caricamentoDatiInCorso = true;
    // alert('Carica righe da ' + daDove);
    // // logConsole('operator__login', Utils.serverPostRest, params);
    // this.datiGriglia = undefined;
    this.apiService.chiamataPost(this.Utils, 'aireq__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      this.caricamentoDatiInCorso = false;
      this.richiestaQueriesInCorso = undefined;
      // // logConsole(data);
      if (data && data.DataTable) {
        ExternalUtilities.datiIA = data;
        ExternalUtilities.parametriDatiIA = firmaParametri;
        this.elementidaScodare = new Array();
        if (this.datiGriglia !== undefined && this.datiGriglia.DataTable
          && this.datiGriglia !== 'empty grid' && data.DataTable && JSON.stringify(data.ColumnProperty) === this.vecchioColumnProperty) {
          this.datiGriglia.DataTable = data.DataTable;
          logConsole('Aggiorno i dati');
        } else {
          this.vecchioColumnProperty = JSON.stringify(data.ColumnProperty);
          this.datiGriglia = data;
          logConsole('CREO i dati');

          const tm = setTimeout(() => {
            clearTimeout(tm);

            this.effettuaAutoFit = !this.effettuaAutoFit;
          }, 100);
        }

        // Se ci sono voci pending si programma il prossimo aggiornamento (ogni 10 secondi finché ce ne sono).
        // Prima avveniva solo dopo l'invio di una investigation (tmrAttivo = 'SI').
        this.controlloSeCiSonoPending(data, daDove + ' (dati appena caricati)');
        // // logConsole('Elementi da scodare', this.elementidaScodare);

        /* if (this.elementidaScodare.length > 0) {
          this.qualeElementoStoScodando = 0;
          this.resultPrompt = '';
          this.resultRisposta = '';
          this.tempoTotale = 0;
          this.totalTokens = 0;
          this.totalSentTokens = 0;
          this.sommaRisposte = '';
          this.domandaAVideo = '';
          // this.prompt = '';   
        
          this.iniziaScodamento(false);
        } else {
          // // logConsole('Nessun elemento da scodare');
        } */
      }
    }, error => {
      // alert(error);
      // Senza questo, dopo un errore la griglia restava in caricamento e la richiesta non veniva più ripetuta
      this.caricamentoDatiInCorso = false;
      this.richiestaQueriesInCorso = undefined;
    });
  }

  // Firma dei parametri della richiesta aireq__grid in corso (per non lanciarne due uguali in parallelo)
  richiestaQueriesInCorso: string;

  // Timer del prossimo aggiornamento della griglia quando ci sono voci Pending/Processing
  private tmrPending;
  private aggiornamentoPendingAttivo = false;
  private readonly intervalloPending = 2000; // refresh ogni 2 secondi finché ci sono voci pending

  private programmaAggiornamentoPending() {
    if (this.tmrPending) {
      clearTimeout(this.tmrPending);
    }
    this.tmrPending = setTimeout(() => {
      this.tmrPending = undefined;
      if (this.visibile === false) {
        // tab nascosto: nessuna chiamata, si ricontrolla più tardi
        this.programmaAggiornamentoPending();
        return;
      }
      this.caricaQueries('Aggiornamento voci pending', true);
      // Con voci pending si aggiornano anche la griglia 2 e il grafo della riga selezionata
      this.aggiornaGriglia2PerPending();
    }, this.intervalloPending);
  }

  // Ricarica griglia 2 e grafo della riga selezionata (solo se la griglia 2 è aperta e non sta già caricando)
  private aggiornaGriglia2PerPending() {
    if (!this.apertaGriglia2 || !this.rigaSelezionata || this.caricamentoDatiInCorsoGriglia2) {
      return;
    }
    const riga = this.rigaSelezionata[0] ? this.rigaSelezionata[0] : this.rigaSelezionata;
    if (riga && riga.HASH_ID) {
      this.prendeGriglia2(riga.HASH_ID);
    }
  }

  controlloSeCiSonoPending(data, daDove) {
    logConsole('Controllo se ci sono pending', data, daDove);

    let ok = false;
    if (data && data.DataTable) {
      data.DataTable.forEach(element => {
        if (ok || element.STATUS === 'Processing' || element.STATUS === 'Pending') {
          ok = true;
        }
      });
    }
    if (!ok) {
      logConsole('NON ci sono pending. Blocco esecuzione timer');

      if (this.tmrPending) {
        clearTimeout(this.tmrPending);
        this.tmrPending = undefined;
      }
      // Il dettaglio della riga selezionata si aggiorna solo quando le voci pending sono appena terminate
      const appenaTerminati = this.aggiornamentoPendingAttivo || this.tmrAttivo === 'SI';
      this.aggiornamentoPendingAttivo = false;
      this.tmrAttivo = 'NO';

      if (appenaTerminati && this.rigaSelezionata) {
        this.resultRisposta = '';
        this.resultPrompt = '';
        this.tempoTotale = 0;
        this.totalTokens = 0;
        this.totalSentTokens = 0;
        this.sommaRisposte = '';    
        this.domandaAVideo = '';
        this.sommaReq = "";
        this.sommaPrompt = "";
        this.sommaRisposte = "";

        let hashId = '';
        if (this.rigaSelezionata && this.rigaSelezionata[0]) {
          hashId = this.rigaSelezionata[0].HASH_ID;
        } else {
          hashId = this.rigaSelezionata.HASH_ID;
        }

        let nodePath = '';
        if (this.rigaSelezionata && this.rigaSelezionata[0]) {
          nodePath = this.rigaSelezionata[0].NODE_PATH_LATEST;
        } else {
          nodePath = this.rigaSelezionata.NODE_PATH_LATEST;
        }

        this.iniziaScodamento(hashId, nodePath, false);
      }
      if (appenaTerminati) {
        // Ultimo aggiornamento di griglia 2 e grafo con lo stato finale delle voci
        this.aggiornaGriglia2PerPending();
      }
    } else {
      logConsole('Ci sono pending. Riprendo esecuzione timer');

      // Prima qui si richiamava subito caricaQueries, che con tmrAttivo 'NO' rileggeva la cache e, dopo 1 secondo,
      // tornava qui: un ciclo continuo senza mai chiedere i dati aggiornati al server
      this.aggiornamentoPendingAttivo = true;
      this.programmaAggiornamentoPending();
    }
  }

  sistemaStringaPerHTML(promptP, modalitaTesto) {
    let prompt = promptP;
      
    if (prompt && prompt !== null) {
      while (prompt.indexOf('"') > -1) {
        prompt = prompt.replace('"', '');
      }

      if (!modalitaTesto) {
        /* while (prompt.indexOf('\n') > -1) {
          prompt = prompt.replace('\n', '<br />');
        }
        while (prompt.indexOf('\r') > -1) {
          prompt = prompt.replace('\r', '');
        }
        while (prompt.indexOf('\\n') > -1) {
          prompt = prompt.replace('\\n', '<br />');
        }
        while (prompt.indexOf('\\r') > -1) {
          prompt = prompt.replace('\\r', '');
        } */
      } else {
        prompt = prompt.replace(/<br\s*\/?>/gi, "\n");
        prompt = prompt.replace(/\\n/g, '\n');

        prompt = prompt.replace(/&emsp;/gi, "\t");

        while (prompt.indexOf('§') > -1) {
          prompt = prompt.replace('§', '<br />');
        }
        // // logConsole('Urigheller', prompt)
      }
    }

    return prompt;
  }

  summary;
  summary2;
  summary_father_list;
  api_call;
  tipoResultPrompt = '';

  iniziaScodamento(hashID, nodePath, nonFareUpdate) {
    if (!hashID) {
      return;
    }
    if (!nodePath) {
      return;
    }

    const params = {
      v_cntx: this.sessionId,
      v_hash_id: hashID,
      v_node_path: nodePath
    };
    logConsole('Chiamata aireq_get', params);
    this.apiService.chiamataPost(this.Utils, 'aireq__get', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      logConsole('Ritorno get/answer', data);
      if (data.err_code > 0) {
        // alert(data.failure_reason);
      } else {
        this.titoloPerUpd = data.v_aireq.title;
        this.descrizionePerUpd = data.v_aireq.description;
        this.statusPerUpd = data.v_aireq.status;
        this.promptPerUpd = data.v_aireq.prompt;
        
        let summary = data.v_aireq.summary;
        if (summary && summary !== null) {
          summary = JSON.parse(summary);
        }
        this.summary = summary;
        this.summary2 = JSON.stringify(summary);

        let summary_father_list = data.v_aireq.summary_father_list;
        if (summary_father_list && summary_father_list !== null) {
          summary_father_list = JSON.parse(summary_father_list);
        }
        this.summary_father_list = summary_father_list;

        try {
          this.executionContext = JSON.parse(data.v_aireq.node_execution);
        } catch (e) {
          this.executionContext = data.v_aireq.node_execution;
        }
        this.referenceKnowledge = data.v_aireq.rag_best_match;

        let api_call = data.v_aireq.api_call;
        if (api_call && api_call !== null) {
          // api_call = JSON.parse(api_call);
        }
        this.api_call = api_call;

        // if (data.v_aireq.answer) {
          // this.resultRequest = data.v_aireq.req.request;
          let domanda = this.sistemaStringaPerHTML(data.v_aireq.prompt, true);
          // logConsole('Domanda 2', domanda);
          this.domandaAVideo = domanda;

          // domanda = data.v_aireq.prompt;

          let prompt = data.v_aireq.prompt_data;

          this.tipoResultPrompt = this.prendeTipoPrompt(prompt);
          if (this.tipoResultPrompt === 'json') {
            try {
              this.resultPrompt = JSON.parse('[' + prompt + ']');
              console.log('Prompt JSON 1', this.resultPrompt);
            } catch (e) {
              this.tipoResultPrompt = 'text';
              if (JSON.stringify(prompt).indexOf(';') === -1) {
                // logConsole('Prompt prima della decodifica', prompt);
                if (this.isBase64(prompt)) {
                  const testo = decodeURIComponent(escape(atob(prompt)));
                  prompt = JSON.stringify(testo);
                }
              }
              prompt = this.sistemaStringaPerHTML(prompt, true);
              this.resultPrompt = prompt;
              console.log('Prompt JSON 2', this.resultPrompt);
            }
          } else {
            if (JSON.stringify(prompt).indexOf(';') === -1) {
              // logConsole('Prompt prima della decodifica', prompt);
              if (this.isBase64(prompt)) {
                const testo = decodeURIComponent(escape(atob(prompt)));
                prompt = JSON.stringify(testo);
              }
            }
            prompt = this.sistemaStringaPerHTML(prompt, true);
            this.resultPrompt = JSON.parse(prompt);
            console.log('Prompt JSON 3', this.resultPrompt);
          }

          // // logConsole('Prompt', prompt);

          this.trovataRisposta = true;

          const tokens = data.v_aireq.cost;
          const tokensTotali = data.v_aireq.cost;
          this.totalTokens += tokensTotali;
          this.totalSentTokens += tokens;
          this.tempoTotale += 0;

          this.domandaDaFareAAI = domanda + ' ' + this.resultPrompt;
          
          // // logConsole(response);
          let risposta = data.v_aireq.answer;
          risposta = this.sistemaStringaPerHTML(risposta, false);

          // // logConsole('Risposta salvata:', risposta);

          if (this.sommaRisposte.indexOf(risposta) === -1) {
            this.sommaRisposte += risposta + "\n\n";
          }
          if (this.sommaPrompt.indexOf(prompt) === -1) {
            this.sommaPrompt += prompt + "\n\n";
          }
          if (this.sommaReq.indexOf(data.v_aireq.prompt) === -1) {
            this.sommaReq += data.v_aireq.prompt + '\n\n';
          }

          this.titoloPerUpd = data.v_aireq.title;
          this.descrizionePerUpd = data.v_aireq.description;
          this.statusPerUpd = data.v_aireq.status;
          this.promptPerUpd = data.v_aireq.prompt;

          if (data.v_aireq.vote && data.v_aireq.vote !== null) {
            this.voto = data.v_aireq.vote;
          } else {
            this.voto = -1;
          }

          if (data.v_aireq.comment && data.v_aireq.comment !== null) {
            this.commento = data.v_aireq.comment;
          } else {
            this.commento = '';
          }

          // this.domanda += this.prompt + "\n\n";
          // alert('1: ' + this.domanda + '\n' + this.prompt);

          // // logConsole('Non fare update in scodamento:', nonFareUpdate);
          /* if (!nonFareUpdate) {
            // alert('Aggiorna status 1');
            this.aggiornaStatus(hashID, 'Processing', nonFareUpdate);
          } else { */
            this.domandaAVideo = this.sistemaStringaPerHTML(this.sommaReq, true);
            // logConsole('Domanda 3', this.sommaReq, this.domandaAVideo);
            this.resultPrompt = this.sommaPrompt;
              
            this.tipoResultPrompt = this.prendeTipoPrompt(this.sommaPrompt);
            if (this.tipoResultPrompt === 'json') {
              try {
                this.resultPrompt = JSON.parse(this.sommaPrompt);
                console.log('Prompt JSON 1', this.resultPrompt);
              } catch (e) {
                this.tipoResultPrompt = 'text';
                if (JSON.stringify(this.sommaPrompt).indexOf(';') === -1) {
                  // logConsole('Prompt prima della decodifica', prompt);
                  if (this.isBase64(this.sommaPrompt)) {
                    const testo = decodeURIComponent(escape(atob(this.sommaPrompt)));
                    this.sommaPrompt = JSON.stringify(testo);
                  }
                }
                this.sommaPrompt = this.sistemaStringaPerHTML(this.sommaPrompt, true);
                this.resultPrompt = this.sommaPrompt;
                console.log('Prompt JSON 2', this.resultPrompt);
              }
            } else {
              if (JSON.stringify(this.sommaPrompt).indexOf(';') === -1) {
                // logConsole('Prompt prima della decodifica', prompt);
                if (this.isBase64(this.sommaPrompt)) {
                  const testo = decodeURIComponent(escape(atob(this.sommaPrompt)));
                  this.sommaPrompt = JSON.stringify(testo);
                }
              }
              this.sommaPrompt = this.sistemaStringaPerHTML(this.sommaPrompt, true);
              this.resultPrompt = JSON.parse(this.sommaPrompt);
              console.log('Prompt JSON 3', this.resultPrompt);
            }


            while (this.sommaRisposte.indexOf('```html') > -1) {
              this.sommaRisposte = this.sommaRisposte.replace('```html', '');
            }
            while (this.sommaRisposte.indexOf('```') > -1) {
              this.sommaRisposte = this.sommaRisposte.replace('```', '');
            }
            this.resultRisposta = this.sommaRisposte;
            // // logConsole('Lunghezza risposta 1', this.resultRisposta.length, this.sommaRisposte.length, data.v_aireq.answer);
          // }
        // } else {
          // // logConsole('Non trovata risposta. Chiedo lumi a OpenAI. Non fare update ', nonFareUpdate);
          /* this.trovataRisposta = false;

          // alert('Aggiorna status 2');
          // this.prompt = domanda + ' ' + this.resultPrompt;

          if (data && data.v_aireq && data.v_aireq.prompt) {
            // // logConsole('Domanda: ', data.v_aireq.req);
            const domanda = this.sistemaStringaPerHTML(data.v_aireq.prompt, true);
            // logConsole('Domanda 1', domanda);
            this.domandaAVideo = domanda;

            // this.domandaAVideo = data.v_aireq.prompt;
            let prompt = JSON.stringify(data.v_aireq.prompt_data);
            prompt = this.sistemaStringaPerHTML(prompt, true);
            this.resultPrompt = prompt;

            this.domandaDaFareAAI = data.v_aireq.prompt + ' ' + data.v_aireq.prompt_data; // Modificare il nome del campo
            // alert('2: ' + this.domanda + '\n' + this.prompt);

            this.aggiornaStatus(hashID, 'Processing', nonFareUpdate);
          } else {
            alert('Invalid return from aireq__get');
          } */
        // }
      }
    }, error => {
      // alert(error);
    });
  }

  prendeTipoPrompt(prompt) {
    if (((prompt.indexOf('[') > -1 && prompt.indexOf(']') > -1) || (prompt.indexOf('{') > -1 && prompt.indexOf('}') > -1)) && prompt.indexOf(':') > -1) {
      return 'json';
    } else {
      return 'text';
    }
  }

  isBase64(str) {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  }

  aggiornaStatus(hashID, status, nonFareUpdate) {
    return;

    if (!this.trovataRisposta) {
      // // logConsole('Aggiorna status. Non trovata risposta. Non faccio update: ', nonFareUpdate);

      if (nonFareUpdate) {
        // alert('No, qui no!');
        this.callOpenAiAPI(hashID, false, false);
        return;
      }
    }

    // alert('Status 2: ' + status);
    // return;

    const params = {
      v_cntx: this.sessionId,
      v_hash_id: hashID,
      v_status: status,
      v_answer: this.answer,
      v_description: this.descrizione,
      v_title: this.titolo,
      // v_cost: this.cost,
      // v_duration: this.duration
    };
    this.statusPerUpd = status;
    // // logConsole('Aggiorno messaggio: ', params);

    // // logConsole('operator__login', Utils.serverPostRest, params);
    this.apiService.chiamataPost(this.Utils, 'aireq_status__upd', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      // // logConsole('Ritorno aggiornamento status: ', data);
      if (data) {
        // Invoco la chiamata ad openAI
        if (!this.domandaDaFareAAI) {
          alert('Prompt vuoto 2');
          return;
        }
        this.callOpenAiAPI(hashID, true, false);
      }
    }, error => {
      // alert(error);
    });
  }

  callOpenAiAPI(hashID, prosegueScodamento, esegueInsert): void {
    return;

    const systemRole = "You are an expert in telecommunication, especially in LTE Radio Resource Control (RRC) and radio access networks.";
    const domanda = this.domandaDaFareAAI;

    this.esecuzioneQuery = true;
    const inizioTempo = new Date().getTime();

    if (!this.chiave || this.chiave === '') {
      this.esecuzioneQuery = false;
      // // logConsole('Chiave inesistente:', this.chiave);
      alert('Key not valid: ' + this.chiave);
    } else {
      if (!this.modello || this.modello === '') {
        this.esecuzioneQuery = false;
        // // logConsole('Modello inesistente:', this.modello);
        alert('Model not valid: ' + this.modello);
      } else {
        // this.modello = 'gpt-4';
        this.openaiService.generateText(this.chiave, this.modello, domanda, systemRole)
        .pipe(takeUntil(this.destroy$))
        .subscribe(response => {
          this.esecuzioneQuery = false;
          
          const fine = new Date().getTime();
          const differenza = fine - inizioTempo;
          this.tempoTotale += differenza

          const tokens = response.usage.prompt_tokens;
          const tokensTotali = response.usage.total_tokens;
          this.totalTokens += tokensTotali;
          this.totalSentTokens += tokens;

          // // logConsole(response);
          // // logConsole('Response from OpenAI:', this.result);

          let risposta = response.choices[0].message.content;
          risposta = this.sistemaStringaPerHTML(risposta, false);
          // // logConsole('Open AI. Proseguo scodamento', prosegueScodamento, risposta);
          if (prosegueScodamento) {
            this.sommaRisposte += risposta + "\n\n";
            this.sommaPrompt += this.domandaDaFareAAI + "\n\n"
            this.sommaReq += this.domandaAVideo + '\n\n';

            this.statusPerUpd = 'Done';

            // this.updateRow(hashID, risposta, tokensTotali, differenza);
          } else {
            /* this.resultPrompt += risposta;
            this.resultRequest += risposta;
            this.domanda += this.prompt;

            this.statistiche = "Tokens sents: " + tokens + " - " +
              "Total Tokens: " + tokensTotali + " - Total Time: " + differenza; */

              while (risposta.indexOf('```html') > -1) {
                risposta = risposta.replace('```html', '');
              }
              while (risposta.indexOf('```') > -1) {
                risposta = risposta.replace('```', '');
              }
              this.resultRisposta = risposta;
            // // logConsole('Lunghezza risposta 3', this.resultRisposta.length);
            // this.resultPrompt = this.prompt;
            // this.resultRequest = this.requestSingolo;
    
            // this.prompt = domanda + ' ' + this.resultPrompt;
      
            if (esegueInsert) {
              this.esegueInsert('HITL');
            }
          }
        }, error => {
          this.esecuzioneQuery = false;
          console.error('Error calling OpenAI API:', error);
          // // logConsole('Errore', error.error.error.message);

          this.statusPerUpd = 'Failed';

          const risposta = error.error.error.message;
          const tokens = 0;
          const differenza = 0;

          this.sommaRisposte += risposta + "\n\n";
          this.sommaPrompt += this.domandaDaFareAAI + "\n\n"
          this.sommaReq += this.domandaAVideo + '\n\n';

          // this.updateRow(hashID, risposta, tokens, differenza);
        });
      }
    }
  }

  esegueInsert(modalita) {
    if (!this.act_id || !this.hashIdTemplate) {
      return;
    }

    const jsonRichiesta1 = this.promptDataSingolo;
    const jsonRichiesta2 = this.promptSingolo;

    let j1 = JSON.stringify(jsonRichiesta2);
    let j2 = JSON.stringify(jsonRichiesta1);
    if (modalita === 'HOTL') {
      j2 = null;
    }

    let tmsStart = null;
    let tmsEnd = null;

    let codice = '';
    if (this.mappa_o_grafico === 'TC') {
      codice = this.tc_run_code;
    } else {
      codice = this.act_id;
    }

    let params = '{';
    params += '"v_cntx": "' + this.sessionId + '",';
    params += '"v_title": "' + this.titolo + '",';
    params += '"v_description": "' + this.descrizione + '",';
    params += '"v_act_set_name_list": "' + codice + '",';
    params += '"v_tc_run_id": null,';
    params += '"v_prompt": "' + j1 + '", ';
    params += '"v_prompt_data": "' + j2 + '", ';
    params += '"v_tms_from": "' + tmsStart + '", ';
    params += '"v_tms_to": "' + tmsEnd + '", ';
    params += '"v_exec_mode": "' + modalita + '", ';
    params += '"v_aireq_template_hash_id": "' + this.hash_id + '", ';
    params += '"v_api_call": ' + JSON.stringify(this.apiCall) + '", ';
    params += '"v_llm_profile_id": ' + this.llm_profile_id;
    params += '"v_investigation_goal": "' + this.investigation + '",';
    params += '"v_expected_information_gain": null';
    params += '}';

    // // logConsole('Insert', params);
    this.domandaAVideo = '';
    // this.prompt = '';
    this.apiService.chiamataPost(this.Utils, 'aireq__ins', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        if (data.v_err_code > 0) {
          alert(data.v_failure_reason);
        } else {
          if (this.ricaricaQuery) {
            this.ricaricaQuery = false;
            this.caricaQueries('tokens');
          }
        }
      }
    }, error => {
      // alert(error);
    });
  }

  commento;
  voto;
  datiVoto = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' },
    { id: 5, name: '5' }
  ];

  selectView(e) {
    logConsole('Scelta', e);
    this.voto = e.id;
    this.updateRow();
  }

  // Stella sotto il mouse (0 = nessuna): serve solo per l'anteprima del voto
  votoEvidenziato = 0;

  // Clic su una stella: imposta il voto; un clic sulla stella già scelta toglie il voto (-1 = nessun voto)
  impostaVoto(stella: number) {
    this.voto = +this.voto === stella ? -1 : stella;
    this.votoEvidenziato = 0;
    this.updateRow();
  }

  updateRow() {
    if (!this.rigaSelezionata) {
      return;
    }

    logConsole('Update row. Riga selezionata: ', this.rigaSelezionata, this.voto, this.commento);
    
    // alert('Status 1: ' + this.statusPerUpd + ' - ' + this.status);
    // return;

    let hashId = '';
    if (this.rigaSelezionata && this.rigaSelezionata[0]) {
      hashId = this.rigaSelezionata[0].HASH_ID;
    } else {
      hashId = this.rigaSelezionata.HASH_ID;
    }

    const params = {
      v_cntx: this.sessionId,
      v_hash_id: hashId,
      v_answer: null,
      v_cost: null,
      // v_duration: null,
      v_title: null,
      v_status: null,
      v_prompt: null,
      v_description: null,
      v_openai_batch_id: null,
      v_comment: this.commento ? this.commento : '',
      v_vote: this.voto === -1 ? null : this.voto,
      v_node_path: this.node_path
    };
    // // logConsole('Update row: ', params);

    /* this.domandaAVideo = this.sommaReq;
    this.resultPrompt = this.sommaPrompt;
    this.resultRisposta = this.sommaRisposte;
    return; */

    // // logConsole('operator__login', Utils.serverPostRest, params);
    this.apiService.chiamataPost(this.Utils, 'aireq__upd', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        // // logConsole('Ritorno update row: ', data);

        /* this.qualeElementoStoScodando++;
        if (this.qualeElementoStoScodando < this.elementidaScodare.length) {
          this.iniziaScodamento(false);
        } else {
          // alert('Per il momento disabilito 1');
          // return;

          while (this.sommaRisposte.indexOf('```html') > -1) {
            this.sommaRisposte = this.sommaRisposte.replace('```html', '');
          }
          while (this.sommaRisposte.indexOf('```') > -1) {
            this.sommaRisposte = this.sommaRisposte.replace('```', '');
          }
          this.resultRisposta += this.sommaRisposte;
          // // logConsole('Lunghezza risposta 2', this.resultRisposta.length);
          // this.domanda += this.prompt;
          // this.statistiche = "Tokens sents: " + this.totalSentTokens + " - " +
          //   "Total Tokens: " + this.totalTokens + " - Total Time: " + this.tempoTotale; */

          // this.caricaQueries();
        // }
      }
    }, error => {
      // alert(error);
    });
  }

  clickSelezione2(e) {
    let rigaSelezionata2;

    if (e.dati && e.dati.length > 0) {
      rigaSelezionata2 = e.dati;
    } else {
      rigaSelezionata2 = [e];
    }

    this.node_path_father_list_riga = '';
    this.node_path_father_list = '';
    // logConsole('Riga selezionata', e, this.rigaSelezionata2);
    if (rigaSelezionata2.length > 0) {
      rigaSelezionata2.forEach(element => {
        this.node_path_father_list += element.NODE_PATH + ',';
      });
    } else {
      this.node_path_father_list += this.rigaSelezionata[0].NODE_PATH + ',';
    }
    if (this.node_path_father_list.length > 0) {
      this.node_path_father_list = this.node_path_father_list.substring(0, this.node_path_father_list.length - 1);
    }

    logConsole('Check selezionata 2: ', this.rigaSelezionata2, this.node_path_father_list);
  }

  ultimoClick2 = '';
  rigaSelezionata2;

  clickSelezioneRiga2(e) {
    let controllo = '';
    if (e.dati && e.dati.length > 0) {
      e.dati.forEach(element => {
        controllo += element.HASH_ID + e.NODE_PATH;
      });
    } else {
      controllo = e.HASH_ID + e.NODE_PATH;      
    }
    if (controllo === this.ultimoClick2) {
      logConsole('Esco per doppio click', this.ultimoClick2);
      return;
    }
    this.ultimoClick2 = controllo;

    if (e.dati && e.dati.length > 0) {
      this.rigaSelezionata2 = e.dati;
    } else {
      this.rigaSelezionata2 = [e];
    }
    
    logConsole('Riga selezionata', e, this.rigaSelezionata2);
    
    this.caricaTemplates(e.HASH_ID, e.NODE_PATH);
    this.eseguiQuery();
  }

  eseguiQuery() {
    this.node_path_father_list = '';
    this.node_path_father_list_riga = '';

    if (this.rigaSelezionata2.length > 0) {
      this.rigaSelezionata2.forEach(element => {
        this.node_path_father_list_riga += element.NODE_PATH + ',';
      });
    } else {
      this.node_path_father_list_riga += this.rigaSelezionata[0].NODE_PATH + ',';
    }
    if (this.node_path_father_list_riga.length > 0) {
      this.node_path_father_list_riga = this.node_path_father_list_riga.substring(0, this.node_path_father_list_riga.length - 1);
    }

    // logConsole('Riga selezionata 2: ', this.rigaSelezionata2, this.node_path_father_list);

    this.elementidaScodare = new Array();
    this.elementidaScodare.push(this.rigaSelezionata2);

    this.qualeElementoStoScodando = 0;
    this.resultRisposta = '';
    this.resultPrompt = '';
    this.tempoTotale = 0;
    this.totalTokens = 0;
    this.totalSentTokens = 0;
    this.sommaRisposte = '';    
    this.domandaAVideo = '';
    this.sommaReq = "";
    this.sommaPrompt = "";
    this.sommaRisposte = "";
    this.node_path = this.rigaSelezionata2[0].NODE_PATH;
    this.hash_id = this.rigaSelezionata2[0].HASH_ID;

    this.iniziaScodamento(this.rigaSelezionata2[0].HASH_ID, this.rigaSelezionata2[0].NODE_PATH, false);
  }

  ultimoClick = '';

  clickSelezione(e) {    
    if (e.dati && e.dati.length > 0) {
      this.rigaSelezionata = e.dati;
    } else {
      this.rigaSelezionata = [e];
    }

    /* if (this.rigaSelezionata[0].HASH_ID === this.ultimoClick) {
      logConsole('Esco per doppio click', this.ultimoClick);
      return;
    }
    this.ultimoClick = this.rigaSelezionata[0].HASH_ID; */

    this.node_path_father_list = '';
    this.chatMode1 = '';
    this.hashIdTemplate = '';
    this.llm_profile_id = '';

    logConsole('Riga selezionata: ', this.rigaSelezionata, this.node_path_father_list);

    this.elementidaScodare = new Array();
    this.elementidaScodare.push(this.rigaSelezionata);

    this.qualeElementoStoScodando = 0;
    this.resultRisposta = '';
    this.resultPrompt = '';
    this.tempoTotale = 0;
    this.totalTokens = 0;
    this.totalSentTokens = 0;
    this.sommaRisposte = '';    
    this.domandaAVideo = '';
    this.sommaReq = "";
    this.sommaPrompt = "";
    this.sommaRisposte = "";
    this.node_path = this.rigaSelezionata[0].NODE_PATH_LATEST;
    this.hash_id = this.rigaSelezionata[0].HASH_ID;
    
    this.caricaTemplates(this.hash_id, this.node_path);
    this.prendeGriglia2(this.rigaSelezionata[0].HASH_ID);

    this.leggeChatMode();

    /* let nonFareUpdate = true;
    if (e[0].STATUS === 'Pending') {
      nonFareUpdate = false;
    }
    this.iniziaScodamento(nonFareUpdate); */
    this.iniziaScodamento(this.rigaSelezionata[0].HASH_ID, this.rigaSelezionata[0].NODE_PATH_LATEST, false);

    const t = setTimeout(() => {
      clearTimeout(t);

      this.updateGraphSize2();
    }, 500);
  }

  testoDettaglioEventi;
  dimeJsonWindow;
  scatenaEventoPerRitornoJson;
  caricamentoDatiInCorsoGriglia2 = false;
  chiSonoClickJson = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  vecchioColumnProperty2 = '';

  private ultimaFirmaGriglia2 = '';

  prendeGriglia2(hashID) {
    if (!this.apertaGriglia2) {
      return;
    }

    this.chiSonoClickJson[this.NumeroFrame] = 'F' + this.NumeroFrame + ';P' + this.frameAttivo + ';' + new Date().toString();
    this.caricamentoDatiInCorsoGriglia2 = true;

    const params = {
      v_cntx_id: this.sessionId,
      v_caller_tag: this.chiSonoClickJson[this.NumeroFrame],
      v_hash_id: hashID
    };

    // // logConsole('operator__login', Utils.serverPostRest, params);
    this.apiService.chiamataPost(this.Utils, 'aireq_msg__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      ExternalUtilities.checkRitornoChiamata(this, this.Utils, data);

      this.caricamentoDatiInCorsoGriglia2 = false;

      if (!this.controllaRitornoChiamata(this, data, 'ClickJSON')) {
        return;
      }

      if (data) {
        logConsole('Ritorno messaggi per hashID ' + hashID, data);
        let ok = false;

        data.DataTable.forEach(element => {
          if (ok || element.STATUS === 'Processing' || element.STATUS === 'Pending') { // Mettere il nome del campo giusto
            ok = true;
          }
        });
        if (!ok) {
          if (this.tmr2) { 
            clearInterval(this.tmr2); 
          }
        }

        // Dati identici a quelli già mostrati (es. aggiornamento periodico senza novità): non si ridisegnano griglia e
        // grafo, così il grafo non rifà il layout perdendo zoom e nodi spostati a mano
        const firma = hashID + '|' + JSON.stringify(data.DataTable);
        if (this.datiGriglia2 && this.datiGriglia2 !== 'empty grid' && firma === this.ultimaFirmaGriglia2) {
          return;
        }
        this.ultimaFirmaGriglia2 = firma;

        // Prima qui si controllava datiGriglia (griglia 1) invece di datiGriglia2
        if (this.datiGriglia2 !== undefined && this.datiGriglia2.DataTable
          && this.datiGriglia2 !== 'empty grid' && data.DataTable && JSON.stringify(data.ColumnProperty) === this.vecchioColumnProperty2) {
          this.datiGriglia2.DataTable = data.DataTable;
          logConsole('Aggiorno i dati');
        } else {
          this.vecchioColumnProperty2 = JSON.stringify(data.ColumnProperty);
          this.datiGriglia2 = data;
          logConsole('CREO i dati');

          const tm = setTimeout(() => {
            clearTimeout(tm);

            this.effettuaAutoFit2 = !this.effettuaAutoFit2;
          }, 100);
        }

        this.creaAlbero();
      }
    }, error => {
      this.caricamentoDatiInCorsoGriglia2 = false;
      // alert(error);
    });
  }

  // Icona che rappresenta lo stato di un nodo del grafo (percorso sotto Utils.linkIcone; le gif sono animate).
  // Per cambiare un'icona o aggiungere uno stato basta modificare questa tabella.
  private static readonly ICONE_STATO_NODO: { stati: string[], icona: string }[] = [
    { stati: ['PROCESSING', 'RUNNING'], icona: '/icons/Processing.gif' },
    { stati: ['PENDING', 'WAITING', 'QUEUED'], icona: '/gif/wait.gif' },
    { stati: ['FAILED', 'ERROR', 'ABORTED', 'ABORT'], icona: '/icons/Failed.png' },
    { stati: ['COMPLETED', 'DONE', 'SUCCESS', 'OK', 'FINISHED'], icona: '/icons/check-circle_white.png' },
  ];

  iconaStatoNodo(stato): string {
    if (!stato || !this.Utils || !this.Utils.linkIcone) {
      return undefined;
    }
    const s = String(stato).trim().toUpperCase();
    const voce = AIComponent.ICONE_STATO_NODO.find(v => v.stati.indexOf(s) > -1);
    return voce ? this.Utils.linkIcone + voce.icona : undefined;
  }

  // Icona di una cella con le stesse regole di AntsGridLib: colonna con Icon = 'icons' / 'flags' (immagine
  // <cartella>/<valore>.png) oppure con IconName (nome del file preso dal campo indicato).
  iconaDaGriglia(colonna, riga): string {
    if (!colonna || !riga || !this.Utils || !this.Utils.linkIcone || !riga[colonna.key]) {
      return undefined;
    }
    if (colonna.IconName) {
      const nomeFile = riga[colonna.IconName];
      return nomeFile ? this.Utils.linkIcone + '/icons/' + nomeFile : undefined;
    }

    const flags = String(colonna.Icon).toUpperCase().indexOf('FLAGS') > -1;
    let nome = String(riga[colonna.key]);
    if (nome.indexOf('***') > -1) {
      nome = nome.substring(nome.indexOf('***') + 3);
      nome = nome.substring(nome.indexOf('***') + 3);
    }
    if (flags) {
      nome = nome.replace('PORT ', '');
      if (nome.indexOf('-') > -1) {
        nome = nome.substring(0, nome.indexOf('-'));
      }
    }
    // Come nella griglia: un valore che finisce con una cifra non ha icona
    if (/[0-9]$/.test(nome)) {
      return undefined;
    }
    return this.Utils.linkIcone + (flags ? '/flags/' : '/icons/') + nome + '.png';
  }

  // Caratteri mostrati sull'arco; la descrizione completa compare al passaggio del mouse
  private static readonly LUNGHEZZA_ETICHETTA_ARCO = 30;

  // Valore di un campo della riga senza badare a maiuscole/minuscole (es. selection_account / SELECTION_ACCOUNT)
  campoRiga(riga, nome: string): string {
    if (!riga) {
      return '';
    }
    // Confronto senza maiuscole, spazi e trattini: INVESTIGATION_GOAL trova anche 'Investigation Goal'
    const normalizza = (k: string) => k.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cercato = normalizza(nome);
    const chiave = Object.keys(riga).find(k => normalizza(k) === cercato);
    const valore = chiave !== undefined ? riga[chiave] : undefined;
    return valore === undefined || valore === null ? '' : String(valore).trim();
  }

  // Testo abbreviato per l'arco (il testo completo va nel tooltip)
  abbreviaEtichetta(testo: string): string {
    if (!testo) {
      return '';
    }
    const unaRiga = testo.replace(/\s+/g, ' ');
    return unaRiga.length > AIComponent.LUNGHEZZA_ETICHETTA_ARCO
      ? unaRiga.substring(0, AIComponent.LUNGHEZZA_ETICHETTA_ARCO - 1).trim() + '…'
      : unaRiga;
  }

  // Punto dell'arco a una frazione t del percorso (0 = inizio, 1 = fine): 0.25 per la descrizione in uscita,
  // 0.75 per quella in entrata
  puntoSuArco(link, t: number): { x: number, y: number } {
    const p = link && link.points;
    if (!p || p.length === 0) {
      return { x: 0, y: 0 };
    }
    if (p.length === 2) {
      // Stessa curva disegnata da percorsoArco (Bézier con tangenti verticali)
      const [a, b] = p;
      const m = (a.y + b.y) / 2;
      const u = 1 - t;
      return {
        x: u * u * u * a.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * b.x,
        y: u * u * u * a.y + 3 * u * u * t * m + 3 * u * t * t * m + t * t * t * b.y
      };
    }
    // Percorso di dagre con più punti: posizione per lunghezza lungo la spezzata
    let totale = 0;
    for (let i = 1; i < p.length; i++) {
      totale += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
    }
    let resto = totale * t;
    for (let i = 1; i < p.length; i++) {
      const tratto = Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
      if (resto <= tratto && tratto > 0) {
        const f = resto / tratto;
        return { x: p[i - 1].x + (p[i].x - p[i - 1].x) * f, y: p[i - 1].y + (p[i].y - p[i - 1].y) * f };
      }
      resto -= tratto;
    }
    return p[p.length - 1];
  }

  creaAlbero() {
    if (!this.datiGriglia2) {
      this.nodes = new Array();
      this.links = new Array();
      return;
    }

    const nodi = new Array();
    const padri = new Array();

    // Colonne della griglia che mostrano un'icona: quella di STATUS (se c'è) va a destra del nodo al posto della
    // tabella ICONE_STATO_NODO, la prima delle altre va a sinistra
    const colonneIcona = (this.datiGriglia2.ColumnProperty || [])
      .filter(c => c && c.key && c.Icon && c.Icon !== 'ICON_TRACE');
    const colonnaStato = colonneIcona.find(c => c.key === 'STATUS');
    const colonnaSinistra = colonneIcona.find(c => c.key !== 'STATUS');

    this.datiGriglia2.DataTable.forEach(element => {
      if (element) {
        nodi.push({
          id: element.NODE_PATH,
          // Ultima riga del nodo: la valutazione dell'obiettivo al posto dello stato (lo stato resta nell'icona a destra)
          label: element.NODE_PATH + "\n" + element.TITLE + "\n" + this.campoRiga(element, 'GOAL_ASSESSMENT'),
          // Valutazione 'inconclusive': il nodo viene sottolineato in rosso
          inconcludente: this.campoRiga(element, 'GOAL_ASSESSMENT').toUpperCase() === 'INCONCLUSIVE',
          icona: (colonnaStato && this.iconaDaGriglia(colonnaStato, element)) || this.iconaStatoNodo(element.STATUS),
          iconaSinistra: this.iconaDaGriglia(colonnaSinistra, element),
          titoloIconaSinistra: colonnaSinistra ? element[colonnaSinistra.key] : '',
          riga: element
        });
        // Gli archi arrivano dai nodi che hanno lanciato questo nodo (lista separata da virgole)
        padri.push(element.NODE_PATH_LAUNCHER_LIST);
      }
    });

    const idNodi = new Set(nodi.map(n => n.id));
    const nodiPerId = new Map(nodi.map(n => [n.id, n]));
    const links = new Array();
    let indice = 0;
    let indice2 = 0;

    nodi.forEach(element => {
      if (element) {
        if (padri[indice] && padri[indice] !== null) {
          const listaPadri = String(padri[indice]).split(',');
          listaPadri.forEach(element2 => {
            const sorgente = element2.trim();
            // Si scartano voci vuote (es. virgola finale) e nodi non presenti nella griglia: un arco verso un nodo
            // inesistente farebbe creare a dagre un nodo senza dimensioni
            if (!sorgente || !idNodi.has(sorgente)) {
              if (sorgente) {
                logConsole('Arco scartato: nodo lanciatore non presente', sorgente, '->', element.id);
              }
              return;
            }
            indice2++;
            // Descrizioni dell'arco: in uscita dal nodo di partenza la sua CONCLUSION (scritta vicino all'inizio),
            // in entrata nel nodo di arrivo il suo INVESTIGATION_GOAL (scritto vicino alla fine)
            const nodoPartenza = nodiPerId.get(sorgente);
            const uscita = this.campoRiga(nodoPartenza && nodoPartenza.riga, 'CONCLUSION');
            const entrata = this.campoRiga(element.riga, 'INVESTIGATION_GOAL');
            const tooltip = [
              uscita ? 'Conclusion: ' + uscita : '',
              entrata ? 'Investigation goal: ' + entrata : ''
            ].filter(t => t).join('\n\n');
            links.push({
              id: 'Nodo' + indice2,
              source: sorgente,
              target: element.id,
              label: '',
              uscita: uscita,
              uscitaBreve: this.abbreviaEtichetta(uscita),
              entrata: entrata,
              entrataBreve: this.abbreviaEtichetta(entrata),
              tooltip: tooltip
            });
          });
        } // else {
        //   indice2++;
        //   links.push({ id: 'Nodo' + indice2, source: element.id, target: '', label: ''});
        // }
        indice++;
      }
    });

    // Nodi finali (senza archi in uscita): la loro CONCLUSION non comparirebbe su nessun arco, quindi si scrive
    // sotto il nodo, abbreviata, con il testo completo nel tooltip
    // Allo stesso modo i nodi iniziali (senza archi in entrata) mostrano sopra il nodo il loro INVESTIGATION_GOAL
    const conArchiInUscita = new Set(links.map(l => l.source));
    const conArchiInEntrata = new Set(links.map(l => l.target));
    nodi.forEach(n => {
      if (n && !conArchiInUscita.has(n.id)) {
        const conclusione = this.campoRiga(n.riga, 'CONCLUSION');
        n.conclusioneFinale = conclusione;
        n.conclusioneFinaleBreve = this.abbreviaEtichetta(conclusione);
      }
      if (n && !conArchiInEntrata.has(n.id)) {
        const obiettivo = this.campoRiga(n.riga, 'INVESTIGATION_GOAL');
        n.obiettivoIniziale = obiettivo;
        n.obiettivoInizialeBreve = this.abbreviaEtichetta(obiettivo);
      }
    });

    let nodi2 = nodi.map(n => ({
      ...n,
      dimension: {
        width: n.label.width * 20,
        height: ((n.label.split('\n').length) + 1) * 20
      }
    }));

    logConsole('Nodi', nodi2);
    logConsole('Links', links);

    this.nodes = JSON.parse(JSON.stringify(nodi2));
    this.links = JSON.parse(JSON.stringify(links));
  }

  apertaGriglia2 = false;
  dimeGriglia1 = 100;
  dimeGriglia2 = 0;

  gestioneGriglia2() {
    this.apertaGriglia2 = !this.apertaGriglia2;

    if (this.apertaGriglia2) {
      this.dimeGriglia1 = 50;
      this.dimeGriglia2 = 50;
      if (this.rigaSelezionata) {
        if (this.rigaSelezionata[0]) {
          this.prendeGriglia2(this.rigaSelezionata[0].HASH_ID);
        } else {
          this.prendeGriglia2(this.rigaSelezionata.HASH_ID);
        }
      }
    } else {
      this.dimeGriglia1 = 100;
      this.dimeGriglia2 = 0;
    }

    logConsole('Griglia2', this.apertaGriglia2, this.dimeGriglia1, this.dimeGriglia2);
  }

  refreshGriglia2(e, r) {
    // this.vecchioFileHist = '';
    if (r === true) {
      this.datiGriglia2 = undefined;
    }

    let hashId = '';
    if (this.rigaSelezionata2 && this.rigaSelezionata2[0]) {
      hashId = this.rigaSelezionata2[0].HASH_ID;
    } else {
      hashId = this.rigaSelezionata2.HASH_ID;
    }
    this.prendeGriglia2(hashId);
  }

  refreshGriglia(e, r) {
    // this.vecchioFileHist = '';
    ExternalUtilities.ultimiParametriCaricati = '';
    ExternalUtilities.datiIA = undefined;
    ExternalUtilities.parametriDatiIA = '';
    this.richiestaQueriesInCorso = undefined;

    if (r === true) {
      this.datiGriglia = undefined;
    }
    this.caricaQueries('refresh');
  }

  righeDaEliminare;
  qualeRigaStoEliminando = 0;

  eliminaRiga(e) {
    logConsole('Delete: ', e);
    this.righeDaEliminare = e;
    this.qualeRigaStoEliminando = 0;

    // if (confirm('Do you want to delete the selected query?')) {
      this.eliminaRigaFisica(this.righeDaEliminare[0].HASH_ID);
    // }
  }

  eliminaRigaFisica(hashID) {
    const params = {
      v_cntx: this.sessionId,
      v_hash_id: hashID
    };

    // // logConsole('operator__login', Utils.serverPostRest, params);
    this.apiService.chiamataPost(this.Utils, 'aireq__del', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        this.qualeRigaStoEliminando++;
        if (this.qualeRigaStoEliminando < this.righeDaEliminare.length) {
          this.eliminaRigaFisica(this.righeDaEliminare[this.qualeRigaStoEliminando].HASH_ID);
        } else {
          this.domandaAVideo = '';
          this.resultPrompt = '';
          this.resultRisposta = '';
          this.selezione = [];

          this.caricaQueries('delete');
        }
      }
    }, error => {
      // alert(error);
    });
  }

  llm_profile_conf = '';

  apreMaschera(aggiunta) {
    this.titolo = '';
    this.descrizione = '';
    this.investigation = '';
    // this.promptSingolo = '';
    // this.promptDataSingolo = '';
    this.cost = '';
    // this.duration = '';
    // this.status = '';
    this.answer = '';
    this.context = '';
    this.hashID = '';

    if (aggiunta) {
      if (!this.rigaSelezionata) {
        Swal.fire({
          title: 'AI',
          text: "No row selected",
          icon: 'error',
          showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
          },
        });
        
        return;
      }

      logConsole('Riga selezionata per aggiunta query', this.rigaSelezionata[0]);
      this.titolo = this.rigaSelezionata[0].TITLE;
      this.descrizione = this.rigaSelezionata[0].DESCRIPTION;
      this.investigation = this.rigaSelezionata[0].INVESTIGATION_GOAL;
      this.context = this.rigaSelezionata[0].CONTEXT;
      this.hashID = this.rigaSelezionata[0].HASH_ID;

      if (!this.rigaSelezionata[0].HASH_ID) {
        return;
      }
      if (!this.node_path) {
        return;
      }
    
      const params = {
        v_cntx: this.sessionId,
        v_hash_id: this.rigaSelezionata[0].HASH_ID,
        v_node_path: this.node_path
      };
      // // logConsole('operator__login', Utils.serverPostRest, params);
      this.apiService.chiamataPost(this.Utils, 'aireq__get', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
          logConsole('Ritorno get/answer per add query', data);

          const dati = data.v_aireq;

          this.llm_profile_conf = dati.llm_profile_conf;
          this.llm_profile_id = dati.llm_profile_id;
          this.promptSingolo = dati.prompt;
          // this.promptDataSingolo = dati.prompt_data;
          this.cost = dati.cost;
          // this.duration = dati.duration;
          // this.status = dati.status;
          this.context = dati.context;
          this.hashID = dati.hash_id;
          let answer = dati.answer;
          answer = this.sistemaStringaPerHTML(answer, false);
          this.answer = answer;
          // // logConsole('Risposta: ', answer);
    
          this.titoloPerUpd = dati.title;
          this.descrizionePerUpd = dati.description;
          this.statusPerUpd = dati.status;
          this.promptPerUpd = dati.prompt;

          if (dati.vote && dati.vote !== null) {
            this.voto = dati.vote;
          } else {
            this.voto = -1;
          }

          if (dati.comment && dati.comment !== null) {
            this.commento = dati.comment;
          } else {
            this.commento = '';
          }

          this.modalitaTest = true
        }, error => {
        });
    } else {
      this.modalitaTest = true
    }
  }

  addQuery(modalita) {
    if (this.title) {
      while (this.title.indexOf('\"') > -1) {
        this.title = this.title.replace('\"', '\'');
      }
    } else {
      alert('Insert a title');
    }
    if (this.descrizione) {
      while (this.descrizione.indexOf('\"') > -1) {
        this.descrizione = this.descrizione.replace('\"', '\'');
      }
    }

    this.ricaricaQuery = true;
    // this.callOpenAiAPI(this.promptSingolo, '', false, true);
    this.esegueInsert(modalita);
    this.modalitaTest = false;
  }

  tabSelezionato = 0;
  tabSelezionato1 = 0;

  onTabSelect(e) {
    this.tabSelezionato = e.index;
  }

  // Si apre sul tab Prompt (posizione 2, dopo System Prompt e Investigation Memory Instructions)
  tabSelezionato2 = 2;
  systemPrompt = '';
  summaryInstruction = '';

  onTabSelect2(e) {
    this.tabSelezionato2 = e.index;
  }

  ritornoDimensioniColonneAI(e) {
    ExternalUtilities.scriveDimensioniColonne('AI', e);
  }

  loadTemplate() {
    this.eventiSceltiES = this.templateSelezionato.eventiSceltiES;
    this.eventsMeasure = this.templateSelezionato.eventMeasure;
    this.filtriEventi = this.templateSelezionato.filtriEventi;
    this.isNonSyncEventTime = this.templateSelezionato.isNonSyncEventTime;
    this.listaEventiDaPassare = this.templateSelezionato.listaEventiDaPassare;
    this.listaEventiCheckatiES = this.templateSelezionato.listaEventiCheckatiES;
    this.listaEventiSEPassata = this.templateSelezionato.listaEventiSEPassata;
    this.timeFilter = this.templateSelezionato.timeFilter;
    this.tipoEvento = this.templateSelezionato.tipoEvento;
    this.ricercaJson = this.templateSelezionato.ricercaJson;

    const nuoveImpo = {
      eventiSceltiES: this.templateSelezionato.eventiSceltiES,
      eventsMeasure: this.templateSelezionato.eventMeasure,
      filtriEventi: this.templateSelezionato.filtriEventi,
      isNonSyncEventTime: this.templateSelezionato.isNonSyncEventTime,
      listaEventiDaPassare: this.templateSelezionato.listaEventiDaPassare,
      listaEventiCheckatiES: this.templateSelezionato.listaEventiCheckatiES,
      listaEventiSEPassata: this.templateSelezionato.listaEventiSEPassata,
      timeFilter: this.templateSelezionato.timeFilter,
      tipoEvento: this.templateSelezionato.tipoEvento,
      ricercaJson: this.templateSelezionato.ricercaJson
    }
    this.nuoveImpostazioni.emit(nuoveImpo);

    /* Swal.fire({
      title: 'AI',
      text: "Template setted",
      icon: 'success',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    }); */
  }

  selezioneRigaTemplate(e, nonAggiornareDati) {
    if (e && !e[0]) {
      e = [e];
    }

    if (!e[0].HASH_ID) {
      logConsole('Esco per hash id non valido');
      return;
    }

    if (e[0].HASH_ID === this.ultimoClick) {
      logConsole('Esco per doppio click', this.ultimoClick);
      return;
    }
    this.ultimoClick = e[0].HASH_ID;

    // alert('Carico template: ' + e[0].HASH_ID);
    this.eseguitoClickSuRiga = true;

    const t = setTimeout(() => {
      clearTimeout(t);

      logConsole('Riga selezionata template', e, this.modalitaEventi);
      this.rigaSelezionataTemplate = e[0];
      this.hashIdTemplate = this.rigaSelezionataTemplate.HASH_ID;

      this.descrizione = this.rigaSelezionataTemplate.DESCRIPTION;
      this.title = this.rigaSelezionataTemplate.TITLE;
      this.prompt = '';
      this.prompt_dt = this.rigaSelezionataTemplate.PROMPT_DATA_TYPE;
      this.llm_profile_conf = '';
      this.llm_profile_id = '';

      // alert('Carico template con hash id: ' + this.rigaSelezionataTemplate.HASH_ID);
      if (!this.rigaSelezionataTemplate.HASH_ID || this.rigaSelezionataTemplate.HASH_ID === '' || 
        this.rigaSelezionataTemplate.HASH_ID === null || this.rigaSelezionataTemplate.HASH_ID === undefined ||
       this.rigaSelezionataTemplate.HASH_ID === 'undefined' ||  this.rigaSelezionataTemplate.HASH_ID === 'null') {
        logConsole('Esco per hash id non valido 2');
        return;
      }

      const params = {
        v_cntx: this.sessionId,
        v_hash_id: this.rigaSelezionataTemplate.HASH_ID
      }
      this.apiService.chiamataPost(this.Utils, 'aireq_template__get', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          const t2 = setTimeout(() => {
            clearTimeout(t2);

            this.eseguitoClickSuRiga = false;
            this.cdRef.markForCheck();
          }, 1000);

          if (data.err_code && data.err_code > 0) {
            // alert(data.failure_reason);
          } else {
            logConsole('Dati get templates', data);

            const dati = data.v_aireq;
            this.vecchioPrompt = dati.prompt;
            let pr = dati.prompt;
            while (pr.indexOf('\n\n') > -1) {
              pr = pr.replace('\n\n', '\n')
            }
            this.prompt = pr;
            // this.attivaEdit(false);
        
            this.llm_profile_conf = dati.llm_profile_conf;
            this.llm_profile_id = dati.llm_profile_id;

            logConsole('Template loaded', dati, dati.view_cnf, nonAggiornareDati, this.modalitaEventi);
            if (!nonAggiornareDati) {
              this.templateSelezionato = dati.view_cnf;

              if (this.modalitaEventi) {
                this.rigaSelezionataTemplate['view_cnf'] = dati.view_cnf;
                this.templateSelezionatoDaPassare.emit(e[0]);
          
                this.loadTemplate();
              }
            }
          }
        }
      }, error => {
        const errore = error.error.code + ': ' + error.error.message;
        // alert(errore);
      });  
    }, 500);
  }

  refreshTemplate(r) {
    if (r === true) {
      this.datiTemplate = undefined;
    }
    this.caricaTemplates(this.lastHashId, this.lastNodePath);
  }

  lastHashId;
  lastNodePath;

  caricaTemplates(hash_id, node_path) {
    if (!hash_id) {
      logConsole('Esco per hash id non valido');
      return;
    }
    // alert('Carico templates per hash id: ' + this.hash_id);

    this.lastHashId = hash_id;
    this.lastNodePath = node_path;

    this.rigaSelezionataTemplate = undefined;

    let tipo = '';
    this.Utils.datiTipiFrameTutti.forEach(element => {
      if (!tipo && element.id === this.tipologiaFrame) {
        tipo = element.name;
      }
    });

    this.chiSonoTemplate = 'F' + this.NumeroFrame + ';P' + this.frameAttivo + ';' + new Date().toString();
    const params = {
      v_cntx_id: this.sessionId,
      v_caller_tag: this.chiSonoTemplate,
      v_prompt_data_type: tipo,
      v_hash_id: hash_id,
      v_node_path: node_path
    }
    logConsole('Caricamento template', params);
    this.apiService.chiamataPost(this.Utils, 'aireq_template__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningTemplate = data.v_grid_msg;
        } else {
          this.messaggioWarningTemplate = '';
        }

        // // logConsole('Dati templates', data);
        if (this.datiTemplate !== undefined && this.datiTemplate.DataTable
          && this.datiTemplate !== 'empty grid' && data.DataTable && JSON.stringify(data.ColumnProperty) === this.vecchioColumnProperty) {
          this.datiTemplate.DataTable = data.DataTable;
        } else {
          this.vecchioColumnProperty = JSON.stringify(data.ColumnProperty);
          this.datiTemplate = data;

          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.effettuaAutoFitTemplate = !this.effettuaAutoFitTemplate;
          }, 100);
        }
      }
    }, error => {
      const errore = error.error.code + ': ' + error.error.message;
      alert(errore);
    });  
  }

  eliminaTemplate(e) {
    // // logConsole('Elimino template', e);
    const params = {
      v_cntx: this.sessionId,
      v_hash_id: e[0].HASH_ID
    }
    this.apiService.chiamataPost(this.Utils, 'aireq_template__del', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        this.caricaTemplates(e[0].HASH_ID, e[0].NODE_PATH);
      }
    }, error => {
      const errore = error.error.code + ': ' + error.error.message;
      alert(errore);
    });  
  }

  ritornoDimensioniColonneTemplate(e) {
    ExternalUtilities.scriveDimensioniColonne('Template', e);
  }

  selectDTT(e) {
      // // // logConsole('Selezione combo', e);
      this.prompt_dt = e.name;
  }

  addColumnDescription() {
    // if (this.descrizioneAggiunta) {
    //   return;
    // }
    logConsole('Prompt: ', this.prompt);
    logConsole('Colonne: ', this.messaggioCSV);
    this.descrizioneAggiunta = true;
    this.prompt += this.messaggioCSV;
  }

  addRagPrompt() {
    if (this.prompt.indexOf('<rag_prompt>') === -1) {
      this.prompt += '\n<rag_prompt>';
      this.prompt += '\n\treplace this text with prompt to RAG. Do not remove the tags';
      this.prompt += '\n</rag_prompt>';
      this.prompt += '\n\n<rag_content>';
    } else {
      alert('Tag is already present');
    }
  }

  saveTemplate() {
    if (!this.prompt || this.vecchioPrompt === this.prompt) {
      return;
    }

    let impo;
    let tipo;

    if (this.modalitaEventi) {
      tipo = this.prompt_dt;

      impo = {
        eventiSceltiES: this.eventiSceltiES, // this.impostazioniPassate2.eventiSceltiES[this.frameAttivo2][this.NumeroFrame2],
        eventsMeasure: this.eventsMeasure, // this.impostazioniPassate2.eventsMeasure[this.frameAttivo2][this.NumeroFrame2],
        filtriEventi: this.filtriEventi, // this.impostazioniPassate2.filtriEventi[this.frameAttivo2][this.NumeroFrame2],
        isNonSyncEventTime: this.isNonSyncEventTime, // this.impostazioniPassate2.isNonSyncEventTime[this.frameAttivo2][this.NumeroFrame2],
        listaEventiDaPassare: this.listaEventiDaPassare,
        listaEventiCheckatiES: this.listaEventiCheckatiES,
        listaEventiSEPassata: this.listaEventiSEPassata,
        timeFilter: this.timeFilter, // this.impostazioniPassate2.timeFilter[this.frameAttivo2][this.NumeroFrame2],
        tipoEvento: this.tipoEvento, // this.impostazioniPassate2.tipoEvento[this.frameAttivo2][this.NumeroFrame2],
        ricercaJson: this.ricercaJson
      };
    } else {
      this.Utils.datiTipiFrameTutti.forEach(element => {
        if (!tipo && element.id === this.tipologiaFrame) {
          tipo = element.name;
        }
      });

      impo = {
        eventiSceltiES: null,
        eventsMeasure: null,
        filtriEventi: null,
        isNonSyncEventTime: this.isNonSyncEventTime, // this.impostazioniPassate2.isNonSyncEventTime[this.frameAttivo2][this.NumeroFrame2],
        listaEventiDaPassare: null,
        listaEventiCheckatiES: null,
        listaEventiSEPassata: null,
        timeFilter: this.timeFilter, // this.impostazioniPassate2.timeFilter[this.frameAttivo2][this.NumeroFrame2],
        tipoEvento: this.tipoEvento, // this.impostazioniPassate2.tipoEvento[this.frameAttivo2][this.NumeroFrame2],
        ricercaJson: this.ricercaJson
      };
    }
  
    // // logConsole('Impostazioni frame', impo);

    const params = {
      v_cntx: this.sessionId,
      v_title: this.title,
      v_prompt: this.prompt,
      v_prompt_data_type: tipo,
      v_description: this.descrizione,
      v_view_cnf: impo,
      v_llm_profile_id: this.llm_profile_id
    }
    this.apiService.chiamataPost(this.Utils, 'aireq_template__ins', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        if (data.err_code != 0) {
          alert(data.failure_reason);
        } else {
          const azione = data.v_action;
          // // logConsole('Azione: ', azione);
          let messaggio = '';
          if (azione === 'inserted') {
            messaggio = 'Template added';
          } else {
            messaggio = 'Template updated';
          }
          this.vecchioPrompt = this.prompt;

          this.caricaTemplates(this.lastHashId, this.lastNodePath);

          /* Swal.fire({
            title: 'AI',
            text: messaggio,
            icon: 'success',
            showClass: {
              backdrop: 'swal2-noanimation', // disable backdrop animation
              popup: '',                     // disable popup animation
              // icon: ''                       // disable icon animation
            },
          }); */
        }
      }
    }, error => {
      const errore = error.error.code + ': ' + error.error.message;
      alert(errore);
    });  
  }

  submitQuery(perEvidence, modalita) {
    // if (!this.prompt || this.vecchioPrompt === this.prompt) {
    //   return;
    // }

    if (this.prompt.indexOf('<rag_prompt>') > -1) {
      if (this.prompt.indexOf('</rag_prompt>') === -1) {
        alert('Tag </rag_prompt> not present');
        return;
      } else {
        if (this.prompt.indexOf('<rag_content>') === -1) {
          alert('Tag <rag_content> not present');
          return;
        }
      }
    }

    // alert(this.prompt_dt);
    logConsole('Modalità eventi', this.modalitaEventi, this.prompt_dt, this.rigaEventoSelezionato);
    if (this.modalitaEventi) {
      if (this.prompt_dt !== 'msg_list') {
        if (!this.rigaEventoSelezionato) {
          Swal.fire({
            title: 'AI',
            text: "This analysis applies to a selected event. However, no event has been selected in the grid. Please select one before proceeding with the analysis.",
            icon: 'error',
            showClass: {
              backdrop: 'swal2-noanimation', // disable backdrop animation
              popup: '',                     // disable popup animation
              // icon: ''                       // disable icon animation
            },
          });
        
          return;
        }
        // this.ritornaJsonFormattato = new Date().toString();
        this.inviaJson.emit(new Date().toString());
        this.gestioneTemplate = false;
      } else {
        this.submitQuery2(this.prompt, perEvidence, modalita);
      }
    } else {
      this.submitQuery2(this.prompt, perEvidence, modalita);
    }
  }

  submitQuery2(jsoneFormattato, perEvidence, modalita) {
    if (!this.act_id || !this.hash_id || !this.node_path || !this.hashIdTemplate) {
      return;
    }
    
    logConsole('Ritorno query ai 3: ', jsoneFormattato);
    // const e = this.rigaEventoSelezionato2;
    // if (e) {
      // event_type
      // tms
      // testodettaglioeventi
      // testodettaglioeventi.tcrun_id
      const titolo = this.title; //  'Explain ' + e.event_type + ' ' + e.act_id + ' ' + e.tms;
      const descrizione = this.descrizione;
      // const data_set = this.rigaEventoSelezionato2.act_id;
      let req = this.prompt; 
      while (req.indexOf('\n') > -1) {
        req = req.replace('\n', '<br />');
      }
      /* "Referring to the content of the field data:<br />" +
        "1. Why does the network send this message?<br />" +
        "2. What is the expected behavior of the UE upon receiving it?<br />" +
        "Return result using format html";
      let prompt = jsoneFormattato; */

      let tmsStart;
      let tmsEnd;
      let event_row;

      if (this.modalitaEventi) {
        if (this.prompt_dt === 'msg_list') {
          tmsStart = this.tmsFrom;
          tmsEnd = this.tmsTo;
          event_row = null;
        } else {
          const e = this.rigaEventoSelezionato;
          // // logConsole('Riga evento selezionato per AI', e);
          tmsStart = e.tms;
          tmsEnd = e.tms;
          event_row = e.ROW_ID;

          const scrittaEventType = '<EVENT_TYPE>';
          if (req.toUpperCase().indexOf(scrittaEventType) > -1) {
            const inizio = req.toUpperCase().indexOf(scrittaEventType);
            const fine = inizio + scrittaEventType.length;
            const scrittaReale = req.substring(inizio, fine);

            req = req.replace(scrittaReale, e.event_type);
            
            // logConsole('Scritta reale', inizio, fine, scrittaReale, this.prompt);
          }

          // logConsole('Riga selezionata', e);
          // logConsole('Prompt', this.prompt);          
        }
      } else {
        tmsStart = null;
        tmsEnd = null;
        event_row = null;
        req = this.prompt;
      }

      // logConsole('CSV:' , this.datiCSV);

      /* let prompt_data;

      if (this.modalitaEventi) {
        if (this.prompt_dt === 'msg_list') {
          if (this.datiPointActivityEvents && this.datiPointActivityEvents.Columnproperty) {
            prompt_data = this.converteJsonInCSV(this.datiPointActivityEvents);
          } else {
            prompt_data = '';
          }
        } else {
          prompt_data = jsoneFormattato;
        }
      } else {
        prompt_data = this.datiCSV.CSV;
        // req = this.prompt;
      } */

      let prompt_data = this.resultPrompt;
      logConsole('Prompt data', prompt_data);
      // return;

      // const base64 = btoa(unescape(encodeURIComponent(prompt_data)));

      let nodi = undefined;

      if (this.node_path_father_list !== '' && this.node_path_father_list !== undefined) {
        nodi = this.node_path_father_list;
      } else {
        nodi = this.node_path_father_list_riga;
      }

      if (perEvidence) {
        prompt_data = '';
      }
      
      if (!nodi) {
        alert('Father list empty');
        return;
      }
      
      let base64 = prompt_data;
      if (modalita === 'HOTL') {
        base64 = null;
      }

      let codice = '';
      if (this.mappa_o_grafico === 'TC') {
        codice = this.tc_run_code;
      } else {
        codice = this.act_id;
      }

      const params = {
        v_cntx: this.sessionId,
        v_title: titolo,
        v_description: descrizione,
        v_prompt: req,
        v_prompt_data: base64,
        v_tms_from: tmsStart,
        v_tms_to: tmsEnd,
        v_act_set_name_list: codice,
        v_event_row_id: event_row,
        v_hash_id: this.hash_id,
        v_node_path_father_list: nodi,
        v_node_path: this.node_path,
        v_exec_mode: modalita,
        v_aireq_template_hash_id: this.hashIdTemplate,
        v_api_call: this.apiCall,
        v_llm_profile_id: this.llm_profile_id,
        v_investigation_goal: this.investigation ? this.investigation : null,
        v_expected_information_gain: null
      }
      
      logConsole('Ritorno query ai. Params: ', params, prompt_data);
      // return;
  
      this.apiService.chiamataPost(this.Utils, 'aireq__ins', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          if (data.err_code != 0) {
            alert(data.failure_reason);
          } else {
            /* Swal.fire({
              title: 'AI',
              text: "Query added",
              icon: 'success',
              showClass: {
                backdrop: 'swal2-noanimation', // disable backdrop animation
                popup: '',                     // disable popup animation
                // icon: ''                       // disable icon animation
              },
            }); */
            this.tabSelezionato = 0;
            this.tmrAttivo = 'SI';

            if (this.tmr2) { clearInterval(this.tmr2); }
            this.tmr2 = setInterval(() => {
              if (this.visibile === false) { return; } // tab nascosto: nessuna chiamata
              if (this.rigaSelezionata && this.rigaSelezionata[0]) {
                this.prendeGriglia2(this.rigaSelezionata[0].HASH_ID);
              }
            }, 10000);
          }
        }
      }, error => {
        const errore = error.error.code + ': ' + error.error.message;
        alert(errore);
      });  
    // }
  }  

  nomiCampi;
  chiaviCampo;
  primaRiga = false;

  converteJsonInCSV(jasone) {
    let righe = '';

    this.nomiCampi = new Array();
    this.chiaviCampo = new Array();
    this.primaRiga = false;
    /* if (jasone[0]) {
      this.primaRiga = false;
    } else {
      this.primaRiga = true;
    } */
    // // logConsole('Jasone', jasone)
    // this.prendeNomiCampi(jasone.ColumnProperty);
    jasone.ColumnProperty.forEach(element => {
      if (element.hide !== 'true' && element.hide !== true) {
        this.nomiCampi.push(element.headerText);
        this.chiaviCampo.push(element.key);
      }
    });
    // // logConsole('Nomi Campi 1', this.nomiCampi)
    
    /* const nomiNuovi = new Array();
    const colonne = jasone.ColumnProperty;
    for (let numero = 0; numero < this.nomiCampi.length; numero++) {
      colonne.forEach(element => {
        if (element.key.toUpperCase().trim() === this.nomiCampi[numero].toUpperCase().trim()) {
          if (element.hide !== 'true' && element.hide !== true) {
            nomiNuovi.push(this.nomiCampi[numero]);
          }
        }
      });
    }
    this.nomiCampi = nomiNuovi;
    // logConsole('Nomi Campi 2', this.nomiCampi) */
    
    // // // logConsole('Nomi campi', this.nomiCampi);
    for (let numero = 0; numero < this.nomiCampi.length; numero++) {
      righe += this.nomiCampi[numero] + ';';
    }
    if (righe) {
      righe += '\n';
    }

    jasone.DataTable.forEach(element => {
      for (let numero = 0; numero < this.nomiCampi.length; numero++) {
        const nomeCampo = this.nomiCampi[numero];
        const chiaveCampo = this.chiaviCampo[numero];
        let valoreCampo = element[chiaveCampo];
        if (valoreCampo && valoreCampo !== null && typeof(valoreCampo) !== 'object') {
          valoreCampo = valoreCampo.toString();
          if (valoreCampo.indexOf('color:') > -1) {
            // // logConsole('Valore campo', valoreCampo);
            valoreCampo = '';
          } else {
            valoreCampo = valoreCampo.replace(/[\r\n]+/gm, '').replace(/[\n]+/gm, '').trim();
            valoreCampo = valoreCampo.replace('<br />', '§').replace('<br/>', '§');
            valoreCampo = valoreCampo.replace('\n', '');
          }
        } else {
          if (valoreCampo === undefined || valoreCampo === null) {
            valoreCampo = '';
          } else {
            if (typeof(valoreCampo) === 'object') {
              // // // logConsole(valoreCampo);
              valoreCampo = '<JSON>' + valoreCampo + '<JSON>';
            } else {
              // // logConsole('Valore campo json', nomeCampo, valoreCampo);
              valoreCampo = '';
            }
          }
        }

        righe += valoreCampo + ';';
      }
      if (righe) {
        righe += '\n';
      }
    });

    // // logConsole('Righe totali', righe);

    return righe;
  }

  controllaRitornoChiamata(t, dataP, chiamante) {
    const data = dataP;

    let chiSono = '';

    switch(chiamante) {
      case 'ClickJSON':
        chiSono = t.chiSonoClickJson[t.NumeroFrame];
        break;
    }

    if (chiSono === '') {
      return false;
    }

    if (data && data.v_caller_tag) {
      const ritorno = data.v_caller_tag;
      if (ritorno !== chiSono) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  selectedNodeId: string | null = null;
  hashIdTemplate;
  caricamentoNodi = false;

  onSelectNode(e) {
    logConsole('Nodo selezionato', e);
    this.rigaSelezionata2 = [e.riga];
    this.selezione2 = e.riga.ROW_ID;
    this.selectedNodeId = e.id;
    this.eseguiQuery();
  }

  nextNodes = new Array();
  selectedNextNode;
  promptNode;

  @ViewChild('contenitoreScroll')
  contenitoreScroll!: ElementRef;

  leggeChatMode() {
    if (!this.hash_id) {
      return;
    }
    
    const params = {
      v_cntx: this.sessionId,
      v_hash_id: this.hash_id,
    }
    this.caricamentoNodi = true;
    if (this.contenitoreScroll) {
      this.contenitoreScroll.nativeElement.scrollTop = 0;
    }
    this.cdRef.detectChanges();

    const tt = setTimeout(() => {
      clearTimeout(tt);

      this.apiService.chiamataPost(this.Utils, 'aireq_chat__get', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          if (data.err_code != 0) {
            alert(data.failure_reason);
          } else {
            const dati1 = data.v_aireq_chat_json;
            const dati2 = data.v_aireq_next_investigation_node_json;

            let chatMode1 = '';
            dati1.forEach(element => {
              const titolo = "<div class='row-user'><div class='user-bubble'>" + element.title + "</div></div><br />";
              const summary = JSON.parse(element.summary);
              let confidenza = '';
              let valConfidenza = 0;

              if (summary && summary.executive_summary && summary.executive_summary.confidence) {
                valConfidenza = +summary.executive_summary.confidence;

                if (valConfidenza < 0.5) {
                  confidenza = 'good';
                } else {
                  if (valConfidenza >= 0.5 && valConfidenza <= 0.8) {
                    confidenza = 'medium';
                  } else {
                    confidenza = 'bad';
                  }
                }
              }

              let causa = '';
              let problema = '';

              if (summary && summary.executive_summary && summary.executive_summary.most_probable_root_cause) {
                causa = summary.executive_summary.most_probable_root_cause;
              }
              if (summary && summary.executive_summary && summary.executive_summary.problem) {
                problema = summary.executive_summary.problem;
              }

              const risposta = 
                "<div class='row-answer'>" +
                  "<div class='answer-bubble'>" + 
                    element.answer + 
                    "<hr />" +
                    "<h5>Executive summary</h5>" +
                    "<div style='width: 100%; height: auto; margin-top: 5px;'>" +
                    "<strong>Most problem root cause:</strong> " + causa + "<br />" +
                    "<strong>Problem:</strong> " + problema + "<br />" +
                    "</div>" +
                    "<div class='chips'>" +
                      "<div class='chip " + confidenza + "'>Confidence: " + valConfidenza + "</div>" +
                      // "<div class='chip'>Domain: " + "</div>" +
                    "</div>" +
                  "</div>" +
                "</div>" +
                "<br />";

              // logConsole('Dati', element, 'Summary', summary);

              chatMode1 += titolo;
              chatMode1 += risposta;
            });

            this.chatMode1 = chatMode1;

            const nodi = dati2; // [0].next_node_list;
            logConsole('Nodi', nodi);
            const nextNodes = new Array();
            if (nodi && nodi !== null && nodi[0] !== null) {
              nodi.forEach(element => {
                nextNodes.push({ title: element.title, description: element.description, hash_id: element.hash_id });
              });
            }
            this.nextNodes = nextNodes;

            this.promptNode = '';

            if (data.v_running > 0) {
              // alert('Ancora in ciclo');
              const t1 = setTimeout(() => {
                clearTimeout(t1);
                
                this.leggeChatMode();
              }, 5000);
            } else {
              this.caricamentoNodi = false;
              this.cdRef.detectChanges();
            }
          }
        }
      }, error => {
        const errore = error.error.code + ': ' + error.error.message;
        alert(errore);
      });  
    }, 500);
 }

 titoloPerNodo = '';
 descrizionePerNodo = '';
 investigation = '';

 selectNextNode(e) {
  if (!e.hash_id) {
    logConsole('Esco per hash id non valido');
    return;
  }

  logConsole('Nodo selezionato', e);
  this.selectedNextNode = e;

  // alert('Carico template con hash id: ' + e.hash_id);
  const params = {
    v_cntx: this.sessionId,
    v_hash_id: e.hash_id
  }
  this.apiService.chiamataPost(this.Utils, 'aireq_template__get', params)
  // .map(response => response)
  .pipe(takeUntil(this.destroy$))
  .subscribe((data: any) => {
    if (data) {
      if (data.err_code && data.err_code > 0) {
        // alert(data.failure_reason);
        this.promptNode = '';
      } else {
        this.promptNode = data.v_aireq.prompt;
 
        const dati = data.v_aireq;
        this.vecchioPrompt = dati.prompt;
        let pr = dati.prompt;
        while (pr.indexOf('\n\n') > -1) {
          pr = pr.replace('\n\n', '\n')
        }
        this.prompt = pr;

        this.titoloPerNodo = dati.title;
        this.descrizionePerNodo = dati.description;
        this.investigation = dati.investigation_goal;

        this.hashIdTemplate = dati.hash_id;

        // this.promptDataSingolo = dati.prompt_data;

        // this.attivaEdit(false);
    
        logConsole('Template loaded', dati, dati.view_cnf, this.modalitaEventi);
        this.templateSelezionato = dati.view_cnf;

        if (this.modalitaEventi) {
          logConsole('Template selezionato', this.templateSelezionato);
          this.datiTemplate.DataTable.forEach(element => {
            if (element.HASH_ID === dati.hash_id) {
              this.selezioneTemplateAI = [element.ROW_ID];
            }
          });
          this.templateSelezionatoDaPassare.emit(this.templateSelezionato);

          this.selezioneRigaTemplate([this.templateSelezionato], true);

          this.nonDeveAggiornare = true;

          this.loadTemplate();
        }
     }
      // logConsole('Dati get template per nodo', this.promptNode);
    }
  }, error => {
    const errore = error.error.code + ': ' + error.error.message;
    // alert(errore);
    this.promptNode = '';
  });  
 }

 resetPrompt() {
  logConsole('Reset prompt');
 }

  executeFromNode(modalita) {
    if (!this.hashIdTemplate) {
      return;
    }

    logConsole('Eseguo da nodo', this.selectedNextNode, this.promptNode);
 
    let tmsStart = null;
    let tmsEnd = null;
    let req = this.prompt; 
    while (req.indexOf('\n') > -1) {
      req = req.replace('\n', '<br />');
    }

    if (this.modalitaEventi) {
      if (this.prompt_dt === 'msg_list') {
        tmsStart = this.tmsFrom;
        tmsEnd = this.tmsTo;
      } else {
        const e = this.rigaEventoSelezionato;
        // // logConsole('Riga evento selezionato per AI', e);
        tmsStart = e.tms;
        tmsEnd = e.tms;

        const scrittaEventType = '<EVENT_TYPE>';
        if (req.toUpperCase().indexOf(scrittaEventType) > -1) {
          const inizio = req.toUpperCase().indexOf(scrittaEventType);
          const fine = inizio + scrittaEventType.length;
          const scrittaReale = req.substring(inizio, fine);

          req = req.replace(scrittaReale, e.event_type);
          
          // logConsole('Scritta reale', inizio, fine, scrittaReale, this.prompt);
        }

        // logConsole('Riga selezionata', e);
        // logConsole('Prompt', this.prompt);          
      }
    } else {
      tmsStart = null;
      tmsEnd = null;
      req = this.prompt;
    }

    let base64 = this.resultPrompt;
    if (modalita === 'HOTL') {
      base64 = null;
    }

    let codice = '';
    if (this.mappa_o_grafico === 'TC') {
      codice = this.tc_run_code;
      if (!codice) {
        Swal.fire({
          title: 'AI',
          text: "Plese select a row on tcrun grid",
          icon: 'error',
          showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
          },
        });
        return;
      }
    } else {
      codice = this.act_id;
      if (!codice) {
        Swal.fire({
          title: 'AI',
          text: "Plese select a row on activities grid",
          icon: 'error',
          showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
          },
        });
        return;
      }
    }

    const params = {
      v_cntx: this.sessionId,
      v_title: this.titoloPerNodo,
      v_description: this.descrizionePerNodo,
      v_prompt: req,
      v_prompt_data: base64,
      v_tms_from: tmsStart,
      v_tms_to: tmsEnd,
      v_act_set_name_list: codice,
      v_event_row_id: null,
      v_hash_id: this.hash_id,
      v_node_path_father_list: null,
      v_node_path: null,
      v_aireq_template_hash_id: this.hashIdTemplate,
      v_exec_mode: modalita,
      v_api_call: null, // this.apiCall,
      v_llm_profile_id: null, // this.llm_profile_id
      v_investigation_goal: this.investigation ? this.investigation : null,
      v_expected_information_gain: null
    }
    logConsole('Ritorno query ai da nodo. Params: ', params);

    this.apiService.chiamataPost(this.Utils, 'aireq__ins', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        if (data.err_code != 0) {
          alert(data.failure_reason);
        } else {
          // this.tabSelezionato = 4;
          this.tmrAttivo = 'SI';

          this.leggeChatMode();

          if (this.tmr2) { clearInterval(this.tmr2); }
          this.tmr2 = setInterval(() => {
            if (this.visibile === false) { return; } // tab nascosto: nessuna chiamata
            if (this.rigaSelezionata && this.rigaSelezionata[0]) {
              this.prendeGriglia2(this.rigaSelezionata[0].HASH_ID);
            }
          }, 10000);
        }
      }
    }, error => {
      const errore = error.error.code + ': ' + error.error.message;
      alert(errore);
    });  
  }

  onNodeDragEnd(e) {
    logConsole('Spostamento nodo', e);
  }

  selectProfiloAI(e) {
    logConsole('Profilo AI selezionato 2', e);
    this.llm_profile_id = e.name;
  }

  modificaRiga() {
    const jsonRichiesta1 = this.promptDataSingolo;
    const jsonRichiesta2 = this.promptSingolo;

    let j1 = JSON.stringify(jsonRichiesta2);
    let j2 = JSON.stringify(jsonRichiesta1);

    const params = {
      v_cntx: this.sessionId,
      v_hash_id: this.hashID,
      v_answer: this.answer,
      v_cost: this.cost,
      // v_duration: null,
      v_title: this.titolo,
      v_summary: this.summary,
      v_status: this.statusPerUpd,
      v_prompt: j1,
      v_description: this.descrizione,
      v_openai_batch_id: null,
      v_comment: this.commento ? this.commento : '',
      v_vote: this.voto === -1 ? null : this.voto,
      v_next_node_list: null
    };
    logConsole('Update row: ', params);
    // return;

    this.apiService.chiamataPost(this.Utils, 'aireq__upd', params)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        this.caricaQueries('Modifica Riga');
      }
    }, error => {
      alert(error);
    });
  }

  salvataggioPDF = false;

  async exportToHTML() {
    const element = document.createElement('div');

    element.innerHTML = this.chatMode1;

    Object.assign(element.style, {
      width: '794px',
      background: '#fff'
    });

    // Copia tutti gli <style> presenti nella pagina
    const styles = Array.from(
      document.querySelectorAll('style')
    )
      .map(style => style.outerHTML)
      .join('\n');

    // Copia i CSS esterni
    const links = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]')
    )
      .map(link => link.outerHTML)
      .join('\n');

    const html = `
  <!DOCTYPE html>
  <html lang="it">
  <head>
    <meta charset="UTF-8">
    <title>Report HTML Debug</title>

    ${links}

    ${styles}
  </head>

  <body style="margin: 0; background: white; overflow: auto;">

    ${element.outerHTML}

  </body>
  </html>
  `;

    const blob = new Blob(
      [html],
      { type: 'text/html;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    
    let nomefile = this.rigaSelezionata[0].TC_RUN_CODE + ' (investigation).html';
    
    a.download = nomefile;
    a.click();

    URL.revokeObjectURL(url);   
      /*
    const element = document.createElement('div');

    element.innerHTML = this.chatMode1;

    element.setAttribute('data-pdf-container', 'true');

    Object.assign(element.style, {
      position: 'fixed',
      left: '-100000px',
      top: '0',
      width: '794px',
      minHeight: '1123px',
      background: '#fff',
      overflow: 'visible',
      display: 'block'
    });

    document.body.appendChild(element);

    const options = {
      margin: 10,
      filename: 'report.pdf',

      image: {
        type: 'jpeg',
        quality: 0.98
      },

      html2canvas: {
        scale: 1,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794
      },

      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    } as const;

    try {
      await html2pdf
        .default()
        .set(options)
        .from(element)
        .save();

      logConsole('PDF generato');

    } catch (error) {

      console.error('Errore PDF:', error);

    } finally {

      element.remove();
      this.salvataggioPDF = false;
    }
    */
  }
} 
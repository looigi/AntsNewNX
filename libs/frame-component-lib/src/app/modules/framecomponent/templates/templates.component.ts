import { logConsole } from '../console-log';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation, OnDestroy, ChangeDetectionStrategy, HostListener, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { ExternalApiService } from "../services/externalapi.service";
import Swal from "sweetalert2";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import ExternalUtilities from "../ExternalUtilities.component";
// import Swal from 'sweetalert2/dist/sweetalert2.js';
// import ExternalUtilities from "../ExternalUtilities.component";

@Component({
  selector: 'template-component',
  templateUrl: 'templates.component.html',
  styleUrls: ['./templates.style.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush, // AGGIUNTO PER MEMORY LEAKES
  encapsulation: ViewEncapsulation.None,
})

export class TemplatesComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() NumeroFrame;
  @Input() debug;
  @Input() frameAttivo;
  @Input() sessionID;
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
  @Input() Utils;
  @Input() righePerPaginazioneAutomatica;
  @Input() indirizzoServer;
  @Input() frameName;
  @Input() userName;
  @Input() gestioneTemplate;
  @Input() rigaEventoSelezionato;
  @Input() arrivatoJson;
  @Input() datiPointActivityEvents;
  @Input() ultimoTemplateSelezionatoPassato;
  @Input() tmsFrom;
  @Input() tmsTo;
  @Input() act_id;
  @Input() tc_run_id;
  @Input() tipologiaFrame;
  @Input() datiCSV;
  @Input() visualizzareTastoSubmit = false;
  @Input() apiCall;
  @Input() caricamentoEventiInCorso;
  @Input() tc_run_code;
  @Input() mappa_o_grafico;
  @Input() tc_run_failure;

  @Output() nuoveImpostazioni: EventEmitter<any> = new EventEmitter<any>();
  @Output() chiudiMaschera: EventEmitter<any> = new EventEmitter<any>();
  @Output() inviaJson: EventEmitter<any> = new EventEmitter<any>();
  @Output() templateSelezionatoDaPassare: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('maskTemplate', {static: false}) elementView: ElementRef;
  
  destroy$ = new Subject<void>();

  tmrAttivo = 'NO';

  listaFolders;
  listaFolders1;
  folder_id;
  folder_id2;

  typeScelto = '';
  listaTypes = [
    { VALUE_STR: 'HITL'},
    { VALUE_STR: 'HOTL'}
  ]
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.elementView) {
      this.elementView.nativeElement.remove();
      this.elementView = undefined;
    }
  }

  @ViewChild('maskTemplate') maskTemplate!: ElementRef;

  resizeTimeout: any;

  ngAfterViewInit(): void {
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        // Annulla il timer precedente
        clearTimeout(this.resizeTimeout);

        // Esegui dopo 300ms senza ulteriori resize
        this.resizeTimeout = setTimeout(() => {
          this.onResizeFinished(entry.contentRect);
        }, 300);
      }
    });

    if (this.tipologiaFrame === 'TC') {
      this.tabSelezionato = 0;
    } else {
      this.tabSelezionato = 1;
    }
    // New Investigation: Type riparte dall'ultimo valore scelto (default HOTL)
    const ultimoType = this.leggeUltimoValoreNI('Type');
    this.typeScelto = this.listaTypes.some(t => t.VALUE_STR === ultimoType) ? ultimoType : 'HOTL';

    this.caricaFilters();

    observer.observe(this.maskTemplate.nativeElement);  
  }

  onResizeFinished(rect: DOMRectReadOnly) {
    // logConsole('Resize terminato');
    // logConsole(rect.width, rect.height);

    this.dimeSchermo =
        rect.width + ';' + rect.height;

    // Qui il tuo codice
  }

  massimizzata = false;
  mascheraLeft = 0;
  mascheraTop = 0;
  mascheraWidth = 0;
  mascheraHeight = 0;
  mascheraTransform = '';

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  eventiSceltiES2;
  eventsMeasure2;
  filtriEventi2;
  isNonSyncEventTime2;
  listaEventiDaPassare2;
  listaEventiCheckatiES2;
  listaEventiSEPassata2;
  timeFilter2;
  tipoEvento2;
  ricercaJson2;
  NumeroFrame2;
  frameAttivo2;
  sessionID2;
  debug2;
  indirizzoServer2;
  frameName2;
  userName2;
  datiPointActivityEvents2;
  
  datiTemplate;
  // maskNameTemplate = 'Templates';
  maskNameTemplate = ['', 'Templates_1', 'Templates_2', 'Templates_3', 'Templates_4', 'Templates_5', 'Templates_6',
    'Templates_7', 'Templates_8', 'Templates_9'];
  selezioneTemplate;
  effettuaAutoFitTemplate = false;
  rigaSelezionataTemplate;
  rigaEventoSelezionato2;
  gestioneTemplate2 = false;
  chiSonoTemplate = '';
  // ritornaJsonFormattato2 = '';
  descrizione = '';
  title = '';
  prompt = '';
  templateSelezionato;
  prompt_dt = 'msg_list';
  ultimoTemplateSelezionatoPassato2;
  modalitaEdit = false;

  act_id2;
  tc_run_id2;
  tmsFrom2;
  tmsTo2;
  modalitaEventi = false;
  messaggioCSV = '';

  datiPDT = [
      { name: 'msg_single' },
      { name: 'msg_list' }
  ];
  
  constructor(
      private apiService: ExternalApiService,
      private cdRef: ChangeDetectorRef,
  ) {
    this.getScreenSize();

    this.mascheraLeft = 100;
    this.mascheraTop = 100;
    this.mascheraWidth = Math.round(this.scrWidth / 3);
    this.mascheraHeight = this.scrHeight - 150;
    this.mascheraTransform = 'translate(-50%, -50%)';
    logConsole('Dimensioni Maschera Prima', this.mascheraLeft, this.mascheraTop, this.mascheraWidth, this.mascheraHeight, this.mascheraTransform);
    this.massimizzata = false;
  }

  scrHeight:any;
  scrWidth:any;
  dimeSchermo;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
      this.scrHeight = window.innerHeight;
      this.scrWidth = window.innerWidth;

      // logConsole(this.scrHeight, this.scrWidth);
      this.dimeSchermo = this.scrWidth + ';' + this.scrHeight;
  }

  ngOnInit(): void {
      
  }

  caricamentoEventiInCorso1 = false;
  caricamentoEventiInCorso2 = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipologiaFrame']) {
      if (changes['tipologiaFrame'].currentValue === 'AE') {
        this.modalitaEventi = true;
      } else {
        this.modalitaEventi = false;
      }
    }
    if (changes['rigaEventoSelezionato']) {
      this.rigaEventoSelezionato2 = changes['rigaEventoSelezionato'].currentValue;
      logConsole('Riga evento selezionato passata a template', this.rigaEventoSelezionato2);
    }
    if (changes['frameName']) {
      this.frameName2 = changes['frameName'].currentValue;
    }
    if (changes['userName']) {
      this.userName2 = changes['userName'].currentValue;
    }
    if (changes['indirizzoServer']) {
      this.indirizzoServer2 = changes['indirizzoServer'].currentValue;
    }
    if (changes['sessionID']) {
      this.sessionID2 = changes['sessionID'].currentValue;
    }
    if (changes['debug']) {
      this.debug2 = changes['debug'].currentValue;
    }
    if (changes['NumeroFrame']) {
      this.NumeroFrame2 = changes['NumeroFrame'].currentValue;
    }
    if (changes['frameAttivo']) {
      this.frameAttivo2 = changes['frameAttivo'].currentValue;
    }
    if (changes['eventiSceltiES']) {
      this.eventiSceltiES2 = changes['eventiSceltiES'].currentValue;
    }
    if (changes['eventsMeasure']) {
      this.eventsMeasure2 = changes['eventsMeasure'].currentValue;
    }
    if (changes['filtriEventi']) {
      this.filtriEventi2 = changes['filtriEventi'].currentValue;
    }
    if (changes['isNonSyncEventTime']) {
      this.isNonSyncEventTime2 = changes['isNonSyncEventTime'].currentValue;
    }
    if (changes['listaEventiDaPassare']) {
      this.listaEventiDaPassare2 = changes['listaEventiDaPassare'].currentValue;
    }
    if (changes['listaEventiCheckatiES']) {
      this.listaEventiCheckatiES2 = changes['listaEventiCheckatiES'].currentValue;
    }
    if (changes['listaEventiSEPassata']) {
      this.listaEventiSEPassata2 = changes['listaEventiSEPassata'].currentValue;
    }
    if (changes['timeFilter']) {
      this.timeFilter2 = changes['timeFilter'].currentValue;
    }
    if (changes['tipoEvento']) {
      this.tipoEvento2 = changes['tipoEvento'].currentValue;
    }
    if (changes['ricercaJson']) {
      this.ricercaJson2 = changes['ricercaJson'].currentValue;
    }
    if (changes['arrivatoJson']) {
      const jsonRitornato = changes['arrivatoJson'].currentValue;
      logConsole('Json ritornato', jsonRitornato);
      if (jsonRitornato) {
        this.ritornoQueryAI3(jsonRitornato);
      }
    }
    if (changes['datiPointActivityEvents']) {
      if (changes['datiPointActivityEvents'].currentValue) {
        this.datiPointActivityEvents2 = changes['datiPointActivityEvents'].currentValue;
        logConsole('DatiPAE2', this.datiPointActivityEvents2);
      }
    }
    if (changes['act_id']) {
      if (changes['act_id'].currentValue) {
        this.act_id2 = changes['act_id'].currentValue;
      }
    }
    if (changes['tc_run_id']) {
      if (changes['tc_run_id'].currentValue) {
        this.tc_run_id2 = changes['tc_run_id'].currentValue;
      }
    }
    if (changes['tmsFrom']) {
      // // // logConsole('Tms from templates: ', changes['tmsFrom'].currentValue);
      // if (changes['tmsFrom'].currentValue) {
        this.tmsFrom2 = changes['tmsFrom'].currentValue;
      // }
    }
    if (changes['tmsTo']) {
      // // // logConsole('Tms to templates: ', changes['tmsTo'].currentValue);
      // if (changes['tmsTo'].currentValue) {
        this.tmsTo2 = changes['tmsTo'].currentValue;
      // }
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
    }

    if (changes['gestioneTemplate']) {
      this.gestioneTemplate2 = changes['gestioneTemplate'].currentValue;
      if (this.gestioneTemplate2 === true) {
        this.descrizione = '';
        this.title = '';
        this.prompt = '';
        this.prompt_dt = 'msg_list';
    
        this.caricaTemplates('onChanges gestioneTemplate');
      } else {

      }
    }
  
    if (changes['datiCSV']) {
      // logConsole('Dati dentro template', changes['datiCSV']);
      this.descrizioneAggiunta = false;
      this.datiCSV = changes['datiCSV'].currentValue;

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
    }

    if (changes['ultimoTemplateSelezionatoPassato']) {
      this.ultimoTemplateSelezionatoPassato2 = changes['ultimoTemplateSelezionatoPassato'].currentValue;
      // // logConsole('Ultimo template selezionato ripassato', this.ultimoTemplateSelezionatoPassato2);
      if (this.ultimoTemplateSelezionatoPassato2) {
        this.templateSelezionato = this.ultimoTemplateSelezionatoPassato2.view_cnf;
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.selezioneTemplate = [this.ultimoTemplateSelezionatoPassato2.ROW_ID];
          this.selezioneRigaTemplate([this.ultimoTemplateSelezionatoPassato2], true);
        }, 1000);
      }
    }
  }

  refreshTemplate(r) {
    if (r === true) {
      this.datiTemplate = undefined;
    }
    this.caricamentoEventiInCorso2 = true;
    this.caricaTemplates('refreshTemplate');
  }

  loadTemplate() {
    this.eventiSceltiES2 = this.templateSelezionato.eventiSceltiES;
    this.eventsMeasure2 = this.templateSelezionato.eventMeasure;
    this.filtriEventi2 = this.templateSelezionato.filtriEventi;
    this.isNonSyncEventTime2 = this.templateSelezionato.isNonSyncEventTime;
    this.listaEventiDaPassare2 = this.templateSelezionato.listaEventiDaPassare;
    this.listaEventiCheckatiES2 = this.templateSelezionato.listaEventiCheckatiES;
    this.listaEventiSEPassata2 = this.templateSelezionato.listaEventiSEPassata;
    this.timeFilter2 = this.templateSelezionato.timeFilter;
    this.tipoEvento2 = this.templateSelezionato.tipoEvento;
    this.ricercaJson2 = this.templateSelezionato.ricercaJson;

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

  fNuoveImpostazioni(e) {
    this.nuoveImpostazioni.emit(e);
  }

  caricaFilters() {
    const params = {
      cntx_id: this.sessionID2,
      v_category: 'aireq_folder'
    }
    this.apiService.chiamataPost(this.Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data && data.DataTable) {
        this.listaFolders1 = data.DataTable;
        const t = setTimeout(() => {
          clearTimeout(t);
          // All'avvio si carica subito la griglia della Node Library con il folder selezionato, senza aspettare
          // l'evento della combo (che non sempre arriva, e con il tab Node Library non ancora aperto non c'è proprio)
          // Filter Folder riparte dall'ultimo valore scelto, se è ancora tra i folder disponibili; altrimenti 'default'
          const ultimoFolder = this.leggeUltimoValoreNI('FilterFolder');
          const esisteUltimoFolder = !!ultimoFolder && this.listaFolders1.some(f => f.VALUE_STR === ultimoFolder);
          const esisteDefault = this.listaFolders1.some(f => f.VALUE_STR === 'default');
          this.filterFolder = esisteUltimoFolder
            ? ultimoFolder
            : (esisteDefault ? 'default' : (this.listaFolders1[0]?.VALUE_STR || 'default'));
          this.ultimoValueStr = this.filterFolder;
          this.caricaTemplates('Avvio maschera');

          // New Investigation: Ver riparte dall'ultimo valore scelto, se è ancora tra i folder disponibili
          const ultimaVer = this.leggeUltimoValoreNI('Ver');
          const esisteUltimaVer = !!ultimaVer && this.listaFolders1.some(f => f.VALUE_STR === ultimaVer);
          this.filterFolderNI = esisteUltimaVer ? ultimaVer : this.filterFolder;
          this.ultimoValueStrNI = this.filterFolderNI;
          this.verDefaultNI = this.filterFolderNI;
        }, 1000);
      }
    }, error => {
      const errore = error.error.code + ': ' + error.error.message;
      alert(errore);
    });  
  }

  vecchioColumnProperty = '';
  messaggioWarningTemplate = '';
  listaProfiliAI = new Array();
  filterFolder = '';

  caricaTemplates(daDove) {
    // alert('Carico template ' + daDove);
    if (this.filterFolder === '') {
      return;
    }

    logConsole('Caricamento templates da ' + daDove);
    this.rigaSelezionataTemplate = undefined;

    let tipo = '';
    this.Utils.datiTipiFrameTutti.forEach(element => {
      if (!tipo && element.id === this.tipologiaFrame) {
        tipo = element.name;
      }
    });

    this.chiSonoTemplate = 'F' + this.NumeroFrame2 + ';P' + this.frameAttivo2 + ';' + new Date().toString();
    const params = {
      v_cntx_id: this.sessionID2,
      v_caller_tag: this.chiSonoTemplate,
      v_prompt_data_type: tipo,
      v_hash_id: null,
      v_node_path: null,
      v_filter_folder: this.filterFolder
    }
    this.caricamentoEventiInCorso1 = true;
    this.apiService.chiamataPost(this.Utils, 'aireq_template__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        const t1 = setTimeout(() => {
          clearTimeout(t1);

          this.caricamentoEventiInCorso1 = false;
        }, 1500);
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarningTemplate = data.v_grid_msg;
        } else {
          this.messaggioWarningTemplate = '';
        }

        logConsole('Dati templates', data);
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

        const listaProfiliAI = new Array();
        if (data.v_resource_table && data.v_resource_table.llm_profile_id) {
          data.v_resource_table.llm_profile_id.forEach(element => {
            const r = { name: element };
            listaProfiliAI.push(r);
          });
        }
        this.listaProfiliAI = JSON.parse(JSON.stringify(listaProfiliAI));

        const listFolders = new Array();
        if (data.v_resource_table && data.v_resource_table.folder) {
          data.v_resource_table.folder.forEach(element => {
            const r = { name: element };
            listFolders.push(r);
          });
        }
        this.listaFolders = JSON.parse(JSON.stringify(listFolders));
        // this.folder_id = this.listaFolders[0]?.name || '';

        logConsole('Lista cartelle', this.listaFolders);
      }
    }, error => {
      this.caricamentoEventiInCorso1 = false;
      const errore = error.error.code + ': ' + error.error.message;
      alert(errore);
    });  
  }

  saveAsTemplate() {

  }

  llm_profile_conf = '';
  llm_profile_id = '';

  saveTemplate() {
    if (this.vecchioPrompt === this.prompt) {
      return;
    }

    let impo;
    let tipo;

    if (this.modalitaEventi) {
      tipo = this.prompt_dt;

      impo = {
        eventiSceltiES: this.eventiSceltiES, // this.impostazioniPassate2.eventiSceltiES[this.frameAttivo2][this.NumeroFrame2],
        eventsMeasure: this.eventsMeasure2, // this.impostazioniPassate2.eventsMeasure[this.frameAttivo2][this.NumeroFrame2],
        filtriEventi: this.filtriEventi2, // this.impostazioniPassate2.filtriEventi[this.frameAttivo2][this.NumeroFrame2],
        isNonSyncEventTime: this.isNonSyncEventTime2, // this.impostazioniPassate2.isNonSyncEventTime[this.frameAttivo2][this.NumeroFrame2],
        listaEventiDaPassare: this.listaEventiDaPassare,
        listaEventiCheckatiES: this.listaEventiCheckatiES,
        listaEventiSEPassata: this.listaEventiSEPassata,
        timeFilter: this.timeFilter2, // this.impostazioniPassate2.timeFilter[this.frameAttivo2][this.NumeroFrame2],
        tipoEvento: this.tipoEvento2, // this.impostazioniPassate2.tipoEvento[this.frameAttivo2][this.NumeroFrame2],
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
        isNonSyncEventTime: this.isNonSyncEventTime2, // this.impostazioniPassate2.isNonSyncEventTime[this.frameAttivo2][this.NumeroFrame2],
        listaEventiDaPassare: null,
        listaEventiCheckatiES: null,
        listaEventiSEPassata: null,
        timeFilter: this.timeFilter2, // this.impostazioniPassate2.timeFilter[this.frameAttivo2][this.NumeroFrame2],
        tipoEvento: this.tipoEvento2, // this.impostazioniPassate2.tipoEvento[this.frameAttivo2][this.NumeroFrame2],
        ricercaJson: this.ricercaJson
      };
    }
  
    // // logConsole('Impostazioni frame', impo);

    const params = {
      v_cntx: this.sessionID2,
      v_title: this.title,
      v_prompt: this.prompt,
      v_prompt_data_type: tipo,
      v_description: this.descrizione,
      v_view_cnf: impo,
      v_llm_profile_id: this.llm_profile_id,
      v_folder: this.folder_id
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

          this.caricaTemplates('onChanges saveTemplate');

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

  eliminaTemplate(e) {
    // // logConsole('Elimino template', e);
    const params = {
      v_cntx: this.sessionID2,
      v_hash_id: e[0].HASH_ID
    }
    this.apiService.chiamataPost(this.Utils, 'aireq_template__del', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      if (data) {
        this.caricaTemplates('onChanges eliminaTemplate');
      }
    }, error => {
      const errore = error.error.code + ': ' + error.error.message;
      alert(errore);
    });  
  }

  vecchioPrompt = '';
  ultimoClick = '';
  hashIdTemplate = '';
  nonAggiornareDati;
  design;
  implementation;

  selezioneRigaTemplate(e, nonAggiornareDati) {
    if (e && !e[0]) {
      e = [e];
    }
    this.nonAggiornareDati = nonAggiornareDati;

    if (!e[0].HASH_ID) {
      logConsole('Esco per hash id non valido');
      return;
    }

    if (e[0].HASH_ID === this.ultimoClick) {
      logConsole('Esco per doppio click', this.ultimoClick);
      return;
    }
    this.ultimoClick = e[0].HASH_ID;

    logConsole('Riga selezionata template', e[0]);

    this.llm_profile_conf = null;
    this.llm_profile_id = null;
    this.hashIdTemplate = e[0].HASH_ID;

    this.rigaSelezionataTemplate = e[0];

    this.descrizione = this.rigaSelezionataTemplate.DESCRIPTION;
    this.title = this.rigaSelezionataTemplate.TITLE;
    this.prompt = '';
    this.prompt_dt = this.rigaSelezionataTemplate.PROMPT_DATA_TYPE;

    this.folder_id2 = e[0].FOLDER;
    // logConsole('Cartella selezionata template', this.folder_id2, e[0].FOLDER);
    this.folder_id = e[0].FOLDER;
    this.investigation = '';

    this.eseguitoClickSuRiga = true;

    const t = setTimeout(() => {
      clearTimeout(t);

      // logConsole('Riga selezionata template', e, this.modalitaEventi);
      const params = {
        v_cntx: this.sessionID2,
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
            // logConsole('Dati get templates', data);

            const dati = data.v_aireq;
            
            this.llm_profile_conf = dati.llm_profile_conf;
            this.llm_profile_id = dati.llm_profile_id;

            this.vecchioPrompt = dati.prompt;
            let pr = dati.prompt;
            // while (pr.indexOf('\n\n') > -1) {
            //   pr = pr.replace('\n\n', '\n')
            // }
            pr = pr.replace(/\\n/g, '\n');
            pr = pr.replace(/\\r\\n/g, '\n');
            this.prompt = pr;

            this.design = dati.design;
            this.implementation = dati.implementation;

            logConsole('Prompt caricato', JSON.stringify(this.prompt));
            // this.attivaEdit(false);
        
            logConsole('Template loaded', dati, dati.view_cnf, this.nonAggiornareDati, this.modalitaEventi);
            if (!this.nonAggiornareDati) {
              this.templateSelezionato = dati.view_cnf;

              this.rigaSelezionataTemplate['view_cnf'] = dati.view_cnf;
            }
          }
        }
      }, error => {
        const errore = error.error.code + ': ' + error.error.message;
        // alert(errore);
      });  
    }, 500);
  }

  selezioneRigaTemplate2() {
    if (!this.rigaSelezionataTemplate || !this.rigaSelezionataTemplate.HASH_ID) {
      return;
    }

    if (this.modalitaEventi) {
      this.templateSelezionatoDaPassare.emit(this.rigaSelezionataTemplate);

      this.loadTemplate();
    }
  }

  selectProfiloAI(e) {
    logConsole('Profilo AI selezionato 1', e);
    this.llm_profile_id = e.name;
  }

  selectFolder(e) {
    logConsole('Cartella selezionata 1', e);
    if (!e.name && e.indexOf('***') > -1) {
      this.listaFolders.push({ name: e.replace('***', '') });
      this.listaFolders = this.listaFolders.sort((a, b) => a.name.localeCompare(b.name));
      this.listaFolders = JSON.parse(JSON.stringify(this.listaFolders));
      const t = setTimeout(() => {
        clearTimeout(t);

        this.folder_id = e.replace('***', '');
      }, 100);
    } else {
      if (e.name) {
        this.folder_id = e.name;
      }
    }
  }

  /* selectFolder2(e) {
    logConsole('Cartella selezionata 2', e.name);

    if (e.name) {
      this.folder_id2 = e.name;
    }
  } */

  ultimoValueStr = '';

  selectFilterFolder(e) {
    logConsole('Cartella selezionata ff', e);

    if (e.VALUE_STR) {
      if (this.ultimoValueStr === e.VALUE_STR) {
        return;
      }
      this.ultimoValueStr = e.VALUE_STR;

      this.filterFolder = e.VALUE_STR;
      this.salvaUltimoValoreNI('FilterFolder', this.filterFolder);
      this.caricaTemplates('Select filter folder');
    }
  }

  fTemplateSelezionatoDaPassare(e) {
    this.templateSelezionatoDaPassare.emit(e);
  }

  ritornoQueryAI2() {
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
    logConsole('Modalità eventi', this.modalitaEventi, this.prompt_dt, this.rigaEventoSelezionato2);
    if (this.modalitaEventi) {
      if (this.prompt_dt !== 'msg_list') {
        if (!this.rigaEventoSelezionato2) {
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
        this.ritornoQueryAI3(this.prompt);
      }
    } else {
      this.ritornoQueryAI3(this.prompt);
    }
  }

  fInviaJson(e) {
    this.inviaJson.emit(e);
  }

  descrizioneAggiunta = false;

  addColumnDescription() {
    // if (this.descrizioneAggiunta) {
    //   return;
    // }
    logConsole('Prompt: ', this.prompt);
    logConsole('Colonne: ', this.messaggioCSV);
    this.descrizioneAggiunta = true;
    this.prompt += this.messaggioCSV;
  }

  investigation = '';

  ritornoQueryAI3(jsoneFormattato) {
    if (!this.act_id2) {
      return;
    }
    
    // // logConsole('Evento selezionato: ', this.rigaEventoSelezionato2, jsoneFormattato);
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
          tmsStart = this.tmsFrom2;
          tmsEnd = this.tmsTo2;
          event_row = null;
        } else {
          const e = this.rigaEventoSelezionato2;
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

      let prompt_data;
      if (this.modalitaEventi) {
        if (this.prompt_dt === 'msg_list') {
          prompt_data = this.converteJsonInCSV(this.datiPointActivityEvents2);
        } else {
          prompt_data = jsoneFormattato;
        }
      } else {
        /* prompt_data = this.datiCSV.CSV;
        let messaggio = 'Data in prompt_data are provided as csv separated by ";". First row contains column header.\n' +
          'Hereafter the description of each column:\n';
        this.datiCSV.DATI.forEach(element => {
          if (element.headerText && element.description) {
            messaggio += '\t' + element.headerText + ': ' + element.description + '\n';
          }
        }); */
        prompt_data = this.datiCSV.CSV;
        // req = this.prompt;
      }
      logConsole('Prompt data', prompt_data.split('\n').length);
      // return;

      // const base64 = btoa(unescape(encodeURIComponent(prompt_data)));
      const base64 = prompt_data;

      let codice = '';
      if (this.mappa_o_grafico === 'TC') {
        if (!this.tc_run_code) {
          Swal.fire({
            title: 'AI',
            text: "Please, first, select a row from tc run grid",
            icon: 'error',
            showClass: {
              backdrop: 'swal2-noanimation', // disable backdrop animation
              popup: '',                     // disable popup animation
              // icon: ''                       // disable icon animation
            },
          });
                  
          return;
        }
        codice = this.tc_run_code;
      } else {
        codice = this.act_id2;
      }
      const params = {
        v_cntx: this.sessionID2,
        v_title: titolo,
        v_description: descrizione,
        v_prompt: req,
        v_prompt_data: base64,
        v_tms_from: tmsStart,
        v_tms_to: tmsEnd,
        v_act_set_name_list: codice,
        v_aireq_template_hash_id: this.hashIdTemplate,
        v_event_row_id: event_row,
        v_api_call: this.apiCall,
        v_llm_profile_id: this.llm_profile_id,
        v_exec_folder: this.folder_id2,
        v_investigation_goal: this.investigation,
        v_expected_information_gain: null
      }
      
      // logConsole('Ritorno query ai. Params: ', this.datiPointActivityEvents2, params, prompt_data);
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
            this.tabSelezionato = 2;
            this.tmrAttivo = 'SI';
          }
        }
      }, error => {
        const errore = error.error.code + ': ' + error.error.message;
        alert(errore);
      });  
    // }
  }  

  /* attivaEdit(modalita) {
    this.modalitaEdit = modalita;
    let req = this.prompt;
    if (modalita) {
      while (req.indexOf('<br />') > -1) {
        req = req.replace('<br />', '\n');
      }
      while (req.indexOf('<br/>') > -1) {
        req = req.replace('<br/>', '\n');
      }
    } else {
      while (req.indexOf('\n') > -1) {
        req = req.replace('\n', '<br />');
      }
    }
    this.prompt = req;
  } */

  chiudeMaschera() {
      this.chiudiMaschera.emit(new Date().toString());
  }

  selectDTT(e) {
      // // // logConsole('Selezione combo', e);
      this.prompt_dt = e.name;
  }

  tabSelezionato = 1;

  onTabSelect(e) {
    // alert('Cambio tab: ' + e.index);

    this.tabSelezionato = e.index;
    // Con i tab mantenuti (keepTabContent) il cambio manuale non deve ricaricare nulla: si vedono i dati già caricati.
    // Prima qui si metteva 'SI' per il tab 1 (Node Library), cosa che ora farebbe ricaricare in background la History.
    // tmrAttivo = 'SI' resta solo dopo l'invio di una nuova investigation (che porta sul tab History e lo aggiorna).
    this.tmrAttivo = 'NO';
    // logConsole('tab :', e);
  }

  tabSelezionato2 = 0;

  onTabSelect2(e) {
    // alert('Cambio tab: ' + e.index);
    this.tabSelezionato2 = e.index;
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

  prendeNomiCampi(jasone) {
    /* if (jasone && jasone !== null) {
      Object.keys(jasone).forEach(element => {
        if (element) {
          // logConsole('Elemento', element);
          if (typeof(jasone[element]) === 'object') {
            if (!this.primaRiga) {
              this.primaRiga = true;
              this.prendeNomiCampi(jasone[element]);
            }
          } else {
            if (element.toUpperCase().indexOf('.FRM') === -1) {
              this.nomiCampi.push(element);
            }
          }
        }
      });
    } */

  }
  
  checkEdge(event) {
    this.Utils.edge = event;
    // this.scriveLog('edge:', event);
  }

  massimizza(come) {
    if (come) {
      // const nome = 'maskTemplate_' + this.NumeroFrame2;
      // const elemento = document.getElementById(nome) as HTMLElement;
      const rect = this.elementView.nativeElement.getBoundingClientRect();
      this.mascheraLeft = rect.left;
      this.mascheraTop = rect.top;
      this.mascheraWidth = rect.width;
      this.mascheraHeight = rect.height;
  
      /* this.mascheraLeft = this.elementView.nativeElement.clientLeft;
      this.mascheraTop = this.elementView.nativeElement.clientTop;
      this.mascheraWidth = this.elementView.nativeElement.clientWidth;
      this.mascheraHeight = this.elementView.nativeElement.clientHeight; */

      const computedStyle = window.getComputedStyle(this.elementView.nativeElement);
      const transform = computedStyle.transform; // Es: "matrix(1, 0, 0, 1, 40, 80)"

      // Estrai i valori di translate
      const matrix = transform.match(/matrix.*\((.+)\)/);
      if (matrix) {
        const values = matrix[1].split(', ');
        const translateX = parseFloat(values[4]); // 40
        const translateY = parseFloat(values[5]); // 80
        // logConsole('Translate X:', translateX, 'Translate Y:', translateY, values);
        this.mascheraTransform = 'translate(' + translateX + ', ' + translateY + ')';
      }

      // logConsole('Dimensioni Maschera Dopo', this.mascheraLeft, this.mascheraTop, this.mascheraWidth, this.mascheraHeight, this.mascheraTransform);
    }

    setTimeout(() => {
      this.massimizzata = come;
    }, 100);
  }

  ritornoDimensioniColonneTemplate(e) {
    ExternalUtilities.scriveDimensioniColonne('Template', e);
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

  eseguitoClickSuRiga = false;

  selectType(e) {
    logConsole('Tipo selezionato', e);
    this.typeScelto = e.VALUE_STR;
    this.salvaUltimoValoreNI('Type', this.typeScelto);
  }

  // Ultimi valori scelti (Type e Ver della New Investigation, Filter Folder della Node Library), salvati nel browser per utente
  private chiaveUltimoValoreNI(campo: string) {
    return 'Templates_NI_' + campo + '_' + (this.userName2 || this.userName || '');
  }

  leggeUltimoValoreNI(campo: string): string {
    try {
      return localStorage.getItem(this.chiaveUltimoValoreNI(campo)) || '';
    } catch (e) {
      return '';
    }
  }

  salvaUltimoValoreNI(campo: string, valore: string) {
    if (!valore) {
      return;
    }
    try {
      localStorage.setItem(this.chiaveUltimoValoreNI(campo), valore);
    } catch (e) {
    }
  }

  ultimoValueStrNI = '';
  filterFolderNI = '';
  // Valore iniziale della combo Ver (separato da filterFolder, che è il folder della Node Library)
  verDefaultNI = '';

  selectFilterFolderNI(e) {
    logConsole('Cartella selezionata NI', e);

    if (e.VALUE_STR) {
      if (this.ultimoValueStrNI === e.VALUE_STR) {
        return;
      }
      // Prima qui si aggiornava ultimoValueStr (della Node Library) e il controllo sopra non scattava mai
      this.ultimoValueStrNI = e.VALUE_STR;

      this.filterFolderNI = e.VALUE_STR;
      this.salvaUltimoValoreNI('Ver', this.filterFolderNI);
    }
  }

  startNI() {
    logConsole('Start NI. Type: ', this.typeScelto);
    logConsole('Start NI. Folder: ', this.filterFolderNI);
 
    if (!this.tc_run_code) {
      Swal.fire({
        title: 'AI',
        text: "Plese select a row on tc run grid",
        icon: 'error',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      });
      return;
    }

    if (!this.typeScelto) {
      Swal.fire({
        title: 'AI',
        text: "Plese select a type of investigation",
        icon: 'error',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      });
      return;
    }

    const params = {
      v_cntx: this.sessionID2,
      v_title: 'Start TcRun Investigation',
      v_description: 'Establish the initial investigation symptom from tc_run_outcome_all or provide here the investigation goal',
      v_prompt: null,
      v_prompt_data: null,
      v_tms_from: null,
      v_tms_to: null,
      v_exec_mode: this.typeScelto,
      v_act_set_name_list: this.tc_run_code,
      v_aireq_template_hash_id: 'c8c004a97aec19a402d908035ed7c252',
      v_event_row_id: null,
      v_api_call: null,
      v_llm_profile_id: null,
      v_exec_folder: this.filterFolderNI,
      v_investigation_goal: this.tc_run_failure,
      v_expected_information_gain: null
    }
    
    // logConsole('Ritorno query ai. Params: ', this.datiPointActivityEvents2, params, prompt_data);
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
          this.tabSelezionato = 2;
          this.tmrAttivo = 'SI';
        }
      }
    }, error => {
      const errore = error.error.code + ': ' + error.error.message;
      alert(errore);
    });
  }
}
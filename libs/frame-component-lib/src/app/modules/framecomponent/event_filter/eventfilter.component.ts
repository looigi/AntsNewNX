import { logConsole } from '../console-log';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";

@Component({
    templateUrl: 'eventfilter.component.html',
    selector: 'eventfilter-component',
    // changeDetection: ChangeDetectionStrategy.OnPush, // AGGIUNTO PER MEMORY LEAKES
    styleUrls: ['./eventfilter.style.css']
})

export class EventFilterComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() debug;
    @Input() linkIcone;
    @Input() vociTrovateJson;
    @Input() filtriAttivi;
    @Input() Log;
    @Input() numeroFrame;
    @Input() frameAttivo;
    @Input() measureData;
    @Input() userName;

    @Output() eventiFiltersEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() chiudeMaschera: EventEmitter<any> = new EventEmitter<any>();

    vecchiFiltri;
    columnCompressed = true;
    
    filtroImpostato;
    filtroEscluso;

    filtroAttivoPass;
  
    // messaggioFieldList = 'Field list';
    NumeroFrame2;
    FrameAttivo2;
    misuraSelezionata;
    filtriAttivi2;
    
    toolTip = 'Edit the Text Filter to filter all the messages containing such strings in the event name followed by the body.\n' +
      'Filter: "a b" matches events containing <a any_string b>\n' +
      'Filter: "(a b)|(c d)" matches messages containing <(a any_string b) or (c any_string d)>\n' +
      'Other regular expression are possible, the system automatically replaces white space with any string ".*"';

    toolTipExclude = 'Messages that satisfy this regular expression are excluded from the list.\n' +
      'Use same syntax for the above filter Include.\nThis filter usually is used to progressively exclude messages';

    tagIconaApplica = 'Inserts the “Actual selected Measure/Message Field” in this column';
    
    constructor(
    ) {

    }

    ngOnInit(): void {
      const fa = new Array();
      for (let i = 1; i < 21; i++) {
        fa.push({
          Campo: '',
          NomeColonna: ''
        });
      }
      const f = {
        filtroImpostato: '',
        filtroEscluso: '',
        filtriAttivi: fa
      }
      this.filtriAttivi2 = f;
      this.vecchiFiltri = JSON.parse(JSON.stringify(this.filtriAttivi2));
      // // logConsole('FILTRI', f);
    }

    ngAfterViewInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Events: Filtro eventi su maschera filtro', changes);
        if (changes['numeroFrame'] && changes['numeroFrame'].currentValue) {
          this.NumeroFrame2 = changes['numeroFrame'].currentValue;
        }

        if (changes['frameAttivo'] && changes['frameAttivo'].currentValue) {
          this.FrameAttivo2 = changes['frameAttivo'].currentValue;
        }

        if (changes['vociTrovateJson'] && changes['vociTrovateJson'].currentValue) {
            this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'EVENTS: Voci trovate:', this.vociTrovateJson);
            /* if (this.vociTrovateJson && this.vociTrovateJson.length > 1) {
              this.messaggioFieldList = 'Field list: the clicked field appears in different structure, select the desired one from the list below';
            } else {
              this.messaggioFieldList = 'Field list';
            } */
            this.filtroAttivoPass = changes['vociTrovateJson'].currentValue;
        }

        /* if (changes['filtroEventi']) {
          // alert('Filtro EF 1 Frame ' + this.NumeroFrame2 + ': ' + changes['filtroEventi'].currentValue);
          this.filtroAttivo = changes['filtroEventi'].currentValue;
          this.vecchioFiltro1 = this.filtroAttivo;
        }

        if (changes['filtroEscluso']) {
          // alert('Filtro EF 1 Frame ' + this.NumeroFrame2 + ': ' + changes['filtroEventi'].currentValue);
          this.filtroEscluso = changes['filtroEscluso'].currentValue;
          this.vecchioFiltroEscluso1 = this.filtroEscluso2;
        } */

        if (changes['filtriAttivi']) {
          // alert('Filtro EF 1 Frame ' + this.NumeroFrame2 + ': ' + changes['filtroEventi'].currentValue);
          if (changes['filtriAttivi'].currentValue) {
            this.filtriAttivi2 = undefined;

            const tm = setTimeout(() => {
              clearTimeout(tm);

              this.filtriAttivi2 = changes['filtriAttivi'].currentValue;
              this.filtroImpostato = this.filtriAttivi2.filtroImpostato;
              this.filtroEscluso = this.filtriAttivi2.filtroEscluso;
              this.columnCompressed = this.filtriAttivi2.columnCompressed;
              this.vecchiFiltri = JSON.parse(JSON.stringify(this.filtriAttivi2));
  
              logConsole('Filtri arrivati', this.NumeroFrame2, this.filtriAttivi2.filtriAttivi);                
            }, 100);
          } else {
            if (this.filtriAttivi2 && this.filtriAttivi2.filtriAttivi) {
              this.filtriAttivi2.filtriAttivi = new Array();
              this.vecchiFiltri = JSON.parse(JSON.stringify(this.filtriAttivi2));
            } else {
              this.filtriAttivi2 = undefined;
              this.vecchiFiltri = undefined;
            }
            this.filtroImpostato = '';
            this.filtroEscluso = '';
            this.columnCompressed = false;
    
            logConsole('Filtri puliti', this.NumeroFrame2, this.filtriAttivi2);                
          }
        }
        
        /* if (changes['filtroEventiCol1']) {
          this.filtroAttivoCol1 = changes['filtroEventiCol1'].currentValue;
          this.vecchioFiltroCol1 = this.filtroAttivoCol1;
        }
        if (changes['filtroEventiCol2']) {
          this.filtroAttivoCol2 = changes['filtroEventiCol2'].currentValue;
          this.vecchioFiltroCol2 = this.filtroAttivoCol2;
        }
        if (changes['filtroEventiCol3']) {
          this.filtroAttivoCol3 = changes['filtroEventiCol3'].currentValue;
          this.vecchioFiltroCol3 = this.filtroAttivoCol3;
        }
        if (changes['filtroEventiCol4']) {
          this.filtroAttivoCol4 = changes['filtroEventiCol4'].currentValue;
          this.vecchioFiltroCol4 = this.filtroAttivoCol4;
        }
        if (changes['filtroEventiCol5']) {
          this.filtroAttivoCol5 = changes['filtroEventiCol5'].currentValue;
          this.vecchioFiltroCol5 = this.filtroAttivoCol5;
        }
        if (changes['filtroEventiCol6']) {
          this.filtroAttivoCol6 = changes['filtroEventiCol6'].currentValue;
          this.vecchioFiltroCol6 = this.filtroAttivoCol6;
        }
        if (changes['filtroEventiCol7']) {
          this.filtroAttivoCol7 = changes['filtroEventiCol7'].currentValue;
          this.vecchioFiltroCol7 = this.filtroAttivoCol7;
        }
        if (changes['filtroEventiCol8']) {
          this.filtroAttivoCol8 = changes['filtroEventiCol8'].currentValue;
          this.vecchioFiltroCol8 = this.filtroAttivoCol8;
        }
        if (changes['filtroEventiCol9']) {
          this.filtroAttivoCol9 = changes['filtroEventiCol9'].currentValue;
          this.vecchioFiltroCol9 = this.filtroAttivoCol9;
        }
        if (changes['filtroEventiCol10']) {
          this.filtroAttivoCol10 = changes['filtroEventiCol10'].currentValue;
          this.vecchioFiltroCol10 = this.filtroAttivoCol10;
        }

        if (changes['filtroEventiCol11']) {
          this.filtroAttivoCol11 = changes['filtroEventiCol11'].currentValue;
          this.vecchioFiltroCol11 = this.filtroAttivoCol11;
        }
        if (changes['filtroEventiCol12']) {
          this.filtroAttivoCol12= changes['filtroEventiCol12'].currentValue;
          this.vecchioFiltroCol12 = this.filtroAttivoCol12;
        }
        if (changes['filtroEventiCol13']) {
          this.filtroAttivoCol13 = changes['filtroEventiCol13'].currentValue;
          this.vecchioFiltroCol13 = this.filtroAttivoCol13;
        }
        if (changes['filtroEventiCol14']) {
          this.filtroAttivoCol14 = changes['filtroEventiCol14'].currentValue;
          this.vecchioFiltroCol14 = this.filtroAttivoCol14;
        }
        if (changes['filtroEventiCol15']) {
          this.filtroAttivoCol15 = changes['filtroEventiCol15'].currentValue;
          this.vecchioFiltroCol15 = this.filtroAttivoCol15;
        }
        if (changes['filtroEventiCol16']) {
          this.filtroAttivoCol16 = changes['filtroEventiCol16'].currentValue;
          this.vecchioFiltroCol16 = this.filtroAttivoCol16;
        }
        if (changes['filtroEventiCol17']) {
          this.filtroAttivoCol17 = changes['filtroEventiCol17'].currentValue;
          this.vecchioFiltroCol17 = this.filtroAttivoCol17;
        }
        if (changes['filtroEventiCol18']) {
          this.filtroAttivoCol18 = changes['filtroEventiCol18'].currentValue;
          this.vecchioFiltroCol18 = this.filtroAttivoCol18;
        }
        if (changes['filtroEventiCol19']) {
          this.filtroAttivoCol19 = changes['filtroEventiCol19'].currentValue;
          this.vecchioFiltroCol19 = this.filtroAttivoCol19;
        }
        if (changes['filtroEventiCol20']) {
          this.filtroAttivoCol20 = changes['filtroEventiCol20'].currentValue;
          this.vecchioFiltroCol20 = this.filtroAttivoCol20;
        } */
    }
    
    chiudeSceltaFilter() {
      // alert('Filtro EF 2 Frame ' + this.NumeroFrame2 + ': ' + this.vecchioFiltro1);
      this.filtriAttivi2.filtriAttivi = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        this.filtroImpostato = this.vecchiFiltri.filtroImpostato;
        this.filtroEscluso = this.vecchiFiltri.filtroEscluso;
        this.filtriAttivi2.filtriAttivi = JSON.parse(JSON.stringify(this.vecchiFiltri.filtriAttivi));
      }, 100);
      /* this.filtroAttivoCol1 = this.vecchioFiltroCol1;
      this.filtroAttivoCol2 = this.vecchioFiltroCol2;
      this.filtroAttivoCol3 = this.vecchioFiltroCol3;
      this.filtroAttivoCol4 = this.vecchioFiltroCol4;
      this.filtroAttivoCol5 = this.vecchioFiltroCol5;
      this.filtroAttivoCol6 = this.vecchioFiltroCol6;
      this.filtroAttivoCol7 = this.vecchioFiltroCol7;
      this.filtroAttivoCol8 = this.vecchioFiltroCol8;
      this.filtroAttivoCol9 = this.vecchioFiltroCol9;
      this.filtroAttivoCol10 = this.vecchioFiltroCol10;
      this.filtroAttivoCol11 = this.vecchioFiltroCol11;
      this.filtroAttivoCol12 = this.vecchioFiltroCol12;
      this.filtroAttivoCol13 = this.vecchioFiltroCol13;
      this.filtroAttivoCol14 = this.vecchioFiltroCol14;
      this.filtroAttivoCol15 = this.vecchioFiltroCol15;
      this.filtroAttivoCol16 = this.vecchioFiltroCol16;
      this.filtroAttivoCol17 = this.vecchioFiltroCol17;
      this.filtroAttivoCol18 = this.vecchioFiltroCol18;
      this.filtroAttivoCol19 = this.vecchioFiltroCol19;
      this.filtroAttivoCol20 = this.vecchioFiltroCol20; */

      this.chiudeMaschera.emit(new Date().toString());
    }
  
    prendeComeEvento() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          // alert('Filtro EF 3 Frame ' + this.NumeroFrame2 + ': ' + this.filtroAttivoPass);
          this.filtroImpostato = this.filtroAttivoPass;        
        }
      }
    }
  
    prendeComeEventoCol(idRiga) {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (typeof(this.filtroAttivoPass) === 'object') { this.filtroAttivoPass = this.filtroAttivoPass[0]; }
        // // logConsole('Prima', this.filtroAttivoPass, JSON.parse(JSON.stringify(this.filtriAttivi2)));
        this.filtriAttivi2.filtriAttivi[idRiga].Campo = this.filtroAttivoPass;
        /* // logConsole('Dopo', JSON.parse(JSON.stringify(this.filtriAttivi2)));
        const fa = JSON.parse(JSON.stringify(this.filtriAttivi2.filtriAttivi));
        this.filtriAttivi2.filtriAttivi = undefined;
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.filtriAttivi2.filtriAttivi = JSON.parse(JSON.stringify(fa));
        }, 100); */
      }
    }
  
    /* prendeComeEventoCol1() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol1 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol2() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol2 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol3() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol3 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol4() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol4 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol5() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol5 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol6() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol6 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol7() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol7 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol8() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol8 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol9() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol9 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol10() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol10 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol11() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol11 = this.filtroAttivoPass;
        }
      }
    }
    
    prendeComeEventoCol12() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol12 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol13() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol13 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol14() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol14 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol15() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol15 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol16() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol16 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol17() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol17 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol18() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol18 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol19() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol19 = this.filtroAttivoPass;
        }
      }
    }
  
    prendeComeEventoCol20() {
      if (this.filtroAttivoPass) {
        if (this.filtroAttivoPass.Percorso) { this.filtroAttivoPass = this.filtroAttivoPass.Percorso; }
        if (this.filtroAttivoPass) {
          this.filtroAttivoCol20 = this.filtroAttivoPass;
        }
      }
    } */

    inviaFiltri(chiude) {
      // this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Invio filtri');
      this.eventFiltersEmit(chiude);
    }
  
    eventFiltersEmit(chiude) {
      this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Invio filtro', this.filtroImpostato);
  
      const invio = {
        filtroImpostato: '',
        filtriAttivi: new Array(),
        /* filtroAttivoCol1: '',
        filtroAttivoCol2: '',
        filtroAttivoCol3: '',
        filtroAttivoCol4: '',
        filtroAttivoCol5: '',
        filtroAttivoCol6: '',
        filtroAttivoCol7: '',
        filtroAttivoCol8: '',
        filtroAttivoCol9: '',
        filtroAttivoCol10: '',
        filtroAttivoCol11: '',
        filtroAttivoCol12: '',
        filtroAttivoCol13: '',
        filtroAttivoCol14: '',
        filtroAttivoCol15: '',
        filtroAttivoCol16: '',
        filtroAttivoCol17: '',
        filtroAttivoCol18: '',
        filtroAttivoCol19: '',
        filtroAttivoCol20: '', */
        chiudeMaschera: false,
        filtroEscluso: '',
        columnCompressed: this.columnCompressed
      }

      if (this.filtroImpostato && this.filtroImpostato !== null) {
          // this.scriveLog(this.filtroAttivo);
        // localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_event_filter', this.filtroAttivo);
        let ee = this.filtroImpostato;
        while (ee.indexOf('\'') > -1) {
          ee = ee.replace('\'', ' ');
        }
        while (ee.indexOf('"') > -1) {
          ee = ee.replace('"', ' ');
        }
        while (ee.indexOf(':') > -1) {
          ee = ee.replace(':', ' ');
        }
        invio.filtroImpostato = ee;
      }

      if (this.filtroEscluso && this.filtroEscluso !== null) {
        // this.scriveLog(this.filtroAttivo);
        // localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_event_filter', this.filtroAttivo);
        let ee = this.filtroEscluso;
        while (ee.indexOf('\'') > -1) {
          ee = ee.replace('\'', ' ');
        }
        while (ee.indexOf('"') > -1) {
          ee = ee.replace('"', ' ');
        }
        while (ee.indexOf(':') > -1) {
          ee = ee.replace(':', ' ');
        }
        invio.filtroEscluso = ee;
      }

      this.filtriAttivi2.filtriAttivi.forEach(element => {
        if (element && element !== null && element !== '') {
          // this.scriveLog(this.filtroAttivo);
          // localStorage.setItem(this.returnUserName() + '_grid_' + this.maskName + '_event_filter', this.filtroAttivo);
          let ee = element;
          while (ee.Campo.indexOf('\'') > -1) {
            ee.Campo = ee.Campo.replace('\'', ' ');
          }
          while (ee.Campo.indexOf('"') > -1) {
            ee.Campo = ee.Campo.replace('"', ' ');
          }
          while (ee.Campo.indexOf(':') > -1) {
            ee.Campo = ee.Campo.replace(':', ' ');
          }
          invio.filtriAttivi.push(ee);
        } else {
          invio.filtriAttivi.push('');
        }
      });

      invio.chiudeMaschera = chiude;
      // logConsole('INVIO FILTRO', invio);

      this.eventiFiltersEmit.emit(invio);
    }

    clickSuFiltro(e) {
      this.debug && this.Log?.scriveLog(this, this.debug, this.Log.getMethodName(), false, e);
      this.filtroAttivoPass = e; // .Percorso;
      /* const nv = new Array();
      this.vociTrovateJson.forEach(element => {
        if (element.Percorso === e.Percorso) {
          element.Selezionato = true;
        } else {
          element.Selezionato = false;
        }
        nv.push(element);
      });
      this.vociTrovateJson = nv; */
    }
  
    selectMisuraFilter(e) {
      // logConsole('Misura selezionata', e);
      this.filtroAttivoPass = e.DISPLAY_NAME;
    }

    checkColumnCompressed() {
      this.columnCompressed = !this.columnCompressed;
      // alert (this.columnCompressed);
    }
}

import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, 
  ChangeDetectionStrategy,SimpleChanges } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ClipboardService } from "ngx-clipboard";

@Component({
    templateUrl: 'jsonComponent.component.html',
    selector: 'jsone-component',
    styleUrls: ['./jsonComponent.style.css']
})

export class JsonComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() debug;
  @Input() linkIcone;
  @Input() lista;
  @Input() numeroFrame;
  @Input() frameAttivo;
  @Input() coloreRamo = 'blue';
  @Input() coloreValore = '#9d0000';
  @Input() coloreRicerca = 'yellow';
  @Input() coloreRicercaRiga = '#e1d91a';
  @Input() coloreClickato = '#f4511e';
  @Input() coloreSfondo = 'white';
  @Input() coloreSfondoHeader = 'white';
  @Input() fontSize = 12;
  @Input() interlinea = 13;
  // Andata a capo automatica delle righe troppo lunghe (attivabile con l'icona prima della lente)
  @Input() aCapoAutomatico = false;
  @Input() dimensioneDiv;
  @Input() ritornaJsonFormattato = '';
  @Input() totaleRighe = 0;
  @Input() bloccaCaricamento;
  @Input() eseguiRondella = true;
  
  @Output() rigaPremuta: EventEmitter<string> = new EventEmitter<string>();
  @Output() applicaRicercaEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() passaggioRicerca: EventEmitter<string> = new EventEmitter<string>();
  @Output() jsonFormattato: EventEmitter<string> = new EventEmitter<string>();

  lista2;
  caricamentoInCorso = false;
  // indentazione = 10;
  ramoApertoDefault = true;
  ricerca = '';
  ricercaCampo = '';
  numeroFrame2;
  frameAttivo2;
  ultimaLista = '';
  // elementiTrovati = 0;
  riga = 0;
  rigaSelezionata = -1;
  elementiTrovatiArray = new Array();
  elementoVisualizzato = 0;
  rilevati = '';

  inizioContY = 0;
  fineContY = 0;
  // altezza = 0;
  // ultimaRigaVisibile = 0;
  massimo;
  max;
  contDivJson;
  elementiChiusi = 0;
  righePiuMeno = 100;
  clickPerNonEseguireSelezione = false;
  campoSelezionato = '';
  tooltipRitorno = '';

  constructor(
    private sr: DomSanitizer,
    private clip: ClipboardService
    // public safeComment: CommentPipe
  ) {
  }

  ngOnInit(): void {
      
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(r): void {
    if (r.ritornaJsonFormattato) {
      if (r.ritornaJsonFormattato.currentValue) {
        this.copiaInClipboard(true);
      }
    }

    if (r.lista && r.lista.currentValue) {
      // this.totaleRighe = 0;
      // console.log('Spendgo totale righe 1');
      this.bloccaElaborazione = false;
      this.caricamentoInCorso = true;

      const jasone = r.lista.currentValue;
      this.lista2 = new Array();
      this.riga = 0;
      // this.rigaSelezionata = -1;
      this.elementiTrovatiArray = new Array();
      this.elementoVisualizzato = 0;
      if (this.contDivJson && this.contDivJson !== null) {
        this.contDivJson.scrollTop = 0;
      }
      this.inizioContY = 0;
      this.fineContY = this.righePiuMeno;
      this.rilevati = '';
      this.massimo = 0;
      this.elementiChiusi = 0;
      // this.altezza = 0;

      // this.creaArray('', jasone);
      this.esegueCreaArray(jasone);
    } else {
      if (r.lista && (r.lista.currentValue === null || r.lista.currentValue === undefined || r.lista.currentValue === '')) {
        this.lista2 = new Array();
        this.totaleRighe = 0;
        // console.log('Spendgo totale righe 2');
        this.bloccaElaborazione = true;
        this.caricamentoInCorso = false;
      }
    }

    if (r.bloccaCaricamento && r.bloccaCaricamento.currentValue) {
      this.bloccaElaborazione = true;
    }

    if (r.numeroFrame) {
      this.numeroFrame2 = r.numeroFrame.currentValue;
      this.controllaCookie();
      
      let c = 0;
      const t = setInterval(() => {
        if (!this.contDivJson || this.contDivJson === null) {
          this.contDivJson = document.getElementById('contDivJson_' + this.numeroFrame2);
          // // console.log('Impostazione contenitore', this.contDivJson);
          if (this.contDivJson && this.contDivJson === null) {
            clearInterval(t);
            this.calcolaSpostamentoDiv();  
          } else {
            c++;
          }
        } else {
          clearInterval(t);
          this.calcolaSpostamentoDiv();  
        }    
      }, 100);
    }

    if (r.frameAttivo) {
      this.frameAttivo2 = r.frameAttivo.currentValue;
      
      this.controllaCookie();
    }
    
    if (r.dimensioneDiv) {
      if (r.dimensioneDiv.currentValue) {
        const height = r.dimensioneDiv.currentValue;
        // // console.log('Dimensione div: ', height);
        const righe = ((height / this.interlinea) + 10) + 50;
        this.righePiuMeno = righe;
        // // console.log('Dimensione div - Righe Più o meno: ', righe);
      }
    }
  }

  async esegueCreaArray(jasone) {
    this.startElaborazione(jasone);

    if (!this.bloccaElaborazione) {
      this.max = (+this.massimo + 1).toString().trim();
      /* this.lista2.forEach(element => {
        const idRiga = element.idRiga.toString().trim();
        let idRigaForm = (+idRiga).toString().trim();
        for (let i = (+idRiga).toString().trim().length; i < max.length; i++) {
          idRigaForm = '0' + idRigaForm;
        }
        element['idRigaForm'] = idRigaForm;
      }); */
      if (this.debug) {
        // console.log('jsone: ', this.lista2);
      }

      this.controllaCookie();

      const t = setTimeout(() => {
        clearTimeout(t);
        
        this.fRicerca();
        this.caricamentoInCorso = false;
      }, 500);
    } else {
      this.lista2 = new Array();
      this.totaleRighe = 0;
      // console.log('Spendgo totale righe 3');
    }
  }

  ritornaNumeroFormattato(j) {
    // Numero di riga con tante cifre quante quelle del numero di riga più alto (es. 250 righe: 001 ... 250).
    // Si usa massimo, aggiornato man mano che le righe vengono create: max veniva calcolato una sola volta, prima
    // che la creazione (a blocchi, asincrona) fosse finita, e il numero di cifre risultava sbagliato.
    const cifre = Math.max(String(+this.massimo || 0).length, 1);
    const idRiga = j.idRiga.toString().trim();
    return (+idRiga).toString().trim().padStart(cifre, '0');
  }

  ritornaMargine(j) {
    const profondita = j.Path.split(',');
    return +((profondita.length - 1) * (this.fontSize - 1));
  }

  controllaCookie() {
    if (this.lista2 && this.numeroFrame2 !== undefined && this.frameAttivo2 !== undefined) {
      // // console.log('Ricerca', this.lista2);
      if (this.ultimaLista !== JSON.stringify(this.lista2)) {
        this.ultimaLista = JSON.stringify(this.lista2);
        const ricerca = localStorage.getItem('JSON_Search_' + this.numeroFrame2 + '_' + this.frameAttivo2);
        if (ricerca && ricerca !== null) {
          this.ricercaCampo = ricerca;
          
          this.fRicerca();
        }
      }
    }
  }

  creaArray_Vecchio(pathRamo, jasone) {
    if (jasone && jasone !== null) {
      Object.keys(jasone).forEach(element => {
        if (element) {
          this.riga++;
          if (this.riga > this.massimo) {
            this.massimo = this.riga;
          }
          const profondita = (pathRamo + element).split(',');
          const pathRamoNuovo = (pathRamo ? (pathRamo + ',') : '') + this.riga.toString();

          if (typeof(jasone[element]) === 'object') {
            this.lista2.push({ 
              idRiga: +this.riga,
              // Margine: (profondita.length - 1) * (this.fontSize - 2),
              Ramo: element.toString(), 
              Valore: '',
              Path: pathRamoNuovo,
              RamoAperto: profondita.length === 1 ? true : this.ramoApertoDefault,
              IconaAperta: this.ramoApertoDefault,
              isRamo: true,
              Over: false
            });
            
            const t = setTimeout(() => {
              clearTimeout(t);

              this.creaArray_Vecchio(pathRamoNuovo, jasone[element]);
            }, 10);
          } else {
            this.lista2.push({
              idRiga: +this.riga,
              // Margine: (profondita.length - 1) * (this.fontSize - 2),
              Ramo: element.toString(), 
              Valore: jasone[element].toString(),
              Path: pathRamoNuovo,
              RamoAperto: this.ramoApertoDefault,
              isRamo: false,
              Over: false
            });
          }
        }
      });
    }
  }

  CHUNK_SIZE = 350; // regolabile
  bloccaElaborazione = false;

  async startElaborazione(json: any) {
    this.riga = 0;
    this.massimo = 0;
    this.lista2 = new Array();

    const buffer: any[] = [];
    const visited = new WeakSet<any>(); // per prevenire cicli infiniti

    await this.creaArray('', json, buffer, visited);

    // Flush finale
    if (!this.bloccaElaborazione) {
      if (buffer.length > 0) {
        this.lista2.push(...buffer);
      }
    } else {
      this.lista2 = new Array();
      this.totaleRighe = 0;
      // console.log('Spendgo totale righe 4');
    }
  }
  
  async creaArray(
    pathRamo: string,
    jasone: any,
    buffer: any[],
    visited: WeakSet<any>
  ) {
    if (this.bloccaElaborazione) {
      this.lista2 = new Array();
      this.totaleRighe = 0;
      // console.log('Spendgo totale righe 5');
      return;
    }

    // Solo oggetti e array validi; evita null o primitivi
    if (!jasone || typeof jasone !== 'object') return;

    if (visited.has(jasone)) {
      // console.warn(`Ciclo rilevato al path: ${pathRamo}`);
      return; // evita ricorsione infinita
    }

    visited.add(jasone);

    const entries = Array.isArray(jasone)
      ? jasone.map((val, idx) => [idx, val])
      : Object.entries(jasone);

    for (const [key, valore] of entries) {
      this.riga++;
      this.massimo = Math.max(this.massimo, this.riga);

      const pathRamoNuovo = pathRamo ? `${pathRamo},${this.riga}` : `${this.riga}`;

      if (valore && typeof valore === 'object') {
        // Ramo (oggetto o array)
        buffer.push({
          idRiga: this.riga,
          Ramo: key.toString(),
          Valore: '',
          Path: pathRamoNuovo,
          RamoAperto: this.ramoApertoDefault,
          IconaAperta: this.ramoApertoDefault,
          isRamo: true,
          Over: false
        });

        if (buffer.length >= this.CHUNK_SIZE) {
          this.lista2.push(...buffer);
          buffer.length = 0;
          await new Promise(r => setTimeout(r, 0));
        }

        if (!this.bloccaElaborazione) {
          await this.creaArray(pathRamoNuovo, valore, buffer, visited);
        } else {
          this.lista2 = new Array();
          this.totaleRighe = 0;
          // console.log('Spendgo totale righe 6');
        }

      } else {
        // Foglia (valore primitivo o null)
        buffer.push({
          idRiga: this.riga,
          Ramo: key.toString(),
          Valore: valore?.toString() ?? '',
          Path: pathRamoNuovo,
          RamoAperto: this.ramoApertoDefault,
          isRamo: false,
          Over: false
        });

        if (buffer.length >= this.CHUNK_SIZE) {
          this.lista2.push(...buffer);
          buffer.length = 0;

          if (!this.bloccaElaborazione) {
            await new Promise(r => setTimeout(r, 0));
          } else {
            this.lista2 = new Array();
            this.totaleRighe = 0;
            // console.log('Spendgo totale righe 7');
          }
        }
      }
    }
  }

  ApriRamo(elemento) {
    this.clickPerNonEseguireSelezione = true;
    // // console.log('apri ramo');
    // // console.log('Apro ramo', elemento.Path);
    elemento.IconaAperta = true;
    this.lista2.forEach(element => {
      if (element.Path.indexOf(elemento.Path) > -1) {
        if (this.elementiChiusi > 0) { this.elementiChiusi--; }
        element.RamoAperto = true;
        element.IconaAperta = true;
      }
    });

    setTimeout(() => {
      this.clickPerNonEseguireSelezione = false;
    }, 500);
  }

  Apri1Ramo(elemento) {
    this.clickPerNonEseguireSelezione = true;
    // // console.log('Apro ramo 1', elemento.Path);
    elemento.IconaAperta = true;
    let ok = false;
    // const daChiudere = new Array();
    this.lista2.forEach(element => {
      if (element.Path.indexOf(elemento.Path) > -1) {
        const oltre = element.Path.substring(elemento.Path.length, element.Path.length);
        const quanteVirgole = oltre.split(',').length;
        // // console.log(oltre, quanteVirgole, element.Path, element.Tipologia);
        if (quanteVirgole === 1 && element.isRamo) {
          this.elementiChiusi++;
          element.RamoAperto = true;
          element.IconaAperta = true;
  
          // ok = true;
          // daChiudere.push(element);
        } else {
          if (oltre.split(',').length === 2) {
            this.elementiChiusi++;
            element.RamoAperto = true;
          } else {
            if (oltre.split(',').length === 2 && !element.isRamo) {
            }
          }
        }
      }
    });
    // // console.log('Da Chiudere', daChiudere);
    /* daChiudere.forEach(element => {
      this.ChiudiRamo(element);
    }); */

    setTimeout(() => {
      this.clickPerNonEseguireSelezione = false;
    }, 500);
  }

  ChiudiRamo(elemento) {
    this.clickPerNonEseguireSelezione = true;
    // // console.log('Chiudo ramo', elemento.Path);
    elemento.IconaAperta = false;
    this.lista2.forEach(element => {
      if (element.Path.indexOf(elemento.Path + ',') > -1) {
        this.elementiChiusi++;
        element.RamoAperto = false;
        element.IconaAperta = false;
      }
    });
    // // console.log('Numero elementi chiusi', this.elementiChiusi);

    setTimeout(() => {
      this.clickPerNonEseguireSelezione = false;
    }, 500);
  }

  openAll() {
    this.lista2.forEach(element => {
      element.RamoAperto = true;
      element.IconaAperta = true;
    });
  }

  closeAll() {
    this.lista2.forEach(element => {
      const margine = element.Margine;
      if (margine > 0) {
        element.RamoAperto = false;
      }
      element.IconaAperta = false;
    });
  }

  ritornaRicerca(idRiga, Testo, Ramo) {
    let ritorno = Testo;
    
    // // console.log('Ritorna ricerca', ritorno, Riga, this.rigaSelezionata);
    if (ritorno && ritorno !== null) {
      if (this.ricerca) {      
        const carattere = (ritorno.toUpperCase().trim()).indexOf(this.ricerca.toUpperCase().trim());
        if (carattere > -1) {
          // // console.log(ritorno.toUpperCase().trim(), this.ricerca.toUpperCase().trim(), carattere);

          const inizio = ritorno.substring(0, carattere);
          const fine = ritorno.substring(carattere + this.ricerca.length, ritorno.length);
          const ricerca = ritorno.substring(carattere, carattere + this.ricerca.length);

          if (this.elementiTrovatiArray[this.elementoVisualizzato]) {
            if (idRiga === this.elementiTrovatiArray[this.elementoVisualizzato].Riga) {
              ritorno = inizio + '<span style="background-color:  ' + this.coloreRicercaRiga + ';">' + ricerca + '</span>' + fine;
            } else {
              ritorno = inizio + '<span style="background-color:  ' + this.coloreRicerca + ';">' + ricerca + '</span>' + fine;
            }
          }
        }
      }
      if (Ramo) {
        ritorno += ':&nbsp;';
      } else {
        // Valore con "\n": va a capo (le linee successive restano allineate sotto l'inizio del valore)
        ritorno = String(ritorno).replace(JsonComponent.A_CAPO, '<br>');
      }
    }

    // const campo = document.getElementById('riga_' + this.numeroFrame + '_' + idRiga);
    // campo.innerHTML = ritorno;
    
    return this.sr.bypassSecurityTrustHtml(ritorno);
  }

  ritornaVisibilita(j) {
    // Con l'andata a capo automatica l'altezza delle righe dipende dalla larghezza della finestra e non si può
    // calcolare dalla posizione: si disegnano tutte le righe
    if (this.aCapoAutomatico) {
      return true;
    }
    // // console.log('posY', j.idRiga, chiusi, this.inizioContY, this.fineContY);
    if (j.idRiga >= this.inizioContY && (j.idRiga - this.elementiChiusi) <= this.fineContY) {
      return true;
    } else {
      return false;
    }
  }

  // A capo nei valori: un "\n" (carattere di nuova riga, oppure la sequenza \n scritta come testo) manda a capo il valore
  private static readonly A_CAPO = /\r\n|\n|\r|\\n/g;

  // Numero di linee occupate da una riga (1 se il valore non va a capo); memorizzato sulla riga
  righeValore(j): number {
    if (!j) {
      return 1;
    }
    if (j.righeValore === undefined || j.valoreContato !== j.Valore) {
      const testo = !j.isRamo && j.Valore ? String(j.Valore) : '';
      const aCapo = testo ? testo.match(JsonComponent.A_CAPO) : null;
      j.righeValore = aCapo ? aCapo.length + 1 : 1;
      j.valoreContato = j.Valore;
    }
    return j.righeValore;
  }

  // Per ogni riga, linee in più (per gli a capo) delle righe che la precedono
  private lineeExtraPrima: number[] = [];
  private lineeExtraPer;
  private lineeExtraLunghezza = -1;

  private aggiornaLineeExtra() {
    if (this.lineeExtraPer === this.lista2 && this.lineeExtraLunghezza === (this.lista2 ? this.lista2.length : 0)) {
      return;
    }
    this.lineeExtraPer = this.lista2;
    this.lineeExtraLunghezza = this.lista2 ? this.lista2.length : 0;
    this.lineeExtraPrima = new Array(this.lineeExtraLunghezza);
    let extra = 0;
    for (let i = 0; i < this.lineeExtraLunghezza; i++) {
      this.lineeExtraPrima[i] = extra;
      extra += this.righeValore(this.lista2[i]) - 1;
    }
  }

  // Riga (idRiga) che si trova alla linea indicata, tenendo conto delle righe che vanno a capo
  private rigaDaLinea(linea: number): number {
    this.aggiornaLineeExtra();
    const n = this.lineeExtraLunghezza;
    if (n === 0 || this.lineeExtraPrima[n - 1] === 0) {
      return linea;
    }
    // Ultima riga i con posizione (i + linee extra prima di i) <= linea
    let basso = 0;
    let alto = n - 1;
    while (basso < alto) {
      const medio = Math.ceil((basso + alto) / 2);
      if (medio + this.lineeExtraPrima[medio] <= linea) {
        basso = medio;
      } else {
        alto = medio - 1;
      }
    }
    const riga = this.lista2[basso];
    return riga && riga.idRiga !== undefined ? +riga.idRiga : basso;
  }

  calcolaSpostamentoDiv() {
    this.contDivJson = document.getElementById('contDivJson_' + this.numeroFrame2);
    if (this.contDivJson && this.contDivJson !== null) {
      const c1 = this.contDivJson.getBoundingClientRect();

      // Le posizioni sono in linee; con valori su più linee (a capo) la riga in cima non è più scrollTop / interlinea
      const lineaInizio = this.contDivJson.scrollTop / this.interlinea;
      const lineaFine = lineaInizio + (c1.height / this.interlinea);
      this.inizioContY = this.rigaDaLinea(lineaInizio) - this.righePiuMeno;
      // if (this.inizioContY < 0) { this.inizioContY = 0; }
      this.fineContY = this.rigaDaLinea(lineaFine) + this.righePiuMeno;

      // // console.log('Limiti: ', this.inizioContY, this.fineContY);
    } else {
      // console.error('DIV CONT JSON NON RILEVATO');
    }
  }

  spostaDiv() {
    if (this.ricerca) {
      let quale = this.elementiTrovatiArray[this.elementoVisualizzato].Riga;
      if (quale < 0) {
        quale = 0;
      }
      const carattere = this.elementiTrovatiArray[this.elementoVisualizzato].Carattere;
      this.contDivJson = document.getElementById('contDivJson_' + this.numeroFrame);
      
      if (this.contDivJson && this.contDivJson !== null) {
        const c1 = this.contDivJson.getBoundingClientRect();

        const inizioY = this.contDivJson.scrollTop; // 
        const fineY = (inizioY + c1.height) - 20; // //  + contDivJson.scrollTop;
        const fineX = c1.width;

        const nomeTag = 'target_' + this.numeroFrame + '_' + quale;
        const p1 = document.getElementById(nomeTag);
        if (p1 && p1 !== null) {
          // const pp1 = p1.getBoundingClientRect();
          
          // // console.log('scroll altezza contenitore', c1.top);
          // // console.log('scroll altezza riga dove andare', pp1.top);
          
          let alt = p1.offsetTop - (this.interlinea * 2); // - c1.top - 50;
          // console.log('scroll nome tag', inizioY, fineY, alt);
          // if (alt < 0) { alt = 0; }

          // // console.log('scroll altezza riga destinazione', alt);
          // // console.log('scroll inizio', inizioY);
          // // console.log('scroll fine', fineY);

          // this.contDivJson.scrollTop = alt;
          let dest = carattere * (this.fontSize * 0.5);
          if (dest > fineX) {
            this.contDivJson.scrollLeft = dest;
          } else {
            this.contDivJson.scrollLeft = 0;
          }

          if (alt < inizioY || alt > fineY) {
            this.contDivJson.scrollTop = alt;
          }

          // // console.log('scroll larghezza riga destinazione', carattere);
          // // console.log('scroll larghezza contenitore', fineX);

          /* if (carattere > fineX) {
            this.contDivJson.scrollLeft = carattere;
          } else {
            this.contDivJson.scrollLeft = 0;
          } */
        }
      }

      this.rilevati = (this.elementoVisualizzato + 1) + '/' + (this.elementiTrovatiArray.length);
    }
  }

  ultimaRicerca = '';
  timerRicerca;

  fRicerca() {
    if (!this.timerRicerca) {
      this.timerRicerca = setInterval(() => {
        // // console.log('Ricerca', this.ricercaCampo, this.ultimaRicerca);
        if (this.ricercaCampo !== this.ultimaRicerca) {
          this.ultimaRicerca = this.ricercaCampo;
        } else {
          // console.log('Eseguo Ricerca', this.ricercaCampo, this.ultimaRicerca);
          clearInterval(this.timerRicerca);
          this.timerRicerca = undefined;
          this.ultimaRicerca = '';
          this.fRicercaInvio();
        }
      }, 500)
    }
  }

  fRicercaInvio() {
    // alert('invio ricerca:' + this.ricercaCampo);
    this.ricerca = this.ricercaCampo;
    this.passaggioRicerca.emit(this.ricerca);
    localStorage.setItem('JSON_Search_' + this.numeroFrame2 + '_' + this.frameAttivo2, this.ricerca);

    this.elementiTrovatiArray = new Array();
    this.elementoVisualizzato = 0;
    this.rilevati = '';
    const cosa = this.ricerca.toUpperCase().trim();
    this.lista2.forEach(element => {
      if (element.Ramo.toUpperCase().trim().indexOf(cosa) > -1 || element.Valore.toUpperCase().trim().indexOf(cosa) > -1) {
        const a1 = element.Ramo.toUpperCase().trim().indexOf(cosa);
        const b1 = element.Valore.toUpperCase().trim().indexOf(cosa);
        let largh = 0;
        if (a1 > b1) { 
          largh = a1; 
        } else { 
          largh = b1; 
        }
        // largh *= (this.fontSize * 0.5);
        // largh += element.Margine;
        this.elementiTrovatiArray.push({ Riga: element.idRiga, Carattere: largh });
      }
    });

    if (this.elementiTrovatiArray.length > 0) {
      this.elementoVisualizzato = 0;

      this.spostaDiv();
    }
  }

  clickRiga(elemento) {
    if (this.clickPerNonEseguireSelezione) {
      return;
    }

    this.rigaSelezionata = +elemento.idRiga;
    // // console.log('Riga selezionata', this.rigaSelezionata);
    const elementoRitorno = JSON.parse(JSON.stringify(elemento));
    const righe = elementoRitorno.Path.split(',');
    let path = '';
    righe.forEach(element => {
      if (this.lista2[(+(element) - 1)]) {
        path += this.lista2[(+(element) - 1)].Ramo + ',';
      }
    });

    // path += elemento.Ramo + ',';
    if (path.substring(path.length - 1, path.length)) {
      path = path.substring(0, path.length - 1);
    }
    this.campoSelezionato = elemento.Ramo + ':' + elemento.Valore;
    this.tooltipRitorno = 'Return to selected row (' + elemento.idRiga + ')';
    // elementoRitorno.PathOriginale = elementoRitorno.Path;
    elementoRitorno.Path = path;

    let ok = false;
    let q = 0;
    this.elementiTrovatiArray.forEach(element => {
      const quale = element.Riga;
      if (!ok && quale >= this.rigaSelezionata) {
        this.elementoVisualizzato = q;
        this.rilevati = (this.elementoVisualizzato + 1) + '/' + (this.elementiTrovatiArray.length);

        // this.spostaDiv();

        ok = true;
      }
      q++;
    });
    this.rigaPremuta.emit(elementoRitorno);
  }

  RitornaRiga() {
    this.contDivJson = document.getElementById('contDivJson_' + this.numeroFrame);
    if (this.contDivJson && this.contDivJson !== null) {
      const nomeTag = 'target_' + this.numeroFrame + '_' + this.rigaSelezionata;
      const p1 = document.getElementById(nomeTag);
      if (p1 && p1 !== null) {
        const alt = p1.offsetTop - (this.interlinea * 2);
        this.contDivJson.scrollTop = alt;
      }
    }
  }
  
  /* clickValore(elemento) {
    this.rigaSelezionata = +elemento.idRiga;
    const elementoRitorno = JSON.parse(JSON.stringify(elemento));
    const righe = elementoRitorno.Path.split(',');
    let path = '';
    righe.forEach(element => {
      if (this.lista2[(+(element) - 1)]) {
        path += this.lista2[(+(element) - 1)].Ramo + ',';
      }
    });
    // path += elemento.Ramo + ',';
    path = path.substring(0, path.length - 1);
  
    // // console.log('Riga selezionata', this.rigaSelezionata, path);
    elementoRitorno.Path = path;
    this.rigaPremuta.emit(elementoRitorno);
  } */

  next() {
    this.elementoVisualizzato++;
    if (this.elementoVisualizzato >= this.elementiTrovatiArray.length) {
      this.elementoVisualizzato = 0;
    }
    // // console.log('scroll successivo', this.elementoVisualizzato);

    this.spostaDiv();
  }

  previous() {
    this.elementoVisualizzato--;
    if (this.elementoVisualizzato < 0) {
      this.elementoVisualizzato = this.elementiTrovatiArray.length -1;
    }
    // // console.log('scroll precedente', this.elementoVisualizzato);

    this.spostaDiv();
  }

  applicaRicerca() {
    this.applicaRicercaEmit.emit(new Date().toString());
  }

  /* ritornaSelezioneRiga(j) {
    if (j.idRiga === this.rigaSelezionata) {
      return '#dedede';
    } else {
      return 'transparent';
    } 
  } */

  visualizzaAlert = false;

  copiaInClipboard(ritorna) {
    // // console.log(this.lista2);
    let l = '';
    let aCapo = '\n';
    let tab = '   ';
    if (ritorna) { 
      aCapo = '<br />'; 
      tab = '&emsp;';
    }
    this.lista2.forEach(element => {
      const Ramo = element.Ramo;
      const Valore = element.Valore;
      const indent = element.Path.split(',');
      let sIndent = '';
      for (let i = 1; i < indent.length; i++) {
        sIndent += tab;
      }
      l += sIndent + Ramo + ': ' + Valore + aCapo;
    });
    if (!ritorna) {
      this.clip.copy(l);

      this.visualizzaAlert = true;

      setTimeout(() => {
        this.visualizzaAlert = false;
      }, 1000);
    } else {
      this.jsonFormattato.emit(l);
    }
  }

}


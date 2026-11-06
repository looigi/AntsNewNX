import { DatePipe } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, Inject, Injectable, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() Debug = false;
  @Input() Utils;
  @Input() dataPassata;
  @Input() larghezzaData = 125;
  @Input() larghezzaOra = 75;
  @Input() sfondoGiornoNormale = 'white';
  @Input() sfondoGiornoOggi = '#a3a3f6';
  // @Input() coloreGiornoOggi = 'white';
  // @Input() coloreGiornoNormale = 'black';
  // @Input() coloreGiornoSpento = '#bfbfbf';
  @Input() sfondoGiornoFestivo = '#c5c5c5';
  @Input() sfondoGiornoSelezionato = '#f16221';
  @Input() coloreSfondo = '#e8e8e8';
  @Input() sfondoMese = '#e8e8e8';
  @Input() coloreTastiPiuMeno = '#c5c5c5';
  @Input() coloreCasellaTesto = 'white';
  @Input() sfondoFestivoNomeGiorno = '#c5c5c5';
  @Input() sfondoFerialeNomeGiorno = 'white';
  @Input() bordoMese = false;
  @Input() formato = 'yyyy-MM-dd HH:mm:ss';
  @Input() apreConHover = false;
  @Input() chiusuraAutomatica = true;
  @Input() festivita = '';
  @Input() formatoPopup = 'DATAORA';
  @Input() dimensioneFont = 15;
  @Input() anniNelPassato = 15;
  @Input() anniNelFuturo = 2;
  @Input() disabilitato = false;
  @Input() allineatoADestra = false;
  @Input() tooltip = '';
  @Input() mostraIcona = true;

  @Output() dataSelezionata: EventEmitter<Date> = new EventEmitter<Date>();

  title = 'calendario';
  nomeGiorni = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
  nomiMesi = [ '', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];
  dataAttuale;
  giorni;
  giornoAttuale;
  meseAttuale;
  annoAttuale;
  oraAttuale;
  minutoAttuale;
  secondoAttuale;
  puoChiudere = true;
  cosa = '';
  hoIlFocus = false;
  vecchiaData2;

  oggiCodice;
  codiceSelezionato;

  giorniArray = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ];
  scegliGiorno = false;
  mesiArray = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
  scegliMese = false;
  anniArray;
  scegliAnno = false;
  oraArray = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23 ];
  scegliOra = false;
  minutoArray;
  scegliMinuto = false;
  scegliSecondo = false;
  giorniMese = [ -1, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

  oldMese = -1;
  oldAnno = -1;

  pasqua = '';
  dataPassataS = '';
  linkIcone = '';
  posX;
  posY;
  codiceDiv = new Date().getUTCSeconds() + '_' + new Date().getUTCMilliseconds();
  visibile = false;

  formato2;
  campiDaCercare;
  divisori;
  annoControllo;
  meseControllo;
  giornoControllo;
  oraControllo;
  formatoOraControllo;
  minutiControllo;
  secondiControllo;

  vecchiaData;
  nomeInputText = 'txtCalendario';

  constructor(
    @Inject(DatePipe) private datePipe: DatePipe
  ) {
    this.minutoArray = new Array();
    for (let i = 0; i < 60; i++) {
      this.minutoArray.push(i);
    }
    /* if (!this.dataPassata) {
      this.dataAttuale = new Date();
    } */

    this.elaboraData();
  }

  ngOnInit() {
    const random = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.nomeInputText = 'txtCalendario_' + random;

    this.formato2 = this.formato;
    this.sistemaFormato();

    const c = (this.datePipe.transform(new Date(), this.formato2)).split(';');
    const oggiGiorno = this.formatta(c[2]);
    const oggiMese = this.formatta(c[1]);
    const oggiAnno = this.formatta(c[0]);
    this.oggiCodice = oggiGiorno + oggiMese + oggiAnno;

    /* if (this.dataPassata && this.dataPassata !== null) {
      const cD = (this.datePipe.transform(this.dataPassata, this.formato2)).split(';');
      this.codiceSelezionato = this.formatta(cD[2]) + this.formatta(cD[1]) + this.formatta(cD[0]);
    } else {
      this.codiceSelezionato = '';
    } */
    // // console.log(c, this.oggiCodice, this.codiceSelezionato);
  }

  sistemaFormato() {
    while (this.formato2.indexOf('-') > -1) {
      this.formato2 = this.formato2.replace('-', ';');
    }
    while (this.formato2.indexOf(' ') > -1) {
      this.formato2 = this.formato2.replace(' ', ';');
    }
    while (this.formato2.indexOf('/') > -1) {
      this.formato2 = this.formato2.replace('/', ';');
    }

    let appoggio = this.formato;
    let prec = 0;
    this.campiDaCercare = new Array();
    this.divisori = new Array();
    for (let i = 0; i <= appoggio.length; i ++) {
      const carRicerca = appoggio.substring(i, i + 1);
      if (carRicerca === ':' || carRicerca === ' ' || carRicerca === '/' || carRicerca === '-') {
        const appoggio2 = appoggio.substring(prec, i + 1);
        this.divisori.push(appoggio.substring(i, i + 1));
        const appoggio3 = appoggio2.replace(carRicerca, '');
        // // console.log(appoggio2, appoggio3);
        this.aggiungeTipologia(appoggio3);
        prec = i + 1;
      }
    }
    const a = appoggio.substring(prec, appoggio.length);
    this.aggiungeTipologia(a);

    // // console.log(this.campiDaCercare, this.divisori);
  }

  aggiungeTipologia(cosa) {
    switch(cosa) {
      case 'yy':
      case 'YY':
      case 'yyyy':
      case 'YYYY':
        this.campiDaCercare.push('ANNO');
        break;
      case 'MM':
        this.campiDaCercare.push('MESE');
        break;
      case 'dd':
        this.campiDaCercare.push('GIORNO');
        break;
      case 'HH':
        this.campiDaCercare.push('ORA24');
        break;
      case 'hh':
        this.campiDaCercare.push('ORA12');
        break;
      case 'mm':
        this.campiDaCercare.push('MINUTI');
        break;
      case 'ss':
        this.campiDaCercare.push('SECONDI');
        break;
    }
  }

  ngOnChanges(r) {
    if (r.formato) {
      if (r.formato.currentValue) {
        this.formato2 = r.formato.currentValue;
        this.sistemaFormato();
      }
    }

    if (r.dataPassata) {
      if (r.dataPassata.currentValue) {
        if (this.Debug === true) {
          // console.log('Calendario: Data passata al calendario', r.dataPassata.currentValue);
        }

        if (r.dataPassata.currentValue !== '') {
          this.dataAttuale = r.dataPassata.currentValue;
          if (this.formatoPopup === 'ORA') {
            this.vecchiaData2 = this.dataAttuale;
          } else {
            // try {
              this.vecchiaData2 = this.datePipe.transform(this.dataAttuale, this.formato);
            /* } catch(e) {
              alert(this.dataAttuale + ': Not a valid date');
              this.dataAttuale = '';              
            } */
          }
        } else {
          this.dataAttuale = '';
        }

        if (this.dataAttuale && this.dataAttuale !== null) {
          this.elaboraData();

          this.impostaAllineamentoDestra();
        }
      }
    }

    if (r.bordoMese) {
      this.checkBordoMese();
    }

    if (r.chiusuraAutomatica) {
      if (this.formatoPopup === 'ORA') {
        this.chiusuraAutomatica = false;
      } else {
        this.chiusuraAutomatica = r.chiusuraAutomatica.currentValue;
      }
    }

    if (r.formatoPopup) {
      if (r.formatoPopup.currentValue === 'ORA') {
        this.chiusuraAutomatica = false;
      }
    }

    if (r.allineatoADestra) {
      if (r.allineatoADestra.currentValue === true) {
        this.impostaAllineamentoDestra();
      }
    }
  }

  impostaAllineamentoDestra() {
    setTimeout(() => {
      const el = document.getElementById(this.nomeInputText);
      if (el) {
        // // console.log(this.nomeInputText, el);
        el.scrollLeft = el.scrollWidth;
      }
    }, 100);
  }

  ngAfterViewChecked() {
  }

  checkBordoMese() {
    if (this.bordoMese) {
      return '1px solid #999';
    } else {
      return '0px';
    }
  }

  impostaPosizione(e) {
    // // console.log('divCont_' + this.codiceDiv);
    const div = document.getElementById('divCont_' + this.codiceDiv); // .getBoundingClientRect();
    // // console.log(document.getElementById('divCont_' + this.codiceDiv), 'divCont_' + this.codiceDiv, div);
    const meta = div.offsetWidth / 2;
    const inizio = meta - (315 / 2);
    // // console.log(meta, inizio, div.offsetLeft);

    this.posX = (div.offsetLeft + inizio) - 10;
    this.posY = div.offsetTop + 30;
  }

  elaboraData() {
    if (this.Debug === true) {
      // console.log('Calendario: Elabora data', this.dataAttuale);
    }

    if (!this.dataAttuale || this.dataAttuale === '') {
      this.dataPassataS = '';
      return;
    }

    if (this.formatoPopup === 'ORA') {
      const h = this.dataAttuale.split(':');
      if (this.Debug === true) {
        // console.log(this.dataAttuale, h[0], h[1], h[2]);
      }
      this.dataAttuale = '1970-01-01 ' + this.dataAttuale;

      this.dataPassataS = this.datePipe.transform(this.dataAttuale, this.formato);

      this.oraAttuale = this.formatta(+h[0]);
      this.minutoAttuale = this.formatta(+h[1]);
      this.secondoAttuale = this.formatta(+h[2]);

      this.vecchiaData = this.dataPassataS;
      return;
    }

    this.dataPassataS = this.datePipe.transform(this.dataAttuale, this.formato);

    this.vecchiaData = this.dataPassataS;

    const c = (this.datePipe.transform(this.dataAttuale, this.formato2)).split(';');
    // // console.log(this.dataAttuale.toISOString());

    /* this.giornoAttuale = +c[2];
    this.meseAttuale = +c[1];
    this.annoAttuale = +c[0]; */

    if (this.meseAttuale === this.oldMese && this.annoAttuale === this.oldAnno) {
      return;
    }
    this.oldMese = this.meseAttuale;
    this.oldAnno = this.annoAttuale;

    try {
      this.oraAttuale = this.dataAttuale.getHours();
      this.minutoAttuale = this.dataAttuale.getMinutes();
      this.secondoAttuale = this.dataAttuale.getSeconds();
    } catch (e) {

    }

    const giorniTotaliMese = +this.prendeGiorniMese(this.annoAttuale, this.meseAttuale);

    const d1 = new Date(this.annoAttuale + '-' + this.meseAttuale + '-01 00:00:00');
    const numeroPrimoGiorno = d1.getDay();

    const nomePrimoGiorno = this.nomeGiorni[numeroPrimoGiorno];
    let mesePrima = this.meseAttuale - 1;
    let annoPrima = this.annoAttuale;
    if (mesePrima < 1) {
      mesePrima = 12;
      annoPrima--;
    }
    const ultimoGiornoMesePrima = new Date(annoPrima, mesePrima, 0).getDate();

    this.anniArray = new Array();
    for (let i = this.annoAttuale - this.anniNelPassato; i < this.annoAttuale + this.anniNelFuturo; i++) {
      this.anniArray.push(i);
    }

    this.giorni = new Array();
    let gA = numeroPrimoGiorno;
    let n = 0;
    let gg = ultimoGiornoMesePrima - numeroPrimoGiorno + 1;

    this.pasqua = this.prendePasqua(this.annoAttuale);

    if (this.Debug === true) {
      // console.log('Data Attuale', this.giornoAttuale, this.meseAttuale, this.annoAttuale);
      // console.log('Data Attuale per primo girono', d1);
      // console.log('Numero primo giorno del mese', numeroPrimoGiorno);
      // console.log('Primo giorno del mese', nomePrimoGiorno);
      // console.log('Giorni mese', giorniTotaliMese);
      // console.log('Anno prima , Mese prima', annoPrima, mesePrima);
      // console.log('Ultimo giorno mese prima', ultimoGiornoMesePrima);
      // console.log('Pasqua', this.pasqua);
    }

    for (let i = 0; i < numeroPrimoGiorno; i++) {
      // Giorni prima del primo giorno del mese
      const g = {
        InCorso: false,
        NumeroGiorno: -1,
        Giorno: gg,
        Codice: ''
      };
      this.giorni.push(g);
      gg++;
      n++;
      if (n > 6) {
        n = 0;
      }
    }

    for (let i = 1; i <= giorniTotaliMese; i++) {
      const g = {
        InCorso: true,
        NumeroGiorno: gA,
        Giorno: i,
        Codice: (this.formatta(i) + this.formatta(this.meseAttuale) + this.formatta(this.annoAttuale)).toString()
      };
      // // console.log(g);
      this.giorni.push(g);
      gA++;
      if (gA > 6) {
        gA = 0;
      }
      n++;
      if (n > 6) {
        n = 0;
        const g2 = {
          InCorso: false,
          NumeroGiorno: -1,
          Giorno: -1,
          Codice: ''
        };
        this.giorni.push(g2);
      }
    }

    gg = 1;
    for (let i = n + 1; i <= 7; i++) {
      // Giorni dopo l'ultimo giorno del mese
      const g = {
        InCorso: false,
        NumeroGiorno: -1,
        Giorno: gg,
        Codice: ''
      };
      this.giorni.push(g);
      gg++;
    }
  }

  prendeGiorniMese(year, month) {
    return new Date(year, month, 0).getDate();
  }

  formatta(e) {
    // // console.log(e);
    if (e || e === 0) {
      let r = e.toString().trim();
      if (r.length === 1) {
        r = '0' + r;
      }
      return r;
    } else {
      return '';
    }
  }

  sceltaGiorno(g) {
    if (g) {
      this.giornoAttuale = g;
      this.scegliGiorno = false;
      this.sistemaData(true, true);
    }
  }

  sceltaMese(m) {
    if (m) {
      this.meseAttuale = m;
      this.scegliMese = false;
      this.sistemaData(true, true);
    }
  }

  sceltaAnno(a) {
    if (a) {
      this.annoAttuale = a;
      this.scegliAnno = false;
      this.sistemaData(true, true);
    }
  }

  sceltaOra(o) {
    if (o) {
      this.oraAttuale = o;
      this.scegliOra = false;
      this.sistemaData(true, true);
    }
  }

  sceltaMinuto(m) {
    // // console.log('Calendario: Minuto attuale', m);
    if (m) {
      this.minutoAttuale = m;
      this.scegliMinuto = false;
      this.sistemaData(true, true);
    }
  }

  sceltaSecondo(s) {
    if (s) {
      this.secondoAttuale = s;
      this.scegliSecondo = false;
      this.sistemaData(true, true);
    }
  }

  mesePrima() {
    this.meseAttuale--;
    if (this.meseAttuale < 1) {
      this.meseAttuale = 12;
      this.annoAttuale--;
    }
    this.sistemaData(false, false);
  }

  meseDopo() {
    this.meseAttuale++;
    if (this.meseAttuale > 12) {
      this.meseAttuale = 1;
      this.annoAttuale++;
    }
    this.sistemaData(false, false);
  }

  sistemaData(AggiornaData, forza) {
    let d;
    if (this.formatoPopup === 'ORA') {
      d = this.datePipe.transform('1970-01-01 ' +
        this.oraAttuale + ':' + this.minutoAttuale + ':' + this.secondoAttuale, this.formato);
      this.dataAttuale = d;
      this.vecchiaData2 = d;
      // this.visibile = false;
    } else {
      if (this.formatoPopup === 'DATAORA') {
        d = this.datePipe.transform(this.annoAttuale + '-' + this.meseAttuale + '-' + this.giornoAttuale + ' ' +
          this.oraAttuale + ':' + this.minutoAttuale + ':' + this.secondoAttuale, this.formato);
        this.dataAttuale = new Date(d);
      } else {
        d = this.datePipe.transform(this.annoAttuale + '-' + this.meseAttuale + '-' + this.giornoAttuale, this.formato);
        this.dataAttuale = d;
      }

      this.vecchiaData2 = this.datePipe.transform(this.dataAttuale, this.formato);
    }
    this.codiceSelezionato = this.formatta(this.giornoAttuale) + this.formatta(this.meseAttuale) + this.formatta(this.annoAttuale);

    if (AggiornaData) {
      let data;
      if (this.formatoPopup === 'ORA') {
        data = this.dataAttuale;
      } else {
        data = this.datePipe.transform(this.dataAttuale, this.formato);
      }
      
      if (this.Debug === true) {
        // console.log('Calendario: Data ritornata 1', data, this.vecchiaData2);
      }

      if (data !== this.vecchiaData2 || forza) {
        if (this.hoIlFocus || forza) {
          this.dataSelezionata.emit(this.dataAttuale);
        }
      }

      this.vecchiaData2 = data;
    }

    this.elaboraData();
  }

  selezioneGiorno(g) {
    if (g.InCorso) {
      this.giornoAttuale = g.Giorno;
      this.sistemaData(true, true);

      this.codiceSelezionato = this.formatta(g.Giorno) + this.formatta(this.meseAttuale) + this.formatta(this.annoAttuale);
      // this.dataSelezionata.emit(this.dataAttuale);
      // if (this.Debug === true) {
      //   // console.log('Calendario: Data ritornata 2', this.dataAttuale);
      // }

      this.visibile = false;
    }
  }

  ritornaFestivo(c) {
    const cc = c.substring(0, 4);
    // // console.log(this.festivita);
    switch(this.festivita) {
      case 'IT':
        return this.controllaFestivitaItaliane(cc);
      default:
        return false;
    }
  }

  controllaFestivitaItaliane(cc) {
    switch (cc) {
      case '0101':
      case '0601':
      case '2504':
      case '0105':
      case '0206':
      case '1508':
      case '0111':
      case '0812':
      case '2512':
      case '2612':
        return true;
        break;
      default:
        if (cc === this.pasqua) {
          return true;
        } else {
          return false;
        }
    }
  }

  prendePasqua(year) {
      let day = 0;
      let month = 0;

      const g = year % 19;
      const c = year / 100;
      const h = (c - Math.round(c / 4) - Math.round((8 * c + 13) / 25) + 19 * g + 15) % 30;
      const i = h - Math.round(h / 28) * (1 - Math.round(h / 28) * (29 / (h + 1)) * Math.round((21 - g) / 11));

      day = Math.round(i - ((year + Math.round(year / 4) + i + 2 - c + Math.round(c / 4)) % 7) + 28);
      month = 3;

      if (day > 31) {
          month++;
          day -= 31;
      }
      // // console.log(day, month);

      return this.formatta(day + 1) + this.formatta(month);
  }

  ritornaColoreSfondo(g) {
    // // console.log(g, this.oggiCodice);
    if (g.InCorso) {
      if (g.Codice === this.codiceSelezionato) {
        return this.sfondoGiornoSelezionato;
      } else {
        if (g.Codice === this.oggiCodice) {
          return this.sfondoGiornoNormale;
        } else {
          if (g.NumeroGiorno === 0 || g.NumeroGiorno === 6 || this.ritornaFestivo(g.Codice)) {
            return this.sfondoGiornoFestivo;
          } else {
            return this.sfondoGiornoNormale;
          }
        }
      }
    } else {
      return '#ededed';
    }
  }

  ritornaPosX() {
    return this.posX + 'px';
  }

  ritornaPosY() {
    return this.posY + 'px';
  }

  presoFocus() {
    if (this.Debug === true) {
      // console.log('Calendario: Preso focus');
    }
    this.hoIlFocus = true;
  }

  /* persoFocus() {
    if (this.Debug === true) {
      // console.log('Calendario: Perso focus');
    }
    this.hoIlFocus = false;
  } */

  impostaDataTesto(e) {
    if (this.Debug === true) {
      // console.log('Calendario: Imposta data da testo', e);
      // console.log('Calendario: Imposta data da testo. Focus: ', this.hoIlFocus);
    }

    if (e === '') {
      this.dataPassataS = '';
      this.dataAttuale = new Date();
      this.vecchiaData2 = this.datePipe.transform(this.dataAttuale, this.formato);
      return;
    }

    if (this.formatoPopup === 'ORA') {
      const d = this.checkOra(this.dataPassataS);
      if (d.indexOf('ERROR:') === -1) {
        const data = d; // this.datePipe.transform(d, 'yyyy-MM-dd HH:mm:ss');

        if (this.Debug === true) {
          // console.log('Calendario: Data ritornata IDT 1', d, this.dataAttuale);
          // console.log('Calendario: Confronto con vecchia data', data, this.vecchiaData2, (data === this.vecchiaData2));
        }

        if (data !== this.vecchiaData2) {
          this.dataAttuale = d;

          this.elaboraData();

          if (this.hoIlFocus) {
            this.dataSelezionata.emit(this.dataAttuale);
          }
        }

        this.vecchiaData2 = data;
      }
    } else {
      const d = this.checkData(this.dataPassataS, 'ImpostaDataTesto');
      if (d.indexOf('ERROR:') === -1) {
        // try {
          const data = this.datePipe.transform(new Date(d), this.formato);

          if (this.Debug === true) {
            // console.log('Calendario: Imposta data IDT 2', data, this.dataAttuale);
            // console.log('Calendario: Confronto con vecchia data', data, this.vecchiaData2, (data === this.vecchiaData2));
          }

          if (data !== this.vecchiaData2) {
            this.dataAttuale = new Date(d); // this.datePipe.transform(new Date(d), 'yyyy-MM-dd HH:mm:ss');
            // // console.log(this.dataAttuale);

            this.elaboraData();

            if (this.hoIlFocus) {
              this.dataSelezionata.emit(this.dataAttuale);
            }
          }

          this.vecchiaData2 = data;
        /* } catch(e) {
          alert(this.dataPassataS + ': Not a valid hour');
          this.dataPassataS = '';          
        } */
      } else {
        alert (d);
      }
    }

    this.impostaAllineamentoDestra();

    this.hoIlFocus = false;
  }

  impostaData(e, apri, fattoClick) {
    if (!this.apreConHover && !fattoClick) {
      return;
    }

    if (this.formatoPopup === 'ORA') {
      const d = this.checkOra(this.dataPassataS);
      if (d.indexOf('ERROR:') === -1) {
        this.dataAttuale = d;
        this.vecchiaData2 = d;

        this.elaboraData();

        if (apri) {
          this.visibile = !this.visibile;
        }
        this.impostaPosizione(e);
      }
    } else {
      let d = this.checkData(this.dataPassataS, 'ImpostaData');

      /* // console.log(d);
      // console.log(this.dataPassataS);
      // console.log(this.dataAttuale); */

      if (d.indexOf('Data vuota') > -1) {
        d = this.datePipe.transform(new Date(), this.formato2);
      }

      if (d.indexOf('ERROR:') === -1) {
        this.dataAttuale = new Date(d); // this.datePipe.transform(new Date(d), 'yyyy-MM-dd HH:mm:ss');
        // try {
          this.vecchiaData2 = this.datePipe.transform(this.dataAttuale, this.formato);
          if (this.Debug === true) {
            // console.log('Calendario: Imposta data 1', d, this.dataAttuale);
          }
          // // console.log(this.dataAttuale);

          this.elaboraData();

          if (apri) {
            this.visibile = !this.visibile;
          }
          this.impostaPosizione(e);
        /* } catch(e) {
          alert(this.dataPassataS + ': Not a valid date');
          this.dataPassataS = '';
        } */
      } else {
        alert (d);
      }
    }
  }

  checkTasto(k) {
    const pattern = '0123456789:- ';
    const inputChar = k.key;
    // // console.log(inputChar, k.keyCode);
    if (k.keyCode === 13) {
      if (this.Debug === true) {
        // console.log('Passo data ', this.dataPassataS);
      }
      this.impostaDataTesto(this.dataPassataS);
      return false;
    }

    let duePunti = 0;
    let trattini = 0;
    for (let i = 0; i <= this.dataPassataS.length; i++) {
      if (this.dataPassataS.substring (i, i + 1) === ':') {
        duePunti++;
      }
      if (this.dataPassataS.substring (i, i + 1) === '-') {
        trattini++;
      }
    }
    if (inputChar === ' ' && this.dataPassataS.indexOf(' ') > -1) {
      return false;
    }
    if (inputChar === ':' && duePunti === 2) {
      return false;
    }
    if (inputChar === '-' && trattini === 2) {
      return false;
    }
    if (pattern.indexOf(inputChar) === -1) {
      return false;
    }

    return true;
  }

  controllaTipologia(t, appoggio3) {
    // // console.log(t, appoggio3);
    switch (t) {
      case 'ANNO':
        this.annoControllo = +appoggio3;
        break;
      case 'MESE':
        this.meseControllo = +appoggio3;
        break;
      case 'GIORNO':
        this.giornoControllo = +appoggio3;
        break;
      case 'ORA24':
        this.oraControllo = +appoggio3;
        this.formatoOraControllo = 24;
        break;
      case 'ORA12':
        this.oraControllo = +appoggio3;
        this.formatoOraControllo = 12;
        break;
      case 'MINUTI':
        this.minutiControllo = +appoggio3;
        break;
      case 'SECONDI':
        this.secondiControllo = +appoggio3;
        break;
      }
  }

  checkOra(d) {
    const rit = d;

    return rit;
  }

  checkData(d, daDove) {
    if (this.Debug === true) {
      // console.log('Calendario: Check data', d, this.campiDaCercare, daDove);
    }
    d = d.trim();

    if (d === '') {
      return 'ERROR: Data vuota';
    }

    let prec = 0;
    let campo = 0;
    for (let i = 0; i <= d.length; i ++) {
      const carRicerca = d.substring(i, i + 1);
      if (carRicerca === ':' || carRicerca === ' ' || carRicerca === '/' || carRicerca === '-') {
        const appoggio2 = d.substring(prec, i + 1);
        const appoggio3 = appoggio2.replace(carRicerca, '');
        const tipologia = this.campiDaCercare[campo];
        this.controllaTipologia(tipologia, appoggio3);
        campo++;
        prec = i + 1;
      }
    }
    const a = d.substring(prec, d.length);
    const t = this.campiDaCercare[campo];
    this.controllaTipologia(t, a);

    const giorno = this.giornoControllo;
    const mese = this.meseControllo;
    const anno = this.annoControllo;

    const ore = this.oraControllo;
    const minuti = this.minutiControllo;
    const secondi = this.secondiControllo;

    // // console.log(giorno, mese, anno, ore, minuti, secondi);

    const fineMese = this.giorniMese[mese];
    if (giorno < 1 || giorno > fineMese) {
      this.dataPassataS = this.vecchiaData;
      return 'ERROR: giorno non valido ' + giorno;
    }
    if (mese < 1 || mese > 12) {
      this.dataPassataS = this.vecchiaData;
      return 'ERROR: mese non valido ' + mese;
    }
    if (ore < 0 || ore > this.formatoOraControllo - 1) {
      this.dataPassataS = this.vecchiaData;
      return 'ERROR: ore non valide ' + ore;
    }
    if (minuti < 0 || minuti > 59) {
      this.dataPassataS = this.vecchiaData;
      return 'ERROR: minuti non validi ' + minuti;
    }
    if (secondi < 0 || secondi > 59) {
      this.dataPassataS = this.vecchiaData;
      return 'ERROR: secondi non validi ' + secondi;
    }

    this.meseAttuale = mese;
    this.giornoAttuale = giorno;
    this.annoAttuale = anno;
    this.oraAttuale = ore;
    this.minutoAttuale = minuti;
    this.secondoAttuale = secondi;

    // DATA VALIDA
    let rit = '';
    let campoDiv = 0;
    this.campiDaCercare.forEach(element => {
      switch (element) {
        case 'ANNO':
          if (anno) {
            rit += anno;
          } else {
            rit += '----';
          }
          break;
        case 'MESE':
          if (mese) {
            rit += this.formatta(mese);
          } else {
            rit += '--';
          }
          break;
        case 'GIORNO':
          if (giorno) {
            rit += this.formatta(giorno);
          } else {
            rit += '--';
          }
          break;
        case 'ORA24':
        case 'ORA12':
          if (ore || ore === 0 || ore === '0') {
            rit += this.formatta(ore);
          } else {
            if (this.formatoPopup === 'DATAORA') {
              rit += '--';
            }
          }
          break;
        case 'MINUTI':
          if (minuti || minuti === 0 || minuti === '0') {
            rit += this.formatta(minuti);
          } else {
            if (this.formatoPopup === 'DATAORA') {
              rit += '--';
            }
          }
          break;
        case 'SECONDI':
          if (secondi || secondi === 0 || secondi === '0') {
            rit += this.formatta(secondi);
          } else {
            if (this.formatoPopup === 'DATAORA') {
              rit += '--';
            }
          }
          break;
      }
      if (this.divisori[campoDiv]) {
        rit += this.divisori[campoDiv];
        campoDiv++;
      }
    });
    // // console.log(rit);

    this.codiceSelezionato = this.formatta(giorno) + this.formatta(mese) + this.formatta(anno);
    // this.dataSelezionata.emit(new Date(rit));
    // if (this.Debug === true) {
    //   // console.log('Calendario: Data ritornata 3', rit);
    // }
    return rit;
  }

  chiudeFinestraSePossibile() {
    // // console.log(this.chiusuraAutomatica, this.puoChiudere);
    if (this.chiusuraAutomatica) {
      if (this.puoChiudere) {
        this.visibile = false;
      } else {

      }
    }
  }

  chiudiScelta() {
    // // console.log('Chiudo scelta');
    this.scegliGiorno = false;
    this.scegliMese = false;
    this.scegliAnno = false;
    this.scegliOra = false;
    this.scegliMinuto = false;
    this.scegliSecondo = false;
  }

}

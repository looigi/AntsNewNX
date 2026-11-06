import { logConsole } from '../console-log';
import { Component, Input, OnInit, AfterViewInit, Renderer2, OnChanges, Output, EventEmitter, ViewChild, ElementRef, Inject, NgModuleFactory, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'combo.component.html',
  selector: 'app-combo-component',
  styleUrls: ['./combo.component.css']
})

export class ComboMiaComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  static comboSelezionata = '';
  
  @ViewChild('myInput', { static: true }) inputEl: ElementRef;
  @ViewChild('txtFilter', { static: false }) txtFilter: ElementRef;
  @ViewChild('txtFilter2', { static: false }) txtFilter2: ElementRef;
  @ViewChild('divContenitoreCombo', { static: false }) divContenitoreCombo: ElementRef;
  @ViewChild('divContenitoreCombo', { static: false }) divContenitoreComboPerParent: HTMLAllCollection;
  @ViewChild('divPopup', { static: false }) popup: ElementRef;

  @Input() Tipologia: string;
  @Input() larghezza = '';
  @Input() dimeFont;
  @Input() data;
  @Input() accettaNuovi: boolean;
  @Input() campoId: string;
  @Input() campoTesto: string;
  @Input() valoreDefault;
  @Input() style;
  @Input() campoFiltro: string;
  @Input() campoRaggruppamento: string;
  @Input() NomeCombo: string;
  @Input() userName: string;
  @Input() ricordaUltimoValore = true;
  @Input() pulisceValoriDiBase = false;
  @Input() pulisceFiltro: Boolean;
  @Input() disabilitata: Boolean;
  @Input() forzaSelezione: string;
  @Input() placeholder: string = '';
  // @Input() popupSopra: boolean = false;
  @Input() altezzaMassima = 200;
  @Input() Debug = false;
  @Input() selezioneMultipla = false;
  @Input() aggiungeRiga;
  @Input() evitaRicercaTramiteCampoTesto = false;
  @Input() visibileElimina = true;
  @Input() testoDisabilitato = false;
  
  @Output() selezioneEffettuata: EventEmitter<string> = new EventEmitter<string>();
  @Output() ritornoValoreAttuale: EventEmitter<string> = new EventEmitter<string>();
  @Output() cambioValore: EventEmitter<string> = new EventEmitter<string>();

  @Output() eventoMouseLeave: EventEmitter<string> = new EventEmitter<string>();
  @Output() eventoMouseOver: EventEmitter<string> = new EventEmitter<string>();
  @Output() eventoOpen: EventEmitter<string> = new EventEmitter<string>();
  @Output() eventoClose: EventEmitter<string> = new EventEmitter<string>();

    /* public data: Array<any> = [
      { name: 'Pork', category: 'Food', subcategory: 'Meat' },
      { name: 'Pepper', category: 'Food', subcategory: 'Vegetables' },
      { name: 'Beef', category: 'Food', subcategory: 'Meat' }
  ]; */

  visibileTastoAdd = true;

  FilteredData: Array<any>;
  Selezione;
  Selezione2;
  vecchiaSelezione;
  // groupedData: GroupResult[];
  evitaRicercaTramiteCampoTesto2 = false;

  linkIcone;

  posizioneXPopup;
  posizioneYPopup;
  dimensioneCombo;
  vecchioPosizioneXPopup;
  vecchioPosizioneYPopup;

  // valoreDefaultSetted;
  stringaVuota = '';
  rigaSelezionata;
  popupAperto = false;

  scriveDebug = false;
  debugComboName = 'MapStyleHome';
  disabilitata2 = null;
  filtro = '';
  filtro2 = '';

  intervallo;
  transform;
  oggettoDrag;
  vecchioTransform;
  vecchioClick = -1;
  nuovaRiga = '';

  ngOnDestroy() {
    // Il timer del popup resterebbe attivo se la combo viene distrutta con il popup aperto
    if (this.intervallo) {
      clearInterval(this.intervallo);
    }
    if (this.inputEl) {
      this.inputEl.nativeElement.remove();
    }
    if (this.txtFilter) {
      this.txtFilter.nativeElement.remove();
    }
    if (this.txtFilter2) {
      this.txtFilter2.nativeElement.remove();
    }
    if (this.divContenitoreCombo) {
      this.renderer.removeChild(this.divContenitoreCombo.nativeElement, this.divContenitoreComboPerParent);
    }
    if (this.divContenitoreCombo) {
      this.divContenitoreCombo.nativeElement.remove();
    }
    if (this.popup) {
      this.popup.nativeElement.remove();
    }
  }

  aprePopup(e) {
    const ora = new Date().getTime();
    if (ora - this.vecchioClick < 750) {
      return;
    }
    this.vecchioClick = ora;

    this.popupAperto = !this.popupAperto;
    // // logConsole('Popup',this.popupAperto);
    if (this.popupAperto) {
      this.dimensioneCombo = this.divContenitoreCombo.nativeElement.offsetWidth - 8;

      let oggettoPadre = this.divContenitoreComboPerParent['nativeElement'];
      const contenitore = this.divContenitoreComboPerParent['nativeElement'];

      const nome = 'divCombo_' + this.NomeCombo + '_' + this.userName;
      const contenitoreCombo = document.getElementById(nome);
      // // logConsole(contenitore, contenitore.style.transform);

      let dragX = 0;
      let dragY = 0;

      while (oggettoPadre) {
        oggettoPadre = oggettoPadre.parentElement;
        if (oggettoPadre === null) {
          break;
        }
        if (oggettoPadre.className && 
          (oggettoPadre.className.toUpperCase().indexOf('DRAGGABLE') > -1 || oggettoPadre.className.toUpperCase().indexOf('DRAG-BLOCK') > -1
          || oggettoPadre.className.toUpperCase().indexOf('DRAG-BOUNDARY') > -1)) {
          this.transform = JSON.parse(JSON.stringify(oggettoPadre.style.transform));

          dragX = oggettoPadre.getBoundingClientRect().x;
          dragY = oggettoPadre.getBoundingClientRect().y;

          // // logConsole(oggettoPadre.getBoundingClientRect().x, oggettoPadre.getBoundingClientRect().y);
          /* const tr = this.transform.replace("translate", "").replace("(", "").replace(")", "");
          const tr2 = tr.split(',');
          // logConsole('Translate: ', tr2);
          if (tr2[0] && tr2[1]) {
            const posX = +(tr2[0].trim().replace("px", ""));
            const posY = +(tr2[1].trim().replace("px", "")); */
            // // logConsole('Translate: ', posX, posY);
            // const nuovaPosX = +(oggettoPadre.offsetLeft) + posX;
            // const nuovaPosY = +(oggettoPadre.offsetTop) + posY;
            // // logConsole('Risultante: ', nuovaPosX, nuovaPosY);
            // oggettoPadre.style.left = nuovaPosX + 'px';
            // oggettoPadre.style.top = nuovaPosY + 'px';

            // oggettoPadre.style.transform = '';
          /* } else {
            // logConsole('TR2 non valido', tr2);
          }
          this.posizione = ''; */
          // // logConsole(oggettoPadre.style.position);

          break;
        }
      }
      if (oggettoPadre === null) {
        oggettoPadre = contenitore.parentElement;
      } /* */

      // // logConsole(oggettoPadre.className);
      // const posizioneXPadre = this.divContenitoreCombo.nativeElement.offsetParent.offsetLeft;
      // const posizioneYPadre = this.divContenitoreCombo.nativeElement.offsetParent.offsetTop;
      const posizioneXContenitore = contenitoreCombo.getBoundingClientRect().x - dragX;
      const posizioneYContenitore = contenitoreCombo.getBoundingClientRect().y - dragY;
      const altezzaContenitore = contenitoreCombo.offsetHeight;

      // const style= getComputedStyle(this.divContenitoreCombo.nativeElement);
      // // logConsole('Posizione Padre: ', contenitoreCombo.offsetLeft, contenitoreCombo.offsetTop);
      // // logConsole('Posizione contenitore: ', posizioneXContenitore, posizioneYContenitore, altezzaContenitore);

      this.posizioneXPopup = (posizioneXContenitore + 2);
      this.posizioneYPopup = (posizioneYContenitore + altezzaContenitore + 2);
      // // logConsole('Posiz: ', this.posizioneXPopup, this.posizioneYPopup);
      
      this.vecchioPosizioneXPopup = JSON.parse(JSON.stringify(this.posizioneXPopup));
      this.vecchioPosizioneYPopup = JSON.parse(JSON.stringify(this.posizioneYPopup));

      /* // logConsole(this.transform);
      setTimeout(() => {
        this.renderer.setStyle(this.popup.nativeElement, 'transform', this.transform);
      }, 10); */
      this.vecchioTransform = this.transform;

      this.intervallo = setInterval(() => {
        if (oggettoPadre !== null) {
          this.transform = oggettoPadre.style.transform;
          if (this.vecchioTransform !== this.transform) {
            this.vecchioTransform = this.transform;
            this.chiudePopup();
          }
        }
        // const posizioneXPadre = this.divContenitoreCombo.nativeElement.offsetParent.offsetLeft;
        // const posizioneYPadre = this.divContenitoreCombo.nativeElement.offsetParent.offsetTop;
        const posizioneXContenitore = this.divContenitoreCombo.nativeElement.getBoundingClientRect().x - dragX;
        const posizioneYContenitore = this.divContenitoreCombo.nativeElement.getBoundingClientRect().y - dragY;
        const altezzaContenitore = contenitoreCombo.offsetHeight; // this.divContenitoreCombo.nativeElement.offsetHeight;

        const posizioneXPopup = posizioneXContenitore + 2;
        const posizioneYPopup = posizioneYContenitore + altezzaContenitore + 2;

        if (posizioneXPopup !== this.vecchioPosizioneXPopup || posizioneYPopup !== this.vecchioPosizioneYPopup) {
          // // logConsole('Sposto: ', posizioneXPopup, posizioneYPopup);

          this.posizioneXPopup = posizioneXPopup;
          this.posizioneYPopup = posizioneYPopup;

          this.vecchioPosizioneXPopup = JSON.parse(JSON.stringify(this.posizioneXPopup));
          this.vecchioPosizioneYPopup = JSON.parse(JSON.stringify(this.posizioneYPopup));
        }
      }, 100);
      // setTimeout(() => {
        /* let parentX = this.divContenitoreCombo.nativeElement.offsetParent.offsetLeft;
        let parentY = this.divContenitoreCombo.nativeElement.offsetParent.offsetTop;

        parentX += this.divContenitoreCombo.nativeElement.offsetLeft;
        parentY += this.divContenitoreCombo.nativeElement.offsetTop;
        const altezzaCombo = this.divContenitoreCombo.nativeElement.clientHeight;
        const altezzaPopup = this.popup.nativeElement.clientHeight;
        // logConsole('Posizione parent: ', this.divContenitoreCombo, parentX, parentY);

        this.posizioneXPopup = parentX + 2;
        if (this.popupSopra === false) {
          this.posizioneYPopup = parentY + 2; //  + altezzaCombo;
        } else {
          this.posizioneYPopup = parentY - altezzaPopup - altezzaCombo - 4; //  + altezzaCombo;
        } */
      // }, 10);
      /* setTimeout(() => {
        const getScreenWidth = window.innerWidth;
        const getScreenHeight = window.innerHeight;
        // logConsole('Dimensione finestra: ', getScreenWidth, getScreenHeight);

        const parentX = this.divContenitoreCombo.nativeElement.offsetParent.offsetLeft;
        const parentY = this.divContenitoreCombo.nativeElement.offsetParent.offsetTop;
        // logConsole('Posizione parent: ', this.divContenitoreCombo, parentX, parentY);

        const dimePopup = this.popup.nativeElement.offsetHeight;
        // logConsole('Dimensione popup: ', dimePopup);

        const comboTop = this.divContenitoreCombo.nativeElement.offsetTop;
        const comboLeft = this.divContenitoreCombo.nativeElement.offsetLeft;
        // logConsole('Posizione combo: ', comboTop, comboLeft);

        this.posizioneXPopup = parentX;
        this.dimensioneCombo = this.divContenitoreCombo.nativeElement.offsetWidth - 7;

        // logConsole('Dimensione combo: ', this.dimensioneCombo);
        // logConsole('Combo top: ', comboTop);
        // logConsole('Combinazione: ', parentY + comboTop + 40 + dimePopup);

        if (parentY + comboTop + 40 + dimePopup < getScreenHeight) {
          this.posizioneYPopup = parentY + comboTop + 40;
          // logConsole('Posizione Popup sotto: ', this.posizioneYPopup);
        } else {
          this.posizioneYPopup = parentY - dimePopup;
          // logConsole('Posizione Popup sopra: ', this.posizioneYPopup);
        }
      }, 10); */
    } else {
      this.chiudePopup();
    }
  }

  chiudePopup() {
    const ora = new Date().getTime();
    this.scriveLog(ora);
    if (ora - this.vecchioClick < 750) {
      return;
    }
    this.vecchioClick = ora;

    if (this.oggettoDrag) {
      this.oggettoDrag.style.transform = this.transform;
      this.oggettoDrag = undefined;
    }
    this.popupAperto = false; // !this.popupAperto;
    clearInterval(this.intervallo);
    this.intervallo = undefined;
  }

  scriveLog(Cosa, P1?, P2?, P3?, P4?, P5?) {
    if (this.scriveDebug === true) {
      if (P1 && P2 && P3 && P4 && P5) {
        // console.log('COMBO ' + this.NomeCombo + ': ' + Cosa, P1, P2, P3, P4, P5);
      } else {
        if (P1 && P2 && P3 && P4 && !P5) {
          // console.log('COMBO ' + this.NomeCombo + ': ' + Cosa, P1, P2, P3, P4);
        } else {
          if (P1 && P2 && P3 && !P4 && !P5) {
            // console.log('COMBO ' + this.NomeCombo + ': ' + Cosa, P1, P2, P3);
          } else {
            if (P1 && P2 && !P3 && !P4 && !P5) {
              // console.log('COMBO ' + this.NomeCombo + ': ' + Cosa, P1, P2,);
            } else {
              if (P1 && !P2 && !P3 && !P4 && !P5) {
                // console.log('COMBO ' + this.NomeCombo + ': ' + Cosa, P1);
              } else {
                // console.log('COMBO ' + this.NomeCombo + ': ' + Cosa);
              }  
            }
          }
        }
      }
    }
  }
  
  constructor(
    @Inject(DOCUMENT) document,
    private renderer: Renderer2,
  ) {
    const parsedUrl = new URL(window.location.href);
    let baseUrl = parsedUrl.href; // origin;
    if (baseUrl.indexOf('?') > -1) {  
      baseUrl = baseUrl.substring(0, baseUrl.indexOf('?'));
    }

    // baseUrl = 'https://antsgraclient.ants-aubay.it/geoantsweb_pre/geoantsweb/FleetManager';
    // baseUrl = 'https://antsgraclient.ants-aubay.it/geoantsweb_pre/geoantsweb/Mappe/';
    this.scriveLog('Base Url 1: ', baseUrl);
    this.scriveLog('Posizione: ', baseUrl.toUpperCase().indexOf('GEOANTSWEB/'));
    // logConsole('COMBO: Base url inizio: ', baseUrl);
    if (baseUrl.toUpperCase().indexOf('GEOANTSWEB/') > -1) {
      baseUrl = baseUrl.substring(0, baseUrl.toUpperCase().indexOf('GEOANTSWEB/') + 11); // + '/';
    } else {
      // baseUrl = baseUrl + '/geoantsweb/';
    }
    // logConsole('COMBO: Base url fine: ', baseUrl);
    this.scriveLog('Base Url 2: ', baseUrl);
    // https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/assets/img/icons/down.png

    if (baseUrl.toUpperCase().indexOf('LOCALHOST') > -1) {
      this.linkIcone = 'http://localhost:2727/';
    } else {
      this.linkIcone = baseUrl;
    }
    // logConsole('COMBO: Link icone: ', this.linkIcone);
  }

  ngOnInit() {
    // // logConsole('Init Nome combo: ', this.NomeCombo);
    // this.creaDati('', false, true, 'Init');
    this.rigaSelezionata = this.stringaVuota;
    this.testoOriginale = this.stringaVuota;
  }

  ritornaValoreDaCodice(last, daDove) {
    this.scriveLog('Controllo per Selezione multipla 1', last, daDove);

    if (!this.FilteredData) { 
      this.creaDati(this.filtro, false, false, null, 'Data');
      // // logConsole('ppp', this.FilteredData);
    }

    // logConsole('click 1', this.selezioneMultipla, this.rigaSelezionata, daDove);

    if (this.selezioneMultipla) {
      /* let selez;
      if (last !== undefined && last !== null) {
        selez = last;
      } else {
        // selez = localStorage.getItem(this.userName + '_' + this.NomeCombo + '_multisel');
      } */

      /* const selez = localStorage.getItem(this.userName + '_' + this.NomeCombo + '_multisel'); */
      const selez = this.rigaSelezionata;
      let selez2 = new Array();
      if (selez && selez !== null && selez !== 'null') {
        selez2 = selez.split(',');
      }

      let testo = '';
      let id = 0;
      this.scriveLog('Controllo per Selezione multipla 2', selez2, this.data, this.campoId, daDove);
      // logConsole('click 2', selez2, this.data, this.campoId);
      if (this.data && selez2.length > 0) {
        this.data.forEach(element => {
          let ok = false;
          selez2.forEach(element2 => {
            if (!ok && element2 === element[this.campoId]) {
              // // logConsole('Selezionate', element2, element);
              if (testo.indexOf(element[this.campoTesto] + ',') === -1) {
                ok = true;
                testo += element[this.campoTesto] + ',';
              }
            }
            id++;
          });
          if (ok) {
            element.Selezionata = true;
          } else {
            element.Selezionata = false;
          }
        });
      }
      // logConsole('click 2.5', selez2);
      if (selez2.length === 0) {
        selez2 = [''];
      }

      if (this.FilteredData && selez2.length > 0) {
        const FilteredData = JSON.parse(JSON.stringify(this.FilteredData));
        FilteredData.forEach(element => {
          let ok = false;
          selez2.forEach(element2 => {
            if (!ok && element2 === element.Id) {
              // // logConsole('TROVATO ', element2, element);
              ok = true;
            }
          });
          if (ok) {
            element.Selezionata = true;
          } else {
            element.Selezionata = false;
          }
        });

        this.FilteredData = JSON.parse(JSON.stringify(FilteredData));
      }
      // logConsole('click 3', this.FilteredData);
      if (testo.length > 0) {
        testo = testo.substring(0, testo.length - 1);
      }
      // logConsole('click 4', testo);
      
      // Aggiunge il testo degli elementi non trovati
      const nuovi = new Array();
      const nuoviData = new Array();
      const id2 = id;
      id++;
      selez2.forEach(element => {
        let ok = false;
        this.FilteredData.forEach(element2 => {
          if (!ok && element2.Id === element) {
            ok = true;
          }
        });
        if (!ok) {
          this.scriveLog('Valore non trovato', element);
          if (element) {
            id++;

            const n = {
              Categoria: "",
              Id: element,
              Indentato: true,
              Riga: id,
              Selezionata: true,
              Testo: element
            }
            nuovi.push(n);

            const nd = {
              Selezionata: true,
              categoria: "",
              id: id
            }
            nd[this.campoTesto] = element;
            nuoviData.push(nd);

            if (testo) {
              testo += ',';
            }
            testo += element;
          }
        }
      });
      this.scriveLog('Valori non trovati', nuovi);
      if (nuovi.length > 0) {
        const f = JSON.parse(JSON.stringify(this.FilteredData));
        let ok = true;
        this.FilteredData.forEach(element => {
          if (ok && element.Categoria === "New Values") {
            ok = false;
          }
        });
        if (ok) {
          const n = {
            Categoria: "New Values",
            Id: -1,
            Indentato: false,
            Riga: id2,
            Selezionata: false,
            Testo: "New Values"
          }
          f.push(n);
        }
        nuovi.forEach(element => {
          let ok = true;
          this.FilteredData.forEach(element2 => {
            if (ok && element2.Testo === element.Testo) {
              ok = false;
            }
          });
          if (ok) {
            f.push(element);
          }
        });
        nuoviData.forEach(element => {
          let ok = true;
          if (!this.data) {
            this.data = new Array();
          }
          this.data.forEach(element2 => {
            if (ok && element2[this.campoTesto] === element[this.campoTesto]) {
              ok = false;
            }
          });
          if (ok) {
            this.data.push(element);
          }
        });

        this.FilteredData = undefined;
        const t = setTimeout(() => {
          clearTimeout(t);

          this.FilteredData = JSON.parse(JSON.stringify(f));
          // logConsole('Campo con valori nuovi', this.data);
        }, 0);
      }
      // Aggiunge il testo degli elementi non trovati

      // // logConsole('Selezionate da rvdc', testo);
      this.scriveLog('Campo selezionato: ', testo, this.FilteredData);

      // // logConsole('Setitem combo ' + this.NomeCombo + ' 1: ', testo);      
      // localStorage.setItem(this.userName + '_' + this.NomeCombo + '_multisel', this.sistemaTesto(testo));

      // logConsole('click 4', testo);
      const t = setTimeout(() => {
        clearTimeout(t);

        this.rigaSelezionata = testo;
        this.testoOriginale = testo;
      }, 100);

      this.ritornaValore(testo, true, '12');
    } else {
      // // logConsole(last);
      // // logConsole(this.data);
      // this.controllaSeCiSonoIDati();
      // let ret = '';
      // // logConsole(this.data);
      let numeroRiga = 0;
      this.rigaSelezionata = '';
      this.testoOriginale = '';
      let data2;
      if (this.campoRaggruppamento) {
        data2 = this.FilteredData;
      } else {
        data2 = this.FilteredData;
      }
      if (data2 && data2 !== 'empty grid' && data2 !== 'empty') {
        // // logConsole(data2);
        data2.forEach(element => {
          // if (ret === '') {
            // // logConsole(element[this.campoId].toString(), last.toString());
            // // logConsole(numeroRiga, element);
            if (this.Selezione2) {
              this.Selezione2[numeroRiga] = false;
            }
            if (this.rigaSelezionata === '') {
              if ((element.Id || element.Id.toString() === '0')  && element.Id !== null && last !== null && element.Id.toString() === last.toString()) {
                // ret = element; // [this.campoTesto];
                const nr = numeroRiga;
                const t = setTimeout(() => {
                  clearTimeout(t);

                  this.rigaSelezionata = element.Testo;
                  this.testoOriginale = element.Testo;
                  if (this.Selezione2) {
                    this.Selezione2[nr] = true;
                    this.vecchiaSelezione = nr;
                  }
                  // // logConsole('Ultimo valore selezionato:', this.rigaSelezionata, numeroRiga);
                  if (this.data) {
                    this.data.forEach(element2 => {
                      if (element2[this.campoId] && element2[this.campoId].toString() === last.toString()) {
                        this.ritornaValore(element2, true, '1');
                      }
                    });
                  }
                }, 100);
              }
            }
            numeroRiga++;
        });
      }
    }

    // return ret;
  }

  vecchioElemento;

  ritornaValore(elemento, invia, daDove) {
    if (!elemento) {
      // return;
    }
    // logConsole('Valore ritornato da combo. Provenienza ' + daDove + ': ', '->' + elemento + '<-', this.vecchioElemento, elemento, invia);
    // if (this.vecchioElemento !== elemento) {
      this.vecchioElemento = elemento;
      if (invia) {
        // logConsole('Cambio valore: ', '->' + elemento + '<-');
        this.selezioneEffettuata.emit(elemento); // JSON.stringify(last));
      }
    // }
  }

  creaDati(filtroPassato, nonSelezionare, pulisci, nuovoValore, daDove) {
    let filtro = filtroPassato;

    if (this.evitaRicercaTramiteCampoTesto2 === true) {
      filtro = '';
      this.scriveLog('Crea dati: Azzero filtro per parametro');
    }

    // // logConsole('Crea dati inizio', filtro, nonSelezionare, pulisci, nuovoId, daDove);
    const righe = new Array();
    const sele = new Array();
    righe.push({ Id: 0, Testo: this.stringaVuota, Riga: 0, Categoria: '', Indentato: false});
    sele.push(false);

    if (this.data) {
      if (this.campoRaggruppamento) {
        const categorie = new Array();
        // // logConsole('Valori combo:', this.data, typeof(this.data));
        if (typeof(this.data) !== 'string') {
          this.data.forEach(element => {
            const categoria = element[this.campoRaggruppamento];
            let ok = false;
            let riga = 0;
            categorie.forEach(element2 => {
              if (element2.categoria === categoria) {
                categorie[riga]['righe'].push(element);
                ok = true;
              }
              riga++;
            });
            if (!ok) {
              categorie.push({categoria: categoria, righe: new Array()});
              // // logConsole(categorie);
              categorie[categorie.length - 1]['righe'].push(element);
            }
          });
          // // logConsole(categorie);
          let numeroRiga = 1;
          categorie.forEach(element => {
            let cate = element.categoria;
            if (!cate || cate === '') {
              cate = 'No Category';
            }
            const rigaTitolo = { Id: -1, Testo: element.categoria, Riga: numeroRiga, Categoria: cate, Indentato: false };
            let messoTitolo = false;

            numeroRiga++;

            element.righe.forEach(element2 => {
              const riga = { Id: -1, Testo: '', Riga: numeroRiga, Categoria: '', Indentato: true };

              let ok = false;
              if (element2[this.campoId] || element2[this.campoId] === 0) {
                riga.Id = element2[this.campoId];
                ok = true;
              }
              if (element2[this.campoTesto]) {
                let ok = true;

                if (filtro !== '') {
                  const f = filtro.split(" ");
                  f.forEach(element => {
                    if (element && element !== '') {
                      if (ok && element2[this.campoTesto].toUpperCase().indexOf(element.toUpperCase().trim()) === -1) {
                        ok = false;
                      }
                    }
                  });
                }
                // ok = element2[this.campoTesto].toUpperCase().indexOf(filtro.toUpperCase().trim()) > -1;
                if (ok || filtro === '') {
                  // // logConsole('*' + element2[this.campoTesto] + '*', f);
                  riga.Testo = element2[this.campoTesto];
                  ok = true;

                  this.scriveLog('Crea dati: aggiungo riga ', riga, filtro);
                } else {
                  ok = false;
                }
              }
              if (ok && riga.Testo !== '') {
                // // logConsole(riga);
                if (!messoTitolo) {
                  messoTitolo = true;
                  righe.push(rigaTitolo);
                  sele.push(false);      
                }
                riga.Riga = numeroRiga;
                righe.push(riga);
                sele.push(false);
              }

              numeroRiga++;
            });
          });
          this.scriveLog('Crea dati: Righe finali ', righe);
        }
      } else {
        let numeroRiga = 0;
        this.data.forEach(element => {
          const riga = { Id: -1, Testo: '', Riga: -1, Categoria: '', Indentato: false };
          let ok = false;
          if (element[this.campoId]) {
            riga.Id = element[this.campoId];
            ok = true;
          }
          if (element[this.campoTesto]) {
            // // logConsole('ELEMENT: ', typeof(element[this.campoTesto]), element[this.campoTesto]);
            if (element[this.campoTesto].toString().toUpperCase().indexOf(filtro.toUpperCase().trim()) > -1 || filtro === '') {
              riga.Testo = element[this.campoTesto];
              ok = true;
            } else {
              ok = false;
            }
          }
          if (ok) {
            riga.Riga = numeroRiga;
            righe.push(riga);
            sele.push(false);
          }

          numeroRiga++;
        });
      }
    }

    this.scriveLog('Arrivati dati 2: ', righe, nuovoValore, this.FilteredData)
    
    this.FilteredData = JSON.parse(JSON.stringify(righe));
    this.Selezione = sele;
    this.Selezione2 = JSON.parse(JSON.stringify(sele));
    this.vecchiaSelezione = -1;

    // // logConsole('Combo: ', )
    this.scriveLog('Arrivati dati 3: ', pulisci)

    if (pulisci && !this.selezioneMultipla) {
      this.scriveLog('Pulizia', nonSelezionare, this.ricordaUltimoValore);
      if (!nonSelezionare) {
        if (this.ricordaUltimoValore) {
          let last = localStorage.getItem(this.userName + '_' + this.NomeCombo + '_sel');
          if (last === '***EMPTY***') {
            const t = setTimeout(() => {
              clearTimeout(t);

              this.scriveLog('Pulizia effettuata');
              this.rigaSelezionata = this.stringaVuota;
              this.testoOriginale = this.stringaVuota;
              // // logConsole('Ultimo valore selezionato:', this.rigaSelezionata);
              this.ritornaValore("", true, '2');
            }, 100);
          } else {
            this.ritornaValoreDaCodice(last, 'CreaDati');
          }
        }
      }
    }

    if (this.selezioneMultipla) {
      if (nuovoValore) {
        this.rigaSelezionata += ',' + nuovoValore;

        this.scriveLog('Seleziona valori multipli. Testo: ', this.rigaSelezionata);
      }

      this.selezionaValoriMultipli();
    }

    return;

    this.FilteredData = this.data;
    if (this.FilteredData && this.FilteredData !== null) {
      if (this.campoRaggruppamento && this.campoRaggruppamento !== null && this.campoRaggruppamento !== '') {
        // this.groupedData = groupBy(this.FilteredData, [{field: this.campoRaggruppamento}]);
      } else {
        // this.groupedData = this.FilteredData;
      }
    }
  }

  ngAfterViewInit() {
  }

  focusFunction(e) {
    // // logConsole('focus');
    ComboMiaComponent.comboSelezionata = this.NomeCombo;
  }

  controlloUltimoValore() {
    if (this.data && this.userName && this.NomeCombo && this.campoTesto && this.campoId) {
      // // logConsole('Ultimo valore. Nome combo: ' + this.NomeCombo);
      // // logConsole('Ultimo valore. User Name: ' + this.userName);
      // // logConsole('Ultimo valore. Ricorda ultimo valore: ' + this.ricordaUltimoValore);
      if (this.ricordaUltimoValore) {
        let last = '';
        if (this.selezioneMultipla) {
        } else {
          last = localStorage.getItem(this.userName + '_' + this.NomeCombo + '_sel');
          // // logConsole('Ultimo valore. Valore: ' + last);
          if (last !== null) {
            // const ll = JSON.parse(last);
            /* setTimeout(() => {
              last = this.ritornaValoreDaCodice(last);
              this.ritornaValore(last)
            }, 1000); */
            // setTimeout(_ => last = this.ritornaValore(last), 200);
            if (last === '***EMPTY***') {
              const t = setTimeout(() => {
                clearTimeout(t);

                this.rigaSelezionata = this.stringaVuota;
                this.testoOriginale = this.stringaVuota;
                // // logConsole('Ultimo valore selezionato:', this.rigaSelezionata);
                this.ritornaValore("", true, '3');
              }, 100);
            } else {
              this.ritornaValoreDaCodice(last, 'ControlloUltimoValore');
            }
          }
        // } else {
        //   this.checkContenutoDefault();
        }

        this.ritornoValoreAttuale.emit(last);
      }
    }
  }

  selezionaValoriMultipli() {
    // const selez = localStorage.getItem(this.userName + '_' + this.NomeCombo + '_multisel');
    const selez = null;
    return;

    let selez2 = new Array();
    if (selez !== null) {
      selez2 = selez.split(',');
    }

    this.scriveLog('Seleziona valori multipli', selez2);

    /* if (nuovoId !== undefined && nuovoId !== null) {
      selez2.push(nuovoId);
    } */
    let testo = '';
    let id = 0;
    // // logConsole('Controllo per Selezione multipla 1', selez2, this.data, this.campoId);
    if (this.data) {
      this.data.forEach(element => {
        let ok = false;
        selez2.forEach(element2 => {
          if (!ok && element2 === element[this.campoId]) {
            // // logConsole('Selezionate', element2, element);
            ok = true;
            testo += element[this.campoTesto] + ',';
          }
        });
        if (ok) {
          element.Selezionata = true;
        } else {
          element.Selezionata = false;
        }
        id++;
      });
    }

    if (this.FilteredData) {
      const f = JSON.parse(JSON.stringify(this.FilteredData));
      f.forEach(element => {
        let ok = false;
        selez2.forEach(element2 => {
          if (!ok && element2 === element.Id) {
            ok = true;
          }
        });
        if (ok) {
          element.Selezionata = true;
        } else {
          element.Selezionata = false;
        }
      });

      this.FilteredData = JSON.parse(JSON.stringify(f));
    }

    if (testo.length > 0) {
      testo = testo.substring(0, testo.length - 1);
    }
    // // logConsole('Selezionate', testo);
    this.rigaSelezionata = testo;
    this.scriveLog('Seleziona valori multipli. Testo: ', this.rigaSelezionata);

    // // logConsole('Controllo per Selezione multipla 2', selez2, this.FilteredData);
    /* if (this.FilteredData) {
      this.FilteredData.forEach(element => {
        let ok = false;
        selez2.forEach(element2 => {
          // // logConsole('Selezionate', element2, element);
          if (!ok && +element2 === +element.Id) {
            ok = true;
          }
        });
        if (ok) {
          element.Selezionata = true;
        } else {
          element.Selezionata = false;
        }
      });

      this.FilteredData = JSON.parse(JSON.stringify(this.FilteredData));
    } */
  }

  ngOnChanges(c) {
    if (c.Debug) {
      this.scriveDebug = c.Debug.currentValue;
      // logConsole('DEBUG: ' + this.scriveDebug);
    }

    if (this.scriveDebug && this.NomeCombo === this.debugComboName) {
      this.scriveLog('onChanges combo:', c);
    }

    if (c.evitaRicercaTramiteCampoTesto) {
      this.evitaRicercaTramiteCampoTesto2 = c.evitaRicercaTramiteCampoTesto.currentValue;
    }

    if (c.selezioneMultipla) {
      this.ritornaValoreDaCodice(null, 'onChanges');
    }

    if (c.userName) {
      this.controlloUltimoValore();
    }

    if (c.NomeCombo) {
      this.controlloUltimoValore();
    }

    if (c.campoTesto) {
      this.controlloUltimoValore();
    }

    if (c.campoId) {
      this.controlloUltimoValore();

      if (this.selezioneMultipla) {
        this.selezionaValoriMultipli();
      }
    }

    if (c.forzaSelezione) {
      if (c.forzaSelezione.currentValue !== '') {
        // // logConsole('Forzata selezione: ', c.forzaSelezione.currentValue);
        this.scriveLog('Forza Selezione', c.forzaSelezione.currentValue);
        const t = setTimeout(() => {
          clearTimeout(t);

          this.cambiataSelezione(c.forzaSelezione.currentValue);
        }, 1000);
      }
    }

    if (c.pulisceFiltro) {
      /* this.scriveLog('Pulisce filtro onChanges');
      this.FilteredData = this.data; */
      if (typeof(c.pulisceFiltro.currentValue) === 'string') {
        this.changeValue('');
      }
    }

    if (c.data) {
      this.scriveLog('Arrivati dati: ', c.data)
      
      this.creaDati(this.filtro, false, false, null, 'Data');
      this.controlloUltimoValore();
    }

    if (c.aggiungeRiga) {
      if (c.aggiungeRiga.currentValue) {
        this.scriveLog('Arrivata nuova riga: ', c.aggiungeRiga.currentValue);
        this.data.push(c.aggiungeRiga.currentValue);
        this.FilteredData.push(c.aggiungeRiga.currentValue);
        /* let selezionate = localStorage.getItem(this.userName + '_' + this.NomeCombo + '_multisel');
        if (!selezionate || selezionate === null) {
          selezionate = c.aggiungeRiga.currentValue[this.campoTesto];
        } else {
          selezionate += ',' + c.aggiungeRiga.currentValue[this.campoTesto];
        }
        localStorage.setItem(this.userName + '_' + this.NomeCombo + '_multisel', this.sistemaTesto(selezionate)); */
        this.creaDati(this.filtro, false, false, c.aggiungeRiga.currentValue[this.campoTesto], 'Aggiunta Riga');
        this.ritornaValore(this.rigaSelezionata, true, 'c.aggriga');
      }
    }

    if (c.disabilitata) {
      // const element = this.renderer.selectRootElement('#myInput');
      // // logConsole(element);
      const input = document.getElementById('myInput_' + this.NomeCombo);
      if (input !== null) {
        // // logConsole(input);
        input.focus();

        const t = setTimeout(() => {
          clearTimeout(t);

          const last = document.getElementById('myInput_' + ComboMiaComponent.comboSelezionata);
          if (last && last !== null) {
            last.focus();
          }
        }, 100);
      }

      // this.inputEl.nativeElement.focus();
      this.disabilitata2 = c.disabilitata.currentValue;
    }

    if (c.pulisceValoriDiBase) {
      if (c.pulisceValoriDiBase.currentValue) {
        /* this.scriveLog('Pulisce valori di base');
        localStorage.removeItem(this.userName + '_' + this.NomeCombo + '_lastsel');
        localStorage.removeItem(this.userName + '_' + this.NomeCombo + '_multisel'); */
      }
    }

    if (c.valoreDefault && (c.valoreDefault.currentValue || c.valoreDefault.currentValue === 0 || c.valoreDefault.currentValue === '') ) {
      /* if (this.scriveDebug) {
        // logConsole('Arrivato valore di default:', c.valoreDefault.currentValue);
      }

      if (typeof(c.valoreDefault.currentValue) === 'object') {
        if (this.scriveDebug) {
          // logConsole('Valore default combo 1', c.valoreDefault, c.valoreDefault.currentValue[this.campoId]);
        }
        if (c.valoreDefault.currentValue && c.valoreDefault.currentValue[this.campoId]) {
          this.valoreDefault = c.valoreDefault.currentValue[this.campoId].toString();
        }
      } else {
        if (this.scriveDebug) {
          // logConsole('Valore default combo 2', c.valoreDefault, c.valoreDefault.currentValue);
        }
        this.valoreDefault = c.valoreDefault.currentValue.toString();
      }
      this.checkContenutoDefault(); */
      this.rigaSelezionata = c.valoreDefault.currentValue;
      this.testoOriginale = c.valoreDefault.currentValue;
      this.scriveLog('Arrivato valore di base', c.valoreDefault.currentValue);
      this.ritornaValoreDaCodice(c.valoreDefault.currentValue, 'ValoreDefault');
      this.filtroInserito = '';
    }
  }

  /*
  checkContenutoDefault() {
    if (this.scriveDebug) {
      // logConsole('Data:', this.data);
      // logConsole('Vecchio valore combo:', this.valoreDefault);
      // logConsole('Vecchio valore combo setted:', this.valoreDefaultSetted);
    }

    if (this.data && typeof(this.data) !== 'string') {
      if ((this.valoreDefault === '0') || (this.valoreDefault === '') || (this.valoreDefault && this.valoreDefault !== null)) {
        if (this.campoTesto !== this.campoId) {
          this.valoreDefaultSetted = '';
          this.data.forEach(element => {
            if (this.valoreDefaultSetted === '') {
              const primo = element[this.campoId].toString();
              const secondo = this.valoreDefault.toString();
              if (this.scriveDebug && this.NomeCombo === this.debugComboName) {
                // logConsole('Ricerca su combo ' + this.NomeCombo + ': ', primo, secondo);
              }
              if (primo === secondo) {
                this.valoreDefaultSetted = element[this.campoTesto];
              }
            }
          });
          // if (this.valoreDefaultSetted === '') {
            // // logConsole('Valore combo non trovato');
          // }
        } else {
          this.valoreDefaultSetted = this.valoreDefault;
        }
      }
    } else {
      // // logConsole('Data vuoto');
    }

    if (this.scriveDebug) {
      // logConsole('Valore impostato: ', this.valoreDefaultSetted);
    }
  }
  */

  handleFilter(value) {
    if (this.campoFiltro && this.campoFiltro !== '') {
      if (this.data) {
        try {
          this.FilteredData = this.data.filter((s) => s[this.campoFiltro].toLowerCase().indexOf(value.toLowerCase()) !== -1);
        } catch (e) {

        }
        // // console.log (this.FilteredData);
        if (this.FilteredData && this.FilteredData !== null) {
          if (this.campoRaggruppamento && this.campoRaggruppamento !== null && this.campoRaggruppamento !== '') {
            // this.groupedData = groupBy(this.FilteredData , [{field: this.campoRaggruppamento}]);
          } else {
            // this.groupedData = this.FilteredData;
          }
        }
      }
    }
  }

  cambiataSelezione(e) {
    this.scriveLog('Cambiata selezione in combo:', e, this.ricordaUltimoValore);
    if (e && e[this.campoTesto]) {
      if (this.ricordaUltimoValore) {
        localStorage.setItem(this.userName + '_' + this.NomeCombo + '_sel', JSON.stringify(e[this.campoId]));
        this.scriveLog('Salvo su cookie valore combo ' + this.userName + '_' + this.NomeCombo + ':', JSON.stringify(e[this.campoId]));
        const last = localStorage.setItem(this.userName + '_' + this.NomeCombo + '_lastsel', JSON.stringify(e[this.campoId]));
      }

      // // logConsole('Selezione combo in combo 1:', e[this.campoTesto]);
      // this.selezioneEffettuata.emit(e);
      this.ritornaValore(e, true, '4');
    } else {
      let scritta = '';
      if (e !== null && e !== undefined) {
        scritta = e[this.campoId];
      }
      if (this.ricordaUltimoValore) {
        const last = localStorage.setItem(this.userName + '_' + this.NomeCombo + '_lastsel', scritta);
      }
      // // logConsole('Selezione combo in combo 2:', e);
      // this.selezioneEffettuata.emit(e);
      this.ritornaValore(e, true, '5');
    }
  }

  digitazione(e) {
    // logConsole('Digitazione combo:', e);
    this.cambioValore.emit(e);
  }

  addValue(e, valore) {
    this.scriveLog('Aggiungo valore', e, valore);
    let riga;
    this.data.forEach(element => {
      if (!riga && element[this.campoId] === e.Id) {
        riga = element;
      }
    });

    // if (!riga) {
      /* // logConsole('DEBUGCOMBO: DATI SU SELEZIONE DA COMBO. Riga:', riga);
      // logConsole('DEBUGCOMBO: DATI SU SELEZIONE DA COMBO. e:', e);
      // logConsole('DEBUGCOMBO: DATI SU SELEZIONE DA COMBO. Dati:', this.data);
      // logConsole('DEBUGCOMBO: DATI SU SELEZIONE DA COMBO. Dati Filtrati:', this.FilteredData);
      // logConsole('DEBUGCOMBO: DATI SU SELEZIONE DA COMBO. CampoID:', this.campoId); */
    //   return;
    // }

    let selezionate = '';
    let testo = '';
    const checked = valore.srcElement.checked;
    // // logConsole(riga, valore, riga[this.campoTesto], this.data);

    riga.Selezionata = checked;

    this.data.forEach(element => {
      if (element && element.Selezionata === true) {
        // // logConsole('Elemento selezionato', element);
        selezionate += element[this.campoId] + ',';
        testo += element[this.campoTesto] + ',';
      }
    });

    /* const vecchi = localStorage.getItem(this.userName + '_' + this.NomeCombo + '_multisel');
    if (vecchi !== null) {
      // logConsole('Vecchi valori', vecchi);
    } */

    if (selezionate.length > 0) {
      selezionate = selezionate.substring(0, selezionate.length - 1);
      testo = testo.substring(0, testo.length - 1);
    }
    // // logConsole('Selezionate', selezionate, testo);
    this.rigaSelezionata = testo;
    this.testoOriginale = testo;
    this.scriveLog('Aggiungo valore. Testo:', testo);

    e.Selezionata = checked;
    this.FilteredData = JSON.parse(JSON.stringify(this.FilteredData));

    // // logConsole('Setitem combo ' + this.NomeCombo + ' 2: ', selezionate);
    // localStorage.setItem(this.userName + '_' + this.NomeCombo + '_multisel', this.sistemaTesto(selezionate));

    this.ritornaValoreDaCodice(null, 'AddValue');
  }

  valoreInseritoAMano() {
    // logConsole('Valore inserito a mano', this.filtro);
    this.visibileTastoAdd = false;
    this.ritornaValore('***' + this.filtro, true, '11');
    this.filtroInserito = '';
    this.popupAperto = !this.popupAperto;
  }

  changeValue(e) {
    // logConsole('Cambio valore', e);
    // alert('Cambio valore'+ e);
    this.filtroInserito = '';
    this.visibileTastoAdd = false;

    if (this.selezioneMultipla) {
      this.data.forEach(element => {
        element.Selezionata = false;
      });
      this.FilteredData.forEach(element => {
        element.Selezionata = false;
      });

      // localStorage.setItem(this.userName + '_' + this.NomeCombo + '_multisel', null);
      // localStorage.removeItem(this.userName + '_' + this.NomeCombo + '_multisel');
      this.filtro = '';
      // this.rigaSelezionata = '';
      this.scriveLog('Cambio valore selezione multipla. Azzero filtro e riga selezionata');

      this.ritornaValoreDaCodice(null, 'ChangeValue');
      // this.ritornaValore(this.rigaSelezionata, true, '13');
      // alert('changeValue');
      // logConsole('CHANGE 1', e);
      return;
    } else {
      // logConsole(e);
      if (!e || e.Testo === this.stringaVuota) {
        const t = setTimeout(() => {
          clearTimeout(t);

          localStorage.setItem(this.userName + '_' + this.NomeCombo + '_sel', "***EMPTY***");

          this.rigaSelezionata = ''; // this.stringaVuota;
          this.testoOriginale = '';
          this.filtro = '';
          this.scriveLog('Cambio valore. Azzero filtro e riga selezionata');
          // logConsole('Azzero campo');

          // this.selezioneEffettuata.emit("");
          this.ritornaValore("", true, '6');
          // this.clickRiga.emit("");
          this.creaDati(this.filtro, false, false, null, 'Change Value');

          this.Selezione2[this.vecchiaSelezione] = false;
          this.Selezione2[0] = true;
          this.vecchiaSelezione = 0;

          // logConsole('CHANGE 2', e);
          return;
        }, 100);
      } else {
        if (this.campoRaggruppamento) {
          // // logConsole(e, this.FilteredData, this.FilteredData[e.Riga]);
          let riga;
          this.data.forEach(element => {
            if (!riga && element[this.campoId] === e.Id) {
              riga = element;
            }
          });
          /* // logConsole('Combo. Data: ', this.data);
          // logConsole('Combo. FilteredData: ', this.FilteredData);
          // logConsole('Combo e: ', e);
          // logConsole('Combo e.Riga: ', e.Riga); */

          this.rigaSelezionata = riga[this.campoTesto]; //  this.FilteredData[e.Riga].Testo;
          this.testoOriginale = riga[this.campoTesto]; //  this.FilteredData[e.Riga].Testo;
          this.scriveLog('Cambio valore. Imposto riga selezionata', this.rigaSelezionata);

          // this.ritornaValore(this.FilteredData[e.Riga]);
          this.ritornaValore(riga, true, '7');
          // this.clickRiga.emit(riga);

          this.Selezione2[this.vecchiaSelezione] = false;
          this.vecchiaSelezione = e.Riga;
          this.Selezione2[e.Riga] = true;

          // localStorage.setItem(this.userName + '_' + this.NomeCombo + '_sel', JSON.stringify(this.FilteredData[e.Riga].Id));
          localStorage.setItem(this.userName + '_' + this.NomeCombo + '_sel', JSON.stringify(e.Id));

          this.filtro = riga[this.campoTesto];
          // logConsole('CHANGE 3', riga[this.campoTesto]);
        } else {
          // // logConsole(e, this.campoTesto);

          this.rigaSelezionata = this.data[e.Riga][this.campoTesto];
          this.testoOriginale = this.data[e.Riga][this.campoTesto];
          this.scriveLog('Cambio valore. Imposto riga selezionata else', this.rigaSelezionata);

          this.ritornaValore(this.data[e.Riga], true, '8');
          // this.clickRiga.emit(this.data[e.Riga]);

          this.Selezione2[this.vecchiaSelezione] = false;
          this.vecchiaSelezione = e.Riga + 1;
          this.Selezione2[e.Riga + 1] = true;

          localStorage.setItem(this.userName + '_' + this.NomeCombo + '_sel', JSON.stringify(this.data[e.Riga][this.campoId]));
          // logConsole('CHANGE 4', e);
        }
      }
      // this.filtro = '';
      this.scriveLog('Valore impostato dalla combo: ', this.rigaSelezionata);
      this.popupAperto = false;
      this.creaDati('', false, false, null, 'Change Value 2');

      // logConsole('CHANGE 5', e);
      return;

      if (e.srcElement.selectedIndex === 0) {
        setTimeout(() => {
          this.rigaSelezionata = this.stringaVuota;
          this.filtro = '';
          // this.selezioneEffettuata.emit("");
          this.ritornaValore("", true, '9');
          this.creaDati(this.filtro, false, true, null, 'Change Value 3');
          localStorage.setItem(this.userName + '_' + this.NomeCombo + '_sel', "***EMPTY***");
        }, 100);
      } else {
        const idRiga = this.FilteredData[e.srcElement.selectedIndex].Riga;
        // logConsole('Cambiato valore combo:', idRiga, this.data[idRiga], this.data[idRiga][this.campoTesto]);
        this.rigaSelezionata = this.data[idRiga][this.campoTesto];
        // this.selezioneEffettuata.emit(this.data[idRiga]);
        this.ritornaValore(this.data[idRiga], true, '10');

        localStorage.setItem(this.userName + '_' + this.NomeCombo + '_sel', JSON.stringify(this.data[idRiga][this.campoId]));
      }
      /* if (typeof(e) === 'undefined') {
        // // logConsole('Azzerato valore combo');
        localStorage.removeItem(this.userName + '_' + this.NomeCombo + '_sel');
        this.selezioneEffettuata.emit('empty');
      } else {
        let trovato = '';
        this.data.forEach(element => {
          if (trovato === '' && element[this.campoTesto]) {
            const primo = element[this.campoTesto].toString();
            const secondo = e;
            if (primo === secondo) {
              trovato = element[this.campoTesto];
            }
          }
        });

        if (trovato === '') {
          // // logConsole('Messo a mano valore combo', e, typeof(e));
          this.selezioneEffettuata.emit('***' + e);
        }
      }

      if (this.ricordaUltimoValore) {
        localStorage.setItem(this.userName + '_' + this.NomeCombo + '_lastsel', JSON.stringify(e[this.campoId]));
        if (this.scriveDebug && this.NomeCombo === this.debugComboName) {
          // logConsole('Salvo su cookie valore combo ' + this.userName + '_' + this.NomeCombo + ':', JSON.stringify(e[this.campoId]));
        }
      } */
    }
  }

  hoIlFocus = false;

  mouseDentro() {
    // // logConsole('Dentro');
    this.hoIlFocus = true;
    this.eventoMouseOver.emit(new Date().toString());
  }

  mouseFuori() {
    this.hoIlFocus = false;
    // // logConsole('Fuori');
    this.eventoMouseLeave.emit(new Date().toString());
  }

  open() {
    // // logConsole('Open');
    this.eventoOpen.emit(new Date().toString());
  }

  close() {
    // // logConsole('Close');
    this.eventoClose.emit(new Date().toString());
  }

  prendeLarghezza() {
    if (this.larghezza === '') {
      return '100%';
    } else {
      // if (this.larghezza.toUpperCase().indexOf('PX') === -1) {
      //   this.larghezza += 'px';
      // }
      return this.larghezza;
    }
  }

  prendeDimeFont() {
    if (this.dimeFont === '') {
      return '14px';
    } else {
      return this.dimeFont;
    }
  }
  
  testoModificato = '';
  testoOriginale = '';
  tt;

  cambioFiltro(tasto) {
    this.scriveLog('Cambio filtro', tasto);
    this.filtroInserito = this.filtro;

    // // logConsole(tasto);
    if (tasto.code === 'Enter') {
      this.visibileTastoAdd = false;
      this.uscitaTesto();
      return;
    } else {
      if (!this.visibileTastoAdd) {
        this.visibileTastoAdd = true;
      }
    }

    this.popupAperto = true;
    this.dimensioneCombo = this.divContenitoreCombo.nativeElement.offsetWidth - 8;

    // return;
    if (!this.tt) {
      this.testoModificato = this.filtro;

      this.tt = setInterval(() => {
        if (this.filtro === this.testoModificato) {
          clearInterval(this.tt);
          this.tt = undefined;

          // // logConsole(this.filtro);
          this.creaDati(this.filtro, true, false, null, 'Cambio Filtro');
          this.txtFilter.nativeElement.focus();
          // logConsole('Digito 1', '*' + this.filtro + '*');
          this.cambioValore.emit(this.filtro);  
        } else {
          this.testoModificato = this.filtro;
        }
      }, 150);
    }
  }

  cambioFiltroSM(tasto) {
    const t = setTimeout(() => {
      clearTimeout(t);

      // // logConsole(this.filtro);
      this.creaDati(this.filtro2, true, false, null, 'Cambio Filtro SM');
      this.txtFilter2.nativeElement.focus();
      this.cambioValore.emit(this.filtro2);
    }, 100);
  }

  filtroInserito = '';

  uscitaTesto() {
    const t = setTimeout(() => {
      clearTimeout(t);

      if (this.accettaNuovi) {
        if (this.filtro) {
          // this.selezioneEffettuata.emit('***' + this.filtro);
          this.ritornaValore('***' + this.filtro, true, '11');
          this.popupAperto = !this.popupAperto;
          // this.uscitaCombo.emit(new Date().toString());
        }
      }
    }, 100);
  }

  uscitaTestoNuovo() {
    // // logConsole('Nuovo valore', this.nuovaRiga, this.data);
    if (this.rigaSelezionata.trim().indexOf(',' + this.nuovaRiga.trim()) > -1 || 
      this.rigaSelezionata.trim().indexOf(this.nuovaRiga.trim() + ',') > -1 ||
      this.rigaSelezionata.trim() === this.nuovaRiga.trim()) {
      alert('Value already present');
      return;
    }

    let idd = -1;
    let riga = -1;
    let newValue = false;
    this.FilteredData.forEach(element => {
      if (element.Id > idd) {
        idd = element.Id;
      }
      /* if (element.name === this.nuovaRiga) {
        alert('Value already present');
        return;
      } */
      if (element.Riga > riga) {
        riga = element.Riga;
      }
      if (element.Testo === 'New Values') {
        newValue = true;
      }
    });
    idd++;
    riga++;

    if (!newValue) {
      const n = {
        Categoria: "New Values",
        Id: "New Values",
        Indentato: false,
        Riga: riga,
        Selezionata: false,
        Testo: "New Values"
      }
      this.FilteredData.push(n);
      idd++;
      riga++;
    }

    const n = {
      Categoria: "",
      Id: this.nuovaRiga,
      Indentato: true,
      Riga: riga,
      Selezionata: true,
      Testo: this.nuovaRiga
    }
    this.FilteredData.push(n);

    const d: any = {};
    d[this.campoId] = this.nuovaRiga;
    d[this.campoTesto] = this.nuovaRiga;
    d.Selezionata = true;
    if (!this.data) {
      this.data = new Array();
    }
    this.data.push(d);

    // // logConsole('NUOVI', this.FilteredData, this.data);

    // const selez = localStorage.getItem(this.userName + '_' + this.NomeCombo + '_multisel');
    const selez = this.rigaSelezionata;
    let selez2 = '';
    if (selez !== null) {
      selez2 = selez + ',';
    }
    selez2 += idd;
    if (this.rigaSelezionata.length > 0) {
      this.rigaSelezionata += ',';
    }
    this.rigaSelezionata += this.nuovaRiga;

    this.nuovaRiga = '';

    this.ritornaValore(this.rigaSelezionata, true, 'utn');

    this.scriveLog('Uscita testo nuovo', this.rigaSelezionata);
  }

  sistemaTesto(t) {
    if (t === ',') {
      t = '';
    } else {
      while (t.indexOf(',,') > -1) {
        t = t.replace(',,', ',');
      }
      if (t === ',') {
        t = '';
      } else {
        if (t.substring(t.lenght - 1, 1) === ',') {
          t = t.substring(0, t.lenght - 1);
        }
      }

      this.rigaSelezionata = t;
      this.testoOriginale = t;

      return t;
    }
  }

  trackByRighe(index: number, item: any) {
    return item.Testo;
  }
}

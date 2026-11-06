import { logConsole } from '../console-log';
import { ApiService } from './api.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import Utilities from './Utilities.component';
// import 'rxjs/add/operator/map';
import { DomSanitizer } from '@angular/platform-browser';
import { VoiceRecognitionService } from './speechRecognition.component';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ExternalHttpClient } from './httpclient.service';
// import { map } from 'rxjs/operators';

@Component({
  selector: 'app-barra-superiore',
  templateUrl: 'barrasuperiore.component.html',
  styleUrls: [ 'barrasuperiore.style.css' ],
  providers: [VoiceRecognitionService]
})

export class BarraSuperioreComponent implements  OnInit, OnChanges, OnDestroy {
  @Input() platformName;
  @Input() nomeApp;
  @Input() Utils;
  @Input() sessioneID;
  @Input() debug = false;
  @Input() gruppo = '';
  @Input() visualizzaSecondoMenu = false;
  @Input() microfonoAttivo = false;
  @Input() userName;
  @Input() groupName;
  @Input() fullScreen;
  @Input() urlRoot;
  @Input() dataOraServer;

  @Output() apreMenuEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() apreMenu2Emit: EventEmitter<string> = new EventEmitter<string>();
  @Output() statoServerEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() statoManutenzioneEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() coloreSfondoEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() comandoVocaleEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() dataOraServerEmit: EventEmitter<string> = new EventEmitter<string>();

  sess2;
  Utils2;
  linkCustomer;
  linkProduct;
  nomeIcona = '';
  mouseOverCampo = false;
  // dataOraServer = '';

  itr;
  statoManutenzione;
  messaggioLogin;
  coloreSfondo = 'white';
  errore = '';
  staiParlando = false;
  microAttivo = false;
  testoVocale = '';
  coloreTesto = '#fff1ea';
  campoTestoInFocus = true;
  visualizzaMicrofono = false;

  destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private http: ExternalHttpClient,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    public speech : VoiceRecognitionService,
    private comandiVocali: ComandiVocaliComponent
  ) {
  }

  ngOnInit() {
    this.getJSON().subscribe(data => {
      this.lettoJSON(data);
    });
  }

  public getJSON(): Observable<any> {
    // // logConsole(window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && window.location.port === '4200') {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      let u = window.location.href;
      // u = 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/login/login/';
      // u = 'https://geoants.aubay.it/login';
      // // logConsole(u);
      if (u.indexOf('?') > -1) {
        u = u.substring(0, u.indexOf('?'));
      }
      u = u.replace('login/login', 'login');
      // // logConsole(u);
      const prima = u.substring(0, 8);
      let seconda = u.substring(8, u .length);
      while (seconda.indexOf('//') > -1) {
        seconda = seconda.replace('//', '/');
      }
      u = prima + seconda;
      // // logConsole(u);
      // // logConsole(u.substring(u.length - 1, u.length));
      if (u.substring(u.length - 1, u.length) === '/') {
        u = u.substring(0, u.length - 1);
      }
      // // logConsole(u);
      let q = 0;
      for (let i = 0; i<u.length; i++) {
        if (u.substring(i, i + 1) === '/') {
          q++;
        }
      }
      if (q > 2) {
        // // logConsole(u, prima, seconda);
        for (let i = u.length; i>0; i--) {
          if (u.substring(i, i + 1) === '/')  {
            u = u.substring(0, i);
            i = 0;
          }
        }
      }
      // logConsole('Indirizzo lettura connection.json', u  + '/assets/connection.json');
      indirizzo = u + '/assets/connection.json?d=' + new Date();

      // indirizzo = window.location.origin + '/geoantsweb/assets/connection.json?d=' + new Date();
    }
    // logConsole('Indirizzo connection json', indirizzo);
    return this.http.get(null, indirizzo);
  }

  ngOnDestroy(): void {
    if (this.itr) {
      clearInterval(this.itr);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkRitornoChiamata(d) {
    if (d) {
      if (d.err_code) {
        if (d.err_code === 1) {
          if (d.failure_reason) {
            if (d.failure_reason === 'cntx invalid') {
              // Torna al login
              localStorage.setItem('ERROR', 'CNTX_INVALID');
              window.location.href = this.Utils.urlRoot + 'login/?err=cntx_invalid';
            } else {
              console.error(d.failure_reason);
              // alert (d.failure_reason);
            }
          }
        }
      }
    }
  }

  speakRecognition() {
    if (this.staiParlando === false) {
      if (this.debug === true) {
        // logConsole('Tento di avviare speak');
      }
      this.speech.start();
      this.staiParlando = true;
    } else {
      if (this.debug === true) {
        // logConsole('Tento di fermare speak');
      }
      this.speech.stop();
      this.staiParlando = false;
      // this.testo = this.speech.text;
    }
    localStorage.setItem(this.userName + '_ActiveMicrophone', this.staiParlando === true ? 'Y' : 'N');
  }

  esegueFunzioneVocale() {
    // this.staiParlando = false;
    let comando = VoiceRecognitionService.text.trim();
    if (comando === '') {
      return;
    }

    // // logConsole(comando);
    this.testoVocale = comando;
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.coloreTesto = '#f15d21';
      const tm1 = setTimeout(() => {
        clearTimeout(tm1);
        this.coloreTesto = '#ffa07a';
        const tm2 = setTimeout(() => {
          clearTimeout(tm2);
          this.coloreTesto = '#f15d21';
          const tm3 = setTimeout(() => {
            clearTimeout(tm3);
            this.coloreTesto = '#fff1ea';
          }, 250);
        }, 150);
      }, 250);
    }, 10);

    const params = {
      v_cntx: this.sess2,
      v_str_command: '\'' + comando + '\''
    };

    this.apiService.chiamataPost(this.Utils2, 'string_to_command', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        Utilities.checkRitornoChiamata(this.Utils2, data2);

        if (this.debug === true) {
          // logConsole('Barra superiore. Ritorno: ', data2);
        }
        if (+data2.err_code === 0) {
          this.comandiVocali.esegueComandoVocale(this, data2);
          this.comandoVocaleEmit.emit(data2);
        } else {
          console.error(data2.err_code + ': ' + data2.failure_reason);
        }
      }
    }, error =>  {
      // Utilities.messaggioDiErroreEsterno(this, 'Login:' + error);
      // TODO alert error
    });
  }

  ngOnChanges(r) {
    if (r.debug) {
      if (r.debug.currentValue === true) {
        // logConsole('Arrivato debug', r.debug.currentValue);
      }
      this.speech.init(this, r.debug.currentValue);
    }

    if (r.microfonoAttivo) {
      if (r.microfonoAttivo.currentValue !== undefined) {
        this.microAttivo = r.microfonoAttivo.currentValue;
        // this.visualizzaMicrofono = this.microAttivo;
        if (this.debug === true) {
          // logConsole('Microfono attivo:', this.microAttivo);
        }
      }
    }

    if (r.userName) {
      if (r.userName.currentValue) {
        const m = localStorage.getItem(r.userName.currentValue + '_ActiveMicrophone') === 'Y' ? true : false;
        // logConsole(r.userName.currentValue , m);
        // this.microfonoAttivo = m;
        this.staiParlando = !m;
        this.speakRecognition();
      }
    }

    if (r.sessioneID && r.sessioneID.currentValue) {
      this.sess2 = r.sessioneID.currentValue;
      if (this.debug === true) {
        // logConsole('Barra: Sessione arrivata', this.sess2);
      }
      this.provaALeggereImpostazioni();
    }

    if (r.Utils && r.Utils.currentValue) {
      this.Utils2 = r.Utils.currentValue;
      if (this.debug === true) {
        // logConsole('Barra superiore. Redirect:', this.Utils2.userRedirect);
      }
      // this.Utils.linkIcone = ''; // 'https://geoants-pre.ants-aubay.it/geoantsweb/assets/img/';
      this.provaALeggereImpostazioni();
    }

    if (r.gruppo && r.gruppo.currentValue) {
      this.nomeIcona = r.gruppo.currentValue;
      if (this.debug === true) {
        // logConsole('Barra: Arrivato gruppo', this.nomeIcona);
      }
    }
  }
  
  aggiungeIndirizzoAPathRelativo(pathIniziale, indirizzo, aggiungeBarra) {
    let ind = indirizzo;

    if (ind.toUpperCase().indexOf('HTTP:') === -1 && ind.toUpperCase().indexOf('HTTPS:') === -1) {
      if (ind.startsWith('/')) {
        ind = ind.substring(1, ind.length);
      }
      let barra = '';
      if (aggiungeBarra) {
        barra = '/';
      }
      ind = pathIniziale + barra + ind;
    }

    return ind;
  }

  lettoJSON(data) {
    const b = data; // JSON.parse(data._body);
    
    // Nuova gestione della mail del 28/04/2026 13:16
    // Si possono mettere url assoluti oppure relativi
    // Se la urlroot è relativa assume l'indirizzo del sito
    let indirizzoCaricato =  window.location.href; // 'https://antsgraclient.ants-aubay.it/gdpsondamistral/geoantsweb/Mappe/'; //
    // logConsole('Indirizzo di base 1: ', indirizzoCaricato);
    if (indirizzoCaricato.toLowerCase().indexOf('geoantsweb/') > -1) {
      indirizzoCaricato = indirizzoCaricato.substring(0, indirizzoCaricato.toLowerCase().indexOf('geoantsweb/'));
    }
    if (indirizzoCaricato.indexOf('?') > -1) {
      indirizzoCaricato = indirizzoCaricato.substring(0, indirizzoCaricato.indexOf('?'));
    }
    if (indirizzoCaricato.endsWith('/')) {
      indirizzoCaricato = indirizzoCaricato.substring(0, indirizzoCaricato.length - 1);
    }

    let urlRoot = b.urlRoot;
    if (urlRoot.length < 2) {
      urlRoot = indirizzoCaricato + "/";
    }
    if (urlRoot.toLowerCase().indexOf('geoantsweb/') > -1) {
      urlRoot = urlRoot.substring(0, urlRoot.toLowerCase().indexOf('geoantsweb/'));
    }
    if (urlRoot.endsWith('/')) {
      urlRoot = urlRoot.substring(0, urlRoot.length - 1);
    }
    if (urlRoot.toLowerCase().indexOf('http://localhost:4200') > -1) {
      urlRoot = 'https://antsgraclient.ants-aubay.it/gdpsondamistral'; // Qualsiasi indirizzo in caso di urlRoot /
    }

    this.Utils.urlRoot = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.urlRoot, true);
    this.Utils.linkIcone  = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
    this.Utils.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.serverPostRest, true);
    // Utils.indirizzoGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot,  b.serverGEOServer, true);
    // Utils.serverGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot,  b.serverGEOServer, true);
    if (this.debug) {
      logConsole('Indirizzo di base 1 barra superiore: ', indirizzoCaricato);
      logConsole('Indirizzo di base 2 barra superiore: ', urlRoot);
      logConsole('Indirizzo urlRoot barra superiore: ', this.Utils.urlRoot);
      logConsole('Indirizzo Icone barra superiore: ', this.Utils.linkIcone);
      logConsole('Indirizzo PostGrest barra superiore: ', this.Utils.serverPostRest);
    }
    // logConsole('Indirizzo GeoServer: ', Utils.serverGEOServer);
    // Nuova gestione della mail del 28/04/2026 13:16
  }

  provaALeggereImpostazioni() {
    // // logConsole(this.sess2, this.Utils2);
    if (this.sess2 && this.Utils2) {
      this.LeggeImpostazioni();
    }
  }

  apreMenu() {
    this.apreMenuEmit.emit(new Date().toString());
  }

  apreMenu2() {
    this.apreMenu2Emit.emit(new Date().toString());
  }

  LeggeImpostazioni2() {
    const params = {
      cntx_id: this.sess2
    };
    this.apiService.chiamataPost(this.Utils2, 'operator_info_my__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        Utilities.checkRitornoChiamata(this.Utils2, data2);

        if (this.debug === true) {
          // logConsole('Barra: Impostazioni 2', data2);
        }
        data2.DataTable.forEach(element => {
          const name = element.name ? element.name.toString().toUpperCase() : element.NAME.toString().toUpperCase();
          // // logConsole(name);
          if (name === 'STRING_TO_COMMAND') {
            const valore = element.value ? element.value : element.VALUE;
            this.visualizzaMicrofono = (valore === 'Y');
            if (this.debug === true) {
              logConsole('Barra: Impostazione String to Command', this.visualizzaMicrofono);
            }
          }
        });
      }
    });
  }

  toolTipPP = '';
  toolTipCP = '';

  LeggeImpostazioni() {
    const params = {
      cntx_id: this.sess2
    };
    this.apiService.chiamataPost(this.Utils2, 'geo_symbolic__sel', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        Utilities.checkRitornoChiamata(this.Utils2, data2);

        if (this.debug === true) {
          // logConsole('Barra: Impostazioni', data2);
        }
        data2.forEach(element => {
          const name = element.name ? element.name.toString().toUpperCase() : element.NAME.toString().toUpperCase();
          // // logConsole(name);
          switch (name) {
            case 'SYS_PRODUCT_PAGE':
              this.linkProduct = element.value ? element.value : element.VALUE;
              if (this.linkProduct) {
                this.toolTipPP = 'Product page';
              }
              if (this.debug === true) {
                // logConsole('Barra: Impostazione Link Product', this.linkProduct);
              }
              break;
            /* case 'STRING_TO_COMMAND':
              this.visualizzaMicrofono = element.value ? element.value : element.VALUE;
              if (this.debug === true) {
                // logConsole('Barra: Impostazione String to Command', this.visualizzaMicrofono);
              }
              break; */
            case 'SYS_CUSTOMER_PAGE':
              this.linkCustomer = element.value ? element.value : element.VALUE;
              if (this.linkCustomer) {
                this.toolTipCP = 'Customer page';
              }
              if (this.debug === true) {
                // logConsole('Barra: Impostazione Customer Page', this.linkCustomer);
              }
              break;
          }
        });

        if (this.debug === true) {
          // logConsole('Barra: Product page', this.linkProduct);
          // logConsole('Barra: Customer page', this.linkCustomer);
          // logConsole('Barra: Microfono', this.visualizzaMicrofono);
        }

        this.LeggeSimbolici();
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.accendeTimer();
        }, 1000);
      }
    }, error =>  {
      // Utilities.messaggioDiErroreEsterno(this, 'Login:' + error);
      // TODO alert error
    });
    this.LeggeImpostazioni2();
  }

  accendeTimer() {
    // Evita timer duplicati se la funzione viene richiamata
    if (this.itr) {
      clearInterval(this.itr);
    }
    this.itr = setInterval(() => {
      if (this.debug === true) {
        // logConsole('Barra: Leggo simbolici', new Date());
      }
      this.LeggeSimbolici();
    }, 60000);
  }

  LeggeSimbolici() {
    const params = {
      v_cntx: this.sessioneID
    }
    this.apiService.chiamataPost(this.Utils2, 'system_ping__grid', params)
    .pipe(takeUntil(this.destroy$))
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      if (data2 && data2 !== null && !data2.error) {
        Utilities.checkRitornoChiamata(this.Utils2, data2);

        this.errore = '';
        this.coloreSfondo = 'white';

        if (this.debug === true) {
          // logConsole('Barra: simbolici', data2);
        }
        // const data = JSON.parse(data2);
        // // logConsole(data2); //  and name = \'GEO_R_MAP_MAX_MEASR\'

        data2.DataTable.forEach(element => {
          const name = element.NAME;
          switch (name) {
            case 'SYS_MAINTENANCE_STATUS':
              // // logConsole(this.statoManutenzione);
              this.statoManutenzione = element.VALUE;
              this.statoManutenzioneEmit.emit(element.VALUE);
              break;
            case 'server time':
              const oraServer = new Date(element.VALUE).getTime();
              const oraLocale = new Date().getTime();

              this.dataOraServer = element.VALUE;
              this.dataOraServerEmit.emit(element.VALUE);

              if (this.debug === true) {
                // logConsole('Ora server', element.VALUE, oraServer);
                // logConsole('Ora PC', new Date(), oraLocale);
                // logConsole('Differenza:', oraLocale - oraServer);
              }
              break;
            case 'SYS_LOGIN_MSG':
              this.messaggioLogin = element.VALUE;
              this.statoServerEmit.emit(element.VALUE);
              break;
            case 'cntx_is_valid':
              if (+element.VALUE === 0) {
                // alert(this.Utils.userRedirect);
                // alert(this.Utils.urlRoot);
                if (this.Utils.userRedirect === 'default') {
                  localStorage.setItem('ERROR', 'CNTX_INVALID');
                  window.location.href = this.Utils.urlRoot + 'login/?err=cntx_invalid';
                } else {
                  location.assign(this.Utils.userRedirect);
                }
              }
              break;
          }
        });

        // this.statoManutenzione = 'LOGIN_RESTRICTED';

        switch (this.statoManutenzione) {
          case 'LOGIN_WARNING':
            this.coloreSfondo = '#faeea2';
            break;
          case 'LOGIN_RESTRICTED':
            this.coloreSfondo = '#faa2a2';
            break;
          case 'LOGIN_OK':
            this.coloreSfondo = 'white';
            break;
        }
        this.coloreSfondoEmit.emit(this.coloreSfondo);

        if (this.debug === true) {
          // logConsole('Stato manutenzione', this.statoManutenzione);
          // logConsole('Messaggio Login', this.messaggioLogin);
          // logConsole('Colore sfondo', this.coloreSfondo);
        }
      } else {
        // alert('Read symbolic null');
        this.coloreSfondo = '#faa2a2';

        this.errore = data2.message;
        // this.chiudeErrore();
      }
    }, error => {
      this.coloreSfondo = '#faa2a2';
      // alert('Read symbolic: ' + error);
      this.errore = 'No access to the platform';
      this.chiudeErrore();
    });
  }

  chiudeErrore() {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.errore = '';
    }, 5000);
  }

  apreSolutions() {
    // https://www.aubay.it/our-offer-2/aubay-solutions/"
    // const url2 = this.sanitizer.bypassSecurityTrustUrl('https://www.aubay.it/our-offer-2/aubay-solutions/') as string;
    // // logConsole(url2);
    const ww = window.open('https://www.aubay.it/our-offer-2/aubay-solutions/', '_blank');
  }

  apreProduct() {
    if (this.linkProduct) {
      const ww = window.open(this.linkProduct, '_blank');
    }
  }

  apreCustomer() {
    if (this.linkCustomer) {
      const ww = window.open(this.linkCustomer, '_blank');
    }
  }

  checkImage(e): void {
    // // logConsole(this.Utils.linkIcone + '/icons/Empty.png?a=' + new Date().toString());
    e.srcElement.src = this.Utils.linkIcone + '/icons/Empty.png?a=' + new Date().toString();
    this.cdRef.detectChanges();
  }

  esegueTestoVocale() {
    // alert(this.testoVocale);
    const comando = this.testoVocale;

    const params = {
      v_cntx: this.sess2,
      v_str_command: '\'' + comando + '\''
    };
    this.apiService.chiamataPost(this.Utils2, 'string_to_command', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        Utilities.checkRitornoChiamata(this.Utils2, data2);

        if (this.debug === true) {
          // logConsole('Barra superiore. Ritorno: ', data2);
        }
        if (+data2.err_code === 0) {
          this.comandiVocali.esegueComandoVocale(this, data2);
          this.comandoVocaleEmit.emit(data2);
        } else {
          console.error(data2.err_code + ': ' + data2.failure_reason);
          this.testoVocale = '';
        }
      }
    }, error =>  {
      // Utilities.messaggioDiErroreEsterno(this, 'Login:' + error);
      // TODO alert error
    });
  }

  onFocus() {
    this.campoTestoInFocus = true;
  }
}

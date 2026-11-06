import { logConsole } from './console-log';
import { environment } from './../environments/environment';
import { SessionService } from './services/session.service';
import { CustomValidators } from './menu/uc/validators/password-confirm.validator';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'menu';
  ipInfo;
  errMsg = '';
  changePassword = false;
  changePswForm: FormGroup;
  menuVisibile = true;
  modalitaDebug = !environment.production;
  chiudiVoci = false;

  linkIcone;
  serverPostRest;
  urlRoot;
  sessionID;
  comandoVocale = '';

  // Utils = Utils;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private sessionService: SessionService,
  ) {
    /* this.getJSON().subscribe(data => {
      const b = JSON.parse(data._body);
      // // logConsole(b.Proxy.toUpperCase());
      this.linkIcone = b.linkIcone;
      this.serverPostRest = b.serverPostRest;
      this.urlRoot = b.urlRoot;
      // logConsole('Letto connection.json', this.serverPostRest);

      // this.login('Luigi.Pecce', 'latitude', false);
      this.login('Luigi.Pecce', 'latitude', true);
    }); */
  }

  ngOnInit() {
  }

  /* public getJSON(): Observable<any> {
    // // logConsole(window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && window.location.port === '4200') {
      indirizzo = 'http://localhost:2727/assets/connection.json';
    } else {
      indirizzo = window.location.origin + '/assets/connection.json';
    }
    // logConsole(indirizzo);
    return this.http.get(indirizzo);
  } */

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

  lettoJSON(e) {
    // logConsole('JSON letto dal menù:' , e);
    if (e) {
      /* const b = e;
      this.linkIcone = b.linkIcone;
      this.serverPostRest = b.serverPostRest;
      this.urlRoot = b.urlRoot; */
      // logConsole('Letto connection.json', b);

      const b = e; // JSON.parse(data._body);
      
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

      this.urlRoot = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.urlRoot, true);
      this.linkIcone  = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
      // this.linkIcone = this.aggiungeIndirizzoAPathRelativo(indirizzoCaricato, b.linkIcone, true);
      let urlRootSenzaBarraFinale = urlRoot;
      if (urlRootSenzaBarraFinale.endsWith('/') && b.serverPostRest.startsWith(':')) {
        urlRootSenzaBarraFinale = urlRootSenzaBarraFinale.substring(0, urlRootSenzaBarraFinale.length - 1);
      }
      this.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRootSenzaBarraFinale, b.serverPostRest, true);

      logConsole('Indirizzo di base 1 menù: ', indirizzoCaricato);
      logConsole('Indirizzo di base 2 menù: ', urlRoot);
      logConsole('Indirizzo urlRoot menù: ', this.urlRoot);
      logConsole('Indirizzo Icone menù: ', this.linkIcone);
      logConsole('Indirizzo PostGrest menù: ', this.serverPostRest);
      // Nuova gestione della mail del 28/04/2026 13:16

    // this.login('Luigi.Pecce', 'latitude', false);
      this.login('Federico.Travaglini.RfiAnalyst', 'cerioni', true);
    }
  }

  login(username, password, rememberme) {
    const params = {
      v_name: username,
      v_password: password,
      v_client_public_ip: '1.1.1.1',
      v_city: 'Rome',
      v_client_country: 'IT',
      v_org: 'IT'
    };
    // // logConsole('operator__login', params);
    this.apiService.chiamataPost2(this.serverPostRest, 'operator__login', params)
    // .map(response => response)
    .subscribe(data => {
      // const data = JSON.parse(data2);
      // // logConsole(data);
      if (data.err_code !== 0) {
        const rr = data.failure_reason;
        this.errMsg = rr;
        if (this.errMsg.toUpperCase().indexOf('CHANGE A PASSWORD') > -1) {
          this.changePswForm = this.fb.group({
            oldPassword: ['', [Validators.required , Validators.minLength(3)]],
            newPassword1: ['', [Validators.required , Validators.minLength(3)]],
            newPassword2: ['', [Validators.required , Validators.minLength(3)]]
          }, {validator: Validators.compose([CustomValidators.passwordConfirm , CustomValidators.passwordMatch])});

          // this.user = data.OBJECT[0].object. username;
          // this.sessionId = data.OBJECT[0].object. sessionId;
          this.changePassword = true;
        }
      } else {
        this.sessionService.setRemember(true);
        this.sessionService.setUser(username);
        this.sessionService.setToken(data.cntx_id);
        this.sessionService.setLogged(true);

        this.sessionID = data.cntx_id;
        // logConsole('Sessione', this.sessionID);
      }
    }, error => {
      this.errMsg = error;
      // alert(error);
    });
  }

  apriDrawer() { this.menuVisibile = true; }
  chiudeDrawer(e) { this.menuVisibile = false; }

  esegueComandoVocale() {
    const comando = 'apri change password';

    const params = {
      v_cntx: this.sessionID,
      v_str_command: '\'' + comando + '\''
    };
    this.apiService.chiamataPost( 'string_to_command', params, this.serverPostRest)
    // .map(response => response.json())
    .subscribe(data2 => {
      if (data2 && data2 !== null) {
        // logConsole('Menù. Ritorno comando vocale: ', data2);

        if (+data2.err_code === 0) {
          this.comandoVocale = data2;
        } else {
          alert(data2.err_code + ': ' + data2.failure_reason);
        }
      }
    }, error =>  {
      // Utilities.messaggioDiErroreEsterno(this, 'Login:' + error);
      // TODO alert error
    });
  }

  preseWS(e) {
    // logConsole(e);
  }
}

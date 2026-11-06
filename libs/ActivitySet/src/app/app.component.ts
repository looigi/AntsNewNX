import { logConsole } from './console-log';
import { environment } from './environments/environment';
import { Component, OnInit } from '@angular/core';
import { Utils } from './Utilities.component';
import { Observable } from 'rxjs';
import { ExternalHttpClient } from './services/httpclient.service';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './services/api.service';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'activitySet';

  sessId;
  gname;
  uname;
  collegatoDaUrl = false;

  userName;
  righeSelezionatePerActSet;
  sessionID2;
  righePerPaginazioneAutomatica = -1;
  indirizzoServer2;

  constructor(
    private http: ExternalHttpClient,
    private sessionService: SessionService,
    private apiService: ApiService,
    public Utils: Utils
  ) {
    this.getJSON().subscribe(data => {
      /* const b = data;

      this.Utils.indirizzoServer = b.serverPostRest;
      // alert(this.Utils.indirizzoServer);
      this.Utils.indirizzoGEOServer = b.serverGEOServer;
      if (b.eventsDisplayedRows)  {
        this.Utils.limitPerVirtual = b.eventsDisplayedRows;
      } else {
        this.Utils.limitPerVirtual = 60;
      }

      this.Utils.linkIcone = b.linkIcone;
      this.Utils.serverPostRest = b.serverPostRest;
      if (b.Proxy.toUpperCase() === 'TRUE') {
        this.Utils.facadeServerAddress = b.facadeServerAddressViaProxy;
      } else {
        this.Utils.facadeServerAddress = b.facadeServerAddressLocale;
      }
      this.Utils.urlRoot = b.urlRoot; */

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
      // this.linkIcone = this.aggiungeIndirizzoAPathRelativo(indirizzoCaricato, b.linkIcone, true);
      let urlRootSenzaBarraFinale = urlRoot;
      if (urlRootSenzaBarraFinale.endsWith('/') && b.serverPostRest.startsWith(':')) {
        urlRootSenzaBarraFinale = urlRootSenzaBarraFinale.substring(0, urlRootSenzaBarraFinale.length - 1);
      }
      this.Utils.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRootSenzaBarraFinale, b.serverPostRest, true);
      if (b.eventsDisplayedRows)  {
        this.Utils.limitPerVirtual = b.eventsDisplayedRows;
      } else {
        this.Utils.limitPerVirtual = 60;
      }
      this.Utils.indirizzoServer = this.Utils.serverPostRest;

      logConsole('Indirizzo di base 1 ActivitSet: ', indirizzoCaricato);
      logConsole('Indirizzo di base 2 ActivitSet: ', urlRoot);
      logConsole('Indirizzo urlRoot ActivitSet: ', this.Utils.urlRoot);
      logConsole('Indirizzo Icone ActivitSet: ', this.Utils.linkIcone);
      logConsole('Indirizzo PostGrest ActivitSet: ', this.Utils.serverPostRest);
      // Nuova gestione della mail del 28/04/2026 13:16

      this.eseguiConnessione();
    });
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

  ngOnInit() {
  }

  getJSON(): Observable<any> {
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }

    return this.http.get(Utils, indirizzo);
  }

  eseguiConnessione() {
    this.collegatoDaUrl = true;

    let pwd = '';
    const p = localStorage.getItem('H7-25-AS');
    if (p !== null) {
      pwd = p;
    } else {
      pwd = prompt("H7-25-AS", "");
      if (pwd === '') {
        alert('No!');
        return;
      }  else  {
        localStorage.setItem('H7-25-AS', pwd);
      }
    }

    this.EffettuaLogin(environment.nomeLogin, pwd);
  }
  
  EffettuaLogin(userName, password) {
    const params = {
      v_city: 'Milan',
      v_client_country: 'ITA',
      v_client_public_ip: '185.142.153.241',
      v_name: userName,
      v_org: 'SUPERNAP Italia S.r.l.',
      v_password: password
    };
    // alert(this.Utils.indirizzoServer + '/operator__login');
    this.apiService.chiamataPost(this.Utils.indirizzoServer, 'operator__login', params)
    // .map(response => response)
    .subscribe(data => {
      if (data) {
        if (data.v_err_code && data.v_err_code === 2) {
          alert(data.v_failure_reason);
        } else {
          const rr = data.err_code;

          if (rr === 0) {
            this.userName = userName;
            this.sessionID2 = data.cntx_id;
            this.loginOK(data, data.cntx_id, '');
          } else {
            alert('Connection error:' + data.v_failure_reason);
          }
        }
      } else {
      }
    }, error =>  {
      alert('Login:' + error);
    });
  }

  loginOK(dd, sessionId, groupName) {
    this.sessionService.setRemember(true);
    this.sessionService.setUser(dd);
    this.sessionService.setToken(sessionId);
    this.sessionService.setLogged(true);

    if (!this.userName || this.userName === '') {
      this.userName = 'DebugUser';
    }

    this.indirizzoServer2 = this.Utils.serverPostRest;
    logConsole('Dati', this.Utils, this.sessionID2, this.indirizzoServer2);
  }

  visibile = true;

  visibileDaMascheraActivity(e) {
    logConsole('Visibile', e);
    this.visibile = false;
  }

  confermaActivity(e) {
    logConsole('Conferma', e);
  }

  refreshActivity(e) {
    logConsole('refresh', e);
  }
}

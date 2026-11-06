import { logConsole } from './console-log';
import { ApiService } from './barrasuperiore/api.service';
import { environment } from './../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ExternalHttpClient } from './barrasuperiore/httpclient.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'barrasuperiore';
  sessione = '';
  microfonoAttivo = true;
  userName = 'Luigi.Pecce';
  groupName = 'SVIL';
  fullScreen = false;
  urlRoot = '';

  Utils = {
    serverPostRest: '',
    linkIcone: '',
    serverGEOServer: '',
    urlRoot: '',
    userRedirect: 'default'
  };
  platformName = 'Scritta di Test';
  dataOraServer = '14:27';

  constructor(
    private apiService: ApiService,
    private http: ExternalHttpClient,
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
    logConsole('Indirizzo connection json', indirizzo);
    return this.http.get(null, indirizzo);
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

    logConsole('Indirizzo di base 1: ', indirizzoCaricato);
    logConsole('Indirizzo di base 2: ', urlRoot);
    this.Utils.urlRoot = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.urlRoot, true);
    this.Utils.linkIcone  = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
    let urlRootSenzaBarraFinale = urlRoot;
    if (urlRootSenzaBarraFinale.endsWith('/') && b.serverPostRest.startsWith(':')) {
      urlRootSenzaBarraFinale = urlRootSenzaBarraFinale.substring(0, urlRootSenzaBarraFinale.length - 1);
    }
    this.Utils.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRootSenzaBarraFinale, b.serverPostRest, true);
    // Utils.indirizzoGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot,  b.serverGEOServer, true);
    // Utils.serverGEOServer = this.aggiungeIndirizzoAPathRelativo(urlRoot,  b.serverGEOServer, true);
    logConsole('Indirizzo urlRoot: ', this.Utils.urlRoot);
    logConsole('Indirizzo Icone: ', this.Utils.linkIcone);
    logConsole('Indirizzo PostGrest: ', this.Utils.serverPostRest);
    // logConsole('Indirizzo GeoServer: ', Utils.serverGEOServer);
    // Nuova gestione della mail del 28/04/2026 13:16

    this.loginna();
  }

  loginna() {
    const params = {
      v_city: 'Milan',
      v_client_country: 'ITA',
      v_client_public_ip: '185.142.153.241',
      v_name: this.userName,
      v_org: 'SUPERNAP Italia S.r.l.',
      v_password: 'looigi227'
    };
    // // logConsole('geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost(this.Utils, 'operator__login', params)
    // .map(response => response.json())
    .subscribe(data => {
        if (data) {
          this.checkRitornoChiamata(data);

          this.sessione = data.cntx_id;

          data.platform_info.forEach(element => {
            switch(element.name) {
              case 'string_to_command':
                const valore = element.value ? element.value : element.VALUE;
                this.microfonoAttivo = (valore === 'Y' ? true : false);
                // logConsole('Microfono attivo:', element, this.microfonoAttivo);
                break;
            }
          });

          // logConsole('Sessione', data);
        } else {
          // logConsole('Nessun dato ritornato dal login:', data);
        }
    }, error =>  {
      // ExternalUtilities.messaggioDiErroreEsterno(this, 'Login:' + error);
      // TODO alert error
    });
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
              alert (d.failure_reason);
            }
          }
        }
      }
    }
  }

  apreMenu() {
    // logConsole('Aperto menù');
  }

  apreMenu2() {
    // logConsole('Aperto menù 2');
  }

  arrivatoComandoVocale(e) {
    // logConsole('Comando vocale:', e);
  }

  fApreChiudeInfoGPS(e) {
    // logConsole('Apertura chiusura info gps', e);
  }

  arrivataDataOraServer(e) {
    logConsole('Arrivata data ora server', e);
  }
}

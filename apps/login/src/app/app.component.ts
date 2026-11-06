import { logConsole } from './console-log';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import Utils from './Utilities.component';
import { ApiService } from './services/api.service';
import { ExternalHttpClient } from './services/httpclient.service';
import { catchError, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {throwError as observableThrowError} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public portable = false;
  destroy$;
  pre;
  
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

  constructor(
    private http: ExternalHttpClient,
    private http2: HttpClient,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.destroy$ = new Subject<void>();

    // this.getJSON2('assets/preprod.json').pipe(takeUntil(this.destroy$)).subscribe(data2 => {
      // this.pre = data2.pre;
      this.getJSON().subscribe(data => {
        // // logConsole(data);

        /* const b = data; // JSON.parse(data);
        // // logConsole(b.Proxy.toUpperCase());
        Utils.linkIcone = b.linkIcone;
        Utils.serverPostRest = b.serverPostRest;
        /* if (b.Proxy.toUpperCase() === 'TRUE') {
          Utils.facadeServerAddress = b.facadeServerAddressViaProxy;
        } else {
          Utils.facadeServerAddress = b.facadeServerAddressLocale;
        }
        this.apiService.setUrl(Utils.facadeServerAddress); * /
        Utils.urlRoot = b.urlRoot;
        if (b.portable !== undefined) {
          this.portable = true;
          // logConsole('PORTABLE:', b, b.portable);
          // alert('1' + Utils.portable);
        }
        // logConsole('Connection json:', b, this.pre); */
        
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
        Utils.urlRoot = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.urlRoot, true);
        Utils.linkIcone  = this.aggiungeIndirizzoAPathRelativo(urlRoot, b.linkIcone, true);
        let urlRootSenzaBarraFinale = urlRoot;
        if (urlRootSenzaBarraFinale.endsWith('/') && b.serverPostRest.startsWith(':')) {
          urlRootSenzaBarraFinale = urlRootSenzaBarraFinale.substring(0, urlRootSenzaBarraFinale.length - 1);
        }
        Utils.serverPostRest = this.aggiungeIndirizzoAPathRelativo(urlRootSenzaBarraFinale, b.serverPostRest, true);
        logConsole('Indirizzo urlRoot: ', Utils.urlRoot);
        logConsole('Indirizzo Icone: ', Utils.linkIcone);
        logConsole('Indirizzo PostGrest: ', Utils.serverPostRest);

        if (b.portable !== undefined) {
          this.portable = true;
          // logConsole('PORTABLE:', b, b.portable);
          // alert('1' + Utils.portable);
        }
        // Nuova gestione della mail del 28/04/2026 13:16


        this.activatedRoute.queryParams.subscribe(params => {
          // // logConsole(params);
          Utils.errMsg = '';
          if (params['err']) {
            if (params['err'] === 'cntx_invalid') {
              Utils.errMsg = 'Connection lost for inactivity or other reasons: you need to login again';
            } else {
              Utils.errMsg = params['err'];
            }
          } else {
            /* this.TcRunId = params['tcrunid'];
            this.AutoLoginKey = params['key'];
            if (this.TcRunId !== undefined &&
              this.AutoLoginKey !== undefined) {
              this.login('WebDetailedInfo', '124389', false);
              // this.login('Luigi.Pecce', 'latitude', false);
            } */

          }
        });
      });
    // });
  }

  /* getJSON2(ind): Observable<any> {
    // alert('getJSON: ' + this.infoSistema.ceCordova);
    let indirizzo = ind; // '';

    return this.http2.get(indirizzo).pipe(catchError(this.catchAuthError()));
  } */


  catchAuthError() {
    return (res: Response) => {
      if (res.status === 404) {

      }

      return observableThrowError(res);
    };
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
}

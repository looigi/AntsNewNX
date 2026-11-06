import { OnInit, Component, Input, SecurityContext, Output, EventEmitter, ViewChild, OnChanges, ElementRef, AfterViewInit, TemplateRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
// import 'rxjs/add/operator/map';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {Observable, throwError as observableThrowError, Subject} from 'rxjs';
// import 'rxjs/add/operator/catch'

import * as Config from './config.js';
import { catchError, takeUntil } from 'rxjs/operators';

declare let AdvancedGeolocation: any;

@Component({
  selector: 'app-moduloapk',
  templateUrl: 'moduloapk.component.html',
  styleUrls: [ 'moduloapk.style.css' ],
  encapsulation: ViewEncapsulation.None
})

export class ModuloAPKComponent implements  OnInit, OnChanges {
  @Input() visualizzaMaschera = false;
  @Input() debug = false;

  @Output() connectionJSONEmit: EventEmitter<any> = new EventEmitter<any>();

  urletto = '';  
  destroy$;

  connJSON;

  constructor(
    private http: HttpClient
  ) {
    this.destroy$ = new Subject<void>();
  }

  ngOnDestroy(): void {
    // Chiude le sottoscrizioni con takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.leggeJSON();
  }

  ngOnChanges(c) {

  }

  getJSON(ind): Observable<any> {
    // alert('getJSON: ' + this.infoSistema.ceCordova);
    let indirizzo = ind; // '';

    return this.http.get(indirizzo).pipe(catchError(this.catchAuthError()));
  }

  catchAuthError() {
    return (res: Response) => {
      this.scriveLog('ERRORE: ', res['message']);

      if (res.status === 404) {

      }

      return observableThrowError(res);
    };
  }

  /* leggeJSON() {
    this.getJSON('assets/preprod.json').pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.leggeJSON2(data['pre']);
    });
  } */

  leggeJSON() {
    // alert(environment.ProvaAngular);

    let indirizzo = '';

    // if (this.device !== 'ANDROID') {
      /* if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
        indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
      } else { */
    let u = window.location.href;
    if (this.debug === true) {
      this.scriveLog('Indirizzo reale', u);
    }
    /* if (u.indexOf('antsk8sttest') > -1) {
      u = 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/login/login/';
    } else {
      if (u.indexOf('localhost') > -1) {
        u = 'http://localhost:2727/login/';
      } else {
        if (u.indexOf('geoantsanalyser-1341703549.eu-south-1.elb.amazonaws.com/geoantsweb/') > -1) {
          u = 'https://geoantsanalyser-1341703549.eu-south-1.elb.amazonaws.com/geoantsweb/login';
        } else {
          u = 'https://geoants.aubay.it/geoantsweb/login';
        }
      }
    } */
    if (u.indexOf('localhost') > -1) {
      u = 'http://localhost:2727/login/';
    }
          
    if (u.indexOf('?') > -1) {
      u = u.substring(0, u.indexOf('?'));
    }
    u = u.replace('login/login', 'login');

    if (this.debug === true) {
      this.scriveLog('Indirizzo convertito', u);
    }

    // this.scriveLog(u);
    const prima = u.substring(0, 8);
    let seconda = u.substring(8, u .length);
    while (seconda.indexOf('//') > -1) {
      seconda = seconda.replace('//', '/');
    }
    u = prima + seconda;
    // this.scriveLog(u);
    // this.scriveLog(u.substring(u.length - 1, u.length));
    if (u.substring(u.length - 1, u.length) === '/') {
      u = u.substring(0, u.length - 1);
    }
    // this.scriveLog(u);
    let q = 0;
    for (let i = 0; i<u.length; i++) {
      if (u.substring(i, i + 1) === '/') {
        q++;
      }
    }
    if (q > 2) {
      // this.scriveLog(u, prima, seconda);
      for (let i = u.length; i>0; i--) {
        if (u.substring(i, i + 1) === '/')  {
          u = u.substring(0, i);
          i = 0;
        }
      }
    }
    
    /* let cosa = 'geoantsweb';

    switch(pre) {
      case "true":
        cosa = 'geoantsweb_pre';
        break;
      case "false":
        cosa = 'geoantsweb_prod';
        break;
      default:
        break;
    }

    if (u.indexOf('geoantsweb') > -1 && u.indexOf(cosa) === -1) {
      u = u.replace('geoantsweb', cosa);
    }
    u = u.replace('_pre_pre', '_pre');
    u = u.replace('_prod_prod', '_prod'); */

    if (this.debug === true) {
      this.scriveLog('Indirizzo lettura connection.json', u  + '/assets/connection.json');
    }
    indirizzo = u + '/assets/connection.json?d=' + new Date();

  // }
    /*} else {
      indirizzo = 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/assets/connection.json?d=' + new Date();
    } */
    this.urletto = indirizzo;
    // alert(indirizzo)
    if (this.debug === true) {
      this.scriveLog('JSON indirizzo: ', indirizzo);
    }

      // this.getJSONAndroid(indirizzo);
    // } /* else { */
    this.getJSON(indirizzo).pipe(takeUntil(this.destroy$)).subscribe(data => {
      let d;
      if (data._body) {
        d = JSON.parse(data._body);
      } else {
        d = data;
      }
      // d['pre'] = pre;
      // console.log('ModuloAPK - connection.json letto:', d);

      this.lettoJSON(d);
    });
    // }
  }

  lettoJSON(d) {
    if (d) {
      this.connJSON = JSON.stringify(d);
      this.connectionJSONEmit.emit(d);
    }
  }

  scriveLog(Cosa, P1?, P2?, P3?, P4?, P5?) {
    if (this.debug === true) {
      if (P1 && P2 && P3 && P4 && P5) {
        // console.log('MODULO APK: ' + Cosa, P1, P2, P3, P4, P5);
      } else {
        if (P1 && P2 && P3 && P4 && !P5) {
          // console.log('MODULO APK: ' + Cosa, P1, P2, P3, P4);
        } else {
          if (P1 && P2 && P3 && !P4 && !P5) {
            // console.log('MODULO APK: ' + Cosa, P1, P2, P3);
          } else {
            if (P1 && P2 && !P3 && !P4 && !P5) {
              // console.log('MODULO APK: ' + Cosa, P1, P2,);
            } else {
              if (P1 && !P2 && !P3 && !P4 && !P5) {
                // console.log('MODULO APK: ' + Cosa, P1);
              } else {
                // console.log('MODULO APK: ' + Cosa);
              }  
            }
          }
        }
      }
    }
  }  
}

import { logConsole } from './console-log';
import { Component, OnDestroy, OnInit } from '@angular/core';
import Utils from './Utilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ExternalApiService } from './spreadsheet/servizi/externalapi.service';

@Component({
    standalone: false,
    selector: 'app-root',
    templateUrl: 'app.html',    
})

export class AppComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  public data: any[] = [] /* 
    {
        name: 'Food Order',
        rows: [
          {cells: [ {value: 'ID'}, {value: 'Pizzas'} ]},
          {cells: [ {value: 216321}, {value: 'Calzone'} ]},
          {cells: [ {value: 216322}, {value: 'Margarita'} ]},
        ]
    },
  ]; */

  // Esempio chiamata:
  // http://localhost:4200/?Par=eyJDb250ZXh0IjoiMzI1Y2I3MzJjNDQ0NDZlY2U1MmY3NTM3MTMxMjc4ODIiLCJRdWVyeSI6InJwYy9taXN0cmFsX3JiY2l4bF9tZXNzYWdlX19ncmlkIiwiUGFyYW1zIjoie1widl9jbnR4X2lkXCI6XCIzMjVjYjczMmM0NDQ0NmVjZTUyZjc1MzcxMzEyNzg4MlwiLFwidl9hY3Rfc2V0X25hbWVfbGlzdFwiOlwiW0FHTl0gUG1SYmNJeGwwNTEuMTBcIixcInZfdG1zX3plcm9cIjpudWxsLFwidl90ZXh0X2ZpbHRlclwiOm51bGwsXCJ2X3Rtc19jdXJyZW50XCI6bnVsbCxcInZfZmlsdGVyXCI6XCJ7XFxcInJvdXRlXFxcIjpcXFwiXFxcIixcXFwibGluZVxcXCI6W10sXFxcImZyb21cXFwiOltdLFxcXCJ0b1xcXCI6W10sXFxcImRlc2NcXFwiOltdLFxcXCJwYXJhbVxcXCI6W10sXFxcInZhbHVlXFxcIjpbXSxcXFwiaWRuYW1lXFxcIjpbXSxcXFwiZnJvbV90bXNcXFwiOlxcXCIyMDI2LTAyLTIwIDA1OjEyOjAwLjAwMFxcXCIsXFxcInRvX3Rtc1xcXCI6XFxcIjIwMjYtMDItMjMgMTE6MzM6MzEuMDAwXFxcIn1cIixcInZfc3RhbmRfYWxvbmVcIjpcIllcIixcInZfbGltaXRcIjo1MDAsXCJ2X2NhbGxlcl90YWdcIjpcIkYxO1A0O1dlZCBGZWIgMjUgMjAyNiAwNzo1ODoyMiBHTVQrMDEwMCAoT3JhIHN0YW5kYXJkIGRlbGzigJlFdXJvcGEgY2VudHJhbGUpXCJ9IiwiVXJsU2VydmVyIjoiaHR0cHM6Ly9hbnRzZ3JhY2xpZW50LmFudHMtYXViYXkuaXQvZ2Rwc29uZGFtaXN0cmFsL3JwYyJ9

  cntx_id;
  Query;
  Params;
  urlServer;

  constructor(
    private apiService: ExternalApiService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['Par']) {
        const parametri = params['Par'];
        if (parametri) {
          const p = Utils.decripta(parametri);
          const parDecript = JSON.parse(p);
          logConsole('Parametri arrivati', parDecript);
          if (parDecript.Context) {
            this.cntx_id = parDecript.Context;
          } else {
            logConsole('Cntx non valido');
            return;
          }
          if (parDecript.Query) {
            this.Query = parDecript.Query;
          } else {
            logConsole('Query non valida');
            return;
          }
          if (parDecript.Params) {
            this.Params = parDecript.Params;
          } else {
            logConsole('Params non validi');
            return;
          }
          if (parDecript.UrlServer) {
            this.urlServer = parDecript.UrlServer;
          } else {
            logConsole('UrlServer non valido');
            return;
          }

          this.esegueQuery();
        }
      } else {
        logConsole('Nessun parametro ricevuto');
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$ = undefined;
    this.destroy$.next();
    this.destroy$.complete();
  }

  esegueQuery() {
    const indirizzo = this.urlServer + '/' + this.Query;
    // logConsole('Indirizzo', indirizzo);
    // logConsole('Parametri', this.Params);
    this.apiService.chiamataPost(indirizzo, this.Params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data2 => {
      // // logConsole(data, this.NumeroFrame);
      if (data2 && data2 !== null && data2.DataTable) {
        const datiConvertiti = this.converteDataTable(data2.DataTable);
        logConsole('Dati letti: ', datiConvertiti);
        this.data = datiConvertiti;
      } else {
        logConsole('Nessun dato ricevuto', data2);
      }
    }, error => {
      // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
      console.error('POST ERROR ' + this.Query + ': ', error, error.message);
    });
  }

  converteDataTable(dati) {
    if (!dati) {
      return [];
    } else {
      let stringify = '[{ "name": "' + this.Query.replace('rpc/', '') + '", "rows": [ '; 

      let titolo = false;

      dati.forEach(element => {
        if (!titolo) {
          titolo = true;

          const valori = Object.keys(element);
          let campi = ' ';
          valori.forEach(element2 => {
            campi += '{ "value": "' + element2 + '" },';
          });
          campi = campi.substring(0, campi.length - 1);

          stringify += '{ "cells": [' + 
            campi + 
          ']},';
        }

        const valori = Object.values(element);
        let campi = ' ';
        valori.forEach(element2 => {
          campi += '{ "value": "' + element2 + '" },';
        });
        campi = campi.substring(0, campi.length - 1);

        stringify += '{ "cells": [' + 
          campi + 
        ']},';
      });
      stringify = stringify.substring(0, stringify.length - 1);
      stringify += ']}]';

      return JSON.parse(stringify);
    }
  }

  arrivoDati(e: any) {
    logConsole('Dati arrivati: ', e);
  }
}
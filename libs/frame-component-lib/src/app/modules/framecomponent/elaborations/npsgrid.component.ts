import { Injectable } from "@angular/core";
// import { environment } from '../../../../environments/environment.prod';

import ExternalUtilities from '../ExternalUtilities.component';
import { ExternalApiService } from "../services/externalapi.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { FineRichieste } from './fine-richieste';
@Injectable()
export class NPSComponent {
  destroy$ = new FineRichieste();

  // lastCallTC = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  staDisegnandoNPS = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false, false, false];
  // appoTcRun = null;

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
    // private gestGrafici: GestioneGrafici
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.lastCallTC[t.NumeroFrame2] = '';
    t.datiNPS = 'empty grid';
    t.vecchiDatiNPS = undefined;
    this.staDisegnandoNPS[t.NumeroFrame2] = false;
  }

  caricaNPS(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'NP') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo NP', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Carica Tc Run Grid');
    /* const tt = new Date().getTime();
    if ((tt - this.ultimaFatta) <= 2500)  {
      return;
    }
    this.ultimaFatta = tt; */


    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }

    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'NP' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: esco da nps per frame non valido');
      }
      return;
    } */

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'carica Tc Run Grid');
    if (t.MappaOGrafico2 !== 'NP' || this.staDisegnandoNPS[t.NumeroFrame2] === true) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: esco da nps per frame non valido o già impegnato');
      }
      return;
    }

    /* const act_set = ExternalUtilitiTC.ritornaStringPerActivitySetEventSummary(t, t.Utils);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activity set eventi:', t.NumeroFrame, act_set);*/

    if (t.act_set !== undefined && t.act_set === '') {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '*' + act_set + '*');
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: esco da nps per act_set vuoto');
      }
      t.datiNPS = 'empty grid';
      return;
    }

    this.staDisegnandoNPS[t.NumeroFrame2] = true;

    // this.sceltaActivityDaSet
    // const id = act_set;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_set);

    // let tmsFilter = '';
    let sInizio = '';
    let sFine = '';
    let nomeActSet = t.act_set;

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: Time filter:', t.timeFilter);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: Nome Activity:', t.Utils.nomeActivitySelezionata);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: Eseguito in progetto', t.eseguitoInProgetto2);
    }

    if (t.timeFilter === 2) {
      if (!t.Utils.tmsSelezionato || t.Utils.tmsSelezionato === null || t.Utils.tmsSelezionato === '') {
        t.datiNPS = 'empty grid';
        t.vecchiDatiNPS = undefined;
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: esco da tcrun grid per tms selezionato vuoto');
        }
        this.staDisegnandoNPS[t.NumeroFrame2] = false;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NTCsun tms selezionato');
        return;
      }

      // const dInizio = ((new Date(t.Utils.tmsSelezionato).getTime()) - (t.Utils.rangeDiSecondiPerMille)) +
      //   (new Date().getTimezoneOffset() * 60000);
      sInizio = '"' + t.Utils.tmsInizio + '"'; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
      // const dFine = ((new Date(t.Utils.tmsSelezionato).getTime()) + (t.Utils.rangeDiSecondiPerMille)) +
      //   (new Date().getTimezoneOffset() * 60000);
      sFine = '"' + t.Utils.tmsFine + '"'; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
      // tmsFilter = '(tms >= \'' + sInizio + '\' and tms <= \'' + sFine + '\')';
    } else {
      if (t.eseguitoInProgetto2 === false) {
        if (t.timeFilter === 4) {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: Time filter activity');
          }
          nomeActSet = t.Utils.nomeActivitySelezionata;
          sInizio = null;
          sFine = null;
        } else {
          sInizio = '"' + t.timeRangeDSFStart2 + '"';
          sFine = '"' + t.timeRangeDSFStop2 + '"';
        }
      } else {
        sInizio = '"' + t.timeRangeDSFStart2 + '"';
        sFine = '"' + t.timeRangeDSFStop2 + '"';
      }
    }

    let eventi = '';

    let lista = null;
    let lep = null;
    /* if (t.tipoEvento2 === 'L') {
      if (!t.listaEventiDaPassare2) {
        t.listaEventiDaPassare2 = 'empty grid';
      }
      lista = t.listaEventiDaPassare2;
      lep = ExternalUtilitiTC.convertTCtringaInJSON(lista);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi locale', t.NumeroFrame2, t.listaEventiDaPassare2);
    } else {
      if (!t.listaEventiDaPassare2) {
        t.Utils.eventiSceltiTC2 = new Array();
      }
      lista = t.Utils.eventiSceltiTC2;
      lep = lista;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi globale', t.NumeroFrame2, lista);
    }
    if (!t.listaEventiDaPassare2) {
      t.listaEventiDaPassare2 = 'empty grid';
    }
    lista = t.listaEventiDaPassare2;
    lep = ExternalUtilities.converteStringaInJSON(lista);
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi locale', t.NumeroFrame2, t.listaEventiDaPassare2);
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per eventi:', lista, lep);
    if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep !== '"empty grid"' && lep.length > 0) {
      lep.forEach(element => {
        eventi += element.EVENT_TYPE + ',';
      });
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Folders / eventi:', folders, eventi);
    if (eventi.length > 0) {
      eventi = eventi.substring(0, eventi.length - 1);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, eventi);
    } else {
      if (t.tipoEvento2 === 'G') {
        eventi = 'NONE';
      } else {
        eventi = 'ALL';
      }
    }
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi finale: ', t.NumeroFrame2, eventi);
    } */

    /* t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.tipoEvento2);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, eventi);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lista);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lep);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_set);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, id);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, sInizio, sFine); */

    this.staDisegnandoNPS[t.NumeroFrame2] = false;

    if (lista === undefined || lista === 'undefined')  {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: esco da tcrun grid per lista eventi vuota');
      }
      // t.datiNPS = 'empty grid';
      this.staDisegnandoNPS[t.NumeroFrame2] = false;
      return;
    }

    if (nomeActSet === undefined || nomeActSet === 'undefined' || nomeActSet === '') {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: esco da tcrun grid per nomeactset vuoto');
      }
      // t.datiNPS = 'empty grid';
      this.staDisegnandoNPS[t.NumeroFrame2] = false;
      return; // sInizio = t.timeRangeDSFStart2;
    }

    if (sInizio === undefined || sInizio === 'undefined' || sInizio === '"undefined"') {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: esco da tcrun grid per data inizio vuota');
      }
      // t.datiNPS = 'empty grid';
      this.staDisegnandoNPS[t.NumeroFrame2] = false;
      return; // sInizio = t.timeRangeDSFStart2;
    }
    if (sFine === undefined || sFine === 'undefined' || sFine === '"undefined"') {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: esco da tcrun grid per data fine vuota');
      }
      // t.datiNPS = 'empty grid';
      this.staDisegnandoNPS[t.NumeroFrame2] = false;
      return; // sFine = t.timeRangeDSFStop2;
    }

    const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

    const params = '{' +
      '"cntx_id": "' + t.sessionID2 + '",' +
      '"v_act_set_name_list": "' + nomeActSet + '",' +
      // '"v_event_type_list": "' + eventi + '",' +
      '"v_tms_min": ' + sInizio + ',' +
      '"v_tms_max": ' + sFine + ',' +
      '"v_bbox": "' + geoFilter + '"' +
    '}';

    const propertyName = '';
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid', params);
    const actualCall = t.act_set + ';' + params + ';' + t.columnsSettings + ';' +
          propertyName;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, actualCall);
    // if (!t.Utils.lastCallTC) {
    //   t.Utils.lastCallTC = ExternalUtilitiTC.creaMatrice(environment.quantiSottoFramTC, environment.quantiFramTC, '');
    // }

    if (t.datiNPS && typeof(t.datiNPS) === 'string') {
      if (t.datiNPS.indexOf('ERROR: ') > -1) {
        t.datiNPS = undefined;
        t.lastCallTC[t.NumeroFrame2] = undefined;
      }
    }
    
    if (actualCall !== t.lastCallTC[t.NumeroFrame2]) {
      t.lastCallTC[t.NumeroFrame2] = actualCall;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: Parametri ', t.NumeroFrame, params);
      }

      t.caricamentoNPSInCorso[t.NumeroFrame2] = true;
      t.npsSelected = false;
      t.erroreNPS = '';

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'RefrTCh summary:', params);
      
      t.paramsPerSS[t.NumeroFrame2] = params;
      t.queryPerSS[t.NumeroFrame2] = 'geo_nps__grid';

      t.effettuaAutoFitTC = false;
      t.lastCallNP2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_nps__grid', params)
      // .map(rTCponse => rTCponse())
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        if (data2 && data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

          if (data2) {
            if (data2.v_grid_msg !== undefined) {
              t.messaggioWarningNPS = data2.v_grid_msg;
            } else {
              t.messaggioWarningNPS= '';
            }

            if (data2.message) {
              t.erroreNPS = 'ERROR: ' + data2.code + '-' + data2.message;
              this.staDisegnandoNPS[t.NumeroFrame2] = false;
              t.caricamentoEventSummaryInCorso = false;
              t.datiNPS = undefined;
            } else {
              if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
                t.gridTitleNPS = data2.GridProperty[0].GridName;
              }
              // this.appoTcRun = data2;
              // t.datiNPS = data2;

              /* if (t.datiNPS && t.datiNPS !== 'empty grid' && t.datiNPS.GridProperty) {
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Faccio refresh Dati griglia Tc Run Grid', data2.DataTable, data2.DataTable.length);
                }
                if (data2.DataTable.length > 0) {
                  t.datiNPS.DataTable = data2.DataTable;
                } else {
                  t.datiNPS = 'empty grid';
                }

                // t.impostaArraySelezioneTC();
                // t.impostaPaginaTC = 0;

                this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
                // Solo il frame corrente: assegnare false all'intero array lo trasformava in un booleano
                t.caricamentoNPSInCorso[t.NumeroFrame2] = false;
              } else {
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ricarico Dati griglia Tc Run Grid');
                } */
                t.vecchiDatiNPS = data2;

                t.datiNPS = undefined;
                const tm1 = setTimeout(() => {
                  clearTimeout(tm1);
                  t.datiNPS = data2;
                }, 500);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, dCS, dCD);

                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: Dati NPS:', data2);
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: Dati griglia NPS:', t.datiNPS);
                }

                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  // t.effettuaAutoFitTC = !t.effettuaAutoFitTC;
                  t.impostaPaginaTC = 0;

                  this.staDisegnandoNPS[t.NumeroFrame2] = false;
                  t.caricamentoNPSInCorso[t.NumeroFrame2] = false;
                }, 100);
              // }
            }
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: ritorno query non valido');
            }
            this.staDisegnandoNPS[t.NumeroFrame2] = false;
            t.caricamentoEventSummaryInCorso = false;
          }
        } else {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: ritorno query nullo');
          }
          this.staDisegnandoNPS[t.NumeroFrame2] = false;
          t.caricamentoNPSInCorso[t.NumeroFrame2] = false;
        }
      }, error => {
        this.staDisegnandoNPS[t.NumeroFrame2] = false;
        t.caricamentoNPSInCorso[t.NumeroFrame2] = false;
        t.lastCallTC[t.NumeroFrame2] = '';
        // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
        t.datiNPS = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NPS: skip per chiamata uguale alla precedente', t.NumeroFrame2, t.vecchiDatiNPS);
      }

      t.datiNPS = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiNPS = t.vecchiDatiNPS;
      }, 500);

      // t.datiNPS = JSON.parse(this.appoEventSummary);
      this.staDisegnandoNPS[t.NumeroFrame2] = false;
      // t.caricamentoEventSummaryInCorso = false;
    }
  }
}

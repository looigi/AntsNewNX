import { logConsole } from '../console-log';
import { Injectable } from "@angular/core";
// import { environment } from '../../../../environments/environment.prod';

import ExternalUtilities from '../ExternalUtilities.component';
import { ExternalApiService } from "../services/externalapi.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { FineRichieste } from './fine-richieste';
@Injectable()
export class TCRunGridComponent {
  destroy$ = new FineRichieste();

  // lastCallTC = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  // private destroy$ = new Subject<void>();

  staDisegnandoTCRunGrid = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false, false, false];
  // appoTcRun = null;
  vecchieCP;

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
    // private gestGrafici: GestioneGrafici
  ) {
  }

  pulisceAppoggi(t) {
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia dati tcrun');
    }
    this.destroy$.ferma(t);

    t.erroreTcRun[t.NumeroFrame2] = '';
    t.puliziaTC[t.NumeroFrame2] = new Date().toString();
    t.lastCallTCRun[t.NumeroFrame2] = '';
    // alert('Pulizia 1');
    t.datiTcRun = 'empty grid';
    t.vecchiDatiTcRun = undefined;
    this.vecchieCP = '';

    const nome = 'gridTcRun_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  caricaTCRunGrid(t) {
    // logConsole('Tc run grid 1', t.NumeroFrame2);

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    // logConsole('Tc run grid 2', t.NumeroFrame2);

    if (t.MappaOGrafico !== 'TC') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Tc Run Grid', t.NumeroFrame2, t.MappaOGrafico);

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
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'TC' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: esco da tcrun grid per frame non valido');
      }
      return;
    } */

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'carica Tc Run Grid');
    if (t.MappaOGrafico !== 'TC' || this.staDisegnandoTCRunGrid[t.NumeroFrame2] === true) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: esco da tcrun grid per frame non valido o già impegnato');
      }
      // logConsole('Tc run grid 2 ESCO', t.NumeroFrame2);
      return;
    }

    // logConsole('Tc run grid 3', t.NumeroFrame2);
    /* const act_set = ExternalUtilitiTC.ritornaStringPerActivitySetEventSummary(t, t.Utils);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activity set eventi:', t.NumeroFrame, act_set);*/

    if (t.act_set !== undefined && t.act_set === '') {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '*' + act_set + '*');
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: esco da tcrun grid per act_set vuoto');
      }
      t.datiTcRun = 'empty grid';
      // logConsole('Tc run grid 3 ESCO', t.NumeroFrame2);
      return;
    }

    this.staDisegnandoTCRunGrid[t.NumeroFrame2] = true;

    let vecchioSelezionato;
    if (t.rigaSelezionataTcRun) {
      vecchioSelezionato = JSON.parse(JSON.stringify(t.rigaSelezionataTcRun));
      t.rigaSelezionataTcRun = undefined;
    }
    /* let vecchioSelezionatoTC;
    if (t.indiceTC) {
      vecchioSelezionatoTC = JSON.parse(JSON.stringify(t.indiceTC));
    } */
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: Vecchio id ', vecchioSelezionato); // , vecchioSelezionatoTC);
    }

    // this.sceltaActivityDaSet
    // const id = act_set;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_set);

    // let tmsFilter = '';
    let sInizio = '';
    let sFine = '';
    let nomeActSet = t.act_set;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: Time filter:', t.timeFilter);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: Nome Activity:', t.Utils.nomeActivitySelezionata);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: Eseguito in progetto', t.eseguitoInProgetto2);
    
    // logConsole('TIME RANGE Entrata', t.timeFilter, t.timeFilter2);

    // logConsole('Tc run grid 5', t.NumeroFrame2);

    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      if (!t.Utils.tmsSelezionato || t.Utils.tmsSelezionato === null || t.Utils.tmsSelezionato === '') {
        t.datiTcRun = 'empty grid';
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: esco da tcrun grid per tms selezionato vuoto');
        }
        this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
        t.lastCallTCRun[t.NumeroFrame2] = '';
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NTCsun tms selezionato');
        // logConsole('Tc run grid 5 ESCO', t.NumeroFrame2);
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
      if (!t.eseguitoInProgetto2) {
        if (t.timeFilter === 4 || t.timeFilter2 === 'Selected Activity') {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: Time filter activity');
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

    // logConsole('Tc run grid 6', sInizio, sFine);

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

    // this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;

    if (lista === undefined || lista === 'undefined')  {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: esco da tcrun grid per lista eventi vuota');
      }
      // t.datiTcRun = 'empty grid';
      this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
      // logConsole('Tc run grid 6-1 ESCO', t.NumeroFrame2);
      return;
    }

    if (nomeActSet === undefined || nomeActSet === 'undefined' || nomeActSet === '') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: esco da tcrun grid per nomeactset vuoto');

      // t.datiTcRun = 'empty grid';
      this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
      // logConsole('Tc run grid 6-2 ESCO', t.NumeroFrame2);
      return; // sInizio = t.timeRangeDSFStart2;
    }

    if (sInizio === undefined || sInizio === 'undefined' || sInizio === '"undefined"') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: esco da tcrun grid per data inizio vuota');

      // t.datiTcRun = 'empty grid';
      this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
      // logConsole('Tc run grid 6-3 ESCO', t.NumeroFrame2);
      return; // sInizio = t.timeRangeDSFStart2;
    }
    if (sFine === undefined || sFine === 'undefined' || sFine === '"undefined"') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: esco da tcrun grid per data fine vuota');

      // t.datiTcRun = 'empty grid';
      this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
      // logConsole('Tc run grid 6-4 ESCO', t.NumeroFrame2);
      return; // sFine = t.timeRangeDSFStop2;
    }

    const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

    let misureAddizionali = '';
    if (t.misureAddizionaliTCRUN) {
      t.misureAddizionaliTCRUN.forEach(element => {
        if (element) {
          misureAddizionali += element + ',';
        }
      });
    }
    if (misureAddizionali.length > 0) {
      misureAddizionali = misureAddizionali.substring(0, misureAddizionali.length - 1);
    }

    let params = '{' +
      '"cntx_id": "' + t.sessionID2 + '",' +
      '"v_act_set_name_list": "' + nomeActSet + '",' +
      '"v_tms_min": ' + sInizio + ',' +
      '"v_tms_max": ' + sFine + ',' +
      '"v_additional_event_measure": "' + misureAddizionali + '", ' +
      '"v_tc_name": null, ' +
      '"v_result": null, ' +
      '"v_ts_name": null, ' +
      '"v_cluster_set_name": null, ' +
      '"v_bbox": "' + geoFilter + '", '; // +
    // '}';

    const propertyName = '';
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid', params);
    const actualCall = t.act_set + ';' + params + ';' + t.columnsSettings + ';' +
          propertyName;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, actualCall);
    // if (!t.Utils.lastCallTC) {
    //   t.Utils.lastCallTC = ExternalUtilitiTC.creaMatrice(environment.quantiSottoFramTC, environment.quantiFramTC, '');
    // }

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: Parametri ', t.NumeroFrame, actualCall);
    }

    t.caricamentoTcRunInCorso[t.NumeroFrame2] = true;

    // logConsole('Tc run grid 7', t.NumeroFrame2);

    if (t.datiTcRun && typeof(t.datiTcRun) === 'string') {
      if (t.datiTcRun.indexOf('ERROR: ') > -1) {
        t.datiTcRun = undefined;
        t.lastCallTCRun[t.NumeroFrame2] = undefined;
        // alert('Pulizia 2');
      }
    }
    
    if (actualCall !== t.lastCallTCRun[t.NumeroFrame2]) {
      t.lastCallTCRun[t.NumeroFrame2] = actualCall;
      // // logConsole('CHIAMATA', actualCall, t.lastCallTCRun[t.NumeroFrame2]);

      t.chiSonoTcRun[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params += '"v_caller_tag": "' + t.chiSonoTcRun[t.NumeroFrame2] + '" }';

      t.tcRunSelected = false;
      t.erroreTcRun[t.NumeroFrame2] = '';

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'RefrTCh summary:', params);

      // logConsole('Tc run grid 8, Chiamata', t.NumeroFrame2, params);
      
      t.paramsPerSS[t.NumeroFrame2] = params;
      t.queryPerSS[t.NumeroFrame2] = 'geo_tc_run__grid';

      t.effettuaAutoFitTC = false;
      t.lastCallTCRun2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_tc_run__grid', params)
      // .map(rTCponse => rTCponse)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // // logConsole('RITORNO TCRUN ', data2);

        if (data2 && data2 !== null) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data2);
          ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

          if (!t.controllaRitornoChiamata(t, data2, 'TC Run Grid')) {
            // t.caricamentoTcRunInCorso[t.NumeroFrame2] = false;
            return;
          }

          if (data2) {
            if (data2.message) {
              t.erroreTcRun[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
              this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
              t.caricamentoTcRunInCorso[t.NumeroFrame2] = false;
              t.datiTcRun = undefined;
            } else {
              if (data2.v_grid_msg !== undefined) {
                t.messaggioWarningTC = data2.v_grid_msg;
              } else {
                t.messaggioWarningTC= '';
              }

              if (data2.v_req_tms) {
                const ritorno = new Date(data2.v_req_tms);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno: ', ritorno);
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia: ', t.timeStampChiamataTCRUN);
                if (t.timeStampChiamataTCRUN && ritorno.getTime() < t.timeStampChiamataTCRUN.getTime()) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: esco per query vecchia', ritorno, t.timeStampChiamataTCRUN);

                  // t.caricamentoTcRunInCorso[t.NumeroFrame2] = false;
                  return;
                } else {
                  t.timeStampChiamataTCRUN = ritorno;
                }
              }

              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: Dati Tc Run Grid:', data2);
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: Dati griglia Tc Run Grid:', t.datiTcRun);

              if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
                t.gridTitleTcRun = data2.GridProperty[0].GridName;
              }
              // this.appoTcRun = data2;
              // t.datiTcRun = data2;

              if (t.datiTcRun && t.datiTcRun !== 'empty grid' && this.vecchieCP === JSON.stringify(data2.ColumnProperty)) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Faccio refresh Dati griglia Tc Run Grid', data2.DataTable, data2.DataTable.length);

                if (data2.DataTable.length > 0) {
                  t.datiTcRun.DataTable = data2.DataTable;
                } else {
                  t.datiTcRun = 'empty grid';
                  this.vecchieCP = '';
                }

                // t.impostaArraySelezioneTC();
                // t.impostaPaginaTC = 0;

                this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
                t.caricamentoTcRunInCorso[t.NumeroFrame2] = false;
              } else {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ricarico Dati griglia Tc Run Grid');

                let causa = '';

                if (this.vecchieCP && this.vecchieCP !== 'undefined' && this.vecchieCP !== null && this.vecchieCP !== 'null') {
                  if (this.vecchieCP !== JSON.stringify(data2.ColumnProperty)) {
                    causa = 'Colonne vecchie diverse dalle attuali: (' + JSON.parse(this.vecchieCP) + ' - ' + data2.ColumnProperty + ')';
                  }
                }
                if (causa === '') {
                  causa = 'DataTable nullo: (' + t.datiPointActivityEvents + ')';
                } else {
                  causa += 'DataTable nullo: (' + t.datiPointActivityEvents + ')';
                }
        
                this.vecchieCP = JSON.stringify(data2.ColumnProperty);

                t.datiTcRun = null;
                  
                const tm1 = setTimeout(() => {
                  clearTimeout(tm1);

                  t.vecchiDatiTcRun = data2;
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, dCS, dCD);

                  t.datiTcRun = data2;
                  const tm = setTimeout(() => {
                    clearTimeout(tm);

                    // logConsole('Effettuo autofit tc-run', t.NumeroFrame2, causa);

                    t.effettuaAutoFitTC = !t.effettuaAutoFitTC;
                    // const tm = setTimeout(() => {
                    // clearTimeout(tm);
                      t.impostaPaginaTC = 0;

                      this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
                      t.caricamentoTcRunInCorso[t.NumeroFrame2] = false;
                      // t.impostaArraySelezioneTC = vecchioSelezionato;
                      // if (vecchioSelezionatoTC) {
                        if (t.debug2 === true) {
                          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: Imposto Vecchio id ', vecchioSelezionato); // , vecchioSelezionatoTC);
                        }

                        t.tcRunSelected = true;
                        if (vecchioSelezionato) {
                          t.rigaSelezionataTcRun = vecchioSelezionato;
                        }
                        // if (vecchioSelezionatoTC) {
                          t.impostaSelezioneTC = t.indiceTC; // vecchioSelezionatoTC;
                        // }
                      // }
                    // }, 1000);
                  }, 500);                  
                }, 100);
              }
            }
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: ritorno query non valido');
            }
            t.datiTcRun = 'empty grid';
            this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
            t.caricamentoEventSummaryInCorso = false;
          }
        } else {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: ritorno query nullo');
          }
          t.datiTcRun = 'empty grid';
          this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
          t.caricamentoTcRunInCorso[t.NumeroFrame2] = false;
        }
      }, error => {
        this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
        t.caricamentoTcRunInCorso[t.NumeroFrame2] = false;
        t.lastCallTCRun[t.NumeroFrame2] = '';
        // alert('Pulizia 3');
        // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), true, error);

        t.datiTcRun = 'ERROR: ' + error?.message; // 
        /* if (error && error !== null) {
          t.datiTcRun = 'ERROR: ' + error._body;
        } else {
          t.datiTcRun = 'empty grid';
        } */
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Tc Run Grid: skip per chiamata uguale alla precedente');
      }

      /* t.datiTcRun = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiTcRun = t.vecchiDatiTcRun;
        // t.effettuaAutoFitTC = !t.effettuaAutoFitTC;

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
          t.caricamentoTcRunInCorso[t.NumeroFrame2] = false;
        }, 1000);
      }, 500); */
      // t.datiTcRun = JSON.parse(this.appoEventSummary);
      this.staDisegnandoTCRunGrid[t.NumeroFrame2] = false;
      t.caricamentoTcRunInCorso[t.NumeroFrame2] = false;
    }
  }
}

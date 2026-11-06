import { logConsole } from '../console-log';
import { Injectable, NgModule, OnDestroy } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import { ExternalApiService } from '../services/externalapi.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';
// import { environment } from '../../../../environments/environment.prod';

// import { SessionService } from '../../../../db/session.service';
// import Utils from '../Utilities.component';

@Injectable()
export class ActivitiesComponent {
  // lastCallActivities = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  destroy$ = new FineRichieste();

  vecchioJsonDati;
  staDisegnandoActivitites = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false, false, false];
  vecchioColumnProperty;

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.erroreActivities[t.NumeroFrame2] = '';
    t.lastCallActivities[t.NumeroFrame2] = '';
    t.datiActivities = 'empty grid';
    this.vecchioJsonDati = undefined;
    this.staDisegnandoActivitites[t.NumeroFrame2] = false;
    this.vecchioColumnProperty = '';

    const nome = 'gridActivities_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  caricaActivities(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'LA') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo activity', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prende CDR Data', t.NumeroFrame, t.timeFilter, t.Utils.tmsSelezionato);
    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /* let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'LA' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco 1 da activities', t.MappaOGrafico2);
      }
      return;
    } */

    if (t.MappaOGrafico2 !== 'LA' || this.staDisegnandoActivitites[t.NumeroFrame2] === true) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco 2 da activities', t.MappaOGrafico2);
      }
      // t.datiCellMeasure = 'empty grid';
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'esco 1');
      return;
    }

    /* let act_set = '';
    if (t.Activity2 === 0) { // LATEST SELECTION
      let conta2 = 0;
      t.listaActivityName2.forEach(element => {
        if (element !== null && element.NAME && element.NAME !== null) {
          if (t.Utils.act_setDelPuntoClickatoSullaMappa === element.NAME) {
            t.Utils.sceltaActivityDaSet[conta2].forEach(element2 => {
              act_set += element2.ID + ',';
            });
          }
        }
        conta2++;
      });
    } else {
      if (t.Activity2 === -1) { // ALL
        let q = 0;
        t.listaActivityName2.forEach(element => {
          if (element && element !== null && t.Utils.sceltaActivityDaSet[q]) {
            t.Utils.sceltaActivityDaSet[q].forEach(element2 => {
              act_set += element2.ID + ',';
            });
          }
          q++;
        });
      } else {
        const n = t.Activity2;

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR Data ActSet1');
        if (t.Utils && t.Utils !== null && t.Utils.sceltaActivityDaSet[n]) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR Data ActSet2', t.Utils.sceltaActivityDaSet[n]);
          t.Utils.sceltaActivityDaSet[n].forEach(element => {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR Data ActSet3', element);
            act_set += element.ID + ',';
          });
        }
      }
    }
    if (act_set.length > 1) {
      act_set = act_set.substring(0, act_set.length - 1);
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, act_set);
    */

    // if (t.Activity2 === -1) {
    //   t.Activity2 = 1; // IMPOSTATO PERCHE' IN QUESTA MASCHERA ERA SEMPRE -1... RICONTROLLARE IN FUTURO
    // }

    let agnact = '';
    if (t.tipoDataset2 === 1) {
      if (!t.act_set || t.act_set === '') {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activitites. ACT SET Vuoto. Esco', t.NumeroFrame2);
        }
        // t.datiCellMeasure = 'empty grid';
        return;
      }
    } else {
      if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
        agnact = 'null';
      } else {
        if (ExternalUtilities.stringaAGNoACT === undefined) {
          // t.datiCellMeasure = 'empty grid';
          return;
        }
        
        if (ExternalUtilities.stringaAGNoACT.indexOf('\'') === -1) {
          agnact = '\'' + ExternalUtilities.stringaAGNoACT + '\'';
        } else {
          agnact = ExternalUtilities.stringaAGNoACT;
        }
      }
    }

    // const tms = t.Utils.tmsSelezionato;

    let sInizio = '';
    let sFine = '';
    let filtro = '';
    sInizio = t.timeRangeDSFStart2;
    sFine = t.timeRangeDSFStop2;

    if (sInizio === undefined) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activities. tms Inizio Vuoto. Esco', t.NumeroFrame2);

      // t.datiActivities = 'empty grid';
      return;
    }
    if (sFine === undefined) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activities. tms Fine Vuoto. Esco', t.NumeroFrame2);
      // t.datiActivities = 'empty grid';
      return;
    }

    if (sInizio === undefined || sFine === undefined || sInizio === null || sFine === null) {
      return;
    }

    let eventi = '';

    /* let lista = null;
    let lep = null;
    if (t.tipoEvento2 === 'L') {
      lista = t.listaEventiDaPassare2;
      lep = t.Utils.converteStringaInJSON(lista);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi globale');
    } else {
      lista = t.eventiSceltiES;
      lep = lista;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi globale');
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lista, lep);
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per eventi:', listaEventiDaPassare2, lep);
    if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep.length > 0) {
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
        eventi = 'event_type = \'NONE\'';
      }
    } */

    const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activities Act_Set', t.act_set);

    let as = ExternalUtilities.effettuaReplace(t.act_set, '"', '');
    as = ExternalUtilities.effettuaReplace(as, '\'', '');
    const valoreRicerca = as;
    /* if (t.tipoDataset === 2) {
      as = ExternalUtilities.effettuaReplace(agnact, '"', '');
      as = ExternalUtilities.effettuaReplace(as, '\'', '');
      valoreRicerca = as;
    } */

    if (valoreRicerca === undefined || valoreRicerca === '' || valoreRicerca === '<All>') {
      return;
    }

    const params = {
      cntx_id: t.sessionID2,
      // v_caller_tag: t.chiSonoActvities[t.NumeroFrame2],
      v_act_set_name_list: valoreRicerca,
      // v_event_type_list: eventi,
      v_tms_min: sInizio,
      v_tms_max: sFine,
      // v_filter_group_by: t.filterGroupByCDD,
      v_bbox: geoFilter
    };

    const propertyName = '';

    const actualCall = valoreRicerca + ';' + JSON.stringify(params) + ';' + filtro + ';' + eventi + ';' + t.columnsSettings + ';' +
      propertyName;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activities parameters:', params);

    // // logConsole('Vecchio event summary', t.datiEventSummary);
    if (t.datiActivities && typeof(t.datiActivities) === 'string') {
      if (t.datiActivities.indexOf('ERROR: ') > -1) {
        t.datiActivities = undefined;
        t.lastCallActivities[t.NumeroFrame2] = undefined;
      }
    }
    
    if (actualCall !== t.lastCallActivities[t.NumeroFrame2]) {
      t.lastCallActivities[t.NumeroFrame2] = actualCall;

      this.staDisegnandoActivitites[t.NumeroFrame2] = true;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activities', t.NumeroFrame, params);
      }

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Leggo cdr data');
      t.caricamentoActivitiesInCorso[t.NumeroFrame2] = true;

      t.chiSonoActivities[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params['v_caller_tag'] = t.chiSonoActivities[t.NumeroFrame2];
      t.erroreActivities[t.NumeroFrame2] = '';

      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'geo_act_grid2';

      t.lastCallActivities2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_act__grid2', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (!t.controllaRitornoChiamata(t, data2, 'Act Grid 1')) {
          t.caricamentoActivitiesInCorso[t.NumeroFrame2] = false;
          return;
        }

        if (data2.message || data2.result) {
          if (data2.message) {
            t.erroreActivities[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
          } else {
            t.erroreActivities[t.NumeroFrame2] = 'ERROR: ' + data2.result;
          }
          t.lastCallActivities[t.NumeroFrame2] = '';
          t.caricamentoActivitiesInCorso[t.NumeroFrame2] = false;
          t.datiActivities = undefined;
          return;
        } else {
          if (data2.v_grid_msg !== undefined) {
            t.messaggioWarningA = data2.v_grid_msg;
          } else {
            t.messaggioWarningA = '';
          }

          if (data2 && data2.v_req_tms) {
            const ritorno = new Date(data2.v_req_tms);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno: ', ritorno);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia: ', t.timeStampChiamataTCRUN);
            if (t.timeStampChiamataActivities1 && ritorno.getTime() < t.timeStampChiamataActivities1.getTime()) {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activities: esco per query vecchia', ritorno, t.timeStampChiamataActivities1);
              }

              t.caricamentoActivitiesInCorso[t.NumeroFrame2] = false;
              t.lastCallActivities[t.NumeroFrame2] = '';
              return;
            } else {
              t.timeStampChiamataActivities1 = ritorno;
            }
          }

          if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
            t.gridTitleAct = data2.GridProperty[0].GridName;
          }

          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data);
          // let dCD = undefined;
          // let dCS = undefined;
          // try {
          // const dCD = data;
            // dCS = data[0].summary;
            // dCD = data[1].cdr;
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, dCD);
          // } catch (e) {
          //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore parse', data);
          // }
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati activities', JSON.stringify(data2.ColumnProperty) !== this.vecchioColumnProperty);

          // logConsole('Vecchi dati activities', t.datiActivities);
          if (t.datiActivities !== undefined && t.datiActivities.DataTable
            && t.datiActivities !== 'empty grid' && data2.DataTable && JSON.stringify(data2.ColumnProperty) === this.vecchioColumnProperty) {
            // if (t.debug2 === true) {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati activities da aggiornare', t.datiActivities);
            // }
            t.datiActivities.DataTable = data2.DataTable;

            t.caricamentoActivitiesInCorso[t.NumeroFrame2] = false;
            this.staDisegnandoActivitites[t.NumeroFrame2] = false;

            // logConsole('Aggiorno dati activities', t.datiActivities);
          } else {
            // if (t.debug2 === true) {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati activities da impostare', dCD);
            // }
            // t.datiActivities = undefined;
            this.vecchioColumnProperty = JSON.stringify(data2.ColumnProperty);
            this.vecchioJsonDati = data2;
            // t.datiActivitiesD = dCD;
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, dCS, dCD);
            // const tm = setTimeout(() => {
          // clearTimeout(tm);
              t.datiActivities = undefined;
              const tm = setTimeout(() => {
                clearTimeout(tm);

                t.datiActivities = data2;
                t.effettuaAutoFitLA = !t.effettuaAutoFitLA;
                t.impostaPaginaLA = 0;
                // t.effettuaAutoFitLA2 = !t.effettuaAutoFitLA2;
                // t.impostaPaginaLA2 = 0;

                t.caricamentoActivitiesInCorso[t.NumeroFrame2] = false;
                this.staDisegnandoActivitites[t.NumeroFrame2] = false;

                // logConsole('Creo dati activities', t.datiActivities);
              }, 100);
            // }, 100);
          }
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, JSON.parse(data));
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        // console.error('POST ERROR: ', error, error.message);
        t.datiActivities = 'ERROR: ' + error?.message;
        t.lastCallActivities[t.NumeroFrame2] = '';
        this.vecchioColumnProperty = '';

        t.caricamentoActivitiesInCorso[t.NumeroFrame2] = false;
        this.staDisegnandoActivitites[t.NumeroFrame2] = false;
      });
    } else {
      /* t.datiActivities = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiActivities = this.vecchioJsonDati;
      }, 1000); */

      t.caricamentoActivitiesInCorso[t.NumeroFrame2] = false;
      this.staDisegnandoActivitites[t.NumeroFrame2] = false;
    }
  }
}

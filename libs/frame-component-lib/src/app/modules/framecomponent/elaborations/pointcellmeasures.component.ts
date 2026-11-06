import { ExternalApiService } from './../services/externalapi.service';
// import { environment } from '../../../../environments/environment';
// import Utils from '../Utilities.component';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';
// import { anyChanged } from '@progress/kendo-angular-grid/dist/es2015/utils';
// import { SessionService } from '../../../../db/session.service';

@Injectable()
export class PointCMComponent {
  destroy$ = new FineRichieste();

  // lastCallPointCM = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  // js1old = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // js2old = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  staDisegnandoPCM = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false, false, false];

  constructor(
    private apiService: ExternalApiService,
    // private sessionService: SessionService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.errorePCM[t.NumeroFrame2] = '';
    t.lastCallPointCM[t.NumeroFrame2] = '';
    // t.js1old[t.frameAttivo2] = '';
    // t.js2old[t.frameAttivo2] = '';

    t.datiPointCellMeasures = 'empty grid';
    t.vecchiDatiPointCellMesaures = undefined;
    this.staDisegnandoPCM[t.NumeroFrame2] = false;

    const nome = 'gridPointCellMeasures_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  public prendePointCellMeasures(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'PK') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Point Cell Measures', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }

    if (this.staDisegnandoPCM[t.NumeroFrame2] === true) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco 2 da point cell measures', t.MappaOGrafico2);
      }
      // t.datiCellMeasure = 'empty grid';
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'esco 1');
      return;
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prende Point measures', t.NumeroFrame, t.frameVisible2);


    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'PK' || aperto === false) {
      return;
    } */

    /* const act_set = t.Utils.ActivitySetDelPuntoClickato;
    if (act_set === environment.stringaAll || act_set === environment.stringaLatestSelection) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ATTENZIONE!!! ACTIVITY SET del click impostata a ', act_set);
    }

    let sla = t.Utils.SlaDelPuntoClickato;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, sla);
    if (sla === environment.stringaGlobalSettingSLA || sla === '<Global Template>') {
      if (t.datiSlaDT && t.datiSlaDT !== 'empty grid') {
        t.datiSlaDT.forEach(element => {
          if (element.ID === t.slaValueGlobale2) {
            sla = element.NAME;
          }
        });
      }
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, sla);
    }

    let sla1 = '';
    if (sla && sla !== '') {
      sla1 = ' and geo_sla_name = \'' + sla + '\' and tms = \'' + tms + '\'';
    } else {
      sla1 = 'tms =\'' + tms + '\'';
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Filtro per numerici frame ' + t.NumeroFrame + ':', sla1);

    // let act_set1 = act_set;
    // if (act_set1 === undefined) {
    //   act_set1 = '';
    // }
    const act_set1 = t.Utils.ritornaStringPerActivitySetAPoint(t, act_set);
    const propertyName1 = 'propertyName=tms,measr_code,value_org,severity,color';

    // let act_set2 = act_set;
    // if (act_set2 === undefined) {
    //   act_set2 = '';
    // }
    const act_set2 = t.Utils.ritornaStringPerActivitySetAPoint(t, act_set);
    const propertyName2 =  'propertyName=measr_code,value,color';

    const sla2 = 'tms = \'' + tms + '\''; */

    // const act_set = t.Utils.ActivitySetDelPuntoClickato;
    // const act_set1 = ExternalUtilities.prendeActivitySceltaPerPointCM(t, t.Utils);

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.sceltaActivityDaSet);

    // if (t.Activity2 === -1) {
    //   t.Activity2 = 1; // IMPOSTATO PERCHE' IN QUESTA MASCHERA ERA SEMPRE -1... RICONTROLLARE IN FUTURO
    // }

    let agnact = '';
    if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = 'null';
    } else {
      if (ExternalUtilities.stringaAGNoACT === undefined) {
        t.datiCellMeasure = 'empty grid';
        return;
      }
      agnact =  ExternalUtilities.stringaAGNoACT;
    }

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const actualCall1 = 'POINTCM;' + agnact + ';' + t.Utils.tmsSelezionato + ';' + valoriDiBase;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.frameAttivo, t.NumeroFrame);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PRE Last call 1', t.Utils.lastCall[t.frameAttivo][t.NumeroFrame]);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PRE Last call 2', t.Utils.lastCall2[t.frameAttivo][t.NumeroFrame]);

    if (!t.Utils.tmsSelezionato || !agnact || agnact === '' || agnact === null || agnact === 'null') {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per tms null');
      return;
    }

    if (!t.Utils.tmsSelezionato || t.Utils.tmsSelezionato === null || t.Utils.tmsSelezionato === 'null' || t.Utils.tmsSelezionato === 'nullo') {
      return;
    }

    if (t.datiPointCellMeasures && typeof(t.datiPointCellMeasures) === 'string') {
      if (t.datiPointCellMeasures.indexOf('ERROR: ') > -1) {
        t.datiPointCellMeasures = undefined;
        t.lastCallPointCM[t.NumeroFrame2] = undefined;
      }
    }
    
    if (t.lastCallPointCM[t.NumeroFrame2] !== actualCall1) {
      // return;

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.frameAttivo, t.NumeroFrame);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'POST actual call 1', actualCall1);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'POST actual call 2', actualCall2);

      // t.caricamentoDatiInCorsoPointCellMeasures = true;

      t.lastCallPointCM[t.NumeroFrame2] = actualCall1;

      t.caricamentoPCM[t.NumeroFrame2] = true;
      const tms = new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime();
      const params = '{' +
        '"cntx_id": "' + t.sessionID2 + '",' +
        '"v_act_set_name_list": "' + agnact + '",' +
        '"v_tms": "' + t.Utils.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + '"' +
      '}';

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point Cell', t.NumeroFrame, params);
      }

      this.staDisegnandoPCM[t.NumeroFrame2] = true;
      t.errorePCM[t.NumeroFrame2] = '';
      
      t.paramsPerSS[t.NumeroFrame2] = params;
      t.queryPerSS[t.NumeroFrame2] = 'geo_point_cell_measr_list__grid';

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno point cm frame ', t.NumeroFrame, params);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'cell_measr_list', t.NumeroFrame, t.FrameAttivo, new Date().getTime());
      t.lastCallPK2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_point_cell_measr_list__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        this.staDisegnandoPCM[t.NumeroFrame2] = false;

        t.caricamentoPCM[t.NumeroFrame2] = false;
        if (data2 && data2 !== null) {
          if (data2.v_grid_msg !== undefined) {
            t.messaggioWarningPCM = data2.v_grid_msg;
          } else {
            t.messaggioWarningPCM = '';
          }

          if (data2.message) {
            t.errorePCM[t.NumeroFrame2] = 'ERROR: ' + data2.code + '-' + data2.message;
            this.staDisegnandoPCM[t.NumeroFrame2] = false;
            t.datiPointCellMeasures = undefined;
          } else {
            if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
              t.gridTitlePCM = data2.GridProperty[0].GridName;
            }

            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno Point cell measr:', data2);
            }

            if (t.vecchiDatiPointCellMesaures) {
              if (JSON.stringify(t.vecchiDatiPointCellMesaures.ColumnProperty) !== JSON.stringify(data2.ColumnProperty)) {
                t.datiPointCellMeasures = undefined;
              }
            }  
    
            // const data = data2; // [0].geo_measure_dfn__grid);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Measures:', data);
            if (t.datiPointCellMeasures && t.datiPointCellMeasures.DataTable && t.datiPointCellMeasures.DataTable.length > 0
                && data2.DataTable) {
              t.datiPointCellMeasures.DataTable = data2.DataTable;
            } else {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Riempio Point cell measr per la prima volta:', data2);
              }
              // t.datiPointCellMeasures = undefined;
              // const tm = setTimeout(() => {
          // clearTimeout(tm);
                t.datiPointCellMeasures = data2;
                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  t.effettuaAutoFitCM = !t.effettuaAutoFitCM;
                }, 500);
              // }, 500);
            }

            t.vecchiDatiPointCellMesaures = data2;

            // t.effettuaAutoFitCM = !t.effettuaAutoFitCM;
            t.impostaPaginaPCM = 0;
          }
        } else {
          t.datiPointCellMeasures = undefined; // 'empty grid'; // null;
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiPointCellMeasures, error);
        this.staDisegnandoPCM[t.NumeroFrame2] = false;
        t.lastCallPointCM[t.NumeroFrame2] = '';
        t.datiPointCellMeasures = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      });

    } else {
      // if (daTcRun === false) {
      //   t.aggiornaPointMeasure(act_set1 + '§' + tms + '§' + this.js1old[t.NumeroFrame] + '§' + this.js2old[t.NumeroFrame]);
      // } else {
      //   t.datiPoint = this.js2old[t.NumeroFrame];
      // }
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Riempio Point cell measr con i vecchi dati:', t.NumeroFrame2, t.vecchiDatiPointCellMesaures);
      }

      /* t.datiPointCellMeasures = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiPointCellMeasures = t.vecchiDatiPointCellMesaures;
      }, 500); */

    }
  }
}

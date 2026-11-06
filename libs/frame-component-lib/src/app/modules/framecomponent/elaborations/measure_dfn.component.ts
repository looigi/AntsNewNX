import { ExternalApiService } from './../services/externalapi.service';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { environment } from '../../../../environments/environment.prod';


@Injectable()
export class MeasureDFNComponent {
  destroy$ = new FineRichieste();

  // lastCallMeasureDFN = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  staElaborandoMDFN = [false, false, false, false, false, false, false, false, false, false, false]; // , false, false, false, false, false, false, false, false, false, false];
  // ultimaVoltaTMS = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  constructor(
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulisco measures dfn');
    this.destroy$.ferma(t);

    t.lastCallMeasureDFN[t.NumeroFrame2] = '';
    t.datiPointMeasureDFN = 'empty grid';
    t.vecchiDatiDFN = undefined;
    this.staElaborandoMDFN[t.NumeroFrame2] = false;

    const nome = 'gridPointMeasureDFN_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }
  }

  disegnaMeasureDFN(t) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    if (t.MappaOGrafico2 !== 'MD') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Measure Definition', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prende Point measures', t.NumeroFrame, tms);

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'MD' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Measure DFN: ESCO 1', t.NumeroFrame2, aperto, t.MappaOGraficoTutti2[t.frameAttivo2]);
      }
      return;
    } */

    if (this.staElaborandoMDFN[t.NumeroFrame2] === true) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Measure DFN: ESCO 2', t.NumeroFrame2);
      }
      return;
    }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS[t.NumeroFrame2] < t.ritardoPerFunzioni && this.ultimaVoltaTMS[t.NumeroFrame2] !== -1) {
      return;
    }
    this.ultimaVoltaTMS[t.NumeroFrame2] = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    const params = {
      cntx_id: t.sessionID2,
      v_filter_folder: null
    };

    const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const actualCall1 = 'MEASUREDFN;' + valoriDiBase + ';' + params;

    if (t.datiPointMeasureDFN && typeof(t.datiPointMeasureDFN) === 'string') {
      if (t.datiPointMeasureDFN.indexOf('ERROR: ') > -1) {
        t.datiPointMeasureDFN = undefined;
        t.lastCallMeasureDFN[t.NumeroFrame2] = undefined;
      }
    }
    
    if (t.lastCallMeasureDFN[t.NumeroFrame2] !== actualCall1) {
      t.caricamentoMeasureDFN[t.NumeroFrame2] = true;

      t.lastCallMeasureDFN[t.NumeroFrame2] = actualCall1;

      this.staElaborandoMDFN[t.NumeroFrame2] = true;
      t.erroreMDFN = '';
      
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Measure DFN', t.NumeroFrame, params);
      }
      
      t.paramsPerSS[t.NumeroFrame2] = JSON.stringify(params);
      t.queryPerSS[t.NumeroFrame2] = 'geo_measure_dfn__grid';

      t.lastCallMeasureDFN2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, 'geo_measure_dfn__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        this.staElaborandoMDFN[t.NumeroFrame2] = false;
        t.caricamentoMeasureDFN[t.NumeroFrame2] = false;

        if (data2.message) {
          t.erroreMDFN = 'ERROR: ' + data2.code + '-' + data2.message;
          this.staElaborandoMDFN[t.NumeroFrame2] = false;
          t.caricamentoMeasureDFN[t.NumeroFrame2] = false;
          // ExternalUtilities.messaggioDiErrore(t.datiPointMeasureDFN, error);
          t.datiPointMeasureDFN = undefined;
        } else {
          if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
            t.gridTitleMDFN = data2.GridProperty[0].GridName;
          }

          if (data2 && data2 !== null) {
            const data = data2;
            t.vecchiDatiDFN = data2;

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info:', t.datiPointMeasureDFN, data);
            if (t.datiPointMeasureDFN && data.DataTable && t.datiPointMeasureDFN !== 'empty grid') {
              t.datiPointMeasureDFN.DataTable = data.DataTable;
            } else {
              t.datiPointMeasureDFN = undefined;
              const tm1 = setTimeout(() => {
                clearTimeout(tm1);
                t.datiPointMeasureDFN = data;
                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  t.effettuaAutoFitMeasureDFN = !t.effettuaAutoFitMeasureDFN;
                }, 500);
              }, 500);
            }
          } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: arrivati dati nulli');
            }
            t.datiPointMeasureDFN = 'empty grid';
          }
        }
      }, error => {
        this.staElaborandoMDFN[t.NumeroFrame2] = false;
        t.caricamentoMeasureDFN[t.NumeroFrame2] = false;
        t.lastCallMeasureDFN[t.NumeroFrame2] = '';
        // ExternalUtilities.messaggioDiErrore(t.datiPointMeasureDFN, error);
        t.datiPointMeasureDFN = 'ERROR: ' + error?.message; // 'ERROR: ' + JSON.stringify(JSON.parse(error._body).message);
      });
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Point info: ridisegno vecchi dati', t.NumeroFrame2, t.vecchiDatiDFN);
      }

      /* t.datiPointMeasureDFN = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiPointMeasureDFN = t.vecchiDatiDFN;
      }, 500); */
    }
  }
}

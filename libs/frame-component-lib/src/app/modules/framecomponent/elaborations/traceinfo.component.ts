import { ExternalApiService } from './../services/externalapi.service';
// import Utils from '../Utilities.component';
import { Injectable } from '@angular/core';
// import { environment } from '../../../../environments/environment';
// import { Observable } from 'rxjs';
// import ExternalUtilities from '../ExternalUtilities.component';

@Injectable()
export class TCRunInfoComponent {
  // static lastCallTrace = ['', '', '', '', '', '', '', '', '', '', ''];

  // subscribe = null;
  // vecchioTcRun = '';

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService
  ) {

  }

  /*
  prendeDatiTcRun(t, tms, t2) {
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'TI' || t.frameVisible2 === false) {
      return;
    }

    if (t.MappaOGrafico2 !== 'TI') {
      return;
    }

    t.datiPoint = null;
    this.esegueCaricamento(t, tms, t2)
  }

  esegueCaricamento(t, tms, t2) {
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC Run Info: start');
    }

    let agnact = '';
    if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = 'null';
    } else {
      agnact = ExternalUtilities.stringaAGNoACT;
    }
    if (!agnact) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC Run Info: esco per agnact vuoto');
      }
      return
    }

    if (!tms) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC Run Info: esco per tms vuoto');
      }
      return
    }

    // const act_id = ExternalUtilities.prendeActivitySceltaPerEvents(t, t.Utils);
    const params = {
      cntx_id: t.sessionID2,
      v_act_set_name_list : agnact,
      v_tms: tms
    }
    if (t2.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Richiamo tcrun info', params);
    }

    const valoriDiBase2 = ';' + t.dashboardAttiva2 + ';' +
      t.frameAttivo + ';';
    const actualCall2 = 'TCRUNINFO;' + valoriDiBase2 + ';' + JSON.stringify(params);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, actualCall2);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, TCRunInfoComponent.lastCallTrace);
    if (TCRunInfoComponent.lastCallTrace[t.NumeroFrame] !== actualCall2) {
      TCRunInfoComponent.lastCallTrace[t.NumeroFrame] = actualCall2;
      t2.caricamentoTcRunInCorso2 = true;

      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC RUN Files', t.NumeroFrame, params);
      }

      this.apiService.chiamataPost(t.Utils, 'geo_tc_run_files__grid', params)
      // .map(response => response())
      .subscribe((data2: any) => {
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data);

        if (t2.datiTcRunFile && t2.datiTcRunFile.DataTable) {
          if (data && data.DataTable) {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC Run Info: rinfresco griglia 1');
            }

            t2.datiTcRunFile.DataTable = data.DataTable;
          } else {
            t2.datiTcRunFile = 'empty grid';
          }
        } else {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC Run Info: riempimento griglia 1');
          }

          t2.datiTcRunFile = data;

          const tm = setTimeout(() => {
          clearTimeout(tm);
            t2.effettuaAutoFitFile = !t2.effettuaAutoFitFile;
          }, 1000);
        }
        t2.caricamentoTcRunInCorso2 = false;

        if (data.v_tc_run_code !== this.vecchioTcRun) {
          this.vecchioTcRun = data.v_tc_run_code;
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC Run Info: Caricamento la griglia 2. Codice diverso: ', this.vecchioTcRun);
          }

          t2.caricamentoTcRunInCorso1 = true;
          this.apiService.chiamataPost(t.Utils, 'geo_tc_run_outcome__grid', params)
          // .map(response => response())
          .subscribe((data2: any) => {
            ExternalUtilities.checkRitornoChiamata(t, t.Utils, data);

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno info', data);
            if (t2.datiTcRunInfo && t2.datiTcRunInfo.DataTable) {
              if (data && data.DataTable) {
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC Run Info: rinfresco griglia 2');
                }

                t2.datiTcRunInfo.DataTable = data.DataTable;
              } else {
                t2.datiTcRunInfo = 'empty grid';
              }
            } else {
              if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC Run Info: riempimento griglia 2');
              }

              t2.datiTcRunInfo = data;

              const tm = setTimeout(() => {
          clearTimeout(tm);
                t2.effettuaAutoFitInfo = !t2.effettuaAutoFitInfo;
              }, 1000);
            }

            t2.caricamentoTcRunInCorso1 = false;
          });
        } else {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC Run Info: prevengo il caricamento della griglia 2. Stesso codice: ', this.vecchioTcRun);
          }
        }

        // t2.caricamentoTcRunInCorso1 = false;
      });
    // } else {
      // t2.caricamentoTcRunInCorso2 = false;
    }
  }

  prendeFileDaTcRun(t, nome, est) {
    if (t.MappaOGrafico2 !== 'TI') {
      return;
    }

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC Run Info: download file');
    }

    // t.caricamentoTcRunInCorso = true;

    const params = '{ "cntx_id": "' + t.sessionID2 + '", "v_file_name": "' + nome + '" }';

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TC RUN File', t.NumeroFrame, params);
    }

    this.apiService.chiamataPost(t.Utils, 'geo_tc_run_file__download', JSON.parse(params))
    // .map(response => response())
    .subscribe((data2: any) => {
      ExternalUtilities.checkRitornoChiamata(t, t.Utils, data);

      const byteBuf = this.u_atob(data); // atob(data);

      const blob = new Blob([byteBuf], {type: 'application/octet-stream'});
      const nomeFile = nome;

      const FileSaver = require('file-saver');
      FileSaver.saveAs(blob, nomeFile);

      // t.caricamentoTcRunInCorso = false;
    }, error => {
      ExternalUtilities.messaggioDiErrore('null', error);
    });
  }

  u_atob(ascii) {
    return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
  }
  */
}

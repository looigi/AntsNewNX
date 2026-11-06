import { logConsole } from '../console-log';
import { ExternalApiService } from './../services/externalapi.service';
import { Injectable } from '@angular/core';
// import Utils from '../Utilities.component';
// import { environment } from '../../../../environments/environment';
import ExternalUtilities from '../ExternalUtilities.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FineRichieste } from './fine-richieste';
// import { takeUntil } from 'rxjs/operators';
// import { SessionService } from '../../../../db/session.service';

@Injectable()
export class LegendaComponent {
  destroy$ = new FineRichieste();

  vecchioHtml = ['', '', '', '', '', '', '', '', '', '', ''];
  modalitaNuova = true;

  // lastCallLegenda = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  // staDisegnandoLegenda = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  // ultimaVoltaTMS = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
  ) {
  }

  pulisceAppoggi(t) {
    this.destroy$.ferma(t);

    t.lastCallLegenda[t.NumeroFrame2] = '';
  }

  disegnaLegenda(t, array, forza) {
    // logConsole('Legenda 1', t.NumeroFrame2, array);

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);

      return;
    }

    // logConsole('Legenda 2', t.NumeroFrame2);
    
    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Mappa', t.NumeroFrame2, t.MappaOGrafico2);

      return;
    }
    
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno legenda del frame ', t.NumeroFrame2, t.staDisegnandoLegenda, array);

    // logConsole('Legenda 3', t.NumeroFrame2);
    
    if (t.eseguitoInProgetto2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da legenda. Progetto esterno', t.NumeroFrame2, t.staDisegnandoLegenda, array);

      t.staDisegnandoLegenda[t.NumeroFrame2] = false;
      return;
    }

    /* if (ExternalUtilities.isArray(array)) {
      t.staDisegnandoLegenda[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno legenda del frame. Esco per array non valido ', t.NumeroFrame2, t.staDisegnandoLegenda, array);

      return;
    }
    if (this.staDisegnandoLegenda[t.NumeroFrame2] === true || t.MappaOGrafico2 !== 'M') {
      t.staDisegnandoLegenda[t.NumeroFrame2] = false;
      return;
    } */

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (forza === false) {
      if (ora - this.ultimaVoltaTMS[t.NumeroFrame2] < t.ritardoPerFunzioni && this.ultimaVoltaTMS[t.NumeroFrame2] !== -1) {
        t.staDisegnandoLegenda[t.NumeroFrame2] = false;
        return;
      }
    }
    this.ultimaVoltaTMS[t.NumeroFrame2] = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    // this.staDisegnandoLegenda[t.NumeroFrame2] = true;
    const layer = 'l_sla';
    const propertyName = '';

    /* let sla = '';
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Sla Name:', t.slaName2);
    if (t.slaName2 && t.slaName2 !== '') {
      sla = 'geo_sla_name = \'' + t.slaName2 + '\'';
    } */

    /* let sla = t.Utils.tornaIDSla(t); */
    const sla = ExternalUtilities.tornaSla(t);
    /* if (sla !== undefined && sla !== '') {
      sla = 'geo_sla_name = \'' + sla + '\'';
    } else {
      sla = '';
    } */
    // if (sla === environment.stringaGlobalSettingSLA) {
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Sla per legenda frame', t.NumeroFrame, sla);
    // }

    // logConsole('Misure per legenda', array);

    let measures = '';
    let types = '';
    const arrayMisure = new Array();
    // let q = 0;
    if (array && array !== null) {
      array.forEach(element => {
        // if (q > 0) {
        if (element && element.Valore) {
          let misura = ExternalUtilities.ritornaMisura(t, element.Valore, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, t.misureGlobaliMappa[t.NumeroFrame2], 'Legenda');

          // logConsole('Misura da legenda', element, misura);

          if (misura) {
            let ok = false;

            // logConsole('Misura trovata per legenda', misura, element);

            if (t.measureData2) {
              t.measureData2.forEach(element3 => {
                if (!ok && element3.DISPLAY_NAME === misura) {
                  ok = true;
                  misura = element3.CODE;
                  // logConsole('Misura trovata per legenda 2', misura, element3);
                }
              });
            }

            measures += '' + misura + ',';
            types += '' + element.Tipo.replace("**", "").replace("**", "") + ',';
            if (misura) {
              arrayMisure.push({ 
                Tipo: element.Tipo, 
                Misura: element.Valore, 
                Display: misura, 
                Trovata: element.Trovata, 
                Visualizzata: false
              })
            }
          }
        }
        // q++;
      });
    }
    // logConsole('Legenda 3.5', t.NumeroFrame2, arrayMisure);

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per legenda: Numero frame ', t.NumeroFrame);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per legenda: Misure ', t.measureData2);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per legenda: Sla', sla);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per legenda: Array ', array);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per legenda: Array2 ', arrayMisure);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per legenda: Misure length:', measures.length);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per legenda: Misure:', measures);

    // logConsole('Legenda 4', t.NumeroFrame2, measures);
    
    let nomeFrame = t.sistemaNomeFrame(t.frameName2);
    if (nomeFrame === '<empty>') { nomeFrame = 'empty'; }

    // logConsole('Legenda 4-1', t.NumeroFrame2, nomeFrame, t.frameName2);

    let htmlNomeFrame = '<span style="text-shadow: 1px 1px #aaa; font-weight: bold;">' + nomeFrame + '</span>&nbsp;';
    let html = '';
    // html += '<span style="text-shadow: 1px 1px #aaa;">' + t.act_id + '</span>&nbsp;';

    if (measures.length > 0) {
      measures = measures.substring(0, measures.length - 1);
      types = types.substring(0, types.length - 1);
      // measures = '(' + measures + ')';
      // const filtro = sla + measures;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, sla, measures);

      // if (t.Utils.lastCall[t.frameAttivo][t.NumeroFrame] !== params) {
      //   t.Utils.lastCall[t.frameAttivo][t.NumeroFrame] = params;

      // if (this.modalitaNuova) {
        let valoreRicerca;

        if (t.tipoDataset2 === 2) {
          if (ExternalUtilities.stringaAGNoACT === undefined || ExternalUtilities.stringaAGNoACT === 'undefined') {
            return;
          }
          if (ExternalUtilities.stringaAGNoACT) {
            valoreRicerca = '\'' + ExternalUtilities.stringaAGNoACT + '\'';
          }
        } else {
          if (t.act_set) {
            valoreRicerca = '\'' + t.act_set + '\'';
          }
        }

        let tmsInizio;
        let tmsFine;

        if (t.eseguitoInProgetto2 === true && t.tmsPassatiDaProgetto2) {
          const tt = t.tmsPassatiDaProgetto2.split(';');
          const sInizio = tt[0];
          const sFine = tt[1];

          tmsInizio = sInizio;
          tmsFine = sFine;
        } else {
          if (+t.timeFilter === 1 || t.timeFilter2 === 'All') {
            tmsInizio = t.timeRangeDSFStart2;
            tmsFine = t.timeRangeDSFStop2;
          } else {
            tmsInizio = t.Utils.tmsInizio;
            tmsFine = t.Utils.tmsFine;
          }
        }

        let sla = ExternalUtilities.tornaSla(t);
        if (sla !== undefined && sla !== '') {
        } else {
          sla = '';
        }

        // FILTER
        const filtri = ExternalUtilities.prendeFiltri(t, false, 'DisegnaLegenda');
        const cm1 = filtri.cm1;
        const cm2 = filtri.cm2;
        const tf1 = filtri.tf1;
        const tf2 = filtri.tf2;
        // FILTER
        
        // logConsole('Valore ricerca', valoreRicerca, typeof(valoreRicerca));

        if (!valoreRicerca || valoreRicerca === 'undefined' || valoreRicerca === null || valoreRicerca === 'null') {
          return;
        }

        if (!tmsInizio || !tmsFine) {
          return;
        }

        valoreRicerca = valoreRicerca.replace('\'', '').replace('\'', '').replace('"', '').replace('"', '');

        const parametriNuovi = {
          cntx_id: t.sessionID2,
          v_act_set_name_list: valoreRicerca,
          v_geo_sla_name: sla,
          v_measr_code_list: measures,
          v_measr_code_text_list: types,
          v_filter_measr_code_1: cm1 === 'null' ? null : cm1,
          v_filter_measr_value_1: tf1 === 'null' ? null : tf1,
          v_filter_measr_code_2: cm2 === 'null' ? null : cm2,
          v_filter_measr_value_2: tf2 === 'null' ? null : tf2,
          v_tms_min: tmsInizio,
          v_tms_max: tmsFine,
          v_bbox: '(ALL)'
        }

        const actualCallN = JSON.stringify(parametriNuovi);
        if (actualCallN !== t.lastCallLegenda[t.NumeroFrame2]) {
          t.lastCallLegenda[t.NumeroFrame2] = actualCallN;

          // logConsole('Chiamata nuova', t.NumeroFrame2, JSON.parse(actualCallN));
          // logConsole('Chiamata vecchia', t.NumeroFrame2, JSON.parse(t.lastCallLegenda[t.NumeroFrame2]));

          t.chiSonoLegenda[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
          parametriNuovi['v_caller_tag'] = t.chiSonoLegenda[t.NumeroFrame2];

          this.apiService.chiamataPost(t.Utils, 'geo_map_legend__get', parametriNuovi)
          .pipe(takeUntil(this.destroy$.per(t)))
          .subscribe((data2: any) => {
            ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

            t.staDisegnandoLegenda[t.NumeroFrame2] = false;

            if (!t.controllaRitornoChiamata(t, data2, 'Legenda')) {
              return;
            }

            // logConsole('Nuova chiamata legenda. Ritorno: ', t.NumeroFrame2, data2);
            if (data2 && data2 !== null) {
              let htmlFinale = '';
              let vecchioTipo = '';

              const dt = data2.DataTable;
              dt.forEach(element => {
                const Misura = element.DISPLAY_NAME;
                const Tipo = element.MEARS_CODE_TEXT;
                const legenda = element.LEGEND;
                //if (vecchioTipo !== Tipo) {
                //   vecchioTipo = Tipo;
                  htmlFinale += '<br /><span style="text-shadow: 1px 1px #aaa; font-weight: bold; color:black;">' + Tipo + '</span>&nbsp;' + Misura + '&nbsp;';
                // }
                legenda.forEach(element2 => {
                  const value = element2.VALUE; // .replace(' ', '-');
                  const formato = element2.VALUE_FRM;

                  // htmlFinale += '<span style="padding-left: 3px; padding-right: 3px;' + formato.replace(",", ";") + '">' + value + '</span>&nbsp;';
                  htmlFinale += '<span style="margin-left: 1px; padding-left: 3px; padding-right: 3px;' + formato.replace(",", ";") + '">' + value + '</span>';
                });
              });

              htmlFinale = this.aggiungeThr(t, htmlFinale);
              this.vecchioHtml[t.NumeroFrame2] = htmlFinale;

              this.applicaHtml(t, htmlNomeFrame, htmlFinale, arrayMisure, 'Normale');
            }
          });
        } else {
          // Ultima chiamata uguale
          t.staDisegnandoLegenda[t.NumeroFrame2] = false;
          return;
        }
      // }


      /*
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Geo Event Text Sel', t.NumeroFrame, measures);
      const params = {
        cntx_id: t.sessionID2,
        v_geo_sla_name: sla,
        v_geo_measure_dfn_code: measures
      };

      const bbox = ExternalUtilities.ritornaBboxGiusta(t, 'Legenda');
      if (!bbox || bbox === '') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da scrive legenda per bbox nulla');

        t.staDisegnandoLegenda[t.NumeroFrame2] = false;
        return;
      }

      // logConsole('Legenda 5', t.NumeroFrame2, params);

      // const actualCall = 'geo_sla_thr__sel?geo_sla_name=eq.' + sla +
      //   '&geo_measure_dfn_code=in.' + measures +
      //   '&select=thr_value_1,thr_value_2,thr_value_3,thr_value_4,thr_color_1,thr_color_2,thr_color_3,thr_color_4' + ';' + params;
      const actualCall = JSON.stringify(params) + ";" + JSON.stringify(arrayMisure) + ";" + JSON.stringify(array) + ';' + bbox;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Legenda ultima chiamata: ', actualCall, LegendaComponent.lastCallLegenda[t.NumeroFrame]);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Legenda uguaglianza ultima chiamata: ', actualCall === LegendaComponent.lastCallLegenda[t.NumeroFrame]);
      if (actualCall !== t.lastCallLegenda[t.NumeroFrame2]) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, actualCall);
        t.lastCallLegenda[t.NumeroFrame2] = actualCall;

        // logConsole('Legenda 6', t.NumeroFrame2);

        this.apiService.chiamataPost(t.Utils, 'geo_sla_thr__sel', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$.per(t)))
        .subscribe((data2: any) => {
            // const data2 = JSON.parse(data);
            ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, data2);
            const csv = data2;

            // logConsole('Legenda 7', t.NumeroFrame2, csv);

            if (csv && csv.length > 0) {
              // let pos = 1;
              let htmlMisure = '';
              let htmlMosaic = '';
              let htmlCluster = '';
              let htmlSample = '';

              csv.forEach(element => {
                // logConsole('Misura da rilevare: ', element['geo_measure_dfn_code'], arrayMisure);
                let tipo = '';
                let trovata = '';
                arrayMisure.forEach(element2 => {
                  if (tipo === '' && (element2.Display === element['geo_measure_dfn_code'] || element2.Misura === element['geo_measure_dfn_code'])) {
                    tipo = element2.Tipo;
                    trovata = element2.Trovata + '&nbsp';
                    element2.Visualizzata = true;
                  }
                });
                logConsole('Misura rilevata: ', tipo, trovata);

                switch (tipo) {
                  case '**Sample**':
                    const misuraS = '<span style="color:black;">' + ExternalUtilities.PrendeNomeMisuraDaCodice(element['geo_measure_dfn_code'], t.measureData2, 'Legenda. Frame ' + t.NumeroFrame2) + '</span>';

                    if (htmlSample.indexOf(tipo) > -1) {
                      htmlSample += misuraS + '&nbsp;' + trovata;
                    } else {
                      htmlSample += '<span style="text-shadow: 1px 1px #aaa; font-weight: bold; color:black;">' + tipo + '</span>&nbsp;' + misuraS + '&nbsp;' + trovata;
                    }
                    for (let i = 1; i <= t.Utils.quanteMisureGrafici; i++) {
                      if (element['thr_value_' + i] && element['thr_color_' + i]) {
                        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
                        htmlSample += '<span style="margin-left: 1px; padding-left: 3px; padding-right: 3px; background-color: ' + element['thr_color_' + i] + '">' + element['thr_value_' + i] + '</span>';
                      }
                    }
                    if (htmlSample) {
                      htmlSample += '&nbsp;';
                    }
                    break;
                  case '**Line**':
                    const misuraL = '<span style="color:black;">' + ExternalUtilities.PrendeNomeMisuraDaCodice(element['geo_measure_dfn_code'], t.measureData2, 'Legenda. Frame ' + t.NumeroFrame2) + '</span>';

                    if (htmlMisure.indexOf(tipo) > -1) {
                      htmlMisure += misuraL + '&nbsp;' + trovata;
                    } else {
                      htmlMisure += '<span style="text-shadow: 1px 1px #aaa; font-weight: bold; color:black;">' + tipo + '</span>&nbsp;' + misuraL + '&nbsp;' + trovata;
                    }
                    for (let i = 1; i <= t.Utils.quanteMisureGrafici; i++) {
                      if (element['thr_value_' + i] && element['thr_color_' + i]) {
                        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
                        htmlMisure += '<span style="margin-left: 1px; padding-left: 3px; padding-right: 3px; background-color: ' + element['thr_color_' + i] + '">' + element['thr_value_' + i] + '</span>';
                      }
                    }
                    htmlMisure += '&nbsp;';
                    break;
                  case '**Mosaic**':
                    const misuraM = '<span style="color:black;">' + ExternalUtilities.PrendeNomeMisuraDaCodice(element['geo_measure_dfn_code'], t.measureData2, 'Legenda. Frame ' + t.NumeroFrame2) + '</span>';

                    if (htmlMosaic.indexOf(tipo) > -1) {
                      htmlMosaic += misuraM + '&nbsp;' + trovata;
                    } else {
                      htmlMosaic += '<span style="margin-left: 1px; padding-left: 3px; padding-right: 3px; text-shadow: 1px 1px #aaa; font-weight: bold; color:black;">' + tipo + '</span>&nbsp;' + misuraM + '&nbsp;' + trovata;
                    }
                    for (let i = 1; i <= t.Utils.quanteMisureGrafici; i++) {
                      if (element['thr_value_' + i] && element['thr_color_' + i]) {
                        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
                        htmlMosaic += '<span style="background-color: ' + element['thr_color_' + i] + ';margin-left: 1px; padding-left: 3px; padding-right: 3px; ">' + element['thr_value_' + i] + '</span>';
                      }
                    }
                    if (htmlMosaic) {
                      htmlMosaic += '&nbsp;';
                    }
                    break;
                  case '**Cluster**':
                    const misuraC = '<span style="color:black;">' + ExternalUtilities.PrendeNomeMisuraDaCodice(element['geo_measure_dfn_code'], t.measureData2, 'Legenda. Frame ' + t.NumeroFrame2) + '</span>';

                    if (htmlCluster.indexOf(tipo) > -1) {
                      htmlCluster += misuraC + '&nbsp;' + trovata;
                    } else {
                      htmlCluster += '<span style="margin-left: 1px; padding-left: 3px; padding-right: 3px; text-shadow: 1px 1px #aaa; font-weight: bold; color:black;">' + tipo + '</span>&nbsp;' + misuraC + '&nbsp;' + trovata;
                    }
                    for (let i = 1; i <= t.Utils.quanteMisureGrafici; i++) {
                      if (element['thr_value_' + i] && element['thr_color_' + i]) {
                        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
                        htmlCluster += '<span style="background-color: ' + element['thr_color_' + i] + ';margin-left: 1px; padding-left: 3px; padding-right: 3px; ">' + element['thr_value_' + i] + '</span>';
                      }
                    }
                    if (htmlCluster) {
                      htmlCluster += '&nbsp;';
                    }
                    break;
                }
                // pos++;
              });

              html += htmlMisure + htmlSample + htmlMosaic + htmlCluster;
              html = this.aggiungeThr(t, html);
              this.vecchioHtml[t.NumeroFrame2] = html;

              // logConsole('Legenda 7-2', t.NumeroFrame2, arrayMisure, html);

              // logConsole('HTML CODE 0', html);
              this.applicaHtml(t, htmlNomeFrame, html, arrayMisure, 'Normale');

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito legenda 5', html);

              // this.staDisegnandoLegenda[t.NumeroFrame2] = false;

              t.staDisegnandoLegenda[t.NumeroFrame2] = false;
            } else {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito legenda 4');
              // const html = this.aggiungeThr(t, '');

              // this.staDisegnandoLegenda[t.NumeroFrame2] = false;

              // logConsole('Legenda 7-3', t.NumeroFrame2, arrayMisure);

              this.vecchioHtml[t.NumeroFrame2] = html;

              // logConsole('HTML CODE 1', html);
              this.applicaHtml(t, htmlNomeFrame, html, arrayMisure, 'Vecchia chiamata uguale');

              t.staDisegnandoLegenda[t.NumeroFrame2] = false;
            }
          }, error => {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito legenda 3');

            // logConsole('HTML CODE 2', html);
            this.vecchioHtml[t.NumeroFrame2] = html;
            this.applicaHtml(t, htmlNomeFrame, html, arrayMisure, 'Errore su chiamata');

            // this.staDisegnandoLegenda[t.NumeroFrame2] = false;

            ExternalUtilities.messaggioDiErrore('null', error);

            t.staDisegnandoLegenda[t.NumeroFrame2] = false;
          });
          // const csv = await t.downloadFile.downloadCSV(layer, '', '', '', filtro, propertyName, 'csv', '', 'EXECUTE', true, 'Legenda');
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, csv.toString());
        /* } else {
          const html = this.aggiungeThr(t, '');
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, html);
          t.htmlCode = html;

      // t.htmlCode = '';
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito legenda 2', t.valoriEnv);

          this.staDisegnandoLegenda[t.NumeroFrame2] = false;

          t.staDisegnandoLegenda[t.NumeroFrame2] = false; * /
      } else {
        // logConsole('Legenda 9', t.NumeroFrame2);

        html = this.vecchioHtml[t.NumeroFrame2];
        this.applicaHtml(t, htmlNomeFrame, html, arrayMisure, 'Misure 9');

        t.staDisegnandoLegenda[t.NumeroFrame2] = false;
      } */
    } else {
     //  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito legenda 1');

      // let html = this.aggiungeThr(t, '');

      // logConsole('HTML CODE 3', html);
      this.vecchioHtml[t.NumeroFrame2] = html;
      this.applicaHtml(t, htmlNomeFrame, html, arrayMisure, 'Misure 0');

      // logConsole('Legenda 8', t.NumeroFrame2, html);
      // this.staDisegnandoLegenda[t.NumeroFrame2] = false;

      t.staDisegnandoLegenda[t.NumeroFrame2] = false;
    }
  }

  applicaHtml(t, nomeHtml, html, arrayMisure, daDove) {
    while (html.indexOf('**') > -1) {
      html = html.replace('**', '');
    }

    const resto = this.aggiungeResto(t);
    if (resto) { html += '&nbsp;' + resto; }

    while (html.indexOf('&nbsp;&nbsp;') > -1) {
      html = html.replace('&nbsp;&nbsp;', '&nbsp;');
    }
    const fine = html.substring(html.length - 6);
    
    if (fine === '&nbsp;') {
      html = html.substring(0, html.length - 6);
    }

    if (t.debug2) {
      // logConsole('Stampo misure da ' + daDove + ' Frame ' + t.NumeroFrame2, arrayMisure);
      let ok = false;
      let nonTrovate = '&nbsp;';
      arrayMisure.forEach(element => {
        if (element.Visualizzata === false) {
          // logConsole('Misura non visualizzata di tipo ' + element.Tipo, element.Display + ' (' + element.Misura + ')', 'Frame ' + t.NumeroFrame2);
          ok = true;
          nonTrovate += element.Display + ' (' + element.Tipo.replace('**', '').replace('**', '') + ')&nbsp;';
        }
      });
      if (ok) {
        html += '&nbsp;<span style="text-shadow: 1px 1px #aaa; font-weight: bold;">Not Found:</span>' + nonTrovate;
      }
    }

    t.htmlCode = nomeHtml + html;
  }

  aggiungeResto(t) {
    let layers = '';

    if (t.listaLayersDaVisualizzare) {
      layers = '<span style="text-shadow: 1px 1px #aaa; font-weight: bold; color:black;">Layers</span>&nbsp;' + t.listaLayersDaVisualizzare + '&nbsp;';
    }

    let samples = '';
    if (t.scrittaSample) {
      if (layers) { samples = '&nbsp;'; }
      samples += '<span style="text-shadow: 1px 1px #aaa; font-weight: bold; color:black;">Samples</span>&nbsp;' + t.scrittaSample + '&nbsp;';
    }

    return layers + samples;
  }

  aggiungeThr(t, h) {
    let ritorno = h;
    let campo = false;

    if (t.cellaSelezionata2 && t.cellaSelezionata2.LAYER_NAME) {
      ritorno += '<br /><span style="font-weight: bold;">' + t.cellaSelezionata2.LAYER_NAME + '</span>'; // <br/>';
      if (t.cellaSelezionata2.LAYER_NAME.toUpperCase().indexOf('CAMPO') > -1) {
        campo = true;
      }
    }
    if (t.valoriEnv && campo) {
      let valori = '';
      const v = t.valoriEnv.split(';');
      v.forEach(element => {
        const vv = element.split(':');
        valori += vv[1] + ',';
      });
      if (valori.length > 0) {
        valori = valori.substring(0, valori.length - 1);
        const vvv = valori.split(',');
        const colori = [ '#00e200', '#b9ff00', '#ffff00', '#ffb837', '#ff0000', '#BBBBBB'];
        let n = 0;
        vvv.forEach(element => {
          if (element && element !== 'undefined') {
            ritorno += '<span style="background-color: ' + colori[n] + ';">&nbsp;&nbsp;&nbsp;</span>&nbsp;' + element + '&nbsp;';
            n++;
          }
        });
        ritorno += '<span style="background-color: ' + colori[n] + ';">&nbsp;&nbsp;&nbsp;</span>';
      }
    }
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno legenda:', ritorno);
    }

    return ritorno;
  }
}

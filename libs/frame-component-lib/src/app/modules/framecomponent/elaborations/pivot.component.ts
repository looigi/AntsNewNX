import { logConsole } from '../console-log';
/* import { ExternalApiService } from './../services/externalapi.service';
// import { SessionService } from './../../../../db/session.service';
import { Injectable } from '@angular/core';
import * as wjOlap from '@grapecity/wijmo.olap';
import '@grapecity/wijmo.styles/wijmo.css';
import ExternalUtilities from '../ExternalUtilities.component';
// import Utils from '../Utilities.component';

@Injectable()
export class PivotComponent {
  static righePivot = null;
  static lastCallPivot = ['', '', '', '', '', '', '', '', '', '', ''];

  staDisegnandoPivot = [false, false, false, false, false, false, false, false, false, false, false];
  // lastCall = '';

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService
  ) {
  }

  disegnaPivot(t) {
    let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'PT' || aperto === false) {
      return;
    }

    // // logConsole('Disegna Histogramma');
    if (t.subscribe !== null || this.staDisegnandoPivot[t.NumeroFrame2] === true) {
      t.comboDisabilitata = false;
      return;
    }

    let act_set = ExternalUtilities.ritornaStringPerActivitySet(t, t.Utils);
    act_set = act_set.replace('geo_act_set_name_1:', '');
    if (act_set === '' || !act_set || act_set === 'undefined') {
      return;
    }

    if (act_set.indexOf('geo_act_set_name_1') === -1) {
      act_set = 'geo_act_set_name_1:' + act_set;
    }

    t.Utils.staGiaDisegnandoPivot[t.NumeroFrame] = true;

    // // logConsole(t.strutturaClick);
    // let tms = t.strutturaClick.tms;
    // if (!tms) {
    //   tms = t.strutturaClick.tms_min;
    // }
    // if (tms) {
      // // logConsole('Struttura arrivata: ', t.strutturaClick);
      // // logConsole('Timestamp di riferimento:', tms);
    let q = 0;
    t.Measure.forEach(element => {
      if (element && element !== '') {
        q++;
      }
    });

    // // logConsole('Misure selezionate:', q);

    if (q > 0) {
      // // logConsole(act_set);

      let sla = ExternalUtilities.tornaSla(t);
      if (sla !== undefined && sla !== '') {
        sla = 'sla_name:' + sla;
      } else {
        sla = '';
      }

      let tmsFilter = '';
      let sInizio = '';
      let sFine = '';
      if (t.timeFilter === 2) {
        // // logConsole(t.Utils.rangeSelezionato);
        if (t.Utils.tmsInizio && t.Utils.tmsFine) {
          // const c = t.Utils.rangeSelezionato.split(';');
          // if (c[0] !== null && c[1] !== null && c[0] !== 'null' && c[1] !== 'null') {
            sInizio = t.Utils.tmsInizio;
            sFine = t.Utils.tmsFine;

            sInizio =  t.datePipe.transform(sInizio, 'yyyy-MM-dd HH:mm:ss');
            sFine =  t.datePipe.transform(sFine, 'yyyy-MM-dd HH:mm:ss');

            tmsFilter = 'tms >= \'' + sInizio + '\' and tms <=\'' + sFine + '\';';
        // } else {
          //   t.comboDisabilitata = false;
          //   t.Utils.staGiaDisegnandoPivot[t.NumeroFrame] = false;
          //   return;
          // }
        } else {
          t.comboDisabilitata = false;
          t.Utils.staGiaDisegnandoPivot[t.NumeroFrame] = false;
          return;
        }
      } else {
        sInizio = t.timeRangeDSFStart2;
        sFine = t.timeRangeDSFStop2;

        sInizio =  t.datePipe.transform(sInizio, 'yyyy-MM-dd HH:mm:ss');
        sFine =  t.datePipe.transform(sFine, 'yyyy-MM-dd HH:mm:ss');

        tmsFilter = 'tms_min >= \'' + sInizio + '\' and tms_max <= \'' + sFine + '\';';
      }
      if (!sInizio || sInizio === '' || sInizio === null) {
        if (t.debug2 === true) {
          // logConsole('Pivot esco per tms vuoti');
        }
        return;
      }

      const array = new Array();

      t.Measure.forEach(element => {
        if (element && element !== '') {
          if (element === 'global_measure') {
            t.measureData2.forEach(element2 => {
              if (element2.CODE === t.Utils.globalMeasure.MEASR_CODE) {
                array.push(element2.CODE.replace('"', '').replace('"', ''));
              }
            })
          } else {
            array.push(element);
          }
        } else {
          array.push('---');
        }
      });

      let index = 0;
      // let params = 'viewparams=';
      const nomiMisure = new Array();
      const misure = new Array();

      array.forEach(async element => {
        if (element !== '---') {
          let campo = '';
          let tipo = '';

          t.measureData2.forEach(element2 => {
            if (campo === '' && element2) {
              if (element2.CODE.toLowerCase().trim() === element.toLowerCase().trim()) {
                nomiMisure.push({ name: element2.NAME, type: element2.TYPE });

                index++;
                campo = element2.CODE.toLowerCase().trim();
                tipo = 'measr_code_' + index;

                const altro = tipo + ':' + campo + ';';
                // params += altro;
                let code = element2.CODE;
                while (code.indexOf('\'') > -1) {
                  code = code.replace('\'', '');
                }
                while (code.indexOf('"') > -1) {
                  code = code.replace('"', '');
                }
                misure.push(code);
              }
            }
          });
        }
      });
      // params += (sla + ';');
      // params += (act_set + ';');
      // params += tmsFilter;

      if (misure.length < 4) {
        for (let i = misure.length; i <= 4 ; i++) {
          misure.push(null);
        }
      }

      const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

      if (sInizio !== null && sInizio !== 'null') {
        sInizio = '"' + sInizio + '"';
      }
      if (sFine !== null && sFine !== 'null') {
        sFine = '"' + sFine + '"';
      }

      let params;
      if (sInizio && sFine && tmsFilter !== '') {
        params = '{ ' +
          '"cntx_id": "' + t.sessionID2 + '",' +
          '"v_act_set_name_list": "' + t.act_set + '", ' +
          '"v_geo_sla_name": "' + sla + '", ' +
          '"v_tms_min": ' + sInizio + ',' +
          '"v_tms_max": ' + sFine + ', ' +
          '"v_aggr_type": "sample", ' +
          '"v_measr_code_1": "' + misure[0] + '", ' +
          '"v_measr_code_2": "' + misure[1] + '", ' +
          '"v_measr_code_3": "' + misure[2] + '", ' +
          '"v_measr_code_4": "' + misure[3] + '", ' +
          '"v_bbox": "' + geoFilter + '" ' +
        ' }';
      } else {
        params = '{ ' +
          '"cntx_id": "' + t.sessionID2 + '",' +
          '"v_act_set_name_list": "' + t.act_set + '", ' +
          '"v_geo_sla_name": "' + sla + '", ' +
          '"v_tms_min": ' + sInizio + ',' +
          '"v_tms_max": ' + sFine + ', ' +
          '"v_aggr_type": "sample", ' +
          '"v_measr_code_1": "' + misure[0] + '", ' +
          '"v_measr_code_2": "' + misure[1] + '", ' +
          '"v_measr_code_3": "' + misure[2] + '", ' +
          '"v_measr_code_4": "' + misure[3] + '", ' +
          '"v_bbox": "' + geoFilter + '" ' +
        ' }';
      }
      // logConsole(params);

      // // logConsole('Pivot params', act_set, params);
      // tmsFilter = '';

      // const propName = 'propertyName=value_1,value_2,value_3,severity_1,severity_2,severity_3,severity_4';
      // const layer = 'Geo_ANTS:l_geo_measr_sample';

      const valoriDiBase = ';' + t.dashboardAttiva2 + ';' +
        t.frameAttivo + ';';
      const actualCall = 'PIVOT;' + act_set + ';' + params + valoriDiBase;
      if (PivotComponent.lastCallPivot[t.NumeroFrame] !== actualCall) {
        PivotComponent.lastCallPivot[t.NumeroFrame] = JSON.parse(JSON.stringify(actualCall));

        // // logConsole('Carico pivot frame', t.NumeroFrame, act_set, params);
        // const csv = await t.downloadFile.downloadCSV(layer, '', '', '', '',
        //             propName, 'application/json', params, 'EXECUTE', false, 'Pivot');
        // // logConsole(csv[0]);
        // t.urlPivot = {dataSource: { filename: csv[0], type: 'csv' }};

        /* const pivotReport = {
          dataSource: {
            filename: csv[0],
            type: 'csv'
          },
        };
        t.urlPivot = pivotReport; // /

        this.apiService.chiamataPost(t.Utils, 'geo_measure_sample_cross__sel', JSON.parse(params))
        // .map(response => response)
        .subscribe((data2: any) => {
            // const data2 = JSON.parse(data);
            ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

            // const errori = t.Utils.contaErrori(csv);
            // if (errori === 0) {
              // const righette = JSON.parse(csv);
              // // logConsole(righette);
              const righe = new Array();
              if (data2.DataTable !== null) {
                data2.DataTable.forEach(ele => {
                  // let ele = JSON.stringify(element.properties);
                  index = 1;
                  nomiMisure.forEach(element2 => {
                    let valore = JSON.parse(ele)['value_' + index];
                    if (+element2.type === 1 && valore !== null && valore && valore !== '') {
                      const ultimo = valore.substring(valore.length - 1, valore.length);
                      // // logConsole('Ultimo carattere:', ultimo);
                      if (ultimo === '.') {
                        valore = valore.substring(0, valore.length - 1);
                        // // logConsole(ele);
                        ele = JSON.parse(ele);
                        ele['value_' + index] = +valore;
                        ele = JSON.stringify(ele);
                        // // logConsole(ele);
                      }
                    }

                    ele = ele.replace('value_' + index, element2.name);
                    // // logConsole(ele);
                    index++;
                  });
                  righe.push(JSON.parse(ele));
                });
                // // logConsole(righe);
                PivotComponent.righePivot = righe;
                // // logConsole('Righe pivot', t.NumeroFrame, righe);

                this.disegnaPivotFine(t);
              }
              t.Utils.staGiaDisegnandoPivot[t.NumeroFrame] = false;
          }, error => {
            ExternalUtilities.messaggioDiErrore('null', error);
            return;
        });
        // } else {
        //   t.Utils.staGiaDisegnandoPivot[t.NumeroFrame] = false;
        // }
      } else {
        if (t.Utils.dimensioniFramesModif[t.NumeroFrame] !== t.Utils.dimensioniFrames[t.NumeroFrame]) {
          t.Utils.dimensioniFramesModif[t.NumeroFrame] = t.Utils.dimensioniFrames[t.NumeroFrame];
          this.disegnaPivotFine(t);
        }
        t.Utils.staGiaDisegnandoPivot[t.NumeroFrame] = false;
      }
    } else {
      t.Utils.staGiaDisegnandoPivot[t.NumeroFrame] = false;
    }
  }

  public disegnaPivotFine(t) {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      /* t.ng = new wjOlap.PivotEngine({
        itemsSource: righe
      }); // /
      // t.datiPivot = righe;
      // // logConsole('disegno pivot', t.viewDefinition2);
      if (t.viewDefinition2 !== undefined && t.viewDefinition2 !== '') {
        t.ngPanel = new wjOlap.PivotEngine({
          itemsSource: PivotComponent.righePivot,
          viewDefinition: t.viewDefinition2
        });
      } else {
        t.ngPanel = new wjOlap.PivotEngine({
          itemsSource: PivotComponent.righePivot,
        });
      }
    }, 100);
  }
}
*/

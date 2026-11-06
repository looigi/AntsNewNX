import { logConsole } from '../console-log';
import { ExternalApiService } from './../services/externalapi.service';
// import { GraficiComponent } from './grafici.component';
// import { GridDataResult } from '@progress/kendo-angular-grid';
// import { Observable } from 'rxjs';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
// import TileWMS from 'ol/source/TileWMS.js';
// import Tile from 'ol/layer/Tile.js';
import { Injectable } from '@angular/core';
// import Utils from '../Utilities.component';
// import * as CanvasJS from '../js/canvasjs.min';
// import * as CanvasJS from '../../../../assets/js/canvasjs.min.js';
// import { GestioneGrafici } from './GestioneGrafici.component';
// import { environment } from '../../../../environments/environment';
import ExternalUtilities from '../ExternalUtilities.component';
// import { SessionService } from '../../../../db/session.service';
import download from 'downloadjs';  // Importa downloadjs
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { param } from 'jquery';

import { FineRichieste } from './fine-richieste';
@Injectable()
export class EventsComponent {
  destroy$ = new FineRichieste();

  // flagDebug = true;
  // lastCallCrossTab = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // static lastCallCrossTabMenoUno = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // static lastCallCrossTabMenoDue = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallEventi = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastCallES = undefined; // ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  // lastCall = ['', '', '', '', '', '', '', '', '', '',  ''];
  // lastCall2 = ['', '', '', '', '', '', '', '', '', '',  ''];
  // js3old = ['', '', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '', '', '', ''];
  // lastTms = ['', '', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '', '', '', ''];
  // haGiaFattoAutoFit = [false, false, false, false, false, false, false, false, false, false, false,
  //   false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  // appoEventSummary = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  // conta = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // ultimaFatta = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // primaVolta = true;
  // righeTotali = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // query = ['', '', '', '', '', '', '', '', '', '',  '', '', '', '', '', '', '', '', '', '', '', ''];
  // ultimoOffset;
  // vecchioOffset = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // lastTms2 = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  // lastTesto;

  /* ultimaVoltaTMS = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  ultimaVoltaTMS2 = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  ultimaVoltaTMS3 = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  ultimaVoltaTMS4 = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]; */
  vecchieColonne = new Array();

  constructor(
    // private sessionService: SessionService,
    private apiService: ExternalApiService,
    // private gestGrafici: GestioneGrafici
  ) {
    for (let i = 0; i <= 9; i++) {
      this.vecchieColonne.push('');
    }
  }

  GestisceLayerConSetSource = true;
  layerAttivo = ExternalUtilities.creaVettore(environment.quantePagine, false);
  // HO TOLTO LA GESTIONE IN QUANTO NON RIDISEGNAVA PIU' NULLA DOPO IL RESIZE 26/05/2025

  pulisceAppoggi(t) {
    // if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulisco valori di appoggio per gli eventi. Frame ' + t.NumeroFrame2);
    // }
    this.destroy$.ferma(t);

    this.layerAttivo[t.NumeroFrame2] = false;
    if (t.pathEvents && t.pathEvents[t.NumeroFrame2]) {
      t.removeLayerFromMap('Events', t.pathEvents[t.NumeroFrame2]);
    }

    t.erroreEventSummary[t.NumeroFrame2] = '';
    t.lastCallCrossTab[t.NumeroFrame2] = '';
    t.lastCallES[t.NumeroFrame2] = '';
    t.lastCallLista[t.NumeroFrame2] = '';
    t.lastCallEventi[t.NumeroFrame2] = '';
    t.appoEventSummary[t.NumeroFrame2] = '';
    t.righeTotali[t.NumeroFrame2] = -1;
    t.datiEventSummary = 'empty grid';
    t.contaEvent[t.NumeroFrame2] = -1;
    t.puliziaES[t.NumeroFrame2] = new Date().toString();
    t.js3old[t.NumeroFrame2] = '';
    t.lastTms[t.NumeroFrame2] = '';
    t.vecchiDatiEventi = undefined;
    t.grigliaListaAgentpresente = false;
    t.selezioneAgent[t.NumeroFrame2] = undefined;
    t.datiAgents = 'empty grid';
    t.pathEvents[t.NumeroFrame2] = undefined;
    t.vecchioIdSelezionatoAE = undefined;
    this.vecchieColonne[t.NumeroFrame2] = '';
    
    t.puliziaAE[t.NumeroFrame2] = new Date().toString();
    t.datiPointActivityEvents = 'empty grid';

    const nome = 'gridAgents_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento = document.getElementById(nome) as HTMLElement;
    if (elemento) {
      elemento.outerHTML = '';
      elemento.innerHTML = '';
      elemento.remove();
    }

    const nome2 = 'gridDatiPointActivityEvents_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento2 = document.getElementById(nome2) as HTMLElement;
    if (elemento2) {
      elemento2.outerHTML = '';
      elemento2.innerHTML = '';
      elemento2.remove();
    }

    const nome3 = 'gridEventSummary_' + t.NumeroFrame2 + '_' + t.frameAttivo2;
    const elemento3 = document.getElementById(nome3) as HTMLElement;
    if (elemento3) {
      elemento3.outerHTML = '';
      elemento3.innerHTML = '';
      elemento3.remove();
    }
  }

  prendeDettaglioEvents(t, chiave, id, history_id) {
    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /* let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    }
    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'AE' || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno dettaglio events', t.NumeroFrame2);
      }
      return;
    } */

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, chiave);
    let a = new Date().getTime();
    if (chiave !== '' && chiave !== null) {
      t.caricamentoEventi2InCorso[t.NumeroFrame2] = true;
      const act_set = ExternalUtilities.ritornaStringPerActivitySetAGrafici(t, t.Utils);
      // const indirizzo = Utils.serverPostRest +
      //   '/v_act_networkevent_text?event_row_id=eq.' + chiave + '&geo_act_name=eq.' + act_set;

      const params = '{' +
        '"cntx_id": "' + t.sessionID2 + '",' +
        '"v_act_id": ' + id + ',' +
        '"v_event_row_id": ' + chiave + ',' +
        '"v_file_hist_id": ' + history_id + '' +
      '}';
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params);
      // if (t.Utils.lastCall[t.frameAttivo][t.NumeroFrame2] !== params) {
      //   t.Utils.lastCall[t.frameAttivo][t.NumeroFrame2] = params;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dettaglio events', t.NumeroFrame, params);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Geo Event Text Sel', t.NumeroFrame, params);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lettura dettaglio eventi', new Date().getTime() - a);
      a = new Date().getTime();
      this.apiService.chiamataPost(t.Utils, 'geo_event_text__sel', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))        
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Letti dettaglio eventi', new Date().getTime() - a);
        a = new Date().getTime();
        if (data2 && data2 !== null) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Eventi:', t.NumeroFrame, data2);

          if (data2 && data2[0] && data2[0].antsgeo_event_text_to_json) {
            let tt = data2[0].antsgeo_event_text_to_json;
            if (tt) {
              // while (tt.indexOf('"},]') > - 1) {
              //   tt = tt.replace('"},]', '"}]');
              // }
              // while (tt.indexOf(String.fromCharCode(13)) > - 1) {
              //   tt = tt.replace(String.fromCharCode(13), '');
              // }

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, params, tt);
              // return;

              /* let testo = '';
              if (tt && tt !== null && tt !== '') {
                let errore = '';
                try {
                  testo = JSON.parse(tt);
                } catch (e) {
                  errore = e.toString();
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nel parse del testo:', e, tt);
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e);
                }
                if (errore !== '' && errore.indexOf('Unexpected token } in JSON') > -1) {
                  const pos = errore.substring(errore.indexOf('Unexpected token } in JSON') + 25, errore.indexOf('Unexpected token } in JSON') + 50);
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, pos);
                  const position = +pos.substring(pos.indexOf('at position ') + 12, pos.indexOf('at position ') + 50);
                  tt = tt.substring(0, position);
                  try {
                    testo = JSON.parse(tt);
                  } catch (e) {
                    errore = e.toString();
                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nel parse del testo:', e, tt);
                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e);
                  }
                } else {
                  if (errore !== '' && errore.indexOf('Unexpected token ] in JSON') > -1) {
                    const pos = errore.substring(errore.indexOf('Unexpected token ] in JSON') + 25, errore.indexOf('Unexpected token ] in JSON') + 50);
                    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, pos);
                    const position = +pos.substring(pos.indexOf('at position ') + 12, pos.indexOf('at position ') + 50);
                    tt = tt.substring(0, position);
                    try {
                      testo = JSON.parse(tt);
                    } catch (e) {
                      errore = e.toString();
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nel parse del testo:', e, tt);
                      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, e);
                    }
                    if (errore !== '') {
                      let conta = 0;
                      let errore2 = '';
                      let mess = '';
                      while (conta < 100) {
                        try {
                          tt += ' ^}]';
                          testo = JSON.parse(tt);
                          conta = 999;
                          errore2 = '';
                          mess = '';
                        } catch (e) {
                          errore2 = e;
                          mess = tt;
                          conta++;
                        }
                      }
                      if (errore2 !== '') {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nel parse del testo:', errore2, mess);
                      }
                    }
                  } else {
                    if (errore !== '') {
                      let conta = 0;
                      let errore2 = '';
                      let mess = '';
                      while (conta < 150) {
                        try {
                          tt += ' }]';
                          testo = JSON.parse(tt);
                          conta = 999;
                          errore2 = '';
                          mess = '';
                        } catch (e) {
                          errore2 = e;
                          mess = tt;
                          conta++;
                        }
                      }
                      if (errore2 !== '') {
                        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Errore nel parse del testo:', errore2, mess);
                      }
                    }
                  }
                }
              }
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Fatto parse del testo', new Date().getTime() - a);
              a = new Date().getTime(); */

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, testo);
              if (tt === '') {
                tt = null;
              }
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, JSON.stringify(tt));
              t.testoDettaglioEventi = tt;
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tt);
              // this.apreRami(t);

              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Aperti rami', new Date().getTime() - a);
              a = new Date().getTime();

              // this.lastTesto = testo;
              t.caricamentoEventi2InCorso[t.NumeroFrame2] = false;
            } else {
              t.testoDettaglioEventi = null;
              t.caricamentoEventi2InCorso[t.NumeroFrame2] = false;
            }
          } else {
            t.testoDettaglioEventi = null;
            t.caricamentoEventi2InCorso[t.NumeroFrame2] = false;
          }
          t.caricamentoEventi2InCorso[t.NumeroFrame2] = false;
        } else {
          t.testoDettaglioEventi  = null;
          t.caricamentoEventi2InCorso[t.NumeroFrame2] = false;
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        // console.error('POST ERROR: ', error, error.message);
        t.testoDettaglioEventi = 'ERROR: ' + error?.message;

        t.caricamentoEventi2InCorso[t.NumeroFrame2] = false;
      });
      // } else {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Già caricati');
        // t.testoDettaglioEventi = this.lastTesto;
      //   t.caricamentoEventi2InCorso= false;
      // }
    }
  }

  apreRami(t) {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.treeViewAE);
      t.conta[t.frameAttivo2] = 0;
      this.expandAllTranneHeader(t, t.treeViewAE.nodes);
    }, 100);
  }

  expandAllTranneHeader(t, nodo) {
    if (nodo !== null) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nodo);
      nodo.forEach(element => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
        // this.nodi.push(JSON.parse(JSON.stringify(element.text)));
        if (element.text.toUpperCase().indexOf('HEADER') > -1) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Collassa', element.text);
          t.treeViewAE.collapseNode(element, t.conta[t.frameAttivo2]);
          t.conta[t.frameAttivo2]++;
          if (element.items && element.items.length > 0) {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element.items);
            this.expandAllTranneHeader(t, element.items);
          }
        } else {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Espande', element.text);
          t.treeViewAE.expandNode(element, t.conta[t.frameAttivo2]);
          t.conta[t.frameAttivo2]++;
          if (element.items && element.items.length > 0) {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element.items);
            this.expandAllTranneHeader(t, element.items);
          }
        }
      });
    }
  }

  espandeTuttiINodi(t) {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.treeViewAE);
      t.conta[t.frameAttivo2] = 0;
      // this.expandAll(t, t.treeViewAE.nodes);
      this.expandAll(t);
    }, 100);
  }

  collassaTuttiINodi(t) {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.treeViewAE);
      // this.conta = 0;
      // this.collapseAll(t, t.treeViewAE.nodes);
      t.listaEspansa = false;
    }, 100);
  }

  expandAll(t) {
    /* if (nodo !== null) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nodo);
      nodo.forEach(element => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
        // this.nodi.push(JSON.parse(JSON.stringify(element.text)));
        t.treeViewAE.expandNode(element, this.conta);
        this.conta++;
        if (element.items && element.items.length > 0) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element.items);
          this.expandAll(t, element.items);
        }
      });
    } */
    const tm = setTimeout(() => {
      clearTimeout(tm);
      
      t.listaEspansa = true;
    }, 100);
  }

  collapseAll(t, nodo) {
    if (nodo !== null) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, nodo);
      nodo.forEach(element => {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
        // this.nodi.push(JSON.parse(JSON.stringify(element.text)));
        t.treeViewAE.collapseNode(element, t.conta[t.frameAttivo2]);
        t.conta[t.frameAttivo2]++;
        if (element.items && element.items.length > 0) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element.items);
          this.collapseAll(t, element.items);
        }
      });
    }
  }

  checkUndefined(c) {
    if (!c || c === undefined || c === 'undefined' || c === null) { // ||
      // !c[n] || c[n] === undefined || c[n] === 'undefined' || c[n] === null) {
      return '';
    } else {
      return c;
    }
  }

  prendeListaAgents(t) {
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lettura agents 2', t.NumeroFrame2);
    // logConsole('Lettura agents 1', t.tipoEvento);

    if (t.tipoEvento !== 'G') {
    // if (t.tipoEvento === 'GGGG') { // PER TEST
      t.grigliaListaAgentpresente = false;
      t.selezioneAgent[t.NumeroFrame2] = undefined;
      t.datiAgents = 'empty grid';
    } else {
      let sInizio = '';
      let sFine = '';
  
      if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
        if (!t.Utils.tmsSelezionato || t.Utils.tmsSelezionato === null || t.Utils.tmsSelezionato === '') {
          t.grigliaListaAgentpresente = false;
          t.selezioneAgent[t.NumeroFrame2] = undefined;
          t.datiAgents = 'empty grid';
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da lettura agents 1', t.NumeroFrame2);

          // logConsole('Lettura agents esco 1');

          return;
        }
  
        sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
        sFine = t.Utils.tmsFine; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
      } else {
        sInizio = t.timeRangeDSFStart2;
        sFine = t.timeRangeDSFStop2;
      }

      if (!sInizio || !sFine || sInizio === 'undefined' || sInizio === '"undefined"' || sFine === 'undefined' || sFine === '"undefined"'
        || sInizio === null || sInizio === 'null' || sInizio === '"null"' || sFine === null || sFine === 'null' || sFine === '"null"') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da lettura agents 2', t.NumeroFrame2);

        // logConsole('Lettura agents esco 2', sInizio, sFine);

        return;
      }

      const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

      const params = '{' +
        '"cntx_id": "' + t.sessionID2 + '",' +
        '"v_act_set_name_list": "' + t.act_set + '",' +
        '"v_event_type_list": "TcRun_Outcome",' +
        '"v_tms_min": "' + sInizio + '",' +
        '"v_tms_max": "' + sFine + '",' +
        '"v_bbox": "' + geoFilter + '"' +
      '}';
      const actualCall = t.act_set + ';' + params + ';' + t.columnsSettings + ';';

      // logConsole('Lettura agents parametri', JSON.parse(params));
    
      if (actualCall !== t.lastCallLista[t.NumeroFrame2]) {
        t.lastCallLista[t.NumeroFrame2] = actualCall;

        t.selezioneAgent[t.NumeroFrame2] = undefined;
        t.selezioneAgentID[t.NumeroFrame2] = undefined;
  
        this.apiService.chiamataPost(t.Utils, 'geo_act_set_summary__grid', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$.per(t)))        
        .subscribe((data2: any) => {
          if (data2 && data2 !== null) {
            ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

            if (data2.v_grid_msg !== undefined) {
              t.messaggioWarningAG = data2.v_grid_msg;
            } else {
              t.messaggioWarningAG = '';
            }

            if (t.datiAgents !== undefined && t.datiAgents.DataTable
              && t.datiAgents !== 'empty grid' && data2.DataTable) {
                t.datiAgents.DataTable = data2.DataTable;
            } else {
              t.datiAgents = data2; // 'empty grid';

              /* const tm = setTimeout(() => {
                clearTimeout(tm);

                t.datiAgents = data2;

                t.effettuaAutoFitAE2 = !t.effettuaAutoFitAE2;
              }, 1000); */
            }  

            if (data2 && data2.DataTable) {
              const quanti = data2.DataTable.length;
              if (quanti > 1) {
                t.grigliaListaAgentpresente = true;
              } else {
                t.selezioneAgent[t.NumeroFrame2] = data2.DataTable[0];
                t.grigliaListaAgentpresente = false;
              }
            }
            // logConsole('Griglia agents', t.grigliaListaAgentpresente);

            let agnact;

            if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
              agnact = '';
            } else {
              // agnact = '"' + ExternalUtilities.stringaAGNoACT + '"';
              if (ExternalUtilities.stringaAGNoACT !== undefined && ExternalUtilities.stringaAGNoACT !== null) {
                if (ExternalUtilities.stringaAGNoACT.indexOf('\'') === -1 && ExternalUtilities.stringaAGNoACT.indexOf('"') === -1) {
                  agnact = '"' + ExternalUtilities.stringaAGNoACT + '"';
                } else {
                  if (ExternalUtilities.stringaAGNoACT.indexOf('\'') > -1) {
                    agnact = ExternalUtilities.stringaAGNoACT.replace('\'', '"').replace('\'', '"');
                  } else {
                    agnact = ExternalUtilities.stringaAGNoACT;
                  }
                }
              } else {
                agnact = '';
              }
            }
            logConsole('Dati agents', t.datiAgents);
            if (t.datiAgents !== 'empty grid' && t.datiAgents) {
              t.datiAgents.DataTable.forEach(element => {
                if (agnact.indexOf(element.AGN_CODE) > -1) {
                  t.selezioneAgent[t.NumeroFrame2] = element;
                  t.selezioneAgentID[t.NumeroFrame2] = element.ROW_ID;
                }
              });
            }
          } else {
            t.grigliaListaAgentpresente = false;
            t.selezioneAgent[t.NumeroFrame2] = undefined;
            t.datiAgents = 'empty grid';
          }
        });
      } else {
      }
    }
  }

  tmsPartenza;
  tmsArrivo;

  prendeEvents(t, soloAggiornamentoDati, caricaDettaglio, modalitaExport) {
    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      // logConsole('Esco ae 1');

      return;
    }

    if (t.MappaOGrafico2 !== 'AE') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo Events', t.NumeroFrame2, t.MappaOGrafico2);
      // logConsole('Esco ae 2');
      return;
    }
    
    if (t.pausaRealTimeAttiva) {
      this.tmsPartenza = t.Utils.tmsInizioPausa;
      this.tmsArrivo = t.Utils.tmsFinePausa;
    } else {
      this.tmsPartenza = t.Utils.tmsInizio;
      this.tmsArrivo = t.Utils.tmsFine;
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prende eventi', t.NumeroFrame, t.timeFilter, t.Utils.tmsSelezionato, t.frameVisible2);

    // 2022 11 11 Abbiamo deciso di far rinfrescare SEMPRE il frame per evitare che quando c'è una finestra
    // massimizzata non si aggiorni
    /*     let aperto = true;
    if (t.frameVisible2 === false) { //  && t.NumeroFrame2 > 3) {
      aperto = false;
    } */

    /* if (// t.staDisegnandoEventi[t.frameAttivo2]) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Uscito da events 0', t.NumeroFrame2, // t.staDisegnandoEventi[t.frameAttivo2]);
      }
      return;
    }

    if (t.MappaOGraficoTutti2[t.frameAttivo2] !== 'AE') { // || aperto === false) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Uscito da events 1', t.NumeroFrame2);
      }
      return;
    } */

    // if (t.MappaOGrafico2 !== 'AE' || // t.staDisegnandoEventi[t.frameAttivo2] === true ||
    if (t.MappaOGrafico2 !== 'AE' ||
        (t.timeFilter !== 1 && t.Utils.tmsSelezionato === undefined)) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Uscito da events 2', t.NumeroFrame, t.timeFilter, t.Utils.tmsSelezionato);
      // logConsole('Esco ae 3');
      return;
    }


    let agnact = '';
    /* if (t.tipoDataset2 === 1) {
      if (!t.act_set || t.act_set === '') {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR Data. ACT SET Vuoto. Esco', t.NumeroFrame2);
        }
        t.datiCellMeasure = 'empty grid';
        return;
      }
    } else { */

    if (!t.selezioneAgent[t.NumeroFrame2] && t.datiAgents && t.datiAgents.DataTable) {
      let agnact2;
      if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
        agnact2 = '';
      } else {
        agnact2 = '"' + ExternalUtilities.stringaAGNoACT + '"';
      }            
      // // logConsole('EVENTI. Cerco agnact', t.NumeroFrame2, t.datiAgents.DataTable, agnact2);
      t.datiAgents.DataTable.forEach(element => {
        if (agnact2.indexOf(element.AGN_CODE) > -1) {
          // // logConsole('EVENTI. Trovato agnact', t.NumeroFrame2, element);
          t.selezioneAgent[t.NumeroFrame2] = element;
          t.selezioneAgentID[t.NumeroFrame2] = element.ROW_ID;
        }
      });
    }

    if (t.selezioneAgent[t.NumeroFrame2]) {
      if (t.selezioneAgent[t.NumeroFrame2].AGN_CODE) {
        agnact = '[AGN] ' + t.selezioneAgent[t.NumeroFrame2].AGN_CODE;
      } else {
        if (t.selezioneAgent[t.NumeroFrame2][0].AGN_CODE) {
          agnact = '[AGN] ' + t.selezioneAgent[t.NumeroFrame2][0].AGN_CODE;
        } else {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Uscito da events per selezioneAgent non valida', t.NumeroFrame, t.selezioneAgent[t.NumeroFrame2]);
          // logConsole('Esco ae 4');

          return;
        }
      }
      // // logConsole('EVENTI. Impostato agnact', t.NumeroFrame2, agnact);
    } else {
      // // logConsole('EVENTI. Nullo agnact', t.NumeroFrame2);
      if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
        agnact = 'null';
      } else {
        if (ExternalUtilities.stringaAGNoACT !== undefined && ExternalUtilities.stringaAGNoACT !== null) {
          if (ExternalUtilities.stringaAGNoACT.indexOf('\'') === -1 && ExternalUtilities.stringaAGNoACT.indexOf('"') === -1) {
            agnact = '"' + ExternalUtilities.stringaAGNoACT + '"';
          } else {
            if (ExternalUtilities.stringaAGNoACT.indexOf('\'') > -1) {
              agnact = ExternalUtilities.stringaAGNoACT.replace('\'', '"').replace('\'', '"');
            } else {
              agnact = ExternalUtilities.stringaAGNoACT;
            }
          }
        } else {
          agnact = 'null';
        }
      }
      if (ExternalUtilities.stringaAGNoACT === undefined) {
        // t.datiPointActivityEvents = 'empty grid';
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Uscito da events 4', t.NumeroFrame);
        // logConsole('Esco ae 5');

        return;
      }
    }
    // }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events:  AGNACT: ', agnact);

    // const tms = t.Utils.tmsSelezionato;

    const d1 = new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime();
    const tms = t.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame , tms);

    let sInizio = '';
    let sFine = '';
    let filtro = '';
    let timeRangeAll = false;

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.tmsSelezionato, t.Utils.rangeDiSecondiPerMille);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.timeFilter, t.Utils.tmsSelezionato, t.Utils.tmsInizio, t.Utils.tmsFine);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Time filter eventi', t.timeFilter, t.timeFilter2);

    if (+t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      timeRangeAll = false;
      if (this.tmsPartenza && this.tmsArrivo) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.tmsInizio, t.Utils.tmsFine);
        sInizio = this.tmsPartenza; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
        sFine = this.tmsArrivo; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
        filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;
      } else {
        // t.datiPointActivityEvents = 'empty grid';
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Uscito da events 3', t.NumeroFrame);
        // logConsole('Esco ae 6');

        return;
      }
    } else {
      if (+t.timeFilter === 3 || t.timeFilter2 === 'Fixed Seconds') {
        timeRangeAll = false;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.Utils.tmsSelezionato);
        // if (t.Utils.tmsSelezionato) {
        const vecchioRange = t.Utils.lastRangeEventi[t.frameAttivo][t.NumeroFrame2];
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime(), t.fixedSeconds2, vecchioRange);
        if (vecchioRange !== null && new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime() >= vecchioRange.min &&
          new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime() < vecchioRange.max &&
          vecchioRange.fixed === t.fixedSeconds2) {
          sInizio = t.datePipe.transform(vecchioRange.min, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
          sFine = t.datePipe.transform(vecchioRange.max, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
          filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Interno al vecchio range', t.NumeroFrame, sInizio, sFine);
        } else {
          const fs = t.fixedSeconds2 * 1000;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, new Date(t.Utils.tmsSelezionato.replace('Z', ' ').replace('T', ' ') + ' UTC+00').getTime(), t.fixedSeconds2);
          const dInizio = ((new Date(t.Utils.tmsSelezionato.replace('Z', ' ').replace('T', ' ') + ' UTC+00').getTime()));
          sInizio = t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
          const dFine = ((new Date(t.Utils.tmsSelezionato.replace('Z', ' ').replace('T', ' ') + ' UTC+00').getTime()) + fs);
          sFine = t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
          filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esterno al vecchio range', t.NumeroFrame, t.fixedSeconds2, sInizio, sFine);

          const a = { min: dInizio, max: dFine, fixed: t.fixedSeconds2 };
          t.Utils.lastRangeEventi[t.frameAttivo][t.NumeroFrame2] = a;
        }
        // } else {
        //   t.datiPointActivityEvents = 'empty grid';
        //   return;
        // }
      } else {
        timeRangeAll = true;
        filtro = '';
        // sInizio = '1970-01-01 00:00:00';
        // sFine = '3999-12-31 23:59:59';
        sInizio = t.timeRangeDSFStart2;
        sFine = t.timeRangeDSFStop2;
      }
    }
    if (sInizio === null || sFine === null || sInizio === undefined || sFine === undefined) {
      // t.datiPointActivityEvents = 'empty grid';
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito da events 4', t.NumeroFrame);
      // logConsole('Esco ae 7');
      return;
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'TIME START END', sInizio, sFine);

    let eventi = '';
    let eventiSE = '';
    const tipoEvento = t.tipoEvento2;

    /* logConsole('EVENTI SE. Tipo evento', tipoEvento);
    logConsole('EVENTI SE. List1', t.listaEventiDaPassare2);
    logConsole('EVENTI SE. List2', t.Utils.listaEventiSE);
    logConsole('EVENTI SE. List2', t.eventiSceltiES2); */

    if (tipoEvento === 'A') {
      eventi = 'ALL';
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Lista eventi all', t.NumeroFrame2);
    } else {
      let lista = null;
      let lep = null;
      if (tipoEvento === 'L') {
        lista = t.listaEventiDaPassare2;
        lep = ExternalUtilities.converteStringaInJSON(lista);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Lista eventi locale', t.NumeroFrame2, lep);
      } else {
        if (tipoEvento === 'S') {
          if (t.eventiSceltiESGlobali2) {
            // logConsole('Eventi scelti Globali ES', t.eventiSceltiESGlobali2);
            t.eventiSceltiESGlobali2.forEach(element => {
              if (element && element.act_id && element.ROW_ID) {
                eventiSE += element.act_id + '|' + element.ROW_ID + ',';
              }
            });
          }
          if (eventiSE.length > 0) {
            eventiSE = eventiSE.substring(0, eventiSE.length - 1);
          }
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Lista eventi selected events', t.NumeroFrame2, eventiSE);
        } else {
          lista = t.eventiSceltiES2;
          lep = lista;
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Lista eventi globale', t.NumeroFrame2, lep);
        }
      }

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per eventi:', lista, lep);
      if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep.length > 0) {
        lep.forEach(element => {
          if (element.EVENT_TYPE && element.EVENT_TYPE !== undefined && element.EVENT_TYPE !== 'undefined') {
            eventi += element.EVENT_TYPE + ',';
          }
        });
      }
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Lista Eventi:', t.NumeroFrame2, eventi);
      // alert('EVENTI 2: ' + eventi);
      if (eventi && eventi.length > 0) {
        eventi = eventi.substring(0, eventi.length - 1);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, eventi);
      } else {
        if (tipoEvento === 'G') {
          // eventi = 'NONE';
          eventi = 'ALL'; // MAIL 24/11/2023 09:11
        } else {
          if (tipoEvento === 'S') {
            eventi = 'NONE';
          } else {
            eventi = 'ALL';
          }
        }
      }
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Lista eventi finale', t.NumeroFrame2, eventi);

      if ((lista === undefined || lista === 'undefined') && eventiSE === '') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Esco da events per lista eventi vuota');

        // logConsole('Esco ae 8');
        return;
      }      
    }

    // logConsole('EVENTI SE. Lista da passare', eventi);

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi', eventi);

      /* t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.frameAttivo);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.tipoEvento2);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, eventi);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lista);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lep);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_id);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, sInizio, sFine); */

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Accendo flag staGiaDisegnando');
    // // t.staDisegnandoEventi[t.frameAttivo2] = true;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Prende events:', filtro);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'ACTIVITY SET:', act_set);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Filtro per eventi:', filtro);
    const propertyName = '';
    // '&select=event_row_id,tms,event_type,status,info_01,info_02,info_03,info_04,info_05,info_06,info_07,info_08';

      // t.testoDettaglioEventi = null;

      // let nomeFunzione = 'antsgeo_get_event_crosstab_name';
      // let nomeCampoAct = 'act_name';
      // let prefisso = '';
      // if (t.Activity2 === -1) {

      // const nomeFunzione = 'antsgeo_get_event_crosstab';
    const nomeFunzione = 'antsgeo_get_event_crosstab8';
    const nomeCampoAct = 'v_act_set_name_list';
    const prefisso = 'v_';
    // }

    let delta = null;
    // if (timeRangeAll !== true) {
    delta = t.Utils.tmsDelta;
    if (!delta || delta === undefined || delta === 'undefined' || delta === '"undefined"') {
      delta = null;
    }
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: delta', delta);

    if (delta !== null) {
      delta = '"' + delta + '"';
      // if (offset === -3) {
      //   offset = -1;
      // }
    }
    // }

    let tms2 = '"' + t.Utils.tmsSelezionato + '"'; // '';
    if (!tms2 || tms2 === '' || tms2 === 'undefined' || tms2 === '"undefined"' || tms2 === '\'undefined\'') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Esco da events per tms current non definito', tms2);

      // logConsole('Esco ae 9');
      return;
    }

    if (agnact === undefined || agnact === 'undefined') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Esco da events per agnact vuoto', agnact);
      
      // logConsole('Esco ae 10');
      return;
    }
    let valoreRicerca = agnact; //  ExternalUtilities.effettuaReplace(agnact, '\'', '');
    while (valoreRicerca.indexOf('\'') > -1) {
      valoreRicerca = valoreRicerca.replace('\'', '');
    }
    // valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '"', '');
    while (valoreRicerca.indexOf('"') > -1) {
      valoreRicerca = valoreRicerca.replace('"', '');
    }
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Valore agnact, ricerca', agnact, valoreRicerca);
  // }

  // // logConsole('AGNACT', t.NumeroFrame2, valoreRicerca);

    if (!valoreRicerca || valoreRicerca === '') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Esco da events per valore ricerca vuoto');
      // logConsole('Esco ae 11');

      return;
    }

    let filtroEventi = '';
    let filtroEscluso = '';
    let columnCompressed = 'Y';
    if (t.filtriEventi2) {
      filtroEventi = t.filtriEventi2.filtroImpostato;
      filtroEscluso = t.filtriEventi2.filtroEscluso;
      columnCompressed = t.filtriEventi2.columnCompressed === undefined ? 'Y' : t.filtriEventi2.columnCompressed === true ? 'Y' : 'N';
    }

    if (!filtroEventi || filtroEventi === 'undefined') {
      filtroEventi = '';
    }
    if (!filtroEscluso || filtroEscluso === 'undefined') {
      filtroEscluso = '';
    }
    /* while (filtroEventi.indexOf('"') > -1) {
      filtroEventi = filtroEventi.replace('"', '§*§');
    }
    while (filtroEventi.indexOf('§*§') > -1) {
      filtroEventi = filtroEventi.replace('§*§', '""');
    }
    while (filtroEventi.indexOf('\'') > -1) {
      filtroEventi = filtroEventi.replace('\'', '""');
    } */

    let rt = (t.timerAttivatoAuto2 ? 'Y' : 'N');
    if (t.pausaRealTimeAttiva) {
      rt = 'P';
    }

    let filtri = '';
    if (t.filtriEventi2) {
      let i = 0;
      t.filtriEventi2.filtriAttivi.forEach(element => {
        if (i+1 < 21) {
          let ii = (i+1).toString().trim();
          if (ii.length === 1) { ii = '0' + ii; }
          if (element.Campo) {
            const filtro = this.checkUndefined(element.Campo);
            filtri += '"' + prefisso + 'prm_' + ii + '": "' + filtro + '", ';
            if (element.NomeColonna && element.NomeColonna !== null) {
              const nomeColonna = this.checkUndefined(element.NomeColonna);
              filtri += '"' + prefisso + 'prm_' + ii + '_name": "' + nomeColonna + '", ';
            } else {
              filtri += '"' + prefisso + 'prm_' + ii + '_name": null, ';
            }
          } else {
            filtri += '"' + prefisso + 'prm_' + ii + '": "", ';
            filtri += '"' + prefisso + 'prm_' + ii + '_name": null, ';
          }
        }
        i++;
      });

      // // logConsole('FILTRI', t.filtriEventi2.filtriAttivi, filtri);
    } else {
      for (let i = 1; i < 21; i++) {
        let ii = i.toString().trim();
        if (ii.length === 1) { ii = '0' + ii; }
        filtri += '"' + prefisso + 'prm_' + ii + '": "", ';
        filtri += '"' + prefisso + 'prm_' + ii + '_name": null, ';
      }
    }
    filtri += '"v_col_compressed": "' + columnCompressed + '", ';

    // // logConsole('EVENTI SE', eventiSE);

    t.tmsInizioEventi = sInizio;
    t.tmsFineEventi = sFine;
    t.actEventiPerAI = valoreRicerca;
    // alert('tms: ' + t.tmsInizioEventi + ' - ' + t.tmsFineEventi);

    let agnCod = "";
    // logConsole('AGN CODE', t.selezioneAgent[t.NumeroFrame2]);
    if (t.selezioneAgent[t.NumeroFrame2] && t.selezioneAgent[t.NumeroFrame2].AGN_CODE) {
      agnCod = t.selezioneAgent[t.NumeroFrame2].AGN_CODE;
    }

    let params = '{ ' +
      '"v_cntx": "' + t.sessionID2 + '",' +
      '"' + nomeCampoAct + '": "' + valoreRicerca + '", ' +
      '"v_tms_min": "' + sInizio + '", ' +
      '"v_tms_max": "' + sFine + '", ' +
      '"v_event_type_list": "' + eventi + '", ' +
      '"v_text_filter": "' + filtroEventi + '", ' +
      '"v_text_filter_exclude": "' + filtroEscluso + '", ' +
      // '"v_row_limit": ' + t.Utils.limitPerVirtual + ',' +
      filtri +
      '"v_report_event_text": "N", ' +
      '"v_format": "json", ' +
      '"v_event_list": "' + eventiSE + '", ' +
      '"v_real_time": "' + rt + '", ' +
      '"v_search_text": "' + t.ricercaJson + '", ' +
      '"v_agn_code_filter": ' + (!agnCod ? null : '"' + agnCod + '"') + ' '
      ; // +
    // ' }';

    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      params += ', "v_tms_zero": ' + delta + ' ';
    }

    if (modalitaExport === true) {
      params += ', "v_format": "export" ';
    }

    /*  */
    /* let campiVisualizzatiSTR = '';
    for (let index = 0; index <= 9; index++) {
      if (t.columnsSettings2 && t.columnsSettings2 !== null) {
        const element = t.columnsSettings2[index];
        if (element && element !== 'undefined' && element !== undefined && element !== null && element !== '') {
          campiVisualizzatiSTR += 'value_str_0' + (index + 1) + ',';
        }
      }
    }
    if (campiVisualizzatiSTR.length > 0) {
      campiVisualizzatiSTR = ',' + campiVisualizzatiSTR.substring(0, campiVisualizzatiSTR.length - 1);
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activity Events', t.NumeroFrame, t.frameAttivo, params);
    const campiVisualizzati = 'event_row_id,act_id,file_hist_id,tms,tms_delta,event_type,status,info,source,' +
      'destination,net_tech,protocol,sub_chan,bck_color,fore_color,tck_title,tck_description,tck_status' +
      campiVisualizzatiSTR; */

    // // logConsole('EVENTS PARAMS ' + t.NumeroFrame2 + ': ', JSON.parse(params + '}'));

    const actualCall = nomeFunzione + ';' + valoreRicerca + ';' + params + ';' + filtro + ';' + eventi + ';' + t.columnsSettings + ';' +
        propertyName + ';'; // + tms2;

    // } else {
    //   this.ultimoOffset = offset;
    // }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lettura Events', t.NumeroFrame, EventsComponent.lastCallCrossTab);

    // params += ', "v_row_offset": ' + offset + ' ';

    let prosegui = true;
    let controllaTMS = true;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Confronto per altro', t.NumeroFrame2, actualCall !== t.lastCallCrossTab[t.NumeroFrame2]);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Confronto per altro actualCall', t.NumeroFrame2, actualCall);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Confronto per altro lastCross', t.NumeroFrame2, t.lastCallCrossTab[t.NumeroFrame2]);

    /* // logConsole('Nuova', actualCall);
    // logConsole('Vecchia', t.lastCallCrossTab[t.NumeroFrame2]);
    // logConsole('Confronto', actualCall === t.lastCallCrossTab[t.NumeroFrame2]); */

    if (actualCall !== t.lastCallCrossTab[t.NumeroFrame2] || modalitaExport === true) {
      // logConsole('PARAMS Eventi 0-0', actualCall);
      // logConsole('PARAMS Eventi 0-1', t.lastCallCrossTab[t.NumeroFrame2]);

      t.lastCallCrossTab[t.NumeroFrame2] = actualCall;

      // prosegui = true;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, actualCall, EventsComponent.lastCallCrossTab[t.NumeroFrame2]);
      controllaTMS = false; // true
      // prosegui = false;
      /* if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      } else { 
        if (t.lastCallCrossTab[t.NumeroFrame2] !== '') {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Esco da events in quanto siamo ALL ed è arrivato solo il cambio delta');

          return;
        }
      } */
    } else {
      if (t.lastCallCrossTab[t.NumeroFrame2] !== '') {
        prosegui = false;

        t.creaIdEventi();

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Imposta prosegui falso perché la chiamata è uguale alla precedente', t.NumeroFrame2)
      }
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Parametri eventi', t.NumeroFrame2, params);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Offset eventi', offset);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Vecchio offset', this.vecchioOffset[t.NumeroFrame2]);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Prosegui', t.NumeroFrame2, prosegui);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Controlla TMS', t.NumeroFrame2, controllaTMS);

    // CONTROLLI:
    // se la chiamata è diversa, non deve eseguire il controllo sul tms
    // se la chiamata è uguale DEVE eseguire il controllo sul tms
    // dopo i controlli, deve aggiungere il tms current alla chiamata

    // if (prosegui === true && controllaTMS === true) {
    if (controllaTMS === true && prosegui === true) { // && tms2 !== this.lastTms2) {
      if (t.datiPointActivityEvents && t.datiPointActivityEvents.DataTable) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Lista dati ', t.NumeroFrame2, t.datiPointActivityEvents.DataTable);
        let primo = t.datiPointActivityEvents.DataTable[0].tms;
        let ultimo = t.datiPointActivityEvents.DataTable[t.datiPointActivityEvents.DataTable.length - 1].tms;
        /* t.datiPointActivityEvents.DataTable.forEach(element => {
          ultimo = element.tms;
        }); */

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Inizio', t.datiPointActivityEvents.DataTable[0].tms, primo);
        const primo2 = new Date(primo).getTime();
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Inizio convertito', primo2);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Fine', t.datiPointActivityEvents.DataTable[t.datiPointActivityEvents.DataTable.length - 1].tms, ultimo);
        const ultimo2 = new Date(ultimo).getTime();
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Fine convertito', ultimo2);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Attuale', tms2.replace('"', '').replace('"', ''));
        const ttms = new Date(tms2.replace('"', '').replace('"', '') + '.000').getTime();
        const ttmsFloor = new Date(tms2.replace('"', '').replace('"', '') + '.000').getTime();
        const ttmsCeil = new Date(tms2.replace('"', '').replace('"', '') + '.999').getTime();
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Attuale convertito', ttms);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Differenza con inizio:', ttms1 < primo2);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Differenza con fine:', ttms1 > ultimo2);

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Blocco Tms Inizio: ', t.NumeroFrame2, primo, primo2);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Blocco Tms Fine: ', t.NumeroFrame2, ultimo, ultimo2);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Blocco Tms Attuale: ', t.NumeroFrame2, tms2.replace('"', '').replace('"', ''), ttms);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Blocco Tms Attuale Floor: ', t.NumeroFrame2, ttmsFloor);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Blocco Tms Attuale Ceil: ', t.NumeroFrame2, ttmsCeil);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Blocco Primo controllo: ', t.NumeroFrame2, (+primo2 >= +ttmsFloor && +primo2 <= +ttmsCeil));
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Blocco Secondo controllo: ', t.NumeroFrame2, (+ttms > +primo2 && +ttms < +ultimo2));
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Blocco Terzo controllo: ', t.NumeroFrame2, (+ultimo2 >= +ttmsFloor && +ultimo2 <= +ttmsCeil));

        if ((+primo2 >= +ttmsFloor && +primo2 <= +ttmsCeil) ||
            (+ttms > +primo2 && +ttms < +ultimo2) ||
            (+ultimo2 >= +ttmsFloor && +ultimo2 <= +ttmsCeil)) {
          prosegui = false;

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Blocco l\'esecuzione per tms interno ai dati già caricati', t.NumeroFrame2);
        // } else {
        //   this.lastTms2 = tms2;
        }
      }
    }

    if (prosegui === false) {
      if (t.tipoEvento === 'S') {
      } else {
        // MODIFICA PER MAIL 05/10/2002 08:18
        if (t.isNonSyncEventTime2 === false) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Esco per check NON attivo', t.NumeroFrame2);

          // t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
          // // t.staDisegnandoEventi[t.frameAttivo2] = false;
          // logConsole('Esco ae 12');
          return;
        } else {
          if (tms2 === t.lastTms[t.NumeroFrame2]) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Esco per time cursor uguale al precedente e check attivo', t.NumeroFrame2);

            // t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Spengo flag staGiaDisegnando 2', t.NumeroFrame2);

            // // t.staDisegnandoEventi[t.frameAttivo2] = false;
            // logConsole('Esco ae 13');
            return;
          }
        }
      }
      // MODIFICA PER MAIL 05/10/2002 08:18
    }
    t.lastTms[t.NumeroFrame2] = tms;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Accendo rondella eventi 1');

    if (prosegui === true) { // || offset === -1 || offset === -2) {
      // this.vecchioOffset[t.NumeroFrame2] = offset;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Events', t.NumeroFrame, nomeFunzione, params); // , offset, this.vecchioOffset[t.NumeroFrame2]);

      // if (offset !== -1 && offset !== -2) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Imposto ultima chiamata', t.NumeroFrame2);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Imposto ultima chiamata actual', actualCall);
        
        if (t.datiPointActivityEvents && typeof(t.datiPointActivityEvents) === 'string') {
          if (t.datiPointActivityEvents.indexOf('ERROR: ') > -1) {
            t.datiPointActivityEvents = undefined;
            t.lastCallCrossTab[t.NumeroFrame2] = undefined;
          }
        }
        
      // t.lastCallCrossTab[t.NumeroFrame2] = actualCall;

      t.pendings += 'Events<br />';
        
      if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      } else {
        params += ', "v_tms_zero": ' + delta + ' ';
      }
      params += ', "v_tms_current": ' + tms2 + ' ';

      t.chiSonoEventi[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params += ', "v_caller_tag": "' + t.chiSonoEventi[t.NumeroFrame2] + '" ';

      params += '}';
  
      logConsole('CHIAMATA EVENTI', t.NumeroFrame2, t.timeFilter, '*' + tms2 + '*', JSON.parse(params));

      t.caricamentoEventiInCorso[t.NumeroFrame2] = true;

      t.lastCallEventi2[t.NumeroFrame2] = JSON.parse(params);
      this.apiService.chiamataPost(t.Utils, '' + nomeFunzione, JSON.parse(params)) // + '?select=' + campiVisualizzati
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))        
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

        if (!t.controllaRitornoChiamata(t, data2, 'Eventi')) {
          t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Spengo rondella eventi 5-2');

          return;
        }

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Ritorno CrossTab Name:', t.NumeroFrame, data2);

        if (modalitaExport === true) {
          t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
          logConsole('Ritorno export', data2);

          let mimeType = 'application/json';
          const jsonString = JSON.stringify(data2.DataTable, null, 2);
          const blob = new Blob([jsonString], { type: mimeType });

          let tmsInizio = sInizio.replace(/[:\s]/g, '_');
          let nomeGriglia = this.sanitizeFileName(data2.GridProperty[0].GridName);
          let nomeFile = `${nomeGriglia}_${tmsInizio}.json`;

          download(blob, nomeFile, mimeType);

          return;
        }

        if (data2 && data2 !== null && data2.v_grid_msg && data2.v_grid_msg !== '') {
          t.warningAE = data2.v_grid_msg;

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events. Warning', t.NumeroFrame, t.warningAE);
        } else {
          t.warningAE = '';
        }

        // if (offset < 0 && t.Utils.tmsDelta !== null) {
        //   t.testoDettaglioEventi = null;
        //   t.idSelezionatoAE = [];
        // }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Ritorno', data2);

        t.vecchiDatiEventi = data2;

        if (!t.timerAttivatoAuto2) {
          // t.testoDettaglioEventi = '';  
        }
        
        if (data2 !== null) { // } data !== undefined && data.DataTable && data.DataTable.length > 0) {
          // t.datiPointActivityEvents = undefined;

          // const tm = setTimeout(() => {
          // clearTimeout(tm);

          if (data2.v_grid_msg !== undefined) {
            t.messaggioWarningAE = data2.v_grid_msg;
          } else {
            t.messaggioWarningAE = '';
          }

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Elabora events. Controllo griglia', t.datiPointActivityEvents, data2.DataTable);

          if (t.datiPointActivityEvents && t.datiPointActivityEvents.DataTable && t.datiPointActivityEvents.DataTable.length > 0 && 
            data2.DataTable && this.vecchieColonne[t.NumeroFrame2] === JSON.stringify(data2.ColumnProperty)) {
            t.datiPointActivityEvents.DataTable = data2.DataTable;

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Elabora events. Aggiornata griglia');
          } else {
            let causa = '';

            if (this.vecchieColonne[t.NumeroFrame2] && this.vecchieColonne[t.NumeroFrame2] !== 'undefined' && this.vecchieColonne[t.NumeroFrame2] !== null && this.vecchieColonne[t.NumeroFrame2] !== 'null') {
              if (this.vecchieColonne[t.NumeroFrame2] !== JSON.stringify(data2.ColumnProperty)) {
                causa = 'Colonne vecchie diverse dalle attuali: (' + JSON.parse(this.vecchieColonne[t.NumeroFrame2]) + ' - ' + data2.ColumnProperty + ')';
              }
            }
            if (causa === '') {
              causa = 'DataTable nullo: (' + t.datiPointActivityEvents + ')';
            } else {
              causa += 'DataTable nullo: (' + t.datiPointActivityEvents + ')';
            }

            this.vecchieColonne[t.NumeroFrame2] = JSON.stringify(data2.ColumnProperty);
            t.datiPointActivityEvents = null;

            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Elabora events. Ricaricata griglia', data2);

            const tm = setTimeout(() => {
              clearTimeout(tm);

              t.datiPointActivityEvents = data2;
              
              const tm1 = setTimeout(() => {
                clearTimeout(tm1);

                t.effettuaAutoFitAE = !t.effettuaAutoFitAE;
              }, 100);
            }, 100);
          }

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Eventi selezionati in precedenza', t.vecchioIdSelezionatoAE);
          t.creaIdEventiGlobali();

          if (caricaDettaglio) {
            if (t.rigaSelezionataAE) {
              const riga = t.rigaSelezionataAE;
              this.prendeDettaglioEvents(t, riga.ROW_ID, riga.act_id, riga.file_hist_id);           
            }
          }

          t.graficiComponentAE.disegnaGraficiAE(t, data2);
  
          /* if (t.vecchioIdSelezionatoAE) {
            t.idSelezionatoAE = t.vecchioIdSelezionatoAE;
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Impostato vecchio codice AE', t.idSelezionatoAE);
          }
          t.vecchioIdSelezionatoAE = t.idSelezionatoAE; */
          
          t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Spengo rondella eventi 1');
            // }, 100);
          // }, 10);

          /* const cc = new Date();
          const js3 = data; // JSON.parse(data);
          this.js3old[t.NumeroFrame2] = data;
          // let menoUno = false;
          // if (offset === -1) {
          //   menoUno = true;
          // }
          // menoUno = false;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scrivo eventi con parametro: ', offset);

          // if (offset !== -2) {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Aggiorna Eventi', js3);
            }
            t.aggiornaEventi(agnact + '§' + tms + '§' + JSON.stringify(data) + '§' + cc, soloAggiornamentoDati);
 */
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Spengo flag staGiaDisegnando 3');

            // // t.staDisegnandoEventi[t.frameAttivo2] = false;
            /* } else {
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Aggiorna Posizione Eventi', js3.tms_row_offset);
            }
            t.aggiornaPosizioneAE(js3.tms_row_offset);
          } */

          // if (offset === 0 && t.Utils.tmsDelta !== null) {
          /* if (t.Utils.tmsDelta !== null) {
            t.Utils.tmsDelta = null;
          } */
        } else {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Valori nulli Eventi');
          // t.datiPointActivityEvents = 'empty grid';

          t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Spengo rondella eventi 2');

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Spengo flag staGiaDisegnando 4');
          // // t.staDisegnandoEventi[t.frameAttivo2] = false;
        }
        t.pendings.replace('Events<br />', '');
      }, error => {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Errore lettura Eventi', error);

        t.datiPointActivityEvents = 'ERROR: ' + error?.message;
        this.vecchieColonne[t.NumeroFrame2] = '';
        t.lastCallCrossTab[t.NumeroFrame2] = '';
        // ExternalUtilities.messaggioDiErrore('null', error);

        t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
        // // t.staDisegnandoEventi[t.frameAttivo2] = false;
      });
    } else {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'NON LETTURA', t.NumeroFrame, params);

      // t.testoDettaglioEventi = null;
      // const cc = new Date();
      // t.aggiornaEventi(act_set + '§' + tms + '§' + this.js3old[t.NumeroFrame2] + '§' + cc);

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: NON lettura Eventi', prosegui); // , this.vecchioOffset);

      /* t.datiPointActivityEvents = undefined;

      const tm = setTimeout(() => {
          clearTimeout(tm);
        t.datiPointActivityEvents = t.vecchiDatiEventi;
        t.testoDettaglioEventi = '';
      }, 500); */

      // this.vecchioOffset[t.NumeroFrame2] = -99;
      // EventsComponent.lastCallCrossTabMenoUno[t.NumeroFrame2] = actualCall;
      // EventsComponent.lastCallCrossTabMenoDue[t.NumeroFrame2] = actualCall;
      t.lastCallCrossTab[t.NumeroFrame2] = actualCall;

      t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Spengo rondella eventi 4');
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Spengo flag staGiaDisegnando 6');
      // // t.staDisegnandoEventi[t.frameAttivo2] = false;

      t.pendings.replace('Events<br />', '');
    }

      // t.caricamentoEventiInCorso = false;
    // }, 100);
  }

  elaboraEventsNONUTILIZZARE(t, j, datePipe, soloElaborazioneDati, menoUno) {
    return;

    // if (t.ActivityName2 === undefined) {
    //   t.caricamentoEventiInCorso = false;
    //   return;
    // }

    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elabora events', j);
    }
    let j1 = null;
    if (j[2] !== null && j[2] !== undefined && j[2] !== 'undefined' && j[2] !== '' && j[2].length > 1
        && j[2].toUpperCase().indexOf('ERROR:') === - 1) {
      j1 = JSON.parse(j[2]);
      if (j1 && j1.DataTable) {
        j1 = j1.DataTable;
      } else {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'DataTable mancante', j1);
      }
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Punto 2', j1);
    }
    let tot = '';
    let c = 1;
    const campi = new Array();
    let ok = false;
    if (t.debug2 === true) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elabora events 2', j1);
    }
    if (j1 && j1 !== null) {
      j1.forEach(element => {
        const tms = element.tms;
        const tms2 = datePipe.transform(tms, 'yyyy-MM-dd HH:mm:ss.SSS');
        element.tms = tms2;

        let p = JSON.stringify(element);
        // p = p.replace('{', '');
        // p = p.replace('}', '');
        p = p.substring(1, p.length);
        p = p.substring(0, p.length - 1);

        p = p.replace('bck_color', 'BackColor');
        p = p.replace('fore_color', 'ForeColor');
        p = p.replace('tms_delta', 'delta');

        if (!ok) {
          const cc = p.split(',"');
          cc.forEach(element2 => {
            const ccc = element2.split(':');
            const campo = ccc[0].replace('"', '').replace('"', '');
            campi.push(campo);
          });
          ok = true;
        }
        p = '{"ROW_ID": ' + c + ', ' + p + '}';
        c++;
        tot += p + ',';
      });
    }
    if (tot.length > 1) {
      tot = tot.substring(0, tot.length - 1);
      tot = '[' + tot + ']';

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, JSON.parse(tot));
      let col = '';
      c = 0;
      campi.forEach(element => {
        let nome = element;
        while (nome.indexOf('_') > -1) {
          nome = nome.replace('_', ' ');
        }
        col += '{';
        col += '"IsEmpty": "false",';
        if (nome === 'delta') {
          col += '"dataType": "numeric",';
        } else {
          col += '"dataType": "string",';
        }
        col += '"headerText": "' + nome + '",';
        switch (element) {
          case 'BackColor':
          case 'ForeColor':
          case 'file_hist_id':
          case 'event_row_id':
          case 'icon':
          case 'tck_description':
          case 'info':
          case 'status':
          case 'act_id':
          case 'ROW ID':
          case 'ROW_ID':
            col += '"hide": "true",';
            break;
          default:
            col += '"hide": "false",';
        }
        col += '"key": "' + element + '",';
        col += '"locked": "true",';
        col += '"place": "' + c + '"';
        col += '},';
        c++;
      });

      if (col.length > 0) {
        col = col.substring(0, col.length - 1);
        col = '[' + col + ']';

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, col);
        for (let index = 0; index <= 9; index++) {
          if (t.columnsSettings2 && t.columnsSettings2 !== null) {
            const element = t.columnsSettings2[index];
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
            while (col.indexOf('value str 0' + (index + 1)) > - 1) {
              col = col.replace('value str 0' + (index + 1), element);
            }
          }
        }
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, col);

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, col);
        // let itemsPerPagina = localStorage.getItem(t.userName + '_' + '_ipp_Events');
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ipp', itemsPerPagina);
        // if (itemsPerPagina === null) {
          // itemsPerPagina = '25';
          // localStorage.setItem(t.userName + '_' + '_ipp_Events', itemsPerPagina);
        // }
        const itemsPerPagina = t.Utils.limitPerVirtual;
        const colonne = JSON.parse(col);
        let proprieta;

        const dati = JSON.parse(tot);
        const carattereDaModificare = ' ';
        dati.forEach(element => {
          if (!menoUno && element && element.delta && element.delta !== null) {
            const delta = element.delta.toString();
            if (delta.indexOf('.') > - 1) {
              let decim = delta.substring(delta.indexOf('.') + 1, delta.length);
              const intero = delta.replace(decim, '');
              if (decim.length > 3) {
                decim = decim.substring(0, 3);
              } else {

              }
              element.delta = intero + decim;
            }
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element.delta);
            if (element.act_id === null) { element.act_id = carattereDaModificare; }
            if (element.destination === null) { element.destination = carattereDaModificare; }
            if (element.event_row_id === null) { element.event_row_id = carattereDaModificare; }
            if (element.event_type === null) { element.event_type = carattereDaModificare; }
            if (element.file_hist_id === null) { element.file_hist_id = carattereDaModificare; }
            if (element.info === null) { element.info = carattereDaModificare; }
            if (element.net_tech === null) { element.net_tech = carattereDaModificare; }
            if (element.net_tech === null) { element.net_tech = carattereDaModificare; }
            if (element.protocol === null) { element.protocol = carattereDaModificare; }
            if (element.source === null) { element.source = carattereDaModificare; }
            if (element.sub_chan === null) { element.sub_chan = carattereDaModificare; }
            if (element.tms === null) { element.tms = carattereDaModificare; }
            if (element.value_str_01 === null) { element.value_str_01 = carattereDaModificare; }
            if (element.value_str_02 === null) { element.value_str_02 = carattereDaModificare; }
            if (element.value_str_03 === null) { element.value_str_03 = carattereDaModificare; }
            if (element.value_str_04 === null) { element.value_str_04 = carattereDaModificare; }
            if (element.value_str_05 === null) { element.value_str_05 = carattereDaModificare; }
            if (element.value_str_06 === null) { element.value_str_06 = carattereDaModificare; }
            if (element.value_str_07 === null) { element.value_str_07 = carattereDaModificare; }
            if (element.value_str_08 === null) { element.value_str_08 = carattereDaModificare; }
            if (element.value_str_09 === null) { element.value_str_09 = carattereDaModificare; }
            if (element.value_str_10 === null) { element.value_str_10 = carattereDaModificare; }
          } else {
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Element:', element);
            if (element.event_row_id && element.event_row_id !== null) {
              if (proprieta[0]) {
                proprieta[0].rowCount = element.event_row_id;
                t.righeTotali[t.NumeroFrame2] = element.event_row_id;
              }
            }
          }
        });

        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elabora events', dati);
        }

        if (menoUno) {
          proprieta = [{
            GridName: t.frameName, // 'Activity Events',
            IsFilterDisplayed: 'N',
            ItemsPerPage: itemsPerPagina,
            ShowColumnSelector: 'true',
            pageable: true,
            reportType: 'Rep',
            rowCount: -1
          }];
        } else {
          proprieta = [{
            GridName: t.frameName, // 'Activity Events',
            IsFilterDisplayed: 'N',
            ItemsPerPage: itemsPerPagina,
            ShowColumnSelector: 'true',
            pageable: true,
            reportType: 'Rep',
            rowCount: t.righeTotali[t.NumeroFrame2]
          }];
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Righe totali eventi', this.righeTotali);
        }

        /* if (!menoUno) {
          for (let i = dati.length; i <= this.righeTotali; i++) {
            const e = { ROW_ID: i };
            dati.push(e);
          }
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati events:', dati);
        } */
        const strutt = {
          ColumnProperty: colonne,
          DataTable: dati,
          GridProperty: proprieta
        };

        t.datiAEAppoggio[t.frameAttivo] = strutt;

        /* if (this.haGiaFattoAutoFit[t.frameAttivo] === false) {
          this.haGiaFattoAutoFit[t.frameAttivo] = true;
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati events. Effettuo Auto Fit')
          }
          t.effettuaAutoFitAE = !t.effettuaAutoFitAE;
        } */
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elabora events. Effettuo autofit');
        }
        /* const tm = setTimeout(() => {
          clearTimeout(tm);
          t.effettuaAutoFitAE = !t.effettuaAutoFitAE;
        }, 1000); */
        
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          // if (t.offsetAe > 0) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Autofitto');
          // t.effettuaAutoFitAE = !t.effettuaAutoFitAE;
        // }

        const q = dati.length; // this.datiPointActivityEvents.length;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, q, t.quantiEventsVecchi);
        let p;
        // if (+q !== +t.quantiEventsVecchi) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Cambio pagina');
          // t.quantiEventsVecchi = q;
          // p = 0;
        // } else {
        p = Math.round((t.offsetAe - 1) / t.Utils.limitPerVirtual);
        if (p < 0) { p = 0; }
        // if (p === -1) { p = 0; };
        // if (p === -0) { p = 0; };
        // }

        // t.paginaEvents = p;
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elabora events. Struttura finale:', strutt);
        }
        t.caricamentoEventiInCorso[t.NumeroFrame2] = false;

        // if (p > -1) {
          // if (p === 0) {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '***PAGINA***', p, t.offsetAe, t.Utils.limitPerVirtual);
        }
          // }
          //   t.paginaEvents = p;
          // } else {
          //   t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '***PAGINA <= -1***');
          // }
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Imposto pagina events:', t.paginaEvents);
        // }, 1000);
        return strutt;
      } else {
        if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elabora events. Ritornato valore empty in quanto col.length = 0');
        }

        t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
        return 'empty grid';
      }
    } else {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Elabora events. Ritornato valore empty in quanto tot.length = 0');
      }

      t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
      return 'empty grid';
    }
  }

  disegnaEventsSuMappa(t, daDove) {
    // logConsole('Event su mappa 1', t.NumeroFrame2, daDove);

    if (!t.frameVisible2) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per frame non visibile', t.NumeroFrame2);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    // logConsole('Event su mappa 2', t.NumeroFrame2, t.MappaOGrafico, daDove);
    
    if (t.MappaOGrafico2 !== 'M') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per NON tipo mappa', t.NumeroFrame2, t.MappaOGrafico2);
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }
    
    // logConsole('Event su mappa 3', t.NumeroFrame2, t.shownEvents2, daDove);
    
    if (!t.shownEvents2 || t.shownEvents2 === null || !t.map1[t.NumeroFrame2]) {
      // logConsole('Esco geo event 1');
      if (t.pathEvents && t.pathEvents[t.NumeroFrame2]) {
        logConsole('Event su mappa 3-1. Elimino layer', t.NumeroFrame2, t.shownEvents2, daDove);

        t.removeLayerFromMap('Events', t.pathEvents[t.NumeroFrame2]);
        t.pathEvents[t.NumeroFrame2] = undefined;
      }

      t.lastCallEventi[t.NumeroFrame2] = '';
      this.layerAttivo[t.NumeroFrame2] = false;

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events Map: Uscita eventi 1');

      // logConsole('Event su mappa 3-2. ESCO', t.NumeroFrame2, t.shownEvents2, daDove);

      return;
    }

    if (t.eseguitoInProgetto2 === true && (t.permessoFleetManagerAM2 === undefined || t.permessoFleetManagerAM2 === false)) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events Map: Uscita eventi 5');
      this.layerAttivo[t.NumeroFrame2] = false;

      return;
    }

    // logConsole('Event su mappa 4', t.NumeroFrame2, daDove);

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS2 < t.ritardoPerFunzioni && this.ultimaVoltaTMS2 !== -1) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscita eventi 2');
      }

      return;
    }
    this.ultimaVoltaTMS2 = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    /* if ((t.timeFilter === 2 || t.timeFilter2 === 'Time Range') && !t.Utils.tmsSelezionato) {
      return;
    } */

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events Map: Progetto: ', t.NumeroFrame2, t.eseguitoInProgetto2);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events Map: Tipo Evento: ', t.tipoEvento);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events Map: Lista Eventi da passare: ', t.listaEventiDaPassare2);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events Map: Eventi scelti: ', t.eventiSceltiES2);

    // logConsole('Layer Eventi: Tipo lista eventi', t.tipoEvento);

    if (t.ConnessioneStabilita === 'OK') {
      let lista = null;
      let lep = null;
      // logConsole('Tipo evento', t.tipoEvento, t.listaEventiDaPassare2);
      if (t.tipoEvento === 'L') {
        lista = t.listaEventiDaPassare2;
        lep = ExternalUtilities.converteStringaInJSON(lista);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi locale');
      } else {
        if (t.tipoEvento === 'S') {
          lista = t.eventiSceltiESGlobali2;
          lep = ExternalUtilities.converteStringaInJSON(lista);
        } else {
          lista = t.eventiSceltiES2;
          lep = ExternalUtilities.converteStringaInJSON(lista);
        }
        // lista = t.eventiSceltiES2;
        // lep = lista;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi globale');
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lista);
      }

      let filtro = '';
      // if (lista && lista !== 'empty grid' && lista.length !== undefined) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lista, lista.length);
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events Map: Lista eventi', t.NumeroFrame2, lep);
      // }
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lep, lep.length);
      // logConsole('Layer Eventi: lista eventi', lep);

      if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep !== '"empty grid"' && lep.length > 0) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi', lep);
        lep.forEach(element => {
          if (element && element.EVENT_TYPE && element.EVENT_TYPE !== undefined && element.EVENT_TYPE !== 'undefined') {
            const misura = ExternalUtilities.ritornaMisura(t, element.EVENT_TYPE, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Events');
              if (filtro.indexOf(misura + '\\,') === -1) {
                filtro += misura + '\\,';
              }
          } else {
            if (element && element.event_type && element.event_type !== undefined && element.event_type !== 'undefined') {
              const misura = ExternalUtilities.ritornaMisura(t, element.event_type, t.Utils.globalMeasure, t.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Events');
              if (filtro.indexOf(misura + '\\,') === -1) {
                filtro += misura + '\\,';
              }
            }
            // if (t.tipoEvento === 'G') {
            //   filtro = 'event_type = \'NONE\'';
            // }
          }
        });
      }
      
      if (filtro.length > 0) {
        filtro = filtro.substring(0, filtro.length - 2);
        // filtro = 'event_type in (' + filtro + ')';
      }

      // logConsole('Layer Eventi: Filtro lista eventi', filtro);

      // logConsole('Misure ritornate lep', lep);
      // logConsole('Misure ritornate filtro', filtro);

      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events Map: Filtro eventi: ', filtro);
      // }

      // const act_set = ExternalUtilities.ritornaStringPerActivitySetAGrafici(t, t.Utils);
      
      // logConsole('Event su mappa 5', t.NumeroFrame2, daDove);

      let sInizio;
      let sFine;
      /* let tmsFilter = '';
      if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
        if (t.Utils.tmsInizio && t.Utils.tmsFine) {
          sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
          sFine = t.Utils.tmsFine; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
        } else {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.Utils.tmsSelezionato);
          if (t.Utils.tmsSelezionato) {
          }
        }
        if (sInizio !== '' && sFine !== '') {
          tmsFilter = ' and tms >= \'' + sInizio + '\' and tms <= \'' + sFine + '\'';
        }
      } else {
        sInizio = t.timeRangeDSFStart2;
        sFine = t.timeRangeDSFStop2;
      } */
      // sInizio = t.timeRangeDSFStart2;
      // sFine = t.timeRangeDSFStop2;

      if (t.eseguitoInProgetto2 === true && t.tmsPassatiDaProgetto2) {
        /* const t1 = new Date().getTime() - (t.lastDays2 * 24 * 60 * 60 * 1000);
        sInizio = t.datePipe.transform(t1, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        const t2 = new Date().getTime() + (24 * 60 * 60 * 1000);
        sFine = t.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC'); */
        const tt = t.tmsPassatiDaProgetto2.split(';');
        sInizio = tt[0];
        sFine = tt[1];

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events Map: Impostato tmsPassatiDaProgetto2 per chiamata l_geo_events', t.NumeroFrame2, sInizio, sFine, t.tmsPassatiDaProgetto2);
      } else {
        if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
          if (this.tmsPartenza && this.tmsArrivo) {
            sInizio = this.tmsPartenza; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
            sFine = this.tmsArrivo; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
          }
        } else {
          sInizio = t.timeRangeDSFStart2;
          sFine = t.timeRangeDSFStop2;
        }
      }

      // if (sInizio === undefined || sFine === undefined) {
      //   return;
      // }

      if (sInizio !== '' && sInizio !== undefined) {
        if (sInizio.indexOf('\'') === -1) {
          sInizio =  '\'' + sInizio + '\'';
        }
      } else {
        sInizio = 'null';
      }

      if (sFine !== '' && sFine !== undefined) {
        if (sFine.indexOf('\'') === -1) {
          sFine =  '\'' + sFine + '\'';
        }
      } else {
        sFine = 'null';
      }

      // logConsole('Event su mappa 6', t.NumeroFrame2, daDove);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi', filtro);
      let valoreRicerca;

      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events map: Ricavo valoreRicerca. Eseguito in progetto: ', t.eseguitoInProgetto2);
      // }

      if (t.eseguitoInProgetto2 === false) {
        let agnact = '';
        if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
          agnact = 'null';
        } else {
          if (ExternalUtilities.stringaAGNoACT.indexOf('\'') === -1) {
            agnact = '\'' + ExternalUtilities.stringaAGNoACT + '\'';
          } else {
            agnact = ExternalUtilities.stringaAGNoACT;
          }
        }
        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events map: AgnAct: ', agnact);
        // }

        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events map: Tipo dataset: ', t.tipoDataset2);
        // }
        valoreRicerca = '\'' + t.act_set + '\'';
        if (t.tipoDataset2 === 2) {
          valoreRicerca = agnact;
        }
      } else {
      // if (t.tipoDataset2 === 2) {
      //  valoreRicerca = agnGroupId;
      // }
        // if (t.tipoDataset2 === 1) {
        if (t.listaActSet2) {
          valoreRicerca = '\'' + t.listaActSet2 + '\'';
        } else {
          valoreRicerca = '\'' + t.agnGroup + '\'';
        }
        // } else {
        //   valoreRicerca = '\'' + t.actSetNameFM + '\'';
        // }
      }
      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events map: Valore ricerca:', valoreRicerca);
      // }

      if (!valoreRicerca || valoreRicerca === '\'undefined\'' || valoreRicerca === 'undefined' || valoreRicerca === 'null' || valoreRicerca === null || valoreRicerca === '' || valoreRicerca === '\'\'') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events map: Esco per valore ricerca nullo:', valoreRicerca);
        this.layerAttivo[t.NumeroFrame2] = false;

        return;
      }

      let viewParams = 'cntx_id:\'' + t.sessionID2 + '\';' +
        'v_act_set_name_list:' + valoreRicerca + ';' +
        'v_event_type_list:\'' + filtro + '\';' +
        'v_tms_min:' + sInizio + ';' +
        'v_tms_max:' + sFine + ';';

      // FILTER
      const filtri = ExternalUtilities.prendeFiltri(t, true, 'Events');
      const cm1 = filtri.cm1;
      const cm2 = filtri.cm2;
      const tf1 = filtri.tf1;
      const tf2 = filtri.tf2;
      // FILTER

      viewParams += 'v_filter_measr_code_1:' + cm1 + ';v_filter_measr_code_2:' + cm2 + ';v_filter_measr_value_1:' + tf1 + ';v_filter_measr_value_2:' + tf2 + ';';

      const bbox = ExternalUtilities.bboxStringa; // ExternalUtilities.bboxStringaFisso; // ExternalUtilities.prendeBBOX(t.map1[t.NumeroFrame2]);
      if (bbox.indexOf('NaN') > -1) {
        // if (t.debug2 === true) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco per bbox non valida: ', t.NumeroFrame2, bbox);
        // }
        // return;
      }

      const parameters = {
        LAYERS: 'Geo_ANTS:l_geo_event',
        projection: 'EPSG:4326',
        TILED: false,
        /* 'TILED': true,
        CQL_FILTER: filtro + act_set + tmsFilter */
        NUMEROFRAME: t.NumeroFrame2,
        VIEWPARAMS: viewParams + bbox
      };

      // logConsole('Event su mappa 7', t.NumeroFrame2, parameters, daDove);

      // if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events Map: Filtro parametri l_geo_event:', parameters);
      // }

      const valoriDiBase = ';' + t.dashboardAttiva2 + ';' + t.NumeroFrame + ';' +
        t.frameAttivo + ';' + valoreRicerca + ';';
      const actualCall = 'EVENTS;' + JSON.stringify(parameters) + valoriDiBase;
      if (t.lastCallEventi[t.NumeroFrame2] !== actualCall) {
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Vecchia chiamata eventi:', EventsComponent.lastCallEventi[t.NumeroFrame2]);
        t.lastCallEventi[t.NumeroFrame2] = actualCall;
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Nuova chiamata eventi:', actualCall);

        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Eventi su mappa. l_geo_event: ', t.NumeroFrame, parameters);

        /* let q = 0;
        const tt = setInterval(() => {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'wms', wms);
          if (t.wmsEvents[t.NumeroFrame2] .loading === true) {
            q++;
            if (q > 30) {
              // t.staDisegnandoLayerGeometry[t.NumeroFrame2] = false;

              clearInterval(tt);
            }
          } else {
            clearInterval(tt); */

            // this.pathEvents[t.NumeroFrame2].setZIndex(10);

            // const tm = setTimeout(() => {
          // clearTimeout(tm);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Layer path events', t.pathEvents[t.NumeroFrame2]);
            if (this.GestisceLayerConSetSource && t.pathEvents[t.NumeroFrame2] && t.pathEvents[t.NumeroFrame2].getSource()) {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Path events', t.pathEvents[t.NumeroFrame2]);
              const nuoviParametri = { 
                LAYERS: 'Geo_ANTS:l_geo_event', 
                VIEWPARAMS: viewParams + bbox,
                projection: 'EPSG:4326'
              };

              this.layerAttivo[t.NumeroFrame2] = true;
              // logConsole('Event su mappa 8-1. AGGIORNO LAYER', t.NumeroFrame2, nuoviParametri, daDove);

              t.pathEvents[t.NumeroFrame2].getSource().updateParams(nuoviParametri); // .setSource(wms);
              // t.pathEvents[t.NumeroFrame2].getSource().setZIndex(25);
            } else {
              // if (!this.GestisceLayerConSetSource) {
                if (t.pathEvents[t.NumeroFrame2]) {
                  t.removeLayerFromMap('Events', t.pathEvents[t.NumeroFrame2]);
                  t.pathEvents[t.NumeroFrame2] = undefined;
                  // t.wmsEvents[t.NumeroFrame2] = undefined;
                }
              // }

              // t.wmsEvents[t.NumeroFrame2] = new ImageWMS({
              const wms = new ImageWMS({
                ratio: 1, // immagine grande quanto la mappa (default 1.5 = 2,25x i pixel)
                url: t.Utils.indirizzoGEOServer + t.urlWms,
                projection: 'EPSG:900913',
                params: parameters,
                // renderer: 'antialias: true;',
                serverType: 'geoserver',
                /* tileLoadFunction: function (image, src) {
                  const img = image.getImage();
                  const query = src.replace(this.url + '?', '');
                  // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, src);
                  img.src = src;
                } */

                // Sovrascrivere l'URL per evitare la cache
                
                imageLoadFunction: (image, src) => {
                  if (!this.layerAttivo[t.NumeroFrame2]) { return; }

                  const timestamp = new Date().getTime();
                  const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
                  let noCacheUrl2;
                  noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(t, noCacheUrl);
                  // logConsole('Sposto geo_event', noCacheUrl, noCacheUrl2);
                  image.getImage()['src'] = noCacheUrl2;

                  // logConsole('Event su mappa 8-2. RIDISEGNO LAYER', t.NumeroFrame2, daDove);
                }
              });
              // logConsole('WMS Events', parameters);

              const newWms = new ImageLayer({
                source: wms // t.wmsEvents[t.NumeroFrame2]
              });
              
              t.addLayerToMap(newWms, 25, 'Events');
              this.layerAttivo[t.NumeroFrame2] = true;
              t.pathEvents[t.NumeroFrame2] = newWms;

              // logConsole('Event su mappa 8-3. CREO LAYER', t.NumeroFrame2, parameters, daDove);
            }
          /* }
        }, 1000); */
        // if (t.wmsEvents) {
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno eventi frame ', t.NumeroFrame, parameters);

          // }, 1000);
        // }

        // this.disegnaLegenda();
      // } else {
        // logConsole('geo event già disegnato uguale');
      }
    }
    // }
  }

  /*
  async gestioneGraficiEventi(t, numeroGrafico, nomeChart, act_set, tmsFilter, soloEstrazioneDati) {
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Shown events', t.shownEvents);
    if (t.shownEvents === false) {
      return;
    }

    const jsonEventi = new Array();
    const righe = new Array();
    let eventi = '';
    const folders = new Array();
    const conta = new Array();

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, listaEventiDaPassare2);
    let lista = null;
    let lep = null;
    if (t.tipoEvento === 'L') {
      lista = t.listaEventiDaPassare2;
      lep = t.Utils.converteStringaInJSON(lista);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi globale');
    } else {
      lista = t.Utils.eventiSceltiES2;
      lep = lista;
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi globale');
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lista, lep);
    }
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi', lista);

    // if (listaEventiDaPassare2 && listaEventiDaPassare2 !== null) {
      // const lep = t.Utils.converteStringaInJSON(listaEventiDaPassare2);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per eventi:', listaEventiDaPassare2, lep);
    if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep.length > 0) {
        lep.forEach(element => {
          eventi += '\'' + element.EVENT_TYPE + '\', ';
          let Ok = true;
          folders.forEach(element2 => {
            if (Ok) {
              if (element2 === element.FOLDER) {
                Ok = false;
              }
            }
          });
          if (Ok) {
            folders.push(element.FOLDER);
            righe.push('');
            conta.push(0);
          }
        });
      // }
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Folders / eventi:', folders, eventi);
      if (eventi.length > 0) {
        eventi = eventi.substring(0, eventi.length - 2);
        eventi = 'event_type in (' + eventi + ')';

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tmsFilter);
      } else {
        if (t.tipoEvento === 'G') {
          eventi = 'event_type = \'NONE\'';
        }
      }
    }

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Eventi grafici: ' + eventi);
    if (eventi.trim() !== '') {
      t.Utils.stampaTempoImpiegato('Lettura grafici eventi');

      eventi = ' and ' + eventi;
      const propertyName = 'propertyName=tms,icon,event_type,bck_color,folder,fore_color';
      const csvEventi = await t.downloadFile.downloadCSV('Geo_ANTS:l_geo_event', act_set, '', '',
          tmsFilter + ' ' + eventi, propertyName, 'csv', '', 'EXECUTE', false, 'Gestione Eventi Grafici');
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Scarico CSV Eventi:', csvEventi, tmsFilter + ' and ' + eventi);
      t.Utils.stampaTempoImpiegato('Fine lettura grafici eventi');


      if (soloEstrazioneDati === true) {
        // const righeJson = JSON.parse(csvEventi.toString());
        const nomeFile = 'GeoAnts_' + act_set + '_' + t.frameName + '_Time_Charts_Events.csv';
        // t.Utils.salvaCSV(righeJson, nomeFile);
        const FileSaver = require('file-saver');
        const blob = new Blob([csvEventi], {type: 'text/plain;charset=utf-8'});
        FileSaver.saveAs(blob, nomeFile);
        return;
      }

      const primariga = csvEventi[0];
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, csvEventi);
      let index2 = 0;
      let numerocampoicona = -1;
      let numerocampotms = -1;
      let numerocampoinfo1 = -1;
      let numerocampocolorefore = -1;
      let numerocampocoloreback = -1;
      let numerocampofolder = -1;
      primariga.forEach(element2 => {
        const ele = t.Utils.ritornaCampoCSVSistemato(element2);
        if (ele === 'tms') {
          numerocampotms = index2;
        }
        if (ele === 'icon') {
          numerocampoicona = index2;
        }
        if (ele === 'event_type') {
          numerocampoinfo1 = index2;
        }
        if (ele === 'bck_color') {
          numerocampocoloreback = index2;
        }
        if (ele === 'fore_color') {
          numerocampocolorefore = index2;
        }
        if (ele === 'folder') {
          numerocampofolder = index2;
        }
        index2++;
      });
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'tms ' + numerocampotms + ' info_01 ' + numerocampoinfo1 + ' icon ' + numerocampoicona);
      if (numerocampoicona > - 1 && numerocampotms > - 1 && numerocampoinfo1 > - 1 &&
        numerocampocoloreback > - 1 && numerocampocolorefore > - 1) {
        // let oldtms = 0;
        let index = 0;
        const differenzaFraRighe = 1;
        csvEventi.forEach(element2 => {
          if (index > 0) {
            const tms2 = t.Utils.ritornaCampoCSVSistemato(element2[numerocampotms]);
            const icona = t.Utils.ritornaCampoCSVSistemato(element2[numerocampoicona]);
            const coloreback = t.Utils.ritornaCampoCSVSistemato(element2[numerocampocoloreback]);
            const colorefore = t.Utils.ritornaCampoCSVSistemato(element2[numerocampocolorefore]);
            const info = t.Utils.ritornaCampoCSVSistemato(element2[numerocampoinfo1]);
            const folder = t.Utils.ritornaCampoCSVSistemato(element2[numerocampofolder]);
            let altezza = 1;
            let qualeFolder = 0;
            for (let i = 0; i < folders.length; i++) {
              if (folders[i] === folder) {
                altezza = ((i - 1) * differenzaFraRighe);
                qualeFolder = i;
              }
            };
            const tt = Date.parse(tms2);
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, tms2);
            const f = '';
            conta[qualeFolder]++;
            righe[qualeFolder] += '{ "x": ' + tt + ', "y": ' + altezza + ', "markerType": "' + icona + '", "markerColor": "' + coloreback +
                      '", "markerSize": 7, "label": "' + info + '", "x2": "' + tms2 + '", "indexLabel": "' + f +
                      '", "conta": ' + conta[qualeFolder] + ', "desc": "' + info + '", "markerBorderColor": "' + colorefore + '", ' +
                      '"markerBorderThickness": 1 },'
          }
          index++;
        });
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, righe);
        righe.forEach(element => {
          if (element.length > 3) {
            element = element.substring(0, element.length - 1);
            element = '[' + element + ']';
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);

            jsonEventi.push(JSON.parse(element));
          // } else {
            // const riga = JSON.parse('[{"x": 0, "y": 0, "markerType": "", "markerColor": "", "markerSize": 7, "label": "",
            // "x2": "", "indexLabel": "", "conta": -1, "folder": -1 }]');
            // jsonEventi.push(riga);
          }
        });

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, jsonEventi);

        if (righe.length > 0) {
          if (jsonEventi !== null) {
            const puntini = new Array();
            jsonEventi.forEach(element => {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, element);
              const app = {
                'name': 'Folders',
                'type': 'line',
                // 'indexLabel': '{indexLabel}',
                'indexLabelOrientation': 'vertical',
                'indexLabelFontColor': '#808080',
                'indexLabelFontSize': '13',
                'lineColor': 'transparent',
                'indexLabelFormatter': function(e) {
                  return ''; // e.dataPoint.desc; // folders[e.dataPoint.folder];
                },
                'click': this.gestGrafici.onClick.bind(null, t),
                'dataPoints': element,
              };
              puntini.push(app);
            });

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, puntini);

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, folders);
            const contentToolTip = { content: '{x2}: {label}', cornerRadius: 4 };
            const fontColor = 'transparent';

            const axisY = {
              fontWeight: 'normal',
              fontFamily: 'arial',
              interval: 1,

              titleWrap: false,
              titleFontColor: '#aaaaaa',
              lineColor: t.Utils.axisColor,
              gridColor: t.Utils.axisColor,
              labelFontColor: fontColor,
              valueFormatString: '000',
              tickColor: t.Utils.axisColor,
            };

            // t.Utils.altezzaGrafico[numeroGrafico] = 150;

            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Creo struttura grafico eventi', t.NumeroFrame, numeroGrafico);

            t.Utils.stampaTempoImpiegato('Fine parse json grafici eventi');

            t.Utils.altezzaGrafici[t.frameAttivo][t.NumeroFrame2][numeroGrafico] = 75;
            this.gestGrafici.creaStrutturaGrafico(t, numeroGrafico, nomeChart, contentToolTip, axisY,
                puntini, 'EVENTS', 'Events');

            t.Utils.stampaTempoImpiegato('Fine creazione struttura grafici eventi');

              // this.spegneBottoni(numeroGrafico);
            // t.Utils.altezzaGrafico[t.frameAttivo][t.NumeroFrame2][0] = 100;

            return 1;
          } else {
            t.Utils.charts[t.frameAttivo][t.NumeroFrame2][numeroGrafico] = '';

            return 0;
          }
        } else {
          t.Utils.charts[t.frameAttivo][t.NumeroFrame2][numeroGrafico] = '';

          return 0;
        }
      } else {
        t.Utils.charts[t.frameAttivo][t.NumeroFrame2][numeroGrafico] = '';

        return 0;
      }
    } else {
      t.Utils.charts[t.frameAttivo][t.NumeroFrame2][numeroGrafico] = '';

      return 0;
    }
  } */

  lastCaricaEventSummary = -1;

  caricaEventSummary(t) {
    // logConsole('Event summary 1')

    const ora = new Date().getTime();
    if (ora - this.lastCaricaEventSummary < 1000) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Event summary. Esco per troppo veloce');
      return;
    }
    this.lastCaricaEventSummary = ora;

    // logConsole('Event summary 2')

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Carica event summary');
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
    } */
    if (t.MappaOGrafico !== 'ES') { //  || aperto === false) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esce 1');
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Disegno event summary 0', t.NumeroFrame2);

      // logConsole('Event summary 2 ESCO')

      return;
    }

    /* const act_set = ExternalUtilities.ritornaStringPerActivitySetEventSummary(t, t.Utils);
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Activity set eventi:', t.NumeroFrame, act_set);*/

    if (!t.act_set) {
      let tt = 0;
      const t1 = setInterval(() => {
        if (t.act_set) {
          clearInterval(t1);

          this.caricaEventSummary2(t);
        } else {
          tt++;
          if (tt > 10) {
            clearInterval(t1);
          }
        }
      }, 1000);
      // return;
    } else {
      this.caricaEventSummary2(t);
    }
  }

  lastCaricaEventSummary2 = 0;

  caricaEventSummary2(t) {
    if (t.act_set !== undefined && t.act_set === '') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da event summary 1', t.NumeroFrame2, t.act_set);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, '*' + act_set + '*');
      t.datiEventSummary = 'empty grid';

      // logConsole('Event summary 3 ESCO')

      return;
    }

    /* const ora = new Date().getTime();
    if (ora - this.lastCaricaEventSummary2 < 500) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Event summary 1. Esco per troppo veloce');

      return;
    }
    this.lastCaricaEventSummary2 = ora; */

    // // // t.staDisegnandoEventiSummary[t.NumeroFrame2] = true;

    // this.sceltaActivityDaSet
    // const id = act_set;

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_set);

    // let tmsFilter = '';
    let sInizio = '';
    let sFine = '';

    if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
      if (!t.Utils.tmsSelezionato || t.Utils.tmsSelezionato === null || t.Utils.tmsSelezionato === '') {
        t.datiEventSummary = 'empty grid';
        // // // t.staDisegnandoEventiSummary[t.NumeroFrame2] = false;
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da event summary 2', t.NumeroFrame2);

        // logConsole('Event summary 4 ESCO')

        return;
      }

      // const dInizio = ((new Date(t.Utils.tmsSelezionato).getTime()) - (t.Utils.rangeDiSecondiPerMille)) +
      //   (new Date().getTimezoneOffset() * 60000);
      sInizio = this.tmsPartenza; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
      // const dFine = ((new Date(t.Utils.tmsSelezionato).getTime()) + (t.Utils.rangeDiSecondiPerMille)) +
      //   (new Date().getTimezoneOffset() * 60000);
      sFine = this.tmsArrivo; //  t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
      // tmsFilter = '(tms >= \'' + sInizio + '\' and tms <= \'' + sFine + '\')';
    } else {
      // sInizio = '1970-01-01 00:00:00';
      // sFine = '3999-01-01 00:00:00';
      sInizio = t.timeRangeDSFStart2;
      sFine = t.timeRangeDSFStop2;
    }

    let eventi = '';

    let lista = null;
    let lep = null;
    /* if (t.tipoEvento === 'L') {
      if (!t.listaEventiDaPassare2) {
        t.listaEventiDaPassare2 = 'empty grid';
      }
      lista = t.listaEventiDaPassare2;
      lep = ExternalUtilities.converteStringaInJSON(lista);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi locale', t.NumeroFrame2, t.listaEventiDaPassare2);
    } else {
      if (!t.listaEventiDaPassare2) {
        t.Utils.eventiSceltiES2 = new Array();
      }
      lista = t.Utils.eventiSceltiES2;
      lep = lista;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi globale', t.NumeroFrame2, lista);
    } */
    if (!t.listaEventiDaPassare2) {
      t.listaEventiDaPassare2 = 'empty grid';
    }
    lista = t.listaEventiDaPassare2;
    lep = ExternalUtilities.converteStringaInJSON(lista);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi locale', t.NumeroFrame2, t.listaEventiDaPassare2);

    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per eventi:', lista, lep);
    if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep !== '"empty grid"' && lep.length > 0) {
      lep.forEach(element => {
        eventi += element.EVENT_TYPE + ',';
      });
    }
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Lista Eventi:', t.NumeroFrame2, eventi);
    // alert('EVENTI 3: ' + eventi);
    if (eventi && eventi.length > 0) {
      eventi = eventi.substring(0, eventi.length - 1);

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, eventi);
    } else {
      if (t.tipoEvento === 'G') {
        eventi = 'NONE';
        // eventi = 'ALL'; // MAIL 24/11/2023 09:11
      } else {
        eventi = 'ALL';
      }
    }

    eventi = 'ALL'; // MAIL 25/02/2023 11:04

    // logConsole('Event summary 5', eventi);

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lista eventi finale: ', t.NumeroFrame2, eventi);

    /* t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.tipoEvento);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, eventi);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lista);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, lep);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_set);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, id);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, sInizio, sFine); */

    // // // t.staDisegnandoEventiSummary[t.NumeroFrame2] = false;

    if (lista === undefined || lista === 'undefined')  {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da event summary 3', t.NumeroFrame2);

      // logConsole('Event summary 6 ESCO');

      return;
    }

    /* if (!sInizio || sInizio === undefined || sInizio === 'undefined' || sInizio === '"undefined"') {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da event summary 4', t.NumeroFrame2);
      }
      return; // sInizio = t.timeRangeDSFStart2;
    }
    if (!sFine || sFine === undefined || sFine === 'undefined' || sFine === '"undefined"') {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da event summary 5', t.NumeroFrame2);
      }
      return; // sFine = t.timeRangeDSFStop2;
    } */

    if (!sInizio || !sFine || sInizio === 'undefined' || sInizio === '"undefined"' || sFine === 'undefined' || sFine === '"undefined"'
    || sInizio === null || sInizio === 'null' || sInizio === '"null"' || sFine === null || sFine === 'null' || sFine === '"null"') {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esco da event summary 4', t.NumeroFrame2);
      }

      // logConsole('Event summary 7 ESCO');

      return;
    }

    const geoFilter = ExternalUtilities.ritornaGeoFilter(t, t.geoFilter2);

   /* if (this.flagDebug) {
      sInizio = 'W Pippo';
    }
    this.flagDebug = !this.flagDebug; */

    const params = '{' +
      '"cntx_id": "' + t.sessionID2 + '",' +
      '"v_act_set_name_list": "' + t.act_set + '",' +
      '"v_event_type_list": "' + eventi + '",' +
      '"v_tms_min": "' + sInizio + '",' +
      '"v_tms_max": "' + sFine + '",' +
      '"v_bbox": "' + geoFilter + '"' +
    '}';

    const propertyName = '';
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Event Summary', params);
    const actualCall = t.act_set + ';' + params + ';' + t.columnsSettings + ';' +
          propertyName;
    // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, actualCall);
    // if (!t.Utils.lastCallES) {
    //   t.Utils.lastCallES = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, '');
    // }
    
    // // logConsole('Vecchio event summary', t.datiEventSummary);
    if (t.datiEventSummary && typeof(t.datiEventSummary) === 'string') {
      if (t.datiEventSummary.indexOf('ERROR: ') > -1) {
        t.datiEventSummary = undefined;
      }
    }

    // logConsole('Event summary 8');

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Event summary. Chiamata attuale', t.NumeroFrame, actualCall);

    if (actualCall !== t.lastCallES[t.NumeroFrame2]) {
      t.lastCallES[t.NumeroFrame2] = actualCall;

      t.caricamentoEventSummaryInCorso[t.NumeroFrame2] = true;
      t.erroreEventSummary[t.NumeroFrame2] = '';
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Refresh summary:', params);

      // logConsole('Event summary 9', params);
      
      t.paramsPerSS[t.NumeroFrame2] = params;
      t.queryPerSS[t.NumeroFrame2] = 'geo_act_set_summary__grid';

      // t.effettuaAutoFitES = false;
      this.apiService.chiamataPost(t.Utils, 'geo_act_set_summary__grid', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))        
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        if (data2 && data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati Event Summary:', data2);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Dati griglia Event Summary:', t.datiEventSummary);

          if (data2) {
            if (data2.v_grid_msg !== undefined) {
              t.messaggioWarningAS = data2.v_grid_msg;
            } else {
              t.messaggioWarningAS = '';
            }

            if (data2.message) {
              t.erroreEventSummary[t.NumeroFrame2] = 'ERROR: Message ' + data2.code + '-' + data2.message;
              t.caricamentoEventSummaryInCorso[t.NumeroFrame2] = false;
              t.datiEventSummary = undefined;

              // logConsole('Event summary 10 Error');
            } else {
              if (data2 && data2 !== null && data2.GridProperty && data2.GridProperty[0]) {
                t.gridTitleEvents = data2.GridProperty[0].GridName;
              }
              t.appoEventSummary[t.NumeroFrame2] = data2;
              // t.datiEventSummary = data2;

              if (t.datiEventSummary && t.datiEventSummary !== 'empty grid' && t.datiEventSummary.DataTable) {
                if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Faccio refresh Dati griglia Event Summary', data2.DataTable, data2.DataTable.length);
                }
                if (data2.DataTable.length > 0) {
                  // logConsole('Dati event summary aggiorno', data2.DataTable);
                  t.datiEventSummary.DataTable = data2.DataTable;

                  // logConsole('Event summary 11');
                } else {
                  // logConsole('Dati event summary pulisco', data2.DataTable);
                  t.datiEventSummary = 'empty grid';

                  // logConsole('Event summary 12');
                }

                t.impostaArraySelezioneES();
                // t.impostaPaginaES = 0;

                // // // t.staDisegnandoEventiSummary[t.NumeroFrame2] = false;
                t.caricamentoEventSummaryInCorso[t.NumeroFrame2] = false;
              } else {
                // if (t.debug2 === true) {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ricarico Dati griglia Event Summary');
                // }
                // alert('1');
                t.datiEventSummary = undefined;
                // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, dCS, dCD);

                const tm = setTimeout(() => {
                  clearTimeout(tm);

                  // logConsole('Dati event summary creo', data2.DataTable);
                  t.datiEventSummary = data2;
                  t.effettuaAutoFitES = !t.effettuaAutoFitES;
                  // t.impostaPaginaES = 0;

                  // logConsole('Event summary 13');

                  // // t.staDisegnandoEventiSummary[t.NumeroFrame2] = false;
                  t.caricamentoEventSummaryInCorso[t.NumeroFrame2] = false;
                }, 1000);
              }
            }
          }
        } else {
          // logConsole('Event summary Niente');

          // logConsole('Dati event summary svuoto', data2.DataTable);
          t.datiEventSummary = 'empty grid';
          // // t.staDisegnandoEventiSummary[t.NumeroFrame2] = false;
          t.caricamentoEventSummaryInCorso[t.NumeroFrame2] = false;
        }
      }, error => {
        // logConsole('Event summary ERRORE');

        // logConsole('Dati event summary errore');
        t.caricamentoEventSummaryInCorso[t.NumeroFrame2] = false;
        // ExternalUtilities.messaggioDiErrore(t.datiPointMeasures, error);
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, error);
        t.datiEventSummary = 'ERROR: ' + error?.message; // 
        t.lastCallES[t.NumeroFrame2] = '';
        /* if (error && error !== null) {
          t.datiEventSummary = 'ERROR: ' + error._body;
        } else {
          t.datiEventSummary = 'empty grid';
        } */
      });
    } else {
      // SKIPPATO CARICAMENTO
    }
  }

  estraeEvents(t) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events');
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, act_id);
      // if (act_id === '') {
        // t.datiPointActivityEvents = 'empty grid';
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito da events 2', t.NumeroFrame);
      //   return;
      // }

      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
      /* const ora = new Date().getTime();
      if (ora - this.ultimaVoltaTMS4 < t.ritardoPerFunzioni && this.ultimaVoltaTMS4 !== -1) {
        return;
      }
      this.ultimaVoltaTMS4 = ora; */
      // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

      const d1 = new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime();
      const tms = t.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC')
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame , tms);

      let sInizio = '';
      let sFine = '';
      let filtro = '';
      let timeRangeAll = false;

      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.tmsSelezionato, t.Utils.rangeDiSecondiPerMille);
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.timeFilter, t.Utils.tmsSelezionato, t.Utils.tmsInizio, t.Utils.tmsFine);
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Time filter', t.timeFilter);
      }

      if (t.timeFilter === 2 || t.timeFilter2 === 'Time Range') {
        timeRangeAll = false;
        if (t.Utils.tmsInizio && t.Utils.tmsFine) {
              // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.Utils.tmsInizio, t.Utils.tmsFine);
          sInizio = t.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
          sFine = t.Utils.tmsFine; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
          filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Imposto date 1', sInizio, sFine);
        } else {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Esco perchè tims non impostati');

          // t.datiPointActivityEvents = 'empty grid';
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito da events 3', t.NumeroFrame);
          return;
        }
      } else {
        if (t.timeFilter === 3 || t.timeFilter2 === 'Fixed Seconds') {
          timeRangeAll = false;
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, t.Utils.tmsSelezionato);
          // if (t.Utils.tmsSelezionato) {
          const vecchioRange = t.Utils.lastRangeEventi[t.frameAttivo][t.NumeroFrame2];
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, t.NumeroFrame, new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime(), t.fixedSeconds2, vecchioRange);
          if (vecchioRange !== null && new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime() >= vecchioRange.min &&
            new Date(t.Utils.tmsSelezionato + ' UTC+00').getTime() < vecchioRange.max &&
            vecchioRange.fixed === t.fixedSeconds2) {
            sInizio = t.datePipe.transform(vecchioRange.min, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            sFine = t.datePipe.transform(vecchioRange.max, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Interno al vecchio range', t.NumeroFrame, sInizio, sFine);
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Imposto date 2', sInizio, sFine);
          } else {
            const fs = t.fixedSeconds2 * 1000;
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, new Date(t.Utils.tmsSelezionato.replace('Z', ' ').replace('T', ' ') + ' UTC+00').getTime(), t.fixedSeconds2);
            const dInizio = ((new Date(t.Utils.tmsSelezionato.replace('Z', ' ').replace('T', ' ') + ' UTC+00').getTime()));
            sInizio = t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            const dFine = ((new Date(t.Utils.tmsSelezionato.replace('Z', ' ').replace('T', ' ') + ' UTC+00').getTime()) + fs);
            sFine = t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            filtro = 'tms_min=' + sInizio + '&tms_max=' + sFine;
            // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Esterno al vecchio range', t.NumeroFrame, t.fixedSeconds2, sInizio, sFine);
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Imposto date 4', sInizio, sFine);

            const a = { min: dInizio, max: dFine, fixed: t.fixedSeconds2 };
            t.Utils.lastRangeEventi[t.frameAttivo][t.NumeroFrame2] = a;
          }
          // } else {
          //   t.datiPointActivityEvents = 'empty grid';
          //   return;
          // }
        } else {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Impostazione date 3', t.timeRangeDSFStart2, t.v_timerangedsfstart);

          timeRangeAll = true;
          filtro = '';
          // sInizio = '1970-01-01 00:00:00';
          // sFine = '3999-12-31 23:59:59';
          sInizio = t.timeRangeDSFStart2;
          sFine = t.timeRangeDSFStop2;
        }
      }
      if (sInizio === null || sFine === null) {
        // t.datiPointActivityEvents = 'empty grid';
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito da events 4', t.NumeroFrame);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Esco per date nulle');

        return;
      }
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, sInizio, sFine);

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events 2', sInizio, sFine);

      let eventi = '';
      let eventiSE = '';

      if (t.tipoEvento === 'A') {
        eventi = 'ALL';
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events: Lista eventi all', t.NumeroFrame2);
      } else {
        let lista = null;
        let lep = null;
        if (t.tipoEvento === 'L') {
          lista = t.listaEventiDaPassare2;
          lep = ExternalUtilities.converteStringaInJSON(lista);
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events: Lista eventi locale', t.NumeroFrame2, lep);
        } else {
          if (t.tipoEvento2 === 'S') {
            if (t.eventiSceltiESGlobali2) {
              t.eventiSceltiESGlobali2.forEach(element => {
                eventiSE += element.act_id + '|' + element.ROW_ID + ',';
              });
            }
            if (eventiSE.length > 0) {
              eventiSE = eventiSE.substring(0, eventiSE.length - 1);
            }
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events: Lista eventi selected events', t.NumeroFrame2, eventiSE);
          } else {
            lista = t.eventiSceltiES2;
            lep = lista;
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events: Lista eventi globale', t.NumeroFrame2, lep);
          }
        }

        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Misure per eventi:', lista, lep);
        if (lep && lep !== '' && lep !== null && lep !== 'empty grid' && lep.length > 0) {
          lep.forEach(element => {
            eventi += element.EVENT_TYPE + ',';
          });
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Lista Eventi:', t.NumeroFrame2, eventi);
        // alert('EVENTI 1: ' + eventi);
        if (eventi && eventi.length > 0) {
          eventi = eventi.substring(0, eventi.length - 1);
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, eventi);
        } else {          
          if (t.tipoEvento === 'G') {
            // eventi = 'NONE';
            eventi = 'ALL'; // MAIL 24/11/2023 09:11
          } else {
            if (t.tipoEvento === 'S') {
              eventi = 'NONE';
            } else {
              eventi = 'ALL';
            }
          }
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Lista eventi finale', t.NumeroFrame2, eventi);

        if ((lista === undefined || lista === 'undefined') && eventiSE === '') {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events: Esco da events per lista eventi vuota');

          return;
        }
      }

      // logConsole('Estrazione events 3 Evento:', t.tipoEvento, eventi);

      // if (lista === undefined || lista === 'undefined') {
      //   return;
      // }

      // t.staDisegnandoEventi[t.frameAttivo2] = true;
      const propertyName = '&select=event_row_id,tms,event_type,status,info_01,info_02,info_03,info_04,info_05,info_06,info_07,info_08';

      let agnact = '';
      /* if (t.tipoDataset2 === 1) {
        if (!t.act_set || t.act_set === '') {
          if (t.debug2 === true) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CDR Data. ACT SET Vuoto. Esco', t.NumeroFrame2);
          }
          t.datiCellMeasure = 'empty grid';
          return;
        }
      } else { */
      if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
        agnact = 'null';
      } else {
        if (ExternalUtilities.stringaAGNoACT !== undefined && ExternalUtilities.stringaAGNoACT !== null) {
          if (ExternalUtilities.stringaAGNoACT.indexOf('\'') === -1 && ExternalUtilities.stringaAGNoACT.indexOf('"') === -1) {
            agnact = '"' + ExternalUtilities.stringaAGNoACT + '"';
          } else {
            if (ExternalUtilities.stringaAGNoACT.indexOf('\'') > -1) {
              agnact = ExternalUtilities.stringaAGNoACT.replace('\'', '"').replace('\'', '"');
            } else {
              agnact = ExternalUtilities.stringaAGNoACT;
            }
          }
        } else {
          agnact = 'null';  
        }
      }
      if (ExternalUtilities.stringaAGNoACT === undefined) {
        // t.datiPointActivityEvents = 'empty grid';
        // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Uscito da events 4', t.NumeroFrame);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Esco per agnact undefined 1');

        return;
      }

      if (agnact === undefined || agnact === 'undefined') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Esco per agnact undefined 2');

        return;
      }
      // let valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '\'', '');
      // valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '"', '');

      let valoreRicerca = agnact;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Agn Act', valoreRicerca, agnact);

      while (valoreRicerca.indexOf('\'') > -1) {
        valoreRicerca = valoreRicerca.replace('\'', '');
      }
      while (valoreRicerca.indexOf('"') > -1) {
        valoreRicerca = valoreRicerca.replace('"', '');
      }

      if (!valoreRicerca || valoreRicerca === '') {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Estrazione events. Esco per agnact undefined 3', valoreRicerca);

        return;
      }

      let delta = null;
      // if (timeRangeAll !== true) {
      delta = t.Utils.tmsDelta;
      if (!delta || delta === undefined || delta === 'undefined' || delta === '"undefined"') {
        delta = null;
      }
      if (delta !== null) {
        delta = '"' + delta + '"';
        // if (offset === -3) {
        //   offset = -1;
        // }
    }
    if (!delta || delta === undefined || delta === 'undefined' || delta === '"undefined"') {
      delta = null;
    }

    const nomeFunzione = 'antsgeo_get_event_crosstab8';
    const nomeCampoAct = 'v_act_set_name_list';
    const prefisso = 'v_';

    /* const params = '{ ' +
      '"v_cntx": "' + t.sessionID2 + '",' +
      '"' + nomeCampoAct + '": "' + valoreRicerca + '", ' +
      '"v_tms_min": "' + sInizio + '", ' +
      '"v_tms_max": "' + sFine + '", ' +
      '"v_event_type_list": "' + eventi + '", ' +
      '"v_text_filter": "' + t.filtroEventi + '", ' +
      // '"v_row_offset": ' + offset + ',' +
      '"v_row_limit": ' + t.Utils.limitPerVirtual + ',' +
      '"' + prefisso + 'prm_01": "' + this.checkUndefined(t.columnsSettings2, 0) + '", ' +
      '"' + prefisso + 'prm_02": "' + this.checkUndefined(t.columnsSettings2, 1) + '", ' +
      '"' + prefisso + 'prm_03": "' + this.checkUndefined(t.columnsSettings2, 2) + '", ' +
      '"' + prefisso + 'prm_04": "' + this.checkUndefined(t.columnsSettings2, 3) + '", ' +
      '"' + prefisso + 'prm_05": "' + this.checkUndefined(t.columnsSettings2, 4) + '", ' +
      '"' + prefisso + 'prm_06": "' + this.checkUndefined(t.columnsSettings2, 5) + '", ' +
      '"' + prefisso + 'prm_07": "' + this.checkUndefined(t.columnsSettings2, 6) + '", ' +
      '"' + prefisso + 'prm_08": "' + this.checkUndefined(t.columnsSettings2, 7) + '", ' +
      '"' + prefisso + 'prm_09": "' + this.checkUndefined(t.columnsSettings2, 8) + '", ' +
      '"' + prefisso + 'prm_10": "' + this.checkUndefined(t.columnsSettings2, 9) + '", ' +
      '"v_tms_zero": ' + delta + ', ' +
      // '"v_tms_current": ' + tms2 + ', ' +
      '"v_report_event_text": "N", ' +
      '"v_format": "json", ' +
      '"v_event_list": "' + eventiSE + '" ' +
    ' }'; */

    let tms2 = '"' + t.Utils.tmsSelezionato + '"'; // '';
    if (!tms2 || tms2 === '' || tms2 === 'undefined' || tms2 === '"undefined"' || tms2 === '\'undefined\'') {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events: Esco da events per tms current non definito', tms2);

      return;
    }

    let filtroEventi = '';
    let filtroEscluso = '';
    let columnCompressed = 'Y';
    if (t.filtriEventi2) {
      filtroEventi = t.filtriEventi2.filtroImpostato;
      filtroEscluso = t.filtriEventi2.filtroEscluso;
      columnCompressed = t.filtriEventi2.columnCompressed === undefined ? 'Y' : t.filtriEventi2.columnCompressed === true ? 'Y' : 'N';
    }

    if (!filtroEventi || filtroEventi === 'undefined') {
      filtroEventi = '';
    }
    if (!filtroEscluso || filtroEscluso === 'undefined') {
      filtroEscluso = '';
    }
    /* while (filtroEventi.indexOf('"') > -1) {
      filtroEventi = filtroEventi.replace('"', '§*§');
    }
    while (filtroEventi.indexOf('§*§') > -1) {
      filtroEventi = filtroEventi.replace('§*§', '""');
    }
    while (filtroEventi.indexOf('\'') > -1) {
      filtroEventi = filtroEventi.replace('\'', '""');
    } */

    let rt = (t.timerAttivatoAuto2 ? 'Y' : 'N');
    if (t.pausaRealTimeAttiva) {
      rt = 'P';
    }

    let filtri = '';
    if (t.filtriEventi2) {
      let i = 0;
      t.filtriEventi2.filtriAttivi.forEach(element => {
        if (i+1 < 21) {
          let ii = (i+1).toString().trim();
          if (ii.length === 1) { ii = '0' + ii; }
          if (element.Campo) {
            const filtro = this.checkUndefined(element.Campo);
            filtri += '"' + prefisso + 'prm_' + ii + '": "' + filtro + '", ';
            if (element.NomeColonna && element.NomeColonna !== null) {
              const nomeColonna = this.checkUndefined(element.NomeColonna);
              filtri += '"' + prefisso + 'prm_' + ii + '_name": "' + nomeColonna + '", ';
            } else {
              filtri += '"' + prefisso + 'prm_' + ii + '_name": null, ';
            }
          } else {
            filtri += '"' + prefisso + 'prm_' + ii + '": "", ';
            filtri += '"' + prefisso + 'prm_' + ii + '_name": null, ';
          }
        }
        i++;
      });

      // // logConsole('FILTRI', t.filtriEventi2.filtriAttivi, filtri);
    } else {
      for (let i = 1; i < 21; i++) {
        let ii = i.toString().trim();
        if (ii.length === 1) { ii = '0' + ii; }
        filtri += '"' + prefisso + 'prm_' + ii + '": "", ';
        filtri += '"' + prefisso + 'prm_' + ii + '_name": null, ';
      }
    }
    filtri += '"v_col_compressed": "' + columnCompressed + '", ';

    let agnCod = "";
    // logConsole('AGN CODE', t.selezioneAgent[t.NumeroFrame2]);
    if (t.selezioneAgent[t.NumeroFrame2] && t.selezioneAgent[t.NumeroFrame2].AGN_CODE) {
      agnCod = t.selezioneAgent[t.NumeroFrame2].AGN_CODE;
    }

    let params = '{ ' +
      '"v_cntx": "' + t.sessionID2 + '",' +
      // '"v_caller_tag": "' + t.chiSonoEventi[t.NumeroFrame2] + '",' +
      '"' + nomeCampoAct + '": "' + valoreRicerca + '", ' +
      '"v_tms_min": "' + sInizio + '", ' +
      '"v_tms_max": "' + sFine + '", ' +
      '"v_event_type_list": "' + eventi + '", ' +
      '"v_text_filter": "' + t.filtroEventi2 + '", ' +
      filtri +
      '"v_tms_zero": ' + delta + ', ' +
      '"v_report_event_text": "N", ' +
      '"v_format": "json", ' +
      '"v_event_list": "' + eventiSE + '", ' +
      '"v_tms_current": ' + tms2 + ', ' + +
      '"v_agn_code_filter": ' + (!agnCod ? null : '"' + agnCod + '"') + ' '
      '"v_real_time": "' + (t.timerAttivatoAuto2 ? 'Y' : 'N') + '" '; // +
    // ' }'
    ; // +

    const actualCall = nomeFunzione + ';' + valoreRicerca + ';' + params + ';' + filtro + ';' + eventi + ';' + t.columnsSettings + ';' +
        propertyName;

    const prosegui = true;

    t.caricamentoEventiInCorso[t.NumeroFrame2] = true;
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Accendo rondella eventi 2');

    if (prosegui === true) { // || offset === -1 || offset === -2) {
      // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Lettura eventi per estrazione:', params);

      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events', t.NumeroFrame, nomeFunzione, params);

      // let a1 = new Date().getTime();
      t.chiSonoEventi[t.NumeroFrame2] = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2 + ';' + new Date().toString();
      params += '"v_caller_tag": "' + t.chiSonoEventi[t.NumeroFrame2] + '" }';

      t.lastCallEventi2[t.NumeroFrame2] = params;
      this.apiService.chiamataPost(t.Utils, '' + nomeFunzione, params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$.per(t)))        
      .subscribe((data2: any) => {
          // const data2 = JSON.parse(data);
          ExternalUtilities.checkRitornoChiamata(t, t.Utils, data2);

          if (!t.controllaRitornoChiamata(t, data2, 'Eventi')) {
            t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Spengo rondella eventi 5');

            return;
          }

          /* if (data.v_grid_msg && data.v_grid_msg !== '') {
            t.warningAE = data.v_grid_msg;
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Events. Warning', t.NumeroFrame, t.warningAE);
            }
          } else {
            t.warningAE = '';
          } */
          t.warningAE = '';
          // t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, data);

          const cc = new Date();
          const nomeFile = ExternalUtilities.sistemaNomeFrame(t, 'GeoAnts_' + valoreRicerca + '_' + t.frameName + '_Events') + '.csv';

          // const FileSaver = require('file-saver');
          const data3 = new Blob([JSON.stringify(data2.DataTable)], {type: 'text/csv'});
          // FileSaver.saveAs(data3, nomeFile);

          download(data3, nomeFile, 'text/csv');

          t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Spengo rondella eventi 6');
          // t.staDisegnandoEventi[t.frameAttivo2] = false;
        }, error => {
          ExternalUtilities.messaggioDiErrore('null', error);

          t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Spengo rondella eventi 7');
          // t.staDisegnandoEventi[t.frameAttivo2] = false;
        });
    } else {
      t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Spengo rondella eventi 8');
      // t.staDisegnandoEventi[t.frameAttivo2] = false;
    }
    // }, 100);
  }

  u_atob(ascii) {
    return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
  }

  sanitizeFileName(name) {
    if (name && name !== null && name !== undefined) {
      return name
        .normalize("NFD")                 // separa accenti
        .replace(/[\u0300-\u036f]/g, "")  // rimuove accenti
        .replace(/[\\/:*?"<>|]/g, "_")    // caratteri non validi
        .replace(/\s+/g, "_")             // spazi → underscore
        .replace(/_+/g, "_")              // evita ____
        .trim();
    } else {
      return '';
    }
  }
}

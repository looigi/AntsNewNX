import { logConsole } from '../console-log';
import { conta } from '../contatori';
import { Injectable } from "@angular/core";
import { PlanimetryComponent } from "./planimetry.component";
// import { environment } from '../../../../environments/environment';
// import { isUndefined } from "util";
import ExternalUtilities from "../ExternalUtilities.component";
import { environment } from '../../../../environments/environment.prod';

@Injectable()
export class PuliziaComponent {
  // ultimaVoltaTMS = undefined;

  constructor() {
  }

  pulisceFrame(t, nuovo, refresh) {
    conta('frame: pulizia', 'frame ' + t.NumeroFrame2 + ' tipo ' + (t.MappaOGraficoTutti2 && t.MappaOGraficoTutti2[t.frameAttivo2]));
    /* const ora = new Date().getTime();
    if (ora - t.ultimaVoltaTMS[t.NumeroFrame2] < 5000 && t.eseguitoInProgetto2 === false) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia: Esco per troppo veloce', t.NumeroFrame2);

      // logConsole('Pulizia 1. Esco', t.NumeroFrame2);
      return;
    }
    t.ultimaVoltaTMS[t.NumeroFrame2] = ora; */

    if (!t.MappaOGraficoTutti2 && t.eseguitoInProgetto2 === false) {
      // logConsole('Pulizia 2 Esco', t.NumeroFrame2);
      return;
    }

    if (t.frameAttivo2 === undefined) {
      // logConsole('Pulizia 3 Esco', t.NumeroFrame2);
      return;
    }

    const faiTutto = true;

    // Tipo della vista attualmente visualizzata (quella da pulire). Non si usa t.MappaOGrafico: quando il cambio
    // vista arriva da Mappe (es. cambio pagina) l'input contiene già il tipo della vista nuova, e verrebbe pulito
    // il tipo sbagliato lasciando in memoria mappa o grafici della vista precedente.
    const tipoDaPulire = (t.MappaOGraficoTutti2 && t.frameAttivo2 !== undefined && t.MappaOGraficoTutti2[t.frameAttivo2])
      ? t.MappaOGraficoTutti2[t.frameAttivo2]
      : t.MappaOGrafico;

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. ' + t.NumeroFrame2 + ' di tipo ' + tipoDaPulire);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. da cambiare con un frame di tipo ' + t.MappaOGraficoTutti2[t.frameAttivoAppoggio2]);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pagina attuale ' + t.frameAttivo2);
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pagina da cambiare ' + nuovo);

    // // logConsole('Pulizia frame ', 'Numero frame: ' + t.NumeroFrame2, 'Tipo: ' + t.MappaOGrafico, 'Attivo: ' + t.frameAttivo2,
    //   'Nuovo tipo: ' + t.MappaOGraficoTutti2[t.frameAttivoAppoggio2], 'Nuovo frame attivo: ', t.frameAttivoAppoggio2);
    // return;

    /* if (nuovo > -1 && (t.frameAttivo2 === nuovo || nuovo === null) && !refresh) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Esco per pagine uguali o nuova nulla');
      
      return;
    } */

    // // logConsole('Pulizia frame ' + t.NumeroFrame + ' di tipo ' + t.MappaOGrafico);

    this.azzeraFlagDiCaricamento(t);

    // logConsole('Pulizia 4', t.NumeroFrame2, t.MappaOGrafico2);

    try {
      switch (tipoDaPulire) {
        case 'M':
          this.pulisceMappa(t, faiTutto);
          break;
        case 'LA':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo LA', t.NumeroFrame2, t.frameAttivo2);

          t.activities.pulisceAppoggi(t);
          break;
        case 'AR':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa AR', t.NumeroFrame2, t.frameAttivo2);

          t.arfcnComponent.pulisceAppoggi(t);
          break;
        case 'AI':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa AI', t.NumeroFrame2, t.frameAttivo2);

          t.areaInfoComponent.pulisceAppoggi(t);
          break;
        case 'ES':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa ES', t.NumeroFrame2, t.frameAttivo2);

          t.eventsComponent.pulisceAppoggi(t);
          break;
        case 'CD':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa CD', t.NumeroFrame2, t.frameAttivo2);

          t.cdrData.pulisceAppoggi(t);
          break;
        case 'CV':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa CV', t.NumeroFrame2, t.frameAttivo2);

          t.cdrVoice.pulisceAppoggi(t);
          break;
        case 'CM':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa CM', t.NumeroFrame2, t.frameAttivo2);

          t.cellMeasure.pulisceAppoggi(t);
          break;
        case 'CG':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa CG', t.NumeroFrame2, t.frameAttivo2);

          t.clusterGrid.pulisceAppoggi(t);
          if (faiTutto) {
            if (t.pathLayerBBOX[t.NumeroFrame2]) {
              t.removeLayerFromMap('Path layer BBOX', t.pathLayerBBOX[t.NumeroFrame2]);
              t.pathLayerBBOX[t.NumeroFrame2] = undefined;
            }
            if (t.pathLayerGeometry[t.NumeroFrame2]) {
              t.removeLayerFromMap('Layer geometry', t.pathLayerGeometry[t.NumeroFrame2]);
              t.pathLayerGeometry[t.NumeroFrame2] = undefined;
            }
          }
          break;
        case 'AE':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa AE', t.NumeroFrame2, t.frameAttivo2);

          t.filtroEventi = '';
          t.filtroEventi2 = '';
          t.filtroEventiCol1 = '';
          t.filtroEventiCol2 = '';
          t.filtroEventiCol3 = '';
          t.filtroEventiCol4 = '';
          t.filtroEventiCol5 = '';
          t.filtroEventiCol6 = '';
          t.filtroEventiCol7 = '';
          t.filtroEventiCol8 = '';
          t.filtroEventiCol9 = '';
          t.filtroEventiCol10 = '';
          t.testoDettaglioEventi = undefined;

          t.eventsComponent.pulisceAppoggi(t);
          break;
        case 'MC':
          // Grafici
          t.giaDisegnataStruttura[t.NumeroFrame2] = false;

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa Grafici 1', t.NumeroFrame2, t.frameAttivo2);

          // logConsole('Pulizia grafici', t.NumeroFrame2);
          t.graficiComponent.pulisceAppoggi(t);

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa Grafici 2', t.NumeroFrame2, t.frameAttivo2);

          t.graficiComponent.pulisceGrafici(t);

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa Grafici 3', t.NumeroFrame2, t.frameAttivo2);
          break;
        case 'AH':
          // Istogrammi
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa AH 1', t.NumeroFrame2, t.frameAttivo2);

          t.histogramComponent.pulisceAppoggi(t);
          break;
        case 'M2':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa M2', t.NumeroFrame2, t.frameAttivo2);

          t.mistral_grid.pulisceAppoggi(t);
          break;
        case 'MF':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa MF', t.NumeroFrame2, t.frameAttivo2);

          t.mistral_flow.pulisceAppoggi(t);
          break;
        case 'MS':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa MS', t.NumeroFrame2, t.frameAttivo2);

          t.mistral_flow_stat.pulisceAppoggi(t);
          break;
        case 'MQ':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa MQ', t.NumeroFrame2, t.frameAttivo2);

          t.mistral_flow_queue.pulisceAppoggi(t);
          break;
        case 'MR':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa MR', t.NumeroFrame2, t.frameAttivo2);

          t.mistral_rbc_ixl.pulisceAppoggi(t);
          break;
        case 'MD':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa MD', t.NumeroFrame2, t.frameAttivo2);

          t.measureDFNComponent.pulisceAppoggi(t);
          break;
        case 'MG':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa MG', t.NumeroFrame2, t.frameAttivo2);

          t.mosaicGrid.pulisceAppoggi(t);
          if (faiTutto) {
            if (t.pathLayerGeometry[t.NumeroFrame2]) {
              t.removeLayerFromMap('Layer path geometry', t.pathLayerGeometry[t.NumeroFrame2]);
              t.pathLayerGeometry[t.NumeroFrame2] = undefined;
            }
            if (t.pathLayerBBOX[t.NumeroFrame2]) {
              t.removeLayerFromMap('Layer path BBOX', t.pathLayerBBOX[t.NumeroFrame2]);
              t.pathLayerBBOX[t.NumeroFrame2] = undefined;
            }
          }
          break;
        case 'NP':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa NP', t.NumeroFrame2, t.frameAttivo2);

          t.NPSComponent.pulisceAppoggi(t);
          break;
        case 'PC':
          // Pareto
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa PC 1', t.NumeroFrame2, t.frameAttivo2);

          t.paretoComponent.pulisceAppoggi(t, 'Pulizia');
          // t.measureDaDisegnarePareto = new Array();

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa PC 2', t.NumeroFrame2, t.frameAttivo2);
          break;
        case 'PL':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa PL', t.NumeroFrame2, t.frameAttivo2);

          t.pointLayerInfo.pulisceAppoggi(t);
          break;
        case 'PM':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa PM', t.NumeroFrame2, t.frameAttivo2);

          t.pointComponent.pulisceAppoggi(t);
          break;
        case 'PK':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa PK', t.NumeroFrame2, t.frameAttivo2);

          t.pointCellMeasures.pulisceAppoggi(t);
          break;
        case 'PS':
          // Scatter
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa PS 1', t.NumeroFrame2, t.frameAttivo2);

          t.scatterComponent.pulisceAppoggi(t);

          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa PS 2', t.NumeroFrame2, t.frameAttivo2);
          break;
        case 'TC':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa TC', t.NumeroFrame2, t.frameAttivo2);

          t.tcRunComponent.pulisceAppoggi(t);
          break;
        case 'TI':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa TI', t.NumeroFrame2, t.frameAttivo2);

          t.pulisceDatiTcRunInfo = new Date().toString();
          break;
        case 'TP':
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa TP', t.NumeroFrame2, t.frameAttivo2);

          t.pulisceDatiFramePivot = new Date().toString();
          break;
      }
    } catch (e) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia errore: ', e);
    }

    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia uscita', t.NumeroFrame2, t.frameAttivo2);
  }

  pulisceMappa(t, faiTutto) {
    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 1', t.NumeroFrame2, t.frameAttivo2);

    // Planimetria
    PlanimetryComponent.ultimo[t.NumeroFrame2] = new Date().toString();
    // // // logConsole('Pulizia PLANIMETRIA', t.NumeroFrame2, PlanimetryComponent.ultimo[t.NumeroFrame2]);
    // // // logConsole('Pulizia planimetria', t.NumeroFrame2);

    if (t.map1[t.NumeroFrame2] && t.vectorMDP) {
      // t.map1[t.NumeroFrame2].removeLayer(t.vectorMDP);     
      t.vectorMDP = undefined;       
    }

    /* if (t.map1[t.NumeroFrame2] && t.draw) {
      t.map1[t.NumeroFrame2].removeInteraction(t.draw);
    }
    if (t.map1[t.NumeroFrame2] && t.snap) {
      t.map1[t.NumeroFrame2].removeInteraction(t.snap);
    }
    if (t.map1[t.NumeroFrame2] && t.modify) {
      t.map1[t.NumeroFrame2].removeInteraction(t.modify);
    } */

    if (t.sourceMDP) {
      t.sourceMDP.un('addfeature', t.saveFeature);
      t.sourceMDP.un('changefeature', t.changeFeature);
    }

    // Mappe
      // Antenne
      t.antenneComponent.pulisceAppoggi(t);

      if (faiTutto) {
        if (t.antennaLayer1[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Antenna layer 1', t.antennaLayer1);
          t.antennaLayer1[t.NumeroFrame2] = undefined;
        }
        if (t.antennaLayer2[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Antenna layer 2', t.antennaLayer2[t.NumeroFrame2]);
          t.antennaLayer2[t.NumeroFrame2] = undefined;
        }
      }
      // Layers
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 2', t.NumeroFrame2, t.frameAttivo2);

      // Mosaic
      if (faiTutto) {
        if (t.pathLayerGeometry[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Layer path geometry', t.pathLayerGeometry[t.NumeroFrame2]);
          t.pathLayerGeometry[t.NumeroFrame2] = undefined;
        }
        if (t.pathLayerBBOX[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Layer path BBOX', t.pathLayerBBOX[t.NumeroFrame2]);
          t.pathLayerBBOX[t.NumeroFrame2] = undefined;
        }
      }
      
      // DD
      t.layers_DD.pulisceAppoggi(t);
      if (faiTutto) {
        if (t.antennaLayerDD[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Antenna layer DD', t.antennaLayerDD[t.NumeroFrame2]);
          t.antennaLayerDD[t.NumeroFrame2] = undefined;
        }
        if (t.clusterLayerDD[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Cluster DD', t.clusterLayerDD[t.NumeroFrame2]);
          t.clusterLayerDD[t.NumeroFrame2] = undefined;
        }
      }
      // Measures
      t.measuresComponent.pulisceAppoggi(t);
      if (faiTutto) {
        /* let index = 0;
        t.measureLayer[t.NumeroFrame2].forEach(element => {
          t.removeLayerFromMap('Measure layer ' + index, element);
          index++;
        }); */
        t.measureLayer[t.NumeroFrame2] = new Array();
        // Path
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 3', t.NumeroFrame2, t.frameAttivo2);
      }

      t.pathComponent.pulisceAppoggi(t);
      if (faiTutto) {
        if (t.pathLayer[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Path layer 2', t.pathLayer[t.NumeroFrame2]);
          t.pathLayer[t.NumeroFrame2] = undefined;
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 4', t.NumeroFrame2, t.frameAttivo2);

        if (t.pathLayerClickato[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Path layer clickato 2', t.pathLayerClickato[t.NumeroFrame2]);
          t.pathLayerClickato[t.NumeroFrame2] = undefined;
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 5', t.NumeroFrame2, t.frameAttivo2);

        t.pathWmsClickato = undefined;
        if (t.pathShowRays[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Path show rays 2', t.pathShowRays[t.NumeroFrame2]);
          t.pathShowRays[t.NumeroFrame2] = undefined;
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 6', t.NumeroFrame2, t.frameAttivo2);

        if (t.pathServingCell[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Path serving cell 2', t.pathServingCell[t.NumeroFrame2]);
          t.pathServingCell[t.NumeroFrame2] = undefined;
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 7', t.NumeroFrame2, t.frameAttivo2);

        if (t.overlayLayer[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Overlay layer 2', t.overlayLayer[t.NumeroFrame2]);
          t.overlayLayer[t.NumeroFrame2] = undefined;
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 8', t.NumeroFrame2, t.frameAttivo2);

        if (t.overlayLayerGlobal[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Overlay layer global 2', t.overlayLayerGlobal[t.NumeroFrame2]);
          t.overlayLayerGlobal[t.NumeroFrame2] = undefined;
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 9', t.NumeroFrame2, t.frameAttivo2);

        if (t.pathSartPosition[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Path sart position 2', t.pathSartPosition[t.NumeroFrame2]);
          t.pathSartPosition[t.NumeroFrame2] = undefined;
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 10', t.NumeroFrame2, t.frameAttivo2);

        if (t.pathSchedSel[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Path sched sel', t.pathSchedSel[t.NumeroFrame2]);
          t.pathSchedSel[t.NumeroFrame2] = undefined;
        }
      }
      // Planimetry
      // Punto selezionato
      if (faiTutto) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 11', t.NumeroFrame2, t.frameAttivo2);

        t.Utils.puntoSelezionato = new Array();
        if (t.puntoSelezionatoLayer[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Selected point', t.puntoSelezionatoLayer[t.NumeroFrame2]);
          t.puntoSelezionatoLayer[t.NumeroFrame2] = undefined;
        }
        // t.wmsPuntoSelezionato[t.NumeroFrame2] = undefined;
      }
      // Raggi
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 12', t.NumeroFrame2, t.frameAttivo2);

      t.showRaysAllLayerC.pulisceAppoggi(t);
      if (faiTutto) {
        if (t.raysAllLayer[t.NumeroFrame2]) {
          // t.removeLayerFromMap('Rays All Layer', t.raysAllLayer[t.NumeroFrame2]);
          t.raysAllLayer[t.NumeroFrame2] = undefined;
        }
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 13', t.NumeroFrame2, t.frameAttivo2);

        /* t.wms[t.NumeroFrame2].forEach(element => {
          element = undefined;
        }); */
      }
    // Layers
    t.additional_Layer.pulisceAppoggi(t);
    if (faiTutto) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 14', t.NumeroFrame2, t.frameAttivo2);

      t.addLayers2 = new Array();
      let qq = 0;
      t.layersAgg.forEach(element2 => {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Addlayers: Rimuovo layer ' + qq);

        // t.removeLayerFromMap('Additional Layer ' + qq + ' per check', element2);
        element2 = undefined;
        qq++;
      });
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 15', t.NumeroFrame2, t.frameAttivo2);

      if (t.raysAllLayer[t.NumeroFrame2]) {
        // t.removeLayerFromMap('Rays All Layer', t.raysAllLayer[t.NumeroFrame2]);
        t.raysAllLayer[t.NumeroFrame2] = undefined;
      }
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 16', t.NumeroFrame2, t.frameAttivo2);

      if (t.layersAggDir[t.NumeroFrame2]) {
        // t.removeLayerFromMap('Rays All Layer Dir', t.layersAggDir[t.NumeroFrame2]);
        t.layersAggDir[t.NumeroFrame2] = undefined;
      }
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 17', t.NumeroFrame2, t.frameAttivo2);
    }
    // AdditionalLayerComponent.lastCallAL2[t.frameAttivo2][t.NumeroFrame2] = '';
    // Legenda
    t.legendaComponent.pulisceAppoggi(t);
    if (faiTutto) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Pulizia frame. Pulizia tipo mappa 18', t.NumeroFrame2, t.frameAttivo2);
    }

    if (t.map1[t.NumeroFrame2] && t.map1[t.NumeroFrame2] !== null) {
      // const layers = [...t.map1[t.NumeroFrame2].getLayers().getArray()]
      // layers.forEach((layer) => t.map1[t.NumeroFrame2].removeLayer(layer))

      /* t.map1[t.NumeroFrame2].setTarget(null);
      t.map1[t.NumeroFrame2].setLayers(null);
      t.map1[t.NumeroFrame2].setView(null);
      t.map1[t.NumeroFrame2] = undefined; */

      // Rimuovi tutti i layer
      t.map1[t.NumeroFrame2].getLayers().clear();

      // Rimuovi tutte le interazioni (se presenti)
      t.map1[t.NumeroFrame2].getInteractions().clear();

      // Rimuovi controlli (es. zoom, scale, ecc.)
      t.map1[t.NumeroFrame2].getControls().clear();

      // Elimina l'elemento DOM associato
      t.map1[t.NumeroFrame2].setTarget(null);

      // Rilascia listener, overlay e ResizeObserver della mappa
      t.map1[t.NumeroFrame2].dispose();

      // Elimina l'istanza
      t.map1[t.NumeroFrame2] = null;
    }

    if (t.mappaVisibile && t.mappaVisibile[t.NumeroFrame2]) {
      t.mappaVisibile[t.NumeroFrame2] = false;
    }
    t.viewMappaAttuale = undefined;

    t.mappaDisegnata[t.NumeroFrame2] = false;

    /* t.mappaLocaleImpostata[t.NumeroFrame2] = false;
    t.mappaGlobaleImpostata[t.NumeroFrame2] = false;
    t.viewMappaGlobale = undefined;
    t.viewMappaLocale[t.NumeroFrame2] = undefined;
    // t.viewMappaAttuale = undefined;
    t.mappaVisibile[t.NumeroFrame2] = false;
    t.creataMappa[t.NumeroFrame2] = false;
    t.Utils.clickSuMappaZoom[t.NumeroFrame2] = false; */
  }

  azzeraFlagDiCaricamento(t) {
    // logConsole('Azzero flag di caricamento', t.NumeroFrame2);
    t.caricamentoDatiInCorsoMC[t.NumeroFrame2] = false;
    t.caricamentoDatiInCorsoPareto[t.NumeroFrame2] = false;
    t.caricamentoDatiInCorsoScatter[t.NumeroFrame2] = false; 
    t.caricamentoDatiInCorsoHistogram[t.NumeroFrame2] = false;
    t.caricamentoDatiInCorsoPointMeasures[t.NumeroFrame2] = false;
    t.caricamentoEventiInCorso[t.NumeroFrame2] = false;
    t.caricamentoEventi2InCorso[t.NumeroFrame2] = false;
    t.caricamentoEventSummaryInCorso[t.NumeroFrame2] = false;
    t.caricamentoTcRunInCorso[t.NumeroFrame2] = false;
    t.caricamentoNPSInCorso[t.NumeroFrame2] = false;
    t.caricamentoPLI[t.NumeroFrame2] = false;
    t.caricamentoPCM[t.NumeroFrame2] = false;
    t.caricamentoAreaInfo[t.NumeroFrame2] = false;
    t.caricamentoMeasureDFN[t.NumeroFrame2] = false;
    t.caricamentoMosaicGrid[t.NumeroFrame2] = false;
    t.caricamentoClusterGrid[t.NumeroFrame2] = false;
    t.caricamentoCellMeasuresInCorso[t.NumeroFrame2] = false;
    t.caricamentoActivitiesInCorso[t.NumeroFrame2] = false,
    t.caricamentoCdrDataInCorso[t.NumeroFrame2] = false;
    t.caricamentoCdrVoiceInCorso[t.NumeroFrame2] = false;
    t.caricamentoArfcn[t.NumeroFrame2] = false;
    t.caricamentoArfcnPointsInCorso[t.NumeroFrame2] = false;
  }
}

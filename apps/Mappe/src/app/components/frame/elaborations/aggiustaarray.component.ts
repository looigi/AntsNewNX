import { logConsole } from '../../../console-log';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import ExternalUtilities from '../../ExternalUtilities.component';


@Injectable()
export class AggiunstaArrayComponent {
  aggiustaArray(t, Utils) {
    // alert('Aggiusto array');
    if (!t.impostazioni.countHistogram) {
      t.impostazioni.countHistogram = [false, true, true, true, true, true, true, true, true, true, true];
    }
    if (!t.impostazioni.checkSeverity) {
      t.impostazioni.checkSeverity = [false, false, false, false, false, false, false, false, false, false, false];
    }
    if (!t.impostazioni.currZoom) {
      t.impostazioni.currZoom = [-1, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    }
    if (t.impostazioni.maskSizeHor === undefined) {
      t.impostazioni.maskSizeHor = [33, 33, 33, 33];
    }
    if (t.impostazioni.maskVisibleHor === undefined) {
      t.impostazioni.maskVisibleHor = [true, true, true, true];
    }
    if (t.impostazioni.maskDisabled56 === undefined) {
      t.impostazioni.maskDisabled56 = false;
    }
    if (t.impostazioni.maskSize[5] === undefined) {
      t.impostazioni.maskSize = [33, 33, 33, 33, 33, 33, 33, 33, 33, 33, 33];
    }
    if (t.impostazioni.maskVisible[5] === undefined) {
      t.impostazioni.maskVisible = [true, true, true, true, true, true, true, true, true, true, true];
    }
    if (!t.impostazioni.viewAs) {
      t.impostazioni.viewAs = [false, true, true, true, true, true, true, true, true, true, true];
    }
    if (!t.impostazioni.overlay) {
      t.impostazioni.overlay = ['', '', '', '', '', '', '', '', '', '', ''];
    }
    if (!t.impostazioni.overlayCluster) {
      t.impostazioni.overlayCluster = ['', '', '', '', '', '', '', '', '', '', ''];
    }
    if (!t.impostazioni.timeFilter) {
      t.impostazioni.timeFilter = [-1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
    }
    if (t.impostazioni.viewDefinition === undefined || t.impostazioni.viewDefinition[0] === undefined) {
      t.impostazioni.viewDefinition = ['', '', '', '', '', '', '', '', '', '', ''];
    }
    if (t.impostazioni.frameAttivo === undefined) {
      t.impostazioni.frameAttivo = [-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    }
    // logConsole(t.impostazioni.frameName[0][0]);
    if (t.impostazioni.frameName[0][0] === undefined) {
      t.impostazioni.frameName = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '<empty>');
      // logConsole(t.impostazioni.frameName);
    }
    if (!t.impostazioni.titoloFrame || !t.impostazioni.titoloFrame[0] || t.impostazioni.titoloFrame[0][0] === undefined) {
      t.impostazioni.titoloFrame = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '<empty>');
      // logConsole(t.impostazioni.frameName);
    }
    if (t.impostazioni.frameDesc[0][0] === undefined) {
      t.impostazioni.frameDesc = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
      // logConsole(t.impostazioni.frameName);
    }
    if (t.impostazioni.MappaOGrafico === undefined || t.impostazioni.MappaOGrafico[0][0] === undefined) {
      t.impostazioni.MappaOGrafico = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.tipoMappa[0][0] === undefined) {
      t.impostazioni.tipoMappa = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (!t.impostazioni.overviewZoom || t.impostazioni.overviewZoom[0][0] === undefined) {
      t.impostazioni.overviewZoom = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.barraAperta[0][0] === undefined) {
      t.impostazioni.barraAperta = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.layerMappa === undefined || t.impostazioni.layerMappa[0][0] === undefined) {
      t.impostazioni.layerMappa = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, -1);
    }
    if (t.impostazioni.mapType[0][0] === undefined) {
      t.impostazioni.mapType = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, -1);
    }
    if (t.impostazioni.isCheckedServingCell[0][0] === undefined) {
      t.impostazioni.isCheckedServingCell = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.showRays === undefined || t.impostazioni.showRays[0] === undefined || t.impostazioni.showRays[0][0] === undefined) {
      t.impostazioni.showRays = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.showMeasures === undefined || t.impostazioni.showMeasures[0] === undefined ||
      t.impostazioni.showMeasures[0][0] === undefined) {
      t.impostazioni.showMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.squareMeters === undefined || t.impostazioni.squareMeters[0] === undefined ||
      t.impostazioni.squareMeters[0][0] === undefined) {
      t.impostazioni.squareMeters = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 10);
    }
    if (t.impostazioni.measureType === undefined || t.impostazioni.measureType[0] === undefined ||
      t.impostazioni.measureType[0][0] === undefined) {
      t.impostazioni.measureType = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 1);
    }
    if (t.impostazioni.isCheckedShowPaths === undefined || t.impostazioni.isCheckedShowPaths[0] === undefined ||
        t.impostazioni.isCheckedShowPaths[0][0] === undefined) {
      t.impostazioni.isCheckedShowPaths = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
    }
    if (t.impostazioni.isCheckedAntenne[0][0] === undefined) {
      t.impostazioni.isCheckedAntenne = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 0);
    }
    if (t.impostazioni.measure[0][0] === undefined) {
      t.impostazioni.measure = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
        environment.quantiFrames, Utils.quanteMisure);
    }
    /* if (t.impostazioni.slaValue[0][0] === undefined) {
      t.impostazioni.slaValue = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, -1);
    } */
    if (t.impostazioni.slaName[0][0] === undefined) {
      t.impostazioni.slaName = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.activity[0][0] === undefined) {
      t.impostazioni.activity = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.activityName === undefined || t.impostazioni.activityName[0][0] === undefined) {
      t.impostazioni.activityName = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.plmn[0][0] === undefined) {
      t.impostazioni.plmn = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.netTech[0][0] === undefined) {
      t.impostazioni.netTech = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.shownEvents === undefined || t.impostazioni.shownEvents[0] === undefined ||
        t.impostazioni.shownEvents[0][0] === undefined) {
      t.impostazioni.shownEvents = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.modificaChart === undefined || t.impostazioni.modificaChart[0] === undefined ||
      t.impostazioni.modificaChart[0][0] === undefined) {
    t.impostazioni.modificaChart = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
      environment.quantiFrames, true);
  }
  if (t.impostazioni.bandwidth[0][0] === undefined) {
      t.impostazioni.bandwidth = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.countHistogram[0][0] === undefined) {
      t.impostazioni.countHistogram = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.checkSeverity[0][0] === undefined) {
      t.impostazioni.checkSeverity = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.listaEventi[0][0] === undefined) {
      t.impostazioni.listaEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.tabSelezionato[0][0] === undefined) {
      t.impostazioni.tabSelezionato = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.currZoom[0][0] === undefined) {
      t.impostazioni.currZoom = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 10);
    }
    if (t.impostazioni.viewAs[0][0] === undefined) {
      t.impostazioni.viewAs = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 2);
    }
    if (t.impostazioni.overlay[0][0] === undefined) {
      t.impostazioni.overlay = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.overlayCluster[0][0] === undefined) {
      t.impostazioni.overlayCluster = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.timeFilter[0][0] === undefined) {
      t.impostazioni.timeFilter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 2);
    }
    if (t.impostazioni.viewDefinition[0][0] === undefined) {
      t.impostazioni.viewDefinition = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    /* if (t.viewOlG === undefined || t.viewOlG[0][0] === undefined) {
      t.viewOlG = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, null);
    }
    if (t.viewOlL === undefined || t.viewOlL[0][0] === undefined) {
      t.viewOlL = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, null);
    } */
    if (t.impostazioni.dimensioniFinestraLegenda === undefined || t.impostazioni.dimensioniFinestraLegenda[0] === undefined) {
      t.impostazioni.dimensioniFinestraLegenda = ExternalUtilities.creaVettore(environment.quantiFrames, 5);
    }
    if (t.impostazioni.histDisplayAs === undefined || t.impostazioni.histDisplayAs[0][0][0] === undefined) {
      t.impostazioni.histDisplayAs = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
        environment.quantiFrames, Utils.quanteMisureHistogram);
    }
    if (t.impostazioni.columnsBars === undefined || t.impostazioni.columnsBars[0][0] === undefined) {
      t.impostazioni.columnsBars = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.doubleGraph === undefined || t.impostazioni.doubleGraph[0][0] === undefined) {
      t.impostazioni.doubleGraph = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
    }
    if (t.impostazioni.showPlanimetry === undefined || t.impostazioni.showPlanimetry[0][0] === undefined) {
      t.impostazioni.showPlanimetry = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
    }
    if (t.impostazioni.columnsSettings === undefined || t.impostazioni.columnsSettings[0][0][0] === undefined) {
      t.impostazioni.columnsSettings = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
        environment.quantiFrames, 10);
    }
    if (t.impostazioni.tipoEvento === undefined || t.impostazioni.tipoEvento[0][0] === undefined) {
      t.impostazioni.tipoEvento = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 'L');
    }
    if (t.impostazioni.fixedSeconds === undefined || t.impostazioni.fixedSeconds[0][0] === undefined) {
      t.impostazioni.fixedSeconds = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.styleSize === undefined || t.impostazioni.styleSize[0][0] === undefined) {
      t.impostazioni.styleSize = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 12);
    }
    if (t.impostazioni.cellType === undefined || t.impostazioni.cellType[0][0] === undefined) {
      t.impostazioni.cellType = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.addLayers === undefined || t.impostazioni.addLayers[0][0] === undefined) {
      t.impostazioni.addLayers = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.doNotSetGM === undefined || t.impostazioni.doNotSetGM[0][0] === undefined) {
      t.impostazioni.doNotSetGM = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
    }
    if (t.impostazioni.eventiSceltiES === undefined || t.impostazioni.eventiSceltiES[0] === undefined ||
        t.impostazioni.eventiSceltiES[0][0] === undefined) {
      t.impostazioni.eventiSceltiES = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtriEventi === undefined || t.impostazioni.filtriEventi[0][0] === undefined) {
      // alert('pulisco array filtroeventi');
      t.impostazioni.filtriEventi = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, undefined);
    }
    if (t.impostazioni.framesAttivi === undefined || t.impostazioni.framesAttivi[0][0] === undefined) {
      // alert('pulisco array filtroeventi');
      t.impostazioni.framesAttivi = ExternalUtilities.creaMatrice(environment.quantePagine,
        environment.quantiFrames, -1);
      // t.impostazioni.framesAttivi[t.pageSelector] = t.impostazioni.frameAttivo;
    }
    // logConsole('Creazione framesAttivi', t.impostazioni.framesAttivi);
    /* if (t.impostazioni.filtroEventiEscluso === undefined || t.impostazioni.filtroEventiEscluso[0][0] === undefined) {
      // alert('pulisco array filtroeventi');
      t.impostazioni.filtroEventiEscluso = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol1 === undefined || t.impostazioni.filtroEventiCol1[0][0] === undefined) {
      t.impostazioni.filtroEventiCol1 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol2 === undefined || t.impostazioni.filtroEventiCol2[0][0] === undefined) {
      t.impostazioni.filtroEventiCol2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol3 === undefined || t.impostazioni.filtroEventiCol3[0][0] === undefined) {
      t.impostazioni.filtroEventiCol3 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol4 === undefined || t.impostazioni.filtroEventiCol4[0][0] === undefined) {
      t.impostazioni.filtroEventiCol4 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol5 === undefined || t.impostazioni.filtroEventiCol5[0][0] === undefined) {
      t.impostazioni.filtroEventiCol5 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol6 === undefined || t.impostazioni.filtroEventiCol6[0][0] === undefined) {
      t.impostazioni.filtroEventiCol6 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol7 === undefined || t.impostazioni.filtroEventiCol7[0][0] === undefined) {
      t.impostazioni.filtroEventiCol7 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol8 === undefined || t.impostazioni.filtroEventiCol8[0][0] === undefined) {
      t.impostazioni.filtroEventiCol8 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol9 === undefined || t.impostazioni.filtroEventiCol9[0][0] === undefined) {
      t.impostazioni.filtroEventiCol9 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol10 === undefined || t.impostazioni.filtroEventiCol10[0][0] === undefined) {
      t.impostazioni.filtroEventiCol10 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol11 === undefined || t.impostazioni.filtroEventiCol11[0][0] === undefined) {
      t.impostazioni.filtroEventiCol11 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol12 === undefined || t.impostazioni.filtroEventiCol12[0][0] === undefined) {
      t.impostazioni.filtroEventiCol12 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol13 === undefined || t.impostazioni.filtroEventiCol13[0][0] === undefined) {
      t.impostazioni.filtroEventiCol13 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol14 === undefined || t.impostazioni.filtroEventiCol14[0][0] === undefined) {
      t.impostazioni.filtroEventiCol14 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol15 === undefined || t.impostazioni.filtroEventiCol15[0][0] === undefined) {
      t.impostazioni.filtroEventiCol15 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol16 === undefined || t.impostazioni.filtroEventiCol16[0][0] === undefined) {
      t.impostazioni.filtroEventiCol16 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol17 === undefined || t.impostazioni.filtroEventiCol17[0][0] === undefined) {
      t.impostazioni.filtroEventiCol17 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol18 === undefined || t.impostazioni.filtroEventiCol18[0][0] === undefined) {
      t.impostazioni.filtroEventiCol18 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol19 === undefined || t.impostazioni.filtroEventiCol19[0][0] === undefined) {
      t.impostazioni.filtroEventiCol19 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.filtroEventiCol20 === undefined || t.impostazioni.filtroEventiCol20[0][0] === undefined) {
      t.impostazioni.filtroEventiCol20 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    } */
    if (t.impostazioni.opacity === undefined || t.impostazioni.opacity[0][0] === undefined) {
      t.impostazioni.opacity = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.mosaicStyle === undefined || t.impostazioni.mosaicStyle[0][0] === undefined) {
      t.impostazioni.mosaicStyle = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.sartPosition === undefined || t.impostazioni.sartPosition[0][0] === undefined) {
      t.impostazioni.sartPosition = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
    }
    if (t.impostazioni.bboxOZ === undefined || t.impostazioni.bboxOZ[0][0] === undefined) {
      t.impostazioni.bboxOZ = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 1);
    }
    if (t.impostazioni.geoFilter === undefined || t.impostazioni.geoFilter[0][0] === undefined) {
      t.impostazioni.geoFilter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '0');
    }
    if (t.impostazioni.measureSMS === undefined || t.impostazioni.measureSMS[0][0] === undefined) {
      t.impostazioni.measureSMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.showMeasuresS === undefined || t.impostazioni.showMeasuresS[0] === undefined ||
      t.impostazioni.showMeasuresS[0][0] === undefined) {
      t.impostazioni.showMeasuresS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.tipoDataset === undefined || t.impostazioni.tipoDataset[0] === undefined || t.impostazioni.tipoDataset[0][0] === undefined) {
      t.impostazioni.tipoDataset = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 2);
    }
    if (t.impostazioni.mappeMS === undefined || t.impostazioni.mappeMS[0] === undefined || t.impostazioni.mappeMS[0][0] === undefined) {
      t.impostazioni.mappeMS = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 1);
    }
    if (t.impostazioni.clusterMeasure === undefined || t.impostazioni.clusterMeasure[0] === undefined || t.impostazioni.clusterMeasure[0][0] === undefined) {
      t.impostazioni.clusterMeasure = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.textFilter === undefined || t.impostazioni.textFilter[0] === undefined || t.impostazioni.textFilter[0][0] === undefined) {
      t.impostazioni.textFilter = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.addGlobalLayer === undefined || t.impostazioni.addGlobalLayer[0] === undefined || t.impostazioni.addGlobalLayer[0][0] === undefined) {
      t.impostazioni.addGlobalLayer = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
    }
    if (t.impostazioni.measureRCM === undefined || t.impostazioni.measureRCM[0] === undefined || t.impostazioni.measureRCM[0][0] === undefined) {
      t.impostazioni.measureRCM = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, -1);
    }
    if (t.impostazioni.eventsMeasure === undefined || t.impostazioni.eventsMeasure[0] === undefined || t.impostazioni.eventsMeasure[0][0] === undefined) {
      t.impostazioni.eventsMeasure = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
    }
    if (t.impostazioni.histDisplayAs === undefined || t.impostazioni.histDisplayAs[0] === undefined || t.impostazioni.histDisplayAs[0][0] === undefined) {
      t.impostazioni.histDisplayAs = ExternalUtilities.creaMatriceMisure(environment.quantiSottoFrames,
        environment.quantiFrames, Utils.quanteMisure);
    }
    if (t.impostazioni.showRaysAllLayer === undefined || t.impostazioni.showRaysAllLayer[0] === undefined || t.impostazioni.showRaysAllLayer[0][0] === undefined) {
      t.impostazioni.showRaysAllLayer = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
    }
    if (t.impostazioni.correlation === undefined || t.impostazioni.correlation[0] === undefined || t.impostazioni.correlation[0][0] === undefined) {
      t.impostazioni.correlation = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
    }
    if (t.impostazioni.isNonSyncEventTime === undefined || t.impostazioni.isNonSyncEventTime[0] === undefined || t.impostazioni.isNonSyncEventTime[0][0] === undefined) {
      t.impostazioni.isNonSyncEventTime = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
        // logConsole('Aggiustato array isNonSyncEventTime');
    }
    if (t.impostazioni.showCoverageMeasures === undefined || t.impostazioni.showCoverageMeasures[0] === undefined || t.impostazioni.showCoverageMeasures[0][0] === undefined) {
      t.impostazioni.showCoverageMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
        // logConsole('Aggiustato array showCoverageMeasures');
    }
    if (t.impostazioni.showVoiceCallMeasures === undefined || t.impostazioni.showVoiceCallMeasures[0] === undefined || t.impostazioni.showVoiceCallMeasures[0][0] === undefined) {
      t.impostazioni.showVoiceCallMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
        // logConsole('Aggiustato array showVoiceCallMeasures');
    }
    if (t.impostazioni.showDataMeasures === undefined || t.impostazioni.showDataMeasures[0] === undefined || t.impostazioni.showDataMeasures[0][0] === undefined) {
      t.impostazioni.showDataMeasures = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
        // logConsole('Aggiustato array showDataMeasures');
    }
    if (t.impostazioni.clusterMeasure2 === undefined || t.impostazioni.clusterMeasure2[0] === undefined || t.impostazioni.clusterMeasure2[0][0] === undefined) {
      t.impostazioni.clusterMeasure2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
        // logConsole('Aggiustato array clusterMeasure2');
    }
    /* if (t.impostazioni.lov === undefined || t.impostazioni.lov[0] === undefined || t.impostazioni.lov[0][0] === undefined) {
      t.impostazioni.lov = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, false);
        // logConsole('Aggiustato array clusterMeasure2');
    } */
    if (t.impostazioni.textFilter2 === undefined || t.impostazioni.textFilter2[0] === undefined || t.impostazioni.textFilter2[0][0] === undefined) {
      t.impostazioni.textFilter2 = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
        // logConsole('Aggiustato array textFilter2');
    }
    if (t.impostazioni.listaCampiTCRP === undefined || t.impostazioni.listaCampiTCRP[0] === undefined || t.impostazioni.listaCampiTCRP[0][0] === undefined) {
      t.impostazioni.listaCampiTCRP = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, undefined);
        // logConsole('Aggiustato array textFilter2');
    }
    if (t.impostazioni.dimensioniSplitTcRun === undefined || t.impostazioni.dimensioniSplitTcRun[0] === undefined || t.impostazioni.dimensioniSplitTcRun[0][0] === undefined) {
      t.impostazioni.dimensioniSplitTcRun = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, undefined);
        // logConsole('Aggiustato array textFilter2');
    }
    if (t.impostazioni.impostazioniPivotGrid === undefined || t.impostazioni.impostazioniPivotGrid[0] === undefined || t.impostazioni.impostazioniPivotGrid[0][0] === undefined) {
      t.impostazioni.impostazioniPivotGrid = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, undefined);
        // logConsole('Aggiustato array textFilter2');
    }
    if (t.impostazioni.tipoDatiLayout === undefined || t.impostazioni.tipoDatiLayout[0] === undefined || t.impostazioni.tipoDatiLayout[0][0] === undefined) {
      t.impostazioni.tipoDatiLayout = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, 3);
        // logConsole('Aggiustato array textFilter2');
    }
    if (t.impostazioni.isCheckedShowSelectedPaths === undefined || t.impostazioni.isCheckedShowSelectedPaths[0] === undefined || t.impostazioni.isCheckedShowSelectedPaths[0][0] === undefined) {
      t.impostazioni.isCheckedShowSelectedPaths = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, true);
        // logConsole('Aggiustato array textFilter2');
    }
    /* if (t.impostazioni.textLov === undefined || t.impostazioni.textLov[0] === undefined || t.impostazioni.textLov[0][0] === undefined) {
      t.impostazioni.textLov = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, '');
        // logConsole('Aggiustato array textLov');
    } */
    // logConsole('Aggiustato array');
    this.controllaImpostazioniSize(t, 'AggiustaArray');

    // this.controllaDimensioneGiusta(t, Utils);
  }

  SistemaDimensioni(array, valore) {
    let ritorno = array;
    
    if (!ritorno) {
      ritorno = ExternalUtilities.creaMatrice(environment.quantiSottoFrames,
        environment.quantiFrames, valore)
    }

    if (ritorno.length < environment.quantiSottoFrames + 1) {
      const inizio = ritorno.length;
      for (let i = inizio; i <= environment.quantiSottoFrames; i++) {
        const riga = new Array();
        for (let k = 0; k <= environment.quantiFrames; k++) {
          riga.push(valore);
        }
        ritorno.push(riga);
      }
    }

    return JSON.parse(JSON.stringify(ritorno));
  }

  controllaDimensioneGiusta(t, Utils) {
    // return;
    
    const misure1 = new Array();
    for (let i = 0; i < Utils.quanteMisure; i++) {
      misure1.push('');
    }
    t.impostazioni.measure = this.SistemaDimensioni(t.impostazioni.measure, misure1);

    const misure2 = new Array();
    for (let i = 0; i < Utils.quanteMisureHistogram; i++) {
      misure2.push('');
    }
    t.impostazioni.histDisplayAs = this.SistemaDimensioni(t.impostazioni.histDisplayAs, misure2);

    t.impostazioni.frameName = this.SistemaDimensioni(t.impostazioni.frameName, '<empty>');
    t.impostazioni.titoloFrame = this.SistemaDimensioni(t.impostazioni.titoloFrame, '<empty>');
    t.impostazioni.frameDesc = this.SistemaDimensioni(t.impostazioni.frameDesc, '');
    t.impostazioni.MappaOGrafico = this.SistemaDimensioni(t.impostazioni.MappaOGrafico, '');
    t.impostazioni.tipoMappa = this.SistemaDimensioni(t.impostazioni.tipoMappa, '');
    t.impostazioni.overViewZoom = this.SistemaDimensioni(t.impostazioni.overViewZoom, true);
    t.impostazioni.barraAperta = this.SistemaDimensioni(t.impostazioni.barraAperta, true);
    t.impostazioni.layerMappa = this.SistemaDimensioni(t.impostazioni.layerMappa, -1);
    t.impostazioni.mapType = this.SistemaDimensioni(t.impostazioni.mapType, -1);
    t.impostazioni.isCheckedServingCell = this.SistemaDimensioni(t.impostazioni.isCheckedServingCell, true);
    t.impostazioni.showRays = this.SistemaDimensioni(t.impostazioni.showRays, true);
    t.impostazioni.showMeasures = this.SistemaDimensioni(t.impostazioni.showMeasures, true);
    t.impostazioni.squareMeters = this.SistemaDimensioni(t.impostazioni.squareMeters, 10);
    t.impostazioni.measureType = this.SistemaDimensioni(t.impostazioni.measureType, 1);
    t.impostazioni.isCheckedShowPaths = this.SistemaDimensioni(t.impostazioni.isCheckedShowPaths, false);
    t.impostazioni.isCheckedAntenne = this.SistemaDimensioni(t.impostazioni.isCheckedAntenne, 0);
    t.impostazioni.slaName = this.SistemaDimensioni(t.impostazioni.slaName, '');
    t.impostazioni.activity = this.SistemaDimensioni(t.impostazioni.activity, '');
    t.impostazioni.activityName = this.SistemaDimensioni(t.impostazioni.activityName, '');
    t.impostazioni.plmn = this.SistemaDimensioni(t.impostazioni.plmn, '');
    t.impostazioni.netTech = this.SistemaDimensioni(t.impostazioni.netTech, '');
    t.impostazioni.shownEvents = this.SistemaDimensioni(t.impostazioni.shownEvents, true);
    t.impostazioni.modificaChart = this.SistemaDimensioni(t.impostazioni.modificaChart, true);
    t.impostazioni.bandwidth = this.SistemaDimensioni(t.impostazioni.bandwidth, true);
    t.impostazioni.countHistogram = this.SistemaDimensioni(t.impostazioni.countHistogram, true);
    t.impostazioni.checkSeverity = this.SistemaDimensioni(t.impostazioni.checkSeverity, true);
    t.impostazioni.listaEventi = this.SistemaDimensioni(t.impostazioni.listaEventi, true);
    t.impostazioni.tabSelezionato = this.SistemaDimensioni(t.impostazioni.tabSelezionato, true);
    t.impostazioni.currZoom = this.SistemaDimensioni(t.impostazioni.currZoom, 10);
    t.impostazioni.viewAs = this.SistemaDimensioni(t.impostazioni.viewAs, 2);
    t.impostazioni.overlay = this.SistemaDimensioni(t.impostazioni.overlay, '');
    t.impostazioni.overlayCluster = this.SistemaDimensioni(t.impostazioni.overlayCluster, '');
    t.impostazioni.timeFilter = this.SistemaDimensioni(t.impostazioni.timeFilter, 2);
    t.impostazioni.viewDefinition = this.SistemaDimensioni(t.impostazioni.viewDefinition, '');
    t.impostazioni.columnsBars = this.SistemaDimensioni(t.impostazioni.columnsBars, true);
    t.impostazioni.doubleGraph = this.SistemaDimensioni(t.impostazioni.doubleGraph, false);
    t.impostazioni.showPlanimetry = this.SistemaDimensioni(t.impostazioni.showPlanimetry, false);
    t.impostazioni.columnsSettings = this.SistemaDimensioni(t.impostazioni.columnsSettings, 10);
    t.impostazioni.tipoEvento = this.SistemaDimensioni(t.impostazioni.tipoEvento, 'L');
    t.impostazioni.fixedSeconds = this.SistemaDimensioni(t.impostazioni.fixedSeconds, '');
    t.impostazioni.styleSize = this.SistemaDimensioni(t.impostazioni.styleSize, 12);
    t.impostazioni.cellType = this.SistemaDimensioni(t.impostazioni.cellType, '');
    t.impostazioni.addLayers = this.SistemaDimensioni(t.impostazioni.addLayers, '');
    t.impostazioni.doNotSetGM = this.SistemaDimensioni(t.impostazioni.doNotSetGM, false);
    t.impostazioni.eventiSceltiES = this.SistemaDimensioni(t.impostazioni.eventiSceltiES, '');
    t.impostazioni.filtriEventi = this.SistemaDimensioni(t.impostazioni.filtriEventi, undefined);
    t.impostazioni.framesAttivi = this.SistemaDimensioni(t.impostazioni.framesAttivi, -1);
    t.impostazioni.opacity = this.SistemaDimensioni(t.impostazioni.opacity, '');
    t.impostazioni.mosaicStyle = this.SistemaDimensioni(t.impostazioni.mosaicStyle, '');
    t.impostazioni.sartPosition = this.SistemaDimensioni(t.impostazioni.sartPosition, false);
    t.impostazioni.bboxOZ = this.SistemaDimensioni(t.impostazioni.bboxOZ, 1);
    t.impostazioni.geoFilter = this.SistemaDimensioni(t.impostazioni.geoFilter, '0');
    t.impostazioni.measureSMS = this.SistemaDimensioni(t.impostazioni.measureSMS, '');
    t.impostazioni.showMeasuresS = this.SistemaDimensioni(t.impostazioni.showMeasuresS, true);
    t.impostazioni.tipoDataset = this.SistemaDimensioni(t.impostazioni.tipoDataset, 2);
    t.impostazioni.mappeMS = this.SistemaDimensioni(t.impostazioni.mappeMS, 1);
    t.impostazioni.clusterMeasure = this.SistemaDimensioni(t.impostazioni.clusterMeasure, '');
    t.impostazioni.textFilter = this.SistemaDimensioni(t.impostazioni.textFilter, '');
    t.impostazioni.addGlobalLayer = this.SistemaDimensioni(t.impostazioni.addGlobalLayer, false);
    t.impostazioni.measureRCM = this.SistemaDimensioni(t.impostazioni.measureRCM, -1);
    t.impostazioni.eventsMeasure = this.SistemaDimensioni(t.impostazioni.eventsMeasure, false);
    t.impostazioni.showRaysAllLayer = this.SistemaDimensioni(t.impostazioni.showRaysAllLayer, true);
    t.impostazioni.correlation = this.SistemaDimensioni(t.impostazioni.correlation, '');
    t.impostazioni.isNonSyncEventTime = this.SistemaDimensioni(t.impostazioni.isNonSyncEventTime, false);
    t.impostazioni.showCoverageMeasures = this.SistemaDimensioni(t.impostazioni.showCoverageMeasures, false);
    t.impostazioni.showVoiceCallMeasures = this.SistemaDimensioni(t.impostazioni.showVoiceCallMeasures, false);
    t.impostazioni.showDataMeasures = this.SistemaDimensioni(t.impostazioni.showDataMeasures, false);
    t.impostazioni.clusterMeasure2 = this.SistemaDimensioni(t.impostazioni.clusterMeasure2, false);
    t.impostazioni.textFilter2 = this.SistemaDimensioni(t.impostazioni.textFilter2, '');
    t.impostazioni.listaCampiTCRP = this.SistemaDimensioni(t.impostazioni.listaCampiTCRP, undefined);
    t.impostazioni.dimensioniSplitTcRun = this.SistemaDimensioni(t.impostazioni.dimensioniSplitTcRun, undefined);
    t.impostazioni.impostazioniPivotGrid = this.SistemaDimensioni(t.impostazioni.impostazioniPivotGrid, undefined);
    t.impostazioni.tipoDatiLayout = this.SistemaDimensioni(t.impostazioni.tipoDatiLayout, 3);
    t.impostazioni.isCheckedShowSelectedPaths = this.SistemaDimensioni(t.impostazioni.isCheckedShowSelectedPaths, true);
  }

  controllaImpostazioniSize(t, daDove) {
    // logConsole('CIS: ', daDove, t.impostazioni.maskSize, t.pageSelector);

    if (t.impostazioni.maskSize === undefined || t.impostazioni.maskSize[t.pageSelector] === undefined ||
      (t.impostazioni.maskSize[t.pageSelector] && t.impostazioni.maskSize[t.pageSelector][0] === undefined)) {

      /* logConsole('Mask size', this.impostazioni.maskSize,
        this.impostazioni.maskSize[this.pageSelector],
        this.impostazioni.maskSize[this.pageSelector][0],
        typeof(this.impostazioni.maskSize[this.pageSelector][0][0])); */

      const m = new Array();
      for (let i = 0; i <= environment.quantiSottoFrames; i++) {
        // const n = new Array();
        // n.push(new Array());
        // for(let k = 0; k <= environment.quantiFrames; k ++) {
        //   n.push([33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34]);
        // /* }
        m.push([33, 33, 33, 33, 33, 33, 33, 33, 34, 34, 34])
      }
      t.impostazioni.maskSize = m;
      // logConsole('Pulisco Mask size 1', t.impostazioni.maskSize);
    }

    if (t.impostazioni.maskSizeHor === undefined || t.impostazioni.maskSizeHor[t.pageSelector] === undefined ||
      (t.impostazioni.maskSizeHor[t.pageSelector] && t.impostazioni.maskSizeHor[t.pageSelector][0] === undefined)) {
      const m = new Array();
      for (let i = 0; i <= environment.quantiSottoFrames; i++) {
        /* const n = new Array();
        // n.push(new Array());
        for(let k = 0; k <= environment.quantiFrames; k ++) {
          n.push([33, 33, 33, 34]);
        } */
        m.push([33, 33, 33, 34])
      }
      t.impostazioni.maskSizeHor = m;
      // logConsole('Pulisco Mask size hor 2', t.impostazioni.maskSizeHor);
    }
    // logConsole('Mask visible 3', this.impostazioni.maskVisible, this.impostazioni.maskVisible[0].length);
    /* if (t.impostazioni.maskVisible === undefined || t.impostazioni.maskVisible[t.pageSelector] === undefined ||
      (t.impostazioni.maskVisible[t.pageSelector] && t.impostazioni.maskVisible[t.pageSelector][0] === undefined)) {

      const v = new Array();
      for (let i = 0; i <= environment.quantiSottoFrames; i++) {
        v.push(true)
      }

      const m = new Array();
      for (let i = 0; i <= environment.quantiFrames; i++) {
        m.push(v);
      }
      t.impostazioni.maskVisible = m;
      logConsole('Puisco Mask visible 3', t.impostazioni.maskVisible);
    } */

    this.sistemaFiltroEventi(t);
  }

  sistemaFiltroEventi(t) {
    if (!t.impostazioni.filtroEventiCol1) {
      return;
    }
    // alert('Sistemo filtro');
    // logConsole('SISTEMA FILTRO INIZIO', JSON.parse(JSON.stringify(t.impostazioni)));

    const ff = new Array();
    for (let pagina = 0; pagina < environment.quantiSottoFrames; pagina++) {
      ff.push(new Array());
      for (let frame = 0; frame < environment.quantiFrames; frame++) {
        ff[pagina].push(new Array());
      }
    }

    const nomi = ['filtroEventiCol1', 'filtroEventiCol2', 'filtroEventiCol2', 'filtroEventiCol3', 'filtroEventiCol4', 'filtroEventiCol5'
      , 'filtroEventiCol6', 'filtroEventiCol7', 'filtroEventiCol8', 'filtroEventiCol9', 'filtroEventiCol10'
      , 'filtroEventiCol11', 'filtroEventiCol12', 'filtroEventiCol13', 'filtroEventiCol14', 'filtroEventiCol5'
      , 'filtroEventiCol16', 'filtroEventiCol17', 'filtroEventiCol18', 'filtroEventiCol19', 'filtroEventiCol20'];

    for (let pagina = 0; pagina < environment.quantiSottoFrames; pagina++) {
      for (let frame = 0; frame < environment.quantiFrames; frame++) {
        const f = {
          filtroImpostato: '',
          filtroEscluso: '',
          filtriAttivi: new Array()
        }

        if (t.impostazioni.filtroEventi && t.impostazioni.filtroEventi[pagina] && t.impostazioni.filtroEventi[pagina][frame]) {
          f.filtroImpostato = t.impostazioni.filtroEventi[pagina][frame];
        }
        if (t.impostazioni.filtroEventiEscluso && t.impostazioni.filtroEventiEscluso[pagina] && t.impostazioni.filtroEventiEscluso[pagina][frame]) {
          f.filtroEscluso = t.impostazioni.filtroEventiEscluso[pagina][frame];
        }

        nomi.forEach(element => {
          f.filtriAttivi.push(this.aggiungeElemento(t, element, pagina, frame));
        });

        // logConsole('SISTEMA FILTRO', pagina, frame, f);
        ff[pagina][frame] = f;
        ff[pagina][frame]['columnCompressed'] = true;
      }
    }
    // logConsole('SISTEMA FILTRO 1', JSON.parse(JSON.stringify(ff)));

    delete t.impostazioni.filtroEventi;
    delete t.impostazioni.filtroEventiEscluso;
    nomi.forEach(element => {
      delete t.impostazioni[element];
    });

    t.impostazioni.filtriEventi = JSON.parse(JSON.stringify(ff));
    // logConsole('SISTEMA FILTRO FINE', t.impostazioni.filtriEventi);
  }

  aggiungeElemento(t, nomeCampo, pagina, frame) {
    if (t.impostazioni[nomeCampo] && t.impostazioni[nomeCampo][pagina] && t.impostazioni[nomeCampo][pagina][frame]) {
      let ogg = t.impostazioni[nomeCampo][pagina][frame];
      // logConsole('SISTEMA FILTRO', ogg, nomeCampo, pagina, frame);
      if (typeof(ogg) === 'object') {
        ogg = ogg[0];
      }
      const c = {
        Campo: ogg,
        NomeColonna: ''
      }
      return c;
    } else {
      const c = {
        Campo: '',
        NomeColonna: ''
      }
      return c;
    }
  }
}

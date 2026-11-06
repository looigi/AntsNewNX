import { logConsole } from '../console-log';
import { Injectable } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@Injectable()
export class ContaDimensioneArrayComponent {
    somma = 0;

    contaSpazio(t) {
        this.somma = 0;

        switch (t.MappaOGrafico2) {
            case 'M':
                this.calcolaPesoMappa(t);
                this.converteESommaArray('mappaVisibile', t.mappaVisibile);
                this.converteESommaArray('misureGlobaliMappa', t.misureGlobaliMappa);
                this.converteESommaArray('viewAs2', t.viewAs, true);
                // this.converteESommaArray('', t.map1[t.NumeroFrame2]);
                this.converteESommaArray('datiAddLayers', t.datiAddLayers2, true);
                this.converteESommaArray('currZoom', t.currZoom);
                this.converteESommaArray('mappaForzata', t.mappaForzata);
                this.converteESommaArray('ultimaVoltaRC', t.ultimaVoltaRC);
                this.converteESommaArray('viewMappaAttuale', t.viewMappaAttuale);
                this.converteESommaArray('lastCallAntenne', t.lastCallAntenne);
                this.converteESommaArray('lastCallAntenneDD', t.lastCallAntenneDD);
                this.converteESommaArray('lastCallCluster', t.lastCallCluster);
                this.converteESommaArray('measureLayer', t.measureLayer);
                this.converteESommaArray('lastCallMeasures', t.lastCallMeasures);
                this.converteESommaArray('lastCallMeasuresSMS', t.lastCallMeasuresSMS);
                this.converteESommaArray('lastCallPath', t.lastCallPath);
                this.converteESommaArray('lastCallPath2', t.lastCallPath2);
                this.converteESommaArray('lastCallPath3', t.lastCallPath3);
                this.converteESommaArray('lastCallPath4', t.lastCallPath4);
                this.converteESommaArray('lastCallPathSC', t.lastCallPathSC);
                this.converteESommaArray('lastCallSartPosition', t.lastCallSartPosition);
                this.converteESommaArray('lastCallSchedSel', t.lastCallSchedSel);
                this.converteESommaArray('agentPosition', t.agentPosition);
                this.converteESommaArray('puntoSelezionato', t.puntoSelezionato);
                this.converteESommaArray('lastCallSRAL1', t.lastCallSRAL1);
                this.converteESommaArray('lastCallSRAL', t.lastCallSRAL);
                this.converteESommaArray('stringaRitorno', t.stringaRitorno);
                this.converteESommaArray('lastUrl', t.lastUrl);
                this.converteESommaArray('staLeggendo', t.staLeggendo);
                this.converteESommaArray('esci', t.esci);
                this.converteESommaArray('checkFalso', t.checkFalso);
                this.converteESommaArray('lastCallAL', t.lastCallAL);
                this.converteESommaArray('lastCallAL2', t.lastCallAL2);
                this.converteESommaArray('timer', t.timer);
                this.converteESommaArray('lastCallLegenda', t.lastCallLegenda);
                this.converteESommaArray('wmsPuntoSelezionato', t.wmsPuntoSelezionato);
                this.converteESommaArray('wmsSMS', t.wmsSMS);
                this.converteESommaArray('wmsEvents', t.wmsEvents);
                // this.converteESommaArray('pathEvents', t.pathEvents);
                this.converteESommaArray('pathLayer', t.pathLayer);
                this.converteESommaArray('pathLayerGeometry', t.pathLayerGeometry);
                this.converteESommaArray('pathLayerClickato', t.pathLayerClickato);
                this.converteESommaArray('pathLayerBBOX', t.pathLayerBBOX);
                this.converteESommaArray('wms', t.wms);
                this.converteESommaArray('measureLayer', t.measureLayer);                
                break;
            case 'AH':
                this.contaDimensioniCanvasIstogrammi(t);
                this.converteESommaArray('measureDaDisegnareHistogram', t.measureDaDisegnareHistogram);
                this.converteESommaArray('visualizzaGrigliaExportH', t.visualizzaGrigliaExportH);
                this.converteESommaArray('datiGrigliaExportH', t.datiGrigliaExportH);
                this.converteESommaArray('ultimiDatiGrigliaIsto', t.ultimiDatiGrigliaIsto);
                this.converteESommaArray('lastCallHistogram', t.lastCallHistogram);
                this.converteESommaArray('vecchioJson', t.vecchioJson);
                this.converteESommaArray('tipiApp', t.tipiApp);
                this.converteESommaArray('arrayApp', t.arrayApp);
                this.converteESommaArray('righeApp', t.righeApp);
                this.converteESommaArray('nomiLabelsApp', t.nomiLabelsApp);
                this.converteESommaArray('chartsIstogrammi', t.chartsIstogrammi);
                this.converteESommaArray('dimeBarre', t.dimeBarre);
                this.converteESommaArray('dimeYApp', t.dimeYApp);
                this.converteESommaArray('asseXMinimo', t.asseXMinimo);
                this.converteESommaArray('asseXMassimo', t.asseXMassimo);
                this.converteESommaArray('numeroColonne', t.numeroColonne);
                this.converteESommaArray('timeStampChiamataIstogramm', t.timeStampChiamataIstogramm);
                this.converteESommaArray('altezzaGraficiIstogrammi', t.altezzaGraficiIstogrammi);
                this.converteESommaArray('chiSonoIstogrammi', t.chiSonoIstogrammi);
                this.converteESommaArray('staGiaDisegnandoGraficiHistogram', t.staGiaDisegnandoGraficiHistogram);
                this.converteESommaArray('ciSonoDatiIstogrammi', t.ciSonoDatiIstogrammi);
                this.converteESommaArray('effettuaAutoFitAH', t.effettuaAutoFitAH);
                break;
            case 'LA':
                this.contaDimensioniGriglia('gridActivities_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiActivities', t.datiActivities);
                this.converteESommaArray('lastCallActivities', t.lastCallActivities);
                this.converteESommaArray('datiActivities', t.datiActivities);
                this.converteESommaArray('erroreActivities', t.erroreActivities);
                this.converteESommaArray('timeStampChiamataActivities1', t.timeStampChiamataActivities1);
                this.converteESommaArray('timeStampChiamataActivities2', t.timeStampChiamataActivities2);
                this.converteESommaArray('chiSonoActivities', t.chiSonoActivities);
                break;
            case 'AI':
                this.contaDimensioniGriglia('gridAreaInfo_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiAreaInfo', t.datiAreaInfo);
                this.converteESommaArray('lastCallAreaInfo', t.lastCallAreaInfo);
                this.converteESommaArray('datiAreaInfo', t.datiAreaInfo);
                this.converteESommaArray('erroreAreaInfo', t.erroreAreaInfo);
                this.converteESommaArray('timeStampChiamataAreaInfo', t.timeStampChiamataAreaInfo);
                this.converteESommaArray('vecchiDatiAreaInfo', t.vecchiDatiAreaInfo);
                this.converteESommaArray('chiSonoAreaInfo', t.chiSonoAreaInfo);
                break;
            case 'MC':
                this.contaDimensioniCanvasGrafici(t);
                this.converteESommaArray('ultimoArrayMisure', t.ultimoArrayMisure);
                this.converteESommaArray('ultimoArrayMisureMappa', t.ultimoArrayMisureMappa);
                this.converteESommaArray('lastCallGrafici', t.lastCallGrafici);
                this.converteESommaArray('lastCallTmsToGps', t.lastCallTmsToGps);
                this.converteESommaArray('tipoGrafico', t.tipoGrafico);
                this.converteESommaArray('larghezzaDiv', t.larghezzaDiv);
                this.converteESommaArray('quantiPuntiGrafico', t.quantiPuntiGrafico);
                this.converteESommaArray('dimeBarra', t.dimeBarra);
                this.converteESommaArray('datiAppoggio', t.datiAppoggio);
                this.converteESommaArray('dataInizio', t.dataInizio);
                this.converteESommaArray('dataFine', t.dataFine);
                this.converteESommaArray('array2', t.array2);
                this.converteESommaArray('folders', t.folders);
                this.converteESommaArray('contaGrafici', t.contaGrafici);
                this.converteESommaArray('tmsGrafici', t.tmsGrafici);
                // this.converteESommaArray('chartsGrafici', t.chartsGrafici);
                this.converteESommaArray('giaDisegnataStruttura', t.giaDisegnataStruttura);
                this.converteESommaArray('dataPointsAppoggio', t.dataPointsAppoggio);
                this.converteESommaArray('DPNulloVecchio', t.DPNulloVecchio);
                this.converteESommaArray('DPNullo', t.DPNullo);
                this.converteESommaArray('vecchioaArrayMisure', t.vecchioaArrayMisure);
                this.converteESommaArray('puntiniAppoggio', t.puntiniAppoggio);
                this.converteESommaArray('nomiChart', t.nomiChart);
                this.converteESommaArray('nomiGrafici', t.nomiGrafici);
                this.converteESommaArray('numSamples', t.numSamples);
                this.converteESommaArray('minimo', t.minimo);
                this.converteESommaArray('massimo', t.massimo);
                this.converteESommaArray('minimoY', t.minimoY);
                this.converteESommaArray('massimoY', t.massimoY);
                this.converteESommaArray('graficoVisibile', t.graficoVisibile);
                this.converteESommaArray('measureDaDisegnare', t.measureDaDisegnare);
                this.converteESommaArray('altezzaGraficiChart', t.altezzaGraficiChart);
                this.converteESommaArray('erroreGrafici', t.erroreGrafici);
                this.converteESommaArray('altezzaTotaleGrafici', t.altezzaTotaleGrafici);
                break;
            case 'PC':
                this.contaDimensioniCanvasPareto(t);
                this.converteESommaArray('messaggioErrorePareto', t.messaggioErrorePareto);
                this.converteESommaArray('lastCallPareto', t.lastCallPareto);
                this.converteESommaArray('vecchioJsonPareto', t.vecchioJsonPareto);
                this.converteESommaArray('chartsPareto', t.chartsPareto);
                this.converteESommaArray('righePareto', t.righePareto);
                this.converteESommaArray('tipiPareto', t.tipiPareto);
                this.converteESommaArray('conteggi', t.conteggi);
                this.converteESommaArray('arrayPareto', t.arrayPareto);
                this.converteESommaArray('minXPareto', t.minXPareto);
                this.converteESommaArray('maxXPareto', t.maxXPareto);
                this.converteESommaArray('timeStampChiamataPareto', t.timeStampChiamataPareto);
                this.converteESommaArray('chiSonoPareto', t.chiSonoPareto);
                this.converteESommaArray('forzaRidisegnoPareto', t.forzaRidisegnoPareto);
                this.converteESommaArray('altezzaPareto', t.altezzaPareto);
                break;
            case 'TC':
                this.contaDimensioniGriglia('gridTcRun_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiTcRun', t.datiTcRun);
                this.converteESommaArray('lastCallTCRun', t.lastCallTCRun);
                this.converteESommaArray('datiTcRun', t.datiTcRun);
                this.converteESommaArray('timeStampChiamataTCRUN', t.timeStampChiamataTCRUN);
                this.converteESommaArray('vecchiDatiTcRun', t.vecchiDatiTcRun);
                this.converteESommaArray('erroreTcRun', t.erroreTcRun);
                this.converteESommaArray('chiSonoTcRun', t.chiSonoTcRun);
                break;
            case 'AE':
                this.contaDimensioniGriglia('gridAgents_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.contaDimensioniGriglia('gridDatiPointActivityEvents_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiAgents', t.datiAgents);
                this.converteESommaArray('selezioneAgent', t.selezioneAgent);
                this.converteESommaArray('selezioneAgentID', t.selezioneAgentID);
                this.converteESommaArray('datiPointActivityEvents', t.datiPointActivityEvents);
                this.converteESommaArray('testoDettaglioEventi', t.testoDettaglioEventi);
                this.converteESommaArray('lastCallLista', t.lastCallLista);
                this.converteESommaArray('lastCallCrossTab', t.lastCallCrossTab);
                this.converteESommaArray('lastCallEventi', t.lastCallEventi);
                this.converteESommaArray('lastCallES', t.lastCallES);
                this.converteESommaArray('appoEventSummary', t.appoEventSummary);
                this.converteESommaArray('erroreEventSummary', t.erroreEventSummary);
                this.converteESommaArray('righeTotali', t.righeTotali);
                this.converteESommaArray('contaEvent', t.contaEvent);
                this.converteESommaArray('js3old', t.js3old);
                this.converteESommaArray('lastTms', t.lastTms);
                this.converteESommaArray('datiPointActivityEvents', t.datiPointActivityEvents);
                this.converteESommaArray('vecchiDatiEventi', t.vecchiDatiEventi);
                this.converteESommaArray('chiSonoEventi', t.chiSonoEventi);
                this.converteESommaArray('filtriEventi2', t.filtriEventi2);
                this.converteESommaArray('filtroEventiMemorizzati', t.filtroEventiMemorizzati);
                break;
            case 'PS':
                this.contaDimensioniCanvasScatter(t);
                this.converteESommaArray('lastCallScatter', t.lastCallScatter);
                this.converteESommaArray('vecchioJsonScatter', t.vecchioJsonScatter);
                this.converteESommaArray('chartsScatter', t.chartsScatter);
                this.converteESommaArray('arrayScatter', t.arrayScatter);
                this.converteESommaArray('righeScatter', t.righeScatter);
                this.converteESommaArray('tipiScatter', t.tipiScatter);
                this.converteESommaArray('asseYMin', t.asseYMin);
                this.converteESommaArray('asseYMax', t.asseYMax);
                this.converteESommaArray('asseXMin', t.asseXMin);
                this.converteESommaArray('asseXMax', t.asseXMax);
                this.converteESommaArray('coloriFinali', t.coloriFinali);
                this.converteESommaArray('timeStampChiamataScatter', t.timeStampChiamataScatter);
                this.converteESommaArray('forzaRidisegnoScatter', t.forzaRidisegnoScatter);
                this.converteESommaArray('chiSonoScatter', t.chiSonoScatter);
                break;
            case 'ES':
                this.contaDimensioniGriglia('gridEventSummary_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiEventSummary', t.datiEventSummary);
                break;
            case 'PM':
                this.contaDimensioniGriglia('gridPointMeasures_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiPointMeasures', t.datiPointMeasures);                
                break;
            case 'PL':
                this.contaDimensioniGriglia('gridPointLayerInfo_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiPointLayerInfo', t.datiPointLayerInfo);              
                break;
            case 'PK':
                this.contaDimensioniGriglia('gridPointCellMeasures_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiPointCellMeasures', t.datiPointCellMeasures);              
                break;
            case 'MD':
                this.contaDimensioniGriglia('gridPointMeasureDFN_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiPointMeasureDFN', t.datiPointMeasureDFN);              
                break;
            case 'MG':
                this.contaDimensioniGriglia('gridMosaicGrid_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiMosaicGrid', t.datiMosaicGrid);
                break;
            case 'CG':
                this.contaDimensioniGriglia('gridClusterGrid_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiClusterGrid', t.datiClusterGrid);
                break;
            case 'CM':
                this.contaDimensioniGriglia('gridCellMeasure_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiCellMeasure', t.datiCellMeasure);
                break;
            case 'CD':
                this.contaDimensioniGriglia('gridCdrData_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.contaDimensioniGriglia('gridCdrDataD_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiCdrData', t.datiCdrData);
                this.converteESommaArray('datiCdrDataD', t.datiCdrDataD);
                break;
            case 'CV':
                this.contaDimensioniGriglia('gridCdrSummary_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.contaDimensioniGriglia('gridCdrSummaryV_' + t.NumeroFrame2 + '_' + t.frameAttivo2);
                this.converteESommaArray('datiCdrSummary', t.datiCdrSummary);
                this.converteESommaArray('datiCdrVoice', t.datiCdrVoice);
                break;
        }

        this.converteESommaArray('Activity', t.Activity, true);
        this.converteESommaArray('ActivityName', t.ActivityName, true);
        this.converteESommaArray('ActivityNameLS_A', t.ActivityNameLS_A);
        this.converteESommaArray('ActivitySetName', t.ActivitySetName);
        this.converteESommaArray('ActivitySetNamePassato', t.ActivitySetNamePassato);
        this.converteESommaArray('listaEventiDaPassare', t.listaEventiDaPassare, true);
        this.converteESommaArray('ActivityTimeSpan', t.ActivityTimeSpan);
        this.converteESommaArray('CambioTmsSelezionato', t.CambioTmsSelezionato);
        this.converteESommaArray('DPNulloVecchio', t.DPNulloVecchio);
        this.converteESommaArray('Measure', t.Measure);
        this.converteESommaArray('MeasureDN', t.MeasureDN);
        /* this.converteESommaArray('Utils', t.Utils);

        if (t.CanvJS) {
            this.somma += t.CanvJS.length;
        } */

        let s = this.somma;
        const dime = ['B.', 'Kb.', 'Mb.', 'Gb.', 'Tb.', 'Pb.', 'Eb.', 'Zb.', 'Yb.' ];
        let qualeDime = 0;
        while (s > 1024) {
            s = (s / 1024);
            qualeDime++;
        }

        s = Math.round(s * 100) / 100;

        return s + ' ' + dime[qualeDime];
    }

    converteESommaArray(nomeArr, arr, doppio?) {
        let somma = 0;

        if (arr) {
            if (typeof(arr) === 'object') {
                try {
                    const a = JSON.stringify(arr).replace(/[\[\]\,\"]/g,'');
                    const dime = a.length;
                    if (dime !== undefined && dime > 0) {
                        somma = dime;
                    } else {
                        if (a === undefined) {
                            // logConsole('Conteggio undefined', nomeArr, arr);
                        } else {
                            // logConsole('Nessuna impostazione 1 nel conteggio: ', a, dime, nomeArr, typeof(arr), arr);        
                        }
                    }
                } catch (e) {
                    // console.error('Conteggio dimensioni errato su ', nomeArr, arr);
                }
            } else {
                if (typeof(arr) === 'string') {
                    somma = arr.length;
                } else {
                    if (typeof(arr) === 'number') {
                        somma += 4; // Valore a caso per i numerici
                    } else {
                        /* if (typeof(arr) === 'class') {
                            somma += 4; // Valore a caso per i numerici
                        } else {
                            // logConsole('Nessuna impostazione 2 nel conteggio per ', nomeArr, typeof(arr), arr);
                        } */
                    }
                }
            }

            /* if (somma === 0 || isNaN(somma)) {
                logConsole('Somma NaN o 0 ', somma, isNaN(somma), nomeArr, typeof(arr), arr);
            } */

            if (doppio) {
                somma *= 2;
            }
        }

        this.somma += somma;
        // // logConsole(nomeArr, arr, this.somma);        
    }

    contaDimensioniCanvasGrafici(t) {
        for (let i = 0; i < 500; i++) {
            if (t.chartsGrafici[t.NumeroFrame2][i]) {
                const canvas = t.chartsGrafici[t.NumeroFrame2][i].canvas;

                if (canvas) {
                  const dataURL = canvas.toDataURL("image/bmp");
                  const base64String = dataURL.split(",")[1];
                  const bytes = (base64String.length); // * 3) / 4;

                  this.somma += bytes;
                  // const sizeKB = bytes / 1024;
                  // logConsole("Peso del canvas:", i, sizeKB.toFixed(2), "KB");
                }                        
            }
        }      
    }

    contaDimensioniCanvasIstogrammi(t) {
        for (let i = 0; i < 500; i++) {
            if (t.chartsIstogrammi[t.NumeroFrame2][i]) {
                const canvas = t.chartsIstogrammi[t.NumeroFrame2][i].canvas;

                if (canvas) {
                  const dataURL = canvas.toDataURL("image/bmp");
                  const base64String = dataURL.split(",")[1];
                  const bytes = (base64String.length); // * 3) / 4;

                  this.somma += bytes;
                  // const sizeKB = bytes / 1024;
                  // logConsole("Peso del canvas:", i, sizeKB.toFixed(2), "KB");
                }                        
            }
        }      
    }

    contaDimensioniCanvasPareto(t) {
        for (let i = 0; i < 500; i++) {
            if (t.chartsPareto[t.NumeroFrame2][i]) {
                const canvas = t.chartsPareto[t.NumeroFrame2][i].canvas;

                if (canvas) {
                  const dataURL = canvas.toDataURL("image/bmp");
                  const base64String = dataURL.split(",")[1];
                  const bytes = (base64String.length); // * 3) / 4;

                  this.somma += bytes;
                  // const sizeKB = bytes / 1024;
                  // logConsole("Peso del canvas:", i, sizeKB.toFixed(2), "KB");
                }                        
            }
        }      
    }

    contaDimensioniCanvasScatter(t) {
        for (let i = 0; i < 500; i++) {
            if (t.chartsScatter[t.NumeroFrame2][i]) {
                const canvas = t.chartsScatter[t.NumeroFrame2][i].canvas;

                if (canvas) {
                  const dataURL = canvas.toDataURL("image/bmp");
                  const base64String = dataURL.split(",")[1];
                  const bytes = (base64String.length); // * 3) / 4;

                  this.somma += bytes;
                  // const sizeKB = bytes / 1024;
                  // logConsole("Peso del canvas:", i, sizeKB.toFixed(2), "KB");
                }                        
            }
        }      
    }

    calcolaPesoMappa(t) {
        const nome = 'frameM_' + t.NumeroFrame + '_' + t.frameAttivo2;
        const elemento = document.getElementById(nome) as HTMLElement;
        if (elemento) {
            const mapHTML = elemento.innerHTML;
            const byteSize = new Blob([mapHTML]).size;
            // const sizeKB = byteSize / 1024;
            this.somma += byteSize;
            // logConsole('Peso mappa', nome, byteSize);
        }
    }

    contaDimensioniGriglia(nome) {
        const elemento = document.getElementById(nome) as HTMLElement;
        if (elemento) {
            const mapHTML = elemento.innerHTML;
            const byteSize = new Blob([mapHTML]).size;
            // const sizeKB = byteSize / 1024;
            this.somma += byteSize;
            // logConsole('Griglia ', nome, byteSize);
        }
    }
}
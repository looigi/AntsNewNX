import { logConsole } from './console-log';
import { conta } from './contatori';
import { ExternalDownloadFileService } from './services/externaldownloadFile.service';
import { ExternalApiService } from './services/externalapi.service';
import { Component, OnInit, ElementRef, Input, ViewChild, AfterViewInit, OnChanges, Output, EventEmitter, ViewEncapsulation, Query, ChangeDetectorRef, ViewChildren, ChangeDetectionStrategy, Inject, HostListener, OnDestroy, ComponentFactoryResolver, QueryList, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {transformExtent, transformWithProjections} from 'ol/proj';
// import XYZ from 'ol/source/XYZ';
import {getRenderPixel} from 'ol/render';
import {OverviewMap} from 'ol/control';
// import 'ol/ol.css';
import { containsCoordinate, forEachCorner } from 'ol/extent';

// import OLCesium from 'olcs/OLCesium.js';

import OlMap from 'ol/Map';
import Overlay from 'ol/Overlay';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OlView from 'ol/View';
import {transform} from 'ol/proj';
// import {getTransform} from 'ol/proj';
// import {applyTransform} from 'ol/extent';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import VectorSource from 'ol/source/Vector';
import Draw from 'ol/interaction/Draw.js';
import Modify from 'ol/interaction/Modify.js';
import Snap from 'ol/interaction/Snap.js';
// import Stamen from 'ol/source/Stamen.js';
import TileImage from 'ol/source/TileImage';
import { environment } from '../../../environments/environment.prod';
import { DatePipe } from '@angular/common';
// import * as moment from 'moment';
// import { GestioneGrafici } from './elaborations/GestioneGrafici.component';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction';
import {defaults as defaultControls, ScaleLine} from 'ol/control';
import {Image as ImageLayer} from 'ol/layer';
// import {ImageArcGISRest, OSM} from 'ol/source';
import ImageWMS from 'ol/source/ImageWMS';

import { PointComponent } from './elaborations/point.component';
import { EventsComponent } from './elaborations/events.component';
import { MeasuresComponent } from './elaborations/measures.component';
import { GestioneGrafici } from './elaborations/GestioneGrafici.component';
import { FineRichieste } from './elaborations/fine-richieste';
// import { PivotComponent } from './elaborations/pivot.component';
import { HistogramComponent } from './elaborations/histogram.component';
import { PathComponent } from './elaborations/path.component';
import { LegendaComponent } from './elaborations/legenda.component';
import { PuntoSelezionatoComponent } from './elaborations/puntoselezionato.component';
import { AntenneComponent } from './elaborations/antenne.component';
import { ParetoComponent } from './elaborations/pareto.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// import * as wjOlap from '@grapecity/wijmo.olap';
// import * as wjGrid from '@grapecity/wijmo.grid';

// import '@grapecity/wijmo.styles/wijmo.css';
import { ExportComponent } from './elaborations/export.component';
// import { TCRunInfoComponent } from './elaborations/traceinfo.component';
// import { createOfflineCompileUrlResolver, flatten } from '@angular/compiler';
import { PlanimetryComponent } from './elaborations/planimetry.component';

import { of } from 'rxjs';
import { CellMeasuresComponent } from './elaborations/cellmeasures.component';
import { PointCMComponent } from './elaborations/pointcellmeasures.component';
import { CDRDataComponent } from './elaborations/cdr_data.component';
import { CDRVoiceComponent } from './elaborations/cdr_voice.component';
// import { HttpClient } from '@angular/common/http';
// import { MapsAPILoader } from '@agm/core';
import ExternalUtilities from './ExternalUtilities.component';
import { MeasureDFNComponent } from './elaborations/measure_dfn.component';
import { MosaicGridComponent } from './elaborations/mosaicgrid.component';
import { ClusterGridComponent } from './elaborations/clustergrid.component';
import { AreaInfoComponent } from './elaborations/areainfo';
import { ActivitiesComponent } from './elaborations/activities.component';
import { LayersDDComponent } from './elaborations/layers_dd.component';

// import Feature from 'ol/Feature';
// import {Fill, RegularShape, Stroke, Style} from 'ol/style';
// import Point from 'ol/geom/Point';
// import VectorSource from 'ol/source/Vector';
// import { timeStamp } from 'console';
import { PointLayerInfoComponent } from './elaborations/point_layer_info.component';
import { AdditionalLayerComponent } from './elaborations/additional_layer';
import { ShowRaysAllLayerComponent } from './elaborations/rays_all_layer.component';

// import {easeOut} from 'ol/easing';
// import {getVectorContext} from 'ol/render';
// import {unByKey} from 'ol/Observable';
// import {Circle as CircleStyle} from 'ol/style';
import { ExportGridComponent } from './elaborations/exportGrid';
// import { SSL_OP_ALL } from 'constants';
import { MatDialog } from '@angular/material/dialog';
// import { ConfermaComponent } from './components/conferma/conferma.component';
import { TCRunGridComponent } from './elaborations/tcrungrid.component';
import { NPSComponent } from './elaborations/npsgrid.component';
// import { truncate } from 'fs';
import { PuliziaComponent } from './elaborations/pulizia.component';
import { DisegnoMappe } from './elaborations/disegnomappe.component';
import { OSM } from 'ol/source';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { NgxCaptureService } from 'ngx-capture';
// import { FileSaverService } from 'ngx-filesaver';
import { Platform } from '@angular/cdk/platform';
import { ScatterComponent } from './elaborations/scatter.component';
// import { threadId } from 'worker_threads';
// import { LogComponentInterno } from './log.component';

import html2canvas from 'html2canvas';
// import { MatStepperIntl } from '@angular/material';
// import { ReturnStatement } from '@angular/compiler';
import { GestioneGraficiAE } from './elaborations/grafici_activity_events';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ContaDimensioneArrayComponent } from './elaborations/contaDimensioniArray.component';
import { Stroke, Style } from 'ol/style';
import { LoaderSize, LoaderThemeColor, LoaderType } from '@progress/kendo-angular-indicators';
import { ArfcnComponent } from './elaborations/arfcn_grid.component';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ArfcnPointComponent } from './elaborations/arfcn_point.component';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
// import { isArray, isNumeric } from 'rxjs/internal-compatibility';
import Swal from 'sweetalert2';
import { ArfcnComponentAllMeasures } from './elaborations/arfcn_all_measures.component';
import { SynopticComponent } from './elaborations/synoptic.component';
import { MistralGridComponent } from './elaborations/mistral_grid';
import { MistralFlowComponent } from './elaborations/mistral_flow';
// import { clearInterval, clearTimeout } from 'timers';
// import { takeUntil } from 'rxjs/operators';
import download from 'downloadjs';  // Importa downloadjs
import { MistralFlowStatComponent } from './elaborations/mistral_flow_stat';
import { MistralFlowQueueComponent } from './elaborations/mistral_flow_queue';
import { MistralRbcIxlComponent } from './elaborations/mistral_rbc_ixl';
import { Router } from '@angular/router';

// import Utils from './Utilities.component';
// declare var CanvJS: any;
// declare var require: any;
declare var google: any;

@Component({
  selector: 'app-frame-component',
  templateUrl: 'frame.component.html',
  styleUrls: ['./frame.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush, // AGGIUNTO PER MEMORY LEAKES
  // encapsulation: ViewEncapsulation.None
})

export class ExternalFrameComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() indirizzoServer;
  @Input() tipoFrameProgetto = 'M';
  @Input() eseguitoInProgetto;
  @Input() Utils;

  // Sostituisce nel template Utils.linkIcone && Utils.linkIcone.toUpperCase().indexOf('UNDEFINED')==-1 (32 volte,
  // rivalutata a ogni change detection): il controllo sulla stringa si rifà solo quando Utils.linkIcone cambia
  private ultimoLinkIconeControllato;
  private iconeValideCalcolato = false;
  get iconeValide(): boolean {
    const link = this.Utils ? this.Utils.linkIcone : undefined;
    if (link !== this.ultimoLinkIconeControllato) {
      this.ultimoLinkIconeControllato = link;
      this.iconeValideCalcolato = !!link && link.toUpperCase().indexOf('UNDEFINED') === -1;
    }
    return this.iconeValideCalcolato;
  }
  @Input() sessionID: string;
  @Input() CanvJS;
  @Input() frameName: string;
  // @Input() titoloFrame: string;
  @Input() frameDescription: string;
  @Input() allFramesDescriptions: any;
  @Input() overviewZoom: boolean;
  // @Input() view2: OlView;
  // @Input() viewGlobal: OlView;
  @Input() tipoMappa: boolean;
  @Input() MappaOGrafico: string;
  @Input() MappaOGraficoTutti: string;
  // @Input() viewSlegata2: OlView;
  @Input() refresh: boolean = false;
  @Input() filter: string;
  @Input() enabledLayer: string;
  // @Input() frameType: number;
  @Input() mapType: number;
  @Input() isVisiblePath: boolean;
  @Input() isVisibleCoverage: boolean;
  @Input() isVisibleTimeChart: boolean;
  @Input() isVisibleServingCell: boolean;
  // @Input() isVisibleAntenna: boolean;
  // @Input() isVisibleAntennaMLS: boolean;
  // @Input() maskTypestring: string;
  // @Input() Maximized: boolean;
  @Input() NumeroFrame: number;
  @Input() ConnessioneStabilita: string;
  @Input() userName: string;
  @Input() slaGroup;
  @Input() isCheckedServingCell: boolean;
  @Input() isCheckedShowPaths: boolean;
  @Input() isCheckedShowSelectedPaths: boolean;
  @Input() isCheckedAntenne: number;
  @Input() isNonSyncEventTime: boolean;
  @Input() showAxisX: boolean;
  @Input() Measure: any;
  @Input() nuoviDatiPerCambioFrame: any;
  @Input() slaValue: string;
  @Input() slaName: string;
  @Input() Activity: string;
  @Input() ActivityName: string;
  @Input() plmn: string;
  @Input() netTech: boolean;
  @Input() shownEvents: boolean;
  @Input() modificaChart: boolean;
  @Input() doNotSetGM: boolean;
  @Input() bandwidth: boolean;
  @Input() countHistogram: boolean;
  @Input() checkSeverity: boolean;
  @Input() barraAperta: boolean;
  @Input() refreshMaschera: boolean;
  @Input() measureData;
  @Input() isVisibileBar: boolean;
  @Input() listaEventiDaPassare: any;
  @Input() frameVisibile: boolean;
  @Input() mostraGrafico: boolean;
  @Input() tabSelezionato: number;
  @Input() calcolaCentro: boolean;
  // @Input() extent: any;
  @Input() tmsSelezionatoPerGrafico;
  @Input() resettaValoriFrame: boolean;
  @Input() settaMascheraVuotaP: boolean;
  @Input() styleMappa;
  @Input() refreshQuanteMisure: boolean;
  @Input() ActivityTimeSpan: number;
  @Input() CambioTmsSelezionato: String;
  @Input() listaActivityImpostate: any;
  @Input() coordinateDaImpostare: any;
  @Input() coordinateDaImpostareConClick: any;
  @Input() rotationDaImpostare: any;
  @Input() setZoom: number;
  @Input() viewAs: string;
  @Input() overlay: string;
  @Input() overlayCluster: string;
  @Input() timeFilter;
  @Input() isSyncTms: boolean;
  @Input() clusterGroup;
  @Input() datiSLA;
  @Input() datiSlaDT;
  @Input() slaValueGlobale;
  @Input() mapStyleGlobale;
  @Input() clusterGlobale;
  @Input() viewDefinition;
  @Input() designInfo: boolean;
  @Input() frameAttivo;
  @Input() nomiFrames;
  @Input() massimizzato;
  @Input() styleSize;
  @Input() dimensioniFinestraLegenda;
  @Input() histDisplayAs;
  @Input() histDisplayTutto;
  @Input() columnsBars;
  @Input() doubleGraph;
  @Input() dashboardAttiva;
  @Input() showPlanimetry = true;
  // @Input() columnsSettings;
  @Input() expandAllTreeView;
  @Input() collapseAllTreeView;
  @Input() copyAllClip;
  @Input() stringaAGNoACT;
  @Input() cambiatoAGNACTDopoScelta;
  @Input() tipoEvento;
  @Input() eventiSceltiES;
  @Input() eventiSceltiGlobaliES;
  // @Input() eventiSceltiESModificati;
  @Input() fixedSeconds1;
  @Input() datiActivitySets;
  @Input() centroAttuale;
  @Input() listaStileSizes;
  @Input() styleSizeGlobale;
  @Input() datiLookUp;
  @Input() datiAddLayers;
  @Input() cellType;
  @Input() filtriEventi;
  @Input() listaEventiCheckatiES;
  @Input() refreshDaTasto;
  @Input() addLayers;
  @Input() opacity;
  @Input() showRays: boolean;
  @Input() showMeasures: boolean;
  @Input() showCoverageMeasures: boolean;
  @Input() showVoiceCallMeasures: boolean;
  @Input() showDataMeasures: boolean;
  // @Input() showSamplesMeasures: boolean;
  @Input() squareMeters: string;
  @Input() datiNotebook: any;
  @Input() globalMeasure: any;
  @Input() globalMeasureArfcn: any;
  @Input() measureType: number;
  // @Input() CanvasJS;
  @Input() debug = false;
  @Input() ActivitySetNamePassato: string;
  @Input() ActivitySetIDPassato: string;
  @Input() datiMosaicStyle;
  @Input() mosaicStyle: string;
  @Input() sartPosition: boolean;
  @Input() timeRangeDSFStart;
  @Input() timeRangeDSFStop;
  @Input() agnGroupId;
  @Input() agnGroup;
  @Input() bboxChangeO;
  @Input() bboxChangeZ;
  @Input() tipoDataset;
  @Input() clickSuMG;
  @Input() clickSuCG;
  @Input() clickSuArfcn;
  @Input() bboxOZ;
  @Input() geoFilter;
  @Input() measureSMS;
  @Input() showMeasuresS: boolean;
  @Input() accordionDebug: boolean;
  @Input() mosaicoSelezionato: any;
  @Input() clusterSelezionato: any;
  @Input() spostaCentroManualmente: any;
  @Input() numeroActSetVisibili: number;
  @Input() actSetNameFM: string;
  @Input() frameEditorAttivo: boolean = false;
  @Input() exportKMLAttivo: boolean = false;
  @Input() lastDays;
  @Input() center_position;
  @Input() time_cursor_position;
  @Input() refreshAccentratore;
  @Input() progettoEsterno = '';
  @Input() nomeAntennaDD = '';
  @Input() parametriDD = '';
  @Input() nomeClusterDD = '';
  @Input() impostaValoriMascheraProgetto;
  @Input() impostaQuadratoMappa;
  @Input() visualizzaToolTipGrafici = true;
  @Input() mappeStyle;
  @Input() mappeMS;
  @Input() clusterMeasure;
  @Input() clusterMeasure2;
  // @Input() lov;
  @Input() textFilter;
  @Input() textFilter2;
  // @Input() textLov;
  @Input() addGlobalLayer;
  @Input() additionalLayer;
  @Input() measureRCM;
  @Input() eventsMeasure;
  @Input() cellaSelezionata;
  @Input() showRaysAllLayer;
  @Input() drawShowRaysAllLayer;
  @Input() zoomMap;
  @Input() geoFilterClick;
  @Input() cambioBboxZ;
  @Input() additionalLayerDiretto;
  @Input() comboSelArea;
  @Input() lastSelectedLayer;
  @Input() activitiesPassataDaRoot;
  @Input() strutturaTms;
  @Input() timerAttivatoAuto;
  @Input() ricaricaRaggi;
  @Input() refreshLegenda;
  @Input() permessiDataView;
  @Input() righePerPaginazioneAutomatica = -1;
  @Input() pulisceLastCallAddLayers;
  @Input() tmsPassatiDaProgetto;
  @Input() tmsPassatiDaProgettoTcRun;
  @Input() permessoFleetManagerAM;
  @Input() visualizzaLegendaHistogram;
  @Input() tipoLegendaIstogrammi;
  @Input() listaWorkspaces;
  @Input() operatorID;
  @Input() groupName;
  @Input() urlRoot;
  @Input() correlation;
  @Input() timerSynch = false;
  @Input() listaEventiSEPassata;
  @Input() deltaEvents;
  @Input() ridisegnaGrafici;
  @Input() ridisegnaMappa;
  @Input() cellSet;
  @Input() misureAddizionaliTCRUN;
  @Input() heightChart;
  @Input() modalitaRealTimeAttiva;
  @Input() coordinatePassateRT;
  @Input() puliziaFrame;
  // @Input() nonNascondereCampi = false;
  @Input() paginaSelezionata;
  @Input() Log;
  @Input() editMode = false;
  @Input() menuAperto = false;
  @Input() modalitaDebug = false;
  // @Input() screenShot;
  // @Input() toglieScreenShot;
  @Input() posDaImpostare;
  @Input() testJson = false;
  @Input() misurePassateDaContext;
  @Input() listaCampiTCRP;
  @Input() dimensioniSplitTcRun;
  @Input() impostazioniPivot;
  @Input() resizeFrame;
  @Input() tipoDatiLayout;
  @Input() debugEstremoPivot = false;
  @Input() refreshPlanimetria;
  @Input() utilizzoMemoria = false;
  @Input() passaggioBoxDisegnataSullaMappa;
  @Input() showAdditionalLayers;
  @Input() limitaRighePerDebug = undefined;
  @Input() centroImpostatoDaEsterno;
  @Input() squareMetersGlobale = '100';
  @Input() partitionLabel = '';
  @Input() listaActSet = '';
  @Input() eventiDaTogliereSE;
  @Input() measureDataCompleti;
  @Input() settingsAperto;
  @Input() imsiPassato;
  @Input() uniqueIDPassato;
  @Input() filterMQ;
  @Input() viewModeMS;
  @Input() flowTypeMS;
  @Input() isStandAloneMR;

  @Output() settingsApertoEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() frameNameEmit: EventEmitter<string> = new EventEmitter<string>();
  // @Output() titoloFrameEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() frameDescEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() mappaOGraficoEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() overviewZoomEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() tipoMappaEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() isCheckedServingCellEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isCheckedShowPathsEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isCheckedShowSelectedPathsEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isCheckedAntenneEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() isNonSyncEventTimeEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isStandAloneMREmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showAxisXEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() measureEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() slaValueEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() activityEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() plmnEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() netTechEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() shownEventsEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modificaChartEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() doNotSetGMEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() bandwidthEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() checkSeverityEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() countHistogramEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() barraApertaEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() maximizedEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() chiudeMascheraEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() listaEventi: EventEmitter<string> = new EventEmitter<string>();
  @Output() viewEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() csvEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() slaEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() tabSelezionatoEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() clickSuMappaEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() htmlClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() coordinateCambiate: EventEmitter<any> = new EventEmitter<any>();
  @Output() coordinateCambiateConClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() rotationCambiata: EventEmitter<any> = new EventEmitter<any>();
  @Output() currZoomEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() viewAsEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() overlayEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() overlayClusterEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() timeFilterEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() viewDefinitionEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() designInfoEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() frameAttivoEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() spostamentoFrame: EventEmitter<string> = new EventEmitter<string>();
  @Output() refreshSLA: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() dimensioniFinestraLegendaEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() histDisplayAsEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() histDisplayTuttoEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() columnsBarsEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() doubleGraphEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() showPlanimetryEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Output() clickPerAperturaPopup: EventEmitter<string> = new EventEmitter<string>();
  // @Output() columnsSettingsEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() clickESceltaAGNoACT: EventEmitter<any> = new EventEmitter<any>();
  @Output() tipoEventoEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() eventiSceltiESEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() fixedSecondsEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() styleSizeEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() timeRangeCambiato: EventEmitter<string> = new EventEmitter<string>();
  @Output() cellTypeEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() addLayersEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() filtriEventiEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() impostaAGNoACT: EventEmitter<any> = new EventEmitter<any>();
  @Output() opacityEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() showRaysEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() showMeasuresEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() resetPositionEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() squareMetersEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() globalMeasureEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() globalMeasureArfcnEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() globalMeasureTypeEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() globalMeasureArfcnTypeEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() measureTypeEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() cambioTmsSelezionato: EventEmitter<string> = new EventEmitter<string>();
  @Output() cambioStartTms: EventEmitter<string> = new EventEmitter<string>();
  @Output() cambioEndTms: EventEmitter<string> = new EventEmitter<string>();
  @Output() mosaicStyleEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() checkSeCiSonoModificheEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sartPositionEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() timeRangeStart: EventEmitter<any> = new EventEmitter<any>();
  @Output() timeRangeStop: EventEmitter<any> = new EventEmitter<any>();
  @Output() coordinateDaClickSuMappa: EventEmitter<any> = new EventEmitter<any>();
  @Output() bboxImpostatoOverView: EventEmitter<any> = new EventEmitter<any>();
  @Output() bboxImpostatoZoom: EventEmitter<any> = new EventEmitter<any>();
  @Output() tipoDatasetEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() clickatoSuMG: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickatoSuCG: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickatoSuArfcn: EventEmitter<any> = new EventEmitter<any>();
  @Output() squareMetersGlobaleOverViewEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() squareMetersGlobaleZoomEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() bboxOZEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() geoFilterEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() measureSMSEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() showMeasuresSEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showCoverageMeasuresEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showVoiceCallMeasuresEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showDataMeasuresEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Output() showSamplesMeasuresEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() mosaicoSelezionatoEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() clusterSelezionatoEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() messaggioDiErrore: EventEmitter<string> = new EventEmitter<string>();
  @Output() impostaCenterPosition: EventEmitter<string> = new EventEmitter<string>();
  @Output() impostaTimeCursorPosition: EventEmitter<string> = new EventEmitter<string>();
  @Output() settaQuadratoMappa: EventEmitter<string> = new EventEmitter<string>();
  @Output() mappeMSEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() clusterMeasureEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() clusterMeasure2Emit: EventEmitter<string> = new EventEmitter<string>();
  // @Output() lovEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() textFilterEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() textFilter2Emit: EventEmitter<string> = new EventEmitter<string>();
  // @Output() textLovEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() addGlobalLayerEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() measureRCMEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() eventsMeasureEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cellaSelezionataEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() showRaysAllLayerEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() drawShowRaysAllLayerEmit:  EventEmitter<any> = new EventEmitter<any>();
  @Output() geoFilterClickEmit:  EventEmitter<any> = new EventEmitter<any>();
  @Output() lastSelectedLayerEmit:  EventEmitter<any> = new EventEmitter<any>();
  @Output() selezioneActivitiesPerRoot:  EventEmitter<number> = new EventEmitter<number>();
  @Output() ricaricaRaggiEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() passaggioValoriPerLegenda: EventEmitter<any> = new EventEmitter<any>();
  @Output() bboxEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshAccentratoreEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() correlationEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() passaggioListaEventiSE: EventEmitter<any> = new EventEmitter<any>();
  @Output() passaggioEventiDaTogliereSE: EventEmitter<any> = new EventEmitter<any>();
  @Output() passaggioListaEventiGlobaliSE: EventEmitter<any> = new EventEmitter<any>();
  @Output() deltaEventsEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() ridisegnaGraficiEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() stringaRitornoEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() misureAddizionaliTCRUNEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() heightChartEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() ridisegnaMappaEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() measureDataEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() listaCampiTCRPEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() dimensioniSplitTcRunEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() impostazioniPivotEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() tipoDatiLayoutEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshPerTcRunClickUguale: EventEmitter<any> = new EventEmitter<any>();
  @Output() comboSelAreaEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() refreshPlanimetriaEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() boxDisegnataSuMappa: EventEmitter<any> = new EventEmitter<any>();
  @Output() showAddLayersEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() centroImpostatoEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() partitionLabelEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() misureGlobaliEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() imsiEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() uniqueIDEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() impostaRangesContemporaneamente: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterMQEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewModeMSEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() flowTypeMSEmit: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('myDivCont', {static: false}) elementView: ElementRef;
  // @ViewChild('pivotGrid', {static: false}) pivotGrid: wjOlap.PivotGrid;
  @ViewChild('treeViewAE', {static: false}) treeViewAE: ElementRef;
  @ViewChild('excelexport', {static: false}) excelExport: ElementRef;
  @ViewChildren('addr') addressTXT;
  @ViewChild('divScatter', {static: false}) divScatter: ElementRef;
  @ViewChild('divPareto', {static: false}) divPareto: ElementRef;
  // @ViewChild('divIstogrammi', {static: false}) divIstogrammi: ElementRef;
  @ViewChild('divGrafici', {static: false}) divGrafici: ElementRef;
  // @ViewChild('canvasSynoptic', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  destroy$ = new Subject<void>();

  scrollAttualeGrafici = 0;
  vecchioScroll = -1;
  graficiVisibili = true;
  reportXls = false;
  indirizzoServer2;

  sceltaFilter = false;
  datiGrafici = false;

  lastMisureLTP = 0;
  listaCampiTCRP2;
  tipoDatiLayout2;

  tipoFrameProgetto2;

  cambioDimensioneContenitorePivot = '';
  barraImpostataAperta = false;

  staSulFrame = false;
  iconeAperte2 = false;

  cambioFrameInCorso = true;
  
  testRondella = false;

  datiGrigliaCheck;
  checkPopup = false;
  modalitaCheckPopup;
  operazioneCheckPopup = '';

  loaderCambioPagina = {
    type: <LoaderType>"converging-spinner",
    themeColor: <LoaderThemeColor>"info",
    size: <LoaderSize>"medium",
  };
  
  loaderCaricamento = {
    type: <LoaderType>"converging-spinner",
    themeColor: <LoaderThemeColor>"primary",
    size: <LoaderSize>"medium",
  };
  
  // vecchioScroll = 0;
  timerControlloScroll;
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (!this.timerControlloScroll) {
      this.vecchioScroll = event.target.scrollTop;
      this.timerControlloScroll = setInterval(() => {
        if (this.vecchioScroll !== event.target.scrollTop) {
          this.vecchioScroll = event.target.scrollTop;
        } else {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Smesso di scrollare', this.vecchioScroll);

          /* this.aggiornaGrafici = true;
          this.graficiComponent.disegnaGrafici(this, false);
  
          const tms = this.datePipe.transform(this.tmsSelezionato, 'yyyy-MM-dd HH:mm:ss');
          if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CambioTmsSelezionato. Richiamo selezione grafici', tms);
          }
          this.graficiComponent.disegnaSelezioneGrafici(this, tms, true); */
  
          clearInterval(this.timerControlloScroll);
          this.timerControlloScroll = undefined;

          if (this.modalitaRealTimeAttiva2) {
            this.scrollAttualeGrafici = this.vecchioScroll;
            this.ridisegnaGraficiDopoScroll();
          } 
        }
      }, 300);
    }
    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
      // if (this.vecchioScroll === event.target.scrollTop) {

        /* this.scrollAttualeGrafici = event.target.scrollTop;
        this.vecchioScroll = event.target.scrollTop;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Scroll div grafici', this.scrollAttualeGrafici);
        this.aggiornaGrafici = true;
        this.graficiComponent.disegnaGrafici(this, false);

        const tms = this.datePipe.transform(this.tmsSelezionato, 'yyyy-MM-dd HH:mm:ss');
        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CambioTmsSelezionato. Richiamo selezione grafici', tms);
        }
        this.graficiComponent.disegnaSelezioneGrafici(this, tms, true); */

    // } else {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Scroll div grafici uguale al precedente', this.vecchioScroll);
      // }
      // this.vecchioScroll = event.target.scrollTop;
    // }, 100);
    // }
  }

  bboxImpostataNelFrame;
  zoomImpostatoNelFrame;
  zoomImpostatoNelFrameZoom;
  zoomImpostatoNelFrameOverView;
  centroImpostato;
  centroImpostatoZoom;
  centroImpostatoOverView;
  bboxZoom;
  bboxOverview;
  checkSeverity2 = false;
  measureDataCompleti2;
  viewModeMS2;
  flowTypeMS2;

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  multiselectColumn = true;
  // ngPanel: wjOlap.PivotEngine;

  questa = this;

  datiPerPausa;
  timeModePerPausa;
  pausaRealTimeAttiva = false;

  htmlString = '';
  pathSchedSel = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  lastPreCompose;
  lastGeometry = '';
  intervalBbox;
  bboxPC;
  staCambiandoFrame = false;
  pendings = '';
  coordinateSREL;
  riprocessingInCorso = false;
  // vecchioIdSelezionatoAE;

  aggiornaGrafici = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  misureIstogrammi;
  visibileMascheraPL = false;
  datiPlanimetria;
  fattoClickSuPlanimetria = false;

  posizioneXPL;
  posizioneYPL;

  gridTitle2AI = '';
  gridTitle2AR = '';
  gridTitle2AM = '';
  gridTitleAct = '';
  gridTitleCdrD = '';
  gridTitleCdrV = '';
  gridTitleEvents = '';
  gridTitleMDFN = '';
  gridTitleMosaic = '';
  gridTitleNPS = '';
  gridTitlePL = '';
  gridTitlePCM = '';
  gridTitleTcRun = '';
  gridTitleAP = '';

  graficiAEVisibili = false;

  // bboxProgetto;

  /* dimeCDRData1 = 50;
  dimeCDRData2 = 50;
  dimeCDRVoice1 = 50;
  dimeCDRVoice2 = 50; */
  erroreClusterNonPresente = false;
  erroreMisuraClusterNonPresente = false;
  visualizzazioneTastoAI = false;

  mousePosition = null;
  radius = 75;
  lastBbox;
  exportAllMeasuresKML = false;

  datiPerc = [
    { id: 0.5 },
    { id: 1 },
    { id: 1.5 },
    { id: 2 },
    { id: 3 }
  ];
  percentualeAltezzaGrafico = 1;

  visualizzaLegendaHistogram2 = true;
  tipoLegendaIstogrammi2 = 'TOP';
  legendaHistogram = undefined; //  new Array(); // [ { color: '#aaaaaa', value_2: 1000 }, { color: '#272727', value_2: 1234 }, { color: '#898989', value_2: 3456 }];
  legendaScatter = new Array();

  erroreHistogram = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  erroreScatter = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  errorePareto = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

  altezzaGraficoScatter = [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200];
  altezzaIstogrammi = [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200];

  measureDaDisegnarePareto = new Array();
  measureDaDisegnareScatter = new Array();

  // quantiGraficiHICiSono = undefined;
  // quantiGraficiPACiSono = undefined;
  // quantiGraficiSCCiSono = undefined;
  caricamentoDatiInCorsoPareto = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoDatiInCorsoScatter = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoDatiInCorsoHistogram = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoDatiInCorsoPointMeasures = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoDatiInCorsoPointLayerInfo = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoArfcnPointsInCorso = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoDatiInCorsoMC = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoEventiInCorso = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoEventi2InCorso = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoEventSummaryInCorso = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoPCM = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoPLI = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoCellMeasuresInCorso = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoMC = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoMR = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoMF = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoMStat = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoMStat2 = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoMQ = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoTcRunInCorso = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoNPSInCorso = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoCdrDataInCorso = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoCdrVoiceInCorso = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoMeasureDFN = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoActivitiesInCorso = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoArfcn = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  caricamentoArfcnAM = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  
  // staDisegnandoEventi = [false, false, false, false, false, false, false, false, false, false, false,
  //     false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  // staDisegnandoEventiSummary = [false, false, false, false, false, false, false, false, false, false, false,
  //     false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

  ultimaVoltaAccentratore = 0;

  axisColor = 'transparent';
  axisXConTempoVisibile;
  axisXConValueVisibile;
  axisXSenzaTempoVisibile;
  staSpostandoMappaZoom = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false];
  // staCaricandoEvents = false;

  actSetPerEsclusione;
  tmsMinPerEsclusione;
  tmsMaxPerEsclusione;

  altezzaPareto = ExternalUtilities.creaMatrice(environment.quantiSottoFrames, environment.quantiFrames, 0);
  tipoExport = '';
  timeRangeDSFStart2;
  timeRangeDSFStop2;

  misureComboDaContext;

  mascheraModificaTicket = false;
  TitoloMascheraModificaMT = '';
  operazioneTicket;
  rigaModificataTicket;
  vecchioValoreTicket;
  datiLookUpStatus;
  datiLookUpPriority;
  datiOperatorGroup;
  timerSynch2 = false;

  listaEspansa = true;
  agnGroupId2;
  agnGroup2;
  showMeasures2;
  showMeasuresS2;
  showCoverageMeasures2;
  showVoiceCallMeasures2;
  showDataMeasures2;
  // showSamplesMeasures2;
  mosaicoSelezionato2;
  clusterSelezionato2;
  listaLayersDaVisualizzare = '';
  rigaSelezionataDettaglioEvents;
  showAdditionalLayers2;
  lastSelectedLayer2;
  strutturaTms2;
  timerAttivatoAuto2 = false;

  // fragGrafici;
  /* filtroEventiCol21 = '';
  filtroEventiCol22 = '';
  filtroEventiCol23 = '';
  filtroEventiCol24 = '';
  filtroEventiCol25 = '';
  filtroEventiCol26 = '';
  filtroEventiCol27 = '';
  filtroEventiCol28 = '';
  filtroEventiCol29 = '';
  filtroEventiCol210 = '';
  filtroEventiCol211 = '';
  filtroEventiCol212 = '';
  filtroEventiCol213 = '';
  filtroEventiCol214 = '';
  filtroEventiCol215 = '';
  filtroEventiCol216 = '';
  filtroEventiCol217 = '';
  filtroEventiCol218 = '';
  filtroEventiCol219 = '';
  filtroEventiCol220 = ''; */
  // appoCheckES = new Array();
  ultimoDisegnoAddLayer = -1;
  ultimoCambioFrame = -1;
  ultimoCambioFrameR = -1;

  selezionePM;
  squareMeters2;
  partitionLabel2 = '';
  listaActSet2 = '';
  squareMetersGlobale2 = '100';

  notebookScelto;
  pulisceFiltroNB = false;
  htmlstring;

  nuovaPaginaAE = -1;
  // offsetAe = -1;
  righeTotaliEventi;
  layersAgg = [ undefined, undefined, undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined, undefined ];
  layersAggDir = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  exportOnlyDisplayedMeasures = true;
  exportSelectedEvents = true;
  exportRawData = false;
  exportDisplayedMeasures = true;
  exportEventText = false;
  exportWholeTimeRange = false;
  exportWholeDataSet = false;
  showExportBox = false;

  showActSet = false;
  righeSelezionatePerActSet;

  numeroRighePagina = -1;
  numeroPaginaMosaicGrid = 0;

  showExportBoxKML = false;
  exportMeasuresKML = true;
  exportAntenneKML = true;
  exportPlanimetryKML = true;
  exportOverlayKML = true;
  exportPathAntenneKML = true;
  exportRaysKML  = true;
  exportEventsKML  = true;

  dimensioniFinestraRicerca = 0;
  opacitaRicerca = .1;
  indirizzo = '';
  opacitaBottoneMenu = 0;
  lastEventoClicked;

  lastLoadCsv = '';
  rigaSelezionataTcRun;
  warningAE = '';
  pulisceCookieCG = '';

  caricamentoMappaInCorso = false;
  staDisegnandoPath = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  staDisegnandoOverlay = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  staDisegnandoLegenda = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  staDisegnandoPathClickato = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  staDisegnandoServingCell = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  staDisegnandoPuntoSelezionato = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  staCaricandoPiantina = false;
  staDisegnandoSartPosition = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  staDisegnandoSchedSel = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  staDisegnandoLayerGeometry = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  staDisegnandoShowRays = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  staDisegnandoMisureSMS = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];

  // impostaPaginaDPM = 0;
  impostaPaginaES = 0;
  impostaPaginaGlobaliES = 0;
  impostaPaginaPCM = 0;
  impostaPaginaCME = 0;
  impostaPaginaCDRD = 0;
  impostaPaginaCDRS = 0;
  impostaPaginaCV = 0;
  impostaPaginaMeasureDFN = 0;

  itemsMenuEvents: any[] = [{ text: 'Synchronise other frames' }];
  tmsRiga;
  vecchioElaboraPuntoTMS = 0;

  scaleType = 'scaleline';
  scaleBarSteps = 4;
  scaleBarText = true;
  control;
  indent;
  righeJSON;

  // ultimaVoltaTMSLA = -1;

  latLng = new Array();
  // blobImmagine;
  bEditPiantina = false;
  testoDettaglioEventi;
  layerTrans;
  layerMeasureSMS = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  layerModify;
  coordinatePiantina = '';
  datiPoint;
  layerImmagine;
  menuframes = false;
  barraNuovaAperta = false;
  mostraSpostamenti = false;
  numeroSottoFrame = -1;
  DataViewText = '';
  ActivitySetName = '';
  mapTypeName = '';
  clusterType = '';
  overlayName = '';
  slaValueName = '';
  datiAEAppoggio = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
  rinfrescaGrigliaAE;
  tmsChiusuraViews = 0;
  pulisceSelezioneAE = false;
  frameCheHaDisegnatoBox = -1;
  // tmsDelta = null;

  paginaEvents = 0;
  quantiEventsVecchi = 0;

  datiFrames;
  datiView;
  framePerSpostamento;
  viewPerSpostamento;
  // lastParamsCoord;
  lastClickRigaAE = 0;
  lastFrameAE = -1;
  staLeggendoCoordinate = false;
  lastTmsGetCoords = 0;

  infoMappa;
  lastInfoMappa = '';
  lastGetFeature = 0;
  staLeggendoDatiPoint = false;
  topPopup;
  leftPopup;
  caricamentoMosaicGrid = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  caricamentoClusterGrid = [false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false];
  caricamentoAreaInfo = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

  impostaSelezioneES = new Array();
  impostaSelezioneGlobaliES = new Array();
  impostaSelezioneTC = new Array();
  impostaSelezioneCM = new Array();
  impostaSelezioneM2 = new Array();
  impostaSelezioneMF = new Array();
  impostaSelezioneNPS = new Array();
  impostaSelezionePCM = new Array();
  impostaSelezionePLI = new Array();
  impostaSelezioneCD = new Array();
  impostaSelezioneCV = new Array();
  impostaSelezioneCS = new Array();
  impostaSelezioneCD2 = new Array();
  impostaSelezioneMeasureDFN = new Array();
  impostaSelezioneMosaicGrid = new Array();
  impostaSelezioneClusterGrid = new Array();
  impostaSelezioneAreaInfo = new Array();
  impostaSelezioneArfcn = new Array();
  impostaSelezioneArfcnAM = new Array();
  impostaSelezioneLA = new Array();
  impostaSelezioneAP = new Array();
  // impostaSelezioneLA2 = new Array();

  filterGroupByCDR = '';
  filterGroupByCDD = '';

  // dimensioniFinestraLegenda = 5;
  opacitaLegenda = 0;
  nessunClusterGrid = false;
  nessunClusterGridMisura = false;

  INCHES_PER_UNIT = {
    'm': 39.37,
    'dd': 4374754
  };
  DOTS_PER_INCH = 72;

  // Utils = ExternalFrameComponent.Utils;

  arrayDelete;
  idxDelete;

  modalitaDrawPolygon = false;

  currScale;
  currScale2;
  htmlCode = '';
  valoriEnv = '';
  urlPivot;
  // datiSlaDT;
  ultimaVoltaClick = 0;
  ultimaVoltaGrafico = 0;
  ultimaVoltaAntenne = 0;
  ultimaVoltaGraficoScatter = 0;
  ultimaVoltaClickOnMap = 0;
  comboDisabilitata = false;
  fattoClickSuMappa = false;
  lastProp;
  idSelezionatoAE;
  idSelezionatoGlobaliAE;
  rigaSelezionataAE;
  selezionatoTII;
  selezionatoTIF;
  ActivityNameLS_A = '';
  aggiornamentoEventiScelti = false;
  aggiornamentoEventiSceltiGlobali = false;
  overlayGIF;

  cambioFrameDaContext;

  datiAgents;
  messaggioWarningAG = '';
  selezioneAgent = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);;
  selezioneAgentID = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);;
  // effettuaAutoFitLA2 = false;

  nomeGrigliaAreaInfo = ['', 'grigliaAI_1', 'grigliaAI_2', 'grigliaAI_3', 'grigliaAI_4', 'grigliaAI_5', 'grigliaAI_6',
                  'grigliaAI_7', 'grigliaAI_8', 'grigliaAI_9'];
  nomeGrigliaArfcn = ['', 'grigliaAR_1', 'grigliaAR_2', 'grigliaAR_3', 'grigliaAR_4', 'grigliaAR_5', 'grigliaAR_6',
                    'grigliaAR_7', 'grigliaAR_8', 'grigliaAR_9'];
  nomeGrigliaArfcnAM = ['', 'grigliaAM_1', 'grigliaAM_2', 'grigliaAM_3', 'grigliaAM_4', 'grigliaAM_5', 'grigliaAM_6',
                    'grigliaAM_7', 'grigliaAM_8', 'grigliaAM_9'];
  nomeGrigliaAP = ['', 'grigliaAP_1', 'grigliaAP_2', 'grigliaAP_3', 'grigliaAP_4', 'grigliaAP_5', 'grigliaAP_6',
                    'grigliaAP_7', 'grigliaAP_8', 'grigliaAP_9'];
  nomeGrigliaLA = ['', 'grigliaLA_1', 'grigliaLA_2', 'grigliaLA_3', 'grigliaLA_4', 'grigliaLA_5', 'grigliaLA_6',
                  'grigliaLA_7', 'grigliaLA_8', 'grigliaLA_9'];
  nomeGrigliaListA = ['', 'grigliaListA_1', 'grigliaListA_2', 'grigliaListA_3', 'grigliaListA_4', 'grigliaListA_5', 'grigliaListA_6',
                  'grigliaListA_7', 'grigliaListA_8', 'grigliaListA_9'];
  // nomeGrigliaLA2 = ['', 'grigliaLA2_1', 'grigliaLA2_2', 'grigliaLA2_3', 'grigliaLA2_4', 'grigliaLA2_5', 'grigliaLA2_6',
  //                 'grigliaLA2_7', 'grigliaLA2_8', 'grigliaLA2_9'];
  nomeGrigliaPM = ['', 'grigliaPM_1', 'grigliaPM_2', 'grigliaPM_3', 'grigliaPM_4', 'grigliaPM_5', 'grigliaPM_6',
                  'grigliaPM_7', 'grigliaPM_8', 'grigliaPM_9'];
  nomeGrigliaPLI = ['', 'grigliaPLI_1', 'grigliaPLI_2', 'grigliaPLI_3', 'grigliaPLI_4', 'grigliaPLI_5', 'grigliaPLI_6',
                  'grigliaPLI_7', 'grigliaPLI_8', 'grigliaPLI_9'];
  nomeGrigliaAE = ['', 'grigliaAE_1', 'grigliaAE_2', 'grigliaAE_3', 'grigliaAE_4', 'grigliaAE_5', 'grigliaAE_6',
                  'grigliaAE_7', 'grigliaAE_8', 'grigliaAE_9'];
  nomeGrigliaTII = ['', 'grigliaTII_1', 'grigliaTII_2', 'grigliaTII_3', 'grigliaTII_4', 'grigliaTII_5', 'grigliaTII_6',
                  'grigliaTII_7', 'grigliaTII_8', 'grigliaTII_9'];
  nomeGrigliaTIF = ['', 'grigliaTIF_1', 'grigliaTIF_2', 'grigliaTIF_3', 'grigliaTIF_4', 'grigliaTIF_5', 'grigliaTIF_6',
                  'grigliaTIF_7', 'grigliaTIF_8', 'grigliaTIF_9'];
  nomeGrigliaES = ['', 'grigliaES_1', 'grigliaES_2', 'grigliaES_3', 'grigliaES_4', 'grigliaES_5', 'grigliaES_6',
                  'grigliaES_7', 'grigliaES_8', 'grigliaES_9'];
  nomeGrigliaTC = ['', 'grigliaTC_1', 'grigliaTC_2', 'grigliaTC_3', 'grigliaTC_4', 'grigliaTC_5', 'grigliaTC_6',
                  'grigliaTC_7', 'grigliaTC_8', 'grigliaTC_9'];
  nomeGrigliaNPS = ['', 'grigliaNPS_1', 'grigliaNPS_2', 'grigliaNPS_3', 'grigliaNPS_4', 'grigliaNPS_5', 'grigliaNPS_6',
                  'grigliaNPS_7', 'grigliaNPS_8', 'grigliaNPS_9'];
  nomeGrigliaCM = ['', 'grigliaCM_1', 'grigliaCM_2', 'grigliaCM_3', 'grigliaCM_4', 'grigliaCM_5', 'grigliaCM_6',
                  'grigliaCM_7', 'grigliaCM_8', 'grigliaCM_9'];
  nomeGrigliaM2 = ['', 'grigliaM2_1', 'grigliaM2_2', 'grigliaM2_3', 'grigliaM2_4', 'grigliaM2_5', 'grigliaM2_6',
                  'grigliaM2_7', 'grigliaM2_8', 'grigliaM2_9'];
  nomeGrigliaMF = ['', 'grigliaMF_1', 'grigliaMF_2', 'grigliaMF_3', 'grigliaMF_4', 'grigliaMF_5', 'grigliaMF_6',
                  'grigliaMF_7', 'grigliaMF_8', 'grigliaMF_9'];
  nomeGrigliaMR = ['', 'grigliaMR_1', 'grigliaMR_2', 'grigliaMR_3', 'grigliaMR_4', 'grigliaMR_5', 'grigliaMR_6',
                  'grigliaMR_7', 'grigliaMR_8', 'grigliaMR_9'];
  nomeGrigliaMStat = ['', 'grigliaMStat_1', 'grigliaMStat_2', 'grigliaMStat_3', 'grigliaMStat_4', 'grigliaMStat_5', 'grigliaMStat_6',
                  'grigliaMStat_7', 'grigliaMStat_8', 'grigliaMStat_9'];
  nomeGrigliaMStat2 = ['', 'grigliaMStat2_1', 'grigliaMStat2_2', 'grigliaMStat2_3', 'grigliaMStat2_4', 'grigliaMStat2_5', 'grigliaMStat2_6',
                  'grigliaMStat2_7', 'grigliaMStat2_8', 'grigliaMStat2_9'];
  nomeGrigliaMQ = ['', 'grigliaMQ_1', 'grigliaMQ_2', 'grigliaMQ_3', 'grigliaMQ_4', 'grigliaMQ_5', 'grigliaMQ_6',
                  'grigliaMQ_7', 'grigliaMQ_8', 'grigliaMQ_9'];
  nomeGrigliaPCM = ['', 'grigliaPCM_1', 'grigliaPCM_2', 'grigliaPCM_3', 'grigliaPCM_4', 'grigliaPCM_5', 'grigliaPCM_6',
                  'grigliaPCM_7', 'grigliaPCM_8', 'grigliaPCM_9'];
  nomeGrigliaCD = ['', 'grigliaCD_1', 'grigliCD_2', 'grigliaCD_3', 'grigliaCD_4', 'grigliaCD_5', 'grigliaCD_6',
                  'grigliaCD_7', 'grigliaCD_8', 'grigliaCD_9'];
  nomeGrigliaCD2 = ['', 'grigliaCD2_1', 'grigliCD2_2', 'grigliaCD2_3', 'grigliaCD2_4', 'grigliaCD2_5', 'grigliaCD2_6',
                  'grigliaCD2_7', 'grigliaCD2_8', 'grigliaCD2_9'];
  nomeGrigliaCV = ['', 'grigliaCV_1', 'grigliCV_2', 'grigliaCV_3', 'grigliaCV_4', 'grigliaCV_5', 'grigliaCV_6',
                  'grigliaCV_7', 'grigliaCV_8', 'grigliaCV_9'];
  nomeGrigliaCS = ['', 'grigliaCS_1', 'grigliCS_2', 'grigliaCS_3', 'grigliaCS_4', 'grigliaCS_5', 'grigliaCS_6',
                  'grigliaCS_7', 'grigliaCS_8', 'grigliaCS_9'];
  nomeGrigliaMD = ['', 'grigliaMD_1', 'grigliaMD_2', 'grigliaMD_3', 'grigliaMD_4', 'grigliaMD_5', 'grigliaMD_6',
                  'grigliaMD_7', 'grigliaMD_8', 'grigliaMD_9'];
  nomeGrigliaMG = ['', 'grigliaMG_1', 'grigliaMG_2', 'grigliaMG_3', 'grigliaMG_4', 'grigliaMG_5', 'grigliaMG_6',
                  'grigliaMG_7', 'grigliaMG_8', 'grigliaMG_9'];
  nomeGrigliaCG = ['', 'grigliaCG_1', 'grigliaCG_2', 'grigliaCG_3', 'grigliaCG_4', 'grigliaCG_5', 'grigliaCG_6',
                  'grigliaCG_7', 'grigliaCG_8', 'grigliaCG_9'];
  nomeGrigliaAH = ['', 'grigliaAH_1', 'grigliaAH_2', 'grigliaAH_3', 'grigliaAH_4', 'grigliaAH_5', 'grigliaAH_6',
                  'grigliaAH_7', 'grigliaAH_8', 'grigliaAH_9'];
  // mappaLocaleImpostata = false;

  showLegend = true;

  componenteCaricato = false;
  tabSelezionato2;
  refreshMascheraSettings = false;
  subscribe = null;
  subscribeF = null;

  strutturaGraficiVuota = true;

  puntoSelezionatoLayer = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  wmsPuntoSelezionato;

  urlWms = environment.urlBaseGS + '/wms';
  // viewLocal: OlView;
  refreshWindows;
  mainViewShow = true;
  massimizzata = false;

  lastHttp;
  lastHttpC;
  wms = undefined;
  wmsSMS;
  pathWmsClickato;
  strutturaClick;
  // eventiPerGrafico;

  // menuVisibile1 = false;

  MeasureDN = ['', '', '', '', '', '', '', '', '', ''];
  scrittaLine;
  scrittaSample;
  // scrittaOverlay;
  // scrittaOverlayTipo;

  // map2: OlMap;
  // map3: OlMap;
  // source: OlXYZ;
  layer;
  // measureLayer2;
  // measureLayer3;
  pathLayer;
  pathLayerBBOX;
  pathLayerGeometry;
  overlayLayer = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  raysAllLayer = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  overlayLayerGlobal = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  pathLayerClickato;
  pathServingCell = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  pathShowRays = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  pathSartPosition = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  pathEvents;
  antennaLayer1 = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  antennaLayer2 = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  antennaLayerDD = ExternalUtilities.creaVettore(environment.quantePagine, undefined);
  clusterLayerDD = ExternalUtilities.creaVettore(environment.quantePagine, undefined);

  metodoVisualizzazione2 = '';
  toolbarShowed2 = true;
  slaName2;
  slaNameComplete;
  ActivityName2;
  act_id;
  act_id2;
  act_set_id2;
  listaEventiDaPassare2 = undefined;
  listaEventiDaPassareTemp;
  refreshQuanteMisure2;
  tmsTitle;

  visualizzaNomeSla;

  items: any[] = [
    { id: 0, name: '' },
    { id: 1, name: 'SINR(dB)' },
    { id: 2, name: 'CQI' },
    { id: 3, name: 'RSRP(dB)' },
    { id: 4, name: 'RSRQ(dB)' }
  ];

  layerStamen;
  layerGoogle;
  layerOSM;
  layerSatellite;
  layerCartoDb;
  layerScelto;
  overviewMapControl;
  // lente;

  impostazioni: any = {
    FiltroAntenna: '',
    FiltroAntennaSel: '',
    isCheckedMeasure: '1',
    isCheckedCoverage1: '1',
    latPartenza: 0,
    lonPartenza: 0,
    plmn: '',
    dimeMappa: 93,
  };

  vecchioLayerScelto1 = -1;

  signalPath = '';

  wmsSourceCoverage1;
  wmsEvents;
  source;

  padding: any = { left: 10, top: 5, right: 10, bottom: 5 };
  titlePadding: any = { left: 50, top: 0, right: 0, bottom: 10 };

  opacitaBottone = 0;

  cambiatoMeasure = true;
  cambiatoAntenne1 = true;
  cambiatoGrafico1 = false;

  scriviDebug = false;

  // settingsVisibile = '';

  slaGroup2;
  slaValue2;

  dBarraAperta = 26;
  dBarraChiusa = 3;
  dimeBarraAperta = 26;
  startDateForUpdate = null;

  measureData2;
  act_set;
  act_set_id;
  act_set_originale;

  isCheckedServingCell2;
  isCheckedShowPaths2;
  isCheckedShowSelectedPaths2;
  showRays2;
  sartPosition2 = false;
  measureSMS2;
  mappeMS2;
  clusterMeasure12;
  clusterMeasure22;
  // lov2;
  correlation2;
  textFilter12;
  textFilter22;
  // textLov2;
  addGlobalLayer2;
  additionalLayer2;
  additionalLayerDiretto2;
  additionaLayerTmsMin2;
  additionaLayerTmsMax2;
  additionalLayerMisura;
  cellaSelezionata2;
  measureRCM2;
  mappeStyle2;
  showRaysAllLayer2;
  isCheckedAntenne2;
  overviewZoom2;
  // frameType2;
  MappaOGrafico2;
  MappaOGraficoTutti2;
  frameName2;
  gridName2;
  // titoloFrame2;
  frameDescription2;
  allFramesDescriptions2;
  settaMascheraVuota;
  styleMappa2;
  countHistogram2;
  listaActivityName2;
  Activity2;
  frameVisible2 = false;
  tmsSelezionatoPerGraficoMem;
  tmsSelezionato;
  overlay2;
  overlayCluster2;
  timeFilter2;
  isSyncTms2;
  clusterGroup2;
  datiSLA2;
  datiSlaDT2;
  slaValueGlobale2;
  mapStyleGlobale2;
  mapTypeLocale;
  clusterGlobale2;
  viewDefinition2 = undefined;
  designInfo2;
  frameAttivo2;
  frameAttivoAppoggio2;
  mapType2 = 1;
  styleSize2;
  datiLookUp2;
  datiAddLayers2;
  cellType2;
  addLayers2;
  // extent2 = undefined;
  dimensioniFinestraLegenda2 = 15;
  dimensioniFinestraLegenda2Y = 4;
  histDisplayAs2 = '';
  histDisplayTutto2 = '';
  columnsBars2 = '';
  doubleGraph2 = '';
  eventsMeasure2 = '';
  dashboardAttiva2 = '';
  DatiActivityEventsMem;
  showPlanimetry2;
  // columnsSettings2;
  datiEventSummary;
  messaggioWarningAS = '';
  idSelezionatoES = [-1];
  idSelezionatoTC = -1;
  stringaAGNoACT2 = '';
  tipoEvento2 = '';
  fixedSeconds2 = '';
  tcRunSelected = false;
  npsSelected = false;

  eventiSceltiES2 = new Array();
  eventiSceltiESGlobali2 = new Array();
  eventiSceltiESDiPassaggio;
  eventiSceltiES2Testo = '';
  eventiSceltiGlobaliESDiPassaggio;
  eventiSceltiGlobaliES2Testo = '';
  datiActivitySet2;
  centroAttuale2;
  rotation;
  listaStileSizes2;
  styleSizeGlobale2 = 14;
  datiTipiFrame;

  // datiActivitiesD;
  impostaPaginaCD2;
  impostaPaginaLA;
  impostaPaginaMF = undefined;
  // impostaPaginaLA2;
  effettuaAutoFitMeasureDFN;
  effettuaAutoFitCD2;
  effettuaAutoFitMosaicGrid = false;
  effettuaAutoFitClusterGrid = false;
  effettuaAutoFitAreaInfo = false;
  effettuaAutoFitAP = false;
  effettuaAutoFitArfcn = false;
  effettuaAutoFitArfcnAM = false;
  effettuaAutoFitLA = false;
  effettuaAutoFitPLI = false;
  effettuaAutoFitAE = false;
  effettuaAutoFitAE2 = false;
  effettuaAutoFitPM = false;
  raggruppamentoPM = false;
  effettuaAutoFitES = false;
  effettuaAutoFitTC = false;
  effettuaAutoFitNPS = false;
  effettuaAutoFitCM = false;
  effettuaAutoFitM2 = false;
  effettuaAutoFitMF = false;
  effettuaAutoFitCME = false;
  effettuaAutoFitCD = false;
  effettuaAutoFitCV = false;
  effettuaAutoFitCS = false;
  // effettuaAutoFitInfo = false;
  // effettuaAutoFitFile = false;
  effettuaAutoFitCSV = false;

  ultimaVoltaRefresh = 0;
  cambioPerRange;
  vecchioCambioPerRange;
  opacity2;

  visualizzaIstogrammiGrafici = true;

  expandedKeys: any[] = [];

  dataPerExcel;
  geoCoder;

  datiNotebook2;
  sessionID2;
  NumeroFrame2;
  userName2;

  debug2 = false;
  modalitaDebug2 = false;
  eseguitoInProgetto2 = false;
  shownEvents2 = false;
  bboxOZ2;
  lastBBoxExec = -1;
  geoFilter2;
  numeroActSetVisibili2;

  nomiColonneMG;
  nomiColonneCG;
  ritardoPerAccentratore = 550;
  ritardoPerFunzioni = 2500;

  tipoDataset2;
  lastDays2;
  tmsPassatiDaProgetto2;
  tmsPassatiDaProgettoTcRun2;

  center_position2;
  time_cursor_position2;

  progettoEsterno2 = '';
  nomeAntennaDD2 = '';
  parametriDD2 = '';
  nomeClusterDD2 = '';

  sizeCdrVoiceA = 50;
  sizeCdrVoiceB = 50;
  sizeCdrDataA = 50;
  sizeCdrDataB = 50;

  ultimaVoltaTMSDM = -1;
  ultimaVoltaTMSME = -1;
  valoreRiduzione = 1000;
  // ultimaVoltaTMS = ExternalUtilities.creaVettore(environment.quantiFrames, -1);

  titoloPointMeasures = 'Point Measures';

  titoloChart = new Array();
  zoomMap2 = 1;
  geoFilterClick2 = -1;
  comboSelArea2 = 1;
  isNonSyncEventTime2;
  isStandAloneMR2 = false;
  showAxisX2;
  heightChart2;
  modalitaRealTimeAttiva2 = false;
  
  // MAIL Federico 27/06/2022 ore 09:30. Impostato a true perchÃ© non serve piÃ¹ il controllo
  permessoFleetManagerAM2 = true;
  // MAIL Federico 27/06/2022 ore 09:30. Impostato a true perchÃ© non serve piÃ¹ il controllo

  frameAttuale = this;
  datiGrigliaExport;
  visualizzaGrigliaExport = false;
  ricaricaTcRun;
  nomiFrames2;
  ultimaVoltaTMS = ExternalUtilities.creaVettore(environment.quantiFrames, -1);

  chiSonoClickA = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  cellSet2;

  misureAddizionaliTCRUN2;
  menuAperto2 = false;

  // VARIABILI MAPPA
  // ultimaPosizioneZoom = ExternalUtilities.creaVettore(environment.quantiFrames, []);
  // mappaVisibile = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  misureGlobaliMappa = ExternalUtilities.creaVettore(environment.quantiFrames, ['', '', '', '', '']);
  viewAs2 = ExternalUtilities.creaVettore(environment.quantiFrames, 1);
  // subscribeAttesaMappa = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  map1 = ExternalUtilities.creaVettore(environment.quantiFrames, null); // OlMap;
  // creataMappa = false;
  currZoom = -1;
  mappaForzata = false;
  ultimaVoltaRC = ExternalUtilities.creaVettore(environment.quantiFrames, 0);
  // mappaVisibile = true;
  viewMappaAttuale: OlView; // = ExternalUtilities.creaVettoreOggetto(environment.quantiFrames, new OlView); // : OlView = undefined;
  // viewMappaGlobale: OlView = undefined; // ExternalUtilities.creaVettore(environment.quantiSottoFrames, undefined);
  // viewMappaLocale: OlView = undefined; // ExternalUtilities.creaVettore(environment.quantiSottoFrames, undefined);
  // mappaLocaleImpostata = false;
  // mappaGlobaleImpostata = false;
  // VARIABILI MAPPA

  // VARIABILI TCRUNINFO
  pulisceDatiTcRunInfo = '';
  agnPerTcInfo = '';
  // VARIABILI TCRUNINFO

  // VARIABILI ISTOGRAMMI
  measureDaDisegnareHistogram = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  visualizzaGrigliaExportH = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  datiGrigliaExportH = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  messaggioWarningH = '';
  ultimiDatiGrigliaIsto = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  lastCallHistogram = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  vecchioJson = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  tipiApp = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  arrayApp = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  righeApp = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  nomiLabelsApp = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  chartsIstogrammi = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  dimeBarre = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  dimeYApp = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  asseXMinimo = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  asseXMassimo = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  numeroColonne = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  timeStampChiamataIstogrammi;
  altezzaGraficiIstogrammi = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  chiSonoIstogrammi = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  staGiaDisegnandoGraficiHistogram = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  ciSonoDatiIstogrammi = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  effettuaAutoFitAH = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  // grigliaAHVisibile = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  // VARIABILI ISTOGRAMMI

  // VARIABILI ACTIVITIES
  lastCallActivities = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiActivities;
  messaggioWarningA = '';
  erroreActivities = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  timeStampChiamataActivities1;
  timeStampChiamataActivities2;
  chiSonoActivities = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI ACTIVITIES

  chiSonoLegenda = ExternalUtilities.creaVettore(environment.quantiFrames, '');

  // VARIABILI AREA INFO
  lastCallAreaInfo = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiAreaInfo;
  messaggioWarningAI = '';
  erroreAreaInfo = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  timeStampChiamataAreaInfo;
  vecchiDatiAreaInfo;
  chiSonoAreaInfo = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI AREA INFO

  // VARIABILI ARFCN
  lastCallArfcn = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiArfcn;
  messaggioWarningARFCN = '';
  erroreArfcn = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  timeStampChiamataArfcn;
  vecchiDatiArfcn;
  chiSonoArfcn = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI ARFCN

  // VARIABILI ARFCN ALL MEASURES
  lastCallArfcnAM = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiArfcnAM;
  messaggioWarningARFCNAM = '';
  erroreArfcnAM = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  timeStampChiamataArfcnAM;
  vecchiDatiArfcnAM;
  chiSonoArfcnAM = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI ARFCN ALL MEASURES

  // VARIABILI CDR DATA
  lastCallCDData = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiCdrData = undefined;
  messaggioWarningCdrD = '';
  datiCdrDataD = undefined;
  messaggioWarningCdrDD = '';
  erroreCDR = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  vecchiDatiCDR = undefined;
  // VARIABILI CDR DATA

  // VARIABILI CDR VOICE
  lastCallCDVoice = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiCdrVoice = undefined;
  datiCdrSummary = undefined;
  messaggioWarningCdrS = '';
  messaggioWarningCdrV = '';
  vecchiDatiCDV = undefined;
  erroreCDV = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI CDR VOICE

  // VARIABILI CELL MEASURE
  lastCallCM = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiCellMeasure = undefined;
  messaggioWarningCM = '';
  vecchiDatiCellMeasure = undefined;
  erroreCellM = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoCM = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI CELL MEASURE

  // VARIABILI MISTRAL CDR
  lastCallMC = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiMistralCDR = undefined;
  messaggioWarningM2 = '';
  vecchiDatiMistralCDR = undefined;
  erroreMistralCDR = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoMC = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI MISTRAL CDR

  // VARIABILI MISTRAL FLOW SEGMENT
  lastCallMF = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiMistralFS = undefined;
  parametriR12 = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  messaggioWarningFS = '';
  vecchiDatiMistralFS = undefined;
  erroreMistralFS = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoMF = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI MISTRAL FLOW SEGMENT

  // VARIABILI MISTRAL FLOW STAT
  lastCallMFStat = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiMistralFStat = undefined;
  messaggioWarningFSTAT = '';
  vecchiDatiMistralFStat = undefined;
  effettuaAutoFitMStat = true;
  impostaSelezioneMStat = [];
  erroreMistralFStat = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoMFStat = ExternalUtilities.creaVettore(environment.quantiFrames, '');

  lastCallMFStat2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiMistralFStat2 = undefined;
  messaggioWarningFSTAT2 = '';
  vecchiDatiMistralFStat2 = undefined;
  effettuaAutoFitMStat2 = true;
  impostaSelezioneMStat2 = [];
  erroreMistralFStat2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoMFStat2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI MISTRAL FLOW STAT

  // VARIABILI MISTRAL FLOW QUEUE
  lastCallMQ = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiMistralFQ = undefined;
  messaggioWarningFQ = '';
  vecchiDatiMistralFQ = undefined;
  effettuaAutoFitMQ = true;
  impostaSelezioneMQ = [];
  flowType = '';
  filterSelectedMQ = '';
  erroreMistralFQ = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoMQ = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI MISTRAL FLOW QUEUE

  // VARIABILI Mistral RBC-IXL Messages
  lastCallMR = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiMistralR = undefined;
  messaggioWarningR = '';
  vecchiDatiMistralR = undefined;
  effettuaAutoFitMR = true;
  impostaSelezioneMR = [];
  erroreMistralMR = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoMR = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  parametriR1 = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  // VARIABILI Mistral RBC-IXL Messages

  // VARIABILI CLUSTER GRID
  lastCallClusterGrid = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallLayerGeometry = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiClusterGrid = undefined;
  timeStampChiamataCluster;
  vecchiDatiClusterGrid;
  messaggioWarningCG = '';
  erroreCluster = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoClusterGrid = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI CLUSTER GRID

  // VARIABILI EVENTI
  grigliaListaAgentpresente = false;
  lastCallLista = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallCrossTab = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallEventi = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallES = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  appoEventSummary = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  erroreEventSummary = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  puliziaES = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  righeTotali = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  contaEvent = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  js3old = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastTms = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiPointActivityEvents = undefined;
  messaggioWarningAE = '';
  vecchiDatiEventi;
  chiSonoEventi = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  puliziaAE = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  filtriEventi2 = undefined;
  filtroEventiMemorizzati = undefined;
  // VARIABILI EVENTI

  // VARIABILI GRAFICI
  quantiGraficiMax = 200;
  ultimoArrayMisure = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  ultimoArrayMisureMappa = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallGrafici = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallTmsToGps = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  tipoGrafico = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  larghezzaDiv = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  quantiPuntiGrafico = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  dimeBarra = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  datiAppoggio = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  dataInizio = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  dataFine = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  array2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  folders = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  contaGrafici = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  tmsGrafici = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  chartsGrafici = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  giaDisegnataStruttura = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  dataPointsAppoggio = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  DPNulloVecchio = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  DPNullo = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  vecchioaArrayMisure = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  puntiniAppoggio = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  nomiChart = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  nomiGrafici = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  numSamples = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  minimo = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  massimo = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  minimoY = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  massimoY = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  // axisX = ExternalUtilities.creaMatrice(environment.quantiFrames, 150, undefined);
  // axisY = ExternalUtilities.creaMatrice(environment.quantiFrames, 150, undefined);
  graficoVisibile = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, true);
  measureDaDisegnare = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  altezzaGraficiChart = ExternalUtilities.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  erroreGrafici = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  altezzaTotaleGrafici = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  // VARIABILI GRAFICI

  // VARIABILI MEASURE DFN
  lastCallMeasureDFN = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiPointMeasureDFN = undefined;
  vecchiDatiDFN;
  erroreDFN = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  // VARIABILI MEASURE DFN

  // VARIABILI MOSAIC GRID
  lastCallMosaicGrid = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallLayerGeometryMosaic = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiMosaicGrid = undefined;
  messaggioWarningMG = '';
  vecchiDatiMosaicGrid;
  erroreMosaic = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  // VARIABILI MOSAIC GRID

  // VARIABILI NPS
  lastCallTC = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiNPS = undefined;
  messaggioWarningNPS = '';
  vecchiDatiNPS;
  erroreNPS = '';
  // VARIABILI NPS

  // VARIABILI PARETO
  messaggioErrorePareto = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallPareto = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  vecchioJsonPareto = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chartsPareto = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  righePareto = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  tipiPareto = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  conteggi = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  arrayPareto = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  minXPareto = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  maxXPareto = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  timeStampChiamataPareto;
  chiSonoPareto = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  forzaRidisegnoPareto;
  // VARIABILI PARETO

  // VARIABILI POINT LAYER INFO
  lastCallPLI = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // ultimaVoltaTMSPLI = ExternalUtilities.creaVettore(environment.quantiSottoFrames, -1);
  datiPointLayerInfo = undefined;
  messaggioWarningPLI = '';
  vecchiDatiPLI;
  errorePLI = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI POINT LAYER INFO

  // VARIABILI ARFCN POINT
  lastCallAP = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // ultimaVoltaTMSPLI = ExternalUtilities.creaVettore(environment.quantiSottoFrames, -1);
  datiArfcnPoint = undefined;
  messaggioWarningArfcn = '';
  vecchiDatiAP;
  erroreArfcnPoint = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chiSonoArfcnPoint = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI ARFCN POINT

  // VARIABILI POINT CELL MEASURES
  lastCallPointCM = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // js1old = ExternalUtilities.creaVettore(environment.quantiSottoFrames, '');
  // js2old = ExternalUtilities.creaVettore(environment.quantiSottoFrames, '');
  datiPointCellMeasures = undefined;
  messaggioWarningPCM = '';
  vecchiDatiPointCellMesaures;
  errorePCM = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI POINT CELL MEASURES

  // VARIABILI SCATTER
  lastCallScatter = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  vecchioJsonScatter = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  chartsScatter = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  arrayScatter = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  righeScatter = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  tipiScatter = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  asseYMin = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  asseYMax = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  asseXMin = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  asseXMax = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  coloriFinali = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  timeStampChiamataScatter;
  forzaRidisegnoScatter;
  chiSonoScatter = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI SCATTER

  // VARIABILI TCRUN
  lastCallTCRun = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  puliziaTC = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiTcRun = undefined;
  messaggioWarningTC = '';
  timeStampChiamataTCRUN;
  vecchiDatiTcRun;
  erroreTcRun = ExternalUtilities.creaVettore(environment.quantiFrames, '')
  chiSonoTcRun = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI TCRUN

  // VARIABILI POINT MEASURES
  lastCallPI = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  datiPointMeasures = undefined;
  messaggioWarningPM = '';
  // vecchiDatiPointMeasures; Gia c'Ã¨
  // VARIABILI POINT MEASURES

  // VARIABILI ANTENNE
  lastCallAntenne = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI ANTENNE

  // VARIABILI LAYERS DD
  lastCallAntenneDD = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallCluster = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI LAYERS DD

  // VARIABILI MEASURES
  measureLayer = undefined;
  lastCallMeasures = ExternalUtilities.creaVettore(environment.quantiFrames, new Array());
  lastCallMeasuresSMS = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI MEASURES

  // VARIABILI PATH
  lastCallPath = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallPath2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallPath3 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallPath4 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallPathSC = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallSartPosition = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallSchedSel = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  agentPosition = ExternalUtilities.creaVettore(environment.quantiFrames, -1);
  puntoSelezionato = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI PATH

  // VARIABILI RAYS ALL LAYER
  lastCallSRAL1 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallSRAL = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  stringaRitorno = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastUrl = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  staLeggendo = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  esci = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  checkFalso = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  // VARIABILI RAYS ALL LAYER

  // VARIABILI ADDITIONAL LAYER
  lastCallAL = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallAL2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  timer = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
  // VARIABILI ADDITIONAL LAYER

  // VARIABILI LEGENDA
  lastCallLegenda = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  // VARIABILI LEGENDA

  public hasChildren = (item: any) => item.items && item.items.length > 0;
  public fetchChildren = (item: any) => of(item.items);

  paginaSelezionata2;
  editMode2 = false;

  constructor(
    private router: Router,
    public platform: Platform,
    public synoptic: SynopticComponent,
    // s
    public http: HttpClient,
    private layers_DD: LayersDDComponent,
    private additional_Layer: AdditionalLayerComponent,
    private areaInfoComponent: AreaInfoComponent,
    private arfcnComponent: ArfcnComponent,
    private arfcnComponent_am: ArfcnComponentAllMeasures,
    private arfcnPoint: ArfcnPointComponent,
    // private mapsAPILoader: MapsAPILoader,
    private mosaicGrid: MosaicGridComponent,
    private clusterGrid: ClusterGridComponent,
    private contaSpazi: ContaDimensioneArrayComponent,
    private cdrVoice: CDRVoiceComponent,
    private activities: ActivitiesComponent,
    private cdrData: CDRDataComponent,
    private pointCellMeasures: PointCMComponent,
    private cellMeasure: CellMeasuresComponent,
    private mistral_grid: MistralGridComponent,
    private mistral_flow: MistralFlowComponent,
    private mistral_flow_stat: MistralFlowStatComponent,
    private mistral_flow_queue: MistralFlowQueueComponent,
    private mistral_rbc_ixl: MistralRbcIxlComponent,
    public planimetry: PlanimetryComponent,
    private datePipe: DatePipe,
    private apiService: ExternalApiService,
    private downloadFile: ExternalDownloadFileService,
    private pointComponent: PointComponent,
    private eventsComponent: EventsComponent,
    private measuresComponent: MeasuresComponent,
    // private graficiComponent: GraficiComponent,
    private graficiComponent: GestioneGrafici,
    private graficiComponentAE: GestioneGraficiAE,
    // private pivotComponent: PivotComponent,
    private pointLayerInfo: PointLayerInfoComponent,
    private scatterComponent: ScatterComponent,
    private histogramComponent: HistogramComponent,
    private paretoComponent: ParetoComponent,
    private pathComponent: PathComponent,
    private legendaComponent: LegendaComponent,
    private puntoSelezionatoComponent: PuntoSelezionatoComponent,
    private antenneComponent: AntenneComponent,
    public exportComponent: ExportComponent,
    public sanitizer: DomSanitizer,
    private measureDFNComponent: MeasureDFNComponent,
    // public Utils2: Utils,
    // private cdRef: ChangeDetectorRef,
    private showRaysAllLayerC: ShowRaysAllLayerComponent,
    private exportGridComponent: ExportGridComponent,
    private _matDialog: MatDialog,
    private tcRunComponent: TCRunGridComponent,
    private NPSComponent: NPSComponent,
    private puliziaComponent: PuliziaComponent,
    private disegnaMappe: DisegnoMappe,
    public ngZone: NgZone,
    // private captureService: NgxCaptureService
  ) {
    // ExternalUtilities.mostraMessaggio(this, 'Sto partendo', false);
    // this.openDialog('Piripicchio', '', null);
  }

  // La mappa OpenLayers è creata fuori dalla zona Angular (i suoi eventi interni non lanciano change detection):
  // gli handler che modificano lo stato del componente devono rientrare nella zona con questo wrapper
  inZonaAngular(fn) {
    return (...args) => this.ngZone.run(() => fn(...args));
  }

  ridisegnaGraficiDopoScroll() {
    this.graficiVisibili = false;
    if (this.shownEvents2) {
      this.graficiComponent.disegnaGraficiAVideo(this, 0);
    }

    // const numeroCharts = t.chartsGrafici[t.NumeroFrame2];
    for (let numeroGrafico = 1; numeroGrafico < this.quantiGraficiMax; numeroGrafico++) {
      // const element2 = this.chartsGrafici[this.NumeroFrame2][numeroGrafico];
      // if (element2 && element2 !== null && element2 !== '' && element2.canvas && element2.canvas !== null) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ridisegna dopo scroll', numeroGrafico);
        // this.graficiComponent.disegnaSelezioneGraficiSingolo(this, this.Utils.tmsSelezionato, numeroGrafico, 'Ridisegna');
        this.graficiComponent.disegnaGraficiAVideo(this, numeroGrafico);
      // } else {
      //   if (this.modalitaRealTimeAttiva2) {
      //     this.altezzaGraficiChart[this.NumeroFrame2][numeroGrafico] = 0;
      //   }
      // }
    };

    /* const tm = setTimeout(() => {
          clearTimeout(tm);
      for (let numeroGrafico = 0; numeroGrafico < this.quantiGraficiMax; numeroGrafico++) {
        this.graficiComponent.disegnaSelezioneGraficiSingolo(this, this.Utils.tmsSelezionato, numeroGrafico, 'Ridisegna');
      } */

      const tm = setTimeout(() => {
        clearTimeout(tm);

        this.graficiVisibili = true;  
      }, 100);
    // }, 1000);
  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnDestroy(): void {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Destroy frame ', this.NumeroFrame2, this.frameAttivo2);
    // this.actionSubject.complete();

    // Ogni accesso è protetto: un errore qui impedirebbe destroy$.next() e lascerebbe aperte le sottoscrizioni
    const grafici = this.chartsGrafici?.[this.NumeroFrame2] || [];
    const istogrammi = this.chartsIstogrammi?.[this.NumeroFrame2] || [];
    const pareto = this.chartsPareto?.[this.NumeroFrame2] || [];
    const scatter = this.chartsScatter?.[this.NumeroFrame2] || [];
    const quanti = Math.max(grafici.length, istogrammi.length, pareto.length, scatter.length);

    for (let i = 0; i < quanti; i++) {
      const nome = "chartContainers_" + this.frameAttivo2 + "_" + this.NumeroFrame2 + "_" + i;

      const canvas = document.getElementById(nome) as HTMLCanvasElement;
      const ctx = canvas?.getContext ? canvas.getContext('2d') : null;
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      [grafici[i], istogrammi[i], pareto[i], scatter[i]].forEach(chart => {
        if (chart && chart.destroy) {
          try {
            chart.destroy();
          } catch (e) {
            // grafico già distrutto
          }
        }
      });
    }

    this.liberaMappa();

    // Ferma i timer che altrimenti continuerebbero a girare dopo la distruzione del frame
    if (this.tAccentratoreOnChanges) {
      clearTimeout(this.tAccentratoreOnChanges);
    }
    [this.timerControlloScroll, this.tmrSelezioneES, this.tmrSelezioneGlobaliES, this.tSpazioMemoria, this.tAttesaCsv,
      this.intervalSpostamentoMappa?.[this.NumeroFrame2]].forEach(timer => {
      if (timer) {
        clearInterval(timer);
      }
    });

    this.puntoSelezionato[this.NumeroFrame2] = '';
    this.graficiComponent.pulisceAppoggi(this);
    this.histogramComponent.pulisceAppoggi(this);
    this.paretoComponent.pulisceAppoggi(this, 'OnDestroy Frame');
    this.scatterComponent.pulisceAppoggi(this);

    if (this.divGrafici) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Destroy divGrafici frame ', this.NumeroFrame2, this.frameAttivo2);

      this.divGrafici.nativeElement.remove();
      this.divGrafici = undefined;
    }
    if (this.divPareto) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Destroy divPareto frame ', this.NumeroFrame2, this.frameAttivo2);

      this.divPareto.nativeElement.remove();
      this.divPareto = undefined;
    }
    if (this.divScatter) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Destroy divScatter frame ', this.NumeroFrame2, this.frameAttivo2);

      this.divScatter.nativeElement.remove();
      this.divScatter = undefined;
    }

    if (this.addressTXT) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Destroy addressTXT frame ', this.NumeroFrame2, this.frameAttivo2);

      this.addressTXT.nativeElement.remove();
      this.addressTXT = undefined;
    }
    if (this.treeViewAE) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Destroy treeViewAE frame ', this.NumeroFrame2, this.frameAttivo2);

      this.treeViewAE.nativeElement.remove();
      this.treeViewAE = undefined;
    }
    if (this.excelExport) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Destroy excelExport frame ', this.NumeroFrame2, this.frameAttivo2);

      this.excelExport.nativeElement.remove();
      this.excelExport = undefined;
    }
    if (this.elementView) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Destroy elementView frame ', this.NumeroFrame2, this.frameAttivo2);

      this.elementView.nativeElement.remove();
      this.elementView = undefined;
    }

    // Annulla le chiamate al server ancora in corso per questo frame: i componenti di elaborazione sono condivisi
    // tra i frame, e senza questo le risposte arriverebbero comunque e verrebbero elaborate sul frame distrutto
    for (const componente of Object.values(this)) {
      const fine = (componente as any)?.destroy$;
      if (fine instanceof FineRichieste) {
        fine.ferma(this);
      }
    }
    GestioneGrafici.destroy$.ferma(this);

    this.destroy$.next();
    this.destroy$.complete();
  }

  // Input di comando: servono a forzare un aggiornamento, quindi non vengono mai scartati
  private static readonly INPUT_DI_COMANDO = /refresh|ridisegna|resetta|forza|pulisc|redraw|aggiorna/i;

  // Contenuto (serializzato) di ogni input oggetto/array così come è stato elaborato l'ultima volta.
  // Si confronta con questo e non con previousValue: Mappe a volte modifica un oggetto sul posto e poi lo ricopia,
  // e in quel caso previousValue contiene già il valore nuovo.
  private ultimiInputElaborati: { [nome: string]: string } = {};

  // Scarta gli input oggetto/array arrivati con un riferimento nuovo ma contenuto identico (es. dopo una copia
  // JSON.parse(JSON.stringify(...)) in Mappe): senza questo filtro ognuno faceva ripartire l'accentratore.
  filtraInputInvariati(r) {
    const filtrati = {};
    for (const nome of Object.keys(r)) {
      const c = r[nome];
      if (c.currentValue !== null && typeof c.currentValue === 'object' && !ExternalFrameComponent.INPUT_DI_COMANDO.test(nome)) {
        let json: string;
        try {
          json = JSON.stringify(c.currentValue);
        } catch (e) {
          json = undefined;
        }
        if (!c.firstChange && json !== undefined && json === this.ultimiInputElaborati[nome]) {
          conta('frame: input invariato (scartato)', nome);
          continue;
        }
        this.ultimiInputElaborati[nome] = json;
      } else {
        delete this.ultimiInputElaborati[nome];
      }
      conta('frame: input cambiato', nome);
      filtrati[nome] = c;
    }
    return filtrati;
  }

  ngOnChanges(r) {
    r = this.filtraInputInvariati(r);
    if (Object.keys(r).length === 0) {
      return;
    }

    let accentra = false;

    this.Utils.fattoQuadrato[this.NumeroFrame2] = false;

    // LASCIARE QUESTO SEMPRE COME PRIMO CONTROLLO
    if (r.MappaOGrafico) {
      if (this.eseguitoInProgetto2 === false) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio MappaOGrafico', this.NumeroFrame2, r.MappaOGrafico.currentValue);

        if (r.MappaOGrafico.currentValue) {
          if (!this.frameName2 || this.frameName2 === '') {
            this.Utils.datiTipiFrameTutti.forEach(element => {
              if (element.id === r.MappaOGrafico.currentValue) {
                this.frameName2 = element.name;
              }
            });
          }
          this.MappaOGrafico2 = r.MappaOGrafico.currentValue;

          // logConsole('Cambio frame ' + this.NumeroFrame2 + ': ' + this.MappaOGrafico2);

          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa o grafico frame ' + this.NumeroFrame + ':', this.MappaOGrafico2);
          // this.controllaTipoMappa(r.MappaOGrafico.currentValue);
          this.DataViewText = '';
          if (this.datiTipiFrame) {
            this.datiTipiFrame.forEach(element => {
              if (element.id === this.MappaOGrafico2) {
                this.DataViewText = element.name;
              }
            });
          }
          // this.creataMappa = false;
          // this.redrawComponente('Mappa o Grafico');
          // this.updateMappa();

          if (this.MappaOGrafico2 === '--') {
            this.frameName2 = '<empty>';
          }

          this.gestisceSquareMeters();

          if (this.MappaOGrafico2 === 'CD' || this.MappaOGrafico2 === 'CV') {
            this.impostaDimensioniCDR();
          } else {
            // if (this.MappaOGrafico2 === 'M' && this.overviewZoom2 === false) {
            if (this.MappaOGrafico2 === 'M') {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Cambio Mappa O Grafico', this.MappaOGrafico2, this.map1[this.NumeroFrame2]); // , this.mappaVisibile

              // if (!this.map1[this.NumeroFrame2]) { // || !this.mappaVisibile) {
                // this.redrawComponente('Imposta MappaOGrafico'); QUESTO
                // // logConsole('Cambio frame M: Coordinate impostate: ', ExternalUtilities.csvLetto);
                // const tm = setTimeout(() => {
                  // clearTimeout(tm);
                  // alert('Leggo pos per cambio frame ' + this.NumeroFrame2 + ': ' + this.Utils.posizioneActivity);
                  if (this.Utils.posizioneActivity && this.Utils.posizioneActivity.indexOf(";") > -1) { // } && this.viewMappaAttuale && this.map1[this.NumeroFrame2]) {
                    const vals = this.Utils.posizioneActivity.split(';');
  
                    const minLat = vals[1];
                    const minLng = vals[2];
                    const maxLat = vals[3];
                    const maxLng = vals[4];
                    const mediaLon = (+maxLng + +minLng) / 2;
                    const mediaLat = (+maxLat + +minLat) / 2;
  
                    let coord;
                    if (mediaLon > 200) {
                      coord = [+mediaLon, +mediaLat];
                    } else {
                      coord = transform([+mediaLon, +mediaLat], 'EPSG:4326', 'EPSG:3857');
                    }
                    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato per cambio tipo frame', coord);
            
                    if (this.viewMappaAttuale) {
                      this.viewMappaAttuale.setCenter(coord);
                    }
                    if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null) {
                      // this.impostaPosizioneSchermata(coord, false, 'CambioFrame', true, false);
                      // this.map1[this.NumeroFrame2].getView().setCenter(coord);
                    }
                  }                    
                // }, 1000);
              // }
            }
          }
        }
      }

      this.creaNomiFramesPerTab();
    }
    // LASCIARE QUESTO SEMPRE COME PRIMO CONTROLLO
    

    // if (this.NumeroFrame === 1) {
    //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'On Changes frame', r);
    // }
    if (r.debug) {
      if (r.debug.currentValue !== undefined) {
        this.debug2 = r.debug.currentValue;
      }
    }

    if (r.modalitaDebug) {
      if (r.modalitaDebug.currentValue !== undefined) {
        this.modalitaDebug2 = r.modalitaDebug.currentValue;
        // alert('ModalitÃ  debug: ' + this.modalitaDebug2);
      }
    }

    let okAgn = false;

    if (r.puliziaFrame) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Richiesta Pulizia frame', this.NumeroFrame2, this.frameAttivo2);

      // TOLTO 14 Febbraio 2025... Scattavano eventi multipli
      // this.puliziaComponent.pulisceFrame(this, -1, true);
    }

    if (r.stringaAGNoACT) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'stringaAGNoACT', r.stringaAGNoACT.currentValue);

      ExternalUtilities.stringaAGNoACT = r.stringaAGNoACT.currentValue;
      this.agnPerTcInfo = ExternalUtilities.stringaAGNoACT;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'stringaAGNoACT', ExternalUtilities.stringaAGNoACT, this.frameAttivo, this.NumeroFrame);
      okAgn = true;

      accentra = true;
    }

    if (r.indirizzoServer) {
      if (r.indirizzoServer.currentValue) {
        this.indirizzoServer2 = r.indirizzoServer.currentValue;
        // logConsole('Indirizzo server passato a frame ' + this.NumeroFrame2 + ': ', this.indirizzoServer2);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Indirizzo server', this.indirizzoServer2);
      }
    }

    if (r.measureDataCompleti) {
      this.measureDataCompleti2 = r.measureDataCompleti.currentValue;
      if (!this.measureDataCompleti2) {
        this.measureDataCompleti2 = new Array();
      }
    }

    if (r.viewModeMS) {
      this.viewModeMS2 = r.viewModeMS.currentValue;
      // logConsole('View mode MS passato a frame ' + this.NumeroFrame2 + ': ', this.viewModeMS2);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'viewModeMS passato', this.viewModeMS2);

      accentra = true;
    }

    if (r.flowTypeMS) {
      this.flowTypeMS2 = r.flowTypeMS.currentValue;
      // logConsole('Flow type MS passato a frame ' + this.NumeroFrame2 + ': ', this.flowTypeMS2);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'flowTypeMS passato', this.flowTypeMS2);

      accentra = true;
    }

    if (r.agnGroupId) {
      this.agnGroupId2 = r.agnGroupId.currentValue;

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AGN Group id passato', this.agnGroupId2);

      okAgn = true;

      accentra = true;
    }

    if (r.deltaEvents) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato delta', this.NumeroFrame2, this.Utils.tmsDelta);

      if (this.Utils.tmsDelta !== undefined && this.Utils.tmsDelta !== null) {
        this.eventsComponent.prendeListaAgents(this); //  , this.offsetAe // 21/07/2025 per mail 26=706/2025 10:03

        this.eventsComponent.prendeEvents(this, true, false, false); // , -3
      }
    }

    if (r.cellSet && r.cellSet.currentValue) {
      this.cellSet2 = r.cellSet.currentValue;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato cell set', this.NumeroFrame2, this.cellSet2);

      accentra = true;    
    }

    if (r.menuAperto) {
      this.menuAperto2 = r.menuAperto.currentValue;
      if (this.menuAperto2 === true) {
        this.barraImpostataAperta = true;
        this.creaNomiFramesPerTab();
        this.barraTitoloAperta(); 
        this.apreViews();          
      } else {
        this.barraImpostataAperta = false;
        this.chiudeViews(); 
        this.barraTitoloChiusa();
      }
      // logConsole('Menu aperto', this.menuAperto2, this.barraImpostataAperta, this.dimeBarraAperta);
    }

    if (r.timerSynch) {
      if (!r.timerSynch.currentValue) {
        this.timerSynch2 = true;
      } else {
        this.timerSynch2 = false;
      }
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'timerSynch passato', this.timerSynch2);
    }

    if (r.misureAddizionaliTCRUN) {
      if (r.misureAddizionaliTCRUN.currentValue) {
        this.misureAddizionaliTCRUN2 = r.misureAddizionaliTCRUN.currentValue;

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure addizionali tcrun passate', this.misureAddizionaliTCRUN2);
      }
    }

    if (r.agnGroup) {
      this.agnGroup2 = r.agnGroup.currentValue;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AGN Group passato', this.agnGroup2);

      okAgn = true;

      accentra = true;
    }

    if (r.misurePassateDaContext && r.misurePassateDaContext.currentValue) {      
      this.misureComboDaContext = r.misurePassateDaContext.currentValue;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Passaggio misure globali', this.NumeroFrame2, this.misureComboDaContext);

      this.refreshPointMeasures(false);
    }

    if (r.filterMQ && r.filterMQ.currentValue) {
      // logConsole('Filter MQ passato a frame ' + this.NumeroFrame2 + ': ', r.filterMQ.currentValue);
      this.filterSelectedMQ = r.filterMQ.currentValue;

      accentra = true;
    }

    if (r.imsiPassato) {
      this.bloccaCaricamentoJsonMF = new Date().toString();
      this.testoJsonMF = "";
      this.totaleRigheJsonMF = 0;
      // logConsole('Imsi passato a frame ' + this.NumeroFrame2 + ': ', r.imsiPassato.currentValue);
      this.imsiSelezionato = r.imsiPassato.currentValue;

      accentra = true;
    }

    if (r.uniqueIDPassato) {
      this.bloccaCaricamentoJsonMF = new Date().toString();
      this.testoJsonMF = "";
      this.totaleRigheJsonMF = 0;
      // logConsole('UniqueID passato a frame ' + this.NumeroFrame2 + ': ', r.uniqueIDPassato.currentValue);
      this.uniqueID = r.uniqueIDPassato.currentValue;

      accentra = true;
    }

    if (r.ridisegnaMappa) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiornamento mappe', this.NumeroFrame2, this.MappaOGrafico2);
 
      const misure = r.ridisegnaMappa.currentValue;
      if (this.MappaOGrafico2 === 'M') {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Attendo misure arrivate mappa', this.NumeroFrame2, misure);
        if (this.ultimoArrayMisureMappa[this.NumeroFrame2] !== JSON.stringify(misure)) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confronto array: Pulisco flag di ridisegno. Nuove: ', this.NumeroFrame2, misure);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confronto array: Pulisco flag di ridisegno: Vecchie', this.NumeroFrame2, this.ultimoArrayMisureMappa[this.NumeroFrame2]);
  
          this.ultimoArrayMisureMappa[this.NumeroFrame2] = JSON.stringify(misure);

          const array = this.prendeMisurePerLegenda();
          this.legendaComponent.disegnaLegenda(this, array, false);
        } else {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure arrivate uguali mappa', this.NumeroFrame2, misure);
        }
      } else {
        ExternalUtilities.misureGlobali = misure;
        this.inviaMisure(misure, 'OnChanges');

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure arrivate NON mappa', this.NumeroFrame2, misure);
      }

      this.misureGlobaliMappa[this.NumeroFrame2] = misure;

      accentra = true;
    }

    if (r.centroImpostatoDaEsterno) {
      if (r.centroImpostatoDaEsterno.currentValue) {
        const centroImpostato = r.centroImpostatoDaEsterno.currentValue;
        const c = JSON.stringify(centroImpostato.centro);
        if (c.toUpperCase().indexOf('NaN') > -1) {
          // logConsole('Centro impostato da esterno NaN: ', this.NumeroFrame2, centroImpostato, c);
        } else {
          let centro = centroImpostato.centro;
          const overViewPassato = centroImpostato.tipoMappa;
          const funzione = centroImpostato.funzione;

          // logConsole('Centro impostato 1', this.NumeroFrame2, this.MappaOGrafico2, centroImpostato, centro, this.overviewZoom2);

          let ok = true;
          let i = 0;
          centro.forEach(element => {
            if (ok && (isNaN(element) || element === undefined || element === null || element === 'NaN' || 
              element === 'undefined' || element === 'null')) {
                logConsole('Valore non numerico nel centro', this.NumeroFrame2, centro, element, i);
              ok = false;
            }
            i++;
          });
          if (ok) {
            // if (centro[0] < 200) {
            //   centro = transform(centro, 'EPSG:4326', 'EPSG:3857');
            // }

            // logConsole('Centro impostato da esterno (' + centroImpostato.funzione + '): ', this.NumeroFrame2, centro, this.zoomImpostatoNelFrame);        

            /* let impostaPosizione = true;
            let impostaZoom = false;
            switch (+this.zoomMap2) {
              case -1:
                break;
              case 1:
                impostaPosizione = true;
                break;
              case 2:
                impostaPosizione = true;
                impostaZoom = true;
                break;
            } */

            // if (impostaPosizione === false && impostaZoom === true) {
            let centroF = centro;

            /* if (centro.length > 2) {
              // const centro1 = +centro[0] + ((+centro[2] - +centro[0]) / 2);
              // const centro2 = +centro[1] + ((+centro[3] - +centro[1]) / 2);
              centroF = centro; // [centro1, centro2];
            } else {
              centroF = [+centro[0], centro[1]];
              if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null) {
                this.map1[this.NumeroFrame2].getView().setZoom(+centroImpostato.zoom);
                this.map1[this.NumeroFrame2].getView().setCenter(centroF);
                centroF = this.map1[this.NumeroFrame2].getView().calculateExtent(this.map1[this.NumeroFrame2].getSize());
              }
              // logConsole('Arrivato centro a 2 dimensioni. Lo quattrizzo: ', this.NumeroFrame2, centro, centroF);
            } */

            // logConsole('Imposto posizione e zoom (1): ', this.NumeroFrame2, this.overviewZoom2, this.zoomMap2, centro, centroF, impostaPosizione, impostaZoom);

            // logConsole('Imposto centro 6', this.NumeroFrame2, centroF, this.zoomImpostatoNelFrame);
            this.centroImpostato = centroF;
            this.bboxImpostataNelFrame = centroF;
            this.zoomImpostatoNelFrame = +centroImpostato.zoom;

            let impostaPosizione = true;
            let impostaZoom = false;

            if (this.overviewZoom2) {
              this.centroImpostatoOverView = centroF;
              this.zoomImpostatoNelFrameOverView = this.zoomImpostatoNelFrame;
              impostaPosizione = true;
              impostaZoom = true;
            } else {
              this.centroImpostatoZoom = centroF;
              this.zoomImpostatoNelFrameZoom = this.zoomImpostatoNelFrame;
              impostaPosizione = true;
              impostaZoom = false;
            }

            // logConsole('Centro impostato 2', this.NumeroFrame2, this.MappaOGrafico2, centroImpostato, centro, this.overviewZoom2, overViewPassato);
            if (this.MappaOGrafico2 === 'M' && this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.NumeroFrame2 !== centroImpostato.daChi && 
                (this.overviewZoom2 === overViewPassato || overViewPassato === "GETCOORD" || funzione === "ClickChart")) {
                // logConsole('Centro impostato 3', this.NumeroFrame2, centroImpostato, centro, this.overviewZoom2);
                // { daChi: this.NumeroFrame2, funzione: 'OnChanges 0', centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame }
                if (centroImpostato.centro) {
                  this.staSpostandoMappaZoom[this.NumeroFrame2] = true;
  
                  // if (this.overviewZoom2) {
                    // logConsole('Centro impostato da esterno: ', this.NumeroFrame2, centroImpostato, this.overviewZoom2, overViewPassato);
                    this.impostaPosizioneSchermata(centroF, false, "ImpostoCentro1", impostaPosizione, impostaZoom);
                    // this.map1[this.NumeroFrame2].getView().setCenter(centroF);

                    // this.updateSizeMappa('ImpostoCentro1');
                  // }

                  this.staSpostandoMappaZoom[this.NumeroFrame2] = false;
                /* } else {
                  if (impostaPosizione === true && impostaZoom === true) {
                    if (this.overviewZoom2 === false) {
                      / *
                      if (centro.length > 2) {
                        logConsole('Imposto fit', this.NumeroFrame2, centro, centro.length);
                        this.map1[this.NumeroFrame2].getView().fit(centro);
                      } else {
                        this.map1[this.NumeroFrame2].getView().setCenter(centro);
                        /* this.zoomImpostatoNelFrame = this.map1[this.NumeroFrame2].getView().getZoom();
                        this.map1[this.NumeroFrame2].getView().setZoom(this.zoomImpostatoNelFrame);
                        const bboxNuova = this.map1[this.NumeroFrame2].getView().calculateExtent(this.map1[this.NumeroFrame2].getSize());
                        this.centroImpostato = bboxNuova; * /
                        // logConsole('Imposto centro con zoom', this.NumeroFrame2, centro, this.zoomImpostatoNelFrame, centro.length);
                      }
                      // this.map1[this.NumeroFrame2].getView().setZoom(this.zoomImpostatoNelFrame);

                      this.updateSizeMappa('ImpostoCentro2');
                      * /
                    this.impostaPosizioneSchermata(centro, false, "ImpostoCentro2", impostaPosizione, impostaZoom);
                    }

                    this.staSpostandoMappaZoom[this.NumeroFrame2] = false;
                    ExternalUtilities.frameZoomSpostato = -1;
                  } */
                // }

                // this.viewMappaAttuale = this.map1[this.NumeroFrame2].getView();
              }

              ExternalUtilities.frameZoomSpostato = -1;
            }
          }
        }
      }
    }

    if (r.refreshPlanimetria) {
      if (r.refreshPlanimetria.currentValue !== '') {
        PlanimetryComponent.ultimo[this.NumeroFrame2] = new Date().toString();
        // logConsole('Planimetria Redraw', this.NumeroFrame2);
        
        this.planimetry.caricaPiantina(this);
      }
    }

    if (r.checkSeverity) {
      if (r.checkSeverity.currentValue !== undefined) {
        this.checkSeverity2 = r.checkSeverity.currentValue;
        accentra = true;
      }
    }

    if (r.passaggioBoxDisegnataSullaMappa) {
      const boxDisegnatoSuMappa = r.passaggioBoxDisegnataSullaMappa.currentValue;

      if (boxDisegnatoSuMappa) {
        if (this.MappaOGrafico2 === 'M') {
          ExternalUtilities.bboxSelected = boxDisegnatoSuMappa.stringa;
          this.frameCheHaDisegnatoBox = boxDisegnatoSuMappa.disegnante;

          // logConsole('Box disegnato su mappa: ', this.NumeroFrame2, boxDisegnatoSuMappa, this.frameCheHaDisegnatoBox);

          if (this.NumeroFrame2 !== this.frameCheHaDisegnatoBox) {
            this.vectorMDP = boxDisegnatoSuMappa.layer;
            this.sourceMDP = boxDisegnatoSuMappa.source;

            // this.mosaicGrid.caricamentoLayerGeometry(this);

            /* if (this.map1[this.NumeroFrame2] && this.vectorMDP) {
              this.map1[this.NumeroFrame2].getLayers().forEach(layer => {
                if (layer instanceof VectorLayer) {
                  logConsole('Layer presente: ', layer);
                }
              });
  
              if (this.draw) {
                this.map1[this.NumeroFrame2].removeInteraction(this.draw);
              }
              if (this.snap) {
                this.map1[this.NumeroFrame2].removeInteraction(this.snap);
              }
              
              this.map1[this.NumeroFrame2].removeLayer(this.vectorMDP);
            }
            this.vectorMDP = boxDisegnatoSuMappa.layer;

            this.addLayerToMap(this.vectorMDP, 15, 'VectorMDP'); */
          }
        }

        accentra = true;
      }
    }

    if (r.ridisegnaGrafici) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiornamento grafici', this.NumeroFrame2, this.MappaOGrafico2);
      
      // Mappa / Isto / Scatter / Grafici / Pareto
      if (this.MappaOGrafico2 === 'M' || this.MappaOGrafico2 === 'AH' || this.MappaOGrafico2 === 'PS' || this.MappaOGrafico2 === 'MC' || this.MappaOGrafico2 === 'PC') {
        let n = 0;
        // const t = setInterval(() => {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Attendo misure arrivate', this.NumeroFrame2, n, ExternalUtilities.misureGlobali);
          if (this.ultimoArrayMisure[this.NumeroFrame2] !== JSON.stringify(ExternalUtilities.misureGlobali)) {
            this.giaDisegnataStruttura[this.NumeroFrame2] = false;

            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confronto array: Pulisco flag di ridisegno. Nuove: ', this.NumeroFrame2, ExternalUtilities.misureGlobali);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confronto array: Pulisco flag di ridisegno: Vecchie', this.NumeroFrame2, this.ultimoArrayMisure[this.NumeroFrame2]);            
    
            this.ultimoArrayMisure[this.NumeroFrame2] = JSON.stringify(ExternalUtilities.misureGlobali);

            // this.accentratore(true, 'RIDISEGNA GRAFICI');
            accentra = true;
          } else {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure arrivate uguali', this.NumeroFrame2, n, ExternalUtilities.misureGlobali);

            // clearInterval(t);
          }
          n++;
        // }, 2000);
      }
    }

    if (r.listaEventiSEPassata) {
      /* const id = [-1];
      if (r.listaEventiSEPassata.currentValue) {
        if (this.debug2 === true) {
          // logConsole('listaEventiSEPassata: Passata lista eventi SE', this.NumeroFrame2, r.listaEventiSEPassata.currentValue);
        }

        this.Utils.listaEventiSE.forEach(element => {
          /* if (this.idSelezionatoAE[0] === -1) {
            this.idSelezionatoAE = new Array();
          } * /
          if (element) {
            id.push(element.ROW_ID);
          }
        });
      }
      // const tm = setTimeout(() => {
          clearTimeout(tm);
        // this.idSelezionatoAE = JSON.parse(JSON.stringify(id));
      //   this.vecchioIdSelezionatoAE = JSON.parse(JSON.stringify(id)); 26/10/2023
      // }, 2000);
      if (this.debug2 === true) {
        // logConsole('listaEventiSEPassata: Righe selezionate AE dopo lista eventi', this.NumeroFrame2, this.idSelezionatoAE);
      } */

      // EventsComponent.lastCallCrossTab[this.NumeroFrame2] = '';
      accentra = true;
    }

    if (r.showAdditionalLayers !== undefined) {
      this.showAdditionalLayers2 = r.showAdditionalLayers.currentValue;
      // logConsole('Show additional layers', this.NumeroFrame2, this.showAdditionalLayers2);
    }

    if (r.geoFilterClick) {
      if (r.geoFilterClick.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Geofilter click passato', this.NumeroFrame2, r.geoFilterClick.currentValue);

        this.geoFilterClick2 = r.geoFilterClick.currentValue;
      }
    }

    if (r.listaCampiTCRP) {
      if (r.listaCampiTCRP.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'listaCampiTCRP passato', this.NumeroFrame2, r.listaCampiTCRP.currentValue);

        this.listaCampiTCRP2 = r.listaCampiTCRP.currentValue;

        // // logConsole('Lista campi passati', this.listaCampiTCRP2);
      }
    }

    if (r.tipoDatiLayout) {
      if (r.tipoDatiLayout.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'tipoDatiLayout passato', this.NumeroFrame2, r.tipoDatiLayout.currentValue);

        this.tipoDatiLayout2 = r.tipoDatiLayout.currentValue;
      }
    }

    if (okAgn) {
      // this.accentratore(this);
    }

    /* if (r.spostaMappaSuClickEsterno) {
      if (r.spostaMappaSuClickEsterno.currentValue) {
        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sposta mappa su click esterno', this.NumeroFrame2, r.spostaMappaSuClickEsterno.currentValue, this.MappaOGrafico2);
        }

        if (this.MappaOGrafico2 === 'M') {
          this.impostaSelezioneLA = r.spostaMappaSuClickEsterno.currentValue.ROW_ID;
          this.esegueClickSuActivities(r.spostaMappaSuClickEsterno.currentValue, true);
        }
      }
    } */

    if (r.permessoFleetManagerAM) {
      // if (r.permessoFleetManagerAM.currentValue !== undefined) {
        // MAIL Federico 27/06/2022 ore 09:30
        this.permessoFleetManagerAM2 = true; // r.permessoFleetManagerAM.currentValue;
        // MAIL Federico 27/06/2022 ore 09:30
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Permesso fleet manager passato', this.NumeroFrame2, this.permessoFleetManagerAM2);
      // }
    }

    if (r.visualizzaLegendaHistogram) {
      this.visualizzaLegendaHistogram2 = r.visualizzaLegendaHistogram.currentValue;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'visualizzaLegendaHistogram', this.NumeroFrame2, this.visualizzaLegendaHistogram2);
      // }
    }

    if (r.tipoLegendaIstogrammi) {
      this.tipoLegendaIstogrammi2 = r.tipoLegendaIstogrammi.currentValue;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'tipoLegendaIstogrammi', this.NumeroFrame2, this.tipoLegendaIstogrammi2);
    // }
    }

    if (r.pulisceLastCallAddLayers) {
      if (r.pulisceLastCallAddLayers.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulita ultima chiamata AddLayer', this.NumeroFrame2);

        this.lastCallAL2[this.frameAttivo2] = '';
      }
    }

    if (r.comboSelArea) {
      if (r.comboSelArea.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'comboSelArea passato', this.NumeroFrame2, r.comboSelArea.currentValue);
        this.comboSelArea2 = r.comboSelArea.currentValue;

        accentra = true;
      }
    }

    if (r.lastSelectedLayer) {
      if (r.lastSelectedLayer.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'lastSelectedLayer passato', this.NumeroFrame2, r.lastSelectedLayer.currentValue);
        this.lastSelectedLayer2 = r.lastSelectedLayer.currentValue;

        accentra = true;
      }
    }

    if (r.timerAttivatoAuto) {
      if (r.timerAttivatoAuto.currentValue !== undefined) {
        this.timerAttivatoAuto2 = r.timerAttivatoAuto.currentValue;
        // logConsole('Timer RT', this.NumeroFrame2, this.timerAttivatoAuto2);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Timer attivato passato', this.NumeroFrame2, this.timerAttivatoAuto2);
      }
    }

    if (r.strutturaTms) {
      if (r.strutturaTms.currentValue) {
        this.strutturaTms2 = r.strutturaTms.currentValue;
      }
    }

    if (r.activitiesPassataDaRoot) {
      if (r.activitiesPassataDaRoot.currentValue) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'activitiesPassataDaRoot passato', this.NumeroFrame2, r.activitiesPassataDaRoot.currentValue);
        // }
        // if (this.MappaOGrafico2 === 'LA') { // } && this.datiActivities) {
          // this.datiActivities.DataTable.forEach(element => {
          //   if (element.NAME === r.activitiesPassataDaRoot.currentValue[0].NAME) {
              // this.Utils.tmsInizio = this.datePipe.transform(element.START_TMS, 'yyyy-MM-dd HH:mm:ss.SSS')
              // this.Utils.tmsFine = this.datePipe.transform(element.END_TMS, 'yyyy-MM-dd HH:mm:ss.SSS')

        this.righeSelezionatePerActSet = r.activitiesPassataDaRoot.currentValue;
        if (r.activitiesPassataDaRoot.currentValue[0]) {
          this.impostaSelezioneLA = r.activitiesPassataDaRoot.currentValue[0].ROW_ID;
          this.esegueClickSuActivities(r.activitiesPassataDaRoot.currentValue[0], false);
        } else {
          if (r.activitiesPassataDaRoot.currentValue) {
            this.impostaSelezioneLA = r.activitiesPassataDaRoot.currentValue.ROW_ID;
            this.esegueClickSuActivities(r.activitiesPassataDaRoot.currentValue, false);
          } else {
            // alert('Non esiste activity: ' + JSON.stringify(r.activitiesPassataDaRoot.currentValue));
            // this.mostraPopup('Non esiste activity: ' + JSON.stringify(r.activitiesPassataDaRoot.currentValue), false, '')
            ExternalUtilities.visualizzaAlert('Non esiste activity: ' + JSON.stringify(r.activitiesPassataDaRoot.currentValue))
          }
        }
          //   }
          // });
        // }
        // this.clickRigaLA(r.activitiesPassataDaRoot.currentValue);
      }
    }

    if (r.CanvJS) {
      if (r.CanvJS.currentValue) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CanvasJS', r.CanvJS.currentValue);
        // }

        // this.impostaAssi();
      }
    }

    if (r.eventiDaTogliereSE) {
      if (r.eventiDaTogliereSE.currentValue) {
        if (this.MappaOGrafico === 'AE') {
          if (this.tipoEvento2 !== 'S') {
            let idDaTogliere = -1;

            const actId = r.eventiDaTogliereSE.currentValue.act_id;
            const histId = r.eventiDaTogliereSE.currentValue.file_hist_id;
            const tms = r.eventiDaTogliereSE.currentValue.tms;
            const tms1 = r.eventiDaTogliereSE.currentValue.tms1;
            const eventType = r.eventiDaTogliereSE.currentValue.event_type;

            if (this.datiPointActivityEvents) {
              this.datiPointActivityEvents.DataTable.forEach(element => {
                if (element.file_hist_id === histId && element.act_id === actId && element.tms === tms && element.tms1 === tms1 && element.event_type === eventType) {
                  idDaTogliere = element.ROW_ID;
                }
              });
            }

            if (idDaTogliere > -1) {
              logConsole('Arrivati eventi da togliere 1', this.NumeroFrame2, 
                this.idSelezionatoGlobaliAE, idDaTogliere, this.datiPointActivityEvents,
                this.eventiSceltiES2
              );
              const lista = new Array();
              this.idSelezionatoGlobaliAE.forEach(element => {
                if (element !== idDaTogliere) {
                  lista.push(element);
                }
              });
              this.idSelezionatoGlobaliAE = JSON.parse(JSON.stringify(lista));
              logConsole('Arrivati eventi da togliere 2', this.NumeroFrame2, this.idSelezionatoGlobaliAE);
            } else {
              logConsole('Arrivati eventi da togliere ma nessuna riga corrisponde');
            }
          }
        }
      }
    }

    if (r.refreshAccentratore) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh accentratore', this.NumeroFrame);

      ExternalFrameComponent.pulisceCalls(this);

      accentra = true;
    }

    if (r.progettoEsterno) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh progettto esterno', this.NumeroFrame, r.progettoEsterno.currentValue);

      this.progettoEsterno2 = r.progettoEsterno.currentValue;
    }

    if (r.nomiFrames) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh nomi frames', this.NumeroFrame, r.nomiFrames.currentValue);

      this.nomiFrames2 = r.nomiFrames.currentValue;
      this.creaNomiFramesPerTab();
    }

    if (r.nomeAntennaDD) {
      if (r.nomeAntennaDD.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh antenna DD', this.NumeroFrame, r.nomeAntennaDD.currentValue);

        this.nomeAntennaDD2 = r.nomeAntennaDD.currentValue;
        // logConsole('Nome antenne passato:', this.NumeroFrame2, this.nomeAntennaDD2);

        if (this.eseguitoInProgetto2) {
          this.layers_DD.disegnaAntenne(this, this.nomeAntennaDD2, this.parametriDD2, 'OnChangeAntenne');
        }
        // accentra = true;
      }
    }

    if (r.parametriDD) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh parametri DD', this.NumeroFrame, r.parametriDD.currentValue);

      this.parametriDD2 = r.parametriDD.currentValue;

      accentra = true;
    }

    if (r.nomeClusterDD) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh nomeCluster DD', this.NumeroFrame, r. nomeClusterDD.currentValue);
      // }

      this.nomeClusterDD2 = r. nomeClusterDD.currentValue;

      accentra = true;
    }

    if (r.numeroActSetVisibili) {
      this.numeroActSetVisibili2 = r.numeroActSetVisibili.currentValue;
    }

    if (r.lastDays) {
      if (r.lastDays.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Last Days', this.NumeroFrame, r.lastDays.currentValue);

        this.lastDays2 = r.lastDays.currentValue;

        accentra = true;
      }
    }

    if (r.tmsPassatiDaProgetto) {
      if (r.tmsPassatiDaProgetto.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'tmsPassatiDaProgetto', this.NumeroFrame, r.tmsPassatiDaProgetto.currentValue);

        this.tmsPassatiDaProgetto2 = r.tmsPassatiDaProgetto.currentValue;

        accentra = true;
      }
    }

    if (r.tmsPassatiDaProgettoTcRun) {
      if (r.tmsPassatiDaProgettoTcRun.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'tmsPassatiDaProgettoTcRun', this.NumeroFrame, r.tmsPassatiDaProgettoTcRun.currentValue);

        this.tmsPassatiDaProgettoTcRun2 = r.tmsPassatiDaProgettoTcRun.currentValue;

        accentra = true;
      }
    }

    if (r.refreshLegenda) {
      if (r.refreshLegenda.currentValue) {
        const c = r.refreshLegenda.currentValue.split('§');

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh legenda: ', c, JSON.parse(c[0]), c[1]);

        if (c[0] !== undefined && c[0] !== 'undefined') {
          this.cellaSelezionata2 = JSON.parse(c[0]);
          this.valoriEnv = c[1];
          const tm = setTimeout(() => {
            clearTimeout(tm);

            const array = this.prendeMisurePerLegenda();
            this.legendaComponent.disegnaLegenda(this, array, true);
          }, 100);
        }
      }
    }

    if (r.zoomMap) {
      if (r.zoomMap.currentValue !== undefined) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Zoom Map', this.NumeroFrame, r.zoomMap.currentValue);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Zoom map esiste code', r.zoomMap.currentValue.CODE);
        if (r.zoomMap.currentValue.CODE || r.zoomMap.currentValue.CODE === -1) {
          this.zoomMap2 = r.zoomMap.currentValue.CODE;
        } else {
          this.zoomMap2 = r.zoomMap.currentValue;
        }
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Zoom map finale', this.zoomMap2);
      }
    }

    if (r.impostaQuadratoMappa) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta quadrato mappa', this.NumeroFrame, r.impostaQuadratoMappa.currentValue);

      if (r.impostaQuadratoMappa.currentValue) {
        if (this.MappaOGrafico2 === 'M') {
          const q = r.impostaQuadratoMappa.currentValue;
          const qq = q.split(',');
          let daMain = false;
          if (q.indexOf('CAMBIOACTSET') > -1) {
            daMain = true;
          }
          let qq2 = [+qq[0], +qq[1], +qq[2], +qq[3]];
          /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto extent in quadrato mappa: ', qq2);
          const proiezione = this.guessProjection(qq2);
          if (proiezione !== 'EPSG:3857') {
            qq2 = transform(qq2, 'EPSG:4326', 'EPSG:3857');
          } 
          const centro1 = +qq2[0] + ((+qq2[2] - +qq2[0]) / 2);
          const centro2 = +qq2[1] + ((+qq2[3] - +qq2[1]) / 2);
          const centro = [centro1, centro2]; */
          // logConsole('Imposta quadrato mappa', this.NumeroFrame2, centro, qq2, q);

          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta quadrato mappa', this.NumeroFrame, qq2, centro);

          this.Utils.fattoQuadrato[this.NumeroFrame2] = true;
          if (this.map1[this.NumeroFrame2]) {
            let impostaPosizione = false;
            let impostaZoom = false;

            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta quadrato mappa. Tipo mappa ', this.NumeroFrame, this.overviewZoom2);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta quadrato mappa. Zoom Map', this.NumeroFrame, this.zoomMap2);

            if (!daMain) {
              if (this.overviewZoom2 === false) {
              } else {
                // Schema Mail 06/10/2021
                // Per OverView
                switch (+this.geoFilterClick2) {
                  case 0:
                    // ALL: Sposta la mappa e zoom
                    impostaPosizione = true;
                    impostaZoom = true;
                    break;
                  case 1:
                    // Overview: nulla
                    break;
                  case 2:
                    // Zoom: Sposta la mappa e zoom
                    impostaPosizione = true;
                    impostaZoom = true;
                    break;
                  case 3:
                    // Selected: nulla
                    break;
                  default:
                    impostaPosizione = true;
                    impostaZoom = true;
                    break;
                }
              }
            } else {
              impostaPosizione = true;
              impostaZoom = true;
            }
            // logConsole('Imposto quadrato mappa: ', qq2, this.zoomMap2, impostaPosizione, impostaZoom);

            /* if (impostaPosizione) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta quadrato mappa. Fitto mappa');

              this.impostaPosizioneSchermata(qq2, false, 'ImpostoQuadratoMappa', impostaPosizione, impostaZoom);
              // this.map1[this.NumeroFrame2].getView().fit(qq2); // , this.map1[this.NumeroFrame2].getSize()); MIGRATO
            }
            if (impostaZoom) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta quadrato mappa. Centro mappa');

              // this.map1[this.NumeroFrame2].getView().setCenter(centro);
              this.impostaPosizioneSchermata(centro, false, 'ImpostoQuadratoMappa2', impostaPosizione, impostaZoom);

              // this.centroImpostato = centro;
              // this.centroImpostatoEmit.emit({ daChi: this.NumeroFrame2, funzione: 'OnChanges 0', centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame });
            } */
            // logConsole('Imposta quadrato mappa', this.NumeroFrame2, qq2);
            this.impostaPosizioneSchermata(qq2, false, 'ImpostoQuadratoMappa', impostaPosizione, impostaZoom);

            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prendo valori bbox 3');
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);

            // const bbox = this.prendeBBOXSoloValori('OnChanges');
          }
        }
      }
    }

    if (r.cambioBboxZ2) {
      // Spostamento mappa zoom
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio centro maschera zoom.', this.NumeroFrame2);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio centro maschera zoom. Overview: ', this.overviewZoom2);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio centro maschera zoom. Frame clickato per lo spostamento', ExternalUtilities.frameZoomSpostato);
      // }

      if (r.cambioBboxZ.currentValue && r.cambioBboxZ.currentValue.indexOf(',') > -1) {
        if (this.overviewZoom2 === false) { // && +this.NumeroFrame2 !== +ExternalUtilities.frameZoomSpostato) {
          const q = r.cambioBboxZ.currentValue.replace('[', '').replace(']', '');
          const qq = q.split(',');
          let qq2 = [+qq[0], +qq[1], +qq[2], +qq[3]];
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto extent in cambiobboxz: ', qq2);
          qq2 = transform(qq2, 'EPSG:4326', 'EPSG:3857');

          /* if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto ultima posizione zoom', qq);
          }
          this.ultimaPosizioneZoom[this.NumeroFrame2] = qq; */

          // if (Math.abs(qq2[2] - qq2[0]) < 30 && Math.abs(qq2[3] - qq2[1]) < 20) {      
            // if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio centro maschera zoom', this.NumeroFrame2, r.cambioBboxZ);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio centro maschera zoom. Nuove coordinate: ', q, qq, qq2);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio centro maschera zoom. Flag: ', +this.zoomMap2);
            // }

            let impostaPosizione = false;
            let impostaZoom = false;
            switch (+this.zoomMap2) {
              case -1:
                break;
              case 1:
                impostaPosizione = true;
                break;
              case 2:
                impostaPosizione = true;
                impostaZoom = true;
                break;
            }
            // logConsole('Imposto posizione e zoom (3): ', this.zoomMap2, impostaPosizione, impostaZoom);

            if (impostaPosizione === false && impostaZoom === true) {
              this.staSpostandoMappaZoom[this.NumeroFrame2] = true;
              const centro1 = +qq2[0] + ((+qq2[2] - +qq2[0]) / 2);
              const centro2 = +qq2[1] + ((+qq2[3] - +qq2[1]) / 2);
              const centro = [centro1, centro2];
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio centro maschera zoom. Imposto centro', centro);

              this.impostaPosizioneSchermata(centro, false, 'CambioBboxZoom1', impostaPosizione, impostaZoom);
              // this.map1[this.NumeroFrame2].getView().setCenter(centro);
              const tm = setTimeout(() => {
                clearTimeout(tm);
                this.staSpostandoMappaZoom[this.NumeroFrame2] = false;
                ExternalUtilities.frameZoomSpostato = -1;
              }, 100);
            } else {
              if (impostaPosizione === true && impostaZoom === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio centro maschera zoom. Imposto fit', qq2);

                this.staSpostandoMappaZoom[this.NumeroFrame2] = true;
                this.impostaPosizioneSchermata(qq2, false, 'CambioBboxZoom2', impostaPosizione, impostaZoom);
                /* if (this.map1[this.NumeroFrame2]) {
                  this.map1[this.NumeroFrame2].getView().fit(qq2); //, this.map1[this.NumeroFrame2].getSize()); MIGRATO
                } */
                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  this.staSpostandoMappaZoom[this.NumeroFrame2] = false;
                  ExternalUtilities.frameZoomSpostato = -1;
                }, 500);
              }
            }
          // }
        }

        accentra = true;
      }
    }

    if (r.center_position) {
      if (r.center_position.currentValue && this.Utils.fattoQuadrato[this.NumeroFrame2] === false) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'center_position 1', this.NumeroFrame, r.center_position.currentValue);
        
        if (r.center_position.currentValue.indexOf('§') > -1) {
          const c = r.center_position.currentValue.split('§');
          this.center_position2 = c[0];
        } else {
          this.center_position2 = r.center_position.currentValue;
        }
        // logConsole('Center position', this.NumeroFrame2, r.center_position.currentValue);

        if (this.MappaOGrafico2 === 'M') {
          let coord = this.center_position2.split(' ');
          coord[0] = +coord[0];
          coord[1] = +coord[1];
          // if (coord[0] > 90) {
          //   coord = transform(coord, 'EPSG:3857', 'EPSG:4326');
          // }
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'center_position 2: center position ', this.NumeroFrame, this.center_position2);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'center position: coord ', coord);

          if (coord && this.map1[this.NumeroFrame2]) {
            // --- const bbox = this.map1[this.NumeroFrame2].getView().calculateExtent(this.map1[this.NumeroFrame2].getSize());
            let bboxFin = ExternalUtilities.ritornaBboxGiusta(this, 'r.center_position');
            bboxFin = transform(bboxFin, 'EPSG:4326', 'EPSG:3857');
            // logConsole('Center_Position 1', bboxFin);
            // logConsole('BBox di confronto', this.NumeroFrame2, coord, bboxFin);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'center position: bbox ', bboxFin);
            // const bboxFin = transform(bbox, 'EPSG:3857', 'EPSG:4326');

            // if (this.eseguitoInProgetto2) {
              if (coord[0] < bboxFin[0] || coord[1] < bboxFin[1] ||
                coord[0] > bboxFin[2] || coord[1] > bboxFin[3] || !bboxFin || bboxFin === '') {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sposto centro 1 per cambiamento bbox', coord, bboxFin);

                // logConsole('Center_Position 2');
                let coord2 = [+coord[0], +coord[1]];
                // if (coord2[0] < 200) {
                //   coord2 = transform(coord2, 'EPSG:4326', 'EPSG:3857');
                // }

                // logConsole('Center position', this.NumeroFrame2, coord2);

                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO CENTRO 1', this.NumeroFrame2, coord2);

                if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.map1[this.NumeroFrame2].getView()) {
                  // try {
                  // // logConsole('Imposto centro mappa', this.NumeroFrame2, coord2, coord2.length);

                  // logConsole('Center_Position 3');
                  if (this.overviewZoom2) {
                    // logConsole('Center_Position 4', coord2);
                    this.impostaPosizioneSchermata(coord2, false, 'center_position', true, false);
                  }
                  /* if (coord2.length > 2) {
                    this.map1[this.NumeroFrame2].getView().fit(transform(coord2, 'EPSG:4326', 'EPSG:3857'));
                  } else {
                    this.map1[this.NumeroFrame2].getView().setCenter(transform(coord2, 'EPSG:4326', 'EPSG:3857'));
                    // this.map1[this.NumeroFrame2].getView().setZoom(this.zoomImpostatoNelFrame);
                  } */

                  // } catch (e) {
                  // }
                }

                // this.centroImpostato = coord2; // transform(coord2, 'EPSG:4326', 'EPSG:3857');
                // this.centroImpostatoEmit.emit({ daChi: this.NumeroFrame2, funzione: 'OnChanges 0.5', centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame });
                // if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
                // }
              }
            // }
          }
        }
      }

      accentra = true;
    }

    if (r.paginaSelezionata) {
      if (r.paginaSelezionata.currentValue) {
        this.paginaSelezionata2 = r.paginaSelezionata.currentValue;
        
        this.creaNomiFramesPerTab();
      }
    }

    if (r.editMode) {
      if (r.editMode.currentValue !== undefined) {
        this.editMode2 = r.editMode.currentValue;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato EditMode', this.editMode2, this.nomiFrames2);
        const nomiFrames = this.nomiFrames2;
        this.nomiFrames2 = undefined;
        const tm = setTimeout(() => {
          clearTimeout(tm);

          this.nomiFrames2 = nomiFrames;
        
          this.creaNomiFramesPerTab();
        }, 100);
      }
    }

    if (r.NumeroFrame) {
      if (r.NumeroFrame.currentValue !== undefined) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'NumeroFrame', r.NumeroFrame.currentValue);

        this.NumeroFrame2 = r.NumeroFrame.currentValue;

        /* if (!GestioneGrafici.charts) {
          GestioneGrafici.charts = new Array();
        }
        // for (let i = 0; i <= environment.quantiFrames; i++) {
          GestioneGrafici.charts[this.NumeroFrame2] = new Array();
          for (let k = 0; k <= 200; k++) {
            GestioneGrafici.charts[this.NumeroFrame2].push(null);
          }
        // }
        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CHARTS:', this.NumeroFrame2, GestioneGrafici.charts);
        } */
        
        if (this.userName2 && this.userName2 !== '' && this.NumeroFrame2 !== -1) {
          // this.prendeDimeCDR();
          this.impostaDimensioniCDR();
        }
      }
    }

    if (r.showMeasures) {
      if (r.showMeasures.currentValue !== undefined) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Show Measures', r.showMeasures.currentValue);
        // }

        this.showMeasures2 = r.showMeasures.currentValue;

        accentra = true;
      }
    }

    if (r.showCoverageMeasures) {
      if (r.showCoverageMeasures.currentValue !== undefined) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Show Coverage Measures', r.showCoverageMeasures.currentValue);

        this.showCoverageMeasures2 = r.showCoverageMeasures.currentValue;

        accentra = true;
      }
    }

    if (r.showVoiceCallMeasures) {
      if (r.showVoiceCallMeasures.currentValue !== undefined) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Show Voice Call Measures', r.showVoiceCallMeasures.currentValue);

        this.showVoiceCallMeasures2 = r.showVoiceCallMeasures.currentValue;

        accentra = true;
      }
    }

    if (r.showDataMeasures) {
      if (r.showDataMeasures.currentValue !== undefined) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Show Data Measures', r.showDataMeasures.currentValue);

        this.showDataMeasures2 = r.showDataMeasures.currentValue;

        accentra = true;
      }
    }

    if (r.tipoFrameProgetto) {
      if (r.tipoFrameProgetto.currentValue) {
        this.tipoFrameProgetto2 = r.tipoFrameProgetto.currentValue;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo Frame progetto:', this.NumeroFrame2, this.eseguitoInProgetto2, this.tipoFrameProgetto2);
        this.impostaMascheraPerProgetto();
      }
    }

    if (r.eseguitoInProgetto && r.eseguitoInProgetto.currentValue !== undefined) {
      this.eseguitoInProgetto2 = r.eseguitoInProgetto.currentValue;
      // // logConsole('PROGETTO: ', this.NumeroFrame2, this.eseguitoInProgetto22, r.eseguitoInProgetto.currentValue);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eseguito in progetto:', this.NumeroFrame2, this.eseguitoInProgetto2, environment.production);

      if (this.eseguitoInProgetto2 === true) {
        this.impostaMascheraPerProgetto();
      }

      /* if (this.eseguitoInProgetto22 === true) {
        this.ritardoPerAccentratore = 1000;

        if (environment.production === true) {
          // const tm = setTimeout(() => {
          clearTimeout(tm);
            this.impostaMascheraPerProgetto();
          // }, 5000);
        } else {
          this.impostaMascheraPerProgetto();
        }
      } else {
        // if (this.eseguitoInProgetto22 === false) {
          this.ritardoPerAccentratore = 1000;
        // }
      } */
    }

    if (r.spostaCentroManualmente) {
      if (r.spostaCentroManualmente.currentValue) {
        logConsole('Sposto centro manualmente', this.NumeroFrame2, r.spostaCentroManualmente.currentValue);

        if (this.map1[this.NumeroFrame2]) {
          const coord = r.spostaCentroManualmente.currentValue.split(';');
          let coord2 = [+coord[0], +coord[1]];
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sposto centro manualmente', this.NumeroFrame2, this.MappaOGrafico2, r.spostaCentroManualmente.currentValue);

          if (coord2) {
            if (coord2[0] < 200) {
              coord2 = transform(coord2, 'EPSG:4326', 'EPSG:3857');
            }
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO CENTRO 2', this.NumeroFrame2, coord2);

            this.impostaPosizioneSchermata(coord2, false, 'SpostoCentroManualmente', true, false);
            // this.map1[this.NumeroFrame2].getView().setCenter(transform(coord2, 'EPSG:4326', 'EPSG:3857'));
            // this.centroImpostato = transform(coord2, 'EPSG:4326', 'EPSG:3857');
            // this.centroImpostatoEmit.emit({ daChi: this.NumeroFrame2, funzione: 'OnChanges 1', centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame });

            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
          }
        }
      }
    }

    if (r.drawShowRaysAllLayer) {
      if (r.drawShowRaysAllLayer.currentValue) {
        if (this.MappaOGrafico2 === 'M') {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegna all layers. Coordinate ', this.NumeroFrame2, r.drawShowRaysAllLayer.currentValue);

          this.showRaysAllLayerC.disegnaAllLayers(this, r.drawShowRaysAllLayer.currentValue, false, 'drawShowRaysAllLayer');
        }
      }
    }

    if (r.ricaricaRaggi && r.ricaricaRaggi.currentValue) {
      if (this.MappaOGrafico2 === 'M') {
        if (this.coordinateSREL) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricarica raggi all layers. Coordinate ', this.NumeroFrame2, this.coordinateSREL);

          this.showRaysAllLayerC.disegnaAllLayers(this, this.coordinateSREL, true, 'ricaricaRaggi');
        }
      }
    }

    if (r.mosaicoSelezionato) {
      if (r.mosaicoSelezionato.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mosaico selezionato: ', this.NumeroFrame2, this.MappaOGrafico2, r.mosaicoSelezionato.currentValue);

        // logConsole('Mosaico selezionato. rigaSelezionataMG ', r.mosaicoSelezionato.currentValue);

        // logConsole('Mosaico selezionato da mappa: ', this.NumeroFrame2, r.mosaicoSelezionato.currentValue);

        this.mosaicoSelezionato2 = r.mosaicoSelezionato.currentValue;

        // Cerca il mosaico passato nella lista e lo seleziona se sono MG
        if (this.MappaOGrafico2 === 'MG') {
          let ok = false;
          let riga = 0;
          if (this.datiMosaicGrid && this.datiMosaicGrid.DataTable) {
            this.datiMosaicGrid.DataTable.forEach(element => {
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element.CENTER);
              if (element.CENTER.trim() === this.mosaicoSelezionato2.trim()) {
                this.impostaSelezioneMosaicGrid = element.ROW_ID;

                ok = true;

                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  let pagina = (riga / this.numeroRighePagina).toString();
                  if (pagina.indexOf('.') > -1) {
                    pagina = pagina.substring(0, pagina.indexOf('.'));
                  } else {
                    if (pagina.indexOf(',') > -1) {
                      pagina = pagina.substring(0, pagina.indexOf(','));
                    }
                  }
                  let pag = +pagina;
                  if (pag < 0) { pag = 0; }
                  if (pag > this.datiMosaicGrid.DataTable / this.numeroRighePagina) {
                    pag = this.datiMosaicGrid.DataTable / this.numeroRighePagina;
                  }

                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mosaico selezionato: Riga rilevata: ', element, this.numeroRighePagina, riga, pagina);
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mosaico selezionato: Pagina impostata: ', pag);

                  this.impostaSelezioneMosaicGrid = [element.ROW_ID];
                  // alert('Pagina ' + pag);
                  // this.numeroPaginaMosaicGrid = pag;

                  // logConsole('rigaSelezionataMG 1', element);
                  ExternalUtilities.bboxSelected[0] = element;
                  if (typeof(ExternalUtilities.bboxSelected) === 'string') {
                    ExternalUtilities.bboxSelected = JSON.parse(ExternalUtilities.bboxSelected);
                  }

                  // alert('aggiornato elemento');

                  this.clickatoSuMG.emit(element);
                }, 100);
              }
              if (ok === false) {
                riga++;
              }
            });
          }
          if (ok === false) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mosaico selezionato: Riga NON rilevata: ', '*' + this.mosaicoSelezionato2 + '*', this.datiMosaicGrid.DataTable);
          }
        } else {
          // if (this.MappaOGrafico2 === 'M') {
            // this.disegnaGeometriaMosaico();
            // logConsole('Mosaico selezionato da mappa: MAPPA ', this.NumeroFrame2, r.mosaicoSelezionato.currentValue);

            /* const tm = setTimeout(() => {
              clearTimeout(tm);
              
              const view = this.map1[this.NumeroFrame2].getView();
          
              // let newZoom = view.getZoom();
              let extent = view.calculateExtent();
              // alert('1: ' + extent[0]);
              if (!Number.isNaN(extent[0]) && extent[0] !== null) {
                // // logConsole('bboxImpostataNelFrame 1', t.NumeroFrame2, extent, t.map1[t.NumeroFrame2].getView().getZoom());
                if (extent[0] > 200) {
                  extent = transform(extent, 'EPSG:3857', 'EPSG:4326');
                }
                this.bboxImpostataNelFrame = extent;
                // // logConsole('Spostamento mappa per click mg', extent);
                this.zoomImpostatoNelFrame = view.getZoom();

                this.mosaicGrid.caricamentoLayerGeometry(this);
              }                                            
            }, 100); */
          // }
        }
      }
    }

    if (r.clusterSelezionato) {
      if (r.clusterSelezionato.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster selezionato', this.NumeroFrame2, this.MappaOGrafico2, r.clusterSelezionato.currentValue);

        this.clusterSelezionato2 = r.clusterSelezionato.currentValue;

        // Cerca il cluster passato nella lista e lo seleziona se sono MG
        if (this.MappaOGrafico2 === 'CG') {
          let ok = false;
          let riga = 0;
          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster selezionato. Ricerca', this.datiClusterGrid.DataTable);
          // }
          if (this.datiClusterGrid && this.datiClusterGrid.DataTable) {
            this.datiClusterGrid.DataTable.forEach(element => {
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element.CENTER);
              if (element.CENTER === this.clusterSelezionato2) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster selezionato. Trovato centro');

                this.impostaSelezioneClusterGrid = element.ROW_ID;

                ok = true;

                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  let pagina = (riga / this.numeroRighePagina).toString();
                  if (pagina.indexOf('.') > -1) {
                    pagina = pagina.substring(0, pagina.indexOf('.'));
                  } else {
                    if (pagina.indexOf(',') > -1) {
                      pagina = pagina.substring(0, pagina.indexOf(','));
                    }
                  }
                  let pag = +pagina;
                  if (pag < 0) { pag = 0; }
                  if (pag > this.datiClusterGrid.DataTable / this.numeroRighePagina) {
                    pag = this.datiClusterGrid.DataTable / this.numeroRighePagina;
                  }

                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster selezionato. Riga rilevata: ', element, this.numeroRighePagina, riga, pagina);
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster selezionato. Pagina impostata: ', pag);

                  // this.numeroPaginaMosaicGrid = pag;

                  // logConsole('rigaSelezionataMG 2', element);
                  ExternalUtilities.bboxSelected[0] = element;
                  if (typeof(ExternalUtilities.bboxSelected) === 'string') {
                    ExternalUtilities.bboxSelected = JSON.parse(ExternalUtilities.bboxSelected);
                  }
        
                  this.clickatoSuCG.emit(element);
                }, 100);
              }
              if (ok === false) {
                riga++;
              }
            });
          }
          if (ok === false) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster selezionato. Riga NON rilevata: ', this.clusterSelezionato2);
          }
        /* } else {
          if (this.MappaOGrafico2 === 'M') {
            // Gestione visualizzazione cluster su mappa
            this.disegnaGeometriaCluster();
          } */
        }
      }
    }

    if (r.showMeasuresS) {
      // if (r.showMeasuresS.currentValue) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Show MeasuresS', r.showMeasuresS.currentValue);

      this.showMeasuresS2 = r.showMeasuresS.currentValue;

      accentra = true;
      // }
    }

    if (r.geoFilter) {
      // if (r.geoFilter.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Geo Filter', r.geoFilter.currentValue);

        this.geoFilter2 = r.geoFilter.currentValue;
      // }
    }

    if (r.bboxChangeO) {
      if (r.bboxChangeO.currentValue) {
        // logConsole('Cambio bboxO', this.NumeroFrame2);
        const valori = r.bboxChangeO.currentValue;
        let frameSpostante = valori.frame;
        let coordinate = valori.valori;
        if (valori.frame && valori.valori) {
          frameSpostante = valori.frame;
          coordinate = valori.valori;  
        } else {
          if (valori && valori.length > 2) {
            coordinate = valori;
          } else {
            logConsole('Coordinate O a 2 dimensioni', valori);
          }
        }
        if (coordinate) {
          let qq2 = [+coordinate[0], +coordinate[1], +coordinate[2], +coordinate[3]];

          if (!Number.isNaN(qq2[0])) {
            // logConsole('QQ2 O Prima', this.NumeroFrame2, qq2);
            qq2 = this.sistemaCoordinate(qq2, '4326');
            // if (qq2[0] > 200) {
            //   qq2 = transform(qq2, 'EPSG:3857', 'EPSG:4326');
            // }
            // logConsole('QQ2 O Dopo', this.NumeroFrame2, qq2);

            this.bboxImpostataNelFrame = qq2;
            // logConsole('Imposto bbox O', this.NumeroFrame2, qq2);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO ULTIMA BBOX O', this.NumeroFrame2, this.bboxImpostataNelFrame);

            this.bboxOverview = qq2;
            /* if (this.MappaOGrafico2 === 'M') {
              if (!this.overviewZoom2) {
                this.antenneComponent.disegnaAntenne1e2(this, 'OnChanges1');
                this.eventsComponent.disegnaEventsSuMappa(this);

                this.measuresComponent.disegnaMeasure(this);
                this.pathComponent.disegnaPathClickato(this, this.tmsSelezionato);
                this.pathComponent.disegnaServingCell(this, this.tmsSelezionato);
                this.measuresComponent.disegnaMeasureSample(this, false);

                // accentra = true;
              }
            } */

            ////////////////// this.esegueChiamataLayers(false);      
            // }
          }
        }
      }
    }

    if (r.bboxChangeZ) {
      if (r.bboxChangeZ.currentValue) {
        // logConsole('Cambio bboxZ', this.NumeroFrame2);
        const valori = r.bboxChangeZ.currentValue;
        let frameSpostante = valori.frame;
        let coordinate = valori.valori;
        if (valori.frame && valori.valori) {
          frameSpostante = valori.frame;
          coordinate = valori.valori;  
        } else {
          if (valori && valori.length > 2) {
            coordinate = valori;
          } else {
            logConsole('Coordinate Z a 2 dimensioni', valori);
          }
        }
        if (coordinate) {
          let qq2 = [+coordinate[0], +coordinate[1], +coordinate[2], +coordinate[3]];

          // let extent = [coordinate[0] + ((coordinate[2] - coordinate[0]) / 2), coordinate[1] + ((coordinate[3] - coordinate[1]) / 2)]
          if (!Number.isNaN(qq2[0])) {
            // logConsole('QQ2 Z Prima', this.NumeroFrame2, qq2);
            qq2 = this.sistemaCoordinate(qq2, '4326');
            // if (qq2[0] > 200) {
              qq2 = transform(qq2, 'EPSG:3857', 'EPSG:4326');
            // }
            // logConsole('QQ2 Z Dopo', this.NumeroFrame2, qq2);

            this.bboxImpostataNelFrame = qq2;
            // logConsole('Imposto bbox Z', this.NumeroFrame2, qq2);
            // // logConsole('bboxImpostataNelFrame 2 ->', this.NumeroFrame2, qq2);
            // this.zoomImpostatoNelFrame = zoom;
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO ULTIMA BBOX Z', this.NumeroFrame2, this.bboxImpostataNelFrame);

            this.bboxZoom = qq2;
            if (this.MappaOGrafico2 === 'M') {
              if (!this.overviewZoom2) {
                this.antenneComponent.disegnaAntenne1e2(this, 'OnChanges2');
                this.eventsComponent.disegnaEventsSuMappa(this, 'bboxChangeZ');
        
                this.measuresComponent.disegnaMeasure(this);
                this.pathComponent.disegnaPathClickato(this, this.tmsSelezionato);
                this.pathComponent.disegnaServingCell(this, this.tmsSelezionato);
                this.measuresComponent.disegnaMeasureSample(this, false);

                // accentra = true;
              }
            }
          }
        }
      }
    }

    if (r.tipoDataset) {
      if (r.tipoDataset.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Change tipoDataset', this.NumeroFrame, r.tipoDataset.currentValue);

        this.tipoDataset2 = r.tipoDataset.currentValue;

        accentra = true;
      }
    }

    if (r.clickSuMG) {
      if (r.clickSuMG.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio click su MG: ', this.NumeroFrame, ExternalUtilities.bboxSelected);

        if (this.MappaOGrafico2 === 'M') {
          // if (this.debug2 === true) {
            const tm = setTimeout(() => {
              clearTimeout(tm);

              ExternalUtilities.bboxSelected = r.clickSuMG.currentValue;
              if (typeof(ExternalUtilities.bboxSelected) === 'string') {
                ExternalUtilities.bboxSelected = JSON.parse(ExternalUtilities.bboxSelected);
              }

              let c = ExternalUtilities.bboxSelected[0].CENTER;

              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio click su MG: Mappa zoom, tento di spostare il centro', c);

              if (c && c !== '' && c.indexOf('POINT') > -1) {
                c = c.replace('POINT(', '');
                c = c.replace(')', '');
                const coordinate = c.split(' ');
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio click su MG: Mappa zoom, sposto il centro', coordinate);

                const coord = [ +coordinate[0], +coordinate[1]];

                if (this.map1[this.NumeroFrame2]) {
                  // --- const bbox = this.map1[this.NumeroFrame2].getView().calculateExtent(this.map1[this.NumeroFrame2].getSize());
                  const bboxFin = ExternalUtilities.ritornaBboxGiusta(this, 'clickSuMG');
                  // const bboxFin = transform(bbox, 'EPSG:3857', 'EPSG:4326');

                  if (coord[0] < bboxFin[0] || coord[1] < bboxFin[1] || coord[0] > bboxFin[2] || coord[1] > bboxFin[3]) {
                    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, coord);
                    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro4');
                    let coord2 = [+coord[0], +coord[1]];
                    coord2 = this.sistemaCoordinate(coord2, '4326');
                    // if (this.viewMappaAttuale) {
                      // if (coord2[0] > 200) {
                      //   coord2 = transform(coord2, 'EPSG:3857', 'EPSG:4326');
                      // }

                      this.bboxImpostataNelFrame = coord2;
                      this.centroImpostato = coord2;
                      logConsole('Imposto bbox MG', this.NumeroFrame2, coord2);

                      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio click su MG: IMPOSTO CENTRO 3', this.NumeroFrame2, coord2);

                      this.impostaPosizioneSchermata(coord2, false, 'ClickSuMG', true, false);
                      // this.map1[this.NumeroFrame2].getView().setCenter(transform(coord2, 'EPSG:4326', 'EPSG:3857'));

                      const tm = setTimeout(() => {
                        clearTimeout(tm);
                        let view;
                        view  = this.map1[this.NumeroFrame2].getView();
                    
                        // let newZoom = view.getZoom();
                        let extent = view.calculateExtent();
                        // alert('1: ' + extent[0]);
                        if (!Number.isNaN(extent[0]) && extent[0] !== null && extent[0] !== 'null') {
                          // // logConsole('bboxImpostataNelFrame 1', t.NumeroFrame2, extent, t.map1[t.NumeroFrame2].getView().getZoom());
                          if (extent[0] < 200) {
                            extent = transform(extent, 'EPSG:4326', 'EPSG:3857');
                          }
                          this.bboxImpostataNelFrame = extent;
                          // logConsole('Spostamento mappa per click mg', extent);
                          this.zoomImpostatoNelFrame = view.getZoom();
                          // logConsole('Impostato zoom 1', this.NumeroFrame2, this.zoomImpostatoNelFrame);
                          // this.centroImpostatoEmit.emit({ daChi: this.NumeroFrame2, funzione: 'OnChanges 4', centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame });

                          // logConsole('Centro impostato 2', this.NumeroFrame2, extent);
                          // logConsole('Imposto centro 7', this.NumeroFrame2, extent, this.zoomImpostatoNelFrame);
                          this.centroImpostato = extent;
                        }                                  
                      }, 100);
                      // this.centroImpostatoEmit.emit({ centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame });

                      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio click su MG: Centro impostato', this.centroImpostato);
                    // }
                  }
                }
              }

              accentra = true;
            }, 1000);

            // if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG[0] && ExternalUtilities.rigaSelezionataMG[0].NAME &&
            //  ExternalUtilities.rigaSelezionataMG[0].NAME !== 'DrawnPolygon') {
            // if (this.NumeroFrame2 !== this.frameCheHaDisegnatoBox) {
              this.mosaicGrid.caricamentoLayerGeometry(this);
            // }
            // }
          // }
        } else {
          accentra = true;
        }
      }
    }

    if (r.clickSuCG) {
      if (r.clickSuCG.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio click su CG', this.NumeroFrame, ExternalUtilities.bboxSelected);

        let bbox = r.clickSuCG.currentValue.bbox;
        if (bbox && !bbox[0]) {
          bbox = [bbox];
        }
        const eseguiSpostamento = r.clickSuCG.currentValue.spostaMappa;
        // logConsole('Arrivato click cg', r.clickSuCG.currentValue, bbox, eseguiSpostamento);

        if (this.MappaOGrafico2 === 'M' && eseguiSpostamento) {
          // if (this.debug2 === true) {
            const tm = setTimeout(() => {
              clearTimeout(tm);

              ExternalUtilities.bboxSelected = bbox;
              if (typeof(ExternalUtilities.bboxSelected) === 'string') {
                ExternalUtilities.bboxSelected = JSON.parse(ExternalUtilities.bboxSelected);
              }

              let c = ExternalUtilities.bboxSelected[0].CENTER;

              // if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa zoom, tento di spostare il centro', c);
              // }
              if (c && c !== '' && c.indexOf('POINT') > -1) {
                c = c.replace('POINT(', '');
                c = c.replace(')', '');
                const coordinate = c.split(' ');
                // if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa zoom, sposto il centro', coordinate);
                // }
                let coord = [ +coordinate[0], +coordinate[1]];
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, coord);
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro4');
                // if (coord[0] > 200) {
                //   coord = transform(coord, 'EPSG:3857', 'EPSG:4326');
                // }
                coord = this.sistemaCoordinate(coord, '4326');

                this.bboxImpostataNelFrame = coord;
                this.centroImpostato = coord;
                // logConsole('Imposto bbox CG', this.NumeroFrame2, coord);

                // if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO IL CENTRO 4', this.NumeroFrame2, coord);
                // }
                this.impostaPosizioneSchermata(coord, false, 'ClickSuCG', true, false);
                // this.map1[this.NumeroFrame2].getView().setCenter(transform(coord, 'EPSG:4326', 'EPSG:3857'));
                // this.centroImpostato = transform(coord, 'EPSG:4326', 'EPSG:3857');
                // this.centroImpostatoEmit.emit({ daChi: this.NumeroFrame2, funzione: 'OnChanges 5', centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame });
                // if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
                // }
              }

              accentra = true;
            }, 1000);

            // if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG[0] && ExternalUtilities.rigaSelezionataMG[0].NAME &&
            //   ExternalUtilities.rigaSelezionataMG[0].NAME !== 'DrawnPolygon') {
            if (this.NumeroFrame2 !== this.frameCheHaDisegnatoBox) {
              this.clusterGrid.caricamentoLayerGeometry(this);
            }
            // }
          // }
        } else {
          accentra = true;
        }
      }
    }

    if (r.clickSuArfcn) {
      if (r.clickSuArfcn.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio click su Arfcn', this.NumeroFrame, ExternalUtilities.bboxSelected);

        let bbox = r.clickSuArfcn.currentValue.bbox;
        if (bbox && !bbox[0]) {
          bbox = [bbox];
        }
        const eseguiSpostamento = r.clickSuArfcn.currentValue.spostaMappa;
        // logConsole('Arrivato click arfcn', r.clickSuArfcn.currentValue, bbox, eseguiSpostamento);

        if (this.MappaOGrafico2 === 'M' && eseguiSpostamento) {
          // if (this.debug2 === true) {
            const tm = setTimeout(() => {
              clearTimeout(tm);

              // logConsole('Arrivato click arfcn. BBOX: ', r.clickSuArfcn.currentValue, bbox);
              ExternalUtilities.bboxSelected = bbox;
              if (typeof(ExternalUtilities.bboxSelected) === 'string') {
                ExternalUtilities.bboxSelected = JSON.parse(ExternalUtilities.bboxSelected);
              }

              let c = ExternalUtilities.bboxSelected[0].CENTER;

              // if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa zoom, tento di spostare il centro', c);
              // }
              if (c && c !== '' && c.indexOf('POINT') > -1) {
                c = c.replace('POINT(', '');
                c = c.replace(')', '');
                const coordinate = c.split(' ');
                // if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa zoom, sposto il centro', coordinate);
                // }
                let coord = [ +coordinate[0], +coordinate[1]];
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, coord);
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro4');
                // if (coord[0] > 200) {
                //   coord = transform(coord, 'EPSG:3857', 'EPSG:4326');
                // }
                coord = this.sistemaCoordinate(coord, '4326');

                this.bboxImpostataNelFrame = coord;
                this.centroImpostato = coord;
                // logConsole('Imposto bbox Arfcn', this.NumeroFrame2, coord);

                // if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO IL CENTRO 4', this.NumeroFrame2, coord);
                // }
                this.impostaPosizioneSchermata(coord, false, 'ClickSuArfcn', true, false);
                // this.map1[this.NumeroFrame2].getView().setCenter(transform(coord, 'EPSG:4326', 'EPSG:3857'));
                // this.centroImpostato = transform(coord, 'EPSG:4326', 'EPSG:3857');
                // this.centroImpostatoEmit.emit({ daChi: this.NumeroFrame2, funzione: 'OnChanges 5', centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame });
                // if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
                // }
              }

              accentra = true;
            }, 1000);

            // if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG[0] && ExternalUtilities.rigaSelezionataMG[0].NAME &&
            //   ExternalUtilities.rigaSelezionataMG[0].NAME !== 'DrawnPolygon') {
            if (this.NumeroFrame2 !== this.frameCheHaDisegnatoBox) {
              this.clusterGrid.caricamentoLayerGeometry(this);
            }
            // }
          // }
        } else {
          accentra = true;
        }
      }
    }

    if (r.shownEvents) {
      if (r.shownEvents.currentValue !== undefined) {
        if (this.MappaOGrafico2 !== 'M' && this.MappaOGrafico2 !== 'MC') {
          this.shownEvents2 = false;
        } else {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Shown Events', r.shownEvents.currentValue);

          this.shownEvents2 = r.shownEvents.currentValue;
          if (this.shownEvents2 === null) { this.shownEvents2 = false; }
          // logConsole('Shown events', this.NumeroFrame2, r.shownEvents.currentValue);

          accentra = true;
        }
      }
    }

    if (r.Utils) {
      if (r.Utils.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Utils', r.Utils.currentValue);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato Utils', this.NumeroFrame2, r.Utils.currentValue);
        this.Utils.datePipe = this.datePipe;
      }
    }

    if (r.sessionID) {
      if (r.sessionID.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'sessionID', r.sessionID.currentValue);

        this.sessionID2 = r.sessionID.currentValue;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sessione frame:', this.NumeroFrame, this.sessionID2);
      }
    }

    if (r.userName) {
      if (r.userName.currentValue && r.userName.currentValue !== '') {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'userName', r.userName.currentValue);
        // }

        const c = localStorage.getItem(this.userName + '_ExportKML');
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, c);
        if (c && c !== null) {
          const cc = c.split(';');
          this.exportMeasuresKML = cc[0] === '1' ? true : false;
          this.exportAntenneKML = cc[1] === '1' ? true : false;
          this.exportPlanimetryKML = cc[2] === '1' ? true : false;
          this.exportOverlayKML = cc[3] === '1' ? true : false;
          this.exportPathAntenneKML = cc[4] === '1' ? true : false;
          this.exportRaysKML = cc[5] === '1' ? true : false;
          if (cc.length > 5) {
            this.exportEventsKML = cc[6] === '1' ? true : false;
          } else {
            this.exportEventsKML = true;
          }
        }

        this.userName2 = r.userName.currentValue;

        if (this.userName2 && this.userName2 !== '' && this.NumeroFrame2 !== -1) {
          // this.prendeDimeCDR();
          this.impostaDimensioniCDR();

          this.gestisceTastoSS();
        }
      }
    }

    if (r.globalMeasure) {
      // this.Utils.globalMeasure = r.globalMeasure.currentValue;

      if (r.globalMeasure.currentValue) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'globalMeasure', r.globalMeasure.currentValue);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Measure impostate', this.Measure);
        // }
        
        let ok = false;
        if (this.Measure && this.Measure !== null) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato globalMeasure', this.Measure);
          // logConsole('this.Measure', this.Measure);
          this.Measure.forEach(element => {
            // logConsole('this.Measure->element', element, typeof(element), element.length);
            if (typeof(element) === 'object') {
              if (!element || element === null || (element !== null && element.length === 0)) {
                element = '';
              }
            }
            if (ok === false && element && element !== null && typeof(element) === 'string' && element.toUpperCase().indexOf('GLOBAL_') > -1) {
              ok = true;
            }
          });
          if (ok) {
            // Abbasso il flag per far ridisegnare la struttura dei grafici
            this.giaDisegnataStruttura[this.NumeroFrame2] = false;
            // Abbasso il flag per far ridisegnare la struttura dei grafici
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato globalMeasure e ci sono misure globali. Azzero il flag di ridisegno struttura');
          } else {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato globalMeasure ma non ci sono misure globali. NON Azzero il flag di ridisegno struttura');
          }
        }

        // this.selezionePM = r.globalMeasure.currentValue.ROW_ID;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiPointMeasures);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Global Measure', this.NumeroFrame, r.globalMeasure.currentValue);

        const array = this.prendeMisurePerLegenda();
        this.legendaComponent.disegnaLegenda(this, array, false);

        accentra = true;
      }
    }

    if (r.globalMeasureArfcn) {
      if (r.globalMeasureArfcn.currentValue) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'globalMeasureArfcn', r.globalMeasureArfcn.currentValue);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Measure impostate', this.Measure);
        // }
        
        let ok = false;
        if (this.Measure && this.Measure !== null) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato globalMeasure', this.Measure);
          this.Measure.forEach(element => {
            // logConsole('this.MeasureArfcn->element', element, typeof(element), element.length);
            if (typeof(element) === 'object') {
              if (!element || element === null || (element !== null && element.length === 0)) {
                element = '';
              }
            }
            if (ok === false && element && element !== null && typeof(element) === 'string' && element.toUpperCase().indexOf('GLOBAL_') > -1) {
              ok = true;
            }
          });
          if (ok) {
            // Abbasso il flag per far ridisegnare la struttura dei grafici
            this.giaDisegnataStruttura[this.NumeroFrame2] = false;
            // Abbasso il flag per far ridisegnare la struttura dei grafici
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato globalMeasure e ci sono misure globali. Azzero il flag di ridisegno struttura');
          } else {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato globalMeasure ma non ci sono misure globali. NON Azzero il flag di ridisegno struttura');
          }
        }

        // this.selezionePM = r.globalMeasure.currentValue.ROW_ID;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiPointMeasures);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Global Measure', this.NumeroFrame, r.globalMeasure.currentValue);

        accentra = true;
      }
    }

    if (r.datiNotebook) {
      if (r.datiNotebook.currentValue) {
        // this.frameName2 = 'Notebook';

        this.datiNotebook2 = r.datiNotebook.currentValue;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiNotebook2);
      } else {
        this.datiNotebook2 = 'empty grid';
      }
    }

    if (r.opacity) {
      // if (r.opacity.currentValue) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio opacitÃ ', this.NumeroFrame2, r.opacity.currentValue);
        // }
        this.opacity2 = r.opacity.currentValue;

        // this.lastCallAL2[this.NumeroFrame2] = '';

        accentra = true;
        // }
    }

    if (r.bboxOZ) {
      if (r.bboxOZ.currentValue) {
        // logConsole('Cambio bboxoz', this.NumeroFrame2);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio bbox overview zoom', r.bboxOZ.currentValue);

        this.bboxOZ2 = r.bboxOZ.currentValue;

        accentra = true;
      }
    }

    let riprendiEventi = false;
    let ciSonoFiltri = false;
    let arrivatiFiltri = false;

    if (r.filtriEventi && r.filtriEventi.currentValue !== undefined && r.filtriEventi.currentValue !== null) {
      if (this.MappaOGrafico2 === 'AE') {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'filtroEventi', r.filtriEventi.currentValue);

        arrivatiFiltri = true;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato filtro eventi:', r.filtroEventi.currentValue);
        logConsole('Filtro attivo 2-1 (Frame ' + this.NumeroFrame2 + '-' + this.frameAttivo2 + '): ', r.filtriEventi.currentValue);
        this.filtriEventi2 = JSON.parse(JSON.stringify(r.filtriEventi.currentValue));

        // // logConsole('Filtri eventi', this.NumeroFrame2, this.filtriEventi2, r.filtriEventi.currentValue);

      // // logConsole('Filtri arrivati', this.filtriEventi2);
      // if (this.MappaOGrafico2 === 'AE') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricarico events da filtro eventi');
        // this.eventsComponent.prendeEvents(this, -2, false); EX -2
        // this.eventsComponent.prendeEvents(this, false); // , -1
        riprendiEventi = true;

        if (this.filtriEventi2.filtroImpostato || this.filtriEventi2.filtroEscluso) {
          ciSonoFiltri = true;
        }
      }
      // }
    } else {
      if (this.MappaOGrafico2 === 'AE') {
        // logConsole('Filtro attivo 2-1 (Frame ' + this.NumeroFrame2 + '-' + this.frameAttivo2 + ') pulito');
        // this.filtriEventi2 = undefined;
      }
    }

    if (arrivatiFiltri) {
      this.filtroEventiMemorizzati = this.filtriEventi2;
      
      if (ciSonoFiltri) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'filtroEventi attuale', this.filtroEventiMemorizzati[this.NumeroFrame2]);

        this.filtroAttivo = true;
      } else {
        // // logConsole('Filtro eventi attuale: Nullo');
        this.filtroAttivo = false;
      }
    }

    if (riprendiEventi) {
      if (this.MappaOGrafico2 === 'AE') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricarico events da filtro eventi');
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Ricarico events da filtro eventi');
        // }
        // this.eventsComponent.prendeEvents(this, -2, false); EX -2
        this.eventsComponent.prendeListaAgents(this); //  , this.offsetAe // 21/07/2025 per mail 26=706/2025 10:03

        this.eventsComponent.prendeEvents(this, false, false, false); // , -1
      }
    }

    if (r.listaEventiCheckatiES) {
      if (r.listaEventiCheckatiES.currentValue) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'listaEventiCheckatiES', r.listaEventiCheckatiES.currentValue);
        // }

        this.eventiSceltiES2 = r.listaEventiCheckatiES.currentValue;

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi checkati', this.appoCheckES);
        if (!this.eventiSceltiES2) {
          this.eventiSceltiES2 = new Array();
        }

        this.impostaArraySelezioneES('OnChange 2');
        // }

        // if (this.MappaOGrafico2 === 'M') {

        accentra = true;
      }
    }

    if (r.datiAddLayers) {
      this.datiAddLayers2 = r.datiAddLayers.currentValue;
    }

    if (r.datiLookUp) {
      this.datiLookUp2 = r.datiLookUp.currentValue;
    }

    if (r.cellType) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'cellType', r.cellType.currentValue);
      this.cellType2 = r.cellType.currentValue;
      // logConsole('Passaggio cell type a frame', this.cellType2);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, this.cellType2);
    }

    if (r.addLayers) {
      this.addLayers2 = r.addLayers.currentValue;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Passaggio addLayers', this.NumeroFrame, this.addLayers2);
    }

    if (r.styleSizeGlobale) {
      if (r.styleSizeGlobale.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'styleSizeGlobale', this.NumeroFrame2, r.styleSizeGlobale.currentValue);
        this.styleSizeGlobale2 = r.styleSizeGlobale.currentValue;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Style size globale', this.NumeroFrame, this.styleSizeGlobale2);

        accentra = true;
      }
    }

    if (r.listaStileSizes) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'listaStileSizes', r.listaStileSizes.currentValue);
      // }

      this.listaStileSizes2 = r.listaStileSizes.currentValue;
    }

    if (r.copyAllClip) {
      if (this.testoDettaglioEventi && this.testoDettaglioEventi !== null) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, this.testoDettaglioEventi);

        this.indent = 0;
        this.righeJSON = '';
        // this.convertJSONToTxt(this.testoDettaglioEventi);
        const righeNuove = this.righeJSON;
        /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, righeNuove);
        let j = JSON.stringify(this.testoDettaglioEventi, undefined, 4)
          .replace(/ /g, ' ')
          .replace(/\n/g, '\n');

        while (j.indexOf('[') > -1) { j = j.replace('[', ''); }
        while (j.indexOf(']') > -1) { j = j.replace(']', ''); }
        while (j.indexOf('{') > -1) { j = j.replace('{', ''); }
        while (j.indexOf('}') > -1) { j = j.replace('}', ''); }
        while (j.indexOf('"text":') > -1) { j = j.replace('"text":', ''); }
        while (j.indexOf('"items":') > -1) { j = j.replace('"items":', ''); }
        while (j.indexOf('"') > -1) { j = j.replace('"', ''); }
        while (j.indexOf('    ') > -1) { j = j.replace('    ', '\t'); }
        while (j.indexOf(',') > -1) { j = j.replace(',', ''); }
        while (j.indexOf('\t\n') > -1) { j = j.replace('\t\n', ''); }
        const righe = j.split('\n');
        let righeNuove = '';
        righe.forEach(element => {
          if (element && element !== '') {
            let ele = element.replace('\n', '');
            let ele2 = JSON.parse(JSON.stringify(ele));
            while (ele2.indexOf('\t') > -1) { ele2 = ele2.replace('\t', ''); }
            if (ele2.trim() !== '' && ele2.trim() !== '\n' && ele2.trim() !== '\t\n') {
              // if (ele.substring(0, 1) === '\t') {
              //   ele = ele.substring(1, ele.length);
              // }
              // while (ele.indexOf('\t\t') > -1) { ele = ele.replace('\t\t', '\t'); }
              ele = ele.replace('\t\t', '');
              ele = ele.replace('\t\t', '');
              while (ele.indexOf('\t\t') > -1) { ele = ele.replace('\t\t', '\t'); }

              righeNuove += ele + '\n';
            }
          }
        });
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, righeNuove); */

        this.copyMessage(righeNuove);
        // alert('Copied in clipboard');
        // this.mostraPopup('Copied in clipboard', false, '')
        ExternalUtilities.visualizzaAlert('Copied in clipboard');
      }
    }

    if (r.cambiatoAGNACTDopoScelta && r.cambiatoAGNACTDopoScelta.currentValue) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'cambiatoAGNACTDopoScelta', r.cambiatoAGNACTDopoScelta.currentValue);

      this.giaDisegnataStruttura[this.NumeroFrame2] = false;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiata activity dopo scelta', r.cambiatoAGNACTDopoScelta.currentValue);
      ExternalUtilities.stringaAGNoACT = r.cambiatoAGNACTDopoScelta.currentValue.AGN_CODE;
      this.agnPerTcInfo = ExternalUtilities.stringaAGNoACT;
      this.elaboraPuntoClickato(r.cambiatoAGNACTDopoScelta.currentValue);
    }

    if (r.collapseAllTreeView && r.collapseAllTreeView.currentValue) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Collasso tree view');
      this.eventsComponent.collassaTuttiINodi(this);
    }

    if (r.expandAllTreeView && r.expandAllTreeView.currentValue) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Espando tree view');
      this.eventsComponent.espandeTuttiINodi(this);
    }

    if (r.dashboardAttiva) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'dashboardAttiva', r.dashboardAttiva.currentValue);

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisco dati mappa', this.NumeroFrame, this.dashboardAttiva2);
      this.giaDisegnataStruttura[this.NumeroFrame2] = false;

      this.dashboardAttiva2 = r.dashboardAttiva.currentValue;
      if (this.dashboardAttiva2) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Metto mappa invisibile', this.NumeroFrame2);

        /* this.mappaForzata = false;
        this.mappaVisibile = false;
        this.map1[this.NumeroFrame2]= undefined;
        this.viewMappaAttuale = undefined;
        this.viewMappaGlobale = undefined;
        this.mappaGlobaleImpostata = false;
        this.viewMappaLocale = undefined;
        this.mappaLocaleImpostata = false;
        this.currZoom = -1;
        this.creataMappa = false; */
      }
    }

    if (r.columnsBars) {
      this.columnsBars2 = r.columnsBars.currentValue;
      if (+this.columnsBars2 === 1) {
        this.visualizzaIstogrammiGrafici = false;
        this.visualizzaGrigliaExportH[this.NumeroFrame2] = true;
      } else {
        this.visualizzaIstogrammiGrafici = true;
        // // logConsole('Azzero visua griglia h 5');
        this.visualizzaGrigliaExportH[this.NumeroFrame2] = false;
      }

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo histogranmma cambiato', this.NumeroFrame, this.columnsBars2);
      if (this.MappaOGrafico2 === 'AH') {
        accentra = true;
      }
    }

    if (r.doubleGraph) {
      this.doubleGraph2 = r.doubleGraph.currentValue;

      if (this.MappaOGrafico2 === 'AH') {
        accentra = true;
      }
    }

    if (r.eventsMeasure) {
      this.eventsMeasure2 = r.eventsMeasure.currentValue;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo Events Measure cambiato', this.NumeroFrame, this.eventsMeasure2);
      if (this.MappaOGrafico2 === 'AH') {
        accentra = true;
      }
    }

    if (r.histDisplayAs) {
      this.histDisplayAs2 = r.histDisplayAs.currentValue;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo histogranmma cambiato', this.NumeroFrame, this.histDisplayAs2);
      if (this.MappaOGrafico2 === 'AH') {
        accentra = true;
      }
    }

    if (r.histDisplayTutto) {
      this.histDisplayTutto2 = r.histDisplayTutto.currentValue;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo histogranmma cambiato', this.NumeroFrame, this.histDisplayAs2);
      if (this.MappaOGrafico2 === 'AH') {
        accentra = true;
      }
    }

    if (r.showPlanimetry) {
      this.showPlanimetry2 = r.showPlanimetry.currentValue;
      
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Show Planimetry cambiato', this.NumeroFrame, '*' + this.showPlanimetry2 + '*');

      if (this.MappaOGrafico2 === 'M') {
        accentra = true;
      }
    }

    /* if (r.eventiSceltiESModificati) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventiSceltiESModificati', r.eventiSceltiESModificati.currentValue);

      const es = r.eventiSceltiESModificati.currentValue;
      if (es && es.length > 0) {
        const impostaSelezioneES = new Array();
        es.forEach(element => {
          impostaSelezioneES.push(element.ROW_ID);
        });
        const tm = setTimeout(() => {
          clearTimeout(tm);

          logConsole('Imposto selezione ES On Change', this.NumeroFrame2, impostaSelezioneES);
          this.impostaSelezioneES = impostaSelezioneES;
        }, 100);
      } else {
        logConsole('Imposto selezione ES Pulizia On Change', this.NumeroFrame2);
        this.impostaSelezioneES = [-1];
      }
      // const tm = setTimeout(() => {
      //    clearTimeout(tm);
        // this.Utils.eventiSceltiES2 = r.eventiSceltiESModificati.currentValue;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Show eventi globali cambiati', this.frameAttivo2, this.NumeroFrame, this.Utils.eventiSceltiES2);

      accentra = true;
        // }, 10);
    } */

    if (r.eventiSceltiES) {
      if (r.eventiSceltiES.currentValue !== undefined && r.eventiSceltiES.currentValue !== null) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventiSceltiES', r.eventiSceltiES.currentValue);

        this.eventiSceltiES2 = r.eventiSceltiES.currentValue;

        // logConsole('EVENTI SCELTI ES 1:', this.NumeroFrame2, JSON.parse(JSON.stringify(this.eventiSceltiES2)));

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Show eventi scelti ES cambiato', this.frameAttivo2, this.NumeroFrame, this.appoCheckES);
        if (!this.eventiSceltiES2) {
          this.eventiSceltiES2 = new Array();
        }

        this.impostaArraySelezioneES('OnChange 1');
        // }

        // logConsole('Eventi scelti dati', r.eventiSceltiES.currentValue, this.eventiSceltiES2, this.datiPointActivityEvents);

        // if (this.MappaOGrafico2 === 'M') {

        accentra = true;
          // }

        /*  Tolto il 22/07/2021
        this.Utils.eventiSceltiES2 = new Array();
        let messi = '';
        this.appoCheckES.forEach(element => {
          if (messi.indexOf(element.EVENT_TYPE + ',') === - 1) {
            messi += element.EVENT_TYPE + ',';
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, messi);
            const v = { EVENT_TYPE: element.EVENT_TYPE };
            this.Utils.eventiSceltiES2.push(v);
          }
        });*/

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.eventiSceltiES2);
        this.eventiSceltiES2Testo = '';
        if (this.eventiSceltiES2) {
          this.eventiSceltiES2.forEach(element => {
            this.eventiSceltiES2Testo += element.EVENT_TYPE + ', ';
          });
          if (this.eventiSceltiES2Testo.length > 1) {
            this.eventiSceltiES2Testo = this.eventiSceltiES2Testo.substring(0, this.eventiSceltiES2Testo.length - 2);
          }
        }

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventi 1',  this.eventiSceltiES2);

          this.eventiSceltiESDiPassaggio = this.eventiSceltiES2;
        }, 10);
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.eventiSceltiESTesto);
          // if (this.MappaOGrafico2 === 'AE') {
          //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricarico events da eventi scelti es');
          //   this.eventsComponent.prendeEvents(this, -1);
          // }
      // }
      }
    }

    if (r.eventiSceltiGlobaliES) {
      if (r.eventiSceltiGlobaliES.currentValue !== undefined && r.eventiSceltiGlobaliES.currentValue !== null) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventiSceltiGlobaliES', r.eventiSceltiGlobaliES.currentValue);

        this.eventiSceltiESGlobali2 = r.eventiSceltiGlobaliES.currentValue;
        // // logConsole('EVENTI SCELTI 1:', this.appoCheckES);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Show eventi scelti ES cambiato', this.frameAttivo2, this.NumeroFrame, this.appoCheckES);
        
        // logConsole('Eventi checkati globali', this.eventiSceltiESGlobali2);

        if (!this.eventiSceltiESGlobali2) {
          this.eventiSceltiESGlobali2 = new Array();
        }

        this.impostaArraySelezioneGlobaliES('OnChange 1');
        // }

        // if (this.MappaOGrafico2 === 'M') {

        accentra = true;
          // }

        /*  Tolto il 22/07/2021
        this.Utils.eventiSceltiES2 = new Array();
        let messi = '';
        this.appoCheckES.forEach(element => {
          if (messi.indexOf(element.EVENT_TYPE + ',') === - 1) {
            messi += element.EVENT_TYPE + ',';
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, messi);
            const v = { EVENT_TYPE: element.EVENT_TYPE };
            this.Utils.eventiSceltiES2.push(v);
          }
        });*/

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.eventiSceltiES2);
        this.eventiSceltiGlobaliES2Testo = '';
        if (this.eventiSceltiESGlobali2) {
          this.eventiSceltiESGlobali2.forEach(element => {
            this.eventiSceltiGlobaliES2Testo += element.EVENT_TYPE + ', ';
          });
          if (this.eventiSceltiGlobaliES2Testo.length > 1) {
            this.eventiSceltiGlobaliES2Testo = this.eventiSceltiGlobaliES2Testo.substring(0, this.eventiSceltiGlobaliES2Testo.length - 2);
          }
        }

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventi 1',  this.eventiSceltiESGlobali2);

          this.eventiSceltiGlobaliESDiPassaggio = this.eventiSceltiESGlobali2;
        }, 10);
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.eventiSceltiESTesto);
          // if (this.MappaOGrafico2 === 'AE') {
          //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricarico events da eventi scelti es');
          //   this.eventsComponent.prendeEvents(this, -1);
          // }
      // }
      }
    }

    if (r.tipoEvento) {
      this.tipoEvento2 = r.tipoEvento.currentValue;
      this.tipoEvento2 = Array.isArray(this.tipoEvento2) ? this.tipoEvento[this.NumeroFrame2] : this.tipoEvento2;
      // logConsole('Tipo evento passato: ', this.NumeroFrame2, this.tipoEvento2);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo evento cambiato in frame', this.NumeroFrame, this.tipoEvento2);
      // if (this.MappaOGrafico2 === 'M') {

      accentra = true;
        // }
    }

    if (r.fixedSeconds1) {
      this.fixedSeconds2 = r.fixedSeconds1.currentValue;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fixed seconds', this.NumeroFrame, this.frameAttivo, this.fixedSeconds2);
      // if (this.MappaOGrafico2 === 'M') {

      accentra = true;
        // }
    }

    /* if (r.columnsSettings) {
      this.columnsSettings2 = r.columnsSettings.currentValue;
      // if (this.columnsSettings2[0] !== '') {
      //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ColumnsSettings cambiato', this.frameAttivo, this.NumeroFrame, this.columnsSettings2);
      // }
      if (this.MappaOGrafico2 === 'AE') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricarico events da column settings');
        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Ricarico events da column settings');
        }
        this.eventsComponent.prendeEvents(this, false); // , -1
      }
    } */

    if (r.dimensioniFinestraLegenda) {
      this.dimensioniFinestraLegenda2 = r.dimensioniFinestraLegenda.currentValue;
      this.sistemaFinestraLegenda();
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dimensioni finestra legenda', this.NumeroFrame, this.dimensioniFinestraLegenda2);
    }

    if (r.dimensioniSplitTcRun) {
      this.dimensioniSplitTcRun2 = r.dimensioniSplitTcRun.currentValue;
    }

    if (r.impostazioniPivot && r.impostazioniPivot.currentValue) {
      this.impostazioniPivot2 = r.impostazioniPivot.currentValue;
      // logConsole('Impostazioni pivot onchange', this.impostazioniPivot2);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostazioni pivot frame', this.NumeroFrame, this.impostazioniPivot2);
    }

    if (r.resizeFrame) {
      if (this.MappaOGrafico2 === 'TP' || this.MappaOGrafico2 === 'PP') {
        this.cambioDimensioneContenitorePivot = new Date().toString();
        // this.cambioDimensioneContenitorePivot_fake = new Date().toString();
      } else {
        if (this.MappaOGrafico2 === 'M') {
          // this.updateSizeMappa('ResizeFrame');
        }
      }
    }

    if (r.styleSize) {
      if (r.styleSize.currentValue) {
        this.styleSize2 = r.styleSize.currentValue;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio style size', this.NumeroFrame, this.styleSize2);

        if (this.MappaOGrafico2 === 'M') {
          accentra = true;
        }
      }
    }

    if (r.massimizzato) {
      this.massimizzata = r.massimizzato.currentValue;
    }

    if (r.viewDefinition) {
      this.viewDefinition2 = r.viewDefinition.currentValue;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onChanges view definition', this.viewDefinition2);
    }

    if (r.timeRangeDSFStart) {
      if (r.timeRangeDSFStart.currentValue) {
        try {
          const d = r.timeRangeDSFStart.currentValue;
          this.timeRangeDSFStart2 = this.datePipe.transform(new Date(d), 'yyyy-MM-dd HH:mm:ss.SSS');
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time range start', this.NumeroFrame2, r.timeRangeDSFStart.currentValue, this.timeRangeDSFStart2);

          accentra = true;
        } catch (e) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ERROR nella conversione del Time range start', this.NumeroFrame2, r.timeRangeDSFStart.currentValue);
        }
      }
    }

    if (r.timeRangeDSFStop) {
      if (r.timeRangeDSFStop.currentValue) {
        try {
          const d = r.timeRangeDSFStop.currentValue;
          this.timeRangeDSFStop2 = this.datePipe.transform(new Date(d), 'yyyy-MM-dd HH:mm:ss.SSS');
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time range stop', this.NumeroFrame2, r.timeRangeDSFStop.currentValue, this.timeRangeDSFStop2);

          accentra = true;
        } catch (e) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ERROR nella conversione del Time range stop', this.NumeroFrame2, r.timeRangeDSFStop.currentValue);
        }
      }
    }

    if (r.squareMetersGlobale) {
      if (r.squareMetersGlobale.currentValue !== undefined) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio squareMeters globale', this.NumeroFrame, r.squareMetersGlobale.currentValue, this.MappaOGrafico2, this.overviewZoom2);

        this.squareMetersGlobale2 = r.squareMetersGlobale.currentValue;
        // logConsole('Cambio square meters globale',this.squareMetersGlobale2);
        this.gestisceSquareMeters();
      }
    }

    if (r.squareMeters) {
      if (r.squareMeters.currentValue !== undefined) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio squareMeters', this.NumeroFrame, r.squareMeters.currentValue, this.MappaOGrafico2, this.overviewZoom2);

        // logConsole('Square meters', this.squareMeters2);
        this.squareMeters2 = r.squareMeters.currentValue;
        this.gestisceSquareMeters();
      }
    }

    if (r.partitionLabel) {
      if (r.partitionLabel.currentValue !== undefined) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio partitionLabel', this.NumeroFrame, r.partitionLabel.currentValue);

        this.partitionLabel2 = r.partitionLabel.currentValue;
        // logConsole('Cambio partition label', this.NumeroFrame2, this.partitionLabel2);

        accentra = true;
      }
    }

    if (r.listaActSet) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio listaActSet', this.NumeroFrame, r.listaActSet.currentValue);

      this.listaActSet2 = r.listaActSet.currentValue;
      // logConsole('Cambio listaActSet', this.NumeroFrame2, this.listaActSet2);

      accentra = true;
    }

    if (r.clusterGlobale) {
      if (r.clusterGlobale.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Overlay: clusterGlobale', this.NumeroFrame, r.clusterGlobale.currentValue);

        this.clusterGlobale2 = r.clusterGlobale.currentValue;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cluster globale frame ', this.NumeroFrame, this.clusterGlobale2);

        accentra = true;
      }
    }

    if (r.slaValueGlobale) {
      if (r.slaValueGlobale.currentValue || +r.slaValueGlobale.currentValue === 0) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'slaValueGlobale', this.NumeroFrame2, r.slaValueGlobale.currentValue);

        this.slaValueGlobale2 = r.slaValueGlobale.currentValue;

        // logConsole('Cambio sla globale', this.NumeroFrame2, this.slaValueGlobale2);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore sla globale:', this.slaValueGlobale2, this.frameAttivo, this.NumeroFrame);

        accentra = true;
      }
    }

    if (r.datiSLA) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'datiSLA', r.datiSLA.currentValue);

      this.datiSLA2 = r.datiSLA.currentValue;
    }

    if (r.datiSlaDT) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'datiSlaDT', r.datiSlaDT.currentValue);

      this.datiSlaDT2 = r.datiSlaDT.currentValue;
    }

    if (r.clusterGroup) {
      this.clusterGroup2 = r.clusterGroup.currentValue;
    }

    if (r.setZoom) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'setZoom', r.setZoom.currentValue, this.viewMappaAttuale);

      if (!this.staCambiandoFrame) {
        this.currZoom = r.setZoom.currentValue;

        /* TOLTO ZOOM PER TEST
        try {
          this.map1[this.NumeroFrame2].getView().setZoom(+this.currZoom);
        } catch (e) {

        } */ 

        this.controllaImpostazioneMappaAttuale();

        accentra = true;
      }
    }

    if (r.rotationDaImpostare) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'rotation Da Impostare', r.rotationDaImpostare.currentValue);
      // }

      // const mappaGlobale = this.Utils.tornaGlobale(this);
      if (this.overviewZoom2 === false && this.MappaOGrafico2 === 'M' && this.map1[this.NumeroFrame2]) {
        this.rotation = r.rotationDaImpostare.currentValue;
        // if (this.viewMappaAttuale) {
          this.map1[this.NumeroFrame2].getView().setRotation(+this.rotation);
        // }
        // this.map1[this.NumeroFrame2].setView(this.viewMappaAttuale);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio rotation ', this.NumeroFrame, this.rotation);
        // this.controllaImpostazioneMappaAttuale();
      }
    }

    if (r.coordinateDaImpostare) {
      // const mappaGlobale = this.Utils.tornaGlobale(this);
      // if (this.overviewZoom2 === false && this.MappaOGrafico2 === 'M') {
      if (this.MappaOGrafico2 === 'M' && (this.overviewZoom2 === true || (this.overviewZoom2 === false && ExternalUtilities.frameCheHaClickatoSullaMappa !== this.NumeroFrame2))) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Coordinate da impostare: ', this.NumeroFrame2, r.coordinateDaImpostare.currentValue);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Coordinate da impostare. Tipo mappa', this.overviewZoom2);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Coordinate da impostare. Chi ha clickato', ExternalUtilities.frameCheHaClickatoSullaMappa);
        // }
        // const coordinate = r.coordinateDaImpostare.currentValue;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio coordinate frame ', this.NumeroFrame);
        
        this.getCoord(null, 'coordinateDaImpostare');

        /* const coordinate = r.coordinateDaImpostare.currentValue;

        let coord2 = [+coordinate[0], +coordinate[1]];
        if (coord2[0] > 200) {
          coord2 = transform(coord2, 'EPSG:3857', 'EPSG:4326');
        }
        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord ritorno coord', this.NumeroFrame2, coord2);
        }

        this.viewMappaAttuale.setCenter(transform(coord2, 'EPSG:4326', 'EPSG:3857'));
        // this.viewMappaAttuale.setCenter(coordinate, 'EPSG:4326', 'EPSG:4326');
        // this.map1[this.NumeroFrame2].setView(this.viewMappaAttuale);
        */
      }
    }

    //  && this.Utils.fattoQuadrato[this.NumeroFrame2] === false
    if (r.coordinateDaImpostareConClick) {
      if (this.MappaOGrafico2 === 'M') {
        let passatoDaContext = false;
        if (r.coordinateDaImpostareConClick.currentValue) {
          const c = r.coordinateDaImpostareConClick.currentValue;
          if (c[2]) {
            passatoDaContext = true;
          }
        }
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Coordinate Da Impostare Con Click', this.NumeroFrame2,
            r.coordinateDaImpostareConClick.currentValue, this.overviewZoom2,
            ExternalUtilities.spostaCentroAttuale[this.NumeroFrame2], passatoDaContext);
        // }

        if (ExternalUtilities.spostaCentroAttuale[this.NumeroFrame2] === true || passatoDaContext === true) {
          ExternalUtilities.spostaCentroAttuale[this.NumeroFrame2] = undefined;
          // const mappaGlobale = this.Utils.tornaGlobale(this);
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, this.overviewZoom2);
          const coordinate = r.coordinateDaImpostareConClick.currentValue;
          const coordControllo = JSON.stringify(coordinate);
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Coordinate arrivate', this.NumeroFrame2, coordControllo)

          // RIMETTERE 26/05
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio coordinate da click frame ', this.NumeroFrame, coordinate);
          if (coordinate && coordControllo.indexOf('NaN') === -1 && coordControllo.indexOf('null') === -1) {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro3');
            // const tm = setTimeout(() => {
          // clearTimeout(tm);
              let coord2 = [+coordinate[0], +coordinate[1]];
              // if (coord2[0] < 200) { // } || coord2[0] < -200) {
              //   coord2 = transform(coord2, 'EPSG:4326', 'EPSG:3857');
              // }
              // if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO IL CENTRO 5', this.NumeroFrame2, coord2);
              // }
              // if (this.map1[this.NumeroFrame2]) {
                this.impostaPosizioneSchermata(coord2, false, 'coordinateDaImpostareConClick', true, false);
                // this.map1[this.NumeroFrame2].getView().setCenter(transform(coord2, 'EPSG:4326', 'EPSG:3857'));
                    /* if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO IL CENTRO 5', this.NumeroFrame2, coord2);
                }
                this.viewMappaAttuale.setCenter(transform(coord2, 'EPSG:4326', 'EPSG:3857'));
                this.centroImpostato = transform(coord2, 'EPSG:4326', 'EPSG:3857'); */

                // this.updateSizeMappa('CoordinateImpostateConClick');
                // updateMappa = true;
              // }
              // this.centroImpostato = transform(coord2, 'EPSG:4326', 'EPSG:3857');
              // this.centroImpostatoEmit.emit({ daChi: this.NumeroFrame2, funzione: 'OnChanges 6', centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame });
              // if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
              // }

              accentra = true;
              // }, 1000);
          } else {
            // accentra = true;
          }
          // if (this.map1[this.NumeroFrame2]) {
          //   this.map1[this.NumeroFrame2].setView(this.viewMappaAttuale);
          // }
          // RIMETTERE 26/05
        }
      } else {
        // accentra = true;
        if (this.MappaOGrafico2 === 'PL') {
          const tm = setTimeout(() => {
            clearTimeout(tm);
            
            const coordinate = r.coordinateDaImpostareConClick.currentValue;
            if (coordinate) {
              this.pointLayerInfo.prendePointLayerInfo(this, coordinate);
            }
          }, 10);
        }
      }
    }

    if (r.Activity) {
      if (r.Activity.currentValue) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata Activity', r.Activity.currentValue);
        // }
        this.giaDisegnataStruttura[this.NumeroFrame2] = false;

        this.Activity2 = r.Activity.currentValue;
        this.ActivitySetName = '';
        this.Utils.datiTipiActivity.forEach(element => {
          if (this.Activity2 === element.id) {
            this.ActivitySetName = element.name;
          }
        });

        if (this.datiActivitySet2 && this.datiActivitySet2.length > -1 &&
          this.datiActivitySet2[this.Activity2] && this.datiActivitySet2[this.Activity2].NAME) {
          ///// this.act_set = this.datiActivitySet2[this.Activity2].NAME;
          ///// if (this.debug2 === true) {
          /////   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Setto act_set 2', this.act_set);
          ///// }
        }

        // this.giaDisegnataStruttura[this.NumeroFrame2] = false;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiata activity frame', this.NumeroFrame, this.Activity2, this.ActivitySetName);

        accentra = true;
      }
    }

    if (r.listaActivityImpostate) {
      if (r.listaActivityImpostate.currentValue) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'listaActivityImpostate', r.listaActivityImpostate.currentValue);
        // }

        this.listaActivityName2 = r.listaActivityImpostate.currentValue;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiata lista activity name:', this.NumeroFrame, this.listaActivityName2, this.frameAttivo);

        accentra = true;
      }
    }

    if (r.coordinatePassateRT) {
      if (r.coordinatePassateRT.currentValue) {
        const data2 = r.coordinatePassateRT.currentValue;
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Coordinate passate da rt:', data2);
        // }
        const coordinate = new Array();
        if (data2 && data2.lat && data2.lng && data2.lat !== '' && data2.lng !== '' && +data2.lng !== 0 && +data2.lat !== 0) {
          const bbox2 = JSON.stringify(this.prendeBBOXSoloValori('BBox2')).toString();
          if (bbox2) {
            const bbox = bbox2.replace('[', '').replace(']', '').split(',');

            coordinate.push(data2.lng);
            coordinate.push(data2.lat);
            // if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Posizione da impostare su cambio tms', this.NumeroFrame2, +coordinate[0], +coordinate[1]);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Posizione da impostare su cambio tms', this.NumeroFrame2, +bbox[0], +bbox[1], +bbox[2], +bbox[3]);
            // }
            if (+coordinate[0] < +bbox[0] || +coordinate[1] < +bbox[1] || +coordinate[0] > +bbox[2] || +coordinate[1] > +bbox[3]) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sposto posizione', this.NumeroFrame2, bbox, coordinate);

              this.viewMappaAttuale.setCenter(transform(coordinate, 'EPSG:4326', 'EPSG:3857'));
            }
          }
        }
      }
    }

    if (r.posDaImpostare && r.posDaImpostare.currentValue) {
      if (this.MappaOGrafico2 === 'M') { // && this.Utils.posDaImpostare && this.Utils.posDaImpostare !== '') {
        const coordinate2 = r.posDaImpostare.currentValue; // this.Utils.posDaImpostare;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PosDaImpostare: Coordinate da impostare: ', coordinate2);
        if (coordinate2 && coordinate2 !== null && coordinate2.indexOf('POINT') > -1) {
          const coordinate = coordinate2.replace('POINT(', '').replace(')', '').split(' ');
          const bbox2 = JSON.stringify(this.prendeBBOXSoloValori('BBox2')).toString();
          if (bbox2) {
            const bbox = bbox2.replace('[', '').replace(']', '').split(',');
            if (+coordinate[0] < +bbox[0] || +coordinate[1] < +bbox[1] || +coordinate[0] > +bbox[2] || +coordinate[1] > +bbox[3]) {
              // if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PosDaImpostare: Sposto posizione', this.NumeroFrame2, bbox, coordinate);
              // }
              let coord2 = [+coordinate[0], +coordinate[1]];
              if (coord2) {
                if (coord2[0] > 200) {
                  coord2 = transform(coord2, 'EPSG:3857', 'EPSG:4326');
                }
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PosDaImpostare: IMPOSTO CENTRO 6', this.NumeroFrame2, coord2);

                this.impostaPosizioneSchermata(coord2, false, 'posDaImpostare', true, false);
                /* if (this.map1[this.NumeroFrame2]) {
                  this.map1[this.NumeroFrame2].getView().setCenter(transform(coord2, 'EPSG:4326', 'EPSG:3857'));
                } */
                // this.centroImpostato = transform(coord2, 'EPSG:4326', 'EPSG:3857');
                // this.centroImpostatoEmit.emit({ daChi: this.NumeroFrame2, funzione: 'OnChanges 7', centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame });
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PosDaImpostare: Centro impostato', this.centroImpostato);
              }
            } else {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PosDaImpostare: Coordinate da impostare interne alla bbox', coordinate, bbox);
            }
          }
        }
      }
    }

    if (r.CambioTmsSelezionato && this.Utils.fattoQuadrato[this.NumeroFrame2] === false) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms selezionato', this.NumeroFrame, r.CambioTmsSelezionato.currentValue);
      if (r.CambioTmsSelezionato.currentValue !== undefined) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CambioTmsSelezionato', r.CambioTmsSelezionato.currentValue, this.MappaOGrafico2);

        const t = r.CambioTmsSelezionato.currentValue.split(';');
        this.tmsSelezionato = t[0];
        this.cambioPerRange = t[1];

        if (this.MappaOGrafico2 === 'MC') {
          const tms = this.datePipe.transform(this.tmsSelezionato, 'yyyy-MM-dd HH:mm:ss');
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CambioTmsSelezionato. Richiamo selezione grafici', tms);

          this.graficiComponent.disegnaSelezioneGrafici(this, tms, true, 'Cambio TMS Selezionato');
        }

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo spostamento mappa');
        /* if (this.MappaOGrafico2 === 'M') { // && this.Utils.posDaImpostare && this.Utils.posDaImpostare !== '') {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa. Controllo la posizione attuale su cambio tms', this.NumeroFrame2);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prendo valori bbox 3');

          const bbox2 = JSON.stringify(this.prendeBBOXSoloValori('BBox2')).toString();
          // ExternalUtilities.bboxAttuale = bbox2;
          const bbox = bbox2.replace('[', '').replace(']', '').split(',');
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Posizione attuale su cambio tms', this.NumeroFrame2, bbox, this.Utils.posDaImpostare);
          */

          /* const coordinate2 = this.Utils.posDaImpostare;
          if (coordinate2 && coordinate2 !== null && coordinate2.indexOf('POINT') > -1) {
            const coordinate = coordinate2.replace('POINT(', '').replace(')', '').split(' ');
            if (+coordinate[0] < +bbox[0] || +coordinate[1] < +bbox[1] || +coordinate[0] > +bbox[2] || +coordinate[1] > +bbox[3]) {
              if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sposto posizione', this.NumeroFrame2, bbox, coordinate);
              }
              let coord2 = [+coordinate[0], +coordinate[1]];
              if (coord2) {
                if (coord2[0] > 200) {
                  coord2 = transform(coord2, 'EPSG:3857', 'EPSG:4326');
                }
                if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO CENTRO 6', this.NumeroFrame2, coord2);
                }
                this.map1[this.NumeroFrame2].getView().setCenter(transform(coord2, 'EPSG:4326', 'EPSG:3857'));
                this.centroImpostato = transform(coord2, 'EPSG:4326', 'EPSG:3857');
                if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
                }
              }

              this.continuaCambioTMSSelezionato();
            } else {
              this.continuaCambioTMSSelezionato();
            }

            // this.Utils.posDaImpostare = undefined;
          } else { */
            this.continuaCambioTMSSelezionato();
          // }

          /* if (!this.coordinatePassateDaRT2) {
            let agnact = '';
            if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
              agnact = '"null"';
            } else {
              agnact = ExternalUtilities.stringaAGNoACT;
            }
            let valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '\'', '');
            valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '"', '');

            if (!valoreRicerca) {
              return;
            }

            const params = {
              v_agn_code: valoreRicerca,
              v_tms: this.tmsSelezionato
            };
            if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Parametri Posizione attuale su cambio tms', this.NumeroFrame2, params);
            }
            this.apiService.chiamataPost(this.Utils, 'antsgeo_tms_to_gps1', params)
            // .map(response => response)
            .subscribe((data: any) => {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data, this.NumeroFrame);
              if (data !== null) {
                ExternalUtilities.checkRitornoChiamata(this, this.Utils, data);

                const data2 = data;
                // const coordinate = this.map1[this.NumeroFrame2].getEventCoordinate(event);
                const coordinate = new Array();
                if (data2 && data2.lat && data2.lng && data2.lat !== '' && data2.lng !== '' && +data2.lng !== 0 && +data2.lat !== 0) {
                  coordinate.push(data2.lng);
                  coordinate.push(data2.lat);
                  if (this.debug2 === true) {
                    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Posizione da impostare su cambio tms', this.NumeroFrame2, +coordinate[0], +coordinate[1]);
                    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Posizione da impostare su cambio tms', this.NumeroFrame2, +bbox[0], +bbox[1], +bbox[2], +bbox[3]);
                  }
                  if (+coordinate[0] < +bbox[0] || +coordinate[1] < +bbox[1] || +coordinate[0] > +bbox[2] || +coordinate[1] > +bbox[3]) {
                    if (this.debug2 === true) {
                      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sposto posizione', this.NumeroFrame2, bbox, coordinate);
                    }
                    this.viewMappaAttuale.setCenter(transform(coordinate, 'EPSG:4326', 'EPSG:3857'));

                    this.continuaCambioTMSSelezionato();
                  } else {
                    this.continuaCambioTMSSelezionato();
                  }
                }
              }
            });
          } else {
            this.continuaCambioTMSSelezionato();
          }
        } else {
          this.continuaCambioTMSSelezionato();
        } */
      }
    }

    /* if (r.DatiActivityEvents) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi', this.NumeroFrame);
      this.aggiornaEventi(r.DatiActivityEvents.currentValue, false, false);
    } */

    if (r.DatiPointMeasures) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DatiPointMeasures', r.DatiPointMeasures.currentValue);
      // }

      ///// this.aggiornaPointMeasure(r.DatiPointMeasures.currentValue);
      ///// this.effettuaAutoFitPM = !this.effettuaAutoFitPM;
    }

    if (r.ActivityTimeSpan) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ActivityTimeSpan', r.ActivityTimeSpan.currentValue);
      // }

      /* const v = r.ActivityTimeSpan.currentValue;
      this.Utils.datiActTimeSpan.forEach(element => {
        if (v === element.id) {
          this.Utils.rangeDiSecondiPerMille = +element.name * 1000;
          this.Utils.range = this.Utils.rangeDiSecondiPerMille;
        }
      });
      */
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity time span', r.ActivityTimeSpan.currentValue, this.Utils.rangeDiSecondiPerMille,
      //   this.frameAttivo, this.NumeroFrame);
      // const tm = setTimeout(() => {
      //     clearTimeout(tm);

      accentra = true;
        // }, 100);
    }

    if (r.settaMascheraVuotaP) {
      this.settaMascheraVuota = !this.settaMascheraVuota;
    }

    if (r.resettaValoriFrame) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'resettaValoriFrame', r.resettaValoriFrame.currentValue);
      // }

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisco valori frame ', this.frameAttivo, this.NumeroFrame);
      this.MeasureDN = ['', '', '', '', '', '', '', '', '', ''];
      this.frameName2 = '';
      // this.frameName2 = '';
      this.frameDescription = '';
      // this.frameDescription2 = '';
      this.ActivityName = '';
      // this.ActivityName2 = '';
/*       this.Measure = new Array();
      for (let i = 0; i <= this.Utils.quanteMisure ; i++) {
        this.Measure.push('');
        this.removeLayerFromMap('Measure layer ' + i, this.measureLayer[this.NumeroFrame2][i]);
      }
      this.removeLayerFromMap('Path layer', this.pathLayer[this.NumeroFrame2]); */
      this.Utils.giaPresoCentro[this.NumeroFrame] = false;

      // const tm = setTimeout(() => {
      //     clearTimeout(tm);

      accentra = true;
        // }, 100);
    }

    if (r.refreshQuanteMisure) {
      this.refreshQuanteMisure2 = r.refreshQuanteMisure.currentValue;
    }

    if (r.styleMappa) {
      if (r.styleMappa.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'styleMappa', this.NumeroFrame2, r.styleMappa.currentValue);

        this.styleMappa2 = r.styleMappa.currentValue;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Style Mappa', this.styleMappa2);

        accentra = true;
      }
    }

    if (r.frameName) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'frameName', r.frameName.currentValue);

      this.frameName2 = r.frameName.currentValue;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome frame', this.NumeroFrame, this.frameName2);
    }

    if (r.utilizzoMemoria) {
      this.attivaConteggioDimensioneArray();
    }

    if (r.frameDescription) {
      this.frameDescription2 = r.frameDescription.currentValue;
    }

    if (r.allFramesDescriptions) {
      this.allFramesDescriptions2 = r.allFramesDescriptions.currentValue;
      // logConsole('Lista descrizioni frames', this.NumeroFrame2, this.allFramesDescriptions2);
    }

    // if (r.extent) {
      // if (this.map1[this.NumeroFrame2]!== undefined && this.map1[this.NumeroFrame2]!== null) {
        // this.map1[this.NumeroFrame2].getView().zoomToExtent(r.extent.currentValue);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onChange extent frame ' + this.NumeroFrame, r.extent.currentValue);
        // if (r.extent.currentValue.length !== undefined && this.map1[this.NumeroFrame2].getView() !== null && this.map1[this.NumeroFrame2].getView() !== undefined) {
        //   this.map1[this.NumeroFrame2].getView().fit(r.extent.currentValue, this.map1[this.NumeroFrame2].getSize());
        // }
      // }
    //   this.extent2 = r.extent.currentValue;
    // }

    if (r.frameVisibile) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'frameVisibile', r.frameVisibile.currentValue);
      // }

      // if (r.frameVisibile.currentValue) {
      this.frameVisible2 = r.frameVisibile.currentValue;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Frame visibile', this.NumeroFrame, this.frameVisible2, r.frameVisibile);
      // }
    }

    if (r.ConnessioneStabilita) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ConnessioneStabilita', r.ConnessioneStabilita.currentValue);
      // }

      if (this.ConnessioneStabilita === 'OK') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Connessione stabilita Frame ' + this.NumeroFrame);
        // this.LeggeSLA();
        // this.redrawComponente('Connessione Stabilita');
        this.controllaImpostazioneMappaAttuale();
      }
    }

    /* if (r.frameType) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato frameType', this.NumeroFrame, r.frameType.currentValue);
      this.frameType2 = r.frameType.currentValue;

      if (this.map1[this.NumeroFrame2]&& this.map1[this.NumeroFrame2]!== undefined) {
        this.disegnaMappa1(true);
        this.updateMappa();
      }
    } */

    // if (this.frameVisibile === false) {
    //   return;
    // }

    if (r.frameAttivo) {
      if (r.frameAttivo.currentValue || r.frameAttivo.currentValue === 0) {
        if (r.frameAttivo.currentValue === -1) {
          this.cambioFrameInCorso = true;
          this.MappaOGrafico2 = '--';
          // this.puliziaComponent.pulisceFrame(this, -1, true);
          // this.frameAttivo2 = 0;
          // logConsole('Arrivato cambio frame. Pulisco', this.NumeroFrame2, this.frameAttivo2);
        } else {
          // logConsole('Arrivato cambio frame. ', this.NumeroFrame2, r.frameAttivo.currentValue);

          if (!this.eseguitoInProgetto2) {
            /* const diff = new Date().getTime() - this.ultimoCambioFrameR;
            if (diff < 1000) {
              return;
            }
            this.ultimoCambioFrameR = new Date().getTime(); */

            // logConsole('Cambio frame attivo', r.frameAttivo.currentValue);

            // if (this.MappaOGrafico2 === 'M') {
              // logConsole('Cambiato frame di tipo mappa', this.NumeroFrame2, this.centroImpostato, this.zoomImpostatoNelFrame);
            // }

            const t0 = setTimeout(() => {
              clearTimeout(t0);
  
              this.cambioFrameInCorso = false;
            }, 500);
  
            this.giaDisegnataStruttura[this.NumeroFrame2] = false;

          // if (r.frameAttivo.currentValue || this.eseguitoInProgetto22 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. frameAttivo', r.frameAttivo.currentValue);
            // if (r.frameAttivo.currentValue === this.frameAttivo2) {
            //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw: Non effettuo cambio... Il numero pagina Ã¨ uguale');
            // } else {
              this.frameAttivoAppoggio2 = r.frameAttivo.currentValue.toString();
              this.cambioFrameDaContext = false;
              if (this.frameAttivoAppoggio2 && this.frameAttivoAppoggio2.indexOf(';') > -1) {
                this.frameAttivoAppoggio2 = this.frameAttivoAppoggio2.substring(0, this.frameAttivoAppoggio2.indexOf(';'));
                this.cambioFrameDaContext = true;

                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Arrivato DACONTEXT', this.NumeroFrame2, this.frameAttivoAppoggio2);
              }
              this.staCambiandoFrame = true;

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame: In onChanges', r.frameAttivo.currentValue);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Chiamo cambia frame', this.NumeroFrame2, this.frameAttivoAppoggio2);

              if (!this.nomiFrames2PerTab) {
                this.creaNomiFramesPerTab();
              }
              // logConsole('1-Cambio frame attivo su frame ' + this.NumeroFrame2, this.frameAttivoAppoggio2, this.nomiFrames2PerTab);
              if (this.nomiFrames2PerTab) {
                let i = 0;
                let ok = false;
                this.nonCambiareTab = true;
                this.nomiFrames2PerTab.forEach(element => {
                  if (!ok && +element.indice === +this.frameAttivoAppoggio2) {
                    this.tabSelezionatoPerTab = i;
                    ok = true;
                    // logConsole('2-Cambio tabSelezionato su frame ' + this.NumeroFrame2 + ' per frame attivo ' + this.frameAttivoAppoggio2, 
                    //   this.tabSelezionatoPerTab, element);
                  }
                  i++;
                });
                if (!ok) {
                  this.tabSelezionatoPerTab = this.nomiFrames2PerTab[0].indice;
                  // this.frameAttivoAppoggio2 = this.nomiFrames2PerTab[0].indice;
                  
                  // logConsole('Cambio tab NON esistente su frame ' + this.NumeroFrame2 + ' per frame attivo ' + this.frameAttivoAppoggio2, 
                  //   this.nomiFrames2PerTab);
                }
                setTimeout(() => {
                  this.nonCambiareTab = false;
                }, 500);
              }

              // logConsole('Cambio frame', this.NumeroFrame2, this.frameAttivo2);
              this.puliziaComponent.pulisceFrame(this, this.frameAttivo2, true);
              // this.vecchioJson[this.NumeroFrame2] = '';
              // this.lastCallHistogram[this.NumeroFrame2] = '';

              this.cambiaFrame(null);
          } else {
            return;
          }
          // accentra = true;
        // }, 1000);
        }
      }
    }

    if (r.isCheckedServingCell) {
      if (r.isCheckedServingCell.currentValue !== undefined) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato serving cell', r.isCheckedServingCell.currentValue);
        // }
        this.isCheckedServingCell2 = r.isCheckedServingCell.currentValue;
      }
    }

    if (r.isNonSyncEventTime) {
      this.isNonSyncEventTime2 = r.isNonSyncEventTime.currentValue;
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato isNonSyncEventTime', this.isNonSyncEventTime2);
      // }
    }

    if (r.isStandAloneMR && r.isStandAloneMR.currentValue !== undefined) {
      this.isStandAloneMR2 = r.isStandAloneMR.currentValue;
      // logConsole('Is Stand Alone MR', this.NumeroFrame2, this.isStandAloneMR2);
      this.gestisceSplitStandAlone();
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato isStandAloneMR', this.isStandAloneMR2);
      // }
    }

    if (r.showAxisX) {
      this.showAxisX2 = r.showAxisX.currentValue;
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato showAxisX', this.showAxisX2);
      // }

      accentra = true;
    }

    if (r.heightChart) {
      if (r.heightChart.currentValue) {
        this.heightChart2 = r.heightChart.currentValue;
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato height Chart', this.heightChart2);
        // }
        this.giaDisegnataStruttura[this.NumeroFrame2] = false;

        accentra = true;
      }
    }

    if (r.modalitaRealTimeAttiva) {
      if (r.modalitaRealTimeAttiva.currentValue !== undefined) {
        this.modalitaRealTimeAttiva2 = r.modalitaRealTimeAttiva.currentValue;
        // logConsole('Modalità RT', this.NumeroFrame2, this.modalitaRealTimeAttiva2);
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato modalitÃ  real time attiva', this.modalitaRealTimeAttiva2);
        // }
        
        if (this.modalitaRealTimeAttiva2 === false) {
          this.giaDisegnataStruttura[this.NumeroFrame2] = false;
          this.aggiornaGrafici[this.NumeroFrame2] = true;
        }

        this.datiPerPausa = {
          autoRunAttivo: this.modalitaRealTimeAttiva2,
          timeMode: this.timeModePerPausa
        }
        // // logConsole('Dati per pausa 1: ', this.datiPerPausa);
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati per pausa *1*', this.NumeroFrame2, this.datiPerPausa);
        // }

        accentra = true;
      }
    }
    
    if (r.isCheckedShowPaths) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato show paths', this.NumeroFrame, r.isCheckedShowPaths.currentValue);
      // }
      this.isCheckedShowPaths2 = r.isCheckedShowPaths.currentValue;

      accentra = true;
      
      /* this.pathComponent.disegnaPath(this);
      if (this.Utils.tmsSelezionato) {
        const tms = this.Utils.tmsSelezionato;
        this.pathComponent.disegnaPathClickato(this, tms);
      } */
    }
    
    if (r.isCheckedShowSelectedPaths) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato show selected paths', this.NumeroFrame, r.isCheckedShowSelectedPaths.currentValue);
      // }
      this.isCheckedShowSelectedPaths2 = r.isCheckedShowSelectedPaths.currentValue;

      accentra = true;
      
      /* this.pathComponent.disegnaPath(this);
      if (this.Utils.tmsSelezionato) {
        const tms = this.Utils.tmsSelezionato;
        this.pathComponent.disegnaPathClickato(this, tms);
      } */
    }

    if (r.showRays) {
      if (r.showRays.currentValue !== undefined) {
        this.showRays2 = r.showRays.currentValue;
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato showRays', this.NumeroFrame, this.showRays2);
        // }

        accentra = true;
      }
    }

    if (r.sartPosition) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato sart position', this.NumeroFrame, r.sartPosition.currentValue);
      // }
      this.sartPosition2 = r.sartPosition.currentValue;

      accentra = true;
    }

    if (r.measureSMS) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato measure SMS', this.NumeroFrame, r.measureSMS.currentValue);
      // }
      this.measureSMS2 = r.measureSMS.currentValue;

      accentra = true;
    }

    if (r.mappeStyle) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato mappe style', this.NumeroFrame, r.mappeStyle.currentValue);
      // }
      this.mappeStyle2 = r.mappeStyle.currentValue;
    }

    if (r.mappeMS) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato mappe MS', this.NumeroFrame, r.mappeMS.currentValue);
      this.mappeMS2 = r.mappeMS.currentValue;

      accentra = true;
    }

    if (r.clusterMeasure) {
      // // logConsole('Cluster measure in frame', r.clusterMeasure.currentValue);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato cluster measure', this.NumeroFrame, r.clusterMeasure.currentValue);
      this.clusterMeasure12 = r.clusterMeasure.currentValue;

      accentra = true;
    }

    if (r.clusterMeasure2) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato cluster measure 2', this.NumeroFrame, r.clusterMeasure2.currentValue);
      this.clusterMeasure22 = r.clusterMeasure2.currentValue;

      accentra = true;
    }

    /* if (r.lov) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato lov', this.NumeroFrame, r.lov.currentValue);
      this.lov2 = r.lov.currentValue;

      accentra = true;
    } */

    if (r.correlation) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato correlation measure', this.NumeroFrame, r.correlation.currentValue);
  
      this.correlation2 = r.correlation.currentValue;

      accentra = true;
    }

    if (r.textFilter) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato text filter 1', this.NumeroFrame, r.textFilter.currentValue);
      this.textFilter12 = r.textFilter.currentValue;
      // logConsole('Textfilter frame', this.textFilter12);

      accentra = true;
    }

    if (r.textFilter2) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato text filter 2', this.NumeroFrame, r.textFilter2.currentValue);
      this.textFilter22 = r.textFilter2.currentValue;

      accentra = true;
    }

    /* if (r.textLov) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato text lov', this.NumeroFrame, r.textLov.currentValue);
      this.textLov2 = r.textLov.currentValue;

      accentra = true;
    } */

    if (r.addGlobalLayer) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato global layer', this.NumeroFrame, r.addGlobalLayer.currentValue);
      this.addGlobalLayer2 = r.addGlobalLayer.currentValue;

      accentra = true;
    }

    if (r.measureRCM) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato measure RCM', this.NumeroFrame, r.measureRCM.currentValue);
      // }
      this.measureRCM2 = r.measureRCM.currentValue;

      accentra = true;
    }

    if (r.showRaysAllLayer) {
      this.showRaysAllLayer2 = r.showRaysAllLayer.currentValue;
      if (this.showRaysAllLayer2) {
        if (this.showRaysAllLayer2.length > 0) {
          this.showRaysAllLayer2 = true;
        }
      }
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato showRaysAllLayer', this.NumeroFrame, r.showRaysAllLayer.currentValue, this.showRaysAllLayer2);
      // }
      this.lastCallSRAL[this.frameAttivo2] = '';

      accentra = true;
    }

    if (r.additionalLayer) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato additional layer', this.NumeroFrame, r.additionalLayer.currentValue);
      this.additionalLayer2 = r.additionalLayer.currentValue;

      // this.additional_Layer.disegnaAddLayers(this);
      accentra = true;
    }

    if (r.additionalLayerDiretto) {
      if (r.additionalLayerDiretto.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato additional layer diretto', this.NumeroFrame, r.additionalLayerDiretto.currentValue);
        const al = r.additionalLayerDiretto.currentValue.split('Â§');
        this.additionalLayerDiretto2 = al[0];
        this.additionaLayerTmsMin2 = al[1];
        this.additionaLayerTmsMax2 = al[2];
        this.additionalLayerMisura = al[3];

        // this.additional_Layer.disegnaAddLayers(this);
        this.additional_Layer.disegnaAddLayersDiretto(this);
      }
    }

    if (r.cellaSelezionata) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiata cella selezionata', this.NumeroFrame, r.cellaSelezionata.currentValue);
      this.cellaSelezionata2 = r.cellaSelezionata.currentValue;

      // this.additional_Layer.disegnaAddLayers(this);
      accentra = true;
    }

    if (r.isCheckedAntenne) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato check antenne', this.NumeroFrame, r.isCheckedAntenne.currentValue);
      // if (r.isCheckedAntenne.currentValue === true) {
      //   this.isCheckedAntenne2 = 0;
      // } else {
      this.isCheckedAntenne2 = r.isCheckedAntenne.currentValue;
      // }
      accentra = true;
    }

    if (r.viewLocal) {
      // if (r.viewLocal.currentValue) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'viewLocal', this.NumeroFrame2, r.viewLocal.currentValue);
        if (this.MappaOGrafico2 === 'M') {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiata viewLocal frame ' + this.NumeroFrame, r.viewLocal.currentValue, this.mappaLocaleImpostata);
          // const rr: OlView = r.viewLocal.currentValue;
          /* if (this.mappaLocaleImpostata === false && r.viewLocal.currentValue
            && r.viewLocal.currentValue !== null && r.viewLocal.currentValue !== 'undefined') {
            // if (r.viewLocal.currentValue.viewportSize_) {
              this.viewMappaLocale = r.viewLocal.currentValue;
              this.mappaLocaleImpostata = true;

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata mappa locale', this.NumeroFrame);
              this.controllaImpostazioneMappaAttuale();
            // } else {
            //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista locale strana', r.viewLocal.currentValue);
            // }
          } else {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rinfresco mappa locale', this.NumeroFrame);
            // this.viewMappaLocale = r.viewLocal.currentValue;
            // this.viewMappaAttuale = this.viewMappaLocale;
            // this.map1[this.NumeroFrame2].setView(this.viewMappaAttuale);
          } */
          // this.viewMappaLocale = r.viewLocal.currentValue; TOLTO
          this.controllaImpostazioneMappaAttuale();
        }
      // }
    }

    if (r.centroAttuale && r.centroAttuale.currentValue) {
      // TOLTO PER NUOVA GESTIONE CENTRO
      /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'centroAttuale', this.NumeroFrame2, r.centroAttuale.currentValue);

      // logConsole('Centro attuale', this.NumeroFrame2, r.centroAttuale.currentValue);

      if (r.centroAttuale.currentValue.indexOf(';') > -1) {
        this.centroAttuale2 = r.centroAttuale.currentValue;
        this.centroImpostato = this.centroAttuale2;
        this.centroImpostatoEmit.emit({ daChi: this.NumeroFrame2, funzione: 'OnChanges 8', centro: this.centroImpostato, zoom: this.zoomImpostatoNelFrame });
        const c = this.centroAttuale2.split(';');
        let coord;
        if (c[1] > 200) {
        } else {
          coord = transform([+c[0], +c[1]], 'EPSG:4326', 'EPSG:3857');
        }
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroAttuale2, this.centroImpostato, coord);

        if (this.viewMappaAttuale) {
          this.viewMappaAttuale.setCenter(coord);
        }
        if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null) {
          this.map1[this.NumeroFrame2].getView().setCenter(coord);
        }
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato centro attuale', this.NumeroFrame, this.centroAttuale2);
        this.controllaImpostazioneMappaAttuale();
      }
      */
    }

    if (r.viewGlobal) {
      // if (r.viewGlobal.currentValue) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'viewGlobal', this.NumeroFrame2, r.viewGlobal.currentValue);
        // }

        if (this.MappaOGrafico2 === 'M') {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiata viewGlobal frame ' + this.NumeroFrame, r.viewGlobal.currentValue, this.mappaGlobaleImpostata);
          // const rr: OlView = r.viewGlobal.currentValue;
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiata viewGlobal frame ' + this.NumeroFrame, r.viewLocal.currentValue);
          /* if (this.mappaGlobaleImpostata === false && r.viewGlobal.currentValue &&
            r.viewGlobal.currentValue !== null && r.viewGlobal.currentValue !== 'undefined') {
            // if (r.viewGlobal.currentValue.viewportSize_) {
              this.viewMappaGlobale = r.viewGlobal.currentValue;
              this.mappaGlobaleImpostata = true;

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata mappa globale', this.NumeroFrame, this.viewMappaGlobale);
              this.controllaImpostazioneMappaAttuale();
            // } else {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista globale strana', r.viewGlobal.currentValue);
            // }
          } else {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rinfresco mappa globale', this.NumeroFrame);
            // this.viewMappaGlobale = r.viewGlobal.currentValue;
            // this.viewMappaAttuale = this.viewMappaGlobale;
            // this.map1[this.NumeroFrame2].setView(this.viewMappaAttuale);
          } */
          // this.viewMappaGlobale = r.viewGlobal.currentValue; TOLTO
          this.controllaImpostazioneMappaAttuale();
        }
      // }
    }

    if (r.overviewZoom) {
      if (r.overviewZoom.currentValue !== undefined) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'overViewZoom', this.NumeroFrame, r.overviewZoom.currentValue);
        // }

      // if (r.overviewZoom.currentValue && this.MappaOGrafico2 === 'M') {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato overviewZoom frame', this.NumeroFrame, r.overviewZoom.currentValue);
          // if (r.overviewZoom.currentValue) {

        this.overviewZoom2 = r.overviewZoom.currentValue;
        this.checkOverView(this.overviewZoom2);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata overview/zoom', this.NumeroFrame);
        this.controllaImpostazioneMappaAttuale();
        // }
        // }
        this.gestisceSquareMeters();

        const bbox = this.prendeBBOXSoloValori('r.OverViewZoom');
        // logConsole('OVZ', bbox);

        if (this.overviewZoom2 === true) {
            if (!Number.isNaN(bbox[0]) && !Number.isNaN(bbox[1]) && !Number.isNaN(bbox[2]) && !Number.isNaN(bbox[3])) {
              this.bboxOverview = bbox;
              // logConsole('Imposto bbox overview', this.NumeroFrame2, 'r.overViewZoom');
              this.bboxImpostatoOverView.emit(bbox);
              ExternalUtilities.bboxMaschera[this.NumeroFrame2] = bbox;
              // logConsole('BBoxO', bbox);
            }
          // }
        } else {
          if (bbox) {
            if (!Number.isNaN(bbox[0]) && !Number.isNaN(bbox[1]) && !Number.isNaN(bbox[2]) && !Number.isNaN(bbox[3])) {
              this.bboxZoom = bbox;
              this.bboxImpostatoZoom.emit(bbox);
              ExternalUtilities.frameZoomSpostato = this.NumeroFrame2;
              ExternalUtilities.bboxMaschera[this.NumeroFrame2] = bbox;
              // logConsole('BBoxZ', bbox);
            }
          }
        }

        if (this.eseguitoInProgetto2 === true) {
          logConsole('Emit coordinate da frame verso progetto 1: ', bbox);
          const pass = this.sistemaCoordinate(bbox, '4326');
          this.bboxEmit.emit(pass);
        }
      }
    }

    if (r.viewAs && r.viewAs.currentValue) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato overviewZoom frame', this.NumeroFrame);
      // if (r.overviewZoom.currentValue) {
      this.viewAs2[this.NumeroFrame2] = r.viewAs.currentValue;
      // alert('Lettura view as: ' + this.viewAs2[this.NumeroFrame2]);

      switch (+this.viewAs2[this.NumeroFrame2]) {
        case 1:
          this.clusterType = 'None';
          break;
        case 2:
          this.clusterType = 'Cluster';
          break;
        case 3:
          this.clusterType = 'Mosaic';
          break;
        }
      // }
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'viewAs', this.viewAs2[this.NumeroFrame2], this.clusterType);

      accentra = true;
    }

    if (r.overlay) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Overlay: ', this.NumeroFrame2, r.overlay.currentValue);

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato overviewZoom frame', this.NumeroFrame);
      // if (r.overviewZoom.currentValue) {
      this.overlay2 = r.overlay.currentValue;
      // logConsole('Overlay impostato: ' , this.overlay2);

      if (this.measureData2 !== undefined) {
        this.overlayName = ExternalUtilities.PrendeNomeMisuraDaCodice(this.overlay2, this.measureData2, 'Frame OnChange 1. Frame ' + this.NumeroFrame2);

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Overlay codice: ', this.NumeroFrame2, r.overlay.currentValue);
      }
      // }

      accentra = true;
    }

    if (r.overlayCluster && r.overlayCluster.currentValue !== undefined) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato Overlay cluster', r.overlayCluster.currentValue);

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato overviewZoom frame', this.NumeroFrame, r.overlayCluster.currentValue);
      // if (r.overviewZoom.currentValue) {
      this.overlayCluster2 = r.overlayCluster.currentValue;
      // }

      accentra = true;
    }

    if (r.timeFilter) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'timeFilter', r.timeFilter.currentValue);
      // }

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato timeFilter frame', this.NumeroFrame);
      // if (r.overviewZoom.currentValue) {
      let timeMode = '';

      if (r.timeFilter.currentValue === 1) {
        this.timeFilter2 = 'All';
        timeMode = 'ALL';
      } else {
        if (r.timeFilter.currentValue === 2) {
          this.timeFilter2 = 'Time Range';
          timeMode = 'SELECTED';
        } else {
          if (r.timeFilter.currentValue === 3) {
            this.timeFilter2 = 'Fixed Seconds';
            timeMode = 'FIXED';
          } else {
            if (r.timeFilter.currentValue === 4) {
              this.timeFilter2 = 'Selected Activity';
              timeMode = 'ACTIVITY';
            }
          }
        }
      }
      
      // logConsole('TIME MODE: ', timeMode);

      this.timeModePerPausa = timeMode;
      // }

      this.datiPerPausa = {
        autoRunAttivo: this.modalitaRealTimeAttiva2,
        timeMode: this.timeModePerPausa
      }
      // // logConsole('Dati per pausa 2: ', this.datiPerPausa);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati per pausa *2*', this.NumeroFrame2, this.datiPerPausa);

      accentra = true;
    }

    if (r.designInfo) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato overviewZoom frame', this.NumeroFrame);
      // if (r.overviewZoom.currentValue) {
      this.designInfo2 = r.designInfo.currentValue;
      // }
    }

    if (r.MappaOGraficoTutti) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'MappaOGraficoTutti', this.NumeroFrame2, r.MappaOGraficoTutti.currentValue);

      this.MappaOGraficoTutti2 = r.MappaOGraficoTutti.currentValue;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, this.MappaOGrafico2Tutti);
    }

    if (r.permessiDataView) {
      if (r.permessiDataView.currentValue && r.permessiDataView.currentValue.length > 0) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Permessi Data VIEW:', r.permessiDataView.currentValue);

        this.datiTipiFrame = new Array();
        this.Utils.datiTipiFrameTutti.forEach(element => {
          let ok = false;
          r.permessiDataView.currentValue.forEach(element2 => {
            if (element2.NAME === element.id) {
              ok = true;
            }
          });
          if (ok) {
            this.datiTipiFrame.push(element);
          }
        });
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista Data VIEW:', this.datiTipiFrame);
        // }
      }
    }

    if (r.datiActivitySets && r.datiActivitySets.currentValue) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'datiActivitySets', r.datiActivitySets.currentValue);
      // }

      this.datiActivitySet2 = r.datiActivitySets.currentValue;
      // if (!this.Activity2 || this.Activity2 === -1) {
      //   this.Activity2 = 1;
      // }
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'datiActivitySets', this.datiActivitySet2, this.Activity2);

      if (this.datiActivitySet2[this.Activity2] && this.datiActivitySet2[this.Activity2].NAME)  {
        ///// this.act_set = this.datiActivitySet2[this.Activity2].NAME;
        ///// if (this.debug2 === true) {
        /////   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Setto act_set 1', this.act_set);
        ///// }
      }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiActivitySet2);
    }

    if (r.ActivitySetNamePassato && r.ActivitySetNamePassato.currentValue && (!this.act_set || this.act_set === '' || 
      (this.act_set && this.act_set !== r.ActivitySetNamePassato.currentValue))) {
      if (r.ActivitySetNamePassato.currentValue.NAME) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ActivitySetName', r.ActivitySetNamePassato.currentValue);

        ///// this.act_set = r.ActivitySetNamePassato.currentValue[this.Activity2].NAME;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista Activity Set Name', this.datiActivitySet2);
        this.act_set_originale = r.ActivitySetNamePassato.currentValue.NAME;
        // logConsole('ACT SET 1', r.ActivitySetNamePassato.currentValue);
        this.act_set = r.ActivitySetNamePassato.currentValue.NAME;
        // logConsole('act_set 2', this.act_set);
        // alert(this.act_set);
        this.datiActivitySet2.forEach(element => {
          if (element.NAME === this.act_set) {
            this.act_id2 = element.ID;
            this.act_set_id2 = element.SET_ID;
          }
        });
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act set id', this.act_set_id2);
        // this.planimetry.caricaPiantina(this);

        // const tm = setTimeout(() => {
        //   clearTimeout(tm);

        accentra = true;
          // }, 1500);
      }
    }

    if (r.ActivitySetIDPassato && r.ActivitySetIDPassato.currentValue) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ActivitySetID', r.ActivitySetIDPassato.currentValue);
      // }
      this.act_set_id = r.ActivitySetIDPassato.currentValue;

      accentra = true;
    }

    if (r.ActivityName && r.ActivityName.currentValue && r.ActivityName.currentValue !== null) {
      // logConsole('Activity Name al frame', this.NumeroFrame2, r.ActivityName.currentValue);

      if (this.eseguitoInProgetto2 && this.tipoFrameProgetto2 === 'TP') {
        // logConsole('ACT SET 2', r.ActivityName.currentValue);
        this.act_set = r.ActivityName.currentValue;
        // logConsole('act_set 3', this.act_set);
        
        // // logConsole('Activity Name al frame. Impostato', this.act_set);
      } else {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ActivityName', r.ActivityName.currentValue);

        this.giaDisegnataStruttura[this.NumeroFrame2] = false;

        // if (this.NumeroFrame === 2) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio activity name set (Frame ' + this.NumeroFrame + '/' + this.frameAttivo2 + ')', r.ActivityName.currentValue);
        // }
        if (r.ActivityName.currentValue === environment.stringaLatestSelection
          || r.ActivityName.currentValue === environment.stringaAll) {
          if (r.ActivityName.currentValue === environment.stringaLatestSelection) {
            this.ActivityName2 = ''; // r.ActivityName.currentValue;
          } else {
            this.ActivityName2 = r.ActivityName.currentValue;
          }
          // **// this.act_set = r.ActivityName.currentValue;

          let confronto = this.act_set;
          if (confronto && confronto.NAME) {
            confronto = confronto.NAME;
          }

          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act Set:', this.NumeroFrame, this.act_set);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'datiActivitySet2', this.datiActivitySet2);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confronto:', confronto);

          if (this.datiActivitySet2 && this.datiActivitySet2 !== 'empty') {
            this.datiActivitySet2.forEach(element => {
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, '*' + element.NAME + '*', '^' + this.act_set + '^');
              if (element.NAME === confronto) {
                this.act_set_id = element.ID;
              }
            });
          }

          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity Set id:', this.NumeroFrame, this.act_set_id);

          accentra = true;
        } else {
          if ((r.ActivityName.currentValue.NAME !== undefined && r.ActivityName.currentValue.NAME !== null) ||
                r.ActivityName.currentValue === 'empty') {
              if (r.ActivityName.currentValue === 'empty') {
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulito activity set del frame' + this.NumeroFrame);
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity Name 5:', this.NumeroFrame, 'Vuoto');
                this.ActivityName2 = '';
                // **// this.act_set = '';
                if (this.strutturaClick) {
                  this.strutturaClick.geo_act_set_name = '';
                }
              } else {
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity Name 6:', this.NumeroFrame, r.ActivityName.currentValue.NAME);
                this.ActivityName2 = r.ActivityName.currentValue.NAME;
                // **// this.act_set = r.ActivityName.currentValue.NAME;
              }

              /* let confronto = this.act_set;
              if (confronto && confronto.NAME) {
                confronto = confronto.NAME;
              }

              if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Act Set:', this.NumeroFrame, this.act_set);
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'datiActivitySet2', this.datiActivitySet2);
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Confronto:', confronto);
              }

              this.datiActivitySet2.forEach(element => {
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, '*' + element.NAME + '*', '^' + this.act_set + '^');
                if (element.NAME === confronto) {
                  this.act_set_id = element.ID;
                };
              }); */
              // logConsole('ACT SET 3', r.ActivityName.currentValue);
              if (r.ActivityName.currentValue.ID) {
                this.act_set_id = r.ActivityName.currentValue.ID;
              }
              if (r.ActivityName.currentValue.NAME) {
                this.act_set = r.ActivityName.currentValue.NAME;
              }
              // logConsole('act_set 1', this.act_set);
              this.act_set_originale = this.act_set;
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity Name 2:', this.NumeroFrame, this.act_set_id);

              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity Set:', this.NumeroFrame, this.act_set);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity Set id:', this.NumeroFrame, this.act_set_id);

              accentra = true;

              // if (!this.Utils.giaPresoCentro[this.NumeroFrame]) {
              if (this.ConnessioneStabilita === 'OK' && this.MappaOGrafico2 === 'M' && (!this.staCambiandoFrame || !this.map1[this.NumeroFrame2])) {
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prendo centro frame ' + this.NumeroFrame);
                this.Utils.giaPresoCentro[this.NumeroFrame] = true;

                this.loadCsv('onChanges');
              }
              // }
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nuovo ActivityName2:', this.ActivityName2);
          }
        }
      }
    }

    if (r.tmsSelezionatoPerGrafico && r.tmsSelezionatoPerGrafico.currentValue) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS cambiato per grafico:', this.NumeroFrame, r.tmsSelezionatoPerGrafico.currentValue, this.MappaOGrafico2);

      this.tmsSelezionatoPerGraficoMem = r.tmsSelezionatoPerGrafico.currentValue;
      const campi = r.tmsSelezionatoPerGrafico.currentValue.split('§');
      if (campi && campi[1] && campi[1] !== '') {
        this.strutturaClick = JSON.parse(campi[1]);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato valore da cambiare per il grafico su frame ' + this.NumeroFrame + ': ',
        //             r.tmsSelezionatoPerGrafico.currentValue);
        /* if (campi[2] !== 'empty grid') {
          this.eventiPerGrafico = JSON.parse(campi[2]);
        } else {
          this.eventiPerGrafico = null;
        } */

        // this.act_id = '';
        // if (this.MappaOGrafico2 === 'MC') {
        // this.act_id = this.strutturaClick.geo_act_name; //  + ' - ';
        // this.planimetry.caricaPiantina(this);
        // }

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.strutturaClick);
        // this.disegnaChart(campi[0]);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Richiamo accentratore dopo click su mappa', this.NumeroFrame, this.fattoClickSuMappa, this.MappaOGrafico2);
        if (this.MappaOGrafico2 === 'MC' || this.MappaOGrafico2 === 'PS' || this.MappaOGrafico2 === 'M') {
          accentra = true;
        }
      }
    }

    if (r.tabSelezionato) {
      this.tabSelezionato2 = r.tabSelezionato.currentValue;
    }

    if (r.nuoviDatiPerCambioFrame) {
      if (r.nuoviDatiPerCambioFrame.currentValue) {
        /* const nuoveMisure = r.nuoviDatiPerCambioFrame.currentValue.Measure[this.frameAttivo];
        this.Measure = JSON.parse(JSON.stringify(nuoveMisure));
        // this.scriveValoriMisure();
        if (this.NumeroFrame === 3) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nuove misure arrivate: ', this.NumeroFrame, this.frameAttivo, nuoveMisure);
        } */
      }
    }

    if (r.Measure) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Measure passate al frame', this.NumeroFrame2, r.Measure.currentValue);
      // }

      this.Measure = r.Measure.currentValue;
      // logConsole('Misure emittate', this.Measure, this.modificaChart);
      // logConsole('Misure arrivate', this.NumeroFrame2, this.Measure, this.Measure.length);

      // logConsole('Misure passate al frame', this.Measure);

      // if (this.NumeroFrame === 9) {
      //  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiate misure frame ' + this.NumeroFrame, r.Measure.currentValue);
      // }
      // this.scriveValoriMisure();
      const array = this.prendeMisurePerLegenda();
      this.legendaComponent.disegnaLegenda(this, array, false);

      if (this.modificaChart) {
        accentra = true;
      }
    }

    /* if (r.view2) {
      if (r.view2.currentValue) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiata view frame ' + this.NumeroFrame, r.view2.currentValue);
        // const vLocal: OlView = JSON.parse(JSON.stringify(r.view2.currentValue));
        // this.viewLocal = vLocal;
        this.redrawComponente();
        this.setView();
      }
    } */

    if (r.calcolaCentro) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'calcolaCentro 1', this.NumeroFrame2, r.calcolaCentro.currentValue,
          this.ConnessioneStabilita, this.MappaOGrafico2, this.dashboardAttiva2);
      // }

      if (this.ConnessioneStabilita === 'OK') {
        if (this.MappaOGrafico2 === 'M') {
          // SISTEMATO COSI' PER FAR FUNZIONARE TUTTO
          // this.lastLoadCsv = '';
          this.loadCsv('onChanges 2');
          return;

          // SISTEMATO COSI' PER FAR FUNZIONARE TUTTO
          if (this.eseguitoInProgetto2 === true) {
            // this.lastLoadCsv = '';
            this.loadCsv('');
            return;
          }
          if (this.Utils.premutoReposition === true) {
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.Utils.premutoReposition = false;
            }, 3000);
            // if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Calcola centro 2');
            // }
            if (this.dashboardAttiva2) {
              /* this.mappaVisibile = false;
              this.map1[this.NumeroFrame2]= undefined;
              this.viewMappaAttuale = undefined;
              this.viewMappaGlobale = undefined;
              this.mappaGlobaleImpostata = false;
              this.viewMappaLocale = undefined;
              this.mappaLocaleImpostata = false;
              this.currZoom = -1; */

              const tm = setTimeout(() => {
                clearTimeout(tm);
                this.Utils.tmsSelezionato = undefined;
                this.Utils.tmsInizio = undefined;
                this.Utils.tmsFine = undefined;
                this.Utils.tmsSelezionatoStringa = undefined;
                // this.Utils.rangeSelezionato[this.frameAttivo][this.NumeroFrame] = undefined;
              }, 10);

              // this.creataMappa = false;
            }

            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Load csv');
            // this.lastLoadCsv = '';
            this.loadCsv('');
            // // this.accentratore(true);
          } else {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Reposition', this.frameAttivo, this.NumeroFrame);
            // this.accentratore(true);
          }
        }
      }
    }

    if (r.isVisibileBar) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Barra visibile', this.NumeroFrame2, r.isVisibileBar.currentValue);
      // }
      if (r.isVisibileBar.currentValue === true) {
        this.barraImpostataAperta = true;
        this.dimeBarraAperta = this.dBarraAperta;
        this.barraAperta = true;
      } else {
        this.barraImpostataAperta = false;
        this.dimeBarraAperta = this.dBarraChiusa;
        this.barraAperta = false;
      }
      this.menuframes = false;
      this.barraNuovaAperta = false;

      // logConsole('Menu aperto', this.menuAperto2, this.barraImpostataAperta, this.dimeBarraAperta);
      // logConsole('dime 1', this.dimeBarraAperta);

      // alert('Barra visibile ' + this.barraImpostataAperta);
    }

    if (r.isSyncTms) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Is Sync Tms:', this.NumeroFrame, r.isSyncTms.currentValue);
      this.isSyncTms2 = r.isSyncTms.currentValue;
    }

    if (r.barraAperta) {
      this.calcolaDimeBarra();
    }

    if (r.countHistogram) {
      this.countHistogram2 = r.countHistogram.currentValue;
    }

    if (r.slaValue) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'slaValue', this.NumeroFrame2, r.slaValue.currentValue);

      this.slaValue2 = r.slaValue.currentValue;
      this.slaValueName = this.slaValue2.NAME;

      // logConsole('Cambio sla', this.NumeroFrame2, this.slaValue2);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sla Value modificato. Frame ' + this.NumeroFrame, this.slaValue2);
    }

    if (r.measureData) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Frame Measures:', r.measureData);
      // if (r.measureData.currentValue) {
      this.measureData2 = r.measureData.currentValue;

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'measureData2', this.measureData2);
    
      if (this.overlay2 !== undefined) {
        this.overlayName = ExternalUtilities.PrendeNomeMisuraDaCodice(this.overlay2, this.measureData2, 'Frame OnChange 2. Frame ' + this.NumeroFrame2);
      }
      
      // this.scriveValoriMisure();
      const array = this.prendeMisurePerLegenda();
      this.legendaComponent.disegnaLegenda(this, array, false);
      // }
    }

    // let puliziaComponenti = false;

    /* if (r.refreshMaschera) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh maschera', this.NumeroFrame);
      puliziaComponenti = true;
    } */

    if (r.refreshDaTasto) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisco il frame ' + this.NumeroFrame2 + ' e lo rinfresco. Frame attivo: ', this.frameAttivo2)

      // this.lastCallCrossTab[this.NumeroFrame2] = '';
      // logConsole('Refresh frame', this.NumeroFrame2, this.frameAttivo2);

      // if (this.frameVisible2) {
        this.puliziaComponent.pulisceFrame(this, this.frameAttivo2, true);

        this.refreshaLaMaschera();
      // }

      // accentra = true;

      // puliziaComponenti = true;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rinfresco le maschere', this.NumeroFrame);
  
      // accentra = true;
    }

    if (r.slaGroup) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'slaGroup Map:', r.slaGroup.currentValue);
      this.slaGroup2 = r.slaGroup.currentValue;
    }

    if (r.slaName) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'slaName', r.slaName.currentValue);
      // }

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'slaName frame :', this.NumeroFrame, r.slaName.currentValue);
      this.slaName2 = r.slaName.currentValue;
    }

    /* if (r.mapName && r.mapName !== undefined) {
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapName', r.mapName.currentValue);
      }

      this.impostazioni.mapName = r.mapName.currentValue;
    } */

    if (r.refresh) {
      // logConsole('Refresh', this.NumeroFrame2);
      if (this.MappaOGrafico2 === 'M') {
        /* this.lastCallClusterGrid[this.NumeroFrame2] = '';
        this.lastCallLayerGeometry[this.NumeroFrame2] = '';

        this.lastCallPath[this.NumeroFrame2] = '';
        this.lastCallPath2[this.NumeroFrame2] = '';
        this.lastCallPath3[this.NumeroFrame2] = '';
        this.lastCallPath4[this.NumeroFrame2] = '';
        this.lastCallPathSC[this.NumeroFrame2] = '';
        this.lastCallSartPosition[this.NumeroFrame2] = '';
        this.lastCallSchedSel[this.NumeroFrame2] = ''; */

        /* this.puntoSelezionato[this.NumeroFrame2] = '';
        this.pathComponent.pulisceAppoggi(this);
        this.mosaicGrid.pulisceAppoggi(this);
        this.clusterGrid.pulisceAppoggi(this);
      
        this.redrawComponente('OnChange Refresh', this.frameAttivo2);

        accentra = false;
        return; */

          /* if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2].getView()) {
            let centro = this.bboxImpostataNelFrame;
            if (centro) {
              logConsole('Refresh mappa', this.NumeroFrame2, centro);
            }

            setTimeout(() => {
              this.impostaPosizioneSchermata(centro, false, "Refresh1", true, true);
            }, 1000);
          } */
      } else {
        // logConsole('Refresh Altro', this.NumeroFrame2);
        // logConsole('refresh frame', this.NumeroFrame2, r.refresh.currentValue);
        const accentra2 = this.refreshaDopoOnChange('r.Refresh');
        if (accentra2) { accentra = true; }
        accentra = true;
      }
    }

    if (r.mapType) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'r.mapType.', r.mapType.currentValue);

      if (r.mapType.currentValue !== undefined && this.MappaOGrafico2 === 'M') {
        this.mapType2 = r.mapType.currentValue;

        // logConsole('Tipo mappa impostato', this.NumeroFrame2, this.mapType2);

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'r.mapType. Cambiato tipo mappa: ', this.NumeroFrame, r.mapType.currentValue - 1);

        this.mapTypeName = '';
        this.Utils.mappe.forEach(element => {
          if (element.id === this.mapType2) {
            this.mapTypeName = element.name;
          }
        });

        // logConsole('Tipo mappa impostato, nome', this.NumeroFrame2, this.mapTypeName);

        this.impostazioni.tipoMappa1 = this.mapTypeName;
      }

      this.cambiaTipoMappa('OnChange MapType 1');
    }

    if (r.mapStyleGlobale) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. mapStyleGlobale', r.mapStyleGlobale.currentValue);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. mappa attuale', this.impostazioni.tipoMappa1);
      // }

      this.mapStyleGlobale2 = r.mapStyleGlobale.currentValue;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Settaggio stile mappa globale', this.NumeroFrame, this.mapStyleGlobale2, this.mapTypeLocale);
      if (this.MappaOGrafico2 === 'M') { // } && this.mapTypeLocale === -1) {
        logConsole('Cambio mappa globale', this.NumeroFrame2, this.mapStyleGlobale2);
        // if (this.mapType2 === -1 || this.mapTypeName === environment.stringaGlobalSettingMapStyle) {
          // this.impostazioni.tipoMappa1 = this.Utils.mappe[this.mapStyleGlobale2 - 1].name;
          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. mapStyleGlobale: ', this.NumeroFrame, this.impostazioni.tipoMappa1);
          // }
    
          if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.map1[this.NumeroFrame2] !== undefined) {
            // accentra = true;

            // this.disegnaMappa1(true);
            this.cambiaTipoMappa('OnChange StyleGlobale');
            // this.updateMappa();
          }
        /* } else {
          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. mapStyleGlobale. Lascio la mappa uguale in quanto non Ã¨ impostata globale');
          // }
        } */
      }
    }

    if (r.isVisibleAntenna && r.isVisibleAntenna !== undefined) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato visible antenna: ', this.isVisibleAntenna);

      if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== undefined && this.map1[this.NumeroFrame2] !== null) {
        this.cambiatoAntenne1 = true;
        // this.isCheckedAntenne2 = this.isVisibleAntenna;

        accentra = true;
        // this.updateMappa();
      }
    }

    if (r.isVisibleServingCell && r.isVisibleServingCell !== undefined) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato visible serving cell: ', r.isVisibleServingCell.currentValue);
      // }

      // if (this.map1[this.NumeroFrame2]&& this.map1[this.NumeroFrame2]!== undefined) {
      this.isCheckedServingCell2 = r.isVisibleServingCell.currentValue;

      accentra = true;
        // this.updateMappa();
      // }
    }

    if (r.slaName) {
      if (r.slaName.currentValue) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'slaName', r.slaName.currentValue);
        // }

        this.slaName = r.slaName.currentValue;
        this.slaNameComplete = this.prendeNomeSla(r.slaName.currentValue);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'SlaName onchange:', this.NumeroFrame, r.slaName.currentValue);

        accentra = true;
      }
    }

    if (r.listaEventiDaPassare) {
      if (r.listaEventiDaPassare.currentValue && r.listaEventiDaPassare.currentValue !== null) {
          this.listaEventiDaPassare2 = r.listaEventiDaPassare.currentValue;
          // logConsole('Eventi da passare', this.listaEventiDaPassare2);

          this.listaEventiDaPassareTemp = this.listaEventiDaPassare2;

          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi locali. Arrivata lista eventi: ', this.NumeroFrame2, JSON.parse(this.listaEventiDaPassare2));
          // }

          // if (this.listaEventiDaPassare2 === undefined) {
          //   this.listaEventiDaPassare2 = null;
          // } else {
          // this.listaEventiDaPassareTemp = this.listaEventiDaPassare2;

          // ELIMINATE QUESTE RIGHE PERCHE' QUI NON DEVE IMPOSTARE I VALORI GLOBALI
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi da passare onchange:', this.NumeroFrame, r.listaEventiDaPassare.currentValue);
          /* if (this.listaEventiDaPassare2 !== 'empty grid') {
            this.Utils.eventiSceltiES2 = JSON.parse(this.listaEventiDaPassare2);
          } else {
            this.Utils.eventiSceltiES = '';
          } */
          // ELIMINATE QUESTE RIGHE PERCHE' QUI NON DEVE IMPOSTARE I VALORI GLOBALI
          
          this.eventsComponent.disegnaEventsSuMappa(this, 'listaEventiDaPassare');
        // }
      }
    }

    /* if (r.impostaValoriMascheraProgetto) {
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eseguo impostazioni maschera progetto', r.impostaValoriMascheraProgetto.currentValue);
      }

      if (r.impostaValoriMascheraProgetto.currentValue && r.impostaValoriMascheraProgetto.currentValue !== '') {
      // if (r.impostaValoriMascheraProgetto.currentValue === true) {
        // if (this.eseguitoInProgetto22 === true) {
          this.impostaMascheraPerProgetto();
        // }
      // }
      }
    } */

    // this.impostaMascheraPerProgetto();
    // this.applicaModifiche();
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.Utils.fattoQuadrato[this.NumeroFrame2] = false;
    }, 2500);

    if (accentra === true) {
      // Le richieste ravvicinate (es. al cambio pagina gli input passano per uno stato intermedio) vengono
      // raggruppate in una sola, eseguita dopo l'ultima: così si usa lo stato definitivo e non si ricarica più volte.
      // Prima ogni ngOnChanges lanciava l'accentratore dopo 10 ms e quelle successive venivano scartate dal suo limitatore.
      conta('frame: accentratore richiesto da OnChanges', 'frame ' + this.NumeroFrame2);
      if (this.tAccentratoreOnChanges) {
        clearTimeout(this.tAccentratoreOnChanges);
      }
      this.tAccentratoreOnChanges = setTimeout(() => {
        this.tAccentratoreOnChanges = undefined;

        this.accentratore(true, 'OnChanges');

        // if (this.staCambiandoFrame) {
          /* const tm = setTimeout(() => {
            clearTimeout(tm);
            if (this.map1[this.NumeroFrame2]) {
              if (+this.currZoom > -1) {
                // if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto zoom su lista eventi da passare: ', this.currZoom);
                // }

                // this.map1[this.NumeroFrame2].getView().setZoom(+this.currZoom); // TOLTO ZOOM PER TEST
                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  this.getCoord(null, 'accentratore');

                  this.staCambiandoFrame = false;
                }, 100);
              }
            }
          }, 100); */
        // }
      }, 400);
    }
  }

  tAccentratoreOnChanges;

  /* applicaModifiche() {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      this.cdRef.detectChanges();
    }, 1000);
  } */

  /*
  aggiornaPointMeasure(e) {
    const ok = this.controllaSeIlFrameDeveEssereAggiornato();
    if (ok === false) {
      return;
    }

    // if (this.MappaOGrafico2 === 'AE' || this.MappaOGrafico2 === 'PM' && r.DatiPointMeasures !== undefined) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure frame', this.NumeroFrame, this.MappaOGrafico2, e.split('Â§'));
    // }
    if (this.MappaOGrafico2 === 'PM') {
      const j = e.split('Â§');
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, j);
      if (j.length > 1) {
        this.act_id = '';
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity Name 3:', this.NumeroFrame, j[0]);
        // this.ActivityName2 = j[0];
        this.tmsTitle = j[1];

        this.datiPointMeasures = this.pointComponent.elaboraPointmeasure(this, j, this.measureData2);
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.effettuaAutoFitPM = !this.effettuaAutoFitPM;
        }, 100);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiPointMeasures);

        if (this.Utils.globalMeasure) {
          this.datiPointMeasures.DataTable.forEach(element => {
            if (element.measr_code === this.Utils.globalMeasure.measr_code) {
              this.selezionePM = element.ROW_ID;
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata Global Measure', this.NumeroFrame, this.selezionePM);
            }
          });
        }
      } else {
        this.datiPointMeasures = 'empty grid';
      }
      this.impostaPaginaDPM = 0;
    }
    if (this.MappaOGrafico2 === 'AE') {
      const j = e.split('Â§');
      if (j[2].length > 1) {
        this.act_id = '';
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity Name 4:', this.NumeroFrame, j[0]);
        // this.ActivityName2 = j[0];
        this.tmsTitle = j[1];
      }
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity name:', this.ActivityName2);
  }
  */

  gestisceSquareMeters() {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'squareMeters OverView', this.NumeroFrame, this.squareMeters2, this.MappaOGrafico, this.overviewZoom2);
    // }

    if (this.squareMeters2 !== undefined) {
      if (this.MappaOGrafico2 === 'M') {
        let squareMeters = this.squareMeters2;
        if (squareMeters === '<GLOBAL SQUARE SIDE>') {
          squareMeters = this.squareMetersGlobale2;
        }
  
        if (this.overviewZoom2 === true) {
          ExternalUtilities.squareMetersGlobaleOverView = squareMeters;
          this.squareMetersGlobaleOverViewEmit.emit(squareMeters);
        } else {
          if (this.overviewZoom2 === false) {
            // if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'squareMeters Zoom', this.NumeroFrame, this.squareMeters2, this.MappaOGrafico, this.overviewZoom2);
            // }

            ExternalUtilities.squareMetersGlobaleZoom = squareMeters;
            this.squareMetersGlobaleZoomEmit.emit(squareMeters);
          }
        }

        this.accentratore(false, 'SquareMetersM');
      } else {
        if (this.MappaOGrafico2 === 'MG') {
          this.accentratore(false, 'SquareMetersMG');
        }
      }
    }
  }

  continuaCambioTMSSelezionato() {
    if (this.cambioPerRange !== this.vecchioCambioPerRange) {
      if (this.tmsSelezionato !== undefined) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ridisegno path', this.NumeroFrame);

        if (this.MappaOGrafico2 === 'M') {
          this.measuresComponent.disegnaMeasure(this);
          this.pathComponent.disegnaPathClickato(this, this.tmsSelezionato);
          this.pathComponent.disegnaServingCell(this, this.tmsSelezionato);
          this.measuresComponent.disegnaMeasureSample(this, false);
          this.eventsComponent.disegnaEventsSuMappa(this, 'ContinuaCambioTMSSelezionato');
        }

        this.aggiornaTmsSelezionato();
      }
    } else {
      if (this.tmsSelezionato !== undefined) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fatto click su path. Controllo per frame ' + this.NumeroFrame + '. tmsTitle:', this.tmsSelezionato);
        // const tms = this.datePipe.transform(this.tmsSelezionato, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        this.tmsTitle = this.tmsSelezionato;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato tms frame:', this.NumeroFrame, this.tmsSelezionato);

        this.aggiornaTmsSelezionato();
      } else {
        this.tmsTitle = '';
      }
    }
  }

  aggiornaEventiNONPIUUTILIZZATO(e, menoUno, soloAggiornamentoDati) {
    return;

    // menoUno = false;
    // const ok = this.controllaSeIlFrameDeveEssereAggiornato();
    // if (ok === false) {
    //   return;
    // }

    if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorna Eventi frame', this.NumeroFrame, this.MappaOGrafico, soloAggiornamentoDati);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore', e);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Meno uno', menoUno);
    }
    // let cp = undefined;
    const j = e.split('Â§');
    // if (menoUno === false) {
    if (this.MappaOGrafico2 === 'AE') {
      this.DatiActivityEventsMem = j;
      // j[2] = JSON.parse(j[2]);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Punto 1', j, j[2]);
      if (j[2].length > 1) {
        this.act_id = '';
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity Name 1:', this.NumeroFrame, e);
        // this.ActivityName2 = j[0];
        this.tmsTitle = j[1];

        // if (menoUno === false) {
          // const tm = setTimeout(() => {
          // clearTimeout(tm);
        if (soloAggiornamentoDati === true) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiornamento dati', this.datiPointActivityEvents);
          // if (!this.datiPointActivityEvents || this.datiPointActivityEvents === 'empty grid') {
            const rit = this.eventsComponent.elaboraEventsNONUTILIZZARE(this, j, this.datePipe,
              false, menoUno);
            // cp = rit['ColumnProperty'];
            if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi 1', rit);
            }
            if (rit && rit !== null && rit['GridProperty']) {
              rit['GridProperty'].rowCount = this.righeTotaliEventi;
            }
            if (rit !== undefined && rit['DataTable'] !== undefined && rit['DataTable'] !== null && rit['DataTable'].length > 0) {
              this.datiPointActivityEvents = rit;
              this.testoDettaglioEventi = '';
            } else {
              this.datiPointActivityEvents = 'empty grid';
              this.testoDettaglioEventi = '';
            }
          /* } else {
            const rit = this.eventsComponent.elaboraEventsNONUTILIZZARE(this, j, this.datePipe, false, menoUno);
            if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi 2', rit);
            }
            if (rit !== undefined && rit !== null && rit['GridProperty']) {
              rit['GridProperty'].rowCount = this.righeTotaliEventi;
            }
            if (rit !== undefined && rit['DataTable'] && rit['DataTable'] !== null && rit['DataTable'] !== 'empty grid') {
              this.datiPointActivityEvents.DataTable = JSON.parse(JSON.stringify(rit['DataTable']));
              this.testoDettaglioEventi = '';
            } else {
              this.datiPointActivityEvents = 'empty grid';
              this.testoDettaglioEventi = '';
            }
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, rit);
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiornamento dati', this.datiPointActivityEvents);
          } */
        } else {
          // if (!this.datiPointActivityEvents || this.datiPointActivityEvents === 'empty grid') {
            if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi 2.5: Elaboro events');
            }
            const rit = this.eventsComponent.elaboraEventsNONUTILIZZARE(this, j, this.datePipe,
              false, menoUno);
            // cp = rit['ColumnProperty'];
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, rit);
            if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi 3', rit);
            }
            /* if (rit !== undefined && rit !== null && rit['GridProperty']) {
              rit['GridProperty'].rowCount = this.righeTotaliEventi;
            } */
            if (rit !== undefined && rit['DataTable'] !== undefined && rit['DataTable'] !== null && rit['DataTable'].length > 0) {
              if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi 4', rit['DataTable'].length);
              }
              this.datiPointActivityEvents = rit;
              this.testoDettaglioEventi = '';
            } else {
              if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisco eventi', rit);
              }

              this.datiPointActivityEvents = 'empty grid';
              this.testoDettaglioEventi = '';
            }

            if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Elabora events. Effettuo autofit');
            }
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.effettuaAutoFitAE = !this.effettuaAutoFitAE;
            }, 1000);

          /* } else {
            const rit = this.eventsComponent.elaboraEventsNONUTILIZZARE(this, j, this.datePipe, false, menoUno);
            if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi 3-1', rit);
            }
            if (rit !== undefined && rit !== null && rit['GridProperty']) {
              rit['GridProperty'].rowCount = this.righeTotaliEventi;
            }
            if (rit !== undefined && rit['DataTable'] && rit['DataTable'] !== null && rit['DataTable'] !== 'empty grid') {
              this.datiPointActivityEvents.DataTable = JSON.parse(JSON.stringify(rit['DataTable']));
              this.testoDettaglioEventi = '';
            } else {
              this.datiPointActivityEvents = 'empty grid';
              this.testoDettaglioEventi = '';
            }
          } */
        }
          // }, 10);
        /* } else {
          if (!this.datiPointActivityEvents) {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi 4', j);
            this.datiPointActivityEvents = this.eventsComponent.elaboraEventsNONUTILIZZARE(this, j, this.datePipe,
              false, menoUno);
          } else {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi 4-1', j);
            const rit = this.eventsComponent.elaboraEventsNONUTILIZZARE(this, j, this.datePipe, false, menoUno);
            this.datiPointActivityEvents.DataTable = JSON.parse(JSON.stringify(rit['DataTable']));
          }
        } */

        // const q = JSON.parse(j[2]).length; // this.datiPointActivityEvents.length;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.datiPointActivityEvents);
        // if (q !== this.quantiEventsVecchi) {
        //   this.quantiEventsVecchi = q;
        //   this.paginaEvents = 0;
        // }
      }
    }
    // }
    if (this.MappaOGrafico2 === 'PM') {
      if (j[2].length > 1) {
        this.act_id = '';
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity Name 2:', this.NumeroFrame, j[0]);
        // this.ActivityName2 = j[0];
        this.tmsTitle = j[1];
      }
    }

    return;

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity name:', this.ActivityName2);
    if (menoUno === true) {
      const j2 = JSON.parse(j[2]);
      let col = '[{';
      col += '"IsEmpty": "false",';
      col += '"dataType": "string",';
      col += '"headerText": "tot_rows",';
      col += '"key": "tot_rows",';
      col += '"hide": "true",';
      col += '"locked": "true",';
      col += '"place": "0"';
      col += '}]';

      const proprieta = [{
        GridName: this.frameName2,
        IsFilterDisplayed: 'N',
        ItemsPerPage: this.Utils.limitPerVirtual,
        ShowColumnSelector: 'true',
        pageable: true,
        reportType: 'Rep',
        rowCount: j2.tot_rows
      }];
      this.righeTotaliEventi = j2.tot_rows;
      const strutt = {
        ColumnProperty: JSON.parse(col),
        DataTable: [j2],
        GridProperty: proprieta
      };
      this.frameName2 = proprieta[0].GridName;
      this.datiPointActivityEvents = strutt;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, strutt);

      // const tm = setTimeout(() => {
        //   clearTimeout(tm);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricarico events da prende events');
      this.datiPointActivityEvents = undefined;
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Ricarico events da prende eventi 1', this.NumeroFrame);
      }
      this.lastCallCrossTab[this.frameAttivo2] = '';
      this.eventsComponent.prendeEvents(this, false, false, false); // , 0
        // }, 100);
      // }, 500);
    }
  }

  creaTabs() {
    let tabs = '';
    for (let i = 0; i < this.indent; i++) {
      tabs += String.fromCharCode(9);
    }
    return tabs;
  }

  convertJSONToTxt(e) {
    e.forEach(element => {
      if (element.items) {
        this.righeJSON += this.creaTabs() + element.text + '\n';
        this.indent++;
        this.convertJSONToTxt(element.items);
      } else {
        if (element.text) {
          this.righeJSON += this.creaTabs() + element.text + '\n';
        }
      }
    });
    this.indent--;
  }

  refreshaLaMaschera() {
    // if (this.debug2) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh maschera', this.NumeroFrame2, this.map1[this.NumeroFrame2], this.viewMappaAttuale);
    // }

    const tm = setTimeout(() => {
      clearTimeout(tm);
      
      // this.accentratore(true, 'REFRESHA LA MASCHERA');

      if (this.MappaOGrafico2 === 'M') {
        // this.accentratore(true, "REFRESH LA MASCHERA");
        // this.redrawComponente('Refresha la maschera');

        // if (this.map1[this.NumeroFrame2]) {
          // const tm = setTimeout(() => {
          // clearTimeout(tm);
          this.redrawComponente('RefreshaLaMaschera', this.frameAttivo2);

          // this.disegnaMappa1(true, "REFRESHA LA MAPPA");
            // this.updateSizeMappa('RefreshaLaMaschera');

            // this.mappaVisibile[this.NumeroFrame2] = true;
          // }, 1000);
        // }
      }

      if (this.MappaOGrafico2 === 'AE') {
        // let fEventi: any =  localStorage.getItem('eventFilter_' + this.NumeroFrame2 + '_' + this.frameAttivo2);
        // // logConsole('Refresh eventi filtro ', this.NumeroFrame2, fEventi);
        if (this.filtroEventiMemorizzati && this.filtroEventiMemorizzati[this.NumeroFrame2]) {
          const fEventi = this.filtroEventiMemorizzati[this.NumeroFrame2];
          if (fEventi && fEventi !== null) {
            // fEventi = JSON.parse(fEventi);
            this.cambioFiltroEventi(fEventi, 'Refresh');
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh maschera filtro eventi', this.NumeroFrame2, fEventi);
          } else {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh maschera filtro eventi nullo', this.NumeroFrame2, fEventi);
          }
        }
      }

      if (this.MappaOGrafico2 !== 'M') {
        const tt = setTimeout(() => {
          clearTimeout(tt);

          this.accentratore(true, 'RefreshaLaMaschera');
        }, 1500);
      }
    }, 100);
  }

  rinfrescaLaMaschera() {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Faccio il refresh della maschera', this.NumeroFrame2);
    // }
    // ExternalFrameComponent.pulisceCalls(this);

    this.puliziaComponent.pulisceFrame(this, this.frameAttivo2, false);

    this.accentratore(true, 'RinfrescaLaMaschera');
  }

  controllaImpostazioneMappaAttuale() {
    return;

    if (this.MappaOGrafico2 !== 'M') {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo impostazioni. Esco per tipo mappa diverso da M');
      // }
      return;
    }

    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo impostazioni mappa attuale 1', this.NumeroFrame2);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo impostazioni mappa attuale 2', this.viewMappaAttuale);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo impostazioni mappa attuale 3', this.viewMappaGlobale);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo impostazioni mappa attuale 4', this.viewMappaLocale);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo impostazioni mappa attuale 5', this.mappaGlobaleImpostata);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo impostazioni mappa attuale 6', this.mappaLocaleImpostata);
    // }
    let ok = true; // false

    /* if (this.viewMappaAttuale === undefined || this.mappaForzata) {
      this.mappaForzata = false;
      if (this.overviewZoom2 === true) {
        if (this.viewMappaGlobale) {
          if (this.mappaGlobaleImpostata === true) {
            this.viewMappaAttuale = this.viewMappaGlobale;
            if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata vista globale', this.NumeroFrame2, this.viewMappaAttuale);
            }
            ok = true;
          }
        } else {
          this.controllaViewMappaAttualeSeValida(true);
          this.mappaForzata = true;
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato zoom a 10');
          // this.currZoom = 10;
          ok = true;
        }
      } else {
        if (this.overviewZoom2 === false) {
          if (this.viewMappaLocale) {
            if (this.mappaLocaleImpostata === true) {
              this.viewMappaAttuale = this.viewMappaLocale;
              if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata vista locale', this.NumeroFrame2, this.viewMappaAttuale);
              }
              ok = true;
            }
          } else {
            this.controllaViewMappaAttualeSeValida(true);
            this.mappaForzata = true;
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato zoom a 10');
            // this.currZoom = 10;
            ok = true;
          }
        }
      }
    // } else {
    //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista giÃ  impostata', this.NumeroFrame);
    } */

    if (ok === true && this.currZoom > -1) {
      // if (this.map1[this.NumeroFrame2]) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno mappa. Lo deve fare una volta sola: ', this.NumeroFrame);
        // this.componenteCaricato = true;
        // this.creataMappa = false;
        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno Mappa');
        }
        // this.redrawComponente('Aggiorno Mappa');

        // if (this.extent2) {
        //   this.viewMappaAttuale.zoomToExtent(this.extent2);
          // if (r.extent.currentValue.length !== undefined && this.map1[this.NumeroFrame2].getView() !== null && this.map1[this.NumeroFrame2].getView() !== undefined) {
          // this.viewMappaAttuale.fit(this.extent2, this.map1[this.NumeroFrame2].getSize());
        // }
      // }
    } else {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nessun aggiornamento mappa', this.NumeroFrame);
    }
  }

  controllaSeIlFrameDeveEssereAggiornato() {
    // if (this.Utils.clickDaMappa === true) {
    //   return true;
    // }

    // logConsole('ACT SET 4', this.Utils.ActivitySetDelPuntoClickato);
    let act_set = this.Utils.ActivitySetDelPuntoClickato;
    let act_set_frame = this.ActivityName;
    if ((act_set === undefined || act_set === '' || act_set === null) &&
        (act_set_frame !== undefined && act_set_frame !== null)) {
      act_set = act_set_frame['NAME'];
    } else {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Problemi nel settare act_set:', act_set, act_set_frame);
    }

    this.ActivityNameLS_A = '';
    if (act_set_frame === environment.stringaLatestSelection) {
      if (act_set !== undefined) {
        this.ActivityNameLS_A = act_set;
      }
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo aggiornamento:', this.NumeroFrame, act_set_frame, '^' + act_set + '^');

    // if (act_set_frame === undefined || act_set === undefined) {
    if (act_set_frame === undefined) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'act_set_frame undefined', this.NumeroFrame);
      return true;
    }

    if (act_set_frame !== undefined && act_set_frame !== '') {
      if (act_set_frame !== null && typeof(act_set_frame) === 'object') {
        const asf = act_set_frame!['NAME'];
        act_set_frame = asf;
      } else {
        switch (act_set_frame) {
          case environment.stringaLatestSelection:
            break;
          case environment.stringaAll:
            break;
          default:
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, act_set_frame);
            if (act_set_frame !== undefined && act_set_frame !== null && act_set_frame !== '' && act_set_frame !== 'empty') {
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, act_set_frame);
                act_set_frame = JSON.parse(act_set_frame).NAME;
            }
            break;
        }
      }
    }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'act_set_frame', this.NumeroFrame, act_set_frame);

    let ok = false;

    // if (this.NumeroFrame === 5) {
    //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo aggiornamento 2:', this.NumeroFrame, act_set_frame + '->' + act_set,
    //                 this.MappaOGrafico2, this.frameVisible2);
    // }
    if (act_set_frame !== undefined && act_set_frame !== '' &&
      (act_set_frame === act_set || act_set_frame === environment.stringaAll || act_set_frame === environment.stringaLatestSelection
      || (act_set === undefined && this.MappaOGrafico2 !== 'PM' && this.MappaOGrafico2 !== 'AE')
      || (act_set === undefined && this.MappaOGrafico2 === 'MC')
      )) {
      if (this.frameVisible2 === true) {
        ok = true;

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno frame ' + this.NumeroFrame + ': ActSet / PuntoClickato', act_set_frame, act_set, this.MappaOGrafico2 ;
      } else {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Frame non visibile', this.NumeroFrame);
      }
    } else {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiornamento Frame skippato', this.NumeroFrame, act_set_frame, act_set,
      //   environment.stringaAll, environment.stringaLatestSelection, this.MappaOGrafico2 ;
    }

    if (ok === false) {
      // if (this.MappaOGrafico2 === 'M') {
      //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, this.isSyncTms2);
        if (this.isSyncTms2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Forzo aggiornamento', this.NumeroFrame);
          ok = true;
        }
      // }
    }
    ok = true;

    return ok;
  }

  aggiornaTmsSelezionato() {
    if (!this.tmsSelezionato) { 
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS CLICKATO. Esco per tms selezionato vuoto', this.NumeroFrame, this.tmsSelezionato);
      // }

      return; 
    }
    // if (!this.Utils.rangeSelezionato[this.frameAttivo][this.NumeroFrame]) {
    //   ExternalUtilities.messaggioDiErrore(t, 'Please select a tms first');
    //   return;
    // }

    const tm = setTimeout(() => {
      clearTimeout(tm);
      // if (!this.tmsSelezionato || this.tmsSelezionato === null) {
      //   this.tmsSelezionato = this.Utils.tmsSelezionato;
      // }

      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS CLICKATO', this.NumeroFrame, this.tmsSelezionato);
      // }

      const t = new Date(this.tmsSelezionato.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      const tms = this.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'TMS CONVERTITO', this.NumeroFrame, tms);

      // CONTROLLARE E TOGLIERE
      /* if (!this.Utils.rangeSelezionato[this.frameAttivo][this.NumeroFrame] ||
        this.Utils.rangeSelezionato[this.frameAttivo][this.NumeroFrame] === -1) {
        this.Utils.ricalcolaRange(this, tms);
      } */
      // CONTROLLARE E TOGLIERE

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, this.Utils.rangeSelezionato[this.frameAttivo][this.NumeroFrame]);
      // const r = (this.Utils.rangeSelezionato[this.frameAttivo][this.NumeroFrame]).toString().split(';');
      // const r1 = new Date(r[0].replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();
      // const r2 = new Date(r[1].replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime();

      // const r = (this.Utils.rangeSelezionato[this.frameAttivo][this.NumeroFrame]).toString().split(';');

      /* if (ridisegnaPath === true) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ridisegna path', this.NumeroFrame);
        // this.Utils.ricalcolaRange(this, t);
        if (this.MappaOGrafico2 === 'M') {
          this.pathComponent.disegnaPathClickato(this, t);
          this.pathComponent.disegnaServingCell(this, tms);
        }
      } */

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiornamento tms', this.NumeroFrame, tms);
      // logConsole('ACT SET 5', this.Utils.ActivitySetDelPuntoClickato);
      const act_set = this.Utils.ActivitySetDelPuntoClickato;
      if (act_set === environment.stringaAll || act_set === environment.stringaLatestSelection) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ATTENZIONE!!! ACTIVITY SET del click impostata a ', act_set);
      }

      let sla = this.Utils.SlaDelPuntoClickato;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, sla);
      if (sla === environment.stringaGlobalSettingSLA || sla === '<Global Template>') {
        if (this.datiSlaDT && this.datiSlaDT !== 'empty grid') {
          this.datiSlaDT.forEach(element => {
            if (element.ID === this.slaValueGlobale2) {
              sla = element.NAME;
            }
          });
        }
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, sla);
      }

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo se devo aggiornare. Frame', this.NumeroFrame);
      const ok = this.controllaSeIlFrameDeveEssereAggiornato();
      if (ok === false) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Skippo l\'aggiornamento del frame', this.NumeroFrame);
        // return;
      }

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno TMS Selezionato. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);

      if (this.MappaOGrafico2 === 'PM') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno point measures. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        this.pointComponent.prendePointMeasures(this, tms, false, 'AggiornaTmsSelezionato');
      }
      if (this.MappaOGrafico2 === 'TI') {
        // const act_set2 = ExternalUtilities.prendeActivityScelta(t, this.Utils);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno tc run info. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity scelta', act_set2);
        this.ricaricaTcRun = undefined;
        const tm = setTimeout(() => {
          clearTimeout(tm);

          // logConsole('Prende dati tcrun fuori', tms);
          this.ricaricaTcRun = tms;
        }, 100);
        // this.tcRunInfoComponent.prendeDatiTcRun(this, tms);
      }
      if (this.MappaOGrafico2 === 'CM') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cell measures. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          this.cellMeasure.caricaCellMeasure(this, 'AggiornaTMSSelezionato');
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'M2') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cell measures. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          this.mistral_grid.caricaMC(this, 'AggiornaTMSSelezionato');
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'MF') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cell measures. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          this.mistral_flow.caricaMF(this, 'AggiornaTMSSelezionato');
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'MS') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cell measures. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          this.mistral_flow_stat.caricaMFStat1(this, 'AggiornaTMSSelezionato');
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'MQ') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cell measures. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          this.mistral_flow_queue.caricaMQ(this, 'AggiornaTMSSelezionato');
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'MR') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cell measures. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          this.mistral_rbc_ixl.caricaMR(this, 'AggiornaTMSSelezionato');
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'AP') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cell measures. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          this.arfcnPoint.caricaArfcnPoint(this, this.Utils.tmsSelezionato, false, 'RefreshAggiornaTmsSelezionato');
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'PK') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno point cell measures. Frame ' + this.NumeroFrame, this.MappaOGrafico2 ;
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          this.pointCellMeasures.prendePointCellMeasures(this);
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'CD') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cdr_data. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
        this.cdrData.caricaCDRData(this);
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'LA') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cdr_data. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        // clearTimeout(tm);

        this.activities.caricaActivities(this);
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'CV') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cdr_voice. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
        this.cdrVoice.caricaCDRVoice(this);
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'MD') {
        this.measureDFNComponent.disegnaMeasureDFN(this);
      }
      if (this.MappaOGrafico2 === 'MG') {
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.mosaicGrid.disegnaMosaicGrid(this);
        }, 100);
      }
      if (this.MappaOGrafico2 === 'CG') {
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.clusterGrid.disegnaClusterGrid(this);
        }, 100);
      }
      if (this.MappaOGrafico2 === 'PS') {
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.scatterComponent.disegnaScatter(this, false, false);
        }, 100);
      }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, this.Utils.clickDaMappa);
      // if (this.Utils.clickDaMappa === true) {
      if (this.MappaOGrafico2 === 'AE') {
        /* if (this.lastFrameAE !== this.NumeroFrame) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'qui 3');
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricarico events da aggiorna tms 1');
          if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Ricarico events da aggiorna tms 1');
          }
          this.eventsComponent.prendeEvents(this, -2, true);
          // this.eventsComponent.prendeEvents(this, -1, true); EX -2
        } else {
          this.lastFrameAE = -1;
        } */

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Seleziono riga griglia. Frame ' + this.NumeroFrame, this.MappaOGrafico2);
        // this.idSelezionatoAE = -1;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi letti:', this.datiPointActivityEvents);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cerco tms ', tms);

        /* this.idSelezionatoAE = [-1];
        if (this.datiPointActivityEvents) {
          if (this.datiPointActivityEvents.DataTable) {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Effettuo refresh eventi tms', tms);
            this.datiPointActivityEvents.DataTable.forEach(element => {
              // if (!this.idSelezionatoAE || this.idSelezionatoAE === -1) {
                if (element.tms !== null && element.tms.indexOf(tms) > - 1) {
                  if (this.idSelezionatoAE[0] === -1) {
                    this.idSelezionatoAE = new Array();
                  }
                  if (element) {
                    this.idSelezionatoAE.push(element.ROW_ID);
                  }
                }
              // }
            });
          }
          if (this.Utils.listaEventiSE) {
            if (this.Utils.listaEventiSE && typeof(this.Utils.listaEventiSE) === 'string') {
              this.Utils.listaEventiSE = JSON.parse(this.Utils.listaEventiSE);
            }
            this.Utils.listaEventiSE.forEach(element => {
              if (this.idSelezionatoAE[0] === -1) {
                this.idSelezionatoAE = new Array();
              }
              if (element) {
                this.idSelezionatoAE.push(element.ROW_ID);
              }
            });
          }

          if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Righe selezionate AE 1' , this.Utils.listaEventiSE, this.idSelezionatoAE);
          }
        } */

      // }
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Ricarico events da tms aggiornato 21', this.NumeroFrame, this.idSelezionatoAE);
      // }

      // if (this.MappaOGrafico2 === 'AE') {
        /* if (this.datiPointActivityEvents && this.datiPointActivityEvents.DataTable) {
          let ok2 = false;
          this.datiPointActivityEvents.DataTable.forEach(element => {
            if (ok2 === false) {
              const el1 = new Date(element.tms);
              if (el1 >= new Date(tms)) {
                const e = [ element ];
                if (this.lastFrameAE !== this.NumeroFrame) {
                  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Scateno evento events', this.NumeroFrame, e);
                  // this.clickRigaAEv(e);
                }
                ok2 = true;
              }
            }
          });
        } */
        // if (this.lastFrameAE !== this.NumeroFrame) {
          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Ricarico events da tms aggiornato 22', this.NumeroFrame, this.timeFilter);
          // }
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'qui 1');
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricarico events da tms aggiornato 2');
          let ok2 = true;
          if (+this.timeFilter !== 2) {
            if (this.datiPointActivityEvents && this.datiPointActivityEvents.DataTable) {
              this.datiPointActivityEvents.DataTable.forEach(element => {
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element.tms, this.Utils.tmsSelezionato);
                if (element.tms.indexOf(this.Utils.tmsSelezionato) > -1) {
                  ok2 = false;
                }
              });
            }
          }
          if (ok2 === true) {
            // if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Ricarico events da tms aggiornato 23', 
                this.NumeroFrame, this.Utils.tmsSelezionato, this.datiPointActivityEvents, this.Utils.clickSuChart2);
            // }
            this.eventsComponent.prendeListaAgents(this); //  , this.offsetAe // 21/07/2025 per mail 26=706/2025 10:03
    
            if (this.Utils.clickSuChart2 === true) {
              this.eventsComponent.prendeEvents(this, true, false, false); // EX -2
            } else {
              this.eventsComponent.prendeEvents(this, true, false, false); // , -1
            }
          }
        // } else {
          this.lastFrameAE = -1;
        // }

        if (this.Utils.clickSuChart2 === true) {
          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.Utils.clickSuChart2 = false;
          }, 2000);
        }
      }

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno roba. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
      if (this.MappaOGrafico2 === 'PC') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno pareto. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms, this.Measure);
        // this.paretoComponent.pulisceValoriDiAppoggio(this);
        this.paretoComponent.disegnaPareto(this, false, false, 'AggiornaTMS');
      }
      if (this.MappaOGrafico2 === 'AI') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno pareto. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms, this.Measure);
        // this.paretoComponent.pulisceValoriDiAppoggio(this);
        this.areaInfoComponent.disegnaAreaInfo(this);
      }
      if (this.MappaOGrafico2 === 'AR') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno pareto. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms, this.Measure);
        // this.paretoComponent.pulisceValoriDiAppoggio(this);
        this.arfcnComponent.disegnaArfcn(this);
      }
      if (this.MappaOGrafico2 === 'AA') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno pareto. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms, this.Measure);
        // this.paretoComponent.pulisceValoriDiAppoggio(this);
        this.arfcnComponent_am.disegnaArfcn(this);
      }
      if (this.MappaOGrafico2 === 'AH') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno histogram. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms, this.Measure);
        const tm = setTimeout(() => {
          clearTimeout(tm);

          // logConsole('Disegno istogrammi 2', this.NumeroFrame2);
          this.histogramComponent.disegnaHistogram(this, false, false);
        }, 1000);
      }
      if (this.MappaOGrafico2 === 'MC') {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno grafici. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // }
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorna grafici 2');
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          this.graficiComponent.disegnaGrafici(this, false);

          // this.graficiComponent.disegnaSelezioneGrafici(this, this.Utils.tmsSelezionato);
          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegnati grafici. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
          // }
          // }, 100);
      }
      if (this.MappaOGrafico2 === 'PT') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno grafici. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms, this.Measure);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
        //   this.pivotComponent.disegnaPivot(this);
        // }, 100);
      }
      if (this.MappaOGrafico2 === 'ES') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno event summary. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          this.eventsComponent.caricaEventSummary(this);
        // }, 1000);
      }
      if (this.MappaOGrafico2 === 'TC') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno event summary. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Carico TCRUN grid 1')

        this.caricaTcRunGrid('AggiornaTMSSelezionato');
        // }, 1000);
      }
      if (this.MappaOGrafico2 === 'TP') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno event summary. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Carico TCRUN grid Pivot 2 1')
        // }, 1000);
      }
      if (this.MappaOGrafico2 === 'NP') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno event summary. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
        this.caricaNPS();
        // }, 1000);
      }

        // this.Utils.clickDaMappa = false;
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
        //   this.Utils.clickDaMappa = false;
        // }, 5000);
      // } else {
        // this.disegnaSelezioneGrafici(this.Utils.tmsSelezionato);
      // }
      /* if (this.MappaOGrafico2 === 'MC') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno selezione. Frame ' + this.NumeroFrame, this.MappaOGrafico2);
        // GestioneGrafici.t = this;
        // this.graficiComponent.disegnaGrafici(this);
        GestioneGrafici.disegnaSelezione(t, new Date(this.tmsSelezionato).getTime());
        if (this.Utils.ActivitySetDelPuntoClickato === environment.stringaLatestSelection ||
            this.Utils.ActivitySetDelPuntoClickato === environment.stringaAll ) {
          this.Utils.ActivitySetDelPuntoClickato = undefined;
        }
      } */
      if (this.MappaOGrafico2 === 'M') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'tento di disegnare punto selezionato. Frame ', this.NumeroFrame);
        // if ((this.isSyncTms === true && this.Utils.mappaClickata !== this.NumeroFrame)) {

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rimuovo', this.NumeroFrame);
        this.pathComponent.disegnaPathClickato(this, this.tmsSelezionato);
        // if (this.controllaSeIlFrameDeveEssereAggiornato()) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sposto il punto 1:', this.NumeroFrame, this.tmsSelezionato, ExternalUtilities.bboxStringaFisso);
        // }
        this.puntoSelezionatoComponent.disegnaPuntoSelezionato(this, this.tmsSelezionato);
        this.pathComponent.disegnaShowRays(this, this.Utils.tmsSelezionato);
        this.pathComponent.disegnaAgentPosition(this, this.agnGroup2);
        this.pathComponent.disegnaSchedSel(this, this.agnGroup2);

        // this.coordinateCambiate.emit(new Date());
        this.coordinateCambiate.emit(ExternalUtilities.bboxStringaFisso);
        
        // }
        // }
      }
    }, 10);
  }

  prendeNomeSla(s) {
    let ss = '';

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sla:', s);
    if (this.visualizzaNomeSla === true) {
      if (s && s !== '') {
        ss = '[SLA ' + s + ']';
      }
    }

    return ss;
  }

  /* LeggeSLA() {
    if (this.ConnessioneStabilita === '') {
      return;
    }

    this.apiService.getViewData('VIEW_GEO_SLA', '')
    // .map(response => response())
    .subscribe((data: any) => {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Measures return maschera ' + this.NumeroFrame + ':', data.RESULT[0].message.toUpperCase());
      if (data === undefined) { data = null; }
      if (data.RESULT && data.RESULT[0].message.toUpperCase() === 'OK') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sla data:', data.DataTable);
        this.datiSlaDT = data.DataTable;
     } else {
        this.datiSlaDT = 'empty grid';
      }
    }, error => {
      ExternalUtilities.messaggioDiErrore(t, 'Read SLA: ' + error);
    });
  } */

  /* ultimaVoltaScritteMisure = -1;

  scriveValoriMisure() {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaScritteMisure < 1000) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Scrive valori misure. Esco per troppo veloce', this.NumeroFrame2);
  
      return;
    }
    this.ultimaVoltaScritteMisure = ora;

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo i display name delle misure');
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Measure, this.measureData2);
    this.scrittaLine = '';

    if (this.MappaOGrafico2 !== 'M') {
      return;
    }

    // logConsole('Scrive misure. Frame ' + this.NumeroFrame2 + ' Tipo ' + this.MappaOGrafico2);
    let index = 0;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Measure', '*' + this.Measure + '*', typeof(this.Measure));
    if (this.Measure === undefined || this.Measure === null) {
      return;
    }

    // if (ExternalUtilities.isArray(this.Measure)) {
      // if (this.debug2 === true) {
      //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Scrive Misure: Pulisco array misure di destinazione');
      // }
      /* this.Measure.forEach(element => {
        if (element && element === '') {
          this.MeasureDN[index] = '';
        }
        index++;
      }); * /

    // }
    this.MeasureDN = new Array();

    if (ExternalUtilities.isArray(this.Measure) && this.measureData2 && this.Measure) {
      index = 1;

      /*
      const m = new Array();
      m.push('');
      this.Measure.forEach(element => {
        m.push(element);
      });
      this.Measure = JSON.parse(JSON.stringify(m));
      * /

      let misureEsterne;
      if (this.MappaOGrafico2 === 'M') {
        misureEsterne = this.misureGlobaliMappa[this.NumeroFrame2];
      } else {
        misureEsterne = ExternalUtilities.misureGlobali;
      }

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cerco per codice', this.Utils.globalMeasure);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Scrive Misure: Scrive valori misure: Measure ', this.MappaOGrafico2 , this.Measure, this.measureData2, misureEsterne);

      // alert('ppp');
      for (let i = 1; i <= this.Measure.length - 1; i++) {
        if (this.Measure[i]) {
          const element2 = this.Measure[i];

          let misura = ExternalUtilities.ritornaMisura(this, element2, this.Utils.globalMeasure, this.Utils.globalMeasureArfcn, misureEsterne, 'Frame 1');
          
          let ok = false;

          if (this.measureData2) {
            this.measureData2.forEach(element3 => {
              if (!ok && element3.CODE === misura) {
                ok = true;
                // logConsole('Misura trovata', misura, element3);
                misura = element3.DISPLAY_NAME;
              }
            });
          }

          if (misura) {
            // logConsole('Misura rilevata ' + i, this.NumeroFrame2, misura);

            if (ok) {
              this.MeasureDN[index] = misura;
            } else {
              this.MeasureDN[index] = misura + ' <span style="color: red">[NOT EXISTS]</span>';
            }

            index++;
          }
        }
      };

      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Scrive Misure: Scrive valori misure: ', this.Measure, this.MeasureDN);
      // }

      let scrittaLine = '';
      // logConsole('Scritta misure: ', this.measureData2);

      for (let i = 1; i <= this.Utils.quanteMisure; i++) {
        let m = this.MeasureDN[i];

        if (m === undefined) { m = ''; }
        if (m === null) { m = ''; }
        if (m !== '') {
          scrittaLine += m + ', ';
        }
      }
      if (scrittaLine.length > 3) {
        scrittaLine = scrittaLine.substring(0, scrittaLine.length - 2);
        /* if (this.showMeasures2) {
          this.scrittaLine += ' Visible';
        } else {
          this.scrittaLine += ' Not Visible';
        } * /
      }
      this.scrittaLine = this.sanitizer.bypassSecurityTrustHtml(scrittaLine);

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Scrive Misure: Scritta finale: ', this.scrittaLine);
    } else {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Scrive Misure: Array non valido: ', this.Measure, this.measureData2);
    }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Descrizione misure frame ' + this.NumeroFrame, this.MeasureDN);
  } */

  /* controllaTipoMappa(tm) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'MappaOGrafico2 Frame ' + this.NumeroFrame + ' Map:', tm);
    switch (tm) {
      case 'CT':
        // setTimeout(_ => this.loadReport1(), 100);
        break;
    }
  } */

  loadCsv(daDove) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Load CSV richiamato da ', daDove, this.NumeroFrame2);
    // }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Bounds', this.NumeroFrame2, this.overviewZoom2);
    if (this.eseguitoInProgetto2 === true) {
    // if (this.eseguitoInProgetto22 === true || this.overviewZoom2 === false) {
      // if (this.NumeroFrame !== undefined && this.MappaOGrafico2 === 'M') {
      if (this.NumeroFrame !== undefined && this.MappaOGrafico2 !== undefined) {
        if (this.lastLoadCsv !== this.NumeroFrame2 + ';' + this.MappaOGrafico2 + ';' + this.act_set) {
          this.lastLoadCsv = this.NumeroFrame2 + ';' + this.MappaOGrafico2 + ';' + this.act_set;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            // 12.4090874, 41.8223068
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_act_set_bounds_sel Ritorno ');

            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato zoom a 10');

            this.currZoom = 11;
            this.currZoomEmit.emit(11);
            
            // Imposto Roma per Fleet
            if (this.eseguitoInProgetto2 === true) {
              ExternalUtilities.csvLetto = 'Frame' + this.NumeroFrame + ';41.9109;12.4818;41.9109;12.4818;'; //  +
            } else {
              ExternalUtilities.csvLetto = 'Frame' + this.NumeroFrame + ';0;0;0;0;'; //  +
            }
            // ExternalUtilities.csvLetto = 'Frame' + this.NumeroFrame + ';-180;-180;-90;90;'; //  +
              // new Date().getTime();
            this.csvEmit.emit(ExternalUtilities.csvLetto);
          }, 500);
        }
      }
      return;
    }

    if (this.Utils.staCaricandoBounds === true) {
      // return;
    }

    // if (this.debug2 === true) {
    //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_act_set_bounds_sel 0', this.NumeroFrame2, this.MappaOGrafico, this.act_set, this.overviewZoom2);
    // }

    if (this.NumeroFrame !== undefined && this.act_set !== undefined && this.act_set !== '' ) {
    // if (this.NumeroFrame !== undefined && this.MappaOGrafico2 === 'M' && this.overviewZoom2 === true && this.act_set !== undefined &&
    //  this.act_set !== '' ) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_act_set_bounds_sel 1', this.NumeroFrame2, this.MappaOGrafico, this.act_set);
      // }

      if (!ExternalUtilities.eseguitoBounds) {
        ExternalUtilities.eseguitoBounds = true;
      }

      const valoriDiBase = ';' + this.dashboardAttiva2 + ';' + this.NumeroFrame2 + ';' +
        this.frameAttivo + ';';

      let valoreRicerca = this.act_set;
      // if (this.eseguitoInProgetto2 === true) {
      //   valoreRicerca = this.agnGroup2;
      // }

      /* if (this.eseguitoInProgetto2 === true) {
        if (this.tipoDataset2 === 1) {
          valoreRicerca = '\'' + this.agnGroup2 + '\'';
        } else {
          valoreRicerca = '\'' + this.actSetNameFM + '\'';
        }
      } else {
        valoreRicerca = this.act_set;
      } */

      const params = {
        cntx_id: this.sessionID2,
        v_act_set_name_list: valoreRicerca
      };
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_act_set_bounds_sel 2', this.NumeroFrame, params);
      // }

      if (this.Utils.lastLoadCsv !== JSON.stringify(params) + ';' + valoriDiBase) {
        this.Utils.lastLoadCsv = JSON.stringify(params) + ';' + valoriDiBase;
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiamata BOUNDS. Frame ', this.NumeroFrame, valoreRicerca);
        // }

        this.Utils.staCaricandoBounds = true;
        this.caricamentoMappaInCorso = true;
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lettura csv', this.act_set, this.act_set_id);
        this.apiService.chiamataPost(this.Utils, 'geo_act_set_bounds__sel', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data2: any) => {
          // const data2 = JSON.parse(data);
          this.caricamentoMappaInCorso = false;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.Utils.staCaricandoBounds = false;
          }, 1000);
          let dataBuono;
          if (data2[0]) {
            dataBuono = data2[0];
          } else {
            if (data2) {
              dataBuono = data2;
            }
          }
          if (dataBuono) {
            ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data);

            const tm = setTimeout(() => {
              clearTimeout(tm);
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.frameAttivo, this.NumeroFrame, data[0], data[0].lat_min.toString());
              // if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'geo_act_set_bounds_sel 3', dataBuono);
              // }

              // this.Utils.posizioneActivity = ExternalUtilities.csvLetto;
              // alert('Imposto pos per cambio frame ' + this.NumeroFrame2 + ': ' + this.Utils.posizioneActivity);

              ExternalUtilities.csvLetto = 'Frame' + this.NumeroFrame + ';' + dataBuono.lat_min.toString() + ';' +
                dataBuono.lng_min.toString() + ';' + dataBuono.lat_max.toString() + ';' +
                dataBuono.lng_max.toString() + ';' +
                new Date().getTime();
              // if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno bounds: ', ExternalUtilities.csvLetto);
              // }

              this.csvEmit.emit(ExternalUtilities.csvLetto);
              return;

              if (dataBuono.start_tms && dataBuono.start_tms !== null) {
                // if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'START TMS Bounds', this.NumeroFrame2, dataBuono.start_tms);
                // }
                this.timeRangeStart.emit(this.datePipe.transform(dataBuono.start_tms, 'yyyy-MM-dd HH:mm:ss.SSS'));
              }
              if (dataBuono.end_tms && dataBuono.end_tms !== null) {
                if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'END TMS Bounds', this.NumeroFrame2, dataBuono.end_tms);
                }
                this.timeRangeStop.emit(this.datePipe.transform(dataBuono.end_tms, 'yyyy-MM-dd HH:mm:ss.SSS'));
              }

              if (dataBuono.agn_code) {
                if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio agn', dataBuono.agn_code);
                }
                ExternalUtilities.stringaAGNoACT = dataBuono.agn_code;
                this.agnPerTcInfo = ExternalUtilities.stringaAGNoACT;
                this.impostaAGNoACT.emit(this.Activity2 + 'Â§' + JSON.stringify(ExternalUtilities.stringaAGNoACT));
                if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'AGN Code Bounds', this.NumeroFrame2, data2[0].agn_code);
                }
              }

              if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Data rilevata su loadCSV', this.NumeroFrame2, dataBuono.start_tms);
              }

              if (dataBuono.start_tms && dataBuono.start_tms !== null &&
                  dataBuono.end_tms && dataBuono.end_tms !== null &&
                  dataBuono.global_start_tms && dataBuono.global_start_tms !== null &&
                  dataBuono.global_end_tms && dataBuono.global_end_tms !== null) {

                const dg1 = new Date(dataBuono.global_start_tms.replace('T', ' ')).getTime();
                // const d2 = new Date(dataBuono.start_tms.replace('T', ' ')).getTime() + 60000;
                const dg2 = new Date(dataBuono.global_end_tms .replace('T', ' ')).getTime();
                const tg1 = this.datePipe.transform(dg1 , 'yyyy-MM-dd HH:mm:ss.SSS');
                const tg2 = this.datePipe.transform(dg2 , 'yyyy-MM-dd HH:mm:ss.SSS');
                const tgs = this.datePipe.transform(dg1 + (dg2 - dg1) , 'yyyy-MM-dd HH:mm:ss.SSS');

                const d1 = new Date(dataBuono.start_tms.replace('T', ' ')).getTime();
                // const d2 = new Date(dataBuono.start_tms.replace('T', ' ')).getTime() + 60000;
                const d2 = new Date(dataBuono.end_tms .replace('T', ' ')).getTime();
                const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS');
                const t2 = this.datePipe.transform(d2 , 'yyyy-MM-dd HH:mm:ss.SSS');

                this.timeRangeStart.emit(t1);
                this.timeRangeStop.emit(t2);
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data[0].start_tms, d2, d1, t1);

                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tmsInizio 1', t1);
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tmsFine 1', t2);

                this.Utils.tmsSelezionato = tgs;
                this.Utils.tmsInizio = tg1;
                this.Utils.tmsFine = tg2;

                if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tms Bounds', this.NumeroFrame2, dataBuono.global_start_tms, tgs, tg1, tg2);
                }

                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  this.Utils.range = (dg2 - dg1) / 2;

                  this.cambioTmsSelezionato.emit(tgs + ';loadCSV');
                  ExternalUtilities.aggiornaTmsStringa(tgs, this.Utils);
                  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.range, this.Utils.tmsSelezionato);
                }, 10);
              }
            }, 1000);
          } else {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, null);
            ExternalUtilities.messaggioDiErrore(this, 'Load csv: ritorno null:\n' + JSON.stringify(params));
          }
        }, error => {
          // ExternalUtilities.messaggioDiErrore(t, error);
        });
      } else {
        this.caricamentoMappaInCorso = false;
      }
    } else {
      if (this.MappaOGrafico2 === 'M' && this.overviewZoom2 === false) {
        if (this.tAttesaCsv) {
          clearInterval(this.tAttesaCsv);
        }
        this.tAttesaCsv = setInterval(() => {
          if (ExternalUtilities.csvLetto !== '') {
            clearInterval(this.tAttesaCsv);
            this.tAttesaCsv = undefined;

            const tm = setTimeout(() => {
              clearTimeout(tm);

              // if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Arrivato il csv', this.NumeroFrame2, this.MappaOGrafico2);
              // }
              this.csvEmit.emit(ExternalUtilities.csvLetto);
            }, 100);
          }
        }, 2500);
      }
    }
  }

  cambioTmsDatcRun(e) {
    let ee;
    if (e.indexOf(';') > -1) {
      ee = e;
    } else {
      ee = e + ';DaTcRun';
    }
    this.cambioTmsSelezionato.emit(ee);
  }

  // staMassimizzando = false;

  massimizza(q) {
    if (this.MappaOGrafico2 === 'M' ||
        this.MappaOGrafico2 === 'MC' ||
        // this.MappaOGrafico2 === 'AH' ||
        this.MappaOGrafico2 === 'PC' ||
        this.MappaOGrafico2 === 'PS') {
      // this.puliziaComponent.pulisceFrame(this, this.frameAttivo2, false);
    }

    if (q === -1) {
      this.massimizzata = false;
      this.Utils.dimensioniFramesModif[this.NumeroFrame] = -1;
    } else {
      this.massimizzata = true;
      this.Utils.dimensioniFramesModif[this.NumeroFrame] = 9999;
    }
    // this.staMassimizzando = true;
    this.maximizedEmit.emit(q);
    // this.updateMappa();
    // this.accentratore(true, 'Massimizza');
  }

  calcolaDimeBarra() {
    if (this.barraImpostataAperta) {
      this.dimeBarraAperta = this.dBarraAperta;
    } else {
      if (this.barraAperta) {
        this.dimeBarraAperta = this.dBarraAperta;
      } else {
        this.dimeBarraAperta = this.dBarraChiusa;
      }
    }

    // logConsole('dime 2', this.dimeBarraAperta);
  }

  postrender = function (t, event) {
    // Tolto perchÃ© lo zoom sulla mappa ingrandisce solo la mappa e non i layers disegnati sopra
    return;

    // const event = t.map1[t.NumeroFrame2].getView();
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t.mousePosition);
    if (t.mousePosition !== null) {
      const pixel = getRenderPixel(event, t.mousePosition);
      const offset = getRenderPixel(event, [
        t.mousePosition[0] + t.radius,
        t.mousePosition[1],
      ]);
      const half = Math.sqrt(
        Math.pow(offset[0] - pixel[0], 2) + Math.pow(offset[1] - pixel[1], 2)
      );
      const context = event.context;
      const centerX = pixel[0];
      const centerY = pixel[1];
      const originX = centerX - half;
      const originY = centerY - half;
      const size = Math.round(2 * half + 1);
      const sourceData = context.getImageData(originX, originY, size, size).data;
      const dest = context.createImageData(size, size);
      const destData = dest.data;
      for (let j = 0; j < size; ++j) {
        for (let i = 0; i < size; ++i) {
          const dI = i - half;
          const dJ = j - half;
          const dist = Math.sqrt(dI * dI + dJ * dJ);
          let sourceI = i;
          let sourceJ = j;
          if (dist < half) {
            sourceI = Math.round(half + dI / 2);
            sourceJ = Math.round(half + dJ / 2);
          }
          const destOffset = (j * size + i) * 4;
          const sourceOffset = (sourceJ * size + sourceI) * 4;
          destData[destOffset] = sourceData[sourceOffset];
          destData[destOffset + 1] = sourceData[sourceOffset + 1];
          destData[destOffset + 2] = sourceData[sourceOffset + 2];
          destData[destOffset + 3] = sourceData[sourceOffset + 3];
        }
      }
      context.beginPath();
      context.arc(centerX, centerY, half, 0, 2 * Math.PI);
      context.lineWidth = (3 * half) / t.radius;
      context.strokeStyle = 'rgba(255,255,255,0.5)';
      context.putImageData(dest, originX, originY);
      context.stroke();
      context.restore();
    }
  };

  creaLayersMappe() {
    /* const key = 'N95WXsBRtupmybB1qixv';

    this.lente = new OlTileLayer({
      title: 'Satellite',
      type: 'base',
      source: new OlXYZ({
        url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
        maxZoom: 20,
        // crossOrigin: '',
      }),
    });
    this.lente.un('postrender', this.postrender);
    this.lente.on('postrender', this.postrender.bind(null, this)); */

    this.layerCartoDb = new OlTileLayer({
      // title: 'CartoDB',
      // type: 'base',
      preload: Infinity,
      visible: true,
      source: new OlXYZ({
        urls: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_3s28_1_57213781ea6594ea79eec43d'],
        // crossOrigin: 'anonymous'
      })
    });

    this.layerOSM = new OlTileLayer({
      // title: 'OSM',
      // type: 'base',
      preload: Infinity,
      visible: true,
      source: new OSM({ 
        url: 'https://tile.osm.org/{z}/{x}/{y}.png',
        // crossOrigin: 'anonymous'
      })
    });

    this.layerSatellite = new OlTileLayer({
      // title: 'OSM',
      // type: 'base',
      preload: Infinity,
      visible: true,
      source: new OSM({ 
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}' ,
        // crossOrigin: 'anonymous'
      })
    });

    this.layerGoogle = new OlTileLayer({
      // title: 'Google',
      // type: 'base',
      visible: true,
      preload: Infinity,
      source: new TileImage({url:
        'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}',
        // crossOrigin: 'anonymous'
        // 'http://maps.google.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i375060738!3m9!2spl!3s' +
        // 'US!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0'
      })

    });

    this.overviewMapControl = new OverviewMap({
      // see in overviewmap-custom.html to see the custom CSS used
      className: 'ol-overviewmap ol-custom-overviewmap',
      layers: [
        this.layerGoogle
      ],
      collapseLabel: '\u00BB',
      label: '\u00AB',
      collapsed: true,
    });

    this.layerStamen = new OlTileLayer({
      // title: 'Stamen',
      // type: 'base',
      preload: Infinity,
      visible: true,
      /* source: new Stamen({ 
        layer: 'terrain'
      }) */
    });
  }

  /* prendeDimeCDR() {
    const d1 = localStorage.getItem(this.userName2 + '_CDRDATA_1_' + this.NumeroFrame2);
    if (d1 === null) {
      this.dimeCDRData1 = 50;
    } else {
      this.dimeCDRData1 = +d1;
    }
    this.dimeCDRData2 = 100 - +d1;

    const v1 = localStorage.getItem(this.userName2 + '_CDRVOICE_1_' + this.NumeroFrame2);
    if (v1 === null) {
      this.dimeCDRVoice1 = 50;
    } else {
      this.dimeCDRVoice1 = +v1;
    }
    this.dimeCDRVoice2 = 100 - +v1;
  } */

  platformType;

  ngOnInit() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.platform);

    this.platformType = this.platform.isBrowser ? 'WEB' : this.platform.ANDROID ? 'ANDROID' : 'ALTRO';
    if (this.platformType === 'ANDROID') {
      this.dBarraAperta = 40;
    } else {
      this.dBarraAperta = 26;
    }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Test log', 'Pippo', this.platformType);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.indirizzoServer);
    /* let d1 = this.datePipe.transform(new Date(), 'dd-MM-yyyy', 'UTC');
    d1 += ' 00:00:00';
    let d2 = this.datePipe.transform(new Date(), 'dd-MM-yyyy', 'UTC');
    d2 += ' 20:00:00';

    this.timeRangeDSFStart2 = d1;
    this.timeRangeDSFStop2 = d2; */

    /* this.mapsAPILoader.load().then(() => {
      try {
        this.geoCoder = new google.maps.Geocoder;
      } catch (e) {

      }
    }); */

    try {
      this.geoCoder = new google.maps.Geocoder();
    } catch (e) {

    }

    // this.Utils.measureDaDisegnare[this.frameAttivo][this.NumeroFrame] = new Array();
    // this.measureDaDisegnareScatter = undefined;
    // this.Utils.altezzaGrafico = new Array();
    // this.Utils.altezzaGraficoScatter = new Array();
    // this.Utils.altezzaGraficoPareto = new Array();
    // for (let i = 0; i <= this.Utils.quanteMisureGrafici; i++) {
      // this.Utils.measureDaDisegnare[this.frameAttivo][this.NumeroFrame].push('');
      // this.Utils.altezzaGrafico.push(0);
      // this.Utils.altezzaGraficoScatter.push(0);
      // this.Utils.altezzaGraficoPareto.push(0);
    // }

    this.datiFrames = new Array();
    for (let i = 1; i <= environment.quantiFrames; i++) {
      const r = { id: i, name: 'Frame ' + i };
      this.datiFrames.push(r);
    }

    this.datiView = new Array();
    for (let i = 1; i <= environment.quantiSottoFrames; i++) {
      const r = { id: i, name: 'Page ' + i };
      this.datiView.push(r);
    }

    this.wmsPuntoSelezionato = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
    this.wmsSMS = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
    this.wmsEvents = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
    this.pathEvents = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
    this.pathLayer = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
    this.pathLayerGeometry = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
    this.pathLayerClickato = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
    this.pathLayerBBOX = ExternalUtilities.creaVettore(environment.quantiFrames, undefined);
    this.wms = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utils.quanteMisure, null);
    this.measureLayer = ExternalUtilities.creaMatrice(environment.quantiFrames, this.Utils.quanteMisure, null);
    /* for (let k = 0; k <= environment.quantiFrames; k++)  {
      this.measureLayer[k] = new Array();
      this.wms[k] = new Array();
      for (let i = 0; i <= this.Utils.quanteMisure + 1; i++) {
        this.measureLayer[k].push(null);
        this.wms[k].push(null);
      }
    } */
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'WMS', this.wms);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Measure Layer', this.measureLayer);
    // }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ngOnInit');
    this.settingsVisibileFlag = false;
    this.calcolaDimeBarra();

    this.creaLayersMappe();

    this.LeggeImpostazioni();

    this.layerScelto = new TileLayer({
      source: new OlXYZ({
        urls: ['https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
               'https://cartodb-basemaps-b.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
               'https://cartodb-basemaps-c.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'],
        // crossOrigin: 'anonymous'
      })
    });

    this.vecchioLayerScelto1 = 1;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Frame type: ', this.frameType2);
    // if (this.frameType2 > -1) {
    //   this.impostazioni.tipoMappa1 = this.Utils.mappe[this.frameType2 - 1].name;
    // }
    // this.impostazioni.layerMappa1 = this.frameType;

    // this.blobImmagine = this.Utils.creaVettore(environment.quantiSottoFrames, null);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.blobImmagine);
  }

  /* setView() {
    if (this.map1[this.NumeroFrame2]) {
      // const mappaGlobale = this.Utils.tornaGlobale(this);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Globale:', mappaGlobale);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto vista su frame ' + this.NumeroFrame, this.viewMappaAttuale);
      this.map1[this.NumeroFrame2].setView(this.viewMappaAttuale);
    }
  } */

  ngAfterViewInit() {
    this.componenteCaricato = true;

    this.creaLayersMappe();
    /* this.redrawComponente('OnInit');
    this.disegnaMappa1(true);

    if (this.eseguitoInProgetto22 === true) {
      this.impostaMascheraPerProgetto();
    } */
  }

  ultimaVoltaIMPP = -1;

  impostaMascheraPerProgetto() {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaIMPP < 5000) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'impostaMascheraPerProgetto. Esco per troppo veloce', this.NumeroFrame2);
  
      return;
    }
    this.ultimaVoltaIMPP = ora;

    // this.redrawComponente();
    // if (this.eseguitoInProgetto22 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'impostaMascheraPerProgetto: Aggiorno valori per maschera progetto', this.NumeroFrame2, this.frameAttivo2, this.tipoFrameProgetto2);

      this.MappaOGrafico2 = '--';
      this.MappaOGrafico2 = '--';
      this.frameAttivo2 = 0;

      // logConsole('Imposta maschera per progetto', this.tipoFrameProgetto2);

      if (this.tipoFrameProgetto2 === 'M') {
        this.styleSize2 = -1;

        const tm = setTimeout(() => {
          clearTimeout(tm);
          
          this.MappaOGrafico2 = 'M';
          this.MappaOGrafico2 = 'M';

          // this.overviewZoom2 = true;
          this.showPlanimetry2 = true;
          this.isCheckedShowPaths2 = true;
          this.isCheckedShowSelectedPaths2 = true;
          this.showRays2 = false;
          this.isCheckedServingCell2 = false;
          // this.isCheckedAntenne2 = 0;
          this.sartPosition2 = true;
          this.viewAs2[this.NumeroFrame2] = 3;
          this.styleSize2 = 3;
          this.clusterType = 'Mosaic';
          this.overlay2 = 'samples';
          this.squareMeters2 = 100;
          this.nomeAntennaDD2 = '';
          this.mosaicStyle = 's_geo_measr_mosaic_samples';

          // this.redrawComponente('Impostazione maschera progetto');

          if (this.eseguitoInProgetto2 === true) { // && this.progettoEsterno2 === 'FleetManager') {
            // Imposta maschera per Fleet Manager
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'impostaMascheraPerProgetto: Imposto maschera per fleet manager');

            this.mappeMS2 = 1;
            this.styleMappa2 = this.mappeMS2;
            // this.mappeMSEmit.emit(this.mappeMS2);

            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Measure);
            this.shownEvents2 = true;
            // this.shownEventsEmit.emit(true);

            this.showMeasures2 = true;
            // this.showMeasuresEmit.emit(true);

            this.showCoverageMeasures2 = false;
            // this.showCoverageMeasuresEmit.emit(true);

            this.showVoiceCallMeasures2 = false;
            // this.showVoiceCallMeasuresEmit.emit(true);

            this.showDataMeasures2 = false;
            // this.showDataMeasuresEmit.emit(true);

            // this.showSamplesMeasures2 = false;
            // this.showSamplesMeasuresEmit.emit(true);

            this.showRays2 = false;
            // this.showRaysEmit.emit(false);

            this.isCheckedServingCell2 = false;
            // this.isCheckedServingCellEmit.emit(false);

            this.cellType2 = JSON.stringify([ {ROW_ID: 1, VALUE_STR: "Active"}, {ROW_ID: 6, VALUE_STR: "NR-PCell"}]);
            // this.cellTypeEmit.emit(this.cellType2);

            this.measureRCM2 = 'global_measure';
            // this.measureRCMEmit.emit(this.measureRCM2);

            this.isCheckedAntenne2 = 1;
            // this.isCheckedAntenneEmit.emit(0);

            this.Measure = ["", "struct_act_name", "", ""];
            // this.measureEmit.emit(this.Measure);

            this.tipoEvento2 = 'L';

            const tm = setTimeout(() => {
              clearTimeout(tm);

              this.listaEventiDaPassare2 = [{"ROW_ID":558,"FOLDER":"MobiAnts","EVENT_TYPE":"MobiantsTcRun.End","DISPLAY_NAME":"MobiantsTcRun.End","CELLULAR_SYSTEM":" ","RECORD_STATE":" ","TOOLS":" ","DESCRIPTION":" ","FILE_TYPE":"MobiAnts","BACKCOLOR":"#FFFFFF","FORECOLOR":"#000000","ICON":"circle","INSERT_TIMESTAMP":"2020-04-14 10:52:42","UPDATE_TIMESTAMP":" "} ];
              this.listaEventiDaPassare2 = JSON.parse(JSON.stringify(this.listaEventiDaPassare2));
              // if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'impostaMascheraPerProgetto: Controllo su lista eventi nulla 1: ', this.listaEventiDaPassare2);
              // }

              if (this.listaEventiDaPassare2 === undefined) {
                if (this.eseguitoInProgetto2 === true) {

                } else {
                  this.listaEventiDaPassare2 = null;
                }
              }

              // logConsole('Misure fuori', this.listaEventiDaPassare2);
              // this.listaEventi.emit(this.listaEventiDaPassare2);

              this.overviewZoom2 = true;
              this.bboxOZ2 = true;

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa globale esistente per passaggio a eseguito in progetto', this.viewMappaGlobale);

              /* if (this.viewMappaGlobale) {
                this.viewMappaAttuale = this.viewMappaGlobale;
              } */
              this.controllaViewMappaAttualeSeValida(false);

              const e: any = true;
              // this.overviewZoomEmit.emit(e);
              // this.bboxOZEmit.emit(e);

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Is checked Antenne: ', this.isCheckedAntenne2);
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Overview/Zoom: ', this.overviewZoom2);
                
              // this.mappaVisibile[this.NumeroFrame2] = true;

              /* let q = 0;
              this.redrawComponente('Accentratore');
              
              const t = setInterval(() => {
                if (this.map1[this.NumeroFrame2]) {
                  clearInterval(t);
  
                  this.gestisceMappaDaAccentratore(true, "Imposta maschera progetto 1");
                } else {
                  q++;
                  if (q > 20) {
                    clearInterval(t);
  
                    // if (this.debug2 === true) {
                      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Non riesco a creare la mappa', this.NumeroFrame2);
                    // }
                  }
                }
              }, 500); */
  
              this.redrawComponente('Imposta Maschera Per Progetto', this.frameAttivo2);
              
              logConsole('Imposta maschera per progetto: fine');

              return;

              // this.accentratore(true);
              this.map1[this.NumeroFrame2] = undefined;

              if (!this.map1[this.NumeroFrame2]!) {
                let q = 0;
                this.redrawComponente('impostaMascheraPerProgetto: Imposta maschera frame ' + this.NumeroFrame2 + ' Pagina ' + this.frameAttivo2, this.frameAttivo2);
                const t = setInterval(() => {
                  if (this.map1[this.NumeroFrame2]) {
                    clearInterval(t);
                    if (this.debug2 === true) {
                      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'impostaMascheraPerProgetto: Finisco', this.NumeroFrame2);
                    }
                    // this.accentratore(true);
                  } else {
                    q++;
                    if (this.debug2 === true) {
                      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'impostaMascheraPerProgetto: Contatore attesa mappa', this.NumeroFrame2, q);
                    }
                    if (q > 20) {
                      clearInterval(t);
                      if (this.debug2 === true) {
                        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'impostaMascheraPerProgetto: Non riesco a creare la mappa', this.NumeroFrame2);
                      }
                    }
                  }
                }, 500);
              } else {
                if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'impostaMascheraPerProgetto: Finisco', this.NumeroFrame2);
                }

                // this.accentratore(true);
              }

            /* const tm = setTimeout(() => {
          clearTimeout(tm);
              this.puliziaComponent.pulisceFrame(this, this.frameAttivo2);

              this.accentratore(true);
            }, 1000); */
          }, 100);
        }

      }, 1000);
    } else {
      if (this.tipoFrameProgetto2 === 'TP') {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'impostaMascheraPerProgetto: Aggiorno valori per maschera progetto', this.NumeroFrame2, this.frameAttivo2, this.tipoFrameProgetto2);

        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.MappaOGrafico2 = 'TP';
          this.MappaOGrafico2 = 'TP';          
        }, 1000);
      }
    }
  }

  /* controlloScala = function(t) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t.scaleType);
    if (t.scaleType === 'scaleline') {
      t.control = new ScaleLine({
        units: 'metric',
      });
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t.control);
      return t.control;
    }
    t.control = new ScaleLine({
      units: 'metric',
      bar: true,
      steps: t.scaleBarSteps,
      text: t.scaleBarText,
      minWidth: 140
    });
    return t.control;
  }

  redrawComponente(daDove) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw da', daDove);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Aggiorno Mappa. Componente caricato: ', this.NumeroFrame2, this.componenteCaricato);


    let centro;
    if (this.bboxImpostataNelFrame) {
      centro = this.bboxImpostataNelFrame;

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw: imposto centro precedente 1', this.NumeroFrame2, this.bboxImpostataNelFrame);
    } else {
      if (this.centroImpostato && this.centroImpostato[0].toString().indexOf('e') === -1 && this.centroImpostato[1].toString().indexOf('e') === -1) {
        centro = this.centroImpostato;

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw: imposto centro precedente 2', this.NumeroFrame2, this.centroImpostato);
      } else {
        centro = [12.4090874, 41.8223068];

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw: Resetto centro', this.NumeroFrame2);
      }
      if (typeof(centro) === 'string') {
        centro = centro.replace('"', '').replace('"', '');
        centro = centro.replace('\'', '').replace('\'', '');
        if (centro.indexOf(',') > -1) {
          centro = centro.split(',');
        } else {
          if (centro.indexOf(';') > -1) {
            centro = centro.split(';');
          }
        }
      }

      if (centro[0] > 200) {
        this.centroImpostato = transform(centro, 'EPSG:3857', 'EPSG:4326');
        centro = this.centroImpostato;
      }
      this.centroImpostato = centro;

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw: imposto centro nuovo', this.NumeroFrame2, centro);
    }

    let zoometto;
    if (this.zoomImpostatoNelFrame) {
      zoometto = this.zoomImpostatoNelFrame;
    } else {
      if (!this.currZoom || this.currZoom === -1) {
        zoometto = 10;
      } else {
        zoometto = this.currZoom;
      }
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw: imposto zoom', this.NumeroFrame2, zoometto);

    // if (!this.viewMappaAttuale) {
      const view = new OlView({
        center: fromLonLat(centro),
        zoom: zoometto
      });
      this.viewMappaAttuale = view;
    // }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prima di Redraw componente', this.NumeroFrame2, this.overviewZoom2);

    // this.redrawComponente2();

    const tm = setTimeout(() => {
          clearTimeout(tm);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eseguo redraw ', daDove);

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'redraw componente', this.NumeroFrame, this.viewGlobal);
      // if (this.MappaOGrafico2 === 'M') {
        // if (this.overviewZoom2) {

      if (!this.impostazioni.tipoMappa1) {
        this.impostazioni.tipoMappa1 = 'CartoDB';
      }

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Creo mappa', this.NumeroFrame2);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Creo mappa. Layer', this.layerCartoDb);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Creo mappa. View', this.viewMappaAttuale, typeof(this.viewMappaAttuale));
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Tipo mappa', this.impostazioni.tipoMappa1);

      let layer;
      // this.creaLayersMappe();
      if (this.impostazioni.tipoMappa1 === 'CartoDB') {
        layer = this.layerCartoDb;
      } else {
        if (this.impostazioni.tipoMappa1 === 'Google') {
          layer = this.layerGoogle;
        } else {
          if (this.impostazioni.tipoMappa1 === 'OSM') {
            layer = this.layerOSM;
          } else {
            if (this.impostazioni.tipoMappa1 === 'Stamen') {
              layer = this.layerStamen;
            } else {
              if (this.impostazioni.tipoMappa1 === 'Satellite') {
                layer = this.layerSatellite;
              } else {
                if (this.impostazioni.tipoMappa1 === 'Magnify') {
                  // layer = this.lente;
                } else {
                  this.impostazioni.tipoMappa1 = 'CartoDB';
                  layer = this.layerCartoDb;
                }
              }
            }
          }
        }
      }

      // }
      // this.map1[this.NumeroFrame2]= undefined;

      // this.mappaVisibile[this.NumeroFrame2] = true;

      // const tm = setTimeout(() => {
          clearTimeout(tm);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Layer impostato:', layer);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Nome mappa:', 'frameM_' + this.NumeroFrame + '_' + this.frameAttivo2);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Mappa:', this.map1[this.NumeroFrame2]);

        let ok = true;
        // try {
          if (!this.map1[this.NumeroFrame2]) {
            // alert('creo mappa');

            this.map1[this.NumeroFrame2] = this.ngZone.runOutsideAngular(() => new OlMap({
              controls: defaultControls().extend([
                // this.controllaScala(this);
                new ScaleLine({
                  units: 'metric'
                })
              ]),
              interactions: defaultInteractions().extend([
                new DragRotateAndZoom()
              ]),
              target: 'frameM_' + this.NumeroFrame + '_' + this.frameAttivo2,
              layers: [layer],
              pixelRatio: 1,
              view: this.viewMappaAttuale
            }));

            // this.map1[this.NumeroFrame2].un('singleclick', this.clickOnMap);
            this.map1[this.NumeroFrame2].on('singleclick', this.inZonaAngular(this.clickOnMap.bind(null, this)));

            // this.map1[this.NumeroFrame2].on('loadstart', this.loadMapStart.bind(null, this));
            // this.map1[this.NumeroFrame2].on('loadend', this.loadMapEnd.bind(null, this));

            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Mappa creata:', this.map1[this.NumeroFrame2]);
          } else {
            this.map1[this.NumeroFrame2].setTarget('frameM_' + this.NumeroFrame + '_' + this.frameAttivo2);
            this.map1[this.NumeroFrame2].setLayers([layer]);
            this.map1[this.NumeroFrame2].setView(this.viewMappaAttuale);

            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Mappa giÃ  creata. Reimpostata', this.map1[this.NumeroFrame2]);
          }

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Vista su mappa:', this.viewMappaAttuale);

        if (ok) {
          ExternalFrameComponent.pulisceCalls(this);

        // const tm = setTimeout(() => {
          clearTimeout(tm);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. RIDISEGNO MAPPA. Chiamo BBOX');

          // if (this.overviewZoom2 === false) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prendo valori bbox 2', this.NumeroFrame2, this.viewMappaAttuale);

          const bbox = this.prendeBBOXSoloValori('Redraw componente');
          ExternalUtilities.bboxMaschera[this.NumeroFrame2] = bbox;
          // ExternalUtilities.bboxStringaFisso = 'geoants_bbox_min_x:' + bbox[0] + ';geoants_bbox_min_y:' + bbox[1] + ';';
          // ExternalUtilities.bboxStringaFisso += 'geoants_bbox_max_x:' + bbox[2] + ';geoants_bbox_max_y:' + bbox[3];
          // ExternalUtilities.bboxAttuale = bbox;

          if (this.overviewZoom2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Acquisizione bbox overview', this.NumeroFrame, this.overviewZoom2, bbox);
          } else {
            // if (this.overviewZoom2 === false) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Acquisizione bbox zoom', this.NumeroFrame, this.overviewZoom2, bbox);
            // }
          }

          const tm = setTimeout(() => {
          clearTimeout(tm);
            this.accentratore(true, 'RedrawComponente');

            if (this.eseguitoInProgetto22 === true) {
              this.prendeBBoxPerProgetto();
            }
          }, 1000);
          // }, 1000);
        }
      // }, 500);
    }, 1500);
  } */

  impostaTipoMappa(daDove) {
    if (this.layerCartoDb === undefined) {
      this.creaLayersMappe();
    }

    let layer;

    // this.creaLayersMappe();
    // logConsole('Tipo mappa da '+ daDove, this.NumeroFrame2, this.mapTypeName, this.mapType2, this.mapStyleGlobale2);
    let qualeTipoMappa = -1;
    // this.creaLayersMappe();

    if (this.mapTypeName === 'CartoDB' || (this.mapType2 === -1 && (this.mapStyleGlobale2 === 1))) {
      layer = this.layerCartoDb;
      qualeTipoMappa = 1;
    } else {
      if (this.mapTypeName === 'Google' || (this.mapType2 === -1 && (this.mapStyleGlobale2 === 3))) {
        layer = this.layerGoogle;
        qualeTipoMappa = 2;
      } else {
        if (this.mapTypeName === 'OSM' || (this.mapType2 === -1 && (this.mapStyleGlobale2 === 2))) {
          layer = this.layerOSM;
          qualeTipoMappa = 3;
        } else {
          if (this.mapTypeName === 'Stamen' || (this.mapType2 === -1 && (this.mapStyleGlobale2 === 4))) {
            layer = this.layerStamen;
            qualeTipoMappa = 4;
          } else {
            if (this.mapTypeName === 'Satellite' || (this.mapType2 === -1 && (this.mapStyleGlobale2 === 5))) {
              layer = this.layerSatellite;
              qualeTipoMappa = 5;
            } else {
              if (this.mapTypeName === 'Magnify' || (this.mapType2 === -1 && (this.mapStyleGlobale2 === 6))) {
                // layer = this.lente;
                qualeTipoMappa = 6;
              } else {
                this.mapTypeName = 'CartoDB';
                layer = this.layerCartoDb;
                qualeTipoMappa = 7;
              }
            }
          }
        }
      }
    }
    // logConsole('Tipo mappa impostato da ' + daDove, qualeTipoMappa, this.NumeroFrame2);

    this.ultimoLayer = layer;

    return layer;
  }

  mappaDisegnata = ExternalUtilities.creaVettore(environment.quantiFrames, false);
  staCreandoMappa = ExternalUtilities.creaVettore(environment.quantiFrames, false);

  redrawComponente(daDove, frameAttivo) {
    conta('frame: ridisegno mappa (richiesto)', 'frame ' + this.NumeroFrame2 + ' (' + daDove + ')');
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaRC[this.NumeroFrame2] < 500) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Esco per troppo veloce', this.NumeroFrame2);
  
      return;
    }
    this.ultimaVoltaRC[this.NumeroFrame2] = ora;

    if (this.staCreandoMappa[this.NumeroFrame2]) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Esco per creazione in corso', this.NumeroFrame2);

      return;
    }
    this.staCreandoMappa[this.NumeroFrame2] = true;

    this.puliziaComponent.pulisceMappa(this, true);

    /* if (this.map1[this.NumeroFrame2]) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Mappa Già Presente. La pulisco', this.NumeroFrame2);
      this.puliziaComponent.pulisceFrame(this, this.frameAttivo2, true);
      // return;
    } */

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw da', daDove);    
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Aggiorno Mappa. Componente caricato: ', this.NumeroFrame2, this.componenteCaricato);
    
    let centro;
    /* if (this.bboxImpostataNelFrame) {
      centro = this.bboxImpostataNelFrame;
      // logConsole('Redraw: bboxImpostataNelFrame Imposto centro 1', this.NumeroFrame2, centro);

      centroImpostatoDa = 'bboxImpostataNelFrame';

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw: imposto centro precedente 1', this.NumeroFrame2, this.bboxImpostataNelFrame);
    } else { */

    let centroImpostato;
    let zoomImpostato;

    if (this.overviewZoom2) {
      if (this.centroImpostatoOverView) {
        centroImpostato = this.centroImpostatoOverView;
      } else {
        if (this.centroImpostato) {
          centroImpostato = this.centroImpostato;
        } else {
          centroImpostato = [12.4090874, 41.8223068];
        }
      }

      if (this.zoomImpostatoNelFrameOverView) {
        zoomImpostato = this.zoomImpostatoNelFrameOverView;
      } else {
        if (this.zoomImpostatoNelFrame) {
          zoomImpostato = this.zoomImpostatoNelFrame;
        } else {
          zoomImpostato = 11;
        }
      }
    } else {
      if (this.centroImpostatoZoom) {
        centroImpostato = this.centroImpostatoZoom;
      } else {
        if (this.centroImpostato) {
          centroImpostato = this.centroImpostato;
        } else {
          centroImpostato = [12.4090874, 41.8223068];
        }  
      }
      if (this.zoomImpostatoNelFrameZoom) {
        zoomImpostato = this.zoomImpostatoNelFrameZoom;
      } else {
        if (this.zoomImpostatoNelFrame) {
          zoomImpostato = this.zoomImpostatoNelFrame;
        } else {
          zoomImpostato = 11;
        }
      }
    }

    let ok = true;
    if (centroImpostato) {
      centroImpostato.forEach(element => {
        if (ok && (isNaN(element) || element === undefined || element === null || element === 'NaN' || 
          element === 'undefined' || element === 'null')) {
            logConsole('Valore non numerico nel centro impostato', centroImpostato, element);
          ok = false;
        }
      });
    }

    // logConsole('Redraw mappa', this.NumeroFrame2, centroImpostato);

    if (ok) {
      if (centroImpostato) {
        centro = centroImpostato;

        // logConsole('Redraw: bboxImpostataNelFrame Imposto centro 2', this.NumeroFrame2, centro);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw: imposto centro precedente 2', this.NumeroFrame2, this.centroImpostato);
      } else {
        centro = [12.4090874, 41.8223068];
        zoomImpostato = 11;

        // logConsole('Redraw: bboxImpostataNelFrame Resetto centro 3', this.NumeroFrame2, centro);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw: Resetto centro', this.NumeroFrame2);
      }
    } else {
      centro = [12.4090874, 41.8223068];
      zoomImpostato = 11;

      // logConsole('Redraw: bboxImpostataNelFrame Resetto centro 3', this.NumeroFrame2, centro);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw: Resetto centro per valori non validi', this.NumeroFrame2);
    }
    
    if (centro[0] < 200) {
      centro = transform(centro, 'EPSG:4326', 'EPSG:3857');
    }

    // logConsole('Creazione view', centro, centro.length);

    this.viewMappaAttuale = null;
        
    const centroIniziale = transform([12.4090874, 41.8223068], 'EPSG:4326', 'EPSG:3857');
    const view = new OlView({
      projection: 'EPSG:3857',
      center: centroIniziale,
      zoom: 11
    });
    
    if (centro.length > 2) {
      // logConsole('View creata fittata', daDove, this.NumeroFrame2, centro, this.zoomImpostatoNelFrame);
      view.fit(centro);
    } else {
      view.setCenter(centro);
    }

    this.zoomImpostatoNelFrame = zoomImpostato;

    view.setZoom(this.zoomImpostatoNelFrame);
    
    // logConsole('Creazione view', centro, centro.length, this.zoomImpostatoNelFrame);

    const targetId = 'frameM_' + this.NumeroFrame2 + '_' + this.frameAttivo2;

    this.viewMappaAttuale = view;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prima di Redraw componente', this.NumeroFrame2, this.overviewZoom2);

    let c = 0;
    const attesaMappa = setInterval(() => {
      const target = document.getElementById(targetId);

      if (target) {
        const MappaX = target.offsetWidth;
        const MappaY = target.offsetHeight;

        // logConsole('Disegnata mappa: Contenitore ' + MappaX + 'x' + MappaY, this.NumeroFrame2);
        if (MappaX && MappaY) {
          // this.mappaVisibile[this.NumeroFrame2] = false;
          clearInterval(attesaMappa);

          const tm1 = setTimeout(() => {
            clearTimeout(tm1);

            if (!this.impostazioni.tipoMappa1) {
              this.impostazioni.tipoMappa1 = 'CartoDB';
              this.mapTypeName = 'CartoDB';
              this.mapType2 = 1;
            }

            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Creo mappa', this.NumeroFrame2);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Creo mappa. Layer', this.layerCartoDb);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Creo mappa. View', this.viewMappaAttuale, typeof(this.viewMappaAttuale));
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Tipo mappa', this.impostazioni.tipoMappa1);

            const layer = this.impostaTipoMappa('RedrawComponente');

            // this.mappaVisibile[this.NumeroFrame2] = true;

            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Layer impostato:', layer);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Nome mappa:', 'frameM_' + this.NumeroFrame + '_' + frameAttivo);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Mappa:', this.map1[this.NumeroFrame2]);

            // let ok = true;
            
            // this.impostaPosizioneSchermata(centro, true, 'RedrawComponente');

            // Libera la mappa precedente (listener, canvas, ResizeObserver) prima di crearne una nuova
            this.liberaMappa();

            this.map1[this.NumeroFrame2] = this.ngZone.runOutsideAngular(() => new OlMap({
              controls: defaultControls().extend([
                // this.controllaScala(this);
                new ScaleLine({
                  units: 'metric'
                })
              ]),
              interactions: defaultInteractions().extend([
                new DragRotateAndZoom()
              ]),
              target: targetId, //  'frameM_' + this.NumeroFrame + '_' + frameAttivo,
              layers: [layer],
              pixelRatio: 1,
              view: this.viewMappaAttuale
            }));

            this.map1[this.NumeroFrame2].once('rendercomplete', this.inZonaAngular(() => {
              // logConsole('Mappa pronta', this.NumeroFrame2);

              this.redrawComponente2(daDove);
            }));
          }, 100);
        } else {
          c++;
          if (c > 100) {
            clearInterval(attesaMappa);

            console.error('TARGET MAPPA NON VALIDO 1: ', targetId, 
              this.NumeroFrame2, frameAttivo);
          }
        }
      } else {
        c++;
        if (c > 100) {
          clearInterval(attesaMappa);

          console.error('TARGET MAPPA NON VALIDO 2: ', targetId, 
            this.NumeroFrame2, frameAttivo);
        }
      }
    },100);   
      // }, 100);
  }

  liberaMappa() {
    const mappa = this.map1 ? this.map1[this.NumeroFrame2] : undefined;
    if (!mappa) {
      return;
    }

    // Stacca i layer (riusati dalla nuova mappa) e distrugge la mappa: dispose() fa anche setTarget(null)
    if (mappa.getLayers()) {
      mappa.getLayers().clear();
    }
    mappa.dispose();
    this.map1[this.NumeroFrame2] = null;
  }

  redrawComponente2(daDove) {
    // logConsole('Redraw2', daDove, this.NumeroFrame2, this.frameAttivo2);

    // const tm = setTimeout(() => {
    //   clearTimeout(tm);

      // this.map1[this.NumeroFrame2].setView(this.viewMappaAttuale);
      // this.map1[this.NumeroFrame2].setTarget(targetId);

      // logConsole('Mappa target', 'frameM_' + this.NumeroFrame2 + '_' + this.frameAttivo2);

      this.impostaEventiSuMappa(daDove);

      this.updateSizeMappa('RedrawComponent');

      // ExternalFrameComponent.pulisceCalls(this);

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. RIDISEGNO MAPPA. Chiamo BBOX');
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prendo valori bbox 2', this.NumeroFrame2, this.viewMappaAttuale);

      const bbox = this.prendeBBOXSoloValori('Redraw componente');
      if (bbox) {
        ExternalUtilities.bboxMaschera[this.NumeroFrame2] = bbox;

        if (this.overviewZoom2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Acquisizione bbox overview', this.NumeroFrame, this.overviewZoom2, bbox);
        } else {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Redraw. Acquisizione bbox zoom', this.NumeroFrame, this.overviewZoom2, bbox);
        }

        const tm = setTimeout(() => {
          clearTimeout(tm);

          this.mappaDisegnata[this.NumeroFrame2] = true;

          // alert('Redraw ' + this.NumeroFrame2);
          // logConsole('Chiamo accentratore', this.NumeroFrame2);

          this.accentratore(true, 'RedrawComponente');

          if (this.eseguitoInProgetto2 === true) {
            this.prendeBBoxPerProgetto();
          }

          this.staCreandoMappa[this.NumeroFrame2] = false;
        }, 500);
      }
    // }, 100);
  }

  /* loadMapStart = function(t, e) {
    t.caricamentoMappaInCorso = true;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Caricamento mappa iniziato');
  };

  loadMapEnd = function(t, e) {
    t.caricamentoMappaInCorso = false;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Caricamento mappa terminato');
  }; */

prendeBBoxPerProgetto() {
  const bbox = this.prendeBBOXSoloValori('Per Progetto');
  logConsole('Emit coordinate da frame verso progetto 2: ', bbox);
  if (bbox) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prendo valori bbox 1 perchè sto in un progetto', bbox);
    const pass = this.sistemaCoordinate(bbox, '4326');
    this.bboxEmit.emit(pass);

    this.bboxOverview = bbox;
    // logConsole('Imposto bbox overview', this.NumeroFrame2, 'prendeBBoxPerProgetto');
    this.bboxImpostatoOverView.emit(bbox);
    ExternalUtilities.bboxMaschera[this.NumeroFrame2] = bbox;
  }
}

controllaViewMappaAttualeSeValida(forza) {
  return;

  if ((this.viewMappaAttuale && !this.viewMappaAttuale['viewportSize_']) || forza) {
    // if (!this.centroImpostato) {
      // this.Utils.ultimoCentro = [12, 42];
      if (this.centroImpostato) {
        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
        }
        let c = this.centroImpostato; // .split(';');
        if (c.indexOf(';') > -1) {
          c = c.split(';');
        }
        const cc = new Array();
        c.forEach(element => {
          element = cc.push(+element);
        });
        this.centroImpostato = cc;
        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
        }

        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato centro finto', this.centroImpostato);
        }
      } else {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ULTIMO CENTRO NON IMPOSTATO');
        return;
      }
    // }
    if (!this.currZoom || this.currZoom < 1) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto zoom a 10');
      this.currZoom = 10;
    }
    if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista finta impostata 1', this.centroImpostato);
    }

    if (this.centroImpostato[0] < 180) {
      this.centroImpostato = transform(this.centroImpostato, 'EPSG:4326', 'EPSG:3857');
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
      }
    }

    const viewG = new OlView({
      center: fromLonLat(this.centroImpostato),
      zoom: this.currZoom
    });
    this.viewMappaAttuale = viewG;
    if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista finta impostata 2', viewG);
    }
  }
}

contaScala() {
    if (!this.map1[this.NumeroFrame2] || this.map1[this.NumeroFrame2] === null || (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && !this.map1[this.NumeroFrame2].getView())) {
      return;
    }

    const units = this.map1[this.NumeroFrame2].getView().getProjection().getUnits();
    const resolution = this.map1[this.NumeroFrame2].getView().getResolution();
    /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'resolution:', resolution);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'dpi:', this.Utils.dpi);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'units:', units);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'inches:', t.INCHES_PER_UNIT[units]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'scala:', resolution * t.INCHES_PER_UNIT[units] * this.Utils.dpi); */
    const scale = resolution * this.INCHES_PER_UNIT[units] * this.Utils.dpi;
    // t.INCHES_PER_UNIT[units] * t.DOTS_PER_INCH * resolution;
    // const newScale = Math.round(scale);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, newScale);

    // if (this.currScale !== newScale) {
    let newScale2 = scale;
    let char = '';
    if (newScale2 > 1000000) {
      newScale2 /= 1000000;
      char = 'M';
    } else {
      if (newScale2 > 1000) {
        newScale2 /= 1000;
        char = 'K';
      }
    }
    newScale2 = Math.round(newScale2 * 100) / 100;
    this.currScale2 = newScale2 + char;
    this.currScale = scale; // newScale2 + char;
  // }
  }

  composeInCorso = 0;

  // pre/postCompose girano a ogni frame di rendering, fuori dalla zona Angular.
  // Si rientra nella zona solo se lo spinner era già visibile prima del rendering e ora va nascosto.
  caricamentoPrimaDelCompose = false;

  postCompose = function(t, e) {
    t.composeInCorso--;
    if (t.composeInCorso <= 0) {
      t.composeInCorso = 0;
      t.caricamentoMappaInCorso = false;
      if (t.caricamentoPrimaDelCompose && t.ngZone) {
        t.ngZone.run(() => {});
      }
      t.caricamentoPrimaDelCompose = false;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Post compose ', t.composeInCorso);
    }
  }

  preCompose = function(t, e) {
    t.composeInCorso++;
    if (t.composeInCorso === 1) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pre compose', t.composeInCorso);
      t.caricamentoPrimaDelCompose = t.caricamentoMappaInCorso;
      t.caricamentoMappaInCorso = true;
    }

    if (t.map1[t.NumeroFrame2] && t.map1[t.NumeroFrame2] !== null && t.eseguitoInProgetto2 === true) {
      const layer = t.map1[t.NumeroFrame2].getLayers();
      const bbox = t.map1[t.NumeroFrame2].getView().calculateExtent(t.map1[t.NumeroFrame2].getSize());
      /* if (t.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Extent in precompose: ', bbox);
      } */
      let bboxFin = transform(bbox, 'EPSG:3857', 'EPSG:4326');
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'PreCompose. Cambio posizione: ', bbox, bboxFin);
      /* if (t.intervalBbox) {
        return;
      } */
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PRE COMPOSE Nuovo valore', t.NumeroFrame2, bboxFin);
      /* t.intervalBbox = setInterval(() => {
        if (bboxFin === t.lastPreCompose) {
          clearInterval(t.intervalBbox);
          t.intervalBbox = undefined;

          if (t.bboxPC === bboxFin) {
            return;
          }
          t.bboxPC = bboxFin; */

          // if (t.debug2 === true) {
          //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PRE COMPOSE Eseguo', t.NumeroFrame2, bboxFin);
          // }
          layer.forEach(element => {
            if (element.getSource()) {
              if (element.getSource().params_ && element.getSource().params_.VIEWPARAMS) {
                if (element.getSource().params_.VIEWPARAMS.indexOf('geoants_bbox_min_x')> -1) {
                  let vv = element.getSource().params_.VIEWPARAMS;
                  vv = vv.substring(0, vv.indexOf('geoants_bbox_min_x'));
                  vv += 'geoants_bbox_min_x:' + bboxFin[0] + ';geoants_bbox_min_y:' + bboxFin[1] + ';';
                  vv += 'geoants_bbox_max_x:' + bboxFin[2] + ';geoants_bbox_max_y:' + bboxFin[3];
                  element.getSource().params_.VIEWPARAMS = vv;
                } else {
                  const v = element.getSource().params_.VIEWPARAMS.split(';');
                  let s = '';
                  let f = false;
                  v.forEach(element2 => {
                    if (element2.toUpperCase().indexOf('V_BBOX') > -1) {
                      if (!f) {
                        s += 'v_bbox: \'BOX(' + ExternalUtilities.effettuaReplace(bboxFin.toString(), ',', '\\,') + ')\';';
                        f = true;
                      }
                    } else {
                      if (element2 && element2 !== '') {
                        s += element2 + ';';
                      }
                    }
                  });
                  element.getSource().params_.VIEWPARAMS = s;
                }
              }
            }
          });
        /* } else {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e, t.lastPreCompose);
          t.lastPreCompose = bboxFin;
        }
      }, 500); */
    }
  };

  entraMappa() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Entro', this.NumeroFrame2);
    this.Utils.uidMoventeMappa = this.NumeroFrame2;
  }

  esceMappa() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco', this.NumeroFrame2);
    this.Utils.uidMoventeMappa = -1;
  }

  /* mouseMove = function(t, e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    // Tolto perchÃ© lo zoom sulla mappa ingrandisce solo la mappa e non i layers disegnati sopra
    return;

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t.mousePosition);
    t.mousePosition = t.map1[t.NumeroFrame2].getEventPixel(e);
    t.map1[t.NumeroFrame2].render();
  }

  mouseOut = function(t) {
    // Tolto perchÃ© lo zoom sulla mappa ingrandisce solo la mappa e non i layers disegnati sopra
    return;

    t.mousePosition = null;
    t.map1[t.NumeroFrame2].render();
  } */

  vecchiaChiamataMoveEnd = [undefined, undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
  ultimoBBoxFin = [ '', '', '', '', '', '', '', '', '', '', ''];
  ultimoSpostamento = [ '', '', '', '', '', '', '', '', '', '', ''];
  gestioneSpostamentoSoloAllaFineDelMovimentoDelMouse = true;
  intervalSpostamentoMappa = [undefined, undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
  valoreAttuale = [undefined, undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
  lastEnd = [undefined, undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
  staMuovendoMappa = false;

  moveEnd = function(t, e) {
    t.staMuovendoMappa = true;
    // logConsole('Sto muovendo mappa');
    if (t.gestioneSpostamentoSoloAllaFineDelMovimentoDelMouse) {
      let view;
      if (e === null) {
        view  = t.map1[t.NumeroFrame2].getView();
      } else {
        view  = e.map.getView();
      }
      t.valoreAttuale[t.NumeroFrame2] = view.calculateExtent();
      t.lastEnd[t.NumeroFrame2] = e;

      // let newZoom = view.getZoom();
      if (!t.intervalSpostamentoMappa[t.NumeroFrame2]) {
        let c = 0;
        t.intervalSpostamentoMappa[t.NumeroFrame2] = setInterval(() => {
          if (t.ultimoBBoxFin[t.NumeroFrame2] === JSON.stringify(t.valoreAttuale[t.NumeroFrame2])) {
            t.moveEnd2(t, t.lastEnd[t.NumeroFrame2]);
          } else {
            t.ultimoBBoxFin[t.NumeroFrame2] = JSON.stringify(t.valoreAttuale[t.NumeroFrame2]);
            c++;
            if (c > 10) {
              t.moveEnd2(t, t.lastEnd[t.NumeroFrame2]);
            }
          }
        }, 50);
      }
    } else {
      t.moveEnd2(t, e);
    }
  }

  moveEnd2(t, e) {
    clearInterval(t.intervalSpostamentoMappa[t.NumeroFrame2]);
    t.intervalSpostamentoMappa[t.NumeroFrame2] = undefined;

    setTimeout(() => {
      t.staMuovendoMappa = true;
      // logConsole('Sto muovendo mappa. FINE');
    }, 1000);

    if (t.Utils.uidMoventeMappa !== t.NumeroFrame2) {
      // if (t.debug2) {
        // logConsole('MOVEEND: Esco in quanto non sono stato io, in quanto frame, a spostare la mappa. Mi è solamente arrivato un ordine.', t.NumeroFrame2);
      // }

      return;
    }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Move End function. Chiamata');
    /* if (t.vecchiaChiamataMoveEnd[t.NumeroFrame2] === JSON.stringify(e.frameState.extent)) {
      if (t.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Move End function. Esco per ultima chiamata identica', e);
      }

      return;
    }
    t.vecchiaChiamataMoveEnd[t.NumeroFrame2] = JSON.stringify(e.frameState.extent); */

    /* //// if (t.mappaVisibile[t.NumeroFrame2] === false || !t.map1[t.NumeroFrame2]) {
      if (t.debug2 === true) {
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Move End function. Esco per mappa non visibile oppure mappa undefined', e);
      }

      return;
    } */

    if (t.staSpostandoMappaZoom[t.NumeroFrame2] === true) {
      // if (t.debug2) {
        // logConsole('MOVEEND: Esco per spostamento mappa zoom già in corso', e);
      // }

      return;
    }

    // if (t.staImpostandoCentro) {
    // return;
    //}

    // if (t.overviewZoom2 === true) {
    //   return;
    // }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    /* const ora = new Date().getTime();
    if (ora - t.ultimaVoltaTMSME < t.ritardoPerFunzioni && t.ultimaVoltaTMSME !== -1) {
      return;
    }
    t.ultimaVoltaTMSME = ora; */
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    // if (t.debug2) {
      // logConsole('MOVEEND: Valori', e);
    // }

    if (ExternalUtilities.staMassimizzando[t.NumeroFrame2] === true) {
      // logConsole('Esco da moveend per massimizzazione in corso', t.NumeroFrame2);

      const tt = setTimeout(() => {
        clearTimeout(tt);

        ExternalUtilities.staMassimizzando[t.NumeroFrame2] = false;
      }, 1000);
      return;
    }

    let view;
    let mappa;
    if (e === null) {
      view  = t.map1[t.NumeroFrame2].getView();
      mappa = t.map1[t.NumeroFrame2];
    } else {
      view  = e.map.getView();
      mappa = e.map;
    }

    // let newZoom = view.getZoom();
    let extent = view.calculateExtent(mappa.getSize());
    // logConsole('Move end 1', extent);

    if (t.gestioneSpostamentoSoloAllaFineDelMovimentoDelMouse) {
      if (JSON.stringify(extent) === t.ultimoSpostamento[t.NumeroFrame2]) {
        return;
      }
      t.ultimoSpostamento[t.NumeroFrame2] = JSON.stringify(extent);
    }

    // logConsole('Spostamento mappa frame ' + t.NumeroFrame2, extent);

    // alert('1: ' + extent[0]);
    if (!Number.isNaN(extent[0]) && extent[0] !== null && extent[0] !== 'null') {
      // // logConsole('bboxImpostataNelFrame 1', t.NumeroFrame2, extent, t.map1[t.NumeroFrame2].getView().getZoom());
      /* if (extent[0] < 360 && extent[0] >= 0) {
        extent = transform(extent, 'EPSG:4326', 'EPSG:3857');
      } */
      t.bboxImpostataNelFrame = extent;
      // logConsole('Move end 2', extent);

      const extentPerBBox = transform(extent, 'EPSG:3857', 'EPSG:4326');
      this.bboxImpostataNelFrame = extentPerBBox;
      if (this.overviewZoom2 === true) {
        this.bboxOverview = extentPerBBox;
      } else {
        this.bboxZoom = extentPerBBox;
      }

      t.centroImpostato = extent;
      t.zoomImpostatoNelFrame = view.getZoom();
      const fit = view.calculateExtent(mappa.getSize());

      // logConsole('Centro impostato emit in move end', this.NumeroFrame2, extent, fit, t.zoomImpostatoNelFrame);
      // if (t.overviewZoom2) {
        t.centroImpostatoEmit.emit({
          daChi: t.NumeroFrame2, 
          funzione: 'moveEnd2', 
          centro: extent, 
          zoom: t.zoomImpostatoNelFrame,
          tipoMappa: t.overviewZoom2
        });
      // }
      /* const tm = setTimeout(() => {
          clearTimeout(tm);
        this.zoomImpostatoNelFrame = t.map1[t.NumeroFrame2].getZoom();
      }, 100); */
      // if (t.debug2) {
        // logConsole('MOVEEND: Extent', extent);
      // }
      // alert('1: ' + JSON.stringify(extent) + ' - ' + newZoom);
    }
    // this.zoomImpostatoNelFrame = newZoom;

    /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Move end, view', e);
    const checketto = e.frameState.extent;
    if (!checketto || !checketto[0] || isNaN(checketto[0]) || checketto[0] === 'NaN' || checketto[0].toString() === 'NaN') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Move End function. Esco per valori nulli');
      return;
    } */
    // return;

    // let newZoom = view.getZoom();
    /* if (newZoom > 23) {
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Adeguamento zoom: ', newZoom);
      newZoom = 23;
      view.setZoom(newZoom);
      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Troppo zoom... Adeguo');
      this.zoomImpostatoNelFrame = 23;
    } */
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, newZoom);

    t.planimetry.attivaDisattivaQuadrati(t);

    // t.lastBBoxExec = e;
    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
      // if (t.lastBBoxExec === e) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Spostamento mappa: ', t.eseguitoInProgetto2);

        // if (t.debug2) {
          // logConsole('MOVEEND: Prendo valori bbox: ', t.Utils.caricataDashboard, t.eseguitoInProgetto2);
        // }
        if (t.Utils.caricataDashboard === true || t.eseguitoInProgetto2 === true) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Spostamento mappa', e);
          //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Riuscito');


          if (!t.staCambiandoFrame) {

            // t.contaScala();

            /* if (t.currZoom !== newZoom) {
              // let newZoom = view.getZoom();

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Frame ' + t.NumeroFrame + ' zoom end, new zoom: ' + newZoom);
              t.currZoom = newZoom;
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato zoom', t.currZoom, t.staCambiandoFrame);
              // t.currZoomEmit.emit(newZoom);
            } */
          }

          // const bbox = this.prendeBBOXSoloValori('Per Progetto');
          if (extent) {
            const pass = this.sistemaCoordinate(extent, '4326');
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prendo valori bbox 1 perchè sto in un progetto', pass);
            // logConsole('Emit coordinate da frame verso progetto 3: ', pass);
            this.bboxEmit.emit(pass);

            this.bboxOverview = pass;
            // logConsole('Imposto bbox overview', this.NumeroFrame2, 'moveEnd2');
            this.bboxImpostatoOverView.emit(pass);
            ExternalUtilities.bboxMaschera[this.NumeroFrame2] = pass;
          }

          return;
          // const ora = new Date().getTime();
          // if ((ora - t.lastBBoxExec) < 250) {
          //   return;
          // }
          // t.lastBBoxExec = ora;

          // if (t.overviewZoom2 === true) {
            // if (t.debug2) {
              // logConsole('MOVEEND: Prendo valori bbox 1');
            // }

            const bbox = t.prendeBBOXSoloValori('MoveEnd');
            // ExternalUtilities.bboxAttuale = bbox;

            // return;
            // if (t.debug2) {
              // logConsole('MOVEEND: Chiamo BBOX', bbox);
            // }

            if (bbox[0] && bbox[0].toString() === 'NaN' || isNaN(bbox[0])) {
              return;
            }
            // let centro = [bbox[0] + ((bbox[2] - bbox[0]) / 2), bbox[1] + ((bbox[3] - bbox[1]) / 2)]
            // const centro2 = t.viewMappaAttuale.getCenter();
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'MOVEEND MAPPA. Centro', centro, centro2);


            if (!t.lastBbox || JSON.stringify(t.lastBbox) !== JSON.stringify(bbox)) {
              t.lastBbox = bbox;
              //return;

              if (t.overviewZoom2 === true) {
                // if (JSON.stringify(this.bboxOverview) !== JSON.stringify(bbox)) {
                  // if (t.debug2) {
                    // logConsole('MOVEEND: Acquisizione dopo zoom bbox overview', t.NumeroFrame, t.overviewZoom2, bbox);
                  // }

                  if (!Number.isNaN(bbox[0]) && !Number.isNaN(bbox[1]) && !Number.isNaN(bbox[2]) && !Number.isNaN(bbox[3])) {
                    t.bboxOverview = bbox;
                    t.bboxImpostatoOverView.emit(bbox);
                    ExternalUtilities.bboxMaschera[t.NumeroFrame2] = bbox;
                    // logConsole('Spostamento mappa overview', t.NumeroFrame2, bbox);
                  } else {
                    // if (t.debug2) {
                      // logConsole('MOVEEND: bbox nulla: ', t.NumeroFrame);
                    // }    
                  }
                // }
              } else {
                // if (JSON.stringify(this.bboxZoom) !== JSON.stringify(bbox)) {                  
                  // if (t.debug2) {
                    // logConsole('MOVEEND: Acquisizione dopo zoom bbox zoom', t.NumeroFrame, t.overviewZoom2, bbox);
                  // }

                  if (bbox) {
                    if (!Number.isNaN(bbox[0]) && !Number.isNaN(bbox[1]) && !Number.isNaN(bbox[2]) && !Number.isNaN(bbox[3])) {
                      t.bboxZoom = bbox;
                      // if (Math.abs(bbox[2] - bbox[0]) < 30 && Math.abs(bbox[3] - bbox[1]) < 20) {
                      t.bboxImpostatoZoom.emit(bbox);
                      ExternalUtilities.frameZoomSpostato = t.NumeroFrame2;
                      ExternalUtilities.bboxMaschera[t.NumeroFrame2] = bbox;
                      // }
                      // logConsole('Spostamento mappa zoom', t.NumeroFrame2, bbox);
                    } else {
                      // if (t.debug2) {
                        // logConsole('MOVEEND: Bbox nulla 3 ', t.NumeroFrame, bbox);
                      // }    
                    }
                  } else {
                    // if (t.debug2) {
                      // logConsole('MOVEEND: Bbox nulla 2 ', t.NumeroFrame, bbox);
                    // }    
                  }
                // }
              }

              // }

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t.eseguitoInProgetto22)
              // if (t.eseguitoInProgetto22 === true) {

              // Tolto il 10/10/2002 per mail 21/09/2022 13:34
              // t.accentratore(true);
              // Tolto il 10/10/2002 per mail 21/09/2022 13:34

              if (t.eseguitoInProgetto2 === true) {
                // if (t.debug2) {
                  // logConsole('MOVEEND: Invio bbox per progetto esterno: ', t.NumeroFrame, bbox);
                // }

                t.bboxEmit.emit(bbox);
              }
            // }
            } else {
              // if (t.debug2) {
                // logConsole('MOVEEND: Ultima bbox uguale', t.NumeroFrame);
              // }
            }
          // }
        } else {
          // if (t.debug2) {
            // logConsole('MOVEEND: Uscita per valori falsi', t.NumeroFrame);
          // }
        }
      // }
    // }, 250);
    // logConsole('Move End', t.NumeroFrame2);
  };

  LeggeImpostazioni() {
    this.impostazioni.lat = 38.082192;
    this.impostazioni.lon = 13.510264;
  }

  SalvaImpostazioni() {

  }

  scriviLog(Cosa, Parametro) {
    if (this.scriviDebug === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, Cosa, Parametro);
    }
  }

  riposizionaMaschere() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Riposiziona maschere');
    // ExternalUtilities.messaggioDiErrore(t, this.contMappa1.nativeElement.offsetWidth + ' - ' + this.contMappa1.nativeElement.offsetHeight);

    // this.updateMappa();
  }

  apriChiudiBarra() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'entrato');
    // if (this.impostazioni.pinImpostato) {
    //   this.barraAperta = true;
    //   this.impostazioni.dimeMappa = 100;
      // this.barraApertaEmit.emit(this.barraAperta);
    // } else {
      if (!this.barraAperta) {
        this.barraAperta = true;
        this.impostazioni.dimeMappa = 100;
      } else {
        this.barraAperta = false;
        this.impostazioni.dimeMappa = 100;
      }
      const tm = setTimeout(_ => {
        clearInterval(tm);
        this.barraApertaEmit.emit(this.barraAperta), 100
      });
      this.calcolaDimeBarra();
      // this.updateMappa();
      // this.map1[this.NumeroFrame2].updateSize();
    // }
  }

  accentratore(forzaRedraw, chiMiChiama) {
    if (this.MappaOGrafico2 === 'M') {
      if (!this.map1[this.NumeroFrame2]) {
        return;
      }
    } 
    // logConsole('Accentratore frame ' + this.NumeroFrame2 + ' da ' + chiMiChiama);

    if (!this.barraImpostataAperta) {
      this.dimeBarraAperta = this.dBarraChiusa;
    } else {
      this.dimeBarraAperta = this.dBarraAperta;
    }

    // logConsole('dime 3', this.dimeBarraAperta);

    /* if (!ExternalUtilities.eseguitoBounds) {
      this.loadCsv('accentratore');
    } */

    // if (this.NumeroFrame === 1) {
    //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Richiamo Accentratore frame', this.NumeroFrame, this.MappaOGrafico2);
    // }

    /* if (forzaRedraw === false) {
      const ok = this.controllaSeIlFrameDeveEssereAggiornato();
      if (ok === false) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da accentratore');
        return;
      }
    } */

    // if (this.NumeroFrame === 1) {
    //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore frame', this.NumeroFrame);
    // }
    if (!this.MappaOGrafico2) {
      return;
    }

    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sto nell\'accentratore', this.NumeroFrame2, this.MappaOGrafico, this.frameAttivo2);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mi ha chiamato', chiMiChiama);
    // }

    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaAccentratore < this.ritardoPerAccentratore) {
      conta('frame: accentratore scartato dal limitatore', 'frame ' + this.NumeroFrame2 + ' (' + chiMiChiama + ')');
      return;
    }
    this.ultimaVoltaAccentratore = ora;
    conta('frame: accentratore eseguito', 'frame ' + this.NumeroFrame2 + ' (' + chiMiChiama + ')');

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eseguo l\'accentratore', this.NumeroFrame2, this.MappaOGrafico, this.frameAttivo2);

    // this.applicaModifiche();
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Entrato in accentratore');
      // this.ultimaVoltaAccentratore = ora;

    // if (this.debug2 === true) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Entrato in accentratore:', this.eseguitoInProgetto22, this.progettoEsterno2, this.nomeAntennaDD2, this.nomeClusterDD2);
    // }
    if (this.eseguitoInProgetto2 === true) {
      if (this.progettoEsterno2 === 'DD;Antenne') {
        const tm = setTimeout(() => {
          clearTimeout(tm);

          this.layers_DD.disegnaAntenne(this, this.nomeAntennaDD2, this.parametriDD2, 'Accentratore1');
        }, 1000);
      }
      if (this.progettoEsterno2 === 'DD;Cluster') {
        const tm = setTimeout(() => {
          clearTimeout(tm);

          this.layers_DD.disegnaAntenne(this, this.nomeAntennaDD2, this.parametriDD2, 'Accentratore2');
          this.layers_DD.disegnaCluster(this, this.nomeClusterDD2);
        }, 1000);
      }
    }

    // this.applicaModifiche();

    // const te = setTimeout(() => {
      switch (this.MappaOGrafico2) {
          // case 'TI':
          //   this.tcRunInfoComponent.prendeDatiTcRunInfo(this);
          //   break;
          case 'SY':
            const ogg = this.creaStruttureDiProvaPerCanvas();
            this.synoptic.DisegnaSynoptic(this, ogg);
            break;
          case 'MD':
            this.measureDFNComponent.disegnaMeasureDFN(this);
            break;
          case 'MG':
            const tm1 = setTimeout(() => {
            clearTimeout(tm1);
              this.mosaicGrid.disegnaMosaicGrid(this);
            }, 100);
            break;
          case 'CG':
            const tm2 = setTimeout(() => {
            clearTimeout(tm2);
              this.clusterGrid.disegnaClusterGrid(this);
            }, 100);
            break;
          case 'PT':
            // this.pivotComponent.disegnaPivot(this);
            break;
          case 'M':
            this.caricamentoMappaInCorso = true;

            this.staDisegnandoPath[this.NumeroFrame2] = true;
            this.staDisegnandoOverlay[this.NumeroFrame2] = true;
            this.staDisegnandoLegenda[this.NumeroFrame2] = true;
            this.staDisegnandoPathClickato[this.NumeroFrame2] = true;
            this.staDisegnandoServingCell[this.NumeroFrame2] = true;
            this.staDisegnandoPuntoSelezionato[this.NumeroFrame2] = true;
            this.staCaricandoPiantina = true;
            this.staDisegnandoSartPosition[this.NumeroFrame2] = true;
            this.staDisegnandoLayerGeometry[this.NumeroFrame2] = true;

            // alert('1');
            if (this.map1[this.NumeroFrame2]) {
              // logConsole('MAPPA NON Esistente 1. Frame ' + this.NumeroFrame2 + '-' + this.frameAttivo2);
              /* let q = 0;
              this.redrawComponente('Accentratore', this.frameAttivo2);

              const t = setInterval(() => {
                if (this.map1[this.NumeroFrame2]) {
                  clearInterval(t);

                  this.gestisceMappaDaAccentratore(forzaRedraw, "Punto 1");
                } else {
                  q++;
                  if (q > 20) {
                    clearInterval(t);

                    // if (this.debug2 === true) {
                      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Non riesco a creare la mappa', this.NumeroFrame2);
                    // }
                  }
                }
              }, 500);
            } else { */
            const tt = setTimeout(() => {
              clearTimeout(tt);

              this.gestisceMappaDaAccentratore(forzaRedraw, "Punto 2");
            }, 500);
            } else {
              logConsole('Mappa non presente per accentratore', this.NumeroFrame2);
            }
            break;
          case 'AE':
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'qui 2', this.NumeroFrame, this.frameAttivo);

            // 05/07/2021 RIMESSO PERCHE' IL FILTRO NON FUNZIONAVA
            // this.offsetAe = -1;
            // 05/07/2021 RIMESSO PERCHE' IL FILTRO NON FUNZIONAVA

            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi da accentratore', this.offsetAe)
            // if (this.debug2 === true) {
            //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Ricarico events da accentratore', this.offsetAe);
            // }
            // this.staCaricandoEvents = true;
            /* this.datiAgents = undefined;
            this.lastCallLista[this.NumeroFrame2] = ''; */
            this.eventsComponent.prendeListaAgents(this); //  , this.offsetAe

            this.eventsComponent.prendeEvents(this, false,  false, false); //  , this.offsetAe

            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Seleziono riga griglia. Frame ' + this.NumeroFrame, this.MappaOGrafico2);
            // this.idSelezionatoAE = -1;
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi letti:', this.datiPointActivityEvents);
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cerco tms ', tms);

            /* this.idSelezionatoAE = [-1];
            if (this.datiPointActivityEvents) {
              if (this.datiPointActivityEvents.DataTable) {
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto il tms attuale sull\'event', this.Utils.tmsSelezionato);
                this.datiPointActivityEvents.DataTable.forEach(element => {
                  if (this.idSelezionatoAE.length === 0) {
                    if (+this.timeFilter !== 2) {
                      if (element.tms) {
                        if (this.idSelezionatoAE[0] === -1) {
                          this.idSelezionatoAE = new Array();
                        }
                        if (element) {
                          this.idSelezionatoAE.push(element.ROW_ID);
                        }
                      }
                    } else {
                      if (element.tms && element.tms.indexOf(this.Utils.tmsSelezionato) > - 1) {
                        if (this.idSelezionatoAE[0] === -1) {
                          this.idSelezionatoAE = new Array();
                        }
                        if (element) {
                          this.idSelezionatoAE.push(element.ROW_ID);
                        }
                      }
                    }
                  }
                });

                if (this.Utils.listaEventiSE) {
                  if (this.Utils.listaEventiSE && typeof(this.Utils.listaEventiSE) === 'string') {
                    this.Utils.listaEventiSE = JSON.parse(this.Utils.listaEventiSE);
                  }
                  this.Utils.listaEventiSE.forEach(element => {
                    if (this.idSelezionatoAE[0] === -1) {
                      this.idSelezionatoAE = new Array();
                    }
                    if (element) {
                      this.idSelezionatoAE.push(element.ROW_ID);
                    }
                  });
                }
                if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Righe selezionate AE 2', this.idSelezionatoAE);
                }
              }
            } */
            break;
          case 'PK':
            // if (this.MappaOGrafico2 === 'PK') {
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno point cell measures. Frame ' + this.NumeroFrame, this.MappaOGrafico2);
              // const tm = setTimeout(() => {
            // clearTimeout(tm);
                this.pointCellMeasures.prendePointCellMeasures(this);
              // }, 100);
            // }
            break;
          case 'CD':
              // if (this.MappaOGrafico2 === 'CD') {
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cdr data. Frame ' + this.NumeroFrame, this.MappaOGrafico2);
                // const tm = setTimeout(() => {
            // clearTimeout(tm);
                  this.cdrData.caricaCDRData(this);
                // }, 100);
              // }
              break;
          case 'LA':
            // if (this.MappaOGrafico2 === 'LA') {
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno cdr_data. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
              // const tm = setTimeout(() => {
            // clearTimeout(tm);
              this.activities.caricaActivities(this);
              // }, 100);
            // }
            break;
          case 'CV':
                // if (this.MappaOGrafico2 === 'CV') {
                  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno point cell measures. Frame ' + this.NumeroFrame, this.MappaOGrafico, tms);
                  // const tm = setTimeout(() => {
            // clearTimeout(tm);
                    this.cdrVoice.caricaCDRVoice(this);
                  // }, 100);
                // }
                break;
          case 'MC':
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorna grafici 1');
            // const tm = setTimeout(() => {
            // clearTimeout(tm);
            this.graficiComponent.disegnaGrafici(this, false);
            // }, 100);

            /* if (this.cambiatoGrafico1 === true) {
              this.scriviLog('Grafico 1', '');
              this.richiestaGeoServerPerGrafico();
            } */
              break;
          case 'PS':
            // alert('Scatter: ' + this.forzaRidisegnoScatter);
            if (this.forzaRidisegnoScatter === undefined) {
              this.forzaRidisegnoScatter = true;
            }
            this.scatterComponent.disegnaScatter(this, false, this.forzaRidisegnoScatter);
            this.forzaRidisegnoScatter = false;
            break;
          case 'AH':
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno histogram. Frame ' + this.NumeroFrame, this, this.MappaOGrafico, this.Measure);
            // const tm = setTimeout(() => {
            //   clearTimeout(tm);

              // logConsole('Disegno istogrammi 3', this.NumeroFrame2);
              this.histogramComponent.disegnaHistogram(this, false, false);
            // }, 100);
            break;
          case 'AI':
            this.areaInfoComponent.disegnaAreaInfo(this);
            break;
          case 'AP':
            this.arfcnPoint.caricaArfcnPoint(this, this.Utils.tmsSelezionato, false, 'RefreshAggiornaTmsSelezionato');
            break;
          case 'AR':
            this.arfcnComponent.disegnaArfcn(this);
            break;
          case 'AA':
            this.arfcnComponent_am.disegnaArfcn(this);
            break;
          case 'PC':
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno pareto da accentratore. Frame ' + this.NumeroFrame, this.MappaOGrafico,
            //       this.Utils.tmsSelezionato, this.Measure);
            // this.paretoComponent.pulisceValoriDiAppoggio(this);
            this.paretoComponent.disegnaPareto(this, false, this.forzaRidisegnoPareto, 'Accentratore');
            this.forzaRidisegnoPareto = false;
            break;
          case 'ES':
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno event summary accentratore. Frame ' + this.NumeroFrame, this.MappaOGrafico2);
            // const tm = setTimeout(() => {
            // clearTimeout(tm);
            this.eventsComponent.caricaEventSummary(this);
            // }, 1000);
            break;
          case 'TC':
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno event summary accentratore. Frame ' + this.NumeroFrame, this.MappaOGrafico2);
            // const tm = setTimeout(() => {
            // clearTimeout(tm);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Carico TCRUN grid 2')

            this.caricaTcRunGrid('Accentratore');
            // }, 1000);
            break;
          case 'TP':
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno event summary accentratore. Frame ' + this.NumeroFrame, this.MappaOGrafico2);
            // const tm = setTimeout(() => {
            // clearTimeout(tm);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Carico TCRUN grid Pivot 2')
            // }, 1000);
            break;
          case 'NP':
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno event summary accentratore. Frame ' + this.NumeroFrame, this.MappaOGrafico2);
            // const tm = setTimeout(() => {
            // clearTimeout(tm);
            this.caricaNPS();
            // }, 1000);
            break;
          case 'CM':
            this.caricaCM();
            break;
          case 'M2':
            this.caricaM2();
            break;
          case 'MF':
            this.caricaMF();
            break;
          case 'MS':
            this.caricaMStat();
            break;
          case 'MQ':
            this.caricaMQ();
            break;
          case 'MR':
            this.caricaMR();
            break;
          case 'PM':
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Prendo Point Measures');
            this.pointComponent.prendePointMeasures(this, this.Utils.tmsSelezionato, false, 'Accentratore');
            break;
      }
      // this.applicaModifiche();

      // MEASURE
      if (this.MappaOGrafico2 === 'M') {
        this.scriviLog('Measures', '');
        // this.cambiatoMeasure = false;
        if (this.impostazioni.isCheckedMeasure) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno misure in accentratore');
          this.measuresComponent.disegnaMeasure(this);
          this.measuresComponent.disegnaMeasureSample(this, false);
        } else {
          let q = 0;
          this.measureLayer.forEach(element => {
            this.removeLayerFromMap('Measure Layer ' + q, element);
            q++;
          });
          this.wms.forEach(element => {
            this.wms = undefined;
          });

          // this.applicaModifiche();
        }
      // }
      // MEASURE

        this.scriviLog('Events', '');
        /* if (this.impostazioni.isCheckedMeasure) {
          if (this.MappaOGrafico2 === 'M') {
            this.eventsComponent.disegnaEventsSuMappa(this, 'Accentratore1');
          }
        } else {
          if (this.pathEvents[this.NumeroFrame2]) {
            this.removeLayerFromMap('Path Events', this.pathEvents[this.NumeroFrame2]);
          }
        } */

        this.esegueChiamataLayers(true, 'Accentratore');
        // this.updateMappa();
        // this.applicaModifiche();
    }
      
  // }, 250);
}

esegueChiamataLayers(forzaRefresh, daDove) {
  // ANTENNE
  // if (this.cambiatoAntenne1 === true) {
  if (this.MappaOGrafico2 === 'M') {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Antenne 1', this.NumeroFrame);
    this.cambiatoAntenne1 = false;

    if (forzaRefresh) {
      this.lastCallAntenne[this.NumeroFrame2] = '';
      /* if (this.antennaLayer1) {
        this.removeLayerFromMap('Antenna layer 1', this.antennaLayer1);
        this.antennaLayer1 = undefined;
      }
      if (this.antennaLayer2) {
        this.removeLayerFromMap('Antenna layer 1', this.antennaLayer2);
        this.antennaLayer2 = undefined;
      } */
    }
    this.antenneComponent.disegnaAntenne1e2(this, daDove + '-EsegueChiamataLayers');

    if (forzaRefresh) {
      this.lastCallEventi[this.NumeroFrame2] = '';
      /* if (this.pathEvents[this.NumeroFrame2]) {
        this.removeLayerFromMap('Events', this.pathEvents[this.NumeroFrame2]);
        this.pathEvents[this.NumeroFrame2] = undefined;
        this.wmsEvents[this.NumeroFrame2] = undefined;
      } */
    }
    this.eventsComponent.disegnaEventsSuMappa(this, daDove + '-EsegueChiamataLayers');

    if (forzaRefresh) {
      let i = 0;
      /* this.lastCallMeasures[this.NumeroFrame2].forEach(element => {
        if (this.measureLayer[this.NumeroFrame2][i]) {
          this.removeLayerFromMap('Measure layer' + i, this.measureLayer[this.NumeroFrame2][i]);
          this.measureLayer[this.NumeroFrame2][i] = undefined;
        }
        this.lastCallMeasures[this.NumeroFrame2][i] = '';
        i++;
      }); */
    }
    this.measuresComponent.disegnaMeasure(this);

    if (forzaRefresh) {
      this.lastCallPath[this.NumeroFrame2] = '';
      /* if (this.pathLayerClickato[this.NumeroFrame2]) {
        this.removeLayerFromMap('Path Layer click', this.pathLayerClickato[this.NumeroFrame2]);
        this.pathLayerClickato[this.NumeroFrame2] = undefined;
        this.lastCallPath[this.NumeroFrame2] = '';
        this.staDisegnandoPathClickato[this.NumeroFrame2] = false;
      } */
    }
    this.pathComponent.disegnaPathClickato(this, this.tmsSelezionato);

    if (forzaRefresh) {
      this.lastCallPath2[this.NumeroFrame2] = '';
      /* if (this.pathServingCell) {
        this.removeLayerFromMap('Path serving cell 2', this.pathServingCell);
        this.pathServingCell = undefined;
      } */
    }
    this.pathComponent.disegnaServingCell(this, this.tmsSelezionato);

    if (forzaRefresh) {
      this.lastCallPathSC[this.NumeroFrame2] = '';
      /* if (this.pathShowRays) {
        this.removeLayerFromMap('Path show rays 2', this.pathShowRays);
        this.pathShowRays = undefined;
      } */
    }
    this.pathComponent.disegnaShowRays(this, this.tmsSelezionato);

    if (forzaRefresh) {
      this.lastCallMeasuresSMS[this.NumeroFrame2] = '';
      /* if (this.layerMeasureSMS) {
        this.removeLayerFromMap('Layer SMS 2', this.layerMeasureSMS);
        this.layerMeasureSMS = undefined;
      } */
    }
    this.measuresComponent.disegnaMeasureSample(this, false);
  }
    // }
  // ANTENNE
}

chiudeMascheraPL() {
  this.visibileMascheraPL = false;
  this.fattoClickSuPlanimetria = false;

  PlanimetryComponent.lastCallImmagine[this.NumeroFrame] = '';
  this.planimetry.caricaPiantina(this);
  
  // this.planimetry.caricaPiantina(this, true);
  // this.planimetry.pulisceInteraction(this);
}

// actionSubject = new Subject<void>();

caricaCM() {
  /* this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = true;
  this.actionSubject.next();

  this.actionSubject.pipe(
    debounceTime(2000) // attende 2000ms di inattività
  ).subscribe(() => {
    this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = false;
    this.cellMeasure.caricaCellMeasure(this, 'Accentratore');
  }); */
  this.cellMeasure.caricaCellMeasure(this, 'Accentratore');
}

caricaM2() {
  /* this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = true;
  this.actionSubject.next();

  this.actionSubject.pipe(
    debounceTime(2000) // attende 2000ms di inattività
  ).subscribe(() => {
    this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = false;
    this.cellMeasure.caricaCellMeasure(this, 'Accentratore');
  }); */
  this.mistral_grid.caricaMC(this, 'Accentratore');
}

caricaMF() {
  /* this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = true;
  this.actionSubject.next();

  this.actionSubject.pipe(
    debounceTime(2000) // attende 2000ms di inattività
  ).subscribe(() => {
    this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = false;
    this.cellMeasure.caricaCellMeasure(this, 'Accentratore');
  }); */
  this.mistral_flow.caricaMF(this, 'Accentratore');
}

caricaMStat() {
  /* this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = true;
  this.actionSubject.next();

  this.actionSubject.pipe(
    debounceTime(2000) // attende 2000ms di inattività
  ).subscribe(() => {
    this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = false;
    this.cellMeasure.caricaCellMeasure(this, 'Accentratore');
  }); */
  this.mistral_flow_stat.caricaMFStat1(this, 'Accentratore');
}

caricaMQ() {
  /* this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = true;
  this.actionSubject.next();

  this.actionSubject.pipe(
    debounceTime(2000) // attende 2000ms di inattività
  ).subscribe(() => {
    this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = false;
    this.cellMeasure.caricaCellMeasure(this, 'Accentratore');
  }); */
  this.mistral_flow_queue.caricaMQ(this, 'Accentratore');
}

caricaMR() {
  /* this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = true;
  this.actionSubject.next();

  this.actionSubject.pipe(
    debounceTime(2000) // attende 2000ms di inattività
  ).subscribe(() => {
    this.caricamentoCellMeasuresInCorso[this.NumeroFrame2] = false;
    this.cellMeasure.caricaCellMeasure(this, 'Accentratore');
  }); */
  this.mistral_rbc_ixl.caricaMR(this, 'Accentratore');
}

gestisceMappaDaAccentratore(forzaRedraw, daDove) {
  // logConsole('Chiamo gestisceMappaDaAccentratore', this.NumeroFrame2, daDove);

  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Scrive valori misure', daDove);

  // this.scriveValoriMisure();
  const arrayM = this.prendeMisurePerLegenda();
  this.legendaComponent.disegnaLegenda(this, arrayM, false);
  this.contaScala();

  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ridisegno mappa frame', this.NumeroFrame);

  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna mappa', this.NumeroFrame2, daDove);
  this.disegnaMappa1(forzaRedraw, "DA ACCENTRATORE " + daDove);    

  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna Antenne', this.NumeroFrame2, daDove);
  // this.antenneComponent.disegnaAntenne1e2(this);

  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna eventu', this.NumeroFrame2, daDove);
  // this.eventsComponent.disegnaEventsSuMappa(this);

  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna path', this.NumeroFrame2, daDove);
  this.pathComponent.disegnaPath(this);

  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna overlay', this.NumeroFrame2, daDove);
  this.pathComponent.disegnaOverlay(this);

  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna add layers', this.NumeroFrame2, daDove);
  this.additional_Layer.disegnaAddLayers(this);

  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna all layers', this.NumeroFrame2, daDove);
  this.showRaysAllLayerC.disegnaAllLayers(this, this.coordinateSREL, false, 'Accentratore');

  const array = this.prendeMisurePerLegenda();
  if (array && array.length > 0) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Measure);
    this.legendaComponent.disegnaLegenda(this, array, false);
  } else {
    this.staDisegnandoLegenda[this.NumeroFrame2] = false;
  }

  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore. Parametri aggiorna mappa ' + daDove, this.NumeroFrame2, this.Utils.tmsSelezionato,
      this.tmsSelezionato, this.strutturaClick);
  if (this.Utils.tmsSelezionato || this.eseguitoInProgetto2 === true) {
    const tms = this.Utils.tmsSelezionato; //  this.strutturaClick.tms;
    // if (!tms) {
    //   tms = this.strutturaClick.tms_min;
    // }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.isSyncTms, this.Utils.mappaClickata, this.NumeroFrame);
    // if ((this.isSyncTms === true && this.Utils.mappaClickata !== this.NumeroFrame)) {
    this.pathComponent.disegnaPathClickato(this, tms);
    this.puntoSelezionatoComponent.disegnaPuntoSelezionato(this, tms);
    if (this.Utils.tmsSelezionato) {
      this.pathComponent.disegnaServingCell(this, tms);
      this.pathComponent.disegnaShowRays(this, tms);
    } else {
      this.staDisegnandoPathClickato[this.NumeroFrame2] = false;
      this.staDisegnandoServingCell[this.NumeroFrame2] = false;
      this.staDisegnandoPuntoSelezionato[this.NumeroFrame2] = false;
      this.staDisegnandoSartPosition[this.NumeroFrame2] = false;
    }
      // }
  } else {
    this.staDisegnandoPathClickato[this.NumeroFrame2] = false;
    this.staDisegnandoServingCell[this.NumeroFrame2] = false;
    this.staDisegnandoPuntoSelezionato[this.NumeroFrame2] = false;
    this.staDisegnandoSartPosition[this.NumeroFrame2] = false;
  }
  this.pathComponent.disegnaAgentPosition(this, this.agnGroup2);
  this.pathComponent.disegnaSchedSel(this, this.agnGroup2);
  // if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG[0] && ExternalUtilities.rigaSelezionataMG[0].NAME &&
  //   ExternalUtilities.rigaSelezionataMG[0].NAME !== 'DrawnPolygon') {
  // if (this.NumeroFrame2 !== this.frameCheHaDisegnatoBox) {
    this.mosaicGrid.caricamentoLayerGeometry(this);
    this.clusterGrid.caricamentoLayerGeometry(this);

    if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.vectorMDP) {
      this.addLayerToMap(this.vectorMDP, 19, 'VectorMDP');
    }

  // }
  // }

  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto zoom:', this.currZoom);

  /* if (this.currZoom > -1) {
    this.viewMappaAttuale.options_.zoom = this.currZoom;
    // this.map1[this.NumeroFrame2].getView().setZoom(this.currZoom);
  } else {
    this.currZoom = this.map1[this.NumeroFrame2].getView().getZoom();
  } */

  // Carica piantina e features per modifica
  /* if (this.Utils.sceltaActivityDaSet && this.Utils.sceltaActivityDaSet[1]) {
    if (this.debug2) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity scelta', this.Utils.sceltaActivityDaSet[1], this.NumeroFrame2);
    }
    this.act_set_id2 = this.Utils.sceltaActivityDaSet[1][0].ID; */
    this.planimetry.caricaPiantina(this);
  // }
  // this.planimetry.creaFeature(this);
  // Carica piantina e features per modifica

  // this.additional_Layer.disegnaAddLayers(this);

  let q = 0;
  /* if (this.subscribeAttesaMappa[this.NumeroFrame2]) {
    this.subscribeAttesaMappa[this.NumeroFrame2].unsubscribe();
  }
  this.caricamentoMappaInCorso = true;

  this.subscribeAttesaMappa[this.NumeroFrame2] = Observable.timer(0, 1000)
  .take(32000)
  .subscribe(() => {
    if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame,
        this.staDisegnandoPath[this.NumeroFrame2],
        this.staDisegnandoOverlay[this.NumeroFrame2],
        this.staDisegnandoLegenda[this.NumeroFrame2],
        this.staDisegnandoPathClickato[this.NumeroFrame2],
        this.staDisegnandoServingCell[this.NumeroFrame2],
        this.staDisegnandoPuntoSelezionato[this.NumeroFrame2],
        this.staDisegnandoSartPosition[this.NumeroFrame2],
        this.staDisegnandoLayerGeometry[this.NumeroFrame2]
      );
    }
    let pendings = '';
    if (this.staDisegnandoPath[this.NumeroFrame2]) {
      pendings += 'Path<br />';
    }
    if (this.staDisegnandoOverlay[this.NumeroFrame2]) {
      pendings += 'Overlay<br />';
    }
    if (this.staDisegnandoLegenda[this.NumeroFrame2]) {
      pendings += 'Legenda<br />';
    }
    if (this.staDisegnandoPathClickato[this.NumeroFrame2]) {
      pendings += 'Selected Path<br />';
    }
    if (this.staDisegnandoServingCell[this.NumeroFrame2]) {
      pendings += 'Serving Cell<br />';
    }
    if (this.staDisegnandoPuntoSelezionato[this.NumeroFrame2]) {
      pendings += 'Selected Point<br />';
    }
    if (this.staCaricandoPiantina[this.NumeroFrame2]) {
      pendings += 'Planimetry<br />';
    }
    if (this.staDisegnandoSartPosition[this.NumeroFrame2]) {
      pendings += 'Sart position<br />';
    }
    if (this.staDisegnandoLayerGeometry[this.NumeroFrame2]) {
      pendings += 'Layer Geometry<br />';
    }
    /* if (pendings !== '') {
      pendings = 'Pendings:<hr />' + pendings;
    } * /
    this.pendings = pendings;

    if (this.staDisegnandoPath[this.NumeroFrame2] === false &&
      this.staDisegnandoOverlay[this.NumeroFrame2] === false &&
      this.staDisegnandoLegenda[this.NumeroFrame2] === false &&
      this.staDisegnandoPathClickato[this.NumeroFrame2] === false &&
      this.staDisegnandoServingCell[this.NumeroFrame2] === false &&
      this.staDisegnandoPuntoSelezionato[this.NumeroFrame2] === false &&
      this.staDisegnandoSartPosition[this.NumeroFrame2] === false &&
      this.staDisegnandoLayerGeometry[this.NumeroFrame2] === false) {

      this.caricamentoMappaInCorso = false;

      // const tm = setTimeout(() => {
          clearTimeout(tm);
        this.finisceDiDisegnareMappe('GestMappaDaAccentratore');
        /* if (this.map1[this.NumeroFrame2]) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ATTIVO MoveEND', this.NumeroFrame2);
          // this.map1[this.NumeroFrame2].un('moveend', this.moveEnd);

          // LISTA EVENTI ASSOCIABILI ALLA MAPPA OL
          // https://gis.stackexchange.com/questions/252946/what-are-the-possible-listeners-and-event-types-for-an-openlayers-map-ol-map
          // LISTA EVENTI ASSOCIABILI ALLA MAPPA OL

          // this.map1[this.NumeroFrame2].on('movestart', this.moveStart.bind(null, this));
          this.map1[this.NumeroFrame2].on('moveend', this.moveEnd.bind(null, this));

          // this.map1[this.NumeroFrame2].un('precompose', this.preCompose);
          this.map1[this.NumeroFrame2].on('precompose', this.preCompose.bind(null, this));
          this.map1[this.NumeroFrame2].on('postcompose', this.postCompose.bind(null, this));
          /* this.map1[this.NumeroFrame2].un('mousemove', this.mouseMove);
          this.map1[this.NumeroFrame2].on('mousemove', this.mouseMove.bind(null, this));

          this.map1[this.NumeroFrame2].un('mouseout', this.mouseOut);
          this.map1[this.NumeroFrame2].on('mouseout', this.mouseOut.bind(null, this));

          this.map1[this.NumeroFrame2].un('postrender', this.postrender);
          this.map1[this.NumeroFrame2].on('postrender', this.postrender.bind(null, this)); */

          // this.map1[this.NumeroFrame2].addEventListener('mousemove', this.mouseMove);
          
          /* const container = document.getElementById('frameM_' + this.NumeroFrame + '_' + this.frameAttivo2);
          if (container && container !== null) {
            container.addEventListener('mousemove', this.mouseMove.bind(null, this));
            container.addEventListener('mouseout', this.mouseOut.bind(null, this));
          } * /

          // container.addEventListener('postrender', this.postrender.bind(null, this));
        } * /

        this.caricamentoMappaInCorso = false;

        //////// this.creaLayerBBOX();
      // }, 2000);
      this.subscribeAttesaMappa[this.NumeroFrame2].unsubscribe();
    } else {
      q++;
      if (q === 60) {
        this.caricamentoMappaInCorso = false;
        this.subscribeAttesaMappa[this.NumeroFrame2].unsubscribe();
      }
    }
  }); */

  const t = setInterval(() => { 
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame,
        this.staDisegnandoPath[this.NumeroFrame2],
        this.staDisegnandoOverlay[this.NumeroFrame2],
        this.staDisegnandoLegenda[this.NumeroFrame2],
        this.staDisegnandoPathClickato[this.NumeroFrame2],
        this.staDisegnandoServingCell[this.NumeroFrame2],
        this.staDisegnandoPuntoSelezionato[this.NumeroFrame2],
        this.staDisegnandoSartPosition[this.NumeroFrame2],
        this.staDisegnandoLayerGeometry[this.NumeroFrame2]
      );
    // }
    let pendings = '';
    if (this.staDisegnandoPath[this.NumeroFrame2]) {
      pendings += 'Path<br />';
    }
    if (this.staDisegnandoOverlay[this.NumeroFrame2]) {
      pendings += 'Overlay<br />';
    }
    if (this.staDisegnandoLegenda[this.NumeroFrame2]) {
      pendings += 'Legenda<br />';
    }
    if (this.staDisegnandoPathClickato[this.NumeroFrame2]) {
      pendings += 'Selected Path<br />';
    }
    if (this.staDisegnandoServingCell[this.NumeroFrame2]) {
      pendings += 'Serving Cell<br />';
    }
    if (this.staDisegnandoPuntoSelezionato[this.NumeroFrame2]) {
      pendings += 'Selected Point<br />';
    }
    if (this.staCaricandoPiantina[this.NumeroFrame2]) {
      pendings += 'Planimetry<br />';
    }
    if (this.staDisegnandoSartPosition[this.NumeroFrame2]) {
      pendings += 'Sart position<br />';
    }
    if (this.staDisegnandoLayerGeometry[this.NumeroFrame2]) {
      pendings += 'Layer Geometry<br />';
    }
    /* if (pendings !== '') {
      pendings = 'Pendings:<hr />' + pendings;
    } */
    this.pendings = pendings;

    if (this.staDisegnandoPath[this.NumeroFrame2] === false &&
      this.staDisegnandoOverlay[this.NumeroFrame2] === false &&
      this.staDisegnandoLegenda[this.NumeroFrame2] === false &&
      this.staDisegnandoPathClickato[this.NumeroFrame2] === false &&
      this.staDisegnandoServingCell[this.NumeroFrame2] === false &&
      this.staDisegnandoPuntoSelezionato[this.NumeroFrame2] === false &&
      this.staDisegnandoSartPosition[this.NumeroFrame2] === false &&
      this.staDisegnandoLayerGeometry[this.NumeroFrame2] === false) {

      this.caricamentoMappaInCorso = false;

      // const tm = setTimeout(() => {
      //     clearTimeout(tm);
        this.impostaEventiSuMappa('GestMappaDaAccentratore');
        /* if (this.map1[this.NumeroFrame2]) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ATTIVO MoveEND', this.NumeroFrame2);
          // this.map1[this.NumeroFrame2].un('moveend', this.moveEnd);

          // LISTA EVENTI ASSOCIABILI ALLA MAPPA OL
          // https://gis.stackexchange.com/questions/252946/what-are-the-possible-listeners-and-event-types-for-an-openlayers-map-ol-map
          // LISTA EVENTI ASSOCIABILI ALLA MAPPA OL

          // this.map1[this.NumeroFrame2].on('movestart', this.moveStart.bind(null, this));
          this.map1[this.NumeroFrame2].on('moveend', this.moveEnd.bind(null, this));

          // this.map1[this.NumeroFrame2].un('precompose', this.preCompose);
          this.map1[this.NumeroFrame2].on('precompose', this.preCompose.bind(null, this));
          this.map1[this.NumeroFrame2].on('postcompose', this.postCompose.bind(null, this));
          /* this.map1[this.NumeroFrame2].un('mousemove', this.mouseMove);
          this.map1[this.NumeroFrame2].on('mousemove', this.mouseMove.bind(null, this));

          this.map1[this.NumeroFrame2].un('mouseout', this.mouseOut);
          this.map1[this.NumeroFrame2].on('mouseout', this.mouseOut.bind(null, this));

          this.map1[this.NumeroFrame2].un('postrender', this.postrender);
          this.map1[this.NumeroFrame2].on('postrender', this.postrender.bind(null, this)); */

          // this.map1[this.NumeroFrame2].addEventListener('mousemove', this.mouseMove);
          
          /* const container = document.getElementById('frameM_' + this.NumeroFrame + '_' + this.frameAttivo2);
          if (container && container !== null) {
            container.addEventListener('mousemove', this.mouseMove.bind(null, this));
            container.addEventListener('mouseout', this.mouseOut.bind(null, this));
          } * /

          // container.addEventListener('postrender', this.postrender.bind(null, this));
        } */

        this.caricamentoMappaInCorso = false;

        ////// this.creaLayerBBOX();
      // }, 2000);
      // this.subscribeAttesaMappa[this.NumeroFrame2].unsubscribe();
      clearInterval(t)
    } else {
      q++;
      if (q === 60) {
        this.caricamentoMappaInCorso = false;
        // this.subscribeAttesaMappa[this.NumeroFrame2].unsubscribe();
        clearInterval(t)
      }
    }
  }, 1000);

  /* this.caricamentoMappaInCorso = true;

  this.staDisegnandoPath[this.NumeroFrame2] = true;
  this.staDisegnandoOverlay[this.NumeroFrame2] = true;
  this.staDisegnandoLegenda[this.NumeroFrame2] = true;
  this.staDisegnandoPathClickato[this.NumeroFrame2] = true;
  this.staDisegnandoServingCell[this.NumeroFrame2] = true;
  this.staDisegnandoPuntoSelezionato[this.NumeroFrame2] = true;
  this.staCaricandoPiantina = true;
  this.staDisegnandoSartPosition[this.NumeroFrame2] = true;
  this.staDisegnandoLayerGeometry[this.NumeroFrame2] = true;

  if (this.debug2 === true) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Scrive valori misure');
  }
  this.scriveValoriMisure();
  this.contaScala();

  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ridisegno mappa frame', this.NumeroFrame);

  if (this.debug2 === true) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna mappa');
  }
  this.disegnaMappa1(forzaRedraw);

  if (this.debug2 === true) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna path');
  }
  // this.pathComponent.disegnaPath(this);
  this.esegueFunzione(1, this.staDisegnandoPath[this.NumeroFrame2]).then((Ritorno: String) => {
    if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna overlay');
    }
    this.esegueFunzione(2, this.staDisegnandoOverlay[this.NumeroFrame2]).then((Ritorno: String) => {
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna legenda');
      }
      this.esegueFunzione(3, this.staDisegnandoLegenda[this.NumeroFrame2]).then((Ritorno: String) => {
        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna PathClickato');
        }
        this.esegueFunzione(4, this.staDisegnandoPathClickato[this.NumeroFrame2]).then((Ritorno: String) => {
          if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna Punto Selezionato');
          }
          this.esegueFunzione(5, this.staDisegnandoPuntoSelezionato[this.NumeroFrame2]).then((Ritorno: String) => {
            if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna serving cell');
            }
            this.esegueFunzione(6, this.staDisegnandoServingCell[this.NumeroFrame2]).then((Ritorno: String) => {
              if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna show rays');
              }
              this.esegueFunzione(7, this.staDisegnandoShowRays[this.NumeroFrame2]).then((Ritorno: String) => {
                if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna add layers');
                }
                this.additional_Layer.disegnaAddLayers(this);

                if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore: Disegna all layers');
                }
                this.showRaysAllLayerC.disegnaAllLayers(this, this.coordinateSREL, false);
            });
          });
        });
      });
    });
    });
  });

  if (this.debug2 === true) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Accentratore. Parametri aggiorna mappa', this.NumeroFrame2, this.Utils.tmsSelezionato,
      this.tmsSelezionato, this.strutturaClick);
  }

  // if (this.Utils.tmsSelezionato || this.eseguitoInProgetto22 === true) {
    // const tms = this.Utils.tmsSelezionato; //  this.strutturaClick.tms;
    // if (!tms) {
    //   tms = this.strutturaClick.tms_min;
    // }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.isSyncTms, this.Utils.mappaClickata, this.NumeroFrame);
    // if ((this.isSyncTms === true && this.Utils.mappaClickata !== this.NumeroFrame)) {
    // this.pathComponent.disegnaPathClickato(this, tms);
    // this.puntoSelezionatoComponent.disegnaPuntoSelezionato(this, tms);
    // if (this.Utils.tmsSelezionato) {
    // this.pathComponent.disegnaServingCell(this, tms);
    // this.pathComponent.disegnaShowRays(this, tms);
    // }
      // }
  this.pathComponent.disegnaAgentPosition(this, this.agnGroup2);
  this.pathComponent.disegnaSchedSel(this, this.agnGroup2);
  this.mosaicGrid.caricamentoLayerGeometry(this);
  this.clusterGrid.caricamentoLayerGeometry(this);

  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto zoom:', this.currZoom);

  // Carica piantina e features per modifica
  this.planimetry.caricaPiantina(this);
  // this.planimetry.creaFeature(this);
  // Carica piantina e features per modifica

  // this.additional_Layer.disegnaAddLayers(this);

  if (this.subscribeAttesaMappa[this.NumeroFrame2]) {
    this.subscribeAttesaMappa[this.NumeroFrame2].unsubscribe();
  }
  let q = 0;
  this.subscribeAttesaMappa[this.NumeroFrame2] = Observable.timer(0, 1000)
  .take(32000)
  .subscribe(() => {
    if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame,
        this.staDisegnandoPath[this.NumeroFrame2],
        this.staDisegnandoOverlay[this.NumeroFrame2],
        this.staDisegnandoLegenda[this.NumeroFrame2],
        this.staDisegnandoPathClickato[this.NumeroFrame2],
        this.staDisegnandoServingCell[this.NumeroFrame2],
        this.staDisegnandoPuntoSelezionato[this.NumeroFrame2],
        this.staDisegnandoSartPosition[this.NumeroFrame2],
        this.staDisegnandoLayerGeometry[this.NumeroFrame2]
      );
    }
    let pendings = '';
    if (this.staDisegnandoPath[this.NumeroFrame2]) {
      pendings += 'Path<br />';
    }
    if (this.staDisegnandoOverlay[this.NumeroFrame2]) {
      pendings += 'Overlay<br />';
    }
    if (this.staDisegnandoLegenda[this.NumeroFrame2]) {
      pendings += 'Legenda<br />';
    }
    if (this.staDisegnandoPathClickato[this.NumeroFrame2]) {
      pendings += 'Selected Path<br />';
    }
    if (this.staDisegnandoServingCell[this.NumeroFrame2]) {
      pendings += 'Serving Cell<br />';
    }
    if (this.staDisegnandoPuntoSelezionato[this.NumeroFrame2]) {
      pendings += 'Selected Point<br />';
    }
    if (this.staCaricandoPiantina[this.NumeroFrame2]) {
      pendings += 'Planimetry<br />';
    }
    if (this.staDisegnandoSartPosition[this.NumeroFrame2]) {
      pendings += 'Sart position<br />';
    }
    if (this.staDisegnandoLayerGeometry[this.NumeroFrame2]) {
      pendings += 'Layer Geometry<br />';
    }

    this.pendings = pendings;

    if (this.staDisegnandoPath[this.NumeroFrame2] === false &&
      this.staDisegnandoOverlay[this.NumeroFrame2] === false &&
      this.staDisegnandoLegenda[this.NumeroFrame2] === false &&
      this.staDisegnandoPathClickato[this.NumeroFrame2] === false &&
      this.staDisegnandoServingCell[this.NumeroFrame2] === false &&
      this.staDisegnandoPuntoSelezionato[this.NumeroFrame2] === false &&
      this.staDisegnandoSartPosition[this.NumeroFrame2] === false &&
      this.staDisegnandoLayerGeometry[this.NumeroFrame2] === false) {

      this.finisceDiDisegnareMappe(false);
      } else {
      q++;
      if (q >= 10) {
        this.finisceDiDisegnareMappe(true);
      }
    }
  }); */
}

esegueFunzione(qualeFunzione, variabileDiControllo) {
  logConsole('EsegueFunzione', this.NumeroFrame2, qualeFunzione);

  return new Promise(async (Ritorno) => {
    const tms = this.Utils.tmsSelezionato;
    const inizio = new Date().getTime();

    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esegue Funzione: Ingresso funzione ', qualeFunzione)
    // }
    let q = 0;
    switch (qualeFunzione) {
      case 1:
        this.pathComponent.disegnaPath(this);
        break;
      case 2:
        this.pathComponent.disegnaOverlay(this);
        break;
      case 3:
        const array = this.prendeMisurePerLegenda();
        this.legendaComponent.disegnaLegenda(this, array, false);
        break;
      case 4:
        this.pathComponent.disegnaPathClickato(this, tms);
        break;
      case 5:
        this.puntoSelezionatoComponent.disegnaPuntoSelezionato(this, tms);
        break;
      case 6:
        this.pathComponent.disegnaServingCell(this, tms);
        break;
      case 7:
        this.pathComponent.disegnaShowRays(this, tms);
        break;
    }

    const timerAttesa = setInterval(() => {
      if (variabileDiControllo === false) {
        clearInterval(timerAttesa);

        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esegue Funzione: Funzione eseguita ', qualeFunzione, new Date().getTime() - inizio);
        // }

        Ritorno('OK');
      } else {
        q++;
        if (q > 10) {
          clearInterval(timerAttesa);

          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esegue Funzione: Funzione NON eseguita ', qualeFunzione, new Date().getTime() - inizio);
          // }

          Ritorno('KO');
        }
      }
    }, 100)
  });
}

bloccaEventiSuMappa(daDove) {
  // logConsole('Blocco eventi su mappa da ' + daDove, this.NumeroFrame2);

  if (this.map1[this.NumeroFrame2]) {
    if (this.moveEndHandler) {
      this.map1[this.NumeroFrame2].un('moveend', this.moveEndHandler);
    }
    if (this.preComposeHandler) {
      this.map1[this.NumeroFrame2].un('precompose', this.preComposeHandler);
    }
    if (this.postComposeHandler) {
      this.map1[this.NumeroFrame2].un('postcompose', this.postComposeHandler);
    }
    if (this.singleClickHandler) {
      this.map1[this.NumeroFrame2].un('singleclick', this.singleClickHandler);
    }
  }
}

private moveEndHandler: (event: any) => void;
private preComposeHandler: (event: any) => void;
private postComposeHandler: (event: any) => void;
private singleClickHandler: (event: any) => void;

impostaEventiSuMappa(daDove) {
  const t = setTimeout(() => {
    // logConsole('Imposto eventi su mappa da ' + daDove, this.NumeroFrame2);

    clearTimeout(t);
    // logConsole('finisce');
    // const tm = setTimeout(() => {
    //         clearTimeout(tm);
    if (this.map1[this.NumeroFrame2]) {
      // Rimuove gli handler registrati in precedenza: senza questo, ogni chiamata li accumula sulla stessa mappa
      this.bloccaEventiSuMappa('impostaEventiSuMappa');

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ATTIVO MoveEND', this.NumeroFrame2);
      // this.map1[this.NumeroFrame2].un('moveend', this.moveEnd);
      // this.map1[this.NumeroFrame2].on('movestart', this.moveStart.bind(null, this));
      // alert('2');

      // this.map1[this.NumeroFrame2].on('moveend', this.moveEnd.bind(null, this));
      this.moveEndHandler = this.inZonaAngular((event) => this.moveEnd(this, event));
      this.map1[this.NumeroFrame2].on('moveend', this.moveEndHandler);
      
      // this.map1[this.NumeroFrame2].un('precompose', this.preCompose);
      this.preComposeHandler = (event) => this.preCompose(this, event);
      this.map1[this.NumeroFrame2].on('precompose', this.preComposeHandler);
      // this.map1[this.NumeroFrame2].on('precompose', this.preCompose.bind(null, this));
      
      // this.map1[this.NumeroFrame2].on('postcompose', this.postCompose.bind(null, this));
      this.postComposeHandler = (event) => this.postCompose(this, event);
      this.map1[this.NumeroFrame2].on('postcompose', this.postComposeHandler);
  
      // this.map1[this.NumeroFrame2].on('singleclick', this.clickOnMap.bind(null, this));
      this.singleClickHandler = this.inZonaAngular((event) => this.clickOnMap(this, event));
      this.map1[this.NumeroFrame2].on('singleclick', this.singleClickHandler);
  
      /* this.map1[this.NumeroFrame2].un('mousemove', this.mouseMove);
      this.map1[this.NumeroFrame2].on('mousemove', this.mouseMove.bind(null, this));
  
      this.map1[this.NumeroFrame2].un('mouseout', this.mouseOut);
      this.map1[this.NumeroFrame2].on('mouseout', this.mouseOut.bind(null, this));
  
      this.map1[this.NumeroFrame2].un('postrender', this.postrender);
      this.map1[this.NumeroFrame2].on('postrender', this.postrender.bind(null, this)); */
  
      // this.map1[this.NumeroFrame2].addEventListener('mousemove', this.mouseMove);
      
      /* const container = document.getElementById('frameM_' + this.NumeroFrame + '_' + this.frameAttivo2);
      container.addEventListener('mousemove', this.mouseMove.bind(null, this));
      container.addEventListener('mouseout', this.mouseOut.bind(null, this)); */
  
      // container.addEventListener('postrender', this.postrender.bind(null, this));
    }
  
    /* this.caricamentoMappaInCorso = false;
  
    this.creaLayerBBOX();
    // }, 2000);
    this.subscribeAttesaMappa[this.NumeroFrame2].unsubscribe(); */      
  }, 1000);
}

staAttendendoNPS = false;

caricaNPS() {
  if (this.staAttendendoNPS === false) {
    this.staAttendendoNPS = true;
    let c = 0;
    const t = setInterval(() => {
      let cosa;
      if (this.eseguitoInProgetto2 === false) {
        cosa = this.act_set;
      } else {
        if (this.timeFilter === 4) {
          cosa = this.Utils.nomeActivitySelezionata;
        } else {
          cosa = this.act_set;
        }
      }
      if (cosa !== undefined && cosa !== null && cosa !== '') {
        this.staAttendendoNPS = false;
        clearInterval(t);
        this.NPSComponent.caricaNPS(this);
      } else {
        c++;
        if (c > 10) {
          this.staAttendendoNPS = false;
          clearInterval(t);
          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'NPS: Uscita da ciclo nps per mancanza di activity')
          // }
        }
      }
    }, 1000);
  }
}

staAttendendoTcRun = false;

caricaTcRunGrid(daDove) {
  // // logConsole('Carica tcrun grid ' + daDove, this.staAttendendoTcRun);

  // if (this.staAttendendoTcRun === false) {
  //   this.staAttendendoTcRun = true;
    let c = 0;
    const t = setInterval(() => {
      let cosa;
      if (this.eseguitoInProgetto2 === false) {
        cosa = this.act_set;
      } else {
        if (this.timeFilter === 4) {
          cosa = this.Utils.nomeActivitySelezionata;
        } else {
          cosa = this.act_set;
        }
      }
      if (cosa !== undefined && cosa !== null && cosa !== '') {
        this.staAttendendoTcRun = false;
        clearInterval(t);
        // this.lastCallTCRun[this.NumeroFrame2] = ""
        // alert('Pulizia 4');
        this.tcRunComponent.caricaTCRunGrid(this);
      } else {
        c++;
        if (c > 10) {
          clearInterval(t);
          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tc Run Grid: Uscita da ciclo tc run per mancanza di activity')
          // }
        }
      }
    }, 1000);
  // } else {
  //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tc Run Grid: Uscita da ciclo tc run per flag sta attendendo vero')
  // }
}

  removeLayerFromMap(nome, l) {
    // if (this.debug2 === true) {
    //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa su remove layer', this.map1[this.NumeroFrame2]);
    //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Layer su remove layer', l);
    // }
    if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== undefined && this.map1[this.NumeroFrame2] !== null) {
      if (l && l !== undefined) {
        // logConsole('Rimozione layer', nome);
        try {
          // logConsole('Controllo funzione layer', nome);
          if (l.getImageLoadFunction) {
            // logConsole('Rimozione funzione layer', nome);
            l.setImageLoadFunction(() => {});
          }
          this.map1[this.NumeroFrame2].removeLayer(l);

          /* if (typeof(l.getSource) === 'function') {
            l.setSource(null);
          } */
          // logConsole('Rimozione layer', nome);

          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eliminato layer', nome)
        } catch(e) {
          console.error('Errore rimozione layer', nome, e);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ERROR: Rimozione layer', nome);
        }
      }
    }
  }

  quantiLayerAppesi = 0;

  addLayerToMap(l, zIndex, cosa) {
    if (this.MappaOGrafico !== 'M') {
      return;
    }
    
    if (this.quantiLayerAppesi === 0) {
      this.caricamentoMappaInCorso = true;
    }
    this.quantiLayerAppesi++;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Add layer: Mappa', this.NumeroFrame2, this.map1[this.NumeroFrame2]);

    // logConsole('Aggiungo layer ' + cosa + ' a frame ' + this.NumeroFrame2 + ': Controllo');
    if (this.map1[this.NumeroFrame2]  && this.map1[this.NumeroFrame2] !== null && this.mappaDisegnata[this.NumeroFrame2]) {
      // logConsole('Aggiungo layer ' + cosa + ' a frame ' + this.NumeroFrame2 + ': Subito');

      this.aggiungeLayerFisico(l, zIndex, cosa);
    } else {
      let q = 0;
      const tt = setInterval(() => {
        // logConsole('Aggiungo layer ' + cosa + ' a frame ' + this.NumeroFrame2 + ': Check ');
        if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.mappaDisegnata[this.NumeroFrame2]) {
          clearInterval(tt);

          // logConsole('Aggiungo layer ' + cosa + ' a frame ' + this.NumeroFrame2 + ': Dopo');

          const layerAlreadyPresent = this.map1[this.NumeroFrame2].getLayers().getArray().includes(l);
          if (layerAlreadyPresent) {
            // logConsole('Aggiungo layer ' + cosa + ' a frame ' + this.NumeroFrame2 + ': Layer già presente lo elimino');

            this.map1[this.NumeroFrame2].removeLayer(l);
          }

          this.aggiungeLayerFisico(l, zIndex, cosa);
        } else {
          q++;
          if (q > 10) {
            clearInterval(tt);
            logConsole('Aggiungo layer ' + cosa + ' a frame ' + this.NumeroFrame2 + ': Mappa non presente. Esco');
          }
        }
      }, 100);
    }
  }

  aggiungeLayerFisico(l, zIndex, cosa) {
    if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== undefined && this.map1[this.NumeroFrame2] !== null && this.MappaOGrafico2 === 'M') {
      if (l && l !== undefined) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Add layer: Layer da aggiungere 2', zIndex, cosa);

        // if (this.map1[this.NumeroFrame2].getLayers().getArray().includes(l)) {
        //   this.map1[this.NumeroFrame2].removeLayer(l);
        // }

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'LAYER BELLO ' + cosa + ':', l);
        l.setZIndex(zIndex);
        if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== undefined && this.map1[this.NumeroFrame2] !== null && l) {
          this.map1[this.NumeroFrame2].addLayer(l);
        } else {
          logConsole('Aggiungo layer ' + cosa + ' a frame ' + this.NumeroFrame2 + ': impicci');
        }            

        this.quantiLayerAppesi--;
        if (this.quantiLayerAppesi <= 0) {
          this.caricamentoMappaInCorso = false;
        }
      } else {
        logConsole('Aggiungo layer ' + cosa + ' a frame ' + this.NumeroFrame2 + ': layer non valido');
      }
    } else {
      logConsole('Aggiungo layer ' + cosa + ' a frame ' + this.NumeroFrame2 + ': Mappa non esistente 3');
    }
  }

  /* effettuaAnimazione(tileLayer) {
    const source = new VectorSource({
      wrapX: false,
    });
    const vector = new VectorLayer({
      source: source,
    });
    function addRandomFeature() {
      const x = Math.random() * 360 - 180;
      const y = Math.random() * 170 - 85;
      const geom = new Point(fromLonLat([x, y]));
      const feature = new Feature(geom);
      source.addFeature(feature);
    }
    const duration = 3000;
    function flash(t, feature) {
      const start = Date.now();
      const flashGeom = feature.getGeometry().clone();
      const listenerKey = tileLayer.on('postrender', animate);

      function animate(event) {
        const frameState = event.frameState;
        const elapsed = frameState.time - start;
        if (elapsed >= duration) {
          unByKey(listenerKey);
          return;
        }
        const vectorContext = getVectorContext(event);
        const elapsedRatio = elapsed / duration;
        // radius will be 5 at start and 30 at end.
        const radius = easeOut(elapsedRatio) * 25 + 5;
        const opacity = easeOut(1 - elapsedRatio);

        const style = new Style({
          image: new CircleStyle({
            radius: radius,
            stroke: new Stroke({
              color: 'rgba(255, 0, 0, ' + opacity + ')',
              width: 0.25 + opacity,
            }),
          }),
        });

        vectorContext.setStyle(style);
        vectorContext.drawGeometry(flashGeom);
        // tell OpenLayers to continue postrender animation
        if (t.map1[t.NumeroFrame2]) {
          t.map1[t.NumeroFrame2].render();
        }
      }
    }
    // this.map1[this.NumeroFrame2].addLayer(vector);

    const sorcia = function (t, e) {
      flash(t, e.feature);
    };
    source.un('addfeature', sorcia);
    source.on('addfeature', sorcia.bind(null, this));

    window.setInterval(addRandomFeature, 1000);
  } */

  showInfo(t, event) {
    if (event.pixel !== undefined) { //  && t.staLeggendoDatiPoint === false) {
      // t.map1[t.NumeroFrame2].getTargetElement().style.cursor = 'pointer';
      const ora = new Date().getTime();
      if (ora - t.lastGetFeature > 1000) {
        t.lastGetFeature = ora;

        let ok = false;
        t.staLeggendoDatiPoint = true;
        ok = event.map.forEachFeatureAtPixel(event.pixel, async function(f) {
          if (f.values_.tms !== t.lastInfoMappa) {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.stylePerPath);

            // const ff = f;
            // this.Utils.layerPath[t.frameAttivo][t.NumeroFrame].getSource().removeFeature(f);
            // f.setStyle(this.Utils.stylePerPath);
            // this.Utils.layerPath[t.frameAttivo][t.NumeroFrame].getSource().addFeature(ff);
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, f);

            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t.Measure);
            const cont = 'TMS: ' + f.values_.tms_label;
            // t.topPopup = +event.pixel[1] - 70;
            // t.leftPopup = +event.pixel[0] - 10;
            t.lastinfoMappa = f.values_.tms;
            const misure = await t.pointComponent.prendePointMeasuresPerInfo(t, f.values_.geo_act_set_name,
              f.values_.geo_sla_name, f.values_.tms, t.Measure, 'ShowInfo');
            // t.infoMappa = cont;

            t.htmlClick.emit(t.sanitizer.bypassSecurityTrustHtml(cont + '<hr />' + misure));

            // const tm = setTimeout(() => {
          // clearTimeout(tm);
            //   t.topPopup = -300;
            // }, 3000);
          }

          return true;
        });
        t.staLeggendoDatiPoint = false;

        if (!ok) {
          t.map1[t.NumeroFrame2].getTargetElement().style.cursor = '';
        } else {
          t.map1[t.NumeroFrame2].getTargetElement().style.cursor = 'pointer';
        }
      } // else {
      //   t.map1[t.NumeroFrame2].getTargetElement().style.cursor = '';
      // }
    // } else {
    //   t.map1[t.NumeroFrame2].getTargetElement().style.cursor = '';
    }
  }

  /* updateMappa() {
    const endDateForUpdate   = new Date();
    let milliSeconds = 0;
    if (this.startDateForUpdate !== null) {
      milliSeconds = (endDateForUpdate.getTime() - this.startDateForUpdate.getTime());
    }
    if (this.startDateForUpdate === null || milliSeconds > 750) {
      this.startDateForUpdate = new Date();
      this.refreshWindows = setInterval(() => {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo tipo mappa ' + this.NumeroFrame);
        this.controllaTipoMappa(this.MappaOGrafico2);

        clearInterval(this.refreshWindows);
      }, 200);
    }
  } */

  onResizeStop(event) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onResizeStop:', event);
    // this.updateMappa();
  }

  onResizeStopGraph(event) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onResizeStopGraph:', event);
    // this.cambiatoGrafico1 = true;
    // this.accentratore(false);
  }

  onResize(event) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'onResize:', event);
    // this.updateMappa();
    if (this.MappaOGrafico2 === 'SY') {
      const ogg = this.creaStruttureDiProvaPerCanvas();
      this.synoptic.DisegnaSynoptic(this, ogg);
    }
  }

  selectTipoLayer1(ee) {
  }

  selectTipoMappa1(ee) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. Tipo Mappa da impostare: ', ee, this.Utils.mappe);
    // }

    if (ee || ee === 0) {
      const e = ExternalUtilities.converteStringaInJSON(ee);
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. Tipo Mappa impostata: ', e, this.Utils.mappe);
      // }

      // if (e.id) {
        // this.impostazioni.layerMappa1 = e.id;
      this.mapType2 = e;
      if (e > 0) {
        this.mapTypeName = this.Utils.mappe[this.mapType2 - 1].name;
        this.mapType2 = this.Utils.mappe[this.mapType2 - 1].id;
        logConsole('Scelta mappa', this.mapTypeName, this.mapType2);

        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. Tipo Mappa impostata NON globale: ', this.impostazioni.tipoMappa1);
        // }
  
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato tipo mappa 1:', this.impostazioni.tipoMappa1 + ' Numero: ' + this.NumeroFrame);

        // if (this.eseguitoInProgetto2) {
        //   this.cambiaTipoMappa('Select Tipo Mappa 1');
        // }
        // this.accentratore(false);
      } else {
        // Mappa Globale
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.mapStyleGlobale2);
        /* if (this.Utils.mappe[this.mapStyleGlobale2]) {
          this.impostazioni.tipoMappa1 = this.Utils.mappe[this.mapStyleGlobale2].name;
          if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. Tipo Mappa impostata minore uguale a 0: ', this.impostazioni.tipoMappa1);
          }
        } else { */
        this.mapTypeName = environment.stringaGlobalSettingMapStyle;
        this.mapType2 = -1;

        this.impostazioni.tipoMappa1 = environment.stringaGlobalSettingMapStyle;
          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. Tipo Mappa impostata globale ', environment.stringaGlobalSettingMapStyle);
          // }
        // }

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato tipo mappa 1:', this.impostazioni.tipoMappa1 + ' Numero: ' + this.NumeroFrame);

        // this.accentratore(false);

        // if (this.eseguitoInProgetto2) {
        //   this.cambiaTipoMappa('Select Tipo Mappa 2');
        // }
      }

      this.cambiaTipoMappa('Select Tipo Mappa 1');

      this.tipoMappaEmit.emit(e);
      // }
    }
  }

  layerLoadStart(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Start:', e);
  }

  layerLoadEnd(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'End:', e);
  }

  aggiornaValoriDopoClick(prop) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'aggiorna valori dopo click');
    // }
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaClick > 1000) {
      this.ultimaVoltaClick = ora;

      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'aggiorna valori dopo click', prop, this.lastProp);
      // }
      if (prop !== this.lastProp) {
        this.lastProp = JSON.stringify(prop);
        // const eventi = this.listaEventiDaPassare;
        // if (eventi !== 'empty grid') {
        //  eventi = JSON.parse(eventi);
        // }
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Scarico Misura:', JSON.stringify(prop));
        this.clickSuMappaEmit.emit('1§' + JSON.stringify(prop));

        // GestioneGrafici.axisXApp = null;
        // GestioneGrafici.axisYApp = null;

        this.fattoClickSuMappa = true;
        this.strutturaClick = prop;
        this.accentratore(false, 'AggiornaValoriDopoClick');
      }
    }
  }

  selectOptionMappaGrafico1(e) {
    if (e) {
      if (typeof(e) === 'string') {
        this.MappaOGrafico2 = e;

        this.mappaOGraficoEmit.emit(e);
      } else {
        const ee = ExternalUtilities.converteStringaInJSON(e);
        // const ee = this.Utils.ritornaRigaTotaleDaDescrizioneCombo(e, this.Utils.datiTipiFrame, 'name');
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tipo mappa scelto: ', this.NumeroFrame2, ee.id)
        // }
        // this.selectOptionLayerAttivo1('Cambio layer: ' + ee.id);

        this.MappaOGrafico2 = ee.id;

        // this.accentratore(true);

        switch (this.MappaOGrafico2) {
          case 'CT':
              // setTimeout(_ => this.loadReport1(), 100);
              break;
          case 'SY':
            const ogg = this.creaStruttureDiProvaPerCanvas();
            this.synoptic.DisegnaSynoptic(this, ogg);
            break;
          /* case 'MS':
              setTimeout(_ => this.loadReport2(1), 100);
              break; */
        }

        this.mappaOGraficoEmit.emit(ee.id);
      }
    }
  }

  /* loadReport1() {
    // this.pivot1.flexmonster.load('https://cdn.flexmonster.com/reports/report.json');
    let ds = '';
    ds = '{ "type": "csv", "filename": "/assets/data/Ping_General_Result.csv" }';
    const dds = JSON.parse(ds);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, dds);

    if (this.pivot1) {
      this.pivot1.flexmonster.connectTo(dds);
    }
  } */

  setToolBar() {
    if (!this.toolbarShowed2) {
      this.toolbarShowed2 = true;
    } else {
      this.toolbarShowed2 = false;
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.pivot2.toolbar);
  }

  /* loadReport2(s) {
    this.pivot2.flexmonster.clear();
    switch (s) {
      case 1:
          this.metodoVisualizzazione2 = 'File csv completo';

          let ds = '';
          ds = '{ "type": "csv", "filename": "/assets/data/1.csv" }';
          const dds = JSON.parse(ds);

          this.pivot2.flexmonster.connectTo(dds);
          break;
      case 2:
          this.metodoVisualizzazione2 = 'File csv solo template';

          let ds2 = '';
          ds2 = '{ "type": "csv", "filename": "/assets/data/template.csv" }';
          const dds2 = JSON.parse(ds2);

          this.pivot2.flexmonster.connectTo(dds2);
          break;
      case 3:
          this.metodoVisualizzazione2 = 'File json salvato con campi completi';

          this.pivot2.flexmonster.load('/assets/data/myreport1.json');
          break;
      case 4:
          this.metodoVisualizzazione2 = 'File json salvato con campi INcompleti';

          this.pivot2.flexmonster.load('/assets/data/myreport2_act');
          break;
    }
  } */

  /* exportGridAndChart(m) {
    switch (m) {
      case 1:
          this.pivot1.flexmonster.save('myreport.json', 'file');
          break;
      case 2:
          this.pivot2.flexmonster.save('myreport.json', 'file');
          break;
    }
  } */

  checkValueAntenne1(event: any) {
    if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da checkValueAntenne1 per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    }
    
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio antenne', event);
    // }

    this.cambiatoAntenne1 = true;
    this.isCheckedAntenne2 = event;

    if (this.eseguitoInProgetto2 === true) {
      this.layers_DD.disegnaAntenne(this, this.nomeAntennaDD2, this.parametriDD2, 'Check value');
    } else {
      this.accentratore(false, 'CheckValueAntenne');
    }

    this.isCheckedAntenneEmit.emit(event);
  }

  checkPlanimetry(event: any) {
    this.showPlanimetry2 = event;

    this.accentratore(false, 'Check planimetry');

    this.showPlanimetryEmit.emit(event);
  }

  cambioDataPerShowPath;

  checkValueShowPaths1(event: boolean) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show path', event);
    this.isCheckedShowPaths2 = event;

    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
      // if (event === true) {
        // this.lastCallPath4[this.NumeroFrame2] = '';

        this.cambioDataPerShowPath = new Date();
        this.pathComponent.disegnaPath(this);
        if (this.Utils.tmsSelezionato) {
          this.lastCallPath[this.NumeroFrame2] = '';
          const tms = this.Utils.tmsSelezionato;
          this.pathComponent.disegnaPathClickato(this, tms);
        }
      /* } else {
        if (this.pathLayer[this.NumeroFrame2]) {
          this.removeLayerFromMap('Elimino Path layer 2', this.pathLayer[this.NumeroFrame2]);
          this.pathLayer[this.NumeroFrame2] = undefined;
        }
      } */

      this.isCheckedShowPathsEmit.emit(event);
    // }, 100);
  }

  checkValueShowSelectedPaths1(event: boolean) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show selected path', event);
    this.isCheckedShowSelectedPaths2 = event;

    if (this.Utils.tmsSelezionato) {
      this.lastCallPath[this.NumeroFrame2] = '';
      const tms = this.Utils.tmsSelezionato;
      this.pathComponent.disegnaPathClickato(this, tms);
    }

    this.isCheckedShowSelectedPathsEmit.emit(event);
  }

  refreshShowRays(event: any) {
    if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da refreshShowRays per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    }
    
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show rays', event);
    // }
    this.showRays2 = event;

    if (event === false) {
      /* f (this.pathShowRays) {
        this.removeLayerFromMap('Path show rays 2', this.pathShowRays);
        this.pathShowRays = undefined;
      } */
      this.lastCallPathSC[this.frameAttivo2] = '';
    }

    this.accentratore(true, 'RefreshShowRays');
    this.showRaysEmit.emit(event);
  }

  refreshSartPosition(event: any) {
    if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da refreshSartPosition per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    }
    
    this.sartPosition2 = event;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.sartPosition2);
    this.accentratore(true, 'RefreshSartPosition');
    this.sartPositionEmit.emit(event);
  }

  refreshMeasureSMS(event: any) {
    if (event) {
      this.measureSMS2 = event;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio misura SMS', this.measureSMS2);

      this.accentratore(true, 'RefreshmeasureSMS');
      this.measureSMSEmit.emit(event);
    }
  }

  selectMappeMS(event: any) {
    if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da selectMappeMS per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    }
    
    if (event) {
      this.mappeMS2 = event;
      this.styleMappa2 = event;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio mappe MS', this.mappeMS2);

      this.accentratore(true, 'SelectMappeMS');
      this.mappeMSEmit.emit(event);
    }
  }

  selectClusterMeasure(event: any) {
    /* if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da selectClusterMeasure per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    } */
    
    // if (event) {
      logConsole('Cambio cluster measure in frame', event);
      if (!event || event === '*EMPTY*') { event = ''; }
      this.clusterMeasure12 = event;
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster measure', this.clusterMeasure12);
      // }
      this.accentratore(true, 'SelectClusterMeasure');
      this.clusterMeasureEmit.emit(event);
    // }
  }

  selectClusterMeasure2(event: any) {
    /* if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da selectClusterMeasure2 per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    } */
    
    // if (event) {
      if (!event || event === '*EMPTY*') { event = ''; }
      this.clusterMeasure22 = event;
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio cluster measure 2', this.clusterMeasure22);
      // }
      this.accentratore(true, 'SelectClusterMeasure2');
      this.clusterMeasure2Emit.emit(event);
    // }
  }

  /* selectLov(event: any) {
    // if (event) {
      if (!event) { event = ''; }
      this.lov2 = event;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio lov', this.lov2);

      this.accentratore(true, 'SelectLov');
      this.lovEmit.emit(event);
    // }
  } */

  selectNonSyncEventTime(event: any) {
    this.isNonSyncEventTime2 = event;
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio isnonsynceventtime', this.isNonSyncEventTime2);
    // }
    // this.accentratore(true);
    this.isNonSyncEventTimeEmit.emit(event);
  }

  selectShowAxisX(event: any) {
    this.showAxisX2 = event;
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show axis x', this.showAxisX2);
    // }
    // this.accentratore(true);
    this.showAxisXEmit.emit(event);
  }

  selectCorrelation(event: any) {
    if (this.MappaOGrafico2 !== 'M' && this.MappaOGrafico2 !== 'AI' && this.MappaOGrafico2 !== 'AR' && this.MappaOGrafico2 !== 'AA') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da selectCorrelation per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    }
    
    // if (event) {
    if (!event) { event = ''; }
    this.correlation2 = event;
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio correlation measure', this.correlation2);
    // }
    this.accentratore(true, 'SelectCorrelation');
    this.correlationEmit.emit(event);
    // }
  }

  selectTextFilter(event: any) {
    // if (event) {
      // alert('Filtro 1: *' + event + '*');
      // logConsole('Cambio filter 1', event);
      if (event === '*EMPTY*') { event = ''; }
      this.textFilter12 = event;
      this.textFilterEmit.emit(this.textFilter12);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio text filter 1', this.textFilter12);
    // }
  }

  applyFilter1(e) {
    this.accentratore(true, 'SelectTextFilter1');
  }

  selectTextFilter2(event: any) {
    // if (event) {
      if (event === '*EMPTY*') { event = ''; }
      this.textFilter22 = event;
      this.textFilter2Emit.emit(this.textFilter22);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio text filter 2', this.textFilter22);
    // }
  }

  applyFilter2(e) {
    this.accentratore(true, 'SelectTextFilter2');
  }

  /* selectTextLov(event: any) {
    // if (event) {
      if (!event) { event = ''; }
      this.textLov2 = event;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio text lov', this.textLov2);

      this.accentratore(true, 'SelectTextLov');
      this.textFilterEmit.emit(event);
    // }
  } */

  selectMeasureRCM(e) {
    if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da selectMeasureRCM per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    }
    
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio measure RCM', e);

    this.measureRCM2 = e;
    this.accentratore(true, 'SelectMeasureRCM');
    this.measureRCMEmit.emit(e);
  }

  selectShowRaysAllLayer(e) {
    if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da selectShowEaysAllLayer per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    }
    
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio show rays all layers', e);
    // }
    this.showRaysAllLayer2 = e;
    this.accentratore(true, 'SelectShowRaysAllLayer');
    this.showRaysAllLayerEmit.emit(e);
  }

  selectGlobalLayer(event: any) {
    if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da selectGlobalLayer per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    }
    
    // if (event) {
      this.addGlobalLayer2 = event;
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio global layer', this.addGlobalLayer2);
      // }
      this.accentratore(true, 'SelectGlobalLayer');
      this.addGlobalLayerEmit.emit(event);
    // }
  }

  checkValueServingCell1(event: any) {
    if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da checkValueServingCell1 per NON tipo mappa', this.NumeroFrame2, this.MappaOGrafico2);

      return;
    }
    
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'disegnaPath: Cambio serving cell', event);
    // }
    this.isCheckedServingCell2 = event;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio serving cell', event, this.isCheckedServingCell2);
    // this.accentratore(false);

    if (event === false) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'disegnaPath: Elimino vecchio serving cell', event);
      // }

      // this.removeLayerFromMap('disegnaPath: Elimino Path serving cell', this.pathServingCell[this.NumeroFrame2]);
      // this.pathServingCell[this.NumeroFrame2] = undefined;

      this.lastCallPath2[this.frameAttivo2] = '';
    }

    this.isCheckedServingCellEmit.emit(event);
    this.accentratore(true, 'CheckValueServingCell1');
  }

  checkViewAs(event: any) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, event);
    // alert('Impostazione view as: ' + event);
    this.viewAs2[this.NumeroFrame2] = event;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato viewas', this.viewAs2[this.NumeroFrame2]);

    if (this.MappaOGrafico2 === 'M') {
      this.pathComponent.disegnaOverlay(this);
      // this.updateMappa();
      const array = this.prendeMisurePerLegenda();
      this.legendaComponent.disegnaLegenda(this, array, false);

      this.accentratore(true, 'CHECKVIEWAS');
    }

    this.viewAsEmit.emit(event);
  }

  checkOverView(event: any) {
    // return;
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Check view global:', this.NumeroFrame, event);
    // }
    this.overviewZoom2 = event;
    // if (event === false) {
      // const vLocal: OlView =  JSON.parse(JSON.stringify(this.viewGlobal));
      // this.viewLocal = vLocal;
    // }

    // const mappaGlobale = this.Utils.tornaGlobale(this);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio overView', this.NumeroFrame, this.overviewZoom2);
    if (this.overviewZoom2 === true) {
      /* if (!this.viewMappaGlobale || !this.viewMappaGlobale.viewportSize_) {
        if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista globale strana o nulla', this.NumeroFrame2, this.viewMappaGlobale);
        }
      } else { */
       /*  if (this.viewMappaGlobale) {
          this.viewMappaAttuale = this.viewMappaGlobale;
          if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata vista globale', this.NumeroFrame2, this.viewMappaAttuale);
          }
        } */
      // }
    } else {
      if (this.overviewZoom2 === false) {
        /* if (!this.viewMappaLocale || !this.viewMappaLocale.viewportSize_) {
          if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vista globale strana o nulla', this.NumeroFrame2, this.viewMappaGlobale);
          }
        } else { */
          /* if (this.viewMappaLocale) {
            this.viewMappaAttuale = this.viewMappaLocale;
            if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata vista locale', this.NumeroFrame2, this.viewMappaAttuale);
            }
          } */
        // }
      }
    }

    // this.controllaViewMappaAttualeSeValida(false);

    // this.redrawComponente('Overview Zoom');
    // if (this.map1[this.NumeroFrame2]&& this.viewMappaAttuale) {
    //   this.map1[this.NumeroFrame2].setView(this.viewMappaAttuale);
    // }

    this.overviewZoomEmit.emit(event);
  }

  ultimoLayer;

  cambiaTipoMappa(daDove) {
    // logConsole('Cambia tipo mappa', daDove, this.NumeroFrame2);

      if (this.ultimoLayer) {
        this.removeLayerFromMap('lastLayer', this.ultimoLayer);
      }

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. Cambio tipo mappa. Imposto tipo mappa', this.impostazioni.tipoMappa1);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'mapType. Cambio tipo mappa. Tipo mappa globale', this.mapStyleGlobale2);

      // logConsole('Cambio tipo mappa', this.mapType2, this.mapTypeName, this.mapStyleGlobale2);
      // alert('Cambio tipo mappa');

      // if (this.impostazioni.tipoMappa1 === 'CartoDB' || ((this.impostazioni.tipoMappa1 === -1 || this.impostazioni.tipoMappa1 === environment.stringaGlobalSettingMapStyle) && (this.mapStyleGlobale2 === 'CartoDB' || this.mapStyleGlobale2 === 1))) {
      const layer = this.impostaTipoMappa('CambiaTipoMappa');
      this.addLayerToMap(layer, 1, 'lastLayer');

      // // logConsole('ALL LAYERS SU MAPPA: ', this.map1[this.NumeroFrame2].getLayers(), this.map1[this.NumeroFrame2].getAllLayers());

      /* if (layer) {
        layer.un('postrender', this.postrender);
        layer.on('postrender', this.postrender.bind(null, this));
      } */
  }

  lastDisegnaMappa = -1;

  disegnaMappa1(forzaRedraw, daDove) {
    if (this.MappaOGrafico2 !== 'M') {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno mappa. Esco per tipo MappaOGrafico2 diverso da M');

      return;
    }

    const ora = new Date().getTime();
    if (ora - this.lastDisegnaMappa < 1000) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno mappa. Esco per troppo veloce');

      return;
    }
    this.lastDisegnaMappa = ora;
  
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno mappa. "' + daDove + '" Mappa', this.NumeroFrame2, this.map1[this.NumeroFrame2], forzaRedraw, this.mapType2);

    // if (this.impostazioni.tipoMappa1 === 1) {
    //   this.impostazioni.tipoMappa1 = this.Utils.mappe[this.mapType - 1].name;
    // }
    /* if (this.ultimaVoltaTMSDM === this.impostazioni.tipoMappa1) {
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da disegna mappa');
      }
      return;
    } */

    if (forzaRedraw || (this.mapType2 !== this.vecchioLayerScelto1)) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno mappa al numero Frame: ', this.NumeroFrame);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno mappa con tipo: ', this.impostazioni.tipoMappa1);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Forza Redraw: ', forzaRedraw);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Layer Mappa1: ', this.mapType);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome Layer Mappa1: ', this.impostazioni.tipoMappa);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vecchio Layer: ', this.vecchioLayerScelto1);

      /* if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno mappa. Elimino vecchio layer'); 
      }

      try {
        this.removeLayerFromMap('CartoDB', this.layerCartoDb);
      } catch (e) {

      }
      try {
        this.removeLayerFromMap('Google', this.layerGoogle);
      } catch (e) {

      }
      try {
        this.removeLayerFromMap('OSM', this.layerOSM);
      } catch (e) {

      }
      try {
        this.removeLayerFromMap('Satellite', this.layerSatellite);
      } catch (e) {

      }
      // try {
        // this.removeLayerFromMap(this.lente);
      // } catch (e) {

      // }
      try {
        this.removeLayerFromMap('Stamen', this.layerStamen);
      } catch (e) {

      } */

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno mappa. Imposto tipo mappa', this.impostazioni.tipoMappa1);

      // this.vecchioLayerScelto1 = this.impostazioni.layerMappa1;

      if (!this.impostazioni.tipoMappa1) {
        this.impostazioni.tipoMappa1 = 'CartoDB';
      }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa: ', this.NumeroFrame, this.frameAttivo2, this.impostazioni.tipoMappa1);

      /* if (this.layerCartoDb === undefined) {
        this.creaLayersMappe();
      }

      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno mappa. Imposto tipo mappa', this.impostazioni.tipoMappa1);
      }

      let layer;
      if (this.impostazioni.tipoMappa1 === 'CartoDB') {
        layer = this.layerCartoDb;
        this.addLayerToMap(this.layerCartoDb, 1, 'MappaCartoDB');
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato 1', '');
      } else {
        if (this.impostazioni.tipoMappa1 === 'Google') {
          layer = this.layerGoogle;
          this.addLayerToMap(this.layerGoogle, 1, 'MappaGoogle');
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato 2', '');
        } else {
          if (this.impostazioni.tipoMappa1 === 'OSM') {
            layer = this.layerOSM;
            this.addLayerToMap(this.layerOSM, 1, 'MappaOSM');
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato 3', '');
          } else {
            if (this.impostazioni.tipoMappa1 === 'Stamen') {
              layer = this.layerStamen;
              this.addLayerToMap(this.layerStamen, 1, 'MappaStamen');
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato 4', '');
            } else {
              if (this.impostazioni.tipoMappa1 === 'Satellite') {
                layer = this.layerSatellite;
                this.addLayerToMap(this.layerSatellite, 1, 'MappaSatellite');
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato 5', '');
              } else {
                if (this.impostazioni.tipoMappa1 === 'Magnify') {
                  // layer = this.lente;
                  // this.addLayerToMap(this.lente, 1, 'Magnify');
                  // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostato 6', '');
                }
              }
            }
          }
        }
      }

      layer.un('postrender', this.postrender);
      layer.on('postrender', this.postrender.bind(null, this)); */

      this.ultimaVoltaTMSDM = this.impostazioni.tipoMappa1;
      
      /* const tm = setTimeout(() => {
          clearTimeout(tm);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ridisegno mappa', this.NumeroFrame2);
        this.redrawComponente('DisegnaMappa1');
      }, 1000); */

      if (this.map1[this.NumeroFrame2]) {
        this.map1[this.NumeroFrame2].addControl(this.overviewMapControl);
        this.overviewMapControl.setRotateWithView(true);

        const c = this.map1[this.NumeroFrame2].getControls();
        c.forEach(element => {
          if (element) {
            if (element['element'].textContent.indexOf('OpenStreetMap ') > -1) {
              this.map1[this.NumeroFrame2].removeControl(element);
            }
          }
        });
      }

      // this.map1[this.NumeroFrame2].addLayer(this.layerScelto);

      // this.cambiatoPath1 = true;
      // this.cambiatoCoverage1 = true;
      this.cambiatoAntenne1 = true;
      this.cambiatoGrafico1 = true;

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mappa disegnata');
    }
  }

  getWidth(): any {
    // if (document.body.offsetWidth < 850) {
    //   return '90%';
    // }
    return this.elementView.nativeElement.offsetWidth + 'px';
  }

  getHeight(): any {
    // if (document.body.offsetWidth < 850) {
    //   return '90%';
    // }

    return this.elementView.nativeElement.offsetHeight + 'px';
  }

  chiudeMaschera1() {
    // const t = AppComponent.t;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.mapName);
    // t.gestisceMaschere(this.NumeroFrame);
    this.chiudeMascheraEmit.emit(this.NumeroFrame);
  }

  cellClickOnGrid(e) {
    ExternalUtilities.messaggioDiErrore(this, e);
  }

  selectMisura(m) {
    // logConsole('Misure passate', m);

    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostate misure frame ' + this.NumeroFrame + ':', m);
    // }
    this.giaDisegnataStruttura[this.NumeroFrame2] = false;

    if (this.MappaOGrafico2 === 'M') {
      if (m !== undefined && m !== null) {
        m[0] = '';
      }
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostate misure nel frame passate', m);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostate misure nel frame prima', this.NumeroFrame2, JSON.parse(JSON.stringify(this.Measure)));
    this.Measure = m;
    // logConsole('Misure di ritorno dai settings', this.Measure, m);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, '*' + this.listaEventiDaPassareTemp + '*');
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostate misure nel frame dopo', this.NumeroFrame2, this.Measure);

    // this.scriveValoriMisure();
    const array = this.prendeMisurePerLegenda();
    this.legendaComponent.disegnaLegenda(this, array, false);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, typeof(this.listaEventiDaPassare2), this.listaEventiDaPassare2);

    // const appo = {... this.listaEventiDaPassare2};
    // this.listaEventiDaPassare2 = {... this.listaEventiDaPassareTemp};
    // this.accentratore(false);
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo su lista eventi nulla 2: ', this.listaEventiDaPassare2);
    // }

    this.listaEventiDaPassare2 = JSON.parse(JSON.stringify(this.listaEventiDaPassare2));
    if (this.eseguitoInProgetto2 === false) {
      if (this.listaEventiDaPassare2 === undefined) {
        this.listaEventiDaPassare2 = null;
      }
    }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, typeof(this.listaEventiDaPassare2), this.listaEventiDaPassare2);
    this.measureEmit.emit(m);

    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.accentratore(false, 'SelectMisura');
    }, 100);
  }

  selectOverlay(m) {
    // logConsole('Overlay', m);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata misura overlay:', m);
    this.overlayEmit.emit(m);
    this.overlay2 = m;

    if (this.MappaOGrafico2 === 'M') {
      this.pathComponent.disegnaOverlay(this);
      // this.updateMappa();

      const array = this.prendeMisurePerLegenda();
      this.legendaComponent.disegnaLegenda(this, array, false);
    }
  }

  selectOverlayCluster(m) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata misura overlay cluster:', m);

    this.overlayClusterEmit.emit(m);
    this.overlayCluster2 = m;

    if (this.MappaOGrafico2 === 'M') {
      this.pathComponent.disegnaOverlay(this);
      // this.updateMappa();

      this.accentratore(false, 'selectOverlayCluster');
    }
  }

  selectSla(s) {
    if (s) {
      this.slaValue2 = s.ID;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione sla:', this.NumeroFrame, s, this.slaValue2);
      this.slaName2 = s.NAME;
      this.slaNameComplete = this.prendeNomeSla(s.NAME);
      this.slaValueEmit.emit(s);
      this.slaEmit.emit(s.NAME);
      // this.accentratore(false);
    }
  }

  selectActivity(aa) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activity impostata:', aa);
    if (aa) {
      const a = ExternalUtilities.converteStringaInJSON(aa);
      if (a.id !== this.Activity2) {
        // const a = this.Utils.ritornaRigaTotaleDaDescrizioneCombo(aa, this.Utils.datiTipiActivity, 'name');
        this.Activity2 = a.id;

        if (this.Utils.mappaClickata === this.NumeroFrame) {
          if (this.listaActivityName2[a.id] && this.listaActivityName2[a.id] !== null && this.listaActivityName2[a.id].NAME !== null) {
            this.Utils.act_setDelPuntoClickatoSullaMappa = this.listaActivityName2[a.id].NAME;
          } else {
            this.Utils.act_setDelPuntoClickatoSullaMappa = '';
          }
        }

        if (this.datiActivitySet2 && this.datiActivitySet2.length > -1 &&
          this.datiActivitySet2[this.Activity2] && this.datiActivitySet2[this.Activity2].NAME) {
          ///// this.act_set = this.datiActivitySet2[this.Activity2].NAME;
          ///// if (this.debug2 === true) {
          /////   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Setto act_set 3', this.act_set);
          ///// }
        }

        this.activityEmit.emit(a.id);
      }
    } else {
      // ExternalUtilities.messaggioDiErrore(t, 'Attenzione!!! Activity set (passato da settings) vuoto');
    }
  }

  settingsVisibileFlag = false;
  passaggioPerSettings = {
    Utils: undefined,
    MappaOGrafico: undefined,
    Frame: undefined,
    Debug:undefined,
    Log: undefined,
    tipoFrameProgetto: undefined,
    righePerPaginazioneAutomatica: undefined,
    indirizzoServer: undefined,
    eseguitoInProgetto: undefined,
    sessionID: undefined,
    visibile: undefined,
    userName: undefined,
    NumeroFrame: undefined,
    mapName: undefined,
    Descrizione: undefined,
    ConnessioneStabilita: undefined,
    viewGlobal: undefined,
    mapType: undefined,
    isCheckedServingCell: undefined,
    showAdditionalLayers: undefined,
    isCheckedShowPaths: undefined,
    isCheckedShowSelectedPaths: undefined,
    isCheckedAntenne: undefined,
    measurePassato: undefined,
    activity: undefined,
    plmn: undefined,
    netTech: undefined,
    shownEvents: undefined,
    modificaChart: undefined,
    doNotSetGM: undefined,
    bandWidth: undefined,
    countHistogram: undefined,
    checkSeverity: undefined,
    slaGroup: undefined,
    slaValue: undefined,
    measureData: undefined,
    listaEventiDaPassare: undefined,
    tabSelezionato: undefined,
    refreshMaschera: undefined,
    settaMascheraVuota: undefined,
    disabilitata: undefined,
    refreshQuanteMisure: undefined,
    viewAs: undefined,
    overlay: undefined,
    overlayCluster: undefined,
    timeFilter: undefined,
    clusterGroup: undefined,
    datiSLA: undefined,
    datiSlaDT: undefined,
    designInfo: undefined,
    frameAttivo: undefined,
    HistDisplayAs: undefined,
    columnsBars: undefined,
    doubleGraph: undefined,
    showPlanimetry: undefined,
    tipoEvento: undefined,
    fixedSeconds1: undefined,
    styleImpostato: undefined,
    styleSizes: undefined,
    datiLookUp: undefined,
    datiAddLayers: undefined,
    cellType: undefined,
    addLayers: undefined,
    opacity: undefined,
    ShowRays: undefined,
    showMeasures: undefined,
    showCoverageMeasures: undefined,
    showVoiceCallMeasures: undefined,
    showDataMeasures: undefined,
    squareMeters: undefined,
    measureType: undefined,
    datiMosaicStyle: undefined,
    mosaicStyle: undefined,
    SartPosition: undefined,
    bboxOverViewZoom: undefined,
    geoFilter: undefined,
    measureSMS: undefined,
    showMeasuresS: undefined,
    numeroActSetVisibili: undefined,
    tipoDataset: undefined,
    mappeStyle: undefined,
    mappeMS: undefined,
    ClusterMeasure: undefined,
    ClusterMeasure2: undefined,
    TextFilter: undefined,
    TextFilter2: undefined,
    addGlobalLayer: undefined,
    measureRCM: undefined,
    eventsMeasure: undefined,
    HistDisplayTutto: undefined,
    showRaysAllLayer: undefined,
    permessiDataView: undefined,
    staDisegnandoSMS: undefined,
    Correlation: undefined,
    isNonSyncEventTime: undefined,
    showAxisX: undefined,
    misureAddizionaliTCRUNP: undefined,
    heightChart: undefined,
    listaCampiAttuale: undefined,
    act_set: undefined,
    tmsMin: undefined,
    tmsMax: undefined,
    tmsSelezionato: undefined,
    tmsGlobaleMin: undefined,
    tmsGlobaleMax: undefined,
    dashboardAttiva: undefined,
    tipoDatiLayout: undefined,
    measureDataCompleti: undefined,
    viewModeMS: undefined,
    flowTypeMS: undefined,
    isStandAloneMR: undefined
  };

  // lastAperturaSettings = 0;

  apreSettings() {
    /* const ora = new Date().getTime();
    if (ora - this.lastAperturaSettings < 1000) {
      return;
    }
    this.lastAperturaSettings = ora; */

    /* logConsole('Combo 1', this.measureData2);
    this.measureData2.forEach(element => {
      if (element.DISPLAY_NAME === 'Partition Label') {
        logConsole(element);
      }
    }); */

    // this.settingsVisibile = 'OK';
    this.passaggioPerSettings = undefined;
    const m = setTimeout(() => {
      this.passaggioPerSettings = {
        Utils: this.Utils,
        Frame: this,
        Debug: this.debug2,
        Log: this.Log,
        tipoFrameProgetto: this.tipoFrameProgetto2,
        righePerPaginazioneAutomatica: this.righePerPaginazioneAutomatica,
        indirizzoServer: this.indirizzoServer2,
        eseguitoInProgetto: this.eseguitoInProgetto2,
        sessionID: this.sessionID2,
        visibile: this.settingsVisibileFlag,
        userName: this.userName,
        NumeroFrame: this.NumeroFrame,
        mapName: this.frameName2,
        Descrizione: this.frameDescription2,
        ConnessioneStabilita: this.ConnessioneStabilita,
        MappaOGrafico: this.MappaOGrafico,
        showAdditionalLayers: this.showAdditionalLayers2,
        viewGlobal: this.overviewZoom2,
        mapType: this.mapType2,
        isCheckedServingCell: this.isCheckedServingCell2,
        isCheckedShowPaths: this.isCheckedShowPaths2,
        isCheckedShowSelectedPaths: this.isCheckedShowSelectedPaths2,
        isCheckedAntenne: this.isCheckedAntenne2,
        measurePassato: this.Measure,
        activity: this.Activity2,
        plmn: this.plmn,
        netTech: this.netTech,
        shownEvents: this.shownEvents2,
        modificaChart: this.modificaChart,
        doNotSetGM: this.doNotSetGM,
        bandWidth: this.bandwidth,
        countHistogram: this.countHistogram,
        checkSeverity: this.checkSeverity2,
        slaGroup: this.slaGroup2,
        slaValue: this.slaValue2,
        measureData: this.measureData2,
        listaEventiDaPassare: this.listaEventiDaPassare2,
        tabSelezionato: this.tabSelezionato2,
        refreshMaschera: this.refreshMascheraSettings,
        settaMascheraVuota: this.settaMascheraVuota,
        disabilitata: this.comboDisabilitata,
        refreshQuanteMisure: this.refreshQuanteMisure2,
        viewAs: this.viewAs2[this.NumeroFrame2],
        overlay: this.overlay2,
        overlayCluster: this.overlayCluster2,
        timeFilter: this.timeFilter2,
        clusterGroup: this.clusterGroup2,
        datiSLA: this.datiSLA2,
        datiSlaDT: this.datiSlaDT2,
        designInfo: this.designInfo2,
        frameAttivo: this.frameAttivo2,
        HistDisplayAs: this.histDisplayAs2,
        columnsBars: this.columnsBars2,
        doubleGraph: this.doubleGraph2,
        showPlanimetry: this.showPlanimetry2,
        tipoEvento: this.tipoEvento2,
        fixedSeconds1: this.fixedSeconds2,
        styleImpostato: this.styleSize2,
        styleSizes: this.listaStileSizes2,
        datiLookUp: this.datiLookUp2,
        datiAddLayers: this.datiAddLayers2,
        cellType: this.cellType2,
        addLayers: this.addLayers2,
        opacity: this.opacity2,
        ShowRays: this.showRays2,
        showMeasures: this.showMeasures2,
        showCoverageMeasures: this.showCoverageMeasures2,
        showVoiceCallMeasures: this.showVoiceCallMeasures2,
        showDataMeasures: this.showDataMeasures2,
        squareMeters: this.squareMeters2,
        measureType: this.measureType,
        datiMosaicStyle: this.datiMosaicStyle,
        mosaicStyle: this.mosaicStyle,
        SartPosition: this.sartPosition2,
        bboxOverViewZoom: this.bboxOZ2,
        geoFilter: this.geoFilter2,
        measureSMS: this.measureSMS2,
        showMeasuresS: this.showMeasuresS2,
        numeroActSetVisibili: this.numeroActSetVisibili2,
        tipoDataset: this.tipoDataset2,
        mappeStyle: this.mappeStyle2,
        mappeMS: this.mappeMS2,
        ClusterMeasure: this.clusterMeasure12,
        ClusterMeasure2: this.clusterMeasure22,
        TextFilter: this.textFilter12,
        TextFilter2: this.textFilter22,
        addGlobalLayer: this.addGlobalLayer2,
        measureRCM: this.measureRCM2,
        eventsMeasure: this.eventsMeasure2,
        HistDisplayTutto: this.histDisplayTutto2,
        showRaysAllLayer: this.showRaysAllLayer2,
        permessiDataView: this.permessiDataView,
        staDisegnandoSMS: this.staDisegnandoMisureSMS,
        Correlation: this.correlation2,
        isNonSyncEventTime: this.isNonSyncEventTime,
        showAxisX: this.showAxisX2,
        misureAddizionaliTCRUNP: this.misureAddizionaliTCRUN2,
        heightChart: this.heightChart2,
        listaCampiAttuale: this.listaCampiTCRP2,
        act_set: this.act_set,
        tmsMin: this.Utils.tmsInizio,
        tmsMax: this.Utils.tmsFine,
        tmsSelezionato: this.Utils.tmsSelezionato,
        tmsGlobaleMin: this.timeRangeDSFStart2,
        tmsGlobaleMax: this.timeRangeDSFStop2,
        dashboardAttiva: this.dashboardAttiva2,
        tipoDatiLayout: this.tipoDatiLayout2,
        measureDataCompleti: this.measureDataCompleti2,
        viewModeMS: this.viewModeMS2,
        flowTypeMS: this.flowTypeMS2,
        isStandAloneMR: this.isStandAloneMR2
      }
      logConsole('Passaggio settings', this.passaggioPerSettings);
      this.settingsAperto = true;
      this.settingsApertoEmit.emit(true);

      // logConsole('Apertura settings: ', this.passaggioPerSettings);

      this.settingsVisibileFlag = true;
    }, 100);
  }

  selectVisibile(v) {
    const tm = setTimeout(() => {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura settings');
      /* if (v !== '') {
        this.refreshMascheraSettings = true;
      } else { */
      this.refreshMascheraSettings = false;
      // }
      // this.settingsVisibile = v;
      this.settingsVisibileFlag = false;

      this.settingsAperto = false;
      this.settingsApertoEmit.emit(false);
      // this.accentratore(false);
      // this.updateMappa();
    }, 1000);
  }

  selectFrameName(m) {
    if (this.eseguitoInProgetto2 === true) {
      return;
    }
    if (m !== undefined && m !== null) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, m);
      // this.titoloFrame2 = m;
      // this.nomiFrames[this.frameAttivo2] = '';
      // this.frameName2 = '';
      // const tm = setTimeout(() => {
      //     clearTimeout(tm);
        this.nomiFrames[this.frameAttivo2] = m;

        this.frameName2 = m;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.frameName2);

        const array = this.prendeMisurePerLegenda();
        this.legendaComponent.disegnaLegenda(this, array, false);

        // }, 1000);
      this.frameNameEmit.emit(m);
    }
  }

  selectDescrizione(d) {
    this.frameDescription = d;
    this.frameDescEmit.emit(d);
  }

  selectPlmn(p) {
    this.plmn = p;
    this.plmnEmit.emit(p);
  }

  selectNetTech(n) {
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.netTech = n;
    this.netTechEmit.emit(n);
  }

  selectShownEvents(n) {
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Shown Events cambiato', n);

    this.shownEvents2 = n;
    this.shownEventsEmit.emit(n);
  }

  selectShowMeasures(n) {
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.showMeasures2 = n;
    this.showMeasuresEmit.emit(n);
    this.accentratore(true, "Show Measures");
  }

  selectShowVoiceCallMeasures(n) {
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.showVoiceCallMeasures2 = n;
    this.showVoiceCallMeasuresEmit.emit(n);
  }

  selectShowDataMeasures(n) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato show data measures', n)
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.showDataMeasures2 = n;
    this.showDataMeasuresEmit.emit(n);
  }

  selectShowCoverageMeasures(n) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato show coverage measures', n)
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.showCoverageMeasures2 = n;
    this.showCoverageMeasuresEmit.emit(n);
  }

  selectShowMeasuresS(n) {
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto show measures s', n);

    this.showMeasuresS2 = n;
    this.showMeasuresSEmit.emit(n);

    this.accentratore(true, 'SelectShowMeasuresS');
  }

  selectSquareMeters(n) {
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.squareMeters2 = n;
    this.squareMetersEmit.emit(n);

    if (this.geoFilter2 === 1) {
      ExternalUtilities.squareMetersGlobaleOverView = n;
    } else {
      if (this.geoFilter2 === 3) {
        ExternalUtilities.squareMetersGlobaleZoom = n;
      } else {
        ExternalUtilities.squareMetersGlobaleZoom = n;
      }
    }

    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto square meters', this.squareMeters2);
    // }
  }

  selectMosaicStyle(n) {
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.mosaicStyle = n;
    this.mosaicStyleEmit.emit(n);

    this.accentratore(true, "SelectMosaicStyle");
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.squareMeters);
  }

  selectMeasureType(n) {
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.measureType = n;
    this.measureTypeEmit.emit(n);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.squareMeters);
  }
  
  selectDoNotSetGM(n) {
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.doNotSetGM = n;
    this.doNotSetGMEmit.emit(n);
  }

  selectModificaChart(n) {
    // ExternalUtilities.messaggioDiErrore(t, n);
    this.modificaChart = n;
    this.modificaChartEmit.emit(n);
  }

  selectBandWidth(b) {
    // ExternalUtilities.messaggioDiErrore(t, b);
    this.bandwidth = b;
    this.bandwidthEmit.emit(b);
  }

  selectCountHistogram(b) {
    // ExternalUtilities.messaggioDiErrore(t, b);
    this.countHistogram = b;
    this.countHistogramEmit.emit(b);
  }

  selectCheckSeverity(b) {
    // ExternalUtilities.messaggioDiErrore(t, b);
    this.checkSeverity2 = b;
    this.checkSeverityEmit.emit(b);
  }

  scurisceBottone() {
    if (this.opacitaBottone === .5 || this.opacitaBottone === 0) {
      this.opacitaBottone = 1;
    }
  }

  schiarisceBottone() {
    if (!this.barraAperta) {
      if (this.opacitaBottone === 1) {
        this.opacitaBottone = .5;
      }
    } else {
      if (this.opacitaBottone === .5 || this.opacitaBottone === 0) {
        this.opacitaBottone = 1;
      }
    }
  }

  entraFrame() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Entrato');
    if (this.opacitaBottone !== .5) {
      this.opacitaBottone = .5;
      // this.impostazioni.dimeBarra = 0;
    }
  }

  esceFrame() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Uscito');
    if (this.opacitaBottone !== 0) {
      this.opacitaBottone = 0;
      // this.impostazioni.dimeBarra = 0;
    }
  }

  aggiornaListaEventi(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi locali. Ritorno lista eventi: ', this.NumeroFrame2, e);
    // }
    if (e === undefined) {
      e = 'empty grid';
    }
    this.listaEventiDaPassare2 = e;
    if (this.listaEventiDaPassare2 === undefined) {
      this.listaEventiDaPassare2 = null;
    }
    this.listaEventi.emit(e);
  }

  aggiornaListaEventiTemp(e) {
    if (e === undefined) {
      e = 'empty grid';
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi temporanea:', this.Utils.convertestringaInJSON(e));
    this.listaEventiDaPassareTemp = e;
    this.eventsComponent.disegnaEventsSuMappa(this, 'AggiornaListaEventiTemp');
  }

  tabSelezionatoE(e) {
    this.tabSelezionatoEmit.emit(e);
  }

  visualizzaSla(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Visualizza scritta SLA', e);
    this.visualizzaNomeSla = e;
    this.slaNameComplete = this.prendeNomeSla(this.slaName);
  }

  ridisegnaFrame(e) {
    // if (this.debug2 === true) {
      // logConsole('Controllo su lista eventi nulla 4: ', this.listaEventiDaPassareTemp, this.listaEventiDaPassare2);
    // }

    if (this.listaEventiDaPassareTemp !== undefined) {
      this.listaEventiDaPassare2 = this.listaEventiDaPassareTemp;
    } else {
      if (this.eseguitoInProgetto2 === true) {

      } else {
        this.listaEventiDaPassare2 = null;
      }
    }

    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaGrafico > 1000) {
      this.ultimaVoltaGrafico = ora;

      // if (this.MappaOGrafico2 === 'MC') {
        // this.comboDisabilitata = true;
      // }

      const tm = setTimeout(() => {
          clearTimeout(tm);
        this.accentratore(false, 'RidisegnaFrame');
      }, 100);
    } */
  }

  ridisegnaFrameVECCHIO(e) {
    /* if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo su lista eventi nulla 4: ', JSON.parse(this.listaEventiDaPassare2));
    } */

    if (this.listaEventiDaPassare2 !== undefined) {
      this.listaEventiDaPassare2 = this.listaEventiDaPassare2;
    } else {
      if (this.eseguitoInProgetto2 === true) {

      } else {
        this.listaEventiDaPassare2 = null;
      }
    }

    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaGrafico > 1000) {
      this.ultimaVoltaGrafico = ora;

      // if (this.MappaOGrafico2 === 'MC') {
        // this.comboDisabilitata = true;
      // }

      const tm = setTimeout(() => {
          clearTimeout(tm);
        this.accentratore(false, 'RidisegnaFrame');
      }, 100);
    } */
  }

  spostamentoPaginaMGRilevato(e) {
    if (e && e.pagina !== undefined) {
      const pagina = e.pagina; //  Math.floor(e.skip / e.take);
      this.numeroPaginaMosaicGrid = pagina;

      logConsole('Cambio pagina MG', e, pagina);
    }
  }

  spostamentoPaginaRilevato(e) {
    // this.idSelezionatoAE = [];
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio pagina AE', e);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulita selezione griglia AE', e);
    // const pagina = (e.skip / e.take) + 1;
    // this.paginaEvents = pagina;
    // localStorage.setItem(this.userName + '_' + '_ipp_Events', e.take);

    // this.nuovaPaginaAE = +e.skip;
    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
    // if (e.skip === this.nuovaPaginaAE) {
      // TOLTO 23/10/2024 this.pulisceSelezioneAE = !this.pulisceSelezioneAE;
      // this.datiPointActivityEvents = 'empty grid';
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi da pulisci selezione', +e.skip);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Ricarico events da pulisci selezione', +e.skip);

      // TOLTO 23/10/2024 this.eventsComponent.prendeEvents(this, true, false); // , +e.skip

      // if (+e.skip > -1) {
      //   this.offsetAe = +e.skip;
      // }      
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio skip', e.skip); // , this.offsetAe
    // }
    // }, 100);
  }

  aggiornaPosizioneAE(e) {
    /* if (this.staCaricandoEvents === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: ESCO da Aggiorna posizione AE', e);
      // this.staCaricandoEvents = false;
      return;
    } */
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Aggiorna posizione AE', e);
    // }
    // this.offsetAe = e;
    // TOLTO il 04/05
    // return;
    // TOLTO il 04/05

    // R: rerfesh iniziale del trace: quando seleziono una act il trace non mostra nulla finche non click sulla time chart
    // Commentato sotto
    this.eventsComponent.prendeListaAgents(this); //  , this.offsetAe // 21/07/2025 per mail 26=706/2025 10:03

    this.eventsComponent.prendeEvents(this, true, false, false); // , e
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio skip dopo -2', this.offsetAe, e);
  }

  premutoSyncEvents(e) {
    /* if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.rigaSelezionataAE);
    }
    this.impostaActID(this.rigaSelezionataAE); */

    this.Utils.clickDaMappa = true;
    this.Utils.act_setDelPuntoClickatoSullaMappa = this.act_set;

    // this.Utils.ActivitySetDelPuntoClickato = this.ActivityName2;
    this.Utils.activitySceltaStampa = ExternalUtilities.stringaAGNoACT;

    this.Utils.mappaClickata = this.NumeroFrame;

    // logConsole('Punto clickato 1', this.ActivityName2);
    this.Utils.ActivitySetDelPuntoClickato = this.ActivityName2;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PPP:', this.Utils.ActivitySetDelPuntoClickato);
    if (this.Utils.ActivitySetDelPuntoClickato === '<All>') {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.listaActivityImpostate[1].NAME;
    } else {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.Utils.ActivitySetDelPuntoClickato;
    }

    const d1 = new Date(this.tmsRiga + ' UTC+00').getTime();
    const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Premuta synch', t1);

    // AppComponent.CambioTmsSelezionato(t1);
    // this.Utils.tmsSelezionato = t1;
    this.cambioTmsSelezionato.emit(t1 + ';premutoSyncEvents');
    // this.Utils.aggiornaTmsstringa(this.tmsRiga);
  }

  clickRigaAEv(e) {
    // if (this.debug2 === true) {
      // logConsole('Click riga AE', this.NumeroFrame2, e);
    // }
    // if (this.Utils.caricamentoEventi2InCorso[this.NumeroFrame] === true) {
    //  // logConsole('Click giÃ  in esecuzione');
    //   return;
    // }

    const indice = e.length - 1;

    this.checkPartitionLabel(e);

    // const ora = new Date().getTime();
    // if (ora - this.lastClickRigaAE > 1000) {
    //   this.lastClickRigaAE = ora;

    this.lastFrameAE = this.NumeroFrame;

    // // logConsole('Eseguo Click riga AE', e);
    let riga = e;
    /* // logConsole(e, riga, riga.length);
    if (riga.length > 1) {
      riga = riga[riga.length];
    } */
    if (e && e.tms) {
      riga = e;
    } else {
      if (e && e[indice] && e[indice].tms) {
        riga = e[indice];
      } else {
        // // logConsole(e);
        if (e && e.dataItem) {
          riga = e.dataItem;
        } else {
          if (e && e[indice].dataItem) {
            riga = e[indice].dataItem;
          }
        }
      }
    }
    this.rigaEventoSelezionato = riga;
    // // logConsole(riga);

    let tm = riga.tms;
    this.tmsRiga = tm;
    // if (tm.indexOf('.') > - 1) {
    //  tm = tm.substring(0, tm.indexOf('.'));
    // }

    this.Utils.clickDaMappa = true;
    this.Utils.act_setDelPuntoClickatoSullaMappa = this.act_set;

    // // logConsole(ExternalUtilities.stringaAGNoACT, this.Activity2);
    // this.Utils.ActivitySetDelPuntoClickato = this.ActivityName2;
    this.Utils.activitySceltaStampa = ExternalUtilities.stringaAGNoACT;

    this.Utils.mappaClickata = this.NumeroFrame;

    // if (this.debug2 === true) {
    //   // logConsole('Flag nuovo', this.isNonSyncEventTime2);
    // }

    /* DISABLITATO PER MAIL 05/10/2002 08:18
    if (this.isNonSyncEventTime2 === false) {
      const d1 = new Date(tm + ' UTC+00').getTime();
      const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

      if (this.debug2 === true) {
        // logConsole('Secondo selezionato AE', t1);
      }

      this.cambioTmsSelezionato.emit(t1 + ';clickRigaAEV');
    }
    */

    /* let agnact = '';
    if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = '"null"';
    } else {
      agnact = ExternalUtilities.stringaAGNoACT;
    }
    let valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '\'', '');
    valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '"', '');

    if (!valoreRicerca) {
      return;
    }

    const params = {
      v_agn_code: valoreRicerca,
      v_tms: t1
    };

    const actualCall = 'TMSTOGPS1' + ';' + valoreRicerca + ';' + JSON.stringify(params);
    if (GestioneGrafici.lastCallTmtsToGps !== actualCall) {
      // // logConsole('Vecchia chiamata eventi:', EventsComponent.lastCallEventi[t.NumeroFrame]);
      GestioneGrafici.lastCallTmtsToGps = actualCall;

      if (this.debug2 === true) {
        // logConsole('Chiamata tms to gps per Time chart', this.NumeroFrame2, params);
      }
      this.apiService.chiamataPost(this.Utils, 'antsgeo_tms_to_gps1', params)
      // .map(response => response.json())
      .subscribe((data2: any) => {
        // // logConsole(data, this.NumeroFrame);
        if (data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

          // const coordinate = this.map1[this.NumeroFrame2].getEventCoordinate(event);
          if (data2 && data2.lat && data2.lng && data2.lat !== '' && data2.lng !== '' && +data2.lng !== 0 && +data2.lat !== 0) {
            if (this.debug2 === true) {
              // logConsole('Get Coord Data in Time Chart', this.NumeroFrame2, data2);
            }

            this.impostaCenterPosition.emit(data2.lng + ' ' + data2.lat);
            this.impostaTimeCursorPosition.emit(data2.lng + ' ' + data2.lat);
          }
        }
      });
    }
    */

    // // logConsole(t1, d1, tm, riga.tms);
    // this.Utils.tmsSelezionato = t1;

    // const ttt = ((new Date(riga.tms).getTime()) / 1000).toFixed().toString() + '000';
    // logConsole('Punto clickato 2', this.ActivityName2);
    this.Utils.ActivitySetDelPuntoClickato = this.ActivityName2;
    // // logConsole('PPP:', this.Utils.ActivitySetDelPuntoClickato, this.listaActivityImpostate, this.listaActivityName2);
    if (this.Utils.ActivitySetDelPuntoClickato === '<All>') {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.listaActivityImpostate[1].NAME;
    } else {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.Utils.ActivitySetDelPuntoClickato;
    }
      // // logConsole('Click tms su eventi:', riga.tms, ttt);
    // if (this.timeFilter2 !== 2 && this.timeFilter2 !== 'Time Range') {
////        AppComponent.CambioTmsSelezionato(t1);
    // }
    const a = new Date().getTime();
    // // logConsole('Prima del click', a);
    this.eventsComponent.prendeDettaglioEvents(this, riga.ROW_ID, riga.act_id, riga.file_hist_id);
    // // logConsole('Dopo il click', new Date().getTime() - a);

    /* this.idSelezionatoAE = [-1];
    this.idSelezionatoAE.push(riga.ROW_ID);
    if (this.Utils.listaEventiSE) {
      this.Utils.listaEventiSE.forEach(element => {
        if (this.idSelezionatoAE === '') {
          this.idSelezionatoAE = new Array();
        }
        this.idSelezionatoAE.push(element.ROW_ID);
      });
    }
    if (this.debug2 === true) {
      // logConsole('Righe selezionate AE 3', this.idSelezionatoAE);
    }
    */
    this.rigaSelezionataAE = riga;
    this.lastEventoClicked = { Riga: riga, skip: 0 }; // +this.offsetAe - 6
  // }
    // if (this.debug2 === true) {
      // logConsole('ID evento clickato', this.lastEventoClicked);
    // }
  }

  clickRigaAEvVECCHIO(e) {
    // if (this.debug2 === true) {
      // logConsole('ClickRigaAEV: Click riga AE', this.NumeroFrame2, e);
    // }
    // if (this.Utils.caricamentoEventi2InCorso[this.NumeroFrame] === true) {
    //  // logConsole('Click giÃ  in esecuzione');
    //   return;
    // }

    const indice = e.length - 1;

    // const ora = new Date().getTime();
    // if (ora - this.lastClickRigaAE > 1000) {
    //   this.lastClickRigaAE = ora;

    this.lastFrameAE = this.NumeroFrame;

    // // logConsole('Eseguo Click riga AE', e);
    let riga = e;
    /* // logConsole(e, riga, riga.length);
    if (riga.length > 1) {
      riga = riga[riga.length];
    } */
    if (e && e.tms) {
      riga = e;
    } else {
      if (e && e[indice] && e[indice].tms) {
        riga = e[indice];
      } else {
        // // logConsole(e);
        if (e && e.dataItem) {
          riga = e.dataItem;
        } else {
          if (e && e[indice].dataItem) {
            riga = e[indice].dataItem;
          }
        }
      }
    }
    // // logConsole(riga);

    let tm = riga.tms;
    this.tmsRiga = tm;
    // logConsole('ClickRigaAEV: Tms riga per synch:', this.tmsRiga);
    // if (tm.indexOf('.') > - 1) {
    //  tm = tm.substring(0, tm.indexOf('.'));
    // }

    this.Utils.clickDaMappa = true;
    this.Utils.act_setDelPuntoClickatoSullaMappa = this.act_set;

    // // logConsole(ExternalUtilities.stringaAGNoACT, this.Activity2);
    // this.Utils.ActivitySetDelPuntoClickato = this.ActivityName2;
    this.Utils.activitySceltaStampa = ExternalUtilities.stringaAGNoACT;

    this.Utils.mappaClickata = this.NumeroFrame;

    // if (this.debug2 === true) {
    //   // logConsole('Flag nuovo', this.isNonSyncEventTime2);
    // }

    /* DISABLITATO PER MAIL 05/10/2002 08:18
    if (this.isNonSyncEventTime2 === false) {
      const d1 = new Date(tm + ' UTC+00').getTime();
      const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

      if (this.debug2 === true) {
        // logConsole('Secondo selezionato AE', t1);
      }

      this.cambioTmsSelezionato.emit(t1 + ';clickRigaAEV');
    }
    */

    let agnact = '';
    if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
      agnact = '"null"';
    } else {
      agnact = ExternalUtilities.stringaAGNoACT;
    }
    let valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '\'', '');
    valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '"', '');

    if (!valoreRicerca) {
      return;
    }

    const params = {
      v_agn_code: valoreRicerca,
      v_tms: tm
    };

    const actualCall = 'TMSTOGPS1' + ';' + valoreRicerca + ';' + JSON.stringify(params);
    // if (GestioneGrafici.lastCallTmtsToGps !== actualCall) {
      // // logConsole('Vecchia chiamata eventi:', EventsComponent.lastCallEventi[t.NumeroFrame]);
    //   GestioneGrafici.lastCallTmtsToGps = actualCall;

      // if (this.debug2 === true) {
        // logConsole('ClickRigaAEV: Chiamata tms to gps per synch', this.NumeroFrame2, params);
      // }
      this.apiService.chiamataPost(this.Utils, 'antsgeo_tms_to_gps1', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        // // logConsole(data, this.NumeroFrame);
        if (data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

          // const coordinate = this.map1[this.NumeroFrame2].getEventCoordinate(event);
          if (data2 && data2.lat && data2.lng && data2.lat !== '' && data2.lng !== '' && +data2.lng !== 0 && +data2.lat !== 0) {
            // if (this.debug2 === true) {
              // logConsole('ClickRigaAEV: Get Coord Data in synch', this.NumeroFrame2, data2);
            // }

            // this.impostaCenterPosition.emit(data2.lng + ' ' + data2.lat);
            // this.impostaTimeCursorPosition.emit(data2.lng + ' ' + data2.lat);

            // this.Utils.posDaImpostare = 'POINT(' + data2.lng + ' ' + data2.lat + ')';
            // this.posDaImpostareEmit.emit('POINT(' + data2.lng + ' ' + data2.lat + ')');
            this.impostaCenterPosition.emit('POINT(' + data2.lng + ' ' + data2.lat + ')');

            // logConsole('ClickRigaAEV: Get Coord Data in synch 2', this.NumeroFrame2, 'POINT(' + data2.lng + ' ' + data2.lat + ')');
          }
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        console.error('POST ERROR Tms to Gps: ', error, error.message);
      });
    // }

    // // logConsole(t1, d1, tm, riga.tms);
    // this.Utils.tmsSelezionato = t1;

    // const ttt = ((new Date(riga.tms).getTime()) / 1000).toFixed().toString() + '000';
    // logConsole('Punto clickato 3', this.ActivityName2);
    this.Utils.ActivitySetDelPuntoClickato = this.ActivityName2;
    // // logConsole('PPP:', this.Utils.ActivitySetDelPuntoClickato, this.listaActivityImpostate, this.listaActivityName2);
    if (this.Utils.ActivitySetDelPuntoClickato === '<All>') {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.listaActivityImpostate[1].NAME;
    } else {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.Utils.ActivitySetDelPuntoClickato;
    }
      // // logConsole('Click tms su eventi:', riga.tms, ttt);
    // if (this.timeFilter2 !== 2 && this.timeFilter2 !== 'Time Range') {
////        AppComponent.CambioTmsSelezionato(t1);
    // }
    const a = new Date().getTime();
    // // logConsole('Prima del click', a);
    this.eventsComponent.prendeDettaglioEvents(this, riga.ROW_ID, riga.act_id, riga.file_hist_id);
    // // logConsole('Dopo il click', new Date().getTime() - a);

    /* this.idSelezionatoAE = [-1];
    this.idSelezionatoAE.push(riga.ROW_ID);
    if (this.Utils.listaEventiSE) {
      this.Utils.listaEventiSE.forEach(element => {
        if (this.idSelezionatoAE === '') {
          this.idSelezionatoAE = new Array();
        }
        this.idSelezionatoAE.push(element.ROW_ID);
      });
    }
    if (this.debug2 === true) {
      // logConsole('Righe selezionate AE 3', this.idSelezionatoAE);
    }
    */

    // this.rigaSelezionataAE = riga;
    this.lastEventoClicked = { Riga: riga, skip: 0 }; // +this.offsetAe - 6
  // }
    // if (this.debug2 === true) {
      // logConsole('ClickRigaAEV: ID evento clickato', this.lastEventoClicked);
    // }
  }

  getCoordClick(event) {
    if (this.staMuovendoMappa) {
      return;
    }
    // return;

    // return;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'click su mappa', this.eseguitoInProgetto22, this.overviewZoom2);
    // const mappaGlobale = this.Utils.tornaGlobale(this);
    if (this.eseguitoInProgetto2 === true) {
      if (this.overviewZoom2 === true) {
        if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.viewMappaAttuale) {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su mappa', event);
          const coordinate = this.map1[this.NumeroFrame2].getEventCoordinate(event);
          // const rotation = this.viewMappaAttuale.getRotation();
          // this.coordinateCambiateConClick.emit(coordinate);
          // this.rotationCambiata.emit(rotation);
          this.coordinateDaClickSuMappa.emit(coordinate);
          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su mappa per progetto esterno', coordinate);
          // }

          if (this.showRaysAllLayer2 === undefined || this.showRaysAllLayer2 === true) {
            const coord = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
            this.showRaysAllLayerC.disegnaAllLayers(this, coord, false, 'getCoordClick');
          }
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, rotation);
        }
      }
      // this.accentratore(true);
    } else {
      if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.viewMappaAttuale) {
        const coordinate = this.map1[this.NumeroFrame2].getEventCoordinate(event);
        const coord = transform(coordinate, 'EPSG:3857', 'EPSG:4326');

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su mappa per progetto interno', coord);
        // this.getCoord(null);
      }
    }
  }

  getCoord(event: any, daDove) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord', this.NumeroFrame2, this.Utils.tmsSelezionato);
    if (this.staLeggendoCoordinate === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord. Sta leggendo coordinate. Esco');

      return;
    }
    // const ora = new Date().getTime();
    // if (ora - this.lastTmsGetCoords > 1000) {
    //   this.lastTmsGetCoords = ora; */

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'click su mappa', this.NumeroFrame, this.Utils.tmsSelezionato);
      // const mappaGlobale = this.Utils.tornaGlobale(this);

      // if (this.overviewZoom2 === false) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord mappa e view', this.NumeroFrame2, this.map1[this.NumeroFrame2], this.viewMappaAttuale);

      if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.viewMappaAttuale) {
        // const tm = setTimeout(() => {
        //   clearTimeout(tm);
          let id = '';
          /* this.Utils.sceltaActivityDaSet[this.Activity2].forEach(element => {
            if (element && element.NAME === ExternalUtilities.stringaAGNoACT) {
              id = element.ID;
            }
          }); */
          if (this.Utils.sceltaActivityDaSet[this.Activity2]) {
            this.Utils.sceltaActivityDaSet[this.Activity2].forEach(element => {
              if (element) {
                id += element.ID + ',';
              }
            });
          }
          if (id !== '') {
            id = id.substring(0, id.length - 1);
          }
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, id);

          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord id', this.NumeroFrame2, this.Utils.sceltaActivityDaSet, this.Activity2, id, this.Utils.tmsSelezionato);

          if ((this.Utils.tmsSelezionato !== undefined && this.Utils.tmsSelezionato !== null) || this.eseguitoInProgetto2 === true) {
            /* const params = {
              v_filter_act_id_list: id, // this.Utils.prendeActivityScelta(this),
              v_tms: this.Utils.tmsSelezionato
            }; */
            let agnact = '';
            if (ExternalUtilities.stringaAGNoACT && ExternalUtilities.stringaAGNoACT === '') {
              agnact = '"null"';
            } else {
              const agn = ExternalUtilities.stringaAGNoACT.indexOf('[') > -1 && ExternalUtilities.stringaAGNoACT.indexOf(']') > -1 ? ExternalUtilities.stringaAGNoACT : '[ACT] ' + ExternalUtilities.stringaAGNoACT;
              agnact = agn;
            }
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Valore agnact', agnact);

            if (agnact !== undefined || this.eseguitoInProgetto2 === true) {
              let valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '\'', '');
              valoreRicerca = ExternalUtilities.effettuaReplace(agnact, '"', '');

              if (!valoreRicerca) {
                return;
              }

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.tmsSelezionato.toString());
              if ((!this.Utils.tmsSelezionato || (this.Utils.tmsSelezionato && this.Utils.tmsSelezionato.toString().length < 10))) {
                // && this.eseguitoInProgetto22 === false) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord: Esco per formato data non valido ', this.NumeroFrame2, this.Utils.tmsSelezionato);

                  return;
              }

              const params = {
                v_agn_code: valoreRicerca,
                v_tms: this.Utils.tmsSelezionato
              };

              const actualCall = 'TMSTOGPS1' + ';' + valoreRicerca + ';' + JSON.stringify(params);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord last/actual', this.NumeroFrame2);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vecchia chiamata', this.lastCallTmsToGps[this.frameAttivo2]);
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nuova chiamata', actualCall);

              if (this.lastCallTmsToGps[this.frameAttivo2] !== actualCall || (this.eseguitoInProgetto2 === true && this.progettoEsterno2 === 'FleetManager')) {
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vecchia chiamata eventi:', EventsComponent.lastCallEventi[t.NumeroFrame]);
                this.lastCallTmsToGps[this.frameAttivo2] = actualCall;

                // this.lastParamsCoord = params;
                this.staLeggendoCoordinate = true;

                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Params', this.NumeroFrame2, params);

                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, params);
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'tms_to_gps', this.NumeroFrame, this.frameAttivo, new Date().getTime());
                this.apiService.chiamataPost(this.Utils, 'antsgeo_tms_to_gps1', params)
                // .map(response => response)
                .pipe(takeUntil(this.destroy$))
                .subscribe((data2: any) => {
                  // const data2 = JSON.parse(data);
                    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data, this.NumeroFrame);
                  
                  // logConsole('TMS TO GPS', data2);
                  // return;

                  if (data2 !== null) {
                    ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

                    // const data2 = data2;

                    // const coordinate = this.map1[this.NumeroFrame2].getEventCoordinate(event);
                    const coordinate = new Array();
                    // logConsole('Coordinate rilevate', data2);
                    if (data2 && data2.lat && data2.lng && +data2.lng !== 0 && +data2.lat !== 0) {
                      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Data', this.NumeroFrame2, data2);

                      coordinate.push(data2.lng);
                      coordinate.push(data2.lat);
                      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, coordinate);

                      // logConsole('Get coord chiamato da ' + daDove, this.NumeroFrame2, data2);

                      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro1');
                      // Tolto il centro per richiesta...
                      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord click su mappa zoom', this.NumeroFrame2, this.Utils.clickSuMappaZoom[this.NumeroFrame2]);

                      if (this.Utils.clickSuMappaZoom[this.NumeroFrame2] === false && this.map1[this.NumeroFrame2]) {
                      // if (this.map1[this.NumeroFrame2]) {
                        // --- const bbox = this.map1[this.NumeroFrame2].getView().calculateExtent(this.map1[this.NumeroFrame2].getSize());
                        const bboxFin  = ExternalUtilities.ritornaBboxGiusta(this, 'getCoord');
                        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord ritorno coord', this.NumeroFrame2, bboxFin);
                          // const bboxFin = transform(bbox, 'EPSG:3857', 'EPSG:4326');
                        /* if (!bboxFin || bboxFin === '') {
                          if (this.debug2 === true) {
                            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Centro NON impostato 0');
                          }
                          const centro = [12.4090874, 41.8223068];
                          this.viewMappaAttuale.setCenter(transform(centro, 'EPSG:4326', 'EPSG:3857'));
                          this.centroImpostato = transform(centro, 'EPSG:4326', 'EPSG:3857');
                        } else { */
                          let coord2 = [+coordinate[0], +coordinate[1]];
                          if (coord2[0] < 90) {
                            coord2 = transform(coord2, 'EPSG:4326', 'EPSG:3857');
                          }
                          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord ritorno coord', this.NumeroFrame2, coord2);

                          if ((!bboxFin || bboxFin === '') || (coord2[0] < bboxFin[0] || coord2[1] < bboxFin[1] ||
                            coord2[0] > bboxFin[2] || coord2[1] > bboxFin[3])) {
                            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord IMPOSTO IL CENTRO 8', this.NumeroFrame2, coord2);

                            if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.map1[this.NumeroFrame2].getView()) {
                              this.viewMappaAttuale.setCenter(coord2); // transform(coord2, 'EPSG:4326', 'EPSG:3857'));
                              // logConsole('Cambio coordinate per getCoord', coord2, this.NumeroFrame2);

                              // this.zoomImpostatoNelFrame = this.map1[this.NumeroFrame2].getView().getZoom();
                              // const bboxNuova = this.map1[this.NumeroFrame2].getView().calculateExtent(this.map1[this.NumeroFrame2].getSize());

                              // logConsole('Centro impostato 3', this.NumeroFrame2, coord2);
                              this.map1[this.NumeroFrame2].getView().setCenter(coord2);
                              const c = this.map1[this.NumeroFrame2].getView().calculateExtent(this.map1[this.NumeroFrame2].getSize());
                              // logConsole('Coordinate', coord2, c);
                              if (!isNaN(c[0])) {
                                coord2 = c;
                              }
                              // coord2 = this.map1[this.NumeroFrame2].getView().calculateExtent(this.map1[this.NumeroFrame2].getSize());
                            }
                            if (!this.zoomImpostatoNelFrame) {
                              this.zoomImpostatoNelFrame = 11;
                            }

                            this.centroImpostato = coord2; // transform(bboxNuova, 'EPSG:4326', 'EPSG:3857');
                            // logConsole('Centro da get coord ', coord2);

                            // logConsole('Centro impostato emit in get coord', this.NumeroFrame2, this.centroImpostato, '', this.zoomImpostatoNelFrame);
                            this.centroImpostatoEmit.emit({
                              daChi: this.NumeroFrame2, 
                              funzione: 'GetCoord 1', 
                              centro: this.centroImpostato, 
                              zoom: this.zoomImpostatoNelFrame,
                              tipoMappa: 'GETCOORD' // this.overviewZoom2
                            });
                    
                            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Centro impostato', this.centroImpostato);
                          } else {
                            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Centro NON impostato 1. Coordinate all\'interno delle precedenti');

                            /* const centro = [12.4090874, 41.8223068];
                            this.viewMappaAttuale.setCenter(transform(centro, 'EPSG:4326', 'EPSG:3857'));
                            this.centroImpostato = transform(centro, 'EPSG:4326', 'EPSG:3857'); */
                          }
                        // }
                          const tm = setTimeout(() => {
                            clearTimeout(tm);
                            
                            this.accentratore(true, 'GetCoord');
                          }, 1000);
                      } else {
                        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Centro NON impostato 2');

                        // TOLTO 15/05/2025
                        /* let centro = [12.4090874, 41.8223068];
                        centro = transform(centro, 'EPSG:4326', 'EPSG:3857');
                        if (this.viewMappaAttuale) {
                          this.viewMappaAttuale.setCenter(centro);
                        }
                        // logConsole('Centro impostato 4', this.NumeroFrame2, centro);
                        // logConsole('Imposto centro 2', this.NumeroFrame2, centro, this.zoomImpostatoNelFrame);
                        this.centroImpostato = centro;
                        this.centroImpostatoEmit.emit({
                          daChi: this.NumeroFrame2, 
                          funzione: 'GetCoord 2', 
                          centro: this.centroImpostato, 
                          zoom: this.zoomImpostatoNelFrame,
                          tipoMappa: this.overviewZoom2
                        }); */
                        // TOLTO 15/05/2025

                        this.Utils.clickSuMappaZoom[this.NumeroFrame2] = false;
                      }
                      // Tolto il centro per richiesta...

                      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto coordinate da lettura db:', this.NumeroFrame);
                      // TOLTO 15/05/2025
                      /* if (this.map1[this.NumeroFrame2] && this.viewMappaAttuale) {
                        this.map1[this.NumeroFrame2].setView(this.viewMappaAttuale);
                      } */
                      // TOLTO 15/05/2025
                    } else {
                      // if (this.debug2 === true) {
                        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Centro NON impostato 3');
                      // }

                      // TOLTO 15/05/2025
                      /* let centro = [12.4090874, 41.8223068];
                      if (this.viewMappaAttuale) {
                        this.viewMappaAttuale.setCenter(transform(centro, 'EPSG:4326', 'EPSG:3857'));
                      }
                      // logConsole('Centro impostato 5', this.NumeroFrame2, centro);
                      centro = transform(centro, 'EPSG:4326', 'EPSG:3857');
                      // logConsole('Imposto centro 3', this.NumeroFrame2, centro, this.zoomImpostatoNelFrame);
                      this.centroImpostato = centro;
                      this.centroImpostatoEmit.emit({
                        daChi: this.NumeroFrame2, 
                        funzione: 'GetCoord 3', 
                        centro: this.centroImpostato, 
                        zoom: this.zoomImpostatoNelFrame,
                        tipoMappa: this.overviewZoom2
                      }); */
                      // TOLTO 15/05/2025
                    }
                    this.staLeggendoCoordinate = false;
                  } else {
                    // TOLTO 15/05/2025
                    /* const centro = [12.4090874, 41.8223068];
                    if (this.viewMappaAttuale) {
                      this.viewMappaAttuale.setCenter(transform(centro, 'EPSG:4326', 'EPSG:3857'));
                    }
                    // logConsole('Centro impostato 6', this.NumeroFrame2, centro);
                    this.centroImpostato = transform(centro, 'EPSG:4326', 'EPSG:3857');
                    this.centroImpostatoEmit.emit({
                      daChi: this.NumeroFrame2, 
                      funzione: 'GetCoord 4', 
                      centro: this.centroImpostato, 
                      zoom: this.zoomImpostatoNelFrame,
                      tipoMappa: this.overviewZoom2
                    });
                    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, null);
                    */
                    // TOLTO 15/05/2025

                    this.staLeggendoCoordinate = false;
                  }
                }, error => {
                  console.error('POST ERROR Tms to Gps: ', error, error.message);

                  this.staLeggendoCoordinate = false;
                });
              }
            }
            // }, 1000);
            const rotation = this.viewMappaAttuale.getRotation();
            this.rotationCambiata.emit(rotation);
          } else {
            /*
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Centro NON impostato 4');
            const centro = [12.4090874, 41.8223068];
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto zoom in getCoord: 9');
            // this.viewMappaAttuale.setZoom(9); // TOLTO ZOOM PER TEST
            this.bboxEmit.emit(centro);
            // logConsole('Centro impostato 15', this.NumeroFrame2, centro);
            this.centroImpostato = centro; //  transform(centro, 'EPSG:4326', 'EPSG:3857');
            */
          }
      } else {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da getcoord per mancanza di mappa oppure view', this.map1[this.NumeroFrame2], this.viewMappaAttuale);
      }
      // }
    // }
  }

  showLegenda() {
    this.showLegend = !this.showLegend;
  }

  exportDati(formato) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Export dati formato', formato, this.MappaOGrafico2);

    /* if (this.MappaOGrafico2 === 'MC') {
      this.showExportBox = true;
    } else { */
    if (this.MappaOGrafico2 !== 'M') {
      this.exportAntenneKML = false;
      this.exportPlanimetryKML = false;
      this.exportOverlayKML = false;
      this.exportPathAntenneKML = false;
      this.exportRaysKML = false;
      this.exportEventsKML = false;
    } else {
      this.exportAntenneKML = false;
      this.exportPlanimetryKML = false;
      this.exportOverlayKML = false;
      this.exportPathAntenneKML = true;
      this.exportRaysKML = false;
      this.exportEventsKML = false;
    }

    let lista = undefined;
    const tipoEvento2 = Array.isArray(this.tipoEvento2) ? this.tipoEvento2[this.NumeroFrame2] : this.tipoEvento2;

    if (this.shownEvents2 === true) {
      if (tipoEvento2 === 'L') {
        lista = this.listaEventiDaPassare2;
      } else {
        lista = JSON.stringify(this.eventiSceltiES2);
      }
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi da passare', lista);
    let listaMisure = '';
    if (!this.exportAllMeasuresKML) {
      this.Measure.forEach(element => {
        if (element && element !== '' && element !== null) {
          const misura = ExternalUtilities.ritornaMisura(this, element, this.Utils.globalMeasure, this.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Frame 2');
          listaMisure += misura + ',';

          /* if (element && (element.indexOf('<GLOBAL MEASURE>') > -1 || (element.indexOf('global_measure') > -1 && element.indexOf('global_measure_') === -1))) {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca misura globale', t.Utils.globalMeasure, t.Utils.globalMeasure.MEASR_CODE);
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t.measureData2);
            this.measureData2.forEach(element2 => {
              if (this.Utils.globalMeasure) {
                if (element2.CODE === this.Utils.globalMeasure.MEASR_CODE) {
                  const m = element2.CODE.replace('"', '').replace('"', '');
                  listaMisure += element.replace('<GLOBAL MEASURE>', m).replace('global_measure', m) + ',';
                }
              }
            });
          } else {
            // MAIL 18/07/2023 16:30 -> possibilitÃ  di usare anche sulle mappe e volendo istogrami, pareto etc le <globaly checked measure>
            if (element && (element.indexOf('<GLOBAL CHECKED MEASURE ') > -1 || element.indexOf('global_measure_') > -1)) {
              let indice;
              if (element.indexOf('<GLOBAL CHECKED MEASURE ') > -1) {
                indice = +(element.replace('<GLOBAL CHECKED MEASURE ', '').replace('>', ''));
              } else {
                indice = +(element.replace('global_measure_', ''));
              }
              if (indice && indice > 0) {
                if (ExternalUtilities.misureGlobali[indice - 1]) { // !== '') {
                  let cosa;
                  if (ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE']) {
                    cosa = ExternalUtilities.misureGlobali[indice - 1]['MEASR_CODE'];
                  } else {
                    cosa = ExternalUtilities.misureGlobali[indice - 1];
                  }
                  // Modifica 25/02/2025
                  // listaMisure += cosa  + ',';
                  listaMisure += (element.replace('global_measure_' + indice, ''), cosa).replace('<GLOBAL CHECKED MEASURE ' + indice  + '>', cosa)  + ',';
                }
              }
            } else {
              // MAIL 18/07/2023 16:30 -> possibilitÃ  di usare anche sulle mappe e volendo istogrami, pareto etc le <globaly checked measure>
              listaMisure += element + ',';
            }
          } */
        }
      });
      if (listaMisure.length > 0) {
        listaMisure = listaMisure.substring(0, listaMisure.length - 1);
      }
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Passaggio misure: ', listaMisure);
      // return;
    } else {
      listaMisure = null;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm); 

      this.exportComponent.exportDati(this, formato, lista, tipoEvento2, listaMisure); 
    });
    // }
  }

  selectTimeFilter(e) {
    let timeMode = 'ALL';
    if (e === 2) {
      timeMode = 'SELECTED';
    }
    this.timeModePerPausa = timeMode;
    this.datiPerPausa = {
      autoRunAttivo: this.modalitaRealTimeAttiva2,
      timeMode: this.timeModePerPausa
    }
    // // logConsole('Dati per pausa 3: ', this.datiPerPausa);
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Dati per pausa *3*', this.NumeroFrame2, this.datiPerPausa);
    // }

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Time filter', e);
    this.timeFilterEmit.emit(e);
  }

  cambioDesignInfo(e) {
    this.designInfoEmit.emit(e);
  }

  cambioViewDefinition(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'cambio view definition', e);
    // }
    this.viewDefinition2 = e;
    // this.pivotComponent.disegnaPivotFine(this);

    this.viewDefinitionEmit.emit(e);
  }

  /* cambiataView() {
    if (this.ngPanel) {
      const tm = setTimeout(() => {
          clearTimeout(tm);
        this.viewDefinitionEmit.emit(this.ngPanel.viewDefinition);
      }, 10);
    }
  }

  formatItem(e: wjGrid.FormatItemEventArgs) {
    if (this.pivotGrid && e.panel === this.pivotGrid.cells) {
      let color = '';

      if (e.col % 2 === 1) {
        const value = this.pivotGrid.getCellData(e.row, e.col, false);
        let glyph = 'circle';
        const span = ' <span style="font-size:120%" class="wj-glyph-{glyph}"></span>';
        color = '#d8b400';
        if (value != null) {
          if (value < 0) { // negative variation
            color = '#9f0000';
            glyph = 'down';
          } else if (value > 0.05) { // positive variation
            color = '#4c8f00';
            glyph = 'up';
          }
          e.cell.innerHTML += span.replace('{glyph}', glyph);
        }
      }
      e.cell.style.color = color;
    }
  } */

  cambiaFrameManuale(n) {
    this.mappaDisegnata[this.NumeroFrame2] = false;

    this.bloccaEventiSuMappa('Cambia frame manuale');

    // logConsole('CAMBIA FRAME ', this.NumeroFrame2, n);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame manuale: ', n);

    /* const diff = new Date().getTime() - this.ultimoCambioFrame;
    if (diff < 1000) {
      return;
    }
    this.ultimoCambioFrame = new Date().getTime(); */
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, n);

    // ********************************
    // this.NumeroFrame = n;
    // this.pulisceCalls();
    // ********************************
    /* this.NumeroFrame = n;
    // this.pulisceCalls(); */
    // ********************************
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame manuale:', this.NumeroFrame2,  n, this.MappaOGrafico, this.overviewZoom2);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame manuale:', this.MappaOGraficoTutti2);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame manuale: Nome frame:', this.frameName2);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame manuale: Tipo frame vecchio:', this.MappaOGraficoTutti2[this.frameAttivo2]);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame manuale: Tipo frame nuovo:', this.MappaOGraficoTutti2[n]);

    if (!this.eseguitoInProgetto2) {
      this.frameAttivoEmit.emit(-1);
      this.puliziaComponent.pulisceFrame(this, n, false);
    }

    if (!this.barraImpostataAperta) {
      this.dimeBarraAperta = this.dBarraChiusa;
    } else {
      this.dimeBarraAperta = this.dBarraAperta;
    }

    // logConsole('dime 4', this.dimeBarraAperta);

    /* if (this.frameAttivoAppoggio2.toString().indexOf(';') > -1) {
      this.frameAttivoAppoggio2 = this.frameAttivoAppoggio2.substring(0, this.frameAttivoAppoggio2.indexOf(';'));
      cambia = false;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame: frame attivo da combo', this.frameAttivoAppoggio2);
    } */

    const t0 = setTimeout(() => {
      clearTimeout(t0);

      // logConsole('fa', n);
      this.frameAttivo2 = n;
      this.frameAttivoEmit.emit(n);
  
      if (this.MappaOGraficoTutti2 && this.MappaOGraficoTutti2[this.frameAttivo2]) {
        // this.creataMappa = false;
        // this.viewMappaAttuale = undefined;
        this.MappaOGrafico2 = this.MappaOGraficoTutti2[this.frameAttivo2];
        // this.mappaOGraficoEmit.emit(this.MappaOGrafico2Tutti[this.frameAttivo2]);
      }
  
      /* if (this.MappaOGrafico2 === 'M') {
        // const tm = setTimeout(() => {
        //     clearTimeout(tm);
          this.redrawComponente('Imposta Frame Attivo');
        // }, 100);
      }
  
      const tm = setTimeout(() => {
        clearTimeout(tm);
  
        this.accentratore(true, 'CambiaFrameManuale');
      }, 100); */
    }, 1000);
  }

  ultimaVoltaCambioFrame = -1;

  cambiaFrame(n) {
    conta('frame: cambio vista', 'frame ' + this.NumeroFrame2);
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaCambioFrame < 2000) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame: Esco per troppo veloce', this.NumeroFrame2);

      return;
    }
    this.ultimaVoltaCambioFrame = ora;

    // logConsole('Cambio frame attivo 1', this.NumeroFrame2, n);

    this.mappaDisegnata[this.NumeroFrame2] = false;

    this.bloccaEventiSuMappa('Cambia frame ' + n);
    
    let cambia = true;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame: ', this.NumeroFrame2, this.frameAttivoAppoggio2);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame: Premuto da html', this.NumeroFrame2, n);
    if (n !== null) {
      this.frameAttivoAppoggio2 = n;
      cambia = false;
    }
    if (!this.frameAttivoAppoggio2) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame: Esco per frame attivo2 null', this.NumeroFrame2);
      return;
    }

    // logConsole('Cambio frame attivo 2', this.NumeroFrame2, n);

    /* const diff = new Date().getTime() - this.ultimoCambioFrame;
    if (diff < 1000) {
      return;
    }
    this.ultimoCambioFrame = new Date().getTime(); */
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, n);
    
    // this.puliziaComponent.pulisceFrame(this, n, false);

    // ********************************
    // this.NumeroFrame = n;
    // this.pulisceCalls();
    // ********************************
    /* this.NumeroFrame = n;
    // this.pulisceCalls(); */
    // ********************************
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame:', this.NumeroFrame2,  this.frameAttivoAppoggio2, this.MappaOGrafico, this.overviewZoom2);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame:', this.NumeroFrame2, this.MappaOGraficoTutti2);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame. Nome frame:', this.NumeroFrame2, this.frameName2);

    if (!this.barraImpostataAperta) {
      this.dimeBarraAperta = this.dBarraChiusa;
    } else {
      this.dimeBarraAperta = this.dBarraAperta;
    }

    // logConsole('dime 5', this.dimeBarraAperta);

    /* if (this.frameAttivoAppoggio2.toString().indexOf(';') > -1) {
      this.frameAttivoAppoggio2 = this.frameAttivoAppoggio2.substring(0, this.frameAttivoAppoggio2.indexOf(';'));
      cambia = false;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame: frame attivo da combo', this.frameAttivoAppoggio2);
    } */

    if (this.NumeroFrame2 === this.frameAttivoAppoggio2) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame: Esco per frame vecchio e nuovo uguali');
      return;
    }

    // this.frameAttivoEmit.emit(-1);

    const t0 = setTimeout(() => {
      clearTimeout(t0);
      
      this.frameAttivo2 = this.frameAttivoAppoggio2;
      // this.frameAttivoEmit.emit(this.frameAttivo2);

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame. Cambia:', this.NumeroFrame2, cambia);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambia frame. Da Context:', this.NumeroFrame2, this.cambioFrameDaContext);

      // const tm = setTimeout(() => {
      //   clearTimeout(tm);
      if (this.MappaOGrafico2 === 'M') {
        ExternalUtilities.staMassimizzando[this.NumeroFrame2] = false;

        /* let i = 0;
        this.lastCallMeasures[this.NumeroFrame2].forEach(element => {
          this.lastCallMeasures[this.NumeroFrame2][i] = '';
          i++;
        }); */

        // logConsole('Cambio frame', this.frameAttivo2);

        // this.puliziaComponent.pulisceMappa(this, true);

        if (!this.map1[this.NumeroFrame2]) {
          this.redrawComponente('Imposta Frame Attivo', this.frameAttivo2);
        }
      } else {
        if (this.MappaOGrafico2 === 'MC') {
          this.aggiornaGrafici[this.NumeroFrame2] = true;
          this.lastCallGrafici[this.NumeroFrame2] = '';
          // logConsole('Cambio frame attivo 3', this.NumeroFrame2, n);
        } else {
          // TOLTE LE PULIZIE DELLE VARIABILI PER NON FAR FARE PIU' LO SCATTINO IN CASO DI RIDISEGNO
          if (this.MappaOGrafico2 === 'AH') {
            // logConsole('Azzero ultima chiamata histogrammi 1', this.NumeroFrame2);
            // this.lastCallHistogram[this.NumeroFrame2] = '';
          } else {
            if (this.MappaOGrafico2 === 'PC') {
              // this.lastCallPareto[this.NumeroFrame2] = '';
            } else {
              if (this.MappaOGrafico2 === 'PS') {
                // this.lastCallScatter[this.NumeroFrame2] = '';
              }
            }
          }
          // TOLTE LE PULIZIE DELLE VARIABILI PER NON FAR FARE PIU' LO SCATTINO IN CASO DI RIDISEGNO
        }
      
        this.creaNomiFramesPerTab();
        // this.cambiaFrameManuale(this.frameAttivo2);
        // }
      }

      if (cambia || this.cambioFrameDaContext === true) {
        if (this.MappaOGraficoTutti2 && this.MappaOGraficoTutti2[this.frameAttivo2]) {
          this.MappaOGrafico2 = this.MappaOGraficoTutti2[this.frameAttivo2];
          this.mappaOGraficoEmit.emit(this.MappaOGraficoTutti2[this.frameAttivo2]);
        }
      }

      if (this.MappaOGrafico2 === 'M') {
        if (this.eseguitoInProgetto2 === true) {
          /* this.mappaLocaleImpostata = false;
          this.mappaGlobaleImpostata = false;
          this.viewMappaGlobale = undefined;
          this.viewMappaLocale = undefined; */
          // this.viewMappaAttuale = undefined;
          /* if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Metto mappa invisibile 3', this.NumeroFrame2);
          }
          this.mappaVisibile = false;
          this.creataMappa = false; */
        } else {
          setTimeout(() => {
            this.redrawComponente('CambiaFrame', this.frameAttivoAppoggio2);
          }, 100);
        }
      }
  
      /* const tm = setTimeout(() => {
        clearTimeout(tm);

        this.frameAttivoEmit.emit(this.frameAttivo2);
      }, 100); */

      // this.pulisceCalls();

      // const tm = setTimeout(() => {
      //       clearTimeout(tm);
      //   this.accentratore(true);
      // }, 1500);
    }, 500);
  }

  static pulisceCalls(t) {
    /* if (t.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisce calls. Frame ' + t.NumeroFrame2);
    }

    if (t.lastCallPath) {
      try {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulisce arrays', this.frameAttivo2, this.NumeroFrame);
        t.lastCallAntenne[t.frameAttivo2][t.NumeroFrame] = '';

        t.lastCallAL[t.frameAttivo2][t.NumeroFrame] = '';
        // AdditionalLayerComponent.lastCallAL2 = '';
        t.NPSComponent.lastCallTC[t.frameAttivo2][t.NumeroFrame] = '';
        t.LayersDDComponent.lastCallAntenne[t.frameAttivo2][t.NumeroFrame] = '';
        t.LayersDDComponent.lastCallCluster[t.frameAttivo2][t.NumeroFrame] = '';
        t.areaInfoComponent.lastCallAreaInfo[t.frameAttivo2][t.NumeroFrame] = '';
        t.pathComponent.lastCallPath[t.frameAttivo2][t.NumeroFrame] = '';
        t.pathComponent.lastCallPath2[t.frameAttivo2][t.NumeroFrame] = '';
        t.pathComponent.lastCallPath3[t.frameAttivo2][t.NumeroFrame] = '';
        t.pathComponent.lastCallPath4[t.frameAttivo2][t.NumeroFrame] = '';
        t.pathComponent.lastCallPathSC[t.frameAttivo2][t.NumeroFrame] = '';
        t.pathComponent.lastCallSartPosition[t.frameAttivo2][t.NumeroFrame] = '';
        t.pathComponent.lastCallSchedSel[t.frameAttivo2][t.NumeroFrame] = '';
        t.pointLayerInfo.lastCallPLI[t.frameAttivo2][t.NumeroFrame] = '';
        t.showAdditonalLayers.lastCallSRAL[t.frameAttivo2][t.NumeroFrame] = '';
        t.showAdditonalLayers.lastCallSRAL1[t.frameAttivo2][t.NumeroFrame] = '';
        t.mosaicGrid.lastCallMosaicGrid[t.frameAttivo2][t.NumeroFrame] = '';
        t.mosaicGrid.lastCallLayerGeometry[t.frameAttivo2][t.NumeroFrame] = '';
        t.clusterGrid.lastCallClusterGrid[t.frameAttivo2][t.NumeroFrame] = '';
        t.clusterGrid.lastCallLayerGeometry[t.frameAttivo2][t.NumeroFrame] = '';
        t.pointCellMeasures.lastCallPointCM[t.frameAttivo2][t.NumeroFrame] = '';
        t.eventsComponent.lastCallCrossTab[t.frameAttivo2][t.NumeroFrame] = '';
        t.showRaysAllLayerC.lastCallSRAL[t.frameAttivo2][t.NumeroFrame] = '';
        t.showRaysAllLayerC.lastCallSRAL1[t.frameAttivo2][t.NumeroFrame] = '';
        // EventsComponent.lastCallCrossTabMenoUno[NumeroFrame] = '';
        // EventsComponent.lastCallCrossTabMenoDue[NumeroFrame] = '';
        t.eventsComponent.lastCallEventi[t.frameAttivo2][t.NumeroFrame] = '';
        t.eventsComponent.lastCallES[t.frameAttivo2][t.NumeroFrame] = '';
        t.tcRunComponent.lastCallTC[t.frameAttivo2][t.NumeroFrame] = '';
        t.activities.lastCallActivities[t.frameAttivo2][t.NumeroFrame] = '';
        t.cdrData.lastCallCDData[t.frameAttivo2][t.NumeroFrame] = '';
        t.cdrVoice.lastCallCDVoice[t.frameAttivo2][t.NumeroFrame] = '';
        t.legendaComponent.lastCallLegenda[t.frameAttivo2][t.NumeroFrame] = '';
        t.cellMeasure.lastCallCM[t.frameAttivo2][t.NumeroFrame] = '';
        t.pointComponent.lastCallPI[t.frameAttivo2][t.NumeroFrame] = '';
        // PivotComponent.lastCallPivot[NumeroFrame] = '';
        // PlanimetryComponent.lastCallImmagine[NumeroFrame] = '';

        // this.Utils.lastCallPath[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallPath2[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallPath3[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallPath4[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallCrossTab[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallEventi[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallTrace[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallTrace2[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallCM[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallPointNum[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallPointStr[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallPivot[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallHist[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallPareto[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallES[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallText[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallImmagine[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastCallCD[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.lastRangeCDRVoice[this.frameAttivo2][this.NumeroFrame] = '';
        // this.Utils.chartsHistogram[this.frameAttivo2][this.NumeroFrame] = undefined;

        // this.Utils.measureDaDisegnareHistogram[this.frameAttivo][this.NumeroFrame] = undefined;
        // this.Utils.quantiGraficiHICiSono[this.frameAttivo][this.NumeroFrame] = 0;

        // if (this.Utils.lastCallGrafici[this.frameAttivo] && this.Utils.lastCallGrafici[this.frameAttivo][this.NumeroFrame]) {
        //   this.Utils.lastCallGrafici[this.frameAttivo][this.NumeroFrame] = new Array();
        // }
        t.GestioneGrafici.lastCallGrafici[t.frameAttivo2][t.NumeroFrame] = '';
        t.histogramComponent.lastCallHistogram[t.frameAttivo2][t.NumeroFrame] = '';
        t.histogramComponent.vecchioJson[t.frameAttivo2][t.NumeroFrame] = '';
        t.measuresComponent.lastCallMeasures[t.frameAttivo2][t.NumeroFrame] = ExternalUtilities.creaVettore(255, '');
        t.measuresComponent.lastCallMeasuresSMS[t.frameAttivo2][t.NumeroFrame] = '';
        t.paretoComponent.lastCallPareto[t.frameAttivo2][t.NumeroFrame] = '';
        t.scatterComponent.lastCallScatter[t.frameAttivo2][t.NumeroFrame] = '';
        t.measureDFNComponent.lastCallMeasureDFN[t.frameAttivo2][t.NumeroFrame] = '';

        // if (this.Utils.lastCallHist[this.frameAttivo] && this.Utils.lastCallHist[this.frameAttivo][this.NumeroFrame]) {
        //   this.Utils.lastCallHist[this.frameAttivo][this.NumeroFrame] = new Array();
        // }
        // if (this.Utils.lastCallPareto[this.frameAttivo] && this.Utils.lastCallPareto[this.frameAttivo][this.NumeroFrame]) {
        //   this.Utils.lastCallPareto[this.frameAttivo][this.NumeroFrame] = new Array();
        // }
        // if (this.Utils.lastCallScatter[this.frameAttivo] && this.Utils.lastCallScatter[this.frameAttivo][this.NumeroFrame]) {
        //   this.Utils.lastCallScatter[this.frameAttivo][this.NumeroFrame] = new Array();
        // }
        /* for (let i = 0; i <= this.Utils.quanteMisureGrafici; i++) {
          if (this.Utils.lastCallGrafici[this.frameAttivo] && this.Utils.lastCallGrafici[this.frameAttivo][this.NumeroFrame]) {
            this.Utils.lastCallGrafici[this.frameAttivo][this.NumeroFrame].push('');
          }
          if (this.Utils.lastCallHist[this.frameAttivo] && this.Utils.lastCallHist[this.frameAttivo][this.NumeroFrame]) {
            this.Utils.lastCallHist[this.frameAttivo][this.NumeroFrame].push('');
          }
          if (this.Utils.lastCallPareto[this.frameAttivo] && this.Utils.lastCallPareto[this.frameAttivo][this.NumeroFrame]) {
            this.Utils.lastCallPareto[this.frameAttivo][this.NumeroFrame].push('');
          }
          if (this.Utils.lastCallScatter[this.frameAttivo] && this.Utils.lastCallScatter[this.frameAttivo][this.NumeroFrame]) {
            this.Utils.lastCallScatter[this.frameAttivo][this.NumeroFrame].push('');
          }
        }
      } catch(e) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ERRORE NELLA PULIZIA DEI DATI:', e);
      }
    } */
  }

  spostaFrame(n) {
    this.numeroSottoFrame = n;
    this.menuframes = false;
    this.barraNuovaAperta = false;
    this.framePerSpostamento = null;
    this.viewPerSpostamento = null;
    this.mostraSpostamenti = true;
  }

  selectFrame(e) {
    this.framePerSpostamento = e.id;
  }

  selectView(e) {
    this.viewPerSpostamento = e.id;
  }

  spostaFrameFinale(cosa) {
    if (this.framePerSpostamento === null) {
      // alert('Please select a frame');
      // this.mostraPopup('Please select a frame', false, '')
      ExternalUtilities.visualizzaAlert('Please select a frame');
      return;
    }
    if (this.viewPerSpostamento === null) {
      // alert('Please select a view');
      // this.mostraPopup('Please select a view', false, '')
      ExternalUtilities.visualizzaAlert('Please select a view');
      return;
    }

    const dati = cosa + ';' + this.NumeroFrame + ';' + this.numeroSottoFrame + ';' +
        this.framePerSpostamento + ';' + this.viewPerSpostamento + ';';
    this.spostamentoFrame.emit(dati);
    this.mostraSpostamenti = false;
  }

  refreshSLAEmit(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh sla in frame', this.NumeroFrame);
    this.refreshSLA.emit(e);
  }

  apreLegenda() {
    // if (this.dimensioniFinestraLegenda2 !== 201) {
      this.dimensioniFinestraLegenda2 = 201;
      this.dimensioniFinestraLegenda2Y = 99;
      this.opacitaLegenda = .75;
      this.dimensioniFinestraLegendaEmit.emit(201);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Apertura legenda:', this.opacitaLegenda);
    // }
  }

  chiudeLegenda() {
    // if (this.dimensioniFinestraLegenda2 !== 201) {
      this.dimensioniFinestraLegenda2 = 15;
      this.dimensioniFinestraLegenda2Y = 4;
      this.opacitaLegenda = 0;
      this.dimensioniFinestraLegendaEmit.emit(15);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiusura legenda:', this.opacitaLegenda);
    // }
  }

  impostaFinestraLegendaSempreAperta() {
    this.dimensioniFinestraLegenda2 = 201;
    this.dimensioniFinestraLegenda2Y = 99;
    this.opacitaLegenda = .75;
    this.dimensioniFinestraLegendaEmit.emit(201);
  }

  impostaFinestraLegendaSempreChiusa() {
    this.dimensioniFinestraLegenda2 = 15;
    this.dimensioniFinestraLegenda2Y = 4
    this.opacitaLegenda = .1;
    this.dimensioniFinestraLegendaEmit.emit(15);
  }

  sistemaFinestraLegenda() {
    if (this.dimensioniFinestraLegenda2 === 201) {
      this.opacitaLegenda = .75;
    } else {
      if (this.dimensioniFinestraLegenda2 !== 201) {
        this.opacitaLegenda = .1;
      } else {
        this.opacitaLegenda = .75;
      }
    }
  }

  aperturaMenuNuovo() {
    this.barraNuovaAperta = !this.barraNuovaAperta;
    // logConsole('Aperto/Chiuso menù', this.barraNuovaAperta);
  }

  apreViews() {
    this.tmsChiusuraViews = new Date().getTime();
    this.menuframes = true;
    // logConsole('Aperto menù');
  }

  chiudeViews() {
    // if (!this.menuAperto2) {
      // const d = new Date().getTime();
      // if ((d - this.tmsChiusuraViews) > 1000) {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiude frames', d);
        this.menuframes = false;
        // logConsole('Chiuso menù');
        this.barraTitoloChiusa();
      // }
    // }
  }

  refreshHistDisplayAs(e) {
    this.histDisplayAs2 = e;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.histDisplayAs2);
    this.histDisplayAsEmit.emit(e);
  }

  refreshHistDisplayTutto(e) {
    this.histDisplayTutto2 = e;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.histDisplayAs2);
    this.histDisplayTuttoEmit.emit(e);
  }

  refreshPlanimetry(e) {
    this.showPlanimetry2 = e;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh planimetry', this.showPlanimetry2);
    this.showPlanimetryEmit.emit(e);
    this.planimetry.caricaPiantina(this);
  }

  refreshTipoEvento(e) {
    this.tipoEvento2 = e;
    // logConsole('Tipo evento impostato: ', this.NumeroFrame2, this.tipoEvento2);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh tipo evento', this.tipoEvento2);

    this.tipoEventoEmit.emit(e);
  }

  refreshFixedSeconds(e) {
    this.fixedSeconds2 = e;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh fixed seconds', e);
    this.fixedSecondsEmit.emit(e);
    // this.accentratore(true);
  }

  refreshstyleImpostato(e) {
    this.styleSize2 = e;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh style size', e);
    this.styleSizeEmit.emit(e);
  }

  refreshOpacity(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio opacità in frame', e);
    this.opacity2 = e;
    this.opacityEmit.emit(e);
    // this.accentratore(true);
    this.additional_Layer.disegnaAddLayers(this);
  }

  refreshCellType(e) {
    this.cellType2 = e;
    // logConsole('Impostazione cell type', e);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh cell type', this.NumeroFrame, e);
    this.accentratore(true, 'RefreshCellType');
    this.cellTypeEmit.emit(e);
  }

  refreshAddLayers(e) {
    this.addLayers2 = e;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh add layers', this.NumeroFrame, e);
    // this.accentratore(true);
    this.additional_Layer.disegnaAddLayers(this);
    this.addLayersEmit.emit(e);
  }

  refreshEventiSceltiES(e) {
    // logConsole('EVENTI SCELTI 2:', e);
    this.eventiSceltiES2 = e;
    if (this.eventiSceltiES2 === undefined) {
      this.eventiSceltiES2 = null;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh eventi scelti es', this.NumeroFrame2, this.eventiSceltiES2);
      // }
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventi 2',  this.eventiSceltiES2)
      this.eventiSceltiESDiPassaggio = this.eventiSceltiES2;
    }, 10);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh eventi scelti ES', this.eventiSceltiES2);
    this.eventiSceltiESEmit.emit(e);
  }

  /* refreshColumnsSettings(e) {
    this.columnsSettings2 = e;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh column settings', this.columnsSettings2);
    this.columnsSettingsEmit.emit(e);
  } */

  refreshDoubleGraph(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato doubleGraph ', e);
    // }
    this.doubleGraph2 = e;
    this.doubleGraphEmit.emit(e);

    this.accentratore(true, 'Refresh doublegraph');
  }

  lastE = -1;

  refreshColumnsBars(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Premuto option ', e);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Premuto option. Last ', this.lastE);

    if (this.lastE === e) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Premuto option. Esco');
      return;
    }
    this.lastE = e;
    if (e === 1) {
      this.visualizzaGrigliaExportH[this.NumeroFrame2] = true;
      this.datiGrigliaExportH[this.NumeroFrame2] = undefined;
      // this.datiGrigliaExportH = 'empty grid';
      /* const tm = setTimeout(() => {
          clearTimeout(tm);
        this.accentratore(true, 'REFRESH COLUMNS BARS');
      }, 100); */
    } else {
      // // logConsole('Azzero visua griglia h 6');
      // this.visualizzaGrigliaExportH[this.NumeroFrame2] = false; TOLTO QUI 20/05/2024... Non ridisegnava la griglia
    }
    
    this.giaDisegnataStruttura[this.NumeroFrame2] = false;

    this.columnsBars2 = e;
    this.columnsBarsEmit.emit(e);
  }

  selectEventsMeasure(e) {
    this.eventsMeasure2 = e;
    this.eventsMeasureEmit.emit(e);
  }

  editPiantina() {
    this.bEditPiantina = true;
    // ExternalUtilities.messaggioDiErrore(t, 'ppp');
  }

  chiusuraEditPiantina(e) {
    this.bEditPiantina = false;
  }

  /* cambioCoordinate(e) {
    const c = e.split(';');
    this.lng1 = +c[0];
    this.lat1 = +c[1];
    this.lng2 = +c[2];
    this.lat2 = +c[3];

    this.planimetry.caricaPiantina(this);
    this.planimetry.creaFeature(this);
  }

  clickOnTreeView(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e, e.target.innerText);
    // const rit = e.clientX + ';' + e.clientY + ';' + e.target.innerText + ';' + this.frameAttivo + ';' + this.NumeroFrame;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    const elemento = ExternalUtilities.effettuaReplace(e.srcElement.parentElement.innerText, '"', '');
    if (elemento.indexOf('{') === -1) {
      const rit = e.clientX + ';' + e.clientY + ';' + elemento + ';' + this.frameAttivo + ';' + this.NumeroFrame;
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su tree view', this.NumeroFrame2, rit);
      }
      this.clickPerAperturaPopup.emit(rit);
    }

    return false;
  }

  expandNode(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
  } */

  clickRigaES(e) {
    // EventsComponent.lastCallCrossTab[this.NumeroFrame] = '';
    // EventsComponent.lastCallCrossTabMenoUno[this.NumeroFrame] = '';

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su riga summary', e);
    this.checkPartitionLabel(e);
    const ee = { dati: e, selezionato: e, deselezionato: e };
    this.gestisceClickSummary(ee);
  }

  clickRigaNPS(e) {
    this.checkPartitionLabel(e);
  }

  associaEventiTcRun() {
    // this.rigaSelezionataTcRun.TCK_EVENT_LIST = this.Utils.listaEventiSE;
    this.rigaModificataTicket.TCK_EVENT_LIST = this.eventiSceltiES2;

    ExternalUtilities.visualizzaInfo('Info', 'Events associated: ' + this.eventiSceltiES2.length, false);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi da associare: ', this.eventiSceltiES2);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ticket: ', this.rigaSelezionataTcRun);
  }

  /* visualizzaEventiTcRunVECCHIO() {
    // this.Utils.listaEventiSE = this.rigaSelezionataTcRun.TCK_EVENT_LIST;
    alert('1');
    let eventi = this.rigaModificataTicket.TCK_EVENT_LIST;
    if (eventi && eventi !== null) {
      while (eventi.indexOf('*V*') > -1) {
        eventi = eventi.replace('*V*', '"');
      }
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista Eventi', eventi, typeof(eventi));
      }
      this.Utils.listaEventiSE = eventi; //  JSON.parse(eventi);
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi associati: ', this.Utils.listaEventiSE);
      }
      this.passaggioListaEventiSE.emit(this.Utils.listaEventiSE);
    }
  } */

  visualizzaEventiTcRun() {
    // this.Utils.listaEventiSE = this.rigaSelezionataTcRun.TCK_EVENT_LIST;
    let eventi = this.rigaModificataTicket.TCK_EVENT_LIST;

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Eventi da visualizzare: ', eventi);

    if (eventi && eventi !== null) {
      while (eventi.indexOf('*V*') > -1) {
        eventi = eventi.replace('*V*', '"');
      }
      if (typeof(eventi) === 'string') {
        while (eventi.substring(0, 1) === '"' || eventi.substring(0, 1) === ' ') {
          eventi = eventi.substring(1, eventi.length);
        }
        while (eventi.substring(eventi.length - 1, eventi.length) === '"' || eventi.substring(eventi.length - 1, eventi.length) === ' ') {
          eventi = eventi.substring(0, eventi.length - 1);
        }
        // logConsole('Eventi da visualizzare 1: ', eventi, typeof(eventi));

        eventi = JSON.parse(eventi);
      }
      const tm = setTimeout(() => {
        clearTimeout(tm);
        
        // logConsole('Eventi da visualizzare 2: ', eventi);
        this.eventiSceltiES2 = eventi;
        // if (this.debug2 === true) {
          // logConsole('Eventi associati: ', this.Utils.listaEventiSE);
        // }
      
        ExternalUtilities.visualizzaInfo('Info', 'Events showed: ' + this.eventiSceltiES2.length, false);
  
        this.passaggioListaEventiSE.emit(this.eventiSceltiES2); // new Date().toString());
      }, 100);
    }
  }

  indiceTC;
  tcRunIdSelezionato;
  // incremento = false;
  ultimoTcRunClickato = '';
  actIdTC;
  pulisceTcRun;
  refreshInfoFile;
  refreshTcRunInfoFile;
  ultimoTcRunCodeClickato;

  clickRigaTC(ee) {
    let e;
    
    if (ee.START_TIME_STAMP_SELECTED) {
      e = [ee];
    } else {
      e = ee;
    }
    
    this.actIdTC = '[ACT ID] ' + e[0].ACT_ID;
    
    this.refreshInfoFile = new Date().toString();
    this.ricaricaTcRun = e[0].TMS;

    // logConsole('Click su un tcrun', this.ultimoTcRunClickato, e[0]);

    // let riclickato = false;
    this.ultimoTcRunCodeClickato = e[0].TC_RUN_CODE;
    if (this.ultimoTcRunClickato === e[0].TC_RUN_ID) {
      // riclickato = true;
      // alert('Uguale');
      logConsole('Esco e aggiorno tms per aver fatto click su un tcrun uguale all\'ultimo già clickato');

      let inizio = e[0].START_TIME_STAMP_SELECTED;
      let fine = e[0].END_TIME_STAMP_SELECTED;

      const inizioS = inizio;
      inizio = new Date(inizio).getTime();
      const fineS = fine;

      let min = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS');
      let max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');

      let m = new Date(max).getTime();
      max = this.datePipe.transform(m , 'yyyy-MM-dd HH:mm:ss.SSS');

      logConsole('Tms impostati: ', min, max);
      
      this.cambioStartTms.emit(min + ';clickRigaTC');
      this.cambioEndTms.emit(max + ';clickRigaTC');

      return;
    }
    this.ultimoTcRunClickato = e[0].TC_RUN_ID;
    
    this.tcRunPerAI = e[0].TC_RUN_ID;
    this.tcRunCode = e[0].TC_RUN_CODE;
    this.tcRunFailure = e[0].FAILUREREASON;

    this.checkPartitionLabel(e);
    this.tcRunSelected = true;
    this.rigaSelezionataTcRun = e[0];

    if (e && e[0] && e[0].ROW_ID)  {
      this.tcRunIdSelezionato = +(e[0].TC_RUN_ID.replace('"', '').replace('"', ''));
      this.indiceTC = [e[0].ROW_ID];
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su tc run', e);
      if (e && e[0] && e[0].START_TIME_STAMP_SELECTED) {
        const valoreRicerca = ExternalUtilities.effettuaReplace(e[0].ACT_SET_NAME, '\'', '');
        const tm = e[0].TMS;

        const params = {
          v_agn_code: valoreRicerca,
          v_tms: tm
        };
  
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiamata tms to gps per click su tcrun', this.NumeroFrame2, params);

        this.apiService.chiamataPost(this.Utils, 'antsgeo_tms_to_gps1', params)
        // .map(response => response)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data2: any) => {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, data, this.NumeroFrame);
          if (data2 !== null) {
            ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);
  
            // const coordinate = this.map1[this.NumeroFrame2].getEventCoordinate(event);
            if (data2 && data2.lat && data2.lng && data2.lat !== '' && data2.lng !== '' && +data2.lng !== 0 && +data2.lat !== 0) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Data per click su tcrun 1', this.NumeroFrame2, data2);
  
              // this.impostaCenterPosition.emit(data2.lng + ' ' + data2.lat);
              // this.impostaTimeCursorPosition.emit(data2.lng + ' ' + data2.lat);
  
              // this.Utils.posDaImpostare = 'POINT(' + data2.lng + ' ' + data2.lat + ')';
              // this.posDaImpostareEmit.emit('POINT(' + data2.lng + ' ' + data2.lat + ')');

              // this.impostaCenterPosition.emit('POINT(' + data2.lng + ' ' + data2.lat + ')');

              this.centroImpostato = [ data2.lng, data2.lat ];
              if (this.centroImpostato[0] < 90) {
                this.centroImpostato = transform(this.centroImpostato, 'EPSG:4326', 'EPSG:3857');
              }
              // logConsole('clickRigaTC', this.centroImpostato);
              // logConsole('Centro impostato emit in click riga tc', this.NumeroFrame2, this.centroImpostato, '', this.zoomImpostatoNelFrame);
              this.centroImpostatoEmit.emit({
                daChi: this.NumeroFrame2, 
                funzione: 'ClickRigaTC', 
                centro: this.centroImpostato, 
                zoom: this.zoomImpostatoNelFrame,
                tipoMappa: this.overviewZoom2
              });

              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Get Coord Data per click su tcrun 2', this.NumeroFrame2, 'POINT(' + data2.lng + ' ' + data2.lat + ')');
            }

              let tms = e[0].START_TIME_STAMP_SELECTED;
              if (tms && tms !== null) {
                while(tms.indexOf('.') > -1)
                {
                  tms = tms.replace('.', ':');
                }
              }

              let dstart = e[0].START_TIME_STAMP_SELECTED;
              if (dstart && dstart !== null) {
                while(dstart.indexOf('.') > -1) {
                  dstart = dstart.replace('.', ':');
                }
                const i = new Date(dstart + ' UTC+00').getTime();
                this.Utils.tmsInizio = this.Utils.datePipe.transform(i, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
              }

              let dend = e[0].END_TIME_STAMP_SELECTED;
              if (dend && dend !== null) {
                while(dend.indexOf('.') > -1) {
                  dend = dend.replace('.', ':');
                }
                let f = new Date(dend + ' UTC+00').getTime();

                /* if (this.incremento === true) {
                  f += 1000; // this.datePipe.transform(fine2 , 'yyyy-MM-dd HH:mm:ss.SSS');
                } */

                this.Utils.tmsFine = this.Utils.datePipe.transform(f, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
              }
        
              this.Utils.tmsDelta = e[0].START_TIME_STAMP;

              this.Utils.rangeSelezionatoStampa = this.Utils.tmsInizio + '<br />' + this.Utils.tmsFine;

              /* if (dstart.indexOf('.') > -1) {
                dstart = dstart.substring(0, dstart.indexOf('.'));
              }
              if (dend.indexOf('.') > -1) {
                dend = dend.substring(0, dstart.indexOf('.'));
              }
              this.timeRangeStart.emit(dstart); // this.datePipe.transform(dstart, 'yyyy-MM-dd HH:mm:ss.SSS'));
              this.timeRangeStop.emit(dend); // this.datePipe.transform(dend, 'yyyy-MM-dd HH:mm:ss.SSS'));
              */

              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tms start end', dstart, dend);

              let t = new Date(tms + ' UTC+00').getTime();
              /* if (this.incremento === true) {
                t += 1000;
              } */
              tms = this.Utils.datePipe.transform(t, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

              // // logConsole('111TMS1 1', tms, this.incremento);
              // // logConsole('111TMS1 2', tms);

              this.cambioTmsSelezionato.emit(tms + ';clickRigaTC');

              let agn = e[0].AGN_CODE;
              agn = '[AGN] ' + agn;
              ExternalUtilities.stringaAGNoACT = agn;
              this.agnPerTcInfo = agn;
              this.impostaAGNoACT.emit(this.Activity2 + '§' + JSON.stringify(ExternalUtilities.stringaAGNoACT));

              // FUNZIONE DI SINCRONIZZAZIONE
              let inizio = e[0].START_TIME_STAMP_SELECTED;
              let fine = e[0].END_TIME_STAMP_SELECTED;

              // // logConsole('TMS2 1', inizio, fine);
              /* if (this.incremento === 0) {
                this.incremento = 1;
                // let inizio2 = new Date(inizio).getTime();
                let fine2 = new Date(fine).getTime();
                // inizio2 += 1;
                fine2 += 1000;
                // inizio = this.datePipe.transform(inizio2 , 'yyyy-MM-dd HH:mm:ss.SSS');
                fine = this.datePipe.transform(fine2 , 'yyyy-MM-dd HH:mm:ss.SSS');
              } else {
                this.incremento = 0;
              } */
              // // logConsole('TMS2 2', inizio, fine);

              const inizioS = inizio;
              inizio = new Date(inizio).getTime();
              const fineS = fine;

              let min = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS');
              let max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');

              let m = new Date(max).getTime();
              /* if (this.incremento === true) {
                m += 1000;
              } */
              max = this.datePipe.transform(m , 'yyyy-MM-dd HH:mm:ss.SSS');

              this.cambioStartTms.emit(min + ';clickRigaTC');
              this.cambioEndTms.emit(max + ';clickRigaTC');

              // // logConsole('CLICK TCRUN Incremento: ' + this.incremento, tms, this.Utils.tmsFine);

              // this.incremento = !this.incremento;

              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, min, max);

              /* if (riclickato) {
                const tm = setTimeout(() => {
                  clearTimeout(tm);
                  // logConsole('CLICK TCRUN Riclickato');
                  this.refreshPerTcRunClickUguale.emit(new Date().toString());
                }, 1000);        
              } */    

              this.ricaricaTcRun = undefined;
              const tm = setTimeout(() => {
                clearTimeout(tm);

                // logConsole('Prende dati tcrun. Da Fuori 2', tms);
                this.ricaricaTcRun = tms;
              }, 100);

              if (this.timerSynch2 === false) {
                const nomeTabella = 'operator_obj_sync_my__upd';
                const params = {
                  cntx_id: this.sessionID2,
                  v_ds_name: e[0].ACT_SET_NAME,
                  v_agn_code: e[0].AGN_CODE,
                  v_ds_tms_min: min,
                  v_ds_tms_max: max,
                  v_dsg_tms_min: inizioS,
                  v_dsg_tms_max: fineS,
                  v_tms_curr: inizioS
                };

                this.apiService.chiamataPost(this.Utils, '' + nomeTabella, params)
                // .map(response => response)
                .pipe(takeUntil(this.destroy$))
                .subscribe((data2: any) => {
                  // const data2 = JSON.parse(data);
                  ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);
                }, error => {
                  // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
                  console.error('POST ERROR Obj Sync My Upd: ', error, error.message);
                });
              }
            // }
          }
        }, error => {
          // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
          console.error('POST ERROR Tms to Gps: ', error, error.message);
        });
      }
    }
  }

  clickRigaCM(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click riga CM', e, e[0].LAT, e[0].LNG);
    // }
    this.checkPartitionLabel(e[0]);
    this.cellaSelezionataEmit.emit(e[0]);
    if (e && e[0] && e[0].LNG && e[0].LAT && e[0].LNG !== null && e[0].LAT !== null) {
      const coord = [ +e[0].LNG, +e[0].LAT];
      this.coordinateCambiateConClick.emit(transform(coord, 'EPSG:4326', 'EPSG:3857'));
      ExternalUtilities.spostaCentroAttuale = [true, true, true, true, true, true, true, true, true, true, true];
    }
  }

  imsiSelezionato = undefined;
  uniqueID = undefined;
  eseguitoClickSuRigaM2 = false;

  clickRigaM2(e) {
    this.eseguitoClickSuRigaM2 = true;

    if (e[0]) { e = e[0]; }
    logConsole('Click riga M2', e);
    
    this.testoJsonMF = "";
    this.totaleRigheJsonMF = 0;
    this.impostaSelezioneM2 = [e.ROW_ID];
    this.imsiSelezionato = e.IMSI;
    this.uniqueID = e.UNIQUEID;

    this.filterSelectedMQ = '[' + JSON.stringify(e.FILTER) + ']';
    // logConsole('Click riga M2', this.filterSelectedMQ);
    this.filterMQEmit.emit(this.filterSelectedMQ);

    this.actIdTC = '[ACT ID] ' + e.ACT_ID;
    ExternalUtilities.stringaAGNoACT = this.actIdTC;

    let min = undefined;
    let max = undefined;

    if (e && e.START_TIME_STAMP_SELECTED) {
      let inizio = undefined;
      inizio = e.START_TIME_STAMP_SELECTED;
      const inizioS = inizio;
      inizio = new Date(inizio).getTime();
      min = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS');
    }
    if (e && e.END_TIME_STAMP_SELECTED) {
      let fine = undefined;
      fine = e.END_TIME_STAMP_SELECTED;
      max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');

      let m = new Date(max).getTime();
      max = this.datePipe.transform(m , 'yyyy-MM-dd HH:mm:ss.SSS');
    }

    // const fineS = fine;
    logConsole('Tms impostati: ', min, max);
    
    if (min && max) {
      const pass = { min: min, max: max };
      this.impostaRangesContemporaneamente.emit(pass);
      // this.cambioStartTms.emit(min + ';clickRigaM2');
      // this.cambioEndTms.emit(max + ';clickRigaM2');

      // this.mistral_flow.caricaMF(this, '');
      const t = setTimeout(() => {
        clearTimeout(t);
        
        this.imsiEmit.emit(this.imsiSelezionato);
        this.uniqueIDEmit.emit(this.uniqueID);        
      }, 500);
    } else {
      logConsole('Campi tms non valorizzati correttamente', min, max);
    }

    const m = setTimeout(() => {
      this.eseguitoClickSuRigaM2 = false;
      clearTimeout(m);
    }, 500);
  }

  mfSelezionato = undefined;
  impostaPaginaMF2;

  clickRigaMF(e) {
    logConsole('Click riga MF: ', e, 'Pagina:', this.impostaPaginaMF);
    this.bloccaCaricamentoJsonMF = new Date().toString();
    this.testoJsonMF = "";
    this.totaleRigheJsonMF = 0;
    this.mfSelezionato = e;
    if (this.mfSelezionato[0]) {
      this.mfSelezionato = this.mfSelezionato[0];
    }
    this.impostaSelezioneMF = [e.ROW_ID];
    this.prendeJsonMF(e, 'Click Riga MF');
  }

  refreshActivities(e, r) {
    if (r === true) {
      this.datiActivities = undefined;
    }
    this.lastCallActivities[this.NumeroFrame2] = '';
    this.activities.caricaActivities(this);
  }

  clickRigaLA(ee) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK su activities', ee, this.Activity2);
      /* const tm = setTimeout(() => {
          clearTimeout(tm);
        this.impostaSelezioneLA = [e[0].ROW_ID];
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione impostata', this.impostaSelezioneLA);
      }, 1000); */
    // }
    let e = ee;
    if (!e[0]) { e = [ee]; }
    this.checkPartitionLabel(e);
    if (e) {
      // if (e[0]) {
        this.righeSelezionatePerActSet = e;
      // } else {
      //   this.righeSelezionatePerActSet = e;
      // }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Riga activity selezionata', this.righeSelezionatePerActSet);

      let valoreRicerca = '[ACT] ' + e[0].NAME;
      if (valoreRicerca.indexOf('***') > -1) {
        valoreRicerca = valoreRicerca.substring(0, valoreRicerca.indexOf('***'));
      }
      this.Utils.nomeActivitySelezionata = valoreRicerca;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Nome activity selezionata', this.Utils.nomeActivitySelezionata);

      this.esegueClickSuActivities(e[0], true);
      return;

      const sInizio = this.timeRangeDSFStart2;
      const sFine = this.timeRangeDSFStop2;
      // const geoFilter = ExternalUtilities.ritornaGeoFilter(this, this.geoFilter2);

      this.chiSonoClickA[this.NumeroFrame2] = 'F' + this.NumeroFrame2 + ';P' + this.frameAttivo2 + ';' + new Date().toString();
      const params = {
        cntx_id: this.sessionID2,
        v_caller_tag: this.chiSonoClickA[this.NumeroFrame2],
        v_act_set_name_list: valoreRicerca,
        // v_event_type_list: eventi,
        v_tms_min: sInizio,
        v_tms_max: sFine,
        // v_filter_group_by: t.filterGroupByCDD,
        v_bbox: '(ALL)'
      };

      this.apiService.chiamataPost(this.Utils, 'geo_act__grid2', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

        if (!this.controllaRitornoChiamata(this, data2, 'Act Grid 2')) {
          this.caricamentoActivitiesInCorso[this.NumeroFrame2] = false;
          return;
        }

        if (data2.v_req_tms) {
          const ritorno = new Date(data2.v_req_tms);
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno: ', ritorno);
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Vecchia: ', t.timeStampChiamataTCRUN);
          if (this.timeStampChiamataActivities2 && ritorno.getTime() < this.timeStampChiamataActivities2.getTime()) {
            // if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Activities 2: esco per query vecchia', ritorno, this.timeStampChiamataActivities2);
            // }

            this.caricamentoActivitiesInCorso[this.NumeroFrame2] = false;
            return;
          } else {
            this.timeStampChiamataActivities2 = ritorno;
          }
        }

        let quale = data2.DataTable[0];
        this.esegueClickSuActivities(quale, true);
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        console.error('POST ERROR Act Grid 2: ', error, error.message);
      });
    }
  }

  ultimaVoltaTMSLA = -1;

  esegueClickSuActivities(quale, immediato) {
    if (immediato === false) {
      const ora = new Date().getTime();
      if (ora - this.ultimaVoltaTMSLA < 1500) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su activities: Esco per troppo veloce', this.NumeroFrame2);

        return;
      }
      this.ultimaVoltaTMSLA = ora;
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno click ACTIVITIES', quale);

      this.selezioneActivitiesPerRoot.emit(quale.ROW_ID);

      ExternalUtilities.eseguitoBounds = false;

      this.righeSelezionatePerActSet = quale;

      ExternalUtilities.stringaAGNoACT = quale.AGN;
      this.agnPerTcInfo = ExternalUtilities.stringaAGNoACT;

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK su activities. AGN: ', ExternalUtilities.stringaAGNoACT);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK su activities. Riga: ', quale);

      if (quale.BBOX) {
        const q = quale.BBOX.split(',');
        const qq = [+q[0], +q[1], +q[2], +q[3]];
        /* for (let i = 0; i <= environment.quantiFrames; i++) {
          ExternalUtilities.bboxMaschera[i] = qq;  
        } */
        // logConsole('Imposto bbox overview da click activities', this.NumeroFrame2, 'ClickActivities', qq);
        this.bboxImpostatoOverView.emit(qq);
        this.bboxImpostatoZoom.emit(qq);

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto BBOX su click activities', qq);
      }

      // ExternalUtilities.stringaAGNoACT = e[0].CODE;
      if (quale.START_TMS !== null && quale.START_TMS !== undefined) {
        this.Utils.tmsDelta = quale.START_TMS;

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tmsInizio 2', quale.START_TMS);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tmsFine 2', quale.END_TMS);

        const diff = (new Date(quale.END_TMS + ' UTC+00').getTime() - new Date(quale.START_TMS + ' UTC+00').getTime());
        const i = new Date(quale.START_TMS + ' UTC+00').getTime();
        this.Utils.tmsInizio = this.Utils.datePipe.transform(i, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        const f = new Date(quale.END_TMS + ' UTC+00').getTime();
        this.Utils.tmsFine = this.Utils.datePipe.transform(f, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        this.Utils.rangeSelezionatoStampa = this.Utils.tmsInizio + '<br />' + this.Utils.tmsFine;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.rangeSelezionatoStampa);

        this.Utils.tmsInizioCDR = this.Utils.tmsInizio;
        this.Utils.tmsFineCDR = this.Utils.tmsFine;

        this.Utils.clickSuCV = true;
        this.timeRangeCambiato.emit(Math.round(diff / 1000) + ';' + this.Utils.tmsInizio + ';CLICKACTIVITIES');

        let tm = quale.START_TMS.toString();
        if (tm.indexOf('.') > - 1) {
          tm = tm.substring(0, tm.indexOf('.'));
        }

        const d1 = new Date(tm + ' UTC+00').getTime();
        const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

        this.cambioTmsSelezionato.emit(t1 + ';EsegueClickSuActivities');

        let inizio = quale.START_TMS;
        const inizioS = inizio;
        inizio = new Date(inizio).getTime();

        let fine = quale.END_TMS;
        const fineS = fine;

        const min = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS');
        const max = this.datePipe.transform(fine , 'yyyy-MM-dd HH:mm:ss.SSS');

        this.cambioStartTms.emit(min + ';clickRigaLA');
        this.cambioEndTms.emit(max + ';clickRigaLA');

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK su activities. GEO Filter', this.geoFilter2);

        // if (+this.geoFilter2 === 0) {
          const quadrato = quale.BBOX;
          // logConsole('Imposto bbox di click activities', this.NumeroFrame2, 'ClickActivities', quadrato);
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK su activities. Quadrato da impostare', quadrato);

          this.settaQuadratoMappa.emit(quadrato);
        // }

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK su activities. Imposto geoFilterClick', this.geoFilter2);

        this.geoFilterClickEmit.emit(this.geoFilter2);
      }
    }, 100);
  }

  /*
  clickRigaLA2(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click riga Activities data', e);
    if (!e[0] || e[0] === null) {
      return;
    }
    const actId = e[0].ACT_ID;
    const ee = e[0].TMS_DIAL;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Set Delta', ee);
    // this.Utils.actIdCDR = actId;
    this.Utils.posDaImpostare = e[0].CENTER;
    this.Utils.tmsDelta = ee;

    const diff = (new Date(e[0].TIMERANGE_MAX + ' UTC+00').getTime() - new Date(e[0].TIMERANGE_MIN + ' UTC+00').getTime());
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, diff);
    this.Utils.rangeDiSecondiPerMille = +diff;
    const i = new Date(e[0].TIMERANGE_MIN + ' UTC+00').getTime();
    this.Utils.tmsInizio = this.Utils.datePipe.transform(i, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    const f = new Date(e[0].TIMERANGE_MAX + ' UTC+00').getTime();
    this.Utils.tmsFine = this.Utils.datePipe.transform(f, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    this.Utils.rangeSelezionatoStampa = this.Utils.tmsInizio + '<br />' + this.Utils.tmsFine;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.rangeSelezionatoStampa);

    this.Utils.clickSuCV = true;
    this.timeRangeCambiato.emit(Math.round(diff / 1000) + ';' + this.Utils.tmsInizio);

    let tm = e[0].TIMERANGE_MIN.toString();
    if (tm.indexOf('.') > - 1) {
      tm = tm.substring(0, tm.indexOf('.'));
    }

    this.impostaActID(e[0]);

    const d1 = new Date(tm + ' UTC+00').getTime();
    const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t1, d1, tm, riga.tms);
    // this.Utils.tmsSelezionato = t1;

    // const ttt = ((new Date(riga.tms).getTime()) / 1000).toFixed().toString() + '000';
    this.Utils.ActivitySetDelPuntoClickato = this.ActivityName2;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PPP:', this.Utils.ActivitySetDelPuntoClickato);
    if (this.Utils.ActivitySetDelPuntoClickato === '<All>') {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.listaActivityImpostate[1].NAME;
    } else {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.Utils.ActivitySetDelPuntoClickato;
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click tms su eventi:', riga.tms, ttt);
    // if (this.timeFilter2 !== 2 && this.timeFilter2 !== 'Time Range') {
    // AppComponent.CambioTmsSelezionato(t1);
    this.cambioTmsSelezionato.emit(t1);

    // this.impostaAGNoACT.emit(actId);

    // }
    // this.eventsComponent.prendeDettaglioEvents(this, riga.event_row_id, riga.act_id, riga.file_hist_id);
    // this.idSelezionatoAE = riga.ROW_ID;

    ExternalUtilities.aggiornaTmsStringa(tm, this.Utils);
  }
  */

  clickRigaCD(e) {
    this.checkPartitionLabel(e);
    const ee = {
      dati: e,
      selezionato: e,
      deselezionato: e
    }
    this.riempieArraySelezioneCD(ee);
  }

  clickRigaCD2(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click riga cdr data', e);
    if (!e[0] || e[0] === null) {
      return;
    }
    this.checkPartitionLabel(e[0]);
    const actId = e[0].ACT_ID;
    const ee = e[0].TMS_DIAL;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Set Delta', ee);
    // this.Utils.actIdCDR = actId;
    // this.Utils.posDaImpostare = e[0].CENTER;
    // this.posDaImpostareEmit.emit(e[0].CENTER);
    this.Utils.tmsDelta = ee;

    this.impostaTimeCursorPosition.emit(e[0].CENTER);
    this.impostaCenterPosition.emit(e[0].CENTER);

    const diff = (new Date(e[0].TIMERANGE_MAX + ' UTC+00').getTime() - new Date(e[0].TIMERANGE_MIN + ' UTC+00').getTime());
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, diff);
    this.Utils.rangeDiSecondiPerMille = +diff;
    const i = new Date(e[0].TIMERANGE_MIN + ' UTC+00').getTime();
    this.Utils.tmsInizio = this.Utils.datePipe.transform(i, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    const f = new Date(e[0].TIMERANGE_MAX + ' UTC+00').getTime();
    this.Utils.tmsFine = this.Utils.datePipe.transform(f, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    this.Utils.rangeSelezionatoStampa = this.Utils.tmsInizio + '<br />' + this.Utils.tmsFine;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.rangeSelezionatoStampa);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tmsInizio 3', e[0].TIMERANGE_MIN);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tmsFine 3', e[0].TIMERANGE_MAX);

    this.Utils.clickSuCV = true;
    this.timeRangeCambiato.emit(Math.round(diff / 1000) + ';' + this.Utils.tmsInizio + ';CLICKRIGACD2');

    let tm = e[0].TIMERANGE_MIN.toString();
    if (tm.indexOf('.') > - 1) {
      tm = tm.substring(0, tm.indexOf('.'));
    }

    this.impostaActID(e[0]);

    const d1 = new Date(tm + ' UTC+00').getTime();
    const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t1, d1, tm, riga.tms);
    // this.Utils.tmsSelezionato = t1;

    // const ttt = ((new Date(riga.tms).getTime()) / 1000).toFixed().toString() + '000';
    // logConsole('Punto clickato 4', this.ActivityName2);
    this.Utils.ActivitySetDelPuntoClickato = this.ActivityName2;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PPP:', this.Utils.ActivitySetDelPuntoClickato);
    if (this.Utils.ActivitySetDelPuntoClickato === '<All>') {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.listaActivityImpostate[1].NAME;
    } else {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.Utils.ActivitySetDelPuntoClickato;
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click tms su eventi:', riga.tms, ttt);
    // if (this.timeFilter2 !== 2 && this.timeFilter2 !== 'Time Range') {
    // AppComponent.CambioTmsSelezionato(t1);
    this.cambioTmsSelezionato.emit(t1 + ';clickRigaCD2');

    // this.impostaAGNoACT.emit(actId);

    // }
    // this.eventsComponent.prendeDettaglioEvents(this, riga.event_row_id, riga.act_id, riga.file_hist_id);
    // this.idSelezionatoAE = riga.ROW_ID;

    ExternalUtilities.aggiornaTmsStringa(tm, this.Utils);
  }

  clickRigaCS(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e)
    this.checkPartitionLabel(e);
    const ee = {
      dati: e,
      selezionato: e,
      deselezionato: e
    }
    this.riempieArraySelezioneCS(ee);
  }

  clickRigaCV(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click riga CV', this.NumeroFrame2, e);
    // }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.checkPartitionLabel(e[0]);
    const ee = e[0].TMS_DIAL;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Set Delta', ee);
    this.Utils.tmsDelta = ee;
    // this.Utils.posDaImpostare = e[0].CENTER;
    // this.posDaImpostareEmit.emit(e[0].CENTER);

    this.impostaTimeCursorPosition.emit(e[0].CENTER);
    this.impostaCenterPosition.emit(e[0].CENTER);

    const diff = (new Date(e[0].TIMERANGE_MAX + ' UTC+00').getTime() - new Date(e[0].TIMERANGE_MIN + ' UTC+00').getTime());
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, diff);
    this.Utils.rangeDiSecondiPerMille = +diff;
    const i = new Date(e[0].TIMERANGE_MIN + ' UTC+00').getTime();
    this.Utils.tmsInizio = this.Utils.datePipe.transform(i, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    const f = new Date(e[0].TIMERANGE_MAX + ' UTC+00').getTime();
    this.Utils.tmsFine = this.Utils.datePipe.transform(f, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
    this.Utils.rangeSelezionatoStampa = this.Utils.tmsInizio + '<br />' + this.Utils.tmsFine;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.rangeSelezionatoStampa);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tmsInizio 4', e[0].TIMERANGE_MIN);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto tmsFine 4', e[0].TIMERANGE_MAX);

    this.Utils.clickSuCV = true;
    this.timeRangeCambiato.emit(Math.round(diff / 1000) + ';' + this.Utils.tmsInizio + ';CLICKRIGACV');

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    let tm = e[0].TIMERANGE_MIN.toString();
    if (tm.indexOf('.') > - 1) {
      tm = tm.substring(0, tm.indexOf('.'));
    }

    this.impostaActID(e[0]);

    const d1 = new Date(tm + ' UTC+00').getTime();
    const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t1, d1, tm, riga.tms);
    // this.Utils.tmsSelezionato = t1;

    // const ttt = ((new Date(riga.tms).getTime()) / 1000).toFixed().toString() + '000';
    // logConsole('Punto clickato 5', this.ActivityName2);
    this.Utils.ActivitySetDelPuntoClickato = this.ActivityName2;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PPP:', this.Utils.ActivitySetDelPuntoClickato);
    if (this.Utils.ActivitySetDelPuntoClickato === '<All>') {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.listaActivityImpostate[1].NAME;
    } else {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.Utils.ActivitySetDelPuntoClickato;
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click tms su eventi:', riga.tms, ttt);
    // if (this.timeFilter2 !== 2 && this.timeFilter2 !== 'Time Range') {
    // AppComponent.CambioTmsSelezionato(t1);
    this.cambioTmsSelezionato.emit(t1 + ';clickRigaCV');

    // }
    // this.eventsComponent.prendeDettaglioEvents(this, riga.event_row_id, riga.act_id, riga.file_hist_id);
    // this.idSelezionatoAE = riga.ROW_ID;

    ExternalUtilities.aggiornaTmsStringa(tm, this.Utils);
  }

  impostaActID(e) {
    ExternalUtilities.stringaAGNoACT = e.AGN_CODE;
    this.agnPerTcInfo = ExternalUtilities.stringaAGNoACT;
    this.impostaAGNoACT.emit(this.Activity2 + '§' + JSON.stringify(ExternalUtilities.stringaAGNoACT));

    /* Imposta act_id
    let act_id = null;

    if (e && e.act_id) {
      act_id = e.act_id;
    } else {
      if (e && e[0].ACT_ID) {
        act_id = e[0].ACT_ID;
      } else {
        // ExternalUtilities.messaggioDiErrore(t, '...Nessun act id nella struttura...\n\nNon deve mai accadere !!!');
        alert('No act id selected');
        return;
      }
    }

    let quale = null;
    if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio actId:', e, this.Activity2, this.act_set, this.ActivityName2, ExternalUtilities.stringaAGNoACT);
    }
    if (this.Activity2 > 0) {
      const lista = this.Utils.sceltaActivityDaSet[this.Activity2];
      lista.forEach(element => {
        if (quale === null && +act_id === +element.ID) {
          quale = element;
        }
      });
      if (quale !== null) {
        ExternalUtilities.stringaAGNoACT = quale.NAME;
        this.impostaAGNoACT.emit(this.Activity2 + 'Â§' + JSON.stringify(ExternalUtilities.stringaAGNoACT));
      }
    } else {
      let qualeActSet = -1;
      let conta = 0;

      this.Utils.sceltaActivityDaSet.forEach(lista => {
        if (quale === null && lista !== undefined) {
          lista.forEach(element => {
            if (quale === null && +act_id === +element.ID) {
              qualeActSet = conta;
              quale = element;
            }
          });
        }
        conta++;
      });
      if (quale !== null) {
        ExternalUtilities.stringaAGNoACT[qualeActSet] = quale.NAME;
        this.impostaAGNoACT.emit(qualeActSet + 'Â§' + JSON.stringify(ExternalUtilities.stringaAGNoACT[qualeActSet]));
      }
    } */

    this.Utils.clickDaMappa = true;
    this.Utils.act_setDelPuntoClickatoSullaMappa = this.act_set;

    // logConsole('Punto clickato 6', this.ActivityName2);
    this.Utils.ActivitySetDelPuntoClickato = this.ActivityName2;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PPP:', this.Utils.ActivitySetDelPuntoClickato);
    if (this.Utils.ActivitySetDelPuntoClickato === '<All>') {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.listaActivityImpostate[1].NAME;
    } else {
      this.Utils.ActivitySetDelPuntoClickatoPerScritta = this.Utils.ActivitySetDelPuntoClickato;
    }

    this.Utils.activitySceltaStampa = ExternalUtilities.stringaAGNoACT;

    this.Utils.mappaClickata = this.NumeroFrame;
    /* Imposta act_id */
  }

  elaboraPuntoClickato(hh) {
    const ora = new Date().getTime();
    if (ora - this.vecchioElaboraPuntoTMS < 1000) {
      return;
    }
    this.vecchioElaboraPuntoTMS = ora;

    if (this.overviewZoom2 === false) {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su mappa zoom');
      // Utilizzo questo flag per non far spostare la mappa in caso di click su mappa zoom.
      // lo spostamento invece deve rimanere in caso di click su altre view
      this.Utils.clickSuMappaZoom[this.NumeroFrame2] = true;
    } else {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su mappa NON zoom');
    }
    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK SU MAPPA. Elaboro punto clickato', hh);
    // }
    if (hh && hh !== '') {
      // const h = JSON.parse(hh);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, hh);
      // const h = JSON.parse(html);
      // if (h) {
      this.Utils.clickDaMappa = true;
      this.Utils.act_setDelPuntoClickatoSullaMappa = this.act_set;
      this.Utils.mappaClickata = this.NumeroFrame;

      let tms = hh.TMS;

      /* const tAttuale = new Date(tms.replace('T', ' ') + ' UTC+00').getTime();
      const tMin =  new Date(this.Utils.tmsInizio.replace('T', ' ') + ' UTC+00').getTime();
      const tMax =  new Date(this.Utils.tmsFine.replace('T', ' ') + ' UTC+00').getTime();

      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK SU MAPPA. Struttura:', hh);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK SU MAPPA. TMS:', tms, tAttuale);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK SU MAPPA. TMS Inizio:', this.Utils.tmsInizio, tMin);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK SU MAPPA. TMS Fine:', this.Utils.tmsFine, tMax);
      } */

      const tm = setTimeout(() => {
          clearTimeout(tm);
        // tms = this.datePipe.transform(tms , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
        this.elaboraPuntoClickato2(hh, tms);

        /* if (tAttuale < tMin || tAttuale > tMax) {
          tms = tMin + ((tMax - tMin) / 2);
          tms = this.datePipe.transform(tms , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
          if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK SU MAPPA. nuovo tms impostato', tms);
          }
          this.elaboraPuntoClickato2(hh, tms);
        } else {
          if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK SU MAPPA. Vecchio tms', tms);
          }
          this.elaboraPuntoClickato2(hh, tms);
        } */
      }, 100);
    }
    // }, 10);
  }

  elaboraPuntoClickato2(hh, tms) {
    // this.Utils.tmsSelezionato = tms;
    // this.tmsSelezionato = tms;
    // this.Utils.creaRangeSelezionato(tms);
    // this.Utils.ricalcolaRange(this, tms);
    // this.Utils.aggiornaTmsstringa(tms);
    // AppComponent.CambioTmsSelezionato(tms);
    this.cambioTmsSelezionato.emit(tms + ';elaboraPuntoClickato');

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tms del CLICK della mappa', this.NumeroFrame, tms);

    this.aggiornaValoriDopoClick(hh);

    // this.pointComponent.prendePointMeasures(this, tms);
    // this.eventsComponent.prendeEvents(this);

    /* if (this.MappaOGrafico2 === 'MC') {
      GestioneGrafici.disegnaSelezione(this, new Date(tms).getTime(), true);
    } */
    // t.disegnaHistogram(tms);
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Sposto il punto 2:', this.NumeroFrame, hh, tms, ExternalUtilities.bboxStringaFisso);
    // }
    // this.coordinateCambiate.emit(new Date());
    this.coordinateCambiate.emit(ExternalUtilities.bboxStringaFisso);
  }

  tmrSelezioneES;

  impostaArraySelezioneES(daDove) {
    if (!this.eventiSceltiES2) {

    } else {
      if (this.tmrSelezioneES) {
        clearInterval(this.tmrSelezioneES);

        this.tmrSelezioneES = undefined;
      }

      let q =0;
      this.tmrSelezioneES = setInterval(() => {
        if (this.datiEventSummary && this.datiEventSummary.DataTable) {
          clearInterval(this.tmrSelezioneES);

          this.tmrSelezioneES = undefined;
          this.impostaArraySelezioneES2(daDove);
        } else {
          q++;
          if (q > 10) {
            clearInterval(this.tmrSelezioneES);

            this.tmrSelezioneES = undefined;
          }
        }
      }, 500);
    }
  }

  tmrSelezioneGlobaliES;

  impostaArraySelezioneGlobaliES(daDove) {
    if (!this.eventiSceltiESGlobali2) {

    } else {
      if (this.tmrSelezioneGlobaliES) {
        clearInterval(this.tmrSelezioneGlobaliES);

        this.tmrSelezioneGlobaliES = undefined;
      }

      let q =0;
      this.tmrSelezioneGlobaliES = setInterval(() => {
        if (this.datiEventSummary && this.datiEventSummary.DataTable) {
          clearInterval(this.tmrSelezioneGlobaliES);

          this.tmrSelezioneGlobaliES = undefined;
          this.impostaArraySelezioneGlobaliES2(daDove);
        } else {
          q++;
          if (q > 10) {
            clearInterval(this.tmrSelezioneGlobaliES);

            this.tmrSelezioneGlobaliES = undefined;
          }
        }
      }, 500);
    }
  }

  impostaArraySelezioneES2(daDove) {
    /* if (this.appoCheckES !== '') {
      this.Utils.eventiSceltiES2 = JSON.parse(JSON.stringify(this.appoCheckES));
      this.appoCheckES = '';
    } */

    // logConsole('Imposto selezione ES Array Inizio', this.eventiSceltiES2, this.datiEventSummary);
  
    if (!this.eventiSceltiES2) { // || !this.datiEventSummary || !this.datiEventSummary.DataTable) {
      return;
    }

    const s = new Array();
    this.eventiSceltiES2.forEach(element => {
      // this.datiEventSummary.DataTable.forEach(element2 => {
      //   if (element.EVENT_TYPE === element2.EVENT_TYPE) {
          s.push(element.ROW_ID);
      //   }
      // });
    });
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione impostata:', s);

    // logConsole('Imposto selezione ES Array 2', this.NumeroFrame2, s, this.eventiSceltiES2, s);

    this.impostaSelezioneES = s;
    // this.idSelezionatoGlobaliAE = s;

    if (this.aggiornamentoEventiScelti === false) {
      this.aggiornamentoEventiScelti = true;
      // logConsole('EVENTI SCELTI 3:', this.appoCheckES);
      this.eventiSceltiES2 = JSON.parse(JSON.stringify(this.eventiSceltiES2));

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi scelti', this.Utils.eventiSceltiES2, this.impostaSelezioneES);
      // this.eventiSceltiESEmit.emit(this.Utils.eventiSceltiES2);
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta array selezione es', this.NumeroFrame2, this.eventiSceltiES2);
      // }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventi 3',  this.Utils.eventiSceltiES2)
      this.eventiSceltiESDiPassaggio = this.eventiSceltiES2;
      // this.effettuaAutoFitES = true; // !this.effettuaAutoFitES;
      // this.datiEventSummary.DataTable = this.datiEventSummary.DataTable;

      this.impostaPaginaES = 0;
    }, 100);
  }

  impostaArraySelezioneGlobaliES2(daDove) {
    /* if (this.appoCheckES !== '') {
      this.Utils.eventiSceltiES2 = JSON.parse(JSON.stringify(this.appoCheckES));
      this.appoCheckES = '';
    } */

    // logConsole('Imposto selezione Globali ES Array Inizio', this.NumeroFrame2, this.eventiSceltiESGlobali2);
  
    if (!this.eventiSceltiESGlobali2) { //  || !this.datiEventSummary || !this.datiEventSummary.DataTable) {
      return;
    }

    const s = new Array();
    this.eventiSceltiESGlobali2.forEach(element => {
      /* this.datiEventSummary.DataTable.forEach(element2 => {
        if (element.EVENT_TYPE === element2.EVENT_TYPE) {
          s.push(element2.ROW_ID);
        }
      }); */
      s.push(element.ROW_ID);
    });
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione impostata:', s);
    
    // logConsole('Imposto selezione Globali ES Array 2', this.NumeroFrame2, s, this.eventiSceltiESGlobali2);
    
    this.impostaSelezioneGlobaliES = s;
    // this.impostaSelezioneES = s;
    // this.idSelezionatoGlobaliAE = s;

    if (this.aggiornamentoEventiSceltiGlobali === false) {
      this.aggiornamentoEventiSceltiGlobali = true;
      // logConsole('EVENTI SCELTI 3:', this.appoCheckES);
      this.eventiSceltiESGlobali2 = JSON.parse(JSON.stringify(this.eventiSceltiESGlobali2));

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Aggiorno eventi scelti', this.Utils.eventiSceltiES2, this.impostaSelezioneES);
      // this.eventiSceltiESEmit.emit(this.Utils.eventiSceltiES2);
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposta array selezione Globali es', this.NumeroFrame2, this.eventiSceltiESGlobali2);
      // }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventi 3',  this.Utils.eventiSceltiES2)
      this.eventiSceltiGlobaliESDiPassaggio = this.eventiSceltiESGlobali2;
      // this.effettuaAutoFitES = true; // !this.effettuaAutoFitES;
      // this.datiEventSummary.DataTable = this.datiEventSummary.DataTable;

      this.impostaPaginaGlobaliES = 0;
    }, 100);
  }

  riempieArraySelezioneES(rit) {
    this.gestisceClickSummary(rit);
  }

  /* sistemaArrayGlobaleListaEventiSEVECCHIO(sel, desel) {
    if (sel === null) { sel = undefined; }
    if (desel === null) { desel = undefined; }

    let codiceDaRilevare;

    if (!this.Utils.listaEventiSE) {
      this.Utils.listaEventiSE = new Array();
    }

    if (sel) {
      if (!sel.ROW_ID || typeof(sel) === 'number') {
        codiceDaRilevare = { ROW_ID: sel };
      } else {
        codiceDaRilevare = sel;
      }
      if (this.debug2 === true) {
        // logConsole('Aggiungo riga selezionata alla lista globale', this.NumeroFrame2, codiceDaRilevare, typeof(sel))
      }
      let ok = true;
      if (this.Utils.listaEventiSE && typeof(this.Utils.listaEventiSE) === 'string') {
        this.Utils.listaEventiSE = JSON.parse(this.Utils.listaEventiSE);
      }
      this.Utils.listaEventiSE.forEach(element => {
        if (+element.ROW_ID === +codiceDaRilevare.ROW_ID) {
          ok = false;
        }
      });
      if (ok) {
        if (this.debug2 === true) {
          // logConsole('Aggiungo', sel);
        }
        this.Utils.listaEventiSE.push(sel);
      } else {
        if (this.debug2 === true) {
          // logConsole('NON ho aggiunto', sel, this.Utils.listaEventiSE);
        }
      }
    } else {
      if (!desel.ROW_ID || typeof(desel) === 'number') {
        codiceDaRilevare = { ROW_ID: desel };
      } else {
        codiceDaRilevare = desel;
      }
      if (this.debug2 === true) {
        // logConsole('Elimina riga selezionate dalla lista globale', this.NumeroFrame2, codiceDaRilevare, typeof(desel))
      }
      const lista = new Array();
      if (this.Utils.listaEventiSE && typeof(this.Utils.listaEventiSE) === 'string') {
        this.Utils.listaEventiSE = JSON.parse(this.Utils.listaEventiSE);
      }
      this.Utils.listaEventiSE.forEach(element => {
        if (+element.ROW_ID !== +codiceDaRilevare.ROW_ID) {
          lista.push(element);
        }
      });
      this.Utils.listaEventiSE = lista;
    }

    if (this.debug2 === true) {
      // logConsole('Lista globale risultante', this.NumeroFrame2, this.Utils.listaEventiSE)
    }
  } */

  sistemaArrayGlobaleListaEventiSE(sel, desel) {
    if (sel === null) { sel = undefined; }
    if (desel === null) { desel = undefined; }

    /* if (sel && sel[0]) { sel = sel[0]; }
    if (desel && desel[0]) { desel = desel[0]; }

    if (sel && !sel.ROW_ID) { sel = { ROW_ID: sel }; }
    if (desel && !desel.ROW_ID) { desel = { ROW_ID: desel }; } */

    let codiceDaRilevare;

    if (!this.eventiSceltiES2) {
      this.eventiSceltiES2 = new Array();
    }

    if (sel) {
      if (!sel.ROW_ID || typeof(sel) === 'number') {
        codiceDaRilevare = { ROW_ID: sel };
      } else {
        codiceDaRilevare = sel;
      }
      // if (this.debug2 === true) {
        // logConsole('Aggiungo riga selezionata alla lista globale', this.NumeroFrame2, codiceDaRilevare, typeof(sel))
      // }
      let ok = true;
      this.eventiSceltiES2.forEach(element => {
        if (+element.ROW_ID === +codiceDaRilevare.ROW_ID) {
          ok = false;
        }
      });
      if (ok) {
        // if (this.debug2 === true) {
          // logConsole('Aggiungo', sel);
        // }
        this.eventiSceltiES2.push(sel);
      } else {
        // if (this.debug2 === true) {
          // logConsole('NON ho aggiunto', sel, this.Utils.listaEventiSE);
        // }
      }
    } else {
      if (!desel.ROW_ID || typeof(desel) === 'number') {
        codiceDaRilevare = { ROW_ID: desel };
      } else {
        codiceDaRilevare = desel;
      }
      // if (this.debug2 === true) {
        // logConsole('Elimina riga selezionate dalla lista globale', this.NumeroFrame2, codiceDaRilevare, typeof(desel))
      // }
      const lista = new Array();
      this.eventiSceltiES2.forEach(element => {
        if (+element.ROW_ID !== +codiceDaRilevare.ROW_ID) {
          lista.push(element);
        }
      });
      this.eventiSceltiES2 = lista;
    }

    // if (this.debug2 === true) {
      // logConsole('Lista globale risultante', this.NumeroFrame2, this.Utils.listaEventiSE)
    // }
  }

  sistemaArrayGlobaleListaEventiGlobaliSE(sel, desel) {
    if (sel === null) { sel = undefined; }
    if (desel === null) { desel = undefined; }

    /* if (sel && sel[0]) { sel = sel[0]; }
    if (desel && desel[0]) { desel = desel[0]; }

    if (sel && !sel.ROW_ID) { sel = { ROW_ID: sel }; }
    if (desel && !desel.ROW_ID) { desel = { ROW_ID: desel }; } */

    // logConsole('Sistema array lista eventi 1', this.NumeroFrame2, sel, desel, 
    //   JSON.parse(JSON.stringify(this.eventiSceltiESGlobali2)), 
    //   JSON.parse(JSON.stringify(this.datiPointActivityEvents.DataTable)));

    let codiceDaRilevare;

    if (!this.eventiSceltiESGlobali2) {
      this.eventiSceltiESGlobali2 = new Array();
    }

    const lista = new Array();
    if (sel) {
      if (!sel.ROW_ID || typeof(sel) === 'number') {
        codiceDaRilevare = { ROW_ID: sel };
      } else {
        codiceDaRilevare = sel;
      }

      // if (this.debug2 === true) {
        // logConsole('Aggiungo riga selezionata alla lista globale', this.NumeroFrame2, codiceDaRilevare, typeof(sel))
      // }
        /* let ok = true;
        this.datiPointActivityEvents.DataTable.forEach(element => {
          if (+element.ROW_ID === +codiceDaRilevare.ROW_ID) {
            ok = false;
            lista.push(element);
          }
        });
        if (ok) { */
          // if (this.debug2 === true) {
            // logConsole('Aggiungo', sel);
          // }
          this.eventiSceltiESGlobali2.push(sel);

          logConsole('Sistema array lista eventi selezionati globali sel', this.NumeroFrame2, 
            this.eventiSceltiESGlobali2, 
            lista,
            codiceDaRilevare);
        // }
      // }
    } else {
      if (!desel.ROW_ID || typeof(desel) === 'number') {
        codiceDaRilevare = { ROW_ID: desel };
      } else {
        codiceDaRilevare = desel;
      }
      // if (this.debug2 === true) {
        // logConsole('Elimina riga selezionate dalla lista globale', this.NumeroFrame2, codiceDaRilevare, typeof(desel))
      // }
      if (this.eventiSceltiESGlobali2) {
        this.eventiSceltiESGlobali2.forEach(element => {
          if (+element.ROW_ID !== +codiceDaRilevare.ROW_ID) {
            lista.push(element);
          }
        });
      }
      this.eventiSceltiESGlobali2 = lista;

      // logConsole('Eventi scelti sistemati 1', JSON.parse(JSON.stringify(this.eventiSceltiES2)), codiceDaRilevare);
      const listaES = new Array();
      this.eventiSceltiES2.forEach(element => {
        if (+element.ROW_ID !== +codiceDaRilevare.ROW_ID) {
          listaES.push(element);
        }
      });
      this.eventiSceltiES2 = JSON.parse(JSON.stringify(listaES));
      this.eventiSceltiESEmit.emit(listaES);
      // logConsole('Eventi scelti sistemati 2', JSON.parse(JSON.stringify(this.eventiSceltiES2)), codiceDaRilevare);

      logConsole('Sistema array lista eventi selezionati globali desel', this.NumeroFrame2, this.eventiSceltiESGlobali2);
    }
    // if (this.datiPointActivityEvents && this.datiPointActivityEvents.DataTable) {
    //   this.datiPointActivityEvents.DataTable = JSON.parse(JSON.stringify(lista));
    // }

    // if (this.debug2 === true) {
      // logConsole('Lista globale risultante', this.NumeroFrame2, this.Utils.listaEventiSE)
    // }
  }

  /* aggiornaListaEventiSE(e) {
    // alert('3');
    // if (e.dati && e.dati.length > 0) {
    //   this.idSelezionatoAE = [-1];

    //   this.Utils.listaEventiSE = e.dati;
      
      if (this.Utils.listaEventiSE && typeof(this.Utils.listaEventiSE) === 'string') {
        this.Utils.listaEventiSE = JSON.parse(this.Utils.listaEventiSE);
      }
      // if (!this.idSelezionatoAE) { // [0] === -1) {
        this.idSelezionatoAE = new Array();
      // }
      if (this.Utils.listaEventiSE) {
        this.Utils.listaEventiSE.forEach(element => {
          if (element) {
            this.idSelezionatoAE.push(element.ROW_ID);
          }
        });
      }
    // } else {
    //   this.Utils.listaEventiSE = [];
    // }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista eventi ritornata', this.NumeroFrame2, this.Utils.listaEventiSE, e, this.idSelezionatoAE);

    this.passaggioListaEventiSE.emit(e.dati);
  } */

  creaIdEventi() {
    // logConsole('Eventi', this.eventiSceltiES2);
    const id = new Array();
    if (this.eventiSceltiES2) {
      this.eventiSceltiES2.forEach(element => {
        if (element) {
          id.push(element.ROW_ID);
        }
      });
    }
    this.idSelezionatoAE = id;
  }

  creaIdEventiGlobali() {
    // logConsole('Eventi globali', this.eventiSceltiESGlobali2);

    if (this.tipoEvento === 'S') {
      const tt = setTimeout(() => {
        clearTimeout(tt);
        
        let ids = new Array();
        if (this.datiPointActivityEvents && this.datiPointActivityEvents.DataTable) {
          this.datiPointActivityEvents.DataTable.forEach(element => {
            ids.push(element.ROW_ID);
          });
        } else {
          ids = [];
        }
        // t.idSelezionatoAE = ids;
        this.idSelezionatoGlobaliAE = ids;
        // logConsole('Events: Impostazione ids per tipo evento globale', ids, this.datiPointActivityEvents);
      }, 500);
    } else {
      const id = new Array();
      if (this.eventiSceltiESGlobali2) {
        this.eventiSceltiESGlobali2.forEach(element => {
          id.push(element.ROW_ID);
        });
      }
      this.idSelezionatoGlobaliAE = id;
      // logConsole('Ids selezionati eventi', id, this.eventiSceltiESGlobali2, this.datiPointActivityEvents.DataTable);
    }
  }

  riempieArraySelezioneAE(rit) {
    this.lastEventoClicked = undefined;
    
    this.sistemaArrayGlobaleListaEventiGlobaliSE(rit.selezionato, rit.deselezionato);

    if (this.tipoEvento === 'S') {
      this.passaggioEventiDaTogliereSE.emit(rit.deselezionato);
    }

    // this.creaIdEventiGlobali(); // TOLTO EVENTS
    this.passaggioListaEventiGlobaliSE.emit(this.eventiSceltiESGlobali2); // new Date().toString());

    /* this.sistemaArrayGlobaleListaEventiSE(rit.selezionato, rit.deselezionato);

    this.creaIdEventi();
    this.passaggioListaEventiSE.emit(this.eventiSceltiESGlobali2); // new Date().toString()); */
  }

  deselezionateTutteLeRigheAE(e) {
    this.idSelezionatoGlobaliAE.forEach(element => {
      this.sistemaArrayGlobaleListaEventiGlobaliSE(undefined, element);
    });
    this.idSelezionatoGlobaliAE = new Array();
    // this.vecchioIdSelezionatoAE = [-1]; 26/10/2023
    this.passaggioListaEventiGlobaliSE.emit(this.eventiSceltiESGlobali2); // new Date().toString());
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulizia filtro eventi globali AE', this.NumeroFrame2, this.eventiSceltiESGlobali2);
    // }
  }

  selezionateTutteLeRigheAE(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezionati tutti gli eventi 1', e);
    // }
    this.idSelezionatoGlobaliAE = e;
    const lista = new Array();
    this.idSelezionatoGlobaliAE.forEach(element => {
      this.sistemaArrayGlobaleListaEventiGlobaliSE(element, undefined);
      lista.push(element);
    });
    this.eventiSceltiESGlobali2 = lista;
    // this.vecchioIdSelezionatoAE = JSON.parse(JSON.stringify(this.idSelezionatoAE)); 26/10/2023
    this.passaggioListaEventiGlobaliSE.emit(this.eventiSceltiESGlobali2); // new Date().toString());
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezionati tutti gli eventi 3', this.eventiSceltiESGlobali2);
    // }
  }

  deselezionateTutteLeRigheES(e) {
    const ee = { dati: undefined, selezionato: undefined, deselezionato: undefined };
    this.gestisceClickSummary(ee);

    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pulizia filtro eventi ES', this.NumeroFrame2, this.eventiSceltiES2);
    // }
  }

  selezionateTutteLeRigheES(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezionati tutti gli eventi', e);
    // }
    this.idSelezionatoES = e;

    const ee = { dati: e, selezionato: e, deselezionato: undefined };
    this.gestisceClickSummary(ee);

    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezionati tutti gli eventi. Da passare', this.eventiSceltiES2);
    // }
  }

  riempieArraySelezioneNPS(rit) {
  }

  selezioneRigaTcRun = false;

  riempieArraySelezioneTC(rit) {
    // this.gestisceClickSummary(rit);
    logConsole('Premuto check su griglia tcrun', rit);
    if (rit && rit.dati && rit.dati.length > 0) {
      this.selezioneRigaTcRun = true;
    } else {
      this.selezioneRigaTcRun = false;
    }
  }

  selezionateTutteLeRigheTcRun(e, come) {
    logConsole('Premuto all/none su griglia tcrun', come);
    if (come) {
      this.selezioneRigaTcRun = true;
    } else {
      this.selezioneRigaTcRun = false;
    }
  }

  gestisceClickSummary(rit) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione ES:', rit);
    // }
    this.eventiSceltiES2 = new Array();
    let impostaSelezioneESAPP = new Array();

    if (rit.dati === undefined) {
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco per pulizia totale');
      // }
      this.eventiSceltiES2Testo = '';
      logConsole('Imposto selezione ES 4', this.NumeroFrame2);
      this.impostaSelezioneES = [-1];
      this.eventiSceltiESDiPassaggio = this.eventiSceltiES2;
      this.eventiSceltiESEmit.emit(this.eventiSceltiES2);
      return;
    }

    let e = rit.dati;
    if (e.ROW_ID) {
      e = [e];
    }
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e, sel, desel);
    let messi = '';
    e.forEach(element => {
      if (messi.indexOf(element.EVENT_TYPE + ',') === - 1) {
        messi += element.EVENT_TYPE + ',';
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, messi);
        const v = { EVENT_TYPE: element.EVENT_TYPE, ROW_ID: element.ROW_ID };
        this.eventiSceltiES2.push(v);
        impostaSelezioneESAPP.push(element.ROW_ID);
      }
    });
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.Utils.eventiSceltiES2);

    this.eventiSceltiES2Testo = '';
    if (this.eventiSceltiES2) {
      this.eventiSceltiES2.forEach(element => {
        this.eventiSceltiES2Testo += element.EVENT_TYPE + ', ';
      });
      if (this.eventiSceltiES2Testo.length > 1) {
        this.eventiSceltiES2Testo = this.eventiSceltiES2Testo.substring(0, this.eventiSceltiES2Testo.length - 2);
      }
    }

    const tm = setTimeout(() => {
      clearTimeout(tm);

      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Riempie array selezione es 1', this.NumeroFrame2, this.eventiSceltiES2);
      // }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventi 4',  this.Utils.eventiSceltiES2)
      this.eventiSceltiESDiPassaggio = this.eventiSceltiES2;
    }, 10);

    if (desel !== undefined && desel !== null) {
      const togliere = desel.EVENT_TYPE;
      const d1 = new Array();
      const d2 = new Array();
      impostaSelezioneESAPP.forEach(element => {
        let ok = true;
        this.datiEventSummary.DataTable.forEach(element2 => {
          if (ok) {
            if (element.ROW_ID === element2.ROW_ID) {
              ok = false;
            }
          }
        });
        if (ok) {
          d1.push(element);
        }
      });
      this.eventiSceltiES2.forEach(element => {
        if (element.EVENT_TYPE !== togliere) {
          d2.push(element);
        }
      });
      impostaSelezioneESAPP = d1;
      // logConsole('EVENTI SCELTI 4:', d2);
      this.eventiSceltiES2 = d2;

      const tm = setTimeout(() => {
        clearTimeout(tm);

        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Riempie array selezione es 2', this.NumeroFrame2, this.eventiSceltiES2);
        // }
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'eventi 5',  this.eventiSceltiES2)
        this.eventiSceltiESDiPassaggio = this.eventiSceltiES2;
      }, 10);
    }
    // logConsole('Imposto selezione ES 5', this.NumeroFrame2, impostaSelezioneESAPP);
    this.impostaSelezioneES = JSON.parse(JSON.stringify(impostaSelezioneESAPP));
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione 2:', this.frameAttivo2, this.NumeroFrame, this.Utils.eventiSceltiES2, this.impostaSelezioneES);
    this.eventiSceltiESEmit.emit(this.eventiSceltiES2);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, sel);
    /* if (sel && sel[0]) {
      ExternalUtilities.stringaAGNoACT = '[AGN] ' + sel[0].AGN_CODE;
      this.impostaAGNoACT.emit(this.Activity2 + 'Â§' + JSON.stringify(ExternalUtilities.stringaAGNoACT));
    } */
  }

  riempieArraySelezionePLI(rit) {

  }

  riempieArraySelezioneAP(rit) {

  }

  clickRigaAP(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misura clickata da impostare come globale', e[0]);
    // }
    this.impostaSelezioneAP = e[0].ROW_ID;
    this.checkPartitionLabel(e[0]);
    this.Utils.globalMeasureArfcn = e[0];
    // logConsole('Misura da impostare globale: ', e);
    this.measureData2.forEach(element => {
      if (element.CODE && element.CODE !== null && e[0].MEASR_CODE && e[0].MEASR_CODE == null) {
        if (e[0].MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
          this.Utils.tipoMisuraGlobaleArfcn = +element.TYPE;
          this.globalMeasureArfcnTypeEmit.emit(+element.TYPE);
        }
      }
    });

    this.globalMeasureArfcnEmit.emit(e[0]);
  }

  clickRigaPLI(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e[0]);
    this.lastSelectedLayer2 = e[0];
    this.checkPartitionLabel(e[0]);
    this.lastSelectedLayerEmit.emit(e[0]);
    this.cellaSelezionataEmit.emit(e[0]);

    this.ricaricaRaggiEmit.emit(e[0]);
  }

  riempieArraySelezioneCM(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneCM = new Array();
    e.forEach(element => {
      this.impostaSelezioneCM.push(element.ROW_ID);
    });
  }

  riempieArraySelezioneM2(rit) {
    if (this.eseguitoClickSuRigaM2) {
      return;
    }
    logConsole('Riempio array selezione M2', rit);

    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneM2 = new Array();
    let fil = '';
    e.forEach(element => {
      this.impostaSelezioneM2.push(element.ROW_ID);
      fil += JSON.stringify(element.FILTER) + ',';
    });
    
    this.filterSelectedMQ = '[' + fil.substring(0, fil.length - 1) + ']';
    logConsole('Click riga check M2', this.filterSelectedMQ);
    this.filterMQEmit.emit(this.filterSelectedMQ);
  }

  riempieArraySelezioneMF(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneMF = new Array();
    e.forEach(element => {
      this.impostaSelezioneMF.push(element.ROW_ID);
    });
    // logConsole('Click su check riga', rit, this.impostaSelezioneMF);
  }

  riempieArraySelezioneCD(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneCD = new Array();
    this.filterGroupByCDD = '';
    e.forEach(element => {
      this.impostaSelezioneCD.push(element.ROW_ID);
      this.filterGroupByCDD += element.FILTER_GROUP_BY + ',';
    });
    if (this.filterGroupByCDD.length > 0) {
      this.filterGroupByCDD = this.filterGroupByCDD.substring(0, this.filterGroupByCDD.length - 1);
    }
    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
    this.cdrData.caricaCDRData(this);
    // }, 100);
  }

  riempieArraySelezioneLA(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneCD = new Array();
    this.filterGroupByCDD = '';
    e.forEach(element => {
      this.impostaSelezioneCD.push(element.ROW_ID);
      this.filterGroupByCDD += element.FILTER_GROUP_BY + ',';
    });
    if (this.filterGroupByCDD.length > 0) {
      this.filterGroupByCDD = this.filterGroupByCDD.substring(0, this.filterGroupByCDD.length - 1);
    }
    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
    this.activities.caricaActivities(this);
    // }, 100);
  }

  riempieArraySelezioneCV(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneCV = new Array();
    e.forEach(element => {
      this.impostaSelezioneCV.push(element.ROW_ID);
    });
  }

  riempieArraySelezioneCD2(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneCD2 = new Array();
    e.forEach(element => {
      this.impostaSelezioneCD2.push(element.ROW_ID);
    });
  }

  /* riempieArraySelezioneLA2(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneLA2 = new Array();
    e.forEach(element => {
      this.impostaSelezioneLA2.push(element.ROW_ID);
    });
  } */

  riempieArraySelezioneCS(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, rit);
    // return;
    this.impostaSelezioneCS = new Array();
    this.filterGroupByCDR = '';
    e.forEach(element => {
      this.impostaSelezioneCS.push(element.ROW_ID);
      this.filterGroupByCDR += element.FILTER_GROUP_BY + ',';
    });
    if (this.filterGroupByCDR.length > 0) {
      this.filterGroupByCDR = this.filterGroupByCDR.substring(0, this.filterGroupByCDR.length - 1);
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostaSelezioneCS, this.filterGroupByCDR);
    // this.filterGroupByCDR = e.FILTER_GROUP_BY;
    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
    this.cdrVoice.caricaCDRVoice(this);
    // }, 100);
  }

  barraTitoloAperta() {
    this.dimeBarraAperta = this.dBarraAperta;

    // logConsole('dime 6', this.dimeBarraAperta);
  }

  barraTitoloChiusa() {
    if (this.barraImpostataAperta) {
      return;
    }

    if (this.isVisibileBar === true) {
      return;
    }

    if (this.menuframes === false) {
      this.dimeBarraAperta = this.dBarraChiusa;
    }
  }

  riempieArraySelezionePCM(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
  }

  clickRigaPCM(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click riga PCM', e, e[0].LAT, e[0].LNG);
    // }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e[0].LAT, e[0].LNG);
    this.checkPartitionLabel(e[0]);
    this.cellaSelezionataEmit.emit(e[0]);
    if (e && e[0] && e[0].LNG && e[0].LAT && e[0].LNG !== null && e[0].LAT !== null) {
      const coord = [ +e[0].LNG, +e[0].LAT];
      this.coordinateCambiateConClick.emit(transform(coord, 'EPSG:4326', 'EPSG:3857'));
      ExternalUtilities.spostaCentroAttuale = [true, true, true, true, true, true, true, true, true, true, true];
    }
  }

  cambioDelta(e) {
    // const ee = JSON.parse(e);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Set Delta', ee);
    if (e) {
      if (e.tms) {
        this.Utils.tmsDelta = e.tms;
      } else {
        this.Utils.tmsDelta = e;
      }
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Cambio delta', e);
      // }
      this.deltaEventsEmit.emit(new Date().toString());
      // this.eventsComponent.prendeEvents(this, true); // , -3
    } else {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Delta non valido', e);
    }
  }

  premutoMenu(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
  }

  fAperturaFiltroEventi(e) {
    this.sceltaFilter = !this.sceltaFilter;
  }

  filtroAttivo = false;

  cambioFiltroEventi(e, daDove) {
    // logConsole('SISTEMA FILTRO CAMBIO: ', e, daDove);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambiato filtro eventi:', e);
    let ok = false;
    if (e) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'EVENTS: Cambio filtro', e);

      this.filtriEventi2 = e;
      // // logConsole('INVIO FILTRO FRAME', e);

      if (this.filtriEventi2.filtroImpostato || this.filtriEventi2.filtroEscluso) {
        ok = true;
      }

      if (ok) {
        this.filtroAttivo = true;
      } else {
        this.filtroAttivo = false;
      }

      this.eventsComponent.prendeListaAgents(this); //  , this.offsetAe // 21/07/2025 per mail 26/06/2025 10:03

      this.eventsComponent.prendeEvents(this, true, false, false); // , 0
      this.filtriEventiEmit.emit(e);

      // this.mascheraSceltaFiltro = false;
      if (e.chiudeMaschera === true)  {
        this.sceltaFilter = false;
      }
    }

    this.filtroEventiMemorizzati = e;
    // localStorage.setItem('eventFilter_' + this.NumeroFrame2 + '_' + this.frameAttivo2, JSON.stringify(e));
  }

  dimensioniGriglia(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio dimensione griglia: ', this.NumeroFrame, e);
  }

  exportTimeChart() {
    const tm = setTimeout(() => {
      clearTimeout(tm); 
      this.graficiComponent.exportDati(this, false); 
      this.showExportBox = false;
    });
  }

  premutoExcelEventi(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Premuto Excel Eventi');
    // }
    // this.dataPerExcel = [{ tms: 1111, delta: 2222, event_type: '3333' }, { tms: 21111, delta: 22222, event_type: '23333' }];
    this.eventsComponent.estraeEvents(this);
  }

  resetPosition() {
    this.lastLoadCsv = '';
    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.resetPositionEmit.emit(new Date().toString());
    }, 10);
  }

  apreRicerca() {
    this.dimensioniFinestraRicerca = 30;
    this.opacitaRicerca = .75;
    const tm = setTimeout(() => {
          clearTimeout(tm);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.vc);
      if (this.addressTXT && this.addressTXT.first) {
        this.addressTXT.first.nativeElement.focus();
      }
    }, 1000);
  }

  chiudeRicerca() {
    this.dimensioniFinestraRicerca = 0;
    this.opacitaRicerca = .1;
  }

  ricercaIndirizzo() {
    const saddress = this.indirizzo;

    const params = {
      cntx_id: this.sessionID2,
      v_antenna_set_name_list: null,
      v_net_tech_list: null,
      geoants_bbox_min_x: null,
      geoants_bbox_max_x: null,
      geoants_bbox_min_y: null,
      geoants_bbox_max_y: null,
      v_site_code: saddress
    };
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca indirizzo:', params);
    // }
    this.caricamentoMappaInCorso = true;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lettura csv', this.act_set, this.act_set_id);
    this.apiService.chiamataPost(this.Utils, 'antenna_site__sel', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno indirizzo:', data2);
      // }
      if (data2 && data2 !== null && data2[0]) {
        ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

        if (data2[0].center_point_text) {
          let addr = data2[0].center_point_text;
          addr = addr.replace('POINT(', '').replace(')', '');
          const addr2 = addr.split(' ');
          let coord = [ +addr2[0], +addr2[1]];

          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Trovata antenna. Imposto il centro', 6); // , coord);
          // }
          if (coord) {
            if (coord[0] < 90) {
              coord = transform(coord, 'EPSG:4326', 'EPSG:3857');
            }
            // if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO CENTRO 9', this.NumeroFrame2, coord);
            // }
            this.viewMappaAttuale.setCenter(coord); // transform(coord, 'EPSG:4326', 'EPSG:3857'));
            // logConsole('Imposto centro 4', this.NumeroFrame2, coord, this.zoomImpostatoNelFrame);
            this.centroImpostato = coord; // transform(coord, 'EPSG:4326', 'EPSG:3857');
            // logConsole('Centro impostato 7', this.NumeroFrame2, coord);
            // logConsole('Centro impostato emit in ricerca indirizzo', this.NumeroFrame2, this.centroImpostato, '', this.zoomImpostatoNelFrame);
            this.centroImpostatoEmit.emit({
              daChi: this.NumeroFrame2, 
              funzione: 'Indirizzo', 
              centro: this.centroImpostato, 
              zoom: this.zoomImpostatoNelFrame,
              tipoMappa: this.overviewZoom2
            });
// if (this.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
            // }
            this.coordinateCambiateConClick.emit(transform(coord, 'EPSG:4326', 'EPSG:3857'));
            ExternalUtilities.spostaCentroAttuale = [true, true, true, true, true, true, true, true, true, true, true];
          }

          this.dimensioniFinestraRicerca = 0;

          this.caricamentoMappaInCorso = false;
        } else {
          this.continuaRicercaIndirizzo(saddress);
        }
      } else {
        this.continuaRicercaIndirizzo(saddress);
      }
    }, error => {
      this.continuaRicercaIndirizzo(saddress);
    });
  }

  continuaRicercaIndirizzo(saddress) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Getting address: ', saddress);
    // alert('Ricerca indirizzo google: ' + saddress)
    this.geoCoder.geocode({ address: saddress }, (results, status) => {
      if (status === 'OK') {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, results[0].geometry.location.lat());
        this.initContinued(results[0].geometry.location);
      } else {
        // alert('Not a valid address');
        // this.mostraPopup('Not a valid address', false, '')
        ExternalUtilities.visualizzaAlert('Not a valid address');

        this.caricamentoMappaInCorso = false;
      }
    });
  }

  initContinued(addr) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno coordinate indirizzo:', addr.lat(), addr.lng());
    // }
    // this.variabiliGlobali.Coordinate = addr.lat() + ';' + addr.lng();
    // this.latitudine = addr.lat();
    // this.longitudine = addr.lng();

    let coord = [ +addr.lng(), +addr.lat()];
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.NumeroFrame, coord);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro2');
    if (coord) {
      if (coord[0] < 90) {
        coord = transform(coord, 'EPSG:4326', 'EPSG:3857');
      }
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO CENTRO 10', this.NumeroFrame2, coord);
      // }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO CENTRO 11', this.viewMappaAttuale);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO CENTRO 12', transform(coord, 'EPSG:4326', 'EPSG:3857'));

      if (this.eseguitoInProgetto2 === false) {
        this.viewMappaAttuale.setCenter(coord); // transform(coord, 'EPSG:4326', 'EPSG:3857'));
      } else {
        // logConsole('Imposto centro 5', this.NumeroFrame2, coord, this.zoomImpostatoNelFrame);
        this.centroImpostato = coord; // transform(coord, 'EPSG:4326', 'EPSG:3857');
        // logConsole('Centro impostato 8', this.NumeroFrame2, coord);

        this.impostaPosizioneSchermata(coord, true, "initContinued", true, false);

        // this.map1[this.NumeroFrame2].getView().setCenter(transform(coord, 'EPSG:4326', 'EPSG:3857'));
        // logConsole('Centro impostato emit in ricerca indirizzo(2)', this.NumeroFrame2, this.centroImpostato, '', this.zoomImpostatoNelFrame);
        this.centroImpostatoEmit.emit({
          daChi: this.NumeroFrame2, 
          funzione: 'InitContinued', 
          centro: this.centroImpostato, 
          zoom: this.zoomImpostatoNelFrame,
          tipoMappa: this.overviewZoom2
        });
      }

      this.caricamentoMappaInCorso = false;
      /* this.centroImpostato = transform(coord, 'EPSG:4326', 'EPSG:3857');
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Centro impostato', this.centroImpostato);
      }
      this.coordinateCambiateConClick.emit(transform(coord, 'EPSG:4326', 'EPSG:3857'));
      ExternalUtilities.spostaCentroAttuale = [true, true, true, true, true, true, true, true, true, true, true]; */
    }

    this.dimensioniFinestraRicerca = 0;
    this.caricamentoMappaInCorso = false;
  }

  apreMascheraExportDati(t) {
    // if (this.MappaOGrafico2 === 'M') {
    //   // Estrazione dati per mappa
    // } else {
      this.tipoExport = t;
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Export dati ', t);
      // }
      if (this.MappaOGrafico2 === 'MC') {
        this.showExportBox = true;
      } else {
        if (t === 'csv') {
          this.showExportBox = true;
        } else {
          this.exportAllMeasuresKML = false;
          this.showExportBoxKML = true;
        }
      }
    // }
    // this.exportDati(t);
  }

  settaCookieKML() {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      const c =
        (this.exportMeasuresKML === true ? '1' : '0') + ';' +
        (this.exportAntenneKML === true ? '1' : '0') + ';' +
        (this.exportPlanimetryKML === true ? '1' : '0') + ';' +
        (this.exportOverlayKML === true ? '1' : '0') + ';' +
        (this.exportPathAntenneKML === true ? '1' : '0') + ';' +
        (this.exportRaysKML === true ? '1' : '0') + ';' +
        (this.exportEventsKML === true ? '1' : '0') + ';';
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, c);
      localStorage.setItem(this.userName + '_ExportKML', c);
    }, 100);
  }

  checkEnterIndirizzo(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.indirizzo = e;
    this.ricercaIndirizzo();
    this.dimensioniFinestraRicerca = 0;
  }

  changeNotebook(e) {
    const url: string = e.dati[0].CODE_STR.toString();
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, url);
    this.http.get(url,
    {responseType: 'text' })
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      this.htmlstring = this.sanitizer.bypassSecurityTrustHtml(res);
    });
  }

  clickSelezionePM(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misura clickata da impostare come globale', e[0]);
    // }
    this.selezionePM = e[0].ROW_ID;
    this.checkPartitionLabel(e[0]);
    this.Utils.globalMeasure = e[0];
    this.measureData2.forEach(element => {
      if (element.CODE && element.CODE !== null && e[0].MEASR_CODE && e[0].MEASR_CODE == null) {
        if (e[0].MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
          this.Utils.tipoMisuraGlobale = +element.TYPE;
          this.globalMeasureTypeEmit.emit(+element.TYPE);
        }
      }
    });
    this.globalMeasureEmit.emit(e[0]);
  }

  ciSonoModifiche(e) {
    this.checkSeCiSonoModificheEmit.emit(e);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ci sono modifiche Frame', e);
  }

  clickRigaMeasureDFN(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio misura DFN', e);
    // }
    this.checkPartitionLabel(e[0]);
    this.selezionePM = e[0].ROW_ID;
    this.Utils.globalMeasure = e[0];
    this.measureData2.forEach(element => {
      if (element.CODE && element.CODE !== null && e[0].MEASR_CODE && e[0].MEASR_CODE == null) {
        if (e[0].MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
          this.Utils.tipoMisuraGlobale = +element.TYPE;
          this.globalMeasureTypeEmit.emit(+element.TYPE);
        }
      }
    });
    this.globalMeasureEmit.emit(e[0]);
  }

  riempieArraySelezioneMeasureDFN(e) {

  }

  clickRigaMosaicGrid(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click mosaic grid', e);
    this.checkPartitionLabel(e[0]);

    if (this.comboSelArea2 === 1) {
      this.comboSelArea2 = 2;
      this.comboSelAreaEmit.emit(2);
      alert('Selected Area by, in context menu Settings,\nchanged to Polygon to highlightthe selected tile on the map, and execute analysis on that tile');
    }

    // this.mosaicGrid.caricamentoLayerGeometry(this, e);

    // TOLTO PERCHE' RIMANDAVA LA GRIGLIA ALLA PRIMA PAGINA
    ////// this.impostaSelezioneMosaicGrid = e[0].ROW_ID;
    // TOLTO PERCHE' RIMANDAVA LA GRIGLIA ALLA PRIMA PAGINA

    // this.Utils.posDaImpostare = e[0].CENTER;
    // this.posDaImpostareEmit.emit(e[0].CENTER);
    this.impostaCenterPosition.emit(e[0].CENTER);
    // this.impostaTimeCursorPosition.emit(e[0].CENTER);
    // logConsole('rigaSelezionataMG 3', e);
    ExternalUtilities.bboxSelected = e;
    if (typeof(ExternalUtilities.bboxSelected) === 'string') {
      ExternalUtilities.bboxSelected = JSON.parse(ExternalUtilities.bboxSelected);
    }
    this.clickatoSuMG.emit(e);
  }

  ultimaRigaSelezionataCG;

  clickRigaClusterGrid(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click cluster grid', e);
    this.checkPartitionLabel(e);

    this.ultimaRigaSelezionataCG = e;

    // this.mosaicGrid.caricamentoLayerGeometry(this, e);
    this.impostaSelezioneClusterGrid = e.ROW_ID;
    // this.Utils.posDaImpostare = e.CENTER;
    // this.posDaImpostareEmit.emit(e.CENTER);
    this.impostaCenterPosition.emit(e.CENTER);
    // this.impostaTimeCursorPosition.emit(e.CENTER);
    logConsole('Click riga CG', e);
    ExternalUtilities.bboxSelected = e;
    if (typeof(ExternalUtilities.bboxSelected) === 'string') {
      ExternalUtilities.bboxSelected = JSON.parse(ExternalUtilities.bboxSelected);
    }
    const passaggio = {
      bbox: e,
      spostaMappa: false
    }
    this.clickatoSuCG.emit(passaggio);
  }

  riempieArraySelezioneMosaicGrid(e) {

  }

  riempieArraySelezioneClusterGrid(e) {

  }

  refreshBBoxOZ(e) {
    // NON PIU' USATO
    // alert('NONE NONE');
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio bboxOZ', e);

    this.bboxOZ2 = e;
    this.bboxOZEmit.emit(e);
    this.accentratore(true, 'RefreshBboxOZ');
  }

  selectTipoDataset(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio tipo dataset', e);

    this.tipoDataset2 = e;
    this.tipoDatasetEmit.emit(e);
    this.accentratore(true, 'SelectTipoDataset');
  }

  refreshGeoFilter(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio geo filter', e);

    this.geoFilter2 = e;
    this.geoFilterEmit.emit(e);
    this.accentratore(true, 'RefreshGeoFilter');
  }

  /* prendePuntoMosaico(coord) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Effettuo ricerca per mosaico:', this.NumeroFrame2, coord);

    const punto = 'POINT(' + coord[0] + ' ' + coord[1] + ')';

    const params = {
      cntx_id: this.sessionID2,
      v_point: punto,
      v_square_meters: this.squareMeters
    };
    this.apiService.chiamataPost(this.Utils, 'point_to_snap', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno ricerca mosaico:', this.NumeroFrame2, data2.center);

        const valore = data2.center;

        if (this.comboSelArea2 === 1) {
          this.comboSelArea2 = 2;
          this.comboSelAreaEmit.emit(2);
          alert('Selected Area by, in context menu Settings,\nchanged to Polygon to highlightthe selected tile on the map, and execute analysis on that tile');
        }
        
        // // logConsole('Mosaico selezionato da mappa: CLICK ', valore);
        this.mosaicoSelezionato2 = valore;

        this.mosaicoSelezionatoEmit.emit(valore);
      } else {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno ricerca mosaico nulla');

        // this.mosaicoSelezionatoEmit.emit('POINT(12.4632262518742 41.8972473411201)');
        this.mosaicoSelezionatoEmit.emit('POINT(0 0)');
      }

      // this.disegnaGeometriaMosaico();
    }, error => {
      // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
      console.error('POST ERROR Point to Snap: ', error, error.message);
    });
  }

  disegnaGeometriaMosaico() {
    const view = this.map1[this.NumeroFrame2].getView();
    let extent = view.calculateExtent();
    if (extent[0] > 200) {
      extent = transform(extent, 'EPSG:3857', 'EPSG:4326');
    }
    this.bboxImpostataNelFrame = extent;
    this.zoomImpostatoNelFrame = view.getZoom();

    // logConsole('Geometria 1', this.datiMosaicGrid);
    if (!this.datiMosaicGrid || this.datiMosaicGrid === 'empty grid') {
      this.mosaicGrid.disegnaMosaicGrid(this);

      let c = 0;
      const tt = setInterval(() => {
        if (this.datiMosaicGrid) {
          clearInterval(tt);
          // logConsole('Geometria 2 Caricati dati', this.datiMosaicGrid);
          
          this.cercaMosaico();
        } else {
          c++;
          if (c > 50) {
            clearInterval(tt);

            logConsole('Errore su chiamata mosaic grid. Frame ' + this.NumeroFrame2);
          }
        }
      }, 100);
    } else {
      // logConsole('Geometria 3', this.datiMosaicGrid);

      this.cercaMosaico();
    }
  }

  cercaMosaico() {
    // logConsole('Geometria 4', this.datiMosaicGrid, this.mosaicoSelezionato2);
    if (this.datiMosaicGrid && this.datiMosaicGrid.DataTable) {
      let ok = false;

      this.datiMosaicGrid.DataTable.forEach(element => {
        if (!ok && element.CENTER.trim() === this.mosaicoSelezionato2.trim()) {
          // logConsole('Geometria 5', element);

          ExternalUtilities.rigaSelezionataMG[0] = element;
          ok = true;

          this.mosaicGrid.caricamentoLayerGeometry(this);
        }
      });

      if (!ok) {
        logConsole('Errore mosaico. Elemento non trovato in griglia: ', this.mosaicoSelezionato2, this.datiMosaicGrid);
      }
    } else {
      logConsole('Errore mosaico. Dati griglia non presenti');
    }
  }

  disegnaGeometriaCluster() {
    const view = this.map1[this.NumeroFrame2].getView();
    let extent = view.calculateExtent();
    if (extent[0] > 200) {
      extent = transform(extent, 'EPSG:3857', 'EPSG:4326');
    }
    this.bboxImpostataNelFrame = extent;
    this.zoomImpostatoNelFrame = view.getZoom();

    // logConsole('Geometria 1', this.datiMosaicGrid);
    if (!this.datiMosaicGrid || this.datiMosaicGrid === 'empty grid') {
      this.mosaicGrid.disegnaMosaicGrid(this);

      let c = 0;
      const tt = setInterval(() => {
        if (this.datiMosaicGrid) {
          clearInterval(tt);
          // logConsole('Geometria 2 Caricati dati', this.datiMosaicGrid);
          
          this.cercaCluster();
        } else {
          c++;
          if (c > 50) {
            clearInterval(tt);

            logConsole('Errore su chiamata mosaic grid. Frame ' + this.NumeroFrame2);
          }
        }
      }, 100);
    } else {
      // logConsole('Geometria 3', this.datiMosaicGrid);

      this.cercaCluster();
    }
  }

  cercaCluster() {
    // logConsole('Geometria 4', this.datiMosaicGrid, this.mosaicoSelezionato2);
    if (this.datiMosaicGrid && this.datiMosaicGrid.DataTable) {
      let ok = false;

      this.datiMosaicGrid.DataTable.forEach(element => {
        if (!ok && element.CENTER.trim() === this.mosaicoSelezionato2.trim()) {
          // logConsole('Geometria 5', element);

          ExternalUtilities.rigaSelezionataMG[0] = element;
          ok = true;

          this.mosaicGrid.caricamentoLayerGeometry(this);
        }
      });

      if (!ok) {
        logConsole('Errore mosaico. Elemento non trovato in griglia: ', this.mosaicoSelezionato2, this.datiMosaicGrid);
      }
    } else {
      logConsole('Errore mosaico. Dati griglia non presenti');
    }
  } */

  prendePuntoPath(coord) {
    const coord2 = transform(coord, 'EPSG:3857', 'EPSG:4326');
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Effettuo ricerca per path:', this.NumeroFrame2, coord, coord2);
    // }

    const punto = 'POINT(' + coord2[0] + ' ' + coord2[1] + ')';
    let sInizio = '';
    let sFine = '';

    /* if (+this.timeFilter === 2 || this.timeFilter2 === 'Time Range') {
      if (this.Utils.tmsInizio && this.Utils.tmsFine) {
        sInizio = this.Utils.tmsInizio; // t.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS');
        sFine = this.Utils.tmsFine; // t.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS');
      } else {
        // t.datiCellMeasure = 'empty grid';
        return;
      }
    } else {
      if (+this.timeFilter === 3 || this.timeFilter2 === 'Fixed Seconds') {
        if (this.Utils.tmsSelezionato) {
          const vecchioRange = this.Utils.lastRangeCDRData[this.frameAttivo][this.NumeroFrame];
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t.NumeroFrame, t.Utils.tmsSelezionato, vecchioRange);
          if (vecchioRange !== null && new Date(this.Utils.tmsSelezionato).getTime() >= vecchioRange.min &&
            new Date(this.Utils.tmsSelezionato).getTime() <= vecchioRange.max) {
            sInizio = this.datePipe.transform(vecchioRange.min, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            sFine = this.datePipe.transform(vecchioRange.max, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
          } else {
            const fs = +this.fixedSeconds2 * 1000;
            const dInizio = ((new Date(this.Utils.tmsSelezionato + ' UTC+00').getTime()) - fs);
            sInizio = this.datePipe.transform(dInizio, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
            const dFine = ((new Date(this.Utils.tmsSelezionato + ' UTC+00').getTime()) + fs);
            sFine = this.datePipe.transform(dFine, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');
          }
        } else {
          // t.datiCellMeasure = 'empty grid';
          return;
        }
      } else {
        sInizio = this.timeRangeDSFStart2;
        sFine = this.timeRangeDSFStop2;
      }
    } */

      // logConsole('Click su mappa 2: ' + this.act_set);
      if (!this.act_set) {
        return;
      }

    // Commentato sopra come di MAIL VenerdÃ¬ 19/02/2021 Ore 11:40
    if (+this.timeFilter === 2 || this.timeFilter2 === 'Time Range') {
      if (this.Utils.tmsInizio && this.Utils.tmsFine) {
        sInizio = this.Utils.tmsInizio;
        sFine = this.Utils.tmsFine;
      }
    } else {
      sInizio = this.timeRangeDSFStart2;
      sFine = this.timeRangeDSFStop2;
    }

    let nomeCluster = '';

    // logConsole('Square meters in Prende Punto path 1', this.squareMeters);

    let squareMeters = this.squareMeters2;
    if (squareMeters === '<GLOBAL SQUARE SIDE>') {
      squareMeters = this.squareMetersGlobale2;
    }
    
    const geoFilter  = ExternalUtilities.ritornaBboxGiusta(this, 'prendePuntoPath');
    if (geoFilter.length > 0 && geoFilter[0] !== 'NaN' && geoFilter[1] !== 'NaN' && geoFilter[2] !== 'NaN' && geoFilter[3] !== 'NaN') {
      // logConsole('Square meters', this.squareMeters2);
      const params = {
        cntx_id: this.sessionID2,
        v_act_set_name_list: this.act_set,
        v_point: punto,
        v_tms_min: sInizio,
        v_tms_max: sFine,
        v_bbox: 'BOX(' + geoFilter[0] + ',' + geoFilter[1] + ',' + geoFilter[2] + ',' + geoFilter[3] + ')',
        v_square_meters: squareMeters,
        v_cluster_name: nomeCluster
      };
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca click mappa:', this.NumeroFrame2, params);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ricerca click mappa. Agn o Act: ', ExternalUtilities.stringaAGNoACT);
      // }
      this.apiService.chiamataPost(this.Utils, 'point_to_features', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        if (data2 && data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno ricerca click mappa:', this.NumeroFrame2, data2);
          // }

          const agn_rilevati = new Array();
          let ceAgnAttuale = -1;
          let q = 0;
          if (data2 && data2.DataTable) {
            data2.DataTable.forEach(element => {
              let ok = true;
              agn_rilevati.forEach(element2 => {
                if (element2.AGN_CODE === element.AGN_CODE) {
                  ok = false;
                }
              });
              if (ok) {
                agn_rilevati.push(element);
              }
              if (element.AGN_CODE === ExternalUtilities.stringaAGNoACT && ceAgnAttuale === -1) {
                ceAgnAttuale = q;
                // logConsole('Click su mappa 0: ' + ceAgnAttuale);
              }
              q++;
            });

            // logConsole('Click su mappa', data2);
            if (data2.DataTable && data2.DataTable[0] && data2.DataTable[0].BBOX_SELECTED) {
              ExternalUtilities.bboxSelected = [data2.DataTable[0].BBOX_SELECTED];
              if (typeof(ExternalUtilities.bboxSelected) === 'string') {
                ExternalUtilities.bboxSelected = JSON.parse(ExternalUtilities.bboxSelected);
              }
    
              // if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG[0] && ExternalUtilities.rigaSelezionataMG[0].NAME &&
              //   ExternalUtilities.rigaSelezionataMG[0].NAME !== 'DrawnPolygon') {
                this.clickatoSuMG.emit(ExternalUtilities.bboxSelected);
                this.clickatoSuCG.emit(ExternalUtilities.bboxSelected);
  
                // if (this.NumeroFrame2 !== this.frameCheHaDisegnatoBox) {
                  this.mosaicGrid.caricamentoLayerGeometry(this);
                  this.clusterGrid.caricamentoLayerGeometry(this);    

                  if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.vectorMDP) {
                    this.addLayerToMap(this.vectorMDP, 19, 'VectorMDP');
                  }

                  // }
              // }
            }
          }

          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno ricerca click mappa. AGN rilevati: ', this.NumeroFrame2, agn_rilevati, q);
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno ricerca click mappa. Esiste attuale: ', this.NumeroFrame2, ceAgnAttuale);
          // }

          // logConsole('Click su mappa 1: ' + ceAgnAttuale + ' - ' + agn_rilevati.length + ' (' + ExternalUtilities.stringaAGNoACT + ')', agn_rilevati);

          if (ceAgnAttuale > -1) {
            // Trovato l'agn che è già  impostato... Cambio solo il tms e tiro innanze
            // logConsole('Click su mappa 2');
            this.elaboraPuntoClickato(data2.DataTable[ceAgnAttuale]);
          } else {
            if (q === 1) {
              // logConsole('Click su mappa 3: ' + q);
              // NON trovato l'agn ma ne ho rilevato solo uno... Imposto l'agn code e imposto il tms relativo
              ExternalUtilities.stringaAGNoACT = agn_rilevati[0].AGN_CODE;
              this.agnPerTcInfo = ExternalUtilities.stringaAGNoACT;
              this.impostaAGNoACT.emit(this.Activity2 + '§' + JSON.stringify(ExternalUtilities.stringaAGNoACT));
              this.elaboraPuntoClickato(data2.DataTable[0]);

              // if (this.debug2 === true) {
                this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno ricerca click mappa. Impostato AGN CODE unico: ', this.NumeroFrame2, agn_rilevati);
              // }
            } else {
              if (q > 0) {
                // logConsole('Click su mappa 4: ' + q, agn_rilevati);
                // NON trovato l'agn e ne ho rilevato più di uno... Faccio scegliere
                this.clickESceltaAGNoACT.emit(this.Activity2 + '§' + JSON.stringify(agn_rilevati));

                // if (this.debug2 === true) {
                  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno ricerca click mappa. Aperta maschera scelta AGN CODE: ', this.NumeroFrame2, agn_rilevati);
                // }
              // } else {
                // logConsole('Click su mappa 5: ' + q);
              }
            }
          }
        } else {
          // if (this.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno ricerca click mappa nulla');
          // }
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        console.error('POST ERROR Point to Features: ', error, error.message);
      });
    }
  }

  numeroRighePaginaF(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Numero righe pagina griglia:', this.NumeroFrame2, e);
    // }
    this.numeroRighePagina = e;
  }

  prendePuntoCluster(t, e, coord, res, proj) {
    // if (t.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'get Feature Info Cluster', e);
    // }

    const url = e.getFeatureInfoUrl(
      coord,
      res,
      proj,
      { INFO_FORMAT: 'application/json', FEATURE_COUNT: '500' }
    );
    if (url && url !== t.lastHttpC) {
      this.lastHttpC = url;
      fetch(url)
      .then(function (response) { return response.text(); })
      .then(async function (html) {
        if (html.toUpperCase().indexOf('ERROR:') === -1) {
          let hh = undefined;
          try {
            hh = JSON.parse(html);
          } catch (e) {
            t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), true, 'Errore di parse', html);
          }
          // if (t.debug2 === true) {
            if (hh && hh.features && hh.features[0] && hh.features[0].properties) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'get Feature Info Cluster. HH: ', hh);
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'get Feature Info Cluster. HH.features: ', hh.features);
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'get Feature Info Cluster. HH.features[0]: ', hh.features[0]);
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'get Feature Info Cluster. HH.features[0].properties: ', hh.features[0].properties);
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'get Feature Info Cluster. HH.features[0].properties.center: ', hh.features[0].properties.center);
              // if (hh & hh.features && hh.features[0] && hh.features[0].properties && hh.features[0].properties.center) {
              // if (t.debug2 === true) {
                t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Ritorno ricerca cluster. Eseguo emit');
              // }

              t.clusterSelezionatoEmit.emit(hh.features[0].properties.center);
            }
          // }
          /* } else {
            if (t.debug2 === true) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno ricerca cluster nulla');
            }
          } */
        }
      });
    }
  }

  // filtroEventiDaPassare;
  // mascheraSceltaFiltro = false;

  clickete(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Riga selezionata dettaglio events', e);
    // }
    /* let elemento = e.srcElement;
    let stringa = elemento.textContent; //  + ',';

    let inizio = elemento.offsetLeft;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Inizio', e, elemento.textContent, elemento.offsetLeft);
    let q = 0;
    while (elemento) {
      if (elemento.offsetLeft < inizio) {
        inizio = elemento.offsetLeft;
        let valore = elemento.textContent;
        if (valore.indexOf(':') > -1) {
          valore = valore.substring(0, valore.indexOf(':'));
        }
        if (stringa.indexOf(valore + ',') === -1) {
          stringa += valore + ',';
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, q, inizio, valore, stringa);
        }
      }
      q++;

      elemento = elemento.parentNode;
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.testoDettaglioEventi);

    // this.mascheraSceltaFiltro = false;
    this.vociTrovate = new Array();
    // this.percorsoCompleto = '';
    this.rp = false;
    this.cercaStringaInJSON('', this.testoDettaglioEventi, stringa);
    const vt = new Array();
    this.vociTrovate.forEach(element => {
      vt.push(element); // '{_source,layers,ants_pdu,' + element + '}');
    });
    this.vociTrovate = JSON.parse(JSON.stringify(vt));
    /* if (this.vociTrovate.length === 1) {
      this.filtroEventiDaPassare = this.vociTrovate[0].Percorso;
    } else {
      this.mascheraSceltaFiltro = true;
    } * /
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.vociTrovate, this.vociTrovate.length); */

    // return;
    // this.rigaSelezionataDettaglioEvents = e;
    // this.clickOnTreeView(e);
    // logConsole('Evento clickato', e, e.Path);
    this.vociTrovate = [e.Path];
  }

  /* clickSuFiltro(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su filtro', e);
    this.filtroEventiDaPassare = e.Percorso;
    const nv = new Array();
    this.vociTrovate.forEach(element => {
      if (element.Percorso === e.Percorso) {
        element.Selezionato = true;
      } else {
        element.Selezionato = false;
      }
      nv.push(element);
    });
    this.vociTrovate = nv;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.vociTrovate);
  } */

  vociTrovate;
  // percorsoCompleto;
  rp = false;

  creaVoce(p) {
    const v = {
      Percorso: p,
      Selezionato: false,
      RigaPari: this.rp
    }
    this.rp = !this.rp;
    this.vociTrovate.push(v);
  }
  
  cercaStringaInJSON(inizio, jasone, stringaDaCercare) {
    if (jasone && jasone !== null) {
      Object.keys(jasone).forEach(element => {
        if (element) {
          if (typeof(jasone[element]) === 'object') {
            if (element.indexOf(stringaDaCercare) > -1) {
              this.creaVoce(inizio + element);
            }
            this.cercaStringaInJSON(inizio + element + ',', jasone[element], stringaDaCercare)
          } else {
            if (element.indexOf(stringaDaCercare) > -1) {
              this.creaVoce(inizio + element);
              // return;
            }
          }
        }
      });
    }
  }

  /* dragEndCDRData(e) {
    this.dimeCDRData1 = Math.floor(e.sizes[0]);
    this.dimeCDRData2 = 100 - Math.floor(e.sizes[0]);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.dimeCDRData1, this.dimeCDRData2);

    localStorage.setItem(this.userName + '_CDRDATA_' + this.NumeroFrame2, JSON.stringify(Math.floor(e.sizes[0])));
  }

  dragEndCDRVoice(e) {
    this.dimeCDRVoice1 = Math.floor(e.sizes[0]);
    this.dimeCDRVoice2 = 100 - Math.floor(e.sizes[0]);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.dimeCDRData1, this.dimeCDRData2);

    localStorage.setItem(this.userName + '_CDRVOICE_' + this.NumeroFrame2, JSON.stringify(Math.floor(e.sizes[0])));
  } */

  clickRigaAreaInfo(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    // logConsole('Click area info 1', e);
    this.checkPartitionLabel(e[0]);
    this.impostaSelezioneAreaInfo = e[0].ROW_ID;
    this.Utils.globalMeasure = e[0];

    this.measureData2.forEach(element => {
      if (element.CODE && element.CODE !== null && e[0].MEASR_CODE && e[0].MEASR_CODE == null) {
        if (e[0].MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
          // logConsole('Click area info 2', element);
          this.Utils.tipoMisuraGlobale = +element.TYPE;
          this.globalMeasureTypeEmit.emit(+element.TYPE);
        }
      }
    });
    // logConsole('Click area info 3', e);
    this.globalMeasureEmit.emit(e[0]);
  }

  ultimaRigaSelezionataArfcn;

  clickRigaArfcn(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e && e[0] && e[0].ROW_ID) {
      this.ultimaRigaSelezionataArfcn = e;
      
      this.checkPartitionLabel(e[0]);
      // this.impostaSelezioneArfcn = e[0].ROW_ID;
      this.Utils.globalMeasureArfcn = e[0];
      this.measureData2.forEach(element => {
        if (element.CODE && element.CODE !== null && e[0].MEASR_CODE && e[0].MEASR_CODE == null) {
          if (e[0].MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
            this.Utils.tipoMisuraGlobaleArfcn = +element.TYPE;
            this.globalMeasureArfcnTypeEmit.emit(+element.TYPE);
          }
        }
      });
      this.globalMeasureArfcnEmit.emit(e[0]);

      logConsole('Click riga ARFCN', e[0]);

      if (this.comboSelArea2 === 1) {
        this.comboSelArea2 = 2;
        this.comboSelAreaEmit.emit(2);
        alert('Selected Area by, in context menu Settings,\nchanged to Polygon to highlightthe selected tile on the map, and execute analysis on that tile');
      }
  
      ExternalUtilities.bboxSelected = e;
      /* if (typeof(ExternalUtilities.bboxSelected) === 'string') {
        ExternalUtilities.bboxSelected = JSON.parse(ExternalUtilities.bboxSelected);
      } */
      const passaggio = {
        bbox: e[0],
        spostaMappa: false
      }
      this.clickatoSuArfcn.emit(passaggio);
    } else {
      console.error('ROW_ID non valido', e);
    }
  }
  ultimaRigaSelezionataArfcnAM;

  clickRigaArfcnAM(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    if (e && e[0] && e[0].ROW_ID) {
      this.ultimaRigaSelezionataArfcnAM = e;
      
      this.checkPartitionLabel(e[0]);
      // this.impostaSelezioneArfcn = e[0].ROW_ID;
      this.Utils.globalMeasureArfcn = e[0];
      this.measureData2.forEach(element => {
        if (element.CODE && element.CODE !== null && e[0].MEASR_CODE && e[0].MEASR_CODE == null) {
          if (e[0].MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
            this.Utils.tipoMisuraGlobaleArfcn = +element.TYPE;
            this.globalMeasureArfcnTypeEmit.emit(+element.TYPE);
          }
        }
      });
      this.globalMeasureArfcnEmit.emit(e[0]);

      logConsole('Click riga ARFCN AM', e[0]);

      if (this.comboSelArea2 === 1) {
        this.comboSelArea2 = 2;
        this.comboSelAreaEmit.emit(2);
        alert('Selected Area by, in context menu Settings,\nchanged to Polygon to highlightthe selected tile on the map, and execute analysis on that tile');
      }
  
      ExternalUtilities.bboxSelected = e;
      /* if (typeof(ExternalUtilities.bboxSelected) === 'string') {
        ExternalUtilities.bboxSelected = JSON.parse(ExternalUtilities.bboxSelected);
      } */
      const passaggio = {
        bbox: e[0],
        spostaMappa: false
      }
      this.clickatoSuArfcn.emit(passaggio);
    } else {
      console.error('ROW_ID non valido', e);
    }
  }

  clickMoveToPointAR(e) {
    if (this.ultimaRigaSelezionataArfcn) {
      // logConsole('Click move to point arfcn', this.ultimaRigaSelezionataArfcn);
  
      const passaggio = {
        bbox: this.ultimaRigaSelezionataArfcn,
        spostaMappa: true
      }
      this.clickatoSuArfcn.emit(passaggio);
    }
  }

  clickMoveToPointAM(e) {
    if (this.ultimaRigaSelezionataArfcnAM) {
      // logConsole('Click move to point arfcn', this.ultimaRigaSelezionataArfcn);
  
      const passaggio = {
        bbox: this.ultimaRigaSelezionataArfcnAM,
        spostaMappa: true
      }
      this.clickatoSuArfcn.emit(passaggio);
    }
  }

  clickMoveToPointCG(e) {
    if (this.ultimaRigaSelezionataCG) {
      // logConsole('Click move to point cg', this.ultimaRigaSelezionataCG);
  
      const passaggio = {
        bbox: this.ultimaRigaSelezionataCG,
        spostaMappa: true
      }
      this.clickatoSuCG.emit(passaggio);
    }
  }

  riempieArraySelezioneAreaInfo(e) {

  }

  riempieArraySelezioneArfcn(e) {

  }

  riempieArraySelezioneArfcnAM(e) {

  }

  dragEndCdrData(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Drag end data', e);
    // }
    const dime1 = Math.round(e.sizes[0]);
    const dime2 = 100 - dime1;
    const sizes = dime1.toString() + ';' + dime2.toString();
    localStorage.setItem(this.userName + '_CdrData_' + this.NumeroFrame2, sizes);
  }

  dragEndCdrVoice(e) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Drag end voice', e);
    // }
    const dime1 = Math.round(e.sizes[0]);
    const dime2 = 100 - dime1;
    const sizes = dime1.toString() + ';' + dime2.toString();
    localStorage.setItem(this.userName + '_CdrVoice_' + this.NumeroFrame2, sizes);
  }

  impostaDimensioniCDR() {
    // this.impostaMascheraPerProgetto();
    const d = localStorage.getItem(this.userName + '_CdrData_' + this.NumeroFrame2);
    const v = localStorage.getItem(this.userName + '_CdrVoice_' + this.NumeroFrame2);
    if (d !== null) {
      const dd = d.split(';');
      this.sizeCdrDataA = +dd[0];
      this.sizeCdrDataB = +dd[1];
    }
    if (v !== null) {
      const vv = v.split(';');
      this.sizeCdrVoiceA = +vv[0];
      this.sizeCdrVoiceB = +vv[1];
    }
  }

  tipologiaCampo(e) {
    return typeof(e);
  }


  prendeBBOXSoloValori(daDove) {
    if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.viewMappaAttuale && this.viewMappaAttuale !== null) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'prendeBBOXSoloValori. Provenienza ' + daDove);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'prendeBBOXSoloValori. Tipo mappa ' + this.overviewZoom2);
      
      const bboxFin2 = new Array();
      bboxFin2[0] = -180;
      bboxFin2[1] = -90;
      bboxFin2[2] = 180;
      bboxFin2[3] = 90;

      const rit2 = [ bboxFin2[0] , bboxFin2[1] , bboxFin2[2] , bboxFin2[3] ];

      ExternalUtilities.bboxAttualeFisso = rit2;
      ExternalUtilities.bboxExportFisso = 'CRS=EPSG%3A4326&WIDTH=1024&HEIGHT=768&BBOX=' + bboxFin2[0] + ',' + bboxFin2[1] + ',' +
        bboxFin2[2] + ',' + bboxFin2[3];

      ExternalUtilities.bboxStringaFisso = 'geoants_bbox_min_x:' + bboxFin2[0] + ';geoants_bbox_min_y:' + bboxFin2[1] + ';';
      ExternalUtilities.bboxStringaFisso += 'geoants_bbox_max_x:' + bboxFin2[2] + ';geoants_bbox_max_y:' + bboxFin2[3];

      const s = this.map1[this.NumeroFrame2].getSize();
      if (this.map1[this.NumeroFrame2].getView() && this.map1[this.NumeroFrame2].getView().getResolution()) {
        let bbox = this.map1[this.NumeroFrame2].getView().calculateExtent(s);

        if (isNaN(bbox[0]) || isNaN(bbox[1]) || isNaN(bbox[2]) || isNaN(bbox[3])) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'prendeBBOXSoloValori. Resetto extent');

          bbox = [-180, -90, 180, 90];
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Imposto BBOX Maschera', s, bbox, ExternalUtilities.bboxStringaFisso);
        }
        //  this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'BBOX Maschera', s, bbox);

        /* if (!bbox[1] || bbox[1] === null) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Esco da BBOX Maschera', bbox[1]);
          return;
        } */
        // return;

        // const bboxFin = transform(bbox, 'EPSG:3857', 'EPSG:4326');
      // if (this.ultimoBBoxFin !== JSON.stringify(bboxFin)) {
      //   logConsole('Esco da funzione prendeBBOXSoloValori per ultimo valore uguale', daDove);
        // return '';
      // } else {
        // logConsole('Eseguo funzione prendeBBOXSoloValori', daDove);
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'prendeBBOXSoloValori. Prendo extent calcolato', bbox);

        // this.ultimoBBoxFin = JSON.stringify(bboxFin);

        /* if (bboxFin[0] === 'NaN' || isNaN(bboxFin[0]) === true) {
          return;
        } */

        /* const perc1 = Math.abs(bboxFin[2] - bboxFin[0]) / 2;
        const perc2 = Math.abs(bboxFin[3] - bboxFin[1]) / 2;
        bboxFin[0] -= perc1;
        bboxFin[1] -= perc1;
        bboxFin[2] += perc2;
        bboxFin[3] += perc2;

        bboxFin[0] = Math.floor(bboxFin[0] * this.valoreRiduzione) / this.valoreRiduzione;
        bboxFin[1] = Math.floor(bboxFin[1] * this.valoreRiduzione) / this.valoreRiduzione;
        bboxFin[2] = Math.ceil(bboxFin[2] * this.valoreRiduzione) / this.valoreRiduzione;
        bboxFin[3] = Math.ceil(bboxFin[3] * this.valoreRiduzione) / this.valoreRiduzione; */

        const rit = this.sistemaCoordinate(bbox, "4326");
        const rit2 = this.sistemaCoordinate(bboxFin2, "4326");

        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'prendeBBOXSoloValori. VALORI BBOX VALORI', rit);

        // const ritIniziale = [ rit[0] , rit[1] , rit[2] , rit[3] ];

        // ExternalUtilities.bboxAttuale = rit;
        ExternalUtilities.bboxExport = 'CRS=EPSG%3A4326&WIDTH=1024&HEIGHT=768&BBOX=' + rit[0] + ',' + rit[1] + ',' +
          rit[2] + ',' + rit[3];

        ExternalUtilities.bboxStringa = 'geoants_bbox_min_x:' + rit[0] + ';geoants_bbox_min_y:' + rit[1] + ';';
        ExternalUtilities.bboxStringa += 'geoants_bbox_max_x:' + rit[2] + ';geoants_bbox_max_y:' + rit[3];

        ExternalUtilities.bboxStringaFisso = 'geoants_bbox_min_x:' + rit2[0] + ';geoants_bbox_min_y:' + rit2[1] + ';';
        ExternalUtilities.bboxStringaFisso += 'geoants_bbox_max_x:' + rit2[2] + ';geoants_bbox_max_y:' + rit2[3];

        // logConsole(ExternalUtilities.bboxStringa);
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'prendeBBOXSoloValori. Ritorno: ', rit);

        return rit;
      }
    } else {
      return '';
    }
  }

  clickSuChart(titolo) {
    /* if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Altezza click', e.layerY, n);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.chartsGrafici);
    } */

    if (!this.chartsGrafici || !this.chartsGrafici[this.NumeroFrame2] || !this.chartsGrafici[this.NumeroFrame2][0]) {
      return;
    }

    // if (e.layerY < 13) {
      let quale;
      // let nn = n; // + 1;
      // const titolo0 = t; //  this.chartsGrafici[this.NumeroFrame2][0].title.text;
      /* if (titolo0 === 'Events') {
        nn--;
      } */
      // const tt = t[nn];
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Selezione misura', titolo, this.measureData2);
      // }
      // logConsole('Misure', this.Measure, this.doNotSetGM);

      // NON SERVE PIU' COME DA MAIL 18/04/2025 02:02
      /* let ciSonoGlobal = false;
      this.Measure.forEach(element => {
        if (element.toUpperCase().indexOf('GLOBAL MEASURE') > -1 || element.toUpperCase().indexOf('GLOBAL_MEASURE') > -1) {
          ciSonoGlobal = true;
        }
      });
      if (ciSonoGlobal) {
        // alert('Ci sono misure globali. Non aggiorno la misura globale');
        quale = undefined;
      } else { */
      // NON SERVE PIU' COME DA MAIL 18/04/2025 02:02
        this.measureData2.forEach(element => {
          if (element.DISPLAY_NAME === titolo) {
            quale = element;
          }
        });
        // alert('NON Ci sono misure globali. Aggiorno la misura globale con ' + quale);
      // }

      // logConsole('Click su titolo chart: ', this.doNotSetGM, ciSonoGlobal, quale);
      if (quale) {
        // if (this.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Impostata misura globale su click time chart', titolo, quale);
        // }
        this.Utils.globalMeasure = quale;
        // logConsole('Misura globale', quale)
        this.measureData2.forEach(element => {
          if (quale.MEASR_CODE && quale.MEASR_CODE !== null && element.CODE && element.CODE !== null)  {
            if (quale.MEASR_CODE.toLowerCase().trim() === element.CODE.toLowerCase().trim()) {
              this.Utils.tipoMisuraGlobale = +element.TYPE;
              this.globalMeasureTypeEmit.emit(+element.TYPE);
              logConsole('Emetto Misura globale', element)
            }
          }
        });
        this.globalMeasureEmit.emit(quale);
      } else {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'ERRORE: Misura globale non valida', titolo);
      }
    // }
  }

  lastParametri;

  creaLayerBBOX() {
    // return;

    /* if (this.overviewZoom2 === true) {
      // return;
    } */

    let bboxFin;
    let c;
    let name;
    let ss = ''; // 'POLYGON((';
    let cePolygon = true;
    /* if (+this.comboSelArea2 === 1) {
      // logConsole('clb: 1');
      bboxFin = this.bboxImpostataNelFrame; // this.bboxZoom; // ExternalUtilities.ritornaBboxGiusta(this);
      if (!bboxFin) { return; }
      /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'BBOX:', bboxFin);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Diff1:', bboxFin[0] - bboxFin[2]);
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Diff2:', bboxFin[1] - bboxFin[3]); * /

      const diffX = Math.abs(bboxFin[0] - bboxFin[2]);
      const diffY = Math.abs(bboxFin[1] - bboxFin[3]);

      if (diffX === 0 || diffY === 0) {
        return;
      }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DIFFX: ', diffX);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'DIFFY: ', diffY);

      ss += bboxFin[0] + ' ' + bboxFin[1] +'\\,';
      ss += bboxFin[2] + ' ' + bboxFin[1] +'\\,';
      ss += bboxFin[2] + ' ' + bboxFin[3] +'\\,';
      ss += bboxFin[0] + ' ' + bboxFin[3] +'\\,';
      ss += bboxFin[0] + ' ' + bboxFin[1] +'';

      c = '%2300aa00';
      name = 'BBOX Layer';
    } else {
      if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG[0] && ExternalUtilities.rigaSelezionataMG[0].SQUARE_SNAP) {
        // logConsole('clb: 2');
        ss = ExternalUtilities.rigaSelezionataMG[0].SQUARE_SNAP;
        ss = ExternalUtilities.effettuaReplace(ss, ',', '\\,');
        ss = ExternalUtilities.effettuaReplace(ss, '#', '%23');
        if (ss.toUpperCase().indexOf('POLYGON((') === -1) {
          ss = 'POLYGON((' + ss;
          cePolygon = false;
        }
        while (ss.indexOf(',') > -1) {
          ss = ss.replace(',', '|');
        }
  
        c = ExternalUtilities.rigaSelezionataMG[0].COLOR;
        c = ExternalUtilities.effettuaReplace(c, ',', '\\,');
        c = ExternalUtilities.effettuaReplace(c, '#', '%23');

        let n = ExternalUtilities.rigaSelezionataMG[0].NAME;
        n = ExternalUtilities.effettuaReplace(n, ',', '\\,');
        n = ExternalUtilities.effettuaReplace(n, '#', '%23');

        name = n;
      } else {
        if (ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG && ExternalUtilities.rigaSelezionataMG['SQUARE_SNAP']) {
          // logConsole('clb: 3');
          ss = ExternalUtilities.rigaSelezionataMG['SQUARE_SNAP'];
          ss = ExternalUtilities.effettuaReplace(ss, ',', '\\,');
          ss = ExternalUtilities.effettuaReplace(ss, '#', '%23');
          if (ss.toUpperCase().indexOf('POLYGON((') === -1) {
            ss = 'POLYGON((' + ss;
            cePolygon = false;
          }
    
          c = ExternalUtilities.rigaSelezionataMG['COLOR'];
          c = ExternalUtilities.effettuaReplace(c, ',', '\\,');
          c = ExternalUtilities.effettuaReplace(c, '#', '%23');

          let n = ExternalUtilities.rigaSelezionataMG['NAME'];
          n = ExternalUtilities.effettuaReplace(n, ',', '\\,');
          n = ExternalUtilities.effettuaReplace(n, '#', '%23');

          name = n;
        } else {
          if (ExternalUtilities.bboxMaschera[this.NumeroFrame2]) {
            // logConsole('clb: 4');
            // logConsole('clb: ', ExternalUtilities.bboxMaschera[this.NumeroFrame2])
            bboxFin = ExternalUtilities.bboxMaschera[this.NumeroFrame2];

            ss += bboxFin[0] + ' ' + bboxFin[1] +'\\,';
            ss += bboxFin[2] + ' ' + bboxFin[1] +'\\,';
            ss += bboxFin[2] + ' ' + bboxFin[3] +'\\,';
            ss += bboxFin[0] + ' ' + bboxFin[3] +'\\,';
            ss += bboxFin[0] + ' ' + bboxFin[1] +'';
      
            c = '%2300aa00';
            name = 'BBOX Layer';
          } else {
            // logConsole('clb: 5');
            bboxFin = '';
          }
        }
      }
    }
    if (cePolygon === false) {
      ss += '))';
    } */

    bboxFin = this.bboxImpostataNelFrame; // ExternalUtilities.bboxMaschera[this.NumeroFrame2];
    // logConsole('clb: ', bboxFin);

    if (bboxFin) {
      ss = 'POLYGON((' + ss;
      ss += bboxFin[0] + ' ' + bboxFin[1] +'\\,';
      ss += bboxFin[2] + ' ' + bboxFin[1] +'\\,';
      ss += bboxFin[2] + ' ' + bboxFin[3] +'\\,';
      ss += bboxFin[0] + ' ' + bboxFin[3] +'\\,';
      ss += bboxFin[0] + ' ' + bboxFin[1] +'';
      ss += '))';    

      c = '%2300aa00';
      name = 'BBOX Layer';

      while (ss.indexOf(',') > -1) {
        ss = ss.replace(',', '|');
      }
      while (ss.indexOf('\\,') > -1) {
        ss = ss.replace('\\,', '|');
      }
      while (ss.indexOf('%23') > -1) {
        ss = ss.replace('%23', '');
      }

      if (c) {
        while (c.indexOf('#') > -1) {
          c = c.replace('#', '');
        }
        while (c.indexOf('%23') > -1) {
          c = c.replace('%23', '');
        }
      }
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Geometry: ComboSelArea', this.comboSelArea2);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Geometry: bboxFin ', bboxFin);

    this.removeLayerFromMap('Path Layer BBOX', this.pathLayerBBOX[this.NumeroFrame2]);

    if (!bboxFin || bboxFin === '') {
      // bboxFin = this.prendeBBOXSoloValori(this.map1[this.NumeroFrame2]);
      // alert('esco');
      // logConsole('clb: esco');
      return;
    }
    // alert('proseguo: ' + bboxFin);

    if (bboxFin && bboxFin.length > 0) {
      let tipologia = '';
      if (+this.comboSelArea2 === 1) {
        tipologia = 'zoomed_map';
      } else {
        tipologia = 'selected_area';
      }

      /* while (ss.indexOf(',') > -1) {
        ss = ss.replace(',', '|');
      }
      while (c.indexOf('#') > -1) {
        c = c.replace('#', '');
      } */

      // alert('GEOMETRY SU FRAME');

      const nomeLayer = 'Geo_ANTS:l_geometry';
      const parametri = 'cntx_id:\'' + this.sessionID2 + '\';' +
        'v_geo_label:\'' + name + '\';' +
        'v_geo_type:\'' + tipologia + '\';' +
        'v_geo_geometry:\'' + ss + '\';' +
        'v_geo_color:\'' + c + '\';'; // +
        // 'v_chi_mi_chiama:\'frame\';';

      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'LAYER BBOX:', this.NumeroFrame2, parametri);

      const parameters = {
        LAYERS: nomeLayer,
        TILED: false,
        STYLES: 's_geometry',
        VIEWPARAMS: parametri
        // 'CQL_FILTER': act_set + tmsFilter + ' and act_id in (' + act_id + ')'
      };

      /* if (this.lastParametri === JSON.stringify(parameters)) {
        return;
      }
      this.lastParametri = JSON.stringify(parameters); */

      /* if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Geometry: ', JSON.stringify(parameters));
      }
      if (this.lastGeometry === JSON.stringify(parameters)) {
        return;
      }
      this.lastGeometry = JSON.stringify(parameters);
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Geometry: Disegno layer');
      } */

      const wms = new ImageWMS({
        ratio: 1, // immagine grande quanto la mappa (default 1.5 = 2,25x i pixel)
        url: this.Utils.indirizzoGEOServer + this.urlWms,
        projection: 'EPSG:4326',
        // renderer: 'antialias: true;',
        params: parameters,
        serverType: 'geoserver',

        // Sovrascrivere l'URL per evitare la cache
        imageLoadFunction: (image, src) => {
          const timestamp = new Date().getTime();
          const noCacheUrl = src + (src.includes('?') ? '&' : '?') + 'nocache=' + timestamp;
          const noCacheUrl2 = ExternalUtilities.converteBBoxDentroChiamataWMS(this, noCacheUrl);
          image.getImage()['src'] = noCacheUrl2;
        }
      });

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, wms);
        const newWms = new ImageLayer({
          source: wms
        });

      /* if (this.pathLayerBBOX[this.NumeroFrame2]) {
        this.pathLayerBBOX[this.NumeroFrame2].setSource(newWms);
      } else { */
        this.addLayerToMap(newWms, 4, 'Layer BBOX');
        this.pathLayerBBOX[this.NumeroFrame2] = newWms;
      /*  } */
    }
  }

  // LAYERS NON MODIFICATI
  // layerbbox - qui sopra
  // l_geo_event

  fAddToActSet(e) {
    this.righeSelezionatePerActSet = e;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.showActSet = true;
  }

  chiudiMascheraAS() {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Chiudo maschera ActSet');
    this.showActSet = false;
  }

  /* cambiaTitoloFrame(e) {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Cambio titolo frame', e);
      this.frameName2 = e;
      this.frameNameEmit.emit(e);
    }, 100);
  } */

  selectShowAdditionalLayers(e) {
    this.showAdditionalLayers2 = e;
    this.showAddLayersEmit.emit(e);
    this.additional_Layer.disegnaAddLayers(this);
  }

  checkEdge(event) {
    this.Utils.edge = event;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'edge:', event);
  }

  effettuaAnimazione(diffX, diffY) {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Disegno overlay coordinate', this.NumeroFrame2, 
        diffX, diffY, 'marker_' + this.NumeroFrame2 + '_' + this.frameAttivo2);
    // }
    // const extent = l.getExtent();
    // const diffY = (extent[2] - extent[0]) / 2;
    // const diffX = (extent[3] - extent[1]) / 2;
    // return;

    var pos = fromLonLat([diffX, diffY]);
    this.overlayGIF = new Overlay({
      position: pos,
      positioning: 'center-center',
      element: document.getElementById('marker_' + this.NumeroFrame2 + '_' + this.frameAttivo2),
      stopEvent: false
    });
    this.overlayGIF.element.hidden = false;
    try {
      if (this.map1[this.NumeroFrame2]) {
        this.map1[this.NumeroFrame2].addOverlay(this.overlayGIF);
      }
    } catch (e) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Errore add overlay: ', e);
    }
  }

  rimuoviAnimazione() {
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rimuovo overlay', this.NumeroFrame2, this.overlayGIF);
    // }

    if (this.overlayGIF) {
      try {
        // this.map1[this.NumeroFrame2].removeOverlay(this.overlayGIF);
        this.overlayGIF.element.hidden = true;
      } catch (e) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Errore remove overlay: ', e);
      }
    }
  }

  premutoExcelEventiCSV(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
  }

  premutoTastoDeleteActSet(e) {
    // Una sola copia, senza duplicare il DataTable originale che viene comunque sostituito
    this.datiGrigliaCheck = JSON.parse(JSON.stringify({ ...this.datiTcRun, DataTable: e }));
    this.modalitaCheckPopup = 'delete_actset';
    this.operazioneCheckPopup = 'Delete';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  confermaDeleteActSet(e) {
    if (e) {;
      this.arrayDelete = new Array();
      e.forEach(ee => {
        this.arrayDelete.push(ee);
      });
      if (this.arrayDelete.length > 0) {
        this.idxDelete = 0;
        this.eliminazioneFisicaActSet();
      }
    }
  }

  eliminazioneFisicaActSet() {
    const e = this.arrayDelete[this.idxDelete];

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, jsonString);

    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Ritorno scrittura', this.apiService.UpdateDashboard(jsonString));
    // this.apiService.UpdateDashboard(jsonString)
    const params = '{' +
      '"v_cntx": "' + this.sessionID2 + '",' +
      '"v_act_id": ' + e.GEO_ACT_ID + '' +
    '}';
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Funzione chiamata: geo_act__del', e, params)
    // return;

    this.apiService.chiamataPost(this.Utils, 'geo_act__del', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Create Act Set return:', data);
      if (+data2[0].v_err_code === 0) {
        this.idxDelete++;
        if (this.idxDelete < this.arrayDelete.length) {
          const tm = setTimeout(_ => {
            clearTimeout(tm);
            this.eliminazioneFisicaActSet()
          }, 10);
        } else {
          this.activities.caricaActivities(this);

          // this.LeggeActivities(this.savedActSetId);

          this.effettuaAutoFitLA = !this.effettuaAutoFitLA;
          // this.refreshEmit.emit(this.refresh);
        }
      } else {
        // alert(data[0].v_failure_reason);
        // this.mostraPopup('Error: ' + data2[0].v_failure_reason, false, '')
        ExternalUtilities.visualizzaAlert('Error: ' + data2[0].v_failure_reason);
      }
    }, error => {
      console.error('POST ERROR Act Del: ', error, error.message);
      // ExternalUtilities.visualizzaAlert(error);
    });
  }

  /* mostraPopup(Messaggio, Dialog, Cosa) {
    ExternalUtilities.visualizzaAlert(Messaggio);
    return;

    const dialogRef = this._matDialog.open(ConfermaComponent, {
      data: {
        messaggio: Messaggio,
        mostraAnnulla: Dialog
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      switch(Cosa) {

      }
      if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'The dialog was closed', result);
      }
      // this.animal = result;
    });
  } */

  onScrollGrafici(e) {
    if (e.srcElement.scrollTop > 0) {
      this.Utils.altezzaDivGrafici = e.srcElement.scrollTop;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Altezza div grafici', this.Utils.altezzaDivGrafici);
    }
  }

  refreshNPS(e, r) {
    if (r === true) {
      this.datiNPS = undefined;
    }
    this.lastCallTC[this.NumeroFrame2] = '';
    this.NPSComponent.caricaNPS(this);
  }

  refreshTcRun(e, r) {
    if (r === true) {
      this.datiTcRun= undefined;
    }
    this.lastCallTCRun[this.NumeroFrame2] = '';
    // alert('Pulizia 5');
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Carico TCRUN grid 3')
    // }
    this.staAttendendoTcRun === false;
    this.tcRunComponent.caricaTCRunGrid(this);
  }

  listaProcess;

  premutoProcess(e) {
    // Una sola copia, senza duplicare il DataTable originale che viene comunque sostituito
    this.datiGrigliaCheck = JSON.parse(JSON.stringify({ ...this.datiActivities, DataTable: e }));
    this.modalitaCheckPopup = 'process_activities';
    this.operazioneCheckPopup = 'Process';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  confermaProcess(e) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    // e.forEach(element => {
      this.listaProcess = e;
      this.premutoProcessElaborazione(0);
    // });
  }

  premutoProcessElaborazione(q) {
      const params = '{' +
        '"v_cntx": "' + this.sessionID2 + '",' +
        '"v_act_id": ' + this.listaProcess[q].GEO_ACT_ID + '' +
      '}';
      // if (this.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Funzione chiamata: geo_act__reproc', this.listaProcess[q], params)
      // }
      // return;

      this.apiService.chiamataPost(this.Utils, 'geo_act__reproc', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Create Act Set return:', data);
        if (+data2[0].v_err_code === 0) {
          q+=1
          if (q < this.listaProcess.length) {
            this.premutoProcessElaborazione(q);
          } else {
            this.listaProcess = undefined;
            this.lastCallActivities[this.frameAttivo2] = '';
            this.activities.caricaActivities(this);
          }
        } else {
          //this.mostraPopup('Error: ' + data2[0].v_failure_reason + '\nOn Act id ' + this.listaProcess[q].GEO_ACT_ID, false, '');
          ExternalUtilities.visualizzaAlert('Error: ' + data2[0].v_failure_reason + '\nOn Act id ' + this.listaProcess[q].GEO_ACT_ID);
        }
      }, error => {
        // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
        console.error('POST ERROR Act Reproc: ', error, error.message);
      });
  }

  selectPerc(p) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, p)
  }

  backToSelectedEmit(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su back to selected', e);
    /* this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Last evento clicked', this.lastEventoClicked);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e.Riga);
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.lastEventoClicked.Riga); */

    if (this.lastEventoClicked && this.lastEventoClicked.Riga) {
      const d1 = this.lastEventoClicked.Riga.tms; // new Date(e.Riga.tms).getTime();
      // const t1 = this.datePipe.transform(d1 , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

      // AppComponent.CambioTmsSelezionato(t1);
      // this.Utils.tmsSelezionato = t1;
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su synch', d1);
        
      // logConsole('Tms clickato su eventi per sincronia: ', d1);

      this.cambioTmsSelezionato.emit(d1 + ';premutoBackToSelect');

      // this.paginaEvents = this.lastEventoClicked.pagina;
      /* const tm = setTimeout(() => {
          clearTimeout(tm);
        this.spostamentoPaginaRilevato(this.lastEventoClicked);
      }, 1000); */
      /* const tm = setTimeout(() => {
          clearTimeout(tm);
        this.paginaEvents = this.lastEventoClicked.pagina;
      }, 2000); */
      /* const dove = +this.lastEventoClicked.Riga.ROW_ID;

      this.eventsComponent.prendeEvents(this, dove, true);
      this.offsetAe = dove;

      this.eventsComponent.prendeEvents(this, 0, false);
      this.idSelezionatoAE = this.lastEventoClicked.Riga.ROW_ID; */

      /* const tm = setTimeout(() => {
          clearTimeout(tm);
        this.eventsComponent.prendeEvents(this,  this.lastEventoClicked.Riga.ROW_ID, false);
      }, 1000); */
    } else {
      ExternalUtilities.visualizzaAlert('Please, select a message');
      // alert('please, select a message');
    }
  }

  excludeTimeRange() {
    const params = '{' +
      '"v_cntx": "' + this.sessionID2 + '",' +
      '"v_act_set_name_list": ' + this.actSetPerEsclusione + ',' +
      '"v_tms_min": ' + this.tmsMinPerEsclusione + ',' +
      '"v_tms_max": ' + this.tmsMaxPerEsclusione + ',' +
      '"v_edit": "excld"' +
    '}';
    // if (this.debug2 === true) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Funzione chiamata: geo_act__edit', params)
    // }
    // return;

    this.apiService.chiamataPost(this.Utils, 'geo_act__edit', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Create Act Set return:', data);
      if (+data2[0].v_err_code === 0) {
        this.refreshAccentratoreEmit.emit(new Date().toDateString());
      } else {
        // this.mostraPopup('Error: ' + data2[0].v_failure_reason, false, '');
        ExternalUtilities.visualizzaAlert('Error: ' + data2[0].v_failure_reason);
      }
    }, error => {
      // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
      console.error('POST ERROR Act Edit: ', error, error.message);
    });
  }

  includeTimeRange() {
    const params = '{' +
      '"v_cntx": "' + this.sessionID2 + '",' +
      '"v_act_set_name_list": ' + this.actSetPerEsclusione + ',' +
      '"v_tms_min": ' + this.tmsMinPerEsclusione + ',' +
      '"v_tms_max": ' + this.tmsMaxPerEsclusione + ',' +
      '"v_edit": "incld"' +
    '}';
    // if (this.debug2 === true) {
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Funzione chiamata: geo_act__edit', params)
    // }
    // return;

    this.apiService.chiamataPost(this.Utils, 'geo_act__edit', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data: any) => {
      // const data2 = JSON.parse(data);
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Create Act Set return:', data);
      if (+data[0].v_err_code === 0) {
        this.refreshAccentratoreEmit.emit(new Date().toDateString());
      } else {
        // this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
        alert('Error: ' + data[0].v_failure_reason);
      }
    }, error => {
      // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
      console.error('POST ERROR Act Edit: ', error, error.message);
    });
  }

  // TICKET
  LeggeDatiLookUpStatus() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_category": "TicketStatus"' +
    '}';
    this.apiService.chiamataPost(this.Utils, 'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiLookUpStatus = 'empty grid'; // null;
          ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
          // alert(data2.v_failure_reason);
        } else {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup status:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.datiLookUpStatus = data;
        }
      } else {
        this.datiLookUpStatus = 'empty grid'; // null;
      }
    }, error => {
      console.error('POST ERROR Lookup Grid: ', error, error.message);
      // ExternalUtilities.visualizzaAlert('Read look up status:' + error);
      
      // alert('Read look up status:' + error);
    });
  }

  LeggeDatiLookUpPriority() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_category": "TicketPriority"' +
    '}';
    this.apiService.chiamataPost(this.Utils,  'geo_lookup__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiLookUpPriority = 'empty grid'; // null;
          ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
          // alert(data2.v_failure_reason);
        } else {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lookup priority:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.datiLookUpPriority = data;
        }
      } else {
        this.datiLookUpPriority = 'empty grid'; // null;
      }
    }, error => {
        console.error('POST ERROR Lookup Grid: ', error, error.message);
        // ExternalUtilities.visualizzaAlert('Read look up priority:' + error);
    });
  }

  LeggeDatiOperator() {
    // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Leggo misure maschera');
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_group_name": null' +
    '}';
    this.apiService.chiamataPost(this.Utils,  'operator__grid', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
          this.datiOperatorGroup = 'empty grid'; // null;
          ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
        } else {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Operator:', data2);
          const data = data2; // [0].geo_measure_dfn__grid);
          // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Mesaures:', data);
          this.datiOperatorGroup = data;
        }
      } else {
        this.datiOperatorGroup = 'empty grid'; // null;
      }
    }, error => {
      // ExternalUtilities.visualizzaAlert('Read operator:' + error);
      console.error('POST ERROR Operator Grid: ', error, error.message);
    });
  }

  caricaDatiEditTicket() {
    if (!this.datiLookUpStatus) {
      this.LeggeDatiLookUpStatus();
    }
    if (!this.datiLookUpPriority) {
      this.LeggeDatiLookUpPriority();
    }
    if (!this.datiOperatorGroup) {
      this.LeggeDatiOperator();
    }
  }

  premutoTastoTicket(e) {
    if (!e) {
      return;
    }

    let rigaSelezionataPerTicket = e; // JSON.parse(e);

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fatto click su riga per il ticket', e);

    this.caricaDatiEditTicket();
    this.TitoloMascheraModificaMT = 'Edit Ticket';
    this.operazioneTicket = 'MODIFICA';

    let ok = false;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fatto click su riga per il ticket', e, this.datiTcRun.DataTable);
    this.datiTcRun.DataTable.forEach(element => {
      if (!ok && +element.ROW_ID === +rigaSelezionataPerTicket) {
        rigaSelezionataPerTicket = element;
        ok = true;
      }
    });

    this.rigaModificataTicket = JSON.parse(JSON.stringify(rigaSelezionataPerTicket));
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su edit ticket prima', this.rigaModificataTicket);

    if (this.rigaModificataTicket.TCK_STATUS === null || this.rigaModificataTicket.TCK_STATUS === 'null') {
      this.rigaModificataTicket.TCK_STATUS = 'Open';
    }
    if (this.rigaModificataTicket.TCK_PRIORITY === null || this.rigaModificataTicket.TCK_PRIORITY === 'null') {
      this.rigaModificataTicket.TCK_PRIORITY = '3 Low';
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su edit ticket dopo', this.rigaModificataTicket);
    this.vecchioValoreTicket = JSON.parse(JSON.stringify(this.rigaModificataTicket));

    this.mascheraModificaTicket = true;
  }

  /* editPremutoTicket(e) {
    this.caricaDatiEditTicket();
    this.TitoloMascheraModificaMT = 'Edit Ticket';
    this.operazioneTicket = 'MODIFICA';
    this.rigaModificataTicket = JSON.parse(JSON.stringify(this.selezioneTicket[0]));
    this.vecchioValoreTicket = JSON.parse(JSON.stringify(this.selezioneTicket[0]));
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su edit ticket', this.selezioneTicket);

    this.mascheraModificaTicket = true;
  }

  newPremutoTicket(e) {
    this.caricaDatiEditTicket();
    this.TitoloMascheraModificaMT = 'New Ticket';
    this.operazioneTicket = 'INSERIMENTO';

    const inizio = new Date();
    const datella = this.datePipe.transform(inizio , 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    this.rigaModificataTicket = {
      TCK_ID: '',
      ACT_ID: this.selezioneTicket[0].ACT_ID,
      START_TIME_STAMP: datella,
      TCK_OPERATOR_NAME_IN_CHARGE_TO: '',
      STATUS: '',
      TCK_TITLE: '',
      TCK_DESCRIPTION: '',
      TCK_PRIORITY: ''
    };
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su nuovo ticket', this.rigaModificataTicket);
    this.vecchioValoreTicket = JSON.parse(JSON.stringify(this.rigaModificataTicket));

    this.mascheraModificaTicket = true;
  } */

  salvaDatiTicket() {
    const nomeFunzione = 'ticket__ins';

    let operator = this.rigaModificataTicket.TCK_OPERATOR_NAME_IN_CHARGE_TO;
    if (!operator || operator === null || operator === 'null') {
      operator = '';
    }

    let testo = this.rigaModificataTicket.TCK_DESCRIPTION;    
    if (testo && testo !== null) {
      while (testo.indexOf('\n') > -1) {
        testo = testo.replace('\n', ' ');
      }
      while (testo.indexOf('"') > -1) {
        testo = testo.replace('"', ' ');
      }
    }

    const params = '{' +
        '"v_cntx": "' + this.sessionID2 + '",' +
        '"v_ticket_id": ' + this.rigaModificataTicket.TCK_ID + ',' +
        '"v_act_id": ' + this.rigaModificataTicket.ACT_ID + ',' +
        '"v_tms": "' + this.rigaModificataTicket.TMS + '",' +
        '"v_operator_name_in_charge_to": "' + operator + '",' +
        '"v_status": "' + this.rigaModificataTicket.TCK_STATUS + '",' +
        '"v_title": "' + this.rigaModificataTicket.TCK_TITLE + '",' +
        '"v_description": "' + testo + '",' +
        '"v_event_row_id_linked": null,' +
        '"v_dashboard_id": null,' +
        '"v_priority": "' + this.rigaModificataTicket.TCK_PRIORITY + '" ' + // +
      '}';
    // '"v_event_list": ' + this.rigaModificataTicket.TCK_EVENT_LIST + ' ';
    // logConsole('Scrittura valori: ', params);

    const params2 = JSON.parse(params);
    let eventi = JSON.stringify(this.rigaModificataTicket.TCK_EVENT_LIST);
    if (eventi) {
      while (eventi.indexOf('"') > -1) {
        eventi = eventi.replace('"', '*V*');
      }
    }
    params2["v_event_list"] = eventi ? eventi : null;
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Params', params2)
    // }

    this.apiService.chiamataPost(this.Utils, '' + nomeFunzione, params2)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      // // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Lista lookup:', data2);
      if (data2 && data2 !== null) {
        // this.caricaTicket();
        this.refreshTcRun(null, false);
        this.mascheraModificaTicket = false;
      } else {
      }
    }, error => {
        console.error('POST ERROR ' + nomeFunzione + ': ', error, error.message);
        // ExternalUtilities.visualizzaAlert('Ticket operation:' + error);
    });

  }

  selectOperator(e) {
    if (e) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      this.rigaModificataTicket.TCK_OPERATOR_NAME_IN_CHARGE_TO = e.NAME;
    }
  }

  selectStatus(e) {
    if (e) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      this.rigaModificataTicket.TCK_STATUS = e.VALUE_STR;
    }
  }

  selectPriority(e) {
    if (e) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
      this.rigaModificataTicket.TCK_PRIORITY = e.VALUE_STR;
    }
  }

  chiudeMascheraTicket() {
    if (JSON.stringify(this.vecchioValoreTicket) !== JSON.stringify(this.rigaModificataTicket)) {
      if (confirm('do you want to lose the changes made?')) {
        this.mascheraModificaTicket = false;
      }
    } else {
      this.mascheraModificaTicket = false;
    }
  }

  premutoWorkSpaceTcRunGrid(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    // return;

    let activitySetName = '';
    let start = '';
    let stop ='';
    let tI;
    let tF;

    activitySetName = this.rigaSelezionataTcRun.ACT_SET_NAME;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.rigaSelezionataTcRun);
    // return;
    start = this.rigaSelezionataTcRun.START_TIME_STAMP_SELECTED;
    stop = this.rigaSelezionataTcRun.END_TIME_STAMP_SELECTED;

    // tI = new Date().getTime() - (24 * 60 * 60 * 1000);
    // tF = new Date().getTime();

    // start = this.datePipe.transform(start, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    // stop = this.datePipe.transform(stop, 'yyyy-MM-dd HH:mm:ss', 'UTC');

    const nuovoNome = 'temp [' + this.operatorID + ']';

    if (start !== null ) { start = '"' + start + '"'; }
    if (stop !== null ) { stop = '"' + stop + '"'; }

    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_obj_type": "geo_analysis",' +
      '"v_obj_name": "' + e.NAME + '",' +
      '"v_obj_name_new": "' + nuovoNome + '",' +
      '"v_activityset_name": "' + activitySetName + '",' +
      // '"v_activityset_act_set_type": "' + '' + '",' +
      '"v_timerangedsfstart": ' + start + ',' +
      '"v_timerangedsfstop": ' + stop + '' +
    '}';
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'operator_obj_my__copy', params);
    // return;

    this.apiService.chiamataPost(this.Utils, 'operator_obj_my__copy', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      if (data2) {
        // Creato il temporaneo va caricato GeoAnalysis con il relativo url
        localStorage.removeItem('lastWorkspace');
        this.changePage('Mappe;Mappe', nuovoNome, true);
      }
    }, error => {
      // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
      console.error('POST ERROR Obj My Copy: ', error, error.message);
    });
  }

  ritornaNomeApp(c) {
    const campi = c.split(';');
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Passaggio a progetto ' + campi[0] + ', maschera: ' + campi[1]);

    let dove = '';
    switch (campi[0]) {
      case 'DD':
        dove = 'DataDictionaries';
        break;
      case 'FM':
        dove = 'FleetManager';
        break;
      case 'SY':
        dove = 'System';
        break;
      case 'UM':
        dove = 'UserManager';
        break;
      case 'Mappe':
        dove = 'Mappe';
        break;
      case 'Home':
        dove = 'HomePage';
        break;
    }

    let funzione = '';
    switch (campi[1]) {
      case 'Mappe':
        funzione = 'Home';
        break;
      case 'TC':
        funzione = 'Test Campaigns';
        break;
      case 'AGD':
        funzione = 'Agent Group Definition';
        break;
      case 'AGC':
        funzione = 'Agent Group Configuration';
        break;
      case 'AGPL':
        funzione = 'Agent Profiles Library';
        break;
      case 'QPL':
        funzione = 'QueryPCK Library';
        break;
      case 'TDL':
        funzione = 'Test Design Library';
        break;
      case 'DTUM':
        funzione = 'Drive Test Units Mng';
        break;
      case 'SAM':
        funzione = 'Single Agent Mode';
        break;
      case 'Antenna':
        funzione = 'Antenna';
        break;
      case 'Cluster':
        funzione = 'Cluster';
        break;
      case 'PLMN':
        funzione = 'PLMN';
        break;
      case 'Users':
        funzione = 'Users';
        break;
      case 'Groups':
        funzione = 'User Groups';
        break;
      case 'UP':
        funzione = 'User Profiles';
        break;
      case 'SC':
        funzione = 'System Configuration';
        break;
      case 'EV':
        funzione = 'Event Viewer';
        break;
      case 'SM':
        funzione = 'System Monitor';
        break;
      case 'ETLM':
        funzione = 'Activities Loading Monitor';
        break;
      case 'DBO':
        funzione = 'DB Ojects';
        break;
      case 'SESS':
        funzione = 'Session Monitor';
        break;
    }

    const cc = new Array();
    cc.push(dove);
    cc.push(funzione);
    cc.push(campi[0]);
    cc.push(campi[1]);

    return cc;
  }

  cripta(s) {
    const x = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Stringa:', s);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Codice random:', x);
    let rit = x + ';';
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rit 1:', rit);
    for (let i = 0; i < s.length; i++) {
      let a = s.charCodeAt(i);
      a += (x + i);
      rit += a +';';
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rit ' + i + ':', rit);
    }
    for (let i = 0; i <= 5; i++) {
      const x = Math.floor(Math.random() * (255 - 1 + 1)) + 1;
      rit += x +';';
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Rit ' + (i + 100) + ':', rit);
    }
    rit += s.length + ';';

    return rit;
  }

  changePage(url, altro, newPage) {
    const campiOrig = url.split(';');
    const campi = this.ritornaNomeApp(url);

    let ancora = '';
    if (altro && altro !== '') {
      ancora = ',"altro": "' + altro + '"'
    }

    const passaggio = '{ ' +
      '"sess": "' + this.sessionID2 + '", ' +
      '"gname": "' + this.groupName + '", ' +
      '"uname": "' + this.userName + '", ' +
      '"form": "' + campi[3] + '", ' +
      '"FS": "false"' +
      ancora +
    '}';
    const pass = this.cripta(passaggio);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, passaggio);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, pass);
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, UtilsInterna.decripta(pass));
    // return;

    let addr = this.urlRoot;

    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      // addr = 'http://localhost:4200';
      addr = 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/Mappe';
      campi[0] = '';
    }

    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, addr + campi[0] + '/?par=' + pass); // sess=' + this.sessionID2 +
                                                        // '&gname=' + this.operatorGroupName +
                                                        // '&uname=' + this.userName +
                                                        // '&form=' + campiOrig[1] +
                                                        // '&FS=' + this.fullScreen);
    const doveURL = addr + campi[0] + '/?par=' + pass; // + '/?sess=' + this.sessionID2 +
                                      //                   '&gname=' + this.operatorGroupName +
                                      //                   '&uname=' + this.userName +
                                      //                   '&form=' + campiOrig[1] +
                                      //                   '&FS=' + this.fullScreen;
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, doveURL);
    // return;
    // window.location.href = doveURL;
    // const ww = window.open(doveURL, '_blank');
    if (newPage) {
      const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, url2);
      const ww = window.open(doveURL, '_blank');
    } else {
      location.assign(doveURL);
    }
  }

  /* effettuaScreenShotFrame() {
    this.captureService.getImage(this.elementView.nativeElement, true).then(img=>{
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, img);
    })
  } */

  righeSelezionateTcRun;

  premutoTastoDeleteTCrun(e) {
    // Una sola copia, senza duplicare il DataTable originale che viene comunque sostituito
    this.datiGrigliaCheck = JSON.parse(JSON.stringify({ ...this.datiTcRun, DataTable: e }));
    this.modalitaCheckPopup = 'delete_tcrun';
    this.operazioneCheckPopup = 'Delete';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  confermaDeleteTcRun(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.righeSelezionateTcRun = e;
    this.deleteTcRun(0);
  }

  deleteTcRun(q) {
    // return;
    // tc_run__del(v_cntx text, v_tc_run_code text)


    const params = '{' +
      '"v_cntx": "' + this.sessionID2 + '",' +
      '"v_tc_run_code": "' + this.righeSelezionateTcRun[q].TC_RUN_CODE + '"' +
    '}';

    this.apiService.chiamataPost(this.Utils, 'tc_run__del', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      if (data2) {
        if (+data2[0].v_err_code === 0) {
          q++;
          if (q < this.righeSelezionateTcRun.length) {
            this.deleteTcRun(q);
          } else {
            this.staAttendendoTcRun === false;
            this.caricaTcRunGrid('DeleteTcRun');
          }
        } else {
          ExternalUtilities.visualizzaAlert(data2[0].v_failure_reason);
        }
      }
    }, error => {
      // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
      console.error('POST ERROR TC Run Del: ', error, error.message);
    });
  }

  apriGrigliaMisureTC() {
    // ExternalUtilities.visualizzaAlert('ppp');
  }

  listaIncExc = undefined;

  includeClick(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Include', e);

    this.listaIncExc = e;
    let nomeActSet = this.act_set;

    this.chiamaIncExc(nomeActSet, 'incld', 0);
  }

  excludeClick(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Exclude', e);

    this.listaIncExc = e;
    let nomeActSet = this.act_set;

    this.chiamaIncExc(nomeActSet, 'excld', 0);
  }

  chiamaIncExc(nomeActSet, Come, q) {
    const element = this.listaIncExc[q];
    const params = '{' +
      '"v_cntx": "' + this.sessionID2 + '",' +
      '"v_act_set_name": "' + nomeActSet + '",' +
      '"v_geo_act_id": "' + element.GEO_ACT_ID + '",' +
      '"v_mode": "' + Come + '"' +
    '}';

    this.apiService.chiamataPost(this.Utils, 'geo_act_set_rec_excld__upd', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      if (data2) {
        if (+data2.err_code === 0) {
          q+=1;
          if (q < this.listaIncExc.length) {
            this.chiamaIncExc(nomeActSet, Come, q);
          } else {
            this.lastCallActivities[this.NumeroFrame2] = '';
            this.activities.caricaActivities(this);
          }
        } else {
          ExternalUtilities.visualizzaAlert(data2.failure_reason);
        }
      }
    }, error => {
      // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
      console.error('POST ERROR Excld Upd: ', error, error.message);
    });
  }

  selezioneRigaIsto(e) {
    this.checkPartitionLabel(e);
  }

  controllaRitornoChiamata(t, dataP, chiamante) {
    const data = dataP;
    // const chiSono = 'F' + t.NumeroFrame2 + ';P' + t.frameAttivo2;

    let chiSono = '';

    switch(chiamante) {
      case 'Arfcn':
        chiSono = t.chiSonoArfcn[t.NumeroFrame2];
        break;
      case 'ArfcnAM':
        chiSono = t.chiSonoArfcnAM[t.NumeroFrame2];
        break;
      case 'ArfcnPoint':
        chiSono = t.chiSonoArfcnPoint[t.NumeroFrame2];
        break;
      case 'TC Run Grid':
        chiSono = t.chiSonoTcRun[t.NumeroFrame2];
        break;
      case 'Sample Cross Pareto':
        chiSono = t.chiSonoPareto[t.NumeroFrame2];
        break;
      case 'Sample Cross Scatter':
        chiSono = t.chiSonoScatter[t.NumeroFrame2];
        break;
      case 'Sample Cross Istogrammi':
        chiSono = t.chiSonoIstogrammi[t.NumeroFrame2];
        break;
      case 'Eventi':
        chiSono = t.chiSonoEventi[t.NumeroFrame2];
        break;
      case 'Cluster Rec':
        chiSono = t.chiSonoClusterGrid[t.NumeroFrame2];
        break;
      case 'Area Info':
        chiSono = t.chiSonoAreaInfo[t.NumeroFrame2];
        break;
      case 'Act Grid 1':
        chiSono = t.chiSonoActivities[t.NumeroFrame2];
        break;
      case 'Legenda':
        chiSono = t.chiSonoLegenda[t.NumeroFrame2];
        break;
      case 'Act Grid 2':
        chiSono = t.chiSonoClickA[t.NumeroFrame2];
        break;
      case 'CellMeasures':
        chiSono = t.chiSonoCM[t.NumeroFrame2];
        break;
      case 'MistralGrid':
        chiSono = t.chiSonoMC[t.NumeroFrame2];
        break;
      case 'MistralFlow':
        chiSono = t.chiSonoMF[t.NumeroFrame2];
        break;
      case 'MistralRBCIXL':
        chiSono = t.chiSonoMR[t.NumeroFrame2];
        break;
    }

    if (chiSono === '') {
      if (t.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata nulla ' + chiamante);
      }

      return false;
    }

    if (data && data.v_caller_tag) {
      const ritorno = data.v_caller_tag;
      if (ritorno !== chiSono) {
        if (t.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata diversa ' + chiamante, chiSono, ritorno);
        }
        // nomeRondella = false;
        return false;
      } else {
        if (t.debug2 === true) {
          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata uguale ' + chiamante, chiSono, ritorno);
        }
        return true;
      }
    } else {
      if (t.debug2 === true) {
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: nessun codice di ritorno ' + chiamante);
      }

      return true;
    }
  }

  clickSuComboMisura(e) {
    // alert('W pippo baudo');
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su combo misura', e);
    // }
    // { Selezionato: this.numeroSelezionato[riga], Precedente: valorePrecedente, Misura: misura }
    /* if (e.Selezionato > 0) {
      let misura = '';
      this.measureData2.forEach(element => {
        if (misura === '' && element.DISPLAY_NAME === e.Misura) {
          misura = element.CODE;
        }
      });
      ExternalUtilities.misureGlobali[e.Selezionato - 1] = misura;
    } else {
      ExternalUtilities.misureGlobali[e.Precedente - 1] = '';
    } */
    // ExternalUtilities.misureGlobali = e.Tutte;

    /* ExternalUtilities.misureGlobali = ['', '', '', '', '', ''];

    let ok = false;
    e.Tutte.forEach(element => {
      const quale = +(element.VALORE);
      this.measureData2.forEach(element2 => {
        if (!ok && element2.MEASR_CODE === element.MEASR_CODE) {
          ExternalUtilities.misureGlobali[quale] = element.MEASR_CODE;
          ok = false;
        }
      });
    }); */

    const misureGlobaliMappa = ['', '', '', '', ''];
    if (e && e.Tutte) {
      if (e.Tutte && e.Tutte.length > 0) {
        // let i = 0;
        e.Tutte.forEach(element => {
          if (element.VALORE !== undefined || element.VALORE === 0) {
            const numero = element.VALORE - 1;
            misureGlobaliMappa[numero] = element.MEASR_CODE;
            // i++;
          }
        });
      }

      ExternalUtilities.misureGlobali = misureGlobaliMappa;
      this.inviaMisure(misureGlobaliMappa, 'ClickComboMisura');

      // logConsole('Misure globali', ExternalUtilities.misureGlobali);

      this.measureDataEmit.emit(e.Tutte);

      // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure globali impostate', ExternalUtilities.misureGlobali);
      // }

      this.ridisegnaGraficiEmit.emit(new Date().toString());
    }
  }

  prendeJsonTicket(e) {
    let ritorno = 0;

    if (e && e.TCK_EVENT_LIST && e.TCK_EVENT_LIST !== null && e.TCK_EVENT_LIST !== '') {
      // const ee = JSON.parse(e.TCK_EVENT_LIST);
      if (typeof(e.TCK_EVENT_LIST) === 'object' && e.TCK_EVENT_LIST.length !== undefined) {
        // Object array
        ritorno = e.TCK_EVENT_LIST.length;
      } else {
        if (typeof(e.TCK_EVENT_LIST) === 'object' && e.TCK_EVENT_LIST.length === undefined) {
          // Object singolo
          ritorno = 1;
        } else {
          if (typeof(e.TCK_EVENT_LIST) === 'string' && e.TCK_EVENT_LIST !== '') {
            // Stringa
            let ee = e.TCK_EVENT_LIST;
            if (ee.indexOf('*V*') > -1) {
              while (ee.indexOf('*V*') > -1) {
                ee = ee.replace('*V*', '"');
              }
            }
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, ee.substr(1, 1));
            while (ee.substr(0, 1) === '"' || ee.substr(0,1) === ' ') {
              ee = ee.substr(1, ee.length);
            }
            while (ee.substr(ee.length - 1, ee.length) === '"' || ee.substr(ee.length - 1, ee.length) === ' ') {
              ee = ee.substr(0, ee.length - 1);
            }
            ee = ee.trim();
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, ee);
            try {
              ee = JSON.parse(ee);
              ritorno = ee.length;
            } catch (e1) {
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Error in JSON convert: ', ee);
              ritorno = 0;
            }
          } else {
            // Non Ã¨ ne stringa ne object
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e.TCK_EVENT_LIST, typeof(e.TCK_EVENT_LIST));
          }
        }
      }
    }

    return ritorno;
  }

  attivaDebug() {
    this.debug2 = true
    ExternalUtilities.modalitaDebug = true;
  }

  disattivaDebug() {
    this.debug2 = false;
    ExternalUtilities.modalitaDebug = false;
  }

  cambiateMisureTCRUN(e) {
    this.misureAddizionaliTCRUN2 = e;
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Misure addizionali tcrun modificate', this.misureAddizionaliTCRUN2);
    // }
    this.misureAddizionaliTCRUNEmit.emit(e);
    // this.caricaTcRunGrid();
  }

  clickSelezioneListaA(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su selezione lista agent', e);

    let ok = false;
    if (e && e.ROW_ID) {
      this.checkPartitionLabel(e);
      this.selezioneAgent[this.NumeroFrame2] = e;
      this.selezioneAgentID[this.NumeroFrame2] = e.ROW_ID;
      ok = true;
    } else {
      if (e && e[0] && e[0].ROW_ID) {
        this.checkPartitionLabel(e[0]);
        this.selezioneAgent[this.NumeroFrame2] = e[0];
        this.selezioneAgentID[this.NumeroFrame2] = e[0].ROW_ID;
        ok = true;
      }
    }

    // this.deselezionateTutteLeRigheAE(e);
    if (ok) {
      this.eventsComponent.prendeListaAgents(this); //  , this.offsetAe // 21/07/2025 per mail 26=706/2025 10:03

      this.eventsComponent.prendeEvents(this, false, false, false);
    } else {
      console.error('Click su lista agents non ha ritornato valori validi: ', e);
    }
  }

  cambiataHeightChart(e) {
    if (e && e !== null) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su height chart', e);

      let ok = false;

      if (e.id) {
        this.heightChart2 = e.id;
        this.heightChartEmit.emit(e.id);
        ok = true;
      } else {
        if (e) {
          this.heightChart2 = e;
          this.heightChartEmit.emit(e);
          ok = true;
        }
      }

      if (ok) {
        this.accentratore(true, 'HEIGHT CHART');
      }
    }
  }

  selectShowMultiSelect(e) {
    this.multiselectColumn = e;
    // if (this.debug2 === true) {
      this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su multi select column:', e);
    // }
    this.accentratore(true, "SELECT MULTI SELECT");
  }

  scrollGrafici(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
  }

  /* arrayPerReport;

  apreReportXls() {
    this.posizioneFinestraReport = 10;

    const act_set = ExternalUtilities.prendeActivitySceltaGrafici(this, this.Utils);
    const array2 = new Array();
        
    if (this.exportOnlyDisplayedMeasures === true) {
      this.Measure.forEach(element => {
        if (element && element !== '') {
          if (element === 'global_measure' && element.indexOf('global_measure_') === -1) {
            if (this.Utils.globalMeasure) {
              this.measureData2.forEach(element2 => {
                if (element2.CODE === this.Utils.globalMeasure.MEASR_CODE) {
                  array2.push(element2.CODE.replace('"', '').replace('"', ''));
                }
              })
            }
          } else {
            if (element.indexOf('global_measure_') > -1) {
              const indice = +(element.replace('global_measure_', ''));
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Indicie: ', indice, ExternalUtilities.misureGlobali)
              if (indice && indice > 0) {
                if (ExternalUtilities.misureGlobali && ExternalUtilities.misureGlobali[indice - 1] !== '') {
                  array2.push(ExternalUtilities.misureGlobali[indice - 1]);
                }
              }
            } else {
              array2.push(element);
            }
          }
        }
      });
    } else {
      array2.push('ALL');
    }
    this.arrayPerReport = array2;

    this.reportXls = true;
  }

  syncAttivo = false;
  posizioneFinestraReport = 10;

  gestisceSyncAttivo(e) {
    this.syncAttivo = e;
  }

  chiudeReportXLS() {
    if (!this.syncAttivo) {
      this.reportXls = false;
    } else {
      this.posizioneFinestraReport = 150;
    }
  } */

  testoDatiGrafici;

  clickete2(e) {

  }

  generaToolTip(t, e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Tooltip', e.dataPoint);
    
    const tm = setTimeout(() => {
          clearTimeout(tm);
      const tipiHistogrammiTutto: any[] = [
        { id: 'S0', name: 'Count' },
        { id: 'S1', name: 'Count 100%' },
        { id: 'N9', name: 'Count Distinct' },
        { id: 'N0', name: 'Avg' },
        { id: 'N1', name: 'Avg/Min/Max' },
        { id: 'N2', name: 'Avg/Count' },
        { id: 'N3', name: 'Avg/Min/Max/Count' },
      ];

      const misure = new Array();
      t.misureIstogrammi.forEach(element => {
        if (element && element !== null) {
          let tipologia = '';
          let nomeMisura = '';
          t.measureData.forEach(element2 => {
            if (element2.CODE === element) {
              tipologia = element2.TYPE;
              nomeMisura = element2.DISPLAY_NAME;
            }
          });
          misure.push({
            NomeMisura: nomeMisura,
            CodiceMisura: element,
            Tipologia: tipologia
          });
        }
      });

      let inizio = '';
      let ele = '';
      let aCapo = '';
      let ele2 = '';
      let ele3 = '';
      let value = '';
      let altriValori = '';
      let element = '';
      const qualeMisura = 1;

      if (t.eventsMeasure2 === true) {
        inizio = 'Event'
      }

      // ele = ': ' + e.dataPoint.YLabel + '<br />';

      let modalita = '';
      let tipologia = misure[qualeMisura].Tipologia === '1' ? 'NUM' : 'STR';

      if (misure[qualeMisura].Tipologia === '1') {
        if (t.eventsMeasure2 === false) {
          t.Utils.tipiHistogrammiNUM.forEach(element3 => {
            if (modalita === '' && element3.id === t.histDisplayAs2[2]) {
              modalita = element3.name;
            }
          });
        } else {
          tipiHistogrammiTutto.forEach(element3 => {
            if (modalita === '' && element3.id === t.histDisplayTutto2[2]) {
              modalita = element3.name;
            }
          });
        }
      } else {
        if (t.eventsMeasure2 === false) {
          t.Utils.tipiHistogrammiSTR.forEach(element3 => {
            if (modalita === '' && element3.id === t.histDisplayAs2[2]) {
              modalita = element3.name;
            }
          });
        } else {
          tipiHistogrammiTutto.forEach(element3 => {
            if (modalita === '' && element3.id === t.histDisplayTutto2[2]) {
              modalita = element3.name;
            }
          });
        }
      }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, misure, t.measureData2, modalita, tipologia);

      if (modalita.toUpperCase().indexOf('SEVERITY') === -1) {
        if (tipologia !== 'STR') {
          altriValori += '<br />avg: ' + e.dataPoint.avgF;
          altriValori += '<br/>min: ' + e.dataPoint.minF + ', max: ' + e.dataPoint.maxF + ' ';
          altriValori += '<br />p25: ' + e.dataPoint.p25F + ', p50: ' + e.dataPoint.p50F + ', p75: ' + e.dataPoint.p75F + ' ';
          altriValori += '<br/>sr: ' + e.dataPoint.srF + '';
          altriValori += '<br />sum: ' + e.dataPoint.sumF + ' ';
          altriValori += '<br />count: ' + e.dataPoint.CountF + ' ';
        } else {
          altriValori += '<br />Perc: ' + e.dataPoint.percF + '';
          altriValori += '<br />count: ' + e.dataPoint.CountF + '';
        }
      } else {
        altriValori += '<br />Perc: ' + e.dataPoint.percF + '';
        ele += ': ' + e.dataPoint.severityF + '<br />';
      }
    
      if (misure && misure[1] && misure[1].NomeMisura && misure[1].NomeMisura.toUpperCase().trim() !== 'NONE') {
        ele += misure[1].NomeMisura + ': ' + e.dataPoint.YLabel + '<br />';
      } else {
        aCapo = '';
      }
      if (misure && misure[0] && misure[0].NomeMisura && misure[0].NomeMisura.toUpperCase().trim() !== 'NONE') {
        ele2 = misure[0].NomeMisura + ': ' + e.dataPoint.labelPerTooltip;
      }
      if (misure && misure[2] && misure[2].NomeMisura && misure[2].NomeMisura.toUpperCase().trim() !== 'NONE') {
        ele3 = misure[2].NomeMisura + ': ' + e.dataPoint.chartF + '<br />'
      }

      t.testoDatiGrafici = inizio +
        ' ' + ele3 +
        ' ' + ele +
        ' ' + aCapo +
        ele2 +
        value +
        ' ' +
        altriValori;

      t.datiGrafici = true;
    }, 100);
  }

  controllaNascondiNomi(i) {
    if (!this.nomiFrames2[i]) {
      if (this.editMode2 === true) {
        this.nomiFrames2[i] = '<empty>';
      }
    }

    /* if (this.nonNascondereCampi) {
      return true;
    } else { */
      let ok = true;
      if (this.editMode2 === true || this.modalitaDebug2) {
        // // logConsole('0-Controllo frames ' + this.NumeroFrame2 + '-' + i + ':' + this.nomiFrames2[i] + ' - Edit: ' + this.editMode2);
        ok = true;
      } else {
        if (!this.nomiFrames2[i] || this.nomiFrames2[i].indexOf('[hidden]') > -1) {
          // // logConsole('1-Controllo frames ' + this.NumeroFrame2 + '-' + i + ':' + this.nomiFrames2[i] + ' - Edit: ' + this.editMode2);
          ok = false;
        } else {
          if (this.nomiFrames2[i].indexOf('[' + this.paginaSelezionata2 + ']') > -1 || 
            (+i) == +this.paginaSelezionata2) {
              // // logConsole('2-Controllo frames ' + this.NumeroFrame2 + '-' + i + ':' + this.nomiFrames2[i] + ' - Edit: ' + this.editMode2);
              ok = true;
          } else {
            // // logConsole('3-Controllo frames ' + this.NumeroFrame2 + '-' + i + ':' + this.nomiFrames2[i] + ' - Edit: ' + this.editMode2);
            ok = false;
          }
        }
      }
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'frame ' + this.NumeroFrame2 + ' attivo ' + this.paginaSelezionata2 + '. i = ' + i);
      return ok;
    // }
  }

  dimensioneTcRun1 = 100;
  dimensioneTcRun2 = 0;
  mascheraTcRunVisibile = false;

  aperturaTcRunInfo() {
    if (this.dimensioneTcRun1 === 50) {
      this.dimensioneTcRun1 = 100;
      this.dimensioneTcRun2 = 0;
      this.mascheraTcRunVisibile = false;
    } else {
      this.dimensioneTcRun1 = 50;
      this.dimensioneTcRun2 = 50;
      this.mascheraTcRunVisibile = true;
    }
  }

  clickOnMap = function(t, evt) {
    const ora = new Date().getTime();
    if (ora - t.ultimaVoltaClickOnMap > 1000) {
      t.ultimaVoltaClickOnMap = ora;

      if (t.modalitaDrawPolygon) {
        let ok = false;
        t.map1[t.NumeroFrame2].forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
          if (!ok && layer !== null) {
            // logConsole('Layer', layer, layer.state_.zIndex);
            if (layer.state_.zIndex === 19) {
              // Controllo se lo zIndex è 19 (Vector di tipo DrawPolygon). E' l'unico modo che h trovato per gestire il click
              t.creaStringaPolygon();            
            } else {
              const {left, top} = t.elementView.nativeElement.getBoundingClientRect();
              t.posizioneXPL = left;
              t.posizioneYPL = top; //  - 64;
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Piantina: Coordinate: ', left, top, t.elementView.nativeElement);

              t.visibileMascheraPL = true;
              t.fattoClickSuPlanimetria = true;

              ok = true;
            }
          }
        });
        if (!ok) {
          t.visibileMascheraPL = false;
          t.fattoClickSuPlanimetria = false;
          // t.planimetry.pulisceInteraction(t);
        } else {
          return;
        }
      } else {
        // alert('Click su mappa: Differenza: ' + (ora - t.ultimaVoltaClickOnMap) + ' Click su planimetria: ' + t.fattoClickSuPlanimetria);
        
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CLICK SU MAPPA 1', t.NumeroFrame2, evt, t.wms[t.NumeroFrame2]);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CLICK SU MAPPA 2',t.showRaysAllLayer2);
        t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CLICK SU MAPPA 3',t.overviewZoom2);

        const coord = evt.coordinate; // transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

        if (t.showRaysAllLayer2 === undefined || t.showRaysAllLayer2 === null || t.showRaysAllLayer2 === true) {
          t.showRaysAllLayerC.disegnaAllLayers(t, coord, 'ClickOnMap');
        }

        if (t.overviewZoom2 === true) {
          t.impostaCenterPosition.emit(coord);

          /* t.centroImpostatoEmit.emit({
            daChi: t.NumeroFrame2, 
            funzione: 'ClickOnMap', 
            centro: coord, 
            zoom: t.zoomImpostatoNelFrame,
            tipoMappa: t.overviewZoom2
          }); */
        }
        t.impostaTimeCursorPosition.emit(coord);

        if (t.eseguitoInProgetto2 === true) {
          const tm = setTimeout(() => {
            clearTimeout(tm);
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Coordinate clickate: ', c);
            t.coordinateDaClickSuMappa.emit(coord);
          }, 100);
          return;
        }

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Fatto click su mappa del frame', t.NumeroFrame, t.ActivityName2, t.slaName2);
        t.Utils.ActivitySetDelPuntoClickato = t.ActivityName2;
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'PPP:', t.Utils.ActivitySetDelPuntoClickato);
        if (t.Utils.ActivitySetDelPuntoClickato === '<All>') {
          t.Utils.ActivitySetDelPuntoClickatoPerScritta = t.listaActivityImpostate[1].NAME;
        } else {
          t.Utils.ActivitySetDelPuntoClickatoPerScritta = t.Utils.ActivitySetDelPuntoClickato;
        }

        t.Utils.activitySceltaStampa = ExternalUtilities.stringaAGNoACT;

        t.Utils.SlaDelPuntoClickato = t.slaName2;

        ExternalUtilities.frameCheHaClickatoSullaMappa = t.NumeroFrame2;

        // if (!t.globalView2 || t.globalView2 === true) {
        const viewResolution = t.viewMappaAttuale.getResolution();
        const viewProjection = t.viewMappaAttuale.getProjection();
        
        /*
        let q = 0;
        let layerMosaico = -1;
        let layerCluster = -1;
        let layerPath = -1;

        t.wms[t.NumeroFrame2].forEach(element => {
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
          if (element && element !== null && element.params_ && element.params_ !== null &&
            element.params_.LAYERS && element.params_.LAYERS !== null) {          
            if (element.params_.LAYERS.toString().toUpperCase().indexOf('_MOSAIC') > -1 && layerMosaico === -1) {
              layerMosaico = q;
            }
            if (element.params_.LAYERS.toString().toUpperCase().indexOf('_CLUSTER') > -1 && layerCluster === -1) {
              layerCluster = q;
            }
            if (element.params_.LAYERS.toString().toUpperCase().indexOf('L_ACT_PATH_POINT') > -1 && layerPath === -1) {
              layerPath = q;
            }
          /* } else {
            if (element && element !== null && element.Name) {    
              if (element.Name === 'LayerBoxPlanimetria') {
                t.visibileMascheraPL = true;
                t.fattoClickSuPlanimetria = true;      
              }
            } * /
          }
          q++;
        });

        if (layerMosaico > -1) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CLICK MAPPA. Rilevato mosaico ', layerMosaico, t.wms[t.NumeroFrame2][layerMosaico]);

          t.prendePuntoMosaico(coord);
        }

        if (layerCluster > -1) {
          t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CLICK MAPPA. Rilevato cluster ', layerCluster, t.wms[t.NumeroFrame2][layerCluster]);

          t.prendePuntoCluster(t, t.wms[t.NumeroFrame2][layerCluster], evt.coordinate, viewResolution, viewProjection);
        } */

        /* if (layerPath > -1) {
          if (t.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK MAPPA. Rilevato path ', layerPath, t.wms[t.NumeroFrame2][layerPath]);
          }
        }

        if (t.isCheckedShowPaths2 === true) {
          // Se il path non Ã¨ visualizzato non devo andare a leggere le feature anche se ci sono
          if (t.debug2 === true) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK MAPPA. Hide Path = true');
          }
          return;
        }

        if (layerPath === -1) {
          return;
        } */

        t.prendePuntoPath(evt.coordinate);

        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Spostamento mappa', evt.coordinate);
        const coordinate = evt.coordinate; // this.map1[this.NumeroFrame2].getEventCoordinate(event);
        const rotation = t.viewMappaAttuale.getRotation();
        t.coordinateCambiateConClick.emit(coordinate);
        t.rotationCambiata.emit(rotation);

        // t.showRaysAllLayerC.disegnaAllLayers(t, coordinate, false);

        /* const url = t.wms[t.NumeroFrame2][layerPath].getFeatureInfoUrl(
          evt.coordinate,
          viewResolution,
          viewProjection,
          { INFO_FORMAT: 'application/json', FEATURE_COUNT: '500' }
        );
        fetch(url)
        .then(function (response) { return response.text(); })
        .then(async function (html) {
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'GET FEATURES', JSON.parse(html));
        }); */
        // return;

        // if (t.wms[t.NumeroFrame2][layerPath] !== undefined && t.wms[t.NumeroFrame2][layerPath] !== null) {
          // if (t.lastHttp === undefined || t.lastHttp === null) {
          //   t.lastHttp = '';
          // }
          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, t.wms[t.NumeroFrame2]);

          // t.wms[t.NumeroFrame2].forEach(element => {
          //   this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, element);
          // });

          //Finally fit the map's view to our combined extent

          /* ExternalUtilities.layersRilevati = new Array();
          t.map1[t.NumeroFrame2].getLayers().forEach(function(layer) {
            // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, layer);
            ExternalUtilities.layersRilevati.push(layer);
          }); */

          return;
        /*
        t.wms[t.NumeroFrame2].forEach(element => {
          if (element && element !== null) {
            const url = element.getFeatureInfoUrl(
              evt.coordinate,
              viewResolution,
              viewProjection,
              { INFO_FORMAT: 'application/json', FEATURE_COUNT: '500' }
            );
            if (t.debug2 === true) {
              t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CLICK MAPPA DOPO', element, url);
            }

            if (url) {
              // conta++;
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Per misura ' + i + ', url:', url);
              // quantiInviati++;

              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, url);

              fetch(url)
              .then(function (response) { return response.text(); })
              .then(async function (html) {
                // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, html);
                // try {
                if (html.toUpperCase().indexOf('ERROR:') === -1) {
                  // const hh = t.downloadFile.converteTextPlainToJSON(html);
                  let hh = undefined;
                  try {
                    hh = JSON.parse(html);
                  } catch (e) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), true, 'Errore di parse', html);
                  }
                  // if (t.debug2 === true) {
                    t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'CLICK MAPPA. Ritorno ', hh);
                  // }

                  if (hh && hh.numberReturned === 0) {
                    // Nessuna feature ritornata. Imposto il punto direttamente
                    /* if (t.overviewZoom2 === true) {
                      if (t.map1[t.NumeroFrame2]&& t.viewMappaAttuale) {
                        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Click su mappa senza feature', evt);
                        const coordinate = evt.coordinate_; //  t.map1[t.NumeroFrame2].getEventCoordinate(evt);
                        const rotation = t.viewMappaAttuale.getRotation();
                        t.coordinateCambiateConClick.emit(coordinate);
                        t.rotationCambiata.emit(rotation);
                        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, rotation);
                      }
                    } * /
                  } else {
                    if (hh) {
                      t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Click su mappa con feature', hh);

                      /* let ok = false;
                      let q = 0;
                      let primaAct;
                      const activity_rilevate = new Array();
                      let primoValore = null;
                      hh.features.forEach(element => {
                        const act_selezionata = element.properties.geo_act_name;
                        if (primoValore === null) {
                          primoValore = element.properties;
                          primaAct = act_selezionata;
                        }
                        let ok2 = false;
                        activity_rilevate.forEach(element2 => {
                          if (element2.geo_act_name === act_selezionata) {
                            ok2 = true;
                          }
                        });
                        if (ok2 === false) {
                          activity_rilevate.push(element.properties);
                          q++;
                        }
                        if (t.debug2 === true) {
                          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK MAPPA. Activity su click:', act_selezionata, ExternalUtilities.stringaAGNoACT);
                        }
                        if (ok === false && act_selezionata === ExternalUtilities.stringaAGNoACT) {
                          if (t.debug2 === true) {
                            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK MAPPA. Trovata activity su click:', act_selezionata);
                          }
                          // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, hh);
                          t.elaboraPuntoClickato(element.properties);
                          ok = true;
                        }
                      });
                      if (ok === false) {
                        // ExternalUtilities.messaggioDiErrore(t, 'Non trovata');
                        if (t.debug2 === true) {
                          this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK MAPPA. Activity rilevate', activity_rilevate, q, activity_rilevate.length);
                        }
                        if (q > 0) {
                          if (q === 1) {
                            if (t.debug2 === true) {
                              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK MAPPA. Activity NON trovata su click:', primoValore);
                              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK MAPPA. Imposto activity:', primaAct);
                            }
                            ExternalUtilities.stringaAGNoACT = primaAct;
                            t.elaboraPuntoClickato(primoValore);
                          } else {
                            if (t.debug2 === true) {
                              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'CLICK MAPPA. Apro scelta activity:', t.Activity2, activity_rilevate);
                            }
                            t.clickESceltaAGNoACT.emit(t.Activity2 + 'Â§' + JSON.stringify(activity_rilevate));
                          }
                        }
                      } * /
                    // } else {
                    //    ExternalUtilities.messaggioDiErrore(t, 'nessuna feature selezionata');
                    }
                  }
                } else {
                  t.debug2 && t.Log?.scriveLog(t, t.debug2, t.Log.getMethodName(), false, 'Click MAPPA Ritorno con errore:', html);
                }
              });
            } else {
              // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'nessun punto rilevato 1');
            }
          }
        });
      // } else {
        // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'nessun punto rilevato 2');


        */
      }
    } else {
      // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'nessun punto rilevato 3');
    }
  };

  spostamentoX = 0.00005;

  aumentaXPos() {
    this.datiPlanimetria.move_x += this.spostamentoX;

    this.planimetry.aggiornaDati(this);
  }

  diminuisceXPos() {
    this.datiPlanimetria.move_x -= this.spostamentoX;

    this.planimetry.aggiornaDati(this);
  }

  aumentaYPos() {
    this.datiPlanimetria.move_y += this.spostamentoX;

    this.planimetry.aggiornaDati(this);
  }

  diminuisceYPos() {
    this.datiPlanimetria.move_y -= this.spostamentoX;

    this.planimetry.aggiornaDati(this);
  }

  aumentaXScale() {
    this.datiPlanimetria.scale_x += (this.datiPlanimetria.scale_x * 10 / 100);

    this.planimetry.aggiornaDati(this);
  }

  diminuisceXScale() {
    this.datiPlanimetria.scale_x -= (this.datiPlanimetria.scale_x * 10 / 100);

    this.planimetry.aggiornaDati(this);
  }

  aumentaYScale() {
    this.datiPlanimetria.scale_y += (this.datiPlanimetria.scale_y * 10 / 100);

    this.planimetry.aggiornaDati(this);
  }

  diminuisceYScale() {
    this.datiPlanimetria.scale_y -= (this.datiPlanimetria.scale_y * 10 / 100);

    this.planimetry.aggiornaDati(this);
  }

  aumentaRotation() {
    this.datiPlanimetria.rotation += 1;

    this.planimetry.aggiornaDati(this);
  }

  diminuisceRotation() {
    this.datiPlanimetria.rotation -= 1;

    this.planimetry.aggiornaDati(this);
  }

  aumentaAlpha() {
    this.datiPlanimetria.alpha += .05;

    this.planimetry.aggiornaDati(this);
  }

  diminuisceAlpha() {
    this.datiPlanimetria.alpha -= .05;

    this.planimetry.aggiornaDati(this);
  }

  aumentaContrast() {
    this.datiPlanimetria.contrast += .5;

    this.planimetry.aggiornaDati(this);
  }

  diminuisceContrast() {
    this.datiPlanimetria.contrast -= .5;

    this.planimetry.aggiornaDati(this);
  }

  refreshExportH(r) {

  }

  refreshPointMeasures(r) {
    if (r === true) {
      this.datiPointMeasures = undefined;
    }
    this.lastCallPI[this.NumeroFrame2] = '';
    this.pointComponent.prendePointMeasures(this, this.Utils.tmsSelezionato, false, 'RefreshAggiornaTmsSelezionato');
  }

  refreshAP(r) {
    if (r === true) {
      this.datiArfcnPoint = undefined;
    }
    this.lastCallAP[this.NumeroFrame2] = '';
    this.arfcnPoint.caricaArfcnPoint(this, this.Utils.tmsSelezionato, false, 'RefreshAggiornaTmsSelezionato');
  }

  refreshAgents(r) {
    if (r === true) {
      this.datiAgents = undefined;
    }
    this.lastCallLista[this.NumeroFrame2] = '';
    this.eventsComponent.prendeListaAgents(this); //  , this.offsetAe
  }

  refreshActivityEvents(r, caricaDettaglio) {
    if (r === true) {
      this.datiPointActivityEvents = undefined;
    }
    this.lastCallCrossTab[this.NumeroFrame2] = '';

    this.eventsComponent.prendeEvents(this, false, caricaDettaglio, false); //  , this.offsetAe
  }

  refreshEventSummary(r) {
    if (r === true) {
      this.datiEventSummary = undefined;
    }
    this.lastCallES[this.NumeroFrame2] = '';
    this.eventsComponent.caricaEventSummary(this);
  }

  refreshPointLayerInfo(r) {
    const coordinate = this.coordinateDaImpostareConClick;
    if (coordinate) {
      if (r === true) {
        this.datiPointLayerInfo = undefined;
      }
      this.lastCallPLI[this.NumeroFrame2] = '';
      this.pointLayerInfo.prendePointLayerInfo(this, coordinate);
    }
  }

  refreshPointCellMeasures(r) {
    if (r === true) {
      this.datiPointCellMeasures = undefined;
    }
    this.lastCallPointCM[this.NumeroFrame2] = '';
    this.pointCellMeasures.prendePointCellMeasures(this);
  }

  refreshAreaInfo(r) {
    if (r === true) {
      this.datiAreaInfo = undefined;
    }
    this.lastCallAreaInfo[this.NumeroFrame2] = '';
    this.areaInfoComponent.disegnaAreaInfo(this);
  }

  refreshArfcn(r) {
    if (r === true) {
      this.datiArfcn = undefined;
    }
    this.lastCallArfcn[this.NumeroFrame2] = '';
    this.arfcnComponent.disegnaArfcn(this);
  }

  refreshArfcnAM(r) {
    if (r === true) {
      this.datiArfcnAM = undefined;
    }
    this.lastCallArfcnAM[this.NumeroFrame2] = '';
    this.arfcnComponent_am.disegnaArfcn(this);
  }

  refreshPointMeasureDFN(r) {
    if (r === true) {
      this.datiPointMeasureDFN = undefined;
    }
    this.lastCallMeasureDFN[this.NumeroFrame2] = '';
    this.measureDFNComponent.disegnaMeasureDFN(this);
  }

  refreshMosaicGrid(r) {
    const tm = setTimeout(() => {
      clearTimeout(tm);

      if (r === true) {
        this.datiMosaicGrid = undefined;
      }
      this.lastCallMosaicGrid[this.NumeroFrame2] = '';
      this.mosaicGrid.disegnaMosaicGrid(this);
    }, 100);
  }

  refreshDatiClusterGrid(r) {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      if (r === true) {
        this.datiClusterGrid = undefined;
      }
      this.lastCallClusterGrid[this.NumeroFrame2] = '';
      this.clusterGrid.disegnaClusterGrid(this);
    }, 100);
  }

  refreshCellMeasure(r) {
    if (r === true) {
      this.datiCellMeasure = undefined;
    }
    this.lastCallCM[this.NumeroFrame2] = '';
    this.cellMeasure.caricaCellMeasure(this, 'RefreshCellMeasures');
  }

  refreshMistralCDR(r) {
    if (r === true) {
      this.datiMistralCDR = undefined;
    }
    this.lastCallMC[this.NumeroFrame2] = '';
    this.mistral_grid.caricaMC(this, 'RefreshMC');
  }

  refreshMistralMF(r) {
    if (r === true) {
      this.datiMistralFS = undefined;
    }
    this.lastCallMF[this.NumeroFrame2] = '';
    this.mistral_flow.caricaMF(this, 'RefreshMF');
  }

  refreshCdrData(r) {
    if (r === true) {
      this.datiCdrData = undefined;
      this.datiCdrDataD = undefined;
    }
    this.lastCallCDData[this.NumeroFrame2] = '';
    this.cdrData.caricaCDRData(this);
  }

  refreshCdrSummary(r) {
    if (r === true) {
      this.datiCdrSummary = undefined;
      this.datiCdrVoice = undefined;
    }
    this.lastCallCDVoice[this.NumeroFrame2] = '';
    this.cdrVoice.caricaCDRVoice(this);
  }

  fPausaAutorun(e) {
    this.pausaRealTimeAttiva = e;
    if (e === true) {
      this.Utils.tmsInizioPausa = this.Utils.tmsInizio;
      this.Utils.tmsFinePausa = this.Utils.tmsFine;
    }
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Pausa autorun:', e);
  }

  clickSuComboMisuraDFN(e) {
    // // logConsole('Misure selezionate', e);

    const misureGlobaliMappa = ['', '', '', '', '', ''];
    if (e.Tutte.length > 0) {
      // let i = 0;
      e.Tutte.forEach(element => {
        const numero = element.VALORE - 1;
        misureGlobaliMappa[numero] = element.MEASR_CODE;
        // i++;
      });
    }
    this.misureGlobaliMappa[this.NumeroFrame2] = misureGlobaliMappa;
    
    // TOLTA QUESTA SEZIONE IN QUANTO INTERFERISCE COL PASSAGGIO DELLE MISURE GLOBALI DEL CONTEXT
    // ExternalUtilities.misureGlobali = e.Tutte;
    // logConsole('Misure globali impostate: ', e, ExternalUtilities.misureGlobali);

    // this.measureDataEmit.emit(e.Tutte);

    // this.ridisegnaGraficiEmit.emit(new Date().toString());
    // TOLTA QUESTA SEZIONE IN QUANTO INTERFERISCE COL PASSAGGIO DELLE MISURE GLOBALI DEL CONTEXT

    this.ridisegnaMappaEmit.emit(misureGlobaliMappa);
  }

  // Necessario per la stampa delle mappe
  printFrame() {
    const data = new Date();

    const sData = data.getUTCFullYear().toString() + 
        ((data.getUTCMonth() + 1).toString().trim().length === 1 ? '0' + (data.getUTCMonth() + 1).toString().trim() : (data.getUTCMonth() + 1).toString().trim()) + 
        (data.getUTCDate().toString().trim().length === 1 ? '0' + data.getUTCDate().toString().trim() : data.getUTCDate().toString().trim()) + '_' +
        (data.getUTCHours().toString().trim().length === 1 ? '0' + data.getUTCHours().toString().trim() : data.getUTCHours().toString().trim()) +
        (data.getUTCMinutes().toString().trim().length === 1 ? '0' + data.getUTCMinutes().toString().trim() : data.getUTCMinutes().toString().trim()) +
        (data.getUTCSeconds().toString().trim().length === 1 ? '0' + data.getUTCSeconds().toString().trim() : data.getUTCSeconds().toString().trim()); 
    const nomeFile = 'Frame_' + this.NumeroFrame2 + '_' + this.frameAttivo2 + '_' + this.frameName2 + '_' + sData + '.png';

    let captureElement: HTMLElement;
    if (this.MappaOGrafico2 === 'M') {
      const nomeMappa = 'frameM_' + this.NumeroFrame2 + '_' + this.frameAttivo2;
      captureElement = document.getElementById(nomeMappa);      
      // logConsole('Print frame M: ', nomeMappa, captureElement);
    } else {
      const nomeFrame = "#myDivCont_" + this.NumeroFrame2;
      captureElement = document.querySelector(nomeFrame);
      // logConsole('Print frame: ', nomeFrame, captureElement);

      // I grafici delle misure vengono creati solo quando entrano in vista: per la stampa servono tutti
      if (this.MappaOGrafico2 === 'MC') {
        this.graficiComponent.creaTuttiIGraficiInAttesa(this);
      }
    }

    html2canvas(captureElement, {
    }).then((canvas) => {
      const tm = setTimeout(() => {
          clearTimeout(tm);
        // logConsole('Print frame canvas: ', canvas);

        const imageData = canvas.toDataURL("image/png", 1.0);
    
        const link = document.createElement("a");
        link.setAttribute("download", nomeFile);
        link.setAttribute("href", imageData);
        link.click();
      }, 2000);
    });

    return;

    if (this.MappaOGrafico2 === 'M') {
      // const nomeImmagine = 'mapPrinted_' + this.NumeroFrame2 + '_' + this.frameAttivo2;
      // const mapCopy = document.getElementById(nomeImmagine);
      const nomeMappa = 'frameM_' + this.NumeroFrame2 + '_' + this.frameAttivo2;
      const mappa = document.getElementById(nomeMappa);      
      html2canvas(mappa).then((canvas) => {
        // logConsole('Canvas convertito ' + nomeMappa, canvas);
        /* mapCopy['src'] = canvas.toDataURL("image/jpeg", 1.0);
        // logConsole('Canvas convertito ' + nomeMappa + '. Nome Immagine', nomeImmagine); */
        
        const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
        
        const link = document.createElement("a");
        link.setAttribute("download", nomeFile);
        link.setAttribute("href", image);
        link.click();
        
        // mapCopy.style.display='block';
      });
    } else {
      html2canvas(captureElement, {
      }).then((canvas) => {
        const imageData = canvas.toDataURL("image/png", 1.0);
    
        const link = document.createElement("a");
        link.setAttribute("download", nomeFile);
        link.setAttribute("href", imageData);
        link.click();
      });
    }
  }
  // Necessario per la stampa delle mappe

  /*  */

  rigaPremuta(e) {
    // // logConsole('Premuto su json', e);

    /* const r = JSON.parse(JSON.stringify(e));
    r.Path = JSON.parse(JSON.stringify(r.PathCompleto));
    r.PathCompleto = undefined; */

    // logConsole('Premuto su json', e.Path);
  }

  ricercaJson = '';

  passaggioRicercaJson(e) {
    this.ricercaJson = e;
    // logConsole('Passaggio ricerca json', e);
  }

  ritornoRicercaJson(e) {
    this.refreshActivityEvents(false, true);
  }

  dimeJsonWindow;

  onResized(e) {
    // // logConsole('Resize json: ', e);
    const dimensioneNuova = e.newRect.height;
    this.dimeJsonWindow = dimensioneNuova;
  }

  /* controllaMappaPerZoom() {
    const tm = setTimeout(() => {
          clearTimeout(tm);
      let zoom;
      if (this.map1[this.NumeroFrame2]) {
        zoom = this.map1[this.NumeroFrame2].getView().getZoom();
        this.zoomImpostatoNelFrame = zoom;
        this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO ULTIMO ZOOM 1', this.NumeroFrame2, zoom);
      } else {
        let q = 0;
        const t = setInterval(() => {
          if (this.map1[this.NumeroFrame2]) {
            zoom = this.map1[this.NumeroFrame2].getView().getZoom();
            clearInterval(t);
            this.zoomImpostatoNelFrame = zoom;
            this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO ULTIMO ZOOM 2', this.NumeroFrame2, zoom);
          } else {
            q++;
            if (q > 10) {
              clearInterval(t);
              zoom = 10;
              this.zoomImpostatoNelFrame = zoom;
              this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'IMPOSTO ULTIMO ZOOM 3', this.NumeroFrame2, zoom);
            }
          }
        }, 1000);
      }
    }, 100);
  } */

  dimensioniSplitTcRun2;
  impostazioniPivot2 = undefined; /* {
    columns: [],
    rows: [],
    formatSettings: [],
    values: [],
    expandAll: false,
    filters: [],
    filterSettings: [],
    fieldMapping: [],
    groupSettings: [],
    conditionalFormatSettings: [],
    excludeFields: []
  }; */

  cambioDimensioniTcRun2(e) {
    // logConsole('Nuove dimensioni frame tcrun', e);
    this.dimensioniSplitTcRun2 = e;
    this.dimensioniSplitTcRunEmit.emit(e);
  }

  fListaCampiEmit(e) {
    this.listaCampiTCRP2 = undefined;
    const tm = setTimeout(() => {
          clearTimeout(tm);
      this.listaCampiTCRP2 = e;
      // logConsole('Nuova field list', e);
    }, 10);
    this.listaCampiTCRPEmit.emit(e);
  }

  fTipoDatiLayout(e) {    
    this.tipoDatiLayout2 = e;
    const tm1 = setTimeout(() => {
          clearTimeout(tm1);
      const appo = this.dimensioniSplitTcRun2;
      this.dimensioniSplitTcRun2 = undefined;
      const tm = setTimeout(() => {
          clearTimeout(tm);
        this.dimensioniSplitTcRun2 = appo;
      }, 100);
    }, 1000);
    this.tipoDatiLayoutEmit.emit(e);
  }

  passaggioImpostazioniPivot(e) {
    if (e) {
      // logConsole('Passaggio impostazioni frame', e);
      this.impostazioniPivot2 = e;
      this.impostazioniPivotEmit.emit(e);
    }
  }

  /* cambioDimensioneContenitorePivot_fake = '';
  TitoloPivot_fake = 'Pivot Test';
  act_set_fake = '[ACT SET] FW BA 4G 06-03-24';
  tmsMin_fake = "2024-03-06 07:57:01.000";
  tmsMax_fake = "2024-03-06 12:02:07.000";
  tmsGlobaleMin_fake = "2024-03-06 07:57:01.000";
  tmsGlobaleMax_fake = "2024-03-06 12:02:07.000";
  listaCampiAttuale_fake = [
        {
            "DIM": "Y",
            "CODE": "act_edit",
            "VIEW": "N",
            "FOLDER": "9 Test",
            "ROW_ID": 61,
            "TYPE_STR": "string",
            "RELEVANCE": "1 Highest",
            "FILTER_MAX": "",
            "FILTER_MIN": "",
            "DESCRIPTION": "incld/excld to include exclude these seconds from the analysis. Use commands in time-chart to include exclude the selected interval",
            "MEASURE_AVG": "N",
            "MEASURE_MAX": "N",
            "MEASURE_MIN": "N",
            "DISPLAY_NAME": "Edit",
            "DIM_ICON_NAME": "N.png",
            "VIEW_ICON_NAME": "N.png",
            "MEASURE_DIM_STEP": "",
            "FILTER_VALUE_LIST": "N"
        },
        {
            "DIM": "N",
            "CODE": "struct_ts_sched_id",
            "VIEW": "Y",
            "FOLDER": "9 Test",
            "ROW_ID": 257,
            "TYPE_STR": "string",
            "RELEVANCE": "1 Highest",
            "FILTER_MAX": "",
            "FILTER_MIN": "",
            "DESCRIPTION": "Test Scenario Id",
            "MEASURE_AVG": "N",
            "MEASURE_MAX": "N",
            "MEASURE_MIN": "N",
            "DISPLAY_NAME": "TsSchedId",
            "DIM_ICON_NAME": "N.png",
            "VIEW_ICON_NAME": "N.png",
            "MEASURE_DIM_STEP": "",
            "FILTER_VALUE_LIST": "N"
        },
        {
            "DIM": "Y",
            "CODE": "o,TcName",
            "VIEW": "N",
            "FOLDER": "Default",
            "ROW_ID": 236,
            "TYPE_STR": "string",
            "RELEVANCE": "3 Low",
            "FILTER_MAX": "",
            "FILTER_MIN": "",
            "DESCRIPTION": null,
            "FIELD_COUNT": 3556,
            "IN_DATA_SET": "Y",
            "MEASURE_AVG": "N",
            "MEASURE_MAX": "N",
            "MEASURE_MIN": "N",
            "DISPLAY_NAME": "o,TcName",
            "DIM_ICON_NAME": "N.png",
            "VIEW_ICON_NAME": "N.png",
            "DISPLAY_NAME_FRM": null,
            "MEASURE_DIM_STEP": "",
            "FILTER_VALUE_LIST": "",
            "MEASURE_AVG_ICON_NAME": "N.png",
            "MEASURE_MAX_ICON_NAME": "N.png",
            "MEASURE_MIN_ICON_NAME": "N.png"
        },
        {
            "DIM": "Y",
            "CODE": "o,TpName",
            "VIEW": "N",
            "FOLDER": "Default",
            "ROW_ID": 254,
            "TYPE_STR": "string",
            "RELEVANCE": "3 Low",
            "FILTER_MAX": "",
            "FILTER_MIN": "",
            "DESCRIPTION": null,
            "FIELD_COUNT": 3556,
            "IN_DATA_SET": "Y",
            "MEASURE_AVG": "N",
            "MEASURE_MAX": "N",
            "MEASURE_MIN": "N",
            "DISPLAY_NAME": "o,TpName",
            "DIM_ICON_NAME": "N.png",
            "VIEW_ICON_NAME": "N.png",
            "DISPLAY_NAME_FRM": null,
            "MEASURE_DIM_STEP": "",
            "FILTER_VALUE_LIST": "",
            "MEASURE_AVG_ICON_NAME": "N.png",
            "MEASURE_MAX_ICON_NAME": "N.png",
            "MEASURE_MIN_ICON_NAME": "N.png"
        },
        {
            "DIM": "Y",
            "CODE": "o,band_list",
            "VIEW": "N",
            "FOLDER": "Default",
            "ROW_ID": 18,
            "TYPE_STR": "string",
            "RELEVANCE": "3 Low",
            "FILTER_MAX": "",
            "FILTER_MIN": "",
            "DESCRIPTION": null,
            "FIELD_COUNT": 2050,
            "IN_DATA_SET": "Y",
            "MEASURE_AVG": "N",
            "MEASURE_MAX": "N",
            "MEASURE_MIN": "N",
            "DISPLAY_NAME": "o,band_list",
            "DIM_ICON_NAME": "N.png",
            "VIEW_ICON_NAME": "N.png",
            "DISPLAY_NAME_FRM": null,
            "MEASURE_DIM_STEP": "",
            "FILTER_VALUE_LIST": "",
            "MEASURE_AVG_ICON_NAME": "N.png",
            "MEASURE_MAX_ICON_NAME": "N.png",
            "MEASURE_MIN_ICON_NAME": "N.png"
        },
        {
            "DIM": "N",
            "CODE": "o,ca_num_avg",
            "USED": "Y",
            "VIEW": "N",
            "FOLDER": "Default",
            "ROW_ID": 36,
            "TYPE_STR": "string",
            "RELEVANCE": "3 Low",
            "FILTER_MAX": "",
            "FILTER_MIN": "",
            "DESCRIPTION": null,
            "FIELD_COUNT": 1467,
            "IN_DATA_SET": "Y",
            "MEASURE_AVG": "Y",
            "MEASURE_MAX": "N",
            "MEASURE_MIN": "N",
            "DISPLAY_NAME": "o,ca_num_avg",
            "DIM_ICON_NAME": "N.png",
            "VIEW_ICON_NAME": "N.png",
            "DISPLAY_NAME_FRM": null,
            "MEASURE_DIM_STEP": "",
            "FILTER_VALUE_LIST": "",
            "MEASURE_AVG_ICON_NAME": "Y.png",
            "MEASURE_MAX_ICON_NAME": "N.png",
            "MEASURE_MIN_ICON_NAME": "Y.png"
        },
        {
            "DIM": "N",
            "CODE": "o,HttpDwl.FullSpeedBitrate",
            "VIEW": "N",
            "FOLDER": "Default",
            "ROW_ID": 97,
            "TYPE_STR": "string",
            "RELEVANCE": "3 Low",
            "FILTER_MAX": "",
            "FILTER_MIN": "",
            "DESCRIPTION": null,
            "FIELD_COUNT": 292,
            "IN_DATA_SET": "Y",
            "MEASURE_AVG": "Y",
            "MEASURE_MAX": "N",
            "MEASURE_MIN": "N",
            "DISPLAY_NAME": "o,HttpDwl.FullSpeedBitrate",
            "DIM_ICON_NAME": "N.png",
            "VIEW_ICON_NAME": "N.png",
            "DISPLAY_NAME_FRM": null,
            "MEASURE_DIM_STEP": "",
            "FILTER_VALUE_LIST": "",
            "MEASURE_AVG_ICON_NAME": "N.png",
            "MEASURE_MAX_ICON_NAME": "N.png",
            "MEASURE_MIN_ICON_NAME": "N.png"
        },
        {
            "DIM": "Y",
            "CODE": "o,act_id",
            "USED": "N",
            "VIEW": "N",
            "FOLDER": "Default",
            "ROW_ID": 4,
            "TYPE_STR": "string",
            "RELEVANCE": "3 Low",
            "FILTER_MAX": "",
            "FILTER_MIN": "",
            "DESCRIPTION": null,
            "FIELD_COUNT": 3556,
            "IN_DATA_SET": "Y",
            "MEASURE_AVG": "N",
            "MEASURE_MAX": "N",
            "MEASURE_MIN": "N",
            "DISPLAY_NAME": "o,act_id",
            "DIM_ICON_NAME": "N.png",
            "VIEW_ICON_NAME": "N.png",
            "DISPLAY_NAME_FRM": null,
            "MEASURE_DIM_STEP": "",
            "FILTER_VALUE_LIST": "",
            "TYPE_STR_ICON_NAME": "string.png",
            "MEASURE_AVG_ICON_NAME": "N.png",
            "MEASURE_MAX_ICON_NAME": "N.png",
            "MEASURE_MIN_ICON_NAME": "N.png"
        }
  ];

    resizePivotTest() {
      this.cambioDimensioneContenitorePivot_fake = new Date().toString();
    } */

  fGetTcRunFiles(e) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.righeSelezionateTcRun = e;
    this.getTcRunFiles(0);
  }

  getTcRunFiles(q) {
    const params = '{' +
      '"v_cntx_id": "' + this.sessionID2 + '",' +
      '"v_tc_run_code": "' + this.righeSelezionateTcRun[q].TC_RUN_CODE + '"' +
    '}';

    this.apiService.chiamataPost(this.Utils, 'ants_tc_run_exp_full_pending__set ', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      // const data2 = JSON.parse(data);
      if (data2) {
        if (+data2.err_code === 0) {
          q++;
          if (q < this.righeSelezionateTcRun.length) {
            this.getTcRunFiles(q);
          } else {
            this.lastCallTCRun[this.NumeroFrame2] = '';
            this.caricaTcRunGrid('GetTcRunFiles');
          }
        } else {
          ExternalUtilities.visualizzaAlert(data2.failure_reason);
        }
      }
    }, error => {
      // ExternalUtilities.messaggioDiErrore(t.datiActivities, error);
      console.error('POST ERROR TC Run Get Files: ', error, error.message);
    });
  }

  // TEMPLATES
  rigaEventoSelezionato;
  scatenaEventoPerRitornoJson;
  jsonRitornato;

  ritornaNuoveImpostazioniDaTemplate(e) {
    this.eventiSceltiES = e.eventiSceltiES;
    this.eventsMeasure2 = e.eventMeasure;
    this.filtriEventi2 = e.filtriEventi;
    this.isNonSyncEventTime2 = e.isNonSyncEventTime;
    this.listaEventiDaPassare = e.listaEventiDaPassare;
    this.listaEventiCheckatiES = e.listaEventiCheckatiES;
    this.listaEventiSEPassata = e.listaEventiSEPassata;
    this.timeFilter2 = e.timeFilter;
    this.tipoEvento2 = e.tipoEvento;
    this.ricercaJson = e.ricercaJson;
  
    this.refreshActivityEvents(false, true);
  }

  gestioneTemplate = false;
  templateSelezionato;
  tmsInizioEventi;
  tmsFineEventi;
  actEventiPerAI;
  tcRunPerAI;
  tipologiaFrame;
  visualizzaTastoSubmitAI = false;
  datiPassaggioTemplateAI;
  tcRunCode;
  tcRunFailure;

  apreGestioneTemplates(e, t, datiGriglia) {
    this.tipologiaFrame = t;
    this.prendeCallApi();
    this.gestioneTemplate = true;
    /* this.caricamentoEventiInCorso[this.NumeroFrame2] = true;
    const t1 = setTimeout(() => {
      clearTimeout(t1); 

      this.caricamentoEventiInCorso[this.NumeroFrame2] = false;
    }, 3000); */
    logConsole('Tipo frame', this.MappaOGrafico2);
    this.tcRunCode = '';
    if (this.MappaOGrafico2 === 'AE') {
      if (this.datiPointActivityEvents) {
        this.datiPassaggioTemplateAI = JSON.parse(JSON.stringify(this.datiPointActivityEvents));
      } else {
        this.datiPassaggioTemplateAI = undefined;
      }
      this.visualizzaTastoSubmitAI = true;
    } else {
      if (this.MappaOGrafico2 === 'TC') {
        logConsole('Dati tc run', this.ultimoTcRunCodeClickato, this.datiTcRun);
        this.tcRunCode = this.ultimoTcRunCodeClickato;
      }
      this.datiPassaggioTemplateAI = undefined;

      let aireqenabled;
      if (this.MappaOGrafico2 === 'MC') {
        aireqenabled = 'Y';
      } else {
        if (datiGriglia && datiGriglia.GridProperty && datiGriglia.GridProperty[0] && datiGriglia.GridProperty[0].AiReqEnabled) {
          aireqenabled = datiGriglia.GridProperty[0].AiReqEnabled;
        } else {
          aireqenabled = 'N';
        }
      }

      if (aireqenabled === 'Y') {
        this.visualizzaTastoSubmitAI = true;
      } else {
        this.visualizzaTastoSubmitAI = false; 
      }
    }
  }

  jsonFormattatoRitornato(e) {
    logConsole('Ritorno json formattato', e);
    this.jsonRitornato = undefined;
    const tm = setTimeout(() => {
      clearTimeout(tm);

      this.jsonRitornato = e;      
    }, 150);
  }

  eseguiRitornaJson(e) {
    logConsole('Richiesta json', e);
    this.scatenaEventoPerRitornoJson = e;
  }

  chiudeMascheraTemplate(e) {
    ExternalUtilities.ultimiParametriCaricati = '';
    ExternalUtilities.datiIA = undefined;
    ExternalUtilities.parametriDatiIA = '';
    this.jsonRitornato = undefined;
    this.gestioneTemplate = false;
  }

  selezionaTemplate(e) {
    this.templateSelezionato = e;
    // logConsole('Template selezionato da maschera', e);
  }

  sommaSpazio = '';
  tSpazioMemoria;
  tAttesaCsv;

  attivaConteggioDimensioneArray() {
    // alert('Utilizzo Memoria: ' + this.utilizzoMemoria);

    if (this.utilizzoMemoria === true) {
      // Evita di avviare più timer in parallelo se la funzione viene richiamata
      if (this.tSpazioMemoria) {
        clearInterval(this.tSpazioMemoria);
      }
      this.tSpazioMemoria = setInterval(() => {
        this.sommaSpazio = this.contaSpazi.contaSpazio(this);
  
        // // logConsole('Spazio occupato ' + this.NumeroFrame2 + ', tipo ' + this.MappaOGrafico2 + ':', this.sommaSpazio);
        // clearInterval(this.tSpazioMemoria);
      }, 3000);
    } else {
      if (this.tSpazioMemoria) {
        clearInterval(this.tSpazioMemoria);
      }
    }
  }

  trackByNomi(index: number, item: any) {
    return index; // this.nomiFrames2[index];
  }

  trackByMDP(index: number, item: any) {
    return index; // this.measureDaDisegnarePareto[index];
  }

  trackByScatter(index: number, item: any) {
    return item.value_2;
  }

  trackByScatter2(index: number, item: any) {
    return index; // this.measureDaDisegnareScatter[index];
  }

  trackByHist(index: number, item: any) {
    return item.value_2;
  }

  trackByHist2(index: number, item: any) {
    return index; // this.measureDaDisegnareHistogram[index];
  }

  trackByGrafici(index: number, item: any) {
    return index; // this.measureDaDisegnare[index];
  }

  vectorMDP = undefined;
  // vectorMDP_E = undefined;
  sourceMDP = undefined;
  snap;
  draw;
  modify;
  private saveFeatureHandler: (event: any) => void;
  private changeFeatureHandler: (event: any) => void;

  attivaDisattivaModalitaDrawPolygon() {
    if (this.MappaOGrafico2 === 'M') {
      if (this.modalitaDrawPolygon) {
         /* if (!this.vectorMDP_E) {
          this.removeLayerFromMap('VectorMDP_E', this.vectorMDP_E);
          this.vectorMDP_E = undefined;
        } */

        if (!this.vectorMDP) {
          this.sourceMDP = new VectorSource();

          this.vectorMDP = new VectorLayer({
            source: this.sourceMDP,
            style: {
              'fill-color': 'rgba(255, 255, 255, 0.2)',
              'stroke-color': '#ffcc33',
              'stroke-width': 2,
              'circle-radius': 7,
              'circle-fill-color': '#ffcc33',
            },
          });
        } else {
          if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.pathLayerGeometry[this.NumeroFrame2]) {
            this.map1[this.NumeroFrame2].removeLayer(this.pathLayerGeometry[this.NumeroFrame2]);
            this.pathLayerGeometry[this.NumeroFrame2] = undefined;
          }
        }

        this.draw = new Draw({
          source: this.sourceMDP,
          type: 'Polygon',
        });

        this.map1[this.NumeroFrame2].addInteraction(this.draw);
        this.snap = new Snap({source: this.sourceMDP});
        this.map1[this.NumeroFrame2].addInteraction(this.snap);

        this.modify = new Modify({source: this.sourceMDP});
        this.map1[this.NumeroFrame2].addInteraction(this.modify);

        this.addLayerToMap(this.vectorMDP, 19, 'VectorMDP');

        this.saveFeatureHandler = this.inZonaAngular((event) => this.saveFeature(this, event));
        this.sourceMDP.on('addfeature', this.saveFeatureHandler);
        // this.sourceMDP.on('addfeature', this.saveFeature.bind(null, this));

        this.changeFeatureHandler = this.inZonaAngular((event) => this.changeFeature(this, event));
        this.sourceMDP.on('changefeature', this.changeFeatureHandler);
        // this.sourceMDP.on('changefeature', this.changeFeature.bind(null, this));
      } else {
        /* const newVectorSource = new VectorSource(); // Create a new empty vector source
        const features = this.sourceMDP.getFeatures();
        newVectorSource.addFeatures(features);
        const newVectorLayer = new VectorLayer({
          source: newVectorSource,
          style: new Style({
            stroke: new Stroke({
              color: 'black',
            })
          })
        });

        // this.vectorMDP_E = newVectorLayer;

        // this.addLayerToMap(newVectorLayer, 15, 'VectorMDP'); */

        if (this.map1[this.NumeroFrame2]) {
          this.sourceMDP.un('addfeature', this.saveFeatureHandler);
          this.sourceMDP.un('changefeature', this.changeFeatureHandler);
        }

        if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.vectorMDP) {
          this.map1[this.NumeroFrame2].removeLayer(this.vectorMDP);
        }

        if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.draw) {
          this.map1[this.NumeroFrame2].removeInteraction(this.draw);
        }
        if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.snap) {
          this.map1[this.NumeroFrame2].removeInteraction(this.snap);
        }
        if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.modify) {
          this.map1[this.NumeroFrame2].removeInteraction(this.modify);
        }

        this.mosaicGrid.caricamentoLayerGeometry(this);
      }
    }
  }

  vecchiaStringaPolygon = '';

  creaStringaPolygon() {
    const coordinate = new Array();
    const src = this.vectorMDP.getSource();
    
    const ftr = src.getFeatures()[0];
    const geometry = ftr.getGeometry();
    const coordinates = geometry.getCoordinates()[0];

    if (coordinates.length < 4) {
      console.error("Un poligono deve avere almeno 4 coordinate (3 punti + chiusura)!");
      return '';
    }
  
    const coordinates4326 = coordinates.map(coord => transform(coord, 'EPSG:3857', 'EPSG:4326'));
    const coordinateStr = coordinates4326.map(coord => `${coord[0]} ${coord[1]}`).join(', ');
    const polygonStr = `POLYGON((${coordinateStr}))`;

    this.vecchiaStringaPolygon = polygonStr;

    const tt = setInterval(() => {
      if (this.vecchiaStringaPolygon === polygonStr) {
        clearInterval(tt);

        // this.boxDisegnatoSuMappa = polygonStr;
        const p = [{
          SQUARE_SNAP: polygonStr,
          NAME: 'DrawnPolygon',
          COLOR: '#000000'
        }];
        ExternalUtilities.bboxSelected = p;

        /* const newVectorSource = new VectorSource(); // Create a new empty vector source
        const features = this.sourceMDP.getFeatures();
        newVectorSource.addFeatures(features);
        const newVectorLayer = new VectorLayer({
          source: newVectorSource,
          style: new Style({
            stroke: new Stroke({
              color: 'black',
            })
          })
        }); */

        this.boxDisegnataSuMappa.emit({
          stringa: p,
          layer: this.vectorMDP,
          source: this.sourceMDP,
          disegnante: this.NumeroFrame2
        });
      }
    }, 500);
  }

  saveFeature = async function(t, evt) {
    /* if (t.vectorMDP) {
      t.map1[t.NumeroFrame2].removeLayer(t.vectorMDP);
    }
    if (t.vectorMDP_E) {
      t.map1[t.NumeroFrame2].removeLayer(t.vectorMDP_E);
    } */

    if (t.vectorMDP.getSource().getFeatures().length > 1) {
      const f = t.vectorMDP.getSource().getFeatures()[0];
      t.vectorMDP.getSource().removeFeature(f);
    }

    if (t.comboSelArea2 === 1) {
      t.comboSelArea2 = 2;
      t.comboSelAreaEmit.emit(2);
      alert('Selected Area by, in context menu Settings,\nchanged to Polygon to highlightthe selected tile on the map, and execute analysis on that tile');
    }

    t.creaStringaPolygon();

    // t.addLayerToMap(t.vectorMDP, 15, 'VectorMDP');
  }

  changeFeature = async function(t, evt) {
    t.creaStringaPolygon();
  }

  // vecchioTabSelezionato;

  clickIconaTab() {
    logConsole('Refresh tab');
    const accentra2 = this.refreshaDopoOnChange('onTabChanged');
    if (accentra2) {
      if (this.MappaOGrafico2 === 'M') {
        this.antenneComponent.pulisceAppoggi(this);
        this.layers_DD.pulisceAppoggi(this);
        this.measuresComponent.pulisceAppoggi(this);
        this.pathComponent.pulisceAppoggi(this);
        this.showRaysAllLayerC.pulisceAppoggi(this);
        this.additional_Layer.pulisceAppoggi(this);
        this.legendaComponent.pulisceAppoggi(this);
      }

      this.accentratore(true, "onTabChanged"); 
    }
  }

  @ViewChild('tabHeaderScroll') tabHeaderScroll!: ElementRef;
  @ViewChild('tabHeaderWrapper') tabHeaderWrapper!: ElementRef;

  scrollTabs(direction: 'left' | 'right') {
    const el = this.tabHeaderScroll.nativeElement as HTMLElement;
    const wrapper = this.tabHeaderWrapper.nativeElement as HTMLElement;
    const scrollAmount = wrapper.offsetWidth * 0.5; // scroll di metà visibile

    // logConsole('Direzione: ', direction, el, wrapper, scrollAmount);

    if (direction === 'left') {
      el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  scrollSelectedTabIntoView(index: number) {
    if (this.tabHeaderScroll) {
      const tabElements = this.tabHeaderScroll.nativeElement.children;
      const selectedTab = tabElements[index] as HTMLElement;
      selectedTab?.scrollIntoView({ inline: 'center' });
    }
  }

  @ViewChildren('tabLabelRef') tabLabels: QueryList<ElementRef>;

  nonCambiareTab = false;

  onTabChanged(e) {
    if (this.nonCambiareTab) {
      this.spostaTab(this.tabSelezionatoPerTab);
      return;
    }

    this.tabSelezionatoPerTab = e;
    // logConsole('Tab cambiato ', this.tabSelezionatoPerTab);

    /* setTimeout(() => {
      (this.tabGroup! as any)._tabHeader._alignInkBarToSelectedTab();
    }, 1000);

    if (this.vecchioTabSelezionato === this.tabSelezionatoPerTab) {
      // logConsole('Tab cambiato. Eseguo refresh');
      const accentra2 = this.refreshaDopoOnChange('onTabChanged');
      if (accentra2) { this.accentratore(true, "onTabChanged"); }
      return;
    }
    this.vecchioTabSelezionato = this.tabSelezionatoPerTab; */
    // return;

    const indice = this.nomiFrames2PerTab[this.tabSelezionatoPerTab].indice;
    this.cambiaFrameManuale(indice);

    this.spostaTab(e.index);
  }

  spostaTab(indice) {
    const tt = setTimeout(() => {
      clearTimeout(tt);

      const label = this.tabLabels.toArray()[indice];
      label?.nativeElement.scrollIntoView({   
        behavior: 'auto',
        block: 'nearest',     // evita scroll verticale
        inline: 'center'      // centra orizzontalmente
      });
    }, 1000);
  }

  nomiFrames2PerTab;
  tabSelezionatoPerTab = 0;

  creaNomiFramesPerTab() {
    if (!this.barraImpostataAperta) {
      return;
    }

    const n = new Array();

    if (this.nomiFrames2) {
      let i = 0;

      // logConsole('Nomi frames', this.NumeroFrame2, this.nomiFrames2, this.frameAttivo2, this.nomiFrames2[this.frameAttivo2]);
      
      if (typeof(this.nomiFrames2) !== 'string') {
        this.nomiFrames2.forEach(element => {
          if (this.controllaNascondiNomi(i)) {
            let nome = element;

            const quadraInizio = nome.trim().indexOf('[');
            const quadraFine = nome.trim().indexOf(']');

            if (quadraInizio === 0) {
              if (quadraFine > quadraInizio + 1) {
                // logConsole('Elimino quadre dal nome', element, quadraInizio, quadraFine);
                nome = nome.trim().substring(quadraFine + 1, nome.length).trim();
              }
            }
            n.push({
              nomePagina: nome + '  ',
              indice: i
            });
          }
          i++;
        });
      }
    }

    this.nomiFrames2PerTab =  n;

    setTimeout(() => {
      let i: number = 0;
      n.forEach(element => {
        if (+element.indice === +this.frameAttivo2) {
          this.tabSelezionatoPerTab = i;
          this.scrollSelectedTabIntoView(i);
          // this.vecchioTabSelezionato = i;

          this.spostaTab(i);
        }
        i++;
      });
      // logConsole('Tab selezionato per tab ' + this.NumeroFrame2 + ': ', n, 
      //   this.tabSelezionatoPerTab, +this.frameAttivo2);
    }, 1000);
  }

  clickIcona(e) {
    logConsole('Click icona', e);

    switch (e.id) {
      case 0:
        this.disattivaDebug();
        break;
      case 1:
        this.attivaDebug();
        break;
      case 2:
        this.apreRicerca(); 
        this.chiudeViews(); 
        this.barraTitoloChiusa();
        break;
      case 3:
        this.chiudeRicerca(); 
        this.chiudeViews(); 
        this.barraTitoloChiusa();
        break;
      case 4:
        this.impostaFinestraLegendaSempreAperta();
        break;
      case 5:
        this.impostaFinestraLegendaSempreChiusa();
        break;
      case 6:
        this.apreMascheraExportDati('kml'); 
        this.chiudeViews(); 
        this.barraTitoloChiusa();
        break;
      case 7:
        this.apreMascheraExportDati('csv'); 
        this.chiudeViews(); 
        this.barraTitoloChiusa();
        break;
      case 8:
        this.chiudeViews(); 
        this.barraTitoloChiusa(); 
        this.exportComponent.exportDati(this.frameAttuale, 'csv', this.listaEventiDaPassare2, this.tipoEvento2, 'null');
        break;
      case 9:
        if (this.settingsAperto) {
          Swal.fire({
            title: 'Frame Editor',
            text: "Please close the current Frame Editor before opening a new one",
            icon: 'warning',
            showClass: {
              backdrop: 'swal2-noanimation', // disable backdrop animation
              popup: '',                     // disable popup animation
              // icon: ''                       // disable icon animation
            },
          });          
        } else {
          this.apreSettings(); 
          this.chiudeViews(); 
          this.barraTitoloChiusa();
        }
        break;
      case 10:
        this.iconeAperte2 = false;
        // for (let i = 0; i <= environment.quantiFrames; i++) {
          ExternalUtilities.staMassimizzando[this.NumeroFrame2] = true;
        // }
        const tt = setTimeout(() => {
          clearTimeout(tt);

          this.massimizza(this.NumeroFrame); 
          this.chiudeViews(); 
          this.barraTitoloChiusa();
        }, 100);
        break;
      case 11:
        this.iconeAperte2 = false;
        // for (let i = 0; i <= environment.quantiFrames; i++) {
          ExternalUtilities.staMassimizzando[this.NumeroFrame2] = true;
        // }
        const tt2 = setTimeout(() => {
          clearTimeout(tt2);

          this.massimizza(-1); 
          this.chiudeViews(); 
          this.barraTitoloChiusa();
        }, 100);
        break;
      case 12:
        this.modalitaDrawPolygon = true; 
        this.attivaDisattivaModalitaDrawPolygon(); 
        this.chiudeViews(); 
        this.barraTitoloChiusa();
        break;
      case 13:
        this.modalitaDrawPolygon = false; 
        this.attivaDisattivaModalitaDrawPolygon(); 
        this.chiudeViews(); 
        this.barraTitoloChiusa();
        break;
      case 14:
        this.excludeTimeRange();
        break;
      case 15:
        this.includeTimeRange();
        break;
      case 16:
        this.chiudeMaschera1(); 
        this.chiudeViews(); 
        this.barraTitoloChiusa();
        break;
      case 17:
        this.clickIconaTab();
        break;
      case 18:
        this.calcolaDistanza();
        break;
      case 19:
        this.inviaDatiAdAIDeiGrafici();
        break;
    }
  }

  inviaDatiAdAIDeiGrafici() {
    /* const punti = new Array();
    logConsole('Invio dati ad AI dei grafici', this.dataPointsAppoggio[this.NumeroFrame2]);
    this.dataPointsAppoggio[this.NumeroFrame2].forEach(element => {
      if (element !== undefined && element.length > 0) {
        element.forEach(element2 => {
          if (element2.dataPoints) {
            element2.dataPoints.forEach(element3 => {
              if (element3) {
                let nome = element2.name;
                if (!nome) {
                  nome = 'Events';
                }
                const punto = {
                  name: nome,
                  x: element3.x,
                  x2: element3.x2,
                  y: element3.y,
                  label: element3.label,
                  color: element3.color
                }
                punti.push(punto);
              }
            })
          }
        })
      }
    });
    
    let dati = '';
    const header = [
      {'headerText': 'name', 'description': ''}, 
      {'headerText': 'x', 'description': ''}, 
      {'headerText': 'x2', 'description': ''}, 
      {'headerText': 'y', 'description': ''}, 
      {'headerText': 'label', 'description': ''}, 
      {'headerText': 'color', 'description': ''}
    ];
    punti.forEach(punto => {
      dati += `${punto.name};${punto.x};${punto.x2};${punto.y};${punto.label};${punto.color}\n`;
    });

    const invio = {
      CSV: dati,
      DATI: header
    }

    logConsole('Invio dati ad AI dei grafici. Finali: ', invio); */

    const tm = setTimeout(() => {
      clearTimeout(tm); 

      this.graficiComponent.exportDati(this, true); 
    });
  }

  ritornoDimensioniColonneAP(e) {
    ExternalUtilities.scriveDimensioniColonne('AP', e);
  }

  ritornoDimensioniColonneAH(e) {
    ExternalUtilities.scriveDimensioniColonne('AH', e);
  }

  ritornoDimensioniColonneAM(e) {
    ExternalUtilities.scriveDimensioniColonne('AA', e);
  }

  ritornoDimensioniColonneAR(e) {
    ExternalUtilities.scriveDimensioniColonne('AR', e);
  }

  ritornoDimensioniColonnePM(e) {
    ExternalUtilities.scriveDimensioniColonne('PM', e);
  }

  ritornoDimensioniColonneAgents(e) {
    ExternalUtilities.scriveDimensioniColonne('Agents', e);
  }

  ritornoDimensioniColonneAE(e) {
    ExternalUtilities.scriveDimensioniColonne('AE', e);
  }

  ritornoDimensioniColonneES(e) {
    ExternalUtilities.scriveDimensioniColonne('ES', e);
  }

  ritornoDimensioniColonneTC(e) {
    ExternalUtilities.scriveDimensioniColonne('TC', e);
  }

  ritornoDimensioniColonneNPS(e) {
    ExternalUtilities.scriveDimensioniColonne('NPS', e);
  }

  ritornoDimensioniColonnePLI(e) {
    ExternalUtilities.scriveDimensioniColonne('PLI', e);
  }

  ritornoDimensioniColonnePCM(e) {
    ExternalUtilities.scriveDimensioniColonne('PCM', e);
  }

  ritornoDimensioniColonneAI(e) {
    ExternalUtilities.scriveDimensioniColonne('AI', e);
  }

  ritornoDimensioniColonneDFN(e) {
    ExternalUtilities.scriveDimensioniColonne('DFN', e);
  }

  ritornoDimensioniColonneMG(e) {
    ExternalUtilities.scriveDimensioniColonne('MG', e);
  }

  ritornoDimensioniColonneMR(e) {
    ExternalUtilities.scriveDimensioniColonne('MR', e);
  }

  ritornoDimensioniColonneMStat(e) {
    ExternalUtilities.scriveDimensioniColonne('MS', e);
  }

  ritornoDimensioniColonneMStat2(e) {
    ExternalUtilities.scriveDimensioniColonne('MS', e);
  }

  ritornoDimensioniColonneMQ(e) {
    ExternalUtilities.scriveDimensioniColonne('MQ', e);
  }

  ritornoDimensioniColonneCG(e) {
    ExternalUtilities.scriveDimensioniColonne('CG', e);
  }

  ritornoDimensioniColonneCM(e) {
    ExternalUtilities.scriveDimensioniColonne('CM', e);
  }

  ritornoDimensioniColonneM2(e) {
    ExternalUtilities.scriveDimensioniColonne('M2', e);
  }

  ritornoDimensioniColonneMF(e) {
    ExternalUtilities.scriveDimensioniColonne('MF', e);
  }

  ritornoDimensioniColonneLA(e) {
    ExternalUtilities.scriveDimensioniColonne('LA', e);
  }

  ritornoDimensioniColonneCD(e) {
    ExternalUtilities.scriveDimensioniColonne('CD', e);
  }

  ritornoDimensioniColonneCD2(e) {
    ExternalUtilities.scriveDimensioniColonne('CD2', e);
  }

  ritornoDimensioniColonneCS(e) {
    ExternalUtilities.scriveDimensioniColonne('CS', e);
  }

  ritornoDimensioniColonneCV(e) {
    ExternalUtilities.scriveDimensioniColonne('CV', e);
  }

  ritornoDimensioniColonneNB(e) {
    ExternalUtilities.scriveDimensioniColonne('NB', e);
  }

  refreshaDopoOnChange(daDove) {
    let accentra = true;

    // logConsole('Refresho dopo onchange', this.NumeroFrame2, daDove);

  // if (r.refresh.currentValue !== undefined) {
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, 'Refresh ', this.frameName, 
      '*' + this.MappaOGrafico2 + '*', this.frameAttivo2);

    if (daDove !== 'onTabChanged') {
      switch(this.MappaOGrafico2) {
        case "M":
          this.updateSizeMappa('DopoChange');
          this.redrawComponente('RDC', this.frameAttivo2);
          break;
        case "MC":
          this.aggiornaGrafici[this.NumeroFrame2] = true;
          this.lastCallGrafici[this.NumeroFrame2] = '';
          const tm1 = setTimeout(() => {
            clearTimeout(tm1);

            this.graficiComponent.disegnaGrafici(this, false);              
          }, 300);
          // this.ridisegnaGraficiDopoScroll();
          break;
        case "PC":
          this.forzaRidisegnoPareto = true;
          this.paretoComponent.disegnaPareto(this, false, false, 'RefreshDopoOnChange');
          break;
        case "PS":
          this.forzaRidisegnoScatter = true;
          this.scatterComponent.disegnaScatter(this, false, false);
          break;
        case "AH":
          // logConsole('Disegno istogrammi 1', this.NumeroFrame2);
          this.histogramComponent.disegnaHistogram(this, false, false);
          break;
        default:
          accentra = false;
          break;
      }
    } else {
      switch(this.MappaOGrafico2) {
        case "M":
          this.updateSizeMappa('DopoChange');
          break;
        case "MC":
          logConsole('Click icona per MC 2');
          this.lastCallGrafici[this.NumeroFrame2] = '';
          this.lastCallTmsToGps[this.NumeroFrame2] = '';
          break;
        case "PC":
          this.lastCallPareto[this.NumeroFrame2] = '';
          break;
        case "PS":
          this.lastCallScatter[this.NumeroFrame2] = '';
          break;
        case "AR":
          this.lastCallArfcn[this.NumeroFrame2] = '';
          break;
        case "AI":
          this.lastCallAreaInfo[this.NumeroFrame2] = '';
          break;
        case "LA":
          this.lastCallActivities[this.NumeroFrame2] = '';
          break;
        case "CD":
          this.lastCallCDData[this.NumeroFrame2] = '';
          break;
        case "CV":
          this.lastCallCDVoice[this.NumeroFrame2] = '';
          break;
        case "CM":
          this.lastCallCM[this.NumeroFrame2] = '';
          break;
        case "ES":
          this.lastCallES[this.NumeroFrame2] = '';
          break;
        case "CG":
          this.lastCallClusterGrid[this.NumeroFrame2] = '';
          this.lastCallLayerGeometry[this.NumeroFrame2] = '';
          break;
        case "AE":
          this.lastCallCrossTab[this.NumeroFrame2] = '';
          this.lastCallLista[this.NumeroFrame2] = '';
          this.lastCallEventi[this.NumeroFrame2] = '';
          break;
        case "AH":
          logConsole('Azzero ultima chiamata histogrammi 2', this.NumeroFrame2, daDove);
          this.lastCallHistogram[this.NumeroFrame2] = '';
          break;
        case "MD":
          this.lastCallMeasureDFN[this.NumeroFrame2] = '';
          break;
        case "MG":
          this.lastCallLayerGeometryMosaic[this.NumeroFrame2] = '';
          this.lastCallMosaicGrid[this.NumeroFrame2] = '';
          break;
        case "NB":
          accentra = false;
          break;
        case "NP":
          this.lastCallTC[this.NumeroFrame2] = '';
          break;
        case "PK":
          this.lastCallPointCM[this.NumeroFrame2] = '';
          break;
        case "PL":
          this.lastCallPLI[this.NumeroFrame2] = '';
          break;
        case "PM":
          this.lastCallPointCM[this.NumeroFrame2] = '';
          break;
        case "TC":
          this.lastCallTCRun[this.NumeroFrame2] = '';
          break;
        case "TP":
          // PivotComponent.lastCallPivot[this.NumeroFrame] = '';
          accentra = false;
          break;
        default:
          accentra = false;
      }

      return accentra;
    }
  }

  updateSizeMappa(daDove) {
    return;

    // logConsole('Update size mappa', this.NumeroFrame2, daDove);

    const tm1 = setTimeout(() => {
      clearTimeout(tm1);

      if (this.map1[this.NumeroFrame2]) {
        this.map1[this.NumeroFrame2].updateSize();
      }
    }, 1000);
  }

  impostaPosizioneSchermata(extent1, propagaSpostamento, daDove, position, zoom) {
    // logConsole('Extent', extent1, this.NumeroFrame2, daDove);
    if (!extent1 || extent1.length < 1) {
      return;
    }

    let ok = true;
    let i = 0;
    extent1.forEach(element => {
      if (ok && (isNaN(element) || element === undefined || element === null || element === 'NaN' || 
        element === 'undefined' || element === 'null')) {
          logConsole('Valore non numerico nel centro impostato da ' + daDove, this.NumeroFrame2, extent1, element, i);
        ok = false;
      }
      i++;
    });
    if (!ok) {
      return;
    }

    let extent = extent1;
    /* if (extent.length > 2) {
      const minX = Math.min(extent[0], extent[2]);
      const minY = Math.min(extent[1], extent[3]);
      const maxX = Math.max(extent[0], extent[2]);
      const maxY = Math.max(extent[1], extent[3]);
      extent = [minX, minY, maxX, maxY];
    } */
    
    // logConsole('Extent 1', extent, this.NumeroFrame2, daDove);
    extent = this.sistemaCoordinate(extent, '3857');
    // logConsole('Extent 2', extent, this.NumeroFrame2, daDove);

    if (this.map1[this.NumeroFrame2] && this.map1[this.NumeroFrame2] !== null && this.map1[this.NumeroFrame2].getView()) {
      const view = this.map1[this.NumeroFrame2].getView();
      const currentExtent = view.calculateExtent(this.map1[this.NumeroFrame2].getSize());

      // logConsole('Extent 2', extent, this.NumeroFrame2, daDove);
      // this.zoomImpostatoNelFrame = this.map1[this.NumeroFrame2].getView().getZoom();
      
      if (extent.length > 2) {
        // logConsole('Imposto fit da ' + daDove, this.NumeroFrame2, extent);
        this.map1[this.NumeroFrame2].getView().fit(extent);

        /* if (zoom) {
          this.map1[this.NumeroFrame2].getView().setZoom(this.zoomImpostatoNelFrame);
        } */

        const extentPerBBox = extent; // transform(extent, 'EPSG:3857', 'EPSG:4326');
        // logConsole('Imposto bbox fit da ' + daDove, this.NumeroFrame2, extentPerBBox);
        this.bboxImpostataNelFrame = extentPerBBox;
        if (this.overviewZoom2 === true) {
          this.bboxOverview = extentPerBBox;
        } else {
          this.bboxZoom = extentPerBBox;
        }
      } else {
        // const extentConv = transform(extent, 'EPSG:3857', 'EPSG:4326');
        // logConsole('Imposto centro da ' + daDove, this.NumeroFrame2, extentConv, position, zoom);
        if (position) {
          // logConsole('Imposto posizione schermata', this.NumeroFrame2, extent);
          if (!containsCoordinate(currentExtent, extent)) {
            this.map1[this.NumeroFrame2].getView().setCenter(extent);
          } else {
            logConsole('Non sposto la mappa in quanto il punto è all\'interno della mappa visibile', this.NumeroFrame2);
          }
        }
        if (zoom) {
          // logConsole('Imposto zoom', this.NumeroFrame2, this.zoomImpostatoNelFrame);
          // this.map1[this.NumeroFrame2].getView().setZoom(this.zoomImpostatoNelFrame);
        }
      }
        
      if (position || zoom) {
        const bboxNuova = this.map1[this.NumeroFrame2].getView().calculateExtent(this.map1[this.NumeroFrame2].getSize());
        const extentPerBBox = bboxNuova; // transform(bboxNuova, 'EPSG:3857', 'EPSG:4326');
        // logConsole('Imposto bbox center da ' + daDove, this.NumeroFrame2, extentPerBBox);

        this.bboxImpostataNelFrame = extentPerBBox;

        if (this.overviewZoom2 === true) {
          this.bboxOverview = extentPerBBox;
        } else {
          this.bboxZoom = extentPerBBox;
        }
      }
      
      // // logConsole('Imposto centro con zoom da ' + daDove, this.NumeroFrame2, extent, this.zoomImpostatoNelFrame, extent1);

      this.viewMappaAttuale = this.map1[this.NumeroFrame2].getView();
      // this.map1[this.NumeroFrame2].getView().setZoom(this.zoomImpostatoNelFrame);

      // logConsole('Centro impostato 9', this.NumeroFrame2, extent);
      // logConsole('Imposto centro da ' + daDove, this.NumeroFrame2, extent, extent1, this.zoomImpostatoNelFrame);
      this.centroImpostato = extent; // transform(coord2, 'EPSG:4326', 'EPSG:3857');
      
      if (propagaSpostamento) {
        // logConsole('Centro impostato emit in imposta posizione schermata', this.NumeroFrame2, this.centroImpostato, '', this.zoomImpostatoNelFrame);
        this.centroImpostatoEmit.emit({
          daChi: this.NumeroFrame2, 
          funzione: daDove, 
          centro: this.centroImpostato, 
          zoom: this.zoomImpostatoNelFrame,
          tipoMappa: this.overviewZoom2
        });
      }

      this.updateSizeMappa(daDove);
    } else {
      logConsole('Mappa non valida', this.NumeroFrame2, this.map1[this.NumeroFrame2], this.map1[this.NumeroFrame2].getView());
    }
  }

  guessProjection(input) {
    let minX: number, minY: number, maxX: number, maxY: number;

    if (input.length === 2) {
      // Coordinate singole
      [minX, minY] = input;
      maxX = minX;
      maxY = minY;
    } else if (input.length === 4) {
      // Extent
      [minX, minY, maxX, maxY] = input;
    } else {
      // throw new Error('Input non valido. Deve essere una coppia di coordinate o un extent.');
    }

    const isWithin4326 =
      minX >= -180 && maxX <= 180 &&
      minY >= -90 && maxY <= 90;

    const isWithin3857 =
      minX >= -20037508.34 && maxX <= 20037508.34 &&
      minY >= -20037508.34 && maxY <= 20037508.34;

    const isWithin32632 =
      minX >= 100000 && maxX <= 1000000 &&
      minY >= 4000000 && maxY <= 6000000;

    if (isWithin4326) {
      return 'EPSG:4326';
    }

    if (isWithin3857) {
      return 'EPSG:3857';
    }

    if (isWithin32632) {
      return 'EPSG:32632';
    }

    return 'unknown';
  }

  sistemaCoordinate(extent, come) {
    const proiezione = this.guessProjection(extent);

    if (extent.length > 2) {
      // logConsole('Extent lunghezza 4 prima', this.NumeroFrame2, extent, come, proiezione);
      if (come === '4326') {
        if (proiezione !== 'EPSG:4326') {
          if (proiezione !== 'unknown') {     
            extent = transformExtent(extent, proiezione, 'EPSG:4326');
          }
        }
      } else {
        if (proiezione !== 'EPSG:3857') {
          if (proiezione !== 'unknown') {
            extent = transformExtent(extent, proiezione, 'EPSG:3857');
          }
        }
      }
      // logConsole('Extent lunghezza 4 dopo', this.NumeroFrame2, extent);
    } else {
      // logConsole('Extent lunghezza 2 prima', this.NumeroFrame2, extent, come, proiezione);
      if (come === '4326') {
        if (proiezione !== 'EPSG:4326') {
          if (proiezione !== 'unknown') {
            extent = transform(extent, proiezione, 'EPSG:4326');
          }
        }
      } else {
        if (proiezione !== 'EPSG:3857') {
          if (proiezione !== 'unknown') {
            extent = transform(extent, proiezione, 'EPSG:3857');
          }
        }
      }
      // logConsole('Extent lunghezza 2 dopo', this.NumeroFrame2, extent);
    }

    return extent;
  }

  sistemaNomeFrame(n) {
    let n2 = n;
    if (n2.indexOf('[') > -1) {
      if (n2.indexOf(']') > -1) {
        n2 = n.substring(n2.indexOf(']') + 1, n2.lentgh);
      }
    }
    // logConsole('Nome frame', n, n2);
    return n2;
  }

  checkPartitionLabel(e) {
    // logConsole('Check partition label', e);

    if (e.PARTITION_LABEL) {
      this.partitionLabelEmit.emit(e.PARTITION_LABEL);
    } else {
      if (e[0] && e[0].PARTITION_LABEL) {
        this.partitionLabelEmit.emit(e[0].PARTITION_LABEL);
      }
    }
  }

  chiudeBarra() {
    logConsole('Chiude barra');
    // this.dimeBarraAperta = this.dBarraChiusa;
  }

  inviaMisure(misure, daDove) {
    let misureDaPassare = new Array();
    if (misure) {
      misure.forEach(element => {
        if (element) {
          let misura = ExternalUtilities.PrendeNomeMisuraDaCodice(element, this.measureData2, daDove);
          if (misura.indexOf('NOT FOUND') > -1) {
            misura = '';
          }
          misureDaPassare.push(misura);
        } else {
          misureDaPassare.push('');
        }
      });
    } else {
      misureDaPassare = ['', '', '', '', ''];
    }
    this.misureGlobaliEmit.emit(misureDaPassare);
  }

  prendeMisurePerLegenda() {
    if (this.MappaOGrafico2 !== 'M') {
      return;
    }

    let misureEsterne;
    if (this.MappaOGrafico2 === 'M') {
      misureEsterne = this.misureGlobaliMappa[this.NumeroFrame2];
    } else {
      misureEsterne = ExternalUtilities.misureGlobali;
    }

    const array2 = new Array();
    let array1 = new Array();
    if (this.showMeasures2) {
      array1 = JSON.parse(JSON.stringify(this.Measure));
      
      // logConsole('Misure impostate da legendare', this.Measure);
      
      array1.forEach(element => {
        if (element && element !== null) {
          const misura = ExternalUtilities.ritornaMisura(this, element, this.Utils.globalMeasure, this.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Misure 2');
          if (misura && misura.indexOf('<GLOBAL MEASURE>') === -1 && misura.indexOf('global_measure_') === -1 && misura.indexOf('<GLOBAL CHECKED MEASURE_') === -1) {
            const trovata = this.controllaMisuraSeEsiste(misura, misureEsterne);

            // logConsole('Misura da legendare', element, misura, trovata);

            array2.push({ Tipo: '**Line**', Valore: misura, Trovata: trovata });
          }
        }
      });
    }

    switch (+this.viewAs2[this.NumeroFrame2]) {
      case 1:
        // NONE
        break;
      case 2:
        // Cluster
        const misuraC = ExternalUtilities.ritornaMisura(this, this.overlay2, this.Utils.globalMeasure, this.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Misure 2');
        const trovataC = this.controllaMisuraSeEsiste(misuraC, misureEsterne);
        array2.push({ Tipo: '**Cluster**', Valore: misuraC, Trovata: trovataC });
        break;
      case 3:
        // Mosaic
        const misuraM = ExternalUtilities.ritornaMisura(this, this.overlay2, this.Utils.globalMeasure, this.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Misure 3');
        const trovataM = this.controllaMisuraSeEsiste(misuraM, misureEsterne);
        // logConsole('Misura mosaic', misuraM, this.overlay2, trovataM);
        array2.push({ Tipo: '**Mosaic**', Valore: misuraM, Trovata: trovataM });
        break;
    }

    // logConsole('Show measure', this.showMeasuresS2, this.measureSMS2);
    if (this.showMeasuresS2 && this.measureSMS2 && this.measureSMS2 !== '') {
      let parameters;

      let misuraS = ExternalUtilities.ritornaMisura(this, this.measureSMS2, this.Utils.globalMeasure, this.Utils.globalMeasureArfcn, ExternalUtilities.misureGlobali, 'Misure 4');
      if (!misuraS) { misuraS = '---'; }

      let ok2 = false;

      // logConsole('Sample', this.measureData2, misuraS);
      if (this.measureData2) {
        this.measureData2.forEach(element3 => {
          if (!ok2 && (element3.CODE === misuraS || element3.DISPLAY_NAME === misuraS)) {
            // logConsole('Sample trovata', element3);
            ok2 = true;
            misuraS = element3.DISPLAY_NAME;
          }
        });
      }

      /* let trovataS = "";
      if (!ok2) {
        logConsole('OK', ok2);

        trovataS = '&nbsp;<span style="color: red;">[NOT EXISTS]</span>';
      } */
      const trovataS = this.controllaMisuraSeEsiste(misuraS, misureEsterne);
      array2.push({ Tipo: '**Sample**', Valore: misuraS, Trovata: trovataS });
    }

    /* const arrayFinale = new Array();
    array2.forEach(element => {
      let ok = true;
      arrayFinale.forEach(element2 => {
        if (ok && element2.Valore === element.Valore) {
          ok = false;
        }
      });
      if (ok) {
        if (element && element !== null) {
          // const trovata = this.controllaMisuraSeEsiste(element.Valore, misureEsterne);
          arrayFinale.push({ Tipo: element.Tipo, Valore: element.Valore, Trovata: element.Trovata });
        }
      // }
    }); */

    /* logConsole('Misure per legenda: Check misure ', this.showMeasures2);
    logConsole('Misure per legenda: View AS ', this.viewAs2[this.NumeroFrame2]);
    logConsole('Misure per legenda: Misure ', this.Measure);
    logConsole('Misure per legenda: Array Appoggio ', array1);
    logConsole('Misure per legenda: Array finale ', arrayFinale); */

    // logConsole('Misure finali per legenda', array2);

    return array2;
  }

  controllaMisuraSeEsiste(misuraPassata, misureEsterne) {
    let trovata = '';
    // let misura = ExternalUtilities.ritornaMisura(this, misuraPassata, this.Utils.globalMeasure, this.Utils.globalMeasureArfcn, misureEsterne, 'Frame 1');
    
    let ok = false;

    if (this.measureData2) {
      this.measureData2.forEach(element3 => {
        if (!ok && (element3.CODE === misuraPassata || element3.DISPLAY_NAME === misuraPassata)) {
          ok = true;
          // misura = element3.DISPLAY_NAME;
        }
      });
    }

    if (misuraPassata) {
      if (ok) {
        trovata = '';
      } else {
        // logConsole('NOT EXISTS 1', misuraPassata, this.measureData2);
        trovata = ' <span style="color: red">[NOT EXISTS]</span>';
      }
    } else {
      // logConsole('misura passata vuota:', misuraPassata);
      // trovata = ' <span style="color: red">[EMPTY]</span>';
    }

    return trovata;
  }

  calcolaDistanza() {    
    if (!this.Utils.tmsSelezionato) {
      return;
    }
    let valoreRicerca = this.act_set;

    const params = {
      v_cntx: this.sessionID2,
      v_act_set_name_list: valoreRicerca,
      v_tms_origin: this.Utils.tmsSelezionato
    }
    this.apiService.chiamataPost(this.Utils, 'geo_act__set_distance_origin', params)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        if (data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(this, this.Utils, data2);

          if (data2) {
            logConsole('Distanza: ', data2);

            this.clickIconaTab();

            Swal.fire({
              title: 'Distance',
              text: "New origin for distance configured",
              icon: 'warning',
              showClass: {
                backdrop: 'swal2-noanimation', // disable backdrop animation
                popup: '',                     // disable popup animation
                // icon: ''                       // disable icon animation
              },
            });          
          }
        }
      }, error => {
      });
  }

  datiCSV = undefined;
  
  converteInCSV(dati) {
    const colonne = new Array();
    let colonne2 = '';
    dati.ColumnProperty.forEach(element => {
      colonne.push(element.key);
      colonne2 += element.headerText + ';';
    });

    // logConsole('Colonne', colonne);

    const righe = new Array();
    dati.DataTable.forEach(element => {
      let riga = '';
      colonne.forEach(element2 => {
        if (element[element2] && element[element2] !== null && element[element2] !== 'null' && element[element2] !== undefined && element[element2] !== 'undefined') {
          riga += element[element2] + ';';
        } else {
          riga += ';';
        }
      });
      righe.push(riga);
    });

    // logConsole('Righe', righe);
    let ritorno = colonne2 + '\n';
    righe.forEach(element => {
      ritorno += element + '\n';
    });
    // logConsole('Ritorno', ritorno);

    return ritorno;
  }

  ritornoTastoAiTutte(datiCSV, tipo, nomeDatiGriglia) {
    if (this.MappaOGrafico2 === 'AE') {
      let datiCSV2 = this.converteInCSV(this.datiPointActivityEvents);
      // logConsole('Dati', datiCSV.length);
      const ritorno = {
        CSV: datiCSV2,
        DATI: this.datiPointActivityEvents.ColumnProperty
      }

      this.datiCSV = ritorno;
      logConsole('Dati per AI in AE', ritorno);
    } else {
      this.datiCSV = datiCSV;
      logConsole('Ritorno tasto AI tutte ' + this.MappaOGrafico2, datiCSV, tipo);
    }
    this.apreGestioneTemplates(datiCSV, tipo, nomeDatiGriglia);
  }

  eseguiCheck(e) {
    logConsole('Ritorno esegui check', e);
    const modalita = e.modalita;

    switch (modalita) {
      case 'process_activities':
        this.confermaProcess(e.dati)
        break;
      case 'delete_tcrun':
        this.confermaDeleteTcRun(e.dati)
        break;
      case 'delete_actset':
        this.confermaDeleteActSet(e.dati)
        break;
    }
  }

  onCanvasPointerDown(evt: PointerEvent) {
    this.synoptic.pointerDown(this, evt);
  }

  modo = true;

  creaStruttureDiProvaPerCanvas() {
    const ogg = new Array();

    if (this.modo) {
      ogg.push({ Type: 'round', X: 150, Y: 150, Dime: 27, BorderColor: 'black', Color: '#b03', Label: '', X2: undefined, Y2: undefined });
      ogg.push({ Type: 'label', X: 100, Y: 100, Dime: 14, BorderColor: undefined, Color: '#00A', Label: 'W Pippo', X2: undefined, Y2: undefined });
      ogg.push({ Type: 'label', X: 300, Y: 140, Dime: 16, BorderColor: undefined, Color: '#0A0', Label: 'W Pluto', X2: undefined, Y2: undefined });
      ogg.push({ Type: 'label', X: 220, Y: 220, Dime: 18, BorderColor: undefined, Color: '#A00', Label: 'W Paperino', X2: undefined, Y2: undefined });
      ogg.push({ Type: 'line', X: 50, Y: 50, Dime: 2, BorderColor: undefined, Color: '#580', Label: '', X2: 300, Y2: 100 });
      ogg.push({ Type: 'line', X: 50, Y: 250, Dime: 3, BorderColor: undefined, Color: '#aa0', Label: '', X2: 130, Y2: 30 });
      ogg.push({ Type: 'image', X: 350, Y: 35, Dime: -1, BorderColor: undefined, Color: undefined, Label: this.Utils.linkIcone + '/icons/open_menu.png', X2: 30, Y2: 35 });
    } else {
      ogg.push({ Type: 'round', X: 150, Y: 150, Dime: 27, BorderColor: 'black', Color: 'transparent', Label: '', X2: undefined, Y2: undefined });
      ogg.push({ Type: 'label', X: 100, Y: 100, Dime: 14, BorderColor: undefined, Color: '#00A', Label: 'W Topolino', X2: undefined, Y2: undefined });
      ogg.push({ Type: 'label', X: 300, Y: 140, Dime: 16, BorderColor: undefined, Color: '#0A0', Label: 'W Qui Quo Qua', X2: undefined, Y2: undefined });
      ogg.push({ Type: 'label', X: 220, Y: 220, Dime: 18, BorderColor: undefined, Color: '#A00', Label: 'W Ciccio', X2: undefined, Y2: undefined });
      ogg.push({ Type: 'line', X: 50, Y: 50, Dime: 1, BorderColor: undefined, Color: '#580', Label: '', X2: 300, Y2: 100 });
      ogg.push({ Type: 'line', X: 50, Y: 250, Dime: 1, BorderColor: undefined, Color: '#aa0', Label: '', X2: 130, Y2: 30 });
      ogg.push({ Type: 'image', X: 350, Y: 35, Dime: -1, BorderColor: undefined, Color: undefined, Label: this.Utils.linkIcone + '/icons/confirm.png', X2: 50, Y2: 55 });
    }

    // this.modo = !this.modo;

    return ogg;
  }

  /* cambioCanvas() {
    const ogg = this.creaStruttureDiProvaPerCanvas();
    this.synoptic.DisegnaSynoptic(this, ogg);
  } */

  selezioneActivity = false;

  clickCheckRigaLA(e) {
    if (e && e.dati && e.dati.length > 0) {
      this.selezioneActivity = true;
    } else {
      this.selezioneActivity = false;
    }
  }

  selezionateTutteLeRigheLA(e, come) {
    logConsole('Selezionate tutte le righe LA', e, come);

    if (come) {
      this.selezioneActivity = true;
    } else {
      this.selezioneActivity = false;
    }

    if (e && Array.isArray(e)) {
      this.righeSelezionatePerActSet = e;

      if (e[0].NAME) {
        let valoreRicerca = '[ACT] ' + e[0].NAME;
        if (valoreRicerca.indexOf('***') > -1) {
          valoreRicerca = valoreRicerca.substring(0, valoreRicerca.indexOf('***'));
        }
        this.Utils.nomeActivitySelezionata = valoreRicerca;
      } else {
        this.Utils.nomeActivitySelezionata = '';
      }

      this.esegueClickSuActivities(e[0], true);
    } else {
      this.Utils.nomeActivitySelezionata = '';
      this.righeSelezionatePerActSet = new Array();
    }
  }

  selezioneTutteLeRigheCDData(e, come) {
    this.impostaSelezioneCD = new Array();
    this.filterGroupByCDD = '';
    e.forEach(element => {
      this.impostaSelezioneCD.push(element.ROW_ID);
      this.filterGroupByCDD += element.FILTER_GROUP_BY + ',';
    });
    if (this.filterGroupByCDD.length > 0) {
      this.filterGroupByCDD = this.filterGroupByCDD.substring(0, this.filterGroupByCDD.length - 1);
    }
    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
    this.cdrData.caricaCDRData(this);
    // }, 100);
  }

  selezioneTutteLeRigheCDVoice(e, come) {
    this.impostaSelezioneCS = new Array();
    this.filterGroupByCDR = '';
    e.forEach(element => {
      this.impostaSelezioneCS.push(element.ROW_ID);
      this.filterGroupByCDR += element.FILTER_GROUP_BY + ',';
    });
    if (this.filterGroupByCDR.length > 0) {
      this.filterGroupByCDR = this.filterGroupByCDR.substring(0, this.filterGroupByCDR.length - 1);
    }
    // this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, this.impostaSelezioneCS, this.filterGroupByCDR);
    // this.filterGroupByCDR = e.FILTER_GROUP_BY;
    // const tm = setTimeout(() => {
    //       clearTimeout(tm);
    this.cdrVoice.caricaCDRVoice(this);
  }

  selezionateTutteLeRigheMF(e, come) {
    logConsole('Selezionate tutte le righe', e, typeof(e));
    const impostaSelezioneMF = new Array();
    if (e[0]) {
      e.forEach(element => {
        impostaSelezioneMF.push(element.ID);
      });
    }
    this.impostaSelezioneMF = impostaSelezioneMF;
  }

  downloadMF() {
    logConsole('Download MF', this.impostaSelezioneMF);
    if (this.impostaSelezioneMF.length === 0) {
      alert('Please select a row');
      return;
    }
    this.downloadMF2();
  }

  staSalvando = false;
  progress = 0;

  downloadMF2() {
    if (this.staSalvando) {
      return;
    }

    let tag = '';
    let cosa = '';
    let ok = false;
    const quante = this.impostaSelezioneMF.length - 1;

    this.progress = 0;
    let quale = 0;
    this.staSalvando = true;
    const t = setInterval(() => {
      if (ok === true) {
        clearInterval(t);

        this.staSalvando = false;
        logConsole('Download MF 2 esco');
      }
    }, 1000);

    this.impostaSelezioneMF.forEach(element => {
      const params = '{' +
        '"v_cntx_id": "' + this.sessionID2 + '",' +
        '"v_flow_segment_id": ' + element + ' ' +
      '}';
      logConsole('Download MF 2', element, quale, quante);

      this.apiService.chiamataPost(this.Utils, 'mistral_flow_segment__download', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data2: any) => {
        logConsole('Ritorno DL MF', data2);

        if (data2 && data2 !== null) {
          if (data2.v_err_code && data2.v_err_code === 2) {
          } else {
            let NomeFile = 'Mistral_Flow_Segment_' + element + '.json';

            let mimeType = 'application/octet-stream';
            const byteBuf = this.u_atob(data2); // atob(data);

            const data3 = new Blob([byteBuf], {type: mimeType});
            
            download(data3, NomeFile, mimeType);

            this.progress = Math.round((quale + 1) / (quante + 1) * 100);
          }
        }

        quale++;
        if (quale > quante) {
          ok = true;
        }
      }, error => {
        console.error('mistral_flow_segment__download error: ', error, error.message);
        ok = true;
      });
    });
  }

  u_atob(ascii) {
    return Uint8Array.from(atob(ascii), c => c.charCodeAt(0));
  }

  apertoJsonMF = false;
  dimeJsonMF1 = 100;
  dimeJsonMF2 = 0;

  fGetMF() {
    this.apertoJsonMF = !this.apertoJsonMF;

    if (this.apertoJsonMF) {
      this.dimeJsonMF1 = 60;
      this.dimeJsonMF2 = 40;
      if (this.mfSelezionato) {
        this.prendeJsonMF(this.mfSelezionato, 'GET MF');
      }
    } else {
      this.dimeJsonMF1 = 100;
      this.dimeJsonMF2 = 0;
    }

    logConsole('Json MF', this.apertoJsonMF, this.dimeJsonMF1, this.dimeJsonMF2);
  }

  testoJsonMF = '';

  prendeJsonMF(e, daDove) {
    logConsole('Get JSON 1', daDove);
    /* if (this.apertoJsonMF === false) {
      if (this.impostaPaginaMF !== undefined) {
        const t = setTimeout(() => {
          clearTimeout(t);
          
          logConsole('Imposto pagina MF 1:', daDove, this.impostaPaginaMF);
          this.impostaPaginaMF2 = this.impostaPaginaMF;
        }, 1000);
      }

      return;
    } */

    const params = '{' +
      '"v_cntx_id": "' + this.sessionID2 + '",' +
      '"v_flow_segment_id": ' + e.ID + '' +
    '}';
    logConsole('Get JSON 2', daDove, JSON.parse(params));

    this.apiService.chiamataPost(this.Utils, 'mistral_flow_segment__get', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe((data2: any) => {
      logConsole('Ritorno GET Json MF', data2);

      if (data2 && data2 !== null) {
        if (data2.v_err_code && data2.v_err_code === 2) {
        } else {
          // this.progress = Math.round((quale + 1) / (quante + 1) * 100);
          this.totaleRigheJsonMF = this.countAllRowsSafe(data2.v_content_json);
          logConsole('Numero righe Json MF:', daDove, this.totaleRigheJsonMF);
          this.testoJsonMF = data2.v_content_json;
        }
      }

      /* if (this.impostaPaginaMF !== undefined) {
        const t = setTimeout(() => {
          clearTimeout(t);
          
          logConsole('Imposto pagina MF 2:', daDove, this.impostaPaginaMF);
          // this.impostaPaginaMF2 = this.impostaPaginaMF;
        }, 1000);
      } */
    }, error => {
      console.error('mistral_flow_segment__get error: ', error, error.message);
    });
  }

  totaleRigheJsonMF = 0;
  bloccaCaricamentoJsonMF = undefined;

  countAllRowsSafe(json: any, visited = new WeakSet<any>()): number {
    if (json === null || typeof json !== 'object') return 0;

    if (visited.has(json)) return 0;
    visited.add(json);

    let count = 0;

    if (Array.isArray(json)) {
      for (const item of json) {
        count += 1; // conta l'elemento
        count += this.countAllRowsSafe(item, visited);
      }
    } else {
      for (const key in json) {
        if (Object.prototype.hasOwnProperty.call(json, key)) {
          count += 1; // conta la chiave
          count += this.countAllRowsSafe(json[key], visited);
        }
      }
    }

    return count;
  }

  eseguitoClickSuRigaMstat = false;

  clickRigaMStat(e) {
    this.eseguitoClickSuRigaMstat = true;
    logConsole('Click riga MStat', e);
    if (e[0]) { e = e[0]; }
    this.flowType = e.FLOW_TYPE;
    this.filterSelectedMQ = '[' + e.FILTER + ']';
    this.filterMQEmit.emit(this.filterSelectedMQ);

    // logConsole('Click riga MStat - flow type e filter', this.flowType, this.filterSelectedMQ);
    this.mistral_flow_stat.caricaMFStat2(this, 'ClickRigaMStat');

    const m = setTimeout(() => {
      clearTimeout(m);

      this.eseguitoClickSuRigaMstat = false;
    }, 500);
  }

  riempieArraySelezioneMStat(rit) {
    if (this.eseguitoClickSuRigaMstat) {
      return;
    }

    logConsole('Click riga check MStat', rit);

    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneMStat = new Array();
    let filt = '';
    e.forEach(element => {
      this.impostaSelezioneMStat.push(element.ROW_ID);
      filt += element.FILTER + ',';
    });
    
    this.filterSelectedMQ = '[' + filt.substring(0, filt.length - 1) + ']';
    this.filterMQEmit.emit(this.filterSelectedMQ);
  }

  refreshMistralMStat(r) {
    if (r === true) {
      this.datiMistralFStat = undefined;
    }
    this.lastCallMFStat[this.NumeroFrame2] = '';
    this.mistral_flow_stat.caricaMFStat1(this, 'RefreshMStat');
  }

  eseguitoClickSuRigaMstat2 = false;

  clickRigaMStat2(e) {
    this.eseguitoClickSuRigaMstat2 = true;
    logConsole('Click riga MStat2', e);
    this.impostaPaginaMF = undefined;
    if (e[0]) { e = e[0]; }
    this.flowType = e.FLOW_TYPE;
    this.filterSelectedMQ = '[' + e.FILTER + ']';
    this.filterMQEmit.emit(this.filterSelectedMQ);

    const m = setTimeout(() => {
      clearTimeout(m);

      this.eseguitoClickSuRigaMstat2 = false;
    }, 500);
  }

  riempieArraySelezioneMStat2(rit) {
    if (this.eseguitoClickSuRigaMstat2) {
      return;
    }

    logConsole('Click riga check MStat2', rit);

    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneMStat2 = new Array();
    let filt = '';
    e.forEach(element => {
      this.impostaSelezioneMStat2.push(element.ROW_ID);
      filt += element.FILTER + ',';
    });
    
    this.filterSelectedMQ = '[' + filt.substring(0, filt.length - 1) + ']';
    this.filterMQEmit.emit(this.filterSelectedMQ);

  }

  refreshMistralMStat2(r) {
    if (r === true) {
      this.datiMistralFStat2 = undefined;
    }
    this.lastCallMFStat2[this.NumeroFrame2] = '';
    this.mistral_flow_stat.caricaMFStat2(this, 'RefreshMStat');
  }

  clickRigaMQ(e) {
    logConsole('Click riga MQ', e);
  }

  riempieArraySelezioneMQ(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneMQ = new Array();
    e.forEach(element => {
      this.impostaSelezioneMQ.push(element.ROW_ID);
    });
  }

  refreshMistralMQ(r) {
    if (r === true) {
      this.datiMistralFQ = undefined;
    }
    this.lastCallMQ[this.NumeroFrame2] = '';
    this.mistral_flow_queue.caricaMQ(this, 'RefreshMQ');
  }

  clickRigaMR(e) {
    logConsole('Click riga MR', e);
  }

  riempieArraySelezioneMR(rit) {
    const e = rit.dati;
    const sel = rit.selezionato;
    const desel = rit.deselezionato;
    this.debug2 && this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, e);
    this.impostaSelezioneMR = new Array();
    e.forEach(element => {
      this.impostaSelezioneMR.push(element.ROW_ID);
    });
  }

  refreshMistralMR(r) {
    if (r === true) {
      this.datiMistralR = undefined;
    }
    this.lastCallMR[this.NumeroFrame2] = '';
    this.mistral_rbc_ixl.caricaMR(this, 'RefreshMR');
  }

  visibileMascheraMistralFilter = false;
  parametriR2 = {
    v_filter_route: '', 
    v_filter_line: '', 
    v_filter_from: '', 
    v_filter_to: '', 
    v_filter_desc: '', 
    v_filter_param: '', 
    v_filter_value: '', 
    v_filter_idname: '',
    v_max_rows: 5000
  }

  parametriR22 = {
    v_filter_route: '', 
    v_filter_line: '', 
    v_filter_from: '', 
    v_filter_to: '', 
    v_unique_id: '', 
    v_filter_info: '',
    v_filter_cdn_info: '', 
    v_filter_id: '',
    v_filter_cdn_status: '',
    v_filter_flow_type: '',
    v_max_rows: 5000
  }

  /* clickSuMistralFilters() {
    logConsole('Click su Mistral Filters');
    this.parametriR2 = JSON.parse(JSON.stringify(this.parametriR));

    this.visibileMascheraMistralFilter = true;
  } */

  fViewModeMS(e) {
    logConsole('View mode MS', e);
    this.viewModeMS2 = e;
    this.viewModeMSEmit.emit(e);

    this.mistral_flow_stat.caricaMFStat1(this, 'ClickRigaMStat');
    // this.mistral_flow_stat.caricaMFStat2(this, 'ClickRigaMStat');
  }

  fFlowTypeMS(e) {
    logConsole('Flow type MS', e);
    this.flowTypeMS2 = e;
    this.flowTypeMSEmit.emit(e);

    this.mistral_flow_stat.caricaMFStat1(this, 'ClickRigaMStat');
    // this.mistral_flow_stat.caricaMFStat2(this, 'ClickRigaMStat');
  }

  fIsStandaloneMR(e) {
    logConsole('Is standalone MR', e);
    this.isStandAloneMR2 = e;
    this.isStandAloneMREmit.emit(e);
    this.gestisceSplitStandAlone();
    switch(this.MappaOGrafico) {
      case 'MR':
        this.mistral_rbc_ixl.caricaMR(this, 'StandAloneMR');
        break;
      case 'MF':
        this.mistral_flow.caricaMF(this, 'StandAloneMF');
        break;
    }
  }

  lookUpTable1;
  lookUpTable2;
  datiParametriR2; // {VALUE: "", CATEGORY: "desc"}
  datiParametriR22; // {VALUE: "", CATEGORY: "desc"}
  aggiungeRigaFilterLine;
  finestraComboParametriR = false;
  qualeModifica = -1;
  campoCombo = '';
  posizioneFinestraFilter = { x: 0, y: 0 };
  sizeStandAlone1 = 100;
  sizeStandAlone2 = 0;
  stringaRicercaDentroLookUp;

  @ViewChild('divFiltri') divFiltri!: ElementRef;
  @ViewChild('divFiltri2') divFiltri2!: ElementRef;

  apriFinestraComboParametriR(n, q) {
    switch (n) {
      case 1:
        if (!this.parametriR1[this.NumeroFrame2]) {
          this.parametriR1[this.NumeroFrame2] = JSON.parse(JSON.stringify(this.parametriR2));
        }
        break;
      case 2:
        if (!this.parametriR12[this.NumeroFrame2]) {
          this.parametriR12[this.NumeroFrame2] = JSON.parse(JSON.stringify(this.parametriR22));
        }
        break;
    }

    let rect;

    switch (n) {
      case 1:
        rect = this.divFiltri.nativeElement.getBoundingClientRect();
        break;
      case 2:
        rect = this.divFiltri2.nativeElement.getBoundingClientRect();
        break;
    }

    const x = rect.left + 50;
    const y = rect.top - 50;

    this.posizioneFinestraFilter = { x: x, y: y };
    // logConsole('Posizione', this.posizioneFinestraFilter);

    this.finestraComboParametriR = true;
    this.qualeModifica = q;
    const datiParametri = new Array();
    let stringaRicercaDentroLookUp = '';

    switch(n) {
      case 1:
        switch(q) {
          case 1:
            this.campoCombo = this.parametriR2.v_filter_line;
            stringaRicercaDentroLookUp = 'line';
            break;
          case 2:
            this.campoCombo = this.parametriR2.v_filter_from;
            stringaRicercaDentroLookUp = 'from';
            break;
          case 3:
            this.campoCombo = this.parametriR2.v_filter_to;
            stringaRicercaDentroLookUp = 'to';
            break;
          case 4:
            this.campoCombo = this.parametriR2.v_filter_idname;
            stringaRicercaDentroLookUp = 'idName';
            break;
          case 5:
            this.campoCombo = this.parametriR2.v_filter_param;
            stringaRicercaDentroLookUp = 'param';
            break;
          case 6:
            this.campoCombo = this.parametriR2.v_filter_desc;
            stringaRicercaDentroLookUp = 'desc';
            break;
          }
        break;

      case 2:
        switch(q) {
          case 1:
            this.campoCombo = this.parametriR22.v_filter_line;
            stringaRicercaDentroLookUp = 'line';
            break;
          case 2:
            this.campoCombo = this.parametriR22.v_filter_from;
            stringaRicercaDentroLookUp = 'from';
            break;
          case 3:
            this.campoCombo = this.parametriR22.v_filter_to;
            stringaRicercaDentroLookUp = 'to';
            break;
          case 4:
            this.campoCombo = this.parametriR22.v_unique_id;
            stringaRicercaDentroLookUp = 'uniqueid';
            break;
          case 5:
            this.campoCombo = this.parametriR22.v_filter_info;
            stringaRicercaDentroLookUp = 'info';
            break;
          case 6:
            this.campoCombo = this.parametriR22.v_filter_cdn_status;
            stringaRicercaDentroLookUp = 'cdn_status';
            break;
          case 7:
            this.campoCombo = this.parametriR22.v_filter_cdn_info;
            stringaRicercaDentroLookUp = 'cdn_info';
            break;
          case 8:
            this.campoCombo = this.parametriR22.v_filter_id;
            stringaRicercaDentroLookUp = 'id';
            break;
          case 9:
            this.campoCombo = this.parametriR22.v_filter_flow_type;
            stringaRicercaDentroLookUp = 'flow_type';
            break;
        }
        break;
    }

    this.stringaRicercaDentroLookUp = stringaRicercaDentroLookUp;

    switch (n) {
      case 1:
        logConsole('Dati lookup: ', this.lookUpTable1, stringaRicercaDentroLookUp);
        if (this.lookUpTable1) {
          if (stringaRicercaDentroLookUp !== '') {
            if (this.lookUpTable1[stringaRicercaDentroLookUp]) {
              logConsole('Dati lookup: ', this.lookUpTable1[stringaRicercaDentroLookUp]);
              this.lookUpTable1[stringaRicercaDentroLookUp].forEach(element => {
                // if (element.CATEGORY === stringaRicercaDentroLookUp) {
                  datiParametri.push(element);
                // }
              });
              this.datiParametriR2 = JSON.parse(JSON.stringify(datiParametri));
            } else {
              this.datiParametriR2 = undefined;
            }
          } else {
            this.datiParametriR2 = undefined;
          }
        } else {
          this.datiParametriR2 = undefined;
        }
        break;
      case 2:
        logConsole('Dati lookup: ', this.lookUpTable2, stringaRicercaDentroLookUp);
        if (this.lookUpTable2) {
          if (stringaRicercaDentroLookUp !== '') {
            if (this.lookUpTable2[stringaRicercaDentroLookUp]) {
              logConsole('Dati lookup: ', this.lookUpTable2[stringaRicercaDentroLookUp]);
              this.lookUpTable2[stringaRicercaDentroLookUp].forEach(element => {
                // if (element.CATEGORY === stringaRicercaDentroLookUp) {
                  datiParametri.push(element);
                // }
              });
              this.datiParametriR22 = JSON.parse(JSON.stringify(datiParametri));
            } else {
              this.datiParametriR22 = undefined;
            }
          } else {
            this.datiParametriR22 = undefined;
          }
        } else {
          this.datiParametriR22 = undefined;
        }
        break;
    }
  }

  cambioParametriR2(e) {
    logConsole('Cambio parametri filter line', e, this.qualeModifica);

    switch (this.MappaOGrafico) {
      case 'MR':
        // this.finestraComboParametriR = false;
        switch(this.qualeModifica) {
          case 1:
            this.parametriR2.v_filter_line = e;
            break;
          case 2:
            this.parametriR2.v_filter_from = e;
            break;
          case 3:
            this.parametriR2.v_filter_to = e;
            break;
          case 4:
            this.parametriR2.v_filter_idname = e;
            break;
          case 5:
            this.parametriR2.v_filter_param = e;
            break;
          case 6:
            this.parametriR2.v_filter_desc = e;
            break;
        }
        break;
      case 'MF':
        // this.finestraComboParametriR = false;
        switch(this.qualeModifica) {
          case 1:
            this.parametriR22.v_filter_line = e;
            break;
          case 2:
            this.parametriR22.v_filter_from = e;
            break;
          case 3:
            this.parametriR22.v_filter_to = e;
            break;
          case 4:
            this.parametriR22.v_unique_id = e;
            break;
          case 5:
            this.parametriR22.v_filter_info = e;
            break;
          case 6:
            this.parametriR22.v_filter_cdn_status = e;
            break;
          case 7:
            this.parametriR22.v_filter_cdn_info = e;
            break;
          case 8:
            this.parametriR22.v_filter_id = e;
            break;
          case 9:
            this.parametriR22.v_filter_flow_type = e;
            break;
        }
        break;
    }
  }

  inviaFiltriMistral() {
    logConsole('Invio filtro mistral per pagina', this.NumeroFrame2, this.MappaOGrafico);

    switch (this.MappaOGrafico) {
      case 'MR':
        this.parametriR1[this.NumeroFrame2] = JSON.parse(JSON.stringify(this.parametriR2));
        // logConsole('Parametri da inviare', this.parametriR);
        this.chiudeMascheraMistralFilter();

        this.mistral_rbc_ixl.caricaMR(this, 'RefreshMRPerFiltri');
        break;
      case 'MF':
        this.parametriR12[this.NumeroFrame2] = JSON.parse(JSON.stringify(this.parametriR22));
        logConsole('Parametri da inviare', this.parametriR12[this.NumeroFrame2]);
        this.chiudeMascheraMistralFilter();

        this.mistral_flow.caricaMF(this, 'RefreshMRPerFiltri');
        break;
    }
  }

  chiudeMascheraMistralFilter() {
    this.finestraComboParametriR = false;
  }

  gestisceSplitStandAlone() {
    if (!this.isStandAloneMR2) {
      this.sizeStandAlone1 = 100;
      this.sizeStandAlone2 = 0;
    } else {
      this.sizeStandAlone1 = 70;
      this.sizeStandAlone2 = 30;
    }
  }

  paramsPerSS = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  queryPerSS = ExternalUtilities.creaVettore(environment.quantiFrames, '');

  apriNuovoTab() {
    const stringify = {
      Context: this.sessionID2,
      Query: this.queryPerSS[this.NumeroFrame2],
      Params: this.paramsPerSS[this.NumeroFrame2],
      UrlServer: this.Utils.serverPostRest
    }
    logConsole('Parametri: ', stringify);
    const pars = ExternalUtilities.criptaPerSpreadSheet(JSON.stringify(stringify));
    // URL corrente
    const currentUrl = window.location.href;
    // es: https://antsgraclient.ants-aubay.it/gdpsondamistral/geoantsweb/Mappe/?foo=bar#section
    // Crea oggetto URL
    const url = new URL(currentUrl);
    // Rimuove eventuali query e hash
    url.search = '';
    url.hash = '';
    // Divide il pathname in segmenti
    const segments = url.pathname.split('/').filter(seg => seg.length > 0);
    // Rimuove l'ultimo segmento
    segments.pop();
    // Ricostruisce il pathname con il nuovo segmento
    url.pathname = '/' + segments.join('/') + '/SpreadSheet/';
    // Aggiunge i parametri desiderati
    url.searchParams.set('Par', pars);
    // URL finale
    let newUrl = url.toString();
    const inizio = newUrl.substring(0, 10);
    let fine = newUrl.replace(inizio, '');
    fine = fine.replace('//', '/');
    newUrl = inizio + fine;
    logConsole('Url da richiamare:', newUrl, ' (' + inizio + ') - (' + fine + ')');
    window.open(newUrl, '_blank');
  }

  controlloColoreIcona(n: number): string {
    let ok = false;

    switch (n) {
      case 1:
        if (!this.parametriR1[this.NumeroFrame2]) {
          this.parametriR1[this.NumeroFrame2] = JSON.parse(JSON.stringify(this.parametriR2));
        }
        ok = (JSON.stringify(this.parametriR1[this.NumeroFrame2]) !== JSON.stringify(this.parametriR2));
        // logConsole('Controllo: ', ok, JSON.stringify(this.parametriR1), JSON.stringify(this.parametriR2));
        break;

      case 2:
        if (!this.parametriR12[this.NumeroFrame2]) {
          this.parametriR12[this.NumeroFrame2] = JSON.parse(JSON.stringify(this.parametriR22));
        }
        ok = (JSON.stringify(this.parametriR12[this.NumeroFrame2]) !== JSON.stringify(this.parametriR22));
        // logConsole('Controllo: ', ok, JSON.stringify(this.parametriR12), JSON.stringify(this.parametriR22));
        break;
    }

    return ok
      ? 'brightness(0) saturate(100%) invert(32%) sepia(98%) saturate(749%) hue-rotate(330deg) brightness(95%) contrast(101%)'
      : 'none';
  }

  tastoSpreadsheet = false;

  gestisceTastoSS() {
    // logConsole('Tasto ss', this.userName2);
    this.tastoSpreadsheet = false;
    if (this.userName2.indexOf('Luigi.Pecce') > -1) {
      this.tastoSpreadsheet = true;
      // logConsole('Tasto ss ATTIVO');
    }
  }

  downloadAE() {
    logConsole('Download AE');
    this.eventsComponent.prendeEvents(this, true, false, true); // , -3
  }

  lastCallHistogram2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallActivities2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallAreaInfo2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallArfcn2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallArfcnAM2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallCDData2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallCDVoice2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallCM2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallMC2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallMF2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallMFStat22 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallMQ2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallMR2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallClusterGrid2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallEventi2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallGrafici2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallMeasureDFN2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallMosaicGrid2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallNP2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallPareto2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallPLI2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallAP2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallM2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallScatter2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallTCRun2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallPI2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallPM2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');
  lastCallPK2 = ExternalUtilities.creaVettore(environment.quantiFrames, '');

  apiCall = '';

  prendeCallApi() {
    let apiCall = '';

    switch(this.MappaOGrafico2) {
      case 'AH':
    	  apiCall = this.lastCallHistogram2[this.NumeroFrame2];
        break;
      case 'LA':
			  apiCall = this.lastCallActivities2[this.NumeroFrame2];
        break;
      case 'AI':
			  apiCall = this.lastCallAreaInfo2[this.NumeroFrame2];
        break;
      case 'AR':
			  apiCall = this.lastCallArfcn2[this.NumeroFrame2];
        break;
      case 'AA':
			  apiCall = this.lastCallArfcnAM2[this.NumeroFrame2];
        break;
      case 'CD':
			  apiCall = this.lastCallCDData2[this.NumeroFrame2];
        break;
      case 'CV':
			  apiCall = this.lastCallCDVoice2[this.NumeroFrame2];
        break;
      case 'CM':
			  apiCall = this.lastCallCM2[this.NumeroFrame2];
        break;
      case 'MC':
			  apiCall = this.lastCallMC2[this.NumeroFrame2];
        break;
      case 'MF':
			  apiCall = this.lastCallMF2[this.NumeroFrame2];
        break;
      case 'MS':
			  apiCall = this.lastCallMFStat22[this.NumeroFrame2];
        break;
      case 'MQ':
			  apiCall = this.lastCallMQ2[this.NumeroFrame2];
        break;
      case 'MR':
			  apiCall = this.lastCallMR2[this.NumeroFrame2];
        break;
      case 'CG':
			  apiCall = this.lastCallClusterGrid2[this.NumeroFrame2];
        break;
      case 'AE':
			  apiCall = this.lastCallEventi2[this.NumeroFrame2];
        break;
      case 'MD':
			  apiCall = this.lastCallMeasureDFN2[this.NumeroFrame2];
        break;
      case 'MG':
			  apiCall = this.lastCallMosaicGrid2[this.NumeroFrame2];
        break;
      case 'NP':
			  apiCall = this.lastCallNP2[this.NumeroFrame2];
        break;
      case 'PC':
			  apiCall = this.lastCallPareto2[this.NumeroFrame2];
        break;
      case 'PL':
			  apiCall = this.lastCallPLI2[this.NumeroFrame2];
        break;
      case 'AP':
			  apiCall = this.lastCallAP2[this.NumeroFrame2];
        break;
      case 'PK':
			  apiCall = this.lastCallPK2[this.NumeroFrame2];
        break;
      case 'PS':
			  apiCall = this.lastCallScatter2[this.NumeroFrame2];
        break;
      case 'TC':
			  apiCall = this.lastCallTCRun2[this.NumeroFrame2];
        break;
      case 'PM':
			  apiCall = this.lastCallPM2[this.NumeroFrame2];
        break;
      default:
        apiCall = '';
        break;
    }

    logConsole('CallAPI: Mappa O Grafico', this.MappaOGrafico2, apiCall);
    this.apiCall = apiCall;
  }

  impostaAssi(rangeSuperioreAUnGiorno: boolean) {
    const cJS = this.CanvJS;
    let formato = 'HH:mm:ss';
    if (rangeSuperioreAUnGiorno === true) {
      formato = 'DD-MM-YY HH:mm';
    }
    logConsole('Imposta asse X. Maggiore di un giorno:', rangeSuperioreAUnGiorno, 'Formato:', formato);

    this.axisXConTempoVisibile = {    // crosshair: {
      //   enabled: true
      // },
      labelFormatter: function (e) {
        return cJS.formatDate(e.value, formato);
      },
      fontWeight: 'normal',
      fontFamily: 'arial',
      // labelAngle: -70
      lineColor: this.axisColor,
      gridColor: this.axisColor,
      labelFontColor: '#aaaaaa',
      tickColor: '#c6c6c6',
      viewPortMinimum: 0,
      viewPortMaximum: 0,
      /* minimum: 0,
      maximum: 0, */
      crosshair: {
        enabled: true,
        color: 'red',
        thickness: 2,
        lineDashType: 'dot',
        // snapToDataPoint: true,
        labelFormatter: function (e) {
          return cJS.formatDate( e.value, formato);
        }
      },
      // tickLength: 0,
      // labelFontSize: 0,
      // margin: -3
    };

    this.axisXConValueVisibile = {    // crosshair: {
      //   enabled: true
      // },
      labelFormatter: function (e) {
        return e.label; //  r.CanvJS.currentValue.formatDate(e.value, 'HH:mm:ss');
      },
      fontWeight: 'normal',
      fontFamily: 'arial',
      // labelAngle: -70
      lineColor: this.axisColor,
      gridColor: this.axisColor,
      labelFontColor: '#aaaaaa',
      tickColor: '#c6c6c6',
      viewPortMinimum: 0,
      viewPortMaximum: 0,
      /* minimum: 0,
      maximum: 0, */
      crosshair: {
        enabled: true,
        color: 'red',
        thickness: 2,
        lineDashType: 'dot',
        // snapToDataPoint: true,
        labelFormatter: function (e) {
          return e.label; //  r.CanvJS.currentValue.formatDate( e.value, 'HH:mm:ss');
        }
      },
      // tickLength: 0,
      // labelFontSize: 0,
      // margin: -3
    };

    this.axisXSenzaTempoVisibile = {    // crosshair: {
      //   enabled: true
      // },
      labelFormatter: function (e) {
        return cJS.formatDate( e.value, formato);
      },
      fontWeight: 'normal',
      fontFamily: 'arial',
      // labelAngle: -70
      lineColor: this.axisColor,
      gridColor: this.axisColor,
      labelFontColor: '#aaaaaa',
      tickColor: '#c6c6c6',
      viewPortMinimum: 0,
      viewPortMaximum: 0,
      crosshair: {
        enabled: true,
        color: 'red',
        thickness: 2,
        lineDashType: 'dot',
        // snapToDataPoint: true,
        labelFormatter: function (e) {
          return cJS.formatDate( e.value, formato);
        }
      },
      tickLength: 0,
      labelFontSize: 0,
      margin: -3
    };
  }

  cambioPaginaMF(e) {
    // alert('Cambio pagina MF: ' + e.pagina);
    // this.datiDiProvaGrid = 'empty grid';
    if (e.pagina) {
      this.impostaPaginaMF2 = e.pagina;
    }
    
    logConsole('Cambio pagina mf', e);
  }

  clickSelezioneAGNoACT(e) {
    logConsole('Click selezione AGNoACT', e);

    this.impostaAGNoACT.emit(e);
  }
}

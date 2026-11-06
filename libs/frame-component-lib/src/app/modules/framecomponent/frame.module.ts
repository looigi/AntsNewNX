import { ExternalModalService } from './services/externalmodal.service';
import { TCRunInfoComponent } from './elaborations/traceinfo.component';
import { PlanimetryComponent } from './elaborations/planimetry.component';
import { AntenneComponent } from './elaborations/antenne.component';
import { PuntoSelezionatoComponent } from './elaborations/puntoselezionato.component';
import { LegendaComponent } from './elaborations/legenda.component';
import { CellMeasuresComponent } from './elaborations/cellmeasures.component';
import { PathComponent } from './elaborations/path.component';
import { ParetoComponent } from './elaborations/pareto.component';
import { HistogramComponent } from './elaborations/histogram.component';
import { ScatterComponent } from './elaborations/scatter.component';
import { SynopticComponent } from './elaborations/synoptic.component';
// import { PivotComponent } from './elaborations/pivot.component';
// import { GraficiComponent } from './elaborations/grafici.component';
import { MeasuresComponent } from './elaborations/measures.component';
import { ExportComponent } from './elaborations/export.component';
import { EventsComponent } from './elaborations/events.component';
import { PointCMComponent } from './elaborations/pointcellmeasures.component';
import { PointComponent } from './elaborations/point.component';
import { GestioneGrafici } from './elaborations/GestioneGrafici.component';
import { CDRDataComponent } from './elaborations/cdr_data.component';
import { CDRVoiceComponent } from './elaborations/cdr_voice.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { TraceRunInfoComponent } from './traceruninfo/traceruninfo.component';
import { EditPlanimetryComponent } from './editplanimetry/editplanimetry.component';
// import { SettingsComponentVecchio } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// KENDO UI modules
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonsModule} from '@progress/kendo-angular-buttons';
import {GridModule, PDFModule, ToolbarComponent} from '@progress/kendo-angular-grid';
import {LayoutModule} from '@progress/kendo-angular-layout';
import {DropDownsModule} from '@progress/kendo-angular-dropdowns';
import {DateInputsModule} from '@progress/kendo-angular-dateinputs';
import {InputsModule} from '@progress/kendo-angular-inputs';
import {ChartModule} from '@progress/kendo-angular-charts';
import {SparklineModule} from '@progress/kendo-angular-charts';
import {ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule, PopupService } from '@progress/kendo-angular-popup';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
// import { TreeViewModule } from '@progress/kendo-angular-treeview';

import 'hammerjs';
import { FormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import {RouterModule, Routes} from '@angular/router';
// import { DialogComponent } from './dialog-box/dialog-component';
import { AngularDraggableModule } from 'angular2-draggable';

import { TooltipModule } from '@progress/kendo-angular-tooltip';

import { SafeHtmlPipe } from './safe_html';
import { MenusModule } from '@progress/kendo-angular-menu';
import { PagerModule } from '@progress/kendo-angular-pager';
import { GeneralModule } from 'ants-grid-lib';

// import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
// import { WjOlapModule } from '@grapecity/wijmo.angular2.olap';
// import { AgmCoreModule, MapsAPILoader } from '@agm/core';

import { ExternalApiService } from './services/externalapi.service';
import { ExternalSessionService } from './services/externalsession.service';
import { ExternalHttpClient } from './services/externalhttpclient.service';
import { ExternalDownloadFileService } from './services/externaldownloadFile.service';
import { MeasureDFNComponent } from './elaborations/measure_dfn.component';
import { MosaicGridComponent } from './elaborations/mosaicgrid.component';
import { ClusterGridComponent } from './elaborations/clustergrid.component';
import { AreaInfoComponent } from './elaborations/areainfo';
import { ArfcnComponent } from './elaborations/arfcn_grid.component';
import { ActivitiesComponent } from './elaborations/activities.component';
import { LayersDDComponent } from './elaborations/layers_dd.component';
import { ComboModule } from 'combo';
import { PointLayerInfoComponent } from './elaborations/point_layer_info.component';
import { AdditionalLayerComponent } from './elaborations/additional_layer';
import { ShowRaysAllLayerComponent } from './elaborations/rays_all_layer.component';
import { ExportGridComponent } from './elaborations/exportGrid';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
// import { ConfermaComponent } from './components/conferma/conferma.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { CsvComponent } from './csv/csv.component';
import { TCRunGridComponent } from './elaborations/tcrungrid.component';
import { NPSComponent } from './elaborations/npsgrid.component';
import { PuliziaComponent } from './elaborations/pulizia.component';
import { DisegnoMappe } from './elaborations/disegnomappe.component';
// import { AgmCoreModule, MapsAPILoader } from '@agm/core';
// import { FileSaverModule } from 'ngx-filesaver';
import { PlatformModule } from '@angular/cdk/platform';
// import { GeneralNewModule } from 'app-ants-grid-lib-new';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { EventFilterComponent } from './event_filter/eventfilter.component';
import { LogComponentInterno } from './log.component';
// import { JsonComponent } from './jsoncomponent/jsone.component';
import { GestioneGraficiAE } from './elaborations/grafici_activity_events';
import { jsonComponentModule } from 'jsoncomponent';
import { activitySetModule } from 'activitySet';
import { TraceRun2Component } from './tcrun2/tracerun2.component';
import { pivotModule } from 'pivot';
import { TemplatesComponent } from './templates/templates.component';
import { CommentPipe } from './safeComment';
import { AIComponent } from './templates/ai/ai.component';
import { AngularSplitModule } from 'angular-split';
import { ContaDimensioneArrayComponent } from './elaborations/contaDimensioniArray.component';
import { SettingsModule } from 'settings_component';
import { IconeComponent } from './icone/icone.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { ArfcnPointComponent } from './elaborations/arfcn_point.component';
import { ArfcnComponentAllMeasures } from './elaborations/arfcn_all_measures.component';
import { PopupForCheckComponent } from './popupForCheck/popupforcheck.component';
import { MistralGridComponent } from './elaborations/mistral_grid';
import { MistralFlowComponent } from './elaborations/mistral_flow';
import { MistralFlowStatComponent } from './elaborations/mistral_flow_stat';
import { MistralFlowQueueComponent } from './elaborations/mistral_flow_queue';
import { MistralRbcIxlComponent } from './elaborations/mistral_rbc_ixl';
import { NgxGraphModule } from '@swimlane/ngx-graph';
// import { ConfermaComponent } from './components/conferma/conferma.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ExternalFrameComponent } from './frame.component';

const appRoutes: Routes = [
];

@NgModule({ 
    declarations: [
        // DialogComponent,
        // SettingsComponentVecchio,
        EditPlanimetryComponent,
        ExternalFrameComponent,
        TemplatesComponent,
        // TemplatesAllComponent,
        TraceRunInfoComponent,
        TraceRun2Component,
        SafeHtmlPipe,
        // ConfermaComponent,
        CsvComponent,
        PopupForCheckComponent,
        EventFilterComponent,
        IconeComponent,
        // JsonComponent,
        CommentPipe,
        AIComponent,
        // AIAllComponent,
    ],
    imports: [
        activitySetModule,
        pivotModule,
        NgxGraphModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatIconModule,
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(appRoutes),
        /* AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAilWZFQRPUJ0u8KQPxQjNJssqe40GeTZE',
            libraries: ['places']
        }), */
        // Kendo UI modules
        GoogleMapsModule,
        PlatformModule,
        IndicatorsModule,
        ButtonsModule,
        PopupModule,
        GridModule,
        ExcelModule,
        LayoutModule,
        InputsModule,
        PDFModule,
        ToolBarModule,
        DateInputsModule,
        DropDownsModule,
        GeneralModule,
        SettingsModule,
        // GeneralNewModule,
        ChartModule,
        // TreeViewModule,
        ClipboardModule,
        SparklineModule,
        AngularDraggableModule,
        TooltipModule,
        AngularSplitModule,
        MenusModule,
        PagerModule,
        // WjGridModule,
        // WjOlapModule,
        InputsModule,
        ComboModule,
        MatDialogModule,
        MatButtonModule,
        // FileSaverModule,
        jsonComponentModule,
    ], providers: [
        CDRDataComponent,
        CDRVoiceComponent,
        ExternalModalService,
        DatePipe,
        ExternalApiService,
        // SplitComponent,
        PopupService,
        ExternalHttpClient,
        ExternalSessionService,
        ExternalDownloadFileService,
        GestioneGrafici,
        GestioneGraficiAE,
        PointComponent,
        PointLayerInfoComponent,
        AdditionalLayerComponent,
        PointCMComponent,
        EventsComponent,
        TCRunGridComponent,
        ExportComponent,
        MeasuresComponent,
        ActivitiesComponent,
        ContaDimensioneArrayComponent,
        // GraficiComponent,
        CDRDataComponent,
        // PivotComponent,
        ScatterComponent,
        SynopticComponent,
        HistogramComponent,
        CDRVoiceComponent,
        ParetoComponent,
        PathComponent,
        MosaicGridComponent,
        ClusterGridComponent,
        CellMeasuresComponent,
        MistralGridComponent,
        MistralFlowComponent,
        MistralRbcIxlComponent,
        MistralFlowStatComponent,
        MistralFlowQueueComponent,
        LegendaComponent,
        PuntoSelezionatoComponent,
        AntenneComponent,
        MeasureDFNComponent,
        PlanimetryComponent,
        TCRunInfoComponent,
        AreaInfoComponent,
        ArfcnComponent,
        ArfcnComponentAllMeasures,
        ArfcnPointComponent,
        LayersDDComponent,
        ShowRaysAllLayerComponent,
        ExportGridComponent,
        MatDialog,
        NPSComponent,
        PuliziaComponent,
        DisegnoMappe,
        LogComponentInterno,
        provideHttpClient(withInterceptorsFromDi())
    ],
    exports: [
        ExternalFrameComponent
    ]
})
export class FrameModule { }

import { MenuModule } from 'menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// import { ComboMiaComponent } from './components/combo/combo.component';
import { FrameModule } from 'frame-component-lib';
import { AggiunstaArrayComponent } from './components/frame/elaborations/aggiustaarray.component';
import { GestioneFinestreComponent } from './components/frame/gestione_frames';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
// import {FrameComponent} from './components/frame/frame.component';

import { AngularSplitModule } from 'angular-split';
import {AccordionModule} from 'primeng/accordion';

// import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
// import { WjOlapModule } from '@grapecity/wijmo.angular2.olap';

import { AngularDraggableModule } from 'angular2-draggable';
import { GeneralModule } from 'ants-grid-lib';

import { LayoutModule } from '@progress/kendo-angular-layout';

import {ExternalHttpClient} from '../db/httpclient.service';
import { HttpClientModule } from '@angular/common/http';
import {ApiService} from '../db/api.service';
import {SessionService} from '../db/session.service';

// import { ActivityComponent } from './components/activities/activity/activity.component';
// import { WindowComponent } from './window.component';
import { PortalModule } from '@angular/cdk/portal';
// import { SettingsComponent } from './components/settings/settings.component';
import { DashboardEditComponent } from './components/dashboard/dashboard-edit/dashboard-edit.component';
import { DashboardListComponent } from './components/dashboard/dashboard-list/dashboard-list.component';
import { SLAManagerComponent } from './components/sla/sla-manager/sla-manager.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { SlaEditComponent } from './components/sla/sla-edit/sla-edit.component';
import { SlaThrEditComponent } from './components/sla/sla-edit-thr/sla-edit-thr.component';
import { DashboardNameComponent } from './components/dashboard/dashboard-name/dashboard-name.component';
import { DownloadFileService } from '../db/downloadFile.service';
import { SafeHtmlPipe } from './safe_html';
// import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { ClickOutsideModule } from 'ng-click-outside';

import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { Utils } from './components/Utilities.component';
// import { DpDatePickerModule } from 'ng2-date-picker';
// import { DateTimeComponent } from './components/datetime-picker/datetime.component';
// import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
// import { ModuloAPKModule } from '../../node_modules/moduloapk';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LabelModule } from '@progress/kendo-angular-label';
// import { DatetimeLocalComponent } from './components/datetime-local/datetime-local.component';
import { BarraSuperioreModule } from 'barrasuperiore';
import { CalendarioModule } from 'calendario';
import { ComboModule } from 'combocomponent';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import {PlatformModule} from '@angular/cdk/platform';
import { ConfermaComponent } from './components/conferma/conferma.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
// import { ClipboardModule } from 'ngx-clipboard';
// import { NgxCaptureModule } from 'ngx-capture';
import { ClipboardModule } from 'ngx-clipboard';
import { ReportMD5Component } from './components/report_md5/report.component';
import { LogComponent } from './components/log.component';
import { ScreenShotComponent } from './screenshot';
// import { FileSaverModule } from 'ngx-filesaver';
import { activitySetModule } from 'actsetcomponent';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { MatIconModule } from '@angular/material/icon';
import { PopupForCheckComponent } from './components/popupForCheck/popupforcheck.component';

@NgModule({
  declarations: [
    AppComponent,
    // FrameComponent,
    // SettingsComponent,
    DashboardEditComponent,
    DashboardListComponent,
    SLAManagerComponent,
    SlaEditComponent,
    SlaThrEditComponent,
    DashboardNameComponent,
    // WindowComponent,
    SafeHtmlPipe,
    // DateTimeComponent,
    // DatetimeLocalComponent,
    ConfermaComponent,
    // ComboMiaComponent,
    // ActivityComponent,
    ReportMD5Component,
    PopupForCheckComponent
  ],
  /* entryComponents: [
    ConfermaComponent
  ], */
  imports: [
    activitySetModule,

    // NgxCaptureModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    IndicatorsModule,

    // ModuloAPKModule,
    // DpDatePickerModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    // LayoutModule,
    AngularSplitModule, // .forRoot(),
    AccordionModule,
    // HttpModule,
    MenuModule,
    HttpClientModule,
    // FrameComponent,
    FrameModule,
    GeneralModule,
    PortalModule,
    TooltipModule,
    // TreeViewModule,
    AngularDraggableModule,
    // WjGridModule,
    // WjOlapModule,
    ClickOutsideModule,

    /* AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAddKy4TRIM1_OKWNCZkc_twsl5uXeiWeo',
      libraries: ['places']
    }), */

    // Kendo UI modules
    ButtonsModule,
    PopupModule,
    GridModule,
    ExcelModule,
    InputsModule,
    PDFModule,
    MatIconModule,
    DropDownsModule,
    LabelModule,
    DateInputsModule,
    BarraSuperioreModule,
    CalendarioModule,
    ComboModule,
    // ModuloAPKModule,
    // ClipboardModule,
    ClipboardModule,
    PlatformModule,
    // FileSaverModule
  ],
  exports: [
  ],
  providers: [
    // AngularDateTimePickerModule,
    ExternalHttpClient,
    // MenuModule,
    SessionService,
    GestioneFinestreComponent,
    AggiunstaArrayComponent,
    ApiService,
    DownloadFileService,
    Utils,
    ComandiVocaliComponent,
    ScreenShotComponent,
    // DeviceDetectorService,
    DecimalPipe,
    LogComponent
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }

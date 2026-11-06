import { ExternalHttpClient } from './db/httpclient.service';
import { FrameModule } from 'frame-component-lib';
import { InternalFrameComponent } from './frame/frame.component';
import { DriveTestUnitsMngComponent } from './drive_test_units_mng/drive_test_units_mng.component';
import { DownloadFileService } from './db/downloadFile.service';
import { ApiService } from './db/api.service';
import { SessionService } from './db/session.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AngularSplitModule } from 'angular-split';
import { GeneralModule } from 'ants-grid-lib';
import { FormsModule } from '@angular/forms';
import { TestCampaignsComponent } from './test_campaigns/test_campaigns.component';
import { SingelAgentModeComponent } from './single_agent_mode/single_agent_mode.component';
import { GroupDefinitionComponent } from './group_definition/group_definition.component';
import { GroupConfigurationComponent } from './group_configuration/group_configuration.component';
import { ProfilesLibraryComponent } from './profiles_library/profiles_library.component';
import { TsLibraryComponent } from './ts_library/ts_library.component';
import { QueryPCKLibraryComponent } from './query_pck_library/query_pck_library.component';
import { MenuModule } from 'menu';
import { BarraSuperioreModule } from 'barrasuperiore';
// import { ComboMiaComponent } from './combo/combo.component';
import { CalendarioModule } from 'calendario';
import { ComboModule } from 'combocomponent';
// import { HtmlTextModule } from 'htmlcomponent';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { ConfermaComponent } from './conferma/conferma.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
// import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
// import { RichTextEditorAllModule, ToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import { TraceRunInfoComponent } from './traceruninfo/traceruninfo.component';
import { PopupForCheckComponent } from './popupForCheck/popupforcheck.component';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { AccordionModule } from 'primeng/accordion';

@NgModule({ 
    declarations: [
        AppComponent,
        TestCampaignsComponent,
        SingelAgentModeComponent,
        GroupDefinitionComponent,
        GroupConfigurationComponent,
        ProfilesLibraryComponent,
        TsLibraryComponent,
        QueryPCKLibraryComponent,
        DriveTestUnitsMngComponent,
        TraceRunInfoComponent,
        InternalFrameComponent,
        ConfermaComponent,
        PopupForCheckComponent,
        // ComboMiaComponent,
        ConfermaComponent
    ],
    bootstrap: [
        AppComponent
    ], 
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        TabStripModule,
        MatTabsModule,
        BrowserModule,
        AngularSplitModule,
        AppRoutingModule,
        FrameModule,
        FormsModule,
        MenuModule,
        GeneralModule,
        AccordionModule,
        // ModalModule.forRoot(),
        AngularDraggableModule,
        // AngularResizeEventModule,
        BarraSuperioreModule,
        CalendarioModule,
        ComboModule,
        // LayoutModule
    ],
    providers: [
        // AngularDateTimePickerModule,
        ExternalHttpClient,
        SessionService,
        ApiService,
        DownloadFileService,
        DatePipe,
        TraceRunInfoComponent,
        ComandiVocaliComponent,
        DecimalPipe,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }

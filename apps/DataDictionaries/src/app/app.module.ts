import { GeneralModule } from 'ants-grid-lib';
import { ClusterComponent } from './cluster/cluster.component';
import { ExternalHttpClient } from './db/httpclient.service';
import { DownloadFileService } from './db/downloadFile.service';
import { ApiService } from './db/api.service';
import { SessionService } from './db/session.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AngularSplitModule } from 'angular-split';
import { FormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AntennaComponent } from './antenna/antenna.component';
import { PlmnComponent } from './plmn/plmn.component';
import { MenuModule } from 'menu';
import { BarraSuperioreModule } from 'barra-superiore';
import { CalendarioModule } from 'calendario';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { ConfermaComponent } from './conferma/conferma.component';
import { PointLayerInfoComponent } from './point_layer_info.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { InternalFrameComponent } from './framemappa/frame.component';
import { ComboModule } from 'combo';
import { FrameModule } from 'frame-component-lib';
// import { FileSaverModule } from 'ngx-filesaver';
import { AngularDraggableModule } from 'angular2-draggable';
import { Accordion, AccordionModule } from 'primeng/accordion';

@NgModule({ 
    declarations: [
        AppComponent,
        AntennaComponent,
        ClusterComponent,
        PlmnComponent,
        InternalFrameComponent,
        ConfermaComponent,
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
        // AngularDateTimePickerModule,
        BrowserModule,
        AngularSplitModule,
        // HttpModule,
        FrameModule,
        AngularDraggableModule,
        FormsModule,
        DropDownsModule,
        Accordion,
        GeneralModule,
        MenuModule,
        BarraSuperioreModule,
        LayoutModule,
        CalendarioModule,
        ComboModule,
        AccordionModule
    ], 
    providers: [
        ExternalHttpClient,
        SessionService,
        ApiService,
        DownloadFileService,
        PointLayerInfoComponent,
        DatePipe,
        ComandiVocaliComponent,
        DecimalPipe,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }

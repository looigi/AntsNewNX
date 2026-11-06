import { ExternalHttpClient } from './db/httpclient.service';
// import { ComboMiaComponent } from './combo/combo.component';
import { DownloadFileService } from './db/downloadFile.service';
import { ApiService } from './db/api.service';
import { SessionService } from './db/session.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AngularSplitModule } from 'angular-split';
import { FormsModule } from '@angular/forms';
// import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
// import { GeneralModule } from 'ants-grid-lib';
import { SystemConfigurationComponent } from './system-configuration/system-configuration.component';
import { EventViewerComponent } from './event-viewer/event-viewer.component';
import { ServiceMonitorComponent } from './service-monitor/service-monitor.component';
import { EtlMonitorComponent } from './etl-monitor/etl-monitor.component';
import { DBObjectsComponent } from './db_objects/db_objects.component';
import { SessionsComponent } from './sessions/sessions.component';
import { MenuModule } from 'menu';
import {AccordionModule} from 'primeng/accordion';
import { BarraSuperioreModule } from 'barrasuperiore';
import { CalendarioModule } from 'calendario';
import { ComboModule } from 'combocomponent';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { ConfermaComponent } from './conferma/conferma.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GeneralModule } from 'ants-grid-lib';
import { AlarmViewerComponent } from './alarm-viewer/alarm-viewer.component';
import { GestioneGrafici } from './alarm-viewer/GestioneGrafici.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { SLAManagerComponent } from './sla/sla-manager/sla-manager.component';
import { SlaThrEditComponent } from './sla/sla-edit-thr/sla-edit-thr.component';
import Utils from './Utilities.component';
// import { FileSaverModule } from 'ngx-filesaver';

@NgModule({
  declarations: [
    AppComponent,
    SystemConfigurationComponent,
    EventViewerComponent,
    ServiceMonitorComponent,
    EtlMonitorComponent,
    DBObjectsComponent,
    SessionsComponent,
    ConfermaComponent,
    AlarmViewerComponent,
    SLAManagerComponent,
    SlaThrEditComponent,
    // ComboMiaComponent,
    ConfermaComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    // FileSaverModule,
    MatDialogModule,

    BrowserModule,
    AngularSplitModule,
    FormsModule,
    // DropDownsModule,
    GeneralModule,
    MenuModule,
    HttpClientModule,
    AccordionModule,
    BarraSuperioreModule,
    CalendarioModule,
    ComboModule,
    AngularDraggableModule
  ],
  providers: [
    ExternalHttpClient,
    SessionService,
    ApiService,
    DownloadFileService,
    Utils,
    DatePipe,
    ComandiVocaliComponent,
    GestioneGrafici
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

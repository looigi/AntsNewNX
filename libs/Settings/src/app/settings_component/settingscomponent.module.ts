// import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {AccordionModule} from 'primeng/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ComboModule } from 'combo';
import { CalendarioModule } from 'calendario';
import { AngularSplitModule } from 'angular-split';
import { AngularDraggableModule } from 'angular2-draggable';
import { AngularResizeEventModule } from 'angular-resize-event-package';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { ExternalHttpClient } from './services/externalhttpclient.service';
import { ExternalSessionService } from './services/externalsession.service';
import { ExternalApiService } from './services/externalapi.service';
import { SettingsComponentFrame } from './settingscomponent.component';
import { GeneralModule } from 'ants-grid-lib';

@NgModule({
  declarations: [
    SettingsComponentFrame,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GeneralModule,
    ComboModule,
    CalendarioModule,
    AngularSplitModule,
    AngularDraggableModule,
    AngularResizeEventModule,

    // ModalModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // DropDownsModule,
    // AccordionModule,

    TabStripModule
  ],
  exports: [ SettingsComponentFrame ],
  providers: [
    ExternalApiService,
    ExternalHttpClient,
    ExternalSessionService,
    // ExternalDownloadFileService,
  ]
})
export class SettingsModule { }

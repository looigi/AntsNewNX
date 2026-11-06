// import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {AccordionModule} from 'primeng/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ActSetComponent } from './actSet.component';
import { ComboModule } from 'combo';
import { GeneralModule } from 'ants-grid-lib';
import { AngularSplitModule } from 'angular-split';
import { ActivityEditComponent } from './activityEdit/activityEdit.component';
import { ApiService } from '../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ExternalHttpClient } from '../services/httpclient.service';
import { SessionService } from '../services/session.service';
import { Utils } from '../Utilities.component';
import { SafeHtmlPipe } from './mappa/safe_html';
import { MappaComponent } from './mappa/mappa.component';
import { PopupForCheckComponent } from './popupForCheck/popupforcheck.component';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
  declarations: [
    ActSetComponent,
    SafeHtmlPipe,
    ActivityEditComponent,
    MappaComponent,
    PopupForCheckComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GeneralModule,
    AngularSplitModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularDraggableModule,
    ComboModule,
  ],
  exports: [ ActSetComponent ],
  providers: [
    ExternalHttpClient,
    SessionService,
    Utils,
    ApiService,
  ]
})
export class activitySetModule { }

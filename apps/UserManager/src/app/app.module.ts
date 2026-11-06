// import { ComboMiaComponent } from './combo/combo.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DownloadFileService } from './db/downloadFile.service';
import { ApiService } from './db/api.service';
import { SessionService } from './db/session.service';
import { ExternalHttpClient } from './db/httpclient.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { AngularSplitModule } from 'angular-split';
import { GeneralModule } from 'ants-grid-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'menu';
import { BarraSuperioreModule } from 'barrasuperiore';
import { CalendarioModule } from 'calendario';
import { ComboModule } from 'combocomponent';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { ConfermaComponent } from './conferma/conferma.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    ConfermaComponent,
    // ComboMiaComponent,
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,

    BrowserModule,
    AngularSplitModule,
    AppRoutingModule,
    // HttpModule,
    MenuModule,
    FormsModule,
    // DropDownsModule,
    GeneralModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularDraggableModule,
    ModalModule.forRoot(),
    BarraSuperioreModule,
    CalendarioModule,
    ComboModule,
    MatDialogModule
  ],
  providers: [
    ExternalHttpClient,
    SessionService,
    ApiService,
    DownloadFileService,
    DatePipe,
    BsModalService,
    BsModalRef,
    ComandiVocaliComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

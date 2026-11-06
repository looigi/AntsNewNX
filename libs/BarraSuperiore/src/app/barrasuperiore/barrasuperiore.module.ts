import { ExternalHttpClient } from './httpclient.service';
import { SessionService } from './session.service';
import { ApiService } from './api.service';
import { BarraSuperioreComponent } from './barrasuperiore.component';
// import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ClickOutsideModule } from 'ng-click-outside';
import { ComandiVocaliComponent } from './comandi_vocali.component';

@NgModule({ declarations: [
        BarraSuperioreComponent,
    ],
    exports: [BarraSuperioreComponent], imports: [BrowserModule,
        FormsModule,
        // ModalModule.forRoot(),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ClickOutsideModule], providers: [
        // BsModalService,
        ApiService,
        SessionService,
        HttpClient,
        ExternalHttpClient,
        ComandiVocaliComponent,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class BarraSuperioreModule { }

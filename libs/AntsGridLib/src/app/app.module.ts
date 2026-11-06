import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneralModule } from './modules/general/general.module';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import {ApiService} from '../db/api.service';
import {SessionService} from '../db/session.service';
import { ExternalHttpClient } from '../db/httpclient.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GeneralModule
  ],
  providers: [
    HttpClient,
    ExternalHttpClient,
    SessionService,
    ApiService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }

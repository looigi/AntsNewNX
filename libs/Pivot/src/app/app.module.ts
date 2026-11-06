// import { pivotModule } from './pivot/pivot.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExternalHttpClient } from './db/httpclient.service';
import { SessionService } from './db/session.service';
import { ApiService } from './db/api.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Utils } from './Utilities.component';
import { AngularSplitModule } from 'angular-split';
import { pivotModule } from 'dist';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ], imports: [BrowserModule,
        AppRoutingModule,
        AngularSplitModule,
        pivotModule], providers: [
        ExternalHttpClient,
        SessionService,
        ApiService,
        Utils,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }

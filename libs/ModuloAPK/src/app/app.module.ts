import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ModuloAPKModule } from './moduloAPK/moduloapk.module';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        ModuloAPKModule], providers: [
        HttpClient,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }

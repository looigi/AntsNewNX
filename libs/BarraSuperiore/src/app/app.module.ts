import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiService } from './barrasuperiore/api.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { BarraSuperioreModule } from './barrasuperiore/barrasuperiore.module';
import { ComandiVocaliComponent } from './barrasuperiore/comandi_vocali.component';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        ClickOutsideModule,
        BarraSuperioreModule], providers: [ApiService, ComandiVocaliComponent, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }

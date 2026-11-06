import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { ApiService } from './services/api.service';
import { Routes, RouterModule } from '@angular/router';
import { MenuModule } from 'menu';
import { BarraSuperioreModule } from 'barrasuperiore';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { ExternalHttpClient } from './services/httpclient.service';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
// import { FileSaverModule } from 'ngx-filesaver';

const appRoutes: Routes = [
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MenuModule,
    RouterModule.forRoot(appRoutes),
    BarraSuperioreModule,
    // FileSaverModule,
    NgbCarouselModule,
  ],
  providers: [
    SessionService,
    ExternalHttpClient,
    ApiService,
    ComandiVocaliComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

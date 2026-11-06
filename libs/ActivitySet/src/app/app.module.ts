import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { activitySetModule } from './actSetComponent/actSet.module';
import { AngularDraggableModule } from 'angular2-draggable';
import { HttpClientModule } from '@angular/common/http';
import { ExternalHttpClient } from './services/httpclient.service';
import { SessionService } from './services/session.service';
import { Utils } from './Utilities.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    activitySetModule
  ],
  providers: [    
    SessionService,
    Utils,
    ExternalHttpClient,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

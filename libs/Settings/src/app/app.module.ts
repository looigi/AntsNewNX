import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Utils } from './Utilities.component';
import { SettingsModule } from 'public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SettingsModule
  ],
  providers: [
    Utils
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

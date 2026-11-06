import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarioModule } from './calendario/calendario.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CalendarioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

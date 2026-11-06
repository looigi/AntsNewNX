import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GeoSpreadSheetComponent } from './spreadsheet.component';
import { SpreadsheetModule } from '@progress/kendo-angular-spreadsheet';
import { ExternalApiService } from './servizi/externalapi.service';
import { ExternalHttpClient } from './servizi/externalhttpclient.service';
import { ExternalSessionService } from './servizi/externalsession.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    GeoSpreadSheetComponent // 👈 aggiunto qui
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // consigliato per Kendo
    SpreadsheetModule,
    HttpClientModule,
  ],
  exports: [
    GeoSpreadSheetComponent // 👈 se vuoi usarlo in altri moduli
  ],
  providers: [
    ExternalApiService,
    ExternalHttpClient,
    ExternalSessionService,
  ]
})
export class SpreadSheetModule {}

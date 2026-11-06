// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
// import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

// KENDO UI modules
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GridModule, PDFModule} from '@progress/kendo-angular-grid';
import {InputsModule} from '@progress/kendo-angular-inputs';
import { ChartsModule } from '@progress/kendo-angular-charts';
import {SparklineModule} from '@progress/kendo-angular-charts';
import {ExcelModule } from '@progress/kendo-angular-grid';
import { PagerModule } from '@progress/kendo-angular-pager';

// import 'hammerjs';
import { FormsModule } from '@angular/forms';

import {ModalService} from './services/modal.service';

// import { ClipboardModule } from 'ngx-clipboard';

import {RouterModule, Routes} from '@angular/router';
import { AntsGridLibraryComponent } from './general.component';
import { DialogComponent } from './dialog-box/dialog-component';


import { SafeHtmlPipe } from './safe_html';
import { ApiService } from '../general/services/api.service';
import { SessionService } from './services/session.service';
// import { AngularResizedEventModule } from 'angular-resize-event';

import { ToolBarButtonMioComponent } from './toolbarbutton/toolbar.component';
import { ConfermaComponent } from './conferma/conferma.component';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ExternalHttpClient } from './services/httpclient.service';
import { BarraSuperioreGrigliaComponent } from './barra_superiore/barra_superiore.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularSplitModule } from 'angular-split';
import { PopupModule, PopupService } from '@progress/kendo-angular-popup';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AngularDraggableModule } from 'angular2-draggable';
import { MenusModule } from '@progress/kendo-angular-menu';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

import { DialogModule, KENDO_WINDOW, WindowModule } from "@progress/kendo-angular-dialog";
import { FilterExpression, FilterModule, KENDO_FILTER } from "@progress/kendo-angular-filter";

const appRoutes: Routes = [
];

/*
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
*/

@NgModule({
  declarations: [
    DialogComponent,
    AntsGridLibraryComponent,
    SafeHtmlPipe,
    ToolBarButtonMioComponent,
    ConfermaComponent,
    BarraSuperioreGrigliaComponent
    // ComboMiaComponent,
  ],
  imports: [
    MatDialogModule,
    ChartsModule,
    ButtonsModule,
    GridModule,
    InputsModule,
    SparklineModule,
    DialogModule,

    FilterModule,
    WindowModule,
    
    CommonModule,
    // ClipboardModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),

    // Kendo UI modules
    PopupModule,
    ExcelModule,
    ExcelExportModule,
    PDFModule,
    DateInputsModule,
    DropDownsModule,
    // ClipboardModule,
    AngularSplitModule,
    MenusModule,
    // AngularResizedEventModule,
    HttpClientModule,

    LayoutModule,
    ToolBarModule,
    TooltipModule,
    PagerModule,
  ],
  exports: [AntsGridLibraryComponent],
  providers: [
    AngularDraggableModule,
    // HttpClient,
    ExternalHttpClient,
    SessionService,
    ModalService,
    DatePipe,
    ApiService,
    PopupService,
    DecimalPipe
  ]
})
export class GeneralModule { }

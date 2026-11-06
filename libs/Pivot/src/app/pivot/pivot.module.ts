import { pivot } from './pivot.component';
// import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {AccordionModule} from 'primeng/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
/* import {
  FieldListService, CalculatedFieldService,
  ToolbarService, ConditionalFormattingService,
  NumberFormattingService,PivotViewModule, GroupingBarService, GroupingService, VirtualScrollService, DrillThroughService, 
  PDFExportService, ExcelExportService
} from '@syncfusion/ej2-angular-pivotview'; */
import { ApiService } from '../db/api.service';
import { ExternalHttpClient } from '../db/httpclient.service';
import { SessionService } from '../db/session.service';

@NgModule({
  declarations: [
    pivot,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // ModalModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // PivotViewModule
  ],
  exports: [ pivot ],
  providers: [
    ApiService,
    ExternalHttpClient,
    SessionService,
    /* CalculatedFieldService, 
    ToolbarService, 
    ConditionalFormattingService, 
    FieldListService, 
    NumberFormattingService, 
    GroupingBarService,
    GroupingService, 
    VirtualScrollService, 
    DrillThroughService, 
    PDFExportService, 
    // PivotChartService,
    ExcelExportService */
  ]
})
export class pivotModule { }

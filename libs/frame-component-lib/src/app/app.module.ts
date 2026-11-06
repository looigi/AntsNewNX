import { FormsModule } from '@angular/forms';
import { AggiustaArrayComponent } from './aggiustaarray.component';
import { ActivityDiTestComponent } from './activityDiTest.component';
// import { WjOlapModule } from '@grapecity/wijmo.angular2.olap';
// import { WjGridModule } from '@grapecity/wijmo.angular2.grid';
import { PagerModule } from '@progress/kendo-angular-pager';
// import { AngularResizedEventModule } from 'angular-resize-event';
import { MenusModule } from '@progress/kendo-angular-menu';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { AngularDraggableModule } from 'angular2-draggable';
import { ChartModule, SparklineModule } from '@progress/kendo-angular-charts';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule, SplitterModule } from '@progress/kendo-angular-layout';
import { GridModule, ExcelModule, PDFModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
// import { ExternalHttpClient } from './modules/framecomponent/services/externalhttpclient.service';
// import { ExternalApiService } from './modules/framecomponent/services/externalapi.service';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

// import {HttpModule} from '@angular/http';

// import 'rxjs/add/operator/map';
// import { AngularSplitModule, SplitAreaDirective, SplitComponent } from 'angular-split';
// import { ExternalSessionService } from './modules/framecomponent/services/externalsession.service';
// import Utils from './Utilities.component';
import { GeneralModule } from 'ants-grid-lib';
// import { GeneralNewModule } from 'ants-grid-lib-new';
// import { AgmCoreModule } from '@agm/core';
// import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { ComboModule } from 'combocomponent';
import { CalendarioModule } from 'calendario';
import { DecimalPipe } from '@angular/common';
// import ExternalUtilities from './modules/framecomponent/ExternalUtilities.component';
// import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { MatTabsModule } from '@angular/material/tabs';
// import { ClipboardModule } from 'ngx-clipboard';
// import { NgxCaptureModule } from 'ngx-capture';
import { AngularSplitModule } from 'angular-split';
import { GoogleMapsModule } from '@angular/google-maps';
import { FrameModule } from '../../public_api';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // AngularDateTimePickerModule,
    // HttpModule,
    BrowserModule,
    AppRoutingModule,
    AngularSplitModule,
    MatTabsModule,

    /* AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAilWZFQRPUJ0u8KQPxQjNJssqe40GeTZE',
      libraries: ['places']
    }), */

    ButtonsModule,
    PopupModule,
    GridModule,
    ExcelModule,
    LayoutModule,
    InputsModule,
    PDFModule,
    ToolBarModule,
    DateInputsModule,
    DropDownsModule,
    FormsModule,
    // GeneralNewModule,
    ChartModule,
    // TreeViewModule,
    // ClipboardModule,
    SparklineModule,
    AngularDraggableModule,
    TooltipModule,
    MenusModule,
    // AngularResizedEventModule,
    PagerModule,
    // WjGridModule,
    // WjOlapModule,
    InputsModule,
    CalendarioModule,
    ComboModule,
    // NgxCaptureModule,
    // SpreadSheetModule,
    GeneralModule,
    GoogleMapsModule,
    FrameModule
  ],
  providers: [
    AggiustaArrayComponent,
    ActivityDiTestComponent,
    DecimalPipe,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { 
}

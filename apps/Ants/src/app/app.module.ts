import { NgModule } from "@angular/core";
import { App } from "./app";
import { GeneralModule } from "ants-grid-lib";
import { BarraSuperioreModule } from "barrasuperiore";
import { MenuModule } from "menu";
import { ComandiVocaliComponent } from "./comandi_vocali.component";
import { ApiService } from "./db/api.service";
import { ExternalHttpClient } from "./db/httpclient.service";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { SimComponent } from "./sim/sim.component";
import { AngularSplitModule } from "angular-split";
import { EditDataset } from "./editDataset/editDataset.component";
import { FormsModule } from "@angular/forms";
import { PortComponent } from "./port/port.component";
import { LineComponent } from "./line/line.component";
import { AdHocComponent } from "./adhoc/adhoc.component";
import { TestsComponent } from "./monitoring_tests/monitoring_tests.component";
import { AngularDraggableModule } from "angular2-draggable";
import { AutoResizeDirective } from "./editDataset/autoresize.component";
import { TestDesignComponent } from "./test_design/test_design.component";


@NgModule({
  declarations: [
    App,
    SimComponent,
    PortComponent,
    LineComponent,
    AdHocComponent,
    TestsComponent,
    TestDesignComponent,
    EditDataset,
    AutoResizeDirective
  ],
  imports: [
    AngularSplitModule,
    BrowserModule,
    CommonModule,
    GeneralModule,
    FormsModule,
    AngularDraggableModule,
    BarraSuperioreModule,
    MenuModule
  ],
  exports: [
  ],
  providers: [
    ExternalHttpClient,
    ComandiVocaliComponent,
    ApiService
  ],
  bootstrap: [App]
})

export class AppModule { }

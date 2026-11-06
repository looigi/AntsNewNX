import { ComboMiaComponent } from './combo.component';
// import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {AccordionModule} from 'primeng/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ClickOutsideModule } from 'ng-click-outside';
// import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

@NgModule({
  declarations: [
    ComboMiaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // ModalModule.forRoot(),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClickOutsideModule,
    // DropDownsModule,
    // AccordionModule,
  ],
  exports: [ ComboMiaComponent ],
  providers: [
    // BsModalService,
  ]
})
export class ComboModule { }

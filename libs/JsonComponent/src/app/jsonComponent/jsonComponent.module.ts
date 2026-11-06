import { JsonComponent } from './jsonComponent.component';
// import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {AccordionModule} from 'primeng/accordion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ClickOutsideModule } from 'ng-click-outside';
// import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

@NgModule({
  declarations: [
    JsonComponent,
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
  exports: [ JsonComponent ],
  providers: [
    // BsModalService,
  ]
})
export class jsonComponentModule { }

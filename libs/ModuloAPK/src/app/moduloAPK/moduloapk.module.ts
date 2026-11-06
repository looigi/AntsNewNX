import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModuloAPKComponent } from './moduloapk.component';

@NgModule({
  declarations: [
    ModuloAPKComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ModuloAPKComponent
  ]
})
export class ModuloAPKModule {}
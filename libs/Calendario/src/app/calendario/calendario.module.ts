import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppModule } from '../app.module';
import { CalendarioComponent } from './calendario.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CalendarioComponent,
  ],
  imports: [
    RouterModule.forRoot([]),
    CommonModule,
    HttpClientModule,
    FormsModule,
  ],
  exports: [CalendarioComponent],
  providers: [
    DatePipe,
  ]
})
export class CalendarioModule { }

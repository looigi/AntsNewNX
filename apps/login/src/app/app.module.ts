import { ExternalHttpClient } from './services/httpclient.service';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { SimpleTimer } from 'ng2-simple-timer';
import { LoginComponent } from './components/login/login.component';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { SessionService } from './services/session.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';

// KENDO UI modules
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';

import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { MenuModule } from 'menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

const appRoutes: Routes = [
  {path: 'dashboard', redirectTo: 'dashboard/scheduler', pathMatch: 'full'},

  { path: 'login', component: LoginComponent },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {path: '**', redirectTo: '/dashboard/scheduler', pathMatch: 'full'}
];

@NgModule({ 
    declarations: [
        AppComponent,
        LoginComponent,
        // DashboardComponent,
    ],
    exports: [
        CommonModule
    ],
    bootstrap: [
      AppComponent
    ], 
    imports: [
      CommonModule,
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule.forRoot(appRoutes),
      BrowserAnimationsModule,
      MenuModule,
      BsDropdownModule.forRoot(),
      ModalModule.forRoot(),
      TooltipModule.forRoot(),
      TypeaheadModule.forRoot(),
      CollapseModule.forRoot(),
    ], 
    providers: [
      SessionService,
      ExternalHttpClient,
      ApiService,
      // SimpleTimer,
      BsDropdownConfig,
      provideHttpClient(withInterceptorsFromDi())
    ] 
  }
)
export class AppModule { }

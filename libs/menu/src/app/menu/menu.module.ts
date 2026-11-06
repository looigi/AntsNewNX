import { ExternalHttpClient } from './../services/httpclient.service';
import { ApiService } from '../services/api.service';
import { SessionService } from '../services/session.service';
import { DialogComponent } from './uc/dialog-box/dialog-component';
import { PopupRequestsComponent } from './uc/popupRequests/popupRequests.component';
import { ContextmenuComponent } from './uc/contextmenu/contextmenu.component';
import { MenuComponent } from './menu.component';
import { NgModule } from '@angular/core';
// import { ProfileComponent } from './uc/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ClickOutsideModule } from 'ng-click-outside';
// import { ConfermaComponent } from './uc/conferma/conferma.component';
import { ComandiVocaliComponent } from './comandi_vocali.component';
import { ModuloAPKModule } from 'modulo-apk';
import { ContextmenuDBComponent } from './uc/contextmenu_db/contextmenudb.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PlatformModule } from '@angular/cdk/platform';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ConfermaComponent } from './uc/conferma/conferma.component';
import { ChangePasswordComponent } from './uc/change-password/change-password.component';
import { ProfileComponent } from './uc/profile/profile.component';
import { providePrimeNG } from 'primeng/config';
import { AccordionModule } from 'primeng/accordion';
// import { ChangePasswordComponent } from './uc/change-password/change-password.component';
import Aura from '@primeng/themes/aura';

@NgModule({
  declarations: [
    MenuComponent,
    ContextmenuComponent,
    ContextmenuDBComponent,
    ChangePasswordComponent,
    ProfileComponent,
    PopupRequestsComponent,
    DialogComponent,
    ConfermaComponent
  ],
  imports: [
    CommonModule,
    // HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClickOutsideModule,
    PlatformModule,
    ModuloAPKModule,
    AccordionModule
    // FileSaverModule
  ],
  exports: [ 
    MenuComponent 
  ],
  providers: [
    ModalModule,
    SessionService,
    HttpClient,
    ExternalHttpClient,
    BsModalService,
    ApiService,
    ComandiVocaliComponent,
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
})
export class MenuModule { }

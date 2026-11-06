/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './app/environments/environment';

// import * as Cesium from 'olcs/OLCesium.js'

if (environment.production) {
  enableProdMode();
}

// Cesium.Ion.defaultAccessToken = environment.accessToken;
/* If you need to use Ion Features, you will need to add your personal token, add it at environment and import it at your main.ts for usage. Like above or do it as you wish*/

// window['CESIUM_BASE_URL'] = '/assets/cesium/';
// window['Cesium'] = Cesium

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

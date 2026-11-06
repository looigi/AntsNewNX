import { logConsole } from '../console-log';
import { Injectable } from '@angular/core';
import { ExternalHttpClient } from './httpclient.service';
import { SessionService } from './session.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable()

export class ApiService {
  constructor(private httpclient: ExternalHttpClient, private sessionService: SessionService) {
  }

  chiamataPost(Utils, funzione, jsonString) {
    // // logConsole(Utils.serverPostRest + '/' + funzione, jsonString);
    let altro = '';

    if (!Utils.serverPostRest.toLowerCase().endsWith('/rpc')) {
      altro = 'rpc/';
    }

    return this.httpclient.post(null, Utils.serverPostRest + '/' + altro + funzione, jsonString);
  }
}

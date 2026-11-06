import { logConsole } from '../console-log';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import Utils from '../Utilities.component';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  templateUrl: 'etl-monitor.component.html',
  selector: 'app-etl-monitor',
  styleUrls: ['./etl-monitor.component.css']
})

export class EtlMonitorComponent implements OnInit, OnChanges {
  @Input() indirizzoServer;
  @Input() userName;
  @Input() filtro;
  @Input() dateFrom;
  @Input() dateTo;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() listaWorkSpaces;
  @Input() operatorID;
  @Input() groupName;
  @Input() urlRoot;
  @Input() sessionID;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    // Chiude le sottoscrizioni con takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  public Utils = Utils;

  datiGriglia;
  nomeGriglia = 'Activities Loading Monitor';
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso = false;
  rigaSelezionata = null;

  datiGriglia2;
  nomeGriglia2 = 'Activities Loading Monitor 2';
  selezione2;
  effettuaAutoFit2 = false;
  caricamentoDatiInCorso2 = false;
  rigaSelezionata2 = null;

  filtro2 = '';
  dateFrom2;
  dateTo2;
  ultimaVoltaTMS = -1;
  sessionID2;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private _matDialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.caricaTabella();
  }

  ngOnChanges(e) {
    if (e.filtro) {
      // logConsole('Impostato filtro', e.filtro.currentValue);
      this.filtro2 = e.filtro.currentValue;
      this.caricaTabella();
    }

    if (e.dateFrom) {
      // logConsole('Impostato dateFrom', e.dateFrom.currentValue);
      this.dateFrom2 = e.dateFrom.currentValue;
      this.caricaTabella();
    }

    if (e.dateTo) {
      // logConsole('Impostato dateTo', e.dateTo.currentValue);
      this.dateTo2 = e.dateTo.currentValue;
      this.caricaTabella();
    }

    if(e.sessionID && e.sessionID.currentValue) {
      this.sessionID2 = e.sessionID.currentValue;
    }
  }

  messaggioWarning = '';

  caricaTabella() {
    if (!this.dateFrom2 || this.dateFrom2 === null || this.dateFrom2 === 'null' || !this.dateTo2 || this.dateTo2 === null || this.dateTo2 === 'null') {
      return;
    }

    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaTMS < 1000 && this.ultimaVoltaTMS !== -1) {
      return;
    }
    this.ultimaVoltaTMS = ora;
    // TENTATIVO DI EVITARE RICARICAMENTI INUTILI

    const nomeTabella = 'etl_monitor__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_agn_group_id: null,
      v_tms_min: this.datePipe.transform(this.dateFrom2, 'yyyy-MM-dd HH:mm:ss'),
      v_tms_max: this.dateTo2 === null ? null : this.datePipe.transform(this.dateTo2, 'yyyy-MM-dd HH:mm:ss')
    };

    this.rigaSelezionata = null;

    this.caricamentoDatiInCorso = true;
    // this.datiGriglia = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      this.caricamentoDatiInCorso = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        // logConsole(data);
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning = data.v_grid_msg;
        } else {
          this.messaggioWarning = '';
        }

        if (this.datiGriglia && this.datiGriglia !== 'empty grid' && this.datiGriglia.DataTable
          && this.datiGriglia.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia.DataTable = JSON.parse(JSON.stringify(data.DataTable));
        } else {
          // this.datiGriglia = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.datiGriglia = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit = !this.effettuaAutoFit;
            const tm1 = setTimeout(() => {
              clearTimeout(tm1);
              if (this.datiGriglia && this.datiGriglia.DataTable && this.datiGriglia.DataTable.length > 0) {
                this.rigaSelezionata = this.datiGriglia.DataTable[0];
                this.selezione = this.rigaSelezionata.ROW_ID;
                this.caricaTabella2();
              }
            }, 1000);
          }, 10);
        }
      } else {
        this.datiGriglia = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso = false;
      // this.datiGriglia = null;
      this.Utils.messaggioDiErrore(this.datiGriglia, error);
    });
  }

  clickSelezione(e) {
    this.rigaSelezionata = e[0];
    // logConsole(e);
    this.caricaTabella2();
  }

  lastSelectedOfGrid(e) {

  }

  refreshGrid1(e, r) {
    if (r === true) {
      this.datiGriglia = undefined;
    }
    this.caricaTabella();
  }

  ultimoTmsFileHist;
  messaggioWarning2 = '';

  caricaTabella2() {
    if (!this.rigaSelezionata) {
      return;
    }

    this.ultimoTmsFileHist = new Date().getTime();
    const nomeTabella = 'file_hist__grid';
    const params = {
      cntx_id: this.sessionService.getToken(),
      v_status: this.rigaSelezionata.STATUS,
      v_tms_min: '1972-01-01 00:00:00',
      v_tms_max: '3999-12-31 23:59:59',
      v_time_aggr: this.rigaSelezionata.TIME_AGGR,
      v_agn_group_id: null,
      v_caller_tag: this.ultimoTmsFileHist
    };

    // this.rigaSelezionata2 = null;

    this.caricamentoDatiInCorso2 = true;
    // this.datiGriglia2 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      this.caricamentoDatiInCorso2 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        if (!this.controllaRitornoChiamata(this, data, 'FileHist', this.ultimoTmsFileHist)) {
          return;
        }
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning2 = data.v_grid_msg;
        } else {
          this.messaggioWarning2 = '';
        }

        // logConsole(data);
        if (this.datiGriglia2 && this.datiGriglia2 !== 'empty grid' && this.datiGriglia2.DataTable
          && this.datiGriglia2.DataTable.length > 0 && data.DataTable) {
          this.datiGriglia2.DataTable = data.DataTable;
        } else {
          // this.datiGriglia2 = null; */
          // const tm = setTimeout(() => {
            this.datiGriglia2 = data;
            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.effettuaAutoFit2 = !this.effettuaAutoFit2;
              if (this.datiGriglia2 && this.datiGriglia2.DataTable && this.datiGriglia2.DataTable.length > 0) {
                this.rigaSelezionata2 = this.datiGriglia2.DataTable;
                this.selezione2 = this.rigaSelezionata2[0].ROW_ID;
              }
            }, 1000);
          // }, 10);
         }
      } else {
        this.datiGriglia2 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso2 = false;
      // this.datiGriglia2 = null;
      // logConsole('Read:' + error);
    });
  }

  clickSelezione2(e) {
    this.rigaSelezionata2 = e;
    // logConsole(this.rigaSelezionata2);
  }

  lastSelectedOfGrid2(e) {

  }

  refreshGrid2(e, r) {
    // logConsole('Refresh grid', this.rigaSelezionata2);
    if (r === true) {
      this.datiGriglia2 = undefined;
    }
    this.caricaTabella2();
  }

  premutoDeleteActSetRec(e) {
    // logConsole('Premuto delete', e);
    if (e && e[0]) {
      const id = e[0].ACT_ID;

      const params = '{' +
        '"v_cntx": "' + this.sessionService.getToken() + '",' +
        '"v_act_id": ' + id + '' +
      '}';
      this.apiService.chiamataPost('geo_act__del', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // const data = JSON.parse(data2);
        Utils.checkRitornoChiamata(this, data);

        // logConsole('Delete Act Set Rec return:', data);
        if (+data[0].v_err_code === 0) {
          this.caricaTabella2();
        } else {
          // alert(data[0].v_failure_reason);
          this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
        }
      }, error => {
        // alert(error);
      });
    }
  }

  premutoDeleteGriglia2(e) {
    // logConsole('Premuto delete', this.rigaSelezionata2);
    // return;
    if (this.rigaSelezionata && this.rigaSelezionata2[0]) {
      const id = this.rigaSelezionata2[0].ACT_ID;

      const params = '{' +
        '"v_cntx": "' + this.sessionService.getToken() + '",' +
        '"v_act_id": ' + id + '' +
      '}';
      this.apiService.chiamataPost('geo_act__del', params)
      // .map(response => response)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // const data = JSON.parse(data2);
        Utils.checkRitornoChiamata(this, data);

        // logConsole('Delete Act Set Rec return:', data);
        if (+data[0].v_err_code === 0) {
          this.caricaTabella2();
        } else {
          // alert(data[0].v_failure_reason);
          this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
        }
      }, error => {
        // alert(error);
      });
    }
  }

  mostraPopup(Messaggio, Dialog, Cosa) {
    const dialogRef = this._matDialog.open(ConfermaComponent, {
      data: {
        messaggio: Messaggio,
        mostraAnnulla: Dialog
      },
    });

    dialogRef.afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe(result => {
      switch(Cosa) {

      }
      // logConsole('The dialog was closed', result);
      // this.animal = result;
    });
  }

  premutoProcess(e) {
    // logConsole(e);
    const params = '{' +
      '"v_cntx": "' + this.sessionService.getToken() + '",' +
      '"v_act_id": ' + e[0].ACT_ID + '' +
    '}';
    // if (this.debug2 === true) {
      // logConsole('Funzione chiamata: geo_act__reproc', e, params)
    // }
    // return;

    this.apiService.chiamataPost('geo_act__reproc', params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      Utils.checkRitornoChiamata(this, data);

      // // logConsole('Create Act Set return:', data);
      if (+data[0].v_err_code === 0) {
        this.caricaTabella2();
      } else {
        this.mostraPopup('Error: ' + data[0].v_failure_reason, false, '');
      }
    });
  }

  premutoWorkSpace(e) {
    // logConsole(e);
    // return;

    let activitySetName = '';
    let start = '';
    let stop ='';
    let tI;
    let tF;

    // logConsole(this.rigaSelezionata2);
    // return;

    activitySetName = '[ACT] ' + this.rigaSelezionata2[0].ACT_NAME;
    start = this.rigaSelezionata2[0].DATA_MIN_TMS;
    stop = this.rigaSelezionata2[0].DATA_MAX_TMS;

    const nuovoNome = 'temp [' + this.operatorID + ']';

    const params = '{' +
      '"cntx_id": "' + this.sessionService.getToken() + '",' +
      '"v_obj_type": "geo_analysis",' +
      '"v_obj_name": "' + e.NAME + '",' +
      '"v_obj_name_new": "' + nuovoNome + '",' +
      '"v_activityset_name": "' + activitySetName + '",' +
      // '"v_activityset_act_set_type": "' + '' + '",' +
      '"v_timerangedsfstart": "' + start + '",' +
      '"v_timerangedsfstop": "' + stop + '"' +
    '}';
    // logConsole('operator_obj_my__copy', params);
    // return;

    this.apiService.chiamataPost('operator_obj_my__copy', JSON.parse(params))
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      if (data) {
        // Creato il temporaneo va caricato GeoAnalysis con il relativo url
        localStorage.removeItem('lastWorkspace');
        this.changePage('Mappe;Mappe', nuovoNome, true);
      }
    });
  }

  changePage(url, altro, newPage) {
    const campiOrig = url.split(';');
    const campi = this.ritornaNomeApp(url);

    let ancora = '';
    if (altro && altro !== '') {
      ancora = ',"altro": "' + altro + '"'
    }

    const passaggio = '{ ' +
      '"sess": "' + this.sessionService.getToken() + '", ' +
      '"gname": "' + this.groupName + '", ' +
      '"uname": "' + this.userName + '", ' +
      '"form": "' + campi[3] + '", ' +
      '"FS": "false"' +
      ancora +
    '}';
    const pass = Utils.cripta(passaggio);
    // // logConsole(passaggio);
    // // logConsole(pass);
    // // logConsole(UtilsInterna.decripta(pass));
    // return;

    let addr = this.urlRoot;

    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      addr = 'http://localhost:4200';
      campi[0] = '';
    } else {
      if (!addr.endsWith('/')) {
        addr += '/';
      }
      if (addr.indexOf('geoantsweb/') === -1) {
        addr += 'geoantsweb/';
      }
    }

    // logConsole(addr + campi[0] + '/?par=' + pass); // sess=' + this.sessionID2 +
                                                        // '&gname=' + this.operatorGroupName +
                                                        // '&uname=' + this.userName +
                                                        // '&form=' + campiOrig[1] +
                                                        // '&FS=' + this.fullScreen);
    const doveURL = addr + campi[0] + '/?par=' + pass; // + '/?sess=' + this.sessionID2 +
                                      //                   '&gname=' + this.operatorGroupName +
                                      //                   '&uname=' + this.userName +
                                      //                   '&form=' + campiOrig[1] +
                                      //                   '&FS=' + this.fullScreen;
    // // logConsole(doveURL);
    // return;
    // window.location.href = doveURL;
    // const ww = window.open(doveURL, '_blank');
    if (newPage) {
      const url2 = this.sanitizer.bypassSecurityTrustUrl(doveURL) as string;
      // logConsole(url2);
      const ww = window.open(doveURL, '_blank');
    } else {
      location.assign(doveURL);
    }
  }

  ritornaNomeApp(c) {
    const campi = c.split(';');
    // // logConsole('Passaggio a progetto ' + campi[0] + ', maschera: ' + campi[1]);

    let dove = '';
    switch (campi[0]) {
      case 'DD':
        dove = 'DataDictionaries';
        break;
      case 'FM':
        dove = 'FleetManager';
        break;
      case 'SY':
        dove = 'System';
        break;
      case 'UM':
        dove = 'UserManager';
        break;
      case 'Mappe':
        dove = 'Mappe';
        break;
      case 'Home':
        dove = 'HomePage';
        break;
    }

    let funzione = '';
    switch (campi[1]) {
      case 'Mappe':
        funzione = 'Home';
        break;
      case 'TC':
        funzione = 'Test Campaigns';
        break;
      case 'AGD':
        funzione = 'Agent Group Definition';
        break;
      case 'AGC':
        funzione = 'Agent Group Configuration';
        break;
      case 'AGPL':
        funzione = 'Agent Profiles Library';
        break;
      case 'QPL':
        funzione = 'QueryPCK Library';
        break;
      case 'TDL':
        funzione = 'Test Design Library';
        break;
      case 'DTUM':
        funzione = 'Drive Test Units Mng';
        break;
      case 'SAM':
        funzione = 'Single Agent Mode';
        break;
      case 'Antenna':
        funzione = 'Antenna';
        break;
      case 'Cluster':
        funzione = 'Cluster';
        break;
      case 'PLMN':
        funzione = 'PLMN';
        break;
      case 'Users':
        funzione = 'Users';
        break;
      case 'Groups':
        funzione = 'User Groups';
        break;
      case 'UP':
        funzione = 'User Profiles';
        break;
      case 'SC':
        funzione = 'System Configuration';
        break;
      case 'EV':
        funzione = 'Event Viewer';
        break;
      case 'SM':
        funzione = 'System Monitor';
        break;
      case 'AV':
        funzione = 'Alarm Viewer';
        break;
      case 'ETLM':
        funzione = 'Activities Loading Monitor';
        break;
      case 'DBO':
        funzione = 'DB Ojects';
        break;
      case 'SESS':
        funzione = 'Session Monitor';
        break;
    }

    const cc = new Array();
    cc.push(dove);
    cc.push(funzione);
    cc.push(campi[0]);
    cc.push(campi[1]);

    return cc;
  }

  controllaRitornoChiamata(t, dataP, chiamante, chiSono) {
    const data = dataP;

    if (chiSono === '') {
      // if (t.debug2 === true) {
      //   // logConsole('Controllo ritorno chiamata: chiamata nulla ' + chiamante);
      // }

      return false;
    }

    if (data && data.v_caller_tag) {
      const ritorno = +data.v_caller_tag;
      if (ritorno !== chiSono) {
        // if (t.debug2 === true) {
        // // logConsole('Controllo ritorno chiamata: chiamata diversa ' + chiamante, chiSono, ritorno);
        // }
        // nomeRondella = false;
        return false;
      } else {
        // if (t.debug2 === true) {
        //   // logConsole('Controllo ritorno chiamata: chiamata uguale ' + chiamante, chiSono, ritorno);
        // }
        return true;
      }
    } else {
      // if (t.debug2 === true) {
      //   // logConsole('Controllo ritorno chiamata: nessun codice di ritorno ' + chiamante);
      // }

      return true;
    }
  }

  ritornoDimensioniColonneETL(e) {
    Utils.scriveDimensioniColonne('ETL', e);
  }

  ritornoDimensioniColonneETL2(e) {
    Utils.scriveDimensioniColonne('ETL2', e);
  }
}

import { logConsole } from '../console-log';
import { SessionService } from '../db/session.service';
import { ApiService } from '../db/api.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import Utils from '../Utilities.component';
import { ConfermaComponent } from '../conferma/conferma.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { GestioneGrafici } from './GestioneGrafici.component';
import * as CanvasJS from '../../assets/js/canvasjs.min.js';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

@Component({
  templateUrl: 'alarm-viewer.component.html',
  selector: 'app-alarm-viewer',
  styleUrls: ['./alarm-viewer.component.css']
})

export class AlarmViewerComponent implements OnInit, OnDestroy {
  @Input() indirizzoServer;
  @Input() userName;
  @Input() righePerPaginareAutomaticamente = -1;
  @Input() sessionID;
  @Input() dateFrom;
  @Input() dateTo;
  @Input() tipo;
  @Input() autoUpdate = false;
  @Input() tempoAutoUpdate = 30000;

  CanvJS = CanvasJS;

  destroy$ = new Subject<void>();
  
  dimensioneSplit1 = 75;
  dimensioneSplit2 = 25;
  graficiVisibili = true;
  
  public Utils = Utils;
  datiGriglia1;
  nomeGriglia = 'Alarm Viewer';
  selezione;
  effettuaAutoFit = false;
  caricamentoDatiInCorso1 = false;
  rigaSelezionata1 = null;
  sessionID2;

  debug2 = false;
  quantiGraficiMax = 200;
  NumeroFrame2 = 1;
  frameAttivo2 = 1;
  frameName2 = 'Frame_0';
  measureDaDisegnare = this.creaVettore(environment.quantiFrames, new Array());
  erroreGrafici = this.creaVettore(environment.quantiFrames, undefined);
  altezzaTotaleGrafici = this.creaVettore(environment.quantiFrames, undefined);
  giaDisegnataStruttura = this.creaVettore(environment.quantiFrames, false);
  altezzaGraficiChart = this.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  graficoVisibile = this.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, true);
  larghezzaDiv = this.creaVettore(environment.quantiFrames, -1);
  DPNulloVecchio = this.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  caricamentoDatiInCorsoMC = this.creaVettore(environment.quantiFrames, false);
  dimeBarra = this.creaVettore(environment.quantiFrames, false);
  datiAppoggio = this.creaVettore(environment.quantiFrames, undefined);
  dataInizio = this.creaVettore(environment.quantiFrames, undefined);
  dataFine = this.creaVettore(environment.quantiFrames, undefined);
  array2 = this.creaVettore(environment.quantiFrames, undefined);
  folders = this.creaVettore(environment.quantiFrames, undefined);
  contaGrafici = this.creaVettore(environment.quantiFrames, undefined);
  tmsGrafici = this.creaVettore(environment.quantiFrames, undefined);
  tipoGrafico = this.creaVettore(environment.quantiFrames, undefined);
  quantiPuntiGrafico = this.creaVettore(environment.quantiFrames, -1);
  chartsGrafici = this.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  dataPointsAppoggio = this.creaMatrice(environment.quantiFrames, this.quantiGraficiMax, undefined);
  vecchioaArrayMisure = this.creaVettore(this.quantiGraficiMax, undefined);
  puntiniAppoggio = this.creaVettore(this.quantiGraficiMax, undefined);
  nomiChart = this.creaVettore(this.quantiGraficiMax, undefined);
  nomiGrafici = this.creaVettore(this.quantiGraficiMax, undefined);
  minimo = this.creaVettore(this.quantiGraficiMax, -1);
  massimo = this.creaVettore(this.quantiGraficiMax, -1);
  minimoY = this.creaVettore(this.quantiGraficiMax, undefined);
  massimoY = this.creaVettore(this.quantiGraficiMax, undefined);
  DPNullo = this.creaVettore(this.quantiGraficiMax, true);
  aggiornaGrafici = this.creaVettore(this.quantiGraficiMax, undefined);
  numSamples = this.creaVettore(this.quantiGraficiMax, undefined);
  stringaAGNoACT = '';
  caricamentoGraficiInCorso = false;
  
  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private sessionService: SessionService,
    private _matDialog: MatDialog,
    private GestioneGrafici: GestioneGrafici
  ) {
    // this.impostaAxisX();
  }

  ngOnInit() {
    // this.caricaTabella1();
    // this.caricaTabella2();
  }

  ngOnChanges(e) {
    if (e.sessionID && e.sessionID.currentValue) {
      this.sessionID2 = e.sessionID.currentValue;
    }
    let carica = false;
    if(e.tipo && e.tipo.currentValue) {
      if (e.tipo.currentValue === 'Notifications') {
        this.dimensioneSplit1 = 100;
        this.dimensioneSplit2 = 0;
        this.graficiVisibili = false;
      } else {
        this.dimensioneSplit1 = 75;
        this.dimensioneSplit2 = 25;
        this.graficiVisibili = true;
      }
      carica = true;
      logConsole('Tipo:', e.tipo.currentValue);
    }
    if (e.dateFrom && e.dateFrom.currentValue) {
      carica = true;
      logConsole('Date From:', e.dateFrom.currentValue);
    }
    if (e.dateTo && e.dateTo.currentValue) {
      carica = true;
      logConsole('Date To:', e.dateTo.currentValue);
    }
    if (e.autoUpdate && e.autoUpdate.currentValue !== undefined) {
      // logConsole('Auto update:', e.autoUpdate.currentValue);
      this.timerAttivo = e.autoUpdate.currentValue;
      this.azionaTimer();
    }

    if (carica === true) {
      this.misura = '';
      this.quanteMisure = 0;
      
      this.caricaTabella1(' ngOnChanges ');            
      this.onDragEnd(null);
    }
  }

  timerRicarica;
  timerAttivo = false;

  ngOnDestroy(): void {
    // Prima mancava: il timer di ricarica e le sottoscrizioni con takeUntil(this.destroy$) restavano attivi
    if (this.timerRicarica) {
      clearInterval(this.timerRicarica);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  azionaTimer() {
    logConsole('Auto update alarm viewer every ' + this.tempoAutoUpdate + ' ms. Timer attivo:', this.timerAttivo);
    if (this.timerAttivo === true) {
      if (this.timerRicarica) {
        clearInterval(this.timerRicarica);
      }
      this.timerRicarica = setInterval(() => {
        this.misura = '';
        this.quanteMisure = 0;
        
        this.caricaTabella1('Aziona Timer');            
        this.onDragEnd(null);
      }, this.tempoAutoUpdate);
    } else {
      if (this.timerRicarica) {
        clearInterval(this.timerRicarica);
      }
    }
  }

  messaggioWarning1 = '';
  
  caricaTabella1(daDove) {
    let tipo = '';
    switch (this.tipo) {
      case 'History':
        tipo = 'view_history';
        break;
      case 'Current':
        tipo = 'view_current';
        break;
      case 'Notifications':
        tipo = 'view_notification';
        break;
    }
    const nomeTabella = 'alarm__grid';
    const params = {
      v_cntx_id: this.sessionService.getToken(),
      v_view_mode: tipo,
      tms_from: this.datePipe.transform(this.dateFrom, 'yyyy-MM-dd HH:mm:ss'),
      tms_to: this.dateTo === null ? null : this.datePipe.transform(this.dateTo, 'yyyy-MM-dd HH:mm:ss'),
    };
    logConsole('Carica tabella 1 - ' + daDove, params);

    // this.rigaSelezionata1 = null;
    this.datiGriglia1 = 'empty grid';
    this.caricamentoDatiInCorso1 = true;

    // this.datiGriglia1 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      this.caricamentoDatiInCorso1 = false;
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);
        
        if (data && data !== null && data.v_grid_msg !== undefined) {
          this.messaggioWarning1 = data.v_grid_msg;
        } else {
          this.messaggioWarning1 = '';
        }

        logConsole('Dati allarmi 1', data);
        if (this.datiGriglia1 && this.datiGriglia1 !== 'empty grid' && this.datiGriglia1.DataTable
          && this.datiGriglia1.DataTable.length > 0 && data.DataTable) {
            this.datiGriglia1.DataTable = data.DataTable;
        } else {
          // this.datiGriglia1 = null;
          const tm = setTimeout(() => {
            clearTimeout(tm);

            this.datiGriglia1 = JSON.parse(JSON.stringify(data));
            this.effettuaAutoFit = !this.effettuaAutoFit;
          }, 10);
        }

        if (this.appoSelezione) {
          this.selezione = JSON.parse(JSON.stringify(this.appoSelezione));
        }
      } else {
        this.datiGriglia1 = 'empty grid';
      }
    }, error => {
      this.caricamentoDatiInCorso1 = false;
      // this.datiGriglia1 = null;
      // logConsole('Read:' + error);
    });
  }
  misura = '';
  quanteMisure = 0;
  appoggioDati;
  appoSelezione;

  clickSelezione1(e) {
    // logConsole('Click selezione 1', e);
    if (e !== null) {
      this.appoggioDati = JSON.parse(JSON.stringify(e));
      this.rigaSelezionata1 = e;
      logConsole('Click 1', e);
      let misura = '';

      this.quanteMisure = 0;
      const sel = new Array();
      const selez = e.dati;
      selez.forEach(element => {
        sel.push(element.ROW_ID);
        if (element.MEASURE_CODE_UID) {
          if (misura.indexOf(element.MEASURE_CODE_UID) === -1) {
            misura += element.MEASURE_CODE_UID + ";"
            this.quanteMisure++;
          }
        } 
      });
      this.selezione = JSON.parse(JSON.stringify(sel));
      this.appoSelezione = JSON.parse(JSON.stringify(sel));
      logConsole('Misure:', misura);

      this.misura = misura;

      this.onDragEnd(null);
    } else {
      this.onDragEnd(null);
    }
    // return;
  }

  deselAll() {
    this.misura = '';
    this.quanteMisure = 0;
    this.selezione = [];
    this.appoSelezione = [];
    this.GestioneGrafici.pulisceGrafici(this);
  }

  selAll(e) {
    let misura = '';
    this.quanteMisure = 0;

    if (!this.selezione) { this.selezione = []; }
    logConsole('Già selezionati', JSON.parse(JSON.stringify(this.selezione)));
    const selezione = JSON.parse(JSON.stringify(this.selezione));

    selezione.forEach(element => {
      this.datiGriglia1.DataTable.forEach(element2 => {
        if (element2.ROW_ID === element) {
          // logConsole('Misura vecchia rilevata:', element2);
          if (element2.MEASURE_CODE_UID) {
            if (misura.indexOf(element2.MEASURE_CODE_UID) === -1) {
              misura += element2.MEASURE_CODE_UID + ";"
              this.quanteMisure++;
            }
          }
        }
      });
    });
    // logConsole('Misure già impostate prima:', misura, selezione);

    e.forEach(element => {
      let ok = true;

      selezione.forEach(element2 => {
        if(ok && element.ROW_ID === element2.ROW_ID) {
          ok = false;
        }
      });
      if (ok) {
        selezione.push(element.ROW_ID);
      }

      if (element.MEASURE_CODE_UID) {
        if (misura.indexOf(element.MEASURE_CODE_UID) === -1) {
          misura += element.MEASURE_CODE_UID + ";"
          this.quanteMisure++;
        }
      }
    });

    this.selezione = JSON.parse(JSON.stringify(selezione));
    this.appoSelezione = JSON.parse(JSON.stringify(selezione));

    logConsole('Dopo selezione', JSON.parse(JSON.stringify(this.selezione)), misura, this.quanteMisure);
    // logConsole('Misure All:', misura);

    this.misura = misura;

    this.onDragEnd(null);
  }

  lastChiamataGrafici = -1;

  onDragEnd(e) {
    const ora = new Date().getTime();
    if (ora - this.lastChiamataGrafici < 1000) {
      return;
    }
    this.lastChiamataGrafici = ora;

    if (this.tipo === 'Notifications') {
      this.GestioneGrafici.pulisceGrafici(this);
    } else {
      const t = setInterval(() => {
        const divGraficoContenitore = document.getElementById('divGrafici');
        if (divGraficoContenitore !== null && divGraficoContenitore !== undefined ) {
          if (this.datiGriglia1 === undefined || this.datiGriglia1 === 'empty grid') {
          } else {
            clearInterval(t);

            if (!this.misura) {
              if (this.selezione) {
                // logConsole('Dati griglia 1:', this.datiGriglia1);

                let misura = '';
                this.quanteMisure = 0;
                this.selezione.forEach(element => {
                  this.datiGriglia1.DataTable.forEach(element2 => {
                    if (+element2.ROW_ID === +element) {
                      misura += element2.MEASURE_CODE_UID + ";"
                      this.quanteMisure++;
                    }
                  });
                });
                logConsole('Misure grafici 2:', misura, this.quanteMisure);
                // return;

                this.misura = misura;
              }
            // } else {
              // logConsole('Misure grafici', this.misura);
            }

            if (!this.misura) {
              this.GestioneGrafici.pulisceGrafici(this);
            } else {
              const larghezza = divGraficoContenitore.offsetWidth - 15;
              let altezza = (divGraficoContenitore.offsetHeight - 20) / this.quanteMisure;
              if (altezza < 75) { altezza = 75; }
              if (altezza > 300) { altezza = 300; }
              
              this.GestioneGrafici.disegnaGrafici(this, this.misura, larghezza, altezza);
            }
          }
        }
      }, 100);
    }
  }

  lastSelectedOfGrid1(e) {

  }

  refreshGrid1(e, r) {
    if (r === true) {
      this.datiGriglia1 = undefined;
    }
    this.caricaTabella1('refreshGrid1');           
    this.onDragEnd(null);
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

  ritornoDimensioniColonneSM1(e) {
    Utils.scriveDimensioniColonne('AV1', e);
  }

  ritornoDimensioniColonneSM2(e) {
    Utils.scriveDimensioniColonne('AV2', e);
  }

  creaVettore(x, valore) {
    const m = new Array();
    for (let j = 0; j <= x; j++) {
      // // logConsole(valore);
      if (valore && valore !== true && valore !== false && !this.isNumeric(valore) && valore !== null && !this.isArray(valore)) {
        const v = valore.replace('***CONT***', j);
        m.push(v);
      } else {
        m.push(valore);
      }
    }
    // this.scriveLog(m);
    return m;
  }

  isArray(obj: any ) {
    return Array.isArray(obj);
  }

  trackByGrafici(index: number, item: any) {
    return index; // this.measureDaDisegnare[index];
  }
  
  isNumeric(value: unknown): boolean {
  	return typeof value === 'number' && !Number.isNaN(value);
  }

  creaMatrice(x, y, valore) {
    const m = new Array();
    for (let i = 0; i <= x; i++) {
      m.push(new Array());
      for (let j = 0; j <= y; j++) {
        if (valore && valore !== true && valore !== false && !this.isNumeric(valore) && valore !== null && !this.isArray(valore)) {
          const v = valore.replace('***CONT***', i);
          m[i].push(v);
        } else {
          m[i].push(valore);
        }
      }
    }
    // this.scriveLog(m);
    return m;
  }

  converteStringaInJSON(val) {
    let ee;
    if (typeof(val) === 'string') {
      const vv = val.substring(0, 3);
      // this.scriveLog('Prefisso:', vv);
      if (val !== undefined && val !== '' && val !== 'empty' && val !== 'empty grid' && vv !== '***') {
        // this.scriveLog('Valore da parsare:', val);
        ee  = JSON.parse(val);
        if (typeof(ee) === 'string' && ee !== 'empty grid') {
          if (ee !== '') {
            // this.scriveLog('->' + ee + '<-');
            ee = JSON.parse(ee);
          }
        }
      } else {
        if (vv === '***') {
          ee = val.replace(vv, '');
        } else {
          ee = '';
        }
      }
    } else {
      ee = val;
    }

    return ee;
  }

  axisColor = 'transparent';
  axisXConTempoVisibile;
  axisXConValueVisibile;
  axisXSenzaTempoVisibile;

  impostaAxisX(maggioreDiUnGiorno) {
    let formato = 'HH:mm:ss';
    if (maggioreDiUnGiorno === true) {
      formato = 'DD-MM-YY HH:mm';
    }
    logConsole('Imposta asse X. Maggiore di un giorno:', maggioreDiUnGiorno, 'Formato:', formato);
    this.axisXConTempoVisibile = {    // crosshair: {
      //   enabled: true
      // },
      labelFormatter: function (e) {
        return CanvasJS.formatDate(e.value, formato);
      },
      fontWeight: 'normal',
      fontFamily: 'arial',
      labelAngle: 0,
      lineColor: this.axisColor,
      gridColor: this.axisColor,
      labelFontColor: '#aaaaaa',
      tickColor: '#c6c6c6',
      viewPortMinimum: 0,
      viewPortMaximum: 0,
      /* minimum: 0,
      maximum: 0, */
      crosshair: {
        enabled: true,
        color: 'red',
        thickness: 2,
        lineDashType: 'dot',
        // snapToDataPoint: true,
        labelFormatter: function (e) {
          return CanvasJS.formatDate( e.value, 'HH:mm:ss');
        }
      },
      // tickLength: 0,
      // labelFontSize: 0,
      // margin: -3
    };

    this.axisXConValueVisibile = {    // crosshair: {
      //   enabled: true
      // },
      labelFormatter: function (e) {
        return CanvasJS.formatDate(e.value, 'HH:mm:ss');
      },
      fontWeight: 'normal',
      fontFamily: 'arial',
      labelAngle: 0,
      lineColor: this.axisColor,
      gridColor: this.axisColor,
      labelFontColor: '#aaaaaa',
      tickColor: '#c6c6c6',
      viewPortMinimum: 0,
      viewPortMaximum: 0,
      /* minimum: 0,
      maximum: 0, */
      crosshair: {
        enabled: true,
        color: 'red',
        thickness: 2,
        lineDashType: 'dot',
        // snapToDataPoint: true,
        labelFormatter: function (e) {
          return e.label; //  r.CanvJS.currentValue.formatDate( e.value, 'HH:mm:ss');
        }
      },
      // tickLength: 0,
      // labelFontSize: 0,
      // margin: -3
    };

    this.axisXSenzaTempoVisibile = {    // crosshair: {
      //   enabled: true
      // },
      labelFormatter: function (e) {
        return CanvasJS.formatDate( e.value, 'HH:mm:ss');
      },
      fontWeight: 'normal',
      fontFamily: 'arial',
      labelAngle: 0,
      lineColor: this.axisColor,
      gridColor: this.axisColor,
      labelFontColor: '#aaaaaa',
      tickColor: '#c6c6c6',
      viewPortMinimum: 0,
      viewPortMaximum: 0,
      crosshair: {
        enabled: true,
        color: 'red',
        thickness: 2,
        lineDashType: 'dot',
        // snapToDataPoint: true,
        labelFormatter: function (e) {
          return CanvasJS.formatDate( e.value, 'HH:mm:ss');
        }
      },
      tickLength: 0,
      labelFontSize: 0,
      margin: -3
    };
  }

  righeDaEliminare;
  indiceDaEliminare;

  deleteRiga(e) {
    logConsole('Delete:', e);

    this.righeDaEliminare = JSON.parse(JSON.stringify(e));
    this.indiceDaEliminare = 0;
    let codici = '';
    this.righeDaEliminare.forEach(element => {
      const ne_type = element['NE_TYPE'] || element['ne_type'];
      const ne_id = element['NE_ID'] || element['ne_id'];
      const measure_code = element['MEASURE_CODE'] || element['measure_code'];
      const issuer = element['ISSUER'] || element['issuer'];
      logConsole('Riga da eliminare:', ne_type, ne_id, measure_code, issuer);

      codici += ne_type + ' ' + ne_id + ' ' + measure_code + ' ' + issuer +'<br />';
    });
    
    const messaggio = 'This alarms root will be removed (including statistics and alarm history): <br /><br />' + codici + '<br />Do you confirm?';
    Swal.fire({
      title: '',
      html: messaggio,
      icon: 'warning',
      background: '#9f1f1f',
      color: '#fbf7f7',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    }).then((result) => {
      if (result.value) {
        this.deleteRigaFisica(this.righeDaEliminare[this.indiceDaEliminare]);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  deleteRigaFisica(e) {
    const nomeTabella = 'alarm__remove';
    const params = {
      v_cntx: this.sessionService.getToken(),
      v_ne_type: e['NE_TYPE'] || e['ne_type'],
      v_ne_id: e['NE_ID'] || e['ne_id'],
      v_measure_code: e['MEASURE_CODE'] || e['measure_code'],
      v_issuer: e['ISSUER'] || e['issuer']
    };
    logConsole('Params delete:', e, params);
    /* this.indiceDaEliminare++;
    if (this.indiceDaEliminare < this.righeDaEliminare.length) {
      this.deleteRigaFisica(this.righeDaEliminare[this.indiceDaEliminare]);
    } else {
      return;
    }
    return; */

    // this.rigaSelezionata1 = null;
    this.caricamentoDatiInCorso1 = true;

    // this.datiGriglia1 = null;
    this.apiService.chiamataPost('' + nomeTabella, params)
    // .map(response => response)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      // const data = JSON.parse(data2);
      if (data && data !== null) {
        Utils.checkRitornoChiamata(this, data);

        this.indiceDaEliminare++;
        if (this.indiceDaEliminare < this.righeDaEliminare.length) {
          this.deleteRigaFisica(this.righeDaEliminare[this.indiceDaEliminare]);
        } else {
          this.caricamentoDatiInCorso1 = false;
          this.caricaTabella1('deleteRigaFisica - refresh dopo eliminazione');
        }
      }
    }, error => {
      this.caricamentoDatiInCorso1 = false;
      this.caricaTabella1('deleteRigaFisica - refresh dopo eliminazione');
      // this.datiGriglia1 = null;
      // logConsole('Read:' + error);
    });
  }
}

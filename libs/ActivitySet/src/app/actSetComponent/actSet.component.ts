import { logConsole } from '../console-log';
import { DatePipe } from '@angular/common';
import { OnInit, AfterViewInit, OnChanges, SimpleChange, Output, EventEmitter, Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import ExternalUtilities from './ExternalUtilities.component';
// import 'rxjs/add/operator/map';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';
// import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
    templateUrl: 'actSet.component.html',
    selector: 'actset-component',
    styleUrls: ['./actSet.style.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class ActSetComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() debug;
  @Input() userName;
  @Input() righeSelezionate;
  @Input() Utils;
  @Input() sessionID;
  @Input() righePerPaginazioneAutomatica = -1;
  @Input() indirizzoServer;
  @Input() modalitaApertura = 'FRAME';
  @Input() numeroActivitySet: number;
  @Input() ultimaSelezionata;

  // @Output() mascheraVisibileASEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() visibileEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() confermaEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() refreshEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };

  showPartitionLabel = false;
  actSetRecSel;
  selezioneActSetRec;
  pulisceLayer = false;

  datiFolders;
  datiActivityFilters;
  editKeyVisibleF = false;
  deleteKeyVisibleF = false;
  visibileFilters = false;
  datiPartitionLabel;
  attendiSalvataggio = false;
  attendiSalvataggioAA = false;
  showActSet = false;
  righeSelezionatePerActSet;
  folderSelezionato;
  folderSelezionata;
  folderSelezionatoID;
  impostaPagina1 =  0;
  impostaPagina2 =  0;
  attendiSalvataggio2 = false;
  datiActivitySet;
  vecchioActSet;
  resizeSet = false;
  sessionID2;
  ultimaSelezionataCod;
  savedActSetId;
  activitySelected;
  activitySelected2;
  savedActSetROWId;
  infoKeyVisibileF = false;
  visibileTastoDeleteS = false;
  visibileTastoInfoS = false;
  visibileTastoEditS = false;
  visibileTastoConfirmS = false;
  visibileTastoCopyS = false;
  visibileTastoEditSR = false;
  visibileTastoDeleteSR = false;
  oldFiltro = '';
  partitionLabelSel = '1 default';
  indexJson;
  jsonArray;
  jsonArrayPL;
  Utils2;
  attendiSalvataggio3 = false;
  datiActivitySetRec;
  vecchioActSetId;
  resizeSetRec;
  Nuovo = false;
  editVisibile = false;
  activityGroup;
  selectedActSetRec;
  confirmKeyVisibileF = false;

  arrayDelete;
  idxDelete;
  refresh = false;
  pulisceSelezioneActSetRec;
  codiceActSet;
  effettuaAutoFit = false;
  filtro = '';
  
  datiGrigliaCheck;
  checkPopup = false;
  modalitaCheckPopup;
  operazioneCheckPopup = '';

  constructor(
    private datePipe: DatePipe,
    private apiService: ApiService,
  ) {
  }

  ngOnInit() {
    this.LeggePartitionLabel();
    this.LeggeActivityGroupPR();

    const f = localStorage.getItem('filterAct');
    if (f !== null) {
      this.filtro = f;
    }
  }

  ngAfterViewInit() {

  }

  ngOnChanges(r) {
    if (r.Utils) {
      this.Utils2 = r.Utils.currentValue;
    }

    if (r.righeSelezionate && r.righeSelezionate.currentValue && r.righeSelezionate.currentValue[0]) {
      this.righeSelezionatePerActSet = r.righeSelezionate.currentValue;
      logConsole('Riga selezionata ACT_SET:', this.righeSelezionatePerActSet);

      if (this.righeSelezionatePerActSet && this.righeSelezionatePerActSet[0]) {
        this.codiceActSet = this.righeSelezionatePerActSet[0].ACT_CODE;
        if (this.codiceActSet.indexOf('***') > -1) {
          this.codiceActSet = this.codiceActSet.substring(0, this.codiceActSet.indexOf('***'));
        }
      } else {
        this.codiceActSet = '';
      }
    }

    if (r.sessionID) {
      this.sessionID2 = r.sessionID.currentValue;
      if (!this.datiFolders) {
        this.LeggeDatiFolders();
      }
    }
  }

  cellClickGridSet(e) {
    if (e) {
      this.datiActivitySetRec = 'empty grid';
      this.pulisceLayer = !this.pulisceLayer;

      // logConsole('Click su griglia: ', e);
      if (e.length > 1) {
        e[0] = e[e.length - 1];
        // logConsole('Cell click ritorno totale: ', e);
      }
      let riga;

      if (e.dataItem && e.dataItem[e.length - 1]) {
        riga = e.dataItem[e.length - 1];
      } else {
        if (e.dataItem) {
          riga = e.dataItem;
        } else {
          if (e.ID !== undefined) {
            riga = e;
          } else {
            if (e[0].ID !== undefined) {
              riga = e[0];
            }
          }
        }
      }
      // logConsole('Click su riga SET:', riga);

      if (riga) {
        this.activitySelected = riga;
        this.savedActSetId = riga.ID;
        this.savedActSetROWId = riga.ROW_ID;

        this.visibileTastoDeleteS = true;
        this.visibileTastoInfoS = true;
        this.visibileTastoConfirmS = true;
        this.visibileTastoCopyS = true;
        this.visibileTastoEditS = true;

        this.visibileTastoEditSR = false;
        this.visibileTastoDeleteSR = false;

        this.LeggeActivities(this.savedActSetId);

        if (riga.NAME.indexOf('[ACT SET]') > -1) {
          this.visibileTastoEditS = true;
        }
      } else {
        this.visibileTastoEditS = false;
        this.visibileTastoDeleteS = false;
        this.visibileTastoInfoS = false;
        this.visibileTastoConfirmS = false;

        this.visibileTastoEditSR = false;
        this.visibileTastoDeleteSR = false;

        this.visibileTastoCopyS = false;
      }
    }
  }

  LeggeDatiFolders() {
    // logConsole('Leggo dati folders');
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_category": "ActSetFolder"' +
    '}';
    this.apiService.chiamataPost(this.indirizzoServer, 'geo_lookup__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      ExternalUtilities.checkRitornoChiamata(this.Utils2, data2);

      // logConsole('Lista lookup:', data2);
      if (data2 && data2 !== null) {
        // logConsole('Lookup:', data2);
        const data = data2; // [0].geo_measure_dfn__grid);
        const dd = {
          ColumnProperty: null,
          DataTable: new Array(),
          GridProperty: null
        }
        this.datiFolders = dd;
        this.datiFolders.ColumnProperty = JSON.parse(JSON.stringify(data.ColumnProperty));
        this.datiFolders.GridProperty = JSON.parse(JSON.stringify(data.GridProperty));
        // this.datiFolders.DataTable.push(d);
        let c = 2;
        data.DataTable.forEach(element => {
          const e = {
            CATEGORY: 'ActFolder',
            CODE: 0,
            DESCRIPTION: '',
            ROW_ID: c,
            VALUE_STR: element.VALUE_STR
          };
          this.datiFolders.DataTable.push(e);
          c++;
        });
      } else {
        this.datiFolders = 'empty grid'; // null;
      }
    }, error => {
      console.error(error);
    });
  }

  /* chiudiMaschera() {
    this.mascheraVisibileASEmit.emit(new Date().toString());
  } */

  messaggioWarningAS = '';
  
  LeggeActivitySet(e) {
    this.impostaPagina1 =  0;
    this.impostaPagina2 =  0;

    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_filter_folder": "' + e + '"' +
    '}';
    // logConsole('Lettura activity set', e);
    this.attendiSalvataggio2 = true;
    this.apiService.chiamataPost(this.indirizzoServer, 'geo_act_set__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(this.Utils2, data2);
        this.attendiSalvataggio2 = false;

        if (data2 && data2 !== null && data2.v_grid_msg !== undefined) {
          this.messaggioWarningAS = data2.v_grid_msg;
        } else {
          this.messaggioWarningAS= '';
        }

        const data = data2; // [0].geo_act_set__grid);
        logConsole('Activity set ritornata', data);

        if (this.datiActivitySet && this.datiActivitySet.DataTable && this.vecchioActSet === e) {
          // logConsole('Aggiorno');
          this.datiActivitySet.DataTable = data.DataTable;
        } else {
          // logConsole('Inserisco');
          const tm1 = setTimeout(() => {
            clearTimeout(tm1);
            this.datiActivitySet = data;

            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.resizeSet = !this.resizeSet;
              // this.impostaPagina1 = 1;
            }, 100);
          }, 100);
        }
        this.vecchioActSet = e;

        if (data.DataTable.length > 0) {
          // logConsole('Dati activity', data.DataTable, this.ultimaSelezionataCod);
          let riga;
          data.DataTable.forEach(element => {
            if (element.ID === this.savedActSetId) {
              this.ultimaSelezionataCod = element.ROW_ID;
              this.savedActSetId = element.ID;
              riga = element;
            }
          });

          // logConsole(riga);
          if (riga) {
            this.activitySelected = riga;
            this.savedActSetId = riga.ID;
            this.savedActSetROWId = riga.ROW_ID;

            const tm = setTimeout(() => {
              clearTimeout(tm);
              this.visibileTastoDeleteS = true;
              this.visibileTastoInfoS = true;
              this.visibileTastoEditS = true;
              this.visibileTastoConfirmS = true;
              this.visibileTastoCopyS = true;

              this.visibileTastoEditSR = false;
              this.visibileTastoDeleteSR = false;
            }, 1000);

            // logConsole('Act Set ID', this.savedActSetId, riga);
              // this.visibileTastoInfoS = true;
            this.LeggeActivities(this.savedActSetId);
          }
          // } else {
          //   this.visibileTastoInfoS = false;
        }
      } else {
        this.attendiSalvataggio2 = false;
        this.datiActivitySet = 'empty grid';
      }
    }, error => {
      this.attendiSalvataggio2 = false;
      console.error(error);
    });
  }

  messaggioWarningASR = '';

  LeggeActivities(id: string) {
    this.impostaPagina2 =  0;
    let filtro = '';

    // logConsole('Legge Activities:', id);
    if (id && id.toString().trim() !== '') {
      const ii = id.toString().trim().split(',');
      let idd = '';
      ii.forEach(element => {
        if (element !== 'NaN') {
          idd += element + ',';
        }
      });
      idd = idd.substring(0, idd.length - 1);
      filtro = 'Geo_Act_Set_Id In (' + idd + ')';
    }
    // logConsole('Filtro:', filtro);

    /* if (filtro !== '') {
      if (filtro === this.oldFiltro) {
        // return;
      }
      this.oldFiltro = filtro; */

      const params = '{' +
        '"cntx_id": "' + this.sessionID2 + '",' +
        '"v_filter_folder": "",' +
        '"v_filter_act_set_id": ' + id + '' +
      '}';
      // logConsole(params);
      this.attendiSalvataggio3 = true;
      this.apiService.chiamataPost(this.indirizzoServer, 'geo_act_set_rec__grid', params)
      // .map(response => response)
      .subscribe(data2 => {
        // const data2 = JSON.parse(data);
        if (data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(this.Utils, data2);
          this.attendiSalvataggio3 = false;

          const data = data2; // [0].geo_act_set_rec__grid);

          if (data && data !== null && data.v_grid_msg !== undefined) {
            this.messaggioWarningASR = data.v_grid_msg;
          } else {
            this.messaggioWarningASR = '';
          }

        // logConsole(data);
      // this.apiService.getViewData('VIEW_GEO_ACT_SET_REC', filtro)
      // .map(response => response())
      // .subscribe(data2 => {
        // logConsole(data.RESULT[0].message.toUpperCase());
      //   if (data === undefined) { data = null; }
       //  if (data.RESULT && data.RESULT[0].message.toUpperCase() === 'OK') {
          // logConsole('Activity Griglia', data);
          // logConsole('Righe:', data.DataTable.length);
          if (data.DataTable.length === 0) {
            this.datiActivitySetRec = 'empty grid';
          } else {
            if (this.datiActivitySetRec && this.datiActivitySetRec.DataTable && this.vecchioActSetId === id) {
              this.datiActivitySetRec.DataTable = data.DataTable;
            } else {
              this.datiActivitySetRec = data;
              const tm = setTimeout(() => {
                clearTimeout(tm);
                this.resizeSetRec = !this.resizeSetRec;
                // this.impostaPagina2 = 1;
              }, 100);
            }
          }
          this.vecchioActSetId = id;
        } else {
          // ExternalUtilities.visualizzaAlert(data.RESULT[0].message);
          // ExternalUtilities.visualizzaAlert(data[0].Return + ': ' + data[0].Message);
          this.attendiSalvataggio3 = false;
          this.datiActivitySetRec = 'empty grid';
        }
      }, error => {
        this.attendiSalvataggio3 = false;
        console.error(error);
      });
    // }
  }

  cellClickGridFolders(e) {
    this.pulisceLayer = !this.pulisceLayer;

    // logConsole(e);
    this.folderSelezionata = e[0];
    this.folderSelezionato = e[0].VALUE_STR;
    this.folderSelezionatoID = e[0].ROW_ID;

    this.savedActSetROWId = -1;
    this.ultimaSelezionataCod = -1;
    this.savedActSetId = -1;

    this.LeggeActivitySet(e[0].VALUE_STR);

    this.visibileTastoEditS = false;
    this.visibileTastoDeleteS = false;
    this.visibileTastoInfoS = false;
    this.visibileTastoConfirmS = false;

    this.visibileTastoEditSR = false;
    this.visibileTastoDeleteSR = false;

    this.visibileTastoCopyS = false;
  }

  LeggeActivityGroupPR() {
    const params = {
      cntx_id: this.sessionID2,
      v_category: 'ActSetFolder'
    };
    // logConsole('geo_lookup__sel 2', new Date().getTime());
    this.apiService.chiamataPost(this.indirizzoServer, 'geo_lookup__sel', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      ExternalUtilities.checkRitornoChiamata(this.Utils, data2);

      // logConsole('Ritorno:', data);
      this.activityGroup = new Array();
      let c = 1;
      data2.forEach(element => {
        const d = {
          ROW_ID: c,
          CATEGORY: params.v_category,
          VALUE_STR: element.value_str
        }
        this.activityGroup.push(d);
        c++;
      });
    }, error => {
      console.error('POST ERROR: Look Sel', error, error.message);
      // ExternalUtilities.messaggioDiErroreEsterno(this, error);
    });
  }

  LeggePartitionLabel() {
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_category": "partition_label"' +
    '}';
    this.apiService.chiamataPost(this.indirizzoServer, 'geo_lookup__grid', JSON.parse(params))
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // logConsole('Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(this.Utils2, data2);
        if (data2 && data2 !== null) {
          if (data2.v_err_code && data2.v_err_code === 2) {
            this.datiPartitionLabel = 'empty grid'; // null;
            ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
          } else {
            // logConsole('Lookup:', data2);
            // const data = data2; // [0].geo_measure_dfn__grid);
            // // logConsole('Mosaic Style:', data);
            this.datiPartitionLabel = data2.DataTable;
            this.partitionLabelSel = '1 default';
          }
        } else {
          this.datiPartitionLabel = 'empty grid'; // null;
        }
      }
    });
  }

  copyKeyPremuto(ee) {
    if (!this.activitySelected) {
      ExternalUtilities.visualizzaAlert('Select a row');
    }

    const e = ExternalUtilities.converteStringaInJSON(ee);
    // logConsole('Copia activity set:', e, this.activitySelected);

    let desc = prompt('Insert name for new set', e.NAME);
    if (desc && desc !== null) {
      desc = desc.replace(/(\r\n|\n|\r)/gm, '');
      // logConsole('Copia activity set:', desc);
      // return;

      const params = '{' +
        '"v_cntx": "' +  this.sessionID2 + '",' +
        '"v_name": "' + this.activitySelected.NAME + '",' +
        '"v_name_new": "' + desc + '"' +
      '}';
      this.apiService.chiamataPost(this.indirizzoServer, 'geo_act_set__copy', params)
      // .map(response => response)
      .subscribe(data => {
        ExternalUtilities.checkRitornoChiamata(this.Utils2, data);

        // logConsole('Copy Act Set return:', data);
        if (+data[0].v_err_code === 0) {
          this.LeggeActivitySet(this.folderSelezionato);
        } else {
          ExternalUtilities.visualizzaAlert(data[0].v_failure_reason);
        }
      }, error => {
        console.error('POST ERROR: Act set Copy', error, error.message);
        // ExternalUtilities.visualizzaAlert(error);
      });
    }
  }

  confermaActSet(chiudi) {
    let act_set = null;
    const dateNow: Date = new Date();
    const update_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    // logConsole(this.datiActivitySet);
    if (!this.datiActivitySet) {
      ExternalUtilities.visualizzaAlert('Please select Act Set');
      return;
    }
    this.datiActivitySet.DataTable.forEach(element => {
      if (act_set === null) {
        if (element.ID === this.savedActSetId) {
          act_set = element;
        }
      }
    });

    let idd = 0;
    this.jsonArray = new Array();
    this.jsonArrayPL = new Array();

    // logConsole(this.righeSelezionatePerActSet);
    if (!this.righeSelezionatePerActSet[0] && this.righeSelezionatePerActSet) {
      const geo_act_id = this.righeSelezionatePerActSet.GEO_ACT_ID;
      this.jsonArray.push(geo_act_id);
      this.jsonArrayPL.push(this.righeSelezionatePerActSet.PARTITION_LABEL);
    } else {
      this.righeSelezionatePerActSet.forEach(element => {
        const geo_act_id = element.GEO_ACT_ID;
        this.jsonArray.push(geo_act_id);
        this.jsonArrayPL.push(this.righeSelezionatePerActSet.PARTITION_LABEL);
      });
    }

    if (act_set !== null) {
      if (!this.savedActSetId) {
        ExternalUtilities.visualizzaAlert('Please select Act Set');
        return;
      }
      /* if (!this.partitionLabelSel) {
        ExternalUtilities.visualizzaAlert('Please select partition label');
        return;
      } */

      this.indexJson = 0;
      this.attendiSalvataggio = true;
      this.scriveDatiSuDB(chiudi, false);
    } else {
      ExternalUtilities.visualizzaAlert('Please select Act Set');
    }

    this.indexJson = 0;
    this.attendiSalvataggio = true;
    this.scriveDatiSuDB(chiudi, false);
  }

  scriveDatiSuDB(chiudi1, chiudi2) {
    const geo_act_id = this.jsonArray[this.indexJson];
    let partition;
    if (this.jsonArrayPL[this.indexJson]) {
      partition = '"' + this.jsonArrayPL[this.indexJson] + '"';
    } else {
      partition = null;
    }

    let jsonString = '{';
    jsonString += '"v_cntx": "' + this.sessionID2 + '",';
    jsonString += '"v_geo_act_set_id": "' + this.savedActSetId + '",';
    jsonString += '"v_geo_act_id": "' + geo_act_id + '",';
    jsonString += '"v_partition_label": ' + partition;
    jsonString += '}';

    // logConsole(JSON.parse(jsonString));

    this.apiService.chiamataPost(this.indirizzoServer, 'geo_act_set_rec__ins', JSON.parse(jsonString))
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      // logConsole('Create act set rec return:', data);
      ExternalUtilities.checkRitornoChiamata(this.Utils2, data2);

      if (+data2[0].v_err_code === 0) {

        this.indexJson++;
        if (this.indexJson < this.jsonArray.length) {
          const tm = setTimeout(() => {
            clearTimeout(tm);
            
            this.scriveDatiSuDB(chiudi1, chiudi2)
          }, 100);
        } else {
          this.staSalvando = false;
          this.LeggeActivitySet(this.folderSelezionato);
          this.showPartitionLabel = false;

          this.attendiSalvataggio = false;
          this.attendiSalvataggioAA = false;

          this.visibileFilters = false;
        }

        // this.impostaPartitionLabel();
      } else {
        // logConsole(data);
        ExternalUtilities.visualizzaAlert(data2[0].v_failure_reason);
      }
    }, error => {
      console.error('POST ERROR: Act set rec Ins', error, error.message);
      // ExternalUtilities.visualizzaAlert(error);
      // chiudi = false;
      this.attendiSalvataggio = false;
      this.attendiSalvataggioAA = false;
    });
  }

  fineEsecuzione(chiudi1, chiudi2) {
    this.attendiSalvataggio = false;

    // logConsole('ROW_ID: ', this.savedActSetROWId);
    this.ultimaSelezionataCod = this.savedActSetROWId;
    this.oldFiltro = '';

    // this.LeggeActivitySet(this.folderSelezionato);
    if (chiudi1) {
      this.mostraNascondeMenu();
    } else {
      if (chiudi2) {
        this.visibileFilters = false;
      }
      this.LeggeActivities(this.savedActSetId);
    }
  }

  continuaAScrivere(chiudi, chiudi2) {
    this.scriveDatiSuDB(chiudi, chiudi2);
  }

  staSalvando = false;

  impostaPartitionLabel() {
    if (this.staSalvando) {
      return;
    }

    const selezionato = JSON.parse(JSON.stringify(this.selectedActSetRec));
    if (!selezionato) {
      return;
    }

    let ok = false;
    let qq = 0;
    let lista;
    if (selezionato.dati) {
      qq = selezionato.dati.length - 1
      lista = selezionato.dati;
    } else {
      if (selezionato) {
        qq = 1;
        lista = [selezionato];
      }
    }
    // logConsole('Valore pl: ', this.partitionLabelSel);
    // logConsole('Selezionati: ', qq, selezionato, selezionato.dati.length);
    if (selezionato.dati.length === 0) {
      this.mostraPopup('Info', 'No rows checked');
      return;
    }

    // logConsole('Partition label da salvare', this.partitionLabelSel);
    if (!this.partitionLabelSel) {
      this.mostraPopup('Info', 'No partition label selected');
      // return;
    }

    let quante = qq;
    let quale = 0;
    this.staSalvando = true;
    const t = setInterval(() => {
      if (ok === true) {
        clearInterval(t);

        this.staSalvando = false;
        this.LeggeActivitySet(this.folderSelezionato);
        this.showPartitionLabel = false;
        // this.selezioneActSetRec = undefined;
      }
    }, 1000);

    lista.forEach(element => {
      const params = '{' +
        '"v_cntx": "' + this.sessionID2 + '",' +
        '"v_geo_act_set_id": "' + element.ACT_SET_ID + '",' +
        '"v_geo_act_id": "' + element.ACT_ID +  '",' +
        '"v_partition_label": "' + this.partitionLabelSel + '"' +
      '}';
      this.apiService.chiamataPost(this.indirizzoServer, 'geo_act_set_rec__upd', JSON.parse(params))
      // .map(response => response)
      .subscribe(data2 => {
        // logConsole('Lista eventi da mettere:', data2);
        if (data2 && data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(this.Utils, data2);
          if (data2 && data2 !== null) {
            if (data2.v_err_code && data2.v_err_code === 2) {
              // ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
            }
          } else {
          }
          quale++;
          if (quale > quante) {
            ok = true;
          }
        }
      });
    });      
    // }, 1000);
  }

  refreshGridSetRec(e, r) {
    // if (e) {
      if (r === true) {
        this.datiActivitySetRec = undefined;
      }
      this.LeggeActivities(this.savedActSetId);
    // }
  }

  premutoTastoEliminaActSetRec(e) {
    const grigliaDaPassare = JSON.parse(JSON.stringify(this.datiActivitySetRec));
    grigliaDaPassare.DataTable = e;
    this.datiGrigliaCheck = JSON.parse(JSON.stringify(grigliaDaPassare));
    this.modalitaCheckPopup = 'remove_activities';
    this.operazioneCheckPopup = 'Remove';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  premutoTastoEliminaActSetRec1(e) {
    // logConsole('Questo è elimina');
    // return;

    if (e) {
      this.arrayDelete = new Array();
      e.forEach(ee => {
        this.arrayDelete.push(ee);
      });
      if (this.arrayDelete.length > 0) {
        this.idxDelete = 0;
        this.eliminazioneActSetRec();
      }
    }
  }

  lastSelectedOfGridSetRec(e) {
    // ExternalUtilities.visualizzaAlert(e);
  }

  checkEdge(event) {
    this.Utils.edge = event;
    // logConsole('edge:', event);
  }

  premutoTastoNewActivity(e) {
    // logConsole(e);
    this.Nuovo = false;
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.Nuovo = true;
      this.activitySelected2 = null;
      this.editVisibile = true;
    }, 100);
  }

  premutoTastoEditActivity(e) {
    this.Nuovo = false;
    // logConsole('Activity group:', this.activityGroup);
    this.activitySelected2 = this.activitySelected;
    this.editVisibile = true;
  }

  premutoTastoDeleteActSet(e) {
    if (e) {;
      this.arrayDelete = new Array();
      e.forEach(ee => {
        this.arrayDelete.push(ee);
      });
      if (this.arrayDelete.length > 0) {
        this.idxDelete = 0;
        this.eliminazioneFisicaActSet();
      }
    }
  }

  eliminazioneFisicaActSet() {
    const e = this.arrayDelete[this.idxDelete];

    // logConsole(jsonString);

    // logConsole('Ritorno scrittura', this.apiService.UpdateDashboard(jsonString));
    // this.apiService.UpdateDashboard(jsonString)
    const params = '{' +
      '"v_cntx": "' + this.sessionID2 + '",' +
      '"v_act_set_id": ' + e.ID + '' +
    '}';
    // logConsole('Funzione chiamata: geo_act_set__del', JSON.parse(params))
    // return;

    this.apiService.chiamataPost(this.indirizzoServer, 'geo_act_set__del', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      ExternalUtilities.checkRitornoChiamata(this.Utils, data2);

      // logConsole('Create Act Set return:', data2);
      if (+data2[0].v_err_code === 0) {
        this.idxDelete++;
        if (this.idxDelete < this.arrayDelete.length) {
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.eliminazioneFisicaActSet()
          }, 10);
        } else {
          this.LeggeActivitySet(this.folderSelezionato);

          // this.LeggeActivities(this.savedActSetId);

          this.refresh = !this.refresh;
          // this.refreshEmit.emit(this.refresh);
        }
      } else {
        ExternalUtilities.visualizzaAlert(data2[0].v_failure_reason);
      }
    }, error => {
      console.error('POST ERROR: Act set', error, error.message);
      // ExternalUtilities.visualizzaAlert(error);
    });
  }

  refreshGridSet(e, r) {
    this.datiActivitySet = undefined;
    
    if (e) {
      this.LeggeActivitySet(this.folderSelezionato);
    }
  }

  visibileDaMascheraActivityEdit(e) {
    this.editVisibile = false;
  }

  /* refreshActivity(e) {
    // logConsole('Refresh Activity in Activity Manager', this.folderSelezionato, this.ultimaSelezionata.FOLDER);
    // if (e) {
    // this.folderSelezionato = e;

    this.refresh = !this.refresh;

    this.LeggeActivitySet(this.folderSelezionato);
  } */

  selezionaPartLabel(e) {
    // logConsole('Valore', e);
    // logConsole('Selezionati', this.selezioneActSetRec);
    // return;
    
    if (e) {
      if (!e.CODE_STR && e.indexOf('***') > -1) {
        this.datiPartitionLabel.push({CODE_STR: e.replace('***', ''), VALUE_STR: e.replace('***', '')});
        this.datiPartitionLabel = JSON.parse(JSON.stringify(this.datiPartitionLabel));
        const tm = setTimeout(() => {
          clearTimeout(tm);
          this.partitionLabelSel = e.replace('***', '');
        }, 100);
      } else {
        this.partitionLabelSel = e.CODE_STR;
      }
    }
  }

  premutoDeleteActSetRec(e) {
    // logConsole('Premuto delete', this.selectedActSetRec);
    if (this.selectedActSetRec && this.selectedActSetRec[0]) {
      const id = this.selectedActSetRec[0].ACT_ID;

      const params = '{' +
        '"v_cntx": "' + this.sessionID2 + '",' +
        '"v_act_id": ' + id + '' +
      '}';
      // logConsole('Funzione chiamata: geo_act__del', JSON.parse(params))
      // return;

      this.apiService.chiamataPost(this.indirizzoServer, 'geo_act__del', params)
      // .map(response => response)
      .subscribe(data2 => {
        // const data2 = JSON.parse(data);
        ExternalUtilities.checkRitornoChiamata(this.Utils, data2);

        // logConsole('Delete Act Set Rec return:', data2);
        if (+data2[0].v_err_code === 0) {
          this.LeggeActivitySet(this.folderSelezionato);
        } else {
          ExternalUtilities.visualizzaAlert(data2[0].v_failure_reason);
        }
      }, error => {
        console.error('POST ERROR: Act Del', error, error.message);
        // ExternalUtilities.visualizzaAlert(error);
      });
    }
  }

  /* premutoTastoEliminaActSetRec(e) {
    if (e) {
      this.arrayDelete = new Array();
      e.forEach(ee => {
        this.arrayDelete.push(ee);
      });
      if (this.arrayDelete.length > 0) {
        this.idxDelete = 0;
        this.eliminazioneActSetRec();
      }
    }
  } */

  premutoTastoDeleteActSetRec(e) {
    // logConsole('Questo è il delete');
    // return;

    if (e) {
      this.arrayDelete = new Array();
      e.forEach(ee => {
        this.arrayDelete.push(ee);
      });
      if (this.arrayDelete.length > 0) {
        this.idxDelete = 0;
        this.attendiSalvataggio = true;
        this.eliminazioneFisicaActSetRec();
      }
    }
  }

  eliminazioneActSetRec() {
    const e = this.arrayDelete[this.idxDelete];
    // logConsole('Tasto Delete. Riga: ', e);

    let act_set = null;
    const dateNow: Date = new Date();
    const update_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    // logConsole(this.datiActivitySet);
    this.datiActivitySet.DataTable.forEach(element => {
      if (act_set === null) {
        if (element.ID === this.savedActSetId) {
          act_set = element;
        }
      }
    });

    let chiudi = true;

    const params = '{' +
      '"v_cntx": "' + this.sessionID2 + '",' +
      '"v_id": ' + e.ID + '' +
    '}';
    // logConsole('Funzione chiamata: geo_act_set_rec__del', JSON.parse(params))
    // return;

    this.apiService.chiamataPost(this.indirizzoServer, 'geo_act_set_rec__del', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      ExternalUtilities.checkRitornoChiamata(this.Utils, data2);

      // logConsole('Delete Act Set Rec return:', data);
      if (+data2[0].v_err_code === 0) {
        this.idxDelete++;
        if (this.idxDelete < this.arrayDelete.length) {
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.eliminazioneActSetRec()
          }, 10);
        } else {
          this.pulisceSelezioneActSetRec = [];
          // this.LeggeActivitySet();

          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.LeggeActivities(this.savedActSetId);
            // this.pulisceSelezioneActSetRec = true;
            this.attendiSalvataggio = false;
  
            this.refresh = !this.refresh;
            // this.refreshEmit.emit(this.refresh);
          }, 100);
        }
      } else {
        ExternalUtilities.visualizzaAlert(data2[0].v_failure_reason);
      }
    }, error => {
      console.error('POST ERROR: Act set rec Del', error, error.message);
      // ExternalUtilities.visualizzaAlert(error);
      chiudi = false;
    });
  }

  selezioneActSetRec2;
  ultimaVoltaClickASR = -1;

  selezionateTutteLeRigheActSetRec(e) {
    logConsole('Selezione tutto', e);
    this.selectedActSetRec = {
      dati: e,
      selezionato: null,
      deselezionato: null
    }
    this.selezioneActSetRec2 = this.selectedActSetRec;

    logConsole('Pressione check act set rec su tutte add act', e);
    
    this.activityPerMappa = '';
    this.tmsInizioPerMappa = '';
    this.tmsFinePerMappa = '';
    if (e.length === 0) {
      this.pulisceLayer = !this.pulisceLayer;
    } else {
      const t = setTimeout(() => {
        clearTimeout(t);

        e.forEach(element => {
          if (element) {
            this.activityPerMappa += element.ACT_ID + '|';
            this.tmsInizioPerMappa += element.START_TMS + ';';
            this.tmsFinePerMappa += element.END_TMS + ';';
          }
        });
      }, 100);
      logConsole('Selezionate tutte le righe', e);
    }
    this.confirmKeyVisibileF = true;
  }

  deselezionateTutteLeRigheActSetRec(e) {
    this.activityPerMappa = '';
    this.tmsInizioPerMappa = '';
    this.tmsFinePerMappa = '';

    this.pulisceLayer = !this.pulisceLayer;
  }

  activityPerMappa;
  tmsInizioPerMappa;
  tmsFinePerMappa;

  cellClickGridSetRec(e, check) {
    const ora = new Date().getTime();
    if (ora - this.ultimaVoltaClickASR < 750) {
      return;
    }
    this.ultimaVoltaClickASR = ora;

    const tt = setTimeout(() => {
      this.pulisceLayer = !this.pulisceLayer;

      logConsole('Click su activity set rec', e, check);
      this.selezioneActSetRec = e;
      this.selectedActSetRec = e;

      this.selezioneActSetRec2 = e;
      if (e) {
        this.visibileTastoEditSR = true;
        this.visibileTastoDeleteSR = true;
        // this.visibileTastoInfoSR = true;

        this.activityPerMappa = '';
        this.tmsInizioPerMappa = '';
        this.tmsFinePerMappa = '';

        const t = setTimeout(() => {
          clearTimeout(t);

          this.activityPerMappa += e.ACT_ID + '|';
          this.tmsInizioPerMappa += e.START_TMS + ';';
          this.tmsFinePerMappa += e.END_TMS + ';';
        }, 500);
      } else {
        this.pulisceLayer = !this.pulisceLayer;
      }

      if (!check) {
        this.pulisceSelezioneActSetRec = [];
      }      
    }, 200);
  }

  attivaTastiEditSetRec = false;
  ACT_TAG1 = '';
  ACT_TAG2 = '';

  checkClickGridSetRec(e) {
    this.selectedActSetRec = e;

    const sel = new Array();
    let ok = false;
    e.dati.forEach(element => {
      sel.push(element.ROW_ID);
        if (!ok) {
          ok = true;
          this.ACT_TAG1 =element.ACT_TAG1;
          this.ACT_TAG2 =element.ACT_TAG2;
        }
    });
    this.pulisceSelezioneActSetRec = JSON.parse(JSON.stringify(sel));

    logConsole('Pressione check act set rec', sel, this.selectedActSetRec, this.selectedActSetRec.dati, this.selectedActSetRec.dati.length);

    if (this.selectedActSetRec && this.selectedActSetRec.dati && this.selectedActSetRec.dati.length > 0) {
      this.attivaTastiEditSetRec = true;
      logConsole('Attivo');
    } else {
      this.attivaTastiEditSetRec = false;
      logConsole('Disattivo');
    }

    /* this.activityPerMappa = '';
    this.tmsInizioPerMappa = '';
    this.tmsFinePerMappa = '';
    if (e.dati.length === 0) {
      this.pulisceLayer = !this.pulisceLayer;
    } else {
      const t = setTimeout(() => {
        clearTimeout(t);

        e.dati.forEach(element => {
          if (element) {
            this.activityPerMappa += element.ACT_ID + '|';
            this.tmsInizioPerMappa += element.START_TMS + ';';
            this.tmsFinePerMappa += element.END_TMS + ';';
          }
        });
      }, 100);
    } */
  }

  premutoTastoEditSetRec(e) {
    // logConsole('Premuto edit set rec', this.selezioneActSetRec2);

    /* if (!this.selezioneActSetRec2.selezionato) {
      this.mostraPopup('Info', 'No rows checked');
      return;
    } */

    // this.actSetRecSel = JSON.parse(e);
    if (this.selezioneActSetRec2 && this.selezioneActSetRec2.dati && this.selezioneActSetRec2.dati[0]) {
      this.partitionLabelSel = this.selezioneActSetRec2.dati[0].PARTITION_LABEL;
    } else {
      this.partitionLabelSel = '';
    }
    this.showPartitionLabel = true;
  }

  eliminazioneFisicaActSetRec() {
    const e = this.arrayDelete[this.idxDelete];
    // logConsole('Tasto Delete. Riga: ', e);

    let act_set = null;
    const dateNow: Date = new Date();
    const update_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    // logConsole(this.datiActivitySet);
    this.datiActivitySet.DataTable.forEach(element => {
      if (act_set === null) {
        if (element.ID === this.savedActSetId) {
          act_set = element;
        }
      }
    });

    let chiudi = true;

    const params = '{' +
      '"v_cntx": "' + this.sessionID2 + '",' +
      '"v_id": ' + e.ID + '' +
    '}';
    // logConsole('Funzione chiamata: geo_act_set_rec__del', JSON.parse(params))
    // return;

    this.apiService.chiamataPost(this.indirizzoServer, 'geo_act_set_rec__del', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      ExternalUtilities.checkRitornoChiamata(this.Utils, data2);

      // logConsole('Delete Act Set Rec return:', data2);
      if (+data2[0].v_err_code === 0) {
        this.idxDelete++;
        if (this.idxDelete < this.arrayDelete.length) {
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.eliminazioneFisicaActSetRec()
          }, 10);
        } else {
          this.pulisceSelezioneActSetRec = [];
          // this.LeggeActivitySet();
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.LeggeActivities(this.savedActSetId);
            // this.pulisceSelezioneActSetRec = true;
  
            this.refresh = !this.refresh;
          }, 100);
        }
      } else {
        ExternalUtilities.visualizzaAlert(data2[0].v_failure_reason);
      }
    }, error => {
      console.error('POST ERROR: Act set Rec', error, error.message);
      // ExternalUtilities.visualizzaAlert(error);
      chiudi = false;
    });
  }

  premutoTastoNew(e) {
    // if (this.datiActivityFilters !== null) {
    //   this.visibileFilters = true;
    // } else {
      // if (this.savedActSetId) {
        this.LeggeFilters(this.savedActSetId);
      // }
    // }
  }

  // FILTERS
  // vecchioFiltro = '***';
  warning = '';
  effettuaAutoFitF = false;
  caricamentoAdd = false;
  messaggioWarningAF = '';

  LeggeFilters(id) {
    /* if (this.filtro === this.vecchioFiltro && this.filtro !== '') {
      return;
    } 
    this.vecchioFiltro = this.filtro; */
    // this.apiService.getViewData('VIEW_GEO_ACT', 'Geo_Act_Set_Id <> ' + id)
    const params = '{' +
      '"cntx_id": "' + this.sessionID2 + '",' +
      '"v_filter_folder": "",' +
      '"v_filter_act_set_id": ' + id + ',' +
      '"v_filter_name": "' + this.filtro + '"' +
    '}';
    // logConsole(params);
    this.caricamentoAdd = true;
    this.apiService.chiamataPost(this.indirizzoServer, 'geo_act__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      // const data2 = JSON.parse(data);
      if (data2 && data2 !== null) {
        ExternalUtilities.checkRitornoChiamata(this.Utils, data2);

        if (data2 && data2 !== null && data2.v_grid_msg !== undefined) {
          this.messaggioWarningAF = data2.v_grid_msg;
        } else {
          this.messaggioWarningAF = '';
        }

        // logConsole(data);
        // logConsole('Activity Griglia prima', data.DataTable);
        // logConsole('Righe:', data.DataTable.length);

        if (this.datiActivityFilters !== undefined && this.datiActivityFilters.DataTable
          && this.datiActivityFilters !== 'empty grid' && data2.DataTable) {
            // logConsole('Refresh filters', data2.DataTable)
          // if (t.debug2 === true) {
          // logConsole('Dati activities da aggiornare', t.datiActivities);
          // }
          this.datiActivityFilters.DataTable = data2.DataTable;
        } else {
          // logConsole('New filters', data2.DataTable)
          this.datiActivityFilters = data2;
          this.warning = '';
          const tm = setTimeout(() => {
            clearTimeout(tm);
            if (data2.DataTable.length > 499) {
              this.warning = 'Activity';
            }
            this.effettuaAutoFitF = !this.effettuaAutoFitF;
          }, 100);
        }

        this.caricamentoAdd = false;

        /* this.datiActivityFilters = undefined;
        this.warning = '';
        const tm = setTimeout(() => {
          if (data.DataTable.length > 499) {
            this.warning = 'Activity';
          }
          this.datiActivityFilters = data;
        }, 500); */


        this.visibileFilters = true;
      } else {
        ExternalUtilities.visualizzaAlert(data2[0].v_failure_reason);
        this.datiActivityFilters = 'empty grid';
      }
    }, error => {
      console.error(error);
    });
  }

  refreshGridFilters(e, r) {
    this.LeggeFilters(this.savedActSetId);
  }

  lastSelectedOfGridFilters(e) {

  }

  checkClickGridFilters(e) {
    logConsole('Pressione check act set rec su add act', e);    
  }

  activityPerMappaSelected;
  tmsInizioPerMappaSelected;
  tmsFinePerMappaSelected;
  rigaSelezionataAddAct = undefined;

  cellClickGridFilters(e) {
    // this.selezioneActSetRec2 = e;
    logConsole('Click su check add activities', e);

    this.pulisceLayer = !this.pulisceLayer;

    this.activityPerMappaSelected = '';
    this.tmsInizioPerMappaSelected = '';
    this.tmsFinePerMappaSelected = '';
    this.confirmKeyVisibileF = false;

    if (e.dati && e.dati[0]) {
      this.editKeyVisibleF = true;
      this.deleteKeyVisibleF = true;
      this.infoKeyVisibileF = true;
      this.confirmKeyVisibileF = true;

      const t = setTimeout(() => {
        clearTimeout(t);

        this.rigaSelezionataAddAct = e.dati[0].ROW_ID;
        this.activityPerMappaSelected += e.dati[0].GEO_ACT_ID + '|';
        this.tmsInizioPerMappaSelected += e.dati[0].START_TMS + ';';
        this.tmsFinePerMappaSelected += e.dati[0].END_TMS + ';';

        logConsole('Riga selezionata', this.rigaSelezionataAddAct);
      }, 100);
      // this.activityPerMappaSelected = e.NAME;
      // this.tmsInizioPerMappaSelected = e.START_TMS;
      // this.tmsFinePerMappaSelected = e.END_TMS;
    } else {
      this.editKeyVisibleF = false;
      this.deleteKeyVisibleF = false;
      this.infoKeyVisibileF = false;
      // logConsole('Azzero 1');
      this.confirmKeyVisibileF = false;
      this.rigaSelezionataAddAct = undefined;

      this.pulisceLayer = !this.pulisceLayer;
    }
  }

  premutoTastoConfirmFilter(e) {
    const grigliaDaPassare = JSON.parse(JSON.stringify(this.datiActivityFilters));
    grigliaDaPassare.DataTable = e;
    this.datiGrigliaCheck = JSON.parse(JSON.stringify(grigliaDaPassare));
    this.modalitaCheckPopup = 'add_activities';
    this.operazioneCheckPopup = 'Add';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  premutoTastoConfirmFilter1(e) {
    // logConsole('Tasto confirm: ', e, this.savedActSetId);
    // return;

    let act_set = null;
    const dateNow: Date = new Date();
    const update_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss.SSS', 'UTC');

    // logConsole(this.datiActivitySet);
    this.datiActivitySet.DataTable.forEach(element => {
      if (act_set === null) {
        if (element.ID === this.savedActSetId) {
          act_set = element;
        }
      }
    });

    let idd = 0;

    this.jsonArray = new Array();
    this.jsonArrayPL = new Array();

    e.forEach(element => {
      let geo_act_id;
      if (element.GEO_ACT_ID) {
        geo_act_id = element.GEO_ACT_ID;
      } else {
        if (element.ACT_ID) {
          geo_act_id = element.ACT_ID;
        }
      }
      this.jsonArray.push(geo_act_id);
      this.jsonArrayPL.push(element.PARTITION_LABEL);
    });

    // logConsole('Da Inserire', this.jsonArray, this.jsonArrayPL);

    if (act_set !== null) {
      this.indexJson = 0;
      this.attendiSalvataggioAA = true;
      this.scriveDatiSuDB(false, true);
    }
  }

  premutoTastoEditActSetRec(e) {
    // logConsole('Premuto edit', this.selezioneActSetRec); // JSON.parse(e));
    
    if (!this.selezioneActSetRec.selezionato) {
      this.mostraPopup('Error', 'No rows checked');
      return;
    }

    // this.actSetRecSel = JSON.parse(e);
    if (this.selezioneActSetRec && this.selezioneActSetRec.dati && this.selezioneActSetRec.dati[0]) {
      this.partitionLabelSel = this.selezioneActSetRec.dati[0].PARTITION_LABEL;
    } else {
      this.partitionLabelSel = '';
    }
    this.showPartitionLabel = true;
  }

  /* impostaPartitionLabel2() {
    logConsole(this.actSetRecSel);
    logConsole(this.partitionLabelSel);

    const params = '{' +
      '"v_cntx": "' + this.sessionID2 + '",' +
      '"v_geo_act_set_id": "' + this.actSetRecSel.ACT_SET_ID + '",' +
      '"v_geo_act_id": "' + this.actSetRecSel.ACT_ID +  '",' +
      '"v_partition_label": "' + this.partitionLabelSel + '"' +
    '}';
    this.apiService.chiamataPost(this.Utils, 'geo_act_set_rec__upd', JSON.parse(params))
    .map(response => response())
    .subscribe(data2 => {
      // logConsole('Lista eventi da mettere:', data2);
      if (data2 && data2 !== null) {
        // ExternalUtilities.checkRitornoChiamata(data2);
        if (data2 && data2 !== null) {
          if (data2.v_err_code && data2.v_err_code === 2) {
            ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
          } else {
            this.LeggeActivitySet(this.folderSelezionato);
            this.showPartitionLabel = false;
          }
        } else {
        }
      }
    });
    logConsole(this.partitionLabelSel);
    logConsole(this.selezioneActSetRec);

    let ok = false;
    let qq;
    let lista;
    if (this.selezioneActSetRec.dati) {
      qq = this.selezioneActSetRec.dati.length - 1
      lista = this.selezioneActSetRec.dati;
    / * } else {
      if (this.selezioneActSetRec) {
        qq = 1;
        lista = [this.selezioneActSetRec];
      } * /
    } else {
      qq = 0;
      lista = [this.selezioneActSetRec];
    }

    // logConsole(lista);

    / * if (!lista || !lista.dati || lista.dati.length === 0) {
      this.mostraPopup('Error', 'No rows checked');
      return;
    } * /

    let quante = qq;
    let quale = 0;
    const t = setInterval(() => {
      if (ok === true) {
        clearInterval(t);

        this.datiActivitySetRec = undefined;
        this.LeggeActivitySet(this.folderSelezionato);

        this.showPartitionLabel = false;
        // this.selezioneActSetRec = undefined;
      }
    }, 1000);

    lista.forEach(element => {
      const params = '{' +
        '"v_cntx": "' + this.sessionID2 + '",' +
        '"v_geo_act_set_id": "' + element.ACT_SET_ID + '",' +
        '"v_geo_act_id": "' + element.ACT_ID +  '",' +
        '"v_partition_label": "' + this.partitionLabelSel + '"' +
      '}';
      this.apiService.chiamataPost(this.Utils, 'geo_act_set_rec__upd', JSON.parse(params))
      .map(response => response)
      .subscribe(data2 => {
        // const data2 = JSON.parse(data);
      // logConsole('Lista eventi da mettere:', data2);
        if (data2 && data2 !== null) {
          // ExternalUtilities.checkRitornoChiamata(data2);
          if (data2 && data2 !== null) {
            if (data2.v_err_code && data2.v_err_code === 2) {
              // ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
            }
          } else {
          }

          quale++;
          if (quale >= quante) {
            ok = true;
          }
        }
      });
    });
  } */

  mostraPopup(titolo, messaggio) {
    Swal.fire({
      title: titolo,
      text: messaggio,
      icon: 'error',
      showClass: {
        backdrop: 'swal2-noanimation', // disable backdrop animation
        popup: '',                     // disable popup animation
        // icon: ''                       // disable icon animation
      },
    });
  }

  ultimaScelta = -1;

  selezionaPartitionLabel(e) {
    logConsole('Parition label scelto: ', e);

    if (e) {
      if (typeof(e) === 'string') {
        const ee = e.replace('***', '');
      
        let ok = false;
        let q = 0;
        this.datiPartitionLabel.forEach(element => {
          if (element.CODE_STR === ee) {
            ok = true;
          }
          if (element.ROW_ID > q) {
            q = element.ROW_ID;
          }
        });
        
        if (!ok) {
          // logConsole('PL', this.datiPartitionLabel);
          const app = JSON.parse(JSON.stringify(this.datiPartitionLabel));
          const s =  { ROW_ID: q + 1, CODE_STR: ee, VALUE_STR: ee };
          app.push (s);
          // app.sort((a, b) => (a.CODE_STR).localeCompare(b.CODE_STR));

          this.datiPartitionLabel = JSON.parse(JSON.stringify(app));

          const tm = setTimeout(() => {
            clearTimeout(tm);

            this.partitionLabelSel = ee;
          }, 100);
        }
      } else {
        if (e.CODE_STR) {
          this.partitionLabelSel = e.CODE_STR;
        }
      }
    } else {
      this.partitionLabelSel = '';
    }
  }

  selezionaPartitionLabel_old(e) {
    /* const ora = new Date().getTime();
    if (ora - this.ultimaScelta < 500) {
      return;
    }
    this.ultimaScelta = ora;

    logConsole('Valore', e);
    if (!e || e === undefined) {
      return;
    }
    if (typeof(e) === 'string') {
      let m = 0;
      this.datiPartitionLabel.forEach(element => {
        if (element.ROW_ID > m) {
          m = element.ROW_ID;
        }
      });
      m++;
      let valore = e.substring(3, e.length);
      const n = {
        ROW_ID: m,
        CODE_STR: valore,
        VALUE_STR: valore
      }
      this.datiPartitionLabel.push(n);
      this.partitionLabelSel = valore;
    } else {
      if (e.CODE_STR) {
        this.partitionLabelSel = e.CODE_STR;
      }
    }
    logConsole('Uscito', this.partitionLabelSel); */
    /* const ora = new Date().getTime();
    if (ora - this.ultimaScelta < 500) {
      return;
    }
    this.ultimaScelta = ora; */
    
    // logConsole('SPL: Valore', e);
    // logConsole('SPL: Selezionati', this.selezioneActSetRec2);
    // return;

    if (!e || e === undefined) {
      return;
    }

    if (typeof(e) === 'string') {
      /* let m = 0;
      let valore = e.substring(3, e.length);
      let ok = true;
      this.datiPartitionLabel.forEach(element => {
        if (element.ROW_ID > m) {
          m = element.ROW_ID;
        }
        if (element.CODE_STR.trim().toUpperCase() === valore.trim().toUpperCase()) {
          ok = false;
        }
      });
      if (!ok) {
        logConsole('SPL: Esco per valore uguale', e);
        return;
      }

      m++;
      const n = {
        ROW_ID: m,
        CODE_STR: valore,
        VALUE_STR: valore
      }
      logConsole('SPL: Aggiungo', e);
      const dpl = JSON.parse(JSON.stringify(this.datiPartitionLabel));
      dpl.push(n);
      dpl.sort((a, b) => (a.CODE_STR.localeCompare(b.CODE_STR)));

      this.datiPartitionLabel = JSON.parse(JSON.stringify(dpl));
      this.partitionLabelSel = valore;

      logConsole('SPL: Risultante', this.datiPartitionLabel);
      
      /* this.datiPartitionLabel = undefined;
      const tm = setTimeout(() => {
        this.datiPartitionLabel = JSON.parse(JSON.stringify(dpl));
        this.partitionLabelSel = valore;
      }, 10); */

      /* this.partitionLabelSel = '';
      this.datiPartitionLabel = undefined;

      const tm = setTimeout(() => {
        this.datiPartitionLabel = JSON.parse(JSON.stringify(dpl));
        const tm = setTimeout(() => {
          this.partitionLabelSel = valore;
          logConsole('SPL: Uscito 1', this.partitionLabelSel);
        }, 500);
      }, 100); */
    /* } else {
      if (e.CODE_STR) {
        // const tm = setTimeout(() => {
          this.partitionLabelSel = e.CODE_STR;
          logConsole('SPL: Prendo', e);
          logConsole('SPL: Uscito 2', this.partitionLabelSel);
          this.appoggioPL = e.CODE_STR;
        // }, 500);
      } */
    }
  }

  /* appoggioPL;

  checkPL(e) {
    this.appoggioPL = e;
  } */

  cambioFiltro() {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      logConsole('Cambio filtro', this.filtro);
      // this.filtro = e;
  
      localStorage.setItem('filterAct', this.filtro)
      this.LeggeFilters(this.savedActSetId);
    }, 500);
  }

  mostraNascondeMenu() {
    this.datiActivitySet = 'empty grid';
    this.datiActivitySetRec = 'empty grid';
    this.datiActivityFilters = 'empty grid';

    // this.mascheraVisibile = false;
    const rit = this.numeroActivitySet + '§' + this.savedActSetId;
    this.visibileEmit.emit(rit);
  }

  /* */

  refreshActivity(e) {
    this.refresh = !this.refresh;
    this.refreshEmit.emit(this.refresh);

    this.LeggeActivitySet(this.folderSelezionato);

    if (this.ultimaSelezionata && this.folderSelezionato !== this.ultimaSelezionata.FOLDER) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        if (e && this.isNumeric(e)) {
          // logConsole(this.datiActivitySet);
          this.datiActivitySet.DataTable.forEach(element => {
            if (+element.ID === +e) {
              this.ultimaSelezionataCod = element.ROW_ID;
              this.savedActSetId = element.ID;
              // this.LeggeActivitiesSetRec(this.savedActSetId);
              this.LeggeActivities(this.savedActSetId);
              this.confermaEmit.emit(this.numeroActivitySet + '§' + JSON.stringify(element));
              logConsole('Aggiornato ultima sel', this.ultimaSelezionataCod);
            }
          });
        }
      }, 1000);
    }
    // }
  }

  isNumeric(value: unknown): boolean {
    return typeof value === 'number' && !Number.isNaN(value);
  }

  premutoTastoConfirmActivitySet(e) {
    this.confermaEmit.emit(this.numeroActivitySet + '§' + JSON.stringify(e[0]));
    // logConsole('Conferma', JSON.stringify(e[0]));
    this.mostraNascondeMenu();
  }

  selezionateTutteLeRigheFilters(e) {
    logConsole('Pressione check act set rec su tutte add act', e);
    
    this.activityPerMappaSelected = '';
    this.tmsInizioPerMappaSelected = '';
    this.tmsFinePerMappaSelected = '';
    if (e.length === 0) {
      this.pulisceLayer = !this.pulisceLayer;
    } else {
      const t = setTimeout(() => {
        clearTimeout(t);

        e.forEach(element => {
          if (element) {
            this.activityPerMappaSelected += element.GEO_ACT_ID + '|';
            this.tmsInizioPerMappaSelected += element.START_TMS + ';';
            this.tmsFinePerMappaSelected += element.END_TMS + ';';
          }
        });
      }, 100);
      logConsole('Selezionate tutte le righe', e);
    }
    this.confirmKeyVisibileF = true;
  }

  deselezionateTutteLeRigheFilters(e) {
    this.activityPerMappaSelected = '';
    this.tmsInizioPerMappaSelected = '';
    this.tmsFinePerMappaSelected = '';

    this.pulisceLayer = !this.pulisceLayer;

    logConsole('Deselezionate tutte le righe', e);
    // logConsole('Azzero 2');
    this.confirmKeyVisibileF = false;
  }

  premutoTastoPaste(e) {
    const grigliaDaPassare = JSON.parse(JSON.stringify(this.datiActivitySetRec));
    grigliaDaPassare.DataTable = e;
    this.datiGrigliaCheck = JSON.parse(JSON.stringify(grigliaDaPassare));
    this.modalitaCheckPopup = 'paste_act_set_rec';
    this.operazioneCheckPopup = 'Paste';
    this.checkPopup = true;

    // logConsole('Process da rieseguire', grigliaDaPassare);
  }

  pasteEmit(e) {
    if (e) {
      logConsole('Paste emit', e);
      // return;

      this.premutoTastoConfirmFilter1(e);
    } else {
      ExternalUtilities.visualizzaAlert('Please select an act set');
    }
  }

  ritornoDimensioniColonneFolders(e) {
    ExternalUtilities.scriveDimensioniColonne('Folders', e);
  }

  ritornoDimensioniColonneActSet(e) {
    ExternalUtilities.scriveDimensioniColonne('ActSet', e);
  }

  ritornoDimensioniColonneActSetRec(e) {
    ExternalUtilities.scriveDimensioniColonne('ActSetRec', e);
  }

  ritornoDimensioniColonneFilters(e) {
    ExternalUtilities.scriveDimensioniColonne('Filters', e);
  }

  refreshFolders(r) {
    if (r === true) {
      this.datiFolders = undefined;
    }
    this.LeggeDatiFolders();
  }

  eseguiCheck(e) {
    logConsole('Ritorno esegui check', e);
    const modalita = e.modalita;

    switch (modalita) {
      case 'remove_activities':
        this.premutoTastoEliminaActSetRec1(e.dati);
        break;
      case 'add_activities':
        this.premutoTastoConfirmFilter1(e.dati);
        break;
      case "paste_act_set_rec":
        this.pasteEmit(e.dati);
        break;
    }
  }

  impostaTag(q) {
    if (this.staSalvando) {
      return;
    }

    let tag = '';
    let cosa = '';
    if (q === 1) {
      tag = 'act_tag1';
      cosa = this.ACT_TAG1;
    } else {
      tag = 'act_tag2';
      cosa = this.ACT_TAG2;
    }

    const selezionato = JSON.parse(JSON.stringify(this.selectedActSetRec));
    if (!selezionato) {
      return;
    }

    let ok = false;
    let qq = 0;
    let lista;
    if (selezionato.dati) {
      qq = selezionato.dati.length - 1
      lista = selezionato.dati;
    } else {
      if (selezionato) {
        qq = 1;
        lista = [selezionato];
      }
    }
    // logConsole('Valore pl: ', this.partitionLabelSel);
    // logConsole('Selezionati: ', qq, selezionato, selezionato.dati.length);
    if (selezionato.dati.length === 0) {
      this.mostraPopup('Info', 'No rows checked');
      return;
    }

    let quante = qq;
    let quale = 0;
    this.staSalvando = true;
    const t = setInterval(() => {
      if (ok === true) {
        clearInterval(t);

        this.staSalvando = false;
        this.LeggeActivitySet(this.folderSelezionato);
        this.showPartitionLabel = false;
        // this.selezioneActSetRec = undefined;
      }
    }, 1000);

    lista.forEach(element => {
      const params = '{' +
        '"v_cntx": "' + this.sessionID2 + '",' +
        '"v_act_set_name_list": "[ACT ID] ' + element.ACT_ID + '", ' +
        '"v_tag_field": "' + tag + '", ' +
        '"v_tag_value": "' + cosa + '", ' +
        '"v_tms_min": null, ' +
        '"v_tms_max": null ' +
      '}';
      logConsole('Parametri per tag', element, params);
      // return;
      this.apiService.chiamataPost(this.indirizzoServer, 'geo_act__tag', JSON.parse(params))
      // .map(response => response)
      .subscribe(data2 => {
        // logConsole('Lista eventi da mettere:', data2);
        if (data2 && data2 !== null) {
          ExternalUtilities.checkRitornoChiamata(this.Utils, data2);
          if (data2 && data2 !== null) {
            if (data2.v_err_code && data2.v_err_code === 2) {
              // ExternalUtilities.visualizzaAlert(data2.v_failure_reason);
            }
          } else {
          }
          quale++;
          if (quale > quante) {
            ok = true;
          }
        }
      });
    });      
    // }, 1000);
  }
}

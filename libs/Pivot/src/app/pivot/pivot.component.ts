import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, OnChanges, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
/* import { ChartTheme, ILoadedEventArgs } from "@syncfusion/ej2-charts/chart";
import { ExcelQueryCellInfoEventArgs } from "@syncfusion/ej2-grids";
import { DisplayOption, IAxisSet, IDataOptions, IDataSet, PivotView, ToolbarItems, CellEditSettings, PageSettings, PagerSettings, IFormatSettings, chartMouseClick, IConditionalFormatSettings, ColumnRenderEventArgs, VirtualScrollSettingsModel } from "@syncfusion/ej2-pivotview";
import { ChartSettings } from "@syncfusion/ej2-pivotview/src/pivotview/model/chartsettings";
import { GridSettings } from "@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings";
import { ApiService } from "../db/api.service";
import 'rxjs/add/operator/map';
import { registerLicense } from '@syncfusion/ej2-base';
import { Observable } from 'rxjs';
import ExternalUtilities from "../ExternalUtilities.component"; */

// let Universitydata: IDataSet[] = require('./../universitydata.json');
// declare var require: any;


/*
"@syncfusion/ej2-pivotview": "25.2.6",
"@syncfusion/ej2-dropdowns": "25.2.6",
"@syncfusion/ej2-base": "25.2.5",
"@syncfusion/ej2-angular-base": "25.2.4",
"@syncfusion/ej2-calendars": "25.2.5",
"@syncfusion/ej2-navigations": "25.2.4",
"@syncfusion/ej2-svg-base": "25.2.5",

"@syncfusion/ej2-charts": "25.2.6",

npm run build:stats
npm run analyze
*/


@Component({
    templateUrl: 'pivot.component.html',
    selector: 'pivot-component',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./pivot.style.css'],
    encapsulation: ViewEncapsulation.None
})

// PER RIMETTERE A POSTO:
// - Sovrascrivere il file package.json con il file package - Con SyncFusion.json
// - Rinominare in questo codice tutti i * / in */
// - Rimettere bene gli import
// - Decommentare tutto il codice

export class pivot { // implements OnInit, AfterViewInit, OnChanges {
  @Input() debug = false;
  @Input() numeroFrame;
  @Input() frameAttivo;
  @Input() impostazioniPivot;
  @Input() sessioneID;
  @Input() Utilities;
  @Input() Titolo;
  @Input() actSet;
  @Input() tmsMin;
  @Input() tmsMax;
  @Input() tmsRangeMin;
  @Input() tmsRangeMax;
  @Input() fieldList;
  @Input() cambioDimensioneContenitore;
  @Input() virtualizationAttiva = false;
  @Input() refreshDati;
  @Input() pulisceDati;
  @Input() expandAll;
  @Input() tipoDisplay = 'Both';
  @Input() debugEstremo = false;

  @Output() ritornoSettings: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickCellaEmit: EventEmitter<any> = new EventEmitter<any>();

  caricamentoInCorso = false;
  /* public dataSourceSettings: IDataOptions;
  public gridSettings: GridSettings;
  public toolbarOptions: ToolbarItems[];
  public chartSettings: ChartSettings;
  public displayOption: DisplayOption;
  public observable = new Observable();
  public editSettings: CellEditSettings;
  public pageSettings: PageSettings;
  public pagerSettings: PagerSettings;
  public virtualScrollSettings: VirtualScrollSettingsModel;

  datiCaricati = false;
  datiPivot;
  sessioneID2;
  impostazioniPivot2;
  actSet2;
  tmsMin2;
  tmsMax2;
  tmsRangeMin2;
  tmsRangeMax2;
  fieldList2;
  lastCall;
  chiSonoFieldValue;
  formatSettings;
  conditionalFormatting;
  expandAll2;
  vecchiDatiPivot;
  vecchiaX;
  vecchiaY;

  @ViewChild('pivotview') public pivotObj: PivotView;

  constructor(
    public http: HttpClient,
    private apiService: ApiService
  ) {
    registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF1cXmhOYVRpR2Nbe051flBAal9VVAciSV9jS3pTcEVkWXpbdndQQGNdUg==');
  }

  ngAfterViewInit(): void {
  }

  scriveDebugEstremo(Cosa, Parametro?) {
    if (this.debugEstremo) {
      if (Parametro) {
        console.log('PIVOT DE: ' + Cosa, Parametro);
      } else {
        console.log('PIVOT DE: ' + Cosa);
      }
    }
  }

  ngOnChanges(r): void {
    let aggiorna = false;
    let refresha = false;
    
    if (r.sessioneID && r.sessioneID.currentValue) {
      this.sessioneID2 = r.sessioneID.currentValue;
      aggiorna = true;
    }

    if (r.tipoDisplay) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Pulisce dati');
      }

      this.scriveDebugEstremo('Tipo Display Arrivato');

      // this.puliscePivot();
      // this.creaStruttura();
      aggiorna = true;
    }

    if (r.frameAttivo) {
      // this.puliscePivot();

      this.scriveDebugEstremo('Frame Attivo Arrivato');

      // this.creaStruttura();
      aggiorna = true;
    }

    /* if (r.pulisceDati && r.pulisceDati.currentValue) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Pulisce dati');
      }

      this.puliscePivot();
    } * /

    if (r.expandAll) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Expand All');
      }

      this.expandAll2 = r.expandAll.currentValue;
      refresha = true;

      this.scriveDebugEstremo('Expand All Arrivato', this.expandAll2);
      // this.refreshPivot('EXPAND ALL');
    }

    if (r.impostazioniPivot && r.impostazioniPivot.currentValue) {
      this.impostazioniPivot2 = r.impostazioniPivot.currentValue;
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Impostazioni: ', this.impostazioniPivot2);
      }

      this.scriveDebugEstremo('Impostazioni Pivot Arrivate', this.impostazioniPivot2);
  
      aggiorna = true;
    }

    if (r.actSet && r.actSet.currentValue) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. ActSet');
      }

      this.actSet2 = r.actSet.currentValue;

      this.scriveDebugEstremo('ActSet Arrivato', this.actSet2);

      aggiorna = true;
    }

    /* if (r.tmsMin && r.tmsMin.currentValue) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. TmsMin');
      }

      this.tmsMin2 = r.tmsMin.currentValue;
      aggiorna = true;
    }

    if (r.tmsMax && r.tmsMax.currentValue) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. TmsMax');
      }

      this.tmsMax2 = r.tmsMax.currentValue;
      aggiorna = true;
    } * /

    if (r.tmsRangeMin && r.tmsRangeMin.currentValue) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. TmsRangeMin');
      }

      this.tmsRangeMin2 = r.tmsRangeMin.currentValue;

      this.scriveDebugEstremo('Range Min Arrivato', this.tmsRangeMin2);

      aggiorna = true;
    }

    if (r.tmsRangeMax && r.tmsRangeMax.currentValue) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. TmsRangeMax');
      }

      this.tmsRangeMax2 = r.tmsRangeMax.currentValue;

      this.scriveDebugEstremo('Range Max Arrivato', this.tmsRangeMax2);

      aggiorna = true;
    }

    if (r.fieldList && r.fieldList.currentValue) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. FieldList');
      }

      this.fieldList2 = r.fieldList.currentValue;

      this.scriveDebugEstremo('Filed List Arrivato', this.fieldList2);

      aggiorna = true;
    }

    if (r.virtualizationAttiva && r.virtualizationAttiva.currentValue) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Virtualization');
      }

      this.scriveDebugEstremo('Virtualization Arrivato', r.virtualizationAttiva.currentValue);

      // if (!aggiorna) {
        refresha = true;
        // this.refreshPivot('VIRTUALIZATION');
      // }
    }

    if (r.cambioDimensioneContenitore && r.cambioDimensioneContenitore.currentValue) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. CambioDimCont');
      }

      this.scriveDebugEstremo('Virtualization Arrivato', r.cambioDimensioneContenitore.currentValue);
      
      refresha = true;
      // this.refreshPivot('CAMBIO DIMENSIONE');
      // this.onResized();
    }

    if (r.refreshDati && r.refreshDati.currentValue) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Refresh Dati');
      }

      this.scriveDebugEstremo('Refresh Dati Arrivato');
      
      // this.puliscePivot();
      // this.puliscePivot();
      // this.creaStruttura();
      // aggiorna = false;
      // this.lastCall = '';
      // this.EsegueQuery('REFRESH DATI');
      // if (!aggiorna) {
        refresha = true;
        // this.refreshPivot('ONCHANGE');
      // }
    }

    if (refresha && !aggiorna) {
      this.scriveDebugEstremo('Refresh Da OnChange');

      this.refreshPivot('ONCHANGE');
    } else {
      if (aggiorna) {
        this.scriveDebugEstremo('Aggiorna Dati Da OnChange 1');

        this.puliscePivot();

        this.scriveDebugEstremo('Aggiorna Dati Da OnChange 2');

        this.creaStruttura();

        this.lastCall = '';
        this.EsegueQuery('AGGIORNA PER FLAG');

        this.scriveDebugEstremo('Aggiorna Dati Da OnChange 3');
      }
    }
  }

  ngOnInit(): void {
    this.scriveDebugEstremo('On Init');

    this.creaStruttura();

    this.scriveDebugEstremo('On Init Fine');
  }

  creaStruttura() {
    this.scriveDebugEstremo('Crea Struttura 1');

    if (this.tipoDisplay === 'Both') {
      this.chartSettings = {
        title: this.Titolo,
        // ORIENTAMENTO VERTICALE LABELS
        showMultiLevelLabels: true,
        primaryXAxis: {
            labelRotation: 90,
            labelIntersectAction: 'Rotate90'
            // labelPosition: 'Inside',
        },          
        // ORIENTAMENTO VERTICALE LABELS
        chartSeries: { type: 'Column' },
        pointClick: this.observable.subscribe(args => {
          // alert('ppp');
          console.log('Premuto su chart', args);
        }) as any,
        load: this.observable.subscribe(args => {
            let selectedTheme: string = location.hash.split('/')[1];
            selectedTheme = selectedTheme ? selectedTheme : 'Material';
            (args as ILoadedEventArgs).chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() +
              selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
        }) as any,
      } as ChartSettings;
    } else {
      this.chartSettings = {} as ChartSettings;
    }

    if (this.debug) {
      console.log('Pivot frame ' + this.numeroFrame + '. Chart Settings ', this.chartSettings);
    }
    this.scriveDebugEstremo('Crea Struttura 2');

    this.displayOption = { view: this.tipoDisplay } as DisplayOption; // Table

    this.gridSettings = {
      columnWidth: 55, 
      allowSelection: true,
      allowAutoResizing: true,
      allowTextWrap: true,
      rowHeight: 25,
      /* columnRender: this.observable.subscribe((args: any) => {
        (args as any).columns[0].width = "300";
      }) as any, * /
      selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' },
      excelQueryCellInfo: this.observable.subscribe(args  => {
          if (((args as ExcelQueryCellInfoEventArgs).cell as IAxisSet).axis === 'value' && ((args as ExcelQueryCellInfoEventArgs).cell as IAxisSet).value === undefined) {
              (args as ExcelQueryCellInfoEventArgs).style.numberFormat = undefined;
          }
      }) as any
    } as GridSettings;
    
    this.scriveDebugEstremo('Crea Struttura 3');
    
    if (this.tipoDisplay === 'Both') {
      this.toolbarOptions = ['Save', 'SaveAs', 'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList']  as ToolbarItems[]; 
    } else {
      this.toolbarOptions = ['Save', 'SaveAs', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList']  as ToolbarItems[]; 
    }

    this.editSettings = { 
      allowAdding: true, 
      allowDeleting: true, 
      // allowEditing: true, 
      // mode: 'Normal'
    } as CellEditSettings;

    this.scriveDebugEstremo('Crea Struttura 4');

    this.pageSettings = {
      rowPageSize: 10,
      columnPageSize: 5,
      currentColumnPage: 1,
      currentRowPage: 1
    } as PageSettings;

    this.scriveDebugEstremo('Crea Struttura 5');

    this.pagerSettings = {
      position: 'Bottom',
      enableCompactView: false,
      showColumnPager: true,
      showRowPager: true,
      columnPageSizes: [5, 10, 20, 50, 100],
      rowPageSizes: [10, 50, 100, 200],
      isInversed: false,
      showColumnPageSize: true,
      showRowPageSize: true
    } as PagerSettings;

    this.scriveDebugEstremo('Crea Struttura 6');

    this.virtualScrollSettings = {
      allowSinglePage: false
    } as VirtualScrollSettingsModel;

    this.scriveDebugEstremo('Crea Struttura 7');
  }

  ultimaVoltaAggr = ExternalUtilities.creaVettore(10, '');

  EsegueQuery(daDove) {
    /* const ora = new Date().getTime();
    if (ora - this.ultimaVoltaAggr[this.numeroFrame] < 1000) {
      console.log('Pivot frame ' + this.numeroFrame + '. Esco per troppo veloce', this.numeroFrame);
  
      return;
    }
    this.ultimaVoltaAggr[this.numeroFrame] = ora; * /

    if (!this.actSet2) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Esco per act set vuoto');
      }
      // this.riempieVuota();
      return;
    }

    if (!this.tmsRangeMin2 || !this.tmsRangeMax2 || this.tmsRangeMin2 === null || this.tmsRangeMax2 === null) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Esco per tms vuoti', this.tmsRangeMin2, this.tmsRangeMax2);
      }
      // this.riempieVuota();
      return;
    }

    this.caricamentoInCorso = true;
    this.chiSonoFieldValue = 'F' + this.numeroFrame + ';P' + this.frameAttivo + ';' + new Date().toString();

    if (!this.fieldList2 || this.fieldList2 === null) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Esco per field lista vuota o nulla', this.fieldList2);
      }
      // this.riempieVuota();
      return;
    }

    const params = {
      v_cntx_id: this.sessioneID2,
      v_bbox: null,
      v_caller_tag: null,
      v_act_set_name_list: this.actSet2,
      v_tms_min: this.tmsRangeMin2,
      v_tms_max: this.tmsRangeMax2,
      v_field_list: this.fieldList2
    };

    this.scriveDebugEstremo('Esegue Query 1', params);

    if (this.lastCall === JSON.stringify(params)) {
      this.caricamentoInCorso = false;
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Esco per chiamata uguale', params);
      }
      return;
    }
    this.lastCall = JSON.stringify(params);

    params.v_caller_tag = this.chiSonoFieldValue;

    // this.puliscePivot();
    
    if (this.debug) {
      console.log('Pivot frame ' + this.numeroFrame + '. Esecuzione query da ' + daDove, params);
    }

    this.scriveDebugEstremo('Esegue Query 2');

    this.apiService.chiamataPost(this.Utilities, 'rpc/geo_tc_run_aggr__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      /* if (!this.controllaRitornoChiamata(data2, 'Aggr')) {
        this.caricamentoInCorso = false;
        if (this.debug) {
          console.log('Pivot frame ' + this.numeroFrame + '. Esco per chiamata vecchia', data2);
        }
        return;
      } * /

      if (data2 && data2 !== null) {
        if (this.debug) {
          console.log('Pivot frame ' + this.numeroFrame + '. Carico pivot', data2);
        }

        this.scriveDebugEstremo('Esegue Query 3', data2);

        this.conditionalFormatting = this.calcolaConditionalFormatting(data2.FieldITable);
        this.datiPivot = data2.DataTable;
        // console.log(JSON.stringify(this.datiPivot));

        this.impostaDati(daDove);

        this.scriveDebugEstremo('Esegue Query 4');
      } else {
        if (this.debug) {
          console.log('Pivot frame ' + this.numeroFrame + '. Dati vuoti', data2);
        }

        this.scriveDebugEstremo('Esegue Query Else');

        this.caricamentoInCorso = false;
      }
    }, error => {
      this.caricamentoInCorso = false;
      console.error('Read pivot:' + error);
    });
  }

  riempieVuota() {
    return;

    if (this.debug) {
      console.log('Pivot frame ' + this.numeroFrame + '. Dati pivot puliti', this.datiPivot);
    }
    this.datiPivot = undefined;
    this.impostaDati('Riempie vuota');
  }

  clickChart(e) {
    console.log(e);
  }

  /* riga = 0;
  massimo = 0;
  
  creaArray(pathRamo, jasone) {
    if (jasone && jasone !== null) {
      Object.keys(jasone).forEach(element => {
        if (element) {
          this.riga++;
          if (this.riga > this.massimo) {
            this.massimo = this.riga;
          }
          const profondita = (pathRamo + element).split(',');
          const pathRamoNuovo = (pathRamo ? (pathRamo + ',') : '') + this.riga.toString();

          if (typeof(jasone[element]) === 'object') {
            try {
              const prova = JSON.stringify(jasone[element]);
            } catch(e) {
              console.log('CHART ERROR 1', e, profondita, jasone[element]);
              return;
            }

            this.creaArray(pathRamoNuovo, jasone[element]);
          } else {
            try {
              const prova = JSON.stringify(jasone[element]);
            } catch(e) {
              console.log('CHART ERROR 2', e, profondita, jasone[element]);
              return;
            }
          }
        }
      });
    }
  } * /

  impostaDati(daDove) {
    this.scriveDebugEstremo('Imposta dati 1', daDove);

    if (this.debug) {
      console.log('Pivot frame ' + this.numeroFrame + '. Imposta dati provenienza ' + daDove);
    }

    /* setTimeout(() => {
      // FUNZIONE CHE TOGLIE I RIFERIMENTI CIRCOLARI
      
      // console.log('CHART SETTINGS 1', this.pivotObj.chartSettings);
      // this.pivotObj.chartSettings['parentObj'].properties.cellClick.observers[0]._subscriptions[0] = undefined;
      // this.creaArray('', this.pivotObj.chartSettings['parentObj'].properties.cellClick.observers[0]._subscriptions[0]._parentOrParents);
      const replacerFunc = () => {
        const visited = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (visited.has(value)) {
              // console.log(key, value);
              return;
            }
            visited.add(value);
          }
          return value;
        };
      };
      
      this.pivotObj.chartSettings = JSON.parse(JSON.stringify(this.pivotObj.chartSettings, replacerFunc()));
    }, 1000); * /

    /* this.pivotObj.chartSettings = undefined;
    setTimeout(() => {
      this.pivotObj.chartSettings = JSON.parse(JSON.stringify(this.chartSettings));
      console.log(this.pivotObj.chartSettings);
    }, 1000);

    this.pivotObj.chartSettings = this.chartSettings; * /

    // if (this.impostazioniPivot2) {      
      // setTimeout(() => {
        this.dataSourceSettings = {
          enableSorting: true,
          columns: this.impostazioniPivot2 ? this.impostazioniPivot2.columns : [],
          rows: this.impostazioniPivot2 ? this.impostazioniPivot2.rows : [],
          expandAll: this.expandAll2,
          values: this.impostazioniPivot2 ? this.impostazioniPivot2.values : [],
          filters: this.impostazioniPivot2 ? this.impostazioniPivot2.filters : [],
          filterSettings: this.impostazioniPivot2 ? this.impostazioniPivot2.filterSettings : [],
          // fieldMapping: this.impostazioniPivot2.fieldMapping,
          // groupSettings: this.impostazioniPivot2.groupSettings,
          conditionalFormatSettings: this.conditionalFormatting ? this.conditionalFormatting : [],
          showHeaderWhenEmpty: false,
          // emptyCellsTextContent: '(blank)',
          excludeFields: this.impostazioniPivot2 ? this.impostazioniPivot2.excludeFields : [],
          // formatSettings: this.formatSettings as IFormatSettings[],
          showGrandTotals: false,
          showAggregationOnValueField: true,

          showColumnGrandTotals: true,
          showColumnSubTotals: false,
          showRowGrandTotals: true,
          showRowSubTotals: true,
          showSubTotals: true,
          subTotalsPosition: "Auto",

          drilledMembers: this.impostazioniPivot2 ? this.impostazioniPivot2.drilledMembers : [],

          dataSource: this.datiPivot as IDataSet[],
          valueAxis: this.impostazioniPivot2.valueAxis,
        };

        this.scriveDebugEstremo('Imposta dati 2', this.dataSourceSettings);

        this.refreshPivot(daDove);

        if (this.debug) {
          console.log('Pivot frame ' + this.numeroFrame + '. Impostazioni: ', this.dataSourceSettings);
        }

        this.scriveDebugEstremo('Imposta dati 3');

        this.impostaFormatSettingsConTutteLeVariabili(daDove);

        this.scriveDebugEstremo('Imposta dati 4');

        setTimeout(() => {
          this.scriveDebugEstremo('Imposta dati 5');

          this.onResized(daDove);

          this.scriveDebugEstremo('Imposta dati 6');
        }, 500);
        // this.refreshPivot();

        this.caricamentoInCorso = false;

        // setTimeout(() => {
        // }, 1000);
      // }, 1000);
    // }
  }

  beforeToolbarRender(args: any) {
    this.scriveDebugEstremo('Before tool render 1');

    args.customToolbar.splice(8, 0, {
        text: 'Expand/Collapse',
        tooltipText: 'Expand All/Collapse All',
        click: this.toolbarClicked.bind(this),
    });

    args.customToolbar.splice(9, 0, {
      text: 'Axis Row/Column',
      tooltipText: 'Set value axis row/column',
      click: this.valueaxisChange.bind(this),
    });

    this.scriveDebugEstremo('Before tool render 2');
  }

  toolbarClicked(args: any) {
    this.scriveDebugEstremo('Tool bar clicked', args);

    // Empty the drilledMembers to work ExpandAll/CollapseAll functionality properly.
    if (this.pivotObj && this.pivotObj !== null) {
      this.pivotObj.dataSourceSettings.drilledMembers = [];
      this.pivotObj.dataSourceSettings.expandAll = !this.pivotObj.dataSourceSettings.expandAll;
    }

    this.scriveDebugEstremo('Tool bar clicked fine', this.pivotObj);
  }

  vecchioVA = 'column';

  valueaxisChange(args: any) {
    this.scriveDebugEstremo('Value axis change', args);

    if (this.vecchioVA == 'row') {
      this.vecchioVA = 'column';
    } else {
      this.vecchioVA = 'row';
    }
    // console.log(args.customToolbar);
    // args.customToolbar[9].text = 'W Pippo';
    if (this.pivotObj && this.pivotObj !== null) {
      this.pivotObj.dataSourceSettings.valueAxis = this.vecchioVA;
    }

    this.scriveDebugEstremo('Value axis change fine', this.pivotObj);
  }

  headerCell(args: any): void {
    this.scriveDebugEstremo('Header Cell', args);

    if (this.pivotObj && this.pivotObj !== null) {
      ((this.pivotObj as PivotView).renderModule as any).columnCellBoundEvent(args);
      // Add the custom class to the value headers here.
      if(args.node.querySelector('.e-headertext')) {
          args.node.querySelector('.e-headertext').classList.add('orientationcss');
      } // Add the custom class to the column headers here. 
      else if(args.node.querySelector('.e-stackedheadertext')) {
          args.node.querySelector('.e-stackedheadertext').classList.add('orientationcss');
      }
    }

    this.scriveDebugEstremo('Header Cell fine', this.pivotObj);
  }

  queryCell(args: any): void {
    this.scriveDebugEstremo('Query Cell', args);

    if (this.pivotObj && this.pivotObj !== null) {
      ((this.pivotObj as PivotView).renderModule as any).rowCellBoundEvent(args);
      //triggers for every cells.
      let colIndex = Number(args.cell.getAttribute('data-colindex'));
      // Remove the conditional formatting classes for "null" value cells here.
      if (args.data[colIndex].axis== 'value' && args.data[colIndex].actualText == "In_Stock" && args.data[colIndex].actualValue == null) {
          // As we only have one conditional format settings, its class name contains "0" and if we have another conditional format settings, the next class contains 1 and so on...
          for(var i=0; i<args.cell.classList.length; i++) {
              if(args.cell.classList.contains("format" + this.pivotObj.element.id + i)) {
                  args.cell.classList.remove("format" + this.pivotObj.element.id + i);
              }
          }
      }
    }

    this.scriveDebugEstremo('Query Cell fine', this.pivotObj);
  }

  enginePopulated(args: any): void {
    this.scriveDebugEstremo('Header Engine populated', args);

    // ORIENTAMENTO VERTICALE - NON SEMBRA FUNZIONARE
    // ((this.pivotObj as PivotView).grid as any).headerCellInfo = this.headerCell.bind(this);
    // RIMETTERE per provarlo

    if (this.pivotObj && this.pivotObj !== null) {
      ((this.pivotObj as PivotView).grid as any).queryCellInfo = this.queryCell.bind(this);
    }

    this.scriveDebugEstremo('Header Engine populated fine', this.pivotObj);
  }

  onDataBound(): void {
    this.scriveDebugEstremo('On Data Bound');

    if (this.pivotObj && this.pivotObj !== null) {
      const fieldlistModdule = this.pivotObj.pivotFieldListModule;
      if (fieldlistModdule && fieldlistModdule !== null && fieldlistModdule.dialogRenderer && fieldlistModdule.dialogRenderer.fieldListDialog) {
        fieldlistModdule.dialogRenderer.fieldListDialog.enableResize = true;
      }
    }

    // if (this.pivotObj?.showGroupingBar) {
      // (this.pivotObj?.grid as any).columnModel[0].width = 10;
      // console.log('PPP', (this.pivotObj?.grid as any).columnModel[0]);

      /* let columns: string[] = [];
      for (let i: number = 1; i < (this.pivotObj?.grid as any).columnModel.length; i++) {
          columns.push((this.pivotObj?.grid as any).columnModel[i].field);
      }
      this.pivotObj?.grid.autoFitColumns(columns); * /

      /* console.log('COLONNE', this.pivotObj.grid.getColumns());
      if ((this.pivotObj?.grid as any).columnModel.length > 10) {
        for (let i: number = 1; i < (this.pivotObj?.grid as any).columnModel.length; i++) {
          (this.pivotObj?.grid as any).columnModel[i].autoFit = false;
          (this.pivotObj?.grid as any).columnModel[i].minWidth = 10;
          (this.pivotObj?.grid as any).columnModel[i].width = 10;
        }
      } * /

    // }

    this.scriveDebugEstremo('On Data Bound fine', this.pivotObj);
  }

  impostaFormatSettingsConTutteLeVariabili(daDove) {
    this.scriveDebugEstremo('Imposta Format Settings Con Tutte Le Variabili', daDove);

    // setTimeout(() => {
      // alert('pp');
      const efs = new Array(); /* {
        cancel: false,
        formatName: "All Values",
        formatSettings: new Array(),
        name: "numberFormatting"
      };
      const el = {
        // format: "N1",
        // format: 'N0',
        format: '# ###.#0',
        name: 'All Values',
        useGrouping: true
      }
      // efs.formatSettings.push(el);
      efs.push(el); * /
      // console.log('Campi', this.dataSourceSettings?.values);
      // this.fieldList2
      if (this.debug) {
        console.log('Valori per format settings. Provenienza ' + daDove);
      }

      this.dataSourceSettings?.values.forEach(element => {
        let el;
        if (element['name'].toUpperCase().indexOf('COUNT') === -1) {
          el = {
            // format: "N1",
            format: '# ###.0',
            // name: element.CODE,
            name: element.name,
            useGrouping: true
          }
          // efs.formatSettings.push(el);
        } else {
          el = {
            // format: "N1",
            format: '# ##0',
            // name: element.CODE,
            name: element.name,
            useGrouping: true
          }
        }
        efs.push(el);
      });

      this.scriveDebugEstremo('Imposta Format Settings Con Tutte Le Variabili 2', daDove);

      /* const efs = new Array();
      efs.push({
        format: "# ###.#0",
        name: "count",
        useGrouping: true
      });
      efs.push({
        format: "# ###.#0",
        name: "o,act_id",
        useGrouping: true
      }); * /

      this.formatSettings = JSON.parse(JSON.stringify(efs)) as IFormatSettings[];
      if (this.dataSourceSettings) {
        this.dataSourceSettings.formatSettings = this.formatSettings;
      }

      this.scriveDebugEstremo('Imposta Format Settings Con Tutte Le Variabili 3', daDove);

      // this.refreshPivot();
      // this.dataSourceSettings.formatSettings = this.formatSettings;

      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Format settings: ', efs);
      }
    // }, 500);
  }

  refreshPivot(daDove) {
    this.scriveDebugEstremo('Refresh pivot', daDove);

    if (this.vecchiDatiPivot === JSON.stringify(this.datiPivot)) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Esco da refresh per dati uguali');
      }

      this.onResized(daDove);

      this.scriveDebugEstremo('Refresh pivot Vecchia', daDove);

      return;
    }
    this.vecchiDatiPivot = JSON.stringify(this.datiPivot);

    this.scriveDebugEstremo('Refresh pivot 2', daDove);

    /* if (this.pivotObj && this.datiPivot) {
      if (this.pivotObj.engineModule) {
        this.pivotObj.engineModule.fieldList = {};

        if (this.debug) {
          console.log('Pivot frame ' + this.numeroFrame + '. Refresh pivot 2', this.datiPivot);
        }

        if (this.datiPivot) {
        // } else {
        //   this.pivotObj.dataSourceSettings.dataSource = null;

          this.pivotObj.dataSourceSettings.formatSettings = this.formatSettings as IFormatSettings[];

          setTimeout(() => {
            this.pivotObj.dataSourceSettings.dataSource = this.datiPivot as IDataSet[];
          }, 1000);
        }
      } * /

    if (this.dataSourceSettings && this.impostazioniPivot2) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Refresh pivot da ', daDove);
      }

      const d: IDataOptions = JSON.parse(JSON.stringify(this.dataSourceSettings));

      d.formatSettings = this.formatSettings as IFormatSettings[];
      d.dataSource = this.datiPivot as IDataSet[];
      d.expandAll = this.expandAll2;
      d.conditionalFormatSettings = this.conditionalFormatting ? this.conditionalFormatting : [];
      d.drilledMembers = this.impostazioniPivot2.drilledMembers;
  
      // console.log('DRILLED', this.impostazioniPivot2.drilledMembers);
      // this.dataSourceSettings = JSON.parse(JSON.stringify(this.dataSourceSettings));

      this.dataSourceSettings = d; // JSON.parse(JSON.stringify(d));

      this.scriveDebugEstremo('Refresh pivot 3', this.dataSourceSettings);

    // } else {
    //   this.impostaDati(daDove);
    }

    this.onResized(daDove);
  
    this.scriveDebugEstremo('Refresh pivot 4', daDove);
  }

  puliscePivot() {
    this.scriveDebugEstremo('Pulisce pivot');

    /* if (this.pivotObj && this.pivotObj.engineModule) {
      this.pivotObj.engineModule.fieldList = {};
    } * /
    this.datiPivot = [] as IDataSet[];
    this.formatSettings = [] as IFormatSettings[];
    // const ds = [{ Empty: true }] as IDataSet[];
    this.dataSourceSettings = {
      dataSource: this.datiPivot,
      columns: [],
      rows: [],
      formatSettings: [],
      values: [],
      expandAll: false,
      filters: [],
      filterSettings: [],
      fieldMapping: [],
      groupSettings: [],
      conditionalFormatSettings: [],
      excludeFields: [],
      drilledMembers: [],
      valueAxis: 'column'
    };
    this.vecchioVA = 'column';
    // this.impostazioniPivot2 = JSON.parse(JSON.stringify(this.dataSourceSettings));
    
    if (this.debug) {
      console.log('Pivot frame ' + this.numeroFrame + '. Pulizia pivot');
    }

    this.scriveDebugEstremo('Pulisce pivot fine');
  }
  
  load() {
    /* if(this.pivotObj) {
      const dimeContX = +this.divCont.nativeElement.offsetWidth;
      const dimeContY = +this.divCont.nativeElement.offsetHeight + 5;

      this.pivotObj.width = dimeContX + 'px';
      this.pivotObj.height = dimeContY + 'px';
    } * /
    // this.onResized();
  }

  fieldListRefreshed(e) {
    this.scriveDebugEstremo('Field list Refreshed', e);

    if (this.debug) {
      console.log('Pivot frame ' + this.numeroFrame + '. fieldListRefreshed', e);
    }

    this.impostaFormatSettingsConTutteLeVariabili('FIELD LIST REFRESH');

    const ee = e.dataSourceSettings;
    const ritorno = {
      columns: ee.columns,
      rows: ee.rows,
      formatSettings: this.formatSettings,
      values: ee.values,
      filters: ee.filters,
      expandAll: this.expandAll2,
      filterSettings: ee.filterSettings,
      fieldMapping: ee.fieldMapping,
      groupSettings: ee.groupSettings,
      conditionalFormatSettings: ee.conditionalFormatSettings,
      excludeFields: ee.excludeFields,
      drilledMembers: ee.drilledMembers,
      valueAxis: ee.valueAxis
    }
    // this.dataSourceSettings = ritorno;

    this.ritornoSettings.emit(ritorno);

    this.scriveDebugEstremo('Field list Refreshed fine', ritorno);
  }

  controllaRitornoChiamata(dataP, chiamante) {
    return true;

    const data = dataP;

    let chiSono = '';

    switch(chiamante) {
      case 'Aggr':
        chiSono = this.chiSonoFieldValue;
        break;
    }

    if (chiSono === '') {
      // this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata nulla ' + chiamante);

      return false;
    }

    if (data && data.v_caller_tag) {
      const ritorno = data.v_caller_tag;
      if (ritorno !== chiSono) {
        // this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata diversa ' + chiamante, chiSono, ritorno);

        return false;
      } else {
        // this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: chiamata uguale ' + chiamante, chiSono, ritorno);

        return true;
      }
    } else {
      // this.Log.scriveLog(this, this.debug, this.Log.getMethodName(), false, 'Controllo ritorno chiamata: nessun codice di ritorno ' + chiamante);

      return true;
    }
  }
  
  staGiaTentandoResize = false;

  onResized(daDove) {
    this.scriveDebugEstremo('On Resized', daDove);

    if (this.debug) {
      console.log('Pivot frame ' + this.numeroFrame + '. Resize pivot provenienza ', daDove);
    }

    if (this.staGiaTentandoResize) {
      if (this.debug) {
        console.log('Pivot frame ' + this.numeroFrame + '. Resize pivot provenienza ' + daDove + '. Esco: già in corso');
      }

      return;
    }

    // console.log('On resized pivot');

    this.scriveDebugEstremo('On Resized 2', daDove);

    this.staGiaTentandoResize = true;
    if(this.pivotObj && this.pivotObj !== null) {
      // setTimeout(() => {
      if (this.datiPivot) {
        const nome = 'divContPivot_' + this.numeroFrame + '_' + this.frameAttivo;
        const divContPivot = document.getElementById(nome);
        if (divContPivot) {
          this.onResized2(divContPivot);
        } else {
          let c = 0;
          const t = setInterval(() => {
            const divContPivot = document.getElementById(nome);
            if (divContPivot) {
              clearInterval(t);
              this.onResized2(divContPivot);
            } else {
              c++;
              if (c > 50) {
                this.staGiaTentandoResize = false;
                clearInterval(t);
              }
            }
          }, 100);
        }
      }
    }

    this.scriveDebugEstremo('On Resized Fine', daDove);
  }

  onResized2(divContPivot) {
    this.scriveDebugEstremo('On Resized2 1', divContPivot);

    if (this.pivotObj && this.pivotObj !== null) {
      const dimeContX = divContPivot.offsetWidth; // +this.divCont.nativeElement.offsetWidth;
      const dimeContY = divContPivot.offsetHeight; // +this.divCont.nativeElement.offsetHeight + 5;
    
      if (dimeContX !== this.vecchiaX || dimeContY !== this.vecchiaY) {
        this.vecchiaX = dimeContX;
        this.vecchiaY = dimeContY;

        this.pivotObj.width = dimeContX + 'px';
        this.pivotObj.height = dimeContY + 'px';

        if (this.debug) {
          console.log('Pivot frame ' + this.numeroFrame + '. Resize pivot: ', dimeContX, dimeContY);
          console.log('Pivot frame ' + this.numeroFrame + '. Nuove misure pivot: ', this.pivotObj.width, this.pivotObj.height);
        }
      }
    }

    this.staGiaTentandoResize = false;
    /* } else {
    this.pivotObj.width = '0px';
    this.pivotObj.height = '0px';

    if (this.debug) {
      console.log('Pivot frame ' + this.numeroFrame + '. Resize pivot a zero');
    } * /

    this.scriveDebugEstremo('On Resized2 Fine', this.pivotObj);
  }

  numberFormat(e) {
    this.scriveDebugEstremo('Number Format', e);

    // console.log('Number format', e);

    this.impostaFormatSettingsConTutteLeVariabili('NUMBER FORMAT');

    // this.dataSourceSettings.formatSettings = this.formatSettings;

    this.ritornoSettings.emit(this.dataSourceSettings);

    this.scriveDebugEstremo('Number Format Fine');
  }

  clickCella(e) {
    // console.log('Click', e);
    this.clickCellaEmit.emit(e);
  }

  fConditionalFormatting(e) {
    console.log('Conditional formatting', e);
  }

  calcolaConditionalFormatting(ff) {
    this.scriveDebugEstremo('Calcola Conditional Formatting', ff);
    
    if (!ff || !ff[0]) {
      return [];
    }

    const ritorno = new Array();

    ff.forEach(element => {
      let continua = true;
      const f = element;

      if (f.thr_value_1 !== undefined) {
        ritorno.push({
          applyGrandTotals: true,
          conditions: "LessThanOrEqualTo",
          measure: f.field_code,
          style: {
            backgroundColor: f.color_1,
            color: "black",
            fontFamily: "Arial",
            fontSize: "12px"
          },
          value1: f.thr_value_1,
          value2: 0
        });
      }

      if (f.thr_value_1 !== undefined && f.thr_value_2 !== undefined) {
        ritorno.push({
          applyGrandTotals: true,
          conditions: "Between",
          measure: f.field_code,
          style: {
            backgroundColor: f.color_2,
            color: "black",
            fontFamily: "Arial",
            fontSize: "12px"
          },
          value1: f.thr_value_1,
          value2: f.thr_value_2
        });
      }

      if (f.thr_value_2 !== undefined && f.thr_value_3 !== undefined) {
        ritorno.push({
          applyGrandTotals: true,
          conditions: "Between",
          measure: f.field_code,
          style: {
            backgroundColor: f.color_3,
            color: "black",
            fontFamily: "Arial",
            fontSize: "12px"
          },
          value1: f.thr_value_2,
          value2: f.thr_value_3
        });
      }

      if (f.thr_value_3 !== undefined && f.thr_value_4 !== undefined) {
        ritorno.push({
          applyGrandTotals: true,
          conditions: "Between",
          measure: f.field_code,
          style: {
            backgroundColor: f.color_4,
            color: "black",
            fontFamily: "Arial",
            fontSize: "12px"
          },
          value1: f.thr_value_3,
          value2: f.thr_value_4
        });
      } else {
        if (f.thr_value_3 === undefined && f.thr_value_4 === undefined) {
          ritorno.push({
            applyGrandTotals: true,
            conditions: "GreaterThan",
            measure: f.field_code,
            style: {
              backgroundColor: f.color_4,
              color: "black",
              fontFamily: "Arial",
              fontSize: "12px"
            },
            value1: f.thr_value_3,
            value2: 0
          });  
        }
      }

      if (f.thr_value_4 !== undefined && f.thr_value_5 !== undefined) {
        ritorno.push({
          applyGrandTotals: true,
          conditions: "Between",
          measure: f.field_code,
          style: {
            backgroundColor: f.color_5,
            color: "black",
            fontFamily: "Arial",
            fontSize: "12px"
          },
          value1: f.thr_value_4,
          value2: f.thr_value_5
        });
      } else {
        if (f.thr_value_4 !== undefined && f.thr_value_5 === undefined) {
          ritorno.push({
            applyGrandTotals: true,
            conditions: "GreaterThan",
            measure: f.field_code,
            style: {
              backgroundColor: f.color_5,
              color: "black",
              fontFamily: "Arial",
              fontSize: "12px"
            },
            value1: f.thr_value_4,
            value2: 0
          });  
        }
      }

      if (f.thr_value_5 !== undefined && f.thr_value_6 !== undefined) {
        ritorno.push({
          applyGrandTotals: true,
          conditions: "Between",
          measure: f.field_code,
          style: {
            backgroundColor: f.color_6,
            color: "black",
            fontFamily: "Arial",
            fontSize: "12px"
          },
          value1: f.thr_value_5,
          value2: f.thr_value_6
        });
      } else {
        if (f.thr_value_5 !== undefined && f.thr_value_6 === undefined) {
          ritorno.push({
            applyGrandTotals: true,
            conditions: "GreaterThan",
            measure: f.field_code,
            style: {
              backgroundColor: f.color_6,
              color: "black",
              fontFamily: "Arial",
              fontSize: "12px"
            },
            value1: f.thr_value_5,
            value2: 0
          });  
        }
      }

      if (f.thr_value_6 !== undefined && f.thr_value_7 !== undefined) {
        ritorno.push({
          applyGrandTotals: true,
          conditions: "Between",
          measure: f.field_code,
          style: {
            backgroundColor: f.color_7,
            color: "black",
            fontFamily: "Arial",
            fontSize: "12px"
          },
          value1: f.thr_value_6,
          value2: f.thr_value_7
        });
      } else {
        if (f.thr_value_6 !== undefined && f.thr_value_7 === undefined) {
          ritorno.push({
            applyGrandTotals: true,
            conditions: "GreaterThan",
            measure: f.field_code,
            style: {
              backgroundColor: f.color_7,
              color: "black",
              fontFamily: "Arial",
              fontSize: "12px"
            },
            value1: f.thr_value_6,
            value2: 0
          });  
        }
      }

      if (f.thr_value_7 !== undefined) {
        ritorno.push({
          applyGrandTotals: true,
          conditions: "GreaterThan",
          measure: f.field_code,
          style: {
            backgroundColor: f.color_8,
            color: "black",
            fontFamily: "Arial",
            fontSize: "12px"
          },
          value1: f.thr_value_7,
          value2: 0
        });
      }

      /* ritorno.push({
        applyGrandTotals: true,
        conditions: "Between",
        measure: f.field_code,
        style: {
          backgroundColor: "#FFFFFF",
          color: "black",
          fontFamily: "Arial",
          fontSize: "12px"
        },
        value1: -0.00001,
        value2: +0.00001
      }); * /
    });

    this.scriveDebugEstremo('Calcola Conditional Formatting', ritorno);

    if (this.debug) {
      console.log('Pivot frame ' + this.numeroFrame + '. Conditional formatting: ', ritorno);
    }

    return (ritorno as IConditionalFormatSettings[]);
  }

  saveReport(e) {
    console.log('Save report', e, JSON.parse(e.report));
  }

  esegueDrill(e) {
    this.scriveDebugEstremo('Drill', e);

    setTimeout(() => {
      console.log('Drill', e, e.pivotview.dataSourceSettings.properties.drilledMembers);
      // this.dataSourceSettings.drilledMembers = e.pivotview.dataSourceSettings.properties.drilledMembers[0].properties;
      this.impostazioniPivot2.drilledMembers = e.pivotview.dataSourceSettings.properties.drilledMembers[0].properties;
  
      // this.fieldListRefreshed(e.pivotview);
  
      this.onResized('Drill');

      this.ritornoSettings.emit(this.impostazioniPivot2);        

      this.scriveDebugEstremo('Drill fine', e);
    }, 500);
  } */
}


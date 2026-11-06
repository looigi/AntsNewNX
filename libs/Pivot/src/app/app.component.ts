import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './db/api.service';
// import 'rxjs/add/operator/map';
import { Utils } from './Utilities.component';
import ExternalUtilities from './ExternalUtilities.component';
import { ExternalHttpClient } from './db/httpclient.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'pivot';

  sessioneID;
  Titolo = 'Titolo Pivot';
  cambioDimensioneContenitore;

  dati;
  actSet;
  tmsMin;
  tmsMax;
  tmsGlobalMin;
  tmsGlobalMax;
  fieldList;
  refreshDati;
  expandAll = true;
  frameAttivo = 1;
  tipoDisplay = 'Both';

  Utils = {
    linkIcone: 'https://antsk8sttest-1595377875.eu-south-1.elb.amazonaws.com/geoantsweb/assets/img' // 'http://10.100.7.69/assets/img'
  };
  platformName = 'Scritta di Test';

  constructor(
    private http2: ExternalHttpClient,
    public Utilities: Utils,
    private apiService: ApiService,
  ) {
  }

  ngOnInit() {
    this.getJSON().subscribe(data => {
      const b = data; //  JSON.parse(data._body);
      // console.log('JSON:', b);
      this.Utilities.indirizzoServer = b.indirizzoServer;
      this.Utilities.linkIcone = b.linkIcone;
      this.Utilities.serverPostRest = b.serverPostRest;

      let pwd = '';
      const p = localStorage.getItem('H7-25-PIV');
      if (p !== null) {
        pwd = p;
      } else {
        pwd = prompt("H7-25-PIV", "");
        if (pwd === '') {
          ExternalUtilities.visualizzaAlert('No!');
          return;
        }  else  {
          localStorage.setItem('H7-25-PIV', pwd);
        }
      }

      this.login('Luigi.Pecce', pwd);
    });
  }

  public getJSON(): Observable<any> {
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, window.location);
    let indirizzo = '';
    if (window.location.hostname.indexOf('localhost') > -1 && (window.location.port === '4200' || window.location.port === '4201')) {
      indirizzo = 'http://localhost:2727/assets/connection.json?d=' + new Date();
    } else {
      indirizzo = window.location.origin + '/assets/connection.json?d=' + new Date();
    }
    // // this.Log?.scriveLog(this, this.debug2, this.Log.getMethodName(), false, indirizzo);
    return this.http2.get(this.Utilities, indirizzo);
  }

  login(username, password) {
    const params = {
      v_name: username,
      v_password: password,
      v_client_public_ip: '',
      v_city: '',
      v_client_country: '',
      v_org: ''
    };
    this.apiService.chiamataPost(this.Utilities, 'rpc/operator__login', params)
    // .map(response => response)
    .subscribe(data => {
      if (data) {
        if (data.err_code !== 0) {
          const rr = data.failure_reason;
        } else {
          this.loginOK(data.cntx_id);
        }
      } else {
        alert('No return for login');
      }
    }, error => {
      alert(error);
    });
  }

  loginOK(sessionId) {
    this.dati = {
      columns: [],
      rows: [],
      formatSettings: [],
      values: [],
      expandAll: true,
      filters: [],
      filterSettings: [],
      fieldMapping: [],
      groupSettings: [],
      conditionalFormatSettings: [],
      excludeFields: []
    };

    const d = localStorage.getItem('SettaggiPivotDebug');
    if (d !== null) {
      this.dati = JSON.parse(d);
    }

    this.sessioneID = sessionId;
    ExternalUtilities.sessione = sessionId;

    // if (fermati) {
    //   return;
    // }

    this.actSet = "[ACT SET] FW BA 4G 06-03-24";
    this.tmsMin = "2024-03-06 07:57:01.000";
    this.tmsMax = "2024-03-06 12:02:07.000";
    this.tmsGlobalMin = "2024-03-06 07:57:01.000";
    this.tmsGlobalMax = "2024-03-06 12:02:07.000";

    this.fieldList = [
      {
          "DIM": "N",
          "CODE": "o,HttpUpl.TransferTime",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "50 Event",
          "ROW_ID": 569,
          "TYPE_STR": "numeric",
          "RELEVANCE": "6 Event",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": "TcRun HttpUpl.TransferTime",
          "FIELD_COUNT": 294,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "Y",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,HttpUpl.TransferTime",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 208,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "numeric.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "Y",
          "CODE": "o,act_id",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "Default",
          "ROW_ID": 24,
          "TYPE_STR": "string",
          "RELEVANCE": "3 Low",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": null,
          "FIELD_COUNT": 3556,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "N",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,act_id",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 6,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "string.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "Y",
          "CODE": "o,TcName",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "Default",
          "ROW_ID": 278,
          "TYPE_STR": "string",
          "RELEVANCE": "3 Low",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": null,
          "FIELD_COUNT": 3556,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "N",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,TcName",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 12,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "string.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "Y",
          "CODE": "o,band_list",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "Default",
          "ROW_ID": 38,
          "TYPE_STR": "string",
          "RELEVANCE": "3 Low",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": null,
          "FIELD_COUNT": 2050,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "N",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,band_list",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 39,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "string.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "N",
          "CODE": "o,CallSetupTime",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "50 Event",
          "ROW_ID": 571,
          "TYPE_STR": "numeric",
          "RELEVANCE": "6 Event",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": "TcRun Dial.CallSetupTime (ALL)",
          "FIELD_COUNT": 583,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "Y",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,CallSetupTime",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 80,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "numeric.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "N",
          "CODE": "o,Pattern_Offset_ms",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "50 Event",
          "ROW_ID": 572,
          "TYPE_STR": "numeric",
          "RELEVANCE": "6 Event",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": "TcRun O.Pattern_Offset_ms",
          "FIELD_COUNT": 3556,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "Y",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,Pattern_Offset_ms",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 16,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "numeric.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "N",
          "CODE": "o,sinr_pcell",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "Default",
          "ROW_ID": 247,
          "TYPE_STR": "string",
          "RELEVANCE": "3 Low",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": null,
          "FIELD_COUNT": 1854,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "Y",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,sinr_pcell",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 291,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "string.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "N",
          "CODE": "o,rssi",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "Default",
          "ROW_ID": 230,
          "TYPE_STR": "string",
          "RELEVANCE": "3 Low",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": null,
          "FIELD_COUNT": 1906,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "Y",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,rssi",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 393,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "string.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "N",
          "CODE": "o,rsrq",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "Default",
          "ROW_ID": 228,
          "TYPE_STR": "string",
          "RELEVANCE": "3 Low",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": null,
          "FIELD_COUNT": 1710,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "Y",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,rsrq",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 166,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "string.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "N",
          "CODE": "o,rsrp",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "Default",
          "ROW_ID": 226,
          "TYPE_STR": "string",
          "RELEVANCE": "3 Low",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": null,
          "FIELD_COUNT": 1710,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "Y",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,rsrp",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 419,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "string.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "Y",
          "CODE": "o,Result",
          "USED": "Y",
          "VIEW": "N",
          "FOLDER": "Default",
          "ROW_ID": 216,
          "TYPE_STR": "string",
          "RELEVANCE": "3 Low",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": null,
          "FIELD_COUNT": 3556,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "N",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,Result",
          "DIM_ICON_NAME": "Y.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 3,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "string.png",
          "MEASURE_AVG_ICON_NAME": "Y.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      },
      {
          "DIM": "N",
          "CODE": "o,Pattern_Delay_ms",
          "USED": "N",
          "VIEW": "N",
          "FOLDER": "Default",
          "ROW_ID": 171,
          "TYPE_STR": "string",
          "RELEVANCE": "3 Low",
          "FILTER_MAX": "",
          "FILTER_MIN": "",
          "DESCRIPTION": null,
          "FIELD_COUNT": 3256,
          "IN_DATA_SET": "Y",
          "MEASURE_AVG": "Y",
          "MEASURE_MAX": "N",
          "MEASURE_MIN": "N",
          "DISPLAY_NAME": "o,Pattern_Delay_ms",
          "DIM_ICON_NAME": "N.png",
          "VIEW_ICON_NAME": "N.png",
          "DISPLAY_NAME_FRM": "color: #000000",
          "MEASURE_DIM_STEP": "",
          "FIELD_VALUE_COUNT": 2668,
          "FILTER_VALUE_LIST": "",
          "STATUS_DESCRIPTION": "in dataset",
          "TYPE_STR_ICON_NAME": "string.png",
          "MEASURE_AVG_ICON_NAME": "N.png",
          "MEASURE_MAX_ICON_NAME": "N.png",
          "MEASURE_MIN_ICON_NAME": "N.png"
      }
    ];
  }

  refresha(t) {
    if (t) {
      this.actSet = "[ACT SET] FW RM 4G Q2 2024";
      this.tmsMin = "2024-05-13 07:56:01";
      this.tmsMax = "2024-05-13 12:32:35";
      this.tmsGlobalMin = "2024-05-13 07:56:01";
      this.tmsGlobalMax = "2024-05-13 12:32:35";
    }
    
    this.refreshDati = new Date().toString();
  }

  ritornoSettings(e) {
    if (e) {
      console.log('Ritorno settings: ', e);
      localStorage.setItem('SettaggiPivotDebug', JSON.stringify(e));
      this.dati = e;
    }
  }

  dragEndOrizzontale(e) {
    // console.log('Drag pivot', e);
    this.cambioDimensioneContenitore = new Date().toString();
  }

  clickataCella(e) {
    console.log('Ritorno click: ', e);
  }

  cambiaTipoDisplay() {
    if (this.tipoDisplay === 'Both') {
      this.tipoDisplay = 'Table';
    } else {
      if (this.tipoDisplay === 'Table') {
        this.tipoDisplay = 'Both';
      }
    }
  }
}

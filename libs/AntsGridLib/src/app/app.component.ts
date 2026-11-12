import { Component, OnInit } from '@angular/core';
import {ApiService} from '../db/api.service';
import {SessionService} from '../db/session.service';
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import Utils from './modules/general/Utilities.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'ants-grid-lib';
  indirizzoServer = Utils.indirizzoServer; // 'https://geoants-pre.ants-aubay.it';

  limitaRighePerDebug = {
    numeroRighe: -1,
    numeroCampi: -1,
    getOtherStyle: true,
    getCellStyle: true,
    eseguiAutoFit: true,
    controllaSelezione: true,
    allineamentiVari: true
  }

  Utils = Utils;
  
  sessioneID;
  itemsMenu: any[] = [{
    text: 'Item1'
  }, {
      text: 'Item2',
      items: [{ text: 'Item2.1' }]
  }, {
      text: 'Item3'
  }];

  vociTrovate = [{
    Percorso: 'W il percorso del filtro 1',
    Selezionato: false,
    RigaPari: false
  },{
    Percorso: 'W il percorso del filtro 2. Testo volutamente lungo per andare a capo e visualizzare la stringa come se fosse un paragrafo.',
    Selezionato: false,
    RigaPari: true
  },{
    Percorso: 'W il percorso del filtro 3',
    Selezionato: false,
    RigaPari: false
  },{
    Percorso: 'W il percorso del filtro 4',
    Selezionato: false,
    RigaPari: true
  },{
    Percorso: 'W il percorso del filtro 5. Secondo testo volutamente ancora più lungo per andare a capo e visualizzare la stringa come se fosse un altro paragrafo.',
    Selezionato: false,
    RigaPari: false
  },{
    Percorso: 'W il percorso del filtro 6',
    Selezionato: false,
    RigaPari: true
  },{
    Percorso: 'W il percorso del filtro 7',
    Selezionato: false,
    RigaPari: false
  },{
    Percorso: 'W il percorso del filtro 8',
    Selezionato: false,
    RigaPari: true
  },{
    Percorso: 'W il percorso del filtro 9',
    Selezionato: false,
    RigaPari: false
  }];

  pulisceGriglia = undefined;
  tastoConfermaVisibile = false;
  tastoNewVisibile = false;
  tastoEditVisibile = false;
  tastoDeleteVisibile = false;
  debug = false;

  nomiColonne;
  appoggioDati;
  datiDiProvaGrid;
  datiDiProvaTree;
  pulisceSel;
  rinfrescaGriglia = false;
  effettuaAutoResize = false;
  collassa = false;
  righePerPaginaVirtuale = 30;
  numeroPaginaImpostata = 20;
  filtroEventi = '';
  secondoInizio = '2020-02-27 11:17:08';
  selezione: any = [1,2,3,4,5];
  selezioneMultipla = false;
  autoResize = true;

  raggruppabile = false;
  paginazione = 'scrollable';
  righeAutomatiche = false;
  permetteDragDrop = false;
  misureAddizionaliTCRUN;
  gestisceComboTramiteCookie = false;
  max;
  columnsSettings2;
  warning = '';

  constructor(
    private datePipe: DatePipe,
    private sessionService: SessionService,
    private apiService: ApiService
  ) {
  }

  ngOnInit() {
    // this.datiDiProvaGrid = null;
    // this.datiDiProvaGrid = this.CreateEmptyGrid('ppp');
    let pwd = '';
    const p = localStorage.getItem('H7-25-G');
    if (p !== null) {
      pwd = p;
    } else {
      pwd = prompt("H7-25-G", "");
      if (pwd === '') {
        alert('No!');
        return;
      }  else  {
        localStorage.setItem('H7-25-G', pwd);
      }
    }

    this.EffettuaLogin('Luigi.Pecce', pwd);
  }

  leggeDati() {
    // this.EffettuaLogin('Luigi.Pecce', 'cerioni');

    // this.datiDiProvaGrid = this.CreateEmptyGrid('Prova');
    // this.datiDiProvaTree = this.CreateTree();
  }

  CreateTree() {
    let s: string;
    s = '[{"ROW_ID":1,"NODE_TYPE":"Category","LABEL":" <NOT ASSIGNED> [52]","OBJ_ID":"CATEGORY = <NOT ASSIGNED>","FATHER_ID":"root",';
    s += '"FILTER":"CATEGORY IS NULL"},{"ROW_ID":2,"NODE_TYPE":"root","LABEL":"<ALL> [85]","OBJ_ID":"root","FATHER_ID":null,"FILTER":';
    s += '" "},{"ROW_ID":3,"NODE_TYPE":"Category","LABEL":"BVT_Lines [6]","OBJ_ID":"CATEGORY = BVT_Lines","FATHER_ID":"root","FILTER":';
    s += '"CATEGORY like \'%BVT_Lines%\'"},{"ROW_ID":4,"NODE_TYPE":"Category","LABEL":"Cagallone [4]","OBJ_ID":"CATEGORY = Cagallone",';
    s += '"FATHER_ID":"root","FILTER":"CATEGORY like \'%Cagallone%\'"},{"ROW_ID":5,"NODE_TYPE":"Category","LABEL":"FIxed Line Roma [4]"';
    s += ',"OBJ_ID":"CATEGORY = FIxed Line Roma","FATHER_ID":"root","FILTER":"CATEGORY like \'%FIxed Line Roma%\'"},{"ROW_ID":6,';
    s += '"NODE_TYPE":"Category","LABEL":"Gio1 [6]","OBJ_ID":"CATEGORY = Gio1","FATHER_ID":"root","FILTER":"CATEGORY like \'%Gio1%\'"}';
    s += ',{"ROW_ID":7,"NODE_TYPE":"Category","LABEL":"IP_PHONE_RTUPC [2]","OBJ_ID":"CATEGORY = IP_PHONE_RTUPC","FATHER_ID":"root",';
    s += '"FILTER":"CATEGORY like \'%IP_PHONE_RTUPC%\'"},{"ROW_ID":8,"NODE_TYPE":"Category","LABEL":"Mini TA 4 [4]","OBJ_ID":';
    s += '"CATEGORY = Mini TA 4","FATHER_ID":"root","FILTER":"CATEGORY like \'%Mini TA 4%\'"},{"ROW_ID":9,"NODE_TYPE":"Category",';
    s += '"LABEL":"PSTN.Ita [1]","OBJ_ID":"CATEGORY = PSTN.Ita","FATHER_ID":"root","FILTER":"CATEGORY like \'%PSTN.Ita%\'"},';
    s += '{"ROW_ID":10,"NODE_TYPE":"Category","LABEL":"Pretedda [3]","OBJ_ID":"CATEGORY = Pretedda","FATHER_ID":"root","FILTER":';
    s += '"CATEGORY like \'%Pretedda%\'"},{"ROW_ID":11,"NODE_TYPE":"Category","LABEL":"Techub [1]","OBJ_ID":"CATEGORY = Techub",';
    s += '"FATHER_ID":"root","FILTER":"CATEGORY like \'%Techub%\'"},{"ROW_ID":12,"NODE_TYPE":"Category","LABEL":"Test [2]",';
    s += '"OBJ_ID":"CATEGORY = Test","FATHER_ID":"root","FILTER":"CATEGORY like \'%Test%\'"}]';
    const dd = JSON.parse(s);

    return dd;
  }

  CreateEmptyGrid(maskName) {
    // console.log('Create empty grid: ' + maskName);

    let s: string;
    s = '{"DataTable":[{"ROW_ID":1.0,"ANTS_ID":"TS_ID=37516","TS_ID":37516.0,"TS_NAME":"Http_DevTest","TS_STATUS":null,"EXEC_DATE":';
    s += '"2018-05-07 11:30:35","STATUS_ICO":"Aborted","NUM_TO_EXECUTE":null,"EXECUTED_ITERATIONS":0.0,"PRIORITY":1.0,"EXEC_MODE":';
    s += '"Immediate","EXEC_MODE_CODE":1.0,"FREQUENCY":null,"START_DATE":"2018-05-07 08:59:53","END_DATE":"2018-05-07 11:33:07",';
    s += '"TD_NAME":"http_hspa_NoWeb","STATUS_DESCRIPTION":null,"TD_TYPE":176.0,"TD_FOLDER":"1TestNoWeb","OPERATOR":"Giovanni.Cabras",';
    s += '"IS_PUBLIC":"N","IS_PAUSED":"N","GROUP_NAME":"root","DEFINE_AS":"User","DESCRIPTION":null,"TRAILIS":"0,1,2,3,4,5,6,7|0,0,0,0,0,';
    s += '0,0,0|0,0,0,0,0,0,0,0|0,0,0,0,0,0,0,0","SCENARIO_TYPE":"Monitoring","<Scenario.Type>":"Monitoring","<O.NeId>":"PORT Albania-';
    s += 'Tirana","<O.SubscrCategory>":"SimSimulate_OPER_08"},{"ROW_ID":2.0,"ANTS_ID":"TS_ID=37515","TS_ID":37515.0,"TS_NAME":';
    s += '"Ftp_Rating_1.5_NoWeb","TS_STATUS":null,"EXEC_DATE":null,"STATUS_ICO":"NeverRun","NUM_TO_EXECUTE":null,"EXECUTED_ITERATIONS":';
    s += '0.0,"PRIORITY":1.0,"EXEC_MODE":"Immediate","EXEC_MODE_CODE":1.0,"FREQUENCY":null,"START_DATE":"2018-05-07 08:45:17","END_DATE":';
    s += 'null,"TD_NAME":"Ftp_Rating_1.5_NoWeb","STATUS_DESCRIPTION":null,"TD_TYPE":176.0,"TD_FOLDER":"1TestNoWeb","OPERATOR":';
    s += '"Giovanni.Cabras","IS_PUBLIC":"N","IS_PAUSED":"N","GROUP_NAME":"root","DEFINE_AS":"User","DESCRIPTION":"eee","TRAILIS":';
    s += '"0,1,2,3,4,5,6,7|0,0,0,0,0,0,0,0|0,0,0,0,0,0,0,0| ';
    s += '0,0,0,0,0,0,0,0","SCENARIO_TYPE":"Monitoring","<Scenario.Type>":"Monitoring","<O.NeId>":"PORT Albania-Tirana",';
    s += '"<O.SubscrCategory>":"WIND"},{"ROW_ID":3.0,"ANTS_ID":"TS_ID=37829","TS_ID":37829.0,"TS_NAME":"iiiiiii","TS_STATUS":null,';
    s += '"EXEC_DATE":null,"STATUS_ICO":"NeverRun","NUM_TO_EXECUTE":null,"EXECUTED_ITERATIONS":0.0,"PRIORITY":1.0,"EXEC_MODE":';
    s += '"Immediate","EXEC_MODE_CODE":1.0,"FREQUENCY":null,"START_DATE":"2018-09-07 08:59:07","END_DATE":null,"TD_NAME":';
    s += '"http_hspa_NoWeb","STATUS_DESCRIPTION":null,"TD_TYPE":176.0,"TD_FOLDER":"1TestNoWeb","OPERATOR":"Luigi.Pecce",';
    s += '"IS_PUBLIC":"N","IS_PAUSED":"N","GROUP_NAME":"root","DEFINE_AS":"User","DESCRIPTION":null,"TRAILIS":"0,1,2,3,4,5,6,7';
    s += '|0,0,0,0,0,0,0,0|0,0,0,0,0,0,0,0|0,0,0,0,0,0,0,0","SCENARIO_TYPE":"Monitoring","<Scenario.Type>":"Monitoring","<O.NeId>":';
    s += '"PORT Albania-Tirana","<O.SubscrCategory>":"WIND"}],';
    s += '"GridProperty":[{"IsFilterDisplayed":"N","ShowColumnSelector":"true","GridName":"Test Scenario","ItemsPerPage":"25",';
    s += '"ItemsPerPageMax":"25","reportType":"Rep"}],"ColumnProperty":[{"headerText":"SCENARIO_TYPE","key":"SCENARIO_TYPE",';
    s += '"dataType":"string","IsEmpty":"false","place":"001","Icon":null,"hide":"true","locked":null},{"headerText":"ROW_ID",';
    s += '"key":"ROW_ID","dataType":"numeric","IsEmpty":"false","place":"002","Icon":null,"hide":"true","locked":null},';
    s += '{"headerText":"<Scenario.Type>","key":"<Scenario.Type>","dataType":"string","IsEmpty":"false","place":"003","Icon":null,';
    s += '"hide":"true","locked":null},{"headerText":"Ts Id","key":"TS_ID","dataType":"numeric","IsEmpty":"false","place":"004",';
    s += '"Icon":null,"hide":"false","locked":"true"},{"headerText":"Ts Name","key":"TS_NAME","dataType":"string","IsEmpty":"false",';
    s += '"place":"005","Icon":null,"hide":"false","locked":"true"},{"headerText":"Latest Exec","key":"EXEC_DATE","dataType":';
    s += '"date","IsEmpty":"false","place":"008","Icon":null,"hide":"false","locked":null},{"headerText":"Latest Result","key":';
    s += '"STATUS_ICO","dataType":"string","IsEmpty":"false","place":"009","Icon":"ICONS","hide":"false","locked":null},{"headerText"';
    s += ':"Exec Mode","key":"EXEC_MODE","dataType":"string","IsEmpty":"false","place":"010","Icon":null,"hide":"false","locked":null}';
    s += ',{"headerText":"Priority","key":"PRIORITY","dataType":"string","IsEmpty":"false","place":"012","Icon":null,"hide":"true",';
    s += '"locked":null},{"headerText":"Executed Runs","key":"EXECUTED_ITERATIONS","dataType":"numeric","IsEmpty":"false","place":';
    s += '"013","Icon":null,"hide":"true","locked":null},{"headerText":"Results by Day (GMT)","key":"TRAILIS","dataType":null,';
    s += '"IsEmpty":"false","place":"015","Icon":null,"hide":"false","locked":null},{"headerText":"O.SubscrCategory","key":';
    s += '"<O.SubscrCategory>","dataType":"string","IsEmpty":"false","place":"016","Icon":null,"hide":"false","locked":null},';
    s += '{"headerText":"O.NeId","key":"<O.NeId>","dataType":"string","IsEmpty":"false","place":"017","Icon":"FLAGS","hide":"false"';
    s += ',"locked":null},{"headerText":"Td Folder","key":"TD_FOLDER","dataType":"string","IsEmpty":"false","place":"034","Icon":null,';
    s += '"hide":"true","locked":null},{"headerText":"Td Name","key":"TD_NAME","dataType":"string","IsEmpty":"false","place":"035",';
    s += '"Icon":null,"hide":"true","locked":null},{"headerText":"Group","key":"GROUP_NAME","dataType":"string","IsEmpty":"false",';
    s += '"place":"037","Icon":null,"hide":"true","locked":null},{"headerText":"Is Public","key":"IS_PUBLIC","dataType":"string",';
    s += '"IsEmpty":"false","place":"038","Icon":null,"hide":"true","locked":null},{"headerText":"Is Paused","key":"IS_PAUSED",';
    s += '"dataType":"string","IsEmpty":"false","place":"039","Icon":null,"hide":"true","locked":null},{"headerText":"Operator",';
    s += '"key":"OPERATOR","dataType":"string","IsEmpty":"false","place":"040","Icon":null,"hide":"true","locked":null},{"headerText';
    s += '":"Description","key":"DESCRIPTION","dataType":"string","IsEmpty":"false","place":"041","Icon":null,"hide":"false","locked"';
    s += ':null},{"headerText":"Defined As","key":"DEFINE_AS","dataType":" string","IsEmpty":"false","place":"042","Icon":null,"hide":';
    s += '"true","locked":null},{"headerText":"Td Type","key":"TD_TYPE","dataType":"numeric","IsEmpty":"false","place":"043","Icon":';
    s += 'null,"hide":"true","locked":null},{"headerText":"ANTS_ID","key":"ANTS_ID","dataType":"string","IsEmpty":"false","place":"044"';
    s += ',"Icon":null,"hide":"true","locked":null},{"headerText":"Start Date","key":"START_DATE","dataType":"date","IsEmpty":"false",';
    s += '"place":"045","Icon":null,"hide":"true","locked":null},{"headerText":"End Date","key":"END_DATE","dataType":"date","IsEmpty":';
    s += '"false","place":"046","Icon":null,"hide":"true","locked":null},{"headerText":"EXEC_MODE_CODE","key":"EXEC_MODE_CODE",';
    s += '"dataType":"string","IsEmpty":"false","place":"047","Icon":null,"hide":"true","locked":null}],"RESULT":[{"message":"OK",';
    s += '"requestStartTimeStamp":1569392676745}]}';

    const dd = JSON.parse(s);

    return dd;
  }

  cellClickGrid(e) {
    console.log('Premuto click su riga di una griglia:', e);
  }

  cellClickTree(e) {
    console.log('Premuto click su riga della tree:', e);
  }

  EffettuaLogin(userName, password) {
    console.log('Effettuo login');

    const params = {
      v_city: 'Milan',
      v_client_country: 'ITA',
      v_client_public_ip: '185.142.153.241',
      v_name: userName,
      v_org: 'SUPERNAP Italia S.r.l.',
      v_password: password
    };
    // console.log('geo_lookup__sel 1', new Date().getTime());
    this.apiService.chiamataPost('rpc/operator__login', params, false)
    // .map(response => response)
    .subscribe(data => {
        if (data) {
          // const data = JSON.parse(data2);
          console.log('Ritorno login: ', data);

          // const dd2 = data.OBJECT[0].object;
          const rr = data.err_code;

          if (rr === 0) {
            // console.log('Login Ok');

            this.sessionService.setRemember(true);
            this.sessionService.setUser(data);
            this.sessionService.setToken(data.cntx_id);
            this.sessionService.setLogged(true);
            this.sessioneID = data.cntx_id;

            console.log('Carico dati');

            // this.datiDiProvaGrid = 'empty grid';
            this.EffettuaTestGriglia();
          } else {
            alert('Connection error:' + data.v_failure_reason);
          }
        } else {
          console.log('Nessun dato ritornato dal login:', data);
        }
    }, error =>  {
      alert('Login:' + error);
    // TODO alert error
    });


    /* this.apiService.login({username: userName, password: password, groupname: 'ANTSNVL'})
    .map(response => response.json())
    .subscribe(
      data => {
        if (data) {
          // console.log('Utente: ', data);

          const dd = data.OBJECT[0].object;
          const rr = data.RESULT[0].message;

          console.log('Risposta login:', rr);

          if (rr === 'Ok') {
            // console.log('Login Ok');

            this.sessionService.setRemember(true);
            this.sessionService.setUser(dd);
            this.sessionService.setToken(dd.sessionId);
            this.sessionService.setLogged(true);

            console.log('Carico dati');

            // this.datiDiProvaGrid = 'empty grid';
            this.EffettuaTestGriglia();
          }
        }
      }, error =>  {
        alert(error);
      // TODO alert error
      }); */
  }

  EffettuaTestTree() {
    console.log('Test Tree');
    // this.datiDiProvaTree = this.CreateTree();
    // console.log(this.datiDiProvaTree);

    // VP_GEO_DASHBOARD_TREE - VIEW_TD_TREE - VIEW_GEO_ACT_SET_REC
    this.apiService.getViewData('VIEW_TD_TREE', '')
    // .map(response => response)
    .subscribe(data => {
      // let data = JSON.parse(data2);
      console.log(data['RESULT'][0].message.toUpperCase());
      if (data === undefined) { data = null; }
      if (data['RESULT'] && data['RESULT'][0].message.toUpperCase() === 'OK') {
        console.log('HOME Tree', data);
        this.datiDiProvaTree = data['DataTable'];
     } else {
        this.datiDiProvaTree = null;
      }
    }, error => {
      alert(error);
    });
  }

  EffettuaTestGriglia() {
    /* const params = '{' +
      '"act_name": "20200225_114649_e6a471fa9015_07 I1_2-2_slot_4G_Data_Telekom.nsfx 25.2.2020.07", ' +
      '"v_tms_min": "2020-02-25 12:56:27", "v_tms_max": "2020-02-25 12:58:27", "v_event_type_list": "",' +
      '"prm_01": "", "prm_02": "", "prm_03": "", "prm_04": "", "prm_05": "", "prm_06": "", "prm_07": "",' +
      '"prm_08": "", "prm_09": "", "prm_10": ""' +
    '}';

    const params = '{"cntx_id": "5bf1cc39-a4b3-43bd-b50c-4dae059a89d9",' +
      '"v_filter_act_set_id": 203,"v_event_type_list": "","v_tms_min": "2020-02-25 12:01:27",' +
      '"v_tms_max": "2020-02-25 12:03:27"}'; */

    let nome = '';
    let params;
    let modalita;

    // PER CAMBIARE LA CONNESSIONE ANDARE SU UTILITIES.COMPONENT.TS E MODIFICARE LA VARIABILE STATIC INDIRIZZOSERVER
    
    let tipo: string = 'eventi'; // 'alarm_grid'; // 'mistral_flow_segment'; // 'ants1_td_sched_tree__grid'; // 'mistral_flow_stat';; 
    // // 'tcrungrid'; // 'agn_grid'; // 'aireq_template_grid'; // 
      // 'aireq_template_grid'; // 'rbcixl'; // 'thr'; 
      // 'sim_full'; // ;
      // 'hist_log_grid'; // 'arfcn'; //  
      // 'act_set_rec'; // 'tcrunmongrid'; // 'cell_measure';
      // 'plmn'; // 'user_profile'; // 'eventi'; // 'mosaic'; 
      // 'vuota'; // 'ai_queries'; // 'area'; // 'geo_tc_run_fields__grid'; 
      // 'activity'; // 'geo_measure_dfn__grid'; // 'antenne'; // 'clusters';
      // 'geo_point_info__grid'; // ;

    const t1 = (new Date(this.secondoInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime());
    const t2 = (new Date(this.secondoInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime() + 24999);
    const tI = new Date().getTime();
    const tF = new Date().getTime() - (10 * 24 * 60 * 60 * 1000);
    const inizioTms = this.datePipe.transform(t1, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    const fineTms = this.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    const fineTms2 = this.datePipe.transform(tF, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    const inizioTms2 = this.datePipe.transform(tI, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    this.raggruppabile = false;
    this.paginazione = 'scrollable';
    this.righePerPaginaVirtuale = 30;
    this.righeAutomatiche = false;
    this.collassa = true;
    this.selezioneMultipla = true;
    this.permetteDragDrop = false;
    this.misureAddizionaliTCRUN = ['', '', '', ''];
    this.gestisceComboTramiteCookie = false;
    this.debug = true;
    let rfiClone = false;
    // this.autoResize = true;
    console.log(inizioTms, fineTms, fineTms2);

    switch (tipo) {
      case '':
        break;
      case 'ants1_td_sched_tree__grid':
        rfiClone = true;

        params = {
          v_cntx_id: "3508cc81e240ee56feb46aa7af1ffa71",
          v_filter: [{SCENARIO_TYPE: "Monitoring"}]
        }
        nome = 'ants1_td_sched_tree__grid';
        this.selezioneMultipla = false;
        this.autoResize = false;
        this.raggruppabile = true;
        modalita = 3;
        break;
      case 'aireq_template_grid':
        params = {
          v_caller_tag: "F9;P2;Thu Jun 18 2026 08:38:52 GMT+0200 (Ora legale dell’Europa centrale)",
          v_cntx_id: this.sessioneID,
          v_prompt_data_type: "Activity Events"
        }
        nome = 'aireq_template__grid';
        this.selezioneMultipla = false;
        this.autoResize = false;
        this.raggruppabile = true;
        modalita = 3;
        break;
      case 'agn_grid':
        params = {
          v_cntx_id: this.sessioneID,
          v_caller_tag: 1778845162766,
          v_filter: "",
          v_group_id: 550100,
          v_prop_name_1: "",
          v_prop_name_2: "",
          v_prop_name_3: "",
          v_prop_name_4: "",
          v_prop_name_5: "",
          v_prop_name_6: "",
          v_prop_name_7: "",
          v_prop_name_8: "",
          v_prop_name_9: ""
        }
        nome = 'agn__grid';
        this.selezioneMultipla = false;
        this.autoResize = false;
        modalita = 3;
        break;
      case 'sim_full':
        params = {
          v_cntx_id: this.sessioneID,
          v_filter: "[{\"CATEGORY\":\"AUBAY_TIM_Dati\"}]"        
        }
        nome = 'ants1_sim_full__grid';
        this.selezione = [-1];
        this.selezioneMultipla = true;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'mistral_flow_stat':
        params = {
          v_cntx_id: this.sessioneID,
          v_flow_type: null,
          v_mode: "mistral_flow_queue",
          v_tms_max: "2024-02-23 11:33:31.000",
          v_tms_min: "2024-02-23 05:12:00.000"
        }
        nome = 'mistral_flow_stat__grid';
        this.selezione = [-1];
        this.selezioneMultipla = true;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'mistral_flow_segment':
        params = {
          v_caller_tag: "F1;P7;Fri Feb 27 2026 07:33:12 GMT+0100 (Ora standard dell’Europa centrale)",
          v_cntx_id: this.sessioneID,
          v_filter: "{\"route\":\"\",\"line\":[],\"from\":[],\"to\":[],\"uniqueid\":[],\"cdn_status\":[],\"cdn_info\":[],\"id\":[],\"flow_type\":[],\"from_tms\":\"2026-02-20 05:12:00.000\",\"to_tms\":\"2026-08-23 11:33:31.000\"}",
          v_limit: 5000,
          v_stand_alone: "Y"
        }
        nome = 'mistral_flow_segment_to_dispatch__grid';
        this.selezione = [-1];
        this.selezioneMultipla = true;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'alarm_grid':
        params = {
          tms_from: "2026-02-16 00:00:00",
          tms_to: "2026-02-23 23:59:59",
          v_cntx_id: this.sessioneID,
          v_view_mode: "view_current"
        }
        nome = 'alarm__grid';
        this.selezione = [-1];
        this.selezioneMultipla = true;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'rbcixl':
        params = {
          v_act_set_name_list: "null",
          v_caller_tag: "F4;P7;Wed May 06 2026 07:52:33 GMT+0200 (Ora legale dell’Europa centrale)",
          v_cntx_id: this.sessioneID,
          v_filter: "{\"route\":\"\",\"line\":[],\"from\":[],\"to\":[],\"desc\":[],\"param\":[],\"value\":[],\"idname\":[],\"from_tms\":\"2026-05-05 00:00:00\",\"to_tms\":\"2026-05-07 00:00:00\"}",
          v_limit: 5000,
          v_stand_alone: "Y",
          v_text_filter: null,
          v_tms_current: null,
          v_tms_zero: null            
        }
        nome = 'mistral_rbcixl_message__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'arfcn':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[ACT] 20250226_110701_SCAN00001.01. mgre",
          v_bbox: "(ALL)",
          v_caller_tag: "F1;P2;Thu May 08 2025 12:07:42 GMT+0200 (Ora legale dell’Europa centrale)",
          v_corr_measr_code_1: "act_coverage_arfcn",
          v_filter_measr_code_1: "'struct_tc_run_result'",
          v_filter_measr_code_2: "null",
          v_filter_measr_value_1: "null",
          v_filter_measr_value_2: "null",
          v_geo_sla_name: "Template",
          v_measr_code_list: "ALL",
          v_tms_max: "2025-02-26 11:44:45.000",
          v_tms_min: "2025-02-26 11:06:52.000"
        }
        nome = 'geo_arfcn__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'vuota':
        this.datiDiProvaGrid = 'empty grid';
        return;
        break;
      case 'errore':
        this.datiDiProvaGrid = 'ERROR: W Pippo Baudo';
        return;
        break;
      case 'sample_cross':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[ACT SET] Demo RM 4G MNO MVNO Benchmarking",
          v_aggr_type: "histo_y_num",
          v_bbox: "(ALL)",
          v_caller_tag: "F7;P15;Wed Jun 07 2023 09:50:27 GMT+0200 (Ora legale dell’Europa centrale)",
          v_chart_type: "bars",
          v_filter_measr_code_1: "null",
          v_filter_measr_code_2: "null",
          v_filter_measr_value_1: "null",
          v_filter_measr_value_2: "null",
          v_geo_sla_name: "Template",
          v_measr_code_1: "cluster_cluster wind3",
          v_measr_code_2: "act_coverage_nr_ssb_rsrp_pscell",
          v_measr_code_3: "struct_partition_label",
          v_measr_code_4: null,
          v_tms_max: "2022-09-30 10:34:03",
          v_tms_min: "2022-09-27 12:45:00"
        }
        nome = 'geo_measure_sample_cross__sel';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = true;
        modalita = 6;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        console.log('Chiamata', params);
        break;
      case 'geo_tc_run_fields__grid':
        params = {
          v_cntx_id: this.sessioneID,
          v_caller_tag: "F3;P1;Thu Apr 18 2024 15:27:05 GMT+0200 (Ora legale dell’Europa centrale)",
          v_act_set_name_list: "[ACT SET] FW MI 5G Dinamico",
          v_tms_max: "2024-02-23 11:33:31.000",
          v_tms_min: "2022-02-23 05:12:00.000",
          v_field_list: null
        };
        nome = 'geo_tc_run_fields__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'tcruninfo':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[ACT] 20240514_101100_SDTU000464.01. NA 4G Benchmarking Dinamico ILIAD v6 (1)",
          v_tms: null,
          v_tms_max: "2024-05-14 14:38:32.000",
          v_tms_min: "2024-05-14 10:11:01.000"        
        };
        nome = 'geo_tc_run_files__grid';
        this.selezione = [-1];
        this.selezioneMultipla = true;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'ai_queries':
        params = {
          v_cntx_id: this.sessioneID,
          v_filter_status: null,
          v_filter_data_set: null,
          v_caller_tag: null
        };
        nome = 'aireq__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'clusters':
        params = {
          cntx_id: this.sessioneID,
          v_cluster_name: "autostrade IT"
        };
        nome = 'cluster__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = true;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'users':
        params = {
          cntx_id: this.sessioneID,
          v_group_name: ""
        };
        nome = 'operator__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = true;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'lookup':
        params = {
          cntx_id: this.sessioneID,
          v_view_mode: "v_lookup"
        };
        nome = 'db_obj__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = true;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'activityset':
        params = {
          cntx_id: this.sessioneID,
          v_filter_folder: '[AGN]'
        };
        nome = 'geo_act_set__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = true;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        this.numeroPaginaImpostata = 0;
        break;
      case 'plmn':
        params = {
          cntx_id: this.sessioneID
        };
        nome = 'plmn__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = true;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        break;
      case 'mosaic':
        params = {
          cntx_id: this.sessioneID,
          geoants_bbox_max_x: 90,
          geoants_bbox_max_y: 180,
          geoants_bbox_min_x: -90,
          geoants_bbox_min_y: -180,
          v_act_set_name_list: "[ACT] 20230609_120911_SCAN082101006.01.",
          v_geo_sla_name: "Template",
          v_measr_code: "Scn 4G.1800.1500.sinr",
          v_square_meters: "200",
          v_tms_max: "2023-06-09 15:06:21.000",
          v_tms_min: "2023-06-09 12:09:11.000",
        };
        nome = 'mosaic__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = true;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        break;
      case 'geo_point_info__grid':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: '[AGN] SDTU01001.01',
          v_tms: '2021-01-17 11:22:39',
          v_geo_sla_name: 'Template'
        };
        nome = 'geo_point_info__grid';
        this.selezione = [-1];
        this.selezioneMultipla = true;
        this.raggruppabile = true;
        this.autoResize = true;
        modalita = 3;
        this.collassa = true;
        this.righePerPaginaVirtuale = 999;
        break;
      case 'db_obj__grid':
        params = {
          cntx_id: this.sessioneID,
          v_view_mode: "pg_stat_user_indexes"
        };
        nome = 'db_obj__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        break;
      case "agents":
        params = {
          v_cntx_id: this.sessioneID,
          v_caller_tag: 1700133441302,
          v_filter: "",
          v_group_id: 659767,
          v_prop_name_1: "",
          v_prop_name_2: "",
          v_prop_name_3: ""
        }
        nome = 'agn__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        break;
      case 'act_set_rec':
        params = {
          cntx_id: this.sessioneID,
          v_filter_act_set_id: 1128673,
          v_filter_folder: ''
        };
        nome = 'geo_act_set_rec__grid';
        this.selezione = [-1];
        this.selezioneMultipla = true;
        this.autoResize = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        break;
      case 'hist_log_grid':
        params = {
          cntx_id: this.sessioneID,
          tms_from: "2026-02-26 11:18:36",
          tms_to: "3000-02-05 23:59:59",
          v_filter: "",
          v_filter_list: "[]",
          v_include_agn: "N"
        };
        nome = 'hist_log__grid';
        this.selezione = [-1];
        this.selezioneMultipla = false;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        break;
      case 'activity':
        params = {
          cntx_id: this.sessioneID,
          v_filter_act_set_id: 1002,
          v_filter_folder: ''
        };
        nome = 'geo_act__grid';
        this.selezione = [-1];
        this.selezioneMultipla = true;
        modalita = 3;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        break;
      case 'thr':
        params = {
          cntx_id: this.sessioneID,
          v_filter_geo_sla_id: 0
        };
        nome = 'geo_sla_thr__grid';
        modalita = 3;
        this.raggruppabile = true;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        break;
      case 'mistral_cdr':
        params = {
          v_cntx_id: this.sessioneID,
          v_tms_max: "2026-01-15 00:00:00.000",
          v_tms_min: "2026-01-12 00:00:00.000"
        };
        nome = 'mistral_cdr__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.raggruppabile = false;
        this.collassa = false;
        this.righePerPaginaVirtuale = 999;
        break;
      case 'cdr_voice':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: '[AGN GROUP] Aubay',
          v_bbox: '(ALL)',
          v_filter_group_by: '',
          v_tms_max: '2021-03-24 00:00:00',
          v_tms_min: '2021-03-16 00:00:00'
        };
        nome = 'geo_cdr_voice__grid';
        modalita = 2;
        break;
      case 'cdr_data':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: '[AGN GROUP] Aubay',
          v_bbox: '(ALL)',
          v_filter_group_by: '',
          v_tms_max: '2021-06-24 00:00:00',
          v_tms_min: '2021-03-16 00:00:00'
        };

        this.selezioneMultipla = false;
        nome = 'geo_cdr_data__grid';
        modalita = 2;
        break;
      case 'tsconfig':
        params = {
          cntx_id: this.sessioneID,
          v_ts_id: 18
        };
        nome = 'ts_info__grid';
        modalita = 3;
        break;
      case 'system':
        params = {
          cntx_id: this.sessioneID
        };
        nome = 'system_info__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.raggruppabile = true;
        break;
      case 'eventi':
        params = {
          v_cntx: this.sessioneID,
          v_act_set_name_list: "[AGN] SDTU000458.01",
          v_col_compressed: "Y",
          v_event_list: "",
          v_event_type_list: "ALL",
          v_format: "json",
          v_prm_01: "Mobile Tech",
          v_prm_01_name: null,
          v_prm_02: "RxLev PCell [dB]",
          v_prm_02_name: null,
          v_prm_03: "RSCP PCell [dBm]",
          v_prm_03_name: null,
          v_prm_04: "RSRP PCell [dBm]",
          v_prm_04_name: null,
          v_prm_05: "XCGI PCell",
          v_prm_05_name: null,
          v_prm_06: "Band Num Combination",
          v_prm_06_name: null,
          v_prm_07: "ants-pdu,**,bandNR",
          v_prm_07_name: "bandNR ",
          v_prm_08: "ants-pdu,**,requestedFreqBandsNR-MRDC-r15,**,bandEUTRA",
          v_prm_08_name: "bandEUTRA ",
          v_prm_09: "ants-pdu,DL-DCCH-Message,message,c1,rrcConnectionReconfiguration,criticalExtensions,c1,rrcConnectionReconfiguration-r8,measConfig,measObjectToAddModList,**,MeasObjectToAddMod,measObject,measObjectNR-r15,bandNR-r15,setup",
          v_prm_09_name: "setup",
          v_prm_10: "ants-pdu,DL-DCCH-Message,message,c1,rrcConnectionReconfiguration,criticalExtensions,c1,rrcConnectionReconfiguration-r8,measConfig,measObjectToAddModList,**,MeasObjectToAddMod,measObject,measObjectNR-r15,bandNR-r15,setup",
          v_prm_10_name: "band list",
          v_prm_11: "ants-pdu,DL-DCCH-Message,message,c1,rrcConnectionReconfiguration,criticalExtensions,c1,rrcConnectionReconfiguration-r8,measConfig,measObjectToAddModList,**,MeasObjectToAddMod,measObject,measObjectNR-r15,bandNR-r15,setup",
          v_prm_11_name: "supported band list",
          v_prm_12: "ants-pdu,UL-DCCH-Message,message,c1,ueCapabilityInformation,criticalExtensions,c1,ueCapabilityInformation-r8,ue-CapabilityRAT-ContainerList,Item 0,UE-CapabilityRAT-Container,ueCapabilityRAT-Container /342/200/246,UE-EUTRA-Capability,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,nonCriticalExtension,irat-ParametersNR-r15,supportedBandListEN-DC-r15,**,bandNR-r15",
          v_prm_12_name: null,
          v_prm_13: "ants-pdu,RRCReconfiguration,criticalExtensions,rrcReconfiguration,measConfig,measObjectToAddModList,Item 0,MeasObjectToAddMod,measObject,measObjectNR,freqBandIndicatorNR",
          v_prm_13_name: null,
          v_prm_14: "ants-pdu,Session Initiation Protocol (200),Message Header,CSeq,Method",
          v_prm_14_name: null,
          v_prm_15: "ants-pdu,Session Initiation Protocol (OPTIONS),Message Header,Via,Branch",
          v_prm_15_name: null,
          v_prm_16: "ants-pdu,**,CSeq,Sequence Number",
          v_prm_16_name: null,
          v_prm_17: "o,TcName",
          v_prm_17_name: null,
          v_prm_18: "o,DataConnectTime",
          v_prm_18_name: null,
          v_prm_19: "",
          v_prm_19_name: null,
          v_prm_20: "",
          v_prm_20_name: null,
          v_real_time: "N",
          v_report_event_text: "N",
          v_search_text: "",
          v_text_filter: "",
          v_text_filter_exclude: "",
          v_tms_current: "2025-07-22 11:02:00",
          v_tms_max: "2025-07-22 12:33:47.000",
          v_tms_min: "2025-07-22 11:02:00.000",
          v_tms_zero: "2025-07-22 11:02:00"
        }

        nome = 'antsgeo_get_event_crosstab8';
        modalita = 3;
        this.autoResize = false;
        this.paginazione = 'scrollable';
        break;
      case 'misure':
        params = '{"ColumnProperty":[{"IsEmpty":"false","dataType":"string","headerText":"ROW_ID","key":"ROW_ID","locked":"true",' +
          '"hide":"true","place":"1"},{"IsEmpty":"false","dataType":"string","headerText":"Measure","key":"Measure","locked":"true",' +
          '"place":"2"},{"IsEmpty":"false","dataType":"string","headerText":"CODE","hide":"false","key":"CODE","locked":"true",' +
          '"place":"2"}],"DataTable":[{"ROW_ID":0,"Measure":"MobileTech","CODE":"act_coverage_mobile_tech","TYPE":"2",' +
          '"DESCRIPTION":null},{"ROW_ID":1,"Measure":"RSRP scell1","CODE":"act_coverage_rsrp_scell1","TYPE":"1","DESCRIPTION":' +
          '"Reference Signals Received Power in dBM: -140..0"},{"ROW_ID":2,"Measure":"RSRQ scell1","CODE":"act_coverage_rsrq_scell1",' +
          '"TYPE":"1","DESCRIPTION":"Reference Signal Received Quality in dB: -140..0"}],"GridProperty":[{"GridName":"Measures",' +
          '"IsFilterDisplayed":"N","ItemsPerPage":51,"ShowColumnSelector":"true","pageable":false,"reportType":"Rep","rowCount":4}]}';
        nome = '';
        modalita = -1;
        this.paginazione = 'virtual';
        this.permetteDragDrop = true;
        break;
      case 'antenne':
        params = {
          cntx_id: this.sessioneID,
          v_antenna_set_name          :           "TIM",
          v_band          :           "<ALL>",
          v_bbox          :           "BOX(12.187987546484377,41.6034384236024,12.630187253515626,42.0404296056694)",
          v_bsic          :           null,
          v_ch          :           null,
          v_code          :           null,
          v_free_text_filter          :           "",
          v_net_tech          :           "<ALL>",
          v_pci          :           null,
          v_row_limit          :           60,
          v_row_offset          :           0,
          v_scr          :           null,
          v_territory          :           null,
          v_tms_end          :           "2024-04-02 10:00:27",
          v_tms_start          :           "2024-04-01 10:00:27",
          v_view_mode          :           "net_tech_trend"
        }
        nome = 'antenna__grid2';
        modalita = 3;
        this.paginazione = 'virtual';
        this.permetteDragDrop = true;
        break;
      case 'area':
        params = {
          cntx_id:  this.sessioneID,
          v_act_set_name_list: '[ACT SET] PA-MESSINA',
          v_bbox: 'BOX(13.65687352158398,37.79694044323368,14.021590016416017,38.16314272114147)',
          v_geo_sla_name: 'Template',
          v_measr_code_list: 'ALL',
          v_tms_max: '2021-04-23 18:20:42',
          v_tms_min: '2021-04-23 17:50:01'
        };
        nome = 'geo_area_info__grid';
        modalita = 3;
        this.raggruppabile = true;
        this.righeAutomatiche = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        break;
      case 'cell_measure':
        params = {
          cntx_id: this.sessioneID,
          v_caller_tag: "F6;P23;Fri Mar 20 2026 09:12:46 GMT+0100 (Ora standard dell’Europa centrale)",
          v_filter_act_set_id_list: "[ACT SET] Demo IA prima vs dopo",
          v_filter_measr_code_1: "'struct_tc_status'",
          v_filter_measr_code_2: "'struct_tc_name'",
          v_filter_measr_value_1: "'data dl'",
          v_filter_measr_value_2: "'4G HTTP DL'",
          v_tms_max: "2025-07-25 12:44:33.000",
          v_tms_min: "2025-06-06 11:46:01.000",
        };
        nome = 'geo_cell_measr__grid';
        modalita = 3;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        break;
      case 'msn_def':
        params = {
          cntx_id: this.sessioneID,
          v_filter_folder: '',
        };
        nome = 'geo_measure_dfn__grid';
        modalita = 3;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.raggruppabile = true;
        this.selezioneMultipla = false;
        break;
      case 'ts_info__grid':
        params = {
          cntx_id: this.sessioneID,
          v_ts_code: 'SDTU00212.01_20210302_113136'
        };
        nome = 'ts_info__grid';
        modalita = 3;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        break;
      case 'act_grid':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: '[AGN GROUP] TIM',
          v_bbox: '(ALL)',
          v_tms_min: '2021-04-15 00:00:00',
          v_tms_max: '2021-04-22 20:00:00'
        };
        nome = 'geo_act__grid2';
        modalita = 3;
        this.selezioneMultipla = true;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = true;
        break;
      case 'agn_info__grid':
        nome = 'agn_info__grid';
        params = {
          cntx_id: this.sessioneID,
          v_agn_id: 250340
        };
        modalita = 3;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.raggruppabile = true;
        break;
      case 'symbolic':
        params = {
          cntx_id: this.sessioneID,
        };
        nome = 'symbolic__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = true;
        break;
      case 'operator':
        params = {
          cntx_id: this.sessioneID,
          v_group_name: ''
        };
        nome = 'operator__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = true;
        break;
      case 'pointinfo':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[AGN] SDTU000295.01",
          v_geo_sla_name: "Template",
          v_tms: "2022-07-12 06:54:32"
        }
        nome = 'geo_point_info__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        this.raggruppabile = true;
        break;
      case 'areainfo':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: '[ACT SET] coerenza traccia vs coverage',
          v_bbox: 'BOX(11.300193527435017,44.62666822180225,12.546336872564988,44.85083975229455)',
          v_geo_sla_name: 'Template',
          v_measr_code_list: 'ALL',
          v_tms_max: '2021-09-11 15:48:43',
          v_tms_min: '2021-09-11 14:53:32'
        }
        nome = 'geo_area_info__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'virtual';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'activities':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[AGN] SDTU00179.01",
          v_bbox: "(ALL)",
          v_tms_max: "2021-10-08 00:00:00",
          v_tms_min: "2021-09-09 00:00:00"
        }
        nome = 'geo_act__grid2';
        modalita = 3;
        this.selezioneMultipla = true;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'agn_prof_info':
        params = {
          cntx_id: this.sessioneID,
          v_agn_prof_id: 6
        }
        nome = 'agn_prof_info__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'user_profile':
        params = {
          cntx_id: this.sessioneID
        }
        nome = 'operator_profile__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'area_info':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: '[AGN] SDTU00179.01',
          v_measr_code_list: 'ALL',
          v_tms_min: '2021-05-01 00:00:00',
          v_tms_max: '2021-11-30 00:00:00',
          v_geo_sla_name: 'Template',
          v_bbox: '(NONE)'
        }
        nome = 'geo_area_info__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'dbojects':
        params = {
          cntx_id: this.sessioneID,
          v_view_mode: 'cmp_geo_measure_dfn'
        }
        nome = 'db_obj__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'etl_monitor':
        params = {
          cntx_id: this.sessioneID,
          v_agn_group_id: 23,
          v_tms_max: "2022-12-24 12:07:08",
          v_tms_min: "2021-11-23 12:07:08"
        }
        nome = 'etl_monitor__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'agn_group':
        params = {
          cntx_id: this.sessioneID,
          v_agn_code_filter: "",
          v_filter_folder: ""
        }
        nome = 'agn_group__grid';
        modalita = 3;
        this.raggruppabile = true;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        this.autoResize = false;
        break;
      case 'tcrunmongrid':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[AGN GROUP] ericsson",
          v_bbox: "(ALL)",
          v_tms_max: "2025-07-14 05:58:37.481",
          v_tms_min: "2025-06-14 05:58:37.481"
        }
        nome = 'geo_tc_run__mon_grid';
        modalita = 4;
        this.selezioneMultipla = true;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        this.raggruppabile = true;
        this.autoResize = true;
        break;
      case 'geo_measure_dfn__grid':
        params = {
          cntx_id: this.sessioneID,
          v_filter_folder: 'TcRunEvent'
        }
        nome = 'geo_measure_dfn__grid';
        modalita = 3;
        this.misureAddizionaliTCRUN = ['', 'Event:CDR_VOICE>{cst,_TAG_}', '', 'Event:CDR_DATA>{http_ul_throughput,_TAG_}', ''];
        this.gestisceComboTramiteCookie = true;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        this.autoResize = true;
        break;
      case 'tcrungrid':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[ACT ID] 3894661",
          v_additional_event_measure: "",
          v_bbox: null,
          v_cluster_set_name: null,
          v_result: null,
          v_tc_name: null,
          v_tms_max: "2024-05-20 11:19:29.107",
          v_tms_min: "2024-05-15 11:19:29.107",
          v_ts_name: null
        }
        nome = 'geo_tc_run__grid';
        modalita = 3;
        this.selezioneMultipla = true;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        this.autoResize = false;
        break;
        params = {
          cntx_id: this.sessioneID,
          v_filter_folder: ""
        }
        nome = 'agn_group__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'geo_tc_run_outcome__grid':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[AGN] RTUPC03071.01",
          v_tc_run_id: 679534625,
          v_tms: "2024-06-11 23:55:00.000"
        }
        nome = 'geo_tc_run_outcome__grid';
        modalita = 3;
        this.selezioneMultipla = true;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        this.autoResize = false;
        break;
      case 'ts_sched__grid':
      params = {
        cntx_id: this.sessioneID,
        v_agn_group_id: 23,
        v_ts_type: "Remote"
      }
      nome = 'ts_sched__grid';
      modalita = 3;
      this.selezioneMultipla = false;
      this.paginazione = 'scrollable';
      this.permetteDragDrop = false;
      this.righeAutomatiche = false;
      break;
      case 'plmn__grid':
        params = {
          cntx_id: this.sessioneID
        }
        nome = 'plmn__grid';
        modalita = 3;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'empty grid':
        params = undefined;
        nome = 'empty grid';
        modalita = 5
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'geo_tc_run__mon_grid':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[AGN GROUP] TIM.Beacon",
          v_bbox: "(ALL)",
          v_tms_max: inizioTms2,
          v_tms_min: fineTms2
        }
        nome = 'geo_tc_run__mon_grid';
        modalita = 4;
        this.selezioneMultipla = false;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        this.raggruppabile = true;
        this.autoResize = false;
        break;
      case 'geo_act__grid2':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[AGN] SDTU01013.01",
          v_bbox: "(ALL)",
          v_tms_max: "2021-12-10 00:00:00",
          v_tms_min: "2021-11-11 00:00:00"
        }
        nome = 'geo_act__grid2';
        modalita = 3;
        this.selezioneMultipla = true;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
      case 'summary':
        params = {
          cntx_id: this.sessioneID,
          v_act_set_name_list: "[ACT] 20220927_124433_SDTU000298.01. RM Percorso FW_4G_Benchmarking FW_TIM", // [ACT SET] FW RM 4G Dinamico
          v_bbox: "(ALL)",
          v_event_type_list: "ALL",
          v_tms_max: "2023-09-30 10:34:03.000",
          v_tms_min: "2022-09-27 12:45:00.000"
        }
        nome = 'geo_act_set_summary__grid'
        modalita = 3;
        this.selezioneMultipla = true;
        this.paginazione = 'scrollable';
        this.permetteDragDrop = false;
        this.righeAutomatiche = false;
        break;
    }

    // rpc/antsgeo_get_event_crosstab

    // console.log(params);
    if (tipo === 'misure') {
      // console.log(params);
      this.datiDiProvaGrid = JSON.parse(params);
      const tm = setTimeout(() => {
        clearTimeout(tm)
        this.effettuaAutoResize = !this.effettuaAutoResize;
      }, 1000);
    } else {
      if (modalita === 5) {
        this.datiDiProvaGrid = 'empty grid';
        return;
      }
      this.apiService.chiamataPost('rpc/' + nome, params, rfiClone)
      // .map(response => response)
      .subscribe(data2 => {
          if (data2) {
            // const data2 = JSON.parse(data);
            // const data = JSON.parse(data2[0]); // [0].geo_act_set__grid);
          // console.log(JSON.parse(data2));
          if (modalita === 1) {
            console.log('Activity Griglia', data2);
            const data = this.elaboraEvents(data2, this.datePipe);
            this.datiDiProvaGrid = data;
          }

          if (modalita === 2) {
            // this.appoggioDati = JSON.parse(data2);
            console.log(data2);
            this.datiDiProvaGrid = data2[0].summary;
            // this.datiDiProvaGrid = data2[1].cdr;
            console.log(this.datiDiProvaGrid);
            const tm = setTimeout(() => {
              clearTimeout(tm)
              this.effettuaAutoResize = !this.effettuaAutoResize;
            }, 1000);
          }

          if (modalita === 3) {
            // this.appoggioDati = JSON.parse(data2);
            console.log(data2);
            this.datiDiProvaGrid = data2;
            const tm = setTimeout(() => {
              clearTimeout(tm)
              // this.numeroPaginaImpostata = 1;
              this.effettuaAutoResize = !this.effettuaAutoResize;
            }, 1000);
          }

          if (modalita === 4) {
            // this.appoggioDati = JSON.parse(data2);
            console.log(data2[1].trend);
            this.datiDiProvaGrid = data2[1].trend;
            const tm = setTimeout(() => {
              clearTimeout(tm)
              this.numeroPaginaImpostata = 1;
              this.effettuaAutoResize = !this.effettuaAutoResize;
            }, 1000);
          }

          if (modalita === 6) {
            // this.appoggioDati = JSON.parse(data2);
            const data3 = data2;
            data3.ColumnProperty = data2.v_column_property;
            data3.GridProperty = data2.v_grid_property;

            console.log('Ritorno: ', data2, data3);
            this.datiDiProvaGrid = data3;
            const tm = setTimeout(() => {
              clearTimeout(tm)
              this.numeroPaginaImpostata = 1;
              this.effettuaAutoResize = !this.effettuaAutoResize;
            }, 1000);
          }
          // console.log(data);

          /* this.datiDiProvaGrid.DataTable.forEach(element => {
            let valore = element['NAME'];
            if (valore.indexOf('***') > - 1) {
              valore = valore.substring(0, valore + 3) + 'max-width: 20px, ' + valore.substring(valore + 4, valore.length);
            }
            element['DISPLAY_NAME'] = valore;
          }); */
          // let riga = this.datiDiProvaGrid.DataTable[5].ACT_CODE;
          // riga = '***width: 20px***' + riga;
          // this.datiDiProvaGrid.DataTable[5].ACT_CODE = riga;

          // console.log(riga);
          /* const subscribe = Observable.timer(0, 10000)
            .take(1)
            .subscribe(() => {
              this.cambiaValori();
            });
            */
           this.contaMax();
        } else {
          // alert('Effettua test: ' + data2);
          this.datiDiProvaGrid = 'empty grid';
        }
      }, error => {
        alert(error);
      });
    }
  }

  contaMax() {
    this.max = 0;
    if (this.datiDiProvaGrid && this.datiDiProvaGrid.DataTable) {
      this.datiDiProvaGrid.DataTable.forEach(element => {
        if (element.ROW_ID > this.max) {
          this.max = element.ROW_ID;
        }
      });
      console.log('Massimo id:', this.max);
    }
  }

  cambiaValori() {
    console.log('Annullo');
    this.datiDiProvaGrid = 'empty grid';
    // this.rinfrescaGriglia = true;
  }

  refreshGrid1(e) {
    console.log('Refresho');
    
    const d = JSON.parse(JSON.stringify(this.datiDiProvaGrid.DataTable));
    this.datiDiProvaGrid.DataTable = null;
    setTimeout(() => {
      this.datiDiProvaGrid.DataTabe = d;
    }, 100);
    return;
    
    // this.datiDiProvaGrid = undefined;
    this.EffettuaTestGriglia();
    
    // this.pulisceSel = 'OK';
    // this.datiDiProvaGrid = this.appoggioDati;

    this.rinfrescaGriglia = true;
  }

  lastSelectedOfTree(e) {
    // alert(e);
  }

  lastSelectedOfGrid(e) {
    // alert(e);
    console.log('Ultima riga selezionata: ', e);
  }

  premutoTastoNew(e) {
    console.log('Tasto New. Riga: ', e);
  }

  premutoTastoEdit(e) {
    console.log('Tasto Edit. Riga: ', e);
  }

  premutoTastoEditN(e) {
    console.log('Tasto Edit Nuovo. Riga: ', e);
  }

  premutoTastoDelete(e) {
    console.log('Tasto Delete. Riga: ', e);
  }

  premutoTastoDelete2(e) {
    console.log('Tasto Delete2. Riga: ', e);
  }

  premutoTastoAdd(e) {
    console.log('Tasto Add. Riga: ', e);
  }

  premutoTastoRmove(e) {
    console.log('Tasto Remove. Riga: ', e);
  }

  premutoTastoConfirm(e) {
    console.log('Tasto confirm: ', e);
  }

  fattoClickSuCheck1(e) {
    console.log('Click su check:', e);
  }

  fattoClickSuCheck2(e) {
    console.log('Deselezionato:', e);
  }

  copyKeyPremuto(e) {
    console.log('Copy key premuto:', e);
  }

  fineDragDrop(e) {
    console.log('Fine drag drop:', e);
  }

  effettuaAutoResizeTasto() {
    this.effettuaAutoResize = !this.effettuaAutoResize;
  }

  righeTotali = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  elaboraEvents(j, datePipe) {
    const t = this;
    const menoUno = true;
    let j1 = null;

    if (j[2] !== null && j[2] !== undefined && j[2] !== 'undefined' && j[2] !== '' && j[2].length > 1
        && j[2].toUpperCase().indexOf('ERROR:') === - 1) {
      j1 = JSON.parse(j[2]);
      if (j1 && j1.DataTable) {
        j1 = j1.DataTable;
      } else {
        // console.log('DataTable mancante', j1);
      }
      // console.log('Punto 2', j1);
    }
    let tot = '';
    let c = 1;
    const campi = new Array();
    let ok = false;

    if (j1 && j1 !== null) {
      j1.forEach(element => {
        const tms = element.tms;
        const tms2 = datePipe.transform(tms, 'yyyy-MM-dd HH:mm:ss.SSS');
        element.tms = tms2;

        let p = JSON.stringify(element);
        // p = p.replace('{', '');
        // p = p.replace('}', '');
        p = p.substring(1, p.length);
        p = p.substring(0, p.length - 1);

        p = p.replace('bck_color', 'BackColor');
        p = p.replace('fore_color', 'ForeColor');
        p = p.replace('tms_delta', 'delta');

        if (!ok) {
          const cc = p.split(',"');
          cc.forEach(element2 => {
            const ccc = element2.split(':');
            const campo = ccc[0].replace('"', '').replace('"', '');
            campi.push(campo);
          });
          ok = true;
        }
        p = '{"ROW_ID": ' + c + ', ' + p + '}';
        c++;
        tot += p + ',';
      });
    }
    if (tot.length > 1) {
      tot = tot.substring(0, tot.length - 1);
      tot = '[' + tot + ']';

      // console.log(JSON.parse(tot));
      let col = '';
      c = 0;
      campi.forEach(element => {
        let nome = element;
        while (nome.indexOf('_') > -1) {
          nome = nome.replace('_', ' ');
        }
        col += '{';
        col += '"IsEmpty": "false",';
        if (nome === 'delta') {
          col += '"dataType": "numeric",';
        } else {
          col += '"dataType": "string",';
        }
        col += '"headerText": "' + nome + '",';
        switch (element) {
          case 'BackColor':
          case 'ForeColor':
          case 'file_hist_id':
          case 'event_row_id':
          case 'icon':
          case 'tck_description':
          case 'info':
          case 'status':
          case 'act_id':
          case 'ROW ID':
          case 'ROW_ID':
            col += '"hide": "true",';
            break;
          default:
            col += '"hide": "false",';
        }
        col += '"key": "' + element + '",';
        col += '"locked": "true",';
        col += '"place": "' + c + '"';
        col += '},';
        c++;
      });

      if (col.length > 0) {
        col = col.substring(0, col.length - 1);
        col = '[' + col + ']';

        // console.log(col);
        for (let index = 0; index <= 9; index++) {
          if (t.columnsSettings2 && t.columnsSettings2 !== null) {
            const element = t.columnsSettings2[index];
            // console.log(element);
            while (col.indexOf('value str 0' + (index + 1)) > - 1) {
              col = col.replace('value str 0' + (index + 1), element);
            }
          }
        }
        // console.log(col);

        // console.log(col);
        // let itemsPerPagina = localStorage.getItem(t.userName + '_' + '_ipp_Events');
        // console.log('Ipp', itemsPerPagina);
        // if (itemsPerPagina === null) {
          // itemsPerPagina = '25';
          // localStorage.setItem(t.userName + '_' + '_ipp_Events', itemsPerPagina);
        // }
        const itemsPerPagina = 100;
        const colonne = JSON.parse(col);
        let proprieta;

        const dati = JSON.parse(tot);
        const carattereDaModificare = ' ';
        dati.forEach(element => {
          if (!menoUno && element && element.delta && element.delta !== null) {
            const delta = element.delta.toString();
            if (delta.indexOf('.') > - 1) {
              let decim = delta.substring(delta.indexOf('.') + 1, delta.length);
              const intero = delta.replace(decim, '');
              if (decim.length > 3) {
                decim = decim.substring(0, 3);
              } else {

              }
              element.delta = intero + decim;
            }
            // console.log(element.delta);
            if (element.act_id === null) { element.act_id = carattereDaModificare; }
            if (element.destination === null) { element.destination = carattereDaModificare; }
            if (element.event_row_id === null) { element.event_row_id = carattereDaModificare; }
            if (element.event_type === null) { element.event_type = carattereDaModificare; }
            if (element.file_hist_id === null) { element.file_hist_id = carattereDaModificare; }
            if (element.info === null) { element.info = carattereDaModificare; }
            if (element.net_tech === null) { element.net_tech = carattereDaModificare; }
            if (element.net_tech === null) { element.net_tech = carattereDaModificare; }
            if (element.protocol === null) { element.protocol = carattereDaModificare; }
            if (element.source === null) { element.source = carattereDaModificare; }
            if (element.sub_chan === null) { element.sub_chan = carattereDaModificare; }
            if (element.tms === null) { element.tms = carattereDaModificare; }
            if (element.value_str_01 === null) { element.value_str_01 = carattereDaModificare; }
            if (element.value_str_02 === null) { element.value_str_02 = carattereDaModificare; }
            if (element.value_str_03 === null) { element.value_str_03 = carattereDaModificare; }
            if (element.value_str_04 === null) { element.value_str_04 = carattereDaModificare; }
            if (element.value_str_05 === null) { element.value_str_05 = carattereDaModificare; }
            if (element.value_str_06 === null) { element.value_str_06 = carattereDaModificare; }
            if (element.value_str_07 === null) { element.value_str_07 = carattereDaModificare; }
            if (element.value_str_08 === null) { element.value_str_08 = carattereDaModificare; }
            if (element.value_str_09 === null) { element.value_str_09 = carattereDaModificare; }
            if (element.value_str_10 === null) { element.value_str_10 = carattereDaModificare; }
          } else {
            // console.log('Element:', element);
            if (element.event_row_id && element.event_row_id !== null) {
              if (proprieta[0]) {
                proprieta[0].rowCount = element.event_row_id;
                this.righeTotali[0] = element.event_row_id;
              }
            }
          }
        });

        if (menoUno) {
          proprieta = [{
            GridName: 'Activity Events',
            IsFilterDisplayed: 'N',
            ItemsPerPage: itemsPerPagina,
            ShowColumnSelector: 'true',
            pageable: true,
            reportType: 'Rep',
            rowCount: -1
          }];
        } else {
          proprieta = [{
            GridName: 'Activity Events',
            IsFilterDisplayed: 'N',
            ItemsPerPage: itemsPerPagina,
            ShowColumnSelector: 'true',
            pageable: true,
            reportType: 'Rep',
            rowCount: this.righeTotali[0]
          }];
          // console.log('Righe totali eventi', this.righeTotali);
        }

        /* if (!menoUno) {
          for (let i = dati.length; i <= this.righeTotali; i++) {
            const e = { ROW_ID: i };
            dati.push(e);
          }
          console.log('Dati events:', dati);
        } */
        const strutt = {
          ColumnProperty: colonne,
          DataTable: dati,
          GridProperty: proprieta
        };

        // const tm = setTimeout(() => {
          // if (t.offsetAe > 0) {
          // console.log('Autofitto');
          // t.effettuaAutoFitAE = !t.effettuaAutoFitAE;
        // }

        const q = dati.length; // this.datiPointActivityEvents.length;
        // console.log(q, t.quantiEventsVecchi);
        let p;
        // if (+q !== +t.quantiEventsVecchi) {
          // console.log('Cambio pagina');
          // t.quantiEventsVecchi = q;
          // p = 0;
        // } else {
        p = Math.round((100 - 1) / 100);
        if (p < 0) { p = 0; }
        // if (p === -1) { p = 0; };
        // if (p === -0) { p = 0; };
        // }

        // t.paginaEvents = p;
          //   t.paginaEvents = p;
          // } else {
          //   console.log('***PAGINA <= -1***');
          // }
          // console.log('Imposto pagina events:', t.paginaEvents);
        // }, 1000);
        return strutt;
      } else {
        return 'empty grid';
      }
    } else {
      return 'empty grid';
    }
  }

  cambioPagina(e) {
    // alert('Cambio pagina');
    // this.datiDiProvaGrid = 'empty grid';
    if (e.pagina) {
      this.numeroPaginaImpostata = e.pagina;
    }
    
    // console.log('Cambio pagina fuori', e);
  }

  impostaPagina() {
    // this.numeroPaginaImpostata++;
    const t2 = (new Date(this.secondoInizio.replace('T', ' ').replace('Z', ' ') + ' UTC+00').getTime() + 1999);
    const fineTms = this.datePipe.transform(t2, 'yyyy-MM-dd HH:mm:ss', 'UTC');
    this.secondoInizio = fineTms;
    
    this.EffettuaTestGriglia();
  }

  cambioDelta(e) {
    console.log(e);
  }

  premutoMenu(e) {
    console.log(e);
  }

  premutoSync(e) {
    console.log('Premuto Sync');
  }

  cambiaNomiColonne() {
    this.nomiColonne = [ 'prima', 'seconda', 'terza', 'quarta' ];
  }

  cambioFiltroEventi(e) {
    console.log(e);
    this.filtroEventi = e;
    this.EffettuaTestGriglia();
  }

  dimensioniGriglia(e) {

  }

  premutoExcelEventi(e) {
    console.log('Premuto excel eventi');
  }

  rinfrescaDati() {
    // this.datiDiProvaGrid.DataTable[0].Measure = 'ppp';
    // this.datiDiProvaGrid.DataTable[1].Measure = 'qqq';
    // this.datiDiProvaGrid.DataTable = JSON.parse(JSON.stringify(this.datiDiProvaGrid.DataTable));
    // console.log(this.datiDiProvaGrid.DataTable);

    // this.datiDiProvaGrid = undefined;
    // this.EffettuaTestGriglia();
    const dt = this.datiDiProvaGrid.DataTable;
    dt[0].tms = 'W Pippo';
    this.datiDiProvaGrid.DataTable = JSON.parse(JSON.stringify(dt));
  }

  numeroRighePagina(e) {
    // console.log('Numero righe pagina', e);
  }

  accendiSpegniTasti() {
    this.tastoConfermaVisibile = !this.tastoConfermaVisibile;
    this.tastoNewVisibile = !this.tastoNewVisibile;
    this.tastoEditVisibile = !this.tastoEditVisibile;
    this.tastoDeleteVisibile = !this.tastoDeleteVisibile;
  }

  selezionaRiga() {
    const numero = Math.floor(Math.random() * (this.max - 0 + 1)) + 0;
    this.selezione = [numero];
  }

  premutoSuIcona(e) {
    console.log(e);
  }

  scriveStoPSG(e) {
    console.log(e);
  }

  scriveAddToActSet(e) {
    console.log(e);
  }

  scriveDownloadTD(e) {
    console.log(e);
  }

  runPremuto(e) {
    console.log(e);
  }

  premutoWorkSpace(e) {
    console.log(e);
  }

  processKeyPremuto(e) {
    console.log(e);
  }

  fBackToSelectedKey(e) {
    console.log(e);
  }

  rePlayKeyPressed(e) {
    console.log(e);
  }

  clickSuGrafico(e) {
    console.log(e);
  }

  editTicketPressed(e) {
    console.log(e);
  }

  fPulisceGriglia() { this.datiDiProvaGrid = 'empty grid'; }

  mandaWarning() {
    this.warning = 'W le first 500 rows returned';
  }

  premutoTastoDeleteTcRun(e) {
    console.log(e);
  }

  includeClick(e) {
    console.log('Include', e);
  }

  excludeClick(e) {
    console.log('Exclude', e);
  }

  selectedAllRows(e) {
    console.log('Selezionate tutte le righe: ', e);
  }

  clickSuComboMisura(e) {
    console.log('Click su combo misura in app', e);
  }

  aperturaTcRun() {
    console.log('Click su tcrun info');
  }

  arrivataListaEventiSE(e) {
    console.log('Arrivata lista eventi', e);
  }

  datiPerPausa;
  autoRunAttivo = false;
  timeMode = 'SELECTED';

  fImpostaAutorun() {
    this.datiPerPausa = {
      autoRunAttivo: !this.autoRunAttivo,
      timeMode: this.timeMode
    }
    this.autoRunAttivo = !this.autoRunAttivo;
  }

  fImpostaSelected() {
    if (this.timeMode === 'ALL') {
      this.timeMode = 'SELECTED';
    } else {
      this.timeMode = 'ALL';
    }
    this.datiPerPausa = {
      autoRunAttivo: this.autoRunAttivo,
      timeMode: this.timeMode
    }
  }

  fPausaAutorun(e) {
    console.log('Arrivata pausa autorun', e);
  }

  scroll;

  scrollaAllaRiga() {
    const random = Math.floor(Math.random() * 50);
    console.log('Vai alla riga', random);
    this.scroll = random;
  }

  misureCombo;

  impostaMisureCombo() {   
    const n = new Array();
    n.push({
      DISPLAY_NAME: "TcRun cqi_0 avg",
      MEASR_CODE: "Event:CDR_DATA>{cqi_0,_TAG_}",
      VALORE: 1
    });
    n.push({
      DISPLAY_NAME: "TcRun cqi_1 avg",
      MEASR_CODE: "Event:CDR_DATA>{cqi_1,_TAG_}",
      VALORE: 3
    });
    this.misureCombo = n;
  }

  refreshTcRun() {
    console.log('Refresh tcrun');
  }

  pasteEmit(e) {
    console.log('pasteEmit', e);
  }

  fGetTcRunFiles(e) {
    console.log('Get Tc Run Files', e);
  }

  ritornoQueryAI(e) {
    console.log('Ritorno query AI: ', e);
  }

  distruggeTutto() {
    this.datiDiProvaGrid = 'empty grid';
  }

  ritornoDimensioniColonne(e) {
    console.log('Ritorno dimensioni colonne', e);
  }

  ritornoTastoAiTutte(e) {
    const ee = e.CSV.split('\n');
    console.log('Dati per ai', e, ee[0], ee[1], ee[2]);
  }

  clickSuMistralFilters() {
    console.log('Click su mistral filters');
  }

  groupClickEmit(e) {
    console.log('Group click', e);
  }
}

import { logConsole } from '../../console-log';
import { OnInit, AfterViewInit, OnChanges, Component, Output, EventEmitter, Input, ViewChildren, Inject, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
// import Utils from '../../Utilities.component';
import ExternalUtilities from '../ExternalUtilities.component';
import { ApiService } from '../../services/api.service';
import { Utils } from '../../Utilities.component';

@Component({
  templateUrl: 'activityEdit.component.html',
  selector: 'activity-edit-component',
  styleUrls: ['./activityEdit.component.css']
})

export class ActivityEditComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChildren('inputNome') vc;

  @Input() Debug;
  @Input() sessioneID;
  @Input() visibile: boolean;
  @Input() userName: string;
  @Input() dati;
  @Input() activityGroup;
  @Input() nuovo: boolean;
  @Input() Utils;
  @Input() folderSelezionata;
  @Input() indirizzoServer;
  
  @Output() visibileEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshData: EventEmitter<boolean> = new EventEmitter<boolean>();

  // mascheraVisibile = false;
  selFolder = '';
  sessioneID2;
  activityGroup2;
  pulisceFiltroAct;
  edge;
  userGroupDati;
  UserGroup;
  pulisceFiltroUG;

  Folder;
  Name;
  Group;
  Operator;
  Insert_Timestamp
  ID;
  Description;
  original_name;
  datiArrivati;

  ngOnDestroy(): void {
    if (this.vc && this.vc.nativeElement) {
      this.vc.nativeElement.remove();  
    }
  }

  constructor(
    private apiService: ApiService,
    private Utilities: Utils
  ) {
  }

  leggeUserGroups() {
    const nomeTabella = 'operator_group__grid';
    const params = {
      cntx_id: this.sessioneID2
    };
    // alert(this.indirizzoServer);
    this.apiService.chiamataPost(this.indirizzoServer, nomeTabella, params)
    // .map(response => response)
    .subscribe(data => {
      if (data && data !== null) {
        this.userGroupDati = data.DataTable;
        if (this.datiArrivati) {
          this.userGroupDati.forEach(element => {
            if (element.NAME === this.datiArrivati.GROUP_NAME) {
              this.UserGroup = element.GROUP_ID;
            }
          });
          // logConsole('DATI USER GROUPS', this.userGroupDati, this.datiArrivati, this.UserGroup);
        }
      }
    });
  }

  ngOnChanges(c) {
    // logConsole('Activity edit onChange', c);

    /* if (c.visibile) {
      this.mascheraVisibile = c.visibile.currentValue;
      if (this.mascheraVisibile) {
        // logConsole('Leggo activity');
        this.pulisceFiltroAct = !this.pulisceFiltroAct;

        const tm = setTimeout(() => {
          // logConsole(this.vc);
          if (this.vc && this.vc.first) {
            this.vc.first.nativeElement.focus();
          }
        }, 1000);
      }
      // return;
    } */

    if (c.sessioneID && c.sessioneID.currentValue) {
      this.sessioneID2 = c.sessioneID.currentValue;
      this.leggeUserGroups();
    }

    if (c.nuovo) {
      if (c.nuovo.currentValue) {
        // logConsole('Nuova activity: ', c.nuovo.currentValue);
        // this.Folder = '';
        this.Name = '';
        this.Group = '';
        this.Operator = '';
        this.Insert_Timestamp = '';
        this.ID = '';
        this.Description = '';
        this.original_name = '';
        this.UserGroup = -1;
      }
    }

    if (c.dati && c.dati.currentValue) {
      // logConsole('Activity onChange', c.dati.currentValue);
      this.Folder = c.dati.currentValue.FOLDER;
      this.Name = c.dati.currentValue.NAME.replace('[ACT SET] ', '');
      this.Group = c.dati.currentValue.GROUP;
      this.Operator = c.dati.currentValue.OPERATOR;
      this.Insert_Timestamp = c.dati.currentValue.INSERT_TIMESTAMP;
      this.ID = c.dati.currentValue.ID;
      this.Description = c.dati.currentValue.DESCRIPTION;
      this.original_name = this.Name;
      // this.UserGroup = c.dati.currentValue.GROUP_NAME;
      this.datiArrivati = c.dati.currentValue;

      if (this.userGroupDati) {
        this.userGroupDati.forEach(element => {
          if (element.NAME === this.datiArrivati.GROUP_NAME) {
            this.UserGroup = element.GROUP_ID;
          }
        });
        // logConsole('DATI USER GROUPS', this.userGroupDati, this.datiArrivati, this.UserGroup);
      }

      // logConsole('Arrivati dati', c.dati.currentValue, this.UserGroup);
    }

    if (c.activityGroup) {
      // logConsole(c.activityGroup.currentValue);
      if (c.activityGroup.currentValue) {
        const ag = new Array();
        c.activityGroup.currentValue.forEach(element => {
          if (element && element !== null && element.VALUE_STR !== null) {
            if (element.VALUE_STR.indexOf('[') === -1 && element.VALUE_STR.indexOf(']') === -1 &&
                element.VALUE_STR.indexOf('<') === -1 && element.VALUE_STR.indexOf('>') === -1) {
              ag.push(element);
            }
          }
        });
        this.activityGroup2 = ag;
      }
    }

    if (c.folderSelezionata) {
      if (c.folderSelezionata.currentValue) {
        this.Folder = c.folderSelezionata.currentValue.VALUE_STR;
        // logConsole('Folder selezionata', this.Folder);
      }
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // ExternalUtilities.visualizzaAlert('Entrato');
    const tm = setTimeout(() => {
      clearTimeout(tm);
      // logConsole(this.vc);
      if (this.vc && this.vc.first) {
        this.vc.first.nativeElement.focus();
      }
    }, 1000);
  }

  mostraNascondeMenu() {
    this.visibileEmit.emit(false);
    // logConsole('Chiudo maschera activity');
    // this.mascheraVisibile = false;
  }

  selectFolder(e) {
    if (e) {
      const ee = ExternalUtilities.converteStringaInJSON(e);
      if (ee.VALUE_STR) {
        this.Folder = ee.VALUE_STR;
      } else {
        let ok = false;
        let row = 0;
        this.activityGroup2.forEach(element => {
          if (element.VALUE_STR === ee) {
            ok = true;
          }
          if (element.ROW_ID > row) {
            row = element.ROW_ID;
          }
        });
        if (!ok) {
          const app = JSON.parse(JSON.stringify(this.activityGroup2));
          app.push({ ROW_ID: row + 1, VALUE_STR: ee, CATEGORY: 'New Category' });
          this.activityGroup2 = app;

          const tm = setTimeout(() => {
            clearTimeout(tm);
            
            logConsole('Activity set folder', e, ee, this.activityGroup2);
            this.Folder = ee;
          }, 100);
        }
      }
    }
  }

  selectUserGroup(e) {
    if (e) {
      const tm = setTimeout(() => {
        clearTimeout(tm);
        
        const ee = ExternalUtilities.converteStringaInJSON(e);
        // logConsole('Activity set folder', ee);
        if (ee.GROUP_ID) {
          this.UserGroup = ee.GROUP_ID;
        } else {
          let ok = false;
          let row = 0;
          let group = 0;
          this.userGroupDati.forEach(element => {
            if (element.NAME === ee) {
              ok = true;
            }
            if (element.ROW_ID > row) {
              row = element.ROW_ID;
            }
            if (element.GROUP_ID > group) {
              group = element.GROUP_ID;
            }
          });
          if (!ok) {
            const app = JSON.parse(JSON.stringify(this.userGroupDati));
            app.push({ ROW_ID: row + 1, GROUP_ID: group + 1, NAME: ee, CATEGORY: 'New User Group' });
            this.userGroupDati = app;

            const tm = setTimeout(() => {
              clearTimeout(tm);
              
              logConsole('User Gorup', e, ee, this.userGroupDati);
              this.Folder = ee;
            }, 100);
          }
        }
      }, 100);
    }
  }

  salvaDati() {
    // const dateNow: Date = new Date();
    // const update_ts = this.datePipe.transform(dateNow, 'yyyy-MM-dd HH:mm:ss');

    let desc = this.Description;
    desc = desc.replace(/(\r\n|\n|\r)/gm, '');

    let folder = this.Folder;
    if (typeof(folder) === 'undefined') { folder = 'null'; }

    /* let jsonString = '{';
    jsonString += '"beActSet": {';
    jsonString += '"GEO_ACT_SET": [';
    jsonString += '{';
    if (this.nuovo) {
      jsonString += '"ID": 1,';
    } else {
      jsonString += '"ID": ' + this.ID + ',';
    }

    // logConsole('folder risultante:', folder, this.Folder);

    let operator = this.Operator;
    if (typeof(operator) === 'undefined') { operator = 'null'; }
    let group = this.Group;
    if (typeof(group) === 'undefined') { group = 'null'; }
    let i_ts = this.Insert_Timestamp;
    if (typeof(i_ts) === 'undefined' || i_ts === '') { i_ts = update_ts; }
    let orig =this.original_name;
    if (typeof(orig) === 'undefined') { orig = 'null'; }

    jsonString += '"NAME": "' + this.Name + '",';
    jsonString += '"FOLDER": "' + folder + '",';
    jsonString += '"OPERATOR_NAME": "' + operator + '",';
    jsonString += '"GROUP_NAME": "' + group + '",';
    jsonString += '"DESCRIPTION": "' + desc + '",';
    jsonString += '"INSERT_TIMESTAMP": "' + i_ts + '",';
    jsonString += '"UPDATE_TIMESTAMP": "' + update_ts + '",';
    jsonString += '"NAME_OLD": "' + this.original_name + '"';
    jsonString += '}]}, "sessionID": "***SESSION_ID***"';
    jsonString += '}'; */

    // logConsole(jsonString);

    // logConsole('Ritorno scrittura', this.apiService.UpdateDashboard(jsonString));
    // this.apiService.UpdateDashboard(jsonString)

    let name = this.Name;
    if (name.toUpperCase().indexOf('[ACT SET]') === -1) {
      name = '[ACT SET] ' + name;
    }
    // logConsole(name.toUpperCase());
    // return;

    let groupName = '';
    if (this.userGroupDati) {
      this.userGroupDati.forEach(element => {
        if (element.GROUP_ID === this.UserGroup) {
          groupName = element.NAME;
        }
      });
    }

    if (groupName !== '') {
      if (this.nuovo) {
        const params = '{' +
          '"v_cntx": "' + this.sessioneID2 + '",' +
          '"v_name": "' + name + '",' +
          '"v_folder": "' + folder + '",' +
          '"v_description": "' + desc + '",' +
          '"v_group_name_new": "' + groupName + '"' +
        '}';
        // logConsole(params);
        // return;

        this.apiService.chiamataPost(this.indirizzoServer, 'geo_act_set__ins', params)
        // .map(response => response)
        .subscribe(data => {
          ExternalUtilities.checkRitornoChiamata(Utils, data);

          // logConsole('Create Act Set return:', data);
          if (+data[0].v_err_code === 0) {
            this.mostraNascondeMenu();
            this.refreshData.emit(data[0].v_id);
          } else {
            ExternalUtilities.visualizzaAlert(data[0].v_err_code + ': ' + data[0].v_failure_reason);
          }
        }, error => {
          ExternalUtilities.visualizzaAlert(error);
        });
      } else {
        const params = '{' +
          '"v_cntx": "' + this.sessioneID2 + '",' +
          '"v_id": "' + this.ID + '",' +
          '"v_name": "' + name + '",' +
          '"v_folder": "' + folder + '",' +
          '"v_description": "' + desc + '",' +
          '"v_group_name_new": "' + groupName + '"' +
        '}';
        // logConsole(params);
        // return;

        this.apiService.chiamataPost(this.indirizzoServer, 'geo_act_set__upd', params)
        // .map(response => response)
        .subscribe(data => {
          ExternalUtilities.checkRitornoChiamata(Utils, data);

          // logConsole('Update Act Set return:', data);
          if (+data[0].v_err_code === 0) {
            this.mostraNascondeMenu();
            this.refreshData.emit(true);
          } else {
            ExternalUtilities.visualizzaAlert(data[0].v_err_code + ': ' + data[0].v_failure_reason);
          }
        }, error => {
          ExternalUtilities.visualizzaAlert(error);
        });
      }
    }
  }

  checkEdge(event) {
    ExternalUtilities.edge = event;
    // logConsole('edge:', event);
  }
}

import { logConsole } from '../../console-log';
import Utils from '../../Utilities.component';
import { ApiService } from './../../services/api.service';
import { SessionService } from './../../services/session.service';
import { AfterViewInit, Component, Directive, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
// import 'rxjs/add/operator/map';

@Component({
    selector: 'login-component',
    templateUrl: 'login.component.html',
    styleUrls: ['login.style.css']
})

export class LoginComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() portable = false;
  // @Input() pre;

  portable2 = false;
  public Utils = Utils;
  Username;
  Password;
  username;
  password;
  rememberme;
  requestInProgress = false;
  errMsg: String = '';
  TcRunId;
  AutoLoginKey;
  changePassword = false;
  changePswForm: FormGroup;
  messageLog = '';
  user = '';
  sessionId = '';
  passwordNascosta = true;

  public buttami: any[] = [
    936, 968, 1025, 999, 998, 1014, 1017, 1010, 1010, 1007,
    1004, 988, 990, 988, 987, 995, 946, 954, 991, 984,
    974, 956, 986, 936, 955, 1021, 1013, 1005, 958, 953,
    952, 940, 937, 980, 966, 965, 928, 916, 910, 980
  ];

  Buttami0 = [0, 1, 2, 3, 4, 5, 6, 7];
  Buttami1 = [84, 144, 144, 144, 144, 144, 144, 124];
  Buttami2 = [0, 0, 0, 0, 0, 0, 0, 7];
  Buttami3 = [28, 48, 48, 48, 48, 48, 48, 42];

  ipInfo;
  maschera = '';
  fullScreen = '';

  statoManutenzione;
  messaggioLogin;

  sessId = '';
  capslockOn = false;

  schermoPiccolo;

  constructor(
      private sessionService: SessionService,
      private apiService: ApiService,
      private router: Router,
      private fb: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private route: ActivatedRoute,
    ) {
    this.activatedRoute.queryParams.subscribe(params => {
      Utils.errMsg = '';
      if (params['err']) {
        if (params['err'] === 'cntx_invalid') {
          Utils.errMsg = 'Connection lost for inactivity or other reasons: you need to login again';
        } else {
          Utils.errMsg = params['err'];
        }
      } else {
      }
      this.errMsg = Utils.errMsg;
    });

    const err = localStorage.getItem('ERROR');
    if (err && err !== null && err !== '') {
      switch(err) {
        case 'CNTX_INVALID':
          Utils.errMsg = 'Connection lost for inactivity or other reasons: you need to login again';
          break;
      }
    }
    localStorage.setItem('ERROR', '');

    this.leggeIP();

    const t = setInterval(() => {
      if (Utils.serverPostRest) {
        clearInterval(t);

        this.LeggeSimbolici();
      }
    }, 100);

    if (window.innerWidth < 500) {
      this.schermoPiccolo = true;
    } else {
      this.schermoPiccolo = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['portable'] && changes['portable'].currentValue !== undefined)  {
      this.portable2 = changes['portable'].currentValue;
      // logConsole('Portable:', this.portable2);
      // alert(this.portable);
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    if (window.innerWidth < 500) {
      this.schermoPiccolo = true;
    } else {
      this.schermoPiccolo = false;
    }
  }

  @HostListener('window:click', ['$event']) onClick(event){
    if (event.getModifierState && event.getModifierState('CapsLock')) {
      this.capslockOn = true;
     } else {
      this.capslockOn = false;
     }
    }

   @HostListener('window:keydown', ['$event'])
   onKeyDown(event){
   if (event.getModifierState && event.getModifierState('CapsLock')) {
     this.capslockOn = true;
     } else {
      this.capslockOn = false;
     }
   }

   @HostListener('window:keyup', ['$event'])
    onKeyUp(event){
    if (event.getModifierState && event.getModifierState('CapsLock')) {
     this.capslockOn = true;
    } else {
     this.capslockOn = false;
    }
   }

  ngAfterViewInit() {
  }

  PlatForm_Name = '';

  LeggeSimbolici() {
    const params = {
      v_cntx: ''
    }
    this.apiService.chiamataPost('system_ping__grid', params)
    // .map(response => response)
    .subscribe(data2 => {
      logConsole(data2); //  and name = \'GEO_R_MAP_MAX_MEASR\'
      if (data2 && data2 !== null && !data2.error) {
        // const data2 = JSON.parse(data);
        // // logConsole(data2);
        // const data = JSON.parse(data2);

        data2.DataTable.forEach(element => {
          const name = element.NAME;
          switch (name) {
            case 'SYS_MAINTENANCE_STATUS':
              this.statoManutenzione = element.VALUE;
              break;
            case 'SYS_LOGIN_MSG':
              this.messaggioLogin = element.VALUE;
              break;
            case 'PLATFORM_NAME':
              this.PlatForm_Name = element.VALUE;
              break;
          }
        });

        // // logConsole('Stato manutenzione', this.statoManutenzione);
        // // logConsole('Messaggio Login', this.messaggioLogin);
      } else {
        // alert('Read symbolic null');
        Swal.fire({
          title: 'Login Error',
          text: data2.message,
          icon: 'error',
          showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
          },
        });          
      }
    }, error => {
      Swal.fire({
        title: 'Login Error',
        text: error,
        icon: 'error',
        showClass: {
          backdrop: 'swal2-noanimation', // disable backdrop animation
          popup: '',                     // disable popup animation
          // icon: ''                       // disable icon animation
        },
      });          
      // alert('Read symbolic: ' + error);
    });
  }

  leggeIP() {
    this.apiService.chiamataGet('https://api.ipify.org/?format=json/', '')
    // .map(response => response.json())
    .subscribe(data => {
      // logConsole(data['_body']);
      // https://ipapi.co/8.8.8.8/json/
      this.apiService.chiamataGet('https://ipapi.co/' + data['_body'] + '/json/', '')
      // .map(response => response.json())
      .subscribe(data2 => {
        const dd = JSON.parse(data2['_body']);
        // // logConsole(dd);

        this.ipInfo = {
          ip: data['_body'],
          country: dd.country_code_iso3,
          // cc: dd.country,
          city: dd.city,
          org: dd.org,
        };
        // // logConsole(this.ipInfo);
      }, error => {
        this.ipInfo = {
          ip: data['_body'],
          country: 'no country: error ' + error,
          // cc: '--',
          city: 'no city',
          org: 'no org',
        };
      });
    }, error => {
      this.ipInfo = {
        ip: 'no ip: error ' + error,
        country: 'no country',
        // cc: '--',
        city: 'no city',
        org: 'no org',
      };
    });
  }

  ngOnInit() {
  // http://localhost:4200/login?tcrunid=156694548&key=999
  // Utilizzare questa chiamata per l'auto login
  }

  login(username, password, rememberme) {
    if (!this.ipInfo) {
      return;
    }

    if (!username || !password) {
      this.errMsg = 'Insert user name and password';
      return;
    }

    this.requestInProgress = true;

    const params = {
      v_name: username,
      v_password: password,
      v_client_public_ip: this.ipInfo.ip,
      v_city: this.ipInfo.city,
      v_client_country: this.ipInfo.country,
      v_org: this.ipInfo.org,
      v_web_site_root_url: Utils.urlRoot.replace("/geoantsweb", ""),
    };
    // logConsole('operator__login', params);
    // return;
    this.apiService.chiamataPost('operator__login', params)
    // .map(response => response)
    .subscribe(data => {
      // const data = JSON.parse(data2);
      this.requestInProgress = false;

      // // logConsole(data);
      if (data.error) {
        Swal.fire({
          title: 'Login Error',
          text: data.message,
          icon: 'error',
          showClass: {
            backdrop: 'swal2-noanimation', // disable backdrop animation
            popup: '',                     // disable popup animation
            // icon: ''                       // disable icon animation
          },
        });          
        return;
      }
      if (data.err_code !== 0) {
        const rr = data.failure_reason;
        this.errMsg = rr;
        /* if (this.errMsg.toUpperCase().indexOf('CHANGE A PASSWORD') > -1) {
          this.messageLog = '';
          this.changePswForm = this.fb.group({
            oldPassword: ['', [Validators.required , Validators.minLength(3)]],
            newPassword1: ['', [Validators.required , Validators.minLength(3)]],
            newPassword2: ['', [Validators.required , Validators.minLength(3)]]
          }, {validator: Validators.compose([CustomValidators.passwordConfirm , CustomValidators.passwordMatch])});

          // this.user = data.OBJECT[0].object. username;
          // this.sessionId = data.OBJECT[0].object. sessionId;
          this.changePassword = true;
        } */
      } else {
        this.entraNelSito(data.cntx_id, username);
      }
    }, error => {
      // // logConsole(error);
      const err = JSON.parse(error._body);
      // // logConsole(err);
      this.requestInProgress = false;
      this.errMsg = 'ERROR: ' + err.message;
      // alert(error);
    });
  }

  entraNelSito(sessione, username) {
    this.sessionService.setRemember(true);
    this.sessionService.setUser(username);
    this.sessionService.setToken(sessione);
    this.sessionService.setLogged(true);

    let dove = '';
    const p = localStorage.getItem(username + '_last_page');
    let m = localStorage.getItem(username + '_last_form');
    let f = localStorage.getItem(username + '_last_full_screen');
    if (!f || f === undefined || f === 'undefined') { f = 'false'; }

    switch (p) {
      case 'Home Page':
        // dove = 'dashboard/app-empty-page';
        dove = 'HomePage';
        if (!m || m === null || m === undefined || m === '') {
          m = 'Empty';
        }
        break;
      case 'Mappe':
        // dove = 'dashboard/app-maps';
        dove = 'Mappe';
        if (!m || m === null || m === undefined || m === '') {
          m = 'Mappe';
        }
        break;
      case 'User Manager':
        // dove = 'dashboard/user-manager';
        dove = 'UserManager';
        if (!m || m === null || m === undefined || m === '') {
          m = 'Users';
        }
        break;
      case 'Fleet Manager':
        // dove = 'dashboard/fleet-manager';
        dove = 'FleetManager';
        if (!m || m === null || m === undefined || m === '') {
          m = 'TC';
        }
        break;
      case 'System':
        // dove = 'dashboard/system';
        dove = 'System';
        if (!m || m === null || m === undefined || m === '') {
          m = 'SC';
        }
        break;
      case 'Data Dictionaries':
        // dove = 'dashboard/data_dictionaries';
        dove = 'DataDictionaries';
        if (!m || m === null || m === undefined || m === '') {
          m = 'Antenna';
        }
        break;
      default:
        // dove = 'dashboard/app-empty-page';
        dove = 'HomePage';
        if (!m || m === null || m === undefined || m === '') {
          m = 'Empty';
        }
    }

    /* const addr = Utils.urlRoot;
    // logConsole(addr + dove + '/?sess=' + this.sessionService.getToken() +
                                                                '&gname=' + Utils.groupName +
                                                                '&uname=' + username +
                                                                '&form=' + m +
                                                                '&FS=' + f);
    const doveURL = addr + dove + '/?sess=' + this.sessionService.getToken() +
                                                                '&gname=' + Utils.groupName +
                                                                '&uname=' + username +
                                                                '&form=' + m +
                                                                '&FS=' + f; */


    dove = 'HomePage';
    m = 'Empty';

    const passaggio = '{ ' +
      '"sess": "' + this.sessionService.getToken() + '", ' +
      '"gname": "' + Utils.groupName + '", ' +
      '"uname": "' + username + '", ' +
      '"form": "' + m + '", ' +
      '"FS": "' + f.toString() + '"' +
      '}';
    const pass = Utils.cripta(passaggio);
    
    let addr = Utils.urlRoot;
    if (!addr.endsWith('/')) {
      addr += '/';
    }
    if (addr.indexOf('geoantsweb/') === -1) {
      addr += 'geoantsweb/';
    }

    /* let add = 'geoantsweb';

    switch (this.pre) {
      case "true":
        add = 'geoantsweb_pre'
        break;
      case "false":
        add = 'geoantsweb_prod'
        break;
      default:
        break;
    }

    if (addr.indexOf('geoantsweb') > -1 && add.indexOf(add) === -1) {
      addr = addr.replace('geoantsweb', add);
    }
    addr = addr.replace('_pre_pre', '_pre');
    addr = addr.replace('_prod_prod', '_prod'); */

    // logConsole(addr + dove + '/?par=' + pass); // sess=' + this.sessionService.getToken() +
                                                //                 '&gname=' + Utils.groupName +
                                                //                 '&uname=' + username +
                                                //                 '&form=' + m +
                                                //                 '&FS=' + f);
    const doveURL = addr + dove + '/?par=' + pass; // sess=' + this.sessionService.getToken() +
                                                    //             '&gname=' + Utils.groupName +
                                                    //             '&uname=' + username +
                                                    //             '&form=' + m +
                                                    //             '&FS=' + f;

    // alert(doveURL);
    if (dove !== 'NULL') {
      // window.location.href = doveURL;
      window.location.replace(doveURL)
    }
  }

  closeCP() {
    this.changePassword = false;
  }

  onSubmit() {
    // if (DashboardHeaderComponent.sPassword !== this.changePswForm.value.oldPassword) {
    //   this.messageLog = 'OLD Password is invalid';
    // } else {
      // // logConsole(this.changePswForm.value);
      // // logConsole(this.changePswForm.status);

      const operatorData: any = {
          'operatorId': this.user,
          'sessionID': this.sessionId,
          'newPassword': this.changePswForm.value.newPassword1,
          'oldPassword': this.changePswForm.value.oldPassword,
      };
      this.apiService.operatorSetPassword(operatorData)
        .subscribe(result => {
          this.messageLog = 'SAVED!';
          // this.modalService.hide(1);
          // this.router.navigate(['dashboard']);
          this.changePassword = false;
          this.errMsg = '';
      },
        error => {
          const errors = error;
          this.messageLog = 'ERROR: ' + errors;
        });
    // }
    }
  }

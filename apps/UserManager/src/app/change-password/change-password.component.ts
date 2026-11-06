import { logConsole } from '../console-log';
import { CustomValidators } from './validators/password-confirm.validator';
import { SessionService } from './../db/session.service';
import { ApiService } from './../db/api.service';
import { Component, TemplateRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})

export class ChangePasswordComponent {
  @Input() idUtente;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  modalRef: BsModalRef;

  changePswForm: FormGroup;
  messageLog = '';

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private apiService: ApiService,
    private sessionService: SessionService ) {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.createForm();
  }

  close() {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.modalService.hide();
    }, 500);
  }

  createForm() {
    this.messageLog = '';
    this.changePswForm = this.fb.group({
      oldPassword: ['', [Validators.required , Validators.minLength(3)]],
      newPassword1: ['', [Validators.required , Validators.minLength(3)]],
      newPassword2: ['', [Validators.required , Validators.minLength(3)]]
    }, {validator: Validators.compose([CustomValidators.passwordConfirm , CustomValidators.passwordMatch])});
  }

  onSubmit(f) {
    // if (DashboardHeaderComponent.sPassword !== this.changePswForm.value.oldPassword) {
    //   this.messageLog = 'OLD Password is invalid';
    // } else {
    // logConsole(this.changePswForm.value);
    // logConsole(this.changePswForm.status);


      /* const params = {
        v_name: username,
        v_password: password
      };
      // // logConsole('geo_lookup__sel 1', new Date().getTime());
      this.apiService.chiamataPost('operator__login', params)
      // .map(response => response)
      .subscribe(data => {
        // logConsole(data);
        if (data.v_failure_reason !== 'ok') {

        }
      }, error => {
        alert(error);
      }); */

      /* const operatorData: any = {
          operatorId: this.sessionService.getUser(),
          sessionID: this.sessionService.getToken(),
          newPassword: this.changePswForm.value.newPassword1,
          oldPassword: this.changePswForm.value.oldPassword,
      };

      this.apiService.operatorSetPassword(operatorData)
        .subscribe(result => {
          this.messageLog = 'SAVED!';
          this.modalService.hide(1);
        },
        error => {
          const errors = error;
          this.messageLog = 'ERROR: ' + errors;
        }); */

    const params = {
        v_cntx: this.sessionService.getToken(),
        v_id: this.idUtente,
        v_psw: this.changePswForm.value.newPassword1,
    };

    // logConsole(params);

    this.apiService.chiamataPost('operator__change_psw', params)
      // .map(response => response)
      .subscribe(data2 => {
        if (data2.err_code === 0) {
          this.messageLog = 'SAVED!';
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.modalService.hide();
          }, 100);
        } else {
          this.messageLog = data2.failure_reason;
        }
    }, error => {
      this.messageLog = 'ERROR: ' + error;
    });
    // }
  }
}

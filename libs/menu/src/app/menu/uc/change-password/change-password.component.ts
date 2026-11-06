import { CustomValidators } from './../validators/password-confirm.validator';
import { SessionService } from '../../../services/session.service';
import { ApiService } from '../../../services/api.service';
import { Component, TemplateRef, Input, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import UtilsInterna from '../../utilities.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})

export class ChangePasswordComponent implements OnDestroy {
  @Input() serverPostRest;
  @Input() PathIcone;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  modalRef: BsModalRef;

  changePswForm: FormGroup;
  messageLog = '';

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private apiService: ApiService ) {
  }

  ngOnDestroy(): void {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    this.createForm();
  }

  close() {
    // this.modalService.hide(1);

    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.modalService.hide()
    }, 100);
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
    UtilsInterna.scriveLog(this.changePswForm.value);
    UtilsInterna.scriveLog(this.changePswForm.status);
    UtilsInterna.scriveLog(UtilsInterna.sessionID);


      /* const params = {
        v_name: username,
        v_password: password
      };
      // UtilsInterna.scriveLog('geo_lookup__sel 1', new Date().getTime());
      this.apiService.chiamataPost('operator__login', params)
      // .map(response => response.json())
      .subscribe(data => {
        UtilsInterna.scriveLog(data);
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
    if (this.changePswForm.value.oldPassword === '') {
      this.messageLog = 'Please insert old password';
      return;
    }

    if (this.changePswForm.value.newPassword1 === '' || this.changePswForm.value.newPassword2 === '') {
      this.messageLog = 'Please insert password';
      return;
    }

    if (this.changePswForm.value.newPassword1 !== this.changePswForm.value.newPassword2) {
      this.messageLog = 'New password 1 not equal to new password 2';
      return;
    }

    const params = {
        v_cntx: UtilsInterna.sessionID,
        v_psw: this.changePswForm.value.newPassword1,
        v_psw_old: this.changePswForm.value.oldPassword,
    };

    UtilsInterna.scriveLog(params);
    // return;

    this.apiService.chiamataPost('operator__change_psw_my', JSON.stringify(params), this.serverPostRest)
      // .map(response => response)
      .subscribe(data2 => {
        // UtilsInterna.scriveLog(data2);
        const codrit = data2.err_code;
        if (+codrit === 0) {
          this.messageLog = 'SAVED!';
          const tm = setTimeout(() => {
            clearTimeout(tm);
            this.modalService.hide(1);
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

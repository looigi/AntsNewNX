import UtilsInterna from './../../utilities.component';
import { Component, TemplateRef, Input, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnChanges, OnDestroy {
  // @Input() data: any;
  @Input() userName: any;
  @Input() groupName: any;
  @Input() profileName: any;
  @Input() profileDescription: any;
  @Input() dbInfo: any;
  @Input() PathIcone;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  // public cUtilsInterna = UtilsInterna;

  userName2;
  groupName2;
  profileName2;
  profileDesc2;
  dbInfo2;

  modalRef: BsModalRef;

  profileForm: FormGroup;

  constructor(private modalService: BsModalService, private fb: FormBuilder) {
  }

  ngOnDestroy(): void {
    
  }

  ngOnChanges(r) {
    if (r.userName) {
      if (r.userName.currentValue) {
        this.userName2 = r.userName.currentValue;
      }
    }

    if (r.groupName) {
      if (r.groupName.currentValue) {
        this.groupName2 = r.groupName.currentValue;
      }
    }

    if (r.profileName) {
      if (r.profileName.currentValue) {
        this.profileName2 = r.profileName.currentValue;
      }
    }

    if (r.profileDescription) {
      if (r.profileDescription.currentValue) {
        this.profileDesc2 = r.profileDescription.currentValue;
      }
    }

    if (r.dbInfo) {
      if (r.dbInfo.currentValue) {
        this.dbInfo2 = r.dbInfo.currentValue;
      }
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    // UtilsInterna.scriveLog(this.data);

    this.createForm();
  }

  close() {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.modalService.hide();
    }, 100);
    // this.modalService.hide(1);
  }

  createForm() {
    this.profileForm = this.fb.group({
      name: this.userName2,
     // email: this.data.EMAIL,
      groupName: this.groupName2, // this.data.DataTable[0].GROUP_NAME,
      // description: this.data.DESCRIPTION,
      // mobile: this.data.MOBILE,
      profileName:  this.profileName2,
      profileDescription:  this.profileDesc2
      // clientPath: this.data.REPOSITORY_CLIENT_PATH
    });
    // UtilsInterna.scriveLog('Profile', this.userName);
  }

  onSubmit() {
    UtilsInterna.scriveLog(this.profileForm.value);
    this.modalService.hide(1);
  }
}

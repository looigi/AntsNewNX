import { logConsole } from '../../../console-log';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import UtilsInterna from './../../utilities.component';
import { Component, Input, OnDestroy, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-dialog',
    templateUrl: 'dialog-component.html',
})

export class DialogComponent implements OnDestroy {
  @Input() dataCompilazione;
  @Input() versione;
  @Input() statoServer;
  @Input() statoManutenzione;
  @Input() coloreStatoServer;
  @Input() platFormName;
  @Input() linkIcone;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  // public MenuComponent = MenuComponent;

  public ErrorMsg: string;
  private severity: string;
  private url;
  public title: string;
  public aboutMask: boolean;
  public ErrorMessageIsVisible: boolean;
  // public clientVersion: string;
  // public buildDate: string;
  public Utils = UtilsInterna;

  modalRef: BsModalRef;
  coloreSfondoAvviso = 'white';

  ngOnDestroy(): void {
    
  }
  
  constructor(
    private modalService: BsModalService
  ) { }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    // // logConsole(this.data);

    this.showErrorMessage('', '', 'About');
  }

  showErrorMessage(tit: string, msg: string, sev: string) {
    // // logConsole(tit, msg, sev);
    this.ErrorMsg = msg;
    this.title = tit;
    this.severity = sev;
    this.ErrorMessageIsVisible = true;

    if (this.severity === 'About') {
      this.aboutMask = true;
      // this.clientVersion = '4.2.0'; // '1.0 ' + environment.clientTypeVersion;
      // this.buildDate = '12/03/2021'; // ANTS_BUILD_DATE_PLACEHOLDER';
    } else {
      this.aboutMask = false;
    }
  }

  hideErrorMsg() {
      this.ErrorMessageIsVisible = false;
  }

  getTitleColor() {
    if (this.severity === 'Error') {
      return '#a00';
    } else {
      return '#0a0';
    }
  }

  close() {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.modalService.hide()
    }, 100);
    // this.modalService.hide(1);
  }
}

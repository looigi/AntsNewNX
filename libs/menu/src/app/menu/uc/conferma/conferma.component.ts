import { Component, Inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-conferma',
  templateUrl: './conferma.component.html',
})

export class ConfermaComponent {

  @Input() messaggio = '';

  @ViewChild('templateC', { static: true })
  template!: TemplateRef<any>;

  modalRef?: BsModalRef;

  title = 'GeoAnts';
  urlRoot = '';

  constructor(
    private modalService: BsModalService
  ) {}

  openModal(template: TemplateRef<any>, messaggio: string, urlRoot: string) {
    this.messaggio = messaggio;
    this.urlRoot = urlRoot;

    this.modalRef = this.modalService.show(template);
  }

  ok() {
    localStorage.clear();
    window.location.replace(this.urlRoot + 'login/');
    this.modalRef?.hide();
  }

  close() {
    this.modalRef?.hide();
  }
}
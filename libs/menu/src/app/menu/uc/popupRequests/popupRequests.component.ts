import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popup-requests',
  templateUrl: './popupRequests.component.html'
})

export class PopupRequestsComponent implements OnInit {
  static p: PopupRequestsComponent = null;

  constructor() {
  }

  ngOnInit() {
    PopupRequestsComponent.p = this;
  }
}

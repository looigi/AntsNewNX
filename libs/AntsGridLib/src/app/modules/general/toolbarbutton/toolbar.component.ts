import { logConsole } from '../console-log';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DisplayMode } from '@progress/kendo-angular-toolbar';

@Component({
  selector: 'toolbar-button',
  templateUrl: 'toolbar.component.html',
})

export class ToolBarButtonMioComponent implements OnInit, OnChanges {
  @Input() imageUrl;

  showText: DisplayMode = 'always';

  imgUrl;

  ngOnInit() {
  }

  ngOnChanges(r) {
    if (r.imageUrl) {
      // logConsole(r.imageUrl.currentValue);
      this.imgUrl = r.imageUrl.currentValue;
    }
  }

  clickFunction(e) {

  }
}

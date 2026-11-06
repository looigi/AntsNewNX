import { logConsole } from '../../../console-log';
import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
// import { timer } from 'rxjs/observable/timer';
// import 'rxjs/add/operator/take';

@Component({
  selector: 'app-contextmenu',
  templateUrl: './contextmenu.component.html',
  styleUrls: ['./contextmenu.component.css']
})
export class ContextmenuComponent implements OnInit {
  @Input() x = 0;
  @Input() y = 0;
  @Input() Testo = '';

  @Output() confermaClickEmit: EventEmitter<string> = new EventEmitter<string>();

  chiude = null;
  // subscribe;

  constructor() { }

  ngOnInit() {
    /* if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
    this.subscribe = timer(1000, 1000)
    .take(32000)
    .subscribe(() => {
      if (this.chiude === true) {
        this.subscribe.unsubscribe();
        this.clickOn1('-1');
      } else {
        if (this.chiude === null) {
          this.chiude = true;
        }
      }
    }); */

    const t = setInterval(() => {
      if (this.chiude === true) {
        clearInterval(t);
        this.clickOn1('-1');
      } else {
        if (this.chiude === null) {
          this.chiude = true;
        }
      }
    }, 1000);
  }

  clickOn1(e) {
    // // logConsole(e);
    this.confermaClickEmit.emit(e);
  }
}

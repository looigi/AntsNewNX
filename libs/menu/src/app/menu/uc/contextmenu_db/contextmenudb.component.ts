import { logConsole } from '../../../console-log';
import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
// import { timer } from 'rxjs/observable/timer';
// import 'rxjs/add/operator/take';

@Component({
  selector: 'app-contextmenudb',
  templateUrl: './contextmenudb.component.html',
  styleUrls: ['./contextmenudb.component.css']
})
export class ContextmenuDBComponent implements OnInit {
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
        this.clickOn1('-1;;');
      } else {
        if (this.chiude === null) {
          this.chiude = true;
        }
      }
    }); */

    const t = setInterval(() => {
      if (this.chiude === true) {
        clearInterval(t);
        this.clickOn1('-1;;');
      } else {
        if (this.chiude === null) {
          this.chiude = true;
        }
      }
    }, 1000);
  }

  clickOn1(e) {
    // logConsole(e + ';' + this.Testo);
    this.confermaClickEmit.emit(e + ';' + this.Testo);
  }
}

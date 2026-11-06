import { logConsole } from '../console-log';
import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutoResize]'
})
export class AutoResizeDirective implements AfterViewInit {

  constructor(private el: ElementRef<HTMLTextAreaElement>) {}

  ngAfterViewInit() {
    const t = setTimeout(() => {
        clearTimeout(t);

        this.resize();
    }, 10);
  }

  @HostListener('input')
  onInput() {
    this.resize();
  }

  private resize() {
    const textarea = this.el.nativeElement;

    textarea.style.height = 'auto';
    /* if (textarea.scrollHeight < 45) {
        textarea.style.height = `25px`;
    } else { */
        textarea.style.height = `${textarea.scrollHeight + 2}px`;
    // }

    // logConsole('Resize TA', textarea.scrollHeight, this.el.nativeElement.value);
  }
}
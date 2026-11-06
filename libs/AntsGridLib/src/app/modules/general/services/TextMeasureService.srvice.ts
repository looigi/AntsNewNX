import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextMeasureService {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d')!;
  }

  getTextWidth(text: string, font): number {
    this.context.font = font;
    return this.context.measureText(text + 'W').width + 5;
  }
}

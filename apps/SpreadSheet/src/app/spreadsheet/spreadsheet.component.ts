import { logConsole } from '../console-log';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";

@Component({
    standalone: false,
    templateUrl: 'spreadsheet.component.html',
    selector: 'spreadsheet-component',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./spreadsheet.style.css'],
    encapsulation: ViewEncapsulation.None
})

export class GeoSpreadSheetComponent implements OnInit, OnChanges { // , AfterViewInit {
  @Input() debug = false;
  @Input() data: any = [];

  @Output() sendData: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
  }

  clickExport(e: any) {
    e.preventDefault(); 

    // logConsole('E: ', e.workbook);
    this.sendData.emit(e.workbook);
  }
}


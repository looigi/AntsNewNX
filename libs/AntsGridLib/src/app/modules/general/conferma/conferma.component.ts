import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'app-conferma',
    templateUrl: 'conferma.component.html',
    styleUrls: ['./conferma.component.css']
})

export class ConfermaComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfermaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    const tm = setTimeout(() => {
      clearTimeout(tm);
      this.dialogRef.close();
    }, 100);
  }
}

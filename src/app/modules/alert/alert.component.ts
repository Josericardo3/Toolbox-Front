import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  constructor(
    private dialogRef: MatDialogRef<AlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }

  ngOnInit() {
    const element = document.getElementById('message');
    if (element) {
      element.textContent = this.data.message;
    }
  }
  closeDialog(opcion: number): void {
    this.dialogRef.close(opcion);
  }
}

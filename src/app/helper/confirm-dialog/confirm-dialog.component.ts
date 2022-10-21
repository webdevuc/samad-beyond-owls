import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  @Input() data: any;
  @Output() onConfirm = new EventEmitter<any>();
  @ViewChild('closebutton') closebutton: any;

  // constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

  onNoClick() {
    // this.dialogRef.close();
  }

  onYesClick() {
    this.onConfirm.emit(this.data);
    this.closebutton.nativeElement.click();
  }
}

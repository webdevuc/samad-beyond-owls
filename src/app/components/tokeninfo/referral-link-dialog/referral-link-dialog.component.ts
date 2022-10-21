import { ContractService } from './../../../services/contract.service';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalDataUpdateService } from 'src/app/services/local-data-update.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-referral-link-dialog',
  templateUrl: './referral-link-dialog.component.html',
  styleUrls: ['./referral-link-dialog.component.scss']
})
export class ReferralLinkDialogComponent implements OnInit {

  referralUrl: string;
  urlCopied = false;
    
  constructor(
    //public dialogRef: MatDialogRef<ReferralLinkDialogComponent>,
    private contractService: ContractService,
    private localDataUpdateService: LocalDataUpdateService,
    private _clipboardService: ClipboardService) { }

  ngOnInit() {
    this.localDataUpdateService.isDialogDataUpdated.subscribe((state) => {
      if (state) {
        this.generateReferralUrl();
      }
    });
  }

  generateReferralUrl() {
    const parsedUrl = new URL(window.location.href);
    const baseUrl = parsedUrl.origin;
    this.referralUrl = baseUrl + '?referralCode=' + this.contractService.accountNo;
    this.urlCopied = false;
  }

  copyUrl() {
    document.execCommand(this.referralUrl);
    //this._clipboardService.copy(this.referralUrl);
    this.urlCopied = true;
  }

  onClose() {
    //this.dialogRef.close();
    //this.urlCopied = false;
  }
  
}

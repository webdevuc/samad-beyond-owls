import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalDataUpdateService } from 'src/app/services/local-data-update.service';
import { ReferralLinkDialogComponent } from './referral-link-dialog/referral-link-dialog.component';

@Component({
  selector: 'app-tokeninfo',
  templateUrl: './tokeninfo.component.html',
  styleUrls: ['./tokeninfo.component.scss']
})
export class TokeninfoComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private localDataUpdateService: LocalDataUpdateService) { }

  ngOnInit(): void { }

  public navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }

  openReferralLinkDialog() {
    this.localDataUpdateService.forceUpdateDialogData(true);
    //const dialogRef = this.dialog.open(ReferralLinkDialogComponent);
  }
    
}

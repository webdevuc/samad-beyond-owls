import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-launch-timer-dialog',
  templateUrl: './launch-timer-dialog.component.html',
  styleUrls: ['./launch-timer-dialog.component.scss']
})
export class LaunchTimerDialogComponent implements OnInit {

  @Input() showLaunchTimerDialog: boolean;
  @ViewChild('closebutton') closebutton: any;
  launchOn = env.launchTimeStamp;
  timeLeft: string;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.launchTimer();
  }

  launchTimer() {
    this.timeLeft = this.sharedService.getTimeLeft(this.launchOn);
    const intervalId = setInterval(() => {
      this.timeLeft = this.sharedService.getTimeLeft(this.launchOn);
      if (this.timeLeft == 'EXPIRED') {
        this.timeLeft = 'Launched';
        this.closebutton?.nativeElement.click();
        clearInterval(intervalId);
      }
    }, 1000);
  }
}

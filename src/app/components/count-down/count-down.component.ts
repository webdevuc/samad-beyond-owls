import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit, OnDestroy {
  @Input() public mintDate: string;
  private subscription: Subscription;

  public dateNow = new Date();
  public dDay;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.dDay = new Date(this.mintDate);
    this.subscription = interval(1000)
      .subscribe(x => { this.getTimeDifference(); });

  }

  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute) ?? 0;
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute) ?? 0;
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay) ?? 0;
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay)) ?? 0;

    this.cdr.detectChanges();
  }

  public getReturnZero(value: number) {
    if (value <= 0) {
      value = 0
    }
    return value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

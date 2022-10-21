import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchTimerDialogComponent } from './launch-timer-dialog.component';

describe('LaunchTimerDialogComponent', () => {
  let component: LaunchTimerDialogComponent;
  let fixture: ComponentFixture<LaunchTimerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchTimerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchTimerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

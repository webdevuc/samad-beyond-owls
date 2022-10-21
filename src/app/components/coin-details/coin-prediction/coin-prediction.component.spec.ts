import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinPredictionComponent } from './coin-prediction.component';

describe('CoinPredictionComponent', () => {
  let component: CoinPredictionComponent;
  let fixture: ComponentFixture<CoinPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinPredictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

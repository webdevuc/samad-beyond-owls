import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinTechnicalAnalysisComponent } from './coin-technical-analysis.component';

describe('CoinTechnicalAnalysisComponent', () => {
  let component: CoinTechnicalAnalysisComponent;
  let fixture: ComponentFixture<CoinTechnicalAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinTechnicalAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinTechnicalAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

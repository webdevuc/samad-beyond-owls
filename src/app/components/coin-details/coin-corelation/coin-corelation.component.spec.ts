import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinCorelationComponent } from './coin-corelation.component';

describe('CoinCorelationComponent', () => {
  let component: CoinCorelationComponent;
  let fixture: ComponentFixture<CoinCorelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinCorelationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinCorelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

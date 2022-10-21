import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinTweetsComponent } from './coin-tweets.component';

describe('CoinTweetsComponent', () => {
  let component: CoinTweetsComponent;
  let fixture: ComponentFixture<CoinTweetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinTweetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinTweetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

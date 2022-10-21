import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenDataComponent } from './token-data.component';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

describe('TokenDataComponent', () => {
  let component: TokenDataComponent;
  let fixture: ComponentFixture<TokenDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

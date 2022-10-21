import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MataMaskButtonComponent } from './mata-mask-button.component';

describe('MataMaskButtonComponent', () => {
  let component: MataMaskButtonComponent;
  let fixture: ComponentFixture<MataMaskButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MataMaskButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MataMaskButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

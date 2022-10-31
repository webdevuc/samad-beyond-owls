import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwlStoryComponent } from './owl-story.component';

describe('OwlStoryComponent', () => {
  let component: OwlStoryComponent;
  let fixture: ComponentFixture<OwlStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwlStoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwlStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalFrameComponent } from './frame.component';

describe('ExternalFrameComponent', () => {
  let component: ExternalFrameComponent;
  let fixture: ComponentFixture<ExternalFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

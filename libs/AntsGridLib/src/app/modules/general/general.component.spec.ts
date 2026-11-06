import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntsGridLibraryComponent } from './general.component';

describe('GeneralComponent', () => {
  let component: AntsGridLibraryComponent;
  let fixture: ComponentFixture<AntsGridLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntsGridLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntsGridLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

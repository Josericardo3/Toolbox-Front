import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModalSuccessComponent } from './app-modal-success.component';

describe('AppModalSuccessComponent', () => {
  let component: AppModalSuccessComponent;
  let fixture: ComponentFixture<AppModalSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppModalSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppModalSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

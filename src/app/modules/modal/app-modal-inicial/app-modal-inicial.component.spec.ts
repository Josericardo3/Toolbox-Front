import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModalInicialComponent } from './app-modal-inicial.component';

describe('AppModalInicialComponent', () => {
  let component: AppModalInicialComponent;
  let fixture: ComponentFixture<AppModalInicialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppModalInicialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppModalInicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

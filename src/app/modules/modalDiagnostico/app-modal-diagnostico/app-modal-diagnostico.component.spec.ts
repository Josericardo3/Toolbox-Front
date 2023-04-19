import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModalDiagnosticoComponent } from './app-modal-diagnostico.component';

describe('AppModalDiagnosticoComponent', () => {
  let component: AppModalDiagnosticoComponent;
  let fixture: ComponentFixture<AppModalDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppModalDiagnosticoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppModalDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

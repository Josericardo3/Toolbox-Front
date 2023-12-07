import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDiagnosticoComponent } from './modal-diagnostico.component';

describe('ModalDiagnosticoComponent', () => {
  let component: ModalDiagnosticoComponent;
  let fixture: ComponentFixture<ModalDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDiagnosticoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

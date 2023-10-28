import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRegistroEvaluacionIndicadorComponent } from './formulario-registro-evaluacion-indicador.component';

describe('FormularioRegistroEvaluacionIndicadorComponent', () => {
  let component: FormularioRegistroEvaluacionIndicadorComponent;
  let fixture: ComponentFixture<FormularioRegistroEvaluacionIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioRegistroEvaluacionIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioRegistroEvaluacionIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

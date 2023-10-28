import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEvaluacionIndicadorComponent } from './formulario-evaluacion-indicador.component';

describe('FormularioEvaluacionIndicadorComponent', () => {
  let component: FormularioEvaluacionIndicadorComponent;
  let fixture: ComponentFixture<FormularioEvaluacionIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioEvaluacionIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioEvaluacionIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

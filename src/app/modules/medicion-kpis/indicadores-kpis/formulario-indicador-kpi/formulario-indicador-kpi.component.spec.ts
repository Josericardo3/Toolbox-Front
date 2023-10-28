import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioIndicadorKpiComponent } from './formulario-indicador-kpi.component';

describe('FormularioIndicadorKpiComponent', () => {
  let component: FormularioIndicadorKpiComponent;
  let fixture: ComponentFixture<FormularioIndicadorKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioIndicadorKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioIndicadorKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

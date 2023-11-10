import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioVariableKpiComponent } from './formulario-variable-kpi.component';

describe('FormularioVariableKpiComponent', () => {
  let component: FormularioVariableKpiComponent;
  let fixture: ComponentFixture<FormularioVariableKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioVariableKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioVariableKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioObjetivoKpiComponent } from './formulario-objetivo-kpi.component';

describe('FormularioObjetivoKpiComponent', () => {
  let component: FormularioObjetivoKpiComponent;
  let fixture: ComponentFixture<FormularioObjetivoKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioObjetivoKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioObjetivoKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPaqueteKpiComponent } from './formulario-paquete-kpi.component';

describe('FormularioPaqueteKpiComponent', () => {
  let component: FormularioPaqueteKpiComponent;
  let fixture: ComponentFixture<FormularioPaqueteKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioPaqueteKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPaqueteKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

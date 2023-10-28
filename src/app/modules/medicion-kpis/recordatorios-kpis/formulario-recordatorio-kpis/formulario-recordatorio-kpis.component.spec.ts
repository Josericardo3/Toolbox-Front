import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRecordatorioKpisComponent } from './formulario-recordatorio-kpis.component';

describe('FormularioRecordatorioKpisComponent', () => {
  let component: FormularioRecordatorioKpisComponent;
  let fixture: ComponentFixture<FormularioRecordatorioKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioRecordatorioKpisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioRecordatorioKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleRegistroEvaluacionIndicadorComponent } from './detalle-registro-evaluacion-indicador.component';

describe('DetalleRegistroEvaluacionIndicadorComponent', () => {
  let component: DetalleRegistroEvaluacionIndicadorComponent;
  let fixture: ComponentFixture<DetalleRegistroEvaluacionIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleRegistroEvaluacionIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleRegistroEvaluacionIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

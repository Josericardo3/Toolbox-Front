import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoIndicadoresEvaluacionComponent } from './grafico-indicadores-evaluacion.component';

describe('GraficoIndicadoresEvaluacionComponent', () => {
  let component: GraficoIndicadoresEvaluacionComponent;
  let fixture: ComponentFixture<GraficoIndicadoresEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoIndicadoresEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoIndicadoresEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

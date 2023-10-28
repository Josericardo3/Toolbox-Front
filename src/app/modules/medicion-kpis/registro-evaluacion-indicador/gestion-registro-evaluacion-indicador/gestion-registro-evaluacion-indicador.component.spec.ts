import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionRegistroEvaluacionIndicadorComponent } from './gestion-registro-evaluacion-indicador.component';

describe('GestionRegistroEvaluacionIndicadorComponent', () => {
  let component: GestionRegistroEvaluacionIndicadorComponent;
  let fixture: ComponentFixture<GestionRegistroEvaluacionIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionRegistroEvaluacionIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionRegistroEvaluacionIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

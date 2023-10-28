import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEvaluacionIndicadorComponent } from './gestion-evaluacion-indicador.component';

describe('GestionEvaluacionIndicadorComponent', () => {
  let component: GestionEvaluacionIndicadorComponent;
  let fixture: ComponentFixture<GestionEvaluacionIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionEvaluacionIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEvaluacionIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

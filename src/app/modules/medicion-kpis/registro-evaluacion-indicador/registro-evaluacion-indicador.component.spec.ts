import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEvaluacionIndicadorComponent } from './registro-evaluacion-indicador.component';

describe('RegistroEvaluacionIndicadorComponent', () => {
  let component: RegistroEvaluacionIndicadorComponent;
  let fixture: ComponentFixture<RegistroEvaluacionIndicadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroEvaluacionIndicadorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEvaluacionIndicadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionIndicadorKpiComponent } from './gestion-indicador-kpi.component';

describe('GestionIndicadorKpiComponent', () => {
  let component: GestionIndicadorKpiComponent;
  let fixture: ComponentFixture<GestionIndicadorKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionIndicadorKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionIndicadorKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

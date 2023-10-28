import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionObjetivoKpiComponent } from './gestion-objetivo-kpi.component';

describe('GestionObjetivoKpiComponent', () => {
  let component: GestionObjetivoKpiComponent;
  let fixture: ComponentFixture<GestionObjetivoKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionObjetivoKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionObjetivoKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

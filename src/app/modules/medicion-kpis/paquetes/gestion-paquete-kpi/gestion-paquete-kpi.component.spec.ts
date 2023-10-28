import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPaqueteKpiComponent } from './gestion-paquete-kpi.component';

describe('GestionPaqueteKpiComponent', () => {
  let component: GestionPaqueteKpiComponent;
  let fixture: ComponentFixture<GestionPaqueteKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPaqueteKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPaqueteKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

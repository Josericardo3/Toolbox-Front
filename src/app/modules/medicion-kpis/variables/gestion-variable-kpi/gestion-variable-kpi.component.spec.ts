import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionVariableKpiComponent } from './gestion-variable-kpi.component';

describe('GestionVariableKpiComponent', () => {
  let component: GestionVariableKpiComponent;
  let fixture: ComponentFixture<GestionVariableKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionVariableKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionVariableKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

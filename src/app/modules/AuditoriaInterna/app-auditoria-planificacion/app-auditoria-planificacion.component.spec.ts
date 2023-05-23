import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAuditoriaPlanificacionComponent } from './app-auditoria-planificacion.component';

describe('AppAuditoriaPlanificacionComponent', () => {
  let component: AppAuditoriaPlanificacionComponent;
  let fixture: ComponentFixture<AppAuditoriaPlanificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAuditoriaPlanificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppAuditoriaPlanificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

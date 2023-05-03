import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNuevoPlanDeAuditoriaComponent } from './app-nuevo-plan-de-auditoria.component';

describe('AppNuevoPlanDeAuditoriaComponent', () => {
  let component: AppNuevoPlanDeAuditoriaComponent;
  let fixture: ComponentFixture<AppNuevoPlanDeAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppNuevoPlanDeAuditoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppNuevoPlanDeAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

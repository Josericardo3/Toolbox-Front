import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppActividadesPlanificadasComponent } from './app-actividades-planificadas.component';

describe('AppActividadesPlanificadasComponent', () => {
  let component: AppActividadesPlanificadasComponent;
  let fixture: ComponentFixture<AppActividadesPlanificadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppActividadesPlanificadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppActividadesPlanificadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

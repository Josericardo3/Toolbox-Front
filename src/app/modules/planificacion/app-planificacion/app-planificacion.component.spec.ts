import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPlanificacionComponent } from './app-planificacion.component';

describe('AppPlanificacionComponent', () => {
  let component: AppPlanificacionComponent;
  let fixture: ComponentFixture<AppPlanificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppPlanificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPlanificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

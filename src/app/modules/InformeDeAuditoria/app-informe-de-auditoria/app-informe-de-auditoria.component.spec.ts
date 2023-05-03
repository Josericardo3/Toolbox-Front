import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInformeDeAuditoriaComponent } from './app-informe-de-auditoria.component';

describe('AppInformeDeAuditoriaComponent', () => {
  let component: AppInformeDeAuditoriaComponent;
  let fixture: ComponentFixture<AppInformeDeAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppInformeDeAuditoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppInformeDeAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

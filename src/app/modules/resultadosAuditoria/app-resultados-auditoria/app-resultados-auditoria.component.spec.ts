import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppResultadosAuditoriaComponent } from './app-resultados-auditoria.component';

describe('AppResultadosAuditoriaComponent', () => {
  let component: AppResultadosAuditoriaComponent;
  let fixture: ComponentFixture<AppResultadosAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppResultadosAuditoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppResultadosAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMenuAltaGerenciaComponent } from './app-menu-alta-gerencia.component';

describe('AppMenuAltaGerenciaComponent', () => {
  let component: AppMenuAltaGerenciaComponent;
  let fixture: ComponentFixture<AppMenuAltaGerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMenuAltaGerenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMenuAltaGerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

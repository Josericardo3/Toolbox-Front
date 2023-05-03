import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppListaDeVerificacionComponent } from './app-lista-de-verificacion.component';

describe('AppListaDeVerificacionComponent', () => {
  let component: AppListaDeVerificacionComponent;
  let fixture: ComponentFixture<AppListaDeVerificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppListaDeVerificacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppListaDeVerificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

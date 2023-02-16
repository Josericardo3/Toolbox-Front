import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGestionDeUsuariosComponent } from './app-gestion-de-usuarios.component';

describe('AppGestionDeUsuariosComponent', () => {
  let component: AppGestionDeUsuariosComponent;
  let fixture: ComponentFixture<AppGestionDeUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppGestionDeUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppGestionDeUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

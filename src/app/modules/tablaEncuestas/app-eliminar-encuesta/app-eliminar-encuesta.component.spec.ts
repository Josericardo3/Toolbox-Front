import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEliminarEncuestaComponent } from './app-eliminar-encuesta.component';

describe('AppEliminarEncuestaComponent', () => {
  let component: AppEliminarEncuestaComponent;
  let fixture: ComponentFixture<AppEliminarEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppEliminarEncuestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppEliminarEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

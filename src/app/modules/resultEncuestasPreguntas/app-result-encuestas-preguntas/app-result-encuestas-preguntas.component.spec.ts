import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppResultEncuestasPreguntasComponent } from './app-result-encuestas-preguntas.component';

describe('AppResultEncuestasPreguntasComponent', () => {
  let component: AppResultEncuestasPreguntasComponent;
  let fixture: ComponentFixture<AppResultEncuestasPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppResultEncuestasPreguntasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppResultEncuestasPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

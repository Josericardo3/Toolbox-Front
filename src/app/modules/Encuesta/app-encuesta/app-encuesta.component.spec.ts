import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEncuestaComponent } from './app-encuesta.component';

describe('AppEncuestaComponent', () => {
  let component: AppEncuestaComponent;
  let fixture: ComponentFixture<AppEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppEncuestaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

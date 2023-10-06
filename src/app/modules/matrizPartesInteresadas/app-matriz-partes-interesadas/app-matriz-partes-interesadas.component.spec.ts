import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMatrizPartesInteresadasComponent } from './app-matriz-partes-interesadas.component';

describe('AppMatrizPartesInteresadasComponent', () => {
  let component: AppMatrizPartesInteresadasComponent;
  let fixture: ComponentFixture<AppMatrizPartesInteresadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMatrizPartesInteresadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMatrizPartesInteresadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



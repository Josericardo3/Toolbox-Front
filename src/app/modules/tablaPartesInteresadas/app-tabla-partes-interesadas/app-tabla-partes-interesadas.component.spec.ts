import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTablaPartesInteresadasComponent } from './app-tabla-partes-interesadas.component';

describe('AppTablaPartesInteresadasComponent', () => {
  let component: AppTablaPartesInteresadasComponent;
  let fixture: ComponentFixture<AppTablaPartesInteresadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTablaPartesInteresadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTablaPartesInteresadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

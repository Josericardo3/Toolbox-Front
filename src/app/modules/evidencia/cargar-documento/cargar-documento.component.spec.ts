import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarDocumentoComponent } from './cargar-documento.component';

describe('CargarDocumentoComponent', () => {
  let component: CargarDocumentoComponent;
  let fixture: ComponentFixture<CargarDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargarDocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

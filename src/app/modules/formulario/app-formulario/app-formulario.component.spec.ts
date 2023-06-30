import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormularioComponent } from './app-formulario.component';

describe('AppFormularioComponent', () => {
  let component: AppFormularioComponent;
  let fixture: ComponentFixture<AppFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppFormularioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

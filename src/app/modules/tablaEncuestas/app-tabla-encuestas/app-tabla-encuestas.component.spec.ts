import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTablaEncuestasComponent } from './app-tabla-encuestas.component';

describe('AppTablaEncuestasComponent', () => {
  let component: AppTablaEncuestasComponent;
  let fixture: ComponentFixture<AppTablaEncuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTablaEncuestasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTablaEncuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

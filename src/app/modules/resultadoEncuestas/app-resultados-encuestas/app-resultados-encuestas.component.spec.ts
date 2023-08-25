import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppResultadosEncuestasComponent } from './app-resultados-encuestas.component';

describe('AppResultadosEncuestasComponent', () => {
  let component: AppResultadosEncuestasComponent;
  let fixture: ComponentFixture<AppResultadosEncuestasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppResultadosEncuestasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppResultadosEncuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

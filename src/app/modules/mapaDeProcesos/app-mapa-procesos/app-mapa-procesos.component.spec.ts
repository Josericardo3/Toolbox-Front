import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMapaProcesosComponent } from './app-mapa-procesos.component';

describe('AppMapaProcesosComponent', () => {
  let component: AppMapaProcesosComponent;
  let fixture: ComponentFixture<AppMapaProcesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMapaProcesosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMapaProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

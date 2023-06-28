import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHistorialNoticiasComponent } from './app-historial-noticias.component';

describe('AppHistorialNoticiasComponent', () => {
  let component: AppHistorialNoticiasComponent;
  let fixture: ComponentFixture<AppHistorialNoticiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppHistorialNoticiasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppHistorialNoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

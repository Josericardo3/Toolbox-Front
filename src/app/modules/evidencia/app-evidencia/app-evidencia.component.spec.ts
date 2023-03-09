import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEvidenciaComponent } from './app-evidencia.component';

describe('AppEvidenciaComponent', () => {
  let component: AppEvidenciaComponent;
  let fixture: ComponentFixture<AppEvidenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppEvidenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppEvidenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

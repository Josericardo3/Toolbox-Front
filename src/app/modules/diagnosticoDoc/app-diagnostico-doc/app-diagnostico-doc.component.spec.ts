import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDiagnosticoDocComponent } from './app-diagnostico-doc.component';

describe('AppDiagnosticoDocComponent', () => {
  let component: AppDiagnosticoDocComponent;
  let fixture: ComponentFixture<AppDiagnosticoDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDiagnosticoDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDiagnosticoDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

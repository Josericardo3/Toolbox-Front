import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppDiagnosticoComponent } from './app-diagnostico.component';

describe('AppDiagnosticoComponent', () => {
  let component: AppDiagnosticoComponent;
  let fixture: ComponentFixture<AppDiagnosticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDiagnosticoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

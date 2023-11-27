import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticoEtapasComponent } from './diagnostico-etapas.component';

describe('DiagnosticoEtapasComponent', () => {
  let component: DiagnosticoEtapasComponent;
  let fixture: ComponentFixture<DiagnosticoEtapasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagnosticoEtapasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagnosticoEtapasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EMatrizRequisitosLegalesComponent } from './e-matriz-requisitos-legales.component';

describe('EMatrizRequisitosLegalesComponent', () => {
  let component: EMatrizRequisitosLegalesComponent;
  let fixture: ComponentFixture<EMatrizRequisitosLegalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EMatrizRequisitosLegalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EMatrizRequisitosLegalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

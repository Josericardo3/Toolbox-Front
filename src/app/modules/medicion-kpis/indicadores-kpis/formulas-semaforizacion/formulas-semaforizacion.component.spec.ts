import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulasSemaforizacionComponent } from './formulas-semaforizacion.component';

describe('FormulasSemaforizacionComponent', () => {
  let component: FormulasSemaforizacionComponent;
  let fixture: ComponentFixture<FormulasSemaforizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulasSemaforizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulasSemaforizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

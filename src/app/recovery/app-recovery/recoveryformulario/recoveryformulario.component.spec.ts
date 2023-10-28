import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryFormularioComponent } from './recoveryformulario.component';

describe('RecoveryFormularioComponent', () => {
  let component: RecoveryFormularioComponent;
  let fixture: ComponentFixture<RecoveryFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryFormularioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

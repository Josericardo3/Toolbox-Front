import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppProcRequisitosLegalesComponent } from './app-proc-requisitos-legales.component';

describe('AppProcRequisitosLegalesComponent', () => {
  let component: AppProcRequisitosLegalesComponent;
  let fixture: ComponentFixture<AppProcRequisitosLegalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppProcRequisitosLegalesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppProcRequisitosLegalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

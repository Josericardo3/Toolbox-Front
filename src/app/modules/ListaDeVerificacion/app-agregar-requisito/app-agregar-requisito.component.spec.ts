import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAgregarRequisitoComponent } from './app-agregar-requisito.component';

describe('AppAgregarRequisitoComponent', () => {
  let component: AppAgregarRequisitoComponent;
  let fixture: ComponentFixture<AppAgregarRequisitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAgregarRequisitoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppAgregarRequisitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

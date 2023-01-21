import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCaracterizacionComponent } from './app-caracterizacion.component';

describe('AppCaracterizacionComponent', () => {
  let component: AppCaracterizacionComponent;
  let fixture: ComponentFixture<AppCaracterizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppCaracterizacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCaracterizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

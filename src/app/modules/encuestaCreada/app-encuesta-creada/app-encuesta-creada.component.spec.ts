import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEncuestaCreadaComponent } from './app-encuesta-creada.component';

describe('AppEncuestaCreadaComponent', () => {
  let component: AppEncuestaCreadaComponent;
  let fixture: ComponentFixture<AppEncuestaCreadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppEncuestaCreadaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppEncuestaCreadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

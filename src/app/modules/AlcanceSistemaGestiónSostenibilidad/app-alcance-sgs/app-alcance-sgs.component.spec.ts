import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAlcanceSGSComponent } from './app-alcance-sgs.component';

describe('AppAlcanceSGSComponent', () => {
  let component: AppAlcanceSGSComponent;
  let fixture: ComponentFixture<AppAlcanceSGSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAlcanceSGSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppAlcanceSGSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

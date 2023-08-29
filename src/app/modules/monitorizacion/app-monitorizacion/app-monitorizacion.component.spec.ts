import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMonitorizacionComponent } from './app-monitorizacion.component';

describe('AppMonitorizacionComponent', () => {
  let component: AppMonitorizacionComponent;
  let fixture: ComponentFixture<AppMonitorizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMonitorizacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMonitorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

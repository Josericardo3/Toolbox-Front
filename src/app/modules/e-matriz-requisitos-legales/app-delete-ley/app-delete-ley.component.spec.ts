import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDeleteLeyComponent } from './app-delete-ley.component';

describe('AppDeleteActivitiesComponent', () => {
  let component: AppDeleteLeyComponent;
  let fixture: ComponentFixture<AppDeleteLeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDeleteLeyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDeleteLeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
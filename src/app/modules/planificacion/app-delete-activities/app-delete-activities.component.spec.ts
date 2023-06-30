import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDeleteActivitiesComponent } from './app-delete-activities.component';

describe('AppDeleteActivitiesComponent', () => {
  let component: AppDeleteActivitiesComponent;
  let fixture: ComponentFixture<AppDeleteActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDeleteActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDeleteActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

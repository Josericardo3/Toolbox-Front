import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserSettingsComponent } from './app-user-settings.component';

describe('AppUserSettingsComponent', () => {
  let component: AppUserSettingsComponent;
  let fixture: ComponentFixture<AppUserSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppUserSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppUserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
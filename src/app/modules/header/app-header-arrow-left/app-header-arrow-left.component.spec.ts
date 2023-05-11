import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHeaderArrowLeftComponent } from './app-header-arrow-left.component';

describe('AppHeaderArrowLeftComponent', () => {
  let component: AppHeaderArrowLeftComponent;
  let fixture: ComponentFixture<AppHeaderArrowLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppHeaderArrowLeftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppHeaderArrowLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

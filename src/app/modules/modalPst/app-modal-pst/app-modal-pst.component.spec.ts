import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppModalPstComponent } from './app-modal-pst.component';

describe('AppModalPstComponent', () => {
  let component: AppModalPstComponent;
  let fixture: ComponentFixture<AppModalPstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppModalPstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppModalPstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

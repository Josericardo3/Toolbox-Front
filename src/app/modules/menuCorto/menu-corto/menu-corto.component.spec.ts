import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCortoComponent } from './menu-corto.component';

describe('MenuCortoComponent', () => {
  let component: MenuCortoComponent;
  let fixture: ComponentFixture<MenuCortoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuCortoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCortoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMedicionKpisComponent } from './menu-medicion-kpis.component';

describe('MenuMedicionKpisComponent', () => {
  let component: MenuMedicionKpisComponent;
  let fixture: ComponentFixture<MenuMedicionKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuMedicionKpisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuMedicionKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTarjetasComponent } from './app-tarjetas.component';

describe('AppTarjetasComponent', () => {
  let component: AppTarjetasComponent;
  let fixture: ComponentFixture<AppTarjetasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTarjetasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTarjetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppColaboradorComponent } from './app-colaborador.component';

describe('AppColaboradorComponent', () => {
  let component: AppColaboradorComponent;
  let fixture: ComponentFixture<AppColaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppColaboradorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

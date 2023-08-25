import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMapaColombiaComponent } from './app-mapa-colombia.component';

describe('AppMapaColombiaComponent', () => {
  let component: AppMapaColombiaComponent;
  let fixture: ComponentFixture<AppMapaColombiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMapaColombiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMapaColombiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

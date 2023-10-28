import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetivosKpisComponent } from './objetivos-kpis.component';

describe('ObjetivosKpisComponent', () => {
  let component: ObjetivosKpisComponent;
  let fixture: ComponentFixture<ObjetivosKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetivosKpisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjetivosKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

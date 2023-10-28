import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresKpisComponent } from './indicadores-kpis.component';

describe('IndicadoresKpisComponent', () => {
  let component: IndicadoresKpisComponent;
  let fixture: ComponentFixture<IndicadoresKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicadoresKpisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadoresKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

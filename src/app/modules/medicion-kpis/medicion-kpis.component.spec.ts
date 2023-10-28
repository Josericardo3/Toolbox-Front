import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicionKpisComponent } from './medicion-kpis.component';

describe('MedicionKpisComponent', () => {
  let component: MedicionKpisComponent;
  let fixture: ComponentFixture<MedicionKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicionKpisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicionKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

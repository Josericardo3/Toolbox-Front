import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramaProcesoComponent } from './diagrama-proceso.component';

describe('DiagramaProcesoComponent', () => {
  let component: DiagramaProcesoComponent;
  let fixture: ComponentFixture<DiagramaProcesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagramaProcesoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramaProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

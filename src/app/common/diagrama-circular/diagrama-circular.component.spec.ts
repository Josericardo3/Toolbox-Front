import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramaCircularComponent } from './diagrama-circular.component';

describe('DiagramaCircularComponent', () => {
  let component: DiagramaCircularComponent;
  let fixture: ComponentFixture<DiagramaCircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiagramaCircularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramaCircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

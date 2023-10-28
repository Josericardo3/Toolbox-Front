import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordatoriosKpisComponent } from './recordatorios-kpis.component';

describe('RecordatoriosKpisComponent', () => {
  let component: RecordatoriosKpisComponent;
  let fixture: ComponentFixture<RecordatoriosKpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordatoriosKpisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordatoriosKpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MejoraaContinuaComponent } from './mejoraa-continua.component';

describe('MejoraaContinuaComponent', () => {
  let component: MejoraaContinuaComponent;
  let fixture: ComponentFixture<MejoraaContinuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MejoraaContinuaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MejoraaContinuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPoliticaDesarrolloSostenibleComponent } from './app-politica-desarrollo-sostenible.component';

describe('AppPoliticaDesarrolloSostenibleComponent', () => {
  let component: AppPoliticaDesarrolloSostenibleComponent;
  let fixture: ComponentFixture<AppPoliticaDesarrolloSostenibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppPoliticaDesarrolloSostenibleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPoliticaDesarrolloSostenibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

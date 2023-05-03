import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMenuAuditoriaComponent } from './app-menu-auditoria.component';

describe('AppMenuAuditoriaComponent', () => {
  let component: AppMenuAuditoriaComponent;
  let fixture: ComponentFixture<AppMenuAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMenuAuditoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMenuAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

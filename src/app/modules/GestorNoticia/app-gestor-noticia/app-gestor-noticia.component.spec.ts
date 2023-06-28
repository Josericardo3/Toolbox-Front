import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppGestorNoticiaComponent } from './app-gestor-noticia.component';

describe('AppGestorNoticiaComponent', () => {
  let component: AppGestorNoticiaComponent;
  let fixture: ComponentFixture<AppGestorNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppGestorNoticiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppGestorNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

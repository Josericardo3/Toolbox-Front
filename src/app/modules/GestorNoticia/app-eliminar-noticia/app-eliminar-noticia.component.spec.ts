import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEliminarNoticiaComponent } from './app-eliminar-noticia.component';

describe('AppEliminarNoticiaComponent', () => {
  let component: AppEliminarNoticiaComponent;
  let fixture: ComponentFixture<AppEliminarNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppEliminarNoticiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppEliminarNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

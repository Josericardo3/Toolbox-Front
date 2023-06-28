import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNoticiaComponent } from './app-noticia.component';

describe('AppNoticiaComponent', () => {
  let component: AppNoticiaComponent;
  let fixture: ComponentFixture<AppNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppNoticiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

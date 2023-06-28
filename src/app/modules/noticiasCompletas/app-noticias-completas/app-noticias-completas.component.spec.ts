import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNoticiasCompletasComponent } from './app-noticias-completas.component';

describe('AppNoticiasCompletasComponent', () => {
  let component: AppNoticiasCompletasComponent;
  let fixture: ComponentFixture<AppNoticiasCompletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppNoticiasCompletasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppNoticiasCompletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

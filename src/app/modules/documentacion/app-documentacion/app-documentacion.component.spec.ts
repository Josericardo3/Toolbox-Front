import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDocumentacionComponent } from './app-documentacion.component';

describe('AppDocumentacionComponent', () => {
  let component: AppDocumentacionComponent;
  let fixture: ComponentFixture<AppDocumentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDocumentacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

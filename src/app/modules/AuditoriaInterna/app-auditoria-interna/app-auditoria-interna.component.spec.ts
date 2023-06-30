import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppAuditoriaInternaComponent } from './app-auditoria-interna.component';


describe('AppAuditoriaInternaComponent', () => {
  let component: AppAuditoriaInternaComponent;
  let fixture: ComponentFixture<AppAuditoriaInternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAuditoriaInternaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppAuditoriaInternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
